/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { playHoldTick, triggerHaptic, playTactileClick } from '../../lib/sound-fx';

export interface HoldToConfirmProps {
  onConfirm: () => void;
  label: string;
  confirmingLabel?: string;
  confirmedLabel?: string;
  holdDurationMs?: number;
  variant?: 'danger' | 'warning' | 'primary';
  icon?: React.ReactNode;
  allowUndo?: boolean;
  undoDurationSeconds?: number;
  onUndo?: () => void;
  className?: string;
  disabled?: boolean;
}

export const HoldToConfirm: React.FC<HoldToConfirmProps> = ({
  onConfirm,
  label,
  confirmingLabel = 'Hold to confirm...',
  confirmedLabel = 'Confirmed',
  holdDurationMs = 1200,
  variant = 'danger',
  icon = <AlertTriangle className="w-4 h-4" />,
  allowUndo = true,
  undoDurationSeconds = 4,
  onUndo,
  className = '',
  disabled = false,
}) => {
  const [progress, setProgress] = useState(0); // 0 to 1
  const [isHolding, setIsHolding] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isUndoPeriod, setIsUndoPeriod] = useState(false);
  const [undoSecondsLeft, setUndoSecondsLeft] = useState(undoDurationSeconds);

  const startTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const undoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const undoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const cancelHold = useCallback(() => {
    if (isConfirmed) return;
    setIsHolding(false);
    startTimeRef.current = null;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setProgress(0);
  }, [isConfirmed]);

  const executeConfirmedAction = useCallback(() => {
    setIsConfirmed(true);
    setIsHolding(false);
    setProgress(1);
    triggerHaptic('success');

    if (allowUndo) {
      setIsUndoPeriod(true);
      setUndoSecondsLeft(undoDurationSeconds);

      undoIntervalRef.current = setInterval(() => {
        setUndoSecondsLeft((prev) => Math.max(0, prev - 1));
      }, 1000);

      undoTimerRef.current = setTimeout(() => {
        setIsUndoPeriod(false);
        setIsConfirmed(false);
        setProgress(0);
        onConfirm();
      }, undoDurationSeconds * 1000);
    } else {
      onConfirm();
      setTimeout(() => {
        setIsConfirmed(false);
        setProgress(0);
      }, 1500);
    }
  }, [allowUndo, onConfirm, undoDurationSeconds]);

  const startHold = () => {
    if (disabled || isConfirmed || isUndoPeriod) return;
    setIsHolding(true);
    playTactileClick();
    triggerHaptic('medium');
    startTimeRef.current = performance.now();

    const updateLoop = (now: number) => {
      if (!startTimeRef.current) return;
      const elapsed = now - startTimeRef.current;
      const rawProgress = Math.min(1, elapsed / holdDurationMs);
      setProgress(rawProgress);

      if (rawProgress > 0 && Math.floor(rawProgress * 10) > Math.floor((rawProgress - 0.05) * 10)) {
        playHoldTick(rawProgress);
        triggerHaptic('light');
      }

      if (rawProgress >= 1) {
        executeConfirmedAction();
      } else {
        animFrameRef.current = requestAnimationFrame(updateLoop);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);
  };

  const handleUndo = () => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
    setIsUndoPeriod(false);
    setIsConfirmed(false);
    setProgress(0);
    playTactileClick();
    triggerHaptic('medium');
    onUndo?.();
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
    };
  }, []);

  const variantBorder = {
    danger: 'border-rose-500/40 hover:border-rose-400 bg-neutral-900',
    warning: 'border-amber-500/40 hover:border-amber-400 bg-neutral-900',
    primary: 'border-neutral-700 hover:border-neutral-500 bg-neutral-900',
  }[variant];

  const fillBg = {
    danger: 'bg-rose-600/80',
    warning: 'bg-amber-600/80',
    primary: 'bg-neutral-700/90',
  }[variant];

  if (isUndoPeriod) {
    return (
      <div className={`relative flex items-center justify-between gap-3 p-2.5 px-4 bg-neutral-900 border border-amber-500/40 rounded-2xl ${className}`}>
        <div className="flex items-center gap-2 text-xs font-medium text-amber-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Action triggered. Executing in {undoSecondsLeft}s</span>
        </div>
        <button
          onClick={handleUndo}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-xl shadow-sm active:scale-95 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Undo</span>
        </button>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      onTouchCancel={cancelHold}
      className={`relative overflow-hidden select-none cursor-pointer rounded-2xl border min-h-[46px] px-4 py-2.5 flex items-center justify-center transition-all duration-150 active:scale-[0.98] ${variantBorder} ${
        disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
      } ${className}`}
    >
      {/* Background Fill Progress Bar */}
      <motion.div
        className={`absolute inset-0 ${fillBg} origin-left pointer-events-none`}
        style={{ width: `${progress * 100}%` }}
        transition={{ ease: 'linear', duration: 0 }}
      />

      {/* Button Content */}
      <div className="relative z-10 flex items-center gap-2 text-sm font-semibold tracking-tight text-white">
        <AnimatePresence mode="wait">
          {isConfirmed ? (
            <motion.div
              key="confirmed"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-emerald-400"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{confirmedLabel}</span>
            </motion.div>
          ) : isHolding ? (
            <motion.div
              key="holding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>{confirmingLabel} ({Math.round(progress * 100)}%)</span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-rose-400 shrink-0">{icon}</span>
              <span>{label}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
