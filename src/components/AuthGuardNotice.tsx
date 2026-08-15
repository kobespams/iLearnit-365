import React from 'react';
import { Lock, KeyRound, UserPlus, ShieldCheck, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

interface AuthGuardNoticeProps {
  targetRole: UserRole;
  onNavigateToAuth: () => void;
  onNavigateToRegister?: () => void;
}

export const AuthGuardNotice: React.FC<AuthGuardNoticeProps> = ({ 
  targetRole, 
  onNavigateToAuth,
  onNavigateToRegister
}) => {
  const getRoleTitle = () => {
    switch (targetRole) {
      case 'student':
        return 'Registered Student Dashboard & Course Outlines';
      case 'teacher':
        return 'Registered Teacher & Class Portal';
      case 'jss_math':
        return 'Junior Secondary Course Outlines & Syllabus';
      default:
        return 'Registered Learning Portal';
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative z-10">
      <div className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-500 via-blue-600 to-emerald-500" />
        
        {/* Icon Lock Shield */}
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>

        {/* Headline & Notice */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Protected Portal Content
          </div>
          <h2 className="text-2xl font-extrabold font-sora text-navy">
            {getRoleTitle()}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            To view course outlines, subject syllabi, assignments, and learning portals, you must be a registered student or teacher. Please log in with your Student PIN or create a free account.
          </p>
        </div>

        {/* Benefits Preview List */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 max-w-md mx-auto text-slate-700">
          <div className="font-bold text-navy flex items-center gap-1.5 border-b border-slate-200 pb-2">
            <GraduationCap className="w-4 h-4 text-blue-600" /> What's Inside Registered Access:
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>JSS1 - JSS3 & SSS Complete Course Outlines & Topic Summaries</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Step-by-step worked math examples & formula cheat sheets</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>AI diagnostic study assistant & Pomodoro focus timer</span>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onNavigateToAuth}
            className="w-full sm:w-auto bg-navy hover:bg-slate-900 text-white font-sora font-extrabold text-xs py-3.5 px-6 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-gold" />
            <span>Sign In with PIN</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {onNavigateToRegister && (
            <button
              onClick={onNavigateToRegister}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-sora font-extrabold text-xs py-3.5 px-6 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>Register & Generate PIN</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
