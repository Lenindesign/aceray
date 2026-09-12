import React from 'react'
import type { MaterialOption, ProductDetails } from './configuration-data'

interface ConfigurationSummaryProps {
  product: ProductDetails
  selectedFabric: MaterialOption
  selectedWood: MaterialOption
  onReset: () => void
  onSave: () => void
  onShare: () => void
  feedbackMessage?: string | null
}

export const ConfigurationSummary: React.FC<ConfigurationSummaryProps> = ({
  product,
  selectedFabric,
  selectedWood,
  onReset,
  onSave,
  onShare,
  feedbackMessage,
}) => {
  const configurationName = `${selectedFabric.name} Fabric / ${selectedWood.name} Wood`

  return (
    <div className="config-summary-card">
      <div>
        <span className="config-spec-label">Selected Configuration</span>
        <h4 className="config-summary-title mt-1">{configurationName}</h4>
      </div>

      <div className="config-summary-specs border-t border-b border-[#e5e3df] py-3">
        <div className="config-spec-item">
          <span className="config-spec-label">Model</span>
          <span className="config-spec-val">{product.modelNumber} {product.title}</span>
        </div>
        <div className="config-spec-item">
          <span className="config-spec-label">Origin</span>
          <span className="config-spec-val">{product.madeIn}</span>
        </div>
        <div className="config-spec-item">
          <span className="config-spec-label">Upholstery</span>
          <span className="config-spec-val">{product.grade}</span>
        </div>
        <div className="config-spec-item">
          <span className="config-spec-label">Lead Time</span>
          <span className="config-spec-val">{product.leadTime}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="config-spec-label">List Price (USD)</span>
          <div className="text-xl font-semibold text-[#111111] font-heading">
            ${product.basePrice.toLocaleString()}
          </div>
        </div>
        <span className="text-xs text-[#777777] font-sans">COM/COL & custom stains available</span>
      </div>

      <div className="config-action-row pt-2">
        <button
          type="button"
          onClick={onSave}
          className="btn-primary config-btn-shared"
          title="Save this configuration to your local browser storage"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Configuration
        </button>

        <button
          type="button"
          onClick={onShare}
          className="btn-outline config-btn-shared"
          title="Copy direct link with current options to clipboard"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>

        <button
          type="button"
          onClick={onReset}
          className="config-btn-shared text-[#666666] hover:text-[#111111] bg-transparent border border-[#d5d3ce] hover:border-[#111111]"
          title="Reset to default fabric and wood finish"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>
      </div>

      {feedbackMessage && (
        <div className="toast-message mt-2" role="status" aria-live="polite">
          <svg className="w-3.5 h-3.5 text-[#718f80]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {feedbackMessage}
        </div>
      )}
    </div>
  )
}

export default ConfigurationSummary
