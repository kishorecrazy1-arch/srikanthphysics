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
  institution: string;
  city: string;
  country: string;
  timestamp: string;
  referrer: string;
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

  return {
    name: readStringField(o.name ?? o.fullName),
    email,
    phone: readStringField(o.phone ?? o.phoneNumber ?? o.mobile),
    course,
    grade: readStringField(o.grade),
    institution: readStringField(o.institution ?? o.academy),
    city: readStringField(o.city),
    country: readStringField(o.country),
    timestamp: readStringField(o.timestamp) || new Date().toISOString(),
    referrer: readStringField(o.referrer),
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
    `Course: ${data.course}`,
    `Academic Level: ${data.grade}`,
    `Institution / Academy: ${data.institution}`,
    `City: ${data.city}`,
    `Country: ${data.country}`,
    `Timestamp: ${data.timestamp}`,
    `Referrer: ${data.referrer}`,
  ];

  const text = lines.join('\n');
  const html = `<pre style="font-family:system-ui,sans-serif">${lines
    .map((l) => escapeHtml(l))
    .join('\n')}</pre>`;

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
    parsed.grade,
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
