import { GradeLookup } from "@/components/grade-lookup"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 font-sans text-slate-100">
      <GradeLookup />
    </main>
  )
}
