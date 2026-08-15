import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  BookOpen, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { CyberGradeTest, CyberWeeklyLesson, CyberLessonCourse, StudentCyberTestResult } from '../types';
import { saveCyberTestResult } from '../data/cyberSecurityCurriculum';

interface CyberGradeTestModalProps {
  course: CyberLessonCourse;
  lesson: CyberWeeklyLesson;
  studentName?: string;
  onClose: () => void;
  onTestCompleted?: (result: StudentCyberTestResult) => void;
}

export const CyberGradeTestModal: React.FC<CyberGradeTestModalProps> = ({
  course,
  lesson,
  studentName = 'Student',
  onClose,
  onTestCompleted,
}) => {
  const { gradeLevelTest } = lesson;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResult, setTestResult] = useState<StudentCyberTestResult | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(gradeLevelTest.timeLimitMinutes * 60);
  const [showReview, setShowReview] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, userAnswers]);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitTest = () => {
    let score = 0;
    gradeLevelTest.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });

    const percentage = Math.round((score / gradeLevelTest.totalQuestions) * 100);
    const passed = score >= gradeLevelTest.passingScore;

    const result: StudentCyberTestResult = {
      testId: gradeLevelTest.testId,
      courseId: course.id,
      courseTitle: course.title,
      weekNumber: lesson.weekNumber,
      weekTitle: lesson.weekTitle,
      score,
      totalQuestions: gradeLevelTest.totalQuestions,
      percentage,
      passed,
      timestamp: new Date().toISOString(),
      studentName,
      answers: userAnswers,
    };

    saveCyberTestResult(result);
    setTestResult(result);
    setIsSubmitted(true);
    if (onTestCompleted) {
      onTestCompleted(result);
    }
  };

  const handleRetake = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setTestResult(null);
    setCurrentQuestionIndex(0);
    setTimeLeftSeconds(gradeLevelTest.timeLimitMinutes * 60);
    setShowReview(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = gradeLevelTest.questions[currentQuestionIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const isCurrentAnswered = userAnswers[currentQ?.id] !== undefined;

  return (
    <div id="cyber-grade-test-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 text-white px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
              <ShieldCheck className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-200 uppercase tracking-wider">
                <span>{course.code} • Week {lesson.weekNumber} Assessment</span>
                <span>•</span>
                <span>10 Questions</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold tracking-tight text-white line-clamp-1">
                {gradeLevelTest.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!isSubmitted && (
              <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold shadow-inner ${
                timeLeftSeconds < 180 ? 'bg-red-500/30 text-red-200 animate-pulse' : 'bg-white/15 text-cyan-100'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>
            )}
            <button
              id="close-cyber-test-btn"
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Close Test"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 dark:bg-slate-900/50">
          
          {/* Active Testing View */}
          {!isSubmitted && (
            <div className="space-y-6">
              {/* Progress and Question tracker */}
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">Question {currentQuestionIndex + 1}</span>
                  <span>of {gradeLevelTest.totalQuestions}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Completed:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{answeredCount}/{gradeLevelTest.totalQuestions}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentQuestionIndex + 1) / gradeLevelTest.totalQuestions) * 100}%` }}
                />
              </div>

              {/* Question Navigation Bubbles */}
              <div className="flex flex-wrap gap-2 pb-2">
                {gradeLevelTest.questions.map((q, idx) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isCurrent = idx === currentQuestionIndex;
                  return (
                    <button
                      key={q.id}
                      id={`question-bubble-${idx + 1}`}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-slate-900 shadow-md'
                          : isAnswered
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Question Card */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    Q{currentQuestionIndex + 1}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 font-mono">
                    <BookOpen className="w-3.5 h-3.5" />
                    {currentQ.outlineReference}
                  </span>
                </div>

                <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                  {currentQ.question}
                </h3>

                {/* Options List */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((option, optIdx) => {
                    const isSelected = userAnswers[currentQ.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        id={`option-${currentQ.id}-${optIdx}`}
                        onClick={() => handleSelectOption(currentQ.id, optIdx)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start space-x-3.5 ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 ring-1 ring-blue-500 shadow-sm'
                            : 'bg-slate-50/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className={`text-sm md:text-base leading-snug ${
                          isSelected
                            ? 'text-blue-900 dark:text-blue-100 font-medium'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Results Summary View */}
          {isSubmitted && testResult && !showReview && (
            <div className="space-y-6 text-center py-4">
              <div className="max-w-md mx-auto space-y-4">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg ${
                  testResult.passed 
                    ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-50 dark:ring-emerald-950/30'
                    : 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 ring-8 ring-amber-50 dark:ring-amber-950/30'
                }`}>
                  {testResult.passed ? (
                    <Award className="w-10 h-10" />
                  ) : (
                    <HelpCircle className="w-10 h-10" />
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {testResult.passed ? 'Assessment Passed! 🎉' : 'Assessment Completed'}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {testResult.passed 
                      ? 'Outstanding work! You have proven mastery of this week’s cybersecurity curriculum.'
                      : 'Good attempt! Review the questions and take the test again to earn a passing score.'}
                  </p>
                </div>

                {/* Score badge card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-xs text-slate-400 font-medium">Score</div>
                      <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{testResult.score}/{testResult.totalQuestions}</div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-xs text-slate-400 font-medium">Percentage</div>
                      <div className={`text-xl font-bold ${testResult.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {testResult.percentage}%
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="text-xs text-slate-400 font-medium">Status</div>
                      <div className={`text-sm font-bold mt-1 ${testResult.passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {testResult.passed ? 'PASSED' : 'RETRY'}
                      </div>
                    </div>
                  </div>

                  {testResult.passed && (
                    <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-left flex items-center space-x-3">
                      <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div className="text-xs text-emerald-800 dark:text-emerald-300">
                        <span className="font-semibold block">{course.badgeTitle}</span>
                        Grade-level competency credit recorded for {studentName}.
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    id="review-answers-btn"
                    onClick={() => setShowReview(true)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center space-x-2 shadow-sm transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Review All 10 Answers</span>
                  </button>
                  <button
                    id="retake-test-btn"
                    onClick={handleRetake}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm flex items-center space-x-1.5 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake Test</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Question Review Breakdown */}
          {isSubmitted && showReview && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span>Comprehensive Answer Key & Explanations</span>
                </h3>
                <button
                  id="back-to-summary-btn"
                  onClick={() => setShowReview(false)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Summary</span>
                </button>
              </div>

              <div className="space-y-4">
                {gradeLevelTest.questions.map((q, idx) => {
                  const userChoice = userAnswers[q.id];
                  const isCorrect = userChoice === q.correctAnswer;
                  return (
                    <div 
                      key={q.id}
                      id={`review-q-${q.id}`}
                      className={`p-5 rounded-xl border transition-all ${
                        isCorrect 
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                          : 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-800/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            isCorrect ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200' : 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200'
                          }`}>
                            Q{idx + 1}
                          </span>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {q.outlineReference}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {isCorrect ? (
                            <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Correct (+1)</span>
                            </span>
                          ) : (
                            <span className="flex items-center space-x-1 text-xs font-bold text-red-600 dark:text-red-400">
                              <XCircle className="w-4 h-4" />
                              <span>Incorrect</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                        {q.question}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-3">
                        {q.options.map((opt, oIdx) => {
                          const isOptionCorrect = oIdx === q.correctAnswer;
                          const wasSelectedByUser = oIdx === userChoice;
                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-lg border flex items-center space-x-2 ${
                                isOptionCorrect
                                  ? 'bg-emerald-100/70 border-emerald-300 dark:bg-emerald-900/40 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 font-medium'
                                  : wasSelectedByUser
                                  ? 'bg-red-100/70 border-red-300 dark:bg-red-900/40 dark:border-red-700 text-red-900 dark:text-red-100'
                                  : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="truncate">{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                        <span className="font-bold text-slate-800 dark:text-slate-200">Explanation: </span>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          {!isSubmitted ? (
            <>
              <button
                id="prev-question-btn"
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none flex items-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-3">
                {currentQuestionIndex < gradeLevelTest.totalQuestions - 1 ? (
                  <button
                    id="next-question-btn"
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(gradeLevelTest.totalQuestions - 1, prev + 1))}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    id="submit-test-btn"
                    onClick={handleSubmitTest}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all transform active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit 10-Question Test</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Completed on {new Date().toLocaleTimeString()}
              </span>
              <button
                id="close-completed-test-btn"
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold transition-colors"
              >
                Close & Return to Curriculum
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
