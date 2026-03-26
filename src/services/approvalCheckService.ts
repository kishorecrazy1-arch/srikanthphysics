/**
 * Service to check user approval status from Google Sheet via n8n
 */

/** Keys written from the sign-in webhook — clear on each login so stale values never override a fresh response */
export const SIGNIN_WEBHOOK_STORAGE_KEYS = [
  'webhookUser',
  'userName',
  'userEmail',
  'userCourse',
  'userBatch',
  'courseType',
] as const;

const SIGNIN_NOTIFICATION_DEDUPE_MS = 30 * 60 * 1000;

function getSigninNotificationDedupeKey(userId: string): string {
  return `lastSigninNotification_${userId}`;
}

function getSigninApprovalCacheKey(userId: string): string {
  return `lastSigninApprovalResult_${userId}`;
}

export function clearSigninNotificationDedupe(userId: string): void {
  if (typeof window === 'undefined' || !userId) return;
  try {
    localStorage.removeItem(getSigninNotificationDedupeKey(userId));
    localStorage.removeItem(getSigninApprovalCacheKey(userId));
  } catch {
    /* ignore */
  }
}

export function clearSigninWebhookLocalStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    for (const key of SIGNIN_WEBHOOK_STORAGE_KEYS) {
      localStorage.removeItem(key);
    }
  } catch {
    /* ignore */
  }
}

/**
 * n8n often returns `[{ ... }]` or `{ body: "{...}" }` — normalize to a flat object.
 */
function normalizeWebhookJson(raw: unknown): Record<string, unknown> | null {
  if (raw == null || typeof raw !== 'object') return null;
  let current: unknown = raw;
  if (Array.isArray(current) && current.length > 0) {
    current = current[0];
  }
  if (current == null || typeof current !== 'object') return null;
  let o = current as Record<string, unknown>;

  if (typeof o.body === 'string') {
    try {
      const parsed = JSON.parse(o.body) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        o = parsed as Record<string, unknown>;
      }
    } catch {
      /* keep o */
    }
  }

  if (o.data != null && typeof o.data === 'object' && !Array.isArray(o.data)) {
    return o.data as Record<string, unknown>;
  }

  return o;
}

function coerceApproved(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (typeof value === 'string' && value.toLowerCase() === 'true') return true;
  return false;
}

function buildApprovalResponseFromPayload(data: Record<string, unknown>): ApprovalCheckResponse {
  const approved = coerceApproved(data.approved);
  const redirectRaw = data.redirectTo;
  let redirectTo: string;
  if (typeof redirectRaw === 'string' && redirectRaw.trim() !== '') {
    const t = redirectRaw.trim();
    redirectTo = t.startsWith('/') ? t : `/${t}`;
  } else {
    redirectTo = approved ? '/dashboard' : '/approval-pending';
  }

  const courseRaw = data.courseType;
  const courseType = typeof courseRaw === 'string' ? courseRaw : approved ? 'ap_physics' : undefined;

  const user = data.user;
  const parsedUser =
    user && typeof user === 'object' && !Array.isArray(user)
      ? (user as ApprovalCheckUser)
      : undefined;

  const message = typeof data.message === 'string' ? data.message : undefined;

  return {
    approved,
    redirectTo,
    courseType,
    user: parsedUser,
    message,
  };
}

/** Persist webhook user + dashboard display fields from the latest check (call after every successful fetch). */
export function persistSigninWebhookToLocalStorage(result: ApprovalCheckResponse): void {
  if (typeof window === 'undefined') return;
  try {
    if (result.user && Object.keys(result.user).length > 0) {
      localStorage.setItem('webhookUser', JSON.stringify(result.user));
    }

    if (result.user) {
      const u = result.user;
      if (u.course) localStorage.setItem('userCourse', u.course);
      if (u.batch) localStorage.setItem('userBatch', u.batch);
      if (u.name) localStorage.setItem('userName', u.name);
      if (u.email) localStorage.setItem('userEmail', u.email);
    }

    if (result.approved && result.courseType) {
      localStorage.setItem('courseType', result.courseType);
    }
  } catch {
    /* ignore */
  }
}

export interface ApprovalCheckPayload {
  email: string;
  name: string;
  userId: string;
  mobile?: string;
}

function getApprovalUrlForWebhook(userId: string): string {
  const baseUrl =
    import.meta.env.VITE_APP_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  return `${baseUrl}/approve-subscription?userId=${userId}`;
}

export interface ApprovalCheckUser {
  name?: string;
  email?: string;
  mobile?: string;
  userId?: string;
  status?: string;
  course?: string;
  batch?: string;
}

export interface ApprovalCheckResponse {
  approved: boolean;
  redirectTo?: string;
  courseType?: string;
  user?: ApprovalCheckUser;
  message?: string;
}

/**
 * Check if user is approved by looking up their email in Google Sheet
 * This calls n8n webhook which checks the "Sign in details" sheet
 *
 * Same user in flight → reuse one request (avoids duplicate n8n emails when fetchUserProfile overlaps).
 */
const approvalCheckInflight = new Map<string, Promise<ApprovalCheckResponse>>();

export async function checkUserApproval(
  userData: ApprovalCheckPayload
): Promise<ApprovalCheckResponse> {
  if (typeof window !== 'undefined') {
    try {
      const dedupeKey = getSigninNotificationDedupeKey(userData.userId);
      const cacheKey = getSigninApprovalCacheKey(userData.userId);
      const now = Date.now();
      const lastSentRaw = localStorage.getItem(dedupeKey);
      const lastSent = lastSentRaw ? Number(lastSentRaw) : 0;
      const withinDedupeWindow = Number.isFinite(lastSent) && lastSent > 0 && now - lastSent < SIGNIN_NOTIFICATION_DEDUPE_MS;

      if (withinDedupeWindow) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached) as ApprovalCheckResponse;
          if (typeof parsed.approved === 'boolean') {
            return parsed;
          }
        }
      }
    } catch {
      /* ignore and continue with fresh webhook call */
    }
  }

  const inflightKey = `${userData.userId}:${userData.email.toLowerCase()}`;
  const existing = approvalCheckInflight.get(inflightKey);
  if (existing) {
    return existing;
  }

  const webhookUrl = import.meta.env.VITE_N8N_SIGNIN_WEBHOOK_URL || 
                     import.meta.env.VITE_N8N_WEBHOOK_URL;

  // If webhook is not configured, default to not approved
  if (!webhookUrl) {
    console.warn('VITE_N8N_SIGNIN_WEBHOOK_URL is not configured. User will need manual approval.');
    return {
      approved: false,
      redirectTo: '/approval-pending',
      message: 'Approval check service not configured'
    };
  }

  const run = (async (): Promise<ApprovalCheckResponse> => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'signin-check',
        email: userData.email,
        name: userData.name,
        userId: userData.userId,
        mobile: userData.mobile,
        timestamp: new Date().toISOString(),
        // Single webhook: include fields n8n used to get from user-signin POST
        approvalUrl: getApprovalUrlForWebhook(userData.userId),
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n approval check error:', errorText);
      // If webhook fails, default to not approved
      return {
        approved: false,
        redirectTo: '/approval-pending',
        message: 'Approval check failed'
      };
    }

    const raw = await response.json();
    const data = normalizeWebhookJson(raw);
    if (!data) {
      console.error('n8n approval check: unparseable JSON', raw);
      return {
        approved: false,
        redirectTo: '/approval-pending',
        message: 'Invalid approval response shape',
      };
    }

    // n8n returns: { approved, redirectTo, courseType, user: { name, email, course, ... } }
    const result = buildApprovalResponseFromPayload(data);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(getSigninNotificationDedupeKey(userData.userId), String(Date.now()));
        localStorage.setItem(getSigninApprovalCacheKey(userData.userId), JSON.stringify(result));
      } catch {
        /* ignore */
      }
    }
    return result;
  } catch (error) {
    console.error('Error calling approval check webhook:', error);
    // If network error, default to not approved
    return {
      approved: false,
      redirectTo: '/approval-pending',
      message: 'Network error checking approval status'
    };
  }
  })();

  approvalCheckInflight.set(inflightKey, run);
  try {
    return await run;
  } finally {
    approvalCheckInflight.delete(inflightKey);
  }
}
