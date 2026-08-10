import { JSSLessonTopic } from '../types';

export const JSS_MATH_CURRICULUM: JSSLessonTopic[] = [
  // ==================== JSS 1 LESSONS ====================
  {
    id: 'jss1-00',
    file: 'JSS1/00_INDEX_AND_TEACHER_GUIDE.txt',
    title: 'JSS1 Mathematics Curriculum & Weekly Guide',
    level: 'JSS1',
    term: 1,
    recommendedWeek: 1,
    summary: 'Master Teacher Guide for Year 1 Junior Secondary Mathematics. Outlines weekly termly learning outcomes, manipulative aids, classroom pacing, diagnostic assessments, and foundational numeracy strategies across 36 academic weeks.',
    keyFormulas: [
      'Foundational Place Values: Thousands, Hundreds, Tens, Units',
      'Order of Operations: PEMDAS / BODMAS',
      'Fraction-Decimal-Percentage Conversion Triad'
    ],
    workedExamples: [
      {
        problem: 'How should a teacher organize weekly pacing for JSS1 learners?',
        solution: 'Structure each week around 4 distinct 40-minute periods: Period 1 (Concept & Place Value), Period 2 (Guided Worked Examples), Period 3 (Peer Practice & Drills), and Period 4 (Weekly Assessment & Homework Review).'
      }
    ],
    teacherGuide: 'Pacing: 3 Terms (36 Weeks). Focus on concrete physical models (abacus, fraction strips) before abstract symbolic representation. Conduct weekly diagnostic mental math drills.',
    practiceQuestions: [
      {
        question: 'List the core topics covered in JSS1 Mathematics.',
        answer: '1. Number & Numeration, 2. Factors, Multiples & Primes, 3. Fractions, Decimals & Percentages, 4. Basic Algebra, 5. Geometry: Shapes & Angles.'
      }
    ],
    weeklySchedule: [
      {
        term: 1,
        weekNumber: 1,
        weekTitle: 'Term 1 Diagnostic & Numeration Orientation',
        focusSubtopics: ['Baseline diagnostic tests', 'Counting whole numbers to 100,000', 'Place value abacus models'],
        weeklyObjective: 'Evaluate student entry levels and establish classroom weekly math study habits.',
        teachingActivities: ['Administer 20-minute mental math diagnostic', 'Group abacus counting exercises', 'Place value flashcards'],
        weeklyAssignment: 'Complete Placement Diagnostic Worksheet #1 in workbook.',
        status: 'completed'
      },
      {
        term: 1,
        weekNumber: 2,
        weekTitle: 'Large Numbers & Expansion Notation',
        focusSubtopics: ['Writing numbers up to Billions', 'Expanded notation', 'Word-to-numeral translation'],
        weeklyObjective: 'Master reading, writing, and decomposing numbers up to 10 digits.',
        teachingActivities: ['Blackboard expanded notation breakdown', 'Interactive speed reading of large numbers'],
        weeklyAssignment: 'Write 10 specified million/billion figures in words and expanded powers.',
        status: 'current'
      }
    ]
  },
  {
    id: 'jss1-01',
    file: 'JSS1/01_Number_and_Numeration.txt',
    title: '01. Number and Numeration',
    level: 'JSS1',
    term: 1,
    recommendedWeek: 2,
    summary: 'Comprehensive study of whole numbers up to billions, place values, reading and writing large figures in words and numerals, estimation, counting techniques, and Roman Numerals up to M (1000).',
    keyFormulas: [
      'Place Value Table: Billions | Millions | Thousands | Hundreds | Tens | Units',
      'Roman Numerals: I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000',
      'Additive vs Subtraction Rule in Roman Numerals: IV = 4 (5 - 1), VI = 6 (5 + 1)'
    ],
    workedExamples: [
      {
        problem: 'Write 4,509,302 in expanded word notation and convert 1,984 to Roman Numerals.',
        solution: 'Word Notation: Four million, five hundred and nine thousand, three hundred and two.\nRoman Numerals: 1000 = M, 900 = CM, 80 = LXXX, 4 = IV -> MCMLXXXIV.'
      },
      {
        problem: 'Find the place value of digit 7 in 3,745,210.',
        solution: 'Digit 7 is in the Hundred Thousands column, representing 700,000 (Seven Hundred Thousand).'
      }
    ],
    teacherGuide: 'Emphasize place value charts on blackboards. Use Roman numeral card games for interactive student participation.',
    practiceQuestions: [
      {
        question: 'Convert 2,419 into Roman Numerals.',
        answer: 'MMCDXIX (2000 = MM, 400 = CD, 10 = X, 9 = IX)'
      },
      {
        question: 'Find the difference between the place value of 8 and 3 in 85,320.',
        answer: 'Place value of 8 = 80,000. Place value of 3 = 300. Difference = 80,000 - 300 = 79,700.'
      }
    ],
    weeklySchedule: [
      {
        term: 1,
        weekNumber: 2,
        weekTitle: 'Week 2: Place Values & Millions/Billions',
        focusSubtopics: ['Counting up to 1 Billion', 'Place value charts', 'Reading figures in words'],
        weeklyObjective: 'Identify place values of given digits and express 9-digit numbers in words and numerals.',
        teachingActivities: ['Construct physical place value charts', 'Dictation drill of financial figures'],
        weeklyAssignment: 'Exercise 1A: Questions 1 to 15 on Place Value Expansion.',
        status: 'completed'
      },
      {
        term: 1,
        weekNumber: 3,
        weekTitle: 'Week 3: Roman Numerals & Historical Systems',
        focusSubtopics: ['Basic Roman Symbols (I, V, X, L, C, D, M)', 'Additive & Subtraction Rules', 'Historical calendar dates'],
        weeklyObjective: 'Convert fluently between Hindu-Arabic numerals and Roman Numerals up to 1,000.',
        teachingActivities: ['Match-up flashcard games with Roman numerals', 'Decoding historical year inscriptions'],
        weeklyAssignment: 'Exercise 1B: Convert 20 dates and quantities to Roman numerals.',
        status: 'current'
      },
      {
        term: 1,
        weekNumber: 4,
        weekTitle: 'Week 4: Estimation & Rounding off Whole Numbers',
        focusSubtopics: ['Rounding to nearest 10, 100, 1000', 'Significant figures intro', 'Quick estimation in commerce'],
        weeklyObjective: 'Apply rounding techniques to approximate large sums in daily market transactions.',
        teachingActivities: ['Supermarket price estimation simulation', 'Rounding speed drills on blackboard'],
        weeklyAssignment: 'Weekly Quiz 1: Estimation and Roman Numerals test.',
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'jss1-02',
    file: 'JSS1/02_Factors_Multiples_and_Primes.txt',
    title: '02. Factors, Multiples, and Primes',
    level: 'JSS1',
    term: 1,
    recommendedWeek: 5,
    summary: 'Identification of prime numbers, composite numbers, Highest Common Factor (HCF), Lowest Common Multiple (LCM), factor trees, and index notation for prime factors.',
    keyFormulas: [
      'HCF = Product of common lowest prime factor powers',
      'LCM = Product of highest prime factor powers across all numbers',
      'Prime Factors of a number N: N = p1^a * p2^b * p3^c'
    ],
    workedExamples: [
      {
        problem: 'Find the HCF and LCM of 24, 36, and 60.',
        solution: 'Prime Factorizations:\n24 = 2^3 x 3\n36 = 2^2 x 3^2\n60 = 2^2 x 3 x 5\n\nHCF = 2^2 x 3 = 4 x 3 = 12.\nLCM = 2^3 x 3^2 x 5 = 8 x 9 x 5 = 360.'
      }
    ],
    teacherGuide: 'Demonstrate factor trees step-by-step. Guide students to see how LCM is used when adding fractions with different denominators.',
    practiceQuestions: [
      {
        question: 'Express 180 as a product of its prime factors in index form.',
        answer: '180 = 2^2 x 3^2 x 5'
      },
      {
        question: 'Three church bells ring at intervals of 12 mins, 15 mins, and 20 mins. If they ring together at 8:00 AM, when will they ring together next?',
        answer: 'Find LCM(12, 15, 20) = 60 minutes. They ring together again 60 minutes later at 9:00 AM.'
      }
    ],
    weeklySchedule: [
      {
        term: 1,
        weekNumber: 5,
        weekTitle: 'Week 5: Prime Numbers & Factor Trees',
        focusSubtopics: ['Prime vs Composite numbers', 'Sieve of Eratosthenes', 'Factor Trees'],
        weeklyObjective: 'Decompose composite numbers up to 500 into prime factors in index form.',
        teachingActivities: ['Interactive Sieve of Eratosthenes grid activity', 'Factor tree competition on board'],
        weeklyAssignment: 'Exercise 2A: Prime factorization of 12 numbers.',
        status: 'upcoming'
      },
      {
        term: 1,
        weekNumber: 6,
        weekTitle: 'Week 6: Highest Common Factor (HCF)',
        focusSubtopics: ['Common factors', 'Listing method vs Prime factor method', 'HCF word problems'],
        weeklyObjective: 'Determine HCF for sets of 2 and 3 numbers using index notation.',
        teachingActivities: ['Tile distribution problem solving', 'Pair work on HCF calculations'],
        weeklyAssignment: 'Exercise 2B: Solve 10 HCF word problems.',
        status: 'upcoming'
      },
      {
        term: 1,
        weekNumber: 7,
        weekTitle: 'Week 7: Lowest Common Multiple (LCM) & Applications',
        focusSubtopics: ['Multiples', 'LCM calculation methods', 'Real-world periodic event sync (bells, traffic lights)'],
        weeklyObjective: 'Solve multi-bell ringing and periodic scheduling problems using LCM.',
        teachingActivities: ['Simulated bell ringing clapping drill', 'LCM calculation relay races'],
        weeklyAssignment: 'Weekly Assignment 2: HCF & LCM word problem set.',
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'jss1-03',
    file: 'JSS1/03_Fractions_Decimals_and_Percentages.txt',
    title: '03. Fractions, Decimals, and Percentages',
    level: 'JSS1',
    term: 1,
    recommendedWeek: 8,
    summary: 'Types of fractions (proper, improper, mixed numbers), equivalence, arithmetic operations (+, -, x, ÷), decimal place values, converting between fractions, decimals, and percentages, and percentage change.',
    keyFormulas: [
      'Percentage = (Part / Whole) x 100%',
      'Percentage Increase = (Increase Amount / Original Amount) x 100%',
      'Fraction Multiplication: (a/b) x (c/d) = (a x c) / (b x d)',
      'Fraction Division: (a/b) ÷ (c/d) = (a/b) x (d/c)'
    ],
    workedExamples: [
      {
        problem: 'Simplify (3 1/3 - 1 3/4) ÷ 5/8.',
        solution: '3 1/3 = 10/3; 1 3/4 = 7/4.\n10/3 - 7/4 = (40 - 21) / 12 = 19/12.\n19/12 ÷ 5/8 = 19/12 x 8/5 = (19 x 2) / (3 x 5) = 38/15 = 2 8/15.'
      },
      {
        problem: 'A tablet price increased from $150 to $180. Calculate the percentage increase.',
        solution: 'Increase = 180 - 150 = $30.\nPercentage Increase = (30 / 150) x 100% = 1/5 x 100% = 20%.'
      }
    ],
    teacherGuide: 'Use visual pie slices or paper folding to explain equivalent fractions and decimal movement.',
    practiceQuestions: [
      {
        question: 'Convert 0.375 into a fraction in its lowest terms.',
        answer: '375/1000 = 3/8'
      },
      {
        question: 'Find 15% of $2,400.',
        answer: '(15 / 100) x 2400 = 15 x 24 = $360'
      }
    ],
    weeklySchedule: [
      {
        term: 1,
        weekNumber: 8,
        weekTitle: 'Week 8: Fraction Operations & Equivalence',
        focusSubtopics: ['Equivalent fractions', 'Addition & Subtraction of mixed numbers', 'Fraction strips'],
        weeklyObjective: 'Add and subtract mixed fractions with unlike denominators accurately.',
        teachingActivities: ['Paper folding fraction strips exercise', 'Step-by-step blackboard LCM fraction addition'],
        weeklyAssignment: 'Exercise 3A: 15 mixed fraction addition/subtraction problems.',
        status: 'upcoming'
      },
      {
        term: 1,
        weekNumber: 9,
        weekTitle: 'Week 9: Multiplication & Division of Fractions',
        focusSubtopics: ['Multiplying numerators and denominators', 'Reciprocals & Division', 'Simplification'],
        weeklyObjective: 'Perform multiplication and division of algebraic and numeric fractions.',
        teachingActivities: ['Cross-cancellation game', 'Problem solving in pairs'],
        weeklyAssignment: 'Exercise 3B: Fraction multiplication & division drills.',
        status: 'upcoming'
      },
      {
        term: 1,
        weekNumber: 10,
        weekTitle: 'Week 10: Decimals & Percentage Conversion Triad',
        focusSubtopics: ['Converting fractions to decimals and percentages', 'Percentage increase & decrease', 'Financial applications'],
        weeklyObjective: 'Seamlessly convert between the conversion triad and solve percentage profit/loss tasks.',
        teachingActivities: ['Conversion Triad Wheel activity', 'Market discount percentage calculations'],
        weeklyAssignment: 'Term 1 Revision Test: Fractions, Decimals & Percentages.',
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'jss1-04',
    file: 'JSS1/04_Basic_Algebra.txt',
    title: '04. Basic Algebra',
    level: 'JSS1',
    term: 2,
    recommendedWeek: 1,
    summary: 'Algebraic terms, variables, coefficients, constants, collecting like terms, algebraic expression evaluation, and solving simple linear equations in one unknown.',
    keyFormulas: [
      'Collecting Like Terms: 3a + 5b - a + 2b = (3a - a) + (5b + 2b) = 2a + 7b',
      'Linear Equation Form: ax + b = c  =>  x = (c - b) / a'
    ],
    workedExamples: [
      {
        problem: 'Solve for x in the linear equation: 4x - 7 = 2x + 9.',
        solution: 'Collect like terms:\n4x - 2x = 9 + 7\n2x = 16\nx = 16 / 2 = 8.'
      },
      {
        problem: 'If p = 3 and q = -2, evaluate 5p - 2q + 4.',
        solution: 'Substitute p and q:\n5(3) - 2(-2) + 4 = 15 + 4 + 4 = 23.'
      }
    ],
    teacherGuide: 'Use a balance scale metaphor for equations: whatever you do to one side of an equals sign, you must do to the other side.',
    practiceQuestions: [
      {
        question: 'Simplify 7m - 3n + 2m + 8n.',
        answer: '9m + 5n'
      },
      {
        question: 'Solve for y: 3(y - 2) = 15.',
        answer: '3y - 6 = 15 => 3y = 21 => y = 7'
      }
    ],
    weeklySchedule: [
      {
        term: 2,
        weekNumber: 1,
        weekTitle: 'Week 1: Introduction to Algebraic Variables & Terms',
        focusSubtopics: ['Variables & Constants', 'Coefficients', 'Translating English phrases to Algebra'],
        weeklyObjective: 'Understand letters as placeholder variables and translate word sentences into algebraic expressions.',
        teachingActivities: ['Word-to-algebra translation relay', 'Interactive algebra scale board demo'],
        weeklyAssignment: 'Exercise 4A: Translate 15 word phrases into algebraic expressions.',
        status: 'upcoming'
      },
      {
        term: 2,
        weekNumber: 2,
        weekTitle: 'Week 2: Collecting Like Terms & Simplification',
        focusSubtopics: ['Like vs Unlike terms', 'Addition and subtraction of algebraic terms', 'Bracket expansions'],
        weeklyObjective: 'Group and simplify expressions with multiple variables and coefficients.',
        teachingActivities: ['Color-coded grouping of like terms on whiteboard', 'Card sorting activity'],
        weeklyAssignment: 'Exercise 4B: Simplify 20 multi-term algebraic expressions.',
        status: 'upcoming'
      },
      {
        term: 2,
        weekNumber: 3,
        weekTitle: 'Week 3: Linear Equations in One Unknown',
        focusSubtopics: ['Balance scale principle', 'Transposition rules', 'Solving equations ax + b = c'],
        weeklyObjective: 'Solve linear equations in one unknown and check answers by substitution.',
        teachingActivities: ['Physical balance scale demonstration', 'Equation solving step-by-step drills'],
        weeklyAssignment: 'Weekly Quiz: Linear Equations in One Unknown.',
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'jss1-05',
    file: 'JSS1/05_Geometry_Basic_Shapes_and_Angles.txt',
    title: '05. Geometry: Basic Shapes and Angles',
    level: 'JSS1',
    term: 2,
    recommendedWeek: 4,
    summary: 'Properties of 2D plane shapes (triangles, rectangles, squares, circles, parallelograms), angles on a straight line (180°), angles at a point (360°), vertically opposite angles, and angle classification (acute, right, obtuse, reflex).',
    keyFormulas: [
      'Sum of angles on a straight line = 180°',
      'Sum of angles in a triangle = 180°',
      'Sum of angles at a point = 360°',
      'Vertically opposite angles are equal'
    ],
    workedExamples: [
      {
        problem: 'In a triangle ABC, angle A = 55° and angle B = 65°. Find angle C.',
        solution: 'Sum of angles in triangle = 180°.\nAngle C = 180° - (55° + 65°) = 180° - 120° = 60°.'
      },
      {
        problem: 'Two straight lines intersect forming vertically opposite angles (3x + 10)° and 70°. Find x.',
        solution: 'Vertically opposite angles are equal:\n3x + 10 = 70\n3x = 60\nx = 20.'
      }
    ],
    teacherGuide: 'Provide protractors and rulers. Have students measure classroom corners and draw intersecting lines on paper to verify angle rules.',
    practiceQuestions: [
      {
        question: 'Define a reflex angle and give an example.',
        answer: 'A reflex angle is an angle greater than 180° but less than 360°. Example: 245°.'
      },
      {
        question: 'Angles on a straight line are x, 2x, and 30°. Find x.',
        answer: 'x + 2x + 30 = 180 => 3x = 150 => x = 50°'
      }
    ],
    weeklySchedule: [
      {
        term: 2,
        weekNumber: 4,
        weekTitle: 'Week 4: Angle Classification & Protractor Measurement',
        focusSubtopics: ['Types of angles (acute, right, obtuse, reflex)', 'Using a protractor accurately', 'Drawing given angles'],
        weeklyObjective: 'Classify angles by degree measure and draw angles to within 1 degree accuracy.',
        teachingActivities: ['Protractor hands-on drawing workshop', 'Classroom angle hunt with paper protractors'],
        weeklyAssignment: 'Exercise 5A: Measure and draw 10 specified angles.',
        status: 'upcoming'
      },
      {
        term: 2,
        weekNumber: 5,
        weekTitle: 'Week 5: Angles on Lines & Intersecting Lines',
        focusSubtopics: ['Angles on a straight line (180°)', 'Angles at a point (360°)', 'Vertically opposite angles'],
        weeklyObjective: 'Formulate and solve algebraic equations for missing unknown angles on lines.',
        teachingActivities: ['Interactive geometry board proofs', 'Intersecting lines angle discovery drill'],
        weeklyAssignment: 'Exercise 5B: Solve 12 angle calculation figures.',
        status: 'upcoming'
      }
    ]
  },

  // ==================== JSS 2 LESSONS ====================
  {
    id: 'jss2-00',
    file: 'JSS2/00_INDEX_AND_TEACHER_GUIDE.txt',
    title: 'JSS2 Mathematics Curriculum & Weekly Guide',
    level: 'JSS2',
    term: 1,
    recommendedWeek: 1,
    summary: 'Master Teacher Guide for Year 2 Junior Secondary Mathematics. Connects foundational arithmetic to advanced geometric theorems, solid shape mensuration, base systems, and spatial trigonometry across weekly termly schedules.',
    keyFormulas: [
      'Binary Base Arithmetic Conversions',
      'Laws of Indices & Standard Scientific Notation',
      'Pythagorean Relation: a² + b² = c²'
    ],
    workedExamples: [
      {
        problem: 'What is the target learning objective for JSS2 weekly mensuration unit?',
        solution: 'Students should calculate total surface areas and volumes for cylinders, cones, and composite solid prisms using standard dimensional formulas.'
      }
    ],
    teacherGuide: 'Incorporate 3D cardboard models for solid geometry. Ensure students memorize squares from 1 to 25 for fast Pythagoras calculations.',
    practiceQuestions: [
      {
        question: 'Name the 6 core units in the JSS2 syllabus.',
        answer: '1. Number Bases, 2. Indices & Standard Form, 3. Algebraic Expressions & Equations, 4. Pythagoras Theorem, 5. Cylinder, Cone & Solids, 6. Elevation & Depression.'
      }
    ],
    weeklySchedule: [
      {
        term: 1,
        weekNumber: 1,
        weekTitle: 'Term 1 Orientation & Base System Overview',
        focusSubtopics: ['Review of JSS1 concepts', 'Introduction to Base systems', 'Binary in computing'],
        weeklyObjective: 'Establish JSS2 learning goals and introduce non-decimal counting bases.',
        teachingActivities: ['Binary light switch demonstration', 'Diagnostic review quiz'],
        weeklyAssignment: 'Read Chapter 1 on Number Bases.',
        status: 'completed'
      }
    ]
  },
  {
    id: 'jss2-01',
    file: 'JSS2/01_Number_Bases_and_Numeration.txt',
    title: '01. Number Bases and Numeration',
    level: 'JSS2',
    term: 1,
    recommendedWeek: 2,
    summary: 'Counting in Base 10 (denary), Base 2 (binary), Base 8 (octal), and converting between number bases. Addition and subtraction in base 2.',
    keyFormulas: [
      'Base N positional expansion: d_k * N^k + ... + d_1 * N^1 + d_0 * N^0',
      'Binary Addition Rules: 0+0=0, 0+1=1, 1+1=10 (write 0 carry 1), 1+1+1=11 (write 1 carry 1)'
    ],
    workedExamples: [
      {
        problem: 'Convert 11011_two to Base 10.',
        solution: '11011_2 = (1 x 2^4) + (1 x 2^3) + (0 x 2^2) + (1 x 2^1) + (1 x 2^0)\n= 16 + 8 + 0 + 2 + 1 = 27_ten.'
      },
      {
        problem: 'Convert 45_ten to Base 2 (Binary).',
        solution: '45 ÷ 2 = 22 r 1\n22 ÷ 2 = 11 r 0\n11 ÷ 2 = 5 r 1\n5 ÷ 2 = 2 r 1\n2 ÷ 2 = 1 r 0\n1 ÷ 2 = 0 r 1\nReading remainders upwards: 101101_two.'
      }
    ],
    teacherGuide: 'Relate Base 2 directly to computer science, binary logic gates, and digital circuits.',
    practiceQuestions: [
      {
        question: 'Add 1011_two and 1101_two in binary.',
        answer: '1011_2 + 1101_2 = 11000_two'
      },
      {
        question: 'Convert 53_ten to Octal (Base 8).',
        answer: '53 ÷ 8 = 6 r 5 => 65_eight'
      }
    ],
    weeklySchedule: [
      {
        term: 1,
        weekNumber: 2,
        weekTitle: 'Week 2: Base 10 to Base 2 Conversion',
        focusSubtopics: ['Positional values in base 2', 'Successive division by 2', 'Binary counting drills'],
        weeklyObjective: 'Convert integers from base 10 to base 2 and vice versa accurately.',
        teachingActivities: ['Binary card counting game', 'Successive division blackboard drills'],
        weeklyAssignment: 'Exercise 1A: 10 Base Conversions.',
        status: 'current'
      },
      {
        term: 1,
        weekNumber: 3,
        weekTitle: 'Week 3: Binary Addition & Subtraction',
        focusSubtopics: ['Binary addition carrying rules', 'Binary subtraction borrowing', 'Octal Base 8 intro'],
        weeklyObjective: 'Perform binary arithmetic operations (+ and -) fluently without converting to base 10.',
        teachingActivities: ['Binary arithmetic speed drills', 'Peer correction workshops'],
        weeklyAssignment: 'Exercise 1B: Binary addition and subtraction worksheet.',
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'jss2-02',
    file: 'JSS2/02_Indices_and_Standard_Form.txt',
    title: '02. Indices and Standard Form',
    level: 'JSS2',
    term: 1,
    recommendedWeek: 4,
    summary: 'Laws of indices (multiplication, division, power of power, zero exponent, negative exponent) and writing large and small numbers in Standard Form (Scientific Notation).',
    keyFormulas: [
      'Multiplication Law: a^m * a^n = a^(m+n)',
      'Division Law: a^m / a^n = a^(m-n)',
      'Power Law: (a^m)^n = a^(m*n)',
      'Zero Exponent: a^0 = 1 (a ≠ 0)',
      'Negative Exponent: a^(-n) = 1 / (a^n)',
      'Standard Form: A x 10^n (where 1 ≤ A < 10 and n is an integer)'
    ],
    workedExamples: [
      {
        problem: 'Simplify (4x^3 y^2) * (3x^2 y^5) ÷ (6x^4 y^3).',
        solution: 'Coefficients: (4 x 3) / 6 = 12 / 6 = 2.\nx power: 3 + 2 - 4 = 1.\ny power: 2 + 5 - 3 = 4.\nResult = 2x y^4.'
      },
      {
        problem: 'Express 0.0000458 in Standard Form.',
        solution: 'Move decimal point 5 places to the right to get 4.58.\nStandard Form = 4.58 x 10^(-5).'
      }
    ],
    teacherGuide: 'Drill the negative power rule thoroughly. Use astronomical distances and microscopic sizes as real-world standard form examples.',
    practiceQuestions: [
      {
        question: 'Evaluate 27^(2/3) x 2^(-2).',
        answer: '27^(2/3) = (∛27)^2 = 3^2 = 9. 2^(-2) = 1/4. Result = 9/4 = 2.25.'
      },
      {
        question: 'Write 3.8 x 10^6 in ordinary decimal notation.',
        answer: '3,800,000'
      }
    ],
    weeklySchedule: [
      {
        term: 1,
        weekNumber: 4,
        weekTitle: 'Week 4: Laws of Indices',
        focusSubtopics: ['Product, Quotient, and Power laws', 'Zero index law', 'Negative indices'],
        weeklyObjective: 'Apply the 5 fundamental laws of indices to simplify algebraic expressions.',
        teachingActivities: ['Index laws matching game', 'Blackboard simplification races'],
        weeklyAssignment: 'Exercise 2A: Simplify 15 indexed algebraic expressions.',
        status: 'upcoming'
      },
      {
        term: 1,
        weekNumber: 5,
        weekTitle: 'Week 5: Standard Form (Scientific Notation)',
        focusSubtopics: ['Expressing numbers A x 10^n', 'Positive vs Negative exponents', 'Micro & astronomical scales'],
        weeklyObjective: 'Convert microscopic and planetary dimensions into Standard Form.',
        teachingActivities: ['Astronomy & Microbe scale comparison presentation', 'Decimal shift drills'],
        weeklyAssignment: 'Exercise 2B: Standard Form word problem set.',
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'jss2-03',
    file: 'JSS2/03_Algebraic_Expressions_and_Equations.txt',
    title: '03. Algebraic Expressions and Equations',
    level: 'JSS2',
    term: 1,
    recommendedWeek: 6,
    summary: 'Expanding single and double brackets, factorizing simple algebraic expressions by taking out common factors, grouped terms, and solving linear equations with fractional coefficients.',
    keyFormulas: [
      'Double Bracket Expansion: (a + b)(c + d) = ac + ad + bc + bd',
      'Perfect Square Expansion: (a + b)^2 = a^2 + 2ab + b^2',
      'Difference of Two Squares: a^2 - b^2 = (a - b)(a + b)',
      'Factorization by Grouping: ax + ay + bx + by = a(x + y) + b(x + y) = (a + b)(x + y)'
    ],
    workedExamples: [
      {
        problem: 'Expand and simplify (2x - 3)(x + 5).',
        solution: '= 2x(x + 5) - 3(x + 5)\n= 2x^2 + 10x - 3x - 15\n= 2x^2 + 7x - 15.'
      },
      {
        problem: 'Solve for x: (x + 2)/3 - (x - 1)/4 = 2.',
        solution: 'LCM of 3 and 4 is 12. Multiply entire equation by 12:\n4(x + 2) - 3(x - 1) = 24\n4x + 8 - 3x + 3 = 24\nx + 11 = 24\nx = 24 - 11 = 13.'
      }
    ],
    teacherGuide: 'Encourage students to check their solutions by substituting the calculated x value back into the original equation.',
    practiceQuestions: [
      {
        question: 'Factorize completely: 6ab - 9ac + 4b - 6c.',
        answer: '3a(2b - 3c) + 2(2b - 3c) = (3a + 2)(2b - 3c)'
      },
      {
        question: 'Expand (3x - 4)^2.',
        answer: '9x^2 - 24x + 16'
      }
    ],
    weeklySchedule: [
      {
        term: 1,
        weekNumber: 6,
        weekTitle: 'Week 6: Bracket Expansions & Factorization',
        focusSubtopics: ['Single and double bracket expansions', 'Taking out common factors', 'Grouping method'],
        weeklyObjective: 'Expand binomial expressions and factorize multi-variable expressions completely.',
        teachingActivities: ['Algebraic tile grid area model demo', 'Factorization puzzle activity'],
        weeklyAssignment: 'Exercise 3A: 20 expansion and factorization problems.',
        status: 'upcoming'
      },
      {
        term: 1,
        weekNumber: 7,
        weekTitle: 'Week 7: Fractional Equations',
        focusSubtopics: ['LCM clearing technique', 'Linear equations with fractions', 'Word problems'],
        weeklyObjective: 'Solve complex linear equations containing fractional denominators.',
        teachingActivities: ['LCM equation clearing step-by-step walkthrough', 'Board solving relay'],
        weeklyAssignment: 'Weekly Quiz: Algebraic Expressions & Fractional Equations.',
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'jss2-04',
    file: 'JSS2/04_Pythagoras_Theorem.txt',
    title: '04. Pythagoras Theorem',
    level: 'JSS2',
    term: 2,
    recommendedWeek: 1,
    summary: 'The relationship between sides of a right-angled triangle, hypotenuse calculations, finding unknown legs, Pythagorean triples (3-4-5, 5-12-13, 8-15-17), and real-world distance applications.',
    keyFormulas: [
      'Pythagoras Theorem: a^2 + b^2 = c^2 (where c is hypotenuse)',
      'Hypotenuse: c = √(a^2 + b^2)',
      'Leg a: a = √(c^2 - b^2)'
    ],
    workedExamples: [
      {
        problem: 'A ladder of length 13m leans against a vertical wall. If the base of the ladder is 5m away from the wall, how high up the wall does the ladder reach?',
        solution: 'Let height = h.\nh^2 + 5^2 = 13^2\nh^2 + 25 = 169\nh^2 = 169 - 25 = 144\nh = √144 = 12 meters.'
      }
    ],
    teacherGuide: 'Draw right triangles in various orientations on the board so students identify the hypotenuse opposite the 90° angle regardless of rotation.',
    practiceQuestions: [
      {
        question: 'Find the hypotenuse of a right triangle with legs 9 cm and 12 cm.',
        answer: 'c^2 = 9^2 + 12^2 = 81 + 144 = 225 => c = √225 = 15 cm'
      },
      {
        question: 'Verify if sides 7 cm, 24 cm, and 25 cm form a right triangle.',
        answer: '7^2 + 24^2 = 49 + 576 = 625. 25^2 = 625. Yes, it is a right-angled triangle.'
      }
    ],
    weeklySchedule: [
      {
        term: 2,
        weekNumber: 1,
        weekTitle: 'Week 1: Geometric Proof & Hypotenuse Derivation',
        focusSubtopics: ['Hypotenuse identification', 'Area proof of a² + b² = c²', 'Pythagorean Triples'],
        weeklyObjective: 'Derive Pythagoras theorem visually and identify common triples (3-4-5, 5-12-13).',
        teachingActivities: ['Cut-out square area verification activity', 'Triples speed mental recall'],
        weeklyAssignment: 'Exercise 4A: Calculate missing hypotenuse for 10 triangles.',
        status: 'upcoming'
      },
      {
        term: 2,
        weekNumber: 2,
        weekTitle: 'Week 2: Ladder & Distance Word Problems',
        focusSubtopics: ['Ladder leaning against wall', 'Walking distance north/east', 'Diagonals of rectangles'],
        weeklyObjective: 'Solve real-world spatial distance word problems using square roots.',
        teachingActivities: ['Classroom ladder inclination demo', 'Map distance problem solving'],
        weeklyAssignment: 'Exercise 4B: 8 Pythagoras word problems.',
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'jss2-05',
    file: 'JSS2/05_Cylinder_Cone_and_Solid_Shapes.txt',
    title: '05. Cylinder, Cone, and Solid Shapes',
    level: 'JSS2',
    term: 2,
    recommendedWeek: 3,
    summary: 'Surface area and volume calculations for 3D solids including cylinders, cones, spheres, rectangular prisms (cuboids), and triangular prisms.',
    keyFormulas: [
      'Cylinder Volume: V = π * r^2 * h',
      'Cylinder Total Surface Area: TSA = 2*π*r*h + 2*π*r^2 = 2*π*r*(h + r)',
      'Cone Volume: V = (1/3) * π * r^2 * h',
      'Cone Curved Surface Area: CSA = π * r * l (where l = √(r^2 + h^2))',
      'Sphere Volume: V = (4/3) * π * r^3; Surface Area = 4 * π * r^2'
    ],
    workedExamples: [
      {
        problem: 'Calculate the total surface area and volume of a closed cylinder with radius 7 cm and height 10 cm (Take π = 22/7).',
        solution: 'Volume = π r^2 h = (22/7) x 7^2 x 10 = 22 x 7 x 10 = 1540 cm^3.\nTSA = 2 π r (h + r) = 2 x (22/7) x 7 x (10 + 7) = 44 x 17 = 748 cm^2.'
      }
    ],
    teacherGuide: 'Bring physical cans (cylinders) and party hats (cones) to class. Fill a cone with sand to show 3 cone volumes fill exactly 1 cylinder of equal base & height.',
    practiceQuestions: [
      {
        question: 'Find the volume of a cone with base radius 6 cm and vertical height 14 cm (π = 22/7).',
        answer: 'V = (1/3) x (22/7) x 6^2 x 14 = (1/3) x (22/7) x 36 x 14 = 22 x 12 x 2 = 528 cm^3'
      },
      {
        question: 'Calculate the volume of a sphere of radius 3 cm in terms of π.',
        answer: 'V = (4/3) x π x 3^3 = (4/3) x 27 π = 36π cm^3'
      }
    ],
    weeklySchedule: [
      {
        term: 2,
        weekNumber: 3,
        weekTitle: 'Week 3: Cylinder Volume & Total Surface Area',
        focusSubtopics: ['Cylinder net decomposition', 'Curved surface area', 'Volume V = π r² h'],
        weeklyObjective: 'Calculate total surface area and capacity of tin cans and cylindrical water tanks.',
        teachingActivities: ['Unrolling cylindrical tin labels to show net rectangle', 'Tank capacity calculations'],
        weeklyAssignment: 'Exercise 5A: Cylinder volume and surface area worksheet.',
        status: 'upcoming'
      },
      {
        term: 2,
        weekNumber: 4,
        weekTitle: 'Week 4: Cones & Spheres Mensuration',
        focusSubtopics: ['Cone slant height vs vertical height', 'Cone volume V = 1/3 π r² h', 'Sphere volume and area'],
        weeklyObjective: 'Calculate slant heights using Pythagoras and evaluate cone/sphere volumes.',
        teachingActivities: ['Sand filling cone-to-cylinder volume experiment', 'Sphere area formula demo'],
        weeklyAssignment: 'Exercise 5B: Cones and spheres calculations.',
        status: 'upcoming'
      }
    ]
  },

  // ==================== JSS 3 LESSONS ====================
  {
    id: 'jss3-00',
    file: 'JSS3/00_INDEX_AND_TEACHER_GUIDE.txt',
    title: 'JSS3 Mathematics Curriculum & BECE Weekly Exam Guide',
    level: 'JSS3',
    term: 1,
    recommendedWeek: 1,
    summary: 'Master Teacher Guide for Year 3 Junior Secondary Mathematics. Final BECE exam preparation roadmap covering weekly schedules across advanced algebraic, geometric, trigonometric, statistical, and probabilistic competencies.',
    keyFormulas: [
      'Quadratic Formula: x = [-b ± √(b² - 4ac)] / (2a)',
      'Simultaneous Elimination & Substitution Methods',
      'Probability P(E) = Number of favorable outcomes / Total possible outcomes'
    ],
    workedExamples: [
      {
        problem: 'What is the BECE exam structure for JSS3 Mathematics?',
        solution: 'Paper 1: 60 Multiple Choice Objective Questions (60 marks).\nPaper 2: 6 Structured Theory / Essay Questions (40 marks).'
      }
    ],
    teacherGuide: 'Conduct weekly timed past-question BECE mocks. Provide immediate feedback on quadratic derivations and simultaneous equation steps.',
    practiceQuestions: [
      {
        question: 'List the 7 major units for JSS3 BECE preparation.',
        answer: '1. Approximation & Error, 2. Indices & Logarithms, 3. Algebraic Fractions, 4. Simultaneous Equations, 5. Quadratic Equations, 6. Trigonometry, 7. Statistics & Probability.'
      }
    ],
    weeklySchedule: [
      {
        term: 1,
        weekNumber: 1,
        weekTitle: 'Week 1: BECE Roadmap & Diagnostic Mock',
        focusSubtopics: ['BECE exam format overview', 'Diagnostic paper 1 mock test', 'Error analysis'],
        weeklyObjective: 'Identify individual student weaknesses in foundational JSS1-2 algebra and geometry.',
        teachingActivities: ['Administer 45-minute BECE diagnostic test', 'Individual score gap analysis'],
        weeklyAssignment: 'Review diagnostic test corrections.',
        status: 'completed'
      }
    ]
  },
  {
    id: 'jss3-01',
    file: 'JSS3/01_Approximation_and_Error.txt',
    title: '01. Approximation and Error',
    level: 'JSS3',
    term: 1,
    recommendedWeek: 2,
    summary: 'Rounding numbers to specified decimal places (d.p.), significant figures (s.f.), nearest whole numbers, upper and lower bounds, absolute error, and percentage error calculations.',
    keyFormulas: [
      'Absolute Error = | True Value - Estimated Value |',
      'Percentage Error = (Absolute Error / True Value) x 100%',
      'Upper Bound = Measured Value + 0.5 unit of accuracy',
      'Lower Bound = Measured Value - 0.5 unit of accuracy'
    ],
    workedExamples: [
      {
        problem: 'A student measured a line of true length 12.5 cm as 12.8 cm. Calculate the percentage error.',
        solution: 'Error = | 12.5 - 12.8 | = 0.3 cm.\nPercentage Error = (0.3 / 12.5) x 100% = 2.4%.'
      },
      {
        problem: 'Round 0.0040785 to (a) 3 decimal places (b) 3 significant figures.',
        solution: '(a) 3 d.p. = 0.004\n(b) 3 s.f. = 0.00408 (first non-zero digit is 4).'
      }
    ],
    teacherGuide: 'Emphasize that zero is significant when placed between non-zero digits or at the end of a decimal fraction.',
    practiceQuestions: [
      {
        question: 'Find the percentage error when 4.8 is rounded up to 5.',
        answer: 'Error = 0.2. Percentage Error = (0.2 / 4.8) x 100% = 4.17%'
      },
      {
        question: 'If a rope length is given as 15 cm to the nearest cm, state its lower and upper bounds.',
        answer: 'Lower bound = 14.5 cm, Upper bound = 15.5 cm'
      }
    ],
    weeklySchedule: [
      {
        term: 1,
        weekNumber: 2,
        weekTitle: 'Week 2: Significant Figures & Decimal Precision',
        focusSubtopics: ['Identifying significant digits', 'Leading vs trailing zeros', 'Rounding rules'],
        weeklyObjective: 'Express decimal calculations to specified significant figures and decimal places.',
        teachingActivities: ['Significant figure card challenge', 'Precision comparison on board'],
        weeklyAssignment: 'Exercise 1A: 15 rounding problems.',
        status: 'current'
      },
      {
        term: 1,
        weekNumber: 3,
        weekTitle: 'Week 3: Percentage Error & Measurement Bounds',
        focusSubtopics: ['Absolute error formula', 'Percentage error in measurements', 'Upper & lower limits'],
        weeklyObjective: 'Compute percentage error in laboratory and trade measurements.',
        teachingActivities: ['Measurement error ruler experiment', 'Percentage error calculation drill'],
        weeklyAssignment: 'Exercise 1B: Error analysis worksheet.',
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'jss3-04',
    file: 'JSS3/04_Simultaneous_Linear_Equations.txt',
    title: '04. Simultaneous Linear Equations',
    level: 'JSS3',
    term: 1,
    recommendedWeek: 6,
    summary: 'Solving systems of two linear equations in two variables (x and y) using Elimination Method, Substitution Method, and Graphical Method. Real-world word problems.',
    keyFormulas: [
      'Standard System: a1*x + b1*y = c1 and a2*x + b2*y = c2',
      'Elimination: Equalize coefficients of one variable by multiplying equations',
      'Substitution: Express one variable in terms of the other and substitute'
    ],
    workedExamples: [
      {
        problem: 'Solve simultaneously:\n2x + 3y = 13\n5x - y = 7',
        solution: 'Using Substitution: From eq 2, y = 5x - 7.\nSubstitute y into eq 1:\n2x + 3(5x - 7) = 13\n2x + 15x - 21 = 13\n17x = 34 => x = 2.\nThen y = 5(2) - 7 = 3.\nSolution: x = 2, y = 3.'
      },
      {
        problem: 'The sum of two numbers is 25 and their difference is 7. Find the two numbers.',
        solution: 'Let numbers be x and y:\nx + y = 25\nx - y = 7\nAdd equations: 2x = 32 => x = 16.\nSubstitute: 16 + y = 25 => y = 9.\nNumbers are 16 and 9.'
      }
    ],
    teacherGuide: 'Show students that the graphical solution represents the exact intersection point (x, y) of the two straight lines on a Cartesian grid.',
    practiceQuestions: [
      {
        question: 'Solve using elimination: 3x + 2y = 12 and 4x - 2y = 2.',
        answer: 'Add equations: 7x = 14 => x = 2. Substitute: 3(2) + 2y = 12 => 2y = 6 => y = 3. Solution: (2, 3).'
      },
      {
        question: '3 pens and 2 notebooks cost $12. 1 pen and 4 notebooks cost $14. Find the cost of 1 pen.',
        answer: 'Let p=pen, n=notebook. 3p + 2n = 12; p + 4n = 14 => p = 14 - 4n. 3(14 - 4n) + 2n = 12 => 42 - 10n = 12 => 10n = 30 => n = 3. p = 14 - 12 = $2.'
      }
    ],
    weeklySchedule: [
      {
        term: 1,
        weekNumber: 6,
        weekTitle: 'Week 6: Elimination & Substitution Methods',
        focusSubtopics: ['Equalizing coefficients', 'Adding/subtracting equations', 'Substitution method'],
        weeklyObjective: 'Solve 2x2 linear systems accurately by elimination and substitution.',
        teachingActivities: ['Side-by-side method comparison on blackboard', 'Pair problem solving'],
        weeklyAssignment: 'Exercise 4A: 10 simultaneous equations.',
        status: 'upcoming'
      },
      {
        term: 1,
        weekNumber: 7,
        weekTitle: 'Week 7: Graphical Method & Market Word Problems',
        focusSubtopics: ['Graphing straight lines', 'Point of intersection', 'Cost of goods word problems'],
        weeklyObjective: 'Plot linear graphs to find graphical intersections and model commercial scenarios.',
        teachingActivities: ['Graph paper plotting workshop', 'Market pricing word problem breakdown'],
        weeklyAssignment: 'Exercise 4B: BECE past simultaneous questions.',
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'jss3-05',
    file: 'JSS3/05_Quadratic_Equations.txt',
    title: '05. Quadratic Equations',
    level: 'JSS3',
    term: 2,
    recommendedWeek: 1,
    summary: 'Standard form ax^2 + bx + c = 0, solving quadratic equations by Factorization Method, Completing the Square, Quadratic Formula (General Formula), and graph plotting.',
    keyFormulas: [
      'Standard Form: ax^2 + bx + c = 0 (a ≠ 0)',
      'Quadratic Formula: x = [ -b ± √(b^2 - 4ac) ] / (2a)',
      'Discriminant Δ = b^2 - 4ac (Δ > 0: two real roots, Δ = 0: equal roots, Δ < 0: complex roots)'
    ],
    workedExamples: [
      {
        problem: 'Solve 2x^2 - 5x - 3 = 0 by factorization.',
        solution: 'Product = 2 x (-3) = -6. Sum = -5. Factors: -6 and +1.\n2x^2 - 6x + x - 3 = 0\n2x(x - 3) + 1(x - 3) = 0\n(2x + 1)(x - 3) = 0\nRoots: x = -1/2 or x = 3.'
      },
      {
        problem: 'Solve x^2 - 6x + 2 = 0 using the quadratic formula (correct to 2 decimal places).',
        solution: 'a = 1, b = -6, c = 2.\nx = [ -(-6) ± √((-6)^2 - 4(1)(2)) ] / (2 x 1)\nx = [ 6 ± √(36 - 8) ] / 2\nx = [ 6 ± √28 ] / 2 = [ 6 ± 5.2915 ] / 2\nx1 = 11.2915 / 2 = 5.65\nx2 = 0.7085 / 2 = 0.35.'
      }
    ],
    teacherGuide: 'Guide students through deriving the quadratic formula by completing the square on ax^2 + bx + c = 0.',
    practiceQuestions: [
      {
        question: 'Solve x^2 - 9x + 20 = 0.',
        answer: '(x - 4)(x - 5) = 0 => x = 4 or x = 5'
      },
      {
        question: 'Find the discriminant of 3x^2 - 4x + 5 = 0 and state the nature of its roots.',
        answer: 'Δ = (-4)^2 - 4(3)(5) = 16 - 60 = -44. Since Δ < 0, there are no real roots.'
      }
    ],
    weeklySchedule: [
      {
        term: 2,
        weekNumber: 1,
        weekTitle: 'Week 1: Quadratic Factorization & Roots',
        focusSubtopics: ['Standard form ax² + bx + c = 0', 'Product-sum factor method', 'Zero product property'],
        weeklyObjective: 'Factorize quadratic trinomials and calculate real roots.',
        teachingActivities: ['Factor tree product-sum bingo', 'Blackboard root derivation'],
        weeklyAssignment: 'Exercise 5A: 15 quadratic factorization problems.',
        status: 'upcoming'
      },
      {
        term: 2,
        weekNumber: 2,
        weekTitle: 'Week 2: Quadratic Formula & Discriminant',
        focusSubtopics: ['Deriving quadratic formula', 'Discriminant Δ = b² - 4ac', 'Nature of roots'],
        weeklyObjective: 'Memorize and apply general formula for non-factorizable quadratics.',
        teachingActivities: ['Quadratic formula song / mnemonic drill', 'Discriminant test table activity'],
        weeklyAssignment: 'Exercise 5B: General formula worksheet.',
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'jss3-07',
    file: 'JSS3/07_Statistics_and_Probability.txt',
    title: '07. Statistics and Probability',
    level: 'JSS3',
    term: 2,
    recommendedWeek: 5,
    summary: 'Collection and organization of data, frequency tables, measures of central tendency (Mean, Median, Mode), measures of dispersion (Range), bar charts, pie charts, histograms, and basic theoretical/experimental probability.',
    keyFormulas: [
      'Mean x̄ = (∑ f*x) / (∑ f)',
      'Median = Middle value in an ordered dataset',
      'Mode = Most frequently occurring score',
      'Pie Chart Sector Angle = (Frequency / Total Frequency) x 360°',
      'Probability P(Event) = Favorable Outcomes / Total Possible Outcomes',
      'Complementary Probability: P(Not E) = 1 - P(E)'
    ],
    workedExamples: [
      {
        problem: 'The test scores of 10 JSS3 students are: 6, 8, 7, 5, 8, 9, 8, 4, 7, 8.\nFind the (a) Mode (b) Median (c) Mean.',
        solution: 'Ordered scores: 4, 5, 6, 7, 7, 8, 8, 8, 8, 9.\n(a) Mode = 8 (occurs 4 times).\n(b) Median = Average of 5th and 6th terms = (7 + 8)/2 = 7.5.\n(c) Mean = (4+5+6+7+7+8+8+8+8+9)/10 = 70 / 10 = 7.0.'
      },
      {
        problem: 'A fair 6-sided die is rolled. Find the probability of getting (a) an even number (b) a number greater than 4.',
        solution: 'Total outcomes = {1, 2, 3, 4, 5, 6} (6 total).\n(a) Even numbers = {2, 4, 6} (3 outcomes). P(Even) = 3/6 = 1/2.\n(b) Numbers > 4 = {5, 6} (2 outcomes). P(>4) = 2/6 = 1/3.'
      }
    ],
    teacherGuide: 'Have students conduct a real dice roll or coin toss experiment in pairs to compare experimental probability with theoretical predictions.',
    practiceQuestions: [
      {
        question: 'A bag contains 5 red balls, 3 blue balls, and 2 green balls. A ball is drawn at random. What is the probability that it is NOT red?',
        answer: 'Total balls = 10. Non-red balls = 3 + 2 = 5. P(Not Red) = 5/10 = 1/2.'
      },
      {
        question: 'In a pie chart, a frequency of 15 out of 60 total items is represented by what angle?',
        answer: 'Angle = (15 / 60) x 360° = 1/4 x 360° = 90°'
      }
    ],
    weeklySchedule: [
      {
        term: 2,
        weekNumber: 5,
        weekTitle: 'Week 5: Frequency Tables & Central Tendency',
        focusSubtopics: ['Organizing raw data into frequency tables', 'Mean x̄ = ∑fx / ∑f', 'Median & Mode'],
        weeklyObjective: 'Construct grouped frequency tables and calculate mean, median, and mode.',
        teachingActivities: ['Class height/age data collection survey', 'Frequency table calculation drill'],
        weeklyAssignment: 'Exercise 7A: Statistics calculations on 2 datasets.',
        status: 'upcoming'
      },
      {
        term: 2,
        weekNumber: 6,
        weekTitle: 'Week 6: Pie Charts & Probability Foundations',
        focusSubtopics: ['Pie chart sector angle calculation', 'Drawing pie charts with protractor', 'Theoretical probability P(E)'],
        weeklyObjective: 'Construct accurate pie charts and evaluate single-event probabilities.',
        teachingActivities: ['Pie chart protractor drawing session', 'Dice rolling & coin tossing probability experiment'],
        weeklyAssignment: 'Exercise 7B: Pie chart & probability practice questions.',
        status: 'upcoming'
      }
    ]
  }
];
