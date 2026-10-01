import React, { useState, useEffect, useRef } from 'react';
import { Search, User, BookOpen, Users, AlertCircle, Sparkles, X, ArrowRight } from 'lucide-react';
import { Student, Course, Intervention, AIInsight } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent?: (student: Student) => void;
  onSelectCourse?: (course: Course) => void;
  onSelectIntervention?: (intervention: Intervention) => void;
  students: Student[];
  courses: Course[];
  interventions: Intervention[];
  insights: AIInsight[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectStudent,
  onSelectCourse,
  onSelectIntervention,
  students,
  courses,
  interventions,
  insights
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via custom event or prop
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredStudents = q
    ? students.filter(s => s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.department.toLowerCase().includes(q)).slice(0, 4)
    : students.slice(0, 3);

  const filteredCourses = q
    ? courses.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.department.toLowerCase().includes(q)).slice(0, 3)
    : courses.slice(0, 2);

  const filteredInterventions = q
    ? interventions.filter(i => i.title.toLowerCase().includes(q) || i.studentName.toLowerCase().includes(q) || i.type.toLowerCase().includes(q)).slice(0, 3)
    : interventions.slice(0, 2);

  const filteredInsights = q
    ? insights.filter(ins => ins.title.toLowerCase().includes(q) || ins.suggestedAction.toLowerCase().includes(q)).slice(0, 2)
    : insights.slice(0, 2);

  const totalResults = filteredStudents.length + filteredCourses.length + filteredInterventions.length + filteredInsights.length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search students, courses, interventions, insights, or commands... (Ctrl+K)"
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="ml-3 hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
            ESC to close
          </span>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {totalResults === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching records found for "{query}".
            </div>
          ) : (
            <>
              {/* Students */}
              {filteredStudents.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                    <User className="h-3 w-3 text-brand-500" />
                    Students ({filteredStudents.length})
                  </div>
                  <div className="space-y-1">
                    {filteredStudents.map(student => (
                      <div
                        key={student.id}
                        onClick={() => {
                          onSelectStudent?.(student);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={student.avatar} 
                            alt={student.name} 
                            className="h-7 w-7 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                              {student.name}
                              <span className="font-mono text-[10px] text-slate-400">{student.studentId}</span>
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {student.department} • Sem {student.semester} • GPA {student.gpa} • {student.attendancePct}% Att
                            </p>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          student.riskLevel === 'critical' ? 'bg-red-500/10 text-red-500' :
                          student.riskLevel === 'high' ? 'bg-orange-500/10 text-orange-500' :
                          student.riskLevel === 'moderate' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {student.riskLevel.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Courses */}
              {filteredCourses.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="h-3 w-3 text-cyan-500" />
                    Courses & Analytics
                  </div>
                  <div className="space-y-1">
                    {filteredCourses.map(course => (
                      <div
                        key={course.id}
                        onClick={() => {
                          onSelectCourse?.(course);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">
                            <span className="font-mono text-cyan-600 dark:text-cyan-400 mr-2">[{course.code}]</span>
                            {course.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Dept: {course.department} • Faculty: {course.facultyName} • Pass Rate: {course.passRate}%
                          </p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interventions */}
              {filteredInterventions.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3 text-amber-500" />
                    Early Warning Interventions
                  </div>
                  <div className="space-y-1">
                    {filteredInterventions.map(intv => (
                      <div
                        key={intv.id}
                        onClick={() => {
                          onSelectIntervention?.(intv);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">
                            {intv.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Student: {intv.studentName} ({intv.studentDept}) • Status: {intv.status}
                          </p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                          {intv.priority.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Insights */}
              {filteredInsights.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-purple-500" />
                    AI Insights & Signals
                  </div>
                  <div className="space-y-1">
                    {filteredInsights.map(ins => (
                      <div
                        key={ins.id}
                        className="p-2 rounded-lg bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs"
                      >
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {ins.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {ins.evidence}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-[11px] text-slate-400">
          <span>Search ASSIP institutional intelligence registry</span>
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
        </div>
      </div>
    </div>
  );
};
