'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function AccountSetting() {
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    passwordConfirm: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('정보 수정하기', formData);
  };

  const handleCancel = () => {
    console.log('취소');
  };

  return (
    <div className="p-12 min-h-screen mx-auto w-full max-w-1/3">
      <h1 className="text-3xl font-bold mb-8">계정 설정</h1>

      {/* 프로필 이미지 섹션 */}
      <div className="flex items-center gap-4 mb-12">
        <div className="w-40 h-40 rounded-full bg-gray-300 overflow-hidden">
          <Image
            src=""
            alt="프로필"
            width={132}
            height={132}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex ml-auto gap-3">
          <button className="px-6 py-2 bg-primary text-white rounded-md font-medium ">
            이미지 업로드
          </button>
          <button className="px-6 py-2 border-2 border-primary text-primary rounded-md font-medium ">
            이미지 삭제
          </button>
        </div>
      </div>

      {/* 폼 섹션 */}
      <div className=" space-y-6">
        {/* 닉네임 */}
        <div>
          <label className="block text-sm font-medium mb-2">닉네임</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            placeholder="닉네임을 입력해주세요."
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-primary-20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 이메일 */}
        <div>
          <label className="block text-sm font-medium mb-2">이메일</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일을 입력해주세요."
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-primary-20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 전화번호 */}
        <div>
          <label className="block text-sm font-medium mb-2">전화번호</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="전화번호를 입력해주세요."
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-primary-20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 주소 */}
        <div>
          <label className="block text-sm font-medium mb-2">주소</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="주소를 입력해주세요."
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-primary-20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block text-sm font-medium mb-2">비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력해주세요."
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-primary-20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            비밀번호 확인
          </label>
          <input
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            placeholder="비밀번호를 한번 더 입력해주세요."
            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-primary-20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3 pt-6">
          <button
            onClick={handleCancel}
            className="px-8 py-3 bg-gray-400 text-white rounded-md font-medium hover:bg-gray-500"
          >
            취소 및 탈퇴
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-primary text-white rounded-md font-medium hover:bg-green-700"
          >
            정보 수정하기
          </button>
        </div>
      </div>
    </div>
  );
}
