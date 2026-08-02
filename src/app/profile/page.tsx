"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useUser } from "@/context/UserContext";
import LeatherBadge from "@/components/LeatherBadge";

export default function ProfilePage() {
  const { user, loading, refreshUser } = useUser();
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [wasInitiallyEmpty, setWasInitiallyEmpty] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 430;
      setIsMobile(mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (user) {
      if (user.fullName) {
        setFullName(user.fullName);
        setWasInitiallyEmpty(false);
      }
      if (user.location) setLocation(user.location);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (!location.trim()) {
      setError("Location is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get national ID from localStorage (set during login)
      const nationalId = localStorage.getItem('nationalId');
      if (!nationalId) {
        throw new Error('Please login first');
      }

      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nationalId,
          fullName,
          location,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess(data.message);
      await refreshUser();
      // Store profile completion status
      localStorage.setItem('profileComplete', 'true');
      // Only redirect if this was first-time completion
      if (wasInitiallyEmpty) {
        setTimeout(() => {
          window.location.href = '/documents';
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-4 pb-24 relative z-10"
      style={{ 
        backgroundImage: "url('/pexels-gustavo-fring-3885496.jpg')",
        backgroundColor: '#E8DCC5'
      }}
    >
      <LeatherBadge />
      <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-lg backdrop-blur-sm border-2 border-amber-800 relative" style={{
        backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
        backgroundSize: '8px 8px'
      }}>
        <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-2xl pointer-events-none"></div>
        <h1 className="mb-6 text-2xl font-serif font-bold text-amber-900 tracking-widest uppercase relative">
          <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-800"></span>
          {wasInitiallyEmpty ? "Complete Your Profile" : "Edit Profile"}
        </h1>

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
            <p className="text-sm font-serif text-green-900 relative z-10 font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label htmlFor="fullName" className="block text-sm font-serif font-bold text-amber-900 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border-2 border-amber-800 rounded-lg px-4 py-2 font-serif text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter your full name"
              style={{
                backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
                backgroundSize: '8px 8px'
              }}
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-serif font-bold text-amber-900 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border-2 border-amber-800 rounded-lg px-4 py-2 font-serif text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter your location"
              style={{
                backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
                backgroundSize: '8px 8px'
              }}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-serif font-bold text-amber-900 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-amber-800 rounded-lg px-4 py-2 font-serif text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter your email"
              style={{
                backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
                backgroundSize: '8px 8px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full border-2 border-amber-800 bg-amber-800 text-white py-3 rounded-lg font-serif font-bold hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-amber-600 disabled:cursor-not-allowed transition-colors"
            style={{
              backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.1) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.1) 50%, rgba(139, 69, 19, 0.1) 75%, transparent 75%, transparent)',
              backgroundSize: '4px 4px'
            }}
          >
            {isSubmitting ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
      
      <BottomNav />
    </div>
  );
}
