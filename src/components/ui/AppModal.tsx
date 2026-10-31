/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { TactileButton } from './TactileButton';

export interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  asSheetOnMobile?: boolean;
}

export const AppModal: React.FC<AppModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
  asSheetOnMobile = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-4xl',
  }[maxWidth];

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={asSheetOnMobile ? { opacity: 0, y: 40 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={asSheetOnMobile ? { opacity: 0, y: 40 } : { opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className={`relative z-10 w-full ${maxWidthClass} bg-neutral-900 border border-neutral-800 text-neutral-100 shadow-2xl flex flex-col max-h-[90vh] ${
              asSheetOnMobile
                ? 'max-md:mt-auto max-md:rounded-t-3xl max-md:border-b-0 rounded-2xl'
                : 'rounded-2xl'
            }`}
            role="dialog"
            aria-modal="true"
          >
            {/* Mobile Sheet Drag Handle */}
            {asSheetOnMobile && (
              <div className="md:hidden pt-3 pb-1 flex justify-center">
                <div className="w-10 h-1 bg-neutral-700 rounded-full" />
              </div>
            )}

            {/* Header */}
            {(title || description) && (
              <div className="flex items-start justify-between p-5 pb-3 border-b border-neutral-800/80">
                <div className="pr-4">
                  {title && (
                    <h3 className="text-base sm:text-lg font-bold text-neutral-100 tracking-tight">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-xs text-neutral-400 mt-0.5">{description}</p>
                  )}
                </div>
                <TactileButton
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 min-h-[32px] min-w-[32px] text-neutral-400 hover:text-white rounded-lg -mt-1 -mr-2"
                  onClick={onClose}
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </TactileButton>
              </div>
            )}

            {/* Body */}
            <div className="p-5 overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document !== 'undefined' && document.body) {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
};
