/**
 * Service to check user approval status from Google Sheet via n8n
 */

export interface ApprovalCheckPayload {
  email: string;
  name: string;
  userId: string;
  mobile?: string;
}

export interface ApprovalCheckResponse {
  approved: boolean;
  redirectTo?: string;
  message?: string;
}

/**
 * Check if user is approved by looking up their email in Google Sheet
 * This calls n8n webhook which checks the "Sign in details" sheet
 */
export async function checkUserApproval(
  userData: ApprovalCheckPayload
): Promise<ApprovalCheckResponse> {
  const webhookUrl = import.meta.env.VITE_N8N_SIGNIN_WEBHOOK_URL || 
                     import.meta.env.VITE_N8N_WEBHOOK_URL;

  // If webhook is not configured, default to not approved
  if (!webhookUrl) {
    console.warn('VITE_N8N_SIGNIN_WEBHOOK_URL is not configured. User will need manual approval.');
    return {
      approved: false,
      redirectTo: '/approval-pending',
      message: 'Approval check service not configured'
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'signin-check',
        email: userData.email,
        name: userData.name,
        userId: userData.userId,
        mobile: userData.mobile,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n approval check error:', errorText);
      // If webhook fails, default to not approved
      return {
        approved: false,
        redirectTo: '/approval-pending',
        message: 'Approval check failed'
      };
    }

    const data = await response.json();
    
    // n8n should return: { approved: true/false, redirectTo: "/dashboard" or "/approval-pending" }
    return {
      approved: data.approved === true,
      redirectTo: data.redirectTo || (data.approved ? '/dashboard' : '/approval-pending'),
      message: data.message
    };
  } catch (error) {
    console.error('Error calling approval check webhook:', error);
    // If network error, default to not approved
    return {
      approved: false,
      redirectTo: '/approval-pending',
      message: 'Network error checking approval status'
    };
  }
}
