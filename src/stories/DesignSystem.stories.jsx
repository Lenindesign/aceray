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
    <section className="sb-overview sb-overview-wide">
      <div className="sb-token-logo-panel">
        <img
          src="/assets/images/logo.svg"
          alt="Aceray"
          className="sb-token-logo"
        />
      </div>

      <div className="sb-overview-header">
        <p className="sb-overview-eyebrow">Aceray</p>
        <h1 className="sb-overview-title">Design Tokens</h1>
        <p className="sb-overview-copy">
          Core colors and typography pulled from the production stylesheet.
        </p>
      </div>

      <div className="sb-token-grid">
        {colors.map(([name, value, token]) => (
          <div key={name} className="sb-token-card">
            <div className="sb-token-swatch" style={{ backgroundColor: value }} />
            <div className="sb-token-card-row">
              <div>
                <h2 className="sb-token-name">{name}</h2>
                <p className="sb-token-meta">{token}</p>
              </div>
              <code className="sb-token-code">{value}</code>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ActionsAndBadges() {
  return (
    <section className="sb-overview">
      <div>
        <h1 className="sb-overview-section-title">Buttons</h1>
        <div className="sb-control-row">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      <div>
        <h2 className="sb-overview-section-title">Badges</h2>
        <div className="sb-control-row">
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
    <section className="sb-overview">
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

      <Card className="sb-demo-card">
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
    <section className="ds-guidelines">
      <div className="ds-guidelines-intro">
        <p className="ds-guidelines-eyebrow">Aceray Design System</p>
        <h1 className="ds-guidelines-title">
          BUTTON SYSTEM & GUIDELINES
        </h1>
        <p className="ds-guidelines-copy">
          All application CTAs MUST strictly use <code className="ds-guidelines-code">.btn-primary</code> or <code className="ds-guidelines-code">.btn-outline</code>. Inline style overrides on primary actions are strictly forbidden per project rules.
        </p>
      </div>

      <div className="ds-guidelines-grid">
        <article className="ds-guidelines-card">
          <div className="ds-guidelines-card-header">
            <span className="ds-guidelines-eyebrow">Guidelines</span>
            <h2 className="ds-guidelines-card-title">
              UNIVERSAL CTA RULES
            </h2>
          </div>
          <ul className="ds-guidelines-list">
            <li className="ds-guidelines-rule">
              <strong>Primary Call-to-Action (<code>.btn-primary</code>):</strong>
              Solid sage green background (<code>#718f80</code>), pure white text, uppercase tracking (<code>0.08em</code>), 12px 24px padding, and dark sage hover state.
            </li>
            <li className="ds-guidelines-rule">
              <strong>Secondary / Outlined CTA (<code>.btn-outline</code>):</strong>
              Transparent background with green border and dark green text, filling solid green with white text on hover.
            </li>
            <li className="ds-guidelines-rule">
              <strong>Universal Spacing Rule:</strong>
              Buttons MUST feature explicit padding (<code>12px 24px</code>) and 16px container padding buffers to prevent touching borders.
            </li>
          </ul>
        </article>

        <div className="ds-guidelines-card ds-guidelines-showcase">
          <div className="ds-guidelines-card-header">
            <span className="ds-guidelines-eyebrow">Interactive Showcase</span>
            <h2 className="ds-guidelines-card-title">
              BUTTON VARIANTS
            </h2>
          </div>

          <div className="ds-guidelines-variants">
            <div className="ds-guidelines-variant">
              <span>Primary CTA (<code>.btn-primary</code>)</span>
              <div>
                <Button className="btn-primary">Request a Quote</Button>
              </div>
            </div>

            <div className="ds-guidelines-variant">
              <span>Outline CTA (<code>.btn-outline</code>)</span>
              <div>
                <Button variant="outline" className="btn-outline">View Specs Sheet</Button>
              </div>
            </div>

            <div className="ds-guidelines-variant">
              <span>Small Primary CTA</span>
              <div>
                <Button className="btn-primary text-xs px-4 py-2">Quick View</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function LoadingStates() {
  return (
    <section className="sb-loading-grid">
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
