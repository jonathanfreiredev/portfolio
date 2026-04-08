import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-12 md:py-20">
      <section className="space-y-4">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-12 w-3/4 max-w-xl" />
        <Skeleton className="h-5 w-full max-w-2xl" />
        <Skeleton className="h-5 w-2/3 max-w-xl" />
      </section>

      <section className="space-y-4">
        <Skeleton className="h-7 w-56" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-xl border p-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
