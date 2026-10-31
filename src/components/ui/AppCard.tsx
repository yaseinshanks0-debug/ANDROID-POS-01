/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface AppCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'elevated' | 'sunken' | 'borderless';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  isInteractive?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  className = '',
  variant = 'surface',
  padding = 'md',
  isInteractive = false,
  ...props
}) => {
  const variantStyles = {
    surface: 'bg-neutral-900/90 border border-neutral-800/80 shadow-sm',
    elevated: 'bg-neutral-900 border border-neutral-750 shadow-md shadow-black/20',
    sunken: 'bg-neutral-950/80 border border-neutral-850 shadow-inner',
    borderless: 'bg-neutral-900/50',
  }[variant];

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-6',
  }[padding];

  const interactiveStyles = isInteractive
    ? 'hover:border-neutral-700 active:scale-[0.99] transition-all cursor-pointer'
    : '';

  return (
    <div
      className={`rounded-2xl backdrop-blur-sm ${variantStyles} ${paddingStyles} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
