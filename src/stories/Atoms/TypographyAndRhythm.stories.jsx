import React from 'react'

export default {
  title: 'Atomic Design/Atoms/Typography & Vertical Rhythm',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Enforces Rule 14 (Global Vertical Rhythm & Line-Height Rule): Standardized line-height scale and 8pt Grid spacing system across Aceray.',
      },
    },
  },
}

export const LineHeightScale = () => (
  <div className="space-y-8 max-w-4xl p-6 bg-white rounded-[var(--radius-card)] border border-[#E5E3DD]">
    <div className="border-b border-[#E5E3DD] pb-4">
      <span className="text-[#718f80] text-xs font-bold uppercase tracking-widest block mb-1">
        Hero Display Heading (line-height: 0.88 - 0.95)
      </span>
      <h1 className="font-heading text-5xl uppercase font-light text-[#222222] leading-[0.88] m-0">
        ALBA COLLECTION
      </h1>
      <p className="text-xs text-[#767676] mt-2">
        Tight architectural line-height prevents awkward baseline gaps under large uppercase hero titles.
      </p>
    </div>

    <div className="border-b border-[#E5E3DD] pb-4">
      <span className="text-[#718f80] text-xs font-bold uppercase tracking-widest block mb-1">
        Section Heading (line-height: 1.15 - 1.25)
      </span>
      <h2 className="font-heading text-2xl uppercase font-normal text-[#222222] leading-[1.2] m-0">
        EUROPEAN CONTRACT SEATING
      </h2>
      <p className="text-xs text-[#767676] mt-2">
        Balanced proportional heading line height for structural page sections.
      </p>
    </div>

    <div className="border-b border-[#E5E3DD] pb-4">
      <span className="text-[#718f80] text-xs font-bold uppercase tracking-widest block mb-1">
        Action CTA Buttons (line-height: 1.0 + Flexbox Centering)
      </span>
      <div className="flex flex-wrap gap-4 items-center mt-3">
        <button className="btn-primary">
          View Product Page →
        </button>
        <button className="btn-outline">
          Request Quote / Specs
        </button>
      </div>
      <p className="text-xs text-[#767676] mt-2">
        Explicit 44px container height + <code>display: inline-flex; align-items: center; justify-content: center; line-height: 1;</code> ensures 100% mathematical vertical text centering.
      </p>
    </div>

    <div>
      <span className="text-[#718f80] text-xs font-bold uppercase tracking-widest block mb-1">
        Body Paragraph Copy (line-height: 1.65 - 1.70)
      </span>
      <p className="font-sans text-sm text-[#555555] leading-[1.65] max-w-2xl m-0">
        Aceray products are designed by leading European industrial designers and engineered specifically for high-turn contract, corporate, and hospitality interiors. Each frame features multi-density polyurethane foam and certified commercial hardwood construction.
      </p>
      <p className="text-xs text-[#767676] mt-2">
        Optimal line length and line height for ergonomic legibility adhering to WCAG AA accessibility standards.
      </p>
    </div>
  </div>
)

export const SpacingScale8pt = () => {
  const tokens = [
    { token: '--space-0-5', px: '4px', rem: '0.25rem', label: 'Micro gap / tag padding' },
    { token: '--space-1', px: '8px', rem: '0.5rem', label: 'Title to meta gap / button icon spacing' },
    { token: '--space-1-5', px: '12px', rem: '0.75rem', label: 'Small list stack spacing' },
    { token: '--space-2', px: '16px', rem: '1.0rem', label: 'Paragraph bottom margin / grid gap (mobile)' },
    { token: '--space-3', px: '24px', rem: '1.5rem', label: 'Card internal padding (24px)' },
    { token: '--space-4', px: '32px', rem: '2.0rem', label: 'Component section gap' },
    { token: '--space-6', px: '48px', rem: '3.0rem', label: 'Internal card vertical padding buffer' },
    { token: '--space-8', px: '64px', rem: '4.0rem', label: 'Sub-section vertical rhythm' },
    { token: '--space-10', px: '80px', rem: '5.0rem', label: 'Standard page section padding' },
    { token: '--space-16', px: '128px', rem: '8.0rem', label: 'Major landing section padding' },
  ]

  return (
    <div className="space-y-4 max-w-3xl p-6 bg-white rounded-[var(--radius-card)] border border-[#E5E3DD]">
      <h3 className="font-heading text-lg text-[#222222] uppercase tracking-wider mb-4">
        8pt Grid Vertical Rhythm Scale
      </h3>
      {tokens.map((item) => (
        <div key={item.token} className="flex items-center gap-4 text-xs font-mono">
          <div className="w-28 text-[#718f80] font-bold">{item.token}</div>
          <div className="w-16 text-[#222222]">{item.px}</div>
          <div className="w-16 text-[#767676]">{item.rem}</div>
          <div
            className="bg-[#718f80] h-4 rounded-sm"
            style={{ width: item.px }}
          />
          <div className="text-[#555555] font-sans text-xs flex-1 truncate">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
