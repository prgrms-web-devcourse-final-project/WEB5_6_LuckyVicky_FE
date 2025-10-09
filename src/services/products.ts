'use client';

import type { ApiResponse, ProductCreateDto, UploadedImageInfo, UploadType } from '@/types/product';

// 서버 엔티티 기준 정규화
function normalizePayload(p: ProductCreateDto): ProductCreateDto {
  const isFree = p.deliveryType === 'FREE';
  const isConditional = p.deliveryType === 'CONDITIONAL_FREE';

  return {
    ...p,
    deliveryCharge: isFree ? 0 : p.deliveryCharge,
    conditionalFreeAmount: isConditional ? (p.conditionalFreeAmount ?? 0) : null,
    sellingStartDate: p.isPlanned ? p.sellingStartDate : null,
    sellingEndDate: p.isPlanned ? p.sellingEndDate : null,
    tags: p.tags ?? [],
    options: p.options ?? [],
    additionalProducts: p.additionalProducts ?? [],
    images: p.images ?? [],
  };
}

// 이미지 업로드
export async function uploadProductImages(
  files: File[],
  types: UploadType[]
): Promise<UploadedImageInfo[]> {
  if (!files?.length) throw new Error('업로드할 파일이 없습니다.');
  if (!types?.length) throw new Error('업로드 타입이 없습니다.');
  if (files.length !== types.length) {
    throw new Error(`files(${files.length})와 types(${types.length}) 개수가 일치하지 않습니다.`);
  }

  const form = new FormData();
  files.forEach((f) => form.append('files', f));
  types.forEach((t) => form.append('types', t));

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/images`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });

  const json = (await res.json()) as ApiResponse<UploadedImageInfo[]>;
  if (!res.ok || json.resultCode !== '200' || !json.data) {
    throw new Error(json.msg || '이미지 업로드 실패');
  }
  return json.data;
}

// 상품 생성
export async function createProduct(dto: ProductCreateDto): Promise<string> {
  const body = normalizePayload(dto);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (res.status === 401) throw new Error('인증이 필요합니다.');
  if (res.status === 403) throw new Error('상품 등록 권한이 없습니다.');

  if (res.status === 400) {
    try {
      const j = (await res.json()) as ApiResponse<null>;
      throw new Error(j?.msg || '잘못된 요청입니다.');
    } catch {
      throw new Error('잘못된 요청입니다.');
    }
  }

  const text = await res.text();
  if (!res.ok) throw new Error('상품 등록 실패');

  const json = JSON.parse(text) as ApiResponse<string | null>;
  if (json.resultCode !== '200' || !json.data) {
    throw new Error(json.msg || '상품 등록 실패');
  }
  return json.data;
}
