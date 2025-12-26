import { CityCardSkeleton } from '@/components/home/city-card-skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-50 to-pink-50 dark:from-primary/5 dark:via-purple-950 dark:to-pink-950 py-20">
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4 animate-pulse">
              <div className="h-16 bg-muted rounded-lg w-3/4 mx-auto" />
              <div className="h-6 bg-muted rounded-lg w-2/3 mx-auto" />
              <div className="h-6 bg-muted rounded-lg w-1/2 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* City Grid Skeleton */}
      <div className="flex">
        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block w-80 border-r bg-card/50 backdrop-blur">
          <div className="sticky top-0 p-6 space-y-6">
            <div className="h-6 bg-muted rounded w-1/2 animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                  <div className="h-10 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <section className="flex-1 py-12">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CityCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
