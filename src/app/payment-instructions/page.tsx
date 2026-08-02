"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { useUser } from "@/context/UserContext";
import LeatherBadge from "@/components/LeatherBadge";
import { Phone, CheckCircle, AlertCircle } from "lucide-react";

export default function PaymentInstructionsPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect if no appointment booked (check if not true)
    if (!loading && user?.applicationStatus?.appointmentBooked !== true) {
      router.push('/appointment-booking');
      return;
    }

    // Redirect if payment already completed
    if (!loading && user?.applicationStatus?.paymentStatus === 'completed') {
      router.push('/appointment-confirmation');
      return;
    }
  }, [user, loading, router]);

  const handlePaymentMade = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const nationalId = localStorage.getItem('nationalId');
      if (!nationalId) {
        setError('National ID not found. Please login again.');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/payment-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nationalId,
          status: 'pending_verification'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update payment status');
      }

      router.push('/payment-pending');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 relative z-10" style={{
      backgroundColor: '#E8DCC5',
      backgroundImage: `
        linear-gradient(135deg, #E8DCC5 0%, #D4C4A8 50%, #C9B896 100%),
        radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.08) 0%, transparent 50%)
      `
    }}>
      <LeatherBadge />
      
      {/* Header */}
      <div className="border-b-4 border-amber-900 bg-amber-100 relative" style={{
        backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.05) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.05) 50%, rgba(139, 69, 19, 0.05) 75%, transparent 75%, transparent)',
        backgroundSize: '4px 4px'
      }}>
        <div className="absolute inset-0 border-b-2 border-dashed border-amber-700" style={{ bottom: '6px' }}></div>
        <div className="flex items-center justify-center px-4 py-3 relative">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-800"></div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-800"></div>
          <h1 className="text-lg font-serif font-bold text-amber-950 tracking-widest uppercase">Payment Instructions</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4">
        {/* Processing Fee Card */}
        <div className="bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative mb-4" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-sm font-serif font-bold text-amber-900 mb-2">Processing Fee</h2>
            <div className="text-3xl font-serif font-bold text-amber-900">KES 1,500</div>
            <p className="text-xs font-serif text-amber-800 mt-1">One-time payment for appointment booking</p>
          </div>
        </div>

        {/* Brian's Contact Card */}
        <div className="bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative mb-4" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-sm font-serif font-bold text-amber-900 mb-3">Contact Brian Mariita</h2>
            
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-amber-800 flex items-center justify-center">
                <Phone size={24} className="text-white" />
              </div>
              <div>
                <div className="text-lg font-serif font-bold text-amber-900">Brian Mariita</div>
                <div className="text-sm font-serif text-amber-800">Chief Officer & Official Broker</div>
              </div>
            </div>

            <div className="bg-amber-100 p-3 rounded border border-amber-600">
              <div className="text-xs font-serif text-amber-700 mb-1">Call this number (DO NOT send money directly):</div>
              <div className="text-xl font-serif font-bold text-amber-900">0785664256</div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative mb-4" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-sm font-serif font-bold text-amber-900 mb-3">How to Pay</h2>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <p className="text-xs font-serif text-amber-900">Call Brian Mariita at the number above</p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <p className="text-xs font-serif text-amber-900">He will send you M-Pesa payment request for KES 1,500</p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <p className="text-xs font-serif text-amber-900">Enter your M-Pesa PIN to complete payment</p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <p className="text-xs font-serif text-amber-900">Return here and click "I have made the payment" below</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-amber-100/50 p-3 rounded-lg border-2 border-amber-800 relative mb-4" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <div className="flex items-start gap-2 relative z-10">
            <AlertCircle size={16} className="text-amber-800 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-serif text-amber-900 font-medium">
              Brian Mariita is our Chief Officer and Official Broker. He will verify your payment and notify our agency to approve your appointment.
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 p-3 rounded-lg border border-red-300 mb-4">
            <p className="text-xs font-serif text-red-900">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handlePaymentMade}
          disabled={isSubmitting}
          className="w-full border-2 border-amber-800 bg-amber-800 px-4 py-3 text-white font-serif font-bold hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-amber-600 disabled:cursor-not-allowed transition-colors"
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.1) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.1) 50%, rgba(139, 69, 19, 0.1) 75%, transparent 75%, transparent)',
            backgroundSize: '4px 4px'
          }}
        >
          {isSubmitting ? "Processing..." : "I have made the payment"}
        </button>
      </div>
      
      <BottomNav />
    </div>
  );
}
