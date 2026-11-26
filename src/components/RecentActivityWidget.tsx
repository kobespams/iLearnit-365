import React, { useState, useEffect } from 'react';
import { 
  Clock, FileText, FileType2, FileImage, FileCode2,
  ChevronRight, BookmarkCheck
} from 'lucide-react';
import { 
  getRecentOpenedDocuments, 
  RecentDocumentActivity, 
  recordDocumentOpened, 
  inferDocumentFileType 
} from '../services/recentActivityService';
import { getCourseIconInfo } from '../utils/courseIconRegistry';
import { DocumentFileType } from '../types';

interface RecentActivityWidgetProps {
  userId: string;
  studentGradeLevel?: string;
  onOpenDocument?: (doc: RecentDocumentActivity) => void;
  className?: string;
}

function getFileTypePresentation(fileType: DocumentFileType) {
  switch (fileType) {
    case 'PDF':
      return {
        label: 'PDF',
        Icon: FileText,
        className: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        aria: 'PDF document',
      };
    case 'DOCX':
      return {
        label: 'DOCX',
        Icon: FileType2,
        className: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        aria: 'Word DOCX document',
      };
    case 'IMG':
      return {
        label: 'IMG',
        Icon: FileImage,
        className: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        aria: 'Visual diagram image',
      };
    case 'TXT':
    default:
      return {
        label: 'TXT',
        Icon: FileCode2,
        className: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        aria: 'Plain text lab manual',
      };
  }
}

export const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({
  userId,
  studentGradeLevel,
  onOpenDocument,
  className = '',
}) => {
  const [recentDocs, setRecentDocs] = useState<RecentDocumentActivity[]>(() => 
    getRecentOpenedDocuments(userId, studentGradeLevel)
  );

  useEffect(() => {
    setRecentDocs(getRecentOpenedDocuments(userId, studentGradeLevel));

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.userId === userId) {
        setRecentDocs(customEvent.detail.docs);
      } else {
        setRecentDocs(getRecentOpenedDocuments(userId, studentGradeLevel));
      }
    };

    window.addEventListener('ilearnit:recent_documents_updated', handleUpdate);
    return () => {
      window.removeEventListener('ilearnit:recent_documents_updated', handleUpdate);
    };
  }, [userId, studentGradeLevel]);

  const handleItemClick = (item: RecentDocumentActivity) => {
    recordDocumentOpened(item, userId);
    if (onOpenDocument) {
      onOpenDocument(item);
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-sora font-bold text-base text-[#0B1D3A] dark:text-white flex flex-wrap items-center gap-2">
              <span>Recent Activity</span>
              <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
                · Last 5 Documents
              </span>
            </h3>
            <p className="text-xs text-[#475569] dark:text-slate-300">
              Curriculum documents, syllabi &amp; monographs opened by you
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-[#475569] dark:text-slate-300 hidden sm:inline-block">
          Auto-synced
        </span>
      </div>

      {/* List of Last 5 Documents with Distinct File Type Icons & Subtle Hover Scale/Shadow */}
      <div className="space-y-2.5">
        {recentDocs.slice(0, 5).map((doc, index) => {
          const iconInfo = getCourseIconInfo(doc.subjectId || doc.subjectName || '');
          const SubjectIcon = iconInfo.icon;
          const fileType = inferDocumentFileType(doc);
          const fileBadge = getFileTypePresentation(fileType);
          const FileTypeIcon = fileBadge.Icon;

          return (
            <div
              key={`${doc.id}-${index}`}
              id={`recent-doc-item-${index}`}
              onClick={() => handleItemClick(doc)}
              role="button"
              tabIndex={0}
              aria-label={`Open ${fileBadge.aria}: ${doc.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleItemClick(doc);
                }
              }}
              className="group relative flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#F6F8FB] dark:bg-slate-950/70 border border-[#D8DFEA] dark:border-slate-800 hover:border-blue-500/60 dark:hover:border-blue-400/50 hover:bg-white dark:hover:bg-slate-800 transform transition-all duration-200 ease-out hover:scale-[1.015] hover:shadow-md active:scale-[0.99] cursor-pointer"
              title={`Click to open ${fileBadge.label}: "${doc.title}"`}
            >
              {/* Left Side: Subject Icon & Document Information */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className={`w-9 h-9 rounded-xl ${iconInfo.badgeBg} ${iconInfo.borderColor} border flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform duration-200`}>
                  <SubjectIcon className={`w-4 h-4 ${iconInfo.colorClass}`} />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <span className={`font-semibold ${iconInfo.textColor}`}>
                      {iconInfo.name}
                    </span>
                    {doc.courseCode && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-600 dark:text-slate-300">
                          {doc.courseCode}
                        </span>
                      </>
                    )}
                    {doc.readingTimeMinutes && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{doc.readingTimeMinutes} min read</span>
                      </>
                    )}
                  </div>

                  {/* Document Title with Distinct File Type Icon */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[11px] font-mono font-bold shrink-0 ${fileBadge.className}`}
                      title={fileBadge.aria}
                    >
                      <FileTypeIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{fileBadge.label}</span>
                    </span>
                    <h4 className="font-sora font-semibold text-xs sm:text-sm text-[#0B1D3A] dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors truncate">
                      {doc.title}
                    </h4>
                  </div>

                  {doc.subtitle && (
                    <p className="text-xs text-[#475569] dark:text-slate-300 truncate">
                      {doc.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Side: Opened At Timestamp & Quick Action Affordance */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-mono text-[#475569] dark:text-slate-300 block tabular-nums">
                    {doc.openedAt}
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium flex items-center justify-end gap-1">
                    <BookmarkCheck className="w-3 h-3" /> Ready
                  </span>
                </div>

                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-300 group-hover:border-blue-300 dark:group-hover:border-blue-500 group-hover:translate-x-0.5 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
