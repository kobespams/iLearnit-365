import { CyberLessonCourse, CyberSecurityLevel, StudentCyberTestResult } from '../types';
import { CYBER_LEVEL_1 } from './cyberSecurityLevel1';
import { CYBER_LEVEL_2 } from './cyberSecurityLevel2';
import { CYBER_LEVEL_3 } from './cyberSecurityLevel3';
import { CYBER_LEVEL_4 } from './cyberSecurityLevel4';

export const CYBER_SECURITY_CURRICULUM: CyberLessonCourse[] = [
  CYBER_LEVEL_1,
  CYBER_LEVEL_2,
  CYBER_LEVEL_3,
  CYBER_LEVEL_4,
];

// Helper utilities for local storage of Grade Level Test results
const CYBER_RESULTS_STORAGE_KEY = 'ilearnit365_cyber_test_results_v1';

export function getSavedCyberTestResults(): StudentCyberTestResult[] {
  try {
    const raw = localStorage.getItem(CYBER_RESULTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load saved cyber test results:', err);
    return [];
  }
}

export function saveCyberTestResult(result: StudentCyberTestResult): void {
  try {
    const existing = getSavedCyberTestResults();
    // Replace if exists for this specific test, or prepend
    const filtered = existing.filter((r) => r.testId !== result.testId);
    const updated = [result, ...filtered];
    localStorage.setItem(CYBER_RESULTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save cyber test result:', err);
  }
}

export function getCourseByLevel(level: CyberSecurityLevel): CyberLessonCourse {
  const found = CYBER_SECURITY_CURRICULUM.find((c) => c.level === level);
  return found || CYBER_LEVEL_1;
}
