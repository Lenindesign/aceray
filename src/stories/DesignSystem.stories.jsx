import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const meta = {
  title: 'Aceray Design System/Overview',
  parameters: {
    layout: 'padded',
  },
}

export default meta

export function BrandTokens() {
  const colors = [
    ['Primary', '#718f80', 'var(--color-primary)'],
    ['Primary Dark', '#5a6e5e', 'var(--color-primary-dark)'],
    ['Accent', '#2C3E35', 'var(--color-accent)'],
    ['Text', '#222222', 'var(--color-text-main)'],
    ['Muted', '#767676', 'var(--color-text-light)'],
    ['Card', '#F3F2EE', 'var(--color-bg-card)'],
  ]

  return (
    <section className="max-w-5xl p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#718f80]">Aceray</p>
        <h1 className="mt-2 text-4xl font-light tracking-wide text-[#222]">Design Tokens</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#555]">
          Core colors and typography pulled from the production stylesheet.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {colors.map(([name, value, token]) => (
          <div key={name} className="border border-[#E5E3DD] bg-white p-4">
            <div className="mb-4 h-20 border border-black/5" style={{ backgroundColor: value }} />
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-[#222]">{name}</h2>
                <p className="text-xs text-[#767676]">{token}</p>
              </div>
              <code className="text-xs text-[#555]">{value}</code>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ActionsAndBadges() {
  return (
    <section className="max-w-4xl space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-light tracking-wide text-[#222]">Buttons</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-light tracking-wide text-[#222]">Badges</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge>Trade</Badge>
          <Badge variant="outline">Outdoor</Badge>
          <Badge variant="secondary">Contract</Badge>
          <Badge variant="destructive">Unavailable</Badge>
        </div>
      </div>
    </section>
  )
}

export function CardsAndNavigation() {
  return (
    <section className="max-w-4xl space-y-8 p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/catalog">Catalog</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Side Chairs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="max-w-md rounded-sm">
        <CardHeader>
          <div>
            <CardTitle>Trade Sample Request</CardTitle>
            <CardDescription>Commercial designers can request finish samples and pricing support.</CardDescription>
          </div>
          <CardAction>
            <Badge variant="outline">New</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-[#555]">
            Use cards for bounded content groups such as requests, quotes, and product support panels.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Review Request</Button>
        </CardFooter>
      </Card>
    </section>
  )
}

export function ButtonGuidelines() {
  return (
    <section className="max-w-5xl space-y-8 p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#718f80]">Aceray</p>
        <h1 className="mt-2 text-4xl font-light tracking-wide text-[#222]">Button Guidelines</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-[#555]">
          Buttons should feel consistent across the design system. Use the primary variant for important actions, secondary for supportive actions, and ghost for low-priority affordances.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <article className="rounded-sm border border-[#E5E3DD] bg-white p-6">
            <h2 className="text-xl font-semibold text-[#222]">Best Practices</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#555]">
              <li><strong>Use the right variant.</strong> Primary for main actions, outline for secondary actions, ghost for subtle UI controls.</li>
              <li><strong>Keep labels concise.</strong> Prefer short, actionable text like “Save Draft”, “Open Gallery”, “View Catalog”.</li>
              <li><strong>Prefer `asChild` for routed links.</strong> Preserve button styling while rendering an anchor or router link inside the component.</li>
              <li><strong>Ensure keyboard focus is visible.</strong> Button styles include a clear focus ring and border state.</li>
              <li><strong>Avoid buttons for navigation-only links.</strong> Use buttons for actions that modify state, and links when changing pages.</li>
            </ul>
          </article>

          <article className="rounded-sm border border-[#E5E3DD] bg-[#F9F8F6] p-6">
            <h2 className="text-xl font-semibold text-[#222]">Sizing</h2>
            <p className="mt-3 text-sm leading-6 text-[#555]">
              Use `size="default"` for standard actions, `sm` for compact inline buttons, and `lg` for high-priority calls to action.
            </p>
          </article>
        </div>

        <div className="grid gap-4">
          <Button variant="default">Primary Action</Button>
          <Button variant="outline">Secondary Action</Button>
          <Button variant="secondary">Neutral Action</Button>
          <Button variant="ghost">Ghost Action</Button>
          <Button variant="link">Link Action</Button>
          <Button size="sm" variant="default">Small Action</Button>
          <Button size="lg" variant="default">Large Action</Button>
        </div>
      </div>
    </section>
  )
}

export function LoadingStates() {
  return (
    <section className="grid max-w-5xl grid-cols-2 gap-6 p-8 sm:grid-cols-3 lg:grid-cols-4">
      {[...Array(8)].map((_, index) => (
        <div key={index}>
          <Skeleton className="aspect-square rounded-sm" />
          <Skeleton className="mt-3 h-4 w-3/4" />
          <Skeleton className="mt-2 h-3 w-1/2" />
        </div>
      ))}
    </section>
  )
}
