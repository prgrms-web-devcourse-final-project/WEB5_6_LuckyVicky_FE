'use server';

import { revalidatePath } from 'next/cache';
import { updateCategoryServer, deleteCategoryServer } from '@/lib/server/categories.server';

// 수정
export async function updateCategoryAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const categoryName = String((formData.get('categoryName') ?? '')).trim();
  const parentIdRaw = formData.get('parentId');
  const parentId = parentIdRaw === '' || parentIdRaw === null ? null : Number(parentIdRaw);

  if (!id || Number.isNaN(id)) throw new Error('잘못된 카테고리 ID입니다.');
  if (!categoryName) throw new Error('카테고리명을 입력하세요.');

  await updateCategoryServer(id, { categoryName, parentId });
  revalidatePath('/admin/products/categories', 'page');
}

// 삭제
export async function deleteCategoryAction(id: number) {
  if (!id || Number.isNaN(id)) throw new Error('잘못된 카테고리 ID입니다.');
  await deleteCategoryServer(id);
  revalidatePath('/admin/products/categories', 'page');
}
