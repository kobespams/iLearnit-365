import React, { useState } from 'react';
import { UserRole, StudentDetail } from '../types';
import { X, GraduationCap, BookOpen, Users, Lock, LogIn, KeyRound, Check } from 'lucide-react';
import { SAMPLE_STUDENTS, getStudentByPin } from '../data/mockData';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: (role: UserRole, userName: string, student?: StudentDetail) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSignInSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [pin, setPin] = useState('8842');
  const [email, setEmail] = useState('alex.chen@ilearnit365.edu');

  if (!isOpen) return null;

  const matchedStudent = getStudentByPin(pin);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'student') setEmail('alex.chen@ilearnit365.edu');
    else if (role === 'teacher') setEmail('sarah.jenkins@ilearnit365.edu');
    else if (role === 'parent') setEmail('david.chen@ilearnit365.edu');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let name = matchedStudent ? matchedStudent.name : 'Alex Chen';
    if (selectedRole === 'teacher') name = 'Dr. Sarah Jenkins';
    else if (selectedRole === 'parent') name = matchedStudent?.parentName || 'David Chen';
    
    onSignInSuccess(selectedRole, name, matchedStudent || SAMPLE_STUDENTS[0]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#D8DFEA] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#5B6A88] hover:text-[#0B1D3A] p-1.5 rounded-full hover:bg-[#F6F8FB] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-[#132C54] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Lock className="w-5 h-5 text-[#CC9A2E]" />
          </div>
          <h3 className="font-sora font-bold text-2xl text-[#0B1D3A]">Sign In to iLearnit-365</h3>
          <p className="text-xs text-[#5B6A88]">Select your ecosystem portal to log in.</p>
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

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedRole !== 'teacher' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#0B1D3A] flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" /> Student Access PIN
                </label>
                <span className="text-[10px] text-slate-500 font-mono">e.g. 8842</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter Student PIN..."
                  className="w-full bg-[#F6F8FB] border border-[#D8DFEA] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-[#0B1D3A] focus:outline-none focus:border-[#132C54]"
                />
                {matchedStudent && (
                  <div className="absolute right-2 top-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> {matchedStudent.name}
                  </div>
                )}
              </div>

              {/* Sample PIN Pills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SAMPLE_STUDENTS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setPin(s.pin)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                      pin === s.pin
                        ? 'bg-blue-600 text-white border-blue-600 font-bold'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {s.pin} ({s.name.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#0B1D3A] mb-1">User Identifier Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F6F8FB] border border-[#D8DFEA] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1D3A] focus:outline-none focus:border-[#132C54]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#132C54] hover:bg-[#0B1D3A] text-white font-sora text-xs font-semibold py-3 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4 text-[#CC9A2E]" /> Launch {selectedRole.toUpperCase()} Portal
          </button>
        </form>
      </div>
    </div>
  );
};
