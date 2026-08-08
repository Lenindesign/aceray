import React from 'react'

export default {
  title: 'Atomic Design/Atoms/Typography',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Dual Typography System enforcing Rule 9: Headlines & Titles use Futura Std (var(--font-heading)), Body & Specs use Geist (var(--font-sans)).',
      },
    },
  },
}

export const TypographyScale = () => (
  <div className="space-y-6 p-8 bg-white rounded-xl border border-[#E5E3DD] max-w-3xl">
    <div>
      <span className="text-xs uppercase tracking-widest text-[#718f80] font-sans">Futura Std (Headlines)</span>
      <h1 className="text-4xl font-normal text-[#222] tracking-wide mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
        ELEGANT CONTRACT SEATING
      </h1>
    </div>

    <div>
      <span className="text-xs uppercase tracking-widest text-[#718f80] font-sans">Futura Std (Section Title)</span>
      <h2 className="text-2xl font-medium text-[#222] uppercase tracking-wide mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
        DESIGNED & MADE IN ITALY
      </h2>
    </div>

    <div>
      <span className="text-xs uppercase tracking-widest text-[#718f80] font-sans">Geist (Body Large)</span>
      <p className="text-base text-[#555] leading-relaxed mt-1" style={{ fontFamily: 'var(--font-sans)' }}>
        Aceray presents design professionals with unique contemporary seating and table designs from international artisans.
      </p>
    </div>

    <div>
      <span className="text-xs uppercase tracking-widest text-[#718f80] font-sans">Geist (Specs & Metadata)</span>
      <p className="text-xs text-[#767676] tracking-wider uppercase mt-1" style={{ fontFamily: 'var(--font-sans)' }}>
        Solid Beech Frame • Flame Retardant Foam • Stackable up to 6
      </p>
    </div>
  </div>
)
