'use client'

import { navItems } from "@/utils/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import React from "react";
import CategoryNav from "./CategoryNav";


function MenuIcon({href}:{href:string}) {
    switch(href){
        case "/shop":
            return (
                <Image 
                    src="/icons/shop.svg"
                    alt="장바구니 아이콘"
                    width={13}
                    height={13}
                    />
            );
        case "/mypage":
            return (
                <Image 
                    src="/icons/mypage.svg"
                    alt="마이페이지 아이콘"
                    width={13}
                    height={13}
                    />
            );
        case "/news":
            return (
                <Image 
                    src="/icons/news.svg"
                    alt="알림 아이콘"
                    width={13}
                    height={13}
                    />
            );
        default:
            return null;
    }
}

export default function Header() {

    const pathname = usePathname();

    const authItems = navItems.filter(
        (item) => item.href === '/login' || item.href === '/register'
    );

    const otherItems = navItems.filter(
        (item) => item.href !== '/login' && item.href !== '/register'
    );

  return (
    <>
    <header className="bg-[#F6F4EB] py-[20px] px-[125px] text-gray-600 flex items-center justify-between">
        {/* 로고 */}
        <h1>
            <Link href="/">
                <Image 
                    src="/logo.svg"
                    alt="사이트 로고"
                    width={200}
                    height={100}
                    priority
                />
            </Link>
        </h1>

        {/* 검색창 */}
        <form className="relative flex-1 max-w-[400px]">
            <input 
                type="text"
                className="w-full border border-primary rounded-full py-2 pl-4 pr-10 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800"
            />
            <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                    <Image 
                    src="/icons/search.svg"
                    alt="검색 아이콘"
                    width={18}
                    height={18}
                    />
            </button>
        </form>

        {/* 우측 내비 */}
        <nav>
            <h2 className="sr-only">메인 메뉴</h2>

            <ul className="flex gap-5 text-[12px]">
                <li className="flex items-center gap-1.5">
                    <Image 
                        src="/icons/login.svg"
                        alt="로그인 아이콘"
                        width={13}
                        height={13}
                    />
                {/* 로그인/회원가입 */}    
                {
                    authItems.map(({href,label},index) => (
                        <React.Fragment key={href}>
                            <Link
                            key={href}
                            href={href}
                            className={pathname === href ? "text-primary" : "hover:text-primary"}
                            >
                                {label}
                            </Link>
                            
                            {
                                index < authItems.length - 1 && (
                                    <span className="text-gray-600">/</span>
                                )
                            }
                        </React.Fragment>
                    ))
                }
                </li>
                {/* 나머지 */}
                {
                    otherItems.map(({href,label}) => (
                        <li key={href}>
                            <Link 
                            href={href}
                            className={`flex items-center gap-1.5
                                ${pathname === href ? "text-primary" : "hover:text-primary"}`}
                            >
                                <MenuIcon href={href} />
                                {label}
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </nav>
    </header>
    <CategoryNav />
    </>
  )
}