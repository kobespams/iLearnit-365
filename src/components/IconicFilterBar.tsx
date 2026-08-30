import React from 'react';
import {
  Search,
  Grid,
  List,
  FileText,
  SlidersHorizontal,
  Sparkles,
  Layers,
  CheckCircle2,
  X
} from 'lucide-react';
import { COURSE_ICON_REGISTRY, CourseIconMeta } from '../utils/courseIconRegistry';

export type ResourceTypeFilter = 'all' | 'txt_doc' | 'interactive_lab' | 'cbt_test' | 'assignment' | 'syllabus';
export type ViewDisplayMode = 'grid' | 'list' | 'plaintext';

interface IconicFilterBarProps {
  selectedSubject: string; // 'all' or subject id like 'math', 'cs', 'cyber', etc.
  onSelectSubject: (subjectId: string) => void;
  selectedResourceType?: ResourceTypeFilter;
  onSelectResourceType?: (type: ResourceTypeFilter) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  viewMode?: ViewDisplayMode;
  onViewModeChange?: (mode: ViewDisplayMode) => void;
  onSelectViewMode?: (mode: ViewDisplayMode) => void;
  subjectCounts?: Record<string, number>;
  totalCount?: number;
  showResourceTypeFilter?: boolean;
  showResourceTypeTabs?: boolean;
  showViewModeToggle?: boolean;
  showViewModeToggles?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
}

export const IconicFilterBar: React.FC<IconicFilterBarProps> = ({
  selectedSubject,
  onSelectSubject,
  selectedResourceType = 'all',
  onSelectResourceType,
  searchQuery = '',
  onSearchChange,
  viewMode = 'grid',
  onViewModeChange,
  onSelectViewMode,
  subjectCounts = {},
  totalCount,
  showResourceTypeFilter = true,
  showResourceTypeTabs = true,
  showViewModeToggle = true,
  showViewModeToggles = true,
  placeholder,
  searchPlaceholder,
  className = '',
}) => {
  const subjects = Object.values(COURSE_ICON_REGISTRY);

  const effectivePlaceholder = searchPlaceholder || placeholder || 'Filter modules, topics, formulas, or assignments...';
  const effectiveShowResourceTypes = showResourceTypeFilter && showResourceTypeTabs;
  const effectiveShowViewModes = showViewModeToggle && showViewModeToggles;
  const handleViewModeChange = onSelectViewMode || onViewModeChange;

  const resourceTypes: { id: ResourceTypeFilter; label: string; icon: string }[] = [
    { id: 'all', label: 'All Resources', icon: '📂' },
    { id: 'txt_doc', label: 'Plain Text Docs (.txt)', icon: '📄' },
    { id: 'cbt_test', label: 'CBT Drills & Exams', icon: '⏱️' },
    { id: 'interactive_lab', label: 'Interactive Labs', icon: '🧪' },
    { id: 'assignment', label: 'Assignments', icon: '📝' },
    { id: 'syllabus', label: 'Curriculum Schemes', icon: '📚' },
  ];

  return (
    <div className={`flex flex-col gap-3.5 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs ${className}`}>
      {/* Top Row: Search Input & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder={effectivePlaceholder}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchQuery && onSearchChange && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode Switcher & Counter */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end shrink-0">
          {totalCount !== undefined && (
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-900 dark:text-slate-100 font-bold">{totalCount}</span> items active
            </div>
          )}

          {effectiveShowViewModes && handleViewModeChange && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Grid Card View"
                aria-label="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Compact Iconic List View"
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleViewModeChange('plaintext')}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'plaintext'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Plain Text Documents (.txt) View"
                aria-label="Plain Text View"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">.TXT View</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Iconic Subject Filter Badges */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Subject Iconic Mode</span>
          </span>
          {selectedSubject !== 'all' && (
            <button
              onClick={() => onSelectSubject('all')}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              Reset to All Subjects
            </button>
          )}
        </div>

        {/* Scrollable / Wrap Iconic Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {/* "All Subjects" button */}
          <button
            onClick={() => onSelectSubject('all')}
            className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              selectedSubject === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs scale-102'
                : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Courses</span>
            {subjectCounts['all'] !== undefined && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/60 dark:bg-slate-700/60 font-mono">
                {subjectCounts['all']}
              </span>
            )}
          </button>

          {/* Render All Registered Course Icons */}
          {subjects.map((sub) => {
            const Icon = sub.icon;
            const isSelected = selectedSubject === sub.id;
            const count = subjectCounts[sub.id];

            return (
              <button
                key={sub.id}
                onClick={() => onSelectSubject(sub.id)}
                className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? `${sub.badgeBg} ${sub.borderColor} ${sub.textColor} ring-2 ring-blue-500/30 font-bold shadow-xs scale-102`
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
                title={sub.description}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? sub.colorClass : 'text-slate-500'}`} />
                <span>{sub.name}</span>
                {count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-white/80 dark:bg-slate-900/80' : 'bg-slate-200/60 dark:bg-slate-800/80 text-slate-500'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 3: Resource Format Sub-filter (Optional) */}
      {effectiveShowResourceTypes && onSelectResourceType && (
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-100 dark:border-slate-800/70">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1.5 shrink-0">
            Format:
          </span>
          {resourceTypes.map((rt) => {
            const isSelected = selectedResourceType === rt.id;
            return (
              <button
                key={rt.id}
                onClick={() => onSelectResourceType(rt.id)}
                className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{rt.icon}</span>
                <span>{rt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
