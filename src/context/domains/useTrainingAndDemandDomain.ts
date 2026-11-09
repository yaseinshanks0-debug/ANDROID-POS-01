/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  AppNavTab,
  AppSettings,
  BranchRecord,
  CompanyProfile,
  POSUser,
  Product,
  StockMovement,
  Transaction,
  WorkspaceMode,
  OnboardingChecklistStatus,
} from '../../lib/types';
import {
  TRAINING_TOUR_STORAGE_KEY,
  TRAINING_TOUR_STEPS,
  TrainingTourProgressState,
  createInitialTourProgress,
  clampTourStepIndex,
  markTourStepVisited,
  markTourCompleted,
  getUserTourStorageKey,
  computeOnboardingChecklistStatus,
} from '../../lib/training-tour';
import {
  UnmetDemandRequestInput,
  UnmetDemandRequestRecord,
} from '../../analytics/analytics.types';
import {
  UnmetDemandValidationResult,
  validateAndBuildUnmetDemandRequest,
} from '../../analytics/unmet-demand.validation';
import { playSuccessChime, triggerHaptic } from '../../lib/sound-fx';

interface UseTrainingAndDemandDomainParams {
  currentUser: POSUser;
  currentCompany: CompanyProfile;
  exchangeRates: Record<string, number>;
  branches: BranchRecord[];
  products: Product[];
  users: POSUser[];
  transactions: Transaction[];
  stockMovements: StockMovement[];
  settings: AppSettings;
  workspaceMode: WorkspaceMode;
  setActiveTab: React.Dispatch<React.SetStateAction<AppNavTab>>;
  unmetDemandRequests: UnmetDemandRequestRecord[];
  setUnmetDemandRequests: React.Dispatch<React.SetStateAction<UnmetDemandRequestRecord[]>>;
}

export function useTrainingAndDemandDomain({
  currentUser,
  currentCompany,
  exchangeRates,
  branches,
  products,
  users,
  transactions,
  stockMovements,
  settings,
  workspaceMode,
  setActiveTab,
  unmetDemandRequests,
  setUnmetDemandRequests,
}: UseTrainingAndDemandDomainParams) {
  const [isUnmetDemandModalOpen, setIsUnmetDemandModalOpen] = useState(false);
  const [unmetDemandModalInitialData, setUnmetDemandModalInitialData] =
    useState<Partial<UnmetDemandRequestInput> | null>(null);

  const userTourStorageKey = useMemo(
    () => getUserTourStorageKey(currentUser?.id, currentCompany?.id),
    [currentUser?.id, currentCompany?.id]
  );

  const [trainingTourProgress, setTrainingTourProgress] = useState<TrainingTourProgressState>(() => {
    try {
      const saved =
        localStorage.getItem(getUserTourStorageKey(currentUser?.id, currentCompany?.id)) ||
        localStorage.getItem(TRAINING_TOUR_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.completedStepIds)) {
          return parsed;
        }
      }
    } catch {}
    return createInitialTourProgress();
  });

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(userTourStorageKey) ||
        localStorage.getItem(TRAINING_TOUR_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.completedStepIds)) {
          setTrainingTourProgress(parsed);
          return;
        }
      }
    } catch {}
  }, [userTourStorageKey]);

  const [isTrainingTourOpen, setIsTrainingTourOpen] = useState(false);
  const [trainingTourStepIndex, setTrainingTourStepIndex] = useState<number>(() =>
    clampTourStepIndex(trainingTourProgress.lastStepIndex || 0, TRAINING_TOUR_STEPS.length)
  );

  useEffect(() => {
    try {
      localStorage.setItem(userTourStorageKey, JSON.stringify(trainingTourProgress));
      localStorage.setItem(TRAINING_TOUR_STORAGE_KEY, JSON.stringify(trainingTourProgress));
    } catch {}
  }, [trainingTourProgress, userTourStorageKey]);

  const onboardingChecklist = useMemo<OnboardingChecklistStatus>(() => {
    return computeOnboardingChecklistStatus({
      companyProfileConfigured: Boolean(
        currentCompany?.legalName && currentCompany?.onboardingCompleted !== false
      ),
      currenciesConfigured: Boolean(
        currentCompany?.baseCurrency === 'SDG' && Object.keys(exchangeRates || {}).length > 1
      ),
      branchCreated: branches.length > 0,
      productsCount: products.length,
      employeesCount: users.filter((u) => u.isActive !== false).length,
      salesCount: transactions.filter((t) => t.status === 'completed').length,
      inventoryReviewed: stockMovements.length > 0,
      guidedTourCompleted: Boolean(trainingTourProgress.isCompleted),
    });
  }, [
    currentCompany,
    exchangeRates,
    branches.length,
    products.length,
    users,
    transactions,
    stockMovements.length,
    trainingTourProgress.isCompleted,
  ]);

  const startTrainingTour = useCallback(
    (stepIndex = 0) => {
      const safeIdx = clampTourStepIndex(stepIndex, TRAINING_TOUR_STEPS.length);
      setTrainingTourStepIndex(safeIdx);
      setTrainingTourProgress((prev) => markTourStepVisited(prev, safeIdx, TRAINING_TOUR_STEPS));
      const targetTab = TRAINING_TOUR_STEPS[safeIdx]?.tab;
      if (targetTab) {
        setActiveTab(targetTab);
      }
      setIsTrainingTourOpen(true);
    },
    [setActiveTab]
  );

  const closeTrainingTour = useCallback(() => {
    setIsTrainingTourOpen(false);
  }, []);

  const selectTrainingTourStep = useCallback(
    (stepIndex: number) => {
      const safeIdx = clampTourStepIndex(stepIndex, TRAINING_TOUR_STEPS.length);
      setTrainingTourStepIndex(safeIdx);
      setTrainingTourProgress((prev) => markTourStepVisited(prev, safeIdx, TRAINING_TOUR_STEPS));
      const targetTab = TRAINING_TOUR_STEPS[safeIdx]?.tab;
      if (targetTab) {
        setActiveTab(targetTab);
      }
    },
    [setActiveTab]
  );

  const nextTrainingTourStep = useCallback(() => {
    setTrainingTourStepIndex((prevIdx) => {
      const nextIdx = clampTourStepIndex(prevIdx + 1, TRAINING_TOUR_STEPS.length);
      setTrainingTourProgress((prevProg) =>
        markTourStepVisited(prevProg, nextIdx, TRAINING_TOUR_STEPS)
      );
      const targetTab = TRAINING_TOUR_STEPS[nextIdx]?.tab;
      if (targetTab) {
        setActiveTab(targetTab);
      }
      return nextIdx;
    });
  }, [setActiveTab]);

  const prevTrainingTourStep = useCallback(() => {
    setTrainingTourStepIndex((prevIdx) => {
      const prevStep = clampTourStepIndex(prevIdx - 1, TRAINING_TOUR_STEPS.length);
      setTrainingTourProgress((prevProg) =>
        markTourStepVisited(prevProg, prevStep, TRAINING_TOUR_STEPS)
      );
      const targetTab = TRAINING_TOUR_STEPS[prevStep]?.tab;
      if (targetTab) {
        setActiveTab(targetTab);
      }
      return prevStep;
    });
  }, [setActiveTab]);

  const finishTrainingTour = useCallback(() => {
    setTrainingTourProgress((prev) => markTourCompleted(prev, TRAINING_TOUR_STEPS));
    setIsTrainingTourOpen(false);
    playSuccessChime(settings.soundEnabled);
    triggerHaptic('success', settings.hapticsEnabled);
  }, [settings.soundEnabled, settings.hapticsEnabled]);

  const resetTrainingTour = useCallback(() => {
    const fresh = createInitialTourProgress();
    setTrainingTourProgress(fresh);
    setTrainingTourStepIndex(0);
  }, []);

  const openUnmetDemandModal = useCallback(
    (initial?: Partial<UnmetDemandRequestInput>) => {
      setUnmetDemandModalInitialData(initial || null);
      setIsUnmetDemandModalOpen(true);
      triggerHaptic('light', settings.hapticsEnabled);
    },
    [settings.hapticsEnabled]
  );

  const closeUnmetDemandModal = useCallback(() => {
    setIsUnmetDemandModalOpen(false);
    setUnmetDemandModalInitialData(null);
  }, []);

  const recordUnmetDemandRequest = useCallback(
    async (
      input: Partial<UnmetDemandRequestInput>
    ): Promise<UnmetDemandValidationResult> => {
      const validation = validateAndBuildUnmetDemandRequest(input, {
        authenticatedUser: currentUser,
        products,
        existingRequests: unmetDemandRequests,
        activeCurrency: settings.currency || 'SDG',
        exchangeRates,
      });

      if (!validation.ok || !validation.record) {
        triggerHaptic('warning', settings.hapticsEnabled);
        return validation;
      }

      if (!validation.isDuplicateRapidSubmission) {
        const newRecord = validation.record;
        setUnmetDemandRequests((prev) => [newRecord, ...prev]);

        if (
          workspaceMode === 'PRODUCTION' &&
          currentUser.id &&
          currentUser.id !== 'unassigned-operator'
        ) {
          fetch('/api/unmet-demand/requests', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': currentUser.id,
            },
            body: JSON.stringify({
              ...input,
              idempotencyKey: newRecord.idempotencyKey,
            }),
          }).catch(() => {});
        }
      }

      playSuccessChime(settings.soundEnabled);
      triggerHaptic('success', settings.hapticsEnabled);
      return validation;
    },
    [
      workspaceMode,
      currentUser,
      products,
      unmetDemandRequests,
      settings.currency,
      settings.soundEnabled,
      settings.hapticsEnabled,
      exchangeRates,
      setUnmetDemandRequests,
    ]
  );

  return {
    onboardingChecklist,
    isTrainingTourOpen,
    trainingTourStepIndex,
    trainingTourProgress,
    startTrainingTour,
    closeTrainingTour,
    nextTrainingTourStep,
    prevTrainingTourStep,
    selectTrainingTourStep,
    finishTrainingTour,
    resetTrainingTour,
    isUnmetDemandModalOpen,
    unmetDemandModalInitialData,
    openUnmetDemandModal,
    closeUnmetDemandModal,
    recordUnmetDemandRequest,
  };
}
