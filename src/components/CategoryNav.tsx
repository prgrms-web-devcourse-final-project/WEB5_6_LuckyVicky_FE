
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// slug 기반 카테고리
const categoryItems = [
  { slug: 'funding', label: '펀딩' },
  { slug: 'sticker', label: '스티커' },
  { slug: 'memo', label: '메모지' },
  { slug: 'note', label: '노트' },
  { slug: 'accessory', label: '액세서리' },
  { slug: 'etc', label: '기타 문구류' },
  { slug: 'digital', label: '디지털 문구' },
];

// slug 아닌 카테고리 (작가숲)
const forestItems = [
  { href: '/forest', label: '작가숲'},
]

export default function CategoryNav() {
  const pathname = usePathname();
  return (
    <nav className="border-t border-b border-slate-200">
      <ul className="mx-auto max-w-[1200px] flex gap-6 px-5 py-3 text-[14px]">
        {/* 카테고리 */}
        {categoryItems.map(item => (
          <li key={item.slug}>
            <Link
              href={`/category/${item.slug}`}
              className={`hover:text-emerald-700 ${
                pathname === `/category/${item.slug}` ? 'text-emerald-700 font-bold border-b-2 border-emerald-700' : 'text-slate-700'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}

        <span className="text-slate-400">|</span>

        {/* 작가숲 */}
        {forestItems.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`hover:text-amber-900 ${
                pathname === item.href ? 'text-amber-900 font-bold' : 'text-amber-900'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
