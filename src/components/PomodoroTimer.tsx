import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Sparkles, CheckCircle2, Award, BookOpen, Clock, Zap } from 'lucide-react';

interface PomodoroTimerProps {
  onSessionComplete?: (subject: string, minutesLogged: number) => void;
  subjects?: string[];
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  onSessionComplete,
  subjects = ['Mathematics', 'Computer Science', 'Integrated Science', 'World Literature'],
}) => {
  const [mode, setMode] = useState<'study' | 'shortBreak' | 'longBreak'>('study');
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0] || 'Mathematics');
  
  // Timer durations in seconds
  const modeDurations = {
    study: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  const [timeLeft, setTimeLeft] = useState<number>(modeDurations.study);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState<number>(50); // initial sample
  const [lastCompletedSubject, setLastCompletedSubject] = useState<string | null>(null);

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      if (mode === 'study') {
        const newSessions = completedSessions + 1;
        setCompletedSessions(newSessions);
        setTotalFocusMinutes((prev) => prev + 25);
        setLastCompletedSubject(selectedSubject);
        if (onSessionComplete) {
          onSessionComplete(selectedSubject, 25);
        }
        // Auto switch to break
        if (newSessions % 4 === 0) {
          setMode('longBreak');
          setTimeLeft(modeDurations.longBreak);
        } else {
          setMode('shortBreak');
          setTimeLeft(modeDurations.shortBreak);
        }
      } else {
        // Break finished -> back to study
        setMode('study');
        setTimeLeft(modeDurations.study);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, selectedSubject, completedSessions, onSessionComplete]);

  const handleModeChange = (newMode: 'study' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(modeDurations[newMode]);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(modeDurations[mode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const totalModeSecs = modeDurations[mode];
  const progressPercent = Math.round(((totalModeSecs - timeLeft) / totalModeSecs) * 100);

  return (
    <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden space-y-6">
      {/* Background Accent glow */}
      <div
        className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors ${
          mode === 'study'
            ? 'bg-blue-500/10'
            : mode === 'shortBreak'
            ? 'bg-emerald-500/10'
            : 'bg-amber-500/10'
        }`}
      />

      {/* Title & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold font-mono text-blue-600 uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5 text-gold" /> Pomodoro Focus Engine
          </div>
          <h3 className="text-xl font-extrabold font-sora text-navy">
            Study Focus Session
          </h3>
          <p className="text-xs text-slate-500">
            Boost retention with timed 25-minute deep focus blocks & scheduled breaks.
          </p>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => handleModeChange('study')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'study'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-navy hover:bg-white/60'
            }`}
          >
            25m Focus
          </button>
          <button
            onClick={() => handleModeChange('shortBreak')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'shortBreak'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-navy hover:bg-white/60'
            }`}
          >
            5m Break
          </button>
          <button
            onClick={() => handleModeChange('longBreak')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'longBreak'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-navy hover:bg-white/60'
            }`}
          >
            15m Rest
          </button>
        </div>
      </div>

      {/* Main Timer Display & Subject Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Circle Progress Timer (7 cols) */}
        <div className="md:col-span-7 flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200/80 rounded-3xl relative">
          <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-200"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className={`transition-all duration-1000 ${
                  mode === 'study'
                    ? 'stroke-blue-600'
                    : mode === 'shortBreak'
                    ? 'stroke-emerald-600'
                    : 'stroke-amber-500'
                }`}
                strokeWidth="6"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Timer Digits */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-4xl sm:text-5xl font-mono font-extrabold text-navy tracking-tight">
                {formatTime(timeLeft)}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  mode === 'study'
                    ? 'bg-blue-100 text-blue-800'
                    : mode === 'shortBreak'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {mode === 'study' ? 'Deep Study' : mode === 'shortBreak' ? 'Short Refresh' : 'Long Recovery'}
              </span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={toggleTimer}
              className={`px-6 py-3 rounded-2xl font-sora font-extrabold text-xs sm:text-sm text-white shadow-lg flex items-center gap-2 transition-all cursor-pointer ${
                isRunning
                  ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-400/20'
                  : mode === 'study'
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                  : mode === 'shortBreak'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  : 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current" /> Pause Session
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Start Timer
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              className="p-3 bg-white border border-slate-300 rounded-2xl text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subject Context & Stats (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Target Subject Context
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-navy focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500 mt-1">
              Time completed will be recorded toward your {selectedSubject} study log.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-blue-50/80 border border-blue-200/80 p-3.5 rounded-2xl">
              <div className="text-[10px] font-bold uppercase text-blue-700 font-mono">Sessions Done</div>
              <div className="text-xl font-extrabold text-navy mt-0.5">{completedSessions}</div>
              <div className="text-[10px] text-blue-600">Pomodoros Today</div>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200/80 p-3.5 rounded-2xl">
              <div className="text-[10px] font-bold uppercase text-emerald-700 font-mono">Focus Time</div>
              <div className="text-xl font-extrabold text-navy mt-0.5">{totalFocusMinutes} mins</div>
              <div className="text-[10px] text-emerald-600">Logged Overall</div>
            </div>
          </div>

          {/* Completion Toast Notification */}
          {lastCompletedSubject && (
            <div className="bg-emerald-100/90 border border-emerald-300 text-emerald-950 p-3 rounded-2xl text-xs space-y-1 animate-fadeIn">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Session Recorded!
              </div>
              <p className="text-[11px] leading-snug">
                +25 minutes added to <span className="font-bold">{lastCompletedSubject}</span> mastery log.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
