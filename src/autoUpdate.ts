/**
 * startAutoUpdate — keep an installed (Home Screen / standalone) PWA on the
 * latest deploy without the user ever removing + re-adding the icon.
 *
 * How it works: the running session knows the hashed filename of the JS bundle
 * it loaded (e.g. `/assets/index-ChdPqh0G.js`). On launch and whenever the app
 * returns to the foreground, we fetch the current `index.html` with
 * `cache: 'no-store'` and read the bundle filename it references now. If the
 * deployed build has a different hash, a newer version is live, so we reload to
 * pick it up. Reloads only happen when there is genuinely a new build, so a
 * normal foreground-return does nothing.
 *
 * Pair with no-cache headers on `/` + `/index.html` (so the reload fetches the
 * fresh shell, not a cached one) and immutable hashed `/assets/*`. The suite
 * apps already set these in vercel.json.
 *
 * Call once from the app entry:  startAutoUpdate()
 * Returns a disposer (mainly for tests / HMR).
 */
export interface AutoUpdateOptions {
  /**
   * Background poll cadence (ms) WHILE the app is visible. Default 0 = off, so
   * the only triggers are launch + foreground-return (never interrupts active
   * use mid-task). Set e.g. 600000 for a 10-min safety poll on always-open
   * dashboards.
   */
  intervalMs?: number
  /** Path fetched to read the live build (default '/'). */
  shellPath?: string
}

const BUNDLE_RE = /\/assets\/index-([A-Za-z0-9_-]+)\.(?:js|mjs)/

function bundleIdFrom(text: string): string | null {
  const m = text.match(BUNDLE_RE)
  return m ? m[1] : null
}

export function startAutoUpdate(opts: AutoUpdateOptions = {}): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {}
  }

  // Identify the bundle this session is actually running.
  const runningSrc = Array.from(
    document.querySelectorAll<HTMLScriptElement>('script[type="module"][src]'),
  )
    .map((s) => s.src)
    .find((src) => BUNDLE_RE.test(src))
  const current = runningSrc ? bundleIdFrom(runningSrc) : null
  // No hashed entry (dev server, or an unexpected build shape) → nothing to do.
  if (!current) return () => {}

  const shellPath = opts.shellPath ?? '/'
  let busy = false
  let stopped = false

  const check = async () => {
    if (busy || stopped || document.visibilityState !== 'visible') return
    busy = true
    try {
      const res = await fetch(shellPath, { cache: 'no-store' })
      if (!res.ok) return
      const next = bundleIdFrom(await res.text())
      if (next && next !== current) {
        // Loop guard: if a misconfigured cache keeps serving the old shell,
        // only attempt the reload once per detected version.
        if (sessionStorage.getItem('aud_au_reloaded') === next) return
        sessionStorage.setItem('aud_au_reloaded', next)
        window.location.reload()
      }
    } catch {
      /* offline / transient — retry on the next trigger */
    } finally {
      busy = false
    }
  }

  const onVisible = () => {
    if (document.visibilityState === 'visible') void check()
  }
  document.addEventListener('visibilitychange', onVisible)
  window.addEventListener('focus', onVisible)
  const launchCheck = window.setTimeout(() => void check(), 3000)
  const interval = opts.intervalMs ?? 0
  const poll = interval > 0 ? window.setInterval(() => void check(), interval) : 0

  return () => {
    stopped = true
    document.removeEventListener('visibilitychange', onVisible)
    window.removeEventListener('focus', onVisible)
    window.clearTimeout(launchCheck)
    if (poll) window.clearInterval(poll)
  }
}
