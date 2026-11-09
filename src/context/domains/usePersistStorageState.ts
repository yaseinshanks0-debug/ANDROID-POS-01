/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { WorkspaceMode } from '../../lib/types';
import {
  persistCompanyScopedSlice,
  persistStorageValue,
} from '../pos-storage-helpers';

export interface UsePersistCompanyScopedSliceOptions<T> {
  value: T;
  workspaceMode: WorkspaceMode;
  currentCompanyId: string;
  prodBaseKey: string;
  practiceKey?: string;
  mirrorGlobalProdKey?: boolean;
  onAfterPersist?: (value: T) => void;
}

/**
 * Unified hook that persists a company-scoped (or practice-mode) state slice to `localStorage`
 * and optionally triggers a secondary side-effect (such as SQLite outbox or currency helper sync).
 */
export function usePersistCompanyScopedSlice<T>({
  value,
  workspaceMode,
  currentCompanyId,
  prodBaseKey,
  practiceKey,
  mirrorGlobalProdKey = true,
  onAfterPersist,
}: UsePersistCompanyScopedSliceOptions<T>): void {
  useEffect(() => {
    persistCompanyScopedSlice({
      value,
      workspaceMode,
      currentCompanyId,
      prodBaseKey,
      practiceKey,
      mirrorGlobalProdKey,
    });
    if (onAfterPersist) {
      onAfterPersist(value);
    }
  }, [value, workspaceMode, currentCompanyId, prodBaseKey, practiceKey, mirrorGlobalProdKey]);
}

export interface UsePersistStorageValueOptions<T> {
  rawString?: boolean;
  enabled?: boolean;
  onAfterPersist?: (value: T) => void;
}

/**
 * Unified hook that persists a standalone key/value to `localStorage`.
 */
export function usePersistStorageValue<T>(
  key: string,
  value: T,
  options?: UsePersistStorageValueOptions<T>
): void {
  const rawString = options?.rawString;
  const enabled = options?.enabled;
  const onAfterPersist = options?.onAfterPersist;

  useEffect(() => {
    persistStorageValue(key, value, { rawString, enabled });
    if (enabled !== false && onAfterPersist) {
      onAfterPersist(value);
    }
  }, [key, value, rawString, enabled]);
}
