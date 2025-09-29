'use client'

import { Product } from "@/utils/categoryData"
import ProductFilter from "./ProductFilter"
import ProductCard from "../ProductCard"
import { useMemo, useState } from "react"
import Link from "next/link"

function toNumberPrice(v: string | number) {
    if (typeof v === 'number') return v;
    return Number(String(v).replace(/[^\d.-]/g, '')) || 0;
}

export default function FilteredSection({products}:{products: Product[]}) {
    const [sortOption, setSortOption] = useState<'인기순' | '최신순' | '낮은 가격순' | '높은 가격순'>('인기순');

    const sorted = useMemo(() => {
    const copy = [...products];

    switch(sortOption) {
        case '최신순':
            return copy.sort((a,b) => (new Date(b.createdAt ?? 0).getTime()) - (new Date(a.createdAt ?? 0).getTime()))
        case '낮은 가격순':
            return copy.sort((a, b) => toNumberPrice(a.price) - toNumberPrice(b.price));
        case '높은 가격순':
            return copy.sort((a, b) => toNumberPrice(b.price) - toNumberPrice(a.price));
        case '인기순':
        default:
            return copy;
        }
    }, [products, sortOption]);
  
    return (
        <>
        <ProductFilter selected={sortOption} onChange={setSortOption} />
        <div className="max-w-[min(1200px,calc(100vw-250px))] mx-auto">
        <ul className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sorted.map((item) => (
                <li key={item.id}>
                <Link href={`/product/${item.id}`}>
                    <ProductCard {...item} />
                </Link>
                </li>
            ))}
        </ul>  
        </div>
        </>
    )
}