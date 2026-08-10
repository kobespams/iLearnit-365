import React, { useState, useEffect } from 'react';
import { generateContent } from '../services/api';
import { NoteItem } from '../types';
import { FileText, Plus, Trash2, Sparkles, Check, Copy, Languages, ListCheck, Edit3, RefreshCw } from 'lucide-react';

const INITIAL_NOTES: NoteItem[] = [
  {
    id: '1',
    title: 'Product Roadmap & Vision',
    content: `# Product Strategy Notes\n\n- Need to integrate real-time streaming WebSocket capabilities for Gemini models.\n- Ensure low latency < 200ms for prompt evaluations.\n- Design intuitive dark/light mode with sleek modern aesthetics.\n- Conduct quarterly UX audits on vision OCR accuracy.`,
    updatedAt: new Date().toLocaleDateString(),
    tags: ['Strategy', 'Roadmap'],
  },
  {
    id: '2',
    title: 'Meeting Brief - Engineering Architecture',
    content: `## Architecture Review Agenda\n\n1. Review server-side @google/genai SDK setup.\n2. Evaluate caching strategy for frequent database requests.\n3. Verify environment variable protection across all server routes.`,
    updatedAt: new Date().toLocaleDateString(),
    tags: ['Engineering'],
  },
];

interface SmartNotesProps {
  selectedModel: string;
}

export const SmartNotes: React.FC<SmartNotesProps> = ({ selectedModel }) => {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string>('1');
  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ai_smart_notes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotes(parsed);
        if (parsed.length > 0) setActiveNoteId(parsed[0].id);
      } catch (e) {
        setNotes(INITIAL_NOTES);
      }
    } else {
      setNotes(INITIAL_NOTES);
    }
  }, []);

  const saveNotesToStorage = (updated: NoteItem[]) => {
    setNotes(updated);
    localStorage.setItem('ai_smart_notes', JSON.stringify(updated));
  };

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const updateActiveNoteContent = (newContent: string) => {
    if (!activeNote) return;
    const updated = notes.map((n) =>
      n.id === activeNote.id
        ? { ...n, content: newContent, updatedAt: new Date().toLocaleDateString() }
        : n
    );
    saveNotesToStorage(updated);
  };

  const updateActiveNoteTitle = (newTitle: string) => {
    if (!activeNote) return;
    const updated = notes.map((n) =>
      n.id === activeNote.id
        ? { ...n, title: newTitle, updatedAt: new Date().toLocaleDateString() }
        : n
    );
    saveNotesToStorage(updated);
  };

  const createNewNote = () => {
    const newNote: NoteItem = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      updatedAt: new Date().toLocaleDateString(),
      tags: ['General'],
    };
    const updated = [newNote, ...notes];
    saveNotesToStorage(updated);
    setActiveNoteId(newNote.id);
  };

  const deleteActiveNote = () => {
    if (notes.length <= 1) return;
    const updated = notes.filter((n) => n.id !== activeNoteId);
    saveNotesToStorage(updated);
    setActiveNoteId(updated[0].id);
  };

  const runAiTransformation = async (action: 'summarize' | 'actions' | 'improve' | 'translate') => {
    if (!activeNote || !activeNote.content.trim() || loading) return;

    setLoading(true);
    setAiOutput('');

    let prompt = '';
    if (action === 'summarize') {
      prompt = `Provide a concise executive summary of the following document in bullet points:\n\n${activeNote.content}`;
    } else if (action === 'actions') {
      prompt = `Extract a clear checklist of actionable task items from this note:\n\n${activeNote.content}`;
    } else if (action === 'improve') {
      prompt = `Proofread, polish grammar, and enhance formatting of this document while maintaining tone:\n\n${activeNote.content}`;
    } else if (action === 'translate') {
      prompt = `Translate the following note into clear, professional Spanish:\n\n${activeNote.content}`;
    }

    const result = await generateContent({
      model: selectedModel,
      prompt,
      systemInstruction: 'You are an elite executive assistant and writing expert.',
      temperature: 0.4,
    });

    setAiOutput(result.text);
    setLoading(false);
  };

  const appendToNote = () => {
    if (!aiOutput || !activeNote) return;
    updateActiveNoteContent(`${activeNote.content}\n\n---\n### AI Generated Notes\n${aiOutput}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" /> Smart Scratchpad & AI Assistant
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit, and transform meeting notes, specs, or ideas with AI powered quick tools.
          </p>
        </div>

        <button
          onClick={createNewNote}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Document
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Document List Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Documents ({notes.length})
          </h3>
          <div className="space-y-2">
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  note.id === activeNoteId
                    ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/80'
                }`}
              >
                <p className="font-semibold text-xs truncate text-slate-200">{note.title || 'Untitled'}</p>
                <p className="text-[10px] text-slate-500 mt-1">{note.updatedAt}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Note Editor (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {activeNote ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => updateActiveNoteTitle(e.target.value)}
                  className="bg-transparent font-semibold text-base text-slate-100 focus:outline-none w-full mr-2"
                  placeholder="Document Title..."
                />
                <button
                  onClick={deleteActiveNote}
                  disabled={notes.length <= 1}
                  className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg disabled:opacity-30 transition-colors"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* AI Quick Transformation Actions */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => runAiTransformation('summarize')}
                  disabled={loading}
                  className="flex items-center gap-1 text-[11px] font-medium bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400" /> Summarize
                </button>
                <button
                  onClick={() => runAiTransformation('actions')}
                  disabled={loading}
                  className="flex items-center gap-1 text-[11px] font-medium bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <ListCheck className="w-3 h-3 text-emerald-400" /> Action Items
                </button>
                <button
                  onClick={() => runAiTransformation('improve')}
                  disabled={loading}
                  className="flex items-center gap-1 text-[11px] font-medium bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Edit3 className="w-3 h-3 text-amber-400" /> Proofread
                </button>
                <button
                  onClick={() => runAiTransformation('translate')}
                  disabled={loading}
                  className="flex items-center gap-1 text-[11px] font-medium bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Languages className="w-3 h-3 text-blue-400" /> Translate
                </button>
              </div>

              {/* Note Content Textarea */}
              <textarea
                rows={16}
                value={activeNote.content}
                onChange={(e) => updateActiveNoteContent(e.target.value)}
                placeholder="Write your note in markdown format..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed resize-y"
              />
            </div>
          ) : (
            <div className="text-slate-500 text-center py-12">No document selected.</div>
          )}
        </div>

        {/* Right Output Panel (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg h-full flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-semibold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Insights
              </h3>

              {aiOutput && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={appendToNote}
                    className="text-[10px] bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 px-2 py-1 rounded-md transition-colors"
                  >
                    + Append
                  </button>
                  <button
                    onClick={handleCopy}
                    className="p-1 text-slate-400 hover:text-slate-200"
                    title="Copy"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-y-auto min-h-[300px] leading-relaxed whitespace-pre-wrap scrollbar-thin">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 space-y-3">
                  <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                  <p className="text-xs">Processing document...</p>
                </div>
              ) : aiOutput ? (
                aiOutput
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center py-12 space-y-2">
                  <FileText className="w-8 h-8 text-slate-700" />
                  <p className="text-xs">Select an AI transformation button above to generate insights or summaries.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
