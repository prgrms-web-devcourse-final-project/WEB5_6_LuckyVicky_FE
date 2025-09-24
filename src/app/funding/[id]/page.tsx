'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import fullHeart from '@/assets/icon/full_heart.svg';
import emptyHeart from '@/assets/icon/empty_heart.svg';

interface Review {
  id: number;
  rating: number;
  date: string;
  author: string;
  content: string;
  likes: number;
  images?: string[];
}

const ProductPage = () => {
  const [selectedTab, setSelectedTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const productImages = [
    '/api/placeholder/400/400',
    '/api/placeholder/400/400',
    '/api/placeholder/400/400',
    '/api/placeholder/400/400',
  ];

  const reviews: Review[] = [
    {
      id: 1,
      rating: 5,
      date: '2024/09/25',
      author: '작가명',
      content:
        '진짜본품 처리가 아주요 새로운 좋은 상품을 받아서 좋습니다!! 아직 사용해본건 지금 CCS원 내데 사용해봐야겠어용 진짜 좋아보이네에 진짜 좋고 아주 새거실젛고 ㅠㅠㅠ',
      likes: 0,
    },
    {
      id: 2,
      rating: 5,
      date: '2024/09/25',
      author: '작가명',
      content:
        '진짜본품이 처리 아주거부요 새로운 좋은 상품을 받아서 좋습니다!! 아직 사용해본건 지금 CCS원 상품 진짜좋아 즌재ㅏ 새좋어요 좋고 아주 신제품이고 신청설계가 아주 좋아서만족합니다 진짜 좋고 신제ㅁㅠ',
      likes: 25,
      images: ['/api/placeholder/200/200'],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={productImages[0]}
                alt="Product main image"
                className="w-full h-full object-cover"
                width={645}
                height={450}
              />
            </div>
            <div className="flex space-x-2">
              {productImages.map((image, index) => (
                <div
                  key={index}
                  className=" bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                >
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    width={111}
                    height={62}
                    className="w-full h-full object-cover hover:opacity-80"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 ml-[92px]">
            <div>
              <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-[6px] mb-2">
                카테고리
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">제품명</h1>
            </div>

            <div className="space-y-2">
              <p>모인 금액</p>
              <div className="flex gap-20">
                <div className="text-3xl font-bold text-gray-900">
                  1,000,000원
                </div>
                <div className="text-gray-500 self-end">
                  목표 금액 1,500,000원
                </div>
              </div>
              <p>남은 기간</p>
              <div className="text-3xl font-bold text-gray-900">10일</div>
              <p>후원자</p>
              <div className="text-3xl font-bold text-gray-900">112명</div>
            </div>

            <div className="flex space-x-3">
              <button className="bg-white border-1 border-primary text-primary py-3 px-6 rounded-[6px] text-[25px] font-bold hover:bg-green-50 transition-colors">
                장바구니
              </button>
              <button className="bg-primary text-white py-3 px-6 rounded-[6px] hover:bg-primary-60 transition-colors text-[25px] font-bold">
                예약 구매
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 border rounded-lg transition-colors border-gray-300`}
              >
                {isWishlisted ? (
                  <Image src={fullHeart} alt={'fullHeart'}></Image>
                ) : (
                  <Image src={emptyHeart} alt={'emptyHeart'}></Image>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Product Tabs & Reviews */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Product Tabs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b">
              <nav className="flex text-4 font-semibold ">
                <button
                  onClick={() => setSelectedTab('description')}
                  className={`flex-1 px-6 py-2 border-1 border-tertiary${
                    selectedTab === 'description'
                      ? ' bg-tertiary text-white'
                      : ' text-tertiary hover:bg-tertiary-20'
                  }`}
                >
                  상품정보 소개
                </button>
                <button
                  onClick={() => setSelectedTab('details')}
                  className={`flex-1 px-6 py-2 border-1 border-tertiary${
                    selectedTab === 'details'
                      ? ' bg-tertiary text-white'
                      : ' text-tertiary hover:bg-tertiary-20'
                  }`}
                >
                  제품 소개
                </button>
                <button
                  onClick={() => setSelectedTab('shipping')}
                  className={`flex-1 px-6 py-2 border-1 border-tertiary${
                    selectedTab === 'shipping'
                      ? ' bg-tertiary text-white'
                      : ' text-tertiary hover:bg-tertiary-20'
                  }`}
                >
                  배송정보
                </button>
              </nav>
            </div>

            <div className="p-6">
              {selectedTab === 'description' && (
                <div>
                  <div className="bg-gray-100 aspect-video rounded-lg flex items-center justify-center text-gray-500 mb-6">
                    상세 페이지 이미지
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Author Info & Reviews */}
          <div className="space-y-8">
            {/* Author Info */}
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-200 rounded-full mx-auto mb-2"></div>
                <h3 className="font-semibold">작가 소개</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                작가님은 뉴욕에 거주하며 한국과의 문화적 교류를 통해 독특한
                관점에서 작품을 만들어내는 동시에 뉴욕 현지에서 활발한 예술
                활동을 하고 있습니다. 다양한 매체를 통해 한국과 미국의 문화를
                연결하는 작업을 하고 있습니다.
              </p>
              <button className="mt-4 text-sm text-primary hover:underline">
                더보기용 →
              </button>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">
                  새로운 업데이트를 알려드립니다.
                </h2>
              </div>

              <div className="space-y-6 p-6">
                {reviews.map((review, index) => (
                  <div key={review.id} className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-semibold">
                          {index + 1}-{index === 0 ? '2' : '1'}
                        </span>
                        <div>
                          <div className="flex text-yellow-400 mb-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <div key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                          <div className="text-sm text-gray-600">
                            {review.date} | {review.author}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {review.content}
                    </p>

                    {review.images && (
                      <div className="mb-4">
                        <div className="bg-gray-200 w-32 h-32 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                          이미지가 상품으로 등록 가능
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div></div>
                      <button className="flex items-center space-x-2 text-primary hover:text-primary">
                        <div className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          {review.likes}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
