import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  AlertTriangle,
  Clock,
  RefreshCw,
  ShieldAlert,
  ArrowLeft,
  Shield,
  Eye,
  EyeOff,
  Server,
} from 'lucide-react';
import { UserRole } from '../types';
import {
  Admin3FASession,
  AdminAuthStatus,
  getActive3FAClearance,
  fetchAdminAuthStatus,
  claimAdminMasterKey,
  loginWithAdminMasterKey,
  renew3FAClearanceServer,
  revoke3FAClearance,
  subscribeAdminSession,
} from '../services/admin3FAService';
import { recordAuditAction } from '../services/auditTrailService';

interface AdminRestrictionGuardProps {
  targetRole: UserRole;
  portalTitle: string;
  onClearanceGranted: (session: Admin3FASession) => void;
  onReturnToHub: () => void;
  children: React.ReactNode;
}

export const AdminRestrictionGuard: React.FC<AdminRestrictionGuardProps> = ({
  targetRole,
  portalTitle,
  onClearanceGranted,
  onReturnToHub,
  children,
}) => {
  const [activeSession, setActiveSession] = useState<Admin3FASession | null>(() => getActive3FAClearance());
  const [authStatus, setAuthStatus] = useState<AdminAuthStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);

  // Login form state (Master Key alone)
  const [masterKeyInput, setMasterKeyInput] = useState('');
  const [showMasterKey, setShowMasterKey] = useState(false);

  // First-run claim/setup state (Master Key alone)
  const [setupAdminName, setSetupAdminName] = useState('Principal Master Administrator');
  const [setupAdminEmail, setSetupAdminEmail] = useState('admin@ilearnit365.edu.ng');
  const [setupMasterKey, setSetupMasterKey] = useState('');
  const [setupConfirmKey, setSetupConfirmKey] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active session banner states
  const [timeLeft, setTimeLeft] = useState<number>(1500);
  const [elevatedMode, setElevatedMode] = useState<boolean>(true);
  const [renewing, setRenewing] = useState<boolean>(false);

  const loadStatus = async () => {
    setLoadingStatus(true);
    try {
      const status = await fetchAdminAuthStatus();
      setAuthStatus(status);
    } catch {
      setAuthError('Unable to reach authentication server. Please ensure the backend server is running.');
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    loadStatus();
    const unsub = subscribeAdminSession(() => {
      setActiveSession(getActive3FAClearance());
    });
    return unsub;
  }, []);

  useEffect(() => {
    const checkSession = () => {
      const session = getActive3FAClearance();
      setActiveSession(session);
      if (session) {
        const remaining = Math.max(0, Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          revoke3FAClearance();
          setActiveSession(null);
        }
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClaimMasterKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (setupMasterKey.trim().length < 8) {
      setAuthError('Administrative Master Key must be at least 8 characters long.');
      return;
    }
    if (setupMasterKey !== setupConfirmKey) {
      setAuthError('Master Key and confirmation do not match.');
      return;
    }

    setSubmitting(true);
    const res = await claimAdminMasterKey({
      masterKey: setupMasterKey.trim(),
      adminName: setupAdminName.trim(),
      adminEmail: setupAdminEmail.trim(),
    });
    setSubmitting(false);

    if (res.success && res.session) {
      setActiveSession(res.session);
      if (res.status) setAuthStatus(res.status);
      setSetupMasterKey('');
      setSetupConfirmKey('');
      onClearanceGranted(res.session);
    } else {
      setAuthError(res.message || 'Unable to claim Master Key.');
      loadStatus();
    }
  };

  const handleUnlockConsole = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!masterKeyInput.trim()) {
      setAuthError('Administrative Master Key is required.');
      return;
    }

    setSubmitting(true);
    const res = await loginWithAdminMasterKey({
      masterKey: masterKeyInput.trim(),
    });
    setSubmitting(false);

    if (res.success && res.session) {
      setActiveSession(res.session);
      setMasterKeyInput('');
      onClearanceGranted(res.session);
    } else {
      if (res.setupRequired) {
        loadStatus();
      }
      setAuthError(res.message || 'Authentication rejected.');
      recordAuditAction({
        category: 'SECURITY_ALERT',
        action: 'Administrative Master Key Attempt Rejected',
        actorId: 'UNVERIFIED',
        actorName: 'Anonymous Attempt',
        actorRole: 'LEVEL_1_STAFF',
        targetResource: `${portalTitle} Console`,
        status: 'DENIED',
        details: `Server rejected invalid Master Key for ${targetRole}.`,
      });
    }
  };

  const handleExtendSession = async () => {
    setRenewing(true);
    const extended = await renew3FAClearanceServer(25);
    setRenewing(false);
    if (extended) {
      setActiveSession(extended);
      setTimeLeft(Math.max(0, Math.floor((new Date(extended.expiresAt).getTime() - Date.now()) / 1000)));
    }
  };

  const handleLockConsole = () => {
    revoke3FAClearance();
    setActiveSession(null);
    onReturnToHub();
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (activeSession) {
    return (
      <div className="relative">
        <div className="bg-gradient-to-r from-[#0B1528] via-[#102244] to-[#0B1528] border-b border-indigo-500/30 text-white px-4 py-2 text-xs sticky top-0 z-40 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                Master Key Session Active
              </span>
              <span className="text-slate-400 font-mono hidden md:inline">|</span>
              <span className="text-slate-200 font-semibold hidden md:inline">
                {activeSession.adminName} ({activeSession.authMode === 'env_configured' ? 'Env Secret' : 'Claimed Key'})
              </span>
              <span className="bg-emerald-950/80 text-emerald-200 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded">
                In-Memory Bearer Verified
              </span>
            </div>

            <div className="flex items-center gap-2.5 ml-auto flex-wrap">
              <div className="flex items-center gap-1.5 text-slate-200 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700 font-mono text-[11px]">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>TTL: {formatCountdown(timeLeft)}</span>
                <button
                  type="button"
                  onClick={handleExtendSession}
                  disabled={renewing}
                  className="ml-1 text-indigo-300 hover:text-indigo-200 underline text-[10px] cursor-pointer disabled:opacity-50"
                  title="Extend server Bearer session by 25 minutes"
                >
                  {renewing ? 'Renewing...' : 'Extend'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setElevatedMode(!elevatedMode)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold transition cursor-pointer ${
                  elevatedMode
                    ? 'bg-purple-900/60 text-purple-200 border border-purple-500/50'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                <Shield className="w-3 h-3 text-purple-300" />
                <span>{elevatedMode ? 'Elevated Mode: ON' : 'Read-Only Audit'}</span>
              </button>

              <button
                type="button"
                onClick={handleLockConsole}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-white border border-rose-500/40 font-mono text-[11px] font-bold transition cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Lock Console</span>
              </button>
            </div>
          </div>
        </div>

        {children}
      </div>
    );
  }

  const isSetupRequired = authStatus?.mode === 'setup_required';

  return (
    <div className="min-h-[85vh] bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-slate-900/95 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center space-y-3 pb-5 border-b border-slate-800">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-slate-900 p-0.5 shadow-lg shadow-purple-900/40 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-purple-300" />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-200 bg-purple-950/90 border border-purple-700/70 px-3 py-1 rounded-full">
              {isSetupRequired ? 'FIRST-RUN MASTER KEY SETUP' : 'RESTRICTED ADMINISTRATIVE ZONE'}
            </span>
            <h2 className="font-sora font-extrabold text-2xl text-white mt-2">
              {portalTitle}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
              {isSetupRequired
                ? 'Set your private Administrative Master Key to unlock and protect the backend console.'
                : 'Enter your Administrative Master Key to unlock the backend console.'}
            </p>
          </div>
        </div>

        {loadingStatus ? (
          <div className="py-10 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-purple-400 animate-spin mx-auto" />
            <p className="text-xs font-mono text-slate-300">Checking server Master Key status...</p>
          </div>
        ) : isSetupRequired ? (
          <form onSubmit={handleClaimMasterKey} className="mt-5 space-y-4">
            {authError && (
              <div className="bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs p-3 rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <div className="bg-indigo-950/50 border border-indigo-500/30 rounded-xl p-3 text-[11px] text-indigo-100 leading-relaxed flex items-start gap-2.5">
              <Server className="w-4 h-4 text-indigo-300 shrink-0 mt-0.5" />
              <span>
                Master Key is hashed on the server. For permanent deployments, configure <code className="font-mono text-white">ADMIN_MASTER_KEY</code> in Settings → Secrets.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="setup-admin-name" className="block text-[11px] font-mono font-semibold text-slate-200 mb-1">
                  Administrator Name
                </label>
                <input
                  id="setup-admin-name"
                  type="text"
                  value={setupAdminName}
                  onChange={(e) => setSetupAdminName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="setup-admin-email" className="block text-[11px] font-mono font-semibold text-slate-200 mb-1">
                  Officer Email
                </label>
                <input
                  id="setup-admin-email"
                  type="email"
                  value={setupAdminEmail}
                  onChange={(e) => setSetupAdminEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="setup-master-key" className="text-xs font-mono font-semibold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-purple-300" />
                  <span>Create Administrative Master Key</span>
                </span>
                <span className="text-[10px] text-slate-400">Min 8 chars</span>
              </label>
              <div className="relative">
                <input
                  id="setup-master-key"
                  type={showMasterKey ? 'text' : 'password'}
                  value={setupMasterKey}
                  onChange={(e) => setSetupMasterKey(e.target.value)}
                  placeholder="Enter a strong Master Key passphrase"
                  autoComplete="new-password"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowMasterKey(!showMasterKey)}
                  aria-label={showMasterKey ? 'Hide Master Key' : 'Show Master Key'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showMasterKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="setup-confirm-key" className="block text-xs font-mono font-semibold text-slate-200 mb-1">
                Confirm Master Key
              </label>
              <input
                id="setup-confirm-key"
                type={showMasterKey ? 'text' : 'password'}
                value={setupConfirmKey}
                onChange={(e) => setSetupConfirmKey(e.target.value)}
                placeholder="Re-enter Master Key"
                autoComplete="new-password"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
                required
              />
            </div>

            <div className="pt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={onReturnToHub}
                className="w-1/3 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-sora font-bold shadow-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{submitting ? 'Encrypting Master Key...' : 'Claim Master Key & Unlock'}</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleUnlockConsole} className="mt-6 space-y-4">
            {authError && (
              <div className="bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs p-3 rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-300">Key Authority:</span>
              <span className="text-emerald-300 font-bold">
                {authStatus?.mode === 'env_configured' ? 'Server Secret (ADMIN_MASTER_KEY)' : 'Server Scrypt Claimed Key'}
              </span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-pin-input" className="text-xs font-mono font-semibold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-purple-300" />
                  <span>Administrative Master Key</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Master Key Only</span>
              </label>
              <div className="relative">
                <input
                  id="admin-pin-input"
                  type={showMasterKey ? 'text' : 'password'}
                  value={masterKeyInput}
                  onChange={(e) => setMasterKeyInput(e.target.value)}
                  placeholder="Enter your Administrative Master Key"
                  maxLength={128}
                  autoComplete="current-password"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowMasterKey(!showMasterKey)}
                  aria-label={showMasterKey ? 'Hide Master Key' : 'Show Master Key'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showMasterKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={onReturnToHub}
                className="w-1/3 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-sora font-bold shadow-lg shadow-purple-900/40 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{submitting ? 'Verifying Master Key...' : 'Unlock Admin Backend'}</span>
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Server-Verified Master Key</span>
              <span>In-Memory Bearer Auth</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
