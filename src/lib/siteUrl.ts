/**
 * Canonical origin for Supabase auth redirects (password reset, OAuth).
 *
 * Set `VITE_APP_URL=https://your-production-domain.com` on Vercel (and in `.env` for local
 * testing of production URLs). If unset, falls back to `window.location.origin` — so a reset
 * requested on localhost will embed localhost in the email (dev server must be running when
 * you open the link, and the port must match).
 */
export function getAuthSiteOrigin(): string {
  const raw = import.meta.env.VITE_APP_URL;
  if (typeof raw === 'string' && raw.trim()) {
    return raw.trim().replace(/\/$/, '');
  }
  return window.location.origin;
}
