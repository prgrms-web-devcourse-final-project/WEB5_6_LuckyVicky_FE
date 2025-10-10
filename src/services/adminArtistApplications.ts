const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

export type ArtistApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type ArtistApplicationSummary = {
  applicationId: number;
  applicantId: string;
  artistName: string;
  fundingTitle: string;
  fundingSummary?: string;
  email?: string;
  phone?: string;
  businessNumber?: string;
  businessDocument?: string;
  commerceNumber?: string;
  commerceDocument?: string;
  appliedAt?: string;
};

export type ArtistApplication = {
  applicationId: number;
  applicantId: string;
  artistName: string;
  fundingTitle: string;
  fundingSummary: string;
  email: string;
  phone: string;
  businessNumber?: string;
  businessDocument?: string;
  commerceNumber?: string;
  commerceDocument?: string;
  appliedAt: string;
};

export type ArtistApplicationsResponse = {
  resultCode?: string;
  msg?: string;
  data?: {
    content: ArtistApplicationSummary[];
    totalElements?: number;
    totalPages?: number;
  };
};

type ArtistApplicationsParams = {
  status?: ArtistApplicationStatus;
  page?: number;
  size?: number;
};

export async function fetchArtistApplications(
  params: ArtistApplicationsParams = {},
  options?: { accessToken?: string },
): Promise<ArtistApplicationSummary[]> {
  const url = new URL(`${API_BASE}/api/dashboard/admin/artist-applications`);
  const page = Number.isFinite(params.page) ? Number(params.page) : 0;
  const size = Number.isFinite(params.size) ? Number(params.size) : 10;

  url.searchParams.set('page', String(Math.max(0, page)));
  url.searchParams.set('size', String(size > 0 ? size : 10));

  if (params.status) {
    url.searchParams.set('status', params.status);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
    headers,
    cache: 'no-store',
  });

  const payload: ArtistApplicationsResponse & { message?: string } = await response
    .json()
    .catch(() => ({} as ArtistApplicationsResponse & { message?: string }));

  if (!response.ok) {
    const message = payload.msg || payload.message || '펀딩 신청 목록을 불러오지 못했습니다.';
    throw new Error(message);
  }

  const data = payload.data;
  if (!data || !Array.isArray(data.content)) {
    return [];
  }

  return data.content;
}

export function normalizeArtistApplication(summary: ArtistApplicationSummary): ArtistApplication {
  const resolve = (value: unknown, fallback = '-') =>
    typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;

  const applicationId = Number(summary.applicationId);
  const applicantId = resolve(summary.applicantId, `application-${applicationId}`);

  return {
    applicationId: Number.isFinite(applicationId) ? applicationId : 0,
    applicantId,
    artistName: resolve(summary.artistName, applicantId),
    fundingTitle: resolve(summary.fundingTitle, '제목 미상'),
    fundingSummary: resolve(summary.fundingSummary),
    email: resolve(summary.email),
    phone: resolve(summary.phone),
    businessNumber: resolve(summary.businessNumber, undefined),
    businessDocument: resolve(summary.businessDocument, undefined),
    commerceNumber: resolve(summary.commerceNumber, undefined),
    commerceDocument: resolve(summary.commerceDocument, undefined),
    appliedAt: resolve(summary.appliedAt, new Date().toISOString().slice(0, 10)),
  };
}
