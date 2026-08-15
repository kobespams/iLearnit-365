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
  Clock
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
    'Primary Mathematics',
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
    }, 200);
  };

  const handleCopyPin = (pinToCopy: string) => {
    navigator.clipboard.writeText(pinToCopy);
    setIsPinCopied(true);
    setTimeout(() => setIsPinCopied(false), 2000);
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: 'Not entered', color: 'bg-slate-200' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-red-500' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-blue-500' };
      case 4:
        return { score: 100, label: 'Strong & Secure', color: 'bg-emerald-500' };
      default:
        return { score: 10, label: 'Very Weak', color: 'bg-red-400' };
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
      setIsSubmitting(false);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleProceedToDashboard = () => {
    if (!registeredUserResult) return;
    const studentDetail = userToStudentDetail(registeredUserResult);
    onRegistrationComplete(registeredUserResult.role, studentDetail);
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Account Creation & PIN Allocation
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-sora text-navy">
              iLearnit-365 Registration Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Input your details below to generate your unique 4-digit PIN for instant access to the learning app.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                refreshRegisteredData();
                setShowAuditLogsModal(true);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-navy font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>Registered Accounts ({registeredUsersList.length})</span>
            </button>

            <button
              onClick={onNavigateToLogin}
              className="bg-navy hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-gold" />
              <span>Sign In with Existing PIN</span>
            </button>
          </div>
        </div>

        {/* STEP 2: REGISTRATION SUCCESSFUL - DIGITAL PASS & PIN DISPLAY */}
        {registeredUserResult ? (
          <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <span className="text-xs font-mono font-bold uppercase text-emerald-600 tracking-widest">
                Registration Successful • PIN Allocated
              </span>
              <h2 className="text-3xl font-extrabold font-sora text-navy">
                Welcome to iLearnit-365, {registeredUserResult.name}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Your profile is active in the database. Use your assigned 4-digit PIN below to sign in anytime.
              </p>
            </div>

            {/* DIGITAL PASS CARD */}
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-navy-deep via-navy to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-400/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                      {registeredUserResult.role === 'teacher' ? (
                        <BookMarked className="w-5 h-5 text-white" />
                      ) : registeredUserResult.role === 'parent' ? (
                        <Users className="w-5 h-5 text-white" />
                      ) : (
                        <GraduationCap className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-extrabold font-sora tracking-wider text-white">iLearnit-365 Access Pass</div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">{registeredUserResult.role} Portal Credentials</div>
                    </div>
                  </div>

                  <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold font-mono px-3 py-1 rounded-full uppercase">
                    Active • Verified
                  </span>
                </div>

                {/* Main Card Body */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-7 space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400">Account Holder</span>
                      <div className="text-xl font-bold font-sora text-white">{registeredUserResult.name}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-400">User ID</span>
                        <div className="font-mono font-bold text-amber-400">{registeredUserResult.studentId}</div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-400">School / Track</span>
                        <div className="font-medium text-slate-200 truncate">{registeredUserResult.schoolName || registeredUserResult.gradeLevel}</div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300">
                      <span className="text-slate-400 font-mono">Emergency Recovery Key: </span>
                      <span className="font-mono text-blue-300">{registeredUserResult.recoveryKey}</span>
                    </div>
                  </div>

                  {/* PROMINENT PIN DISPLAY */}
                  <div className="sm:col-span-5 bg-slate-800/90 border border-slate-700 p-4 rounded-2xl text-center space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-gold flex items-center justify-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-gold" /> Your 4-Digit Login PIN
                    </span>
                    
                    <div className="text-3xl font-extrabold font-mono tracking-widest text-white bg-slate-950 py-2.5 px-3 rounded-xl border border-slate-700 shadow-inner">
                      {registeredUserResult.pin}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyPin(registeredUserResult.pin)}
                      className="w-full text-xs font-bold py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isPinCopied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isPinCopied ? 'PIN Copied!' : 'Copy 4-Digit PIN'}</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-700/80 pt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Registered: {new Date(registeredUserResult.registrationTimestamp).toLocaleDateString()}</span>
                  <span>iLearnit-365 Cloud Verified</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={handleProceedToDashboard}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-800 hover:opacity-95 text-white font-sora font-extrabold text-sm px-8 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition transform hover:scale-[1.02]"
              >
                <span>Launch {registeredUserResult.role.toUpperCase()} Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onNavigateToLogin}
                className="w-full sm:w-auto bg-navy hover:bg-slate-900 text-white font-bold text-xs px-6 py-4 rounded-2xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-gold" />
                <span>Go to PIN Sign In Page</span>
              </button>

              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-navy font-bold text-xs px-5 py-4 rounded-2xl border border-slate-300 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-700" />
                <span>Print / Save ID Slip</span>
              </button>
            </div>
          </div>
        ) : (
          /* STEP 1: COMPREHENSIVE MULTI-ROLE REGISTRATION FORM */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Form Details (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Role Selection Tabs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 font-mono flex items-center gap-1.5">
                    <span>Select Profile Type</span>
                  </label>
                  <span className="text-[11px] text-blue-600 font-semibold">
                    {selectedRole === 'student' ? '🎓 Learner' : selectedRole === 'teacher' ? '🏫 Faculty' : '👨‍👩‍👧 Family'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('student');
                      setErrorMessage(null);
                    }}
                    className={`py-3 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                      selectedRole === 'student'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-navy hover:bg-white/60'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('teacher');
                      setErrorMessage(null);
                    }}
                    className={`py-3 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                      selectedRole === 'teacher'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-navy hover:bg-white/60'
                    }`}
                  >
                    <BookMarked className="w-4 h-4" />
                    <span>Teacher</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('parent');
                      setErrorMessage(null);
                    }}
                    className={`py-3 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                      selectedRole === 'parent'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-navy hover:bg-white/60'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Parent</span>
                  </button>
                </div>
              </div>

              {/* DEDICATED FORM INPUTS */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {/* 1. Full Legal Name */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-800">
                      {selectedRole === 'teacher' ? 'Teacher / Educator Full Name' : selectedRole === 'parent' ? 'Parent / Guardian Full Name' : 'Student Full Legal Name'} <span className="text-red-500">*</span>
                    </label>
                    {selectedRole === 'teacher' && (
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="text-slate-500 font-medium">Title:</span>
                        {['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'].map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTeacherTitle(t)}
                            className={`px-1.5 py-0.5 rounded font-bold transition cursor-pointer ${
                              teacherTitle === t ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={
                        selectedRole === 'teacher' 
                          ? 'e.g. Sarah Jenkins' 
                          : selectedRole === 'parent' 
                          ? 'e.g. Grace Adebayo' 
                          : 'e.g. Kemi Adebayo'
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-navy font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>
                </div>

                {/* 2. Email & Password Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@ilearnit365.edu"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-navy font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-800">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] font-bold text-slate-500">
                        {passwordStrength.label}
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-navy font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-navy cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. School / Educational Institution */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      School / Institution Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="e.g. Federal Government College / St. Jude Academy"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-navy font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Building2 className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {selectedRole === 'parent' ? 'Parent Mobile / WhatsApp' : 'Phone / Contact Number'}
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 800 000 0000"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-navy font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                    </div>
                  </div>
                </div>

                {/* ROLE-SPECIFIC FIELD SECTIONS */}
                
                {/* --- STUDENT SECTION --- */}
                {selectedRole === 'student' && (
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Academic Grade Level</label>
                        <select
                          value={gradeLevel}
                          onChange={(e) => setGradeLevel(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-3 text-xs font-bold text-navy focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          <optgroup label="🎒 Primary School (Basic 1 - 6)">
                            <option value="Primary 1 (Basic 1)">Primary 1 (Basic 1 - Lower Primary)</option>
                            <option value="Primary 2 (Basic 2)">Primary 2 (Basic 2 - Lower Primary)</option>
                            <option value="Primary 3 (Basic 3)">Primary 3 (Basic 3 - Lower Primary)</option>
                            <option value="Primary 4 (Basic 4)">Primary 4 (Basic 4 - Upper Primary)</option>
                            <option value="Primary 5 (Basic 5)">Primary 5 (Basic 5 - Upper Primary)</option>
                            <option value="Primary 6 (Basic 6 - Common Entrance)">Primary 6 (Basic 6 - Common Entrance Candidate)</option>
                          </optgroup>
                          <optgroup label="📚 Junior Secondary School (JSS 1 - 3)">
                            <option value="JSS1 - Junior Secondary 1">JSS 1 (Junior Secondary 1)</option>
                            <option value="JSS2 - Junior Secondary 2">JSS 2 (Junior Secondary 2)</option>
                            <option value="JSS3 - BECE Candidate">JSS 3 (Junior Secondary 3 - BECE Prep)</option>
                          </optgroup>
                          <optgroup label="🎓 Senior Secondary School (SSS 1 - 3)">
                            <option value="SSS1 - Senior Secondary 1">SSS 1 (Senior Secondary 1)</option>
                            <option value="SSS2 - Senior Secondary 2">SSS 2 (Senior Secondary 2)</option>
                            <option value="SSS3 - WAEC / NECO Prep">SSS 3 (Senior Secondary 3 - WAEC/NECO Prep)</option>
                          </optgroup>
                          <optgroup label="🏛️ Higher Education / College">
                            <option value="College / Tertiary Track">College / University Track</option>
                          </optgroup>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Parent / Guardian Name</label>
                        <input
                          type="text"
                          value={parentName}
                          onChange={(e) => setParentName(e.target.value)}
                          placeholder="e.g. Grace Adebayo"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-navy font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                        <Target className="w-3.5 h-3.5 text-blue-600" /> Primary Learning Goal / Focus
                      </label>
                      <input
                        type="text"
                        value={studyGoal}
                        onChange={(e) => setStudyGoal(e.target.value)}
                        placeholder="e.g. Master Primary Math, Basic Science & Common Entrance / BECE Prep"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-navy font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Enrolled Subjects Checkboxes */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-800">
                        Select Enrolled Subject Outlines
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          'Primary Mathematics',
                          'Basic Science & Tech',
                          'English & Phonics',
                          'Reasoning & Aptitude',
                          'Computer Studies & IT',
                          'Social Studies & Civic',
                          'JSS Mathematics',
                          'Integrated Science',
                          'Agricultural Science'
                        ].map((sub) => {
                          const isSelected = selectedSubjects.includes(sub);
                          return (
                            <button
                              type="button"
                              key={sub}
                              onClick={() => toggleSubject(sub)}
                              className={`p-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <span className="truncate">{sub}</span>
                              {isSelected && <Check className="w-3 h-3 text-blue-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TEACHER SECTION --- */}
                {selectedRole === 'teacher' && (
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Teaching Specialty / Department
                        </label>
                        <input
                          type="text"
                          value={teachingSubject}
                          onChange={(e) => setTeachingSubject(e.target.value)}
                          placeholder="e.g. Primary Education, Mathematics, STEM"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-navy font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Staff / Employee ID (Optional)
                        </label>
                        <input
                          type="text"
                          value={staffId}
                          onChange={(e) => setStaffId(e.target.value)}
                          placeholder="e.g. TCH-2026-STEM"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-navy font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-800">
                        Class Groups Handled
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          'Primary 1 - 3 (Lower Basic)',
                          'Primary 4 - 6 (Upper Basic)',
                          'JSS 1 Classes',
                          'JSS 2 Classes',
                          'JSS 3 Classes',
                          'SSS Senior STEM'
                        ].map((cls) => {
                          const isSelected = teacherClasses.includes(cls);
                          return (
                            <button
                              type="button"
                              key={cls}
                              onClick={() => toggleTeacherClass(cls)}
                              className={`p-2 rounded-xl text-center text-xs font-semibold border transition cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {cls}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- PARENT SECTION --- */}
                {selectedRole === 'parent' && (
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Relationship to Student
                        </label>
                        <select
                          value={relationship}
                          onChange={(e) => setRelationship(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-3 text-xs font-bold text-navy focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                        >
                          <option value="Mother">Mother</option>
                          <option value="Father">Father</option>
                          <option value="Legal Guardian">Legal Guardian</option>
                          <option value="Academic Sponsor">Academic Sponsor</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Student / Child's Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                          placeholder="e.g. Kemi Adebayo"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-navy font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Child's Grade Track
                        </label>
                        <select
                          value={childGrade}
                          onChange={(e) => setChildGrade(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-3 text-xs font-bold text-navy focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                        >
                          <optgroup label="🎒 Primary School Track (Basic 1 - 6)">
                            <option value="Primary 1 (Basic 1)">Primary 1 (Basic 1)</option>
                            <option value="Primary 2 (Basic 2)">Primary 2 (Basic 2)</option>
                            <option value="Primary 3 (Basic 3)">Primary 3 (Basic 3)</option>
                            <option value="Primary 4 (Basic 4)">Primary 4 (Basic 4)</option>
                            <option value="Primary 5 (Basic 5)">Primary 5 (Basic 5)</option>
                            <option value="Primary 6 (Basic 6 - Common Entrance)">Primary 6 (Basic 6 - Common Entrance Prep)</option>
                          </optgroup>
                          <optgroup label="📚 Junior Secondary Track">
                            <option value="JSS1 - Junior Secondary 1">JSS 1 (Junior Secondary 1)</option>
                            <option value="JSS2 - Junior Secondary 2">JSS 2 (Junior Secondary 2)</option>
                            <option value="JSS3 - BECE Candidate">JSS 3 (Junior Secondary 3 - BECE)</option>
                          </optgroup>
                          <optgroup label="🎓 Senior Secondary Track">
                            <option value="SSS1 - Senior Secondary 1">SSS 1 (Senior Secondary 1)</option>
                            <option value="SSS2 - Senior Secondary 2">SSS 2 (Senior Secondary 2)</option>
                            <option value="SSS3 - WAEC / NECO">SSS 3 (Senior Secondary 3 - WAEC / NECO)</option>
                          </optgroup>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Link Child's Existing PIN (Optional)
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          value={childPin}
                          onChange={(e) => setChildPin(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 8842 (if already generated)"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-amber-500 tracking-wider"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Terms Agreement */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span>
                      I agree to the <strong>iLearnit-365 Academic Integrity Code</strong> and data security protocols for registered students, faculty, and guardians.
                    </span>
                  </label>
                </div>

                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-navy hover:bg-slate-900 disabled:opacity-50 text-white font-sora font-extrabold text-sm py-4 rounded-2xl transition shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-gold" />
                      <span>Allocating Secure PIN & Registering Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 text-gold" />
                      <span>Complete Registration & Issue Login PIN</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Interactive Real-Time PIN Generator Engine (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* REAL TIME PIN ENGINE CARD */}
              <div className="bg-gradient-to-br from-navy-deep via-navy to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-blue-500/30 space-y-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-gold" /> Real-Time PIN Generator
                  </div>

                  <button
                    type="button"
                    onClick={handleRegeneratePin}
                    disabled={isGeneratingPin || pinMode === 'custom'}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-slate-300 hover:text-white transition cursor-pointer"
                    title="Generate Fresh Real-Time PIN"
                  >
                    <RefreshCw className={`w-4 h-4 ${isGeneratingPin ? 'animate-spin text-gold' : ''}`} />
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-sora text-white">
                    Your 4-Digit Login Key
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    This unique 4-digit PIN is generated specifically for your <strong className="text-white">{selectedRole}</strong> profile so you can log into the app instantly without entering passwords.
                  </p>
                </div>

                {/* Mode Selector (Auto vs Custom) */}
                <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setPinMode('auto')}
                    className={`flex-1 py-1.5 text-center rounded-lg font-bold transition cursor-pointer ${
                      pinMode === 'auto'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Auto-Generate
                  </button>
                  <button
                    type="button"
                    onClick={() => setPinMode('custom')}
                    className={`flex-1 py-1.5 text-center rounded-lg font-bold transition cursor-pointer ${
                      pinMode === 'custom'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Set Custom PIN
                  </button>
                </div>

                {/* THE LIVE 4-DIGIT PIN DISPLAY DIGITS */}
                <div className="bg-slate-950/80 border border-slate-700 rounded-2xl p-5 text-center space-y-3">
                  <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Real-Time Allocation Preview</span>
                  </div>

                  {pinMode === 'auto' ? (
                    <div className="flex items-center justify-center gap-3">
                      {(isPinVisible ? liveGeneratedPin : '••••').split('').map((char, idx) => (
                        <div
                          key={idx}
                          className="w-12 h-14 bg-slate-900 border-2 border-blue-500/40 rounded-xl flex items-center justify-center text-2xl font-mono font-extrabold text-gold shadow-lg"
                        >
                          {char}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={customPinInput}
                        onChange={(e) => setCustomPinInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 4821"
                        className="w-full bg-slate-900 border border-slate-600 rounded-xl py-2.5 px-4 text-center font-mono font-bold text-xl text-gold focus:outline-none focus:border-amber-400 tracking-widest"
                      />
                      <span className="text-[10px] text-slate-400">Enter 4 digits of your choice</span>
                    </div>
                  )}

                  {/* Copy & Visibility Controls */}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsPinVisible(!isPinVisible)}
                      className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      {isPinVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{isPinVisible ? 'Mask' : 'Reveal'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyPin(activePin)}
                      className="text-xs text-slate-300 hover:text-white px-3 py-1 rounded-lg bg-blue-600/40 hover:bg-blue-600 border border-blue-500/40 flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      {isPinCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isPinCopied ? 'Copied' : 'Copy PIN'}</span>
                    </button>
                  </div>
                </div>

                {/* Security Features */}
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Instant collision-safe allocation against database</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Works for Student, Teacher, and Parent portals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlocks full course outlines, JSS math syllabus & tools</span>
                  </div>
                </div>
              </div>

              {/* Instructions Callout */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3 text-xs text-slate-600">
                <div className="font-bold font-sora text-navy flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>How to Log In After Registering</span>
                </div>
                <ol className="space-y-2 list-decimal list-inside text-[11px] leading-relaxed text-slate-600">
                  <li>Fill in your details and click <strong>"Complete Registration & Issue Login PIN"</strong>.</li>
                  <li>Your 4-digit PIN is stored in your secure account profile.</li>
                  <li>Click <strong>"Sign In with PIN"</strong> and enter this 4-digit code to launch your dashboard.</li>
                </ol>
              </div>

            </div>

          </div>
        )}

        {/* AUDIT LOGS & REGISTERED USERS MODAL */}
        {showAuditLogsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] flex flex-col">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-sora font-bold text-lg text-navy">
                      Live Registered Users & PIN Audit
                    </h3>
                    <p className="text-xs text-slate-500">
                      Persistent database records for students, teachers, and parents.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAuditLogsModal(false)}
                  className="p-2 text-slate-400 hover:text-navy rounded-full hover:bg-slate-100 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Roster of Registered Users */}
              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                <div className="text-xs font-bold uppercase font-mono text-slate-700 flex items-center justify-between">
                  <span>Registered Accounts ({registeredUsersList.length})</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Active in Local Database</span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                  {registeredUsersList.map((user) => (
                    <div key={user.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-white transition">
                      <div className="space-y-0.5">
                        <div className="font-bold text-navy flex items-center gap-2">
                          <span>{user.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            user.role === 'student' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'teacher' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          ID: <span className="font-bold text-slate-700">{user.studentId}</span> • {user.email} • {user.schoolName || user.gradeLevel}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] font-mono text-slate-400">
                          {new Date(user.registrationTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          PIN Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Audit Security Event Records */}
                <div className="pt-3 space-y-2">
                  <div className="text-xs font-bold uppercase font-mono text-slate-700">
                    Latest Security Audit Events
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {auditLogs.slice(0, 8).map((log) => (
                      <div key={log.id} className="bg-slate-100 p-2.5 rounded-xl text-[11px] font-mono flex items-start justify-between gap-3 text-slate-700">
                        <div>
                          <span className="font-bold text-blue-700">[{log.action}]</span> {log.details}
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-end">
                <button
                  onClick={() => setShowAuditLogsModal(false)}
                  className="bg-navy hover:bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Close Records View
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
