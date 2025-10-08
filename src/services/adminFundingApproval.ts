const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

export type AdminFundingAdminFundingApprovalResponse = {
  resultCode?: string;
  msg?: string;
  data?: unknown;
};

export async function approveFundingApplication(
  applicationId: string | number,
  options?: { accessToken?: string },
): Promise<AdminFundingApprovalResponse> {
  if (!applicationId && applicationId !== 0) {
    throw new Error('승인할 신청 ID가 없습니다.');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  const response = await fetch(
    `${API_BASE}/api/dashboard/admin/artist-applications/${applicationId}/approve`,
    {
      method: 'POST',
      credentials: 'include',
      headers,
    },
  );

  const payload: AdminFundingApprovalResponse & { message?: string } = await response
    .json()
    .catch(() => ({} as AdminFundingApprovalResponse & { message?: string }));

  if (!response.ok) {
    const message = payload.msg || payload.message || '펀딩 승인에 실패했습니다.';
    throw new Error(message);
  }

  return payload;
}

