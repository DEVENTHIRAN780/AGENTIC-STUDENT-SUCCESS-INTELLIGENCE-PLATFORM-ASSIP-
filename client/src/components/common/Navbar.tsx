import React, { useState } from 'react';
import { 
  Search, Bell, Moon, Sun, Bot, Sparkles, Shield, 
  User as UserIcon, LogOut, Check, ChevronDown, Layers 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole, NotificationItem } from '../../types';

interface NavbarProps {
  onOpenCommandPalette: () => void;
  onOpenCopilot: () => void;
  notifications: NotificationItem[];
  onNotificationClick?: (n: NotificationItem) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommandPalette,
  onOpenCopilot,
  notifications,
  onNotificationClick
}) => {
  const { user, logout, quickSwitchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.isRead);

  const roles: Array<{ role: UserRole; label: string; desc: string; icon: string }> = [
    { role: 'student', label: 'Student', desc: 'Alex Kumar • B.Tech IT', icon: '🎓' },
    { role: 'faculty', label: 'Faculty', desc: 'Dr. Sunita • Professor CSE', icon: '👩‍🏫' },
    { role: 'advisor', label: 'Academic Advisor', desc: 'Prof. Rajeshwar • IT Dept', icon: '📋' },
    { role: 'admin', label: 'Administrator', desc: 'Dr. Meenakshi • Academic Dean', icon: '🛡️' }
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6">
      {/* Left: Quick Search Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition-colors w-44 sm:w-64"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="truncate">Search students, courses...</span>
          <kbd className="hidden sm:inline-block ml-auto rounded bg-slate-200/80 dark:bg-slate-700/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-300">
            Ctrl K
          </kbd>
        </button>

        {/* Live Agent Status Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>7 AI Agents Active</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Success Copilot Launch Button */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white px-3 py-1.5 text-xs font-semibold shadow-glow-cyan transition-all duration-200 active:scale-95"
        >
          <Bot className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Success Copilot</span>
        </button>

        {/* Role Quick-Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setRoleDropdownOpen(!roleDropdownOpen);
              setNotifDropdownOpen(false);
              setProfileDropdownOpen(false);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-sm">
              {roles.find(r => r.role === user?.role)?.icon || '👤'}
            </span>
            <span className="capitalize hidden md:inline">
              {user?.role || 'Switch Role'}
            </span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>

          {roleDropdownOpen && (
            <div className="glass-dropdown absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-50">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Switch Role Demo Persona
              </div>
              <div className="mt-1 space-y-1">
                {roles.map(r => (
                  <button
                    key={r.role}
                    onClick={() => {
                      quickSwitchRole(r.role);
                      setRoleDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-left transition-colors ${
                      user?.role === r.role 
                        ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-cyan-400 font-semibold' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{r.icon}</span>
                      <div>
                        <p className="text-xs">{r.label}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{r.desc}</p>
                      </div>
                    </div>
                    {user?.role === r.role && <Check className="h-4 w-4 text-brand-600 dark:text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
              setRoleDropdownOpen(false);
              setProfileDropdownOpen(false);
            }}
            className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/60 p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-xs">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="glass-dropdown absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Notifications & Alerts
                  </h4>
                  {unreadNotifs.length > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 font-semibold">
                      {unreadNotifs.length} New
                    </span>
                  )}
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-400">No notifications at this time.</p>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onNotificationClick?.(n);
                        setNotifDropdownOpen(false);
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                        !n.isRead 
                          ? 'bg-brand-50/50 dark:bg-brand-950/30 border border-brand-500/20' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
                        <span className="truncate">{n.title}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-mono ${
                          n.priority === 'urgent' ? 'bg-red-500/10 text-red-500' :
                          n.priority === 'high' ? 'bg-orange-500/10 text-orange-500' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {n.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/60 p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
        </button>

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setRoleDropdownOpen(false);
              setNotifDropdownOpen(false);
            }}
            className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={user?.name || 'User'}
              className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
            />
          </button>

          {profileDropdownOpen && (
            <div className="glass-dropdown absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-50">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-cyan-400 font-bold">
                  {user?.role}
                </span>
              </div>
              <div className="mt-1 space-y-0.5">
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
