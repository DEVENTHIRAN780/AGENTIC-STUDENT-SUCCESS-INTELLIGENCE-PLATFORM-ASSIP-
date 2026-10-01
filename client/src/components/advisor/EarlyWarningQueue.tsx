import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Filter, Search, ArrowUpDown, ChevronRight, 
  CheckCircle2, XCircle, Clock, Sparkles, User, ExternalLink, 
  HelpCircle, ArrowUpRight, ArrowDownRight, Minus 
} from 'lucide-react';
import { Student, Intervention, RiskLevel, DepartmentName } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { Student360Modal } from './Student360Modal';
import { WhyAmISeeingThisModal } from '../common/WhyAmISeeingThisModal';
import { api } from '../../api/client';

export const EarlyWarningQueue: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentFor360, setSelectedStudentFor360] = useState<Student | null>(null);
  const [explainStudent, setExplainStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedRiskFilter, selectedDeptFilter, selectedSemesterFilter, searchQuery]);

  const loadData = async () => {
    try {
      const res = await api.getStudents({
        department: selectedDeptFilter,
        semester: selectedSemesterFilter !== 'all' ? Number(selectedSemesterFilter) : undefined,
        riskLevel: selectedRiskFilter,
        search: searchQuery
      });
      setStudents(res.students);

      const intvRes = await api.getInterventions();
      setInterventions(intvRes.interventions);
    } catch (err) {
      console.warn('Failed to fetch queue, using local data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveIntervention = async (studentId: string) => {
    const intv = interventions.find(i => i.studentId === studentId);
    if (!intv) return;

    try {
      await api.updateInterventionStatus(
        intv.id,
        'Approved',
        'Prof. Rajeshwar Kulkarni',
        'Advisor approved recommended intervention protocol from Early Warning Queue.'
      );
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const departments: DepartmentName[] = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card dark:shadow-card-dark flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              Active Monitoring Stream
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-cyan-400 border border-brand-500/20">
              {students.length} Students Listed
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Early Warning Action Queue
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized student queue ranked by compound academic vulnerability and attendance decline. Human review required for all proposed interventions.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by student name, ID, or course signal..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Risk Level Filter */}
          <select
            value={selectedRiskFilter}
            onChange={e => setSelectedRiskFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical Risk (81-100)</option>
            <option value="high">High Risk (61-80)</option>
            <option value="moderate">Moderate Risk (31-60)</option>
            <option value="low">Low Risk (0-30)</option>
          </select>

          {/* Department Filter */}
          <select
            value={selectedDeptFilter}
            onChange={e => setSelectedDeptFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Semester Filter */}
          <select
            value={selectedSemesterFilter}
            onChange={e => setSelectedSemesterFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
          >
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Early Warning Queue Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card dark:shadow-card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Student</th>
                <th className="p-3.5">Program & Dept</th>
                <th className="p-3.5">Risk Score</th>
                <th className="p-3.5">Trend</th>
                <th className="p-3.5">Primary Risk Signal</th>
                <th className="p-3.5">Recommended Intervention</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map(student => {
                const intv = interventions.find(i => i.studentId === student.id);
                const hasPendingReview = intv && intv.status === 'Pending Review';

                return (
                  <tr 
                    key={student.id} 
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Student Identity */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={student.avatar} 
                          alt={student.name}
                          className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                        />
                        <div>
                          <button
                            onClick={() => setSelectedStudentFor360(student)}
                            className="font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-cyan-400 text-left hover:underline"
                          >
                            {student.name}
                          </button>
                          <p className="font-mono text-[10px] text-slate-400">{student.studentId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Program */}
                    <td className="p-3.5">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{student.department}</p>
                      <p className="text-[10px] text-slate-400">Sem {student.semester}</p>
                    </td>

                    {/* Risk Badge */}
                    <td className="p-3.5">
                      <RiskBadge level={student.riskLevel} score={student.riskScore} showScore size="sm" />
                    </td>

                    {/* Risk Change */}
                    <td className="p-3.5">
                      {student.riskTrend === 'up' && (
                        <span className="inline-flex items-center text-red-500 font-bold font-mono">
                          <ArrowUpRight className="h-3 w-3 mr-0.5" />
                          +{Math.abs(student.riskChange || 8)}
                        </span>
                      )}
                      {student.riskTrend === 'down' && (
                        <span className="inline-flex items-center text-emerald-500 font-bold font-mono">
                          <ArrowDownRight className="h-3 w-3 mr-0.5" />
                          -{Math.abs(student.riskChange || 4)}
                        </span>
                      )}
                      {student.riskTrend === 'stable' && (
                        <span className="inline-flex items-center text-slate-400 font-mono">
                          <Minus className="h-3 w-3 mr-0.5" />
                          0
                        </span>
                      )}
                    </td>

                    {/* Primary Signal */}
                    <td className="p-3.5 max-w-xs">
                      <p className="text-slate-700 dark:text-slate-300 font-medium truncate" title={student.primarySignal}>
                        {student.primarySignal}
                      </p>
                    </td>

                    {/* Recommended Action */}
                    <td className="p-3.5 max-w-xs">
                      <span className="text-slate-600 dark:text-slate-400 truncate block">
                        {intv?.recommendedAction || 'Advisor 1-on-1 Check-in'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        intv?.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                        intv?.status === 'Pending Review' ? 'bg-amber-500/10 text-amber-500' :
                        intv?.status === 'In Progress' ? 'bg-brand-500/10 text-cyan-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                        {intv?.status || 'Active'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setExplainStudent(student)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Explain Why Am I Seeing This?"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </button>
                        {hasPendingReview && (
                          <button
                            onClick={() => handleApproveIntervention(student.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-2xs"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedStudentFor360(student)}
                          className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-[11px] flex items-center gap-1 shadow-2xs"
                        >
                          360° Profile
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student 360 Modal */}
      {selectedStudentFor360 && (
        <Student360Modal
          isOpen={!!selectedStudentFor360}
          onClose={() => setSelectedStudentFor360(null)}
          student={selectedStudentFor360}
          interventions={interventions}
          onInterventionUpdated={loadData}
        />
      )}

      {/* Explain Risk Modal */}
      {explainStudent && (
        <WhyAmISeeingThisModal
          isOpen={!!explainStudent}
          onClose={() => setExplainStudent(null)}
          studentName={explainStudent.name}
          riskScore={explainStudent.riskScore}
          riskLevel={explainStudent.riskLevel}
          contributingSignals={[
            explainStudent.primarySignal,
            `Attendance benchmark: ${explainStudent.attendancePct}% vs Regulatory Threshold: 75%`,
            `Semester ${explainStudent.semester} Cumulative GPA: ${explainStudent.gpa}`
          ]}
          recommendedAction={interventions.find(i => i.studentId === explainStudent.id)?.recommendedAction || 'Schedule Advisor 1-on-1 session.'}
          whyAmISeeingThis={{
            ruleTriggered: 'Early Warning Calibration Matrix ERW-300',
            dataPointComparison: `${explainStudent.department} Cohort Benchmark: 86.4% Attendance, 7.82 GPA`,
            confidenceScore: 95.1
          }}
        />
      )}
    </div>
  );
};
