'use client';

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import { createPortal } from 'react-dom';
import SuccessIcon from '@/assets/icon/success.svg';

type ToastVariant = 'success' | 'error' | 'info';
type ToastAction = { label: string; onClick: () => void };

export type ToastItem = {
  id: string;
  message: string;
  variant?: ToastVariant;
  action?: ToastAction;
  duration?: number; // ms, 기본 2500
};

type Ctx = {
  show: (msg: string, opts?: Omit<ToastItem, 'id' | 'message'>) => void;
  success: (
    msg: string,
    opts?: Omit<ToastItem, 'id' | 'message' | 'variant'>,
  ) => void;
  error: (
    msg: string,
    opts?: Omit<ToastItem, 'id' | 'message' | 'variant'>,
  ) => void;
  info: (
    msg: string,
    opts?: Omit<ToastItem, 'id' | 'message' | 'variant'>,
  ) => void;
};

const ToastCtx = createContext<Ctx | null>(null);
export const useToast = () => {
  const c = useContext(ToastCtx);
  if (!c) throw new Error('useToast must be used within <ToastProvider/>');
  return c;
};

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Avoid SSR "document is not defined" by portaling only after mount
  // and rendering portal contents through a small helper component below.
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const api: Ctx = useMemo(
    () => ({
      show: (message, opts) => {
        const id = crypto.randomUUID();
        const item: ToastItem = {
          id,
          message,
          duration: 2500,
          variant: 'info',
          ...opts,
        };
        setItems((prev) => [...prev, item]);
        // auto dismiss
        const t = setTimeout(() => dismiss(id), item.duration);
        timers.current[id] = t;
      },
      success: (m, o) => api.show(m, { ...o, variant: 'success' }),
      error: (m, o) => api.show(m, { ...o, variant: 'error' }),
      info: (m, o) => api.show(m, { ...o, variant: 'info' }),
    }),
    [],
  );

  function dismiss(id: string) {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <ToastPortal>
        <div className="pointer-events-none fixed inset-0 z-[2000] grid place-items-center">
          <div className="flex flex-col items-center gap-3">
            {items.map((t) => (
              <ToastCard key={t.id} item={t} onClose={() => dismiss(t.id)} />
            ))}
          </div>
        </div>
      </ToastPortal>
    </ToastCtx.Provider>
  );
}

function ToastPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || typeof document === 'undefined') return null;
  return createPortal(children, document.body);
}

function ToastCard({
  item,
  onClose,
}: {
  item: ToastItem;
  onClose: () => void;
}) {
  const colors =
    item.variant === 'success'
      ? {
          ring: 'color-mix(in srgb, var(--color-primary) 30%, white)',
          iconBg: 'var(--color-primary)',
        }
      : item.variant === 'error'
        ? { ring: 'rgba(243, 83, 65, .3)', iconBg: 'var(--color-danger)' }
        : { ring: 'rgba(0,0,0,.15)', iconBg: 'var(--color-gray-700)' };

  return (
    <div
      className="pointer-events-auto w-[320px] rounded-2xl border bg-white p-5 text-center shadow-xl"
      style={{
        borderColor: colors.ring,
        boxShadow: '0 8px 24px rgba(0,0,0,.08)',
      }}
      role="status"
      aria-live="polite"
    >
      {/* 아이콘 */}
      <div
        className="mx-auto grid size-12 place-items-center rounded-full"
        style={{ background: colors.iconBg }}
      >
        {/* 체크/오류/정보 아이콘 */}
        {item.variant === 'success' ? (
          <SuccessIcon className="h-6 w-6 text-white" />
        ) : (
          <span className="text-white text-xl">
            {item.variant === 'error' ? '!' : 'i'}
          </span>
        )}
      </div>

      {/* 메시지 */}
      <p className="mt-3 text-base font-semibold">{item.message}</p>

      {/* 액션 버튼 (선택) */}
      {item.action && (
        <button
          onClick={() => {
            item.action!.onClick();
            onClose();
          }}
          className="mt-3 w-full rounded bg-[var(--color-primary)] px-4 py-2 font-medium text-white hover:opacity-90"
        >
          {item.action.label}
        </button>
      )}

      {/* 닫기 */}
      <button
        onClick={onClose}
        className="absolute right-2 top-2 size-7 rounded-full text-[var(--color-gray-700)] hover:bg-[var(--color-gray-10)]"
        aria-label="닫기"
      >
        ✕
      </button>
    </div>
  );
}
