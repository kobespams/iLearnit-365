import React from 'react';
import { Lock, KeyRound, UserPlus, ShieldCheck, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

interface AuthGuardNoticeProps {
  targetRole: UserRole;
  onNavigateToAuth: () => void;
  onNavigateToRegister?: () => void;
  onTryDemoMode?: () => void;
}

export const AuthGuardNotice: React.FC<AuthGuardNoticeProps> = ({ 
  targetRole, 
  onNavigateToAuth,
  onNavigateToRegister,
  onTryDemoMode,
}) => {
  const getRoleTitle = () => {
    switch (targetRole) {
      case 'student':
        return 'Registered Student Dashboard & Course Outlines';
      case 'teacher':
        return 'Registered Teacher & Class Portal';
      case 'parent':
        return 'Parent & Guardian Progress Portal';
      case 'jss_math':
        return 'Junior Secondary Course Outlines & Syllabus';
      default:
        return 'Registered Learning Portal';
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative z-10">
      <div className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> Protected Portal Content
          </div>
          <h2 className="text-2xl font-extrabold font-sora text-[#0B1D3A]">
            {getRoleTitle()}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            Sign in with your 4-digit PIN, register an account, or preview this portal immediately in Demo Mode in under a minute.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 max-w-md mx-auto text-slate-700">
          <div className="font-bold text-[#0B1D3A] flex items-center gap-1.5 border-b border-slate-200 pb-2">
            <GraduationCap className="w-4 h-4 text-blue-600" /> What&apos;s Inside:
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>JSS1–JSS3, SSS &amp; JAMB UTME (2000–2025) Syllabi</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Teacher Class Creation &amp; AI Output Review / Override</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Parent PIN Lookup &amp; Minor Consent Controls</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
          {onTryDemoMode && (
            <button
              type="button"
              onClick={onTryDemoMode}
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-[#0B1D3A] font-sora font-extrabold text-xs py-3.5 px-6 rounded-2xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Try Demo Mode (No Sign-Up)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNavigateToAuth}
            className="w-full sm:w-auto bg-[#0B1D3A] hover:bg-[#132C54] text-white font-sora font-extrabold text-xs py-3.5 px-6 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-amber-300" />
            <span>Sign In with PIN</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {onNavigateToRegister && (
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-sora font-extrabold text-xs py-3.5 px-6 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>Register &amp; Generate PIN</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
