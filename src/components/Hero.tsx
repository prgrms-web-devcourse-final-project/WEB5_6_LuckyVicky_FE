
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full bg-primary text-[#F6F4EB]">
        <div className="flex flex-col items-center justify-center h-[260px] text-center px-4">
            <h2 className="text-5xl md:text-6xl mb-4">
                GRAND OPEN
            </h2>
            <div>
                <span  className="text-lg md:text-xl">모리모리 오픈 기념</span>
                <br />
                <span className="text-[30px]">10% 할인 프로모션</span>
            </div>
        </div>

        <button className="absolute top-1/2 left-[95px] -translate-y-1/2">
            <Image 
                alt="왼쪽 화살표"
                src="/icons/leftarrow.svg"
                width={18}
                height={18}
            />
        </button>
        <button className="absolute top-1/2 right-[95px] -translate-y-1/2">
            <Image 
                alt="오른쪽 화살표"
                src="/icons/rightarrow.svg"
                width={18}
                height={18}
            />
        </button>
    </section>
  )
}