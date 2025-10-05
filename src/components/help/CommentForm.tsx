'use client';
import { useState } from 'react';
import DefaultProfile from '@/assets/icon/default_profile.svg';
import Button from '@/components/Button';

export default function CommentForm({
  currentUserName = '현재 접속 유저 닉네임',
  onSubmit,
}: {
  currentUserName?: string;
  onSubmit?: (text: string) => void | Promise<void>;
}) {
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    if (!text.trim()) return;
    try {
      await onSubmit?.(text.trim());
      setText('');
    } catch (e) {
      // 나중에 토스트 알림 띄우기
    }
  };

  return (
    <div className="py-6">
      <div className="flex items-start gap-5">
        <DefaultProfile className="h-10 w-10 shrink-0 overflow-visible" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-5">
            <span className="shrink-0 pt-2 font-semibold">{currentUserName}</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[88px] w-full resize-y rounded border border-[var(--color-gray-200)] p-3 leading-6 placeholder:text-[var(--color-gray-400)]"
              placeholder="댓글을 입력하세요 ..."
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="primary" onClick={handleSubmit}>
              댓글 남기기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
