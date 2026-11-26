import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Download,
  CheckCircle2,
  GraduationCap,
  Layers,
  Calculator,
  Sparkles,
  Send,
} from 'lucide-react';
import { JSSLevel, JSSLessonTopic } from '../types';
import { JSS_ALL_SUBJECTS_SYLLABUS, JSSClassSubjectEntry } from '../data/jssAllSubjectsSyllabus';
import { JSSMathExplorer } from './JSSMathExplorer';
import {
  isPackSavedOffline,
  savePackOffline,
  removeOfflinePack,
} from '../services/offlineCacheService';

interface JSSAllSubjectsExplorerProps {
  defaultLevel?: JSSLevel;
  onAssignSubjectToClass?: (subject: JSSClassSubjectEntry, level: JSSLevel) => void;
  onAssignToClass?: (lesson: JSSLessonTopic) => void;
}

export const JSSAllSubjectsExplorer: React.FC<JSSAllSubjectsExplorerProps> = ({
  defaultLevel = 'JSS1',
  onAssignSubjectToClass,
  onAssignToClass,
}) => {
  const [viewMode, setViewMode] = useState<'all_subjects' | 'math_voice_tutor'>('all_subjects');
  const [selectedLevel, setSelectedLevel] = useState<JSSLevel>(defaultLevel);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTerm, setSelectedTerm] = useState<'all' | 1 | 2 | 3>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [offlineTick, setOfflineTick] = useState(0);

  const classSyllabus = JSS_ALL_SUBJECTS_SYLLABUS[selectedLevel];

  const filteredSubjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return classSyllabus.subjects.filter((s) => {
      const catMatch = selectedCategory === 'All' || s.category === selectedCategory;
      if (!catMatch) return false;
      if (!q) return true;
      return (
        s.subjectName.toLowerCase().includes(q) ||
        s.subjectCode.toLowerCase().includes(q) ||
        s.overview.toLowerCase().includes(q) ||
        s.competencies.some((c) => c.toLowerCase().includes(q)) ||
        s.termTopics.some(
          (t) =>
            t.topicTitle.toLowerCase().includes(q) ||
            t.subtopics.some((st) => st.toLowerCase().includes(q))
        )
      );
    });
  }, [classSyllabus.subjects, selectedCategory, searchQuery]);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(classSyllabus.subjects[0].id);

  const activeSubject =
    filteredSubjects.find((s) => s.id === selectedSubjectId) ||
    filteredSubjects[0] ||
    classSyllabus.subjects[0];

  const handleSelectLevel = (lvl: JSSLevel) => {
    setSelectedLevel(lvl);
    const first = JSS_ALL_SUBJECTS_SYLLABUS[lvl].subjects[0];
    setSelectedSubjectId(first.id);
  };

  const handleToggleOfflineSubject = (subj: JSSClassSubjectEntry) => {
    const packId = `jss-syllabus-${selectedLevel.toLowerCase()}-${subj.id}`;
    if (isPackSavedOffline(packId)) {
      removeOfflinePack(packId);
    } else {
      savePackOffline({
        id: packId,
        title: `${selectedLevel} ${subj.subjectName} (${subj.subjectCode})`,
        category: 'JSS Syllabus',
        stream: selectedLevel,
        itemCount: subj.termTopics.length,
        payload: subj,
      });
    }
    setOfflineTick((t) => t + 1);
  };

  // Re-evaluate offline status reactively
  const activeOfflinePackId = `jss-syllabus-${selectedLevel.toLowerCase()}-${activeSubject.id}`;
  const isActiveSavedOffline = useMemo(
    () => isPackSavedOffline(activeOfflinePackId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeOfflinePackId, offlineTick]
  );

  if (viewMode === 'math_voice_tutor') {
    return (
      <div className="space-y-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setViewMode('all_subjects')}
            className="px-4 py-2 rounded-xl bg-[#0B1D3A] hover:bg-[#132C54] text-white text-xs font-sora font-bold cursor-pointer inline-flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-amber-300" />
            <span>← Back to All JSS 1–3 Subjects (New NERDC Syllabus)</span>
          </button>
        </div>
        <JSSMathExplorer onAssignToClass={onAssignToClass} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <section className="bg-[#0B1D3A] text-slate-100 rounded-3xl p-6 sm:p-8 border border-blue-500/30 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
              <span>New Nigerian Education Syllabus (NERDC)</span>
              <span aria-hidden="true">•</span>
              <span>JSS 1 · JSS 2 · JSS 3</span>
            </div>
            <h1 className="font-sora font-extrabold text-2xl sm:text-3xl text-white">
              Junior Secondary (JSS 1–3) Complete Subjects Syllabus
            </h1>
            <p className="text-sm text-slate-200 leading-relaxed">
              {classSyllabus.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('math_voice_tutor')}
              className="bg-amber-400 hover:bg-amber-300 text-[#0B1D3A] font-sora font-extrabold text-xs px-4 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Calculator className="w-4 h-4" />
              <span>Interactive JSS Math Voice Tutor</span>
            </button>
          </div>
        </div>

        {/* Class Level Switcher: JSS 1, JSS 2, JSS 3 */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/15 pt-4">
          {(['JSS1', 'JSS2', 'JSS3'] as JSSLevel[]).map((lvl) => {
            const count = JSS_ALL_SUBJECTS_SYLLABUS[lvl].subjects.length;
            const active = selectedLevel === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => handleSelectLevel(lvl)}
                className={`px-4 py-2.5 rounded-xl text-xs font-sora font-bold transition cursor-pointer flex items-center gap-2 ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-300'
                    : 'bg-white/10 text-slate-100 hover:bg-white/20'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-amber-300" />
                <span>{lvl} ({count} Subjects)</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Split View: Subject List & Termly New Syllabus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Filters & Subject Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-sm">
            <div>
              <label htmlFor="jss-subject-search" className="block text-xs font-sora font-bold text-[#0B1D3A] dark:text-slate-100 mb-1.5">
                Search {selectedLevel} Subjects or Topics
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="jss-subject-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., Algebra, History, Python, Adire..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <span className="block text-xs font-sora font-bold text-[#0B1D3A] dark:text-slate-100 mb-2">
                Subject Track
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Core', 'STEM & Technology', 'Humanities & Values', 'Vocational & Business'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#0B1D3A] text-white border-[#0B1D3A]'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredSubjects.map((subj) => {
                const isSelected = activeSubject.id === subj.id;
                const saved = isPackSavedOffline(`jss-syllabus-${selectedLevel.toLowerCase()}-${subj.id}`);
                return (
                  <button
                    key={subj.id}
                    type="button"
                    onClick={() => setSelectedSubjectId(subj.id)}
                    className={`w-full text-left p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-[#0B1D3A] dark:text-white font-bold'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg shrink-0" aria-hidden="true">{subj.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-sora font-bold truncate">{subj.subjectName}</div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          {subj.subjectCode} • {subj.termTopics.length} Terms
                        </div>
                      </div>
                    </div>
                    {saved && (
                      <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-700 shrink-0">
                        Offline ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Detail Panel */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="font-bold text-blue-700 dark:text-blue-300">{selectedLevel} • {activeSubject.subjectCode}</span>
                  <span aria-hidden="true">•</span>
                  <span className="text-slate-600 dark:text-slate-300">{activeSubject.category}</span>
                </div>
                <h2 className="font-sora font-extrabold text-2xl text-[#0B1D3A] dark:text-white flex items-center gap-2.5">
                  <span aria-hidden="true">{activeSubject.icon}</span>
                  <span>{activeSubject.subjectName}</span>
                </h2>
                <p className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300">
                  {activeSubject.nerdcStrand}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                  {activeSubject.overview}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleOfflineSubject(activeSubject)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-sora font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                    isActiveSavedOffline
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-[#0B1D3A] dark:text-slate-100 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isActiveSavedOffline ? 'Saved Offline' : 'Save Offline'}</span>
                </button>

                {onAssignSubjectToClass && (
                  <button
                    type="button"
                    onClick={() => onAssignSubjectToClass(activeSubject, selectedLevel)}
                    className="px-3.5 py-2 rounded-xl text-xs font-sora font-bold bg-[#0B1D3A] hover:bg-[#132C54] text-white transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-300" />
                    <span>Assign to Class</span>
                  </button>
                )}

                {activeSubject.subjectName === 'Mathematics' && (
                  <button
                    type="button"
                    onClick={() => setViewMode('math_voice_tutor')}
                    className="px-3.5 py-2 rounded-xl text-xs font-sora font-bold bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open Math Voice Tutor</span>
                  </button>
                )}
              </div>
            </div>

            {/* Competencies */}
            <div className="space-y-2">
              <h3 className="font-sora font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Core {selectedLevel} Competencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeSubject.competencies.map((comp, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-[#0B1D3A] dark:text-slate-100"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            {/* Term Filter */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <h3 className="font-sora font-bold text-base text-[#0B1D3A] dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Termly Scheme &amp; Learning Objectives</span>
              </h3>
              <div className="flex items-center gap-1.5">
                {(['all', 1, 2, 3] as const).map((term) => (
                  <button
                    key={String(term)}
                    type="button"
                    onClick={() => setSelectedTerm(term)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer border transition ${
                      selectedTerm === term
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {term === 'all' ? 'All 3 Terms' : `Term ${term}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Termly Topics Cards */}
            <div className="space-y-4">
              {activeSubject.termTopics
                .filter((t) => selectedTerm === 'all' || t.term === selectedTerm)
                .map((topic) => (
                  <div
                    key={topic.term}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#0B1D3A] text-white font-mono font-bold text-xs px-2.5 py-1 rounded-lg">
                          Term {topic.term}
                        </span>
                        <h4 className="font-sora font-bold text-sm sm:text-base text-[#0B1D3A] dark:text-white">
                          {topic.topicTitle}
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                        {topic.weeks}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                          Syllabus Subtopics:
                        </span>
                        <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc pl-4">
                          {topic.subtopics.map((sub, i) => (
                            <li key={i}>{sub}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                          NERDC Learning Objectives:
                        </span>
                        <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc pl-4">
                          {topic.learningObjectives.map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-slate-800 dark:text-slate-200">
                      <strong className="text-[#0B1D3A] dark:text-blue-200">Practical / Classroom Activity:</strong>{' '}
                      {topic.practicalActivity}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
