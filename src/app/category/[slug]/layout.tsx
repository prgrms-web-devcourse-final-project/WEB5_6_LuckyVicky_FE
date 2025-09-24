import CategoryBtn from "@/components/mainCategory/CategoryBtn";


export default function layout({children}: {children:React.ReactNode}) {
  return (
    <main className="px-5 py-4">
        <CategoryBtn />
        {children}
    </main>
  )
}