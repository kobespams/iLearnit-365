import React, { useState, useEffect } from 'react';
import { UserRole, StudentDetail, RegisteredUser, SecurityAuditRecord } from '../types';
import { 
  ShieldCheck, 
  KeyRound, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  Check, 
  UserPlus, 
  Lock, 
  Mail, 
  User, 
  BookMarked, 
  GraduationCap, 
  Users, 
  RefreshCw, 
  Copy, 
  Eye, 
  EyeOff, 
  FileCheck, 
  Printer, 
  CheckCircle, 
  Database,
  Building2,
  Phone,
  BookOpen,
  Award,
  LogIn,
  Layers,
  HeartHandshake,
  BadgeCheck,
  Target,
  Clock,
  Terminal,
  Cpu,
  Fingerprint,
  Zap,
  Download,
  Share2,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { 
  generateRealtimePin, 
  generateRecoveryKey, 
  registerNewUser, 
  getRegisteredUsers, 
  getAuditLogs, 
  userToStudentDetail 
} from '../services/authStorage';

interface RegistrationPageProps {
  onRegistrationComplete: (role: UserRole, student: StudentDetail) => void;
  onNavigateToLogin: () => void;
  onNavigateToHub: () => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  onRegistrationComplete,
  onNavigateToLogin,
  onNavigateToHub
}) => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'parent'>('student');
  
  // Real-time PIN generation state
  const [liveGeneratedPin, setLiveGeneratedPin] = useState<string>('');
  const [pinMode, setPinMode] = useState<'auto' | 'custom'>('auto');
  const [customPinInput, setCustomPinInput] = useState<string>('');
  const [isPinVisible, setIsPinVisible] = useState<boolean>(true);
  const [isPinCopied, setIsPinCopied] = useState<boolean>(false);
  const [isGeneratingPin, setIsGeneratingPin] = useState<boolean>(false);

  // Common Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Student-specific Fields
  const [gradeLevel, setGradeLevel] = useState('Primary 5 (Basic 5)');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [studyGoal, setStudyGoal] = useState('Master Primary & Secondary Math, Science & IT');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Mathematics',
    'Basic Science & Technology',
    'English Studies & Reading',
    'Computer Studies & IT'
  ]);

  // Teacher-specific Fields
  const [staffId, setStaffId] = useState('');
  const [teachingSubject, setTeachingSubject] = useState('Mathematics & Quantitative Reasoning');
  const [teacherTitle, setTeacherTitle] = useState('Mr.');
  const [teacherClasses, setTeacherClasses] = useState<string[]>([
    'JSS 1 Classes',
    'JSS 2 Classes',
    'JSS 3 Classes'
  ]);

  // Parent-specific Fields
  const [relationship, setRelationship] = useState('Mother');
  const [childName, setChildName] = useState('');
  const [childGrade, setChildGrade] = useState('JSS1 - Junior Secondary 1');
  const [childPin, setChildPin] = useState('');

  // Status & UI States
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredUserResult, setRegisteredUserResult] = useState<RegisteredUser | null>(null);
  const [showAuditLogsModal, setShowAuditLogsModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditRecord[]>([]);
  const [registeredUsersList, setRegisteredUsersList] = useState<RegisteredUser[]>([]);

  // Initialize live PIN on mount
  useEffect(() => {
    handleRegeneratePin();
    refreshRegisteredData();
  }, []);

  const refreshRegisteredData = () => {
    setRegisteredUsersList(getRegisteredUsers());
    setAuditLogs(getAuditLogs());
  };

  const handleRegeneratePin = () => {
    setIsGeneratingPin(true);
    setTimeout(() => {
      const pin = generateRealtimePin();
      setLiveGeneratedPin(pin);
      setIsGeneratingPin(false);
    }, 250);
  };

  const handleCopyPin = (pinToCopy: string) => {
    navigator.clipboard.writeText(pinToCopy);
    setIsPinCopied(true);
    setTimeout(() => setIsPinCopied(false), 2000);
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: 'Not entered', color: 'bg-slate-700' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-cyan-500' };
      case 4:
        return { score: 100, label: 'Strong & Quantum Safe', color: 'bg-emerald-400' };
      default:
        return { score: 10, label: 'Very Weak', color: 'bg-rose-600' };
    }
  };

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const toggleTeacherClass = (cls: string) => {
    if (teacherClasses.includes(cls)) {
      if (teacherClasses.length > 1) {
        setTeacherClasses(teacherClasses.filter(c => c !== cls));
      }
    } else {
      setTeacherClasses([...teacherClasses, cls]);
    }
  };

  const activePin = pinMode === 'auto' ? liveGeneratedPin : customPinInput;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation Protocols
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (pinMode === 'custom' && (!customPinInput || customPinInput.length !== 4 || !/^\d{4}$/.test(customPinInput))) {
      setErrorMessage('Custom PIN must be exactly 4 numeric digits.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the iLearnit-365 Digital Security and Integrity Agreement.');
      return;
    }

    setIsSubmitting(true);

    try {
      const displayName = selectedRole === 'teacher' && !fullName.startsWith(teacherTitle) 
        ? `${teacherTitle} ${fullName.trim()}` 
        : fullName.trim();

      const { user } = registerNewUser({
        name: displayName,
        email,
        role: selectedRole,
        gradeLevel: selectedRole === 'student' 
          ? gradeLevel 
          : selectedRole === 'teacher' 
          ? `Faculty • ${teachingSubject}` 
          : `Parent of ${childName || 'Student'} (${childGrade})`,
        schoolName: schoolName.trim() || 'iLearnit-365 Digital Academy',
        phone: phone.trim() || parentPhone.trim(),
        parentName: selectedRole === 'student' ? parentName.trim() : undefined,
        parentPhone: selectedRole === 'student' ? parentPhone.trim() : (selectedRole === 'parent' ? phone.trim() : undefined),
        teachingSubject: selectedRole === 'teacher' ? teachingSubject : undefined,
        staffId: selectedRole === 'teacher' ? (staffId.trim() || `TCH-${Math.floor(1000 + Math.random() * 9000)}`) : undefined,
        relationship: selectedRole === 'parent' ? relationship : undefined,
        linkedChildName: selectedRole === 'parent' ? childName.trim() : undefined,
        linkedChildPin: selectedRole === 'parent' ? childPin.trim() : undefined,
        studyGoal: selectedRole === 'student' ? studyGoal : undefined,
        selectedSubjects: selectedRole === 'student' ? selectedSubjects : undefined,
        providedPin: activePin,
      });

      setRegisteredUserResult(user);
      refreshRegisteredData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check your data and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLaunchDashboard = () => {
    if (!registeredUserResult) return;
    const studentObj = userToStudentDetail(registeredUserResult);
    onRegistrationComplete(registeredUserResult.role, studentObj);
  };

  const strength = getPasswordStrength();

  return (
    <div className="relative min-h-screen bg-[#070B19] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden pb-20">
      {/* Dynamic Digital Cyber Grid & Glow Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(30,58,138,0.35),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_30%,rgba(6,182,212,0.12),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_75%,rgba(202,138,4,0.10),transparent_45%)]" />
        
        {/* Animated Cyber Grid Matrix */}
        <div 
          className="absolute inset-0 opacity-[0.07]" 
          style={{
            backgroundImage: `linear-gradient(to right, #00f2fe 1px, transparent 1px), linear-gradient(to bottom, #00f2fe 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Cyber Scanning Ray */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={onNavigateToHub}
            className="group flex items-center gap-2 text-xs font-mono font-semibold text-slate-400 hover:text-cyan-300 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portals</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAuditLogsModal(true)}
              className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Audit Ledger ({registeredUsersList.length})</span>
            </button>

            <button
              onClick={onNavigateToLogin}
              className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 px-3.5 py-1.5 rounded-lg transition cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        </div>

        {/* HERO BANNER WITH 3D LOGO EMBLEM */}
        <div className="text-center space-y-4 mb-10">
          {/* Official 3D Emblem Container with Digital Animation Scanline & Neon Pulse */}
          <div className="relative inline-block mx-auto group">
            {/* Outer ambient holographic glow */}
            <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/30 via-blue-600/30 to-amber-500/30 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none animate-pulse-glow" />
            
            {/* Cyber Container with Scanline & Neon Glow */}
            <div className="cyber-logo-container relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl shadow-2xl p-1.5 transition-transform duration-300 group-hover:scale-105">
              {/* Scanline Sweep Overlay */}
              <div className="cyber-scanline" />

              {/* Corner Tech Brackets */}
              <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
              <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />
              <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400 z-20 pointer-events-none" />
              <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400 z-20 pointer-events-none" />

              <img
                src="/src/assets/images/ilearnit_logo_1786816502338.jpg"
                alt="iLearnit-365 Digital Academy Emblem"
                referrerPolicy="no-referrer"
                className="relative z-10 w-full h-full object-cover rounded-xl sm:rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none z-10" />
            </div>

            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-mono text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg border border-white/40 flex items-center gap-1 z-30">
              <Sparkles className="w-3 h-3 text-slate-950" /> 365 DIGITAL ID
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3.5 py-1 rounded-full mb-2">
              <Cpu className="w-3.5 h-3.5 animate-spin-slow text-amber-400" />
              <span>Digital Security Onboarding Gateway</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-sora text-white tracking-tight leading-tight">
              iLearnit<span className="text-[#CC9A2E]">-365</span> Registration
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-mono max-w-xl mx-auto mt-2">
              <span className="text-amber-400 font-bold">LEARN • GROW • ACHIEVE</span> — Generate your cryptographic 4-digit Student Access PIN and enroll in the e-learning cloud ecosystem.
            </p>
          </div>
        </div>

        {/* SUCCESS CONFIRMATION MODAL / SCREEN */}
        {registeredUserResult ? (
          <div className="max-w-2xl mx-auto bg-slate-900/90 backdrop-blur-2xl border-2 border-emerald-400/50 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-emerald-500/20 text-center space-y-6 animate-fadeIn relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl" />

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <BadgeCheck className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 border border-emerald-400/30 px-3 py-1 rounded-full">
                ✓ Registration &amp; PIN Issued
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-sora text-white">
                Welcome to iLearnit-365, {registeredUserResult.name}!
              </h2>
              <p className="text-xs text-slate-300">
                Your profile has been cryptographically secured in the registry. Keep your credentials safe.
              </p>
            </div>

            {/* Official Digital Pass Credentials Card */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 text-left space-y-4 relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-400/30 bg-slate-900 p-0.5">
                    <img
                      src="/src/assets/images/ilearnit_logo_1786816502338.jpg"
                      alt="Logo"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain rounded-md"
                    />
                  </div>
                  <div>
                    <div className="font-sora font-bold text-sm text-white">iLearnit-365 Pass</div>
                    <div className="text-[10px] font-mono text-slate-400">{registeredUserResult.schoolName}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30">
                  {registeredUserResult.role}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Account ID</span>
                  <div className="text-slate-200 font-bold truncate">{registeredUserResult.id}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Registered Email</span>
                  <div className="text-slate-200 font-bold truncate">{registeredUserResult.email}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Academic Group</span>
                  <div className="text-slate-200 font-bold">{registeredUserResult.gradeLevel}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Official Student PIN</span>
                  <div className="text-emerald-400 font-black text-lg tracking-widest">{registeredUserResult.pin}</div>
                </div>
              </div>

              <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-3 text-[11px] text-amber-300/90 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Recovery Key: <strong className="font-mono">{registeredUserResult.recoveryKey}</strong></span>
                </div>
                <button
                  onClick={() => handleCopyPin(`iLearnit-365 Credentials:\nName: ${registeredUserResult.name}\nEmail: ${registeredUserResult.email}\nPIN: ${registeredUserResult.pin}\nRecovery: ${registeredUserResult.recoveryKey}`)}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2.5 py-1 rounded text-[10px] font-mono font-bold transition cursor-pointer"
                >
                  {isPinCopied ? 'Copied ✓' : 'Copy All'}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleLaunchDashboard}
                className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:opacity-95 text-slate-950 font-sora font-extrabold text-sm py-4 rounded-2xl transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch {registeredUserResult.role === 'teacher' ? 'Teacher Portal' : registeredUserResult.role === 'parent' ? 'Parent Portal' : 'Student Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setRegisteredUserResult(null);
                  handleRegeneratePin();
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs px-5 py-4 rounded-2xl transition border border-slate-700 cursor-pointer"
              >
                Register Another User
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM INTERFACE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: REAL-TIME PIN & SECURITY AUDIT PREVIEW */}
            <div className="lg:col-span-5 space-y-6">
              {/* REAL-TIME PIN GENERATOR TERMINAL */}
              <div className="relative bg-slate-900/90 backdrop-blur-xl border border-cyan-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      Real-Time PIN Engine
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Token
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Every account receives a collision-safe 4-digit PIN used for fast parental verification, exam token validation, and instant sign-in.
                </p>

                {/* PIN DISPLAY CONTAINER */}
                <div className="bg-slate-950 border-2 border-cyan-500/30 rounded-2xl p-6 text-center space-y-3 relative shadow-inner">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    {pinMode === 'auto' ? 'Generated Student PIN' : 'Custom 4-Digit PIN'}
                  </div>

                  {pinMode === 'auto' ? (
                    <div className="flex items-center justify-center gap-3">
                      {isPinVisible ? (
                        <div className="font-mono font-black text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 tracking-[0.25em] pl-[0.25em]">
                          {liveGeneratedPin || '----'}
                        </div>
                      ) : (
                        <div className="font-mono font-black text-4xl sm:text-5xl text-slate-600 tracking-[0.25em] pl-[0.25em]">
                          ••••
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="0000"
                      value={customPinInput}
                      onChange={(e) => setCustomPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="w-full bg-slate-900 border border-cyan-500/50 rounded-xl py-2 px-4 text-center font-mono font-black text-3xl sm:text-4xl text-cyan-300 tracking-[0.3em] outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  )}

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsPinVisible(!isPinVisible)}
                      className="text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800 transition cursor-pointer"
                    >
                      {isPinVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{isPinVisible ? 'Hide' : 'Show'}</span>
                    </button>

                    {pinMode === 'auto' && (
                      <button
                        type="button"
                        onClick={handleRegeneratePin}
                        disabled={isGeneratingPin}
                        className="text-cyan-400 hover:text-cyan-200 text-xs font-mono flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 transition cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${isGeneratingPin ? 'animate-spin' : ''}`} />
                        <span>Regenerate</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCopyPin(activePin)}
                      className="text-amber-400 hover:text-amber-200 text-xs font-mono flex items-center gap-1 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/30 transition cursor-pointer"
                    >
                      {isPinCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isPinCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* PIN Mode Selector Pill */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPinMode('auto')}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      pinMode === 'auto'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-3 h-3" /> Auto Real-Time
                  </button>

                  <button
                    type="button"
                    onClick={() => setPinMode('custom')}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      pinMode === 'custom'
                        ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 font-black shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Fingerprint className="w-3 h-3" /> Set Custom PIN
                  </button>
                </div>

                {/* Security Feature Badges */}
                <div className="space-y-2 pt-2 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Cross-device 4-digit login enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Parental grade book access key</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CBT examination token integration</span>
                  </div>
                </div>
              </div>

              {/* SECURITY PROMISE CARD */}
              <div className="bg-gradient-to-br from-slate-900/80 to-indigo-950/80 border border-blue-500/20 rounded-3xl p-6 text-xs text-slate-300 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold font-sora text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Educational Privacy Protocol</span>
                </div>
                <p className="leading-relaxed">
                  iLearnit-365 employs end-to-end client tokenization and local session isolation. All practice logs, diagnostic assessments, and grade records are protected under student-first privacy guidelines.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: REGISTRATION FORM MATRIX */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-9 shadow-2xl space-y-6">
                {/* ROLE SELECTOR TABS */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-2 font-bold">
                    Select Account Role:
                  </label>
                  <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('student')}
                      className={`py-3 px-2 rounded-xl text-xs font-sora font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                        selectedRole === 'student'
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Student</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('teacher')}
                      className={`py-3 px-2 rounded-xl text-xs font-sora font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                        selectedRole === 'teacher'
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Educator</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('parent')}
                      className={`py-3 px-2 rounded-xl text-xs font-sora font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                        selectedRole === 'parent'
                          ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Parent</span>
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs p-4 rounded-2xl flex items-start gap-3 animate-shake">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-5">
                  {/* FULL NAME & EMAIL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        {selectedRole === 'teacher' ? 'Full Name & Title' : 'Full Name'} <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={selectedRole === 'student' ? 'e.g., Alex Chukwuma' : selectedRole === 'teacher' ? 'e.g., Sarah Jenkins' : 'e.g., Marcus Adeleke'}
                          className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        Email Address <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="learner@ilearnit365.edu"
                          className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PASSWORD & STRENGTH METER */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Create Password <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Gauge */}
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400">
                          <span>Entropy Score</span>
                          <span className="font-bold">{strength.label}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${strength.color} transition-all duration-300`}
                            style={{ width: `${strength.score}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SCHOOL / INSTITUTION & PHONE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        School / Academy
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          value={schoolName}
                          onChange={(e) => setSchoolName(e.target.value)}
                          placeholder="e.g., King's College Lagos"
                          className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        Phone / SMS Contact
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+234 800 000 0000"
                          className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ROLE SPECIFIC FIELDS: STUDENT */}
                  {selectedRole === 'student' && (
                    <div className="bg-slate-950/60 border border-blue-500/20 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-400 font-sora">
                        <GraduationCap className="w-4 h-4" />
                        <span>Academic Level &amp; Subjects</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1.5">Class / Grade Level</label>
                          <select
                            value={gradeLevel}
                            onChange={(e) => setGradeLevel(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                          >
                            <option value="Primary 4 (Basic 4)">Primary 4 (Basic 4)</option>
                            <option value="Primary 5 (Basic 5)">Primary 5 (Basic 5)</option>
                            <option value="Primary 6 (Basic 6)">Primary 6 (Basic 6)</option>
                            <option value="JSS 1 (Junior Sec 1)">JSS 1 (Junior Sec 1)</option>
                            <option value="JSS 2 (Junior Sec 2)">JSS 2 (Junior Sec 2)</option>
                            <option value="JSS 3 (Junior Sec 3)">JSS 3 (Junior Sec 3)</option>
                            <option value="SSS 1 (Senior Sec 1)">SSS 1 (Senior Sec 1)</option>
                            <option value="SSS 2 (Senior Sec 2)">SSS 2 (Senior Sec 2)</option>
                            <option value="SSS 3 (Senior Sec 3)">SSS 3 (Senior Sec 3)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1.5">Parent / Guardian Name</label>
                          <input
                            type="text"
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            placeholder="e.g., Mrs. Chukwuma"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-2">
                          Select Focus Curricula:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            'Mathematics',
                            'Basic Science & Technology',
                            'English Studies & Reading',
                            'Computer Studies & IT',
                            'Cybersecurity Basics',
                            'CCA & Cultural Arts'
                          ].map((subj) => (
                            <button
                              type="button"
                              key={subj}
                              onClick={() => toggleSubject(subj)}
                              className={`text-[11px] font-mono px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                                selectedSubjects.includes(subj)
                                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {selectedSubjects.includes(subj) ? '✓ ' : '+ '} {subj}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ROLE SPECIFIC FIELDS: TEACHER */}
                  {selectedRole === 'teacher' && (
                    <div className="bg-slate-950/60 border border-emerald-500/20 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-sora">
                        <BookOpen className="w-4 h-4" />
                        <span>Faculty &amp; Teaching Specialization</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1.5">Primary Subject Area</label>
                          <input
                            type="text"
                            value={teachingSubject}
                            onChange={(e) => setTeachingSubject(e.target.value)}
                            placeholder="e.g., Mathematics &amp; Physics"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1.5">Staff / Teacher ID</label>
                          <input
                            type="text"
                            value={staffId}
                            onChange={(e) => setStaffId(e.target.value)}
                            placeholder="e.g., TCH-8492"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ROLE SPECIFIC FIELDS: PARENT */}
                  {selectedRole === 'parent' && (
                    <div className="bg-slate-950/60 border border-amber-500/20 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-sora">
                        <Users className="w-4 h-4" />
                        <span>Link Student / Ward Account</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1.5">Relationship</label>
                          <select
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                          >
                            <option value="Mother">Mother</option>
                            <option value="Father">Father</option>
                            <option value="Guardian">Guardian</option>
                            <option value="Sponsor">Sponsor</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1.5">Child's Name</label>
                          <input
                            type="text"
                            value={childName}
                            onChange={(e) => setChildName(e.target.value)}
                            placeholder="e.g., Alex Chukwuma"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1.5">Child's 4-Digit PIN</label>
                          <input
                            type="text"
                            maxLength={4}
                            value={childPin}
                            onChange={(e) => setChildPin(e.target.value)}
                            placeholder="e.g., 8492"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-400 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TERMS CHECKBOX */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                      />
                      <span className="text-xs text-slate-400 leading-relaxed font-mono">
                        I agree to the <strong className="text-slate-200">iLearnit-365 Digital Security Code</strong>, academic integrity guidelines, and allow real-time 4-digit PIN authentication for my account.
                      </span>
                    </label>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:opacity-95 text-slate-950 font-sora font-extrabold text-sm py-4 rounded-2xl transition shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Encrypting &amp; Minting PIN...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 text-slate-950" />
                        <span>Complete Registration &amp; Issue PIN</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AUDIT LOGS MODAL */}
      {showAuditLogsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <h3 className="font-sora font-bold text-base text-white">Security Ledger &amp; Registered Tokens</h3>
              </div>
              <button
                onClick={() => setShowAuditLogsModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono text-slate-400">
                Total registered user accounts: <strong className="text-cyan-300">{registeredUsersList.length}</strong>
              </div>

              <div className="divide-y divide-slate-800 bg-slate-950 rounded-2xl border border-slate-800 p-2 max-h-72 overflow-y-auto">
                {registeredUsersList.map((u) => (
                  <div key={u.id} className="p-3 text-xs font-mono flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 font-bold">{u.name}</div>
                      <div className="text-slate-500 text-[10px]">{u.email} • {u.role}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        PIN: {u.pin}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
