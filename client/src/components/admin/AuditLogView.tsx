import React, { useState, useEffect } from 'react';
import { FileText, Search, ShieldCheck, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { AuditLog } from '../../types';
import { api } from '../../api/client';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const res = await api.getAuditLogs();
      setLogs(res.logs);
    } catch (e) {
      console.warn('Error loading audit logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = searchQuery
    ? logs.filter(l => 
        l.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.details.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : logs;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card dark:shadow-card-dark flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-600 dark:text-cyan-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-0.5 rounded border border-brand-500/20">
              Institutional Governance
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            System Security & Administrative Audit Logs
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Immutable traceability ledger recording all intervention approvals, threshold recalibrations, and data ingestion activities.
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search audit trail..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card dark:shadow-card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Action Executed</th>
                <th className="p-3.5">Resource Scope</th>
                <th className="p-3.5">Details</th>
                <th className="p-3.5">Result</th>
                <th className="p-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 font-mono text-[11px]">
                  <td className="p-3.5 text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 dark:text-white font-sans">{log.userName}</span>
                    <span className="block text-[10px] text-slate-400 capitalize">{log.userRole}</span>
                  </td>
                  <td className="p-3.5 font-sans font-semibold text-slate-800 dark:text-slate-200">
                    {log.action}
                  </td>
                  <td className="p-3.5 text-brand-600 dark:text-cyan-400 font-sans">
                    {log.resource}
                  </td>
                  <td className="p-3.5 font-sans text-slate-600 dark:text-slate-400 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="p-3.5">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      log.result === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                      log.result === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {log.result}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {log.ipAddress}
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
