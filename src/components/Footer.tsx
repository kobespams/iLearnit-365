import React from 'react';
import { UserRole } from '../types';
import { ShieldCheck, Globe } from 'lucide-react';

interface FooterProps {
  onSelectRole: (role: UserRole) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectRole }) => {
  return (
    <footer className="bg-[#0B1D3A] text-slate-200 border-t border-[#132C54] mt-16 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-cyan-400/30 bg-slate-950 p-0.5 shadow-md">
              <img
                src="/src/assets/images/ilearnit_logo_1786816502338.jpg"
                alt="iLearnit-365 Academy Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <div className="font-sora font-extrabold text-2xl text-white tracking-tight flex items-center gap-1">
                iLearnit<span className="text-amber-300">-365</span>
              </div>
              <p className="text-[11px] font-mono uppercase text-amber-300 font-bold">
                Learn • Grow • Achieve
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-100">
            <button type="button" onClick={() => onSelectRole('hub')} className="hover:text-amber-300 transition-colors cursor-pointer">
              Home
            </button>
            <button type="button" onClick={() => onSelectRole('jamb_driller')} className="hover:text-amber-300 transition-colors cursor-pointer">
              JAMB Learning Center
            </button>
            <button type="button" onClick={() => onSelectRole('student')} className="hover:text-blue-300 transition-colors cursor-pointer">
              Student Portal
            </button>
            <button type="button" onClick={() => onSelectRole('teacher')} className="hover:text-emerald-300 transition-colors cursor-pointer">
              Teacher Portal
            </button>
            <button type="button" onClick={() => onSelectRole('parent')} className="hover:text-amber-300 transition-colors cursor-pointer">
              Parent Portal
            </button>
            <button type="button" onClick={() => onSelectRole('privacy_center')} className="text-emerald-300 hover:text-white underline transition-colors cursor-pointer">
              Privacy Policy &amp; Data Protection
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-200">
          <p>
            © 2026 iLearnit-365. Device-local session isolation with HTTPS transport.{' '}
            <button
              type="button"
              onClick={() => onSelectRole('privacy_center')}
              className="underline text-amber-300 hover:text-white cursor-pointer"
            >
              Read how student data is protected
            </button>
            .
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onSelectRole('privacy_center')}
              className="flex items-center gap-1.5 text-slate-100 hover:text-emerald-300 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" /> NDPA · COPPA · GDPR &amp; Minor Consent
            </button>
            <span className="flex items-center gap-1.5 text-slate-200">
              <Globe className="w-4 h-4 text-blue-300" aria-hidden="true" /> 3G &amp; Offline Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
