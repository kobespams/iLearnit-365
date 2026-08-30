import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  X,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Printer,
  FileCode,
  Tag,
  BookOpen
} from 'lucide-react';
import { getCourseMeta, downloadPlainTextFile } from '../utils/courseIconRegistry';

interface PlainTextDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subject?: string;
  documentContent: string;
  sourceFile?: string;
}

export const PlainTextDocumentModal: React.FC<PlainTextDocumentModalProps> = ({
  isOpen,
  onClose,
  title,
  subject = 'General',
  documentContent,
  sourceFile,
}) => {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<number>(13);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const meta = getCourseMeta(subject || title);
  const IconComponent = meta.icon;

  const lines = documentContent.split('\n');
  const lineCount = lines.length;
  const wordCount = documentContent.trim().split(/\s+/).filter(Boolean).length;
  const charCount = documentContent.length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(documentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.warn('Failed to copy to clipboard', err);
    }
  };

  const handleDownload = () => {
    downloadPlainTextFile(title, documentContent);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title} - Plain Text Document</title>
            <style>
              body { font-family: monospace; font-size: 12px; line-height: 1.4; padding: 20px; white-space: pre-wrap; color: #111; }
            </style>
          </head>
          <body>${documentContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="plaintext-modal-title"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2.5 rounded-xl border ${meta.badgeBg} ${meta.borderColor} shrink-0`}>
              <IconComponent className={`w-5 h-5 ${meta.colorClass}`} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border ${meta.badgeBg} ${meta.borderColor} ${meta.textColor}`}>
                  {meta.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  PLAIN TEXT (.TXT)
                </span>
                {sourceFile && (
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline truncate max-w-[200px]">
                    📄 {sourceFile}
                  </span>
                )}
              </div>
              <h3 id="plaintext-modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                {title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close document viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 bg-slate-100/70 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 shrink-0">
          {/* Metadata chips */}
          <div className="flex items-center gap-3">
            <span className="font-mono">{lineCount} lines</span>
            <span>•</span>
            <span className="font-mono">{wordCount} words</span>
            <span>•</span>
            <span className="font-mono">{(charCount / 1024).toFixed(1)} KB</span>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Font size zoom */}
            <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5">
              <button
                onClick={() => setFontSize((f) => Math.max(11, f - 1))}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
                title="Decrease font size"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px]">{fontSize}px</span>
              <button
                onClick={() => setFontSize((f) => Math.min(18, f + 1))}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
                title="Increase font size"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Line numbers toggle */}
            <button
              onClick={() => setShowLineNumbers((prev) => !prev)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                showLineNumbers
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600'
                  : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
              }`}
            >
              # Lines
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied .txt!' : 'Copy Plain Text'}</span>
            </button>

            {/* Download button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .txt</span>
            </button>
          </div>
        </div>

        {/* Text Document Viewer Body */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-950 text-emerald-300/90 selection:bg-blue-600 selection:text-white font-mono leading-relaxed">
          <div className="flex">
            {showLineNumbers && (
              <div className="select-none pr-4 text-right text-slate-600 font-mono text-xs border-r border-slate-800/80 mr-4 shrink-0">
                {lines.map((_, idx) => (
                  <div key={idx} style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}>
                    {idx + 1}
                  </div>
                ))}
              </div>
            )}
            <pre
              className="flex-1 whitespace-pre-wrap break-words font-mono focus:outline-none"
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
            >
              {documentContent}
            </pre>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Standardized Plain Text Curriculum Module • UTF-8 Plain Text</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
