import { useMemo, useState } from 'react'

const DEFAULT_PASSWORD = '1970Luna1750!'
const STORAGE_KEY = 'aceray_site_unlocked'

function isPasswordGateEnabled() {
  return import.meta.env.VITE_SITE_PASSWORD_ENABLED === 'true'
}

function getExpectedPassword() {
  return import.meta.env.VITE_SITE_PASSWORD || DEFAULT_PASSWORD
}

function getStoredPassword() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function storePassword(password) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, password)
  } catch {
    // Storage may be blocked in private or restricted browser contexts.
  }
}

export default function SitePasswordGate({ children }) {
  const isEnabled = useMemo(isPasswordGateEnabled, [])
  const expectedPassword = useMemo(getExpectedPassword, [])
  const [isUnlocked, setIsUnlocked] = useState(() => (
    getStoredPassword() === expectedPassword
  ))
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (password.trim() === expectedPassword) {
      storePassword(expectedPassword)
      setIsUnlocked(true)
      setError('')
      return
    }

    setError('Incorrect password. Please try again.')
  }

  if (!isEnabled || isUnlocked) return children

  return (
    <main className="site-password-page" aria-labelledby="site-password-title">
      <section className="site-password-panel">
        <img
          className="site-password-logo"
          src="/assets/images/logo.svg"
          alt="Aceray"
          width="160"
          height="36"
        />
        <div className="site-password-copy">
          <p className="site-password-eyebrow">Under Construction</p>
          <h1 id="site-password-title">Aceray Preview</h1>
          <p>
            This site is currently private while updates are in progress.
          </p>
        </div>
        <form className="site-password-form" onSubmit={handleSubmit}>
          <label htmlFor="site-password-input">Password</label>
          <input
            id="site-password-input"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            autoFocus
          />
          {error && (
            <p className="site-password-error" role="alert">
              {error}
            </p>
          )}
          <button className="btn-primary site-password-button" type="submit">
            Enter Site
          </button>
        </form>
      </section>
    </main>
  )
}
