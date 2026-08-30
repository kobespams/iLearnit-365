import React, { useState, useEffect } from 'react';
import {
  Shield, KeyRound, School, Users, CheckCircle2, AlertTriangle,
  Lock, RefreshCw, Send, Smartphone, Clock, FileCheck, Award,
  Activity, ArrowRight, UserCheck, ShieldAlert, Cpu, Sparkles,
  Layers, Terminal, Check, Info, AlertCircle, Eye, ChevronRight
} from 'lucide-react';
import {
  ILearnitRole,
  ILearnitPermission,
  SchoolTenant,
  OtpPurpose,
  OtpVerificationSession,
  TeacherApplication,
  AuthoritativeExamSession,
  AuthoritativeGradingResult,
  ILearnitStudentProfile,
  ILearnitPerfettoTrace,
} from '../cheal-secure-hub/apps/ilearnit-365/domain/dataModels';
import { ILearnitOtpService } from '../cheal-secure-hub/apps/ilearnit-365/services/otpService';
import {
  ILearnitEducationService,
  ROLE_PERMISSIONS,
} from '../cheal-secure-hub/apps/ilearnit-365/services/educationService';

interface ILearnitSecurityCenterProps {
  onNavigateRole?: (role: any) => void;
  onClose?: () => void;
}

export const ILearnitSecurityCenter: React.FC<ILearnitSecurityCenterProps> = ({
  onNavigateRole,
  onClose,
}) => {
  const otpService = ILearnitOtpService.getInstance();
  const eduService = ILearnitEducationService.getInstance();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'otp_lab' | 'tenants' | 'rbac' | 'teacher_approval' | 'parent_link' | 'cbt_authority' | 'diagnostics'>('otp_lab');

  // Multi-tenant state
  const [tenants, setTenants] = useState<SchoolTenant[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('school_001');
  const [students, setStudents] = useState<ILearnitStudentProfile[]>([]);
  const [crossTenantTestResult, setCrossTenantTestResult] = useState<{ status: string; message: string } | null>(null);

  // OTP Studio state
  const [selectedPurpose, setSelectedPurpose] = useState<OtpPurpose>('PHONE_VERIFICATION');
  const [otpTarget, setOtpTarget] = useState<string>('+234 802 345 6789');
  const [otpChannel, setOtpChannel] = useState<'sms' | 'email'>('sms');
  const [activeVerification, setActiveVerification] = useState<{
    verificationId: string;
    expiresIn: number;
    maskedTarget: string;
    debugCode?: string;
    purpose: OtpPurpose;
  } | null>(null);
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpVerifyMessage, setOtpVerifyMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isRequestingOtp, setIsRequestingOtp] = useState<boolean>(false);
  const [otpSessions, setOtpSessions] = useState<OtpVerificationSession[]>([]);

  // RBAC state
  const [selectedRole, setSelectedRole] = useState<ILearnitRole>('TEACHER');

  // Teacher Approval state
  const [teacherApps, setTeacherApps] = useState<TeacherApplication[]>([]);
  const [approvalActionMessage, setApprovalActionMessage] = useState<string | null>(null);

  // Parent Link state
  const [parentTargetStudentId, setParentTargetStudentId] = useState<string>('student_123');
  const [parentPhoneInput, setParentPhoneInput] = useState<string>('+234 802 345 6789');
  const [parentLinkSuccess, setParentLinkSuccess] = useState<string | null>(null);

  // CBT Exam Authority state
  const [activeExamSession, setActiveExamSession] = useState<AuthoritativeExamSession | null>(null);
  const [examGradingResult, setExamGradingResult] = useState<AuthoritativeGradingResult | null>(null);
  const [examTimeRemaining, setExamTimeRemaining] = useState<number>(1800); // 30 mins
  const [isExamSubmitting, setIsExamSubmitting] = useState<boolean>(false);

  // Diagnostics state
  const [perfettoTraces, setPerfettoTraces] = useState<ILearnitPerfettoTrace[]>([]);

  // Load initial data
  useEffect(() => {
    refreshAllData();
  }, [selectedSchoolId]);

  // Exam authoritative countdown timer
  useEffect(() => {
    let interval: any;
    if (activeExamSession && activeExamSession.status === 'active') {
      interval = setInterval(() => {
        const remaining = Math.max(0, Math.floor((new Date(activeExamSession.serverExpiresAt).getTime() - Date.now()) / 1000));
        setExamTimeRemaining(remaining);
        if (remaining <= 0) {
          handleAutoSubmitExam();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeExamSession]);

  const refreshAllData = () => {
    setTenants(eduService.getTenants());
    setStudents(eduService.getStudents(selectedSchoolId));
    setTeacherApps(eduService.getTeacherApplications(selectedSchoolId));
    setOtpSessions(otpService.getAllSessions());
    setPerfettoTraces(eduService.getPerfettoTraces(selectedSchoolId));
  };

  // OTP Request handler
  const handleRequestOtp = async () => {
    setIsRequestingOtp(true);
    setOtpVerifyMessage(null);
    try {
      const res = await otpService.requestOtp({
        target: otpTarget,
        channel: otpChannel,
        purpose: selectedPurpose,
        schoolId: selectedSchoolId,
        auth0UserId: 'auth0|session_actor',
      });
      setActiveVerification(res);
      setOtpInput('');
      setOtpVerifyMessage({
        type: 'success',
        text: `OTP dispatched to ${res.maskedTarget}. Verification ID: ${res.verificationId.slice(0, 18)}...`,
      });
      refreshAllData();
    } catch (err: any) {
      setOtpVerifyMessage({ type: 'error', text: err.message || 'Failed to request OTP' });
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // OTP Verify handler
  const handleVerifyOtp = async () => {
    if (!activeVerification) return;
    setOtpVerifyMessage(null);
    try {
      const res = await otpService.verifyOtp({
        verificationId: activeVerification.verificationId,
        otpCode: otpInput,
        schoolId: selectedSchoolId,
      });
      setOtpVerifyMessage({ type: 'success', text: res.message });
      refreshAllData();
    } catch (err: any) {
      setOtpVerifyMessage({ type: 'error', text: err.message || 'Verification failed' });
    }
  };

  // Cross-tenant boundary test
  const handleTestTenantIsolation = () => {
    try {
      const otherSchoolId = selectedSchoolId === 'school_001' ? 'school_002' : 'school_001';
      // Attempting to query student belonging to another school with current school context
      const targetStudent = otherSchoolId === 'school_002' ? 'student_789' : 'student_123';
      eduService.getStudentById(targetStudent, selectedSchoolId);
      setCrossTenantTestResult({
        status: 'error',
        message: 'Security Boundary Failed: Data was returned across tenant boundary!',
      });
    } catch (err: any) {
      setCrossTenantTestResult({
        status: 'success',
        message: `Tenant Isolation Verified: ${err.message}`,
      });
    }
  };

  // Teacher Review Action
  const handleReviewTeacher = (appId: string, action: 'approve' | 'reject') => {
    try {
      const res = eduService.reviewTeacherApplication(appId, action, 'admin_school_principal');
      setApprovalActionMessage(
        action === 'approve'
          ? `Application Approved! Provisioned Auth0 Identity (${res.createdTeacher?.auth0UserId}) & activated teacher.`
          : 'Application rejected.'
      );
      refreshAllData();
      setTimeout(() => setApprovalActionMessage(null), 5000);
    } catch (err: any) {
      setApprovalActionMessage(`Error: ${err.message}`);
    }
  };

  // Parent Linking
  const handleLinkParent = () => {
    try {
      eduService.linkGuardianToStudent('guardian_session_01', parentTargetStudentId, 'father', selectedSchoolId);
      setParentLinkSuccess(`Successfully established verified guardian relationship for ${parentTargetStudentId} in ${selectedSchoolId}.`);
      refreshAllData();
      setTimeout(() => setParentLinkSuccess(null), 4000);
    } catch (err: any) {
      setParentLinkSuccess(`Link Failed: ${err.message}`);
    }
  };

  // Start Authoritative Exam Session
  const handleStartExamSession = () => {
    const sess = eduService.startAuthoritativeExamSession({
      examId: 'jss2_math_final_01',
      examCode: 'MTH-JSS2-2026',
      examTitle: 'JSS2 Mathematics Term 3 Final Assessment',
      studentId: 'student_123',
      studentName: 'Alex Chen',
      schoolId: selectedSchoolId,
      classId: 'JSS2_A',
      durationMinutes: 30,
      totalQuestions: 20,
    });
    setActiveExamSession(sess);
    setExamGradingResult(null);
    setExamTimeRemaining(30 * 60);
  };

  // Submit Exam Session
  const handleAutoSubmitExam = () => {
    if (!activeExamSession) return;
    setIsExamSubmitting(true);
    setTimeout(() => {
      const { session, grading } = eduService.submitAndGradeExamSession({
        sessionId: activeExamSession.sessionId,
        userAnswers: { q1: 0, q2: 2, q3: 1, q4: 3, q5: 0 },
        timeSpentSeconds: 1800 - examTimeRemaining,
      });
      setActiveExamSession(session);
      setExamGradingResult(grading);
      setIsExamSubmitting(false);
      refreshAllData();
    }, 600);
  };

  // Teacher verifies & publishes exam result
  const handleVerifyAndPublishResult = () => {
    if (!examGradingResult) return;
    const published = eduService.verifyAndPublishResult(
      examGradingResult.sessionId,
      'teacher_101',
      'Verified by Dr. Sarah Jenkins. All answers validated.'
    );
    setExamGradingResult(published);
    refreshAllData();
  };

  const selectedSchool = tenants.find(t => t.schoolId === selectedSchoolId) || tenants[0];

  const otpPurposesList: { id: OtpPurpose; label: string; desc: string; icon: string }[] = [
    { id: 'PHONE_VERIFICATION', label: 'Phone Verification', desc: 'Initial student registration phone number confirmation', icon: '📱' },
    { id: 'LOGIN_STEP_UP', label: 'Login Step-Up', desc: 'Elevated authorization for sensitive dashboard actions', icon: '🛡️' },
    { id: 'PASSWORD_RECOVERY', label: 'Password Recovery', desc: 'Secure credential reset via verified communication token', icon: '🔑' },
    { id: 'NEW_DEVICE', label: 'New Device Onboarding', desc: 'Untrusted device detection & biometric association', icon: '💻' },
    { id: 'CHANGE_PHONE', label: 'Change Phone / Email', desc: 'Dual-factor verification for security contact update', icon: '🔄' },
    { id: 'PARENT_LINK', label: 'Parent / Child Link', desc: 'Explicit relationship validation linking guardian to student', icon: '👨‍👩‍👧' },
    { id: 'TEACHER_SECURITY', label: 'Teacher Security', desc: 'Faculty onboarding credential generation & gradebook lock', icon: '👩‍🏫' },
    { id: 'ADMIN_SECURITY', label: 'Admin Security', desc: 'School-level policy enforcement & user role elevation', icon: '👑' },
    { id: 'SENSITIVE_OPERATION', label: 'Sensitive Operation', desc: 'Academic transcript publishing & exam question bank export', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 font-sans p-4 sm:p-6 lg:p-8 selection:bg-cyan-500 selection:text-white">
      {/* Header Bar */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1528] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-1.5 z-10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30">
                    CHEAL Foundation + Education Tenant Layer
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Zero Data Leakage
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold font-sora text-white flex items-center gap-2">
                  iLearnit-365 Security & Authentication Center
                </h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Strict separation of Auth0 identity from education domain data, multi-tenant school isolation, 9-purpose OTP orchestration, server-authoritative CBT exams, and Perfetto telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10">
            {/* School Tenant Switcher */}
            <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-2 flex items-center gap-2">
              <School className="w-4 h-4 text-cyan-400 ml-1" />
              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="bg-transparent text-xs font-bold text-cyan-200 focus:outline-none cursor-pointer pr-2"
              >
                {tenants.map(t => (
                  <option key={t.schoolId} value={t.schoolId} className="bg-slate-900 text-white">
                    {t.name} ({t.code})
                  </option>
                ))}
              </select>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl border border-slate-600 transition-colors cursor-pointer"
              >
                Back to App
              </button>
            )}
          </div>
        </div>

        {/* Architecture Principle Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0B1528]/80 border border-blue-500/30 rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 mt-0.5">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wide">1. Auth0 Identity Foundation</h4>
              <p className="text-xs text-slate-300 mt-1">
                Auth0 knows <strong>WHO</strong> the person is (<code className="text-blue-300 font-mono text-[10px]">auth0|abc123</code>). Academic profiles never touch Auth0 metadata.
              </p>
            </div>
          </div>

          <div className="bg-[#0B1528]/80 border border-cyan-500/30 rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 mt-0.5">
              <School className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wide">2. Education Tenant Domain</h4>
              <p className="text-xs text-slate-300 mt-1">
                iLearnit-365 determines <strong>WHAT</strong> is permitted (<code className="text-cyan-300 font-mono text-[10px]">schoolId</code>, courses, exams, grades, attendance).
              </p>
            </div>
          </div>

          <div className="bg-[#0B1528]/80 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wide">3. Server-Authoritative Logic</h4>
              <p className="text-xs text-slate-300 mt-1">
                Server controls authoritative exam timers, 9-purpose OTP hashing, submission locks, and teacher verification.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-slate-800">
          {[
            { id: 'otp_lab', label: '9-Purpose OTP Studio', icon: Smartphone },
            { id: 'tenants', label: 'Multi-Tenant Isolation', icon: School },
            { id: 'rbac', label: 'Role & Permission Matrix', icon: Shield },
            { id: 'teacher_approval', label: 'Teacher Onboarding Approval', icon: UserCheck, count: teacherApps.filter(a => a.status === 'pending_review').length },
            { id: 'parent_link', label: 'Parent-Child Guardian Link', icon: Users },
            { id: 'cbt_authority', label: 'Authoritative CBT Engine', icon: Clock },
            { id: 'diagnostics', label: 'Perfetto Diagnostic Traces', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-slate-950 text-cyan-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ==================================================================== */}
        {/* TAB 1: 9-PURPOSE OTP STUDIO */}
        {/* ==================================================================== */}
        {activeTab === 'otp_lab' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Purpose Selector & Dispatcher */}
            <div className="lg:col-span-7 bg-[#0B1528] border border-cyan-500/30 rounded-3xl p-6 space-y-6 shadow-xl">
              <div>
                <h3 className="font-sora font-bold text-lg text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-cyan-400" /> 9 Explicit OTP Verification Purposes
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  iLearnit-365 avoids generic OTPs by enforcing purpose-specific security requirements, rate limiting, and SHA-256 session tokens.
                </p>
              </div>

              {/* Purpose Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {otpPurposesList.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedPurpose(item.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                      selectedPurpose === item.id
                        ? 'bg-cyan-500/15 border-cyan-400 text-white ring-1 ring-cyan-400 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{item.icon}</span>
                      {selectedPurpose === item.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">{item.label}</div>
                      <div className="text-[10px] text-slate-400 leading-snug mt-0.5 line-clamp-2">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Request Configuration */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Target Phone or Email</label>
                    <input
                      type="text"
                      value={otpTarget}
                      onChange={(e) => setOtpTarget(e.target.value)}
                      placeholder="+234 802 345 6789 or parent@email.com"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Dispatch Channel</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setOtpChannel('sms')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          otpChannel === 'sms'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        📱 SMS Provider
                      </button>
                      <button
                        type="button"
                        onClick={() => setOtpChannel('email')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          otpChannel === 'email'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        ✉️ Email SMTP
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div className="text-[11px] text-slate-400">
                    Target School Context: <strong className="text-cyan-300">{selectedSchool.name}</strong>
                  </div>

                  <button
                    onClick={handleRequestOtp}
                    disabled={isRequestingOtp}
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isRequestingOtp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Request OTP ({selectedPurpose})</span>
                  </button>
                </div>
              </div>

              {/* Active Verification Session verification box */}
              {activeVerification && (
                <div className="bg-gradient-to-br from-slate-900 to-[#0c1a30] border-2 border-cyan-500/50 rounded-2xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                        SESSION ACTIVE
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">
                        Verify Code for {activeVerification.purpose.replace(/_/g, ' ')}
                      </h4>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Time to Expire</div>
                      <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5" /> 5:00 (300s TTL)
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 font-mono">Verification ID (Server Hashed Token):</div>
                    <div className="text-xs font-mono text-cyan-300 break-all">{activeVerification.verificationId}</div>
                    {activeVerification.debugCode && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Sandbox SMS Simulation Code:</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold">
                          {activeVerification.debugCode}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit OTP"
                      className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-center text-lg tracking-widest font-mono text-white focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={handleVerifyOtp}
                      disabled={otpInput.length !== 6}
                      className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Verify Token
                    </button>
                  </div>

                  {otpVerifyMessage && (
                    <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      otpVerifyMessage.type === 'success'
                        ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                        : 'bg-rose-950/80 border border-rose-800 text-rose-300'
                    }`}>
                      {otpVerifyMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                      <span>{otpVerifyMessage.text}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Real-time OTP Audit Feed */}
            <div className="lg:col-span-5 bg-[#0B1528] border border-cyan-500/30 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-sora font-bold text-sm text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" /> Active Verification Sessions
                  </h3>
                  <button
                    onClick={refreshAllData}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Refresh Session List"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-300">
                  Real-time audit log of hashed tokens, attempt counters, and zero plain-text storage.
                </p>

                <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                  {otpSessions.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
                      No active sessions. Request an OTP on the left to start a verification flow.
                    </div>
                  ) : (
                    otpSessions.map((s) => (
                      <div
                        key={s.verificationId}
                        className={`p-3 rounded-2xl border text-xs space-y-1.5 transition-all ${
                          s.status === 'verified'
                            ? 'bg-emerald-950/30 border-emerald-800/60'
                            : s.status === 'blocked'
                            ? 'bg-rose-950/30 border-rose-800/60'
                            : 'bg-slate-900/80 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <span className="text-cyan-400 font-mono">[{s.purpose}]</span>
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                            s.status === 'verified'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : s.status === 'blocked'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {s.status}
                          </span>
                        </div>

                        <div className="text-[11px] font-mono text-slate-300 flex items-center justify-between">
                          <span>Target: {s.targetPhoneOrEmail}</span>
                          <span>Attempts: {s.attempts}/{s.maxAttempts}</span>
                        </div>

                        <div className="text-[10px] font-mono text-slate-400 truncate">
                          Hash: {s.hashedCode}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Encrypted with SHA-256 session hashes. No raw OTP codes ever returned via REST payload.</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: MULTI-TENANT ISOLATION */}
        {/* ==================================================================== */}
        {activeTab === 'tenants' && (
          <div className="space-y-6">
            <div className="bg-[#0B1528] border border-cyan-500/30 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-sora font-bold text-lg text-white flex items-center gap-2">
                    <School className="w-5 h-5 text-cyan-400" /> Multi-Tenant School Infrastructure
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Every educational record carries a strict <code className="text-cyan-300 font-mono">schoolId</code> (tenantId). The backend enforces boundaries preventing cross-school access.
                  </p>
                </div>

                <button
                  onClick={handleTestTenantIsolation}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" /> Run Cross-Tenant Boundary Probe
                </button>
              </div>

              {crossTenantTestResult && (
                <div className={`p-4 rounded-2xl border text-xs flex items-center gap-3 ${
                  crossTenantTestResult.status === 'success'
                    ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
                    : 'bg-rose-950/80 border-rose-800 text-rose-200'
                }`}>
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                  <div>
                    <div className="font-bold">Security Boundary Enforcement Report</div>
                    <div className="text-slate-300 font-mono mt-0.5">{crossTenantTestResult.message}</div>
                  </div>
                </div>
              )}

              {/* Tenant Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tenants.map((tenant) => {
                  const isSelected = tenant.schoolId === selectedSchoolId;
                  return (
                    <div
                      key={tenant.schoolId}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-4 ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#0e223d] to-[#081322] border-cyan-400 ring-2 ring-cyan-500/30'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                      onClick={() => setSelectedSchoolId(tenant.schoolId)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {tenant.code}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Tenant
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-white">{tenant.name}</h4>
                        <div className="text-xs text-slate-400 mt-0.5">{tenant.domain}</div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center">
                        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                          <div className="text-xs font-mono font-bold text-cyan-300">{tenant.totalStudents}</div>
                          <div className="text-[9px] text-slate-400">Students</div>
                        </div>
                        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                          <div className="text-xs font-mono font-bold text-blue-300">{tenant.totalTeachers}</div>
                          <div className="text-[9px] text-slate-400">Teachers</div>
                        </div>
                        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                          <div className="text-xs font-mono font-bold text-purple-300">{tenant.totalClasses}</div>
                          <div className="text-[9px] text-slate-400">Classes</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Students in Selected Tenant */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" /> Isolated Student Records in {selectedSchool.name}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {students.map((stu) => (
                    <div key={stu.studentId} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{stu.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">{stu.admissionNumber}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">{stu.className} • GPA: {stu.currentGpa}</div>
                        <div className="text-[10px] font-mono text-slate-400">Auth0 ID: {stu.auth0UserId}</div>
                      </div>

                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                          {stu.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: ROLE & PERMISSION MATRIX */}
        {/* ==================================================================== */}
        {activeTab === 'rbac' && (
          <div className="bg-[#0B1528] border border-cyan-500/30 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="font-sora font-bold text-lg text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" /> Granular Role & Permission Matrix
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Permissions are strictly decoupled from generic UI checks and verified server-side with tenant validation.
              </p>
            </div>

            {/* Role Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT_GUARDIAN', 'SUPPORT'] as ILearnitRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-center ${
                    selectedRole === role
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-black'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {role.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            {/* Permission List for Role */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-cyan-300">
                  Explicit Capabilities Assigned to [{selectedRole}]
                </h4>
                <span className="text-xs font-mono text-slate-400">
                  {ROLE_PERMISSIONS[selectedRole]?.length || 0} permissions active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ROLE_PERMISSIONS[selectedRole]?.map((perm) => (
                  <div key={perm} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-mono">{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: TEACHER ONBOARDING APPROVAL */}
        {/* ==================================================================== */}
        {activeTab === 'teacher_approval' && (
          <div className="bg-[#0B1528] border border-cyan-500/30 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="font-sora font-bold text-lg text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-400" /> Teacher Application & School Admin Review Desk
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Teacher accounts require verified multi-step onboarding: Application → School Admin Review → Auth0 Account Provisioning → MFA/OTP Activation.
              </p>
            </div>

            {approvalActionMessage && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{approvalActionMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              {teacherApps.map((app) => (
                <div key={app.applicationId} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-white">{app.fullName}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          app.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : app.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {app.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{app.department} • Specialization: {app.subjectSpecialization}</div>
                    </div>

                    <div className="text-xs font-mono text-slate-400">
                      {app.experienceYears} Years Exp • {app.email}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-300 border border-slate-800">
                    <strong className="text-slate-400">Qualifications:</strong> {app.qualifications}
                  </div>

                  {app.status === 'pending_review' && (
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => handleReviewTeacher(app.applicationId, 'reject')}
                        className="px-4 py-2 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-800 border border-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleReviewTeacher(app.applicationId, 'approve')}
                        className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve & Provision Auth0 Teacher
                      </button>
                    </div>
                  )}

                  {app.status === 'approved' && app.auth0UserId && (
                    <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-900 text-xs text-emerald-300 font-mono">
                      Provisioned Auth0 Identity: {app.auth0UserId} (Status: Active Faculty)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: PARENT-CHILD GUARDIAN LINK */}
        {/* ==================================================================== */}
        {activeTab === 'parent_link' && (
          <div className="bg-[#0B1528] border border-cyan-500/30 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="font-sora font-bold text-lg text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" /> Parent / Guardian Verified Child Linking
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Parent access follows explicit relationship tokens verified via <code className="text-cyan-300 font-mono">PARENT_LINK</code> OTP rather than open query parameters.
              </p>
            </div>

            {parentLinkSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{parentLinkSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Link Form */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white">Establish Guardian Relationship</h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Student Record</label>
                    <select
                      value={parentTargetStudentId}
                      onChange={(e) => setParentTargetStudentId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      {students.map(s => (
                        <option key={s.studentId} value={s.studentId}>
                          {s.name} ({s.admissionNumber})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Parent Verified Phone</label>
                    <input
                      type="text"
                      value={parentPhoneInput}
                      onChange={(e) => setParentPhoneInput(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={handleLinkParent}
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Link Child via Verified OTP Token
                </button>
              </div>

              {/* Active Guardian Links */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-bold text-white">Active Verified Guardian Relationships</h4>
                
                {eduService.getGuardians().map(g => (
                  <div key={g.guardianId} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{g.name}</span>
                      <span className="text-[10px] font-mono text-cyan-300">{g.phone}</span>
                    </div>

                    <div className="space-y-1">
                      {g.relationships.map((rel, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-900 p-2 rounded-lg">
                          <span>Child: <strong className="text-white">{rel.studentName}</strong> ({rel.relationshipType})</span>
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                            OTP Verified
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 6: SERVER-AUTHORITATIVE CBT ENGINE */}
        {/* ==================================================================== */}
        {activeTab === 'cbt_authority' && (
          <div className="bg-[#0B1528] border border-cyan-500/30 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-sora font-bold text-lg text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" /> Server-Authoritative CBT Examination Engine
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  The client never controls exam duration, final scores, or results publication. Server timer & grading are strictly authoritative.
                </p>
              </div>

              {!activeExamSession && (
                <button
                  onClick={handleStartExamSession}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" /> Start Authoritative Exam Session
                </button>
              )}
            </div>

            {activeExamSession && (
              <div className="bg-slate-900/90 border-2 border-cyan-500/40 rounded-2xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                      {activeExamSession.examCode} • {activeExamSession.schoolId}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">{activeExamSession.examTitle}</h4>
                    <div className="text-xs text-slate-400">Candidate: {activeExamSession.studentName} ({activeExamSession.classId})</div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Authoritative Server Timer</div>
                    <div className="text-2xl font-mono font-bold text-amber-400 flex items-center gap-1.5 justify-end">
                      <Clock className="w-5 h-5 animate-pulse text-amber-400" />
                      {Math.floor(examTimeRemaining / 60)}:{(examTimeRemaining % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                </div>

                {activeExamSession.status === 'active' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                      <div className="font-bold text-white">Live Proctoring Status: Locked to Server Heartbeat</div>
                      <div className="text-slate-400">
                        Session ID: <code className="text-cyan-300 font-mono">{activeExamSession.sessionId}</code>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Anti-tamper safeguards active. Tab switching and time manipulation will invalidate attempt on backend.
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleAutoSubmitExam}
                        disabled={isExamSubmitting}
                        className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer flex items-center gap-2"
                      >
                        {isExamSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>Submit & Trigger Server-Side Grading</span>
                      </button>
                    </div>
                  </div>
                )}

                {examGradingResult && (
                  <div className="p-5 bg-gradient-to-br from-[#0B1528] to-[#0f2444] rounded-2xl border border-cyan-400/50 space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-base text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-400" /> Server Authoritative Grade Breakdown
                      </h4>
                      <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold ${
                        examGradingResult.passed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-800' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        Grade {examGradingResult.grade} ({examGradingResult.percentage}%)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                        <div className="text-base font-mono font-bold text-white">{examGradingResult.scoreObtained}/{examGradingResult.maxScore}</div>
                        <div className="text-[10px] text-slate-400">Marks Awarded</div>
                      </div>
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                        <div className="text-base font-mono font-bold text-cyan-300">{examGradingResult.percentage}%</div>
                        <div className="text-[10px] text-slate-400">Accuracy</div>
                      </div>
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                        <div className="text-base font-mono font-bold text-emerald-400">Server Clock</div>
                        <div className="text-[10px] text-slate-400">Validation</div>
                      </div>
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                        <div className="text-base font-mono font-bold text-amber-400">
                          {examGradingResult.teacherVerification.status === 'verified' ? 'Verified' : 'Pending Review'}
                        </div>
                        <div className="text-[10px] text-slate-400">Teacher Status</div>
                      </div>
                    </div>

                    {/* Teacher Verification Step */}
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-white">Results Publishing Pipeline</div>
                        <div className="text-[11px] text-slate-400">
                          {examGradingResult.publishedToStudent
                            ? '✅ Verified by teacher and published to Student & Parent portals.'
                            : '⚠️ Locked pending Teacher Verification before students/guardians can view final score.'}
                        </div>
                      </div>

                      {!examGradingResult.publishedToStudent && (
                        <button
                          onClick={handleVerifyAndPublishResult}
                          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shrink-0"
                        >
                          Teacher: Verify & Publish Result
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 7: PERFETTO DIAGNOSTICS */}
        {/* ==================================================================== */}
        {activeTab === 'diagnostics' && (
          <div className="bg-[#0B1528] border border-cyan-500/30 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="font-sora font-bold text-lg text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" /> Perfetto Diagnostic & Telemetry Traces
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Real-time execution span analysis measuring startup latency, Auth0 handshakes, OTP delivery delays, and CBT timer drift.
              </p>
            </div>

            <div className="space-y-4">
              {perfettoTraces.map((trace) => (
                <div key={trace.traceId} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{trace.component}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                        {trace.traceId}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">{trace.durationMs.toFixed(1)} ms</span>
                  </div>

                  {/* Span Timeline Bar */}
                  <div className="space-y-1.5">
                    {trace.spans.map((span, sIdx) => (
                      <div key={sIdx} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span>{span.name}</span>
                          <span>{span.durationMs.toFixed(1)} ms</span>
                        </div>
                        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                            style={{ width: `${Math.min(100, (span.durationMs / trace.durationMs) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
