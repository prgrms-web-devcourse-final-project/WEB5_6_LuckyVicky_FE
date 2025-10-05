'use client';

import { useState } from 'react';

export default function ExchangeRefundModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [type, setType] = useState<'exchange' | 'refund'>('exchange');
  const [method, setMethod] = useState('delivery');
  const [quantity, setQuantity] = useState(1);
  const [addressType, setAddressType] = useState('new');
  const [zipCode, setZipCode] = useState('12345');
  const [address1, setAddress1] = useState('서울특별시 강남구 테헤란로 123');
  const [address2, setAddress2] = useState('2층 모리모리모리');
  const [reason, setReason] = useState('제품에 하자가 있음');
  const [detailReason, setDetailReason] =
    useState('스티커가 구겨진 상태로 왔습니다.');
  const [fileName, setFileName] = useState('photo.jpg');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">교환/환불 신청</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* 상품 정보 */}
          <div className="flex gap-4 pb-6 border-b">
            <div className="w-32 h-32 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center">
                <span className="text-4xl">🧋</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">주문번호 : 0123157</p>
              <p className="text-xs text-gray-400 mb-2">브랜드명</p>
              <h3 className="font-bold text-lg mb-2">
                상품명입니다 상품명입니다
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">1,000원</span>
                <span className="text-gray-500">1개</span>
              </div>
            </div>
          </div>

          {/* 교환/환불 선택 */}
          <div className="py-6 border-b">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <label className="font-bold">교환/환불</label>
                <span className="text-primary">*</span>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="exchange"
                    checked={type === 'exchange'}
                    onChange={(e) => setType(e.target.value as 'exchange')}
                    className="w-5 h-5 accent-primary"
                  />
                  <span>교환</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="refund"
                    checked={type === 'refund'}
                    onChange={(e) => setType(e.target.value as 'refund')}
                    className="w-5 h-5 accent-primary"
                  />
                  <span>환불</span>
                </label>
              </div>
            </div>
          </div>

          {/* 환불 방법 */}
          <div className="py-6 border-b">
            <div className="flex items-center gap-8">
              <label className="font-bold">환불 방법</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="method"
                  value="delivery"
                  checked={method === 'delivery'}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-5 h-5 accent-primary"
                />
                <span>모리캐시</span>
              </label>
            </div>
          </div>

          {/* 교환/환불 수량 */}
          <div className="py-6 border-b">
            <div className="flex items-center gap-8">
              <label className="font-bold">교환/환불 수량</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-20 h-8 border rounded text-center"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* 교환 시 배송지 선택 */}
          <div className="py-6 border-b">
            <div className="flex items-center gap-8">
              <label className="font-bold">
                교환 시 배송지 선택<span className="text-primary">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="addressType"
                    value="new"
                    checked={addressType === 'new'}
                    onChange={(e) => setAddressType(e.target.value)}
                    className="w-5 h-5 accent-primary"
                  />
                  <span>기존 주소</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="addressType"
                    value="existing"
                    checked={addressType === 'existing'}
                    onChange={(e) => setAddressType(e.target.value)}
                    className="w-5 h-5 accent-primary"
                  />
                  <span>새주소</span>
                </label>
              </div>
            </div>
          </div>

          {/* 교환 시 배송지 주소 */}
          <div className="py-6 border-b">
            <div className="flex gap-8 mb-3">
              <label className="font-bold whitespace-nowrap pt-2">
                교환 시 배송지 주소
              </label>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded"
                  placeholder="우편번호"
                />
                <button className="px-6 py-2 mr-30 border rounded hover:bg-gray-50 whitespace-nowrap">
                  주소 검색
                </button>
              </div>
            </div>
            <input
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-3"
              placeholder="주소"
            />
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              placeholder="상세주소"
            />
          </div>

          {/* 교환/환불 사유 */}
          <div className="py-6 border-b">
            <div className="flex gap-8">
              <label className="font-bold whitespace-nowrap pt-3">
                교환/환불 사유
              </label>
              <div className="flex-1 relative">
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 border rounded appearance-none bg-white cursor-pointer"
                >
                  <option value="제품에 하자가 있음">제품에 하자가 있음</option>
                  <option value="단순 변심">단순 변심</option>
                  <option value="배송 지연">배송 지연</option>
                  <option value="상품 불량">상품 불량</option>
                  <option value="기타">기타</option>
                </select>
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 상세 사유 */}
          <div className="py-6 border-b">
            <div className="flex gap-8">
              <label className="font-bold whitespace-nowrap pt-3">
                상세 사유
              </label>
              <textarea
                value={detailReason}
                onChange={(e) => setDetailReason(e.target.value)}
                className="flex-1 px-4 py-3 border rounded resize-none"
                rows={4}
                placeholder="상세 사유를 입력해주세요"
              />
            </div>
          </div>

          {/* 첨부파일 */}
          <div className="py-6 border-b">
            <div className="flex gap-8">
              <div className="flex items-center gap-2 whitespace-nowrap pt-2">
                <label className="font-bold">첨부파일</label>
                <span className="text-sm text-gray-500">0</span>
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={fileName}
                  readOnly
                  className="flex-1 px-4 py-2 border rounded bg-gray-50"
                />
                <button className="px-6 py-2 border rounded hover:bg-gray-50 whitespace-nowrap">
                  파일 업로드
                </button>
              </div>
            </div>
          </div>

          {/* 유의사항 */}
          <div className="py-6">
            <div className="flex gap-8">
              <label className="font-bold whitespace-nowrap">유의사항</label>
              <ul className="flex-1 text-sm text-gray-600 space-y-1">
                <li>• 단순 변심의 경우 왕복 배송비가 청구될 수 있습니다.</li>
                <li>
                  • 환불은 영 결제수단으로 처리되며, 3~5영업일 소요됩니다.
                </li>
              </ul>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              신청 취소
            </button>
            <button className="flex-1 py-3 bg-primary text-white rounded hover:opacity-90">
              신청하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
