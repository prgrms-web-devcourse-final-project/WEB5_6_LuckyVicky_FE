import AdminHeader from '@/components/AdminHeader';

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />
      <main className="grid p-6">
        <div className="w-full max-w-[560px]">{children}</div>
      </main>
    </div>
  );
}
