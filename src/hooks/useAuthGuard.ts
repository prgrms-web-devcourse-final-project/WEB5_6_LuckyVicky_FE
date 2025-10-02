'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

type Options = {
  allowedRoles?: Array<'USER' | 'ARTIST' | 'ADMIN'>;
  redirectTo?: string;
};

export function useAuthGuard({ allowedRoles, redirectTo = '/login' }: Options) {
  const router = useRouter();
  const { role } = useAuthStore();

  useEffect(() => {
    if (!allowedRoles) return;
    if (!role || !allowedRoles.includes(role)) {
      router.replace(redirectTo);
    }
  }, [allowedRoles, role, router, redirectTo]);
}
