import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { nationalId, documents } = await request.json();

    if (!nationalId) {
      return NextResponse.json({ error: 'National ID is required' }, { status: 400 });
    }

    // Find user by nationalId
    const user = await User.findOne({ nationalId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update application documents - convert status to boolean
    user.applicationDocuments = {
      hasPassport: documents.passportStatus === 'have',
      passportUpload: documents.passportUpload,
      hasBirthCertificate: documents.birthCertificateStatus === 'have',
      birthCertificateUpload: documents.birthCertificateUpload,
      hasMarriageCertificate: documents.marriageCertificateStatus === 'have',
      marriageCertificateUpload: documents.marriageCertificateUpload,
      hasCertificateOfGoodConduct: documents.certificateOfGoodConductStatus === 'have',
      certificateOfGoodConductUpload: documents.certificateOfGoodConductUpload,
      hasKraTaxCompliance: documents.kraTaxComplianceStatus === 'have',
      kraTaxComplianceUpload: documents.kraTaxComplianceUpload,
      hasApostille: documents.apostilleStatus === 'have',
      apostilleUpload: documents.apostilleUpload,
      hasYellowFeverCertificate: documents.yellowFeverCertificateStatus === 'have',
      yellowFeverCertificateUpload: documents.yellowFeverCertificateUpload,
      hasMedicalExamCertificate: documents.medicalExamCertificateStatus === 'have',
      medicalExamCertificateUpload: documents.medicalExamCertificateUpload,
      hasTbTestCertificate: documents.tbTestCertificateStatus === 'have',
      tbTestCertificateUpload: documents.tbTestCertificateUpload,
      hasHivTestCertificate: documents.hivTestCertificateStatus === 'have',
      hivTestCertificateUpload: documents.hivTestCertificateUpload,
      hasEmploymentContract: documents.employmentContractStatus === 'have',
      employmentContractUpload: documents.employmentContractUpload,
      hasEmployerIntroductionLetter: documents.employerIntroductionLetterStatus === 'have',
      employerIntroductionLetterUpload: documents.employerIntroductionLetterUpload,
      hasInvitationLetter: documents.invitationLetterStatus === 'have',
      invitationLetterUpload: documents.invitationLetterUpload,
    };

    // Update application status
    user.applicationStatus = {
      ...user.applicationStatus,
      submitted: true,
      submittedDate: new Date(),
    };

    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Application documents saved successfully' 
    });

  } catch (error) {
    console.error('Error saving application documents:', error);
    return NextResponse.json({ 
      error: 'Failed to save application documents' 
    }, { status: 500 });
  }
}
