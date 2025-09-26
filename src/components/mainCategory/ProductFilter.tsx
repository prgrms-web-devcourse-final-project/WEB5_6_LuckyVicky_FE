'use client'

import FilterArrowOpen from "@/assets/icon/filterarrowopen.svg";
import FilterArrowClose from "@/assets/icon/filterarrowclose.svg";

import { useEffect, useRef, useState } from "react";

const OPTIONS = ['인기순', '최신순', '낮은 가격순', '높은 가격순'] as const;

export default function ProductFilter({
    selected, onChange
}: {
    selected: typeof OPTIONS[number];
    onChange: (v: typeof OPTIONS[number])=>void;
}) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!open) return;

        const onPointerDown = (e:PointerEvent) => {
            const root = rootRef.current;
            if(root && !root.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('pointerdown', onPointerDown, true);

        return () => {
            document.removeEventListener('pointerdown', onPointerDown, true);
        };
    },[open]);

  return (
    <div>
        <div className="border-b border-gray-200 my-3"></div>

        <div className="flex justify-end">
            <div ref={rootRef} className="relative">
                <button 
                type="button"
                onClick={()=>setOpen((prev)=>!prev)}
                className="group flex items-center gap-2 mb-2 px-3 py-2 bg-primary rounded-[10px] border border-primary text-white hover:bg-white hover:border-primary"
                >
                    {open ? (
                        <FilterArrowOpen className=" group-hover:text-black"/>
                    ): (<FilterArrowClose className=" group-hover:text-black"/>)}
                    <span className=" group-hover:text-black">
                        {selected}
                    </span>
                </button>

                {/* 버튼 클릭 시 드롭다운 */}
                {open && (
                    <div className="absolute left-1/2 translate-x-[-50%] w-[120px] bg-white text-center border border-primary rounded-[10px]">
                        <ul className="py-2">
                            {
                                OPTIONS.map((item) => (
                                    <li 
                                        key={item} 
                                        onClick={()=>{
                                            onChange(item);
                                            setOpen(false);
                                        }}
                                        className={`px-3 py-2 hover:bg-primary-20 ${item === selected ? 'bg-primary-20' : ""}`}
                                    >
                                        {item}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}