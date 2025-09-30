import Image from 'next/image';
import AuthorImage from '@/assets/profileImage.svg';

type AuthorCardProps = {
  id: number;
  name: string;
  profileImage?: string;
  onFollow: (id: number) => void;
};

export function AuthorCard({
  id,
  name,
  profileImage,
  onFollow,
}: AuthorCardProps) {
  return (
    // <article className="border border-gray-200 rounded-lg p-6 bg-white flex flex-col items-center relative max-w-[231px] max-h-[273px] w-full h-full">
    <article className="border border-gray-200 rounded-lg p-6 bg-white flex flex-col items-center relative w-full aspect-[231/273]">
      {/* 집 아이콘 */}
      <button className="absolute top-4 right-4 text-gray-300 hover:text-gray-500">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </button>

      {/* 프로필 이미지 */}
      <div className="w-33 h-33 rounded-full   flex items-center justify-center mb-6">
        {profileImage ? (
          <Image
            src={profileImage}
            alt={name}
            width={16}
            height={16}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <AuthorImage />
        )}
      </div>

      {/* 작가명 */}
      <h3 className="text-lg font-medium mb-4">{name}</h3>

      {/* 팔로잉 버튼 */}
      <button
        onClick={() => onFollow(id)}
        className="px-6 py-2 rounded-md border-2 border-primary text-primary font-medium hover:bg-green-50"
      >
        팔로잉
      </button>
    </article>
  );
}
