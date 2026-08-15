import React, { useState } from 'react';
import { Announcement, AnnouncementCategory, AnnouncementPriority, UserRole } from '../types';
import { 
  Megaphone, 
  Sparkles, 
  Bell, 
  CheckCheck, 
  Search, 
  Filter, 
  Pin, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  Check, 
  Plus, 
  X, 
  Tag, 
  Users, 
  Flame,
  BookOpen,
  GraduationCap,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { ConfirmationModal, ConfirmationActionType, ConfirmationItemPreview } from './ConfirmationModal';

interface StudentAnnouncementsBoardProps {
  announcements: Announcement[];
  currentUserId?: string;
  onMarkRead: (announcementId: string) => void;
  onMarkAllRead: () => void;
  onDeleteAnnouncement?: (announcementId: string) => void;
  onAddAnnouncement: (newAnn: Omit<Announcement, 'id' | 'createdAt' | 'readBy'>) => void;
  onNavigateRole?: (role: UserRole) => void;
  activeRole?: UserRole;
  userName?: string;
}

export const StudentAnnouncementsBoard: React.FC<StudentAnnouncementsBoardProps> = ({
  announcements,
  currentUserId = 'st-101',
  onMarkRead,
  onMarkAllRead,
  onDeleteAnnouncement,
  onAddAnnouncement,
  onNavigateRole,
  activeRole = 'student',
  userName = 'Teacher / Staff',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedAnnouncementDetail, setSelectedAnnouncementDetail] = useState<Announcement | null>(null);

  // Custom Confirmation Modal State
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    actionType: ConfirmationActionType;
    title: string;
    description: string;
    itemPreview?: ConfirmationItemPreview;
    confirmLabel?: string;
    onConfirmCallback?: () => void;
  }>({
    isOpen: false,
    actionType: 'mark-read',
    title: '',
    description: '',
  });

  // Form State for Posting New Announcement
  const [postTitle, setPostTitle] = useState('');
  const [postMessage, setPostMessage] = useState('');
  const [postCategory, setPostCategory] = useState<AnnouncementCategory>('Academic');
  const [postPriority, setPostPriority] = useState<AnnouncementPriority>('high');
  const [postTargetAudience, setPostTargetAudience] = useState('All Students (JSS1 - SS3)');
  const [postAuthorRole, setPostAuthorRole] = useState(
    activeRole === 'teacher' ? 'Classroom Instructor' : 'Academic Coordinator'
  );
  const [postActionRole, setPostActionRole] = useState<UserRole | ''>('');
  const [postActionLabel, setPostActionLabel] = useState('');
  const [postIsPinned, setPostIsPinned] = useState(false);

  // Filter calculations
  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesCategory = selectedCategory === 'All' || ann.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || ann.priority === selectedPriority;
    const matchesSearch = 
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.targetAudience.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPriority && matchesSearch;
  });

  const unreadCount = announcements.filter((a) => !a.readBy.includes(currentUserId)).length;

  // Confirmation Modal Request Handlers
  const handleRequestMarkRead = (announcement: Announcement) => {
    const isCurrentlyRead = announcement.readBy.includes(currentUserId);
    setConfirmModalConfig({
      isOpen: true,
      actionType: 'mark-read',
      title: isCurrentlyRead ? 'Mark Notice as Unread?' : 'Mark Announcement as Read?',
      description: isCurrentlyRead
        ? 'This will return this announcement to your active Unread Dispatches queue.'
        : 'Confirm that you have reviewed this announcement. Its status will be updated as viewed.',
      itemPreview: {
        title: announcement.title,
        author: `${announcement.author} (${announcement.authorRole})`,
        category: announcement.category,
        priority: announcement.priority,
        snippet: announcement.message,
        timestamp: announcement.timestamp,
      },
      confirmLabel: isCurrentlyRead ? 'Mark as Unread' : 'Confirm & Mark Read',
      onConfirmCallback: () => onMarkRead(announcement.id),
    });
  };

  const handleRequestMarkAllRead = () => {
    if (unreadCount === 0) return;
    setConfirmModalConfig({
      isOpen: true,
      actionType: 'mark-all-read',
      title: 'Mark All Announcements as Read?',
      description: `You have ${unreadCount} unread announcement${unreadCount > 1 ? 's' : ''}. Confirming will mark all active dispatches as read for your account.`,
      itemPreview: {
        title: `Batch Status Update (${unreadCount} New Notices)`,
        category: 'Campus Notice Board',
        count: unreadCount,
        snippet: 'Includes all academic circulars, CBT exam announcements, and homework notices.',
      },
      confirmLabel: `Mark All (${unreadCount}) as Read`,
      onConfirmCallback: () => onMarkAllRead(),
    });
  };

  const handleRequestDelete = (announcement: Announcement) => {
    setConfirmModalConfig({
      isOpen: true,
      actionType: 'delete',
      title: 'Delete Announcement / Notice?',
      description: 'Are you sure you want to permanently remove this message from the campus announcement board? This action will remove it for all enrolled students.',
      itemPreview: {
        title: announcement.title,
        author: `${announcement.author} (${announcement.authorRole})`,
        category: announcement.category,
        priority: announcement.priority,
        snippet: announcement.message,
        timestamp: announcement.timestamp,
      },
      confirmLabel: 'Yes, Delete Notice',
      onConfirmCallback: () => {
        if (onDeleteAnnouncement) {
          onDeleteAnnouncement(announcement.id);
        }
      },
    });
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const handleExecuteConfirmedAction = () => {
    if (confirmModalConfig.onConfirmCallback) {
      confirmModalConfig.onConfirmCallback();
    }
    handleCloseConfirmModal();
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postMessage.trim()) return;

    onAddAnnouncement({
      title: postTitle.trim(),
      message: postMessage.trim(),
      author: userName || 'Teacher / Academic Staff',
      authorRole: postAuthorRole.trim() || 'Instructor',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      category: postCategory,
      priority: postPriority,
      targetAudience: postTargetAudience.trim() || 'All Students',
      timestamp: 'Just now',
      isPinned: postIsPinned,
      actionLink: postActionRole && postActionLabel ? {
        label: postActionLabel,
        targetRole: postActionRole as UserRole,
      } : undefined,
    });

    // Reset and Close
    setPostTitle('');
    setPostMessage('');
    setPostActionLabel('');
    setPostActionRole('');
    setShowPostModal(false);
  };

  const getPriorityBadgeClass = (priority: AnnouncementPriority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse';
      case 'high':
        return 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'medium':
        return 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'low':
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getCategoryBadgeClass = (cat: AnnouncementCategory) => {
    switch (cat) {
      case 'Examination':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Academic':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'STEM & Coding':
        return 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      case 'Music & Arts':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Assignments':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Campus':
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Board Top Banner */}
      <div className="bg-gradient-to-r from-[#132C54] via-[#1E3A8A] to-[#1D4ED8] dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <Megaphone className="w-6 h-6 text-amber-300 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-sora font-extrabold text-2xl text-white tracking-tight">
                    Campus Announcements & Notice Board
                  </h2>
                  {unreadCount > 0 && (
                    <span className="bg-rose-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md animate-pulse flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      {unreadCount} NEW
                    </span>
                  )}
                </div>
                <p className="text-xs text-blue-100/80 font-medium mt-0.5">
                  Official dispatches, examination alerts, homework updates, and teacher broadcasts
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {unreadCount > 0 && (
              <button
                onClick={handleRequestMarkAllRead}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-sm border border-white/20 transition-all cursor-pointer shadow-sm hover:scale-102"
              >
                <CheckCheck className="w-4 h-4 text-emerald-300" />
                <span>Mark All Read ({unreadCount})</span>
              </button>
            )}

            <button
              id="open-post-announcement-modal-btn"
              onClick={() => setShowPostModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg hover:scale-105 transition-all cursor-pointer border border-amber-300/40"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Post Announcement (Educator)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 border border-[#D8DFEA] dark:border-slate-700 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A8AA8]" />
          <input
            type="text"
            placeholder="Search announcements by title, teacher, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D8DFEA] dark:border-slate-700 text-xs bg-[#F6F8FB] dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-[#7A8AA8] focus:ring-2 focus:ring-[#2F6FE0] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            'All',
            'Examination',
            'Academic',
            'STEM & Coding',
            'Music & Arts',
            'Assignments',
            'Campus'
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#132C54] dark:bg-blue-600 text-white shadow-sm'
                  : 'bg-[#F6F8FB] dark:bg-slate-900 text-[#5B6A88] dark:text-slate-300 hover:bg-[#ECF0F6] dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-slate-500 uppercase font-mono hidden sm:inline">Priority:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-[#D8DFEA] dark:border-slate-700 text-xs font-semibold bg-[#F6F8FB] dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="urgent">🚨 Urgent Only</option>
            <option value="high">⚡ High Priority</option>
            <option value="medium">📌 Medium</option>
            <option value="low">🌱 General Info</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-[#D8DFEA] dark:border-slate-700 rounded-3xl p-12 text-center shadow-sm">
            <Megaphone className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="font-sora font-bold text-lg text-slate-800 dark:text-slate-200">No Announcements Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              There are no messages matching your search or active filter criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedPriority('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-100"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => {
            const isRead = announcement.readBy.includes(currentUserId);
            const isUrgent = announcement.priority === 'urgent';

            return (
              <div
                key={announcement.id}
                className={`bg-white dark:bg-slate-800 border rounded-3xl p-5 sm:p-6 transition-all shadow-sm hover:shadow-md relative overflow-hidden ${
                  !isRead
                    ? 'border-blue-300 dark:border-blue-700 ring-2 ring-blue-500/10'
                    : 'border-[#D8DFEA] dark:border-slate-700'
                } ${
                  isUrgent ? 'border-l-4 border-l-rose-500' : announcement.isPinned ? 'border-l-4 border-l-amber-500' : ''
                }`}
              >
                {/* Unread Top Highlight Bar */}
                {!isRead && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-l from-blue-600 to-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                      UNREAD DISPATCH
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1">
                    {/* Author Avatar */}
                    <img
                      src={announcement.authorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'}
                      alt={announcement.author}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs shrink-0 mt-0.5"
                    />

                    <div className="space-y-1.5 flex-1">
                      {/* Meta badges row */}
                      <div className="flex flex-wrap items-center gap-2">
                        {announcement.isPinned && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                            <Pin className="w-2.5 h-2.5" /> PINNED
                          </span>
                        )}

                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(announcement.category)}`}>
                          <Tag className="w-2.5 h-2.5" /> {announcement.category}
                        </span>

                        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getPriorityBadgeClass(announcement.priority)}`}>
                          {isUrgent && <AlertTriangle className="w-2.5 h-2.5" />}
                          {announcement.priority} priority
                        </span>

                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {announcement.timestamp}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-sora font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                        {announcement.title}
                      </h3>

                      {/* Author and Target Audience */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#5B6A88] dark:text-slate-400">
                        <span className="font-semibold text-[#0B1D3A] dark:text-slate-200">
                          {announcement.author}
                        </span>
                        <span>•</span>
                        <span className="italic">{announcement.authorRole}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md text-[11px] font-medium">
                          <Users className="w-3 h-3 text-blue-500" /> {announcement.targetAudience}
                        </span>
                      </div>

                      {/* Message Body */}
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-1 whitespace-pre-line">
                        {announcement.message}
                      </p>

                      {/* Action Link Button if provided */}
                      {announcement.actionLink && onNavigateRole && (
                        <div className="pt-2">
                          <button
                            onClick={() => {
                              onMarkRead(announcement.id);
                              if (announcement.actionLink?.targetRole) {
                                onNavigateRole(announcement.actionLink.targetRole);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-105 cursor-pointer"
                          >
                            <span>{announcement.actionLink.label}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Column: Mark Read & Delete */}
                  <div className="shrink-0 flex items-center sm:flex-col gap-2 self-end sm:self-start">
                    <button
                      onClick={() => handleRequestMarkRead(announcement)}
                      title={isRead ? 'Click to mark as unread' : 'Click to mark as read'}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                        isRead
                          ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 font-bold'
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 ${isRead ? 'text-slate-400' : 'text-emerald-600'}`} />
                      <span>{isRead ? 'Read' : 'Mark as Read'}</span>
                    </button>

                    {/* Delete announcement button */}
                    <button
                      onClick={() => handleRequestDelete(announcement)}
                      title="Delete announcement notice"
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 dark:bg-slate-900 dark:hover:bg-rose-950/50 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200 hover:border-rose-200 dark:border-slate-800 dark:hover:border-rose-900 transition-all cursor-pointer"
                      aria-label={`Delete ${announcement.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[11px]">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================= */}
      {/* POST NEW ANNOUNCEMENT MODAL (Teacher / Educator Portal)   */}
      {/* ========================================================= */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-2xl w-full p-6 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-md">
                  <Megaphone className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Post Teacher Announcement / Broadcast
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Instantly broadcast academic notes, exam timetables, or alerts to students & newsline
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handlePostSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Announcement Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🚨 Term 3 CBT Mock Assessment Guidelines & Formula Sheet"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Announcement Category
                  </label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value as AnnouncementCategory)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Academic">Academic Notice</option>
                    <option value="Examination">Examination & CBT</option>
                    <option value="STEM & Coding">STEM & Cybersecurity</option>
                    <option value="Music & Arts">Music & Creative Arts</option>
                    <option value="Assignments">Assignments & Homework</option>
                    <option value="Campus">Campus & General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={postPriority}
                    onChange={(e) => setPostPriority(e.target.value as AnnouncementPriority)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="urgent">🚨 Urgent (Flashes on Newsline)</option>
                    <option value="high">⚡ High Priority</option>
                    <option value="medium">📌 Medium</option>
                    <option value="low">🌱 Low / Informational</option>
                  </select>
                </div>
              </div>

              {/* Target Audience & Teacher Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Grade / Class
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. All Students, JSS1 - JSS3, AP Calculus"
                    value={postTargetAudience}
                    onChange={(e) => setPostTargetAudience(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Department / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mathematics Department Chair"
                    value={postAuthorRole}
                    onChange={(e) => setPostAuthorRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Message Content *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type the full announcement details, instructions, due dates, or syllabus reminders..."
                  value={postMessage}
                  onChange={(e) => setPostMessage(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Direct Quick Action Link (Optional) */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-[11px] font-extrabold uppercase font-mono text-slate-500 dark:text-slate-400">
                  Optional Interactive Deep Link Button
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Open CBT Exam Suite"
                      value={postActionLabel}
                      onChange={(e) => setPostActionLabel(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Target Portal
                    </label>
                    <select
                      value={postActionRole}
                      onChange={(e) => setPostActionRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    >
                      <option value="">-- No Direct Link --</option>
                      <option value="cbt">CBT Exam Suite</option>
                      <option value="jss_math">JSS Mathematics Syllabus</option>
                      <option value="cyber_security">Cybersecurity Academy</option>
                      <option value="student">Student Dashboard</option>
                      <option value="teacher">Teacher Portal</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pin to Top Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pin-announcement-checkbox"
                  checked={postIsPinned}
                  onChange={(e) => setPostIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="pin-announcement-checkbox" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Pin this announcement to top of board
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-new-announcement-btn"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all hover:scale-105"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CUSTOM ACTION CONFIRMATION MODAL (Mark Read / Delete)    */}
      {/* ========================================================= */}
      <ConfirmationModal
        isOpen={confirmModalConfig.isOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleExecuteConfirmedAction}
        actionType={confirmModalConfig.actionType}
        title={confirmModalConfig.title}
        description={confirmModalConfig.description}
        itemPreview={confirmModalConfig.itemPreview}
        confirmLabel={confirmModalConfig.confirmLabel}
      />
    </div>
  );
};
