import { useEffect, useState } from 'react'

/** Android Chrome beforeinstallprompt handler — shows "Install app" button */
export function InstallBanner() {
  const [deferred, setDeferred] = useState<any>(null)
  const [hidden, setHidden] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    setIsStandalone(standalone)

    const onBip = (e: Event) => {
      e.preventDefault()
      setDeferred(e)
    }
    window.addEventListener('beforeinstallprompt', onBip)
    return () => window.removeEventListener('beforeinstallprompt', onBip)
  }, [])

  if (isStandalone || hidden || !deferred) return null

  async function install() {
    if (!deferred) return
    deferred.prompt()
    const choice = await deferred.userChoice
    setDeferred(null)
    if (choice?.outcome === 'accepted') setHidden(true)
  }

  return (
    <div className="mb-4 rounded-xl border border-orange-600/40 bg-orange-950/40 px-3 py-3 flex items-center gap-3 text-sm">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-orange-200">Install SDSP</p>
        <p className="text-xs text-slate-400">
          Add to Home screen — works offline on this phone
        </p>
      </div>
      <button
        type="button"
        onClick={install}
        className="shrink-0 rounded-lg bg-orange-600 active:bg-orange-500 px-3 py-2 text-xs font-semibold text-white"
      >
        Install
      </button>
      <button
        type="button"
        onClick={() => setHidden(true)}
        className="shrink-0 text-slate-500 text-xs px-1"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}
