import React from 'react';
import { 
  LayoutDashboard, Users, AlertTriangle, ShieldAlert, 
  BookOpen, BrainCircuit, Calendar, Map, Target, 
  Bell, Settings, Database, FileText, BarChart3, 
  Sparkles, LogOut, ChevronLeft, ChevronRight, GraduationCap, 
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export type ActiveTab = 
  | 'landing'
  | 'student-dashboard'
  | 'advisor-dashboard'
  | 'early-warning-queue'
  | 'faculty-dashboard'
  | 'admin-dashboard'
  | 'department-analytics'
  | 'course-intelligence'
  | 'ai-insights'
  | 'study-planner'
  | 'academic-roadmap'
  | 'goals'
  | 'data-import'
  | 'audit-logs'
  | 'settings'
  | 'notifications';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (m: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) => {
  const { user, logout } = useAuth();
  const role: UserRole = user?.role || 'student';

  // Navigation Items per role
  const getNavItems = () => {
    switch (role) {
      case 'student':
        return [
          { id: 'student-dashboard' as ActiveTab, label: 'My Dashboard', icon: LayoutDashboard },
          { id: 'study-planner' as ActiveTab, label: 'AI Study Planner', icon: Calendar, badge: 'Smart' },
          { id: 'academic-roadmap' as ActiveTab, label: 'Degree Roadmap', icon: Map },
          { id: 'goals' as ActiveTab, label: 'Academic Goals', icon: Target },
          { id: 'course-intelligence' as ActiveTab, label: 'Enrolled Courses', icon: BookOpen },
          { id: 'notifications' as ActiveTab, label: 'Alerts & Messages', icon: Bell }
        ];
      case 'faculty':
        return [
          { id: 'faculty-dashboard' as ActiveTab, label: 'Faculty Workspace', icon: LayoutDashboard },
          { id: 'early-warning-queue' as ActiveTab, label: 'At-Risk Students', icon: AlertTriangle, badge: 'Alerts' },
          { id: 'course-intelligence' as ActiveTab, label: 'Course Analytics', icon: BookOpen },
          { id: 'ai-insights' as ActiveTab, label: 'AI Cohort Insights', icon: Sparkles },
          { id: 'notifications' as ActiveTab, label: 'Notifications', icon: Bell }
        ];
      case 'advisor':
        return [
          { id: 'advisor-dashboard' as ActiveTab, label: 'Advisor Workspace', icon: LayoutDashboard },
          { id: 'early-warning-queue' as ActiveTab, label: 'Early Warning Queue', icon: AlertTriangle, badge: 'Live' },
          { id: 'course-intelligence' as ActiveTab, label: 'Course Analytics', icon: BookOpen },
          { id: 'ai-insights' as ActiveTab, label: 'AI Insights Center', icon: Sparkles },
          { id: 'notifications' as ActiveTab, label: 'Notifications', icon: Bell },
          { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings }
        ];
      case 'admin':
        return [
          { id: 'admin-dashboard' as ActiveTab, label: 'Executive Dashboard', icon: LayoutDashboard },
          { id: 'early-warning-queue' as ActiveTab, label: 'Early Warning Queue', icon: AlertTriangle },
          { id: 'department-analytics' as ActiveTab, label: 'Department Analytics', icon: BarChart3 },
          { id: 'course-intelligence' as ActiveTab, label: 'Course Intelligence', icon: BookOpen },
          { id: 'ai-insights' as ActiveTab, label: 'AI Insights Center', icon: Sparkles, badge: 'AI' },
          { id: 'data-import' as ActiveTab, label: 'Data Import (CSV)', icon: Database },
          { id: 'audit-logs' as ActiveTab, label: 'Audit Logs', icon: FileText },
          { id: 'settings' as ActiveTab, label: 'System Settings', icon: Settings }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-40 h-screen transition-all duration-300 flex flex-col justify-between border-r border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Top: Logo & Brand */}
        <div>
          <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80">
            <div 
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-500 text-white shadow-glow-blue transition-transform group-hover:scale-105">
                <BrainCircuit className="h-5 w-5" />
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                    ASSIP
                  </span>
                  <span className="text-[10px] font-semibold text-brand-600 dark:text-cyan-400 tracking-wider uppercase">
                    Student Intelligence
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 overflow-y-auto">
            {/* Public Landing Page link */}
            <button
              onClick={() => {
                setActiveTab('landing');
                setMobileOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'landing'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Home className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Public Landing Page</span>}
            </button>

            <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

            {!collapsed && (
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {role} Workspace
              </div>
            )}

            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-glow-blue'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-brand-500/10 text-brand-600 dark:text-cyan-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Sign Out */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={user?.name || 'User'}
                className="h-8 w-8 rounded-full object-cover border border-slate-300 dark:border-slate-600 shrink-0"
              />
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user?.name || 'Alex Kumar'}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize truncate">
                    {user?.role || 'student'}
                  </p>
                </div>
              )}
            </div>
            {!collapsed && (
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
