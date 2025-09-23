
import { notFound } from "next/navigation";
import { categoryData, CategorySlug } from "@/utils/categoryData";

// SSG: 존재하는 slug만 미리 생성
export async function generateStaticParams() {
  return Object.keys(categoryData).map((slug) => ({ slug }));
}

export const dynamicParams = false; // 목록 밖 slug → 404

type Props = { params: { slug: CategorySlug } };

// 카테고리별 메타
export async function generateMetadata({ params }: Props) {
  const category = categoryData[params.slug];
  return {
    title: `모리모리 | ${category?.name ?? "카테고리"}`,
    description: `${category?.name ?? "카테고리"} 상품 모음`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = categoryData[params.slug];
  if (!category) return notFound();

  return (
    <div></div>
  );
}
