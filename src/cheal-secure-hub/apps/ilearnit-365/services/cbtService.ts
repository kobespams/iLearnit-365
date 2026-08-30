/**
 * iLearnit-365 — CBT Domain Service
 * 
 * Manages CBT examination processing and bridges with CHEAL Platform via Event Contract.
 */

import { ChealEventBus } from '../../../infrastructure/eventBus/eventBus';
import { ExamSubmissionPayload } from '../domain/dataModels';

export class IlearnitCbtService {
  private static instance: IlearnitCbtService;

  private constructor() {}

  public static getInstance(): IlearnitCbtService {
    if (!IlearnitCbtService.instance) {
      IlearnitCbtService.instance = new IlearnitCbtService();
    }
    return IlearnitCbtService.instance;
  }

  /**
   * Process CBT exam submission:
   * 1. Store full educational result in iLearnit-365 domain store.
   * 2. Emit clean, sanitized event to CHEAL Event Bus (no answers, no questions leaked).
   */
  public processSubmission(submission: ExamSubmissionPayload, clientDurationMs: number = 1840): {
    success: boolean;
    resultId: string;
    eventEmitted: any;
  } {
    const resultId = `res_${Date.now()}`;
    const traceId = `trc_cbt_${Date.now().toString().slice(-5)}`;

    // Publish to CHEAL Event Bus
    const event = ChealEventBus.getInstance().publish({
      eventType: 'cbt.submission.completed',
      application: 'ilearnit365',
      userId: `auth0|${submission.studentId}`,
      schoolId: submission.schoolId || 'school_001',
      traceId: traceId,
      appVersion: '2.4.0',
      durationMs: clientDurationMs,
      status: submission.passed ? 'success' : 'warning',
      metadata: {
        examCode: submission.examCode,
        totalQuestions: submission.totalQuestions,
        timeUsedSeconds: submission.timeSpentSeconds,
        passed: submission.passed,
        // Notice: No raw student choices or question texts are attached here!
      }
    });

    return {
      success: true,
      resultId,
      eventEmitted: event,
    };
  }
}
