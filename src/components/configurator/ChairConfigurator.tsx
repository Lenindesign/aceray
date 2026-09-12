import React, { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  PRODUCT_100_01,
  FABRICS,
  WOOD_FINISHES,
  DEFAULT_CONFIGURATION,
  getChairImagePath,
  isValidFabric,
  isValidWood,
  woodIdParam,
  type ChairConfiguration,
} from './configuration-data'
import ChairPreview from './ChairPreview'
import MaterialSelector from './MaterialSelector'
import ConfigurationSummary from './ConfigurationSummary'
import './configurator.css'

const STORAGE_KEY = 'aceray_configurator_100_01'

export const ChairConfigurator: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [toast, setToast] = useState<string | null>(null)

  // Initialize from URL search params or localStorage or fallback to defaults
  const [config, setConfig] = useState<ChairConfiguration>(() => {
    const urlFabric = searchParams.get('fabric')
    const urlWood = searchParams.get('wood')

    if (urlFabric && isValidFabric(urlFabric) && urlWood && isValidWood(urlWood)) {
      return {
        fabricId: urlFabric,
        woodId: woodIdParam(urlWood),
      }
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (isValidFabric(parsed.fabricId) && isValidWood(parsed.woodId)) {
          return {
            fabricId: parsed.fabricId,
            woodId: woodIdParam(parsed.woodId),
          }
        }
      }
    } catch {
      // Ignore localStorage errors
    }

    return DEFAULT_CONFIGURATION
  })

  // Preload all 16 combination images in background for instant responsiveness
  useEffect(() => {
    FABRICS.forEach((f) => {
      WOOD_FINISHES.forEach((w) => {
        const img = new Image()
        img.src = getChairImagePath(f.id, w.id)
      })
    })
  }, [])

  // Sync state when URL params change externally (e.g. back/forward navigation)
  useEffect(() => {
    const urlFabric = searchParams.get('fabric')
    const urlWood = searchParams.get('wood')

    if (urlFabric && isValidFabric(urlFabric) && urlWood && isValidWood(urlWood)) {
      const normalizedWood = woodIdParam(urlWood)
      if (urlFabric !== config.fabricId || normalizedWood !== config.woodId) {
        setConfig({ fabricId: urlFabric, woodId: normalizedWood })
      }
    }
  }, [searchParams, config.fabricId, config.woodId])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [])

  const handleFabricSelect = (fabricId: string) => {
    setConfig((prev) => ({ ...prev, fabricId }))
    // Optionally update URL query silently
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('fabric', fabricId)
    nextParams.set('wood', config.woodId)
    setSearchParams(nextParams, { replace: true })
  }

  const handleWoodSelect = (woodId: string) => {
    setConfig((prev) => ({ ...prev, woodId }))
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('fabric', config.fabricId)
    nextParams.set('wood', woodId)
    setSearchParams(nextParams, { replace: true })
  }

  const handleReset = () => {
    setConfig(DEFAULT_CONFIGURATION)
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('fabric', DEFAULT_CONFIGURATION.fabricId)
    nextParams.set('wood', DEFAULT_CONFIGURATION.woodId)
    setSearchParams(nextParams, { replace: true })
    showToast('Reset to default configuration')
  }

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
      showToast('Configuration saved to your browser!')
    } catch {
      showToast('Could not save configuration locally')
    }
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?fabric=${config.fabricId}&wood=${config.woodId}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Shareable link copied to clipboard!')
      }).catch(() => {
        showToast(`Share URL: ${shareUrl}`)
      })
    } else {
      showToast(`Share URL: ${shareUrl}`)
    }
  }

  const currentFabric = FABRICS.find((f) => f.id === config.fabricId) || FABRICS[0]
  const currentWood = WOOD_FINISHES.find((w) => w.id === config.woodId) || WOOD_FINISHES[0]
  const chairImageSrc = getChairImagePath(config.fabricId, config.woodId)

  return (
    <div className="configurator-container py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Editorial Header / Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#777777] font-sans">
          <li>
            <Link to="/catalog" className="hover:text-[#111111] transition-colors">Catalog</Link>
          </li>
          <li><span>/</span></li>
          <li>
            <Link to="/product/100-01" className="hover:text-[#111111] transition-colors">#100-01 Side Chair</Link>
          </li>
          <li><span>/</span></li>
          <li className="text-[#111111] font-semibold" aria-current="page">Customizer</li>
        </ol>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#e5e3df]">
        <div>
          <span className="tag text-xs tracking-widest text-[#718f80] uppercase font-sans font-semibold">
            Custom Specification Studio
          </span>
          <h1 className="text-3xl md:text-5xl font-heading text-[#111111] uppercase tracking-wide mt-1">
            {PRODUCT_100_01.modelNumber} {PRODUCT_100_01.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/product/100-01"
            className="text-xs uppercase tracking-wider text-[#718f80] hover:text-[#556e62] font-semibold flex items-center transition-colors"
          >
            ← Back to Product Details
          </Link>
        </div>
      </div>

      {/* Main Configurator Split Layout */}
      <div className="configurator-grid mt-6">
        {/* Left / Center: Interactive Large Chair Preview */}
        <div className="w-full">
          <ChairPreview
            imageSrc={chairImageSrc}
            fabric={currentFabric}
            wood={currentWood}
            productTitle={PRODUCT_100_01.title}
          />
          <div className="mt-3 flex items-center justify-between text-xs text-[#777777] px-1">
            <span>Pre-rendered studio capture (1024×1024)</span>
            <span>Instant visual preview</span>
          </div>
        </div>

        {/* Right: Clean Control Panel */}
        <div className="configurator-panel">
          {/* Fabric Selector */}
          <MaterialSelector
            title="1. Select Upholstery Fabric"
            subtitle="Planet Grade A"
            options={FABRICS}
            selectedId={config.fabricId}
            onSelect={handleFabricSelect}
            groupId="fabric-selector"
          />

          {/* Wood Finish Selector */}
          <MaterialSelector
            title="2. Select Wood Finish"
            subtitle="European Beech"
            options={WOOD_FINISHES}
            selectedId={config.woodId}
            onSelect={handleWoodSelect}
            groupId="wood-selector"
          />

          {/* Configuration Summary & Action Buttons */}
          <ConfigurationSummary
            product={PRODUCT_100_01}
            selectedFabric={currentFabric}
            selectedWood={currentWood}
            onReset={handleReset}
            onSave={handleSave}
            onShare={handleShare}
            feedbackMessage={toast}
          />
        </div>
      </div>
    </div>
  )
}

export default ChairConfigurator
