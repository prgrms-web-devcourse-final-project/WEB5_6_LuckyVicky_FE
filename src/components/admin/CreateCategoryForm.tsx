'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { createCategory } from '@/services/categories';

export default function CreateCategoryForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null); setErr(null); setLoading(true);
    try {
      const data = await createCategory({
        categoryName: name.trim(),
        parentId: parentId === '' ? null : Number(parentId),
      });
      setMsg(`등록 성공: [${data.id}] ${data.categoryName}`);
      setName(''); setParentId('');
      router.refresh(); // 목록 즉시 갱신
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '등록 실패';
      setErr(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-3">
      <div>
        <label className="mb-1 block text-sm">카테고리 이름</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border px-3 py-2"
          placeholder="예) 스티커, 키링"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm">상위 카테고리 ID (없으면 비움)</label>
        <input
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="w-full rounded border px-3 py-2"
          placeholder="예) 1"
          inputMode="numeric"
        />
      </div>
      <div className="flex items-end gap-2">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? '등록 중…' : '등록'}
        </Button>
        {msg && <span className="text-sm text-green-700">{msg}</span>}
        {err && <span className="text-sm text-red-600">{err}</span>}
      </div>
    </form>
  );
}
