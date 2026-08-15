import { CBTExamConfig, CBTGradeLevel, CBTQuestion, CyberLessonCourse, CyberWeeklyLesson } from '../types';
import { CYBER_SECURITY_CURRICULUM } from './cyberSecurityCurriculum';
import { CCA_MUSIC_CBT_EXAMS } from './ccaMusicCurriculum';

/**
 * Universal CBT Question Bank Registry for iLearnit-365
 * Multi-subject, Multi-level, Multi-class exam configurations.
 */

// Helper to convert Cyber Security weekly lessons to standard CBTExamConfig
export function convertCyberLessonToCBTConfig(
  course: CyberLessonCourse, 
  lesson: CyberWeeklyLesson
): CBTExamConfig {
  const { gradeLevelTest } = lesson;
  const cbtQuestions: CBTQuestion[] = gradeLevelTest.questions.map((q) => {
    let difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mastery' = 'Medium';
    if (q.id <= 3) difficulty = 'Easy';
    else if (q.id >= 8) difficulty = 'Hard';

    let taxonomy: 'Recall' | 'Comprehension' | 'Application' | 'Analysis' | 'Evaluation' = 'Comprehension';
    if (q.id <= 2) taxonomy = 'Recall';
    else if (q.id === 5 || q.id === 6) taxonomy = 'Application';
    else if (q.id >= 7) taxonomy = 'Analysis';

    return {
      id: `${gradeLevelTest.testId}-q${q.id}`,
      subjectId: 'cybersecurity',
      topic: lesson.weekTitle,
      difficulty,
      taxonomy,
      marks: 1,
      questionText: q.question,
      options: q.options,
      correctIndex: q.correctAnswer,
      explanation: q.explanation,
      syllabusReference: q.outlineReference,
      hint: `Review notes on ${lesson.weekTitle} (${q.outlineReference})`,
    };
  });

  let gradeLevel: CBTGradeLevel = 'Cyber_Level_1';
  if (course.level === 'level2_network_defense') gradeLevel = 'Cyber_Level_2';
  if (course.level === 'level3_ethical_hacking') gradeLevel = 'Cyber_Level_3';
  if (course.level === 'level4_cloud_incident_response') gradeLevel = 'Cyber_Level_4';

  return {
    id: gradeLevelTest.testId,
    title: `${course.code} Week ${lesson.weekNumber}: ${lesson.weekTitle}`,
    code: `${course.code}-W${lesson.weekNumber}`,
    level: gradeLevel,
    subject: 'Cybersecurity Defense',
    category: 'Cybersecurity & Computing',
    durationMinutes: gradeLevelTest.timeLimitMinutes || 15,
    totalQuestions: gradeLevelTest.totalQuestions || 10,
    passingPercentage: Math.round((gradeLevelTest.passingScore / gradeLevelTest.totalQuestions) * 100),
    allowCalculator: false,
    enableAntiCheatProctoring: true,
    shuffleQuestions: true,
    shuffleOptions: true,
    instructions: [
      'Read each question carefully before selecting your answer.',
      'You can navigate between questions using the Question Matrix grid.',
      'Flag uncertain questions for review to inspect before final submission.',
      'Switching tabs or minimizing the test window will log an infraction.'
    ],
    revisedNotesBrief: lesson.outlineSourceNotes,
    questions: cbtQuestions,
  };
}

// Universal Question Bank across other School Subjects (CCA Music, JSS Math, Basic Science, Computer Science, English)
export const UNIVERSAL_CBT_EXAMS: CBTExamConfig[] = [
  // ==================== CCA MUSIC CBT EXAMS ====================
  ...CCA_MUSIC_CBT_EXAMS,

  // ==================== JSS1 MATHEMATICS CBT ====================
  {
    id: 'jss1-math-midterm',
    title: 'JSS 1 Mathematics Comprehensive Term 1 CBT Assessment',
    code: 'MTH-JSS1-T1',
    level: 'JSS1',
    subject: 'Mathematics',
    category: 'Mathematics',
    term: 1,
    durationMinutes: 20,
    totalQuestions: 10,
    passingPercentage: 60,
    allowCalculator: true,
    enableAntiCheatProctoring: true,
    shuffleQuestions: true,
    shuffleOptions: true,
    instructions: [
      'Use the on-screen scratchpad or basic calculator for arithmetic.',
      'Show precision when computing BODMAS order of operations.',
      'All 10 questions carry equal marks (1 mark each).'
    ],
    revisedNotesBrief: 'Review Place Values (Billions, Millions, Thousands), Prime Factorization (Factor Trees), LCM & HCF, Fraction Addition/Subtraction, and Basic BODMAS Rules.',
    questions: [
      {
        id: 'jss1-m-q1',
        subjectId: 'math',
        topic: 'Number & Numeration',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'What is the place value of the digit 7 in the number 4,782,109?',
        options: ['Hundred Thousands', 'Ten Thousands', 'Millions', 'Hundreds'],
        correctIndex: 0,
        explanation: 'In 4,782,109: 4 is Millions, 7 is Hundred Thousands (700,000), 8 is Ten Thousands, 2 is Thousands, 1 is Hundreds, 0 is Tens, 9 is Units.',
        syllabusReference: 'JSS1 Math Scheme: Week 2 Place Values'
      },
      {
        id: 'jss1-m-q2',
        subjectId: 'math',
        topic: 'Factors & Multiples',
        difficulty: 'Easy',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'Find the Highest Common Factor (HCF) of 24 and 36.',
        options: ['12', '6', '18', '72'],
        correctIndex: 0,
        explanation: 'Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24. Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. The highest common factor is 12.',
        syllabusReference: 'JSS1 Math Scheme: Week 4 Factors & HCF'
      },
      {
        id: 'jss1-m-q3',
        subjectId: 'math',
        topic: 'Fractions & Decimals',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'Simplify the fraction arithmetic: 3/4 + 2/5 - 1/2.',
        options: ['13/20', '11/20', '7/10', '9/20'],
        correctIndex: 0,
        explanation: 'Find LCM of denominators 4, 5, 2 which is 20. (15/20) + (8/20) - (10/20) = (15 + 8 - 10)/20 = 13/20.',
        syllabusReference: 'JSS1 Math Scheme: Week 6 Fractions'
      },
      {
        id: 'jss1-m-q4',
        subjectId: 'math',
        topic: 'Order of Operations (BODMAS)',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'Evaluate: 18 + 12 ÷ 3 × (5 - 2).',
        options: ['30', '42', '22', '24'],
        correctIndex: 0,
        explanation: 'Following BODMAS: Brackets first: (5 - 2) = 3. Division next: 12 ÷ 3 = 4. Multiplication: 4 × 3 = 12. Addition: 18 + 12 = 30.',
        syllabusReference: 'JSS1 Math Scheme: Week 7 BODMAS'
      },
      {
        id: 'jss1-m-q5',
        subjectId: 'math',
        topic: 'Basic Algebra',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'Solve for x in the linear algebraic equation: 3x - 7 = 14.',
        options: ['x = 7', 'x = 6', 'x = 8', 'x = 21'],
        correctIndex: 0,
        explanation: 'Add 7 to both sides: 3x = 14 + 7 = 21. Divide by 3: x = 21 / 3 = 7.',
        syllabusReference: 'JSS1 Math Scheme: Week 9 Introduction to Algebra'
      },
      {
        id: 'jss1-m-q6',
        subjectId: 'math',
        topic: 'Angles & Geometry',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'What is the sum of interior angles in any Euclidean triangle?',
        options: ['180°', '360°', '90°', '270°'],
        correctIndex: 0,
        explanation: 'The interior angles of every planar triangle always sum to exactly 180 degrees.',
        syllabusReference: 'JSS1 Math Scheme: Week 10 Plane Geometry'
      },
      {
        id: 'jss1-m-q7',
        subjectId: 'math',
        topic: 'Percentages',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'Express 45 marks out of a total 60 marks as a percentage.',
        options: ['75%', '70%', '80%', '65%'],
        correctIndex: 0,
        explanation: '(45 / 60) × 100% = (3 / 4) × 100% = 75%.',
        syllabusReference: 'JSS1 Math Scheme: Week 8 Percentages'
      },
      {
        id: 'jss1-m-q8',
        subjectId: 'math',
        topic: 'Perimeter & Area',
        difficulty: 'Hard',
        taxonomy: 'Analysis',
        marks: 1,
        questionText: 'A rectangular school garden has a length of 14m and a perimeter of 48m. What is the area of the garden?',
        options: ['140 m²', '120 m²', '168 m²', '96 m²'],
        correctIndex: 0,
        explanation: 'Perimeter = 2(length + width) => 48 = 2(14 + w) => 24 = 14 + w => width = 10m. Area = length × width = 14m × 10m = 140 m².',
        syllabusReference: 'JSS1 Math Scheme: Week 11 Mensuration'
      },
      {
        id: 'jss1-m-q9',
        subjectId: 'math',
        topic: 'Statistics & Averages',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'Find the mean (average) of the following set of test scores: 12, 15, 18, 15, 20.',
        options: ['16', '15', '17', '18'],
        correctIndex: 0,
        explanation: 'Mean = Sum / Count = (12 + 15 + 18 + 15 + 20) / 5 = 80 / 5 = 16.',
        syllabusReference: 'JSS1 Math Scheme: Week 12 Data & Statistics'
      },
      {
        id: 'jss1-m-q10',
        subjectId: 'math',
        topic: 'Roman Numerals',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'What is the Hindu-Arabic value of the Roman Numeral "CLXIV"?',
        options: ['164', '144', '154', '174'],
        correctIndex: 0,
        explanation: 'C = 100, L = 50, X = 10, IV = 4. 100 + 50 + 10 + 4 = 164.',
        syllabusReference: 'JSS1 Math Scheme: Week 3 Roman Numerals'
      }
    ]
  },

  // ==================== JSS 2 MATHEMATICS CBT ====================
  {
    id: 'jss2-math-cbt',
    title: 'JSS 2 Mathematics Termly Standard CBT',
    code: 'MTH-JSS2-T1',
    level: 'JSS2',
    subject: 'Mathematics',
    category: 'Mathematics',
    term: 1,
    durationMinutes: 25,
    totalQuestions: 10,
    passingPercentage: 60,
    allowCalculator: true,
    enableAntiCheatProctoring: true,
    shuffleQuestions: true,
    shuffleOptions: true,
    instructions: [
      'Solve linear equations and geometric problems methodically.',
      'Check algebraic expansions before submitting.'
    ],
    revisedNotesBrief: 'Covers Direct/Inverse Proportion, Linear Equations in one variable, Angles on Parallel Lines, Pythagorean Theorem, and Surface Area.',
    questions: [
      {
        id: 'jss2-m-q1',
        subjectId: 'math',
        topic: 'Linear Equations',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'Solve for y: 5(y - 3) = 2y + 6.',
        options: ['y = 7', 'y = 3', 'y = 9', 'y = 5'],
        correctIndex: 0,
        explanation: 'Expand: 5y - 15 = 2y + 6. Group like terms: 5y - 2y = 6 + 15 => 3y = 21 => y = 7.',
        syllabusReference: 'JSS2 Math: Linear Equations'
      },
      {
        id: 'jss2-m-q2',
        subjectId: 'math',
        topic: 'Pythagoras Theorem',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'In a right-angled triangle, the two perpendicular sides measure 6 cm and 8 cm. What is the length of the hypotenuse?',
        options: ['10 cm', '12 cm', '14 cm', '9 cm'],
        correctIndex: 0,
        explanation: 'c² = a² + b² = 6² + 8² = 36 + 64 = 100 => c = √100 = 10 cm.',
        syllabusReference: 'JSS2 Math: Pythagoras Theorem'
      },
      {
        id: 'jss2-m-q3',
        subjectId: 'math',
        topic: 'Ratio & Proportion',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'If 6 workers can complete a painting job in 8 days, how many days will it take 4 workers working at the same pace? (Inverse proportion)',
        options: ['12 days', '10 days', '14 days', '6 days'],
        correctIndex: 0,
        explanation: 'Total worker-days = 6 × 8 = 48. Time for 4 workers = 48 / 4 = 12 days.',
        syllabusReference: 'JSS2 Math: Inverse Proportion'
      },
      {
        id: 'jss2-m-q4',
        subjectId: 'math',
        topic: 'Algebraic Factorization',
        difficulty: 'Hard',
        taxonomy: 'Analysis',
        marks: 1,
        questionText: 'Factorize completely: 12a²b - 18ab².',
        options: ['6ab(2a - 3b)', '3ab(4a - 6b)', '6a(2ab - 3b²)', '2ab(6a - 9b)'],
        correctIndex: 0,
        explanation: 'The greatest common factor is 6ab. 12a²b / 6ab = 2a, and -18ab² / 6ab = -3b. Thus 6ab(2a - 3b).',
        syllabusReference: 'JSS2 Math: Factorization'
      },
      {
        id: 'jss2-m-q5',
        subjectId: 'math',
        topic: 'Probability',
        difficulty: 'Easy',
        taxonomy: 'Comprehension',
        marks: 1,
        questionText: 'A fair 6-sided die is rolled once. What is the probability of rolling a prime number (2, 3, or 5)?',
        options: ['1/2 (50%)', '1/3 (33%)', '2/3 (66%)', '1/6 (16.7%)'],
        correctIndex: 0,
        explanation: 'Prime outcomes: {2, 3, 5} = 3 outcomes. Total outcomes = 6. Probability = 3/6 = 1/2.',
        syllabusReference: 'JSS2 Math: Simple Probability'
      },
      {
        id: 'jss2-m-q6',
        subjectId: 'math',
        topic: 'Angles on Parallel Lines',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'If two parallel lines are cut by a transversal and one interior angle is 65°, what is the value of its consecutive interior co-angle?',
        options: ['115°', '65°', '125°', '90°'],
        correctIndex: 0,
        explanation: 'Consecutive interior angles are supplementary (sum to 180°). 180° - 65° = 115°.',
        syllabusReference: 'JSS2 Math: Transversal Geometry'
      },
      {
        id: 'jss2-m-q7',
        subjectId: 'math',
        topic: 'Simple Interest',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'Calculate the Simple Interest on a principal of ₦50,000 invested at 8% per annum for 3 years.',
        options: ['₦12,000', '₦10,000', '₦15,000', '₦8,000'],
        correctIndex: 0,
        explanation: 'I = (P × R × T) / 100 = (50,000 × 8 × 3) / 100 = 500 × 24 = ₦12,000.',
        syllabusReference: 'JSS2 Math: Commercial Arithmetic'
      },
      {
        id: 'jss2-m-q8',
        subjectId: 'math',
        topic: 'Polygon Angles',
        difficulty: 'Hard',
        taxonomy: 'Analysis',
        marks: 1,
        questionText: 'What is the sum of interior angles of a regular hexagon (6-sided polygon)?',
        options: ['720°', '540°', '900°', '1080°'],
        correctIndex: 0,
        explanation: 'Sum = (n - 2) × 180° = (6 - 2) × 180° = 4 × 180° = 720°.',
        syllabusReference: 'JSS2 Math: Polygons'
      },
      {
        id: 'jss2-m-q9',
        subjectId: 'math',
        topic: 'Standard Form',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'Express 0.000452 in standard scientific index form.',
        options: ['4.52 × 10⁻⁴', '4.52 × 10⁻³', '45.2 × 10⁻⁵', '4.52 × 10⁴'],
        correctIndex: 0,
        explanation: 'Shift the decimal point 4 places to the right to place it after the first non-zero digit: 4.52 × 10⁻⁴.',
        syllabusReference: 'JSS2 Math: Standard Form'
      },
      {
        id: 'jss2-m-q10',
        subjectId: 'math',
        topic: 'Volume of Prisms',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'Calculate the volume of a cylinder with radius r = 7 cm and height h = 10 cm. (Take π = 22/7)',
        options: ['1,540 cm³', '1,450 cm³', '2,200 cm³', '770 cm³'],
        correctIndex: 0,
        explanation: 'Volume = π × r² × h = (22/7) × 7 × 7 × 10 = 22 × 7 × 10 = 1,540 cm³.',
        syllabusReference: 'JSS2 Math: Cylinder Mensuration'
      }
    ]
  },

  // ==================== JSS 3 MATHEMATICS CBT ====================
  {
    id: 'jss3-math-bece',
    title: 'JSS 3 / BECE Mathematics Mock Board CBT',
    code: 'MTH-JSS3-BECE',
    level: 'JSS3',
    subject: 'Mathematics',
    category: 'Mathematics',
    durationMinutes: 30,
    totalQuestions: 10,
    passingPercentage: 65,
    allowCalculator: true,
    enableAntiCheatProctoring: true,
    shuffleQuestions: true,
    shuffleOptions: true,
    instructions: [
      'Official Junior WAEC / BECE Mock standard questions.',
      'Manage time effectively: ~3 minutes per question.'
    ],
    revisedNotesBrief: 'Simultaneous Equations, Quadratic Equations, Trigonometric Ratios (SOH CAH TOA), Circle Geometry, and Cumulative Frequency.',
    questions: [
      {
        id: 'jss3-m-q1',
        subjectId: 'math',
        topic: 'Simultaneous Equations',
        difficulty: 'Hard',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'Solve the simultaneous equations: 2x + y = 11 and 3x - 2y = 6. What is the value of x?',
        options: ['x = 4', 'x = 3', 'x = 5', 'x = 2'],
        correctIndex: 0,
        explanation: 'Multiply equation (1) by 2: 4x + 2y = 22. Add to equation (2): (4x + 2y) + (3x - 2y) = 22 + 6 => 7x = 28 => x = 4.',
        syllabusReference: 'JSS3 BECE Math: Simultaneous Equations'
      },
      {
        id: 'jss3-m-q2',
        subjectId: 'math',
        topic: 'Quadratic Equations',
        difficulty: 'Hard',
        taxonomy: 'Analysis',
        marks: 1,
        questionText: 'Find the roots of the quadratic equation: x² - 5x + 6 = 0.',
        options: ['x = 2 and x = 3', 'x = -2 and x = -3', 'x = 1 and x = 6', 'x = -1 and x = -6'],
        correctIndex: 0,
        explanation: 'Factorize: (x - 2)(x - 3) = 0 => x - 2 = 0 or x - 3 = 0 => x = 2, 3.',
        syllabusReference: 'JSS3 BECE Math: Quadratic Equations'
      },
      {
        id: 'jss3-m-q3',
        subjectId: 'math',
        topic: 'Trigonometry (SOH CAH TOA)',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'In a right triangle with an acute angle θ, the opposite side is 5m and adjacent side is 12m. What is tan θ?',
        options: ['5/12', '12/5', '5/13', '12/13'],
        correctIndex: 0,
        explanation: 'By definition, tan θ = Opposite / Adjacent = 5 / 12.',
        syllabusReference: 'JSS3 BECE Math: Trigonometric Ratios'
      },
      {
        id: 'jss3-m-q4',
        subjectId: 'math',
        topic: 'Circle Theorems',
        difficulty: 'Medium',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'What is the angle subtended by a semicircle arc at any point on the circumference?',
        options: ['90° (Right angle)', '180°', '60°', '45°'],
        correctIndex: 0,
        explanation: 'Thales Theorem: The angle inscribed in a semicircle is always a right angle (90°).',
        syllabusReference: 'JSS3 BECE Math: Circle Geometry'
      },
      {
        id: 'jss3-m-q5',
        subjectId: 'math',
        topic: 'Variations',
        difficulty: 'Hard',
        taxonomy: 'Analysis',
        marks: 1,
        questionText: 'If y varies directly as x, and y = 24 when x = 6, find y when x = 10.',
        options: ['40', '36', '48', '30'],
        correctIndex: 0,
        explanation: 'y = kx => 24 = 6k => k = 4. When x = 10, y = 4 × 10 = 40.',
        syllabusReference: 'JSS3 BECE Math: Direct Variation'
      },
      {
        id: 'jss3-m-q6',
        subjectId: 'math',
        topic: 'Statistics (Median)',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'Find the median of the data set: 8, 3, 14, 9, 5, 12, 7.',
        options: ['8', '7', '9', '8.5'],
        correctIndex: 0,
        explanation: 'Sort data in ascending order: 3, 5, 7, 8, 9, 12, 14. The middle item (4th position) is 8.',
        syllabusReference: 'JSS3 BECE Math: Measures of Central Tendency'
      },
      {
        id: 'jss3-m-q7',
        subjectId: 'math',
        topic: 'Bearing & Vectors',
        difficulty: 'Hard',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'Convert the three-figure bearing 135° into a compass quadrant bearing.',
        options: ['S 45° E', 'N 45° E', 'S 45° W', 'N 45° W'],
        correctIndex: 0,
        explanation: '135° is in the South-East quadrant. 180° - 135° = 45° measured East of South (S 45° E).',
        syllabusReference: 'JSS3 BECE Math: Bearings'
      },
      {
        id: 'jss3-m-q8',
        subjectId: 'math',
        topic: 'Change of Subject of Formula',
        difficulty: 'Hard',
        taxonomy: 'Analysis',
        marks: 1,
        questionText: 'Make r the subject of the formula in A = πr².',
        options: ['r = √(A / π)', 'r = A / π', 'r = (A / π)²', 'r = √(A × π)'],
        correctIndex: 0,
        explanation: 'Divide both sides by π: r² = A / π. Take square root of both sides: r = √(A / π).',
        syllabusReference: 'JSS3 BECE Math: Subject of Formula'
      },
      {
        id: 'jss3-m-q9',
        subjectId: 'math',
        topic: 'Sets & Venn Diagrams',
        difficulty: 'Medium',
        taxonomy: 'Comprehension',
        marks: 1,
        questionText: 'If Set A = {2, 4, 6, 8} and Set B = {4, 8, 12, 16}, what is Set A ∩ B (Intersection)?',
        options: ['{4, 8}', '{2, 4, 6, 8, 12, 16}', '{2, 6}', '{12, 16}'],
        correctIndex: 0,
        explanation: 'Intersection represents elements common to both sets: {4, 8}.',
        syllabusReference: 'JSS3 BECE Math: Set Theory'
      },
      {
        id: 'jss3-m-q10',
        subjectId: 'math',
        topic: 'Commercial Math (Profit/Loss)',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'A trader bought a carton of books for ₦12,000 and sold it for ₦15,000. What is the percentage profit?',
        options: ['25%', '20%', '30%', '15%'],
        correctIndex: 0,
        explanation: 'Profit = ₦15,000 - ₦12,000 = ₦3,000. % Profit = (3,000 / 12,000) × 100% = 1/4 × 100% = 25%.',
        syllabusReference: 'JSS3 BECE Math: Commercial Mathematics'
      }
    ]
  },

  // ==================== COMPUTER STUDIES & DIGITAL LITERACY CBT ====================
  {
    id: 'cs-jss-cbt',
    title: 'Computer Studies & Digital Literacy Examination',
    code: 'CSC-101-CBT',
    level: 'JSS2',
    subject: 'Computer Studies',
    category: 'Cybersecurity & Computing',
    durationMinutes: 20,
    totalQuestions: 10,
    passingPercentage: 60,
    allowCalculator: false,
    enableAntiCheatProctoring: true,
    shuffleQuestions: true,
    shuffleOptions: true,
    instructions: [
      'Tests computer fundamentals, hardware, operating systems, and internet safety.',
      'Answer all questions.'
    ],
    revisedNotesBrief: 'Input/Output Devices, CPU Architecture (ALU, Control Unit), System vs Application Software, Binary Arithmetic, and Internet Protocols.',
    questions: [
      {
        id: 'csc-q1',
        subjectId: 'computer_studies',
        topic: 'Hardware & CPU',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'Which internal unit of the Central Processing Unit (CPU) executes arithmetic calculations and logical decisions?',
        options: ['Arithmetic Logic Unit (ALU)', 'Control Unit (CU)', 'Random Access Memory (RAM)', 'Hard Disk Drive'],
        correctIndex: 0,
        explanation: 'The ALU handles mathematical additions/subtractions and logical boolean comparisons.',
        syllabusReference: 'CSC Scheme: Computer Architecture'
      },
      {
        id: 'csc-q2',
        subjectId: 'computer_studies',
        topic: 'Memory Hierarchy',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'Why is RAM (Random Access Memory) described as "volatile" memory?',
        options: ['It loses all its stored data immediately when the computer is powered off', 'It is made of explosive materials', 'It cannot be upgraded', 'It only works with internet connection'],
        correctIndex: 0,
        explanation: 'Volatile memory requires electrical power to maintain its state; ROM and SSDs are non-volatile.',
        syllabusReference: 'CSC Scheme: Primary Storage'
      },
      {
        id: 'csc-q3',
        subjectId: 'computer_studies',
        topic: 'Binary Arithmetic',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'Convert the decimal number 13 into its binary (Base 2) equivalent.',
        options: ['1101₂', '1011₂', '1110₂', '1001₂'],
        correctIndex: 0,
        explanation: '13 = 8 + 4 + 0 + 1 = 2³ + 2² + 0 + 2⁰ = 1101 in binary.',
        syllabusReference: 'CSC Scheme: Number Base Systems'
      },
      {
        id: 'csc-q4',
        subjectId: 'computer_studies',
        topic: 'Software Classification',
        difficulty: 'Easy',
        taxonomy: 'Comprehension',
        marks: 1,
        questionText: 'Which of the following is an example of System Software (Operating System)?',
        options: ['Linux Ubuntu', 'Microsoft Word', 'Adobe Photoshop', 'Google Chrome Browser'],
        correctIndex: 0,
        explanation: 'Linux is an Operating System (System Software) managing hardware resources, whereas Word, Photoshop, and Chrome are Application software.',
        syllabusReference: 'CSC Scheme: Software Types'
      },
      {
        id: 'csc-q5',
        subjectId: 'computer_studies',
        topic: 'Networking & Web',
        difficulty: 'Medium',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'What does the acronym "HTTP" represent in web communication?',
        options: ['HyperText Transfer Protocol', 'High Technology Transmission Program', 'Hyperlink Terminal Testing Process', 'Home Telephone Transfer Packet'],
        correctIndex: 0,
        explanation: 'HTTP is the standard application protocol for fetching hypermedia documents on the World Wide Web.',
        syllabusReference: 'CSC Scheme: Internet Protocols'
      },
      {
        id: 'csc-q6',
        subjectId: 'computer_studies',
        topic: 'Algorithms & Flowcharts',
        difficulty: 'Medium',
        taxonomy: 'Comprehension',
        marks: 1,
        questionText: 'In standard flowchart symbols, what geometric shape is used to represent a Conditional Decision (e.g., If/Else)?',
        options: ['Diamond', 'Rectangle', 'Oval / Rounded Rectangle', 'Parallelogram'],
        correctIndex: 0,
        explanation: 'Diamonds indicate conditional branch points (Yes/No); rectangles indicate processes; ovals indicate Start/End.',
        syllabusReference: 'CSC Scheme: Algorithms & Flowcharts'
      },
      {
        id: 'csc-q7',
        subjectId: 'computer_studies',
        topic: 'Input/Output Peripherals',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'Which of the following computer devices is purely an Output device?',
        options: ['Monitor (Display Screen)', 'Optical Mouse', 'Flatbed Scanner', 'Microphone'],
        correctIndex: 0,
        explanation: 'Monitors output visual data from the computer; mouse, scanner, and microphone are input devices.',
        syllabusReference: 'CSC Scheme: I/O Hardware'
      },
      {
        id: 'csc-q8',
        subjectId: 'computer_studies',
        topic: 'Digital Storage Units',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'How many Kilobytes (KB) are there in 1 Megabyte (MB) using standard binary prefix conversion (2¹⁰)?',
        options: ['1,024 KB', '1,000 KB', '512 KB', '2,048 KB'],
        correctIndex: 0,
        explanation: 'In binary computer storage, 1 MB = 1,024 KB (2¹⁰ bytes).',
        syllabusReference: 'CSC Scheme: Units of Storage'
      },
      {
        id: 'csc-q9',
        subjectId: 'computer_studies',
        topic: 'Computer Ethics & Law',
        difficulty: 'Easy',
        taxonomy: 'Recall',
        marks: 1,
        questionText: 'What is the illegal copying, duplication, or distribution of copyrighted software called?',
        options: ['Software Piracy', 'Data Mining', 'Digital Compression', 'Firmware Flashing'],
        correctIndex: 0,
        explanation: 'Software piracy violates copyright intellectual property laws.',
        syllabusReference: 'CSC Scheme: Ethics in Computing'
      },
      {
        id: 'csc-q10',
        subjectId: 'computer_studies',
        topic: 'Spreadsheets',
        difficulty: 'Medium',
        taxonomy: 'Application',
        marks: 1,
        questionText: 'In spreadsheet applications (like Excel/Google Sheets), all mathematical formulas MUST start with which character?',
        options: ['= (Equal sign)', '# (Hash)', '$ (Dollar)', '@ (At sign)'],
        correctIndex: 0,
        explanation: 'Spreadsheets identify formulas by prefixing the cell entry with the equal sign `=`.',
        syllabusReference: 'CSC Scheme: Spreadsheet Applications'
      }
    ]
  }
];

/**
 * Aggregates all available CBT exams across Cybersecurity levels and general subjects
 */
export function getAllAvailableCBTExams(): CBTExamConfig[] {
  const cyberExams: CBTExamConfig[] = [];

  CYBER_SECURITY_CURRICULUM.forEach((course) => {
    course.weeklySchedule.forEach((lesson) => {
      cyberExams.push(convertCyberLessonToCBTConfig(course, lesson));
    });
  });

  return [...cyberExams, ...UNIVERSAL_CBT_EXAMS];
}

export function getCBTExamById(examId: string): CBTExamConfig | undefined {
  return getAllAvailableCBTExams().find((e) => e.id === examId);
}
