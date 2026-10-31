/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { playTactileClick, triggerHaptic } from '../../lib/sound-fx';

export type DynamicButtonStatus = 'ready' | 'processing' | 'success' | 'error';

export interface DynamicButtonProps {
  status: DynamicButtonStatus;
  onClick?: () => void;
  readyLabel: string;
  readyIcon?: React.ReactNode;
  processingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  className?: string;
  variant?: 'emerald' | 'amber' | 'primary' | 'danger';
  disabled?: boolean;
}

export const DynamicButton: React.FC<DynamicButtonProps> = ({
  status,
  onClick,
  readyLabel,
  readyIcon,
  processingLabel = 'Processing...',
  successLabel = 'Completed!',
  errorLabel = 'Failed - Tap to Retry',
  className = '',
  variant = 'emerald',
  disabled = false,
}) => {
  const handleClick = () => {
    if (disabled || status === 'processing') return;
    playTactileClick();
    triggerHaptic('medium');
    onClick?.();
  };

  const variantStyles = {
    emerald: {
      ready: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_4px_0_0_#065f46,0_8px_16px_rgba(16,185,129,0.3)]',
      processing: 'bg-emerald-700 text-emerald-100 shadow-[0_2px_0_0_#065f46]',
      success: 'bg-emerald-500 text-white shadow-[0_4px_0_0_#047857,0_8px_20px_rgba(16,185,129,0.4)]',
      error: 'bg-rose-600 text-white shadow-[0_4px_0_0_#9f1239]',
    },
    amber: {
      ready: 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-[0_4px_0_0_#b45309,0_8px_16px_rgba(245,158,11,0.25)]',
      processing: 'bg-amber-600 text-neutral-950 shadow-[0_2px_0_0_#b45309]',
      success: 'bg-emerald-500 text-white shadow-[0_4px_0_0_#047857]',
      error: 'bg-rose-600 text-white shadow-[0_4px_0_0_#9f1239]',
    },
    primary: {
      ready: 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-[0_4px_0_0_#171717,0_8px_16px_rgba(0,0,0,0.35)]',
      processing: 'bg-neutral-800 text-neutral-300 shadow-[0_2px_0_0_#171717]',
      success: 'bg-emerald-600 text-white shadow-[0_4px_0_0_#047857]',
      error: 'bg-rose-600 text-white shadow-[0_4px_0_0_#9f1239]',
    },
    danger: {
      ready: 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_4px_0_0_#9f1239,0_8px_16px_rgba(244,63,94,0.3)]',
      processing: 'bg-rose-700 text-rose-100 shadow-[0_2px_0_0_#9f1239]',
      success: 'bg-emerald-600 text-white shadow-[0_4px_0_0_#047857]',
      error: 'bg-rose-700 text-white shadow-[0_2px_0_0_#9f1239]',
    },
  }[variant];

  return (
    <motion.button
      layout
      transition={{
        type: 'spring',
        stiffness: 450,
        damping: 32,
        mass: 0.8,
      }}
      disabled={disabled || status === 'processing'}
      onClick={handleClick}
      whileTap={{ y: 2 }}
      className={`relative inline-flex items-center justify-center min-h-[50px] px-6 py-3 rounded-2xl font-semibold text-sm transition-colors duration-150 border border-white/10 select-none overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
        variantStyles[status]
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {status === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 12, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(2px)' }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            {readyIcon && <span className="shrink-0">{readyIcon}</span>}
            <span className="tracking-tight">{readyLabel}</span>
          </motion.div>
        )}

        {status === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 12, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(2px)' }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
            <span className="tracking-tight">{processingLabel}</span>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(2px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(2px)' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Check className="w-4 h-4 stroke-[2.5] text-current shrink-0" />
            <span className="tracking-tight">{successLabel}</span>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(2px)' }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <AlertCircle className="w-4 h-4 text-current shrink-0" />
            <span className="tracking-tight">{errorLabel}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
