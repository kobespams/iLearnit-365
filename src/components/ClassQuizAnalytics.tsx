import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
} from 'recharts';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Users,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  RefreshCw,
  BarChart3,
  Calendar,
  FileSpreadsheet,
  Layers,
  BrainCircuit,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';
import { ClassGroup, StudentDetail } from '../types';
import { generateContent } from '../services/api';

interface ClassQuizAnalyticsProps {
  classes: ClassGroup[];
  students: StudentDetail[];
  selectedClassId?: string;
  onSelectClass?: (cls: ClassGroup) => void;
}

interface QuizAssessmentItem {
  id: string;
  quizNumber: string;
  title: string;
  date: string;
  topic: string;
  totalSubmissions: number;
  classAverage: number;
  medianScore: number;
  passingRate: number;
  highScore: number;
  lowScore: number;
  benchmarkTarget: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  distribution: {
    grade: string;
    range: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  competencies: {
    skill: string;
    score: number;
    benchmark: number;
  }[];
  missedQuestions: {
    qNum: number;
    prompt: string;
    missRate: number;
    misconception: string;
    remedy: string;
  }[];
}

const CLASS_QUIZ_DATA: Record<string, QuizAssessmentItem[]> = {
  all: [
    {
      id: 'q1',
      quizNumber: 'Quiz 1',
      title: 'Foundational Syntax & Data Representation',
      date: 'Week 2 (Sep 14)',
      topic: 'Variables, Conditionals & Types',
      totalSubmissions: 84,
      classAverage: 79.2,
      medianScore: 81.0,
      passingRate: 83.3,
      highScore: 100,
      lowScore: 54,
      benchmarkTarget: 80,
      difficulty: 'Easy',
      distribution: [
        { grade: 'A', range: '90-100%', count: 28, percentage: 33.3, color: '#10B981' },
        { grade: 'B', range: '80-89%', count: 32, percentage: 38.1, color: '#3B82F6' },
        { grade: 'C', range: '70-79%', count: 12, percentage: 14.3, color: '#F59E0B' },
        { grade: 'D', range: '60-69%', count: 8, percentage: 9.5, color: '#F97316' },
        { grade: 'F', range: '<60%', count: 4, percentage: 4.8, color: '#EF4444' },
      ],
      competencies: [
        { skill: 'Syntax Accuracy', score: 88, benchmark: 80 },
        { skill: 'Logic Flow', score: 78, benchmark: 80 },
        { skill: 'Type Casting', score: 74, benchmark: 80 },
        { skill: 'Tracing Outputs', score: 82, benchmark: 80 },
        { skill: 'Edge Cases', score: 68, benchmark: 80 },
      ],
      missedQuestions: [
        {
          qNum: 3,
          prompt: 'Integer overflow and 2s-complement representation boundary',
          missRate: 38,
          misconception: 'Confusing signed maximum with unsigned bit shift capacity.',
          remedy: 'Review 8-bit wrap-around number line visualization.',
        },
      ],
    },
    {
      id: 'q2',
      quizNumber: 'Quiz 2',
      title: 'Control Flow, Loops & Functions',
      date: 'Week 4 (Sep 28)',
      topic: 'Iteration & Scope Resolution',
      totalSubmissions: 84,
      classAverage: 82.6,
      medianScore: 84.5,
      passingRate: 88.1,
      highScore: 100,
      lowScore: 58,
      benchmarkTarget: 80,
      difficulty: 'Moderate',
      distribution: [
        { grade: 'A', range: '90-100%', count: 34, percentage: 40.5, color: '#10B981' },
        { grade: 'B', range: '80-89%', count: 30, percentage: 35.7, color: '#3B82F6' },
        { grade: 'C', range: '70-79%', count: 13, percentage: 15.5, color: '#F59E0B' },
        { grade: 'D', range: '60-69%', count: 5, percentage: 5.9, color: '#F97316' },
        { grade: 'F', range: '<60%', count: 2, percentage: 2.4, color: '#EF4444' },
      ],
      competencies: [
        { skill: 'Syntax Accuracy', score: 91, benchmark: 80 },
        { skill: 'Logic Flow', score: 84, benchmark: 80 },
        { skill: 'Type Casting', score: 82, benchmark: 80 },
        { skill: 'Tracing Outputs', score: 85, benchmark: 80 },
        { skill: 'Edge Cases', score: 71, benchmark: 80 },
      ],
      missedQuestions: [
        {
          qNum: 7,
          prompt: 'Pass-by-value vs pass-by-reference mutation in nested loops',
          missRate: 33,
          misconception: 'Assuming reassignment inside function modifies caller outer variable.',
          remedy: 'Use memory diagram worksheets showing stack frames vs heap.',
        },
      ],
    },
    {
      id: 'q3',
      quizNumber: 'Quiz 3',
      title: 'Recursion & Asymptotic Analysis',
      date: 'Week 6 (Oct 12)',
      topic: 'Big-O Bounds & Call Stack Trees',
      totalSubmissions: 84,
      classAverage: 77.4,
      medianScore: 78.0,
      passingRate: 80.9,
      highScore: 98,
      lowScore: 49,
      benchmarkTarget: 80,
      difficulty: 'Challenging',
      distribution: [
        { grade: 'A', range: '90-100%', count: 22, percentage: 26.2, color: '#10B981' },
        { grade: 'B', range: '80-89%', count: 29, percentage: 34.5, color: '#3B82F6' },
        { grade: 'C', range: '70-79%', count: 18, percentage: 21.4, color: '#F59E0B' },
        { grade: 'D', range: '60-69%', count: 10, percentage: 11.9, color: '#F97316' },
        { grade: 'F', range: '<60%', count: 5, percentage: 6.0, color: '#EF4444' },
      ],
      competencies: [
        { skill: 'Syntax Accuracy', score: 89, benchmark: 80 },
        { skill: 'Logic Flow', score: 76, benchmark: 80 },
        { skill: 'Type Casting', score: 80, benchmark: 80 },
        { skill: 'Tracing Outputs', score: 74, benchmark: 80 },
        { skill: 'Edge Cases', score: 62, benchmark: 80 },
      ],
      missedQuestions: [
        {
          qNum: 5,
          prompt: 'Master Theorem case 2 recurrence branch complexity T(n) = 2T(n/2) + O(n)',
          missRate: 44,
          misconception: 'Forgetting log(n) multiplication factor when work matches leaf count.',
          remedy: 'Conduct recursive tree expansion drill with work-per-level sums.',
        },
      ],
    },
    {
      id: 'q4',
      quizNumber: 'Quiz 4',
      title: 'Linear Data Structures: Stacks, Queues & Lists',
      date: 'Week 8 (Oct 26)',
      topic: 'Pointers, Linked Nodes & Amortized O(1)',
      totalSubmissions: 84,
      classAverage: 85.1,
      medianScore: 86.0,
      passingRate: 91.6,
      highScore: 100,
      lowScore: 62,
      benchmarkTarget: 80,
      difficulty: 'Moderate',
      distribution: [
        { grade: 'A', range: '90-100%', count: 39, percentage: 46.4, color: '#10B981' },
        { grade: 'B', range: '80-89%', count: 28, percentage: 33.3, color: '#3B82F6' },
        { grade: 'C', range: '70-79%', count: 11, percentage: 13.1, color: '#F59E0B' },
        { grade: 'D', range: '60-69%', count: 4, percentage: 4.8, color: '#F97316' },
        { grade: 'F', range: '<60%', count: 2, percentage: 2.4, color: '#EF4444' },
      ],
      competencies: [
        { skill: 'Syntax Accuracy', score: 94, benchmark: 80 },
        { skill: 'Logic Flow', score: 87, benchmark: 80 },
        { skill: 'Type Casting', score: 85, benchmark: 80 },
        { skill: 'Tracing Outputs', score: 88, benchmark: 80 },
        { skill: 'Edge Cases', score: 76, benchmark: 80 },
      ],
      missedQuestions: [
        {
          qNum: 8,
          prompt: 'Amortized time analysis for dynamically doubling ArrayList resizing',
          missRate: 26,
          misconception: 'Believing that array reallocation makes single insertions O(N) average.',
          remedy: 'Introduce banker’s credit accounting method for aggregate cost.',
        },
      ],
    },
    {
      id: 'q5',
      quizNumber: 'Quiz 5',
      title: 'Binary Search Trees & Heap Priority Queues',
      date: 'Week 10 (Nov 09)',
      topic: 'BST Balancing, Pre/In/Postorder & Sifting',
      totalSubmissions: 84,
      classAverage: 88.7,
      medianScore: 90.0,
      passingRate: 95.2,
      highScore: 100,
      lowScore: 68,
      benchmarkTarget: 80,
      difficulty: 'Moderate',
      distribution: [
        { grade: 'A', range: '90-100%', count: 47, percentage: 55.9, color: '#10B981' },
        { grade: 'B', range: '80-89%', count: 25, percentage: 29.8, color: '#3B82F6' },
        { grade: 'C', range: '70-79%', count: 9, percentage: 10.7, color: '#F59E0B' },
        { grade: 'D', range: '60-69%', count: 2, percentage: 2.4, color: '#F97316' },
        { grade: 'F', range: '<60%', count: 1, percentage: 1.2, color: '#EF4444' },
      ],
      competencies: [
        { skill: 'Syntax Accuracy', score: 95, benchmark: 80 },
        { skill: 'Logic Flow', score: 91, benchmark: 80 },
        { skill: 'Type Casting', score: 89, benchmark: 80 },
        { skill: 'Tracing Outputs', score: 92, benchmark: 80 },
        { skill: 'Edge Cases', score: 81, benchmark: 80 },
      ],
      missedQuestions: [
        {
          qNum: 4,
          prompt: 'AVL tree double rotation (Left-Right case) node pointer realignment',
          missRate: 21,
          misconception: 'Incorrectly updating parent pointers before child subtrees are detached.',
          remedy: 'Utilize interactive visual tree balancer animation during warm-ups.',
        },
      ],
    },
    {
      id: 'q6',
      quizNumber: 'Quiz 6',
      title: 'Graph Traversal: BFS, DFS & Shortest Paths',
      date: 'Week 12 (Nov 23)',
      topic: 'Adjacency Lists, Dijkstra & Topological Sort',
      totalSubmissions: 84,
      classAverage: 91.4,
      medianScore: 93.0,
      passingRate: 97.6,
      highScore: 100,
      lowScore: 71,
      benchmarkTarget: 80,
      difficulty: 'Challenging',
      distribution: [
        { grade: 'A', range: '90-100%', count: 56, percentage: 66.7, color: '#10B981' },
        { grade: 'B', range: '80-89%', count: 21, percentage: 25.0, color: '#3B82F6' },
        { grade: 'C', range: '70-79%', count: 5, percentage: 5.9, color: '#F59E0B' },
        { grade: 'D', range: '60-69%', count: 2, percentage: 2.4, color: '#F97316' },
        { grade: 'F', range: '<60%', count: 0, percentage: 0.0, color: '#EF4444' },
      ],
      competencies: [
        { skill: 'Syntax Accuracy', score: 97, benchmark: 80 },
        { skill: 'Logic Flow', score: 94, benchmark: 80 },
        { skill: 'Type Casting', score: 92, benchmark: 80 },
        { skill: 'Tracing Outputs', score: 95, benchmark: 80 },
        { skill: 'Edge Cases', score: 86, benchmark: 80 },
      ],
      missedQuestions: [
        {
          qNum: 9,
          prompt: 'Dijkstra shortest path with negative edge weights edge case detection',
          missRate: 18,
          misconception: 'Assuming Dijkstra works properly if all cycles are positive despite negative edges.',
          remedy: 'Contrast Dijkstra greedy assumption with Bellman-Ford DP formulation.',
        },
      ],
    },
  ],
  c1: [
    {
      id: 'c1-q1',
      quizNumber: 'Quiz 1',
      title: 'Foundational Syntax & Data Representation',
      date: 'Sep 14',
      topic: 'Variables, Conditionals & Types',
      totalSubmissions: 28,
      classAverage: 81.5,
      medianScore: 83.0,
      passingRate: 85.7,
      highScore: 100,
      lowScore: 61,
      benchmarkTarget: 80,
      difficulty: 'Easy',
      distribution: [
        { grade: 'A', range: '90-100%', count: 11, percentage: 39.3, color: '#10B981' },
        { grade: 'B', range: '80-89%', count: 11, percentage: 39.3, color: '#3B82F6' },
        { grade: 'C', range: '70-79%', count: 4, percentage: 14.3, color: '#F59E0B' },
        { grade: 'D', range: '60-69%', count: 2, percentage: 7.1, color: '#F97316' },
        { grade: 'F', range: '<60%', count: 0, percentage: 0.0, color: '#EF4444' },
      ],
      competencies: [
        { skill: 'Syntax Accuracy', score: 90, benchmark: 80 },
        { skill: 'Logic Flow', score: 81, benchmark: 80 },
        { skill: 'Type Casting', score: 76, benchmark: 80 },
        { skill: 'Tracing Outputs', score: 84, benchmark: 80 },
        { skill: 'Edge Cases', score: 72, benchmark: 80 },
      ],
      missedQuestions: [
        {
          qNum: 3,
          prompt: 'Integer overflow and bit shift boundary limits',
          missRate: 32,
          misconception: 'Confusing signed 32-bit maximums with unsigned values.',
          remedy: 'Practice signed bitwise mask tracing.',
        },
      ],
    },
    {
      id: 'c1-q2',
      quizNumber: 'Quiz 2',
      title: 'Control Flow, Loops & Functions',
      date: 'Sep 28',
      topic: 'Iteration & Scope Resolution',
      totalSubmissions: 28,
      classAverage: 84.8,
      medianScore: 86.5,
      passingRate: 89.3,
      highScore: 100,
      lowScore: 64,
      benchmarkTarget: 80,
      difficulty: 'Moderate',
      distribution: [
        { grade: 'A', range: '90-100%', count: 13, percentage: 46.4, color: '#10B981' },
        { grade: 'B', range: '80-89%', count: 10, percentage: 35.7, color: '#3B82F6' },
        { grade: 'C', range: '70-79%', count: 4, percentage: 14.3, color: '#F59E0B' },
        { grade: 'D', range: '60-69%', count: 1, percentage: 3.6, color: '#F97316' },
        { grade: 'F', range: '<60%', count: 0, percentage: 0.0, color: '#EF4444' },
      ],
      competencies: [
        { skill: 'Syntax Accuracy', score: 92, benchmark: 80 },
        { skill: 'Logic Flow', score: 86, benchmark: 80 },
        { skill: 'Type Casting', score: 84, benchmark: 80 },
        { skill: 'Tracing Outputs', score: 87, benchmark: 80 },
        { skill: 'Edge Cases', score: 75, benchmark: 80 },
      ],
      missedQuestions: [
        {
          qNum: 7,
          prompt: 'Pass-by-reference mutation within nested iteration',
          missRate: 28,
          misconception: 'Object alias mutations mistaken for shallow copies.',
          remedy: 'Introduce object memory diagrams in lecture.',
        },
      ],
    },
    {
      id: 'c1-q3',
      quizNumber: 'Quiz 3',
      title: 'Recursion & Asymptotic Analysis',
      date: 'Oct 12',
      topic: 'Big-O Bounds & Call Stack Trees',
      totalSubmissions: 28,
      classAverage: 80.2,
      medianScore: 81.0,
      passingRate: 85.7,
      highScore: 98,
      lowScore: 56,
      benchmarkTarget: 80,
      difficulty: 'Challenging',
      distribution: [
        { grade: 'A', range: '90-100%', count: 9, percentage: 32.1, color: '#10B981' },
        { grade: 'B', range: '80-89%', count: 11, percentage: 39.3, color: '#3B82F6' },
        { grade: 'C', range: '70-79%', count: 5, percentage: 17.9, color: '#F59E0B' },
        { grade: 'D', range: '60-69%', count: 2, percentage: 7.1, color: '#F97316' },
        { grade: 'F', range: '<60%', count: 1, percentage: 3.6, color: '#EF4444' },
      ],
      competencies: [
        { skill: 'Syntax Accuracy', score: 91, benchmark: 80 },
        { skill: 'Logic Flow', score: 79, benchmark: 80 },
        { skill: 'Type Casting', score: 82, benchmark: 80 },
        { skill: 'Tracing Outputs', score: 78, benchmark: 80 },
        { skill: 'Edge Cases', score: 67, benchmark: 80 },
      ],
      missedQuestions: [
        {
          qNum: 5,
          prompt: 'Master Theorem case 2 recursion expansion tree',
          missRate: 39,
          misconception: 'Neglecting log factor in balanced branching cost.',
          remedy: 'Review recursive tree summation templates.',
        },
      ],
    },
    {
      id: 'c1-q4',
      quizNumber: 'Quiz 4',
      title: 'Linear Data Structures: Stacks & Queues',
      date: 'Oct 26',
      topic: 'Pointers, Linked Nodes & Amortized O(1)',
      totalSubmissions: 28,
      classAverage: 87.6,
      medianScore: 89.0,
      passingRate: 96.4,
      highScore: 100,
      lowScore: 68,
      benchmarkTarget: 80,
      difficulty: 'Moderate',
      distribution: [
        { grade: 'A', range: '90-100%', count: 15, percentage: 53.6, color: '#10B981' },
        { grade: 'B', range: '80-89%', count: 10, percentage: 35.7, color: '#3B82F6' },
        { grade: 'C', range: '70-79%', count: 2, percentage: 7.1, color: '#F59E0B' },
        { grade: 'D', range: '60-69%', count: 1, percentage: 3.6, color: '#F97316' },
        { grade: 'F', range: '<60%', count: 0, percentage: 0.0, color: '#EF4444' },
      ],
      competencies: [
        { skill: 'Syntax Accuracy', score: 96, benchmark: 80 },
        { skill: 'Logic Flow', score: 90, benchmark: 80 },
        { skill: 'Type Casting', score: 88, benchmark: 80 },
        { skill: 'Tracing Outputs', score: 91, benchmark: 80 },
        { skill: 'Edge Cases', score: 80, benchmark: 80 },
      ],
      missedQuestions: [
        {
          qNum: 8,
          prompt: 'Amortized time analysis for dynamically resized arrays',
          missRate: 21,
          misconception: 'Treating rare resize overhead as worst-case per insertion.',
          remedy: 'Use the accounting token method.',
        },
      ],
    },
    {
      id: 'c1-q5',
      quizNumber: 'Quiz 5',
      title: 'Binary Search Trees & Heap Priority Queues',
      date: 'Nov 09',
      topic: 'BST Balancing & Inorder Traversal',
      totalSubmissions: 28,
      classAverage: 91.2,
      medianScore: 93.0,
      passingRate: 100.0,
      highScore: 100,
      lowScore: 72,
      benchmarkTarget: 80,
      difficulty: 'Moderate',
      distribution: [
        { grade: 'A', range: '90-100%', count: 18, percentage: 64.3, color: '#10B981' },
        { grade: 'B', range: '80-89%', count: 8, percentage: 28.6, color: '#3B82F6' },
        { grade: 'C', range: '70-79%', count: 2, percentage: 7.1, color: '#F59E0B' },
        { grade: 'D', range: '60-69%', count: 0, percentage: 0.0, color: '#F97316' },
        { grade: 'F', range: '<60%', count: 0, percentage: 0.0, color: '#EF4444' },
      ],
      competencies: [
        { skill: 'Syntax Accuracy', score: 97, benchmark: 80 },
        { skill: 'Logic Flow', score: 93, benchmark: 80 },
        { skill: 'Type Casting', score: 91, benchmark: 80 },
        { skill: 'Tracing Outputs', score: 94, benchmark: 80 },
        { skill: 'Edge Cases', score: 84, benchmark: 80 },
      ],
      missedQuestions: [
        {
          qNum: 4,
          prompt: 'AVL tree double rotation left-right case',
          missRate: 14,
          misconception: 'Pointer reconnect ordering.',
          remedy: 'Step-through animated node reconnects.',
        },
      ],
    },
    {
      id: 'c1-q6',
      quizNumber: 'Quiz 6',
      title: 'Graph Traversal: BFS, DFS & Shortest Paths',
      date: 'Nov 23',
      topic: 'Adjacency Lists, Dijkstra & Topological Sort',
      totalSubmissions: 28,
      classAverage: 93.8,
      medianScore: 95.0,
      passingRate: 100.0,
      highScore: 100,
      lowScore: 78,
      benchmarkTarget: 80,
      difficulty: 'Challenging',
      distribution: [
        { grade: 'A', range: '90-100%', count: 21, percentage: 75.0, color: '#10B981' },
        { grade: 'B', range: '80-89%', count: 6, percentage: 21.4, color: '#3B82F6' },
        { grade: 'C', range: '70-79%', count: 1, percentage: 3.6, color: '#F59E0B' },
        { grade: 'D', range: '60-69%', count: 0, percentage: 0.0, color: '#F97316' },
        { grade: 'F', range: '<60%', count: 0, percentage: 0.0, color: '#EF4444' },
      ],
      competencies: [
        { skill: 'Syntax Accuracy', score: 98, benchmark: 80 },
        { skill: 'Logic Flow', score: 96, benchmark: 80 },
        { skill: 'Type Casting', score: 94, benchmark: 80 },
        { skill: 'Tracing Outputs', score: 97, benchmark: 80 },
        { skill: 'Edge Cases', score: 89, benchmark: 80 },
      ],
      missedQuestions: [
        {
          qNum: 9,
          prompt: 'Dijkstra shortest path with negative edge weights detection',
          missRate: 11,
          misconception: 'Assuming greedy priority queue updates handle negative edge relaxations.',
          remedy: 'Provide counter-example directed graphs.',
        },
      ],
    },
  ],
};

export const ClassQuizAnalytics: React.FC<ClassQuizAnalyticsProps> = ({
  classes,
  students,
  selectedClassId = 'all',
  onSelectClass,
}) => {
  const [activeClassFilter, setActiveClassFilter] = useState<string>(selectedClassId);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number>(5); // default to most recent (Quiz 6)
  const [chartMetric, setChartMetric] = useState<'average' | 'passing' | 'comparison'>('average');
  
  // AI Diagnostic State
  const [aiReportLoading, setAiReportLoading] = useState(false);
  const [aiDiagnosticInsight, setAiDiagnosticInsight] = useState<string>('');

  const currentDataset = useMemo(() => {
    return CLASS_QUIZ_DATA[activeClassFilter] || CLASS_QUIZ_DATA.all;
  }, [activeClassFilter]);

  const selectedQuiz = currentDataset[selectedQuizIndex] || currentDataset[currentDataset.length - 1];

  // Aggregate stats across the recent assessments
  const aggregateMetrics = useMemo(() => {
    const latest = currentDataset[currentDataset.length - 1];
    const previous = currentDataset[currentDataset.length - 2] || currentDataset[0];
    const avgScore = (currentDataset.reduce((acc, q) => acc + q.classAverage, 0) / currentDataset.length).toFixed(1);
    const trendDelta = (latest.classAverage - previous.classAverage).toFixed(1);
    const isPositive = Number(trendDelta) >= 0;
    const avgPassingRate = (currentDataset.reduce((acc, q) => acc + q.passingRate, 0) / currentDataset.length).toFixed(1);
    const masteryPercentage = (
      (latest.distribution.filter((d) => d.grade === 'A').reduce((a, b) => a + b.count, 0) /
        latest.totalSubmissions) *
      100
    ).toFixed(1);

    return {
      latestAvg: latest.classAverage,
      avgScore,
      trendDelta,
      isPositive,
      avgPassingRate,
      masteryPercentage,
      totalSubmissions: latest.totalSubmissions,
      quizCount: currentDataset.length,
    };
  }, [currentDataset]);

  // Handle AI Performance Summary & Remediation generator
  const handleGenerateAiDiagnostic = async () => {
    setAiReportLoading(true);
    setAiDiagnosticInsight('');

    const classLabel =
      activeClassFilter === 'all'
        ? 'All Active Classes (Aggregate)'
        : classes.find((c) => c.id === activeClassFilter)?.name || 'Class Section';

    const recentAssessmentsSummary = currentDataset
      .map(
        (q) =>
          `• ${q.quizNumber} (${q.title}): Class Average: ${q.classAverage}%, Passing Rate: ${q.passingRate}%, Difficulty: ${q.difficulty}`
      )
      .join('\n');

    const lowestCompetency = [...selectedQuiz.competencies].sort((a, b) => a.score - b.score)[0];
    const mostMissedQ = selectedQuiz.missedQuestions[0];

    const prompt = `You are a Lead Instructional Coach & Education Data Specialist reviewing formative quiz performance for ${classLabel}.
Analyze these 6 recent quiz assessment trends:
${recentAssessmentsSummary}

Focus on Recent Quiz: "${selectedQuiz.title}" (Score: ${selectedQuiz.classAverage}%)
Lowest scoring competency: ${lowestCompetency.skill} (${lowestCompetency.score}% vs benchmark ${lowestCompetency.benchmark}%)
Most missed question topic: "${mostMissedQ.prompt}" (Miss rate: ${mostMissedQ.missRate}%)
Student misconception: ${mostMissedQ.misconception}

Provide a concise, high-impact Teacher Action Plan:
1. 📊 Executive Summary of Cohort Trajectory (2 bullet points)
2. 🎯 Root-Cause Pedagogical Analysis (Why students struggle on ${lowestCompetency.skill})
3. ⚡ 3 Immediate Classroom Micro-Interventions (10-minute warm-up drills or scaffolding tactics)
4. 📝 2 Targeted Practice Follow-up Questions for the next class session with model solutions.`;

    const result = await generateContent({
      prompt,
      systemInstruction: 'You are an elite academic dean and data-driven STEM educator.',
      temperature: 0.35,
    });

    setAiDiagnosticInsight(result.text);
    setAiReportLoading(false);
  };

  // Custom Recharts Tooltip
  const CustomTrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0B1D3A] text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs font-mono space-y-1.5 z-50">
          <p className="font-bold text-cyan-300 font-sora text-sm">{data.quizNumber}: {data.title}</p>
          <p className="text-slate-300">{data.date} • {data.topic}</p>
          <div className="border-t border-slate-700 my-1 pt-1.5 space-y-1">
            <p className="flex justify-between gap-4">
              <span className="text-slate-400">Class Average:</span>
              <span className="font-bold text-emerald-400">{data.classAverage}%</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-400">Median Score:</span>
              <span className="font-bold text-blue-400">{data.medianScore}%</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-400">Passing Rate:</span>
              <span className="font-bold text-amber-300">{data.passingRate}%</span>
            </p>
            <p className="flex justify-between gap-4">
              <span className="text-slate-400">Score Range:</span>
              <span className="text-slate-200">{data.lowScore}% - {data.highScore}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Controls & Filter Bar */}
      <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sora font-bold text-xl text-[#0B1D3A]">Class Performance & Assessment Analytics</h3>
              <p className="text-xs text-[#5B6A88]">
                Aggregate performance trajectory across 6 recent quiz assessments and competency mastery.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#F6F8FB] p-1 rounded-2xl border border-[#D8DFEA]">
            <button
              onClick={() => setActiveClassFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeClassFilter === 'all'
                  ? 'bg-[#0B1D3A] text-white shadow-sm'
                  : 'text-[#5B6A88] hover:text-[#0B1D3A]'
              }`}
            >
              All Classes (Aggregate)
            </button>
            {classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => {
                  setActiveClassFilter(cls.id);
                  if (onSelectClass) onSelectClass(cls);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeClassFilter === cls.id
                    ? 'bg-[#2E9B58] text-white shadow-sm'
                    : 'text-[#5B6A88] hover:text-[#0B1D3A]'
                }`}
              >
                {cls.code}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerateAiDiagnostic}
            disabled={aiReportLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-sora font-semibold px-4 py-2 rounded-2xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {aiReportLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing Trends...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Diagnostic Summary
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Latest Quiz Average */}
        <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-[#7A8AA8]">Latest Quiz Average</span>
            <span
              className={`flex items-center text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                aggregateMetrics.isPositive
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-rose-50 text-rose-600 border border-rose-200'
              }`}
            >
              {aggregateMetrics.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {aggregateMetrics.trendDelta}% vs prev
            </span>
          </div>
          <div className="mt-3">
            <div className="font-sora font-bold text-3xl text-[#0B1D3A]">{aggregateMetrics.latestAvg}%</div>
            <p className="text-xs text-[#5B6A88] mt-1">
              Benchmark Target: <span className="font-semibold text-[#0B1D3A]">80.0%</span> (+{(aggregateMetrics.latestAvg - 80).toFixed(1)}%)
            </p>
          </div>
          <div className="w-full bg-[#ECF0F6] h-1.5 rounded-full overflow-hidden mt-4">
            <div
              className="bg-[#2E9B58] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(aggregateMetrics.latestAvg, 100)}%` }}
            />
          </div>
        </div>

        {/* 6-Assessment Mean */}
        <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-[#7A8AA8]">Overall Cohort Mean</span>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold font-mono px-2 py-0.5 rounded-full border border-blue-200">
              6 Quizzes
            </span>
          </div>
          <div className="mt-3">
            <div className="font-sora font-bold text-3xl text-[#0B1D3A]">{aggregateMetrics.avgScore}%</div>
            <p className="text-xs text-[#5B6A88] mt-1">Consistent positive upward mastery slope</p>
          </div>
          <div className="w-full bg-[#ECF0F6] h-1.5 rounded-full overflow-hidden mt-4">
            <div
              className="bg-[#2F6FE0] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Number(aggregateMetrics.avgScore), 100)}%` }}
            />
          </div>
        </div>

        {/* Average Passing Rate */}
        <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-[#7A8AA8]">Passing Rate (≥70%)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="font-sora font-bold text-3xl text-[#2E9B58]">{aggregateMetrics.avgPassingRate}%</div>
            <p className="text-xs text-[#5B6A88] mt-1">82 of 84 students passing all core units</p>
          </div>
          <div className="w-full bg-[#ECF0F6] h-1.5 rounded-full overflow-hidden mt-4">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Number(aggregateMetrics.avgPassingRate), 100)}%` }}
            />
          </div>
        </div>

        {/* High Mastery Bracket */}
        <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-[#7A8AA8]">Grade A Mastery (≥90%)</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <div className="font-sora font-bold text-3xl text-indigo-700">{aggregateMetrics.masteryPercentage}%</div>
            <p className="text-xs text-[#5B6A88] mt-1">Top tier algorithmic problem-solvers</p>
          </div>
          <div className="w-full bg-[#ECF0F6] h-1.5 rounded-full overflow-hidden mt-4">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Number(aggregateMetrics.masteryPercentage), 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* AI Diagnostic Report Banner (If generated) */}
      {aiDiagnosticInsight && (
        <div className="bg-gradient-to-br from-[#0B1D3A] via-[#132C54] to-slate-900 border border-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-blue-800/60 pb-3">
            <div className="flex items-center gap-2.5">
              <BrainCircuit className="w-5 h-5 text-cyan-400" />
              <h4 className="font-sora font-bold text-base text-cyan-300">
                Gemini AI Diagnostic Performance & Intervention Blueprint
              </h4>
            </div>
            <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-cyan-300 border border-cyan-400/30 px-3 py-1 rounded-full">
              Automated Remediation
            </span>
          </div>
          <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
            {aiDiagnosticInsight}
          </div>
          <div className="text-[11px] text-slate-400 border-t border-blue-800/40 pt-3 flex items-center justify-between">
            <span>Generated from aggregate student score deviations across {currentDataset.length} assessments.</span>
            <button
              onClick={() => setAiDiagnosticInsight('')}
              className="text-cyan-400 hover:text-cyan-200 cursor-pointer font-semibold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Primary Trend Chart Section */}
      <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECF0F6] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2E9B58]" />
              <h4 className="font-sora font-bold text-lg text-[#0B1D3A]">
                Class Assessment Trend Line (Recent Quizzes)
              </h4>
            </div>
            <p className="text-xs text-[#5B6A88] mt-0.5">
              Tracking average scores, median benchmarks, and passing threshold over curriculum progression.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7A8AA8] font-mono mr-1">View Metric:</span>
            <div className="flex bg-[#F6F8FB] border border-[#D8DFEA] p-1 rounded-xl">
              <button
                onClick={() => setChartMetric('average')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  chartMetric === 'average' ? 'bg-[#2E9B58] text-white shadow-xs' : 'text-[#5B6A88] hover:text-[#0B1D3A]'
                }`}
              >
                Score Trend & Range
              </button>
              <button
                onClick={() => setChartMetric('passing')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  chartMetric === 'passing' ? 'bg-[#2F6FE0] text-white shadow-xs' : 'text-[#5B6A88] hover:text-[#0B1D3A]'
                }`}
              >
                Passing Rate %
              </button>
            </div>
          </div>
        </div>

        {/* Recharts Area / Line Chart Container */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartMetric === 'average' ? (
              <AreaChart data={currentDataset} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E9B58" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2E9B58" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="medianGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F6FE0" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2F6FE0" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F8" vertical={false} />
                <XAxis
                  dataKey="quizNumber"
                  stroke="#7A8AA8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#D8DFEA' }}
                />
                <YAxis
                  stroke="#7A8AA8"
                  fontSize={11}
                  domain={[40, 100]}
                  tickLine={false}
                  axisLine={{ stroke: '#D8DFEA' }}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip content={<CustomTrendTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="classAverage"
                  name="Class Average (%)"
                  stroke="#2E9B58"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                  activeDot={{ r: 6, fill: '#2E9B58', stroke: '#fff', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="medianScore"
                  name="Median Score (%)"
                  stroke="#2F6FE0"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#2F6FE0' }}
                />
                <Line
                  type="monotone"
                  dataKey="benchmarkTarget"
                  name="Target Benchmark (80%)"
                  stroke="#CC9A2E"
                  strokeWidth={2}
                  strokeDasharray="2 2"
                  dot={false}
                />
              </AreaChart>
            ) : (
              <LineChart data={currentDataset} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F8" vertical={false} />
                <XAxis
                  dataKey="quizNumber"
                  stroke="#7A8AA8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#D8DFEA' }}
                />
                <YAxis
                  stroke="#7A8AA8"
                  fontSize={11}
                  domain={[60, 100]}
                  tickLine={false}
                  axisLine={{ stroke: '#D8DFEA' }}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip content={<CustomTrendTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }} iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="passingRate"
                  name="Passing Rate (%)"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="highScore"
                  name="Max Cohort Score (%)"
                  stroke="#6366F1"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={{ r: 3, fill: '#6366F1' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Quick Quiz Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
          {currentDataset.map((quiz, idx) => (
            <button
              key={quiz.id}
              onClick={() => setSelectedQuizIndex(idx)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedQuizIndex === idx
                  ? 'bg-emerald-50/70 border-[#2E9B58] ring-2 ring-[#2E9B58]/20 shadow-sm'
                  : 'bg-[#F6F8FB] border-[#D8DFEA] hover:border-[#2E9B58]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-[#0B1D3A]">{quiz.quizNumber}</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    quiz.classAverage >= 85
                      ? 'bg-emerald-100 text-emerald-700'
                      : quiz.classAverage >= 75
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {quiz.classAverage}%
                </span>
              </div>
              <p className="text-[11px] font-semibold text-[#0B1D3A] truncate">{quiz.title}</p>
              <p className="text-[10px] text-[#7A8AA8] mt-0.5">{quiz.date}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Deep-Dive Grid: Grade Distribution & Skill Competency Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Selected Quiz Grade Distribution Histogram (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#D8DFEA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#ECF0F6] pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#2E9B58]">
                {selectedQuiz.quizNumber} Breakdown
              </span>
              <h4 className="font-sora font-bold text-base text-[#0B1D3A]">Score Bracket Distribution</h4>
              <p className="text-xs text-[#5B6A88]">{selectedQuiz.title} ({selectedQuiz.totalSubmissions} students)</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-[#2E9B58]">{selectedQuiz.classAverage}% Avg</span>
              <p className="text-[10px] text-[#7A8AA8]">Median: {selectedQuiz.medianScore}%</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={selectedQuiz.distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F8" vertical={false} />
                <XAxis
                  dataKey="grade"
                  stroke="#7A8AA8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#D8DFEA' }}
                  tickFormatter={(val, i) => `${val} (${selectedQuiz.distribution[i]?.range})`}
                />
                <YAxis
                  stroke="#7A8AA8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#D8DFEA' }}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${value} Students (${item.payload.percentage}%)`,
                    `Bracket ${item.payload.grade} (${item.payload.range})`,
                  ]}
                  contentStyle={{
                    backgroundColor: '#0B1D3A',
                    color: '#fff',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {selectedQuiz.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bracket legend pill row */}
          <div className="grid grid-cols-5 gap-2 pt-2 text-center text-xs">
            {selectedQuiz.distribution.map((d) => (
              <div key={d.grade} className="bg-[#F6F8FB] border border-[#D8DFEA] rounded-xl p-2">
                <span className="font-bold block" style={{ color: d.color }}>
                  Grade {d.grade}
                </span>
                <span className="text-[11px] font-mono text-[#0B1D3A] font-bold">{d.count} st</span>
                <span className="text-[9px] text-[#7A8AA8] block">{d.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Competency & Skill Mastery Radar/Bar (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#D8DFEA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#ECF0F6] pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#2F6FE0]">Learning Objectives</span>
              <h4 className="font-sora font-bold text-base text-[#0B1D3A]">Topic Competency Mastery</h4>
              <p className="text-xs text-[#5B6A88]">Sub-skill retention vs 80% mastery benchmark</p>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200 font-bold">
              {selectedQuiz.topic}
            </span>
          </div>

          {/* Competency Horizontal Progress Bars */}
          <div className="space-y-4 pt-1">
            {selectedQuiz.competencies.map((comp) => {
              const isAbove = comp.score >= comp.benchmark;
              return (
                <div key={comp.skill} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0B1D3A]">{comp.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#7A8AA8]">Target: {comp.benchmark}%</span>
                      <span
                        className={`font-mono font-bold ${
                          comp.score >= 85
                            ? 'text-emerald-600'
                            : comp.score >= 75
                            ? 'text-blue-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {comp.score}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-[#ECF0F6] h-2.5 rounded-full overflow-hidden relative">
                    {/* Benchmark mark indicator */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                      style={{ left: `${comp.benchmark}%` }}
                      title="Benchmark (80%)"
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        comp.score >= 85
                          ? 'bg-emerald-500'
                          : comp.score >= 75
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(comp.score, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Diagnostic Note / Most Missed Alert */}
          {selectedQuiz.missedQuestions.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Priority Review Area: Q{selectedQuiz.missedQuestions[0].qNum} ({selectedQuiz.missedQuestions[0].missRate}% Miss Rate)</span>
              </div>
              <p className="text-amber-900 font-medium">{selectedQuiz.missedQuestions[0].prompt}</p>
              <div className="text-[11px] text-amber-800/90 pt-1 border-t border-amber-200/50">
                <span className="font-bold text-amber-900">Recommended Action: </span>
                {selectedQuiz.missedQuestions[0].remedy}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive Assessment Ledger Table */}
      <div className="bg-white border border-[#D8DFEA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#ECF0F6] pb-4 gap-2">
          <div>
            <h4 className="font-sora font-bold text-lg text-[#0B1D3A]">Recent Quiz Assessments Summary Log</h4>
            <p className="text-xs text-[#5B6A88]">
              Formative evaluation records, submission counts, grade medians, and class difficulty indices.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 font-bold">
              100% Graded & Synced
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0B1D3A]">
            <thead>
              <tr className="border-b border-[#D8DFEA] text-[#7A8AA8] uppercase font-mono text-[10px]">
                <th className="py-3 px-4">Assessment</th>
                <th className="py-3 px-4">Topic / Focus Unit</th>
                <th className="py-3 px-4">Assigned Date</th>
                <th className="py-3 px-4 text-center">Submissions</th>
                <th className="py-3 px-4 text-center">Class Average</th>
                <th className="py-3 px-4 text-center">Median</th>
                <th className="py-3 px-4 text-center">Passing Rate</th>
                <th className="py-3 px-4 text-center">Difficulty</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECF0F6]">
              {currentDataset.map((quiz, index) => {
                const isSelected = selectedQuizIndex === index;
                return (
                  <tr
                    key={quiz.id}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-emerald-50/50 font-medium' : 'hover:bg-[#F6F8FB]'
                    }`}
                    onClick={() => setSelectedQuizIndex(index)}
                  >
                    <td className="py-3.5 px-4 font-semibold text-[#0B1D3A]">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#ECF0F6] text-[#0B1D3A] font-mono text-[10px] font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-bold text-[#0B1D3A]">{quiz.quizNumber}</p>
                          <p className="text-[10px] text-[#7A8AA8] truncate max-w-[160px]">{quiz.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#5B6A88]">{quiz.topic}</td>
                    <td className="py-3.5 px-4 text-[#7A8AA8] font-mono text-[11px]">{quiz.date}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-[#0B1D3A]">
                      {quiz.totalSubmissions} / {quiz.totalSubmissions}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[#2E9B58]">
                      {quiz.classAverage}%
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[#2F6FE0] font-semibold">
                      {quiz.medianScore}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded-full ${
                          quiz.passingRate >= 90
                            ? 'bg-emerald-50 text-emerald-700'
                            : quiz.passingRate >= 80
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {quiz.passingRate}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          quiz.difficulty === 'Easy'
                            ? 'bg-blue-50 text-blue-700'
                            : quiz.difficulty === 'Moderate'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {quiz.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedQuizIndex(index);
                        }}
                        className="text-xs font-semibold text-[#2E9B58] hover:text-green-800 cursor-pointer"
                      >
                        {isSelected ? 'Viewing' : 'Inspect'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
