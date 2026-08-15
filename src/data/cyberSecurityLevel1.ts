import { CyberLessonCourse } from '../types';
import { CYBER_REVISED_NOTES } from './cyberRevisedLessonNotes';

export const CYBER_LEVEL_1: CyberLessonCourse = {
  id: 'cyber-lvl-1',
  code: 'SEC-101',
  title: 'Level 1: Cybersecurity Foundations & Digital Safety',
  level: 'level1_fundamentals',
  levelLabel: 'Level 1: Foundations & Digital Hygiene',
  targetAudience: 'Primary & Junior Secondary (Basic 4 - JSS3) & Beginners',
  badgeTitle: '🛡️ Certified Cyber Guardian (Level 1)',
  durationWeeks: 4,
  summary: 'Foundational introduction to cybersecurity, personal digital safety, password entropy, social engineering awareness, and malware defenses.',
  keyStandards: [
    'CIA Triad (Confidentiality, Integrity, Availability)',
    'NIST Digital Identity Guidelines (SP 800-63)',
    'Safe Online Navigation & Personal Data Protection'
  ],
  practicalLabTitle: 'Password Entropy Lab & Phishing Email Diagnostic',
  practicalLabGuide: 'Analyze real-world password strength equations and inspect sample suspicious emails for fake domains and malicious links.',
  weeklySchedule: [
    {
      weekNumber: 1,
      weekTitle: 'Introduction to Cybersecurity & The CIA Triad',
      weeklyObjective: 'Understand the fundamental goals of information security and apply Confidentiality, Integrity, and Availability to daily digital systems.',
      focusSubtopics: [
        'Defining Cybersecurity & threat actors (Script Kiddies vs. APTs)',
        'The CIA Triad: Confidentiality, Integrity, Availability breakdown',
        'Authentication vs. Authorization principles',
        'Real-world consequences of cyber breaches'
      ],
      handsOnActivity: 'Classify 5 real-world security incidents into violations of Confidentiality, Integrity, or Availability.',
      outlineSourceNotes: 'Confidentiality ensures information is accessible only to authorized users (encryption, access controls). Integrity guarantees data remains accurate, unmodified, and trustworthy (hashing, checksums). Availability guarantees authorized users have timely access to resources (backups, redundancy, DDoS protection).',
      revisedNotes: CYBER_REVISED_NOTES['sec101-w1'],
      keyTakeaways: [
        'Security is a continuous process, not a one-time product.',
        'The CIA Triad forms the bedrock of every security architecture.',
        'Breaching integrity means data has been tampered with or corrupted.'
      ],
      status: 'completed',
      gradeLevelTest: {
        testId: 'sec101-w1-test',
        title: 'Week 1 Grade Level Test: Foundations & The CIA Triad',
        totalQuestions: 10,
        passingScore: 7,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 1,
            question: 'Which component of the CIA Triad is violated if an unauthorized person reads a confidential exam paper?',
            options: ['Integrity', 'Confidentiality', 'Availability', 'Non-repudiation'],
            correctAnswer: 1,
            explanation: 'Confidentiality is broken whenever unauthorized entities gain access to restricted data or private information.',
            outlineReference: 'Section 1.1: The CIA Triad Core Pillars'
          },
          {
            id: 2,
            question: 'A hacker modifies a student grade database from C to A+. Which security principle was directly compromised?',
            options: ['Availability', 'Confidentiality', 'Integrity', 'Scalability'],
            correctAnswer: 2,
            explanation: 'Integrity is violated when data is improperly altered, falsified, or tampered with by unauthorized parties.',
            outlineReference: 'Section 1.1: Data Integrity & Tamper Resistance'
          },
          {
            id: 3,
            question: 'A Distributed Denial of Service (DDoS) attack overwhelms a school web server, causing it to crash. Which pillar is affected?',
            options: ['Availability', 'Confidentiality', 'Integrity', 'Authentication'],
            correctAnswer: 0,
            explanation: 'Availability ensures systems and services are accessible to authorized users when needed; DDoS directly prevents legitimate access.',
            outlineReference: 'Section 1.1: Availability and Uptime Guarantees'
          },
          {
            id: 4,
            question: 'What is the primary difference between Authentication and Authorization?',
            options: [
              'Authentication determines what you can access; Authorization verifies who you are',
              'Authentication verifies who you are; Authorization determines what permissions you have',
              'They are completely identical terms in cybersecurity',
              'Authentication uses passwords; Authorization never uses software'
            ],
            correctAnswer: 1,
            explanation: 'Authentication answers "Who are you?" (proving identity), while Authorization answers "What are you permitted to do?".',
            outlineReference: 'Section 1.2: Access Control Basics'
          },
          {
            id: 5,
            question: 'Which of the following is considered a primary goal of Information Security?',
            options: [
              'Making computers run at the highest possible clock speed',
              'Eliminating the need for software updates forever',
              'Protecting information assets from unauthorized access, alteration, and disruption',
              'Allowing all users on the internet full administrative access'
            ],
            correctAnswer: 2,
            explanation: 'Cybersecurity focuses on defending digital assets, hardware, networks, and data from threats and illicit disruption.',
            outlineReference: 'Section 1.0: Definition of Cybersecurity'
          },
          {
            id: 6,
            question: 'What is a "Threat Actor" in cybersecurity terminology?',
            options: [
              'An actor performing in a cybersecurity movie',
              'An individual or entity responsible for an event that impacts or can impact security',
              'An antivirus software application',
              'A hardware router'
            ],
            correctAnswer: 1,
            explanation: 'A threat actor (or adversary) is any person or group that poses a threat to digital assets or operations.',
            outlineReference: 'Section 1.3: Threat Actors Taxonomy'
          },
          {
            id: 7,
            question: 'Which cryptographic mechanism is most commonly used to verify the Integrity of downloaded files?',
            options: ['Cryptographic Hash (e.g., SHA-256)', 'Screen Resolution', 'Screen Brightness', 'Browser History'],
            correctAnswer: 0,
            explanation: 'A cryptographic hash produces a unique fingerprint of a file; any change in file content alters the hash completely.',
            outlineReference: 'Section 1.1: Integrity Verification Tools'
          },
          {
            id: 8,
            question: 'What does "Non-Repudiation" guarantee in digital transactions and messaging?',
            options: [
              'The author or sender cannot deny having sent the message',
              'The recipient does not have to pay for the internet service',
              'The password is never longer than 4 characters',
              'The device will never experience hardware crashes'
            ],
            correctAnswer: 0,
            explanation: 'Non-repudiation ensures a party cannot deny the authenticity of their signature or sending a digital transaction.',
            outlineReference: 'Section 1.4: Non-repudiation & Auditing'
          },
          {
            id: 9,
            question: 'Which of the following is an example of an Availability control?',
            options: [
              'Automated offsite data backups and redundant power generators (UPS)',
              'Writing passwords on a sticky note on the monitor',
              'Disabling antivirus definitions',
              'Sharing administrator credentials with classmates'
            ],
            correctAnswer: 0,
            explanation: 'Redundant servers, power supplies, and frequent backups safeguard availability during hardware or network failures.',
            outlineReference: 'Section 1.1: Availability Countermeasures'
          },
          {
            id: 10,
            question: 'Why is user security awareness training critical for an organization?',
            options: [
              'Humans are often targeted by social engineers as the weakest link in security',
              'It allows users to bypass all computer firewalls',
              'It makes computers immune to physical hardware wear',
              'It eliminates the need for software licenses'
            ],
            correctAnswer: 0,
            explanation: 'Human behavior is a prime target for attackers through social engineering; awareness education mitigates human risk.',
            outlineReference: 'Section 1.5: Human Factors in Security'
          }
        ]
      }
    },
    {
      weekNumber: 2,
      weekTitle: 'Password Entropy, Authentication & MFA Hygiene',
      weeklyObjective: 'Master the mechanics of password strength, brute-force resistance, credential stuffing defenses, and Multi-Factor Authentication (MFA).',
      focusSubtopics: [
        'Password entropy calculations and length vs complexity',
        'Common attacks: Dictionary attacks, Brute force, Credential stuffing',
        'Multi-Factor Authentication (MFA) factors: Something you know, have, are',
        'Password managers and secure credential storage'
      ],
      handsOnActivity: 'Calculate password entropy using Shannon entropy formula and test resistance against a dictionary attack table.',
      outlineSourceNotes: 'Password length increases entropy exponentially compared to character complexity. Multi-Factor Authentication requires at least two independent authentication factors (Knowledge, Possession, Inherence). SMS-based 2FA is vulnerable to SIM swapping; authenticator apps (TOTP) and hardware keys (FIDO2/WebAuthn) offer superior security.',
      revisedNotes: CYBER_REVISED_NOTES['sec101-w2'],
      keyTakeaways: [
        'A 16-character passphrase is vastly stronger than an 8-character complex code.',
        'Never reuse passwords across multiple digital accounts.',
        'MFA blocks over 99% of automated credential stuffing attacks.'
      ],
      status: 'current',
      gradeLevelTest: {
        testId: 'sec101-w2-test',
        title: 'Week 2 Grade Level Test: Passwords & Multi-Factor Authentication',
        totalQuestions: 10,
        passingScore: 7,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 1,
            question: 'Which mathematical property has the greatest impact on increasing password cracking resistance?',
            options: ['Total Password Length', 'Using uppercase letters only', 'Changing fonts in browser', 'Typing speed'],
            correctAnswer: 0,
            explanation: 'Entropy scales exponentially with password length ($N^L$ where $L$ is length), making long passphrases exponentially harder to crack.',
            outlineReference: 'Section 2.1: Password Entropy & Combinatorics'
          },
          {
            id: 2,
            question: 'Which of the following represents the three classic factors of Multi-Factor Authentication?',
            options: [
              'Something you know, something you have, something you are',
              'Username, Email address, Telephone number',
              'Laptop, Tablet, Smartphone',
              'Wi-Fi password, Router IP, MAC address'
            ],
            correctAnswer: 0,
            explanation: 'The three classic authentication factors are Knowledge (PIN/password), Possession (Security key/phone), and Inherence (Biometric fingerprint/face).',
            outlineReference: 'Section 2.3: Multi-Factor Authentication Pillars'
          },
          {
            id: 3,
            question: 'Fingerprint scanning and facial recognition belong to which authentication factor category?',
            options: ['Something you are (Inherence)', 'Something you know (Knowledge)', 'Something you have (Possession)', 'Something you buy'],
            correctAnswer: 0,
            explanation: 'Biometric attributes unique to a person’s biology belong to the "Something you are" (Inherence) factor.',
            outlineReference: 'Section 2.3: Inherence Factor & Biometrics'
          },
          {
            id: 4,
            question: 'What is a "Credential Stuffing" attack?',
            options: [
              'Automated injection of stolen username/password pairs across hundreds of websites',
              'Physically stuffing papers into a hard drive slot',
              'Writing passwords into a text file on the desktop',
              'Using high-speed cooling fans to prevent overheating'
            ],
            correctAnswer: 0,
            explanation: 'Credential stuffing relies on automated tools testing breached password lists across unrelated websites where users reused credentials.',
            outlineReference: 'Section 2.2: Automated Authentication Attacks'
          },
          {
            id: 5,
            question: 'Why is sending one-time passcodes via SMS considered less secure than using an Authenticator App (TOTP)?',
            options: [
              'SMS is susceptible to SIM-swapping attacks and mobile network interception',
              'SMS passcodes expire after 10 years',
              'Authenticator apps require physical paper',
              'SMS requires special quantum computers to read'
            ],
            correctAnswer: 0,
            explanation: 'SIM-swapping and SS7 signaling vulnerabilities allow threat actors to intercept SMS verification codes.',
            outlineReference: 'Section 2.4: MFA Protocols & Vulnerabilities'
          },
          {
            id: 6,
            question: 'Which of the following is considered the most secure passphrase strategy?',
            options: [
              'Four or five random, unrelated words (e.g., "correct-horse-battery-staple")',
              'Using your birth year with an exclamation mark',
              'The word "password123"',
              'Your pet\'s name backwards'
            ],
            correctAnswer: 0,
            explanation: 'Long diceware passphrases made of random words provide high mathematical entropy while remaining easy to remember.',
            outlineReference: 'Section 2.1: Passphrase Generation Techniques'
          },
          {
            id: 7,
            question: 'What is the primary function of a dedicated Password Manager (e.g. Bitwarden, 1Password)?',
            options: [
              'To generate and securely store unique, complex passwords in an encrypted vault',
              'To post your passwords onto social media for safekeeping',
              'To speed up computer processor clock cycles',
              'To automatically email passwords to strangers'
            ],
            correctAnswer: 0,
            explanation: 'Password managers store unique credentials in zero-knowledge encrypted vaults, eliminating the need to reuse weak passwords.',
            outlineReference: 'Section 2.5: Password Vaults & Cryptographic Enclaves'
          },
          {
            id: 8,
            question: 'What happens during a "Brute Force" password attack?',
            options: [
              'The attacker programmatically attempts every possible combination of characters until the correct one is found',
              'The attacker smashes the computer with physical force',
              'The attacker guesses the password on the phone with the user',
              'The attacker downloads games to slow down the server'
            ],
            correctAnswer: 0,
            explanation: 'Brute force exhaustively tries all mathematical character permutations until the matching hash or key is discovered.',
            outlineReference: 'Section 2.2: Brute Force Cryptanalysis'
          },
          {
            id: 9,
            question: 'What is "Account Lockout Policy" and why is it effective against brute force attacks?',
            options: [
              'It temporarily disables account login attempts after a set number of failed tries',
              'It permanently deletes the computer hard drive',
              'It increases the internet bandwidth speed',
              'It changes the user’s username to random numbers'
            ],
            correctAnswer: 0,
            explanation: 'Account lockout and rate limiting throttle online guessing attacks by freezing access after repeated incorrect attempts.',
            outlineReference: 'Section 2.2: Rate Limiting & Throttling Mechanisms'
          },
          {
            id: 10,
            question: 'What is the "Zero-Knowledge" architecture in password managers?',
            options: [
              'Even the server provider cannot decrypt or see your stored master password or vault data',
              'The user knows zero passwords',
              'The computer does not need an operating system',
              'The software operates without any electrical power'
            ],
            correctAnswer: 0,
            explanation: 'Zero-knowledge encryption ensures client-side key derivation (e.g., Argon2/PBKDF2) so master keys are never transmitted to server providers.',
            outlineReference: 'Section 2.5: Zero-Knowledge Cryptographic Architecture'
          }
        ]
      }
    },
    {
      weekNumber: 3,
      weekTitle: 'Social Engineering, Phishing, Smishing & Vishing',
      weeklyObjective: 'Identify psychological manipulation vectors used by cybercriminals to deceive individuals into handing over confidential assets.',
      focusSubtopics: [
        'Principles of Social Engineering: Urgency, Authority, Fear, Scarcity',
        'Phishing (Email), Spear Phishing, and Whaling',
        'Smishing (SMS) and Vishing (Voice/Deepfake AI)',
        'URL analysis: Spoofed domains, punycode attacks, and HTTPS misconceptions'
      ],
      handsOnActivity: 'Inspect 4 real-world email headers and URLs to spot typosquatting, sender spoofing, and rogue redirection links.',
      outlineSourceNotes: 'Social engineering exploits cognitive biases rather than technical vulnerabilities. Phishing attacks frequently leverage artificial urgency ("Account suspended in 24 hours!") and forged authority headers. The presence of HTTPS/SSL (padlock icon) indicates encrypted transit, NOT that the website owner is legitimate or benevolent.',
      revisedNotes: CYBER_REVISED_NOTES['sec101-w3'],
      keyTakeaways: [
        'An HTTPS padlock icon only guarantees encryption, not trustworthiness.',
        'Always independently verify urgent financial or credential requests via out-of-band communication.',
        'Spear phishing targets specific individuals using personalized intelligence.'
      ],
      status: 'upcoming',
      gradeLevelTest: {
        testId: 'sec101-w3-test',
        title: 'Week 3 Grade Level Test: Social Engineering & Phishing Defenses',
        totalQuestions: 10,
        passingScore: 7,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 1,
            question: 'What is the primary weapon exploited in Social Engineering attacks?',
            options: ['Human psychology and cognitive manipulation', 'Binary buffer overflows', 'Fiber optic cables', 'Computer power supplies'],
            correctAnswer: 0,
            explanation: 'Social engineering manipulates human tendencies like trust, urgency, fear, and curiosity to bypass technical controls.',
            outlineReference: 'Section 3.1: Social Engineering Psychological Vectors'
          },
          {
            id: 2,
            question: 'What is "Spear Phishing"?',
            options: [
              'A targeted phishing attack customized with personal information for a specific individual or organization',
              'Throwing fishing spears at server hardware',
              'Mass untargeted spam sent to 10 million random email addresses',
              'A computer virus that only infects maritime computers'
            ],
            correctAnswer: 0,
            explanation: 'Unlike bulk spam, spear phishing is highly customized using reconnaissance data about the specific target.',
            outlineReference: 'Section 3.2: Targeted Phishing Strategies'
          },
          {
            id: 3,
            question: 'What is a "Whaling" attack in cybersecurity?',
            options: [
              'A phishing attack specifically targeting high-profile corporate executives (CEOs, CFOs) or government leaders',
              'An attack against oceanographic databases',
              'Downloading very large files from the web',
              'Encrypting an entire datacenter with ransomware'
            ],
            correctAnswer: 0,
            explanation: 'Whaling is spear phishing aimed at the "biggest fish"—C-level executives with high-level access and financial authorization.',
            outlineReference: 'Section 3.2: Executive Whaling Threats'
          },
          {
            id: 4,
            question: 'What does "Smishing" refer to?',
            options: [
              'Phishing conducted via Short Message Service (SMS / Text messages)',
              'Phishing through physical postal mail',
              'Smashing a computer screen',
              'Scanning network ports'
            ],
            correctAnswer: 0,
            explanation: 'Smishing is the fusion of SMS + Phishing, tricking victims via malicious text messages with fraudulent links.',
            outlineReference: 'Section 3.3: Mobile Attack Vectors (Smishing & Vishing)'
          },
          {
            id: 5,
            question: 'Does the padlock icon (HTTPS) in a browser guarantee that a website is 100% safe and trustworthy?',
            options: [
              'No, it only means the connection between browser and server is encrypted; scammers can also register HTTPS certificates',
              'Yes, HTTPS is only given to government-certified safe websites',
              'Yes, it guarantees no hacker can ever create fake content on that server',
              'No, it means the website has no firewall'
            ],
            correctAnswer: 0,
            explanation: 'HTTPS encrypts data in transit but does not validate the moral intentions or legitimacy of the website creator.',
            outlineReference: 'Section 3.4: HTTPS vs Domain Trustworthiness'
          },
          {
            id: 6,
            question: 'What is "Typosquatting" (URL Hijacking)?',
            options: [
              'Registering domain names deliberately misspelled to mimic popular websites (e.g., paypa1.com instead of paypal.com)',
              'Typing faster than 100 words per minute',
              'Squatting in front of a keyboard during an exam',
              'Deleting misspelled files'
            ],
            correctAnswer: 0,
            explanation: 'Typosquatting catches users who make typographic mistakes in browser address bars, redirecting them to malicious clones.',
            outlineReference: 'Section 3.4: Domain Spoofing & Typosquatting'
          },
          {
            id: 7,
            question: 'Which emotional trigger is most commonly fabricated in urgent phishing messages?',
            options: [
              'Artificial urgency and fear of negative consequences ("Your account will be terminated in 1 hour!")',
              'Boredom and relaxation',
              'Academic curiosity about ancient history',
              'Desire to upgrade computer cooling'
            ],
            correctAnswer: 0,
            explanation: 'Attackers create false urgency to pressure victims into acting hastily without evaluating the authenticity of the message.',
            outlineReference: 'Section 3.1: Psychological Triggers in Cyber Fraud'
          },
          {
            id: 8,
            question: 'What is "Vishing"?',
            options: [
              'Voice phishing conducted over telephone calls or using AI-generated deepfake voice clones',
              'Visual phishing using neon banners',
              'Virtual reality video games',
              'Scanning for wireless access points'
            ],
            correctAnswer: 0,
            explanation: 'Vishing (Voice + Phishing) uses phone calls or synthesized voice cloning to extract sensitive credentials or money transfers.',
            outlineReference: 'Section 3.3: Vishing & AI Voice Impersonation'
          },
          {
            id: 9,
            question: 'What is "Pretexting" in a social engineering campaign?',
            options: [
              'Inventing an elaborate fictitious scenario or persona to manipulate the target into disclosing information',
              'Writing text messages before sleeping',
              'Sending text messages before calling',
              'Testing network latency before connecting'
            ],
            correctAnswer: 0,
            explanation: 'Pretexting establishes a credible fake backstory (e.g., posing as an IT technician or auditor) to disarm victim suspicion.',
            outlineReference: 'Section 3.1: Pretexting Scenarios & Personas'
          },
          {
            id: 10,
            question: 'What is the recommended first action if you suspect an email asking for school account credentials is a phishing attempt?',
            options: [
              'Do not click any links, do not download attachments, and report the email to the school IT security department',
              'Reply to the email asking the hacker to be nice',
              'Forward the email to all classmates',
              'Click the link to verify if it asks for a password'
            ],
            correctAnswer: 0,
            explanation: 'Reporting suspicious communications to security personnel protects both the individual and the wider organization network.',
            outlineReference: 'Section 3.5: Incident Reporting & Phishing Triage'
          }
        ]
      }
    },
    {
      weekNumber: 4,
      weekTitle: 'Malware Taxonomy, Ransomware Defenses & Safe Browsing',
      weeklyObjective: 'Understand how malicious software infects operating systems, distinguish between malware classifications, and implement layered endpoint defenses.',
      focusSubtopics: [
        'Malware Taxonomy: Viruses, Worms, Trojans, Ransomware, Spyware, Rootkits',
        'Infection vectors: Drive-by downloads, malicious email attachments, USB drops',
        'Ransomware mechanics and 3-2-1 Backup Strategy',
        'Endpoint Antivirus/EDR heuristics vs Signature-based detection'
      ],
      handsOnActivity: 'Simulate file integrity verification and design a resilient 3-2-1 offline backup plan against ransomware encryption.',
      outlineSourceNotes: 'Viruses require a host file and human execution; Worms self-replicate autonomously across network vulnerabilities. Ransomware encrypts victim files with asymmetric/symmetric hybrid keys and demands extortion payments. The 3-2-1 backup rule (3 copies, 2 different media, 1 offsite/immutable) is the most reliable defense against ransomware.',
      revisedNotes: CYBER_REVISED_NOTES['sec101-w4'],
      keyTakeaways: [
        'Never pay ransoms; payment does not guarantee decryption key recovery.',
        'Worms spread automatically across networks without user interaction.',
        'Maintain immutable, disconnected offline backups to defeat ransomware.'
      ],
      status: 'upcoming',
      gradeLevelTest: {
        testId: 'sec101-w4-test',
        title: 'Week 4 Grade Level Test: Malware Taxonomy & Ransomware Protection',
        totalQuestions: 10,
        passingScore: 7,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 1,
            question: 'What is the key technical difference between a Computer Virus and a Computer Worm?',
            options: [
              'A virus requires human interaction to execute and spread, while a worm replicates autonomously across networks',
              'A virus only attacks Linux; a worm only attacks Windows',
              'A worm is always harmless; a virus is always destructive',
              'There is no technical difference between them'
            ],
            correctAnswer: 0,
            explanation: 'Worms exploit network vulnerabilities to propagate automatically without requiring users to run host files.',
            outlineReference: 'Section 4.1: Virus vs Worm Autonomous Propagation'
          },
          {
            id: 2,
            question: 'What is a "Trojan Horse" in the context of computer security?',
            options: [
              'Malware disguised as legitimate or useful software that conceals malicious functionality',
              'A giant wooden horse placed in a server room',
              'An antivirus program that works in Greece',
              'A physical hard drive component'
            ],
            correctAnswer: 0,
            explanation: 'Inspired by Greek mythology, Trojan malware tricks victims into running it by masquerading as genuine applications.',
            outlineReference: 'Section 4.1: Trojan Payloads & Deception'
          },
          {
            id: 3,
            question: 'How does Ransomware typically operate once executed on an endpoint?',
            options: [
              'It encrypts the victim\'s files using strong cryptography and demands payment for the decryption key',
              'It permanently speeds up the computer processor',
              'It increases monitor resolution',
              'It cleans the temporary browser cache'
            ],
            correctAnswer: 0,
            explanation: 'Ransomware locks victim data with asymmetric/symmetric encryption and blackmails the victim for financial extortion.',
            outlineReference: 'Section 4.2: Ransomware Cryptographic Execution'
          },
          {
            id: 4,
            question: 'What does the "3-2-1 Backup Strategy" mandate for data disaster recovery?',
            options: [
              '3 copies of data, across 2 different media types, with 1 copy stored offsite or in an immutable cloud repository',
              '3 computers, 2 monitors, 1 keyboard',
              '3 backups per year, 2 in winter, 1 in summer',
              'Backing up files for 3 hours, 2 times a day, on 1 USB drive'
            ],
            correctAnswer: 0,
            explanation: 'The 3-2-1 rule provides robust protection against hardware disaster, fire, theft, and ransomware encryption.',
            outlineReference: 'Section 4.3: Disaster Recovery & The 3-2-1 Rule'
          },
          {
            id: 5,
            question: 'What is "Spyware"?',
            options: [
              'Malware that secretly monitors user activity, keystrokes, and credentials, relaying them to a remote attacker',
              'Software that helps students spy on exam timetables legally',
              'A magnifying glass tool in the operating system',
              'A video player for spy movies'
            ],
            correctAnswer: 0,
            explanation: 'Spyware operates covertly in the background, logging keystrokes (keylogger), webcam feeds, and login secrets.',
            outlineReference: 'Section 4.1: Spyware & Keyloggers'
          },
          {
            id: 6,
            question: 'What is a "Rootkit"?',
            options: [
              'Malicious software engineered to gain unauthorized root/administrative access while concealing its presence from the OS',
              'A garden tool for computer maintenance',
              'A software program to water computers',
              'A backup utility for system fonts'
            ],
            correctAnswer: 0,
            explanation: 'Rootkits modify kernel or OS system calls to subvert detection by standard antivirus and security tools.',
            outlineReference: 'Section 4.1: Kernel-level Rootkits & Persistence'
          },
          {
            id: 7,
            question: 'What is a "Drive-by Download"?',
            options: [
              'An unintended download of malware that occurs automatically merely by visiting a compromised or malicious web page',
              'Downloading files while driving a car',
              'Fast downloads on 5G networks',
              'Downloading files to a flash drive'
            ],
            correctAnswer: 0,
            explanation: 'Drive-by downloads exploit unpatched browser vulnerabilities to install malware without user consent or clicks.',
            outlineReference: 'Section 4.4: Web Exploitation & Drive-by Infiltration'
          },
          {
            id: 8,
            question: 'Why is keeping operating systems and applications updated with security patches essential?',
            options: [
              'Patches fix discovered security vulnerabilities that malware could otherwise exploit',
              'Updates are solely designed to change visual button colors',
              'Updates delete all existing user accounts',
              'Updates reduce internet bandwidth usage to zero'
            ],
            correctAnswer: 0,
            explanation: 'Security patches remediate known software bugs and vulnerabilities (CVEs) before threat actors can weaponize them.',
            outlineReference: 'Section 4.5: Vulnerability Remediation & Patching'
          },
          {
            id: 9,
            question: 'What is a "Zero-Day Vulnerability"?',
            options: [
              'A software security flaw that is unknown to the vendor and has zero days of official patches available',
              'A computer that has been turned on for zero days',
              'A virus that deletes itself at midnight',
              'A software that expires on the first day of the month'
            ],
            correctAnswer: 0,
            explanation: 'Zero-days represent unpatched vulnerabilities exploited in the wild before the software developer has developed a fix.',
            outlineReference: 'Section 4.4: Zero-Day Exploits & Lifecycle'
          },
          {
            id: 10,
            question: 'What is "Signature-Based" versus "Heuristic/Behavioral" antivirus detection?',
            options: [
              'Signature detection checks known file hashes; Heuristic detection analyzes suspicious patterns and actions',
              'Signature detection checks the user\'s physical handwriting; Heuristic checks typing speed',
              'Signature detection only works offline; Heuristic detection only works on printers',
              'They are the exact same algorithm'
            ],
            correctAnswer: 0,
            explanation: 'Signature scanning detects known malware patterns, while behavioral heuristics detect novel, uncataloged zero-day malware.',
            outlineReference: 'Section 4.5: Endpoint Protection Mechanisms'
          }
        ]
      }
    }
  ]
};
