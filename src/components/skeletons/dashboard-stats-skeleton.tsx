import { Skeleton } from "@/components/ui/skeleton";

export function DashboardStatsSkeleton() {
  return (
    <>
      <div className="flex justify-between mb-8">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-48 rounded-full" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-lg border border-gray-200 h-32">
            <Skeleton className="h-8 w-24 mb-4" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>

      <div className="flex gap-4 mb-8 overflow-hidden">
        <Skeleton className="h-20 w-[300px] rounded-lg flex-shrink-0" />
        <Skeleton className="h-20 w-[300px] rounded-lg flex-shrink-0" />
      </div>

      <div>
        <div className="flex justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-64">
                    <Skeleton className="w-full aspect-square rounded-lg mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            ))}
        </div>
      </div>
    </>
  );
}