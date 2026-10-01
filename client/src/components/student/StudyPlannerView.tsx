import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, CheckCircle2, Circle, 
  Sparkles, Plus, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, Check
} from 'lucide-react';
import { StudyPlan, Student } from '../../types';
import { api } from '../../api/client';

interface StudyPlannerViewProps {
  student: Student;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({ student }) => {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [activePlan, setActivePlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  useEffect(() => {
    loadStudyPlans();
  }, [student.id]);

  const loadStudyPlans = async () => {
    try {
      const res = await api.getStudyPlans(student.id);
      if (res.plans && res.plans.length > 0) {
        setPlans(res.plans);
        setActivePlan(res.plans[0]);
      }
    } catch (e) {
      console.warn('Loading fallback study plans');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAIPlan = async () => {
    setGenerating(true);
    try {
      const newPlan = await api.generateStudyPlan(student.id);
      setPlans(prev => [newPlan, ...prev]);
      setActivePlan(newPlan);
      setSelectedDayIndex(0);
    } catch (err) {
      console.error('Failed to generate study plan:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleTask = async (taskId: string, currentCompleted: boolean) => {
    if (!activePlan) return;
    try {
      await api.toggleStudyTask(activePlan.id, taskId, !currentCompleted);
      
      // Update locally
      const updated = { ...activePlan };
      updated.dailySchedule.forEach(day => {
        day.tasks.forEach(t => {
          if (t.id === taskId) t.completed = !currentCompleted;
        });
      });
      setActivePlan(updated);
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const activeDay = activePlan?.dailySchedule?.[selectedDayIndex] || activePlan?.dailySchedule?.[0];
  const allTasks = activePlan?.dailySchedule?.flatMap(d => d.tasks) || [];
  const completedTasksCount = allTasks.filter(t => t.completed).length;
  const progressPct = allTasks.length > 0 ? Math.round((completedTasksCount / allTasks.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card dark:shadow-card-dark">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Personalized Study Intelligence
            </span>
            {activePlan?.aiGenerated && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Study Coach Agent Built
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {activePlan?.title || 'Interactive Weekly Study Planner'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Adaptive study blocks tailored to weak subject remediation, upcoming midterms, and student GPA targets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateAIPlan}
            disabled={generating}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white px-4 py-2.5 text-xs font-bold shadow-glow-cyan transition-all disabled:opacity-60"
          >
            {generating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating Plan...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate My Study Plan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Week Progress Bar & Focus Areas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 md:col-span-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weekly Completion</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {progressPct}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {completedTasksCount} / {allTasks.length} Tasks
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 md:col-span-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Target Focus Areas</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {activePlan?.focusAreas?.map((area, i) => (
              <span key={i} className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                <Check className="h-3 w-3 text-cyan-500" />
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Day Selector Pills */}
      {activePlan && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {activePlan.dailySchedule.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            const dayCompleted = day.tasks.every(t => t.completed) && day.tasks.length > 0;

            return (
              <button
                key={idx}
                onClick={() => setSelectedDayIndex(idx)}
                className={`flex-1 min-w-[120px] p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-700 dark:text-cyan-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <p className="text-xs font-bold">{day.day}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{day.date}</p>
                <div className="mt-1.5 flex items-center justify-center gap-1 text-[10px]">
                  {dayCompleted ? (
                    <span className="text-emerald-500 font-bold">✓ Done</span>
                  ) : (
                    <span>{day.tasks.filter(t => t.completed).length} / {day.tasks.length} tasks</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Day Task List */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card dark:shadow-card-dark">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {activeDay?.day} Agenda • {activeDay?.date}
            </h3>
            <p className="text-xs text-slate-500">
              Click checkboxes to track completion. Success Copilot recalculates adaptive velocity.
            </p>
          </div>
        </div>

        {activeDay?.tasks && activeDay.tasks.length > 0 ? (
          <div className="space-y-3">
            {activeDay.tasks.map(task => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id, task.completed)}
                className={`flex items-start justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  task.completed
                    ? 'bg-slate-50/60 dark:bg-slate-850/40 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-brand-500 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button className="mt-0.5 text-brand-600 dark:text-cyan-400">
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                  <div>
                    <p className={`text-xs font-bold ${
                      task.completed ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'
                    }`}>
                      {task.topic}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Subject: <span className="font-semibold text-slate-700 dark:text-slate-300">{task.subject}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-slate-500 font-mono">
                    <Clock className="h-3.5 w-3.5" />
                    {task.durationMinutes} mins
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    task.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                    task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-xs text-slate-400">No scheduled study tasks for this day.</p>
        )}
      </div>
    </div>
  );
};
