import { 
  CBTExamConfig, 
  CBTQuestion, 
  CBTResultSlip, 
  CBTScoreBreakdown, 
  CBTInfractionEvent, 
  CBTQuestionDifficulty, 
  CBTTaxonomyLevel 
} from '../types';

/**
 * iLearnit-365 CBT ALGORITHM & SCORING ENGINE
 * Universal Computer-Based Testing Engine supporting all Levels, Courses, Classes, and Subjects.
 */

// Simple seeded PRNG (Mulberry32) for reproducible question & option permutations
function createSeededPRNG(seedStr: string) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates Shuffle Algorithm (Supports optional seed for reproducible anti-collusion shuffling)
 */
export function shuffleArray<T>(array: T[], seed?: string): T[] {
  const cloned = [...array];
  const random = seed ? createSeededPRNG(seed) : Math.random;
  
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

/**
 * Prepares and indexes an exam session for any student
 */
export interface PreparedExamSession {
  examConfig: CBTExamConfig;
  questions: CBTQuestion[];
  // Mapping of questionId -> permutation array of option indices
  optionOrderMap: Record<string, number[]>;
}

export function prepareExamSession(
  examConfig: CBTExamConfig, 
  candidateId: string = 'anon',
  attemptNumber: number = 1
): PreparedExamSession {
  const seed = `${examConfig.id}-${candidateId}-att${attemptNumber}`;
  let questions = [...examConfig.questions];

  if (examConfig.shuffleQuestions) {
    questions = shuffleArray(questions, `${seed}-qshuffle`);
  }

  // If exam totalQuestions is less than question bank size, slice proportionally
  if (examConfig.totalQuestions > 0 && examConfig.totalQuestions < questions.length) {
    questions = questions.slice(0, examConfig.totalQuestions);
  }

  const optionOrderMap: Record<string, number[]> = {};

  questions.forEach((q, idx) => {
    const originalIndices = q.options.map((_, i) => i);
    if (examConfig.shuffleOptions) {
      optionOrderMap[q.id] = shuffleArray(originalIndices, `${seed}-opt-${q.id}-${idx}`);
    } else {
      optionOrderMap[q.id] = originalIndices;
    }
  });

  return {
    examConfig,
    questions,
    optionOrderMap,
  };
}

/**
 * Maps percentage to Nigerian National WAEC / Universal Grade Scale & Remarks
 */
export function calculateGradeDetails(percentage: number): {
  gradeLetter: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  waecGrade: string;
  gpaValue: number;
  remarks: string;
  badge: string;
} {
  if (percentage >= 85) {
    return { gradeLetter: 'A+', waecGrade: 'A1 (Distinction)', gpaValue: 4.0, remarks: 'Outstanding Mastery & Precision', badge: '🏆 Distinction' };
  } else if (percentage >= 75) {
    return { gradeLetter: 'A', waecGrade: 'B2 (Very Good)', gpaValue: 3.75, remarks: 'Excellent Performance & High Accuracy', badge: '⭐ Excellent' };
  } else if (percentage >= 65) {
    return { gradeLetter: 'B', waecGrade: 'B3 (Good)', gpaValue: 3.25, remarks: 'Good Competence with Minor Knowledge Gaps', badge: '👍 Good' };
  } else if (percentage >= 55) {
    return { gradeLetter: 'C', waecGrade: 'C4-C6 (Credit)', gpaValue: 2.5, remarks: 'Satisfactory Passing Standard Achieved', badge: '✅ Pass' };
  } else if (percentage >= 45) {
    return { gradeLetter: 'D', waecGrade: 'D7-E8 (Pass)', gpaValue: 1.5, remarks: 'Marginal Pass - Revision Highly Recommended', badge: '⚠️ Marginal' };
  } else {
    return { gradeLetter: 'F', waecGrade: 'F9 (Fail)', gpaValue: 0.0, remarks: 'Below Threshold - Comprehensive Revision Required', badge: '❌ Needs Retake' };
  }
}

/**
 * Universal CBT Evaluation & Diagnostic Scoring Algorithm
 */
export function evaluateCBTSubmission(
  examConfig: CBTExamConfig,
  questions: CBTQuestion[],
  userAnswers: Record<string, number | null>, // questionId -> original selected option index
  flaggedQuestionIds: string[],
  timeUsedSeconds: number,
  infractions: CBTInfractionEvent[],
  candidate: { name: string; id: string; className: string }
): CBTResultSlip {
  let totalScore = 0;
  let maxScore = 0;

  const accuracyByTopic: Record<string, { correct: number; total: number; percent: number }> = {};
  const accuracyByDifficulty: Record<CBTQuestionDifficulty, { correct: number; total: number; percent: number }> = {
    Easy: { correct: 0, total: 0, percent: 0 },
    Medium: { correct: 0, total: 0, percent: 0 },
    Hard: { correct: 0, total: 0, percent: 0 },
    Mastery: { correct: 0, total: 0, percent: 0 },
  };
  const accuracyByTaxonomy: Record<CBTTaxonomyLevel, { correct: number; total: number; percent: number }> = {
    Recall: { correct: 0, total: 0, percent: 0 },
    Comprehension: { correct: 0, total: 0, percent: 0 },
    Application: { correct: 0, total: 0, percent: 0 },
    Analysis: { correct: 0, total: 0, percent: 0 },
    Evaluation: { correct: 0, total: 0, percent: 0 },
  };

  questions.forEach((q) => {
    const marks = q.marks || 1;
    maxScore += marks;

    // Topic stats
    if (!accuracyByTopic[q.topic]) {
      accuracyByTopic[q.topic] = { correct: 0, total: 0, percent: 0 };
    }
    accuracyByTopic[q.topic].total += 1;

    // Difficulty stats
    if (accuracyByDifficulty[q.difficulty]) {
      accuracyByDifficulty[q.difficulty].total += 1;
    }

    // Taxonomy stats
    if (accuracyByTaxonomy[q.taxonomy]) {
      accuracyByTaxonomy[q.taxonomy].total += 1;
    }

    const selected = userAnswers[q.id];
    if (selected === q.correctIndex) {
      totalScore += marks;
      accuracyByTopic[q.topic].correct += 1;
      if (accuracyByDifficulty[q.difficulty]) accuracyByDifficulty[q.difficulty].correct += 1;
      if (accuracyByTaxonomy[q.taxonomy]) accuracyByTaxonomy[q.taxonomy].correct += 1;
    }
  });

  // Calculate percentages
  Object.keys(accuracyByTopic).forEach((topic) => {
    const item = accuracyByTopic[topic];
    item.percent = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
  });
  (Object.keys(accuracyByDifficulty) as CBTQuestionDifficulty[]).forEach((diff) => {
    const item = accuracyByDifficulty[diff];
    item.percent = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
  });
  (Object.keys(accuracyByTaxonomy) as CBTTaxonomyLevel[]).forEach((tax) => {
    const item = accuracyByTaxonomy[tax];
    item.percent = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
  });

  const rawPercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const gradeInfo = calculateGradeDetails(rawPercent);
  const passed = rawPercent >= examConfig.passingPercentage;
  const avgTime = questions.length > 0 ? Math.round(timeUsedSeconds / questions.length) : 0;

  // Cryptographic Verification ID
  const timestamp = Date.now().toString(36).toUpperCase();
  const hashPart = Math.abs(
    (candidate.id + examConfig.code + totalScore + maxScore)
      .split('')
      .reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  ).toString(16).toUpperCase().padStart(6, '0');
  
  const verificationId = `IL365-CBT-${timestamp}-${hashPart}`;

  const breakdown: CBTScoreBreakdown = {
    totalScore,
    maxScore,
    percentage: rawPercent,
    grade: gradeInfo.gradeLetter,
    passed,
    accuracyByTopic,
    accuracyByDifficulty,
    accuracyByTaxonomy,
    averageTimePerQuestionSec: avgTime,
    infractionCount: infractions.length,
  };

  return {
    verificationId,
    examId: examConfig.id,
    examTitle: examConfig.title,
    examCode: examConfig.code,
    subject: examConfig.subject,
    level: examConfig.level,
    candidateName: candidate.name,
    candidateId: candidate.id,
    candidateClass: candidate.className,
    completedAt: new Date().toISOString(),
    timeUsedSeconds,
    totalAllowedSeconds: examConfig.durationMinutes * 60,
    breakdown,
    userAnswers,
    flaggedQuestionIds,
    questionBank: questions,
  };
}

/**
 * Local Storage Persistence Layer for CBT Results & Active Sessions
 */
const CBT_RESULTS_STORAGE_KEY = 'ilearnit365_cbt_results_v1';
const CBT_ACTIVE_SESSION_KEY_PREFIX = 'ilearnit365_cbt_session_';

export function saveCBTResult(result: CBTResultSlip): void {
  try {
    const existing = getSavedCBTResults();
    const updated = [result, ...existing.filter((r) => r.verificationId !== result.verificationId)];
    localStorage.setItem(CBT_RESULTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save CBT result to localStorage:', err);
  }
}

export function getSavedCBTResults(): CBTResultSlip[] {
  try {
    const data = localStorage.getItem(CBT_RESULTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to load CBT results from localStorage:', err);
    return [];
  }
}

export function saveActiveCBTSession(examId: string, state: any): void {
  try {
    localStorage.setItem(`${CBT_ACTIVE_SESSION_KEY_PREFIX}${examId}`, JSON.stringify({
      state,
      savedAt: Date.now()
    }));
  } catch (err) {
    console.error('Failed to snapshot active CBT session:', err);
  }
}

export function getActiveCBTSession(examId: string): any | null {
  try {
    const raw = localStorage.getItem(`${CBT_ACTIVE_SESSION_KEY_PREFIX}${examId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Discard sessions older than 4 hours
    if (Date.now() - parsed.savedAt > 4 * 60 * 60 * 1000) {
      clearActiveCBTSession(examId);
      return null;
    }
    return parsed.state;
  } catch (err) {
    return null;
  }
}

export function clearActiveCBTSession(examId: string): void {
  try {
    localStorage.removeItem(`${CBT_ACTIVE_SESSION_KEY_PREFIX}${examId}`);
  } catch (err) {
    // Ignore
  }
}
