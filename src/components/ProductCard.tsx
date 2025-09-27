'use client'

import Star from "@/assets/icon/star.svg";
import Image from "next/image";

type ProductProps = {
    img:string;
    title:string;
    brand:string;
    discount?:string;
    price:string;
    originalPrice:string;
    rating:string
};


export default function ProductCard({
    img,title,brand,discount,price,originalPrice,rating
}:ProductProps) {
  return (
    <article>
        <div>
            <Image 
                src={img}
                alt={title}
                width={230}
                height={230}
                className="w-[280px] h-[280px]"
            />
        </div>

        <div className="mt-5">
            <div className="text-gray-300">{brand}</div>
            <div className="text-[18px] mt-1">{title}</div>
            <div className="flex flex-wrap items-center mt-2">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-[20px] font-bold text-primary">{discount}</span>
                    <span className="text-[22px] font-bold">{price}</span>
                    <span className="text-[20px] mr-5 text-gray-300 line-through">{originalPrice}</span>
                </div>
            

                <div className="flex items-center">
                    <Star width={18} height={18} />
                    <span className="mx-2  text-[18px]">{rating}</span>
                </div>
            </div>
        </div>
    </article>
  )
}