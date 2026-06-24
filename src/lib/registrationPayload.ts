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

export function formatAcademicLevel(grade: string): string {
  if (!grade) return '';
  return GRADE_LABELS[grade] ?? grade;
}

export function formatLocation(city: string, country: string): string {
  return [city, country].filter(Boolean).join(', ');
}

export interface RegistrationDisplayFields {
  name: string;
  email: string;
  phone: string;
  course: string;
  grade: string;
  academicLevel: string;
  institution: string;
  institutionAcademy: string;
  city: string;
  country: string;
  location: string;
  timestamp: string;
  referrer: string;
  board: string;
  event?: string;
}

export function buildRegistrationDisplayFields(input: {
  name: string;
  email: string;
  phone: string;
  course: string;
  grade: string;
  institution: string;
  city: string;
  country: string;
  timestamp: string;
  referrer?: string;
  board: string;
  event?: string;
}): RegistrationDisplayFields {
  const academicLevel = formatAcademicLevel(input.grade);
  const institution = input.institution.trim();
  const location = formatLocation(input.city, input.country);

  return {
    name: input.name,
    email: input.email,
    phone: input.phone,
    course: input.course,
    grade: input.grade,
    academicLevel,
    institution,
    institutionAcademy: institution,
    city: input.city,
    country: input.country,
    location,
    timestamp: input.timestamp,
    referrer: input.referrer ?? '',
    board: input.board,
    event: input.event,
  };
}

export function buildAdminNotificationHtml(fields: RegistrationDisplayFields): string {
  const row = (label: string, value: string) =>
    `<p style="margin:8px 0;"><strong>${label}:</strong> ${value || 'Not provided'}</p>`;

  return `
    <h2 style="color:#2563eb;margin:0 0 12px;">📋 Student Details</h2>
    ${fields.event ? row('Event', fields.event) : ''}
    ${row('Name', fields.name)}
    ${row('Email', fields.email)}
    ${row('Phone', fields.phone)}
    ${row('Course/Batch', fields.course)}
    ${row('Grade', fields.academicLevel)}
    ${row('Institution / Academy', fields.institutionAcademy)}
    ${row('Location', fields.location)}
    ${row('Registered At', fields.timestamp)}
    ${row('Source', fields.referrer)}
  `.trim();
}

export function buildAdminNotificationText(fields: RegistrationDisplayFields): string {
  return [
    'Student Details',
    fields.event ? `Event: ${fields.event}` : '',
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Phone: ${fields.phone}`,
    `Course/Batch: ${fields.course}`,
    `Grade: ${fields.academicLevel || 'Not provided'}`,
    `Institution / Academy: ${fields.institutionAcademy || 'Not provided'}`,
    `Location: ${fields.location || 'Not provided'}`,
    `Registered At: ${fields.timestamp}`,
    `Source: ${fields.referrer || 'Not provided'}`,
  ]
    .filter(Boolean)
    .join('\n');
}
