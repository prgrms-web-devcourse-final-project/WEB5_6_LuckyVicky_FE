import PostDetail from '@/components/help/PostDetail';

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <PostDetail
      header="자주 묻는 질문(FAQ)"
      topLeft={[{ label: '카테고리', value: '카테고리명' }]}
      topRight={[{ label: '글번호', value: id }]}
      titleLeft={{ label: '질문', value: '질문 제목이 들어갑니다.' }}
      content={<span>답변 내용이 들어갑니다.</span>}
    />
  );
}

