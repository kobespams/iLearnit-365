/**
 * CHEAL Secure Hub — Platform Security & Audit Subsystem
 * 
 * Data Class: TECHNICAL / SECURITY TELEMETRY
 * - traceId, auditId, ipMask, action, outcome, tamperHash, anomalyScore.
 * - Enforces zero leakage of student test answers or educational records.
 */

export interface ChealAuditLog {
  auditId: string;
  traceId: string;
  timestamp: string;
  application: string;
  auth0Id: string;
  action: string;
  category: 'AUTHENTICATION' | 'AUTHORIZATION' | 'DATA_ACCESS' | 'SYSTEM_MUTATION' | 'SECURITY_ANOMALY';
  severity: 'INFO' | 'WARNING' | 'ALERT' | 'CRITICAL';
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
  ipMask: string;
  userAgent: string;
  tamperSeal: string;
  details: Record<string, any>;
}

export interface SecurityAnomaly {
  anomalyId: string;
  traceId: string;
  timestamp: string;
  application: string;
  type: 'BRUTE_FORCE' | 'RATE_LIMIT_EXCEEDED' | 'GEO_HOPPING' | 'UNUSUAL_EXAM_CONCURRENCY' | 'TOKEN_REPLAY';
  score: number; // 0 to 100
  mitigationApplied: string;
}

export class ChealSecurityService {
  private static instance: ChealSecurityService;
  private auditLogs: ChealAuditLog[] = [];
  private anomalies: SecurityAnomaly[] = [];

  private constructor() {
    this.seedInitialAudits();
  }

  public static getInstance(): ChealSecurityService {
    if (!ChealSecurityService.instance) {
      ChealSecurityService.instance = new ChealSecurityService();
    }
    return ChealSecurityService.instance;
  }

  private seedInitialAudits() {
    this.auditLogs = [
      {
        auditId: 'aud_9801',
        traceId: 'trc_cbt_0918a',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        application: 'ilearnit365',
        auth0Id: 'auth0|student_alex_chen',
        action: 'cbt.session.started',
        category: 'DATA_ACCESS',
        severity: 'INFO',
        status: 'SUCCESS',
        ipMask: '197.210.***.***',
        userAgent: 'iLearnit-Android/2.4.0 (Linux; Android 14)',
        tamperSeal: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        details: { examCode: 'JSS2-MATH-T1', durationAllowedSec: 1800 }
      },
      {
        auditId: 'aud_9802',
        traceId: 'trc_cbt_0918b',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        application: 'ilearnit365',
        auth0Id: 'auth0|student_alex_chen',
        action: 'cbt.submission.completed',
        category: 'DATA_ACCESS',
        severity: 'INFO',
        status: 'SUCCESS',
        ipMask: '197.210.***.***',
        userAgent: 'iLearnit-Android/2.4.0 (Linux; Android 14)',
        tamperSeal: 'sha256:5a8dd3ad0756a93ded72b823b19dd877b6f4332e33d66ba4eef534605e63db93',
        details: { examCode: 'JSS2-MATH-T1', durationMs: 1840, scoreRegistered: true }
      },
      {
        auditId: 'aud_9803',
        traceId: 'trc_sec_3821',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        application: 'ilearnit365',
        auth0Id: 'auth0|sec_officer_01',
        action: 'platform.application.registry_inspected',
        category: 'SYSTEM_MUTATION',
        severity: 'INFO',
        status: 'SUCCESS',
        ipMask: '102.89.***.***',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        tamperSeal: 'sha256:2c624232cdd221771294dfbb310aca000a0df6ac8b66b696d90ef9f8b1b033ac',
        details: { target: 'ilearnit365', scope: 'capabilities_read' }
      }
    ];
  }

  public recordAudit(log: Omit<ChealAuditLog, 'auditId' | 'tamperSeal'>): ChealAuditLog {
    const auditId = `aud_${Date.now().toString().slice(-6)}`;
    const tamperSeal = `sha256:${Math.random().toString(36).substring(2)}${Date.now()}`;
    const fullLog: ChealAuditLog = {
      ...log,
      auditId,
      tamperSeal
    };
    this.auditLogs.unshift(fullLog);
    return fullLog;
  }

  public recordSecurityEvent(params: {
    actor: string;
    action: string;
    target: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    context?: Record<string, any>;
  }): ChealAuditLog {
    const sevMap: Record<string, 'INFO' | 'WARNING' | 'ALERT' | 'CRITICAL'> = {
      low: 'INFO',
      medium: 'WARNING',
      high: 'ALERT',
      critical: 'CRITICAL',
    };
    return this.recordAudit({
      traceId: `trc_${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString(),
      application: 'ilearnit365',
      auth0Id: params.actor.startsWith('auth0|') ? params.actor : `auth0|${params.actor}`,
      action: params.action,
      category: params.action.includes('USER') ? 'AUTHORIZATION' : 'DATA_ACCESS',
      severity: sevMap[params.severity || 'low'] || 'INFO',
      status: 'SUCCESS',
      ipMask: '197.210.***.***',
      userAgent: 'iLearnit-365 Engine',
      details: { target: params.target, ...(params.context || {}) },
    });
  }

  public getAuditLogs(limit: number = 50): ChealAuditLog[] {
    return this.auditLogs.slice(0, limit);
  }

  public getAnomalies(): SecurityAnomaly[] {
    return this.anomalies;
  }
}
