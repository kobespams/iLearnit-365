import React, { useState } from 'react';
import { StudentDetail, TeacherNote } from '../types';
import { generateContent } from '../services/api';
import { Award, Users, MessageSquare, Sparkles, Check, Send, HeartHandshake, CheckCircle2, ChevronRight, RefreshCw, Calendar, Calculator, BarChart3 } from 'lucide-react';
import { JSSMathExplorer } from './JSSMathExplorer';

interface ParentPortalProps {
  child: StudentDetail;
  notes: TeacherNote[];
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ child, notes }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'jss-math' | 'notes' | 'ai-advisor'>('overview');
  
  // Note Reply State
  const [localNotes, setLocalNotes] = useState<TeacherNote[]>(notes);
  const [replyText, setReplyText] = useState('');
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');

  // AI Parent Advisor State
  const [parentQuery, setParentQuery] = useState('');
  const [advisorResponses, setAdvisorResponses] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Welcome, Parent of ${child.name}! I am your AI Family Education Advisor. Ask me anything about ${child.name}'s academic progress, college prep benchmarks, or study-life balance tips.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [loadingAdvisor, setLoadingAdvisor] = useState(false);

  const handleSendAdvisorMessage = async () => {
    if (!parentQuery.trim() || loadingAdvisor) return;

    const userText = parentQuery.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setParentQuery('');

    setAdvisorResponses((prev) => [...prev, { sender: 'user', text: userText, time: timeStr }]);
    setLoadingAdvisor(true);

    const prompt = `Child Context: ${child.name}, Junior (Grade 11), GPA 3.92, Top 5% ranking.\nParent Query: ${userText}`;
    const result = await generateContent({
      prompt,
      systemInstruction: 'You are an empathetic, expert High School Guidance Counselor and Educational Specialist advising parents.',
      temperature: 0.5,
    });

    setAdvisorResponses((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: result.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setLoadingAdvisor(false);
  };

  const handleSendTeacherReply = () => {
    if (!replyText.trim() || !activeNoteId) return;

    setLocalNotes((prev) =>
      prev.map((n) =>
        n.id === activeNoteId
          ? { ...n, message: `${n.message}\n\n[Parent Reply]: ${replyText}` }
          : n
      )
    );
    setReplyText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Parent Header */}
      <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#CC9A2E]/10 text-[#CC9A2E] flex items-center justify-center font-sora font-extrabold text-xl border border-[#CC9A2E]/20">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-sora font-bold text-2xl text-[#0B1D3A]">
                {child.parentName || 'Parent Account'}
              </h2>
              <span className="bg-[#CC9A2E]/10 text-[#CC9A2E] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#CC9A2E]/20">
                PIN Verified
              </span>
            </div>
            <p className="text-xs text-[#5B6A88] mt-1 flex flex-wrap items-center gap-2">
              <Users className="w-4 h-4 text-[#CC9A2E]" /> Linked Child: <span className="font-semibold text-[#0B1D3A]">{child.name}</span> ({child.gradeLevel})
              <span className="bg-blue-50 text-blue-800 text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-blue-200">
                PIN: {child.pin || 'Protected'}
              </span>
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#ECF0F6] p-1.5 rounded-2xl border border-[#D8DFEA]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#CC9A2E] text-white shadow-sm'
                : 'text-[#4C5A75] hover:text-[#0B1D3A]'
            }`}
          >
            Academic Overview
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
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-[#CC9A2E] text-white shadow-sm'
                : 'text-[#4C5A75] hover:text-[#0B1D3A]'
            }`}
          >
            Teacher Messages ({localNotes.length})
          </button>
          <button
            onClick={() => setActiveTab('ai-advisor')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ai-advisor'
                ? 'bg-[#132C54] text-white shadow-sm'
                : 'text-[#4C5A75] hover:text-[#0B1D3A]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#CC9A2E]" /> AI Parent Advisor
          </button>
        </div>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Subject Grade Matrix (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#ECF0F6] pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[#CC9A2E]">Spring 2026 Progress Report</span>
                  <h3 className="font-sora font-bold text-xl text-[#0B1D3A]">{child.name}'s Gradebook</h3>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-sora font-extrabold text-[#2E9B58]">{child.gpa}</span>
                  <p className="text-[10px] text-[#7A8AA8]">Unweighted GPA</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {child.subjects.map((sub, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#F6F8FB] border border-[#D8DFEA] flex items-center justify-between">
                    <div>
                      <h4 className="font-sora font-semibold text-sm text-[#0B1D3A]">{sub.name}</h4>
                      <p className="text-xs text-[#5B6A88]">Assessment Score: {sub.score}%</p>
                    </div>
                    <span className="text-xl font-sora font-extrabold text-[#2E9B58] bg-white px-3 py-1 rounded-xl border border-[#D8DFEA]">
                      {sub.letter}
                    </span>
                  </div>
                ))}
              </div>

              {/* Term-by-Term Performance Summary */}
              {child.termPerformance && (
                <div className="pt-4 border-t border-[#ECF0F6]">
                  <h4 className="font-sora font-bold text-sm text-[#0B1D3A] mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" /> Term-by-Term Academy Performance Trend
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {child.termPerformance.map((term, i) => (
                      <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-500">{term.term}</span>
                        <div className="text-lg font-sora font-extrabold text-navy">{term.gpa} GPA</div>
                        <div className="text-[10px] text-emerald-700 font-bold">{term.position}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Score: {term.totalScore}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conduct & Remarks */}
              {child.conductRemarks && (
                <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs space-y-1">
                  <span className="font-bold text-amber-900 uppercase text-[10px] tracking-wider font-mono">
                    Official Principal & Counselor Conduct Note:
                  </span>
                  <p className="text-amber-950 font-medium leading-relaxed">{child.conductRemarks}</p>
                </div>
              )}
            </div>

            {/* Attendance & Streak Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2F6FE0]/10 text-[#2F6FE0] flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-[#5B6A88]">Attendance Record</span>
                  <p className="font-sora font-extrabold text-xl text-[#0B1D3A]">{child.attendance}</p>
                  <p className="text-[10px] text-[#2E9B58] font-semibold">1 Absences (Excused)</p>
                </div>
              </div>

              <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#CC9A2E]/10 text-[#CC9A2E] flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-[#5B6A88]">Learning Habit Streak</span>
                  <p className="font-sora font-extrabold text-xl text-[#0B1D3A]">{child.streakDays} Consecutive Days</p>
                  <p className="text-[10px] text-[#CC9A2E] font-semibold">Daily Homework Completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Teacher Communications (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#ECF0F6] pb-3">
                <h4 className="font-sora font-bold text-base text-[#0B1D3A] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#CC9A2E]" /> Teacher Notes
                </h4>
                <button
                  onClick={() => setActiveTab('notes')}
                  className="text-xs font-semibold text-[#CC9A2E] hover:underline"
                >
                  Reply
                </button>
              </div>

              <div className="space-y-3">
                {localNotes.map((note) => (
                  <div key={note.id} className="p-3.5 rounded-2xl bg-[#F6F8FB] border border-[#D8DFEA] space-y-1.5">
                    <p className="text-[10px] font-mono text-[#2E9B58] font-semibold">{note.author}</p>
                    <h5 className="font-semibold text-xs text-[#0B1D3A]">{note.subject}</h5>
                    <p className="text-[11px] text-[#5B6A88] line-clamp-2 leading-relaxed">{note.message}</p>
                    <span className="text-[10px] text-[#7A8AA8] block text-right">{note.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: JSS MATH */}
      {activeTab === 'jss-math' && (
        <JSSMathExplorer />
      )}

      {/* TAB CONTENT: TEACHER MESSAGES */}
      {activeTab === 'notes' && (
        <div className="max-w-4xl mx-auto bg-white border border-[#D8DFEA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-sora font-bold text-xl text-[#0B1D3A] border-b border-[#ECF0F6] pb-4">
            Direct Teacher Communications
          </h3>

          <div className="space-y-6">
            {localNotes.map((note) => (
              <div key={note.id} className="p-6 rounded-2xl bg-[#F6F8FB] border border-[#D8DFEA] space-y-3">
                <div className="flex justify-between items-start border-b border-[#D8DFEA] pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#2E9B58]">{note.author}</span>
                    <h4 className="font-sora font-bold text-base text-[#0B1D3A] mt-0.5">{note.subject}</h4>
                  </div>
                  <span className="text-xs text-[#7A8AA8] font-mono">{note.date}</span>
                </div>

                <p className="text-xs text-[#0B1D3A] leading-relaxed whitespace-pre-wrap">{note.message}</p>

                {/* Reply Section */}
                <div className="pt-3 border-t border-[#D8DFEA] space-y-2">
                  <label className="block text-[10px] font-mono text-[#7A8AA8] uppercase">Send Reply to Teacher</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message to the teacher..."
                      value={activeNoteId === note.id ? replyText : ''}
                      onChange={(e) => {
                        setActiveNoteId(note.id);
                        setReplyText(e.target.value);
                      }}
                      className="flex-1 bg-white border border-[#D8DFEA] rounded-xl px-3.5 py-2 text-xs text-[#0B1D3A]"
                    />
                    <button
                      onClick={handleSendTeacherReply}
                      className="bg-[#CC9A2E] hover:bg-amber-700 text-white font-sora text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: AI PARENT ADVISOR */}
      {activeTab === 'ai-advisor' && (
        <div className="max-w-4xl mx-auto bg-white border border-[#D8DFEA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-[#ECF0F6] pb-4">
            <Sparkles className="w-5 h-5 text-[#CC9A2E]" />
            <div>
              <h3 className="font-sora font-bold text-xl text-[#0B1D3A]">AI Family & Academic Counselor</h3>
              <p className="text-xs text-[#5B6A88]">Get personalized guidance on supporting your child's education.</p>
            </div>
          </div>

          {/* Chat Stream */}
          <div className="bg-[#F6F8FB] border border-[#D8DFEA] rounded-2xl p-4 sm:p-6 h-[380px] overflow-y-auto space-y-4">
            {advisorResponses.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#CC9A2E] text-white rounded-br-none'
                      : 'bg-white border border-[#D8DFEA] text-[#0B1D3A] shadow-sm rounded-bl-none whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-[#7A8AA8] mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {loadingAdvisor && (
              <div className="flex items-center gap-2 text-xs text-[#CC9A2E] bg-white border border-[#D8DFEA] p-3 rounded-2xl w-fit">
                <RefreshCw className="w-4 h-4 animate-spin" /> Counselor is writing advice...
              </div>
            )}
          </div>

          {/* Query Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={parentQuery}
              onChange={(e) => setParentQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendAdvisorMessage()}
              placeholder="Ask for advice on study habits, college prep, or course workload..."
              className="flex-1 bg-[#F6F8FB] border border-[#D8DFEA] rounded-xl px-4 py-3 text-xs text-[#0B1D3A] focus:outline-none focus:border-[#CC9A2E]"
            />
            <button
              onClick={handleSendAdvisorMessage}
              disabled={!parentQuery.trim() || loadingAdvisor}
              className="bg-[#CC9A2E] hover:bg-amber-700 disabled:opacity-40 text-white px-5 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-sm"
            >
              <Send className="w-4 h-4" /> Ask Counselor
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
