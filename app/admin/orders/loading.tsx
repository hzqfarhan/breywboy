import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingOrders() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex h-full min-w-max gap-6">
          {["New Orders", "Preparing", "Ready for Pickup"].map((title) => (
            <div key={title} className="flex w-80 flex-col rounded-2xl border bg-muted/20">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-5 w-8 rounded-full" />
                </div>
              </div>
              <div className="flex-1 space-y-3 p-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="rounded-xl border bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="mb-3 h-16 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
