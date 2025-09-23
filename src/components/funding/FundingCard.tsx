import Image from 'next/image';
import testImg from '@/img/exampleImg.png';

function FundingCard() {
  return (
    <div>
      <Image src={testImg} alt={'cardImage'} width={300} height={300}></Image>
      <p>작가명</p>
      <p className="font-bold">펀딩이름</p>
      <div className="flex text-primary">
        <p>달성률</p>
        <p className="font-bold">98%</p>
        <p>D-19</p>
      </div>
    </div>
  );
}
export default FundingCard;
