import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, FileText, Search, Download, Printer, Share2, 
  Volume2, VolumeX, Play, Pause, Square, Sparkles, CheckCircle, 
  ChevronRight, ChevronLeft, Bookmark, Highlighter, MessageSquare, 
  Eye, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, 
  Sliders, User, Clock, Tag, ExternalLink, HelpCircle, ArrowRight,
  Headphones, Flame, Check, X, Copy, Lightbulb, ShieldCheck, Terminal,
  Plus, Trash2, Edit3, Filter, StickyNote
} from 'lucide-react';
import { EducationalDocument, DocumentSection, DocumentAnnotation, HighlightColor } from '../types';
import { EDUCATIONAL_DOCUMENTS } from '../data/educationalDocuments';
import { recordDocumentOpened } from '../services/recentActivityService';
import { 
  VoicePersona, 
  PRESET_VOICE_PERSONAS, 
  getActiveEducatorVoice, 
  speechEngine, 
  RECORDED_VOICE_GREETING, 
  playRecordedVoiceGreeting 
} from '../services/educatorVoiceService';

interface EducationalDocumentViewerProps {
  initialDocumentId?: string;
  currentSubjectFilter?: string;
  studentName?: string;
  onClose?: () => void;
  onSelectDocument?: (docId: string) => void;
}

type ReaderTheme = 'light' | 'sepia' | 'dark';
type FontSize = 'sm' | 'base' | 'lg' | 'xl';
type SidebarTab = 'toc' | 'annotations' | 'notes';

interface SelectionToolbarState {
  x: number;
  y: number;
  selectedText: string;
  sectionId: string;
  sectionHeading: string;
}

export const EducationalDocumentViewer: React.FC<EducationalDocumentViewerProps> = ({
  initialDocumentId,
  currentSubjectFilter,
  studentName = 'Scholar',
  onClose,
  onSelectDocument
}) => {
  // Document Selection State
  const [selectedDocId, setSelectedDocId] = useState<string>(
    initialDocumentId || 
    (currentSubjectFilter 
      ? EDUCATIONAL_DOCUMENTS.find(d => d.subjectId === currentSubjectFilter)?.id || EDUCATIONAL_DOCUMENTS[0].id
      : EDUCATIONAL_DOCUMENTS[0].id)
  );

  const activeDoc = EDUCATIONAL_DOCUMENTS.find(d => d.id === selectedDocId) || EDUCATIONAL_DOCUMENTS[0];

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeSectionId, setActiveSectionId] = useState<string>(activeDoc.sections[0]?.id || '');
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('toc');

  // Reader Settings
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>('light');
  const [fontSize, setFontSize] = useState<FontSize>('base');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showToc, setShowToc] = useState<boolean>(true);
  const [inDocSearch, setInDocSearch] = useState<string>('');

  // Audio / Speech State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentReadingSectionIndex, setCurrentReadingSectionIndex] = useState<number>(0);
  const [activeVoice, setActiveVoice] = useState<VoicePersona>(() => getActiveEducatorVoice());
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [waveLevels, setWaveLevels] = useState<number[]>([12, 20, 16, 28, 14, 22, 18, 24]);
  const [activeReadingLabel, setActiveReadingLabel] = useState<string>('');

  // Interactive Quiz & Notes State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [studentNotes, setStudentNotes] = useState<string>(() => {
    try {
      return localStorage.getItem(`ilearnit_doc_notes_${activeDoc.id}`) || '';
    } catch (e) {
      return '';
    }
  });
  const [copyNotification, setCopyNotification] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState<number>(0);

  // Annotations & Highlights State
  const [annotations, setAnnotations] = useState<DocumentAnnotation[]>(() => {
    try {
      const saved = localStorage.getItem(`ilearnit_doc_annotations_${activeDoc.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [annotationColorFilter, setAnnotationColorFilter] = useState<string>('all');
  const [editingAnnotationId, setEditingAnnotationId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>('');

  // Floating Selection Toolbar State
  const [selectionToolbar, setSelectionToolbar] = useState<SelectionToolbarState | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState<boolean>(false);
  const [newNoteComment, setNewNoteComment] = useState<string>('');
  const [selectedHighlightColor, setSelectedHighlightColor] = useState<HighlightColor>('yellow');

  const documentContentRef = useRef<HTMLDivElement | null>(null);
  const isSpeechCancelledRef = useRef<boolean>(false);

  // Update active section and reload annotations on doc change
  useEffect(() => {
    if (activeDoc && activeDoc.sections.length > 0) {
      setActiveSectionId(activeDoc.sections[0].id);
      setCurrentReadingSectionIndex(0);
      setQuizAnswers({});
      setQuizSubmitted(false);
      try {
        recordDocumentOpened({
          id: activeDoc.id,
          title: activeDoc.title,
          subtitle: activeDoc.subtitle,
          subjectId: activeDoc.subjectId,
          subjectName: activeDoc.subjectName,
          courseCode: activeDoc.courseCode,
          category: activeDoc.category,
          author: activeDoc.author,
          readingTimeMinutes: activeDoc.readingTimeMinutes,
          gradeLevel: activeDoc.gradeLevel,
        });
        const savedNotes = localStorage.getItem(`ilearnit_doc_notes_${activeDoc.id}`) || '';
        setStudentNotes(savedNotes);
        const savedAnnotations = localStorage.getItem(`ilearnit_doc_annotations_${activeDoc.id}`);
        setAnnotations(savedAnnotations ? JSON.parse(savedAnnotations) : []);
      } catch (e) {}
    }
    isSpeechCancelledRef.current = true;
    speechEngine.stop();
    setIsSpeaking(false);
    setIsPaused(false);
    setActiveReadingLabel('');
    setSelectionToolbar(null);
    setIsNoteModalOpen(false);
  }, [selectedDocId, activeDoc]);

  // Audio wave animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSpeaking && !isPaused) {
      interval = setInterval(() => {
        setWaveLevels(prev => prev.map(() => Math.floor(Math.random() * 24) + 6));
      }, 100);
    } else {
      setWaveLevels([8, 12, 10, 14, 10, 12, 8, 14]);
    }
    return () => clearInterval(interval);
  }, [isSpeaking, isPaused]);

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      isSpeechCancelledRef.current = true;
      speechEngine.stop();
    };
  }, []);

  // Save student notes to localStorage
  const handleSaveNotes = (text: string) => {
    setStudentNotes(text);
    try {
      localStorage.setItem(`ilearnit_doc_notes_${activeDoc.id}`, text);
    } catch (e) {}
  };

  // Save annotations to localStorage
  const saveAnnotationsList = (list: DocumentAnnotation[]) => {
    setAnnotations(list);
    try {
      localStorage.setItem(`ilearnit_doc_annotations_${activeDoc.id}`, JSON.stringify(list));
    } catch (e) {}
  };

  // Handle Text Selection in Document Container
  const handleMouseUp = () => {
    if (typeof window === 'undefined') return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      // Delay closing to allow clicking toolbar buttons
      setTimeout(() => {
        if (!isNoteModalOpen) {
          setSelectionToolbar(null);
        }
      }, 200);
      return;
    }

    const selectedText = selection.toString().trim();
    if (selectedText.length < 3) {
      setSelectionToolbar(null);
      return;
    }

    // Find which section container holds the selection
    let anchorNode: Node | null = selection.anchorNode;
    let sectionId = activeSectionId;
    let sectionHeading = activeDoc.sections.find(s => s.id === activeSectionId)?.heading || 'General Section';

    while (anchorNode && anchorNode !== documentContentRef.current) {
      if (anchorNode instanceof HTMLElement && anchorNode.dataset.sectionId) {
        sectionId = anchorNode.dataset.sectionId;
        sectionHeading = anchorNode.dataset.sectionHeading || sectionHeading;
        break;
      }
      anchorNode = anchorNode.parentNode;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setSelectionToolbar({
      x: Math.max(16, rect.left + rect.width / 2 - 120),
      y: Math.max(10, rect.top - 54),
      selectedText,
      sectionId,
      sectionHeading,
    });
  };

  // Add Annotation / Highlight
  const handleAddHighlight = (color: HighlightColor, comment: string = '') => {
    if (!selectionToolbar) return;

    const newAnnotation: DocumentAnnotation = {
      id: `ann-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      docId: activeDoc.id,
      sectionId: selectionToolbar.sectionId,
      sectionHeading: selectionToolbar.sectionHeading,
      selectedText: selectionToolbar.selectedText,
      comment: comment.trim(),
      color,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
    };

    const updated = [newAnnotation, ...annotations];
    saveAnnotationsList(updated);

    // Clear selection
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
    setSelectionToolbar(null);
    setIsNoteModalOpen(false);
    setNewNoteComment('');
    setCopyNotification(`Highlight added in ${color.toUpperCase()}!`);
    setTimeout(() => setCopyNotification(null), 2500);
  };

  // Delete Annotation
  const handleDeleteAnnotation = (id: string) => {
    const updated = annotations.filter(a => a.id !== id);
    saveAnnotationsList(updated);
    setCopyNotification('Annotation removed.');
    setTimeout(() => setCopyNotification(null), 2000);
  };

  // Clear All Annotations for this Doc
  const handleClearAllAnnotations = () => {
    if (window.confirm('Are you sure you want to clear all highlights and annotations for this document?')) {
      saveAnnotationsList([]);
      setCopyNotification('All annotations cleared for this document.');
      setTimeout(() => setCopyNotification(null), 2500);
    }
  };

  // Save Inline Edit Comment
  const handleSaveEditComment = (id: string) => {
    const updated = annotations.map(a => a.id === id ? { ...a, comment: editCommentText.trim() } : a);
    saveAnnotationsList(updated);
    setEditingAnnotationId(null);
    setEditCommentText('');
    setCopyNotification('Annotation comment updated.');
    setTimeout(() => setCopyNotification(null), 2000);
  };

  // Export Annotations to Clipboard / Markdown
  const handleExportAnnotations = () => {
    if (annotations.length === 0) {
      alert('No annotations recorded yet to export.');
      return;
    }

    let report = `# Scholar Annotations & Highlights\n`;
    report += `**Document:** ${activeDoc.title} (${activeDoc.courseCode})\n`;
    report += `**Student:** ${studentName}\n`;
    report += `**Date:** ${new Date().toLocaleDateString()}\n\n---\n\n`;

    annotations.forEach((ann, i) => {
      report += `### ${i + 1}. [${ann.color.toUpperCase()}] ${ann.sectionHeading} (${ann.timestamp})\n`;
      report += `> "${ann.selectedText}"\n\n`;
      if (ann.comment) {
        report += `**Scholar Note:** ${ann.comment}\n\n`;
      }
      report += `---\n\n`;
    });

    navigator.clipboard.writeText(report);
    setCopyNotification('Annotations exported & copied to clipboard!');
    setTimeout(() => setCopyNotification(null), 3000);
  };

  // Listen to specific text via TTS
  const handleListenText = (textToSpeak: string, label: string = 'Reading Text') => {
    speechEngine.stop();
    isSpeechCancelledRef.current = false;
    setActiveReadingLabel(label);

    speechEngine.speak(textToSpeak, activeVoice, {
      rateMultiplier: speedMultiplier,
      onStart: () => {
        setIsSpeaking(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setActiveReadingLabel('');
      }
    });
  };

  // Read full document sequentially aloud
  const handleStartReadAloud = (startFromBeginning = false) => {
    if (isPaused) {
      speechEngine.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    if (isSpeaking) {
      speechEngine.stop();
      isSpeechCancelledRef.current = true;
      setIsSpeaking(false);
      setIsPaused(false);
      setActiveReadingLabel('');
      return;
    }

    isSpeechCancelledRef.current = false;
    const sectionIdx = startFromBeginning ? 0 : currentReadingSectionIndex;
    readSectionRecursively(sectionIdx, startFromBeginning || sectionIdx === 0);
  };

  const readSectionRecursively = (idx: number, isFirst: boolean) => {
    if (isSpeechCancelledRef.current) return;
    const sec = activeDoc.sections[idx];
    if (!sec) {
      setIsSpeaking(false);
      setIsPaused(false);
      setActiveReadingLabel('Narration complete');
      setTimeout(() => setActiveReadingLabel(''), 3000);
      return;
    }

    setCurrentReadingSectionIndex(idx);
    setActiveSectionId(sec.id);

    const el = document.getElementById(sec.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const greeting = activeVoice.catchphrases[0] || RECORDED_VOICE_GREETING;
    const spokenIntro = isFirst
      ? `${greeting} We are reviewing "${activeDoc.title}". Let us start with ${sec.heading}. ${sec.content}`
      : `${sec.heading}. ${sec.content}`;

    setActiveReadingLabel(`Reading: ${sec.heading}`);

    speechEngine.speak(
      spokenIntro,
      activeVoice,
      {
        rateMultiplier: speedMultiplier,
        onStart: () => {
          setIsSpeaking(true);
          setIsPaused(false);
        },
        onEnd: () => {
          if (isSpeechCancelledRef.current) return;
          if (idx + 1 < activeDoc.sections.length) {
            readSectionRecursively(idx + 1, false);
          } else {
            setIsSpeaking(false);
            setIsPaused(false);
            setActiveReadingLabel('Completed reading document');
            setTimeout(() => setActiveReadingLabel(''), 3500);
          }
        }
      }
    );
  };

  // Read a single specific section aloud
  const handleReadSpecificSection = (idx: number) => {
    const sec = activeDoc.sections[idx];
    if (!sec) return;

    speechEngine.stop();
    isSpeechCancelledRef.current = false;
    setCurrentReadingSectionIndex(idx);
    setActiveSectionId(sec.id);
    setActiveReadingLabel(`Reading Section ${idx + 1}: ${sec.heading}`);

    const script = `Section ${sec.heading}. ${sec.content}. ${sec.callout ? `Important note: ${sec.callout.title}. ${sec.callout.body}` : ''}`;

    speechEngine.speak(
      script,
      activeVoice,
      {
        rateMultiplier: speedMultiplier,
        onStart: () => {
          setIsSpeaking(true);
          setIsPaused(false);
        },
        onEnd: () => {
          setIsSpeaking(false);
          setIsPaused(false);
          setActiveReadingLabel('');
        }
      }
    );
  };

  // Read executive summary aloud
  const handleReadSummary = () => {
    speechEngine.stop();
    isSpeechCancelledRef.current = false;
    setActiveReadingLabel(`Reading Executive Lesson Abstract`);
    const greeting = activeVoice.catchphrases[0] || RECORDED_VOICE_GREETING;
    const text = `${greeting} Here is the executive abstract for ${activeDoc.title}. ${activeDoc.summary}`;

    speechEngine.speak(text, activeVoice, {
      rateMultiplier: speedMultiplier,
      onStart: () => {
        setIsSpeaking(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setActiveReadingLabel('');
      }
    });
  };

  // Read key terms / vocabulary aloud
  const handleReadVocabulary = () => {
    speechEngine.stop();
    isSpeechCancelledRef.current = false;
    setActiveReadingLabel(`Reading Key Vocabulary Terms`);
    const text = `Document key terms for ${activeDoc.title}. ` + activeDoc.keyTerms.map(k => `${k.term}: ${k.definition}`).join('. ');

    speechEngine.speak(text, activeVoice, {
      rateMultiplier: speedMultiplier,
      onStart: () => {
        setIsSpeaking(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setActiveReadingLabel('');
      }
    });
  };

  // Read student notes aloud
  const handleReadStudentNotes = () => {
    if (!studentNotes.trim()) return;
    speechEngine.stop();
    isSpeechCancelledRef.current = false;
    setActiveReadingLabel(`Reading Saved Margin Notes`);
    const text = `Here are your personal revision margin notes for ${activeDoc.title}: ${studentNotes}`;

    speechEngine.speak(text, activeVoice, {
      rateMultiplier: speedMultiplier,
      onStart: () => {
        setIsSpeaking(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setActiveReadingLabel('');
      }
    });
  };

  const handlePauseSpeech = () => {
    speechEngine.pause();
    setIsPaused(true);
    setIsSpeaking(false);
  };

  const handleStopSpeech = () => {
    isSpeechCancelledRef.current = true;
    speechEngine.stop();
    setIsSpeaking(false);
    setIsPaused(false);
    setActiveReadingLabel('');
  };

  const handleCopySection = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyNotification('Section text copied to clipboard!');
    setTimeout(() => setCopyNotification(null), 2500);
  };

  const handlePrintDocument = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const mdContent = `# ${activeDoc.title}\n## ${activeDoc.subtitle}\n**Author:** ${activeDoc.author} (${activeDoc.authorTitle})\n**Course Code:** ${activeDoc.courseCode} | **Grade:** ${activeDoc.gradeLevel}\n\n---\n\n### Summary\n${activeDoc.summary}\n\n` +
      activeDoc.sections.map(s => `## ${s.heading}\n\n${s.content}\n\n${s.callout ? `> **${s.callout.title}:** ${s.callout.body}\n\n` : ''}`).join('\n---\n\n') +
      `\n\n### Key Terms\n` + activeDoc.keyTerms.map(k => `* **${k.term}:** ${k.definition}`).join('\n') +
      `\n\n*Generated from iLearnit-365 Educational Study Hub on ${new Date().toLocaleDateString()}*`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeDoc.courseCode}_${activeDoc.id}.md`;
    link.click();
  };

  // Typography font size classes
  const fontClass = {
    sm: 'text-xs sm:text-sm leading-relaxed',
    base: 'text-sm sm:text-base leading-relaxed',
    lg: 'text-base sm:text-lg leading-relaxed',
    xl: 'text-lg sm:text-xl leading-relaxed',
  }[fontSize];

  // Theme styling classes
  const themeClass = {
    light: 'bg-white text-slate-900 border-[#D8DFEA]',
    sepia: 'bg-[#FDF6E2] text-[#433422] border-[#E8DCB8]',
    dark: 'bg-slate-950 text-slate-100 border-slate-800',
  }[readerTheme];

  const calloutTheme = {
    info: 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200',
    warning: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200',
    tip: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200',
    formula: 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-200',
    code: 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-200',
  };

  // Highlight color style mappings
  const highlightColorStyles: Record<HighlightColor, { badge: string; pill: string; text: string; bg: string }> = {
    yellow: {
      badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/80 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
      pill: 'bg-yellow-400',
      text: 'text-yellow-700 dark:text-yellow-300',
      bg: 'bg-yellow-100/90 dark:bg-yellow-900/40 border-yellow-300 dark:border-yellow-700',
    },
    emerald: {
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
      pill: 'bg-emerald-500',
      text: 'text-emerald-700 dark:text-emerald-300',
      bg: 'bg-emerald-100/90 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700',
    },
    cyan: {
      badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-200 border-cyan-300 dark:border-cyan-700',
      pill: 'bg-cyan-400',
      text: 'text-cyan-700 dark:text-cyan-300',
      bg: 'bg-cyan-100/90 dark:bg-cyan-900/40 border-cyan-300 dark:border-cyan-700',
    },
    pink: {
      badge: 'bg-pink-100 text-pink-800 dark:bg-pink-950/80 dark:text-pink-200 border-pink-300 dark:border-pink-700',
      pill: 'bg-pink-400',
      text: 'text-pink-700 dark:text-pink-300',
      bg: 'bg-pink-100/90 dark:bg-pink-900/40 border-pink-300 dark:border-pink-700',
    },
    amber: {
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-200 border-amber-300 dark:border-amber-700',
      pill: 'bg-amber-500',
      text: 'text-amber-700 dark:text-amber-300',
      bg: 'bg-amber-100/90 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700',
    },
  };

  const filteredAnnotations = annotations.filter(a => 
    annotationColorFilter === 'all' || a.color === annotationColorFilter
  );

  return (
    <div className={`space-y-6 relative ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4 sm:p-6 overflow-y-auto' : ''}`}>
      
      {/* 📚 DOCUMENT REPOSITORY & SELECTION HERO BAR */}
      <div className="bg-gradient-to-r from-[#0B1D3A] via-[#132C54] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Interactive Document Reader
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Headphones className="w-3.5 h-3.5" /> Voice-Aloud Enabled
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Highlighter className="w-3.5 h-3.5" /> Annotations &amp; Highlights ({annotations.length})
              </span>
            </div>
            <h2 className="font-sora font-bold text-2xl sm:text-3xl text-white">
              Academic Resource &amp; Curriculum Library
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Read comprehensive curriculum monographs, lab manuals, and syllabus chapters with full support for user-generated highlights, margin annotations, and natural voice narration.
            </p>
          </div>

          {/* Quick Audio Greeting Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 shrink-0">
            <button
              onClick={() => playRecordedVoiceGreeting()}
              className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition cursor-pointer group"
              title="Play Recorded Educator Voice Introduction"
            >
              <Volume2 className="w-6 h-6 group-hover:animate-pulse" />
            </button>
            <div>
              <div className="text-[10px] font-mono uppercase font-bold text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> Recorded Audio Guide
              </div>
              <div className="text-xs font-bold font-sora text-white">
                "Good day everyone. I am going to be your guide..."
              </div>
              <button
                onClick={() => playRecordedVoiceGreeting()}
                className="text-[11px] text-blue-300 hover:text-white underline cursor-pointer"
              >
                Play Recorded Voice Sample
              </button>
            </div>
          </div>
        </div>

        {/* Document Carousel / Selector Tabs */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Select Document to Read:
            </span>
            <div className="text-xs text-slate-400 font-mono">
              {EDUCATIONAL_DOCUMENTS.length} Documents Available
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {EDUCATIONAL_DOCUMENTS.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              return (
                <button
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    if (onSelectDocument) onSelectDocument(doc.id);
                  }}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-400 shadow-lg scale-[1.02] ring-2 ring-blue-400/40'
                      : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10 hover:border-blue-400/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 text-[10px] font-mono mb-1.5 opacity-80">
                      <span>{doc.courseCode}</span>
                      <span className="truncate">{doc.readingTimeMinutes} min read</span>
                    </div>
                    <h4 className="font-sora font-bold text-xs line-clamp-2 leading-snug">
                      {doc.title}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] opacity-80">
                    <span className="truncate">{doc.subjectName}</span>
                    <span className="font-bold">{isSelected ? 'Active ✓' : 'Open →'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 📖 ACTIVE DOCUMENT VIEWER WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: TABLE OF CONTENTS & STUDY TOOLS (3 COLS) */}
        {showToc && (
          <div className="lg:col-span-3 space-y-4">
            
            {/* Sidebar Navigation Tabs */}
            <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-2xl p-1.5 flex items-center gap-1 text-xs shadow-sm">
              <button
                onClick={() => setSidebarTab('toc')}
                className={`flex-1 py-1.5 px-2 rounded-xl font-sora font-bold text-center transition cursor-pointer flex items-center justify-center gap-1 ${
                  sidebarTab === 'toc'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Contents
              </button>
              <button
                onClick={() => setSidebarTab('annotations')}
                className={`flex-1 py-1.5 px-2 rounded-xl font-sora font-bold text-center transition cursor-pointer flex items-center justify-center gap-1 ${
                  sidebarTab === 'annotations'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Highlighter className="w-3.5 h-3.5" /> Notes ({annotations.length})
              </button>
              <button
                onClick={() => setSidebarTab('notes')}
                className={`flex-1 py-1.5 px-2 rounded-xl font-sora font-bold text-center transition cursor-pointer flex items-center justify-center gap-1 ${
                  sidebarTab === 'notes'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" /> Scratchpad
              </button>
            </div>

            {/* TAB 1: TABLE OF CONTENTS & VOCABULARY */}
            {sidebarTab === 'toc' && (
              <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#ECF0F6] dark:border-slate-800 pb-3">
                  <h4 className="font-sora font-bold text-sm text-[#0B1D3A] dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" /> Syllabus Sections
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    {activeDoc.sections.length} Sections
                  </span>
                </div>

                {/* Sections Nav List */}
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 scrollbar text-xs">
                  {activeDoc.sections.map((sec, idx) => {
                    const isActive = activeSectionId === sec.id;
                    const secAnnotationCount = annotations.filter(a => a.sectionId === sec.id).length;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => {
                          setActiveSectionId(sec.id);
                          setCurrentReadingSectionIndex(idx);
                          const el = document.getElementById(sec.id);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl font-medium transition cursor-pointer flex items-center justify-between gap-2 ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/80'
                            : 'text-[#5B6A88] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="line-clamp-1">{sec.heading}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {secAnnotationCount > 0 && (
                            <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-bold">
                              {secAnnotationCount}
                            </span>
                          )}
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'rotate-90 text-blue-600' : 'opacity-40'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Key Definitions Accordion / Glossary */}
                <div className="pt-3 border-t border-[#ECF0F6] dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5B6A88] dark:text-slate-400">
                      Document Vocabulary ({activeDoc.keyTerms.length})
                    </span>
                    <button
                      onClick={handleReadVocabulary}
                      className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                      title="Read Vocabulary Aloud"
                    >
                      <Volume2 className="w-3 h-3" /> Read Vocab
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto scrollbar">
                    {activeDoc.keyTerms.map((term, idx) => (
                      <div key={idx} className="p-2 bg-[#F6F8FB] dark:bg-slate-800/60 rounded-xl text-[11px] space-y-0.5 border border-[#ECF0F6] dark:border-slate-700">
                        <div className="font-bold font-sora text-[#0B1D3A] dark:text-white flex items-center justify-between">
                          <span>{term.term}</span>
                          <button
                            onClick={() => {
                              speechEngine.speak(`${term.term}. Definition: ${term.definition}`, activeVoice);
                            }}
                            className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                            title={`Listen to definition for ${term.term}`}
                          >
                            <Volume2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <div className="text-[#5B6A88] dark:text-slate-400 leading-snug">{term.definition}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: USER ANNOTATIONS & HIGHLIGHTS MANAGER */}
            {sidebarTab === 'annotations' && (
              <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#ECF0F6] dark:border-slate-800 pb-3">
                  <div>
                    <h4 className="font-sora font-bold text-sm text-[#0B1D3A] dark:text-white flex items-center gap-2">
                      <Highlighter className="w-4 h-4 text-amber-500" /> Annotations &amp; Highlights
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Select any text in the document to highlight &amp; annotate.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                    {annotations.length}
                  </span>
                </div>

                {/* Filter by Color */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar pb-1 text-[10px] font-bold">
                  <button
                    onClick={() => setAnnotationColorFilter('all')}
                    className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                      annotationColorFilter === 'all'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    All ({annotations.length})
                  </button>
                  {(['yellow', 'emerald', 'cyan', 'pink', 'amber'] as HighlightColor[]).map((color) => {
                    const count = annotations.filter(a => a.color === color).length;
                    return (
                      <button
                        key={color}
                        onClick={() => setAnnotationColorFilter(color)}
                        className={`px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                          annotationColorFilter === color
                            ? `${highlightColorStyles[color].badge} font-black`
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${highlightColorStyles[color].pill}`} />
                        <span>{color}</span>
                        {count > 0 && <span className="opacity-70">({count})</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Annotations List */}
                <div className="space-y-3 max-h-96 overflow-y-auto scrollbar pr-1">
                  {filteredAnnotations.length > 0 ? (
                    filteredAnnotations.map((ann) => {
                      const colorStyle = highlightColorStyles[ann.color] || highlightColorStyles.yellow;
                      const isEditing = editingAnnotationId === ann.id;

                      return (
                        <div
                          key={ann.id}
                          className={`p-3 rounded-2xl border ${colorStyle.bg} space-y-2 text-xs transition shadow-sm`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 truncate">
                              {ann.sectionHeading}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 shrink-0">
                              {ann.timestamp}
                            </span>
                          </div>

                          {/* Highlighted Quote */}
                          <blockquote className="font-medium italic border-l-2 border-current pl-2 text-slate-800 dark:text-slate-200 line-clamp-3">
                            "{ann.selectedText}"
                          </blockquote>

                          {/* Annotation / Sticky Note */}
                          {ann.comment && !isEditing && (
                            <div className="p-2 bg-white/70 dark:bg-slate-900/70 rounded-xl border border-white/40 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-sans space-y-1">
                              <div className="text-[10px] font-bold font-mono text-slate-500 uppercase flex items-center gap-1">
                                <StickyNote className="w-2.5 h-2.5 text-amber-500" /> Scholar Note:
                              </div>
                              <p className="leading-snug">{ann.comment}</p>
                            </div>
                          )}

                          {/* Inline Edit Form */}
                          {isEditing && (
                            <div className="space-y-1.5 pt-1">
                              <textarea
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                rows={2}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Add note or comment..."
                              />
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingAnnotationId(null)}
                                  className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveEditComment(ann.id)}
                                  className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  Save Note
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Annotation Action Buttons */}
                          <div className="flex items-center justify-between pt-1 border-t border-current/10 text-[10px]">
                            <button
                              onClick={() => {
                                const el = document.getElementById(ann.sectionId);
                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }}
                              className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              Jump to text →
                            </button>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleListenText(`Highlight from ${ann.sectionHeading}: ${ann.selectedText}. ${ann.comment ? `Scholar note: ${ann.comment}` : ''}`, `Reading Annotation`)}
                                className="p-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 cursor-pointer"
                                title="Listen to this annotation in educator voice"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>

                              <button
                                onClick={() => {
                                  setEditingAnnotationId(ann.id);
                                  setEditCommentText(ann.comment || '');
                                }}
                                className="p-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 cursor-pointer"
                                title="Edit Annotation Note"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>

                              <button
                                onClick={() => handleDeleteAnnotation(ann.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                                title="Delete Highlight"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-slate-400 space-y-2">
                      <Highlighter className="w-8 h-8 mx-auto opacity-40 text-amber-500" />
                      <p className="text-xs">No highlights created yet for this filter.</p>
                      <p className="text-[11px] text-slate-500">
                        Highlight any text in the reader to save quotes, tags, and study comments!
                      </p>
                    </div>
                  )}
                </div>

                {/* Export & Clear Actions */}
                {annotations.length > 0 && (
                  <div className="pt-3 border-t border-[#ECF0F6] dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={handleExportAnnotations}
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded-xl text-xs font-bold border border-blue-200 dark:border-blue-800 transition cursor-pointer flex items-center gap-1.5"
                      title="Copy all annotations as Markdown study guide"
                    >
                      <Download className="w-3 h-3" /> Export Notes
                    </button>

                    <button
                      onClick={handleClearAllAnnotations}
                      className="px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-bold transition cursor-pointer"
                      title="Clear all annotations for this document"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: STUDENT MARGINAL SCRATCHPAD */}
            {sidebarTab === 'notes' && (
              <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#ECF0F6] dark:border-slate-800 pb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5B6A88] dark:text-slate-400 flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4 text-amber-500" /> Lesson Scratchpad
                  </span>
                  <div className="flex items-center gap-2">
                    {studentNotes.trim() && (
                      <button
                        onClick={handleReadStudentNotes}
                        className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                        title="Read Margin Notes Aloud"
                      >
                        <Volume2 className="w-3 h-3" /> Read Notes
                      </button>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">Auto-saved</span>
                  </div>
                </div>
                <textarea
                  value={studentNotes}
                  onChange={(e) => handleSaveNotes(e.target.value)}
                  rows={8}
                  placeholder="Record personal derivations, equations, and revision notes on this text..."
                  className="w-full bg-[#F6F8FB] dark:bg-slate-800 border border-[#D8DFEA] dark:border-slate-700 rounded-2xl p-3 text-xs text-[#0B1D3A] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-sans leading-relaxed"
                />
              </div>
            )}

          </div>
        )}

        {/* RIGHT/CENTER MAIN READER CONTAINER (9 OR 12 COLS) */}
        <div className={`${showToc ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-6 relative`}>
          
          {/* STICKY TOP READER TOOLBAR */}
          <div className="bg-white dark:bg-slate-900 border border-[#D8DFEA] dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 sticky top-4 z-20 backdrop-blur-md">
            
            {/* Audio Voice Player Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {!isSpeaking && !isPaused ? (
                <button
                  onClick={() => handleStartReadAloud(false)}
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer active:scale-95"
                  title="Read Document Aloud with Educator Voice"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Read Aloud</span>
                </button>
              ) : isPaused ? (
                <button
                  onClick={() => handleStartReadAloud(false)}
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume Voice</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePauseSpeech}
                    className="p-1.5 bg-amber-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    title="Pause Speech"
                  >
                    <Pause className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleStopSpeech}
                    className="p-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    title="Stop Speech"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              )}

              {/* Voice Persona Selector */}
              <select
                value={activeVoice.id}
                onChange={(e) => {
                  const found = PRESET_VOICE_PERSONAS.find(p => p.id === e.target.value) || PRESET_VOICE_PERSONAS[0];
                  setActiveVoice(found);
                }}
                className="text-xs bg-slate-100 dark:bg-slate-800 text-[#0B1D3A] dark:text-slate-200 border border-[#D8DFEA] dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-medium focus:outline-none"
              >
                {PRESET_VOICE_PERSONAS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name.split('(')[0]} ({p.accent.split('/')[0]})
                  </option>
                ))}
              </select>

              {/* Speed Multiplier Pill */}
              <select
                value={speedMultiplier}
                onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                className="text-xs bg-slate-100 dark:bg-slate-800 text-[#0B1D3A] dark:text-slate-200 border border-[#D8DFEA] dark:border-slate-700 rounded-xl px-2 py-1.5 font-mono"
              >
                <option value={0.8}>0.8x</option>
                <option value={1.0}>1.0x (Normal)</option>
                <option value={1.2}>1.2x</option>
                <option value={1.5}>1.5x</option>
              </select>

              {/* Animated Waveform */}
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {waveLevels.map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${isSpeaking ? h : 4}px` }}
                    className={`w-0.5 rounded-full transition-all duration-100 ${
                      isSpeaking ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Visual Customizers & Document Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Font Size Adjuster */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-[#D8DFEA] dark:border-slate-700">
                <button
                  onClick={() => {
                    if (fontSize === 'xl') setFontSize('lg');
                    else if (fontSize === 'lg') setFontSize('base');
                    else if (fontSize === 'base') setFontSize('sm');
                  }}
                  className="p-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 cursor-pointer"
                  title="Decrease Font Size"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-[11px] font-mono font-bold uppercase">{fontSize}</span>
                <button
                  onClick={() => {
                    if (fontSize === 'sm') setFontSize('base');
                    else if (fontSize === 'base') setFontSize('lg');
                    else if (fontSize === 'lg') setFontSize('xl');
                  }}
                  className="p-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 cursor-pointer"
                  title="Increase Font Size"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Theme Selector */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-[#D8DFEA] dark:border-slate-700">
                <button
                  onClick={() => setReaderTheme('light')}
                  className={`px-2 py-1 text-[11px] rounded-lg font-bold transition cursor-pointer ${readerTheme === 'light' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                >
                  Light
                </button>
                <button
                  onClick={() => setReaderTheme('sepia')}
                  className={`px-2 py-1 text-[11px] rounded-lg font-bold transition cursor-pointer ${readerTheme === 'sepia' ? 'bg-[#FDF6E2] text-[#433422] shadow-sm' : 'text-slate-500'}`}
                >
                  Sepia
                </button>
                <button
                  onClick={() => setReaderTheme('dark')}
                  className={`px-2 py-1 text-[11px] rounded-lg font-bold transition cursor-pointer ${readerTheme === 'dark' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500'}`}
                >
                  Dark
                </button>
              </div>

              {/* TOC Toggle */}
              <button
                onClick={() => setShowToc(prev => !prev)}
                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 rounded-xl border border-[#D8DFEA] dark:border-slate-700 cursor-pointer"
                title={showToc ? 'Hide Sidebar' : 'Show Sidebar'}
              >
                <Sliders className="w-4 h-4" />
              </button>

              {/* Export Markdown */}
              <button
                onClick={handleDownloadMarkdown}
                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 rounded-xl border border-[#D8DFEA] dark:border-slate-700 cursor-pointer"
                title="Download Markdown Monograph"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Print */}
              <button
                onClick={handlePrintDocument}
                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 rounded-xl border border-[#D8DFEA] dark:border-slate-700 cursor-pointer hidden sm:block"
                title="Print Document"
              >
                <Printer className="w-4 h-4" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(prev => !prev)}
                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 rounded-xl border border-[#D8DFEA] dark:border-slate-700 cursor-pointer"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* ACTIVE READING BANNER STATUS */}
          {activeReadingLabel && (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-3 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-bold">{activeReadingLabel}</span>
              </div>
              <span className="font-mono text-[11px] opacity-80">
                Voice: {activeVoice.name.split('(')[0]}
              </span>
            </div>
          )}

          {/* MAIN DOCUMENT ARTICLE CONTAINER */}
          <article
            ref={documentContentRef}
            onMouseUp={handleMouseUp}
            className={`${themeClass} border rounded-3xl p-6 sm:p-10 shadow-lg space-y-8 transition-colors duration-200 relative select-text`}
          >
            {/* Document Header Metadata */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-md">
                    {activeDoc.courseCode}
                  </span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">
                    {activeDoc.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {activeDoc.readingTimeMinutes} min read</span>
                  <span>•</span>
                  <span>{activeDoc.gradeLevel}</span>
                </div>
              </div>

              <div>
                <h1 className="font-sora font-black text-2xl sm:text-3xl lg:text-4xl leading-tight">
                  {activeDoc.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 font-medium leading-relaxed">
                  {activeDoc.subtitle}
                </p>
              </div>

              {/* Author & Publication Byline */}
              <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  {activeDoc.authorAvatar ? (
                    <img src={activeDoc.authorAvatar} alt="" className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-500 shadow-sm" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <div className="font-sora font-bold text-xs sm:text-sm">
                      {activeDoc.author}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {activeDoc.authorTitle} • {activeDoc.publishedDate}
                    </div>
                  </div>
                </div>

                {/* Tags Pill Row */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {activeDoc.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Executive Summary Callout */}
              <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Executive Lesson Abstract
                  </div>
                  <button
                    onClick={handleReadSummary}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded-xl text-[11px] font-bold border border-blue-200 dark:border-blue-800 transition cursor-pointer"
                    title="Read Abstract with Educator Voice"
                  >
                    <Volume2 className="w-3 h-3 text-blue-600" />
                    <span>Listen Abstract</span>
                  </button>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {activeDoc.summary}
                </p>
              </div>
            </div>

            {/* SECTIONS BODY */}
            <div className="space-y-10">
              {activeDoc.sections.map((section, idx) => {
                const isSectionActive = isSpeaking && currentReadingSectionIndex === idx;
                const sectionAnnotations = annotations.filter(a => a.sectionId === section.id);

                return (
                  <div 
                    key={section.id} 
                    id={section.id} 
                    data-section-id={section.id}
                    data-section-heading={section.heading}
                    className={`space-y-4 pt-4 scroll-mt-24 transition-all duration-300 rounded-2xl ${
                      isSectionActive 
                        ? 'p-5 bg-blue-50/70 dark:bg-blue-950/30 border-2 border-blue-500 shadow-md ring-2 ring-blue-400/20' 
                        : idx > 0 ? 'border-t border-slate-200 dark:border-slate-800' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-2.5">
                        <h2 className="font-sora font-bold text-lg sm:text-xl lg:text-2xl">
                          {section.heading}
                        </h2>
                        {isSectionActive && (
                          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-mono font-bold rounded-full animate-pulse">
                            <Volume2 className="w-2.5 h-2.5" /> Narrating
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleReadSpecificSection(idx)}
                          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl border transition cursor-pointer ${
                            isSectionActive
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-blue-50 hover:text-blue-600'
                          }`}
                          title="Read this section aloud with educator voice"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isSectionActive ? 'Listening' : 'Read Section'}</span>
                        </button>
                        <button
                          onClick={() => handleCopySection(section.content)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 transition cursor-pointer"
                          title="Copy Section Content"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Active Annotations on this Section Pills */}
                    {sectionAnnotations.length > 0 && (
                      <div className="p-3 bg-amber-50/60 dark:bg-slate-800/60 rounded-2xl border border-amber-200/80 dark:border-slate-700 space-y-2 text-xs">
                        <div className="flex items-center justify-between font-mono text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <Highlighter className="w-3 h-3 text-amber-500" /> Scholar Highlights on this section ({sectionAnnotations.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {sectionAnnotations.map(ann => (
                            <div key={ann.id} className={`p-2 rounded-xl border ${highlightColorStyles[ann.color].bg} text-[11px] space-y-1`}>
                              <div className="italic font-medium line-clamp-2">"{ann.selectedText}"</div>
                              {ann.comment && (
                                <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-black/30 p-1 rounded-md">
                                  📝 {ann.comment}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rich Text Paragraphs */}
                    <div className={`space-y-4 ${fontClass} whitespace-pre-line`}>
                      {section.content}
                    </div>

                    {/* Dedicated Pedagogical Callout Box */}
                    {section.callout && (
                      <div className={`p-4 sm:p-5 rounded-2xl border ${calloutTheme[section.callout.type]} space-y-1.5 my-4`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-sora font-bold text-xs sm:text-sm">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            <span>{section.callout.title}</span>
                          </div>
                          <button
                            onClick={() => {
                              speechEngine.speak(`Pedagogical Callout: ${section.callout?.title}. ${section.callout?.body}`, activeVoice);
                            }}
                            className="p-1 text-slate-500 hover:text-blue-600 cursor-pointer"
                            title="Listen to Callout"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed font-medium">
                          {section.callout.body}
                        </p>
                      </div>
                    )}

                    {/* Code Snippet Example Box */}
                    {section.codeExample && (
                      <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-200 shadow-md my-4">
                        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                          <span className="flex items-center gap-2 text-indigo-400 font-bold">
                            <Terminal className="w-3.5 h-3.5" /> {section.codeExample.language.toUpperCase()} Script
                          </span>
                          <button
                            onClick={() => handleCopySection(section.codeExample?.code || '')}
                            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" /> Copy Code
                          </button>
                        </div>
                        <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto text-emerald-400 leading-relaxed">
                          <code>{section.codeExample.code}</code>
                        </pre>
                        {section.codeExample.output && (
                          <div className="px-4 py-2.5 bg-black/60 border-t border-slate-800 text-[11px] font-mono text-cyan-300">
                            <span className="text-slate-500">Output: </span>{section.codeExample.output}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* END-OF-DOCUMENT COMPREHENSION QUIZ */}
            {activeDoc.comprehensionQuiz && activeDoc.comprehensionQuiz.length > 0 && (
              <div className="mt-12 pt-8 border-t-2 border-dashed border-slate-200 dark:border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Formative Assessment Checkpoint
                    </span>
                    <h3 className="font-sora font-bold text-xl text-[#0B1D3A] dark:text-white">
                      Document Comprehension Quiz
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    {activeDoc.comprehensionQuiz.length} Questions
                  </span>
                </div>

                <div className="space-y-6">
                  {activeDoc.comprehensionQuiz.map((q, qIdx) => {
                    const selectedOption = quizAnswers[qIdx];
                    const isAnswered = selectedOption !== undefined;
                    const isCorrect = isAnswered && selectedOption === q.correctIndex;

                    return (
                      <div key={qIdx} className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="font-sora font-bold text-sm text-slate-900 dark:text-white">
                          {qIdx + 1}. {q.question}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, oIdx) => {
                            let optionClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400';
                            if (quizSubmitted) {
                              if (oIdx === q.correctIndex) {
                                optionClass = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                              } else if (selectedOption === oIdx) {
                                optionClass = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 line-through';
                              }
                            } else if (selectedOption === oIdx) {
                              optionClass = 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200 font-bold';
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={quizSubmitted}
                                onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                                className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${optionClass}`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && oIdx === q.correctIndex && (
                                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className={`p-3 rounded-xl text-xs ${isCorrect ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200' : 'bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200'}`}>
                            <span className="font-bold">{isCorrect ? 'Correct! ' : 'Explanation: '}</span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(quizAnswers).length < activeDoc.comprehensionQuiz.length}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-sora font-bold rounded-xl transition cursor-pointer shadow-md"
                  >
                    Submit Quiz &amp; View Explanations
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setQuizAnswers({});
                        setQuizSubmitted(false);
                      }}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
                    </button>
                  </div>
                )}
              </div>
            )}
          </article>
        </div>
      </div>

      {/* 🌟 FLOATING HIGHLIGHT & ANNOTATION TOOLBAR */}
      {selectionToolbar && (
        <div
          style={{ top: `${selectionToolbar.y}px`, left: `${selectionToolbar.x}px` }}
          className="fixed z-50 bg-slate-900 text-white rounded-2xl p-1.5 shadow-2xl border border-slate-700 flex items-center gap-1.5 animate-fadeIn backdrop-blur-md"
        >
          {/* Color Highlight Buttons */}
          <div className="flex items-center gap-1 px-1 border-r border-slate-700">
            {(['yellow', 'emerald', 'cyan', 'pink', 'amber'] as HighlightColor[]).map((color) => (
              <button
                key={color}
                onClick={() => handleAddHighlight(color)}
                className={`w-5 h-5 rounded-full ${highlightColorStyles[color].pill} hover:scale-125 transition-transform cursor-pointer shadow-sm`}
                title={`Highlight in ${color}`}
              />
            ))}
          </div>

          {/* Add Note Button */}
          <button
            onClick={() => {
              setIsNoteModalOpen(true);
            }}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition cursor-pointer"
            title="Add sticky annotation note"
          >
            <StickyNote className="w-3.5 h-3.5 text-amber-400" />
            <span>Note</span>
          </button>

          {/* Listen to Selection */}
          <button
            onClick={() => handleListenText(selectionToolbar.selectedText, 'Reading Selected Text')}
            className="p-1.5 hover:bg-slate-800 text-xs rounded-xl transition cursor-pointer"
            title="Read selected text aloud"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          {/* Copy Selection */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(selectionToolbar.selectedText);
              setCopyNotification('Quote copied to clipboard!');
              setTimeout(() => setCopyNotification(null), 2000);
            }}
            className="p-1.5 hover:bg-slate-800 text-xs rounded-xl transition cursor-pointer"
            title="Copy selection"
          >
            <Copy className="w-3.5 h-3.5 text-slate-300" />
          </button>
        </div>
      )}

      {/* 📝 STICKY ANNOTATION COMMENT MODAL / POPOVER */}
      {isNoteModalOpen && selectionToolbar && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Highlighter className="w-5 h-5 text-amber-500" />
                <h3 className="font-sora font-bold text-base text-slate-900 dark:text-white">
                  Add Annotation &amp; Highlight
                </h3>
              </div>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 italic line-clamp-3">
              "{selectionToolbar.selectedText}"
            </div>

            {/* Color Swatch Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase text-slate-500">
                Highlight Color:
              </label>
              <div className="flex items-center gap-2">
                {(['yellow', 'emerald', 'cyan', 'pink', 'amber'] as HighlightColor[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedHighlightColor(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition flex items-center gap-1.5 cursor-pointer ${
                      selectedHighlightColor === c
                        ? `${highlightColorStyles[c].badge} ring-2 ring-blue-500`
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${highlightColorStyles[c].pill}`} />
                    <span>{c}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase text-slate-500">
                Scholar Reflection / Note:
              </label>
              <textarea
                value={newNoteComment}
                onChange={(e) => setNewNoteComment(e.target.value)}
                rows={3}
                placeholder="Why is this important? Write key takeaways or formulas..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddHighlight(selectedHighlightColor, newNoteComment)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition"
              >
                Save Annotation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Copy / Save Toast */}
      {copyNotification && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#0B1D3A] text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-blue-500/40 text-xs font-semibold flex items-center gap-2 animate-fadeIn backdrop-blur-md">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{copyNotification}</span>
        </div>
      )}

    </div>
  );
};
