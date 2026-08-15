import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { User, LogIn, Sparkles, BookOpen, GraduationCap, Users, LayoutGrid, CheckCircle, KeyRound, ShieldCheck, Sun, Moon, Bell } from 'lucide-react';
import { applyTheme, getInitialTheme, ThemeMode } from '../utils/theme';

interface HeaderProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenAuthModal: () => void;
  userSignedIn: boolean;
  userName: string;
  onSignOut?: () => void;
  unreadAnnouncementsCount?: number;
  onOpenAnnouncements?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSelectRole,
  onOpenAuthModal,
  userSignedIn,
  userName,
  onSignOut,
  unreadAnnouncementsCount = 0,
  onOpenAnnouncements,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());

  useEffect(() => {
    // Synchronize current theme on mount
    applyTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-[#D8DFEA] dark:border-slate-800 px-4 sm:px-8 py-3.5 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo & Tagline */}
        <button
          onClick={() => onSelectRole('hub')}
          className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-[#132C54] dark:bg-blue-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none">
              <path d="M20 3 C11 3 5 9 5 17c0 3 1 5.5 3 7.5L20 30l12-5.5c2-2 3-4.5 3-7.5C35 9 29 3 20 3Z" fill="#2F6FE0"/>
              <path d="M20 34c-3 0-5.5-2-5.5-4.5V21l5.5 2.5 5.5-2.5v8.5c0 2.5-2.5 4.5-5.5 4.5Z" fill="#CC9A2E"/>
            </svg>
          </div>
          <div>
            <div className="font-sora font-extrabold text-xl text-[#0B1D3A] dark:text-slate-100 tracking-tight flex items-center gap-1">
              iLearnit<span className="text-[#CC9A2E]">-365</span>
            </div>
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#4C5A75] dark:text-slate-400 font-semibold hidden sm:block">
              Learn. Grow. Achieve.
            </p>
          </div>
        </button>

        {/* Portal Switcher Nav Pill */}
        <nav className="hidden md:flex items-center gap-1 bg-[#ECF0F6] dark:bg-slate-800/90 p-1.5 rounded-full border border-[#D8DFEA] dark:border-slate-700">
          <button
            onClick={() => onSelectRole('hub')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              currentRole === 'hub'
                ? 'bg-[#132C54] dark:bg-blue-600 text-white shadow-sm'
                : 'text-[#4C5A75] dark:text-slate-300 hover:text-[#0B1D3A] dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Welcome Page</span>
          </button>

          <button
            onClick={() => onSelectRole('student')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              currentRole === 'student'
                ? 'bg-[#2F6FE0] text-white shadow-sm'
                : 'text-[#4C5A75] dark:text-slate-300 hover:text-[#0B1D3A] dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Dashboard</span>
            {!userSignedIn && <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.2 rounded font-bold">🔒 Registered</span>}
          </button>

          <button
            onClick={() => onSelectRole('teacher')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              currentRole === 'teacher'
                ? 'bg-[#2E9B58] text-white shadow-sm'
                : 'text-[#4C5A75] dark:text-slate-300 hover:text-[#0B1D3A] dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Teacher Portal</span>
            {!userSignedIn && <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.2 rounded font-bold">🔒 Registered</span>}
          </button>

          <button
            onClick={() => onSelectRole('jss_math')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              currentRole === 'jss_math'
                ? 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-sm'
                : 'text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>JSS Syllabus</span>
            {!userSignedIn && <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.2 rounded font-bold">🔒 Locked</span>}
          </button>

          <button
            onClick={() => onSelectRole('cyber_security')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              currentRole === 'cyber_security'
                ? 'bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-700 text-white shadow-sm ring-1 ring-cyan-400'
                : 'text-indigo-900 dark:text-indigo-200 bg-indigo-50/90 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Cybersecurity Course</span>
            {!userSignedIn && <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.2 rounded font-bold">🔒 Locked</span>}
          </button>

          <button
            onClick={() => onSelectRole('cbt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              currentRole === 'cbt'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm ring-1 ring-emerald-400'
                : 'text-emerald-900 dark:text-emerald-200 bg-emerald-50/90 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>CBT Exam Suite</span>
            {!userSignedIn && <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.2 rounded font-bold">🔒 Locked</span>}
          </button>

          <button
            onClick={() => onSelectRole(currentRole === 'register' ? 'register' : 'login')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              currentRole === 'login' || currentRole === 'register'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-900 dark:text-amber-200 bg-amber-100/80 dark:bg-amber-950/40 hover:bg-amber-200 dark:hover:bg-amber-900/50'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{currentRole === 'register' ? 'Registration Portal' : 'Sign In / Register'}</span>
          </button>
        </nav>

        {/* User Account / Theme Switcher / Sign In */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Announcements Notification Bell */}
          <button
            id="header-announcements-bell-btn"
            onClick={onOpenAnnouncements || (() => onSelectRole('student'))}
            aria-label="Campus Announcements"
            title={unreadAnnouncementsCount > 0 ? `${unreadAnnouncementsCount} unread announcements` : 'Campus Announcements'}
            className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F6F8FB] dark:bg-slate-800 border border-[#D8DFEA] dark:border-slate-700 hover:border-amber-500 text-[#0B1D3A] dark:text-slate-200 transition-all cursor-pointer shadow-sm hover:scale-105"
          >
            <Bell className={`w-4 h-4 ${unreadAnnouncementsCount > 0 ? 'text-amber-500 animate-bounce' : 'text-slate-500 dark:text-slate-400'}`} />
            {unreadAnnouncementsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {unreadAnnouncementsCount > 9 ? '9+' : unreadAnnouncementsCount}
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={handleToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode (Updates Root CSS variables)`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full bg-[#F6F8FB] dark:bg-slate-800 border border-[#D8DFEA] dark:border-slate-700 hover:border-[#132C54] dark:hover:border-blue-400 text-[#0B1D3A] dark:text-slate-200 transition-all cursor-pointer shadow-sm hover:scale-105"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 hover:rotate-12" />
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 hidden lg:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow transition-transform duration-300" />
                <span className="text-[11px] font-bold text-amber-300 hidden lg:inline">Light</span>
              </>
            )}
          </button>

          {/* AI Active Indicator */}
          <div className="hidden lg:flex items-center gap-2 bg-[#2E9B58]/10 dark:bg-emerald-950/50 text-[#2E9B58] dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold border border-[#2E9B58]/20 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Secured</span>
          </div>

          {userSignedIn ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-[#F6F8FB] dark:bg-slate-800 border border-[#D8DFEA] dark:border-slate-700 hover:border-[#132C54] dark:hover:border-blue-400 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#0B1D3A] dark:text-slate-200 transition-colors cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-[#132C54] dark:bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {userName.charAt(0)}
                </div>
                <span>{userName}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-[#ECF0F6] dark:border-slate-800">
                    <p className="text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400 font-bold">Authenticated User</p>
                    <p className="text-xs font-bold text-[#0B1D3A] dark:text-slate-100 truncate">{userName}</p>
                  </div>
                  <button
                    onClick={() => {
                      onSelectRole('student');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#0B1D3A] dark:text-slate-200 hover:bg-[#F6F8FB] dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-[#2F6FE0]" /> Student Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onSelectRole('teacher');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#0B1D3A] dark:text-slate-200 hover:bg-[#F6F8FB] dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#2E9B58]" /> Teacher Portal
                  </button>
                  <button
                    onClick={() => {
                      onSelectRole('jss_math');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#0B1D3A] dark:text-slate-200 hover:bg-[#F6F8FB] dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#2F6FE0]" /> JSS Course Outlines
                  </button>
                  <button
                    onClick={() => {
                      onSelectRole('cyber_security');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-indigo-900 dark:text-indigo-300 font-bold hover:bg-indigo-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" /> Cybersecurity Academy & Tests
                  </button>
                  <button
                    onClick={() => {
                      onSelectRole('cbt');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-emerald-900 dark:text-emerald-300 font-bold hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Universal CBT Exam Suite
                  </button>
                  <div className="border-t border-[#ECF0F6] dark:border-slate-800 my-1"></div>
                  <button
                    onClick={() => {
                      if (onSignOut) onSignOut();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 cursor-pointer font-bold"
                  >
                    Sign Out Account
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectRole('register')}
                className={`font-sora text-xs font-bold px-3 sm:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  currentRole === 'register' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-200 dark:border-blue-800'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-gold" />
                <span>Register / Get PIN</span>
              </button>

              <button
                onClick={() => onSelectRole('login')}
                className="font-sora text-xs font-semibold text-[#132C54] dark:text-slate-200 border border-[#D8DFEA] dark:border-slate-700 hover:border-[#132C54] dark:hover:border-blue-400 hover:bg-[#132C54] dark:hover:bg-blue-600 hover:text-white px-3 sm:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" /> 
                <span className="hidden sm:inline">Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
