import React, { useState } from 'react';
import { 
  KeyRound, 
  Terminal, 
  Database, 
  AlertTriangle, 
  ShieldCheck, 
  Check, 
  Play, 
  RefreshCw, 
  Lock, 
  Unlock,
  Layers,
  Cpu
} from 'lucide-react';
import { CyberSecurityLevel } from '../types';

interface CyberPracticeLabProps {
  currentLevel: CyberSecurityLevel;
}

export const CyberPracticeLab: React.FC<CyberPracticeLabProps> = ({ currentLevel }) => {
  // Password Entropy state
  const [testPassword, setTestPassword] = useState('MyP@ssw0rd!2026');
  
  // Symmetric Encryption state
  const [plainMessage, setPlainMessage] = useState('Confidential Student Exam Data - 2026');
  const [aesKey, setAesKey] = useState('7f9b8c2d1e4a5b6f3c2a1d4e7b8c9f0a');
  const [isEncrypted, setIsEncrypted] = useState(false);

  // SQL Injection simulation state
  const [rawInput, setRawInput] = useState("admin' OR '1'='1");
  const [defenseMode, setDefenseMode] = useState<'vulnerable' | 'parameterized'>('vulnerable');

  // Calculate entropy
  const calculateEntropy = (pwd: string) => {
    let pool = 0;
    if (/[a-z]/.test(pwd)) pool += 26;
    if (/[A-Z]/.test(pwd)) pool += 26;
    if (/[0-9]/.test(pwd)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) pool += 33;
    if (pool === 0) return { entropy: 0, crackTime: 'Instant', strength: 'Very Weak' };
    const entropy = Math.round(pwd.length * Math.log2(pool));
    
    let crackTime = 'Instant';
    let strength = 'Very Weak';
    if (entropy > 80) {
      crackTime = 'Centuries (10^12 years)';
      strength = 'Military Grade';
    } else if (entropy > 60) {
      crackTime = 'Several Years';
      strength = 'Strong';
    } else if (entropy > 40) {
      crackTime = 'A Few Days';
      strength = 'Moderate';
    } else {
      crackTime = 'Seconds to Minutes';
      strength = 'Weak';
    }
    return { entropy, crackTime, strength };
  };

  const entropyData = calculateEntropy(testPassword);

  return (
    <div id="cyber-practice-lab" className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-indigo-800/40 shadow-md">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
            <Terminal className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Interactive Cybersecurity Virtual Lab</h3>
            <p className="text-xs text-slate-300">Hands-on practical experiments and threat defense simulations.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Lab 1: Password Entropy & Brute Force Diagnostic */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">Password Entropy Calculator</h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
              Shannon Entropy Model
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Test Candidate Passphrase</label>
            <input
              id="test-password-input"
              type="text"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter password..."
            />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Entropy</div>
              <div className="text-lg font-black text-blue-600 dark:text-blue-400">{entropyData.entropy} bits</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Brute Force Resistance</div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">{entropyData.crackTime}</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Rating</div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">{entropyData.strength}</div>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Defensive Takeaway: </span>
            A 16-character phrase (`$E = L \times \log_2(R)$`) achieves over 90 bits of entropy, mathematically neutralizing automated GPU hashcat clusters.
          </div>
        </div>

        {/* Lab 2: Cryptographic AES-256 Symmetric Simulation */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">AES-GCM Encryption Cipher</h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300">
              FIPS 140-3
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Plaintext Payload</label>
            <input
              id="crypto-plaintext-input"
              type="text"
              value={plainMessage}
              onChange={(e) => setPlainMessage(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Status: {isEncrypted ? '🔒 Ciphertext (Encrypted)' : '🔓 Plaintext'}</span>
              <button
                id="toggle-encrypt-btn"
                onClick={() => setIsEncrypted(!isEncrypted)}
                className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-[11px] font-semibold transition-colors flex items-center space-x-1"
              >
                {isEncrypted ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                <span>{isEncrypted ? 'Decrypt' : 'Encrypt with AES-256'}</span>
              </button>
            </div>
            <div className="pt-2 text-cyan-300 break-all">
              {isEncrypted 
                ? '0x8f3c7a91b2e45d601a7c8e9f2a4b6c8d0e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b'
                : plainMessage}
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Confidentiality Guard: </span>
            Symmetric ciphers use Galois/Counter Mode (GCM) for authenticated encryption, providing both privacy and tamper-detection.
          </div>
        </div>

        {/* Lab 3: SQL Injection Vulnerability vs Parameterized Query */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">SQL Injection Remediation Sandbox</h4>
            </div>
            <div className="flex items-center space-x-2">
              <button
                id="mode-vulnerable-btn"
                onClick={() => setDefenseMode('vulnerable')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  defenseMode === 'vulnerable'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Vulnerable Concatenation
              </button>
              <button
                id="mode-parameterized-btn"
                onClick={() => setDefenseMode('parameterized')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  defenseMode === 'parameterized'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Parameterized Prepared Statement
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Untrusted User Input Parameter</label>
              <input
                id="sql-input-param"
                type="text"
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 flex flex-col justify-center">
              <div className="text-[11px] text-slate-400 mb-1">Generated Database Execution:</div>
              {defenseMode === 'vulnerable' ? (
                <div className="text-red-400 font-bold">
                  SELECT * FROM users WHERE username = '{rawInput}' AND pass = 'secret';
                  <span className="block text-[10px] text-red-300 mt-1">⚠️ EVALUATION: TRUE (Authentication Bypassed!)</span>
                </div>
              ) : (
                <div className="text-emerald-400 font-bold">
                  SELECT * FROM users WHERE username = ? AND pass = ?;
                  <span className="block text-[10px] text-emerald-300 mt-1">✅ Bound literal parameter: Safe from injection</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
