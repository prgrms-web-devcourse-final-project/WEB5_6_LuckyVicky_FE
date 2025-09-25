'use client';
import { useToast } from '@/components/ToastProvider';
import { useRouter } from 'next/navigation';
import type { ButtonHTMLAttributes, MouseEventHandler } from 'react';

type Props = {
  canSubmit?: boolean; // 모든 입력 완료 여부
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function SignupButton({
canSubmit = false,
className,
onClick,
...props
}: Props) {
const toast = useToast();
const router = useRouter();

const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
  onClick?.(e);
  if (e.defaultPrevented) return;
  if(!canSubmit) return; // 미완료면 토스트 안뜸

  toast.success('회원가입이 완료되었습니다!', {
    action: { label: '메인으로', onClick: () => router.push('/') },
    duration: 3000,
  });
};

return (
<button
{...props}
onClick={handleClick}
aria-disabled={!canSubmit}
className={
  'rounded bg-[var(--color-primary)] px-4 py-2 text-white' +
  (!canSubmit ? 'opacity-50 cursor-not-allowed' : '') +
  (className ?? '')
}
>
회원가입
</button>
);
}