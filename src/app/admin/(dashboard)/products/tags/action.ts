'use server';

import { createTag, deleteTag, updateTag } from '@/lib/server/tags.server';
import { revalidatePath } from 'next/cache';

export async function createTagAction(formData: FormData) {
  const tagName = formData.get('tagName') as string;
  if (!tagName) throw new Error('태그명을 입력해주세요.');

  try {
    const newTag = await createTag({ tagName });

    revalidatePath('/admin/(dashboard)/products/tags');

    return { success: true, data: newTag };
  } catch (e: unknown) {
  return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
}
}

// 태그 수정
export async function updateTagAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const tagName = String(formData.get('tagName') ?? '').trim();
  if (!id || !tagName) throw new Error('필수 값 누락');

  await updateTag(id, { tagName });
  revalidatePath('/admin/(dashboard)/products/tags'); // 목록 갱신
}

// 태그 삭제
export async function deleteTagAction(id: number) {
  await deleteTag(id);
  revalidatePath('/admin/(dashboard)/products/tags'); // 목록 갱신
}