/**
 * Service to send sign-in notifications to Srikanth's Academy email
 */

export interface SigninNotificationPayload {
  source: 'user-signin';
  timestamp: string;
  name: string;
  email: string;
  userId: string;
  lastSignIn?: string;
  referrer?: string;
  approvalUrl?: string;
}

/**
 * Generate approval URL for a user
 */
function getApprovalUrl(userId: string): string {
  const baseUrl = import.meta.env.VITE_APP_URL || 
                  (typeof window !== 'undefined' ? window.location.origin : '');
  return `${baseUrl}/approve-subscription?userId=${userId}`;
}

/**
 * Send sign-in notification to n8n webhook
 * Note: Webhook is optional - sign-in will still succeed if webhook is not configured
 */
export async function sendSigninNotification(
  userData: {
    name: string;
    email: string;
    userId: string;
    lastSignIn?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = import.meta.env.VITE_N8N_SIGNIN_WEBHOOK_URL || 
                     import.meta.env.VITE_N8N_WEBHOOK_URL;

  // Generate approval URL for admin to approve user
  const approvalUrl = getApprovalUrl(userData.userId);

  const payload: SigninNotificationPayload = {
    source: 'user-signin',
    timestamp: new Date().toISOString(),
    name: userData.name,
    email: userData.email,
    userId: userData.userId,
    lastSignIn: userData.lastSignIn,
    referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    approvalUrl: approvalUrl,
  };

  // If webhook is not configured, still return success (webhook is optional)
  if (!webhookUrl) {
    console.warn('VITE_N8N_SIGNIN_WEBHOOK_URL is not configured. Sign-in successful, but notification was not sent.');
    console.log('Sign-in data:', payload);
    return { success: true };
  }

  // Try to send to webhook, but don't fail sign-in if webhook fails
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
      console.error('n8n sign-in webhook error:', errorText);
      // Still return success - webhook failure shouldn't block sign-in
      console.warn('Sign-in successful, but notification webhook call failed. Data:', payload);
      return { success: true };
    }

    return { success: true };
  } catch (error) {
    console.error('Error calling sign-in notification webhook:', error);
    // Still return success - network error shouldn't block sign-in
    console.warn('Sign-in successful, but notification webhook call failed. Data:', payload);
    return { success: true };
  }
}


