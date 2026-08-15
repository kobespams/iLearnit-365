import React, { useState, useEffect } from 'react';
import { UserRole, StudentDetail, Announcement } from './types';
import { Header } from './components/Header';
import { RoleHub } from './components/RoleHub';
import { StudentPortal } from './components/StudentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { ParentPortal } from './components/ParentPortal';
import { JSSMathExplorer } from './components/JSSMathExplorer';
import { CyberSecurityExplorer } from './components/CyberSecurityExplorer';
import { CBTExamInterface } from './components/CBTExamInterface';
import { LoginPage } from './components/LoginPage';
import { RegistrationPage } from './components/RegistrationPage';
import { SignInModal } from './components/SignInModal';
import { AuthGuardNotice } from './components/AuthGuardNotice';
import { AnnouncementNewslineTicker } from './components/AnnouncementNewslineTicker';
import { Footer } from './components/Footer';
import { applyTheme, getInitialTheme } from './utils/theme';
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

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('hub');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userSignedIn, setUserSignedIn] = useState(false);
  const [userName, setUserName] = useState('Alex Chen');
  const [activeStudent, setActiveStudent] = useState<StudentDetail>(CURRENT_STUDENT_PROFILE);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);

  // Initialize theme and CSS variables on app mount
  useEffect(() => {
    const initialTheme = getInitialTheme();
    applyTheme(initialTheme);
  }, []);

  const currentUserId = activeStudent?.id || activeStudent?.studentId || 'st-101';
  const unreadAnnouncementsCount = announcements.filter(
    (a) => !a.readBy.includes(currentUserId)
  ).length;

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
  };

  const handleAddAnnouncement = (
    newAnnData: Omit<Announcement, 'id' | 'createdAt' | 'readBy'>
  ) => {
    const newAnn: Announcement = {
      ...newAnnData,
      id: `ann-${Date.now()}`,
      createdAt: Date.now(),
      readBy: [currentUserId], // Author marks as read for themselves
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const handleSignInSuccess = (role: UserRole, name: string, student?: StudentDetail) => {
    setCurrentRole(role);
    setUserName(name);
    if (student) {
      setActiveStudent(student);
    }
    setUserSignedIn(true);
  };

  const handleLoginSuccess = (role: UserRole, student: StudentDetail) => {
    setActiveStudent(student);
    const displayName = role === 'parent' ? student.parentName || `${student.name}'s Parent` : role === 'teacher' ? 'Dr. Sarah Jenkins' : student.name;
    setUserName(displayName);
    setUserSignedIn(true);
    setCurrentRole(role);
  };

  const handleSignOut = () => {
    setUserSignedIn(false);
    setCurrentRole('hub');
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col font-sans antialiased selection:bg-[#132C54] selection:text-white relative overflow-x-hidden transition-colors duration-300">
      {/* Background Circuit Field */}
      <div className="bg-field" />

      {/* Persistent Navigation Header */}
      <Header
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        userSignedIn={userSignedIn}
        userName={userName}
        onSignOut={handleSignOut}
        unreadAnnouncementsCount={unreadAnnouncementsCount}
        onOpenAnnouncements={() => {
          if (!userSignedIn) {
            setAuthModalOpen(true);
          } else {
            setCurrentRole('student');
          }
        }}
      />

      {/* Main App Canvas */}
      <main className="flex-1 relative z-10 pb-12">
        {currentRole === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHub={() => setCurrentRole('hub')}
            onNavigateToRegister={() => setCurrentRole('register')}
          />
        )}

        {currentRole === 'register' && (
          <RegistrationPage
            onRegistrationComplete={handleLoginSuccess}
            onNavigateToLogin={() => setCurrentRole('login')}
            onNavigateToHub={() => setCurrentRole('hub')}
          />
        )}

        {currentRole === 'hub' && <RoleHub onSelectRole={setCurrentRole} />}

        {/* Protected Views (Requires Registration / Login) */}
        {!userSignedIn && (currentRole === 'student' || currentRole === 'teacher' || currentRole === 'parent' || currentRole === 'jss_math' || currentRole === 'cyber_security' || currentRole === 'cbt') ? (
          <AuthGuardNotice
            targetRole={currentRole}
            onNavigateToAuth={() => setCurrentRole('login')}
            onNavigateToRegister={() => setCurrentRole('register')}
          />
        ) : (
          <>
            {currentRole === 'cbt' && (
              <CBTExamInterface
                currentUser={{
                  name: userName,
                  studentId: activeStudent?.id,
                  classGrade: activeStudent?.classGrade,
                  role: currentRole,
                }}
                onClose={() => setCurrentRole('student')}
              />
            )}

            {currentRole === 'cyber_security' && (
              <CyberSecurityExplorer
                onBack={() => setCurrentRole('student')}
                currentUser={{
                  name: userName,
                  role: currentRole,
                  studentId: activeStudent?.id,
                  classGrade: activeStudent?.classGrade,
                }}
              />
            )}

            {currentRole === 'jss_math' && (
              <JSSMathExplorer
                onAssignToClass={(lesson) => {
                  alert(`Assigned "${lesson.title}" (${lesson.level}) to JSS Class groups!`);
                  setCurrentRole('teacher');
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
                onAddAnnouncement={handleAddAnnouncement}
                onNavigateRole={setCurrentRole}
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
                onNavigateRole={setCurrentRole}
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
      </main>

      {/* Persistent Bottom Line Newsline Animated Notification Ticker */}
      <AnnouncementNewslineTicker
        announcements={announcements}
        currentUserId={currentUserId}
        onMarkRead={handleMarkAnnouncementRead}
        onNavigateRole={setCurrentRole}
      />

      {/* Authentication Modal */}
      <SignInModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSignInSuccess={handleSignInSuccess}
        onNavigateToRegister={() => {
          setAuthModalOpen(false);
          setCurrentRole('register');
        }}
      />

      {/* Footer */}
      <Footer onSelectRole={setCurrentRole} />
    </div>
  );
}

