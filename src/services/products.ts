export type UploadType = 'MAIN' | 'ADDITIONAL' | 'THUMBNAIL' | 'DOCUMENT';

export type UploadedImageInfo = {
  url: string;
  type: UploadType;
  s3Key: string;
  originalFileName: string;
};

export async function uploadProductImages(files: File[], types: UploadType[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  types.forEach((type) => formData.append('types', type));

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/images`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if(!res.ok) {
    throw new Error('이미지 업로드 실패');
  }

  const data = await res.json();
  return data;
}