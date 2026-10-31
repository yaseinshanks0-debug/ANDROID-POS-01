/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../services/api';
import { Currency, ExchangeRateItem } from '../../lib/types';
import { AppCard } from '../ui/AppCard';
import { AppBadge } from '../ui/AppBadge';
import { AppModal } from '../ui/AppModal';
import { TactileButton } from '../ui/TactileButton';
import { playTactileClick, playSuccessChime } from '../../lib/sound-fx';
import { usePOS } from '../../context/POSContext';
import { normalizeNumberInput, parseNormalizedNumber } from '../../lib/number-utils';
import {
  RateEditFormState,
  CURRENCY_TEMPLATES,
  resolveCurrencyInput,
  loadPersistedCurrencies,
  reconcileCurrenciesWithPersisted,
  loadPersistedExchangeRates,
  loadPersistedExchangeRateItems,
  loadPersistedRateInputs,
  savePersistedRateInputs,
  reconcileRatesWithPersisted,
  mergeEditFormsState,
} from '../../lib/exchange-rate-storage';
import {
  Coins,
  ArrowRightLeft,
  History,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  Calendar,
  Save,
  Check,
  Sparkles,
  Trash2,
  Edit2,
  X,
} from 'lucide-react';

export interface ExchangeRateSettingsProps {
  onCurrenciesUpdated?: (currencies: Currency[]) => void;
}

export const ExchangeRateSettings: React.FC<ExchangeRateSettingsProps> = ({
  onCurrenciesUpdated,
}) => {
  const {
    settings,
    currencies: contextCurrencies,
    exchangeRates: contextExchangeRates,
    exchangeRateItems: contextRateItems,
    saveCurrency,
    removeCurrency,
    syncCurrenciesState,
    updateExchangeRate,
    syncExchangeRatesState,
  } = usePOS();
  const isAr = settings.language === 'ar';

  const onCurrenciesUpdatedRef = useRef(onCurrenciesUpdated);
  useEffect(() => {
    onCurrenciesUpdatedRef.current = onCurrenciesUpdated;
  }, [onCurrenciesUpdated]);

  const contextCurrenciesRef = useRef(contextCurrencies);
  useEffect(() => {
    contextCurrenciesRef.current = contextCurrencies;
  }, [contextCurrencies]);

  const contextExchangeRatesRef = useRef(contextExchangeRates);
  useEffect(() => {
    contextExchangeRatesRef.current = contextExchangeRates;
  }, [contextExchangeRates]);

  const syncCurrenciesStateRef = useRef(syncCurrenciesState);
  useEffect(() => {
    syncCurrenciesStateRef.current = syncCurrenciesState;
  }, [syncCurrenciesState]);

  const syncExchangeRatesStateRef = useRef(syncExchangeRatesState);
  useEffect(() => {
    syncExchangeRatesStateRef.current = syncExchangeRatesState;
  }, [syncExchangeRatesState]);

  // Track which currency inputs are actively being edited by the user so background refreshes never overwrite them
  const dirtyRatesRef = useRef<Set<string>>(new Set());

  const [currencies, setCurrencies] = useState<Currency[]>(() =>
    contextCurrencies && contextCurrencies.length > 0
      ? contextCurrencies
      : loadPersistedCurrencies()
  );
  const [baseCurrency, setBaseCurrency] = useState<string>('SDG');
  const [rates, setRates] = useState<ExchangeRateItem[]>(() =>
    contextRateItems && contextRateItems.length > 0 ? contextRateItems : []
  );
  const [loading, setLoading] = useState<boolean>(
    () => !(contextRateItems && contextRateItems.length > 0)
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Editing state per currency pair (keyed by sourceCurrency), initialized from POSContext LocalStorage
  const [editForms, setEditForms] = useState<Record<string, RateEditFormState>>(() =>
    mergeEditFormsState({}, contextRateItems || [], contextExchangeRates || {}, {
      persistedDraftInputs: loadPersistedRateInputs(),
    })
  );

  // Persist current input strings to LocalStorage whenever editForms updates so inputs never revert on remount/state update
  useEffect(() => {
    const inputsMap: Record<string, string> = {};
    for (const [code, formState] of Object.entries(editForms) as [string, RateEditFormState][]) {
      if (formState && typeof formState.rate === 'string' && formState.rate !== '') {
        inputsMap[code] = formState.rate;
      }
    }
    if (Object.keys(inputsMap).length > 0) {
      savePersistedRateInputs(inputsMap);
    }
  }, [editForms]);

  // History modal state
  const [historyModalOpen, setHistoryModalOpen] = useState<boolean>(false);
  const [historyPair, setHistoryPair] = useState<{ source: string; target: string } | null>(null);
  const [historyItems, setHistoryItems] = useState<ExchangeRateItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  // New / Edit Currency Modal state
  const [currencyModalOpen, setCurrencyModalOpen] = useState<boolean>(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [currCode, setCurrCode] = useState<string>('');
  const [currName, setCurrName] = useState<string>('');
  const [currNameAr, setCurrNameAr] = useState<string>('');
  const [currSymbol, setCurrSymbol] = useState<string>('');
  const [currInitialRate, setCurrInitialRate] = useState<string>(() =>
    (contextExchangeRates?.USD || 2700).toString()
  );
  const [savingCurrency, setSavingCurrency] = useState<boolean>(false);
  const [currencyError, setCurrencyError] = useState<string | null>(null);
  const [confirmDeleteCode, setConfirmDeleteCode] = useState<string | null>(null);
  const [deletingCurrencyCode, setDeletingCurrencyCode] = useState<string | null>(null);

  // New rate creation modal state
  const [newRateModalOpen, setNewRateModalOpen] = useState<boolean>(false);
  const [newSource, setNewSource] = useState<string>('USD');
  const [newTarget, setNewTarget] = useState<string>('SDG');
  const [newRateValue, setNewRateValue] = useState<string>(() =>
    (contextExchangeRates?.USD || 2700).toString()
  );
  const [newEffectiveFrom, setNewEffectiveFrom] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [newExpiryDate, setNewExpiryDate] = useState<string>('');
  const [creatingRate, setCreatingRate] = useState<boolean>(false);
  const [newRateError, setNewRateError] = useState<string | null>(null);
  const [confirmDeleteRateId, setConfirmDeleteRateId] = useState<string | null>(null);

  // Fetch currencies and effective exchange rates from PostgreSQL, reconciling with POSContext LocalStorage
  const fetchData = useCallback(
    async (forceResetAll: boolean = false, forceOverwriteCurrencies: string[] = []) => {
      try {
        setErrorBanner(null);
        const [currData, rateData] = await Promise.all([
          api.getCurrencies(),
          api.getExchangeRates(true),
        ]);

        const persistedCurrencies = [
          ...loadPersistedCurrencies(),
          ...(contextCurrenciesRef.current || []),
        ];
        const mergedCurrencies = reconcileCurrenciesWithPersisted(
          currData.currencies || [],
          persistedCurrencies
        );

        const persistedMap = {
          ...loadPersistedExchangeRates(),
          ...(contextExchangeRatesRef.current || {}),
        };
        const persistedItems = loadPersistedExchangeRateItems();
        const reconciledRates = reconcileRatesWithPersisted(
          rateData,
          persistedMap,
          persistedItems,
          mergedCurrencies
        );

        setCurrencies(mergedCurrencies);
        setBaseCurrency(currData.baseCurrency || 'SDG');
        setRates(reconciledRates);
        syncCurrenciesStateRef.current(mergedCurrencies);
        syncExchangeRatesStateRef.current(reconciledRates);

        if (onCurrenciesUpdatedRef.current) {
          onCurrenciesUpdatedRef.current(mergedCurrencies);
        }

        if (forceResetAll) {
          dirtyRatesRef.current.clear();
          savePersistedRateInputs({});
        }

        // Merge editForms without overwriting any existing input fields unless explicitly requested
        setEditForms((prev) =>
          mergeEditFormsState(prev, reconciledRates, persistedMap, {
            forceOverwriteAll: forceResetAll,
            forceOverwriteCurrencies,
            persistedDraftInputs: loadPersistedRateInputs(),
          })
        );
      } catch (err: any) {
        console.error('Failed to load exchange rates from database:', err);
        setErrorBanner(err.message || 'Failed to connect to database for exchange rates');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    playTactileClick(settings.soundEnabled);
    await fetchData(true);
  };

  // Open form to add a new custom currency
  const handleOpenAddCurrency = () => {
    playTactileClick(settings.soundEnabled);
    setEditingCurrency(null);
    setCurrCode('');
    setCurrName('');
    setCurrNameAr('');
    setCurrSymbol('');
    setCurrInitialRate('100');
    setCurrencyError(null);
    setCurrencyModalOpen(true);
  };

  // Open form to edit an existing currency
  const handleOpenEditCurrency = (c: Currency) => {
    playTactileClick(settings.soundEnabled);
    setEditingCurrency(c);
    setCurrCode(c.code);
    setCurrName(c.name);
    setCurrNameAr(c.nameAr || '');
    setCurrSymbol(c.symbol);
    const formRate = editForms[c.code]?.rate;
    const activeRate = rates.find((r) => r.sourceCurrency === c.code);
    const persistedRate = contextExchangeRates?.[c.code];
    setCurrInitialRate(
      formRate ||
        (activeRate ? activeRate.rate.toString() : persistedRate ? persistedRate.toString() : '2700')
    );
    setCurrencyError(null);
    setCurrencyModalOpen(true);
  };

  // Save new or updated currency
  const handleSaveCurrency = async (e: React.FormEvent) => {
    e.preventDefault();

    const resolved = resolveCurrencyInput({
      code: editingCurrency ? editingCurrency.code : currCode,
      name: currName,
      nameAr: currNameAr,
      symbol: currSymbol,
    });

    const cleanCode = resolved.code;
    if (!cleanCode || cleanCode.length < 2 || cleanCode.length > 6) {
      setCurrencyError(
        isAr
          ? 'يرجى اختيار عملة من القوالب السريعة أو كتابة رمز العملة أو اسمها (مثل EGP أو جنيه مصري)'
          : 'Please select a currency template or enter a currency code or name (e.g., EGP, QAR)'
      );
      return;
    }

    const parsedInitialRate =
      parseNormalizedNumber(currInitialRate, 0) || resolved.suggestedRate || 0;
    if (cleanCode !== 'SDG' && parsedInitialRate <= 0) {
      setCurrencyError(
        isAr
          ? 'يرجى إدخال سعر صرف ابتدائي صحيح أكبر من 0 مقابل الجنيه السوداني'
          : 'Please enter a valid initial exchange rate greater than 0 against SDG'
      );
      return;
    }

    setSavingCurrency(true);
    setCurrencyError(null);

    try {
      playTactileClick(settings.soundEnabled);
      const savedCurr = await saveCurrency({
        code: cleanCode,
        name: resolved.name,
        nameAr: resolved.nameAr,
        symbol: resolved.symbol,
        decimalPlaces: 2,
        initialRateToBase: cleanCode !== 'SDG' ? parsedInitialRate : undefined,
      });

      // Immediately update local currencies list
      setCurrencies((prev) => {
        const exists = prev.some((c) => c.code.toUpperCase() === cleanCode);
        return exists
          ? prev.map((c) => (c.code.toUpperCase() === cleanCode ? { ...c, ...savedCurr } : c))
          : [...prev, savedCurr];
      });

      // Immediately update local rates list and editForms so the new currency card appears right away
      if (cleanCode !== 'SDG' && parsedInitialRate > 0) {
        const nowIso = new Date().toISOString();
        const newRateItem: ExchangeRateItem = {
          id: `rate-${cleanCode.toLowerCase()}-sdg-${Date.now()}`,
          sourceCurrency: cleanCode,
          targetCurrency: 'SDG',
          rate: parsedInitialRate,
          inverseRate: Math.round((1 / parsedInitialRate) * 1000000) / 1000000,
          effectiveFrom: nowIso,
          expiryDate: null,
          isActive: true,
          sourceSymbol: resolved.symbol,
          targetSymbol: 'ج.س',
          sourceName: resolved.name,
          targetName: 'Sudanese Pound',
        };

        setRates((prev) => {
          const exists = prev.some((r) => r.sourceCurrency.toUpperCase() === cleanCode);
          return exists
            ? prev.map((r) =>
                r.sourceCurrency.toUpperCase() === cleanCode ? { ...r, ...newRateItem } : r
              )
            : [...prev, newRateItem];
        });

        setEditForms((prev) => ({
          ...prev,
          [cleanCode]: {
            rate: parsedInitialRate.toString(),
            effectiveFrom: nowIso.slice(0, 10),
            expiryDate: '',
            isSaving: false,
            saveSuccess: true,
            error: null,
          },
        }));
      }

      playSuccessChime(settings.soundEnabled);
      setCurrencyModalOpen(false);
      setSuccessBanner(
        isAr
          ? `تمت إضافة/حفظ العملة (${cleanCode} - ${resolved.nameAr}) بسعر صرف ${parsedInitialRate} ج.س بنجاح!`
          : `Currency (${cleanCode} - ${resolved.name}) saved with rate ${parsedInitialRate} SDG!`
      );
      setTimeout(() => setSuccessBanner(null), 5000);
      await fetchData(false, [cleanCode]);
    } catch (err: any) {
      setCurrencyError(err.message || 'Failed to save currency');
    } finally {
      setSavingCurrency(false);
    }
  };

  // Delete custom or foreign currency
  const handleDeleteCurrency = async (code: string) => {
    if (code === 'SDG') return;
    setDeletingCurrencyCode(code);
    try {
      playTactileClick(settings.soundEnabled);
      await removeCurrency(code);
      setCurrencies((prev) =>
        prev.filter((c) => c.code.toUpperCase() !== code.toUpperCase())
      );
      setRates((prev) =>
        prev.filter((r) => r.sourceCurrency.toUpperCase() !== code.toUpperCase())
      );
      playSuccessChime(settings.soundEnabled);
      setConfirmDeleteCode(null);
      setSuccessBanner(
        isAr ? `تم حذف العملة (${code}) بنجاح.` : `Currency (${code}) deleted successfully.`
      );
      setTimeout(() => setSuccessBanner(null), 4000);
      await fetchData();
    } catch (err: any) {
      setErrorBanner(err.message || 'Failed to delete currency');
    } finally {
      setDeletingCurrencyCode(null);
    }
  };

  // Delete an exchange rate entry
  const handleDeleteRateRecord = async (id: string, sourceCode: string) => {
    try {
      playTactileClick(settings.soundEnabled);
      await api.deleteExchangeRate(id);
      playSuccessChime(settings.soundEnabled);
      setConfirmDeleteRateId(null);
      setSuccessBanner(
        isAr
          ? `تم حذف سجل سعر الصرف لعملة (${sourceCode}).`
          : `Exchange rate record for (${sourceCode}) removed.`
      );
      setTimeout(() => setSuccessBanner(null), 4000);
      await fetchData(false, [sourceCode]);
    } catch (err: any) {
      setErrorBanner(err.message || 'Failed to delete exchange rate');
    }
  };

  // Auto-find existing rate when pair changes, prioritizing current editForms and POSContext LocalStorage
  const updateDefaultRateForPair = (src: string, tgt: string) => {
    if (tgt === 'SDG' && editForms[src]?.rate) {
      setNewRateValue(editForms[src].rate);
      return;
    }
    const existing = rates.find((r) => r.sourceCurrency === src && r.targetCurrency === tgt);
    if (existing) {
      setNewRateValue(existing.rate.toString());
      return;
    }
    if (tgt === 'SDG' && contextExchangeRates?.[src]) {
      setNewRateValue(contextExchangeRates[src].toString());
      return;
    }
    const inverse = rates.find((r) => r.sourceCurrency === tgt && r.targetCurrency === src);
    if (inverse && inverse.rate > 0) {
      setNewRateValue((1 / inverse.rate).toFixed(6));
      return;
    }
    if (src === 'USD' && tgt === 'SDG') setNewRateValue('2700');
    else if (src === 'SAR' && tgt === 'SDG') setNewRateValue('720');
    else if (src === 'AED' && tgt === 'SDG') setNewRateValue('735');
    else if (src === 'EUR' && tgt === 'SDG') setNewRateValue('2950');
    else if (src === 'GBP' && tgt === 'SDG') setNewRateValue('3450');
    else setNewRateValue('100');
  };

  // Safe source currency selector that auto-resolves identical target
  const handleSourceSelect = (selectedSrc: string) => {
    setNewRateError(null);
    let target = newTarget;
    if (selectedSrc === target) {
      const other =
        currencies.find((c) => c.code !== selectedSrc)?.code ||
        (selectedSrc === 'SDG' ? 'USD' : 'SDG');
      target = other;
      setNewTarget(other);
    }
    setNewSource(selectedSrc);
    updateDefaultRateForPair(selectedSrc, target);
  };

  // Safe target currency selector that auto-resolves identical source
  const handleTargetSelect = (selectedTgt: string) => {
    setNewRateError(null);
    let source = newSource;
    if (selectedTgt === source) {
      const other =
        currencies.find((c) => c.code !== selectedTgt)?.code ||
        (selectedTgt === 'SDG' ? 'USD' : 'SDG');
      source = other;
      setNewSource(other);
    }
    setNewTarget(selectedTgt);
    updateDefaultRateForPair(source, selectedTgt);
  };

  // Quick swap source and target
  const handleSwapNewPair = () => {
    playTactileClick(settings.soundEnabled);
    const oldSource = newSource;
    const oldTarget = newTarget;
    setNewSource(oldTarget);
    setNewTarget(oldSource);
    updateDefaultRateForPair(oldTarget, oldSource);
  };

  // Handle saving an existing/effective rate
  const handleSaveRate = async (sourceCurrency: string, targetCurrency: string) => {
    const form = editForms[sourceCurrency];
    if (!form) return;

    const numRate = parseNormalizedNumber(form.rate, 0);
    if (numRate <= 0) {
      setEditForms((prev) => ({
        ...prev,
        [sourceCurrency]: {
          ...prev[sourceCurrency],
          error: isAr
            ? 'يجب أن يكون سعر الصرف رقماً موجباً أكبر من الصفر'
            : 'Rate must be a strictly positive number greater than 0',
        },
      }));
      return;
    }

    setEditForms((prev) => ({
      ...prev,
      [sourceCurrency]: { ...prev[sourceCurrency], isSaving: true, error: null },
    }));

    try {
      playTactileClick(settings.soundEnabled);
      const todayStr = new Date().toISOString().slice(0, 10);
      const existingRate = rates.find((r) => r.sourceCurrency === sourceCurrency);
      const existingDateStr = existingRate?.effectiveFrom?.slice(0, 10);

      // Use current timestamp unless the user explicitly chose a different historical/future date
      const effectiveIso =
        !form.effectiveFrom ||
        form.effectiveFrom === todayStr ||
        form.effectiveFrom === existingDateStr
          ? new Date().toISOString()
          : new Date(form.effectiveFrom).toISOString();

      // Save via POSContext so LocalStorage and PostgreSQL are both updated immediately
      const saved = await updateExchangeRate({
        sourceCurrency,
        targetCurrency,
        rate: numRate,
        effectiveFrom: effectiveIso,
        expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : null,
      });

      playSuccessChime(settings.soundEnabled);
      dirtyRatesRef.current.delete(sourceCurrency);

      // Immediately update local rates list and form state with the saved record
      setRates((prev) =>
        prev.map((r) => (r.sourceCurrency === sourceCurrency ? { ...r, ...saved } : r))
      );

      setEditForms((prev) => ({
        ...prev,
        [sourceCurrency]: {
          rate: saved.rate.toString(),
          effectiveFrom: saved.effectiveFrom.slice(0, 10),
          expiryDate: saved.expiryDate ? saved.expiryDate.slice(0, 10) : '',
          isSaving: false,
          saveSuccess: true,
          error: null,
        },
      }));

      setSuccessBanner(
        isAr
          ? `تم تحديث سعر الصرف: 1 ${sourceCurrency} = ${saved.rate} ${targetCurrency} وحفظه في قاعدة البيانات والتخزين المحلي.`
          : `Exchange rate updated and persisted: 1 ${sourceCurrency} = ${saved.rate} ${targetCurrency}.`
      );
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch (err: any) {
      console.error('Failed to save exchange rate:', err);
      setEditForms((prev) => ({
        ...prev,
        [sourceCurrency]: {
          ...prev[sourceCurrency],
          isSaving: false,
          error: err.message || 'Server rejected exchange rate update',
        },
      }));
    }
  };

  // Open history modal for a currency pair
  const handleOpenHistory = async (source: string, target: string) => {
    setHistoryPair({ source, target });
    setHistoryModalOpen(true);
    setLoadingHistory(true);
    playTactileClick(settings.soundEnabled);

    try {
      const history = await api.getExchangeRateHistory(source, target);
      setHistoryItems(history);
    } catch (err: any) {
      console.error('Failed to load rate history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Create new currency pair rate
  const handleCreateNewRate = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseNormalizedNumber(newRateValue, 0);
    if (num <= 0) {
      setNewRateError(
        isAr
          ? 'يجب إدخال سعر صرف صحيح أكبر من الصفر'
          : 'Exchange rate must be a positive number greater than 0'
      );
      return;
    }

    if (newSource === newTarget) {
      setNewRateError(
        isAr
          ? 'لا يمكن أن تكون العملة المصدر والهدف متطابقتين'
          : 'Source and target currency cannot be the same'
      );
      return;
    }

    setCreatingRate(true);
    setNewRateError(null);

    try {
      playTactileClick(settings.soundEnabled);
      const saved = await updateExchangeRate({
        sourceCurrency: newSource,
        targetCurrency: newTarget,
        rate: num,
        effectiveFrom: newEffectiveFrom
          ? new Date(newEffectiveFrom).toISOString()
          : new Date().toISOString(),
        expiryDate: newExpiryDate ? new Date(newExpiryDate).toISOString() : null,
      });

      playSuccessChime(settings.soundEnabled);
      setNewRateModalOpen(false);
      setNewRateValue('');
      setNewExpiryDate('');
      setSuccessBanner(
        isAr
          ? `تم حفظ سعر الصرف لزوج ${newSource}/${newTarget}: 1 ${newSource} = ${saved.rate} ${newTarget}`
          : `Successfully configured rate for ${newSource}/${newTarget}: 1 ${newSource} = ${saved.rate} ${newTarget}`
      );
      setTimeout(() => setSuccessBanner(null), 4000);
      await fetchData(false, [newSource]);
    } catch (err: any) {
      setNewRateError(err.message || 'Failed to create exchange rate');
    } finally {
      setCreatingRate(false);
    }
  };

  const parsedNewRate = parseNormalizedNumber(newRateValue, 0);
  const inverseNewRate = parsedNewRate > 0 ? (1 / parsedNewRate).toFixed(6) : null;

  return (
    <AppCard>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm text-white">
                {isAr
                  ? 'تخصيص العملات وأسعار الصرف (إضافة / تعديل / حذف)'
                  : 'Full Currency & Exchange Rate Customization'}
              </h3>
              <AppBadge variant="amber" size="sm">
                {isAr ? `الأساسية: ${baseCurrency} (ج.س)` : `Base: ${baseCurrency} (ج.س)`}
              </AppBadge>
            </div>
            <span className="text-[11px] text-neutral-400 block">
              {isAr
                ? 'أضف عملات جديدة، احذف العملات غير المطلوبة، وعدّل سعر الدولار وبقية العملات بسهولة'
                : 'Add custom currencies, delete unused ones, and adjust USD or any foreign rate effortlessly'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <TactileButton
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            isLoading={refreshing}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />}
            className="text-neutral-400 hover:text-white"
          >
            {isAr ? 'تحديث' : 'Refresh'}
          </TactileButton>

          <TactileButton
            variant="secondary"
            size="sm"
            onClick={() => {
              playTactileClick(settings.soundEnabled);
              updateDefaultRateForPair(newSource, newTarget);
              setNewRateModalOpen(true);
            }}
            leftIcon={<ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />}
          >
            {isAr ? 'تعديل زوج صرف' : 'Set Pair Rate'}
          </TactileButton>

          <TactileButton
            variant="amber"
            size="sm"
            onClick={handleOpenAddCurrency}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            {isAr ? 'إضافة عملة جديدة' : 'Add Currency'}
          </TactileButton>
        </div>
      </div>

      {/* Feedback Banners */}
      {successBanner && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span className="font-medium">{successBanner}</span>
        </div>
      )}

      {errorBanner && (
        <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span className="font-medium">{errorBanner}</span>
        </div>
      )}

      {/* Inline Add / Edit Custom Currency Form Panel (Opens immediately right under the header) */}
      {currencyModalOpen && (
        <div className="mt-4 p-4 rounded-2xl bg-neutral-950/90 border-2 border-amber-500/50 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>
                  {editingCurrency
                    ? isAr
                      ? `تعديل بيانات العملة (${editingCurrency.code})`
                      : `Edit Currency (${editingCurrency.code})`
                    : isAr
                    ? 'إضافة عملة جديدة للنظام'
                    : 'Add New Custom Currency'}
                </span>
              </h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {isAr
                  ? 'اختر من القوالب الجاهزة بضغطة واحدة أو اكتب اسم/رمز العملة وسعر صرفها مقابل الجنيه السوداني'
                  : 'Pick a quick template with one click or enter the currency code/name and exchange rate to SDG'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrencyModalOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close currency form"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveCurrency} noValidate className="space-y-4">
            {currencyError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{currencyError}</span>
              </div>
            )}

            {/* Quick Templates for Popular Regional & Global Currencies */}
            {!editingCurrency && (
              <div>
                <span className="text-[11px] text-neutral-300 font-semibold block mb-1.5">
                  {isAr
                    ? 'قوالب عملات جاهزة (اضغط على أي عملة لتعبئة بياناتها فوراً):'
                    : 'Quick currency templates (click to auto-fill):'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CURRENCY_TEMPLATES.map((tpl) => {
                    const isSelected = currCode.toUpperCase() === tpl.code;
                    return (
                      <button
                        key={tpl.code}
                        type="button"
                        onClick={() => {
                          playTactileClick(settings.soundEnabled);
                          setCurrCode(tpl.code);
                          setCurrName(tpl.name);
                          setCurrNameAr(tpl.nameAr);
                          setCurrSymbol(tpl.symbol);
                          setCurrInitialRate(tpl.defaultRate.toString());
                          setCurrencyError(null);
                        }}
                        className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold'
                            : 'bg-neutral-900 hover:bg-amber-500/20 border-neutral-750 hover:border-amber-500/50 text-neutral-200'
                        }`}
                      >
                        {tpl.code} ({tpl.nameAr})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  {isAr ? 'رمز العملة (مثل EGP أو QAR)' : 'Currency Code (e.g. EGP, QAR)'}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  disabled={Boolean(editingCurrency)}
                  maxLength={12}
                  value={currCode}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCurrCode(val.toUpperCase());
                    setCurrencyError(null);
                    if (!editingCurrency && val.trim().length >= 2) {
                      const matched = CURRENCY_TEMPLATES.find(
                        (t) =>
                          t.code === val.trim().toUpperCase() ||
                          t.keywords.includes(val.trim().toLowerCase())
                      );
                      if (matched) {
                        if (!currName) setCurrName(matched.name);
                        if (!currNameAr) setCurrNameAr(matched.nameAr);
                        if (!currSymbol) setCurrSymbol(matched.symbol);
                        if (!currInitialRate || currInitialRate === '100') {
                          setCurrInitialRate(matched.defaultRate.toString());
                        }
                      }
                    }
                  }}
                  placeholder={isAr ? 'مثال: EGP أو QAR' : 'e.g. EGP'}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold uppercase focus:outline-none focus:border-amber-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  {isAr ? 'اسم العملة بالعربية' : 'Arabic Name (الاسم بالعربية)'}
                </label>
                <input
                  type="text"
                  value={currNameAr}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCurrNameAr(val);
                    setCurrencyError(null);
                    if (!editingCurrency && val.trim().length >= 2) {
                      const matched = CURRENCY_TEMPLATES.find(
                        (t) =>
                          t.nameAr === val.trim() ||
                          t.keywords.includes(val.trim().toLowerCase())
                      );
                      if (matched) {
                        if (!currCode) setCurrCode(matched.code);
                        if (!currName) setCurrName(matched.name);
                        if (!currSymbol) setCurrSymbol(matched.symbol);
                        if (!currInitialRate || currInitialRate === '100') {
                          setCurrInitialRate(matched.defaultRate.toString());
                        }
                      }
                    }
                  }}
                  placeholder="مثال: جنيه مصري"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  {isAr ? 'اسم العملة بالإنجليزية (اختياري)' : 'English Name'}
                </label>
                <input
                  type="text"
                  value={currName}
                  onChange={(e) => {
                    setCurrName(e.target.value);
                    setCurrencyError(null);
                  }}
                  placeholder="e.g. Egyptian Pound"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  {isAr ? 'الرمز المختصر (اختياري، مثل ج.م)' : 'Symbol (e.g. $, ج.م)'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={currSymbol}
                  onChange={(e) => {
                    setCurrSymbol(e.target.value);
                    setCurrencyError(null);
                  }}
                  placeholder="مثال: ج.م"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {currCode.toUpperCase() !== 'SDG' && (
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  {isAr
                    ? `سعر الصرف مقابل الجنيه السوداني (1 ${currCode || currNameAr || 'عملة'} = كم ج.س؟)`
                    : `Exchange Rate to Base SDG (1 ${currCode || 'Unit'} = ? SDG)`}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    inputMode="decimal"
                    dir="ltr"
                    value={currInitialRate}
                    onChange={(e) => {
                      setCurrInitialRate(normalizeNumberInput(e.target.value));
                      setCurrencyError(null);
                    }}
                    placeholder="100"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl pl-3.5 pr-16 py-2.5 text-base text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                  {currInitialRate && (
                    <button
                      type="button"
                      onClick={() => setCurrInitialRate('')}
                      className="absolute right-12 px-1.5 py-0.5 text-[10px] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded"
                    >
                      {isAr ? 'مسح' : 'CLR'}
                    </button>
                  )}
                  <span className="absolute right-3.5 text-xs font-mono font-bold text-amber-400 pointer-events-none">
                    SDG
                  </span>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-neutral-800 flex items-center justify-end gap-2">
              <TactileButton
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => setCurrencyModalOpen(false)}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </TactileButton>

              <TactileButton variant="amber" size="sm" type="submit" isLoading={savingCurrency}>
                {editingCurrency
                  ? isAr
                    ? 'حفظ تعديلات العملة'
                    : 'Save Changes'
                  : isAr
                  ? 'حفظ وإضافة العملة'
                  : 'Save & Add Currency'}
              </TactileButton>
            </div>
          </form>
        </div>
      )}

      {/* Section 1: Active Currencies Directory (Add / Edit / Delete Currencies) */}
      <div className="mt-4 p-3.5 bg-neutral-950/50 border border-neutral-800/90 rounded-2xl">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-neutral-200">
            {isAr
              ? `قائمة العملات المسجلة (${currencies.length})`
              : `Configured Currencies (${currencies.length})`}
          </span>
          <span className="text-[11px] text-neutral-400">
            {isAr
              ? 'اضغط على أي عملة لتعديل اسمها أو رمزها، أو احذفها'
              : 'Click edit to customize or trash icon to delete'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {currencies.map((c) => {
            const isConfirmingDelete = confirmDeleteCode === c.code;
            return (
              <div
                key={c.code}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                  c.isBase
                    ? 'bg-amber-500/10 border-amber-500/40'
                    : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`px-2 py-1 rounded-lg font-mono text-xs font-extrabold shrink-0 ${
                      c.isBase
                        ? 'bg-amber-500 text-neutral-950'
                        : 'bg-neutral-800 text-white border border-neutral-700'
                    }`}
                  >
                    {c.code}
                  </span>
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate">
                      {isAr && c.nameAr ? c.nameAr : c.name}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      {isAr ? `الرمز: ${c.symbol}` : `Symbol: ${c.symbol}`}
                      {c.isBase ? (isAr ? ' • أساسية' : ' • Base') : ''}
                    </div>
                  </div>
                </div>

                {/* Edit / Delete Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  {isConfirmingDelete ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={deletingCurrencyCode === c.code}
                        onClick={() => handleDeleteCurrency(c.code)}
                        className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold"
                      >
                        {deletingCurrencyCode === c.code
                          ? '...'
                          : isAr
                          ? 'تأكيد الحذف'
                          : 'Confirm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteCode(null)}
                        className="px-1.5 py-1 rounded-lg bg-neutral-800 text-neutral-300 text-[10px]"
                      >
                        {isAr ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenEditCurrency(c)}
                        title={isAr ? 'تعديل العملة' : 'Edit Currency'}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {!c.isBase && (
                        <button
                          type="button"
                          onClick={() => {
                            playTactileClick(settings.soundEnabled);
                            setConfirmDeleteCode(c.code);
                          }}
                          title={isAr ? 'حذف العملة' : 'Delete Currency'}
                          className="p-1.5 rounded-lg text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Exchange Rates Grid / List */}
      {loading ? (
        <div className="py-8 flex items-center justify-center gap-2 text-xs text-neutral-400">
          <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
          <span>
            {isAr
              ? 'جاري تحميل أسعار الصرف من قاعدة البيانات...'
              : 'Loading exchange rates from Cloud SQL...'}
          </span>
        </div>
      ) : rates.length === 0 ? (
        <div className="py-8 text-center text-xs text-neutral-500">
          {isAr
            ? 'لا توجد أسعار صرف مسجلة. اضغط على "إضافة عملة جديدة" للبدء.'
            : 'No exchange rates found. Click "Add Currency" to configure one.'}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {rates.map((rateItem) => {
            const form = editForms[rateItem.sourceCurrency] || {
              rate: rateItem.rate.toString(),
              effectiveFrom: rateItem.effectiveFrom.slice(0, 10),
              expiryDate: '',
              isSaving: false,
              saveSuccess: false,
              error: null,
            };

            const parsedVal = parseNormalizedNumber(form.rate, 0);
            const inverse = parsedVal > 0 ? (1 / parsedVal).toFixed(6) : '—';
            const isModified = form.rate !== rateItem.rate.toString();
            const isUsd = rateItem.sourceCurrency === 'USD';

            return (
              <div
                key={rateItem.id}
                className={`p-4 rounded-2xl transition-all space-y-3 border ${
                  isUsd
                    ? 'bg-amber-950/15 border-amber-500/40 hover:border-amber-500/60'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-750'
                }`}
              >
                {/* Header row for currency pair */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`font-mono font-bold text-sm px-2.5 py-1 rounded-lg border ${
                        isUsd
                          ? 'bg-amber-500 text-neutral-950 border-amber-400'
                          : 'bg-neutral-850 text-white border-neutral-750'
                      }`}
                    >
                      {rateItem.sourceCurrency} ({rateItem.sourceSymbol || rateItem.sourceCurrency})
                    </span>
                    <ArrowRightLeft className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="font-mono font-bold text-sm text-amber-400 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      {rateItem.targetCurrency}
                    </span>
                    <span className="text-xs text-neutral-300 font-medium">
                      {rateItem.sourceName || rateItem.sourceCurrency}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-neutral-400">
                      1 {rateItem.targetCurrency} ≈ {inverse} {rateItem.sourceCurrency}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenHistory(rateItem.sourceCurrency, rateItem.targetCurrency)
                      }
                      className="px-2 py-1 rounded-lg text-[11px] font-semibold text-neutral-300 hover:text-white bg-neutral-850 border border-neutral-750 hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
                    >
                      <History className="w-3 h-3 text-amber-400" />
                      <span>{isAr ? 'السجل' : 'History'}</span>
                    </button>

                    {confirmDeleteRateId === rateItem.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteRateRecord(rateItem.id, rateItem.sourceCurrency)
                          }
                          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-rose-600 text-white"
                        >
                          {isAr ? 'حذف السعر' : 'Confirm'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteRateId(null)}
                          className="px-1.5 py-1 rounded-lg text-[10px] bg-neutral-800 text-neutral-300"
                        >
                          {isAr ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteRateId(rateItem.id)}
                        title={isAr ? 'حذف سجل سعر الصرف' : 'Delete rate record'}
                        className="p-1.5 rounded-lg text-rose-400/70 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Edit Form Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-1">
                  {/* Exchange Rate Input */}
                  <div className="sm:col-span-5">
                    <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                      {isAr
                        ? `سعر الصرف (1 ${rateItem.sourceCurrency} كم يساوي بـ ${rateItem.targetCurrency}؟)`
                        : `Exchange Rate (1 ${rateItem.sourceCurrency} in ${rateItem.targetCurrency})`}
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        inputMode="decimal"
                        dir="ltr"
                        value={form.rate}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveRate(rateItem.sourceCurrency, rateItem.targetCurrency);
                          }
                        }}
                        onBlur={() => {
                          if (isModified && parsedVal > 0 && !form.isSaving) {
                            handleSaveRate(rateItem.sourceCurrency, rateItem.targetCurrency);
                          }
                        }}
                        onChange={(e) => {
                          const val = normalizeNumberInput(e.target.value);
                          dirtyRatesRef.current.add(rateItem.sourceCurrency);
                          setEditForms((prev) => ({
                            ...prev,
                            [rateItem.sourceCurrency]: {
                              ...(prev[rateItem.sourceCurrency] || form),
                              rate: val,
                              saveSuccess: false,
                              error: null,
                            },
                          }));
                        }}
                        className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-xl pl-3 pr-16 py-2.5 text-base text-white font-mono font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                        placeholder="2700"
                      />
                      {form.rate && (
                        <button
                          type="button"
                          onClick={() => {
                            dirtyRatesRef.current.add(rateItem.sourceCurrency);
                            setEditForms((prev) => ({
                              ...prev,
                              [rateItem.sourceCurrency]: {
                                ...(prev[rateItem.sourceCurrency] || form),
                                rate: '',
                                saveSuccess: false,
                                error: null,
                              },
                            }));
                          }}
                          title={isAr ? 'مسح الرقم لكتابة رقم جديد' : 'Clear amount'}
                          className="absolute right-11 px-1.5 py-0.5 text-[10px] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded"
                        >
                          {isAr ? 'مسح' : 'CLR'}
                        </button>
                      )}
                      <span className="absolute right-2.5 text-xs font-mono font-semibold text-amber-400 pointer-events-none">
                        {rateItem.targetCurrency}
                      </span>
                    </div>

                    {/* Quick Rate Preset Buttons (Especially helpful for USD and mobile) */}
                    <div className="flex flex-wrap items-center gap-1 mt-1.5">
                      {(isUsd
                        ? [2500, 2600, 2700, 2800, 3000]
                        : [500, 720, 750, 1000, 2500]
                      ).map((presetVal) => (
                        <button
                          key={presetVal}
                          type="button"
                          onClick={() => {
                            playTactileClick(settings.soundEnabled);
                            dirtyRatesRef.current.add(rateItem.sourceCurrency);
                            setEditForms((prev) => ({
                              ...prev,
                              [rateItem.sourceCurrency]: {
                                ...(prev[rateItem.sourceCurrency] || form),
                                rate: presetVal.toString(),
                                saveSuccess: false,
                                error: null,
                              },
                            }));
                          }}
                          className="px-2 py-0.5 rounded bg-neutral-850 hover:bg-amber-500/20 text-[10px] font-mono text-neutral-300 hover:text-amber-300 border border-neutral-750"
                        >
                          {presetVal}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          playTactileClick(settings.soundEnabled);
                          dirtyRatesRef.current.add(rateItem.sourceCurrency);
                          const cur = parseNormalizedNumber(form.rate, 0);
                          setEditForms((prev) => ({
                            ...prev,
                            [rateItem.sourceCurrency]: {
                              ...(prev[rateItem.sourceCurrency] || form),
                              rate: (cur + 50).toString(),
                              saveSuccess: false,
                              error: null,
                            },
                          }));
                        }}
                        className="px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-[10px] font-mono text-emerald-300 border border-emerald-800/50"
                      >
                        +50
                      </button>
                    </div>
                  </div>

                  {/* Effective Date */}
                  <div className="sm:col-span-4">
                    <label className="text-[11px] font-semibold text-neutral-300 block mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      <span>{isAr ? 'تاريخ السريان' : 'Effective Date'}</span>
                    </label>
                    <input
                      type="date"
                      value={form.effectiveFrom}
                      onChange={(e) => {
                        setEditForms((prev) => ({
                          ...prev,
                          [rateItem.sourceCurrency]: {
                            ...prev[rateItem.sourceCurrency],
                            effectiveFrom: e.target.value,
                            saveSuccess: false,
                          },
                        }));
                      }}
                      className="w-full bg-neutral-900 border border-neutral-750 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-neutral-200 font-mono focus:outline-none"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="sm:col-span-3 flex items-center gap-2">
                    <TactileButton
                      variant={isModified ? 'amber' : 'secondary'}
                      size="sm"
                      onClick={() =>
                        handleSaveRate(rateItem.sourceCurrency, rateItem.targetCurrency)
                      }
                      isLoading={form.isSaving}
                      leftIcon={
                        form.saveSuccess ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )
                      }
                      className="w-full min-h-[42px] text-xs font-bold"
                    >
                      {form.saveSuccess
                        ? isAr
                          ? 'تم الحفظ!'
                          : 'Saved!'
                        : isAr
                        ? 'حفظ السعر'
                        : 'Save Rate'}
                    </TactileButton>
                  </div>
                </div>

                {/* Form-specific error */}
                {form.error && (
                  <div className="text-[11px] text-rose-400 flex items-center gap-1 pt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{form.error}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal 2: History Modal */}
      <AppModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title={`Exchange Rate History: ${historyPair?.source} / ${historyPair?.target}`}
        description="Audit log of all configured rates, effective dates, and validity windows"
        maxWidth="lg"
      >
        <div className="space-y-3">
          {loadingHistory ? (
            <div className="py-8 flex items-center justify-center gap-2 text-xs text-neutral-400">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
              <span>Loading historical audit log...</span>
            </div>
          ) : historyItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500">
              No historical rate changes recorded for this pair.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400">
                    <th className="py-2 px-3 font-semibold">Rate ({historyPair?.target})</th>
                    <th className="py-2 px-3 font-semibold">Inverse</th>
                    <th className="py-2 px-3 font-semibold">Effective From</th>
                    <th className="py-2 px-3 font-semibold">Expiry Date</th>
                    <th className="py-2 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono">
                  {historyItems.map((item, idx) => {
                    const isCurrent = idx === 0 && item.isActive;
                    return (
                      <tr key={item.id} className={isCurrent ? 'bg-amber-500/5' : ''}>
                        <td className="py-2.5 px-3 font-bold text-white">
                          {item.rate.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-3 text-neutral-400">
                          {item.inverseRate ? item.inverseRate.toFixed(6) : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-neutral-300">
                          {new Date(item.effectiveFrom).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 px-3 text-neutral-400">
                          {item.expiryDate
                            ? new Date(item.expiryDate).toLocaleDateString()
                            : 'Current (No Expiry)'}
                        </td>
                        <td className="py-2.5 px-3">
                          {isCurrent ? (
                            <AppBadge variant="success" size="sm">
                              Active
                            </AppBadge>
                          ) : (
                            <AppBadge variant="neutral" size="sm">
                              Archived
                            </AppBadge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="pt-3 border-t border-neutral-800 flex justify-end">
            <TactileButton
              variant="secondary"
              size="sm"
              onClick={() => setHistoryModalOpen(false)}
            >
              Close
            </TactileButton>
          </div>
        </div>
      </AppModal>

      {/* Modal 3: Set Pair Exchange Rate Modal */}
      <AppModal
        isOpen={newRateModalOpen}
        onClose={() => setNewRateModalOpen(false)}
        title={isAr ? 'تحديد أو تعديل سعر صرف عملة' : 'Add / Update Exchange Rate'}
        description={
          isAr
            ? 'اختر العملة واكتب المبلغ الجديد مباشرة أو استخدم الأزرار السريعة'
            : 'Configure a currency conversion rate relative to base SDG or another currency'
        }
        maxWidth="md"
      >
        <form onSubmit={handleCreateNewRate} className="space-y-4">
          {newRateError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{newRateError}</span>
            </div>
          )}

          {/* Currency Pair Selection with Swap button */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                {isAr ? 'العملة المصدر (من)' : 'Source Currency'}
              </label>
              <select
                value={newSource}
                onChange={(e) => handleSourceSelect(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {isAr && c.nameAr ? c.nameAr : c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-5">
              <button
                type="button"
                onClick={handleSwapNewPair}
                title="Swap source and target (تبديل العملتين)"
                className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white border border-neutral-700 transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1">
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                {isAr ? 'العملة الهدف (إلى)' : 'Target Currency'}
              </label>
              <select
                value={newTarget}
                onChange={(e) => handleTargetSelect(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {isAr && c.nameAr ? c.nameAr : c.name} {c.isBase ? '(Base)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount / Rate Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-300">
                1 {newSource} = ? {newTarget} ({isAr ? 'اكتب المبلغ هنا' : 'Enter Rate'})
              </label>
              {parsedNewRate > 0 && (
                <span className="text-[11px] font-mono text-amber-400">
                  1 {newTarget} ≈ {inverseNewRate} {newSource}
                </span>
              )}
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="decimal"
                dir="ltr"
                required
                value={newRateValue}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const normalized = normalizeNumberInput(e.target.value);
                  setNewRateValue(normalized);
                  if (newRateError) setNewRateError(null);
                }}
                placeholder="2700"
                className="w-full bg-neutral-900 border border-neutral-750 rounded-xl pl-3.5 pr-16 py-2.5 text-lg text-white font-mono font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              {newRateValue && (
                <button
                  type="button"
                  onClick={() => setNewRateValue('')}
                  className="absolute right-12 px-1.5 py-0.5 text-[10px] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded"
                >
                  {isAr ? 'مسح' : 'CLR'}
                </button>
              )}
              <span className="absolute right-3 top-3 text-xs font-mono font-bold text-amber-400 pointer-events-none">
                {newTarget}
              </span>
            </div>

            {/* Quick Presets / Adjustments for easy mobile use */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {[2500, 2600, 2700, 2800, 3000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    playTactileClick(settings.soundEnabled);
                    setNewRateValue(val.toString());
                  }}
                  className="px-2 py-0.5 rounded-lg bg-neutral-850 hover:bg-amber-500/20 text-[11px] font-mono text-neutral-300 border border-neutral-750 transition-colors"
                >
                  {val}
                </button>
              ))}
              {[10, 50, 100].map((inc) => (
                <button
                  key={inc}
                  type="button"
                  onClick={() => {
                    playTactileClick(settings.soundEnabled);
                    const current = parseNormalizedNumber(newRateValue, 0);
                    setNewRateValue((current + inc).toString());
                  }}
                  className="px-2 py-0.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-[11px] font-mono text-emerald-300 border border-emerald-800/50 transition-colors"
                >
                  +{inc}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Display */}
          {parsedNewRate > 0 && (
            <div className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-xl space-y-1">
              <div className="text-xs text-neutral-300 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'معاينة التحويل المباشر' : 'Conversion Preview'}</span>
              </div>
              <div className="text-xs font-mono text-neutral-400">
                100 {newSource} ={' '}
                <span className="font-bold text-white">
                  {(parsedNewRate * 100).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>{' '}
                {newTarget}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                {isAr ? 'تاريخ السريان' : 'Effective Date'}
              </label>
              <input
                type="datetime-local"
                value={newEffectiveFrom}
                onChange={(e) => setNewEffectiveFrom(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-750 rounded-xl px-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                {isAr ? 'تاريخ الانتهاء (اختياري)' : 'Expiry Date (Optional)'}
              </label>
              <input
                type="datetime-local"
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-750 rounded-xl px-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
            <TactileButton
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setNewRateModalOpen(false)}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </TactileButton>

            <TactileButton variant="amber" size="sm" type="submit" isLoading={creatingRate}>
              {isAr ? 'حفظ سعر الصرف' : 'Save Exchange Rate'}
            </TactileButton>
          </div>
        </form>
      </AppModal>
    </AppCard>
  );
};


