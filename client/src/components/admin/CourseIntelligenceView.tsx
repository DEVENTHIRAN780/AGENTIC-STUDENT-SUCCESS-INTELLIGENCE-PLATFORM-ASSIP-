import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, AlertTriangle, CheckCircle, TrendingDown, Users } from 'lucide-react';
import { Course, DepartmentName } from '../../types';
import { api } from '../../api/client';

export const CourseIntelligenceView: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, [selectedDept, selectedSemester, searchQuery]);

  const loadCourses = async () => {
    try {
      const res = await api.getCourses({
        department: selectedDept,
        semester: selectedSemester !== 'all' ? Number(selectedSemester) : undefined,
        search: searchQuery
      });
      setCourses(res.courses);
      if (res.courses.length > 0 && !selectedCourse) {
        setSelectedCourse(res.courses[0]);
      }
    } catch (err) {
      console.warn('Error fetching courses');
    } finally {
      setLoading(false);
    }
  };

  const departments: DepartmentName[] = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card dark:shadow-card-dark flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-600 dark:text-cyan-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-0.5 rounded border border-brand-500/20">
              Curriculum Diagnostics
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Course Intelligence & Syllabus Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Evaluate pass/failure rates, attendance patterns, and automated syllabus risk anomaly detection across 30 engineering courses.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search course code or name..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>

          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={selectedSemester}
            onChange={e => setSelectedSemester(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
          >
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div
            key={course.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-card dark:shadow-card-dark flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-brand-600 dark:text-cyan-400">
                  {course.code}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                  {course.department} • Sem {course.semester}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {course.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Instructor: {course.facultyName}
              </p>

              {/* Course Metrics Cards */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Enrollment</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{course.enrollmentCount} Students</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Avg Exam Score</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{course.avgScore}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Pass Rate</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{course.passRate}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Failure Rate</span>
                  <span className={`font-bold font-mono ${course.failureRate > 15 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                    {course.failureRate}%
                  </span>
                </div>
              </div>

              {/* Progress bars: Attendance & Assignments */}
              <div className="mt-4 space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Class Attendance Average</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{course.avgAttendance}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-500 h-full rounded-full" style={{ width: `${course.avgAttendance}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Assignment On-Time Completion</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{course.assignmentCompletionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${course.assignmentCompletionRate}%` }} />
                  </div>
                </div>
              </div>

              {/* AI Identified Flags */}
              {course.flags && course.flags.length > 0 && (
                <div className="mt-4 space-y-1.5">
                  {course.flags.map((flag, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] flex items-start gap-1.5 border border-amber-500/20">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
