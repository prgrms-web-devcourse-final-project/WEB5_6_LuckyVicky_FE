
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
                width={277}
                height={277}
            />
        </div>

        <div className="mt-5">
            <div className="text-gray-300">{brand}</div>
            <div className="text-[18px] mt-1.5">{title}</div>
            <div className="flex items-center justify-between mt-2.5">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-[18px] font-bold text-primary">{discount}</span>
                    <span className="text-[20px] font-bold">{price}</span>
                    <span className="text-[18px] text-gray-300 line-through">{originalPrice}</span>
                </div>
            

                <div className="flex items-center">
                    <Image 
                        src="/icons/star.svg"
                        alt="별점 아이콘"
                        width={16}
                        height={16}
                    />
                    <span className="mx-2">{rating}</span>
                </div>
            </div>
        </div>
    </article>
  )
}