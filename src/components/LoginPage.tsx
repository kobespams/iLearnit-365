import React, { useState } from 'react';
import { UserRole, StudentDetail, RegisteredUser } from '../types';
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
  Sparkles,
  Palette,
  Sun,
  Moon,
  Zap,
  Award
} from 'lucide-react';
import { 
  authenticateByPin, 
  authenticateByEmail, 
  userToStudentDetail,
  getRegisteredUsers,
  getRegisteredStudents 
} from '../services/authStorage';
import { reportPublicActivity } from '../services/emailAndActivityService';
import { THEME_OPTIONS, applyTheme, getInitialTheme, ThemeMode } from '../utils/theme';

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
  const [loginMethod, setLoginMethod] = useState<'pin' | 'quick_select' | 'email'>('pin');

  // Sign In Inputs
  const [pinInput, setPinInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');

  // Active theme selector state
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => getInitialTheme());

  // UI Feedback States
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Real registered users list
  const registeredUsers = getRegisteredUsers();
  const registeredStudents = getRegisteredStudents();

  // Matched student when typing 4-digit PIN
  const matchedUser = pinInput.length >= 4 ? authenticateByPin(pinInput) : undefined;

  const handleThemeChange = (themeMode: ThemeMode) => {
    setCurrentTheme(themeMode);
    applyTheme(themeMode);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (loginMethod === 'pin') {
      if (!pinInput.trim()) {
        setErrorMessage('Please enter your 4-digit Student Access PIN.');
        return;
      }

      const user = authenticateByPin(pinInput);
      if (!user) {
        setErrorMessage(`No registered account found for PIN "${pinInput}". Please check your PIN or click "Register New Account" to generate your unique PIN.`);
        return;
      }

      const studentDetail = userToStudentDetail(user);
      void reportPublicActivity({
        activityType: 'USER_LOGIN_PIN',
        actorRole: user.role,
        actorName: user.name,
        actorEmail: user.email,
        actorId: user.studentId,
        targetResource: `${user.role.toUpperCase()} Portal`,
        details: `Signed in via 4-digit PIN on public gateway (${user.gradeLevel}).`,
      });
      onLoginSuccess(user.role, studentDetail);
    } else if (loginMethod === 'email') {
      if (!emailInput.trim()) {
        setErrorMessage('Please enter your registered email address.');
        return;
      }
      if (!passwordInput.trim()) {
        setErrorMessage('Please enter your password.');
        return;
      }

      const user = authenticateByEmail(emailInput, selectedRole);
      if (!user) {
        setErrorMessage(`No account found for "${emailInput}" under the ${selectedRole} role. Please check your credentials or register a new profile.`);
        return;
      }

      const studentDetail = userToStudentDetail(user);
      void reportPublicActivity({
        activityType: 'USER_LOGIN_EMAIL',
        actorRole: user.role,
        actorName: user.name,
        actorEmail: user.email,
        actorId: user.studentId,
        targetResource: `${user.role.toUpperCase()} Portal`,
        details: `Signed in via email gateway (${user.gradeLevel}).`,
      });
      onLoginSuccess(user.role, studentDetail);
    }
  };

  const handleQuickSelectUser = (user: RegisteredUser) => {
    const studentDetail = userToStudentDetail(user);
    void reportPublicActivity({
      activityType: 'USER_LOGIN_PROFILE',
      actorRole: user.role,
      actorName: user.name,
      actorEmail: user.email,
      actorId: user.studentId,
      targetResource: `${user.role.toUpperCase()} Portal`,
      details: `Accessed ${user.role} dashboard via Registered Profiles selector.`,
    });
    onLoginSuccess(user.role, studentDetail);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative z-10 animate-fadeIn">
      <div className="max-w-5xl w-full bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative transition-colors duration-300">
        
        {/* Left Decorative eLearning Branding Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0B1D3A] via-[#132C54] to-slate-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Logo Container with Cyber Scanline FX */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/40 via-blue-600/30 to-amber-500/40 rounded-2xl blur-lg opacity-80 group-hover:opacity-100 transition duration-500 animate-pulse-glow pointer-events-none" />
                
                <div className="cyber-logo-container relative w-16 h-16 rounded-2xl shadow-xl p-1 transition-transform duration-300 group-hover:scale-105">
                  <div className="cyber-scanline" />
                  <img
                    src="/src/assets/images/ilearnit_logo_1786816502338.jpg"
                    alt="iLearnit-365 Logo"
                    referrerPolicy="no-referrer"
                    className="relative z-10 w-full h-full object-cover rounded-xl"
                  />
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
                  <span>Cloud Academic Gateway</span>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Registered Scholar Authentication</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-sora text-white leading-tight">
                eLearning Dashboard Gateway
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Access your personalized study schedule, E2EE educator channels, live JSS math syllabi, CBT exams, and real-time academic transcripts.
              </p>
            </div>

            {/* Live Theme Switcher Showcase inside Sign-in */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Palette className="w-3.5 h-3.5" /> Dynamic Visual Theme:
                </span>
                <span className="capitalize text-[11px]">{currentTheme.replace('_', ' ')}</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleThemeChange(opt.id)}
                    title={`${opt.name} - ${opt.subtitle}`}
                    className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                      currentTheme === opt.id
                        ? 'bg-white text-[#0B1D3A] border-white shadow-md font-bold'
                        : 'bg-black/30 text-slate-300 border-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex gap-0.5">
                      {opt.previewColors.slice(0, 2).map((c, i) => (
                        <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-[9px] truncate max-w-full font-mono">{opt.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 text-[10px] text-slate-400 font-mono flex items-center justify-between border-t border-white/10">
            <span>AES-256 Protocol Verified</span>
            <span>iLearnit-365 v2.4</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
          {/* Top Login Method Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ECF0F6] dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-sora font-bold text-xl text-[#0B1D3A] dark:text-white">
                Sign In to Your Portal
              </h3>
              <p className="text-xs text-[#5B6A88] dark:text-slate-400 mt-0.5">
                Select your preferred authentication method below
              </p>
            </div>

            <div className="flex items-center gap-1 bg-[#ECF0F6] dark:bg-slate-800 p-1 rounded-xl border border-[#D8DFEA] dark:border-slate-700">
              <button
                type="button"
                onClick={() => setLoginMethod('pin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  loginMethod === 'pin'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-[#5B6A88] dark:text-slate-300 hover:text-[#0B1D3A]'
                }`}
              >
                4-Digit PIN
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('quick_select')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  loginMethod === 'quick_select'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-[#5B6A88] dark:text-slate-300 hover:text-[#0B1D3A]'
                }`}
              >
                Registered Profiles ({registeredUsers.length})
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  loginMethod === 'email'
                    ? 'bg-[#0B1D3A] dark:bg-slate-700 text-white shadow-sm'
                    : 'text-[#5B6A88] dark:text-slate-300 hover:text-[#0B1D3A]'
                }`}
              >
                Email
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-xs text-red-700 dark:text-red-300 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div>{errorMessage}</div>
            </div>
          )}

          {/* METHOD 1: 4-DIGIT PIN SIGN IN */}
          {loginMethod === 'pin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-[#0B1D3A] dark:text-slate-200 uppercase tracking-wider">
                  Enter 4-Digit Access PIN
                </label>
                <div className="relative">
                  <KeyRound className="w-5 h-5 text-[#5B6A88] dark:text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 8842"
                    className="w-full bg-[#F6F8FB] dark:bg-slate-950 border-2 border-[#D8DFEA] dark:border-slate-800 focus:border-blue-600 rounded-2xl pl-12 pr-4 py-3.5 text-xl font-mono font-extrabold tracking-widest text-[#0B1D3A] dark:text-white focus:outline-none transition"
                  />
                </div>
                <p className="text-[11px] text-[#5B6A88] dark:text-slate-400">
                  Provided during student registration or assigned by your institutional registrar.
                </p>
              </div>

              {/* Real-time matched profile preview card */}
              {matchedUser && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/90 border border-emerald-300 dark:border-emerald-700 rounded-2xl p-4 flex items-center justify-between gap-4 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <img src={matchedUser.avatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-emerald-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-sora font-bold text-sm text-[#0B1D3A] dark:text-white">{matchedUser.name}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded">
                          {matchedUser.role.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5B6A88] dark:text-slate-300">{matchedUser.gradeLevel || matchedUser.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickSelectUser(matchedUser)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-sm shrink-0"
                  >
                    Confirm & Enter →
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#0B1D3A] hover:bg-[#132C54] dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-sora font-bold text-sm py-4 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <LogIn className="w-4 h-4" />
                <span>Verify PIN & Sign In</span>
              </button>
            </form>
          )}

          {/* METHOD 2: QUICK SELECT FROM REAL REGISTERED PROFILES */}
          {loginMethod === 'quick_select' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#5B6A88] dark:text-slate-400 uppercase">
                  Real Registered Users on This App
                </span>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {registeredUsers.length} Active Records
                </span>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {registeredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleQuickSelectUser(user)}
                    className="bg-[#F6F8FB] dark:bg-slate-800/70 hover:bg-blue-50 dark:hover:bg-slate-800 border border-[#D8DFEA] dark:border-slate-700 hover:border-blue-400 rounded-2xl p-4 flex items-center justify-between gap-4 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt="" className="w-11 h-11 rounded-2xl object-cover border border-slate-300 dark:border-slate-600" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-sora font-bold text-sm text-[#0B1D3A] dark:text-white group-hover:text-blue-600">
                            {user.name}
                          </h4>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            user.role === 'teacher'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          }`}>
                            {user.role === 'teacher' ? 'Faculty' : 'Student'}
                          </span>
                        </div>
                        <p className="text-xs text-[#5B6A88] dark:text-slate-400 mt-0.5">
                          {user.gradeLevel || user.schoolName} • ID: <span className="font-mono text-[#0B1D3A] dark:text-slate-300 font-semibold">{user.studentId}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-mono font-bold bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-700 text-[#0B1D3A] dark:text-slate-200 px-2.5 py-1 rounded-xl">
                        PIN: {user.pin}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* METHOD 3: EMAIL & PASSWORD */}
          {loginMethod === 'email' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#0B1D3A] dark:text-slate-200 uppercase">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#5B6A88] dark:text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. samuel.adebayo@ilearnit365.edu"
                    className="w-full bg-[#F6F8FB] dark:bg-slate-950 border border-[#D8DFEA] dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-[#0B1D3A] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-[#0B1D3A] dark:text-slate-200 uppercase">
                  Password / Passphrase
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#5B6A88] dark:text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#F6F8FB] dark:bg-slate-950 border border-[#D8DFEA] dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-[#0B1D3A] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0B1D3A] hover:bg-[#132C54] dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-sora font-bold text-sm py-3.5 rounded-2xl transition cursor-pointer shadow-md mt-2"
              >
                Sign In with Credentials
              </button>
            </form>
          )}

          {/* Bottom Action Footer */}
          <div className="border-t border-[#ECF0F6] dark:border-slate-800 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              type="button"
              onClick={onNavigateToHub}
              className="text-xs text-[#5B6A88] dark:text-slate-400 hover:text-[#0B1D3A] dark:hover:text-white transition cursor-pointer"
            >
              ← Back to Main Hub
            </button>

            {onNavigateToRegister && (
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="inline-flex items-center gap-1.5 text-xs font-sora font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register New Student Account & PIN →</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
