'use client'

import DefaultProfile from "@/assets/icon/defaultprofile.svg";
import Scrap from "@/assets/icon/scrap.svg";
import RightGreenArrow from "@/assets/icon/rightgreenarrow.svg";

export default function ArtistInfo() {
  return (
    <section>
      <h3 className="font-semibold py-12">작가 정보</h3>
      <div className="bg-[url('/artistbg2.svg')] max-w-[600px] mx-auto rounded-lg p-7 flex justify-between">
          <div className="w-2/3">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <p className="font-bold text-[18px]">작가명</p>
                <p>팔로워 수 <strong>1,000</strong> since <strong>2025.09.16</strong></p>
              </div>

              <div className="flex flex-col gap-4">
                <p className="font-bold text-[18px]">작가 소개</p>
                <p>작가 소개입니다. 작가 소개입니다. 작가 소개입니다. 작가 소개입니다. 작가 소개입니다. 작가 소개입니다.</p>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col items-center">
            <div className="my-3.5">
              <button type="button" className="absolute right-0 top-0"><Scrap /></button>
              <DefaultProfile />
            </div>
            <div className="flex justify-center items-center gap-2 bg-white border border-primary rounded-sm px-3.5 py-2">
              <button type="button" className="text-primary font-semibold">작가페이지</button>
              <RightGreenArrow />
            </div>
          </div>
        </div>
    </section>
  )
}