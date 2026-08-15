import React, { useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCheck, 
  Check, 
  Trash2, 
  X, 
  Megaphone, 
  Tag, 
  Clock, 
  ShieldAlert,
  Info
} from 'lucide-react';

export type ConfirmationActionType = 'mark-read' | 'mark-all-read' | 'delete' | 'custom';

export interface ConfirmationItemPreview {
  title?: string;
  author?: string;
  category?: string;
  priority?: string;
  snippet?: string;
  timestamp?: string;
  count?: number;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: ConfirmationActionType;
  title: string;
  description: string;
  itemPreview?: ConfirmationItemPreview;
  confirmLabel?: string;
  cancelLabel?: string;
  isProcessing?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  title,
  description,
  itemPreview,
  confirmLabel,
  cancelLabel = 'Cancel',
  isProcessing = false,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDelete = actionType === 'delete';
  const isMarkAll = actionType === 'mark-all-read';
  const isMarkRead = actionType === 'mark-read';

  // Default labels if not provided
  const resolvedConfirmLabel =
    confirmLabel ||
    (isDelete
      ? 'Yes, Delete Message'
      : isMarkAll
      ? 'Yes, Mark All as Read'
      : 'Yes, Mark as Read');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div 
        className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleIn transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Color Accent Bar */}
        <div 
          className={`h-2 w-full ${
            isDelete
              ? 'bg-gradient-to-r from-rose-500 via-red-500 to-amber-500'
              : isMarkAll
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400'
              : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500'
          }`} 
        />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  isDelete
                    ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                    : isMarkAll
                    ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                    : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                }`}
              >
                {isDelete ? (
                  <Trash2 className="w-6 h-6 animate-pulse" />
                ) : isMarkAll ? (
                  <CheckCheck className="w-6 h-6" />
                ) : (
                  <Check className="w-6 h-6 stroke-[3]" />
                )}
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-1">
                  {isDelete ? (
                    <span className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800">
                      Permanent Action Warning
                    </span>
                  ) : isMarkAll ? (
                    <span className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                      Bulk Status Update
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                      Status Update Verification
                    </span>
                  )}
                </div>

                <h3 
                  id="confirmation-modal-title"
                  className="font-sora font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white leading-tight"
                >
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            {/* Close 'X' Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Item Preview Card (if an announcement or message preview is provided) */}
          {itemPreview && (
            <div 
              className={`rounded-2xl p-4 sm:p-5 border space-y-2.5 ${
                isDelete
                  ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                  : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {itemPreview.category && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      <Tag className="w-2.5 h-2.5" /> {itemPreview.category}
                    </span>
                  )}
                  {itemPreview.priority && (
                    <span className="text-[10px] font-mono uppercase font-bold text-amber-600 dark:text-amber-400">
                      • {itemPreview.priority} priority
                    </span>
                  )}
                  {itemPreview.count !== undefined && itemPreview.count > 0 && (
                    <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-cyan-400">
                      ({itemPreview.count} total messages)
                    </span>
                  )}
                </div>

                {itemPreview.timestamp && (
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-2.5 h-2.5" /> {itemPreview.timestamp}
                  </span>
                )}
              </div>

              {itemPreview.title && (
                <div className="font-sora font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {itemPreview.title}
                </div>
              )}

              {itemPreview.author && (
                <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Author: <span className="font-semibold text-slate-800 dark:text-slate-200">{itemPreview.author}</span>
                </div>
              )}

              {itemPreview.snippet && (
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 italic leading-relaxed pt-1 bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  "{itemPreview.snippet}"
                </p>
              )}
            </div>
          )}

          {/* Warning / Informational note */}
          <div className="flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              {isDelete ? (
                <span>
                  Deleting this notice will remove it immediately from the public notice board and ticker for all enrolled students.
                </span>
              ) : isMarkAll ? (
                <span>
                  All currently unread announcements will be marked as viewed for your account profile.
                </span>
              ) : (
                <span>
                  You can toggle this announcement back to unread at any time using the announcement board controls.
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              {cancelLabel}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isProcessing}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer ${
                isDelete
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-500/20'
                  : isMarkAll
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20'
              }`}
            >
              {isDelete ? (
                <Trash2 className="w-4 h-4" />
              ) : isMarkAll ? (
                <CheckCheck className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4 stroke-[3]" />
              )}
              <span>{resolvedConfirmLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
