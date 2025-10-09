// 공통 업로드 타입
export type UploadType = 'MAIN' | 'ADDITIONAL' | 'THUMBNAIL' | 'DOCUMENT';

export type UploadedImageInfo = {
  url: string;
  type: UploadType;
  s3Key: string;
  originalFileName: string;
};

export type ProductRow = {
  id: string; // 서버 UUID
  name: string;
  artistName: string;
  sellingStatus: 'SELLING' | 'STOPPED' | 'SOLD_OUT';
  createdAt: string; // ISO
};

// 서버 DTO
export type ProductCreateDto = {
  categoryId: number;
  name: string;
  brandName: string;
  productModelName: string;

  price: number;
  discountRate: number;

  bundleShippingAvailable: boolean;
  deliveryType: 'FREE' | 'PAID' | 'CONDITIONAL_FREE';
  deliveryCharge: number;               // FREE면 0
  additionalShippingCharge: number;
  conditionalFreeAmount: number | null; // 조건부 아니면 null

  stock: number;
  description: string;

  sellingStatus: 'BEFORE_SELLING' | 'SELLING' | 'SOLD_OUT' | 'END_OF_SALE';
  displayStatus: 'BEFORE_DISPLAY' | 'DISPLAYING' | 'END_OF_DISPLAY';

  minQuantity: number;
  maxQuantity: number;

  isPlanned: boolean;
  isRestock: boolean;
  sellingStartDate: string | null; // "YYYY-MM-DDTHH:mm:ss"
  sellingEndDate: string | null;

  tags: number[];

  options: {
    optionName: string;
    optionStock: number;
    optionAdditionalPrice: number;
  }[];

  additionalProducts: {
    additionalProductName: string;
    additionalProductStock: number;
    additionalProductPrice: number;
  }[];

  images: {
    url: string;
    type: UploadType;
    s3Key: string;
    originalFileName: string;
  }[];

  certification: boolean;
  origin: string;
  material: string;
  size: string;
};

export type ApiResponse<T> = { resultCode: string; msg: string; data: T | null };

// UI 타입
export type ShippingTypeUI = 'FREE' | 'PAID' | 'CONDITIONAL';
export type TagUI = string;

export type ProductOptionUI = { id: string; name: string; extraPrice?: number; stock?: number };
export type ProductAddonUI  = { id: string; name: string; extraPrice?: number; stock?: number };

export type ProductCreatePayload = {
  brand: string;
  title: string;
  modelName: string;
  category1: string;
  category2: string;
  size: string;
  material: string;
  origin: string;
  price: number;
  discountRate: number;
  stock: number;
  minQty: number;
  maxQty: number;
  bundleShipping: boolean;
  shipping: {
    type: ShippingTypeUI;
    fee: number;
    freeThreshold: number | null;
    jejuExtraFee: number;
  };
  plannedSale: { startAt: string; endAt: string } | null;
  tags: TagUI[];
  options: ProductOptionUI[];
  addons: ProductAddonUI[];
  lawCert: { required: boolean; detail?: string };
  bizInfo?: { companyName?: string; bizNumber?: string; ceoName?: string }; // 서버 전송 X
  description: string;
  attachments?: File[]; // 서버 전송 X
};

export type TagDict = Record<string, number>;
