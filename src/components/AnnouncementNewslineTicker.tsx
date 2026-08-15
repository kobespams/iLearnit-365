import React, { useState, useEffect } from 'react';
import { Announcement, UserRole } from '../types';
import { 
  Megaphone, 
  Sparkles, 
  Volume2, 
  Pause, 
  Play, 
  ChevronUp, 
  ChevronDown, 
  X, 
  ExternalLink, 
  Clock, 
  AlertTriangle,
  Pin,
  CheckCircle2
} from 'lucide-react';

interface AnnouncementNewslineTickerProps {
  announcements: Announcement[];
  currentUserId?: string;
  onOpenBoard: () => void;
  onSelectAnnouncement?: (ann: Announcement) => void;
  onNavigateRole?: (role: UserRole) => void;
  onMarkRead?: (id: string) => void;
}

export const AnnouncementNewslineTicker: React.FC<AnnouncementNewslineTickerProps> = ({
  announcements,
  currentUserId = 'st-101',
  onOpenBoard,
  onSelectAnnouncement,
  onNavigateRole,
  onMarkRead,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeModalAnnouncement, setActiveModalAnnouncement] = useState<Announcement | null>(null);
  const [hasNewPulse, setHasNewPulse] = useState(false);

  // Trigger pulse effect when new announcements appear
  useEffect(() => {
    if (announcements.length > 0) {
      setHasNewPulse(true);
      const timer = setTimeout(() => setHasNewPulse(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [announcements.length]);

  if (!announcements || announcements.length === 0) {
    return null;
  }

  const unreadCount = announcements.filter((a) => !a.readBy.includes(currentUserId)).length;

  const handleTickerItemClick = (ann: Announcement) => {
    if (onMarkRead) {
      onMarkRead(ann.id);
    }
    setActiveModalAnnouncement(ann);
  };

  return (
    <>
      {/* Sticky Bottom Newsline Ticker Bar */}
      <div 
        id="announcement-newsline-bar"
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
          isMinimized ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'
        }`}
      >
        <div className="bg-[#0B1D3A]/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-cyan-500/40 text-slate-100 shadow-2xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-6 py-2 sm:py-2.5 gap-3">
            {/* Live Indicator Pill */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenBoard}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase transition-all shadow-sm ${
                  unreadCount > 0
                    ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white animate-pulse'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                }`}
                title="Click to view all campus announcements"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                <Megaphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">NEWSLINE</span>
                {unreadCount > 0 && (
                  <span className="bg-white text-rose-700 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {unreadCount} NEW
                  </span>
                )}
              </button>
            </div>

            {/* Scrolling Marquee Container */}
            <div 
              className={`flex-1 overflow-hidden relative select-none cursor-pointer group ${
                isPaused ? 'newsline-paused' : ''
              }`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Fade gradient masks on left and right */}
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#0B1D3A] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#0B1D3A] to-transparent z-10 pointer-events-none" />

              {/* Marquee Elements Duplicate for seamless loop */}
              <div className="animate-newsline flex items-center space-x-12 py-0.5">
                {[...announcements, ...announcements].map((item, idx) => {
                  const isUnread = !item.readBy.includes(currentUserId);
                  return (
                    <div
                      key={`${item.id}-${idx}`}
                      onClick={() => handleTickerItemClick(item)}
                      className="inline-flex items-center gap-2.5 hover:text-cyan-300 transition-colors shrink-0 group/item cursor-pointer"
                    >
                      {/* Priority Tag */}
                      {item.priority === 'urgent' && (
                        <span className="bg-rose-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider animate-pulse">
                          🚨 URGENT
                        </span>
                      )}
                      {item.priority === 'high' && (
                        <span className="bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider">
                          ⚡ NOTICE
                        </span>
                      )}
                      {item.isPinned && item.priority !== 'urgent' && (
                        <span className="bg-blue-500/80 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider">
                          📌 PINNED
                        </span>
                      )}

                      {/* Category */}
                      <span className="text-[10px] font-mono font-bold text-cyan-400">
                        [{item.category}]
                      </span>

                      {/* Title & Preview */}
                      <span className={`text-xs font-semibold ${isUnread ? 'text-white underline decoration-amber-400 underline-offset-2' : 'text-slate-300'}`}>
                        {item.title}
                      </span>

                      <span className="text-[11px] text-slate-400 group-hover/item:text-slate-200 hidden md:inline">
                        — {item.message.slice(0, 75)}...
                      </span>

                      {/* Time */}
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {item.timestamp}
                      </span>

                      {/* Divider Icon */}
                      <span className="text-cyan-600/60 font-bold ml-2">✦</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Controls */}
            <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
              <button
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? 'Resume scrolling' : 'Pause scrolling'}
                title={isPaused ? 'Resume newsline stream' : 'Pause newsline stream'}
                className="p-1.5 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onOpenBoard}
                className="text-[11px] font-bold text-cyan-300 hover:text-white px-2 py-1 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/60 rounded-lg transition-all hidden sm:inline-block cursor-pointer"
              >
                View Board
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand newsline' : 'Minimize newsline'}
                className="p-1.5 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
              >
                {isMinimized ? <ChevronUp className="w-3.5 h-3.5 text-amber-400" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* QUICK ANNOUNCEMENT PREVIEW MODAL                         */}
      {/* ========================================================= */}
      {activeModalAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Megaphone className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-blue-600 dark:text-blue-400">
                    {activeModalAnnouncement.category} Dispatch
                  </span>
                  <h3 className="font-sora font-bold text-base text-slate-900 dark:text-white leading-snug">
                    {activeModalAnnouncement.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveModalAnnouncement(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {activeModalAnnouncement.author}
                </span>{' '}
                • {activeModalAnnouncement.authorRole}
              </div>
              <div className="flex items-center gap-1 font-mono text-[11px]">
                <Clock className="w-3 h-3" />
                {activeModalAnnouncement.timestamp}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              {activeModalAnnouncement.message}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => {
                  setActiveModalAnnouncement(null);
                  onOpenBoard();
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Open Full Announcements Board →
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {activeModalAnnouncement.actionLink && onNavigateRole && (
                  <button
                    onClick={() => {
                      const role = activeModalAnnouncement.actionLink?.targetRole;
                      setActiveModalAnnouncement(null);
                      if (role) {
                        onNavigateRole(role);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                  >
                    <span>{activeModalAnnouncement.actionLink.label}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => setActiveModalAnnouncement(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
