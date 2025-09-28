import HelpSidebar from "@/components/help/HelpSidebar";

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex h-full w-full px-[125px]">
      <div className="flex h-full w-full gap-10">
        <HelpSidebar className="h-full self-stretch" />
        <div className="flex min-h-full flex-1 flex-col">{children}</div>
      </div>
    </section>
  );
}

