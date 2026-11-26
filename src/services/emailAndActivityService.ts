import { RegisteredUser } from '../types';
import { getAdminAuthHeaders } from './admin3FAService';

export type EmailDeliveryStatus = 'SENT' | 'QUEUED_NO_SMTP_SECRET' | 'FAILED';
export type EmailDirection = 'USER_FEEDBACK' | 'ADMIN_ALERT' | 'ADMIN_OUTREACH';

export interface RegistrationDispatchReceipt {
  success: boolean;
  userId?: string;
  studentId?: string;
  senderEmail: string;
  mailConfigured: boolean;
  userFeedbackStatus: EmailDeliveryStatus;
  adminAlertStatus: EmailDeliveryStatus;
  timestamp: string;
  error?: string;
}

export interface ServerEmailStatus {
  senderEmail: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  configured: boolean;
  adminNotifyEmails: string[];
  lastVerifiedAt: string | null;
  lastError: string | null;
  stats: {
    totalLogs: number;
    sentCount: number;
    queuedCount: number;
    failedCount: number;
    adminAlertsCount: number;
    userFeedbackCount: number;
    adminOutreachCount: number;
  };
}

export interface ServerEmailLogEntry {
  id: string;
  timestamp: string;
  direction: EmailDirection;
  fromEmail: string;
  toEmail: string;
  recipientName: string;
  recipientRole: 'student' | 'teacher' | 'parent' | 'admin' | 'mixed';
  subject: string;
  bodyPreview: string;
  relatedActivityId?: string;
  triggeredBy: string;
  status: EmailDeliveryStatus;
  messageId?: string;
  errorMessage?: string;
}

export interface ServerPublicActivityEntry {
  id: string;
  timestamp: string;
  activityType: string;
  actorRole: 'student' | 'teacher' | 'parent' | 'visitor' | 'admin';
  actorName: string;
  actorEmail?: string;
  actorId?: string;
  targetResource: string;
  details: string;
  ipMask: string;
  adminNotified: boolean;
  adminEmailStatus?: EmailDeliveryStatus;
}

export interface ServerRegisteredUserEntry {
  id: string;
  studentId: string;
  pin: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent';
  gradeLevel: string;
  schoolName: string;
  phone?: string;
  teachingSubject?: string;
  linkedChildName?: string;
  linkedChildPin?: string;
  parentName?: string;
  parentalConsentVerified?: boolean;
  ageBracket?: string;
  consentCode?: string;
  registrationTimestamp: string;
  feedbackEmailStatus: EmailDeliveryStatus;
  adminAlertStatus: EmailDeliveryStatus;
  source: 'seed' | 'public_registration' | 'admin_sync';
}

export async function dispatchRegistrationNotifications(
  user: RegisteredUser
): Promise<RegistrationDispatchReceipt> {
  try {
    const response = await fetch('/api/public/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: user.id,
        studentId: user.studentId,
        pin: user.pin,
        recoveryKey: user.recoveryKey,
        name: user.name,
        email: user.email,
        role: user.role,
        gradeLevel: user.gradeLevel,
        schoolName: user.schoolName,
        phone: user.phone || user.parentPhone,
        teachingSubject: user.teachingSubject,
        linkedChildName: user.linkedChildName,
        linkedChildPin: user.linkedChildPin,
        parentName: user.parentName,
        parentalConsentVerified: user.parentalConsentVerified,
        ageBracket: user.ageBracket,
        consentCode: user.consentCode,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return {
        success: false,
        senderEmail: 'ilearnit365@gmail.com',
        mailConfigured: false,
        userFeedbackStatus: 'FAILED',
        adminAlertStatus: 'FAILED',
        timestamp: new Date().toISOString(),
        error: data?.error || 'Could not contact mail gateway.',
      };
    }

    return data as RegistrationDispatchReceipt;
  } catch (err: any) {
    return {
      success: false,
      senderEmail: 'ilearnit365@gmail.com',
      mailConfigured: false,
      userFeedbackStatus: 'FAILED',
      adminAlertStatus: 'FAILED',
      timestamp: new Date().toISOString(),
      error: err?.message || 'Network error dispatching registration email.',
    };
  }
}

export async function reportPublicActivity(payload: {
  activityType: string;
  actorRole?: 'student' | 'teacher' | 'parent' | 'visitor';
  actorName: string;
  actorEmail?: string;
  actorId?: string;
  targetResource: string;
  details: string;
  notifyAdmin?: boolean;
}): Promise<void> {
  try {
    await fetch('/api/public/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Do not interrupt user learning flow if network is intermittent
  }
}

export async function fetchAdminEmailStatus(): Promise<ServerEmailStatus | null> {
  const headers = getAdminAuthHeaders();
  if (!headers.Authorization) return null;
  const response = await fetch('/api/admin/email/status', { headers });
  if (!response.ok) return null;
  return response.json();
}

export async function verifyAdminSmtpConnection(): Promise<{
  success: boolean;
  configured: boolean;
  senderEmail: string;
  verifiedAt?: string;
  message: string;
}> {
  const headers = getAdminAuthHeaders();
  if (!headers.Authorization) {
    return {
      success: false,
      configured: false,
      senderEmail: 'ilearnit365@gmail.com',
      message: 'Active Administrative Master Key clearance is required.',
    };
  }
  const response = await fetch('/api/admin/email/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
  });
  return response.json();
}

export async function fetchAdminEmailLogs(): Promise<{
  senderEmail: string;
  logs: ServerEmailLogEntry[];
} | null> {
  const headers = getAdminAuthHeaders();
  if (!headers.Authorization) return null;
  const response = await fetch('/api/admin/email/logs', { headers });
  if (!response.ok) return null;
  return response.json();
}

export async function sendAdminEmailOutreach(payload: {
  targetMode: 'single' | 'role';
  recipientEmail?: string;
  recipientName?: string;
  recipientRole?: 'student' | 'teacher' | 'parent';
  targetRole?: 'student' | 'teacher' | 'parent' | 'all';
  subject: string;
  message: string;
  activityContext?: string;
  extraRecipients?: Array<{ name: string; email: string; role: 'student' | 'teacher' | 'parent' }>;
}): Promise<{
  success: boolean;
  senderEmail?: string;
  totalRecipients?: number;
  sentCount?: number;
  queuedCount?: number;
  failedCount?: number;
  error?: string;
  results?: ServerEmailLogEntry[];
}> {
  const headers = getAdminAuthHeaders();
  if (!headers.Authorization) {
    return { success: false, error: 'Unauthorized: Administrative Master Key session required.' };
  }
  const response = await fetch('/api/admin/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    return { success: false, error: data?.error || 'Failed to dispatch admin email.' };
  }
  return data;
}

export async function fetchAdminSecuredRegistry(): Promise<{
  users: ServerRegisteredUserEntry[];
  counts: { total: number; students: number; teachers: number; parents: number };
  activityLogs: ServerPublicActivityEntry[];
} | null> {
  const headers = getAdminAuthHeaders();
  if (!headers.Authorization) return null;
  const response = await fetch('/api/admin/registry', { headers });
  if (!response.ok) return null;
  return response.json();
}

export async function syncRegisteredUsersToBackend(users: RegisteredUser[]): Promise<void> {
  const headers = getAdminAuthHeaders();
  if (!headers.Authorization || users.length === 0) return;
  try {
    await fetch('/api/admin/registry/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ users }),
    });
  } catch {
    // Silent best-effort sync
  }
}
