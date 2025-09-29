'use client'


import Image from "next/image";
import Star from "@/assets/icon/star.svg";
import LineStar from "@/assets/icon/linestar.svg";
import Heart from "@/assets/icon/heart.svg";
import DefaultProfile from "@/assets/icon/defaultprofile.svg";

export default function PhotoReviewCard({
  image,
  hashtags = ['#해시태그', '#해시태그', '#해시태그'],
  rating = 0,
  onClick,
}: {
  image:string;
  content:string;
  hashtags?:string[];
  rating:number;
  onClick:() => void;
}) {
  return (
      <article className="max-w-[300px] cursor-pointer" onClick={onClick}>
      <div>
        <Image 
          src={image}
          alt="리뷰 사진"
          width={300}
          height={360}
          className="rounded-2xl"
        />
      </div>

      <div className="py-4 flex justify-between">
          <div className="flex flex-wrap items-center">
            <DefaultProfile width={50} height={50} />
            <span className="mx-2.5 text-sm">사용자명</span>
            <div className="flex gap-1">
              {Array.from({length:5}).map((_,i) => (
                <button>
                  {i < rating ? (
                    <Star />
                  ) : (
                    <LineStar />
                  )}
                </button>
              ))}
            </div>
          </div>
          <button className="cursor-pointer"><Heart /></button>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {hashtags.map((t, i) => (
            <span key={i} className="bg-primary-20 rounded-2xl px-1.5 py-0.5">{t}</span>
          ))}
      </div>
      </article>
    
  )
}