import type { DemoFormData } from '../lib/demoSchemas';

/**
 * Payload structure matching n8n webhook expectations.
 * course/batch: so Srikanth Academy can identify e.g. Foundation Batch 1,2,3 or AP Physics in emails.
 */
export interface DemoLeadPayload {
  name: string;
  email: string;
  phone?: string;
  grade?: string;
  board?: string;
  city?: string;
  country?: string;
  /** Course or batch selected (e.g. "Foundation Batch 1", "AP Physics") — for email and sheet */
  course?: string;
  /** Alias for n8n workflows that read `courses` instead of `course` */
  courses?: string;
  referrer?: string;
  timestamp?: string;
}

/**
 * Send demo lead to n8n webhook
 * Note: Webhook is optional - form will still succeed if webhook is not configured
 */
export async function submitDemoLead(
  formData: DemoFormData
): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  // Plain object with explicit strings so JSON.stringify always produces a non-empty POST body
  const fd = formData as DemoFormData & {
    fullName?: string;
    emailAddress?: string;
    phoneNumber?: string;
    mobile?: string;
    courses?: string;
    course?: string;
    batch?: string;
  };

  // Courses dropdown in DemoForm uses `board`; also accept `courses` / `course` / `batch`
  const courseValue =
    (fd.board || fd.courses || fd.course || fd.batch || '').trim() || undefined;

  const payload: DemoLeadPayload = {
    name: (fd.fullName || fd.name || '').trim(),
    email: (fd.emailAddress || fd.email || '').trim(),
    phone: (fd.phoneNumber || fd.phone || fd.mobile || '').trim() || undefined,
    grade: fd.grade ? String(fd.grade) : undefined,
    board: fd.board ? String(fd.board) : undefined,
    city: fd.city ? String(fd.city).trim() : undefined,
    country: fd.country ? String(fd.country).trim() : undefined,
    course: courseValue,
    courses: courseValue,
    referrer: typeof window !== 'undefined' ? window.location.href : undefined,
    timestamp: new Date().toISOString(),
  };

  // If webhook is not configured, still return success (webhook is optional)
  if (!webhookUrl) {
    console.warn('VITE_N8N_WEBHOOK_URL is not configured. Form submitted successfully, but webhook was not called.');
    console.log('Demo lead data:', payload);
    return { success: true };
  }

  const bodyString = JSON.stringify(payload);
  if (typeof bodyString !== 'string') {
    console.error('Demo webhook: JSON.stringify failed', payload);
    return { success: true };
  }

  console.log('📤 Sending to webhook URL:', webhookUrl);
  console.log('📦 Payload:', payload);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyString,
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('❌ n8n webhook error:', responseText);
      console.error('🔗 Webhook URL used:', webhookUrl);
      console.warn('⚠️ Form submitted successfully, but webhook call failed. Data:', payload);
      return { success: true };
    }

    console.log('✅ Webhook call successful! Status:', response.status);
    console.log('📥 Response:', responseText);
    return { success: true };
  } catch (error) {
    console.error('Error calling webhook:', error);
    console.warn('Form submitted successfully, but webhook call failed. Data:', payload);
    return { success: true };
  }
}
