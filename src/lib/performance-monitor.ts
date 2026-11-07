/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

export interface PerformanceMetricsSnapshot {
  fcpMs: number | null;
  lcpMs: number | null;
  clsScore: number;
  domInteractiveMs: number | null;
  loadCompleteMs: number | null;
  effectiveNetworkType: string;
  saveData: boolean;
  hardwareConcurrency: number;
  isLowEndDevice: boolean;
  apiTimings: Array<{ url: string; durationMs: number; status: number; timestamp: number }>;
}

declare global {
  interface Window {
    __DQNAMO_PERF_METRICS__?: PerformanceMetricsSnapshot;
  }
}

/**
 * Detects whether the client is running on a budget mobile CPU or a constrained 2G/3G network.
 */
export function isLowEndOrSlowNetwork(): boolean {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 4;
  const conn = (navigator as any).connection;
  const effectiveType = String(conn?.effectiveType || '4g').toLowerCase();
  const saveData = Boolean(conn?.saveData);

  return (
    saveData ||
    cores <= 2 ||
    memory <= 2 ||
    effectiveType === 'slow-2g' ||
    effectiveType === '2g' ||
    effectiveType === '3g'
  );
}

/**
 * Debounces rapidly changing values (such as search inputs or filter queries).
 * Automatically clears immediately when value is emptied so "Clear Search" feels instant.
 */
export function useDebouncedValue<T>(value: T, delayMs = 140): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    if (value === '' || value === null || value === undefined) {
      setDebouncedValue(value);
      return;
    }
    const adaptiveDelay = isLowEndOrSlowNetwork() ? Math.max(delayMs, 220) : delayMs;
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, adaptiveDelay);

    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}

/**
 * Schedules non-urgent work (such as large LocalStorage JSON serialization) during browser idle frames.
 */
export function scheduleIdleTask(callback: () => void, timeoutMs = 400): () => void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    const id = (window as any).requestIdleCallback(callback, { timeout: timeoutMs });
    return () => (window as any).cancelIdleCallback?.(id);
  }
  const timer = setTimeout(callback, 60);
  return () => clearTimeout(timer);
}

/**
 * Compresses an uploaded image file to WebP (with automatic JPEG fallback) and resizes to maxDim.
 */
export function compressImageToOptimalDataUrl(
  file: File,
  maxDim = 360,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onerror = () => resolve(dataUrl);
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Prefer WebP for 30-45% smaller payload; fall back to JPEG if browser lacks WebP encoder
          const webpUrl = canvas.toDataURL('image/webp', quality);
          if (webpUrl.startsWith('data:image/webp')) {
            resolve(webpUrl);
            return;
          }
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch {
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Records API call timing into the Real User Monitoring (RUM) ring buffer.
 */
export function recordApiTiming(url: string, durationMs: number, status: number): void {
  if (typeof window === 'undefined' || !window.__DQNAMO_PERF_METRICS__) return;
  const list = window.__DQNAMO_PERF_METRICS__.apiTimings;
  list.push({
    url,
    durationMs: Math.round(durationMs * 100) / 100,
    status,
    timestamp: Date.now(),
  });
  if (list.length > 50) {
    list.shift();
  }
}

/**
 * Initializes lightweight Real User Monitoring (RUM) for Core Web Vitals (FCP, LCP, CLS)
 * and Navigation Timing without external third-party scripts.
 */
export function initRealUserMonitoring(): void {
  if (typeof window === 'undefined' || window.__DQNAMO_PERF_METRICS__) return;

  const conn = (navigator as any).connection;
  const metrics: PerformanceMetricsSnapshot = {
    fcpMs: null,
    lcpMs: null,
    clsScore: 0,
    domInteractiveMs: null,
    loadCompleteMs: null,
    effectiveNetworkType: String(conn?.effectiveType || '4g'),
    saveData: Boolean(conn?.saveData),
    hardwareConcurrency: navigator.hardwareConcurrency || 4,
    isLowEndDevice: isLowEndOrSlowNetwork(),
    apiTimings: [],
  };

  window.__DQNAMO_PERF_METRICS__ = metrics;

  try {
    if ('PerformanceObserver' in window) {
      // First Contentful Paint (FCP)
      const paintObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            metrics.fcpMs = Math.round(entry.startTime);
          }
        }
      });
      paintObserver.observe({ type: 'paint', buffered: true });

      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          metrics.lcpMs = Math.round(lastEntry.startTime);
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as any[]) {
          if (!entry.hadRecentInput && typeof entry.value === 'number') {
            metrics.clsScore = Math.round((metrics.clsScore + entry.value) * 10000) / 10000;
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    }

    window.addEventListener(
      'load',
      () => {
        setTimeout(() => {
          const nav = performance.getEntriesByType('navigation')[0] as
            | PerformanceNavigationTiming
            | undefined;
          if (nav) {
            metrics.domInteractiveMs = Math.round(nav.domInteractive);
            metrics.loadCompleteMs = Math.round(nav.loadEventEnd || performance.now());
          }
        }, 0);
      },
      { once: true }
    );
  } catch {
    // Ignore unsupported observer types on older WebViews
  }
}
