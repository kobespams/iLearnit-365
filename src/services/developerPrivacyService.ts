import { recordAuditEvent } from './authStorage';
import { verifyAdminMasterKeyForPII } from './admin3FAService';

export interface DeveloperSession {
  developerId: string;
  developerName: string;
  email: string;
  role: 'LEAD_SYSTEM_DEVELOPER' | 'DATA_PRIVACY_OFFICER' | 'INFRASTRUCTURE_ENGINEER';
  clearanceLevel: 'LEVEL_4_ROOT_DEVELOPER';
  grantedAt: string;
  expiresAt: string;
  authToken: string;
  sessionNonce: string;
}

const PRIVACY_AUDIT_KEY = 'ilearnit_365_privacy_audit_records_v1';

// Strictly in-memory DPO / PII unmasking clearance (never written to localStorage or sessionStorage)
let inMemoryDevSession: DeveloperSession | null = null;

export interface PrivacyAuditRecord {
  id: string;
  timestamp: string;
  developerId: string;
  developerName: string;
  action: 'PROFILE_VAULT_ACCESSED' | 'PIN_UNMASKED' | 'RECORD_EXPORTED' | 'DEVELOPER_LOGIN' | 'DEVELOPER_LOGOUT';
  recordTargetId?: string;
  reason: string;
  status: 'AUTHORIZED' | 'DENIED';
  ipMask: string;
}

export function getActiveDeveloperSession(): DeveloperSession | null {
  if (!inMemoryDevSession) return null;
  if (new Date(inMemoryDevSession.expiresAt).getTime() < Date.now()) {
    inMemoryDevSession = null;
    return null;
  }
  return inMemoryDevSession;
}

/**
 * Re-verify the server-configured Administrative Master Key to unmask sensitive PII records.
 */
export async function verifyDeveloperClearanceWithMasterKey(
  masterKeyInput: string,
  operatorRole: 'LEAD_SYSTEM_DEVELOPER' | 'DATA_PRIVACY_OFFICER' = 'DATA_PRIVACY_OFFICER'
): Promise<{ success: boolean; session?: DeveloperSession; message: string }> {
  const verification = await verifyAdminMasterKeyForPII(masterKeyInput);

  if (!verification.success) {
    logPrivacyAudit({
      id: `dlog-fail-${Date.now()}`,
      timestamp: new Date().toISOString(),
      developerId: operatorRole,
      developerName: 'Unverified Operator',
      action: 'DEVELOPER_LOGIN',
      reason: 'Rejected Master Key re-verification attempt to unmask student profiles',
      status: 'DENIED',
      ipMask: 'Enclave Protected',
    });

    return {
      success: false,
      message:
        verification.message ||
        'Invalid Administrative Master Key. PII records remain redacted under NDPA/NDPR policy.',
    };
  }

  const now = new Date();
  const expiresAt = verification.expiresAt || new Date(now.getTime() + 25 * 60 * 1000).toISOString();
  const displayName =
    verification.adminName ||
    (operatorRole === 'DATA_PRIVACY_OFFICER' ? 'Data Privacy Officer' : 'Lead Systems Administrator');

  const session: DeveloperSession = {
    developerId: operatorRole === 'DATA_PRIVACY_OFFICER' ? 'DPO-MASTER-01' : 'ADM-MASTER-01',
    developerName: displayName,
    email: verification.adminEmail || 'privacy@ilearnit365.edu.ng',
    role: operatorRole,
    clearanceLevel: 'LEVEL_4_ROOT_DEVELOPER',
    grantedAt: now.toISOString(),
    expiresAt,
    authToken: `DPO-ENCLAVE-${Date.now().toString(36).toUpperCase()}`,
    sessionNonce: `0x${Math.floor(Math.random() * 1e9).toString(16)}`,
  };

  inMemoryDevSession = session;

  logPrivacyAudit({
    id: `dlog-${Date.now()}`,
    timestamp: now.toISOString(),
    developerId: session.developerId,
    developerName: session.developerName,
    action: 'DEVELOPER_LOGIN',
    reason: 'Master Key re-verified for temporary PII vault access under NDPA/FERPA protocol',
    status: 'AUTHORIZED',
    ipMask: 'Server Verified Enclave',
  });

  recordAuditEvent({
    userId: session.developerId,
    userName: session.developerName,
    userRole: operatorRole,
    action: 'RECORD_UPDATED',
    details: `Master Key re-verified for PII unmasking by ${session.developerName}.`,
    ipMask: 'Server Verified Enclave',
    status: 'SUCCESS',
  });

  return {
    success: true,
    session,
    message: `Master Key re-verified for ${session.developerName}. PII unmasking enabled in memory.`,
  };
}

export function revokeDeveloperSession(): void {
  const current = inMemoryDevSession;
  if (current) {
    logPrivacyAudit({
      id: `dlog-logout-${Date.now()}`,
      timestamp: new Date().toISOString(),
      developerId: current.developerId,
      developerName: current.developerName,
      action: 'DEVELOPER_LOGOUT',
      reason: 'Privacy clearance closed. Master Profile Vault re-masked.',
      status: 'AUTHORIZED',
      ipMask: 'Server Verified Enclave',
    });
  }
  inMemoryDevSession = null;
}

export function logPrivacyAudit(record: PrivacyAuditRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(PRIVACY_AUDIT_KEY);
    const list: PrivacyAuditRecord[] = raw ? JSON.parse(raw) : [];
    list.unshift(record);
    if (list.length > 80) list.length = 80;
    window.localStorage.setItem(PRIVACY_AUDIT_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Privacy audit log error:', err);
  }
}

export function getPrivacyAuditLogs(): PrivacyAuditRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(PRIVACY_AUDIT_KEY);
    if (!raw) {
      return [
        {
          id: 'dlog-init-01',
          timestamp: new Date().toISOString(),
          developerId: 'DPO-MASTER-01',
          developerName: 'Data Privacy Officer',
          action: 'PROFILE_VAULT_ACCESSED',
          reason: 'Privacy protocol boundary initiated. Plaintext PII requires Master Key re-verification.',
          status: 'AUTHORIZED',
          ipMask: 'Server Verified Enclave',
        },
      ];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function maskPin(_pin: string): string {
  return '••••';
}

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '•••••@••••.edu';
  const parts = email.split('@');
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length <= 2 ? `${name[0]}*` : `${name.slice(0, 2)}***${name.slice(-1)}`;
  return `${maskedName}@${domain}`;
}

export function maskPhone(phone?: string): string {
  if (!phone) return '•••• ••• ••••';
  return phone.replace(/(\+?\d{1,3})?\s*(\d{3})\s*(\d{3})\s*(\d{3,4})/, '$1 ••• ••• $4');
}

export function maskName(name: string): string {
  const parts = name.split(' ');
  if (parts.length === 1) return name;
  return `${parts[0]} ${parts.slice(1).map((p) => p[0] + '.').join(' ')}`;
}
