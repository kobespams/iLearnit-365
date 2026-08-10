import React, { useState } from 'react';
import { UserRole, StudentDetail } from '../types';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  KeyRound, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  Award,
  BarChart3,
  Check,
  User,
  Lock,
  ChevronRight
} from 'lucide-react';
import { SAMPLE_STUDENTS, getStudentByPin } from '../data/mockData';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole, student: StudentDetail) => void;
  onNavigateToHub: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateToHub }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('parent');
  const [pinInput, setPinInput] = useState<string>('8842'); // Default to Alex Chen for quick testing
  const [teacherPass, setTeacherPass] = useState<string>('1010');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live lookup of student based on PIN
  const matchedStudent = getStudentByPin(pinInput);

  const handleSelectDemoPin = (pin: string) => {
    setPinInput(pin);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (selectedRole === 'student' || selectedRole === 'parent') {
      if (!pinInput.trim()) {
        setErrorMessage('Please enter a valid Student PIN.');
        return;
      }

      const student = getStudentByPin(pinInput);
      if (!student) {
        setErrorMessage(`Invalid Student PIN "${pinInput}". Try 8842, 9102, 7731, or 5520.`);
        return;
      }

      onLoginSuccess(selectedRole, student);
    } else if (selectedRole === 'teacher') {
      // Default to the first student profile context for class management
      const defaultStudent = SAMPLE_STUDENTS[0];
      onLoginSuccess('teacher', defaultStudent);
    } else {
      onNavigateToHub();
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative z-10">
      <div className="max-w-4xl w-full bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative">
        
        {/* Left Decorative Branding Column */}
        <div className="md:col-span-5 bg-gradient-to-br from-navy-deep via-navy to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" /> PIN Secured Portal
            </div>

            <div>
              <h2 className="text-3xl font-extrabold font-sora text-white leading-tight">
                Academic Performance Gate
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Enter your assigned Student PIN to instantly unlock personalized academic report cards, attendance logs, JSS math progress, and teacher notes.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-Role Interface (Student, Parent, Teacher)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Encrypted 4-Digit Student Access PIN</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-Time GPA & Curriculum Progress Verification</span>
              </div>
            </div>
          </div>

          {/* Quick Demo PIN Helper List */}
          <div className="relative z-10 pt-8 border-t border-slate-800 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Sample Student PINs for Testing:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {SAMPLE_STUDENTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    if (selectedRole === 'teacher') setSelectedRole('parent');
                    handleSelectDemoPin(s.pin);
                  }}
                  className={`text-left p-2 rounded-xl border transition-all cursor-pointer ${
                    pinInput === s.pin
                      ? 'bg-blue-600/40 border-blue-400 text-white font-bold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-mono text-gold font-bold">PIN: {s.pin}</div>
                  <div className="text-[10px] text-slate-300 truncate">{s.name} ({s.gradeLevel.split('-')[0]})</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Interactive Form Column */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-6">
            {/* Header / Title */}
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">
                iLearnit-365 Authentication
              </span>
              <h3 className="text-2xl font-bold font-sora text-navy mt-1">
                Select Your Interface Role
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your portal display is customized according to your role and verified Student PIN.
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('student');
                  setErrorMessage(null);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'student'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-navy hover:bg-white/60'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('parent');
                  setErrorMessage(null);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'parent'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-navy hover:bg-white/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Parent</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('teacher');
                  setErrorMessage(null);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'teacher'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-navy hover:bg-white/60'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Teacher</span>
              </button>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {selectedRole !== 'teacher' ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-blue-600" /> Enter Student Access PIN
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">e.g. 8842 or 9102</span>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      maxLength={12}
                      value={pinInput}
                      onChange={(e) => {
                        setPinInput(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="Enter 4-digit Student PIN..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-wider"
                    />
                    {matchedStudent && (
                      <div className="absolute right-3 top-2.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> PIN Verified
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Teacher ID / Portal Key
                    </label>
                    <input
                      type="password"
                      value={teacherPass}
                      onChange={(e) => setTeacherPass(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Teacher portal provides full class management, student performance evaluation, and PIN directory lookup.
                  </p>
                </div>
              )}

              {/* Error Alert */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Live Academic Performance Preview Card */}
              {selectedRole !== 'teacher' && matchedStudent && (
                <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={matchedStudent.avatar}
                        alt={matchedStudent.name}
                        className="w-8 h-8 rounded-full object-cover border border-blue-300"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-navy font-sora">{matchedStudent.name}</h4>
                        <p className="text-[10px] text-slate-500">{matchedStudent.gradeLevel}</p>
                      </div>
                    </div>
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                      GPA {matchedStudent.gpa}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] text-center">
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Attendance</div>
                      <div className="font-extrabold text-navy">{matchedStudent.attendance}</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Parent</div>
                      <div className="font-extrabold text-navy truncate">{matchedStudent.parentName || 'Verified'}</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Rank</div>
                      <div className="font-extrabold text-emerald-700">Top 5%</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full text-white font-sora font-extrabold text-xs sm:text-sm py-3.5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'student'
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                    : selectedRole === 'parent'
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                }`}
              >
                <span>
                  {selectedRole === 'student'
                    ? matchedStudent
                      ? `Access ${matchedStudent.name}'s Student Portal`
                      : 'Authenticate & Enter Student Portal'
                    : selectedRole === 'parent'
                    ? matchedStudent
                      ? `View ${matchedStudent.name}'s Academic Performance`
                      : 'Access Child Academic Performance'
                    : 'Launch Teacher Management Portal'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Need help with PIN assignment?</span>
            <button
              type="button"
              onClick={onNavigateToHub}
              className="text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Back to Ecosystem Hub
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
