'use client';

import GreenLogo from '@/assets/icon/green_logo.svg';
import Link from 'next/link';

export default function AdminHeader({ right }: { right?: React.ReactNode }) {
  return (
    <header className="w-full bg-white px-6 flex items-center justify-between">
      <Link href='/'>
        <GreenLogo className="w-auto overflow-visible" />
      </Link>
      {right ? <div className="flex items-center">{right}</div> : null}
    </header>
  );
}
