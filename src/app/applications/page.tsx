'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { useUser } from "@/context/UserContext";
import LeatherBadge from "@/components/LeatherBadge";
import { Check, AlertCircle } from "lucide-react";
import { compressImage, isImageFile } from "@/utils/imageCompression";

export default function ApplicationsPage() {
  const { user, loading, refreshUser } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setIsSubmittingSuccess] = useState(false);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  // Document status state - using 'have', 'dont_have', or null for each
  const [documents, setDocuments] = useState({
    // Identity Documents (Most Critical)
    passportStatus: null as 'have' | 'dont_have' | null,
    passportUpload: '',
    birthCertificateStatus: null as 'have' | 'dont_have' | null,
    birthCertificateUpload: '',
    marriageCertificateStatus: null as 'have' | 'dont_have' | null,
    marriageCertificateUpload: '',
    
    // Legal Documents (Critical)
    certificateOfGoodConductStatus: null as 'have' | 'dont_have' | null,
    certificateOfGoodConductUpload: '',
    kraTaxComplianceStatus: null as 'have' | 'dont_have' | null,
    kraTaxComplianceUpload: '',
    apostilleStatus: null as 'have' | 'dont_have' | null,
    apostilleUpload: '',
    
    // Health Documents (Important)
    yellowFeverCertificateStatus: null as 'have' | 'dont_have' | null,
    yellowFeverCertificateUpload: '',
    medicalExamCertificateStatus: null as 'have' | 'dont_have' | null,
    medicalExamCertificateUpload: '',
    tbTestCertificateStatus: null as 'have' | 'dont_have' | null,
    tbTestCertificateUpload: '',
    hivTestCertificateStatus: null as 'have' | 'dont_have' | null,
    hivTestCertificateUpload: '',
    
    // Employment Documents (Important)
    employmentContractStatus: null as 'have' | 'dont_have' | null,
    employmentContractUpload: '',
    employerIntroductionLetterStatus: null as 'have' | 'dont_have' | null,
    employerIntroductionLetterUpload: '',
    invitationLetterStatus: null as 'have' | 'dont_have' | null,
    invitationLetterUpload: '',
  });

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

    if (user?.applicationDocuments) {
      setDocuments({
        passportStatus: user.applicationDocuments.hasPassport ? 'have' : (user.applicationDocuments.passportUpload ? 'have' : null),
        passportUpload: user.applicationDocuments.passportUpload || '',
        birthCertificateStatus: user.applicationDocuments.hasBirthCertificate ? 'have' : (user.applicationDocuments.birthCertificateUpload ? 'have' : null),
        birthCertificateUpload: user.applicationDocuments.birthCertificateUpload || '',
        marriageCertificateStatus: user.applicationDocuments.hasMarriageCertificate ? 'have' : (user.applicationDocuments.marriageCertificateUpload ? 'have' : null),
        marriageCertificateUpload: user.applicationDocuments.marriageCertificateUpload || '',
        certificateOfGoodConductStatus: user.applicationDocuments.hasCertificateOfGoodConduct ? 'have' : (user.applicationDocuments.certificateOfGoodConductUpload ? 'have' : null),
        certificateOfGoodConductUpload: user.applicationDocuments.certificateOfGoodConductUpload || '',
        kraTaxComplianceStatus: user.applicationDocuments.hasKraTaxCompliance ? 'have' : (user.applicationDocuments.kraTaxComplianceUpload ? 'have' : null),
        kraTaxComplianceUpload: user.applicationDocuments.kraTaxComplianceUpload || '',
        apostilleStatus: user.applicationDocuments.hasApostille ? 'have' : (user.applicationDocuments.apostilleUpload ? 'have' : null),
        apostilleUpload: user.applicationDocuments.apostilleUpload || '',
        yellowFeverCertificateStatus: user.applicationDocuments.hasYellowFeverCertificate ? 'have' : (user.applicationDocuments.yellowFeverCertificateUpload ? 'have' : null),
        yellowFeverCertificateUpload: user.applicationDocuments.yellowFeverCertificateUpload || '',
        medicalExamCertificateStatus: user.applicationDocuments.hasMedicalExamCertificate ? 'have' : (user.applicationDocuments.medicalExamCertificateUpload ? 'have' : null),
        medicalExamCertificateUpload: user.applicationDocuments.medicalExamCertificateUpload || '',
        tbTestCertificateStatus: user.applicationDocuments.hasTbTestCertificate ? 'have' : (user.applicationDocuments.tbTestCertificateUpload ? 'have' : null),
        tbTestCertificateUpload: user.applicationDocuments.tbTestCertificateUpload || '',
        hivTestCertificateStatus: user.applicationDocuments.hasHivTestCertificate ? 'have' : (user.applicationDocuments.hivTestCertificateUpload ? 'have' : null),
        hivTestCertificateUpload: user.applicationDocuments.hivTestCertificateUpload || '',
        employmentContractStatus: user.applicationDocuments.hasEmploymentContract ? 'have' : (user.applicationDocuments.employmentContractUpload ? 'have' : null),
        employmentContractUpload: user.applicationDocuments.employmentContractUpload || '',
        employerIntroductionLetterStatus: user.applicationDocuments.hasEmployerIntroductionLetter ? 'have' : (user.applicationDocuments.employerIntroductionLetterUpload ? 'have' : null),
        employerIntroductionLetterUpload: user.applicationDocuments.employerIntroductionLetterUpload || '',
        invitationLetterStatus: user.applicationDocuments.hasInvitationLetter ? 'have' : (user.applicationDocuments.invitationLetterUpload ? 'have' : null),
        invitationLetterUpload: user.applicationDocuments.invitationLetterUpload || '',
      });
    }
  }, [user, router]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isImageFile(file)) {
        setError('Please upload an image file');
        return;
      }

      try {
        // Compress image before storing (aggressive compression for faster processing)
        const compressedImage = await compressImage(file, 600, 0.5);
        setDocuments(prev => ({
          ...prev,
          [field]: compressedImage
        }));
      } catch (err) {
        setError('Failed to process image. Please try another file.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validate that all document options are selected
    const requiredDocuments = [
      'passportStatus', 'birthCertificateStatus', 'marriageCertificateStatus',
      'certificateOfGoodConductStatus', 'kraTaxComplianceStatus', 'apostilleStatus',
      'yellowFeverCertificateStatus', 'medicalExamCertificateStatus', 'tbTestCertificateStatus', 'hivTestCertificateStatus',
      'employmentContractStatus', 'employerIntroductionLetterStatus', 'invitationLetterStatus'
    ];

    const missingSelections = requiredDocuments.filter(doc => documents[doc as keyof typeof documents] === null);
    
    if (missingSelections.length > 0) {
      setError(`Please make a selection for all documents before submitting. ${missingSelections.length} document(s) still need your response.`);
      setIsSubmitting(false);
      return;
    }

    // Validate that if user selected "have", they must upload the document
    const missingUploads = [];
    if (documents.passportStatus === 'have' && !documents.passportUpload) missingUploads.push('Passport');
    if (documents.birthCertificateStatus === 'have' && !documents.birthCertificateUpload) missingUploads.push('Birth Certificate');
    if (documents.marriageCertificateStatus === 'have' && !documents.marriageCertificateUpload) missingUploads.push('Marriage Certificate');
    if (documents.certificateOfGoodConductStatus === 'have' && !documents.certificateOfGoodConductUpload) missingUploads.push('Certificate of Good Conduct');
    if (documents.kraTaxComplianceStatus === 'have' && !documents.kraTaxComplianceUpload) missingUploads.push('KRA Tax Compliance');
    if (documents.apostilleStatus === 'have' && !documents.apostilleUpload) missingUploads.push('Apostille');
    if (documents.yellowFeverCertificateStatus === 'have' && !documents.yellowFeverCertificateUpload) missingUploads.push('Yellow Fever Certificate');
    if (documents.medicalExamCertificateStatus === 'have' && !documents.medicalExamCertificateUpload) missingUploads.push('Medical Exam Certificate');
    if (documents.tbTestCertificateStatus === 'have' && !documents.tbTestCertificateUpload) missingUploads.push('TB Test Certificate');
    if (documents.hivTestCertificateStatus === 'have' && !documents.hivTestCertificateUpload) missingUploads.push('HIV Test Certificate');
    if (documents.employmentContractStatus === 'have' && !documents.employmentContractUpload) missingUploads.push('Employment Contract');
    if (documents.employerIntroductionLetterStatus === 'have' && !documents.employerIntroductionLetterUpload) missingUploads.push('Character Reference');
    if (documents.invitationLetterStatus === 'have' && !documents.invitationLetterUpload) missingUploads.push('Invitation Letter');

    if (missingUploads.length > 0) {
      setError(`Please upload the following documents you indicated you have: ${missingUploads.join(', ')}`);
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
      const response = await fetch('/api/application-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nationalId,
          documents,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save application documents');
      }

      await refreshUser();
      setIsSubmittingSuccess(true);
      
      // Redirect to appointment booking after successful submission
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: IDENTITY DOCUMENTS (Most Critical) */}
          <div className="bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
          }}>
            <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
            <h2 className="mb-4 text-sm font-serif font-bold text-amber-900 uppercase tracking-widest relative">
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-800"></span>
              1. Identity Documents (Critical)
            </h2>
            
            <div className="space-y-4 relative z-10">
              {/* Passport */}
              <div className="border-b border-dashed border-amber-700/50 pb-4">
                <div className="mb-3">
                  <label className="block text-sm font-serif font-bold text-amber-900 mb-1">
                    Valid Kenyan Passport
                  </label>
                  <p className="text-xs font-serif text-amber-800 mb-2">Required for all international travel. Must have at least 6 months validity. Cost: KES 6,000-8,000 (we handle if needed).</p>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="passport"
                        checked={documents.passportStatus === 'have'}
                        onChange={() => setDocuments(prev => ({ ...prev, passportStatus: 'have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I have this document</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="passport"
                        checked={documents.passportStatus === 'dont_have'}
                        onChange={() => setDocuments(prev => ({ ...prev, passportStatus: 'dont_have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I don't have this document</span>
                    </label>
                  </div>
                </div>
                
                {documents.passportStatus === 'have' && (
                  <div className="ml-6 mt-2">
                    <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Upload Passport Copy</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'passportUpload')}
                        className="flex-1 text-xs font-serif text-amber-900 file:mr-2 file:rounded file:border-2 file:border-amber-800 file:bg-amber-50 file:px-2 file:py-1 file:text-xs file:font-bold file:text-amber-900"
                      />
                      {documents.passportUpload && <Check size={16} className="text-green-700" />}
                    </div>
                  </div>
                )}
                
                {documents.passportStatus === 'dont_have' && (
                  <div className="ml-6 mt-2 bg-amber-100/50 p-2 rounded border border-amber-600">
                    <p className="text-xs font-serif text-amber-900">
                      <span className="font-bold">We handle everything!</span> Cost: KES 6,000 - 8,000. We'll obtain your passport and deduct from your earnings once you start working.
                    </p>
                  </div>
                )}
              </div>

              {/* Birth Certificate */}
              <div className="border-b border-dashed border-amber-700/50 pb-4">
                <div className="mb-3">
                  <label className="block text-sm font-serif font-bold text-amber-900 mb-1">
                    Birth Certificate
                  </label>
                  <p className="text-xs font-serif text-amber-800 mb-2">Original or certified copy required. Cost: KES 200-500 (we handle if needed).</p>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="birthCertificate"
                        checked={documents.birthCertificateStatus === 'have'}
                        onChange={() => setDocuments(prev => ({ ...prev, birthCertificateStatus: 'have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I have this document</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="birthCertificate"
                        checked={documents.birthCertificateStatus === 'dont_have'}
                        onChange={() => setDocuments(prev => ({ ...prev, birthCertificateStatus: 'dont_have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I don't have this document</span>
                    </label>
                  </div>
                </div>
                
                {documents.birthCertificateStatus === 'have' && (
                  <div className="ml-6 mt-2">
                    <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Upload Birth Certificate</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'birthCertificateUpload')}
                        className="flex-1 text-xs font-serif text-amber-900 file:mr-2 file:rounded file:border-2 file:border-amber-800 file:bg-amber-50 file:px-2 file:py-1 file:text-xs file:font-bold file:text-amber-900"
                      />
                      {documents.birthCertificateUpload && <Check size={16} className="text-green-700" />}
                    </div>
                  </div>
                )}
                
                {documents.birthCertificateStatus === 'dont_have' && (
                  <div className="ml-6 mt-2 bg-amber-100/50 p-2 rounded border border-amber-600">
                    <p className="text-xs font-serif text-amber-900">
                      <span className="font-bold">We handle everything!</span> Cost: KES 200 - 500. We'll obtain your birth certificate and deduct from your earnings once you start working.
                    </p>
                  </div>
                )}
              </div>

              {/* Marriage Certificate */}
              <div>
                <div className="mb-3">
                  <label className="block text-sm font-serif font-bold text-amber-900 mb-1">
                    Marriage Certificate (Optional)
                  </label>
                  <p className="text-xs font-serif text-amber-800 mb-2">Required if married.</p>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="marriageCertificate"
                        checked={documents.marriageCertificateStatus === 'have'}
                        onChange={() => setDocuments(prev => ({ ...prev, marriageCertificateStatus: 'have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I have this document</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="marriageCertificate"
                        checked={documents.marriageCertificateStatus === 'dont_have'}
                        onChange={() => setDocuments(prev => ({ ...prev, marriageCertificateStatus: 'dont_have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I don't have this document</span>
                    </label>
                  </div>
                </div>
                
                {documents.marriageCertificateStatus === 'have' && (
                  <div className="ml-6 mt-2">
                    <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Upload Marriage Certificate</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'marriageCertificateUpload')}
                        className="flex-1 text-xs font-serif text-amber-900 file:mr-2 file:rounded file:border-2 file:border-amber-800 file:bg-amber-50 file:px-2 file:py-1 file:text-xs file:font-bold file:text-amber-900"
                      />
                      {documents.marriageCertificateUpload && <Check size={16} className="text-green-700" />}
                    </div>
                  </div>
                )}
                
                {documents.marriageCertificateStatus === 'dont_have' && (
                  <div className="ml-6 mt-2 bg-amber-100/50 p-2 rounded border border-amber-600">
                    <p className="text-xs font-serif text-amber-900">
                      <span className="font-bold">We handle everything!</span> Cost: KES 500 - 1,000. If married, we'll obtain your marriage certificate and deduct from your earnings once you start working.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: LEGAL DOCUMENTS (Critical) */}
          <div className="bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
          }}>
            <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
            <h2 className="mb-4 text-sm font-serif font-bold text-amber-900 uppercase tracking-widest relative">
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-800"></span>
              2. Legal Documents (Critical)
            </h2>
            
            <div className="space-y-4 relative z-10">
              {/* Certificate of Good Conduct */}
              <div className="border-b border-dashed border-amber-700/50 pb-4">
                <div className="mb-3">
                  <label className="block text-sm font-serif font-bold text-amber-900 mb-1">
                    Certificate of Good Conduct
                  </label>
                  <p className="text-xs font-serif text-amber-800 mb-2">Police clearance certificate. Valid for 6-12 months. Cost: KES 1,050 (we handle if needed).</p>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="certificateOfGoodConduct"
                        checked={documents.certificateOfGoodConductStatus === 'have'}
                        onChange={() => setDocuments(prev => ({ ...prev, certificateOfGoodConductStatus: 'have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I have this document</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="certificateOfGoodConduct"
                        checked={documents.certificateOfGoodConductStatus === 'dont_have'}
                        onChange={() => setDocuments(prev => ({ ...prev, certificateOfGoodConductStatus: 'dont_have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I don't have this document</span>
                    </label>
                  </div>
                </div>
                
                {documents.certificateOfGoodConductStatus === 'have' && (
                  <div className="ml-6 mt-2">
                    <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Upload Certificate</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'certificateOfGoodConductUpload')}
                        className="flex-1 text-xs font-serif text-amber-900 file:mr-2 file:rounded file:border-2 file:border-amber-800 file:bg-amber-50 file:px-2 file:py-1 file:text-xs file:font-bold file:text-amber-900"
                      />
                      {documents.certificateOfGoodConductUpload && <Check size={16} className="text-green-700" />}
                    </div>
                  </div>
                )}
                
                {documents.certificateOfGoodConductStatus === 'dont_have' && (
                  <div className="ml-6 mt-2 bg-amber-100/50 p-2 rounded border border-amber-600">
                    <p className="text-xs font-serif text-amber-900">
                      <span className="font-bold">We handle everything!</span> Cost: KES 1,050. We'll obtain your Certificate of Good Conduct and deduct from your earnings once you start working.
                    </p>
                  </div>
                )}
              </div>

              {/* KRA Tax Compliance */}
              <div className="border-b border-dashed border-amber-700/50 pb-4">
                <div className="mb-3">
                  <label className="block text-sm font-serif font-bold text-amber-900 mb-1">
                    KRA Tax Compliance Certificate
                  </label>
                  <p className="text-xs font-serif text-amber-800 mb-2">Required for employment. Valid for 12 months. Cost: Free via iTax (we handle if needed).</p>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="kraTaxCompliance"
                        checked={documents.kraTaxComplianceStatus === 'have'}
                        onChange={() => setDocuments(prev => ({ ...prev, kraTaxComplianceStatus: 'have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I have this document</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="kraTaxCompliance"
                        checked={documents.kraTaxComplianceStatus === 'dont_have'}
                        onChange={() => setDocuments(prev => ({ ...prev, kraTaxComplianceStatus: 'dont_have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I don't have this document</span>
                    </label>
                  </div>
                </div>
                
                {documents.kraTaxComplianceStatus === 'have' && (
                  <div className="ml-6 mt-2">
                    <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Upload Tax Compliance</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'kraTaxComplianceUpload')}
                        className="flex-1 text-xs font-serif text-amber-900 file:mr-2 file:rounded file:border-2 file:border-amber-800 file:bg-amber-50 file:px-2 file:py-1 file:text-xs file:font-bold file:text-amber-900"
                      />
                      {documents.kraTaxComplianceUpload && <Check size={16} className="text-green-700" />}
                    </div>
                  </div>
                )}
                
                {documents.kraTaxComplianceStatus === 'dont_have' && (
                  <div className="ml-6 mt-2 bg-amber-100/50 p-2 rounded border border-amber-600">
                    <p className="text-xs font-serif text-amber-900">
                      <span className="font-bold">We handle everything!</span> Cost: Free via iTax. We'll help you obtain your KRA Tax Compliance Certificate during your appointment.
                    </p>
                  </div>
                )}
              </div>

              {/* Apostille */}
              <div>
                <div className="mb-3">
                  <label className="block text-sm font-serif font-bold text-amber-900 mb-1">
                    Apostille (If Required)
                  </label>
                  <p className="text-xs font-serif text-amber-800 mb-2">Document authentication for Hague Convention countries (UK, US, Australia, Canada, Germany). Cost: KES 1,500 per document (we handle if needed).</p>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="apostille"
                        checked={documents.apostilleStatus === 'have'}
                        onChange={() => setDocuments(prev => ({ ...prev, apostilleStatus: 'have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I have this document</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="apostille"
                        checked={documents.apostilleStatus === 'dont_have'}
                        onChange={() => setDocuments(prev => ({ ...prev, apostilleStatus: 'dont_have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I don't have this document</span>
                    </label>
                  </div>
                </div>
                
                {documents.apostilleStatus === 'have' && (
                  <div className="ml-6 mt-2">
                    <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Upload Apostilled Documents</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'apostilleUpload')}
                        className="flex-1 text-xs font-serif text-amber-900 file:mr-2 file:rounded file:border-2 file:border-amber-800 file:bg-amber-50 file:px-2 file:py-1 file:text-xs file:font-bold file:text-amber-900"
                      />
                      {documents.apostilleUpload && <Check size={16} className="text-green-700" />}
                    </div>
                  </div>
                )}
                
                {documents.apostilleStatus === 'dont_have' && (
                  <div className="ml-6 mt-2 bg-amber-100/50 p-2 rounded border border-amber-600">
                    <p className="text-xs font-serif text-amber-900">
                      <span className="font-bold">We handle everything!</span> Cost: KES 1,500 per document. We'll obtain apostilles if required and deduct from your earnings once you start working.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: HEALTH DOCUMENTS (Important) */}
          <div className="bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
          }}>
            <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
            <h2 className="mb-4 text-sm font-serif font-bold text-amber-900 uppercase tracking-widest relative">
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-800"></span>
              3. Health Documents (Important)
            </h2>
            
            <div className="space-y-4 relative z-10">
              {/* Yellow Fever Certificate */}
              <div className="border-b border-dashed border-amber-700/50 pb-4">
                <div className="mb-3">
                  <label className="block text-sm font-serif font-bold text-amber-900 mb-1">
                    Yellow Fever Vaccination Certificate
                  </label>
                  <p className="text-xs font-serif text-amber-800 mb-2">Required for many countries. Cost: KES 3,000-5,000 (we handle if needed).</p>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="yellowFeverCertificate"
                        checked={documents.yellowFeverCertificateStatus === 'have'}
                        onChange={() => setDocuments(prev => ({ ...prev, yellowFeverCertificateStatus: 'have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I have this document</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="yellowFeverCertificate"
                        checked={documents.yellowFeverCertificateStatus === 'dont_have'}
                        onChange={() => setDocuments(prev => ({ ...prev, yellowFeverCertificateStatus: 'dont_have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I don't have this document</span>
                    </label>
                  </div>
                </div>
                
                {documents.yellowFeverCertificateStatus === 'have' && (
                  <div className="ml-6 mt-2">
                    <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Upload Yellow Fever Card</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'yellowFeverCertificateUpload')}
                        className="flex-1 text-xs font-serif text-amber-900 file:mr-2 file:rounded file:border-2 file:border-amber-800 file:bg-amber-50 file:px-2 file:py-1 file:text-xs file:font-bold file:text-amber-900"
                      />
                      {documents.yellowFeverCertificateUpload && <Check size={16} className="text-green-700" />}
                    </div>
                  </div>
                )}
                
                {documents.yellowFeverCertificateStatus === 'dont_have' && (
                  <div className="ml-6 mt-2 bg-amber-100/50 p-2 rounded border border-amber-600">
                    <p className="text-xs font-serif text-amber-900">
                      <span className="font-bold">We handle everything!</span> Cost: KES 3,000 - 5,000. We'll get your yellow fever vaccination and deduct from your earnings once you start working.
                    </p>
                  </div>
                )}
              </div>

              {/* Medical Exam */}
              <div className="border-b border-dashed border-amber-700/50 pb-4">
                <div className="mb-3">
                  <label className="block text-sm font-serif font-bold text-amber-900 mb-1">
                    Immigration Medical Examination
                  </label>
                  <p className="text-xs font-serif text-amber-800 mb-2">Required by most countries. Cost: KES 15,000-45,000 (we handle if needed).</p>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="medicalExamCertificate"
                        checked={documents.medicalExamCertificateStatus === 'have'}
                        onChange={() => setDocuments(prev => ({ ...prev, medicalExamCertificateStatus: 'have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I have this document</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="medicalExamCertificate"
                        checked={documents.medicalExamCertificateStatus === 'dont_have'}
                        onChange={() => setDocuments(prev => ({ ...prev, medicalExamCertificateStatus: 'dont_have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I don't have this document</span>
                    </label>
                  </div>
                </div>
                
                {documents.medicalExamCertificateStatus === 'have' && (
                  <div className="ml-6 mt-2">
                    <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Upload Medical Report</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'medicalExamCertificateUpload')}
                        className="flex-1 text-xs font-serif text-amber-900 file:mr-2 file:rounded file:border-2 file:border-amber-800 file:bg-amber-50 file:px-2 file:py-1 file:text-xs file:font-bold file:text-amber-900"
                      />
                      {documents.medicalExamCertificateUpload && <Check size={16} className="text-green-700" />}
                    </div>
                  </div>
                )}
                
                {documents.medicalExamCertificateStatus === 'dont_have' && (
                  <div className="ml-6 mt-2 bg-amber-100/50 p-2 rounded border border-amber-600">
                    <p className="text-xs font-serif text-amber-900">
                      <span className="font-bold">We handle everything!</span> Cost: KES 15,000 - 45,000. We'll connect you with IOM Nairobi for your medical exam and deduct from your earnings once you start working.
                    </p>
                  </div>
                )}
              </div>

              {/* TB Test */}
              <div className="border-b border-dashed border-amber-700/50 pb-4">
                <div className="mb-3">
                  <label className="block text-sm font-serif font-bold text-amber-900 mb-1">
                    TB Test Certificate
                  </label>
                  <p className="text-xs font-serif text-amber-800 mb-2">Required for UK, Australia, NZ, Canada. Cost: KES 5,000-10,000 (we handle if needed).</p>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tbTestCertificate"
                        checked={documents.tbTestCertificateStatus === 'have'}
                        onChange={() => setDocuments(prev => ({ ...prev, tbTestCertificateStatus: 'have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I have this document</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tbTestCertificate"
                        checked={documents.tbTestCertificateStatus === 'dont_have'}
                        onChange={() => setDocuments(prev => ({ ...prev, tbTestCertificateStatus: 'dont_have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I don't have this document</span>
                    </label>
                  </div>
                </div>
                
                {documents.tbTestCertificateStatus === 'have' && (
                  <div className="ml-6 mt-2">
                    <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Upload TB Test Result</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'tbTestCertificateUpload')}
                        className="flex-1 text-xs font-serif text-amber-900 file:mr-2 file:rounded file:border-2 file:border-amber-800 file:bg-amber-50 file:px-2 file:py-1 file:text-xs file:font-bold file:text-amber-900"
                      />
                      {documents.tbTestCertificateUpload && <Check size={16} className="text-green-700" />}
                    </div>
                  </div>
                )}
                
                {documents.tbTestCertificateStatus === 'dont_have' && (
                  <div className="ml-6 mt-2 bg-amber-100/50 p-2 rounded border border-amber-600">
                    <p className="text-xs font-serif text-amber-900">
                      <span className="font-bold">We handle everything!</span> Cost: KES 5,000 - 10,000. We'll help you get your TB test if required and deduct from your earnings once you start working.
                    </p>
                  </div>
                )}
              </div>

              {/* HIV Test */}
              <div>
                <div className="mb-3">
                  <label className="block text-sm font-serif font-bold text-amber-900 mb-1">
                    HIV Test Certificate
                  </label>
                  <p className="text-xs font-serif text-amber-800 mb-2">Required for some Gulf countries and Russia. Cost: KES 500-2,000 (we handle if needed).</p>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="hivTestCertificate"
                        checked={documents.hivTestCertificateStatus === 'have'}
                        onChange={() => setDocuments(prev => ({ ...prev, hivTestCertificateStatus: 'have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I have this document</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="hivTestCertificate"
                        checked={documents.hivTestCertificateStatus === 'dont_have'}
                        onChange={() => setDocuments(prev => ({ ...prev, hivTestCertificateStatus: 'dont_have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I don't have this document</span>
                    </label>
                  </div>
                </div>
                
                {documents.hivTestCertificateStatus === 'have' && (
                  <div className="ml-6 mt-2">
                    <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Upload HIV Test Result</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'hivTestCertificateUpload')}
                        className="flex-1 text-xs font-serif text-amber-900 file:mr-2 file:rounded file:border-2 file:border-amber-800 file:bg-amber-50 file:px-2 file:py-1 file:text-xs file:font-bold file:text-amber-900"
                      />
                      {documents.hivTestCertificateUpload && <Check size={16} className="text-green-700" />}
                    </div>
                  </div>
                )}
                
                {documents.hivTestCertificateStatus === 'dont_have' && (
                  <div className="ml-6 mt-2 bg-amber-100/50 p-2 rounded border border-amber-600">
                    <p className="text-xs font-serif text-amber-900">
                      <span className="font-bold">We handle everything!</span> Cost: KES 500 - 2,000. We'll help you get your HIV test if required and deduct from your earnings once you start working.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 4: EMPLOYMENT DOCUMENTS (Important) */}
          <div className="bg-amber-50/50 p-4 rounded-lg border-2 border-amber-800 relative" style={{
            backgroundImage: 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 25%, transparent 25%, transparent 50%, rgba(139, 69, 19, 0.03) 50%, rgba(139, 69, 19, 0.03) 75%, transparent 75%, transparent)',
            backgroundSize: '8px 8px'
          }}>
            <div className="absolute inset-0 border-2 border-dashed border-amber-700 rounded-lg pointer-events-none"></div>
            <h2 className="mb-4 text-sm font-serif font-bold text-amber-900 uppercase tracking-widest relative">
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-800"></span>
              4. Employment Documents (Important)
            </h2>
            
            <div className="space-y-4 relative z-10">
              {/* Employment Contract */}
              <div className="border-b border-dashed border-amber-700/50 pb-4">
                <div className="mb-3">
                  <label className="block text-sm font-serif font-bold text-amber-900 mb-1">
                    Employment Contract
                  </label>
                  <p className="text-xs font-serif text-amber-800 mb-2">Valid contract from foreign employer with LD21 forms. Cost: KES 500-1,000 (we handle if needed).</p>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="employmentContract"
                        checked={documents.employmentContractStatus === 'have'}
                        onChange={() => setDocuments(prev => ({ ...prev, employmentContractStatus: 'have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I have this document</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="employmentContract"
                        checked={documents.employmentContractStatus === 'dont_have'}
                        onChange={() => setDocuments(prev => ({ ...prev, employmentContractStatus: 'dont_have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I don't have this document</span>
                    </label>
                  </div>
                </div>
                
                {documents.employmentContractStatus === 'have' && (
                  <div className="ml-6 mt-2">
                    <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Upload Employment Contract</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'employmentContractUpload')}
                        className="flex-1 text-xs font-serif text-amber-900 file:mr-2 file:rounded file:border-2 file:border-amber-800 file:bg-amber-50 file:px-2 file:py-1 file:text-xs file:font-bold file:text-amber-900"
                      />
                      {documents.employmentContractUpload && <Check size={16} className="text-green-700" />}
                    </div>
                  </div>
                )}
                
                {documents.employmentContractStatus === 'dont_have' && (
                  <div className="ml-6 mt-2 bg-amber-100/50 p-2 rounded border border-amber-600">
                    <p className="text-xs font-serif text-amber-900">
                      <span className="font-bold">We handle everything!</span> Cost: KES 500 - 1,000. We'll help you obtain employment contract and LD21 forms and deduct from your earnings once you start working.
                    </p>
                  </div>
                )}
              </div>

              {/* Employer Introduction Letter */}
              <div className="border-b border-dashed border-amber-700/50 pb-4">
                <div className="mb-3">
                  <label className="block text-sm font-serif font-bold text-amber-900 mb-1">
                    Character Reference (Optional)
                  </label>
                  <p className="text-xs font-serif text-amber-800 mb-2">Reference letter from local chief, community leader, or previous employer (if available). Cost: KES 200-500 (we handle if needed).</p>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="employerIntroductionLetter"
                        checked={documents.employerIntroductionLetterStatus === 'have'}
                        onChange={() => setDocuments(prev => ({ ...prev, employerIntroductionLetterStatus: 'have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I have this document</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="employerIntroductionLetter"
                        checked={documents.employerIntroductionLetterStatus === 'dont_have'}
                        onChange={() => setDocuments(prev => ({ ...prev, employerIntroductionLetterStatus: 'dont_have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I don't have this document</span>
                    </label>
                  </div>
                </div>
                
                {documents.employerIntroductionLetterStatus === 'have' && (
                  <div className="ml-6 mt-2">
                    <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Upload Reference Letter</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'employerIntroductionLetterUpload')}
                        className="flex-1 text-xs font-serif text-amber-900 file:mr-2 file:rounded file:border-2 file:border-amber-800 file:bg-amber-50 file:px-2 file:py-1 file:text-xs file:font-bold file:text-amber-900"
                      />
                      {documents.employerIntroductionLetterUpload && <Check size={16} className="text-green-700" />}
                    </div>
                  </div>
                )}
                
                {documents.employerIntroductionLetterStatus === 'dont_have' && (
                  <div className="ml-6 mt-2 bg-amber-100/50 p-2 rounded border border-amber-600">
                    <p className="text-xs font-serif text-amber-900">
                      <span className="font-bold">We handle everything!</span> Cost: KES 200 - 500. We'll help you get a character reference and deduct from your earnings once you start working.
                    </p>
                  </div>
                )}
              </div>

              {/* Invitation Letter */}
              <div className="border-b border-dashed border-amber-700/50 pb-4">
                <div className="mb-3">
                  <label className="block text-sm font-serif font-bold text-amber-900 mb-1">
                    Invitation Letter
                  </label>
                  <p className="text-xs font-serif text-amber-800 mb-2">Official invitation from foreign employer on letterhead. Cost: Varies by employer (we handle if needed).</p>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="invitationLetter"
                        checked={documents.invitationLetterStatus === 'have'}
                        onChange={() => setDocuments(prev => ({ ...prev, invitationLetterStatus: 'have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I have this document</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="invitationLetter"
                        checked={documents.invitationLetterStatus === 'dont_have'}
                        onChange={() => setDocuments(prev => ({ ...prev, invitationLetterStatus: 'dont_have' }))}
                        className="w-4 h-4 accent-amber-800"
                      />
                      <span className="text-xs font-serif text-amber-900">I don't have this document</span>
                    </label>
                  </div>
                </div>
                
                {documents.invitationLetterStatus === 'have' && (
                  <div className="ml-6 mt-2">
                    <label className="block text-xs font-serif text-amber-900 font-medium mb-1">Upload Invitation Letter</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'invitationLetterUpload')}
                        className="flex-1 text-xs font-serif text-amber-900 file:mr-2 file:rounded file:border-2 file:border-amber-800 file:bg-amber-50 file:px-2 file:py-1 file:text-xs file:font-bold file:text-amber-900"
                      />
                      {documents.invitationLetterUpload && <Check size={16} className="text-green-700" />}
                    </div>
                  </div>
                )}
                
                {documents.invitationLetterStatus === 'dont_have' && (
                  <div className="ml-6 mt-2 bg-amber-100/50 p-2 rounded border border-amber-600">
                    <p className="text-xs font-serif text-amber-900">
                      <span className="font-bold">We handle everything!</span> Cost: Varies by employer. We'll help you obtain an official invitation letter and deduct from your earnings once you start working.
                    </p>
                  </div>
                )}
              </div>

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
