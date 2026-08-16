import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex min-h-[28px] w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-[var(--radius-btn)] border border-transparent px-3.5 py-1 leading-normal font-sans text-[0.75rem] font-semibold tracking-[0.08em] uppercase whitespace-nowrap transition-all focus-visible:border-[var(--color-primary)] focus-visible:ring-[3px] focus-visible:ring-[var(--color-primary)]/20 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "border-[var(--color-primary)] bg-[var(--color-primary)] text-white [a]:hover:bg-[var(--color-primary-dark)]",
        secondary:
          "border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-main)] [a]:hover:border-[var(--color-primary)] [a]:hover:bg-[var(--color-primary)] [a]:hover:text-white",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-[var(--color-primary)]/40 text-[var(--color-primary-dark)] [a]:hover:border-[var(--color-primary)] [a]:hover:bg-[var(--color-primary)] [a]:hover:text-white",
        ghost:
          "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-main)]",
        link: "h-auto border-transparent px-0 text-[var(--color-primary)] underline-offset-4 hover:underline",
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
