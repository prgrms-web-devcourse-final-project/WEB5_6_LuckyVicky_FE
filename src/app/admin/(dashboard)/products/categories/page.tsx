
import CategoryList from "@/components/admin/CategoryList";
import CreateCategoryForm from "@/components/admin/CreateCategoryForm";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border p-4">
        <h2 className="mb-3 text-base font-medium">새 카테고리 등록</h2>
        <CreateCategoryForm />
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="mb-3 text-base font-medium">카테고리 목록</h2>
        <p className="text-sm text-gray-600">
          <CategoryList />
        </p>
      </section>
    </div>
  );
}
