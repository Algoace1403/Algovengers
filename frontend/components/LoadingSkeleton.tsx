'use client';

export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="skeleton w-12 h-12 rounded-xl"></div>
        <div className="flex-1">
          <div className="skeleton h-4 w-3/4 mb-2"></div>
          <div className="skeleton h-3 w-1/2"></div>
        </div>
      </div>
      <div className="skeleton h-20 w-full"></div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="card">
        <div className="skeleton h-8 w-1/3 mb-4"></div>
        <div className="skeleton h-4 w-full mb-2"></div>
        <div className="skeleton h-4 w-2/3"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card">
            <div className="skeleton h-20 w-full"></div>
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="card">
        <div className="skeleton h-6 w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-16 w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FileSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        <div className="skeleton w-10 h-10 rounded"></div>
        <div className="flex-1">
          <div className="skeleton h-4 w-3/4 mb-2"></div>
          <div className="skeleton h-3 w-1/2"></div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="skeleton w-8 h-8 rounded"></div>
        <div className="skeleton w-8 h-8 rounded"></div>
        <div className="skeleton w-8 h-8 rounded"></div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
          <div className="skeleton w-12 h-12 rounded"></div>
          <div className="flex-1">
            <div className="skeleton h-4 w-full mb-2"></div>
            <div className="skeleton h-3 w-2/3"></div>
          </div>
          <div className="skeleton w-20 h-8 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="skeleton h-8 w-1/3"></div>
        <div className="skeleton w-12 h-12 rounded-xl"></div>
      </div>
      <div className="skeleton h-12 w-1/2 mb-2"></div>
      <div className="skeleton h-4 w-2/3"></div>
    </div>
  );
}
