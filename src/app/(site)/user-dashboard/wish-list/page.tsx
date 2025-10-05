'use client';

import Image from 'next/image';
import { useState } from 'react';

const products = [
  {
    id: 1,
    img: '/productImages/funding1.png',
    title: '상품이름',
    brand: '브랜드명',
    discount: 'nn%',
    price: '10,000',
    originalPrice: '20,000',
    rating: '4.5',
  },
  {
    id: 2,
    img: '/productImages/funding1.png',
    title: '상품이름',
    brand: '브랜드명',
    discount: 'nn%',
    price: '10,000',
    originalPrice: '20,000',
    rating: '4.5',
  },
  {
    id: 3,
    img: '/productImages/funding1.png',
    title: '상품이름',
    brand: '브랜드명',
    discount: 'nn%',
    price: '10,000',
    originalPrice: '20,000',
    rating: '4.5',
  },
  {
    id: 4,
    img: '/productImages/funding2.png',
    title: '상품이름',
    brand: '브랜드명',
    discount: 'nn%',
    price: '10,000',
    originalPrice: '20,000',
    rating: '4.5',
  },
  {
    id: 5,
    img: '/productImages/funding3.png',
    title: '상품이름',
    brand: '브랜드명',
    discount: 'nn%',
    price: '10,000',
    originalPrice: '20,000',
    rating: '4.5',
  },
  {
    id: 6,
    img: '/productImages/funding2.png',
    title: '상품이름',
    brand: '브랜드명',
    discount: 'nn%',
    price: '10,000',
    originalPrice: '20,000',
    rating: '4.5',
  },
];

export default function WishList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [likedItems, setLikedItems] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8,
  ]);
  const totalPages = 5;

  const toggleLike = (id: number) => {
    if (likedItems.includes(id)) {
      setLikedItems(likedItems.filter((item) => item !== id));
    } else {
      setLikedItems([...likedItems, id]);
    }
  };

  return (
    <div className="p-12 bg-white min-h-screen mx-auto">
      <h1 className="text-3xl font-bold mb-8">찜한 상품 목록</h1>

      {/* 상품 그리드 */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {products.map((product) => (
          <article key={product.id} className="relative">
            <div className="relative">
              <Image
                src={product.img}
                alt={product.title}
                width={230}
                height={230}
                className="w-full h-[280px] object-cover rounded"
              />
            </div>

            <div className="mt-5">
              <div className="flex">
                <div>
                  <div className="text-gray-400 text-sm">{product.brand}</div>
                  <div className="text-lg mt-1 font-medium">
                    {product.title}
                  </div>
                </div>
                <button
                  onClick={() => toggleLike(product.id)}
                  className="w-10 h-10 flex items-center ml-auto"
                >
                  <svg
                    className={`w-8 h-8 ${
                      likedItems.includes(product.id)
                        ? 'fill-primary stroke-primary'
                        : 'fill-none stroke-gray-400'
                    }`}
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex flex-wrap items-center mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">
                    {product.discount}
                  </span>
                  <span className="text-xl font-bold">{product.price}</span>
                  <span className="text-lg text-gray-400 line-through mr-5">
                    {product.originalPrice}
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-5 h-5"
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

        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded ${
                currentPage === page
                  ? 'text-primary font-bold underline'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-5 h-5"
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
  );
}
