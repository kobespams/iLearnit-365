import React, { useState } from 'react';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  Sparkles, 
  Award, 
  TrendingUp, 
  RotateCcw, 
  Save, 
  Check, 
  HelpCircle, 
  ArrowRight,
  BookOpen,
  Target,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '../types';

interface CourseItem {
  id: string;
  code: string;
  title: string;
  units: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
}

interface CGPACalculatorHubProps {
  onNavigateRole: (role: UserRole) => void;
}

const GRADE_POINTS_5 = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
const GRADE_POINTS_4 = { A: 4.0, B: 3.0, C: 2.0, D: 1.0, E: 0.5, F: 0.0 };

export const CGPACalculatorHub: React.FC<CGPACalculatorHubProps> = ({ onNavigateRole }) => {
  const [scale, setScale] = useState<'5.0' | '4.0'>('5.0');
  const [previousCgpa, setPreviousCgpa] = useState<number>(4.75);
  const [previousUnits, setPreviousUnits] = useState<number>(36);

  const [courses, setCourses] = useState<CourseItem[]>([
    { id: '1', code: 'MTH-101', title: 'Mathematics & Quantitative Reasoning', units: 4, grade: 'A' },
    { id: '2', code: 'CMP-102', title: 'Computer Studies & Cybersecurity', units: 3, grade: 'A' },
    { id: '3', code: 'BST-103', title: 'Basic Science & Technology', units: 3, grade: 'A' },
    { id: '4', code: 'ENG-101', title: 'English Studies & Composition', units: 3, grade: 'B' },
    { id: '5', code: 'CVE-104', title: 'Civic & Digital Cyber Ethics', units: 2, grade: 'A' },
    { id: '6', code: 'CCA-105', title: 'Creative & Cultural Arts', units: 2, grade: 'A' },
  ]);

  const [targetCgpa, setTargetCgpa] = useState<number>(4.85);

  const currentGradePoints = scale === '5.0' ? GRADE_POINTS_5 : GRADE_POINTS_4;

  // Calculate Semester GPA
  const totalSemesterUnits = courses.reduce((acc, c) => acc + (Number(c.units) || 0), 0);
  const totalQualityPoints = courses.reduce((acc, c) => acc + ((Number(c.units) || 0) * (currentGradePoints[c.grade] || 0)), 0);
  const semesterGpa = totalSemesterUnits > 0 ? (totalQualityPoints / totalSemesterUnits) : 0;

  // Calculate Cumulative CGPA
  const totalCumulativeUnits = previousUnits + totalSemesterUnits;
  const previousTotalQualityPoints = previousUnits * previousCgpa;
  const cumulativeQualityPoints = previousTotalQualityPoints + totalQualityPoints;
  const newCumulativeCgpa = totalCumulativeUnits > 0 ? (cumulativeQualityPoints / totalCumulativeUnits) : 0;

  // Classification
  const getClassification = (cgpa: number, currentScale: '5.0' | '4.0') => {
    if (currentScale === '5.0') {
      if (cgpa >= 4.50) return { label: 'First Class Honours / Distinction', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300' };
      if (cgpa >= 3.50) return { label: 'Second Class Honours (Upper Division)', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-300' };
      if (cgpa >= 2.40) return { label: 'Second Class Honours (Lower Division)', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-300' };
      if (cgpa >= 1.50) return { label: 'Third Class Honours', color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 border-orange-300' };
      return { label: 'Pass / Probation Warning', color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border-red-300' };
    } else {
      if (cgpa >= 3.70) return { label: 'Summa Cum Laude (Distinction)', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300' };
      if (cgpa >= 3.30) return { label: 'Magna Cum Laude (Upper Division)', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-300' };
      if (cgpa >= 2.70) return { label: 'Cum Laude (Honors)', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-300' };
      return { label: 'Good Standing', color: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border-slate-300' };
    }
  };

  const currentClassification = getClassification(newCumulativeCgpa, scale);

  const handleAddCourse = () => {
    const newId = Date.now().toString();
    setCourses([...courses, {
      id: newId,
      code: `CRS-${courses.length + 101}`,
      title: 'New Elective / Subject',
      units: 3,
      grade: 'A'
    }]);
  };

  const handleRemoveCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter(c => c.id !== id));
  };

  const handleUpdateCourse = (id: string, field: keyof CourseItem, value: any) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleReset = () => {
    setCourses([
      { id: '1', code: 'MTH-101', title: 'Mathematics', units: 3, grade: 'A' },
      { id: '2', code: 'ENG-101', title: 'English Studies', units: 3, grade: 'A' },
    ]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn text-slate-900 dark:text-white">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0B1D3A] to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-3 py-1 rounded-full">
            <Calculator className="w-3.5 h-3.5" />
            <span>Academic Performance Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-sora">
            CGPA & Honors Classification Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Compute your Semester Grade Point Average (GPA), forecast Cumulative CGPA milestones, and simulate target scenarios across both 5.0 and 4.0 grading scales.
          </p>
        </div>

        {/* Scale Toggle */}
        <div className="bg-slate-950/80 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-1">
          <button
            onClick={() => setScale('5.0')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
              scale === '5.0' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            5.0 Scale (Nigeria / UK)
          </button>
          <button
            onClick={() => setScale('4.0')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
              scale === '4.0' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            4.0 Scale (US Standard)
          </button>
        </div>
      </div>

      {/* Main Calculation Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Semester GPA */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-bold">
            Semester GPA (Current)
          </span>
          <div className="text-4xl font-extrabold font-sora text-blue-600 dark:text-cyan-400">
            {semesterGpa.toFixed(2)}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Registered Units: <strong>{totalSemesterUnits}</strong></span>
            <span>Quality Pts: <strong>{totalQualityPoints}</strong></span>
          </div>
        </div>

        {/* Cumulative CGPA */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-bold">
            Projected Cumulative CGPA
          </span>
          <div className="text-4xl font-extrabold font-sora text-emerald-600 dark:text-emerald-400">
            {newCumulativeCgpa.toFixed(2)}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Total Units: <strong>{totalCumulativeUnits}</strong></span>
            <span>Total Pts: <strong>{cumulativeQualityPoints.toFixed(1)}</strong></span>
          </div>
        </div>

        {/* Honors Standing */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-bold">
              Projected Honors Standing
            </span>
            <div className={`mt-2 p-3 rounded-2xl border text-xs font-sora font-extrabold ${currentClassification.color}`}>
              {currentClassification.label}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Scale: {scale} Maximum Weighted Point Matrix
          </div>
        </div>

      </div>

      {/* Previous Academic Standing Inputs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-sora font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Previous Academic Record (Before Current Semester)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
              Prior Cumulative CGPA
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max={scale === '5.0' ? 5.0 : 4.0}
              value={previousCgpa}
              onChange={(e) => setPreviousCgpa(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white font-mono font-bold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
              Total Units Completed Previously
            </label>
            <input
              type="number"
              min="0"
              value={previousUnits}
              onChange={(e) => setPreviousUnits(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white font-mono font-bold outline-none"
            />
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-sora font-bold text-base text-slate-900 dark:text-white">
              Current Semester Course Registry & Grade Points
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enter credit units and anticipated letter grades for each registered course.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleAddCourse}
              className="px-4 py-2 rounded-xl text-xs font-sora font-bold bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Course Row</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-mono border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Course Code</th>
                <th className="px-6 py-3.5">Course Title</th>
                <th className="px-4 py-3.5 text-center">Credit Units</th>
                <th className="px-4 py-3.5 text-center">Anticipated Grade</th>
                <th className="px-4 py-3.5 text-center">Quality Points</th>
                <th className="px-4 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {courses.map((course) => {
                const pts = (Number(course.units) || 0) * (currentGradePoints[course.grade] || 0);
                return (
                  <tr key={course.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        value={course.code}
                        onChange={(e) => handleUpdateCourse(course.id, 'code', e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-500 rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold text-slate-900 dark:text-white w-28"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        value={course.title}
                        onChange={(e) => handleUpdateCourse(course.id, 'title', e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 dark:text-white w-full min-w-[200px]"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <select
                        value={course.units}
                        onChange={(e) => handleUpdateCourse(course.id, 'units', parseInt(e.target.value))}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-500 rounded-lg px-3 py-1.5 font-mono text-xs font-bold text-slate-900 dark:text-white"
                      >
                        {[1, 2, 3, 4, 5, 6].map(u => (
                          <option key={u} value={u}>{u} Units</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <select
                        value={course.grade}
                        onChange={(e) => handleUpdateCourse(course.id, 'grade', e.target.value as any)}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-500 rounded-lg px-3 py-1.5 font-mono text-xs font-black text-emerald-600 dark:text-emerald-400"
                      >
                        {Object.keys(currentGradePoints).map(g => (
                          <option key={g} value={g}>{g} ({currentGradePoints[g as keyof typeof currentGradePoints]} pts)</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-sm text-blue-600 dark:text-cyan-400">
                      {pts}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleRemoveCourse(course.id)}
                        disabled={courses.length <= 1}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition disabled:opacity-30 cursor-pointer"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
            {courses.length} courses loaded • {totalSemesterUnits} total credit units
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateRole('results')}
              className="text-xs font-sora font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Terminal Results Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
