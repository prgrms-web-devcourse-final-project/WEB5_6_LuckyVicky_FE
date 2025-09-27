type MetaItem = { label: string; value: React.ReactNode };

import CommentItem from './CommentItem';

export default function PostDetail({
  header,
  topLeft = [],
  topRight = [],
  titleLeft,
  titleRight,
  content,
  comments = [],
}: {
  header: string;
  topLeft?: MetaItem[];
  topRight?: MetaItem[];
  titleLeft: MetaItem;
  titleRight?: MetaItem;
  content: React.ReactNode;
  comments?: { author: React.ReactNode; content: React.ReactNode; date?: React.ReactNode }[];
}) {
  return (
    <>
      <div className="mt-[94px] mb-5 flex flex-col">
        <h3 className="mb-[30px] text-2xl font-bold">{header}</h3>
        <hr />

        {(topLeft.length > 0 || topRight.length > 0) && (
          <div className="w-full my-[13px] flex justify-between">
            {topLeft.length > 0 && (
              <div className="flex items-center gap-[30px]">
                {topLeft.map((m, i) => (
                  <div key={i} className="flex items-center gap-[30px]">
                    <span className="font-medium">{m.label}</span>
                    <span className="text-sm font-normal">{m.value}</span>
                  </div>
                ))}
              </div>
            )}
            {topRight.length > 0 && (
              <div className="flex items-center gap-[30px]">
                {topRight.map((m, i) => (
                  <div key={i} className="flex items-center gap-[30px]">
                    <span className="font-medium">{m.label}</span>
                    <span className="text-sm font-normal">{m.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <hr />
        <div className="my-[13px] items-center flex gap-[30px]">
          <div className="w-full flex justify-between gap-[30px]">
            <div className="flex items-center gap-[30px]">
              <span className="font-medium">{titleLeft.label}</span>
              <span className="text-sm font-normal">{titleLeft.value}</span>
            </div>
            {titleRight && (
              <div className="flex items-center gap-[30px]">
                <span className="font-medium">{titleRight.label}</span>
                <span className="text-sm font-normal">{titleRight.value}</span>
              </div>
            )}
          </div>
        </div>
        <hr />
        <div className="my-[13px]  flex flex-col items-start gap-[20px]">
          <span className="font-medium">내용</span>
          <div className="text-sm font-normal">{content}</div>
        </div>
        <hr />
      </div>

      {comments.length > 0 && (
        <div className="-mb-2 flex flex-col">
          <h3 className="mb-[30px] text-2xl font-bold">댓글({comments.length})</h3>
          <hr />
          {comments.map((c, i) => (
            <CommentItem key={i} author={c.author} date={c.date}>
              {c.content}
            </CommentItem>
          ))}
          <hr />
        </div>
      )}
    </>
  );
}
