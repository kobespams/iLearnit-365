import { AIOutputRecord } from '../types';

const AI_TRANSPARENCY_KEY = 'ilearnit_ai_transparency_records_v1';

const SEED_AI_RECORDS: AIOutputRecord[] = [
  {
    id: 'ai-rec-seed-1',
    contextKey: 'jamb-phy-ohms-law',
    sourceFeature: 'JAMB AI Breakdown',
    subject: 'Physics (JAMB Science)',
    promptSummary: 'Explain terminal potential difference vs electromotive force (EMF) in a closed circuit (JAMB 2018 Q14).',
    aiResponse: 'Electromotive force (E) is the total energy supplied per unit charge by a cell, while terminal voltage V = E - Ir accounts for internal resistance r inside the cell.',
    modelUsed: 'Gemini Flash + NERDC Physics Syllabus Grounding',
    methodology: 'Retrieved official JAMB Physics syllabus Section 14 (Current Electricity) and applied Kirchhoff loop law V = E - Ir.',
    groundingSources: ['NERDC Senior Secondary Physics Curriculum', 'JAMB UTME Physics Compiled Scheme Topic 14'],
    createdAt: 'Today, 09:40 AM',
    createdByUser: 'Samuel Adebayo (Student)',
    reviewStatus: 'pending_review',
  },
  {
    id: 'ai-rec-seed-2',
    contextKey: 'jamb-eng-oral-stress',
    sourceFeature: 'Quiz Diagnostic',
    subject: 'Use of English (JAMB Core)',
    promptSummary: 'Emphatic stress rule for "THE PRINCIPAL commended the punctual student" (JAMB 2023).',
    aiResponse: 'In JAMB Oral English, the capitalized word receives emphatic stress; the correct question must contradict ONLY that capitalized word ("Did the vice-principal commend the punctual student?").',
    modelUsed: 'Gemini Flash + JAMB Oral English Rubric',
    methodology: 'Matched contrastive stress rule from JAMB Use of English Section C (Oral Forms) against candidate selected distractor.',
    groundingSources: ['JAMB Use of English Scheme (Oral Forms)', 'WAEC/JAMB Phonology Standard'],
    createdAt: 'Yesterday, 04:15 PM',
    createdByUser: 'Amina Bello (Student)',
    reviewStatus: 'approved',
    reviewedBy: 'Dr. Sarah Jenkins (Educator)',
    reviewedAt: 'Yesterday, 05:10 PM',
    reviewNote: 'Confirmed accurate for 2020–2025 UTME Oral Forms syllabus.',
  },
  {
    id: 'ai-rec-seed-3',
    contextKey: 'jamb-econ-elasticity',
    sourceFeature: 'AI Study Tutor',
    subject: 'Economics (JAMB Commercial)',
    promptSummary: 'Distinguish between unitary elasticity and perfectly inelastic demand curves.',
    aiResponse: 'Perfectly inelastic demand (PED = 0) is a vertical demand curve where quantity demanded does not change with price (e.g., insulin). Unitary elasticity (PED = 1) is a rectangular hyperbola.',
    modelUsed: 'Gemini Flash + Commercial Syllabus Context',
    methodology: 'Cross-referenced Price Elasticity of Demand formula (%ΔQd / %ΔP) with JAMB Economics Scheme Topic 3.',
    groundingSources: ['JAMB UTME Economics Scheme', 'NERDC Commerce & Economics Guide'],
    createdAt: '2 days ago',
    createdByUser: 'Chidi Okonkwo (Student)',
    reviewStatus: 'overridden',
    teacherOverrideText: 'Educator Note: Remember that in JAMB calculations, always use the Point or Arc Elasticity formula explicitly stated in the question. For perfectly inelastic demand, PED = 0 (vertical line parallel to the Price axis), and total revenue rises directly with price.',
    reviewedBy: 'Prof. Kalu Ndubuisi (Educator)',
    reviewedAt: 'Yesterday, 11:20 AM',
    reviewNote: 'Added exam calculation tip on total revenue behavior.',
  },
];

export function getAIOutputRecords(): AIOutputRecord[] {
  if (typeof window === 'undefined') return SEED_AI_RECORDS;
  try {
    const raw = window.localStorage.getItem(AI_TRANSPARENCY_KEY);
    if (!raw) {
      window.localStorage.setItem(AI_TRANSPARENCY_KEY, JSON.stringify(SEED_AI_RECORDS));
      return SEED_AI_RECORDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_AI_RECORDS;
  } catch {
    return SEED_AI_RECORDS;
  }
}

export function saveAIOutputRecord(record: Omit<AIOutputRecord, 'id' | 'createdAt' | 'reviewStatus'>): AIOutputRecord {
  const current = getAIOutputRecords();
  const newItem: AIOutputRecord = {
    ...record,
    id: `ai-rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    reviewStatus: 'pending_review',
  };
  const updated = [newItem, ...current.filter((r) => r.contextKey !== record.contextKey)].slice(0, 50);
  try {
    window.localStorage.setItem(AI_TRANSPARENCY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ilearnit:ai_records_updated', { detail: updated }));
  } catch {}
  return newItem;
}

export function getOverrideForContext(contextKey: string): AIOutputRecord | undefined {
  return getAIOutputRecords().find((r) => r.contextKey === contextKey);
}

export function reviewOrOverrideAIRecord(params: {
  id: string;
  reviewStatus: 'approved' | 'overridden' | 'flagged';
  teacherOverrideText?: string;
  reviewedBy: string;
  reviewNote?: string;
}): AIOutputRecord[] {
  const current = getAIOutputRecords();
  const updated = current.map((item) => {
    if (item.id !== params.id) return item;
    return {
      ...item,
      reviewStatus: params.reviewStatus,
      teacherOverrideText: params.teacherOverrideText !== undefined ? params.teacherOverrideText : item.teacherOverrideText,
      reviewedBy: params.reviewedBy,
      reviewedAt: new Date().toLocaleString('en-NG', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      reviewNote: params.reviewNote ?? item.reviewNote,
    };
  });

  try {
    window.localStorage.setItem(AI_TRANSPARENCY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ilearnit:ai_records_updated', { detail: updated }));
  } catch {}

  return updated;
}
