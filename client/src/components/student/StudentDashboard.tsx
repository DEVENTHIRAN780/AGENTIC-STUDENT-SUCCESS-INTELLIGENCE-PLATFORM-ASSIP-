import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Calendar, Clock, BookOpen, AlertCircle, 
  Sparkles, CheckCircle, ChevronRight, Award, BarChart2, 
  TrendingUp, Activity, ArrowRight, Bot, Target, HelpCircle 
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { StatCard } from '../common/StatCard';
import { RiskBadge } from '../common/RiskBadge';
import { WhyAmISeeingThisModal } from '../common/WhyAmISeeingThisModal';
import { Student, Course, Enrollment, Goal, StudyPlan } from '../../types';
import { api } from '../../api/client';

interface StudentDashboardProps {
  student: Student;
  onOpenCopilot: () => void;
  onNavigateTab: (tab: any) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  onOpenCopilot,
  onNavigateTab
}) => {
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [whyModalOpen, setWhyModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const perf = await api.getStudentPerformance(student.id);
        setPerformanceData(perf);
        if (perf.enrollments) setEnrollments(perf.enrollments);

        const goalsRes = await api.getGoals(student.id);
        if (goalsRes.goals) setGoals(goalsRes.goals);
      } catch (e) {
        console.warn('Using local fallback performance data');
      } finally {
        setLoading(false);
      }
    };
    loadStudentData();
  }, [student.id]);

  const defaultGpaTrend = [
    { semester: 'Sem 1', gpa: 8.1, cohortAvg: 7.4 },
    { semester: 'Sem 2', gpa: 8.25, cohortAvg: 7.5 },
    { semester: 'Sem 3', gpa: 8.18, cohortAvg: 7.55 },
    { semester: 'Sem 4', gpa: 8.35, cohortAvg: 7.6 },
    { semester: 'Sem 5 (Current)', gpa: student.gpa || 8.42, cohortAvg: 7.65 }
  ];

  const defaultAttendanceTrend = [
    { week: 'W1', attendance: 95, benchmark: 85 },
    { week: 'W2', attendance: 93, benchmark: 85 },
    { week: 'W3', attendance: 92, benchmark: 85 },
    { week: 'W4', attendance: 88, benchmark: 85 },
    { week: 'W5', attendance: 86, benchmark: 85 },
    { week: 'W6', attendance: 89, benchmark: 85 },
    { week: 'W7', attendance: 91, benchmark: 85 },
    { week: 'W8', attendance: 91, benchmark: 85 }
  ];

  const defaultRadarData = [
    { subject: 'Theory', score: 85, benchmark: 75 },
    { subject: 'Laboratory', score: 78, benchmark: 80 },
    { subject: 'Assignments', score: 88, benchmark: 85 },
    { subject: 'Attendance', score: 91, benchmark: 85 },
    { subject: 'Midterm', score: 86, benchmark: 72 },
    { subject: 'LMS Engagement', score: 90, benchmark: 78 }
  ];

  const gpaTrend = performanceData?.gpaTrend || defaultGpaTrend;
  const attendanceTrend = performanceData?.attendanceTrend || defaultAttendanceTrend;
  const radarData = performanceData?.radarData || defaultRadarData;

  const graduationProgressPct = Math.round((student.creditsCompleted / student.creditsTotal) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-brand-900 to-indigo-950 p-6 sm:p-8 text-white border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/80">
                Semester {student.semester} • {student.program}
              </span>
              <RiskBadge level={student.riskLevel} score={student.riskScore} showScore size="sm" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2">
              Good morning, {student.name.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              You are currently on track toward your degree completion. 
              {student.primarySignal && (
                <span className="text-amber-300 block mt-1 font-medium">
                  Notice: {student.primarySignal}
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setWhyModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors shadow-2xs"
            >
              <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
              Why am I seeing this?
            </button>
            <button
              onClick={onOpenCopilot}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 hover:from-brand-400 hover:to-cyan-400 text-white px-4 py-2 text-xs font-bold shadow-glow-cyan transition-all"
            >
              <Bot className="h-4 w-4" />
              Ask Success Copilot
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Academic Health"
          value={`${student.academicHealth} / 100`}
          subtitle="On Track"
          highlightColor="emerald"
          icon={<Activity className="h-5 w-5 text-emerald-500" />}
          trend={{ value: '3.4%', direction: 'up', label: 'vs last month', isPositiveGood: true }}
        />
        <StatCard
          title="Overall Attendance"
          value={`${student.attendancePct}%`}
          subtitle="Threshold: 75%"
          highlightColor={student.attendancePct >= 85 ? 'blue' : 'amber'}
          icon={<Clock className="h-5 w-5 text-brand-500" />}
          trend={{ value: '2.1%', direction: student.riskTrend === 'up' ? 'down' : 'up', label: 'weekly shift', isPositiveGood: true }}
        />
        <StatCard
          title="Current GPA"
          value={student.gpa}
          subtitle={`CGPA: ${student.cgpa}`}
          highlightColor="cyan"
          icon={<GraduationCap className="h-5 w-5 text-cyan-500" />}
          trend={{ value: '+0.14', direction: 'up', label: 'from Sem 4', isPositiveGood: true }}
        />
        <StatCard
          title="Credits Completed"
          value={`${student.creditsCompleted} / ${student.creditsTotal}`}
          subtitle={`${student.creditsTotal - student.creditsCompleted} Remaining`}
          highlightColor="blue"
          icon={<BookOpen className="h-5 w-5 text-indigo-500" />}
          trend={{ value: `${graduationProgressPct}%`, direction: 'neutral', label: 'Degree Progress' }}
        />
        <StatCard
          title="Evaluated Risk"
          value={student.riskLevel.toUpperCase()}
          subtitle={`Score: ${student.riskScore}/100`}
          highlightColor={student.riskLevel === 'critical' ? 'red' : student.riskLevel === 'high' ? 'amber' : 'emerald'}
          icon={<AlertCircle className={`h-5 w-5 ${student.riskLevel === 'critical' ? 'text-red-500' : 'text-emerald-500'}`} />}
          trend={{ value: student.riskChange ? `${student.riskChange} pts` : '-4 pts', direction: student.riskTrend === 'stable' ? 'neutral' : student.riskTrend, label: 'trend', isPositiveGood: false }}
          onClick={() => setWhyModalOpen(true)}
        />
      </div>

      {/* Graduation Progress Bar */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-card dark:shadow-card-dark">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Award className="h-4 w-4 text-brand-500" />
            B.Tech Graduation Progress Tracker
          </span>
          <span className="font-mono font-bold text-brand-600 dark:text-cyan-400">
            {student.creditsCompleted} / {student.creditsTotal} Credits ({graduationProgressPct}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-600 to-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${graduationProgressPct}%` }}
          />
        </div>
      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GPA Trend Line Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-card dark:shadow-card-dark">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-brand-500" />
                GPA Trajectory vs Cohort Average
              </h3>
              <p className="text-xs text-slate-500">Historical progression across completed semesters</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-cyan-400 font-semibold">
              Target: 8.85
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gpaTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
                <YAxis domain={[6.5, 9.5]} tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="gpa" name="My GPA" stroke="#0c8ee9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="cohortAvg" name="Cohort Avg" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competencies Radar Chart */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-card dark:shadow-card-dark">
          <div className="mb-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Academic Competency Radar
            </h3>
            <p className="text-xs text-slate-500">Multidimensional balance</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid opacity={0.2} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Student" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                <Radar name="Benchmark" dataKey="benchmark" stroke="#64748b" fill="#64748b" fillOpacity={0.1} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Enrolled Courses & Real-Time Performance */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-card dark:shadow-card-dark">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-cyan-500" />
              Enrolled Courses (Semester {student.semester})
            </h3>
            <p className="text-xs text-slate-500">Live grades, attendance, and assignment completion status</p>
          </div>
          <button 
            onClick={() => onNavigateTab('study-planner')}
            className="text-xs font-semibold text-brand-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            Open Study Planner <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-3 rounded-l-xl">Course</th>
                <th className="p-3">Current Grade</th>
                <th className="p-3">Marks Score</th>
                <th className="p-3">Attendance</th>
                <th className="p-3">Assignments</th>
                <th className="p-3 rounded-r-xl text-right">Status / Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {enrollments.map(enr => (
                <tr key={enr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-slate-900 dark:text-white">
                      <span className="font-mono text-brand-600 dark:text-cyan-400 mr-1.5">{enr.courseCode}</span>
                      {enr.courseName}
                    </p>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {enr.grade}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">{enr.marksScore}%</span>
                  </td>
                  <td className="p-3">
                    <span className={`font-mono font-semibold ${
                      enr.attendancePct < 80 ? 'text-amber-500 font-bold' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {enr.attendancePct}%
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-slate-600 dark:text-slate-300 font-mono">
                      {enr.assignmentsCompleted} / {enr.totalAssignments}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {enr.attendancePct < 80 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        <AlertCircle className="h-3 w-3" />
                        Attendance Alert (78%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle className="h-3 w-3" />
                        Good Standing
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explainable AI Modal */}
      <WhyAmISeeingThisModal
        isOpen={whyModalOpen}
        onClose={() => setWhyModalOpen(false)}
        studentName={student.name}
        riskScore={student.riskScore}
        riskLevel={student.riskLevel}
        contributingSignals={[
          'Attendance dropped from 94% to 78% in Operating Systems (IT302)',
          '1 lab assignment unsubmitted in Friday module',
          'Overall GPA remains high at 8.42 with strong scores in Data Structures'
        ]}
        recommendedAction="Attend rescheduled afternoon lab session and submit OS Assignment #5 to return to Low Risk benchmark."
        aiExplanation="Compounded analysis confirms your academic foundation is solid. The primary trigger is isolated to Friday morning absences in IT302."
        whyAmISeeingThis={{
          ruleTriggered: 'Rule ERW-105: Isolated Subject Attendance Anomaly',
          dataPointComparison: 'Operating Systems Attendance: 78% vs Student Overall: 91% vs Cohort Avg: 84%',
          confidenceScore: 94.2
        }}
      />
    </div>
  );
};
