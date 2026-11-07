/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const ViewSkeleton: React.FC<{ cards?: number }> = ({ cards = 6 }) => {
  return (
    <div
      data-testid="view-skeleton-loader"
      aria-busy="true"
      aria-label="Loading view"
      className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6 pb-24 animate-pulse"
    >
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-lg bg-neutral-800/80" />
          <div className="h-3.5 w-72 rounded bg-neutral-900" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-neutral-800/70" />
      </div>

      {/* KPI Metrics Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {[0, 1, 2].map((idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800/80 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 rounded bg-neutral-800" />
              <div className="h-4 w-4 rounded bg-neutral-800" />
            </div>
            <div className="h-7 w-32 rounded bg-neutral-800/90" />
            <div className="h-3 w-40 rounded bg-neutral-850" />
          </div>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: cards }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/70 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-neutral-800" />
              <div className="h-4 w-16 rounded bg-neutral-800" />
            </div>
            <div className="h-4 w-3/4 rounded bg-neutral-800" />
            <div className="h-3 w-1/2 rounded bg-neutral-850" />
            <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between">
              <div className="h-4 w-20 rounded bg-neutral-800" />
              <div className="h-7 w-16 rounded-lg bg-neutral-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
