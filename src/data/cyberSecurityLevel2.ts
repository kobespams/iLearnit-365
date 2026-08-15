import { CyberLessonCourse } from '../types';
import { CYBER_REVISED_NOTES } from './cyberRevisedLessonNotes';

export const CYBER_LEVEL_2: CyberLessonCourse = {
  id: 'cyber-lvl-2',
  code: 'SEC-201',
  title: 'Level 2: Network Defense, Cryptography & Systems Security',
  level: 'level2_network_defense',
  levelLabel: 'Level 2: Network Defense & Cryptography',
  targetAudience: 'Junior & Senior Secondary (JSS3 - SSS2) & Intermediate Students',
  badgeTitle: '🛡️ Certified Network Defender (Level 2)',
  durationWeeks: 4,
  summary: 'Comprehensive study of network protocols, OSI model security layers, firewalls, intrusion detection/prevention (IDS/IPS), symmetric/asymmetric cryptography, and secure system architectures.',
  keyStandards: [
    'OSI 7-Layer Model & TCP/IP Protocol Suite',
    'NIST SP 800-41 (Guidelines on Firewalls and Firewall Policy)',
    'FIPS 140-3 & Applied Cryptography (AES-256, RSA-4096, SHA-3)'
  ],
  practicalLabTitle: 'Packet Sniffing Diagnostic & Symmetric/Asymmetric Encryption Lab',
  practicalLabGuide: 'Analyze network packet flow (Wireshark simulation), inspect TLS handshakes, and execute AES/RSA cryptographic key exchanges.',
  weeklySchedule: [
    {
      weekNumber: 1,
      weekTitle: 'Network Protocols, IP Addressing & OSI Model Security',
      weeklyObjective: 'Master the 7 layers of the OSI model and identify common network protocol vulnerabilities across TCP, UDP, DNS, and ARP.',
      focusSubtopics: [
        'The OSI 7-Layer Model: Physical, Data Link, Network, Transport, Session, Presentation, Application',
        'TCP 3-Way Handshake (SYN, SYN-ACK, ACK) and SYN Flood vulnerabilities',
        'IPv4 vs IPv6 addressing and Subnetting basics',
        'DNS Spoofing, Cache Poisoning, and ARP Poisoning Man-in-the-Middle (MitM) attacks'
      ],
      handsOnActivity: 'Trace a 3-way TCP handshake in a virtual network diagram and identify open ports (22 SSH, 80 HTTP, 443 HTTPS, 53 DNS).',
      outlineSourceNotes: 'The OSI model isolates network functions into 7 modular layers. Attacks occur at every layer: Layer 2 (ARP spoofing), Layer 3 (IP spoofing, ICMP floods), Layer 4 (SYN floods, port scanning), and Layer 7 (HTTP injections). Understanding transport protocols (TCP reliable connection-oriented vs UDP stateless connectionless) is vital for firewall rule formulation.',
      revisedNotes: CYBER_REVISED_NOTES['sec201-w1'],
      keyTakeaways: [
        'TCP provides reliable packet delivery via 3-way handshakes; UDP is faster but unverified.',
        'DNS translates human domain names into IP addresses; DNSSEC protects against cache poisoning.',
        'ARP poisoning enables Layer 2 Man-in-the-Middle packet interception.'
      ],
      status: 'upcoming',
      gradeLevelTest: {
        testId: 'sec201-w1-test',
        title: 'Week 1 Grade Level Test: Network Protocols & OSI Security',
        totalQuestions: 10,
        passingScore: 7,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 1,
            question: 'At which layer of the OSI model does the IP (Internet Protocol) and routing operate?',
            options: ['Layer 3 (Network Layer)', 'Layer 1 (Physical Layer)', 'Layer 4 (Transport Layer)', 'Layer 7 (Application Layer)'],
            correctAnswer: 0,
            explanation: 'IP addressing, packet routing, and ICMP protocols function exclusively at Layer 3 (Network Layer).',
            outlineReference: 'Section 1.1: The OSI 7-Layer Architecture'
          },
          {
            id: 2,
            question: 'What are the three message flags exchanged during a standard TCP connection establishment?',
            options: ['SYN, SYN-ACK, ACK', 'START, PROCESS, END', 'PING, PONG, ACK', 'HELLO, READY, GO'],
            correctAnswer: 0,
            explanation: 'TCP uses Synchronize (SYN), Synchronize-Acknowledgment (SYN-ACK), and Acknowledgment (ACK) to establish sessions.',
            outlineReference: 'Section 1.2: TCP 3-Way Handshake Mechanics'
          },
          {
            id: 3,
            question: 'How does an attacker execute a "TCP SYN Flood" Denial of Service attack?',
            options: [
              'By sending floods of SYN packets with spoofed source IPs and never replying with final ACKs, exhausting server connection tables',
              'By physically cutting the network wire',
              'By typing incorrect passwords into a website',
              'By changing the router’s Wi-Fi name'
            ],
            correctAnswer: 0,
            explanation: 'SYN floods leave server TCP half-open connection queues saturated, preventing legitimate clients from connecting.',
            outlineReference: 'Section 1.2: Transport Layer Denial of Service'
          },
          {
            id: 4,
            question: 'What is the default port number used by secure web traffic running over HTTPS/TLS?',
            options: ['Port 443', 'Port 80', 'Port 22', 'Port 53'],
            correctAnswer: 0,
            explanation: 'HTTPS operates over TCP port 443, whereas unencrypted HTTP operates over TCP port 80.',
            outlineReference: 'Section 1.3: Well-Known Network Ports & Services'
          },
          {
            id: 5,
            question: 'What happens during an "ARP Poisoning / Spoofing" attack on a local subnet?',
            options: [
              'The attacker sends forged ARP messages linking their MAC address to the IP address of the legitimate default gateway',
              'The computer screen displays an error message about poison',
              'The router deletes its operating system firmware',
              'The domain name server changes language settings'
            ],
            correctAnswer: 0,
            explanation: 'ARP spoofing enables an attacker on a LAN to position themselves as the Man-in-the-Middle for all outgoing packets.',
            outlineReference: 'Section 1.4: Data Link Layer MitM Exploitation'
          },
          {
            id: 6,
            question: 'Which protocol is responsible for translating human-readable domain names (e.g. google.com) into numerical IP addresses?',
            options: ['DNS (Domain Name System)', 'DHCP (Dynamic Host Configuration Protocol)', 'FTP (File Transfer Protocol)', 'SMTP (Simple Mail Transfer Protocol)'],
            correctAnswer: 0,
            explanation: 'DNS acts as the phonebook of the internet, mapping domain names to IP addresses (IPv4 A records or IPv6 AAAA records).',
            outlineReference: 'Section 1.3: DNS Infrastructure & Resolution'
          },
          {
            id: 7,
            question: 'What security enhancement does DNSSEC (DNS Security Extensions) provide to standard DNS?',
            options: [
              'Cryptographic digital signatures on DNS records to prevent cache poisoning and spoofing',
              'Free high-speed internet for all computers',
              'Compressing video files automatically',
              'Encrypting computer mouse movements'
            ],
            correctAnswer: 0,
            explanation: 'DNSSEC validates the origin authenticity and integrity of DNS query responses using public key cryptography.',
            outlineReference: 'Section 1.3: DNSSEC & Domain Authentication'
          },
          {
            id: 8,
            question: 'Which of the following is a primary characteristic of UDP (User Datagram Protocol)?',
            options: [
              'Connectionless and stateless with lower latency, but no guaranteed delivery or retransmission',
              'Guaranteed packet retransmission and sequential ordering',
              'Requires 5-way handshakes before sending bytes',
              'Only runs on satellite networks'
            ],
            correctAnswer: 0,
            explanation: 'UDP trades reliability for speed, making it ideal for real-time voice, video streaming, and DNS queries.',
            outlineReference: 'Section 1.2: TCP vs UDP Transport Characteristics'
          },
          {
            id: 9,
            question: 'What is the function of a Subnet Mask (e.g., 255.255.255.0 or /24 in CIDR)?',
            options: [
              'It distinguishes the Network portion of an IP address from the Host portion',
              'It hides the computer screen from webcam capture',
              'It encrypts browser passwords on disk',
              'It stops computer viruses from opening files'
            ],
            correctAnswer: 0,
            explanation: 'Subnet masks mathematically separate the network prefix from available host addresses on a subnet.',
            outlineReference: 'Section 1.1: IP Subnetting & CIDR Notation'
          },
          {
            id: 10,
            question: 'What is a "Man-in-the-Middle" (MitM) attack in network communications?',
            options: [
              'An attacker secretly intercepts and potentially alters communications between two parties who believe they are directly talking',
              'A physical person sitting between two computers in a library',
              'A network cable that has three connectors',
              'A firewall rule that permits all outbound traffic'
            ],
            correctAnswer: 0,
            explanation: 'In a MitM attack, the adversary eavesdrops on or manipulates packets in transit between the client and server.',
            outlineReference: 'Section 1.4: Man-in-the-Middle Attack Vectors'
          }
        ]
      }
    },
    {
      weekNumber: 2,
      weekTitle: 'Firewalls, IDS/IPS & Network Segmentation Architecture',
      weeklyObjective: 'Design defensive network perimeters using packet-filtering, stateful inspection, Next-Gen Firewalls (NGFW), IDS/IPS sensors, and DMZs.',
      focusSubtopics: [
        'Firewall Types: Stateless Packet Filtering, Stateful Inspection, Application Layer (WAF/NGFW)',
        'Intrusion Detection Systems (IDS) vs Intrusion Prevention Systems (IPS)',
        'Network Segmentation, VLANs, and Demilitarized Zones (DMZs)',
        'Zero Trust Network Access (ZTNA) and Micro-segmentation'
      ],
      handsOnActivity: 'Write basic firewall Access Control Lists (ACLs) to block unauthorized incoming SSH (Port 22) while allowing HTTPS web services.',
      outlineSourceNotes: 'Stateful firewalls track the state of active network connections in state tables, dynamically permitting return traffic. Next-Generation Firewalls (NGFWs) inspect Layer 7 payload data, perform Deep Packet Inspection (DPI), and enforce user-based policies. An IDS monitors and alerts (out-of-band/promiscuous mode), whereas an IPS sits in-line to actively drop malicious traffic in real time.',
      revisedNotes: CYBER_REVISED_NOTES['sec201-w2'],
      keyTakeaways: [
        'An IDS alerts on threats; an IPS actively drops malicious packets in-line.',
        'A DMZ isolates public-facing servers from internal private databases.',
        'Zero Trust assumes breach and verifies every request regardless of location.'
      ],
      status: 'upcoming',
      gradeLevelTest: {
        testId: 'sec201-w2-test',
        title: 'Week 2 Grade Level Test: Firewalls, IDS/IPS & Segmentation',
        totalQuestions: 10,
        passingScore: 7,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 1,
            question: 'What is the core distinction between an Intrusion Detection System (IDS) and an Intrusion Prevention System (IPS)?',
            options: [
              'An IDS passively detects and alerts on suspicious traffic; an IPS sits in-line to actively block and drop malicious packets',
              'An IDS only works on Wi-Fi; an IPS only works on cables',
              'An IDS is hardware; an IPS is only a document',
              'An IDS stops all traffic; an IPS allows all traffic'
            ],
            correctAnswer: 0,
            explanation: 'IDS systems monitor traffic passively (via span/tap ports) to alert, whereas IPS devices are deployed inline to filter and drop attacks.',
            outlineReference: 'Section 2.2: IDS vs IPS Sensor Architectures'
          },
          {
            id: 2,
            question: 'What is a "Stateful" firewall compared to a simple "Stateless" packet filter?',
            options: [
              'A stateful firewall tracks active connection state tables to intelligently validate return traffic packets',
              'A stateful firewall is only deployed in US state governments',
              'A stateful firewall ignores all port numbers',
              'A stateful firewall only runs when the computer is turned off'
            ],
            correctAnswer: 0,
            explanation: 'Stateful firewalls remember connection contexts (e.g. established TCP streams), automatically allowing valid responses.',
            outlineReference: 'Section 2.1: Stateful Inspection vs Packet Filtering'
          },
          {
            id: 3,
            question: 'What is a "Demilitarized Zone" (DMZ) in network architecture?',
            options: [
              'A perimeter subnet that houses external-facing services (e.g. web server) isolated from the sensitive internal corporate network',
              'A zone where no security firewalls are ever permitted',
              'A physical military base',
              'A server room with no cooling systems'
            ],
            correctAnswer: 0,
            explanation: 'A DMZ creates a buffer zone so compromised public web servers cannot easily pivot into internal private databases.',
            outlineReference: 'Section 2.3: DMZ Network Topology & Segregation'
          },
          {
            id: 4,
            question: 'What is the foundational philosophy of the "Zero Trust" security model?',
            options: [
              '"Never trust, always verify" — treat every user, device, and network flow as untrusted regardless of perimeter location',
              'Trust all devices inside the company office Wi-Fi network',
              'Do not allow any employees to use computers',
              'Trust only software that costs over $10,000'
            ],
            correctAnswer: 0,
            explanation: 'Zero Trust eliminates implicit trust based on physical network location, requiring continuous authentication and least privilege.',
            outlineReference: 'Section 2.4: Zero Trust Architecture (NIST SP 800-207)'
          },
          {
            id: 5,
            question: 'What is a "Virtual Local Area Network" (VLAN) used for in network defense?',
            options: [
              'Logically segmenting and isolating network broadcast domains across physical switches for improved security and traffic control',
              'Creating virtual 3D gaming worlds',
              'Replacing all physical computer monitors',
              'Generating bitcoin cryptocurrency'
            ],
            correctAnswer: 0,
            explanation: 'VLANs segment network traffic at Layer 2, preventing lateral movement between different departments (e.g. Accounting vs Guests).',
            outlineReference: 'Section 2.3: VLAN Segmentation & Layer 2 Isolation'
          },
          {
            id: 6,
            question: 'What is the purpose of Deep Packet Inspection (DPI) in a Next-Generation Firewall (NGFW)?',
            options: [
              'Inspecting the actual application payload and metadata within a packet rather than just the port and header IP',
              'Measuring the physical weight of network cables',
              'Scanning paper documents into PDF format',
              'Counting the number of letters in an email'
            ],
            correctAnswer: 0,
            explanation: 'DPI inspects application-layer data to detect malware signatures, evasion techniques, and malicious commands inside approved ports.',
            outlineReference: 'Section 2.1: Next-Generation Firewalls & DPI'
          },
          {
            id: 7,
            question: 'What is a "Web Application Firewall" (WAF) specifically designed to protect against?',
            options: [
              'Application-layer web attacks such as SQL Injection (SQLi), Cross-Site Scripting (XSS), and CSRF',
              'Physical theft of laptop computers',
              'Electrical power surges in server rooms',
              'Broken monitor screens'
            ],
            correctAnswer: 0,
            explanation: 'A WAF inspects HTTP/HTTPS traffic targeting web applications to block web exploits like SQL injection and cross-site scripting.',
            outlineReference: 'Section 2.1: Web Application Firewalls (WAF)'
          },
          {
            id: 8,
            question: 'What is "Default Deny" (Implicit Deny) in firewall rule configuration?',
            options: [
              'An overarching rule at the end of the rulebase that drops all traffic unless explicitly permitted by an earlier rule',
              'A setting that denies the administrator from logging in',
              'A rule that denies all software updates forever',
              'A policy that disables the internet connection on weekends'
            ],
            correctAnswer: 0,
            explanation: 'Implicit Deny enforces the principle of least privilege by blocking all unspecified traffic streams by default.',
            outlineReference: 'Section 2.1: Firewall Access Control List Architecture'
          },
          {
            id: 9,
            question: 'What is "Port Scanning" (e.g., using Nmap) used for in network security audits?',
            options: [
              'Probing a target host to discover open network ports, active services, and potential entry points',
              'Scanning physical USB ports for dust',
              'Cleaning printer paper trays',
              'Testing the speed of optical drives'
            ],
            correctAnswer: 0,
            explanation: 'Port scanning maps accessible network services to identify listening ports and outdated software versions.',
            outlineReference: 'Section 2.2: Port Scanning & Network Reconnaissance'
          },
          {
            id: 10,
            question: 'What is "Honeypot" technology in cyber defense?',
            options: [
              'A decoy system deliberately deployed with vulnerabilities to lure, detect, and analyze attacker behaviors and techniques',
              'A container for storing sweet snacks in the office',
              'A specialized cooling liquid for servers',
              'A backup battery for routers'
            ],
            correctAnswer: 0,
            explanation: 'Honeypots deceive attackers into interacting with isolated decoy systems, providing early warning threat intelligence.',
            outlineReference: 'Section 2.5: Deception Technologies & Honeypots'
          }
        ]
      }
    },
    {
      weekNumber: 3,
      weekTitle: 'Cryptography: Symmetric, Asymmetric & Hashing',
      weeklyObjective: 'Understand cryptographic primitives: Symmetric encryption (AES), Asymmetric key pairs (RSA/ECC), Hashing (SHA-256), and Digital Signatures.',
      focusSubtopics: [
        'Symmetric Encryption (AES-GCM, ChaCha20): Shared key speed and key distribution problem',
        'Asymmetric Encryption (RSA, ECC, Diffie-Hellman): Public/Private key pairs',
        'Cryptographic Hash Functions (SHA-256, SHA-3): Avalanche effect and collision resistance',
        'Public Key Infrastructure (PKI), Digital Certificates (X.509), and Certificate Authorities (CAs)'
      ],
      handsOnActivity: 'Simulate an asymmetric key exchange using Diffie-Hellman principles and generate a SHA-256 hash digest to observe the avalanche effect.',
      outlineSourceNotes: 'Symmetric cryptography uses one shared secret for encryption and decryption. Asymmetric cryptography uses mathematically linked public/private key pairs. Hybrid encryption combines both: asymmetric cryptography exchanges a transient symmetric session key (e.g. in TLS 1.3), which then encrypts high-volume payload data at high speed.',
      revisedNotes: CYBER_REVISED_NOTES['sec201-w3'],
      keyTakeaways: [
        'Symmetric encryption is fast; asymmetric encryption solves the key exchange challenge.',
        'Hashing is a one-way mathematical function; you cannot "decrypt" a hash.',
        'Digital certificates bind a public key to an entity identity verified by a Certificate Authority.'
      ],
      status: 'upcoming',
      gradeLevelTest: {
        testId: 'sec201-w3-test',
        title: 'Week 3 Grade Level Test: Applied Cryptography & PKI',
        totalQuestions: 10,
        passingScore: 7,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 1,
            question: 'What is the primary difference between Symmetric and Asymmetric encryption?',
            options: [
              'Symmetric uses the same key for encryption/decryption; Asymmetric uses a mathematically linked public/private key pair',
              'Symmetric only works on numbers; Asymmetric only works on words',
              'Symmetric encryption was invented in 2026; Asymmetric is 2,000 years old',
              'There is no mathematical difference between them'
            ],
            correctAnswer: 0,
            explanation: 'Symmetric ciphers (AES) rely on a single shared secret, while asymmetric ciphers (RSA/ECC) use distinct public and private keys.',
            outlineReference: 'Section 3.1: Symmetric vs Asymmetric Primitives'
          },
          {
            id: 2,
            question: 'Which of the following is a widely accepted modern standard for Symmetric Block Cipher encryption?',
            options: ['AES (Advanced Encryption Standard - 128/256 bit)', 'ROT13', 'MD5', 'Base64'],
            correctAnswer: 0,
            explanation: 'AES is the global standard for symmetric block encryption, endorsed by NIST for securing sensitive information.',
            outlineReference: 'Section 3.1: Advanced Encryption Standard (AES)'
          },
          {
            id: 3,
            question: 'Why is a Cryptographic Hash Function (like SHA-256) called a "One-Way" function?',
            options: [
              'It is computationally infeasible to reverse or calculate the original input from its resulting hash digest',
              'Data can only travel in one physical direction across a wire',
              'It only works for one single user',
              'The function only executes on Mondays'
            ],
            correctAnswer: 0,
            explanation: 'Hashing produces a fixed-length digest from variable input; it is mathematically non-invertible.',
            outlineReference: 'Section 3.2: Cryptographic Hash Properties'
          },
          {
            id: 4,
            question: 'What is the "Avalanche Effect" in cryptographic hash algorithms?',
            options: [
              'A slight 1-bit change in the input produces a drastically different and unpredictable output hash digest',
              'The server cools down rapidly in winter',
              'The computer memory overflows and shuts down',
              'Passwords slide down the screen like an avalanche'
            ],
            correctAnswer: 0,
            explanation: 'The avalanche effect ensures that even minute modifications to the input data completely randomize the resulting hash output.',
            outlineReference: 'Section 3.2: Avalanche Effect & Diffusion'
          },
          {
            id: 5,
            question: 'In Asymmetric cryptography, if Alice wants to send an encrypted message to Bob that ONLY Bob can read, whose key does she use to encrypt it?',
            options: ['Bob\'s Public Key', 'Alice\'s Private Key', 'Bob\'s Private Key', 'Alice\'s Public Key'],
            correctAnswer: 0,
            explanation: 'Alice encrypts using Bob’s publicly known key; only Bob holds the matching private key required to decrypt the ciphertext.',
            outlineReference: 'Section 3.3: Asymmetric Encryption Workflow'
          },
          {
            id: 6,
            question: 'In a Digital Signature, which key is used by the sender to sign the message digest?',
            options: ['The Sender\'s Private Key', 'The Recipient\'s Public Key', 'The Internet Service Provider\'s Key', 'A randomly generated number'],
            correctAnswer: 0,
            explanation: 'The sender signs using their private key; anyone with the sender’s public key can verify the signature authenticity and non-repudiation.',
            outlineReference: 'Section 3.3: Digital Signatures & Non-Repudiation'
          },
          {
            id: 7,
            question: 'What is the role of a "Certificate Authority" (CA) in Public Key Infrastructure (PKI)?',
            options: [
              'A trusted third-party entity that digitally signs and validates X.509 certificates binding public keys to verified domain identities',
              'An organization that sells physical computer monitors',
              'A government department that regulates typing speeds',
              'A software program that deletes internet history'
            ],
            correctAnswer: 0,
            explanation: 'CAs establish trust in the web PKI by validating domain ownership and issuing signed digital certificates.',
            outlineReference: 'Section 3.4: PKI & Certificate Authorities'
          },
          {
            id: 8,
            question: 'Why are older algorithms like MD5 and SHA-1 deprecated and considered unsafe for modern security applications?',
            options: [
              'Cryptographic collision vulnerabilities have been demonstrated, allowing different inputs to produce identical hashes',
              'They only run on 8-bit computers',
              'They make files twice as large',
              'They require physical paper printouts'
            ],
            correctAnswer: 0,
            explanation: 'MD5 and SHA-1 suffer from proven hash collision attacks, making them unsuitable for digital certificates or integrity guarantees.',
            outlineReference: 'Section 3.2: Hash Collision Vulnerabilities'
          },
          {
            id: 9,
            question: 'What is "Hybrid Encryption" as used in TLS (Transport Layer Security)?',
            options: [
              'Using asymmetric cryptography to securely negotiate a shared session key, then using fast symmetric cryptography to encrypt the data stream',
              'Using electric and gas engines to run computers',
              'Encrypting half of the file with a password and leaving half unencrypted',
              'Using two different computer monitors'
            ],
            correctAnswer: 0,
            explanation: 'TLS uses asymmetric key exchange (ECDHE) for session initiation and AES-GCM symmetric encryption for high-throughput data transfer.',
            outlineReference: 'Section 3.5: Hybrid Encryption in TLS 1.3'
          },
          {
            id: 10,
            question: 'What is "Salt" in the context of password hashing (e.g. bcrypt/Argon2)?',
            options: [
              'A unique, random cryptographic string appended to a password before hashing to defeat precomputed Rainbow Table attacks',
              'A chemical compound added to server motherboards',
              'A tool that speeds up typing',
              'A special password backup file'
            ],
            correctAnswer: 0,
            explanation: 'Salting ensures identical passwords generate distinct hash outputs, neutralizing rainbow tables and bulk dictionary lookup attacks.',
            outlineReference: 'Section 3.2: Password Salting & Key Derivation Functions'
          }
        ]
      }
    },
    {
      weekNumber: 4,
      weekTitle: 'Endpoint Security, Patch Management & OS Hardening',
      weeklyObjective: 'Apply operating system hardening standards, configure least privilege access controls, and establish automated patch management.',
      focusSubtopics: [
        'Principle of Least Privilege (PoLP) and Role-Based Access Control (RBAC)',
        'Operating System Hardening: Disabling unnecessary services, port closures, and secure baseline configurations (CIS Benchmarks)',
        'Endpoint Detection and Response (EDR) vs Antivirus',
        'Vulnerability Management Lifecycle: Discover, Prioritize, Assess, Remediate, Verify'
      ],
      handsOnActivity: 'Conduct a virtual system audit: Identify unauthorized background services, unquoted service paths, and privilege escalation vectors.',
      outlineSourceNotes: 'Operating system hardening eliminates attack surfaces by disabling default accounts, closing unused ports, enforcing disk encryption (BitLocker/FileVault), and removing legacy protocols (SMBv1, Telnet). The Principle of Least Privilege dictates that users and processes must only possess the minimal permissions required to execute authorized tasks.',
      revisedNotes: CYBER_REVISED_NOTES['sec201-w4'],
      keyTakeaways: [
        'Never use root or domain administrator accounts for routine daily operations.',
        'Apply CIS Benchmarks for rigorous system hardening baselines.',
        'Continuous patch cadence mitigates the window of vulnerability exposure.'
      ],
      status: 'upcoming',
      gradeLevelTest: {
        testId: 'sec201-w4-test',
        title: 'Week 4 Grade Level Test: Endpoint Hardening & Access Governance',
        totalQuestions: 10,
        passingScore: 7,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 1,
            question: 'What is the "Principle of Least Privilege" (PoLP)?',
            options: [
              'Users and programs should only be granted the minimum necessary rights and permissions required to perform their authorized duties',
              'Every user in a school should have full root/administrator privileges',
              'Computers should never have passwords',
              'Only the youngest student is allowed to log in'
            ],
            correctAnswer: 0,
            explanation: 'PoLP limits the blast radius of a compromised account by restricting unnecessary elevated permissions.',
            outlineReference: 'Section 4.1: Access Control & Least Privilege'
          },
          {
            id: 2,
            question: 'What does "Operating System Hardening" involve?',
            options: [
              'Configuring the OS to reduce vulnerabilities by closing unused ports, disabling non-essential services, and enforcing secure policies',
              'Putting a thick metal case around the computer tower',
              'Freezing the computer in ice',
              'Deleting all applications on the hard drive'
            ],
            correctAnswer: 0,
            explanation: 'System hardening strips away unnecessary attack surfaces according to validated security baselines.',
            outlineReference: 'Section 4.2: OS Hardening & Attack Surface Reduction'
          },
          {
            id: 3,
            question: 'What is "Full Disk Encryption" (e.g. BitLocker, FileVault)?',
            options: [
              'Encrypting all data on a storage drive at rest to protect information if the physical device is lost or stolen',
              'Deleting all files on the hard drive once a month',
              'Scanning the hard drive for duplicate photos',
              'Increasing the storage capacity of the disk'
            ],
            correctAnswer: 0,
            explanation: 'Full disk encryption (FDE) protects data at rest by rendering drive contents unreadable without the cryptographic decryption key.',
            outlineReference: 'Section 4.3: Data at Rest Protection & FDE'
          },
          {
            id: 4,
            question: 'What is "Role-Based Access Control" (RBAC)?',
            options: [
              'Assigning permissions to specific roles (e.g. Student, Teacher, Principal) rather than individual user accounts directly',
              'Allowing users to pick any username they desire',
              'Assigning passwords based on user height',
              'Controlling computer volume based on age'
            ],
            correctAnswer: 0,
            explanation: 'RBAC simplifies access governance by mapping permissions to organizational roles, ensuring scalable permission audits.',
            outlineReference: 'Section 4.1: Role-Based Access Control (RBAC)'
          },
          {
            id: 5,
            question: 'What is the primary role of "Endpoint Detection and Response" (EDR) software?',
            options: [
              'Continuously monitoring endpoint events, recording telemetry, and providing threat hunting and automated incident containment capabilities',
              'Playing sound effects when a key is typed',
              'Turning off the computer screen automatically when idle',
              'Printing documents at higher speeds'
            ],
            correctAnswer: 0,
            explanation: 'EDR solutions provide real-time behavioral telemetry, process tree inspection, and remote isolation of compromised endpoints.',
            outlineReference: 'Section 4.4: EDR vs Traditional Antivirus'
          },
          {
            id: 6,
            question: 'What is a "Common Vulnerabilities and Exposures" (CVE) identifier?',
            options: [
              'A standardized, publicly cataloged reference number (e.g., CVE-2026-1234) for a specific cybersecurity vulnerability',
              'A serial number for computer power cables',
              'A student identification number on report cards',
              'A license plate number for school buses'
            ],
            correctAnswer: 0,
            explanation: 'CVE IDs provide a universal dictionary identifier for publicly known cybersecurity vulnerabilities.',
            outlineReference: 'Section 4.5: CVE Dictionary & CVSS Scoring'
          },
          {
            id: 7,
            question: 'What does a CVSS (Common Vulnerability Scoring System) score of 9.8 indicate?',
            options: [
              'A Critical severity vulnerability that poses an extreme security risk and requires urgent remediation',
              'A minor cosmetic typo in a software menu',
              'The computer is running at 98% battery health',
              'The internet connection speed is fast'
            ],
            correctAnswer: 0,
            explanation: 'CVSS scores range from 0.0 to 10.0; scores above 9.0 represent Critical vulnerabilities that allow severe remote exploitation.',
            outlineReference: 'Section 4.5: CVSS Quantitative Risk Metrics'
          },
          {
            id: 8,
            question: 'Why should legacy, unencrypted management protocols like Telnet and HTTP be disabled in favor of SSH and HTTPS?',
            options: [
              'Telnet and HTTP transmit passwords and commands in clear, plaintext text readable by anyone sniffing network traffic',
              'Telnet uses too much screen brightness',
              'SSH is only compatible with video games',
              'Telnet was banned by the electric company'
            ],
            correctAnswer: 0,
            explanation: 'Cleartext protocols expose administrative credentials to eavesdropping; SSH/HTTPS encrypt all control and payload data.',
            outlineReference: 'Section 4.2: Legacy Protocol Deprecation'
          },
          {
            id: 9,
            question: 'What is "Application Whitelisting / Allowlisting"?',
            options: [
              'A security practice that permits ONLY explicitly approved and digitally signed programs to execute on an endpoint',
              'Allowing only websites with white background colors',
              'Painting computer cases in white color',
              'Deleting all dark mode browser themes'
            ],
            correctAnswer: 0,
            explanation: 'Application allowlisting blocks all unauthorized binaries, scripts, and ransomware payloads from running by default.',
            outlineReference: 'Section 4.4: Application Allowlisting & Execution Control'
          },
          {
            id: 10,
            question: 'What is "Patch Cadence" in enterprise IT security?',
            options: [
              'The scheduled frequency and timeline with which software security patches and updates are tested and deployed across systems',
              'The musical rhythm of keyboard typing',
              'The number of computers in a single classroom',
              'The speed of cooling fans on a server'
            ],
            correctAnswer: 0,
            explanation: 'A structured patch cadence ensures timely remediation of newly disclosed vulnerabilities before threat actors exploit them.',
            outlineReference: 'Section 4.5: Patch Management Governance'
          }
        ]
      }
    }
  ]
};
