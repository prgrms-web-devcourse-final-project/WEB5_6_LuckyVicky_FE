'use client';
import { useState } from 'react';
import NoticeEditor from '@/components/editor/NoticeEditor';

import Paperclip from '@/assets/icon/paperclip2.svg';

export default function NoticeCreatePage() {
  const [title, setTitle] = useState('');
  const [html, setHtml] = useState(''); // 에디터 결과
  const [files, setFiles] = useState<File[]>([]);
  const [priority, setPriority] = useState<'important' | 'normal'>('normal');

  return (
    <main className="mt-[94px] mb-4 flex flex-col">
      <h1 className="mb-[30px] text-2xl font-bold">공지사항 작성</h1>
      <hr />
      {/* 중요도 라디오 */}
      <fieldset className="flex items-center my-[13px] gap-6">
        <span>중요도</span>

        {/* 중요 */}
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="priority"
            value="important"
            checked={priority === 'important'}
            onChange={() => setPriority('important')}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
          <span>중요</span>
        </label>

        {/* 일반 */}
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="priority"
            value="normal"
            checked={priority === 'normal'}
            onChange={() => setPriority('normal')}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
          <span>일반</span>
        </label>
      </fieldset>
      <hr />
      {/* 제목 */}
      <label className="flex items-center my-[13px] gap-6">
        <span className="shrink-0 whitespace-nowrap">제목</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2"
        />
      </label>
      <hr />
      {/* 에디터 */}
      <div className="my-[13px]">
        <span>내용</span>
        <div className="my-[13px]">
          <NoticeEditor onChange={setHtml} onUploadImage={uploadToS3} />
        </div>
      </div>
      <hr />
      {/* 첨부파일 */}
      <div className="my-[13px] flex items-center gap-3">
        <div className="flex items-center gap-0.5">
          <span className="shrink-0">첨부파일</span>
          <Paperclip className="block size-4 overflow-visible text-[var(--color-gray-200)] shrink-0" />
        </div>
        <div className="relative flex-1">
          <input
            id="fileInput"
            type="file"
            multiple
            className="sr-only"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
          <input
            type="text"
            readOnly
            value={
              files.length === 0
                ? ''
                : files.length === 1
                  ? files[0].name
                  : `${files[0].name} 외 ${files.length - 1}개`
            }
            placeholder="파일을 선택하세요"
            className="w-full rounded border border-[var(--color-gray-200)] px-3 py-2 pr-24 leading-none"
            onClick={() => document.getElementById('fileInput')?.click()}
          />
          {files.length > 0 ? (
            <button
              type="button"
              onClick={() => setFiles([])}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-[var(--color-primary)] px-3 py-1 text-sm leading-none"
            >
              파일 삭제
            </button>
          ) : (
            <label
              htmlFor="fileInput"
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded border border-[var(--color-primary)] px-3 py-1 text-sm leading-none"
            >
              파일 선택
            </label>
          )}
        </div>
      </div>

      <div className="flex self-end gap-2">
        <button className="rounded border px-4 py-2">작성취소</button>
        <button
          className="rounded bg-[var(--color-primary)] px-4 py-2 text-white"
          onClick={async () => {
            // 서버로 전송
            await fetch('/api/notices', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title, bodyHtml: html, attachments: [] }),
            });
          }}
        >
          작성하기
        </button>
      </div>
    </main>
  );
}

// S3 프리사인드 URL 업로드
async function uploadToS3(file: File): Promise<string> {
  // 1) 서버에서 presigned URL 요청
  const { url, key } = await (
    await fetch('/api/uploads/presign', {
      method: 'POST',
      body: JSON.stringify({ filename: file.name, type: file.type }),
    })
  ).json();
  // 2) 해당 URL로 PUT 업로드
  await fetch(url, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });
  // 3) 퍼블릭 접근 URL 반환
  return `${process.env.NEXT_PUBLIC_CDN}/${key}`;
}
