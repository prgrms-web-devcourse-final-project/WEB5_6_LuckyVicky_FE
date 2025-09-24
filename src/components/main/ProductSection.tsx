import { mainData } from "@/utils/categoryData";
import ProductCard from "../ProductCard";

export default function ProductSection() {
  return (
    <section className="mx-auto w-full max-w-[1200px] pt-8">
        <div className="mb-7 flex items-center">
            <h3 className="pr-5 text-[20px] font-bold">주제</h3>
            <span className="text-[16px] text-gray-400">주제 설명입니다. 주제 설명입니다. 주제 설명입니다.</span>
        </div>

        <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {mainData.map((item) => (
          <li key={item.id}>
            <ProductCard {...item} />
          </li>
        ))}
      </ul>
    </section>
  )
}