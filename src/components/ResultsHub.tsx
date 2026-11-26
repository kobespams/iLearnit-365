import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Award, 
  Download, 
  Printer, 
  CheckCircle2, 
  TrendingUp, 
  GraduationCap, 
  Calendar, 
  Search, 
  Filter, 
  QrCode, 
  ShieldCheck, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { StudentDetail, UserRole } from '../types';

interface ResultsHubProps {
  student: StudentDetail;
  onNavigateRole: (role: UserRole) => void;
}

interface TermReport {
  term: string;
  session: string;
  totalCourses: number;
  creditsEarned: number;
  gpa: number;
  position: string;
  attendance: string;
  principalRemarks: string;
  subjects: {
    name: string;
    code: string;
    ca1: number; // /20
    ca2: number; // /20
    exam: number; // /60
    total: number; // /100
    grade: string;
    remarks: string;
  }[];
}

const SAMPLE_TERM_REPORTS: TermReport[] = [
  {
    term: "First Term (Harmattan)",
    session: "2025/2026 Academic Session",
    totalCourses: 6,
    creditsEarned: 18,
    gpa: 4.85,
    position: "2nd out of 48 Students",
    attendance: "98.5%",
    principalRemarks: "Exceptional mastery in Mathematics, Computer Studies, and Sciences. Consistent dedication.",
    subjects: [
      { name: "Mathematics & Quantitative Reasoning", code: "MTH-101", ca1: 19, ca2: 18, exam: 58, total: 95, grade: "A1", remarks: "Distinction" },
      { name: "Computer Studies & Cybersecurity", code: "CMP-102", ca1: 20, ca2: 19, exam: 57, total: 96, grade: "A1", remarks: "Distinction" },
      { name: "Basic Science & Technology", code: "BST-103", ca1: 18, ca2: 17, exam: 54, total: 89, grade: "A1", remarks: "Excellent" },
      { name: "English Studies & Literature", code: "ENG-101", ca1: 17, ca2: 18, exam: 52, total: 87, grade: "A1", remarks: "Excellent" },
      { name: "Civic & Cyber Ethics", code: "CVE-104", ca1: 19, ca2: 19, exam: 53, total: 91, grade: "A1", remarks: "Distinction" },
      { name: "Creative & Cultural Arts (Music)", code: "CCA-105", ca1: 18, ca2: 18, exam: 50, total: 86, grade: "A1", remarks: "Excellent" },
    ]
  },
  {
    term: "Second Term (Rain)",
    session: "2025/2026 Academic Session",
    totalCourses: 6,
    creditsEarned: 18,
    gpa: 4.78,
    position: "3rd out of 48 Students",
    attendance: "99.0%",
    principalRemarks: "Superb analytical skills demonstrated in terminal assessments.",
    subjects: [
      { name: "Mathematics & Quantitative Reasoning", code: "MTH-101", ca1: 18, ca2: 19, exam: 55, total: 92, grade: "A1", remarks: "Distinction" },
      { name: "Computer Studies & Cybersecurity", code: "CMP-102", ca1: 19, ca2: 19, exam: 56, total: 94, grade: "A1", remarks: "Distinction" },
      { name: "Basic Science & Technology", code: "BST-103", ca1: 17, ca2: 18, exam: 51, total: 86, grade: "A1", remarks: "Excellent" },
      { name: "English Studies & Literature", code: "ENG-101", ca1: 16, ca2: 17, exam: 49, total: 82, grade: "A1", remarks: "Very Good" },
      { name: "Civic & Cyber Ethics", code: "CVE-104", ca1: 18, ca2: 18, exam: 52, total: 88, grade: "A1", remarks: "Excellent" },
      { name: "Creative & Cultural Arts (Music)", code: "CCA-105", ca1: 17, ca2: 17, exam: 48, total: 82, grade: "A1", remarks: "Very Good" },
    ]
  }
];

export const ResultsHub: React.FC<ResultsHubProps> = ({ student, onNavigateRole }) => {
  const [selectedTermIndex, setSelectedTermIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);

  const currentReport = SAMPLE_TERM_REPORTS[selectedTermIndex];

  const filteredSubjects = currentReport.subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const averageScore = Math.round(
    currentReport.subjects.reduce((acc, curr) => acc + curr.total, 0) / currentReport.subjects.length
  );

  const handlePrintTranscript = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn text-slate-900 dark:text-white">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0B1D3A] to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
            <Award className="w-3.5 h-3.5" />
            <span>Academic Performance & Assessment Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-sora">
            Official Results & Terminal Grade Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Review continuous assessments, terminal examination transcripts, weighted grade points, and verified digital academic credentials for <span className="text-emerald-300 font-bold">{student.name}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowTranscriptModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 text-xs font-sora font-extrabold px-4 py-2.5 rounded-xl shadow-lg transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Official Digital Transcript</span>
          </button>

          <button
            onClick={() => onNavigateRole('cgpa')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-bold px-4 py-2.5 rounded-xl border border-cyan-500/30 transition cursor-pointer"
          >
            <TrendingUp className="w-4 h-4" />
            <span>CGPA Calculator</span>
          </button>
        </div>
      </div>

      {/* Academic Highlights 4-Box Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">Cumulative GPA</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-sora text-emerald-600 dark:text-emerald-400 mt-1">
            {currentReport.gpa.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ 5.00</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">First Class Standing</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">Average Score</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-sora text-blue-600 dark:text-cyan-400 mt-1">
            {averageScore}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Distinction Level</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">Class Position</div>
          <div className="text-xl sm:text-2xl font-extrabold font-sora text-amber-600 dark:text-amber-400 mt-1 truncate">
            {currentReport.position.split(' ')[0]}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">{currentReport.position}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">Attendance Rate</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-sora text-purple-600 dark:text-purple-400 mt-1">
            {currentReport.attendance}
          </div>
          <div className="text-[11px] text-emerald-500 font-semibold mt-1">Exemplary Punctuality</div>
        </div>

      </div>

      {/* Term Selector & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Term Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {SAMPLE_TERM_REPORTS.map((rep, idx) => (
            <button
              key={rep.term}
              onClick={() => setSelectedTermIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-sora font-bold whitespace-nowrap transition cursor-pointer ${
                selectedTermIndex === idx
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {rep.term}
            </button>
          ))}
        </div>

        {/* High-Contrast Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search subject or course code..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition font-medium"
          />
        </div>
      </div>

      {/* Main Results Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-sora font-bold text-base text-slate-900 dark:text-white">
              Subject Assessment Breakdown — {currentReport.term}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Continuous Assessment (CA 40%) + Terminal Examination (60%) = Total Score (100%)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>{currentReport.session}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase font-mono border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Subject & Code</th>
                <th className="px-4 py-3.5 text-center">CA 1 (20)</th>
                <th className="px-4 py-3.5 text-center">CA 2 (20)</th>
                <th className="px-4 py-3.5 text-center">Exam (60)</th>
                <th className="px-4 py-3.5 text-center font-bold">Total (100)</th>
                <th className="px-4 py-3.5 text-center">Grade</th>
                <th className="px-6 py-3.5">Academic Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredSubjects.map((sub) => (
                <tr key={sub.code} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4">
                    <div className="font-sora font-bold text-slate-900 dark:text-white text-xs">{sub.name}</div>
                    <div className="font-mono text-[10px] text-slate-400">{sub.code}</div>
                  </td>
                  <td className="px-4 py-4 text-center font-mono font-semibold">{sub.ca1}</td>
                  <td className="px-4 py-4 text-center font-mono font-semibold">{sub.ca2}</td>
                  <td className="px-4 py-4 text-center font-mono font-semibold">{sub.exam}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-mono font-black text-sm text-blue-600 dark:text-cyan-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800/50">
                      {sub.total}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-mono font-extrabold text-xs px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50">
                      {sub.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{sub.remarks}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Principal Remarks Card */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">Principal / Academic Advisor Remarks:</div>
            <p className="text-xs text-slate-700 dark:text-slate-300 italic font-medium">
              "{currentReport.principalRemarks}"
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 shrink-0 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4" />
            <span>Digitally Certified by Registrar</span>
          </div>
        </div>
      </div>

      {/* OFFICIAL DIGITAL TRANSCRIPT MODAL */}
      {showTranscriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-500/50 p-6 sm:p-10 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Action Bar (Print / Close) */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Academic Credential — ILN-{student.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintTranscript}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-sora font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Transcript</span>
                </button>
                <button
                  onClick={() => setShowTranscriptModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Official Transcript Header */}
            <div className="text-center space-y-2 border-b pb-6">
              <div className="text-xs font-mono uppercase tracking-widest text-slate-500">Federal Republic of Nigeria — National Educational Framework</div>
              <h2 className="text-xl sm:text-2xl font-black font-sora tracking-tight text-[#0B1D3A]">
                iLearnit-365 DIGITAL ACADEMY
              </h2>
              <div className="text-xs font-bold text-emerald-700 font-mono">OFFICIAL STUDENT ACADEMIC TRANSCRIPT</div>
            </div>

            {/* Student Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">STUDENT NAME</span>
                <span className="font-bold text-slate-900">{student.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">REGISTRATION ID</span>
                <span className="font-bold text-blue-700">{student.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ACADEMIC LEVEL</span>
                <span className="font-bold text-slate-900">{student.gradeLevel}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">CUMULATIVE GPA</span>
                <span className="font-black text-emerald-600">{currentReport.gpa.toFixed(2)} / 5.00</span>
              </div>
            </div>

            {/* Subject List */}
            <div className="border rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 uppercase font-mono text-[10px] text-slate-600 border-b">
                  <tr>
                    <th className="p-3">Course Title</th>
                    <th className="p-3 text-center">Score / 100</th>
                    <th className="p-3 text-center">Grade</th>
                    <th className="p-3">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-800">
                  {currentReport.subjects.map((s) => (
                    <tr key={s.code}>
                      <td className="p-3 font-semibold">{s.name} ({s.code})</td>
                      <td className="p-3 text-center font-mono font-bold">{s.total}</td>
                      <td className="p-3 text-center font-mono font-black text-emerald-700">{s.grade}</td>
                      <td className="p-3 text-slate-600">{s.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Transcript Footer & Verification Seal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t text-xs">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-slate-900 text-white rounded-xl p-1 flex items-center justify-center">
                  <QrCode className="w-12 h-12" />
                </div>
                <div>
                  <div className="font-mono font-bold text-slate-900">VERIFICATION HASH</div>
                  <div className="font-mono text-[10px] text-slate-500">SHA256: 0x9f4a8b7c2e...</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Status: Officially Validated</div>
                </div>
              </div>

              <div className="text-right font-mono text-[11px] space-y-1">
                <div className="font-bold text-slate-900">Dr. Folashade Adeleke</div>
                <div className="text-slate-500">Chief Academic Registrar</div>
                <div className="text-[10px] text-slate-400">Date: {new Date().toLocaleDateString()}</div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
