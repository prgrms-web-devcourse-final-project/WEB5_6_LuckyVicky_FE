import { deleteCategoryAction, updateCategoryAction } from '@/app/admin/(dashboard)/products/categories/actions';
import { fetchCategoriesServer } from '@/lib/server/categories.server';
import { Category } from '@/types/category';


export const dynamic = 'force-dynamic'; // 최신 반영

function Tree({ nodes }: { nodes: Category[] }) {
  if (!nodes?.length) return <p className="text-sm text-gray-600">아직 카테고리가 없습니다.</p>;
  return (
    <ul className="space-y-1">
      {nodes.map((n) => (
        <li key={n.id}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{n.id}</span>
              <span className="font-medium">{n.categoryName}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* 수정 */}
              <details className="group">
                <summary className="cursor-pointer rounded border px-2 py-1 text-xs hover:bg-gray-50 list-none">
                  수정
                </summary>
                <div className="mt-2 rounded border p-2">
                  <form action={updateCategoryAction} className="flex flex-wrap items-end gap-2">
                    <input type="hidden" name="id" value={n.id} />
                    <label className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-500">카테고리명</span>
                      <input
                        name="categoryName"
                        defaultValue={n.categoryName}
                        className="rounded border px-2 py-1 text-sm"
                        required
                      />
                    </label>
                    <button type="submit" className="rounded border px-3 py-1 text-xs font-medium hover:bg-gray-50">
                      저장
                    </button>
                  </form>
                </div>
              </details>

              {/* 삭제 */}
              <form>
                <button
                  className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                  formAction={deleteCategoryAction.bind(null, n.id)}
                >
                  삭제
                </button>
              </form>
            </div>
          </div>

          {!!n.subCategories?.length && (
            <div className="ms-4 border-l pl-4 mt-1">
              <Tree nodes={n.subCategories} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default async function CategoryList() {
  try {
    const data = await fetchCategoriesServer();
    return (
      <div>
        <div className="mb-2 text-xs text-gray-500">
          마지막 업데이트 : {new Date().toLocaleString()}
        </div>
        <Tree nodes={data} />
      </div>
    );
  } catch (e: any) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        카테고리 목록을 불러오지 못했습니다.
        <div className="mt-1 whitespace-pre-wrap text-xs opacity-80">{String(e?.message ?? e)}</div>
      </div>
    );
  }
}
