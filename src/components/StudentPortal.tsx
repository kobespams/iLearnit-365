import React, { useState } from 'react';
import { Course, Assignment, StudentDetail, QuizQuestion } from '../types';
import { generateContent } from '../services/api';
import { GraduationCap, BookOpen, Clock, Award, CheckCircle2, Send, Sparkles, AlertCircle, HelpCircle, RefreshCw, ChevronRight, Calculator, Calendar } from 'lucide-react';
import { JSSMathExplorer } from './JSSMathExplorer';
import { WeeklyStudyScheduler } from './WeeklyStudyScheduler';

interface StudentPortalProps {
  student: StudentDetail;
  courses: Course[];
  assignments: Assignment[];
  quizQuestions: QuizQuestion[];
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  student,
  courses,
  assignments,
  quizQuestions,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'jss-math' | 'study-scheduler' | 'quiz' | 'ai-tutor'>('dashboard');
  
  // AI Tutor state
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorSubject, setTutorSubject] = useState('Computer Science');
  const [tutorMessages, setTutorMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello ${student.name}! I am your iLearnit-365 AI Study Companion. How can I help you prepare for CS-301 or AP Calculus today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [loadingTutor, setLoadingTutor] = useState(false);

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [aiQuizExplanation, setAiQuizExplanation] = useState<string | null>(null);
  const [loadingAiExplanation, setLoadingAiExplanation] = useState<boolean>(false);

  // Pending assignment completion state
  const [localAssignments, setLocalAssignments] = useState<Assignment[]>(assignments);

  const fetchAiExplanationForQuiz = async (qIndex: number, chosenOptionIdx: number) => {
    const q = quizQuestions[qIndex];
    if (!q) return;

    const isCorrect = chosenOptionIdx === q.correctAnswer;
    const chosenOptionText = q.options[chosenOptionIdx];
    const correctOptionText = q.options[q.correctAnswer];

    setLoadingAiExplanation(true);
    setAiQuizExplanation(null);

    try {
      const systemInstruction = `You are an expert, encouraging AI Tutor on iLearnit-365. ${
        isCorrect
          ? 'The student answered the quiz question correctly. Provide a brief 1-2 sentence reinforcement explaining why this principle works.'
          : 'The student selected an INCORRECT answer on a quiz. Provide an immediate, helpful breakdown explaining why their selected option is wrong or what common mistake leads to it, and explain step-by-step how to reach the correct answer.'
      }`;

      const prompt = `Question: "${q.question}"
Option Selected by Student: "${chosenOptionText}" (${isCorrect ? 'CORRECT' : 'INCORRECT'})
Correct Answer Option: "${correctOptionText}"
Standard Reference Note: "${q.explanation}"

${
  isCorrect
    ? 'Highlight key insights and reinforce the core concept in 2 short sentences.'
    : `Please provide an immediate AI breakdown:
1. Explain specifically why option "${chosenOptionText}" is incorrect and the common misconception behind choosing it.
2. Provide step-by-step mathematical/logical reasoning on how to arrive at the correct answer "${correctOptionText}".`
}
Keep the response clear, encouraging, direct, and under 4 concise sentences.`;

      const res = await generateContent({
        prompt,
        systemInstruction,
        temperature: 0.4,
      });

      setAiQuizExplanation(res.text || 'Unable to generate AI explanation at this moment.');
    } catch (err) {
      console.error('Error getting AI quiz explanation:', err);
      setAiQuizExplanation(
        `Immediate AI Analysis: Option "${chosenOptionText}" is incorrect. The correct answer is "${correctOptionText}". See the standard explanation below for details.`
      );
    } finally {
      setLoadingAiExplanation(false);
    }
  };

  const handleSendTutorMessage = async () => {
    if (!tutorQuery.trim() || loadingTutor) return;

    const userText = tutorQuery.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTutorQuery('');
    
    setTutorMessages((prev) => [...prev, { sender: 'user', text: userText, time: timeStr }]);
    setLoadingTutor(true);

    const systemPrompt = `You are an encouraging, expert high school / early college AI Tutor specializing in ${tutorSubject}. Explain concepts step-by-step with clear examples.`;
    
    const result = await generateContent({
      prompt: `Subject context: ${tutorSubject}.\nStudent question: ${userText}`,
      systemInstruction: systemPrompt,
      temperature: 0.5,
    });

    setTutorMessages((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: result.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setLoadingTutor(false);
  };

  const handleQuizAnswer = (optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedOption(optionIdx);
  };

  const submitQuizQuestion = () => {
    if (selectedOption === null) return;
    setQuizSubmitted(true);
    const isCorrect = selectedOption === quizQuestions[quizIndex].correctAnswer;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
    fetchAiExplanationForQuiz(quizIndex, selectedOption);
  };

  const nextQuizQuestion = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelectedOption(null);
      setQuizSubmitted(false);
      setAiQuizExplanation(null);
      setLoadingAiExplanation(false);
    }
  };

  const markAssignmentDone = (assignmentId: string) => {
    setLocalAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, status: 'submitted' as const } : a))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Welcome Header */}
      <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#2F6FE0] shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-sora font-bold text-2xl text-[#0B1D3A]">{student.name}</h2>
              <span className="bg-[#2F6FE0]/10 text-[#2F6FE0] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#2F6FE0]/20">
                {student.gradeLevel}
              </span>
            </div>
            <p className="text-xs text-[#5B6A88] mt-1 flex flex-wrap items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#2F6FE0]" /> Student Portal • ID: {student.studentId || student.id}
              <span className="bg-blue-50 text-blue-800 text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-blue-200">
                Access PIN: {student.pin || '8842'}
              </span>
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#ECF0F6] p-1.5 rounded-2xl border border-[#D8DFEA] w-full md:w-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#2F6FE0] text-white shadow-sm'
                : 'text-[#4C5A75] hover:text-[#0B1D3A]'
            }`}
          >
            Overview
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
            onClick={() => setActiveTab('study-scheduler')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'study-scheduler'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Weekly Study Scheduler
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-[#2F6FE0] text-white shadow-sm'
                : 'text-[#4C5A75] hover:text-[#0B1D3A]'
            }`}
          >
            Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-[#2F6FE0] text-white shadow-sm'
                : 'text-[#4C5A75] hover:text-[#0B1D3A]'
            }`}
          >
            Practice Quiz
          </button>
          <button
            onClick={() => setActiveTab('ai-tutor')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ai-tutor'
                ? 'bg-[#132C54] text-white shadow-sm'
                : 'text-[#4C5A75] hover:text-[#0B1D3A]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#CC9A2E]" /> AI Tutor
          </button>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D8DFEA] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#5B6A88]">Cumulative GPA</span>
            <Award className="w-4 h-4 text-[#2E9B58]" />
          </div>
          <p className="font-sora font-extrabold text-2xl text-[#0B1D3A]">{student.gpa.toFixed(2)}</p>
          <p className="text-[10px] text-[#2E9B58] font-semibold mt-1">Top 5% Academic Standing</p>
        </div>

        <div className="bg-white border border-[#D8DFEA] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#5B6A88]">Attendance Rate</span>
            <Clock className="w-4 h-4 text-[#2F6FE0]" />
          </div>
          <p className="font-sora font-extrabold text-2xl text-[#0B1D3A]">{student.attendance}</p>
          <p className="text-[10px] text-[#2F6FE0] font-semibold mt-1">112 / 114 Classes Present</p>
        </div>

        <div className="bg-white border border-[#D8DFEA] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#5B6A88]">Study Streak</span>
            <Sparkles className="w-4 h-4 text-[#CC9A2E]" />
          </div>
          <p className="font-sora font-extrabold text-2xl text-[#0B1D3A]">{student.streakDays} Days</p>
          <p className="text-[10px] text-[#CC9A2E] font-semibold mt-1">Daily Log Active</p>
        </div>

        <div className="bg-white border border-[#D8DFEA] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#5B6A88]">Active Subjects</span>
            <BookOpen className="w-4 h-4 text-[#132C54]" />
          </div>
          <p className="font-sora font-extrabold text-2xl text-[#0B1D3A]">{courses.length}</p>
          <p className="text-[10px] text-[#132C54] font-semibold mt-1">Spring Term 2026</p>
        </div>
      </div>

      {/* TAB CONTENT: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Courses Progress (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-sora font-bold text-lg text-[#0B1D3A] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#2F6FE0]" /> Current Course Mastery
                </h3>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="text-xs font-semibold text-[#2F6FE0] hover:underline"
                >
                  View Details
                </button>
              </div>

              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="p-4 rounded-2xl bg-[#F6F8FB] border border-[#D8DFEA] hover:border-[#2F6FE0]/40 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#2F6FE0]">
                          {course.code}
                        </span>
                        <h4 className="font-sora font-semibold text-sm text-[#0B1D3A]">{course.title}</h4>
                        <p className="text-xs text-[#5B6A88]">{course.instructor} • {course.schedule}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-sora font-bold px-3 py-1 rounded-full bg-white border border-[#D8DFEA] text-[#0B1D3A]">
                          Grade: <span className="text-[#2E9B58]">{course.grade}</span>
                        </span>
                        <span className="text-xs font-mono font-bold text-[#0B1D3A]">{course.progress}%</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#ECF0F6] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%`, backgroundColor: course.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Tasks & AI Launcher (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-sora font-bold text-base text-[#0B1D3A] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#CC9A2E]" /> Upcoming Assignments
              </h3>

              <div className="space-y-3">
                {localAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-3.5 rounded-2xl bg-[#F6F8FB] border border-[#D8DFEA] space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-[#2F6FE0] font-semibold">{assignment.courseTitle}</span>
                        <h5 className="font-medium text-xs text-[#0B1D3A] leading-snug">{assignment.title}</h5>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        assignment.status === 'submitted'
                          ? 'bg-[#2E9B58]/10 text-[#2E9B58]'
                          : 'bg-[#CC9A2E]/10 text-[#CC9A2E]'
                      }`}>
                        {assignment.status === 'submitted' ? 'Submitted' : 'Pending'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#5B6A88] pt-1">
                      <span>Due: {assignment.dueDate}</span>
                      {assignment.status === 'pending' && (
                        <button
                          onClick={() => markAssignmentDone(assignment.id)}
                          className="text-[#2E9B58] hover:underline font-semibold text-[11px] cursor-pointer"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick AI Tutor Widget */}
            <div className="bg-gradient-to-br from-[#132C54] to-[#0B1D3A] rounded-3xl p-6 text-white space-y-4 shadow-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#CC9A2E]" />
                <h4 className="font-sora font-bold text-sm">Need Homework Help?</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ask our Gemini-powered AI Tutor to explain complex topics or generate practice problems.
              </p>
              <button
                onClick={() => setActiveTab('ai-tutor')}
                className="w-full bg-[#2F6FE0] hover:bg-blue-600 text-white font-sora text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                Launch AI Study Tutor <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: JSS MATH */}
      {activeTab === 'jss-math' && (
        <JSSMathExplorer />
      )}

      {/* TAB CONTENT: WEEKLY STUDY SCHEDULER */}
      {activeTab === 'study-scheduler' && (
        <WeeklyStudyScheduler student={student} />
      )}

      {/* TAB CONTENT: COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white border border-[#D8DFEA] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between border-b border-[#ECF0F6] pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#2F6FE0]">{course.code}</span>
                    <h3 className="font-sora font-bold text-lg text-[#0B1D3A] mt-1">{course.title}</h3>
                    <p className="text-xs text-[#5B6A88]">Instructor: {course.instructor}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-sora font-extrabold text-[#2E9B58]">{course.grade}</span>
                    <p className="text-[10px] text-[#5B6A88]">Current Grade</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-[#5B6A88]">
                  <div className="bg-[#F6F8FB] p-3 rounded-xl border border-[#D8DFEA]">
                    <span className="block text-[10px] uppercase font-mono text-[#7A8AA8]">Modules</span>
                    <span className="font-bold text-[#0B1D3A]">{course.completedModules} / {course.totalModules} Completed</span>
                  </div>
                  <div className="bg-[#F6F8FB] p-3 rounded-xl border border-[#D8DFEA]">
                    <span className="block text-[10px] uppercase font-mono text-[#7A8AA8]">Schedule</span>
                    <span className="font-bold text-[#0B1D3A]">{course.schedule}</span>
                  </div>
                </div>

                <div className="bg-[#ECF0F6]/50 p-3 rounded-xl border border-[#D8DFEA] flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[10px] font-mono text-[#7A8AA8]">UPCOMING TASK</p>
                    <p className="font-medium text-[#0B1D3A]">{course.nextAssignment}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#CC9A2E]">{course.nextDueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PRACTICE QUIZ */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto bg-white border border-[#D8DFEA] rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#ECF0F6] pb-4">
            <div>
              <span className="text-xs font-mono text-[#2F6FE0] uppercase font-bold">Interactive Learning Assessment</span>
              <h3 className="font-sora font-bold text-xl text-[#0B1D3A]">Subject Knowledge Check</h3>
            </div>
            <div className="bg-[#F6F8FB] border border-[#D8DFEA] px-3 py-1 rounded-full text-xs font-mono text-[#0B1D3A]">
              Question {quizIndex + 1} of {quizQuestions.length}
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-sora font-semibold text-base text-[#0B1D3A] leading-relaxed">
              {quizQuestions[quizIndex].question}
            </p>

            <div className="space-y-2.5">
              {quizQuestions[quizIndex].options.map((opt, idx) => {
                let btnStyle = 'bg-[#F6F8FB] border-[#D8DFEA] text-[#0B1D3A] hover:bg-[#ECF0F6]';
                if (selectedOption === idx) {
                  btnStyle = 'bg-[#2F6FE0]/10 border-[#2F6FE0] text-[#2F6FE0] font-semibold';
                }
                if (quizSubmitted) {
                  if (idx === quizQuestions[quizIndex].correctAnswer) {
                    btnStyle = 'bg-[#2E9B58]/15 border-[#2E9B58] text-[#2E9B58] font-bold';
                  } else if (selectedOption === idx) {
                    btnStyle = 'bg-red-50 border-red-300 text-red-600';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(idx)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {quizSubmitted && idx === quizQuestions[quizIndex].correctAnswer && (
                      <CheckCircle2 className="w-4 h-4 text-[#2E9B58]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation Box with Gemini AI Diagnostic */}
          {quizSubmitted && (
            <div className="space-y-3">
              {/* Dynamic AI Error Analysis / Reinforcement Card */}
              <div
                className={`rounded-2xl p-5 border text-xs sm:text-sm space-y-3 transition-all ${
                  selectedOption === quizQuestions[quizIndex].correctAnswer
                    ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-sm'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs">
                    <Sparkles
                      className={`w-4 h-4 ${
                        selectedOption === quizQuestions[quizIndex].correctAnswer
                          ? 'text-emerald-600'
                          : 'text-amber-600'
                      }`}
                    />
                    <span>
                      {selectedOption === quizQuestions[quizIndex].correctAnswer
                        ? 'Gemini AI Concept Reinforcement'
                        : 'Gemini AI Instant Error Diagnostic'}
                    </span>
                  </div>
                  {loadingAiExplanation && (
                    <span className="flex items-center gap-1.5 text-xs text-amber-700 font-mono">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing with Gemini...
                    </span>
                  )}
                </div>

                {loadingAiExplanation ? (
                  <div className="py-2 text-xs text-slate-600 flex items-center gap-2 bg-white/80 p-3 rounded-xl border border-amber-200/50">
                    <RefreshCw className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                    <span>Gemini AI is examining your choice, identifying any misconceptions, and generating step-by-step guidance...</span>
                  </div>
                ) : aiQuizExplanation ? (
                  <div className="leading-relaxed text-xs sm:text-sm font-medium text-slate-800 bg-white/90 p-4 rounded-xl border border-amber-200/80 whitespace-pre-wrap shadow-2xs">
                    {aiQuizExplanation}
                  </div>
                ) : null}

                <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-[11px]">
                  <span className="text-slate-500 font-mono font-medium">
                    {selectedOption === quizQuestions[quizIndex].correctAnswer
                      ? '✅ Correct Choice'
                      : '❌ Misconception Analysis'}
                  </span>
                  <button
                    onClick={() => fetchAiExplanationForQuiz(quizIndex, selectedOption!)}
                    disabled={loadingAiExplanation || selectedOption === null}
                    className="inline-flex items-center gap-1 font-bold text-amber-900 hover:text-amber-950 bg-white border border-amber-300 px-2.5 py-1 rounded-lg transition cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Re-evaluate with Gemini
                  </button>
                </div>
              </div>

              {/* Standard Reference Explanation */}
              <div className="bg-[#2F6FE0]/5 border border-[#2F6FE0]/20 rounded-2xl p-4 text-xs text-[#0B1D3A] space-y-1">
                <p className="font-bold text-[#2F6FE0] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" /> Curriculum Reference Explanation:
                </p>
                <p className="leading-relaxed text-[#4C5A75]">{quizQuestions[quizIndex].explanation}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#ECF0F6]">
            <span className="text-xs text-[#5B6A88]">Score: {quizScore} / {quizQuestions.length}</span>
            {!quizSubmitted ? (
              <button
                onClick={submitQuizQuestion}
                disabled={selectedOption === null}
                className="bg-[#2E9B58] hover:bg-green-700 disabled:opacity-40 text-white font-sora text-xs font-semibold px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Submit Answer
              </button>
            ) : quizIndex < quizQuestions.length - 1 ? (
              <button
                onClick={nextQuizQuestion}
                className="bg-[#2F6FE0] hover:bg-blue-600 text-white font-sora text-xs font-semibold px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Next Question
              </button>
            ) : (
              <div className="text-xs font-bold text-[#2E9B58] bg-[#2E9B58]/10 px-4 py-2 rounded-xl">
                Quiz Complete! Total Score: {quizScore}/{quizQuestions.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: AI TUTOR */}
      {activeTab === 'ai-tutor' && (
        <div className="max-w-4xl mx-auto bg-white border border-[#D8DFEA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#ECF0F6] pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#CC9A2E]" />
                <h3 className="font-sora font-bold text-xl text-[#0B1D3A]">Gemini AI Study Companion</h3>
              </div>
              <p className="text-xs text-[#5B6A88]">Interactive 1-on-1 step-by-step tutoring and problem solving.</p>
            </div>

            {/* Subject Dropdown */}
            <div className="flex items-center gap-2 bg-[#F6F8FB] border border-[#D8DFEA] px-3 py-1.5 rounded-xl text-xs font-semibold text-[#0B1D3A]">
              <span>Subject:</span>
              <select
                value={tutorSubject}
                onChange={(e) => setTutorSubject(e.target.value)}
                className="bg-transparent font-medium text-[#2F6FE0] focus:outline-none cursor-pointer"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Calculus">AP Calculus BC</option>
                <option value="Physics">Physics II</option>
                <option value="Literature">World Literature</option>
              </select>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="bg-[#F6F8FB] border border-[#D8DFEA] rounded-2xl p-4 sm:p-6 h-[380px] overflow-y-auto space-y-4">
            {tutorMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#2F6FE0] text-white rounded-br-none'
                      : 'bg-white border border-[#D8DFEA] text-[#0B1D3A] shadow-sm rounded-bl-none whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-[#7A8AA8] mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {loadingTutor && (
              <div className="flex items-center gap-2 text-xs text-[#2F6FE0] bg-white border border-[#D8DFEA] p-3 rounded-2xl w-fit">
                <RefreshCw className="w-4 h-4 animate-spin" /> AI Tutor is writing a response...
              </div>
            )}
          </div>

          {/* Query Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tutorQuery}
              onChange={(e) => setTutorQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendTutorMessage()}
              placeholder={`Ask a question about ${tutorSubject}...`}
              className="flex-1 bg-[#F6F8FB] border border-[#D8DFEA] rounded-xl px-4 py-3 text-xs text-[#0B1D3A] focus:outline-none focus:border-[#2F6FE0]"
            />
            <button
              onClick={handleSendTutorMessage}
              disabled={!tutorQuery.trim() || loadingTutor}
              className="bg-[#2F6FE0] hover:bg-blue-600 disabled:opacity-40 text-white px-5 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-sm"
            >
              <Send className="w-4 h-4" /> Ask
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
