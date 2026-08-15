import React, { useState, useEffect, useMemo } from "react";
import {
  GraduationCap, Search, Plus, X, Send, FileText, ShieldCheck,
  Mail, Download, Check, Clock, ChevronRight, Sparkles, KeyRound,
  ArrowLeft, Users, RefreshCw
} from "lucide-react";
import { UserRole } from "../types";

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
}

export default function AdminDashboard({ onNavigateRole }: AdminDashboardProps = {}) {
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
  }

  function markSent(id: string) {
    const next = students.map((s) =>
      s.id === id ? { ...s, feedbackSent: true, sentAt: new Date().toISOString() } : s
    );
    persist(next);
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

        <div style={styles.navSection}>Registrar</div>
        <div style={{ ...styles.navItem, ...styles.navItemActive }}>
          <FileText size={16} /> Registrations
        </div>

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
          Shared admin data — visible to anyone using this registrar console.
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.h1}>Student Registrations</h1>
            <p style={styles.sub}>Generate feedback and verification letters after registration.</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {onNavigateRole && (
              <button
                style={styles.secondaryBtn}
                onClick={() => onNavigateRole('hub')}
              >
                <ArrowLeft size={15} /> All Hubs
              </button>
            )}
            <button style={styles.primaryBtn} onClick={() => setShowAdd(true)}>
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
                  {["Student", "Course / Subject", "Reg. No.", "PIN", "Status", ""].map((h) => (
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
                      <div style={styles.nameCell}>{s.name}</div>
                      <div style={styles.emailCell}>{s.email}</div>
                    </td>
                    <td style={styles.td}>
                      <div>{s.course}</div>
                      <div style={styles.subjectCell}>{s.subject}</div>
                    </td>
                    <td style={{ ...styles.td, ...styles.mono }}>{s.regNumber}</td>
                    <td style={{ ...styles.td, ...styles.mono }}>{s.pin}</td>
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
              <h2 style={styles.modalTitle}>{active.name}</h2>
              <button style={styles.iconBtn} onClick={() => setActiveId(null)}><X size={16} /></button>
            </div>

            <div style={styles.credRow}>
              <div style={styles.credBox}>
                <div style={styles.credLabel}>Registration No.</div>
                <div style={styles.credValue}>{active.regNumber}</div>
              </div>
              <div style={styles.credBox}>
                <div style={styles.credLabel}>PIN</div>
                <div style={styles.credValue}>{active.pin}</div>
              </div>
            </div>
            <div style={styles.courseLine}>{active.course} — {active.subject}</div>
            <div style={styles.emailLine}><Mail size={13} /> {active.email}</div>

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
          </div>
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
