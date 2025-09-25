'use client';

import React from 'react';
import X from '@/assets/icon/x.svg';

type ModalProps = {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  confirmText?: string;
  showFooter?: boolean;
};

export default function Modal({
  title,
  children,
  onClose,
  confirmText = '확인',
  showFooter = true,
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-12 py-12">
      <div className="relative flex max-h-[90vh] w-full max-w-[420px] flex-col rounded-2xl bg-white ">
        {title  && (
          <header className="flex items-center justify-between px-6 py-6">
            <h2 className="text-xl font-semibold text-[var(--color-black)]">{title}</h2>
            <button type="button" className="text-gray-400 inline-flex items-center justify-center"  onClick={onClose} aria-label="닫기">
              <X className="size-6"/>
            </button>
          </header>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-5 text-sm leading-6 text-gray-700 whitespace-pre-line">
          {children}
        </div>
        {showFooter && (
          <footer className="flex justify-center px-6 py-4">
            <button
              type="button"
              className="w-[150px] rounded-[6px] bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-60)]"
              onClick={onClose}
            >
              {confirmText}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}

