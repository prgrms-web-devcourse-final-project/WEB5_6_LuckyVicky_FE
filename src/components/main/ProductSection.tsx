import { mainData } from "@/utils/categoryData";
import ProductCard from "../ProductCard";
import Link from "next/link";

export default function ProductSection() {
  return (
    <section className="w-full pt-8">
      <div className="max-w-[min(1200px,calc(100vw-250px))] mx-auto">
        <div className="mb-7 flex items-center mx-auto">
            <h3 className="pr-5 text-[20px] font-bold">주제</h3>
            <span className="text-[16px] text-gray-400">주제 설명입니다. 주제 설명입니다. 주제 설명입니다.</span>
        </div>

        
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {mainData.map((item) => (
            <li key={item.id}>
              <Link href={`/product/${item.id}`}>
                <ProductCard {...item} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}