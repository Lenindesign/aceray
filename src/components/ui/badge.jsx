import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-[2px] border border-transparent px-3 py-0 leading-none pt-[1px] font-sans text-[0.75rem] font-semibold tracking-[0.08em] uppercase whitespace-nowrap transition-all focus-visible:border-[#718f80] focus-visible:ring-[3px] focus-visible:ring-[#718f80]/20 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "border-[#718f80] bg-[#718f80] text-white [a]:hover:bg-[#5a6e5e]",
        secondary:
          "border-[#E5E3DD] bg-[#F3F2EE] text-[#222] [a]:hover:border-[#718f80] [a]:hover:bg-[#718f80] [a]:hover:text-white",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-[#718f80]/40 text-[#5a6e5e] [a]:hover:border-[#718f80] [a]:hover:bg-[#718f80] [a]:hover:text-white",
        ghost:
          "text-[#555] hover:bg-[#F3F2EE] hover:text-[#222]",
        link: "h-auto border-transparent px-0 text-[#718f80] underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Badge = React.forwardRef(
  ({ className, variant = "default", children, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant, className }))} {...props}>
      {children}
    </span>
  )
)

Badge.displayName = "Badge"

export { Badge, badgeVariants }
