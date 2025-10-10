'use client';
import Button from '@/components/Button';

import { useState } from 'react';
import { useToast } from '@/components/ToastProvider';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';
import { useAuthStore } from '@/stores/authStore';


export default function AdminLoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

 

  return (
    <div className="relative px-[287px] py-12 md:px-10">
      <div className="relative z-10 rounded-2xl border border-[var(--color-primary)] bg-white px-[240px] py-12 pb-[150px] shadow-[8px_8px_0_0_var(--color-primary-40)]">
        <h1 className="mb-6 text-center text-[32px] font-bold">관리자 로그인</h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-1 ">
          <div className="space-y-3">
            <form
              className="flex flex-col space-y-5 justify-center"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!email || !password || submitting) return;
                try {
                  setSubmitting(true);
                  const selectedRole = 'ADMIN';
                  const response = await login({ email, password, selectedRole });
                  const data = response.data;
                  if (data) {
                    setAuth({
                      role: data.selectedRole,
                      availableRoles: data.availableRoles ?? [],
                      accessToken: data.accessToken,
                      refreshToken: data.refreshToken,
                      needsAdditionalInfo: Boolean(data.needsAdditionalInfo),
                      userProfile: {
                        email: data.email,
                        nickname: data.nickname ?? undefined,
                        phone: data.phone ?? undefined,
                      },
                    });
                    if (data.needsAdditionalInfo) {
                      toast.info('추가 정보 입력이 필요합니다.', { duration: 2000 });
                      return;
                    }
                  }
                  toast.success('로그인되었습니다!', { duration: 2000 });
                  router.push('/admin/main');
                } catch (err) {
                  const msg = err instanceof Error ? err.message : '로그인 실패';
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
                  placeholder="아이디"
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
            </form>
          </div>
       
        </div>
      </div>
    </div>
  );
}
