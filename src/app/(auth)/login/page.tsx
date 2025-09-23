'use client';
import Button from '@/components/Button';
import Image from 'next/image';

const socialButtonClass =
  'flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 transition-colors duration-150 hover:border-[var(--color-primary)]';

export default function LoginCard() {
  return (
    <div className="relative px-6 py-12 md:px-10">
      <div className="absolute left-6 top-6 flex -translate-y-1/2 gap-2 md:p-10 md:w-full ">
        <button
          type="button"
          className="lg:w-[180px] md:w-[180px] rounded-t-xl bg-[var(--color-primary-40)] px-5 py-3 text-[16px] font-semibold text-[var(--color-black)] transition-colors duration-150 hover:text-[var(--color-white)] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          일반 회원
        </button>
        <button
          type="button"
          className="lg:w-[180px] md:w-[180px] rounded-t-xl bg-[var(--color-primary-60)] px-5 py-3 text-[16px] font-semibold text-[var(--color-black)] transition-colors duration-150 hover:text-[var(--color-white)] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          작가 회원
        </button>
      </div>
      <div className="relative z-10 rounded-2xl border border-[var(--color-primary)] bg-white p-6 shadow-[8px_8px_0_0_var(--color-primary-40)]">
        <h1 className="mb-6 text-center text-[32px] font-bold">로그인</h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-center text-lg">이메일 로그인</h2>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <label className="block">
                <input
                  type="email"
                  className="w-full rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
                  placeholder="이메일(아이디)"
                  required
                />
              </label>
              <label className="block">
                <input
                  type="password"
                  className="w-full rounded border border-gray-200 px-3 py-2 outline-none transition-colors duration-150 focus:border-[var(--color-primary)]"
                  placeholder="비밀번호"
                  required
                />
              </label>

              <Button className="w-full">로그인</Button>

              <div className="mt-2 flex flex-col gap-[16px] justify-center text-center text-sm text-gray-600">
                <a
                  href="/password"
                  className="underline-offset-2 hover:underline"
                >
                  비밀번호 찾기
                </a>
                <a
                  href="/signup"
                  className="underline-offset-2 hover:underline"
                >
                  아직 모리모리 회원이 아니신가요?
                </a>
                <a
                  href="/(admin)/login"
                  className="underline-offset-2 hover:underline"
                >
                  관리자이신가요?
                </a>
              </div>
            </form>
          </div>
          <div className="space-y-3">
            <h2 className="text-center text-lg">소셜 로그인</h2>
            <button className={socialButtonClass}>
              <Image
                src="/icons/google.png"
                alt="Google"
                width={20}
                height={20}
              />
              <span>구글 로그인</span>
            </button>
            <button className={socialButtonClass}>
              <Image
                src="/icons/naver.svg"
                alt="Naver"
                width={20}
                height={20}
              />
              <span>네이버 로그인</span>
            </button>
            <button className={socialButtonClass}>
              <Image
                src="/icons/kakao.png"
                alt="Kakao"
                width={20}
                height={20}
              />
              <span>카카오 로그인</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
