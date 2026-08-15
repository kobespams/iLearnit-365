import React, { useState } from 'react';
import { ClassGroup, StudentDetail, Announcement, UserRole } from '../types';
import { generateContent } from '../services/api';
import { BookOpen, Users, CheckSquare, Sparkles, Plus, Send, FileText, CheckCircle2, ChevronRight, RefreshCw, PenTool, Calculator, BarChart3, TrendingUp, ArrowRight, Megaphone } from 'lucide-react';
import { JSSMathExplorer } from './JSSMathExplorer';
import { ClassQuizAnalytics } from './ClassQuizAnalytics';
import { StudentAnnouncementsBoard } from './StudentAnnouncementsBoard';

interface TeacherPortalProps {
  classes: ClassGroup[];
  students: StudentDetail[];
  announcements?: Announcement[];
  onAddAnnouncement?: (newAnn: Omit<Announcement, 'id' | 'createdAt' | 'readBy'>) => void;
  onMarkAnnouncementRead?: (id: string) => void;
  onMarkAllAnnouncementsRead?: () => void;
  onNavigateRole?: (role: UserRole) => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({ 
  classes, 
  students,
  announcements = [],
  onAddAnnouncement = () => {},
  onMarkAnnouncementRead = () => {},
  onMarkAllAnnouncementsRead = () => {},
  onNavigateRole,
}) => {
  const [activeTab, setActiveTab] = useState<'classes' | 'analytics' | 'jss-math' | 'broadcasts' | 'grading' | 'ai-lesson-gen'>('classes');
  const [selectedClass, setSelectedClass] = useState<ClassGroup>(classes[0]);

  // Grading Queue state
  const [gradingQueue, setGradingQueue] = useState([
    {
      id: 'sub-1',
      studentName: 'Alex Chen',
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
      studentName: 'Maya Patel',
      assignmentTitle: 'Taylor Series Remainder Theorem',
      courseCode: 'MATH-402',
      submittedDate: 'Yesterday, 8:40 PM',
      codeSnippet: `Error bound R_n(x) <= (M / (n+1)!) * |x - a|^(n+1)\nEvaluated for sin(x) expansion up to 5th degree.`,
      score: '90',
      feedback: 'Good steps. Pay attention to Lagrange boundary conditions.',
      status: 'pending',
    },
  ]);

  // AI Lesson Generator state
  const [lessonTopic, setLessonTopic] = useState('');
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
    setLoadingAi(false);
  };

  const handleGradingSubmit = (id: string) => {
    setGradingQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'graded' } : item))
    );
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
            <Calculator className="w-3.5 h-3.5" /> JSS Math Syllabus
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
        </div>
      </div>

      {/* TAB CONTENT: MY CLASSES */}
      {activeTab === 'classes' && (
        <div className="space-y-8">
          {/* Class Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className={`bg-white border rounded-3xl p-6 shadow-sm cursor-pointer transition-all ${
                  selectedClass.id === cls.id
                    ? 'border-[#2E9B58] ring-2 ring-[#2E9B58]/20'
                    : 'border-[#D8DFEA] hover:border-[#2E9B58]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-[#2E9B58]">{cls.code}</span>
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
            ))}
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
                  <tr className="hover:bg-[#F6F8FB]">
                    <td className="py-3.5 px-4 font-semibold text-[#0B1D3A] flex items-center gap-2">
                      <img src={students[0].avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                      {students[0].name}
                    </td>
                    <td className="py-3.5 px-4 text-[#5B6A88]">{students[0].gradeLevel}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2E9B58]">{students[0].gpa}</td>
                    <td className="py-3.5 px-4 text-[#5B6A88]">{students[0].attendance}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="bg-[#2E9B58]/10 text-[#2E9B58] font-semibold px-2.5 py-0.5 rounded-full text-[10px]">
                        On Track
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F6F8FB]">
                    <td className="py-3.5 px-4 font-semibold text-[#0B1D3A] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#2F6FE0] text-white flex items-center justify-center text-[10px]">M</div>
                      Maya Patel
                    </td>
                    <td className="py-3.5 px-4 text-[#5B6A88]">Grade 11 - Junior</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2E9B58]">3.85</td>
                    <td className="py-3.5 px-4 text-[#5B6A88]">97.0%</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="bg-[#2E9B58]/10 text-[#2E9B58] font-semibold px-2.5 py-0.5 rounded-full text-[10px]">
                        On Track
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F6F8FB]">
                    <td className="py-3.5 px-4 font-semibold text-[#0B1D3A] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#CC9A2E] text-white flex items-center justify-center text-[10px]">J</div>
                      Jordan Lee
                    </td>
                    <td className="py-3.5 px-4 text-[#5B6A88]">Grade 11 - Junior</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#CC9A2E]">3.42</td>
                    <td className="py-3.5 px-4 text-[#5B6A88]">94.2%</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="bg-[#CC9A2E]/10 text-[#CC9A2E] font-semibold px-2.5 py-0.5 rounded-full text-[10px]">
                        Review Needed
                      </span>
                    </td>
                  </tr>
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

      {/* TAB CONTENT: JSS MATH */}
      {activeTab === 'jss-math' && (
        <JSSMathExplorer
          onAssignToClass={(lesson) => {
            alert(`Assigned "${lesson.title}" (${lesson.level}) to ${selectedClass.name}!`);
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
              <h4 className="font-sora font-bold text-base text-[#0B1D3A] border-b border-[#ECF0F6] pb-3 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2E9B58]" /> Generated Lesson Blueprint
              </h4>

              <div className="flex-1 bg-[#F6F8FB] border border-[#D8DFEA] rounded-2xl p-5 font-mono text-xs text-[#0B1D3A] overflow-y-auto min-h-[320px] max-h-[600px] leading-relaxed whitespace-pre-wrap">
                {loadingAi ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 space-y-3">
                    <RefreshCw className="w-6 h-6 text-[#2E9B58] animate-spin" />
                    <p className="text-xs">Architecting lesson plan & rubric with Gemini...</p>
                  </div>
                ) : generatedOutput ? (
                  generatedOutput
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
    </div>
  );
};
