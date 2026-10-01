import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Clock, Award, AlertTriangle, Layers, Info } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';
import { DepartmentMetric } from '../../types';
import { api } from '../../api/client';

export const DepartmentAnalyticsView: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDepartmentData();
  }, []);

  const loadDepartmentData = async () => {
    try {
      const res = await api.getDepartmentAnalytics();
      setDepartments(res.departments);
    } catch (e) {
      console.warn('Error loading department analytics');
    } finally {
      setLoading(false);
    }
  };

  const chartData = departments.map(d => ({
    name: d.department,
    avgGpa: d.avgGpa,
    attendance: d.avgAttendance,
    atRiskPct: d.atRiskPercentage,
    passRate: d.avgCoursePassRate
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card dark:shadow-card-dark flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-600 dark:text-cyan-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-0.5 rounded border border-brand-500/20">
              Departmental Comparison
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Department Performance & Cohort Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Neutral comparative metrics across CSE, IT, ECE, EEE, Mechanical, and Civil Engineering programs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <Info className="h-4 w-4 text-cyan-500" />
          <span>Institutional Policy: Departments are analyzed neutrally without competitive rankings.</span>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card dark:shadow-card-dark">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Average Attendance vs Course Pass Rates By Department
        </h3>
        <p className="text-xs text-slate-500 mb-4">Multi-department metric visualization</p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="attendance" name="Avg Attendance %" fill="#0c8ee9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="passRate" name="Course Pass Rate %" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="atRiskPct" name="At-Risk Population %" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Neutral Department Analytics Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card dark:shadow-card-dark overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Department Statistical Breakdown
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Enrolled Cohort</th>
                <th className="p-3.5">Average GPA</th>
                <th className="p-3.5">Average Attendance</th>
                <th className="p-3.5">At-Risk Count (%)</th>
                <th className="p-3.5">Course Pass Rate</th>
                <th className="p-3.5">Active Interventions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {departments.map(dept => (
                <tr key={dept.department} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="font-mono text-cyan-600 dark:text-cyan-400">[{dept.department}]</span>
                        {dept.fullName}
                      </p>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-slate-800 dark:text-slate-200">
                    {dept.studentCount} Students
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                    {dept.avgGpa}
                  </td>
                  <td className="p-3.5 font-mono text-slate-800 dark:text-slate-200">
                    {dept.avgAttendance}%
                  </td>
                  <td className="p-3.5">
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {dept.atRiskCount} ({dept.atRiskPercentage}%)
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {dept.avgCoursePassRate}%
                  </td>
                  <td className="p-3.5 font-mono text-slate-800 dark:text-slate-200">
                    {dept.activeInterventions} ({dept.interventionRate}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
