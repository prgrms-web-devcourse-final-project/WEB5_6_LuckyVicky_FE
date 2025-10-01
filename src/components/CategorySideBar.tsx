
'use client';

import Hamburger from "@/assets/icon/hamburger.svg";

const STYLE_OPTIONS = [
  '귀염', '감성', '심플', '동양풍',
  '음식', '도트', '개발자', '빈티지',
];

const PRICE_OPTIONS = [
  '1,000원 이하',
  '1,000원~2,000원',
  '2,000원~3,000원',
  '3,000원 이상',
];

const SHIPPING_OPTIONS = ['무료배송', '조건부 무료배송', '유료배송'];

function SquareCheckbox({ label }: { label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        className="
          w-[14px] h-[14px]
          border-2 border-gray-200 rounded-[2px] bg-white
          shrink-0
          transition-colors
        "
      />
      <span className="text-sm leading-4">{label}</span>
    </label>
  );
}

export default function CategorySideBar({title}: {title:string}) {
  return (
    <aside
      className="
        bg-primary-20
        text-black
        px-6 py-7
        w-[240px]
        min-h-screen
      "
    >
      {/* 상단 타이틀 + 햄버거 */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[28px] font-bold">{title}</h1>
        <button
          type="button"
          aria-label="필터 열기"
          className="grid gap-1.5"
        >
          <Hamburger />
        </button>
      </div>

      <div className="space-y-8">
        {/* 스타일 */}
        <section>
          <h2 className="font-bold text-[18px] mb-3">스타일</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {STYLE_OPTIONS.map((opt) => (
              <SquareCheckbox key={opt} label={opt} />
            ))}
          </div>
        </section>

        {/* 가격대 */}
        <section>
          <h2 className="font-bold text-[18px] mb-3">가격대</h2>
          <div className="space-y-2">
            {PRICE_OPTIONS.map((opt) => (
              <SquareCheckbox key={opt} label={opt} />
            ))}
          </div>
        </section>

        {/* 배송비 */}
        <section>
          <h2 className="font-bold text-[18px] mb-3">배송비</h2>
          <div className="space-y-2">
            {SHIPPING_OPTIONS.map((opt) => (
              <SquareCheckbox key={opt} label={opt} />
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
