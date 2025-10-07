import TagForm from "@/components/admin/TagForm";
import TagList from "@/components/admin/TagList";


export const dynamic = 'force-dynamic';

export default function TagsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border p-4">
        <h2 className="mb-3 font-semibold">새 태그 등록</h2>
        <TagForm />
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="mb-3 font-semibold">태그 목록</h2>
        <TagList />
      </section>
    </div>
  );
}
