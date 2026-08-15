import React, { useState } from 'react';
import { UserRole, StudentDetail } from '../types';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  KeyRound, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  Check,
  UserPlus,
  LogIn,
  Lock,
  Mail,
  BookMarked,
  Sparkles
} from 'lucide-react';
import { 
  authenticateByPin, 
  authenticateByEmail, 
  userToStudentDetail,
  getRegisteredUsers 
} from '../services/authStorage';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole, student: StudentDetail) => void;
  onNavigateToHub: () => void;
  onNavigateToRegister?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onLoginSuccess, 
  onNavigateToHub,
  onNavigateToRegister
}) => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'parent'>('student');
  const [loginMethod, setLoginMethod] = useState<'pin' | 'email'>('pin');

  // Sign In States (NO hardcoded sample PINs prefilled)
  const [pinInput, setPinInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');

  // UI Feedback States
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live lookup for student PIN during sign in against REAL registered users
  const matchedStudent = pinInput.length >= 4 ? authenticateByPin(pinInput) : undefined;

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (loginMethod === 'pin') {
      if (!pinInput.trim()) {
        setErrorMessage('Please enter your 4-digit Student Access PIN.');
        return;
      }

      const matchedUser = authenticateByPin(pinInput);
      if (!matchedUser) {
        setErrorMessage(`No registered account found with PIN "${pinInput}". Please check your PIN or click "Register New Account" to generate your unique PIN.`);
        return;
      }

      const studentDetail = userToStudentDetail(matchedUser);
      onLoginSuccess(matchedUser.role, studentDetail);
    } else {
      // Email & Password method
      if (!emailInput.trim()) {
        setErrorMessage('Please enter your registered email address.');
        return;
      }
      if (!passwordInput.trim()) {
        setErrorMessage('Please enter your password.');
        return;
      }

      const matchedUser = authenticateByEmail(emailInput, selectedRole);
      if (!matchedUser) {
        setErrorMessage(`No account found for "${emailInput}" under the ${selectedRole} role. Please check your credentials or register a new profile.`);
        return;
      }

      const studentDetail = userToStudentDetail(matchedUser);
      onLoginSuccess(matchedUser.role, studentDetail);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative z-10">
      <div className="max-w-4xl w-full bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative">
        
        {/* Left Decorative Column */}
        <div className="md:col-span-5 bg-gradient-to-br from-navy-deep via-navy to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Dark Digital Animation Container for iLearnit Logo */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                {/* Ambient Neon Glow Halo */}
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/40 via-blue-600/30 to-amber-500/40 rounded-2xl blur-lg opacity-80 group-hover:opacity-100 transition duration-500 animate-pulse-glow pointer-events-none" />
                
                {/* Digital Container with Scanline & Cyber Brackets */}
                <div className="cyber-logo-container relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl shadow-xl p-1 transition-transform duration-300 group-hover:scale-105">
                  {/* Scanline Sweep Overlay */}
                  <div className="cyber-scanline" />

                  {/* Corner Tech Brackets */}
                  <div className="absolute top-0.5 left-0.5 w-2 h-2 border-t-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
                  <div className="absolute top-0.5 right-0.5 w-2 h-2 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />
                  <div className="absolute bottom-0.5 left-0.5 w-2 h-2 border-b-2 border-l-2 border-amber-400 z-20 pointer-events-none" />
                  <div className="absolute bottom-0.5 right-0.5 w-2 h-2 border-b-2 border-r-2 border-amber-400 z-20 pointer-events-none" />

                  <img
                    src="/src/assets/images/ilearnit_logo_1786816502338.jpg"
                    alt="iLearnit-365 Logo"
                    referrerPolicy="no-referrer"
                    className="relative z-10 w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none z-10" />
                </div>
              </div>

              <div>
                <div className="font-sora font-extrabold text-xl text-white tracking-tight">
                  iLearnit<span className="text-[#CC9A2E]">-365</span>
                </div>
                <div className="text-[11px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                  Learn • Grow • Achieve
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Cloud Education Gateway</span>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" /> Registered Access Gate
            </div>

            <div>
              <h2 className="text-3xl font-extrabold font-sora text-white leading-tight">
                Sign In to iLearnit-365
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Course outlines, JSS math syllabus, CBT exam suite, homework assignments, and AI tutors require verified student or faculty authentication.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-200 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Protected Course Outlines & Syllabi</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-Time Encrypted Student PIN Access</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Diagnostic Study Tools & AI Assistant</span>
              </div>
            </div>
          </div>

          {/* Registration Prompt Callout */}
          <div className="relative z-10 pt-6 border-t border-slate-800 space-y-3">
            <div className="text-xs text-slate-300">
              <span className="text-gold font-bold">New to iLearnit-365?</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Register now to have a secure real-time 4-digit PIN generated for your profile.
              </p>
            </div>
            
            {onNavigateToRegister && (
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:opacity-90 text-white font-sora font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-gold" />
                <span>Register & Generate Real-Time PIN</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-6">
            
            {/* Top Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">
                  Authentication
                </span>
                <h3 className="text-2xl font-bold font-sora text-navy">
                  Account Portal Log In
                </h3>
              </div>

              {/* Login Method Toggle */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('pin');
                    setErrorMessage(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    loginMethod === 'pin'
                      ? 'bg-navy text-white shadow-sm'
                      : 'text-slate-600 hover:text-navy'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" /> PIN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('email');
                    setErrorMessage(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    loginMethod === 'email'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-navy'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </button>
              </div>
            </div>

            {/* Role Selector */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('student');
                  setErrorMessage(null);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
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
                  setSelectedRole('parent');
                  setErrorMessage(null);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'parent'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-navy hover:bg-white/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Parent</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('teacher');
                  setErrorMessage(null);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'teacher'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-navy hover:bg-white/60'
                }`}
              >
                <BookMarked className="w-4 h-4" />
                <span>Teacher</span>
              </button>
            </div>

            {/* SIGN IN FORM */}
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              {loginMethod === 'pin' ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-blue-600" /> Enter 4-Digit Student / User PIN
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      maxLength={12}
                      value={pinInput}
                      onChange={(e) => {
                        setPinInput(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="Enter your registered 4-digit PIN..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-wider"
                    />
                    {matchedStudent && (
                      <div className="absolute right-3 top-2.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> Verified: {matchedStudent.name}
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Enter the real-time PIN issued upon completing registration.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="user@ilearnit365.edu"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-medium text-navy focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Account Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-medium text-navy focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-navy hover:bg-slate-900 text-white font-sora font-extrabold text-xs sm:text-sm py-3.5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-gold" />
                <span>Launch Registered Dashboard</span>
              </button>
            </form>

          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            {onNavigateToRegister ? (
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create New Account</span>
              </button>
            ) : <span />}
            
            <button
              type="button"
              onClick={onNavigateToHub}
              className="text-slate-600 hover:text-navy cursor-pointer"
            >
              iLearnit-365 Homepage
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
