/**
 * CHEAL Secure Hub — Central Event Bus
 * 
 * EVENT CONTRACT BRIDGING iLearnit-365 & CHEAL PLATFORM
 * 
 * Governed Rule:
 * "Events reference the educational operation without copying the student's exam content or private records into CHEAL diagnostics."
 */

import { ChealSecurityService } from '../../platform/security/audit';
import { ChealDiagnosticsService } from '../../platform/diagnostics/perfetto';

export type ChealEventType =
  | 'cbt.submission.completed'
  | 'cbt.session.started'
  | 'lesson.progress.updated'
  | 'attendance.recorded'
  | 'assignment.submitted'
  | 'assignment.graded'
  | 'auth.session.created'
  | 'auth.mfa.verified'
  | 'security.anomaly.flagged'
  | 'platform.registry.updated';

export interface ChealEventContract {
  eventId: string;
  eventType: ChealEventType;
  application: string;
  userId: string;
  schoolId?: string;
  traceId: string;
  appVersion: string;
  durationMs?: number;
  status: 'success' | 'failed' | 'warning';
  timestamp: string;
  // Sanitized technical metadata only — NEVER raw exam answers or student grades!
  metadata?: Record<string, string | number | boolean>;
}

export type EventSubscriber = (event: ChealEventContract) => void;

export class ChealEventBus {
  private static instance: ChealEventBus;
  private subscribers: Map<string, EventSubscriber[]> = new Map();
  private eventHistory: ChealEventContract[] = [];

  private constructor() {
    this.setupPlatformSubscribers();
    this.seedInitialEvents();
  }

  public static getInstance(): ChealEventBus {
    if (!ChealEventBus.instance) {
      ChealEventBus.instance = new ChealEventBus();
    }
    return ChealEventBus.instance;
  }

  private setupPlatformSubscribers() {
    // 1. Audit Subsystem Bridge
    this.subscribe('*', (event) => {
      ChealSecurityService.getInstance().recordAudit({
        traceId: event.traceId,
        timestamp: event.timestamp,
        application: event.application,
        auth0Id: event.userId,
        action: event.eventType,
        category: event.eventType.startsWith('auth.') ? 'AUTHENTICATION' : 'DATA_ACCESS',
        severity: event.status === 'failed' ? 'WARNING' : 'INFO',
        status: event.status === 'failed' ? 'DENIED' : 'SUCCESS',
        ipMask: '197.210.***.***',
        userAgent: `iLearnit-Client/${event.appVersion}`,
        details: {
          eventId: event.eventId,
          schoolId: event.schoolId,
          durationMs: event.durationMs,
          sanitizedMetadata: event.metadata,
        }
      });
    });

    // 2. Diagnostics Subsystem Bridge (Tracks slow submissions without storing answers)
    this.subscribe('cbt.submission.completed', (event) => {
      if (event.durationMs && event.durationMs > 1500) {
        console.warn(`[CHEAL-DIAGNOSTICS] High submission latency observed on ${event.application} (${event.durationMs}ms) - Trace: ${event.traceId}`);
      }
    });
  }

  private seedInitialEvents() {
    this.eventHistory = [
      {
        eventId: 'evt_cbt_1001',
        eventType: 'cbt.session.started',
        application: 'ilearnit365',
        userId: 'auth0|student_alex_chen',
        schoolId: 'school_001',
        traceId: 'trc_cbt_0918a',
        appVersion: '2.4.0',
        durationMs: 120,
        status: 'success',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        metadata: { examType: 'JSS2_Mathematics', totalQuestions: 10 }
      },
      {
        eventId: 'evt_cbt_1002',
        eventType: 'cbt.submission.completed',
        application: 'ilearnit365',
        userId: 'auth0|student_alex_chen',
        schoolId: 'school_001',
        traceId: 'trc_cbt_0918b',
        appVersion: '2.4.0',
        durationMs: 1840,
        status: 'success',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        metadata: { examType: 'JSS2_Mathematics', questionsAnswered: 10, flaggedCount: 1 }
      },
      {
        eventId: 'evt_att_1003',
        eventType: 'attendance.recorded',
        application: 'ilearnit365',
        userId: 'auth0|teacher_dr_jenkins',
        schoolId: 'school_001',
        traceId: 'trc_att_7731',
        appVersion: '2.4.0',
        durationMs: 340,
        status: 'success',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        metadata: { classCode: 'CS-101', headCount: 28 }
      },
      {
        eventId: 'evt_auth_1004',
        eventType: 'auth.mfa.verified',
        application: 'ilearnit365',
        userId: 'auth0|teacher_dr_jenkins',
        schoolId: 'school_001',
        traceId: 'trc_mfa_5521',
        appVersion: '2.4.0',
        durationMs: 820,
        status: 'success',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        metadata: { mfaProvider: 'totp', auth0ClaimSub: 'auth0|teacher_dr_jenkins' }
      }
    ];
  }

  public publish(event: Omit<ChealEventContract, 'eventId' | 'timestamp'> & { timestamp?: string }): ChealEventContract {
    const fullEvent: ChealEventContract = {
      eventId: `evt_${Date.now().toString().slice(-6)}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: event.timestamp || new Date().toISOString(),
      ...event
    };

    this.eventHistory.unshift(fullEvent);

    // Notify wildcards and specific subscribers
    const wildcards = this.subscribers.get('*') || [];
    const direct = this.subscribers.get(fullEvent.eventType) || [];

    [...wildcards, ...direct].forEach(sub => {
      try {
        sub(fullEvent);
      } catch (err) {
        console.error('[CHEAL-EVENTBUS-ERROR] Subscriber threw:', err);
      }
    });

    return fullEvent;
  }

  public subscribe(eventType: string, subscriber: EventSubscriber): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push(subscriber);

    return () => {
      const list = this.subscribers.get(eventType);
      if (list) {
        this.subscribers.set(eventType, list.filter(s => s !== subscriber));
      }
    };
  }

  public getRecentEvents(limit: number = 50): ChealEventContract[] {
    return this.eventHistory.slice(0, limit);
  }
}
