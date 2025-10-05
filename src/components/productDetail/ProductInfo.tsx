'use client'

import Image from "next/image";

type Spec = {label:string, value:string};

const SPECS: Spec[] = [
  { label: "품명 및 모델명", value: "1194 everybody run!" },
  { label: "법령 의한 인증, 허가 확인사항", value: "KC 인증" },
  { label: "제조국 또는 원산지", value: "한국" },
  { label: "제조자", value: "(주) 제이알인터내셔널에이지" },
  { label: "재질", value: "pvc" },
  { label: "사이즈", value: "9.8x19(cm)(cm)(cm)" },
  { label: "A/S 책임자/전화번호", value: "(주) 제이알인터내셔널에이지 / 02-591-4262" },
  { label: "사업자 등록번호", value: "201-86-41291" },
  { label: "대표자명", value: "김태봉" },
  { label: "운영자연락처", value: "jr@jrinter.kr" },
  { label: "주소", value: "(04585) 서울특별시 중구 다산로42다길 3층 (신당동) 제이알빌딩" },
  { label: "통신판매업신고번호", value: "2018-서울중구-1617" },
];

export default function ProductInfo() {
  return (
    <section>
      <h3 className="font-semibold py-12">상품 정보</h3>
      <div className="flex flex-col justify-center items-center gap-10">
          <Image src="/productexample1.svg" alt="상세 이미지 1" width={600} height={360} />
          <Image src="/productexample2.svg" alt="상세 이미지 2" width={600} height={360} />
          <Image src="/productexample1.svg" alt="상세 이미지 1" width={600} height={360} />
      </div>

        <div className="flex items-center pt-12 pb-3">
          <h4 className="font-semibold mr-6">상품 필수 정보</h4>
          <p className="text-gray-400 text-sm">전자상거래 등에서의 상품정보 제공 고시에 따라 작성되었습니다.</p>
        </div>

        <div className="bg-gray-50 p-3">
          <dl className="grid grid-cols-2 gap-y-1">
            {SPECS.map((item) => (
              <div key={item.label} className="flex gap-2 text-gray-500 text-sm">
                <dt className="font-semibold text-gray-600">{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

    </section>
  )
}