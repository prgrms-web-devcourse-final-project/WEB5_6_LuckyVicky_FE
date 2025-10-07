
import type { Tag, TagPayload, ApiResponse } from '@/types/tag';
import { cookies } from 'next/headers';

// 태그 등록
export async function createTag(payload: TagPayload): Promise<Tag> {
  const cookieHeader = cookies().toString();
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('태그 등록 실패');

  const json = (await res.json()) as ApiResponse<Tag | null>;

  if (json.resultCode !== '200' || !json.data) {
    throw new Error(json.msg || '태그 등록 실패');
  }

  return json.data;
}

// 전체 태그 조회
export async function getAllTags(): Promise<Tag[]> {
  const cookieHeader = cookies().toString();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tags`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('태그 조회 실패');

  const json = (await res.json()) as ApiResponse<Tag[] | null>;
  if (json.resultCode !== '200' || !json.data) {
    throw new Error(json.msg || '태그 조회 실패');
  }
  return json.data;
}

// 태그 수정 
export async function updateTag(id: number, payload: TagPayload): Promise<Tag> {
  const cookieHeader = cookies().toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tags/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('태그 수정 실패');

  const json = (await res.json()) as ApiResponse<Tag | null>;
  if (json.resultCode !== '200' || !json.data) {
    throw new Error(json.msg || '태그 수정 실패');
  }
  return json.data;
}

// 태그 삭제
export async function deleteTag(id: number): Promise<boolean> {
  const cookieHeader = cookies().toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tags/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('태그 삭제 실패');

  const json = (await res.json()) as ApiResponse<null>;
  if (json.resultCode !== '200') {
    throw new Error(json.msg || '태그 삭제 실패');
  }
  return true;
}
