'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import SocialRegistrationModal from '@/components/auth/SocialRegistrationModal';
import { fetchUserProfile, updateOAuthProfile } from '@/services/auth';
import { useToast } from '@/components/ToastProvider';

export default function SocialRegistrationWatcher() {
  const router = useRouter();
  const toast = useToast();
  const needsAdditionalInfo = useAuthStore((state) => state.needsAdditionalInfo);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const userProfile = useAuthStore((state) => state.userProfile);
  const setAuth = useAuthStore((state) => state.setAuth);
  const role = useAuthStore((state) => state.role);

  const [open, setOpen] = useState(false);
  const [defaults, setDefaults] = useState<{ email?: string; nickname?: string; phone?: string }>({});

  useEffect(() => {
    const prepare = async () => {
      if (!needsAdditionalInfo) {
        setOpen(false);
        return;
      }

      let profile = userProfile;
      if (!profile || !profile.email || !profile.nickname) {
        try {
          const remote = await fetchUserProfile();
          if (remote) {
            profile = {
              email: remote.email ?? profile?.email,
              nickname: remote.nickname ?? remote.name ?? profile?.nickname,
              phone: remote.phone ?? profile?.phone,
            };
            setAuth({ userProfile: profile });
          }
        } catch (error) {
          console.error('Failed to fetch user profile', error);
        }
      }

      setDefaults({
        email: profile?.email,
        nickname: profile?.nickname,
        phone: profile?.phone,
      });
      setOpen(true);
    };

    if (isHydrated && needsAdditionalInfo) {
      void prepare();
    } else if (isHydrated) {
      setOpen(false);
    }
  }, [isHydrated, needsAdditionalInfo, setAuth, userProfile]);

  const handleSubmit = async ({ email, nickname, phone }: { email: string; nickname: string; phone: string }) => {
    try {
      await updateOAuthProfile({ phone });

      setAuth({
        needsAdditionalInfo: false,
        userProfile: { email, nickname, phone },
      });

      toast.success('추가 정보가 저장되었습니다!', { duration: 2000 });
      setOpen(false);
      const nextRoute = role === 'ADMIN' ? '/admin/main' : '/';
      router.push(nextRoute);
    } catch (error) {
      const message = error instanceof Error ? error.message : '추가 정보 저장에 실패했습니다.';
      toast.error(message);
    }
  };

  const modalDefaults = useMemo(
    () => (defaults.email || defaults.nickname || defaults.phone ? defaults : userProfile ?? undefined),
    [defaults, userProfile],
  );

  if (!open) return null;

  return (
    <SocialRegistrationModal
      open
      defaultValues={modalDefaults}
      disableEmail
      disableNickname
      onClose={() => {}}
      onSubmit={handleSubmit}
    />
  );
}
