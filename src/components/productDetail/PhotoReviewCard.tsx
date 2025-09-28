'use client'


import Image from "next/image";
import Star from "@/assets/icon/star.svg";
import Heart from "@/assets/icon/heart.svg";
import DefaultProfile from "@/assets/icon/defaultprofile.svg";

export default function PhotoReviewCard() {
  return (
    <div className="grid grid-cols-4 gap-6">
      <article className="max-w-[300px] cursor-pointer">
      <div>
        <Image 
          src="/productexample1.svg"
          alt="리뷰 사진"
          width={300}
          height={360}
          className="rounded-2xl object-cover"
        />
      </div>

      <div className="py-4 flex justify-between">
          <div className="flex flex-wrap items-center">
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

      <div className="flex flex-wrap gap-2 text-sm">
        <span className="bg-primary-40 rounded-2xl px-1.5 py-0.5">#해시태그</span>
        <span className="bg-tertiary-40 rounded-2xl px-1.5 py-0.5">#해시태그</span>
        <span className="bg-primary-40 rounded-2xl px-1.5 py-0.5">#해시태그</span>
      </div>
      </article>
    </div>
    
  )
}