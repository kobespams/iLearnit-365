import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { 
  ChevronRight, ChevronLeft, LayoutGrid, ExternalLink, 
  Sparkles, Lock, ShieldCheck, Zap, Layers, Compass, 
  GraduationCap, Users, HeartHandshake, BookOpen, Terminal, 
  Award, Calculator, HelpCircle, Cloud, Shield, Check,
  Search, Maximize2, Minimize2, ArrowRight, ArrowLeft
} from 'lucide-react';

interface HubNavigationHeaderProps {
  currentRole: UserRole;
  onNavigateRole: (role: UserRole) => void;
  onOpenModuleResponses?: (moduleKey?: string) => void;
  onOpenSeparatePage?: (role: UserRole) => void;
  isStandaloneMode?: boolean;
}

interface HubMeta {
  id: UserRole;
  label: string;
  category: 'Core Portals' | 'Learning & Labs' | 'Academic Tools' | 'Admin & Enclave';
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  isProtected?: boolean;
}

export const ALL_HUBS: HubMeta[] = [
  { id: 'hub', label: 'Main Portals Directory', category: 'Core Portals', icon: LayoutGrid, accentColor: 'text-blue-500' },
  { id: 'student', label: 'Student Portal', category: 'Core Portals', badge: 'Active Scholar', icon: GraduationCap, accentColor: 'text-blue-400' },
  { id: 'teacher', label: 'Teacher Portal', category: 'Core Portals', badge: 'Educator', icon: Users, accentColor: 'text-purple-400' },
  { id: 'parent', label: 'Parent & Guardian Portal', category: 'Core Portals', badge: 'Guardian', icon: HeartHandshake, accentColor: 'text-amber-400' },
  
  { id: 'jamb_driller', label: 'JAMB Scheme & Test Driller (2000–2025)', category: 'Learning & Labs', badge: 'UTME 400', icon: BookOpen, accentColor: 'text-emerald-500' },
  { id: 'study_hub', label: 'Study Hub & E2EE Chat', category: 'Learning & Labs', badge: 'E2EE Secure', icon: Lock, accentColor: 'text-emerald-400' },
  { id: 'jss_math', label: 'JSS 1–3 All Subjects Syllabus', category: 'Learning & Labs', badge: 'NERDC JSS 1–3', icon: BookOpen, accentColor: 'text-indigo-400' },
  { id: 'cyber_security', label: 'Cybersecurity Explorer & Lab', category: 'Learning & Labs', badge: 'Zero-Trust Lab', icon: Terminal, accentColor: 'text-cyan-400' },
  { id: 'cbt', label: 'National CBT Exam Suite', category: 'Learning & Labs', badge: 'Timed CBT', icon: Sparkles, accentColor: 'text-yellow-400' },
  
  { id: 'results', label: 'Academic Results & Transcript Hub', category: 'Academic Tools', badge: 'Official Slip', icon: Award, accentColor: 'text-amber-400' },
  { id: 'cgpa', label: 'CGPA & Honors Projector', category: 'Academic Tools', badge: '5.0 / 4.0 Scale', icon: Calculator, accentColor: 'text-purple-400' },
  { id: 'support', label: 'Support & AI Help Desk', category: 'Academic Tools', badge: '24/7 Live', icon: HelpCircle, accentColor: 'text-rose-400' },
  { id: 'privacy_center', label: 'Privacy Policy & Minor Consent Center', category: 'Academic Tools', badge: 'NDPA / GDPR', icon: ShieldCheck, accentColor: 'text-emerald-500' },
];

export const HubNavigationHeader: React.FC<HubNavigationHeaderProps> = ({
  currentRole,
  onNavigateRole,
  onOpenModuleResponses,
  onOpenSeparatePage,
  isStandaloneMode = false,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentIndex = ALL_HUBS.findIndex(h => h.id === currentRole);
  const currentHub = ALL_HUBS[currentIndex] || ALL_HUBS[0];

  // Previous & Next navigation
  const prevHub = currentIndex > 0 ? ALL_HUBS[currentIndex - 1] : ALL_HUBS[ALL_HUBS.length - 1];
  const nextHub = currentIndex < ALL_HUBS.length - 1 ? ALL_HUBS[currentIndex + 1] : ALL_HUBS[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('#hub-nav-dropdown-container')) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }
  }, [dropdownOpen]);

  const filteredHubs = ALL_HUBS.filter(h => 
    !searchQuery || 
    h.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.badge?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLaunchSeparatePage = (role: UserRole) => {
    if (onOpenSeparatePage) {
      onOpenSeparatePage(role);
    } else {
      const url = `${window.location.origin}${window.location.pathname}?hub=${role}&mode=standalone`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const isBackendHub = ['admin', 'cheal_hub', 'ilearnit_security', 'deployment'].includes(currentRole);

  return (
    <div className="bg-white/95 dark:bg-[#0B1528]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* LEFT: Breadcrumb Navigation & Hub Selector Trigger */}
        <div className="flex items-center gap-2 min-w-0" id="hub-nav-dropdown-container">
          
          {/* Main Hub Return */}
          <button
            onClick={() => onNavigateRole('hub')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition cursor-pointer shrink-0"
            title="Return to Main Portals Hub"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline font-sora">Portals</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

          {/* Category Tag */}
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 hidden md:inline shrink-0">
            {currentHub.category}
          </span>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden md:inline shrink-0" />

          {/* Interactive Active Hub Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100/80 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 text-indigo-900 dark:text-white border border-indigo-200/80 dark:border-slate-700 px-3 py-1.5 rounded-xl font-sora font-bold text-xs transition cursor-pointer shadow-sm group"
              title="Click to quickly switch between all platform hubs"
            >
              <currentHub.icon className={`w-4 h-4 ${currentHub.accentColor}`} />
              <span className="truncate max-w-[150px] sm:max-w-[220px]">{currentHub.label}</span>
              {currentHub.badge && (
                <span className="text-[9px] font-mono font-bold bg-indigo-600 dark:bg-indigo-500 text-white px-1.5 py-0.5 rounded-full hidden sm:inline">
                  {currentHub.badge}
                </span>
              )}
              <ChevronRight className={`w-3.5 h-3.5 text-indigo-500 transition-transform ${dropdownOpen ? 'rotate-90' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-xl text-xs">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter all platform hubs..."
                      className="w-full bg-transparent text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none text-xs"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto p-2 space-y-1 scrollbar">
                  {filteredHubs.map((hub) => {
                    const isSelected = hub.id === currentRole;
                    const Icon = hub.icon;
                    return (
                      <div
                        key={hub.id}
                        className={`flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                        }`}
                        onClick={() => {
                          onNavigateRole(hub.id);
                          setDropdownOpen(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 ${hub.accentColor}`} />
                          <div className="min-w-0">
                            <div className="text-xs truncate flex items-center gap-1.5">
                              <span>{hub.label}</span>
                              {hub.isProtected && (
                                <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {hub.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Page-to-Page Hub Navigation</span>
                  <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {ALL_HUBS.length} Hubs Online
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER / RIGHT: Navigation Controls, Module Explorer, and Standalone Launcher */}
        <div className="flex items-center gap-2 ml-auto">
          
          {/* Previous / Next Page Cycle Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onNavigateRole(prevHub.id)}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-lg transition cursor-pointer"
              title={`Previous Page: ${prevHub.label}`}
            >
              <ArrowLeft className="w-3 h-3 text-indigo-500" />
              <span className="hidden lg:inline">{prevHub.label.split(' ')[0]}</span>
            </button>
            <div className="w-[1px] h-3 bg-slate-300 dark:bg-slate-700" />
            <button
              onClick={() => onNavigateRole(nextHub.id)}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-lg transition cursor-pointer"
              title={`Next Page: ${nextHub.label}`}
            >
              <span className="hidden lg:inline">{nextHub.label.split(' ')[0]}</span>
              <ArrowRight className="w-3 h-3 text-indigo-500" />
            </button>
          </div>

          {/* Module Response Explorer Button */}
          {onOpenModuleResponses && (
            <button
              onClick={() => onOpenModuleResponses()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-sora font-bold shadow-sm transition active:scale-95 cursor-pointer"
              title="Explore live response pages for all platform modules & tools"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">Module Responses</span>
              <span className="sm:hidden">Responses</span>
            </button>
          )}

          {/* Open Backend / Analytical Hub in Separate Page */}
          <button
            onClick={() => handleLaunchSeparatePage(currentRole)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
              isBackendHub 
                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
            title={isBackendHub ? "Open this administrative backend in a separate dedicated window" : "Open current hub in a separate browser tab"}
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden md:inline">{isBackendHub ? 'Separate Window' : 'Pop-Out'}</span>
          </button>

          {/* Standalone Workstation Indicator (if in standalone mode) */}
          {isStandaloneMode && (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Standalone Workstation</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
