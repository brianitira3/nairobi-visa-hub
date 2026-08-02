'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import LeatherBadge from '@/components/LeatherBadge';
import { Calendar, Clock, MapPin, AlertCircle, CreditCard } from 'lucide-react';

export default function AppointmentBookingPage() {
  const { user, loading, refreshUser } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Appointment form state
  const [appointment, setAppointment] = useState({
    date: '',
    time: '',
  });

  // Available time slots
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '1:00 PM', '2:00 PM', 
    '3:00 PM', '4:00 PM'
  ];

  // Get available dates (starting 2 weeks from now)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    // Start from 14 days (2 weeks) from now
    for (let i = 14; i <= 28; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  useEffect(() => {
    // Check if user has saved job preferences
    if (user?.jobPreferences) {
      const hasMeaningfulData = 
        user.jobPreferences.preferredCategory ||
        user.jobPreferences.preferredLocation ||
        user.jobPreferences.expectedSalary ||
        user.jobPreferences.experience ||
        user.jobPreferences.skills?.length ||
        user.jobPreferences.availability ||
        user.jobPreferences.notes;
      
      if (!hasMeaningfulData) {
        router.push('/jobs');
        return;
      }
    } else {
      router.push('/jobs');
      return;
    }

    // Check if user has submitted application
    if (user && !user.applicationStatus?.submitted) {
      router.push('/applications');
      return;
    }

    // Check if user has already booked appointment
    if (user?.applicationStatus?.appointmentBooked) {
      router.push('/payment-instructions');
      return;
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!appointment.date || !appointment.time) {
      setError('Please select both date and time for your appointment');
      setIsSubmitting(false);
      return;
    }

    const nationalId = localStorage.getItem('nationalId');
    if (!nationalId) {
      setError('National ID not found. Please login again.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/appointment-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nationalId,
          appointment: {
            date: appointment.date,
            time: appointment.time,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book appointment');
      }

      // Refresh user data to get updated appointment status
      await refreshUser();
      
      setIsSubmitting(false);
      router.push('/payment-instructions');

    } catch (err) {
      setIsSubmitting(false);
      setError(err instanceof Error ? err.message : 'An error occurred');
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
          <h1 className="text-lg font-serif font-bold text-amber-950 tracking-widest uppercase">Book Appointment</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4">
        {/* Booking Info */}
        <div className="mb-4 bg-blue-50/50 p-4 rounded-lg border-2 border-blue-800 relative" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-blue-700 rounded-lg pointer-events-none"></div>
          <div className="relative z-10">
            <p className="text-sm font-serif text-blue-900 font-medium mb-2">⚠️ Appointment Booking Notice</p>
            <p className="text-xs font-serif text-blue-800 leading-relaxed">
              Due to high demand, our agency is currently booked with clients for the next 2 weeks. 
              Appointments are available starting 2 weeks from today. We recommend booking quickly 
              as slots fill up fast - delaying your booking may result in longer wait times.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50/50 p-3 rounded-lg border-2 border-red-800 relative" style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
          }}>
            <div className="absolute inset-0 border-2 border-dashed border-red-700 rounded-lg pointer-events-none"></div>
            <p className="text-sm font-serif text-red-900 relative z-10 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50/50 p-3 rounded-lg border-2 border-green-800 relative" style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
          }}>
            <div className="absolute inset-0 border-2 border-dashed border-green-700 rounded-lg pointer-events-none"></div>
            <p className="text-sm font-serif text-green-900 relative z-10 font-medium">Appointment booked successfully! Redirecting to confirmation...</p>
          </div>
        )}

        {/* Payment Info */}
        <div className="mb-4 bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <CreditCard size={20} className="text-amber-800" />
            <h2 className="text-sm font-serif font-bold text-amber-900 uppercase tracking-widest">Processing Fee</h2>
          </div>
          <div className="relative z-10">
            <p className="text-2xl font-serif font-bold text-amber-900">KES 1,500</p>
            <p className="text-xs font-serif text-amber-800 mt-1">One-time processing fee for document verification and agency assistance</p>
          </div>
        </div>

        {/* Agency Info */}
        <div className="mb-4 bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <MapPin size={20} className="text-amber-800" />
            <h2 className="text-sm font-serif font-bold text-amber-900 uppercase tracking-widest">Agency Location</h2>
          </div>
          <div className="relative z-10 space-y-2">
            <p className="text-sm font-serif text-amber-900 font-medium">Nairobi City Center</p>
            <p className="text-xs font-serif text-amber-800">Upper Hill, Nairobi</p>
            <p className="text-xs font-serif text-amber-800">Monday - Friday: 9:00 AM - 5:00 PM</p>
          </div>
        </div>

        {/* What to expect */}
        <div className="mb-4 bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <AlertCircle size={20} className="text-amber-800" />
            <h2 className="text-sm font-serif font-bold text-amber-900 uppercase tracking-widest">What to Expect</h2>
          </div>
          <div className="relative z-10 space-y-2">
            <p className="text-xs font-serif text-amber-900">• Document verification and review</p>
            <p className="text-xs font-serif text-amber-900">• Assistance with missing documents</p>
            <p className="text-xs font-serif text-amber-900">• Guidance on visa application process</p>
            <p className="text-xs font-serif text-amber-900">• Employment contract review</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Selection */}
          <div className="bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
          }}>
            <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <Calendar size={20} className="text-amber-800" />
              <h2 className="text-sm font-serif font-bold text-amber-900 uppercase tracking-widest">Select Date</h2>
            </div>
            <div className="relative z-10">
              <select
                value={appointment.date}
                onChange={(e) => setAppointment(prev => ({ ...prev, date: e.target.value }))}
                className="w-full border-2 border-amber-800 bg-amber-50 px-3 py-2 text-sm font-serif text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              >
                <option value="">Choose a date</option>
                {getAvailableDates().map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-KE', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Selection */}
          <div className="bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
          }}>
            <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <Clock size={20} className="text-amber-800" />
              <h2 className="text-sm font-serif font-bold text-amber-900 uppercase tracking-widest">Select Time</h2>
            </div>
            <div className="relative z-10">
              <select
                value={appointment.time}
                onChange={(e) => setAppointment(prev => ({ ...prev, time: e.target.value }))}
                className="w-full border-2 border-amber-800 bg-amber-50 px-3 py-2 text-sm font-serif text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              >
                <option value="">Choose a time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full border-2 border-amber-800 bg-amber-800 px-4 py-3 text-white font-serif font-bold hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-amber-600 disabled:cursor-not-allowed transition-colors"
            style={{
              backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.1) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.1) 50%, rgba(139, 69, 19, 0.1) 75%, transparent 75%, transparent)',
              backgroundSize: '4px 4px'
            }}
          >
            {isSubmitting ? "Processing..." : "Book Appointment & Pay KES 1,500"}
          </button>

          {/* Payment note */}
          <div className="bg-amber-50/50 p-3 rounded-lg border-2 border-amber-800 relative" style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
          }}>
            <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
            <div className="flex items-start gap-2 relative z-10">
              <AlertCircle size={16} className="text-amber-800 mt-0.5 flex-shrink-0" />
              <p className="text-xs font-serif text-amber-900 font-medium">
                Payment will be processed securely. You will receive a confirmation SMS with your appointment details after successful payment.
              </p>
            </div>
          </div>
        </form>
      </div>
      
      <BottomNav />
    </div>
  );
}
