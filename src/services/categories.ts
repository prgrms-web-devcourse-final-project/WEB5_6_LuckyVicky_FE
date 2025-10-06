
export type CategoryPayload = {
  categoryName: string;
  parentId: number | null;
};

export type Category = {
  id: number;
  categoryName: string;
  subCategories: Category[];
};

type ApiResponse<T> = {
  resultCode: string;
  msg: string;
  data: T;
};

// 카테고리 등록
export async function createCategory(payload: CategoryPayload): Promise<Category> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('카테고리 등록 실패');

  const json = (await res.json()) as ApiResponse<Category | null>;
  if (json.resultCode !== '200' || !json.data) {
    throw new Error(json.msg || '카테고리 등록 실패');
  }
  return json.data;
}

// 전체 카테고리 조회
export async function getAllCategories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`, 
    {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('카테고리 조회 실패');
  }

  const data = await res.json();
  return data;
}

// 전체 카테고리 조회 - 상품등록폼 드롭다운(상/하위 카테고리)
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