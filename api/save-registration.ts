import { google } from 'googleapis';
import nodemailer from 'nodemailer';

type HttpResponse = {
  status: (code: number) => HttpResponse;
  json: (body: unknown) => void;
  end: (chunk?: string) => void;
  setHeader: (name: string, value: string) => void;
};

type HttpRequest = {
  method?: string;
  body?: unknown;
};

/** Number of columns appended; header row in the sheet should match this order. */
const NUM_SHEET_COLS = 10;

interface ParsedRegistration {
  name: string;
  email: string;
  phone: string;
  course: string;
  grade: string;
  academicLevel: string;
  institution: string;
  location: string;
  city: string;
  country: string;
  timestamp: string;
  referrer: string;
  /** Pre-built HTML from the website; used as the email body when present */
  adminNotificationHtml: string;
  adminNotificationText: string;
}

const GRADE_LABELS: Record<string, string> = {
  '7': '7th',
  '8': '8th',
  '9': '9th',
  '10': '10th',
  '11': '11th',
  '12': '12th',
  'btech-1': 'B.Tech 1',
  'btech-2': 'B.Tech 2',
  'btech-3': 'B.Tech 3',
  'btech-4': 'B.Tech 4',
  other: 'Other',
};

function formatAcademicLevel(grade: string): string {
  if (!grade) return '';
  return GRADE_LABELS[grade] ?? grade;
}

function formatLocation(city: string, country: string): string {
  return [city, country].filter(Boolean).join(', ');
}

function readStringField(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  return '';
}

function coerceBody(raw: unknown): unknown {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      return null;
    }
  }
  return raw;
}

function parseRegistrationBody(raw: unknown): ParsedRegistration | null {
  const body = coerceBody(raw);
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const o = body as Record<string, unknown>;

  const email = readStringField(o.email ?? o.emailAddress);
  if (!email) return null;

  const course =
    readStringField(o.course) ||
    readStringField(o.courses) ||
    readStringField(o.batch) ||
    readStringField(o.board);

  const grade = readStringField(o.grade);
  const academicLevel =
    readStringField(o.academicLevel) || formatAcademicLevel(grade);
  const institution = readStringField(
    o.institution ??
      o.institutionAcademy ??
      o.academy ??
      o.college ??
      o.collegeName,
  );
  const city = readStringField(o.city);
  const country = readStringField(o.country);
  const location = readStringField(o.location) || formatLocation(city, country);

  return {
    name: readStringField(o.name ?? o.fullName),
    email,
    phone: readStringField(o.phone ?? o.phoneNumber ?? o.mobile),
    course,
    grade,
    academicLevel,
    institution,
    location,
    city,
    country,
    timestamp: readStringField(o.timestamp) || new Date().toISOString(),
    referrer: readStringField(o.referrer),
    adminNotificationHtml: readStringField(o.adminNotificationHtml),
    adminNotificationText: readStringField(o.adminNotificationText),
  };
}

interface ServiceAccountCredentials {
  client_email: string;
  private_key: string;
}

function parseServiceAccount(json: string): ServiceAccountCredentials | null {
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    const o = parsed as Record<string, unknown>;
    const client_email = readStringField(o.client_email);
    const private_key = readStringField(o.private_key).replace(/\\n/g, '\n');
    if (!client_email || !private_key) return null;
    return { client_email, private_key };
  } catch {
    return null;
  }
}

async function appendRegistrationRow(row: string[]): Promise<void> {
  const keyRaw = String(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '').trim();
  const spreadsheetId = String(process.env.GOOGLE_SHEET_ID || '').trim();
  const tab = String(process.env.GOOGLE_SHEET_TAB || 'Sheet1').trim() || 'Sheet1';

  if (!keyRaw || !spreadsheetId) {
    throw new Error('sheet_config_missing');
  }

  const creds = parseServiceAccount(keyRaw);
  if (!creds) {
    throw new Error('service_account_invalid');
  }

  const auth = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const endCol = String.fromCharCode(64 + NUM_SHEET_COLS);
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tab}!A:${endCol}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [row],
    },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendRegistrationEmail(data: ParsedRegistration): Promise<void> {
  const user = String(process.env.BACKUP_EMAIL_USER || '').trim();
  const pass = String(process.env.BACKUP_EMAIL_PASS || '').trim();
  const to = String(process.env.ACADEMY_EMAIL || 'srikanthsacademyforphysics@gmail.com').trim();

  if (!user || !pass) {
    throw new Error('email_config_missing');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const lines = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Course/Batch: ${data.course}`,
    `Grade: ${data.academicLevel || 'Not provided'}`,
    `Institution / Academy: ${data.institution || 'Not provided'}`,
    `Location: ${data.location || 'Not provided'}`,
    `Registered At: ${data.timestamp}`,
    `Referrer: ${data.referrer}`,
  ];

  const detailRow = (label: string, value: string) =>
    `<p style="margin:8px 0;font-size:15px;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value || 'Not provided')}</p>`;

  const builtHtml = `
    <div style="font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;padding:16px;">
      <h2 style="color:#2563eb;margin:0 0 16px;">📋 Student Details</h2>
      ${detailRow('Name', data.name)}
      ${detailRow('Email', data.email)}
      ${detailRow('Phone', data.phone)}
      ${detailRow('Course/Batch', data.course)}
      ${detailRow('Grade', data.academicLevel)}
      ${detailRow('Institution / Academy', data.institution)}
      ${detailRow('Location', data.location)}
      ${detailRow('Registered At', data.timestamp)}
    </div>
  `.trim();

  const text = data.adminNotificationText.trim() || lines.join('\n');
  const html = data.adminNotificationHtml.trim() || builtHtml;

  await transporter.sendMail({
    from: user,
    to,
    subject: 'New demo registration (direct API)',
    text,
    html,
  });
}

export default async function handler(req: HttpRequest, res: HttpResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const parsed = parseRegistrationBody(req.body);
  if (!parsed) {
    res.status(400).json({ error: 'Invalid or missing registration payload' });
    return;
  }

  const row = [
    parsed.name,
    parsed.email,
    parsed.phone,
    parsed.course,
    parsed.academicLevel || parsed.grade,
    parsed.institution,
    parsed.city,
    parsed.country,
    parsed.timestamp,
    parsed.referrer,
  ];

  const [sheetOutcome, emailOutcome] = await Promise.allSettled([
    appendRegistrationRow(row),
    sendRegistrationEmail(parsed),
  ]);

  if (sheetOutcome.status === 'rejected') {
    console.error('save-registration: sheet append failed', sheetOutcome.reason);
  }
  if (emailOutcome.status === 'rejected') {
    console.error('save-registration: email send failed', emailOutcome.reason);
  }

  res.status(200).json({
    ok: true,
    sheet: sheetOutcome.status === 'fulfilled',
    email: emailOutcome.status === 'fulfilled',
  });
}
