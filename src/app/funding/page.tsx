'use client';

import React, { useState, useEffect } from 'react';
import FundingCard from '@/components/funding/FundingCard';

function Funding() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const categories = [
    { name: '스티커', count: 999 },
    { name: '메모지', count: 999 },
    { name: '노트', count: 999 },
    { name: '액세서리', count: 99 },
    { name: '디지털 문구', count: 99 },
  ];

  // 히어로 섹션 이미지들
  const heroImages = [
    { id: 1, title: '펀딩 설명 히어로 섹션 1', bg: 'bg-gray-300' },
    { id: 2, title: '펀딩 설명 히어로 섹션 2', bg: 'bg-blue-300' },
    { id: 3, title: '펀딩 설명 히어로 섹션 3', bg: 'bg-green-300' },
    { id: 4, title: '펀딩 설명 히어로 섹션 4', bg: 'bg-purple-300' },
  ];

  // 슬라이더용 더미 데이터 (4개씩 페이징)
  const popularFundings = Array.from({ length: 8 }, (_, index) => ({
    id: index,
  }));
  const itemsPerPage = 4;
  const totalPages = Math.ceil(popularFundings.length / itemsPerPage);

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName],
    );
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  // 히어로 섹션 슬라이더 함수들
  const goToPrevHeroSlide = () => {
    setCurrentHeroSlide((prev) =>
      prev === 0 ? heroImages.length - 1 : prev - 1,
    );
  };

  const goToNextHeroSlide = () => {
    setCurrentHeroSlide((prev) =>
      prev === heroImages.length - 1 ? 0 : prev + 1,
    );
  };

  // 5초마다 자동으로 히어로 슬라이드 넘기기
  useEffect(() => {
    const autoSlideInterval = setInterval(() => {
      setCurrentHeroSlide((prev) =>
        prev === heroImages.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(autoSlideInterval);
  }, [heroImages.length]);

  return (
    <>
      {/* Hero Section with Slider */}
      <section className="w-full h-[300px] relative overflow-hidden">
        {/* Hero Image Slider */}
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{
            transform: `translateX(-${currentHeroSlide * 100}%)`,
          }}
        >
          {heroImages.map((hero, index) => (
            <div
              key={hero.id}
              className={`min-w-full h-full ${hero.bg} flex items-center justify-center`}
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-700 mb-4">
                  {hero.title}
                </h1>
              </div>
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={goToPrevHeroSlide}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
        >
          <svg
            className="w-6 h-6 text-gray-600"
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

        {/* Right Arrow */}
        <button
          onClick={goToNextHeroSlide}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
        >
          <svg
            className="w-6 h-6 text-gray-600"
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

        {/* Hero Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentHeroSlide
                  ? 'bg-green-600'
                  : 'bg-white bg-opacity-50 hover:bg-white hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="w-full grid grid-cols-[250px_1fr] gap-8">
        {/* Sidebar - 전체 높이로 연결 */}
        <aside className="bg-[#f6f4eb] px-[38px] py-[29px] min-h-[calc(100vh-300px)]">
          <div className="space-y-6">
            {/* 진행 상황 */}
            <div>
              <h2 className="font-bold text-[18px] mb-3">진행 상황</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">진행 중</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">종료</span>
                </label>
              </div>
            </div>

            {/* 가격대 */}
            <div>
              <h2 className="font-bold text-[18px] mb-3">가격대</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">10,000원 이하</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">10,000~30,000원</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">30,000원~50,000원</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">50,000원 이상</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex flex-col items-center px-4">
          {/* Category Filter Buttons */}
          <div className="flex gap-3 my-8">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => toggleCategory(category.name)}
                className={`border rounded-[20px] px-4 py-2 text-sm transition-colors ${
                  selectedCategories.includes(category.name)
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-gray-300 text-gray-600 hover:border-green-600 hover:text-green-600'
                }`}
              >
                {category.name}({category.count})
              </button>
            ))}
          </div>

          {/* 인기 펀딩 섹션 */}
          <div className="mb-12 w-full max-w-5xl">
            <h2 className="text-[32px] font-bold mb-6 text-left">인기 펀딩</h2>

            {/* 슬라이더 컨테이너 */}
            <div className="relative">
              {/* 왼쪽 화살표 */}
              <button
                onClick={goToPrevSlide}
                className="absolute left-[-60px] top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
                disabled={totalPages <= 1}
              >
                <svg
                  className="w-6 h-6 text-gray-600"
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

              {/* 카드 슬라이더 - 4개씩 고정, 그리드와 동일한 크기 */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                  }}
                >
                  {Array.from({ length: totalPages }, (_, pageIndex) => (
                    <div
                      key={pageIndex}
                      className="grid grid-cols-4 gap-6 min-w-full"
                    >
                      {popularFundings
                        .slice(
                          pageIndex * itemsPerPage,
                          (pageIndex + 1) * itemsPerPage,
                        )
                        .map((_, cardIndex) => (
                          <div key={cardIndex}>
                            <FundingCard />
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* 오른쪽 화살표 */}
              <button
                onClick={goToNextSlide}
                className="absolute right-[-60px] top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
                disabled={totalPages <= 1}
              >
                <svg
                  className="w-6 h-6 text-gray-600"
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

          {/* 구분선 */}
          <div className="bg-gray-200 h-[1px] w-full max-w-5xl my-8"></div>

          {/* 정렬 옵션 */}
          <div className="mb-6 w-full max-w-5xl">
            <div className="relative">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg
                  className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
                <span className="font-medium">인기순</span>
              </button>

              {isExpanded && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 py-2 z-10 min-w-[120px]">
                  <button className="block w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                    인기순
                  </button>
                  <button className="block w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                    최신순
                  </button>
                  <button className="block w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                    리뷰 많은순
                  </button>
                  <button className="block w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                    별점 높은순
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 전체 펀딩 카드 그리드 */}
          <div className="grid grid-cols-4 gap-6 mb-10 w-full max-w-5xl">
            {Array.from({ length: 12 }, (_, index) => (
              <FundingCard key={index} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default Funding;
