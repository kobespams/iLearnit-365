import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  HeartHandshake,
  Activity,
  Search,
  RefreshCw,
  Download,
  Printer,
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Bot,
  FileText,
  Server,
  Cloud,
  Shield,
  Mail,
  Send,
  Wifi,
  Clock,
} from 'lucide-react';
import { getRegisteredUsers, getAuditLogs } from '../services/authStorage';
import {
  getSystemAuditTrail,
  exportAuditLogsAsCSV,
  AuditTrailRecord,
} from '../services/auditTrailService';
import { getAIOutputRecords } from '../services/aiTransparencyService';
import { Admin3FASession, get3FAAuditLogs } from '../services/admin3FAService';
import { maskEmail, maskName, maskPhone, maskPin } from '../services/developerPrivacyService';
import {
  fetchAdminEmailStatus,
  fetchAdminEmailLogs,
  fetchAdminSecuredRegistry,
  syncRegisteredUsersToBackend,
  verifyAdminSmtpConnection,
  sendAdminEmailOutreach,
  ServerEmailStatus,
  ServerEmailLogEntry,
  ServerPublicActivityEntry,
  ServerRegisteredUserEntry,
} from '../services/emailAndActivityService';
import { RegisteredUser, SecurityAuditRecord, AIOutputRecord } from '../types';
import AdminDashboard from './AdminDashboard';
import { ChealSecureHub } from './ChealSecureHub';
import { ILearnitSecurityCenter } from './ILearnitSecurityCenter';
import { NetlifyCloudDeploymentHub } from './NetlifyCloudDeploymentHub';

interface AdminBackendLogsPortalProps {
  onExitToPublic: () => void;
  adminSession?: Admin3FASession | null;
}

type LogMonitorTab = 'all' | 'student' | 'teacher' | 'parent' | 'ai_security';
type ConsoleSection = 'logs_monitor' | 'email_server' | 'master_vault' | 'cheal_enclave' | 'security_otp' | 'cloud_deploy';

interface UnifiedLogRow {
  id: string;
  timestamp: string;
  actorRoleGroup: 'student' | 'teacher' | 'parent' | 'admin';
  actorRoleLabel: string;
  actorName: string;
  actorId: string;
  category: string;
  action: string;
  targetResource: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED' | 'INFO';
  details: string;
  ipMask: string;
  actorEmail?: string;
  sourceEngine: 'Auth Registry' | 'Audit Trail' | '3FA Gatekeeper' | 'Backend SMTP Monitor';
}

function inferRoleGroup(roleStr: string, actionStr = '', detailsStr = ''): 'student' | 'teacher' | 'parent' | 'admin' {
  const combined = `${roleStr} ${actionStr} ${detailsStr}`.toLowerCase();
  if (combined.includes('parent') || combined.includes('guardian') || combined.includes('par-')) {
    return 'parent';
  }
  if (combined.includes('teacher') || combined.includes('educator') || combined.includes('faculty') || combined.includes('tch-')) {
    return 'teacher';
  }
  if (
    combined.includes('student') ||
    combined.includes('candidate') ||
    combined.includes('learner') ||
    combined.includes('jamb') ||
    combined.includes('stu-')
  ) {
    return 'student';
  }
  return 'admin';
}

export const AdminBackendLogsPortal: React.FC<AdminBackendLogsPortalProps> = ({
  onExitToPublic,
  adminSession,
}) => {
  const [activeSection, setActiveSection] = useState<ConsoleSection>('logs_monitor');
  const [activeTab, setActiveTab] = useState<LogMonitorTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'INFO' | 'WARNING' | 'DENIED'>('ALL');
  const [unmaskPII, setUnmaskPII] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  // Backend Email Server & Secured Registry state (Admin Bearer Protected)
  const [emailStatus, setEmailStatus] = useState<ServerEmailStatus | null>(null);
  const [emailLogs, setEmailLogs] = useState<ServerEmailLogEntry[]>([]);
  const [serverUsers, setServerUsers] = useState<ServerRegisteredUserEntry[]>([]);
  const [serverActivities, setServerActivities] = useState<ServerPublicActivityEntry[]>([]);
  const [emailDirFilter, setEmailDirFilter] = useState<'ALL' | 'ADMIN_ALERT' | 'USER_FEEDBACK' | 'ADMIN_OUTREACH'>('ALL');
  const [smtpVerifyResult, setSmtpVerifyResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [isVerifyingSmtp, setIsVerifyingSmtp] = useState(false);

  // Admin-to-User Outreach Composer state
  const [outreachMode, setOutreachMode] = useState<'single' | 'role'>('single');
  const [outreachTargetRole, setOutreachTargetRole] = useState<'all' | 'student' | 'teacher' | 'parent'>('student');
  const [outreachEmail, setOutreachEmail] = useState('');
  const [outreachName, setOutreachName] = useState('');
  const [outreachUserRole, setOutreachUserRole] = useState<'student' | 'teacher' | 'parent'>('student');
  const [outreachSubject, setOutreachSubject] = useState('');
  const [outreachActivityContext, setOutreachActivityContext] = useState('');
  const [outreachMessage, setOutreachMessage] = useState('');
  const [isSendingOutreach, setIsSendingOutreach] = useState(false);
  const [outreachFeedback, setOutreachFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    const onUpdated = () => setRefreshTick((t) => t + 1);
    window.addEventListener('ilearnit:ai_records_updated', onUpdated);
    return () => window.removeEventListener('ilearnit:ai_records_updated', onUpdated);
  }, []);

  useEffect(() => {
    let active = true;
    const loadServerTelemetry = async () => {
      const localUsers = getRegisteredUsers();
      await syncRegisteredUsersToBackend(localUsers);
      const [statusRes, logsRes, regRes] = await Promise.all([
        fetchAdminEmailStatus(),
        fetchAdminEmailLogs(),
        fetchAdminSecuredRegistry(),
      ]);
      if (!active) return;
      if (statusRes) setEmailStatus(statusRes);
      if (logsRes) setEmailLogs(logsRes.logs);
      if (regRes) {
        setServerUsers(regRes.users);
        setServerActivities(regRes.activityLogs);
      }
    };
    loadServerTelemetry();
    return () => {
      active = false;
    };
  }, [refreshTick]);

  const handleRefresh = () => {
    setRefreshTick((t) => t + 1);
    setLastRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  const handleVerifySmtp = async () => {
    setIsVerifyingSmtp(true);
    setSmtpVerifyResult(null);
    try {
      const res = await verifyAdminSmtpConnection();
      setSmtpVerifyResult({ ok: res.success, message: res.message });
      handleRefresh();
    } catch (err: any) {
      setSmtpVerifyResult({ ok: false, message: err?.message || 'Failed to verify SMTP connection.' });
    } finally {
      setIsVerifyingSmtp(false);
    }
  };

  const openContactComposerForUser = (params: {
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'parent';
    activityContext?: string;
    defaultSubject?: string;
  }) => {
    setOutreachMode('single');
    setOutreachName(params.name);
    setOutreachEmail(params.email);
    setOutreachUserRole(params.role);
    setOutreachActivityContext(params.activityContext || '');
    setOutreachSubject(params.defaultSubject || `iLearnit-365 Follow-Up for ${params.name}`);
    setOutreachMessage(
      params.activityContext
        ? `Thank you for your recent activity on iLearnit-365 (${params.activityContext}). Our administration desk is following up to support your progress.`
        : `Greetings from iLearnit-365 Administration (ilearnit365@gmail.com). We are reaching out regarding your ${params.role} account.`
    );
    setOutreachFeedback(null);
    setActiveSection('email_server');
  };

  const handleSendOutreach = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingOutreach(true);
    setOutreachFeedback(null);

    try {
      const res = await sendAdminEmailOutreach({
        targetMode: outreachMode,
        recipientEmail: outreachMode === 'single' ? outreachEmail : undefined,
        recipientName: outreachMode === 'single' ? outreachName : undefined,
        recipientRole: outreachMode === 'single' ? outreachUserRole : undefined,
        targetRole: outreachMode === 'role' ? outreachTargetRole : undefined,
        subject: outreachSubject,
        message: outreachMessage,
        activityContext: outreachActivityContext || undefined,
        extraRecipients: users.map((u) => ({ name: u.name, email: u.email, role: u.role })),
      });

      if (!res.success) {
        setOutreachFeedback({ ok: false, text: res.error || 'Failed to send outreach email.' });
      } else {
        const sent = res.sentCount || 0;
        const queued = res.queuedCount || 0;
        const text =
          sent > 0
            ? `Delivered ${sent} email(s) via ${res.senderEmail || 'ilearnit365@gmail.com'}.`
            : `Logged ${queued} outreach email(s) in queue via ilearnit365@gmail.com (configure SMTP_PASS in Settings -> Secrets for live delivery).`;
        setOutreachFeedback({ ok: true, text });
        setOutreachSubject('');
        setOutreachMessage('');
        setOutreachActivityContext('');
        handleRefresh();
      }
    } catch (err: any) {
      setOutreachFeedback({ ok: false, text: err?.message || 'Error dispatching admin outreach.' });
    } finally {
      setIsSendingOutreach(false);
    }
  };

  const {
    users,
    studentUsers,
    teacherUsers,
    parentUsers,
    unifiedLogs,
    aiRecords,
  } = useMemo(() => {
    void refreshTick;
    const localUsers: RegisteredUser[] = getRegisteredUsers();
    const userByKey = new Map<string, RegisteredUser>();
    localUsers.forEach((u) => userByKey.set(u.email.toLowerCase(), u));

    serverUsers.forEach((su) => {
      const key = su.email.toLowerCase();
      if (!userByKey.has(key)) {
        userByKey.set(key, {
          id: su.id,
          studentId: su.studentId,
          pin: su.pin,
          recoveryKey: 'SERVER-SECURED',
          name: su.name,
          email: su.email,
          role: su.role,
          avatar: '',
          gradeLevel: su.gradeLevel,
          gpa: 3.9,
          attendance: '100%',
          streakDays: 1,
          schoolName: su.schoolName,
          phone: su.phone,
          teachingSubject: su.teachingSubject,
          linkedChildName: su.linkedChildName,
          linkedChildPin: su.linkedChildPin,
          parentName: su.parentName,
          parentalConsentVerified: su.parentalConsentVerified,
          consentCode: su.consentCode,
          registrationTimestamp: su.registrationTimestamp,
          securityVerified: true,
          conductRemarks: 'Synced with secured backend registry.',
          subjects: [],
          termPerformance: [],
        });
      }
    });

    const allUsers = Array.from(userByKey.values());
    const authEvents: SecurityAuditRecord[] = getAuditLogs();
    const trailEvents: AuditTrailRecord[] = getSystemAuditTrail();
    const factorEvents = get3FAAuditLogs();
    const aiList: AIOutputRecord[] = getAIOutputRecords();

    const merged: UnifiedLogRow[] = [];

    serverActivities.forEach((sa) => {
      const group: UnifiedLogRow['actorRoleGroup'] =
        sa.actorRole === 'student' || sa.actorRole === 'teacher' || sa.actorRole === 'parent'
          ? sa.actorRole
          : inferRoleGroup(sa.actorRole, sa.activityType, sa.details);
      merged.push({
        id: `srv-${sa.id}`,
        timestamp: sa.timestamp,
        actorRoleGroup: group,
        actorRoleLabel: sa.actorRole.toUpperCase(),
        actorName: sa.actorName,
        actorId: sa.actorId || 'PUBLIC-EVENT',
        actorEmail: sa.actorEmail,
        category: sa.activityType,
        action: sa.activityType.replace(/_/g, ' '),
        targetResource: sa.targetResource,
        status: sa.adminEmailStatus === 'FAILED' ? 'WARNING' : 'SUCCESS',
        details: `${sa.details}${sa.adminEmailStatus ? ` · Admin Alert: ${sa.adminEmailStatus}` : ''}`,
        ipMask: sa.ipMask || 'Verified Public Gateway',
        sourceEngine: 'Backend SMTP Monitor',
      });
    });

    trailEvents.forEach((t) => {
      const group = inferRoleGroup(t.actorRole, t.action, `${t.targetResource} ${t.details}`);
      merged.push({
        id: `trail-${t.id}`,
        timestamp: t.timestamp,
        actorRoleGroup: group,
        actorRoleLabel: t.actorRole,
        actorName: t.actorName,
        actorId: t.actorId,
        category: t.category,
        action: t.action,
        targetResource: t.targetResource,
        status: t.status,
        details: t.details,
        ipMask: t.ipMask || '102.89.44.xxx',
        sourceEngine: 'Audit Trail',
      });
    });

    authEvents.forEach((a) => {
      const group = inferRoleGroup(a.userRole, a.action, a.details);
      merged.push({
        id: `auth-${a.id}`,
        timestamp: a.timestamp,
        actorRoleGroup: group,
        actorRoleLabel: a.userRole,
        actorName: a.userName,
        actorId: a.userId,
        category: a.action,
        action: a.action.replace(/_/g, ' '),
        targetResource: 'Identity Registry',
        status: a.status === 'FLAGGED' ? 'WARNING' : 'SUCCESS',
        details: a.details,
        ipMask: a.ipMask,
        sourceEngine: 'Auth Registry',
      });
    });

    factorEvents.forEach((f) => {
      merged.push({
        id: `3fa-${f.id}`,
        timestamp: f.timestamp,
        actorRoleGroup: 'admin',
        actorRoleLabel: 'ADMIN_AUTH',
        actorName: f.adminId,
        actorId: f.adminId,
        category: f.factor,
        action: `Admin ${f.factor.replace(/_/g, ' ')}`,
        targetResource: 'Private Enclave Gatekeeper',
        status: f.status === 'FAILED' ? 'DENIED' : 'SUCCESS',
        details: f.details,
        ipMask: 'Lagos Core Enclave',
        sourceEngine: '3FA Gatekeeper',
      });
    });

    merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      users: allUsers,
      studentUsers: allUsers.filter((u) => u.role === 'student'),
      teacherUsers: allUsers.filter((u) => u.role === 'teacher'),
      parentUsers: allUsers.filter((u) => u.role === 'parent'),
      unifiedLogs: merged,
      aiRecords: aiList,
    };
  }, [refreshTick, serverUsers, serverActivities]);

  const displayedUsers = useMemo(() => {
    let base = users;
    if (activeTab === 'student') base = studentUsers;
    else if (activeTab === 'teacher') base = teacherUsers;
    else if (activeTab === 'parent') base = parentUsers;

    const q = searchQuery.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.studentId.toLowerCase().includes(q) ||
        u.gradeLevel.toLowerCase().includes(q) ||
        (u.linkedChildName || '').toLowerCase().includes(q) ||
        (u.teachingSubject || '').toLowerCase().includes(q)
    );
  }, [users, studentUsers, teacherUsers, parentUsers, activeTab, searchQuery]);

  const displayedLogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return unifiedLogs.filter((log) => {
      if (activeTab === 'student' && log.actorRoleGroup !== 'student') return false;
      if (activeTab === 'teacher' && log.actorRoleGroup !== 'teacher') return false;
      if (activeTab === 'parent' && log.actorRoleGroup !== 'parent') return false;
      if (statusFilter !== 'ALL' && log.status !== statusFilter) return false;
      if (!q) return true;
      return (
        log.actorName.toLowerCase().includes(q) ||
        log.actorId.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.targetResource.toLowerCase().includes(q) ||
        log.category.toLowerCase().includes(q)
      );
    });
  }, [unifiedLogs, activeTab, statusFilter, searchQuery]);

  const handleDownloadCSV = () => {
    const csv = exportAuditLogsAsCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ilearnit365-admin-backend-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const payload = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        exportedBy: adminSession?.adminName || 'Authorized Administrator',
        counts: {
          students: studentUsers.length,
          teachers: teacherUsers.length,
          parents: parentUsers.length,
          logs: unifiedLogs.length,
        },
        users: unmaskPII
          ? users
          : users.map((u) => ({
              ...u,
              name: maskName(u.name),
              email: maskEmail(u.email),
              pin: maskPin(u.pin),
              phone: maskPhone(u.phone),
            })),
        logs: unifiedLogs,
        aiOutputs: aiRecords,
      },
      null,
      2
    );
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ilearnit365-full-registry-audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStatusBadge = (status: UnifiedLogRow['status']) => {
    if (status === 'SUCCESS') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" /> SUCCESS
        </span>
      );
    }
    if (status === 'WARNING') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <AlertTriangle className="w-3 h-3" /> WARNING
        </span>
      );
    }
    if (status === 'DENIED') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
          <XCircle className="w-3 h-3" /> DENIED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
        <Info className="w-3 h-3" /> INFO
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#071120] text-slate-100 font-sans pb-16">
      {/* Top Executive Admin Bar (Outside Public Layout) */}
      <header className="bg-[#0B1D3A] border-b border-blue-500/30 px-4 sm:px-8 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-md">
                  Private Admin Enclave · Outside Public Site
                </span>
                <span className="text-[11px] font-mono text-slate-300">
                  Last Sync: {lastRefreshedAt}
                </span>
              </div>
              <h1 className="font-sora font-extrabold text-xl sm:text-2xl text-white mt-1">
                Administrative Backend Logs &amp; Registry Monitor
              </h1>
              <p className="text-xs text-slate-300">
                Centralized real-time monitoring for Student, Teacher, and Parent records, audit events, and AI oversight.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-300" />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={() => setUnmaskPII((v) => !v)}
              className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition ${
                unmaskPII
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {unmaskPII ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{unmaskPII ? 'Mask PII' : 'Unmask PII'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadJSON}
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>JSON Backup</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={onExitToPublic}
              className="px-3.5 py-2 rounded-xl bg-white text-[#0B1D3A] hover:bg-slate-100 text-xs font-sora font-bold flex items-center gap-1.5 cursor-pointer transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>
          </div>
        </div>

        {/* Internal Admin Module Switcher (Only visible inside unlocked admin console) */}
        <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-slate-700/70 flex flex-wrap items-center gap-2 text-xs">
          {[
            { id: 'logs_monitor' as const, label: 'Students / Teachers / Parents Logs', icon: Activity },
            { id: 'email_server' as const, label: 'Email Server & Outreach (ilearnit365@gmail.com)', icon: Mail },
            { id: 'master_vault' as const, label: 'Registrar Master Vault', icon: Users },
            { id: 'cheal_enclave' as const, label: 'CHEAL SOC Enclave', icon: Shield },
            { id: 'security_otp' as const, label: 'Security & OTP Center', icon: Lock },
            { id: 'cloud_deploy' as const, label: 'Cloud CI/CD Hub', icon: Cloud },
          ].map((sec) => {
            const Icon = sec.icon;
            const active = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`px-3.5 py-2 rounded-xl font-sora font-bold flex items-center gap-2 transition cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {activeSection === 'master_vault' && (
          <AdminDashboard onNavigateRole={() => setActiveSection('logs_monitor')} isStandaloneMode />
        )}
        {activeSection === 'cheal_enclave' && (
          <ChealSecureHub onNavigateRole={() => setActiveSection('logs_monitor')} onClose={() => setActiveSection('logs_monitor')} />
        )}
        {activeSection === 'security_otp' && (
          <ILearnitSecurityCenter onNavigateRole={() => setActiveSection('logs_monitor')} onClose={() => setActiveSection('logs_monitor')} />
        )}
        {activeSection === 'cloud_deploy' && (
          <NetlifyCloudDeploymentHub onNavigateRole={() => setActiveSection('logs_monitor')} />
        )}

        {/* ADMIN-ONLY EMAIL SERVER MONITOR & USER OUTREACH CONSOLE */}
        {activeSection === 'email_server' && (
          <div className="space-y-6">
            {/* SMTP Server Health Header */}
            <div className="bg-[#0B1D3A] border border-blue-500/30 rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-700/70 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 px-2.5 py-0.5 rounded-md">
                      Admin-Only SMTP Server Monitor
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md border ${
                        emailStatus?.configured
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                      }`}
                    >
                      {emailStatus?.configured ? 'SMTP Transport Active' : 'Queued Mode (Set SMTP_PASS Secret)'}
                    </span>
                  </div>
                  <h2 className="font-sora font-extrabold text-xl text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-cyan-300" />
                    <span>{emailStatus?.senderEmail || 'ilearnit365@gmail.com'} Mail Relay &amp; Activity Dispatcher</span>
                  </h2>
                  <p className="text-xs text-slate-300">
                    Monitors automated feedback to registered Students, Teachers &amp; Parents, SMTP activity alerts to Admin, and direct admin-to-user outreach.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleVerifySmtp}
                    disabled={isVerifyingSmtp}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#0B1D3A] font-sora font-extrabold text-xs flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
                  >
                    <Wifi className={`w-4 h-4 ${isVerifyingSmtp ? 'animate-pulse' : ''}`} />
                    <span>{isVerifyingSmtp ? 'Testing SMTP...' : 'Verify Live SMTP'}</span>
                  </button>
                </div>
              </div>

              {smtpVerifyResult && (
                <div
                  className={`rounded-xl p-3.5 text-xs border flex items-center gap-2.5 ${
                    smtpVerifyResult.ok
                      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                      : 'bg-amber-950/50 border-amber-500/40 text-amber-200'
                  }`}
                >
                  {smtpVerifyResult.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                  )}
                  <span>{smtpVerifyResult.message}</span>
                </div>
              )}

              {/* Server Config & Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                  <div className="text-[10px] font-mono uppercase text-slate-400">SMTP Gateway</div>
                  <div className="font-mono font-bold text-sm text-white mt-1">
                    {emailStatus?.smtpHost || 'smtp.gmail.com'}:{emailStatus?.smtpPort || 465}
                  </div>
                  <div className="text-[11px] text-cyan-300 font-mono mt-1 truncate">
                    Alerts → {emailStatus?.adminNotifyEmails?.join(', ') || 'ilearnit365@gmail.com'}
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4">
                  <div className="text-[10px] font-mono uppercase text-emerald-300">Delivered Emails</div>
                  <div className="font-sora font-extrabold text-2xl text-white mt-1">
                    {emailStatus?.stats.sentCount ?? 0}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1">
                    Verified SMTP transmissions
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4">
                  <div className="text-[10px] font-mono uppercase text-amber-300">Queued / Pending Secret</div>
                  <div className="font-sora font-extrabold text-2xl text-white mt-1">
                    {emailStatus?.stats.queuedCount ?? 0}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1">
                    {emailStatus?.configured ? 'Ready for immediate delivery' : 'Set SMTP_PASS in Secrets'}
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-purple-500/30 rounded-xl p-4">
                  <div className="text-[10px] font-mono uppercase text-purple-300">Admin Alerts Logged</div>
                  <div className="font-sora font-extrabold text-2xl text-white mt-1">
                    {emailStatus?.stats.adminAlertsCount ?? 0}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1">
                    Failed: {emailStatus?.stats.failedCount ?? 0} · Outreach: {emailStatus?.stats.adminOutreachCount ?? 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Admin-to-User Outreach Composer */}
            <div className="bg-[#0B1D3A] border border-slate-700/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/70 pb-3">
                <div>
                  <h3 className="font-sora font-bold text-base text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>Contact Registered Users from ilearnit365@gmail.com</span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Send feedback or respond to any public-page activity carried out by Students, Teachers, or Parents.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setOutreachMode('single')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sora font-bold cursor-pointer transition ${
                      outreachMode === 'single' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Single User
                  </button>
                  <button
                    type="button"
                    onClick={() => setOutreachMode('role')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sora font-bold cursor-pointer transition ${
                      outreachMode === 'role' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Role Group Broadcast
                  </button>
                </div>
              </div>

              {outreachFeedback && (
                <div
                  className={`rounded-xl p-3.5 text-xs border flex items-center gap-2.5 ${
                    outreachFeedback.ok
                      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
                  }`}
                >
                  {outreachFeedback.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                  <span>{outreachFeedback.text}</span>
                </div>
              )}

              <form onSubmit={handleSendOutreach} className="space-y-4">
                {outreachMode === 'single' ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                        Quick-Pick Registered User
                      </label>
                      <select
                        value={outreachEmail}
                        onChange={(e) => {
                          const picked = users.find((u) => u.email.toLowerCase() === e.target.value.toLowerCase());
                          if (picked) {
                            setOutreachEmail(picked.email);
                            setOutreachName(picked.name);
                            setOutreachUserRole(picked.role);
                          } else {
                            setOutreachEmail(e.target.value);
                          }
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="">-- Select or type email --</option>
                        {users.map((u) => (
                          <option key={u.id} value={u.email}>
                            [{u.role.toUpperCase()}] {unmaskPII ? `${u.name} (${u.email})` : `${maskName(u.name)} (${maskEmail(u.email)})`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                        Recipient Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={outreachEmail}
                        onChange={(e) => setOutreachEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                        Recipient Name &amp; Role
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={outreachName}
                          onChange={(e) => setOutreachName(e.target.value)}
                          placeholder="Full Name"
                          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                        <select
                          value={outreachUserRole}
                          onChange={(e) => setOutreachUserRole(e.target.value as any)}
                          className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2.5 text-xs text-white"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="parent">Parent</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                        Target Role Group
                      </label>
                      <select
                        value={outreachTargetRole}
                        onChange={(e) => setOutreachTargetRole(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="student">All Registered Students ({studentUsers.length})</option>
                        <option value="teacher">All Registered Teachers ({teacherUsers.length})</option>
                        <option value="parent">All Registered Parents ({parentUsers.length})</option>
                        <option value="all">All Registered Users ({users.length})</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                        Activity Reference (Optional)
                      </label>
                      <input
                        type="text"
                        value={outreachActivityContext}
                        onChange={(e) => setOutreachActivityContext(e.target.value)}
                        placeholder="e.g. Post-Registration Welcome / JAMB Mock Follow-Up"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                      Email Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={outreachSubject}
                      onChange={(e) => setOutreachSubject(e.target.value)}
                      placeholder="Official Academic Feedback from iLearnit-365"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  {outreachMode === 'single' && (
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                        Related Public Activity (Optional)
                      </label>
                      <input
                        type="text"
                        value={outreachActivityContext}
                        onChange={(e) => setOutreachActivityContext(e.target.value)}
                        placeholder="e.g. JAMB Test Drill / New Registration"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                    Message Body *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={outreachMessage}
                    onChange={(e) => setOutreachMessage(e.target.value)}
                    placeholder="Write feedback or guidance for the student, teacher, or parent..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSendingOutreach}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 text-[#0B1D3A] font-sora font-extrabold text-xs flex items-center gap-2 cursor-pointer transition disabled:opacity-50 shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSendingOutreach ? 'Dispatching...' : 'Send Email via ilearnit365@gmail.com'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* SMTP Dispatch & Admin Notification Audit Table */}
            <div className="bg-[#0B1D3A] border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
              <div className="px-5 py-4 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-sora font-bold text-base text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-300" />
                    <span>Backend SMTP Server Logs</span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Tracks every outgoing feedback email, SMTP admin notification, and admin-to-user outreach dispatch.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(['ALL', 'USER_FEEDBACK', 'ADMIN_ALERT', 'ADMIN_OUTREACH'] as const).map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => setEmailDirFilter(dir)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition ${
                        emailDirFilter === dir
                          ? 'bg-amber-400 text-[#0B1D3A]'
                          : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {dir === 'ALL'
                        ? `ALL (${emailLogs.length})`
                        : dir.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                {emailLogs.filter((l) => emailDirFilter === 'ALL' || l.direction === emailDirFilter).length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-300">
                    No SMTP dispatches recorded yet. Public registrations, public activities, or Admin outreach messages will appear here in real time.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950/70 text-slate-300 font-mono uppercase text-[10px] border-b border-slate-800">
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Channel</th>
                        <th className="py-3 px-4">From / Recipient</th>
                        <th className="py-3 px-4">Subject &amp; Preview</th>
                        <th className="py-3 px-4">Delivery Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {emailLogs
                        .filter((l) => emailDirFilter === 'ALL' || l.direction === emailDirFilter)
                        .map((mail) => (
                          <tr key={mail.id} className="hover:bg-slate-900/50 transition">
                            <td className="py-3 px-4 align-top font-mono text-[11px] text-slate-300 whitespace-nowrap">
                              <div>{new Date(mail.timestamp).toLocaleDateString()}</div>
                              <div className="text-slate-400">
                                {new Date(mail.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })}
                              </div>
                            </td>
                            <td className="py-3 px-4 align-top">
                              <span
                                className={`inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                                  mail.direction === 'ADMIN_ALERT'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    : mail.direction === 'ADMIN_OUTREACH'
                                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                                    : 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30'
                                }`}
                              >
                                {mail.direction.replace(/_/g, ' ')}
                              </span>
                              <div className="text-[10px] font-mono text-slate-400 mt-1">{mail.triggeredBy}</div>
                            </td>
                            <td className="py-3 px-4 align-top">
                              <div className="text-[10px] font-mono text-slate-400">From: {mail.fromEmail}</div>
                              <div className="font-semibold text-white mt-0.5">
                                {unmaskPII ? mail.recipientName : maskName(mail.recipientName)}
                              </div>
                              <div className="font-mono text-[11px] text-cyan-300">
                                {unmaskPII ? mail.toEmail : maskEmail(mail.toEmail)}
                              </div>
                            </td>
                            <td className="py-3 px-4 align-top max-w-md">
                              <div className="font-sora font-bold text-slate-100">{mail.subject}</div>
                              <div className="text-slate-300 text-[11px] mt-1 line-clamp-2">{mail.bodyPreview}</div>
                              {mail.errorMessage && (
                                <div className="text-[10px] font-mono text-amber-300 mt-1">{mail.errorMessage}</div>
                              )}
                            </td>
                            <td className="py-3 px-4 align-top">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                                  mail.status === 'SENT'
                                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                    : mail.status === 'FAILED'
                                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                    : 'bg-amber-500/15 text-amber-200 border-amber-500/30'
                                }`}
                              >
                                {mail.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'logs_monitor' && (
          <>
            {/* KPI Summary Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0B1D3A] border border-blue-500/30 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase text-blue-300 font-bold">Students Registered</span>
                  <div className="font-sora font-extrabold text-3xl text-white mt-1">{studentUsers.length}</div>
                  <span className="text-[11px] text-slate-300">
                    Logs: {unifiedLogs.filter((l) => l.actorRoleGroup === 'student').length} tracked events
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#0B1D3A] border border-emerald-500/30 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase text-emerald-300 font-bold">Teachers &amp; Faculty</span>
                  <div className="font-sora font-extrabold text-3xl text-white mt-1">{teacherUsers.length}</div>
                  <span className="text-[11px] text-slate-300">
                    Logs: {unifiedLogs.filter((l) => l.actorRoleGroup === 'teacher').length} tracked events
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#0B1D3A] border border-amber-500/30 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase text-amber-300 font-bold">Parents &amp; Guardians</span>
                  <div className="font-sora font-extrabold text-3xl text-white mt-1">{parentUsers.length}</div>
                  <span className="text-[11px] text-slate-300">
                    Logs: {unifiedLogs.filter((l) => l.actorRoleGroup === 'parent').length} tracked events
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <HeartHandshake className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#0B1D3A] border border-purple-500/30 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase text-purple-300 font-bold">Total Audit Events</span>
                  <div className="font-sora font-extrabold text-3xl text-white mt-1">{unifiedLogs.length}</div>
                  <span className="text-[11px] text-slate-300">
                    AI Outputs Monitored: {aiRecords.length}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                  <Server className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Filter & Role Tabs Toolbar */}
            <div className="bg-[#0B1D3A] border border-slate-700/80 rounded-2xl p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all' as const, label: `All Records & Logs (${unifiedLogs.length})` },
                    { id: 'student' as const, label: `Students (${studentUsers.length})` },
                    { id: 'teacher' as const, label: `Teachers (${teacherUsers.length})` },
                    { id: 'parent' as const, label: `Parents (${parentUsers.length})` },
                    { id: 'ai_security' as const, label: `AI Transparency & Overrides (${aiRecords.length})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-sora font-bold transition cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-amber-400 text-[#0B1D3A] shadow'
                          : 'bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                  <div className="relative flex-1 sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter by user, ID, PIN, action..."
                      aria-label="Search backend logs and user records"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    aria-label="Filter logs by status"
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="SUCCESS">SUCCESS</option>
                    <option value="INFO">INFO</option>
                    <option value="WARNING">WARNING</option>
                    <option value="DENIED">DENIED</option>
                  </select>
                </div>
              </div>
            </div>

            {/* AI Transparency Section when ai_security tab active */}
            {activeTab === 'ai_security' ? (
              <div className="bg-[#0B1D3A] border border-slate-700/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <h2 className="font-sora font-bold text-base text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-300" /> AI Explanations, Grounding &amp; Educator Overrides Log
                  </h2>
                  <span className="text-xs font-mono text-slate-300">{aiRecords.length} Records</span>
                </div>
                <div className="space-y-3">
                  {aiRecords.map((rec) => (
                    <div key={rec.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-bold text-white">
                          {rec.sourceFeature} · <span className="text-blue-300">{rec.subject}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                            rec.reviewStatus === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : rec.reviewStatus === 'overridden'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-slate-700 text-slate-200'
                          }`}
                        >
                          {rec.reviewStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-slate-200">Prompt: {rec.promptSummary}</div>
                      <div className="text-slate-300">
                        User: {unmaskPII ? rec.createdByUser : maskName(rec.createdByUser)} · Time: {rec.createdAt}
                      </div>
                      <div className="text-slate-400">
                        Model &amp; Sources: {rec.modelUsed} ({rec.groundingSources.join(' · ')})
                      </div>
                      {rec.teacherOverrideText && (
                        <div className="p-2.5 rounded-lg bg-amber-950/50 border border-amber-500/40 text-amber-200">
                          Educator Override ({rec.reviewedBy}): {rec.teacherOverrideText}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* REGISTERED PROFILES DIRECTORY TABLE */}
                <div className="bg-[#0B1D3A] border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
                  <div className="px-5 py-4 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="font-sora font-bold text-base text-white">
                        {activeTab === 'student'
                          ? 'Registered Student Records'
                          : activeTab === 'teacher'
                          ? 'Registered Teacher & Faculty Records'
                          : activeTab === 'parent'
                          ? 'Registered Parent & Guardian Records'
                          : 'Complete Students, Teachers & Parents Directory'}
                      </h2>
                      <p className="text-[11px] text-slate-300">
                        {unmaskPII
                          ? 'Decrypted Admin View Active — Full names, emails, and access PINs visible.'
                          : 'NDPA Data-Minimization Mode Active — PII masked until you click Unmask PII.'}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg text-slate-200">
                      {displayedUsers.length} Accounts
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-950/70 text-slate-300 font-mono uppercase text-[10px] border-b border-slate-800">
                          <th className="py-3 px-4">Role &amp; ID</th>
                          <th className="py-3 px-4">Name &amp; Contact</th>
                          <th className="py-3 px-4">Academic / Linked Details</th>
                          <th className="py-3 px-4">PIN &amp; Consent Status</th>
                          <th className="py-3 px-4">Registered At</th>
                          <th className="py-3 px-4 text-right">Outreach</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {displayedUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-900/50 transition">
                            <td className="py-3 px-4 align-top">
                              <span
                                className={`inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase mb-1 ${
                                  u.role === 'student'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : u.role === 'teacher'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {u.role}
                              </span>
                              <div className="font-mono text-slate-200 font-semibold">{u.studentId}</div>
                            </td>
                            <td className="py-3 px-4 align-top">
                              <div className="font-sora font-bold text-white">
                                {unmaskPII ? u.name : maskName(u.name)}
                              </div>
                              <div className="font-mono text-[11px] text-slate-300">
                                {unmaskPII ? u.email : maskEmail(u.email)}
                              </div>
                              {(u.phone || u.parentPhone) && (
                                <div className="font-mono text-[10px] text-slate-400">
                                  {unmaskPII ? u.phone || u.parentPhone : maskPhone(u.phone || u.parentPhone)}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4 align-top text-slate-200">
                              <div className="font-semibold">{u.gradeLevel}</div>
                              <div className="text-[11px] text-slate-400">{u.schoolName || 'iLearnit-365 Academy'}</div>
                              {u.role === 'teacher' && u.teachingSubject && (
                                <div className="text-[11px] text-emerald-300">Subject: {u.teachingSubject}</div>
                              )}
                              {u.role === 'parent' && u.linkedChildName && (
                                <div className="text-[11px] text-amber-300">
                                  Child: {unmaskPII ? u.linkedChildName : maskName(u.linkedChildName)} (PIN:{' '}
                                  {unmaskPII ? u.linkedChildPin || 'N/A' : maskPin(u.linkedChildPin || '0000')})
                                </div>
                              )}
                              {u.role === 'student' && (
                                <div className="text-[11px] text-blue-300">
                                  GPA: {u.gpa} · Attendance: {u.attendance}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4 align-top">
                              <div className="font-mono font-bold text-emerald-300">
                                PIN: {unmaskPII ? u.pin : maskPin(u.pin)}
                              </div>
                              {u.role !== 'teacher' && (
                                <div className="text-[10px] font-mono text-slate-300 mt-1">
                                  Consent:{' '}
                                  {u.parentalConsentVerified
                                    ? `Verified (${u.consentCode || 'NDPA-OK'})`
                                    : u.ageBracket === 'adult'
                                    ? 'Adult 18+'
                                    : 'Pending'}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4 align-top font-mono text-[11px] text-slate-300">
                              {new Date(u.registrationTimestamp).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 align-top text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  openContactComposerForUser({
                                    name: u.name,
                                    email: u.email,
                                    role: u.role,
                                    activityContext: `${u.role.toUpperCase()} Registration (${u.studentId})`,
                                    defaultSubject: `Welcome & Registration Follow-Up (${u.studentId})`,
                                  })
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-200 font-mono text-[10px] font-bold cursor-pointer transition"
                              >
                                <Mail className="w-3 h-3" />
                                <span>Contact</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ACTIVITY & AUDIT LOGS STREAM */}
                <div className="bg-[#0B1D3A] border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
                  <div className="px-5 py-4 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="font-sora font-bold text-base text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <span>
                          {activeTab === 'student'
                            ? 'Student Activity & Exam Logs'
                            : activeTab === 'teacher'
                            ? 'Teacher & Classroom Logs'
                            : activeTab === 'parent'
                            ? 'Parent & Guardian Access Logs'
                            : 'Unified Backend Activity Logs (Students, Teachers, Parents & Security)'}
                        </span>
                      </h2>
                      <p className="text-[11px] text-slate-300">
                        Immutable chronological ledger tracking registrations, logins, JAMB tests, teacher actions, parent PIN checks, and 3FA access.
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg text-slate-200">
                      {displayedLogs.length} Events
                    </span>
                  </div>

                  {displayedLogs.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-300">
                      No audit events match the active role/status filter.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-950/70 text-slate-300 font-mono uppercase text-[10px] border-b border-slate-800">
                            <th className="py-3 px-4">Timestamp</th>
                            <th className="py-3 px-4">Role &amp; Actor</th>
                            <th className="py-3 px-4">Action &amp; Target</th>
                            <th className="py-3 px-4">Details</th>
                            <th className="py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                          {displayedLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-900/50 transition">
                              <td className="py-3 px-4 align-top font-mono text-[11px] text-slate-300 whitespace-nowrap">
                                <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                                <div className="text-slate-400">
                                  {new Date(log.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                  })}
                                </div>
                              </td>
                              <td className="py-3 px-4 align-top">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase mb-1 ${
                                    log.actorRoleGroup === 'student'
                                      ? 'bg-blue-500/20 text-blue-300'
                                      : log.actorRoleGroup === 'teacher'
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : log.actorRoleGroup === 'parent'
                                      ? 'bg-amber-500/20 text-amber-300'
                                      : 'bg-purple-500/20 text-purple-300'
                                  }`}
                                >
                                  {log.actorRoleGroup}
                                </span>
                                <div className="font-semibold text-white">
                                  {unmaskPII ? log.actorName : maskName(log.actorName)}
                                </div>
                                <div className="font-mono text-[10px] text-slate-400">{log.actorId}</div>
                              </td>
                              <td className="py-3 px-4 align-top">
                                <div className="font-sora font-bold text-slate-100">{log.action}</div>
                                <div className="text-[11px] text-blue-300 font-mono">{log.targetResource}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{log.sourceEngine}</div>
                              </td>
                              <td className="py-3 px-4 align-top text-slate-200 max-w-md leading-relaxed">
                                {log.details}
                                <div className="text-[10px] font-mono text-slate-400 mt-1">IP/Origin: {log.ipMask}</div>
                              </td>
                              <td className="py-3 px-4 align-top space-y-2">
                                {renderStatusBadge(log.status)}
                                {log.actorEmail && (
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openContactComposerForUser({
                                          name: log.actorName,
                                          email: log.actorEmail!,
                                          role:
                                            log.actorRoleGroup === 'teacher' || log.actorRoleGroup === 'parent'
                                              ? log.actorRoleGroup
                                              : 'student',
                                          activityContext: `${log.action} (${log.targetResource})`,
                                          defaultSubject: `Regarding your activity: ${log.action}`,
                                        })
                                      }
                                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/30 text-blue-200 font-mono text-[10px] font-bold cursor-pointer transition"
                                    >
                                      <Mail className="w-3 h-3" />
                                      <span>Reply</span>
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
