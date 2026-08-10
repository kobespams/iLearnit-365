import React from 'react';
import { UserRole } from '../types';
import { BookOpen, Award, Sparkles, ArrowRight, ShieldCheck, Cloud, Cpu, LineChart, BookMarked } from 'lucide-react';

interface RoleHubProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleHub: React.FC<RoleHubProps> = ({ onSelectRole }) => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Background Circuit Texture */}
      <div className="bg-field" />

      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2E9B58] bg-[#2E9B58]/10 border border-[#2E9B58]/20 px-3.5 py-1.5 rounded-full mono animate-fade-up">
          <span className="w-2 h-2 rounded-full bg-[#2E9B58] animate-ping"></span>
          AI-Powered · Cloud-Secured Learning
        </div>

        <h1 className="font-sora font-extrabold text-4xl sm:text-6xl tracking-tight text-[#0B1D3A] leading-tight">
          Learn. Grow. <span className="bg-gradient-to-r from-[#2E9B58] via-[#CC9A2E] to-[#132C54] bg-clip-text text-transparent">Achieve.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#4C5A75] leading-relaxed max-w-2xl mx-auto">
          One secure ecosystem for every side of education — built for students who study, teachers who guide, and parents who stay close to it all.
        </p>
      </section>

      {/* Role Hub Card Grid & Circuit Connection */}
      <section className="relative max-w-5xl mx-auto mt-14 sm:mt-20">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#7A8AA8] font-mono mb-12">
          Choose how you enter
        </p>

        {/* SVG Wires (desktop) */}
        <div className="hidden md:block absolute -top-12 left-0 right-0 h-32 pointer-events-none z-0">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 900 140" preserveAspectRatio="none">
            <path d="M450,0 L450,40 L150,40 L150,80" fill="none" stroke="#2F6FE0" strokeWidth="2" className="wire-path" />
            <path d="M450,0 L450,60 L450,80" fill="none" stroke="#2E9B58" strokeWidth="2" className="wire-path" />
            <path d="M450,0 L450,40 L750,40 L750,80" fill="none" stroke="#CC9A2E" strokeWidth="2" className="wire-path" />
            
            <circle cx="150" cy="40" r="4" fill="#2F6FE0" className="wire-node" style={{ animationDelay: '0.7s' }} />
            <circle cx="450" cy="60" r="4" fill="#2E9B58" className="wire-node" style={{ animationDelay: '0.85s' }} />
            <circle cx="750" cy="40" r="4" fill="#CC9A2E" className="wire-node" style={{ animationDelay: '1s' }} />
          </svg>
        </div>

        {/* Central Core Badge */}
        <div className="relative z-20 flex justify-center mb-8 md:-mt-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#132C54] to-[#0B1D3A] flex items-center justify-center shadow-xl shadow-[#132C54]/30 border border-white/20 hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-[#F6F8FB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2l8 4-8 4-8-4 8-4Z" />
              <path d="M4 6v6l8 4 8-4V6" />
            </svg>
          </div>
        </div>

        {/* JSS Math Curriculum Featured Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-900 via-navy to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-500/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-gold" /> JSS1 • JSS2 • JSS3 Mathematics Lessons
            </div>
            <h3 className="font-sora font-extrabold text-2xl text-white">
              Junior Secondary Mathematics Syllabus
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore all 19 official curriculum modules from Number & Numeration to Quadratic Equations, Pythagoras Theorem, and BECE prep. Features interactive step-by-step worked examples, teacher guides, and AI problem solvers.
            </p>
          </div>

          <button
            onClick={() => onSelectRole('jss_math')}
            className="relative z-10 inline-flex items-center gap-2 bg-gradient-to-r from-gold to-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl hover:opacity-90 transition shadow-lg shrink-0 cursor-pointer"
          >
            Open JSS Math Explorer <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Student Card */}
          <button
            onClick={() => onSelectRole('student')}
            className="group relative bg-white border border-[#D8DFEA] hover:border-[#2F6FE0] rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#2F6FE0]/20 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#2F6FE0]/10 text-[#2F6FE0] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="font-sora font-bold text-xl text-[#0B1D3A] mb-2 group-hover:text-[#2F6FE0] transition-colors">
                Student
              </h3>
              <p className="text-sm text-[#5B6A88] leading-relaxed mb-6 min-h-[48px]">
                Your courses, progress, and assignments — all in one focused view.
              </p>
            </div>

            <span className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#2F6FE0] border border-[#2F6FE0] group-hover:bg-[#2F6FE0] group-hover:text-white px-5 py-2.5 rounded-full transition-all">
              Enter as Student <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          {/* Teacher Card */}
          <button
            onClick={() => onSelectRole('teacher')}
            className="group relative bg-white border border-[#D8DFEA] hover:border-[#2E9B58] rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#2E9B58]/20 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#2E9B58]/10 text-[#2E9B58] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <BookMarked className="w-7 h-7" />
              </div>
              <h3 className="font-sora font-bold text-xl text-[#0B1D3A] mb-2 group-hover:text-[#2E9B58] transition-colors">
                Teacher
              </h3>
              <p className="text-sm text-[#5B6A88] leading-relaxed mb-6 min-h-[48px]">
                Manage classes, track outcomes, and guide every learner forward.
              </p>
            </div>

            <span className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#2E9B58] border border-[#2E9B58] group-hover:bg-[#2E9B58] group-hover:text-white px-5 py-2.5 rounded-full transition-all">
              Enter as Teacher <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          {/* Parent Card */}
          <button
            onClick={() => onSelectRole('parent')}
            className="group relative bg-white border border-[#D8DFEA] hover:border-[#CC9A2E] rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#CC9A2E]/20 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#CC9A2E]/10 text-[#CC9A2E] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="font-sora font-bold text-xl text-[#0B1D3A] mb-2 group-hover:text-[#CC9A2E] transition-colors">
                Parent
              </h3>
              <p className="text-sm text-[#5B6A88] leading-relaxed mb-6 min-h-[48px]">
                See how your child is doing, and stay connected to their growth.
              </p>
            </div>

            <span className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#CC9A2E] border border-[#CC9A2E] group-hover:bg-[#CC9A2E] group-hover:text-white px-5 py-2.5 rounded-full transition-all">
              Enter as Parent <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="max-w-5xl mx-auto mt-16 sm:mt-24 pt-8 border-t border-[#D8DFEA]">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-xs font-semibold text-[#41527A]">
          <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur p-3.5 rounded-2xl border border-[#D8DFEA]/80 shadow-sm">
            <BookOpen className="w-4 h-4 text-[#132C54]" />
            <span>E-Learning</span>
          </div>

          <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur p-3.5 rounded-2xl border border-[#D8DFEA]/80 shadow-sm">
            <Cloud className="w-4 h-4 text-[#2F6FE0]" />
            <span>Cloud Learning</span>
          </div>

          <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur p-3.5 rounded-2xl border border-[#D8DFEA]/80 shadow-sm">
            <Cpu className="w-4 h-4 text-[#2E9B58]" />
            <span>Smart Education</span>
          </div>

          <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur p-3.5 rounded-2xl border border-[#D8DFEA]/80 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#CC9A2E]" />
            <span>Secure & Trusted</span>
          </div>

          <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur p-3.5 rounded-2xl border border-[#D8DFEA]/80 shadow-sm col-span-2 sm:col-span-1">
            <LineChart className="w-4 h-4 text-[#132C54]" />
            <span>Academic Success</span>
          </div>
        </div>
      </section>
    </div>
  );
};
