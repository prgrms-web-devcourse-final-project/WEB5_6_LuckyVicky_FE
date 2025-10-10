import { getTimezone } from '@/utils/timezone';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

export type AdminProductSortField =
  | 'registeredAt'
  | 'productName'
  | 'productId'
  | 'sellingStatus'
  | 'artistName';

export type AdminProductsOrder = 'ASC' | 'DESC';

export type AdminProductsQuery = {
  page: number;
  size: number;
  keyword?: string;
  sellingStatus?: string;
  categoryId?: number;
  artistId?: number;
  startDate?: string;
  endDate?: string;
  sort?: AdminProductSortField;
  order?: AdminProductsOrder;
};

export type AdminProductSummary = {
  productId?: number | string;
  productName?: string;
  artistName?: string;
  sellingStatus?: string;
  registeredAt?: string;
  [key: string]: unknown;
};

export type AdminProductsPayload = {
  content: AdminProductSummary[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
};

export type AdminProductsResponse = {
  resultCode?: string;
  msg?: string;
  data?: AdminProductsPayload;
  content?: AdminProductSummary[];
  totalElements?: number;
  totalPages?: number;
  page?: number;
  size?: number;
  [key: string]: unknown;
};

export async function fetchAdminProducts(
  params: AdminProductsQuery,
  options?: { accessToken?: string },
): Promise<AdminProductsResponse> {
  const timezone = getTimezone();
  const body = { ...params, timezone };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  const response = await fetch(`${API_BASE}/api/dashboard/admin/products`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const payload: AdminProductsResponse & { message?: string } = await response
    .json()
    .catch(() => ({} as AdminProductsResponse & { message?: string }));

  if (!response.ok) {
    const message = payload.msg || payload.message || '상품 목록을 불러오지 못했습니다.';
    throw new Error(message);
  }

  return payload;
}

