import React from 'react'
import type { MaterialOption } from './configuration-data'
import MaterialSwatch from './MaterialSwatch'

interface MaterialSelectorProps {
  title: string
  subtitle?: string
  options: MaterialOption[]
  selectedId: string
  onSelect: (id: string) => void
  groupId: string
}

export const MaterialSelector: React.FC<MaterialSelectorProps> = ({
  title,
  subtitle,
  options,
  selectedId,
  onSelect,
  groupId,
}) => {
  const selectedOption = options.find((opt) => opt.id === selectedId) || options[0]

  return (
    <section className="material-group" aria-labelledby={`${groupId}-heading`}>
      <div className="material-group-header">
        <h3 id={`${groupId}-heading`} className="material-group-title">
          {title}
        </h3>
        <div className="material-group-selected text-right" aria-live="polite">
          <span className="font-semibold text-[#111111]">{selectedOption.name}</span>
          {selectedOption.description && (
            <span className="text-xs text-[#718f80] block">
              {selectedOption.description}
            </span>
          )}
        </div>
      </div>

      <div
        role="radiogroup"
        aria-labelledby={`${groupId}-heading`}
        className="swatch-grid"
      >
        {options.map((option) => (
          <MaterialSwatch
            key={option.id}
            option={option}
            isSelected={option.id === selectedId}
            onSelect={onSelect}
            groupId={groupId}
          />
        ))}
      </div>
    </section>
  )
}

export default MaterialSelector
