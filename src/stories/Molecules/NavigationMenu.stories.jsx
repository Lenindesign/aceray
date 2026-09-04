import React from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

export default {
  title: 'Atomic Design/Molecules/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Responsive Navigation Dropdown Menu utilizing Base UI primitives. Enforces brand colors, Montserrat/Geist typography, and smooth transitions.',
      },
    },
  },
}

export const DropdownShowcase = () => (
  <div className="h-[250px] p-6 bg-white border border-[var(--color-border)] rounded-xl flex items-start justify-center">
    <NavigationMenu align="center">
      <NavigationMenuList className="flex gap-4">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] focus:outline-none">
            PRODUCTS
          </NavigationMenuTrigger>
          <NavigationMenuContent className="nav-dropdown bg-white border border-[var(--color-border)] shadow-lg rounded-xl p-6 min-w-[200px]">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">Product Types</span>
              <div className="flex flex-col gap-2">
                <NavigationMenuLink href="/catalog?cat=side-chairs" className="text-sm text-[var(--color-text-main)] hover:text-[var(--color-primary)] transition-colors">
                  Side Chairs
                </NavigationMenuLink>
                <NavigationMenuLink href="/catalog?cat=armchairs" className="text-sm text-[var(--color-text-main)] hover:text-[var(--color-primary)] transition-colors">
                  Armchairs
                </NavigationMenuLink>
                <NavigationMenuLink href="/catalog?cat=barstools" className="text-sm text-[var(--color-text-main)] hover:text-[var(--color-primary)] transition-colors">
                  Barstools
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] focus:outline-none">
            RESOURCES
          </NavigationMenuTrigger>
          <NavigationMenuContent className="nav-dropdown bg-white border border-[var(--color-border)] shadow-lg rounded-xl p-6 min-w-[200px]">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">Downloads</span>
              <div className="flex flex-col gap-2">
                <NavigationMenuLink href="/fabrics-finishes" className="text-sm text-[var(--color-text-main)] hover:text-[var(--color-primary)] transition-colors">
                  Fabrics & Finishes
                </NavigationMenuLink>
                <NavigationMenuLink href="/contact" className="text-sm text-[var(--color-text-main)] hover:text-[var(--color-primary)] transition-colors">
                  Request a Sample
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>
)
