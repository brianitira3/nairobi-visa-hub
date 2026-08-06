"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { useUser } from "@/context/UserContext";
import LeatherBadge from "@/components/LeatherBadge";
import { Phone, Clock, CheckCircle, RefreshCw } from "lucide-react";

export default function PaymentPendingPage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useUser();
  const [ticketNumber, setTicketNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if payment already completed
    if (!loading && user?.applicationStatus?.paymentStatus === 'completed') {
      router.push('/appointment-confirmation');
      return;
    }
  }, [user, loading, router]);

  const handleVerifyTicket = async () => {
    if (!ticketNumber || ticketNumber.length !== 4) {
      setError('Please enter a valid 4-digit ticket number');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const nationalId = localStorage.getItem('nationalId');
      if (!nationalId) {
        setError('National ID not found. Please login again.');
        setIsVerifying(false);
        return;
      }

      const response = await fetch('/api/verify-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId, ticketNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify ticket');
      }

      await refreshUser();
      router.push('/appointment-confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsVerifying(false);
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
          <h1 className="text-lg font-serif font-bold text-amber-950 tracking-widest uppercase">Payment Pending</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4">
        {/* Status Card */}
        <div className="bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative mb-4" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0">
              <Clock size={32} className="text-amber-800" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-amber-900">Payment Verification</h2>
              <p className="text-xs font-serif text-amber-800">Your payment is being verified via WhatsApp</p>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative mb-4" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-sm font-serif font-bold text-amber-900 mb-3">Your Appointment</h2>
            
            {user?.applicationStatus?.appointmentDate && (
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-dashed border-amber-700/50">
                  <span className="text-xs font-serif text-amber-900 font-medium">Date:</span>
                  <span className="text-xs font-serif text-amber-900">
                    {new Date(user.applicationStatus.appointmentDate).toLocaleDateString('en-GB', { 
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-dashed border-amber-700/50">
                  <span className="text-xs font-serif text-amber-900 font-medium">Time:</span>
                  <span className="text-xs font-serif text-amber-900">{user.applicationStatus.appointmentTime}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-xs font-serif text-amber-900 font-medium">Location:</span>
                  <span className="text-xs font-serif text-amber-900">Nairobi City Center, Upper Hill</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp Contact */}
        <div className="bg-green-50/50 p-4 rounded-lg border-2 border-green-800 relative mb-4" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-green-700 rounded-lg pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-sm font-serif font-bold text-green-900 mb-3">WhatsApp Support</h2>
            
            <div className="bg-green-100 p-3 rounded border border-green-600 mb-3">
              <div className="text-xs font-serif text-green-700 mb-1">WhatsApp Number:</div>
              <div className="text-xl font-serif font-bold text-green-900">0140962448</div>
            </div>

            <p className="text-xs font-serif text-green-900">Send your payment screenshot to this number. Call to confirm receipt and receive your ticket number.</p>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-green-100/50 p-3 rounded-lg border-2 border-green-800 relative mb-4" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-green-700 rounded-lg pointer-events-none"></div>
          <div className="flex items-start gap-2 relative z-10">
            <CheckCircle size={16} className="text-green-800 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-serif text-green-900 font-medium">
              Enter the 4-digit ticket number you received via WhatsApp to verify your payment and confirm your appointment.
            </p>
          </div>
        </div>

        {/* Ticket Number Input */}
        <div className="bg-green-50/50 p-4 rounded-lg border-2 border-green-800 relative mb-4" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-green-700 rounded-lg pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-sm font-serif font-bold text-green-900 mb-3">Enter Ticket Number</h2>
            <input
              type="text"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Enter 4-digit ticket number"
              maxLength={4}
              className="w-full px-4 py-3 border-2 border-green-600 rounded-lg text-center text-2xl font-serif font-bold text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 p-3 rounded-lg border border-red-300 mb-4">
            <p className="text-xs font-serif text-red-900">{error}</p>
          </div>
        )}

        {/* Verify Button */}
        <button
          onClick={handleVerifyTicket}
          disabled={isVerifying || ticketNumber.length !== 4}
          className="w-full border-2 border-green-800 bg-green-800 px-4 py-3 text-white font-serif font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.1) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.1) 50%, rgba(139, 69, 19, 0.1) 75%, transparent 75%, transparent)',
            backgroundSize: '4px 4px'
          }}
        >
          <RefreshCw size={20} className={isVerifying ? "animate-spin" : ""} />
          {isVerifying ? "Verifying..." : "Verify Ticket Number"}
        </button>
      </div>
      
      <BottomNav />
    </div>
  );
}
