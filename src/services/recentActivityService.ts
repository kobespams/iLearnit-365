import { EDUCATIONAL_DOCUMENTS } from '../data/educationalDocuments';
import { DocumentFileType } from '../types';

export interface RecentDocumentActivity {
  id: string;
  title: string;
  subtitle?: string;
  subjectId: string;
  subjectName: string;
  courseCode?: string;
  category?: string;
  fileType?: DocumentFileType;
  author?: string;
  readingTimeMinutes?: number;
  gradeLevel?: string;
  openedAt: string;
  timestamp: number;
}

const STORAGE_PREFIX = 'ilearnit_recent_opened_docs_';

export function inferDocumentFileType(meta: {
  fileType?: DocumentFileType;
  category?: string;
  title?: string;
}): DocumentFileType {
  if (meta.fileType) return meta.fileType;
  const cat = (meta.category || '').toLowerCase();
  const title = (meta.title || '').toLowerCase();

  if (title.includes('.txt') || cat.includes('lab manual') || cat.includes('plain text')) {
    return 'TXT';
  }
  if (title.includes('diagram') || title.includes('chart') || title.includes('visual') || cat.includes('formula sheet')) {
    return 'IMG';
  }
  if (cat.includes('examination syllabus') || cat.includes('curriculum') || title.includes('.docx') || title.includes('guide')) {
    return 'DOCX';
  }
  return 'PDF';
}

export function getRecentOpenedDocuments(userId: string = 'st-101', studentGradeLevel?: string): RecentDocumentActivity[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
    if (raw) {
      const parsed: RecentDocumentActivity[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 5).map(item => ({
          ...item,
          fileType: inferDocumentFileType(item),
        }));
      }
    }
  } catch (e) {
    console.warn('Failed to load recent documents from localStorage', e);
  }

  const isSeniorOrCalculus = studentGradeLevel?.toLowerCase().includes('ss') || 
                            studentGradeLevel?.toLowerCase().includes('senior') || 
                            studentGradeLevel?.toLowerCase().includes('prep');

  const sortedDocs = [...EDUCATIONAL_DOCUMENTS].sort((a, b) => {
    if (isSeniorOrCalculus) {
      if (a.subjectId === 'calculus') return -1;
      if (b.subjectId === 'calculus') return 1;
    } else {
      if (a.subjectId === 'jss_math') return -1;
      if (b.subjectId === 'jss_math') return 1;
    }
    return 0;
  });

  const defaults: RecentDocumentActivity[] = sortedDocs.slice(0, 5).map((doc, idx) => {
    const minutesAgo = (idx + 1) * 25;
    const timeDisplay = idx === 0 ? 'Today at 09:15 AM' : idx === 1 ? 'Yesterday' : `${idx + 1} days ago`;

    return {
      id: doc.id,
      title: doc.title,
      subtitle: doc.subtitle,
      subjectId: doc.subjectId,
      subjectName: doc.subjectName,
      courseCode: doc.courseCode,
      category: doc.category,
      fileType: inferDocumentFileType(doc),
      author: doc.author,
      readingTimeMinutes: doc.readingTimeMinutes,
      gradeLevel: doc.gradeLevel,
      openedAt: timeDisplay,
      timestamp: Date.now() - minutesAgo * 60 * 1000,
    };
  });

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(defaults));
  } catch (e) {}

  return defaults;
}

export function recordDocumentOpened(
  doc: {
    id: string;
    title: string;
    subtitle?: string;
    subjectId: string;
    subjectName: string;
    courseCode?: string;
    category?: string;
    fileType?: DocumentFileType;
    author?: string;
    readingTimeMinutes?: number;
    gradeLevel?: string;
  },
  userId: string = 'st-101'
): RecentDocumentActivity[] {
  const current = getRecentOpenedDocuments(userId);
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedTime = `Today at ${timeStr}`;

  const newEntry: RecentDocumentActivity = {
    id: doc.id,
    title: doc.title,
    subtitle: doc.subtitle,
    subjectId: doc.subjectId,
    subjectName: doc.subjectName,
    courseCode: doc.courseCode,
    category: doc.category,
    fileType: inferDocumentFileType(doc),
    author: doc.author,
    readingTimeMinutes: doc.readingTimeMinutes,
    gradeLevel: doc.gradeLevel,
    openedAt: formattedTime,
    timestamp: Date.now(),
  };

  const filtered = current.filter(item => item.id !== doc.id);
  const updated = [newEntry, ...filtered].slice(0, 5);

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ilearnit:recent_documents_updated', { detail: { userId, docs: updated } }));
  } catch (e) {
    console.warn('Failed to save recent document activity', e);
  }

  return updated;
}
