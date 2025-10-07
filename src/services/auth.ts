export type SignUpPayload = {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string; 
  phone: string; 
  privacyRequiredAgreed: true,
  marketingAgreed: true,
  agreementIp: string,
  passwordMatching: true,
  requiredTermsAgreed: true
};

export async function signup(payload: SignUpPayload): Promise<Record<string, unknown>> {
  let res: Response;
  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error((error as Error).message || "회원가입 요청에 실패했습니다.");
  }

  let data: unknown = null;
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch (error) {
      // JSON 파싱 실패 시 무시
    }
  }

  if (!res.ok) {
    let fallbackMessage = "회원가입 실패";
    if (!data) {
      fallbackMessage = await res.text().catch(() => fallbackMessage) || fallbackMessage;
    }
    const errorMessage =
      (typeof data === "object" && data && "message" in data && typeof (data as { message?: string }).message === "string"
        ? (data as { message: string }).message.trim()
        : undefined) ||
      (typeof data === "object" && data && "msg" in data && typeof (data as { msg?: string }).msg === "string"
        ? (data as { msg: string }).msg.trim()
        : undefined) ||
      fallbackMessage;

    const error = new Error(errorMessage);
    (error as Error & { status?: number }).status = res.status;
    throw error;
  }

  if (data === null) {
    return {};
  }

  return (data as Record<string, unknown>) ?? {};
}

// 로그인
export type LoginPayload = {
  email: string;
  password: string;
  selectedRole: 'USER' | 'ARTIST' | 'ADMIN';
};

export type LoginResponse = {
  resultCode?: string;
  msg?: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    userId: number;
    email: string;
    selectedRole: 'USER' | 'ARTIST' | 'ADMIN';
    availableRoles: string[];
    accessTokenExpiresIn: number;
  };
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data: LoginResponse & { message?: string } = await res
    .json()
    .catch(() => ({} as LoginResponse & { message?: string }));
  if (!res.ok) {
    throw new Error((data && (data.msg || data.message)) ?? '로그인 실패');
  }
  return data;
}

export type SessionResponse = {
  selectedRole?: string | null;
  role?: string | null;
  availableRoles?: unknown;
  roles?: unknown;
  authorities?: unknown;
  accessToken?: string;
  refreshToken?: string;
  [key: string]: unknown;
};

export async function fetchSession(): Promise<SessionResponse | null> {
  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

  try {
    const res = await fetch(`${baseUrl}/api/users/me`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    });

    if (res.status === 401 || res.status === 403 || res.status === 204) {
      return null;
    }
    if (!res.ok) {
      const text = await res.text().catch(() => '세션 정보를 불러오지 못했습니다.');
      throw new Error(text);
    }

    const payload = await res.json().catch(() => null);
    if (!payload || typeof payload !== 'object') return null;

    const sessionData =
      'data' in payload && payload.data && typeof payload.data === 'object'
        ? (payload as { data: SessionResponse }).data
        : (payload as SessionResponse);

    if (!sessionData || typeof sessionData !== 'object') {
      return null;
    }

    return sessionData;
  } catch (error) {
    console.error('fetchSession error', error);
    throw new Error('세션 정보를 불러오지 못했습니다.');
  }
}


// 중복확인
export type DuplicateResponse = {
  resultCode?: string;
  msg?: string;
  data?: {
    value: string;
    fieldType: 'email' | 'phone' | 'name' | string;
    isDuplicate: boolean;
    message?: string;
    isAvailable: boolean;
  };
};

async function postDuplicate(path: 'email' | 'phone' | 'name', value: string): Promise<DuplicateResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/duplicate/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ value }),
  });
  const data: DuplicateResponse = await res.json().catch(() => ({} as DuplicateResponse));
  if (!res.ok) {
    const message = data.msg || (data as unknown as { message?: string }).message || '중복 확인 실패';
    throw new Error(message);
  }
  return data;
}

export const checkDuplicateEmail = (email: string) => postDuplicate('email', email);
export const checkDuplicatePhone = (phone: string) => postDuplicate('phone', phone); // 숫자만
export const checkDuplicateName  = (name: string)  => postDuplicate('name', name);
