'use client';

import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const reset = useAuthStore((state) => state.reset);
  const router = useRouter();

  const logout = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`,
        {
          method: 'POST',
          credentials: 'include', 
        },
      );

      if (!res.ok) {
        const text = await res.text().catch(() => '로그아웃 실패');
        throw new Error(text);
      }
    } catch (error) {
      console.error('logout failed', error);
    } finally {
      reset();            
      router.replace('/'); 
    }
  };

  return { logout };
}