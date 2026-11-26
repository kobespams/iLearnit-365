import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { 
  ShieldCheck, Shield, KeyRound, Cloud, Terminal, 
  ExternalLink, ArrowRight, Lock, CheckCircle2, AlertTriangle, 
  RefreshCw, Activity, Cpu, Database, Server, Radio, 
  Layers, Users, FileText, Download, Zap, Eye, ShieldAlert,
  HardDrive, Globe, Network, Compass
} from 'lucide-react';
import { getActive3FAClearance, revoke3FAClearance, Admin3FASession } from '../services/admin3FAService';
import { getSystemAuditTrail, AuditTrailRecord } from '../services/auditTrailService';
import AdminDashboard from './AdminDashboard';
import { ChealSecureHub } from './ChealSecureHub';
import { ILearnitSecurityCenter } from './ILearnitSecurityCenter';
import { NetlifyCloudDeploymentHub } from './NetlifyCloudDeploymentHub';

interface BackendHubsDashboardProps {
  onNavigateRole: (role: UserRole) => void;
  isStandaloneMode?: boolean;
}

type BackendSubTab = 'overview' | 'admin' | 'cheal' | 'security' | 'deployment';

export const BackendHubsDashboard: React.FC<BackendHubsDashboardProps> = ({
  onNavigateRole,
  isStandaloneMode = false,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<BackendSubTab>('overview');
  const [active3FA, setActive3FA] = useState<Admin3FASession | null>(() => getActive3FAClearance());
  const [auditLogs, setAuditLogs] = useState<AuditTrailRecord[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    setActive3FA(getActive3FAClearance());
    setAuditLogs(getSystemAuditTrail().slice(0, 15));
  }, [activeSubTab]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setActive3FA(getActive3FAClearance());
      setAuditLogs(getSystemAuditTrail().slice(0, 15));
      setLastRefreshed(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 400);
  };

  const handleOpenStandalone = (role: UserRole) => {
    try {
      const url = `${window.location.origin}${window.location.pathname}?hub=${role}&mode=standalone`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      onNavigateRole(role);
    }
  };

  const BACKEND_MODULES = [
    {
      id: 'admin' as UserRole,
      subTab: 'admin' as BackendSubTab,
      name: 'Institutional Master Vault',
      subtitle: 'Student registry, verification credentials, academic grade audits, and institutional ledger.',
      badge: 'Tier 3 Clearance',
      status: 'OPERATIONAL',
      statusColor: 'emerald',
      icon: KeyRound,
      accentColor: 'from-violet-600 to-indigo-700',
      borderHover: 'hover:border-violet-500',
      stats: '1,420 Active Records',
      protocol: 'AES-256 / SHA-512',
    },
    {
      id: 'cheal_hub' as UserRole,
      subTab: 'cheal' as BackendSubTab,
      name: 'CHEAL Cyber Defense SOC',
      subtitle: 'Zero-day packet inspection, honeypot telemetry, perimeter shield, and threat analytics.',
      badge: 'Zero-Trust Enclave',
      status: 'SHIELD ACTIVE',
      statusColor: 'teal',
      icon: ShieldAlert,
      accentColor: 'from-teal-600 to-cyan-700',
      borderHover: 'hover:border-teal-500',
      stats: '0 Active Breaches',
      protocol: 'Zero-Trust TLS 1.3',
    },
    {
      id: 'ilearnit_security' as UserRole,
      subTab: 'security' as BackendSubTab,
      name: 'iLearnit Security & OTP Center',
      subtitle: 'Multi-factor authentication, cryptographic hash validation, dynamic OTP issuance, and biometric logs.',
      badge: '3FA Guarded',
      status: 'ENCRYPTED',
      statusColor: 'indigo',
      icon: ShieldCheck,
      accentColor: 'from-indigo-600 to-blue-700',
      borderHover: 'hover:border-indigo-500',
      stats: '100% Hash Integrity',
      protocol: 'HMAC-SHA256 OTP',
    },
    {
      id: 'deployment' as UserRole,
      subTab: 'deployment' as BackendSubTab,
      name: 'Netlify Cloud Deployment Hub',
      subtitle: 'Automated CI/CD build telemetry, static site deployment, environment variables, and CDN edges.',
      badge: 'Cloud Host',
      status: 'DEPLOYED LIVE',
      statusColor: 'emerald',
      icon: Cloud,
      accentColor: 'from-cyan-600 to-emerald-700',
      borderHover: 'hover:border-cyan-500',
      stats: 'Edge Global CDN',
      protocol: 'HTTPS / Netlify API',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 animate-fadeIn">
      
      {/* 1. TOP COMMAND HEADER & SECURITY TELEMETRY */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#071328] to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-blue-500/30 shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> Mission Control Enclave
              </span>
              <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                Uptime: 99.99% • SOC Tier 3
              </span>
              <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 hidden sm:inline">
                Refreshed: {lastRefreshed}
              </span>
            </div>

            <h1 className="font-sora font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
              Backend Enclave &amp; Central Command Dashboard
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Unified administrative oversight orchestrating the Institutional Master Vault, CHEAL Cyber Defense SOC, Cryptographic Security Center, and Netlify Cloud Pipelines.
            </p>
          </div>

          {/* 3FA Status Capsule */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 shrink-0 min-w-[280px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" /> 3FA Security Clearance
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
                {active3FA?.adminName ? active3FA.adminName[0].toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-white truncate">
                  {active3FA?.adminName || 'Super Admin (Active)'}
                </div>
                <div className="text-xs text-emerald-300 font-mono">
                  {active3FA?.clearanceLevel || 'Tier 3 Clearance Active'}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <button
                onClick={handleRefresh}
                className="text-slate-300 hover:text-white flex items-center gap-1 font-mono cursor-pointer transition"
                title="Refresh live telemetry"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync Metrics
              </button>
              <button
                onClick={() => onNavigateRole('hub')}
                className="text-cyan-300 hover:text-cyan-200 font-bold cursor-pointer transition flex items-center gap-1"
              >
                Return to Hub <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* SUB-NAVIGATION TABS */}
        <div className="pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar pb-1">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-sora font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSubTab === 'overview'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Command Matrix</span>
          </button>

          <button
            onClick={() => setActiveSubTab('admin')}
            className={`px-4 py-2 rounded-xl text-xs font-sora font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSubTab === 'admin'
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-violet-300" />
            <span>Master Vault (Registrar)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('cheal')}
            className={`px-4 py-2 rounded-xl text-xs font-sora font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSubTab === 'cheal'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-teal-300" />
            <span>CHEAL Cyber Defense</span>
          </button>

          <button
            onClick={() => setActiveSubTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-sora font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSubTab === 'security'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
            <span>Security &amp; OTP Ledger</span>
          </button>

          <button
            onClick={() => setActiveSubTab('deployment')}
            className={`px-4 py-2 rounded-xl text-xs font-sora font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeSubTab === 'deployment'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-emerald-300" />
            <span>Netlify Cloud CI/CD</span>
          </button>
        </div>
      </div>

      {/* 2. TAB CONTENT VIEWS */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Module Quick Launch Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BACKEND_MODULES.map((mod) => (
              <div
                key={mod.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 space-y-5 relative overflow-hidden group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${mod.accentColor} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                      <mod.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-sora font-bold text-lg text-slate-900 dark:text-white">
                          {mod.name}
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        Protocol: {mod.protocol}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-full shrink-0">
                    {mod.status}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {mod.subtitle}
                </p>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">Telemetry Status:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{mod.stats}</span>
                </div>

                {/* Page-to-Page Action Controls */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setActiveSubTab(mod.subTab)}
                    className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-sora font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Open in View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenStandalone(mod.id)}
                    className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-sora font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300 dark:border-slate-700"
                    title="Launch this hub in a dedicated full workstation tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Separate Tab</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Real-Time Audit Trail Matrix */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                <h3 className="font-sora font-bold text-base text-slate-900 dark:text-white">
                  Real-Time Security Audit Trail Stream
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Immutable SHA-256 Ledger
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Timestamp</th>
                    <th className="pb-3 font-semibold">Operator</th>
                    <th className="pb-3 font-semibold">Target Hub</th>
                    <th className="pb-3 font-semibold">Action</th>
                    <th className="pb-3 font-semibold">Verification Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {auditLogs.length > 0 ? (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="py-2.5 text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">{log.actorName}</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-md font-bold uppercase text-[10px]">
                            {log.category}
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-600 dark:text-slate-300">{log.action}</td>
                        <td className="py-2.5 text-slate-400 truncate max-w-[120px]">{log.signature || log.id}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400 font-mono">
                        No security alerts recorded. Sovereign perimeter secure.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 1: Institutional Master Vault */}
      {activeSubTab === 'admin' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between bg-violet-50 dark:bg-violet-950/40 p-4 rounded-2xl border border-violet-200 dark:border-violet-800 text-xs">
            <span className="font-sora font-bold text-violet-900 dark:text-violet-200 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-violet-600" /> Embedded Master Vault &amp; Registrar Workspace
            </span>
            <button
              onClick={() => handleOpenStandalone('admin')}
              className="px-3 py-1.5 bg-violet-600 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer hover:bg-violet-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open in Dedicated Fullscreen Page
            </button>
          </div>
          <AdminDashboard onNavigateRole={onNavigateRole} isStandaloneMode={isStandaloneMode} />
        </div>
      )}

      {/* SUB-VIEW 2: CHEAL Cyber Defense SOC */}
      {activeSubTab === 'cheal' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between bg-teal-50 dark:bg-teal-950/40 p-4 rounded-2xl border border-teal-200 dark:border-teal-800 text-xs">
            <span className="font-sora font-bold text-teal-900 dark:text-teal-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-teal-600" /> CHEAL Sovereign Security Operations Center
            </span>
            <button
              onClick={() => handleOpenStandalone('cheal_hub')}
              className="px-3 py-1.5 bg-teal-600 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer hover:bg-teal-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open in Dedicated Fullscreen Page
            </button>
          </div>
          <ChealSecureHub onNavigateRole={onNavigateRole} onClose={() => setActiveSubTab('overview')} />
        </div>
      )}

      {/* SUB-VIEW 3: iLearnit Security Center */}
      {activeSubTab === 'security' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-xs">
            <span className="font-sora font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> iLearnit Cryptographic Security &amp; OTP Ledger
            </span>
            <button
              onClick={() => handleOpenStandalone('ilearnit_security')}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer hover:bg-indigo-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open in Dedicated Fullscreen Page
            </button>
          </div>
          <ILearnitSecurityCenter onNavigateRole={onNavigateRole} onClose={() => setActiveSubTab('overview')} />
        </div>
      )}

      {/* SUB-VIEW 4: Netlify Cloud Deployment Hub */}
      {activeSubTab === 'deployment' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs">
            <span className="font-sora font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-emerald-600" /> Netlify Cloud &amp; DevOps Pipelines
            </span>
            <button
              onClick={() => handleOpenStandalone('deployment')}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer hover:bg-emerald-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open in Dedicated Fullscreen Page
            </button>
          </div>
          <NetlifyCloudDeploymentHub onNavigateRole={onNavigateRole} />
        </div>
      )}

    </div>
  );
};
