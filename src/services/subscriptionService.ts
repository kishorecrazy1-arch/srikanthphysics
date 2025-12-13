import type { User } from '../types';

export interface SubscriptionApprovalPayload {
  source: string;
  timestamp: string;
  name: string;
  email: string;
  phone?: string;
  grade?: number;
  courseType?: string;
  countryCode?: string;
  userId: string;
  approvalUrl: string;
}

/**
 * Generate approval URL for subscription approval
 * The approval link can be used to grant immediate dashboard access
 */
export function getApprovalUrl(userId: string): string {
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  return `${baseUrl}/approve-subscription?userId=${userId}`;
}

/**
 * Log subscription approval request (for admin reference)
 * Approval is done directly via the approval link - no email needed
 */
export async function requestSubscriptionApproval(
  user: User
): Promise<{ success: boolean; approvalUrl?: string; error?: string }> {
  // Generate approval URL
  const approvalUrl = getApprovalUrl(user.id);

  const payload: SubscriptionApprovalPayload = {
    source: 'subscription-approval-request',
    timestamp: new Date().toISOString(),
    name: user.name,
    email: user.email,
    phone: user.phoneNumber,
    grade: user.grade,
    courseType: user.courseType,
    countryCode: user.countryCode,
    userId: user.id,
    approvalUrl: approvalUrl,
  };

  // Log the approval request (for admin to see in console)
  console.log('📧 Subscription Approval Request:');
  console.log('User:', user.name, `(${user.email})`);
  console.log('Approval URL:', approvalUrl);
  console.log('Full data:', payload);

  // Return success with approval URL
  // Admin can use this URL directly to approve the user
  return { success: true, approvalUrl };
}

