export type UserRole = 'hub' | 'login' | 'student' | 'teacher' | 'parent' | 'jss_math';
export type AppTab = 'workbench' | 'code' | 'vision' | 'notes';

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
  subjects: { name: string; score: number; letter: string }[];
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
