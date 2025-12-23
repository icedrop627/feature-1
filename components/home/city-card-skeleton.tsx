import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CityCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Cover Image Skeleton */}
      <Skeleton className="h-48 w-full" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 w-full">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>

      <CardContent className="space-y-2 pb-4">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-2 pt-4 border-t">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
