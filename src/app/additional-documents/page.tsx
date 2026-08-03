"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { compressImage, isImageFile } from "@/utils/imageCompression";

export default function AdditionalDocumentsPage() {
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [passport, setPassport] = useState<string | null>(null);
  const [yellowFever, setYellowFever] = useState<string | null>(null);
  const [drivingLicense, setDrivingLicense] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existingPassport, setExistingPassport] = useState<string | null>(null);
  const [existingYellowFever, setExistingYellowFever] = useState<string | null>(null);
  const [existingDrivingLicense, setExistingDrivingLicense] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const nationalId = localStorage.getItem('nationalId');
        if (!nationalId) {
          window.location.href = '/mobile-form';
          return;
        }

        const response = await fetch('/api/auth/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nationalId }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user.passport) setExistingPassport(data.user.passport);
          if (data.user.yellowFever) setExistingYellowFever(data.user.yellowFever);
          if (data.user.drivingLicense) setExistingDrivingLicense(data.user.drivingLicense);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handlePassportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isImageFile(file)) {
        setError('Please upload an image file');
        return;
      }
      
      setIsCompressing(true);
      try {
        const compressedImage = await compressImage(file, 800, 0.6);
        setPassport(compressedImage);
        setError('');
      } catch (err) {
        setError('Failed to process image. Please try another file.');
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleYellowFeverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isImageFile(file)) {
        setError('Please upload an image file');
        return;
      }
      
      setIsCompressing(true);
      try {
        const compressedImage = await compressImage(file, 800, 0.6);
        setYellowFever(compressedImage);
        setError('');
      } catch (err) {
        setError('Failed to process image. Please try another file.');
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleDrivingLicenseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isImageFile(file)) {
        setError('Please upload an image file');
        return;
      }
      
      setIsCompressing(true);
      try {
        const compressedImage = await compressImage(file, 800, 0.6);
        setDrivingLicense(compressedImage);
        setError('');
      } catch (err) {
        setError('Failed to process image. Please try another file.');
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!passport && !yellowFever && !drivingLicense) {
      setError("Please upload at least one document");
      return;
    }

    setIsSubmitting(true);

    try {
      const nationalId = localStorage.getItem('nationalId');
      if (!nationalId) {
        throw new Error('Please login first');
      }

      const response = await fetch('/api/auth/additional-documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nationalId,
          passport,
          yellowFever,
          drivingLicense,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess(data.message);
      setExistingPassport(passport || existingPassport);
      setExistingYellowFever(yellowFever || existingYellowFever);
      setExistingDrivingLicense(drivingLicense || existingDrivingLicense);
      setPassport(null);
      setYellowFever(null);
      setDrivingLicense(null);
      // Only redirect if this is first-time completion
      if (!existingPassport && !existingYellowFever && !existingDrivingLicense) {
        localStorage.setItem('additionalDocumentsComplete', 'true');
        // Mark as complete in database
        try {
          const nationalId = localStorage.getItem('nationalId');
          if (nationalId) {
            await fetch('/api/auth/additional-documents-complete', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ nationalId }),
            });
          }
        } catch (error) {
          console.error('Error marking additional documents complete:', error);
        }
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      const nationalId = localStorage.getItem('nationalId');
      if (nationalId) {
        await fetch('/api/auth/additional-documents-skip', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nationalId }),
        });
      }
      localStorage.setItem('additionalDocumentsComplete', 'true');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error skipping additional documents:', error);
      // Still redirect even if API fails
      localStorage.setItem('additionalDocumentsComplete', 'true');
      window.location.href = '/dashboard';
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="mx-auto max-w-md">
        <h1 className="mb-2 text-2xl font-semibold text-gray-950">
          Additional Documents
        </h1>
        <p className="mb-4 text-sm text-gray-600">
          Upload your passport, yellow fever card, and driving license (if applicable)
        </p>

        {/* Info message */}
        <div className="mb-6 rounded-lg bg-amber-50 p-4 border-2 border-amber-800 relative" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px'
        }}>
          <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
          <p className="text-xs font-serif text-amber-900 font-bold mb-2 relative z-10">We Handle Everything For You</p>
          <p className="text-xs font-serif text-amber-800 relative z-10">
            Don't have these documents? No problem. We'll handle the costs and process for you. The costs will be deducted from your earnings once you start working. This is part of our "We Pay for Everything Upfront" commitment.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
            {success}
          </div>
        )}

        {/* Existing documents preview */}
        {(existingPassport || existingYellowFever || existingDrivingLicense) && (
          <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-medium text-gray-700">Uploaded Documents</h2>
            <div className="grid grid-cols-1 gap-3">
              {existingPassport && (
                <div>
                  <p className="mb-1 text-xs text-gray-500">Passport</p>
                  <img 
                    src={existingPassport} 
                    alt="Passport" 
                    className="h-32 w-full rounded border object-cover"
                  />
                </div>
              )}
              {existingYellowFever && (
                <div>
                  <p className="mb-1 text-xs text-gray-500">Yellow Fever Card</p>
                  <img 
                    src={existingYellowFever} 
                    alt="Yellow Fever Card" 
                    className="h-32 w-full rounded border object-cover"
                  />
                </div>
              )}
              {existingDrivingLicense && (
                <div>
                  <p className="mb-1 text-xs text-gray-500">Driving License</p>
                  <img 
                    src={existingDrivingLicense} 
                    alt="Driving License" 
                    className="h-32 w-full rounded border object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Passport */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <label htmlFor="passport" className="mb-2 block text-sm font-medium text-gray-700">
              Passport
            </label>
            <p className="text-xs text-gray-500 mb-2">Cost: KES 6,000 - 8,000 (We handle this - deducted from earnings)</p>
            <input
              type="file"
              id="passport"
              accept="image/*"
              onChange={handlePassportUpload}
              className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
            {passport && (
              <div className="mt-3">
                <img 
                  src={passport} 
                  alt="Passport preview" 
                  className="h-48 w-full rounded-lg border object-cover"
                />
              </div>
            )}
          </div>

          {/* Yellow Fever Card */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <label htmlFor="yellowFever" className="mb-2 block text-sm font-medium text-gray-700">
              Yellow Fever Card
            </label>
            <p className="text-xs text-gray-500 mb-2">Cost: KES 2,000 - 3,000 (We handle this - deducted from earnings)</p>
            <input
              type="file"
              id="yellowFever"
              accept="image/*"
              onChange={handleYellowFeverUpload}
              className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
            {yellowFever && (
              <div className="mt-3">
                <img 
                  src={yellowFever} 
                  alt="Yellow Fever Card preview" 
                  className="h-48 w-full rounded-lg border object-cover"
                />
              </div>
            )}
          </div>

          {/* Driving License */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <label htmlFor="drivingLicense" className="mb-2 block text-sm font-medium text-gray-700">
              Driving License
            </label>
            <p className="text-xs text-gray-500 mb-2">Cost: KES 3,000 - 5,000 (We handle this - deducted from earnings)</p>
            <input
              type="file"
              id="drivingLicense"
              accept="image/*"
              onChange={handleDrivingLicenseUpload}
              className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
            {drivingLicense && (
              <div className="mt-3">
                <img 
                  src={drivingLicense} 
                  alt="Driving License preview" 
                  className="h-48 w-full rounded-lg border object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting || (!passport && !yellowFever && !drivingLicense)}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Uploading..." : "Upload Documents"}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 rounded-lg bg-gray-200 px-4 py-3 text-gray-700 font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Skip
            </button>
          </div>
        </form>
      </div>
      
      <BottomNav />
    </div>
  );
}
