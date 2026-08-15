import { CyberLessonCourse } from '../types';
import { CYBER_REVISED_NOTES } from './cyberRevisedLessonNotes';

export const CYBER_LEVEL_3: CyberLessonCourse = {
  id: 'cyber-lvl-3',
  code: 'SEC-301',
  title: 'Level 3: Ethical Hacking, Web App Security & Threat Hunting',
  level: 'level3_ethical_hacking',
  levelLabel: 'Level 3: Ethical Hacking & Web Security',
  targetAudience: 'Senior Secondary (SSS2 - SSS3), Pre-College & Advanced Students',
  badgeTitle: '🛡️ Certified Ethical Hacker & Web Defender (Level 3)',
  durationWeeks: 4,
  summary: 'In-depth exploration of offensive security methodologies, reconnaissance, OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF), threat hunting with MITRE ATT&CK, and Red vs Blue team exercises.',
  keyStandards: [
    'OWASP Top 10 Web Application Security Risks (2021/2026)',
    'MITRE ATT&CK Enterprise Matrix (Tactics, Techniques & Procedures)',
    'PTES (Penetration Testing Execution Standard) & Ethical Disclosure'
  ],
  practicalLabTitle: 'SQL Injection Remediation & XSS Sanitization Virtual Lab',
  practicalLabGuide: 'Analyze vulnerable source code containing SQL Injection and Cross-Site Scripting flaws; implement parameterized prepared statements and context-aware HTML entity encoding.',
  weeklySchedule: [
    {
      weekNumber: 1,
      weekTitle: 'Ethical Hacking Methodology, Recon & Vulnerability Assessment',
      weeklyObjective: 'Master the phases of authorized penetration testing: Reconnaissance (OSINT), Scanning, Gaining Access, Maintaining Access, and Reporting.',
      focusSubtopics: [
        'Ethical Hacking vs Cybercrime: Legal frameworks, Scope of Work (SOW), and Rules of Engagement (RoE)',
        'Open Source Intelligence (OSINT) and passive information gathering (WHOIS, Shodan, Google Dorking)',
        'Active Scanning: Port enumeration (Nmap), service banner grabbing, and vulnerability scanners (OpenVAS/Nessus)',
        'Penetration Testing Execution Standard (PTES) workflow'
      ],
      handsOnActivity: 'Construct non-intrusive Google Dorks and analyze Nmap service banner outputs to detect outdated software components.',
      outlineSourceNotes: 'Ethical hackers must strictly operate with written authorization and clearly defined Rules of Engagement. Reconnaissance is split into Passive (no direct target interaction, OSINT) and Active (port scanning, banner grabbing). Vulnerability assessment identifies weaknesses; penetration testing validates exploitability and business impact.',
      revisedNotes: CYBER_REVISED_NOTES['sec301-w1'],
      keyTakeaways: [
        'Never scan or test systems without prior written authorization.',
        'Passive reconnaissance gathers threat intelligence without triggering target alarms.',
        'Detailed remediation reporting is the most critical deliverable of a penetration test.'
      ],
      status: 'upcoming',
      gradeLevelTest: {
        testId: 'sec301-w1-test',
        title: 'Week 1 Grade Level Test: Ethical Hacking & Reconnaissance',
        totalQuestions: 10,
        passingScore: 7,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 1,
            question: 'What is the mandatory legal requirement that distinguishes an Ethical Hacker (White Hat) from a Malicious Hacker (Black Hat)?',
            options: [
              'Explicit, formal written authorization and defined Rules of Engagement (RoE) from the system owner',
              'The ethical hacker uses faster computers',
              'The ethical hacker only tests software during the daytime',
              'The ethical hacker does not need passwords'
            ],
            correctAnswer: 0,
            explanation: 'Authorization, agreed scope, and legal compliance define the boundary between ethical penetration testing and criminal intrusion.',
            outlineReference: 'Section 1.1: Legal & Ethical Boundaries in Security'
          },
          {
            id: 2,
            question: 'What is the primary difference between Passive Reconnaissance and Active Reconnaissance?',
            options: [
              'Passive recon gathers data without sending packets directly to the target; Active recon directly probes and interacts with target systems',
              'Passive recon is illegal; Active recon is always legal',
              'Passive recon only works on mobile phones',
              'Active recon never uses the internet'
            ],
            correctAnswer: 0,
            explanation: 'Passive recon uses public OSINT sources (WHOIS, search engines); active recon sends network probes (Nmap, vulnerability scans).',
            outlineReference: 'Section 1.2: Reconnaissance Methodologies'
          },
          {
            id: 3,
            question: 'What is "Google Dorking" (Google Hacking)?',
            options: [
              'Using advanced search operators (e.g., filetype:pdf, inurl:admin, site:) to locate publicly exposed sensitive documents or misconfigured portals',
              'Typing random words into Google search',
              'Installing games through Google Chrome',
              'Cracking Google\'s primary database'
            ],
            correctAnswer: 0,
            explanation: 'Google Dorking leverages specialized search query syntax to discover unindexed or inadvertently exposed configuration files.',
            outlineReference: 'Section 1.2: OSINT & Search Engine Intelligence'
          },
          {
            id: 4,
            question: 'What is the purpose of "Banner Grabbing" during network scanning?',
            options: [
              'Retrieving text responses from listening network services to identify software names and exact version numbers',
              'Downloading website graphic advertising banners',
              'Measuring the physical dimensions of a server rack',
              'Taking screenshots of user desktop wallpapers'
            ],
            correctAnswer: 0,
            explanation: 'Service banners expose software versions (e.g. Apache/2.4.49), revealing known CVE vulnerabilities for exploitation.',
            outlineReference: 'Section 1.3: Service Enumeration & Fingerprinting'
          },
          {
            id: 5,
            question: 'What is a "Rules of Engagement" (RoE) document in a penetration test?',
            options: [
              'A binding agreement specifying allowed testing hours, target IP ranges, forbidden techniques (e.g., no DoS), and emergency contacts',
              'A marriage contract between computer engineers',
              'A user manual for installing video games',
              'A warranty card for computer hardware'
            ],
            correctAnswer: 0,
            explanation: 'The RoE outlines strict operational constraints to prevent accidental outages and ensure safe testing.',
            outlineReference: 'Section 1.1: Rules of Engagement & Scoping'
          },
          {
            id: 6,
            question: 'What is the difference between a Vulnerability Assessment and a Penetration Test?',
            options: [
              'A vulnerability assessment identifies and catalogs known flaws; a penetration test actively exploits flaws to measure real-world impact',
              'A vulnerability assessment is only for hardware; a penetration test is only for phones',
              'They are exact synonyms with no distinction',
              'A penetration test is always fully automated'
            ],
            correctAnswer: 0,
            explanation: 'Assessments produce a broad list of potential vulnerabilities; pen tests chain and exploit them to demonstrate concrete business risk.',
            outlineReference: 'Section 1.4: Assessment vs Exploitation Phases'
          },
          {
            id: 7,
            question: 'What is "Shodan" in cybersecurity intelligence gathering?',
            options: [
              'A specialized search engine that scans and indexes internet-connected IoT devices, open ports, and server configurations worldwide',
              'A martial arts fighting game',
              'A password cracking software',
              'An antivirus application for macOS'
            ],
            correctAnswer: 0,
            explanation: 'Shodan crawls the IPv4 address space, indexing exposed industrial control systems, cameras, routers, and servers.',
            outlineReference: 'Section 1.2: Internet-Wide Device Scanning Engines'
          },
          {
            id: 8,
            question: 'What is "Social Engineering Penetration Testing"?',
            options: [
              'Simulating phishing, pretexting phone calls, or physical badges to evaluate employee security vigilance and organizational training',
              'Creating social media accounts for computers',
              'Building social websites with Python',
              'Testing how fast users reply to messages'
            ],
            correctAnswer: 0,
            explanation: 'Social engineering tests evaluate human risk and organizational compliance with security reporting procedures.',
            outlineReference: 'Section 1.5: Human Security Testing'
          },
          {
            id: 9,
            question: 'What is the primary deliverable of a professional penetration test?',
            options: [
              'A comprehensive, actionable Remediation Report detailing findings, CVSS risk ratings, and technical mitigation instructions',
              'A list of user passwords published on the internet',
              'A receipt for coffee purchases',
              'A deleted company database'
            ],
            correctAnswer: 0,
            explanation: 'The value of a penetration test lies in the executive summary and actionable technical remediation guidance provided to the client.',
            outlineReference: 'Section 1.4: Technical Reporting & Remediation Guidance'
          },
          {
            id: 10,
            question: 'What is "Responsible Disclosure" (Coordinated Vulnerability Disclosure)?',
            options: [
              'Privately reporting a discovered vulnerability to the software vendor and giving them reasonable time to patch before making it public',
              'Selling software bugs on the dark web immediately',
              'Posting zero-day exploit code on social media without warning the vendor',
              'Ignoring software vulnerabilities completely'
            ],
            correctAnswer: 0,
            explanation: 'Responsible disclosure allows vendors to develop and distribute security patches to protect users before flaws are publicly revealed.',
            outlineReference: 'Section 1.1: Vulnerability Disclosure Ethics'
          }
        ]
      }
    },
    {
      weekNumber: 2,
      weekTitle: 'OWASP Top 10: SQL Injection, XSS, CSRF & Broken Auth',
      weeklyObjective: 'Analyze the most critical web application vulnerabilities (OWASP Top 10) and implement secure coding defenses.',
      focusSubtopics: [
        'SQL Injection (SQLi): In-band, Blind, and Time-based; Parameterized queries and ORMs',
        'Cross-Site Scripting (XSS): Stored, Reflected, and DOM-based; Context-aware output encoding',
        'Cross-Site Request Forgery (CSRF) and Anti-CSRF Synchronizer Tokens (SameSite cookies)',
        'Broken Authentication, Session Hijacking, and Insecure Direct Object References (IDOR)'
      ],
      handsOnActivity: 'Review a vulnerable PHP/Node.js login handler: Spot the SQL concatenation flaw `\' OR \'1\'=\'1` and refactor it into a parameterized query.',
      outlineSourceNotes: 'SQL Injection occurs when untrusted user input is directly concatenated into database queries. The universal remediation is Parameterized Prepared Statements. Cross-Site Scripting (XSS) executes malicious JavaScript in victim browsers; defenses require context-aware HTML entity encoding and Content Security Policy (CSP) headers.',
      revisedNotes: CYBER_REVISED_NOTES['sec301-w2'],
      keyTakeaways: [
        'Never concatenate user input directly into SQL database queries.',
        'Use parameterized queries to separate executable code from user data.',
        'Enforce Content Security Policy (CSP) and HttpOnly/SameSite cookie flags.'
      ],
      status: 'upcoming',
      gradeLevelTest: {
        testId: 'sec301-w2-test',
        title: 'Week 2 Grade Level Test: OWASP Top 10 Web Vulnerabilities',
        totalQuestions: 10,
        passingScore: 7,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 1,
            question: 'How does a classic SQL Injection (SQLi) attack bypass authentication?',
            options: [
              'By injecting malicious SQL syntax (e.g. \' OR 1=1 --) into input fields, causing the database to evaluate the query logic as always true',
              'By overloading the database power cable',
              'By deleting the website CSS styling',
              'By guessing the administrator\'s home address'
            ],
            correctAnswer: 0,
            explanation: 'SQLi tricks the SQL interpreter into executing injected commands by breaking out of data context into executable SQL syntax.',
            outlineReference: 'Section 2.1: SQL Injection Mechanics & Exploitation'
          },
          {
            id: 2,
            question: 'What is the definitive, industry-standard defense against SQL Injection vulnerabilities?',
            options: [
              'Parameterized Prepared Statements (Parameterized Queries)',
              'Filtering the word "SELECT" from input with a regular expression',
              'Turning off database backups',
              'Hiding database passwords in JavaScript files'
            ],
            correctAnswer: 0,
            explanation: 'Parameterized queries separate code from data; user input is treated strictly as literal parameters, never as executable SQL code.',
            outlineReference: 'Section 2.1: SQLi Remediation & Parameterization'
          },
          {
            id: 3,
            question: 'What occurs during a Stored (Persistent) Cross-Site Scripting (XSS) attack?',
            options: [
              'Malicious JavaScript is permanently stored in the application database (e.g. in a comment section) and executes when other users view the page',
              'The attacker physically steals the web server computer',
              'The browser window closes automatically',
              'The computer keyboard stops functioning'
            ],
            correctAnswer: 0,
            explanation: 'Stored XSS embeds malicious payloads into persistent data stores, compromising every victim who views the infected page.',
            outlineReference: 'Section 2.2: Cross-Site Scripting (XSS) Classifications'
          },
          {
            id: 4,
            question: 'What protection does the "HttpOnly" cookie flag provide against XSS attacks?',
            options: [
              'It prevents client-side JavaScript (e.g., document.cookie) from accessing the session cookie, stopping session hijacking via XSS',
              'It makes the website load in dark mode',
              'It encrypts the website logo image',
              'It blocks all HTTP traffic on the router'
            ],
            correctAnswer: 0,
            explanation: 'HttpOnly instructs the browser that the cookie cannot be read via JavaScript APIs, mitigating cookie theft during XSS exploits.',
            outlineReference: 'Section 2.4: Cookie Security Flags (HttpOnly, Secure, SameSite)'
          },
          {
            id: 5,
            question: 'What is an "Insecure Direct Object Reference" (IDOR) vulnerability?',
            options: [
              'An application uses user-supplied input to access database objects directly (e.g. /api/user?id=105) without validating user authorization',
              'A broken link in a website footer',
              'A direct connection to a computer monitor',
              'An error in computer memory cache'
            ],
            correctAnswer: 0,
            explanation: 'IDOR allows unauthorized users to manipulate record identifiers in requests to access other users\' private data.',
            outlineReference: 'Section 2.3: Broken Access Control & IDOR'
          },
          {
            id: 6,
            question: 'What is "Cross-Site Request Forgery" (CSRF)?',
            options: [
              'Tricking an authenticated user\'s browser into executing unwanted actions on a trusted web application without their knowledge',
              'Creating a fake website logo',
              'Stealing physical computer cables',
              'Printing fake documents on a network printer'
            ],
            correctAnswer: 0,
            explanation: 'CSRF exploits the trust a web application has in a victim\'s authenticated browser session (automatic cookie submission).',
            outlineReference: 'Section 2.3: CSRF Exploits & State-Changing Requests'
          },
          {
            id: 7,
            question: 'How do Anti-CSRF Synchronizer Tokens prevent CSRF attacks?',
            options: [
              'They require a unique, unpredictable, secret token validated on the server for each state-changing POST/PUT request',
              'They disable all web forms permanently',
              'They log out the user after 2 seconds',
              'They convert all website pages into static images'
            ],
            correctAnswer: 0,
            explanation: 'Attackers cannot forge cross-origin requests containing the unpredictable, cryptographically random CSRF token.',
            outlineReference: 'Section 2.3: CSRF Mitigation & Token Validation'
          },
          {
            id: 8,
            question: 'What is the purpose of a "Content Security Policy" (CSP) HTTP header?',
            options: [
              'Restricting the sources and domains from which scripts, stylesheets, and media can be loaded and executed in the browser',
              'Translating website text into different foreign languages',
              'Charging website visitors a subscription fee',
              'Controlling computer speaker volume'
            ],
            correctAnswer: 0,
            explanation: 'CSP provides defense-in-depth against XSS and data exfiltration by restricting executable script domains.',
            outlineReference: 'Section 2.2: Content Security Policy (CSP) Implementation'
          },
          {
            id: 9,
            question: 'What is "Security Misconfiguration" in the OWASP Top 10?',
            options: [
              'Leaving default credentials enabled, verbose error stack traces exposed, unnecessary ports open, or cloud buckets publicly readable',
              'Having a messy computer desk',
              'Placing computers too close together',
              'Using a mouse with a wire'
            ],
            correctAnswer: 0,
            explanation: 'Security misconfigurations stem from failing to harden default setups or exposing sensitive diagnostic logs to the public.',
            outlineReference: 'Section 2.5: Security Misconfigurations & Cloud S3 Leaks'
          },
          {
            id: 10,
            question: 'What is "Context-Aware Output Encoding" and why is it vital for XSS prevention?',
            options: [
              'Encoding user-supplied data before rendering it (HTML entity encoding, JS escaping) so characters like < and > are treated as text, not code',
              'Compressing files into .zip format',
              'Translating English into French',
              'Changing font sizes in paragraphs'
            ],
            correctAnswer: 0,
            explanation: 'Output encoding neutralizes malicious characters by converting them into harmless display entities (e.g. &lt; instead of <).',
            outlineReference: 'Section 2.2: Output Encoding & Sanitization'
          }
        ]
      }
    },
    {
      weekNumber: 3,
      weekTitle: 'Cyber Threat Intelligence & MITRE ATT&CK Framework',
      weeklyObjective: 'Map adversary Tactics, Techniques, and Procedures (TTPs) using the MITRE ATT&CK framework and evaluate Threat Intelligence feeds.',
      focusSubtopics: [
        'Cyber Threat Intelligence (CTI) tiers: Strategic, Operational, Tactical',
        'The MITRE ATT&CK Framework: 14 Enterprise Tactics (Initial Access to Impact)',
        'Indicators of Compromise (IoCs) vs Indicators of Attack (IoAs)',
        'David Bianco\'s "Pyramid of Pain": Hash Values, IP Addresses to TTPs'
      ],
      handsOnActivity: 'Analyze a simulated malware attack report and map adversary behaviors to MITRE ATT&CK Technique IDs (e.g. T1566 Phishing, T1059 Command and Scripting Interpreter).',
      outlineSourceNotes: 'MITRE ATT&CK documents real-world adversary behavior across 14 tactical phases. The Pyramid of Pain shows that trivial indicators (hash values, IP addresses) are easy for adversaries to change, whereas disrupting adversary Tactics, Techniques, and Procedures (TTPs) inflicts maximum pain on threat actors.',
      revisedNotes: CYBER_REVISED_NOTES['sec301-w3'],
      keyTakeaways: [
        'Adversary TTPs sit at the top of the Pyramid of Pain.',
        'IoCs indicate past breaches; IoAs detect ongoing active attacks.',
        'Threat intelligence transforms reactive security into proactive defense.'
      ],
      status: 'upcoming',
      gradeLevelTest: {
        testId: 'sec301-w3-test',
        title: 'Week 3 Grade Level Test: Threat Intelligence & MITRE ATT&CK',
        totalQuestions: 10,
        passingScore: 7,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 1,
            question: 'In David Bianco\'s "Pyramid of Pain", which indicator level causes the greatest difficulty and disruption for an adversary when detected and denied?',
            options: [
              'TTPs (Tactics, Techniques & Procedures)',
              'Hash Values (MD5/SHA-256)',
              'IP Addresses',
              'Domain Names'
            ],
            correctAnswer: 0,
            explanation: 'TTPs represent the adversary’s fundamental operational methods; denying them forces the attacker to completely relearn skills.',
            outlineReference: 'Section 3.1: The Pyramid of Pain Hierarchy'
          },
          {
            id: 2,
            question: 'What is the primary function of the MITRE ATT&CK Framework?',
            options: [
              'A globally accessible knowledge base of adversary tactics and techniques based on real-world observations for threat modeling and defense mapping',
              'A software program that attacks rival companies',
              'A certificate issued to computer manufacturers',
              'A government tax regulation document'
            ],
            correctAnswer: 0,
            explanation: 'MITRE ATT&CK provides a common taxonomy for describing cyber adversary behaviors across the entire intrusion lifecycle.',
            outlineReference: 'Section 3.2: MITRE ATT&CK Architecture'
          },
          {
            id: 3,
            question: 'What is the distinction between an "Indicator of Compromise" (IoC) and an "Indicator of Attack" (IoA)?',
            options: [
              'An IoC is forensic evidence of a past breach (e.g., malware hash); an IoA focuses on proactive intent and real-time behavioral actions of an active attacker',
              'An IoC is hardware; an IoA is software',
              'An IoA is only used by police departments',
              'There is no technical distinction'
            ],
            correctAnswer: 0,
            explanation: 'IoCs look backward at forensic artifacts (hash, IP); IoAs identify adversary behavioral sequences as they occur.',
            outlineReference: 'Section 3.3: IoCs vs IoAs & Threat Detection'
          },
          {
            id: 4,
            question: 'What does "Strategic Threat Intelligence" provide to an organization?',
            options: [
              'High-level analysis of cyber risks, geopolitical trends, and financial impacts tailored for board members and executive leadership',
              'IP address blocklists for firewall rules',
              'Assembly language decompilation notes',
              'Computer power consumption charts'
            ],
            correctAnswer: 0,
            explanation: 'Strategic CTI informs executive decision-makers about long-term risk posture and threat actor motivations.',
            outlineReference: 'Section 3.4: Tiers of Cyber Threat Intelligence'
          },
          {
            id: 5,
            question: 'Under MITRE ATT&CK, what does the tactic "Initial Access" describe?',
            options: [
              'Techniques that adversaries use to gain an entry foothold inside an organization\'s network (e.g., Spearphishing, Exploit Public App)',
              'Turning on a computer monitor in the morning',
              'Plugging an ethernet cable into a switch',
              'Purchasing a new laptop'
            ],
            correctAnswer: 0,
            explanation: 'Initial Access represents the vector through which an adversary crosses the organizational perimeter boundary.',
            outlineReference: 'Section 3.2: MITRE ATT&CK Enterprise Tactics'
          },
          {
            id: 6,
            question: 'Under MITRE ATT&CK, what does the tactic "Lateral Movement" describe?',
            options: [
              'Techniques an adversary uses to extend access and navigate between different systems and servers across a compromised internal network',
              'Moving a laptop from one desk to another',
              'Scrolling horizontally across a spreadsheet',
              'Shaking a network router'
            ],
            correctAnswer: 0,
            explanation: 'Lateral movement allows attackers to pivot from an initial low-privilege workstation toward high-value target assets (e.g. Domain Controllers).',
            outlineReference: 'Section 3.2: Lateral Movement & Pivoting'
          },
          {
            id: 7,
            question: 'What is an "Advanced Persistent Threat" (APT)?',
            options: [
              'A sophisticated, well-resourced threat actor (often nation-state backed) that conducts prolonged, stealthy cyber espionage campaigns',
              'A computer virus that deletes itself in 5 minutes',
              'An amateur teenager running random scripts',
              'A slow internet connection'
            ],
            correctAnswer: 0,
            explanation: 'APTs maintain stealthy, long-term persistence in targeted networks to extract strategic intelligence over months or years.',
            outlineReference: 'Section 3.4: Advanced Persistent Threats (APTs)'
          },
          {
            id: 8,
            question: 'What is "STIX" (Structured Threat Information Expression) in threat intelligence sharing?',
            options: [
              'A standardized, machine-readable language and serialization format for conveying cyber threat information and intelligence',
              'A physical USB drive with a wooden case',
              'A programming language for video games',
              'A firewall manufactured in Sweden'
            ],
            correctAnswer: 0,
            explanation: 'STIX/TAXII standards enable automated, machine-speed sharing of threat intelligence indicators across security communities.',
            outlineReference: 'Section 3.5: Threat Intelligence Sharing Protocols (STIX/TAXII)'
          },
          {
            id: 9,
            question: 'What is "Threat Hunting"?',
            options: [
              'A proactive, iterative security practice of searching through networks and endpoints to detect stealthy adversaries that evaded automated security tools',
              'Shooting computer screens with laser pointers',
              'Playing video games during office hours',
              'Hunting for old computer cables in storage closets'
            ],
            correctAnswer: 0,
            explanation: 'Threat hunters assume systems are already breached and actively analyze hypotheses and anomalies to find hidden threats.',
            outlineReference: 'Section 3.5: Proactive Threat Hunting Methodologies'
          },
          {
            id: 10,
            question: 'Under MITRE ATT&CK, what is "Exfiltration"?',
            options: [
              'Techniques used by attackers to stealthily steal and transfer sensitive internal data out of the victim\'s network to an external server',
              'Exiting a computer software program',
              'Disconnecting a computer mouse',
              'Printing paper documents'
            ],
            correctAnswer: 0,
            explanation: 'Exfiltration encompasses the compression, encryption, and transmission of stolen proprietary data through covert channels.',
            outlineReference: 'Section 3.2: Exfiltration Channels & Data Theft'
          }
        ]
      }
    },
    {
      weekNumber: 4,
      weekTitle: 'Penetration Testing, Secure Coding & Red vs Blue Drills',
      weeklyObjective: 'Execute Red Team offensive attack simulations, coordinate Blue Team defensive responses, and implement secure Software Development Lifecycle (SSDLC) controls.',
      focusSubtopics: [
        'Red Team (Offensive), Blue Team (Defensive), and Purple Team (Collaborative) functions',
        'Secure Software Development Lifecycle (SSDLC) and DevSecOps principles',
        'Static Application Security Testing (SAST) vs Dynamic Application Security Testing (DAST)',
        'Buffer Overflows, Memory Safety (Rust vs C/C++), and Safe Input Validation'
      ],
      handsOnActivity: 'Analyze a Purple Team exercise matrix: Pair an offensive exploitation technique with its corresponding defensive SIEM detection rule and patch.',
      outlineSourceNotes: 'Purple teaming aligns Red (attack) and Blue (defense) teams in real-time to maximize defensive detection fidelity. DevSecOps integrates automated security testing (SAST/DAST) into CI/CD pipelines. Memory-safe programming languages (Rust, Go) eliminate entire classes of spatial and temporal memory corruption vulnerabilities (buffer overflows, use-after-free).',
      revisedNotes: CYBER_REVISED_NOTES['sec301-w4'],
      keyTakeaways: [
        'Purple Teaming bridges the gap between offensive testing and defensive detection.',
        'Shift-Left Security catches vulnerabilities early in the software design lifecycle.',
        'Memory safety languages prevent over 70% of historical critical CVEs.'
      ],
      status: 'upcoming',
      gradeLevelTest: {
        testId: 'sec301-w4-test',
        title: 'Week 4 Grade Level Test: Penetration Testing & DevSecOps',
        totalQuestions: 10,
        passingScore: 7,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 1,
            question: 'What is the role of a "Purple Team" in enterprise cybersecurity exercises?',
            options: [
              'A collaborative function where Red (Offense) and Blue (Defense) teams work closely together in real-time to optimize detection capabilities and fix gaps',
              'A team that designs purple-colored website graphics',
              'A team responsible for hardware recycling',
              'An external legal department'
            ],
            correctAnswer: 0,
            explanation: 'Purple Teaming fosters active feedback loops between attackers and defenders to continuously enhance detection engineering.',
            outlineReference: 'Section 4.1: Red, Blue & Purple Team Operations'
          },
          {
            id: 2,
            question: 'What is "Shift-Left Security" in the Software Development Life Cycle (SDLC)?',
            options: [
              'Integrating security practices, code reviews, and automated scans early in the design and development phases rather than only at the end',
              'Moving all computer keyboards to the left side of the desk',
              'Only testing code on the left side of the screen',
              'Writing code backwards'
            ],
            correctAnswer: 0,
            explanation: 'Shifting left identifies and fixes security flaws during initial coding, dramatically reducing the financial cost and risk of vulnerabilities.',
            outlineReference: 'Section 4.2: Secure SDLC & DevSecOps'
          },
          {
            id: 3,
            question: 'What is the key difference between SAST (Static Analysis) and DAST (Dynamic Analysis)?',
            options: [
              'SAST inspects source code at rest without executing the program; DAST tests the running application from the outside in real time',
              'SAST only works on static electricity; DAST works on batteries',
              'SAST is manual; DAST is always performed on paper',
              'There is no technical difference between them'
            ],
            correctAnswer: 0,
            explanation: 'SAST analyzes source code syntax trees (white-box); DAST probes running endpoints with live attack inputs (black-box).',
            outlineReference: 'Section 4.2: Automated Security Testing (SAST vs DAST)'
          },
          {
            id: 4,
            question: 'What causes a classic "Buffer Overflow" vulnerability in programming languages like C and C++?',
            options: [
              'Writing more data to a memory buffer than it was allocated to hold, overwriting adjacent memory and potentially corrupting the execution flow',
              'Spilling a beverage on the computer keyboard',
              'Running out of space on a USB flash drive',
              'Having too many browser tabs open'
            ],
            correctAnswer: 0,
            explanation: 'Buffer overflows occur when memory bounds are unvalidated, allowing attackers to overwrite the instruction pointer (EIP/RIP).',
            outlineReference: 'Section 4.3: Memory Corruption & Buffer Overflows'
          },
          {
            id: 5,
            question: 'Why are modern memory-safe programming languages (like Rust) recommended for security-critical software?',
            options: [
              'They prevent memory corruption bugs (buffer overflows, null pointer dereferences, use-after-free) at compile time without performance overhead',
              'They make computer screens brighter',
              'They do not require electricity to run',
              'They automatically create website logos'
            ],
            correctAnswer: 0,
            explanation: 'Memory safety guarantees eliminate over 70% of critical security flaws historically found in C/C++ codebases.',
            outlineReference: 'Section 4.3: Memory Safety Paradigms (Rust vs C++)'
          },
          {
            id: 6,
            question: 'What is "Threat Modeling" (e.g. using the STRIDE framework)?',
            options: [
              'A structured process of identifying, quantifying, and addressing potential security threats and attack surfaces in a system architecture',
              'Taking fashion photos of security guards',
              'Painting 3D models of computers',
              'Testing how fast a hard drive spins'
            ],
            correctAnswer: 0,
            explanation: 'STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) structures threat modeling.',
            outlineReference: 'Section 4.4: Threat Modeling with STRIDE'
          },
          {
            id: 7,
            question: 'What is a "Bug Bounty Program"?',
            options: [
              'A crowdsourced initiative that rewards independent ethical security researchers for responsibly discovering and reporting software bugs',
              'A contest to catch real biological insects in offices',
              'A discount coupon for buying laptops',
              'A penalty fine charged to computer programmers'
            ],
            correctAnswer: 0,
            explanation: 'Bug bounties incentivize global white-hat security researchers to find and report vulnerabilities before malicious actors exploit them.',
            outlineReference: 'Section 4.5: Crowdsourced Security & Bug Bounties'
          },
          {
            id: 8,
            question: 'What is "Fuzz Testing" (Fuzzing)?',
            options: [
              'An automated software testing technique that feeds invalid, unexpected, or random data inputs into a program to monitor for crashes or memory leaks',
              'Cleaning computer fans with a fuzzy brush',
              'Blurring images on a website',
              'Typing random words with closed eyes'
            ],
            correctAnswer: 0,
            explanation: 'Fuzzing discovers zero-day edge-case vulnerabilities and memory leaks by bombarding parsers with mutated binary inputs.',
            outlineReference: 'Section 4.2: Automated Fuzzing & Mutation Testing'
          },
          {
            id: 9,
            question: 'What is "Software Supply Chain Security" and why is it increasingly vital?',
            options: [
              'Verifying and securing third-party open-source libraries, dependencies, and build pipelines to prevent upstream malicious package injection',
              'Ordering physical computer parts from online stores',
              'Ensuring computer delivery trucks have good tires',
              'Buying computers in bulk'
            ],
            correctAnswer: 0,
            explanation: 'Compromising upstream open-source packages (e.g. npm, PyPI) allows attackers to compromise thousands of downstream enterprise applications.',
            outlineReference: 'Section 4.5: Software Bill of Materials (SBOM) & Supply Chain Security'
          },
          {
            id: 10,
            question: 'What is a "Software Bill of Materials" (SBOM)?',
            options: [
              'A formal, machine-readable inventory of all software components, libraries, dependencies, and licenses used in building an application',
              'An invoice sent by an electricity utility company',
              'A physical instruction booklet inside a laptop box',
              'A list of employee salaries in an IT company'
            ],
            correctAnswer: 0,
            explanation: 'SBOMs provide transparent visibility into all nested software dependencies, enabling rapid triage when new CVEs (e.g. Log4Shell) emerge.',
            outlineReference: 'Section 4.5: Software Bill of Materials (SBOM)'
          }
        ]
      }
    }
  ]
};
