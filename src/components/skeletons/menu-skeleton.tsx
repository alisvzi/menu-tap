"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function MenuSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {[...Array(5)].map((_, i) => (
        <>
          <Skeleton className="h-20 w-24 rounded-lg bg-muted/60" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3 bg-muted/70" />
            <Skeleton className="h-3 w-1/2 bg-muted/60" />
            <Skeleton className="h-3 w-1/3 bg-muted/50" />
          </div>
          <Skeleton className="h-6 w-14 rounded-full bg-muted/70" />
        </>
      ))}
    </div>
  );
}
