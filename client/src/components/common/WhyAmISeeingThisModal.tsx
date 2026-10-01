import React from 'react';
import { X, Sparkles, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight, Activity } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { RiskLevel } from '../../types';

interface WhyAmISeeingThisModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  contributingSignals: string[] | Array<{ signal: string; weightPct?: number; category?: string }>;
  recommendedAction?: string;
  aiExplanation?: string;
  whyAmISeeingThis?: {
    ruleTriggered?: string;
    dataPointComparison?: string;
    confidenceScore?: number;
    historicalContext?: string;
  };
}

export const WhyAmISeeingThisModal: React.FC<WhyAmISeeingThisModalProps> = ({
  isOpen,
  onClose,
  studentName,
  riskScore,
  riskLevel,
  contributingSignals,
  recommendedAction,
  aiExplanation,
  whyAmISeeingThis
}) => {
  if (!isOpen) return null;

  const normalizedSignals = Array.isArray(contributingSignals)
    ? contributingSignals.map(s => (typeof s === 'string' ? { signal: s, weightPct: 25 } : s))
    : [];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="explain-modal-title"
    >
      <div 
        className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="rounded-xl p-2.5 bg-brand-500/10 text-brand-600 dark:text-cyan-400 border border-brand-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="explain-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                  Explainable AI Diagnostic
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                  Why Am I Seeing This?
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transparent multi-agent diagnostic breakdown for <strong className="text-slate-700 dark:text-slate-200">{studentName}</strong>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* Risk Score Summary Banner */}
          <div className="rounded-xl p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm font-bold text-slate-900 dark:text-white">
                <span className="text-lg leading-none">{riskScore}</span>
                <span className="text-[10px] text-slate-400 font-normal">/ 100</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Calibrated Risk Level</span>
                  <RiskBadge level={riskLevel} size="sm" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Early Warning Agent calibrated across attendance, grade variance, and LMS signals.
                </p>
              </div>
            </div>
            {whyAmISeeingThis?.confidenceScore && (
              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {whyAmISeeingThis.confidenceScore}% Confidence
                </span>
              </div>
            )}
          </div>

          {/* AI Narrative Explanation */}
          {aiExplanation && (
            <div className="rounded-xl p-4 bg-cyan-500/5 dark:bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="font-semibold text-cyan-700 dark:text-cyan-400 block mb-1">
                AI Synthesis Summary:
              </span>
              {aiExplanation}
            </div>
          )}

          {/* Contributing Signals Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-brand-500" />
              Signals Contributing to Risk Score
            </h4>
            <div className="space-y-2">
              {normalizedSignals.map((sig, idx) => (
                <div 
                  key={idx}
                  className="rounded-lg p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3 shadow-xs"
                >
                  <div className="mt-0.5 rounded-full p-1 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {sig.signal}
                    </p>
                    {sig.category && (
                      <span className="inline-block mt-1 text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        Signal Domain: {sig.category}
                      </span>
                    )}
                  </div>
                  {sig.weightPct && (
                    <span className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400">
                      ~{sig.weightPct}% Impact
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Governance & Rule Trigger */}
          {whyAmISeeingThis && (
            <div className="rounded-xl p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Rule Governance Verification
              </div>
              {whyAmISeeingThis.ruleTriggered && (
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  <span className="text-slate-400">Trigger:</span> {whyAmISeeingThis.ruleTriggered}
                </p>
              )}
              {whyAmISeeingThis.dataPointComparison && (
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  <span className="text-slate-400">Cohort Comparison:</span> {whyAmISeeingThis.dataPointComparison}
                </p>
              )}
            </div>
          )}

          {/* Recommended Next Action */}
          {recommendedAction && (
            <div className="rounded-xl p-4 bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/30">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
                <ArrowRight className="h-3.5 w-3.5" />
                Recommended Next Action (Human Approval Required)
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                {recommendedAction}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            Human-in-the-loop: Interventions require advisor authorization.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
