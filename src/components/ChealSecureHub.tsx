import React, { useState, useEffect } from 'react';
import {
  Shield, Server, Activity, Database, KeyRound, Cpu, Terminal,
  Layers, Lock, AlertTriangle, CheckCircle2, Clock, Smartphone,
  BarChart3, RefreshCw, Radio, FileText, ChevronRight, Zap,
  ExternalLink, Eye, ArrowUpRight, Check, Sparkles, Filter, Play, Info, GraduationCap
} from 'lucide-react';
import { UserRole } from '../types';
import { ChealAppRegistryService, ChealRegisteredApp, ChealAppCapability } from '../cheal-secure-hub/registry/appRegistry';
import { ChealEventBus, ChealEventContract, ChealEventType } from '../cheal-secure-hub/infrastructure/eventBus/eventBus';
import { ChealDiagnosticsService, DiagnosticIncident, PerfettoTraceRecord } from '../cheal-secure-hub/platform/diagnostics/perfetto';
import { ChealSecurityService, ChealAuditLog } from '../cheal-secure-hub/platform/security/audit';
import { ChealIdentityService, ChealIdentityUser } from '../cheal-secure-hub/platform/identity/auth0';

interface ChealSecureHubProps {
  onNavigateRole?: (role: UserRole) => void;
  currentUserRole?: string;
  onClose?: () => void;
}

type HubTab = 'architecture' | 'dataclasses' | 'registry' | 'eventbus' | 'perfetto' | 'incidents' | 'audit';

export const ChealSecureHub: React.FC<ChealSecureHubProps> = ({
  onNavigateRole,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<HubTab>('architecture');
  const [apps, setApps] = useState<ChealRegisteredApp[]>([]);
  const [events, setEvents] = useState<ChealEventContract[]>([]);
  const [incidents, setIncidents] = useState<DiagnosticIncident[]>([]);
  const [traces, setTraces] = useState<PerfettoTraceRecord[]>([]);
  const [audits, setAudits] = useState<ChealAuditLog[]>([]);
  const [users, setUsers] = useState<ChealIdentityUser[]>([]);
  
  // Selected detail states
  const [selectedIncident, setSelectedIncident] = useState<DiagnosticIncident | null>(null);
  const [selectedTrace, setSelectedTrace] = useState<PerfettoTraceRecord | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ChealEventContract | null>(null);
  const [simulatingEvent, setSimulatingEvent] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const refreshData = () => {
    setApps(ChealAppRegistryService.getInstance().getAllApps());
    setEvents(ChealEventBus.getInstance().getRecentEvents(50));
    setIncidents(ChealDiagnosticsService.getInstance().getIncidents());
    setTraces(ChealDiagnosticsService.getInstance().getTraces());
    setAudits(ChealSecurityService.getInstance().getAuditLogs(50));
    setUsers(ChealIdentityService.getInstance().getAllUsers());
  };

  useEffect(() => {
    refreshData();
    // Default select first incident & trace
    const initialIncidents = ChealDiagnosticsService.getInstance().getIncidents();
    if (initialIncidents.length > 0) setSelectedIncident(initialIncidents[0]);
    const initialTraces = ChealDiagnosticsService.getInstance().getTraces();
    if (initialTraces.length > 0) setSelectedTrace(initialTraces[0]);
  }, []);

  const handleToggleCapability = (appId: string, cap: ChealAppCapability) => {
    ChealAppRegistryService.getInstance().toggleCapability(appId, cap);
    setApps(ChealAppRegistryService.getInstance().getAllApps());
    showToast(`Updated capability [${cap}] for ${appId}`);
  };

  const handleSimulateEvent = (type: ChealEventType) => {
    setSimulatingEvent(true);
    const traceId = `trc_sim_${Date.now().toString().slice(-4)}`;
    const duration = type === 'cbt.submission.completed' ? 1840 : Math.floor(Math.random() * 500) + 120;

    ChealEventBus.getInstance().publish({
      eventType: type,
      application: 'ilearnit365',
      userId: 'auth0|student_alex_chen',
      schoolId: 'school_001',
      traceId: traceId,
      appVersion: '2.4.0',
      durationMs: duration,
      status: 'success',
      metadata: {
        operation: type,
        edgeNode: 'af-south-1',
        protocol: 'HTTP/3 Quic',
      }
    });

    refreshData();
    setTimeout(() => {
      setSimulatingEvent(false);
      showToast(`Simulated event [${type}] dispatched to Audit, Analytics & Diagnostics.`);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 pb-20 selection:bg-cyan-500 selection:text-slate-950">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-cyan-950 border border-cyan-500/50 text-cyan-200 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="border-b border-slate-800/80 bg-gradient-to-b from-[#0D1829] to-[#070D18] sticky top-0 z-30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    CHEAL SECURE HUB
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    Platform & Security Layer
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Platform infrastructure, Auth0 Identity, Perfetto Diagnostics & Application Registry
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={refreshData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition cursor-pointer"
                title="Refresh platform telemetry"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>

              {onNavigateRole && (
                <>
                  <button
                    onClick={() => onNavigateRole('ilearnit_security')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer shadow-md shadow-indigo-500/20"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>iLearnit-365 Security &amp; OTP</span>
                  </button>
                  <button
                    onClick={() => onNavigateRole('student')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    <span>Open iLearnit-365 App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              {onClose && (
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
                >
                  <span>Close</span>
                </button>
              )}
            </div>
          </div>

          {/* Governing Architecture Rule Banner */}
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-cyan-950/60 border border-cyan-500/30 flex items-start gap-3 text-xs">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-slate-300 leading-relaxed">
              <strong className="text-cyan-300 font-bold">Governing Architectural Boundary:</strong>{' '}
              <span className="italic">
                "CHEAL Secure Hub owns platform security and infrastructure. iLearnit-365 owns education. Events connect them; shared identity authenticates them; diagnostics observe the application without becoming part of its educational data model."
              </span>
            </div>
          </div>

          {/* Sub-navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto mt-4 pt-1 no-scrollbar border-t border-slate-800/60">
            {[
              { id: 'architecture', label: 'Architecture Map', icon: Layers },
              { id: 'dataclasses', label: '3-Tier Data Separation', icon: Lock },
              { id: 'registry', label: 'Application Registry', icon: Server, badge: apps.length },
              { id: 'eventbus', label: 'CHEAL Event Bus', icon: Radio, badge: events.length },
              { id: 'perfetto', label: 'Performance Lab (Perfetto)', icon: Cpu },
              { id: 'incidents', label: 'Incident Engine', icon: AlertTriangle, badge: incidents.filter(i => i.status === 'Investigating').length },
              { id: 'audit', label: 'Security & Auth0 Audit', icon: Shield, badge: audits.length },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as HubTab)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: ARCHITECTURE MAP */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-400" />
                    <span>CHEAL Secure Hub — Production Architecture Map</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Multi-tenant security, telemetry, and diagnostics decoupled cleanly from domain education databases
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    API Gateway Online
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-400">Node.js / Express v4.21</span>
                </div>
              </div>

              {/* Graphical ASCII & Modern Box Flow */}
              <div className="bg-[#050A14] p-6 rounded-xl border border-slate-800/80 font-mono text-xs overflow-x-auto space-y-6">
                
                {/* Level 1: Platform Infrastructure */}
                <div className="border border-cyan-500/40 bg-cyan-950/20 rounded-xl p-4">
                  <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2 mb-3">
                    <span className="text-cyan-300 font-bold flex items-center gap-2 uppercase tracking-wider">
                      <Shield className="w-4 h-4 text-cyan-400" /> [CHEAL SECURE HUB — Platform Infrastructure]
                    </span>
                    <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-sans">
                      Global Security Plane
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                      <div className="text-cyan-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                        <KeyRound className="w-3.5 h-3.5" /> 1. Identity Layer
                      </div>
                      <div className="text-slate-400 text-[11px] font-sans">
                        Auth0 Universal Login • JWT Claims • FIDO2 WebAuthn / TOTP • MFA State • RBAC Policies
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                      <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                        <Shield className="w-3.5 h-3.5" /> 2. Security Subsystem
                      </div>
                      <div className="text-slate-400 text-[11px] font-sans">
                        Immutable Audit Ledger • SHA-256 Tamper Seals • Token Replay Guard • Edge Rate Limiting
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                      <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                        <Activity className="w-3.5 h-3.5" /> 3. Diagnostics & Telemetry
                      </div>
                      <div className="text-slate-400 text-[11px] font-sans">
                        Perfetto Trace Manager • Android / Web Trace Analyzer • Incident Correlation Engine
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flow Connector */}
                <div className="flex justify-center text-cyan-400 font-bold">
                  │ ─── [API Gateway / Auth Middleware / Trace Injector] ─── │
                </div>

                {/* Level 2: Domain Applications Plane */}
                <div className="border border-blue-500/40 bg-blue-950/20 rounded-xl p-4">
                  <div className="flex items-center justify-between border-b border-blue-500/30 pb-2 mb-3">
                    <span className="text-blue-300 font-bold flex items-center gap-2 uppercase tracking-wider">
                      <Server className="w-4 h-4 text-blue-400" /> [Bounded Domain Services Layer]
                    </span>
                    <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-sans">
                      Application Plane
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* iLearnit-365 Bounded Domain */}
                    <div className="p-4 bg-slate-900/90 rounded-xl border border-blue-500/30">
                      <div className="text-white font-bold text-xs flex items-center justify-between mb-2">
                        <span className="flex items-center gap-1.5 text-blue-300">
                          🎓 iLearnit-365 (Education Domain)
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Active App</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-300 font-sans">
                        <div className="p-1.5 bg-slate-800/80 rounded border border-slate-700/60 text-center">Students & Schools</div>
                        <div className="p-1.5 bg-slate-800/80 rounded border border-slate-700/60 text-center">Courses & JSS Math</div>
                        <div className="p-1.5 bg-slate-800/80 rounded border border-slate-700/60 text-center">CBT Exam Engine</div>
                        <div className="p-1.5 bg-slate-800/80 rounded border border-slate-700/60 text-center">Academic Results</div>
                        <div className="p-1.5 bg-slate-800/80 rounded border border-slate-700/60 text-center">Attendance Logs</div>
                        <div className="p-1.5 bg-slate-800/80 rounded border border-slate-700/60 text-center">Cybersecurity Lab</div>
                      </div>
                    </div>

                    {/* CHEAL Multi-Tenant Registered Apps */}
                    <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700/60">
                      <div className="text-white font-bold text-xs flex items-center justify-between mb-2">
                        <span className="flex items-center gap-1.5 text-purple-300">
                          🌐 CHEAL Registered Applications
                        </span>
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Multi-Tenant</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-300 font-sans">
                        <div className="p-2 bg-slate-800/80 rounded border border-slate-700/60">
                          <div className="font-semibold text-purple-300">CHEAL Music</div>
                          <div className="text-[9px] text-slate-400">Ear training & CCA staff notation</div>
                        </div>
                        <div className="p-2 bg-slate-800/80 rounded border border-slate-700/60">
                          <div className="font-semibold text-amber-300">AOCOL X WORLDWIDE</div>
                          <div className="text-[9px] text-slate-400">Global credential exchange</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Flow Connector: Event Contract */}
                <div className="flex flex-col items-center text-cyan-400 font-bold">
                  <div>▼</div>
                  <div className="bg-cyan-500/10 px-4 py-1 rounded-full border border-cyan-500/30 text-[11px] text-cyan-300">
                    EVENT CONTRACT (e.g. cbt.submission.completed, auth.mfa.verified)
                  </div>
                  <div>▼</div>
                </div>

                {/* Level 3: Event Bus & Analytics */}
                <div className="border border-emerald-500/40 bg-emerald-950/20 rounded-xl p-4">
                  <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2 mb-3">
                    <span className="text-emerald-300 font-bold flex items-center gap-2 uppercase tracking-wider">
                      <Radio className="w-4 h-4 text-emerald-400" /> [CHEAL Event Bus & Analytics Router]
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-sans">
                      Sanitized Telemetry Only
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300 font-sans text-xs">
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                      <div className="font-bold text-amber-400">Audit Ledger</div>
                      <div className="text-[10px] text-slate-400">Tamper-evident regulatory logging</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                      <div className="font-bold text-emerald-400">Platform Analytics</div>
                      <div className="text-[10px] text-slate-400">Usage trends, latency percentiles & uptime</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                      <div className="font-bold text-cyan-400">Diagnostics & Perfetto</div>
                      <div className="text-[10px] text-slate-400">Edge incident correlation & trace profiling</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 3-TIER DATA SEPARATION */}
        {activeTab === 'dataclasses' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  <span>Strict 3-Tier Data Class Separation</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enforces strict isolation between Identity credentials, Educational domain records, and Technical telemetry.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Data Class 1: Identity Data */}
                <div className="bg-[#091322] rounded-2xl p-5 border border-cyan-500/30 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4" /> Class 1: Identity Data
                      </span>
                      <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">
                        CHEAL Auth0
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      Owned strictly by the CHEAL Identity layer and Auth0. Governs credentials, tokens, session claims, and multi-factor states.
                    </p>

                    <div className="mt-4 space-y-2">
                      <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Governed Fields:</div>
                      {[
                        'auth0Id (sub claim)',
                        'email / primary handle',
                        'authentication state',
                        'MFA state & method (TOTP/FIDO2)',
                        'identity provider (Auth0/Google/Local)',
                        'assigned platform roles',
                        'token expiry & session tokens'
                      ].map(f => (
                        <div key={f} className="flex items-center gap-2 text-xs text-cyan-200 bg-cyan-950/30 px-2.5 py-1.5 rounded-lg border border-cyan-500/20 font-mono text-[11px]">
                          <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
                    🔒 <strong className="text-slate-200">Isolation Guarantee:</strong> Identity records never store academic subject grades, questions, or answer choices.
                  </div>
                </div>

                {/* Data Class 2: Education Data */}
                <div className="bg-[#091322] rounded-2xl p-5 border border-blue-500/30 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4" /> Class 2: Education Data
                      </span>
                      <span className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                        iLearnit-365
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      Owned strictly by iLearnit-365. Contains educational records, curriculum schemes, examination items, candidate responses, and progress.
                    </p>

                    <div className="mt-4 space-y-2">
                      <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Governed Fields:</div>
                      {[
                        'student / teacher / parent profiles',
                        'school & classroom rosters',
                        'course, lesson plans & schemes',
                        'CBT exam question banks',
                        'candidate answers & scratchpad',
                        'academic result slips & CGPA',
                        'attendance logs & conduct remarks'
                      ].map(f => (
                        <div key={f} className="flex items-center gap-2 text-xs text-blue-200 bg-blue-950/30 px-2.5 py-1.5 rounded-lg border border-blue-500/20 font-mono text-[11px]">
                          <Check className="w-3 h-3 text-blue-400 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
                    🎓 <strong className="text-slate-200">Isolation Guarantee:</strong> Student answers, exam content, and grades are NEVER copied into CHEAL diagnostic telemetry.
                  </div>
                </div>

                {/* Data Class 3: Technical & Security Telemetry */}
                <div className="bg-[#091322] rounded-2xl p-5 border border-emerald-500/30 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <Activity className="w-4 h-4" /> Class 3: Technical Telemetry
                      </span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                        CHEAL Diagnostics
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      Owned strictly by CHEAL. Measures runtime performance, device specifications, edge network latency, ANR frame drops, and security anomalies.
                    </p>

                    <div className="mt-4 space-y-2">
                      <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Governed Fields:</div>
                      {[
                        'traceId & span execution timeline',
                        'deviceId, OS version & RAM (MB)',
                        'submission duration (ms)',
                        'network round-trip time (RTT ms)',
                        'UI thread frame drops & ANR',
                        'tamper seals & audit hashes',
                        'security incident correlation IDs'
                      ].map(f => (
                        <div key={f} className="flex items-center gap-2 text-xs text-emerald-200 bg-emerald-950/30 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 font-mono text-[11px]">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
                    ⚡ <strong className="text-slate-200">Isolation Guarantee:</strong> Telemetry observes system health and performance without touching private student educational records.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: APPLICATION REGISTRY */}
        {activeTab === 'registry' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-cyan-400" />
                    <span>CHEAL Application Registry</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Multi-tenant domain applications provisioned onto CHEAL without duplicating security, identity, or diagnostic infrastructure.
                  </p>
                </div>
                <div className="text-xs text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-500/30 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{apps.length} Applications Registered</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apps.map(app => (
                  <div key={app.applicationId} className="bg-[#091322] border border-slate-800 hover:border-cyan-500/40 rounded-xl p-5 transition space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm">{app.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            app.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            app.status === 'staged' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          AppID: <span className="text-cyan-300">{app.applicationId}</span> • v{app.version}
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-1 rounded">
                        {app.type.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {app.description}
                    </p>

                    {/* Capabilities Toggles */}
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Provisioned Capabilities (Click to toggle):
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(['identity', 'audit', 'diagnostics', 'analytics', 'storage', 'cbt_engine', 'perfetto_tracing'] as ChealAppCapability[]).map(cap => {
                          const isEnabled = app.capabilities.includes(cap);
                          return (
                            <button
                              key={cap}
                              onClick={() => handleToggleCapability(app.applicationId, cap)}
                              className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer border flex items-center gap-1 ${
                                isEnabled
                                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900'
                                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
                              <span>{cap}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Rate Limit: {app.apiRateLimitPerMin} req/min</span>
                      <span>Active Sessions: <strong className="text-cyan-300">{app.activeSessionsCount}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EVENT BUS STREAM */}
        {activeTab === 'eventbus' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-emerald-400" />
                    <span>CHEAL Central Event Bus — Live Telemetry Stream</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Event contract delivering sanitized educational operation notifications to Audit, Analytics, and Diagnostics subsystems.
                  </p>
                </div>

                {/* Event Simulation Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium mr-1">Simulate Event:</span>
                  <button
                    disabled={simulatingEvent}
                    onClick={() => handleSimulateEvent('cbt.submission.completed')}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 border border-cyan-600/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3 h-3" />
                    <span>cbt.submission.completed</span>
                  </button>
                  <button
                    disabled={simulatingEvent}
                    onClick={() => handleSimulateEvent('attendance.recorded')}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-blue-200 border border-blue-600/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3 h-3" />
                    <span>attendance.recorded</span>
                  </button>
                </div>
              </div>

              {/* Event Feed List */}
              <div className="space-y-3">
                {events.map(evt => (
                  <div
                    key={evt.eventId}
                    onClick={() => setSelectedEvent(evt)}
                    className={`p-4 rounded-xl border transition cursor-pointer ${
                      selectedEvent?.eventId === evt.eventId
                        ? 'bg-slate-800/90 border-cyan-500/60 shadow-lg'
                        : 'bg-[#091322] border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="font-mono font-bold text-xs text-cyan-300">{evt.eventType}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {evt.eventId}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                        <span>App: <strong className="text-slate-200">{evt.application}</strong></span>
                        <span>Trace: <strong className="text-slate-200">{evt.traceId}</strong></span>
                        {evt.durationMs !== undefined && (
                          <span className={`${evt.durationMs > 1500 ? 'text-amber-400 font-bold' : 'text-emerald-400'}`}>
                            {evt.durationMs}ms
                          </span>
                        )}
                        <span className="text-slate-500">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>

                    {/* Sanitized Metadata Preview */}
                    {evt.metadata && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
                        <span className="text-slate-500 font-sans">Sanitized Payload:</span>
                        {Object.entries(evt.metadata).map(([k, v]) => (
                          <span key={k} className="bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                            {k}: <strong className="text-cyan-300">{String(v)}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PERFETTO PERFORMANCE LAB */}
        {activeTab === 'perfetto' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                    <span>Perfetto Performance Lab & Trace Analyzer</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Developer & Security diagnostics inspecting thread spans, database journal flushes, and network latency without student data leaks.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                    Trace Engine: Google Perfetto v44.0
                  </span>
                </div>
              </div>

              {/* Trace Selector & Main Graph Area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Trace List */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Recorded Trace Sessions:
                  </div>
                  {traces.map(t => (
                    <button
                      key={t.traceId}
                      onClick={() => setSelectedTrace(t)}
                      className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer ${
                        selectedTrace?.traceId === t.traceId
                          ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md'
                          : 'bg-[#091322] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-cyan-300">{t.traceId}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'slow_submission' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium mt-1">
                        {t.deviceModel}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-mono">
                        <span>Dur: <strong className="text-white">{t.durationMs}ms</strong></span>
                        <span>RTT: <strong className="text-amber-300">{t.networkLatencyMs}ms</strong></span>
                        <span>Drops: <strong className="text-white">{t.frameDrops}</strong></span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right: Trace Timeline & Thread Breakdown */}
                {selectedTrace && (
                  <div className="lg:col-span-2 bg-[#050A14] p-5 rounded-2xl border border-slate-800/80 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-white">{selectedTrace.traceId}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                            {selectedTrace.platform} • {selectedTrace.osVersion}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Target App: <strong className="text-cyan-300">{selectedTrace.application}</strong> (v{selectedTrace.version})
                        </div>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-xs text-slate-300">
                        <div className="text-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="text-[10px] text-slate-400">Total Duration</div>
                          <div className="font-bold text-amber-400">{selectedTrace.durationMs} ms</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="text-[10px] text-slate-400">Memory RAM</div>
                          <div className="font-bold text-cyan-400">{selectedTrace.memoryFootprintMb} MB</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="text-[10px] text-slate-400">Net RTT</div>
                          <div className="font-bold text-emerald-400">{selectedTrace.networkLatencyMs} ms</div>
                        </div>
                      </div>
                    </div>

                    {/* Execution Spans Visual Timeline */}
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Thread Execution Spans (Perfetto Visualizer)</span>
                        <span className="text-[10px] text-slate-500">Timeline Total: {selectedTrace.durationMs}ms</span>
                      </div>

                      <div className="space-y-2 font-mono text-xs">
                        {selectedTrace.spans.map(span => {
                          const durationMs = span.durationUs / 1000;
                          const widthPct = Math.max(8, Math.min(100, (durationMs / selectedTrace.durationMs) * 100));

                          return (
                            <div key={span.spanId} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white text-xs">{span.name}</span>
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                    {span.threadName}
                                  </span>
                                </div>
                                <span className="font-bold text-cyan-300">{durationMs.toFixed(1)} ms</span>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                                <div
                                  className={`h-full rounded-full ${
                                    span.category === 'network_io' ? 'bg-amber-500' :
                                    span.category === 'sqlite_db' ? 'bg-purple-500' :
                                    span.category === 'ui_render' ? 'bg-emerald-500' : 'bg-cyan-500'
                                  }`}
                                  style={{ width: `${widthPct}%` }}
                                ></div>
                              </div>

                              {/* Span details */}
                              <div className="flex items-center justify-between text-[10px] text-slate-400">
                                <span>Category: <strong className="text-slate-300">{span.category}</strong></span>
                                <span>CPU Load: <strong className="text-slate-300">{span.cpuPercentage}%</strong></span>
                                {span.metadata && (
                                  <span>Meta: <strong className="text-slate-300">{JSON.stringify(span.metadata)}</strong></span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* TAB 6: INCIDENT ENGINE */}
        {activeTab === 'incidents' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <span>CHEAL Platform Incident Engine</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Exposes synthesized diagnostic summaries to developers and platform admins without exposing raw student answers.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {incidents.map(inc => (
                  <div key={inc.incidentId} className="bg-[#091322] border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-bold text-amber-400">{inc.incidentId}</span>
                          <span className="font-bold text-white text-sm">{inc.title}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            inc.status === 'Investigating' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' :
                            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {inc.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Application: <strong className="text-slate-200">{inc.application}</strong> • Version: {inc.version} • Platform: {inc.platform}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {inc.status === 'Investigating' ? (
                          <button
                            onClick={() => {
                              ChealDiagnosticsService.getInstance().updateIncidentStatus(inc.incidentId, 'Resolved');
                              setIncidents([...ChealDiagnosticsService.getInstance().getIncidents()]);
                              showToast(`Incident [${inc.incidentId}] marked as RESOLVED.`);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              ChealDiagnosticsService.getInstance().updateIncidentStatus(inc.incidentId, 'Investigating');
                              setIncidents([...ChealDiagnosticsService.getInstance().getIncidents()]);
                              showToast(`Incident [${inc.incidentId}] reopened for investigation.`);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                          >
                            Reopen
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 font-sans">Average Submission</div>
                        <div className="font-bold text-amber-400 text-sm mt-0.5">{inc.averageSubmissionSeconds}s</div>
                      </div>
                      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 font-sans">Network Latency (RTT)</div>
                        <div className="font-bold text-amber-400 text-sm mt-0.5">{inc.networkLatencyMs}ms</div>
                      </div>
                      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 font-sans">Affected Devices</div>
                        <div className="font-bold text-white text-sm mt-0.5">{inc.affectedDevices} Units</div>
                      </div>
                      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 font-sans">Trace Correlation</div>
                        <div className="font-bold text-cyan-400 text-xs mt-1 truncate">{inc.traceCorrelationId}</div>
                      </div>
                    </div>

                    {/* Root Cause & Mitigation */}
                    <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                      <div>
                        <strong className="text-amber-400">Root Cause Analysis:</strong>{' '}
                        <span className="text-slate-300">{inc.rootCauseAnalysis}</span>
                      </div>
                      <div>
                        <strong className="text-cyan-400">Recommended Mitigation:</strong>{' '}
                        <span className="text-slate-300">{inc.mitigationRecommendation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SECURITY & AUDIT */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <span>CHEAL Platform Security & Auth0 Audit Trail</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Immutable security records, SHA-256 tamper seals, and Auth0 token verifications.
                  </p>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {audits.map(aud => (
                  <div key={aud.auditId} className="p-4 bg-[#091322] border border-slate-800 rounded-xl space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                          {aud.auditId}
                        </span>
                        <span className="font-bold text-white text-xs">{aud.action}</span>
                        <span className="text-[10px] text-slate-400 font-sans">({aud.category})</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(aud.timestamp).toLocaleString()} • IP: {aud.ipMask}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>Principal: <strong className="text-cyan-300">{aud.auth0Id}</strong></span>
                      <span>•</span>
                      <span>Client: {aud.userAgent}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 truncate">
                      Tamper Seal: <span className="text-slate-400">{aud.tamperSeal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
