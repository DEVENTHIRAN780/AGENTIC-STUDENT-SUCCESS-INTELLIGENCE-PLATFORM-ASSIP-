import React, { useState } from 'react';
import { 
  X, User, BookOpen, Clock, Activity, AlertTriangle, 
  CheckCircle2, XCircle, Edit3, Sparkles, TrendingUp, 
  ChevronRight, Calendar, MessageSquare, ShieldAlert, 
  HelpCircle, ArrowRight 
} from 'lucide-react';
import { Student, Enrollment, Intervention } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { WhyAmISeeingThisModal } from '../common/WhyAmISeeingThisModal';
import { api } from '../../api/client';

interface Student360ModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  enrollments?: Enrollment[];
  interventions?: Intervention[];
  onInterventionUpdated?: () => void;
}

export const Student360Modal: React.FC<Student360ModalProps> = ({
  isOpen,
  onClose,
  student,
  enrollments = [],
  interventions = [],
  onInterventionUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'risk' | 'recommendations' | 'timeline'>('overview');
  const [whyModalOpen, setWhyModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  if (!isOpen) return null;

  const relevantInterventions = interventions.filter(i => i.studentId === student.id);
  const currentIntervention = relevantInterventions[0];

  const handleUpdateStatus = async (status: string) => {
    if (!currentIntervention) return;
    setActionLoading(true);
    try {
      await api.updateInterventionStatus(
        currentIntervention.id, 
        status, 
        'Prof. Rajeshwar Kulkarni', 
        `Advisor updated status to ${status} via Student 360 Console.`
      );
      onInterventionUpdated?.();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-4xl max-h-[92vh] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header Profile Banner */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-850 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={student.avatar} 
              alt={student.name}
              className="h-16 w-16 rounded-2xl object-cover border-2 border-brand-500/40 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {student.name}
                </h2>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300">
                  {student.studentId}
                </span>
                <RiskBadge level={student.riskLevel} score={student.riskScore} showScore size="sm" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {student.program} • Semester {student.semester} • Enrolled {student.enrollmentYear}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                <span>GPA: <strong className="text-slate-900 dark:text-white">{student.gpa}</strong></span>
                <span>•</span>
                <span>Attendance: <strong className={student.attendancePct < 75 ? 'text-red-500' : 'text-slate-900 dark:text-white'}>{student.attendancePct}%</strong></span>
                <span>•</span>
                <span>Advisor: <strong className="text-brand-600 dark:text-cyan-400">{student.advisorName}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setWhyModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5 text-cyan-500" />
              Explain Risk
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-brand-500 text-brand-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Academic Overview
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'risk'
                ? 'border-brand-500 text-brand-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Multi-Signal Risk Analysis
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'recommendations'
                ? 'border-brand-500 text-brand-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            AI Interventions ({relevantInterventions.length})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'timeline'
                ? 'border-brand-500 text-brand-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Intervention Timeline
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Enrolled Courses Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-brand-500" />
                  Course Grades & Attendance Cadence
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold">
                      <tr>
                        <th className="p-3">Course</th>
                        <th className="p-3">Grade</th>
                        <th className="p-3">Marks Score</th>
                        <th className="p-3">Attendance</th>
                        <th className="p-3">Assignments</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {enrollments.map(e => (
                        <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-3 font-semibold text-slate-900 dark:text-white">
                            <span className="font-mono text-cyan-600 dark:text-cyan-400 mr-1.5">[{e.courseCode}]</span>
                            {e.courseName}
                          </td>
                          <td className="p-3 font-mono font-bold">{e.grade}</td>
                          <td className="p-3 font-mono">{e.marksScore}%</td>
                          <td className="p-3 font-mono">
                            <span className={e.attendancePct < 75 ? 'text-red-500 font-bold' : ''}>
                              {e.attendancePct}%
                            </span>
                          </td>
                          <td className="p-3 font-mono">{e.assignmentsCompleted} / {e.totalAssignments}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Engagement Signals */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
                  <span className="text-slate-400">LMS Portal Activity</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-1">14.2 Hours / Week</p>
                  <span className="text-[10px] text-emerald-500 font-semibold">Optimal Engagement</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
                  <span className="text-slate-400">Library Book Circulation</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-1">3 Technical Titles</p>
                  <span className="text-[10px] text-slate-400">Active Borrowings</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
                  <span className="text-slate-400">Advisor Meeting Record</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-1">2 Past Sessions</p>
                  <span className="text-[10px] text-cyan-500 font-semibold">Attended On-Time</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'risk' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Multi-Factor Risk Score</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {student.riskScore} / 100 — <span className="capitalize">{student.riskLevel} Risk</span>
                    </h3>
                  </div>
                  <RiskBadge level={student.riskLevel} size="lg" />
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      student.riskLevel === 'critical' ? 'bg-red-500' :
                      student.riskLevel === 'high' ? 'bg-orange-500' :
                      student.riskLevel === 'moderate' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${student.riskScore}%` }}
                  />
                </div>
              </div>

              {/* Signals */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Contributing Factors Evaluated
                </h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-start gap-3 text-xs">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{student.primarySignal}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Detected by Early Warning Agent via weekly roster scan.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              {relevantInterventions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No active interventions pending review for this student.
                </div>
              ) : (
                relevantInterventions.map(intv => (
                  <div 
                    key={intv.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-cyan-400 border border-brand-500/20">
                            {intv.type}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            intv.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                            intv.status === 'Pending Review' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {intv.status}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                          {intv.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {intv.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Recommended Action:
                      </span>
                      <p className="text-slate-600 dark:text-slate-400">
                        {intv.recommendedAction}
                      </p>
                    </div>

                    {/* Human Approval Decision Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400">
                        Advisor Action Required
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus('Approved')}
                          disabled={actionLoading}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus('In Progress')}
                          disabled={actionLoading}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Modify / In Progress
                        </button>
                        <button
                          onClick={() => handleUpdateStatus('Closed')}
                          disabled={actionLoading}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold transition-colors"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Reject / Close
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Case History & Intervention Progression
              </h4>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                {(currentIntervention?.timeline || [
                  { id: '1', date: '2026-09-20', title: 'Risk Detected', details: 'Early Warning Agent detected compound signal drop.', actor: 'AI Agent' },
                  { id: '2', date: '2026-09-22', title: 'Advisor Notified', details: 'Dossier queued in Early Warning workflow.', actor: 'System' },
                  { id: '3', date: '2026-09-25', title: 'Intervention Plan Approved', details: 'Academic Advisor approved 1-on-1 check-in.', actor: 'Prof. Rajeshwar' }
                ]).map(evt => (
                  <div key={evt.id} className="relative">
                    <span className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full bg-brand-500 border-2 border-white dark:border-slate-900" />
                    <div className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{evt.title}</span>
                        <span className="font-mono text-[10px] text-slate-400">{evt.date}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">{evt.details}</p>
                      <span className="text-[10px] text-brand-600 dark:text-cyan-400 font-semibold mt-1 inline-block">
                        By {evt.actor}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <WhyAmISeeingThisModal
        isOpen={whyModalOpen}
        onClose={() => setWhyModalOpen(false)}
        studentName={student.name}
        riskScore={student.riskScore}
        riskLevel={student.riskLevel}
        contributingSignals={[student.primarySignal, 'Comparative variance across 3 continuous evaluations']}
        recommendedAction="Schedule advisor check-in and review tutorial allocations."
      />
    </div>
  );
};
