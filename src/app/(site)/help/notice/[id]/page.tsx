import PostDetail from '@/components/help/PostDetail';

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <PostDetail
      header="공지사항"
      topLeft={[]}
      topRight={[
        { label: '작성일자', value: '25.09.16' },
        { label: '글번호', value: id },
      ]}
      titleLeft={{ label: '제목', value: '공지 제목이 들어갑니다.' }}
      titleRight={{ label: '작성자', value: '관리자' }}
      content={<span>공지 내용이 들어갑니다.</span>}
    />
  );
}

