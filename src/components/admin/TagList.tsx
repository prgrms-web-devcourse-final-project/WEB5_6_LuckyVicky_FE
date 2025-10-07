import { deleteTagAction, updateTagAction } from "@/app/admin/(dashboard)/products/tags/action";
import { getAllTags } from "@/lib/server/tags.server";


export const dynamic = 'force-dynamic'; // 항상 최신 반영

export default async function TagList() {

    const tags = await getAllTags();

    if (!tags?.length) {
      return <p className="text-sm text-gray-600">아직 태그가 없습니다.</p>;
    }

    return (
      <div>
        <ul className="space-y-1">
          {tags.map((t) => (
            <li key={t.id}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{t.id}</span>
                  <span className="font-medium">{t.tagName}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* 수정 */}
                  <details className="group">
                    <summary className="cursor-pointer rounded border px-2 py-1 text-xs hover:bg-gray-50 list-none">
                      수정
                    </summary>
                    <div className="mt-2 rounded border p-2">
                      <form action={updateTagAction} className="flex flex-wrap items-end gap-2">
                        <input type="hidden" name="id" value={t.id} />
                        <label className="flex flex-col gap-1">
                          <span className="text-[10px] text-gray-500">태그명</span>
                          <input
                            name="tagName"
                            defaultValue={t.tagName}
                            className="rounded border px-2 py-1 text-sm"
                            required
                          />
                        </label>
                        <button
                          type="submit"
                          className="rounded border px-3 py-1 text-xs font-medium hover:bg-gray-50"
                        >
                          저장
                        </button>
                      </form>
                    </div>
                  </details>

                  {/* 삭제 */}
                  <form>
                    <button
                      className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                      formAction={deleteTagAction.bind(null, t.id)}
                    >
                      삭제
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );

}
