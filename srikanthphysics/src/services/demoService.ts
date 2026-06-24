import type { DemoFormData } from '../lib/demoSchemas';
import {
  buildAdminNotificationHtml,
  buildAdminNotificationText,
  buildRegistrationDisplayFields,
} from '../lib/registrationPayload';

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

export interface RegistrationSubmitPayload {
  name: string;
  email: string;
  phone: string;
  course: string;
  grade: string;
  academicLevel: string;
  institution: string;
  institutionAcademy: string;
  academy: string;
  college: string;
  collegeName: string;
  location: string;
  city: string;
  country: string;
  timestamp: string;
  adminNotificationHtml: string;
  adminNotificationText: string;
  referrer?: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  courses: string;
  batch: string;
  board: string;
  event?: string;
  source?: string;
}

const WEBINAR_EVENT = 'Free Webinar - 28 June 2026';

const CLASS_TO_GRADE: Record<string, string> = {
  '8th': '8',
  '9th': '9',
  '10th': '10',
  '11th': '11',
  '12th': '12',
};

function buildRegistrationPayload(
  formData: DemoFormData & DemoFormExtras,
): RegistrationSubmitPayload {
  const fd = formData;

  const name = (fd.fullName ?? fd.name ?? '').trim();
  const email = (fd.emailAddress ?? fd.email ?? '').trim();
  const phone = (fd.phoneNumber ?? fd.phone ?? fd.mobile ?? '').trim();
  const course = (fd.course ?? fd.courses ?? fd.batch ?? fd.board ?? '').trim();
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

async function postToN8n(payload: RegistrationSubmitPayload): Promise<void> {
  const webhookUrl = String(import.meta.env.VITE_N8N_WEBHOOK_URL ?? '').trim();
  if (!webhookUrl) {
    throw new Error('n8n_webhook_url_missing');
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`n8n webhook HTTP ${response.status}: ${responseText}`);
  }
}

export async function submitDemoLead(
  formData: DemoFormData,
): Promise<{ success: boolean; error?: string }> {
  const payload = buildRegistrationPayload(formData as DemoFormData & DemoFormExtras);

  try {
    await postToN8n(payload);
    return { success: true };
  } catch (error) {
    console.error('demo submit: n8n failed', error);
    return {
      success: false,
      error: 'Registration could not be sent. Please try again or WhatsApp us at +91 94929 37716.',
    };
  }
}

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

  try {
    await postToN8n(payload);
    return { success: true };
  } catch (error) {
    console.error('webinar submit: n8n failed', error);
    return {
      success: false,
      error: 'Something went wrong. Please WhatsApp us at +91 94929 37716.',
    };
  }
}
