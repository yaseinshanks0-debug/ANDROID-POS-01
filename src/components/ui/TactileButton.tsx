/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { playTactileClick, triggerHaptic } from '../../lib/sound-fx';

export interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'emerald' | 'amber' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disableTactileFeedback?: boolean;
}

export const TactileButton = forwardRef<HTMLButtonElement, TactileButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      disableTactileFeedback = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;
      if (!disableTactileFeedback) {
        playTactileClick();
        triggerHaptic('light');
      }
      onClick?.(e);
    };

    // Size presets with touch hitboxes >= 44px on mobile
    const sizeClasses = {
      sm: 'h-9 px-3 text-xs gap-1.5 rounded-lg',
      md: 'h-11 px-4 text-sm gap-2 rounded-xl min-h-[44px]',
      lg: 'h-13 px-5 text-base gap-2.5 rounded-xl min-h-[48px]',
      xl: 'h-15 px-6 text-lg gap-3 rounded-2xl min-h-[56px] font-semibold',
      icon: 'w-11 h-11 min-h-[44px] min-w-[44px] p-0 flex items-center justify-center rounded-xl',
    }[size];

    // Dqnamo Kitchen Tactile depth & border styles
    const variantClasses = {
      primary:
        'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700/80 shadow-[0_3px_0_0_#171717,0_6px_10px_rgba(0,0,0,0.3)] active:shadow-[0_1px_0_0_#171717,0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-[2px]',
      secondary:
        'bg-neutral-800/90 hover:bg-neutral-750 text-neutral-200 border border-neutral-700/60 shadow-[0_3px_0_0_#262626,0_4px_8px_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_0_#262626] active:translate-y-[2px]',
      emerald:
        'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/30 shadow-[0_3px_0_0_#065f46,0_6px_14px_rgba(16,185,129,0.3)] active:shadow-[0_1px_0_0_#065f46] active:translate-y-[2px]',
      amber:
        'bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold border border-amber-300/40 shadow-[0_3px_0_0_#b45309,0_6px_14px_rgba(245,158,11,0.25)] active:shadow-[0_1px_0_0_#b45309] active:translate-y-[2px]',
      danger:
        'bg-rose-600 hover:bg-rose-500 text-white border border-rose-400/30 shadow-[0_3px_0_0_#9f1239,0_6px_14px_rgba(244,63,94,0.3)] active:shadow-[0_1px_0_0_#9f1239] active:translate-y-[2px]',
      ghost:
        'bg-transparent hover:bg-neutral-800/60 text-neutral-300 border border-transparent active:bg-neutral-800/80 active:translate-y-[1px]',
    }[variant];

    const disabledClasses =
      disabled || isLoading
        ? 'opacity-40 cursor-not-allowed pointer-events-none transform-none shadow-none active:translate-y-0'
        : 'cursor-pointer select-none';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        onClick={handleClick}
        className={`relative inline-flex items-center justify-center font-medium transition-all duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span className="truncate">{children}</span>}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

TactileButton.displayName = 'TactileButton';
