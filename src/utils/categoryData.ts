

export const categoryData = {
    funding: {
        name:'펀딩',
        products: [
            {id:'funding-1', title:'펀딩 1', img:"/logo.svg" },
            {id:'funding-2', title:'펀딩 2', img:"/logo.svg" },
        ],
    },
    sticker: {
    name: "스티커",
    products: [
      { id: "sticker-1", title: "스티커 상품 1", img: "/logo.svg" },
      { id: "sticker-2", title: "스티커 상품 2", img: "/logo.svg" },
    ],
  },
  memo: {
    name: "메모지",
    products: [
      { id: "memo-1", title: "메모지 상품 1", img: "/logo.svg" },
      { id: "memo-2", title: "메모지 상품 2", img: "/logo.svg" },
    ],
  },
  note: {
    name: "노트",
    products: [
      { id: "note-1", title: "노트 상품 1", img: "/logo.svg" },
      { id: "note-2", title: "노트 상품 2", img: "/logo.svg" },
    ],
  },
  accessory: {
    name: "액세서리",
    products: [
      { id: "acc-1", title: "액세서리 1", img: "/logo.svg" },
      { id: "acc-2", title: "액세서리 2", img: "/logo.svg" },
    ],
  },
  etc: {
    name: "기타 문구류",
    products: [
      { id: "etc-1", title: "기타 문구 1", img: "/logo.svg" },
      { id: "etc-2", title: "기타 문구 2", img: "/logo.svg" },
    ],
  },
  digital: {
    name: "디지털 문구",
    products: [
      { id: "digital-1", title: "디지털 문구 1", img: "/logo.svg" },
      { id: "digital-2", title: "디지털 문구 2", img: "/logo.svg" },
    ],
  },
}

export type CategorySlug = keyof typeof categoryData;