
import { notFound } from "next/navigation";
import { categoryData, CategorySlug } from "@/utils/categoryData";
import ProductCard from "@/components/ProductCard";
import CategoryBtn from "@/components/mainCategory/CategoryBtn";
import FilteredSection from "@/components/mainCategory/FilteredSection";
import CategorySideBar from "@/components/CategorySideBar";
import Link from "next/link";

// SSG: 존재하는 slug만 미리 생성
export async function generateStaticParams() {
  return Object.keys(categoryData).map((slug) => ({ slug }));
}

export const dynamicParams = false; // 목록 밖 slug → 404

type Props = { params: Promise<{ slug: CategorySlug }> };

// 카테고리별 메타
export async function generateMetadata({ params }: Props) {
  const {slug} = await params;
  const category = categoryData[slug];
  return {
    title: `모리모리 | ${category?.name ?? "카테고리"}`,
    description: `${category?.name ?? "카테고리"} 상품 모음`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params; 
  const category = categoryData[slug];
  if (!category) return notFound();

  return (
    <main>

      <div className="flex">
        <CategorySideBar />
      
      <div className="max-w-[min(1200px,calc(100vw-250px))] mx-auto">
      <section className="flex-1 pl-6">
        {category.subCategories && (
        <CategoryBtn items={category.subCategories} />
      )}
      <h2 className="my-10 text-3xl font-bold">{category.name}</h2>

      
      <ul className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

        {category.products.map((item) => (
          <li key={item.id}>
            <Link href={`/product/${item.id}`}>
              <ProductCard {...item} />
            </Link>
          </li>
        ))}
      </ul>
      <FilteredSection products={category.products} />
      </section>
      </div>
      </div>
    </main>
  );
}
