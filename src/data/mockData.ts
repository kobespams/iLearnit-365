import { Course, Assignment, ClassGroup, StudentDetail, TeacherNote, QuizQuestion, Announcement } from '../types';
import { getRegisteredStudents, getRegisteredUsers, userToStudentDetail } from '../services/authStorage';

export const INITIAL_STUDENT_COURSES: Course[] = [
  {
    id: 'cs101',
    code: 'CS-301',
    title: 'Cybersecurity Defense & Incident Response',
    instructor: 'Prof. Kalu Ndubuisi',
    progress: 92,
    grade: 'A+',
    color: '#2F6FE0',
    schedule: 'Mon / Wed 10:00 AM',
    nextAssignment: 'Network Packet Sniffing & AES-GCM Analysis',
    nextDueDate: 'Tomorrow, 11:59 PM',
    totalModules: 12,
    completedModules: 11,
  },
  {
    id: 'math201',
    code: 'MATH-402',
    title: 'JSS Mathematics & Algebraic Equations',
    instructor: 'Dr. Folashade Adeleke',
    progress: 95,
    grade: 'A+',
    color: '#2E9B58',
    schedule: 'Tue / Thu 09:15 AM',
    nextAssignment: 'Quadratic Factorization & Angle Theorems',
    nextDueDate: 'Aug 12, 5:00 PM',
    totalModules: 10,
    completedModules: 9,
  },
  {
    id: 'cca101',
    code: 'CCA-201',
    title: 'Cultural & Creative Arts (CCA Music & Arts)',
    instructor: 'Mrs. Clara Thorne-Peters',
    progress: 89,
    grade: 'A',
    color: '#CC9A2E',
    schedule: 'Mon / Wed 01:30 PM',
    nextAssignment: 'African Organology & Musical Scales Recital',
    nextDueDate: 'Aug 14, 11:59 PM',
    totalModules: 14,
    completedModules: 12,
  },
  {
    id: 'lit301',
    code: 'ENG-305',
    title: 'English Language & Scientific Communication',
    instructor: 'Dr. Sarah Jenkins',
    progress: 88,
    grade: 'A-',
    color: '#132C54',
    schedule: 'Friday 11:00 AM',
    nextAssignment: 'Technical Case Study Synthesis',
    nextDueDate: 'Aug 18, 5:00 PM',
    totalModules: 8,
    completedModules: 7,
  },
  {
    id: 'calc301',
    code: 'CALC-301',
    title: 'Differential & Integral Calculus',
    instructor: 'Dr. Samuel Adeyemi',
    progress: 85,
    grade: 'A',
    color: '#7C3AED',
    schedule: 'Tue / Thu 11:30 AM',
    nextAssignment: 'Derivatives from First Principles & Chain Rule Drills',
    nextDueDate: 'Aug 16, 5:00 PM',
    totalModules: 12,
    completedModules: 10,
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1',
    courseId: 'cs101',
    courseTitle: 'Cybersecurity Defense',
    title: 'Zero-Trust Architecture & Cryptographic Key Exchange',
    dueDate: 'Tomorrow, 11:59 PM',
    status: 'pending',
    category: 'Homework',
    maxScore: 100,
  },
  {
    id: 'a2',
    courseId: 'math201',
    courseTitle: 'Mathematics',
    title: 'Algebraic Word Problems & Quadratic Equations',
    dueDate: 'Aug 12, 5:00 PM',
    status: 'pending',
    category: 'Quiz',
    maxScore: 50,
  },
  {
    id: 'a-calc',
    courseId: 'calc301',
    courseTitle: 'Calculus',
    title: 'Chain Rule Derivatives & Riemann Sum Integration',
    dueDate: 'Aug 16, 5:00 PM',
    status: 'pending',
    category: 'Homework',
    maxScore: 100,
  },
  {
    id: 'a3',
    courseId: 'cca101',
    courseTitle: 'Cultural & Creative Arts',
    title: 'Tuning Fork Vibrations & African Idiophone Project',
    dueDate: 'Aug 05, 2026',
    status: 'graded',
    score: 95,
    maxScore: 100,
    feedback: 'Phenomenal acoustic analysis and organology classification table.',
    category: 'Homework',
  },
  {
    id: 'a4',
    courseId: 'cs101',
    courseTitle: 'Cybersecurity Defense',
    title: 'Universal CBT Midterm Exam',
    dueDate: 'Jul 28, 2026',
    status: 'graded',
    score: 98,
    maxScore: 100,
    feedback: 'Top score in the state. Clear understanding of firewall rule sets and threat vectors.',
    category: 'Exam',
  },
];

export const INITIAL_CLASSES: ClassGroup[] = [
  {
    id: 'c1',
    code: 'CS-301',
    name: 'Cybersecurity & Computing Defense (JSS3 Alpha)',
    studentsCount: 28,
    avgGrade: '92.4%',
    pendingGrading: 3,
    schedule: 'Mon/Wed 10:00 AM',
    recentTopic: 'Symmetric vs Asymmetric Encryption & Threat Mitigation',
  },
  {
    id: 'c2',
    code: 'MATH-201',
    name: 'JSS Mathematics & Algebraic Reasoning (JSS2 Beta)',
    studentsCount: 32,
    avgGrade: '94.2%',
    pendingGrading: 6,
    schedule: 'Tue/Thu 11:30 AM',
    recentTopic: 'Simultaneous Linear Equations & Practical Word Problems',
  },
  {
    id: 'c3',
    code: 'CCA-101',
    name: 'Cultural & Creative Arts (JSS1 Gamma)',
    studentsCount: 24,
    avgGrade: '91.8%',
    pendingGrading: 2,
    schedule: 'Mon/Wed/Fri 01:15 PM',
    recentTopic: 'Solfa Notation, Musical Intervals & Traditional Instruments',
  },
];

/**
 * Returns dynamic registered students list populated from real users
 */
export function getLiveRegisteredStudents(): StudentDetail[] {
  return getRegisteredStudents();
}

export const SAMPLE_STUDENTS: StudentDetail[] = getRegisteredStudents();

export const CURRENT_STUDENT_PROFILE: StudentDetail = getRegisteredStudents()[0] || {
  id: 'USR-2026-001',
  pin: '8842',
  studentId: 'i365-STU-8842',
  name: 'Samuel Adebayo',
  parentName: 'Engr. Daniel Adebayo',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  gradeLevel: 'JSS3 - Senior Secondary Prep',
  gpa: 3.94,
  attendance: '98.5%',
  streakDays: 14,
  conductRemarks: 'Exemplary academic discipline and leadership. Fast-paced problem solver in Cybersecurity and Mathematics.',
  subjects: [
    { name: 'Cybersecurity Defense', score: 98, letter: 'A+' },
    { name: 'JSS Mathematics', score: 95, letter: 'A+' },
    { name: 'Computer Science', score: 94, letter: 'A' },
    { name: 'Cultural & Creative Arts (CCA Music)', score: 91, letter: 'A-' },
    { name: 'Integrated Science', score: 89, letter: 'B+' },
  ],
  termPerformance: [
    { term: 'Term 1 2026', gpa: 3.88, position: '1st in Class', totalScore: 369 },
    { term: 'Term 2 2026', gpa: 3.92, position: '1st in Class', totalScore: 374 },
    { term: 'Term 3 2026', gpa: 3.94, position: '1st in Class', totalScore: 380 },
  ],
};

export function getStudentByPin(inputPin: string): StudentDetail | undefined {
  const clean = inputPin.trim().replace(/^STU-/, '');
  const allStudents = getRegisteredStudents();
  return allStudents.find(s => s.pin === clean || s.studentId.includes(clean));
}

export const INITIAL_TEACHER_NOTES: TeacherNote[] = [
  {
    id: 'n1',
    date: 'Aug 07, 2026',
    author: 'Dr. Sarah Jenkins (Computer Science)',
    subject: 'Alex’s Outstanding Leadership in Team Hackathon',
    message: 'Alex demonstrated exceptional mastery during our graph traversal coding lab, helping peer teammates debug recursion stack issues. Keep up the phenomenal work!',
    read: false,
  },
  {
    id: 'n2',
    date: 'Jul 30, 2026',
    author: 'Dr. Elena Rostova (Physics II)',
    subject: 'Mid-Quarter Academic Update',
    message: 'Alex scored 94% on the Faraday Law problem set. Strong analytical focus. Ready for next week’s optics unit.',
    read: true,
  },
];

export const SAMPLE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the worst-case time complexity of searching in a balanced Binary Search Tree (AVL / Red-Black)?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 1,
    explanation: 'A balanced BST guarantees a height bounded by O(log n), so search, insertion, and deletion operations take O(log n) time.',
  },
  {
    id: 2,
    question: 'In Calculus, what does the derivative of position with respect to time represent?',
    options: ['Acceleration', 'Jerk', 'Velocity', 'Displacement'],
    correctAnswer: 2,
    explanation: 'Velocity v(t) is defined as the rate of change of position s(t) over time, i.e., v(t) = ds/dt.',
  },
  {
    id: 3,
    question: 'Which of Maxwell’s equations states that magnetic monopoles do not exist?',
    options: ['Gauss’s Law for Magnetism', 'Faraday’s Law', 'Ampère’s Law', 'Gauss’s Law for Electricity'],
    correctAnswer: 0,
    explanation: 'Gauss’s Law for Magnetism states ∇·B = 0, meaning magnetic field lines always form closed loops and isolated monopoles have never been observed.',
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: '🚨 BECE & Midterm Examination Timetable Published - CBT Ready',
    message: 'The official Term 3 Assessment schedule is now active. Students in JSS1–JSS3 and Senior Secondary can start practicing with the Universal AI-Powered CBT Exam Suite. Review test timers and practice with 10-question standardized drills.',
    author: 'Dr. Sarah Jenkins',
    authorRole: 'Academic Dean & CS Department Chair',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    category: 'Examination',
    priority: 'urgent',
    targetAudience: 'All Students (JSS1 - SS3)',
    timestamp: 'Today, 08:30 AM',
    createdAt: Date.now() - 1000 * 60 * 45, // 45 mins ago
    isPinned: true,
    actionLink: {
      label: 'Open CBT Exam Suite',
      targetRole: 'cbt',
    },
    readBy: [],
  },
  {
    id: 'ann-2',
    title: '📐 JSS Mathematics Week 4 Problem Sets & Diagnostic Notes Released',
    message: 'New step-by-step worked examples on Fractions, Percentages, and Algebraic Equations have been uploaded to the JSS Math Syllabus Hub. Complete practice drills before the Friday mock assessment.',
    author: 'Prof. Michael Vance',
    authorRole: 'Senior Mathematics Instructor',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    category: 'Academic',
    priority: 'high',
    targetAudience: 'JSS1, JSS2, JSS3 Students',
    timestamp: 'Yesterday, 04:15 PM',
    createdAt: Date.now() - 1000 * 60 * 60 * 18,
    isPinned: true,
    actionLink: {
      label: 'Explore JSS Math Syllabus',
      targetRole: 'jss_math',
    },
    readBy: [],
  },
  {
    id: 'ann-3',
    title: '🛡️ National Secondary Cyber Defense Challenge 2026: Team Registration',
    message: 'Interested students in Grades 9–12 are invited to register for the upcoming Cyber Threat Intelligence & Network Defense scrimmage. Complete the Level 1 & Level 2 modules in the Cybersecurity Academy to qualify.',
    author: 'Engr. Daniel Osei',
    authorRole: 'Cybersecurity Defense Lead',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    category: 'STEM & Coding',
    priority: 'medium',
    targetAudience: 'Secondary Students',
    timestamp: 'Aug 14, 2026',
    createdAt: Date.now() - 1000 * 60 * 60 * 36,
    actionLink: {
      label: 'Open Cyber Academy',
      targetRole: 'cyber_security',
    },
    readBy: ['st-101'],
  },
  {
    id: 'ann-4',
    title: '🎵 CCA Music: Solfa Notation & African Organology Recital Submission',
    message: 'Cultural & Creative Arts students must submit their musical scales analysis and traditional idiophone/membranophone classification reports by 11:59 PM this Friday.',
    author: 'Mrs. Clara Thorne',
    authorRole: 'Creative Arts & Music Coordinator',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    category: 'Music & Arts',
    priority: 'medium',
    targetAudience: 'JSS1 - JSS3 CCA Students',
    timestamp: 'Aug 13, 2026',
    createdAt: Date.now() - 1000 * 60 * 60 * 60,
    readBy: ['st-101'],
  },
  {
    id: 'ann-5',
    title: '🏫 Annual STEM & AI Innovation Exhibition — Call for Projects',
    message: 'Submissions for the 2026 Science and Technology Expo are now accepted! Present your AI study bots, robotics prototypes, and mathematical modeling projects at the Main Auditorium.',
    author: 'Principal Academic Office',
    authorRole: 'School Administration',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    category: 'Campus',
    priority: 'low',
    targetAudience: 'All Staff, Students & Parents',
    timestamp: 'Aug 11, 2026',
    createdAt: Date.now() - 1000 * 60 * 60 * 96,
    readBy: ['st-101'],
  },
];
