import type { DemoFormData } from '../lib/demoSchemas';

/**
 * Payload structure matching n8n webhook expectations
 */
export interface DemoLeadPayload {
  name: string;
  email: string;
  phone?: string;
  grade?: string;
  board?: string;
  city?: string;
  country?: string;
}

/**
 * Send demo lead to n8n webhook
 * Note: Webhook is optional - form will still succeed if webhook is not configured
 */
export async function submitDemoLead(
  formData: DemoFormData
): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  // Simple payload structure matching n8n webhook requirements
  const payload: DemoLeadPayload = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone || undefined,
    grade: formData.grade || undefined,
    board: formData.board || undefined,
    city: formData.city || undefined,
    country: formData.country || undefined,
  };

  // If webhook is not configured, still return success (webhook is optional)
  if (!webhookUrl) {
    console.warn('VITE_N8N_WEBHOOK_URL is not configured. Form submitted successfully, but webhook was not called.');
    console.log('Demo lead data:', payload);
    return { success: true };
  }

  // Log webhook URL for debugging
  console.log('📤 Sending to webhook URL:', webhookUrl);
  console.log('📦 Payload:', payload);

  // Try to send to webhook, but don't fail the form if webhook fails
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('❌ n8n webhook error:', responseText);
      console.error('🔗 Webhook URL used:', webhookUrl);
      // Still return success - webhook failure shouldn't block form submission
      console.warn('⚠️ Form submitted successfully, but webhook call failed. Data:', payload);
      return { success: true };
    }

    console.log('✅ Webhook call successful! Status:', response.status);
    console.log('📥 Response:', responseText);
    return { success: true };

    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n webhook error:', errorText);
      console.error('Webhook URL used:', webhookUrl);
      // Still return success - webhook failure shouldn't block form submission
      console.warn('Form submitted successfully, but webhook call failed. Data:', payload);
      return { success: true };
    }

    const responseData = await response.text();
    console.log('✅ Webhook call successful! Response:', responseData);
    return { success: true };
  } catch (error) {
    console.error('Error calling webhook:', error);
    // Still return success - network error shouldn't block form submission
    console.warn('Form submitted successfully, but webhook call failed. Data:', payload);
    return { success: true };
  }
}

