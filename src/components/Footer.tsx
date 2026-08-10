import React from 'react';
import { UserRole } from '../types';
import { ShieldCheck, Globe, Heart } from 'lucide-react';

interface FooterProps {
  onSelectRole: (role: UserRole) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectRole }) => {
  return (
    <footer className="bg-[#0B1D3A] text-slate-300 border-t border-[#132C54] mt-20 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="font-sora font-extrabold text-2xl text-white tracking-tight flex items-center gap-1">
              iLearnit<span className="text-[#CC9A2E]">-365</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              AI-Powered, Cloud-Secured Learning Ecosystem unifying students, educators, and families under one intelligent roof.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
            <button onClick={() => onSelectRole('hub')} className="hover:text-white transition-colors cursor-pointer">
              Role Hub
            </button>
            <button onClick={() => onSelectRole('student')} className="hover:text-[#2F6FE0] transition-colors cursor-pointer">
              Student Portal
            </button>
            <button onClick={() => onSelectRole('teacher')} className="hover:text-[#2E9B58] transition-colors cursor-pointer">
              Teacher Portal
            </button>
            <button onClick={() => onSelectRole('parent')} className="hover:text-[#CC9A2E] transition-colors cursor-pointer">
              Parent Portal
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 iLearnit-365. All rights reserved. Cloud-Secured Learning Platform.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#2E9B58]" /> FERPA & COPPA Compliant
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-4 h-4 text-[#2F6FE0]" /> Global AI Studio
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
