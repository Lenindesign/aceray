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
  <div className="space-y-6 p-8 bg-white rounded-xl border border-[var(--color-border)] max-w-3xl">
    <div>
      <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-sans">Futura Std (Headlines)</span>
      <h1 className="text-4xl font-normal text-[var(--color-text-main)] tracking-wide mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
        ELEGANT CONTRACT SEATING
      </h1>
    </div>

    <div>
      <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-sans">Futura Std (Section Title)</span>
      <h2 className="text-2xl font-medium text-[var(--color-text-main)] uppercase tracking-wide mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
        DESIGNED & MADE IN ITALY
      </h2>
    </div>

    <div>
      <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-sans">Geist (Body Large)</span>
      <p className="text-base text-[var(--color-text-muted)] leading-relaxed mt-1" style={{ fontFamily: 'var(--font-sans)' }}>
        Aceray presents design professionals with unique contemporary seating and table designs from international artisans.
      </p>
    </div>

    <div>
      <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-sans">Geist (Specs & Metadata)</span>
      <p className="text-xs text-[var(--color-text-light)] tracking-wider uppercase mt-1" style={{ fontFamily: 'var(--font-sans)' }}>
        Solid Beech Frame • Flame Retardant Foam • Stackable up to 6
      </p>
    </div>
  </div>
)
