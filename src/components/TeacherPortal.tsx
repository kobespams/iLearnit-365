import React, { useState } from 'react';
import { ClassGroup, StudentDetail, Announcement, UserRole } from '../types';
import { generateContent } from '../services/api';
import { 
  BookOpen, Users, CheckSquare, Sparkles, Plus, Send, FileText, CheckCircle2, 
  ChevronRight, RefreshCw, PenTool, Calculator, BarChart3, TrendingUp, 
  ArrowRight, Megaphone, Download, Copy, Eye 
} from 'lucide-react';
import { JSSAllSubjectsExplorer } from './JSSAllSubjectsExplorer';
import { ClassQuizAnalytics } from './ClassQuizAnalytics';
import { StudentAnnouncementsBoard } from './StudentAnnouncementsBoard';
import { COURSE_ICON_REGISTRY, getCourseIconInfo, convertToPlainTextDocument } from '../utils/courseIconRegistry';
import { PlainTextDocumentModal } from './PlainTextDocumentModal';
import { getRegisteredStudents } from '../services/authStorage';
import { AITransparencyPanel } from './AITransparencyPanel';
import {
  getAIOutputRecords,
  reviewOrOverrideAIRecord,
  saveAIOutputRecord,
} from '../services/aiTransparencyService';
import { recordAuditAction } from '../services/auditTrailService';
import { AIOutputRecord } from '../types';

const TEACHER_CLASSES_STORAGE_KEY = 'ilearnit_teacher_classes_v1';

interface TeacherPortalProps {
  classes: ClassGroup[];
  students: StudentDetail[];
  announcements?: Announcement[];
  onAddAnnouncement?: (newAnn: Omit<Announcement, 'id' | 'createdAt' | 'readBy'>) => void;
  onMarkAnnouncementRead?: (id: string) => void;
  onMarkAllAnnouncementsRead?: () => void;
  onDeleteAnnouncement?: (id: string) => void;
  onNavigateRole?: (role: UserRole) => void;
  initialOpenCreateClass?: boolean;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({ 
  classes, 
  students,
  announcements = [],
  onAddAnnouncement = () => {},
  onMarkAnnouncementRead = () => {},
  onMarkAllAnnouncementsRead = () => {},
  onDeleteAnnouncement,
  onNavigateRole,
  initialOpenCreateClass = false,
}) => {
  const [activeTab, setActiveTab] = useState<'classes' | 'analytics' | 'jss-math' | 'broadcasts' | 'grading' | 'ai-lesson-gen' | 'ai-review'>('classes');
  const [localClasses, setLocalClasses] = useState<ClassGroup[]>(() => {
    try {
      const raw = window.localStorage.getItem(TEACHER_CLASSES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return classes;
  });
  const [selectedClass, setSelectedClass] = useState<ClassGroup>(localClasses[0] || classes[0]);
  const [showCreateClassForm, setShowCreateClassForm] = useState<boolean>(initialOpenCreateClass);
  const [newClassName, setNewClassName] = useState('');
  const [newClassCode, setNewClassCode] = useState('');
  const [newClassSchedule, setNewClassSchedule] = useState('Mon / Wed • 10:00 AM');
  const [newClassTopic, setNewClassTopic] = useState('');

  // AI Review & Override state
  const [aiRecords, setAiRecords] = useState<AIOutputRecord[]>(() => getAIOutputRecords());
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [overrideDraft, setOverrideDraft] = useState('');
  const [overrideNoteDraft, setOverrideNoteDraft] = useState('');
  const [assignedToast, setAssignedToast] = useState<string | null>(null);
  
  // Plain Text Modal state
  const [plainTextDoc, setPlainTextDoc] = useState<{
    title: string;
    subtitle?: string;
    content: string;
    subjectId?: string;
    docType?: string;
  } | null>(null);

  const showAssignedToast = (msg: string) => {
    setAssignedToast(msg);
    setTimeout(() => setAssignedToast(null), 3500);
  };

  // Real registered students list
  const registeredStudentsList = getRegisteredStudents();
  const displayStudents = registeredStudentsList.length > 0 ? registeredStudentsList : students;

  // Grading Queue state with real registered students
  const [gradingQueue, setGradingQueue] = useState(() => {
    const student1 = displayStudents[0] || { name: 'Samuel Adebayo' };
    const student2 = displayStudents[1] || { name: 'Chidinma Okafor' };
    return [
      {
        id: 'sub-1',
        studentName: student1.name,
        assignmentTitle: 'Binary Search Tree Balancing Algorithm',
        courseCode: 'CS-301',
        submittedDate: 'Today, 2:15 PM',
        codeSnippet: `class Node {\n  int key, height;\n  Node left, right;\n}\n\nint getBalance(Node N) {\n  if (N == null) return 0;\n  return height(N.left) - height(N.right);\n}`,
        score: '95',
        feedback: 'Excellent clean recursive rotation handling.',
        status: 'pending',
      },
      {
        id: 'sub-2',
        studentName: student2.name,
        assignmentTitle: 'Taylor Series Remainder Theorem',
        courseCode: 'MATH-402',
        submittedDate: 'Yesterday, 8:40 PM',
        codeSnippet: `Error bound R_n(x) <= (M / (n+1)!) * |x - a|^(n+1)\nEvaluated for sin(x) expansion up to 5th degree.`,
        score: '90',
        feedback: 'Good steps. Pay attention to Lagrange boundary conditions.',
        status: 'pending',
      },
    ];
  });

  // AI Lesson Generator state
  const [lessonTopic, setLessonTopic] = useState('');
  const [lessonSubject, setLessonSubject] = useState('Computer Science');
  const [gradeLevel, setGradeLevel] = useState('High School AP / Intro College');
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const handleGenerateLessonPlan = async () => {
    if (!lessonTopic.trim() || loadingAi) return;

    setLoadingAi(true);
    setGeneratedOutput('');

    const prompt = `Create a detailed, high-quality, step-by-step Lesson Plan and Grading Rubric for the topic: "${lessonTopic}". Target audience: ${gradeLevel}.

Include:
1. Learning Objectives (Bloom's Taxonomy)
2. 45-minute Classroom Flow Agenda
3. Key Concept Explanations & Examples
4. Hands-on Practice Exercise
5. 4-tier Grading Rubric (Exemplary, Proficient, Developing, Novice)`;

    const result = await generateContent({
      prompt,
      systemInstruction: 'You are an award-winning Curriculum Director and Master Educator specializing in STEM and Humanities.',
      temperature: 0.4,
    });

    setGeneratedOutput(result.text);
    saveAIOutputRecord({
      contextKey: `teacher-lesson-${lessonTopic.trim().toLowerCase().replace(/\s+/g, '-')}`,
      sourceFeature: 'AI Lesson Architect',
      subject: lessonSubject,
      promptSummary: `${gradeLevel}: ${lessonTopic}`,
      aiResponse: result.text,
      modelUsed: 'Gemini Flash + NERDC / Bloom Curriculum Rubric',
      methodology: `Synthesized 45-min classroom agenda, worked examples, and 4-tier rubric for ${gradeLevel}.`,
      groundingSources: [`${lessonSubject} Scheme`, 'Bloom Taxonomy Lesson Standard'],
      createdByUser: 'Dr. Sarah Jenkins (Educator)',
    });
    setAiRecords(getAIOutputRecords());
    setLoadingAi(false);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim() || !newClassCode.trim()) return;
    const created: ClassGroup = {
      id: `cls-${Date.now()}`,
      code: newClassCode.trim().toUpperCase(),
      name: newClassName.trim(),
      studentsCount: 1,
      avgGrade: 'A',
      pendingGrading: 0,
      schedule: newClassSchedule.trim() || 'Mon / Wed • 10:00 AM',
      recentTopic: newClassTopic.trim() || 'Course Orientation & Syllabus',
    };
    const updated = [created, ...localClasses];
    setLocalClasses(updated);
    setSelectedClass(created);
    setShowCreateClassForm(false);
    setNewClassName('');
    setNewClassCode('');
    setNewClassTopic('');
    try {
      window.localStorage.setItem(TEACHER_CLASSES_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    recordAuditAction({
      category: 'SYSTEM_CONFIG',
      action: `Teacher Created Class ${created.code}`,
      actorId: 'TCH-PORTAL-01',
      actorName: 'Dr. Sarah Jenkins',
      actorRole: 'TEACHER',
      targetResource: `${created.name} (${created.code})`,
      status: 'SUCCESS',
      details: `Schedule: ${created.schedule} • Topic: ${created.recentTopic}`,
    });
    showAssignedToast(`Created class "${created.name}" (${created.code})!`);
  };

  const handleApproveAIRecord = (id: string) => {
    const updated = reviewOrOverrideAIRecord({
      id,
      reviewStatus: 'approved',
      reviewedBy: 'Dr. Sarah Jenkins',
      reviewNote: 'Verified accurate for classroom use.',
    });
    setAiRecords(updated);
    recordAuditAction({
      category: 'FEEDBACK_DISPATCH',
      action: 'Teacher Approved AI Explanation',
      actorId: 'TCH-PORTAL-01',
      actorName: 'Dr. Sarah Jenkins',
      actorRole: 'TEACHER',
      targetResource: `AI Record ${id}`,
      status: 'SUCCESS',
      details: 'Educator verified AI output accuracy for student consumption.',
    });
    showAssignedToast('AI explanation verified and marked approved.');
  };

  const handleSaveAIOverride = (id: string) => {
    if (!overrideDraft.trim()) return;
    const updated = reviewOrOverrideAIRecord({
      id,
      reviewStatus: 'overridden',
      teacherOverrideText: overrideDraft.trim(),
      reviewedBy: 'Dr. Sarah Jenkins',
      reviewNote: overrideNoteDraft.trim() || 'Educator override applied.',
    });
    setAiRecords(updated);
    recordAuditAction({
      category: 'FEEDBACK_DISPATCH',
      action: 'Teacher Overrode AI Output',
      actorId: 'TCH-PORTAL-01',
      actorName: 'Dr. Sarah Jenkins',
      actorRole: 'TEACHER',
      targetResource: `AI Record ${id}`,
      status: 'INFO',
      details: `Published educator correction: ${overrideNoteDraft.trim() || 'Educator override applied.'}`,
    });
    setEditingRecordId(null);
    setOverrideDraft('');
    setOverrideNoteDraft('');
    showAssignedToast('Teacher override published — students will now see your correction.');
  };

  const handleGradingSubmit = (id: string) => {
    const targetItem = gradingQueue.find((item) => item.id === id);
    setGradingQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'graded' } : item))
    );
    if (targetItem) {
      recordAuditAction({
        category: 'SYSTEM_CONFIG',
        action: `Teacher Graded Submission (${targetItem.courseCode})`,
        actorId: 'TCH-PORTAL-01',
        actorName: 'Dr. Sarah Jenkins',
        actorRole: 'TEACHER',
        targetResource: `${targetItem.studentName} — ${targetItem.assignmentTitle}`,
        status: 'SUCCESS',
        details: `Assigned score ${targetItem.score}% with educator feedback.`,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Teacher Welcome Header */}
      <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-sora font-bold text-2xl text-[#0B1D3A]">Dr. Sarah Jenkins</h2>
            <span className="bg-[#2E9B58]/10 text-[#2E9B58] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#2E9B58]/20">
              Department Chair • CS & Mathematics
            </span>
          </div>
          <p className="text-xs text-[#5B6A88] mt-1 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#2E9B58]" /> Teacher Portal • 3 Active Classes • 84 Enrolled Students
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#ECF0F6] p-1.5 rounded-2xl border border-[#D8DFEA]">
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'classes'
                ? 'bg-[#2E9B58] text-white shadow-sm'
                : 'text-[#4C5A75] hover:text-[#0B1D3A]'
            }`}
          >
            My Classes
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm ring-1 ring-emerald-400'
                : 'text-emerald-800 bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" /> Class Analytics & Trends
          </button>
          <button
            onClick={() => setActiveTab('jss-math')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'jss-math'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-blue-700 bg-blue-50/80 hover:bg-blue-100'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" /> JSS 1–3 All Subjects
          </button>
          <button
            onClick={() => setActiveTab('broadcasts')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'broadcasts'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-800 bg-amber-50/80 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-amber-600" /> Announcements ({announcements.length})
          </button>
          <button
            onClick={() => setActiveTab('grading')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'grading'
                ? 'bg-[#2E9B58] text-white shadow-sm'
                : 'text-[#4C5A75] hover:text-[#0B1D3A]'
            }`}
          >
            Grading Queue ({gradingQueue.filter((g) => g.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('ai-lesson-gen')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ai-lesson-gen'
                ? 'bg-[#132C54] text-white shadow-sm'
                : 'text-[#4C5A75] hover:text-[#0B1D3A]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#CC9A2E]" /> AI Lesson Architect
          </button>
          <button
            onClick={() => {
              setAiRecords(getAIOutputRecords());
              setActiveTab('ai-review');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ai-review'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> AI Review &amp; Override ({aiRecords.length})
          </button>
        </div>
      </div>

      {/* TAB CONTENT: MY CLASSES */}
      {activeTab === 'classes' && (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-sora font-bold text-lg text-[#0B1D3A]">Active Classes ({localClasses.length})</h3>
              <p className="text-xs text-[#5B6A88]">Select a class card to view roster or create a new classroom.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateClassForm((p) => !p)}
              className="bg-[#0B1D3A] hover:bg-[#132C54] text-white font-sora font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Create a class</span>
            </button>
          </div>

          {showCreateClassForm && (
            <form
              onSubmit={handleCreateClass}
              className="bg-white border-2 border-[#2E9B58]/40 rounded-3xl p-6 shadow-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-sora font-bold text-base text-[#0B1D3A]">Create a New Classroom</h4>
                <button
                  type="button"
                  onClick={() => setShowCreateClassForm(false)}
                  className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1D3A] mb-1">Class Name *</label>
                  <input
                    type="text"
                    required
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="e.g., SS3 Physics UTME Prep"
                    className="w-full bg-[#F6F8FB] border border-[#D8DFEA] rounded-xl px-3 py-2 text-xs text-[#0B1D3A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1D3A] mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={newClassCode}
                    onChange={(e) => setNewClassCode(e.target.value)}
                    placeholder="e.g., PHY-301"
                    className="w-full bg-[#F6F8FB] border border-[#D8DFEA] rounded-xl px-3 py-2 text-xs text-[#0B1D3A] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1D3A] mb-1">Schedule</label>
                  <input
                    type="text"
                    value={newClassSchedule}
                    onChange={(e) => setNewClassSchedule(e.target.value)}
                    className="w-full bg-[#F6F8FB] border border-[#D8DFEA] rounded-xl px-3 py-2 text-xs text-[#0B1D3A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1D3A] mb-1">Initial Syllabus Topic</label>
                  <input
                    type="text"
                    value={newClassTopic}
                    onChange={(e) => setNewClassTopic(e.target.value)}
                    placeholder="e.g., Current Electricity"
                    className="w-full bg-[#F6F8FB] border border-[#D8DFEA] rounded-xl px-3 py-2 text-xs text-[#0B1D3A]"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-[#2E9B58] hover:bg-green-700 text-white font-sora font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Save &amp; Launch Class
              </button>
            </form>
          )}

          {/* Class Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {localClasses.map((cls) => {
              const iconInfo = getCourseIconInfo(cls.name + ' ' + cls.code);
              const IconComponent = iconInfo.icon;
              return (
                <div
                  key={cls.id}
                  onClick={() => setSelectedClass(cls)}
                  className={`bg-white border rounded-3xl p-6 shadow-sm cursor-pointer transition-all ${
                    selectedClass.id === cls.id
                      ? 'border-[#2E9B58] ring-2 ring-[#2E9B58]/20 shadow-md'
                      : 'border-[#D8DFEA] hover:border-[#2E9B58]/50 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl ${iconInfo.badgeBg} ${iconInfo.colorClass} border flex items-center justify-center`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#2E9B58]">{cls.code}</span>
                    </div>
                    <span className="text-[10px] font-semibold bg-[#F6F8FB] border border-[#D8DFEA] px-2.5 py-1 rounded-full text-[#0B1D3A]">
                      {cls.schedule}
                    </span>
                  </div>

                  <h3 className="font-sora font-bold text-base text-[#0B1D3A] mb-3 leading-snug">{cls.name}</h3>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-[#ECF0F6] pt-3">
                    <div>
                      <span className="text-[10px] text-[#7A8AA8] uppercase font-mono">Enrolled</span>
                      <p className="font-bold text-[#0B1D3A]">{cls.studentsCount} Students</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#7A8AA8] uppercase font-mono">Class Average</span>
                      <p className="font-bold text-[#2E9B58]">{cls.avgGrade}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Roster & Selected Class Details */}
          <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#ECF0F6] pb-4 gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-[#2E9B58]">{selectedClass.code} Class Roster</span>
                <h3 className="font-sora font-bold text-xl text-[#0B1D3A]">{selectedClass.name}</h3>
              </div>
              <div className="text-xs text-[#5B6A88]">
                Recent Topic: <span className="font-semibold text-[#0B1D3A]">{selectedClass.recentTopic}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#0B1D3A]">
                <thead>
                  <tr className="border-b border-[#D8DFEA] text-[#7A8AA8] uppercase font-mono text-[10px]">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Grade Level</th>
                    <th className="py-3 px-4">GPA</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECF0F6]">
                  {displayStudents.map((st, idx) => (
                    <tr key={st.id || idx} className="hover:bg-[#F6F8FB]">
                      <td className="py-3.5 px-4 font-semibold text-[#0B1D3A] flex items-center gap-2">
                        <img src={st.avatar} alt={`${st.name} profile avatar`} className="w-6 h-6 rounded-full object-cover border border-slate-300" />
                        <span>{st.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#5B6A88]">{st.gradeLevel || 'Registered Student'}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#2E9B58]">{st.gpa || 3.85}</td>
                      <td className="py-3.5 px-4 text-[#5B6A88]">{st.attendance || '96.5%'}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="bg-[#2E9B58]/10 text-[#2E9B58] font-semibold px-2.5 py-0.5 rounded-full text-[10px]">
                          Active Scholar ✓
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Link to Analytics */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sora font-bold text-xs text-[#0B1D3A]">
                    {selectedClass.name} Assessment Analytics
                  </h4>
                  <p className="text-[11px] text-[#5B6A88]">
                    Explore 6-quiz performance trajectory, score histograms, and skill competency radar.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('analytics')}
                className="inline-flex items-center justify-center gap-1.5 bg-[#0B1D3A] hover:bg-[#132C54] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
              >
                Open Analytics Summary <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: CLASS PERFORMANCE & QUIZ ANALYTICS */}
      {activeTab === 'analytics' && (
        <ClassQuizAnalytics
          classes={classes}
          students={students}
          selectedClassId={selectedClass.id}
          onSelectClass={setSelectedClass}
        />
      )}

      {/* TAB CONTENT: JSS 1-3 ALL SUBJECTS */}
      {activeTab === 'jss-math' && (
        <JSSAllSubjectsExplorer
          onAssignSubjectToClass={(subj, lvl) => {
            showAssignedToast(`Assigned "${subj.subjectName}" (${lvl} NERDC Syllabus) to ${selectedClass.name}!`);
          }}
          onAssignToClass={(lesson) => {
            showAssignedToast(`Assigned "${lesson.title}" (${lesson.level}) to ${selectedClass.name}!`);
          }}
        />
      )}

      {/* TAB CONTENT: ANNOUNCEMENTS & CAMPUS BROADCASTS */}
      {activeTab === 'broadcasts' && (
        <StudentAnnouncementsBoard
          announcements={announcements}
          currentUserId="teacher-1"
          onMarkRead={onMarkAnnouncementRead}
          onMarkAllRead={onMarkAllAnnouncementsRead}
          onDeleteAnnouncement={onDeleteAnnouncement}
          onAddAnnouncement={onAddAnnouncement}
          onNavigateRole={onNavigateRole}
          activeRole="teacher"
          userName="Dr. Sarah Jenkins"
        />
      )}

      {/* TAB CONTENT: GRADING QUEUE */}
      {activeTab === 'grading' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-sora font-bold text-xl text-[#0B1D3A]">Pending Student Submissions</h3>

            <div className="space-y-6">
              {gradingQueue.map((item) => (
                <div
                  key={item.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    item.status === 'graded'
                      ? 'bg-[#F6F8FB] border-[#D8DFEA] opacity-75'
                      : 'bg-white border-[#2E9B58]/40 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#ECF0F6] pb-3 mb-4 gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#2E9B58]">{item.courseCode}</span>
                      <h4 className="font-sora font-bold text-base text-[#0B1D3A]">{item.assignmentTitle}</h4>
                      <p className="text-xs text-[#5B6A88]">Student: <span className="font-semibold text-[#0B1D3A]">{item.studentName}</span> • {item.submittedDate}</p>
                    </div>

                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      item.status === 'graded'
                        ? 'bg-[#2E9B58]/10 text-[#2E9B58]'
                        : 'bg-[#CC9A2E]/10 text-[#CC9A2E]'
                    }`}>
                      {item.status === 'graded' ? 'Graded ✓' : 'Needs Grading'}
                    </span>
                  </div>

                  {/* Submission Code / Text */}
                  <div className="bg-[#0B1D3A] text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto mb-4 whitespace-pre">
                    {item.codeSnippet}
                  </div>

                  {/* Grade Input & Feedback */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-mono text-[#7A8AA8] uppercase mb-1">Score (/100)</label>
                      <input
                        type="text"
                        defaultValue={item.score}
                        disabled={item.status === 'graded'}
                        className="w-full bg-[#F6F8FB] border border-[#D8DFEA] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#0B1D3A]"
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <label className="block text-[10px] font-mono text-[#7A8AA8] uppercase mb-1">Teacher Feedback</label>
                      <input
                        type="text"
                        defaultValue={item.feedback}
                        disabled={item.status === 'graded'}
                        className="w-full bg-[#F6F8FB] border border-[#D8DFEA] rounded-xl px-3 py-2 text-xs text-[#0B1D3A]"
                      />
                    </div>
                    <div className="sm:col-span-3 flex justify-end">
                      {item.status !== 'graded' && (
                        <button
                          onClick={() => handleGradingSubmit(item.id)}
                          className="w-full sm:w-auto bg-[#2E9B58] hover:bg-green-700 text-white font-sora text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                          Save & Publish Grade
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: AI LESSON ARCHITECT */}
      {activeTab === 'ai-lesson-gen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#CC9A2E]" />
                <h3 className="font-sora font-bold text-lg text-[#0B1D3A]">AI Curriculum Generator</h3>
              </div>
              <p className="text-xs text-[#5B6A88]">
                Instantly draft comprehensive lesson plans, practice problems, or grading rubrics powered by Gemini.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#0B1D3A] mb-1">Target Subject & Topic</label>
                <input
                  type="text"
                  value={lessonTopic}
                  onChange={(e) => setLessonTopic(e.target.value)}
                  placeholder="e.g., Graph Traversal Algorithms (BFS vs DFS)"
                  className="w-full bg-[#F6F8FB] border border-[#D8DFEA] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1D3A] focus:outline-none focus:border-[#2E9B58]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1D3A] mb-1">Education Level</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full bg-[#F6F8FB] border border-[#D8DFEA] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1D3A] focus:outline-none focus:border-[#2E9B58] cursor-pointer"
                >
                  <option value="High School AP / Intro College">High School AP / Intro College</option>
                  <option value="Middle School STEM">Middle School STEM</option>
                  <option value="Advanced University Undergraduate">Advanced University Undergraduate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1D3A] mb-1">Quick Subject Presets</label>
                <div className="flex flex-wrap gap-1 mb-3">
                  {['Math', 'Computer Science', 'Cybersecurity', 'Music', 'Physics', 'Literature'].map((subj) => (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => setLessonSubject(subj)}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition cursor-pointer border ${
                        lessonSubject === subj
                          ? 'bg-[#132C54] text-white border-[#132C54]'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateLessonPlan}
                disabled={!lessonTopic.trim() || loadingAi}
                className="w-full bg-[#132C54] hover:bg-[#0B1D3A] disabled:opacity-40 text-white font-sora text-xs font-semibold py-3 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                {loadingAi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Drafting Curriculum...
                  </>
                ) : (
                  <>
                    <PenTool className="w-4 h-4 text-[#CC9A2E]" /> Generate Lesson Plan & Rubric
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Lesson Output (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between border-b border-[#ECF0F6] pb-3 mb-4">
                <h4 className="font-sora font-bold text-base text-[#0B1D3A] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#2E9B58]" /> Generated Lesson Blueprint
                </h4>
                {generatedOutput && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setPlainTextDoc({
                          title: `${lessonSubject}: ${lessonTopic} - Lesson Blueprint (.txt)`,
                          subtitle: `Curriculum Plan for ${gradeLevel}`,
                          content: generatedOutput,
                          subjectId: lessonSubject,
                          docType: 'LESSON PLAN & RUBRIC (.txt)',
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Plain Text (.txt)</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 bg-[#F6F8FB] border border-[#D8DFEA] rounded-2xl p-5 font-mono text-xs text-[#0B1D3A] overflow-y-auto min-h-[320px] max-h-[600px] leading-relaxed whitespace-pre-wrap">
                {loadingAi ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 space-y-3">
                    <RefreshCw className="w-6 h-6 text-[#2E9B58] animate-spin" />
                    <p className="text-xs">Architecting lesson plan & rubric with Gemini...</p>
                  </div>
                ) : generatedOutput ? (
                  <div className="space-y-4">
                    <div>{generatedOutput}</div>
                    <AITransparencyPanel
                      contextKey={`teacher-lesson-${lessonTopic.trim().toLowerCase().replace(/\s+/g, '-')}`}
                      sourceFeature="AI Lesson Architect"
                      subject={lessonSubject}
                      promptSummary={`${gradeLevel}: ${lessonTopic}`}
                      aiResponse={generatedOutput}
                      methodology={`Constructed Bloom-aligned lesson plan and 4-tier rubric for ${gradeLevel}.`}
                      groundingSources={[`${lessonSubject} Curriculum`, 'Bloom Taxonomy Rubric Standard']}
                      createdByUser="Dr. Sarah Jenkins"
                    />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center py-12 space-y-2">
                    <Sparkles className="w-8 h-8 text-slate-300" />
                    <p className="text-xs">Enter a topic on the left to generate a complete classroom blueprint.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: AI REVIEW & OVERRIDE */}
      {activeTab === 'ai-review' && (
        <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[#ECF0F6] pb-4">
            <h3 className="font-sora font-bold text-xl text-[#0B1D3A]">
              AI Transparency &amp; Educator Override Queue
            </h3>
            <p className="text-xs text-[#5B6A88] mt-1">
              Review AI-generated student explanations, inspect how each answer was produced, approve verified answers, or publish a teacher correction that immediately appears to students.
            </p>
          </div>

          <div className="space-y-4">
            {aiRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-2xl bg-[#F6F8FB] border border-[#D8DFEA] space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-blue-700">{rec.sourceFeature}</span>
                    <span className="mx-1.5 text-slate-400">•</span>
                    <span className="font-bold text-[#0B1D3A]">{rec.subject}</span>
                    <span className="mx-1.5 text-slate-400">•</span>
                    <span className="text-slate-600">{rec.createdByUser} ({rec.createdAt})</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] uppercase ${
                      rec.reviewStatus === 'approved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : rec.reviewStatus === 'overridden'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-200 text-slate-800 border border-slate-300'
                    }`}
                  >
                    {rec.reviewStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="font-semibold text-[#0B1D3A]">Prompt: {rec.promptSummary}</div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-800 whitespace-pre-wrap leading-relaxed">
                  <strong className="block text-[11px] text-slate-500 mb-1">Original AI Output ({rec.modelUsed}):</strong>
                  {rec.aiResponse}
                </div>
                <div className="text-[11px] text-slate-600">
                  <strong>How produced:</strong> {rec.methodology} ({rec.groundingSources.join(' · ')})
                </div>

                {rec.teacherOverrideText && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950">
                    <strong className="block text-[11px] mb-1">Active Educator Override ({rec.reviewedBy}):</strong>
                    {rec.teacherOverrideText}
                  </div>
                )}

                {editingRecordId === rec.id ? (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <label className="block font-bold text-[#0B1D3A]">Corrected / Overridden Explanation for Students</label>
                    <textarea
                      rows={3}
                      value={overrideDraft}
                      onChange={(e) => setOverrideDraft(e.target.value)}
                      placeholder="Write the authoritative teacher explanation..."
                      className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-[#0B1D3A]"
                    />
                    <input
                      type="text"
                      value={overrideNoteDraft}
                      onChange={(e) => setOverrideNoteDraft(e.target.value)}
                      placeholder="Optional educator note (e.g., Clarified WAEC/JAMB formula)..."
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0B1D3A]"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveAIOverride(rec.id)}
                        className="px-4 py-2 rounded-xl bg-[#0B1D3A] text-white font-bold cursor-pointer"
                      >
                        Publish Override
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingRecordId(null)}
                        className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleApproveAIRecord(rec.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                    >
                      Approve AI Answer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRecordId(rec.id);
                        setOverrideDraft(rec.teacherOverrideText || rec.aiResponse);
                        setOverrideNoteDraft(rec.reviewNote || '');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#0B1D3A] font-bold cursor-pointer"
                    >
                      Edit &amp; Override AI Output
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Assignment Feedback Toast */}
      {assignedToast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-[#2E9B58] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{assignedToast}</span>
        </div>
      )}

      {/* Plain Text Document Modal */}
      <PlainTextDocumentModal
        isOpen={plainTextDoc !== null}
        onClose={() => setPlainTextDoc(null)}
        title={plainTextDoc?.title || 'Educational Document (.txt)'}
        subtitle={plainTextDoc?.subtitle}
        content={plainTextDoc?.content || ''}
        subjectId={plainTextDoc?.subjectId}
        docType={plainTextDoc?.docType}
      />
    </div>
  );
};
