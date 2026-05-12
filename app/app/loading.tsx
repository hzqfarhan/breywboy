import { CustomerTopBar } from "@/components/layout/CustomerTopBar"

export default function Loading() {
  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <CustomerTopBar title="Loading..." />
      <div className="p-4 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-secondary rounded-3xl w-full"></div>
          <div className="h-32 bg-secondary rounded-3xl w-full"></div>
          <div className="space-y-2">
            <div className="h-8 bg-secondary rounded-xl w-1/3"></div>
            <div className="flex gap-4">
              <div className="h-40 bg-secondary rounded-2xl w-[160px]"></div>
              <div className="h-40 bg-secondary rounded-2xl w-[160px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
