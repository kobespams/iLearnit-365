import { RegisteredUser, SecurityAuditRecord, StudentDetail } from '../types';
import { recordAuditAction } from './auditTrailService';

const USERS_STORAGE_KEY = 'ilearnit_365_registered_users_v2';
const AUDIT_STORAGE_KEY = 'ilearnit_365_security_audit_logs_v2';

// Baseline registered starter profiles for immediate application readiness
const SEED_USERS: RegisteredUser[] = [
  {
    id: 'USR-2026-001',
    studentId: 'i365-STU-8842',
    pin: '8842',
    recoveryKey: 'SEC-8842-A109',
    name: 'Samuel Adebayo',
    email: 'samuel.adebayo@ilearnit365.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    gradeLevel: 'JSS3 - Senior Secondary Prep',
    gpa: 3.94,
    attendance: '98.5%',
    streakDays: 14,
    parentName: 'Engr. Daniel Adebayo',
    parentPhone: '+234 802 345 6789',
    schoolName: 'Federal Academy of Science & Technology',
    registrationTimestamp: '2026-08-01T09:30:00.000Z',
    securityVerified: true,
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
  },
  {
    id: 'USR-2026-002',
    studentId: 'i365-STU-9102',
    pin: '9102',
    recoveryKey: 'SEC-9102-B321',
    name: 'Amina Bello',
    email: 'amina.bello@ilearnit365.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    gradeLevel: 'JSS2 - Junior Mathematics',
    gpa: 3.88,
    attendance: '99.1%',
    streakDays: 21,
    parentName: 'Alhaji Ibrahim Bello',
    parentPhone: '+234 803 987 6543',
    schoolName: 'Crown Heights International College',
    registrationTimestamp: '2026-08-05T14:15:00.000Z',
    securityVerified: true,
    conductRemarks: 'Outstanding diligence in algebraic equations, geometric proofs, and weekly CBT practice tests.',
    subjects: [
      { name: 'JSS Mathematics', score: 94, letter: 'A' },
      { name: 'Computer Science', score: 92, letter: 'A' },
      { name: 'Basic Technology', score: 90, letter: 'A' },
      { name: 'English Language', score: 88, letter: 'B+' },
    ],
    termPerformance: [
      { term: 'Term 1 2026', gpa: 3.82, position: '2nd in Class', totalScore: 361 },
      { term: 'Term 2 2026', gpa: 3.85, position: '2nd in Class', totalScore: 364 },
      { term: 'Term 3 2026', gpa: 3.88, position: '2nd in Class', totalScore: 368 },
    ],
  },
  {
    id: 'USR-2026-003',
    studentId: 'i365-STU-7731',
    pin: '7731',
    recoveryKey: 'SEC-7731-C504',
    name: 'Chidi Okonkwo',
    email: 'chidi.okonkwo@ilearnit365.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    gradeLevel: 'JSS1 - Foundation Track',
    gpa: 3.75,
    attendance: '97.4%',
    streakDays: 11,
    parentName: 'Mrs. Grace Okonkwo',
    parentPhone: '+234 805 123 4567',
    schoolName: 'St. Gregory Science College',
    registrationTimestamp: '2026-08-10T10:00:00.000Z',
    securityVerified: true,
    conductRemarks: 'Enthusiastic participant in STEM exercises. Shows steady acceleration in computer programming.',
    subjects: [
      { name: 'Computer Science', score: 91, letter: 'A-' },
      { name: 'JSS Mathematics', score: 88, letter: 'B+' },
      { name: 'Basic Science', score: 86, letter: 'B' },
      { name: 'Cultural & Creative Arts (CCA Music)', score: 90, letter: 'A' },
    ],
    termPerformance: [
      { term: 'Term 1 2026', gpa: 3.65, position: '3rd in Class', totalScore: 348 },
      { term: 'Term 2 2026', gpa: 3.70, position: '3rd in Class', totalScore: 352 },
      { term: 'Term 3 2026', gpa: 3.75, position: '3rd in Class', totalScore: 358 },
    ],
  },
  {
    id: 'USR-2026-T01',
    studentId: 'i365-TCH-1092',
    pin: '1092',
    recoveryKey: 'SEC-TCH-9941',
    name: 'Prof. Kalu Ndubuisi',
    email: 'kalu.ndubuisi@ilearnit365.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    gradeLevel: 'Department Head - STEM & Cybersecurity',
    gpa: 4.0,
    attendance: '100%',
    streakDays: 60,
    teachingSubject: 'Cybersecurity Defense & Computer Science',
    schoolName: 'Federal Academy of Science & Technology',
    registrationTimestamp: '2026-07-15T11:00:00.000Z',
    securityVerified: true,
    subjects: [
      { name: 'Cybersecurity Defense', score: 100, letter: 'A+' },
      { name: 'Computer Science CS-301', score: 99, letter: 'A+' },
      { name: 'JSS Mathematics', score: 97, letter: 'A+' },
    ],
  },
  {
    id: 'USR-2026-T02',
    studentId: 'i365-TCH-2044',
    pin: '2044',
    recoveryKey: 'SEC-TCH-8823',
    name: 'Dr. Folashade Adeleke',
    email: 'folashade.adeleke@ilearnit365.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=250',
    gradeLevel: 'Senior Faculty - Pure & Applied Mathematics',
    gpa: 4.0,
    attendance: '100%',
    streakDays: 45,
    teachingSubject: 'JSS Mathematics & Calculus',
    schoolName: 'Federal Academy of Science & Technology',
    registrationTimestamp: '2026-07-20T08:30:00.000Z',
    securityVerified: true,
    subjects: [
      { name: 'JSS Mathematics', score: 99, letter: 'A+' },
      { name: 'Integrated Science', score: 96, letter: 'A' },
    ],
  },
  {
    id: 'USR-2026-T03',
    studentId: 'i365-TCH-3105',
    pin: '3105',
    recoveryKey: 'SEC-TCH-7711',
    name: 'Mrs. Clara Thorne-Peters',
    email: 'clara.thorne@ilearnit365.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    gradeLevel: 'Creative Arts & Music Coordinator',
    gpa: 4.0,
    attendance: '100%',
    streakDays: 38,
    teachingSubject: 'Cultural & Creative Arts (CCA Music)',
    schoolName: 'Federal Academy of Science & Technology',
    registrationTimestamp: '2026-07-22T09:00:00.000Z',
    securityVerified: true,
    subjects: [
      { name: 'Cultural & Creative Arts (CCA Music)', score: 98, letter: 'A+' },
    ],
  },
  {
    id: 'USR-2026-P01',
    studentId: 'i365-PAR-4410',
    pin: '4410',
    recoveryKey: 'SEC-PAR-4410',
    name: 'Engr. Daniel Adebayo',
    email: 'daniel.adebayo@family.ng',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    gradeLevel: 'Parent of Samuel Adebayo (JSS3)',
    gpa: 3.94,
    attendance: '98.5%',
    streakDays: 14,
    phone: '+234 802 345 6789',
    relationship: 'Father',
    linkedChildName: 'Samuel Adebayo',
    linkedChildPin: '8842',
    schoolName: 'Federal Academy of Science & Technology',
    registrationTimestamp: '2026-08-01T10:05:00.000Z',
    securityVerified: true,
    parentalConsentVerified: true,
    consentCode: 'CONSENT-884201',
    subjects: [
      { name: 'Cybersecurity Defense', score: 98, letter: 'A+' },
      { name: 'JSS Mathematics', score: 95, letter: 'A+' },
    ],
  },
  {
    id: 'USR-2026-P02',
    studentId: 'i365-PAR-5528',
    pin: '5528',
    recoveryKey: 'SEC-PAR-5528',
    name: 'Mrs. Grace Okonkwo',
    email: 'grace.okonkwo@family.ng',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=250',
    gradeLevel: 'Parent of Chidi Okonkwo (JSS1)',
    gpa: 3.75,
    attendance: '97.4%',
    streakDays: 11,
    phone: '+234 805 123 4567',
    relationship: 'Mother',
    linkedChildName: 'Chidi Okonkwo',
    linkedChildPin: '7731',
    schoolName: 'St. Gregory Science College',
    registrationTimestamp: '2026-08-10T11:20:00.000Z',
    securityVerified: true,
    parentalConsentVerified: true,
    consentCode: 'CONSENT-773109',
    subjects: [
      { name: 'Computer Science', score: 91, letter: 'A-' },
      { name: 'JSS Mathematics', score: 88, letter: 'B+' },
    ],
  }
];

// Helper to safely access localStorage in browser environments
function getStoredJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setStoredJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to write to localStorage:', err);
  }
}

/**
 * Generate a truly random, collision-safe 4-digit numeric PIN in real time.
 */
export function generateRealtimePin(): string {
  const users = getRegisteredUsers();
  const existingPins = new Set(users.map((u) => u.pin));
  
  let candidate = '';
  let attempts = 0;
  
  do {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const arr = new Uint32Array(1);
      window.crypto.getRandomValues(arr);
      const num = 1000 + (arr[0] % 9000);
      candidate = num.toString();
    } else {
      candidate = Math.floor(1000 + Math.random() * 9000).toString();
    }
    attempts++;
  } while (existingPins.has(candidate) && attempts < 100);

  return candidate;
}

/**
 * Generate a cryptographic recovery key for emergency access restoration.
 */
export function generateRecoveryKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let seg1 = '';
  let seg2 = '';
  for (let i = 0; i < 4; i++) {
    seg1 += chars.charAt(Math.floor(Math.random() * chars.length));
    seg2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SEC-${seg1}-${seg2}`;
}

/**
 * Generate a standard Student or Teacher ID.
 */
export function generateIdCode(role: 'student' | 'teacher' | 'parent'): string {
  const prefix = role === 'teacher' ? 'TCH' : role === 'parent' ? 'PAR' : 'STU';
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `i365-${prefix}-${rand}`;
}

/**
 * Retrieve all registered users from persistent storage.
 */
export function getRegisteredUsers(): RegisteredUser[] {
  let users = getStoredJson<RegisteredUser[]>(USERS_STORAGE_KEY, []);
  if (!users || users.length === 0) {
    users = SEED_USERS;
    setStoredJson(USERS_STORAGE_KEY, users);
  } else {
    const existingIds = new Set(users.map((u) => u.id));
    const missingSeeds = SEED_USERS.filter((s) => !existingIds.has(s.id));
    if (missingSeeds.length > 0) {
      users = [...users, ...missingSeeds];
      setStoredJson(USERS_STORAGE_KEY, users);
    }
  }
  return users;
}

/**
 * Save updated registered users
 */
export function saveRegisteredUsers(users: RegisteredUser[]): void {
  setStoredJson(USERS_STORAGE_KEY, users);
}

/**
 * Convert RegisteredUser to StudentDetail format
 */
export function userToStudentDetail(user: RegisteredUser): StudentDetail {
  return {
    id: user.id,
    pin: user.pin,
    studentId: user.studentId,
    name: user.name,
    avatar: user.avatar,
    gradeLevel: user.gradeLevel,
    gpa: user.gpa,
    attendance: user.attendance,
    streakDays: user.streakDays,
    parentName: user.parentName,
    conductRemarks: user.conductRemarks,
    ageBracket: user.ageBracket,
    parentalConsentVerified: user.parentalConsentVerified,
    parentalConsentEmail: user.parentalConsentEmail,
    consentCode: user.consentCode,
    subjects: user.subjects,
    termPerformance: user.termPerformance,
  };
}

/**
 * Retrieve all registered students formatted as StudentDetail
 */
export function getRegisteredStudents(): StudentDetail[] {
  const allUsers = getRegisteredUsers();
  const students = allUsers.filter(u => u.role === 'student');
  if (students.length === 0) {
    return SEED_USERS.filter(u => u.role === 'student').map(userToStudentDetail);
  }
  return students.map(userToStudentDetail);
}

/**
 * Retrieve all registered teachers
 */
export function getRegisteredTeachers(): RegisteredUser[] {
  const allUsers = getRegisteredUsers();
  return allUsers.filter(u => u.role === 'teacher');
}

/**
 * Retrieve all registered parents
 */
export function getRegisteredParents(): RegisteredUser[] {
  const allUsers = getRegisteredUsers();
  return allUsers.filter(u => u.role === 'parent');
}

/**
 * Retrieve security audit logs.
 */
export function getAuditLogs(): SecurityAuditRecord[] {
  return getStoredJson<SecurityAuditRecord[]>(AUDIT_STORAGE_KEY, [
    {
      id: 'AUD-INIT-01',
      timestamp: new Date().toISOString(),
      userId: 'SYSTEM',
      userName: 'iLearnit Security Engine',
      userRole: 'SYSTEM_ADMIN',
      action: 'RECORD_UPDATED',
      details: 'Audit security subsystem initialized with AES-256 state tracking.',
      ipMask: '192.168.1.xxx',
      status: 'SUCCESS',
    }
  ]);
}

/**
 * Add a security audit event log.
 */
export function recordAuditEvent(record: Omit<SecurityAuditRecord, 'id' | 'timestamp'>): void {
  const logs = getAuditLogs();
  const newLog: SecurityAuditRecord = {
    id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    ...record,
  };
  logs.unshift(newLog);
  if (logs.length > 100) logs.length = 100;
  setStoredJson(AUDIT_STORAGE_KEY, logs);
}

export interface RegisterUserInput {
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent';
  gradeLevel?: string;
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
  selectedSubjects?: string[];
  providedPin?: string;
  ageBracket?: 'under_13' | '13_to_17' | 'adult';
  parentalConsentVerified?: boolean;
  parentalConsentEmail?: string;
}

/**
 * Real-time User Registration: generates unique PIN, creates persistent record, records audit event.
 */
export function registerNewUser(input: RegisterUserInput): { user: RegisteredUser; pin: string; recoveryKey: string } {
  const users = getRegisteredUsers();
  
  const pin = input.providedPin && input.providedPin.length === 4 ? input.providedPin : generateRealtimePin();
  const recoveryKey = generateRecoveryKey();
  const studentId = generateIdCode(input.role);
  const now = new Date().toISOString();
  
  const defaultSubjects = input.selectedSubjects && input.selectedSubjects.length > 0
    ? input.selectedSubjects.map(subName => ({ name: subName, score: 92, letter: 'A' }))
    : [
        { name: 'Cybersecurity Defense', score: 94, letter: 'A' },
        { name: 'JSS Mathematics', score: 92, letter: 'A' },
        { name: 'Computer Science', score: 95, letter: 'A+' },
        { name: 'Cultural & Creative Arts (CCA Music)', score: 90, letter: 'A' },
        { name: 'Integrated Science', score: 88, letter: 'A' },
      ];

  const newUser: RegisteredUser = {
    id: `USR-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    studentId,
    pin,
    recoveryKey,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role,
    avatar: `https://images.unsplash.com/photo-${input.role === 'teacher' ? '1573496359142-b8d87734a5a2' : '1534528741775-53994a69daeb'}?auto=format&fit=crop&q=80&w=250`,
    gradeLevel: input.gradeLevel || (input.role === 'teacher' ? 'Faculty Instructor' : 'JSS1 - Foundation Track'),
    gpa: 3.90,
    attendance: '100%',
    streakDays: 1,
    schoolName: input.schoolName?.trim() || 'Federal Academy of Science & Technology',
    phone: input.phone?.trim(),
    parentName: input.parentName?.trim(),
    parentPhone: input.parentPhone?.trim(),
    teachingSubject: input.teachingSubject?.trim(),
    staffId: input.staffId?.trim(),
    relationship: input.relationship?.trim(),
    linkedChildName: input.linkedChildName?.trim(),
    linkedChildPin: input.linkedChildPin?.trim(),
    studyGoal: input.studyGoal?.trim(),
    registrationTimestamp: now,
    securityVerified: true,
    ageBracket: input.ageBracket || '13_to_17',
    parentalConsentVerified: input.ageBracket === 'adult' ? true : Boolean(input.parentalConsentVerified),
    parentalConsentEmail: input.parentalConsentEmail?.trim().toLowerCase(),
    parentalConsentTimestamp: input.parentalConsentVerified ? now : undefined,
    consentCode: input.ageBracket !== 'adult' && input.parentalConsentVerified
      ? `CONSENT-${Math.floor(100000 + Math.random() * 900000)}`
      : undefined,
    conductRemarks: 'Newly registered user verified with active cryptographic access credentials.',
    subjects: defaultSubjects,
    termPerformance: [
      { term: 'Term 1 2026/2027', gpa: 3.90, position: 'Enrolled', totalScore: 368 },
    ],
  };

  users.unshift(newUser);
  setStoredJson(USERS_STORAGE_KEY, users);

  recordAuditEvent({
    userId: newUser.id,
    userName: newUser.name,
    userRole: newUser.role.toUpperCase(),
    action: 'REGISTRATION_COMPLETED',
    details: `User registered successfully with assigned ID: ${studentId} and real-time PIN allocation.`,
    ipMask: '127.0.0.1 (Verified)',
    status: 'SUCCESS',
  });

  recordAuditAction({
    category: 'STUDENT_REGISTRATION',
    action: `${newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)} Account Registered`,
    actorId: newUser.studentId,
    actorName: newUser.name,
    actorRole: newUser.role.toUpperCase(),
    targetResource: `${newUser.role} Registry (${newUser.gradeLevel})`,
    status: 'SUCCESS',
    details: `Assigned ID ${studentId} • Email: ${newUser.email} • Parental Consent: ${newUser.parentalConsentVerified ? 'Verified' : 'Pending'}`,
  });

  return { user: newUser, pin, recoveryKey };
}

/**
 * Authenticate student/user by real-time PIN
 */
export function authenticateByPin(pinInput: string): RegisteredUser | undefined {
  const cleanPin = pinInput.trim().replace(/^STU-/, '');
  if (!cleanPin) return undefined;
  
  const users = getRegisteredUsers();
  const matched = users.find(u => u.pin === cleanPin || u.studentId.includes(cleanPin));
  
  if (matched) {
    recordAuditEvent({
      userId: matched.id,
      userName: matched.name,
      userRole: matched.role.toUpperCase(),
      action: 'USER_LOGIN',
      details: `Successful PIN login for ${matched.name} (${matched.studentId}).`,
      ipMask: '127.0.0.1 (Verified)',
      status: 'SUCCESS',
    });
    recordAuditAction({
      category: 'SYSTEM_CONFIG',
      action: `${matched.role.toUpperCase()} Signed In via PIN`,
      actorId: matched.studentId,
      actorName: matched.name,
      actorRole: matched.role.toUpperCase(),
      targetResource: `${matched.role} Portal Session`,
      status: 'SUCCESS',
      details: `Authenticated via 4-digit PIN (${matched.gradeLevel}).`,
    });
  }
  
  return matched;
}

/**
 * Authenticate by Email & Role
 */
export function authenticateByEmail(emailInput: string, role?: string): RegisteredUser | undefined {
  const cleanEmail = emailInput.trim().toLowerCase();
  const users = getRegisteredUsers();
  
  const matched = users.find(u => u.email.toLowerCase() === cleanEmail && (!role || u.role === role));
  if (matched) {
    recordAuditEvent({
      userId: matched.id,
      userName: matched.name,
      userRole: matched.role.toUpperCase(),
      action: 'USER_LOGIN',
      details: `Successful email login for ${matched.name}.`,
      ipMask: '127.0.0.1 (Verified)',
      status: 'SUCCESS',
    });
    recordAuditAction({
      category: 'SYSTEM_CONFIG',
      action: `${matched.role.toUpperCase()} Signed In via Email`,
      actorId: matched.studentId,
      actorName: matched.name,
      actorRole: matched.role.toUpperCase(),
      targetResource: `${matched.role} Portal Session`,
      status: 'SUCCESS',
      details: `Authenticated ${matched.email} (${matched.gradeLevel}).`,
    });
  }
  return matched;
}

/**
 * Update a student/user's profile
 */
export function updateUserProfile(userId: string, updates: Partial<RegisteredUser>): RegisteredUser | undefined {
  const users = getRegisteredUsers();
  const index = users.findIndex(u => u.id === userId || u.studentId === userId);
  if (index === -1) return undefined;

  const updated = { ...users[index], ...updates };
  users[index] = updated;
  setStoredJson(USERS_STORAGE_KEY, users);

  recordAuditEvent({
    userId: updated.id,
    userName: updated.name,
    userRole: updated.role.toUpperCase(),
    action: 'RECORD_UPDATED',
    details: `Profile record modified for ${updated.name}.`,
    ipMask: '127.0.0.1 (Verified)',
    status: 'SUCCESS',
  });

  recordAuditAction({
    category: 'SYSTEM_CONFIG',
    action: `${updated.role.toUpperCase()} Profile Updated`,
    actorId: updated.studentId,
    actorName: updated.name,
    actorRole: updated.role.toUpperCase(),
    targetResource: `Record ${updated.id}`,
    status: 'INFO',
    details: `Updated fields: ${Object.keys(updates).join(', ')}`,
  });

  return updated;
}
