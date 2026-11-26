export type UserRole = 
  | 'hub' 
  | 'login' 
  | 'register' 
  | 'student' 
  | 'study_hub' 
  | 'teacher' 
  | 'parent' 
  | 'jss_math' 
  | 'cyber_security' 
  | 'cca_music' 
  | 'cbt' 
  | 'results' 
  | 'cgpa' 
  | 'support' 
  | 'admin' 
  | 'cheal_hub' 
  | 'ilearnit_security' 
  | 'deployment'
  | 'backend_dashboard'
  | 'module_responses'
  | 'jamb_driller'
  | 'privacy_center';
export type AppTab = 'workbench' | 'code' | 'vision' | 'notes';
export type DocumentFileType = 'PDF' | 'DOCX' | 'IMG' | 'TXT';

export interface E2EEMessage {
  id: string;
  channelId: string;
  subjectName: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'teacher' | 'system';
  senderAvatar: string;
  plaintext: string;
  ciphertext: string;
  timestamp: string;
  keyFingerprint: string;
  verifiedEducator?: boolean;
  isEndorsedAnswer?: boolean;
  formulaSnippet?: string;
}

export interface StudyFlashcard {
  id: string;
  subjectId: string;
  subjectName: string;
  frontQuestion: string;
  backAnswer: string;
  keyConcept: string;
  formulaOrCode?: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Mastery';
}

export interface StudySubjectChannel {
  id: string;
  name: string;
  code: string;
  leadEducator: string;
  educatorAvatar: string;
  description: string;
  colorTheme: string;
  activeLearnersCount: number;
  encryptionFingerprint: string;
}

export interface RegisteredUser {
  id: string;
  studentId: string;
  pin: string;
  recoveryKey: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent';
  avatar: string;
  gradeLevel: string;
  gpa: number;
  attendance: string;
  streakDays: number;
  schoolName?: string;
  phone?: string;
  parentName?: string;
  parentPhone?: string;
  teachingSubject?: string;
  staffId?: string;
  relationship?: string;
  linkedChildName?: string;
  linkedChildPin?: string;
  studyGoal?: string;
  registrationTimestamp: string;
  securityVerified: boolean;
  conductRemarks?: string;
  ageBracket?: 'under_13' | '13_to_17' | 'adult';
  parentalConsentVerified?: boolean;
  parentalConsentEmail?: string;
  parentalConsentTimestamp?: string;
  consentCode?: string;
  subjects: { name: string; score: number; letter: string }[];
  termPerformance?: { term: string; gpa: number; position: string; totalScore: number }[];
}

export interface SecurityAuditRecord {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'REGISTRATION_COMPLETED' | 'PIN_GENERATED' | 'USER_LOGIN' | 'PASSWORD_SET' | 'RECORD_UPDATED';
  details: string;
  ipMask: string;
  status: 'SUCCESS' | 'FLAGGED';
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  template?: string;
  prompt?: string;
  systemInstruction?: string;
  temperature?: number;
  category: string;
}

export interface PromptHistoryItem {
  id: string;
  prompt: string;
  response: string;
  systemInstruction?: string;
  durationMs?: number;
  timestamp: string;
  model: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  tags: string[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  instructor: string;
  progress: number;
  grade: string;
  color: string; // Tailwind color class or hex
  schedule: string;
  nextAssignment: string;
  nextDueDate: string;
  totalModules: number;
  completedModules: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  maxScore?: number;
  feedback?: string;
  category: 'Homework' | 'Project' | 'Quiz' | 'Exam';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ClassGroup {
  id: string;
  code: string;
  name: string;
  studentsCount: number;
  avgGrade: string;
  pendingGrading: number;
  schedule: string;
  recentTopic: string;
}

export interface StudentDetail {
  id: string;
  pin: string;
  studentId: string;
  name: string;
  avatar: string;
  gradeLevel: string;
  gpa: number;
  attendance: string;
  streakDays: number;
  parentName?: string;
  conductRemarks?: string;
  ageBracket?: 'under_13' | '13_to_17' | 'adult';
  parentalConsentVerified?: boolean;
  parentalConsentEmail?: string;
  consentCode?: string;
  subjects: { name: string; score: number; letter: string; teacher?: string }[];
  termPerformance?: { term: string; gpa: number; position: string; totalScore: number }[];
}

export interface TeacherNote {
  id: string;
  date: string;
  author: string;
  subject: string;
  message: string;
  read: boolean;
}

export type AnnouncementPriority = 'low' | 'medium' | 'high' | 'urgent';
export type AnnouncementCategory = 'Academic' | 'Examination' | 'Assignments' | 'Campus' | 'General' | 'STEM & Coding' | 'Music & Arts';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  author: string;
  authorRole: string;
  authorAvatar?: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  targetAudience: string;
  timestamp: string;
  createdAt: number;
  isPinned?: boolean;
  actionLink?: {
    label: string;
    targetTab?: string;
    targetRole?: UserRole;
  };
  readBy: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export type JSSLevel = 'JSS1' | 'JSS2' | 'JSS3';

export interface WorkedExample {
  problem: string;
  solution: string;
}

export interface PracticeQuestionItem {
  question: string;
  answer: string;
  hint?: string;
}

export interface WeeklyLessonBreakdown {
  term: 1 | 2 | 3;
  weekNumber: number;
  weekTitle: string;
  focusSubtopics: string[];
  weeklyObjective: string;
  teachingActivities: string[];
  weeklyAssignment: string;
  status?: 'completed' | 'current' | 'upcoming';
}

export interface JSSLessonTopic {
  id: string;
  file: string;
  title: string;
  level: JSSLevel;
  term?: number;
  recommendedWeek?: number;
  iconName?: string;
  summary: string;
  keyFormulas: string[];
  workedExamples: WorkedExample[];
  teacherGuide: string;
  practiceQuestions: PracticeQuestionItem[];
  weeklySchedule?: WeeklyLessonBreakdown[];
}

export type CyberSecurityLevel = 
  | 'level1_fundamentals' 
  | 'level2_network_defense' 
  | 'level3_ethical_hacking' 
  | 'level4_cloud_incident_response';

export interface CyberTestQuestion {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
  outlineReference: string;
}

export interface CyberGradeTest {
  testId: string;
  title: string;
  totalQuestions: 10;
  passingScore: number;
  timeLimitMinutes: number;
  questions: CyberTestQuestion[];
}

export interface RevisedLessonSection {
  heading: string;
  subheading?: string;
  content: string;
  bulletPoints?: string[];
  proTip?: string;
  keyTerms?: { term: string; definition: string }[];
  codeOrCommand?: string;
}

export interface RealWorldCaseStudy {
  title: string;
  year: string;
  target: string;
  attackVector: string;
  impact: string;
  lessonLearned: string;
}

export interface RevisedLessonNotes {
  topicSummary: string;
  detailedSections: RevisedLessonSection[];
  realWorldCaseStudy?: RealWorldCaseStudy;
  examCramChecklist: string[];
  memoryMnemonics?: string[];
}

export interface CyberWeeklyLesson {
  weekNumber: number;
  weekTitle: string;
  weeklyObjective: string;
  focusSubtopics: string[];
  handsOnActivity: string;
  outlineSourceNotes: string;
  revisedNotes?: RevisedLessonNotes;
  keyTakeaways: string[];
  gradeLevelTest: CyberGradeTest;
  status?: 'completed' | 'current' | 'upcoming';
}

export interface CyberLessonCourse {
  id: string;
  code: string;
  title: string;
  level: CyberSecurityLevel;
  levelLabel: string;
  targetAudience: string;
  badgeTitle: string;
  durationWeeks: number;
  summary: string;
  keyStandards: string[];
  practicalLabTitle: string;
  practicalLabGuide: string;
  weeklySchedule: CyberWeeklyLesson[];
}

export interface StudentCyberTestResult {
  testId: string;
  courseId: string;
  courseTitle: string;
  weekNumber: number;
  weekTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  timestamp: string;
  studentName: string;
  answers: Record<number, number>;
}

// -------------------------------------------------------------
// UNIVERSAL iLEARNIT-365 CBT ENGINE & INTERFACE TYPES
// -------------------------------------------------------------

export type CBTGradeLevel = 
  | 'Primary' 
  | 'JSS1' 
  | 'JSS2' 
  | 'JSS3' 
  | 'SSS1' 
  | 'SSS2' 
  | 'SSS3' 
  | 'Cyber_Level_1' 
  | 'Cyber_Level_2' 
  | 'Cyber_Level_3' 
  | 'Cyber_Level_4' 
  | 'Tertiary';

export type CBTSubjectCategory = 
  | 'Cybersecurity & Computing'
  | 'Mathematics'
  | 'Cultural & Creative Arts (CCA Music)'
  | 'Basic Science & Technology'
  | 'English & Communication'
  | 'Civic & Social Studies'
  | 'Business Studies'
  | 'Agricultural Science';

export type CBTQuestionDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Mastery';
export type CBTTaxonomyLevel = 'Recall' | 'Comprehension' | 'Application' | 'Analysis' | 'Evaluation';

export interface CBTQuestion {
  id: string;
  subjectId: string;
  topic: string;
  difficulty: CBTQuestionDifficulty;
  taxonomy: CBTTaxonomyLevel;
  marks: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  syllabusReference: string;
  codeSnippet?: string;
  imageUrl?: string;
  hint?: string;
}

export interface CBTExamConfig {
  id: string;
  title: string;
  code: string;
  level: CBTGradeLevel;
  subject: string;
  category: CBTSubjectCategory;
  term?: number;
  durationMinutes: number;
  totalQuestions: number;
  passingPercentage: number;
  allowCalculator: boolean;
  enableAntiCheatProctoring: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  instructions: string[];
  revisedNotesBrief?: string;
  questions: CBTQuestion[];
}

export interface CBTSessionAnswer {
  questionId: string;
  selectedOptionIndex: number | null;
  isFlaggedForReview: boolean;
  timeSpentSeconds: number;
}

export interface CBTInfractionEvent {
  timestamp: string;
  type: 'tab_switch' | 'window_blur' | 'fullscreen_exit' | 'copy_paste_attempt' | 'inspect_attempt';
  details: string;
}

export interface CBTScoreBreakdown {
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  passed: boolean;
  accuracyByTopic: Record<string, { correct: number; total: number; percent: number }>;
  accuracyByDifficulty: Record<CBTQuestionDifficulty, { correct: number; total: number; percent: number }>;
  accuracyByTaxonomy: Record<CBTTaxonomyLevel, { correct: number; total: number; percent: number }>;
  averageTimePerQuestionSec: number;
  infractionCount: number;
}

export interface CBTResultSlip {
  verificationId: string;
  examId: string;
  examTitle: string;
  examCode: string;
  subject: string;
  level: CBTGradeLevel;
  candidateName: string;
  candidateId: string;
  candidateClass: string;
  completedAt: string;
  timeUsedSeconds: number;
  totalAllowedSeconds: number;
  breakdown: CBTScoreBreakdown;
  userAnswers: Record<string, number | null>;
  flaggedQuestionIds: string[];
  questionBank: CBTQuestion[];
}

export interface DocumentCallout {
  type: 'info' | 'warning' | 'tip' | 'formula' | 'code';
  title: string;
  body: string;
}

export interface DocumentSection {
  id: string;
  heading: string;
  content: string;
  callout?: DocumentCallout;
  diagramSnippet?: string;
  codeExample?: {
    language: string;
    code: string;
    output?: string;
  };
}

export interface DocumentKeyTerm {
  term: string;
  definition: string;
}

export interface DocumentQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface EducationalDocument {
  id: string;
  title: string;
  subtitle: string;
  subjectId: string;
  subjectName: string;
  courseCode: string;
  fileType?: DocumentFileType;
  category: 'Textbook Chapter' | 'Revision Monograph' | 'Lab Manual' | 'Curriculum Guide' | 'Formula Sheet' | 'Examination Syllabus';
  author: string;
  authorTitle: string;
  authorAvatar?: string;
  readingTimeMinutes: number;
  gradeLevel: string;
  publishedDate: string;
  tags: string[];
  summary: string;
  sections: DocumentSection[];
  keyTerms: DocumentKeyTerm[];
  comprehensionQuiz: DocumentQuizQuestion[];
}

export type HighlightColor = 'yellow' | 'emerald' | 'cyan' | 'pink' | 'amber';

export interface DocumentAnnotation {
  id: string;
  docId: string;
  sectionId: string;
  sectionHeading: string;
  selectedText: string;
  comment: string;
  color: HighlightColor;
  timestamp: string;
  createdAt: number;
}

// -------------------------------------------------------------
// JAMB UTME COMPILED SCHEME & 2000-2025 PAST QUESTIONS
// -------------------------------------------------------------

export type JAMBStream = 'Core' | 'Science' | 'Arts & Humanities' | 'Commercial';

export interface JAMBSyllabusTopic {
  topicNumber: number;
  title: string;
  subtopics: string[];
  learningObjectives: string[];
  nerdcAlignment: string;
}

export interface JAMBSubjectScheme {
  id: string;
  name: string;
  code: string;
  stream: JAMBStream;
  isCompulsory?: boolean;
  overview: string;
  recommendedTexts: string[];
  topics: JAMBSyllabusTopic[];
}

export interface JAMBPastQuestion {
  id: string;
  subjectId: string;
  subjectName: string;
  stream: JAMBStream;
  year: number; // 2000 - 2025
  topic: string;
  syllabusReference: string;
  questionText: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  difficulty: 'Foundation' | 'Standard' | 'Challenging';
}

// -------------------------------------------------------------
// AI TRANSPARENCY & EDUCATOR REVIEW / OVERRIDE
// -------------------------------------------------------------

export interface AIOutputRecord {
  id: string;
  contextKey: string;
  sourceFeature: 'AI Study Tutor' | 'Quiz Diagnostic' | 'JAMB AI Breakdown' | 'AI Lesson Architect' | 'AI Parent Advisor';
  subject: string;
  promptSummary: string;
  aiResponse: string;
  modelUsed: string;
  methodology: string;
  groundingSources: string[];
  createdAt: string;
  createdByUser: string;
  reviewStatus: 'pending_review' | 'approved' | 'overridden' | 'flagged';
  teacherOverrideText?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
}


