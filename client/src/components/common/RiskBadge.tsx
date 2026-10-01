import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ 
  level, 
  score, 
  showScore = false,
  size = 'md' 
}) => {
  const normalizedLevel = (level || 'low').toLowerCase() as RiskLevel;

  const config = {
    critical: {
      bg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
      dot: 'bg-red-500',
      label: 'Critical Risk',
      ping: 'bg-red-400'
    },
    high: {
      bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
      dot: 'bg-orange-500',
      label: 'High Risk',
      ping: 'bg-orange-400'
    },
    moderate: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      dot: 'bg-amber-500',
      label: 'Moderate Risk',
      ping: 'bg-amber-400'
    },
    low: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-500',
      label: 'Low Risk',
      ping: 'bg-emerald-400'
    }
  }[normalizedLevel] || {
    bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-500',
    label: 'Low Risk',
    ping: 'bg-emerald-400'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs font-semibold px-2.5 py-1 gap-2',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2.5'
  }[size];

  return (
    <span 
      className={`inline-flex items-center rounded-full border transition-colors ${config.bg} ${sizeClasses}`}
      role="status"
      aria-label={`Risk level: ${config.label}${score !== undefined ? `, Score: ${score}` : ''}`}
    >
      <span className="relative flex h-2 w-2">
        {(normalizedLevel === 'critical' || normalizedLevel === 'high') && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.ping}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
      </span>
      <span>
        {config.label}
        {showScore && score !== undefined && (
          <span className="ml-1 opacity-80 font-mono">({score})</span>
        )}
      </span>
    </span>
  );
};
