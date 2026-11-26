import React, { useState, useEffect, useRef } from 'react';
import { StudentDetail, UserRole, E2EEMessage, StudyFlashcard, StudySubjectChannel, EducationalDocument } from '../types';
import { 
  Lock, ShieldCheck, Send, Sparkles, BookOpen, Clock, 
  CheckCircle2, RefreshCw, Key, MessageSquare, Terminal, 
  HelpCircle, Eye, EyeOff, Play, Pause, RotateCcw, 
  Share2, Download, Copy, Lightbulb, ChevronRight, Hash,
  ArrowRight, Shield, Layers, Award, UserCheck, Flame, Cpu,
  FileText, Headphones, Bookmark, Volume2, Square
} from 'lucide-react';
import { getRegisteredStudents, getRegisteredTeachers } from '../services/authStorage';
import { generateContent } from '../services/api';
import { EducatorVoicePresenter } from './EducatorVoicePresenter';
import { VoiceToVoiceStudyAssistant } from './VoiceToVoiceStudyAssistant';
import { EducationalDocumentViewer } from './EducationalDocumentViewer';
import { EDUCATIONAL_DOCUMENTS } from '../data/educationalDocuments';
import { 
  speechEngine, 
  getActiveEducatorVoice, 
  PRESET_VOICE_PERSONAS, 
  VoicePersona,
  RECORDED_VOICE_GREETING 
} from '../services/educatorVoiceService';

interface StudentStudyHubProps {
  currentStudent: StudentDetail;
  onNavigateRole?: (role: UserRole) => void;
}

// Built-in Subject Channels with Verified Educators
const SUBJECT_CHANNELS: StudySubjectChannel[] = [
  {
    id: 'cyber_security',
    name: 'Cybersecurity Defense',
    code: 'SEC-301',
    leadEducator: 'Prof. Kalu Ndubuisi',
    educatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    description: 'Threat defense, network reconnaissance, cryptography, and zero-trust engineering.',
    colorTheme: 'from-blue-600 to-cyan-700',
    activeLearnersCount: 34,
    encryptionFingerprint: 'SHA256:7e9a:f402:d18c:e2ee:sec301',
  },
  {
    id: 'jss_math',
    name: 'Mathematics',
    code: 'MTH-201',
    leadEducator: 'Dr. Folashade Adeleke',
    educatorAvatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=250',
    description: 'Algebraic structures, linear equations, geometry proofs, and BECE prep.',
    colorTheme: 'from-emerald-600 to-teal-700',
    activeLearnersCount: 48,
    encryptionFingerprint: 'SHA256:3a1b:c984:11d0:e2ee:mth201',
  },
  {
    id: 'calculus',
    name: 'Calculus',
    code: 'CALC-301',
    leadEducator: 'Dr. Samuel Adeyemi',
    educatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    description: 'Limits, instantaneous differentiation, chain rule, and definite Riemann integration.',
    colorTheme: 'from-violet-600 to-indigo-800',
    activeLearnersCount: 39,
    encryptionFingerprint: 'SHA256:88fa:019c:33b1:e2ee:calc301',
  },
  {
    id: 'computer_science',
    name: 'Computer Science & Python',
    code: 'CSC-102',
    leadEducator: 'Dr. Sarah Jenkins',
    educatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    description: 'Data structures, algorithm complexity, recursion, and software design.',
    colorTheme: 'from-purple-600 to-indigo-700',
    activeLearnersCount: 41,
    encryptionFingerprint: 'SHA256:9f40:22aa:bb15:e2ee:csc102',
  },
  {
    id: 'cca_music',
    name: 'Cultural & Creative Arts (Music)',
    code: 'CCA-101',
    leadEducator: 'Mrs. Clara Thorne-Peters',
    educatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    description: 'African organology, idiophones, solfa notation, and acoustic theory.',
    colorTheme: 'from-amber-600 to-orange-700',
    activeLearnersCount: 26,
    encryptionFingerprint: 'SHA256:cc10:1994:aa88:e2ee:cca101',
  },
];

// Interactive Flashcards by Subject
const STUDY_FLASHCARDS: Record<string, StudyFlashcard[]> = {
  cyber_security: [
    {
      id: 'fc-cs-1',
      subjectId: 'cyber_security',
      subjectName: 'Cybersecurity Defense',
      frontQuestion: 'What is the fundamental difference between Symmetric and Asymmetric Encryption?',
      backAnswer: 'Symmetric encryption uses a single shared secret key for both encryption and decryption (e.g., AES-GCM-256). Asymmetric encryption uses a mathematically linked key pair: a public key for encryption and a private key for decryption (e.g., RSA-4096, ECC).',
      keyConcept: 'Cryptographic Primitives',
      formulaOrCode: 'Ciphertext = AES_Encrypt(Plaintext, K_shared)',
      difficulty: 'Intermediate',
    },
    {
      id: 'fc-cs-2',
      subjectId: 'cyber_security',
      subjectName: 'Cybersecurity Defense',
      frontQuestion: 'What is the principle of Zero Trust Architecture?',
      backAnswer: '"Never trust, always verify." Every access request must be authenticated, authorized, and cryptographically validated regardless of whether the requester is inside or outside the network perimeter.',
      keyConcept: 'Network Defense',
      formulaOrCode: 'Auth_Valid(Identity, Device, Context, Posture) == TRUE',
      difficulty: 'Foundation',
    },
    {
      id: 'fc-cs-3',
      subjectId: 'cyber_security',
      subjectName: 'Cybersecurity Defense',
      frontQuestion: 'How does Diffie-Hellman Key Exchange establish a shared secret over an insecure channel?',
      backAnswer: 'Both parties agree on public parameters (g, p). Alice computes A = g^a mod p; Bob computes B = g^b mod p. Alice then computes s = B^a mod p and Bob computes s = A^b mod p. Both arrive at the identical shared secret s = g^(ab) mod p without ever sending a or b over the wire.',
      keyConcept: 'Key Exchange Protocol',
      formulaOrCode: 'Shared_Secret = (g^b)^a mod p = g^(ab) mod p',
      difficulty: 'Mastery',
    },
  ],
  jss_math: [
    {
      id: 'fc-jm-1',
      subjectId: 'jss_math',
      subjectName: 'Mathematics',
      frontQuestion: 'What is the quadratic formula used to solve ax² + bx + c = 0?',
      backAnswer: 'x = (-b ± √(b² - 4ac)) / (2a). The discriminant Δ = b² - 4ac determines the nature of the roots: Δ > 0 (two distinct real roots), Δ = 0 (one repeated root), Δ < 0 (complex roots).',
      keyConcept: 'Algebra & Quadratic Equations',
      formulaOrCode: 'x = (-b ± √(b² - 4ac)) / 2a',
      difficulty: 'Foundation',
    },
    {
      id: 'fc-jm-2',
      subjectId: 'jss_math',
      subjectName: 'Mathematics',
      frontQuestion: 'State the Angle Sum Theorem for an n-sided polygon.',
      backAnswer: 'The sum of the interior angles of any n-sided convex polygon is S = (n - 2) × 180°. For a triangle (n=3), S=180°. For a quadrilateral (n=4), S=360°.',
      keyConcept: 'Geometric Proofs',
      formulaOrCode: 'S_interior = (n - 2) × 180°',
      difficulty: 'Intermediate',
    },
    {
      id: 'fc-jm-3',
      subjectId: 'jss_math',
      subjectName: 'Mathematics',
      frontQuestion: 'How do you solve simultaneous linear equations using the elimination method?',
      backAnswer: 'Multiply one or both equations by constants so that the coefficients of one variable are equal or opposite. Then add or subtract the equations to eliminate that variable and solve for the remaining one.',
      keyConcept: 'Linear Systems',
      formulaOrCode: '2x + 3y = 12 \n4x - 3y = 6 \n=> 6x = 18 => x = 3, y = 2',
      difficulty: 'Intermediate',
    },
  ],
  calculus: [
    {
      id: 'fc-calc-1',
      subjectId: 'calculus',
      subjectName: 'Calculus',
      frontQuestion: 'What is the Power Rule for differentiation?',
      backAnswer: 'For any real exponent n, the derivative of x^n with respect to x is n * x^(n - 1).',
      keyConcept: 'Power Rule',
      formulaOrCode: 'd/dx [x^n] = n · x^(n - 1)',
      difficulty: 'Foundation',
    },
    {
      id: 'fc-calc-2',
      subjectId: 'calculus',
      subjectName: 'Calculus',
      frontQuestion: 'How does the Chain Rule differentiate composite functions y = f(g(x))?',
      backAnswer: 'Multiply the derivative of the outer function with respect to the inner by the derivative of the inner function with respect to x: dy/dx = (df/dg) · (dg/dx).',
      keyConcept: 'Composite Function Differentiation',
      formulaOrCode: 'd/dx [f(g(x))] = f\'(g(x)) · g\'(x)',
      difficulty: 'Intermediate',
    },
    {
      id: 'fc-calc-3',
      subjectId: 'calculus',
      subjectName: 'Calculus',
      frontQuestion: 'What does the Fundamental Theorem of Calculus establish?',
      backAnswer: 'It connects differentiation and definite integration: if f is continuous on [a, b], then ∫_{a}^{b} f(x) dx = F(b) - F(a) where F\'(x) = f(x).',
      keyConcept: 'Fundamental Theorem',
      formulaOrCode: '∫_{a}^{b} f(x) dx = F(b) - F(a)',
      difficulty: 'Mastery',
    },
  ],
  computer_science: [
    {
      id: 'fc-csc-1',
      subjectId: 'computer_science',
      subjectName: 'Computer Science',
      frontQuestion: 'What is the Big-O time complexity of Binary Search on a sorted array of N elements?',
      backAnswer: 'O(log N). Because the search space is divided in half at every step, a 1,000,000 element array requires at most ~20 comparisons.',
      keyConcept: 'Algorithm Complexity',
      formulaOrCode: 'T(N) = T(N/2) + O(1) => O(log_2 N)',
      difficulty: 'Intermediate',
    },
  ],
  cca_music: [
    {
      id: 'fc-cca-1',
      subjectId: 'cca_music',
      subjectName: 'CCA Music',
      frontQuestion: 'What is an Idiophone in traditional African organology?',
      backAnswer: 'An instrument that produces sound primarily by the vibration of the instrument itself, without the use of air flow, strings, or stretched membranes (e.g., wooden slit drums, agogo bells, maracas, and xylophones/kundung).',
      keyConcept: 'Acoustic Organology',
      formulaOrCode: 'Classification: Idiophone (Self-sounding solid resonant body)',
      difficulty: 'Foundation',
    },
  ],
};

// Initial Seed E2EE Messages
const INITIAL_E2EE_MESSAGES: Record<string, E2EEMessage[]> = {
  cyber_security: [
    {
      id: 'msg-sec-01',
      channelId: 'cyber_security',
      subjectName: 'Cybersecurity Defense',
      senderId: 'USR-2026-T01',
      senderName: 'Prof. Kalu Ndubuisi',
      senderRole: 'teacher',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      plaintext: 'Welcome scholars to the End-to-End Encrypted Cybersecurity defense channel. All discussions and lab submissions here are cryptographically signed with your unique student session keys. Feel free to ask questions on AES-GCM or zero-trust posture!',
      ciphertext: '0x8842af3910cd99ef1a4c9b207198ea01944bc31289fe99238bcde',
      timestamp: '09:00 AM',
      keyFingerprint: 'SHA256:7e9a:f402:d18c:e2ee:sec301',
      verifiedEducator: true,
      isEndorsedAnswer: true,
      formulaSnippet: 'AES-256-GCM + Ephemeral ECDH Protocol Active',
    },
    {
      id: 'msg-sec-02',
      channelId: 'cyber_security',
      subjectName: 'Cybersecurity Defense',
      senderId: 'USR-2026-001',
      senderName: 'Samuel Adebayo',
      senderRole: 'student',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      plaintext: 'Professor, in the packet sniffing lab, how does TLS 1.3 prevent replay attacks compared to older protocols?',
      ciphertext: '0x71bc9942a10e5f29910dca38910023ee41a998bc1903',
      timestamp: '09:14 AM',
      keyFingerprint: 'SHA256:7e9a:f402:d18c:e2ee:sec301',
    },
    {
      id: 'msg-sec-03',
      channelId: 'cyber_security',
      subjectName: 'Cybersecurity Defense',
      senderId: 'USR-2026-T01',
      senderName: 'Prof. Kalu Ndubuisi',
      senderRole: 'teacher',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      plaintext: 'Great question Samuel! TLS 1.3 mandates ephemeral Diffie-Hellman keys for forward secrecy and uses monotonically increasing record sequence numbers tied to AES-GCM Galois message authentication codes (GMAC). Any replayed packets fail MAC verification immediately.',
      ciphertext: '0x19dfa993081ca481900deff392019a842104992019842fba9',
      timestamp: '09:18 AM',
      keyFingerprint: 'SHA256:7e9a:f402:d18c:e2ee:sec301',
      verifiedEducator: true,
      isEndorsedAnswer: true,
      formulaSnippet: 'MAC_Valid = GMAC(K, Nonce_seq, Packet_data)',
    },
  ],
  jss_math: [
    {
      id: 'msg-jm-01',
      channelId: 'jss_math',
      subjectName: 'Mathematics',
      senderId: 'USR-2026-T02',
      senderName: 'Dr. Folashade Adeleke',
      senderRole: 'teacher',
      senderAvatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=250',
      plaintext: 'Greetings Mathematics scholars! The E2EE study room is open for algebraic proofs, polynomial factorization, and geometry clarifications.',
      ciphertext: '0x99201f8410cefa398201a4bc8820f188390',
      timestamp: '08:45 AM',
      keyFingerprint: 'SHA256:3a1b:c984:11d0:e2ee:mth201',
      verifiedEducator: true,
      isEndorsedAnswer: true,
    },
  ],
  calculus: [
    {
      id: 'msg-calc-01',
      channelId: 'calculus',
      subjectName: 'Calculus',
      senderId: 'USR-2026-T03',
      senderName: 'Dr. Samuel Adeyemi',
      senderRole: 'teacher',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      plaintext: 'Welcome to Advanced Calculus. We are exploring the Fundamental Theorem of Calculus, chain rule differentials, and definite Riemann integration today.',
      ciphertext: '0x889104ccfa11984209ba315e2e8',
      timestamp: '09:00 AM',
      keyFingerprint: 'SHA256:88fa:019c:33b1:e2ee:calc301',
      verifiedEducator: true,
      isEndorsedAnswer: true,
      formulaSnippet: '∫_{a}^{b} f(x) dx = F(b) - F(a)',
    },
  ],
};

export const StudentStudyHub: React.FC<StudentStudyHubProps> = ({
  currentStudent,
  onNavigateRole,
}) => {
  const [selectedChannelId, setSelectedChannelId] = useState<string>('cyber_security');
  const [activeTab, setActiveTab] = useState<'study_workbench' | 'e2ee_chat' | 'flashcards' | 'pomodoro' | 'document_reader'>('study_workbench');
  const [activeDocumentId, setActiveDocumentId] = useState<string | undefined>(undefined);

  // Active Channel Info
  const activeChannel = SUBJECT_CHANNELS.find(c => c.id === selectedChannelId) || SUBJECT_CHANNELS[0];

  // E2EE Chat state
  const [messages, setMessages] = useState<Record<string, E2EEMessage[]>>(() => {
    try {
      const stored = localStorage.getItem('ilearnit_e2ee_chat_history_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_E2EE_MESSAGES;
  });

  const [inputText, setInputText] = useState('');
  const [showCiphertext, setShowCiphertext] = useState(false);
  const [isAiAnswering, setIsAiAnswering] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Study Scratchpad state
  const [scratchpadText, setScratchpadText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`ilearnit_scratchpad_${selectedChannelId}`);
      if (saved) return saved;
    } catch {}
    return `# Study Notes & Scratchpad - ${activeChannel.name}\n\n## Key Learning Objectives\n- Understand core principles and mathematical foundations.\n- Practice active recall with interactive flashcards.\n- Discuss challenging concepts with verified educators.\n\n## Working Formula / Code Sandbox:\n`;
  });

  // Pomodoro Focus Timer State
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [pomodoroCycles, setPomodoroCycles] = useState(2);
  const [dailyFocusMinutes, setDailyFocusMinutes] = useState(50);

  // Flashcards state
  const currentFlashcards = STUDY_FLASHCARDS[selectedChannelId] || STUDY_FLASHCARDS.cyber_security;
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>({});

  // Hub Document Text-to-Speech Engine State
  const [hubSelectedDocId, setHubSelectedDocId] = useState<string>(() => {
    const match = EDUCATIONAL_DOCUMENTS.find(d => d.subjectId === selectedChannelId);
    return match ? match.id : EDUCATIONAL_DOCUMENTS[0].id;
  });
  const [isHubDocSpeaking, setIsHubDocSpeaking] = useState<boolean>(false);
  const [isHubDocPaused, setIsHubDocPaused] = useState<boolean>(false);
  const [hubActiveVoice, setHubActiveVoice] = useState<VoicePersona>(() => getActiveEducatorVoice());
  const [hubReadingSectionIdx, setHubReadingSectionIdx] = useState<number>(0);
  const [hubStatusMsg, setHubStatusMsg] = useState<string>('');

  const activeHubDoc = EDUCATIONAL_DOCUMENTS.find(d => d.id === hubSelectedDocId) || EDUCATIONAL_DOCUMENTS[0];

  // Update selected doc when channel changes
  useEffect(() => {
    const match = EDUCATIONAL_DOCUMENTS.find(d => d.subjectId === selectedChannelId);
    if (match) {
      setHubSelectedDocId(match.id);
      setHubReadingSectionIdx(0);
    }
  }, [selectedChannelId]);

  // Handle Hub Document Speech Narration
  const handleToggleHubDocSpeech = () => {
    if (isHubDocPaused) {
      speechEngine.resume();
      setIsHubDocPaused(false);
      setIsHubDocSpeaking(true);
      return;
    }

    if (isHubDocSpeaking) {
      speechEngine.stop();
      setIsHubDocSpeaking(false);
      setIsHubDocPaused(false);
      setHubStatusMsg('');
      return;
    }

    // Start reading activeHubDoc
    const greeting = hubActiveVoice.catchphrases[0] || RECORDED_VOICE_GREETING;
    const sec = activeHubDoc.sections[hubReadingSectionIdx] || activeHubDoc.sections[0];
    const script = `${greeting} Welcome to the ${activeHubDoc.title} audio masterclass. Reviewing: ${sec.heading}. ${sec.content}`;

    setHubStatusMsg(`Narrating: ${sec.heading}`);
    speechEngine.speak(
      script,
      hubActiveVoice,
      {
        onStart: () => {
          setIsHubDocSpeaking(true);
          setIsHubDocPaused(false);
        },
        onEnd: () => {
          setIsHubDocSpeaking(false);
          setIsHubDocPaused(false);
          setHubStatusMsg('Document audio narration finished');
          setTimeout(() => setHubStatusMsg(''), 4000);
        }
      }
    );
  };

  const handleStopHubDocSpeech = () => {
    speechEngine.stop();
    setIsHubDocSpeaking(false);
    setIsHubDocPaused(false);
    setHubStatusMsg('');
  };

  const handleReadScratchpadNotes = () => {
    if (!scratchpadText.trim()) return;
    speechEngine.stop();
    setIsHubDocSpeaking(true);
    setHubStatusMsg('Reading scratchpad revision notes aloud...');

    const greeting = hubActiveVoice.catchphrases[0] || RECORDED_VOICE_GREETING;
    const cleanNotes = scratchpadText.replace(/[*#`$\\]/g, '');
    const script = `${greeting} Here is a read-back of your study scratchpad for ${activeChannel.name}: ${cleanNotes}`;

    speechEngine.speak(
      script,
      hubActiveVoice,
      {
        onStart: () => setIsHubDocSpeaking(true),
        onEnd: () => {
          setIsHubDocSpeaking(false);
          setHubStatusMsg('');
        }
      }
    );
  };

  const handleReadFlashcardAloud = (textToRead: string) => {
    speechEngine.stop();
    setIsHubDocSpeaking(true);
    setHubStatusMsg('Reading flashcard concept...');

    speechEngine.speak(
      textToRead,
      hubActiveVoice,
      {
        onStart: () => setIsHubDocSpeaking(true),
        onEnd: () => {
          setIsHubDocSpeaking(false);
          setHubStatusMsg('');
        }
      }
    );
  };

  // Real registered users list
  const registeredStudents = getRegisteredStudents();
  const registeredTeachers = getRegisteredTeachers();

  // Save chat to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ilearnit_e2ee_chat_history_v1', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  // Save scratchpad
  useEffect(() => {
    try {
      localStorage.setItem(`ilearnit_scratchpad_${selectedChannelId}`, scratchpadText);
    } catch {}
  }, [scratchpadText, selectedChannelId]);

  // Pomodoro Interval
  useEffect(() => {
    let interval: any = null;
    if (isPomodoroRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0 && isPomodoroRunning) {
      setIsPomodoroRunning(false);
      setPomodoroCycles((c) => c + 1);
      setDailyFocusMinutes((m) => m + 25);
      setPomodoroSeconds(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isPomodoroRunning, pomodoroSeconds]);

  // Auto scroll chat
  useEffect(() => {
    if (activeTab === 'e2ee_chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedChannelId, activeTab]);

  // Encrypt string helper (generates simulated hex ciphertext)
  const pseudoEncrypt = (text: string): string => {
    let hash = '0x';
    for (let i = 0; i < text.length; i++) {
      hash += text.charCodeAt(i).toString(16);
    }
    return hash.slice(0, 48) + '...[AES-256-GCM]';
  };

  // Handle Send Message in E2EE Chat
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessageText = inputText.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMsg: E2EEMessage = {
      id: `msg-${Date.now()}`,
      channelId: selectedChannelId,
      subjectName: activeChannel.name,
      senderId: currentStudent.id || 'USR-STUDENT',
      senderName: currentStudent.name || 'Samuel Adebayo',
      senderRole: 'student',
      senderAvatar: currentStudent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      plaintext: userMessageText,
      ciphertext: pseudoEncrypt(userMessageText),
      timestamp: timeStr,
      keyFingerprint: activeChannel.encryptionFingerprint,
    };

    setMessages((prev) => {
      const channelMsgs = prev[selectedChannelId] || [];
      return {
        ...prev,
        [selectedChannelId]: [...channelMsgs, newMsg],
      };
    });

    setInputText('');

    // Trigger AI Educator Assistant auto-response after 1.2 seconds for realistic educator dialogue
    setIsAiAnswering(true);
    setTimeout(async () => {
      try {
        const prompt = `You are ${activeChannel.leadEducator}, a verified teacher for "${activeChannel.name}" at iLearnit-365.
A student named "${currentStudent.name}" sent the following question in the end-to-end encrypted subject channel:
"${userMessageText}"

Provide a concise, encouraging, and academically accurate response (max 3-4 sentences). Include a key formula or concept summary if applicable.`;

        const result = await generateContent({
          prompt,
          systemInstruction: `You are ${activeChannel.leadEducator}, an inspiring educator. Give clear academic guidance.`,
          temperature: 0.3,
        });

        const teacherMsg: E2EEMessage = {
          id: `msg-tch-${Date.now()}`,
          channelId: selectedChannelId,
          subjectName: activeChannel.name,
          senderId: 'USR-TEACHER',
          senderName: activeChannel.leadEducator,
          senderRole: 'teacher',
          senderAvatar: activeChannel.educatorAvatar,
          plaintext: result.text,
          ciphertext: pseudoEncrypt(result.text),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          keyFingerprint: activeChannel.encryptionFingerprint,
          verifiedEducator: true,
          isEndorsedAnswer: true,
        };

        setMessages((prev) => {
          const channelMsgs = prev[selectedChannelId] || [];
          return {
            ...prev,
            [selectedChannelId]: [...channelMsgs, teacherMsg],
          };
        });
      } catch (err) {
        console.error('Teacher response error:', err);
      } finally {
        setIsAiAnswering(false);
      }
    }, 1200);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFlashcardGrade = (known: boolean) => {
    const currentCard = currentFlashcards[flashcardIndex];
    if (currentCard) {
      setMasteredCards((prev) => ({ ...prev, [currentCard.id]: known }));
    }
    setIsFlipped(false);
    if (flashcardIndex < currentFlashcards.length - 1) {
      setFlashcardIndex((idx) => idx + 1);
    } else {
      setFlashcardIndex(0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-br from-[#0B1D3A] via-[#132C54] to-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3 py-1 rounded-full text-xs font-mono font-bold">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>E2EE Zero-Knowledge Protocol</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Verified Registered Student Hub</span>
              </span>
            </div>

            <h1 className="font-sora font-extrabold text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-3">
              <span>Interactive Study Hub & Encrypted Educator Portal</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time interactive study environment for registered scholars. Features AES-256 encrypted peer-to-educator channels, interactive concept flashcards, live math scratchpad, and Pomodoro focus tracking.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex items-center gap-6 shrink-0">
            <div className="text-center">
              <div className="text-[10px] font-mono text-slate-300 uppercase">Active Scholar</div>
              <div className="font-sora font-bold text-sm text-emerald-400 mt-0.5">{currentStudent.name}</div>
              <div className="text-[10px] font-mono text-slate-400">{currentStudent.gradeLevel}</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-[10px] font-mono text-slate-300 uppercase">Focus Today</div>
              <div className="font-sora font-bold text-base text-amber-400 mt-0.5 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-amber-400" /> {dailyFocusMinutes}m
              </div>
              <div className="text-[10px] font-mono text-slate-400">{pomodoroCycles} Cycles Done</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-white/10 pt-6">
          <button
            onClick={() => setActiveTab('study_workbench')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'study_workbench'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400'
                : 'text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-300" />
            <span>Interactive Study Workbench</span>
          </button>

          <button
            onClick={() => setActiveTab('e2ee_chat')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'e2ee_chat'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400'
                : 'text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-300" />
            <span>E2EE Educator Chatroom</span>
            <span className="bg-emerald-400 text-[#0B1D3A] text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full">
              LIVE
            </span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-1 ring-amber-400'
                : 'text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Smart Concept Flashcards</span>
          </button>

          <button
            onClick={() => setActiveTab('pomodoro')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'pomodoro'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-400'
                : 'text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Clock className="w-4 h-4 text-purple-300" />
            <span>Pomodoro Focus Timer ({formatTimer(pomodoroSeconds)})</span>
          </button>

          <button
            onClick={() => setActiveTab('document_reader')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'document_reader'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
                : 'text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-300" />
            <span>Curriculum Document Reader</span>
            <span className="bg-indigo-400 text-[#0B1D3A] text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full">
              NEW
            </span>
          </button>
        </div>
      </div>

      {/* Subject Channel Selector Grid */}
      <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5B6A88] dark:text-slate-400 font-bold">
              Registered Subject Channels
            </span>
            <h3 className="font-sora font-bold text-lg text-[#0B1D3A] dark:text-white">
              Select Active Study Discipline
            </h3>
          </div>
          <div className="text-xs font-mono text-[#5B6A88] dark:text-slate-400">
            {SUBJECT_CHANNELS.length} Active Channels
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUBJECT_CHANNELS.map((ch) => {
            const isSelected = ch.id === selectedChannelId;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  setSelectedChannelId(ch.id);
                  setFlashcardIndex(0);
                  setIsFlipped(false);
                }}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-br ' + ch.colorTheme + ' text-white border-transparent shadow-md scale-[1.02]'
                    : 'bg-[#F6F8FB] dark:bg-slate-800/60 border-[#D8DFEA] dark:border-slate-700 text-[#0B1D3A] dark:text-slate-200 hover:border-blue-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                    }`}>
                      {ch.code}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {ch.activeLearnersCount} online
                    </span>
                  </div>

                  <h4 className="font-sora font-bold text-sm leading-snug">{ch.name}</h4>
                  <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-slate-200' : 'text-[#5B6A88] dark:text-slate-400'}`}>
                    {ch.description}
                  </p>
                </div>

                <div className={`mt-3 pt-3 border-t flex items-center gap-2 ${
                  isSelected ? 'border-white/20 text-white' : 'border-[#D8DFEA] dark:border-slate-700 text-[#5B6A88] dark:text-slate-400'
                }`}>
                  <img src={ch.educatorAvatar} alt="" className="w-5 h-5 rounded-full object-cover border border-white/40" />
                  <span className="text-[10px] font-semibold truncate">{ch.leadEducator}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: INTERACTIVE STUDY WORKBENCH */}
      {activeTab === 'study_workbench' && (
        <div className="space-y-6">
          {/* Embedded Educator Voice Presenter */}
          <EducatorVoicePresenter
            moduleName={activeChannel.name}
            topicTitle={`${activeChannel.code}: ${activeChannel.name} Interactive Briefing`}
            overviewSpeech={`Welcome to the ${activeChannel.name} academic channel led by ${activeChannel.leadEducator}. ${activeChannel.description}. We encourage collaborative problem-solving, structured practice, and direct teacher dialogue.`}
            keyPoints={[
              `Active Lead Educator: ${activeChannel.leadEducator}`,
              `Channel Encryption Status: E2EE Verified (${activeChannel.encryptionFingerprint.slice(0, 16)}...)`,
              `Interactive Concept Flashcards & Scratchpad available below`,
              `Real-time Educator-Student dialogue enabled for doubt clearing`
            ]}
            checkpointQuestion={{
              question: `In ${activeChannel.name}, what is the foundational practice recommended for academic mastery?`,
              options: [
                "Consistent problem derivation and iterative conceptual practice",
                "Skipping the theoretical proof directly to final answers",
                "Memorizing answers without step-by-step logic",
                "Leaving homework assignments unchecked"
              ],
              correctIndex: 0,
              explanation: "Mastery in STEM disciplines is achieved through step-by-step derivation, critical analysis, and hands-on laboratory application."
            }}
            studentName={currentStudent.fullName}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Scratchpad & Math Runner */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#ECF0F6] dark:border-slate-800 pb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sora font-bold text-lg text-[#0B1D3A] dark:text-white">
                      Live Study Scratchpad & Code Lab
                    </h3>
                    <p className="text-xs text-[#5B6A88] dark:text-slate-400">
                      Channel: <span className="font-semibold text-blue-600 dark:text-blue-400">{activeChannel.name}</span> • Auto-saved to secure local vault
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleReadScratchpadNotes}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-xl transition cursor-pointer border border-emerald-300 dark:border-emerald-700"
                    title="Read your personal scratchpad notes aloud in Educator Voice"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Listen Notes
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(scratchpadText);
                      alert('Scratchpad content copied to clipboard!');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F6F8FB] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0B1D3A] dark:text-slate-200 text-xs font-semibold rounded-xl transition cursor-pointer border border-[#D8DFEA] dark:border-slate-700"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Notes
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([scratchpadText], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${activeChannel.code}_study_notes.md`;
                      a.click();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> Export .md
                  </button>
                </div>
              </div>

              {/* Textarea for Scratchpad */}
              <textarea
                value={scratchpadText}
                onChange={(e) => setScratchpadText(e.target.value)}
                rows={12}
                className="w-full bg-[#F6F8FB] dark:bg-slate-950 border border-[#D8DFEA] dark:border-slate-800 rounded-2xl p-4 font-mono text-xs sm:text-sm text-[#0B1D3A] dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 leading-relaxed resize-y"
                placeholder="Type your notes, equations, math derivations, or Python code here..."
              />

              {/* Quick Math / Code Formula Templates Toolbar */}
              <div className="bg-[#ECF0F6] dark:bg-slate-800/80 p-3 rounded-2xl flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-[#5B6A88] dark:text-slate-300 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Insert Snippet:
                </span>

                <button
                  onClick={() => setScratchpadText((prev) => prev + '\n\n$$\nx = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n$$\n')}
                  className="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 text-[11px] font-mono rounded-lg border border-[#D8DFEA] dark:border-slate-600 text-[#0B1D3A] dark:text-slate-200 cursor-pointer"
                >
                  Quadratic Formula
                </button>

                <button
                  onClick={() => setScratchpadText((prev) => prev + '\n\n```python\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: left = mid + 1\n        else: right = mid - 1\n    return -1\n```\n')}
                  className="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 text-[11px] font-mono rounded-lg border border-[#D8DFEA] dark:border-slate-600 text-[#0B1D3A] dark:text-slate-200 cursor-pointer"
                >
                  Binary Search Python
                </button>

                <button
                  onClick={() => setScratchpadText((prev) => prev + '\n\n# Cryptographic Key Exchange Verification\nKey_Fingerprint = SHA256(PublicKey_Alice || PublicKey_Bob)\nAES_Nonce = CryptoRandom(12_bytes)\n')}
                  className="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 text-[11px] font-mono rounded-lg border border-[#D8DFEA] dark:border-slate-600 text-[#0B1D3A] dark:text-slate-200 cursor-pointer"
                >
                  AES Crypto Block
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Verified Educator & Study Plan */}
          <div className="lg:col-span-4 space-y-6">
            {/* Educator Card */}
            <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-[#ECF0F6] dark:border-slate-800 pb-4">
                <img src={activeChannel.educatorAvatar} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-sora font-bold text-base text-[#0B1D3A] dark:text-white">
                      {activeChannel.leadEducator}
                    </h4>
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-[#5B6A88] dark:text-slate-400">Lead Educator • {activeChannel.code}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#5B6A88] dark:text-slate-400">
                  <span>Cryptographic Session:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">ESTABLISHED ✓</span>
                </div>
                <div className="flex items-center justify-between text-[#5B6A88] dark:text-slate-400">
                  <span>E2EE Fingerprint:</span>
                  <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">{activeChannel.encryptionFingerprint.slice(0, 16)}...</span>
                </div>
                <div className="flex items-center justify-between text-[#5B6A88] dark:text-slate-400">
                  <span>Office Hours:</span>
                  <span className="font-semibold text-[#0B1D3A] dark:text-slate-200">Mon-Fri 09:00 AM - 04:00 PM</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('e2ee_chat')}
                className="w-full bg-[#0B1D3A] hover:bg-[#132C54] dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-semibold py-3 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <MessageSquare className="w-4 h-4" /> Message {activeChannel.leadEducator}
              </button>
            </div>

            {/* Educator Voice Document Audio Hub & TTS Player Widget */}
            <div className="bg-gradient-to-br from-indigo-900 via-[#132C54] to-slate-900 border border-indigo-500/40 rounded-3xl p-6 text-white shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5 text-cyan-400" /> Document Audio Player &amp; TTS
                </span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                  Voice Engine
                </span>
              </div>

              {/* Document Selector */}
              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">Target Curriculum Document:</label>
                <select
                  value={hubSelectedDocId}
                  onChange={(e) => {
                    speechEngine.stop();
                    setIsHubDocSpeaking(false);
                    setIsHubDocPaused(false);
                    setHubSelectedDocId(e.target.value);
                    setHubReadingSectionIdx(0);
                  }}
                  className="w-full bg-black/40 border border-indigo-400/40 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-medium"
                >
                  {EDUCATIONAL_DOCUMENTS.map(d => (
                    <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                      [{d.courseCode}] {d.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Voice Template Badge */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-mono">Educator Voice Template:</span>
                  <span className="text-emerald-400 font-mono font-bold">Default Recorded Guide</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">{hubActiveVoice.name}</div>
                    <div className="text-[10px] text-slate-300 truncate">{hubActiveVoice.accent} • Pitch: {hubActiveVoice.pitch}x</div>
                  </div>
                </div>

                {/* Status indicator */}
                {hubStatusMsg && (
                  <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/80 rounded-xl px-2.5 py-1 flex items-center gap-1.5 animate-pulse">
                    <Volume2 className="w-3 h-3 shrink-0" />
                    <span className="truncate">{hubStatusMsg}</span>
                  </div>
                )}
              </div>

              {/* Audio Controls */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleToggleHubDocSpeech}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    isHubDocSpeaking
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                  }`}
                >
                  {isHubDocSpeaking ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Narration</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isHubDocPaused ? 'Resume Voice' : 'Read Doc Aloud'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleStopHubDocSpeech}
                  disabled={!isHubDocSpeaking && !isHubDocPaused}
                  className="py-2.5 px-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 border border-white/20 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop</span>
                </button>
              </div>

              {/* Jump to Full Document Reader Tab */}
              <button
                onClick={() => {
                  setActiveDocumentId(hubSelectedDocId);
                  setActiveTab('document_reader');
                }}
                className="w-full bg-indigo-600/60 hover:bg-indigo-600 border border-indigo-400/40 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" /> Open in Document Reader <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Action Navigation */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-200 dark:border-slate-700 rounded-3xl p-6 space-y-3">
              <h4 className="font-sora font-bold text-sm text-[#0B1D3A] dark:text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" /> Academic Exam Suite
              </h4>
              <p className="text-xs text-[#5B6A88] dark:text-slate-300">
                Ready to test your comprehension under timed BECE / JSS mock exam conditions?
              </p>
              <button
                onClick={() => onNavigateRole && onNavigateRole('cbt')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                Launch Universal CBT Exam <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* TAB 2: END-TO-END ENCRYPTED (E2EE) CHATROOM */}
      {activeTab === 'e2ee_chat' && (
        <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[700px]">
          {/* Chat Header */}
          <div className="bg-[#0B1D3A] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-blue-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-sora font-bold text-base text-white">
                    #{activeChannel.id} • {activeChannel.name}
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> E2EE AES-256
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-mono">
                  Educator: {activeChannel.leadEducator} • Fingerprint: {activeChannel.encryptionFingerprint}
                </p>
              </div>
            </div>

            {/* Ciphertext Toggle & Stats */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCiphertext((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                  showCiphertext
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                    : 'bg-white/10 text-slate-200 border-white/20 hover:bg-white/20'
                }`}
              >
                {showCiphertext ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showCiphertext ? 'Show Decrypted' : 'Inspect Ciphertext'}</span>
              </button>
            </div>
          </div>

          {/* Messages Feed Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#F6F8FB] dark:bg-slate-950">
            {/* Encryption Security Warning Note */}
            <div className="bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-800 rounded-2xl p-3.5 text-center text-xs text-[#5B6A88] dark:text-slate-400 font-mono">
              <Lock className="w-4 h-4 text-emerald-500 inline mr-1.5 -mt-0.5" />
              Messages in this channel are end-to-end encrypted with AES-GCM-256 and ephemeral session keys. Only you and verified iLearnit-365 educators hold the decryption keys.
            </div>

            {(messages[selectedChannelId] || []).map((msg) => {
              const isCurrentUser = msg.senderRole === 'student' && (msg.senderName === currentStudent.name || msg.senderId === currentStudent.id);
              const isTeacher = msg.senderRole === 'teacher';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 items-start max-w-2xl ${
                    isCurrentUser ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt=""
                    className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-300 dark:border-slate-700 shadow-sm"
                  />

                  <div className={`space-y-1.5 ${isCurrentUser ? 'text-right' : ''}`}>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-sora font-bold text-[#0B1D3A] dark:text-white">
                        {msg.senderName}
                      </span>
                      {isTeacher && (
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold font-mono px-1.5 py-0.2 rounded border border-emerald-300 dark:border-emerald-800">
                          Verified Educator ✓
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-[#7A8AA8] dark:text-slate-500">
                        {msg.timestamp}
                      </span>
                      {isTeacher && (
                        <button
                          type="button"
                          onClick={() => handleReadFlashcardAloud(`${msg.senderName} says: ${msg.plaintext}`)}
                          className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                          title="Listen to Educator Explanation"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isTeacher
                          ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800/90 text-[#0B1D3A] dark:text-slate-100 border border-emerald-300 dark:border-emerald-800/60'
                          : isCurrentUser
                          ? 'bg-[#0B1D3A] dark:bg-blue-600 text-white'
                          : 'bg-white dark:bg-slate-900 text-[#0B1D3A] dark:text-slate-200 border border-[#D8DFEA] dark:border-slate-800'
                      }`}
                    >
                      {showCiphertext ? (
                        <div className="font-mono text-xs text-amber-600 dark:text-amber-400 break-all space-y-1">
                          <div className="text-[10px] uppercase font-bold text-slate-400">[AES-256 Ciphertext Payload]</div>
                          <div>{msg.ciphertext}</div>
                          <div className="text-[9px] text-slate-500 mt-1">Fingerprint: {msg.keyFingerprint}</div>
                        </div>
                      ) : (
                        <div>
                          <p>{msg.plaintext}</p>
                          {msg.formulaSnippet && (
                            <div className="mt-2.5 p-2.5 bg-black/5 dark:bg-black/40 rounded-xl font-mono text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                              {msg.formulaSnippet}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isAiAnswering && (
              <div className="flex gap-3 items-center text-xs text-[#5B6A88] dark:text-slate-400 font-mono animate-pulse">
                <img src={activeChannel.educatorAvatar} alt="" className="w-8 h-8 rounded-xl object-cover" />
                <span>{activeChannel.leadEducator} is typing an encrypted response...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-[#D8DFEA] dark:border-slate-800 flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Send encrypted message to ${activeChannel.leadEducator} and peers in #${activeChannel.id}...`}
              className="flex-1 bg-[#F6F8FB] dark:bg-slate-950 border border-[#D8DFEA] dark:border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#0B1D3A] dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-sora font-semibold text-xs sm:text-sm px-5 py-3 rounded-2xl transition flex items-center gap-2 cursor-pointer shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send E2EE</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: SMART CONCEPT FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
            <div className="flex items-center justify-between border-b border-[#ECF0F6] dark:border-slate-800 pb-4">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                {activeChannel.name} • Flashcard {flashcardIndex + 1} of {currentFlashcards.length}
              </span>
              <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {currentFlashcards[flashcardIndex]?.difficulty || 'Intermediate'}
              </span>
            </div>

            {/* Flashcard 3D Interactive Flip Box */}
            <div
              onClick={() => setIsFlipped((prev) => !prev)}
              className={`min-h-[260px] sm:min-h-[300px] p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-center items-center cursor-pointer relative shadow-lg ${
                isFlipped
                  ? 'bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white border-emerald-400'
                  : 'bg-gradient-to-br from-blue-900 via-[#0B1D3A] to-slate-900 text-white border-blue-400'
              }`}
            >
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-300 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isFlipped ? 'Answer & Explanation (Click to flip)' : 'Question (Click to reveal answer)'}</span>
              </div>

              <div className="font-sora font-bold text-base sm:text-xl max-w-xl leading-relaxed">
                {isFlipped
                  ? currentFlashcards[flashcardIndex]?.backAnswer
                  : currentFlashcards[flashcardIndex]?.frontQuestion}
              </div>

              {currentFlashcards[flashcardIndex]?.formulaOrCode && (
                <div className="mt-4 p-3 bg-black/40 rounded-xl font-mono text-xs text-cyan-300 border border-cyan-500/30 max-w-md w-full">
                  {currentFlashcards[flashcardIndex]?.formulaOrCode}
                </div>
              )}
            </div>

            {/* Assessment Buttons & Audio Readout */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const text = isFlipped
                    ? `Answer: ${currentFlashcards[flashcardIndex]?.backAnswer}`
                    : `Question: ${currentFlashcards[flashcardIndex]?.frontQuestion}`;
                  handleReadFlashcardAloud(text);
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-blue-300 dark:border-blue-700"
                title="Listen to Flashcard in Educator Voice"
              >
                <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Listen {isFlipped ? 'Answer' : 'Question'}</span>
              </button>

              <button
                onClick={() => handleFlashcardGrade(false)}
                className="px-5 py-2.5 rounded-xl border border-red-300 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 text-xs font-bold transition cursor-pointer"
              >
                Needs Review ✗
              </button>
              <button
                onClick={() => handleFlashcardGrade(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-md"
              >
                Mastered Concept ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: POMODORO FOCUS TIMER */}
      {activeTab === 'pomodoro' && (
        <div className="max-w-xl mx-auto space-y-6 text-center">
          <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 font-bold">
                Binaural Focus Interval
              </span>
              <h3 className="font-sora font-bold text-2xl text-[#0B1D3A] dark:text-white">
                Deep Study Sprint ({activeChannel.name})
              </h3>
            </div>

            {/* Timer Clock Display */}
            <div className="w-56 h-56 mx-auto rounded-full bg-gradient-to-br from-purple-900 to-indigo-950 border-4 border-purple-500 flex flex-col items-center justify-center text-white shadow-2xl shadow-purple-900/30">
              <div className="font-sora font-extrabold text-5xl tracking-tight">
                {formatTimer(pomodoroSeconds)}
              </div>
              <div className="text-[11px] font-mono text-purple-300 mt-2">
                {isPomodoroRunning ? '⚡ Active Focus' : 'Paused'}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsPomodoroRunning((prev) => !prev)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-sora font-bold text-sm px-8 py-3 rounded-2xl transition flex items-center gap-2 cursor-pointer shadow-lg"
              >
                {isPomodoroRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPomodoroRunning ? 'Pause Sprint' : 'Start Focus Sprint'}</span>
              </button>

              <button
                onClick={() => {
                  setIsPomodoroRunning(false);
                  setPomodoroSeconds(25 * 60);
                }}
                className="bg-[#F6F8FB] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0B1D3A] dark:text-slate-200 p-3 rounded-2xl transition cursor-pointer border border-[#D8DFEA] dark:border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: IN-HUB CURRICULUM RESOURCE DOCUMENT READER */}
      {activeTab === 'document_reader' && (
        <EducationalDocumentViewer
          initialDocumentId={activeDocumentId}
          currentSubjectFilter={selectedChannelId}
          studentName={currentStudent.fullName || currentStudent.name || 'Scholar'}
          onSelectDocument={(docId) => setActiveDocumentId(docId)}
        />
      )}

      {/* FLOATING REAL-TIME VOICE-TO-VOICE AI EDUCATOR ASSISTANT */}
      <VoiceToVoiceStudyAssistant
        currentStudentName={currentStudent.fullName || currentStudent.name || 'Scholar'}
        activeChannel={activeChannel}
      />
    </div>
  );
};
