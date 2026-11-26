import React, { useState, useEffect, Suspense, lazy } from 'react';
import { UserRole, StudentDetail, Announcement } from './types';
import { Header } from './components/Header';
import { HubNavigationHeader } from './components/HubNavigationHeader';
import { RoleHub } from './components/RoleHub';
import { OfflineBanner } from './components/OfflineBanner';
import { AdminRestrictionGuard } from './components/AdminRestrictionGuard';
import { Admin3FAClearanceModal } from './components/Admin3FAClearanceModal';
import { LoginPage } from './components/LoginPage';
import { RegistrationPage } from './components/RegistrationPage';
import { SignInModal } from './components/SignInModal';
import { AuthGuardNotice } from './components/AuthGuardNotice';
import { AnnouncementNewslineTicker } from './components/AnnouncementNewslineTicker';
import { SwiftPageNavigator } from './components/SwiftPageNavigator';
import { Footer } from './components/Footer';
import { applyTheme, getInitialTheme } from './utils/theme';
import { getActive3FAClearance, revoke3FAClearance, subscribeAdminSession, Admin3FASession } from './services/admin3FAService';
import { getRegisteredStudents } from './services/authStorage';
import { logBackendTabAccess } from './services/auditTrailService';
import {
  INITIAL_STUDENT_COURSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_CLASSES,
  CURRENT_STUDENT_PROFILE,
  SAMPLE_STUDENTS,
  INITIAL_TEACHER_NOTES,
  SAMPLE_QUIZ_QUESTIONS,
  INITIAL_ANNOUNCEMENTS,
} from './data/mockData';

// Lazy-load heavy portals & modules to keep initial 3G bundle lightweight
const StudentPortal = lazy(() => import('./components/StudentPortal').then((m) => ({ default: m.StudentPortal })));
const TeacherPortal = lazy(() => import('./components/TeacherPortal').then((m) => ({ default: m.TeacherPortal })));
const ParentPortal = lazy(() => import('./components/ParentPortal').then((m) => ({ default: m.ParentPortal })));
const JAMBTestDriller = lazy(() => import('./components/JAMBTestDriller').then((m) => ({ default: m.JAMBTestDriller })));
const PrivacyAndTrustCenter = lazy(() =>
  import('./components/PrivacyAndTrustCenter').then((m) => ({ default: m.PrivacyAndTrustCenter }))
);
const JSSAllSubjectsExplorer = lazy(() =>
  import('./components/JSSAllSubjectsExplorer').then((m) => ({ default: m.JSSAllSubjectsExplorer }))
);
const AdminBackendLogsPortal = lazy(() =>
  import('./components/AdminBackendLogsPortal').then((m) => ({ default: m.AdminBackendLogsPortal }))
);
const CyberSecurityExplorer = lazy(() =>
  import('./components/CyberSecurityExplorer').then((m) => ({ default: m.CyberSecurityExplorer }))
);
const CBTExamInterface = lazy(() =>
  import('./components/CBTExamInterface').then((m) => ({ default: m.CBTExamInterface }))
);
const StudentStudyHub = lazy(() => import('./components/StudentStudyHub').then((m) => ({ default: m.StudentStudyHub })));
const ResultsHub = lazy(() => import('./components/ResultsHub').then((m) => ({ default: m.ResultsHub })));
const CGPACalculatorHub = lazy(() =>
  import('./components/CGPACalculatorHub').then((m) => ({ default: m.CGPACalculatorHub }))
);
const SupportHelpDeskHub = lazy(() =>
  import('./components/SupportHelpDeskHub').then((m) => ({ default: m.SupportHelpDeskHub }))
);
const ModuleResponseViewer = lazy(() =>
  import('./components/ModuleResponseViewer').then((m) => ({ default: m.ModuleResponseViewer }))
);

const PROTECTED_BACKEND_ROLES: UserRole[] = ['admin', 'cheal_hub', 'ilearnit_security', 'deployment'];

const PortalLoadingFallback: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3" role="status" aria-live="polite">
    <div className="w-8 h-8 rounded-full border-2 border-[#0B1D3A] dark:border-blue-400 border-t-transparent animate-spin mx-auto" />
    <p className="text-xs font-sora font-semibold text-slate-600 dark:text-slate-300">
      Loading learning workspace (optimized for 3G)...
    </p>
  </div>
);

const isPrivateAdminLogsUrl = (): boolean => {
  try {
    const params = new URLSearchParams(window.location.search);
    return (
      window.location.pathname.endsWith('/admin-logs') ||
      params.get('portal') === 'admin-logs' ||
      window.location.hash === '#/admin-logs'
    );
  } catch {
    return false;
  }
};

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('hub');
  const [isPrivateAdminLogsRoute, setIsPrivateAdminLogsRoute] = useState<boolean>(() => isPrivateAdminLogsUrl());
  const [isStandaloneMode, setIsStandaloneMode] = useState<boolean>(false);
  const [initialModuleResponseId, setInitialModuleResponseId] = useState<string | undefined>(undefined);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userSignedIn, setUserSignedIn] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [teacherOpenCreateClass, setTeacherOpenCreateClass] = useState(false);
  const [jambQuickSample, setJambQuickSample] = useState(false);
  const [userName, setUserName] = useState('Samuel Adebayo');
  const [activeStudent, setActiveStudent] = useState<StudentDetail>(CURRENT_STUDENT_PROFILE);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 3FA Admin Clearance state
  const [threeFAModalOpen, setThreeFAModalOpen] = useState(false);
  const [pendingBackendRole, setPendingBackendRole] = useState<UserRole | null>(null);
  const [active3FASession, setActive3FASession] = useState<Admin3FASession | null>(() => getActive3FAClearance());

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const syncFromUrl = () => {
      try {
        const privateRoute = isPrivateAdminLogsUrl();
        setIsPrivateAdminLogsRoute(privateRoute);
        if (privateRoute) return;

        const params = new URLSearchParams(window.location.search);
        const hubParam = params.get('hub') as UserRole | null;
        const modeParam = params.get('mode');
        const moduleParam = params.get('module');

        if (modeParam === 'standalone') {
          setIsStandaloneMode(true);
        }
        if (moduleParam) {
          setInitialModuleResponseId(moduleParam);
        }
        if (hubParam && !PROTECTED_BACKEND_ROLES.includes(hubParam)) {
          setCurrentRole(hubParam);
        } else if (window.location.hash) {
          const hashRole = window.location.hash.replace('#', '') as UserRole;
          if (hashRole && !PROTECTED_BACKEND_ROLES.includes(hashRole)) {
            setCurrentRole(hashRole);
          }
        }
      } catch {
        // Fallback gracefully
      }
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    applyTheme(initialTheme);

    const registered = getRegisteredStudents();
    if (registered.length > 0) {
      const first = registered[0];
      setActiveStudent(first);
      setUserName(first.name);
    }
  }, []);

  useEffect(() => {
    setActive3FASession(getActive3FAClearance());
    const unsub = subscribeAdminSession(() => {
      setActive3FASession(getActive3FAClearance());
    });
    return unsub;
  }, [currentRole]);

  const currentUserId = activeStudent?.id || activeStudent?.studentId || 'st-101';
  const unreadAnnouncementsCount = announcements.filter(
    (a) => !a.readBy.includes(currentUserId)
  ).length;

  const handleRoleSelection = (
    role: UserRole,
    options?: { demo?: boolean; openCreateClass?: boolean; quickSample?: boolean }
  ) => {
    if (PROTECTED_BACKEND_ROLES.includes(role)) {
      const clearance = getActive3FAClearance();
      if (!clearance) {
        setPendingBackendRole(role);
        setThreeFAModalOpen(true);
        return;
      } else {
        logBackendTabAccess(role, clearance.adminName, clearance.adminId, clearance.clearanceLevel);
      }
    }

    if (options?.demo) {
      setIsDemoMode(true);
    }
    setTeacherOpenCreateClass(Boolean(options?.openCreateClass));
    setJambQuickSample(Boolean(options?.quickSample));
    setCurrentRole(role);

    try {
      const url = new URL(window.location.href);
      url.searchParams.set('hub', role);
      if (isStandaloneMode) {
        url.searchParams.set('mode', 'standalone');
      }
      window.history.pushState({ role }, '', url.toString());
    } catch {
      // Ignored in sandboxed iframes
    }
  };

  const handleOpenSeparatePage = (role: UserRole) => {
    try {
      const url = `${window.location.origin}${window.location.pathname}?hub=${role}&mode=standalone`;
      window.open(url, '_blank', 'noopener,noreferrer');
      showToast(`Opened ${role.toUpperCase()} in separate workstation window.`);
    } catch {
      showToast(`Launching separate page for ${role}...`);
    }
  };

  const handleOpenModuleResponses = (moduleKey?: string) => {
    if (moduleKey) {
      setInitialModuleResponseId(moduleKey);
    }
    handleRoleSelection('module_responses');
  };

  const handle3FASuccess = (session: Admin3FASession) => {
    setActive3FASession(session);
    setThreeFAModalOpen(false);
    showToast(`3FA Clearance verified: Tier 3 Clearance active for ${session.adminName}`);
    if (pendingBackendRole) {
      logBackendTabAccess(pendingBackendRole, session.adminName, session.adminId, session.clearanceLevel);
      setCurrentRole(pendingBackendRole);
      setPendingBackendRole(null);
    }
  };

  const handleRevoke3FA = () => {
    revoke3FAClearance();
    setActive3FASession(null);
    showToast('3FA Administrative Clearance revoked. Backend tabs restricted.');
    if (PROTECTED_BACKEND_ROLES.includes(currentRole)) {
      setCurrentRole('hub');
    }
  };

  const handleMarkAnnouncementRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === id && !a.readBy.includes(currentUserId)
          ? { ...a, readBy: [...a.readBy, currentUserId] }
          : a
      )
    );
  };

  const handleMarkAllAnnouncementsRead = () => {
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.readBy.includes(currentUserId)
          ? a
          : { ...a, readBy: [...a.readBy, currentUserId] }
      )
    );
    showToast('All announcements marked as read');
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Announcement deleted');
  };

  const handleAddAnnouncement = (newA: Omit<Announcement, 'id' | 'createdAt' | 'readBy'>) => {
    const item: Announcement = {
      ...newA,
      id: `ann-${Date.now()}`,
      timestamp: 'Just now',
      createdAt: Date.now(),
      readBy: [],
    };
    setAnnouncements((prev) => [item, ...prev]);
    showToast(`Published announcement: "${item.title}"`);
  };

  const handleSignInSuccess = (role: 'student' | 'teacher' | 'parent') => {
    setUserSignedIn(true);
    setIsDemoMode(false);
    setAuthModalOpen(false);
    setCurrentRole(role);
    showToast(`Signed in successfully as ${role.toUpperCase()}!`);
  };

  const handleLoginSuccess = (roleOrDetail?: UserRole | Partial<StudentDetail>, detailArg?: Partial<StudentDetail>) => {
    const resolvedRole: UserRole = typeof roleOrDetail === 'string' ? roleOrDetail : 'student';
    const detail: Partial<StudentDetail> | undefined =
      typeof roleOrDetail === 'string' ? detailArg : roleOrDetail;

    setUserSignedIn(true);
    setIsDemoMode(false);
    if (detail?.name) {
      setUserName(detail.name);
      setActiveStudent((prev) => ({
        ...prev,
        ...detail,
      }));
    }
    setCurrentRole(resolvedRole);
    showToast(`Welcome back, ${detail?.name || userName}!`);
  };

  const handleSignOut = () => {
    setUserSignedIn(false);
    setIsDemoMode(false);
    revoke3FAClearance();
    setActive3FASession(null);
    setCurrentRole('hub');
    showToast('Signed out of session');
  };

  const exitPrivateAdminLogsRoute = () => {
    setIsPrivateAdminLogsRoute(false);
    setCurrentRole('hub');
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('portal');
      url.searchParams.delete('hub');
      if (url.pathname.endsWith('/admin-logs')) {
        url.pathname = url.pathname.replace(/\/admin-logs$/, '/') || '/';
      }
      if (url.hash === '#/admin-logs') {
        url.hash = '';
      }
      window.history.pushState({}, '', url.toString());
    } catch {
      // Fallback
    }
  };

  const canAccessPortal = userSignedIn || isDemoMode;

  if (isPrivateAdminLogsRoute) {
    return (
      <div className="min-h-screen bg-[#071120] text-slate-100 font-sans">
        <AdminRestrictionGuard
          targetRole="admin"
          portalTitle="Private Administrative Backend Logs & Registry Monitor"
          onClearanceGranted={(session) => {
            setActive3FASession(session);
            showToast(`Administrative clearance verified for ${session.adminName}`);
          }}
          onReturnToHub={exitPrivateAdminLogsRoute}
        >
          <Suspense fallback={<PortalLoadingFallback />}>
            <AdminBackendLogsPortal
              adminSession={active3FASession}
              onExitToPublic={exitPrivateAdminLogsRoute}
            />
          </Suspense>
        </AdminRestrictionGuard>

        {toastMessage && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#0B1D3A] text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-500/40 text-xs font-semibold flex items-center gap-2.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#071120] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-[#0B1D3A] focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:font-bold focus:text-xs"
      >
        Skip to main content
      </a>

      {/* Offline & 3G Connection Status Banner */}
      <OfflineBanner />

      {/* Global Brand Header */}
      <Header
        currentRole={currentRole}
        onSelectRole={(r) => handleRoleSelection(r)}
        userSignedIn={userSignedIn}
        userName={userName}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onSignOut={handleSignOut}
        unreadAnnouncementsCount={unreadAnnouncementsCount}
        onOpenAnnouncements={() => {
          if (!canAccessPortal) {
            setAuthModalOpen(true);
          } else {
            handleRoleSelection('student');
          }
        }}
      />

      {/* Unified Page-to-Page Navigation Header */}
      <HubNavigationHeader
        currentRole={currentRole}
        onNavigateRole={(r) => handleRoleSelection(r)}
        onOpenSeparatePage={handleOpenSeparatePage}
        onOpenModuleResponses={handleOpenModuleResponses}
        isStandaloneMode={isStandaloneMode}
      />

      {/* Quick Command Palette / Page Navigator Drawer */}
      <SwiftPageNavigator
        currentRole={currentRole}
        onNavigate={(r) => handleRoleSelection(r)}
        userSignedIn={userSignedIn}
      />

      {/* Demo Mode Notice Bar */}
      {isDemoMode && !userSignedIn && currentRole !== 'hub' && (
        <div className="bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-800 px-4 py-2 text-xs text-amber-950 dark:text-amber-100 flex flex-wrap items-center justify-center gap-3">
          <span className="font-semibold">
            Demo Preview Active — Try lessons and tools freely before creating your free PIN.
          </span>
          <button
            type="button"
            onClick={() => handleRoleSelection('register')}
            className="underline font-bold text-[#0B1D3A] dark:text-amber-300 cursor-pointer"
          >
            Create Account
          </button>
        </div>
      )}

      {/* Main App Canvas */}
      <main id="main-content" className="flex-1 relative z-10 pb-12">
        {currentRole === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHub={() => handleRoleSelection('hub')}
            onNavigateToRegister={() => handleRoleSelection('register')}
          />
        )}

        {currentRole === 'register' && (
          <RegistrationPage
            onRegistrationComplete={handleLoginSuccess}
            onNavigateToLogin={() => handleRoleSelection('login')}
            onNavigateToHub={() => handleRoleSelection('hub')}
          />
        )}

        {currentRole === 'hub' && <RoleHub onSelectRole={handleRoleSelection} />}

        <Suspense fallback={<PortalLoadingFallback />}>
          {/* Always-Accessible Open Learning & Trust Hubs (< 60s Try-First) */}
          {currentRole === 'jamb_driller' && (
            <JAMBTestDriller
              studentName={userName}
              initialQuickSample={jambQuickSample}
              onBack={() => handleRoleSelection('hub')}
            />
          )}

          {currentRole === 'privacy_center' && (
            <PrivacyAndTrustCenter onSelectRole={(r) => handleRoleSelection(r)} />
          )}

          {currentRole === 'results' && (
            <ResultsHub
              student={activeStudent}
              onNavigateRole={(r) => handleRoleSelection(r)}
            />
          )}

          {currentRole === 'cgpa' && (
            <CGPACalculatorHub
              onNavigateRole={(r) => handleRoleSelection(r)}
            />
          )}

          {currentRole === 'support' && (
            <SupportHelpDeskHub
              onNavigateRole={(r) => handleRoleSelection(r)}
            />
          )}

          {currentRole === 'study_hub' && (
            <StudentStudyHub
              currentStudent={activeStudent}
              onNavigateRole={(r) => handleRoleSelection(r)}
            />
          )}

          {currentRole === 'module_responses' && (
            <ModuleResponseViewer
              initialModuleId={initialModuleResponseId}
              onNavigateToHub={(r) => handleRoleSelection(r)}
              onClose={() => handleRoleSelection('hub')}
            />
          )}



          {/* Role Portals (Supports Demo Mode or Signed-In Account) */}
          {!canAccessPortal &&
          (currentRole === 'student' ||
            currentRole === 'teacher' ||
            currentRole === 'parent' ||
            currentRole === 'jss_math' ||
            currentRole === 'cyber_security' ||
            currentRole === 'cbt') ? (
            <AuthGuardNotice
              targetRole={currentRole}
              onNavigateToAuth={() => handleRoleSelection('login')}
              onNavigateToRegister={() => handleRoleSelection('register')}
              onTryDemoMode={() => {
                setIsDemoMode(true);
                showToast('Demo Mode enabled — explore freely!');
              }}
            />
          ) : (
            <>
              {currentRole === 'cbt' && (
                <CBTExamInterface
                  currentUser={{
                    name: userName,
                    studentId: activeStudent?.id,
                    classGrade: activeStudent?.gradeLevel,
                    role: currentRole,
                  }}
                  onClose={() => handleRoleSelection('student')}
                />
              )}

              {currentRole === 'cyber_security' && (
                <CyberSecurityExplorer
                  onBack={() => handleRoleSelection('student')}
                  currentUser={{
                    name: userName,
                    role: currentRole,
                    studentId: activeStudent?.id,
                    classGrade: activeStudent?.gradeLevel,
                  }}
                />
              )}

              {currentRole === 'jss_math' && (
                <JSSAllSubjectsExplorer
                  onAssignToClass={(subjectTitle, level) => {
                    showToast(`Assigned "${subjectTitle}" (${level}) to JSS classroom roster!`);
                    handleRoleSelection('teacher');
                  }}
                />
              )}

              {currentRole === 'student' && (
                <StudentPortal
                  student={activeStudent}
                  courses={INITIAL_STUDENT_COURSES}
                  assignments={INITIAL_ASSIGNMENTS}
                  quizQuestions={SAMPLE_QUIZ_QUESTIONS}
                  announcements={announcements}
                  onMarkAnnouncementRead={handleMarkAnnouncementRead}
                  onMarkAllAnnouncementsRead={handleMarkAllAnnouncementsRead}
                  onDeleteAnnouncement={handleDeleteAnnouncement}
                  onAddAnnouncement={handleAddAnnouncement}
                  onNavigateRole={(r) => handleRoleSelection(r)}
                />
              )}

              {currentRole === 'teacher' && (
                <TeacherPortal
                  classes={INITIAL_CLASSES}
                  students={SAMPLE_STUDENTS}
                  announcements={announcements}
                  onAddAnnouncement={handleAddAnnouncement}
                  onMarkAnnouncementRead={handleMarkAnnouncementRead}
                  onMarkAllAnnouncementsRead={handleMarkAllAnnouncementsRead}
                  onDeleteAnnouncement={handleDeleteAnnouncement}
                  onNavigateRole={(r) => handleRoleSelection(r)}
                  initialOpenCreateClass={teacherOpenCreateClass}
                />
              )}

              {currentRole === 'parent' && (
                <ParentPortal
                  child={activeStudent}
                  notes={INITIAL_TEACHER_NOTES}
                />
              )}
            </>
          )}
        </Suspense>
      </main>

      {/* Persistent Bottom Line Newsline Animated Notification Ticker */}
      <AnnouncementNewslineTicker
        announcements={announcements}
        currentUserId={currentUserId}
        onMarkRead={handleMarkAnnouncementRead}
        onNavigateRole={(r) => handleRoleSelection(r)}
      />

      {/* 3FA Administrative Clearance Modal */}
      <Admin3FAClearanceModal
        isOpen={threeFAModalOpen}
        onClose={() => {
          setThreeFAModalOpen(false);
          setPendingBackendRole(null);
        }}
        onClearanceVerified={handle3FASuccess}
        targetRole={pendingBackendRole || 'admin'}
      />

      {/* Authentication Modal */}
      <SignInModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSignInSuccess={handleSignInSuccess}
        onNavigateToRegister={() => {
          setAuthModalOpen(false);
          handleRoleSelection('register');
        }}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-[#0B1D3A] text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-500/40 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <Footer onSelectRole={(r) => handleRoleSelection(r)} />
    </div>
  );
}
