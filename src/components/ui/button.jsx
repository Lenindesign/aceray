import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[var(--radius-btn)] border border-transparent bg-clip-padding font-sans text-[0.75rem] font-semibold tracking-[0.08em] uppercase leading-none whitespace-nowrap transition-all outline-none select-none focus-visible:border-[#718f80] focus-visible:ring-3 focus-visible:ring-[#718f80]/20 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border-[#718f80] bg-[#718f80] text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:border-[#5a6e5e] hover:bg-[#5a6e5e] px-6",
        outline:
          "border-[#718f80] bg-transparent text-[#718f80] hover:bg-[#718f80] hover:text-white aria-expanded:bg-[#718f80] aria-expanded:text-white px-6",
        secondary:
          "border-[#E5E3DD] bg-[#F3F2EE] text-[#222] hover:border-[#718f80] hover:bg-[#E8EFE7] hover:text-[#5a6e5e] aria-expanded:border-[#718f80] aria-expanded:text-[#5a6e5e] px-6",
        ghost:
          "text-[#555] hover:bg-[#F3F2EE] hover:text-[#222] aria-expanded:bg-[#F3F2EE] aria-expanded:text-[#222] px-6",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40 px-6",
        link: "h-auto border-transparent bg-transparent px-0 text-[#718f80] shadow-none underline-offset-4 hover:underline",
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
