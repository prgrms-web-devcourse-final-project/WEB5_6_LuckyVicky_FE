'use client';

import { useState } from 'react';

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    name: '홍길동',
    email: 'abc123@abc.com',
    phone: '010-1234-5678',
    artistName: '모리모리',
    businessNumber: ['123', '45', '67890'],
    businessFile: null as File | null,
    businessFileName: '사업자등록증.jpg',
    registrationNumber: '2025-서울강남-1234',
    registrationFile: null as File | null,
    registrationFileName: '통신판매업신고증.jpg',
    zipCode: '12345',
    address: '서울특별시 강남구 테헤란로 123',
    addressDetail: '2층',
    categories: {
      sticker: true,
      memo: true,
      note: false,
      accessory: false,
      digitalTemplate: false,
      digitalWallpaper: false,
    },
    snsId: 'morimori_official',
    portfolioFile: null as File | null,
    portfolioFileName: '포트폴리오.pdf',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBusinessNumberChange = (index: number, value: string) => {
    const newBusinessNumber = [...formData.businessNumber];
    newBusinessNumber[index] = value;
    setFormData((prev) => ({ ...prev, businessNumber: newBusinessNumber }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: !prev.categories[category as keyof typeof prev.categories],
      },
    }));
  };

  const handleFileChange = (
    field: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [field]: file,
        [`${field}Name`]: file.name,
      }));
    }
  };

  const handleAddressSearch = () => {
    console.log('주소 검색');
    // 주소 검색 API 연동
  };

  const handleCancel = () => {
    console.log('취소');
  };

  const handleSubmit = () => {
    console.log('입점 신청', formData);
  };

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto w-full">
      <h2 className="text-3xl font-bold text-[#2c3e2c] mb-8">신청하기</h2>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="space-y-6">
          {/* 성명 */}
          <div className="flex items-center border-b border-gray-200 pb-6">
            <label className="w-40 text-sm font-medium text-gray-700">
              성명
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* 이메일 */}
          <div className="flex items-center border-b border-gray-200 pb-6">
            <label className="w-40 text-sm font-medium text-gray-700">
              이메일
            </label>
            <div className="flex-1 flex items-center gap-4">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <span className="text-sm text-gray-500">
                ** 입점 심사 결과를 메일로 안내드립니다.
              </span>
            </div>
          </div>

          {/* 전화번호 */}
          <div className="flex items-center border-b border-gray-200 pb-6">
            <label className="w-40 text-sm font-medium text-gray-700">
              전화번호
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* 작가명 */}
          <div className="flex items-center border-b border-gray-200 pb-6">
            <label className="w-40 text-sm font-medium text-gray-700">
              작가명
            </label>
            <div className="flex-1 flex items-center gap-4">
              <input
                type="text"
                value={formData.artistName}
                onChange={(e) =>
                  handleInputChange('artistName', e.target.value)
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
                중복확인
              </button>
              <span className="text-sm text-gray-500">
                중복 확인이 완료되었습니다.
              </span>
            </div>
          </div>

          {/* 사업자등록번호 */}
          <div className="flex items-start border-b border-gray-200 pb-6">
            <label className="w-40 text-sm font-medium text-gray-700 pt-2">
              사업자등록번호
            </label>
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={formData.businessNumber[0]}
                onChange={(e) => handleBusinessNumberChange(0, e.target.value)}
                className="w-20 px-4 py-2 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                maxLength={3}
              />
              <span className="text-gray-400">-</span>
              <input
                type="text"
                value={formData.businessNumber[1]}
                onChange={(e) => handleBusinessNumberChange(1, e.target.value)}
                className="w-20 px-4 py-2 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                maxLength={2}
              />
              <span className="text-gray-400">-</span>
              <input
                type="text"
                value={formData.businessNumber[2]}
                onChange={(e) => handleBusinessNumberChange(2, e.target.value)}
                className="w-24 px-4 py-2 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                maxLength={5}
              />
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
                인증
              </button>
              <span className="text-sm text-gray-500">
                인증이 완료되었습니다.
              </span>
            </div>
          </div>

          {/* 사업자등록증 사본 */}
          <div className="flex items-center border-b border-gray-200 pb-6">
            <label className="w-40 text-sm font-medium text-gray-700 flex items-center gap-1">
              사업자등록증 사본
              <span className="text-gray-400 text-xs">ⓘ</span>
            </label>
            <div className="flex-1 flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {formData.businessFileName}
              </span>
              <label className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm cursor-pointer hover:bg-gray-50 transition-colors">
                파일 선택
                <input
                  type="file"
                  onChange={(e) => handleFileChange('businessFile', e)}
                  className="hidden"
                  accept="image/*,.pdf"
                />
              </label>
            </div>
          </div>

          {/* 통신판매업신고번호 */}
          <div className="flex items-center border-b border-gray-200 pb-6">
            <label className="w-40 text-sm font-medium text-gray-700">
              통신판매업신고번호
            </label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) =>
                handleInputChange('registrationNumber', e.target.value)
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* 통신판매업신고증 사본 */}
          <div className="flex items-center border-b border-gray-200 pb-6">
            <label className="w-40 text-sm font-medium text-gray-700 flex items-center gap-1">
              통신판매업신고증 사본
              <span className="text-gray-400 text-xs">ⓘ</span>
            </label>
            <div className="flex-1 flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {formData.registrationFileName}
              </span>
              <label className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm cursor-pointer hover:bg-gray-50 transition-colors">
                파일 선택
                <input
                  type="file"
                  onChange={(e) => handleFileChange('registrationFile', e)}
                  className="hidden"
                  accept="image/*,.pdf"
                />
              </label>
            </div>
          </div>

          {/* 사업장 소재지 */}
          <div className="flex items-start border-b border-gray-200 pb-6">
            <label className="w-40 text-sm font-medium text-gray-700 pt-2">
              사업장 소재지
            </label>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="w-32 px-4 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  readOnly
                />
                <button
                  onClick={handleAddressSearch}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                >
                  주소 검색
                </button>
              </div>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                readOnly
              />
              <input
                type="text"
                value={formData.addressDetail}
                onChange={(e) =>
                  handleInputChange('addressDetail', e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="상세주소 입력"
              />
            </div>
          </div>

          {/* 주요 판매 품목 */}
          <div className="flex items-start border-b border-gray-200 pb-6">
            <label className="w-40 text-sm font-medium text-gray-700 pt-2">
              주요 판매 품목
            </label>
            <div className="flex-1 flex flex-wrap gap-3">
              {[
                { key: 'sticker', label: '스티커' },
                { key: 'memo', label: '메모지' },
                { key: 'note', label: '노트' },
                { key: 'accessory', label: '액세서리' },
                { key: 'digitalTemplate', label: '기타 문구류' },
                { key: 'digitalWallpaper', label: '디지털 문구' },
              ].map((category) => (
                <label
                  key={category.key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={
                        formData.categories[
                          category.key as keyof typeof formData.categories
                        ]
                      }
                      onChange={() => handleCategoryChange(category.key)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-primary rounded flex items-center justify-center peer-checked:bg-primary transition-colors">
                      <svg
                        className="w-3 h-3 text-white hidden peer-checked:block"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm text-gray-700">
                    {category.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* SNS 아이디 */}
          <div className="flex items-center border-b border-gray-200 pb-6">
            <label className="w-40 text-sm font-medium text-gray-700">
              SNS 아이디
            </label>
            <div className="flex-1 flex items-center gap-2">
              <span className="text-gray-600">@</span>
              <input
                type="text"
                value={formData.snsId}
                onChange={(e) => handleInputChange('snsId', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* 포트폴리오 */}
          <div className="flex items-center pb-6">
            <label className="w-40 text-sm font-medium text-gray-700 flex items-center gap-1">
              포트폴리오
              <span className="text-gray-400 text-xs">ⓘ</span>
            </label>
            <div className="flex-1 flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {formData.portfolioFileName}
              </span>
              <label className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm cursor-pointer hover:bg-gray-50 transition-colors">
                파일 선택
                <input
                  type="file"
                  onChange={(e) => handleFileChange('portfolioFile', e)}
                  className="hidden"
                  accept=".pdf,.ppt,.pptx"
                />
              </label>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-8 py-2.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            입점 신청
          </button>
        </div>
      </div>
    </div>
  );
}
