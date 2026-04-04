import type { DemoFormData } from '../lib/demoSchemas';

/** Extra keys some forms or n8n workflows may supply */
type DemoFormExtras = Partial<{
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  mobile: string;
  courses: string;
  batch: string;
  course: string;
}>;

/** Body sent to n8n and /api/save-registration (strict JSON shape) */
export interface RegistrationSubmitPayload {
  name: string;
  email: string;
  phone: string;
  course: string;
  grade: string;
  city: string;
  country: string;
  timestamp: string;
  /** Same page URL when running in the browser; omitted on SSR */
  referrer?: string;
  /** Aliases so existing n8n flows keep working */
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  courses: string;
  batch: string;
  board: string;
}

function buildRegistrationPayload(formData: DemoFormData & DemoFormExtras): RegistrationSubmitPayload {
  const fd = formData;

  const name = (fd.fullName ?? fd.name ?? '').trim();
  const email = (fd.emailAddress ?? fd.email ?? '').trim();
  const phone = (fd.phoneNumber ?? fd.phone ?? fd.mobile ?? '').trim();
  const course = (
    fd.board ??
    fd.courses ??
    fd.batch ??
    fd.course ??
    ''
  ).trim();
  const grade = fd.grade != null && fd.grade !== '' ? String(fd.grade) : '';
  const city = (fd.city ?? '').trim();
  const country = (fd.country ?? '').trim();
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const board = (fd.board ?? '').trim();

  return {
    name,
    email,
    phone,
    course,
    grade,
    city,
    country,
    timestamp,
    referrer: typeof window !== 'undefined' ? window.location.href : undefined,
    fullName: name,
    emailAddress: email,
    phoneNumber: phone,
    courses: course,
    batch: course,
    board,
  };
}

/**
 * Sends demo lead to n8n and to /api/save-registration in parallel.
 * Both promises always run; failures do not block the other. Student always gets success.
 */
export async function submitDemoLead(
  formData: DemoFormData,
): Promise<{ success: boolean; error?: string }> {
  const payload = buildRegistrationPayload(formData as DemoFormData & DemoFormExtras);
  const bodyString = JSON.stringify(payload);

  const n8nUrl = String(import.meta.env.VITE_N8N_WEBHOOK_URL ?? '').trim();

  await Promise.allSettled([
    (async (): Promise<void> => {
      if (!n8nUrl) {
        throw new Error('n8n_webhook_url_missing');
      }
      const response = await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyString,
      });
      if (!response.ok) {
        throw new Error(`n8n webhook HTTP ${String(response.status)}`);
      }
    })(),
    (async (): Promise<void> => {
      const response = await fetch('/api/save-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyString,
      });
      if (!response.ok) {
        throw new Error(`save-registration HTTP ${String(response.status)}`);
      }
    })(),
  ]);

  return { success: true };
}
