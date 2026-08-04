'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { useUser } from "@/context/UserContext";
import LeatherBadge from "@/components/LeatherBadge";
import { Check, AlertCircle } from "lucide-react";

export default function ApplicationsPage() {
  const { user, loading, refreshUser } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setIsSubmittingSuccess] = useState(false);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

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
        setShowRedirectMessage(true);
        setTimeout(() => {
          router.push('/jobs');
        }, 3000);
        return;
      }
    } else {
      setShowRedirectMessage(true);
      setTimeout(() => {
        router.push('/jobs');
      }, 3000);
      return;
    }

    // Redirect if already submitted
    if (user?.applicationStatus?.submitted) {
      router.push('/appointment-booking');
      return;
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const nationalId = localStorage.getItem('nationalId');
    if (!nationalId) {
      setError('National ID not found. Please login again.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/application-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nationalId,
          documents: {},
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save application documents');
      }

      await refreshUser();
      setIsSubmittingSuccess(true);
      
      setTimeout(() => {
        router.push('/appointment-booking');
      }, 1500);

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

  if (showRedirectMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Job Preferences Required</h2>
          <p className="text-gray-600 mb-4">
            Please save your job preferences first before accessing the applications page. This helps us match you with the right opportunities.
          </p>
          <p className="text-sm text-amber-700 font-medium">
            Redirecting to Jobs page in 3 seconds...
          </p>
        </div>
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
          <h1 className="text-lg font-serif font-bold text-amber-950 tracking-widest uppercase">Application Documents</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4">
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
            <p className="text-sm font-serif text-green-900 relative z-10 font-medium">Application submitted successfully! Redirecting to appointment booking...</p>
          </div>
        )}

        {/* Job preference info */}
        {user?.jobPreferences && (
          <div className="mb-4 bg-amber-50/50 p-3 rounded-lg border-2 border-amber-800 relative" style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
          }}>
            <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
            <p className="text-sm font-serif text-amber-900 relative z-10 font-medium">
              Target: {user.jobPreferences.preferredLocation || 'Not specified'} - {user.jobPreferences.preferredCategory || 'Not specified'}
            </p>
          </div>
        )}

        {/* Info message */}
        <div className="mb-4 bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <p className="text-sm font-serif text-amber-900 font-bold mb-2 relative z-10">We Handle Everything For You</p>
          <p className="text-xs font-serif text-amber-800 relative z-10">
            Don't have these documents? No problem. We'll handle the costs and process for you. The costs will be deducted from your earnings once you start working. Just bring what you have to your appointment.
          </p>
        </div>

        {/* Document List */}
        <div className="bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <h2 className="mb-4 text-sm font-serif font-bold text-amber-900 uppercase tracking-widest relative">
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-800"></span>
            Documents to Bring to Your Appointment
          </h2>
          
          <div className="space-y-3 relative z-10">
            <div className="border-b border-dashed border-amber-700/50 pb-3">
              <p className="text-sm font-serif font-bold text-amber-900">Valid Kenyan Passport</p>
              <p className="text-xs font-serif text-amber-800">Cost: KES 6,000-8,000 (we handle if needed)</p>
            </div>
            <div className="border-b border-dashed border-amber-700/50 pb-3">
              <p className="text-sm font-serif font-bold text-amber-900">Birth Certificate</p>
              <p className="text-xs font-serif text-amber-800">Cost: KES 200-500 (we handle if needed)</p>
            </div>
            <div className="border-b border-dashed border-amber-700/50 pb-3">
              <p className="text-sm font-serif font-bold text-amber-900">Certificate of Good Conduct</p>
              <p className="text-xs font-serif text-amber-800">Cost: KES 1,050 (we handle if needed)</p>
            </div>
            <div>
              <p className="text-sm font-serif font-bold text-amber-900">KRA Tax Compliance Certificate</p>
              <p className="text-xs font-serif text-amber-800">Cost: Free via iTax (we handle if needed)</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            {isSubmitting ? "Submitting..." : "Submit Application & Book Appointment"}
          </button>

          {/* Info note */}
          <div className="bg-amber-50/50 p-3 rounded-lg border-2 border-amber-800 relative" style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
          }}>
            <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
            <div className="flex items-start gap-2 relative z-10">
              <AlertCircle size={16} className="text-amber-800 mt-0.5 flex-shrink-0" />
              <p className="text-xs font-serif text-amber-900 font-medium">
                After submission, you will be redirected to book an appointment at our agency. A processing fee of KES 1,500 will be required. Our team will help you obtain any documents you don't currently have.
              </p>
            </div>
          </div>
        </form>
      </div>
      
      <BottomNav />
    </div>
  );
}
