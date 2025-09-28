'use client';

import React from 'react';
import { useOrderStore } from '@/app/order/stores/orderStore';

const CartPage = () => {
  const { cartItems, updateCartItem, removeCartItem, toggleCartItem } =
    useOrderStore();

  // 초기 데이터가 없을 때 설정
  React.useEffect(() => {
    if (cartItems.length === 0) {
      // 스토어의 cartItems를 직접 설정
      useOrderStore.setState({
        cartItems: [
          {
            id: 1,
            brand: '시루에 다람쥐',
            name: '아이코닉 2026 하루끝 하루시작 다이어리 (위클리 플래너)',
            option: '세부상품명1',
            price: 8000,
            quantity: 1,
            image: '/cart-item1.jpg',
            isChecked: true,
            isRegular: true,
          },
          {
            id: 2,
            brand: '시루에 다람쥐',
            name: '아이코닉 2026 하루끝 하루시작 다이어리 (위클리 플래너)',
            option: '세부상품명1',
            price: 8000,
            quantity: 0,
            image: '/cart-item2.jpg',
            isChecked: true,
            isRegular: true,
          },
          {
            id: 3,
            brand: '시루에 다람쥐',
            name: '아이코닉 2026 하루끝 하루시작 다이어리 (위클리 플래너)',
            option: '세부상품명1',
            price: 8000,
            quantity: 1,
            image: '/cart-item3.jpg',
            isChecked: true,
            isRegular: false,
          },
          {
            id: 4,
            brand: '시루에 다람쥐',
            name: '아이코닉 2026 하루끝 하루시작 다이어리 (위클리 플래너)',
            option: '세부상품명1',
            price: 8000,
            quantity: 1,
            image: '/cart-item4.jpg',
            isChecked: false,
            isRegular: false,
          },
        ],
      });
    }
  }, [cartItems.length]);

  const handleQuantityUpdate = (id: number, change: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      updateCartItem(id, {
        quantity: Math.max(0, item.quantity + change),
      });
    }
  };

  const toggleAllCheck = (isRegular: boolean) => {
    const targetItems = cartItems.filter(
      (item) => item.isRegular === isRegular,
    );
    const allChecked = targetItems.every((item) => item.isChecked);

    targetItems.forEach((item) => {
      updateCartItem(item.id, { isChecked: !allChecked });
    });
  };

  const regularItems = cartItems.filter((item) => item.isRegular);
  const fundingItems = cartItems.filter((item) => !item.isRegular);

  const calculateTotal = () => {
    const checkedItems = cartItems.filter((item) => item.isChecked);
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

  const CartItemComponent = ({ item }: { item: (typeof cartItems)[0] }) => (
    <div className="border-b border-gray-300 bg-white">
      <div className="flex items-center py-6 px-4">
        {/* 체크박스 */}
        <div className="mr-6">
          <input
            type="checkbox"
            checked={item.isChecked}
            onChange={() => toggleCartItem(item.id)}
            className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
          />
        </div>

        {/* 상품 이미지 */}
        <div className="w-[150px] h-[150px] bg-gray-200 rounded-lg mr-8 overflow-hidden">
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            상품 이미지
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="flex-1 mr-8">
          <p className="text-gray-500 text-sm mb-1">{item.brand}</p>
          <h3 className="text-gray-500 font-semibold text-base leading-tight mb-2">
            {item.name}
          </h3>
          <p className="text-gray-500 text-sm">옵션 : {item.option}</p>
        </div>

        {/* 가격 */}
        <div className="w-24 text-center mr-12">
          <div className="text-2xl font-bold text-gray-800">
            {item.price.toLocaleString()}원
          </div>
        </div>

        {/* 삭제 버튼 */}
        <div className="mr-4">
          <button
            onClick={() => removeCartItem(item.id)}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 text-xl"
          >
            ×
          </button>
        </div>

        {/* 수량 조절 */}
        <div className="flex items-center border border-gray-300 rounded w-[103px]">
          <button
            onClick={() => handleQuantityUpdate(item.id, -1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
          >
            -
          </button>
          <span className="flex-1 text-center py-2">{item.quantity}</span>
          <button
            onClick={() => handleQuantityUpdate(item.id, 1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 브레드크럼 */}
        <div className="text-center text-2xl mb-8">
          <span className="font-bold">01 장바구니</span>
          <span className="text-gray-300 mx-2">&gt;</span>
          <span className="text-gray-300">02 주문/결제</span>
          <span className="text-gray-300 mx-2">&gt;</span>
          <span className="text-gray-300">03 주문완료</span>
        </div>

        {/* 일반 장바구니 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">일반 장바구니</h2>

          {/* 테이블 헤더 */}
          <div className="bg-white border border-gray-300 px-4 py-6 flex items-center">
            <div className="mr-6">
              <input
                type="checkbox"
                onChange={() => toggleAllCheck(true)}
                className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              />
            </div>
            <div className="w-[150px] mr-8"></div>
            <div className="flex-1 mr-8 text-center text-xl">상품 정보</div>
            <div className="w-24 text-center text-xl mr-12">주문 금액</div>
            <div className="mr-4"></div>
            <div className="w-[103px] text-center text-xl">수량</div>
          </div>

          {/* 상품 목록 */}
          <div className="bg-white">
            {regularItems.map((item) => (
              <CartItemComponent key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* 펀딩 장바구니 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">펀딩 장바구니</h2>

          {/* 테이블 헤더 */}
          <div className="bg-white border border-gray-300 px-4 py-6 flex items-center">
            <div className="mr-6">
              <input
                type="checkbox"
                onChange={() => toggleAllCheck(false)}
                className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              />
            </div>
            <div className="w-[150px] mr-8"></div>
            <div className="flex-1 mr-8 text-center text-xl">상품 정보</div>
            <div className="w-24 text-center text-xl mr-12">주문 금액</div>
            <div className="mr-4"></div>
            <div className="w-[103px] text-center text-xl">수량</div>
          </div>

          {/* 상품 목록 */}
          <div className="bg-white">
            {fundingItems.map((item) => (
              <CartItemComponent key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* 주문 요약 */}
        <section className="mb-8">
          <div className="flex justify-center gap-16 text-2xl">
            <div className="text-center">
              <div className="font-semibold mb-2">총 주문금액</div>
              <div>{totalPrice.toLocaleString()}원</div>
            </div>
            <div className="text-center">
              <div className="font-semibold mb-2">총 배송비</div>
              <div>{shippingFee.toLocaleString()}원</div>
            </div>
            <div className="text-center">
              <div className="font-semibold mb-2">총 결제금액</div>
              <div>{finalPrice.toLocaleString()}원</div>
            </div>
          </div>
        </section>

        {/* 주문 버튼 */}
        <section className="flex justify-center gap-4">
          <button className="px-8 py-3 border border-green-600 text-green-600 rounded bg-white font-semibold hover:bg-green-50">
            선택주문(0)
          </button>
          <button className="px-8 py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700">
            전체주문
          </button>
        </section>
      </main>
    </div>
  );
};

export default CartPage;
