import React from 'react'
import type { MaterialOption } from './configuration-data'

interface MaterialSwatchProps {
  option: MaterialOption
  isSelected: boolean
  onSelect: (id: string) => void
  groupId: string
}

export const MaterialSwatch: React.FC<MaterialSwatchProps> = ({
  option,
  isSelected,
  onSelect,
  groupId,
}) => {
  const handleClick = () => {
    onSelect(option.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(option.id)
    }
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-label={`${option.name}${option.description ? `: ${option.description}` : ''}`}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`swatch-btn ${isSelected ? 'swatch-btn-active' : ''}`}
      id={`${groupId}-swatch-${option.id}`}
    >
      <img
        src={option.swatchUrl}
        alt={`Swatch for ${option.name}`}
        className="swatch-thumb"
        loading="lazy"
        width={48}
        height={48}
        onError={(e) => {
          // Fallback if swatch image fails to load
          if (option.hexHint) {
            ;(e.target as HTMLElement).style.backgroundColor = option.hexHint
          }
        }}
      />
      <span className="swatch-label">{option.name}</span>
    </button>
  )
}

export default MaterialSwatch
