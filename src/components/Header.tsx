import React, { useState } from 'react';
import { UserRole } from '../types';
import { User, LogIn, Sparkles, BookOpen, GraduationCap, Users, LayoutGrid, CheckCircle, KeyRound } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenAuthModal: () => void;
  userSignedIn: boolean;
  userName: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSelectRole,
  onOpenAuthModal,
  userSignedIn,
  userName,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D8DFEA] px-4 sm:px-8 py-3.5 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <button
          onClick={() => onSelectRole('hub')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-[#132C54] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none">
              <path d="M20 3 C11 3 5 9 5 17c0 3 1 5.5 3 7.5L20 30l12-5.5c2-2 3-4.5 3-7.5C35 9 29 3 20 3Z" fill="#2F6FE0"/>
              <path d="M20 34c-3 0-5.5-2-5.5-4.5V21l5.5 2.5 5.5-2.5v8.5c0 2.5-2.5 4.5-5.5 4.5Z" fill="#CC9A2E"/>
            </svg>
          </div>
          <div>
            <div className="font-sora font-extrabold text-xl text-[#0B1D3A] tracking-tight flex items-center gap-1">
              iLearnit<span className="text-[#CC9A2E]">-365</span>
            </div>
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#4C5A75] font-semibold hidden sm:block">
              Learn. Grow. Achieve.
            </p>
          </div>
        </button>

        {/* Portal Switcher Nav Pill */}
        <nav className="hidden md:flex items-center gap-1 bg-[#ECF0F6] p-1.5 rounded-full border border-[#D8DFEA]">
          <button
            onClick={() => onSelectRole('login')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              currentRole === 'login'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-800 bg-amber-50/80 hover:bg-amber-100'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>PIN Login</span>
          </button>

          <button
            onClick={() => onSelectRole('hub')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentRole === 'hub'
                ? 'bg-[#132C54] text-white shadow-sm'
                : 'text-[#4C5A75] hover:text-[#0B1D3A] hover:bg-white/60'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Role Hub</span>
          </button>

          <button
            onClick={() => onSelectRole('jss_math')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              currentRole === 'jss_math'
                ? 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-sm'
                : 'text-blue-700 bg-blue-50/80 hover:bg-blue-100 hover:text-blue-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>JSS Math Syllabus</span>
          </button>

          <button
            onClick={() => onSelectRole('student')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentRole === 'student'
                ? 'bg-[#2F6FE0] text-white shadow-sm'
                : 'text-[#4C5A75] hover:text-[#0B1D3A] hover:bg-white/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>

          <button
            onClick={() => onSelectRole('teacher')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentRole === 'teacher'
                ? 'bg-[#2E9B58] text-white shadow-sm'
                : 'text-[#4C5A75] hover:text-[#0B1D3A] hover:bg-white/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Teacher</span>
          </button>

          <button
            onClick={() => onSelectRole('parent')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentRole === 'parent'
                ? 'bg-[#CC9A2E] text-white shadow-sm'
                : 'text-[#4C5A75] hover:text-[#0B1D3A] hover:bg-white/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Parent</span>
          </button>
        </nav>

        {/* User Account / Sign In */}
        <div className="flex items-center gap-3">
          {/* AI Active Indicator */}
          <div className="hidden lg:flex items-center gap-2 bg-[#2E9B58]/10 text-[#2E9B58] px-3 py-1 rounded-full text-xs font-semibold border border-[#2E9B58]/20">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Secured</span>
          </div>

          {userSignedIn ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-[#F6F8FB] border border-[#D8DFEA] hover:border-[#132C54] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#0B1D3A] transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-[#132C54] text-white flex items-center justify-center text-[10px]">
                  {userName.charAt(0)}
                </div>
                <span>{userName}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#D8DFEA] rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-[#ECF0F6]">
                    <p className="text-[10px] uppercase font-mono text-[#4C5A75]">Active User</p>
                    <p className="text-xs font-semibold text-[#0B1D3A] truncate">{userName}</p>
                  </div>
                  <button
                    onClick={() => {
                      onSelectRole('student');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#0B1D3A] hover:bg-[#F6F8FB] flex items-center gap-2"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-[#2F6FE0]" /> Student Portal
                  </button>
                  <button
                    onClick={() => {
                      onSelectRole('teacher');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#0B1D3A] hover:bg-[#F6F8FB] flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#2E9B58]" /> Teacher Portal
                  </button>
                  <button
                    onClick={() => {
                      onSelectRole('parent');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#0B1D3A] hover:bg-[#F6F8FB] flex items-center gap-2"
                  >
                    <Users className="w-3.5 h-3.5 text-[#CC9A2E]" /> Parent Portal
                  </button>
                  <div className="border-t border-[#ECF0F6] my-1"></div>
                  <button
                    onClick={() => {
                      onOpenAuthModal();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    Switch Account / Sign In
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="font-sora text-xs font-semibold text-[#132C54] border border-[#D8DFEA] hover:border-[#132C54] hover:bg-[#132C54] hover:text-white px-4 py-2 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
