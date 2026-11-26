import React, { useState, useEffect, useMemo } from 'react';
import { UserRole } from '../types';
import { 
  Compass, Search, LayoutGrid, GraduationCap, Users, Shield, 
  Sparkles, Award, Calculator, HelpCircle, Lock, Cloud, Terminal, 
  ChevronRight, ArrowLeft, ArrowRight, Zap, Check, Command,
  BookOpen, Layers, ShieldCheck, HeartHandshake, Eye
} from 'lucide-react';

interface SwiftPageNavigatorProps {
  currentRole: UserRole;
  onNavigate: (role: UserRole) => void;
  userSignedIn?: boolean;
}

interface DestinationItem {
  id: UserRole;
  label: string;
  category: 'core' | 'learning' | 'academic' | 'admin';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badge?: string;
  isProtected?: boolean;
}

const DESTINATIONS: DestinationItem[] = [
  {
    id: 'hub',
    label: 'Main Portals Hub',
    category: 'core',
    description: 'Central directory for all learners, educators, parents, and administrators.',
    icon: LayoutGrid,
    accentColor: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'student',
    label: 'Student Portal',
    category: 'core',
    description: 'Personalized dashboard, active enrollments, course progression, and schedule.',
    icon: GraduationCap,
    accentColor: 'from-blue-500 to-cyan-500',
    badge: 'Popular',
  },
  {
    id: 'teacher',
    label: 'Teacher Portal',
    category: 'core',
    description: 'Class rosters, lesson distribution, grading analytics, and student progress tracking.',
    icon: Users,
    accentColor: 'from-purple-600 to-indigo-600',
  },
  {
    id: 'parent',
    label: 'Parent & Guardian Portal',
    category: 'core',
    description: 'Real-time academic performance, attendance records, and direct educator messaging.',
    icon: HeartHandshake,
    accentColor: 'from-amber-500 to-orange-500',
  },
  {
    id: 'jamb_driller',
    label: 'JAMB Learning Center & Test Driller',
    category: 'learning',
    description: 'Compiled JAMB scheme (Science, Arts, Commercial) and 2000–2025 UTME past questions.',
    icon: BookOpen,
    accentColor: 'from-emerald-600 to-green-700',
    badge: '2000–2025',
  },
  {
    id: 'privacy_center',
    label: 'Privacy Policy & Minor Consent Center',
    category: 'academic',
    description: 'Data protection details (NDPA, COPPA, GDPR), minor consent policy, and JSON export/delete.',
    icon: ShieldCheck,
    accentColor: 'from-teal-600 to-emerald-700',
    badge: 'NDPA / GDPR',
  },
  {
    id: 'study_hub',
    label: 'Study Hub & E2EE Chat',
    category: 'learning',
    description: 'Zero-knowledge encrypted peer discussions, AI study scheduler, and smart notes.',
    icon: Lock,
    accentColor: 'from-emerald-600 to-teal-600',
    badge: 'E2EE Secure',
  },
  {
    id: 'jss_math',
    label: 'JSS 1–3 All Subjects Syllabus',
    category: 'learning',
    description: 'Complete NERDC Junior Secondary School 1–3 subjects, termly topics, and math voice tutor.',
    icon: BookOpen,
    accentColor: 'from-indigo-600 to-blue-600',
    badge: 'JSS 1–3',
  },
  {
    id: 'cyber_security',
    label: 'Cybersecurity Explorer & Lab',
    category: 'learning',
    description: 'Hands-on zero-trust lab, packet analysis, cryptography simulators, and defense grading.',
    icon: Terminal,
    accentColor: 'from-cyan-600 to-blue-700',
    badge: 'Hands-on Lab',
  },
  {
    id: 'cbt',
    label: 'CBT Exam Suite',
    category: 'academic',
    description: 'Timed examination terminal, live question navigation, instant grading, and audio proctoring.',
    icon: Sparkles,
    accentColor: 'from-cyan-500 to-indigo-600',
    badge: 'Live CBT',
  },
  {
    id: 'results',
    label: 'Academic Results Hub',
    category: 'academic',
    description: 'Comprehensive term transcripts, WAEC/JAMB/JSS score breakdowns, and performance analytics.',
    icon: Award,
    accentColor: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'cgpa',
    label: 'CGPA & GPA Calculator',
    category: 'academic',
    description: 'Multi-grading scale calculator (4.0, 5.0 Nigerian standard), semester projection, and transcript export.',
    icon: Calculator,
    accentColor: 'from-emerald-500 to-green-600',
  },
  {
    id: 'support',
    label: 'Support & Help Desk',
    category: 'academic',
    description: 'Institutional ticketing, troubleshooting knowledge base, live chat, and FAQ directory.',
    icon: HelpCircle,
    accentColor: 'from-rose-500 to-pink-600',
  },

  {
    id: 'module_responses',
    label: 'Module Exploration & Responses',
    category: 'academic',
    description: 'Real-time diagnostic execution outputs, formulas, and verified response pages for all platform modules.',
    icon: Sparkles,
    accentColor: 'from-indigo-600 to-purple-600',
    badge: 'All Modules',
  }
];

export const SwiftPageNavigator: React.FC<SwiftPageNavigatorProps> = ({
  currentRole,
  onNavigate,
  userSignedIn = false,
}) => {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentHistory, setRecentHistory] = useState<UserRole[]>(['hub', 'student', 'study_hub']);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'learning' | 'academic'>('all');

  // Track recent navigation
  useEffect(() => {
    setRecentHistory(prev => {
      const filtered = prev.filter(r => r !== currentRole);
      return [currentRole, ...filtered].slice(0, 5);
    });
  }, [currentRole]);

  // Global Keyboard Shortcut (Cmd/Ctrl + K or Alt + P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || 
        item.label.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const handleSelect = (role: UserRole) => {
    onNavigate(role);
    setPaletteOpen(false);
    setSearchQuery('');
  };

  const currentDestination = DESTINATIONS.find(d => d.id === currentRole) || DESTINATIONS[0];

  return (
    <>
      {/* Friendly Breadcrumb & Swift Switch Bar */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-2 sticky top-[57px] z-30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Breadcrumb Path with Swift Navigation Button */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar">
            <button
              onClick={() => onNavigate('hub')}
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium flex items-center gap-1 transition cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Portals</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            
            <span className="text-slate-400 uppercase font-mono text-[10px] tracking-wider shrink-0">
              {currentDestination.category}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            
            <div className="flex items-center gap-1.5 font-sora font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
              <currentDestination.icon className="w-3.5 h-3.5 text-indigo-500" />
              <span>{currentDestination.label}</span>
            </div>
          </div>

          {/* Swift Quick Jump Pills & Command Palette Launcher */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Quick Pills for Frequently Accessed Learning Tools */}
            <div className="hidden md:flex items-center gap-1.5">
              {[
                { id: 'jss_math' as UserRole, label: 'JSS 1–3' },
                { id: 'jamb_driller' as UserRole, label: 'JAMB' },
                { id: 'cyber_security' as UserRole, label: 'Cyber Lab' },
                { id: 'cbt' as UserRole, label: 'CBT Suite' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => onNavigate(p.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                    currentRole === p.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Swift Navigator Launcher Button */}
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-sora font-bold shadow-sm transition active:scale-95 cursor-pointer"
              title="Swift Navigator (Ctrl/Cmd + K)"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Swift Navigator</span>
              <kbd className="hidden sm:inline-block bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-mono">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Swift Command Palette Modal */}
      {paletteOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 animate-fadeIn"
          onClick={() => setPaletteOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-950/50">
              <Search className="w-5 h-5 text-indigo-500 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Jump swiftly to any page, portal, lab, or academic tool..."
                className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  Clear
                </button>
              )}
              <kbd className="text-[11px] font-mono text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-md">
                ESC
              </kbd>
            </div>

            {/* Category Filter Chips */}
            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-2 overflow-x-auto text-xs scrollbar">
              <span className="text-slate-400 font-medium shrink-0">Filter:</span>
              {[
                { id: 'all', label: `All Pages (${DESTINATIONS.length})` },
                { id: 'core', label: 'Core Portals' },
                { id: 'learning', label: 'Learning & Labs' },
                { id: 'academic', label: 'Academic Tools' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as any)}
                  className={`px-3 py-1 rounded-full font-medium transition shrink-0 cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Destination List */}
            <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1.5 scrollbar">
              {filteredDestinations.length === 0 ? (
                <div className="text-center py-10 text-slate-400 space-y-2">
                  <Compass className="w-10 h-10 mx-auto text-indigo-400 opacity-50" />
                  <p className="text-sm font-medium">No destinations match "{searchQuery}"</p>
                  <p className="text-xs text-slate-500">Try searching for "Math", "CBT", "Security", or "CGPA".</p>
                </div>
              ) : (
                filteredDestinations.map((item, idx) => {
                  const isCurrent = currentRole === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full text-left p-3 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-300 dark:border-indigo-700/60 ring-1 ring-indigo-400'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.accentColor} flex items-center justify-center text-white shadow-md shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-sora font-bold text-sm text-slate-900 dark:text-white truncate">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                                {item.badge}
                              </span>
                            )}
                            {isCurrent && (
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                <Check className="w-3 h-3" /> Active View
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-mono text-slate-400 uppercase hidden sm:block">
                          /{item.id}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Hints */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span>Tip: Press <kbd className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700">⌘K</kbd> anywhere to navigate swiftly.</span>
              </div>
              <span className="text-[11px] text-slate-400">
                iLearnit-365 Smart Navigator
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
