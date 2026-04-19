import { Skeleton } from '@/components/ui/skeleton'

export default function MetaAdsLoading() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex gap-2">
        <Skeleton className="h-[28px] w-[180px]" />
        <Skeleton className="h-[28px] w-[160px]" />
        <Skeleton className="h-[28px] w-[200px] ml-auto" />
      </div>
      <div className="flex gap-2 border-b pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[32px] w-[100px]" />
        ))}
      </div>
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-[72px] rounded-md" />
        ))}
      </div>
      <Skeleton className="h-[240px] rounded-md" />
      <Skeleton className="h-[200px] rounded-md" />
    </div>
  )
}