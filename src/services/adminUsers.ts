import { getTimezone } from '@/utils/timezone';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

export type AdminUserOrder = 'ASC' | 'DESC';

export type AdminUserSortField =
  | 'userId'
  | 'memberId'
  | 'nickname'
  | 'artistName'
  | 'commissionRate'
  | 'grade'
  | 'accountStatus'
  | 'joinedAt';

export type AdminUsersQuery = {
  page: number;
  size: number;
  keyword?: string;
  role?: string;
  accountStatus?: string;
  grade?: string;
  joinedStartDate?: string;
  joinedEndDate?: string;
  artistId?: number;
  sort?: AdminUserSortField;
  order?: AdminUserOrder;
};

export type AdminUserSummary = {
  userId?: number;
  memberId?: string;
  nickname?: string;
  artistName?: string;
  commissionRate?: number;
  grade?: string;
  accountStatus?: string;
  joinedAt?: string;
  [key: string]: unknown;
};

export type AdminUsersPayload = {
  content: AdminUserSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
};

export type AdminUsersResponse = {
  resultCode?: string;
  msg?: string;
  data?: AdminUsersPayload;
  [key: string]: unknown;
};

export async function fetchAdminUsers(
  params: AdminUsersQuery,
  options?: { accessToken?: string },
): Promise<AdminUsersResponse> {
  const timezone = getTimezone();
  const body = { ...params, timezone };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  const response = await fetch(`${API_BASE}/api/dashboard/admin/users`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const payload: AdminUsersResponse & { message?: string } = await response
    .json()
    .catch(() => ({} as AdminUsersResponse & { message?: string }));

  if (!response.ok) {
    const message = payload.msg || payload.message || '사용자 목록을 불러오지 못했습니다.';
    throw new Error(message);
  }

  return payload;
}

