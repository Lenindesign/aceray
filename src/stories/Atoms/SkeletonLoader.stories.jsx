import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default {
  title: 'Atomic Design/Atoms/SkeletonLoader',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Loading skeleton placeholder atom for async product cards, collection grids, and high-res imagery.',
      },
    },
  },
}

export const ProductCardSkeleton = () => (
  <div className="w-[300px] p-4 bg-white border border-[#E5E3DD] rounded-[var(--radius-card)] space-y-4">
    <Skeleton className="w-full aspect-[4/3] rounded-xl bg-[#F3F2EE]" />
    <div className="space-y-2">
      <Skeleton className="h-3 w-1/3 bg-[#F3F2EE]" />
      <Skeleton className="h-5 w-3/4 bg-[#F3F2EE]" />
      <Skeleton className="h-3 w-1/2 bg-[#F3F2EE]" />
    </div>
  </div>
)

export const GridSkeletonLoader = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 max-w-4xl bg-[#FAF9F6] rounded-2xl">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-4 bg-white border border-[#E5E3DD] rounded-[var(--radius-card)] space-y-4">
        <Skeleton className="w-full aspect-[4/3] rounded-xl bg-[#F3F2EE]" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-1/3 bg-[#F3F2EE]" />
          <Skeleton className="h-5 w-3/4 bg-[#F3F2EE]" />
        </div>
      </div>
    ))}
  </div>
)
