
import Hero from "@/components/Hero";
import ProductSection from "@/components/main/ProductSection";
import { Metadata } from "next";

export const metadata:Metadata = {
  title:'모리모리 | forest for you',
  description:'모리모리 메인 페이지입니다.'
}

export default async function Home() {

  return (
    <>
    <Hero />
    <div className="px-[125px]">
      <ProductSection />
      <ProductSection />
    </div>
    </>
  );
}
