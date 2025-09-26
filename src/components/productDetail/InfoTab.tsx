'use client'

import { useState } from "react";

const TABS = ['상품 정보', '작가 정보', '상품 Q&A', '리뷰'];



export default function InfoTab() {
  const [activeTab, setActiveTab] = useState('상품 정보');


  return (
    <div className="mt-10 px-6">
      {/* 탭 버튼 */}
      <div className="flex max-w-[1200px] mx-auto border border-tertiary">
        {TABS.map((item) => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            className={`cursor-pointer flex-1 px-24 py-3 font-semibold text-tertiary ${activeTab === item ? 
              'text-white bg-tertiary' : ''
            }`}
            >
              {item}
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <div className="flex max-w-[1200px] mx-auto" >
        {activeTab === "상품 정보" && <div>상품정보</div>}
        {activeTab === "작가 정보" && <div>작가정보</div>}
        {activeTab === "상품 Q&A" && <div>상품Q&A</div>}
        {activeTab === "리뷰" && <div>리뷰</div>}
      </div>
    </div>
  )
}