import React from 'react';

const OrderCompletePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex justify-center">
          <div className="flex items-center text-2xl">
            <span className="text-gray-400">01 장바구니</span>
            <span className="mx-4 text-gray-600">&gt;</span>
            <span className="text-gray-400">02 주문/결제</span>
            <span className="mx-4">&gt;</span>
            <span className="font-semibold">03 주문완료</span>
          </div>
        </div>
      </div>

      {/* Order Complete Message */}
      <div className="max-w-7xl mx-auto text-center py-12">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">✓</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-6 text-black">
          주문이 완료되었습니다.
        </h1>
        <div className="text-2xl text-gray-500 leading-relaxed">
          <p className="mb-1">구매해 주셔서 감사합니다.</p>
          <p className="mb-1">작가님께서 상품을 준비해 주실 예정입니다.</p>
          <p>조금만 기다려 주세요!</p>
        </div>
      </div>

      {/* Order History Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-black">주문 내역</h2>

        {/* Table Header */}
        <div className="bg-white border-t border-b border-gray-300 py-6">
          <div className="flex items-center px-8 pl-[170px]">
            <div className="flex items-center gap-6 w-1/2">
              <div className="w-36"></div>
              <span className="text-xl font-medium text-black">상품 정보</span>
            </div>
            <div className="w-1/4 text-center">
              <span className="text-xl font-medium text-black">주문 금액</span>
            </div>
            <div className="w-1/4 text-center">
              <span className="text-xl font-medium text-black">수량</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white pl-[170px]">
          {/* Item 1 */}
          <div className="flex items-center py-8 px-8 ">
            <div className="flex items-center gap-6 w-1/2">
              <div className="w-36 h-36 bg-gray-300 rounded flex items-center justify-center">
                <span className="text-gray-600 text-sm">상품 이미지</span>
              </div>
              <div className="flex flex-col gap-2 text-gray-600">
                <p className="font-bold">시루네 다락방</p>
                <p className="text-black">
                  아이코닉 2026 하루끝 하루시작 다이어리 (위클리 플래너)
                </p>
                <p>옵션 : 세부상품명1</p>
              </div>
            </div>
            <div className="w-1/4 text-center">
              <span className="text-2xl font-bold text-gray-800">8,000원</span>
            </div>
            <div className="w-1/4 text-center">
              <span className="text-xl font-bold text-gray-800">1</span>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-center py-8 px-8">
            <div className="flex items-center gap-6 w-1/2">
              <div className="w-36 h-36 bg-gray-300 rounded flex items-center justify-center">
                <span className="text-gray-600 text-sm">상품 이미지</span>
              </div>
              <div className="flex flex-col gap-2 text-gray-600">
                <p className="font-bold">시루네 다락방</p>
                <p className="text-black">아이코닉 (위클리 플래너)</p>
                <p>옵션 : 세부상품명1</p>
              </div>
            </div>
            <div className="w-1/4 text-center">
              <span className="text-2xl font-bold text-gray-800">1,000원</span>
            </div>
            <div className="w-1/4 text-center">
              <span className="text-xl font-bold text-gray-800">1</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="flex justify-center mt-16 mb-12">
          <div className="flex gap-16 md:gap-64 text-center flex-wrap">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-black">
                총 주문금액
              </h3>
              <p className="text-2xl text-black">9,000원</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-black">
                총 배송비
              </h3>
              <p className="text-2xl text-black">3,000원</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-black">
                총 결제금액
              </h3>
              <p className="text-2xl text-black">12,000원</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          <button className="px-8 py-3 border border-primary text-primary rounded-md font-semibold  hover:cursor-pointer transition-colors duration-200">
            메인으로
          </button>
          <button className="px-8 py-3 bg-primary text-white rounded-md font-semibold hover:cursor-pointer transition-colors duration-200">
            주문내역으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCompletePage;
