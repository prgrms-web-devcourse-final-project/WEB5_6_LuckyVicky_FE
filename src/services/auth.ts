export type SignUpPayload = {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string; 
  phone: string; 
  privacyRequiredAgreed: true,
  marketingAgreed: true,
  agreementIp: "string",
  passwordMatching: true,
  requiredTermsAgreed: true
};

export async function signup(payload: SignUpPayload) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((data && (data.message || data.msg)) ?? "회원가입 실패");
  }
  return data;
}

// 로그인
export type LoginPayload = {
  email: string;
  password: string;
  selectedRole: 'USER' | 'ARTIST';
};

export type LoginResponse = {
  resultCode?: string;
  msg?: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    userId: number;
    email: string;
    selectedRole: 'USER' | 'ARTIST';
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