import React, { useState, useEffect } from 'react'
import type { MaterialOption } from './configuration-data'

interface ChairPreviewProps {
  imageSrc: string
  fabric: MaterialOption
  wood: MaterialOption
  productTitle: string
}

export const ChairPreview: React.FC<ChairPreviewProps> = ({
  imageSrc,
  fabric,
  wood,
  productTitle,
}) => {
  const [currentSrc, setCurrentSrc] = useState(imageSrc)
  const [prevSrc, setPrevSrc] = useState<string | null>(null)
  const [isCrossfading, setIsCrossfading] = useState(false)

  useEffect(() => {
    if (imageSrc !== currentSrc) {
      // Preload next image
      const img = new Image()
      img.src = imageSrc
      img.onload = () => {
        setPrevSrc(currentSrc)
        setCurrentSrc(imageSrc)
        setIsCrossfading(true)

        const timer = setTimeout(() => {
          setIsCrossfading(false)
          setPrevSrc(null)
        }, 360)

        return () => clearTimeout(timer)
      }
    }
  }, [imageSrc, currentSrc])

  const altDescription = `Aceray ${productTitle} customized with ${fabric.name} fabric and ${wood.name} wood finish`

  return (
    <div className="chair-preview-stage" role="region" aria-label="Interactive Product Preview">
      {/* Top Badges */}
      <div className="preview-badge-overlay">
        <span className="preview-badge preview-badge-primary">Aceray Configurator</span>
        <span className="preview-badge">{fabric.name}</span>
        <span className="preview-badge">{wood.name}</span>
      </div>

      {/* Previous image layer during crossfade */}
      {prevSrc && isCrossfading && (
        <img
          src={prevSrc}
          alt=""
          aria-hidden="true"
          className="chair-preview-img-layer chair-preview-img-inactive"
        />
      )}

      {/* Active image layer */}
      <img
        src={currentSrc}
        alt={altDescription}
        className="chair-preview-img-layer chair-preview-img-active"
        loading="eager"
      />
    </div>
  )
}

export default ChairPreview
