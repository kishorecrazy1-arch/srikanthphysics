/**
 * UTM Parameter Utilities
 * Captures and stores UTM parameters from URL query string
 */

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
}

/**
 * Extract UTM parameters from URL search params
 */
export function getUTMParams(searchParams: URLSearchParams): UTMParams {
  return {
    source: searchParams.get('utm_source') || undefined,
    medium: searchParams.get('utm_medium') || undefined,
    campaign: searchParams.get('utm_campaign') || undefined,
  };
}

/**
 * Get UTM params from current window location
 */
export function getUTMFromWindow(): UTMParams {
  if (typeof window === 'undefined') {
    return {};
  }
  
  const params = new URLSearchParams(window.location.search);
  return getUTMParams(params);
}

/**
 * Store UTM params in cookie (30 days)
 */
export function storeUTMInCookie(utm: UTMParams): void {
  if (typeof document === 'undefined') return;
  
  const cookieValue = JSON.stringify(utm);
  const expires = new Date();
  expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  
  document.cookie = `srk_utm=${encodeURIComponent(cookieValue)};expires=${expires.toUTCString()};path=/`;
}

/**
 * Get UTM params from cookie
 */
export function getUTMFromCookie(): UTMParams {
  if (typeof document === 'undefined') return {};
  
  const cookies = document.cookie.split(';');
  const utmCookie = cookies.find(c => c.trim().startsWith('srk_utm='));
  
  if (!utmCookie) return {};
  
  try {
    const value = utmCookie.split('=')[1];
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return {};
  }
}

/**
 * Get UTM params (prioritize URL params, fallback to cookie)
 */
export function getUTM(): UTMParams {
  const urlParams = getUTMFromWindow();
  
  // If URL has UTM params, use them and update cookie
  if (urlParams.source || urlParams.medium || urlParams.campaign) {
    storeUTMInCookie(urlParams);
    return urlParams;
  }
  
  // Otherwise, use cookie
  return getUTMFromCookie();
}

