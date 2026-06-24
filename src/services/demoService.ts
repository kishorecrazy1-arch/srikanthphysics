import type { DemoFormData } from '../lib/demoSchemas';
import {
  buildAdminNotificationHtml,
  buildAdminNotificationText,
  buildRegistrationDisplayFields,
} from '../lib/registrationPayload';

/** Extra keys some forms or n8n workflows may supply */
type DemoFormExtras = Partial<{
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  mobile: string;
  courses: string;
  batch: string;
  course: string;
  event: string;
  source: string;
}>;

/** Body sent to n8n and /api/save-registration (strict JSON shape) */
export interface RegistrationSubmitPayload {
  name: string;
  email: string;
  phone: string;
  course: string;
  grade: string;
  /** Human-readable academic level for emails (e.g. B.Tech 1) */
  academicLevel: string;
  institution: string;
  /** Alias for n8n / Google Sheets */
  institutionAcademy: string;
  /** Alias used by some n8n flows and save-registration */
  academy: string;
  /** Common n8n / sheet column names for the same value */
  college: string;
  collegeName: string;
  location: string;
  city: string;
  country: string;
  timestamp: string;
  /** Pre-built notification body for n8n email nodes */
  adminNotificationHtml: string;
  adminNotificationText: string;
  /** Same page URL when running in the browser; omitted on SSR */
  referrer?: string;
  /** Aliases so existing n8n flows keep working */
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  courses: string;
  batch: string;
  board: string;
  event?: string;
  source?: string;
}

function buildRegistrationPayload(formData: DemoFormData & DemoFormExtras): RegistrationSubmitPayload {
  const fd = formData;

  const name = (fd.fullName ?? fd.name ?? '').trim();
  const email = (fd.emailAddress ?? fd.email ?? '').trim();
  const phone = (fd.phoneNumber ?? fd.phone ?? fd.mobile ?? '').trim();
  const course = (
    fd.course ??
    fd.courses ??
    fd.batch ??
    fd.board ??
    ''
  ).trim();
  const grade = fd.grade != null && fd.grade !== '' ? String(fd.grade) : '';
  const institution = (fd.institution ?? '').trim();
  const city = (fd.city ?? '').trim();
  const country = (fd.country ?? '').trim();
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const board = (fd.board ?? '').trim();
  const event = fd.event?.trim();
  const source = fd.source?.trim();

  const display = buildRegistrationDisplayFields({
    name,
    email,
    phone,
    course,
    grade,
    institution,
    city,
    country,
    timestamp,
    referrer: typeof window !== 'undefined' ? window.location.href : undefined,
    board,
    event,
  });

  return {
    name,
    email,
    phone,
    course,
    grade,
    academicLevel: display.academicLevel,
    institution,
    institutionAcademy: display.institutionAcademy,
    academy: display.institutionAcademy,
    college: display.institutionAcademy,
    collegeName: display.institutionAcademy,
    location: display.location,
    city,
    country,
    timestamp,
    adminNotificationHtml: buildAdminNotificationHtml(display),
    adminNotificationText: buildAdminNotificationText(display),
    referrer: display.referrer,
    fullName: name,
    emailAddress: email,
    phoneNumber: phone,
    courses: course,
    batch: course,
    board,
    event,
    source,
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

  const [n8nOutcome, directOutcome] = await Promise.allSettled([
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
      // Endpoint can return 200 with partial failure details.
      const result = (await response.json()) as Partial<{ ok: boolean; sheet: boolean; email: boolean }>;
      if (result.ok === true && (result.sheet === false || result.email === false)) {
        throw new Error(
          `save-registration partial failure (sheet=${String(result.sheet)}, email=${String(result.email)})`,
        );
      }
    })(),
  ]);

  if (n8nOutcome.status === 'rejected') {
    console.error('demo submit: n8n failed', n8nOutcome.reason);
  }
  if (directOutcome.status === 'rejected') {
    console.error('demo submit: direct api failed', directOutcome.reason);
  }

  if (n8nOutcome.status === 'rejected' && directOutcome.status === 'rejected') {
    return { success: false, error: 'Both registration channels failed. Please retry in 1 minute.' };
  }

  return { success: true };
}

const WEBINAR_EVENT = 'Free Webinar - 28 June 2026';

const CLASS_TO_GRADE: Record<string, string> = {
  '8th': '8',
  '9th': '9',
  '10th': '10',
  '11th': '11',
  '12th': '12',
};

export interface WebinarFormData {
  name: string;
  phone: string;
  email: string;
  studentClass: string;
  city: string;
  course: string;
}

export async function submitWebinarLead(
  form: WebinarFormData,
): Promise<{ success: boolean; error?: string }> {
  const grade = CLASS_TO_GRADE[form.studentClass] ?? form.studentClass;
  const interestedCourse = form.course.trim() || 'General Interest';

  const payload = buildRegistrationPayload({
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    grade,
    board: WEBINAR_EVENT,
    course: interestedCourse,
    city: form.city.trim(),
    country: '',
    institution: '',
    agreeToContact: true,
    event: WEBINAR_EVENT,
    source: 'webinar-page',
  } as DemoFormData & DemoFormExtras);

  const bodyString = JSON.stringify(payload);
  const n8nUrl = String(import.meta.env.VITE_N8N_WEBHOOK_URL ?? '').trim();

  const [n8nOutcome, directOutcome] = await Promise.allSettled([
    (async (): Promise<void> => {
      if (!n8nUrl) throw new Error('n8n_webhook_url_missing');
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

  if (n8nOutcome.status === 'rejected') {
    console.error('webinar submit: n8n failed', n8nOutcome.reason);
  }
  if (directOutcome.status === 'rejected') {
    console.error('webinar submit: direct api failed', directOutcome.reason);
  }

  if (n8nOutcome.status === 'rejected' && directOutcome.status === 'rejected') {
    return {
      success: false,
      error: 'Something went wrong. Please WhatsApp us at +91 94929 37716.',
    };
  }

  return { success: true };
}
