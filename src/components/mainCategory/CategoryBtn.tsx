

type Item = { id: string; label: string };

export default function CategoryBtn({ items = []}: { items?: Item[] }) {
  return (
     <div className="flex flex-wrap justify-center gap-3 pt-10">
      {items.map((it) => (
        <button
          key={it.id}
          className="rounded-[10px] border border-primary bg-white px-5 py-1 transition hover:bg-primary hover:text-white"
        >
          {it.label}
        </button>
      ))}
    </div>
  )
}