'use client';
import { useToast } from '@/components/ToastProvider';
import { useRouter } from 'next/navigation';
import type { ButtonHTMLAttributes } from 'react';

export default function SignupButton({
className,
...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
const toast = useToast();
const router = useRouter();

return (
<button
{...props}
onClick={(e) => {
props.onClick?.(e);
if (e.defaultPrevented) return;
toast.success('회원가입이 완료되었습니다!', {
action: { label: '메인으로', onClick: () => router.push('/') },
duration: 3000,
});
}}
className={
'rounded bg-[var(--color-primary)] px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed ' +
(className ?? '')
}
>
회원가입
</button>
);
}