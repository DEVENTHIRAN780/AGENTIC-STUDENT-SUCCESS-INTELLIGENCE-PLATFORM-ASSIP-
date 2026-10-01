import React, { useState, useEffect } from 'react';
import { 
  Sparkles, TrendingUp, AlertTriangle, Lightbulb, 
  CheckCircle, ArrowRight, ShieldAlert, Filter, Calendar 
} from 'lucide-react';
import { AIInsight } from '../../types';
import { api } from '../../api/client';

export const AIInsightsView: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const res = await api.getAIInsights();
      setInsights(res.insights);
    } catch (e) {
      console.warn('Error loading AI insights');
    } finally {
      setLoading(false);
    }
  };

  const filtered = filterType === 'all' 
    ? insights 
    : insights.filter(ins => ins.type === filterType);

  const getCategoryBadge = (type: string) => {
    switch (type) {
      case 'emerging_signal':
        return { label: 'Emerging Signal', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
      case 'performance_pattern':
        return { label: 'Performance Pattern', color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' };
      case 'intervention_opportunity':
        return { label: 'Intervention Opportunity', color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' };
      case 'positive_trend':
        return { label: 'Positive Trend', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
      default:
        return { label: 'Signal', color: 'bg-slate-100 text-slate-700' };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card dark:shadow-card-dark flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 rounded border border-purple-500/20">
              Macro Intelligence Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Institutional AI Insights & Emerging Patterns
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Algorithmic pattern mining detecting subtle cohort trends, syllabus drop-offs, and high-impact intervention windows.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Insights ({insights.length})
          </button>
          <button
            onClick={() => setFilterType('emerging_signal')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              filterType === 'emerging_signal'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Emerging Signals
          </button>
          <button
            onClick={() => setFilterType('performance_pattern')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              filterType === 'performance_pattern'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Performance Patterns
          </button>
          <button
            onClick={() => setFilterType('intervention_opportunity')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              filterType === 'intervention_opportunity'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Opportunities
          </button>
          <button
            onClick={() => setFilterType('positive_trend')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              filterType === 'positive_trend'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Positive Trends
          </button>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="space-y-4">
        {filtered.map(ins => {
          const badge = getCategoryBadge(ins.type);

          return (
            <div
              key={ins.id}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card dark:shadow-card-dark space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border font-mono ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Scope: {ins.department}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-400 font-mono">{ins.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {ins.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 font-mono">
                    {ins.confidence}% Confidence
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                    {ins.affectedCount} Students Affected
                  </span>
                </div>
              </div>

              {/* Evidence */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  Empirical Evidence:
                </span>
                <p className="leading-relaxed">{ins.evidence}</p>
              </div>

              {/* Suggested Action */}
              <div className="p-3.5 rounded-xl bg-brand-50/40 dark:bg-brand-950/20 border border-brand-500/30 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-brand-700 dark:text-cyan-400 uppercase tracking-wider mb-1">
                  <ArrowRight className="h-3.5 w-3.5" />
                  Recommended Institutional Action
                </div>
                <p className="text-slate-700 dark:text-slate-200">
                  {ins.suggestedAction}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
