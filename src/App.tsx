import React, { useState } from 'react';
import { UserRole, StudentDetail } from './types';
import { Header } from './components/Header';
import { RoleHub } from './components/RoleHub';
import { StudentPortal } from './components/StudentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { ParentPortal } from './components/ParentPortal';
import { JSSMathExplorer } from './components/JSSMathExplorer';
import { LoginPage } from './components/LoginPage';
import { SignInModal } from './components/SignInModal';
import { Footer } from './components/Footer';
import {
  INITIAL_STUDENT_COURSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_CLASSES,
  CURRENT_STUDENT_PROFILE,
  SAMPLE_STUDENTS,
  INITIAL_TEACHER_NOTES,
  SAMPLE_QUIZ_QUESTIONS,
} from './data/mockData';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('hub');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userSignedIn, setUserSignedIn] = useState(true);
  const [userName, setUserName] = useState('Alex Chen');
  const [activeStudent, setActiveStudent] = useState<StudentDetail>(CURRENT_STUDENT_PROFILE);

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

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#0E1930] flex flex-col font-sans antialiased selection:bg-[#132C54] selection:text-white relative overflow-x-hidden">
      {/* Background Circuit Field */}
      <div className="bg-field" />

      {/* Persistent Navigation Header */}
      <Header
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        userSignedIn={userSignedIn}
        userName={userName}
      />

      {/* Main App Canvas */}
      <main className="flex-1 relative z-10">
        {currentRole === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateToHub={() => setCurrentRole('hub')}
          />
        )}

        {currentRole === 'hub' && <RoleHub onSelectRole={setCurrentRole} />}

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
          />
        )}

        {currentRole === 'teacher' && (
          <TeacherPortal
            classes={INITIAL_CLASSES}
            students={SAMPLE_STUDENTS}
          />
        )}

        {currentRole === 'parent' && (
          <ParentPortal
            child={activeStudent}
            notes={INITIAL_TEACHER_NOTES}
          />
        )}
      </main>

      {/* Authentication Modal */}
      <SignInModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSignInSuccess={handleSignInSuccess}
      />

      {/* Footer */}
      <Footer onSelectRole={setCurrentRole} />
    </div>
  );
}
