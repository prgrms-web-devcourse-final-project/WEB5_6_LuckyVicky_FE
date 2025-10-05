'use client';
import Button from '@/components/Button';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/components/ToastProvider';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';
import googleIcon from '@/assets/icon/google.png';
import NaverIcon from '@/assets/icon/naver.svg';
import kakaoIcon from '@/assets/icon/kakao.png';
import { useAuthStore, type Role } from '@/stores/authStore';

const socialButtonClass =
  'flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 px-4 py-2 transition-colors duration-150 hover:border-[var(--color-primary)]';
const socialIconWrapper = 'flex h-6 w-6 items-center justify-center';

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'
).replace(/\/+$/, '');

const SOCIAL_LOGIN_URLS = {
  google: `${API_BASE_URL}/oauth2/authorization/google`,
  kakao: `${API_BASE_URL}/oauth2/authorization/kakao`,
  naver: `${API_BASE_URL}/oauth2/authorization/naver`,
} as const;

type SocialProvider = keyof typeof SOCIAL_LOGIN_URLS;

const SOCIAL_LABELS: Record<SocialProvider, string> = {
  google: '구글 로그인',
  naver: '네이버 로그인',
  kakao: '카카오 로그인',
};

const SOCIAL_PROVIDER_ORDER: SocialProvider[] = ['google', 'naver', 'kakao'];

export default function LoginCard() {
  const [selected, setSelected] = useState<'normal' | 'artist'>('normal');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const selectedRole = selected === 'normal' ? 'USER' : 'ARTIST';
  const toast = useToast();
  const router = useRouter();

  const setAuth = useAuthStore((state) => state.setAuth);

  const baseTab =
    'lg:w-[180px] md:w-[180px] rounded-t-xl px-5 py-3 text-[16px] font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]';

  const selectedTab = 'bg-[var(--color-primary)] text-[var(--color-white)]';
  const unselectedTab =
    'bg-[var(--color-primary-40)] text-[var(--color-black)] hover:text-[var(--color-white)]';

  return (
    <div className="relative px-6 py-12 md:px-10">
      <div className="absolute left-0 top-6 flex -translate-y-1/2 gap-2 md:p-10 md:w-full ">
        <button
          type="button"
          className={`${baseTab} ${selected === 'normal' ? selectedTab : unselectedTab}`}
          onClick={() => setSelected('normal')}
          aria-pressed={selected === 'normal'}
        >
          일반 회원
        </button>
        <button
          type="button"
          className={`${baseTab} ${selected === 'artist' ? selectedTab : unselectedTab}`}
          onClick={() => setSelected('artist')}
          aria-pressed={selected === 'artist'}
        >
          작가 회원
        </button>
      </div>
      <div className="relative z-10 rounded-2xl rounded-tl-none border border-[var(--color-primary)] bg-white p-6 shadow-[8px_8px_0_0_var(--color-primary-40)]">
        <h1 className="mb-6 text-center text-[32px] font-bold">로그인</h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-center text-lg">이메일 로그인</h2>
            <form
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!email || !password || submitting) return;
                try {
                  setSubmitting(true);
                  const response = await login({
                    email,
                    password,
                    selectedRole,
                  });
                  const data = response.data;
                  if (data) {
                    setAuth({
                      role: data.selectedRole ?? null,
                      availableRoles: (data.availableRoles ?? []) as Role[],
                      accessToken: data.accessToken,
                      refreshToken: data.refreshToken,
                    });
                  }
                  toast.success('로그인되었습니다!', { duration: 2000 });
                  router.push('/');
                } catch (err) {
                  const msg =
                    err instanceof Error ? err.message : '로그인 실패';
                  toast.error(msg);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <label className="block">
                <input
                  type="email"
                  className="w-full rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
                  placeholder="이메일(아이디)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <input
                  type="password"
                  className="w-full rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              <Button className="w-full" disabled={submitting}>
                {submitting ? '로그인 중…' : '로그인'}
              </Button>

              <div className="mt-2 flex gap-[16px] justify-center text-center text-sm text-gray-600">
                <Link
                  href="/password"
                  className="underline-offset-2 hover:underline after:content-['|'] after:pl-4 after:text-[var(--color-gray-200)]"
                >
                  비밀번호 찾기
                </Link>

                <Link
                  href="/register"
                  className="underline-offset-2 hover:underline "
                >
                  회원가입
                </Link>
              </div>
            </form>
          </div>
          <div className="space-y-3">
            <h2 className="text-center text-lg">소셜 로그인</h2>
            {SOCIAL_PROVIDER_ORDER.map((typedProvider) => {
              const handleSocialLogin = () => {
                if (typeof window === 'undefined') return;
                window.location.href = SOCIAL_LOGIN_URLS[typedProvider];
              };

              return (
                <button
                  key={typedProvider}
                  type="button"
                  className={socialButtonClass}
                  onClick={handleSocialLogin}
                >
                  <span className={socialIconWrapper}>
                    {typedProvider === 'google' && (
                      <Image
                        src={googleIcon}
                        alt="Google"
                        width={20}
                        height={20}
                      />
                    )}
                    {typedProvider === 'naver' && (
                      <NaverIcon className="h-full w-full" aria-hidden />
                    )}
                    {typedProvider === 'kakao' && (
                      <Image
                        src={kakaoIcon}
                        alt="Kakao"
                        width={20}
                        height={20}
                      />
                    )}
                  </span>
                  <span>{SOCIAL_LABELS[typedProvider]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
