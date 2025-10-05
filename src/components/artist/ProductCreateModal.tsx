'use client';

import { useEffect, useState } from 'react';
import X from '@/assets/icon/x.svg';
import Paperclip from '@/assets/icon/paperclip2.svg';
import NoticeEditor from '@/components/editor/NoticeEditor';

export const AVAILABLE_TAGS = ['심플', '비비드', '모던', '레트로', '키치', '내추럴'] as const;
export type Tag = typeof AVAILABLE_TAGS[number];
export type ShippingType = 'FREE' | 'PAID' | 'CONDITIONAL';

export type ProductOption = { id: string; name: string; extraPrice?: number; stock?: number };
export type ProductAddon  = { id: string; name: string; extraPrice?: number; stock?: number };

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
    type: ShippingType;
    fee: number;               // FREE면 0
    freeThreshold: number | null; // CONDITIONAL만 사용
    jejuExtraFee: number;
  };
  plannedSale: { startAt: string; endAt: string } | null;
  tags: Tag[];
  options: ProductOption[];
  addons: ProductAddon[];
  lawCert: { required: boolean; detail?: string };
  bizInfo: { companyName: string; bizNumber: string; ceoName: string };
  description: string;
  attachments: File[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: ProductCreatePayload) => Promise<void> | void;

  // 상위에서 내려줄 수 있는 초기값(브랜드/프로필 불러오기 등)
  initialBrand?: string;
  initialBizInfo?: { companyName?: string; bizNumber?: string; ceoName?: string };

  // “사업자 정보 불러오기” 로직을 외부에서 처리하고 싶으면 전달
  onLoadBizFromProfile?: () => Promise<{ companyName?: string; bizNumber?: string; ceoName?: string } | void> | void;
};

export default function ProductCreateModal({
  open,
  onClose,
  onSubmit,
  initialBrand = '내 브랜드',
  initialBizInfo,
  onLoadBizFromProfile,
}: Props) {
  // 모달 미표시 시 렌더 차단
  if (!open) return null;

  // ----- 기본 정보 -----
  const [brand] = useState(initialBrand);
  const [title, setTitle] = useState('');
  const [modelName, setModelName] = useState('');
  const [category1, setCategory1] = useState('');
  const [category2, setCategory2] = useState('');
  const [size, setSize] = useState('');
  const [material, setMaterial] = useState('');
  const [origin, setOrigin] = useState('');

  // ----- 가격/재고 -----
  const [price, setPrice] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [minQty, setMinQty] = useState<number>(1);
  const [maxQty, setMaxQty] = useState<number>(0);

  // ----- 배송 정보 -----
  const [bundleShipping, setBundleShipping] = useState<boolean>(true);
  const [shippingType, setShippingType] = useState<ShippingType>('FREE');
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [freeThreshold, setFreeThreshold] = useState<number>(0);
  const [jejuExtraFee, setJejuExtraFee] = useState<number>(0);

  // ----- 판매 설정 -----
  const [isPlanned, setIsPlanned] = useState<boolean>(false);
  const [saleStart, setSaleStart] = useState<string>('');
  const [saleEnd, setSaleEnd] = useState<string>('');
  const [tags, setTags] = useState<Tag[]>([]);

  // ----- 옵션/추가상품 -----
  const [useOptions, setUseOptions] = useState<boolean>(false);
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [addons, setAddons] = useState<ProductAddon[]>([]);
  const addOption = () => setOptions((p) => [...p, { id: crypto.randomUUID(), name: '' }]);
  const removeOption = (idx: number) => setOptions((p) => p.filter((_, i) => i !== idx));
  const updateOption = (idx: number, patch: Partial<ProductOption>) =>
    setOptions((p) => p.map((o, i) => (i === idx ? { ...o, ...patch } : o)));
  const addAddon = () => setAddons((p) => [...p, { id: crypto.randomUUID(), name: '' }]);
  const removeAddon = (idx: number) => setAddons((p) => p.filter((_, i) => i !== idx));
  const updateAddon = (idx: number, patch: Partial<ProductAddon>) =>
    setAddons((p) => p.map((o, i) => (i === idx ? { ...o, ...patch } : o)));

  // ----- 인증/사업자 -----
  const [lawCertRequired, setLawCertRequired] = useState<boolean>(false);
  const [lawCertDetail, setLawCertDetail] = useState<string>('');
  const [bizInfo, setBizInfo] = useState({
    companyName: initialBizInfo?.companyName ?? '',
    bizNumber: initialBizInfo?.bizNumber ?? '',
    ceoName: initialBizInfo?.ceoName ?? '',
  });

  // ----- 에디터/파일 -----
  const [editorValue, setEditorValue] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  // body scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleLoadBizFromProfile = async () => {
    if (!onLoadBizFromProfile) return;
    const res = (await onLoadBizFromProfile()) || {};
    setBizInfo((prev) => ({
      ...prev,
      companyName: res.companyName ?? prev.companyName,
      bizNumber: res.bizNumber ?? prev.bizNumber,
      ceoName: res.ceoName ?? prev.ceoName,
    }));
  };

  const handleSubmit = async () => {
    if (!title.trim()) return alert('상품명을 입력해주세요.');
    if (price < 0) return alert('판매가는 0 이상이어야 합니다.');
    if (shippingType === 'CONDITIONAL' && freeThreshold <= 0)
      return alert('조건부 무료배송 기준 금액을 입력해주세요.');

    const payload: ProductCreatePayload = {
      brand,
      title,
      modelName,
      category1,
      category2,
      size,
      material,
      origin,
      price,
      discountRate,
      stock,
      minQty,
      maxQty,
      bundleShipping,
      shipping: {
        type: shippingType,
        fee: shippingType === 'FREE' ? 0 : shippingFee,
        freeThreshold: shippingType === 'CONDITIONAL' ? freeThreshold : null,
        jejuExtraFee,
      },
      plannedSale: isPlanned ? { startAt: saleStart, endAt: saleEnd } : null,
      tags,
      options: useOptions ? options : [],
      addons: useOptions ? addons : [],
      lawCert: lawCertRequired ? { required: true, detail: lawCertDetail } : { required: false },
      bizInfo,
      description: editorValue,
      attachments: files,
    };

    await onSubmit(payload);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden shadow-xl w-[960px] max-w-[95vw] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 z-10 bg-white px-6 pt-5 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">상품 등록</h2>
            <button
              className="cursor-pointer rounded transition hover:bg-black/5 p-2"
              onClick={onClose}
              aria-label="닫기"
            >
              <X width={16} height={16} />
            </button>
          </div>
        </div>
        <hr />

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5 space-y-8">
          {/* 기본 정보 */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold">기본 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-sm">브랜드</span>
                <input
                  value={brand}
                  readOnly
                  className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm bg-gray-50"
                />
              </label>

              <label className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-sm">상품명</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                />
              </label>

              <label className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-sm">모델명</span>
                <input
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                />
              </label>

              <div className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-sm">카테고리</span>
                <select
                  value={category1}
                  onChange={(e) => setCategory1(e.target.value)}
                  className="rounded border border-[var(--color-gray-200)] py-2 px-3 text-sm"
                >
                  <option value="">대분류 선택</option>
                  <option>스티커</option>
                  <option>메모지</option>
                  <option>노트</option>
                  <option>액세서리</option>
                  <option>기타문구류</option>
                  <option>디지털문구</option>
                </select>
                <select
                  value={category2}
                  onChange={(e) => setCategory2(e.target.value)}
                  className="rounded border border-[var(--color-gray-200)] py-2 px-3 text-sm"
                >
                  <option value="">소분류 선택</option>
                  <option>스티커</option>
                  <option>노트</option>
                  <option>액세서리</option>
                </select>
              </div>

              <label className="flex items-center gap-3">
                <span className="w-28 text-sm">사이즈</span>
                <input
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                />
              </label>
              <label className="flex items-center gap-3">
                <span className="w-28 text-sm">재질</span>
                <input
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                />
              </label>
              <label className="flex items-center gap-3">
                <span className="w-28 text-sm">원산지</span>
                <input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                />
              </label>
            </div>
          </section>

          <hr />

          {/* 가격 / 재고 */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold">가격 / 재고</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-3">
                <span className="w-28 text-sm">판매가</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value) || 0)}
                  className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                />
              </label>
              <label className="flex items-center gap-3">
                <span className="w-28 text-sm">할인율(%)</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={discountRate}
                  onChange={(e) => setDiscountRate(Number(e.target.value) || 0)}
                  className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                />
              </label>
              <label className="flex items-center gap-3">
                <span className="w-28 text-sm">재고</span>
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value) || 0)}
                  className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                />
              </label>
              <label className="flex items-center gap-3">
                <span className="w-28 text-sm">최소구매</span>
                <input
                  type="number"
                  min={1}
                  value={minQty}
                  onChange={(e) => setMinQty(Number(e.target.value) || 1)}
                  className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                />
              </label>
              <label className="flex items-center gap-3">
                <span className="w-28 text-sm">최대구매</span>
                <input
                  type="number"
                  min={0}
                  value={maxQty}
                  onChange={(e) => setMaxQty(Number(e.target.value) || 0)}
                  placeholder="0 = 제한 없음"
                  className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                />
              </label>
            </div>
          </section>

          <hr />

          {/* 배송 정보 */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold">배송 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-3">
                <span className="w-32 text-sm">묶음배송 가능</span>
                <input
                  type="checkbox"
                  checked={bundleShipping}
                  onChange={(e) => setBundleShipping(e.target.checked)}
                />
              </label>

              <label className="flex items-center gap-3">
                <span className="w-32 text-sm">배송비 유형</span>
                <select
                  value={shippingType}
                  onChange={(e) => setShippingType(e.target.value as ShippingType)}
                  className="flex-1 rounded border border-[var(--color-gray-200)] py-2 px-3 text-sm"
                >
                  <option value="FREE">무료배송</option>
                  <option value="PAID">유료배송</option>
                  <option value="CONDITIONAL">조건부 무료배송</option>
                </select>
              </label>

              {(shippingType === 'PAID' || shippingType === 'CONDITIONAL') && (
                <label className="flex items-center gap-3">
                  <span className="w-32 text-sm">배송비</span>
                  <input
                    type="number"
                    min={0}
                    value={shippingFee}
                    onChange={(e) => setShippingFee(Number(e.target.value) || 0)}
                    className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                  />
                </label>
              )}

              {shippingType === 'CONDITIONAL' && (
                <label className="flex items-center gap-3 md:col-span-2">
                  <span className="w-32 text-sm">무료배송 기준(원)</span>
                  <input
                    type="number"
                    min={0}
                    value={freeThreshold}
                    onChange={(e) => setFreeThreshold(Number(e.target.value) || 0)}
                    className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                  />
                </label>
              )}

              <label className="flex items-center gap-3">
                <span className="w-32 text-sm">제주 추가배송비</span>
                <input
                  type="number"
                  min={0}
                  value={jejuExtraFee}
                  onChange={(e) => setJejuExtraFee(Number(e.target.value) || 0)}
                  className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                />
              </label>
            </div>
          </section>

          <hr />

          {/* 판매 설정 */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold">판매 설정</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-3">
                <span className="w-32 text-sm">기획상품</span>
                <input
                  type="checkbox"
                  checked={isPlanned}
                  onChange={(e) => setIsPlanned(e.target.checked)}
                />
              </label>

              {isPlanned && (
                <>
                  <label className="flex items-center gap-3">
                    <span className="w-32 text-sm">판매 시작일</span>
                    <input
                      type="datetime-local"
                      value={saleStart}
                      onChange={(e) => setSaleStart(e.target.value)}
                      className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="flex items-center gap-3">
                    <span className="w-32 text-sm">판매 종료일</span>
                    <input
                      type="datetime-local"
                      value={saleEnd}
                      onChange={(e) => setSaleEnd(e.target.value)}
                      className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                    />
                  </label>
                </>
              )}

              <div className="md:col-span-3">
                <div className="flex items-start gap-3">
                  <span className="w-32 shrink-0 text-sm mt-2">태그(스타일)</span>
                  <div className="flex flex-wrap gap-3">
                    {AVAILABLE_TAGS.map((t) => (
                      <label key={t} className="inline-flex items-center gap-2 text-sm border rounded px-2 py-1">
                        <input
                          type="checkbox"
                          checked={tags.includes(t)}
                          onChange={(e) =>
                            setTags((prev) => (e.target.checked ? [...prev, t] : prev.filter((x) => x !== t)))
                          }
                        />
                        <span>{t}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr />

          {/* 옵션 / 추가상품 */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">옵션 / 추가상품</h3>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={useOptions}
                  onChange={(e) => setUseOptions(e.target.checked)}
                />
                옵션/추가상품 사용
              </label>
            </div>

            {useOptions && (
              <>
                <div className="space-y-2">
                  <div className="text-sm font-medium">옵션</div>
                  {options.map((opt, idx) => (
                    <div key={opt.id} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <input
                        placeholder="옵션명 (예: 색상/레드)"
                        value={opt.name}
                        onChange={(e) => updateOption(idx, { name: e.target.value })}
                        className="rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="추가금(원)"
                        value={opt.extraPrice ?? 0}
                        onChange={(e) => updateOption(idx, { extraPrice: Number(e.target.value) || 0 })}
                        className="rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="재고"
                        value={opt.stock ?? 0}
                        onChange={(e) => updateOption(idx, { stock: Number(e.target.value) || 0 })}
                        className="rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                      />
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => removeOption(idx)}
                          className="text-sm border rounded px-3 py-2 hover:bg-black/5"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addOption}
                    className="text-sm border rounded px-3 py-2 hover:bg-black/5"
                  >
                    옵션 추가
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">추가상품</div>
                  {addons.map((ad, idx) => (
                    <div key={ad.id} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <input
                        placeholder="추가상품명"
                        value={ad.name}
                        onChange={(e) => updateAddon(idx, { name: e.target.value })}
                        className="rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="추가금(원)"
                        value={ad.extraPrice ?? 0}
                        onChange={(e) => updateAddon(idx, { extraPrice: Number(e.target.value) || 0 })}
                        className="rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="재고"
                        value={ad.stock ?? 0}
                        onChange={(e) => updateAddon(idx, { stock: Number(e.target.value) || 0 })}
                        className="rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                      />
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => removeAddon(idx)}
                          className="text-sm border rounded px-3 py-2 hover:bg-black/5"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAddon}
                    className="text-sm border rounded px-3 py-2 hover:bg-black/5"
                  >
                    추가상품 추가
                  </button>
                </div>
              </>
            )}
          </section>

          <hr />

          {/* 인증 / 사업자 정보 */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold">인증 / 사업자 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-3">
                <span className="w-40 text-sm">법적 인증/허가 필요</span>
                <input
                  type="checkbox"
                  checked={lawCertRequired}
                  onChange={(e) => setLawCertRequired(e.target.checked)}
                />
              </label>

              {lawCertRequired && (
                <label className="md:col-span-2 flex items-center gap-3">
                  <span className="w-40 text-sm">인증/허가 상세</span>
                  <input
                    value={lawCertDetail}
                    onChange={(e) => setLawCertDetail(e.target.value)}
                    placeholder="예: 전기용품 안전인증 번호 등"
                    className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                  />
                </label>
              )}

              <div className="md:col-span-3 flex items-center gap-3">
                <span className="w-40 text-sm">사업자 정보</span>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    value={bizInfo.companyName}
                    onChange={(e) => setBizInfo({ ...bizInfo, companyName: e.target.value })}
                    placeholder="상호"
                    className="rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                  />
                  <input
                    value={bizInfo.bizNumber}
                    onChange={(e) => setBizInfo({ ...bizInfo, bizNumber: e.target.value })}
                    placeholder="사업자등록번호"
                    className="rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                  />
                  <input
                    value={bizInfo.ceoName}
                    onChange={(e) => setBizInfo({ ...bizInfo, ceoName: e.target.value })}
                    placeholder="대표자명"
                    className="rounded border border-[var(--color-gray-200)] px-3 py-2 text-sm"
                  />
                </div>
                {onLoadBizFromProfile && (
                  <button
                    type="button"
                    onClick={handleLoadBizFromProfile}
                    className="shrink-0 text-sm border rounded px-3 py-2 hover:bg-black/5"
                  >
                    불러오기
                  </button>
                )}
              </div>
            </div>
          </section>

          <hr />

          {/* 내용(에디터) */}
          <section className="space-y-2">
            <span className="text-sm">내용</span>
            <NoticeEditor
              value={editorValue}
              onChange={setEditorValue}
              onUploadImage={async (file) => URL.createObjectURL(file)}
              minHeight={120}
              maxHeight={180}
            />
          </section>

          {/* 첨부파일 */}
          <section className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="shrink-0 text-sm">첨부파일</span>
                <Paperclip className="block size-4 overflow-visible text-[var(--color-gray-200)] shrink-0" />
              </div>
              <div className="relative flex-1">
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                />
                <input
                  type="text"
                  readOnly
                  value={
                    files.length === 0
                      ? ''
                      : files.length === 1
                      ? files[0].name
                      : `${files[0].name} 외 ${files.length - 1}개`
                  }
                  placeholder="파일을 선택하세요"
                  className="w-full rounded border border-[var(--color-gray-200)] px-3 py-2 pr-24 leading-none text-sm"
                  onClick={() => document.getElementById('fileInput')?.click()}
                />
                {files.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setFiles([])}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-[var(--color-primary)] px-3 py-1 text-sm leading-none transition hover:bg-primary-20"
                  >
                    파일 삭제
                  </button>
                ) : (
                  <label
                    htmlFor="fileInput"
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded border border-[var(--color-primary)] px-3 py-1 text-sm leading-none transition hover:bg-primary-20"
                  >
                    파일 선택
                  </label>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* 푸터 */}
        <hr />
        <div className="sticky bottom-0 z-10 bg-white px-6 py-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-md border border-primary text-primary font-semibold text-sm cursor-pointer"
          >
            작성취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-2 rounded-md border border-primary bg-primary text-white font-semibold text-sm cursor-pointer"
          >
            작성하기
          </button>
        </div>
      </div>
    </div>
  );
}
