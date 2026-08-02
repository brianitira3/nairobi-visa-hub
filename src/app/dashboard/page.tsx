"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import LeatherBadge from "@/components/LeatherBadge";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 430;
      setIsMobile(mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isMobile === null) {
    return null;
  }

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

        {/* National ID Documents */}
        <div className="mb-8 bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <h3 className="mb-3 text-sm font-serif font-bold text-amber-900 uppercase tracking-widest relative">
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-800"></span>
            National ID Documents
          </h3>
          <div className="space-y-2 relative z-10">
            <div
              className="flex justify-between items-center py-2 border-b border-dashed border-amber-700/50 cursor-pointer hover:bg-amber-100/50 rounded px-2 transition-colors"
              onClick={() => user?.nationalIdFront && setSelectedImage(user.nationalIdFront)}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-serif text-amber-900 font-medium">ID Front:</span>
                {user?.nationalIdFront && (
                  <span className="text-xs font-serif text-amber-800 font-bold">✓ UPLOADED</span>
                )}
              </div>
              {user?.nationalIdFront && (
                <span className="text-xs font-serif text-amber-900 font-medium">TAP TO VIEW</span>
              )}
            </div>
            <div
              className="flex justify-between items-center py-2 border-b border-dashed border-amber-700/50 cursor-pointer hover:bg-amber-100/50 rounded px-2 transition-colors"
              onClick={() => user?.nationalIdBack && setSelectedImage(user.nationalIdBack)}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-serif text-amber-900 font-medium">ID Back:</span>
                {user?.nationalIdBack && (
                  <span className="text-xs font-serif text-amber-800 font-bold">✓ UPLOADED</span>
                )}
              </div>
              {user?.nationalIdBack && (
                <span className="text-xs font-serif text-amber-900 font-medium">TAP TO VIEW</span>
              )}
            </div>
          </div>
        </div>

        {/* Additional Documents */}
        <div className="bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <h3 className="mb-3 text-sm font-serif font-bold text-amber-900 uppercase tracking-widest relative">
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-800"></span>
            Additional Documents
          </h3>
          <div className="space-y-2 relative z-10">
            <div
              className="flex justify-between items-center py-2 border-b border-dashed border-amber-700/50 cursor-pointer hover:bg-amber-100/50 rounded px-2 transition-colors"
              onClick={() => user?.passport && setSelectedImage(user.passport)}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-serif text-amber-900 font-medium">Passport:</span>
                {user?.passport && (
                  <span className="text-xs font-serif text-amber-800 font-bold">✓ UPLOADED</span>
                )}
              </div>
              {user?.passport && (
                <span className="text-xs font-serif text-amber-900 font-medium">TAP TO VIEW</span>
              )}
            </div>
            <div
              className="flex justify-between items-center py-2 border-b border-dashed border-amber-700/50 cursor-pointer hover:bg-amber-100/50 rounded px-2 transition-colors"
              onClick={() => user?.yellowFever && setSelectedImage(user.yellowFever)}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-serif text-amber-900 font-medium">Yellow Fever Card:</span>
                {user?.yellowFever && (
                  <span className="text-xs font-serif text-amber-800 font-bold">✓ UPLOADED</span>
                )}
              </div>
              {user?.yellowFever && (
                <span className="text-xs font-serif text-amber-900 font-medium">TAP TO VIEW</span>
              )}
            </div>
            <div
              className="flex justify-between items-center py-2 border-b border-dashed border-amber-700/50 cursor-pointer hover:bg-amber-100/50 rounded px-2 transition-colors"
              onClick={() => user?.drivingLicense && setSelectedImage(user.drivingLicense)}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-serif text-amber-900 font-medium">Driving License:</span>
                {user?.drivingLicense && (
                  <span className="text-xs font-serif text-amber-800 font-bold">✓ UPLOADED</span>
                )}
              </div>
              {user?.drivingLicense && (
                <span className="text-xs font-serif text-amber-900 font-medium">TAP TO VIEW</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-full max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <img 
              src={selectedImage} 
              alt="Document" 
              className="max-w-full max-h-[80vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
      
      <BottomNav />
    </div>
  );
}
