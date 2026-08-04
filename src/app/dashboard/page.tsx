"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useUser } from "@/context/UserContext";
import LeatherBadge from "@/components/LeatherBadge";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [isMobile, setIsMobile] = useState<boolean>(true);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isMobileWidth = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isMobileWidth);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-600 text-center p-4">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Mobile Only</h1>
          <p>This page is designed for mobile devices only.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 relative z-10" style={{
      backgroundColor: '#F0E6D6',
      backgroundImage: `
        linear-gradient(135deg, #F0E6D6 0%, #E8DCC5 50%, #E0D4BC 100%),
        radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.06) 0%, transparent 50%)
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
          <h1 className="text-lg font-serif font-bold text-amber-950 tracking-widest uppercase">Nairobi Visa Hub</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4">
        <h2 className="mb-6 text-xl font-serif font-bold text-amber-950 border-b-4 border-amber-950 pb-2 relative">
          <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-800"></span>
          Record Book
        </h2>

        {/* Personal Information */}
        <div className="mb-8 bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <h3 className="mb-3 text-sm font-serif font-bold text-amber-900 uppercase tracking-widest relative">
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-800"></span>
            Personal Information
          </h3>
          {user ? (
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between py-2 border-b border-dashed border-amber-700/50">
                <span className="text-sm font-serif text-amber-900 font-medium">Full Name:</span>
                <span className="text-sm font-serif font-bold text-amber-900">{user.fullName || '---'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed border-amber-700/50">
                <span className="text-sm font-serif text-amber-900 font-medium">Phone:</span>
                <span className="text-sm font-serif font-bold text-amber-900">{user.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed border-amber-700/50">
                <span className="text-sm font-serif text-amber-900 font-medium">National ID:</span>
                <span className="text-sm font-serif font-bold text-amber-900">{user.nationalId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed border-amber-700/50">
                <span className="text-sm font-serif text-amber-900 font-medium">Location:</span>
                <span className="text-sm font-serif font-bold text-amber-900">{user.location || '---'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed border-amber-700/50">
                <span className="text-sm font-serif text-amber-900 font-medium">Email:</span>
                <span className="text-sm font-serif font-bold text-amber-900">{user.email || '---'}</span>
              </div>
            </div>
          ) : (
            <div className="text-sm font-serif text-amber-900 py-2 relative z-10">Loading...</div>
          )}
        </div>

        {/* Application Status */}
        <div className="bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <h3 className="mb-3 text-sm font-serif font-bold text-amber-900 uppercase tracking-widest relative">
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-800"></span>
            Application Status
          </h3>
          <div className="space-y-2 relative z-10">
            <div className="flex justify-between py-2 border-b border-dashed border-amber-700/50">
              <span className="text-sm font-serif text-amber-900 font-medium">Application Submitted:</span>
              <span className="text-sm font-serif font-bold text-amber-900">{user?.applicationStatus?.submitted ? '✓ Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-dashed border-amber-700/50">
              <span className="text-sm font-serif text-amber-900 font-medium">Appointment Booked:</span>
              <span className="text-sm font-serif font-bold text-amber-900">{user?.applicationStatus?.appointmentBooked ? '✓ Yes' : 'No'}</span>
            </div>
            {user?.applicationStatus?.appointmentDate && (
              <div className="flex justify-between py-2 border-b border-dashed border-amber-700/50">
                <span className="text-sm font-serif text-amber-900 font-medium">Appointment Date:</span>
                <span className="text-sm font-serif font-bold text-amber-900">{new Date(user.applicationStatus.appointmentDate).toLocaleDateString()}</span>
              </div>
            )}
            {user?.applicationStatus?.appointmentTime && (
              <div className="flex justify-between py-2 border-b border-dashed border-amber-700/50">
                <span className="text-sm font-serif text-amber-900 font-medium">Appointment Time:</span>
                <span className="text-sm font-serif font-bold text-amber-900">{user.applicationStatus.appointmentTime}</span>
              </div>
            )}
            <div className="flex justify-between py-2">
              <span className="text-sm font-serif text-amber-900 font-medium">Payment Status:</span>
              <span className="text-sm font-serif font-bold text-amber-900">{user?.applicationStatus?.paymentStatus || 'Pending'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
