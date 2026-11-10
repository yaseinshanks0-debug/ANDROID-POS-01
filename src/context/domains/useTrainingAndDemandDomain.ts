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
  UnmetDemandFulfillmentLinkRecord,
  UnmetDemandValidationResult,
  computeUnmetDemandFulfillmentState,
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

  const fulfillUnmetDemandFromSale = useCallback(
    async (params: {
      requestId: string;
      saleId: string;
      fulfilledBaseUnits?: number;
    }): Promise<{
      ok: boolean;
      errorEn?: string;
      errorAr?: string;
      record?: UnmetDemandRequestRecord;
    }> => {
      const req = unmetDemandRequests.find((r) => r.id === params.requestId);
      if (!req) {
        return {
          ok: false,
          errorEn: 'Unmet demand request not found',
          errorAr: 'طلب المنتج غير المتوفر غير موجود',
        };
      }
      if (req.fulfillmentStatus === 'cancelled') {
        return {
          ok: false,
          errorEn: 'Cannot fulfill a cancelled request',
          errorAr: 'لا يمكن تلبية طلب ملغى',
        };
      }

      const sale = transactions.find((t) => t.id === params.saleId);
      if (!sale || sale.status !== 'completed') {
        return {
          ok: false,
          errorEn: 'Verified completed sale not found',
          errorAr: 'فاتورة البيع المكتملة غير موجودة أو ملغاة',
        };
      }

      const matchingItemIdx = sale.items.findIndex((item) =>
        req.productId
          ? item.productId === req.productId
          : item.productName.trim().toLowerCase() ===
            req.productNameSnapshot.trim().toLowerCase()
      );
      if (matchingItemIdx < 0) {
        return {
          ok: false,
          errorEn: 'Selected sale does not contain the requested product',
          errorAr: 'فاتورة البيع المختارة لا تحتوي على المنتج المطلوب',
        };
      }

      const existingFulfillments = req.fulfillments || [];
      if (
        existingFulfillments.some(
          (f) => f.saleTransactionId === sale.id && f.status === 'active'
        )
      ) {
        return {
          ok: false,
          errorEn: 'This sale is already linked to this request',
          errorAr: 'تم ربط فاتورة البيع هذه بهذا الطلب مسبقاً',
        };
      }

      const saleItem = sale.items[matchingItemIdx];
      const saleItemBaseUnits = Math.max(
        1,
        Math.round(Number(saleItem.stockDeducted || saleItem.quantity || 1))
      );
      const requestedBase = Math.max(
        1,
        Math.round(Number(req.requestedBaseUnits || req.requestedQuantity || 1))
      );
      const currentState = computeUnmetDemandFulfillmentState({
        requestedBaseUnits: requestedBase,
        fulfillments: existingFulfillments,
        isCancelled: false,
      });

      if (currentState.remainingUnfulfilledBaseUnits <= 0) {
        return {
          ok: false,
          errorEn: 'Request is already 100% fulfilled',
          errorAr: 'تمت تلبية هذا الطلب بالكامل مسبقاً',
        };
      }

      const desiredUnits =
        params.fulfilledBaseUnits && params.fulfilledBaseUnits > 0
          ? Math.round(params.fulfilledBaseUnits)
          : Math.min(saleItemBaseUnits, currentState.remainingUnfulfilledBaseUnits);
      const unitsToFulfill = Math.max(
        1,
        Math.min(
          desiredUnits,
          saleItemBaseUnits,
          currentState.remainingUnfulfilledBaseUnits
        )
      );

      const nowIso = new Date().toISOString();
      const newLink: UnmetDemandFulfillmentLinkRecord = {
        id: `udfl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        companyId: req.companyId || currentCompany?.id || 'comp-default',
        requestId: req.id,
        saleId: sale.id,
        saleTransactionId: sale.id,
        saleLineIndex: matchingItemIdx,
        branchId: req.branchId,
        productId: req.productId || saleItem.productId,
        fulfilledBaseUnits: unitsToFulfill,
        status: 'active',
        linkedByUserId: currentUser.id,
        recordedByUserId: currentUser.id,
        linkedAt: nowIso,
        fulfilledAt: nowIso,
      };

      const nextFulfillments = [...existingFulfillments, newLink];
      const nextState = computeUnmetDemandFulfillmentState({
        requestedBaseUnits: requestedBase,
        fulfillments: nextFulfillments,
        isCancelled: false,
      });

      const updatedRecord: UnmetDemandRequestRecord = {
        ...req,
        fulfilledBaseUnits: nextState.fulfilledBaseUnits,
        remainingUnfulfilledBaseUnits: nextState.remainingUnfulfilledBaseUnits,
        fulfillmentStatus: nextState.fulfillmentStatus,
        lastFulfilledAt: nextState.lastFulfilledAt,
        fulfillments: nextFulfillments,
      };

      setUnmetDemandRequests((prev) =>
        prev.map((r) => (r.id === req.id ? updatedRecord : r))
      );

      if (
        workspaceMode === 'PRODUCTION' &&
        currentUser.id &&
        currentUser.id !== 'unassigned-operator'
      ) {
        fetch(`/api/unmet-demand/requests/${encodeURIComponent(req.id)}/fulfill-from-sale`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': currentUser.id,
          },
          body: JSON.stringify({
            saleId: sale.id,
            fulfilledBaseUnits: unitsToFulfill,
          }),
        }).catch(() => {});
      }

      playSuccessChime(settings.soundEnabled);
      triggerHaptic('success', settings.hapticsEnabled);
      return { ok: true, record: updatedRecord };
    },
    [
      unmetDemandRequests,
      transactions,
      currentCompany?.id,
      currentUser.id,
      workspaceMode,
      settings.soundEnabled,
      settings.hapticsEnabled,
      setUnmetDemandRequests,
    ]
  );

  const cancelUnmetDemandRequest = useCallback(
    async (params: {
      requestId: string;
      reason: string;
    }): Promise<{
      ok: boolean;
      errorEn?: string;
      errorAr?: string;
      record?: UnmetDemandRequestRecord;
    }> => {
      const cleanReason = (params.reason || '').trim();
      if (cleanReason.length < 3) {
        return {
          ok: false,
          errorEn: 'Cancellation reason is required (min 3 characters)',
          errorAr: 'يرجى إدخال سبب واضح لإلغاء الطلب (3 أحرف على الأقل)',
        };
      }

      const req = unmetDemandRequests.find((r) => r.id === params.requestId);
      if (!req) {
        return {
          ok: false,
          errorEn: 'Unmet demand request not found',
          errorAr: 'طلب المنتج غير المتوفر غير موجود',
        };
      }

      const requestedBase = Math.max(
        1,
        Math.round(Number(req.requestedBaseUnits || req.requestedQuantity || 1))
      );
      const nextState = computeUnmetDemandFulfillmentState({
        requestedBaseUnits: requestedBase,
        fulfillments: req.fulfillments || [],
        isCancelled: true,
      });

      const updatedRecord: UnmetDemandRequestRecord = {
        ...req,
        fulfillmentStatus: nextState.fulfillmentStatus,
        fulfilledBaseUnits: nextState.fulfilledBaseUnits,
        remainingUnfulfilledBaseUnits: nextState.remainingUnfulfilledBaseUnits,
        notes: req.notes
          ? `${req.notes} | [CANCELLED: ${cleanReason}]`
          : `[CANCELLED: ${cleanReason}]`,
      };

      setUnmetDemandRequests((prev) =>
        prev.map((r) => (r.id === req.id ? updatedRecord : r))
      );

      if (
        workspaceMode === 'PRODUCTION' &&
        currentUser.id &&
        currentUser.id !== 'unassigned-operator'
      ) {
        fetch(`/api/unmet-demand/requests/${encodeURIComponent(req.id)}/cancel`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': currentUser.id,
          },
          body: JSON.stringify({
            status: 'cancelled',
            reason: cleanReason,
          }),
        }).catch(() => {});
      }

      triggerHaptic('light', settings.hapticsEnabled);
      return { ok: true, record: updatedRecord };
    },
    [
      unmetDemandRequests,
      workspaceMode,
      currentUser.id,
      settings.hapticsEnabled,
      setUnmetDemandRequests,
    ]
  );

  const reverseUnmetDemandBySale = useCallback(
    (saleId: string) => {
      if (!saleId) return;
      const nowIso = new Date().toISOString();
      setUnmetDemandRequests((prev) =>
        prev.map((req) => {
          if (
            !Array.isArray(req.fulfillments) ||
            !req.fulfillments.some(
              (f) =>
                (f.saleTransactionId === saleId || f.saleId === saleId) &&
                f.status === 'active'
            )
          ) {
            return req;
          }
          const nextLinks = req.fulfillments.map((f) =>
            (f.saleTransactionId === saleId || f.saleId === saleId) &&
            f.status === 'active'
              ? {
                  ...f,
                  status: 'reversed_by_void' as const,
                  reversedAt: nowIso,
                  reversalReferenceId: saleId,
                }
              : f
          );
          const requestedBase = Math.max(
            1,
            Math.round(Number(req.requestedBaseUnits || req.requestedQuantity || 1))
          );
          const nextState = computeUnmetDemandFulfillmentState({
            requestedBaseUnits: requestedBase,
            fulfillments: nextLinks,
            isCancelled: req.fulfillmentStatus === 'cancelled',
          });
          return {
            ...req,
            fulfillments: nextLinks,
            fulfilledBaseUnits: nextState.fulfilledBaseUnits,
            remainingUnfulfilledBaseUnits: nextState.remainingUnfulfilledBaseUnits,
            fulfillmentStatus: nextState.fulfillmentStatus,
            lastFulfilledAt: nextState.lastFulfilledAt,
          };
        })
      );

      if (
        workspaceMode === 'PRODUCTION' &&
        currentUser.id &&
        currentUser.id !== 'unassigned-operator'
      ) {
        fetch(
          `/api/unmet-demand/sales/${encodeURIComponent(saleId)}/reverse-fulfillment`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': currentUser.id,
            },
            body: JSON.stringify({ reversalType: 'void', referenceId: saleId }),
          }
        ).catch(() => {});
      }
    },
    [workspaceMode, currentUser.id, setUnmetDemandRequests]
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
    fulfillUnmetDemandFromSale,
    cancelUnmetDemandRequest,
    reverseUnmetDemandBySale,
  };
}
