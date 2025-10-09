
import type { Tag as RemoteTag } from '@/types/tag';

export async function fetchTagsClient(): Promise<RemoteTag[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tags`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'include',
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error('태그 조회 실패');
  }
  const json = (await res.json()) as { resultCode: string; msg: string; data: RemoteTag[] | null };
  if (json.resultCode !== '200' || !json.data) {
    throw new Error(json.msg || '태그 조회 실패');
  }
  return json.data;
}
