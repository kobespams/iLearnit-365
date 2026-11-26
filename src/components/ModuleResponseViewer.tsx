import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  Sparkles, CheckCircle2, FileText, Download, Printer, Copy, 
  Share2, ArrowRight, ArrowLeft, Volume2, VolumeX, Play, 
  Pause, Square, Search, Filter, ShieldCheck, Terminal, 
  Calculator, Award, HelpCircle, Layers, GraduationCap, 
  Users, Lock, Cloud, ExternalLink, RefreshCw, X, ChevronRight,
  Code2, Check, AlertCircle, Bookmark, Compass
} from 'lucide-react';
import { speakEducatorMessage, stopEducatorSpeech, isEducatorSpeaking } from '../services/educatorVoiceService';

export interface ModuleResponseItem {
  id: string;
  title: string;
  moduleCategory: 'Student Core' | 'STEM & Labs' | 'Academic Records';
  parentHubId: UserRole;
  parentHubName: string;
  badge: string;
  responseStatus: 'COMPLETED' | 'VERIFIED' | 'OPTIMAL' | 'SECURED';
  executionLatency: string;
  summary: string;
  detailedResponse: {
    keyInsights: string[];
    dataBreakdown: { label: string; value: string; status?: 'normal' | 'highlight' | 'success' }[];
    codeOrFormulaSnippet?: string;
    actionableAdvice: string;
    cryptographicSeal: string;
  };
  sampleQuery: string;
  voiceNarrationText: string;
}

export const MODULE_RESPONSES: ModuleResponseItem[] = [
  {
    id: 'student_assignment_eval',
    title: 'Assignment Evaluation & Rubric Feedback Module',
    moduleCategory: 'Student Core',
    parentHubId: 'student',
    parentHubName: 'Student Portal',
    badge: 'Formative AI Grading',
    responseStatus: 'VERIFIED',
    executionLatency: '142ms',
    summary: 'Automated evaluation of submitted assignments with step-by-step rubric analysis, structural critique, and formative improvement suggestions.',
    sampleQuery: 'Assignment #4: Quadratic Modeling in Physical Motion (Grade 9 Physics/Math)',
    voiceNarrationText: 'Good day everyone. I am going to be your guide for today\'s course. Stay tuned as we proceed. Your assignment submission demonstrates high conceptual mastery in quadratic modeling, achieving a score of 94 percent with full mathematical justification.',
    detailedResponse: {
      keyInsights: [
        'Kinematic parabola equation correctly formulated: h(t) = -4.9t² + 19.6t + 1.2',
        'Vertex coordinates (2.0s, 20.8m) matched theoretical maximum altitude perfectly.',
        'Graph sketch contains precise labeling of axis intervals and ground impact roots (t ≈ 4.06s).',
        'Recommendation: Include drag coefficient considerations for advanced university-level mechanics.'
      ],
      dataBreakdown: [
        { label: 'Rubric Score', value: '94 / 100 (Grade A*)', status: 'success' },
        { label: 'Conceptual Rigor', value: 'High (Level 4)', status: 'normal' },
        { label: 'Plagiarism / Originality', value: '99.4% Original', status: 'highlight' },
        { label: 'Educator Reviewer', value: 'Dr. Sarah Jenkins (Senior Math Lead)', status: 'normal' },
      ],
      codeOrFormulaSnippet: `// Quadratic trajectory model validation\nconst h = (t) => -4.9 * Math.pow(t, 2) + (19.6 * t) + 1.2;\nconst t_vertex = 19.6 / (2 * 4.9); // 2.0 seconds\nconst h_max = h(t_vertex); // 20.8 meters (Verified)`,
      actionableAdvice: 'Proceed to Lesson 5: Multi-Variable Polynomial Optimization in the Student Portal.',
      cryptographicSeal: 'SHA256: 8f4e2b9c7104d5a3...EVAL-VERIFIED'
    }
  },
  {
    id: 'jss_math_solver',
    title: 'JSS Mathematics Derivation & Equation Solver Module',
    moduleCategory: 'STEM & Labs',
    parentHubId: 'jss_math',
    parentHubName: 'JSS Math Explorer',
    badge: 'Step-by-Step Solver',
    responseStatus: 'OPTIMAL',
    executionLatency: '88ms',
    summary: 'High-precision algebraic derivation engine providing line-by-line justification, graphical roots, and WAEC/BECE marking scheme alignment.',
    sampleQuery: 'Solve 2x² - 7x + 3 = 0 using Quadratic Formula and Factorization',
    voiceNarrationText: 'Good day everyone. I am going to be your guide for today\'s course. Stay tuned as we proceed. To solve 2x² - 7x + 3 = 0, we identify a = 2, b = -7, and c = 3. The discriminant is 25, yielding two rational roots: x = 3 and x = 0.5.',
    detailedResponse: {
      keyInsights: [
        'Discriminant Calculation: Δ = (-7)² - 4(2)(3) = 49 - 24 = 25 > 0 (Two distinct real roots).',
        'Factorization Method: 2x² - 6x - x + 3 = 2x(x - 3) - 1(x - 3) = (2x - 1)(x - 3) = 0.',
        'Root 1: x = 3 | Root 2: x = 1/2 (0.5).',
        'BECE Exam Scoring: 2 marks for method substitution, 2 marks for final root simplification.'
      ],
      dataBreakdown: [
        { label: 'Primary Roots', value: 'x₁ = 3, x₂ = 0.5', status: 'success' },
        { label: 'Discriminant (Δ)', value: '25 (Perfect Square)', status: 'highlight' },
        { label: 'Parabola Axis', value: 'x = 1.75 (Minimum)', status: 'normal' },
        { label: 'Syllabus Standard', value: 'NERDC JSS3 / WAEC Basic 9', status: 'normal' },
      ],
      codeOrFormulaSnippet: `x = (-(-7) ± √(25)) / (2 * 2)\nx = (7 ± 5) / 4\nx₁ = 12/4 = 3\nx₂ = 2/4 = 0.5`,
      actionableAdvice: 'Explore interactive graphing in the JSS Math Explorer to visualize the parabola vertex.',
      cryptographicSeal: 'SHA256: 3a91bf028dc...MATH-SOLVE-OK'
    }
  },
  {
    id: 'cyber_packet_inspector',
    title: 'Cybersecurity Zero-Trust Packet Inspector & Sandbox Lab',
    moduleCategory: 'STEM & Labs',
    parentHubId: 'cyber_security',
    parentHubName: 'Cybersecurity Explorer',
    badge: 'Zero-Trust Defense',
    responseStatus: 'SECURED',
    executionLatency: '210ms',
    summary: 'Deep packet inspection sandbox simulating encrypted TLS 1.3 handshakes, MITRE ATT&CK mitigation, and defensive firewall rule synthesis.',
    sampleQuery: 'Inspect TCP SYN Flood on Port 443 & Synthesize IPTables Rate Limit',
    voiceNarrationText: 'Good day everyone. I am going to be your guide for today\'s course. Stay tuned as we proceed. The packet inspection engine detected an anomalous TCP SYN burst of 14,000 packets per second. Mitigation filter rule IPTables hashlimit has been successfully armed.',
    detailedResponse: {
      keyInsights: [
        'Ingress Traffic Anomaly: 14,200 pkt/s targeting TLS ingress gateway from 18 spoofed subnet sources.',
        'Zero-Trust Heuristic: Protocol anomaly triggered SYN cookies and ephemeral token challenge.',
        'Mitigation Status: Automated IPTables rate-limiting rule deployed with zero drop on authenticated scholar sessions.',
        'Compliance Tag: Zero-Trust NIST SP 800-207 Architecture verified.'
      ],
      dataBreakdown: [
        { label: 'Threat Mitigation', value: 'SYN Flood Nullified', status: 'success' },
        { label: 'Traffic Scrubbing', value: '99.8% Efficiency', status: 'highlight' },
        { label: 'Legitimate Latency', value: '18ms (Unaffected)', status: 'normal' },
        { label: 'SOC Alert Level', value: 'Defcon 4 (Mitigated)', status: 'normal' },
      ],
      codeOrFormulaSnippet: `# Automated zero-trust rate-limiting filter\niptables -A INPUT -p tcp --syn --dport 443 -m hashlimit \\\n  --hashlimit-above 50/sec --hashlimit-burst 100 \\\n  --hashlimit-mode srcip --hashlimit-name SYN_FLOOD_GUARD -j DROP`,
      actionableAdvice: 'Run hands-on cryptographic defenses in the Cybersecurity Explorer Sandbox Lab.',
      cryptographicSeal: 'SHA256: 7d8a92e104f...SOC-PACKET-AUDIT'
    }
  },
  {
    id: 'cbt_exam_analytics',
    title: 'National CBT Examination Diagnostics & Speed-Accuracy Module',
    moduleCategory: 'Academic Records',
    parentHubId: 'cbt',
    parentHubName: 'CBT Exam Suite',
    badge: 'National Standard',
    responseStatus: 'COMPLETED',
    executionLatency: '95ms',
    summary: 'Real-time diagnostic report analyzing student speed, accuracy distribution, topic vulnerabilities, and national percentile projections.',
    sampleQuery: 'Analyze 50-Question CBT Mock: Mathematics, Physics, English, Chemistry',
    voiceNarrationText: 'Good day everyone. I am going to be your guide for today\'s course. Stay tuned as we proceed. Your simulated CBT performance placed you in the 96th percentile nationally, answering 46 of 50 questions correctly with an average time of 42 seconds per item.',
    detailedResponse: {
      keyInsights: [
        'Total Score: 92% (46 / 50 Correct) under strict 45-minute national proctoring rules.',
        'Speed vs Accuracy: Highest speed on English comprehension (28s/item, 100% accuracy).',
        'Focus Area: Trigonometric identities in Mathematics required 72s average time (Review suggested).',
        'National Percentile: Ranked top 4% across 14,000 participating simulation candidates.'
      ],
      dataBreakdown: [
        { label: 'Overall Score', value: '92% (46 / 50)', status: 'success' },
        { label: 'National Percentile', value: '96.2th Percentile', status: 'highlight' },
        { label: 'Avg Time / Question', value: '42.4 seconds', status: 'normal' },
        { label: 'Proctoring Integrity', value: '100% (No tab switches)', status: 'success' },
      ],
      codeOrFormulaSnippet: `// Speed-Accuracy Index (SAI) Calculation\nSAI = (CorrectAnswers / TotalQuestions) * (AllocatedTime / ActualTimeSpent)\nSAI = (46 / 50) * (2700s / 2120s) = 1.171 (Excellent Efficiency)`,
      actionableAdvice: 'Launch full-length timed mock exams in the CBT Exam Suite.',
      cryptographicSeal: 'SHA256: 5c2b9a781...CBT-DIAGNOSTIC-RECORD'
    }
  },
  {
    id: 'academic_transcript_module',
    title: 'Academic Results & Digital Transcript Verification Module',
    moduleCategory: 'Academic Records',
    parentHubId: 'results',
    parentHubName: 'Academic Results Hub',
    badge: 'Official Seal',
    responseStatus: 'VERIFIED',
    executionLatency: '110ms',
    summary: 'Cryptographically verified academic statement with term-by-term credit breakdowns, principal remarks, and digital QR seal.',
    sampleQuery: 'Generate Official Harmattan Term Transcript Slip for Alex Chen (ILN-2026-38291)',
    voiceNarrationText: 'Good day everyone. I am going to be your guide for today\'s course. Stay tuned as we proceed. The academic transcript for scholar Alex Chen has been generated and sealed with registrar verification, confirming a Term GPA of 4.88.',
    detailedResponse: {
      keyInsights: [
        'Student Identification: Alex Chen | Matric: ILN-2026-38291 | Grade: JSS 3 / SSS 1 Alpha.',
        'Academic Standing: First Class Distinction with a Cumulative GPA of 4.88 / 5.00.',
        'Subject Honors: 1st Position in Mathematics (98%), Computer Studies (95%), Physics (92%).',
        'Institutional Attestation: Verified by Office of the Academic Registrar, iLearnit-365.'
      ],
      dataBreakdown: [
        { label: 'Harmattan Term GPA', value: '4.88 / 5.00', status: 'success' },
        { label: 'Class Rank', value: '1st of 45 Students', status: 'highlight' },
        { label: 'Credits Earned', value: '24 Credit Units', status: 'normal' },
        { label: 'Registrar Seal', value: 'Cryptographically Signed', status: 'success' },
      ],
      codeOrFormulaSnippet: `TRANSCRIPT RECORD VERIFICATION\nID: ILN-2026-38291 | GPA: 4.88/5.00\nDIGITAL SIGNATURE: 0x8F92B...VERIFIED\nISSUED: Office of Academic Registries, iLearnit-365`,
      actionableAdvice: 'View and print full term transcripts in the Academic Results Hub.',
      cryptographicSeal: 'SHA256: 9e4f01ba32...OFFICIAL-TRANSCRIPT'
    }
  },
  {
    id: 'cgpa_projection_module',
    title: 'CGPA Multi-Semester Projection & Honors Simulator Module',
    moduleCategory: 'Academic Records',
    parentHubId: 'cgpa',
    parentHubName: 'CGPA & Honors Hub',
    badge: '5.0 / 4.0 Scale',
    responseStatus: 'OPTIMAL',
    executionLatency: '76ms',
    summary: 'Predictive GPA trajectory modeling tool computing target semester grades required to graduate with First Class / Distinction honors.',
    sampleQuery: 'Target: Graduate with First Class (CGPA >= 4.50) from Current 4.20 with 4 Semesters Remaining',
    voiceNarrationText: 'Good day everyone. I am going to be your guide for today\'s course. Stay tuned as we proceed. To raise your CGPA from 4.20 to a First Class standing of 4.50, you will require an average of 4.65 GPA across your remaining 4 semesters.',
    detailedResponse: {
      keyInsights: [
        'Current Standing: 4.20 CGPA across 48 completed credit units (Upper Second Class).',
        'Target Goal: First Class Honors (Minimum 4.50 CGPA at 120 total credits).',
        'Required Average: 4.65 Semester GPA across remaining 72 credit units.',
        'Grade Distribution Plan: Minimum 14 "A" grades (5.0) and maximum 3 "B" grades (4.0).'
      ],
      dataBreakdown: [
        { label: 'Current CGPA', value: '4.20 / 5.00', status: 'normal' },
        { label: 'Target Minimum', value: '4.50 (First Class)', status: 'highlight' },
        { label: 'Required GPA / Term', value: '4.65 GPA', status: 'success' },
        { label: 'Feasibility Index', value: 'High (84% Probability)', status: 'normal' },
      ],
      codeOrFormulaSnippet: `// Target CGPA Formula\nTargetCGPA = (CurrentPoints + RequiredFuturePoints) / TotalCredits\n4.50 = ((4.20 * 48) + (ReqGPA * 72)) / 120\nReqGPA = (540 - 201.6) / 72 = 4.70 GPA`,
      actionableAdvice: 'Use the interactive semester simulator in the CGPA & Honors Hub.',
      cryptographicSeal: 'SHA256: 41b8e90...CGPA-PROJECTION-VERIFIED'
    }
  },
  {
    id: 'support_diagnostic_module',
    title: '24/7 Support Desk AI Diagnostic & SLA Response Module',
    moduleCategory: 'Academic Records',
    parentHubId: 'support',
    parentHubName: 'Support Help Desk',
    badge: 'SLA Guaranteed',
    responseStatus: 'COMPLETED',
    executionLatency: '180ms',
    summary: 'Automated diagnostic resolver for institutional queries, CBT login resets, transcript requests, and high-priority escalation routing.',
    sampleQuery: 'Issue: Reset 6-Digit Examination PIN for CBT Terminal Access',
    voiceNarrationText: 'Good day everyone. I am going to be your guide for today\'s course. Stay tuned as we proceed. Your support inquiry regarding examination PIN recovery has been diagnosed. An emergency credential verification token has been routed to your registered guardian contact.',
    detailedResponse: {
      keyInsights: [
        'Categorization: CBT_EXAM / CREDENTIAL_RECOVERY (Priority: HIGH).',
        'Diagnostic Resolution: Automated account status check verified active registration (No outstanding fees).',
        'Action Dispatched: 6-Digit PIN recovery token generated and sent to verified guardian phone.',
        'Estimated Resolution Time: Instantaneous automated resolution (0s wait).'
      ],
      dataBreakdown: [
        { label: 'Ticket ID', value: 'SUP-2026-9481', status: 'normal' },
        { label: 'Diagnostic SLA', value: '1.2s (Sub-Second)', status: 'success' },
        { label: 'Resolution Category', value: 'Automated Credential Fix', status: 'highlight' },
        { label: 'Assigned Agent', value: 'iLearnit AI Diagnostic Bot', status: 'normal' },
      ],
      codeOrFormulaSnippet: `TICKET DISPATCH RECORD\nID: SUP-2026-9481 | STATUS: RESOLVED_AUTO\nACTION: SECURE_PIN_RESET_DISPATCHED\nREASON: IDENTITY_VERIFIED_FIDO2`,
      actionableAdvice: 'Submit support inquiries or chat with live advisors in the Support Help Desk.',
      cryptographicSeal: 'SHA256: 1d9c4e...SUPPORT-DIAGNOSTIC-OK'
    }
  },
  {
    id: 'curriculum_monograph_module',
    title: 'Curriculum Monograph & Textbook Reader Module',
    moduleCategory: 'Student Core',
    parentHubId: 'study_hub',
    parentHubName: 'Study Hub & E2EE',
    badge: 'Curriculum Monograph',
    responseStatus: 'OPTIMAL',
    executionLatency: '65ms',
    summary: 'Full-text educational document reader with embedded formula sheets, interactive glossaries, and voice-assisted textbook narration.',
    sampleQuery: 'Load BECE & JSS Mathematics Mastery Handbook: Linear & Quadratic Systems',
    voiceNarrationText: 'Good day everyone. I am going to be your guide for today\'s course. Stay tuned as we proceed. Loading chapter 4 on Quadratic Equations and Parabolic Trajectories from the curriculum monograph collection.',
    detailedResponse: {
      keyInsights: [
        'Document Loaded: BECE & JSS Mathematics Mastery Handbook (8 Chapters, 42 Formulas).',
        'Reading Ergonomics: High-contrast Sepia and Dark reading themes with font scaling active.',
        'Formative Checkpoints: 5 embedded checkpoint quizzes with automated explanation steps.',
        'Audio Synchronization: Educator Voice read-aloud armed with speech rate control.'
      ],
      dataBreakdown: [
        { label: 'Document Chapters', value: '8 Complete Chapters', status: 'normal' },
        { label: 'Formula Index', value: '42 Math Equations', status: 'highlight' },
        { label: 'Audio Read Aloud', value: 'Available in Voice', status: 'success' },
        { label: 'Curriculum Level', value: 'JSS 1 - SSS 3 (NERDC)', status: 'normal' },
      ],
      codeOrFormulaSnippet: `DOCUMENT INDEX: MATH-DOC-001\nTitle: Linear & Quadratic Mastery Handbook\nChapters: 8 | Pages: 48 | Checkpoints: 5\nStatus: FULL_TEXT_AVAILABLE`,
      actionableAdvice: 'Open full textbooks and monographs in the Curriculum Document Reader inside Study Hub.',
      cryptographicSeal: 'SHA256: 3c91a0...DOC-MONOGRAPH-VERIFIED'
    }
  }
];

interface ModuleResponseViewerProps {
  initialModuleId?: string;
  onNavigateToHub: (role: UserRole) => void;
  onClose?: () => void;
}

export const ModuleResponseViewer: React.FC<ModuleResponseViewerProps> = ({
  initialModuleId,
  onNavigateToHub,
  onClose,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(initialModuleId || MODULE_RESPONSES[0].id);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [customQueryInput, setCustomQueryInput] = useState<string>('');
  const [customResponseGenerated, setCustomResponseGenerated] = useState<boolean>(false);

  const activeModule = MODULE_RESPONSES.find(m => m.id === selectedModuleId) || MODULE_RESPONSES[0];

  const handleCopySummary = () => {
    const text = `=== iLearnit-365 Module Exploration Response ===
Module: ${activeModule.title} (${activeModule.badge})
Category: ${activeModule.moduleCategory} | Parent Hub: ${activeModule.parentHubName}
Status: ${activeModule.responseStatus} | Latency: ${activeModule.executionLatency}
Summary: ${activeModule.summary}

Key Insights:
${activeModule.detailedResponse.keyInsights.map(k => `• ${k}`).join('\n')}

Actionable Advice: ${activeModule.detailedResponse.actionableAdvice}
Seal: ${activeModule.detailedResponse.cryptographicSeal}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePlayVoice = () => {
    if (speaking) {
      stopEducatorSpeech();
      setSpeaking(false);
    } else {
      speakEducatorMessage(
        activeModule.voiceNarrationText,
        'master_guide',
        () => setSpeaking(false),
        () => setSpeaking(false)
      );
      setSpeaking(true);
    }
  };

  const handleRunCustomQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQueryInput.trim()) return;
    setCustomResponseGenerated(true);
    setTimeout(() => setCustomResponseGenerated(false), 3000);
  };

  const filteredModules = MODULE_RESPONSES.filter(m => {
    const matchesCat = selectedCategory === 'all' || m.moduleCategory === selectedCategory;
    const matchesSearch = !searchFilter || 
      m.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
      m.summary.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.badge.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-slate-50 dark:bg-[#071120] text-slate-900 dark:text-slate-100 min-h-screen pb-16 font-sans">
      
      {/* Top Exploration Header */}
      <div className="bg-gradient-to-r from-[#0B1528] via-[#132C54] to-[#0B1528] text-white border-b border-indigo-500/30 p-6 sm:p-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> All Module Responses &amp; Diagnostic Engine
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                100% Verified
              </span>
            </div>
            <h1 className="font-sora font-extrabold text-2xl sm:text-3xl text-white">
              Platform Module Exploration &amp; Response Pages
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Inspect real-time execution outputs, diagnostic breakdowns, formulas, grading rubrics, and security telemetry for every platform module.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <X className="w-4 h-4" /> Close Explorer
              </button>
            )}
            <button
              onClick={() => onNavigateToHub(activeModule.parentHubId)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-sora font-bold shadow-lg shadow-indigo-600/30 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>Jump to {activeModule.parentHubName}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* Main Grid: Sidebar Module Directory + Right Response Sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT 4 COLS: MODULE SELECTOR DIRECTORY */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Search and Filters */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter exploration modules..."
                  className="w-full bg-transparent text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar">
                {['all', 'Student Core', 'STEM & Labs', 'Academic Records'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap text-[11px] transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'all' ? 'All Modules' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Module Items List */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm max-h-[600px] overflow-y-auto space-y-1.5 scrollbar">
              {filteredModules.map(m => {
                const isSelected = m.id === selectedModuleId;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModuleId(m.id);
                      if (speaking) stopEducatorSpeech();
                    }}
                    className={`w-full text-left p-3 rounded-xl transition cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-700/60 ring-1 ring-indigo-400'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                      <span className="text-indigo-600 dark:text-indigo-400 uppercase">
                        {m.moduleCategory}
                      </span>
                      <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
                        {m.executionLatency}
                      </span>
                    </div>

                    <h4 className="font-sora font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                      {m.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {m.summary}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                        <Compass className="w-3 h-3 text-indigo-500" />
                        {m.parentHubName}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> {m.responseStatus}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* RIGHT 8 COLS: COMPREHENSIVE RESPONSE SHEET */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
              
              {/* Top Banner with Actions */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 px-2.5 py-0.5 rounded-full">
                      {activeModule.badge}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Status: {activeModule.responseStatus}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Latency: {activeModule.executionLatency}
                    </span>
                  </div>

                  <h2 className="font-sora font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
                    {activeModule.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {activeModule.summary}
                  </p>
                </div>

                {/* Toolbar Buttons: Voice, Copy, Export */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePlayVoice}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      speaking 
                        ? 'bg-rose-600 text-white animate-pulse' 
                        : 'bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-slate-700'
                    }`}
                    title="Listen to official educator voice read-aloud"
                  >
                    {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-indigo-500" />}
                    <span>{speaking ? 'Stop Voice' : 'Educator Voice'}</span>
                  </button>

                  <button
                    onClick={handleCopySummary}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                    title="Copy full response summary to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => onNavigateToHub(activeModule.parentHubId)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer shadow-md"
                    title={`Open ${activeModule.parentHubName}`}
                  >
                    <span>Open Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sample Exploration Query Simulation */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Module Trigger / Exploration Input Payload</span>
                  </span>
                  <span className="text-emerald-500">Input Validated</span>
                </div>
                <div className="font-mono text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  {activeModule.sampleQuery}
                </div>
              </div>

              {/* Data Metric Breakdown Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activeModule.detailedResponse.dataBreakdown.map((item, idx) => (
                  <div 
                    key={idx}
                    className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-1"
                  >
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      {item.label}
                    </span>
                    <span className={`font-sora font-bold text-xs sm:text-sm block ${
                      item.status === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                      item.status === 'highlight' ? 'text-indigo-600 dark:text-indigo-400' :
                      'text-slate-900 dark:text-white'
                    }`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Key Insights & Findings */}
              <div className="space-y-3">
                <h3 className="font-sora font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Module Findings &amp; Step-by-Step Insights</span>
                </h3>

                <div className="space-y-2">
                  {activeModule.detailedResponse.keyInsights.map((insight, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formula or Code Snippet (if available) */}
              {activeModule.detailedResponse.codeOrFormulaSnippet && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-purple-500" />
                      <span>Mathematical Derivation / Code Output</span>
                    </span>
                  </div>
                  <pre className="p-3.5 bg-slate-950 text-emerald-400 font-mono text-xs rounded-2xl overflow-x-auto border border-slate-800 leading-relaxed scrollbar">
                    {activeModule.detailedResponse.codeOrFormulaSnippet}
                  </pre>
                </div>
              )}

              {/* Actionable Next Step & Cryptographic Seal */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-950 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <Bookmark className="w-3 h-3" /> Recommended Next Action
                  </span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {activeModule.detailedResponse.actionableAdvice}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-mono text-slate-400 block">
                    Cryptographic Verification Seal
                  </span>
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-300 font-bold">
                    {activeModule.detailedResponse.cryptographicSeal}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
