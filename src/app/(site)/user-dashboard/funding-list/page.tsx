'use client';

import { useState } from 'react';

const orderData = [
  {
    id: 1,
    orderNumber: '0123157',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=100&h=100&fit=crop',
    status: '상품명입니다 상품명입니다',
    quantity: 1,
    price: '1,000원',
    deliveryStatus: '발송준비중',
    orderDate: '2025. 09. 18',
  },
  {
    id: 2,
    orderNumber: '0123157',
    image:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=100&h=100&fit=crop',
    status: '상품명입니다 상품명입니다',
    quantity: 2,
    price: '8,000원',
    deliveryStatus: '발송준비중',
    orderDate: '2025. 09. 18',
  },
  {
    id: 3,
    orderNumber: '0123157',
    image:
      'https://images.unsplash.com/photo-1587334207976-c52feef1f648?w=100&h=100&fit=crop',
    status: '상품명입니다 상품명입니다',
    quantity: 1,
    price: '8,000원',
    deliveryStatus: '발송준비중',
    orderDate: '2025. 09. 18',
  },
  {
    id: 4,
    orderNumber: '0123157',
    image:
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100&h=100&fit=crop',
    status: '상품명입니다 상품명입니다',
    quantity: 1,
    price: '1,000원',
    deliveryStatus: '발송준비중',
    orderDate: '2025. 09. 18',
  },
];

type SortColumn =
  | 'orderNumber'
  | 'status'
  | 'price'
  | 'deliveryStatus'
  | 'orderDate'
  | null;
type SortDirection = 'asc' | 'desc';

export default function FundingListPage() {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const totalPages = 5;

  const toggleSelectItem = (id: number) => {
    setSelectedItem(selectedItem === id ? null : id);
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  return (
    <div className="p-12 bg-white min-h-screen mx-auto mt-[10vh] max-w-[100vh] w-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-bold">참여한 펀딩 목록</h1>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 bg-primary text-white rounded-md font-medium">
            후원 취소
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          {/* 테이블 헤더 */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-16 px-4 py-4"></th>
              <th className="px-4 py-4 text-left">
                <button
                  onClick={() => handleSort('orderNumber')}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  후원번호
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      sortColumn === 'orderNumber' && sortDirection === 'asc'
                        ? 'rotate-180'
                        : ''
                    }`}
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
              </th>
              <th className="px-4 py-4 text-left">
                <div className="text-sm font-medium text-gray-700">이미지</div>
              </th>
              <th className="px-4 py-4 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  펀딩명
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      sortColumn === 'status' && sortDirection === 'asc'
                        ? 'rotate-180'
                        : ''
                    }`}
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
              </th>
              <th className="px-4 py-4 text-center">
                <div className="text-sm font-medium text-gray-700">수량</div>
              </th>
              <th className="px-4 py-4 text-left">
                <button
                  onClick={() => handleSort('price')}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  후원금액
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      sortColumn === 'price' && sortDirection === 'asc'
                        ? 'rotate-180'
                        : ''
                    }`}
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
              </th>
              <th className="px-4 py-4 text-left">
                <button
                  onClick={() => handleSort('deliveryStatus')}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  펀딩상태
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      sortColumn === 'deliveryStatus' && sortDirection === 'asc'
                        ? 'rotate-180'
                        : ''
                    }`}
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
              </th>
              <th className="px-4 py-4 text-left">
                <button
                  onClick={() => handleSort('orderDate')}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  후원일자
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      sortColumn === 'orderDate' && sortDirection === 'asc'
                        ? 'rotate-180'
                        : ''
                    }`}
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
              </th>
            </tr>
          </thead>

          {/* 테이블 바디 */}
          <tbody>
            {orderData.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
              >
                <td className="px-4 py-4">
                  <button
                    onClick={() => toggleSelectItem(order.id)}
                    className="w-5 h-5 border-2 border-primary rounded-full flex items-center justify-center  mx-auto"
                  >
                    {selectedItem === order.id && (
                      <div className="w-3 h-3 bg-primary rounded-full" />
                    )}
                  </button>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-4">
                  <img
                    src={order.image}
                    alt="상품 이미지"
                    className="w-16 h-16 object-cover rounded border border-gray-200"
                  />
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {order.status}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 text-center">
                  {order.quantity}
                </td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                  {order.price}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {order.deliveryStatus}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {order.orderDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center gap-2 mt-8">
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
                  : 'text-gray-700'
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
