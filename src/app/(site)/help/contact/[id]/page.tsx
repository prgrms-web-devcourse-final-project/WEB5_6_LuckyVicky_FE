import PostDetail from '@/components/help/PostDetail';
import CommentForm from '@/components/help/CommentForm';

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <>
      <PostDetail
        header="문의하기"
        topLeft={[{ label: '카테고리', value: '문의 카테고리가 들어갑니다.' }]}
        topRight={[
          { label: '작성일자', value: '문의 작성일자가 들어갑니다.' },
          { label: '글번호', value: id },
        ]}
        titleLeft={{ label: '제목', value: '문의 제목이 들어갑니다.' }}
        titleRight={{ label: '닉네임', value: '문의 닉네임이 들어갑니다.' }}
        content={<span>문의 내용이 들어갑니다.</span>}
        comments={[{ author: '답변 작성자 닉네임', content: '댓글 내용입니다', date: '작성일자' }]}
      />
      <CommentForm />
    </>
  );
}
