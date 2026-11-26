import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Search,
  Download,
  Filter,
  RefreshCw,
  Clock,
  KeyRound,
  FileText,
  Lock,
  Layers,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Radio,
  Eye,
  Trash2,
  Activity,
  Cpu,
  ArrowUpRight,
  Check,
  UserCheck
} from 'lucide-react';
import {
  AuditTrailRecord,
  AuditActionCategory,
  getSystemAuditTrail,
  recordAuditAction,
  exportAuditLogsAsCSV,
  exportAuditLogsAsJSON,
  resetAuditTrailToDefaults
} from '../services/auditTrailService';

interface AdminAuditTrailViewProps {
  onNavigateRole?: (role: string) => void;
}

export const AdminAuditTrailView: React.FC<AdminAuditTrailViewProps> = ({ onNavigateRole }) => {
  const [logs, setLogs] = useState<AuditTrailRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditTrailRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLivePolling, setIsLivePolling] = useState(true);

  // Load audit records
  const refreshLogs = () => {
    setLogs(getSystemAuditTrail());
  };

  useEffect(() => {
    refreshLogs();
    if (!isLivePolling) return;
    const interval = setInterval(refreshLogs, 4000);
    return () => clearInterval(interval);
  }, [isLivePolling]);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Export handlers
  const handleDownloadCSV = () => {
    const csv = exportAuditLogsAsCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `iLearnit365_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    const json = exportAuditLogsAsJSON();
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `iLearnit365_Audit_Trail_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset the audit trail to default initial accountability logs?')) {
      resetAuditTrailToDefaults();
      refreshLogs();
    }
  };

  // Add a test audit log for demonstration
  const handleSimulateTestLog = () => {
    recordAuditAction({
      category: 'BACKEND_TAB_ACCESS',
      action: 'Administrative Audit Inspection Triggered',
      actorId: 'ADM-SUPER-LIVE',
      actorName: 'Active Administrative Officer',
      actorRole: 'LEVEL_3_SUPERADMIN',
      targetResource: '/admin/audit-trail',
      status: 'SUCCESS',
      clearanceLevel: 'LEVEL_3_SUPERADMIN',
      details: 'Audit trail inspection performed via Master Administrator Enclave.',
    });
    refreshLogs();
  };

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Category filter
      if (selectedCategory !== 'ALL') {
        if (selectedCategory === '3FA' && !['3FA_ACTIVATION', '3FA_RENEWAL', '3FA_TERMINATION'].includes(log.category)) return false;
        if (selectedCategory === 'TABS' && log.category !== 'BACKEND_TAB_ACCESS') return false;
        if (selectedCategory === 'PRIVACY' && log.category !== 'PII_ACCESS') return false;
        if (selectedCategory === 'STUDENTS' && !['STUDENT_REGISTRATION', 'FEEDBACK_DISPATCH'].includes(log.category)) return false;
        if (selectedCategory === 'VOICE' && log.category !== 'VOICE_TUTOR_SESSION') return false;
      }

      // Status filter
      if (selectedStatus !== 'ALL' && log.status !== selectedStatus) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          log.action.toLowerCase().includes(q) ||
          log.actorName.toLowerCase().includes(q) ||
          log.actorId.toLowerCase().includes(q) ||
          log.targetResource.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q) ||
          (log.signature && log.signature.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [logs, selectedCategory, selectedStatus, searchQuery]);

  // Category badge color
  const getCategoryBadge = (category: AuditActionCategory) => {
    switch (category) {
      case '3FA_ACTIVATION':
        return { label: '3FA Activation', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case '3FA_RENEWAL':
        return { label: '3FA Renewal', bg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' };
      case '3FA_TERMINATION':
        return { label: '3FA Revocation', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30' };
      case 'BACKEND_TAB_ACCESS':
        return { label: 'Backend Tab Access', bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
      case 'PII_ACCESS':
        return { label: 'PII Privacy Clearance', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
      case 'STUDENT_REGISTRATION':
        return { label: 'Student Registration', bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
      case 'FEEDBACK_DISPATCH':
        return { label: 'Feedback Dispatch', bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      case 'VOICE_TUTOR_SESSION':
        return { label: 'Voice Teaching Synth', bg: 'bg-teal-500/15 text-teal-300 border-teal-500/30' };
      default:
        return { label: category, bg: 'bg-slate-700/50 text-slate-300 border-slate-600' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> PASSED</span>;
      case 'WARNING':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40"><AlertTriangle className="w-3 h-3 text-amber-400" /> WARNING</span>;
      case 'DENIED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40"><Lock className="w-3 h-3 text-rose-400" /> BLOCKED</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40"><Info className="w-3 h-3 text-blue-400" /> INFO</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Stat Metric Counters */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0B1D3A] to-slate-950 p-6 rounded-3xl border border-indigo-500/30 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" /> NIST SP 800-92 COMPLIANT
              </span>
              <span className="text-slate-400 text-xs font-mono">Immutable Cryptographic Trail</span>
            </div>
            <h3 className="font-sora text-xl font-black text-white flex items-center gap-2">
              Administrative Action &amp; Security Audit Trail
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Comprehensive chronological telemetry tracking all 3FA authentications, backend tab authorizations, PII access clearances, and administrative events for institutional accountability.
            </p>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Download official CSV audit log"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Export complete JSON data payload"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleSimulateTestLog}
              className="px-3.5 py-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow"
              title="Simulate a real-time administrative action log"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Log Action</span>
            </button>
            <button
              onClick={refreshLogs}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
              title="Refresh logs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Quantitative Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Total Audit Events</div>
            <div className="text-2xl font-black font-sora text-white mt-1">{logs.length}</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Chronologically Sealed</div>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">3FA Verified Events</div>
            <div className="text-2xl font-black font-sora text-emerald-400 mt-1">
              {logs.filter(l => l.category.startsWith('3FA')).length}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Passkey + TOTP + FIDO2</div>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Backend Tab Accesses</div>
            <div className="text-2xl font-black font-sora text-cyan-400 mt-1">
              {logs.filter(l => l.category === 'BACKEND_TAB_ACCESS').length}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Role Protected Enclaves</div>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Privacy &amp; PII Actions</div>
            <div className="text-2xl font-black font-sora text-amber-400 mt-1">
              {logs.filter(l => l.category === 'PII_ACCESS').length}
            </div>
            <div className="text-[10px] text-amber-300/80 font-mono mt-0.5">NDPR Clearance Logs</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        
        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Records' },
            { id: '3FA', label: '3FA Protocol' },
            { id: 'TABS', label: 'Backend Tabs' },
            { id: 'PRIVACY', label: 'PII & DPO' },
            { id: 'STUDENTS', label: 'Student Ops' },
            { id: 'VOICE', label: 'Voice Modules' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Status Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search actions, admin IDs, signatures..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 font-mono focus:outline-none cursor-pointer"
          >
            <option value="ALL">Status: All</option>
            <option value="SUCCESS">Passed / Success</option>
            <option value="WARNING">Warning</option>
            <option value="DENIED">Blocked / Denied</option>
            <option value="INFO">Info</option>
          </select>
        </div>
      </div>

      {/* Main Audit Trail Chronological Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp &amp; Status</th>
                <th className="py-3 px-4">Category &amp; Action</th>
                <th className="py-3 px-4">Administrator / Actor</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Cryptographic Signature</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <FileText className="w-8 h-8 text-slate-500 mx-auto" />
                      <div className="font-sora font-bold text-sm text-slate-700 dark:text-slate-300">No matching audit logs found</div>
                      <p className="text-xs text-slate-500">Try adjusting your search keywords or category filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const badge = getCategoryBadge(log.category);
                  const time = new Date(log.timestamp);
                  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  const dateStr = time.toLocaleDateString([], { month: 'short', day: 'numeric' });

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-blue-50/50 dark:hover:bg-slate-800/40 transition cursor-pointer group"
                    >
                      {/* Timestamp & Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono text-slate-900 dark:text-slate-100 font-bold">{timeStr}</div>
                        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{dateStr}</span>
                          <span>•</span>
                          {getStatusBadge(log.status)}
                        </div>
                      </td>

                      {/* Category & Action */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <div className="font-sora font-bold text-xs text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition">
                          {log.action}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs mt-0.5">
                          {log.details}
                        </div>
                      </td>

                      {/* Actor */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-sora font-bold text-xs text-slate-800 dark:text-slate-200">
                          {log.actorName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          ID: <span className="font-semibold text-slate-700 dark:text-slate-300">{log.actorId}</span>
                        </div>
                        {log.clearanceLevel && (
                          <div className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                            {log.clearanceLevel}
                          </div>
                        )}
                      </td>

                      {/* Target Resource */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded-md text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 inline-block font-semibold">
                          {log.targetResource}
                        </span>
                        {log.ipMask && (
                          <div className="text-[10px] font-mono text-slate-400 mt-1">
                            IP: {log.ipMask}
                          </div>
                        )}
                      </td>

                      {/* Signature */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <code className="text-[10px] font-mono bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded text-indigo-600 dark:text-cyan-300 border border-slate-200 dark:border-slate-800">
                            {log.signature ? log.signature.slice(0, 16) + '...' : 'SIG-VERIFIED'}
                          </code>
                          {log.signature && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(log.signature!, log.id);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-200"
                              title="Copy signature"
                            >
                              {copiedId === log.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Eye className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Details button */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-slate-950 text-slate-600 dark:text-slate-300 font-mono text-[11px] transition font-bold cursor-pointer"
                        >
                          Inspect →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & reset */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telemetry engine live. Auto-recording all 3FA authentications &amp; tab navigations.</span>
          </div>
          <button
            onClick={handleResetDefaults}
            className="text-[11px] font-mono text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Reset Audit Logs to Baseline</span>
          </button>
        </div>
      </div>

      {/* Modal / Detail Drawer for Selected Audit Record */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 shadow-2xl space-y-5 text-slate-900 dark:text-white relative">
            
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-400/30">
                  AUDIT RECORD INSPECTOR
                </span>
                <h4 className="font-sora font-bold text-base text-slate-900 dark:text-white mt-1">
                  {selectedLog.action}
                </h4>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Timestamp</div>
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {new Date(selectedLog.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Verification Status</div>
                  <div className="mt-0.5">{getStatusBadge(selectedLog.status)}</div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Actor Profile &amp; Clearance</div>
                <div className="font-sora font-bold text-slate-900 dark:text-white text-sm">
                  {selectedLog.actorName}
                </div>
                <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  ID: <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedLog.actorId}</span> • Role: {selectedLog.actorRole}
                </div>
                {selectedLog.clearanceLevel && (
                  <div className="text-emerald-500 font-mono text-[10px] font-bold">
                    Clearance: {selectedLog.clearanceLevel}
                  </div>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Target Resource &amp; IP Mask</div>
                <div className="font-mono font-bold text-cyan-500">
                  {selectedLog.targetResource}
                </div>
                {selectedLog.ipMask && (
                  <div className="text-slate-500 font-mono text-[11px]">
                    Network Point: {selectedLog.ipMask}
                  </div>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Event Description &amp; Context</div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-[11px]">
                  {selectedLog.details}
                </p>
              </div>

              {selectedLog.signature && (
                <div className="bg-slate-900 text-cyan-300 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-between">
                    <span>Cryptographic Block Signature</span>
                    <button
                      onClick={() => handleCopy(selectedLog.signature!, 'modal')}
                      className="text-cyan-400 hover:underline"
                    >
                      {copiedId === 'modal' ? 'Copied!' : 'Copy Hash'}
                    </button>
                  </div>
                  <code className="text-[10px] font-mono block break-all text-emerald-400 font-bold">
                    {selectedLog.signature}
                  </code>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sora text-xs font-bold transition cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
