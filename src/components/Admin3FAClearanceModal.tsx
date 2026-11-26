import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  AlertTriangle,
  X,
  ArrowRight,
  Check,
  CheckCircle2,
  RefreshCw,
  Clock,
  Timer,
  RotateCw,
  LogOut,
  Eye,
  EyeOff,
  Server,
} from 'lucide-react';
import {
  Admin3FASession,
  AdminAuthStatus,
  getActive3FAClearance,
  fetchAdminAuthStatus,
  claimAdminMasterKey,
  loginWithAdminMasterKey,
  renew3FAClearanceServer,
  revoke3FAClearance,
  getSessionRemainingSeconds,
  subscribeAdminSession,
} from '../services/admin3FAService';

interface Admin3FAClearanceModalProps {
  isOpen: boolean;
  targetRole?: string;
  targetTabName?: string;
  onClose: () => void;
  onClearanceGranted?: (session: Admin3FASession) => void;
  onClearanceVerified?: (session: Admin3FASession) => void;
}

export const Admin3FAClearanceModal: React.FC<Admin3FAClearanceModalProps> = ({
  isOpen,
  targetRole,
  targetTabName,
  onClose,
  onClearanceGranted,
  onClearanceVerified,
}) => {
  const [authStatus, setAuthStatus] = useState<AdminAuthStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [activeSession, setActiveSession] = useState<Admin3FASession | null>(() => getActive3FAClearance());
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() =>
    getSessionRemainingSeconds(getActive3FAClearance())
  );
  const [isRenewing, setIsRenewing] = useState<boolean>(false);
  const [renewalMessage, setRenewalMessage] = useState<string | null>(null);

  const [masterKeyInput, setMasterKeyInput] = useState('');
  const [confirmKeyInput, setConfirmKeyInput] = useState('');
  const [adminNameInput, setAdminNameInput] = useState('Principal Master Administrator');
  const [adminEmailInput, setAdminEmailInput] = useState('admin@ilearnit365.edu.ng');
  const [showKey, setShowKey] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const destinationLabel =
    targetTabName || (targetRole ? targetRole.toUpperCase().replace('_', ' ') : 'SECURE ADMINISTRATIVE BACKEND');

  const notifyClearance = (session: Admin3FASession) => {
    if (onClearanceGranted) onClearanceGranted(session);
    if (onClearanceVerified) onClearanceVerified(session);
  };

  useEffect(() => {
    const unsub = subscribeAdminSession(() => {
      const current = getActive3FAClearance();
      setActiveSession(current);
      setRemainingSeconds(getSessionRemainingSeconds(current));
    });
    return unsub;
  }, []);

  useEffect(() => {
    const updateSessionTime = () => {
      const current = getActive3FAClearance();
      setActiveSession(current);
      if (current) {
        const secs = getSessionRemainingSeconds(current);
        setRemainingSeconds(secs);
        if (secs <= 0) setActiveSession(null);
      } else {
        setRemainingSeconds(0);
      }
    };

    updateSessionTime();
    const interval = setInterval(updateSessionTime, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setLoadingStatus(true);
      setErrorMsg(null);
      setRenewalMessage(null);
      setMasterKeyInput('');
      setConfirmKeyInput('');
      fetchAdminAuthStatus()
        .then((s) => setAuthStatus(s))
        .catch(() => setErrorMsg('Unable to check server Master Key status.'))
        .finally(() => setLoadingStatus(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatCountdown = (totalSeconds: number): string => {
    if (totalSeconds <= 0) return '00:00';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const maxSessionSeconds = 25 * 60;
  const percentRemaining = Math.min(100, Math.max(0, (remainingSeconds / maxSessionSeconds) * 100));
  const isExpiringSoon = remainingSeconds > 0 && remainingSeconds <= 300;
  const isSessionActive = activeSession !== null && remainingSeconds > 0;
  const isSetupRequired = authStatus?.mode === 'setup_required';

  const handleRenewClearance = async (minutes: number = 25) => {
    setIsRenewing(true);
    const renewed = await renew3FAClearanceServer(minutes);
    setIsRenewing(false);
    if (renewed) {
      setActiveSession(renewed);
      setRemainingSeconds(getSessionRemainingSeconds(renewed));
      setRenewalMessage(`Administrative Bearer session renewed (+${minutes} minutes).`);
      notifyClearance(renewed);
      setTimeout(() => setRenewalMessage(null), 4000);
    }
  };

  const handleRevokeActiveSession = () => {
    revoke3FAClearance();
    setActiveSession(null);
    setRemainingSeconds(0);
  };

  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isSetupRequired) {
      if (masterKeyInput.trim().length < 8) {
        setErrorMsg('Master Key must be at least 8 characters.');
        return;
      }
      if (masterKeyInput !== confirmKeyInput) {
        setErrorMsg('Master Key confirmation does not match.');
        return;
      }

      setSubmitting(true);
      const res = await claimAdminMasterKey({
        masterKey: masterKeyInput.trim(),
        adminName: adminNameInput.trim(),
        adminEmail: adminEmailInput.trim(),
      });
      setSubmitting(false);

      if (res.success && res.session) {
        setActiveSession(res.session);
        if (res.status) setAuthStatus(res.status);
        setRemainingSeconds(getSessionRemainingSeconds(res.session));
        notifyClearance(res.session);
      } else {
        setErrorMsg(res.message || 'Failed to claim Master Key.');
      }
    } else {
      if (!masterKeyInput.trim()) {
        setErrorMsg('Administrative Master Key is required.');
        return;
      }

      setSubmitting(true);
      const res = await loginWithAdminMasterKey({
        masterKey: masterKeyInput.trim(),
      });
      setSubmitting(false);

      if (res.success && res.session) {
        setActiveSession(res.session);
        setRemainingSeconds(getSessionRemainingSeconds(res.session));
        notifyClearance(res.session);
      } else {
        setErrorMsg(res.message || 'Invalid Administrative Master Key.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-white max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-slate-900 via-[#0B1D3A] to-slate-950 p-5 sm:p-6 text-white flex items-center justify-between border-b border-emerald-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl border bg-blue-500/20 border-blue-400/40 text-blue-300 flex items-center justify-center">
              {isSessionActive ? <ShieldCheck className="w-6 h-6 text-emerald-300" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded border bg-blue-500/20 text-blue-200 border-blue-400/30">
                  {isSessionActive ? 'BEARER SESSION ACTIVE' : isSetupRequired ? 'FIRST-RUN SETUP' : 'MASTER KEY ONLY'}
                </span>
                <span className="text-[10px] font-mono text-slate-300">Target: {destinationLabel}</span>
              </div>
              <h3 className="font-sora font-extrabold text-lg text-white">
                Administrative Clearance Gate
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-5">
          {isSessionActive ? (
            <div className="space-y-4">
              {renewalMessage && (
                <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{renewalMessage}</span>
                </div>
              )}

              <div className="bg-slate-900 rounded-2xl p-5 border border-emerald-500/40 text-white space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="font-sora font-bold text-sm">{activeSession.adminName}</div>
                    <div className="text-[11px] font-mono text-slate-300">
                      {activeSession.adminEmail} • {activeSession.sessionId}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-400 flex items-center justify-end gap-1">
                      <Timer className="w-3 h-3 text-cyan-400" /> Session TTL
                    </div>
                    <div className={`font-mono text-2xl font-extrabold ${isExpiringSoon ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {formatCountdown(remainingSeconds)}
                    </div>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000"
                    style={{ width: `${percentRemaining}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-slate-950/70 rounded-xl p-2 border border-slate-800 text-emerald-300 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Master Key Verified
                  </div>
                  <div className="bg-slate-950/70 rounded-xl p-2 border border-slate-800 text-emerald-300 flex items-center gap-1">
                    <Check className="w-3 h-3" /> In-Memory Bearer
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleRenewClearance(25)}
                    disabled={isRenewing}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-sora font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RotateCw className={`w-4 h-4 ${isRenewing ? 'animate-spin' : ''}`} />
                    <span>Renew Session (+25m)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRevokeActiveSession}
                    className="px-4 py-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-200 font-mono text-xs border border-rose-500/40 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Lock</span>
                  </button>
                </div>
              </div>
            </div>
          ) : loadingStatus ? (
            <div className="py-10 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
              <p className="text-xs font-mono text-slate-500 dark:text-slate-300">Checking server authentication state...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitAuth} className="space-y-4">
              {errorMsg && (
                <div className="bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs p-3 rounded-xl flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {isSetupRequired && (
                <div className="bg-blue-50 dark:bg-indigo-950/50 border border-blue-200 dark:border-indigo-500/30 rounded-xl p-3 text-xs text-slate-700 dark:text-indigo-100 flex items-start gap-2.5">
                  <Server className="w-4 h-4 text-blue-600 dark:text-indigo-300 shrink-0 mt-0.5" />
                  <span>
                    Set your private Administrative Master Key below (min 8 chars).
                  </span>
                </div>
              )}

              {isSetupRequired && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Admin Name</label>
                    <input
                      type="text"
                      value={adminNameInput}
                      onChange={(e) => setAdminNameInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold mb-1">Admin Email</label>
                    <input
                      type="email"
                      value={adminEmailInput}
                      onChange={(e) => setAdminEmailInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-bold mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-500" />
                  <span>{isSetupRequired ? 'Create Master Key (min 8 chars)' : 'Administrative Master Key'}</span>
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={masterKeyInput}
                    onChange={(e) => setMasterKeyInput(e.target.value)}
                    placeholder="Enter server-verified Administrative Master Key"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-sm font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSetupRequired && (
                <div>
                  <label className="block text-xs font-mono font-bold mb-1.5">Confirm Master Key</label>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={confirmKeyInput}
                    onChange={(e) => setConfirmKeyInput(e.target.value)}
                    placeholder="Re-enter Master Key"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono"
                    required
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-sora font-bold bg-[#0B1D3A] hover:bg-[#132C54] dark:bg-blue-600 dark:hover:bg-blue-500 text-white flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <span>{submitting ? 'Verifying...' : isSetupRequired ? 'Claim Master Key' : 'Unlock Backend'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/90 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500 shrink-0">
          <span>Master Key Alone Mode Active</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-500" /> 25m In-Memory Bearer Session
          </span>
        </div>
      </div>
    </div>
  );
};
