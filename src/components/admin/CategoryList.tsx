import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

type Category = {
  id: number;
  categoryName: string;
  parentId: number | null;
  subCategories: Category[];
};

export const dynamic = 'force-dynamic'; // 최신 반영 보장

// 카테고리 수정 Server Action
export async function updateCategoryAction(formData: FormData) {
  'use server';
  const id = Number(formData.get('id'));
  const categoryName = String((formData.get('categoryName') ?? '')).trim();
  const parentIdRaw = formData.get('parentId');
  const parentId =
    parentIdRaw === '' || parentIdRaw === null ? null : Number(parentIdRaw);

  if (!id || Number.isNaN(id)) throw new Error('잘못된 카테고리 ID입니다.');
  if (!categoryName) throw new Error('카테고리명을 입력하세요.');

  // 인증 헤더 (쿠키 → Bearer)
  const token = (await cookies()).get('accessToken')?.value;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/${id}`, {
    method: 'PUT',
    headers,
    cache: 'no-store',
    body: JSON.stringify({ categoryName }),
  });

  const ct = res.headers.get('content-type') ?? '';
  let json: { resultCode?: string; msg?: string } | null = null;
  if (ct.includes('application/json')) {
    try {
      json = await res.json();
    } catch {}
  }

  if (!res.ok) {
    const fallback =
      res.status === 400
        ? '동일한 이름의 카테고리가 이미 존재합니다.'
        : res.status === 404
        ? '수정할 카테고리를 찾을 수 없습니다.'
        : '카테고리 수정 실패';
    throw new Error(json?.msg || fallback);
  }
  if (json?.resultCode && json.resultCode !== '200') {
    throw new Error(json.msg || '카테고리 수정 실패');
  }

  // 목록 새로고침
  revalidatePath('/admin/products/categories', 'page');
}

// 카테고리 삭제 Server Action
export async function deleteCategoryAction(id: number) {
  'use server';
  if (!id || Number.isNaN(id)) throw new Error('잘못된 카테고리 ID입니다.');

  const token = (await cookies()).get('accessToken')?.value;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/${id}`,
    {
      method: 'DELETE',
      headers,
      cache: 'no-store',
    }
  );

  const ct = res.headers.get('content-type') ?? '';
  let json: { resultCode?: string; msg?: string } | null = null;

  if (ct.includes('application/json')) {
    try {
      json = await res.json();
    } catch {
    }
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

  if (json && json.resultCode && json.resultCode !== '200') {
    throw new Error(json.msg || '카테고리 삭제 실패');
  }

  // 목록 새로고침
  revalidatePath('/admin/products/categories', 'page');
}


async function fetchCategories(): Promise<Category[]> {
  const token = (await cookies()).get('accessToken')?.value;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

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

  const json = await res.json() as { resultCode: string; msg: string; data: Category[] | null };
  if (json.resultCode !== '200' || !json.data) {
    throw new Error(json.msg || '카테고리 조회 실패');
  }
  return json.data;
}

function Tree({ nodes }: { nodes: Category[] }) {
  if (!nodes?.length) return <p className="text-sm text-gray-600">아직 카테고리가 없습니다.</p>;
  return (
    <ul className="space-y-1">
      {nodes.map((n) => (
        <li key={n.id}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{n.id}</span>
              <span className="font-medium">{n.categoryName}</span>
            </div>
            <div className="flex items-center gap-2">
            {/* 수정 폼 */}
              <details className="group">
                <summary className="cursor-pointer rounded border px-2 py-1 text-xs hover:bg-gray-50 list-none">
                  수정
                </summary>
                <div className="mt-2 rounded border p-2">
                  <form action={updateCategoryAction} className="flex flex-wrap items-end gap-2">
                    <input type="hidden" name="id" value={n.id} />
                    <label className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-500">카테고리명</span>
                    <input
                      name="categoryName"
                      defaultValue={n.categoryName}
                      className="rounded border px-2 py-1 text-sm"
                      required
                    />
                  </label>
                  <button type="submit" className="rounded border px-3 py-1 text-xs font-medium hover:bg-gray-50">
                    저장
                  </button>
                </form>
                </div>
              </details>

            {/* 삭제 버튼 */}
            <form>
              <button
                className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                formAction={deleteCategoryAction.bind(null, n.id)}
              >
                삭제
              </button>
            </form>
          </div>
        </div>

          {!!n.subCategories?.length && (
            <div className="ms-4 border-l pl-4 mt-1">
              <Tree nodes={n.subCategories} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default async function CategoryList() {
  try {
    const data = await fetchCategories();
    return (
      <div>
        <div className="mb-2 text-xs text-gray-500">
          마지막 업데이트 : {new Date().toLocaleString()}
        </div>
        <Tree nodes={data} />
      </div>
    );
  } catch (e: any) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        카테고리 목록을 불러오지 못했습니다.
        <div className="mt-1 whitespace-pre-wrap text-xs opacity-80">{String(e?.message ?? e)}</div>
      </div>
    );
  }
}
