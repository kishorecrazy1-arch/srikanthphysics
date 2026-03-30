import type { DemoFormData } from '../lib/demoSchemas';

/**
 * Payload structure matching n8n webhook expectations.
 * course/batch: so Srikanth Academy can identify e.g. Foundation Batch 1,2,3 or AP Physics in emails.
 */
export interface DemoLeadPayload {
  name: string;
  fullName?: string;
  email: string;
  emailAddress?: string;
  phone?: string;
  phoneNumber?: string;
  grade?: string;
  board?: string;
  city?: string;
  country?: string;
  course?: string;
  courses?: string;
  batch?: string;
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

  const fd = formData as DemoFormData & {
    fullName?: string;
    emailAddress?: string;
    phoneNumber?: string;
    mobile?: string;
    courses?: string;
    course?: string;
    batch?: string;
  };

  const payload: DemoLeadPayload = {
    name: (fd.fullName || fd.name || '').trim(),
    fullName: (fd.fullName || fd.name || '').trim(),
    email: (fd.emailAddress || fd.email || '').trim(),
    emailAddress: (fd.emailAddress || fd.email || '').trim(),
    phone: (fd.phoneNumber || fd.phone || fd.mobile || '').trim() || undefined,
    phoneNumber: (fd.phoneNumber || fd.phone || fd.mobile || '').trim() || undefined,
    grade: fd.grade ? String(fd.grade) : undefined,
    board: fd.board ? String(fd.board) : undefined,
    city: fd.city ? String(fd.city).trim() : undefined,
    country: fd.country ? String(fd.country).trim() : undefined,
    course: (fd.courses || fd.course || fd.batch || fd.board || '').trim() || undefined,
    courses: (fd.courses || fd.course || fd.batch || fd.board || '').trim() || undefined,
    batch: (fd.courses || fd.course || fd.batch || fd.board || '').trim() || undefined,
    referrer: typeof window !== 'undefined' ? window.location.href : undefined,
    timestamp: new Date().toISOString(),
  };

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
