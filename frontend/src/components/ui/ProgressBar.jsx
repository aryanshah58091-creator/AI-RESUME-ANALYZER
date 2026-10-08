import React from 'react';
import { cn } from './Card';

export function ProgressBar({ value, max = 100, color = 'green', className }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const colors = {
    green: 'bg-brand-green shadow-neon-green',
    teal: 'bg-brand-teal shadow-neon-teal',
    purple: 'bg-brand-purple',
    red: 'bg-brand-red'
  };

  return (
    <div className={cn("w-full bg-dark-600 rounded-full h-1.5 overflow-hidden", className)}>
      <div 
        className={cn("h-full rounded-full transition-all duration-500 ease-out", colors[color] || colors.green)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
