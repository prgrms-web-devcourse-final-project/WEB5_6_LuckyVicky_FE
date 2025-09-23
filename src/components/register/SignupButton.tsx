'use client';
import { useToast } from '@/components/ToastProvider';
import { useRouter } from 'next/navigation';

export default function SignupButton() {
  const toast = useToast();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        // …가입 처리 성공 후
        toast.success('회원가입이 완료되었습니다!', {
          action: {
            label: '메인으로',
            onClick: () => router.push('/'),
          },
          duration: 3000,
        });
      }}
      className="rounded bg-[var(--color-primary)] px-4 py-2 text-white"
    >
      회원가입
    </button>
  );
}
