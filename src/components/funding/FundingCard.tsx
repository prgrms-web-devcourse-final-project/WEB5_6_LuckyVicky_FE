import Image from 'next/image';
import testImg from '@/img/exampleImg.png';

function FundingCard() {
  return (
    <div>
      <Image src={testImg} alt={'cardImage'} width={300} height={300}></Image>
      <p className="text-gray-200 font-semibold mt-3">작가명</p>
      <p className="font-semibold">펀딩이름</p>
      <div className="flex text-primary">
        <p className="mt-[2px] font-semibold">달성률</p>
        <p className="ml-[7px] font-extrabold text-xl">98%</p>
        <p className="ml-auto font-bold">D-19</p>
      </div>
    </div>
  );
}
export default FundingCard;
