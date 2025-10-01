'use client';

import React from 'react';
import clsx from 'clsx';
import X from '@/assets/icon/x.svg';

type ModalProps = {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  confirmText?: string;
  showFooter?: boolean;
  footer?: React.ReactNode;
  maxWidthClassName?: string;
  className?: string;
  contentClassName?: string;
};

export default function Modal({
  title,
  children,
  onClose,
  confirmText = '확인',
  showFooter = true,
  footer,
  maxWidthClassName = 'max-w-[520px]',
  className,
  contentClassName,
}: ModalProps) {
  const shouldShowDefaultFooter = showFooter && !footer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10 sm:px-8">
      <div
        className={clsx(
          'relative flex max-h-[90vh] w-full flex-col rounded-2xl bg-white shadow-xl',
          maxWidthClassName,
          className,
        )}
      >
        {title && (
          <header className="flex items-center justify-between px-8 py-6">
            <h2 className="text-xl font-semibold text-[var(--color-black)]">{title}</h2>
            <button
              type="button"
              className="inline-flex items-center justify-center text-[var(--color-gray-400)] transition-colors hover:text-[var(--color-gray-600)]"
              onClick={onClose}
              aria-label="닫기"
            >
              <X className="size-6" />
            </button>
          </header>
        )}
        <div
          className={clsx(
            'flex-1 overflow-y-auto px-8 py-6 text-sm leading-6 text-[var(--color-gray-800)]',
            contentClassName,
          )}
        >
          {children}
        </div>
        {footer ? (
          <footer className="border-t border-[var(--color-gray-100)] px-8 py-6">{footer}</footer>
        ) : null}
        {shouldShowDefaultFooter && (
          <footer className="flex justify-center border-t border-[var(--color-gray-100)] px-8 py-6">
            <button
              type="button"
              className="w-[150px] rounded-[10px] bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-60)]"
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
