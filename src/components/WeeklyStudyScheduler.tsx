import React, { useState } from 'react';
import { 
  Calendar, 
  Sparkles, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Brain, 
  RefreshCw, 
  Printer, 
  Check, 
  Sliders, 
  Target, 
  ChevronRight, 
  Calculator, 
  Award, 
  HelpCircle,
  Lightbulb,
  GraduationCap
} from 'lucide-react';
import { JSS_MATH_CURRICULUM } from '../data/jssMathCurriculum';
import { JSSLevel, StudentDetail } from '../types';
import { generateContent } from '../services/api';

interface DailyScheduleItem {
  dayNumber: number;
  dayLabel: string;
  topicTitle: string;
  subtopic: string;
  durationMins: number;
  objective: string;
  keyRule: string;
  tasks: string[];
  practiceTask: string;
  quickQuestion: {
    question: string;
    answer: string;
  };
}

interface WeeklyPlan {
  title: string;
  level: JSSLevel;
  term: number;
  targetFocus: string;
  dailyHours: number;
  weeklyGoal: string;
  days: DailyScheduleItem[];
}

interface WeeklyStudySchedulerProps {
  student?: StudentDetail;
}

export const WeeklyStudyScheduler: React.FC<WeeklyStudySchedulerProps> = ({ student }) => {
  const [selectedLevel, setSelectedLevel] = useState<JSSLevel>(
    student?.gradeLevel && (student.gradeLevel.includes('JSS2') || student.gradeLevel.includes('Grade 8'))
      ? 'JSS2'
      : student?.gradeLevel && (student.gradeLevel.includes('JSS3') || student.gradeLevel.includes('Grade 9'))
      ? 'JSS3'
      : 'JSS1'
  );
  const [selectedTerm, setSelectedTerm] = useState<1 | 2 | 3>(1);
  const [hoursPerDay, setHoursPerDay] = useState<number>(1);
  const [focusArea, setFocusArea] = useState<'balanced' | 'weak_areas' | 'bece_prep' | 'worked_examples'>('balanced');
  const [customGoal, setCustomGoal] = useState<string>('');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [completedTaskMap, setCompletedTaskMap] = useState<Record<string, boolean>>({});
  const [showAnswerMap, setShowAnswerMap] = useState<Record<number, boolean>>({});
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);

  // Pre-populated initial weekly schedule
  const getDefaultPlan = (level: JSSLevel, term: number, hours: number): WeeklyPlan => {
    const lessons = JSS_MATH_CURRICULUM.filter(l => l.level === level);
    const primaryTopic = lessons[0] || JSS_MATH_CURRICULUM[0];
    const secondaryTopic = lessons[1] || JSS_MATH_CURRICULUM[1];

    return {
      title: `${level} Term ${term} Mathematics Weekly Study Plan`,
      level,
      term,
      targetFocus: focusArea === 'bece_prep' ? 'BECE Exam Mastery' : focusArea === 'weak_areas' ? 'Targeted Concept Reinforcement' : 'Balanced Curriculum Progress',
      dailyHours: hours,
      weeklyGoal: `Master foundational topics in ${primaryTopic.title} and ${secondaryTopic?.title || 'algebraic principles'}, completing 7 structured daily study sessions.`,
      days: [
        {
          dayNumber: 1,
          dayLabel: 'Day 1: Concept Foundation & Rules',
          topicTitle: primaryTopic.title,
          subtopic: 'Core Definitions & Fundamental Principles',
          durationMins: hours * 45,
          objective: 'Understand key terminology, symbols, and underlying mathematical principles.',
          keyRule: primaryTopic.keyFormulas[0] || 'Review foundational definitions and place values.',
          tasks: [
            'Read topic summary and copy key formulas into math notebook.',
            'Review teacher notes and highlighted worked examples.',
            'Memorize 3 essential formulas or rules.'
          ],
          practiceTask: 'Solve 3 introductory practice questions from the module.',
          quickQuestion: primaryTopic.practiceQuestions[0] || {
            question: 'What is the core rule for this topic?',
            answer: 'Refer to key formulas section in topic overview.'
          }
        },
        {
          dayNumber: 2,
          dayLabel: 'Day 2: Step-by-Step Worked Examples',
          topicTitle: primaryTopic.title,
          subtopic: 'Guided Solutions & Algebraic Steps',
          durationMins: hours * 45,
          objective: 'Analyze worked solutions and trace mathematical reasoning step-by-step.',
          keyRule: primaryTopic.keyFormulas[1] || primaryTopic.keyFormulas[0] || 'Break complex equations into manageable steps.',
          tasks: [
            'Work through Example 1 without looking at the solution first.',
            'Compare your steps with the provided model solution.',
            'Highlight tricky transposition or arithmetic signs.'
          ],
          practiceTask: 'Re-work Example 2 on clean paper and verify final answer.',
          quickQuestion: primaryTopic.practiceQuestions[1] || {
            question: 'What is step 1 in solving this category of problem?',
            answer: 'Identify known variables and choose the appropriate formula.'
          }
        },
        {
          dayNumber: 3,
          dayLabel: 'Day 3: Independent Practice Drills',
          topicTitle: primaryTopic.title,
          subtopic: 'Solo Exercise & Accuracy Speed Run',
          durationMins: hours * 45,
          objective: 'Build computational accuracy and confidence through timed practice drills.',
          keyRule: 'Double check units, positive/negative signs, and decimal alignments.',
          tasks: [
            'Set a timer for 25 minutes and attempt 5 practice questions.',
            'Check answers using the accordion reveals in JSS Math Explorer.',
            'Note down any recurring errors in your mistake log.'
          ],
          practiceTask: 'Complete Practice Questions #1 to #5.',
          quickQuestion: {
            question: 'Why is it crucial to verify units in mathematics solutions?',
            answer: 'Mismatched units (e.g. cm vs m or minutes vs hours) lead to incorrect dimensional calculations.'
          }
        },
        {
          dayNumber: 4,
          dayLabel: 'Day 4: Secondary Topic & Interconnection',
          topicTitle: secondaryTopic.title,
          subtopic: 'Expanding Knowledge to Related Modules',
          durationMins: hours * 45,
          objective: 'Connect core skills from earlier in the week to new mathematical concepts.',
          keyRule: secondaryTopic.keyFormulas[0] || 'Apply algebraic substitution across problem types.',
          tasks: [
            `Read ${secondaryTopic.title} overview and formula definitions.`,
            'Identify how earlier number principles apply here.',
            'Solve 2 introductory problems in the new topic.'
          ],
          practiceTask: `Complete 3 starter questions in ${secondaryTopic.title}.`,
          quickQuestion: secondaryTopic.practiceQuestions[0] || {
            question: 'How does this topic relate to earlier concepts?',
            answer: 'Mathematics builds sequentially; earlier algebraic rules form the basis for new theorems.'
          }
        },
        {
          dayNumber: 5,
          dayLabel: 'Day 5: Real-World Word Problems',
          topicTitle: secondaryTopic.title,
          subtopic: 'Practical Applications & Word Problems',
          durationMins: hours * 45,
          objective: 'Translate real-world English scenario descriptions into mathematical expressions.',
          keyRule: 'Translate "is" to "=", "more than" to "+", "product" to "*", and "ratio" to fraction.',
          tasks: [
            'Read each word problem twice before writing equations.',
            'Underline given quantities and draw simple diagrams where applicable.',
            'Solve 4 applied word problems.'
          ],
          practiceTask: 'Complete 3 real-world application problems in module exercises.',
          quickQuestion: {
            question: 'What is the first step in solving a word problem?',
            answer: 'Define variables for unknown quantities and translate given relationships into mathematical equations.'
          }
        },
        {
          dayNumber: 6,
          dayLabel: 'Day 6: Weekly BECE Mock Practice Test',
          topicTitle: `${level} Mixed Review`,
          subtopic: 'Timed Quiz & Self Assessment',
          durationMins: hours * 50,
          objective: 'Simulate examination conditions and evaluate weekly mastery.',
          keyRule: 'Manage your time: spending max 2 minutes per multiple choice question.',
          tasks: [
            'Enter Quiz Mode in JSS Math Explorer.',
            'Answer all questions without checking hints or solutions.',
            'Submit quiz and record your total percentage score.'
          ],
          practiceTask: 'Take the 10-question weekly self-assessment test.',
          quickQuestion: {
            question: 'What strategy should you use when stuck on an exam question?',
            answer: 'Skip and mark it, complete all easier questions first, then return to solve the difficult ones.'
          }
        },
        {
          dayNumber: 7,
          dayLabel: 'Day 7: Weekly Review & Mastery Consolidation',
          topicTitle: 'Weekly Study Consolidation',
          subtopic: 'Error Correction & Goal Setting for Next Week',
          durationMins: hours * 30,
          objective: 'Reflect on learning progress and reinforce weak areas before starting the next week.',
          keyRule: 'Active recall and teaching concepts to peers cements long-term memory.',
          tasks: [
            'Review all incorrect answers from yesterday\'s mock test.',
            'Re-write correct solutions into your mastery notebook.',
            'Explain 1 main concept to a study partner, parent, or AI tutor.'
          ],
          practiceTask: 'Summarize 3 key insights in your weekly math journal.',
          quickQuestion: {
            question: 'What is the most effective way to prevent recurring math errors?',
            answer: 'Maintain an Error Log analyzing why the mistake happened (conceptual, calculation, or reading error).'
          }
        }
      ]
    };
  };

  const [currentPlan, setCurrentPlan] = useState<WeeklyPlan>(getDefaultPlan(selectedLevel, selectedTerm, hoursPerDay));

  const toggleTaskCompleted = (dayNum: number, taskIndex: number) => {
    const key = `${dayNum}-${taskIndex}`;
    setCompletedTaskMap(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAnswerReveal = (dayNum: number) => {
    setShowAnswerMap(prev => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const handleGenerateAiSchedule = async () => {
    setIsGenerating(true);

    const relevantLessons = JSS_MATH_CURRICULUM.filter(l => l.level === selectedLevel);
    const topicTitles = relevantLessons.map(l => l.title).join(', ');

    const systemInstruction = `You are the Senior Mathematics Curriculum Specialist for iLearnit-365. 
Your task is to generate a highly detailed, 7-day personalized weekly study schedule for a ${selectedLevel} student studying ${selectedLevel} Term ${selectedTerm} Mathematics.
The study schedule must draw directly from the official curriculum topics: ${topicTitles}.
Return your output as a clean, structured JSON object adhering strictly to the JSON format.`;

    const prompt = `Generate a personalized 7-day weekly study schedule for a ${selectedLevel} student.
Student Grade: ${selectedLevel}
Term: Term ${selectedTerm}
Daily Allocated Study Time: ${hoursPerDay} hours/day
Focus Strategy: ${focusArea}
Student Custom Goal / Notes: "${customGoal || 'Prepare thoroughly for weekly quizzes and build confidence in math.'}"

Curriculum Topics Available: ${topicTitles}

Format your output EXACTLY as a raw JSON object (no markdown formatting, no code blocks) with this shape:
{
  "title": "${selectedLevel} Term ${selectedTerm} Personalized Math Schedule",
  "level": "${selectedLevel}",
  "term": ${selectedTerm},
  "targetFocus": "${focusArea}",
  "dailyHours": ${hoursPerDay},
  "weeklyGoal": "A clear, motivational 2-sentence summary of the weekly target",
  "days": [
    {
      "dayNumber": 1,
      "dayLabel": "Day 1: Title",
      "topicTitle": "Topic Name",
      "subtopic": "Specific Subtopic",
      "durationMins": ${hoursPerDay * 45},
      "objective": "Clear learning goal",
      "keyRule": "Important formula or mathematical principle",
      "tasks": ["Task 1", "Task 2", "Task 3"],
      "practiceTask": "Specific exercise task",
      "quickQuestion": {
        "question": "A relevant practice question",
        "answer": "The step-by-step answer"
      }
    }
  ]
}
Include all 7 days (Day 1 through Day 7).`;

    try {
      const res = await generateContent({
        prompt,
        systemInstruction,
        temperature: 0.5,
      });

      let parsed: WeeklyPlan | null = null;
      try {
        // Clean markdown backticks if present
        const jsonText = res.text.replace(/```json/gi, '').replace(/```/g, '').trim();
        parsed = JSON.parse(jsonText);
      } catch (parseErr) {
        console.warn('JSON parse fallback needed, attempting smart extract:', parseErr);
      }

      if (parsed && parsed.days && parsed.days.length > 0) {
        setCurrentPlan(parsed);
      } else {
        // Fallback generator with updated values
        const fallback = getDefaultPlan(selectedLevel, selectedTerm, hoursPerDay);
        fallback.weeklyGoal = `Personalized Study Plan for ${selectedLevel} Term ${selectedTerm} (${focusArea.replace('_', ' ')}): ${customGoal || 'Master core weekly competencies through daily practice.'}`;
        setCurrentPlan(fallback);
      }
    } catch (err) {
      console.error('Error generating AI schedule:', err);
      const fallback = getDefaultPlan(selectedLevel, selectedTerm, hoursPerDay);
      setCurrentPlan(fallback);
    } finally {
      setIsGenerating(false);
      setCompletedTaskMap({});
      setShowAnswerMap({});
    }
  };

  const handlePrintPlan = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${currentPlan.title}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #0F172A; }
            h1 { color: #132C54; border-bottom: 2px solid #132C54; padding-bottom: 8px; margin-bottom: 4px; }
            .subtitle { font-size: 14px; color: #475569; margin-bottom: 20px; }
            .goal-box { background: #F1F5F9; border-left: 4px solid #2F6FE0; padding: 12px 16px; margin-bottom: 24px; border-radius: 4px; }
            .day-card { border: 1px solid #CBD5E1; border-radius: 8px; padding: 16px; margin-bottom: 16px; page-break-inside: avoid; }
            .day-title { font-weight: bold; color: #132C54; font-size: 16px; margin-bottom: 4px; }
            .rule-box { background: #EFF6FF; padding: 8px 12px; font-family: monospace; font-size: 12px; border-radius: 4px; margin: 8px 0; }
            ul { margin: 4px 0 8px 20px; padding: 0; font-size: 13px; }
            li { margin-bottom: 4px; }
          </style>
        </head>
        <body>
          <h1>iLearnit-365 | ${currentPlan.title}</h1>
          <div class="subtitle">
            Student: ${student?.name || 'Junior Secondary Learner'} | Level: ${currentPlan.level} | Term: ${currentPlan.term} | Daily Study: ${currentPlan.dailyHours} hr/day
          </div>

          <div class="goal-box">
            <strong>Weekly Learning Target:</strong> ${currentPlan.weeklyGoal}
          </div>

          ${currentPlan.days.map(d => `
            <div class="day-card">
              <div class="day-title">${d.dayLabel} — ${d.topicTitle} (${d.durationMins} mins)</div>
              <div style="font-size: 12px; color: #64748B;">Subtopic: ${d.subtopic} | Goal: ${d.objective}</div>
              <div class="rule-box"><strong>Key Formula / Rule:</strong> ${d.keyRule}</div>
              <div style="font-size: 12px; font-weight: bold; margin-top: 6px;">Daily Learning Tasks:</div>
              <ul>
                ${d.tasks.map(t => `<li>[  ] ${t}</li>`).join('')}
              </ul>
              <div style="font-size: 12px;"><strong>Practice Task:</strong> ${d.practiceTask}</div>
              <div style="font-size: 12px; margin-top: 6px;"><strong>Quick Self Test:</strong> ${d.quickQuestion.question}</div>
              <div style="font-size: 12px; color: #047857; margin-top: 2px;"><em>Answer: ${d.quickQuestion.answer}</em></div>
            </div>
          `).join('')}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Calculate total weekly progress
  const totalTasks = currentPlan.days.reduce((acc, d) => acc + d.tasks.length, 0);
  const completedTasksCount = Object.values(completedTaskMap).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner & Customizer */}
      <div className="bg-gradient-to-r from-navy-deep via-navy to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-blue-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-gold" /> AI Curriculum Engine
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sora">
                Personalized Weekly Study Scheduler
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Generate a custom 7-day mathematics study plan tailored to your grade level, available daily hours, and target focus areas using the Gemini API.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handlePrintPlan}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-4 py-2.5 rounded-xl transition text-xs backdrop-blur-md cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Export / Print Plan
              </button>
            </div>
          </div>

          {/* Interactive Parameters Controls */}
          <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Level Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" /> Target Grade Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as JSSLevel)}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="JSS1">JSS1 Mathematics</option>
                <option value="JSS2">JSS2 Mathematics</option>
                <option value="JSS3">JSS3 Mathematics (BECE)</option>
              </select>
            </div>

            {/* Term Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Academic Term
              </label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(Number(e.target.value) as 1 | 2 | 3)}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value={1}>Term 1 (First Term)</option>
                <option value={2}>Term 2 (Second Term)</option>
                <option value={3}>Term 3 (Third Term)</option>
              </select>
            </div>

            {/* Daily Hours */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Daily Study Time
              </label>
              <select
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value={0.75}>45 Minutes / Day</option>
                <option value={1}>1 Hour / Day</option>
                <option value={1.5}>1.5 Hours / Day</option>
                <option value={2}>2 Hours / Day</option>
              </select>
            </div>

            {/* Focus Strategy */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-gold" /> Learning Strategy
              </label>
              <select
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value as any)}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="balanced">Balanced Curriculum Progress</option>
                <option value="weak_areas">Reinforce Weak Areas</option>
                <option value="bece_prep">BECE Exam Past Questions</option>
                <option value="worked_examples">Worked Example Drills</option>
              </select>
            </div>
          </div>

          {/* Custom Notes & Generate Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <input
              type="text"
              placeholder="e.g. 'I want to focus on Quadratic Equations, Pythagoras, and Fraction conversions this week'"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              className="flex-1 w-full bg-slate-900/80 border border-slate-700 text-white placeholder-slate-400 px-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleGenerateAiSchedule}
              disabled={isGenerating}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-amber-600 hover:opacity-90 disabled:opacity-50 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-lg cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Generating AI Schedule...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" /> Generate Custom Plan with Gemini
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Goal Summary Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-100 text-blue-800 text-xs font-mono font-bold px-2.5 py-0.5 rounded-md">
                {currentPlan.level} • Term {currentPlan.term}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <Clock className="w-3 h-3" /> {currentPlan.dailyHours} hr/day
              </span>
            </div>
            <h3 className="text-xl font-bold text-navy font-sora">
              {currentPlan.title}
            </h3>
          </div>

          {/* Progress Indicator */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 min-w-[220px]">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-600 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-gold" /> Weekly Tasks:
              </span>
              <span className="text-navy">{completedTasksCount} / {totalTasks} ({progressPercent}%)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 text-xs sm:text-sm text-blue-950 flex items-start gap-3">
          <Brain className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong>Weekly Learning Target:</strong> {currentPlan.weeklyGoal}
          </div>
        </div>
      </div>

      {/* 7-Day Interactive Day Selector & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Day Buttons Navigation Column */}
        <div className="lg:col-span-4 space-y-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" /> 7-Day Schedule
          </h4>

          {currentPlan.days.map((day, idx) => {
            const isSelected = activeDayIndex === idx;
            const dayTaskKeys = day.tasks.map((_, ti) => `${day.dayNumber}-${ti}`);
            const dayCompletedCount = dayTaskKeys.filter(k => completedTaskMap[k]).length;
            const dayDone = dayTaskKeys.length > 0 && dayCompletedCount === dayTaskKeys.length;

            return (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDayIndex(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      Day {day.dayNumber}
                    </span>
                    <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-navy'}`}>
                      {day.topicTitle}
                    </span>
                  </div>
                  <div className={`text-xs truncate ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                    {day.subtopic}
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 pt-0.5">
                  {dayDone ? (
                    <span className={`p-1 rounded-full ${isSelected ? 'bg-white text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                      {dayCompletedCount}/{day.tasks.length}
                    </span>
                  )}
                  <span className={`text-[10px] font-medium mt-1 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                    {day.durationMins}m
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Day Main Detail Card */}
        <div className="lg:col-span-8">
          {(() => {
            const currentDay = currentPlan.days[activeDayIndex] || currentPlan.days[0];
            if (!currentDay) return null;

            const isAnswerShown = showAnswerMap[currentDay.dayNumber];

            return (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                {/* Card Title & Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-blue-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-md font-mono">
                        {currentDay.dayLabel}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-600" /> Allocated: {currentDay.durationMins} minutes
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-navy font-sora">
                      {currentDay.topicTitle}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      Subtopic: {currentDay.subtopic}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        currentDay.tasks.forEach((_, ti) => {
                          const key = `${currentDay.dayNumber}-${ti}`;
                          setCompletedTaskMap(prev => ({ ...prev, [key]: true }));
                        });
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark Day Complete
                    </button>
                  </div>
                </div>

                {/* Day Objective & Formula Rule Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
                    <div className="font-bold text-navy uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-blue-600" /> Day Objective
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {currentDay.objective}
                    </p>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 space-y-1.5 font-mono">
                    <div className="font-bold text-gold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5 text-emerald-400" /> Key Formula / Rule
                    </div>
                    <p className="text-emerald-300 font-semibold text-xs leading-relaxed">
                      {currentDay.keyRule}
                    </p>
                  </div>
                </div>

                {/* Interactive Checklist Tasks */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-600" /> Interactive Daily Learning Checklist
                  </h4>

                  <div className="space-y-2">
                    {currentDay.tasks.map((task, ti) => {
                      const taskKey = `${currentDay.dayNumber}-${ti}`;
                      const isDone = !!completedTaskMap[taskKey];

                      return (
                        <div
                          key={ti}
                          onClick={() => toggleTaskCompleted(currentDay.dayNumber, ti)}
                          className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                            isDone
                              ? 'bg-emerald-50/60 border-emerald-200 text-slate-600 line-through'
                              : 'bg-white border-slate-200 hover:border-blue-300 text-slate-800'
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                            isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-medium leading-relaxed flex-1">
                            {task}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommended Practice Exercise */}
                <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs text-blue-950 space-y-1">
                  <div className="font-bold uppercase text-[10px] tracking-wider text-blue-800 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Recommended Practice Exercise
                  </div>
                  <p className="font-semibold text-blue-900">
                    {currentDay.practiceTask}
                  </p>
                </div>

                {/* Quick Self-Test Card */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-500" /> Daily Mastery Check Question
                    </div>
                    <button
                      onClick={() => toggleAnswerReveal(currentDay.dayNumber)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-white border border-slate-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
                    >
                      {isAnswerShown ? 'Hide Solution' : 'Reveal Solution'}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-800 font-sora">
                    {currentDay.quickQuestion.question}
                  </p>

                  {isAnswerShown && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs font-mono text-emerald-950 space-y-1">
                      <div className="font-bold text-emerald-900 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Model Solution:
                      </div>
                      <div>{currentDay.quickQuestion.answer}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
