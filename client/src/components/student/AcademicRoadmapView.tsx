import React, { useState, useEffect } from 'react';
import { 
  Map, CheckCircle, Clock, BookOpen, ChevronRight, 
  Award, Sparkles, AlertCircle, ArrowRight 
} from 'lucide-react';
import { Student } from '../../types';
import { api } from '../../api/client';

interface AcademicRoadmapViewProps {
  student: Student;
}

export const AcademicRoadmapView: React.FC<AcademicRoadmapViewProps> = ({ student }) => {
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        const res = await api.getStudent360(student.id);
        if (res.roadmap) {
          setRoadmapData(res.roadmap);
        }
      } catch (err) {
        console.warn('Using default academic roadmap');
      } finally {
        setLoading(false);
      }
    };
    loadRoadmap();
  }, [student.id]);

  const roadmap = roadmapData?.roadmap || [
    {
      year: 1,
      yearLabel: 'Year 1 (2022 - 2023)',
      semesters: [
        {
          semester: 1,
          credits: 20,
          status: 'completed',
          courses: [
            { code: 'MA101', name: 'Linear Algebra & Calculus', credits: 4, status: 'completed', grade: 'A' },
            { code: 'PH102', name: 'Engineering Physics & Electromagnetics', credits: 3, status: 'completed', grade: 'A+' },
            { code: 'CS101', name: 'Problem Solving with C Programming', credits: 4, status: 'completed', grade: 'A' },
            { code: 'EE102', name: 'Basic Electrical Engineering & Lab', credits: 4, status: 'completed', grade: 'B+' }
          ]
        },
        {
          semester: 2,
          credits: 20,
          status: 'completed',
          courses: [
            { code: 'CS201', name: 'Object Oriented Programming with Java', credits: 4, status: 'completed', grade: 'A' },
            { code: 'MA202', name: 'Differential Equations & Transforms', credits: 4, status: 'completed', grade: 'A' },
            { code: 'HS201', name: 'Professional Ethics & Technical Writing', credits: 2, status: 'completed', grade: 'A+' }
          ]
        }
      ]
    },
    {
      year: 2,
      yearLabel: 'Year 2 (2023 - 2024)',
      semesters: [
        {
          semester: 3,
          credits: 20,
          status: 'completed',
          courses: [
            { code: 'CS301', name: 'Data Structures & Algorithms', credits: 4, status: 'completed', grade: 'A' },
            { code: 'CS304', name: 'Digital Logic & Computer Organization', credits: 4, status: 'completed', grade: 'A' },
            { code: 'MA301', name: 'Discrete Mathematical Structures', credits: 4, status: 'completed', grade: 'B+' }
          ]
        },
        {
          semester: 4,
          credits: 20,
          status: 'completed',
          courses: [
            { code: 'CS303', name: 'Database Management Systems & SQL', credits: 4, status: 'completed', grade: 'A' },
            { code: 'CS404', name: 'Theory of Computation & Automata', credits: 4, status: 'completed', grade: 'B+' },
            { code: 'CS405', name: 'Design and Analysis of Algorithms', credits: 4, status: 'completed', grade: 'A' }
          ]
        }
      ]
    },
    {
      year: 3,
      yearLabel: 'Year 3 (2024 - 2025) • CURRENT YEAR',
      semesters: [
        {
          semester: 5,
          credits: 20,
          status: 'in_progress',
          courses: [
            { code: 'IT302', name: 'Operating Systems & System Programming', credits: 4, status: 'in_progress', grade: 'B+' },
            { code: 'IT401', name: 'Computer Networks & Security', credits: 3, status: 'in_progress', grade: 'A' },
            { code: 'CS502', name: 'Artificial Intelligence & Machine Learning', credits: 4, status: 'in_progress', grade: 'A+' }
          ]
        },
        {
          semester: 6,
          credits: 20,
          status: 'upcoming',
          courses: [
            { code: 'IT503', name: 'Cloud Computing & DevOps Architecture', credits: 3, status: 'upcoming', prerequisite: 'IT401 Networks' },
            { code: 'IT602', name: 'Full Stack Web Development & Microservices', credits: 4, status: 'upcoming', prerequisite: 'CS303 Databases' },
            { code: 'CS601', name: 'Compiler Design & Formal Languages', credits: 4, status: 'upcoming' }
          ]
        }
      ]
    },
    {
      year: 4,
      yearLabel: 'Year 4 (2025 - 2026)',
      semesters: [
        {
          semester: 7,
          credits: 20,
          status: 'upcoming',
          courses: [
            { code: 'CAP701', name: 'Senior Industry Capstone Project I', credits: 6, status: 'upcoming' },
            { code: 'EL702', name: 'Professional Elective: Distributed Systems', credits: 4, status: 'upcoming' },
            { code: 'EL703', name: 'Open Elective: Tech Entrepreneurship', credits: 3, status: 'upcoming' }
          ]
        },
        {
          semester: 8,
          credits: 20,
          status: 'upcoming',
          courses: [
            { code: 'CAP801', name: 'Senior Capstone Project Defense & Internship', credits: 12, status: 'upcoming' },
            { code: 'INT802', name: 'Corporate Internship Program Verification', credits: 8, status: 'upcoming' }
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card dark:shadow-card-dark flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-600 dark:text-cyan-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded border border-brand-500/20">
              Curriculum & Degree Progress
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Graduation Target: 2026
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            4-Year Academic Journey & Degree Roadmap
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Visual milestone timeline from Year 1 foundational sciences to Year 4 capstone and honors completion.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-slate-600 dark:text-slate-300">In Progress (Sem 5)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="text-slate-600 dark:text-slate-300">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Recommended Electives AI Insight Banner */}
      {roadmapData?.recommendedElectives && (
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 dark:bg-cyan-950/20 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-2">
            <Sparkles className="h-4 w-4" />
            Academic Planning Agent Recommendations for Upcoming Semesters
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {roadmapData.recommendedElectives.map((ele: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400 mr-2">[{ele.courseCode}]</span>
                <span className="font-bold text-slate-900 dark:text-white">{ele.courseName}</span>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1">{ele.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Roadmap Timeline */}
      <div className="space-y-6">
        {roadmap.map((yearItem: any) => (
          <div 
            key={yearItem.year}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card dark:shadow-card-dark"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-cyan-400 font-extrabold flex items-center justify-center">
                  Y{yearItem.year}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {yearItem.yearLabel}
                  </h3>
                  <p className="text-xs text-slate-400">40 Credits Target</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {yearItem.semesters.map((sem: any) => (
                <div 
                  key={sem.semester}
                  className={`rounded-xl p-4 border transition-all ${
                    sem.status === 'completed'
                      ? 'bg-slate-50/60 dark:bg-slate-850/40 border-slate-200 dark:border-slate-800'
                      : sem.status === 'in_progress'
                      ? 'bg-brand-50/40 dark:bg-brand-950/20 border-brand-500/40 ring-1 ring-brand-500/20'
                      : 'bg-white dark:bg-slate-900 border-dashed border-slate-200 dark:border-slate-800 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      Semester {sem.semester}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      sem.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                      sem.status === 'in_progress' ? 'bg-brand-500 text-white shadow-2xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {sem.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {sem.courses.map((course: any, idx: number) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs"
                      >
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            <span className="font-mono text-cyan-600 dark:text-cyan-400 mr-1.5">{course.code}</span>
                            {course.name}
                          </p>
                          {course.prerequisite && (
                            <p className="text-[10px] text-amber-500 mt-0.5">
                              Prereq: {course.prerequisite}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-slate-400">{course.credits} Cr</span>
                          {course.grade && (
                            <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px]">
                              {course.grade}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
