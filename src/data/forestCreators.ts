import { allProducts } from '@/utils/product';

export type CreatorProduct = {
  id: string;
  title: string;
  img: string;
  brand: string;
  discount: string;
  price: string;
  originalPrice: string;
  rating: string;
  createdAt: string;
};

export type ForestCreator = {
  id: string;
  name: string;
  nickname?: string;
  instagram?: string;
  bio: string;
  followers: number;
  since: string;
  products: CreatorProduct[];
  fundings: CreatorProduct[];
};

const productPools: CreatorProduct[][] = [];
const chunkSize = 4;
for (let i = 0; i < allProducts.length; i += chunkSize) {
  productPools.push(allProducts.slice(i, i + chunkSize));
}

const defaultPool = allProducts.slice(0, chunkSize);

const bioText =
  '작가 소개입니다. 작가 소개입니다. 작가 소개입니다. 작가 소개입니다. 작가 소개입니다. 작가 소개입니다. 작가 소개입니다. 작가 소개입니다.';

const baseCreators = Array.from({ length: 12 }).map((_, index) => {
  const poolIndex = index % productPools.length;
  const nextPoolIndex = (index + 1) % productPools.length;

  return {
    id: `creator-${index + 1}`,
    name: `작가${index + 1}`,
    nickname: `작가${index + 1}`,
    instagram: '@mori_forest',
    bio: bioText,
    followers: 1000 + index * 157,
    since: '2025-09-16',
    products: productPools[poolIndex] && productPools[poolIndex].length > 0
      ? productPools[poolIndex]
      : defaultPool,
    fundings: productPools[nextPoolIndex] && productPools[nextPoolIndex].length > 0
      ? productPools[nextPoolIndex]
      : defaultPool,
  } satisfies ForestCreator;
});

export const forestCreators: ForestCreator[] = baseCreators;

export function getForestCreatorById(id: string): ForestCreator | undefined {
  return forestCreators.find((creator) => creator.id === id);
}
