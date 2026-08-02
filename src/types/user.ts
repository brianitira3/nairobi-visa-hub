export interface ApplicationDocuments {
  hasPassport: boolean;
  passportUpload: string;
  hasBirthCertificate: boolean;
  birthCertificateUpload: string;
  hasMarriageCertificate: boolean;
  marriageCertificateUpload: string;
  hasCertificateOfGoodConduct: boolean;
  certificateOfGoodConductUpload: string;
  hasKraTaxCompliance: boolean;
  kraTaxComplianceUpload: string;
  hasApostille: boolean;
  apostilleUpload: string;
  hasYellowFeverCertificate: boolean;
  yellowFeverCertificateUpload: string;
  hasMedicalExamCertificate: boolean;
  medicalExamCertificateUpload: string;
  hasTbTestCertificate: boolean;
  tbTestCertificateUpload: string;
  hasHivTestCertificate: boolean;
  hivTestCertificateUpload: string;
  hasEmploymentContract: boolean;
  employmentContractUpload: string;
  hasEmployerIntroductionLetter: boolean;
  employerIntroductionLetterUpload: string;
  hasInvitationLetter: boolean;
  invitationLetterUpload: string;
  hasAcademicCertificates: boolean;
  academicCertificatesUpload: string;
}

export interface ApplicationStatus {
  submitted: boolean;
  submittedDate: Date | null;
  appointmentBooked: boolean;
  appointmentDate: Date | null;
  appointmentTime: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentReference: string;
  paymentAmount: number;
}

export interface User {
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
  savedJobs?: any[];
  applicationDocuments?: ApplicationDocuments;
  applicationStatus?: ApplicationStatus;
  createdAt?: Date;
}
