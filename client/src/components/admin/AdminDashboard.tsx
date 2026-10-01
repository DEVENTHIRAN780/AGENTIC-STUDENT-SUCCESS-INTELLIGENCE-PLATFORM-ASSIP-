import React, { useState, useEffect } from 'react';
import { 
  Users, BarChart3, TrendingUp, AlertTriangle, ShieldCheck, 
  Award, Clock, Sparkles, Activity, FileText, ChevronRight, 
  Layers, Database, ArrowRight 
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { StatCard } from '../common/StatCard';
import { api } from '../../api/client';
import { AgentActivityItem } from '../../types';

interface AdminDashboardProps {
  onNavigateTab: (tab: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const [overview, setOverview] = useState<any>(null);
  const [agentActivities, setAgentActivities] = useState<AgentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const res = await api.getOverviewAnalytics();
      setOverview(res);

      const actRes = await api.getAgentActivity();
      if (actRes.activities) setAgentActivities(actRes.activities);
    } catch (e) {
      console.warn('Error loading admin analytics');
    } finally {
      setLoading(false);
    }
  };

  const metrics = overview?.metrics || {
    totalStudents: 105,
    avgGpa: 7.98,
    avgAttendance: 85.4,
    atRiskCount: 30,
    criticalRiskCount: 12,
    highRiskCount: 18,
    retentionRate: 94.2,
    interventionSuccessRate: 84,
    courseFailureRate: 7.8,
    graduationProgressAvg: 68.5,
    pendingInterventions: 18
  };

  const riskDistribution = overview?.riskDistribution || [
    { name: 'Low Risk (0-30)', count: 50, percentage: 48, color: '#10b981' },
    { name: 'Moderate (31-60)', count: 25, percentage: 24, color: '#f59e0b' },
    { name: 'High Risk (61-80)', count: 18, percentage: 17, color: '#f97316' },
    { name: 'Critical Risk (81-100)', count: 12, percentage: 11, color: '#ef4444' }
  ];

  const gpaTrends = overview?.gpaTrends || [
    { semester: 'Fall 24', gpa: 7.82, benchmark: 7.5 },
    { semester: 'Spring 25', gpa: 7.91, benchmark: 7.5 },
    { semester: 'Fall 25', gpa: 7.98, benchmark: 7.5 },
    { semester: 'Spring 26', gpa: 8.04, benchmark: 7.5 },
    { semester: 'Fall 26 (Now)', gpa: 7.98, benchmark: 7.5 }
  ];

  const interventionOutcomes = overview?.interventionOutcomes || [
    { status: 'Resolved / Improved', count: 34, color: '#10b981' },
    { status: 'In Progress', count: 18, color: '#0284c7' },
    { status: 'Pending Review', count: 12, color: '#f59e0b' },
    { status: 'Escalated to HoD', count: 4, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-900 via-indigo-950 to-slate-900 border border-slate-800 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/80">
              Institutional Governance Console
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Retention: 94.2% (Benchmark Surpassed)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Executive Academic Success & Retention Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Dr. Meenakshi Sundaram • Dean of Academic Affairs. Continuous multi-departmental intelligence, early warning distribution, and intervention outcome analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('data-import')}
            className="flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 text-xs font-bold shadow-xs transition-colors"
          >
            <Database className="h-4 w-4" />
            Batch CSV Ingestion
          </button>
        </div>
      </div>

      {/* High-Level Executive Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Active Students"
          value={metrics.totalStudents}
          subtitle="Across 6 Engineering Depts"
          highlightColor="blue"
          icon={<Users className="h-5 w-5 text-brand-500" />}
          trend={{ value: '+4.2%', direction: 'up', label: 'vs last academic year', isPositiveGood: true }}
        />
        <StatCard
          title="Overall Institutional GPA"
          value={metrics.avgGpa}
          subtitle="Target: 7.50"
          highlightColor="cyan"
          icon={<Award className="h-5 w-5 text-cyan-500" />}
          trend={{ value: '+0.13', direction: 'up', label: 'from 7.85 historical', isPositiveGood: true }}
        />
        <StatCard
          title="Average Attendance"
          value={`${metrics.avgAttendance}%`}
          subtitle="Regulatory Trigger: 75%"
          highlightColor="emerald"
          icon={<Clock className="h-5 w-5 text-emerald-500" />}
          trend={{ value: '1.2%', direction: 'down', label: 'month-over-month', isPositiveGood: false }}
        />
        <StatCard
          title="Institutional Retention"
          value={`${metrics.retentionRate}%`}
          subtitle="Top Decile Benchmark"
          highlightColor="emerald"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />}
          trend={{ value: '+1.8%', direction: 'up', label: 'vs state average', isPositiveGood: true }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="At-Risk Population"
          value={metrics.atRiskCount}
          subtitle={`${metrics.criticalRiskCount} Critical • ${metrics.highRiskCount} High`}
          highlightColor="red"
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
          trend={{ value: '-6 students', direction: 'down', label: 'remediated', isPositiveGood: true }}
          onClick={() => onNavigateTab('early-warning-queue')}
        />
        <StatCard
          title="Intervention Success Rate"
          value={`${metrics.interventionSuccessRate}%`}
          subtitle="Remediated within 30 days"
          highlightColor="blue"
          icon={<Sparkles className="h-5 w-5 text-brand-500" />}
        />
        <StatCard
          title="Course Failure Rate"
          value={`${metrics.courseFailureRate}%`}
          subtitle="Across 30 core modules"
          highlightColor="amber"
          icon={<Activity className="h-5 w-5 text-amber-500" />}
          trend={{ value: '-2.4%', direction: 'down', label: 'drop vs prior semester', isPositiveGood: true }}
        />
        <StatCard
          title="Graduation Progression"
          value={`${metrics.graduationProgressAvg}%`}
          subtitle="On-time track"
          highlightColor="cyan"
          icon={<TrendingUp className="h-5 w-5 text-cyan-500" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Donut Chart */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card dark:shadow-card-dark">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Risk Stratification Distribution
            </h3>
            <p className="text-xs text-slate-500">Student cohort categorization</p>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {riskDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
            {riskDistribution.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}: <strong className="text-slate-900 dark:text-white font-mono">{item.count}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* GPA Trends Over Semesters */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card dark:shadow-card-dark">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Multi-Semester GPA Progression
              </h3>
              <p className="text-xs text-slate-500">Institutional average vs regulatory benchmark (7.50)</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gpaTrends}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
                <YAxis domain={[7.0, 8.5]} tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="gpa" name="Average GPA" stroke="#0c8ee9" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="benchmark" name="Benchmark" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Agent Activity Stream & Live Interventions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Agent Activity */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card dark:shadow-card-dark">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Autonomous Agent Execution Activity
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Live Stream</span>
          </div>

          <div className="space-y-3">
            {agentActivities.slice(0, 5).map((act, i) => (
              <div 
                key={act.id || i}
                className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/60 text-xs flex items-start justify-between gap-3"
              >
                <div>
                  <span className="font-bold text-brand-600 dark:text-cyan-400 block mb-0.5">
                    ● {act.agentName}
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">{act.action}</p>
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">{act.timestamp}</span>
                </div>
                {act.metricHighlight && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-cyan-400 font-semibold shrink-0">
                    {act.metricHighlight}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Nav to Department Analytics & Audit Logs */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card dark:shadow-card-dark flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Institutional Intelligence Modules
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Explore granular departmental comparisons, course syllabus failure rates, and governance logs.
            </p>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => onNavigateTab('department-analytics')}
                className="flex items-center justify-between w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold text-slate-800 dark:text-slate-200"
              >
                <span>Department Analytics (CSE, IT, ECE, EEE, Mech, Civil)</span>
                <ChevronRight className="h-4 w-4 text-brand-500" />
              </button>
              <button
                onClick={() => onNavigateTab('course-intelligence')}
                className="flex items-center justify-between w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold text-slate-800 dark:text-slate-200"
              >
                <span>Course Intelligence & Syllabus Analytics (30 Courses)</span>
                <ChevronRight className="h-4 w-4 text-cyan-500" />
              </button>
              <button
                onClick={() => onNavigateTab('ai-insights')}
                className="flex items-center justify-between w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold text-slate-800 dark:text-slate-200"
              >
                <span>AI Insights Center (Emerging Cohort Patterns)</span>
                <ChevronRight className="h-4 w-4 text-purple-500" />
              </button>
              <button
                onClick={() => onNavigateTab('audit-logs')}
                className="flex items-center justify-between w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold text-slate-800 dark:text-slate-200"
              >
                <span>Administrative Audit Logs & Governance Traceability</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
