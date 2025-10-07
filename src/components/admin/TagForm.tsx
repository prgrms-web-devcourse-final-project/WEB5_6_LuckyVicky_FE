'use client';

import { useRef, useState } from 'react';

import Button from '@/components/Button';
import { createTagAction } from '@/app/admin/(dashboard)/products/tags/action';
import { useRouter } from 'next/navigation';

export default function TagForm() {
  const router = useRouter();
  const [tagName, setTagName] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, _setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = tagName.trim();
    if (!name) {
      setMsg('태그명을 입력해주세요.');
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append('tagName', name);

      const res = await createTagAction(fd);
      if (res.success) {
        setMsg('태그가 등록되었습니다');
        setTagName('');
        inputRef.current?.focus();

        router.refresh(); // 서버 컴포넌트(태그 목록) 즉시 갱신
      } else {
        setMsg(`❌ ${res.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="mb-1 block text-sm" htmlFor="tagName">태그 이름</label>
      <div className="flex items-center gap-3">
        <input
          id="tagName"
          ref={inputRef}
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="예) 모던"
          className="rounded border px-3 py-2"
          disabled={loading}
        />
        <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? '등록 중…' : '등록'}
        </Button>
        {msg && <span className="text-sm text-green-700">{msg}</span>}
        {err && <span className="text-sm text-red-600">{err}</span>}
      </div>
    </form>
  );
}
