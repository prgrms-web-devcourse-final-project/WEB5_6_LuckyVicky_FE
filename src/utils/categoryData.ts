// 상품 기본 타입
export type Product = {
  id: string;
  title: string;
  img: string;
  brand: string;
  discount: string;
  price: string;
  originalPrice: string;
  rating: string;
  createdAt:string;
};

// 버튼 카테고리 타입
export type SubCategory = {
  id: string;
  label: string;
};

// 네비게이션 바 타입 
export type Category = {
  name: string;
  products: Product[];
  subCategories?: SubCategory[];
};

// 전체 카테고리 데이터
export const categoryData: Record<string, Category> = {
  funding: {
    name: "펀딩",
    products: [
      {
        id: "funding-1",
        title: "펀딩 1",
        img: "/favicon.svg",
        brand: "브랜드A",
        discount: "20%",
        price: "8,000",
        originalPrice: "10,000",
        rating: "4.7",
        createdAt: "2025-09-24",
      },
      {
        id: "funding-2",
        title: "펀딩 2",
        img: "/favicon.svg",
        brand: "브랜드B",
        discount: "10%",
        price: "18,000",
        originalPrice: "20,000",
        rating: "4.5",
        createdAt: "2025-09-23",
      },
    ],
  },

  sticker: {
    name: "스티커",
    subCategories: [
      { id: "sticker1", label: "인쇄소스티커 (999)" },
      { id: "sticker2", label: "씰스티커 (999)" },
      { id: "sticker3", label: "조각스티커 (99)" },
      { id: "sticker4", label: "스티커팩 (99)" },
    ],
    products: [
      {
        id: "sticker-1",
        title: "스티커 상품 1",
        img: "/favicon.svg",
        brand: "브랜드A",
        discount: "20%",
        price: "8,000",
        originalPrice: "10,000",
        rating: "4.7",
        createdAt: "2025-09-24",
      },
      {
        id: "sticker-2",
        title: "스티커 상품 2",
        img: "/favicon.svg",
        brand: "브랜드B",
        discount: "10%",
        price: "18,000",
        originalPrice: "20,000",
        rating: "4.5",
        createdAt: "2025-09-23",
      },
    ],
  },

  memo: {
    name: "메모지",
    subCategories: [
      { id: "memo1", label: "떡메모지 (999)" },
      { id: "memo2", label: "포스트잇 (999)" },
    ],
    products: [
      {
        id: "memo-1",
        title: "메모지 상품 1",
        img: "/favicon.svg",
        brand: "브랜드A",
        discount: "20%",
        price: "8,000",
        originalPrice: "10,000",
        rating: "4.7",
        createdAt: "2025-09-24",
      },
      {
        id: "memo-2",
        title: "메모지 상품 2",
        img: "/favicon.svg",
        brand: "브랜드B",
        discount: "10%",
        price: "18,000",
        originalPrice: "20,000",
        rating: "4.5",
        createdAt: "2025-09-23",
      },
    ],
  },

  note: {
    name: "노트",
    subCategories: [
      { id: "note1", label: "제본 노트 (999)" },
      { id: "note2", label: "스프링 노트 (999)" },
      { id: "note3", label: "다이어리 (999)" },
    ],
    products: [
      {
        id: "note-1",
        title: "노트 상품 1",
        img: "/favicon.svg",
        brand: "브랜드A",
        discount: "20%",
        price: "8,000",
        originalPrice: "10,000",
        rating: "4.7",
        createdAt: "2025-09-24",
      },
      {
        id: "note-2",
        title: "노트 상품 2",
        img: "/favicon.svg",
        brand: "브랜드B",
        discount: "10%",
        price: "18,000",
        originalPrice: "20,000",
        rating: "4.5",
        createdAt: "2025-09-23",
      },
    ],
  },

  accessory: {
    name: "액세서리",
    products: [
      {
        id: "acc-1",
        title: "액세서리 1",
        img: "/favicon.svg",
        brand: "브랜드A",
        discount: "20%",
        price: "8,000",
        originalPrice: "10,000",
        rating: "4.7",
        createdAt: "2025-09-24",
      },
      {
        id: "acc-2",
        title: "액세서리 2",
        img: "/favicon.svg",
        brand: "브랜드B",
        discount: "10%",
        price: "18,000",
        originalPrice: "20,000",
        rating: "4.5",
        createdAt: "2025-09-23",
      },
    ],
  },

  etc: {
    name: "기타 문구류",
    products: [
      {
        id: "etc-1",
        title: "기타 문구 1",
        img: "/favicon.svg",
        brand: "브랜드A",
        discount: "20%",
        price: "8,000",
        originalPrice: "10,000",
        rating: "4.7",
        createdAt: "2025-09-24",
      },
      {
        id: "etc-2",
        title: "기타 문구 2",
        img: "/favicon.svg",
        brand: "브랜드B",
        discount: "10%",
        price: "18,000",
        originalPrice: "20,000",
        rating: "4.5",
        createdAt: "2025-09-23",
      },
    ],
  },

  digital: {
    name: "디지털 문구",
    products: [
      {
        id: "digital-1",
        title: "디지털 문구 1",
        img: "/favicon.svg",
        brand: "브랜드A",
        discount: "20%",
        price: "8,000",
        originalPrice: "10,000",
        rating: "4.7",
        createdAt: "2025-09-24",
      },
      {
        id: "digital-2",
        title: "디지털 문구 2",
        img: "/favicon.svg",
        brand: "브랜드B",
        discount: "10%",
        price: "18,000",
        originalPrice: "20,000",
        rating: "4.5",
        createdAt: "2025-09-23",
      },
    ],
  },
};

// slug 타입
export type CategorySlug = keyof typeof categoryData;

// 메인페이지 데이터
export const mainData: Product[] = [
  {
    id: "p1",
    img: "/favicon.svg",
    title: "상품 1",
    brand: "브랜드 A",
    discount: "20%",
    price: "8,000",
    originalPrice: "10,000",
    rating: "4.7",
    createdAt: "2025-09-24",
  },
  {
    id: "p2",
    img: "/favicon.svg",
    title: "상품 2",
    brand: "브랜드 B",
    discount: "15%",
    price: "17,000",
    originalPrice: "20,000",
    rating: "4.5",
    createdAt: "2025-09-23",
  },
  {
    id: "p3",
    img: "/favicon.svg",
    title: "상품 3",
    brand: "브랜드 C",
    discount: "30%",
    price: "7,000",
    originalPrice: "10,000",
    rating: "4.8",
    createdAt: "2025-09-22",
  },
  {
    id: "p4",
    img: "/favicon.svg",
    title: "상품 4",
    brand: "브랜드 D",
    discount: "10%",
    price: "27,000",
    originalPrice: "30,000",
    rating: "4.3",
    createdAt: "2025-09-21",
  },
];
