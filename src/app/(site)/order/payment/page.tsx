'use client';

import React, { useState } from 'react';
import { useOrderStore } from '@/app/(site)/order/stores/orderStore';

const PaymentPage = () => {
  const {
    cartItems,
    shippingInfo,
    setShippingInfo,
    paymentMethod,
    setPaymentMethod,
  } = useOrderStore();

  const [shippingType, setShippingType] = useState<'existing' | 'new'>(
    'existing',
  );
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreements, setAgreements] = useState({
    productInfo: false,
    electronicTransaction: false,
    personalInfo: false,
    personalInfoProvision: false,
  });

  const [shippingData, setShippingData] = useState({
    name: shippingInfo?.name || '',
    recipient: '',
    zipCode: shippingInfo?.zipCode || '',
    address: shippingInfo?.address || '',
    detailAddress: shippingInfo?.detailAddress || '',
    phone: shippingInfo?.phone || '',
    phone2: '',
    deliveryRequest: '',
  });

  // 기본적으로 모리캐시 선택
  React.useEffect(() => {
    if (!paymentMethod) {
      setPaymentMethod('cash' as 'card' | 'bank' | 'kakao' | null);
    }
  }, [paymentMethod, setPaymentMethod]);

  const handleShippingDataChange = (field: string, value: string) => {
    setShippingData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Zustand 스토어에도 배송정보 업데이트
    if (
      field === 'name' ||
      field === 'zipCode' ||
      field === 'address' ||
      field === 'detailAddress' ||
      field === 'phone'
    ) {
      const updatedInfo = {
        name: field === 'name' ? value : shippingData.name,
        zipCode: field === 'zipCode' ? value : shippingData.zipCode,
        address: field === 'address' ? value : shippingData.address,
        detailAddress:
          field === 'detailAddress' ? value : shippingData.detailAddress,
        phone: field === 'phone' ? value : shippingData.phone,
      };
      setShippingInfo(updatedInfo);
    }
  };

  const handleAgreementChange = (key: string, checked: boolean) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreements({
      productInfo: checked,
      electronicTransaction: checked,
      personalInfo: checked,
      personalInfoProvision: checked,
    });
  };

  // 체크된 상품들만 필터링
  const checkedItems = cartItems.filter((item) => item.isChecked);

  const calculateTotal = () => {
    const totalPrice = checkedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shippingFee = totalPrice > 0 ? 3000 : 0;
    return {
      totalPrice,
      shippingFee,
      finalPrice: totalPrice + shippingFee,
    };
  };

  const { totalPrice, shippingFee, finalPrice } = calculateTotal();

  return (
    <div className="min-h-screen bg-white">
      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 브레드크럼 */}
        <div className="text-center text-2xl mb-8">
          <span className="text-gray-300">01 장바구니</span>
          <span className="text-gray-300 mx-2">&gt;</span>
          <span className="font-bold">02 주문/결제</span>
          <span className="text-gray-300 mx-2">&gt;</span>
          <span className="text-gray-300">03 주문완료</span>
        </div>

        <div className="grid grid-cols-[2fr_1fr] gap-8">
          {/* 왼쪽 영역 */}
          <div className="space-y-8">
            {/* 배송지 정보 */}
            <section>
              <h2 className="text-3xl font-bold mb-6">배송지 정보</h2>

              {/* 기존배송지/신규입력 탭 */}
              <div className="flex mb-6">
                <button
                  onClick={() => setShippingType('existing')}
                  className={`px-6 py-3 font-semibold ${
                    shippingType === 'existing'
                      ? 'bg-[#8C6D5A] text-white'
                      : 'bg-white border border-[#8C6D5A] text-[#8C6D5A]'
                  }`}
                >
                  기존배송지
                </button>
                <button
                  onClick={() => setShippingType('new')}
                  className={`px-6 py-3 font-semibold ${
                    shippingType === 'new'
                      ? 'bg-[#8C6D5A] text-white'
                      : 'bg-white border border-[#8C6D5A] text-[#8C6D5A]'
                  }`}
                >
                  신규입력
                </button>
              </div>

              {/* 배송지 입력 폼 */}
              <div className="grid grid-cols-[100px_1fr] gap-4">
                <div className="bg-gray-100 p-4 text-center">
                  <div className="h-8 flex items-center justify-center text-sm mb-4">
                    배송지명
                  </div>
                  <div className="h-8 flex items-center justify-center text-sm mb-4">
                    <span className="text-primary">*</span> 수령인
                  </div>
                  <div className="h-8 flex items-center justify-center text-sm mb-4">
                    <span className="text-primary">*</span> 우편번호
                  </div>
                  <div className="h-8 flex items-center justify-center text-sm mb-4">
                    <span className="text-primary">*</span> 배송지
                    <br />
                    주소
                  </div>
                  <div className="h-8 flex items-center justify-center text-sm mb-4"></div>
                  <div className="h-8 flex items-center justify-center text-sm mb-4">
                    <span className="text-primary">*</span> 연락처1
                  </div>
                  <div className="h-8 flex items-center justify-center text-sm mb-4">
                    연락처2
                  </div>
                  <div className="h-16 flex items-start justify-center text-sm pt-2">
                    배송
                    <br />
                    요청사항
                  </div>
                </div>

                <div className="pt-4">
                  <div className="h-8 mb-4">
                    <input
                      type="text"
                      value={shippingData.name}
                      onChange={(e) =>
                        handleShippingDataChange('name', e.target.value)
                      }
                      className="w-full h-8 px-3 border border-gray-300 rounded"
                      placeholder="배송지명을 입력하세요"
                    />
                  </div>

                  <div className="h-8 mb-4">
                    <input
                      type="text"
                      value={shippingData.recipient}
                      onChange={(e) =>
                        handleShippingDataChange('recipient', e.target.value)
                      }
                      className="w-full h-8 px-3 border border-gray-300 rounded"
                      placeholder="수령인명을 입력하세요"
                    />
                  </div>

                  <div className="h-8 mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={shippingData.zipCode}
                        onChange={(e) =>
                          handleShippingDataChange('zipCode', e.target.value)
                        }
                        className="w-32 h-8 px-3 border border-gray-300 rounded"
                        placeholder="우편번호"
                      />
                    </div>
                  </div>

                  <div className="h-8 mb-4">
                    <input
                      type="text"
                      value={shippingData.address}
                      onChange={(e) =>
                        handleShippingDataChange('address', e.target.value)
                      }
                      className="w-full h-8 px-3 border border-gray-300 rounded"
                      placeholder="주소를 입력하세요"
                    />
                  </div>

                  <div className="h-8 mb-4">
                    <input
                      type="text"
                      value={shippingData.detailAddress}
                      onChange={(e) =>
                        handleShippingDataChange(
                          'detailAddress',
                          e.target.value,
                        )
                      }
                      className="w-full h-8 px-3 border border-gray-300 rounded"
                      placeholder="상세주소를 입력하세요"
                    />
                  </div>

                  <div className="h-8 mb-4">
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={shippingData.phone}
                        onChange={(e) =>
                          handleShippingDataChange('phone', e.target.value)
                        }
                        className="w-16 h-8 px-3 border border-gray-300 rounded text-center"
                        placeholder="010"
                      />
                      <span>-</span>
                      <input
                        type="text"
                        value={shippingData.phone2}
                        onChange={(e) =>
                          handleShippingDataChange('phone2', e.target.value)
                        }
                        className="w-16 h-8 px-3 border border-gray-300 rounded text-center"
                      />
                      <span>-</span>
                      <input
                        type="text"
                        className="w-16 h-8 px-3 border border-gray-300 rounded text-center"
                      />
                    </div>
                  </div>

                  <div className="h-8 mb-4">
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        className="w-16 h-8 px-3 border border-gray-300 rounded text-center"
                        placeholder="010"
                      />
                      <span>-</span>
                      <input
                        type="text"
                        className="w-16 h-8 px-3 border border-gray-300 rounded text-center"
                      />
                      <span>-</span>
                      <input
                        type="text"
                        className="w-16 h-8 px-3 border border-gray-300 rounded text-center"
                      />
                    </div>
                  </div>

                  <div className="h-16">
                    <textarea
                      value={shippingData.deliveryRequest}
                      onChange={(e) =>
                        handleShippingDataChange(
                          'deliveryRequest',
                          e.target.value,
                        )
                      }
                      className="w-full h-16 px-3 py-2 border border-gray-300 rounded"
                      placeholder="배송 요청사항을 입력하세요"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 주문 상품 */}
            <section>
              <h2 className="text-3xl font-bold mb-6">주문 상품</h2>
              <div className="space-y-4">
                {checkedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded"
                  >
                    <div className="w-[150px] h-[150px] bg-gray-200 rounded overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        상품 이미지
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-500 text-sm mb-1">{item.brand}</p>
                      <h3 className="font-semibold text-gray-500 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        옵션 : {item.option}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {item.price.toLocaleString()}원
                      </div>
                      <div className="text-sm text-gray-500">
                        수량: {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 결제 방법 */}
            <section>
              <h2 className="text-3xl font-bold mb-6">결제 방법</h2>
              <div className="bg-gray-100 p-6 rounded">
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === 'bank' || !paymentMethod}
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value as 'card' | 'bank' | 'kakao' | null,
                        )
                      }
                      className="sr-only" // 기본 라디오 버튼 숨기기
                      defaultChecked
                    />
                    {/* 커스텀 라디오 버튼 */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'bank' || !paymentMethod
                          ? 'border-primary'
                          : 'border-gray-300'
                      }`}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                      {/* {(paymentMethod === 'bank' || !paymentMethod) && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                      )} */}
                    </div>
                    <span>모리캐시</span>
                    <span className="text-[16px] text-gray-600">
                      현재 보유 캐시 :{' '}
                      <span className="text-primary font-bold">20,000</span>{' '}
                      캐시
                    </span>
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* 오른쪽 결제 금액 영역 */}
          <div className="bg-primary-20 p-6 rounded h-fit">
            <h3 className="text-3xl font-bold mb-6">결제 금액</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>총 상품금액</span>
                <span className="font-semibold">
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between">
                <span>총 배송비</span>
                <span className="font-semibold">
                  {shippingFee.toLocaleString()}원
                </span>
              </div>
              <div>
                <div className="flex justify-between font-bold">
                  <span className="text-[18px]">최종 결제금액</span>
                  <span className="text-red-500  text-2xl">
                    {finalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="space-y-4 mb-6">
              <div className="pb-[17px] text-sm font-semibold border-b border-b-[#BFBFBF]">
                주문 상품정보 및 결제대행 서비스 이용약관에
                <br /> 모두 동의하십니까?
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreeAll}
                  onChange={(e) => handleAgreeAll(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">모두 동의</span>
              </label>

              <div className=" p-4 text-sm space-y-3">
                <div className="font-semibold">주문 상품정보에 대한 동의</div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  주문하실 상품, 가격, 배송정보, 할인내역등을 최종 확인하였으며,
                  구매에 동의합니다. (전자상거래법 제8조 제2항)
                </div>

                <div className="font-semibold">
                  결제대행 서비스 이용약관 동의
                </div>

                <div className="mx-[-15px] space-y-2 bg-white border border-gray-300 p-4">
                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={agreements.electronicTransaction}
                        onChange={(e) =>
                          handleAgreementChange(
                            'electronicTransaction',
                            e.target.checked,
                          )
                        }
                        className="w-3 h-3"
                      />
                      <span className="text-xs">전자금융거래 기본약관</span>
                    </div>
                    <button className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">
                      약관보기
                    </button>
                  </label>

                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={agreements.personalInfo}
                        onChange={(e) =>
                          handleAgreementChange(
                            'personalInfo',
                            e.target.checked,
                          )
                        }
                        className="w-3 h-3"
                      />
                      <span className="text-xs">
                        개인정보 수집 및 이용 동의
                      </span>
                    </div>
                    <button className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">
                      약관보기
                    </button>
                  </label>

                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={agreements.personalInfoProvision}
                        onChange={(e) =>
                          handleAgreementChange(
                            'personalInfoProvision',
                            e.target.checked,
                          )
                        }
                        className="w-3 h-3"
                      />
                      <span className="text-xs">
                        개인정보 제공 및 위탁 동의
                      </span>
                    </div>
                    <button className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">
                      약관보기
                    </button>
                  </label>
                </div>
              </div>
            </div>

            {/* 결제하기 버튼 */}
            <button className="block mx-auto px-[44px] py-[13px] w-fit bg-primary text-white rounded font-semibold hover:bg-green-700 transition-colors">
              결제하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
