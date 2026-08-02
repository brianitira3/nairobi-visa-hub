'use client';

import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import LeatherBadge from '@/components/LeatherBadge';
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

export default function AppointmentConfirmationPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Check if user has booked appointment
    if (user && !user.applicationStatus?.appointmentBooked) {
      router.push('/appointment-booking');
      return;
    }

    // Check payment status
    if (user?.applicationStatus?.paymentStatus === 'pending') {
      router.push('/payment-instructions');
      return;
    }

    if (user?.applicationStatus?.paymentStatus === 'pending_verification') {
      router.push('/payment-pending');
      return;
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user?.applicationStatus?.appointmentBooked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">No appointment found</div>
      </div>
    );
  }

  const appointmentDate = user.applicationStatus.appointmentDate 
    ? new Date(user.applicationStatus.appointmentDate) 
    : null;

  return (
    <div className="min-h-screen pb-24 relative z-10" style={{
      backgroundColor: '#f5f0e6',
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.03) 0%, transparent 50%)
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
          <h1 className="text-lg font-serif font-bold text-amber-900 tracking-widest uppercase">Appointment Confirmed</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4">
        {/* Success message */}
        <div className="mb-4 bg-green-50/50 p-4 rounded-lg border-2 border-green-800 relative" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-green-700 rounded-lg pointer-events-none"></div>
          <div className="flex items-center gap-3 relative z-10">
            <CheckCircle size={24} className="text-green-800" />
            <div>
              <p className="text-sm font-serif font-bold text-green-900">Appointment Booked Successfully!</p>
              <p className="text-xs font-serif text-green-800">Your appointment has been confirmed</p>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="mb-4 bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <h2 className="mb-4 text-sm font-serif font-bold text-amber-900 uppercase tracking-widest relative">
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-800"></span>
            Appointment Details
          </h2>
          
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-amber-800" />
              <div>
                <p className="text-xs font-serif text-amber-800">Date</p>
                <p className="text-sm font-serif font-bold text-amber-900">
                  {appointmentDate?.toLocaleDateString('en-KE', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-amber-800" />
              <div>
                <p className="text-xs font-serif text-amber-800">Time</p>
                <p className="text-sm font-serif font-bold text-amber-900">{user.applicationStatus.appointmentTime}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-amber-800" />
              <div>
                <p className="text-xs font-serif text-amber-800">Location</p>
                <p className="text-sm font-serif font-bold text-amber-900">Nairobi City Center, Upper Hill</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="mb-4 bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <h2 className="mb-4 text-sm font-serif font-bold text-amber-900 uppercase tracking-widest relative">
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-800"></span>
            Payment Status
          </h2>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-serif text-amber-800">Processing Fee</p>
              <p className="text-sm font-serif font-bold text-amber-900">KES 1,500</p>
            </div>
            <div className="flex items-center gap-2">
              {user.applicationStatus.paymentStatus === 'completed' ? (
                <>
                  <CheckCircle size={16} className="text-green-800" />
                  <p className="text-sm font-serif font-bold text-green-900">Payment Completed</p>
                </>
              ) : (
                <>
                  <AlertCircle size={16} className="text-amber-800" />
                  <p className="text-sm font-serif font-bold text-amber-900">Payment Pending</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* What to bring */}
        <div className="mb-4 bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <h2 className="mb-4 text-sm font-serif font-bold text-amber-900 uppercase tracking-widest relative">
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-800"></span>
            What to Bring
          </h2>
          
          <div className="space-y-2 relative z-10">
            <p className="text-xs font-serif text-amber-900">• Original National ID</p>
            <p className="text-xs font-serif text-amber-900">• Any uploaded documents (originals)</p>
            <p className="text-xs font-serif text-amber-900">• Payment confirmation (if paid)</p>
            <p className="text-xs font-serif text-amber-900">• Any questions about your application</p>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <h2 className="mb-4 text-sm font-serif font-bold text-amber-900 uppercase tracking-widest relative">
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-800"></span>
            Need Help?
          </h2>
          
          <div className="relative z-10">
            <p className="text-xs font-serif text-amber-900 mb-1">Contact our support team:</p>
            <p className="text-sm font-serif font-bold text-amber-900">+254 700 000 000</p>
            <p className="text-xs font-serif text-amber-800">support@workabroad.ke</p>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
