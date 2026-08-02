import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
  },
  nationalId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  fullName: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  nationalIdFront: {
    type: String,
    required: false,
  },
  nationalIdBack: {
    type: String,
    required: false,
  },
  passport: {
    type: String,
    required: false,
  },
  yellowFever: {
    type: String,
    required: false,
  },
  drivingLicense: {
    type: String,
    required: false,
  },
  jobPreferences: {
    preferredCategory: String,
    preferredLocation: String,
    expectedSalary: String,
    experience: String,
    skills: [String],
    availability: String,
    notes: String,
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  // Application Documents
  applicationDocuments: {
    // Document status fields
    hasPassport: { type: Boolean, default: false },
    hasBirthCertificate: { type: Boolean, default: false },
    hasMarriageCertificate: { type: Boolean, default: false },
    hasCertificateOfGoodConduct: { type: Boolean, default: false },
    hasKraTaxCompliance: { type: Boolean, default: false },
    hasApostille: { type: Boolean, default: false },
    hasYellowFeverCertificate: { type: Boolean, default: false },
    hasMedicalExamCertificate: { type: Boolean, default: false },
    hasTbTestCertificate: { type: Boolean, default: false },
    hasHivTestCertificate: { type: Boolean, default: false },
    hasEmploymentContract: { type: Boolean, default: false },
    hasEmployerIntroductionLetter: { type: Boolean, default: false },
    hasInvitationLetter: { type: Boolean, default: false },
    // Document upload fields
    passportUpload: String,
    birthCertificateUpload: String,
    marriageCertificateUpload: String,
    certificateOfGoodConductUpload: String,
    kraTaxComplianceUpload: String,
    apostilleUpload: String,
    yellowFeverCertificateUpload: String,
    medicalExamCertificateUpload: String,
    tbTestCertificateUpload: String,
    hivTestCertificateUpload: String,
    employmentContractUpload: String,
    employerIntroductionLetterUpload: String,
    invitationLetterUpload: String,
  },
  // Application status
  applicationStatus: {
    submitted: { type: Boolean, default: false },
    submittedDate: Date,
    appointmentBooked: { type: Boolean, default: false },
    appointmentDate: Date,
    appointmentTime: String,
    paymentStatus: { type: String, enum: ['pending', 'pending_verification', 'completed', 'failed'], default: 'pending' },
    paymentReference: String,
    paymentAmount: { type: Number, default: 1500 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.index({ nationalId: 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);
