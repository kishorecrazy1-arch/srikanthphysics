/**
 * Canonical origin for Supabase auth redirects (password reset, OAuth).
 *
 * Production (Supabase Site URL): https://www.srikanthsacademy.com — set on Vercel:
 *   `VITE_APP_URL=https://www.srikanthsacademy.com`
 * (no trailing slash in the env value is fine). This must match Supabase “Site URL” and the
 * hosts you list under “Redirect URLs”. If you also serve bare `srikanthsacademy.com`, add those
 * URLs too or redirect one host to the other so users and emailed links stay on one origin.
 *
 * If `VITE_APP_URL` is unset, this falls back to `window.location.origin` (fine when users only
 * ever open the app from the live domain). Local dev: omit it or point `.env` at production only
 * when testing emailed links; password-reset PKCE requires the same browser that requested it.
 */
export function getAuthSiteOrigin(): string {
  const raw = import.meta.env.VITE_APP_URL;
  if (typeof raw === 'string' && raw.trim()) {
    return raw.trim().replace(/\/$/, '');
  }
  return window.location.origin;
}

/** Full callback URL for OAuth and email links; keeps redirects aligned with Supabase “Redirect URLs”. */
export function getAuthCallbackUrl(path: string): string {
  const origin = getAuthSiteOrigin();
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${normalized}`;
}
