import React, { useState } from 'react';
import { generateContent } from '../services/api';
import { Code, Play, Copy, Check, Wrench, FileCode, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

const LANGUAGES = [
  { id: 'typescript', name: 'TypeScript / React' },
  { id: 'python', name: 'Python' },
  { id: 'sql', name: 'PostgreSQL / SQL' },
  { id: 'rust', name: 'Rust' },
  { id: 'go', name: 'Go' },
  { id: 'html-tailwind', name: 'HTML & Tailwind CSS' },
];

interface CodeGeneratorProps {
  selectedModel: string;
}

export const CodeGenerator: React.FC<CodeGeneratorProps> = ({ selectedModel }) => {
  const [language, setLanguage] = useState('typescript');
  const [mode, setMode] = useState<'generate' | 'refactor' | 'explain' | 'fix'>('generate');
  const [prompt, setPrompt] = useState('');
  const [existingCode, setExistingCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleRun = async () => {
    if (!prompt.trim() && !existingCode.trim()) return;

    setLoading(true);
    setOutput('');

    let combinedPrompt = '';
    const langLabel = LANGUAGES.find((l) => l.id === language)?.name || language;

    if (mode === 'generate') {
      combinedPrompt = `Generate production-ready ${langLabel} code for: ${prompt}. Return the code block cleanly with clear comments.`;
    } else if (mode === 'refactor') {
      combinedPrompt = `Refactor the following ${langLabel} code to improve readability, performance, and best practices:\n\n\`\`\`${language}\n${existingCode}\n\`\`\`\n\nSpecific instructions: ${prompt || 'Optimize and clean up.'}`;
    } else if (mode === 'explain') {
      combinedPrompt = `Explain the following ${langLabel} code step-by-step in clear, easy to understand bullet points:\n\n\`\`\`${language}\n${existingCode}\n\`\`\``;
    } else if (mode === 'fix') {
      combinedPrompt = `Identify and fix bugs or edge cases in the following ${langLabel} code:\n\n\`\`\`${language}\n${existingCode}\n\`\`\`\n\nIssue description: ${prompt || 'Find potential crashes or bugs.'}`;
    }

    const systemInstruction = `You are an expert Principal Software Engineer. Write clean, efficient, bug-free ${langLabel} code adhering strictly to best practices.`;

    const result = await generateContent({
      model: selectedModel,
      prompt: combinedPrompt,
      systemInstruction,
      temperature: 0.2, // low temp for accurate code
    });

    setOutput(result.text);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-400" /> AI Code Generator & Refactoring Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Write, refactor, debug, or explain clean code across multiple modern languages.
          </p>
        </div>

        {/* Language Picker */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-1.5 rounded-xl">
          <FileCode className="w-4 h-4 text-indigo-400 ml-2" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-2"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-slate-900">
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setMode('generate')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            mode === 'generate'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Generate New Code
        </button>

        <button
          onClick={() => setMode('refactor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            mode === 'refactor'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" /> Refactor & Optimize
        </button>

        <button
          onClick={() => setMode('fix')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            mode === 'fix'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> Debug & Fix Bugs
        </button>

        <button
          onClick={() => setMode('explain')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            mode === 'explain'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4" /> Explain Code
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="font-semibold text-slate-200 text-sm">
              {mode === 'generate' && 'Describe what code you want to create'}
              {mode === 'refactor' && 'Paste code to refactor & instructions'}
              {mode === 'fix' && 'Paste buggy code & describe the issue'}
              {mode === 'explain' && 'Paste code to analyze & explain'}
            </h3>

            {(mode === 'refactor' || mode === 'fix' || mode === 'explain') && (
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-mono">Input Source Code</label>
                <textarea
                  rows={8}
                  value={existingCode}
                  onChange={(e) => setExistingCode(e.target.value)}
                  placeholder="// Paste existing code snippet here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono">
                {mode === 'generate' ? 'Specification / Request' : 'Additional Instructions (Optional)'}
              </label>
              <textarea
                rows={mode === 'generate' ? 8 : 3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  mode === 'generate'
                    ? 'e.g., Create a custom React hook for debouncing search inputs with loading states...'
                    : 'e.g., Simplify nested loops and convert callbacks to async/await...'
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleRun}
              disabled={loading || (!prompt.trim() && !existingCode.trim())}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold py-3 rounded-xl transition-all cursor-pointer shadow-md"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Processing Code...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Execute Code Action
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg h-full flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" /> Generated Code & Explanation
              </h3>

              {output && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-950/50 border border-indigo-800/50 px-2.5 py-1 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-y-auto min-h-[320px] max-h-[600px] leading-relaxed whitespace-pre-wrap scrollbar-thin">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 space-y-3">
                  <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                  <p className="text-xs">Generating code solution...</p>
                </div>
              ) : output ? (
                output
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center py-12 space-y-2">
                  <Code className="w-8 h-8 text-slate-700" />
                  <p className="text-xs">Your generated code and refactored output will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
