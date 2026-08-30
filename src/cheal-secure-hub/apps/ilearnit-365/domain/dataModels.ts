/**
 * iLearnit-365 — Education Application Domain Models & Multi-Tenant Architecture
 * 
 * Architecture Principle:
 * "CHEAL Secure Hub provides the security/identity infrastructure;
 *  iLearnit-365 operates as a protected education tenant/application within it."
 * 
 * 1. Separation of Identity from Education Data:
 *    Auth0 knows WHO the user is (auth0|abc123).
 *    iLearnit-365 knows what they are allowed to do educationally (school, class, subjects, grades).
 * 
 * 2. Multi-Tenant Isolation:
 *    Every record carries a `schoolId` (tenantId). The backend enforces strict school boundaries.
 */

// ----------------------------------------------------
// 1. TENANT & SCHOOL STRUCTURE
// ----------------------------------------------------
export interface SchoolTenant {
  schoolId: string;
  name: string;
  code: string;
  domain: string;
  country: string;
  state: string;
  currentTerm: 1 | 2 | 3;
  academicYear: string;
  address: string;
  adminEmail: string;
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  features: {
    cbtEngineEnabled: boolean;
    smsOtpEnabled: boolean;
    parentPortalEnabled: boolean;
    aiTutorEnabled: boolean;
  };
}

// ----------------------------------------------------
// 2. ROLE HIERARCHY & GRANULAR PERMISSIONS
// ----------------------------------------------------
export type ILearnitRole = 
  | 'SUPER_ADMIN'
  | 'SCHOOL_ADMIN'
  | 'TEACHER'
  | 'STUDENT'
  | 'PARENT_GUARDIAN'
  | 'SUPPORT';

export type ILearnitPermission =
  // Student permissions
  | 'view_courses'
  | 'submit_assignments'
  | 'take_tests'
  | 'view_own_results'
  // Teacher permissions
  | 'view_assigned_students'
  | 'create_assignments'
  | 'grade_assignments'
  | 'verify_exam_results'
  | 'publish_results'
  // School Admin permissions
  | 'manage_students'
  | 'manage_teachers'
  | 'approve_teacher_applications'
  | 'manage_classes'
  | 'view_school_reports'
  // Parent permissions
  | 'view_linked_children'
  | 'view_child_results'
  | 'view_child_attendance'
  // Super Admin / Support
  | 'manage_tenants'
  | 'configure_security_policy'
  | 'view_system_diagnostics'
  | 'audit_security_logs';

export interface UserPermissionProfile {
  auth0UserId: string;
  role: ILearnitRole;
  schoolId: string;
  permissions: ILearnitPermission[];
  assignedClassIds?: string[];
  assignedSubjectIds?: string[];
  linkedStudentIds?: string[];
}

// ----------------------------------------------------
// 3. SEPARATED PROFILES (iLearnit-365 vs Auth0)
// ----------------------------------------------------
export interface ILearnitStudentProfile {
  studentId: string;
  auth0UserId: string;
  schoolId: string;
  admissionNumber: string;
  name: string;
  email: string;
  phone?: string;
  classId: string;
  className: string;
  status: 'pending_verification' | 'active' | 'suspended';
  currentGpa: number;
  overallScore: number;
  attendancePercentage: number;
  termPosition: string;
  guardianIds: string[];
  enrolledSubjectIds: string[];
  createdAt: string;
  verifiedAt?: string;
}

export interface ILearnitTeacherProfile {
  teacherId: string;
  auth0UserId: string;
  schoolId: string;
  staffId: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending_admin_approval' | 'active' | 'suspended';
  department: string;
  primarySubject: string;
  assignedClasses: string[];
  createdAt: string;
  approvedByAdminId?: string;
  approvedAt?: string;
}

export interface ILearnitGuardianProfile {
  guardianId: string;
  auth0UserId: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'unverified';
  relationships: {
    studentId: string;
    studentName: string;
    schoolId: string;
    relationshipType: 'father' | 'mother' | 'legal_guardian' | 'sponsor';
    verifiedViaOtp: boolean;
    linkedAt: string;
  }[];
}

export interface TeacherApplication {
  applicationId: string;
  schoolId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  subjectSpecialization: string;
  experienceYears: number;
  qualifications: string;
  status: 'pending_review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewRemarks?: string;
  auth0UserId?: string;
}

// ----------------------------------------------------
// 4. OTP ORCHESTRATION & 9 EXPLICIT PURPOSES
// ----------------------------------------------------
export type OtpPurpose =
  | 'PHONE_VERIFICATION'
  | 'LOGIN_STEP_UP'
  | 'PASSWORD_RECOVERY'
  | 'NEW_DEVICE'
  | 'CHANGE_PHONE'
  | 'PARENT_LINK'
  | 'TEACHER_SECURITY'
  | 'ADMIN_SECURITY'
  | 'SENSITIVE_OPERATION';

export interface OtpVerificationSession {
  verificationId: string;
  auth0UserId?: string;
  targetPhoneOrEmail: string;
  channel: 'sms' | 'email';
  purpose: OtpPurpose;
  schoolId?: string;
  hashedCode: string; // SHA-256 hash (never plain text)
  rawCodeDebug?: string; // Debug/simulator helper only in non-prod
  attempts: number;
  maxAttempts: number;
  status: 'pending' | 'verified' | 'expired' | 'blocked';
  expiresAt: string;
  createdAt: string;
  verifiedAt?: string;
  associatedMetadata?: Record<string, any>;
}

export interface OtpRequestPayload {
  target: string;
  channel: 'sms' | 'email';
  purpose: OtpPurpose;
  auth0UserId?: string;
  schoolId?: string;
  metadata?: Record<string, any>;
}

export interface OtpVerifyPayload {
  verificationId: string;
  otpCode: string;
  auth0UserId?: string;
  schoolId?: string;
}

// ----------------------------------------------------
// 5. SERVER-AUTHORITATIVE CBT EXAMINATION ENGINE
// ----------------------------------------------------
export interface ExamSubmissionPayload {
  examId: string;
  examCode: string;
  studentId: string;
  schoolId?: string;
  totalQuestions: number;
  timeSpentSeconds: number;
  passed: boolean;
  score?: number;
}

export interface AuthoritativeExamSession {
  sessionId: string;
  examId: string;
  examCode: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  schoolId: string;
  classId: string;
  attempt: number;
  totalQuestions: number;
  durationMinutes: number;
  serverStartedAt: string;
  serverExpiresAt: string;
  status: 'active' | 'submitted' | 'time_expired' | 'locked_for_grading';
  answers: Record<string, number | null>; // Question ID -> Selected option index
  timeSpentSeconds: number;
  proctorInfractions: {
    timestamp: string;
    type: 'tab_blur' | 'fullscreen_exit' | 'multiple_faces' | 'ip_change';
    details: string;
  }[];
}

export interface AuthoritativeGradingResult {
  sessionId: string;
  examId: string;
  studentId: string;
  schoolId: string;
  scoreObtained: number;
  maxScore: number;
  percentage: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  passed: boolean;
  gradedAt: string;
  topicBreakdown: Record<string, { correct: number; total: number; percentage: number }>;
  teacherVerification: {
    status: 'pending_teacher_review' | 'verified' | 'overridden';
    verifiedByTeacherId?: string;
    verifiedAt?: string;
    teacherNotes?: string;
  };
  publishedToStudent: boolean;
  publishedAt?: string;
}

// ----------------------------------------------------
// 6. DEVICE SECURITY & TRUSTED DEVICE STATE
// ----------------------------------------------------
export interface DeviceSecurityRecord {
  deviceId: string;
  auth0UserId: string;
  schoolId: string;
  deviceName: string;
  platform: 'Android' | 'iOS' | 'Web' | 'Desktop';
  osVersion: string;
  ipAddress: string;
  trustState: 'trusted' | 'step_up_required' | 'quarantined';
  riskScore: number; // 0 to 100 (0 = Lowest Risk, 100 = Compromised)
  lastSeenAt: string;
  registeredAt: string;
  signals: {
    isRootedOrJailbroken: boolean;
    isEmulator: boolean;
    biometricsActive: boolean;
    appTamperCheckPassed: boolean;
  };
}

// ----------------------------------------------------
// 7. PERFETTO DIAGNOSTICS FOR ILEARNIT-365
// ----------------------------------------------------
export interface ILearnitPerfettoTrace {
  traceId: string;
  timestamp: string;
  schoolId: string;
  component: 'AppStartup' | 'Auth0Handshake' | 'OtpVerification' | 'CourseLoader' | 'CBTAuthoritativeTimer' | 'FirestoreQuery';
  durationMs: number;
  status: 'optimal' | 'warning' | 'critical';
  spans: {
    name: string;
    durationMs: number;
    startOffsetMs: number;
  }[];
  metadata: Record<string, any>;
}
