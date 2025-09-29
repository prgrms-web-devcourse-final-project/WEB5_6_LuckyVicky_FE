'use client'

import Star from "@/assets/icon/star.svg";
import LineStar from "@/assets/icon/linestar.svg";
import Heart from "@/assets/icon/heart.svg";
import DefaultProfile from "@/assets/icon/defaultprofile.svg";


export default function TextReviewCard({
  content,
  hashtags = ['#해시태그', '#해시태그', '#해시태그'],
  rating = 0,
}: {
  content:string;
  hashtags?:string[];
  rating:number;
}) {
  return (
    <>
    <article className="max-w-[1200px] mb-6">
      <div className="flex justify-between">
          <div className="flex items-center ">
            <DefaultProfile width={50} height={50} />
            <span className="mx-2.5 text-sm">사용자명</span>
            <div className="flex gap-1">
              {Array.from({length:5}).map((_,i) => (
                <button key={i}>
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

      <div className="pl-15 pr-5">
        <div className="my-4">
          <p>{content}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          {hashtags.map((t, i) => (
            <span key={i} className="bg-primary-40 rounded-2xl px-1.5 py-0.5">{t}</span>
          ))}
        </div>
      </div>
    </article>
    </>
    
  )
}