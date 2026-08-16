import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[var(--radius-btn)] border border-transparent bg-clip-padding font-sans text-[0.75rem] font-semibold tracking-[0.08em] uppercase leading-none whitespace-nowrap transition-all outline-none select-none focus-visible:border-[var(--color-primary)] focus-visible:ring-3 focus-visible:ring-[var(--color-primary)]/20 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:border-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)] px-6",
        outline:
          "border-[var(--color-primary)] bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white aria-expanded:bg-[var(--color-primary)] aria-expanded:text-white px-6",
        secondary:
          "border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-main)] hover:border-[var(--color-primary)] hover:bg-[var(--color-bg-light)] hover:text-[var(--color-primary-dark)] aria-expanded:border-[var(--color-primary)] aria-expanded:text-[var(--color-primary-dark)] px-6",
        ghost:
          "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-main)] aria-expanded:bg-[var(--color-bg-card)] aria-expanded:text-[var(--color-text-main)] px-6",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40 px-6",
        link: "h-auto border-transparent bg-transparent px-0 text-[var(--color-primary)] shadow-none underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-1.5 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-7 gap-1 px-2.5 text-[0.65rem] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 text-[0.7rem] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-8 has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6",
        icon: "size-10",
        "icon-xs":
          "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(buttonVariants({ variant, size, className }))

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ref,
        ...props,
        className: cn(classes, children.props.className),
      })
    }

    return (
      <button ref={ref} type={props.type ?? "button"} className={classes} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
