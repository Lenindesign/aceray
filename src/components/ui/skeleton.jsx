import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-sm bg-[#E5E3DD]", className)}
      {...props} />
  );
}

export { Skeleton }
