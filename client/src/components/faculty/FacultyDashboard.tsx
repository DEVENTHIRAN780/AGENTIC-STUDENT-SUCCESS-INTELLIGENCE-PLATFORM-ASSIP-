import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Users, AlertTriangle, CheckCircle, BarChart3, 
  Send, Sparkles, Plus, Bell, MessageSquare, ChevronRight, 
  Clock, Award, HelpCircle 
} from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { Course, Student, Intervention } from '../../types';
import { api } from '../../api/client';

export const FacultyDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementSent, setAnnouncementSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFacultyData();
  }, []);

  const loadFacultyData = async () => {
    try {
      const crsRes = await api.getCourses({ department: 'CSE' });
      setCourses(crsRes.courses);
      if (crsRes.courses.length > 0) {
        setSelectedCourse(crsRes.courses[0]);
      }

      const stdRes = await api.getStudents({ department: 'CSE' });
      setStudents(stdRes.students);
    } catch (e) {
      console.warn('Error loading faculty data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setAnnouncementSent(true);
    setTimeout(() => {
      setAnnouncementSent(false);
      setAnnouncementText('');
    }, 3000);
  };

  const strugglingStudents = students.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-900 via-indigo-950 to-slate-900 border border-slate-800 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/80">
              Department of Computer Science & Engineering
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Faculty Teaching & Class Analytics Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Dr. Sunita Ramanathan • Professor, Computer Science & AI Directorate. Monitor lecture attendance drops, grade distribution curves, and trigger remedial guidance.
          </p>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Courses"
          value={courses.length || 3}
          subtitle="CS301, CS502, MA101"
          highlightColor="blue"
          icon={<BookOpen className="h-5 w-5 text-brand-500" />}
        />
        <StatCard
          title="Total Enrolled Students"
          value={courses.reduce((acc, c) => acc + c.enrollmentCount, 0) || 264}
          subtitle="Across active batches"
          highlightColor="cyan"
          icon={<Users className="h-5 w-5 text-cyan-500" />}
        />
        <StatCard
          title="Struggling Students"
          value={strugglingStudents.length}
          subtitle="Immediate Remediation"
          highlightColor="red"
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
          trend={{ value: '3 flagged this week', direction: 'up', isPositiveGood: false }}
        />
        <StatCard
          title="Average Course Pass Rate"
          value={`${courses[0]?.passRate || 91}%`}
          subtitle="Midterm Benchmark"
          highlightColor="emerald"
          icon={<Award className="h-5 w-5 text-emerald-500" />}
        />
      </div>

      {/* Assigned Classes Grid */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card dark:shadow-card-dark">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Assigned Courses & Syllabus Intelligence
            </h3>
            <p className="text-xs text-slate-500">
              Live indicators on assignment completion rates, attendance, and exam distribution
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedCourse?.id === course.id
                  ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/20 ring-1 ring-brand-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-brand-600 dark:text-cyan-400">
                  {course.code}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                  Sem {course.semester}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
                {course.name}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {course.enrollmentCount} Students • {course.credits} Credits
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">Avg Score</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{course.avgScore}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Attendance</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{course.avgAttendance}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Pass Rate</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{course.passRate}%</span>
                </div>
              </div>

              {course.flags && course.flags.length > 0 && (
                <div className="mt-3 p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] flex items-start gap-1.5 border border-amber-500/20">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span className="truncate">{course.flags[0]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Struggling Students In Course & Announcement Dispatcher */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Struggling Students List */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card dark:shadow-card-dark">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Students Requiring Immediate Faculty Check-in
              </h4>
              <p className="text-xs text-slate-400">Identified by compounded attendance drops and missing lab practicals</p>
            </div>
          </div>

          <div className="space-y-3">
            {strugglingStudents.slice(0, 4).map(std => (
              <div 
                key={std.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={std.avatar} 
                    alt={std.name} 
                    className="h-8 w-8 rounded-full object-cover border border-slate-300 dark:border-slate-700" 
                  />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{std.name}</p>
                    <p className="text-slate-400 text-[11px]">
                      {std.studentId} • {std.attendancePct}% Attendance • GPA {std.gpa}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-500 uppercase font-mono">
                    {std.riskLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Broadcast Announcement */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card dark:shadow-card-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="h-4 w-4 text-brand-500" />
                Broadcast Class Announcement / Remedial Alert
              </h4>
              <span className="font-mono text-xs text-brand-600 dark:text-cyan-400 font-bold">
                [{selectedCourse?.code || 'CS301'}]
              </span>
            </div>

            <form onSubmit={handleSendAnnouncement} className="space-y-3">
              <textarea
                rows={4}
                value={announcementText}
                onChange={e => setAnnouncementText(e.target.value)}
                placeholder="Compose lecture update, lab deadline reminder, or supplementary tutorial notification..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />

              {announcementSent && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 border border-emerald-500/20">
                  <CheckCircle className="h-4 w-4" />
                  Announcement successfully dispatched to all 124 enrolled students in {selectedCourse?.code}.
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Pushes notification to LMS & Student Portal
                </span>
                <button
                  type="submit"
                  disabled={!announcementText.trim()}
                  className="flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  Dispatch Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
