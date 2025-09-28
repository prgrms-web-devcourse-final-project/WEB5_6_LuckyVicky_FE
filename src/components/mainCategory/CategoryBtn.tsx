

type Item = { id: string; label: string };

export default function CategoryBtn({ items = []}: { items?: Item[] }) {
  return (
     <div className="flex flex-wrap gap-3">
      {items.map((it) => (
        <button
          key={it.id}
          className="rounded-[10px] border border-primary bg-white px-5 py-1 cursor-pointer transition hover:bg-primary hover:text-white"
        >
          {it.label}
        </button>
      ))}
    </div>
  )
}