import React from 'react';
import { UserRole } from '../types';
import { 
  BookOpen, 
  Award, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Cloud, 
  Cpu, 
  LineChart, 
  BookMarked,
  GraduationCap,
  Users,
  CheckCircle2,
  KeyRound,
  Calculator,
  Compass,
  UserPlus
} from 'lucide-react';

interface RoleHubProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleHub: React.FC<RoleHubProps> = ({ onSelectRole }) => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-20">
      {/* Background Circuit Texture */}
      <div className="bg-field" />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-navy to-indigo-950 text-white rounded-3xl p-8 sm:p-14 border border-blue-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 px-3.5 py-1.5 rounded-full font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-gold" /> ✦ THE SMART EDUCATION PLATFORM
            </div>

            <h1 className="font-sora font-extrabold text-4xl sm:text-6xl tracking-tight text-white leading-tight">
              Learn. <span className="text-blue-400">Grow.</span> <span className="text-gold italic font-serif">Achieve.</span> Every Day.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Welcome to <strong className="text-white">iLearnit-365</strong> — a modern digital learning platform connecting students, teachers, schools, and families through secure, intelligent, and accessible education technology.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectRole('register')}
                className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:opacity-95 text-white font-sora font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-gold" /> Register & Generate Real-Time PIN
              </button>

              <button
                onClick={() => onSelectRole('login')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-sora font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition flex items-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-gold" /> Sign In to Portal
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> E-Learning
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI-Powered
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-Time PIN Protocol
              </span>
            </div>
          </div>

          {/* Hero Branding Floating Badge Card */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="group relative bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 hover:border-blue-400/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-w-sm w-full text-center space-y-4 transition-all duration-300 hover:shadow-blue-500/20 hover:-translate-y-1">
              <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/30 border-2 border-amber-400/40 bg-slate-950 p-1 group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/src/assets/images/ilearnit_logo_1786816502338.jpg"
                  alt="iLearnit-365 Official Logo Emblem"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              </div>

              <div>
                <h3 className="font-sora font-extrabold text-2xl text-white tracking-tight flex items-center justify-center gap-1.5">
                  iLearnit<span className="text-[#CC9A2E]">-365</span>
                </h3>
                <p className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-bold mt-0.5">
                  Learn • Grow • Achieve
                </p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Cloud learning, smart AI tutors, CBT examination engines &amp; real-time encrypted PIN security.
                </p>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2 text-left">
                <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-2.5 flex items-center gap-2">
                  <span className="text-base">📖</span>
                  <div>
                    <div className="text-[10px] font-bold text-blue-300 uppercase">E-Learning</div>
                    <div className="text-[10px] text-slate-400">JSS &amp; SSS Syllabus</div>
                  </div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-xl p-2.5 flex items-center gap-2">
                  <span className="text-base">🤖</span>
                  <div>
                    <div className="text-[10px] font-bold text-emerald-300 uppercase">Smart AI</div>
                    <div className="text-[10px] text-slate-400">Step-by-step Tutor</div>
                  </div>
                </div>
                <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl p-2.5 flex items-center gap-2">
                  <span className="text-base">🔐</span>
                  <div>
                    <div className="text-[10px] font-bold text-amber-300 uppercase">PIN Protocol</div>
                    <div className="text-[10px] text-slate-400">4-Digit Auth Key</div>
                  </div>
                </div>
                <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-2.5 flex items-center gap-2">
                  <span className="text-base">📊</span>
                  <div>
                    <div className="text-[10px] font-bold text-purple-300 uppercase">CBT &amp; GPA</div>
                    <div className="text-[10px] text-slate-400">Instant Analytics</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTERED CURRICULUM ACCESS BANNER */}
      <section className="bg-gradient-to-r from-blue-950 via-navy to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-500/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" /> Registered Student & Teacher Access
          </div>
          <h3 className="font-sora font-extrabold text-2xl text-white">
            Course Outlines & Learning Portal Access
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Registered students and teachers get full access to the Junior & Senior Secondary syllabus (JSS1-JSS3 Math, Integrated Science, Computer Studies, Literature), step-by-step worked examples, practice quizzes, and the Pomodoro focus timer.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => onSelectRole('register')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl hover:opacity-90 transition shadow-lg cursor-pointer"
          >
            Register Profile <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* FEATURES GRID (4-COLUMNS) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-mono">
            One Platform • Many Possibilities
          </span>
          <h2 className="text-3xl font-extrabold font-sora text-navy">
            Everything you need to make learning smarter
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            iLearnit-365 brings e-learning, academic performance tracking, and smart tools together in one secure ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-blue-400 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
              📚
            </div>
            <h3 className="font-sora font-bold text-base text-navy">E-Learning</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Access lessons, study materials, assignments, practice quizzes, and revision resources anytime.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-emerald-400 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
              ☁
            </div>
            <h3 className="font-sora font-bold text-base text-navy">Cloud Learning</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Keep your educational resources, assignments, and study logs synced seamlessly across devices.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-amber-400 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
              ⚙
            </div>
            <h3 className="font-sora font-bold text-base text-navy">Smart Education</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Use Gemini AI step-by-step tutors, diagnostic quiz analysis, and personalized study planners.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-indigo-400 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
              🔐
            </div>
            <h3 className="font-sora font-bold text-base text-navy">Real-Time PIN Security</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Protected 4-digit Student PIN authentication ensures parents and students safely view academic records.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - 3-STEP JOURNEY */}
      <section className="bg-gradient-to-br from-navy via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-gold uppercase tracking-widest font-mono">
            Your Learning Journey
          </span>
          <h2 className="text-3xl font-extrabold font-sora text-white">
            Start in three simple steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Register your profile, receive your unique PIN in real-time, and keep moving forward every single day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 relative">
            <div className="w-10 h-10 rounded-full bg-gold text-slate-950 font-extrabold flex items-center justify-center text-sm font-sora">
              01
            </div>
            <h3 className="font-sora font-bold text-lg text-white">Register Profile & Generate PIN</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Complete the security onboarding form to receive a real-time, collision-safe 4-digit Student Access PIN.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 relative">
            <div className="w-10 h-10 rounded-full bg-gold text-slate-950 font-extrabold flex items-center justify-center text-sm font-sora">
              02
            </div>
            <h3 className="font-sora font-bold text-lg text-white">Learn & Practice</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore subject courses, complete assignments, take practice quizzes, and use the Pomodoro timer.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 relative">
            <div className="w-10 h-10 rounded-full bg-gold text-slate-950 font-extrabold flex items-center justify-center text-sm font-sora">
              03
            </div>
            <h3 className="font-sora font-bold text-lg text-white">Track Progress & Results</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Monitor cumulative GPA, attendance logs, term-by-term score breakdowns, and teacher notes in real time.
            </p>
          </div>
        </div>
      </section>

      {/* CHOOSE YOUR PORTAL GRID */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">
            Role-Based Access
          </span>
          <h2 className="text-3xl font-extrabold font-sora text-navy">
            Choose Your Learning Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Dedicated interfaces tailored specifically for students, parents, and educators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Student Card */}
          <button
            onClick={() => onSelectRole('student')}
            className="group relative bg-white border border-slate-200 hover:border-blue-500 rounded-3xl p-6 sm:p-7 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between cursor-pointer space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-sora font-bold text-lg text-navy group-hover:text-blue-600 transition-colors">
                  🎓 Student Portal
                </h3>
                <p className="text-xs text-slate-500 mt-1">Personal learning command center.</p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Courses, lessons & tasks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pomodoro study focus timer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>AI diagnostic feedback</span>
                </li>
              </ul>
            </div>

            <span className="inline-flex items-center justify-center gap-2 text-xs font-bold text-blue-600 border border-blue-500 group-hover:bg-blue-600 group-hover:text-white px-4 py-2.5 rounded-xl transition-all">
              Launch Student Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          {/* Teacher Card */}
          <button
            onClick={() => onSelectRole('teacher')}
            className="group relative bg-white border border-slate-200 hover:border-emerald-500 rounded-3xl p-6 sm:p-7 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between cursor-pointer space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookMarked className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-sora font-bold text-lg text-navy group-hover:text-emerald-600 transition-colors">
                  🏫 Teacher Portal
                </h3>
                <p className="text-xs text-slate-500 mt-1">Class management & evaluations.</p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Manage classes & materials</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Evaluate student scores & rank</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Publish official teacher notes</span>
                </li>
              </ul>
            </div>

            <span className="inline-flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 border border-emerald-500 group-hover:bg-emerald-600 group-hover:text-white px-4 py-2.5 rounded-xl transition-all">
              Launch Teacher Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          {/* Parent Card */}
          <button
            onClick={() => onSelectRole('parent')}
            className="group relative bg-white border border-slate-200 hover:border-amber-500 rounded-3xl p-6 sm:p-7 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between cursor-pointer space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-sora font-bold text-lg text-navy group-hover:text-amber-600 transition-colors">
                  👨‍👩‍👧 Parent Portal
                </h3>
                <p className="text-xs text-slate-500 mt-1">Verified academic tracking.</p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant Student PIN lookup</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Term-by-term GPA breakdown</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct teacher communication</span>
                </li>
              </ul>
            </div>

            <span className="inline-flex items-center justify-center gap-2 text-xs font-bold text-amber-600 border border-amber-500 group-hover:bg-amber-600 group-hover:text-white px-4 py-2.5 rounded-xl transition-all">
              Launch Parent Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          {/* Cyber Security Portal Card */}
          <button
            onClick={() => onSelectRole('cyber_security')}
            className="group relative bg-gradient-to-b from-indigo-950/95 to-slate-950 border border-indigo-500/40 hover:border-cyan-400 rounded-3xl p-6 sm:p-7 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 flex flex-col justify-between cursor-pointer space-y-6 text-white"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30">
                    10-Q Weekly Exams
                  </span>
                </div>
                <h3 className="font-sora font-bold text-lg text-white group-hover:text-cyan-300 transition-colors mt-1.5">
                  🛡️ Cybersecurity Academy
                </h3>
                <p className="text-xs text-slate-300 mt-1">4-Level syllabus with graded weekly tests.</p>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Fundamentals to Cloud Defense</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>10-Question weekly graded tests</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Interactive cryptographic lab</span>
                </li>
              </ul>
            </div>

            <span className="inline-flex items-center justify-center gap-2 text-xs font-bold text-cyan-300 border border-cyan-400/40 group-hover:bg-cyan-500 group-hover:text-slate-950 px-4 py-2.5 rounded-xl transition-all">
              Explore Cybersecurity <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          {/* Registrar Admin Card */}
          <button
            onClick={() => onSelectRole('admin')}
            className="group relative bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 border border-purple-500/40 hover:border-purple-400 rounded-3xl p-6 sm:p-7 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 flex flex-col justify-between cursor-pointer space-y-6 text-white"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-400/30">
                    Official Records
                  </span>
                </div>
                <h3 className="font-sora font-bold text-lg text-white group-hover:text-purple-300 transition-colors mt-1.5">
                  🏛️ Registrar Admin
                </h3>
                <p className="text-xs text-slate-300 mt-1">Student enrollment verification & credentials.</p>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Generate Reg. No. & Student PIN</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Download verification letters</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Send onboarding feedback emails</span>
                </li>
              </ul>
            </div>

            <span className="inline-flex items-center justify-center gap-2 text-xs font-bold text-purple-300 border border-purple-400/40 group-hover:bg-purple-600 group-hover:text-white px-4 py-2.5 rounded-xl transition-all">
              Open Registrar Console <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};
