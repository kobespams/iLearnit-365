// Educator Voice, Tone & Accent Engine for iLearnit-365
// Enables embedding personalized educator voice presentations and real-time student-educator interactions

export interface VoicePersona {
  id: string;
  name: string;
  title: string;
  accent: 'Nigerian / West African' | 'British Academic' | 'International English' | 'North American' | 'Custom Voice';
  tone: 'Warm & Encouraging' | 'Energetic & Inspiring' | 'Analytical & Precise' | 'Calm Mentor';
  langCode: string;
  pitch: number;
  rate: number;
  gender: 'female' | 'male' | 'neutral';
  catchphrases: string[];
  bio: string;
  isRecordedTemplate?: boolean;
  recordedGreetingPhrase?: string;
}

export interface StudentInteractionRecord {
  id: string;
  timestamp: string;
  studentId: string;
  studentName: string;
  moduleName: string;
  topicTitle: string;
  questionText: string;
  educatorResponse: string;
  audioFeedbackAvailable?: boolean;
  status: 'ANSWERED' | 'PENDING_REVIEW' | 'FAVORITED';
  comprehensionRating?: number; // 1 to 5
}

export interface LessonVoicePresentation {
  moduleName: string;
  topicTitle: string;
  overviewSpeech: string;
  keyPointsSpeech: string[];
  interactiveQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    spokenPrompt: string;
  }[];
  concludingRemarks: string;
}

export const RECORDED_VOICE_GREETING = "Good day everyone. I am going to be your guide for today's course. Stay tuned as we proceed.";

export const PRESET_VOICE_PERSONAS: VoicePersona[] = [
  {
    id: 'voice-recorded-guide',
    name: 'Engr. Adeola (Course Guide • Recorded Audio Template)',
    title: 'Academic Course Guide & Lead Instructor',
    accent: 'Nigerian / West African',
    tone: 'Calm Mentor',
    langCode: 'en-NG',
    pitch: 0.98,
    rate: 0.92,
    gender: 'male',
    isRecordedTemplate: true,
    recordedGreetingPhrase: RECORDED_VOICE_GREETING,
    catchphrases: [
      RECORDED_VOICE_GREETING,
      'Let us proceed deliberately and explore every layer of this subject.',
      'Keep your attention tuned on the foundational principles; mastery will follow naturally.',
      'Wonderful dedication to your studies. Let us continue to the next concept.',
      'Stay tuned as we unpack the core mechanics step by step.'
    ],
    bio: 'Specialized educator persona applied from the master recorded audio template: "Good day everyone. I am going to be your guide for today\'s course. Stay tuned as we proceed." Features a clear West African tone and measured pedagogical pacing.'
  },
  {
    id: 'voice-adeleke',
    name: 'Dr. Folashade Adeleke',
    title: 'Lead Academic Director & STEM Educator',
    accent: 'Nigerian / West African',
    tone: 'Warm & Encouraging',
    langCode: 'en-NG',
    pitch: 1.05,
    rate: 0.95,
    gender: 'female',
    catchphrases: [
      'Welcome back my brilliant scholars! Let’s unpack this concept step by step.',
      'Look at this critically — you will see how beautifully mathematics connects!',
      'Sharp thinking! You are doing fantastic work today.',
      'Remember, mastery comes from consistent practice. Let us review the key takeaway.'
    ],
    bio: 'Experienced educator passionate about intuitive mathematics, interactive STEM learning, and empowering students across Nigeria and globally.'
  },
  {
    id: 'voice-emeka',
    name: 'Engr. Emeka Okonkwo',
    title: 'Cybersecurity & Tech Systems Specialist',
    accent: 'Nigerian / West African',
    tone: 'Energetic & Inspiring',
    langCode: 'en-NG',
    pitch: 0.95,
    rate: 1.0,
    gender: 'male',
    catchphrases: [
      'Hello tech pioneers! Secure your stations, we are diving deep into cyber defense.',
      'Always remember: Security is not a product, it is a mindset.',
      'Excellent deduction! That is exactly how zero-trust protocols protect networks.',
      'Let’s test our defense against real-world attack vectors.'
    ],
    bio: 'Systems architect specializing in defensive cyber engineering, encryption models, and hands-on laboratory mentorship.'
  },
  {
    id: 'voice-clara',
    name: 'Prof. Clara Thornton',
    title: 'Senior Computational Linguist & Tutor',
    accent: 'British Academic',
    tone: 'Analytical & Precise',
    langCode: 'en-GB',
    pitch: 1.1,
    rate: 0.92,
    gender: 'female',
    catchphrases: [
      'Greetings students. Let us examine the foundational principles with clarity.',
      'Observe the structured pattern here — elegance lies in simplicity.',
      'A very thoughtful inquiry indeed. Allow me to elaborate.'
    ],
    bio: 'Dedicated to analytical precision, academic rigour, and structured concept delivery.'
  },
  {
    id: 'voice-custom',
    name: 'My Personal Voice Profile (Custom Accent & Cadence)',
    title: 'Personalized Educator Voice Model',
    accent: 'Custom Voice',
    tone: 'Warm & Encouraging',
    langCode: 'en-US',
    pitch: 1.0,
    rate: 1.0,
    gender: 'neutral',
    catchphrases: [
      'Welcome everyone! Let’s master this topic together today.',
      'Great focus and dedication! Keep pushing forward.',
      'Feel free to pause and ask me any question at any moment.'
    ],
    bio: 'Custom configured voice persona mirroring your natural accent, vocal cadence, and personalized educational tone.'
  }
];

const ACTIVE_VOICE_KEY = 'ilearnit_active_educator_voice_v1';
const INTERACTIONS_KEY = 'ilearnit_educator_interactions_v1';

// Initial sample student interactions
const SEED_INTERACTIONS: StudentInteractionRecord[] = [
  {
    id: 'int-01',
    timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    studentId: 'st-101',
    studentName: 'Alex Chen',
    moduleName: 'JSS Mathematics',
    topicTitle: 'Algebraic Linear Equations',
    questionText: 'Why do we change the sign when moving a term across the equality sign?',
    educatorResponse: 'Great question Alex! Remember, moving a term is simply subtracting or adding the same quantity from both sides of the balance scale to maintain perfect mathematical equilibrium.',
    status: 'ANSWERED',
    comprehensionRating: 5,
  },
  {
    id: 'int-02',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    studentId: 'st-102',
    studentName: 'Zainab Bello',
    moduleName: 'Cybersecurity Lab',
    topicTitle: 'Symmetric vs Asymmetric Encryption',
    questionText: 'Is AES-256 considered symmetric or asymmetric, and why is RSA slower?',
    educatorResponse: 'AES-256 is symmetric because both parties share the exact same key. RSA is asymmetric and slower because it relies on heavy mathematical prime factorization calculations.',
    status: 'ANSWERED',
    comprehensionRating: 5,
  }
];

// Get current active voice persona
export function getActiveEducatorVoice(): VoicePersona {
  try {
    const stored = localStorage.getItem(ACTIVE_VOICE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load active voice from localStorage', e);
  }
  return PRESET_VOICE_PERSONAS[0];
}

// Save active voice persona
export function saveActiveEducatorVoice(persona: VoicePersona): void {
  try {
    localStorage.setItem(ACTIVE_VOICE_KEY, JSON.stringify(persona));
  } catch (e) {
    console.warn('Failed to save active voice', e);
  }
}

// Get student-educator interaction history
export function getEducatorInteractions(): StudentInteractionRecord[] {
  try {
    const stored = localStorage.getItem(INTERACTIONS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load interactions from localStorage', e);
  }
  return SEED_INTERACTIONS;
}

// Add a student interaction question and auto-generate educator response
export function recordStudentInteraction(
  studentName: string,
  moduleName: string,
  topicTitle: string,
  questionText: string,
  customResponse?: string
): StudentInteractionRecord {
  const interactions = getEducatorInteractions();
  const activeVoice = getActiveEducatorVoice();

  // Smart pedagogical response generator based on topic and voice persona
  let generatedAnswer = customResponse;
  if (!generatedAnswer) {
    const prefix = activeVoice.catchphrases[Math.floor(Math.random() * activeVoice.catchphrases.length)];
    generatedAnswer = `${prefix} Regarding your question on "${topicTitle}": Here is how to think about it — always focus on the foundational logic first, verify step by step, and test your understanding with a quick example. You are making wonderful progress!`;
  }

  const newRecord: StudentInteractionRecord = {
    id: `int-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    studentId: 'st-current',
    studentName: studentName || 'Student',
    moduleName,
    topicTitle,
    questionText,
    educatorResponse: generatedAnswer,
    status: 'ANSWERED',
    comprehensionRating: 5,
    audioFeedbackAvailable: true,
  };

  const updated = [newRecord, ...interactions.slice(0, 99)];
  try {
    localStorage.setItem(INTERACTIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save interaction record', e);
  }

  return newRecord;
}

// Speech Synthesis Controller Class
class VoiceController {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private isPaused: boolean = false;
  private onBoundaryCallback: ((word: string, charIndex: number) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private onStartCallback: (() => void) | null = null;

  // Clean raw markdown, LaTeX, and special code tokens for natural acoustic narration
  public cleanSpeechText(text: string): string {
    if (!text) return '';
    return text
      .replace(/```[\s\S]*?```/g, ' [Refer to the attached source code and terminal block] ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/#{1,6}\s?/g, '')
      .replace(/[*_~]{1,3}/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/&amp;/g, 'and')
      .replace(/!=/g, ' is not equal to ')
      .replace(/==/g, ' equals ')
      .replace(/<=/g, ' is less than or equal to ')
      .replace(/>=/g, ' is greater than or equal to ')
      .replace(/=>/g, ' implies ')
      .replace(/\^2/g, ' squared ')
      .replace(/\^3/g, ' cubed ')
      .replace(/\^(\d+)/g, ' to the power of $1 ')
      .replace(/sqrt\(([^)]+)\)/g, 'square root of $1')
      .replace(/\+-/g, 'plus or minus')
      .replace(/\n+/g, '. ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  // Speak text with specified persona and speed options
  public speak(
    text: string,
    persona?: VoicePersona,
    options?: {
      rateMultiplier?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onBoundary?: (word: string, charIndex: number) => void;
    }
  ): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this environment');
      return false;
    }

    this.stop();

    const activePersona = persona || getActiveEducatorVoice();
    const cleanText = this.cleanSpeechText(text);
    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Apply voice tuning parameters
    utterance.pitch = activePersona.pitch || 1.0;
    utterance.rate = Math.max(0.6, Math.min(2.0, (activePersona.rate || 0.95) * (options?.rateMultiplier || 1.0)));
    utterance.lang = activePersona.langCode || 'en-NG';

    // Attempt matching system voices by language / accent
    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices && availableVoices.length > 0) {
      // Prioritize exact lang match or regional English (en-NG, en-GB, en-US)
      const exactMatch = availableVoices.find(v => v.lang.toLowerCase() === activePersona.langCode.toLowerCase());
      const regionalMatch = availableVoices.find(v => v.lang.toLowerCase().startsWith(activePersona.langCode.split('-')[0].toLowerCase()));
      const englishMatch = availableVoices.find(v => v.lang.toLowerCase().startsWith('en'));
      
      if (exactMatch) {
        utterance.voice = exactMatch;
      } else if (regionalMatch) {
        utterance.voice = regionalMatch;
      } else if (englishMatch) {
        utterance.voice = englishMatch;
      }
    }

    this.onStartCallback = options?.onStart || null;
    this.onEndCallback = options?.onEnd || null;
    this.onBoundaryCallback = options?.onBoundary || null;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      if (this.onStartCallback) this.onStartCallback();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      if (this.onEndCallback) this.onEndCallback();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error or interrupt', e);
      this.isSpeaking = false;
      this.isPaused = false;
      if (this.onEndCallback) this.onEndCallback();
    };

    utterance.onboundary = (e) => {
      if (this.onBoundaryCallback && e.name === 'word') {
        const word = cleanText.substr(e.charIndex, e.charLength || 6);
        this.onBoundaryCallback(word, e.charIndex);
      }
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  }

  public pause(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      this.isPaused = true;
      this.isSpeaking = false;
    }
  }

  public resume(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      this.isPaused = false;
      this.isSpeaking = true;
    }
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.onStartCallback = null;
      this.onEndCallback = null;
      this.onBoundaryCallback = null;
      this.isSpeaking = false;
      this.isPaused = false;
      window.speechSynthesis.cancel();
    }
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }

  public getPausedState(): boolean {
    return this.isPaused;
  }
}

export const speechEngine = new VoiceController();

export function playRecordedVoiceGreeting(onStart?: () => void, onEnd?: () => void): void {
  const recordedPersona = PRESET_VOICE_PERSONAS.find(p => p.id === 'voice-recorded-guide') || PRESET_VOICE_PERSONAS[0];
  speechEngine.speak(
    RECORDED_VOICE_GREETING,
    recordedPersona,
    {
      rateMultiplier: 0.95,
      onStart,
      onEnd,
    }
  );
}

export function speakEducatorMessage(
  text: string,
  personaId?: string,
  onEnd?: () => void,
  onStart?: () => void
): boolean {
  const persona = PRESET_VOICE_PERSONAS.find(p => p.id === personaId) || 
    PRESET_VOICE_PERSONAS.find(p => p.id === 'voice-recorded-guide') || 
    getActiveEducatorVoice();
  return speechEngine.speak(text, persona, { onStart, onEnd });
}

export function pauseEducatorSpeech(): void {
  speechEngine.pause();
}

export function resumeEducatorSpeech(): void {
  speechEngine.resume();
}

export function stopEducatorSpeech(): void {
  speechEngine.stop();
}

export function isEducatorSpeaking(): boolean {
  return speechEngine.getSpeakingState();
}

export function isEducatorPaused(): boolean {
  return speechEngine.getPausedState();
}
