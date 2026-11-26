import React, { useState } from 'react';
import { UserRole } from '../types';
import {
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Users,
  CheckCircle2,
  KeyRound,
  UserPlus,
  Play,
  Plus,
  Search,
  WifiOff,
  Lock,
  Bot,
} from 'lucide-react';

interface RoleHubProps {
  onSelectRole: (role: UserRole, options?: { demo?: boolean; openCreateClass?: boolean; quickSample?: boolean }) => void;
}

const SAMPLE_QUESTIONS = [
  {
    track: 'Science · Physics (JAMB 2024)',
    question: 'A 2 kg mass accelerates from rest at 3 m/s² for 4 s. What is its kinetic energy at t = 4 s?',
    options: ['48 J', '72 J', '144 J', '288 J'],
    correctIndex: 2,
    explanation: 'Final velocity v = u + at = 0 + 3×4 = 12 m/s. Kinetic Energy KE = ½mv² = 0.5 × 2 × 12² = 144 J (NERDC Physics: Work & Energy).',
  },
  {
    track: 'Core · Use of English (JAMB 2023)',
    question: 'Choose the sentence that answers the emphatic stress: "THE PRINCIPAL commended the punctual student."',
    options: [
      'Did the principal punish the punctual student?',
      'Did the vice-principal commend the punctual student?',
      'Did the principal commend the lazy student?',
      'Did the principal commend the punctual teacher?',
    ],
    correctIndex: 1,
    explanation: 'Emphatic stress falls on "THE PRINCIPAL". The matching question must contradict only that stressed actor ("vice-principal").',
  },
  {
    track: 'Commercial · Economics (JAMB 2022)',
    question: 'If a 10% rise in price causes quantity demanded to fall by 20%, the Price Elasticity of Demand (PED) is:',
    options: ['0.5 (Inelastic)', '1.0 (Unitary)', '2.0 (Elastic)', '0.0 (Perfectly Inelastic)'],
    correctIndex: 2,
    explanation: 'PED = |%ΔQd / %ΔP| = 20% / 10% = 2.0 (> 1, Elastic demand).',
  },
];

export const RoleHub: React.FC<RoleHubProps> = ({ onSelectRole }) => {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [samplePicked, setSamplePicked] = useState<number | null>(null);

  const activeSample = SAMPLE_QUESTIONS[sampleIndex];

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* 1. HERO + UNDER-60-SECOND TRY-IT-FIRST ONBOARDING */}
      <section className="bg-[#0B1D3A] text-slate-100 rounded-3xl p-6 sm:p-10 border border-blue-500/30 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Nigerian Curriculum · JAMB 2000–2025 · Offline-Ready</span>
            </div>

            <h1 className="font-sora font-extrabold text-3xl sm:text-5xl text-white leading-tight">
              Learn. <span className="text-blue-300">Grow.</span> <span className="text-amber-300">Achieve.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
              Try a 60-second lesson or JAMB UTME question before signing up. Built for fast loading on Nigerian 3G networks with transparent AI explanations and teacher oversight.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onSelectRole('jamb_driller', { quickSample: true })}
                className="bg-amber-400 hover:bg-amber-300 text-[#0B1D3A] font-sora font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-2xl transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>Try 60-Second JAMB Drill (No Sign-Up)</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectRole('register')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-sora font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl transition flex items-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Free Account</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectRole('login')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/25 font-sora font-semibold text-xs sm:text-sm px-4 py-3.5 rounded-2xl transition flex items-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-amber-300" />
                <span>Sign In</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-slate-200">
              <span className="flex items-center gap-1.5">
                <WifiOff className="w-4 h-4 text-emerald-400" aria-hidden="true" /> Offline Study Packs
              </span>
              <span className="flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-blue-300" aria-hidden="true" /> Teacher-Reviewed AI
              </span>
              <button
                type="button"
                onClick={() => onSelectRole('privacy_center')}
                className="flex items-center gap-1.5 text-emerald-300 hover:text-white underline cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" aria-hidden="true" /> NDPA · COPPA · GDPR Privacy
              </button>
            </div>
          </div>

          {/* Interactive 60-Second Sample Lesson Card */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-white/15 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                Try It Now · Under 60 Seconds
              </span>
              <div className="flex gap-1.5">
                {['Science', 'English', 'Commercial'].map((label, idx) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setSampleIndex(idx);
                      setSamplePicked(null);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      sampleIndex === idx
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-slate-200 hover:bg-white/20'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-mono text-emerald-300">{activeSample.track}</div>
            <p className="font-sora font-semibold text-sm sm:text-base text-white leading-snug">
              {activeSample.question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeSample.options.map((opt, idx) => {
                const answered = samplePicked !== null;
                const isPicked = samplePicked === idx;
                const isCorrect = idx === activeSample.correctIndex;
                let cls = 'bg-white/10 border-white/20 text-slate-100 hover:bg-white/20';
                if (answered && isCorrect) {
                  cls = 'bg-emerald-600/90 border-emerald-400 text-white font-bold';
                } else if (answered && isPicked && !isCorrect) {
                  cls = 'bg-rose-600/80 border-rose-400 text-white';
                }
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSamplePicked(idx)}
                    className={`text-left p-3 rounded-xl border text-xs transition cursor-pointer ${cls}`}
                  >
                    <span className="font-mono font-bold mr-1.5">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {samplePicked !== null && (
              <div className="p-3.5 rounded-xl bg-blue-950/80 border border-blue-400/30 text-xs text-slate-100 space-y-1">
                <div className="font-bold text-amber-300">
                  {samplePicked === activeSample.correctIndex ? 'Correct! Worked Solution:' : 'Worked Solution:'}
                </div>
                <p className="leading-relaxed">{activeSample.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. CLEAR ROLE ENTRY POINTS (Students, Teachers, Parents) */}
      <section className="space-y-4">
        <div>
          <h2 className="font-sora font-extrabold text-2xl text-[#0B1D3A] dark:text-white">
            Choose Your Role to Begin
          </h2>
          <p className="text-xs sm:text-sm text-[#4C5A75] dark:text-slate-300">
            Separate workspaces tailored to what students, teachers, and parents need first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Card */}
          <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-sora font-bold text-lg text-[#0B1D3A] dark:text-white">
                For Students
              </h3>
              <p className="text-xs sm:text-sm text-[#4C5A75] dark:text-slate-300 leading-relaxed">
                Follow lessons matched to your class level (JSS, SSS, or JAMB UTME), save study packs offline, and get transparent AI tutoring.
              </p>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onSelectRole('student', { demo: true })}
                className="w-full bg-[#0B1D3A] hover:bg-[#132C54] text-white font-sora font-bold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>Start a lesson</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onSelectRole('jamb_driller')}
                className="w-full bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800 font-sora font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
              >
                Open JAMB Test Driller (2000–2025)
              </button>
            </div>
          </div>

          {/* Teacher Card */}
          <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-sora font-bold text-lg text-[#0B1D3A] dark:text-white">
                For Teachers &amp; Schools
              </h3>
              <p className="text-xs sm:text-sm text-[#4C5A75] dark:text-slate-300 leading-relaxed">
                Create classes, assign NERDC syllabus modules, grade submissions, and review or override AI-generated answers before students rely on them.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectRole('teacher', { demo: true, openCreateClass: true })}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-sora font-bold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create a class</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Parent Card */}
          <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-sora font-bold text-lg text-[#0B1D3A] dark:text-white">
                For Parents &amp; Guardians
              </h3>
              <p className="text-xs sm:text-sm text-[#4C5A75] dark:text-slate-300 leading-relaxed">
                Look up your child&apos;s grades with their 4-digit Student PIN, message teachers directly, and manage minor consent under NDPA, COPPA, and GDPR.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectRole('parent', { demo: true })}
              className="w-full bg-amber-500 hover:bg-amber-600 text-[#0B1D3A] font-sora font-extrabold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>See my child&apos;s progress</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. JAMB UTME LEARNING CENTER SPOTLIGHT */}
      <section className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-emerald-700 dark:text-emerald-300">
              <Award className="w-4 h-4" /> New Nigerian Education Syllabus (NERDC)
            </div>
            <h2 className="font-sora font-extrabold text-2xl text-[#0B1D3A] dark:text-white">
              JAMB Learning Center &amp; 2000–2025 Test Driller
            </h2>
            <p className="text-xs sm:text-sm text-[#4C5A75] dark:text-slate-300 leading-relaxed">
              Compiled JAMB schemes and past questions from 2000 to 2025 across <strong>Science</strong> (Math, Physics, Chemistry, Biology, Computer Studies), <strong>Arts &amp; Humanities</strong> (Literature, Government, CRS, IRS, History), and <strong>Commercial</strong> (Economics, Commerce, Accounting), plus compulsory Use of English.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#0B1D3A] dark:text-slate-200">Science Stream</span>
              <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#0B1D3A] dark:text-slate-200">Arts &amp; Humanities</span>
              <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#0B1D3A] dark:text-slate-200">Commercial Track</span>
              <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">Save Offline for 3G</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectRole('jamb_driller')}
            className="bg-[#0B1D3A] hover:bg-[#132C54] text-white font-sora font-bold text-xs sm:text-sm px-6 py-4 rounded-2xl transition flex items-center gap-2 cursor-pointer shrink-0 shadow-md"
          >
            <span>Open JAMB Driller &amp; Scheme</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </section>

      {/* 4. TRUST, DATA PROTECTION & AI TRANSPARENCY SUMMARY */}
      <section className="bg-[#0B1D3A] text-slate-100 rounded-3xl p-6 sm:p-8 border border-blue-500/30 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-sora font-bold text-sm text-white">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>How Student Data Is Protected</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            Profiles, PINs, and offline lessons stay in isolated browser storage on your device—with zero ad trackers and HTTPS-proxied AI requests.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 font-sora font-bold text-sm text-white">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>NDPA · COPPA · GDPR &amp; Minors</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            Built for Nigeria&apos;s NDPA (2023), COPPA, and GDPR, with mandatory parent/guardian consent verification for learners under 18.
          </p>
        </div>

        <div className="flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-sora font-bold text-sm text-white">
              <CheckCircle2 className="w-4 h-4 text-blue-300" />
              <span>Export or Erase Anytime</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Inspect our full privacy policy, export your JSON data, or erase local records in one click.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectRole('privacy_center')}
            className="w-fit bg-white text-[#0B1D3A] hover:bg-slate-100 font-sora font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            Read Privacy Policy &amp; Data Controls
          </button>
        </div>
      </section>
    </div>
  );
};
