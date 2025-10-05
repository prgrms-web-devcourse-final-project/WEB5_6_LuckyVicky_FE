'use client'

import Close from "@/assets/icon/close.svg";
import Alarm from "@/assets/icon/alarm.svg";

import { createPortal } from "react-dom";
import { useState } from "react";

type Notification = {
    id: number;
    title: string;
    message: string;
    read: boolean;
};

const dummyNotifications: Notification[] = [
  {
    id: 1,
    title: "주문완료",
    message: "주문하신 상품의 주문이 완료되었습니다.",
    read: false,
  },
  {
    id: 2,
    title: "배송시작",
    message: "상품이 배송을 시작했습니다.",
    read: false,
  },
  {
    id: 3,
    title: "이벤트 당첨",
    message: "축하합니다! 이벤트에 당첨되셨습니다 🎉",
    read: false,
  },
  {
    id: 4,
    title: "리뷰작성 혜택",
    message: "리뷰 작성 시 적립금 1,000원이 지급됩니다.",
    read: true,
  },
];

export default function Notification({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);

    if (typeof window === "undefined" || !open) return null;

    // 모두 읽음 클릭
    const markAllRead = () => {
        setNotifications((prev) => prev.map((item) => ({
            ...item,
            read:true,
        }))
    );
    };

    // 개별 읽음 클릭
    const markRead = (id: number) => {
        setNotifications(prev =>
            prev.map(item => (item.id === id ? { ...item, read: true } : item))
        );
    };

    return createPortal(
    <>
        {/* 외부영역 */}
        <button
            aria-label="알림 창 닫기"
            className="fixed inset-0 bg-black/25 backdrop-blur-[0.5px]"
            onClick={onClose}
        />

        {/* 알림 창 */}
        <aside
            id="notification"
            role="dialog"
            className={`
                fixed right-0 top-0 h-full w-[360px] z-[9999]
                bg-white shadow-2xl border-l border-gray-200
                flex flex-col
            `}
        >

        {/* 헤더 */}
        <div className="sticky top-0 z-10 bg-white">
            <div className="flex items-center justify-between p-8">
                <div className="flex items-center gap-3.5">
                    <button onClick={onClose} aria-label="닫기">
                        <Close />
                    </button>
                    <h3 className="text-[22px] font-bold text-gray-300">알림</h3>
                </div>
                <button
                    type="button"
                    className="text-[14px] text-primary hover:underline"
                    onClick={markAllRead}
                >
                    모두 읽음
                </button>
            </div>
        </div>

        {/* 알림 리스트 */}
        <div className="flex-1 flex items-center justify-center">
            <div className="bg-primary-20 w-[300px] mb-11 overflow-y-auto h-[calc(100vh-140px)]">
                {notifications.map((item) => (
                <div
                key={item.id}
                onClick={()=>markRead(item.id)}
                className={`flex p-6 cursor-pointer ${item.read ? "bg-white text-gray-400" : "text-primary hover:bg-primary-40 hover:transition-all"}`}
                >
                    <div className="mr-2.5 text-inherit">
                        <Alarm className="fill-current" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[14px] font-semibold">{item.title}</span>
                        <span className="text-[12px]">{item.message}</span>
                    </div>
                </div>
            ))}
            </div>
        </div>
        </aside>
    </>,
    document.body
);
}
