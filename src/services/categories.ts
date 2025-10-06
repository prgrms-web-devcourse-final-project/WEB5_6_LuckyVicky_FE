
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

// 카테고리 삭제
export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/${id}`,
    {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    }
  );

  // JSON 본문이 있으면 읽고, 없어도 통과
  let json: ApiResponse<null> | null = null;
  const ct = res.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) {
    try {
      json = (await res.json()) as ApiResponse<null>;
    } catch {
    }
  }

  // HTTP 에러일 때 메시지 폴백
  if (!res.ok) {
    const fallback =
      res.status === 400
        ? '하위 카테고리 또는 상품이 있어 삭제할 수 없습니다.'
        : res.status === 404
        ? '삭제할 카테고리를 찾을 수 없습니다.'
        : '카테고리 삭제 실패';
    throw new Error(json?.msg || fallback);
  }

  // 비즈니스 코드 확인
  if (json && json.resultCode !== '200') {
    throw new Error(json.msg || '카테고리 삭제 실패');
  }
}

// 카테고리 수정
export async function updateCategory(
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
    // HTTP 에러 폴백
    const t = await res.text().catch(() => '');
    throw new Error(t || '카테고리 수정 실패');
  }

  const json = (await res.json()) as ApiResponse<Category | null>;
  if (json.resultCode !== '200' || !json.data) {
    throw new Error(json.msg || '카테고리 수정 실패');
  }
  return json.data;
}

