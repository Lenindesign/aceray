import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled Application Error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center py-16 px-6 text-center bg-[var(--color-bg-light)]">
          <div className="max-w-md w-full bg-[var(--color-white)] p-8 md:p-10 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-sm">
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--color-primary)] font-semibold font-sans block mb-2">
              System Notice
            </span>
            <h1 className="text-2xl md:text-3xl font-medium uppercase text-[var(--color-text-main)] mb-4 font-heading leading-tight">
              Something Went Wrong
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm md:text-base leading-relaxed mb-6 font-sans">
              We encountered an unexpected issue while loading this view. You can reload the page or return to the main catalog.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="btn-primary w-full sm:w-auto"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="btn-outline w-full sm:w-auto"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
