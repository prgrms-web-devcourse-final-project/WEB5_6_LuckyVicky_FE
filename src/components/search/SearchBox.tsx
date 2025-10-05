'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import Search from "@/assets/icon/search.svg";
import { categoryData, type Product } from '@/utils/categoryData';
import { fuzzyMatch } from '@/utils/search';

type Suggest = { id: string; label: string };


export default function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();

  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Suggest[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 검색창 비우기
  useEffect(() => {
    if(pathname !== '/search'){
      setValue('');
    }
  },[pathname]);

  // categoryData → 모든 상품 title
    const ALL_TITLES = useMemo(() => {
    const titles: { id: string; title: string }[] = [];
    for (const k in categoryData) {
      (categoryData[k].products as Product[]).forEach((p) =>
        titles.push({ id: p.id, title: p.title.trim() })
      );
    }
    const seen = new Set<string>();
    return titles.filter(({ title }) => (seen.has(title) ? false : (seen.add(title), true)));
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!value.trim()) {
      setItems([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      const q = value.trim().toLowerCase();

      const data = ALL_TITLES
        .filter(({title}) => fuzzyMatch(q,title))
        .slice(0, 8)
        .map(({id, title}) => ({ id, label: title }));

      setItems(data);
      setLoading(false);
      setOpen(data.length > 0);
      setActiveIdx(-1);
    }, 250);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value]);

  // 바깥 클릭 닫기
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const r = rootRef.current;
      if (r && !r.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown, true);
    return () => document.removeEventListener('pointerdown', onDown, true);
  }, [open]);

  const goSearch = (q: string) => {
    const keyword = q.trim();
    if (!keyword) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIdx >= 0 && items[activeIdx]) {
      goSearch(items[activeIdx].label);
    } else {
      goSearch(value);
    }
  };

  // 키보드
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || items.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((p) => (p + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((p) => (p - 1 + items.length) % items.length);
    } else if (e.key === 'Enter') {
      if (activeIdx >= 0) {
        e.preventDefault();
        goSearch(items[activeIdx].label);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  // 일치 : 하이라이트
  const highlight = (text: string) => {
    const q = value.trim();
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx < 0) return text;
    return (
      <>
        {text.slice(0, idx)}
        <b className="bg-primary-20">{text.slice(idx, idx + q.length)}</b>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div ref={rootRef} className="relative flex-1 min-w-[200px] max-w-[840px] mr-4 lg:mr-[175px]">
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => items.length > 0 && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="상품, 작가 검색"
          className="w-full border border-primary rounded-2xl py-2 pl-4 pr-10 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800"
        />
        <button
          type="submit"
          aria-label="검색"
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <Search />
        </button>
      </form>

      {/* 드롭다운 */}
      {open && (
        <div
          id="search-suggest"
          role="listbox"
          className="absolute z-[1000] mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
        >
          {loading && (
            <div className="px-4 py-3 text-sm text-gray-400">불러오는 중…</div>
          )}
          {!loading &&
            items.map((item, index) => (
              <button
                key={item.id}
                role="option"
                aria-selected={index === activeIdx}
                onMouseEnter={() => setActiveIdx(index)}
                onMouseDown={(e) => e.preventDefault()} // focus 유지
                onClick={() => goSearch(item.label)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm cursor-pointer ${
                  index === activeIdx ? 'bg-primary-20' : ''
                } hover:bg-primary-20`}
              >
                <span>{highlight(item.label)}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
