/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface AppBadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'amber';
  size?: 'sm' | 'md';
  className?: string;
}

export const AppBadge: React.FC<AppBadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    neutral: 'bg-neutral-800/80 text-neutral-300 border border-neutral-700/60',
    success: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50',
    warning: 'bg-amber-950/60 text-amber-400 border border-amber-800/50',
    danger: 'bg-rose-950/60 text-rose-400 border border-rose-800/50',
    amber: 'bg-amber-500/10 text-amber-300 border border-amber-500/30',
  }[variant];

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-lg font-medium',
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 ${variantStyles} ${sizeStyles} ${className}`}>
      {children}
    </span>
  );
};
