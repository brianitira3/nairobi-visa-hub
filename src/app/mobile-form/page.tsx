"use client";

import { useEffect, useState } from "react";

export default function MobileForm() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation - collect all errors
    const errors = [];

    if (!isLogin) {
      if (!phone.trim()) {
        errors.push("phone number");
      } else {
        const phoneRegex = /^\+2547\d{8}$/;
        if (!phoneRegex.test(phone)) {
          errors.push("phone number should be in format +2547XXXXXXXX");
        }
      }
    }

    if (!nationalId.trim()) {
      errors.push("National ID number");
    } else {
      const idRegex = /^\d{8}$/;
      if (!idRegex.test(nationalId)) {
        errors.push("National ID should be 8 digits");
      }
    }

    if (errors.length > 0) {
      // Combine "required" errors with "and"
      const requiredErrors = errors.filter(e => e.includes("number") && !e.includes("format") && !e.includes("digits"));
      const otherErrors = errors.filter(e => !requiredErrors.includes(e));
      
      let errorMessage = "";
      if (requiredErrors.length > 0) {
        errorMessage = `Please enter your ${requiredErrors.join(" and ")}`;
      }
      if (otherErrors.length > 0) {
        if (errorMessage) errorMessage += ". ";
        errorMessage += otherErrors.join(". ");
      }
      
      setError(errorMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin ? { nationalId } : { phone, nationalId };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess(data.message);
      if (isLogin) {
        // Store national ID and redirect based on completion status
        localStorage.setItem('nationalId', data.user.nationalId);
        if (!data.user.profileComplete) {
          // Redirect to profile completion
          window.location.href = '/profile';
        } else if (!data.user.documentsComplete) {
          // Profile complete but ID documents incomplete
          window.location.href = '/documents';
        } else if (!data.user.additionalDocumentsComplete) {
          // ID complete but additional documents incomplete
          window.location.href = '/additional-documents';
        } else {
          // All complete, redirect to dashboard
          window.location.href = '/dashboard';
        }
      } else {
        // Handle successful signup - redirect to profile
        localStorage.setItem('nationalId', data.user.nationalId);
        setTimeout(() => {
          window.location.href = '/profile';
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = '/pexels-gustavo-fring-3885496.webp';
    img.onload = () => setImageLoaded(true);
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

  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-4 transition-all duration-500"
      style={{
        backgroundImage: imageLoaded 
          ? "url('/pexels-gustavo-fring-3885496.webp')" 
          : "url('/pexels-gustavo-fring-3885496-blur.jpg')",
        filter: imageLoaded ? 'none' : 'blur(20px)',
        backgroundColor: imageLoaded ? 'transparent' : '#F0E6D6'
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-lg backdrop-blur-sm">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">
          {isLogin ? "Welcome Back" : "Nairobi Visa Hub"}
        </h1>
        {!isLogin && (
          <p className="mb-6 text-sm text-gray-600">
            Start Your Journey Abroad Today
          </p>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254 700 000 000"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label htmlFor="nationalId" className="mb-2 block text-sm font-medium text-gray-700">
              National ID
            </label>
            <input
              type="text"
              id="nationalId"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder="Enter your national ID"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Submitting..." : isLogin ? "Login" : "Submit Application"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setPhone("");
              setNationalId("");
              setError("");
              setSuccess("");
            }}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {isLogin ? "New here? Create an account" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
