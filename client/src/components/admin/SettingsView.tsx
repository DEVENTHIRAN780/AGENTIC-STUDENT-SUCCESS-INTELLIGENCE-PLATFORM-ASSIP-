import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Sparkles, Sliders, CheckCircle2, Lock, Building, Database } from 'lucide-react';
import { api } from '../../api/client';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'thresholds' | 'ai' | 'institution' | 'security'>('thresholds');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await api.getSettings();
      setSettings(res.settings);
    } catch (e) {
      console.warn('Using default settings');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card dark:shadow-card-dark flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-600 dark:text-cyan-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-0.5 rounded border border-brand-500/20">
              System Configuration
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Institutional Settings & Risk Threshold Controls
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure automated early warning triggers, AI provider orchestration parameters, and data governance policies.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4" />
            Configuration Saved & Propagated
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('thresholds')}
          className={`py-2.5 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'thresholds'
              ? 'border-brand-500 text-brand-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="h-4 w-4" />
          Early Warning Thresholds
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`py-2.5 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'ai'
              ? 'border-brand-500 text-brand-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          AI Preferences & Providers
        </button>
        <button
          onClick={() => setActiveTab('institution')}
          className={`py-2.5 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'institution'
              ? 'border-brand-500 text-brand-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building className="h-4 w-4" />
          Institution & Semester Setup
        </button>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-card dark:shadow-card-dark space-y-6 text-xs">
        {activeTab === 'thresholds' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Automated Early Warning Threshold Calibrations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Regulatory Minimum Attendance Trigger (%)
                </label>
                <input
                  type="number"
                  value={settings?.earlyWarningThresholds?.criticalAttendanceThresholdPct || 75}
                  onChange={e => setSettings({
                    ...settings,
                    earlyWarningThresholds: {
                      ...settings.earlyWarningThresholds,
                      criticalAttendanceThresholdPct: Number(e.target.value)
                    }
                  })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Students dropping below this threshold trigger Critical Debarment Alerts.
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Academic Probation GPA Cutoff
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={settings?.earlyWarningThresholds?.criticalGpaThreshold || 6.0}
                  onChange={e => setSettings({
                    ...settings,
                    earlyWarningThresholds: {
                      ...settings.earlyWarningThresholds,
                      criticalGpaThreshold: Number(e.target.value)
                    }
                  })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Students falling below this score require mandatory advisor check-in.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <input
                type="checkbox"
                id="human-loop"
                checked={settings?.earlyWarningThresholds?.enableHumanInTheLoopApproval ?? true}
                onChange={e => setSettings({
                  ...settings,
                  earlyWarningThresholds: {
                    ...settings.earlyWarningThresholds,
                    enableHumanInTheLoopApproval: e.target.checked
                  }
                })}
                className="h-4 w-4 text-brand-600 rounded"
              />
              <label htmlFor="human-loop" className="font-semibold text-slate-800 dark:text-slate-200">
                Enforce Mandatory Human-in-the-Loop Approval for AI Interventions (Recommended)
              </label>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              AI Multi-Agent Provider Configuration
            </h3>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Active Intelligence Engine Provider
                </label>
                <input
                  type="text"
                  disabled
                  value="Enterprise Intelligent Engine (Offline Mock Mode + OpenAI / Local LLM Pluggable)"
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Configured via server environment variables (AI_API_KEY, AI_MODEL, AI_BASE_URL).
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'institution' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Institution Identity & Semester Scheduling
            </h3>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Institution Name
              </label>
              <input
                type="text"
                value={settings?.institutionName || 'Metropolitan Institute of Technology & Research (MITR)'}
                onChange={e => setSettings({ ...settings, institutionName: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-xs transition-colors"
          >
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
};
