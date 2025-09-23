
import Image from "next/image";

export default function ProductCard() {
  return (
    <article>
        <div>
            <Image 
                src="/favicon.svg"
                alt="상품 이미지"
                width={277}
                height={277}
            />
        </div>

        <div className="mt-5">
            <div className="text-gray-300">브랜드명</div>
            <div className="text-[18px] mt-1.5">상품이름</div>
            <div className="flex items-center gap-4 mt-2.5">
                <span className="text-[18px] font-bold text-primary">nn%</span>
                <span className="text-[20px] font-bold">10,000</span>
                <span className="text-[18px] text-gray-300">20,000</span>
            

                <div className="flex items-center">
                    <span>
                        <Image 
                            src="/icons/star.svg"
                            alt="별점 아이콘"
                            width={16}
                            height={16}
                        />
                    </span>
                    <span className="ml-1">5.0</span>
                </div>
            </div>
        </div>
    </article>
  )
}