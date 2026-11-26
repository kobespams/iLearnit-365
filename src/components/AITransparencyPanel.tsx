import React, { useState, useEffect } from 'react';
import { Bot, Info, ChevronDown, ShieldCheck, Flag, Edit3, CheckCircle2 } from 'lucide-react';
import { AIOutputRecord } from '../types';
import { getOverrideForContext, saveAIOutputRecord } from '../services/aiTransparencyService';

interface AITransparencyPanelProps {
  contextKey: string;
  sourceFeature: AIOutputRecord['sourceFeature'];
  subject: string;
  promptSummary: string;
  aiResponse: string;
  modelUsed?: string;
  methodology: string;
  groundingSources: string[];
  createdByUser?: string;
  compact?: boolean;
}

export const AITransparencyPanel: React.FC<AITransparencyPanelProps> = ({
  contextKey,
  sourceFeature,
  subject,
  promptSummary,
  aiResponse,
  modelUsed = 'Gemini Flash + NERDC Curriculum Grounding',
  methodology,
  groundingSources,
  createdByUser = 'Learner',
  compact = false,
}) => {
  const [showHowProduced, setShowHowProduced] = useState(false);
  const [record, setRecord] = useState<AIOutputRecord | undefined>(() => getOverrideForContext(contextKey));
  const [flaggedSuccess, setFlaggedSuccess] = useState(false);

  useEffect(() => {
    setRecord(getOverrideForContext(contextKey));
    const onUpdate = () => setRecord(getOverrideForContext(contextKey));
    window.addEventListener('ilearnit:ai_records_updated', onUpdate);
    return () => window.removeEventListener('ilearnit:ai_records_updated', onUpdate);
  }, [contextKey]);

  const handleRequestTeacherReview = () => {
    const saved = saveAIOutputRecord({
      contextKey,
      sourceFeature,
      subject,
      promptSummary,
      aiResponse,
      modelUsed,
      methodology,
      groundingSources,
      createdByUser,
    });
    setRecord(saved);
    setFlaggedSuccess(true);
    setTimeout(() => setFlaggedSuccess(false), 3000);
  };

  return (
    <div className={`mt-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-900/80 ${compact ? 'p-3' : 'p-3.5'} space-y-2.5 text-xs`}>
      {/* Top Disclosure Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-sora font-bold text-xs text-[#0B1D3A] dark:text-slate-100">
            <Bot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>AI-Generated Content</span>
          </span>

          {record?.reviewStatus === 'approved' && (
            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Verified by {record.reviewedBy || 'Educator'}</span>
            </span>
          )}

          {record?.reviewStatus === 'overridden' && (
            <span className="inline-flex items-center gap-1 text-amber-800 dark:text-amber-300 font-semibold">
              <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Educator Override Active ({record.reviewedBy || 'Teacher'})</span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHowProduced((prev) => !prev)}
            aria-expanded={showHowProduced}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400 font-semibold transition cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>How this answer was produced</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHowProduced ? 'rotate-180' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleRequestTeacherReview}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-500 font-semibold transition cursor-pointer"
            title="Send this AI response to a Teacher for verification or correction"
          >
            <Flag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <span>{flaggedSuccess ? 'Sent to Teacher Review ✓' : 'Flag for Teacher Review'}</span>
          </button>
        </div>
      </div>

      {/* Educator Override Box (if a teacher overrode this AI output) */}
      {record?.reviewStatus === 'overridden' && record.teacherOverrideText && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-slate-900 dark:text-amber-100 space-y-1">
          <div className="flex items-center gap-1.5 font-sora font-bold text-xs text-amber-900 dark:text-amber-300">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>Official Teacher Correction / Override ({record.reviewedBy})</span>
          </div>
          <p className="leading-relaxed">{record.teacherOverrideText}</p>
        </div>
      )}

      {/* Expandable Methodology & Sources */}
      {showHowProduced && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2 text-slate-700 dark:text-slate-300">
          <div>
            <span className="font-semibold text-[#0B1D3A] dark:text-white">Engine &amp; Mode: </span>
            <span>{modelUsed}</span>
          </div>
          <div>
            <span className="font-semibold text-[#0B1D3A] dark:text-white">Production Steps: </span>
            <span>{methodology}</span>
          </div>
          <div>
            <span className="font-semibold text-[#0B1D3A] dark:text-white">Syllabus Grounding: </span>
            <span>{groundingSources.join(' · ')}</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Educators can review, verify, or override any AI output inside the Teacher Portal under &ldquo;AI Review &amp; Override&rdquo;.
          </p>
        </div>
      )}
    </div>
  );
};
