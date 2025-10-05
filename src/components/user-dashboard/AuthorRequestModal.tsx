'use client';

import { useState } from 'react';

type ApplicationStatus = '신청완료' | '입점거절';

interface ApplicationDetail {
  artistName: string;
  id: string;
  email: string;
  phone: string;
  businessNumber: string;
  salesReportNumber: string;
  businessAddress: string;
  mainProducts: string;
  snsId: string;
  portfolioFile: string;
  rejectionReason?: string;
}

export default function ApplicationDetailModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [status, setStatus] = useState<ApplicationStatus>('입점거절');

  const applicationData: ApplicationDetail = {
    artistName: status === '신청완료' ? '모리모리모리' : '모리모리',
    id: 'abc123',
    email: 'abc123@abc.com',
    phone: '010-1234-5678',
    businessNumber: '123-45-67890',
    salesReportNumber: '2025-서울강남-1234',
    businessAddress: '서울특별시 강남구 테헤란로 123 2층',
    mainProducts: '스티커, 메모지',
    snsId: '@morimori_official',
    portfolioFile: '포트폴리오.pdf',
    rejectionReason: status === '입점거절' ? '브랜드 컨셉 불일치' : undefined,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">입점 신청 내역 상세보기</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-8 pb-8">
          {/* 프로필 섹션 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {applicationData.artistName}
                </h3>
                <p className="text-gray-600">ID : {applicationData.id}</p>
              </div>
            </div>
            <button
              className={`px-6 py-2.5 rounded border font-medium ${
                status === '입점거절'
                  ? 'border-red-500 text-red-500 hover:bg-red-50'
                  : 'border-primary text-primary hover:bg-green-50'
              }`}
            >
              {status === '입점거절' ? '입점 거절' : '신청완료'}
            </button>
          </div>

          {/* 상세 정보 */}
          <div className="space-y-6">
            <InfoRow label="이메일" value={applicationData.email} />
            <InfoRow label="전화번호" value={applicationData.phone} />

            <div className="flex py-4 border-b border-gray-200">
              <label className="w-48 font-bold text-gray-900 flex-shrink-0">
                사업자등록번호
              </label>
              <div className="flex-1 flex items-center justify-between">
                <span className="text-gray-900">
                  {applicationData.businessNumber}
                </span>
                <button className="text-primary hover:underline text-sm">
                  사업자등록증 사본
                </button>
              </div>
            </div>

            <div className="flex py-4 border-b border-gray-200">
              <label className="w-48 font-bold text-gray-900 flex-shrink-0">
                통신판매업 신고번호
              </label>
              <div className="flex-1 flex items-center justify-between">
                <span className="text-gray-900">
                  {applicationData.salesReportNumber}
                </span>
                <button className="text-primary hover:underline text-sm">
                  신고증 사본
                </button>
              </div>
            </div>

            <InfoRow
              label="사업장소재지"
              value={applicationData.businessAddress}
            />
            <InfoRow
              label="주요 판매 품목"
              value={applicationData.mainProducts}
            />
            <InfoRow label="SNS 아이디" value={applicationData.snsId} />

            <div className="flex py-4 border-b border-gray-200">
              <label className="w-48 font-bold text-gray-900 flex-shrink-0">
                포트폴리오
              </label>
              <button className="flex-1 text-left text-primary hover:underline">
                {applicationData.portfolioFile}
              </button>
            </div>

            {/* 거절 사유 (입점거절 상태일 때만) */}
            {status === '입점거절' && applicationData.rejectionReason && (
              <InfoRow
                label="거절 사유"
                value={applicationData.rejectionReason}
              />
            )}
          </div>

          {/* 하단 버튼 */}
          {status === '신청완료' ? (
            <div className="flex gap-3 mt-8">
              <button className="flex-1 py-3 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium">
                정보 수정
              </button>
              <button className="flex-1 py-3 bg-primary text-white rounded hover:opacity-90 font-medium">
                신청 취소
              </button>
            </div>
          ) : null}

          {/* 상태 토글 버튼 (테스트용) */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">테스트: 상태 변경</p>
            <div className="flex gap-2">
              <button
                onClick={() => setStatus('신청완료')}
                className={`px-4 py-2 rounded text-sm ${
                  status === '신청완료'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                신청완료
              </button>
              <button
                onClick={() => setStatus('입점거절')}
                className={`px-4 py-2 rounded text-sm ${
                  status === '입점거절'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                입점거절
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex py-4 border-b border-gray-200">
      <label className="w-48 font-bold text-gray-900 flex-shrink-0">
        {label}
      </label>
      <span className="flex-1 text-gray-900">{value}</span>
    </div>
  );
}
