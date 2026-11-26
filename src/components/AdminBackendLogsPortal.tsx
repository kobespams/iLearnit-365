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
type ConsoleSection = 'logs_monitor' | 'master_vault' | 'cheal_enclave' | 'security_otp' | 'cloud_deploy';

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
  sourceEngine: 'Auth Registry' | 'Audit Trail' | '3FA Gatekeeper';
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

  useEffect(() => {
    const onUpdated = () => setRefreshTick((t) => t + 1);
    window.addEventListener('ilearnit:ai_records_updated', onUpdated);
    return () => window.removeEventListener('ilearnit:ai_records_updated', onUpdated);
  }, []);

  const handleRefresh = () => {
    setRefreshTick((t) => t + 1);
    setLastRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
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
    const allUsers: RegisteredUser[] = getRegisteredUsers();
    const authEvents: SecurityAuditRecord[] = getAuditLogs();
    const trailEvents: AuditTrailRecord[] = getSystemAuditTrail();
    const factorEvents = get3FAAuditLogs();
    const aiList: AIOutputRecord[] = getAIOutputRecords();

    const merged: UnifiedLogRow[] = [];

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
        actorRoleLabel: 'ADMIN_3FA',
        actorName: f.adminId,
        actorId: f.adminId,
        category: f.factor,
        action: `3FA ${f.factor.replace(/_/g, ' ')}`,
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
  }, [refreshTick]);

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
                              <td className="py-3 px-4 align-top">{renderStatusBadge(log.status)}</td>
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
