/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';
import { isDynamicImportError } from '../../lib/lazy-import';

export interface ViewErrorBoundaryProps {
  children: ReactNode;
  language?: 'en' | 'ar';
  resetKey?: string;
}

interface ViewErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Scoped error boundary around lazy-loaded POS views and modals.
 * Automatically resets when the user switches tabs (`resetKey`) and provides
 * one-tap Retry and Reload recovery actions without crashing the whole POS shell.
 */
export class ViewErrorBoundary extends Component<ViewErrorBoundaryProps, ViewErrorBoundaryState> {
  public constructor(props: ViewErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ViewErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidUpdate(prevProps: ViewErrorBoundaryProps): void {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null });
    }
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('POS view rendering/loading error:', error, info.componentStack);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  private handleReload = (): void => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const isAr = this.props.language === 'ar';
    const isChunkError = isDynamicImportError(this.state.error);

    return (
      <div
        dir={isAr ? 'rtl' : 'ltr'}
        className="flex-1 flex items-center justify-center p-6"
        role="alert"
      >
        <div className="max-w-md w-full rounded-2xl bg-neutral-900 border border-neutral-800 p-6 text-center shadow-xl space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-base font-bold text-white">
              {isChunkError
                ? isAr
                  ? 'تعذر تحميل هذه الشاشة مؤقتاً'
                  : 'Unable to load this screen right now'
                : isAr
                ? 'حدث خطأ غير متوقع في هذه الشاشة'
                : 'Something went wrong in this view'}
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {isChunkError
                ? isAr
                  ? 'ربما تم تحديث التطبيق أو انقطع الاتصال مؤقتاً. اضغط على إعادة المحاولة أو تحديث الصفحة.'
                  : 'The app may have been updated or the connection briefly dropped. Try again or reload the page.'
                : isAr
                ? 'يمكنك إعادة المحاولة أو تحديث الصفحة دون فقدان بياناتك المحفوظة.'
                : 'You can retry loading this view or reload the page safely without losing saved data.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={this.handleRetry}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
            </button>

            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700 font-semibold text-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isAr ? 'تحديث الصفحة' : 'Reload Page'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
