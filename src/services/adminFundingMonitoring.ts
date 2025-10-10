const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

export type FundingStatus =
  | 'PENDING'
  | 'ONGOING'
  | 'FAILED'
  | 'SUCCESS'
  | 'DRAFT'
  | 'SCHEDULED'
  | 'ENDED'
  | string;

export type FundingSortField =
  | 'remainingDays'
  | 'achievementRate'
  | 'registeredAt'
  | 'startDate'
  | 'endDate'
  | 'participantCount'
  | 'targetAmount';

export type FundingOrder = 'ASC' | 'DESC';

export type AdminFundingListQuery = {
  page: number;
  size: number;
  keyword?: string;
  status?: FundingStatus;
  categoryId?: number;
  artistId?: number;
  minAchievement?: number;
  maxAchievement?: number;
  registeredFrom?: string;
  registeredTo?: string;
  dueFrom?: string;
  dueTo?: string;
  sort?: FundingSortField;
  order?: FundingOrder;
};

export type FundingPermissions = {
  canEditProfile?: boolean;
  canEditBusiness?: boolean;
  canEditPayout?: boolean;
};

export type FundingFlags = {
  goalAchieved?: boolean;
  dueSoon?: boolean;
  ended?: boolean;
};

export type FundingCategory = {
  id?: number;
  name?: string;
};

export type FundingSummary = {
  fundingId: number;
  title: string;
  status: string;
  statusText?: string;
  targetAmount?: number;
  currentAmount?: number;
  achievementRate?: number;
  participantCount?: number;
  startDate?: string;
  endDate?: string;
  registeredAt?: string;
  mainImage?: string;
  category?: FundingCategory;
  permissions?: FundingPermissions;
  flags?: FundingFlags;
};

export type AdminFundingListPayload = {
  content: FundingSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
};

export type AdminFundingListResponse = {
  resultCode?: string;
  msg?: string;
  data?: AdminFundingListPayload;
};

export async function fetchAdminFundingList(
  params: AdminFundingListQuery,
  options?: { accessToken?: string },
): Promise<AdminFundingListPayload> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  const response = await fetch(`${API_BASE}/api/dashboard/admin/fundings`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(params),
    cache: 'no-store',
  });

  const payload: AdminFundingListResponse & { message?: string } = await response
    .json()
    .catch(() => ({} as AdminFundingListResponse & { message?: string }));

  if (!response.ok) {
    const message = payload.msg || payload.message || '펀딩 목록을 불러오지 못했습니다.';
    throw new Error(message);
  }

  if (!payload.data) {
    return {
      content: [],
      page: params.page,
      size: params.size,
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    };
  }

  return payload.data;
}

