import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, Play, Pause, Square, Sparkles, MessageSquare, 
  HelpCircle, CheckCircle, ChevronRight, Sliders, Mic, UserCheck, 
  Settings2, RefreshCw, Send, Radio, Award, BookOpen, Layers
} from 'lucide-react';
import { 
  VoicePersona, 
  PRESET_VOICE_PERSONAS, 
  getActiveEducatorVoice, 
  saveActiveEducatorVoice, 
  speechEngine, 
  recordStudentInteraction,
  getEducatorInteractions,
  StudentInteractionRecord
} from '../services/educatorVoiceService';

interface EducatorVoicePresenterProps {
  moduleName: string;
  topicTitle: string;
  overviewSpeech: string;
  keyPoints?: string[];
  checkpointQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  studentName?: string;
  compact?: boolean;
}

export const EducatorVoicePresenter: React.FC<EducatorVoicePresenterProps> = ({
  moduleName,
  topicTitle,
  overviewSpeech,
  keyPoints = [],
  checkpointQuestion,
  studentName = 'Student',
  compact = false,
}) => {
  const [activePersona, setActivePersona] = useState<VoicePersona>(() => getActiveEducatorVoice());
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [activeSpeechText, setActiveSpeechText] = useState<string>(overviewSpeech);
  
  // Interactive Dialogue & Student Queries
  const [askModalOpen, setAskModalOpen] = useState<boolean>(false);
  const [studentQuery, setStudentQuery] = useState<string>('');
  const [dialogueHistory, setDialogueHistory] = useState<StudentInteractionRecord[]>([]);
  const [answeringQuery, setAnsweringQuery] = useState<boolean>(false);
  const [recentAnswer, setRecentAnswer] = useState<string | null>(null);

  // Checkpoint Quiz
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [checkpointEvaluated, setCheckpointEvaluated] = useState<boolean>(false);

  // Voice Customization Studio
  const [studioOpen, setStudioOpen] = useState<boolean>(false);
  const [customPitch, setCustomPitch] = useState<number>(activePersona.pitch || 1.0);
  const [customRate, setCustomRate] = useState<number>(activePersona.rate || 1.0);

  // Waveform animation
  const [waveLevels, setWaveLevels] = useState<number[]>([12, 24, 18, 30, 20, 14, 28, 22, 16, 26]);

  // Load interactions
  useEffect(() => {
    setDialogueHistory(getEducatorInteractions().filter(i => i.moduleName === moduleName || i.topicTitle === topicTitle));
  }, [moduleName, topicTitle]);

  // Waveform pulsing while playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isPaused) {
      interval = setInterval(() => {
        setWaveLevels(prev => prev.map(() => Math.floor(Math.random() * 26) + 8));
      }, 120);
    } else {
      setWaveLevels([10, 14, 12, 16, 14, 10, 15, 12, 10, 14]);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isPaused]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      speechEngine.stop();
    };
  }, []);

  const handlePlayLessonSpeech = () => {
    if (isPaused) {
      speechEngine.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Build the lecture speech with greetings and pedagogical pacing
    const greeting = activePersona.catchphrases[0] || 'Welcome students!';
    const pointsText = keyPoints.length > 0 ? ` Let us examine the core principles. ${keyPoints.map((p, idx) => `Point ${idx + 1}: ${p}`).join('. ')}` : '';
    const fullScript = `${greeting} Today we are presenting "${topicTitle}". ${overviewSpeech}.${pointsText} Remember to stay curious and feel free to ask questions at any time.`;

    setActiveSpeechText(fullScript);

    speechEngine.speak(fullScript, activePersona, {
      rateMultiplier: speedMultiplier,
      onStart: () => {
        setIsPlaying(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
    });
  };

  const handlePause = () => {
    speechEngine.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    speechEngine.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleSelectPersona = (personaId: string) => {
    const found = PRESET_VOICE_PERSONAS.find(p => p.id === personaId) || PRESET_VOICE_PERSONAS[0];
    setActivePersona(found);
    saveActiveEducatorVoice(found);
    setCustomPitch(found.pitch);
    setCustomRate(found.rate);

    // Speak quick preview in selected accent and tone
    speechEngine.speak(
      `Hello! I am ${found.name}. I will be guiding you with my ${found.accent} accent and ${found.tone} tone.`,
      found,
      { rateMultiplier: speedMultiplier }
    );
  };

  const handleSaveCustomPersona = () => {
    const updated: VoicePersona = {
      ...activePersona,
      pitch: customPitch,
      rate: customRate,
    };
    setActivePersona(updated);
    saveActiveEducatorVoice(updated);
    setStudioOpen(false);

    speechEngine.speak(
      `Voice settings updated. Pitch set to ${customPitch.toFixed(2)} and speed at ${customRate.toFixed(2)}x.`,
      updated
    );
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentQuery.trim()) return;

    setAnsweringQuery(true);
    // Pause lecture speech
    speechEngine.stop();
    setIsPlaying(false);

    // Generate response using persona
    const record = recordStudentInteraction(
      studentName,
      moduleName,
      topicTitle,
      studentQuery.trim()
    );

    setRecentAnswer(record.educatorResponse);
    setDialogueHistory(prev => [record, ...prev]);
    setStudentQuery('');
    setAnsweringQuery(false);

    // Speak the educator response
    speechEngine.speak(
      `${activePersona.name} replying to ${studentName}: ${record.educatorResponse}`,
      activePersona,
      {
        rateMultiplier: speedMultiplier,
        onStart: () => setIsPlaying(true),
        onEnd: () => setIsPlaying(false),
      }
    );
  };

  const handleEvaluateCheckpoint = (index: number) => {
    setSelectedOption(index);
    setCheckpointEvaluated(true);
    if (!checkpointQuestion) return;

    const isCorrect = index === checkpointQuestion.correctIndex;
    const spokenFeedback = isCorrect
      ? `Brilliant work! Option ${index + 1} is correct. ${checkpointQuestion.explanation}`
      : `Good effort! Option ${index + 1} is not quite right. The correct answer is option ${checkpointQuestion.correctIndex + 1}. ${checkpointQuestion.explanation}`;

    speechEngine.speak(spokenFeedback, activePersona, { rateMultiplier: speedMultiplier });
  };

  return (
    <div className={`bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 text-white rounded-2xl border border-indigo-500/30 shadow-xl overflow-hidden transition-all duration-300 ${compact ? 'p-3' : 'p-4 sm:p-5'}`}>
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg ring-2 ring-indigo-400/40">
            <Volume2 className="w-5 h-5 text-white animate-pulse" />
            {isPlaying && !isPaused && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-900/60 px-2 py-0.5 rounded-md border border-indigo-400/30">
                Educator Voice Presenter
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {activePersona.accent}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-sora font-bold text-white mt-0.5">
              {activePersona.name} <span className="text-xs text-indigo-300 font-normal">({activePersona.tone})</span>
            </h4>
          </div>
        </div>

        {/* Persona Switcher & Studio Button */}
        <div className="flex items-center gap-2">
          <select
            value={activePersona.id}
            onChange={(e) => handleSelectPersona(e.target.value)}
            className="text-xs bg-slate-800/90 text-indigo-200 border border-indigo-500/40 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-medium"
            title="Switch Educator Voice & Accent"
          >
            {PRESET_VOICE_PERSONAS.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} • {p.accent.split('/')[0]}
              </option>
            ))}
          </select>

          <button
            onClick={() => setStudioOpen(true)}
            className="p-1.5 bg-indigo-900/50 hover:bg-indigo-800 text-indigo-200 border border-indigo-500/30 rounded-xl transition cursor-pointer"
            title="Customize Tone, Pitch & Cadence"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Controls & Waveform */}
      <div className="my-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          {!isPlaying || isPaused ? (
            <button
              onClick={handlePlayLessonSpeech}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-sora font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-900/40 transition-all cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isPaused ? 'Resume Lecture' : 'Listen to Educator'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-sora font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <Pause className="w-4 h-4 fill-white" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700 rounded-xl transition cursor-pointer"
            title="Stop Speech"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-slate-800/80 rounded-xl p-0.5 border border-slate-700 text-[11px] font-mono">
            {[0.8, 1.0, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => setSpeedMultiplier(rate)}
                className={`px-2 py-1 rounded-lg transition font-bold ${
                  speedMultiplier === rate ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Live Animated Audio Waveform Bars */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-950/80 rounded-xl border border-indigo-500/20">
          <span className="text-[10px] font-mono text-indigo-400 mr-1.5 uppercase font-bold">
            {isPlaying && !isPaused ? 'Live Audio' : 'Ready'}
          </span>
          <div className="flex items-center gap-1 h-7">
            {waveLevels.map((h, i) => (
              <div
                key={i}
                style={{ height: `${isPlaying && !isPaused ? h : 4}px` }}
                className={`w-1 rounded-full transition-all duration-100 ${
                  isPlaying && !isPaused ? 'bg-gradient-to-t from-emerald-400 to-indigo-400' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Ask Question / Interact Button */}
        <button
          onClick={() => setAskModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 hover:text-white border border-indigo-500/40 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0"
        >
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span>Ask Educator Live</span>
          {dialogueHistory.length > 0 && (
            <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {dialogueHistory.length}
            </span>
          )}
        </button>
      </div>

      {/* Lesson Transcript Overview */}
      {!compact && (
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
          <div className="flex items-center justify-between text-indigo-300 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              Spoken Module Briefing: <strong className="text-white">{topicTitle}</strong>
            </span>
            <span className="text-[11px] text-slate-400">
              Voice: {activePersona.name}
            </span>
          </div>
          <p className="italic text-slate-200">
            "{overviewSpeech}"
          </p>

          {keyPoints.length > 0 && (
            <div className="pt-2 border-t border-slate-800 space-y-1">
              <span className="text-[11px] font-mono uppercase text-indigo-400 font-bold block">
                Key Lesson Anchor Points:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {keyPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-300 bg-slate-900/70 p-1.5 rounded-lg border border-slate-800">
                    <span className="w-4 h-4 rounded-full bg-indigo-900 text-indigo-300 flex items-center justify-center font-mono text-[10px] shrink-0 font-bold">
                      {idx + 1}
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Mid-Lesson Interactive Checkpoint */}
      {checkpointQuestion && !compact && (
        <div className="mt-3 bg-gradient-to-r from-purple-950/50 to-indigo-950/50 p-3.5 rounded-xl border border-purple-500/30 space-y-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wide">
              Mid-Lesson Comprehension Checkpoint (Interactive)
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-white">
            {checkpointQuestion.question}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {checkpointQuestion.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isCorrect = i === checkpointQuestion.correctIndex;
              return (
                <button
                  key={i}
                  onClick={() => handleEvaluateCheckpoint(i)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? isCorrect
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/80 border-rose-500 text-rose-200'
                      : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && (
                    <span className="text-[10px] font-bold uppercase ml-2">
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {checkpointEvaluated && (
            <div className="text-xs text-purple-200 bg-purple-900/30 p-2.5 rounded-lg border border-purple-400/20 animate-fadeIn">
              <strong>Educator Insight:</strong> {checkpointQuestion.explanation}
            </div>
          )}
        </div>
      )}

      {/* Ask Question & Dialogue Modal */}
      {askModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-900 to-slate-900 border-b border-indigo-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-sora font-bold text-white">
                    Interactive Student-Educator Dialogue
                  </h3>
                  <p className="text-[11px] text-indigo-300">
                    Direct inquiry with {activePersona.name} • {topicTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAskModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72 scrollbar text-xs">
              {dialogueHistory.length === 0 ? (
                <div className="text-center py-6 text-slate-400 space-y-2">
                  <HelpCircle className="w-8 h-8 mx-auto text-indigo-400 opacity-60" />
                  <p>No questions asked yet for this topic.</p>
                  <p className="text-[11px] text-slate-500">
                    Type your question below or click a quick prompt to receive instant spoken feedback from your educator!
                  </p>
                </div>
              ) : (
                dialogueHistory.map((item) => (
                  <div key={item.id} className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-indigo-300 text-[11px]">
                      <span className="font-bold text-white">{item.studentName}</span>
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-200 font-medium">Q: "{item.questionText}"</p>
                    <div className="bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-500/20 text-indigo-100 flex items-start gap-2">
                      <Volume2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-indigo-300">{activePersona.name}: </span>
                        <span>{item.educatorResponse}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-slate-400 font-semibold shrink-0">Quick prompts:</span>
              {[
                'Can you explain this step by step?',
                'Why is this formula used here?',
                'Could you give a real-world example?',
                'How does this link to exam questions?'
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setStudentQuery(chip)}
                  className="bg-slate-800 hover:bg-slate-700 text-indigo-200 hover:text-white px-2 py-1 rounded-lg border border-slate-700 shrink-0 transition cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Question Input Form */}
            <form onSubmit={handleAskQuestion} className="p-4 bg-slate-900 border-t border-indigo-500/30 flex items-center gap-2">
              <input
                type="text"
                value={studentQuery}
                onChange={(e) => setStudentQuery(e.target.value)}
                placeholder="Type your question or concept doubt for the educator..."
                className="flex-1 bg-slate-950 border border-indigo-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="submit"
                disabled={!studentQuery.trim() || answeringQuery}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white font-sora font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Voice Customization Studio Modal */}
      {studioOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-indigo-500/30 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm sm:text-base font-sora font-bold text-white">
                  Educator Voice &amp; Tone Studio
                </h3>
              </div>
              <button onClick={() => setStudioOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Customize the speech synthesis engine to align with your personal voice, tone, and regional accent parameters.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Active Persona &amp; Accent
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_VOICE_PERSONAS.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPersona(p.id)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        activePersona.id === p.id
                          ? 'bg-indigo-900/60 border-indigo-400 text-white ring-1 ring-indigo-400'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold text-white text-xs">{p.name}</div>
                      <div className="text-[11px] text-indigo-300">{p.accent}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-slate-300">
                  <span>Vocal Pitch (Inflection & Tone):</span>
                  <span className="font-mono text-indigo-400 font-bold">{customPitch.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.35"
                  step="0.05"
                  value={customPitch}
                  onChange={(e) => setCustomPitch(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>Teaching Cadence (Speaking Speed):</span>
                  <span className="font-mono text-emerald-400 font-bold">{customRate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.3"
                  step="0.05"
                  value={customRate}
                  onChange={(e) => setCustomRate(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <span className="text-indigo-400 font-bold uppercase block">Educator Catchphrase Sample:</span>
                <p className="italic text-slate-200">
                  "{activePersona.catchphrases[0]}"
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStudioOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustomPersona}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-bold font-sora shadow-lg cursor-pointer"
              >
                Save &amp; Apply Voice Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
