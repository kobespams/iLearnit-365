import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft, 
  Layers, 
  FileText, 
  GraduationCap, 
  Lock, 
  Terminal, 
  RotateCcw,
  Calendar,
  Clock,
  Target,
  Check,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  Hash,
  Lightbulb
} from 'lucide-react';
import { 
  CyberSecurityLevel, 
  CyberLessonCourse, 
  CyberWeeklyLesson, 
  StudentCyberTestResult,
  CBTResultSlip 
} from '../types';
import { 
  CYBER_SECURITY_CURRICULUM, 
  getSavedCyberTestResults, 
  getCourseByLevel 
} from '../data/cyberSecurityCurriculum';
import { convertCyberLessonToCBTConfig } from '../data/cbtQuestionBank';
import { CBTExamInterface } from './CBTExamInterface';
import { CyberPracticeLab } from './CyberPracticeLab';

interface CyberSecurityExplorerProps {
  onBack?: () => void;
  currentUser?: {
    name?: string;
    role?: string;
    studentId?: string;
    classGrade?: string;
  };
}

export const CyberSecurityExplorer: React.FC<CyberSecurityExplorerProps> = ({
  onBack,
  currentUser,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<CyberSecurityLevel>('level1_fundamentals');
  const [activeTab, setActiveTab] = useState<'curriculum' | 'lab' | 'results' | 'cbt_center'>('curriculum');
  const [activeWeekNumber, setActiveWeekNumber] = useState<number>(1);
  const [expandedNotesWeek, setExpandedNotesWeek] = useState<number | null>(1);
  const [activeModalLesson, setActiveModalLesson] = useState<{ course: CyberLessonCourse; lesson: CyberWeeklyLesson } | null>(null);
  const [testResults, setTestResults] = useState<StudentCyberTestResult[]>([]);

  const currentCourse = getCourseByLevel(selectedLevel);
  const studentName = currentUser?.name || 'Enrolled Student';

  useEffect(() => {
    setTestResults(getSavedCyberTestResults());
  }, []);

  const handleTestCompleted = (result: StudentCyberTestResult) => {
    setTestResults(getSavedCyberTestResults());
  };

  const getWeekTestResult = (testId: string) => {
    return testResults.find((r) => r.testId === testId);
  };

  // Calculate course completion stats
  const totalWeeks = currentCourse.weeklySchedule.length;
  const passedWeeks = currentCourse.weeklySchedule.filter((w) => {
    const res = getWeekTestResult(w.gradeLevelTest.testId);
    return res && res.passed;
  }).length;
  const progressPercent = Math.round((passedWeeks / totalWeeks) * 100);

  return (
    <div id="cyber-security-explorer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 md:p-8 shadow-xl border border-indigo-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-cyan-300 border border-blue-400/30 flex items-center gap-1.5 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                Cybersecurity Academy & 10-Question Assessment Suite
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Curriculum v2.6
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
              Cybersecurity Defense Curriculum
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Structured weekly lessons with integrated 10-question grade-level assessments extracted directly from standard cybersecurity frameworks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {onBack && (
              <button
                id="back-to-dashboard-btn"
                onClick={onBack}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/15 flex items-center space-x-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Portal</span>
              </button>
            )}
            
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-right min-w-[140px]">
              <div className="text-[11px] text-cyan-200 uppercase font-semibold">Course Progress</div>
              <div className="text-2xl font-black text-white">{progressPercent}%</div>
              <div className="text-[10px] text-slate-300">{passedWeeks}/{totalWeeks} Weekly Tests Passed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CYBER_SECURITY_CURRICULUM.map((course) => {
          const isSelected = selectedLevel === course.level;
          const coursePassedCount = course.weeklySchedule.filter((w) => {
            const r = getWeekTestResult(w.gradeLevelTest.testId);
            return r && r.passed;
          }).length;
          
          return (
            <button
              key={course.id}
              id={`cyber-level-btn-${course.level}`}
              onClick={() => {
                setSelectedLevel(course.level);
                setActiveWeekNumber(1);
              }}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 border-blue-600 dark:border-blue-500 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500" />
              )}
              
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 mb-1">
                  <span>{course.code}</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-sans font-semibold">
                    {coursePassedCount}/4 Passed
                  </span>
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                  {course.title.split(':')[1] || course.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  {course.targetAudience}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold">
                <span>{course.durationWeeks} Weeks</span>
                <span>40 Test Questions →</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            id="tab-curriculum-btn"
            onClick={() => setActiveTab('curriculum')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'curriculum'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Weekly Curriculum & Notes</span>
          </button>
          <button
            id="tab-cbt-center-btn"
            onClick={() => setActiveTab('cbt_center')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'cbt_center'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Universal CBT Exam Center</span>
          </button>
          <button
            id="tab-lab-btn"
            onClick={() => setActiveTab('lab')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'lab'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Interactive Virtual Lab</span>
          </button>
          <button
            id="tab-results-btn"
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'results'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Assessment Transcripts ({testResults.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CURRICULUM & WEEKLY TESTS */}
      {activeTab === 'curriculum' && (
        <div className="space-y-8">
          
          {/* Course Overview Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                  {currentCourse.levelLabel}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-2">
                  {currentCourse.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-4xl">
                  {currentCourse.summary}
                </p>
              </div>

              <div className="shrink-0 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
                <Award className="w-8 h-8 text-amber-500 shrink-0" />
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Awarded Credential</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{currentCourse.badgeTitle}</div>
                </div>
              </div>
            </div>

            {/* Standards & Lab Focus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center space-x-1.5">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>Mapped Curriculum Standards</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  {currentCourse.keyStandards.map((std, i) => (
                    <li key={i} className="flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{std}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/40">
                <div className="text-xs font-bold text-blue-800 dark:text-blue-200 mb-1 flex items-center space-x-1.5">
                  <Terminal className="w-4 h-4 text-blue-600" />
                  <span>{currentCourse.practicalLabTitle}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentCourse.practicalLabGuide}
                </p>
              </div>
            </div>
          </div>

          {/* Weekly Schedule Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Weekly Topic Breakdowns & Grade Level Tests</span>
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                4 Weeks • 10 Questions Per Week
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {currentCourse.weeklySchedule.map((lesson) => {
                const pastResult = getWeekTestResult(lesson.gradeLevelTest.testId);
                const isPassed = pastResult && pastResult.passed;

                return (
                  <div
                    key={lesson.weekNumber}
                    id={`cyber-lesson-week-${lesson.weekNumber}`}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all hover:border-blue-400/50"
                  >
                    {/* Week Header */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                            Week {lesson.weekNumber}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {currentCourse.code} Module {lesson.weekNumber}
                          </span>
                          {isPassed && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Passed ({pastResult.score}/10)
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                          {lesson.weekTitle}
                        </h4>
                      </div>

                      {/* Action Buttons: Study Notes & CBT Test */}
                      <div className="flex items-center gap-2">
                        <button
                          id={`toggle-notes-w${lesson.weekNumber}-btn`}
                          onClick={() => setExpandedNotesWeek(expandedNotesWeek === lesson.weekNumber ? null : lesson.weekNumber)}
                          className="px-4 py-2.5 rounded-xl font-bold text-xs border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100 flex items-center gap-1.5 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{expandedNotesWeek === lesson.weekNumber ? 'Hide Study Notes' : 'Study Revised Notes'}</span>
                          {expandedNotesWeek === lesson.weekNumber ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          id={`take-test-w${lesson.weekNumber}-btn`}
                          onClick={() => setActiveModalLesson({ course: currentCourse, lesson })}
                          className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center space-x-2 transition-all shrink-0 ${
                            isPassed
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4 text-cyan-300" />
                          <span>{isPassed ? 'Retake CBT Graded Test' : 'Take 10-Question CBT Test'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Week Details Body */}
                    <div className="p-6 space-y-5">
                      
                      {/* Weekly Objective */}
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        <span className="font-bold text-slate-800 dark:text-slate-100">Weekly Learning Objective: </span>
                        {lesson.weeklyObjective}
                      </div>

                      {/* Focus Subtopics Chips */}
                      <div className="space-y-1.5">
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Curriculum Topics Covered:</div>
                        <div className="flex flex-wrap gap-2">
                          {lesson.focusSubtopics.map((topic, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                            >
                              • {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Expandable Comprehensive Revised Lesson Notes */}
                      {expandedNotesWeek === lesson.weekNumber && lesson.revisedNotes && (
                        <div className="p-5 bg-gradient-to-br from-indigo-50/70 via-blue-50/40 to-slate-50 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 shadow-sm space-y-5 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between border-b border-indigo-200/60 dark:border-indigo-800/60 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 bg-indigo-600 text-white rounded-lg">
                                <FileText className="w-4 h-4" />
                              </span>
                              <div>
                                <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                                  Week {lesson.weekNumber}: {lesson.weekTitle} — Revised Lesson Notes
                                </h5>
                                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                                  Level: {currentCourse.levelLabel} • {currentCourse.code}
                                </p>
                              </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                              Pre-Exam Study Guide
                            </span>
                          </div>

                          {/* Overview Summary */}
                          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800/90 p-4 rounded-xl border border-indigo-100 dark:border-slate-700">
                            <div className="font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                              <span>Core Theory Summary</span>
                            </div>
                            <p>{lesson.revisedNotes.topicSummary}</p>
                          </div>

                          {/* Topic Sections Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {lesson.revisedNotes.detailedSections.map((sec, sIdx) => (
                              <div key={sIdx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                                <div className="font-bold text-xs text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px] font-black">
                                    {sIdx + 1}
                                  </span>
                                  <span>{sec.heading}</span>
                                </div>
                                {sec.subheading && (
                                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                    {sec.subheading}
                                  </div>
                                )}
                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                  {sec.content}
                                </p>

                                {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Key Points:</div>
                                    <ul className="space-y-1">
                                      {sec.bulletPoints.map((kp, kpIdx) => (
                                        <li key={kpIdx} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                                          <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                          <span>{kp}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {sec.proTip && (
                                  <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200/60 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-200">
                                    <span className="font-bold">Pro Tip: </span>{sec.proTip}
                                  </div>
                                )}

                                {sec.codeOrCommand && (
                                  <div className="p-2 bg-slate-900 text-cyan-300 rounded-lg font-mono text-[10px]">
                                    <code>{sec.codeOrCommand}</code>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Real-World Case Study */}
                          {lesson.revisedNotes.realWorldCaseStudy && (
                            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                                <span>Real-World Case Study: {lesson.revisedNotes.realWorldCaseStudy.title} ({lesson.revisedNotes.realWorldCaseStudy.year})</span>
                              </div>
                              <div className="text-xs text-slate-300">
                                <span className="font-semibold text-slate-400">Target: </span>{lesson.revisedNotes.realWorldCaseStudy.target}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px]">
                                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                                  <span className="font-bold text-red-400 block mb-0.5">Attack Vector:</span>
                                  <span className="text-slate-300">{lesson.revisedNotes.realWorldCaseStudy.attackVector}</span>
                                </div>
                                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                                  <span className="font-bold text-amber-400 block mb-0.5">Impact:</span>
                                  <span className="text-slate-300">{lesson.revisedNotes.realWorldCaseStudy.impact}</span>
                                </div>
                                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                                  <span className="font-bold text-emerald-400 block mb-0.5">Lesson Learned:</span>
                                  <span className="text-slate-300">{lesson.revisedNotes.realWorldCaseStudy.lessonLearned}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Exam Cram Checklist & Mnemonics */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            {/* Exam Readiness Checklist */}
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                              <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Exam Cram Checklist</span>
                              </div>
                              <ul className="space-y-2">
                                {lesson.revisedNotes.examCramChecklist.map((checkItem, cIdx) => (
                                  <li key={cIdx} className="text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                                    <span>{checkItem}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Memory Mnemonics */}
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                              <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                <Hash className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Memory Aids & Mnemonics</span>
                              </div>
                              <div className="space-y-2">
                                {lesson.revisedNotes.memoryMnemonics && lesson.revisedNotes.memoryMnemonics.length > 0 ? (
                                  lesson.revisedNotes.memoryMnemonics.map((mnem, mIdx) => (
                                    <div key={mIdx} className="text-[11px] bg-indigo-50 dark:bg-indigo-950/40 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900/40 text-indigo-900 dark:text-indigo-200 font-medium">
                                      💡 {mnem}
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-[11px] text-slate-500 italic">
                                    Review all terms, formulas, and security protocols thoroughly before starting.
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick Launch Test from Notes footer */}
                          <div className="flex items-center justify-between bg-blue-600 text-white p-4 rounded-xl shadow-md">
                            <div className="space-y-0.5">
                              <div className="font-bold text-sm">Ready to Test Your Understanding?</div>
                              <p className="text-xs text-blue-100">Take the 10-Question CBT Assessment for Module {lesson.weekNumber} now.</p>
                            </div>
                            <button
                              id={`launch-cbt-from-notes-w${lesson.weekNumber}-btn`}
                              onClick={() => setActiveModalLesson({ course: currentCourse, lesson })}
                              className="px-4 py-2 bg-white text-blue-700 rounded-lg font-bold text-xs shadow hover:bg-blue-50 transition-colors flex items-center gap-1.5"
                            >
                              <ShieldCheck className="w-4 h-4 text-blue-600" />
                              <span>Launch CBT Graded Test</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Outline Notes & Activity */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Framework Source Notes</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {lesson.outlineSourceNotes}
                          </p>
                        </div>

                        <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1">
                          <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center space-x-1.5">
                            <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Practical Exercise</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {lesson.handsOnActivity}
                          </p>
                        </div>
                      </div>

                      {/* Key Takeaways */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                        {lesson.keyTakeaways.map((takeaway, kIdx) => (
                          <div key={kIdx} className="flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{takeaway}</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: UNIVERSAL CBT EXAM CENTER */}
      {activeTab === 'cbt_center' && (
        <div className="space-y-6">
          <CBTExamInterface
            currentUser={{
              name: studentName,
              studentId: currentUser?.studentId,
              classGrade: currentUser?.classGrade,
              role: currentUser?.role,
            }}
          />
        </div>
      )}

      {/* TAB 3: INTERACTIVE PRACTICE LAB */}
      {activeTab === 'lab' && (
        <CyberPracticeLab currentLevel={selectedLevel} />
      )}

      {/* TAB 4: TEST RESULTS & ACADEMIC TRANSCRIPTS */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Official Cybersecurity Assessment Transcript
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged grade-level assessment scores for {studentName}.
              </p>
            </div>

            <button
              id="print-transcript-btn"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-2 hover:bg-slate-200 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Transcript</span>
            </button>
          </div>

          {testResults.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
              <ShieldCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">No Assessment Records Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Select any weekly topic from the curriculum tab and complete the 10-question test to earn grade credits.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Course</th>
                      <th className="py-3 px-4">Week & Topic</th>
                      <th className="py-3 px-4 text-center">Score</th>
                      <th className="py-3 px-4 text-center">Percentage</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4">Date Completed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
                    {testResults.map((res, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-bold">
                          {res.courseTitle.split(':')[0]}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                          Week {res.weekNumber}: {res.weekTitle}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-800 dark:text-slate-100">
                          {res.score}/{res.totalQuestions}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-blue-600 dark:text-blue-400">
                          {res.percentage}%
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            res.passed
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {res.passed ? 'PASSED' : 'FAILED'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(res.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Modal Lesson Popup for Universal CBT Exam */}
      {activeModalLesson && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-6xl max-h-[96vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <CBTExamInterface
                initialExam={convertCyberLessonToCBTConfig(activeModalLesson.course, activeModalLesson.lesson)}
                revisedNotesData={activeModalLesson.lesson.revisedNotes}
                currentUser={{
                  name: studentName,
                  studentId: currentUser?.studentId,
                  classGrade: currentUser?.classGrade,
                  role: currentUser?.role,
                }}
                onClose={() => {
                  setActiveModalLesson(null);
                  setTestResults(getSavedCyberTestResults());
                }}
                onExamCompleted={() => {
                  setTestResults(getSavedCyberTestResults());
                }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
