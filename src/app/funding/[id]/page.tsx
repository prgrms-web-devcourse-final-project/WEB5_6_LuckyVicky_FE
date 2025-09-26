'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import FullHeart from '@/assets/icon/full_heart.svg';
import EmptyHeart from '@/assets/icon/empty_heart.svg';
import Favorite from '@/assets/icon/bookmark.svg';
import EmptyFavorite from '@/assets/icon/empty_bookmark.svg';
import PlusBtn from '@/assets/icon/plusBtn.svg';
import TrashCan from '@/assets/icon/trashcan.svg';
import FullThumbsUp from '@/assets/icon/thumbs_up.svg';
import EmptyThumbsUp from '@/assets/icon/empty_thumbs_up.svg';
import NewsInputModal from '@/components/funding/NewsInputModal';

interface Review {
  id: number;
  rating: number;
  date: string;
  author: string;
  content: string;
  likes: number;
  images?: string[];
}

interface Message {
  id: number;
  user: string;
  time: string;
  content: string;
  isAuthor: boolean;
}

interface MessageItemProps {
  message: Message;
  isAuthor?: boolean;
}

const ProductPage = () => {
  const [selectedTab, setSelectedTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isFavoriteAuthor, setIsFavoriteAuthor] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: '유저 이름',
      time: '1분전',
      content:
        '맛집내용\n1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
      isAuthor: true,
    },
    {
      id: 2,
      user: '유저 이름',
      time: '2분전',
      content:
        '맛집내용\n1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
      isAuthor: false,
    },
    {
      id: 3,
      user: '유저 이름',
      time: '4분전',
      content:
        '맛집내용\n1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
      isAuthor: true,
    },
    {
      id: 4,
      user: '유저 이름',
      time: '5분전',
      content:
        '맛집내용\n1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
      isAuthor: false,
    },
  ]);
  // State 추가 (기존 state들 아래에 추가)
  const [expandedReviews, setExpandedReviews] = useState<
    Record<number, boolean>
  >({});

  // 1. State 추가 (기존 state들과 함께)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // 2. 이미지 네비게이션 함수들 추가
  const goToPrevious = (): void => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1,
    );
  };

  const goToNext = (): void => {
    setCurrentImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1,
    );
  };

  const goToImage = (index: number): void => {
    setCurrentImageIndex(index);
  };

  // 3. 함수들 타입 지정
  const toggleReview = (reviewId: number): void => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const getTruncatedContent = (
    content: string,
    maxLength: number = 50,
  ): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };
  const productImages = [
    '/productImages/funding1.png',
    '/productImages/funding2.png',
    '/productImages/funding3.png',
    '/productImages/funding4.png',
  ];

  const reviews: Review[] = [
    {
      id: 1,
      rating: 5,
      date: '2024/09/25',
      author: '홍길동',
      content: '정말 좋은 제품입니다! 아주 좋아용 !',
      likes: 0,
    },
    {
      id: 2,
      rating: 5,
      date: '2024/09/25',
      author: '손영웅',
      content:
        '배송이 정말 빨라서 좋습니다~ 12342152352341234215235234123421523523412342152352341234215235234123421523523412342152352341234215235234123421523523412342152352341234215235234123421523523412342152352341234215235234123421523523412342152352341234215235234123421523523412342152352341234215235234123421523523412342152352341234215235234',
      likes: 25,
      images: ['/api/placeholder/200/200'],
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        user: '유저 이름',
        time: '방금전',
        content: newMessage,
        isAuthor: false,
      };
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage('');
    }
  };

  const MessageItem = ({ message, isAuthor = false }: MessageItemProps) => {
    return (
      <div
        className={`p-4 rounded-lg border ${
          isAuthor
            ? 'bg-green-50 border-green-200 ml-4'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-600">👤</span>
            </div>
            <div>
              <div className="font-medium text-sm">{message.user}</div>
              <div className="text-xs text-gray-500">{message.time}</div>
            </div>
          </div>
          <div className="flex gap-3">
            {isAuthor && (
              <button className="px-3 py-1 bg-green-600 text-white text-xs rounded transition-colors">
                작가
              </button>
            )}
            {
              // 자신인지 판별하는 코드 &&
              <button className="hover:cursor-pointer">
                <TrashCan />
              </button>
            }
          </div>
        </div>

        <div className="text-sm text-gray-800 leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image (화살표 제거) */}
            <div className="bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={productImages[currentImageIndex]}
                alt="Product main image"
                className="w-full h-full object-cover"
                width={645}
                height={450}
              />
            </div>

            {/* Thumbnail Gallery with Navigation */}
            {/* Thumbnail Gallery with Navigation */}
            <div className="flex items-center justify-center space-x-2">
              {/* Left Arrow */}
              <button
                onClick={goToPrevious}
                className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all border"
                disabled={productImages.length <= 1}
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Thumbnail Images Container */}
              <div
                className="flex space-x-2 justify-center"
                style={{ width: '460px' }}
              >
                {productImages.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className={`bg-gray-200 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-primary shadow-md'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => goToImage(index)}
                  >
                    <Image
                      src={image}
                      alt={`Product image ${index + 1}`}
                      width={111}
                      height={62}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={goToNext}
                className="bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all border"
                disabled={productImages.length <= 1}
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 ml-[92px]">
            <div>
              <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-[6px] mb-2">
                카테고리
              </span>
              <h1 className="font-bold text-gray-900 mb-4">제품명</h1>
            </div>

            <div className="space-y-2 grid gap-7 text-[26px]">
              <div>
                <p>모인 금액</p>
                <div className="flex gap-20">
                  <div className="text-3xl font-bold text-gray-900">
                    1,000,000<span className="text-[18px] font-normal">원</span>
                  </div>
                  <div className="text-gray-500 font-normal self-end">
                    목표 금액 1,500,000원
                  </div>
                </div>
              </div>
              <div>
                <p>남은 기간</p>
                <div className=" font-bold text-gray-900">
                  10<span className="text-[18px] font-normal">일</span>
                </div>
              </div>
              <div>
                <p>후원자</p>
                <div className="font-bold text-gray-900">
                  112<span className="text-[18px] font-normal">명</span>
                </div>
              </div>
            </div>

            <div className="space-x-3 flex gap-7">
              <button className="max-w-[162px] w-full bg-white border-1 border-primary text-primary py-3 px-6 rounded-[6px] text-[25px] font-bold hover:bg-green-50 transition-colors">
                장바구니
              </button>
              <button className="max-w-[162px] w-full bg-primary text-white py-3 px-6 rounded-[6px] hover:bg-primary-60 transition-colors text-[25px] font-bold">
                예약 구매
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 border rounded-lg transition-colors border-gray-300`}
              >
                {isWishlisted ? <FullHeart /> : <EmptyHeart />}
              </button>
            </div>
          </div>
        </div>

        {/* Product Tabs & Reviews */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Product Tabs */}
          <div className="bg-white rounded-lg shadow-sm w-full max-w-[760px]">
            <div>
              <nav className="flex text-4 font-semibold ">
                <button
                  onClick={() => setSelectedTab('description')}
                  className={`flex-1 px-6 py-2 border-1 border-tertiary ${
                    selectedTab === 'description'
                      ? ' bg-tertiary text-white'
                      : ' text-tertiary hover:bg-tertiary-20'
                  }`}
                >
                  프로젝트 소개
                </button>
                <button
                  onClick={() => setSelectedTab('details')}
                  className={`flex-1 px-6 py-2 border-1 border-tertiary ${
                    selectedTab === 'details'
                      ? ' bg-tertiary text-white'
                      : ' text-tertiary hover:bg-tertiary-20'
                  }`}
                >
                  새 소식
                </button>
                <button
                  onClick={() => setSelectedTab('shipping')}
                  className={`flex-1 px-6 py-2 border-1 border-tertiary ${
                    selectedTab === 'shipping'
                      ? ' bg-tertiary text-white'
                      : ' text-tertiary hover:bg-tertiary-20'
                  }`}
                >
                  커뮤니티
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
              {/* Reviews Section */}
              {selectedTab === 'details' && (
                <div className="bg-white rounded-lg shadow-sm flex flex-col">
                  <div className="ml-auto">
                    <NewsInputModal />
                  </div>
                  <div className="space-y-6 p-6">
                    {reviews.map((review) => {
                      const isExpanded = expandedReviews[review.id] || false;
                      const displayContent = isExpanded
                        ? review.content
                        : getTruncatedContent(review.content, 50);

                      return (
                        <div
                          key={review.id}
                          className="bg-green-50 rounded-lg px-6 pt-6 pb-2"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex flex-col gap-1">
                                <h2 className="font-bold text-2xl">
                                  업데이트 제목이 들어올 자리입니다.
                                </h2>
                                <div className="text-sm text-gray-600">
                                  {review.date} | {review.author}
                                </div>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4 leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap">
                            {displayContent}
                          </p>

                          {review.images && (
                            <div className="mb-4">
                              <div className="bg-gray-200 w-32 h-32 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                                이미지
                              </div>
                            </div>
                          )}

                          <div className="items-center">
                            <div className="flex">
                              <button className="flex items-center space-x-2 text-primary hover:text-primary w-9 h-9">
                                <FullThumbsUp className="w-5 h-5" />
                                <span className="text-sm font-semibold">
                                  {review.likes}
                                </span>
                              </button>
                              <button
                                onClick={() => toggleReview(review.id)}
                                className="ml-auto text-primary text-[14px] hover:underline"
                              >
                                {isExpanded ? '접기' : '자세히 보기'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {selectedTab === 'shipping' && (
                <div className="max-w-2xl mx-automin-h-screen">
                  <div className="p-4 space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="space-y-3">
                        <MessageItem message={message} />
                        {message.isAuthor && (
                          <MessageItem
                            message={{
                              ...message,
                              time: message.time,
                              content: `맛집내용\n1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890`,
                            }}
                            isAuthor={true}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-200 h-[1px] w-[100%] my-[40px]"></div>
                  {/* Bottom Section */}
                  <div className="p-4">
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-800 mb-3">댓글</h3>
                    </div>

                    <div className="flex gap-2 items-end">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="댓글을 남겨주세요..."
                          className="w-full px-4 py-3 rounded-[22px] border border-gray-400 bg-primary-20 text-sm"
                          onKeyPress={(e) =>
                            e.key === 'Enter' && handleSendMessage()
                          }
                        />
                      </div>
                      <button onClick={handleSendMessage}>
                        <PlusBtn />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Author Info & Reviews */}
          <div className="space-y-8 ml-[92px]">
            {/* Author Info */}
            <div className="bg-green-50 p-6 rounded-lg max-w-[366px] flex flex-col">
              <div className="text-center mb-4">
                <div className="flex">
                  <h3 className="font-semibold">작가 소개</h3>
                  <button
                    className="ml-auto"
                    onClick={() => setIsFavoriteAuthor((prev) => !prev)}
                  >
                    {isFavoriteAuthor ? <Favorite /> : <EmptyFavorite />}
                  </button>
                </div>
                <div className="w-16 h-16 bg-green-200 rounded-full mx-auto mb-2"></div>
                <h2 className="font-bold">작가 이름</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                작가님은 뉴욕에 거주하며 한국과의 문화적 교류를 통해 독특한
                관점에서 작품을 만들어내는 동시에 뉴욕 현지에서 활발한 예술
                활동을 하고 있습니다. 다양한 매체를 통해 한국과 미국의 문화를
                연결하는 작업을 하고 있습니다.
              </p>
              <button className="mt-4 border p-2 rounded-[4px] ml-auto  bg-white text-primary hover:underline">
                작가페이지→
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
