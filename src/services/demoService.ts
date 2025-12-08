import type { UTMParams } from '../utils/utm';
import type { DemoFormData } from '../lib/demoSchemas';

export interface DemoLeadPayload {
  source: string;
  timestamp: string;
  name: string;
  email: string;
  phone?: string;
  grade?: string;
  board?: string;
  city?: string;
  country?: string;
  utm: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
  referrer?: string;
}

/**
 * Send demo lead to n8n webhook
 */
export async function submitDemoLead(
  formData: DemoFormData,
  utm: UTMParams = {}
): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('VITE_N8N_WEBHOOK_URL is not configured');
    return {
      success: false,
      error: 'Webhook URL is not configured. Please contact support.',
    };
  }

  const payload: DemoLeadPayload = {
    source: 'ap-physics-demo',
    timestamp: new Date().toISOString(),
    name: formData.name,
    email: formData.email,
    phone: formData.phone || undefined,
    grade: formData.grade || undefined,
    board: formData.board || undefined,
    city: formData.city || undefined,
    country: formData.country || undefined,
    utm: {
      source: utm.source || '',
      medium: utm.medium || '',
      campaign: utm.campaign || '',
    },
    referrer: typeof document !== 'undefined' ? document.referrer : undefined,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n webhook error:', errorText);
      return {
        success: false,
        error: 'Failed to submit form. Please try again or contact support.',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting demo lead:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
    };
  }
}

