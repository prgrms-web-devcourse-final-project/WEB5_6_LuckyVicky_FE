
import InfoTab from "@/components/productDetail/InfoTab";
import ProductOptions from "@/components/productDetail/ProductOptions";
import Image from "next/image";

export default function page() {
  return (
    <div className="pb-4">
    <main className="max-w-[1200px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <section>
        <Image 
          src="/productexample1.svg"
          alt="상품 이미지"
          width={500}
          height={550}
          className="w-[500px] h-[550px]"
        />
      </section>

      <section>
        <div className="text-gray-500 font-semibold">작가명(브랜드명)</div>

        <div className="flex items-center">
          <h1 className="text-2xl font-bold py-5 pr-4">상품명</h1>
          <div className="flex gap-1 items-center">
            <span>*****</span>
            <span className="font-bold text-[14px] text-gray-600">3.0</span>
            <span className="text-[12px] text-gray-400">(0)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-200">10,000원</span>
          <span className="text-2xl font-bold">8,000원</span>
        </div>

        <div className="flex items-center gap-9 py-10">
          <p>배송비</p>
          <p className="text-sm">
          3,000원 30,000원 이상 구매시 무료배송
          <br />
          (제주/도서산간 3.000원 추가)
          </p>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm">배송정보</span>
          <div className="flex items-center gap-1">
            <p>예약배송</p>
            <p className="font-bold text-tertiary">2025. 9. 26 이내 배송 시작</p>
          </div>
        </div>

        <ProductOptions />

        
        
      </section>
      
    </main>
    <InfoTab />
    </div>
  )
}