import React, { useState } from 'react';
import { 
  HelpCircle, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  BookOpen, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Mail, 
  Phone, 
  User, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Bot,
  RefreshCw
} from 'lucide-react';
import { UserRole } from '../types';
import { generateWithAI } from '../services/api';
import { reportPublicActivity } from '../services/emailAndActivityService';

interface SupportTicket {
  id: string;
  subject: string;
  category: 'CBT_EXAM' | 'ACCOUNT_PIN' | 'ACADEMIC_ADVISING' | 'TECHNICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
  description: string;
  responsePreview?: string;
}

interface SupportHelpDeskHubProps {
  onNavigateRole: (role: UserRole) => void;
}

const FAQS = [
  {
    q: "How do I recover my 4-digit student PIN or Registration Number?",
    a: "You can retrieve your PIN from your Registration Audit Ledger or request a PIN reset with your recovery phrase via the Student Portal. School Administrators can also issue an official Verification Letter."
  },
  {
    q: "How does the End-to-End Encrypted (E2EE) Chat work?",
    a: "Every subject channel generates an AES-GCM-256 session key pair. Messages sent between students and verified educators are sealed with a cryptographic fingerprint before being delivered."
  },
  {
    q: "How is my CGPA calculated on iLearnit-365?",
    a: "iLearnit-365 supports both the 5.0 Nigerian/British university scale (A=5, B=4, C=3, D=2, E=1, F=0) and the 4.0 standard scale. Quality points are computed dynamically per credit unit."
  },
  {
    q: "What is the 3-Factor Authentication (3FA) Clearance Protocol?",
    a: "All administrative backend tabs require three verification layers: (1) Institutional Master Passkey, (2) Live 6-digit Time-Based One-Time Passcode (TOTP), and (3) FIDO2 Hardware Key / Biometric Attestation."
  }
];

export const SupportHelpDeskHub: React.FC<SupportHelpDeskHubProps> = ({ onNavigateRole }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [searchFaq, setSearchFaq] = useState('');
  
  // Ticket Form State
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'CBT_EXAM' | 'ACCOUNT_PIN' | 'ACADEMIC_ADVISING' | 'TECHNICAL'>('ACADEMIC_ADVISING');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // AI Support Assistant State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Sample User Tickets
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TCK-2026-8912',
      subject: 'JSS3 CBT Mathematics Mock Token Verification',
      category: 'CBT_EXAM',
      status: 'RESOLVED',
      priority: 'MEDIUM',
      createdAt: '2026-08-15 10:30',
      description: 'Requesting clarification on time allocation for Mathematics Section B.',
      responsePreview: 'Advisor confirmed standard 45-minute timed countdown with autosave.'
    },
    {
      id: 'TCK-2026-9041',
      subject: 'Official Verification Transcript Download Request',
      category: 'ACADEMIC_ADVISING',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      createdAt: '2026-08-18 14:15',
      description: 'Need digital signed transcript for secondary scholarship application.',
      responsePreview: 'Registrar office is currently generating the verified cryptographic transcript.'
    }
  ]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDescription) return;

    const newTicket: SupportTicket = {
      id: `TCK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketSubject,
      category: ticketCategory,
      status: 'OPEN',
      priority: 'HIGH',
      createdAt: new Date().toLocaleString(),
      description: ticketDescription,
    };

    setTickets([newTicket, ...tickets]);
    setTicketSuccess(true);

    void reportPublicActivity({
      activityType: 'SUPPORT_TICKET_SUBMITTED',
      actorRole: 'visitor',
      actorName: ticketName.trim() || 'Public User',
      actorEmail: ticketEmail.trim() || undefined,
      actorId: newTicket.id,
      targetResource: `Support Ticket (${ticketCategory})`,
      details: `${ticketSubject}: ${ticketDescription.slice(0, 140)}`,
    });

    setTicketSubject('');
    setTicketDescription('');

    setTimeout(() => setTicketSuccess(false), 5000);
  };

  const handleAskAITutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setIsAiLoading(true);
    setAiAnswer(null);

    try {
      const prompt = `You are the iLearnit-365 Smart Academic Advisor and Technical Support Specialist.
Provide a clear, helpful, encouraging, and accurate answer to the student's question:
"${aiQuestion}"
Keep the tone professional, structured, and informative.`;

      const response = await generateWithAI(prompt);
      setAiAnswer(response);
    } catch (err: any) {
      setAiAnswer(`Our AI Support Specialist is standing by. Based on your question "${aiQuestion}", our recommendation is to verify your student credentials in the Portal and contact your registered educator via the E2EE Chat channel.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredFaqs = FAQS.filter(f => 
    f.q.toLowerCase().includes(searchFaq.toLowerCase()) || 
    f.a.toLowerCase().includes(searchFaq.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn text-slate-900 dark:text-white">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0B1D3A] to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-3 py-1 rounded-full">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>24/7 Smart Academic Help & Support Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-sora">
            iLearnit-365 Academic Support & Assistance Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Get instant help with CBT exams, student registration, PIN recovery, academic curriculum guidance, and technical inquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateRole('study_hub')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-sora font-extrabold px-4 py-2.5 rounded-xl shadow-lg transition cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open E2EE Educator Chat</span>
          </button>
        </div>
      </div>

      {/* Instant AI Academic Advisor Box */}
      <div className="bg-white dark:bg-slate-900 border-2 border-blue-500/30 dark:border-blue-500/20 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sora font-bold text-base text-slate-900 dark:text-white">
                Instant Smart AI Academic Advisor
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ask any question regarding curriculum topics, formulas, or platform navigation.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleAskAITutor} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            placeholder="e.g. How do I solve quadratic equations using the formula method?"
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-cyan-400 rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none font-medium"
          />
          <button
            type="submit"
            disabled={isAiLoading || !aiQuestion.trim()}
            className="bg-[#0B1D3A] hover:bg-[#132C54] dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-sora font-bold px-6 py-3 rounded-2xl transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow"
          >
            {isAiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-cyan-300" />}
            <span>{isAiLoading ? 'Analyzing...' : 'Ask AI Advisor'}</span>
          </button>
        </form>

        {aiAnswer && (
          <div className="bg-slate-50 dark:bg-slate-950 border border-blue-500/30 rounded-2xl p-5 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line animate-fadeIn">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-cyan-400 font-mono font-bold uppercase text-[11px] mb-2">
              <Sparkles className="w-3.5 h-3.5" /> AI Advisor Guidance:
            </div>
            {aiAnswer}
          </div>
        )}
      </div>

      {/* 2-Column: Ticket Submission & Existing Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Support Ticket Submission Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="space-y-1">
            <h3 className="font-sora font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600" />
              <span>Submit an Academic Support Ticket</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Our academic registrars and support engineers respond within 2-4 hours.
            </p>
          </div>

          {ticketSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs p-4 rounded-2xl flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Support ticket successfully submitted! Reference ID added to tracker below.</span>
            </div>
          )}

          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-600 dark:text-slate-400 mb-1 font-bold">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  placeholder="e.g. David Adeleke"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-600 dark:text-slate-400 mb-1 font-bold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={ticketEmail}
                  onChange={(e) => setTicketEmail(e.target.value)}
                  placeholder="learner@ilearnit365.edu"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-600 dark:text-slate-400 mb-1 font-bold">
                Inquiry Category
              </label>
              <select
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white font-medium"
              >
                <option value="ACADEMIC_ADVISING">Academic Advising & Subject Help</option>
                <option value="CBT_EXAM">CBT Examination & Mock Tests</option>
                <option value="ACCOUNT_PIN">Account Security & PIN Recovery</option>
                <option value="TECHNICAL">Technical Portal / Platform Issues</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-600 dark:text-slate-400 mb-1 font-bold">
                Ticket Subject
              </label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="Brief summary of your inquiry"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-600 dark:text-slate-400 mb-1 font-bold">
                Detailed Description
              </label>
              <textarea
                required
                rows={3}
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="Please describe your question or issue in detail..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-600 rounded-xl p-3.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-sora font-bold text-xs py-3 rounded-xl transition shadow cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Support Request</span>
            </button>
          </form>
        </div>

        {/* Live Support Ticket Tracker */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-sora font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Active Support Tickets & Status Ledger</span>
            </h3>

            <div className="space-y-3">
              {tickets.map((t) => (
                <div 
                  key={t.id}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-600 dark:text-cyan-400">{t.id}</span>
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === 'RESOLVED'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : t.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <div className="font-sora font-bold text-slate-900 dark:text-white">{t.subject}</div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">{t.description}</p>
                  
                  {t.responsePreview && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Advisor Update: </span>
                      {t.responsePreview}
                    </div>
                  )}

                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1">
                    <span>Category: {t.category}</span>
                    <span>{t.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Direct Hotline: <strong>+234 (0) 800-365-LEARN</strong></span>
            <span>support@ilearnit365.edu.ng</span>
          </div>
        </div>

      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-sora font-bold text-base text-slate-900 dark:text-white">
              Frequently Asked Questions (Knowledge Base)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Common solutions and guidance for students, educators, and school administrators.
            </p>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFaq}
              onChange={(e) => setSearchFaq(e.target.value)}
              placeholder="Search knowledge base..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-600 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <div 
              key={faq.q}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full p-4.5 text-left flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-900 transition cursor-pointer"
              >
                <span className="font-sora font-bold text-xs text-slate-900 dark:text-white">
                  {faq.q}
                </span>
                {activeFaq === index ? <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>

              {activeFaq === index && (
                <div className="p-4.5 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800 animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
