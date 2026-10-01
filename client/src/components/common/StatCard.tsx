import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
    isPositiveGood?: boolean;
  };
  highlightColor?: 'blue' | 'cyan' | 'emerald' | 'amber' | 'red';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  highlightColor = 'blue',
  onClick
}) => {
  const colorMap = {
    blue: 'border-l-brand-500 bg-brand-50/20 dark:bg-brand-950/20',
    cyan: 'border-l-cyan-500 bg-cyan-50/20 dark:bg-cyan-950/20',
    emerald: 'border-l-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20',
    amber: 'border-l-amber-500 bg-amber-50/20 dark:bg-amber-950/20',
    red: 'border-l-red-500 bg-red-50/20 dark:bg-red-950/20',
  };

  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 p-5 shadow-card dark:shadow-card-dark transition-all duration-200 hover:shadow-md border-l-4 ${colorMap[highlightColor]} ${onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {value}
            </h3>
            {subtitle && (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className="rounded-lg p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          {trend.direction === 'up' && (
            <span className={`inline-flex items-center font-semibold ${
              trend.isPositiveGood === false ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" />
              {trend.value}
            </span>
          )}
          {trend.direction === 'down' && (
            <span className={`inline-flex items-center font-semibold ${
              trend.isPositiveGood === false ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`}>
              <ArrowDownRight className="mr-0.5 h-3.5 w-3.5" />
              {trend.value}
            </span>
          )}
          {trend.direction === 'neutral' && (
            <span className="inline-flex items-center font-semibold text-slate-500 dark:text-slate-400">
              <Minus className="mr-0.5 h-3.5 w-3.5" />
              {trend.value}
            </span>
          )}
          {trend.label && (
            <span className="text-slate-500 dark:text-slate-400">
              {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
