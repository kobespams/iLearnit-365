import React, { useState } from 'react';
import { UserRole, StudentDetail } from '../types';
import { X, GraduationCap, BookOpen, Users, Lock, LogIn, KeyRound, Check, UserPlus, AlertCircle } from 'lucide-react';
import { authenticateByPin, authenticateByEmail, userToStudentDetail } from '../services/authStorage';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: (role: UserRole, userName: string, student?: StudentDetail) => void;
  onNavigateToRegister?: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ 
  isOpen, 
  onClose, 
  onSignInSuccess,
  onNavigateToRegister
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authType, setAuthType] = useState<'pin' | 'email'>('pin');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const matchedUser = pin.length >= 4 ? authenticateByPin(pin) : undefined;

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (authType === 'pin') {
      if (!pin.trim()) {
        setErrorMessage('Please enter your 4-digit Student PIN.');
        return;
      }

      const user = authenticateByPin(pin);
      if (!user) {
        setErrorMessage(`Invalid Student PIN "${pin}". Please verify your PIN or register a new profile.`);
        return;
      }

      const studentDetail = userToStudentDetail(user);
      onSignInSuccess(user.role, user.name, studentDetail);
      onClose();
    } else {
      if (!email.trim()) {
        setErrorMessage('Please enter your registered email.');
        return;
      }

      const user = authenticateByEmail(email, selectedRole);
      if (!user) {
        setErrorMessage(`No account found for "${email}" with role ${selectedRole}.`);
        return;
      }

      const studentDetail = userToStudentDetail(user);
      onSignInSuccess(user.role, user.name, studentDetail);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#D8DFEA] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#5B6A88] hover:text-[#0B1D3A] p-1.5 rounded-full hover:bg-[#F6F8FB] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="relative inline-block mx-auto mb-2 group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500/30 to-amber-500/30 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition pointer-events-none animate-pulse-glow" />
            <div className="cyber-logo-container relative w-16 h-16 rounded-2xl p-1 shadow-lg shadow-cyan-500/20">
              <div className="cyber-scanline" />
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-cyan-400 z-20 pointer-events-none" />
              <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 border-t border-r border-cyan-400 z-20 pointer-events-none" />
              <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 border-b border-l border-amber-400 z-20 pointer-events-none" />
              <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-amber-400 z-20 pointer-events-none" />
              <img
                src="/src/assets/images/ilearnit_logo_1786816502338.jpg"
                alt="iLearnit-365 Logo"
                referrerPolicy="no-referrer"
                className="relative z-10 w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none z-10" />
            </div>
          </div>
          <h3 className="font-sora font-bold text-2xl text-[#0B1D3A]">Sign In to iLearnit-365</h3>
          <p className="text-xs text-[#5B6A88]">Enter your registered Student PIN or credentials.</p>
        </div>

        {/* Role Selector Buttons */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-[#ECF0F6] rounded-2xl border border-[#D8DFEA]">
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              selectedRole === 'student'
                ? 'bg-[#2F6FE0] text-white shadow-sm'
                : 'text-[#4C5A75] hover:text-[#0B1D3A]'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Student
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('teacher')}
            className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              selectedRole === 'teacher'
                ? 'bg-[#2E9B58] text-white shadow-sm'
                : 'text-[#4C5A75] hover:text-[#0B1D3A]'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Teacher
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('parent')}
            className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              selectedRole === 'parent'
                ? 'bg-[#CC9A2E] text-white shadow-sm'
                : 'text-[#4C5A75] hover:text-[#0B1D3A]'
            }`}
          >
            <Users className="w-4 h-4" /> Parent
          </button>
        </div>

        {/* Method Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs border border-slate-200">
          <button
            type="button"
            onClick={() => setAuthType('pin')}
            className={`flex-1 py-1 text-center rounded-lg font-bold transition cursor-pointer ${
              authType === 'pin' ? 'bg-white text-navy shadow-sm' : 'text-slate-500'
            }`}
          >
            4-Digit PIN
          </button>
          <button
            type="button"
            onClick={() => setAuthType('email')}
            className={`flex-1 py-1 text-center rounded-lg font-bold transition cursor-pointer ${
              authType === 'email' ? 'bg-white text-navy shadow-sm' : 'text-slate-500'
            }`}
          >
            Email & Password
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authType === 'pin' ? (
            <div>
              <label className="text-xs font-semibold text-[#0B1D3A] flex items-center gap-1 mb-1">
                <KeyRound className="w-3.5 h-3.5 text-blue-600" /> Student Access PIN
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={8}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN..."
                  className="w-full bg-[#F6F8FB] border border-[#D8DFEA] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-[#0B1D3A] focus:outline-none focus:border-[#132C54]"
                />
                {matchedUser && (
                  <div className="absolute right-2 top-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> {matchedUser.name}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#0B1D3A] mb-1">Registered Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@ilearnit365.edu"
                  className="w-full bg-[#F6F8FB] border border-[#D8DFEA] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1D3A] focus:outline-none focus:border-[#132C54]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0B1D3A] mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F6F8FB] border border-[#D8DFEA] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1D3A] focus:outline-none focus:border-[#132C54]"
                />
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#132C54] hover:bg-[#0B1D3A] text-white font-sora text-xs font-semibold py-3 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4 text-[#CC9A2E]" /> Launch {selectedRole.toUpperCase()} Portal
          </button>
        </form>

        {/* Register Prompt in Modal */}
        {onNavigateToRegister && (
          <div className="border-t border-slate-100 pt-3 text-center">
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToRegister();
              }}
              className="text-xs text-blue-600 hover:underline font-bold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Don't have a PIN? Register New Account</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
