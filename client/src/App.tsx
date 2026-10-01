import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar, ActiveTab } from './components/common/Sidebar';
import { CommandPalette } from './components/common/CommandPalette';
import { CopilotDrawer } from './components/common/CopilotDrawer';
import { Student360Modal } from './components/advisor/Student360Modal';
import { AuthModal } from './components/auth/AuthModal';

// Views
import { LandingPage } from './components/landing/LandingPage';
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudyPlannerView } from './components/student/StudyPlannerView';
import { AcademicRoadmapView } from './components/student/AcademicRoadmapView';
import { GoalsView } from './components/student/GoalsView';

import { AdvisorDashboard } from './components/advisor/AdvisorDashboard';
import { EarlyWarningQueue } from './components/advisor/EarlyWarningQueue';

import { FacultyDashboard } from './components/faculty/FacultyDashboard';

import { AdminDashboard } from './components/admin/AdminDashboard';
import { DepartmentAnalyticsView } from './components/admin/DepartmentAnalyticsView';
import { CourseIntelligenceView } from './components/admin/CourseIntelligenceView';
import { AIInsightsView } from './components/admin/AIInsightsView';
import { DataImportView } from './components/admin/DataImportView';
import { AuditLogView } from './components/admin/AuditLogView';
import { SettingsView } from './components/admin/SettingsView';

import { NotificationCenterView } from './components/notifications/NotificationCenterView';

import { Student, Course, Intervention, AIInsight, NotificationItem } from './types';
import { api } from './api/client';

export function App() {
  const { user, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('advisor-dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Global modals
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedStudentFor360, setSelectedStudentFor360] = useState<Student | null>(null);

  // Global cached collections for command palette & notifications
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Default student persona for Copilot
  const currentStudent: Student = students.find(s => s.id === 'std-1001') || {
    id: 'std-1001',
    studentId: 'ST2024-1001',
    userId: 'usr-student-1',
    name: 'Alex Kumar',
    email: 'student@demo.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    department: 'IT',
    program: 'B.Tech Information Technology',
    semester: 5,
    enrollmentYear: 2022,
    gpa: 8.42,
    cgpa: 8.28,
    attendancePct: 91,
    creditsCompleted: 86,
    creditsTotal: 160,
    academicHealth: 82,
    riskLevel: 'low',
    riskScore: 22,
    riskTrend: 'down',
    riskChange: -4,
    primarySignal: 'Attendance in Operating Systems dropped to 78%',
    advisorId: 'adv-1',
    advisorName: 'Prof. Rajeshwar Kulkarni',
    mentorName: 'Dr. Ritu Bhatnagar',
    tags: ['Good Standing', 'AI Track']
  };

  useEffect(() => {
    loadGlobalRegistry();
  }, []);

  // Sync default tab when user switches role
  useEffect(() => {
    if (activeTab === 'landing') return;
    if (user?.role === 'student') {
      setActiveTab('student-dashboard');
    } else if (user?.role === 'faculty') {
      setActiveTab('faculty-dashboard');
    } else if (user?.role === 'advisor') {
      setActiveTab('advisor-dashboard');
    } else if (user?.role === 'admin') {
      setActiveTab('admin-dashboard');
    }
  }, [user?.role]);

  const loadGlobalRegistry = async () => {
    try {
      const [stdRes, crsRes, intvRes, insRes, notifRes] = await Promise.all([
        api.getStudents().catch(() => ({ students: [] })),
        api.getCourses().catch(() => ({ courses: [] })),
        api.getInterventions().catch(() => ({ interventions: [] })),
        api.getAIInsights().catch(() => ({ insights: [] })),
        api.getNotifications().catch(() => ({ notifications: [] }))
      ]);

      if (stdRes.students) setStudents(stdRes.students);
      if (crsRes.courses) setCourses(crsRes.courses);
      if (intvRes.interventions) setInterventions(intvRes.interventions);
      if (insRes.insights) setInsights(insRes.insights);
      if (notifRes.notifications) setNotifications(notifRes.notifications);
    } catch (err) {
      console.warn('Global registry populated with defaults');
    }
  };

  // If viewing the public landing page
  if (activeTab === 'landing') {
    return (
      <>
        <LandingPage
          onEnterApp={role => {
            if (role === 'student') setActiveTab('student-dashboard');
            else if (role === 'faculty') setActiveTab('faculty-dashboard');
            else if (role === 'admin') setActiveTab('admin-dashboard');
            else setActiveTab('advisor-dashboard');
          }}
          onOpenCopilot={() => setCopilotOpen(true)}
        />
        <CopilotDrawer
          isOpen={copilotOpen}
          onClose={() => setCopilotOpen(false)}
          student={currentStudent}
        />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      <div className="flex flex-1">
        {/* Responsive Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        {/* Main Content Workspace */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onOpenCopilot={() => setCopilotOpen(true)}
            notifications={notifications}
            onNotificationClick={n => setActiveTab('notifications')}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {/* Student Experience */}
            {activeTab === 'student-dashboard' && (
              <StudentDashboard
                student={currentStudent}
                onOpenCopilot={() => setCopilotOpen(true)}
                onNavigateTab={setActiveTab}
              />
            )}
            {activeTab === 'study-planner' && (
              <StudyPlannerView student={currentStudent} />
            )}
            {activeTab === 'academic-roadmap' && (
              <AcademicRoadmapView student={currentStudent} />
            )}
            {activeTab === 'goals' && (
              <GoalsView student={currentStudent} />
            )}

            {/* Advisor Experience */}
            {activeTab === 'advisor-dashboard' && (
              <AdvisorDashboard />
            )}
            {activeTab === 'early-warning-queue' && (
              <EarlyWarningQueue />
            )}

            {/* Faculty Experience */}
            {activeTab === 'faculty-dashboard' && (
              <FacultyDashboard />
            )}

            {/* Admin Experience */}
            {activeTab === 'admin-dashboard' && (
              <AdminDashboard onNavigateTab={setActiveTab} />
            )}
            {activeTab === 'department-analytics' && (
              <DepartmentAnalyticsView />
            )}
            {activeTab === 'course-intelligence' && (
              <CourseIntelligenceView />
            )}
            {activeTab === 'ai-insights' && (
              <AIInsightsView />
            )}
            {activeTab === 'data-import' && (
              <DataImportView />
            )}
            {activeTab === 'audit-logs' && (
              <AuditLogView />
            )}
            {activeTab === 'settings' && (
              <SettingsView />
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <NotificationCenterView
                notifications={notifications}
                onRefresh={loadGlobalRegistry}
              />
            )}
          </main>
        </div>
      </div>

      {/* Global Modals & Drawers */}
      <CopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        student={currentStudent}
        onOpenStudyPlanner={() => {
          setActiveTab('study-planner');
          setCopilotOpen(false);
        }}
        onOpenRoadmap={() => {
          setActiveTab('academic-roadmap');
          setCopilotOpen(false);
        }}
      />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        students={students}
        courses={courses}
        interventions={interventions}
        insights={insights}
        onSelectStudent={std => setSelectedStudentFor360(std)}
        onSelectCourse={crs => setActiveTab('course-intelligence')}
        onSelectIntervention={intv => setActiveTab('early-warning-queue')}
      />

      {selectedStudentFor360 && (
        <Student360Modal
          isOpen={!!selectedStudentFor360}
          onClose={() => setSelectedStudentFor360(null)}
          student={selectedStudentFor360}
          interventions={interventions}
          onInterventionUpdated={loadGlobalRegistry}
        />
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
