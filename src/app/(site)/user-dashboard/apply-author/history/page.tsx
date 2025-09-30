'use client';

import { useState } from 'react';

interface Application {
  id: number;
  artistName: string;
  applicationDate: string;
  status: '거절' | '승인';
  canEdit: boolean;
}

export default function MyPage() {
  const [applications] = useState<Application[]>([
    {
      id: 1,
      artistName: '모리모리',
      applicationDate: '25.09.19',
      status: '거절',
      canEdit: false,
    },
    {
      id: 2,
      artistName: '모리모리모리',
      applicationDate: '25.09.25',
      status: '승인',
      canEdit: false,
    },
  ]);

  const handleDetailClick = (id: number) => {
    console.log(`상세보기 클릭: ${id}`);
    // 상세보기 로직 구현
  };

  return (
    <div className="px-6 py-10 w-1/2 mx-auto">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
          <h2 className="text-2xl font-semibold text-[#2c3e2c]">신청 내역</h2>
          <p className="text-sm text-primary">
            ** 정보 수정은 &apos;심사중&apos;으로 상태가 변경되기 전까지만
            가능합니다.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="">
                <tr>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-600 border-b-2 border-gray-200">
                    신청번호
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-600 border-b-2 border-gray-200">
                    작가명
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-600 border-b-2 border-gray-200">
                    신청일
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-600 border-b-2 border-gray-200">
                    상태
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-600 border-b-2 border-gray-200">
                    정보 수정
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-600 border-b-2 border-gray-200">
                    상세보기
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td
                      className={`px-4 py-5 text-center text-sm ${
                        index !== applications.length - 1
                          ? 'border-b border-gray-100'
                          : ''
                      }`}
                    >
                      {app.id}
                    </td>
                    <td
                      className={`px-4 py-5 text-center text-sm ${
                        index !== applications.length - 1
                          ? 'border-b border-gray-100'
                          : ''
                      }`}
                    >
                      {app.artistName}
                    </td>
                    <td
                      className={`px-4 py-5 text-center text-sm ${
                        index !== applications.length - 1
                          ? 'border-b border-gray-100'
                          : ''
                      }`}
                    >
                      {app.applicationDate}
                    </td>
                    <td
                      className={`px-4 py-5 text-center text-sm font-medium ${
                        index !== applications.length - 1
                          ? 'border-b border-gray-100'
                          : ''
                      } ${
                        app.status === '승인'
                          ? 'text-[#5a8f5a]'
                          : 'text-red-500'
                      }`}
                    >
                      {app.status}
                    </td>
                    <td
                      className={`px-4 py-5 text-center text-sm text-gray-400 ${
                        index !== applications.length - 1
                          ? 'border-b border-gray-100'
                          : ''
                      }`}
                    >
                      -
                    </td>
                    <td
                      className={`px-4 py-5 text-center ${
                        index !== applications.length - 1
                          ? 'border-b border-gray-100'
                          : ''
                      }`}
                    >
                      <button
                        onClick={() => handleDetailClick(app.id)}
                        className="px-5 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-gray-400 transition-all"
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
