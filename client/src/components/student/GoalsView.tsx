import React, { useState, useEffect } from 'react';
import { Target, Plus, CheckCircle2, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Goal, Student } from '../../types';
import { api } from '../../api/client';

interface GoalsViewProps {
  student: Student;
}

export const GoalsView: React.FC<GoalsViewProps> = ({ student }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'gpa' | 'attendance' | 'certification' | 'course'>('gpa');
  const [newCurrentVal, setNewCurrentVal] = useState(student.gpa.toString());
  const [newTargetVal, setNewTargetVal] = useState('8.85');
  const [newMetricUnit, setNewMetricUnit] = useState('GPA');
  const [newDeadline, setNewDeadline] = useState('2026-12-15');

  useEffect(() => {
    loadGoals();
  }, [student.id]);

  const loadGoals = async () => {
    try {
      const res = await api.getGoals(student.id);
      if (res.goals) setGoals(res.goals);
    } catch (e) {
      console.warn('Using default goals list');
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const created = await api.createGoal({
        studentId: student.id,
        title: newTitle,
        category: newCategory,
        currentVal: Number(newCurrentVal),
        targetVal: Number(newTargetVal),
        metricUnit: newMetricUnit,
        deadline: newDeadline
      });

      setGoals(prev => [created, ...prev]);
      setShowAddModal(false);
      setNewTitle('');
    } catch (err) {
      console.error('Failed to create goal:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card dark:shadow-card-dark flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-600 dark:text-cyan-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded border border-brand-500/20">
              Outcome Targeting & Motivation
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Academic Performance & Career Goals
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track measurable milestones with automated AI action guidance and progress recalibration.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white px-4 py-2.5 text-xs font-bold shadow-glow-cyan transition-all"
        >
          <Plus className="h-4 w-4" />
          Create New Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => (
          <div 
            key={goal.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card dark:shadow-card-dark flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-cyan-400 border border-brand-500/20 font-mono">
                  {goal.category}
                </span>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Target: {goal.deadline}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {goal.title}
              </h3>

              {/* Progress Metric */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-baseline justify-between text-xs mb-2">
                  <span className="text-slate-500">Current: <strong className="text-slate-900 dark:text-white font-mono">{goal.currentVal} {goal.metricUnit}</strong></span>
                  <span className="text-slate-500">Target: <strong className="text-brand-600 dark:text-cyan-400 font-mono">{goal.targetVal} {goal.metricUnit}</strong></span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-600 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, goal.progressPct)}%` }}
                  />
                </div>
                <div className="mt-2 text-right">
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    {goal.progressPct}% Completed
                  </span>
                </div>
              </div>

              {/* AI Recommended Actions */}
              {goal.aiRecommendations && goal.aiRecommendations.length > 0 && (
                <div className="mt-4 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-cyan-500" />
                    AI Action Recommendations
                  </span>
                  {goal.aiRecommendations.map((rec, i) => (
                    <div key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 bg-slate-50/60 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                      <ArrowRight className="h-3.5 w-3.5 text-cyan-500 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Create New Academic Goal
            </h3>

            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Increase GPA from 8.42 to 8.85"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  >
                    <option value="gpa">GPA Target</option>
                    <option value="attendance">Attendance Target</option>
                    <option value="certification">Certification</option>
                    <option value="course">Course Grade</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={e => setNewDeadline(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Val
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCurrentVal}
                    onChange={e => setNewCurrentVal(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Val
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTargetVal}
                    onChange={e => setNewTargetVal(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Metric Unit
                  </label>
                  <input
                    type="text"
                    value={newMetricUnit}
                    onChange={e => setNewMetricUnit(e.target.value)}
                    placeholder="GPA / % / Labs"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-xs"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
