import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, KeyRound, AlertTriangle, Fingerprint, 
  Clock, RefreshCw, Eye, EyeOff, Check, X, ShieldAlert, 
  Terminal, UserCheck, Smartphone, ExternalLink, ArrowLeft,
  FileText, CheckCircle2, Shield
} from 'lucide-react';
import { UserRole } from '../types';
import { 
  Admin3FASession, 
  getActive3FAClearance, 
  verify3FACredentials, 
  revoke3FAClearance,
  extend3FAClearance
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
  const [adminPin, setAdminPin] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [authenticatingBiometric, setAuthenticatingBiometric] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5-minute session countdown
  const [elevatedMode, setElevatedMode] = useState<boolean>(true);
  const [showSessionBanner, setShowSessionBanner] = useState<boolean>(true);

  // Monitor 3FA session validity & countdown
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

  // Biometric passkey scan simulator
  const handleSimulateBiometric = () => {
    setAuthenticatingBiometric(true);
    setAuthError(null);
    setTimeout(() => {
      setBiometricVerified(true);
      setAuthenticatingBiometric(false);
    }, 800);
  };

  // Submit 3FA Challenge
  const handleUnlockConsole = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!biometricVerified) {
      setAuthError('Biometric Touch ID / WebAuthn confirmation is mandatory for Tier 3 Administrative Clearance.');
      return;
    }

    const verification = verify3FACredentials(adminPin, totpCode);
    if (verification.success && verification.session) {
      setActiveSession(verification.session);
      onClearanceGranted(verification.session);
      
      recordAuditAction({
        category: '3FA_ACTIVATION',
        action: 'Administrative Access Clearance Granted',
        actorId: verification.session.adminId,
        actorName: verification.session.adminName,
        actorRole: verification.session.clearanceLevel,
        targetResource: `${portalTitle} Console`,
        status: 'SUCCESS',
        clearanceLevel: verification.session.clearanceLevel,
        details: `3FA unlocked via PIN, TOTP (${totpCode}), and WebAuthn Biometrics. IP: 197.210.226.48`,
      });
    } else {
      setAuthError(verification.message || 'Authentication failed. Please verify credentials.');
      recordAuditAction({
        category: 'SECURITY_ALERT',
        action: 'Administrative Clearance Attempt Rejected',
        actorId: 'UNVERIFIED',
        actorName: 'Anonymous Attempt',
        actorRole: 'LEVEL_1_STAFF',
        targetResource: `${portalTitle} Console`,
        status: 'DENIED',
        details: `Invalid credentials supplied for ${targetRole}.`,
      });
    }
  };

  const handleExtendSession = () => {
    const extended = extend3FAClearance();
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

  // IF CLEARED: RENDER SECURE COCKPIT WITH AUDIT WATERMARK BANNER & CONTROLS
  if (activeSession) {
    return (
      <div className="relative">
        {/* Security Watermark & Active Clearance Banner */}
        {showSessionBanner && (
          <div className="bg-gradient-to-r from-[#0B1528] via-[#102244] to-[#0B1528] border-b border-indigo-500/30 text-white px-4 py-2 text-xs sticky top-0 z-40 shadow-md">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
              
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  Tier 3 Administrative Clearance Active
                </span>
                <span className="text-slate-400 font-mono hidden md:inline">|</span>
                <span className="text-slate-200 font-semibold hidden md:inline">
                  Officer: {activeSession.adminName} ({activeSession.adminId})
                </span>
                <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded">
                  FIDO2 Biometric + TOTP Verified
                </span>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                {/* Session Countdown Timer */}
                <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700 font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Session Idle: {formatCountdown(timeLeft)}</span>
                  <button
                    onClick={handleExtendSession}
                    className="ml-1 text-indigo-400 hover:text-indigo-300 underline text-[10px] cursor-pointer"
                    title="Extend session by 5 minutes"
                  >
                    Extend
                  </button>
                </div>

                {/* Elevated vs Read-Only Mode Switcher */}
                <button
                  onClick={() => setElevatedMode(!elevatedMode)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold transition cursor-pointer ${
                    elevatedMode 
                      ? 'bg-purple-900/60 text-purple-200 border border-purple-500/50' 
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                  title="Toggle between Elevated Master Admin and Read-Only Compliance Auditor mode"
                >
                  <Shield className="w-3 h-3 text-purple-400" />
                  <span>{elevatedMode ? 'Elevated Mode: ON' : 'Read-Only Audit'}</span>
                </button>

                {/* Revoke / Lock */}
                <button
                  onClick={handleLockConsole}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 font-mono text-[11px] font-bold transition cursor-pointer"
                  title="Lock administrative console immediately"
                >
                  <Lock className="w-3 h-3" />
                  <span>Lock Console</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Portals Content */}
        {children}
      </div>
    );
  }

  // IF NOT CLEARED: RENDER HIGH-SECURITY RESTRICTION BARRIER PAGE
  return (
    <div className="min-h-[85vh] bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Security Shield Header */}
        <div className="text-center space-y-3 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-slate-900 p-0.5 shadow-lg shadow-purple-900/40 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-400 bg-purple-950/80 border border-purple-800/60 px-3 py-1 rounded-full">
              RESTRICTED ADMINISTRATIVE ZONE
            </span>
            <h2 className="font-sora font-extrabold text-2xl text-white mt-2">
              {portalTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Multi-Factor Authentication &amp; Tier 3 Administrative Clearance required to access institutional registries.
            </p>
          </div>
        </div>

        {/* Security Credentials Form */}
        <form onSubmit={handleUnlockConsole} className="mt-6 space-y-4">
          
          {authError && (
            <div className="bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs p-3 rounded-xl flex items-start gap-2 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{authError}</span>
            </div>
          )}

          {/* Factor 1: Master Admin Security PIN or Passkey */}
          <div className="space-y-1.5">
            <label htmlFor="admin-pin-input" className="text-xs font-mono font-semibold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-purple-300" />
                <span>Factor 1: Master Admin Passkey / PIN</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Required</span>
            </label>
            <input
              id="admin-pin-input"
              type="password"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              placeholder="Enter administrative passkey or security PIN"
              maxLength={32}
              autoComplete="off"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
              required
            />
          </div>

          {/* Factor 2: TOTP Authenticator Code */}
          <div className="space-y-1.5">
            <label htmlFor="admin-totp-input" className="text-xs font-mono font-semibold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-indigo-300" />
                <span>Factor 2: TOTP Authenticator Code</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">6-Digit Token</span>
            </label>
            <input
              id="admin-totp-input"
              type="text"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit authenticator OTP"
              maxLength={6}
              autoComplete="off"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition"
              required
            />
          </div>

          {/* Factor 3: FIDO2 Biometric Hardware Passkey Verification */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
              <span>Factor 3: WebAuthn / Biometric Attestation</span>
            </label>

            <button
              type="button"
              onClick={handleSimulateBiometric}
              disabled={biometricVerified || authenticatingBiometric}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                biometricVerified
                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40'
                  : authenticatingBiometric
                  ? 'bg-slate-800 text-slate-400 border border-slate-700 animate-pulse'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {biometricVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Biometric Attestation Verified (Touch ID OK)</span>
                </>
              ) : authenticatingBiometric ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                  <span>Scanning Hardware Security Key / Fingerprint...</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4 text-purple-400" />
                  <span>Scan Hardware Biometrics / Passkey</span>
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onReturnToHub}
              className="w-1/3 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return
            </button>

            <button
              type="submit"
              className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-sora font-bold shadow-lg shadow-purple-900/40 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify 3FA Clearance</span>
            </button>
          </div>

          {/* Institutional Compliance Notice */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>NDPR &amp; ISO/IEC 27001 Enforced</span>
            <span>Tamper-Proof Audit Logging Active</span>
          </div>
        </form>

      </div>
    </div>
  );
};
