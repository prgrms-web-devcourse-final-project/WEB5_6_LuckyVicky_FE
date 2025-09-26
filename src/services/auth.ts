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
    // 백엔드에서 message 또는 msg 키로 보낼 수 있어 둘 다 대응
    throw new Error((data && (data.message || data.msg)) ?? "회원가입 실패");
  }
  return data;
}

// Login
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
