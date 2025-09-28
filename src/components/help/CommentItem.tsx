'use client';
import DefaultProfile from '@/assets/icon/default_profile.svg';

export default function CommentItem({
  author,
  children,
  date,
  avatarClassName,
}: {
  author: React.ReactNode;
  children: React.ReactNode;
  date?: React.ReactNode;
  avatarClassName?: string;
}) {
  return (
    <div className="py-4">
      <div className="flex items-start gap-5">
        <DefaultProfile
          className={[
            'h-10 w-10 shrink-0 overflow-visible',
            avatarClassName ?? '',
          ].join(' ')}
        />
        <div className="min-w-0 flex-col flex-1">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-5">  
            <span className="font-semibold">{author}</span>
            <div className="whitespace-pre-line text-sm">
              {children}
            </div>
            </div>
            
            {date && (
              <span className="text-sm text-[var(--color-gray-700)]">
                {date}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
