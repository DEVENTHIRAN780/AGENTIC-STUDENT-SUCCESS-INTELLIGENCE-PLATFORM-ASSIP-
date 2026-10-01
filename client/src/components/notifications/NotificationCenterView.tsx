import React, { useState } from 'react';
import { 
  Bell, CheckCircle2, AlertTriangle, BookOpen, Clock, 
  Sparkles, Filter, Check, ShieldAlert, MessageSquare 
} from 'lucide-react';
import { NotificationItem } from '../../types';
import { api } from '../../api/client';

interface NotificationCenterViewProps {
  notifications: NotificationItem[];
  onRefresh: () => void;
}

export const NotificationCenterView: React.FC<NotificationCenterViewProps> = ({
  notifications,
  onRefresh
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = filterType === 'all'
    ? notifications
    : filterType === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications.filter(n => n.type === filterType);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'risk_alert':
        return <ShieldAlert className="h-4 w-4 text-red-500" />;
      case 'attendance':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'exam':
        return <BookOpen className="h-4 w-4 text-cyan-500" />;
      case 'ai_recommendation':
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-brand-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card dark:shadow-card-dark flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-600 dark:text-cyan-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-0.5 rounded border border-brand-500/20">
              Alerts & Communications
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-500/10 text-red-500 font-mono">
              {notifications.filter(n => !n.isRead).length} Unread
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Notification & Action Alert Center
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Risk signals, advisor correspondence, exam schedules, and adaptive study updates.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Check className="h-4 w-4 text-emerald-500" />
          Mark All As Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
            filterType === 'all'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
            filterType === 'unread'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setFilterType('attendance')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
            filterType === 'attendance'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          Attendance
        </button>
        <button
          onClick={() => setFilterType('exam')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
            filterType === 'exam'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          Exams
        </button>
        <button
          onClick={() => setFilterType('ai_recommendation')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
            filterType === 'ai_recommendation'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          AI Recommendations
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map(notif => (
          <div
            key={notif.id}
            onClick={() => handleMarkAsRead(notif.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
              !notif.isRead
                ? 'bg-brand-50/40 dark:bg-brand-950/20 border-brand-500/30 ring-1 ring-brand-500/10'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 mt-0.5">
                {getTypeIcon(notif.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {notif.title}
                  </h4>
                  {!notif.isRead && (
                    <span className="h-2 w-2 rounded-full bg-brand-500" />
                  )}
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded font-mono ${
                    notif.priority === 'urgent' ? 'bg-red-500/10 text-red-500' :
                    notif.priority === 'high' ? 'bg-orange-500/10 text-orange-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {notif.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {notif.message}
                </p>
                <span className="text-[10px] text-slate-400 font-mono mt-2 inline-block">
                  {new Date(notif.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
            </div>

            <div className="shrink-0">
              {!notif.isRead ? (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleMarkAsRead(notif.id);
                  }}
                  className="text-xs text-brand-600 dark:text-cyan-400 font-semibold hover:underline"
                >
                  Mark Read
                </button>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">Read</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
