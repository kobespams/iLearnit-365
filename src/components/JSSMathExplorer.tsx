import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  Copy, 
  Check, 
  Printer, 
  Send, 
  Brain, 
  Calculator, 
  Compass, 
  Layers, 
  Lightbulb, 
  RefreshCw, 
  GraduationCap,
  ListOrdered,
  Calendar,
  Clock,
  Sliders,
  CheckCircle,
  Plus
} from 'lucide-react';
import { JSS_MATH_CURRICULUM } from '../data/jssMathCurriculum';
import { JSSLessonTopic, JSSLevel, WeeklyLessonBreakdown } from '../types';
import { generateContent } from '../services/api';

interface JSSMathExplorerProps {
  onAssignToClass?: (lesson: JSSLessonTopic) => void;
}

export const JSSMathExplorer: React.FC<JSSMathExplorerProps> = ({ onAssignToClass }) => {
  const [selectedLevel, setSelectedLevel] = useState<JSSLevel>('JSS1');
  const [activeLessonId, setActiveLessonId] = useState<string>('jss1-01');
  const [viewMode, setViewMode] = useState<'lessons' | 'weekly-pacing'>('weekly-pacing');
  const [activeTerm, setActiveTerm] = useState<1 | 2 | 3>(1);
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<number | 'all'>('all');

  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});
  const [copiedFormula, setCopiedFormula] = useState<boolean>(false);

  // Dynamic Weekly Status State
  const [weeklyStatusMap, setWeeklyStatusMap] = useState<Record<string, 'completed' | 'current' | 'upcoming'>>({
    'jss1-01-w2': 'completed',
    'jss1-01-w3': 'current',
  });

  // AI Tutor / Weekly Update State
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Quiz Mode State
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Filter lessons by level
  const filteredLessons = JSS_MATH_CURRICULUM.filter((l) => l.level === selectedLevel);
  const activeLesson = JSS_MATH_CURRICULUM.find((l) => l.id === activeLessonId) || filteredLessons[0] || JSS_MATH_CURRICULUM[0];

  const handleLevelChange = (level: JSSLevel) => {
    setSelectedLevel(level);
    const firstInLevel = JSS_MATH_CURRICULUM.find((l) => l.level === level);
    if (firstInLevel) {
      setActiveLessonId(firstInLevel.id);
      setRevealedAnswers({});
      setRevealedHints({});
      setIsQuizMode(false);
      setQuizSubmitted(false);
    }
  };

  const toggleAnswer = (idx: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleHint = (idx: number) => {
    setRevealedHints((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopyFormulas = () => {
    const textToCopy = activeLesson.keyFormulas.join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
  };

  const toggleWeekStatus = (weekKey: string) => {
    setWeeklyStatusMap((prev) => {
      const current = prev[weekKey] || 'upcoming';
      const next = current === 'upcoming' ? 'current' : current === 'current' ? 'completed' : 'upcoming';
      return { ...prev, [weekKey]: next };
    });
  };

  const handleRunAiPrompt = async (customPrompt?: string) => {
    const promptToUse = customPrompt || aiPrompt;
    if (!promptToUse.trim()) return;

    setIsAiLoading(true);
    setIsAiDrawerOpen(true);
    
    const systemInstruction = `You are the iLearnit-365 AI Senior Mathematics Specialist and JSS BECE Examiner. 
Provide highly structured, step-by-step mathematical explanations and weekly lesson plans using standard LaTeX or clear plain text notation. 
Align all solutions with the official West African JSS1-JSS3 Mathematics Curriculum standards. 
Keep answers clear, encouraging, and rich in educational value.`;

    const fullPrompt = `Lesson Topic: ${activeLesson.title} (${activeLesson.level})
File Source: ${activeLesson.file}
Lesson Summary: ${activeLesson.summary}

User Question/Task: ${promptToUse}`;

    try {
      const result = await generateContent({
        prompt: fullPrompt,
        systemInstruction,
        temperature: 0.6,
      });
      setAiResponse(result.text);
    } catch (err) {
      setAiResponse('Error generating response. Please check your network or try again.');
    } finally {
      setIsAiLoading(false);
      if (!customPrompt) setAiPrompt('');
    }
  };

  const handlePrintWorksheet = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Worksheet - ${activeLesson.title}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #111827; }
            h1 { color: #132C54; border-bottom: 2px solid #132C54; padding-bottom: 8px; }
            .meta { font-size: 14px; color: #4B5563; margin-bottom: 24px; }
            .section { margin-bottom: 24px; }
            .section-title { font-weight: bold; font-size: 18px; margin-bottom: 8px; color: #132C54; }
            .formula-box { background: #F3F4F6; padding: 12px; border-left: 4px solid #2F6FE0; font-family: monospace; }
            .question-item { margin-bottom: 16px; padding: 12px; border: 1px solid #E5E7EB; border-radius: 6px; }
          </style>
        </head>
        <body>
          <h1>iLearnit-365 | ${activeLesson.title}</h1>
          <div class="meta">
            <strong>Level:</strong> ${activeLesson.level} | <strong>File:</strong> ${activeLesson.file}<br/>
            <strong>Date:</strong> ${new Date().toLocaleDateString()} | <strong>Student Name:</strong> _______________________
          </div>

          <div class="section">
            <div class="section-title">Topic Summary</div>
            <p>${activeLesson.summary}</p>
          </div>

          <div class="section">
            <div class="section-title">Key Formulas & Principles</div>
            <div class="formula-box">
              ${activeLesson.keyFormulas.map(f => `• ${f}`).join('<br/>')}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Practice Questions</div>
            ${activeLesson.practiceQuestions.map((q, idx) => `
              <div class="question-item">
                <strong>Q${idx + 1}:</strong> ${q.question}<br/><br/>
                <em>Answer space:</em><br/><br/><br/>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-navy-deep via-navy to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              <Calendar className="w-3.5 h-3.5 text-gold" /> Weekly Updated JSS Mathematics Syllabus
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sora">
              Junior Secondary Mathematics Syllabus
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
              Official West African JSS1, JSS2, and JSS3 Mathematics curriculum organized on a weekly pacing basis across Terms 1, 2, and 3 with AI weekly update generators.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleRunAiPrompt(`Generate a Weekly Lesson Plan Update for ${selectedLevel} Term ${activeTerm} covering all required subtopics, weekly objectives, class activities, and BECE style questions.`)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition shadow-lg text-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" /> Weekly AI Lesson Generator
            </button>
            <button
              onClick={handlePrintWorksheet}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-4 py-2.5 rounded-xl transition text-sm backdrop-blur-md cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Weekly Schedule
            </button>
          </div>
        </div>

        {/* Level Tabs & Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6 border-t border-slate-700/60 pt-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {(['JSS1', 'JSS2', 'JSS3'] as JSSLevel[]).map((level) => {
              const count = JSS_MATH_CURRICULUM.filter((l) => l.level === level).length;
              const isActive = selectedLevel === level;
              return (
                <button
                  key={level}
                  onClick={() => handleLevelChange(level)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{level} Syllabus</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-700 text-slate-300'}`}>
                    {count} Topics
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-2xl border border-slate-700">
            <button
              onClick={() => setViewMode('weekly-pacing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'weekly-pacing'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Weekly Pacing & Updates
            </button>
            <button
              onClick={() => setViewMode('lessons')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'lessons'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Topic Modules & Formulas
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: File Directory Tree */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>JSS_Mathematics_Lessons/</span>
              </div>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-md">
                {selectedLevel}
              </span>
            </div>

            <div className="space-y-1.5">
              {filteredLessons.map((lesson) => {
                const isSelected = lesson.id === activeLesson.id;
                const fileNameOnly = lesson.file.split('/')[1] || lesson.file;
                const isIndex = lesson.id.endsWith('-00');

                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLessonId(lesson.id);
                      setRevealedAnswers({});
                      setRevealedHints({});
                      setIsQuizMode(false);
                      setQuizSubmitted(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-300 text-navy-deep font-semibold shadow-sm'
                        : 'bg-white border-transparent hover:bg-slate-50 text-slate-700 hover:border-slate-200'
                    }`}
                  >
                    <FileText
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        isSelected ? 'text-blue-600' : isIndex ? 'text-amber-500' : 'text-slate-400'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-mono text-slate-500 truncate mb-0.5">
                        {fileNameOnly}
                      </div>
                      <div className={`text-sm leading-snug truncate ${isSelected ? 'font-bold text-navy' : 'font-medium'}`}>
                        {lesson.title}
                      </div>
                    </div>
                    {isSelected && <ChevronRight className="w-4 h-4 text-blue-600 shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Teacher Quick Tools Card */}
          <div className="bg-gradient-to-br from-blue-900 to-navy text-white rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-blue-200">
              <Brain className="w-4 h-4 text-gold" />
              <span>Weekly Teacher & Student Actions</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Use Gemini AI to automatically generate weekly lesson updates, BECE practice sets, or weekly teaching plans for {activeLesson.title}.
            </p>
            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleRunAiPrompt(`Create a 4-Period Detailed Weekly Pacing Schedule for JSS Math teachers on the topic: "${activeLesson.title}". Include Period 1 Concept, Period 2 Worked Examples, Period 3 Student Drills, and Period 4 Weekly Quiz.`)}
                className="w-full text-left px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition flex items-center justify-between cursor-pointer"
              >
                <span>Generate 4-Period Weekly Plan</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-300" />
              </button>

              <button
                onClick={() => handleRunAiPrompt(`Generate a 5-question Weekly Homework Assignment with step-by-step solutions for "${activeLesson.title}".`)}
                className="w-full text-left px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition flex items-center justify-between cursor-pointer"
              >
                <span>Weekly Homework Assignment</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-300" />
              </button>

              <button
                onClick={() => handleRunAiPrompt(`Provide 5 worked step-by-step past BECE exam problems for "${activeLesson.title}" suitable for weekly test review.`)}
                className="w-full text-left px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition flex items-center justify-between cursor-pointer"
              >
                <span>Weekly BECE Test Problems</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* VIEW MODE 1: WEEKLY PACING & UPDATES */}
          {viewMode === 'weekly-pacing' && (
            <div className="space-y-6">
              {/* Term & Week Selector Bar */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-navy flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Weekly Syllabus Pacing: {selectedLevel}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Weekly breakdowns for every topic across Terms 1, 2, and 3. Select a term and week to inspect schedules.
                    </p>
                  </div>

                  {/* Term Buttons */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                    {([1, 2, 3] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setActiveTerm(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          activeTerm === t
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Term {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Week Filter Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
                    <Clock className="w-3.5 h-3.5" /> Filter Week:
                  </span>
                  <button
                    onClick={() => setSelectedWeekFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                      selectedWeekFilter === 'all'
                        ? 'bg-navy text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Weeks
                  </button>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((wk) => (
                    <button
                      key={wk}
                      onClick={() => setSelectedWeekFilter(wk)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                        selectedWeekFilter === wk
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Wk {wk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly Schedule Cards List */}
              <div className="space-y-4">
                {filteredLessons.flatMap((lesson) => {
                  const schedule = lesson.weeklySchedule || [];
                  const matchingWeeks = schedule.filter((w) => {
                    const matchTerm = w.term === activeTerm;
                    const matchWeek = selectedWeekFilter === 'all' || w.weekNumber === selectedWeekFilter;
                    return matchTerm && matchWeek;
                  });

                  if (matchingWeeks.length === 0 && selectedWeekFilter === 'all') {
                    // Fallback synthesis for topics without explicit weekly arrays
                    if (lesson.term === activeTerm) {
                      return [{
                        lesson,
                        week: {
                          term: activeTerm,
                          weekNumber: lesson.recommendedWeek || 1,
                          weekTitle: `Week ${lesson.recommendedWeek || 1}: ${lesson.title}`,
                          focusSubtopics: [lesson.summary.slice(0, 80) + '...'],
                          weeklyObjective: `Master core principles and worked examples for ${lesson.title}.`,
                          teachingActivities: ['Concept introduction', 'Blackboard worked examples', 'Practice drills'],
                          weeklyAssignment: 'Complete topic practice questions worksheet.',
                          status: 'upcoming' as const
                        }
                      }];
                    }
                    return [];
                  }

                  return matchingWeeks.map((week) => ({ lesson, week }));
                }).map(({ lesson, week }, idx) => {
                  const weekKey = `${lesson.id}-w${week.weekNumber}`;
                  const currentStatus = weeklyStatusMap[weekKey] || week.status || 'upcoming';

                  return (
                    <div
                      key={`${lesson.id}-${week.weekNumber}-${idx}`}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-blue-300 transition"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg font-mono">
                            Term {week.term} • Week {week.weekNumber}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {lesson.level} - {lesson.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleWeekStatus(weekKey)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                              currentStatus === 'completed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : currentStatus === 'current'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {currentStatus === 'completed' ? 'Completed' : currentStatus === 'current' ? 'Current Week' : 'Upcoming'}
                          </button>

                          <button
                            onClick={() => {
                              setActiveLessonId(lesson.id);
                              setViewMode('lessons');
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-lg transition cursor-pointer"
                          >
                            View Module <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-bold text-slate-900 text-base font-sora">
                          {week.weekTitle}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          🎯 <strong>Weekly Objective:</strong> {week.weeklyObjective}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Focus Subtopics */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-1.5">
                          <div className="font-bold text-navy uppercase text-[10px] tracking-wider flex items-center gap-1">
                            <ListOrdered className="w-3.5 h-3.5 text-blue-600" /> Focus Subtopics
                          </div>
                          <ul className="space-y-1 text-slate-700">
                            {week.focusSubtopics.map((st, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-blue-500 font-bold">•</span>
                                <span>{st}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Classroom Teaching Activities */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-1.5">
                          <div className="font-bold text-navy uppercase text-[10px] tracking-wider flex items-center gap-1">
                            <Brain className="w-3.5 h-3.5 text-amber-600" /> Classroom Activities
                          </div>
                          <ul className="space-y-1 text-slate-700">
                            {week.teachingActivities.map((act, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-amber-500 font-bold">•</span>
                                <span>{act}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Weekly Assignment & AI Generator Trigger */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                        <div className="text-xs text-blue-950">
                          📝 <strong>Weekly Homework Assignment:</strong> {week.weeklyAssignment}
                        </div>
                        <button
                          onClick={() => handleRunAiPrompt(`Generate a 10-minute weekly recap quiz with answer key for ${lesson.level} Week ${week.weekNumber} (${week.weekTitle}).`)}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Generate Weekly Quiz
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW MODE 2: TOPIC LESSON MODULES */}
          {viewMode === 'lessons' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md">
                      {activeLesson.level}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      File: {activeLesson.file}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-navy font-sora">
                    {activeLesson.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {onAssignToClass && (
                    <button
                      onClick={() => onAssignToClass(activeLesson)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Assign to Class
                    </button>
                  )}
                  <button
                    onClick={() => setIsQuizMode(!isQuizMode)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isQuizMode
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    {isQuizMode ? 'Exit Quiz Mode' : 'Practice Test'}
                  </button>
                </div>
              </div>

              {/* Overview / Summary */}
              <div className="prose max-w-none text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                <div className="font-bold text-navy text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-blue-600" /> Module Overview & Objectives
                </div>
                <p>{activeLesson.summary}</p>
              </div>

              {/* Key Formulas Section */}
              {activeLesson.keyFormulas.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-green-600" /> Key Formulas & Mathematical Principles
                    </h3>
                    <button
                      onClick={handleCopyFormulas}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition bg-blue-50 px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                      {copiedFormula ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Formulas
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs sm:text-sm space-y-2 border border-slate-800 shadow-inner">
                    {activeLesson.keyFormulas.map((formula, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-gold font-bold select-none">•</span>
                        <span className="text-emerald-300 font-semibold">{formula}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Worked Examples Section */}
              {activeLesson.workedExamples.length > 0 && !isQuizMode && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" /> Step-by-Step Worked Examples
                  </h3>

                  {activeLesson.workedExamples.map((ex, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-slate-100/80 px-4 py-3 font-semibold text-slate-800 text-sm flex items-start gap-2 border-b border-slate-200">
                        <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-mono shrink-0">
                          Example {idx + 1}
                        </span>
                        <span>{ex.problem}</span>
                      </div>
                      <div className="p-4 bg-white text-xs sm:text-sm font-mono text-slate-800 whitespace-pre-line leading-relaxed border-l-4 border-l-blue-600">
                        {ex.solution}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Teacher Guidelines Section */}
              {activeLesson.teacherGuide && (
                <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                    <ListOrdered className="w-4 h-4 text-amber-600" /> Teacher Guidelines & Pedagogy Tips
                  </div>
                  <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                    {activeLesson.teacherGuide}
                  </p>
                </div>
              )}

              {/* Interactive Practice Questions or Quiz Mode */}
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    {isQuizMode ? 'Interactive Quiz Mode' : 'Practice Exercises & Answers'}
                  </h3>
                  <span className="text-xs font-medium text-slate-500">
                    {activeLesson.practiceQuestions.length} Questions Available
                  </span>
                </div>

                {isQuizMode ? (
                  /* Interactive Quiz Card */
                  <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-5 space-y-6">
                    <div className="text-xs text-blue-900 font-medium">
                      Test your understanding of {activeLesson.title}. Solve each problem and compare your work!
                    </div>

                    {activeLesson.practiceQuestions.map((pq, idx) => (
                      <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
                        <div className="font-semibold text-slate-900 text-sm flex items-start gap-2">
                          <span className="bg-navy text-white text-xs px-2 py-0.5 rounded font-mono shrink-0">
                            Q{idx + 1}
                          </span>
                          <span>{pq.question}</span>
                        </div>

                        <div className="pt-2">
                          <textarea
                            placeholder="Type your working or answer here..."
                            rows={2}
                            value={userQuizAnswers[idx] || ''}
                            onChange={(e) => setUserQuizAnswers({ ...userQuizAnswers, [idx]: e.target.value })}
                            className="w-full text-xs font-mono p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {quizSubmitted && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs space-y-1">
                            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Model Solution:
                            </div>
                            <div className="font-mono text-emerald-950">{pq.answer}</div>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="flex items-center justify-between pt-2">
                      {!quizSubmitted ? (
                        <button
                          onClick={() => setQuizSubmitted(true)}
                          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow cursor-pointer"
                        >
                          Submit & Verify Answers
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setQuizSubmitted(false);
                            setUserQuizAnswers({});
                          }}
                          className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Reset Quiz
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Standard Accordion Practice Items */
                  <div className="space-y-3">
                    {activeLesson.practiceQuestions.map((pq, idx) => {
                      const isAnswerShown = revealedAnswers[idx];
                      const isHintShown = revealedHints[idx];

                      return (
                        <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-3">
                          <div className="font-semibold text-slate-800 text-sm flex items-start gap-2">
                            <span className="text-blue-600 font-bold font-mono text-xs bg-blue-50 px-2 py-0.5 rounded">
                              {idx + 1}.
                            </span>
                            <span className="flex-1">{pq.question}</span>
                          </div>

                          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                            <button
                              onClick={() => toggleAnswer(idx)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                            >
                              {isAnswerShown ? 'Hide Answer' : 'Show Answer'}
                            </button>

                            {pq.hint && (
                              <button
                                onClick={() => toggleHint(idx)}
                                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 transition cursor-pointer"
                              >
                                <Lightbulb className="w-3 h-3" />
                                {isHintShown ? 'Hide Hint' : 'Hint'}
                              </button>
                            )}

                            <button
                              onClick={() => handleRunAiPrompt(`Provide a detailed step-by-step math explanation for the question: "${pq.question}" from topic "${activeLesson.title}".`)}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition ml-auto cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3 text-blue-600" />
                              AI Step-by-Step
                            </button>
                          </div>

                          {isHintShown && pq.hint && (
                            <div className="bg-amber-50/90 text-amber-900 border border-amber-200 text-xs p-3 rounded-lg font-mono">
                              💡 <strong>Hint:</strong> {pq.hint}
                            </div>
                          )}

                          {isAnswerShown && (
                            <div className="bg-emerald-50 text-emerald-950 border border-emerald-200 text-xs sm:text-sm p-3 rounded-lg font-mono font-semibold">
                              ✅ <strong>Answer:</strong> {pq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slide-out AI Tutor Drawer / Modal */}
      {isAiDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end transition-opacity">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
            {/* Drawer Header */}
            <div className="p-5 bg-navy text-white flex items-center justify-between border-b border-navy-deep">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-500/20 rounded-xl text-gold border border-blue-400/30">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm font-sora">iLearnit-365 Math AI Specialist</h3>
                  <p className="text-xs text-slate-300 truncate max-w-xs">{activeLesson.title}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiDrawerOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Drawer Body Response Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {isAiLoading ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-slate-600">
                    Gemini AI is analyzing {activeLesson.title} and generating step-by-step mathematical reasoning & weekly lesson content...
                  </p>
                </div>
              ) : aiResponse ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-blue-600" /> AI Generated Weekly Response
                  </div>
                  <div className="text-xs sm:text-sm text-slate-800 font-mono leading-relaxed whitespace-pre-wrap">
                    {aiResponse}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs space-y-2">
                  <Calculator className="w-10 h-10 text-slate-300 mx-auto" />
                  <p>Ask any mathematics question or generate custom weekly lesson updates.</p>
                </div>
              )}
            </div>

            {/* Drawer Input Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question or request weekly lesson update..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunAiPrompt()}
                  className="flex-1 text-xs font-mono px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <button
                  onClick={() => handleRunAiPrompt()}
                  disabled={isAiLoading || !aiPrompt.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
