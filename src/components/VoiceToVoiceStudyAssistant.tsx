import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Sparkles, X, RotateCcw, 
  Send, Bot, User, Radio, Play, Pause, ChevronDown, 
  Sliders, MessageSquare, Flame, Check, HelpCircle, ArrowRight,
  Headphones, RefreshCw, Zap
} from 'lucide-react';
import { 
  VoicePersona, 
  PRESET_VOICE_PERSONAS, 
  getActiveEducatorVoice, 
  saveActiveEducatorVoice, 
  speechEngine, 
  recordStudentInteraction 
} from '../services/educatorVoiceService';
import { generateContent } from '../services/api';
import { StudySubjectChannel } from '../types';

interface VoiceToVoiceStudyAssistantProps {
  currentStudentName: string;
  activeChannel: StudySubjectChannel;
}

interface VoiceMessageItem {
  id: string;
  sender: 'student' | 'educator';
  text: string;
  timestamp: string;
  topic?: string;
}

// Quick voice prompts mapped by subject channel
const CHANNEL_QUICK_PROMPTS: Record<string, string[]> = {
  cyber_security: [
    "What is Zero Trust Architecture and why is it essential?",
    "Can you explain Symmetric vs Asymmetric encryption with an analogy?",
    "How does a Man-in-the-Middle attack work, and how do we defend against it?",
    "Why is multi-factor authentication more secure than just passwords?"
  ],
  jss_math: [
    "Why does the sign change when moving across the equality sign?",
    "Can you explain the difference between a linear and quadratic equation?",
    "How do I find the hypotenuse using the Pythagorean theorem?",
    "What is the simplest way to calculate percentage increase?"
  ],
  computer_science: [
    "What is Big-O notation and why do we analyze time complexity?",
    "Can you explain how a binary search algorithm works?",
    "What is the difference between a stack and a queue?",
    "How does recursion work in Python with a base case?"
  ],
  cca_music: [
    "What are idiophones and how are they classified in African music?",
    "Can you explain solfa notation and tonic intervals?",
    "What role does polyrhythm play in traditional West African drumming?",
    "How does acoustic resonance work in chordophones?"
  ]
};

export const VoiceToVoiceStudyAssistant: React.FC<VoiceToVoiceStudyAssistantProps> = ({
  currentStudentName,
  activeChannel,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [continuousMode, setContinuousMode] = useState<boolean>(true);
  const [activePersona, setActivePersona] = useState<VoicePersona>(() => getActiveEducatorVoice());
  
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [manualInput, setManualInput] = useState<string>('');
  const [messages, setMessages] = useState<VoiceMessageItem[]>([
    {
      id: 'init-msg',
      sender: 'educator',
      text: `Hello ${currentStudentName || 'Scholar'}! I am ${getActiveEducatorVoice().name}, your AI Voice Educator for ${activeChannel.name}. Tap the microphone and speak your question naturally. I will listen and respond aloud in real time!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      topic: activeChannel.name
    }
  ]);

  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [micPermissionDenied, setMicPermissionDenied] = useState<boolean>(false);
  const [micAudioLevel, setMicAudioLevel] = useState<number>(0);
  const [waveLevels, setWaveLevels] = useState<number[]>([8, 14, 10, 20, 12, 16, 10, 18, 14, 8]);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll conversation into view
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking, isOpen]);

  // Audio wave animation for speaking/listening
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSpeaking || isListening) {
      interval = setInterval(() => {
        setWaveLevels(prev => prev.map(() => Math.floor(Math.random() * 28) + 6));
      }, 100);
    } else {
      setWaveLevels([6, 10, 8, 12, 8, 10, 6, 12, 8, 6]);
    }
    return () => clearInterval(interval);
  }, [isSpeaking, isListening]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
      speechEngine.stop();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Start Audio visualizer stream
  const initAudioStream = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          analyserRef.current = analyser;
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateAudioLevel = () => {
            if (analyserRef.current && isListening) {
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const average = sum / dataArray.length;
              setMicAudioLevel(Math.min(100, Math.round((average / 255) * 150)));
              animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
            }
          };
          updateAudioLevel();
        }
      }
    } catch (err) {
      console.warn('Microphone stream access notice:', err);
    }
  };

  // Start Speech Recognition
  const startListening = async () => {
    speechEngine.stop();
    setIsSpeaking(false);
    setMicPermissionDenied(false);
    setInterimTranscript('');
    setFinalTranscript('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      await initAudioStream();
    } catch (e) {
      console.warn('Audio stream init notice', e);
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = activePersona.langCode || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentFinal += transcript;
          } else {
            currentInterim += transcript;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
        }
        if (currentFinal) {
          setFinalTranscript(currentFinal);
          handleStudentQuestion(currentFinal);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech Recognition error event:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setMicPermissionDenied(true);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  // Process Student Question via AI and Voice Synthesis
  const handleStudentQuestion = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    stopListening();
    setIsThinking(true);
    setInterimTranscript('');
    setFinalTranscript('');

    const studentMsg: VoiceMessageItem = {
      id: `msg-${Date.now()}-student`,
      sender: 'student',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      topic: activeChannel.name
    };

    setMessages(prev => [...prev, studentMsg]);

    // System instruction for the voice educator
    const systemPrompt = `You are ${activePersona.name} (${activePersona.title}), a dedicated, encouraging, and highly intelligent AI educator on iLearnit-365.
You are conducting a live real-time voice-to-voice Q&A session with student "${currentStudentName}" in the subject "${activeChannel.name}" (${activeChannel.code}).
Keep your spoken answer concise, highly informative, warm, pedagogical, and easy to follow when spoken aloud (typically 2 to 4 clear sentences, without markdown stars or complicated code formatting that sounds awkward when read).
Embody the educator tone: ${activePersona.tone}.
Occasionally include your signature teaching encouragement.`;

    try {
      const aiResponse = await generateContent({
        prompt: `The student asks: "${trimmed}". Provide a direct, step-by-step, spoken educational explanation.`,
        systemInstruction: systemPrompt,
        temperature: 0.7,
      });

      const educatorAnswer = aiResponse.text.replace(/[*_#`]/g, '').trim();

      const educatorMsg: VoiceMessageItem = {
        id: `msg-${Date.now()}-educator`,
        sender: 'educator',
        text: educatorAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        topic: activeChannel.name
      };

      setMessages(prev => [...prev, educatorMsg]);
      recordStudentInteraction(currentStudentName, activeChannel.name, activeChannel.code, trimmed, educatorAnswer);

      setIsThinking(false);

      // Speak the educator response
      speechEngine.speak(educatorAnswer, activePersona, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => {
          setIsSpeaking(false);
          // If continuous conversation mode is active, prompt to listen again
          if (continuousMode && isOpen) {
            setTimeout(() => {
              startListening();
            }, 800);
          }
        }
      });

    } catch (err) {
      console.warn('AI Educator voice response error:', err);
      setIsThinking(false);
      const fallback = `That is a thoughtful inquiry regarding ${activeChannel.name}! Focus on the core theorem first: break the problem into smaller logical steps and verify each condition. Keep practicing and you will achieve total mastery!`;
      
      const educatorMsg: VoiceMessageItem = {
        id: `msg-${Date.now()}-educator`,
        sender: 'educator',
        text: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        topic: activeChannel.name
      };

      setMessages(prev => [...prev, educatorMsg]);
      speechEngine.speak(fallback, activePersona, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false)
      });
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const text = manualInput;
    setManualInput('');
    handleStudentQuestion(text);
  };

  const handleSelectPersona = (personaId: string) => {
    const found = PRESET_VOICE_PERSONAS.find(p => p.id === personaId) || PRESET_VOICE_PERSONAS[0];
    setActivePersona(found);
    saveActiveEducatorVoice(found);
    speechEngine.speak(
      `Voice switched to ${found.name}. Ready for your questions in my ${found.accent} accent.`,
      found
    );
  };

  const handleStopSpeaking = () => {
    speechEngine.stop();
    setIsSpeaking(false);
  };

  const quickPrompts = CHANNEL_QUICK_PROMPTS[activeChannel.id] || CHANNEL_QUICK_PROMPTS.cyber_security;

  return (
    <>
      {/* 🎙️ FLOATING MICROPHONE BUTTON (FAB) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group">
        
        {/* Helper Tooltip Badge */}
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 text-white text-xs font-semibold rounded-full shadow-lg border border-indigo-500/30 backdrop-blur-md animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Voice-to-Voice AI Tutor</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
        )}

        <button
          id="btn-floating-voice-educator"
          onClick={() => {
            setIsOpen(prev => !prev);
            if (!isOpen && !isListening && !isSpeaking) {
              // Open and offer quick voice start
            }
          }}
          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 ${
            isOpen
              ? 'bg-gradient-to-tr from-rose-600 to-pink-600 text-white ring-4 ring-rose-400/40 rotate-90'
              : isListening
              ? 'bg-gradient-to-tr from-rose-500 via-amber-500 to-emerald-500 text-white ring-4 ring-emerald-400/50 animate-pulse scale-105'
              : isSpeaking
              ? 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-teal-500 text-white ring-4 ring-indigo-400/40'
              : 'bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 text-white hover:scale-105 ring-4 ring-indigo-500/20'
          }`}
          title="Open Voice-to-Voice Real-Time AI Educator Session"
        >
          {isOpen ? (
            <X className="w-6 h-6 -rotate-90 transition-transform duration-300" />
          ) : isListening ? (
            <Mic className="w-7 h-7 animate-bounce text-white" />
          ) : isSpeaking ? (
            <Volume2 className="w-7 h-7 animate-pulse text-white" />
          ) : (
            <Mic className="w-7 h-7 text-white" />
          )}

          {/* Glowing Ripple Pulse Effect */}
          {(isListening || isSpeaking) && (
            <span className="absolute -inset-1.5 rounded-2xl bg-indigo-500/40 animate-ping pointer-events-none" />
          )}
        </button>
      </div>

      {/* 💬 REAL-TIME VOICE-TO-VOICE Q&A DIALOGUE OVERLAY / MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div 
            className="bg-slate-950 border border-indigo-500/30 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp text-white"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header with Educator Persona Switcher */}
            <div className="p-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-indigo-500/30 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-indigo-400/40">
                  {isListening ? (
                    <Mic className="w-6 h-6 text-emerald-300 animate-pulse" />
                  ) : isSpeaking ? (
                    <Volume2 className="w-6 h-6 text-purple-300 animate-pulse" />
                  ) : (
                    <Headphones className="w-6 h-6 text-white" />
                  )}
                  <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                    isListening ? 'bg-rose-500 animate-ping' : isSpeaking ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-900/80 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-400/30">
                      Live Voice Session
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {activeChannel.name}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-sora font-bold text-white mt-0.5">
                    {activePersona.name} <span className="text-xs text-indigo-300 font-normal">({activePersona.accent.split('/')[0]})</span>
                  </h3>
                </div>
              </div>

              {/* Persona Switcher & Close */}
              <div className="flex items-center gap-2">
                <select
                  value={activePersona.id}
                  onChange={(e) => handleSelectPersona(e.target.value)}
                  className="text-xs bg-slate-800/90 text-indigo-200 border border-indigo-500/40 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-medium"
                >
                  {PRESET_VOICE_PERSONAS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.accent.split('/')[0]})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Live Audio Visualizer Stage */}
            <div className="bg-slate-900/90 p-4 border-b border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Dynamic Status Indicator */}
              <div className="flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full ${
                  isListening 
                    ? 'bg-rose-500 animate-ping ring-4 ring-rose-500/30' 
                    : isThinking 
                    ? 'bg-amber-400 animate-spin' 
                    : isSpeaking 
                    ? 'bg-emerald-400 animate-pulse' 
                    : 'bg-slate-500'
                }`} />
                <span className="text-xs sm:text-sm font-semibold font-sora text-slate-200">
                  {isListening ? (
                    <span className="text-rose-400 flex items-center gap-1.5">
                      Listening to your voice... Speak now
                    </span>
                  ) : isThinking ? (
                    <span className="text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 animate-spin text-amber-400" /> Formulating spoken response...
                    </span>
                  ) : isSpeaking ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      Educator speaking aloud...
                    </span>
                  ) : (
                    <span className="text-slate-400">Ready for your voice inquiry</span>
                  )}
                </span>
              </div>

              {/* Sound Waveform Visualization */}
              <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-950 rounded-xl border border-indigo-500/30">
                <span className="text-[10px] font-mono text-indigo-400 mr-2 uppercase font-bold">
                  {isListening ? 'Mic' : isSpeaking ? 'Audio' : 'Idle'}
                </span>
                <div className="flex items-center gap-1 h-7">
                  {waveLevels.map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${isListening || isSpeaking ? h : 4}px` }}
                      className={`w-1 rounded-full transition-all duration-100 ${
                        isListening
                          ? 'bg-gradient-to-t from-rose-500 to-amber-400'
                          : isSpeaking
                          ? 'bg-gradient-to-t from-emerald-400 to-indigo-400'
                          : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Interrupt / Stop Button */}
              {isSpeaking && (
                <button
                  onClick={handleStopSpeaking}
                  className="px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Interrupt &amp; Ask</span>
                </button>
              )}
            </div>

            {/* Real-time Spoken Transcript or Permission Notice */}
            {micPermissionDenied && (
              <div className="p-3 bg-amber-950/60 border-b border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Microphone access was denied or blocked. You can still type your questions below, or allow microphone in your browser settings.</span>
              </div>
            )}

            {/* Interim Transcript Live Card */}
            {isListening && interimTranscript && (
              <div className="p-3 bg-indigo-950/70 border-b border-indigo-500/40 text-xs text-indigo-200 flex items-center gap-2 animate-fadeIn">
                <Radio className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
                <span className="font-mono text-[11px] text-indigo-400 uppercase font-bold">Transcribing:</span>
                <span className="italic font-medium text-white">"{interimTranscript}"</span>
              </div>
            )}

            {/* Conversation Log View */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-80 scrollbar text-xs">
              {messages.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-2.5 ${
                    item.sender === 'student' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {item.sender === 'educator' && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-md">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl space-y-1.5 shadow-md ${
                      item.sender === 'student'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] opacity-80 gap-3">
                      <span className="font-bold font-sora">
                        {item.sender === 'student' ? currentStudentName || 'You' : activePersona.name}
                      </span>
                      <span className="font-mono">{item.timestamp}</span>
                    </div>

                    <p className="leading-relaxed text-xs sm:text-sm font-medium">
                      {item.text}
                    </p>

                    {item.sender === 'educator' && (
                      <div className="pt-1.5 flex items-center gap-2 border-t border-slate-800">
                        <button
                          onClick={() => speechEngine.speak(item.text, activePersona)}
                          className="flex items-center gap-1 text-[11px] text-indigo-300 hover:text-white transition cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Replay Spoken Voice</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {item.sender === 'student' && (
                    <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shrink-0 shadow-md">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Contextual Subject Prompts */}
            <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar">
              <span className="text-slate-400 font-semibold shrink-0">Try asking:</span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleStudentQuestion(prompt)}
                  disabled={isThinking || isSpeaking}
                  className="bg-slate-900 hover:bg-slate-800 text-indigo-200 hover:text-white px-2.5 py-1 rounded-lg border border-slate-800 shrink-0 transition cursor-pointer disabled:opacity-50"
                >
                  "{prompt}"
                </button>
              ))}
            </div>

            {/* Primary Action Bar: Big Mic Button + Text Fallback */}
            <div className="p-4 bg-slate-900/90 border-t border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* Hands-Free Continuous Mode Checkbox */}
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={continuousMode}
                  onChange={(e) => setContinuousMode(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 accent-indigo-500"
                />
                <span>Continuous Voice Conversation Mode</span>
              </label>

              {/* Central Voice Capture Button */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
                {!isListening ? (
                  <button
                    onClick={startListening}
                    disabled={isThinking}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-sora font-bold text-sm rounded-2xl shadow-xl shadow-indigo-950 transition active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <Mic className="w-5 h-5" />
                    <span>Tap to Speak Question</span>
                  </button>
                ) : (
                  <button
                    onClick={stopListening}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-sora font-bold text-sm rounded-2xl shadow-xl shadow-rose-950 transition active:scale-95 cursor-pointer animate-pulse"
                  >
                    <MicOff className="w-5 h-5" />
                    <span>Done Speaking • Send</span>
                  </button>
                )}
              </div>
            </div>

            {/* Fallback Text Input Form */}
            <form onSubmit={handleManualSubmit} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Or type a question to receive spoken AI response..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="submit"
                disabled={!manualInput.trim() || isThinking}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
};
