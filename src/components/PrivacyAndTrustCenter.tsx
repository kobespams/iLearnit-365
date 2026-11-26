import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Users,
  Globe,
  Download,
  Trash2,
  CheckCircle2,
  FileText,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import { UserRole } from '../types';

interface PrivacyAndTrustCenterProps {
  onSelectRole: (role: UserRole) => void;
}

export const PrivacyAndTrustCenter: React.FC<PrivacyAndTrustCenterProps> = ({ onSelectRole }) => {
  const [confirmClear, setConfirmClear] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleExportMyData = () => {
    try {
      const exportPayload: Record<string, unknown> = {
        exportedAt: new Date().toISOString(),
        platform: 'iLearnit-365',
        storageOrigin: 'Browser localStorage (device-local storage)',
        keys: {},
      };
      const keysObj: Record<string, unknown> = {};
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith('ilearnit')) {
          const val = window.localStorage.getItem(k);
          try {
            keysObj[k] = val ? JSON.parse(val) : null;
          } catch {
            keysObj[k] = val;
          }
        }
      }
      exportPayload.keys = keysObj;

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ilearnit365-my-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMessage('Your local learning & profile data has been downloaded as JSON.');
    } catch {
      setStatusMessage('Unable to export local data in this browser session.');
    }
  };

  const handleDeleteLocalData = () => {
    try {
      const toRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith('ilearnit')) toRemove.push(k);
      }
      toRemove.forEach((k) => window.localStorage.removeItem(k));
      setConfirmClear(false);
      setStatusMessage('All iLearnit-365 local profiles, offline study packs, and session logs on this device have been erased.');
    } catch {
      setStatusMessage('Could not clear local data.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-[#0B1D3A] text-slate-100 rounded-3xl p-6 sm:p-10 border border-blue-500/30 shadow-xl space-y-4">
        <button
          type="button"
          onClick={() => onSelectRole('hub')}
          className="inline-flex items-center gap-1.5 text-xs font-sora font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">
            <ShieldCheck className="w-4 h-4" /> Trust, Data Protection &amp; Minor Safety
          </div>
          <h1 className="font-sora font-extrabold text-2xl sm:text-4xl text-white">
            Privacy Policy &amp; How Student Data Is Protected
          </h1>
          <p className="text-sm text-slate-200 max-w-3xl leading-relaxed">
            When we say &ldquo;Cloud-Secured&rdquo;, here is exactly what happens to student, teacher, and parent information—written in plain language without hidden ad trackers or third-party data brokering.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div
          role="status"
          className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 rounded-2xl p-4 text-xs sm:text-sm flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* How Data Is Stored & Protected */}
      <section className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5">
          <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="font-sora font-bold text-xl text-[#0B1D3A] dark:text-white">
            1. How Student Data Is Stored and Protected
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-sora font-bold text-[#0B1D3A] dark:text-white">Device-Local First</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Student profiles, 4-digit access PINs, recent documents, JAMB drill scores, and offline study packs are stored locally inside your browser&apos;s isolated storage so lessons work offline and personal records never sit in unencrypted public buckets.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-sora font-bold text-[#0B1D3A] dark:text-white">Transport Security &amp; AI</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              When you ask the AI Tutor or request a JAMB breakdown, only your current question prompt is sent over HTTPS/TLS through our server proxy route. Student full names, phone numbers, and PINs are never sent to AI models.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-sora font-bold text-[#0B1D3A] dark:text-white">Zero Ad Tracking</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              iLearnit-365 serves zero behavioral advertising, uses no third-party marketing pixels, and never sells or shares learner assessment metrics with data brokers.
            </p>
          </div>
        </div>
      </section>

      {/* Regulatory Compliance: NDPA, COPPA, GDPR */}
      <section className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="font-sora font-bold text-xl text-[#0B1D3A] dark:text-white">
            2. Regional Privacy Compliance (NDPA, COPPA &amp; GDPR)
          </h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
            <h3 className="font-sora font-bold text-emerald-950 dark:text-emerald-200">
              Nigeria Data Protection Act (NDPA 2023)
            </h3>
            <p>
              For learners and schools in Nigeria, we follow NDPA principles of data minimization, purpose limitation, and lawful basis. Under NDPA Section 31, processing personal data of a child or person lacking legal capacity requires verifiable consent from a parent or legal guardian, alongside the right to access, correct, or erase stored data at any time.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-1.5">
            <h3 className="font-sora font-bold text-blue-950 dark:text-blue-200">
              COPPA (Children&apos;s Online Privacy Protection Act — Under 13)
            </h3>
            <p>
              For users under 13, registration requires a parent or guardian&apos;s name, contact email/phone, and explicit parental consent confirmation. Parents can review their child&apos;s gradebook, verify consent codes, or revoke consent and delete records directly inside the Parent Portal.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <h3 className="font-sora font-bold text-[#0B1D3A] dark:text-white">
              GDPR (General Data Protection Regulation)
            </h3>
            <p>
              Where GDPR applies, learners and guardians retain the right of access, data portability (JSON export below), rectification, and erasure (&ldquo;right to be forgotten&rdquo;), as well as age-appropriate consent thresholds (13–16 depending on member state).
            </p>
          </div>
        </div>
      </section>

      {/* Minor Parental Consent Flow */}
      <section className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="font-sora font-bold text-xl text-[#0B1D3A] dark:text-white">
            3. Parental Consent Handling for Minors
          </h2>
        </div>
        <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <li>During student registration, users select an age bracket (<strong>Under 13</strong>, <strong>13–17 Minor</strong>, or <strong>18+ Adult</strong>).</li>
          <li>If under 18, the form requires a parent/guardian contact and an affirmative parental consent check before issuing a PIN, generating a traceable <strong>Parental Consent Code</strong>.</li>
          <li>Parents can enter their child&apos;s 4-digit PIN in the Parent Portal at any time to confirm, inspect, or revoke parental consent, or erase all local records immediately below.</li>
        </ol>
      </section>

      {/* User Data Rights Controls */}
      <section className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-[#0B1D3A] dark:text-slate-200" />
          <h2 className="font-sora font-bold text-xl text-[#0B1D3A] dark:text-white">
            4. Exercise Your Data Rights (NDPA / GDPR / COPPA)
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportMyData}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0B1D3A] hover:bg-[#132C54] text-white font-sora font-bold text-xs cursor-pointer transition"
          >
            <Download className="w-4 h-4" />
            <span>Export My Stored Data (JSON)</span>
          </button>

          {!confirmClear ? (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-700 font-sora font-bold text-xs cursor-pointer transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete All Local Profile &amp; Study Data</span>
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2 bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-700 px-4 py-2.5 rounded-xl text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-semibold text-rose-900 dark:text-rose-100">Confirm permanent local wipe?</span>
              <button
                type="button"
                onClick={handleDeleteLocalData}
                className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold cursor-pointer"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
