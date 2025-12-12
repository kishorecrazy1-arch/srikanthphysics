import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';
import { useAuthStore } from '../store/authStore';
import { initiatePayment, loadRazorpayScript, RazorpayResponse } from '../services/razorpayService';
import { supabase } from '../lib/supabase';

export function Payment() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Subscription plans
  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: 999, // ₹999
      duration: '1 month',
      features: [
        'Unlimited access to all courses',
        'AI-powered daily practice',
        'Progress tracking',
        'Expert guidance',
      ],
    },
    {
      id: 'quarterly',
      name: 'Quarterly Plan',
      price: 2499, // ₹2499 (save ₹498)
      duration: '3 months',
      originalPrice: 2997,
      discount: '17% OFF',
      features: [
        'Everything in Monthly',
        'Priority support',
        'Mock test access',
        'Save ₹498',
      ],
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: 7999, // ₹7999 (save ₹3989)
      duration: '12 months',
      originalPrice: 11988,
      discount: '33% OFF',
      features: [
        'Everything in Quarterly',
        '1-on-1 consultation',
        'Exam prep materials',
        'Save ₹3989',
      ],
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState(plans[1]); // Default to quarterly

  useEffect(() => {
    // Load Razorpay script on mount
    loadRazorpayScript()
      .then(() => setScriptLoaded(true))
      .catch((err) => {
        console.error('Failed to load Razorpay:', err);
        setError('Failed to load payment gateway. Please refresh the page.');
      });
  }, []);

  const handlePayment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!scriptLoaded) {
      setError('Payment gateway is still loading. Please wait...');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const amount = selectedPlan.price * 100; // Convert to paise

      await initiatePayment({
        amount,
        currency: 'INR',
        name: "Srikanth's Academy",
        description: `${selectedPlan.name} - ${selectedPlan.duration}`,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phoneNumber,
        },
        theme: {
          color: '#2563eb',
        },
        handler: async (response: RazorpayResponse) => {
          try {
            // Payment successful - update subscription status
            await handlePaymentSuccess(response, selectedPlan);
          } catch (err: any) {
            console.error('Payment handler error:', err);
            setError(err.message || 'Failed to process payment. Please contact support.');
            setLoading(false);
          }
        },
        onError: (err) => {
          console.error('Payment error:', err);
          setError(err.message || 'Payment failed. Please try again.');
          setLoading(false);
        },
      });
    } catch (err: any) {
      console.error('Payment initiation error:', err);
      setError(err.message || 'Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (
    response: RazorpayResponse,
    plan: typeof selectedPlan
  ) => {
    try {
      // Calculate expiry date based on plan
      const expiryDate = new Date();
      if (plan.id === 'monthly') {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      } else if (plan.id === 'quarterly') {
        expiryDate.setMonth(expiryDate.getMonth() + 3);
      } else if (plan.id === 'yearly') {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      }

      // Update user subscription status in Supabase
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          subscription_status: 'paid',
          subscription_expires_at: expiryDate.toISOString(),
          payment_date: new Date().toISOString(),
          payment_amount: plan.price,
          payment_method: 'razorpay',
        })
        .eq('id', user!.id);

      if (updateError) {
        throw updateError;
      }

      // Refresh user profile
      const { fetchUserProfile } = useAuthStore.getState();
      await fetchUserProfile();

      // Redirect to success page
      navigate('/payment/success', {
        state: {
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          plan: plan.name,
          amount: plan.price,
        },
      });
    } catch (err: any) {
      console.error('Error updating subscription:', err);
      setError('Payment successful but failed to update subscription. Please contact support.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <CourseNavigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Subscription Plan
          </h1>
          <p className="text-xl text-gray-600">
            Unlock full access to Srikanth's Academy platform
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg p-6 border-2 cursor-pointer transition-all ${
                selectedPlan.id === plan.id
                  ? 'border-blue-600 shadow-xl scale-105'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              {plan.discount && (
                <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-3">
                  {plan.discount}
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                {plan.originalPrice && (
                  <span className="text-lg text-gray-500 line-through ml-2">
                    ₹{plan.originalPrice}
                  </span>
                )}
                <p className="text-sm text-gray-600 mt-1">{plan.duration}</p>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {selectedPlan.id === plan.id && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center text-blue-700 font-semibold text-sm">
                  Selected
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Payment Button */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Total: ₹{selectedPlan.price}
            </h2>
            <p className="text-gray-600">
              {selectedPlan.duration} access to all features
            </p>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading || !scriptLoaded}
            className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mx-auto shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Pay Securely with Razorpay
              </>
            )}
          </button>

          {!scriptLoaded && (
            <p className="mt-4 text-sm text-gray-500">
              Loading payment gateway...
            </p>
          )}

          <p className="mt-6 text-sm text-gray-500">
            🔒 Secure payment powered by Razorpay. Your payment information is encrypted and secure.
          </p>
        </div>
      </div>
    </div>
  );
}

