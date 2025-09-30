'use client';

import { AuthorCard } from '@/components/user-dashboard/AuthorCard';
import { useState } from 'react';

export default function FollowingAuthors() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const authors = [
    { id: 1, name: '작가명입니다', profileImage: undefined },
    { id: 2, name: '작가명입니다', profileImage: undefined },
    { id: 3, name: '작가명입니다', profileImage: undefined },
    { id: 4, name: '작가명입니다', profileImage: undefined },
    { id: 5, name: '작가명입니다', profileImage: undefined },
    { id: 6, name: '작가명입니다', profileImage: undefined },
    { id: 7, name: '작가명입니다', profileImage: undefined },
    { id: 8, name: '작가명입니다', profileImage: undefined },
  ];

  const handleFollow = (id: number) => {
    console.log('팔로잉 토글:', id);
  };

  return (
    <div className="p-12 bg-white min-h-screen mx-auto">
      <h1 className="text-3xl font-bold mb-8">팔로우하는 작가</h1>

      {/* 작가 그리드 */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {authors.map((author) => (
          <AuthorCard
            key={author.id}
            id={author.id}
            name={author.name}
            profileImage={author.profileImage}
            onFollow={handleFollow}
          />
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
                  ? 'text-green-600 font-bold underline'
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
