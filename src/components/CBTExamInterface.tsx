import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  BookOpen, 
  Calculator as CalcIcon, 
  Edit3, 
  RotateCcw, 
  Printer, 
  ArrowLeft, 
  ArrowRight, 
  Flag, 
  Eye, 
  Maximize2, 
  Minimize2, 
  Search, 
  Sparkles, 
  Filter, 
  FileText, 
  Check,
  X,
  HelpCircle,
  Hash,
  ChevronRight,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { 
  CBTExamConfig, 
  CBTQuestion, 
  CBTResultSlip, 
  CBTInfractionEvent, 
  CBTGradeLevel, 
  CBTSubjectCategory,
  CyberLessonCourse,
  CyberWeeklyLesson,
  RevisedLessonNotes
} from '../types';
import { 
  prepareExamSession, 
  evaluateCBTSubmission, 
  saveCBTResult, 
  getSavedCBTResults,
  saveActiveCBTSession,
  getActiveCBTSession,
  clearActiveCBTSession,
  calculateGradeDetails
} from '../utils/cbtEngine';
import { getAllAvailableCBTExams, convertCyberLessonToCBTConfig } from '../data/cbtQuestionBank';
import { CYBER_SECURITY_CURRICULUM } from '../data/cyberSecurityCurriculum';
import { generateAIQuiz, getAvailableLessonOutlines, LessonOutlineOption } from '../utils/aiQuizGenerator';

interface CBTExamInterfaceProps {
  initialExamConfig?: CBTExamConfig | null;
  revisedNotesData?: RevisedLessonNotes;
  currentUser?: {
    name?: string;
    studentId?: string;
    classGrade?: string;
    role?: string;
  };
  onClose?: () => void;
  onTestCompleted?: (result: CBTResultSlip) => void;
}

export const CBTExamInterface: React.FC<CBTExamInterfaceProps> = ({
  initialExamConfig,
  revisedNotesData,
  currentUser,
  onClose,
  onTestCompleted,
}) => {
  const allExams = useMemo(() => getAllAvailableCBTExams(), []);
  
  // Selection State (when launched as stand-alone CBT center)
  const [selectedExam, setSelectedExam] = useState<CBTExamConfig | null>(initialExamConfig || null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [activeLevelFilter, setActiveLevelFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // CBT State Machine: 'browse' | 'study_notes' | 'in_exam' | 'result_slip' | 'transcripts'
  const [cbtPhase, setCbtPhase] = useState<'browse' | 'study_notes' | 'in_exam' | 'result_slip' | 'transcripts'>(
    initialExamConfig ? (revisedNotesData ? 'study_notes' : 'in_exam') : 'browse'
  );

  // Candidate Profile
  const candidate = useMemo(() => ({
    name: currentUser?.name || 'Authorized Candidate',
    id: currentUser?.studentId || 'STD-2026-' + Math.floor(1000 + Math.random() * 9000),
    className: currentUser?.classGrade || selectedExam?.level || 'Grade Level Candidate',
  }), [currentUser, selectedExam]);

  // Exam Runtime State
  const [activeQuestions, setActiveQuestions] = useState<CBTQuestion[]>([]);
  const [optionOrderMap, setOptionOrderMap] = useState<Record<string, number[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number | null>>({});
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<string[]>([]);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [timeUsedSeconds, setTimeUsedSeconds] = useState(0);
  const [infractions, setInfractions] = useState<CBTInfractionEvent[]>([]);
  const [infractionNotice, setInfractionNotice] = useState<string | null>(null);
  const [resultSlip, setResultSlip] = useState<CBTResultSlip | null>(null);
  const [pastTranscripts, setPastTranscripts] = useState<CBTResultSlip[]>([]);
  const [dynamicExams, setDynamicExams] = useState<CBTExamConfig[]>([]);

  // AI Quiz Generator State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiSubject, setAiSubject] = useState<string>('Cultural & Creative Arts (Music)');
  const [aiLevel, setAiLevel] = useState<string>('JSS1');
  const [aiSelectedOutlineId, setAiSelectedOutlineId] = useState<string>('');
  const [aiCustomTopic, setAiCustomTopic] = useState<string>('');
  const [aiCustomNotes, setAiCustomNotes] = useState<string>('');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [aiGenMessage, setAiGenMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Aux Tools State
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [scratchpadText, setScratchpadText] = useState('');
  const [questionFilter, setQuestionFilter] = useState<'all' | 'answered' | 'unanswered' | 'flagged'>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Active notes for studying before exam
  const currentNotes = revisedNotesData;

  useEffect(() => {
    setPastTranscripts(getSavedCBTResults());
  }, []);

  // Update selected exam if prop changes
  useEffect(() => {
    if (initialExamConfig) {
      setSelectedExam(initialExamConfig);
      if (revisedNotesData) {
        setCbtPhase('study_notes');
      } else {
        startExam(initialExamConfig);
      }
    }
  }, [initialExamConfig, revisedNotesData]);

  // Start an Exam
  const startExam = (config: CBTExamConfig) => {
    const session = prepareExamSession(config, candidate.id, 1);
    setSelectedExam(config);
    setActiveQuestions(session.questions);
    setOptionOrderMap(session.optionOrderMap);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setFlaggedQuestionIds([]);
    setTimeLeftSeconds(config.durationMinutes * 60);
    setTimeUsedSeconds(0);
    setInfractions([]);
    setCbtPhase('in_exam');
  };

  // Timer countdown engine
  useEffect(() => {
    if (cbtPhase !== 'in_exam' || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
      setTimeUsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cbtPhase, timeLeftSeconds]);

  // Anti-Cheat & Window Blur Proctoring Listener
  useEffect(() => {
    if (cbtPhase !== 'in_exam' || !selectedExam?.enableAntiCheatProctoring) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const infraction: CBTInfractionEvent = {
          timestamp: new Date().toISOString(),
          type: 'tab_switch',
          details: 'Candidate navigated away from the active CBT exam window.',
        };
        setInfractions((prev) => [...prev, infraction]);
        setInfractionNotice('⚠️ Proctor Warning: Tab switch / Window blur detected. This event has been logged on your examination transcript.');
        setTimeout(() => setInfractionNotice(null), 5000);
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [cbtPhase, selectedExam]);

  // Keyboard shortcut listener (A, B, C, D for options; Left/Right for navigation)
  useEffect(() => {
    if (cbtPhase !== 'in_exam') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in scratchpad
      if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') return;

      const key = e.key.toUpperCase();
      const currentQ = activeQuestions[currentQuestionIndex];
      if (!currentQ) return;

      const optionOrder = optionOrderMap[currentQ.id] || currentQ.options.map((_, i) => i);

      if (['A', 'B', 'C', 'D'].includes(key)) {
        const optionIndexInDisplay = key.charCodeAt(0) - 65; // A -> 0, B -> 1, C -> 2, D -> 3
        if (optionIndexInDisplay < optionOrder.length) {
          const originalOptionIndex = optionOrder[optionIndexInDisplay];
          handleSelectAnswer(currentQ.id, originalOptionIndex);
        }
      } else if (e.key === 'ArrowRight' || key === 'N') {
        if (currentQuestionIndex < activeQuestions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft' || key === 'P') {
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex((prev) => prev - 1);
        }
      } else if (key === 'F') {
        toggleFlagQuestion(currentQ.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cbtPhase, currentQuestionIndex, activeQuestions, optionOrderMap, userAnswers]);

  // Answer selection handler
  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // Toggle flag for review
  const toggleFlagQuestion = (questionId: string) => {
    setFlaggedQuestionIds((prev) => 
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  // Final submission calculation
  const handleFinalSubmit = () => {
    if (!selectedExam) return;
    const slip = evaluateCBTSubmission(
      selectedExam,
      activeQuestions,
      userAnswers,
      flaggedQuestionIds,
      timeUsedSeconds,
      infractions,
      candidate
    );

    saveCBTResult(slip);
    setResultSlip(slip);
    setPastTranscripts(getSavedCBTResults());
    setCbtPhase('result_slip');
    setShowSubmitConfirm(false);

    if (onTestCompleted) {
      onTestCompleted(slip);
    }
  };

  // Simple Calculator arithmetic
  const handleCalcButton = (btn: string) => {
    if (btn === 'C') {
      setCalcDisplay('0');
    } else if (btn === '=') {
      try {
        // Safe evaluation of basic math expressions
        const sanitized = calcDisplay.replace(/[^0-9+\-*/.]/g, '');
        const val = Function(`'use strict'; return (${sanitized})`)();
        setCalcDisplay(String(val));
      } catch {
        setCalcDisplay('Error');
      }
    } else {
      setCalcDisplay((prev) => (prev === '0' || prev === 'Error' ? btn : prev + btn));
    }
  };

  // Formatted Timer string
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Dynamic Lesson Outlines for AI Quiz Generator
  const availableOutlines = useMemo(() => {
    return getAvailableLessonOutlines(aiSubject, aiLevel);
  }, [aiSubject, aiLevel]);

  // Combined exams (Base static question bank + User AI-generated exams)
  const allExamsCombined = useMemo(() => {
    return [...dynamicExams, ...allExams];
  }, [dynamicExams, allExams]);

  // Filtered Exam list for browsing
  const filteredExams = useMemo(() => {
    return allExamsCombined.filter((exam) => {
      const matchCat = activeCategoryFilter === 'All' || exam.category === activeCategoryFilter;
      const matchLvl = activeLevelFilter === 'All' || exam.level === activeLevelFilter;
      const matchSearch = searchQuery === '' || 
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchLvl && matchSearch;
    });
  }, [allExamsCombined, activeCategoryFilter, activeLevelFilter, searchQuery]);

  // Handler for AI Quiz Generation
  const handleGenerateAiQuiz = async () => {
    setIsGeneratingQuiz(true);
    setAiGenMessage({ text: 'Analyzing lesson curriculum & synthesizing 10-question CBT exam with Gemini...', type: 'info' });

    try {
      const selectedOutline = availableOutlines.find((o) => o.id === aiSelectedOutlineId);
      const topicName = aiCustomTopic.trim() || selectedOutline?.title || `${aiSubject} Comprehensive`;

      const result = await generateAIQuiz({
        subject: aiSubject,
        level: aiLevel as CBTGradeLevel,
        topic: topicName,
        lessonId: aiSelectedOutlineId || undefined,
        customNotes: aiCustomNotes || selectedOutline?.summary || '',
      });

      // Prepend newly created exam to dynamic exams list
      setDynamicExams((prev) => [result.examConfig, ...prev]);
      setSelectedExam(result.examConfig);
      setIsGeneratingQuiz(false);

      if (result.isAIGenerated) {
        setAiGenMessage({ 
          text: `✨ Successfully generated 10-question CBT Exam on "${result.examConfig.title}" using Gemini in ${(result.generationTimeMs / 1000).toFixed(1)}s!`, 
          type: 'success' 
        });
      } else {
        setAiGenMessage({ 
          text: `✅ Generated 10-question CBT Exam on "${result.examConfig.title}" aligned directly with the curriculum syllabus!`, 
          type: 'success' 
        });
      }

      // Auto close modal after brief delay or user can click start
      setTimeout(() => {
        setShowAiModal(false);
      }, 1500);

    } catch (err: any) {
      console.error('Quiz Generation Error in UI:', err);
      setIsGeneratingQuiz(false);
      setAiGenMessage({ text: 'Error generating quiz. Please check selections and try again.', type: 'error' });
    }
  };

  // Current active question
  const currentQ = activeQuestions[currentQuestionIndex];
  const currentOptionOrder = currentQ ? (optionOrderMap[currentQ.id] || currentQ.options.map((_, i) => i)) : [];

  // Question navigation counts
  const answeredCount = Object.values(userAnswers).filter((v) => v !== null && v !== undefined).length;
  const unansweredCount = activeQuestions.length - answeredCount;
  const flaggedCount = flaggedQuestionIds.length;

  return (
    <div id="cbt-exam-interface" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Proctoring Warning Toast */}
      {infractionNotice && (
        <div className="fixed top-5 right-5 z-50 max-w-md bg-amber-500 text-slate-950 p-4 rounded-2xl shadow-2xl border border-amber-300 font-bold text-xs flex items-center space-x-3 animate-bounce">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{infractionNotice}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* PHASE 1: BROWSE ALL CBT EXAMS (Universal Exam Portal)     */}
      {/* ========================================================= */}
      {cbtPhase === 'browse' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white p-6 md:p-8 shadow-xl border border-indigo-800/40 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-cyan-300 border border-blue-400/30 flex items-center gap-1.5 backdrop-blur-md">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    iLearnit-365 Universal CBT Assessment Suite
                  </span>
                  <span className="text-xs text-slate-300 font-mono">
                    All Classes • All Subjects • All Levels
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                  Computer-Based Testing (CBT) Center
                </h1>
                <p className="text-sm text-slate-300">
                  Standardized timed assessments with automated grading, instant diagnostic breakdown, anti-cheat proctoring, and official digital result slips.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  id="open-ai-quiz-modal-btn"
                  onClick={() => setShowAiModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black shadow-lg flex items-center space-x-2 transition-all hover:scale-105 border border-cyan-300/30"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>✨ AI Quiz Generator (10 Questions)</span>
                </button>

                {onClose && (
                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/15 flex items-center space-x-2 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                )}
                <button
                  id="view-cbt-transcripts-btn"
                  onClick={() => setCbtPhase('transcripts')}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center space-x-2 transition-all"
                >
                  <Award className="w-4 h-4" />
                  <span>My Transcripts ({pastTranscripts.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Generation Message Banner */}
          {aiGenMessage && (
            <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between ${
              aiGenMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                : aiGenMessage.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800'
                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-800 animate-pulse'
            }`}>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{aiGenMessage.text}</span>
              </div>
              <button 
                onClick={() => setAiGenMessage(null)}
                className="p-1 rounded-lg hover:bg-black/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Filter & Search Bar */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search examination by subject, code, topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
              {[
                'All', 
                'Cultural & Creative Arts (CCA Music)', 
                'Cybersecurity & Computing', 
                'Mathematics',
                'Basic Science & Technology'
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategoryFilter === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Exam Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExams.map((exam) => {
              const pastAttempts = pastTranscripts.filter((t) => t.examId === exam.id);
              const bestScore = pastAttempts.length > 0 ? Math.max(...pastAttempts.map((a) => a.breakdown.percentage)) : null;

              return (
                <div
                  key={exam.id}
                  id={`exam-card-${exam.id}`}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 hover:border-blue-500/50"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px]">
                        {exam.code}
                      </span>
                      <span className="text-slate-500 font-sans">{exam.subject}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                      {exam.title}
                    </h3>

                    {exam.revisedNotesBrief && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                        {exam.revisedNotesBrief}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>{exam.durationMinutes} Mins</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{exam.totalQuestions} Questions</span>
                      </div>
                      {bestScore !== null ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Best: {bestScore}%
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold">Not Attempted</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedExam(exam);
                          startExam(exam);
                        }}
                        className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-all"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Start CBT</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedExam(exam);
                          // Check if notes are available
                          setCbtPhase('study_notes');
                        }}
                        className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Study Notes</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PHASE 2: REVISED LESSON NOTES (Study Before Answering Test)*/}
      {/* ========================================================= */}
      {cbtPhase === 'study_notes' && selectedExam && (
        <div className="space-y-6">
          {/* Top Bar Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCbtPhase('browse')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  Pre-Test Revised Lesson Notes
                </span>
                <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {selectedExam.title}
                </h2>
              </div>
            </div>

            <button
              id="begin-test-after-notes-btn"
              onClick={() => startExam(selectedExam)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-md flex items-center space-x-2 transition-all shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Begin Timed Graded CBT ({selectedExam.durationMinutes} Mins)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Notes Content */}
          {currentNotes ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-8">
              
              {/* Introduction & Overview */}
              <div className="border-b border-slate-100 dark:border-slate-700/60 pb-6 space-y-3">
                <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  {currentNotes.topic}
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                  {currentNotes.title}
                </h1>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                  {currentNotes.overview}
                </p>
              </div>

              {/* Core Syllabus Sections */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span>Curriculum Breakdown & Topic Modules</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentNotes.sections.map((sec, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-3"
                    >
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center text-xs font-mono font-black shrink-0">
                          {sIdx + 1}
                        </span>
                        <span>{sec.heading}</span>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {sec.content}
                      </p>
                      {sec.keyTakeaway && (
                        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 text-xs font-medium border border-blue-100 dark:border-blue-900/40 flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{sec.keyTakeaway}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Real World Case Study */}
              {currentNotes.caseStudy && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white border border-indigo-800/60 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Real-World Case Study Analysis
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Diagnostic Drill</span>
                  </div>

                  <h3 className="text-lg font-black text-white">
                    {currentNotes.caseStudy.scenarioTitle}
                  </h3>

                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {currentNotes.caseStudy.scenarioDescription}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="font-bold text-red-400 mb-1">Vulnerability Vector</div>
                      <p className="text-slate-300">{currentNotes.caseStudy.vulnerabilityIdentified}</p>
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="font-bold text-amber-400 mb-1">Impact Analysis</div>
                      <p className="text-slate-300">{currentNotes.caseStudy.attackVector}</p>
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="font-bold text-emerald-400 mb-1">Standard Defense</div>
                      <p className="text-slate-300">{currentNotes.caseStudy.mitigationPrescribed}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Terminology & Exam Cram Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Terminology */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-blue-600" />
                    <span>Key Terminology & Definitions</span>
                  </h3>
                  <div className="space-y-2">
                    {currentNotes.keyTerminology.map((item, tIdx) => (
                      <div
                        key={tIdx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 text-xs"
                      >
                        <span className="font-bold text-blue-700 dark:text-blue-300">{item.term}: </span>
                        <span className="text-slate-600 dark:text-slate-300">{item.definition}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exam Cram Checklist */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Exam Readiness Checklist</span>
                  </h3>
                  <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-2.5">
                    {currentNotes.examCramChecklist.map((checkItem, cIdx) => (
                      <div key={cIdx} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{checkItem}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom CTA to start test */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <button
                  onClick={() => setCbtPhase('browse')}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={() => startExam(selectedExam)}
                  className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-lg flex items-center space-x-2 transition-all"
                >
                  <span>Ready! Start 10-Question Graded Test</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 text-center space-y-4">
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Standard Topic Examination Notes
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {selectedExam.revisedNotesBrief || 'Review fundamental definitions and formulas before initiating this official CBT assessment.'}
              </p>
              <button
                onClick={() => startExam(selectedExam)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md inline-flex items-center space-x-2"
              >
                <span>Proceed to CBT Exam Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* PHASE 3: ACTIVE CBT EXAM ROOM (Universal CBT Interface)   */}
      {/* ========================================================= */}
      {cbtPhase === 'in_exam' && selectedExam && currentQ && (
        <div className="space-y-4">
          
          {/* Exam Header Bar */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Candidate & Subject Info */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                {candidate.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{candidate.name}</span>
                  <span className="text-[11px] text-slate-400 font-mono">({candidate.id})</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {selectedExam.subject} • {selectedExam.code}
                </div>
              </div>
            </div>

            {/* Center: Live Timer */}
            <div className="flex items-center justify-center">
              <div className={`px-5 py-2 rounded-2xl border font-mono font-black text-sm md:text-base flex items-center space-x-2 shadow-inner ${
                timeLeftSeconds < 120 
                  ? 'bg-red-500 text-white border-red-600 animate-pulse'
                  : timeLeftSeconds < 300 
                  ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                  : 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-900 dark:text-slate-100'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTimer(timeLeftSeconds)} Remaining</span>
              </div>
            </div>

            {/* Aux Tools & Action Buttons */}
            <div className="flex items-center space-x-2">
              {selectedExam.allowCalculator && (
                <button
                  id="toggle-calculator-btn"
                  onClick={() => setShowCalculator((prev) => !prev)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-colors flex items-center space-x-1.5 ${
                    showCalculator 
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                  }`}
                  title="On-screen Calculator"
                >
                  <CalcIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Calculator</span>
                </button>
              )}

              <button
                id="toggle-scratchpad-btn"
                onClick={() => setShowScratchpad((prev) => !prev)}
                className={`p-2 rounded-xl text-xs font-bold border transition-colors flex items-center space-x-1.5 ${
                  showScratchpad 
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                }`}
                title="Scratchpad Notes"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Rough Pad</span>
              </button>

              <button
                id="submit-exam-btn"
                onClick={() => setShowSubmitConfirm(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Exam</span>
              </button>
            </div>
          </div>

          {/* Aux Popup Calculator */}
          {showCalculator && (
            <div className="fixed bottom-10 right-10 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 w-64 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <CalcIcon className="w-3.5 h-3.5 text-blue-400" />
                  CBT Scientific Calc
                </span>
                <button onClick={() => setShowCalculator(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-right text-lg text-cyan-400 overflow-x-auto">
                {calcDisplay}
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', 'C', '+'].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleCalcButton(k)}
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-center transition-colors"
                  >
                    {k}
                  </button>
                ))}
                <button
                  onClick={() => handleCalcButton('=')}
                  className="col-span-4 p-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-center text-white font-black"
                >
                  =
                </button>
              </div>
            </div>
          )}

          {/* Aux Popup Scratchpad */}
          {showScratchpad && (
            <div className="fixed bottom-10 right-80 z-50 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-72 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                  Rough Working Pad
                </span>
                <button onClick={() => setShowScratchpad(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={scratchpadText}
                onChange={(e) => setScratchpadText(e.target.value)}
                placeholder="Type temporary arithmetic steps or calculations..."
                className="w-full h-36 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-mono resize-none focus:outline-none"
              />
            </div>
          )}

          {/* Main Question & Navigation Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left 3 Columns: Active Question Viewer */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 flex flex-col justify-between min-h-[480px]">
              
              <div className="space-y-6">
                {/* Question Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-4">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-mono font-black text-xs">
                      Question {currentQuestionIndex + 1} of {activeQuestions.length}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-[11px] font-semibold">
                      {currentQ.topic}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[11px] font-bold">
                      {currentQ.difficulty} • {currentQ.taxonomy}
                    </span>
                  </div>

                  {/* Flag for Review Button */}
                  <button
                    id={`flag-question-${currentQ.id}`}
                    onClick={() => toggleFlagQuestion(currentQ.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center space-x-1.5 ${
                      flaggedQuestionIds.includes(currentQ.id)
                        ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-50 dark:bg-slate-700/40 text-slate-500 border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{flaggedQuestionIds.includes(currentQ.id) ? 'Flagged for Review' : 'Flag for Review'}</span>
                  </button>
                </div>

                {/* Question Stem */}
                <div className="space-y-3">
                  <h3 className="text-base md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                    {currentQ.questionText}
                  </h3>
                  {currentQ.codeSnippet && (
                    <pre className="p-4 bg-slate-900 text-cyan-300 rounded-2xl text-xs font-mono overflow-x-auto border border-slate-800">
                      {currentQ.codeSnippet}
                    </pre>
                  )}
                </div>

                {/* Options List (A, B, C, D) */}
                <div className="space-y-3 pt-2">
                  {currentOptionOrder.map((origIndex, displayIdx) => {
                    const optionLetter = String.fromCharCode(65 + displayIdx);
                    const optionText = currentQ.options[origIndex];
                    const isSelected = userAnswers[currentQ.id] === origIndex;

                    return (
                      <button
                        key={origIndex}
                        id={`option-${currentQ.id}-${optionLetter}`}
                        onClick={() => handleSelectAnswer(currentQ.id, origIndex)}
                        className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center space-x-4 ${
                          isSelected
                            ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                            : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100/70 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}>
                          {optionLetter}
                        </span>
                        <span className={`text-xs md:text-sm font-medium leading-snug ${
                          isSelected ? 'text-blue-900 dark:text-blue-100 font-bold' : 'text-slate-800 dark:text-slate-200'
                        }`}>
                          {optionText}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (currentQuestionIndex > 0) setCurrentQuestionIndex((prev) => prev - 1);
                    }}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold disabled:opacity-40 flex items-center space-x-1.5 hover:bg-slate-200 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous (P)</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserAnswers((prev) => {
                        const copy = { ...prev };
                        delete copy[currentQ.id];
                        return copy;
                      });
                    }}
                    className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    Clear Choice
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  {currentQuestionIndex < activeQuestions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all"
                    >
                      <span>Next Question (N)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSubmitConfirm(true)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center space-x-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Review & Submit</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Right 1 Column: Question Matrix Navigation Grid */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
              
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Question Matrix Navigator
                </h4>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Click any number to jump directly
                </div>
              </div>

              {/* Status Summary Pill Counts */}
              <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40">
                  <div className="font-black text-sm">{answeredCount}</div>
                  <div className="text-[10px]">Answered</div>
                </div>

                <div className="p-2 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                  <div className="font-black text-sm">{unansweredCount}</div>
                  <div className="text-[10px]">Pending</div>
                </div>

                <div className="p-2 rounded-xl bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
                  <div className="font-black text-sm">{flaggedCount}</div>
                  <div className="text-[10px]">Flagged</div>
                </div>
              </div>

              {/* Matrix Grid */}
              <div className="grid grid-cols-5 gap-2 pt-2">
                {activeQuestions.map((q, idx) => {
                  const isAnswered = userAnswers[q.id] !== null && userAnswers[q.id] !== undefined;
                  const isFlagged = flaggedQuestionIds.includes(q.id);
                  const isCurrent = idx === currentQuestionIndex;

                  let btnBg = 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';
                  if (isCurrent) {
                    btnBg = 'bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-2 border-blue-600';
                  } else if (isFlagged) {
                    btnBg = 'bg-amber-400 text-slate-950 font-bold border-amber-500';
                  } else if (isAnswered) {
                    btnBg = 'bg-emerald-600 text-white font-bold border-emerald-700';
                  }

                  return (
                    <button
                      key={q.id}
                      id={`matrix-q-btn-${idx + 1}`}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-9 rounded-xl font-mono text-xs border transition-all flex items-center justify-center relative ${btnBg}`}
                    >
                      <span>{idx + 1}</span>
                      {isFlagged && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-900 absolute top-1 right-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-md bg-emerald-600 inline-block" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-md bg-amber-400 inline-block" />
                  <span>Flagged for Review</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-md bg-slate-200 dark:bg-slate-700 inline-block" />
                  <span>Unanswered</span>
                </div>
              </div>

              {/* Anti-cheat Proctor Badge */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  Proctoring Active
                </span>
                <span className="font-mono text-slate-400">
                  {infractions.length === 0 ? '0 Flags' : `${infractions.length} Flags`}
                </span>
              </div>

            </div>

          </div>

          {/* Submit Confirmation Modal */}
          {showSubmitConfirm && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Submit Examination?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Are you sure you want to finish your assessment? Once submitted, your scores and grade breakdown will be calculated.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Questions:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activeQuestions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Answered Questions:</span>
                    <span className="font-bold text-emerald-600">{answeredCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Unanswered Questions:</span>
                    <span className="font-bold text-red-500">{unansweredCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Flagged Questions:</span>
                    <span className="font-bold text-amber-500">{flaggedCount}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowSubmitConfirm(false)}
                    className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition-colors"
                  >
                    Continue Answering
                  </button>
                  <button
                    id="confirm-final-submit-btn"
                    onClick={handleFinalSubmit}
                    className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all"
                  >
                    Confirm & Submit
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* PHASE 4: OFFICIAL RESULT SLIP & DIAGNOSTIC ANALYTICS      */}
      {/* ========================================================= */}
      {cbtPhase === 'result_slip' && resultSlip && (
        <div className="space-y-6">
          
          {/* Printable Result Slip Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-8 print:shadow-none print:border-none">
            
            {/* Slip Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    OFFICIAL EXAMINATION RESULT SLIP
                  </div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                    iLearnit-365 Assessment Transcript
                  </h1>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    Verification ID: {resultSlip.verificationId}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 print:hidden">
                <button
                  id="print-cbt-slip-btn"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center space-x-2 hover:bg-slate-200 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip</span>
                </button>

                <button
                  onClick={() => setCbtPhase('browse')}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  Return to CBT Center
                </button>
              </div>
            </div>

            {/* Candidate & Assessment Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-xs">
              <div>
                <div className="text-slate-400">Candidate Name</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{resultSlip.candidateName}</div>
              </div>
              <div>
                <div className="text-slate-400">Candidate ID</div>
                <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{resultSlip.candidateId}</div>
              </div>
              <div>
                <div className="text-slate-400">Course & Code</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{resultSlip.examCode} ({resultSlip.subject})</div>
              </div>
              <div>
                <div className="text-slate-400">Completion Time</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {Math.floor(resultSlip.timeUsedSeconds / 60)}m {resultSlip.timeUsedSeconds % 60}s
                </div>
              </div>
            </div>

            {/* Core Score Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Overall Score */}
              <div className={`p-6 rounded-2xl text-center space-y-1 flex flex-col justify-center ${
                resultSlip.breakdown.passed 
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
                  : 'bg-red-500/10 border border-red-500/30 text-red-950 dark:text-red-200'
              }`}>
                <div className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Overall Score</div>
                <div className="text-4xl font-black text-slate-900 dark:text-white">
                  {resultSlip.breakdown.totalScore} / {resultSlip.breakdown.maxScore}
                </div>
                <div className="text-sm font-black text-blue-600 dark:text-cyan-400">
                  {resultSlip.breakdown.percentage}%
                </div>
              </div>

              {/* Grade Rating */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl text-center space-y-1 flex flex-col justify-center border border-slate-200 dark:border-slate-800">
                <div className="text-xs uppercase font-bold text-slate-500">Letter & WAEC Grade</div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">
                  {resultSlip.breakdown.grade}
                </div>
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {calculateGradeDetails(resultSlip.breakdown.percentage).waecGrade}
                </div>
              </div>

              {/* Performance Status */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl text-center space-y-1 flex flex-col justify-center border border-slate-200 dark:border-slate-800">
                <div className="text-xs uppercase font-bold text-slate-500">Assessment Status</div>
                <div className={`text-xl font-black ${resultSlip.breakdown.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                  {resultSlip.breakdown.passed ? 'PASSED (CREDIT)' : 'FAILED / RETAKE'}
                </div>
                <div className="text-xs text-slate-500">
                  {calculateGradeDetails(resultSlip.breakdown.percentage).remarks}
                </div>
              </div>

              {/* Speed & Efficiency */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl text-center space-y-1 flex flex-col justify-center border border-slate-200 dark:border-slate-800">
                <div className="text-xs uppercase font-bold text-slate-500">Average Pace</div>
                <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                  {resultSlip.breakdown.averageTimePerQuestionSec}s
                </div>
                <div className="text-xs text-slate-500">Per Question</div>
              </div>

            </div>

            {/* Topic-by-Topic Mastery Diagnostic Breakdown */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Topic Mastery Diagnostic Breakdown</span>
              </h3>

              <div className="space-y-3">
                {Object.entries(resultSlip.breakdown.accuracyByTopic).map(([topic, statVal]) => {
                  const stat = statVal as { correct: number; total: number; percent: number };
                  return (
                    <div key={topic} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800 dark:text-slate-200">{topic}</span>
                        <span className="text-slate-600 dark:text-slate-400 font-mono">
                          {stat.correct}/{stat.total} Correct ({stat.percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            stat.percent >= 70 ? 'bg-emerald-500' : stat.percent >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${stat.percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Question-by-Question Detailed Review */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Detailed Question Review & Explanations</span>
              </h3>

              <div className="space-y-4">
                {resultSlip.questionBank.map((q, idx) => {
                  const userChoice = resultSlip.userAnswers[q.id];
                  const isCorrect = userChoice === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border text-xs space-y-3 ${
                        isCorrect
                          ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                          : 'bg-red-50/30 dark:bg-red-950/20 border-red-200 dark:border-red-900/40'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono">Question {idx + 1}:</span>
                          <span className="text-slate-500">[{q.topic}]</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {isCorrect ? 'Correct (+1 Mark)' : 'Incorrect (0 Marks)'}
                        </span>
                      </div>

                      <div className="font-semibold text-slate-900 dark:text-white text-sm">
                        {q.questionText}
                      </div>

                      {/* Options Review */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isCorrectOpt = optIdx === q.correctIndex;
                          const isUserPicked = optIdx === userChoice;

                          let style = 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600';
                          if (isCorrectOpt) {
                            style = 'bg-emerald-100/70 dark:bg-emerald-900/40 border-emerald-500 font-bold text-emerald-900 dark:text-emerald-200';
                          } else if (isUserPicked && !isCorrectOpt) {
                            style = 'bg-red-100/70 dark:bg-red-900/40 border-red-500 font-bold text-red-900 dark:text-red-200 line-through';
                          }

                          return (
                            <div key={optIdx} className={`p-2.5 rounded-xl border flex items-center space-x-2 ${style}`}>
                              <span className="font-mono font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation Box */}
                      <div className="p-3 bg-white/70 dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 leading-relaxed">
                        <span className="font-bold text-slate-900 dark:text-white">Explanation: </span>
                        {q.explanation}
                        {q.syllabusReference && (
                          <div className="text-[11px] text-blue-600 dark:text-blue-400 font-mono mt-1">
                            Reference: {q.syllabusReference}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* PHASE 5: MY TRANSCRIPTS & PAST CBT RECORDS                */}
      {/* ========================================================= */}
      {cbtPhase === 'transcripts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCbtPhase('browse')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  My Academic CBT Transcripts
                </h2>
                <p className="text-xs text-slate-500">
                  Historical record of all standardized assessments taken on iLearnit-365.
                </p>
              </div>
            </div>
          </div>

          {pastTranscripts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 space-y-3">
              <Award className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Assessment Records Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Launch any assessment from the CBT catalog to build your certified academic transcript record.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3.5 px-4">Exam Code</th>
                      <th className="py-3.5 px-4">Subject & Title</th>
                      <th className="py-3.5 px-4 text-center">Score</th>
                      <th className="py-3.5 px-4 text-center">Grade</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-center">Date</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {pastTranscripts.map((t) => (
                      <tr key={t.verificationId} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{t.examCode}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{t.examTitle}</td>
                        <td className="py-3.5 px-4 text-center font-bold">{t.breakdown.percentage}%</td>
                        <td className="py-3.5 px-4 text-center font-bold text-indigo-600">{t.breakdown.grade}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            t.breakdown.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {t.breakdown.passed ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-400">
                          {new Date(t.completedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setResultSlip(t);
                              setCbtPhase('result_slip');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] hover:bg-slate-200"
                          >
                            View Result Slip
                          </button>
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

      {/* ========================================================= */}
      {/* AI QUIZ GENERATOR MODAL (Gemini Curriculum Auto-Author)  */}
      {/* ========================================================= */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Smart AI CBT Quiz Generator
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Auto-synthesizes 10 standard multiple-choice questions grounded in curriculum lesson notes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Subject & Grade Level Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Subject
                  </label>
                  <select
                    value={aiSubject}
                    onChange={(e) => {
                      setAiSubject(e.target.value);
                      setAiSelectedOutlineId('');
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Cultural & Creative Arts (Music)">Cultural & Creative Arts (Music)</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Cybersecurity Defense">Cybersecurity Defense</option>
                    <option value="Basic Science & Technology">Basic Science & Technology</option>
                    <option value="English Language & Communication">English Language & Communication</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Academic Grade / Level
                  </label>
                  <select
                    value={aiLevel}
                    onChange={(e) => {
                      setAiLevel(e.target.value);
                      setAiSelectedOutlineId('');
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="JSS1">Junior Secondary 1 (JSS1)</option>
                    <option value="JSS2">Junior Secondary 2 (JSS2)</option>
                    <option value="JSS3">Junior Secondary 3 (JSS3 / BECE)</option>
                    <option value="Primary 6">Primary 6 Entrance</option>
                    <option value="Senior Secondary">Senior Secondary (SS1 - SS3)</option>
                  </select>
                </div>
              </div>

              {/* Lesson Outline Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Curriculum Lesson Topic Outline ({availableOutlines.length} available)
                </label>
                <select
                  value={aiSelectedOutlineId}
                  onChange={(e) => {
                    setAiSelectedOutlineId(e.target.value);
                    const sel = availableOutlines.find((o) => o.id === e.target.value);
                    if (sel) {
                      setAiCustomTopic(sel.title);
                      setAiCustomNotes(sel.summary);
                    }
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choose specific lesson outline or enter custom below --</option>
                  {availableOutlines.map((outline) => (
                    <option key={outline.id} value={outline.id}>
                      {outline.title} ({outline.level})
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Topic / Objective Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Exam Focus / Custom Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Staff Notation, Major Scales, Musical Cadences, Triads & Instruments"
                  value={aiCustomTopic}
                  onChange={(e) => setAiCustomTopic(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Custom Notes / Syllabus Extract */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Lesson Notes & Key Concepts for AI Grounding
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste teacher notes, key definitions, or formulas for the model to ground the 10 multiple-choice questions..."
                  value={aiCustomNotes}
                  onChange={(e) => setAiCustomNotes(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Strict 10-question standardized schema with full explanations</span>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  disabled={isGeneratingQuiz}
                  className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="submit-generate-ai-quiz-btn"
                  onClick={handleGenerateAiQuiz}
                  disabled={isGeneratingQuiz}
                  className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  {isGeneratingQuiz ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Generating Quiz...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Generate 10-Question CBT</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
