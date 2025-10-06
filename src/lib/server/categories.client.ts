'use client';

import { Category, CategoryPayload, ApiResponse } from '@/types/category';

export async function fetchCategoriesClient(): Promise<Category[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'include',
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as ApiResponse<Category[] | null>;
  if (json.resultCode !== '200' || !json.data) throw new Error(json.msg || '카테고리 조회 실패');
  return json.data;
}

export async function createCategoryClient(payload: CategoryPayload): Promise<Category> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('카테고리 등록 실패');
  const json = (await res.json()) as ApiResponse<Category | null>;
  if (json.resultCode !== '200' || !json.data) throw new Error(json.msg || '카테고리 등록 실패');
  return json.data;
}

export async function updateCategoryClient(
  id: number,
  payload: { categoryName: string; parentId: number | null }
): Promise<Category> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(t || '카테고리 수정 실패');
  }
  const json = (await res.json()) as ApiResponse<Category | null>;
  if (json.resultCode !== '200' || !json.data) throw new Error(json.msg || '카테고리 수정 실패');
  return json.data;
}

export async function deleteCategoryClient(id: number): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/${id}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
    credentials: 'include',
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
  if (json && json.resultCode !== '200') throw new Error(json.msg || '카테고리 삭제 실패');
}
