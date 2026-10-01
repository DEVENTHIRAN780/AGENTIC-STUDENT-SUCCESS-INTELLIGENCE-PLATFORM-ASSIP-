import React, { useState, useEffect } from 'react';
import { 
  Users, AlertTriangle, TrendingDown, TrendingUp, CheckCircle, 
  Clock, ShieldAlert, Sparkles, Filter, ChevronRight, BarChart3 
} from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { EarlyWarningQueue } from './EarlyWarningQueue';
import { api } from '../../api/client';

export const AdvisorDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      const res = await api.getOverviewAnalytics();
      setAnalytics(res);
    } catch (e) {
      console.warn('Using default analytics metrics');
    } finally {
      setLoading(false);
    }
  };

  const metrics = analytics?.metrics || {
    totalStudents: 105,
    criticalRiskCount: 12,
    highRiskCount: 18,
    moderateRiskCount: 25,
    lowRiskCount: 50,
    pendingInterventions: 18,
    improvingCount: 34
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Advisor Welcome Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-900 via-brand-950 to-slate-900 border border-slate-800 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/80">
              Department of Information Technology & Engineering
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Assigned Cohort: 105 Students
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Academic Advisor Intelligence Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Prof. Rajeshwar Kulkarni • Review prioritized early warning dossiers, approve AI-recommended interventions, and monitor cohort recovery trajectories.
          </p>
        </div>

        <div className="rounded-xl p-3 bg-slate-800/60 border border-slate-700 text-xs">
          <span className="text-slate-400 block font-medium">Pending Human Approvals</span>
          <span className="text-xl font-bold font-mono text-amber-400">{metrics.pendingInterventions} Actions Queued</span>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Assigned Students"
          value={metrics.totalStudents}
          subtitle="6 Engineering Depts"
          highlightColor="blue"
          icon={<Users className="h-5 w-5 text-brand-500" />}
        />
        <StatCard
          title="Critical Risk"
          value={metrics.criticalRiskCount}
          subtitle="Immediate Action"
          highlightColor="red"
          icon={<ShieldAlert className="h-5 w-5 text-red-500" />}
          trend={{ value: '4 new', direction: 'up', label: 'this week', isPositiveGood: false }}
        />
        <StatCard
          title="High Risk"
          value={metrics.highRiskCount}
          subtitle="Intervention Reqd."
          highlightColor="amber"
          icon={<AlertTriangle className="h-5 w-5 text-orange-500" />}
        />
        <StatCard
          title="Moderate Risk"
          value={metrics.moderateRiskCount}
          subtitle="Under Observation"
          highlightColor="amber"
          icon={<Clock className="h-5 w-5 text-amber-500" />}
        />
        <StatCard
          title="Students Improving"
          value={metrics.improvingCount}
          subtitle="Risk ↓ Trajectory"
          highlightColor="emerald"
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
          trend={{ value: '+7', direction: 'up', label: 'past 14 days', isPositiveGood: true }}
        />
        <StatCard
          title="Pending Interventions"
          value={metrics.pendingInterventions}
          subtitle="Awaiting Approval"
          highlightColor="blue"
          icon={<Sparkles className="h-5 w-5 text-cyan-500" />}
        />
      </div>

      {/* Embedded Early Warning Action Queue */}
      <EarlyWarningQueue />
    </div>
  );
};
