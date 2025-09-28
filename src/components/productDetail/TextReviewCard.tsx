'use client'


import Image from "next/image";
import Star from "@/assets/icon/star.svg";
import Heart from "@/assets/icon/heart.svg";
import DefaultProfile from "@/assets/icon/defaultprofile.svg";


export default function TextReviewCard() {
  return (
    <>
    <article className="max-w-[1200px] mb-6">
      <div className="flex justify-between">
          <div className="flex items-center ">
            <DefaultProfile width={50} height={50} />
            <span className="mx-2.5 text-sm">사용자명</span>
            <div className="flex gap-1">
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
            </div>
          </div>
          <button className="cursor-pointer"><Heart /></button>
      </div>

      <div className="pl-15 pr-5">
        <div className="my-4">
          <p>일반리뷰입니다.일반리뷰입니다.일반리뷰입니다.일반리뷰입니다.일반리뷰입니다.일반리뷰입니다.일반리뷰입니다.일반리뷰입니다.일반리뷰입니다.</p>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          <span className="bg-primary-40 rounded-2xl px-1.5 py-0.5">#해시태그</span>
          <span className="bg-tertiary-40 rounded-2xl px-1.5 py-0.5">#해시태그</span>
          <span className="bg-primary-40 rounded-2xl px-1.5 py-0.5">#해시태그</span>
        </div>
      </div>
    </article>
    </>
    
  )
}