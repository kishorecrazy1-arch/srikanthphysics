// Razorpay Payment Service
// This service handles Razorpay payment integration

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
}

export interface PaymentOptions {
  amount: number; // Amount in paise (e.g., 10000 = ₹100)
  currency?: string;
  name: string;
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayResponse) => void;
  onError?: (error: any) => void;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Load Razorpay script dynamically
export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });
}

// Note: Razorpay Checkout doesn't require pre-creating orders
// Orders are created automatically when payment is initiated
// If you need order creation, implement it on your backend

// Initialize Razorpay payment
export async function initiatePayment(options: PaymentOptions): Promise<void> {
  await loadRazorpayScript();

  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  
  if (!keyId) {
    throw new Error('Razorpay Key ID not configured. Please add VITE_RAZORPAY_KEY_ID to your .env file');
  }

  // Generate order ID (in production, this should come from your backend)
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const razorpayOptions = {
    key: keyId,
    amount: options.amount,
    currency: options.currency || 'INR',
    name: options.name,
    description: options.description,
    order_id: orderId, // Optional: if you have backend order creation
    prefill: options.prefill || {},
    theme: options.theme || { color: '#2563eb' },
    handler: options.handler,
    modal: {
      ondismiss: () => {
        if (options.onError) {
          options.onError(new Error('Payment cancelled by user'));
        }
      },
    },
  };

  const razorpay = new window.Razorpay(razorpayOptions);
  razorpay.on('payment.failed', (response: any) => {
    if (options.onError) {
      options.onError(response.error || new Error('Payment failed'));
    }
  });

  razorpay.open();
}

// Verify payment signature (should be done on backend)
export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  // This should be done on your backend for security
  // Frontend verification is not secure
  const response = await fetch('/api/verify-razorpay-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orderId,
      paymentId,
      signature,
    }),
  });

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  return data.verified === true;
}

