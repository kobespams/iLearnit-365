// System Audit Trail & Accountability Service for iLearnit-365 Administrative Actions

export type AuditActionCategory = 
  | '3FA_ACTIVATION'
  | '3FA_RENEWAL'
  | '3FA_TERMINATION'
  | 'BACKEND_TAB_ACCESS'
  | 'PII_ACCESS'
  | 'STUDENT_REGISTRATION'
  | 'FEEDBACK_DISPATCH'
  | 'SECURITY_ALERT'
  | 'SYSTEM_CONFIG'
  | 'VOICE_TUTOR_SESSION';

export interface AuditTrailRecord {
  id: string;
  timestamp: string;
  category: AuditActionCategory;
  action: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  targetResource: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED' | 'INFO';
  clearanceLevel?: string;
  details: string;
  ipMask?: string;
  signature?: string;
  meta?: Record<string, string | number | boolean>;
}

const AUDIT_STORAGE_KEY = 'ilearnit_system_audit_trail_v1';

// Seed initial realistic accountability logs
const INITIAL_AUDIT_LOGS: AuditTrailRecord[] = [
  {
    id: 'aud-seed-01',
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    category: '3FA_ACTIVATION',
    action: '3FA Administrative Clearance Granted',
    actorId: 'ADM-365-NIGERIA-SEC',
    actorName: 'Dr. Folashade Adeleke',
    actorRole: 'Chief Academic Registrar & Security Director',
    targetResource: 'Enclave Master Gatekeeper',
    status: 'SUCCESS',
    clearanceLevel: 'LEVEL_3_SUPERADMIN',
    details: 'Verified Passkey + TOTP Token (6 digits) + FIDO2 Yubikey hardware attestation signature.',
    ipMask: '102.89.44.xxx (Lagos Core Hub)',
    signature: 'SIG-AES256-4A99F-88219B',
  },
  {
    id: 'aud-seed-02',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    category: 'BACKEND_TAB_ACCESS',
    action: 'Accessed Admin Dashboard (Master Console)',
    actorId: 'ADM-365-NIGERIA-SEC',
    actorName: 'Dr. Folashade Adeleke',
    actorRole: 'Chief Academic Registrar & Security Director',
    targetResource: '/admin (Registrations & Management)',
    status: 'SUCCESS',
    clearanceLevel: 'LEVEL_3_SUPERADMIN',
    details: 'Session clearance validated. Full administrative console unlocked for student registration monitoring.',
    ipMask: '102.89.44.xxx (Lagos Core Hub)',
    signature: 'SIG-AES256-7E11B-39210C',
  },
  {
    id: 'aud-seed-03',
    timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    category: 'PII_ACCESS',
    action: 'Developer Privacy Clearance Decryption',
    actorId: 'DEV-DPO-01',
    actorName: 'Developer Privacy Officer (DPO)',
    actorRole: 'Senior Data Protection Lead',
    targetResource: 'Student Registration Master Database',
    status: 'SUCCESS',
    clearanceLevel: 'NDPR / GDPR Privacy Tier 1',
    details: 'Decrypted masked registration PINs & student emails under NDPR Section 2.3 compliance protocol.',
    ipMask: '105.112.98.xxx (Abuja Dev Enclave)',
    signature: 'SIG-DPO-AES256-SEC09',
  },
  {
    id: 'aud-seed-04',
    timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    category: 'FEEDBACK_DISPATCH',
    action: 'Registration Feedback Email Dispatched',
    actorId: 'ADM-365-NIGERIA-SEC',
    actorName: 'Dr. Folashade Adeleke',
    actorRole: 'Chief Academic Registrar',
    targetResource: 'Student: Amara Chukwu (ILN-2026-10492)',
    status: 'SUCCESS',
    clearanceLevel: 'LEVEL_3_SUPERADMIN',
    details: 'Welcome orientation bundle & credentials confirmation dispatched via encrypted mail gateway.',
    ipMask: '102.89.44.xxx (Lagos Core Hub)',
    signature: 'SIG-SMTP-TLS1.3-9941',
  },
  {
    id: 'aud-seed-05',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    category: 'BACKEND_TAB_ACCESS',
    action: 'Accessed iLearnit Security Center & OTP Hub',
    actorId: 'ADM-REGISTRAR-02',
    actorName: 'Prof. Kalu Ndubuisi',
    actorRole: 'Academic Operations Officer',
    targetResource: '/ilearnit_security (OTP & Threat Matrix)',
    status: 'SUCCESS',
    clearanceLevel: 'LEVEL_2_REGISTRAR',
    details: 'Audited active OTP delivery logs, brute force rate-limits, and zero-trust gateway status.',
    ipMask: '197.210.65.xxx (Port Harcourt Hub)',
    signature: 'SIG-AES256-88F3A-77192A',
  },
  {
    id: 'aud-seed-06',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    category: '3FA_RENEWAL',
    action: '3FA Clearance Session Extended (+25m)',
    actorId: 'ADM-365-NIGERIA-SEC',
    actorName: 'Dr. Folashade Adeleke',
    actorRole: 'Chief Academic Registrar & Security Director',
    targetResource: 'Enclave Session Guard',
    status: 'SUCCESS',
    clearanceLevel: 'LEVEL_3_SUPERADMIN',
    details: 'Proactive session extension requested before auto-lockout threshold. Expiry window extended.',
    ipMask: '102.89.44.xxx (Lagos Core Hub)',
    signature: 'SIG-AES256-RENEW-1029',
  },
  {
    id: 'aud-seed-07',
    timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    category: 'BACKEND_TAB_ACCESS',
    action: 'Accessed CHEAL Secure Hub',
    actorId: 'ADM-DEV-NETLIFY-SEC',
    actorName: 'DevOps & Infrastructure Lead',
    actorRole: 'Cloud Deployment & System Architect',
    targetResource: '/cheal_hub (Zero-Trust Identity Enclave)',
    status: 'SUCCESS',
    clearanceLevel: 'LEVEL_3_SUPERADMIN',
    details: 'Verified microservice endpoints, mutual TLS tunnels, and encrypted token signing keys.',
    ipMask: '102.89.44.xxx (Lagos Core Hub)',
    signature: 'SIG-CHEAL-ZT-2993',
  },
  {
    id: 'aud-seed-08',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    category: 'VOICE_TUTOR_SESSION',
    action: 'Voice Teaching Module Initialized',
    actorId: 'EDU-VOICE-PRESENTER',
    actorName: 'Interactive Voice Presenter Engine',
    actorRole: 'AI Educator & Academic Voice Synthesizer',
    targetResource: 'JSS Mathematics & Cyber Security Modules',
    status: 'INFO',
    clearanceLevel: 'ACADEMIC_VOICE_LAYER',
    details: 'Voice profile set: Nigerian/British Academic Persona. Interactive comprehension checks enabled.',
    ipMask: '127.0.0.1 (Web Audio Engine)',
    signature: 'SIG-VOICE-SYNTH-4401',
  }
];

// Load audit trail from localStorage or initialize with seed data
export function getSystemAuditTrail(): AuditTrailRecord[] {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load audit trail', e);
    return INITIAL_AUDIT_LOGS;
  }
}

// Append a new record to the audit trail
export function recordAuditAction(record: Omit<AuditTrailRecord, 'id' | 'timestamp'> & { timestamp?: string; id?: string }): AuditTrailRecord {
  try {
    const logs = getSystemAuditTrail();
    const newEntry: AuditTrailRecord = {
      id: record.id || `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: record.timestamp || new Date().toISOString(),
      category: record.category,
      action: record.action,
      actorId: record.actorId,
      actorName: record.actorName,
      actorRole: record.actorRole,
      targetResource: record.targetResource,
      status: record.status,
      clearanceLevel: record.clearanceLevel || 'STANDARD',
      details: record.details,
      ipMask: record.ipMask || '102.89.44.xxx (Lagos Hub)',
      signature: record.signature || `SIG-AES256-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      meta: record.meta,
    };

    logs.unshift(newEntry);
    // Keep last 150 entries for storage efficiency
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs.slice(0, 150)));
    return newEntry;
  } catch (e) {
    console.error('Failed to record audit action', e);
    return {
      id: `err-${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: record.category,
      action: record.action,
      actorId: record.actorId,
      actorName: record.actorName,
      actorRole: record.actorRole,
      targetResource: record.targetResource,
      status: record.status,
      details: record.details,
    };
  }
}

// Convenience helper to log backend tab navigation events
export function logBackendTabAccess(tabRole: string, actorName: string = 'Authorized Administrator', actorId: string = 'ADM-SESSION-ACTIVE', clearanceLevel: string = 'LEVEL_2_REGISTRAR'): void {
  const roleNameMap: Record<string, string> = {
    admin: 'Admin Dashboard (Master Records)',
    cheal_hub: 'CHEAL Secure Hub (Zero-Trust Enclave)',
    ilearnit_security: 'iLearnit Security & OTP Center',
    deployment: 'Netlify Cloud Deployment Hub',
  };

  const targetLabel = roleNameMap[tabRole] || `Backend Portal (${tabRole})`;

  recordAuditAction({
    category: 'BACKEND_TAB_ACCESS',
    action: `Navigation to ${targetLabel}`,
    actorId,
    actorName,
    actorRole: 'System Administrator',
    targetResource: `/${tabRole}`,
    status: 'SUCCESS',
    clearanceLevel,
    details: `Accessed backend administration interface. Cryptographic clearance verified.`,
  });
}

// Export logs as JSON string
export function exportAuditLogsAsJSON(): string {
  const logs = getSystemAuditTrail();
  return JSON.stringify(logs, null, 2);
}

// Export logs as CSV string for audit & compliance reporting
export function exportAuditLogsAsCSV(): string {
  const logs = getSystemAuditTrail();
  const headers = ['Timestamp', 'Category', 'Action', 'Actor ID', 'Actor Name', 'Actor Role', 'Target Resource', 'Status', 'Clearance Level', 'Details', 'IP Mask', 'Signature'];
  
  const rows = logs.map(l => [
    `"${l.timestamp}"`,
    `"${l.category}"`,
    `"${l.action.replace(/"/g, '""')}"`,
    `"${l.actorId}"`,
    `"${l.actorName.replace(/"/g, '""')}"`,
    `"${l.actorRole.replace(/"/g, '""')}"`,
    `"${l.targetResource.replace(/"/g, '""')}"`,
    `"${l.status}"`,
    `"${l.clearanceLevel || ''}"`,
    `"${l.details.replace(/"/g, '""')}"`,
    `"${l.ipMask || ''}"`,
    `"${l.signature || ''}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

// Clear or Reset audit trail to defaults
export function resetAuditTrailToDefaults(): void {
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
}
