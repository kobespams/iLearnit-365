import React, { useState, useEffect, useMemo } from "react";
import {
  GraduationCap, Search, Plus, X, Send, FileText, ShieldCheck,
  Mail, Download, Check, Clock, ChevronRight, Sparkles, KeyRound,
  ArrowLeft, Users, RefreshCw, Lock, Eye, EyeOff, AlertCircle, ExternalLink
} from "lucide-react";
import { UserRole } from "../types";
import { AdminAuditTrailView } from "./AdminAuditTrailView";
import { recordAuditAction } from "../services/auditTrailService";
import {
  getActiveDeveloperSession,
  verifyDeveloperCredentials,
  revokeDeveloperSession,
  maskPin,
  maskEmail,
  maskName,
  AUTHORIZED_DEVELOPERS,
  DeveloperSession
} from "../services/developerPrivacyService";

const FONT_LINK_ID = "ilearnit-fonts";

const COURSES: Record<string, string[]> = {
  "Cybersecurity Foundations": ["Network Security", "Threat Analysis", "Ethical Hacking Basics"],
  "Web Development": ["Frontend Engineering", "Backend Systems", "Full-Stack Projects"],
  "Data Science": ["Statistics & Probability", "Machine Learning", "Data Visualization"],
  "Business Studies": ["Entrepreneurship", "Digital Marketing", "Financial Literacy"],
};

export interface StudentRegistrationRecord {
  id: string;
  name: string;
  email: string;
  course: string;
  subject: string;
  regNumber: string;
  pin: string;
  registeredAt: string;
  feedbackSent: boolean;
  sentAt: string | null;
}

const INITIAL_REGISTRATIONS: StudentRegistrationRecord[] = [
  {
    id: "reg-1",
    name: "Amara Chukwu",
    email: "amara.chukwu@example.edu.ng",
    course: "Cybersecurity Foundations",
    subject: "Network Security",
    regNumber: "ILN-2026-10492",
    pin: "849201",
    registeredAt: "2026-08-10T09:30:00.000Z",
    feedbackSent: true,
    sentAt: "2026-08-10T10:15:00.000Z",
  },
  {
    id: "reg-2",
    name: "Alex Chen",
    email: "alex.chen@ilearnit365.edu",
    course: "Web Development",
    subject: "Full-Stack Projects",
    regNumber: "ILN-2026-38291",
    pin: "593820",
    registeredAt: "2026-08-12T14:15:00.000Z",
    feedbackSent: true,
    sentAt: "2026-08-12T14:20:00.000Z",
  },
  {
    id: "reg-3",
    name: "Zainab Ibrahim",
    email: "zainab.ibrahim@ilearnit365.edu",
    course: "Data Science",
    subject: "Machine Learning",
    regNumber: "ILN-2026-92847",
    pin: "719402",
    registeredAt: "2026-08-14T11:45:00.000Z",
    feedbackSent: false,
    sentAt: null,
  },
  {
    id: "reg-4",
    name: "David Adeleke",
    email: "david.adeleke@example.org",
    course: "Business Studies",
    subject: "Financial Literacy",
    regNumber: "ILN-2026-47103",
    pin: "204819",
    registeredAt: "2026-08-15T08:10:00.000Z",
    feedbackSent: false,
    sentAt: null,
  },
];

function pad(n: number | string, len: number): string {
  return String(n).padStart(len, "0");
}

function generateRegNumber(existing: StudentRegistrationRecord[]): string {
  const year = new Date().getFullYear();
  let candidate: string;
  do {
    candidate = `ILN-${year}-${pad(Math.floor(Math.random() * 100000), 5)}`;
  } while (existing.some((s) => s.regNumber === candidate));
  return candidate;
}

function generatePin(existing: StudentRegistrationRecord[]): string {
  let candidate: string;
  do {
    candidate = pad(Math.floor(Math.random() * 1000000), 6);
  } while (existing.some((s) => s.pin === candidate));
  return candidate;
}

function formatDate(iso: string | null): string {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  });
}

function feedbackBody(s: StudentRegistrationRecord): string {
  return `Dear ${s.name},

Welcome to iLearnit-365 — Learn, Grow, Achieve.

Your registration has been received and confirmed. Here is a summary of your enrollment for your records:

  Course:                 ${s.course}
  Subject specialization: ${s.subject}
  Student Registration No.: ${s.regNumber}
  Student PIN:             ${s.pin}

Keep your Registration Number and PIN secure — you will need both to sign in to your Student dashboard and to verify your enrollment. Do not share your PIN with anyone.

An official Verification Letter confirming your enrollment is attached to this message.

We're glad to have you with us.

— The iLearnit-365 Registration Office`;
}

function letterBody(s: StudentRegistrationRecord): string {
  return `IL EARNIT-365
Learn, Grow, Achieve
Office of Student Registration

${formatDate(s.registeredAt)}

VERIFICATION OF ENROLLMENT

This is to certify that ${s.name} is officially registered as a student of iLearnit-365.

  Course of study:          ${s.course}
  Subject specialization:   ${s.subject}
  Student Registration No.: ${s.regNumber}
  Student PIN:              ${s.pin}
  Status:                   Active

This letter serves as official verification of the above student's enrollment status, effective ${formatDate(s.registeredAt)}. This document may be presented to any party requiring confirmation of enrollment.

Issued by the Office of Student Registration, iLearnit-365.

_________________________
Registrar, iLearnit-365`;
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

interface AdminDashboardProps {
  onNavigateRole?: (role: UserRole) => void;
  isStandaloneMode?: boolean;
}

export default function AdminDashboard({ onNavigateRole, isStandaloneMode = false }: AdminDashboardProps = {}) {
  const [students, setStudents] = useState<StudentRegistrationRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "error" } | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: Object.keys(COURSES)[0],
    subject: COURSES[Object.keys(COURSES)[0]][0]
  });

  // Admin Dashboard Tabs: Registrations vs Audit Trail
  const [activeAdminTab, setActiveAdminTab] = useState<'registrations' | 'audit_trail'>('registrations');

  // Developer Privacy Protocol states
  const [devSession, setDevSession] = useState<DeveloperSession | null>(getActiveDeveloperSession());
  const [devKeyInput, setDevKeyInput] = useState("");
  const [selectedDevId, setSelectedDevId] = useState(AUTHORIZED_DEVELOPERS[0].developerId);
  const [devAuthError, setDevAuthError] = useState<string | null>(null);
  const [unmaskData, setUnmaskData] = useState(false);
  const [showDevAuthModal, setShowDevAuthModal] = useState(false);

  function handleDevAuth(e: React.FormEvent) {
    e.preventDefault();
    setDevAuthError(null);
    const res = verifyDeveloperCredentials(selectedDevId, devKeyInput);
    if (res.success && res.session) {
      setDevSession(res.session);
      setDevKeyInput("");
      setUnmaskData(true);
      setShowDevAuthModal(false);
      showToast(res.message, "ok");

      recordAuditAction({
        category: 'PII_ACCESS',
        action: 'Developer Privacy Authorization Granted',
        actorId: res.session.developerId,
        actorName: res.session.developerName,
        actorRole: res.session.role,
        targetResource: 'Student Registration Master Database',
        status: 'SUCCESS',
        clearanceLevel: 'NDPR Privacy Tier 1',
        details: `Decrypted masked registration PINs & emails. Token signature: ${res.session.authToken.substring(0, 16)}...`,
      });
    } else {
      setDevAuthError(res.message);
      recordAuditAction({
        category: 'PII_ACCESS',
        action: 'Developer Authorization Failed',
        actorId: selectedDevId,
        actorName: 'Unknown / Denied',
        actorRole: 'UNAUTHORIZED_ATTEMPT',
        targetResource: 'Student Registration Master Database',
        status: 'DENIED',
        details: `Invalid passkey entered for developer ID: ${selectedDevId}. Clearance denied.`,
      });
    }
  }

  function handleDevLock() {
    if (devSession) {
      recordAuditAction({
        category: 'PII_ACCESS',
        action: 'Developer Privacy Session Locked',
        actorId: devSession.developerId,
        actorName: devSession.developerName,
        actorRole: devSession.roleTitle,
        targetResource: 'Student Registration Master Database',
        status: 'INFO',
        clearanceLevel: 'NDPR Vault Locked',
        details: `Vault closed. PII re-masked under privacy protocols.`,
      });
    }
    revokeDeveloperSession();
    setDevSession(null);
    setUnmaskData(false);
    showToast("Developer session closed. Master Vault re-locked.", "ok");
  }

  useEffect(() => {
    if (!document.getElementById(FONT_LINK_ID)) {
      const link = document.createElement("link");
      link.id = FONT_LINK_ID;
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let savedData: StudentRegistrationRecord[] | null = null;
        const winStorage = (window as unknown as { storage?: { get: (k: string, b?: boolean) => Promise<{ value?: string }> } }).storage;
        
        if (winStorage?.get) {
          const res = await winStorage.get("ilearnit:registrations", true);
          if (res && res.value) {
            savedData = JSON.parse(res.value);
          }
        } else {
          const localStr = localStorage.getItem("ilearnit:registrations");
          if (localStr) {
            savedData = JSON.parse(localStr);
          }
        }

        if (savedData && Array.isArray(savedData) && savedData.length > 0) {
          setStudents(savedData);
        } else {
          setStudents(INITIAL_REGISTRATIONS);
        }
      } catch (e) {
        setStudents(INITIAL_REGISTRATIONS);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  async function persist(next: StudentRegistrationRecord[]) {
    setStudents(next);
    try {
      const winStorage = (window as unknown as { storage?: { set: (k: string, v: string, b?: boolean) => Promise<void> } }).storage;
      if (winStorage?.set) {
        await winStorage.set("ilearnit:registrations", JSON.stringify(next), true);
      }
      localStorage.setItem("ilearnit:registrations", JSON.stringify(next));
    } catch (e) {
      showToast("Couldn't save — storage error", "error");
    }
  }

  function showToast(msg: string, kind: "ok" | "error" = "ok") {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 3200);
  }

  function addRegistration(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    const regNumber = generateRegNumber(students);
    const pin = generatePin(students);
    const newStudent: StudentRegistrationRecord = {
      id: `${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      course: form.course,
      subject: form.subject,
      regNumber,
      pin,
      registeredAt: new Date().toISOString(),
      feedbackSent: false,
      sentAt: null,
    };
    const next = [newStudent, ...students];
    persist(next);
    setShowAdd(false);
    setForm({ name: "", email: "", course: Object.keys(COURSES)[0], subject: COURSES[Object.keys(COURSES)[0]][0] });
    setActiveId(newStudent.id);
    showToast(`Registration created for ${newStudent.name}`);

    recordAuditAction({
      category: 'STUDENT_REGISTRATION',
      action: `Created Student Registration: ${newStudent.name}`,
      actorId: devSession ? devSession.developerId : 'ADM-REGISTRAR-LIVE',
      actorName: devSession ? devSession.developerName : 'Institutional Registrar',
      actorRole: 'Academic Operations',
      targetResource: `Reg: ${newStudent.regNumber} (${newStudent.course})`,
      status: 'SUCCESS',
      clearanceLevel: 'LEVEL_2_REGISTRAR',
      details: `Generated registration ${newStudent.regNumber} for ${newStudent.name} (${newStudent.email}) enrolled in ${newStudent.subject}.`,
    });
  }

  function markSent(id: string) {
    const target = students.find(s => s.id === id);
    const next = students.map((s) =>
      s.id === id ? { ...s, feedbackSent: true, sentAt: new Date().toISOString() } : s
    );
    persist(next);

    if (target) {
      recordAuditAction({
        category: 'FEEDBACK_DISPATCH',
        action: `Orientation Feedback Sent to ${target.name}`,
        actorId: devSession ? devSession.developerId : 'ADM-REGISTRAR-LIVE',
        actorName: devSession ? devSession.developerName : 'Institutional Registrar',
        actorRole: 'Academic Operations',
        targetResource: `Student: ${target.regNumber}`,
        status: 'SUCCESS',
        clearanceLevel: 'LEVEL_2_REGISTRAR',
        details: `Dispatched orientation credentials and verification letter to ${target.email}.`,
      });
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      [s.name, s.email, s.course, s.subject, s.regNumber].join(" ").toLowerCase().includes(q)
    );
  }, [students, query]);

  const active = students.find((s) => s.id === activeId) || null;

  return (
    <div style={styles.app}>
      <style>{`
        * { box-sizing: border-box; }
        ::selection { background: #7C5CFC55; }
        .scrollbar::-webkit-scrollbar { width: 8px; }
        .scrollbar::-webkit-scrollbar-thumb { background: #3A3168; border-radius: 8px; }
        button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid #7C5CFC; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
        @keyframes riseIn { from { opacity:0; transform: translateY(6px);} to {opacity:1; transform:translateY(0);} }
        @keyframes toastIn { from { opacity:0; transform: translateY(10px) translateX(-50%);} to {opacity:1; transform:translateY(0) translateX(-50%);} }
      `}</style>

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandMark}><GraduationCap size={18} color="#1B1533" /></div>
          <div>
            <div style={styles.brandName}>iLearnit-365</div>
            <div style={styles.brandTag}>Learn, Grow, Achieve</div>
          </div>
        </div>

        {onNavigateRole && (
          <button
            onClick={() => onNavigateRole('hub')}
            style={styles.backBtn}
          >
            <ArrowLeft size={14} /> Back to Portals
          </button>
        )}

        <div style={styles.navSection}>Administration &amp; Logs</div>
        <button
          onClick={() => setActiveAdminTab('registrations')}
          style={{
            ...styles.navItem,
            ...(activeAdminTab === 'registrations' ? styles.navItemActive : {}),
            background: activeAdminTab === 'registrations' ? "#7C5CFC" : "transparent",
            color: activeAdminTab === 'registrations' ? "#FFFFFF" : "#DDD6FE",
            width: "100%",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 8,
            fontWeight: activeAdminTab === 'registrations' ? 700 : 500,
          }}
        >
          <FileText size={16} /> Student Registrations
        </button>

        <button
          onClick={() => setActiveAdminTab('audit_trail')}
          style={{
            ...styles.navItem,
            ...(activeAdminTab === 'audit_trail' ? styles.navItemActive : {}),
            marginTop: 4,
            background: activeAdminTab === 'audit_trail' ? "linear-gradient(135deg, #10B981, #059669)" : "rgba(16, 185, 129, 0.1)",
            border: activeAdminTab === 'audit_trail' ? "1px solid #34D399" : "1px solid rgba(16, 185, 129, 0.25)",
            color: activeAdminTab === 'audit_trail' ? "#FFFFFF" : "#6EE7B7",
            width: "100%",
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
            borderRadius: 8,
            fontWeight: 700,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldCheck size={16} color={activeAdminTab === 'audit_trail' ? "#FFFFFF" : "#34D399"} />
            <span>Audit Trail &amp; Logs</span>
          </div>
          <span style={{
            fontSize: 9,
            background: activeAdminTab === 'audit_trail' ? "#FFFFFF33" : "rgba(16, 185, 129, 0.2)",
            color: activeAdminTab === 'audit_trail' ? "#FFFFFF" : "#34D399",
            padding: "1px 5px",
            borderRadius: 4,
            fontFamily: "monospace",
            fontWeight: 700
          }}>
            LIVE
          </span>
        </button>

        {onNavigateRole && (
          <>
            <button
              onClick={() => onNavigateRole('ilearnit_security')}
              style={{
                ...styles.navItem,
                marginTop: 6,
                background: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                color: "#A5B4FC",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                borderRadius: 8,
                padding: "8px 12px",
                fontWeight: 700,
              }}
            >
              <ShieldCheck size={16} color="#A5B4FC" /> iLearnit Security &amp; OTP
            </button>
            <button
              onClick={() => onNavigateRole('cheal_hub')}
              style={{
                ...styles.navItem,
                marginTop: 6,
                background: "rgba(6, 182, 212, 0.15)",
                border: "1px solid rgba(6, 182, 212, 0.3)",
                color: "#38BDF8",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                borderRadius: 8,
                padding: "8px 12px",
                fontWeight: 700,
              }}
            >
              <ShieldCheck size={16} color="#38BDF8" /> CHEAL Secure Hub
            </button>
          </>
        )}

        <div style={styles.statsBlock}>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Total students</span>
            <span style={styles.statValue}>{students.length}</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Feedback sent</span>
            <span style={styles.statValue}>{students.filter((s) => s.feedbackSent).length}</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Pending</span>
            <span style={{ ...styles.statValue, color: "#F4B942" }}>
              {students.filter((s) => !s.feedbackSent).length}
            </span>
          </div>
        </div>

        <div style={styles.sidebarNote}>
          🔒 Developer Protected — Master registration records &amp; PINs restricted to Developer / DPO clearance under NDPR/GDPR privacy protocols.
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        {/* Developer Clearance Banner */}
        <div style={{
          background: devSession ? "rgba(16, 185, 129, 0.12)" : "rgba(124, 92, 252, 0.12)",
          border: devSession ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(124, 92, 252, 0.3)",
          borderRadius: 12,
          padding: "12px 18px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: devSession ? "#10B98122" : "#7C5CFC22",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: devSession ? "#34D399" : "#A78BFA",
            }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: devSession ? "#6EE7B7" : "#DDD6FE", display: "flex", alignItems: "center", gap: 8 }}>
                {devSession ? `ACTIVE DEVELOPER CLEARANCE: ${devSession.developerName}` : "DEVELOPER PRIVACY PROTOCOL ENFORCED"}
                <span style={{
                  fontSize: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  background: devSession ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 185, 66, 0.2)",
                  color: devSession ? "#6EE7B7" : "#FDE047",
                  padding: "2px 6px",
                  borderRadius: 4,
                  border: devSession ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(244, 185, 66, 0.4)"
                }}>
                  {devSession ? "ROOT DEV ENCLAVE" : "STRICT PRIVACY GUARD"}
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: "#8B81B8", marginTop: 2 }}>
                {devSession 
                  ? `Authenticated session token: ${devSession.authToken.slice(0, 14)}... • PII decrypted for authoritative review`
                  : "Profile records & raw PIN credentials accessible only by authenticated Developers under NDPR / FERPA protocols."}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {devSession ? (
              <>
                <button
                  onClick={() => setUnmaskData(!unmaskData)}
                  style={{
                    ...styles.secondaryBtn,
                    padding: "6px 12px",
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {unmaskData ? <EyeOff size={14} /> : <Eye size={14} />}
                  {unmaskData ? "Mask PII" : "Unmask PII"}
                </button>
                <button
                  onClick={handleDevLock}
                  style={{
                    ...styles.secondaryBtn,
                    background: "rgba(244, 91, 105, 0.15)",
                    borderColor: "rgba(244, 91, 105, 0.4)",
                    color: "#FCA5A5",
                    padding: "6px 12px",
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Lock size={14} /> Lock Vault
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowDevAuthModal(true)}
                style={{
                  ...styles.primaryBtn,
                  background: "linear-gradient(135deg, #7C5CFC, #6366F1)",
                  padding: "8px 14px",
                  fontSize: 12.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <KeyRound size={14} /> Authenticate Developer Access
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          background: "rgba(255, 255, 255, 0.04)",
          padding: 6,
          borderRadius: 14,
          border: "1px solid rgba(255, 255, 255, 0.08)",
          width: "fit-content",
        }}>
          <button
            onClick={() => setActiveAdminTab('registrations')}
            style={{
              background: activeAdminTab === 'registrations' ? "#7C5CFC" : "transparent",
              color: activeAdminTab === 'registrations' ? "#FFFFFF" : "#A5B4FC",
              border: "none",
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s ease",
            }}
          >
            <FileText size={15} />
            <span>Student Registrations &amp; Vault</span>
            <span style={{
              background: activeAdminTab === 'registrations' ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
              padding: "1px 6px",
              borderRadius: 6,
              fontSize: 11,
              fontFamily: "monospace"
            }}>
              {students.length}
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('audit_trail')}
            style={{
              background: activeAdminTab === 'audit_trail' ? "linear-gradient(135deg, #10B981, #059669)" : "transparent",
              color: activeAdminTab === 'audit_trail' ? "#FFFFFF" : "#6EE7B7",
              border: "none",
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s ease",
            }}
          >
            <ShieldCheck size={15} color={activeAdminTab === 'audit_trail' ? "#FFFFFF" : "#34D399"} />
            <span>Audit Trail &amp; Accountability Log</span>
            <span style={{
              background: activeAdminTab === 'audit_trail' ? "rgba(255,255,255,0.2)" : "rgba(16, 185, 129, 0.15)",
              color: activeAdminTab === 'audit_trail' ? "#FFFFFF" : "#34D399",
              padding: "1px 6px",
              borderRadius: 6,
              fontSize: 10,
              fontFamily: "monospace",
              fontWeight: 700
            }}>
              LIVE WATCHDOG
            </span>
          </button>

          {!isStandaloneMode && (
            <button
              onClick={() => {
                const url = `${window.location.origin}${window.location.pathname}?hub=admin&mode=standalone`;
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              style={{
                background: "rgba(99, 102, 241, 0.15)",
                color: "#C7D2FE",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                borderRadius: 10,
                padding: "8px 14px",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginLeft: "auto",
                transition: "all 0.2s ease",
              }}
              title="Open Admin Master Vault in a separate workstation window"
            >
              <ExternalLink size={14} color="#818CF8" />
              <span>Open in Separate Page</span>
            </button>
          )}
        </div>

        {activeAdminTab === 'audit_trail' ? (
          <div style={{ animation: "riseIn 0.3s ease" }}>
            <AdminAuditTrailView onNavigateRole={onNavigateRole} />
          </div>
        ) : (
          <>
            <header style={styles.header}>
              <div>
                <h1 style={styles.h1}>Student Registrations</h1>
                <p style={styles.sub}>Generate feedback and verification letters after registration.</p>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {onNavigateRole && (
                  <button
                    style={{
                      ...styles.secondaryBtn,
                      background: "rgba(6, 182, 212, 0.15)",
                      border: "1px solid rgba(6, 182, 212, 0.4)",
                      color: "#38BDF8",
                    }}
                    onClick={() => onNavigateRole('cheal_hub')}
                  >
                    <ShieldCheck size={15} color="#38BDF8" /> CHEAL Platform
                  </button>
                )}
                {onNavigateRole && (
                  <button
                    style={styles.secondaryBtn}
                    onClick={() => onNavigateRole('hub')}
                  >
                    <ArrowLeft size={15} /> All Hubs
                  </button>
                )}
                <button 
                  style={styles.primaryBtn} 
                  onClick={() => {
                    if (!devSession) {
                      setShowDevAuthModal(true);
                    } else {
                      setShowAdd(true);
                    }
                  }}
                >
                  <Plus size={16} /> New registration
                </button>
              </div>
            </header>

            <div style={styles.searchRow}>
              <Search size={15} color="#8B81B8" />
              <input
                style={styles.searchInput}
                placeholder="Search by name, email, course, or reg. number"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div style={styles.tableWrap} className="scrollbar">
              {!loaded ? (
                <div style={styles.emptyState}>Loading registrations…</div>
              ) : filtered.length === 0 ? (
                <div style={styles.emptyState}>
                  <Sparkles size={22} color="#7C5CFC" />
                  <div style={{ marginTop: 10 }}>
                    {students.length === 0
                      ? "No registrations yet. Create one to generate its feedback and verification letter."
                      : "No matches for your search."}
                  </div>
                </div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {["Student", "Course / Subject", "Reg. No.", "PIN (Developer Guarded)", "Status", ""].map((h) => (
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr
                        key={s.id}
                        style={styles.tr}
                        onClick={() => setActiveId(s.id)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#2A2352")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={styles.td}>
                          <div style={styles.nameCell}>
                            {devSession && unmaskData ? s.name : maskName(s.name)}
                          </div>
                          <div style={styles.emailCell}>
                            {devSession && unmaskData ? s.email : maskEmail(s.email)}
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div>{s.course}</div>
                          <div style={styles.subjectCell}>{s.subject}</div>
                        </td>
                        <td style={{ ...styles.td, ...styles.mono }}>{s.regNumber}</td>
                        <td style={{ ...styles.td, ...styles.mono }}>
                          {devSession && unmaskData ? (
                            <span style={{ color: "#F4B942", fontWeight: 700 }}>{s.pin}</span>
                          ) : (
                            <span style={{ color: "#8B81B8" }}>••••</span>
                          )}
                        </td>
                        <td style={styles.td}>
                          {s.feedbackSent ? (
                            <span style={styles.badgeSent}><Check size={12} /> Sent</span>
                          ) : (
                            <span style={styles.badgePending}><Clock size={12} /> Pending</span>
                          )}
                        </td>
                        <td style={{ ...styles.td, textAlign: "right" }}>
                          <ChevronRight size={16} color="#8B81B8" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>

      {/* Add registration modal */}
      {showAdd && (
        <div style={styles.overlay} onClick={() => setShowAdd(false)}>
          <form style={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={addRegistration}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>New registration</h2>
              <button type="button" style={styles.iconBtn} onClick={() => setShowAdd(false)}><X size={16} /></button>
            </div>

            <label style={styles.label}>Full name</label>
            <input
              style={styles.input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Amara Chukwu"
              required
            />

            <label style={styles.label}>Email on file</label>
            <input
              style={styles.input}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="student@example.com"
              required
            />

            <label style={styles.label}>Course</label>
            <select
              style={styles.input}
              value={form.course}
              onChange={(e) =>
                setForm({ ...form, course: e.target.value, subject: COURSES[e.target.value][0] })
              }
            >
              {Object.keys(COURSES).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <label style={styles.label}>Subject</label>
            <select
              style={styles.input}
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            >
              {COURSES[form.course].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <button type="submit" style={{ ...styles.primaryBtn, width: "100%", justifyContent: "center", marginTop: 18 }}>
              <KeyRound size={16} /> Create registration &amp; generate credentials
            </button>
          </form>
        </div>
      )}

      {/* Detail / generate panel */}
      {active && (
        <div style={styles.overlay} onClick={() => setActiveId(null)}>
          <div style={styles.detailPanel} className="scrollbar" onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {devSession && unmaskData ? active.name : maskName(active.name)}
              </h2>
              <button style={styles.iconBtn} onClick={() => setActiveId(null)}><X size={16} /></button>
            </div>

            {!devSession ? (
              <div style={{ padding: "16px 0", textAlign: "center" }}>
                <div style={{
                  background: "rgba(244, 185, 66, 0.1)",
                  border: "1px solid rgba(244, 185, 66, 0.3)",
                  borderRadius: 12,
                  padding: 18,
                  marginBottom: 16,
                  textAlign: "left",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#FDE047", fontWeight: 700, fontSize: 13 }}>
                    <ShieldCheck size={16} /> Developer Privacy Protocol Restricted
                  </div>
                  <p style={{ color: "#D1D5DB", fontSize: 12, lineHeight: 1.5, marginTop: 6 }}>
                    Full profile verification letters, plaintext PINs, and student communication are restricted exclusively to authorized developers and data privacy officers.
                  </p>
                </div>
                <button
                  style={{ ...styles.primaryBtn, width: "100%", justifyContent: "center" }}
                  onClick={() => {
                    setActiveId(null);
                    setShowDevAuthModal(true);
                  }}
                >
                  <KeyRound size={15} /> Authenticate as Developer
                </button>
              </div>
            ) : (
              <>
                <div style={styles.credRow}>
                  <div style={styles.credBox}>
                    <div style={styles.credLabel}>Registration No.</div>
                    <div style={styles.credValue}>{active.regNumber}</div>
                  </div>
                  <div style={styles.credBox}>
                    <div style={styles.credLabel}>PIN</div>
                    <div style={styles.credValue}>
                      {unmaskData ? active.pin : "••••"}
                    </div>
                  </div>
                </div>
                <div style={styles.courseLine}>{active.course} — {active.subject}</div>
                <div style={styles.emailLine}>
                  <Mail size={13} /> {unmaskData ? active.email : maskEmail(active.email)}
                </div>

                <div style={styles.sectionLabel}><Mail size={13} /> Feedback message preview</div>
                <pre style={styles.previewBox}>{feedbackBody(active)}</pre>

                <div style={styles.sectionLabel}><ShieldCheck size={13} /> Verification letter preview</div>
                <pre style={{ ...styles.previewBox, ...styles.letterBox }}>{letterBody(active)}</pre>

                <div style={styles.detailActions}>
                  <button
                    style={styles.secondaryBtn}
                    onClick={() => downloadText(`${active.regNumber}-verification-letter.txt`, letterBody(active))}
                  >
                    <Download size={15} /> Download letter
                  </button>
                  <button
                    style={active.feedbackSent ? styles.disabledBtn : styles.primaryBtn}
                    disabled={active.feedbackSent}
                    onClick={() => {
                      markSent(active.id);
                      showToast(`Feedback + letter sent to ${active.email} (simulated)`);
                    }}
                  >
                    <Send size={15} /> {active.feedbackSent ? "Already sent" : "Send to student email"}
                  </button>
                </div>
                {active.feedbackSent && (
                  <div style={styles.sentNote}>Sent {formatDate(active.sentAt)} · this run only simulates delivery.</div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Developer Authorization Modal */}
      {showDevAuthModal && (
        <div style={styles.overlay} onClick={() => setShowDevAuthModal(false)}>
          <form style={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={handleDevAuth}>
            <div style={styles.modalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ShieldCheck size={18} color="#7C5CFC" />
                <h2 style={styles.modalTitle}>Developer Privacy Clearance</h2>
              </div>
              <button type="button" style={styles.iconBtn} onClick={() => setShowDevAuthModal(false)}><X size={16} /></button>
            </div>

            <div style={{
              background: "rgba(124, 92, 252, 0.12)",
              border: "1px solid rgba(124, 92, 252, 0.25)",
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 14,
              fontSize: 12,
              color: "#C4B5FD",
              lineHeight: 1.5,
            }}>
              Registered student profile records and plaintext credentials are strictly protected under NDPR / FERPA privacy protocols and accessible by developers only.
            </div>

            <label style={styles.label}>Select Developer Identity</label>
            <select
              style={styles.input}
              value={selectedDevId}
              onChange={(e) => setSelectedDevId(e.target.value)}
            >
              {AUTHORIZED_DEVELOPERS.map((d) => (
                <option key={d.developerId} value={d.developerId}>
                  {d.name} ({d.developerId}) — {d.role}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <label style={{ ...styles.label, margin: 0 }}>Developer Secret Key</label>
              <button
                type="button"
                onClick={() => setDevKeyInput("DEV-SECURE-365!")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#38BDF8",
                  fontSize: 11,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Auto-fill Test Key
              </button>
            </div>
            <input
              style={{ ...styles.input, marginTop: 6 }}
              type="password"
              value={devKeyInput}
              onChange={(e) => setDevKeyInput(e.target.value)}
              placeholder="Enter developer access key..."
              required
            />

            {devAuthError && (
              <div style={{
                marginTop: 12,
                padding: "8px 12px",
                background: "rgba(244, 91, 105, 0.15)",
                border: "1px solid rgba(244, 91, 105, 0.3)",
                borderRadius: 8,
                color: "#FCA5A5",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}>
                <AlertCircle size={14} />
                <span>{devAuthError}</span>
              </div>
            )}

            <button
              type="submit"
              style={{
                ...styles.primaryBtn,
                width: "100%",
                justifyContent: "center",
                marginTop: 18,
                background: "linear-gradient(135deg, #7C5CFC, #6366F1)",
              }}
            >
              <Lock size={15} /> Authorize Developer Access
            </button>
          </form>
        </div>
      )}

      {toast && (
        <div style={{ ...styles.toast, borderColor: toast.kind === "error" ? "#F45B69" : "#3FE0C5" }}>
          {toast.kind === "error" ? <X size={14} color="#F45B69" /> : <Check size={14} color="#3FE0C5" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    display: "flex",
    minHeight: "100vh",
    background: "#1B1533",
    color: "#F5F3FA",
    fontFamily: "'Inter', sans-serif",
  },
  sidebar: {
    width: 240,
    minWidth: 240,
    background: "#191231",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    padding: "22px 18px",
    display: "flex",
    flexDirection: "column",
  },
  brand: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20 },
  brandMark: {
    width: 32, height: 32, borderRadius: 9,
    background: "linear-gradient(135deg, #F4B942, #3FE0C5)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  brandName: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 16, lineHeight: 1.1 },
  brandTag: { fontSize: 10.5, color: "#8B81B8", letterSpacing: "0.04em", marginTop: 2 },
  backBtn: {
    display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 10px",
    fontSize: 12, color: "#B8AFD9", cursor: "pointer", marginBottom: 16, transition: "background 0.15s",
  },
  navSection: { fontSize: 10.5, letterSpacing: "0.09em", textTransform: "uppercase", color: "#635A96", margin: "6px 8px 8px" },
  navItem: { display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 8, fontSize: 13.5, color: "#B8AFD9" },
  navItemActive: { background: "#2A2352", color: "#F5F3FA", fontWeight: 600 },
  statsBlock: { marginTop: "auto", paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.06)" },
  statRow: { display: "flex", justifyContent: "space-between", padding: "5px 8px", fontSize: 12.5 },
  statLabel: { color: "#8B81B8" },
  statValue: { fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 },
  sidebarNote: { fontSize: 10.5, color: "#635A96", padding: "12px 8px 0", lineHeight: 1.5 },
  main: { flex: 1, padding: "30px 36px", minWidth: 0 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 14 },
  h1: { fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 600, margin: 0 },
  sub: { color: "#8B81B8", fontSize: 13.5, margin: "6px 0 0" },
  primaryBtn: {
    display: "flex", alignItems: "center", gap: 8, background: "#7C5CFC", color: "#fff",
    border: "none", borderRadius: 9, padding: "10px 16px", fontSize: 13.5, fontWeight: 600,
    cursor: "pointer", transition: "background 0.15s",
  },
  secondaryBtn: {
    display: "flex", alignItems: "center", gap: 8, background: "transparent", color: "#F5F3FA",
    border: "1px solid rgba(255,255,255,0.14)", borderRadius: 9, padding: "10px 16px",
    fontSize: 13.5, fontWeight: 600, cursor: "pointer",
  },
  disabledBtn: {
    display: "flex", alignItems: "center", gap: 8, background: "#332C5C", color: "#8B81B8",
    border: "none", borderRadius: 9, padding: "10px 16px", fontSize: 13.5, fontWeight: 600, cursor: "not-allowed",
  },
  iconBtn: { background: "transparent", border: "none", color: "#8B81B8", cursor: "pointer", padding: 4 },
  searchRow: {
    display: "flex", alignItems: "center", gap: 10, background: "#221B41",
    border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, maxWidth: 420,
  },
  searchInput: { background: "transparent", border: "none", outline: "none", color: "#F5F3FA", fontSize: 13.5, width: "100%" },
  tableWrap: { background: "#1F1840", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "auto", maxHeight: "calc(100vh - 210px)" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { textAlign: "left", padding: "12px 16px", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#8B81B8", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, background: "#1F1840" },
  tr: { cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.12s" },
  td: { padding: "13px 16px", verticalAlign: "top" },
  mono: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "#C9C2E8" },
  nameCell: { fontWeight: 600 },
  emailCell: { color: "#8B81B8", fontSize: 12, marginTop: 2 },
  subjectCell: { color: "#8B81B8", fontSize: 12, marginTop: 2 },
  badgeSent: { display: "inline-flex", alignItems: "center", gap: 5, background: "#3FE0C51A", color: "#3FE0C5", padding: "3px 9px", borderRadius: 20, fontSize: 11.5, fontWeight: 600 },
  badgePending: { display: "inline-flex", alignItems: "center", gap: 5, background: "#F4B9421A", color: "#F4B942", padding: "3px 9px", borderRadius: 20, fontSize: 11.5, fontWeight: 600 },
  emptyState: { padding: "60px 20px", textAlign: "center", color: "#8B81B8", fontSize: 13.5 },
  overlay: { position: "fixed", inset: 0, background: "#0D0A1FCC", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 },
  modal: { background: "#221B41", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 26, width: 420, maxWidth: "100%", animation: "riseIn 0.18s ease" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  modalTitle: { fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 600, margin: 0 },
  label: { display: "block", fontSize: 12, color: "#8B81B8", margin: "12px 0 6px" },
  input: { width: "100%", background: "#1B1533", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 12px", color: "#F5F3FA", fontSize: 13.5 },
  detailPanel: { background: "#221B41", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 26, width: 560, maxWidth: "100%", maxHeight: "88vh", overflow: "auto", animation: "riseIn 0.18s ease" },
  credRow: { display: "flex", gap: 12, marginBottom: 12 },
  credBox: { flex: 1, background: "#1B1533", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px" },
  credLabel: { fontSize: 10.5, color: "#8B81B8", textTransform: "uppercase", letterSpacing: "0.05em" },
  credValue: { fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700, marginTop: 3, color: "#F4B942" },
  courseLine: { fontSize: 13.5, marginBottom: 4 },
  emailLine: { display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#8B81B8", marginBottom: 18 },
  sectionLabel: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#3FE0C5", fontWeight: 600, margin: "16px 0 8px" },
  previewBox: { background: "#1B1533", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 16, fontSize: 12.5, lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "'JetBrains Mono', monospace", color: "#D8D2F0", margin: 0 },
  letterBox: { borderColor: "#F4B94255" },
  detailActions: { display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" },
  sentNote: { fontSize: 11.5, color: "#635A96", marginTop: 10 },
  toast: {
    position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
    background: "#221B41", border: "1px solid", borderRadius: 10, padding: "11px 18px",
    display: "flex", alignItems: "center", gap: 8, fontSize: 13, boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    animation: "toastIn 0.2s ease", zIndex: 100,
  },
};
