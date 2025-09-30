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
      <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-gray-100 flex items-center justify-center mb-6">
        {profileImage ? (
          <Image
            src={profileImage}
            alt={name}
            width={16}
            height={16}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          // <svg
          //   className="w-32 h-32 text-gray-400"
          //   fill="currentColor"
          //   viewBox="0 0 24 24"
          // >
          //   <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          // </svg>
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
