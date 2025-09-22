'use client';
import { useState } from 'react';

const tabList = [
  { key: 'user', label: '일반 회원' },
  { key: 'artist', label: '작가' },
] as const;

export default function Loginpage() {
  const [tab, setTab] = useState<(typeof tabList)[number]['key']>('user');

  return (
    <main>
      {/* 탭 */}
      <div className="mb-6 flex gap-2">
        {tabList.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={[
              'rounded-t-lg px-4 py-2 text-sm font-medium',
              tab === t.key
                ? 'bg-[color-mix(in_srgb,green, white)] text-black'
                : 'bg-transparent text-gray-600 hover:text-black',
            ].join(' ')}
            aria-selected={tab === t.key}
          >
            {t.label}
          </button>
        ))}
      </div>

      <h1 className="mb-6 text-center text-2xl font-semibold">로그인</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* 이메일 로그인 */}
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <label className="block">
            <span className="mb-1 block text-sm text-gray-700">
              이메일(아이디)
            </span>
            <input
              type="email"
              className="w-full rounded border border-gray-200 px-3 py-2 outline-none focus:border-green"
              placeholder="email@example.com"
              required
            ></input>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-gray-700">비밀번호</span>
            <input
              type="password"
              className="w-full rounded border border-gray-200 px-3 py-2 outline-none focus:border-green"
              placeholder="********"
              required
            ></input>
          </label>

          <button
            className="w-full rounded bg-green px-4 py-2 font-semibold text-white hover:opacity-90"
            type="submit"
          >
            로그인
          </button>

          <div className="mt-2 flex flex-col justify-center text-sm text-gray-600">
            <a
              href="/(auth)/password"
              className="underline-offset-4 hover:underline"
            >
              비밀번호 찾기
            </a>
            <a
              href="/(auth)/signup"
              className="underline-offset-4 hover:underline"
            >
              아직 모리모리 회원이 아니신가요?
            </a>
            <a
              href="/(admin)/login"
              className="underline-offset-4 hover:underline"
            >
              관리자이신가요?
            </a>
          </div>
        </form>

        {/* 소셜 로그인 */}
        <div className="space-y-3">
          <p className="text-center text-sm text-gray-700">소셜 로그인</p>
          <button className="w-full rounded border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-10">
            구글 로그인
          </button>
          <button className="w-full rounded border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-10">
            네이버 로그인
          </button>
          <button className="w-full rounded border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-10">
            카카오 로그인
          </button>
        </div>
      </div>
    </main>
  );
}
