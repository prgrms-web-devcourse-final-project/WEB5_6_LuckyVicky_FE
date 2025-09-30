'use client'

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
  onSort:(v:Sort ) => void;
}) {

  const [sort, setSort] = useState<Sort>('인기순');

  const change = (v:Sort) => {
    setSort(v);
    onSort(v);
  }

  return (
    <div>
      <div className="flex font-bold text-[30px] pb-8">
        <div className="bg-primary-20 px-2 mr-2">{query}</div>
        <span>에 대한 검색결과</span>
      </div>

      <div className="flex justify-between border border-primary px-[30px] py-3">
        <span>총 {total}개 상품</span>
        <div className="border border-primary">
          <select 
        value={sort}
        onChange={(e) => change(e.target.value as Sort)}
        className="focus:outline-none text-sm text-gray-500"
        >
          {SORTS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        </div>
      </div>
    </div>
  )
}