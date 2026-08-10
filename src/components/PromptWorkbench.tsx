import React, { useState, useEffect } from 'react';
import { generateContent } from '../services/api';
import { PromptTemplate, PromptHistoryItem } from '../types';
import { Send, Copy, Check, Clock, Trash2, Sliders, Sparkles, BookOpen, ChevronRight, RefreshCw } from 'lucide-react';

const PRESET_TEMPLATES: PromptTemplate[] = [
  {
    id: 'api-design',
    title: 'REST API Architecture',
    description: 'Design a clean OpenAPI / REST endpoints blueprint',
    category: 'Coding',
    prompt: 'Design a RESTful API specification for a modern e-commerce platform handling orders, user inventory, and payment callbacks. Include endpoints, HTTP methods, payload schemas, and standard error handling.',
    systemInstruction: 'You are a Senior Principal Software Architect specializing in clean RESTful APIs and distributed systems.',
    temperature: 0.3,
  },
  {
    id: 'tech-summary',
    title: 'Technical Executive Brief',
    description: 'Summarize complex architectural documents',
    category: 'Analysis',
    prompt: 'Summarize the technical trade-offs between Monolithic, Microservices, and Event-Driven Serverless architectures for a high-concurrency real-time analytics engine.',
    systemInstruction: 'Provide concise, bulleted executive summaries with clear decision matrices.',
    temperature: 0.5,
  },
  {
    id: 'sql-schema',
    title: 'PostgreSQL Schema & Indexes',
    description: 'Generate optimized SQL tables with indexing',
    category: 'Coding',
    prompt: 'Create a PostgreSQL database schema for a subscription SaaS app with multi-tenancy, user roles, billing history, and optimized indexes for fast query execution.',
    systemInstruction: 'Output valid SQL DDL scripts with foreign keys, indexes, and descriptive comments.',
    temperature: 0.2,
  },
  {
    id: 'content-writer',
    title: 'Product Announcement',
    description: 'Draft developer-focused release notes',
    category: 'Writing',
    prompt: 'Draft a compelling release announcement for developer tools introducing automatic type-checking, streaming WebSocket support, and 50% faster cold start times.',
    systemInstruction: 'Write in a clear, energetic, developer-friendly voice.',
    temperature: 0.8,
  },
];

interface PromptWorkbenchProps {
  selectedModel: string;
}

export const PromptWorkbench: React.FC<PromptWorkbenchProps> = ({ selectedModel }) => {
  const [prompt, setPrompt] = useState('');
  const [systemInstruction, setSystemInstruction] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [duration, setDuration] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ai_workbench_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved history', e);
      }
    }
  }, []);

  const saveHistory = (newItem: PromptHistoryItem) => {
    const updated = [newItem, ...history.slice(0, 19)];
    setHistory(updated);
    localStorage.setItem('ai_workbench_history', JSON.stringify(updated));
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setResponse('');
    setDuration(null);

    const result = await generateContent({
      model: selectedModel,
      prompt,
      systemInstruction: systemInstruction.trim() || undefined,
      temperature,
    });

    setResponse(result.text);
    setDuration(result.durationMs);
    setLoading(false);

    saveHistory({
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: selectedModel,
      prompt,
      systemInstruction: systemInstruction.trim() || undefined,
      response: result.text,
      durationMs: result.durationMs,
    });
  };

  const applyTemplate = (template: PromptTemplate) => {
    setPrompt(template.prompt);
    if (template.systemInstruction) setSystemInstruction(template.systemInstruction);
    if (template.temperature !== undefined) setTemperature(template.temperature);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('ai_workbench_history');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Templates Row */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" /> Starter Prompt Templates
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => applyTemplate(tmpl)}
              className="group text-left bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 p-4 rounded-xl transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 px-2 py-0.5 rounded-md">
                    {tmpl.category}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="font-medium text-slate-200 text-sm mb-1 group-hover:text-white">
                  {tmpl.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {tmpl.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Main Grid: Prompt Controls & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Input Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="font-semibold text-slate-200 text-sm">Prompt Input</h3>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  showSettings ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Config</span>
              </button>
            </div>

            {/* System Instruction Drawer */}
            {showSettings && (
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-3 animate-fadeIn">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    System Instruction
                  </label>
                  <input
                    type="text"
                    value={systemInstruction}
                    onChange={(e) => setSystemInstruction(e.target.value)}
                    placeholder="e.g. You are an expert TypeScript engineer..."
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Temperature</span>
                    <span className="font-mono text-indigo-400">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 bg-slate-800 cursor-pointer h-1.5 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Main Prompt Textarea */}
            <div>
              <textarea
                rows={7}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your prompt or question here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 resize-y leading-relaxed"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-mono">
                {prompt.length} chars
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPrompt('')}
                  className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || loading}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Run Prompt
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* History Accordion */}
          {history.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <h3 className="font-semibold text-slate-300 text-xs uppercase tracking-wider">
                    Recent History ({history.length})
                  </h3>
                </div>
                <button
                  onClick={clearHistory}
                  className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                  title="Clear history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setPrompt(item.prompt);
                      if (item.systemInstruction) setSystemInstruction(item.systemInstruction);
                      setResponse(item.response);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 transition-all flex justify-between items-start gap-3 group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-200 truncate group-hover:text-indigo-300">
                        {item.prompt}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {item.timestamp} • {item.model}
                      </p>
                    </div>
                    {item.durationMs && (
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {item.durationMs}ms
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Output Column (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg h-full flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 className="font-semibold text-slate-200 text-sm">Output Stream</h3>
              </div>

              {response && (
                <div className="flex items-center gap-2">
                  {duration && (
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                      {duration}ms
                    </span>
                  )}
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-950/50 border border-indigo-800/50 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-y-auto min-h-[320px] max-h-[600px] leading-relaxed whitespace-pre-wrap scrollbar-thin">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 space-y-3">
                  <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                  <p className="text-xs">Processing prompt with {selectedModel}...</p>
                </div>
              ) : response ? (
                response
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center py-12 space-y-2">
                  <Sparkles className="w-8 h-8 text-slate-700" />
                  <p className="text-xs">Select a template or write a prompt to see generated results here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
