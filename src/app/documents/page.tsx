"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import LeatherBadge from "@/components/LeatherBadge";
import { compressImage, isImageFile } from "@/utils/imageCompression";

export default function DocumentsPage() {
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existingFront, setExistingFront] = useState<string | null>(null);
  const [existingBack, setExistingBack] = useState<string | null>(null);
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
          if (data.user.nationalIdFront) setExistingFront(data.user.nationalIdFront);
          if (data.user.nationalIdBack) setExistingBack(data.user.nationalIdBack);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleFrontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isImageFile(file)) {
        setError('Please upload an image file');
        return;
      }
      
      setIsCompressing(true);
      try {
        // More aggressive compression for ID cards (smaller size, faster)
        const compressedImage = await compressImage(file, 600, 0.5);
        setFrontImage(compressedImage);
        setError('');
      } catch (err) {
        setError('Failed to process image. Please try another file.');
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleBackUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isImageFile(file)) {
        setError('Please upload an image file');
        return;
      }
      
      setIsCompressing(true);
      try {
        // More aggressive compression for ID cards (smaller size, faster)
        const compressedImage = await compressImage(file, 600, 0.5);
        setBackImage(compressedImage);
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

    if (!frontImage || !backImage) {
      setError("Please upload both front and back of your national ID");
      return;
    }

    setIsSubmitting(true);

    try {
      const nationalId = localStorage.getItem('nationalId');
      if (!nationalId) {
        throw new Error('Please login first');
      }

      const response = await fetch('/api/auth/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nationalId,
          nationalIdFront: frontImage,
          nationalIdBack: backImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess(data.message);
      setExistingFront(frontImage);
      setExistingBack(backImage);
      setFrontImage(null);
      setBackImage(null);
      // Only redirect if this is first-time completion (no existing documents before upload)
      if (!existingFront && !existingBack) {
        localStorage.setItem('documentsComplete', 'true');
        setTimeout(() => {
          window.location.href = '/additional-documents';
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

  return (
    <div className="min-h-screen p-4 pb-20 relative" style={{
      backgroundColor: '#f5f0e6',
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.03) 0%, transparent 50%)
      `
    }}>
      <LeatherBadge />
      <div className="mx-auto max-w-md">
        <h1 className="mb-2 text-2xl font-serif font-bold text-amber-950 tracking-widest uppercase">
          Upload National ID
        </h1>
        <p className="mb-6 text-sm font-serif text-amber-800">
          Please upload clear images of both sides of your national ID
        </p>

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

        {/* Existing documents preview */}
        {(existingFront || existingBack) && (
          <div className="mb-6 bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
          }}>
            <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
            <h2 className="mb-3 text-sm font-serif font-bold text-amber-900 uppercase tracking-widest relative">
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-800"></span>
              Uploaded Documents
            </h2>
            <div className="grid grid-cols-2 gap-3 relative z-10">
              {existingFront && (
                <div>
                  <p className="mb-1 text-xs font-serif text-amber-900 font-medium">Front</p>
                  <img 
                    src={existingFront} 
                    alt="ID Front" 
                    className="h-24 w-full rounded-lg border-2 border-amber-800 object-cover"
                  />
                </div>
              )}
              {existingBack && (
                <div>
                  <p className="mb-1 text-xs font-serif text-amber-900 font-medium">Back</p>
                  <img 
                    src={existingBack} 
                    alt="ID Back" 
                    className="h-24 w-full rounded-lg border-2 border-amber-800 object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Front of ID */}
          <div className="bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
          }}>
            <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
            <label htmlFor="front" className="mb-2 block text-sm font-serif font-bold text-amber-900 relative z-10">
              Front of National ID
            </label>
            <input
              type="file"
              id="front"
              accept="image/*"
              onChange={handleFrontUpload}
              className="w-full text-sm font-serif text-amber-900 file:mr-4 file:rounded-lg file:border-2 file:border-amber-800 file:bg-amber-50 file:px-4 file:py-2 file:text-sm file:font-bold file:text-amber-900 hover:file:bg-amber-100 relative z-10"
            />
            {frontImage && (
              <div className="mt-3 relative z-10">
                <img 
                  src={frontImage} 
                  alt="Front preview" 
                  className="h-48 w-full rounded-lg border-2 border-amber-800 object-cover"
                />
              </div>
            )}
          </div>

          {/* Back of ID */}
          <div className="bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
          }}>
            <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
            <label htmlFor="back" className="mb-2 block text-sm font-serif font-bold text-amber-900 relative z-10">
              Back of National ID
            </label>
            <input
              type="file"
              id="back"
              accept="image/*"
              onChange={handleBackUpload}
              className="w-full text-sm font-serif text-amber-900 file:mr-4 file:rounded-lg file:border-2 file:border-amber-800 file:bg-amber-50 file:px-4 file:py-2 file:text-sm file:font-bold file:text-amber-900 hover:file:bg-amber-100 relative z-10"
            />
            {backImage && (
              <div className="mt-3 relative z-10">
                <img 
                  src={backImage} 
                  alt="Back preview" 
                  className="h-48 w-full rounded-lg border-2 border-amber-800 object-cover"
                />
              </div>
            )}
          </div>

          <div className="bg-amber-50/50 p-3 rounded-lg border-2 border-amber-800 relative" style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
          }}>
            <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
            <p className="text-xs font-serif text-amber-900 font-medium relative z-10">⚠️ Make sure the images are very clear and all text is readable</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg border-2 border-amber-800 bg-amber-800 px-4 py-3 text-white font-serif font-bold hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-amber-600 disabled:cursor-not-allowed transition-colors"
            style={{
              backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.1) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.1) 50%, rgba(139, 69, 19, 0.1) 75%, transparent 75%, transparent)',
              backgroundSize: '4px 4px'
            }}
          >
            {isSubmitting ? "Uploading..." : "Upload Documents"}
          </button>
        </form>
      </div>
      
      <BottomNav />
    </div>
  );
}
