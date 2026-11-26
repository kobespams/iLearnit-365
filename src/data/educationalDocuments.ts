import { EducationalDocument } from '../types';

export const EDUCATIONAL_DOCUMENTS: EducationalDocument[] = [
  {
    id: 'doc-math-algebra-01',
    title: 'BECE & JSS Mathematics Mastery Handbook: Linear & Quadratic Systems',
    subtitle: 'Step-by-step Algebraic Derivations, Graphing Parabolas & Geometric Theorems',
    subjectId: 'jss_math',
    subjectName: 'JSS Mathematics',
    courseCode: 'MATH-JSS3-01',
    fileType: 'PDF',
    category: 'Textbook Chapter',
    author: 'Dr. Folashade Adeleke',
    authorTitle: 'Lead Academic Director & STEM Educator',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    readingTimeMinutes: 12,
    gradeLevel: 'JSS 1 - JSS 3 / BECE Candidates',
    publishedDate: '2026 Academic Session',
    tags: ['Algebra', 'Linear Equations', 'Quadratic Formula', 'Simultaneous Systems', 'NERDC Syllabus'],
    summary: 'A foundational reference guide for mastering algebraic transformations, balancing linear equations, solving simultaneous systems via substitution and elimination, and understanding quadratic roots.',
    sections: [
      {
        id: 'sec-math-1',
        heading: '1. Foundations of Algebraic Balance and Equality',
        content: `In algebra, an equation is a statement asserting the equality of two mathematical expressions. Think of an equation as a two-pan balance scale in equilibrium.

Whatever operation you perform on the left-hand side (LHS), you must perform identical operations on the right-hand side (RHS) to preserve mathematical truth.

### The Golden Axiom of Equality:
If A = B, then for any constant c:
1. Addition Rule: A + c = B + c
2. Subtraction Rule: A - c = B - c
3. Multiplication Rule: A * c = B * c (c != 0)
4. Division Rule: A / c = B / c (c != 0)`,
        callout: {
          type: 'info',
          title: 'Key Pedagogical Insight',
          body: 'Transposing a term across the equals sign is simply adding its additive inverse to both sides. For example: 2x + 7 = 19 implies 2x + 7 - 7 = 19 - 7 implies 2x = 12 implies x = 6.'
        }
      },
      {
        id: 'sec-math-2',
        heading: '2. Simultaneous Linear Equations: Two Unknowns',
        content: `Simultaneous equations represent two or more conditions that must be satisfied concurrently by the variable pair (x, y).

### Two Standard Algebraic Methods:
* Elimination Method: Scale the equations using integer multipliers so that the coefficients of one variable have matching or opposite magnitudes. Adding or subtracting the equations eliminates that variable.
* Substitution Method: Express one variable explicitly in terms of the other from the simpler equation, then substitute it into the second equation.

#### Worked Example:
Solve the system:
1) 3x + 2y = 16
2) 5x - 2y = 8

Since the coefficients of y are +2 and -2, we add equation (1) and equation (2):
(3x + 5x) + (2y - 2y) = 16 + 8
8x = 24  =>  x = 3

Substitute x = 3 back into (1):
3(3) + 2y = 16  =>  9 + 2y = 16  =>  2y = 7  =>  y = 3.5

Solution Set: (x, y) = (3, 3.5)`,
        callout: {
          type: 'formula',
          title: 'Elimination Shortcut',
          body: 'When signs of the target variable are opposite (+ and -), ADD the equations. When signs are identical (+ and +, or - and -), SUBTRACT the equations.'
        }
      },
      {
        id: 'sec-math-3',
        heading: '3. Quadratic Equations and The Quadratic Formula',
        content: `A quadratic equation in standard canonical form is written as:
ax^2 + bx + c = 0   (where a != 0)

The solutions (also called roots) are derived from the quadratic formula:
x = (-b +- sqrt(b^2 - 4ac)) / (2a)

### The Discriminant (Delta = b^2 - 4ac):
The term under the radical sign determines the geometric nature of the roots:
* Delta > 0: Two distinct real roots (parabola crosses the x-axis twice).
* Delta = 0: Exactly one repeated real root (parabola touches the x-axis at vertex).
* Delta < 0: No real roots (complex roots; parabola does not touch the x-axis).`,
        callout: {
          type: 'tip',
          title: 'BECE Exam Tip',
          body: 'Always rearrange your equation into standard form ax^2 + bx + c = 0 before identifying the coefficients a, b, and c. Beware of negative signs when computing b^2 - 4ac!'
        }
      },
      {
        id: 'sec-math-4',
        heading: '4. Geometric Theorems: Polygon Interior Angles',
        content: `For any convex n-sided polygon, dividing the shape into non-overlapping triangles from a single vertex yields (n - 2) triangles.

Since the sum of interior angles of each triangle is 180 degrees:
Sum of Interior Angles S = (n - 2) * 180 degrees

* Triangle (n=3): (3-2) * 180 = 180 deg
* Quadrilateral (n=4): (4-2) * 180 = 360 deg
* Pentagon (n=5): (5-2) * 180 = 540 deg
* Hexagon (n=6): (6-2) * 180 = 720 deg
* Exterior Angles Sum: For any regular or irregular convex polygon, the sum of exterior angles is always constant at 360 degrees.`
      }
    ],
    keyTerms: [
      { term: 'Linear Equation', definition: 'An algebraic equation of degree 1 producing a straight line when plotted on Cartesian coordinates.' },
      { term: 'Quadratic Equation', definition: 'A second-order polynomial equation of the form ax^2 + bx + c = 0 with a != 0.' },
      { term: 'Discriminant', definition: 'The value b^2 - 4ac that reveals the nature of the roots of a quadratic equation.' },
      { term: 'Simultaneous Equations', definition: 'A collection of two or more equations with common variables solved together.' }
    ],
    comprehensionQuiz: [
      {
        question: 'What is the sum of interior angles of a regular 6-sided polygon (hexagon)?',
        options: ['360 degrees', '540 degrees', '720 degrees', '900 degrees'],
        correctIndex: 2,
        explanation: 'Using the formula S = (n - 2) * 180 deg for n = 6: S = (6 - 2) * 180 = 4 * 180 = 720 degrees.'
      },
      {
        question: 'If the discriminant b^2 - 4ac is equal to 0, what does this indicate about the roots of the quadratic equation?',
        options: ['Two distinct imaginary roots', 'Exactly one repeated real root', 'No solution exists', 'Three real roots'],
        correctIndex: 1,
        explanation: 'When Delta = 0, sqrt(0) = 0, giving a single repeated root x = -b / (2a).'
      }
    ]
  },
  {
    id: 'doc-cyber-def-01',
    title: 'Cybersecurity Defense Architecture: CIA Triad, Cryptography & Zero Trust',
    subtitle: 'Enterprise Defense Engineering, AES-256 vs RSA, Access Control & Incident Response',
    subjectId: 'cyber_security',
    subjectName: 'Cybersecurity Defense',
    courseCode: 'SEC-DEF-301',
    category: 'Curriculum Guide',
    author: 'Engr. Emeka Okonkwo',
    authorTitle: 'Cybersecurity & Tech Systems Specialist',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    readingTimeMinutes: 15,
    gradeLevel: 'Advanced Secondary & Professional Entry',
    publishedDate: '2026 Academic Session',
    tags: ['CIA Triad', 'Zero Trust', 'AES-256', 'RSA', 'Cryptography', 'Incident Response'],
    summary: 'An operational handbook for understanding cryptographic algorithms, Zero Trust Architecture, network perimeter segmentation, and cyber threat mitigation.',
    sections: [
      {
        id: 'sec-cyber-1',
        heading: '1. The Core Pillars: The CIA Triad',
        content: `The CIA Triad forms the foundational bedrock of modern information security:

* Confidentiality: Ensuring sensitive information is disclosed only to authorized entities. Maintained via symmetric encryption (AES-256), multi-factor authentication, and strict Role-Based Access Control (RBAC).
* Integrity: Protecting data from unauthorized modification, tampering, or deletion. Enforced through cryptographic hashing (SHA-256) and digital signatures.
* Availability: Ensuring dependable, timely access to digital resources for authenticated users. Enforced through high-availability clusters (RAID), geo-redundant backups, and DDoS mitigation scrubbing networks.`,
        callout: {
          type: 'info',
          title: 'Risk Equation',
          body: 'Risk = Threat x Vulnerability x Impact. Mitigating any one variable reduces overall organizational exposure.'
        }
      },
      {
        id: 'sec-cyber-2',
        heading: '2. Cryptographic Systems: Symmetric vs Asymmetric',
        content: `### Symmetric Encryption (Single Shared Secret):
Uses the exact same key for both encryption and decryption.
* Primary Standard: AES-256 (Advanced Encryption Standard).
* Advantage: Extremely fast, hardware-accelerated, ideal for bulk data and disk encryption.

### Asymmetric Encryption (Public / Private Key Pair):
Uses mathematically paired keys: Public Key encrypts, Private Key decrypts.
* Primary Standard: RSA-4096 and ECC (Elliptic Curve Cryptography).
* Advantage: Solves the key-distribution problem over insecure channels.`,
        callout: {
          type: 'formula',
          title: 'Key Rule',
          body: 'In asymmetric encryption: Anyone can encrypt with your Public Key, but only you can decrypt with your matching Private Key.'
        },
        codeExample: {
          language: 'python',
          code: `# Python AES-256 Simulation Concept
from hashlib import sha256
import secrets

# Generate 256-bit symmetric key
session_key = secrets.token_bytes(32)
key_hash = sha256(session_key).hexdigest()
print("AES-256 Key Hash:", key_hash[:16], "...")`,
          output: 'AES-256 Key Hash: a3f8902b1c4e7d91 ...'
        }
      },
      {
        id: 'sec-cyber-3',
        heading: '3. End-to-End Encryption (E2EE) Protocols',
        content: `In an authentic E2EE system, data is encrypted on the client device prior to transmission. Intermediary servers, cloud relays, and ISP networks only see ciphertext.

Even if the database server is compromised, the encrypted records cannot be read without the private keys held exclusively in the endpoint browser vaults.`
      }
    ],
    keyTerms: [
      { term: 'Zero Trust', definition: 'A cybersecurity paradigm requiring strict identity verification for every person and device trying to access network resources.' },
      { term: 'AES-256', definition: 'Advanced Encryption Standard with a 256-bit key length, widely recognized as unbreakable by brute-force attacks.' },
      { term: 'ECDH', definition: 'Elliptic-Curve Diffie-Hellman, an anonymous key agreement protocol enabling shared secret establishment over insecure channels.' },
      { term: 'Nonce', definition: 'A number used once in cryptographic operations to prevent replay attacks.' }
    ],
    comprehensionQuiz: [
      {
        question: 'Which of the following describes the fundamental rule of Zero Trust Architecture?',
        options: ['Trust anyone with a local IP address', 'Never trust, always verify every request explicitly', 'Rely solely on perimeter firewalls', 'Disable multi-factor authentication'],
        correctIndex: 1,
        explanation: 'Zero Trust assumes breach and requires strict continuous authentication and authorization for every request.'
      }
    ]
  },
  {
    id: 'doc-cs-python-01',
    title: 'Python 3 Computational Thinking & Algorithm Complexity Lab Guide',
    subtitle: 'Data Structures, Big-O Analysis, Recursion & Binary Search Techniques',
    subjectId: 'computer_science',
    subjectName: 'Computer Science',
    courseCode: 'CSC-PY-202',
    fileType: 'TXT',
    category: 'Lab Manual',
    author: 'Prof. Clara Thornton',
    authorTitle: 'Senior Computational Linguist & Tutor',
    authorAvatar: 'https://images.unsplash.com/photo-1580894732454-def985e94b7e?auto=format&fit=crop&q=80&w=250',
    readingTimeMinutes: 14,
    gradeLevel: 'Secondary & Junior College',
    publishedDate: '2026 Academic Session',
    tags: ['Python', 'Big-O', 'Algorithms', 'Binary Search', 'Data Structures', 'Recursion'],
    summary: 'A hands-on manual covering algorithm efficiency, time complexity classification, binary search vs linear search, and recursive call stacks with executable Python examples.',
    sections: [
      {
        id: 'sec-cs-1',
        heading: '1. Algorithmic Efficiency and Big-O Notation',
        content: `When designing software, we measure performance not by clock time (which varies across computers), but by how the number of required computational steps scales as the input size N grows towards infinity.

### Standard Complexity Classes (From Best to Worst):
* O(1) - Constant Time: Direct array indexing, dictionary hash lookups.
* O(log N) - Logarithmic Time: Binary search, balanced tree operations.
* O(N) - Linear Time: Single iteration over an unsorted list.
* O(N log N) - Log-Linear Time: Merge Sort, Quick Sort (average), Timsort.
* O(N^2) - Quadratic Time: Nested loops, Bubble Sort.
* O(2^N) - Exponential Time: Naive recursive Fibonacci computation.`,
        callout: {
          type: 'info',
          title: 'Visualizing Scalability',
          body: 'For N = 1,000,000 items: An O(log N) binary search requires at most 20 operations. An O(N^2) quadratic search would require 1,000,000,000,000 operations!'
        }
      },
      {
        id: 'sec-cs-2',
        heading: '2. Binary Search: Divide and Conquer',
        content: `Binary search finds a target item in a sorted array in O(log N) time by repeatedly halving the search interval.

Algorithm Steps:
1. Initialize left = 0 and right = len(arr) - 1
2. While left <= right, compute mid = left + (right - left) // 2
3. If arr[mid] == target, return index mid
4. If arr[mid] < target, search right half (left = mid + 1)
5. Else search left half (right = mid - 1)`,
        codeExample: {
          language: 'python',
          code: `def binary_search(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

items = [12, 24, 35, 47, 59, 68, 72, 85, 93, 104]
print("Found at index:", binary_search(items, 68))`,
          output: 'Found at index: 5'
        }
      },
      {
        id: 'sec-cs-3',
        heading: '3. Recursion & The Call Stack',
        content: `A recursive function is one that solves a problem by calling itself with smaller instances of the same problem.

Every recursive algorithm MUST satisfy two components:
1. The Base Case: A terminating condition that stops recursion without making further calls.
2. The Recursive Step: A state transition moving closer to the base case.`
      }
    ],
    keyTerms: [
      { term: 'Big-O Notation', definition: 'Mathematical notation describing the upper bound limiting behavior of a function when the argument tends towards infinity.' },
      { term: 'Binary Search', definition: 'A search algorithm that finds the position of a target value within a sorted array in O(log N) time.' },
      { term: 'Call Stack', definition: 'A stack data structure storing information about the active subroutines and execution frames of a computer program.' }
    ],
    comprehensionQuiz: [
      {
        question: 'What is a mandatory prerequisite before applying the Binary Search algorithm on an array?',
        options: ['The array must contain only positive integers', 'The array must be sorted in ascending or descending order', 'The array must have an odd number of items', 'The array must be smaller than 100 elements'],
        correctIndex: 1,
        explanation: 'Binary Search relies on sorted order to reliably eliminate half of the search space at each iteration.'
      }
    ]
  },
  {
    id: 'doc-cca-music-01',
    title: 'West African Musicology & Cultural Heritage Monograph',
    subtitle: 'Organology, Polyrhythmic Structures, Tonic Solfa & Traditional Idiophones',
    subjectId: 'cca_music',
    subjectName: 'CCA Music',
    courseCode: 'CCA-MUS-101',
    fileType: 'IMG',
    category: 'Revision Monograph',
    author: 'Dr. Folashade Adeleke',
    authorTitle: 'Lead Academic Director & Cultural Heritage Scholar',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    readingTimeMinutes: 11,
    gradeLevel: 'Junior Secondary (JSS 1 - 3)',
    publishedDate: '2026 Academic Session',
    tags: ['Musicology', 'Organology', 'Idiophones', 'Membranophones', 'Polyrhythms', 'Solfa Notation'],
    summary: 'A comprehensive study monograph on African musical instrument classification (Hornbostel-Sachs system), vocal pitch notation, call-and-response structures, and rhythmic polyphony.',
    sections: [
      {
        id: 'sec-cca-1',
        heading: '1. The Four Hornbostel-Sachs Organological Classes',
        content: `Traditional African musical instruments are classified systematically by how they produce acoustic vibrations:

1. Idiophones: Instruments that produce sound by vibrating their own solid resonant bodies without strings or stretched skins.
   * Examples: Agogo (iron bell), Ekwe (slit wooden drum), Udu (clay pot resonator), Shekere (beaded gourd rattle), Kundung (xylophone).
2. Membranophones: Sound produced through the vibration of tightly stretched animal skins or membranes.
   * Examples: Bata drum, Gangan (talking drum), Djembe, Omele.
3. Chordophones: Sound produced by vibrating strings stretched between fixed points.
   * Examples: Kora (harp-lute), Goje (one-string bowed lute), Ubo Akwala (musical bow).
4. Aerophones: Sound produced by vibrating columns of enclosed air.
   * Examples: Oja (wooden flute), Kakaki (long brass trumpet), Algaita (double-reed oboe).`,
        callout: {
          type: 'tip',
          title: 'Exam Mnemonic',
          body: 'Remember: "I Make Cool Audio" = Idiophones (self), Membranophones (membrane), Chordophones (cords/strings), Aerophones (air).'
        }
      },
      {
        id: 'sec-cca-2',
        heading: '2. Tonic Solfa and Pitch Intervals',
        content: `Tonic Solfa is a system of pitch notation using the seven diatonic scale syllables:
d (doh) -> r (ray) -> m (me) -> f (fah) -> s (soh) -> l (lah) -> t (te) -> d' (high doh)

* Semitone Steps: Occur naturally between m - f (me to fah) and t - d' (te to high doh).
* Whole Tone Steps: Occur between all other adjacent steps (d-r, r-m, f-s, s-l, l-t).`
      }
    ],
    keyTerms: [
      { term: 'Idiophone', definition: 'A musical instrument that creates sound primarily by the instrument as a whole vibrating without the use of strings or membranes.' },
      { term: 'Polyrhythm', definition: 'The simultaneous use of two or more conflicting rhythms that are not readily perceived as deriving from one another.' },
      { term: 'Membranophone', definition: 'Any musical instrument which produces sound primarily by way of a vibrating stretched membrane.' }
    ],
    comprehensionQuiz: [
      {
        question: 'Which of the following instruments is classified as an IDIOPHONE?',
        options: ['Bata Talking Drum', 'Gangan', 'Agogo (Iron Bell)', 'Kakaki Trumpet'],
        correctIndex: 2,
        explanation: 'Agogo is an iron bell whose entire resonant solid body vibrates to produce acoustic sound, classifying it as an idiophone.'
      }
    ]
  },
  {
    id: 'doc-calculus-derivatives-01',
    title: 'Differential & Integral Calculus Mastery Monograph',
    subtitle: 'Limits, Instantaneous Rate of Change, Chain Rule & The Fundamental Theorem',
    subjectId: 'calculus',
    subjectName: 'Calculus',
    courseCode: 'MTH-CALC-301',
    fileType: 'PDF',
    category: 'Revision Monograph',
    author: 'Dr. Samuel Adeyemi',
    authorTitle: 'Chair of Mathematical Analysis & Applied Calculus',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    readingTimeMinutes: 16,
    gradeLevel: 'Senior Secondary (SS1 - SS3) & Pre-University',
    publishedDate: '2026 Academic Session',
    tags: ['Calculus', 'Limits', 'Derivatives', 'Integration', 'Chain Rule', 'Fundamental Theorem of Calculus'],
    summary: 'A definitive guide to calculus: defining limits from first principles, computing derivatives using power, product, quotient, and chain rules, and evaluating definite integrals via the Fundamental Theorem.',
    sections: [
      {
        id: 'sec-calc-1',
        heading: '1. Limits and The Definition of The Derivative',
        content: `Calculus is the mathematical study of continuous change. While algebra studies static relationships, calculus quantifies dynamic rates of change and accumulated quantities.

### Definition of a Limit:
We write lim_{x -> c} f(x) = L to mean that as x approaches the real number c from both the left (x -> c^-) and the right (x -> c^+), the function values f(x) get arbitrarily close to L.

### The Derivative from First Principles:
The derivative f'(x) measures the instantaneous rate of change of f(x) at any point x, geometrically representing the tangent slope:
f'(x) = lim_{h -> 0} [f(x + h) - f(x)] / h`,
        callout: {
          type: 'formula',
          title: 'First Principles Definition',
          body: 'dy/dx = lim_{Δx -> 0} (Δy / Δx) = lim_{h -> 0} [f(x + h) - f(x)] / h'
        }
      },
      {
        id: 'sec-calc-2',
        heading: '2. Standard Rules of Differentiation',
        content: `Rather than computing limits from first principles each time, we rely on established differentiation rules:

1. Power Rule: d/dx [x^n] = n * x^(n - 1)
2. Constant Multiple: d/dx [c * f(x)] = c * f'(x)
3. Sum and Difference: d/dx [f(x) ± g(x)] = f'(x) ± g'(x)
4. Product Rule: d/dx [u * v] = u * (dv/dx) + v * (du/dx)
5. Quotient Rule: d/dx [u / v] = [v * (du/dx) - u * (dv/dx)] / (v^2)
6. Chain Rule (Composite Functions): d/dx [f(g(x))] = f'(g(x)) * g'(x)

#### Worked Example with Chain Rule:
Differentiate y = (3x^2 + 5)^4:
Let u = 3x^2 + 5  =>  du/dx = 6x
Then y = u^4      =>  dy/du = 4u^3
By Chain Rule: dy/dx = (dy/du) * (du/dx) = 4(3x^2 + 5)^3 * (6x) = 24x(3x^2 + 5)^3`,
        callout: {
          type: 'tip',
          title: 'Quotient Rule Mnemonic',
          body: 'Remember: "Low d-High minus High d-Low, over the square of what\'s below" -> (v * u\' - u * v\') / v^2.'
        }
      },
      {
        id: 'sec-calc-3',
        heading: '3. Integral Calculus & The Fundamental Theorem',
        content: `Integration is the inverse operation of differentiation (antiderivative) and geometrically calculates the net signed area beneath a curve.

### Fundamental Theorem of Calculus (FTC):
If f is continuous on [a, b] and F is an antiderivative of f such that F'(x) = f(x):
∫_{a}^{b} f(x) dx = F(b) - F(a)

### Essential Indefinite Integrals:
* ∫ x^n dx = [x^(n+1)] / (n + 1) + C  (for n ≠ -1)
* ∫ (1 / x) dx = ln|x| + C
* ∫ e^(kx) dx = (1/k) * e^(kx) + C
* ∫ cos(x) dx = sin(x) + C
* ∫ sin(x) dx = -cos(x) + C`
      }
    ],
    keyTerms: [
      { term: 'Derivative', definition: 'The instantaneous rate of change of a function with respect to one of its variables; geometrically the slope of the tangent line.' },
      { term: 'Integral', definition: 'A mathematical object representing the accumulation of quantities, such as areas under curves or displacement from velocity.' },
      { term: 'Chain Rule', definition: 'A formula for computing the derivative of the composition of two or more functions: (f ∘ g)\'(x) = f\'(g(x)) · g\'(x).' },
      { term: 'Fundamental Theorem of Calculus', definition: 'The theorem connecting differentiation with integration, stating that definite integrals can be computed using antiderivatives.' }
    ],
    comprehensionQuiz: [
      {
        question: 'Using the Power Rule, what is the derivative of f(x) = 4x^3 - 5x^2 + 7x - 9 with respect to x?',
        options: ['12x^2 - 10x + 7', '12x^3 - 10x^2 + 7', '4x^2 - 5x + 7', '12x^2 - 10x'],
        correctIndex: 0,
        explanation: 'Applying d/dx [x^n] = n*x^(n-1): d/dx[4x^3] = 12x^2, d/dx[-5x^2] = -10x, d/dx[7x] = 7, d/dx[-9] = 0. Total = 12x^2 - 10x + 7.'
      },
      {
        question: 'According to the Fundamental Theorem of Calculus, how is the definite integral ∫_{a}^{b} f(x) dx evaluated if F\'(x) = f(x)?',
        options: ['F(a) + F(b)', 'F(b) - F(a)', 'F\'(b) / F\'(a)', 'F(a) * F(b)'],
        correctIndex: 1,
        explanation: 'FTC states that the definite integral equals the antiderivative evaluated at the upper bound minus the lower bound: F(b) - F(a).'
      }
    ]
  },
  {
    id: 'doc-cbt-exam-strategy-01',
    title: 'National CBT Examination Strategy & Speed-Accuracy Blueprint',
    subtitle: 'Tactics for BECE, WAEC, NECO and JAMB Computer-Based Testing Success',
    subjectId: 'cbt_strategy',
    subjectName: 'CBT Academic Strategy',
    courseCode: 'CBT-PRO-101',
    fileType: 'DOCX',
    category: 'Examination Syllabus',
    author: 'Course Guide (Official Recorded Voice)',
    authorTitle: 'Director of Testing & Student Guidance',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    readingTimeMinutes: 10,
    gradeLevel: 'All Grade Levels / Examination Candidates',
    publishedDate: '2026 Academic Session',
    tags: ['CBT Exam', 'Time Management', 'Flagging Strategy', 'Elimination Technique', 'Accuracy'],
    summary: 'A battle-tested strategic blueprint on tackling Computer-Based Tests: managing time allocations per question, flagging uncertain questions, and maintaining calm focus under timed pressure.',
    sections: [
      {
        id: 'sec-cbt-1',
        heading: '1. The Three-Pass CBT Answering Technique',
        content: `Never answer CBT examination questions linearly in a single rigid pass. High-scoring candidates use the Three-Pass Strategy:

1. Pass 1 (Instant Wins - 40% of time): Answer all questions you know with 100% certainty immediately. If a question requires heavy multi-step calculation or creates hesitation, flag it and move on instantly.
2. Pass 2 (Calculations & Analytical Review - 40% of time): Return to flagged questions. Work through mathematical derivations, algebraic substitutions, and multi-sentence comprehension passages with focused clarity.
3. Pass 3 (Final Verification & Zero Unanswered - 20% of time): Ensure every single question has a selected response (there is no penalty for guessing on most standard exams). Double check for mis-clicks before final submission.`,
        callout: {
          type: 'tip',
          title: 'Speed Target',
          body: 'Aim for 45 to 60 seconds maximum per multiple-choice question in Pass 1. This banks a generous 15-20 minute reserve for the final review pass.'
        }
      },
      {
        id: 'sec-cbt-2',
        heading: '2. Process of Elimination (PoE)',
        content: `When faced with a difficult question:
* Rule out obvious distractors first.
* Look for absolute words like "always", "never", "impossible" which often indicate false assertions.
* Identify dimensional/unit mismatches in mathematical or science calculations.`
      }
    ],
    keyTerms: [
      { term: 'Flag for Review', definition: 'A CBT tool allowing candidates to bookmark questions to easily revisit them prior to final submission.' },
      { term: 'Pacing Metric', definition: 'The target time allocation (e.g. 50 seconds/question) required to finish with time to spare.' }
    ],
    comprehensionQuiz: [
      {
        question: 'In the Three-Pass CBT strategy, what should you do when encountering a long, complex calculation in Pass 1?',
        options: ['Spend 10 minutes solving it right away', 'Leave it and submit the test without answering', 'Flag the question for Pass 2 and continue solving immediate questions', 'Randomly click an answer and never look back'],
        correctIndex: 2,
        explanation: 'Flagging the question preserves time for quick wins in Pass 1 while guaranteeing dedicated focused time in Pass 2.'
      }
    ]
  }
];

export function getEducationalDocumentsBySubject(subjectId?: string): EducationalDocument[] {
  if (!subjectId || subjectId === 'all') {
    return EDUCATIONAL_DOCUMENTS;
  }
  return EDUCATIONAL_DOCUMENTS.filter(doc => doc.subjectId === subjectId || doc.subjectId === 'cbt_strategy');
}

export function getEducationalDocumentById(documentId: string): EducationalDocument | undefined {
  return EDUCATIONAL_DOCUMENTS.find(doc => doc.id === documentId);
}
