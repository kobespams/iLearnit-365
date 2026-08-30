import React from 'react';
import {
  Calculator,
  Laptop,
  Shield,
  Zap,
  BookOpen,
  Music,
  Landmark,
  Sprout,
  Briefcase,
  Atom,
  GraduationCap,
  Globe,
  Flame,
  FileText,
  Layers,
  Sparkles,
  Award,
  CheckCircle,
  HelpCircle,
  LucideIcon
} from 'lucide-react';
import { JSSLessonTopic, CyberLessonCourse, Course, Assignment } from '../types';

export interface CourseIconMeta {
  id: string;
  code: string;
  name: string;
  category: string;
  icon: LucideIcon;
  iconName: string;
  colorClass: string;
  badgeBg: string;
  borderColor: string;
  textColor: string;
  accentBg: string;
  gradient: string;
  description: string;
  levelBadge: string;
}

export const COURSE_ICON_REGISTRY: Record<string, CourseIconMeta> = {
  math: {
    id: 'math',
    code: 'MATH',
    name: 'Mathematics & Calculus',
    category: 'Mathematics',
    icon: Calculator,
    iconName: 'Calculator',
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    accentBg: 'bg-emerald-600',
    gradient: 'from-emerald-500 to-teal-700',
    description: 'Foundational algebra, geometry, trigonometry, calculus, and mathematical problem-solving.',
    levelBadge: 'JSS1 - SS3 & Advanced',
  },
  cs: {
    id: 'cs',
    code: 'CS',
    name: 'Computer Science & Coding',
    category: 'Computing & IT',
    icon: Laptop,
    iconName: 'Laptop',
    colorClass: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/60',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-300',
    accentBg: 'bg-blue-600',
    gradient: 'from-blue-600 to-indigo-700',
    description: 'Algorithms, data structures, Python programming, software design, and digital systems.',
    levelBadge: 'Intro to Advanced',
  },
  cyber: {
    id: 'cyber',
    code: 'SEC',
    name: 'Cybersecurity & Defense',
    category: 'Cybersecurity & Computing',
    icon: Shield,
    iconName: 'Shield',
    colorClass: 'text-indigo-600 dark:text-indigo-400',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    accentBg: 'bg-indigo-600',
    gradient: 'from-indigo-600 to-violet-800',
    description: 'Network defense, threat intelligence, cryptography, ethical hacking, and digital safety hygiene.',
    levelBadge: 'Levels 1 - 4 Certified',
  },
  physics: {
    id: 'physics',
    code: 'PHYS',
    name: 'Physics & Applied Sciences',
    category: 'Basic Science & Technology',
    icon: Zap,
    iconName: 'Zap',
    colorClass: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
    borderColor: 'border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-700 dark:text-amber-300',
    accentBg: 'bg-amber-600',
    gradient: 'from-amber-500 to-orange-600',
    description: 'Electromagnetism, optics, kinematics, thermodynamics, and physical energy systems.',
    levelBadge: 'Senior Secondary',
  },
  chemistry: {
    id: 'chemistry',
    code: 'CHEM',
    name: 'Chemistry & Molecular Science',
    category: 'Basic Science & Technology',
    icon: Atom,
    iconName: 'Atom',
    colorClass: 'text-cyan-600 dark:text-cyan-400',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
    textColor: 'text-cyan-700 dark:text-cyan-300',
    accentBg: 'bg-cyan-600',
    gradient: 'from-cyan-600 to-blue-700',
    description: 'Chemical bonding, periodic trends, stoichiometry, organic compounds, and laboratory reactions.',
    levelBadge: 'Secondary Prep',
  },
  lit: {
    id: 'lit',
    code: 'LIT',
    name: 'World Literature & English',
    category: 'English & Communication',
    icon: BookOpen,
    iconName: 'BookOpen',
    colorClass: 'text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
    borderColor: 'border-rose-200 dark:border-rose-800',
    textColor: 'text-rose-700 dark:text-rose-300',
    accentBg: 'bg-rose-600',
    gradient: 'from-rose-500 to-pink-700',
    description: 'Critical analysis, prose, poetry, essay composition, grammar mastery, and rhetoric.',
    levelBadge: 'All Levels',
  },
  music: {
    id: 'music',
    code: 'CCA',
    name: 'CCA Music & Creative Arts',
    category: 'Cultural & Creative Arts (CCA Music)',
    icon: Music,
    iconName: 'Music',
    colorClass: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/60',
    borderColor: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-700 dark:text-purple-300',
    accentBg: 'bg-purple-600',
    gradient: 'from-purple-600 to-fuchsia-700',
    description: 'Staff notation, solfa ear training, African organology, rhythm drills, and choral performance.',
    levelBadge: 'JSS1 - JSS3 CCA',
  },
  civic: {
    id: 'civic',
    code: 'CIV',
    name: 'Civic & Social Studies',
    category: 'Civic & Social Studies',
    icon: Landmark,
    iconName: 'Landmark',
    colorClass: 'text-teal-600 dark:text-teal-400',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/60',
    borderColor: 'border-teal-200 dark:border-teal-800',
    textColor: 'text-teal-700 dark:text-teal-300',
    accentBg: 'bg-teal-600',
    gradient: 'from-teal-600 to-emerald-800',
    description: 'Constitutional democracy, citizenship responsibilities, human rights, and global governance.',
    levelBadge: 'Junior & Senior',
  },
  agric: {
    id: 'agric',
    code: 'AGR',
    name: 'Agricultural Science',
    category: 'Agricultural Science',
    icon: Sprout,
    iconName: 'Sprout',
    colorClass: 'text-lime-600 dark:text-lime-400',
    badgeBg: 'bg-lime-50 dark:bg-lime-950/60',
    borderColor: 'border-lime-200 dark:border-lime-800',
    textColor: 'text-lime-700 dark:text-lime-300',
    accentBg: 'bg-lime-600',
    gradient: 'from-lime-600 to-green-800',
    description: 'Crop production, soil chemistry, farm mechanization, animal husbandry, and agribusiness.',
    levelBadge: 'All Levels',
  },
  business: {
    id: 'business',
    code: 'BUS',
    name: 'Business Studies & Commerce',
    category: 'Business Studies',
    icon: Briefcase,
    iconName: 'Briefcase',
    colorClass: 'text-slate-700 dark:text-slate-300',
    badgeBg: 'bg-slate-100 dark:bg-slate-800/60',
    borderColor: 'border-slate-300 dark:border-slate-700',
    textColor: 'text-slate-800 dark:text-slate-200',
    accentBg: 'bg-slate-700',
    gradient: 'from-slate-700 to-slate-900',
    description: 'Double-entry bookkeeping, office practice, entrepreneurship, microeconomics, and marketing.',
    levelBadge: 'Secondary',
  },
};

/**
 * Find matching CourseIconMeta from any subject, title, or code string
 */
export function getCourseMeta(subjectOrTitle: string = ''): CourseIconMeta {
  const norm = subjectOrTitle.toLowerCase().trim();

  if (norm.includes('math') || norm.includes('calculus') || norm.includes('algebra') || norm.includes('geometry')) {
    return COURSE_ICON_REGISTRY.math;
  }
  if (norm.includes('cyber') || norm.includes('security') || norm.includes('threat') || norm.includes('sec-')) {
    return COURSE_ICON_REGISTRY.cyber;
  }
  if (norm.includes('cs') || norm.includes('computer') || norm.includes('python') || norm.includes('code') || norm.includes('algorithm') || norm.includes('data struct')) {
    return COURSE_ICON_REGISTRY.cs;
  }
  if (norm.includes('phys') || norm.includes('optics') || norm.includes('electromagnet')) {
    return COURSE_ICON_REGISTRY.physics;
  }
  if (norm.includes('chem') || norm.includes('molecule') || norm.includes('reaction')) {
    return COURSE_ICON_REGISTRY.chemistry;
  }
  if (norm.includes('music') || norm.includes('cca') || norm.includes('arts') || norm.includes('solfa') || norm.includes('stave')) {
    return COURSE_ICON_REGISTRY.music;
  }
  if (norm.includes('lit') || norm.includes('english') || norm.includes('prose') || norm.includes('essay') || norm.includes('grammar') || norm.includes('language')) {
    return COURSE_ICON_REGISTRY.lit;
  }
  if (norm.includes('civic') || norm.includes('social') || norm.includes('government') || norm.includes('citizen')) {
    return COURSE_ICON_REGISTRY.civic;
  }
  if (norm.includes('agric') || norm.includes('farm') || norm.includes('crop') || norm.includes('soil')) {
    return COURSE_ICON_REGISTRY.agric;
  }
  if (norm.includes('bus') || norm.includes('commerce') || norm.includes('account') || norm.includes('bookkeeping') || norm.includes('economics')) {
    return COURSE_ICON_REGISTRY.business;
  }

  // Fallback to general academic icon
  return {
    id: 'general',
    code: 'GEN',
    name: subjectOrTitle || 'General Subject',
    category: 'General Academic',
    icon: GraduationCap,
    iconName: 'GraduationCap',
    colorClass: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/60',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-300',
    accentBg: 'bg-blue-600',
    gradient: 'from-blue-600 to-indigo-700',
    description: 'Core curriculum study topic on iLearnit-365.',
    levelBadge: 'Universal',
  };
}

// Alias for seamless backward compatibility
export const getCourseIconInfo = getCourseMeta;
export const COURSE_ICON_LIST: CourseIconMeta[] = Object.values(COURSE_ICON_REGISTRY);

/**
 * Universal converter: Transforms any curriculum object, topic, or lesson note into clean raw plain text string (.txt)
 */
export function convertToPlainTextString(item: any): string {
  if (!item) return '==================================================\n   iLearnit-365 LEARNING RESOURCE (EMPTY)\n==================================================';

  const timestamp = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const divider = '================================================================================';
  const subDivider = '--------------------------------------------------------------------------------';

  // 1. JSS Lesson Topic (Math, CCA, etc.)
  if (item.file || item.workedExamples || item.keyFormulas) {
    const topic = item as JSSLessonTopic;
    let doc = `${divider}\n`;
    doc += `   iLearnit-365 SMART ACADEMIC CURRICULUM MODULE (.TXT)\n`;
    doc += `${divider}\n\n`;
    doc += `TOPIC TITLE    : ${topic.title}\n`;
    doc += `CURRICULUM FILE: ${topic.file || 'Curriculum Module'}\n`;
    doc += `GRADE LEVEL    : ${topic.level} (Term ${topic.term || 1}, Week ${topic.recommendedWeek || 1})\n`;
    doc += `EXPORT DATE    : ${timestamp}\n`;
    doc += `INSTITUTION    : iLearnit-365 Digital Academy System\n\n`;

    doc += `${subDivider}\n`;
    doc += `1. EXECUTIVE TOPIC SUMMARY\n`;
    doc += `${subDivider}\n`;
    doc += `${topic.summary}\n\n`;

    if (topic.keyFormulas && topic.keyFormulas.length > 0) {
      doc += `${subDivider}\n`;
      doc += `2. KEY FORMULAS, MNEMONICS & CORE DEFINITIONS\n`;
      doc += `${subDivider}\n`;
      topic.keyFormulas.forEach((formula, idx) => {
        doc += `  [${idx + 1}] ${formula}\n`;
      });
      doc += `\n`;
    }

    if (topic.workedExamples && topic.workedExamples.length > 0) {
      doc += `${subDivider}\n`;
      doc += `3. STEP-BY-STEP WORKED EXAMPLES & SOLUTIONS\n`;
      doc += `${subDivider}\n`;
      topic.workedExamples.forEach((ex, idx) => {
        doc += `EXAMPLE ${idx + 1}:\n`;
        doc += `  Problem  : ${ex.problem}\n`;
        doc += `  Solution : ${ex.solution}\n\n`;
      });
    }

    if (topic.teacherGuide) {
      doc += `${subDivider}\n`;
      doc += `4. TEACHER CLASSROOM PEDAGOGICAL GUIDE & PACING\n`;
      doc += `${subDivider}\n`;
      doc += `${topic.teacherGuide}\n\n`;
    }

    if (topic.practiceQuestions && topic.practiceQuestions.length > 0) {
      doc += `${subDivider}\n`;
      doc += `5. STUDENT PRACTICE DRILLS & ANSWER KEY\n`;
      doc += `${subDivider}\n`;
      topic.practiceQuestions.forEach((pq, idx) => {
        doc += `QUESTION ${idx + 1}: ${pq.question}\n`;
        doc += `  Answer  : ${pq.answer}\n`;
        if (pq.hint) doc += `  Hint    : ${pq.hint}\n`;
        doc += `\n`;
      });
    }

    if (topic.weeklySchedule && topic.weeklySchedule.length > 0) {
      doc += `${subDivider}\n`;
      doc += `6. DETAILED WEEKLY SCHEME OF WORK\n`;
      doc += `${subDivider}\n`;
      topic.weeklySchedule.forEach((ws) => {
        doc += `[WEEK ${ws.weekNumber}] ${ws.weekTitle}\n`;
        doc += `  Objective  : ${ws.weeklyObjective}\n`;
        doc += `  Subtopics  : ${ws.focusSubtopics.join(', ')}\n`;
        doc += `  Activities : ${ws.teachingActivities.join(' | ')}\n`;
        doc += `  Assignment : ${ws.weeklyAssignment}\n\n`;
      });
    }

    doc += `${divider}\n`;
    doc += `END OF MODULE: ${topic.title} - iLearnit-365 Smart Learning Portal\n`;
    doc += `${divider}\n`;
    return doc;
  }

  // 2. Cyber Lesson Course
  if (item.levelLabel || item.badgeTitle || (item.weeklySchedule && item.practicalLabTitle)) {
    const cyber = item as CyberLessonCourse;
    let doc = `${divider}\n`;
    doc += `   iLearnit-365 CYBERSECURITY ACADEMY SYLLABUS (.TXT)\n`;
    doc += `${divider}\n\n`;
    doc += `COURSE TITLE   : ${cyber.title} (${cyber.code})\n`;
    doc += `LEVEL & BADGE  : ${cyber.levelLabel} | ${cyber.badgeTitle}\n`;
    doc += `TARGET AUDIENCE: ${cyber.targetAudience}\n`;
    doc += `DURATION       : ${cyber.durationWeeks} Academic Weeks\n`;
    doc += `EXPORT DATE    : ${timestamp}\n\n`;

    doc += `${subDivider}\n`;
    doc += `1. COURSE OVERVIEW & SUMMARY\n`;
    doc += `${subDivider}\n`;
    doc += `${cyber.summary}\n\n`;

    doc += `${subDivider}\n`;
    doc += `2. KEY SECURITY STANDARDS & FRAMEWORKS\n`;
    doc += `${subDivider}\n`;
    cyber.keyStandards.forEach((std, i) => {
      doc += `  * [${i + 1}] ${std}\n`;
    });
    doc += `\n`;

    doc += `${subDivider}\n`;
    doc += `3. CAPSTONE PRACTICAL DEFENSE LAB\n`;
    doc += `${subDivider}\n`;
    doc += `Lab Title: ${cyber.practicalLabTitle}\n`;
    doc += `Lab Guide: ${cyber.practicalLabGuide}\n\n`;

    if (cyber.weeklySchedule && cyber.weeklySchedule.length > 0) {
      doc += `${subDivider}\n`;
      doc += `4. WEEK-BY-WEEK DEFENSE MODULES & DRILLS\n`;
      doc += `${subDivider}\n`;
      cyber.weeklySchedule.forEach((w) => {
        doc += `[WEEK ${w.weekNumber}] ${w.weekTitle}\n`;
        doc += `  Objective      : ${w.weeklyObjective}\n`;
        doc += `  Focus Topics   : ${w.focusSubtopics.join('; ')}\n`;
        doc += `  Hands-on Lab   : ${w.handsOnActivity}\n`;
        doc += `  Outline Notes  : ${w.outlineSourceNotes}\n`;
        doc += `  Key Takeaways  : ${w.keyTakeaways.join(' | ')}\n\n`;
      });
    }

    doc += `${divider}\n`;
    doc += `END OF COURSE SYLLABUS: ${cyber.title}\n`;
    doc += `${divider}\n`;
    return doc;
  }

  // 3. Standard Course
  if (item.instructor || item.progress !== undefined) {
    const course = item as Course;
    let doc = `${divider}\n`;
    doc += `   iLearnit-365 ENROLLED COURSE SPECIFICATION (.TXT)\n`;
    doc += `${divider}\n\n`;
    doc += `COURSE NAME    : ${course.title} (${course.code})\n`;
    doc += `INSTRUCTOR     : ${course.instructor}\n`;
    doc += `SCHEDULE       : ${course.schedule}\n`;
    doc += `CURRENT GRADE  : ${course.grade} (${course.progress}% Completed)\n`;
    doc += `MODULE PROGRESS: ${course.completedModules} of ${course.totalModules} modules mastered\n`;
    doc += `NEXT ASSIGNMENT: ${course.nextAssignment} (Due: ${course.nextDueDate})\n`;
    doc += `EXPORT DATE    : ${timestamp}\n\n`;

    doc += `${subDivider}\n`;
    doc += `COURSE DESCRIPTION & LEARNING OUTCOMES\n`;
    doc += `${subDivider}\n`;
    doc += `This accredited course combines theoretical foundations, hands-on lab projects, diagnostic quizzes, and AI-assisted tutoring on the iLearnit-365 portal.\n\n`;

    doc += `${divider}\n`;
    doc += `END OF COURSE DOCUMENT: ${course.code}\n`;
    doc += `${divider}\n`;
    return doc;
  }

  // 4. Assignment
  if (item.dueDate && item.courseTitle) {
    const assign = item as Assignment;
    let doc = `${divider}\n`;
    doc += `   iLearnit-365 ACADEMIC ASSIGNMENT BRIEF (.TXT)\n`;
    doc += `${divider}\n\n`;
    doc += `ASSIGNMENT TITLE : ${assign.title}\n`;
    doc += `COURSE           : ${assign.courseTitle}\n`;
    doc += `CATEGORY         : ${assign.category}\n`;
    doc += `DUE DATE         : ${assign.dueDate}\n`;
    doc += `STATUS           : ${assign.status.toUpperCase()}\n`;
    if (assign.maxScore) doc += `MAX SCORE        : ${assign.maxScore} pts\n`;
    if (assign.score !== undefined) doc += `SCORE EARNED     : ${assign.score}/${assign.maxScore} pts\n`;
    if (assign.feedback) doc += `TEACHER FEEDBACK : ${assign.feedback}\n`;
    doc += `EXPORT DATE      : ${timestamp}\n\n`;
    doc += `${divider}\n`;
    return doc;
  }

  // 5. Fallback generic plain text stringification
  return `${divider}\n   iLearnit-365 PLAIN TEXT DOCUMENT\n${divider}\n\n${typeof item === 'string' ? item : JSON.stringify(item, null, 2)}\n\n${divider}\n`;
}

/**
 * Universal converter: Transforms any curriculum object, topic, or lesson note into structured Plain Text object for modals
 */
export function convertToPlainTextDocument(
  item: any,
  typeHint?: 'course' | 'assignment' | 'topic' | 'quiz' | 'cyber' | string
): {
  title: string;
  subtitle?: string;
  content: string;
  subjectId?: string;
  docType?: string;
} {
  const content = convertToPlainTextString(item);
  let title = 'Educational Document (.txt)';
  let subtitle = 'iLearnit-365 Academic Resource';
  let subjectId = 'general';
  let docType = 'ACADEMIC RESOURCE DOCUMENT';

  if (!item) {
    return { title, subtitle, content, subjectId, docType };
  }

  if (item.file || item.workedExamples || typeHint === 'topic') {
    title = `${item.title || 'Curriculum Module'} - Syllabus (.txt)`;
    subtitle = `${item.level || 'JSS'} • Term ${item.term || 1} • Week ${item.recommendedWeek || 1}`;
    subjectId = 'math';
    docType = 'CURRICULUM MODULE DOCUMENT';
  } else if (item.levelLabel || item.badgeTitle || typeHint === 'cyber') {
    title = `${item.title || 'Cybersecurity Academy'} - Syllabus (.txt)`;
    subtitle = `${item.levelLabel || 'Certified Track'} • ${item.badgeTitle || 'Credentialed Course'}`;
    subjectId = 'cyber';
    docType = 'CYBERSECURITY SYLLABUS DOCUMENT';
  } else if (item.instructor || typeHint === 'course') {
    title = `${item.title || item.code} - Course Specification (.txt)`;
    subtitle = `Code: ${item.code} • Instructor: ${item.instructor}`;
    subjectId = getCourseMeta(item.title + ' ' + item.code).id;
    docType = 'COURSE SPECIFICATION DOCUMENT';
  } else if (item.dueDate || typeHint === 'assignment') {
    title = `${item.title} - Assignment Brief (.txt)`;
    subtitle = `Course: ${item.courseTitle} • Due: ${item.dueDate}`;
    subjectId = getCourseMeta(item.courseTitle).id;
    docType = 'ASSIGNMENT BRIEF';
  }

  return {
    title,
    subtitle,
    content,
    subjectId,
    docType,
  };
}

/**
 * Trigger browser file download of plain text content
 */
export function downloadPlainTextFile(filename: string, content: string): void {
  const sanitizedFilename = filename.toLowerCase().replace(/[^a-z0-9_-]/g, '_').replace(/_+/g, '_') + '.txt';
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = sanitizedFilename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
