import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { 
  User, LogIn, Sparkles, BookOpen, GraduationCap, Users, 
  LayoutGrid, CheckCircle, KeyRound, ShieldCheck, Shield, 
  Sun, Moon, Bell, Lock, Palette, ChevronDown, Award,
  Calculator, HelpCircle, Cloud, Terminal, Menu, X,
  Layers, ExternalLink
} from 'lucide-react';
import { applyTheme, getInitialTheme, ThemeMode, THEME_OPTIONS } from '../utils/theme';

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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleSelectTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    setThemePickerOpen(false);
  };

  const currentThemeOption = THEME_OPTIONS.find(t => t.id === theme) || THEME_OPTIONS[0];

  const handleNavigate = (role: UserRole) => {
    onSelectRole(role);
    setPagesDropdownOpen(false);
    setMobileNavOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-[#D8DFEA] dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand Logo & Tagline */}
        <button
          onClick={() => handleNavigate('hub')}
          className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer shrink-0"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 group-hover:shadow-blue-500/30 transition-all border border-blue-500/30 bg-slate-900 p-0.5">
            <img
              src="/src/assets/images/ilearnit_logo_1786816502338.jpg"
              alt="iLearnit-365 Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div>
            <div className="font-sora font-extrabold text-lg sm:text-xl text-[#0B1D3A] dark:text-slate-100 tracking-tight flex items-center gap-1">
              iLearnit<span className="text-[#CC9A2E]">-365</span>
            </div>
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#4C5A75] dark:text-slate-400 font-semibold hidden md:block">
              Learn. Grow. Achieve.
            </p>
          </div>
        </button>

        {/* Primary Desktop Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F1F4F9] dark:bg-slate-800/90 p-1.5 rounded-full border border-[#D8DFEA] dark:border-slate-700 text-xs shadow-xs">
          
          <button
            onClick={() => handleNavigate('hub')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold transition cursor-pointer ${
              currentRole === 'hub'
                ? 'bg-[#132C54] dark:bg-blue-600 text-white shadow-sm font-bold'
                : 'text-[#4C5A75] dark:text-slate-300 hover:text-[#0B1D3A] dark:hover:text-white hover:bg-white/70 dark:hover:bg-slate-700'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNavigate('student')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold transition cursor-pointer ${
              currentRole === 'student'
                ? 'bg-[#2F6FE0] text-white shadow-sm font-bold'
                : 'text-[#4C5A75] dark:text-slate-300 hover:text-[#0B1D3A] dark:hover:text-white hover:bg-white/70 dark:hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigate('jamb_driller')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold transition cursor-pointer ${
              currentRole === 'jamb_driller'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-[#4C5A75] dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-white/70 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
            <span>JAMB Hub</span>
          </button>

          <button
            onClick={() => handleNavigate('study_hub')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold transition cursor-pointer ${
              currentRole === 'study_hub'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-[#4C5A75] dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-white/70 dark:hover:bg-slate-700'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Study Hub</span>
          </button>

          <button
            onClick={() => handleNavigate('cbt')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold transition cursor-pointer ${
              currentRole === 'cbt'
                ? 'bg-cyan-600 text-white shadow-sm font-bold'
                : 'text-[#4C5A75] dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-400 hover:bg-white/70 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>CBT Exams</span>
          </button>

          <button
            onClick={() => handleNavigate('results')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold transition cursor-pointer ${
              currentRole === 'results'
                ? 'bg-amber-600 text-white shadow-sm font-bold'
                : 'text-[#4C5A75] dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-white/70 dark:hover:bg-slate-700'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Transcripts</span>
          </button>

          {/* All Portals Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPagesDropdownOpen(!pagesDropdownOpen)}
              aria-expanded={pagesDropdownOpen}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full font-semibold transition cursor-pointer ${
                ['cgpa', 'support', 'teacher', 'parent', 'cyber_security', 'privacy_center'].includes(currentRole)
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-[#4C5A75] dark:text-slate-300 hover:text-[#0B1D3A] dark:hover:text-white hover:bg-white/70 dark:hover:bg-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Portals</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {/* Mega Dropdown Menu */}
            {pagesDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-3 z-50 animate-fadeIn space-y-3">
                
                {/* Section 1: Academic Tools */}
                <div>
                  <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase text-slate-400">
                    Academic Calculators & Help
                  </div>
                  <div className="space-y-0.5">
                    <button
                      onClick={() => handleNavigate('cgpa')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-sora font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-emerald-500" />
                        <span>CGPA & Honors Calculator</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">5.0 / 4.0</span>
                    </button>

                    <button
                      onClick={() => handleNavigate('support')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-sora font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-500" />
                        <span>Support & Help Desk</span>
                      </div>
                      <span className="text-[10px] font-mono text-blue-500 font-bold">24/7 AI</span>
                    </button>

                    <button
                      onClick={() => handleNavigate('cyber_security')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-sora font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-cyan-500" />
                      <span>Cybersecurity Curriculum Lab</span>
                    </button>
                  </div>
                </div>

                {/* Section 2: Institutional Roles */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                  <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase text-slate-400">
                    Institutional Portals
                  </div>
                  <div className="space-y-0.5">
                    <button
                      onClick={() => handleNavigate('teacher')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-sora font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      <span>Teacher & Classroom Portal</span>
                    </button>

                    <button
                      onClick={() => handleNavigate('parent')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-sora font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-amber-500" />
                      <span>Parent / Guardian Portal</span>
                    </button>

                    <button
                      onClick={() => handleNavigate('privacy_center')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-sora font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Privacy Policy &amp; Data Protection</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </nav>

        {/* Right Tools (Theme, Bell, Profile, Mobile Menu Button) */}
        <div className="flex items-center gap-2">

          {/* Announcements Notification Bell */}
          <button
            id="header-announcements-bell-btn"
            onClick={onOpenAnnouncements || (() => handleNavigate('student'))}
            aria-label="Campus Announcements"
            className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F6F8FB] dark:bg-slate-800 border border-[#D8DFEA] dark:border-slate-700 hover:border-amber-500 text-[#0B1D3A] dark:text-slate-200 transition-all cursor-pointer shadow-sm hover:scale-105"
          >
            <Bell className={`w-4 h-4 ${unreadAnnouncementsCount > 0 ? 'text-amber-500 animate-bounce' : 'text-slate-500 dark:text-slate-400'}`} />
            {unreadAnnouncementsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {unreadAnnouncementsCount > 9 ? '9+' : unreadAnnouncementsCount}
              </span>
            )}
          </button>

          {/* Theme Palette Picker */}
          <div className="relative">
            <button
              id="theme-palette-dropdown-btn"
              onClick={() => setThemePickerOpen(!themePickerOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F6F8FB] dark:bg-slate-800 border border-[#D8DFEA] dark:border-slate-700 hover:border-blue-500 text-[#0B1D3A] dark:text-slate-200 transition-all cursor-pointer shadow-sm"
            >
              <Palette className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span className="text-[11px] font-bold hidden sm:inline">{currentThemeOption.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {themePickerOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  Select Visual Atmosphere
                </div>
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectTheme(opt.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition cursor-pointer ${
                      theme === opt.id
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-sora font-semibold">{opt.name}</div>
                      <div className="text-[10px] text-slate-400">{opt.subtitle}</div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {opt.previewColors.slice(0, 3).map((c, i) => (
                        <span key={i} className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Sign In / Profile */}
          {userSignedIn ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-[#F6F8FB] dark:bg-slate-800 border border-[#D8DFEA] dark:border-slate-700 hover:border-[#132C54] dark:hover:border-blue-400 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#0B1D3A] dark:text-slate-200 transition-colors cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-[#132C54] dark:bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[100px] truncate hidden sm:inline">{userName || 'Active User'}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="font-semibold text-slate-900 dark:text-white">{userName || 'Scholar'}</p>
                    <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Authenticated ✓</p>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleNavigate('study_hub');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Lock className="w-3.5 h-3.5 text-emerald-500" /> Study Hub & E2EE Chat
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleNavigate('results');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-500" /> My Results & Transcripts
                  </button>
                  {onSignOut && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer border-t border-slate-100 dark:border-slate-700"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleNavigate('login')}
              className="bg-[#0B1D3A] dark:bg-blue-600 hover:bg-[#132C54] dark:hover:bg-blue-700 text-white font-sora font-semibold text-xs px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Responsive Navigation Drawer */}
      {mobileNavOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-fadeIn text-xs">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavigate('hub')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-sora font-bold text-left text-slate-800 dark:text-slate-200"
            >
              🏠 Welcome Hub
            </button>
            <button
              onClick={() => handleNavigate('student')}
              className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 font-sora font-bold text-left text-blue-700 dark:text-blue-300"
            >
              🎓 Student Portal
            </button>
            <button
              onClick={() => handleNavigate('study_hub')}
              className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 font-sora font-bold text-left text-emerald-700 dark:text-emerald-300"
            >
              🔐 Study & E2EE Chat
            </button>
            <button
              onClick={() => handleNavigate('cbt')}
              className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 font-sora font-bold text-left text-cyan-700 dark:text-cyan-300"
            >
              ⚡ CBT Exam Suite
            </button>
            <button
              onClick={() => handleNavigate('results')}
              className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 font-sora font-bold text-left text-amber-700 dark:text-amber-300"
            >
              📊 Results & Transcripts
            </button>
            <button
              onClick={() => handleNavigate('cgpa')}
              className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 font-sora font-bold text-left text-purple-700 dark:text-purple-300"
            >
              🧮 CGPA Calculator
            </button>
            <button
              onClick={() => handleNavigate('support')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-sora font-bold text-left text-slate-800 dark:text-slate-200"
            >
              🛟 Support & Advising
            </button>
            <button
              onClick={() => handleNavigate('jamb_driller')}
              className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 font-sora font-bold text-left text-emerald-800 dark:text-emerald-300"
            >
              🎯 JAMB Scheme &amp; Driller
            </button>
            <button
              onClick={() => handleNavigate('privacy_center')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-sora font-bold text-left text-slate-800 dark:text-slate-200"
            >
              🛡️ Privacy &amp; Minor Consent
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
