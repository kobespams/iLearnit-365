import { CyberLessonCourse } from '../types';
import { CYBER_REVISED_NOTES } from './cyberRevisedLessonNotes';

export const CYBER_LEVEL_4: CyberLessonCourse = {
  id: 'cyber-lvl-4',
  code: 'SEC-401',
  title: 'Level 4: Cloud Security, Incident Response & Governance',
  level: 'level4_cloud_incident_response',
  levelLabel: 'Level 4: Cloud Security & Incident Response',
  targetAudience: 'Tertiary / University Track, IT Staff & Aspiring Security Professionals',
  badgeTitle: '🛡️ Certified Cloud Security & Incident Commander (Level 4)',
  durationWeeks: 4,
  summary: 'Advanced study of Cloud Security Architecture (AWS/GCP/Azure Shared Responsibility), Incident Response lifecycles (NIST SP 800-61), Digital Forensics & Chain of Custody, and Enterprise Governance (ISO 27001, SOC 2, Zero Trust).',
  keyStandards: [
    'NIST SP 800-61 Rev 2 (Computer Security Incident Handling Guide)',
    'Cloud Security Alliance (CSA) Cloud Controls Matrix (CCM)',
    'ISO/IEC 27001:2022 & General Data Protection Regulation (GDPR)'
  ],
  practicalLabTitle: 'Digital Forensics & Cloud IAM Least-Privilege Policy Audit',
  practicalLabGuide: 'Analyze digital memory dumps, extract volatility artifacts, verify cryptographic hash chains of custody, and remediate over-privileged Cloud IAM JSON policies.',
  weeklySchedule: [
    {
      weekNumber: 1,
      weekTitle: 'Cloud Security Architecture & Shared Responsibility Model',
      weeklyObjective: 'Evaluate cloud service models (IaaS, PaaS, SaaS) and configure Cloud Identity and Access Management (IAM) under the Shared Responsibility Model.',
      focusSubtopics: [
        'The Cloud Shared Responsibility Model across IaaS, PaaS, and SaaS',
        'Cloud Identity & Access Management (IAM): Role-based access, Service Accounts, and temporary STS tokens',
        'Cloud Storage Bucket Security, Public Exposure remediation, and KMS Envelope Encryption',
        'Cloud Security Posture Management (CSPM) and Infrastructure as Code (IaC) security'
      ],
      handsOnActivity: 'Audit an over-privileged AWS/GCP IAM Policy containing `Action: "*"` and refactor it into granular, least-privilege resource permissions.',
      outlineSourceNotes: 'In Cloud computing, security is a shared responsibility. The Cloud Service Provider (CSP) manages Security "OF" the Cloud (physical hardware, datacenter hypervisors). The Customer manages Security "IN" the Cloud (customer data, IAM permissions, OS patches in IaaS, network configurations). Over-privileged IAM roles and unencrypted S3 storage buckets constitute the majority of cloud security breaches.',
      revisedNotes: CYBER_REVISED_NOTES['sec401-w1'],
      keyTakeaways: [
        'The Customer is always responsible for data classification and IAM access control.',
        'Never use wildcard `*` permissions in cloud IAM policies.',
        'Implement automated CSPM to detect cloud configuration drift.'
      ],
      status: 'upcoming',
      gradeLevelTest: {
        testId: 'sec401-w1-test',
        title: 'Week 1 Grade Level Test: Cloud Architecture & IAM Security',
        totalQuestions: 10,
        passingScore: 7,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 1,
            question: 'Under the Cloud Shared Responsibility Model for Infrastructure as a Service (IaaS), which party is responsible for operating system patching and data security on virtual machines?',
            options: [
              'The Customer (Tenant)',
              'The Cloud Service Provider (CSP) exclusively',
              'The local electricity utility provider',
              'The hardware chip manufacturer'
            ],
            correctAnswer: 0,
            explanation: 'In IaaS, the CSP provides the underlying hypervisor/hardware; the customer is fully responsible for guest OS patching and data security.',
            outlineReference: 'Section 1.1: Shared Responsibility in IaaS, PaaS, SaaS'
          },
          {
            id: 2,
            question: 'In a Software as a Service (SaaS) deployment (e.g., Google Workspace, Microsoft 365), what is the primary security responsibility of the Customer?',
            options: [
              'Data classification, identity and access management (IAM), user credentials, and sharing permissions',
              'Fixing physical server cooling fans in the CSP datacenter',
              'Patching the hypervisor kernel',
              'Replacing burned-out hard drives'
            ],
            correctAnswer: 0,
            explanation: 'Even in SaaS where the CSP manages all underlying infrastructure and application code, the customer owns user data and access governance.',
            outlineReference: 'Section 1.1: SaaS Governance & Customer Obligations'
          },
          {
            id: 3,
            question: 'Why is granting an IAM policy with `Action: "*"` and `Resource: "*"` considered an extreme security hazard?',
            options: [
              'It grants unrestricted administrative superpowers to perform any action on any resource, violating the Principle of Least Privilege',
              'It makes cloud servers run out of physical memory',
              'It causes the cloud bill to double every minute',
              'It turns off computer monitors'
            ],
            correctAnswer: 0,
            explanation: 'Wildcard IAM statements create severe privilege escalation vectors if the associated credentials are leaked or compromised.',
            outlineReference: 'Section 1.2: Cloud IAM Policy Governance'
          },
          {
            id: 4,
            question: 'What is "Envelope Encryption" in Cloud Key Management Services (KMS)?',
            options: [
              'Encrypting plaintext data with a Data Encryption Key (DEK), and then encrypting the DEK with a master Key Encryption Key (KEK)',
              'Placing a USB flash drive inside a paper postal envelope',
              'Printing passwords on physical paper envelopes',
              'Wrapping network cables in plastic tape'
            ],
            correctAnswer: 0,
            explanation: 'Envelope encryption combines high-speed symmetric encryption for bulk data with protected master keys managed inside secure hardware HSMs.',
            outlineReference: 'Section 1.3: Cloud KMS & Envelope Encryption'
          },
          {
            id: 5,
            question: 'What is the role of a "Cloud Security Posture Management" (CSPM) solution?',
            options: [
              'Continuously assessing cloud configurations against security benchmarks (CIS) to detect misconfigurations, public storage leaks, and compliance drift',
              'Measuring how comfortable office chairs are in datacenters',
              'Testing the physical weight of servers',
              'Scheduling employee lunch hours'
            ],
            correctAnswer: 0,
            explanation: 'CSPM tools continuously monitor multi-cloud infrastructure to detect insecure configurations and compliance violations in real time.',
            outlineReference: 'Section 1.4: CSPM & Configuration Auditing'
          },
          {
            id: 6,
            question: 'What is a "Cloud Access Security Broker" (CASB)?',
            options: [
              'A security policy enforcement point situated between cloud service consumers and providers to monitor activity and enforce enterprise security controls',
              'A stockbroker who buys shares in cloud companies',
              'A physical security guard at a datacenter gate',
              'A router that only works in rainy weather'
            ],
            correctAnswer: 0,
            explanation: 'CASBs provide visibility, data loss prevention (DLP), threat protection, and compliance enforcement across cloud application usage.',
            outlineReference: 'Section 1.4: CASBs & Cloud Data Loss Prevention'
          },
          {
            id: 7,
            question: 'What is "Infrastructure as Code" (IaC) security scanning (e.g. scanning Terraform / CloudFormation)?',
            options: [
              'Scanning declarative infrastructure code for security misconfigurations and exposed secrets BEFORE deploying to the cloud',
              'Translating computer code into spoken audio',
              'Compressing code files to save disk space',
              'Checking grammar in code comments'
            ],
            correctAnswer: 0,
            explanation: 'IaC scanning catches insecure cloud definitions (e.g. unencrypted volumes, open security groups) early in the CI/CD pipeline.',
            outlineReference: 'Section 1.5: DevSecOps & IaC Security'
          },
          {
            id: 8,
            question: 'What is a "Service Account" in cloud platforms (GCP / AWS IAM)?',
            options: [
              'A special non-human identity used by automated applications and workloads to securely authenticate and access authorized cloud APIs',
              'A customer support account for billing questions',
              'An account used to order food delivery for developers',
              'A personal email account for IT managers'
            ],
            correctAnswer: 0,
            explanation: 'Service accounts allow microservices and VMs to interact with cloud APIs without embedding hardcoded human credentials.',
            outlineReference: 'Section 1.2: Machine Identities & Service Accounts'
          },
          {
            id: 9,
            question: 'How should long-term static cloud API keys and secrets be managed according to cloud security best practices?',
            options: [
              'Replaced with short-lived, dynamically rotated temporary credentials (e.g. AWS STS / GCP Workload Identity Federation)',
              'Hardcoded directly into public GitHub repositories',
              'Saved in a plain text file on the desktop named "keys.txt"',
              'Emailed to all colleagues weekly'
            ],
            correctAnswer: 0,
            explanation: 'Federated temporary identity tokens eliminate the threat of leaked static long-lived credentials.',
            outlineReference: 'Section 1.2: Short-Lived Credential Federation'
          },
          {
            id: 10,
            question: 'What is "Data Sovereignty" in cloud computing compliance?',
            options: [
              'The legal principle that digital data is subject to the laws, privacy regulations, and governance of the physical nation where it is stored',
              'The speed at which data travels through undersea cables',
              'The size of a cloud database in gigabytes',
              'A software license agreement for operating systems'
            ],
            correctAnswer: 0,
            explanation: 'Data sovereignty requires organizations to ensure data storage locations comply with national privacy and data localization laws.',
            outlineReference: 'Section 1.5: Data Sovereignty & Geographic Compliance'
          }
        ]
      }
    },
    {
      weekNumber: 2,
      weekTitle: 'Incident Response Lifecycle & SOC Operations',
      weeklyObjective: 'Execute the NIST SP 800-61 Incident Response lifecycle: Preparation, Detection & Analysis, Containment, Eradication, Recovery, and Post-Incident Lessons Learned.',
      focusSubtopics: [
        'NIST SP 800-61 Rev 2 Incident Handling Lifecycle 6-phase framework',
        'Security Operations Center (SOC) Tiers (Tier 1 Triage, Tier 2 Incident Responder, Tier 3 Threat Hunter)',
        'Containment Strategies: Short-term isolation vs Long-term eradication',
        'Developing Playbooks: Ransomware containment, Data breach notifications, Business Email Compromise (BEC)'
      ],
      handsOnActivity: 'Walk through a simulated active Ransomware outbreak: Select appropriate short-term containment measures, identify root cause entry point, and execute clean recovery.',
      outlineSourceNotes: 'Incident handling must follow standardized workflows to ensure containment while preserving forensic evidence. Containment strategies must balance immediate damage limitation against evidence preservation (e.g. taking memory dumps before isolating an infected host). Post-Incident Review (Lessons Learned) is critical to prevent recurrence.',
      revisedNotes: CYBER_REVISED_NOTES['sec401-w2'],
      keyTakeaways: [
        'Preparation is the most critical phase of the Incident Response lifecycle.',
        'Never power off a compromised host immediately if RAM memory analysis is required.',
        'Post-Incident Reviews turn breaches into institutional resilience improvements.'
      ],
      status: 'upcoming',
      gradeLevelTest: {
        testId: 'sec401-w2-test',
        title: 'Week 2 Grade Level Test: Incident Response & NIST SP 800-61',
        totalQuestions: 10,
        passingScore: 7,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 1,
            question: 'What is the correct sequence of phases in the NIST SP 800-61 Incident Handling Lifecycle?',
            options: [
              '1. Preparation → 2. Detection & Analysis → 3. Containment, Eradication & Recovery → 4. Post-Incident Activity (Lessons Learned)',
              '1. Eradication → 2. Panic → 3. Delete Everything → 4. Preparation',
              '1. Reporting → 2. Hardware Replacement → 3. Software Installation → 4. Payment',
              '1. Ignore → 2. Investigate → 3. Blame → 4. Close'
            ],
            correctAnswer: 0,
            explanation: 'NIST defines a continuous 4-stage lifecycle ensuring structured incident containment and organizational learning.',
            outlineReference: 'Section 2.1: The NIST SP 800-61 Lifecycle'
          },
          {
            id: 2,
            question: 'Why is the "Preparation" phase considered the foundational cornerstone of effective Incident Response?',
            options: [
              'It establishes policies, toolkits, communication plans, trained incident response teams, and log infrastructure before a crisis occurs',
              'It ensures employees eat a healthy breakfast',
              'It orders new computers every month',
              'It allows companies to operate without firewalls'
            ],
            correctAnswer: 0,
            explanation: 'Without pre-established tools, contacts, and response playbooks, organizations face chaotic failure during active breaches.',
            outlineReference: 'Section 2.1: Incident Readiness & Preparation'
          },
          {
            id: 3,
            question: 'When an active compromise is detected on an endpoint, why is immediately pulling the power cord often discouraged by forensic responders?',
            options: [
              'Pulling the plug destroys volatile data stored in Random Access Memory (RAM), erasing critical running malware artifacts, network connections, and encryption keys',
              'It breaks the physical power cable permanently',
              'It causes the monitor to catch fire',
              'It speeds up the malware propagation'
            ],
            correctAnswer: 0,
            explanation: 'RAM contains vital volatile forensic evidence; live memory acquisition should precede system shutdown when feasible.',
            outlineReference: 'Section 2.3: Containment vs Volatile Evidence Preservation'
          },
          {
            id: 4,
            question: 'What is the primary role of a "Tier 1 SOC Analyst" in a Security Operations Center?',
            options: [
              'Monitoring real-time SIEM alerts, triaging false positives, and escalating verified security incidents to Tier 2 responders',
              'Building the physical computer desks in the office',
              'Negotiating ransom payments with hackers',
              'Installing light bulbs in server rooms'
            ],
            correctAnswer: 0,
            explanation: 'Tier 1 analysts handle initial alert triage, separating normal operational noise from genuine security anomalies.',
            outlineReference: 'Section 2.2: SOC Tier Responsibilities'
          },
          {
            id: 5,
            question: 'What happens during the "Eradication" phase of an incident?',
            options: [
              'Identifying and eliminating all components of the incident, such as removing malware, disabling compromised accounts, and closing exploited vulnerabilities',
              'Throwing all infected computers into a dumpster',
              'Writing an apology letter to the news media',
              'Deleting all company email archives'
            ],
            correctAnswer: 0,
            explanation: 'Eradication fully purges malicious artifacts and closes root cause attack vectors to ensure the adversary has no remaining footholds.',
            outlineReference: 'Section 2.4: Eradication & Root Cause Neutralization'
          },
          {
            id: 6,
            question: 'What is a "Security Incident Response Playbook"?',
            options: [
              'A standardized, step-by-step procedural checklist guiding responders through specific incident scenarios (e.g., Ransomware, Phishing, DDoS)',
              'A video game rulebook for security teams',
              'A collection of jokes about computers',
              'A novel written by security programmers'
            ],
            correctAnswer: 0,
            explanation: 'Playbooks provide repeatable, legally vetted action steps for consistent response under high-stress crisis conditions.',
            outlineReference: 'Section 2.2: Incident Playbook Engineering'
          },
          {
            id: 7,
            question: 'What is the purpose of the "Post-Incident Activity / Lessons Learned" meeting?',
            options: [
              'Analyzing what occurred, how the response performed, identifying weaknesses, and updating defensive controls to prevent recurrence',
              'Assigning individual blame and firing junior staff',
              'Celebrating the end of the work week with cake',
              'Deleting all security logs to save storage space'
            ],
            correctAnswer: 0,
            explanation: 'Lessons learned sessions provide blameless post-mortem analysis to improve defense posture and response speed.',
            outlineReference: 'Section 2.5: Blameless Post-Mortems & Continuous Improvement'
          },
          {
            id: 8,
            question: 'What is "Network Isolation" in the context of Incident Containment?',
            options: [
              'Disconnecting a compromised host from the wider network while maintaining an administrative management channel for remote forensic investigation',
              'Cutting all internet cables for the entire country',
              'Moving a laptop to an empty room',
              'Turning off the room lights'
            ],
            correctAnswer: 0,
            explanation: 'Network containment prevents lateral malware spread while allowing security teams to remotely inspect memory and processes.',
            outlineReference: 'Section 2.3: Containment Isolation Strategies'
          },
          {
            id: 9,
            question: 'What is a "Severity 1 (Sev-1 / Critical)" incident classification?',
            options: [
              'A catastrophic event causing severe operational downtime, widespread data exfiltration, or active systemic compromise requiring executive escalation',
              'A forgotten password on a student laptop',
              'A minor spelling mistake on a website page',
              'A printer running out of blue ink'
            ],
            correctAnswer: 0,
            explanation: 'Sev-1 represents critical business-threatening emergencies mobilizing 24/7 war rooms and executive leadership.',
            outlineReference: 'Section 2.2: Incident Severity Matrix & SLA Triage'
          },
          {
            id: 10,
            question: 'What role does a "Cyber Incident Commander" play during a major breach?',
            options: [
              'Leading the overall crisis response, orchestrating technical triage, coordinating legal/communications, and making authoritative operational decisions',
              'Writing computer code all day without talking to anyone',
              'Answering customer support phone lines',
              'Fixing broken physical mouse hardware'
            ],
            correctAnswer: 0,
            explanation: 'The Incident Commander directs tactical assignments, manages stakeholder communication, and unblocks technical teams.',
            outlineReference: 'Section 2.2: Incident Command Structure & Roles'
          }
        ]
      }
    },
    {
      weekNumber: 3,
      weekTitle: 'Digital Forensics, Evidence Preservation & SIEM Analysis',
      weeklyObjective: 'Apply forensic acquisition methodologies, preserve cryptographic Chain of Custody, analyze SIEM log correlation, and reconstruct attack timelines.',
      focusSubtopics: [
        'Order of Volatility: CPU registers/cache, RAM, Network state, Disk, Backups',
        'Cryptographic Chain of Custody and Bit-stream Disk Imaging (Write Blockers)',
        'Security Information and Event Management (SIEM): Log ingestion, Normalization, Correlation rules',
        'Windows Event Logs (Sysmon), Linux Auditd, and Artifact Analysis (Prefetch, MFT, Shimcache)'
      ],
      handsOnActivity: 'Inspect a simulated SIEM log dashboard: Correlate Windows Sysmon Event ID 1 (Process Creation) with Event ID 3 (Network Connection) to trace command-and-control beaconing.',
      outlineSourceNotes: 'Digital forensics requires strict adherence to the Order of Volatility. Evidence must be acquired using hardware write-blockers to create forensic bit-stream clones (E01/Raw) verified by SHA-256 hashes. Chain of Custody forms must meticulously log every individual who handled, analyzed, or stored the evidence to ensure courtroom admissibility.',
      revisedNotes: CYBER_REVISED_NOTES['sec401-w3'],
      keyTakeaways: [
        'Order of Volatility dictates collecting most transient data (RAM) first.',
        'Chain of Custody documentation guarantees legal integrity in court.',
        'SIEM platforms correlate disparate log streams into actionable alerts.'
      ],
      status: 'upcoming',
      gradeLevelTest: {
        testId: 'sec401-w3-test',
        title: 'Week 3 Grade Level Test: Digital Forensics & Log Correlation',
        totalQuestions: 10,
        passingScore: 7,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 1,
            question: 'According to the RFC 3227 "Order of Volatility", which digital evidence source is the MOST volatile and must be acquired first?',
            options: [
              'CPU registers, CPU cache, and RAM (Random Access Memory)',
              'Hard disk drive magnetic storage',
              'Printed paper documents',
              'Archival backup tapes stored in a vault'
            ],
            correctAnswer: 0,
            explanation: 'Memory contents disappear immediately upon power loss; disk and tape media retain data persistently across power cycles.',
            outlineReference: 'Section 3.1: RFC 3227 Order of Volatility'
          },
          {
            id: 2,
            question: 'What is a "Forensic Bit-Stream Image" (e.g., Raw DD or E01 format)?',
            options: [
              'An exact, bit-by-bit physical sector duplicate of a storage drive, including unallocated space, slack space, and deleted file fragments',
              'A screenshot of the desktop background',
              'A copy-paste of files into a zip archive',
              'A list of installed software names'
            ],
            correctAnswer: 0,
            explanation: 'Bit-stream images capture every magnetic sector, preserving hidden slack space and deleted file residues for analysis.',
            outlineReference: 'Section 3.2: Forensic Imaging & Write Blockers'
          },
          {
            id: 3,
            question: 'What is the purpose of a Hardware Write-Blocker during digital forensic acquisition?',
            options: [
              'It physically prevents the forensic computer from modifying or writing any data to the evidence drive during imaging',
              'It blocks the user from typing on the keyboard',
              'It prevents computer monitors from showing text',
              'It turns off the internet router'
            ],
            correctAnswer: 0,
            explanation: 'Write-blockers guarantee the original evidence media remains untouched and unmodified during the duplication process.',
            outlineReference: 'Section 3.2: Write-Blocking Technology & Verification'
          },
          {
            id: 4,
            question: 'What is "Chain of Custody" in digital forensics?',
            options: [
              'A meticulous, unbroken legal record documenting the chronological collection, transfer, custody, analysis, and storage of evidence',
              'A metal chain used to tie computers to desks',
              'A password sharing chain among employees',
              'A list of websites visited by students'
            ],
            correctAnswer: 0,
            explanation: 'Chain of custody proves evidence has not been tampered with, substituted, or corrupted between crime scene and courtroom.',
            outlineReference: 'Section 3.2: Legal Chain of Custody & Evidence Admissibility'
          },
          {
            id: 5,
            question: 'How do forensic investigators prove that a forensic disk image is an exact, unaltered duplicate of the suspect drive?',
            options: [
              'By calculating and comparing cryptographic hash values (e.g. SHA-256) of the original drive and the acquired image',
              'By weighing both drives on a kitchen scale',
              'By comparing the color of the drive cases',
              'By testing if both drives make the same humming sound'
            ],
            correctAnswer: 0,
            explanation: 'Matching cryptographic hashes mathematically proves bit-for-bit authenticity with zero modifications.',
            outlineReference: 'Section 3.2: Cryptographic Verification in Forensics'
          },
          {
            id: 6,
            question: 'What is the primary function of a "Security Information and Event Management" (SIEM) system (e.g., Splunk, Microsoft Sentinel)?',
            options: [
              'Aggregating, normalizing, and correlating real-time log data across an entire enterprise to detect multi-stage security attacks',
              'Sending marketing emails to customers',
              'Managing company payroll spreadsheets',
              'Designing graphical logos for websites'
            ],
            correctAnswer: 0,
            explanation: 'SIEM tools collect logs from servers, firewalls, and endpoints, applying correlation rules to identify security incidents.',
            outlineReference: 'Section 3.3: SIEM Architecture & Log Ingestion'
          },
          {
            id: 7,
            question: 'What is "Log Normalization" in a SIEM platform?',
            options: [
              'Converting disparate log formats from different vendors (Windows, Cisco, Linux, Apache) into a standardized, unified schema (e.g. CEF/JSON)',
              'Deleting half of the logs to make them normal size',
              'Changing all log timestamps to random numbers',
              'Printing logs onto standard paper'
            ],
            correctAnswer: 0,
            explanation: 'Normalization maps different log structures into consistent field names (e.g. `src_ip`, `user`), enabling unified queries.',
            outlineReference: 'Section 3.3: Log Parsing & Normalization'
          },
          {
            id: 8,
            question: 'What do Windows Prefetch files (.pf) reveal during a forensic timeline investigation?',
            options: [
              'Evidence of application execution, including the program name, run count, and exact timestamp when it was launched',
              'The user\'s browser bookmarks',
              'The computer screen resolution settings',
              'The battery charge history'
            ],
            correctAnswer: 0,
            explanation: 'Windows Prefetch artifacts prove whether specific executable files or malware binaries were launched on the system.',
            outlineReference: 'Section 3.4: Windows Forensic Artifacts (Prefetch, Shimcache, Amcache)'
          },
          {
            id: 9,
            question: 'What is "Log Tampering / Evasion" and how do defenders protect central log integrity?',
            options: [
              'Attackers attempting to delete or clear event logs (e.g. clearing Windows Security logs); defenders use write-once remote SIEM streaming',
              'Typing faster than normal in log files',
              'Saving logs with uppercase letters',
              'Printing logs in reverse order'
            ],
            correctAnswer: 0,
            explanation: 'Streaming logs in real-time to a secure, write-only central repository prevents attackers from wiping local audit trails.',
            outlineReference: 'Section 3.3: Secure Centralized Logging & Tamper-Resistance'
          },
          {
            id: 10,
            question: 'What is the "Master File Table" ($MFT) on NTFS file systems used for in forensic file analysis?',
            options: [
              'A special database storing metadata about every file and directory on an NTFS volume, including creation and modification timestamps ($STANDARD_INFORMATION, $FILE_NAME)',
              'A list of master passwords for Windows',
              'A directory of physical master keys for office doors',
              'A table displaying motherboard voltage settings'
            ],
            correctAnswer: 0,
            explanation: 'The $MFT tracks timestamps, file sizes, and cluster allocations, enabling forensic reconstruction of file creations and timestomping.',
            outlineReference: 'Section 3.4: NTFS File System Forensics ($MFT & Timestomping)'
          }
        ]
      }
    },
    {
      weekNumber: 4,
      weekTitle: 'Cyber Governance, Risk Management & Compliance (GRC)',
      weeklyObjective: 'Implement enterprise cybersecurity governance frameworks (NIST CSF, ISO 27001), conduct quantitative risk assessments, and ensure compliance with global data privacy mandates.',
      focusSubtopics: [
        'NIST Cybersecurity Framework (CSF 2.0): Govern, Identify, Protect, Detect, Respond, Recover',
        'ISO/IEC 27001 Information Security Management System (ISMS) and Statement of Applicability (SoA)',
        'Qualitative vs Quantitative Risk Assessment: Risk = Threat × Vulnerability × Asset Value (ALE = SLE × ARO)',
        'Data Privacy Regulations: General Data Protection Regulation (GDPR), Data Protection Impact Assessments (DPIA), and SOC 2 Type II'
      ],
      handsOnActivity: 'Calculate Annualized Loss Expectancy (ALE) for a potential ransomware disruption given Single Loss Expectancy (SLE) and Annualized Rate of Occurrence (ARO).',
      outlineSourceNotes: 'Cybersecurity governance aligns security investments with enterprise business strategy and legal compliance. Quantitative risk analysis uses mathematical formulas: Single Loss Expectancy ($SLE = Asset Value \\times Exposure Factor$) multiplied by Annualized Rate of Occurrence ($ARO$) equals Annualized Loss Expectancy ($ALE$). The NIST CSF 2.0 adds the foundational "Govern" function to oversee risk strategy.',
      revisedNotes: CYBER_REVISED_NOTES['sec401-w4'],
      keyTakeaways: [
        'Risk cannot be completely eliminated; it is mitigated, transferred, accepted, or avoided.',
        'NIST CSF 2.0 unites technical operations with executive risk governance.',
        'Privacy compliance (GDPR) mandates strict 72-hour breach notification windows.'
      ],
      status: 'upcoming',
      gradeLevelTest: {
        testId: 'sec401-w4-test',
        title: 'Week 4 Grade Level Test: Cyber Governance & Risk Management',
        totalQuestions: 10,
        passingScore: 7,
        timeLimitMinutes: 15,
        questions: [
          {
            id: 1,
            question: 'In the NIST Cybersecurity Framework (CSF 2.0), what are the six core operational and governance functions?',
            options: [
              'Govern, Identify, Protect, Detect, Respond, Recover',
              'Plan, Buy, Install, Test, Update, Delete',
              'Start, Run, Stop, Reset, Clean, Power Off',
              'Encrypt, Decrypt, Compress, Send, Store, Backup'
            ],
            correctAnswer: 0,
            explanation: 'NIST CSF 2.0 establishes these six functions to provide a comprehensive, risk-based cybersecurity management cycle.',
            outlineReference: 'Section 4.1: NIST Cybersecurity Framework (CSF 2.0)'
          },
          {
            id: 2,
            question: 'What is the mathematical formula used to calculate Annualized Loss Expectancy (ALE) in quantitative risk analysis?',
            options: [
              'ALE = Single Loss Expectancy (SLE) × Annualized Rate of Occurrence (ARO)',
              'ALE = Asset Value + Number of Employees',
              'ALE = Software Cost / Number of Computers',
              'ALE = Internet Speed × Number of Hours'
            ],
            correctAnswer: 0,
            explanation: 'ALE measures the expected financial monetary loss per year by multiplying the cost of a single event (SLE) by its annual probability (ARO).',
            outlineReference: 'Section 4.2: Quantitative Risk Modeling (ALE, SLE, ARO)'
          },
          {
            id: 3,
            question: 'If a database breach costs an organization $500,000 per occurrence (SLE = $500,000) and is expected to occur once every 5 years (ARO = 0.2), what is the Annualized Loss Expectancy (ALE)?',
            options: ['$100,000 per year', '$500,000 per year', '$2,500,000 per year', '$50,000 per year'],
            correctAnswer: 0,
            explanation: '$ALE = \\$500,000 \\times 0.2 = \\$100,000$ per year. This justifies spending up to $100,000 annually on preventative security controls.',
            outlineReference: 'Section 4.2: Cost-Benefit Risk Calculations'
          },
          {
            id: 4,
            question: 'What are the four recognized strategies for managing cybersecurity risks?',
            options: [
              'Risk Mitigation, Risk Transfer (e.g. Cyber Insurance), Risk Acceptance, Risk Avoidance',
              'Risk Deletion, Risk Ignorance, Risk Blaming, Risk Hiding',
              'Risk Typing, Risk Coding, Risk Compiling, Risk Debugging',
              'Risk Buying, Risk Selling, Risk Trading, Risk Borrowing'
            ],
            correctAnswer: 0,
            explanation: 'Organizations choose among mitigating with controls, transferring with insurance, accepting within risk appetite, or avoiding activities.',
            outlineReference: 'Section 4.2: Enterprise Risk Treatment Strategies'
          },
          {
            id: 5,
            question: 'What is an "Information Security Management System" (ISMS) under ISO/IEC 27001?',
            options: [
              'A systematic, organization-wide framework of policies, procedures, and controls for managing sensitive enterprise information risks',
              'A software program that automatically answers emails',
              'A database server that runs on solar energy',
              'An antivirus application for smartphones'
            ],
            correctAnswer: 0,
            explanation: 'ISO 27001 specifies requirements for establishing, implementing, maintaining, and continually improving an enterprise ISMS.',
            outlineReference: 'Section 4.3: ISO/IEC 27001 Standards & Certification'
          },
          {
            id: 6,
            question: 'What is a "Statement of Applicability" (SoA) in an ISO 27001 audit?',
            options: [
              'A formal document identifying which ISO 27001 Annex A security controls the organization has selected and implemented, with justifications for exclusions',
              'A receipt for software license renewals',
              'A resume submitted by a job applicant',
              'A list of company holiday schedules'
            ],
            correctAnswer: 0,
            explanation: 'The SoA links the organization’s identified risk treatment plan directly to specific Annex A control implementations.',
            outlineReference: 'Section 4.3: ISO 27001 Statement of Applicability (SoA)'
          },
          {
            id: 7,
            question: 'Under the EU General Data Protection Regulation (GDPR), within what timeframe must an organization notify data protection authorities of a serious personal data breach?',
            options: [
              'Within 72 hours of becoming aware of the breach',
              'Within 1 year',
              'Within 30 business days',
              'Whenever convenient'
            ],
            correctAnswer: 0,
            explanation: 'GDPR Article 33 mandates reporting personal data breaches to regulatory supervisory authorities without undue delay and within 72 hours.',
            outlineReference: 'Section 4.4: Privacy Regulations (GDPR & Data Protection)'
          },
          {
            id: 8,
            question: 'What is the difference between a SOC 2 Type I and a SOC 2 Type II compliance audit report?',
            options: [
              'Type I evaluates control design at a single point in time; Type II evaluates operational effectiveness over an extended testing period (typically 6-12 months)',
              'Type I is for hardware; Type II is for software',
              'Type I is free; Type II costs money',
              'There is no technical difference between them'
            ],
            correctAnswer: 0,
            explanation: 'Type II proves that security controls not only exist in policy but operated effectively in practice over historical audit windows.',
            outlineReference: 'Section 4.4: SOC 2 Trust Services Criteria'
          },
          {
            id: 9,
            question: 'What is a "Data Protection Impact Assessment" (DPIA)?',
            options: [
              'A structured process designed to identify and minimize the data protection risks of a new technology project or data processing activity',
              'A test measuring the physical durability of hard drives against drops',
              'A software program that speeds up database queries',
              'An exam given to students at the end of the semester'
            ],
            correctAnswer: 0,
            explanation: 'DPIAs evaluate privacy risks prior to launching new digital systems that process personal user information.',
            outlineReference: 'Section 4.4: Privacy by Design & DPIAs'
          },
          {
            id: 10,
            question: 'What is the role of a "Chief Information Security Officer" (CISO)?',
            options: [
              'The senior executive responsible for establishing the vision, enterprise strategy, governance, and architecture for protecting digital information assets',
              'The technician who installs printer paper in the office',
              'The software engineer who writes CSS styles for websites',
              'The person who orders lunch for the engineering team'
            ],
            correctAnswer: 0,
            explanation: 'The CISO leads enterprise security programs, risk management strategy, and reports security posture to executive leadership and the Board.',
            outlineReference: 'Section 4.5: Executive Leadership & Security Governance'
          }
        ]
      }
    }
  ]
};
