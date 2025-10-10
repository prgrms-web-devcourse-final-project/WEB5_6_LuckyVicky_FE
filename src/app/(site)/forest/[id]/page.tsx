import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import {
  forestCreators,
  getForestCreatorById,
  type CreatorProduct,
} from '@/data/forestCreators';
import Button from '@/components/Button';

function formatFollowers(count: number) {
  return new Intl.NumberFormat('ko-KR').format(count);
}

function formatSince(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function ProductSection({
  title,
  items,
}: {
  title: string;
  items: CreatorProduct[];
}) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-[var(--color-gray-900)]">
          {title}
        </h3>
        <span className="text-sm text-[var(--color-gray-500)]">인기순</span>
      </div>
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            img={item.img}
            title={item.title}
            brand={item.brand}
            discount={item.discount}
            price={item.price}
            originalPrice={item.originalPrice}
            rating={item.rating}
          />
        ))}
      </div>
    </section>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const creator = getForestCreatorById(id);

  if (!creator) {
    notFound();
  }

  const displayName = creator.nickname ?? creator.name;
  const followerLabel = formatFollowers(creator.followers);
  const sinceLabel = formatSince(creator.since);

  return (
    <main className="relative flex-1 overflow-auto bg-[#f5f5f5]">
      <div
        className="relative mx-auto flex w-full flex-col overflow-hidden bg-center pb-20 pt-16 shadow-[0_12px_45px_-20px_rgba(99,139,86,0.5)]"
        style={{
          minHeight: '100vh',
          backgroundImage: 'url(/forest_full.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '640px 640px',
        }}
      >
        <div className="mx-auto w-full max-w-[1200px] px-6">
          <section className="rounded-3xl">
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-full bg-[var(--color-gray-100)]">
                <Image
                  src="/profile-placeholder.svg"
                  alt="기본 프로필"
                  fill
                  sizes="128px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h1 className="flex flex-wrap items-center justify-center gap-3 text-2xl font-bold md:justify-start">
                    {displayName}
                    {creator.instagram ? (
                      <Link
                        href={`https://www.instagram.com/${creator.instagram.replace(/^@/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-medium text-[#E4405F] hover:underline"
                      >
                        <Image
                          width={50}
                          height={50}
                          src="/icons/instagram.png"
                          alt="Instagram"
                        />
                      </Link>
                    ) : null}
                  </h1>
                  <Button variant="primary">팔로우하기</Button>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm md:justify-start">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">팔로워</span>
                    <strong className="text-3xl font-bold">
                      {followerLabel}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-2xl">since</span>
                    <strong className="text-3xl font-bold">{sinceLabel}</strong>
                  </div>
                </div>
              </div>
            </div>
            <h1 className="mt-8 text-2xl font-bold">작가 소개</h1>
            <p className="mt-8 whitespace-pre-line text-base leading-relaxed">
              {creator.bio}
            </p>
          </section>

          <ProductSection title="작가님의 상품 목록" items={creator.products} />
          <ProductSection title="작가님의 펀딩 목록" items={creator.fundings} />
        </div>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return forestCreators.map((creator) => ({ id: creator.id }));
}
