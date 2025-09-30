import AdminHeader from '@/components/AdminHeader';

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />
      <section className="pt-15 grid place-items-center">
        <div className="relative w-full max-w-[866px] max-h-full">
          {children}
        </div>
      </section>
    </div>
  );
}
