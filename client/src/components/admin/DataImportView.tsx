import React, { useState } from 'react';
import { 
  Database, UploadCloud, CheckCircle2, AlertTriangle, 
  FileText, ArrowRight, RefreshCw, XCircle 
} from 'lucide-react';
import { api } from '../../api/client';

export const DataImportView: React.FC = () => {
  const [csvContent, setCsvContent] = useState<string>(
`Name,Email,Department,Program,Semester,GPA,Attendance
Karan Kapoor,karan.kapoor@student.univ.edu,CSE,B.Tech Computer Science,3,7.85,88
Pooja Nair,pooja.nair@student.univ.edu,IT,B.Tech Information Technology,3,8.40,92
Saurabh Joshi,saurabh.joshi@student.univ.edu,ECE,B.Tech Electronics,5,6.20,68
Aishwarya Rao,aishwarya.rao@student.univ.edu,Mechanical,B.Tech Mechanical,5,7.10,81
Manish Tiwari,manish.tiwari@student.univ.edu,Civil,B.Tech Civil,3,5.40,59`
  );
  const [dataType, setDataType] = useState<'students' | 'grades' | 'attendance'>('students');
  const [previewResult, setPreviewResult] = useState<any>(null);
  const [commitResult, setCommitResult] = useState<any>(null);
  const [validating, setValidating] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleValidate = async () => {
    if (!csvContent.trim()) return;
    setValidating(true);
    setCommitResult(null);
    try {
      const res = await api.previewCSV(csvContent, dataType);
      setPreviewResult(res);
    } catch (err: any) {
      alert(`Validation error: ${err.message}`);
    } finally {
      setValidating(false);
    }
  };

  const handleCommit = async () => {
    if (!csvContent.trim()) return;
    setImporting(true);
    try {
      const res = await api.commitCSV(csvContent, dataType);
      setCommitResult(res);
    } catch (err: any) {
      alert(`Import error: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card dark:shadow-card-dark flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-600 dark:text-cyan-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-0.5 rounded border border-brand-500/20">
              Institutional Data Pipeline
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Batch CSV Ingestion & Roster Synchronization
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Ingest student rosters, examination grades, and LMS attendance records with automatic validation and error reporting.
          </p>
        </div>
      </div>

      {/* CSV Ingestion Form */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card dark:shadow-card-dark space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Dataset Domain:</span>
            <select
              value={dataType}
              onChange={e => setDataType(e.target.value as any)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-medium text-slate-900 dark:text-white"
            >
              <option value="students">Student Cohort Profiles & Enrolment</option>
              <option value="grades">Exam & Midterm Grade Records</option>
              <option value="attendance">Biometric Attendance Logs</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleValidate}
              disabled={validating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {validating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4 text-cyan-500" />}
              Validate & Preview
            </button>
            <button
              onClick={handleCommit}
              disabled={importing || !previewResult}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors"
            >
              {importing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              Commit Batch Ingestion
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            CSV Input (Raw or Pasted File Data)
          </label>
          <textarea
            rows={7}
            value={csvContent}
            onChange={e => setCsvContent(e.target.value)}
            className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Validation Preview Results */}
      {previewResult && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card dark:shadow-card-dark space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  CSV Structure Validation Report
                </h3>
                <p className="text-xs text-slate-500">
                  {previewResult.validRows} out of {previewResult.totalRows} rows verified compliant with schema
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
              Valid Format Ready
            </span>
          </div>

          {/* Table Preview */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold">
                <tr>
                  {previewResult.sampleHeaders.map((h: string) => (
                    <th key={h} className="p-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {previewResult.preview.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 font-mono">
                    {previewResult.sampleHeaders.map((h: string) => (
                      <td key={h} className="p-3 text-slate-800 dark:text-slate-200">{row[h]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Commit Result Success / Error Banner */}
      {commitResult && (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
              Batch Ingestion Concluded Successfully
            </h4>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              {commitResult.insertedCount} new student records committed to the ASSIP relational registry. Audit log generated.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
