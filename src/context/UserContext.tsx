"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  phone: string;
  nationalId: string;
  fullName?: string;
  location?: string;
  email?: string;
  nationalIdFront?: string;
  nationalIdBack?: string;
  passport?: string;
  yellowFever?: string;
  drivingLicense?: string;
  jobPreferences?: {
    preferredCategory?: string;
    preferredLocation?: string;
    expectedSalary?: string;
    experience?: string;
    skills?: string[];
    availability?: string;
    notes?: string;
  };
  applicationDocuments?: {
    hasPassport?: boolean;
    passportUpload?: string;
    hasBirthCertificate?: boolean;
    birthCertificateUpload?: string;
    hasMarriageCertificate?: boolean;
    marriageCertificateUpload?: string;
    hasCertificateOfGoodConduct?: boolean;
    certificateOfGoodConductUpload?: string;
    hasKraTaxCompliance?: boolean;
    kraTaxComplianceUpload?: string;
    hasApostille?: boolean;
    apostilleUpload?: string;
    hasYellowFeverCertificate?: boolean;
    yellowFeverCertificateUpload?: string;
    hasMedicalExamCertificate?: boolean;
    medicalExamCertificateUpload?: string;
    hasTbTestCertificate?: boolean;
    tbTestCertificateUpload?: string;
    hasHivTestCertificate?: boolean;
    hivTestCertificateUpload?: string;
    hasEmploymentContract?: boolean;
    employmentContractUpload?: string;
    hasEmployerIntroductionLetter?: boolean;
    employerIntroductionLetterUpload?: string;
    hasInvitationLetter?: boolean;
    invitationLetterUpload?: string;
    hasAcademicCertificates?: boolean;
    academicCertificatesUpload?: string;
  };
  applicationStatus?: {
    submitted?: boolean;
    submittedDate?: Date;
    appointmentBooked?: boolean;
    appointmentDate?: Date;
    appointmentTime?: string;
    paymentStatus?: 'pending' | 'pending_verification' | 'completed' | 'failed';
    paymentReference?: string;
    paymentAmount?: number;
  };
  ticketNumber?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const nationalId = localStorage.getItem('nationalId');
      if (!nationalId) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const refreshUser = async () => {
    setLoading(true);
    await fetchUserData();
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
