import { JSS_ALL_SUBJECTS_SYLLABUS } from '../data/jssAllSubjectsSyllabus';
import { JSSLevel } from '../types';

export interface AreaOfLearning {
  id: string;
  title: string;
  subjectCode: string;
  category: string;
  icon: string;
  accentColor: string;
  competencies: string[];
  keyModules: string[];
  recommendedDocId?: string;
}

export interface AcademicLevelCurriculum {
  levelCode: string;
  levelTitle: string;
  levelTier: 'junior_secondary' | 'senior_secondary' | 'higher_education';
  targetExams: string[];
  areas: AreaOfLearning[];
}

const ACCENT_BY_CATEGORY: Record<string, string> = {
  Core: 'from-emerald-600 to-green-700',
  'STEM & Technology': 'from-blue-600 to-cyan-700',
  'Humanities & Values': 'from-amber-600 to-orange-700',
  'Vocational & Business': 'from-teal-600 to-emerald-700',
};

export function getAcademicLevelCurriculum(gradeLevelString: string = 'JSS3'): AcademicLevelCurriculum {
  const norm = gradeLevelString.toLowerCase();

  const isSenior =
    norm.includes('ss1') ||
    norm.includes('ss2') ||
    norm.includes('ss3') ||
    norm.includes('sss') ||
    norm.includes('senior') ||
    norm.includes('waec') ||
    norm.includes('jamb') ||
    norm.includes('10th') ||
    norm.includes('11th') ||
    norm.includes('12th');

  const isHigherEd =
    norm.includes('undergraduate') ||
    norm.includes('college') ||
    norm.includes('university') ||
    norm.includes('diploma');

  if (isHigherEd) {
    return {
      levelCode: 'HigherEd',
      levelTitle: 'Higher Education & Collegiate Specialization',
      levelTier: 'higher_education',
      targetExams: ['Undergraduate Semesters', 'Industry Certifications', 'Professional Licensure'],
      areas: [
        {
          id: 'he-calculus',
          title: 'Advanced Calculus & Mathematical Analysis',
          subjectCode: 'CALC-301',
          category: 'Pure & Applied Mathematics',
          icon: '📐',
          accentColor: 'from-purple-600 to-indigo-700',
          competencies: ['Multivariable Limits', 'Taylor & Maclaurin Series', 'Partial Derivatives', 'Double & Triple Integrals'],
          keyModules: ['Differential Equations', 'Vector Calculus', 'Stokes & Green Theorems'],
          recommendedDocId: 'doc-calculus-derivatives-01',
        },
        {
          id: 'he-cyber',
          title: 'Cybersecurity Defense & Systems Hardening',
          subjectCode: 'CS-301',
          category: 'Computer Science',
          icon: '🛡️',
          accentColor: 'from-teal-600 to-cyan-700',
          competencies: ['Zero-Trust Architectures', 'Cryptographic Protocols', 'Incident Response Playbooks'],
          keyModules: ['Network Penetration Labs', 'AES-256 Analysis', 'Cloud Firewall Auditing'],
          recommendedDocId: 'doc-cyber-defense-01',
        },
        {
          id: 'he-programming',
          title: 'Software Engineering & Algorithmic Design',
          subjectCode: 'CS-204',
          category: 'Applied Computing',
          icon: '💻',
          accentColor: 'from-blue-600 to-sky-700',
          competencies: ['Big-O Optimization', 'Object-Oriented Programming', 'API & Database Integration'],
          keyModules: ['Data Structures in Python', 'Asynchronous Systems', 'Automated Testing'],
          recommendedDocId: 'doc-python-programming-01',
        },
      ],
    };
  }

  if (isSenior && !norm.includes('jss')) {
    return {
      levelCode: 'SeniorSecondary',
      levelTitle: 'Senior Secondary Academic Track (SS 1 - SS 3)',
      levelTier: 'senior_secondary',
      targetExams: ['WASSCE / WAEC', 'NECO Senior School Certificate', 'UTME / JAMB CBT'],
      areas: [
        {
          id: 'ss-calculus',
          title: 'Differential & Integral Calculus',
          subjectCode: 'CALC-301',
          category: 'Advanced Mathematics',
          icon: '📈',
          accentColor: 'from-purple-600 to-indigo-700',
          competencies: ['Limits & Continuity', 'Derivatives from First Principles', 'Chain & Product Rules', 'Definite Riemann Integration'],
          keyModules: ['Rate of Change', 'Curve Sketching & Maxima/Minima', 'Area Under Curves'],
          recommendedDocId: 'doc-calculus-derivatives-01',
        },
        {
          id: 'ss-math',
          title: 'General Mathematics & Trigonometry',
          subjectCode: 'MATH-402',
          category: 'Pure Mathematics',
          icon: '🔢',
          accentColor: 'from-emerald-600 to-teal-700',
          competencies: ['Quadratic Equations & Roots', 'Logarithms & Indices', 'Trigonometric Identities', 'Coordinate Geometry'],
          keyModules: ['Simultaneous Linear Equations', 'Circle Theorems', 'Statistics & Probability'],
          recommendedDocId: 'doc-math-algebra-01',
        },
        {
          id: 'ss-cyber',
          title: 'Computer Science & Cybersecurity Labs',
          subjectCode: 'CS-301',
          category: 'STEM & IT',
          icon: '🛡️',
          accentColor: 'from-cyan-600 to-blue-700',
          competencies: ['Network Protocols & Firewalls', 'Digital Threat Mitigation', 'Safe Web Architecture'],
          keyModules: ['Packet Inspection', 'Hash Verification', 'Multi-Factor Defense'],
          recommendedDocId: 'doc-cyber-defense-01',
        },
        {
          id: 'ss-english',
          title: 'English Language & Communication',
          subjectCode: 'ENG-305',
          category: 'Humanities & Languages',
          icon: '📝',
          accentColor: 'from-slate-700 to-slate-900',
          competencies: ['Essay Writing & Argumentation', 'Reading Comprehension', 'Summary Synthesis', 'Phonetics & Lexis'],
          keyModules: ['Formal Correspondence', 'Literature Text Review', 'Grammar Mechanics'],
        },
        {
          id: 'ss-science',
          title: 'Applied Science & Physics Foundations',
          subjectCode: 'PHY-201',
          category: 'Physical Sciences',
          icon: '⚡',
          accentColor: 'from-amber-600 to-orange-700',
          competencies: ['Newtonian Kinematics', 'Energy Conservation', "Ohm's Law & Circuits"],
          keyModules: ['Projectile Motion', 'Thermodynamics', 'Wave Optics'],
        },
      ],
    };
  }

  // Detect exact JSS class level (JSS1, JSS2, or JSS3)
  let detectedJSSLevel: JSSLevel = 'JSS3';
  if (norm.includes('jss 1') || norm.includes('jss1')) {
    detectedJSSLevel = 'JSS1';
  } else if (norm.includes('jss 2') || norm.includes('jss2')) {
    detectedJSSLevel = 'JSS2';
  } else if (norm.includes('jss 3') || norm.includes('jss3')) {
    detectedJSSLevel = 'JSS3';
  }

  const classSyllabus = JSS_ALL_SUBJECTS_SYLLABUS[detectedJSSLevel];

  return {
    levelCode: detectedJSSLevel,
    levelTitle: classSyllabus.title,
    levelTier: 'junior_secondary',
    targetExams: [classSyllabus.targetExam, 'New Nigerian NERDC Basic Education Standard'],
    areas: classSyllabus.subjects.map((subj) => ({
      id: subj.id,
      title: subj.subjectName,
      subjectCode: subj.subjectCode,
      category: subj.category,
      icon: subj.icon,
      accentColor: ACCENT_BY_CATEGORY[subj.category] || 'from-blue-600 to-indigo-700',
      competencies: subj.competencies,
      keyModules: subj.termTopics.map((t) => `Term ${t.term}: ${t.topicTitle}`),
      recommendedDocId: subj.subjectCode.startsWith('MTH')
        ? 'doc-math-algebra-01'
        : subj.subjectCode.startsWith('ICT')
        ? 'doc-python-programming-01'
        : subj.subjectCode.startsWith('CCA')
        ? 'doc-cca-music-theory-01'
        : undefined,
    })),
  };
}
