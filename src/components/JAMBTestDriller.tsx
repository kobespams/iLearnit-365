import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calculator,
  Flag,
  Sparkles,
  Download,
  Trash2,
  Award,
  Play,
  RotateCcw,
  Search,
  WifiOff,
  HardDriveDownload,
  Layers,
  AlertCircle,
  Check,
  RefreshCw,
  Shuffle,
} from 'lucide-react';
import {
  JAMB_COMPILED_SCHEMES,
  JAMB_PAST_QUESTIONS_2000_2025,
  JAMB_STREAM_PRESETS,
  JAMB_YEAR_RANGE,
  getSchemesByStream,
} from '../data/jambDatabase';
import { JAMBStream, JAMBPastQuestion, JAMBSubjectScheme } from '../types';
import {
  getOfflinePacks,
  savePackOffline,
  removeOfflinePack,
  isPackSavedOffline,
  OfflineStudyPack,
} from '../services/offlineCacheService';
import { generateContent } from '../services/api';
import { AITransparencyPanel } from './AITransparencyPanel';
import { saveAIOutputRecord } from '../services/aiTransparencyService';
import { recordAuditAction } from '../services/auditTrailService';
import { reportPublicActivity } from '../services/emailAndActivityService';

function shuffleFisherYates<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface JAMBTestDrillerProps {
  studentName?: string;
  initialTab?: 'scheme' | 'driller' | 'offline';
  initialQuickSample?: boolean;
  onBack?: () => void;
}

interface JAMBDrillAttempt {
  id: string;
  date: string;
  stream: string;
  subjects: string[];
  mode: 'Practice' | 'UTME Mock';
  correctCount: number;
  totalQuestions: number;
  utmeScore400: number;
}

const DRILL_HISTORY_KEY = 'ilearnit_jamb_drill_history_v1';

export const JAMBTestDriller: React.FC<JAMBTestDrillerProps> = ({
  studentName = 'Candidate',
  initialTab = 'driller',
  initialQuickSample = false,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'scheme' | 'driller' | 'offline'>(initialTab);

  // Compiled Scheme Tab state
  const [schemeStreamFilter, setSchemeStreamFilter] = useState<JAMBStream | 'All'>('All');
  const [schemeSearch, setSchemeSearch] = useState('');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(JAMB_COMPILED_SCHEMES[0].id);

  // Offline Packs & History
  const [offlinePacks, setOfflinePacks] = useState<OfflineStudyPack[]>(() => getOfflinePacks());
  const [drillHistory, setDrillHistory] = useState<JAMBDrillAttempt[]>(() => {
    try {
      const raw = window.localStorage.getItem(DRILL_HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Driller Configuration
  const [selectedStream, setSelectedStream] = useState<JAMBStream>('Science');
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([
    'use_of_english',
    'mathematics',
    'physics',
    'chemistry',
  ]);
  const [yearBand, setYearBand] = useState<'all' | '2020_2025' | '2010_2019' | '2000_2009' | 'single'>('all');
  const [singleYear, setSingleYear] = useState<number>(2024);
  const [drillMode, setDrillMode] = useState<'Practice' | 'UTME Mock'>('Practice');
  const [questionCount, setQuestionCount] = useState<number>(60);
  const [randomMoveMode, setRandomMoveMode] = useState<boolean>(true);

  // Active Driller Session State
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState<JAMBPastQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visitedOrder, setVisitedOrder] = useState<number[]>([0]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [sessionSubmitted, setSessionSubmitted] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(1800);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');

  // Optional AI Deep Breakdown for current question
  const [aiBreakdowns, setAiBreakdowns] = useState<Record<string, string>>({});
  const [loadingAiForId, setLoadingAiForId] = useState<string | null>(null);

  useEffect(() => {
    const syncPacks = () => setOfflinePacks(getOfflinePacks());
    window.addEventListener('ilearnit:offline_packs_updated', syncPacks);
    return () => window.removeEventListener('ilearnit:offline_packs_updated', syncPacks);
  }, []);

  // Launch 60-second quick sample automatically if requested
  useEffect(() => {
    if (initialQuickSample) {
      startQuick60SecSample();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuickSample]);

  // Countdown timer for UTME Mock
  useEffect(() => {
    if (!sessionActive || sessionSubmitted || drillMode !== 'UTME Mock') return;
    const timer = window.setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          handleSubmitSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionActive, sessionSubmitted, drillMode]);

  // Keyboard shortcuts during drill (A-D, Left/Right, F)
  useEffect(() => {
    if (!sessionActive || sessionSubmitted) return;
    const q = sessionQuestions[currentIndex];
    if (!q) return;

    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }
      const key = e.key.toLowerCase();
      if (key === 'a') selectOption(q.id, 0);
      if (key === 'b') selectOption(q.id, 1);
      if (key === 'c') selectOption(q.id, 2);
      if (key === 'd') selectOption(q.id, 3);
      if (key === 'arrowright') goToNextQuestion();
      if (key === 'arrowleft') goToPrevQuestion();
      if (key === 'f') toggleFlag(q.id);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionActive, sessionSubmitted, sessionQuestions, currentIndex, randomMoveMode, visitedOrder]);

  const filteredSchemes = useMemo(() => {
    const base = getSchemesByStream(schemeStreamFilter);
    if (!schemeSearch.trim()) return base;
    const q = schemeSearch.toLowerCase();
    return base.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.overview.toLowerCase().includes(q) ||
        s.topics.some((t) => t.title.toLowerCase().includes(q))
    );
  }, [schemeStreamFilter, schemeSearch]);

  const activeScheme: JAMBSubjectScheme =
    filteredSchemes.find((s) => s.id === selectedSchemeId) || filteredSchemes[0] || JAMB_COMPILED_SCHEMES[0];

  const matchingQuestions = useMemo<JAMBPastQuestion[]>(() => {
    return JAMB_PAST_QUESTIONS_2000_2025.filter((q) => {
      const subjectMatch = selectedSubjectIds.length === 0 || selectedSubjectIds.includes(q.subjectId);
      let yearMatch = true;
      if (yearBand === '2020_2025') yearMatch = q.year >= 2020 && q.year <= 2025;
      else if (yearBand === '2010_2019') yearMatch = q.year >= 2010 && q.year <= 2019;
      else if (yearBand === '2000_2009') yearMatch = q.year >= 2000 && q.year <= 2009;
      else if (yearBand === 'single') yearMatch = q.year === singleYear;
      return subjectMatch && yearMatch;
    });
  }, [selectedSubjectIds, yearBand, singleYear]);

  const handleStreamSelect = (stream: JAMBStream) => {
    setSelectedStream(stream);
    const preset = JAMB_STREAM_PRESETS.find((p) => p.id === stream);
    if (preset) {
      setSelectedSubjectIds(preset.recommendedCombo);
    }
  };

  const toggleSubjectId = (id: string) => {
    setSelectedSubjectIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(0, 3), id];
      }
      return [...prev, id];
    });
  };

  const jumpToQuestionIndex = (idx: number) => {
    setCurrentIndex(idx);
    setVisitedOrder((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
  };

  const goToNextQuestion = () => {
    if (sessionQuestions.length === 0) return;
    if (randomMoveMode) {
      const visitedSet = new Set(visitedOrder);
      const unvisited = sessionQuestions
        .map((_, idx) => idx)
        .filter((idx) => !visitedSet.has(idx) && idx !== currentIndex);

      if (unvisited.length > 0) {
        const pickedIdx = unvisited[Math.floor(Math.random() * unvisited.length)];
        jumpToQuestionIndex(pickedIdx);
      } else {
        // All visited: pick any other random question in 1-60
        const others = sessionQuestions.map((_, i) => i).filter((i) => i !== currentIndex);
        if (others.length > 0) {
          const pickedIdx = others[Math.floor(Math.random() * others.length)];
          setCurrentIndex(pickedIdx);
        }
      }
    } else {
      const nextIdx = Math.min(sessionQuestions.length - 1, currentIndex + 1);
      jumpToQuestionIndex(nextIdx);
    }
  };

  const goToPrevQuestion = () => {
    const pos = visitedOrder.lastIndexOf(currentIndex);
    if (pos > 0) {
      setCurrentIndex(visitedOrder[pos - 1]);
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const startDrillSession = () => {
    const targetCount = Math.max(1, Math.min(60, questionCount));
    const primary: JAMBPastQuestion[] = shuffleFisherYates<JAMBPastQuestion>(matchingQuestions);
    const pickedIds = new Set<string>(primary.map((q) => q.id));

    // Top up from same selected subjects across all years (2000-2025) if year filter was narrow
    const sameSubjectsOtherYears = shuffleFisherYates(
      JAMB_PAST_QUESTIONS_2000_2025.filter(
        (q) => !pickedIds.has(q.id) && (selectedSubjectIds.length === 0 || selectedSubjectIds.includes(q.subjectId))
      )
    );
    for (const q of sameSubjectsOtherYears) {
      if (primary.length >= targetCount) break;
      primary.push(q);
      pickedIds.add(q.id);
    }

    // Top up from same stream / full 2000-2025 archive up to targetCount (1-60)
    if (primary.length < targetCount) {
      const sameStream = shuffleFisherYates(
        JAMB_PAST_QUESTIONS_2000_2025.filter(
          (q) => !pickedIds.has(q.id) && (q.stream === selectedStream || q.stream === 'Core')
        )
      );
      for (const q of sameStream) {
        if (primary.length >= targetCount) break;
        primary.push(q);
        pickedIds.add(q.id);
      }
    }
    if (primary.length < targetCount) {
      const restAll = shuffleFisherYates(JAMB_PAST_QUESTIONS_2000_2025.filter((q) => !pickedIds.has(q.id)));
      for (const q of restAll) {
        if (primary.length >= targetCount) break;
        primary.push(q);
        pickedIds.add(q.id);
      }
    }

    const deck = shuffleFisherYates(primary.slice(0, targetCount));
    const initialIdx = randomMoveMode && deck.length > 1 ? Math.floor(Math.random() * deck.length) : 0;

    setSessionQuestions(deck);
    setCurrentIndex(initialIdx);
    setVisitedOrder([initialIdx]);
    setAnswers({});
    setFlaggedIds([]);
    setRevealedIds({});
    setSessionSubmitted(false);
    setTimeLeftSeconds(Math.max(300, deck.length * 45));
    setSessionActive(true);
    setActiveTab('driller');
  };

  const startQuick60SecSample = () => {
    const sample = shuffleFisherYates(
      [
        JAMB_PAST_QUESTIONS_2000_2025.find((q) => q.subjectId === 'use_of_english' && q.year >= 2020),
        JAMB_PAST_QUESTIONS_2000_2025.find((q) => q.subjectId === 'mathematics' && q.year >= 2020),
        JAMB_PAST_QUESTIONS_2000_2025.find((q) => q.subjectId === 'physics' && q.year >= 2020),
        JAMB_PAST_QUESTIONS_2000_2025.find((q) => q.subjectId === 'economics' && q.year >= 2020),
        JAMB_PAST_QUESTIONS_2000_2025.find((q) => q.subjectId === 'government' && q.year >= 2020),
      ].filter((q): q is JAMBPastQuestion => Boolean(q))
    );

    setDrillMode('Practice');
    setSessionQuestions(sample);
    setCurrentIndex(0);
    setVisitedOrder([0]);
    setAnswers({});
    setFlaggedIds([]);
    setRevealedIds({});
    setSessionSubmitted(false);
    setSessionActive(true);
    setActiveTab('driller');
  };

  const selectOption = (questionId: string, optionIndex: number) => {
    if (sessionSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    if (drillMode === 'Practice') {
      setRevealedIds((prev) => ({ ...prev, [questionId]: true }));
    }
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedIds((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  const handleSubmitSession = () => {
    setSessionSubmitted(true);
    const correctCount = sessionQuestions.reduce(
      (acc, q) => (answers[q.id] === q.correctIndex ? acc + 1 : acc),
      0
    );
    const utmeScore400 = sessionQuestions.length
      ? Math.round((correctCount / sessionQuestions.length) * 400)
      : 0;

    const attempt: JAMBDrillAttempt = {
      id: `jamb-att-${Date.now()}`,
      date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      stream: selectedStream,
      subjects: Array.from(new Set(sessionQuestions.map((q) => q.subjectName))),
      mode: drillMode,
      correctCount,
      totalQuestions: sessionQuestions.length,
      utmeScore400,
    };
    const updated = [attempt, ...drillHistory].slice(0, 15);
    setDrillHistory(updated);
    try {
      window.localStorage.setItem(DRILL_HISTORY_KEY, JSON.stringify(updated));
    } catch {}

    recordAuditAction({
      category: 'STUDENT_REGISTRATION',
      action: `JAMB ${drillMode} Completed (${utmeScore400}/400)`,
      actorId: studentName,
      actorName: studentName,
      actorRole: 'STUDENT',
      targetResource: `JAMB Test Driller (${sessionQuestions.length} Qs)`,
      status: 'SUCCESS',
      details: `Score: ${correctCount}/${sessionQuestions.length} (${utmeScore400}/400 UTME scale). Subjects: ${attempt.subjects.join(', ')}.`,
    });

    void reportPublicActivity({
      activityType: 'JAMB_DRILL_COMPLETED',
      actorRole: 'student',
      actorName: studentName,
      targetResource: `JAMB ${drillMode} (${selectedStream})`,
      details: `Scored ${correctCount}/${sessionQuestions.length} (${utmeScore400}/400 UTME) across ${attempt.subjects.join(', ')}.`,
    });
  };

  const handleSaveSchemeOffline = (scheme: JAMBSubjectScheme) => {
    const packId = `jamb-scheme-${scheme.id}`;
    if (isPackSavedOffline(packId)) {
      removeOfflinePack(packId);
    } else {
      savePackOffline({
        id: packId,
        title: `JAMB Syllabus: ${scheme.name} (${scheme.stream})`,
        category: 'JAMB Scheme',
        stream: scheme.stream,
        itemCount: scheme.topics.length,
        payload: scheme,
      });
    }
    setOfflinePacks(getOfflinePacks());
  };

  const handleSaveQuestionPackOffline = () => {
    const packId = `jamb-qpack-${selectedStream}-${selectedSubjectIds.join('-')}`;
    if (isPackSavedOffline(packId)) {
      removeOfflinePack(packId);
    } else {
      savePackOffline({
        id: packId,
        title: `JAMB ${selectedStream} Past Questions (${matchingQuestions.length} Qs, 2000–2025)`,
        category: 'JAMB Past Questions',
        stream: selectedStream,
        itemCount: matchingQuestions.length,
        payload: matchingQuestions,
      });
    }
    setOfflinePacks(getOfflinePacks());
  };

  const handleRequestAIBreakdown = async (q: JAMBPastQuestion) => {
    if (loadingAiForId === q.id) return;
    setLoadingAiForId(q.id);
    const chosenIdx = answers[q.id];
    const chosenText = chosenIdx !== undefined ? q.options[chosenIdx] : 'Not selected yet';
    const correctText = q.options[q.correctIndex];

    const prompt = `JAMB UTME (${q.year}) ${q.subjectName} Question: "${q.questionText}"
Options: ${q.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join(' | ')}
Candidate choice: "${chosenText}". Correct answer: "${correctText}".
Syllabus topic: ${q.topic} (${q.syllabusReference}).
Provide a concise 3-step NERDC-aligned walkthrough explaining why "${correctText}" is right and any exam trap to avoid.`;

    const res = await generateContent({
      prompt,
      systemInstruction: 'You are a Nigerian JAMB UTME Master Tutor following the NERDC curriculum. Be concise, accurate, and clear.',
      temperature: 0.3,
    });

    const text = res.text || q.explanation;
    setAiBreakdowns((prev) => ({ ...prev, [q.id]: text }));

    saveAIOutputRecord({
      contextKey: `jamb-ai-${q.id}`,
      sourceFeature: 'JAMB AI Breakdown',
      subject: `${q.subjectName} (${q.stream})`,
      promptSummary: `${q.subjectName} ${q.year}: ${q.questionText.slice(0, 90)}...`,
      aiResponse: text,
      modelUsed: 'Gemini Flash + NERDC UTME Syllabus Grounding',
      methodology: `Retrieved ${q.syllabusReference} and compared candidate option against official ${q.year} UTME marking scheme.`,
      groundingSources: [q.syllabusReference, `JAMB ${q.year} Past Paper`, 'NERDC Senior Secondary Syllabus'],
      createdByUser: studentName,
    });

    setLoadingAiForId(null);
  };

  const handleEvaluateCalc = () => {
    try {
      const sanitized = calcInput.replace(/[^0-9+\-*/().% ]/g, '');
      if (!sanitized) return;
      // eslint-disable-next-line no-new-func
      const val = Function(`"use strict"; return (${sanitized})`)();
      setCalcResult(String(val));
    } catch {
      setCalcResult('Invalid expression');
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const currentQ = sessionQuestions[currentIndex];
  const currentPackId = `jamb-qpack-${selectedStream}-${selectedSubjectIds.join('-')}`;
  const isCurrentQPackOffline = isPackSavedOffline(currentPackId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <section className="bg-[#0B1D3A] text-slate-100 rounded-3xl p-6 sm:p-8 border border-blue-500/30 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
              <span>NERDC &amp; JAMB UTME Learning Center</span>
              <span aria-hidden="true">•</span>
              <span>2000–2025 Past Questions</span>
            </div>
            <h1 className="font-sora font-extrabold text-2xl sm:text-3xl text-white">
              JAMB Compiled Scheme &amp; CBT Test Driller
            </h1>
            <p className="text-sm text-slate-200 leading-relaxed">
              Full Nigerian education syllabus for Science, Arts &amp; Humanities, and Commercial streams with timed UTME drills, step-by-step worked answers, and offline study packs for low-bandwidth 3G connections.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={startQuick60SecSample}
              className="bg-amber-400 hover:bg-amber-300 text-[#0B1D3A] font-sora font-extrabold text-xs px-4 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Play className="w-4 h-4" />
              <span>60-Second Sample Drill</span>
            </button>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/25 font-sora font-semibold text-xs px-4 py-3 rounded-xl transition cursor-pointer"
              >
                Back to Hub
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-white/15 pt-4" role="tablist" aria-label="JAMB Learning Center Sections">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'driller'}
            onClick={() => setActiveTab('driller')}
            className={`px-4 py-2 rounded-xl text-xs font-sora font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'driller'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white/10 text-slate-100 hover:bg-white/20'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Test Driller (2000–2025)</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'scheme'}
            onClick={() => setActiveTab('scheme')}
            className={`px-4 py-2 rounded-xl text-xs font-sora font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'scheme'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white/10 text-slate-100 hover:bg-white/20'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Compiled JAMB Scheme ({JAMB_COMPILED_SCHEMES.length} Subjects)</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'offline'}
            onClick={() => setActiveTab('offline')}
            className={`px-4 py-2 rounded-xl text-xs font-sora font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'offline'
                ? 'bg-amber-500 text-[#0B1D3A] shadow-sm'
                : 'bg-white/10 text-slate-100 hover:bg-white/20'
            }`}
          >
            <HardDriveDownload className="w-4 h-4" />
            <span>Offline Packs ({offlinePacks.length}) &amp; Scores ({drillHistory.length})</span>
          </button>
        </div>
      </section>

      {/* TAB 1: COMPILED JAMB SCHEME */}
      {activeTab === 'scheme' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-sm">
              <div>
                <label htmlFor="scheme-search" className="block text-xs font-sora font-bold text-[#0B1D3A] dark:text-slate-100 mb-1.5">
                  Search Syllabus Topics
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="scheme-search"
                    type="text"
                    value={schemeSearch}
                    onChange={(e) => setSchemeSearch(e.target.value)}
                    placeholder="e.g., Calculus, Poetry, Taxation..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <span className="block text-xs font-sora font-bold text-[#0B1D3A] dark:text-slate-100 mb-2">
                  Filter by Academic Stream
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(['All', 'Core', 'Science', 'Arts & Humanities', 'Commercial'] as const).map((stream) => (
                    <button
                      key={stream}
                      type="button"
                      onClick={() => setSchemeStreamFilter(stream)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                        schemeStreamFilter === stream
                          ? 'bg-[#0B1D3A] text-white border-[#0B1D3A]'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {stream}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                {filteredSchemes.map((s) => {
                  const isSelected = activeScheme.id === s.id;
                  const savedOffline = isPackSavedOffline(`jamb-scheme-${s.id}`);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSchemeId(s.id)}
                      className={`w-full text-left p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-[#0B1D3A] dark:text-white font-bold'
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-sora font-bold">{s.name}</div>
                        <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                          {s.stream} • {s.topics.length} Units
                        </div>
                      </div>
                      {savedOffline && (
                        <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-700">
                          Offline ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-blue-700 dark:text-blue-300">{activeScheme.code}</span>
                    <span aria-hidden="true">•</span>
                    <span className="text-slate-600 dark:text-slate-300">{activeScheme.stream} Stream</span>
                    {activeScheme.isCompulsory && (
                      <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded font-bold">
                        Compulsory UTME Core
                      </span>
                    )}
                  </div>
                  <h2 className="font-sora font-extrabold text-2xl text-[#0B1D3A] dark:text-white">
                    {activeScheme.name}
                  </h2>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeScheme.overview}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSaveSchemeOffline(activeScheme)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-sora font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                      isPackSavedOffline(`jamb-scheme-${activeScheme.id}`)
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-[#0B1D3A] dark:text-slate-100 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>
                      {isPackSavedOffline(`jamb-scheme-${activeScheme.id}`) ? 'Saved Offline' : 'Save Scheme Offline'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSubjectIds(['use_of_english', activeScheme.id].filter((v, i, a) => a.indexOf(v) === i));
                      setActiveTab('driller');
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-sora font-bold bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Drill {activeScheme.name}</span>
                  </button>
                </div>
              </div>

              {/* Topics Breakdown */}
              <div className="space-y-4">
                <h3 className="font-sora font-bold text-base text-[#0B1D3A] dark:text-white">
                  NERDC-Aligned Syllabus Topics &amp; Objectives
                </h3>
                <div className="space-y-3">
                  {activeScheme.topics.map((topic) => (
                    <div
                      key={topic.topicNumber}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-sora font-bold text-sm text-[#0B1D3A] dark:text-white">
                          Unit {topic.topicNumber}: {topic.title}
                        </h4>
                        <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 font-semibold">
                          {topic.nerdcAlignment}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Key Subtopics:</span>
                          <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc pl-4">
                            {topic.subtopics.map((sub, i) => (
                              <li key={i}>{sub}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">UTME Objectives:</span>
                          <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc pl-4">
                            {topic.learningObjectives.map((obj, i) => (
                              <li key={i}>{obj}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Textbooks */}
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-2">
                <h4 className="font-sora font-bold text-xs uppercase tracking-wider text-blue-900 dark:text-blue-200">
                  Official Recommended Texts
                </h4>
                <ul className="text-xs text-slate-800 dark:text-slate-200 space-y-1 list-disc pl-4">
                  {activeScheme.recommendedTexts.map((txt, idx) => (
                    <li key={idx}>{txt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEST DRILLER (2000-2025) */}
      {activeTab === 'driller' && !sessionActive && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Configuration Panel */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="font-sora font-extrabold text-xl text-[#0B1D3A] dark:text-white">
                Configure Your UTME Subject Combination
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Pick a track preset or select up to 4 subjects. Filter past examination questions from 2000 to 2025.
              </p>
            </div>

            {/* Stream Presets */}
            <div className="space-y-2">
              <span className="text-xs font-sora font-bold text-[#0B1D3A] dark:text-slate-200 block">
                1. Choose Academic Stream
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {JAMB_STREAM_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleStreamSelect(preset.id)}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer space-y-1 ${
                      selectedStream === preset.id
                        ? 'bg-[#0B1D3A] text-white border-[#0B1D3A] shadow-md'
                        : 'bg-slate-50 dark:bg-slate-950 text-[#0B1D3A] dark:text-slate-100 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                    }`}
                  >
                    <div className="font-sora font-bold text-xs">{preset.title}</div>
                    <div className={`text-[11px] leading-snug ${selectedStream === preset.id ? 'text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                      {preset.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Multi-subject Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sora font-bold text-[#0B1D3A] dark:text-slate-200">
                  2. Select Subjects ({selectedSubjectIds.length}/4 active)
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Use of English + 3 stream subjects recommended
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {JAMB_COMPILED_SCHEMES.map((subj) => {
                  const chosen = selectedSubjectIds.includes(subj.id);
                  return (
                    <button
                      key={subj.id}
                      type="button"
                      onClick={() => toggleSubjectId(subj.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between gap-2 ${
                        chosen
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-[#0B1D3A] dark:text-white font-bold'
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <span className="truncate">{subj.name}</span>
                      {chosen && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Year Band & Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="space-y-2">
                <label htmlFor="jamb-year-band" className="block text-xs font-sora font-bold text-[#0B1D3A] dark:text-slate-200">
                  3. Examination Year Range (2000–2025)
                </label>
                <select
                  id="jamb-year-band"
                  value={yearBand}
                  onChange={(e) => setYearBand(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100"
                >
                  <option value="all">All Years (2000 – 2025 Complete Archive)</option>
                  <option value="2020_2025">2020 – 2025 (New NERDC Syllabus Focus)</option>
                  <option value="2010_2019">2010 – 2019 (UTME CBT Era)</option>
                  <option value="2000_2009">2000 – 2009 (Classic Foundation Era)</option>
                  <option value="single">Specific Single Year</option>
                </select>

                {yearBand === 'single' && (
                  <select
                    aria-label="Select Specific JAMB Year"
                    value={singleYear}
                    onChange={(e) => setSingleYear(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
                  >
                    {JAMB_YEAR_RANGE.map((yr) => (
                      <option key={yr} value={yr}>
                        JAMB UTME {yr}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-sora font-bold text-[#0B1D3A] dark:text-slate-200">
                  4. Drill Mode &amp; Random Traversal
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDrillMode('Practice')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-sora font-bold border transition cursor-pointer ${
                      drillMode === 'Practice'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    Study Practice
                  </button>
                  <button
                    type="button"
                    onClick={() => setDrillMode('UTME Mock')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-sora font-bold border transition cursor-pointer ${
                      drillMode === 'UTME Mock'
                        ? 'bg-amber-500 text-[#0B1D3A] border-amber-500'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    Timed UTME Mock
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {drillMode === 'Practice'
                    ? 'Instant feedback, worked NERDC solution & AI step breakdown after each option.'
                    : 'Exam timer, /400 UTME scoring scale, built-in calculator & keyboard shortcuts (A–D, Arrows, F).'}
                </p>
              </div>
            </div>

            {/* Question Count (1-60) & Random Movement Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="jamb-question-count" className="text-xs font-sora font-bold text-[#0B1D3A] dark:text-slate-200">
                    5. Questions Per Session (1–60)
                  </label>
                  <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300">
                    {questionCount} Questions
                  </span>
                </div>
                <input
                  id="jamb-question-count"
                  type="range"
                  min={1}
                  max={60}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex flex-wrap gap-1.5">
                  {[15, 30, 45, 60].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setQuestionCount(preset)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border cursor-pointer transition ${
                        questionCount === preset
                          ? 'bg-[#0B1D3A] text-white border-[#0B1D3A]'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {preset} Qs
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-sora font-bold text-[#0B1D3A] dark:text-slate-200">
                  6. Question Movement Pattern
                </span>
                <button
                  type="button"
                  onClick={() => setRandomMoveMode((r) => !r)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-sora font-bold border transition flex items-center justify-between cursor-pointer ${
                    randomMoveMode
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-[#0B1D3A] dark:text-blue-100'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Shuffle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{randomMoveMode ? 'Random Jump Mode (ON)' : 'Sequential Mode'}</span>
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-600 text-white">
                    {randomMoveMode ? 'Active' : 'Off'}
                  </span>
                </button>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Randomly shuffles 1–60 questions and jumps randomly through unvisited items on every Next click.
                </p>
              </div>
            </div>
          </div>

          {/* Right Launch Summary Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#0B1D3A] text-slate-100 rounded-3xl p-6 space-y-5 border border-blue-500/30 shadow-lg">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
                  Ready to Launch
                </span>
                <h3 className="font-sora font-extrabold text-xl text-white">
                  {selectedStream} Drill Pack
                </h3>
                <p className="text-xs text-slate-200">
                  {matchingQuestions.length} direct matches across {selectedSubjectIds.length} subject(s); session draws {questionCount} unique randomized questions (2000–2025).
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 space-y-2 text-xs text-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-300">Question Deck:</span>
                  <span className="font-bold">1–{questionCount} Questions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Traversal:</span>
                  <span className="font-bold">{randomMoveMode ? 'Random Jump' : 'Shuffled Order'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Scoring Scale:</span>
                  <span className="font-bold">UTME / 400</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Keyboard Keys:</span>
                  <span className="font-mono font-bold">A–D · ←/→ · F</span>
                </div>
              </div>

              <button
                type="button"
                onClick={startDrillSession}
                className="w-full bg-amber-400 hover:bg-amber-300 text-[#0B1D3A] font-sora font-extrabold text-sm py-3.5 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Play className="w-4 h-4" />
                <span>Start {drillMode} ({questionCount} Qs)</span>
              </button>

              <button
                type="button"
                onClick={handleSaveQuestionPackOffline}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-sora font-bold border transition flex items-center justify-center gap-2 cursor-pointer ${
                  isCurrentQPackOffline
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                    : 'bg-white/10 border-white/25 text-slate-100 hover:bg-white/20'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>{isCurrentQPackOffline ? 'Saved for Offline 3G Study ✓' : 'Save Question Pack Offline'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE DRILLER EXAM RUNNER */}
      {activeTab === 'driller' && sessionActive && currentQ && (
        <div className="space-y-6">
          {/* Top Runner Status Bar */}
          <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono font-bold bg-[#0B1D3A] text-white px-3 py-1 rounded-lg">
                Q{currentIndex + 1} / {sessionQuestions.length}
              </span>
              <span className="text-[11px] font-mono font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                Visited {visitedOrder.length}/{sessionQuestions.length}
              </span>
              <div>
                <div className="font-sora font-bold text-sm text-[#0B1D3A] dark:text-white">
                  {currentQ.subjectName} — JAMB {currentQ.year}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  {currentQ.topic} • {currentQ.difficulty}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setRandomMoveMode((r) => !r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer ${
                  randomMoveMode
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-[#0B1D3A] dark:text-slate-100 border-slate-200 dark:border-slate-700'
                }`}
                title="Toggle random question movement"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>{randomMoveMode ? 'Random Jump: ON' : 'Sequential'}</span>
              </button>

              {drillMode === 'UTME Mock' && !sessionSubmitted && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-mono text-xs font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimer(timeLeftSeconds)}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowCalculator((p) => !p)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-[#0B1D3A] dark:text-slate-100 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculator</span>
              </button>

              {!sessionSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitSession}
                  className="px-4 py-1.5 rounded-xl text-xs font-sora font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  Submit &amp; Score (/400)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSessionActive(false)}
                  className="px-4 py-1.5 rounded-xl text-xs font-sora font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>New Drill</span>
                </button>
              )}
            </div>
          </div>

          {/* Optional Calculator */}
          {showCalculator && (
            <div className="bg-slate-900 text-slate-100 border border-slate-700 rounded-2xl p-4 max-w-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-amber-300 font-bold">
                <span>UTME Basic Calculator</span>
                <button type="button" onClick={() => setShowCalculator(false)} className="text-slate-300 hover:text-white cursor-pointer">
                  Close
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={calcInput}
                  onChange={(e) => setCalcInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEvaluateCalc()}
                  placeholder="e.g., (25 * 4) / 2"
                  aria-label="Calculator expression"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white"
                />
                <button
                  type="button"
                  onClick={handleEvaluateCalc}
                  className="px-3 py-2 rounded-lg bg-amber-400 text-[#0B1D3A] font-bold text-xs cursor-pointer"
                >
                  =
                </button>
              </div>
              {calcResult && (
                <div className="text-xs font-mono text-emerald-300">Result: {calcResult}</div>
              )}
            </div>
          )}

          {/* Post-Submission Score Banner */}
          {sessionSubmitted && (
            <div className="bg-[#0B1D3A] text-white rounded-3xl p-6 border border-emerald-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-300 font-bold">
                  <Award className="w-4 h-4" />
                  <span>JAMB Drill Complete</span>
                </div>
                <h3 className="font-sora font-extrabold text-2xl">
                  Estimated UTME Score:{' '}
                  <span className="text-amber-300">
                    {Math.round(
                      (sessionQuestions.reduce((a, q) => (answers[q.id] === q.correctIndex ? a + 1 : a), 0) /
                        sessionQuestions.length) *
                        400
                    )}{' '}
                    / 400
                  </span>
                </h3>
                <p className="text-xs text-slate-200">
                  Correct Answers:{' '}
                  {sessionQuestions.reduce((a, q) => (answers[q.id] === q.correctIndex ? a + 1 : a), 0)} of{' '}
                  {sessionQuestions.length}. Review worked solutions below using Next/Previous.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Question Card */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-sora font-semibold text-base sm:text-lg text-[#0B1D3A] dark:text-white leading-relaxed">
                  {currentQ.questionText}
                </h2>
                <button
                  type="button"
                  onClick={() => toggleFlag(currentQ.id)}
                  aria-label="Flag question for review"
                  className={`p-2 rounded-xl border transition shrink-0 cursor-pointer ${
                    flaggedIds.includes(currentQ.id)
                      ? 'bg-amber-100 border-amber-400 text-amber-800'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = answers[currentQ.id] === idx;
                  const showFeedback = sessionSubmitted || Boolean(revealedIds[currentQ.id]);
                  const isCorrect = idx === currentQ.correctIndex;
                  const letter = String.fromCharCode(65 + idx);

                  let style =
                    'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-[#0B1D3A] dark:text-slate-100 hover:border-blue-400';
                  if (isSelected && !showFeedback) {
                    style = 'bg-blue-50 dark:bg-blue-950/70 border-blue-600 text-blue-900 dark:text-blue-100 font-semibold';
                  }
                  if (showFeedback) {
                    if (isCorrect) {
                      style = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-950 dark:text-emerald-100 font-bold';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-950 dark:text-rose-100';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectOption(currentQ.id, idx)}
                      className={`w-full text-left p-4 rounded-2xl border text-sm transition flex items-center justify-between gap-3 cursor-pointer ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 font-mono font-bold text-xs flex items-center justify-center shrink-0 text-[#0B1D3A] dark:text-white">
                          {letter}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {showFeedback && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Worked Answer + Optional AI Breakdown + AI Transparency */}
              {(sessionSubmitted || revealedIds[currentQ.id]) && (
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1.5 text-xs sm:text-sm">
                    <div className="font-sora font-bold text-[#0B1D3A] dark:text-blue-200">
                      Official JAMB Worked Solution ({currentQ.syllabusReference})
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{currentQ.explanation}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRequestAIBreakdown(currentQ)}
                      disabled={loadingAiForId === currentQ.id}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B1D3A] hover:bg-[#132C54] text-white text-xs font-sora font-bold transition cursor-pointer"
                    >
                      {loadingAiForId === currentQ.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      )}
                      <span>Get AI Step-by-Step Breakdown</span>
                    </button>
                  </div>

                  {aiBreakdowns[currentQ.id] && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs sm:text-sm">
                      <p className="text-slate-800 dark:text-slate-100 whitespace-pre-wrap leading-relaxed">
                        {aiBreakdowns[currentQ.id]}
                      </p>
                      <AITransparencyPanel
                        contextKey={`jamb-ai-${currentQ.id}`}
                        sourceFeature="JAMB AI Breakdown"
                        subject={`${currentQ.subjectName} (${currentQ.stream})`}
                        promptSummary={`JAMB ${currentQ.year}: ${currentQ.questionText.slice(0, 80)}`}
                        aiResponse={aiBreakdowns[currentQ.id]}
                        methodology={`Matched ${currentQ.syllabusReference} against official ${currentQ.year} UTME marking scheme.`}
                        groundingSources={[currentQ.syllabusReference, `JAMB ${currentQ.year} Past Question`]}
                        createdByUser={studentName}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={goToPrevQuestion}
                  disabled={visitedOrder.lastIndexOf(currentIndex) <= 0 && currentIndex === 0}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-[#0B1D3A] dark:text-slate-200 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous Visited
                </button>
                <button
                  type="button"
                  onClick={goToNextQuestion}
                  disabled={!randomMoveMode && currentIndex >= sessionQuestions.length - 1}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-sora font-bold disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                >
                  {randomMoveMode && <Shuffle className="w-3.5 h-3.5" />}
                  <span>{randomMoveMode ? 'Next Random Question' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Palette */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-5 space-y-4 h-fit">
              <div className="flex items-center justify-between">
                <h3 className="font-sora font-bold text-sm text-[#0B1D3A] dark:text-white">
                  Question Navigator (1–{sessionQuestions.length})
                </h3>
                <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                  {Object.keys(answers).length}/{sessionQuestions.length} done
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1.5 max-h-80 overflow-y-auto pr-1">
                {sessionQuestions.map((q, idx) => {
                  const answered = answers[q.id] !== undefined;
                  const isFlagged = flaggedIds.includes(q.id);
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => jumpToQuestionIndex(idx)}
                      className={`h-8 rounded-lg font-mono text-[11px] font-bold border transition cursor-pointer ${
                        isCurrent
                          ? 'bg-[#0B1D3A] text-white border-[#0B1D3A]'
                          : isFlagged
                          ? 'bg-amber-100 border-amber-400 text-amber-900'
                          : answered
                          ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Keyboard: press <strong>A–D</strong> to answer, <strong>→</strong> for next random question, <strong>←</strong> for previous, <strong>F</strong> to flag.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OFFLINE PACKS & SCORE HISTORY */}
      {activeTab === 'offline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-sora font-bold text-lg text-[#0B1D3A] dark:text-white flex items-center gap-2">
                <WifiOff className="w-5 h-5 text-emerald-600" />
                <span>Saved Offline Study Packs</span>
              </h2>
              <span className="text-xs font-mono text-slate-500">{offlinePacks.length} cached</span>
            </div>

            {offlinePacks.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <p>No offline study packs saved yet. Open any JAMB syllabus or drill pack and click &ldquo;Save Offline&rdquo; so you can study without mobile data.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {offlinePacks.map((pack) => (
                  <div
                    key={pack.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-sora font-bold text-xs text-[#0B1D3A] dark:text-white">
                        {pack.title}
                      </div>
                      <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                        {pack.category} • {pack.itemCount} items • {pack.sizeKB} KB • {pack.savedAt}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {pack.category === 'JAMB Past Questions' && Array.isArray(pack.payload) && (
                        <button
                          type="button"
                          onClick={() => {
                            setSessionQuestions(pack.payload);
                            setCurrentIndex(0);
                            setAnswers({});
                            setSessionSubmitted(false);
                            setSessionActive(true);
                            setActiveTab('driller');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold cursor-pointer"
                        >
                          Open
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setOfflinePacks(removeOfflinePack(pack.id))}
                        aria-label={`Remove ${pack.title}`}
                        className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <h2 className="font-sora font-bold text-lg text-[#0B1D3A] dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Recent JAMB UTME Drill Scores</span>
            </h2>
            {drillHistory.length === 0 ? (
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Complete a JAMB Practice or UTME Mock session to record your /400 score trajectory here.
              </p>
            ) : (
              <div className="space-y-2.5">
                {drillHistory.map((h) => (
                  <div
                    key={h.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-sora font-bold text-[#0B1D3A] dark:text-white">
                        {h.stream} ({h.mode})
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">
                        {h.subjects.join(', ')} • {h.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-extrabold text-sm text-emerald-700 dark:text-emerald-300">
                        {h.utmeScore400} / 400
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {h.correctCount}/{h.totalQuestions} correct
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
