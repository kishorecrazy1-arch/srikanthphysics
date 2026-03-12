/**
 * Service to send signup notifications to Srikanth's Academy email
 */

export interface SignupNotificationPayload {
  source: 'user-signup';
  timestamp: string;
  name: string;
  email: string;
  countryCode?: string;
  phoneNumber?: string;
  grade?: number;
  courseType?: string;
  referrer?: string;
}

/**
 * Send signup notification to n8n webhook
 * Note: Webhook is optional - signup will still succeed if webhook is not configured
 */
export async function sendSignupNotification(
  userData: {
    name: string;
    email: string;
    countryCode?: string;
    phoneNumber?: string;
    grade?: number;
    courseType?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = import.meta.env.VITE_N8N_SIGNUP_WEBHOOK_URL || import.meta.env.VITE_N8N_WEBHOOK_URL;

  const payload: SignupNotificationPayload = {
    source: 'user-signup',
    timestamp: new Date().toISOString(),
    name: userData.name,
    email: userData.email,
    countryCode: userData.countryCode,
    phoneNumber: userData.phoneNumber,
    grade: userData.grade,
    courseType: userData.courseType,
    referrer: typeof document !== 'undefined' ? document.referrer : undefined,
  };

  // If webhook is not configured, still return success (webhook is optional)
  if (!webhookUrl) {
    console.warn('VITE_N8N_WEBHOOK_URL is not configured. Signup successful, but notification was not sent.');
    console.log('Signup data:', payload);
    return { success: true };
  }

  // Try to send to webhook, but don't fail signup if webhook fails
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
      // Still return success - webhook failure shouldn't block signup
      console.warn('Signup successful, but notification webhook call failed. Data:', payload);
      return { success: true };
    }

    return { success: true };
  } catch (error) {
    console.error('Error calling signup notification webhook:', error);
    // Still return success - network error shouldn't block signup
    console.warn('Signup successful, but notification webhook call failed. Data:', payload);
    return { success: true };
  }
}

