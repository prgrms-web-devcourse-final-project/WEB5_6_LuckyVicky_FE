'use client'

import { allProducts } from "@/app/(site)/search/page";
import { useState } from "react";

const SORTS = ['인기순', '최신순', '낮은 가격순', '높은 가격순'] as const;
type Sort = typeof SORTS[number];

export default function ResultHeader({
  query,
  total,
  onSort,
}: {
  query:string;
  total:number;
  onSort:(v:Sort )=> void;
}) {

  const [sort, setSort] = useState<Sort>('인기순');
  const [keyword, setKeyword] = useState(query);

  // 소문자
  const filtered = allProducts.filter((item) => 
  item.title.toLowerCase().includes(keyword.toLowerCase()) ||
  item.brand.toLowerCase().includes(keyword.toLowerCase())
  );

  const change = (v:Sort) => {
    setSort(v);
    onSort(v);
  }

  return (
    <div>
      <div className="flex font-bold text-[32px] pb-8">
        <div className="bg-primary-20">{query}</div>
        <span>에 대한 검색결과</span>
      </div>

      <div className="flex border border-primary px-[30px] py-">
        <span>총 {total}개 상품</span>
        <select 
        value={sort}
        onChange={(e) => change(e.target.value as Sort)}
        >
          {SORTS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}