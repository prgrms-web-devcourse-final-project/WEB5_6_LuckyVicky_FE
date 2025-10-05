'use client'

import { useEffect, useState } from "react";
import Image from "next/image";


export default function ScrollTopBtn() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    },[]);

    return visible ? (
    <button 
        type="button"
        aria-label="맨 위로 이동"
        onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
        className={`fixed bottom-6 right-6 z-[999] hover:cursor-pointer active:scale-95 ${visible ? "" : "opacity-0"}`}
        >
            <Image src="/icons/top.svg" alt="맨 위로" width={60} height={60} />
    </button>
    ) : null;
} 