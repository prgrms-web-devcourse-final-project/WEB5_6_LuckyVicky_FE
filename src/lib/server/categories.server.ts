import 'server-only';
import { cookies } from 'next/headers';
import { Category, CategoryPayload, ApiResponse } from '@/types/category';

async function authHeadersFromCookies(init?: HeadersInit): Promise<HeadersInit> {
  const token = (await cookies()).get('accessToken')?.value;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(init as Record<string, string>),
  };

  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function fetchCategoriesServer(): Promise<Category[]> {
  const headers = await authHeadersFromCookies();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`, {
    method: 'GET',
    headers,
    cache: 'no-store',
  });

  const loc = res.headers.get('location');
  if (res.status >= 300 && res.status < 400) {
    throw new Error(`302 redirected to "${loc}" (인증/세션 문제 가능)`);
  }
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${t.slice(0, 200)}`);
  }

  const json = (await res.json()) as ApiResponse<Category[] | null>;
  if (json.resultCode !== '200' || !json.data) {
    throw new Error(json.msg || '카테고리 조회 실패');
  }
  return json.data;
}

export async function createCategoryServer(payload: CategoryPayload): Promise<Category> {
  const headers = await authHeadersFromCookies({ 'Content-Type': 'application/json' });
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`, {
    method: 'POST',
    headers,
    cache: 'no-store',
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('카테고리 등록 실패');

  const json = (await res.json()) as ApiResponse<Category | null>;
  if (json.resultCode !== '200' || !json.data) {
    throw new Error(json.msg || '카테고리 등록 실패');
  }
  return json.data;
}

export async function updateCategoryServer(
  id: number,
  payload: { categoryName: string; parentId: number | null }
): Promise<Category> {
  const headers = await authHeadersFromCookies({ 'Content-Type': 'application/json' });
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/${id}`, {
    method: 'PUT',
    headers,
    cache: 'no-store',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(t || '카테고리 수정 실패');
  }

  const json = (await res.json()) as ApiResponse<Category | null>;
  if (json.resultCode !== '200' || !json.data) {
    throw new Error(json.msg || '카테고리 수정 실패');
  }
  return json.data;
}

export async function deleteCategoryServer(id: number): Promise<void> {
  const headers = await authHeadersFromCookies();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/${id}`, {
    method: 'DELETE',
    headers,
    cache: 'no-store',
  });

  let json: ApiResponse<null> | null = null;
  const ct = res.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) {
    try { json = (await res.json()) as ApiResponse<null>; } catch {}
  }

  if (!res.ok) {
    const fallback =
      res.status === 400
        ? '하위 카테고리 또는 상품이 있어 삭제할 수 없습니다.'
        : res.status === 404
        ? '삭제할 카테고리를 찾을 수 없습니다.'
        : '카테고리 삭제 실패';
    throw new Error(json?.msg || fallback);
  }

  if (json && json.resultCode !== '200') {
    throw new Error(json.msg || '카테고리 삭제 실패');
  }
}
