
import { cookies } from 'next/headers';

type Category = {
  id: number;
  categoryName: string;
  subCategories: Category[];
};

export const dynamic = 'force-dynamic'; // 최신 반영 보장

async function fetchCategories(): Promise<Category[]> {
  const token = (await cookies()).get('accessToken')?.value;        // 쿠키에서 토큰 꺼내고
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;     // Bearer 붙여서 조회

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`, {
    method: 'GET',
    headers,
    cache: 'no-store',
  });

  const loc = res.headers.get('location');
  if (res.status >= 300 && res.status < 400) {
    throw new Error(`302 redirected to "${loc}" (인증/세션 문제 가능)`);
  }
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${t.slice(0, 200)}`);
  }

  const json = await res.json() as { resultCode: string; msg: string; data: Category[] | null };
  if (json.resultCode !== '200' || !json.data) {
    throw new Error(json.msg || '카테고리 조회 실패');
  }
  return json.data;
}

function Tree({ nodes }: { nodes: Category[] }) {
  if (!nodes?.length) return <p className="text-sm text-[var(--color-gray-600)]">아직 카테고리가 없습니다.</p>;
  return (
    <ul className="space-y-1">
      {nodes.map((n) => (
        <li key={n.id}>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[var(--color-gray-100)] px-2 py-0.5 text-xs">{n.id}</span>
            <span className="font-medium">{n.categoryName}</span>
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
    const data = await fetchCategories();
    // 마지막 업데이트
    return (
      <div>
        <div className="mb-2 text-xs text-[var(--color-gray-500)]">
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
