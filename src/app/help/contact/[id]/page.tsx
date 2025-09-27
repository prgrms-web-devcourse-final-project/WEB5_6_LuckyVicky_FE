'use client';
import DefaultProfile from '@/assets/icon/default_profile.svg';
import Button from '@/components/Button';

export default function Page() {
  return (
    <>
      <div className="mt-[94px] mb-[30px] flex flex-col">
        <div className= "mb-[30px] flex justify-between items-center">
             <h3 className="text-2xl font-bold">문의하기</h3>
             <div className="flex gap-2">
                {/* 작성자에게만 노출 */}
                <Button variant="outline">수정</Button>
                <Button variant="outline">삭제</Button>
            </div>
        </div>
       
        <hr />
        <div className="w-full my-[13px] flex justify-between">
          <div className="flex items-center gap-[30px]">
            <span className="font-medium">카테고리</span>
            <span className="text-sm font-normal">
              문의 카테고리가 들어갑니다.
            </span>
          </div>

          <div className="flex items-center gap-[30px]">
            <div className="flex items-center gap-[30px]">
              <span className="font-medium">작성일자</span>
              <span className="text-sm font-normal">
                문의 작성일자가 들어갑니다.
              </span>
            </div>

            <div className="flex items-center gap-[30px]">
              <span className="font-medium">글번호</span>
              <span className="text-sm font-normal">12345</span>
            </div>
          </div>
        </div>
        <hr />
        <div className="my-[13px] items-center flex gap-[30px]">
          <div className="w-full flex justify-between gap-[30px]">
            <div className="flex items-center gap-[30px]">
              <span className="font-medium">제목</span>
              <span className="text-sm font-normal">
                문의 제목이 들어갑니다.
              </span>
            </div>
            <div className="flex items-center gap-[30px]">
              <span className="font-medium">닉네임</span>
              <span className="text-sm font-normal">
                문의 닉네임이 들어갑니다.
              </span>
            </div>
          </div>
        </div>
        <hr />
        <div className="my-[13px]  flex flex-col items-start gap-[20px]">
          <span className="font-medium">내용</span>
          <span className="text-sm font-normal">문의 내용이 들어갑니다.</span>
        </div>
        <hr />
      </div>

      <div className="mb-4 flex flex-col">
        <h3 className="mb-[10px] text-xl font-bold">댓글(댓글 수)</h3>
        <hr />
        <div className="flex justify-between items-center">
          <div className="my-[13px]  flex items-center gap-[20px]">
            <DefaultProfile />
            <span className="font-medium">답변자 닉네임</span>
            <span className="text-sm font-normal">답변 내용이 들어갑니다.</span>
          </div>
          <span className="font-normal text-sm">작성일자</span>
        </div>

        <hr />

        <div className="my-[10px]  flex flex-col">
        <div className="flex justify-between items-center gap-[20px] my-[13px]">
            <DefaultProfile />
            <span className="font-medium">현재 접속 유저 닉네임</span>
            <input className="flex-1 rounded border border-[var(--color-gray-200)] pr-0 pl-3 py-2" placeholder="댓글을 입력하세요."/>
        </div>
        <Button variant="primary" className="self-end">댓글 남기기</Button>
        </div>
        <hr />
        
      </div>
    </>
  );
}
