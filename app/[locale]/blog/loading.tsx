import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-[1024px] flex-1 flex-col gap-6 px-5 py-12 md:px-12 md:py-16 lg:px-20 lg:py-24">
      <Skeleton className="h-10 w-40" />
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3 border border-primary/10 p-4">
            <Skeleton className="h-44 w-full" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </main>
  );
}
