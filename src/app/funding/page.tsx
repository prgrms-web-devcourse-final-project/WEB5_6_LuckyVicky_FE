import FundingCard from '@/components/funding/FundingCard';

function Funding() {
  const testBtnDesign = 'border border-primary rounded-[10px] px-3 py-[5px]';

  return (
    <>
      <section className="w-full h-[300px] bg-primary">Hero Section</section>

      <div className="w-full grid grid-cols-[250px_1fr] gap-8">
        <aside className="bg-[#f6f4eb] px-[38px] py-[29px] ">
          <h2 className="font-bold text-[18px]">진행 상황</h2>
          <input type="checkbox" />
          <p>진행 중</p>
          <input type="checkbox" />
          <p>종료</p>
          <h2 className="font-bold text-[18px]">가격대</h2>
          <input type="checkbox" />
          <p>10,000원 이하</p>
          <input type="checkbox" />
          <p>10,000~30,000원</p>
          <input type="checkbox" />
          <p>30,000원~50,000원</p>
          <input type="checkbox" />
          <p>50,000원 이상</p>
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
          <div className="flex gap-6">
            <button>＜</button>
            <FundingCard />
            <FundingCard />
            <FundingCard />
            <FundingCard />
            <button>＞</button>
          </div>
          <div className="bg-gray-200 h-[1px] w-[60%] my-[40px]"></div>
        </main>
      </div>
    </>
  );
}
export default Funding;
