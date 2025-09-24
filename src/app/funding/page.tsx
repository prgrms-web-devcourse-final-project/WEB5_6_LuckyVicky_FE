import FundingCard from '@/components/funding/FundingCard';
import LeftArrow from '@/assets/icon/leftArrow.svg';
import RightArrow from '@/assets/icon/rightArrow.svg';
import Image from 'next/image';

function Funding() {
  const testBtnDesign =
    'border border-primary rounded-[10px] px-3 py-[5px] hover:cursor-pointer';

  return (
    <>
      <section className="w-full h-[300px] bg-primary">Hero Section</section>

      <div className="w-full grid grid-cols-[250px_1fr] gap-8">
        <aside className="bg-[#f6f4eb] px-[38px] py-[29px] ">
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-2">
            <h2 className="col-span-2 font-bold text-[18px]">진행 상황</h2>
            <input type="checkbox" />
            <p>진행 중</p>
            <input type="checkbox" />
            <p>종료</p>
            <h2 className="col-span-2 font-bold text-[18px] mt-4">가격대</h2>
            <input type="checkbox" />
            <p>10,000원 이하</p>
            <input type="checkbox" />
            <p>10,000~30,000원</p>
            <input type="checkbox" />
            <p>30,000원~50,000원</p>
            <input type="checkbox" />
            <p>50,000원 이상</p>
          </div>
        </aside>
        <main className="flex flex-col items-center">
          <ul className="flex gap-5 my-8">
            <button className={testBtnDesign}>스티커({})</button>
            <button className={testBtnDesign}>메모지({})</button>
            <button className={testBtnDesign}>노트({})</button>
            <button className={testBtnDesign}>액세서리({})</button>
            <button className={testBtnDesign}>디지털 문구({})</button>
          </ul>
          <p className="text-[32px] font-bold pb-6 w-full max-w-[calc(250px+4*200px+6*36px)] ml-[24px]">
            인기 펀딩
          </p>
          <div className="w-full max-w-[calc(250px+4*200px+6*36px)] ml-[24px] relative">
            <button className="absolute left-[-40px] top-1/2 transform -translate-y-1/2">
              <LeftArrow />
            </button>
            <div className="flex gap-6">
              {/* 데이터 불러온 뒤 map으로 뿌리기 */}
              <FundingCard />
              <FundingCard />
              <FundingCard />
              <FundingCard />
            </div>
            <button className="absolute right-[-40px] top-1/2 transform -translate-y-1/2">
              <RightArrow />
            </button>
          </div>
          <div className="bg-gray-200 h-[1px] w-[100%] max-w-[1400px] my-[40px]"></div>
          <div className="w-full max-w-[calc(250px+4*200px+6*36px)] ml-[24px]">
            <select name="정렬" id="sort" className="" defaultValue={'인기순'}>
              <option value="인기순">인기순</option>
              <option value="최신순">최신순</option>
              <option value="리뷰 많은순">리뷰 많은순</option>
              <option value="별점 높은순">별점 높은순</option>
            </select>
          </div>
          <div
            id="total-data"
            className="mt-[18px] mb-10 grid grid-cols-4 gap-6 w-full max-w-[calc(250px+4*200px+6*36px)] ml-[24px]"
          >
            {/* 모든 FundingCard 출력하기 */}
            <FundingCard />
            <FundingCard />
            <FundingCard />
            <FundingCard />
            <FundingCard />
            <FundingCard />
            <FundingCard />
            <FundingCard />
            <FundingCard />
          </div>
        </main>
      </div>
    </>
  );
}
export default Funding;
