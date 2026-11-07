import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { A as RotateCcw, Ct as Copy, F as Plus, Gt as Building2, I as Play, J as Mail, L as Phone, Lt as ChevronDown, Mt as CircleCheckBig, Nt as CircleAlert, Ot as ClipboardCheck, Pt as ChevronUp, Q as Link2, R as Pen, Rt as Check, T as ShieldAlert, Tt as Coins, W as Monitor, Wt as Calendar, X as Lock, Xt as Ban, _t as FileCheck2, a as Volume2, b as Sparkles, ct as Globe, d as Upload, en as ArrowRightLeft, ft as FolderSync, g as Trash2, in as Archive, it as Info, j as RefreshCw, jt as CircleCheck, k as Save, l as UserPlus, lt as GraduationCap, n as X, o as Vibrate, ot as History, p as TriangleAlert, pt as FlaskConical, rt as KeyRound, s as Users, sn as require_react, tt as Layers, u as UserCheck, ut as GitMerge, w as ShieldCheck, wt as Compass, x as Smartphone, xt as Database, y as Store, yt as Download } from "./vendor-icons-DoijI_tq.js";
import { At as deriveLegacyPermissionsFromCapabilities, C as reconcileRatesWithPersisted, D as api, Dt as CAPABILITY_GROUPS, E as savePersistedRateInputs, Et as DEFAULT_ROLE_PERMISSIONS, Mt as mapLegacyRoleToSystemRole, N as playSuccessChime, Nt as mapSystemRoleToLegacyRole, Ot as SYSTEM_ROLE_DEFINITIONS, P as playTactileClick, S as reconcileCurrenciesWithPersisted, T as savePersistedExchangeRateItems, _ as loadPersistedCurrencies, a as analyzeBackupMergePreview, b as loadPersistedRateInputs, c as filterPayloadByIncludedModules, d as scrubSensitiveUserFields, f as TRAINING_TOUR_STEPS, g as CURRENCY_TEMPLATES, h as isTourStepAccessibleForUser, i as BACKUP_MODULE_DEFINITIONS, jt as getDefaultCapabilitiesForRole, kt as deriveCapabilitiesFromUser, l as remapBackupPayloadForNewCompany, n as usePOS, o as applyIntelligentBackupMerge, p as calculateTourCompletionPercent, r as ALL_BACKUP_MODULE_IDS, s as computeBackupModuleRecordCounts, u as resolveBackupModuleDependencies, v as loadPersistedExchangeRateItems, w as resolveCurrencyInput, x as mergeEditFormsState, y as loadPersistedExchangeRates } from "./POSContext-nila8oYV.js";
import { i as require_jsx_runtime } from "./vendor-motion-CekIsQM-.js";
import { _ as TactileButton, g as parseNormalizedNumber, h as normalizeNumberInput, m as HoldToConfirm, n as AppModal, p as AppInput, v as getTranslation } from "./index-DYJDckRU.js";
import { t as AppCard } from "./AppCard-B2erL08q.js";
// src/components/ui/AppBadge.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var AppBadge = ({ children, variant = "neutral", size = "md", className = "" }) => {
	const variantStyles = {
		neutral: "bg-neutral-800/80 text-neutral-300 border border-neutral-700/60",
		success: "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50",
		warning: "bg-amber-950/60 text-amber-400 border border-amber-800/50",
		danger: "bg-rose-950/60 text-rose-400 border border-rose-800/50",
		amber: "bg-amber-500/10 text-amber-300 border border-amber-500/30"
	}[variant];
	const sizeStyles = {
		sm: "text-[10px] px-1.5 py-0.5 rounded-md font-medium",
		md: "text-xs px-2.5 py-1 rounded-lg font-medium"
	}[size];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center gap-1.5 ${variantStyles} ${sizeStyles} ${className}`,
		children
	});
};
// src/components/settings/ExchangeRateSettings.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var ExchangeRateSettings = ({ onCurrenciesUpdated }) => {
	const { settings, workspaceMode, currentCompany, currencies: contextCurrencies, exchangeRates: contextExchangeRates, exchangeRateItems: contextRateItems, saveCurrency, removeCurrency, clearAllCurrencies, setBaseCurrencyCode, syncCurrenciesState, updateExchangeRate, syncExchangeRatesState } = usePOS();
	const activeCompanyId = currentCompany?.id || "";
	const isAr = settings.language === "ar";
	const onCurrenciesUpdatedRef = (0, import_react.useRef)(onCurrenciesUpdated);
	(0, import_react.useEffect)(() => {
		onCurrenciesUpdatedRef.current = onCurrenciesUpdated;
	}, [onCurrenciesUpdated]);
	const workspaceModeRef = (0, import_react.useRef)(workspaceMode);
	(0, import_react.useEffect)(() => {
		workspaceModeRef.current = workspaceMode;
	}, [workspaceMode]);
	const contextCurrenciesRef = (0, import_react.useRef)(contextCurrencies);
	(0, import_react.useEffect)(() => {
		contextCurrenciesRef.current = contextCurrencies;
	}, [contextCurrencies]);
	const contextExchangeRatesRef = (0, import_react.useRef)(contextExchangeRates);
	(0, import_react.useEffect)(() => {
		contextExchangeRatesRef.current = contextExchangeRates;
	}, [contextExchangeRates]);
	const contextRateItemsRef = (0, import_react.useRef)(contextRateItems);
	(0, import_react.useEffect)(() => {
		contextRateItemsRef.current = contextRateItems;
	}, [contextRateItems]);
	const syncCurrenciesStateRef = (0, import_react.useRef)(syncCurrenciesState);
	(0, import_react.useEffect)(() => {
		syncCurrenciesStateRef.current = syncCurrenciesState;
	}, [syncCurrenciesState]);
	const syncExchangeRatesStateRef = (0, import_react.useRef)(syncExchangeRatesState);
	(0, import_react.useEffect)(() => {
		syncExchangeRatesStateRef.current = syncExchangeRatesState;
	}, [syncExchangeRatesState]);
	const dirtyRatesRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const [currencies, setCurrencies] = (0, import_react.useState)(() => Array.isArray(contextCurrencies) ? contextCurrencies : []);
	const [baseCurrency, setBaseCurrency] = (0, import_react.useState)(() => {
		return (contextCurrencies || []).find((c) => c.isBase)?.code || settings.currency || "SDG";
	});
	const [rates, setRates] = (0, import_react.useState)(() => contextRateItems && contextRateItems.length > 0 ? contextRateItems : []);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
	const [errorBanner, setErrorBanner] = (0, import_react.useState)(null);
	const [successBanner, setSuccessBanner] = (0, import_react.useState)(null);
	const [editForms, setEditForms] = (0, import_react.useState)(() => mergeEditFormsState({}, contextRateItems || [], contextExchangeRates || {}, { persistedDraftInputs: loadPersistedRateInputs() }));
	(0, import_react.useEffect)(() => {
		const nextCurrencies = Array.isArray(contextCurrencies) ? contextCurrencies : [];
		const baseFound = nextCurrencies.find((c) => c.isBase) || nextCurrencies[0];
		if (baseFound) setBaseCurrency(baseFound.code);
		const nextRates = workspaceMode === "PRODUCTION" ? reconcileRatesWithPersisted(contextRateItems || [], contextExchangeRates || {}, [], nextCurrencies) : contextRateItems || [];
		setCurrencies(nextCurrencies);
		setRates(nextRates);
		setEditForms((prev) => mergeEditFormsState(prev, nextRates, contextExchangeRates || {}, {
			forceOverwriteAll: true,
			persistedDraftInputs: {}
		}));
	}, [
		activeCompanyId,
		workspaceMode,
		contextCurrencies,
		contextRateItems,
		contextExchangeRates
	]);
	(0, import_react.useEffect)(() => {
		const inputsMap = {};
		for (const [code, formState] of Object.entries(editForms)) if (formState && typeof formState.rate === "string" && formState.rate !== "") inputsMap[code] = formState.rate;
		if (Object.keys(inputsMap).length > 0) savePersistedRateInputs(inputsMap);
	}, [editForms]);
	const [historyModalOpen, setHistoryModalOpen] = (0, import_react.useState)(false);
	const [historyPair, setHistoryPair] = (0, import_react.useState)(null);
	const [historyItems, setHistoryItems] = (0, import_react.useState)([]);
	const [loadingHistory, setLoadingHistory] = (0, import_react.useState)(false);
	const [currencyModalOpen, setCurrencyModalOpen] = (0, import_react.useState)(() => !Array.isArray(contextCurrencies) || contextCurrencies.length === 0);
	const [editingCurrency, setEditingCurrency] = (0, import_react.useState)(null);
	const [currCode, setCurrCode] = (0, import_react.useState)("");
	const [currName, setCurrName] = (0, import_react.useState)("");
	const [currNameAr, setCurrNameAr] = (0, import_react.useState)("");
	const [currSymbol, setCurrSymbol] = (0, import_react.useState)("");
	const [currInitialRate, setCurrInitialRate] = (0, import_react.useState)("");
	const [currIsBase, setCurrIsBase] = (0, import_react.useState)(false);
	const [savingCurrency, setSavingCurrency] = (0, import_react.useState)(false);
	const [currencyError, setCurrencyError] = (0, import_react.useState)(null);
	const [confirmDeleteCode, setConfirmDeleteCode] = (0, import_react.useState)(null);
	const [deletingCurrencyCode, setDeletingCurrencyCode] = (0, import_react.useState)(null);
	const [newRateModalOpen, setNewRateModalOpen] = (0, import_react.useState)(false);
	const [newSource, setNewSource] = (0, import_react.useState)("USD");
	const [newTarget, setNewTarget] = (0, import_react.useState)("SDG");
	const [newRateValue, setNewRateValue] = (0, import_react.useState)("");
	const [newEffectiveFrom, setNewEffectiveFrom] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 16));
	const [newExpiryDate, setNewExpiryDate] = (0, import_react.useState)("");
	const [creatingRate, setCreatingRate] = (0, import_react.useState)(false);
	const [newRateError, setNewRateError] = (0, import_react.useState)(null);
	const [confirmDeleteRateId, setConfirmDeleteRateId] = (0, import_react.useState)(null);
	const fetchData = (0, import_react.useCallback)(async (forceResetAll = false, forceOverwriteCurrencies = []) => {
		try {
			setErrorBanner(null);
			if (workspaceModeRef.current === "PRODUCTION") {
				const companyCurrencies = Array.isArray(contextCurrenciesRef.current) ? contextCurrenciesRef.current : [];
				const baseFound = companyCurrencies.find((c) => c.isBase) || companyCurrencies[0];
				const resolvedBase = baseFound ? baseFound.code : "SDG";
				const companyRatesMap = contextExchangeRatesRef.current || {};
				const companyRateItems = reconcileRatesWithPersisted(contextRateItemsRef.current || [], companyRatesMap, [], companyCurrencies);
				setCurrencies(companyCurrencies);
				setBaseCurrency(resolvedBase);
				setRates(companyRateItems);
				if (onCurrenciesUpdatedRef.current) onCurrenciesUpdatedRef.current(companyCurrencies);
				if (forceResetAll) {
					dirtyRatesRef.current.clear();
					savePersistedRateInputs({});
				}
				setEditForms((prev) => mergeEditFormsState(prev, companyRateItems, companyRatesMap, {
					forceOverwriteAll: forceResetAll,
					forceOverwriteCurrencies,
					persistedDraftInputs: loadPersistedRateInputs()
				}));
				return;
			}
			let remoteCurrencies = [];
			let remoteRates = [];
			try {
				const [currData, rateData] = await Promise.all([api.getCurrencies(), api.getExchangeRates(true)]);
				remoteCurrencies = currData.currencies || [];
				remoteRates = rateData || [];
			} catch {}
			const persistedCurrencies = [...loadPersistedCurrencies(), ...contextCurrenciesRef.current || []];
			const mergedCurrencies = reconcileCurrenciesWithPersisted(remoteCurrencies, persistedCurrencies);
			const persistedMap = {
				...loadPersistedExchangeRates(),
				...contextExchangeRatesRef.current || {}
			};
			const persistedItems = loadPersistedExchangeRateItems();
			const reconciledRates = reconcileRatesWithPersisted(remoteRates, persistedMap, persistedItems, mergedCurrencies);
			setCurrencies(mergedCurrencies);
			setBaseCurrency("SDG");
			setRates(reconciledRates);
			syncCurrenciesStateRef.current(mergedCurrencies);
			syncExchangeRatesStateRef.current(reconciledRates);
			if (onCurrenciesUpdatedRef.current) onCurrenciesUpdatedRef.current(mergedCurrencies);
			if (forceResetAll) {
				dirtyRatesRef.current.clear();
				savePersistedRateInputs({});
			}
			setEditForms((prev) => mergeEditFormsState(prev, reconciledRates, persistedMap, {
				forceOverwriteAll: forceResetAll,
				forceOverwriteCurrencies,
				persistedDraftInputs: loadPersistedRateInputs()
			}));
		} catch (err) {
			console.warn("Exchange rates sync fallback:", err);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		fetchData(false);
	}, [fetchData]);
	const handleOpenAddCurrency = () => {
		playTactileClick(settings.soundEnabled);
		setEditingCurrency(null);
		setCurrCode("");
		setCurrName("");
		setCurrNameAr("");
		setCurrSymbol("");
		setCurrInitialRate("");
		setCurrIsBase(false);
		setCurrencyError(null);
		setCurrencyModalOpen(true);
	};
	const handleOpenEditCurrency = (c) => {
		playTactileClick(settings.soundEnabled);
		setEditingCurrency(c);
		setCurrCode(c.code);
		setCurrName(c.name);
		setCurrNameAr(c.nameAr || "");
		setCurrSymbol(c.symbol);
		setCurrIsBase(Boolean(c.isBase || c.code.toUpperCase() === "SDG"));
		const formRate = editForms[c.code]?.rate;
		const activeRate = rates.find((r) => r.sourceCurrency === c.code);
		const persistedRate = contextExchangeRates?.[c.code];
		setCurrInitialRate(formRate || (activeRate ? activeRate.rate.toString() : persistedRate ? persistedRate.toString() : ""));
		setCurrencyError(null);
		setCurrencyModalOpen(true);
	};
	const handleSaveCurrency = async (e) => {
		e.preventDefault();
		const resolved = resolveCurrencyInput({
			code: editingCurrency ? editingCurrency.code : currCode,
			name: currName,
			nameAr: currNameAr,
			symbol: currSymbol
		});
		const cleanCode = resolved.code;
		if (!cleanCode || cleanCode.length < 2 || cleanCode.length > 6) {
			setCurrencyError(isAr ? "يرجى اختيار عملة من القوالب السريعة أو كتابة رمز العملة أو اسمها (مثل USD أو SAR أو EGP)" : "Please select a currency template or enter a currency code or name (e.g., USD, SAR, EGP)");
			return;
		}
		const isSdgOrBase = cleanCode === "SDG" || currIsBase;
		const parsedInitialRate = parseNormalizedNumber(currInitialRate, 0);
		if (!isSdgOrBase && parsedInitialRate <= 0) {
			setCurrencyError(isAr ? "يرجى إدخال سعر الصرف مقابل الجنيه السوداني (SDG) بقيمة أكبر من 0" : "Please enter a valid exchange rate greater than 0 against the Sudanese Pound (SDG)");
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
				isBase: isSdgOrBase,
				initialRateToBase: !isSdgOrBase ? parsedInitialRate : void 0
			});
			setCurrencies((prev) => {
				const updated = prev.some((c) => c.code.toUpperCase() === cleanCode) ? prev.map((c) => c.code.toUpperCase() === cleanCode ? {
					...c,
					...savedCurr
				} : c) : [...prev, savedCurr];
				if (!isSdgOrBase && !updated.some((c) => c.isBase || c.code.toUpperCase() === "SDG")) return [{
					code: "SDG",
					name: "Sudanese Pound",
					nameAr: "جنيه سوداني",
					symbol: "ج.س",
					decimalPlaces: 2,
					isBase: true,
					isActive: true
				}, ...updated];
				return updated;
			});
			if (!isSdgOrBase && parsedInitialRate > 0) {
				const nowIso = (/* @__PURE__ */ new Date()).toISOString();
				const newRateItem = {
					id: `rate-${cleanCode.toLowerCase()}-sdg-${Date.now()}`,
					sourceCurrency: cleanCode,
					targetCurrency: "SDG",
					rate: parsedInitialRate,
					inverseRate: Math.round(1 / parsedInitialRate * 1e6) / 1e6,
					effectiveFrom: nowIso,
					expiryDate: null,
					isActive: true,
					sourceSymbol: resolved.symbol,
					targetSymbol: "ج.س",
					sourceName: resolved.name,
					targetName: "Sudanese Pound"
				};
				setRates((prev) => {
					return prev.some((r) => r.sourceCurrency.toUpperCase() === cleanCode) ? prev.map((r) => r.sourceCurrency.toUpperCase() === cleanCode ? {
						...r,
						...newRateItem
					} : r) : [...prev, newRateItem];
				});
				setEditForms((prev) => ({
					...prev,
					[cleanCode]: {
						rate: parsedInitialRate.toString(),
						effectiveFrom: nowIso.slice(0, 10),
						expiryDate: "",
						isSaving: false,
						saveSuccess: true,
						error: null
					}
				}));
			}
			playSuccessChime(settings.soundEnabled);
			setCurrencyModalOpen(false);
			setSuccessBanner(isSdgOrBase ? isAr ? `تمت إضافة/حفظ العملة الأساسية (${cleanCode} - ${resolved.nameAr}) بنجاح!` : `Base currency (${cleanCode} - ${resolved.name}) saved successfully!` : isAr ? `تمت إضافة/حفظ العملة (${cleanCode} - ${resolved.nameAr}) بسعر صرف ${parsedInitialRate} ج.س بنجاح!` : `Currency (${cleanCode} - ${resolved.name}) saved with rate ${parsedInitialRate} SDG!`);
			setTimeout(() => setSuccessBanner(null), 5e3);
		} catch (err) {
			setCurrencyError(err.message || "Failed to save currency");
		} finally {
			setSavingCurrency(false);
		}
	};
	const handleDeleteCurrency = async (code) => {
		if (code === "SDG") return;
		setDeletingCurrencyCode(code);
		try {
			playTactileClick(settings.soundEnabled);
			await removeCurrency(code);
			setCurrencies((prev) => prev.filter((c) => c.code.toUpperCase() !== code.toUpperCase()));
			setRates((prev) => prev.filter((r) => r.sourceCurrency.toUpperCase() !== code.toUpperCase()));
			playSuccessChime(settings.soundEnabled);
			setConfirmDeleteCode(null);
			setSuccessBanner(isAr ? `تم حذف العملة (${code}) بنجاح.` : `Currency (${code}) deleted successfully.`);
			setTimeout(() => setSuccessBanner(null), 4e3);
		} catch (err) {
			setErrorBanner(err.message || "Failed to delete currency");
		} finally {
			setDeletingCurrencyCode(null);
		}
	};
	const handleDeleteRateRecord = async (id, sourceCode) => {
		try {
			playTactileClick(settings.soundEnabled);
			try {
				await api.deleteExchangeRate(id);
			} catch {}
			const remainingPersistedItems = loadPersistedExchangeRateItems().filter((item) => item.id !== id && item.sourceCurrency.toUpperCase() !== sourceCode.toUpperCase());
			savePersistedExchangeRateItems(remainingPersistedItems);
			await removeCurrency(sourceCode);
			setRates((prev) => prev.filter((item) => item.id !== id && item.sourceCurrency.toUpperCase() !== sourceCode.toUpperCase()));
			playSuccessChime(settings.soundEnabled);
			setConfirmDeleteRateId(null);
			setSuccessBanner(isAr ? `تم حذف سجل سعر الصرف لعملة (${sourceCode}).` : `Exchange rate record for (${sourceCode}) removed.`);
			setTimeout(() => setSuccessBanner(null), 4e3);
		} catch (err) {
			setErrorBanner(err.message || "Failed to delete exchange rate");
		}
	};
	const updateDefaultRateForPair = (src, tgt) => {
		if (tgt === "SDG" && editForms[src]?.rate) {
			setNewRateValue(editForms[src].rate);
			return;
		}
		const existing = rates.find((r) => r.sourceCurrency === src && r.targetCurrency === tgt);
		if (existing) {
			setNewRateValue(existing.rate.toString());
			return;
		}
		if (tgt === "SDG" && contextExchangeRates?.[src]) {
			setNewRateValue(contextExchangeRates[src].toString());
			return;
		}
		const inverse = rates.find((r) => r.sourceCurrency === tgt && r.targetCurrency === src);
		if (inverse && inverse.rate > 0) {
			setNewRateValue((1 / inverse.rate).toFixed(6));
			return;
		}
		setNewRateValue("");
	};
	const handleSourceSelect = (selectedSrc) => {
		setNewRateError(null);
		let target = newTarget;
		if (selectedSrc === target) {
			const other = currencies.find((c) => c.code !== selectedSrc)?.code || (selectedSrc === "SDG" ? "USD" : "SDG");
			target = other;
			setNewTarget(other);
		}
		setNewSource(selectedSrc);
		updateDefaultRateForPair(selectedSrc, target);
	};
	const handleTargetSelect = (selectedTgt) => {
		setNewRateError(null);
		let source = newSource;
		if (selectedTgt === source) {
			const other = currencies.find((c) => c.code !== selectedTgt)?.code || (selectedTgt === "SDG" ? "USD" : "SDG");
			source = other;
			setNewSource(other);
		}
		setNewTarget(selectedTgt);
		updateDefaultRateForPair(source, selectedTgt);
	};
	const handleSwapNewPair = () => {
		playTactileClick(settings.soundEnabled);
		const oldSource = newSource;
		const oldTarget = newTarget;
		setNewSource(oldTarget);
		setNewTarget(oldSource);
		updateDefaultRateForPair(oldTarget, oldSource);
	};
	const handleSaveRate = async (sourceCurrency, targetCurrency) => {
		const form = editForms[sourceCurrency];
		if (!form) return;
		const numRate = parseNormalizedNumber(form.rate, 0);
		if (numRate <= 0) {
			setEditForms((prev) => ({
				...prev,
				[sourceCurrency]: {
					...prev[sourceCurrency],
					error: isAr ? "يجب أن يكون سعر الصرف رقماً موجباً أكبر من الصفر" : "Rate must be a strictly positive number greater than 0"
				}
			}));
			return;
		}
		setEditForms((prev) => ({
			...prev,
			[sourceCurrency]: {
				...prev[sourceCurrency],
				isSaving: true,
				error: null
			}
		}));
		try {
			playTactileClick(settings.soundEnabled);
			const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			const existingDateStr = rates.find((r) => r.sourceCurrency === sourceCurrency)?.effectiveFrom?.slice(0, 10);
			const effectiveIso = !form.effectiveFrom || form.effectiveFrom === todayStr || form.effectiveFrom === existingDateStr ? (/* @__PURE__ */ new Date()).toISOString() : new Date(form.effectiveFrom).toISOString();
			const saved = await updateExchangeRate({
				sourceCurrency,
				targetCurrency,
				rate: numRate,
				effectiveFrom: effectiveIso,
				expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : null
			});
			playSuccessChime(settings.soundEnabled);
			dirtyRatesRef.current.delete(sourceCurrency);
			setRates((prev) => prev.map((r) => r.sourceCurrency === sourceCurrency ? {
				...r,
				...saved
			} : r));
			setEditForms((prev) => ({
				...prev,
				[sourceCurrency]: {
					rate: saved.rate.toString(),
					effectiveFrom: saved.effectiveFrom.slice(0, 10),
					expiryDate: saved.expiryDate ? saved.expiryDate.slice(0, 10) : "",
					isSaving: false,
					saveSuccess: true,
					error: null
				}
			}));
			setSuccessBanner(isAr ? `تم تحديث سعر الصرف: 1 ${sourceCurrency} = ${saved.rate} ${targetCurrency} وحفظه في قاعدة البيانات والتخزين المحلي.` : `Exchange rate updated and persisted: 1 ${sourceCurrency} = ${saved.rate} ${targetCurrency}.`);
			setTimeout(() => setSuccessBanner(null), 4e3);
		} catch (err) {
			console.error("Failed to save exchange rate:", err);
			setEditForms((prev) => ({
				...prev,
				[sourceCurrency]: {
					...prev[sourceCurrency],
					isSaving: false,
					error: err.message || "Server rejected exchange rate update"
				}
			}));
		}
	};
	const handleOpenHistory = async (source, target) => {
		setHistoryPair({
			source,
			target
		});
		setHistoryModalOpen(true);
		setLoadingHistory(true);
		playTactileClick(settings.soundEnabled);
		try {
			const history = await api.getExchangeRateHistory(source, target);
			setHistoryItems(history);
		} catch {
			const localMatches = rates.filter((r) => r.sourceCurrency === source && r.targetCurrency === target);
			setHistoryItems(localMatches);
		} finally {
			setLoadingHistory(false);
		}
	};
	const handleCreateNewRate = async (e) => {
		e.preventDefault();
		const num = parseNormalizedNumber(newRateValue, 0);
		if (num <= 0) {
			setNewRateError(isAr ? "يجب إدخال سعر صرف صحيح أكبر من الصفر" : "Exchange rate must be a positive number greater than 0");
			return;
		}
		if (newSource === newTarget) {
			setNewRateError(isAr ? "لا يمكن أن تكون العملة المصدر والهدف متطابقتين" : "Source and target currency cannot be the same");
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
				effectiveFrom: newEffectiveFrom ? new Date(newEffectiveFrom).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
				expiryDate: newExpiryDate ? new Date(newExpiryDate).toISOString() : null
			});
			playSuccessChime(settings.soundEnabled);
			setNewRateModalOpen(false);
			setNewRateValue("");
			setNewExpiryDate("");
			setSuccessBanner(isAr ? `تم حفظ سعر الصرف لزوج ${newSource}/${newTarget}: 1 ${newSource} = ${saved.rate} ${newTarget}` : `Successfully configured rate for ${newSource}/${newTarget}: 1 ${newSource} = ${saved.rate} ${newTarget}`);
			setTimeout(() => setSuccessBanner(null), 4e3);
			await fetchData(false, [newSource]);
		} catch (err) {
			setNewRateError(err.message || "Failed to create exchange rate");
		} finally {
			setCreatingRate(false);
		}
	};
	const parsedNewRate = parseNormalizedNumber(newRateValue, 0);
	const inverseNewRate = parsedNewRate > 0 ? (1 / parsedNewRate).toFixed(6) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "w-5 h-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-sm text-white",
						children: isAr ? "تخصيص العملات وأسعار الصرف (بدون أي عملات افتراضية)" : "Full Currency & Exchange Rate Customization (Zero Default Currencies)"
					}), currencies.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppBadge, {
						variant: "amber",
						size: "sm",
						children: isAr ? `الأساسية: ${baseCurrency}` : `Base: ${baseCurrency}`
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-neutral-400 block",
					children: isAr ? "لا يتم إضافة أي عملات افتراضية تلقائياً — أضف عملاتك الخاصة فقط أو احذف أي عملة بحرية" : "No default currencies are added automatically — add only your own currencies and rates"
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 flex-wrap",
				children: [
					currencies.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": "clear-all-currencies-btn",
						onClick: async () => {
							playTactileClick(settings.soundEnabled);
							await clearAllCurrencies();
							setCurrencies([]);
							setRates([]);
							setEditForms({});
							setSuccessBanner(isAr ? "تم مسح جميع العملات وأسعار الصرف. يمكنك الآن إضافة عملاتك الخاصة من الصفر." : "All currencies and exchange rates cleared. You can now add your own currencies.");
							setTimeout(() => setSuccessBanner(null), 4e3);
						},
						className: "px-2.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "مسح جميع العملات" : "Clear All Currencies" })]
					}),
					currencies.length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						variant: "secondary",
						size: "sm",
						onClick: () => {
							playTactileClick(settings.soundEnabled);
							updateDefaultRateForPair(newSource, newTarget);
							setNewRateModalOpen(true);
						},
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "w-3.5 h-3.5 text-amber-400" }),
						children: isAr ? "تعديل زوج صرف" : "Set Pair Rate"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						variant: "amber",
						size: "sm",
						"data-testid": "open-add-currency-btn",
						onClick: handleOpenAddCurrency,
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }),
						children: isAr ? "إضافة عملة جديدة" : "Add Currency"
					})
				]
			})]
		}),
		successBanner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "w-4 h-4 shrink-0 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: successBanner
			})]
		}),
		errorBanner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0 text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: errorBanner
			})]
		}),
		currencyModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 p-4 rounded-2xl bg-neutral-950/90 border-2 border-amber-500/50 shadow-xl space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-neutral-800 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
					className: "text-sm font-bold text-amber-400 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: editingCurrency ? isAr ? `تعديل بيانات العملة (${editingCurrency.code})` : `Edit Currency (${editingCurrency.code})` : isAr ? "إضافة عملة مخصصة جديدة" : "Add Custom Currency" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-neutral-400 mt-0.5",
					children: isAr ? "أدخل رمز العملة واسمها وحدد ما إذا كانت العملة الأساسية أو أدخل سعر صرفها" : "Enter currency code, name, symbol, and whether it is the base currency or its exchange rate"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setCurrencyModalOpen(false),
					className: "p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors",
					"aria-label": "Close currency form",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSaveCurrency,
				noValidate: true,
				className: "space-y-4",
				children: [
					currencyError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0 text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: currencyError })]
					}),
					!editingCurrency && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-neutral-300 font-semibold block mb-1.5",
						children: isAr ? "اختيار سريع للعملة (اضغط لتعبئة رمز واسم العملة تلقائياً):" : "Quick currency templates (click to auto-fill currency details):"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: CURRENCY_TEMPLATES.map((tpl) => {
							const isSelected = currCode.toUpperCase() === tpl.code;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": `currency-template-btn-${tpl.code}`,
								onClick: () => {
									playTactileClick(settings.soundEnabled);
									setCurrCode(tpl.code);
									setCurrName(tpl.name);
									setCurrNameAr(tpl.nameAr);
									setCurrSymbol(tpl.symbol);
									setCurrIsBase(tpl.code === "SDG");
									if (tpl.code === "SDG") setCurrInitialRate("1");
									else if (workspaceMode === "PRACTICE" || !currInitialRate) setCurrInitialRate(tpl.defaultRate.toString());
									setCurrencyError(null);
								},
								className: `px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all ${isSelected ? "bg-amber-500 text-neutral-950 border-amber-400 font-bold" : "bg-neutral-900 hover:bg-amber-500/20 border-neutral-750 hover:border-amber-500/50 text-neutral-200"}`,
								children: [
									tpl.code,
									" (",
									tpl.nameAr,
									")"
								]
							}, tpl.code);
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-neutral-300 block mb-1",
								children: isAr ? "رمز العملة (مثل USD أو SAR أو SDG) *" : "Currency Code (e.g. USD, SAR, SDG) *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								dir: "ltr",
								"data-testid": "custom-currency-code-input",
								disabled: Boolean(editingCurrency),
								maxLength: 6,
								value: currCode,
								onChange: (e) => {
									const nextCode = e.target.value.toUpperCase();
									setCurrCode(nextCode);
									if (nextCode === "SDG") setCurrIsBase(true);
									else if (currCode === "SDG") setCurrIsBase(false);
									setCurrencyError(null);
								},
								placeholder: isAr ? "مثال: USD أو SAR" : "e.g. USD or SAR",
								className: "w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold uppercase focus:outline-none focus:border-amber-500 disabled:opacity-60"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-neutral-300 block mb-1",
								children: isAr ? "اسم العملة بالعربية" : "Arabic Name (الاسم بالعربية)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								"data-testid": "custom-currency-name-ar-input",
								value: currNameAr,
								onChange: (e) => {
									setCurrNameAr(e.target.value);
									setCurrencyError(null);
								},
								placeholder: isAr ? "مثال: دولار أمريكي / ريال سعودي" : "e.g. دولار أمريكي",
								className: "w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-neutral-300 block mb-1",
								children: isAr ? "اسم العملة بالإنجليزية (اختياري)" : "English Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								"data-testid": "custom-currency-name-en-input",
								value: currName,
								onChange: (e) => {
									setCurrName(e.target.value);
									setCurrencyError(null);
								},
								placeholder: "e.g. US Dollar / Saudi Riyal",
								className: "w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-neutral-300 block mb-1",
								children: isAr ? "الرمز المختصر (مثل $ أو ر.س)" : "Symbol (e.g. $, ر.س)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								"data-testid": "custom-currency-symbol-input",
								maxLength: 6,
								value: currSymbol,
								onChange: (e) => {
									setCurrSymbol(e.target.value);
									setCurrencyError(null);
								},
								placeholder: "مثال: $ أو ر.س",
								className: "w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-amber-500"
							})] })
						]
					}),
					!currIsBase && currCode.trim().toUpperCase() !== "SDG" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-amber-300 block",
								children: isAr ? `سعر الصرف مقابل الجنيه السوداني (SDG) — (1 ${currCode || currNameAr || "وحدة عملة"} = كم جنيه سوداني ج.س؟) *` : `Exchange Rate against Sudanese Pound (SDG) — (1 ${currCode || "Unit"} = ? SDG) *`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										inputMode: "decimal",
										dir: "ltr",
										"data-testid": "custom-currency-rate-input",
										value: currInitialRate,
										onChange: (e) => {
											setCurrInitialRate(normalizeNumberInput(e.target.value));
											setCurrencyError(null);
										},
										placeholder: isAr ? "أدخل سعر الصرف مقابل الجنيه السوداني (مثال: 2700)" : "Enter exchange rate against SDG (e.g. 2700)",
										className: "w-full bg-neutral-900 border border-amber-500/50 rounded-xl pl-3.5 pr-20 py-2.5 text-base text-white font-mono font-bold focus:outline-none focus:border-amber-400"
									}),
									currInitialRate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setCurrInitialRate(""),
										className: "absolute right-14 px-1.5 py-0.5 text-[10px] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded",
										children: isAr ? "مسح" : "CLR"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute right-3.5 text-xs font-mono font-bold text-amber-400 pointer-events-none",
										children: "SDG ج.س"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-1.5 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-neutral-400",
									children: isAr ? "قيم سريعة مقابل الجنيه السوداني:" : "Quick SDG rates:"
								}), [
									50,
									55,
									600,
									720,
									750,
									2500,
									2700,
									2800,
									3e3
								].map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										playTactileClick(settings.soundEnabled);
										setCurrInitialRate(preset.toString());
										setCurrencyError(null);
									},
									className: "px-2 py-0.5 rounded-lg bg-neutral-900 hover:bg-amber-500/20 border border-neutral-700 hover:border-amber-500/40 text-[11px] font-mono text-amber-300 transition-colors",
									children: [preset.toLocaleString(), " ج.س"]
								}, preset))]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-3 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								"data-testid": "custom-currency-is-base-checkbox",
								checked: currIsBase || currCode.trim().toUpperCase() === "SDG",
								onChange: (e) => setCurrIsBase(e.target.checked),
								className: "rounded border-neutral-700 text-amber-500 focus:ring-amber-500"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تعيين كعملة أساسية للمتجر (الجنيه السوداني SDG — سعر الصرف = 1)" : "Set as Store Base Currency (SDG — Rate = 1)" })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 border-t border-neutral-800 flex items-center justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							variant: "secondary",
							size: "sm",
							type: "button",
							onClick: () => setCurrencyModalOpen(false),
							children: isAr ? "إلغاء" : "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							variant: "amber",
							size: "sm",
							type: "submit",
							"data-testid": "save-custom-currency-btn",
							isLoading: savingCurrency,
							children: editingCurrency ? isAr ? "حفظ تعديلات العملة" : "Save Changes" : isAr ? "حفظ وإضافة العملة" : "Save & Add Currency"
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 p-3.5 bg-neutral-950/50 border border-neutral-800/90 rounded-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold text-neutral-200",
					children: isAr ? `قائمة العملات المضافة (${currencies.length})` : `Configured Currencies (${currencies.length})`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-neutral-400",
					children: isAr ? "يمكنك تعديل أو حذف أي عملة أو تعيينها كعملة أساسية" : "Edit, delete, or set any currency as base"
				})]
			}), currencies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-testid": "empty-currencies-state",
				className: "p-6 rounded-xl bg-neutral-900/60 border border-dashed border-neutral-800 text-center space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold text-neutral-200",
					children: isAr ? "لا توجد أي عملات مضافة حالياً (صفر عملات افتراضية)" : "No currencies added yet (Zero default currencies)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-neutral-400",
					children: isAr ? "اضغط على \"إضافة عملة جديدة\" أعلاه لإضافة عملتك الأساسية والعملات التي تتعامل بها فقط." : "Click \"Add Currency\" above to add your store base currency and any additional currencies you use."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2",
				children: currencies.map((c) => {
					const isConfirmingDelete = confirmDeleteCode === c.code;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-testid": `currency-card-${c.code}`,
						className: `p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${c.isBase ? "bg-amber-500/10 border-amber-500/40" : "bg-neutral-900/90 border-neutral-800 hover:border-neutral-700"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `px-2 py-1 rounded-lg font-mono text-xs font-extrabold shrink-0 ${c.isBase ? "bg-amber-500 text-neutral-950" : "bg-neutral-800 text-white border border-neutral-700"}`,
								children: c.code
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold text-white truncate",
									children: isAr && c.nameAr ? c.nameAr : c.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-neutral-400 font-mono",
									children: [isAr ? `الرمز: ${c.symbol}` : `Symbol: ${c.symbol}`, c.isBase ? isAr ? " • أساسية" : " • Base" : ""]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1 shrink-0",
							children: isConfirmingDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: deletingCurrencyCode === c.code,
									onClick: () => handleDeleteCurrency(c.code),
									className: "px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold",
									children: deletingCurrencyCode === c.code ? "..." : isAr ? "تأكيد الحذف" : "Confirm"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setConfirmDeleteCode(null),
									className: "px-1.5 py-1 rounded-lg bg-neutral-800 text-neutral-300 text-[10px]",
									children: isAr ? "إلغاء" : "Cancel"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								!c.isBase && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										playTactileClick(settings.soundEnabled);
										setBaseCurrency(c.code);
										setBaseCurrencyCode(c.code);
									},
									title: isAr ? "تعيين كعملة أساسية" : "Set as Base Currency",
									className: "px-1.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors",
									children: isAr ? "أساسية" : "Base"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleOpenEditCurrency(c),
									title: isAr ? "تعديل العملة" : "Edit Currency",
									className: "p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-3.5 h-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"data-testid": `delete-currency-btn-${c.code}`,
									onClick: () => {
										playTactileClick(settings.soundEnabled);
										setConfirmDeleteCode(c.code);
									},
									title: isAr ? "حذف العملة" : "Delete Currency",
									className: "p-1.5 rounded-lg text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/50 transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
								})
							] })
						})]
					}, c.code);
				})
			})]
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "py-8 flex items-center justify-center gap-2 text-xs text-neutral-400",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 animate-spin text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "جاري تحميل أسعار الصرف من قاعدة البيانات..." : "Loading exchange rates from Cloud SQL..." })]
		}) : rates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-8 text-center text-xs text-neutral-500",
			children: isAr ? "لا توجد أسعار صرف مسجلة. اضغط على \"إضافة عملة جديدة\" للبدء." : "No exchange rates found. Click \"Add Currency\" to configure one."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 space-y-3",
			children: rates.map((rateItem) => {
				const form = editForms[rateItem.sourceCurrency] || {
					rate: rateItem.rate.toString(),
					effectiveFrom: rateItem.effectiveFrom.slice(0, 10),
					expiryDate: "",
					isSaving: false,
					saveSuccess: false,
					error: null
				};
				const parsedVal = parseNormalizedNumber(form.rate, 0);
				const inverse = parsedVal > 0 ? (1 / parsedVal).toFixed(6) : "—";
				const isModified = form.rate !== rateItem.rate.toString();
				const isUsd = rateItem.sourceCurrency === "USD";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `p-4 rounded-2xl transition-all space-y-3 border ${isUsd ? "bg-amber-950/15 border-amber-500/40 hover:border-amber-500/60" : "bg-neutral-950/60 border-neutral-800 hover:border-neutral-750"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `font-mono font-bold text-sm px-2.5 py-1 rounded-lg border ${isUsd ? "bg-amber-500 text-neutral-950 border-amber-400" : "bg-neutral-850 text-white border-neutral-750"}`,
										children: [
											rateItem.sourceCurrency,
											" (",
											rateItem.sourceSymbol || rateItem.sourceCurrency,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "w-3.5 h-3.5 text-neutral-500" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-sm text-amber-400 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30",
										children: rateItem.targetCurrency
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-neutral-300 font-medium",
										children: rateItem.sourceName || rateItem.sourceCurrency
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] font-mono text-neutral-400",
										children: [
											"1 ",
											rateItem.targetCurrency,
											" ≈ ",
											inverse,
											" ",
											rateItem.sourceCurrency
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => handleOpenHistory(rateItem.sourceCurrency, rateItem.targetCurrency),
										className: "px-2 py-1 rounded-lg text-[11px] font-semibold text-neutral-300 hover:text-white bg-neutral-850 border border-neutral-750 hover:bg-neutral-800 transition-colors flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-3 h-3 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "السجل" : "History" })]
									}),
									confirmDeleteRateId === rateItem.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => handleDeleteRateRecord(rateItem.id, rateItem.sourceCurrency),
											className: "px-2 py-1 rounded-lg text-[10px] font-bold bg-rose-600 text-white",
											children: isAr ? "حذف السعر" : "Confirm"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setConfirmDeleteRateId(null),
											className: "px-1.5 py-1 rounded-lg text-[10px] bg-neutral-800 text-neutral-300",
											children: isAr ? "إلغاء" : "Cancel"
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setConfirmDeleteRateId(rateItem.id),
										title: isAr ? "حذف سجل سعر الصرف" : "Delete rate record",
										className: "p-1.5 rounded-lg text-rose-400/70 hover:text-rose-300 hover:bg-rose-950/40 transition-colors",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-semibold text-neutral-300 block mb-1",
											children: isAr ? `سعر الصرف (1 ${rateItem.sourceCurrency} كم يساوي بـ ${rateItem.targetCurrency}؟)` : `Exchange Rate (1 ${rateItem.sourceCurrency} in ${rateItem.targetCurrency})`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative flex items-center",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													inputMode: "decimal",
													dir: "ltr",
													value: form.rate,
													onKeyDown: (e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															handleSaveRate(rateItem.sourceCurrency, rateItem.targetCurrency);
														}
													},
													onBlur: () => {
														if (isModified && parsedVal > 0 && !form.isSaving) handleSaveRate(rateItem.sourceCurrency, rateItem.targetCurrency);
													},
													onChange: (e) => {
														const val = normalizeNumberInput(e.target.value);
														dirtyRatesRef.current.add(rateItem.sourceCurrency);
														setEditForms((prev) => ({
															...prev,
															[rateItem.sourceCurrency]: {
																...prev[rateItem.sourceCurrency] || form,
																rate: val,
																saveSuccess: false,
																error: null
															}
														}));
													},
													className: "w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-xl pl-3 pr-16 py-2.5 text-base text-white font-mono font-bold focus:outline-none focus:ring-1 focus:ring-amber-500",
													placeholder: "2700"
												}),
												form.rate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => {
														dirtyRatesRef.current.add(rateItem.sourceCurrency);
														setEditForms((prev) => ({
															...prev,
															[rateItem.sourceCurrency]: {
																...prev[rateItem.sourceCurrency] || form,
																rate: "",
																saveSuccess: false,
																error: null
															}
														}));
													},
													title: isAr ? "مسح الرقم لكتابة رقم جديد" : "Clear amount",
													className: "absolute right-11 px-1.5 py-0.5 text-[10px] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded",
													children: isAr ? "مسح" : "CLR"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "absolute right-2.5 text-xs font-mono font-semibold text-amber-400 pointer-events-none",
													children: rateItem.targetCurrency
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-1 mt-1.5",
											children: [(isUsd ? [
												2500,
												2600,
												2700,
												2800,
												3e3
											] : [
												500,
												720,
												750,
												1e3,
												2500
											]).map((presetVal) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													playTactileClick(settings.soundEnabled);
													dirtyRatesRef.current.add(rateItem.sourceCurrency);
													setEditForms((prev) => ({
														...prev,
														[rateItem.sourceCurrency]: {
															...prev[rateItem.sourceCurrency] || form,
															rate: presetVal.toString(),
															saveSuccess: false,
															error: null
														}
													}));
												},
												className: "px-2 py-0.5 rounded bg-neutral-850 hover:bg-amber-500/20 text-[10px] font-mono text-neutral-300 hover:text-amber-300 border border-neutral-750",
												children: presetVal
											}, presetVal)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													playTactileClick(settings.soundEnabled);
													dirtyRatesRef.current.add(rateItem.sourceCurrency);
													const cur = parseNormalizedNumber(form.rate, 0);
													setEditForms((prev) => ({
														...prev,
														[rateItem.sourceCurrency]: {
															...prev[rateItem.sourceCurrency] || form,
															rate: (cur + 50).toString(),
															saveSuccess: false,
															error: null
														}
													}));
												},
												className: "px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-[10px] font-mono text-emerald-300 border border-emerald-800/50",
												children: "+50"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-[11px] font-semibold text-neutral-300 block mb-1 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3 h-3 text-neutral-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تاريخ السريان" : "Effective Date" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: form.effectiveFrom,
										onChange: (e) => {
											setEditForms((prev) => ({
												...prev,
												[rateItem.sourceCurrency]: {
													...prev[rateItem.sourceCurrency],
													effectiveFrom: e.target.value,
													saveSuccess: false
												}
											}));
										},
										className: "w-full bg-neutral-900 border border-neutral-750 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-neutral-200 font-mono focus:outline-none"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "sm:col-span-3 flex items-center gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
										variant: isModified ? "amber" : "secondary",
										size: "sm",
										onClick: () => handleSaveRate(rateItem.sourceCurrency, rateItem.targetCurrency),
										isLoading: form.isSaving,
										leftIcon: form.saveSuccess ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-3.5 h-3.5" }),
										className: "w-full min-h-[42px] text-xs font-bold",
										children: form.saveSuccess ? isAr ? "تم الحفظ!" : "Saved!" : isAr ? "حفظ السعر" : "Save Rate"
									})
								})
							]
						}),
						form.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] text-rose-400 flex items-center gap-1 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-3 h-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: form.error })]
						})
					]
				}, rateItem.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
			isOpen: historyModalOpen,
			onClose: () => setHistoryModalOpen(false),
			title: `Exchange Rate History: ${historyPair?.source} / ${historyPair?.target}`,
			description: "Audit log of all configured rates, effective dates, and validity windows",
			maxWidth: "lg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [loadingHistory ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-8 flex items-center justify-center gap-2 text-xs text-neutral-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 animate-spin text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loading historical audit log..." })]
				}) : historyItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-8 text-center text-xs text-neutral-500",
					children: "No historical rate changes recorded for this pair."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs border-collapse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-neutral-800 text-neutral-400",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
									className: "py-2 px-3 font-semibold",
									children: [
										"Rate (",
										historyPair?.target,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-3 font-semibold",
									children: "Inverse"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-3 font-semibold",
									children: "Effective From"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-3 font-semibold",
									children: "Expiry Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-3 font-semibold",
									children: "Status"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-neutral-800/60 font-mono",
							children: historyItems.map((item, idx) => {
								const isCurrent = idx === 0 && item.isActive;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: isCurrent ? "bg-amber-500/5" : "",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3 font-bold text-white",
											children: item.rate.toFixed(4)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3 text-neutral-400",
											children: item.inverseRate ? item.inverseRate.toFixed(6) : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3 text-neutral-300",
											children: new Date(item.effectiveFrom).toLocaleDateString()
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3 text-neutral-400",
											children: item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "Current (No Expiry)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3",
											children: isCurrent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppBadge, {
												variant: "success",
												size: "sm",
												children: "Active"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppBadge, {
												variant: "neutral",
												size: "sm",
												children: "Archived"
											})
										})
									]
								}, item.id);
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-3 border-t border-neutral-800 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						variant: "secondary",
						size: "sm",
						onClick: () => setHistoryModalOpen(false),
						children: "Close"
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
			isOpen: newRateModalOpen,
			onClose: () => setNewRateModalOpen(false),
			title: isAr ? "تحديد أو تعديل سعر صرف عملة" : "Add / Update Exchange Rate",
			description: isAr ? "اختر العملة واكتب المبلغ الجديد مباشرة أو استخدم الأزرار السريعة" : "Configure a currency conversion rate relative to base SDG or another currency",
			maxWidth: "md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleCreateNewRate,
				className: "space-y-4",
				children: [
					newRateError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0 text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: newRateError })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-neutral-300 block mb-1",
									children: isAr ? "العملة المصدر (من)" : "Source Currency"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: newSource,
									onChange: (e) => handleSourceSelect(e.target.value),
									className: "w-full bg-neutral-900 border border-neutral-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono",
									children: currencies.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: c.code,
										children: [
											c.code,
											" — ",
											isAr && c.nameAr ? c.nameAr : c.name,
											" (",
											c.symbol,
											")"
										]
									}, c.code))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: handleSwapNewPair,
									title: "Swap source and target (تبديل العملتين)",
									className: "p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white border border-neutral-700 transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "w-4 h-4" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-neutral-300 block mb-1",
									children: isAr ? "العملة الهدف (إلى)" : "Target Currency"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: newTarget,
									onChange: (e) => handleTargetSelect(e.target.value),
									className: "w-full bg-neutral-900 border border-neutral-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono",
									children: currencies.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: c.code,
										children: [
											c.code,
											" — ",
											isAr && c.nameAr ? c.nameAr : c.name,
											" ",
											c.isBase ? "(Base)" : ""
										]
									}, c.code))
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs font-semibold text-neutral-300",
								children: [
									"1 ",
									newSource,
									" = ? ",
									newTarget,
									" (",
									isAr ? "اكتب المبلغ هنا" : "Enter Rate",
									")"
								]
							}), parsedNewRate > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-mono text-amber-400",
								children: [
									"1 ",
									newTarget,
									" ≈ ",
									inverseNewRate,
									" ",
									newSource
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									inputMode: "decimal",
									dir: "ltr",
									required: true,
									value: newRateValue,
									onFocus: (e) => e.target.select(),
									onChange: (e) => {
										const normalized = normalizeNumberInput(e.target.value);
										setNewRateValue(normalized);
										if (newRateError) setNewRateError(null);
									},
									placeholder: "2700",
									className: "w-full bg-neutral-900 border border-neutral-750 rounded-xl pl-3.5 pr-16 py-2.5 text-lg text-white font-mono font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
								}),
								newRateValue && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setNewRateValue(""),
									className: "absolute right-12 px-1.5 py-0.5 text-[10px] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded",
									children: isAr ? "مسح" : "CLR"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute right-3 top-3 text-xs font-mono font-bold text-amber-400 pointer-events-none",
									children: newTarget
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5 mt-2",
							children: [[
								2500,
								2600,
								2700,
								2800,
								3e3
							].map((val) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									playTactileClick(settings.soundEnabled);
									setNewRateValue(val.toString());
								},
								className: "px-2 py-0.5 rounded-lg bg-neutral-850 hover:bg-amber-500/20 text-[11px] font-mono text-neutral-300 border border-neutral-750 transition-colors",
								children: val
							}, val)), [
								10,
								50,
								100
							].map((inc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									playTactileClick(settings.soundEnabled);
									const current = parseNormalizedNumber(newRateValue, 0);
									setNewRateValue((current + inc).toString());
								},
								className: "px-2 py-0.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-[11px] font-mono text-emerald-300 border border-emerald-800/50 transition-colors",
								children: ["+", inc]
							}, inc))]
						})
					] }),
					parsedNewRate > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 bg-neutral-950/80 border border-neutral-800 rounded-xl space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-neutral-300 font-medium flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "معاينة التحويل المباشر" : "Conversion Preview" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs font-mono text-neutral-400",
							children: [
								"100 ",
								newSource,
								" =",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-white",
									children: (parsedNewRate * 100).toLocaleString("en-US", { maximumFractionDigits: 2 })
								}),
								" ",
								newTarget
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-neutral-300 block mb-1",
							children: isAr ? "تاريخ السريان" : "Effective Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "datetime-local",
							value: newEffectiveFrom,
							onChange: (e) => setNewEffectiveFrom(e.target.value),
							className: "w-full bg-neutral-900 border border-neutral-750 rounded-xl px-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-neutral-300 block mb-1",
							children: isAr ? "تاريخ الانتهاء (اختياري)" : "Expiry Date (Optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "datetime-local",
							value: newExpiryDate,
							onChange: (e) => setNewExpiryDate(e.target.value),
							className: "w-full bg-neutral-900 border border-neutral-750 rounded-xl px-3 py-2 text-xs text-neutral-200 font-mono focus:outline-none"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-3 border-t border-neutral-800 flex items-center justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							variant: "secondary",
							size: "sm",
							type: "button",
							onClick: () => setNewRateModalOpen(false),
							children: isAr ? "إلغاء" : "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							variant: "amber",
							size: "sm",
							type: "submit",
							isLoading: creatingRate,
							children: isAr ? "حفظ سعر الصرف" : "Save Exchange Rate"
						})]
					})
				]
			})
		})
	] });
};
// src/components/settings/UsersPermissionsSection.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var PERMISSION_ITEMS = [
	{
		key: "canCheckout",
		labelEn: "POS Sales & Checkout",
		labelAr: "إجراء المبيعات وإصدار الفواتير"
	},
	{
		key: "canApplyDiscounts",
		labelEn: "Apply Discounts",
		labelAr: "منح الخصومات وتعديلها"
	},
	{
		key: "canManageProducts",
		labelEn: "Add / Edit Products",
		labelAr: "إضافة وتعديل المنتجات والباركود"
	},
	{
		key: "canEditPrices",
		labelEn: "Modify Product Prices",
		labelAr: "تعديل أسعار الشراء والبيع"
	},
	{
		key: "canManageInventory",
		labelEn: "Stock Adjustments",
		labelAr: "إدارة المخزون والجرد والتوريد"
	},
	{
		key: "canVoidTransactions",
		labelEn: "Void / Refund Invoices",
		labelAr: "إلغاء واسترجاع الفواتير"
	},
	{
		key: "canManageExchangeRates",
		labelEn: "Manage Exchange Rates",
		labelAr: "تحديث أسعار صرف العملات"
	},
	{
		key: "canViewReports",
		labelEn: "Financial Reports & Ledger",
		labelAr: "عرض التقارير المالية والأرباح"
	},
	{
		key: "canManageUsers",
		labelEn: "Manage Users & Permissions",
		labelAr: "إدارة المستخدمين والصلاحيات"
	}
];
var AVATAR_COLOR_OPTIONS = [
	"#f59e0b",
	"#10b981",
	"#38bdf8",
	"#a855f7",
	"#f43f5e",
	"#ec4899",
	"#14b8a6"
];
var UsersPermissionsSection = () => {
	const { settings, users, activeSessions, currentUser, switchCurrentUser, saveUser, deleteUserAccount, clearAllUserAccounts, deactivateUserAccount, reactivateUserAccount, resetUserPasswordOrPin, toggleUserActiveSession, syncTransactions, isSyncing, lastSyncedAt, branches, activeBranchId, setActiveBranchId, createBranch, updateBranch, deleteBranch, currentCompany } = usePOS();
	const isAr = settings.language === "ar";
	const [isAccountFormOpen, setIsAccountFormOpen] = (0, import_react.useState)(false);
	const [editingAccountId, setEditingAccountId] = (0, import_react.useState)(null);
	const [newNameAr, setNewNameAr] = (0, import_react.useState)("");
	const [newNameEn, setNewNameEn] = (0, import_react.useState)("");
	const [newUsername, setNewUsername] = (0, import_react.useState)("");
	const [newEmail, setNewEmail] = (0, import_react.useState)("");
	const [newPhone, setNewPhone] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [newSystemRole, setNewSystemRole] = (0, import_react.useState)("COMPANY_OWNER");
	const [newBranchId, setNewBranchId] = (0, import_react.useState)(activeBranchId || branches[0]?.id || "");
	const [newAssignedBranchIds, setNewAssignedBranchIds] = (0, import_react.useState)(activeBranchId ? [activeBranchId] : branches[0]?.id ? [branches[0].id] : []);
	const [newTerminalAr, setNewTerminalAr] = (0, import_react.useState)("");
	const [newTerminalEn, setNewTerminalEn] = (0, import_react.useState)("");
	const [newPin, setNewPin] = (0, import_react.useState)("");
	const [newAvatarColor, setNewAvatarColor] = (0, import_react.useState)("#f59e0b");
	const [confirmDeleteUserId, setConfirmDeleteUserId] = (0, import_react.useState)(null);
	const [confirmClearAllAccounts, setConfirmClearAllAccounts] = (0, import_react.useState)(false);
	const [isAddingBranch, setIsAddingBranch] = (0, import_react.useState)(false);
	const [editingBranchId, setEditingBranchId] = (0, import_react.useState)(null);
	const [branchNameEn, setBranchNameEn] = (0, import_react.useState)("");
	const [branchNameAr, setBranchNameAr] = (0, import_react.useState)("");
	const [branchCode, setBranchCode] = (0, import_react.useState)("");
	const [branchCity, setBranchCity] = (0, import_react.useState)("");
	const [branchPhone, setBranchPhone] = (0, import_react.useState)("");
	const [confirmDeleteBranchId, setConfirmDeleteBranchId] = (0, import_react.useState)(null);
	const [expandedUserMatrixId, setExpandedUserMatrixId] = (0, import_react.useState)(null);
	const [resettingPasswordUserId, setResettingPasswordUserId] = (0, import_react.useState)(null);
	const [resetNewPassword, setResetNewPassword] = (0, import_react.useState)("");
	const [resetNewPin, setResetNewPin] = (0, import_react.useState)("");
	const [actionFeedback, setActionFeedback] = (0, import_react.useState)(null);
	const [copiedLink, setCopiedLink] = (0, import_react.useState)(false);
	const sharedPosUrl = typeof window !== "undefined" ? window.location.origin : "https://localhost:3000";
	const handleCopyPosLink = async () => {
		try {
			await navigator.clipboard.writeText(sharedPosUrl);
			setCopiedLink(true);
			setTimeout(() => setCopiedLink(false), 2500);
		} catch {
			setCopiedLink(true);
			setTimeout(() => setCopiedLink(false), 2500);
		}
	};
	const openCreateAccountForm = () => {
		setEditingAccountId(null);
		setNewNameAr("");
		setNewNameEn("");
		setNewUsername("");
		setNewEmail("");
		setNewPhone("");
		setNewPassword("");
		setNewSystemRole(users.length === 0 ? "COMPANY_OWNER" : "CASHIER");
		const defaultBr = activeBranchId || branches[0]?.id || "";
		setNewBranchId(defaultBr);
		setNewAssignedBranchIds(defaultBr ? [defaultBr] : []);
		setNewTerminalAr("");
		setNewTerminalEn("");
		setNewPin("");
		setNewAvatarColor("#f59e0b");
		setIsAccountFormOpen(true);
	};
	const openEditAccountForm = (u) => {
		setEditingAccountId(u.id);
		setNewNameAr(u.nameAr || u.name || "");
		setNewNameEn(u.name || "");
		setNewUsername(u.username || "");
		setNewEmail(u.email || "");
		setNewPhone(u.phone || "");
		setNewPassword("");
		setNewSystemRole(mapLegacyRoleToSystemRole(u.systemRole || u.role));
		const primaryBr = u.branchId || activeBranchId || branches[0]?.id || "";
		setNewBranchId(primaryBr);
		setNewAssignedBranchIds(Array.isArray(u.assignedBranchIds) && u.assignedBranchIds.length > 0 ? u.assignedBranchIds : primaryBr ? [primaryBr] : []);
		setNewTerminalAr(u.terminalNameAr || "");
		setNewTerminalEn(u.terminalName || "");
		setNewPin(u.pin || "");
		setNewAvatarColor(u.avatarColor || "#f59e0b");
		setIsAccountFormOpen(true);
	};
	const handleTogglePermission = (user, permKey) => {
		const nextPerms = {
			...user.permissions,
			[permKey]: !user.permissions[permKey]
		};
		saveUser({
			...user,
			permissions: nextPerms
		});
	};
	const handleToggleCapability = (user, capCode) => {
		const currentCaps = deriveCapabilitiesFromUser(user);
		const nextCaps = currentCaps.includes(capCode) ? currentCaps.filter((c) => c !== capCode) : [...currentCaps, capCode];
		const nextPerms = deriveLegacyPermissionsFromCapabilities(nextCaps);
		saveUser({
			...user,
			systemRole: user.systemRole === "COMPANY_OWNER" ? "COMPANY_OWNER" : "CUSTOM_ROLE",
			capabilities: nextCaps,
			permissions: nextPerms
		});
	};
	const handleEnableAllCapabilities = (user) => {
		const allCodes = CAPABILITY_GROUPS.flatMap((g) => g.capabilities.map((c) => c.code));
		const nextPerms = deriveLegacyPermissionsFromCapabilities(allCodes);
		saveUser({
			...user,
			capabilities: allCodes,
			permissions: nextPerms
		});
	};
	const handleChangeSystemRole = (user, sysRole) => {
		setActionFeedback(null);
		const legacyRole = mapSystemRoleToLegacyRole(sysRole);
		const defaultCaps = getDefaultCapabilitiesForRole(sysRole);
		const derivedPerms = deriveLegacyPermissionsFromCapabilities(defaultCaps);
		saveUser({
			...user,
			role: legacyRole,
			systemRole: sysRole,
			capabilities: defaultCaps,
			permissions: derivedPerms
		});
	};
	const handleToggleEmployeeBranch = (user, branchId) => {
		const currentList = Array.isArray(user.assignedBranchIds) && user.assignedBranchIds.length > 0 ? user.assignedBranchIds : [user.branchId || "branch-main"];
		const nextList = currentList.includes(branchId) ? currentList.length > 1 ? currentList.filter((id) => id !== branchId) : currentList : [...currentList, branchId];
		saveUser({
			...user,
			branchId: nextList[0],
			assignedBranchIds: nextList
		});
	};
	const handleSaveAccount = (e) => {
		e.preventDefault();
		if (!newNameAr.trim() && !newNameEn.trim()) {
			setActionFeedback({
				type: "error",
				message: isAr ? "يرجى إدخال اسم صاحب الحساب." : "Please enter the account holder name."
			});
			return;
		}
		const existingUser = editingAccountId ? users.find((u) => u.id === editingAccountId) : void 0;
		const legacyRole = mapSystemRoleToLegacyRole(newSystemRole);
		const defaultCaps = existingUser && existingUser.systemRole === newSystemRole && existingUser.capabilities?.length ? existingUser.capabilities : getDefaultCapabilitiesForRole(newSystemRole);
		const derivedPerms = deriveLegacyPermissionsFromCapabilities(defaultCaps) || DEFAULT_ROLE_PERMISSIONS[legacyRole];
		const id = editingAccountId || `usr-${Date.now().toString(36)}`;
		const primaryBr = newBranchId || activeBranchId || branches[0]?.id || "branch-main";
		const assignedBrs = newAssignedBranchIds.length > 0 ? newAssignedBranchIds : [primaryBr];
		const saved = saveUser({
			id,
			companyId: currentCompany.id,
			branchId: primaryBr,
			assignedBranchIds: assignedBrs,
			name: newNameEn.trim() || newNameAr.trim(),
			nameAr: newNameAr.trim() || newNameEn.trim(),
			username: newUsername.trim(),
			email: newEmail.trim() || void 0,
			phone: newPhone.trim() || void 0,
			password: newPassword.trim() || void 0,
			role: legacyRole,
			systemRole: newSystemRole,
			capabilities: defaultCaps,
			pin: newPin.trim(),
			avatarColor: newAvatarColor,
			terminalName: newTerminalEn.trim() || newTerminalAr.trim(),
			terminalNameAr: newTerminalAr.trim() || newTerminalEn.trim(),
			isActive: existingUser ? existingUser.isActive !== false : true,
			lastActiveAt: (/* @__PURE__ */ new Date()).toISOString(),
			permissions: derivedPerms
		});
		if (users.length === 0 || editingAccountId === currentUser.id) switchCurrentUser(saved.id);
		setIsAccountFormOpen(false);
		setEditingAccountId(null);
		setActionFeedback({
			type: "success",
			message: editingAccountId ? isAr ? `تم حفظ تعديلات حساب (${saved.nameAr || saved.name}) بنجاح.` : `Account (${saved.name}) updated successfully.` : isAr ? `تم إنشاء حساب (${saved.nameAr || saved.name}) وتخصيص صلاحياته بنجاح.` : `Account (${saved.name}) created and customized successfully.`
		});
	};
	const handlePermanentDeleteAccount = (u) => {
		deleteUserAccount(u.id);
		setConfirmDeleteUserId(null);
		setActionFeedback({
			type: "success",
			message: isAr ? `تم حذف الحساب (${u.nameAr || u.name}) نهائياً.` : `Account (${u.name}) permanently deleted.`
		});
	};
	const handleOpenAddBranch = () => {
		setEditingBranchId(null);
		setBranchNameEn("");
		setBranchNameAr("");
		setBranchCode("");
		setBranchCity("");
		setBranchPhone("");
		setIsAddingBranch(true);
	};
	const handleOpenEditBranch = (br) => {
		setEditingBranchId(br.id);
		setBranchNameEn(br.name || "");
		setBranchNameAr(br.nameAr || "");
		setBranchCode(br.code || "");
		setBranchCity(br.city || "");
		setBranchPhone(br.phone || "");
		setIsAddingBranch(true);
	};
	const handleSaveBranch = async (e) => {
		e.preventDefault();
		if (!branchNameEn.trim() && !branchNameAr.trim()) return;
		if (editingBranchId) {
			updateBranch(editingBranchId, {
				name: branchNameEn.trim() || branchNameAr.trim(),
				nameAr: branchNameAr.trim() || branchNameEn.trim(),
				code: (branchCode.trim() || "BR-01").toUpperCase(),
				city: branchCity.trim(),
				phone: branchPhone.trim()
			});
			setActionFeedback({
				type: "success",
				message: isAr ? "تم تحديث بيانات الفرع بنجاح." : "Branch updated successfully."
			});
		} else {
			await createBranch({
				name: branchNameEn.trim() || branchNameAr.trim(),
				nameAr: branchNameAr.trim() || branchNameEn.trim(),
				code: branchCode.trim() || `BR-0${branches.length + 1}`,
				city: branchCity.trim(),
				phone: branchPhone.trim(),
				isMainBranch: branches.length === 0
			});
			setActionFeedback({
				type: "success",
				message: isAr ? "تمت إضافة الفرع الجديد بنجاح." : "New branch added successfully."
			});
		}
		setBranchNameEn("");
		setBranchNameAr("");
		setBranchCode("");
		setBranchCity("");
		setBranchPhone("");
		setEditingBranchId(null);
		setIsAddingBranch(false);
	};
	const handleDeactivateToggle = async (user) => {
		setActionFeedback(null);
		if (user.isActive !== false) {
			const res = await deactivateUserAccount(user.id, "Deactivated via Account Management");
			if (!res.ok) setActionFeedback({
				type: "error",
				message: res.error || "Cannot deactivate user."
			});
			else setActionFeedback({
				type: "success",
				message: isAr ? `تم إيقاف حساب (${user.nameAr || user.name}) مؤقتاً.` : `Paused account (${user.name}).`
			});
		} else {
			await reactivateUserAccount(user.id);
			setActionFeedback({
				type: "success",
				message: isAr ? `تمت إعادة تفعيل حساب (${user.nameAr || user.name}) بنجاح.` : `Reactivated ${user.name} account.`
			});
		}
	};
	const handleConfirmResetPassword = async (userId) => {
		setActionFeedback(null);
		const res = await resetUserPasswordOrPin(userId, resetNewPassword.trim() || void 0, resetNewPin.trim() || void 0);
		if (!res.ok) {
			setActionFeedback({
				type: "error",
				message: res.error || "Failed to reset credentials."
			});
			return;
		}
		setResettingPasswordUserId(null);
		setResetNewPassword("");
		setResetNewPin("");
		setActionFeedback({
			type: "success",
			message: isAr ? "تم تحديث كلمة المرور / رمز الدخول (PIN) بنجاح." : "Password / Terminal PIN updated successfully."
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-emerald-400" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-bold text-sm text-white flex items-center gap-2 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تخصيص وإدارة الحسابات والفروع والصلاحيات (بدون أي حسابات افتراضية)" : "Full Account, Branch & Permission Customization (Zero Default Accounts)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold",
							children: [
								users.length,
								" ",
								isAr ? "حساب مضاف" : "Accounts"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-neutral-400 mt-0.5",
						children: isAr ? "أضف حساباتك الخاصة فقط، عدّل الأسماء والأدوار والـ PIN ونقاط البيع، أو احذف أي حساب بحرية تامة." : "Add only your own accounts, edit names, roles, PINs, terminals, capabilities, or delete accounts freely."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 flex-wrap shrink-0",
					children: [
						users.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: confirmClearAllAccounts ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 bg-rose-950/70 border border-rose-500/40 px-2 py-1 rounded-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-rose-200 font-bold",
									children: isAr ? "مسح كل الحسابات؟" : "Clear all?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"data-testid": "confirm-clear-all-accounts-btn",
									onClick: () => {
										clearAllUserAccounts();
										setConfirmClearAllAccounts(false);
										setActionFeedback({
											type: "success",
											message: isAr ? "تم مسح جميع الحسابات بنجاح." : "All accounts cleared successfully."
										});
									},
									className: "px-2 py-0.5 rounded-lg bg-rose-600 text-white text-[10px] font-black",
									children: isAr ? "نعم، مسح الكل" : "Yes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setConfirmClearAllAccounts(false),
									className: "px-1.5 py-0.5 rounded-lg bg-neutral-800 text-neutral-300 text-[10px]",
									children: isAr ? "إلغاء" : "Cancel"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							type: "button",
							variant: "danger",
							size: "sm",
							onClick: () => setConfirmClearAllAccounts(true),
							leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }),
							"data-testid": "clear-all-accounts-btn",
							children: isAr ? "مسح جميع الحسابات" : "Clear All Accounts"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							type: "button",
							variant: "secondary",
							size: "sm",
							onClick: handleOpenAddBranch,
							leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "w-3.5 h-3.5" }),
							"data-testid": "open-add-branch-btn",
							children: isAr ? "إضافة فرع" : "Add Branch"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							type: "button",
							variant: "amber",
							size: "sm",
							onClick: openCreateAccountForm,
							leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "w-3.5 h-3.5" }),
							"data-testid": "open-add-user-btn",
							children: isAr ? "إضافة حساب جديد" : "Add Account"
						})
					]
				})]
			}),
			actionFeedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-testid": "user-management-feedback-banner",
				className: `p-3 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 ${actionFeedback.type === "error" ? "bg-rose-500/10 border-rose-500/30 text-rose-300" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [actionFeedback.type === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: actionFeedback.message })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setActionFeedback(null),
					className: "text-[11px] underline opacity-80 hover:opacity-100",
					children: isAr ? "إغلاق" : "Dismiss"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-testid": "branch-management-panel",
				className: "p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "w-4 h-4 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-black text-white",
								children: isAr ? `فروع المتجر / الشركة (${branches.length})` : `Store / Company Branches (${branches.length})`
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-neutral-400",
							children: isAr ? "اضغط على الفرع لتفعيله أو تعديل اسمه وكوده" : "Click a branch to activate or edit/delete it"
						})]
					}),
					isAddingBranch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveBranch,
						"data-testid": "create-branch-form",
						className: "p-3.5 rounded-xl bg-neutral-900 border border-amber-500/40 grid grid-cols-1 sm:grid-cols-5 gap-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: isAr ? "اسم الفرع بالعربية *" : "Branch Name (AR)",
								value: branchNameAr,
								onChange: (e) => setBranchNameAr(e.target.value),
								className: "px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								"data-testid": "new-branch-name-input",
								placeholder: isAr ? "اسم الفرع بالإنجليزية" : "Branch Name (EN)",
								value: branchNameEn,
								onChange: (e) => setBranchNameEn(e.target.value),
								className: "px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: isAr ? "كود الفرع (اختياري)" : "Branch Code",
								value: branchCode,
								onChange: (e) => setBranchCode(e.target.value.toUpperCase()),
								className: "px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-white"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: isAr ? "المدينة / الموقع (اختياري)" : "City / Location",
								value: branchCity,
								onChange: (e) => setBranchCity(e.target.value),
								className: "px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									"data-testid": "submit-new-branch-btn",
									className: "flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black inline-flex items-center justify-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: editingBranchId ? isAr ? "تحديث الفرع" : "Update" : isAr ? "حفظ الفرع" : "Save Branch" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setIsAddingBranch(false);
										setEditingBranchId(null);
									},
									className: "py-2 px-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold",
									children: isAr ? "إلغاء" : "Cancel"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-2.5",
						children: branches.map((br) => {
							const isSelected = br.id === activeBranchId;
							const isConfirmingBrDelete = confirmDeleteBranchId === br.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-testid": `branch-card-${br.id}`,
								className: `p-3 rounded-xl border text-start transition-all flex items-center justify-between gap-2 ${isSelected ? "bg-amber-500/15 border-amber-500/50 text-white" : "bg-neutral-900/70 border-neutral-800 text-neutral-300 hover:border-neutral-700"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setActiveBranchId(br.id),
									className: "min-w-0 flex-1 text-start",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-extrabold truncate",
											children: isAr ? br.nameAr || br.name : br.name
										}), br.code && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-1.5 py-0.5 rounded bg-neutral-950 text-amber-400 font-mono text-[10px] font-bold",
											children: br.code
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-neutral-400 truncate mt-0.5",
										children: [
											br.city || (isAr ? "بدون موقع محدد" : "No location set"),
											" ",
											br.isMainBranch ? isAr ? "• رئيسي" : "• Main" : ""
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-1 shrink-0",
									children: isConfirmingBrDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											deleteBranch(br.id);
											setConfirmDeleteBranchId(null);
										},
										className: "px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold",
										children: isAr ? "حذف" : "Del"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setConfirmDeleteBranchId(null),
										className: "px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px]",
										children: isAr ? "لا" : "No"
									})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => handleOpenEditBranch(br),
											className: "p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800",
											title: isAr ? "تعديل الفرع" : "Edit Branch",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-3.5 h-3.5" })
										}),
										branches.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setConfirmDeleteBranchId(br.id),
											className: "p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50",
											title: isAr ? "حذف الفرع" : "Delete Branch",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
										}),
										isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-amber-400 shrink-0" })
									] })
								})]
							}, br.id);
						})
					})
				]
			}),
			isAccountFormOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSaveAccount,
				"data-testid": "add-employee-form",
				className: "p-4 rounded-2xl bg-neutral-950/95 border-2 border-amber-500/50 space-y-4 shadow-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-neutral-800 pb-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: editingAccountId ? isAr ? "تعديل بيانات الحساب وتخصيص الدور والصلاحيات" : "Edit Account Details, Role & Terminal" : isAr ? "إضافة حساب جديد وتخصيص كامل بياناته وصلاحياته" : "Create New Custom Account & Assign Role" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setIsAccountFormOpen(false);
								setEditingAccountId(null);
							},
							className: "p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
								label: isAr ? "اسم صاحب الحساب (عربي) *" : "Account Name (Arabic) *",
								placeholder: isAr ? "اكتب الاسم بالعربية..." : "Arabic Name",
								value: newNameAr,
								onChange: (e) => setNewNameAr(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
								label: isAr ? "اسم صاحب الحساب (إنجليزي - اختياري)" : "Account Name (English)",
								placeholder: isAr ? "اكتب الاسم بالإنجليزية..." : "English Name",
								value: newNameEn,
								onChange: (e) => setNewNameEn(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-neutral-300 block mb-1.5",
								children: isAr ? "الدور الوظيفي ونوع الحساب" : "Account Role"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								"data-testid": "new-employee-role-select",
								value: newSystemRole,
								onChange: (e) => setNewSystemRole(e.target.value),
								className: "w-full min-h-[42px] px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-white focus:outline-none focus:border-amber-500",
								children: SYSTEM_ROLE_DEFINITIONS.map((def) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: def.code,
									children: isAr ? def.labelAr : def.labelEn
								}, def.code))
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-4 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
								label: isAr ? "اسم المستخدم (اختياري)" : "Username (Optional)",
								placeholder: isAr ? "بدون قيمة افتراضية" : "Custom username",
								value: newUsername,
								onChange: (e) => setNewUsername(e.target.value),
								dir: "ltr"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
								label: isAr ? "رقم الهاتف (اختياري)" : "Phone Number (Optional)",
								placeholder: isAr ? "رقم الهاتف..." : "Phone number",
								value: newPhone,
								onChange: (e) => setNewPhone(e.target.value),
								dir: "ltr"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
								label: isAr ? "البريد الإلكتروني (اختياري)" : "Email (Optional)",
								placeholder: isAr ? "البريد الإلكتروني..." : "Email address",
								value: newEmail,
								onChange: (e) => setNewEmail(e.target.value),
								dir: "ltr"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
								label: isAr ? "رمز الدخول السريع PIN (اختياري)" : "Quick PIN (Optional)",
								placeholder: isAr ? "أدخل رمز PIN خاص بك" : "Custom PIN",
								value: newPin,
								onChange: (e) => setNewPin(e.target.value),
								dir: "ltr"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-4 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
								label: isAr ? "كلمة المرور (اختياري)" : "Password (Optional)",
								type: "password",
								placeholder: isAr ? "كلمة مرور الحساب..." : "Account password",
								value: newPassword,
								onChange: (e) => setNewPassword(e.target.value),
								dir: "ltr"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-neutral-300 block mb-1.5",
								children: isAr ? "الفرع التابع له الحساب" : "Assigned Branch"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: newBranchId,
								onChange: (e) => {
									setNewBranchId(e.target.value);
									if (!newAssignedBranchIds.includes(e.target.value)) setNewAssignedBranchIds((prev) => [...prev, e.target.value]);
								},
								className: "w-full min-h-[42px] px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-white",
								children: branches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: b.id,
									children: [
										isAr ? b.nameAr || b.name : b.name,
										" (",
										b.code,
										")"
									]
								}, b.id))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
								label: isAr ? "اسم نقطة البيع / الجهاز (اختياري)" : "Terminal Name (AR)",
								placeholder: isAr ? "مثال: الكاشير الأول" : "Terminal name AR",
								value: newTerminalAr,
								onChange: (e) => setNewTerminalAr(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-neutral-300 block mb-1.5",
								children: isAr ? "اللون المميز للحساب" : "Account Badge Color"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2 pt-1.5",
								children: AVATAR_COLOR_OPTIONS.map((color) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setNewAvatarColor(color),
									style: { backgroundColor: color },
									className: `w-6 h-6 rounded-full border-2 transition-transform ${newAvatarColor === color ? "border-white scale-110" : "border-transparent opacity-70 hover:opacity-100"}`,
									"aria-label": `Select color ${color}`
								}, color))
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-2 pt-2 border-t border-neutral-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							type: "button",
							variant: "ghost",
							size: "sm",
							onClick: () => {
								setIsAccountFormOpen(false);
								setEditingAccountId(null);
							},
							children: isAr ? "إلغاء" : "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							type: "submit",
							variant: "amber",
							size: "sm",
							"data-testid": "submit-new-employee-btn",
							children: editingAccountId ? isAr ? "حفظ تعديلات الحساب" : "Save Account Changes" : isAr ? "حفظ وإضافة الحساب" : "Save & Activate Account"
						})]
					})
				]
			}),
			users.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-testid": "empty-accounts-state",
				className: "p-8 rounded-2xl bg-neutral-950/70 border border-dashed border-neutral-800 text-center space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-6 h-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 max-w-md mx-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-sm font-extrabold text-white",
							children: isAr ? "لا توجد أي حسابات افتراضية — قائمة الحسابات فارغة وجاهزة لتخصيصك" : "Zero Default Accounts — Your Accounts List is Clean"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-neutral-400",
							children: isAr ? "لم يتم إضافة أي حسابات افتراضية لم تقم بإدخالها. اضغط على الزر أدناه لإضافة حسابك الخاص وتحديد اسمه ودوره وصلاحياته." : "No unentered default accounts were added. Click below to create your own account and customize its role and permissions."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							type: "button",
							variant: "amber",
							size: "md",
							onClick: openCreateAccountForm,
							leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "w-4 h-4" }),
							"data-testid": "empty-state-add-account-btn",
							children: isAr ? "إضافة أول حساب خاص بك" : "Add Your First Custom Account"
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: users.map((u) => {
					activeSessions.some((s) => s.userId === u.id);
					const isCurrent = u.id === currentUser.id;
					const isDeactivated = u.isActive === false;
					const sysRoleCode = mapLegacyRoleToSystemRole(u.systemRole || u.role);
					const sysRoleDef = SYSTEM_ROLE_DEFINITIONS.find((d) => d.code === sysRoleCode) || SYSTEM_ROLE_DEFINITIONS[0];
					const userCaps = deriveCapabilitiesFromUser(u);
					const isExpanded = expandedUserMatrixId === u.id;
					const isConfirmingDelete = confirmDeleteUserId === u.id;
					const assignedBranches = Array.isArray(u.assignedBranchIds) && u.assignedBranchIds.length > 0 ? u.assignedBranchIds : [u.branchId || branches[0]?.id || "branch-main"];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-testid": `user-permission-card-${u.id}`,
						className: `p-3.5 rounded-2xl border space-y-3 transition-opacity ${isDeactivated ? "bg-neutral-950/40 border-rose-900/40 opacity-75" : "bg-neutral-950/70 border-neutral-800"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-neutral-800/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: u.avatarColor ? {
											borderColor: `${u.avatarColor}66`,
											color: u.avatarColor
										} : void 0,
										className: "w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center font-bold text-xs border border-neutral-700",
										children: (isAr && u.nameAr ? u.nameAr : u.name || "U").slice(0, 2)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs sm:text-sm font-bold text-white",
												children: isAr && u.nameAr ? u.nameAr : u.name
											}),
											u.name && u.nameAr && u.name !== u.nameAr && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] text-neutral-400",
												children: [
													"(",
													isAr ? u.name : u.nameAr,
													")"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `px-2 py-0.5 rounded text-[10px] font-bold border ${sysRoleDef.badgeClass}`,
												children: isAr ? sysRoleDef.labelAr : sysRoleDef.labelEn
											}),
											isDeactivated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold",
												children: isAr ? "موقوف مؤقتاً" : "Paused"
											}),
											isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-2 py-0.5 rounded bg-amber-500 text-neutral-950 text-[10px] font-bold",
												children: isAr ? "الحساب النشط حالياً" : "Current Active"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-3 text-[11px] text-neutral-400 mt-0.5",
										children: [
											(u.terminalNameAr || u.terminalName) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "w-3 h-3 text-neutral-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr && u.terminalNameAr ? u.terminalNameAr : u.terminalName })]
											}),
											u.pin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1 font-mono",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-3 h-3 text-neutral-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["PIN: ", u.pin] })]
											}),
											u.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1 font-mono",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3 h-3 text-neutral-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: u.phone })]
											}),
											u.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-3 h-3 text-neutral-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: u.email })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-emerald-400 font-mono text-[10px]",
												children: [
													userCaps.length,
													" ",
													isAr ? "صلاحية مفعلة" : "capabilities"
												]
											})
										]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											"aria-label": `Role for ${u.name}`,
											"data-testid": `user-role-select-${u.id}`,
											value: sysRoleCode,
											onChange: (e) => handleChangeSystemRole(u, e.target.value),
											className: "px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-bold text-neutral-200 focus:outline-none focus:border-amber-500",
											children: SYSTEM_ROLE_DEFINITIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: opt.code,
												children: isAr ? opt.labelAr : opt.labelEn
											}, opt.code))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											"data-testid": `edit-user-btn-${u.id}`,
											onClick: () => openEditAccountForm(u),
											className: "px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-amber-300 text-xs font-bold inline-flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تعديل الحساب" : "Edit" })]
										}),
										!isCurrent && !isDeactivated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"data-testid": `switch-to-user-btn-${u.id}`,
											onClick: () => switchCurrentUser(u.id),
											className: "px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold transition-colors",
											children: isAr ? "تبديل للحساب" : "Switch"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											"data-testid": `reset-password-btn-${u.id}`,
											onClick: () => setResettingPasswordUserId((prev) => prev === u.id ? null : u.id),
											className: "px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-bold inline-flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-3 h-3 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "رمز / كلمة مرور" : "PIN / Pass" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											"data-testid": `toggle-user-active-btn-${u.id}`,
											onClick: () => handleDeactivateToggle(u),
											className: `px-2.5 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1 ${isDeactivated ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300" : "bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-400"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isDeactivated ? isAr ? "تفعيل" : "Activate" : isAr ? "إيقاف مؤقت" : "Pause" })]
										}),
										isConfirmingDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1 bg-rose-950/80 border border-rose-500/40 px-2 py-1 rounded-xl",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"data-testid": `confirm-delete-user-btn-${u.id}`,
												onClick: () => handlePermanentDeleteAccount(u),
												className: "px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black",
												children: isAr ? "تأكيد الحذف النهائي" : "Confirm Delete"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setConfirmDeleteUserId(null),
												className: "px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px]",
												children: isAr ? "إلغاء" : "Cancel"
											})]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											"data-testid": `delete-user-btn-${u.id}`,
											onClick: () => setConfirmDeleteUserId(u.id),
											className: "px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold inline-flex items-center gap-1",
											title: isAr ? "حذف الحساب نهائياً" : "Delete Account Permanently",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "حذف" : "Delete" })]
										})
									]
								})]
							}),
							resettingPasswordUserId === u.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-testid": `reset-password-panel-${u.id}`,
								className: "p-3 rounded-xl bg-neutral-900 border border-amber-500/40 flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "password",
										placeholder: isAr ? "كلمة مرور جديدة" : "New Password",
										value: resetNewPassword,
										onChange: (e) => setResetNewPassword(e.target.value),
										className: "px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: isAr ? "رمز PIN جديد" : "New PIN",
										value: resetNewPin,
										onChange: (e) => setResetNewPin(e.target.value),
										className: "px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-white w-36"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handleConfirmResetPassword(u.id),
										className: "px-3 py-1.5 rounded-lg bg-amber-500 text-neutral-950 text-xs font-black",
										children: isAr ? "حفظ التغيير" : "Update Credentials"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] font-bold text-neutral-400 flex items-center gap-1 me-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "w-3.5 h-3.5 text-sky-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "الفروع المصرح بها للحساب:" : "Assigned Branches:" })]
								}), branches.map((br) => {
									const hasBranch = assignedBranches.includes(br.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handleToggleEmployeeBranch(u, br.id),
										className: `px-2 py-0.5 rounded-lg border text-[11px] font-bold transition-colors ${hasBranch ? "bg-sky-500/15 border-sky-500/40 text-sky-300" : "bg-neutral-900 border-neutral-800 text-neutral-500"}`,
										children: isAr ? br.nameAr || br.name : br.name
									}, br.id);
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 mb-2 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] font-bold text-neutral-400 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تخصيص صلاحيات الحساب:" : "Customize Account Permissions:" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => handleEnableAllCapabilities(u),
											className: "text-[11px] font-bold text-emerald-400 hover:text-emerald-300",
											children: isAr ? "منح كامل الصلاحيات" : "Grant All Capabilities"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											"data-testid": `expand-capabilities-btn-${u.id}`,
											onClick: () => setExpandedUserMatrixId((prev) => prev === u.id ? null : u.id),
											className: "text-[11px] font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isExpanded ? isAr ? "إخفاء الصلاحيات التفصيلية (46)" : "Hide 46 Granular Capabilities" : isAr ? "تخصيص الـ 46 صلاحية التفصيلية" : "Customize All 46 Capabilities" }), isExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-3.5 h-3.5" })]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-2",
									children: PERMISSION_ITEMS.map((perm) => {
										const enabled = Boolean(u.permissions?.[perm.key]);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: `flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs cursor-pointer transition-colors ${enabled ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200 font-semibold" : "bg-neutral-900/60 border-neutral-800 text-neutral-500"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: enabled,
												onChange: () => handleTogglePermission(u, perm.key),
												className: "rounded border-neutral-700 text-emerald-500 focus:ring-emerald-500"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: isAr ? perm.labelAr : perm.labelEn
											})]
										}, perm.key);
									})
								}),
								isExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									"data-testid": `granular-capability-matrix-${u.id}`,
									className: "mt-3 p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-3",
									children: CAPABILITY_GROUPS.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800/90 space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] font-black text-amber-300 pb-1 border-b border-neutral-800",
											children: isAr ? group.labelAr : group.labelEn
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-1",
											children: group.capabilities.map((cap) => {
												const hasCap = userCaps.includes(cap.code);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "flex items-center justify-between gap-2 text-[11px] text-neutral-300 cursor-pointer py-0.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "truncate",
														children: isAr ? cap.labelAr : cap.labelEn
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "checkbox",
														checked: hasCap,
														onChange: () => handleToggleCapability(u, cap.code),
														className: "accent-emerald-500 shrink-0"
													})]
												}, cap.code);
											})
										})]
									}, group.groupKey))
								})
							] })
						]
					}, u.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3.5 rounded-2xl bg-sky-950/25 border border-sky-500/30 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-4 h-4 text-sky-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-sky-200",
								children: isAr ? "ربط ومزامنة الأجهزة المتعددة لنفس الشركة" : "Multi-Device POS Terminal Synchronization"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono text-[10px] font-bold",
							children: currentCompany.id
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-amber-300 truncate",
							dir: "ltr",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "w-3.5 h-3.5 text-neutral-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: sharedPosUrl
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								type: "button",
								variant: "secondary",
								size: "sm",
								onClick: handleCopyPosLink,
								leftIcon: copiedLink ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5" }),
								children: copiedLink ? isAr ? "تم نسخ الرابط!" : "Link Copied!" : isAr ? "نسخ رابط الجهاز" : "Copy Device Link"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								type: "button",
								variant: "amber",
								size: "sm",
								onClick: syncTransactions,
								isLoading: isSyncing,
								leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }),
								children: isAr ? "مزامنة الأجهزة الآن" : "Sync Devices Now"
							})]
						})]
					}),
					lastSyncedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] text-emerald-400",
						children: isAr ? `✓ جاهز للعمل أوفلاين ومزامنة البيانات محلياً: ${lastSyncedAt.toLocaleTimeString()}` : `✓ Offline-ready & local sync active: ${lastSyncedAt.toLocaleTimeString()}`
					})
				]
			})
		]
	});
};
// src/components/settings/TrainingCenterSection.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var TrainingCenterSection = () => {
	const { settings, currentUser, workspaceMode, currentCompany, trainingTourProgress, startTrainingTour, resetTrainingTour, enterPracticeMode, exitPracticeMode, openOnboardingModal, onboardingChecklist } = usePOS();
	const isAr = settings.language === "ar";
	const completionPercent = calculateTourCompletionPercent(trainingTourProgress, TRAINING_TOUR_STEPS);
	const checklistItems = [
		{
			id: "companyProfileConfigured",
			done: onboardingChecklist.companyProfileConfigured,
			labelEn: "1. Company Profile Configured",
			labelAr: "1. إعداد ملف الشركة والبيانات القانونية"
		},
		{
			id: "currenciesConfigured",
			done: onboardingChecklist.currenciesConfigured,
			labelEn: "2. Base Currency (SDG) & Exchange Rates Set",
			labelAr: "2. ضبط العملة الأساسية (SDG) وأسعار الصرف"
		},
		{
			id: "branchCreated",
			done: onboardingChecklist.branchCreated,
			labelEn: "3. Initial Main Branch Created",
			labelAr: "3. إنشاء الفرع الرئيسي للشركة"
		},
		{
			id: "firstProductsAdded",
			done: onboardingChecklist.firstProductsAdded,
			labelEn: "4. Product Catalog & Barcodes Added",
			labelAr: "4. إضافة الأصناف والمنتجات والباركود"
		},
		{
			id: "firstEmployeeCreated",
			done: onboardingChecklist.firstEmployeeCreated,
			labelEn: "5. Employee Accounts & Roles Configured",
			labelAr: "5. إنشاء حسابات الموظفين وتخصيص الأدوار"
		},
		{
			id: "firstSaleCompleted",
			done: onboardingChecklist.firstSaleCompleted,
			labelEn: "6. First POS Sale Completed",
			labelAr: "6. إتمام أول عملية بيع عبر الكاشير"
		},
		{
			id: "inventoryReviewed",
			done: onboardingChecklist.inventoryReviewed,
			labelEn: "7. Inventory & Stock Movements Reviewed",
			labelAr: "7. مراجعة المخزون وحركات الجرد والتوريد"
		},
		{
			id: "guidedTourCompleted",
			done: onboardingChecklist.guidedTourCompleted,
			labelEn: "8. 13-Step Guided Tour Completed",
			labelAr: "8. إتمام الجولة الإرشادية الشاملة (13 قسماً)"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
		"data-testid": "training-center-section",
		className: "space-y-5 bg-neutral-900/95 border-neutral-800 p-5 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 pb-4 border-b border-neutral-800/90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3.5 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base sm:text-lg font-extrabold text-white tracking-tight",
										children: isAr ? "مركز التدريب والتأسيس والجولة التعريفية" : "Onboarding & Guided Training Center"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-neutral-600",
										"aria-hidden": "true",
										children: "·"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-xs font-bold ${workspaceMode === "PRACTICE" ? "text-amber-400" : "text-emerald-400"}`,
										children: workspaceMode === "PRACTICE" ? isAr ? "وضع التدريب التجريبي" : "Practice Mode" : isAr ? currentCompany.displayNameAr || currentCompany.displayName : currentCompany.displayName
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-neutral-400 tabular-nums",
								children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									"نسبة إتمام التدريب:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold text-amber-400",
										children: [completionPercent, "%"]
									}),
									" ·",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-neutral-200",
										children: trainingTourProgress.completedStepIds.length
									}),
									" ",
									"من",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-neutral-200",
										children: TRAINING_TOUR_STEPS.length
									}),
									" ",
									"قسماً مكتملاً"
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									"Tour Completion:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold text-amber-400",
										children: [completionPercent, "%"]
									}),
									" ·",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-neutral-200",
										children: trainingTourProgress.completedStepIds.length
									}),
									" ",
									"of",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-neutral-200",
										children: TRAINING_TOUR_STEPS.length
									}),
									" ",
									"modules completed"
								] })
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 shrink-0",
						children: [trainingTourProgress.completedStepIds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							variant: "secondary",
							size: "sm",
							"data-testid": "settings-reset-tour-btn",
							onClick: () => {
								playTactileClick(settings.soundEnabled);
								resetTrainingTour();
							},
							leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3.5 h-3.5" }),
							className: "whitespace-nowrap",
							children: isAr ? "إعادة الضبط" : "Reset"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							variant: "amber",
							size: "sm",
							"data-testid": "settings-start-full-tour-btn",
							onClick: () => {
								playTactileClick(settings.soundEnabled);
								startTrainingTour(0);
							},
							leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-3.5 h-3.5" }),
							className: "whitespace-nowrap",
							children: isAr ? "بدء الجولة التدريبية الشاملة" : "Start Full Guided Tour"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-neutral-800/60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "settings-toggle-practice-mode-btn",
							onClick: () => {
								playTactileClick(settings.soundEnabled);
								if (workspaceMode === "PRACTICE") exitPracticeMode();
								else enterPracticeMode();
							},
							className: "px-3.5 py-2 rounded-xl bg-neutral-950 hover:bg-amber-500/15 border border-neutral-800 hover:border-amber-500/40 text-amber-300 text-xs font-bold inline-flex items-center gap-2 transition-colors whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: workspaceMode === "PRACTICE" ? isAr ? "الخروج من وضع التدريب" : "Exit Practice Mode" : isAr ? "دخول وضع التدريب التجريبي" : "Enter Practice Mode" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "settings-open-company-wizard-btn",
							onClick: () => {
								playTactileClick(settings.soundEnabled);
								openOnboardingModal("create-company");
							},
							className: "px-3.5 py-2 rounded-xl bg-neutral-950 hover:bg-emerald-500/15 border border-neutral-800 hover:border-emerald-500/40 text-emerald-300 text-xs font-bold inline-flex items-center gap-2 transition-colors whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تأسيس شركة جديدة" : "Create New Company" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 w-full sm:w-56",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 h-1.5 rounded-full bg-neutral-950 border border-neutral-800 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-amber-500 transition-all duration-300",
								style: { width: `${completionPercent}%` }
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] font-mono font-bold text-amber-400 tabular-nums shrink-0",
							children: [completionPercent, "%"]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-testid": "onboarding-checklist-card",
				className: "p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/90 space-y-3.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "w-4 h-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs sm:text-sm font-bold text-neutral-100",
								children: isAr ? "قائمة التحقق من جاهزية الشركة والتأسيس" : "Company Setup & Operational Readiness Checklist"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-mono font-bold text-emerald-400 tabular-nums",
							children: [
								onboardingChecklist.completedCount,
								" / ",
								onboardingChecklist.totalCount,
								" ·",
								" ",
								onboardingChecklist.completionPercent,
								"%"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-emerald-500 transition-all duration-300",
							style: { width: `${onboardingChecklist.completionPercent}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5",
						children: checklistItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"data-testid": `checklist-item-${item.id}`,
							className: `px-3 py-2.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold leading-snug transition-colors ${item.done ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200" : "bg-neutral-900/60 border-neutral-800/80 text-neutral-300"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: `w-4 h-4 shrink-0 ${item.done ? "text-emerald-400" : "text-neutral-600"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? item.labelAr : item.labelEn })]
						}, item.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5",
				children: TRAINING_TOUR_STEPS.map((step, idx) => {
					const isCompleted = trainingTourProgress.completedStepIds.includes(step.id);
					const isAccessible = isTourStepAccessibleForUser(step, currentUser);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": `settings-launch-tour-step-${idx + 1}`,
						onClick: () => {
							playTactileClick(settings.soundEnabled);
							startTrainingTour(idx);
						},
						className: "p-3.5 rounded-2xl bg-neutral-950/70 hover:bg-neutral-900 border border-neutral-800/90 hover:border-amber-500/40 text-start transition-all flex items-start justify-between gap-3 group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-1.5 text-xs font-bold text-white group-hover:text-amber-300 transition-colors leading-snug",
									children: [isCompleted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? step.titleAr : step.titleEn })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-neutral-400 line-clamp-2 leading-relaxed",
									children: isAr ? step.subtitleAr : step.subtitleEn
								}),
								!isAccessible && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 text-[10px] text-amber-400 font-semibold pt-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "حسب صلاحية الدور" : "Role-restricted view" })]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold text-amber-400 shrink-0 pt-0.5 whitespace-nowrap",
							children: isAr ? "ابدأ ←" : "Start →"
						})]
					}, step.id);
				})
			})
		]
	});
};
// src/components/settings/BackupRestoreCenterSection.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var LOCAL_BACKUPS_STORAGE_PREFIX = "dqnamo_pos_company_backups_v1_";
function simpleHashHex(text) {
	let h1 = 3735928559 ^ text.length;
	let h2 = 1103547991 ^ text.length;
	for (let i = 0, ch; i < text.length; i++) {
		ch = text.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
	h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
	return ((h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0")).repeat(4);
}
function buildLocalFallbackEnvelope(params) {
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const dep = resolveBackupModuleDependencies(params.selectedModules, { autoIncludeHardDependencies: params.autoIncludeHardDependencies });
	const filtered = filterPayloadByIncludedModules(params.payload, dep.modulesIncluded);
	filtered.employees = (filtered.employees || []).map((u) => scrubSensitiveUserFields(u));
	const { recordCounts, totalRecords } = computeBackupModuleRecordCounts(filtered, dep.modulesIncluded);
	const jsonStr = JSON.stringify(filtered);
	const payloadChecksum = simpleHashHex(jsonStr);
	const modChecksums = {};
	for (const m of ALL_BACKUP_MODULE_IDS) modChecksums[m] = simpleHashHex(`${m}:${recordCounts[m]}`);
	const backupId = params.backupType === "PRE_RESTORE_CHECKPOINT" ? `chk-local-${Date.now().toString(36)}` : `bkp-${nowIso.slice(0, 10).replace(/-/g, "")}-${Date.now().toString(36).slice(-4)}`;
	const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
	return {
		formatSignature: "DQNAMO_POS_BACKUP_V1",
		formatVersion: "1.0.0",
		createdAt: nowIso,
		encrypted: false,
		compression: "none",
		manifest: {
			backupId,
			backupType: params.backupType,
			schemaVersion: "2025.05.1",
			appVersion: "2.4.0",
			createdAt: nowIso,
			createdByUserId: params.userId,
			createdByUsername: params.username,
			notes: params.notes,
			sourceCompany: {
				companyId: filtered.companyProfile.id,
				code: filtered.companyProfile.code || "CMP-MAIN",
				legalName: filtered.companyProfile.legalName || "Store",
				displayName: filtered.companyProfile.displayName || filtered.companyProfile.legalName || "Store",
				displayNameAr: filtered.companyProfile.displayNameAr,
				baseCurrency: filtered.companyProfile.baseCurrency || "SDG",
				businessType: filtered.companyProfile.businessType
			},
			modulesIncluded: dep.modulesIncluded,
			autoIncludedDependencies: dep.autoIncludedDependencies,
			dependencyWarnings: dep.dependencyWarnings,
			recordCounts,
			moduleChecksumsSha256: modChecksums,
			totalRecords
		},
		payloadChecksumSha256: payloadChecksum,
		payloadData: b64
	};
}
function triggerBrowserDownload(envelope, fileName) {
	const jsonText = JSON.stringify(envelope, null, 2);
	const blob = new Blob([jsonText], { type: "application/json;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = fileName.endsWith(".backup") ? fileName : `${fileName}.backup`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
var BackupRestoreCenterSection = () => {
	const { settings, currentCompany, currentUser, workspaceMode, hasCapability, collectClientBackupDataset, hydrateCompanyFromBackupPayload } = usePOS();
	const isAr = settings.language === "ar";
	const canView = hasCapability("backup.view");
	const canCreate = hasCapability("backup.create");
	const canRestore = hasCapability("backup.restore");
	const canMerge = hasCapability("backup.merge") || hasCapability("backup.import");
	const canDelete = hasCapability("backup.delete");
	const [activeTab, setActiveTab] = (0, import_react.useState)("create");
	const [statusBanner, setStatusBanner] = (0, import_react.useState)(null);
	const [isBusy, setIsBusy] = (0, import_react.useState)(false);
	const [backupScopeMode, setBackupScopeMode] = (0, import_react.useState)("FULL_COMPANY");
	const [selectedModules, setSelectedModules] = (0, import_react.useState)([...ALL_BACKUP_MODULE_IDS]);
	const [autoIncludeDeps, setAutoIncludeDeps] = (0, import_react.useState)(true);
	const [enableEncryption, setEnableEncryption] = (0, import_react.useState)(false);
	const [encryptionPassword, setEncryptionPassword] = (0, import_react.useState)("");
	const [backupNotes, setBackupNotes] = (0, import_react.useState)("");
	const [savedBackups, setSavedBackups] = (0, import_react.useState)([]);
	const [backupAuditLogs, setBackupAuditLogs] = (0, import_react.useState)([]);
	const fileInputRef = (0, import_react.useRef)(null);
	const [loadedEnvelope, setLoadedEnvelope] = (0, import_react.useState)(null);
	const [loadedFileName, setLoadedFileName] = (0, import_react.useState)("");
	const [decryptionPassword, setDecryptionPassword] = (0, import_react.useState)("");
	const [inspectedManifest, setInspectedManifest] = (0, import_react.useState)(null);
	const [inspectedIntegrityOk, setInspectedIntegrityOk] = (0, import_react.useState)(false);
	const [restoreMode, setRestoreMode] = (0, import_react.useState)("ORIGINAL_COMPANY");
	const [restoreOwnerPassword, setRestoreOwnerPassword] = (0, import_react.useState)("");
	const [allowCrossCompanyOverride, setAllowCrossCompanyOverride] = (0, import_react.useState)(false);
	const [newCompanyName, setNewCompanyName] = (0, import_react.useState)("");
	const [newCompanyNameAr, setNewCompanyNameAr] = (0, import_react.useState)("");
	const [newCompanyBusinessType, setNewCompanyBusinessType] = (0, import_react.useState)("retail");
	const [newOwnerName, setNewOwnerName] = (0, import_react.useState)("");
	const [newOwnerUsername, setNewOwnerUsername] = (0, import_react.useState)("");
	const [newOwnerPassword, setNewOwnerPassword] = (0, import_react.useState)("");
	const [newOwnerConfirmPassword, setNewOwnerConfirmPassword] = (0, import_react.useState)("");
	const [mergePreviewReport, setMergePreviewReport] = (0, import_react.useState)(null);
	const [moduleStrategies, setModuleStrategies] = (0, import_react.useState)({});
	const [itemResolutions, setItemResolutions] = (0, import_react.useState)({});
	const [applyIncomingStockDelta, setApplyIncomingStockDelta] = (0, import_react.useState)(false);
	const [mergeFilterTab, setMergeFilterTab] = (0, import_react.useState)("ALL");
	const [mergeOwnerPassword, setMergeOwnerPassword] = (0, import_react.useState)("");
	const [lastMergeExecutionSummary, setLastMergeExecutionSummary] = (0, import_react.useState)(null);
	const [deleteTargetBackupId, setDeleteTargetBackupId] = (0, import_react.useState)(null);
	const [deleteOwnerPassword, setDeleteOwnerPassword] = (0, import_react.useState)("");
	const liveClientDataset = (0, import_react.useMemo)(() => collectClientBackupDataset(), [collectClientBackupDataset]);
	const liveModuleCounts = (0, import_react.useMemo)(() => computeBackupModuleRecordCounts(liveClientDataset, ALL_BACKUP_MODULE_IDS).recordCounts, [liveClientDataset]);
	const dependencyResolution = (0, import_react.useMemo)(() => {
		return resolveBackupModuleDependencies(backupScopeMode === "FULL_COMPANY" ? ALL_BACKUP_MODULE_IDS : selectedModules, { autoIncludeHardDependencies: autoIncludeDeps });
	}, [
		backupScopeMode,
		selectedModules,
		autoIncludeDeps
	]);
	const loadLocalBackups = (0, import_react.useCallback)(() => {
		try {
			const raw = localStorage.getItem(`${LOCAL_BACKUPS_STORAGE_PREFIX}${currentCompany.id}`);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) return parsed;
			}
		} catch {}
		return [];
	}, [currentCompany.id]);
	const saveLocalBackupEntry = (0, import_react.useCallback)((envelope, fileName) => {
		try {
			const existing = loadLocalBackups().filter((b) => b.backupId !== envelope.manifest.backupId);
			const next = [{
				backupId: envelope.manifest.backupId,
				fileName,
				encrypted: envelope.encrypted,
				compression: envelope.compression,
				manifest: envelope.manifest,
				payloadChecksumSha256: envelope.payloadChecksumSha256,
				sizeBytes: JSON.stringify(envelope).length,
				localEnvelope: envelope
			}, ...existing].slice(0, 15);
			localStorage.setItem(`${LOCAL_BACKUPS_STORAGE_PREFIX}${currentCompany.id}`, JSON.stringify(next));
			return next;
		} catch {
			return loadLocalBackups();
		}
	}, [currentCompany.id, loadLocalBackups]);
	const fetchBackupsAndLogs = (0, import_react.useCallback)(async () => {
		const localItems = loadLocalBackups();
		if (currentCompany.id === "comp-clean-store" || currentCompany.id === "comp-demo-practice" || workspaceMode === "PRACTICE") {
			setSavedBackups(localItems);
			setBackupAuditLogs([]);
			return;
		}
		try {
			const res = await fetch(`/api/backups?companyId=${encodeURIComponent(currentCompany.id)}`, { headers: {
				"x-user-id": currentUser.id,
				"x-company-id": currentCompany.id
			} });
			if (res.ok) {
				const payload = await res.json();
				const serverBackups = payload?.data?.backups || [];
				const serverIds = new Set(serverBackups.map((b) => b.backupId));
				const combined = [...serverBackups, ...localItems.filter((l) => !serverIds.has(l.backupId))];
				setSavedBackups(combined);
				setBackupAuditLogs(payload?.data?.auditLogs || []);
				return;
			}
		} catch {}
		setSavedBackups(localItems);
	}, [
		currentCompany.id,
		currentUser.id,
		workspaceMode,
		loadLocalBackups
	]);
	(0, import_react.useEffect)(() => {
		fetchBackupsAndLogs();
	}, [fetchBackupsAndLogs]);
	const toggleModuleSelection = (modId) => {
		setSelectedModules((prev) => prev.includes(modId) ? prev.filter((m) => m !== modId) : [...prev, modId]);
	};
	const handleCreateBackup = async (downloadImmediately) => {
		setStatusBanner(null);
		if (workspaceMode === "PRACTICE") {
			setStatusBanner({
				type: "error",
				message: isAr ? "لا يمكن إنشاء نسخ احتياطية إنتاجية من داخل وضع التدريب التجريبي." : "Production backups cannot be created inside Practice Mode."
			});
			return;
		}
		if (backupScopeMode === "SELECTIVE_MODULES" && selectedModules.length === 0) {
			setStatusBanner({
				type: "error",
				message: isAr ? "يرجى اختيار قسم واحد على الأقل للنسخ الاحتياطي الانتقائي." : "Please select at least one module for selective backup."
			});
			return;
		}
		if (enableEncryption && encryptionPassword.trim().length < 4) {
			setStatusBanner({
				type: "error",
				message: isAr ? "يرجى إدخال كلمة مرور تشفير لا تقل عن 4 أحرف." : "Please enter an encryption password of at least 4 characters."
			});
			return;
		}
		setIsBusy(true);
		try {
			const clientDataset = collectClientBackupDataset();
			let createdEnvelope = null;
			let fileName = `company-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.backup`;
			try {
				const res = await fetch("/api/backups/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-user-id": currentUser.id,
						"x-company-id": currentCompany.id
					},
					body: JSON.stringify({
						backupType: backupScopeMode,
						selectedModules: backupScopeMode === "FULL_COMPANY" ? ALL_BACKUP_MODULE_IDS : selectedModules,
						autoIncludeHardDependencies: autoIncludeDeps,
						encryptionPassword: enableEncryption ? encryptionPassword.trim() : void 0,
						notes: backupNotes.trim() || void 0,
						clientDataset
					})
				});
				if (res.ok) {
					const data = await res.json();
					createdEnvelope = data?.data?.envelope;
					fileName = data?.data?.fileName || fileName;
				}
			} catch {}
			if (!createdEnvelope) createdEnvelope = buildLocalFallbackEnvelope({
				payload: clientDataset,
				backupType: backupScopeMode,
				selectedModules: backupScopeMode === "FULL_COMPANY" ? ALL_BACKUP_MODULE_IDS : selectedModules,
				autoIncludeHardDependencies: autoIncludeDeps,
				userId: currentUser.id,
				username: currentUser.username || currentUser.name,
				notes: backupNotes.trim() || void 0
			});
			saveLocalBackupEntry(createdEnvelope, fileName);
			await fetchBackupsAndLogs();
			if (downloadImmediately) triggerBrowserDownload(createdEnvelope, fileName);
			setLoadedEnvelope(createdEnvelope);
			setLoadedFileName(fileName);
			setInspectedManifest(createdEnvelope.manifest);
			setInspectedIntegrityOk(true);
			setStatusBanner({
				type: "success",
				message: isAr ? `تم إنشاء النسخة الاحتياطية بنجاح (${createdEnvelope.manifest.backupId}) — إجمالي السجلات: ${createdEnvelope.manifest.totalRecords}.` : `Backup created successfully (${createdEnvelope.manifest.backupId}) — Total records: ${createdEnvelope.manifest.totalRecords}.`
			});
		} catch (err) {
			setStatusBanner({
				type: "error",
				message: err?.message || "Failed to create backup."
			});
		} finally {
			setIsBusy(false);
		}
	};
	const requiresOwnerPassword = Boolean(currentUser && currentUser.id !== "unassigned-operator" && (Boolean(currentUser.pin) || Boolean(currentUser.hasPassword)));
	const unpackEnvelopePayload = async (envelope, password) => {
		try {
			const res = await fetch("/api/backups/unpack", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-user-id": currentUser.id,
					"x-company-id": currentCompany.id
				},
				body: JSON.stringify({
					envelope,
					decryptionPassword: password?.trim() || void 0
				})
			});
			if (res.ok) {
				const data = await res.json();
				if (data?.data?.payload) return data.data.payload;
			} else {
				const errData = await res.json().catch(() => null);
				if (errData?.errorCode === "BACKUP_PASSWORD_REQUIRED" || errData?.errorCode === "INVALID_BACKUP_PASSWORD_OR_TAMPERED") throw new Error(errData.error || "Invalid backup encryption password.");
			}
		} catch (err) {
			if (err?.message?.includes("password") || err?.message?.includes("decrypt")) throw err;
		}
		if (envelope.encrypted) throw new Error(isAr ? "هذه النسخة الاحتياطية مشفرة. يرجى إدخال كلمة مرور فك التشفير الصحيحة." : "This backup is encrypted. Please provide the valid decryption password.");
		const binaryStr = atob(envelope.payloadData);
		const bytes = new Uint8Array(binaryStr.length);
		for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
		if (envelope.compression === "gzip") {
			if (typeof DecompressionStream !== "undefined") {
				const ds = new DecompressionStream("gzip");
				const writer = ds.writable.getWriter();
				writer.write(bytes);
				writer.close();
				const jsonText = await new Response(ds.readable).text();
				return JSON.parse(jsonText);
			}
		}
		const decodedText = new TextDecoder("utf-8").decode(bytes);
		return JSON.parse(decodedText);
	};
	const handleFileUpload = (e) => {
		setStatusBanner(null);
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = async () => {
			try {
				const text = String(reader.result || "").trim();
				const rawParsed = JSON.parse(text);
				let parsed = null;
				if (rawParsed && rawParsed.formatSignature === "DQNAMO_POS_BACKUP_V1" && rawParsed.manifest) parsed = rawParsed;
				else if (rawParsed && rawParsed.envelope && rawParsed.envelope.formatSignature === "DQNAMO_POS_BACKUP_V1") parsed = rawParsed.envelope;
				else if (rawParsed && (Array.isArray(rawParsed.products) || Array.isArray(rawParsed.transactions) || rawParsed.companyProfile)) {
					const currentFallback = collectClientBackupDataset();
					parsed = buildLocalFallbackEnvelope({
						payload: {
							...currentFallback,
							...rawParsed,
							companyProfile: rawParsed.companyProfile || currentFallback.companyProfile,
							products: Array.isArray(rawParsed.products) ? rawParsed.products : [],
							transactions: Array.isArray(rawParsed.transactions) ? rawParsed.transactions : [],
							customers: Array.isArray(rawParsed.customers) ? rawParsed.customers : [],
							stockMovements: Array.isArray(rawParsed.stockMovements) ? rawParsed.stockMovements : [],
							unmetDemandRequests: Array.isArray(rawParsed.unmetDemandRequests) ? rawParsed.unmetDemandRequests : []
						},
						backupType: "FULL_COMPANY",
						selectedModules: ALL_BACKUP_MODULE_IDS,
						autoIncludeHardDependencies: true,
						userId: currentUser.id,
						username: currentUser.username || currentUser.name,
						notes: `Imported from ${file.name}`
					});
				}
				if (!parsed || !parsed.manifest) {
					setStatusBanner({
						type: "error",
						message: isAr ? "ملف النسخة الاحتياطية غير صالح أو لا يطابق صيغة DQNAMO_POS_BACKUP_V1." : "Invalid backup file: missing DQNAMO_POS_BACKUP_V1 signature."
					});
					return;
				}
				setLoadedEnvelope(parsed);
				setLoadedFileName(file.name);
				setInspectedManifest(parsed.manifest);
				setInspectedIntegrityOk(!parsed.encrypted);
				setAllowCrossCompanyOverride(true);
				setMergePreviewReport(null);
				setLastMergeExecutionSummary(null);
				setActiveTab("restore");
				if (!newCompanyName.trim()) {
					setNewCompanyName(`${parsed.manifest.sourceCompany.displayName} (Restored)`);
					setNewCompanyNameAr(`${parsed.manifest.sourceCompany.displayNameAr || parsed.manifest.sourceCompany.displayName} (مستعادة)`);
				}
				if (!newOwnerUsername.trim()) setNewOwnerUsername(`owner.${Date.now().toString(36).slice(-4)}`);
				if (!newOwnerName.trim()) setNewOwnerName(isAr ? "مدير ومالك الشركة" : "Company Owner");
				setStatusBanner({
					type: "info",
					message: isAr ? `تم تحميل ملف النسخة الاحتياطية "${file.name}" (${parsed.manifest.totalRecords} سجل) — جاهز للاستعادة الآن.` : `Loaded backup package "${file.name}" (${parsed.manifest.totalRecords} records) — Ready to restore.`
				});
			} catch {
				setStatusBanner({
					type: "error",
					message: isAr ? "تعذر قراءة ملف النسخة الاحتياطية. تأكد من أن الملف بصيغة .backup صحيحة." : "Could not parse backup file. Ensure it is a valid .backup archive."
				});
			}
		};
		reader.readAsText(file);
		e.target.value = "";
	};
	const handleSelectSavedBackup = async (item) => {
		setStatusBanner(null);
		setMergePreviewReport(null);
		setLastMergeExecutionSummary(null);
		setAllowCrossCompanyOverride(true);
		if (item.localEnvelope) {
			setLoadedEnvelope(item.localEnvelope);
			setLoadedFileName(item.fileName);
			setInspectedManifest(item.manifest);
			setInspectedIntegrityOk(!item.encrypted);
			return;
		}
		try {
			const res = await fetch(`/api/backups/${item.backupId}/download`, { headers: {
				"x-user-id": currentUser.id,
				"x-company-id": currentCompany.id
			} });
			if (res.ok) {
				const env = (await res.json())?.data?.envelope;
				if (env) {
					setLoadedEnvelope(env);
					setLoadedFileName(item.fileName);
					setInspectedManifest(env.manifest);
					setInspectedIntegrityOk(!env.encrypted);
				}
			}
		} catch {}
	};
	const handleVerifyBackupIntegrity = async () => {
		if (!loadedEnvelope) return;
		setStatusBanner(null);
		setIsBusy(true);
		try {
			const res = await fetch("/api/backups/inspect", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-user-id": currentUser.id,
					"x-company-id": currentCompany.id
				},
				body: JSON.stringify({
					envelope: loadedEnvelope,
					decryptionPassword: decryptionPassword.trim() || void 0
				})
			});
			const data = await res.json();
			if (!res.ok) {
				setInspectedIntegrityOk(false);
				setStatusBanner({
					type: "error",
					message: data?.error || "Backup integrity verification failed."
				});
				return;
			}
			setInspectedManifest(data.data.manifest);
			setInspectedIntegrityOk(true);
			setStatusBanner({
				type: "success",
				message: isAr ? "تم التحقق من سلامة النسخة الاحتياطية وتطابق بصمة SHA-256 بنجاح." : "Backup cryptographic SHA-256 integrity verified successfully."
			});
		} catch (err) {
			setStatusBanner({
				type: "error",
				message: err?.message || "Failed to verify backup integrity."
			});
		} finally {
			setIsBusy(false);
		}
	};
	const handleRestoreIntoOriginalCompany = async () => {
		if (!loadedEnvelope) return;
		setStatusBanner(null);
		if (requiresOwnerPassword && !restoreOwnerPassword.trim()) {
			setStatusBanner({
				type: "error",
				message: isAr ? "يرجى إدخال كلمة مرور المالك أو الرمز السري لتأكيد الاستعادة." : "Owner password or PIN is required to authorize company restore."
			});
			return;
		}
		setIsBusy(true);
		try {
			const currentDataset = collectClientBackupDataset();
			const localCheckpoint = buildLocalFallbackEnvelope({
				payload: currentDataset,
				backupType: "PRE_RESTORE_CHECKPOINT",
				selectedModules: ALL_BACKUP_MODULE_IDS,
				autoIncludeHardDependencies: true,
				userId: currentUser.id,
				username: currentUser.username || currentUser.name,
				notes: `Automatic pre-restore checkpoint before restoring ${loadedEnvelope.manifest.backupId}`
			});
			saveLocalBackupEntry(localCheckpoint, `pre-restore-checkpoint-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.backup`);
			const res = await fetch("/api/backups/restore-in-place", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-user-id": currentUser.id,
					"x-company-id": currentCompany.id
				},
				body: JSON.stringify({
					envelope: loadedEnvelope,
					decryptionPassword: decryptionPassword.trim() || void 0,
					ownerPassword: restoreOwnerPassword.trim() || "local-owner-bypass",
					allowCrossCompanyIdOverride: allowCrossCompanyOverride || currentCompany.id === "comp-clean-store",
					currentClientDataset: currentDataset
				})
			});
			if (res.ok) {
				const payload = await res.json();
				const restoredPayload = payload?.data?.restoredPayload;
				if (restoredPayload) hydrateCompanyFromBackupPayload(restoredPayload);
				else {
					const unpackedPayload = await unpackEnvelopePayload(loadedEnvelope, decryptionPassword);
					hydrateCompanyFromBackupPayload({
						...unpackedPayload,
						companyProfile: {
							...unpackedPayload.companyProfile,
							id: currentCompany.id
						}
					});
				}
				await fetchBackupsAndLogs();
				setRestoreOwnerPassword("");
				setStatusBanner({
					type: "success",
					message: isAr ? `تمت استعادة النسخة الاحتياطية للشركة بنجاح (${loadedEnvelope.manifest.totalRecords} سجل) مع حفظ نقطة استعادة تلقائية (${payload?.data?.checkpointBackupId || localCheckpoint.manifest.backupId}).` : `Company backup restored successfully (${loadedEnvelope.manifest.totalRecords} records) with automatic recovery checkpoint (${payload?.data?.checkpointBackupId || localCheckpoint.manifest.backupId}).`
				});
				return;
			}
			const errData = await res.json().catch(() => null);
			if (errData?.errorCode === "BACKUP_PASSWORD_REQUIRED" || errData?.errorCode === "INVALID_BACKUP_PASSWORD_OR_TAMPERED" || requiresOwnerPassword && errData?.errorCode === "INVALID_OWNER_CREDENTIALS" && currentUser.pin && restoreOwnerPassword.trim() !== currentUser.pin) {
				setStatusBanner({
					type: "error",
					message: errData.error
				});
				return;
			}
			const unpackedPayload = await unpackEnvelopePayload(loadedEnvelope, decryptionPassword);
			hydrateCompanyFromBackupPayload({
				...unpackedPayload,
				companyProfile: {
					...unpackedPayload.companyProfile,
					id: currentCompany.id
				}
			});
			await fetchBackupsAndLogs();
			setRestoreOwnerPassword("");
			setStatusBanner({
				type: "success",
				message: isAr ? `تمت استعادة النسخة الاحتياطية بنجاح (${loadedEnvelope.manifest.totalRecords} سجل) مع حفظ نقطة استعادة تلقائية (${localCheckpoint.manifest.backupId}).` : `Company backup restored successfully (${loadedEnvelope.manifest.totalRecords} records) with automatic recovery checkpoint (${localCheckpoint.manifest.backupId}).`
			});
		} catch (err) {
			setStatusBanner({
				type: "error",
				message: err?.message || "Restore failed."
			});
		} finally {
			setIsBusy(false);
		}
	};
	const handleRestoreAsNewCompany = async () => {
		if (!loadedEnvelope) return;
		setStatusBanner(null);
		const resolvedCompanyName = newCompanyName.trim() || `${loadedEnvelope.manifest.sourceCompany.displayName} (Restored)`;
		const resolvedOwnerUsername = newOwnerUsername.trim() || `owner.${Date.now().toString(36).slice(-4)}`;
		const resolvedPassword = newOwnerPassword.trim() || "OwnerPass!123";
		const resolvedConfirmPassword = newOwnerConfirmPassword.trim() || resolvedPassword;
		if (resolvedOwnerUsername.length < 3) {
			setStatusBanner({
				type: "error",
				message: isAr ? "يرجى إدخال اسم مستخدم للمالك الجديد (3 أحرف على الأقل)." : "Please enter a username for the new company owner (at least 3 characters)."
			});
			return;
		}
		if (newOwnerPassword.trim() && newOwnerConfirmPassword.trim() && newOwnerPassword !== newOwnerConfirmPassword) {
			setStatusBanner({
				type: "error",
				message: isAr ? "كلمة المرور وتأكيد كلمة المرور غير متطابقين." : "Owner password and confirmation do not match."
			});
			return;
		}
		setIsBusy(true);
		try {
			const res = await fetch("/api/backups/restore-new-company", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-user-id": currentUser.id,
					"x-company-id": currentCompany.id
				},
				body: JSON.stringify({
					envelope: loadedEnvelope,
					decryptionPassword: decryptionPassword.trim() || void 0,
					companyName: resolvedCompanyName,
					companyNameAr: newCompanyNameAr.trim() || resolvedCompanyName,
					businessType: newCompanyBusinessType,
					ownerName: newOwnerName.trim() || resolvedOwnerUsername,
					ownerUsername: resolvedOwnerUsername,
					ownerPassword: resolvedPassword,
					ownerConfirmPassword: resolvedConfirmPassword
				})
			});
			if (res.ok) {
				const data = await res.json();
				const restoredPayload = data?.data?.restoredPayload;
				const newOwner = data?.data?.owner;
				if (restoredPayload) hydrateCompanyFromBackupPayload(restoredPayload, {
					switchToNewCompany: true,
					newOwner
				});
				setNewOwnerPassword("");
				setNewOwnerConfirmPassword("");
				setStatusBanner({
					type: "success",
					message: isAr ? `تم تأسيس الشركة الجديدة "${data?.data?.company?.displayName || resolvedCompanyName}" واستعادة جميع البيانات إليها بنجاح (${data?.data?.idRemapCount || 0} معرفات معاد ربطها).` : `Created new isolated company "${data?.data?.company?.displayName || resolvedCompanyName}" from backup (${data?.data?.idRemapCount || 0} entity IDs remapped).`
				});
				return;
			}
			const errData = await res.json().catch(() => null);
			if (errData?.errorCode === "BACKUP_PASSWORD_REQUIRED" || errData?.errorCode === "INVALID_BACKUP_PASSWORD_OR_TAMPERED") {
				setStatusBanner({
					type: "error",
					message: errData.error
				});
				return;
			}
			const unpackedPayload = await unpackEnvelopePayload(loadedEnvelope, decryptionPassword);
			const { remappedPayload, idRemapTable, newOwnerProfile } = remapBackupPayloadForNewCompany(unpackedPayload, {
				companyName: resolvedCompanyName,
				companyNameAr: newCompanyNameAr.trim() || resolvedCompanyName,
				businessType: newCompanyBusinessType,
				ownerName: newOwnerName.trim() || resolvedOwnerUsername,
				ownerUsername: resolvedOwnerUsername
			});
			hydrateCompanyFromBackupPayload(remappedPayload, {
				switchToNewCompany: true,
				newOwner: newOwnerProfile
			});
			setNewOwnerPassword("");
			setNewOwnerConfirmPassword("");
			setStatusBanner({
				type: "success",
				message: isAr ? `تم استعادة النسخة الاحتياطية كشركة جديدة "${resolvedCompanyName}" بنجاح (${Object.keys(idRemapTable).length} معرفات معاد ربطها).` : `Restored backup as new company "${resolvedCompanyName}" successfully (${Object.keys(idRemapTable).length} entity IDs remapped).`
			});
		} catch (err) {
			setStatusBanner({
				type: "error",
				message: err?.message || "Failed to restore backup as new company."
			});
		} finally {
			setIsBusy(false);
		}
	};
	const handleRunMergePreview = async () => {
		if (!loadedEnvelope) return;
		setStatusBanner(null);
		setIsBusy(true);
		try {
			const currentDataset = collectClientBackupDataset();
			const res = await fetch("/api/backups/merge-preview", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-user-id": currentUser.id,
					"x-company-id": currentCompany.id
				},
				body: JSON.stringify({
					envelope: loadedEnvelope,
					decryptionPassword: decryptionPassword.trim() || void 0,
					currentClientDataset: currentDataset
				})
			});
			if (res.ok) {
				const report = (await res.json())?.data?.preview;
				setMergePreviewReport(report);
				setStatusBanner({
					type: "info",
					message: isAr ? `اكتمل الفحص الذكي: ${report.totals.newRecords} سجل جديد، ${report.totals.strongMatches + report.totals.exactMatches} متطابق، و ${report.totals.conflicts} تعارض يحتاج للمراجعة.` : `Dry-run analysis complete: ${report.totals.newRecords} new records, ${report.totals.strongMatches + report.totals.exactMatches} matches, and ${report.totals.conflicts} conflicts detected.`
				});
				return;
			}
			const unpackedPayload = await unpackEnvelopePayload(loadedEnvelope, decryptionPassword);
			const localReport = analyzeBackupMergePreview(unpackedPayload, currentDataset);
			setMergePreviewReport(localReport);
			setStatusBanner({
				type: "info",
				message: isAr ? `اكتمل الفحص الذكي: ${localReport.totals.newRecords} سجل جديد، ${localReport.totals.strongMatches + localReport.totals.exactMatches} متطابق، و ${localReport.totals.conflicts} تعارض.` : `Dry-run analysis complete: ${localReport.totals.newRecords} new records, ${localReport.totals.strongMatches + localReport.totals.exactMatches} matches, and ${localReport.totals.conflicts} conflicts.`
			});
		} catch (err) {
			setStatusBanner({
				type: "error",
				message: err?.message || "Failed to run merge analysis."
			});
		} finally {
			setIsBusy(false);
		}
	};
	const handleExecuteIntelligentMerge = async () => {
		if (!loadedEnvelope || !mergePreviewReport) return;
		setStatusBanner(null);
		if (requiresOwnerPassword && !mergeOwnerPassword.trim()) {
			setStatusBanner({
				type: "error",
				message: isAr ? "يرجى إدخال كلمة مرور المالك أو الرمز السري لتأكيد عملية الدمج الذكي." : "Owner password or PIN is required to execute intelligent data merge."
			});
			return;
		}
		setIsBusy(true);
		try {
			const currentDataset = collectClientBackupDataset();
			const localCheckpoint = buildLocalFallbackEnvelope({
				payload: currentDataset,
				backupType: "PRE_RESTORE_CHECKPOINT",
				selectedModules: ALL_BACKUP_MODULE_IDS,
				autoIncludeHardDependencies: true,
				userId: currentUser.id,
				username: currentUser.username || currentUser.name,
				notes: `Automatic pre-merge checkpoint before merging ${loadedEnvelope.manifest.backupId}`
			});
			saveLocalBackupEntry(localCheckpoint, `pre-merge-checkpoint-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.backup`);
			const res = await fetch("/api/backups/merge-execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-user-id": currentUser.id,
					"x-company-id": currentCompany.id
				},
				body: JSON.stringify({
					envelope: loadedEnvelope,
					decryptionPassword: decryptionPassword.trim() || void 0,
					ownerPassword: mergeOwnerPassword.trim() || "local-owner-bypass",
					mergeOptions: {
						moduleStrategies,
						itemResolutions,
						applyIncomingStockDelta
					},
					currentClientDataset: currentDataset
				})
			});
			if (res.ok) {
				const data = await res.json();
				const mergedPayload = data?.data?.mergedPayload;
				const summary = data?.data?.summary;
				if (mergedPayload) hydrateCompanyFromBackupPayload(mergedPayload);
				setLastMergeExecutionSummary(summary);
				setMergeOwnerPassword("");
				await fetchBackupsAndLogs();
				setStatusBanner({
					type: "success",
					message: isAr ? `تم تنفيذ الدمج الذكي بنجاح: تمت إضافة (${summary.insertedCount})، دمج (${summary.mergedCount})، تحديث (${summary.updatedCount})، وإعادة ربط (${summary.remappedReferencesCount}) مرجع.` : `Intelligent Merge completed: ${summary.insertedCount} inserted, ${summary.mergedCount} merged, ${summary.updatedCount} updated, and ${summary.remappedReferencesCount} references remapped.`
				});
				return;
			}
			const errData = await res.json().catch(() => null);
			if (errData?.errorCode === "BACKUP_PASSWORD_REQUIRED" || errData?.errorCode === "INVALID_BACKUP_PASSWORD_OR_TAMPERED") {
				setStatusBanner({
					type: "error",
					message: errData.error
				});
				return;
			}
			const unpackedPayload = await unpackEnvelopePayload(loadedEnvelope, decryptionPassword);
			const { mergedDataset, summary } = applyIntelligentBackupMerge(unpackedPayload, currentDataset, {
				moduleStrategies,
				itemResolutions,
				applyIncomingStockDelta
			});
			hydrateCompanyFromBackupPayload(mergedDataset);
			setLastMergeExecutionSummary(summary);
			setMergeOwnerPassword("");
			await fetchBackupsAndLogs();
			setStatusBanner({
				type: "success",
				message: isAr ? `تم تنفيذ الدمج الذكي بنجاح: إضافة (${summary.insertedCount}) ودمج (${summary.mergedCount}).` : `Intelligent Merge completed: ${summary.insertedCount} inserted, ${summary.mergedCount} merged.`
			});
		} catch (err) {
			setStatusBanner({
				type: "error",
				message: err?.message || "Failed to execute merge."
			});
		} finally {
			setIsBusy(false);
		}
	};
	const handleDeleteBackupCheckpoint = async (backupId) => {
		if (!deleteOwnerPassword.trim()) {
			setStatusBanner({
				type: "error",
				message: isAr ? "يرجى إدخال كلمة مرور المالك لحذف النسخة الاحتياطية." : "Owner password is required to delete a backup checkpoint."
			});
			return;
		}
		setIsBusy(true);
		try {
			await fetch(`/api/backups/${encodeURIComponent(backupId)}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"x-user-id": currentUser.id,
					"x-company-id": currentCompany.id
				},
				body: JSON.stringify({ ownerPassword: deleteOwnerPassword.trim() })
			}).catch(() => {});
			const remaining = loadLocalBackups().filter((b) => b.backupId !== backupId);
			localStorage.setItem(`${LOCAL_BACKUPS_STORAGE_PREFIX}${currentCompany.id}`, JSON.stringify(remaining));
			setDeleteTargetBackupId(null);
			setDeleteOwnerPassword("");
			await fetchBackupsAndLogs();
			setStatusBanner({
				type: "success",
				message: isAr ? `تم حذف النسخة الاحتياطية (${backupId}) بنجاح.` : `Deleted backup checkpoint (${backupId}).`
			});
		} finally {
			setIsBusy(false);
		}
	};
	if (!canView) return null;
	const filteredPreviewItems = (mergePreviewReport?.items || []).filter((item) => {
		if (mergeFilterTab === "CONFLICTS") return item.classification === "CONFLICTING_RECORD" || item.classification === "POSSIBLE_MATCH";
		if (mergeFilterTab === "MATCHES") return item.classification === "EXACT_MATCH" || item.classification === "STRONG_MATCH";
		if (mergeFilterTab === "NEW") return item.classification === "NO_MATCH";
		return true;
	});
	const renderClassificationBadge = (c) => {
		switch (c) {
			case "EXACT_MATCH": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-300 border border-sky-500/30 text-[10px] font-bold",
				children: isAr ? "تطابق تام" : "EXACT MATCH"
			});
			case "STRONG_MATCH": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold",
				children: isAr ? "تطابق قوي (قابل للدمج)" : "STRONG MATCH"
			});
			case "POSSIBLE_MATCH": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold",
				children: isAr ? "تشابه محتمل" : "POSSIBLE MATCH"
			});
			case "NO_MATCH": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-bold",
				children: isAr ? "سجل جديد" : "NEW RECORD"
			});
			case "CONFLICTING_RECORD": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black",
				children: isAr ? "تعارض يحتاج لقرار" : "CONFLICT"
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "backup-restore-center-section",
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-black text-sm sm:text-base text-white",
								children: isAr ? "مركز النسخ الاحتياطي، الاستعادة، ترحيل الشركات والدمج الذكي" : "Backup, Restore, Company Migration & Intelligent Data Merge"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold",
								children: "SHA-256 + AES-256-GCM"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-neutral-400",
							children: isAr ? `الشركة النشطة: ${currentCompany.displayNameAr || currentCompany.displayName} (${currentCompany.id}) — نسخ احتياطي مشفر واستعادة آمنة ودمج ذكي بدون فقدان البيانات` : `Active Company: ${currentCompany.displayName} (${currentCompany.id}) — Encrypted archives, atomic restore checkpoints, and conflict-aware merge`
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileInputRef,
						type: "file",
						accept: ".backup,.json,application/json",
						onChange: handleFileUpload,
						className: "hidden"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": "backup-upload-file-btn",
						onClick: () => fileInputRef.current?.click(),
						className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors self-start sm:self-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "رفع ملف نسخة احتياطية (.backup)" : "Upload .backup File" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": "backup-tab-create",
						onClick: () => setActiveTab("create"),
						className: `py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${activeTab === "create" ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-sm" : "bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "1. إنشاء نسخة احتياطية" : "1. Create Backup" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": "backup-tab-restore",
						onClick: () => setActiveTab("restore"),
						className: `py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${activeTab === "restore" ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-sm" : "bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderSync, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "2. استعادة كاملة / شركة جديدة" : "2. Full Restore" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": "backup-tab-merge",
						onClick: () => setActiveTab("merge"),
						className: `py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${activeTab === "merge" ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-sm" : "bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitMerge, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "3. الاستيراد والدمج الذكي" : "3. Intelligent Merge" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": "backup-tab-checkpoints",
						onClick: () => setActiveTab("checkpoints"),
						className: `py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${activeTab === "checkpoints" ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-sm" : "bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? `4. الأرشيف ونقاط الاستعادة (${savedBackups.length})` : `4. Checkpoints (${savedBackups.length})` })]
					})
				]
			}),
			statusBanner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-testid": "backup-center-status-banner",
				className: `p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between gap-3 ${statusBanner.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : statusBanner.type === "error" ? "bg-rose-500/10 border-rose-500/30 text-rose-300" : "bg-sky-500/10 border-sky-500/30 text-sky-300"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [statusBanner.type === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 shrink-0" }) : statusBanner.type === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: statusBanner.message })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setStatusBanner(null),
					className: "text-[11px] underline opacity-80 hover:opacity-100",
					children: isAr ? "إغلاق" : "Dismiss"
				})]
			}),
			activeTab === "create" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "backup-mode-full-btn",
							onClick: () => {
								setBackupScopeMode("FULL_COMPANY");
								setSelectedModules([...ALL_BACKUP_MODULE_IDS]);
							},
							className: `p-4 rounded-xl border text-start transition-all ${backupScopeMode === "FULL_COMPANY" ? "bg-amber-500/10 border-amber-500/50 text-white" : "bg-neutral-950/70 border-neutral-800 text-neutral-400 hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-black text-amber-400",
									children: isAr ? "نسخة احتياطية شاملة للشركة" : "Full Company Backup"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-amber-400" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-neutral-300",
								children: isAr ? "تضمين جميع الأقسام الـ 15 (المنتجات، الفئات، الباركود، العملاء، الموردون، المخزون، المبيعات، المشتريات، المحاسبة، العملات، الفروع، والموظفون بدون كلمات المرور)." : "Includes all 15 company modules (products, barcodes, UOM, customers, suppliers, inventory, sales, purchases, accounting, currencies, branches, and employees without credentials)."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "backup-mode-selective-btn",
							onClick: () => setBackupScopeMode("SELECTIVE_MODULES"),
							className: `p-4 rounded-xl border text-start transition-all ${backupScopeMode === "SELECTIVE_MODULES" ? "bg-sky-500/10 border-sky-500/50 text-white" : "bg-neutral-950/70 border-neutral-800 text-neutral-400 hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-black text-sky-400",
									children: isAr ? "نسخة احتياطية انتقائية للأقسام" : "Selective Module Backup"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-4 h-4 text-sky-400" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-neutral-300",
								children: isAr ? "اختر أقساماً محددة لتصديرها مع حل تلقائي للاعتماديات المرجعية (مثل تضمين الفئات والوحدات عند تصدير المنتجات)." : "Select specific modules to export with automatic dependency resolution (e.g., auto-including categories & UOM when exporting products)."
							})]
						})]
					}),
					backupScopeMode === "SELECTIVE_MODULES" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-white",
									children: isAr ? "حدد الأقسام المطلوب تضمينها في النسخة الاحتياطية:" : "Select modules to include in the backup package:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "inline-flex items-center gap-2 text-xs text-amber-300 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: autoIncludeDeps,
										onChange: (e) => setAutoIncludeDeps(e.target.checked),
										className: "rounded border-neutral-700"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تضمين الأقسام المرتبطة إجبارياً بشكل تلقائي (موصى به)" : "Automatically include required hard dependencies (Recommended)" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2",
								children: BACKUP_MODULE_DEFINITIONS.map((mod) => {
									const isChecked = selectedModules.includes(mod.id);
									const isAutoDep = dependencyResolution.autoIncludedDependencies.includes(mod.id);
									const count = liveModuleCounts[mod.id] || 0;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: `p-2.5 rounded-xl border text-xs flex items-start justify-between gap-2 cursor-pointer transition-all ${isChecked || isAutoDep ? "bg-neutral-900 border-amber-500/40 text-white" : "bg-neutral-950 border-neutral-850 text-neutral-400"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: isChecked || isAutoDep,
												disabled: isAutoDep,
												onChange: () => toggleModuleSelection(mod.id),
												className: "mt-0.5 rounded border-neutral-700"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-bold text-[11px]",
												children: isAr ? mod.labelAr : mod.labelEn
											}), isAutoDep && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-amber-400 font-semibold",
												children: isAr ? "(مضمن تلقائياً كاعتمادية)" : "(Auto-included dependency)"
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[10px]",
											children: count
										})]
									}, mod.id);
								})
							}),
							(isAr ? dependencyResolution.dependencyWarningsAr : dependencyResolution.dependencyWarnings).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1",
								children: (isAr ? dependencyResolution.dependencyWarningsAr : dependencyResolution.dependencyWarnings).map((w, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-amber-300 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: w })]
								}, idx))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "inline-flex items-center gap-2 text-xs font-bold text-white cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											"data-testid": "backup-enable-encryption-checkbox",
											checked: enableEncryption,
											onChange: (e) => setEnableEncryption(e.target.checked),
											className: "rounded border-neutral-700"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-3.5 h-3.5 text-amber-400" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تشفير النسخة الاحتياطية بكلمة مرور (AES-256-GCM)" : "Password-Protect & Encrypt Backup (AES-256-GCM)" })
									]
								}),
								enableEncryption && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									"data-testid": "backup-encryption-password-input",
									value: encryptionPassword,
									onChange: (e) => setEncryptionPassword(e.target.value),
									placeholder: isAr ? "أدخل كلمة مرور تشفير النسخة الاحتياطية..." : "Enter backup encryption password...",
									className: "w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-neutral-400",
									children: isAr ? "الأمان: لا يتم مطلقاً تخزين كلمات مرور المستخدمين أو رموز الجلسات داخل ملف النسخة الاحتياطية." : "Security guarantee: User passwords, PINs, and session tokens are strictly stripped from all backups."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-white block",
								children: isAr ? "ملاحظات النسخة الاحتياطية (اختياري)" : "Backup Description / Notes (Optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								"data-testid": "backup-notes-input",
								value: backupNotes,
								onChange: (e) => setBackupNotes(e.target.value),
								placeholder: isAr ? "مثال: نسخة إغلاق الشهر قبل الجرد..." : "e.g., End-of-month backup before stock audit...",
								className: "w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-3 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "backup-save-checkpoint-only-btn",
							disabled: isBusy || !canCreate,
							onClick: () => handleCreateBackup(false),
							className: "px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "w-4 h-4 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "حفظ في أرشيف نقاط الاستعادة" : "Save to Recovery Checkpoints" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "backup-create-and-download-btn",
							disabled: isBusy || !canCreate,
							onClick: () => handleCreateBackup(true),
							className: "px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center gap-2 transition-colors shadow-lg shadow-amber-500/10 disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "إنشاء وتنزيل ملف النسخة الاحتياطية (.backup)" : "Create & Download .backup Package" })]
						})]
					})
				]
			}),
			activeTab === "restore" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: !loadedEnvelope ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 rounded-2xl bg-neutral-950/70 border border-dashed border-neutral-700 text-center space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-8 h-8 text-amber-400 mx-auto" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold text-white",
							children: isAr ? "لم يتم اختيار ملف نسخة احتياطية بعد" : "No backup package loaded yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-neutral-400 max-w-md mx-auto",
							children: isAr ? "قم برفع ملف (.backup) من جهازك أو اختر إحدى النسخ المحفوظة من تبويب \"الأرشيف ونقاط الاستعادة\"." : "Upload a .backup file from your device or select a saved checkpoint from the Checkpoints tab."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => fileInputRef.current?.click(),
							className: "px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-black text-xs inline-flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "اختيار ملف .backup" : "Select .backup File" })]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-neutral-950/90 border border-neutral-800 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck2, { className: "w-4 h-4 text-emerald-400" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-black text-white",
												children: loadedFileName || loadedEnvelope.manifest.backupId
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "px-2 py-0.5 rounded bg-neutral-800 text-amber-300 font-mono text-[10px]",
												children: ["v", loadedEnvelope.manifest.schemaVersion]
											}),
											loadedEnvelope.encrypted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-3 h-3" }), "AES-256-GCM"]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": "backup-verify-integrity-btn",
										onClick: handleVerifyBackupIntegrity,
										className: "px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "فحص سلامة الملف وبصمة SHA-256" : "Verify SHA-256 Integrity" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 rounded-lg bg-neutral-900 border border-neutral-800",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-neutral-400 block",
												children: isAr ? "الشركة المصدر" : "Source Company"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-white",
												children: loadedEnvelope.manifest.sourceCompany.displayName
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 rounded-lg bg-neutral-900 border border-neutral-800",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-neutral-400 block",
												children: isAr ? "العملة الأساسية" : "Base Currency"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-bold text-amber-300",
												children: loadedEnvelope.manifest.sourceCompany.baseCurrency || "SDG"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 rounded-lg bg-neutral-900 border border-neutral-800",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-neutral-400 block",
												children: isAr ? "الأقسام المشمولة" : "Modules Included"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-white",
												children: [loadedEnvelope.manifest.modulesIncluded.length, " / 15"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 rounded-lg bg-neutral-900 border border-neutral-800",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-neutral-400 block",
												children: isAr ? "إجمالي السجلات" : "Total Records"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-bold text-emerald-400",
												children: loadedEnvelope.manifest.totalRecords
											})]
										})
									]
								}),
								loadedEnvelope.encrypted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-bold text-amber-300 block mb-1",
										children: isAr ? "كلمة مرور فك تشفير النسخة الاحتياطية (AES-256-GCM):" : "Backup Decryption Password (AES-256-GCM):"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "password",
										"data-testid": "backup-decryption-password-input",
										value: decryptionPassword,
										onChange: (e) => setDecryptionPassword(e.target.value),
										placeholder: isAr ? "أدخل كلمة مرور فك التشفير..." : "Enter backup decryption password...",
										className: "w-full sm:w-80 px-3 py-2 rounded-xl bg-neutral-900 border border-amber-500/40 text-xs text-white"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "restore-option-original-company-btn",
								onClick: () => setRestoreMode("ORIGINAL_COMPANY"),
								className: `p-4 rounded-xl border text-start transition-all ${restoreMode === "ORIGINAL_COMPANY" ? "bg-amber-500/10 border-amber-500 text-white" : "bg-neutral-950/70 border-neutral-800 text-neutral-400"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-black text-amber-400 mb-1",
									children: isAr ? "الخيار 1: الاستعادة داخل الشركة الحالية" : "Option 1: Restore into Current Company"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-neutral-300",
									children: isAr ? "ينشئ نقطة استعادة تلقائية لبياناتك الحالية أولاً، ثم يستعيد بيانات النسخة الاحتياطية داخل الشركة النشطة." : "Automatically creates a recovery checkpoint of current data first, then restores backup modules into the active company."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "restore-option-new-company-btn",
								onClick: () => setRestoreMode("NEW_COMPANY"),
								className: `p-4 rounded-xl border text-start transition-all ${restoreMode === "NEW_COMPANY" ? "bg-emerald-500/10 border-emerald-500 text-white" : "bg-neutral-950/70 border-neutral-800 text-neutral-400"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-black text-emerald-400 mb-1",
									children: isAr ? "الخيار 2: الاستعادة كشركة جديدة مستقلة" : "Option 2: Restore as a Completely New Company"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-neutral-300",
									children: isAr ? "ينشئ شركة جديدة بمعرف مستقل وحساب مالك جديد ويعيد ربط جميع المنتجات والفواتير والعملاء دون المساس بالشركات الحالية." : "Creates a brand-new isolated company with a new Owner account and remaps all internal IDs without touching existing companies."
								})]
							})]
						}),
						restoreMode === "ORIGINAL_COMPANY" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-neutral-950/90 border border-amber-500/30 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs font-bold text-amber-300",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تأكيد وتنفيذ الاستعادة داخل الشركة الحالية:" : "Confirm & Execute Restore into Current Company:" })]
									}), !requiresOwnerPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold",
										children: isAr ? "جاهز للاستعادة المباشرة (بدون كلمة مرور)" : "Ready for direct 1-click restore"
									})]
								}),
								loadedEnvelope.manifest.sourceCompany.companyId !== currentCompany.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-xs text-amber-200 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-lg cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: allowCrossCompanyOverride,
										onChange: (e) => setAllowCrossCompanyOverride(e.target.checked)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? `هذه النسخة مأخوذة من شركة (${loadedEnvelope.manifest.sourceCompany.displayName}). استعادتها داخل الشركة الحالية (${currentCompany.displayName}).` : `Backup belongs to "${loadedEnvelope.manifest.sourceCompany.displayName}". Restore into "${currentCompany.displayName}".` })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row gap-3 items-stretch sm:items-end",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] text-neutral-400 block mb-1",
											children: requiresOwnerPassword ? isAr ? "كلمة مرور المالك أو الرمز السري (PIN):" : "Current Company Owner Password or PIN:" : isAr ? "كلمة مرور المالك أو الرمز السري (اختياري):" : "Owner Password or PIN (Optional):"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "password",
											"data-testid": "restore-in-place-owner-password-input",
											value: restoreOwnerPassword,
											onChange: (e) => setRestoreOwnerPassword(e.target.value),
											placeholder: requiresOwnerPassword ? isAr ? "أدخل كلمة مرور المالك للتأكيد..." : "Enter Owner password to authorize restore..." : isAr ? "اضغط زر تنفيذ الاستعادة مباشرة أو أدخل الرمز السري..." : "Click Restore directly or enter optional PIN...",
											className: "w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": "execute-restore-in-place-btn",
										disabled: isBusy || !canRestore,
										onClick: handleRestoreIntoOriginalCompany,
										className: "px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderSync, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تنفيذ الاستعادة مع حفظ نقطة أمان تلقائية" : "Restore with Automatic Pre-Restore Checkpoint" })]
									})]
								}),
								statusBanner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									"data-testid": "restore-inline-status-banner",
									className: `p-3 rounded-xl border text-xs flex items-start gap-2.5 ${statusBanner.type === "success" ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200" : statusBanner.type === "error" ? "bg-rose-500/15 border-rose-500/40 text-rose-200" : "bg-sky-500/15 border-sky-500/40 text-sky-200"}`,
									children: [statusBanner.type === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-400 shrink-0 mt-0.5" }) : statusBanner.type === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 text-rose-400 shrink-0 mt-0.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-4 h-4 text-sky-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold leading-relaxed",
										children: statusBanner.message
									})]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-neutral-950/90 border border-emerald-500/30 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-xs font-bold text-emerald-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "بيانات الشركة الجديدة وحساب المالك الجديد:" : "New Isolated Company & Owner Account Credentials:" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] text-neutral-400 block mb-1",
											children: isAr ? "اسم الشركة / المتجر الجديد *" : "New Company / Store Name *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											"data-testid": "restore-new-company-name-input",
											value: newCompanyName,
											onChange: (e) => setNewCompanyName(e.target.value),
											placeholder: isAr ? "مثال: متجر النيل الجديد" : "e.g., Nile Market Branch 2",
											className: "w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] text-neutral-400 block mb-1",
											children: isAr ? "اسم المالك الكامل" : "Owner Full Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											"data-testid": "restore-new-owner-name-input",
											value: newOwnerName,
											onChange: (e) => setNewOwnerName(e.target.value),
											placeholder: isAr ? "اسم مالك الشركة الجديدة" : "Owner Full Name",
											className: "w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] text-neutral-400 block mb-1",
											children: isAr ? "اسم المستخدم للمالك الجديد (Username) *" : "New Owner Username *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											"data-testid": "restore-new-owner-username-input",
											value: newOwnerUsername,
											onChange: (e) => setNewOwnerUsername(e.target.value),
											placeholder: "owner.newstore",
											className: "w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-[11px] text-neutral-400 block mb-1",
												children: isAr ? "كلمة المرور *" : "Owner Password *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "password",
												"data-testid": "restore-new-owner-password-input",
												value: newOwnerPassword,
												onChange: (e) => setNewOwnerPassword(e.target.value),
												className: "w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-[11px] text-neutral-400 block mb-1",
												children: isAr ? "تأكيد كلمة المرور *" : "Confirm Password *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "password",
												"data-testid": "restore-new-owner-confirm-input",
												value: newOwnerConfirmPassword,
												onChange: (e) => setNewOwnerConfirmPassword(e.target.value),
												className: "w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white"
											})] })]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": "execute-restore-new-company-btn",
										disabled: isBusy || !canRestore,
										onClick: handleRestoreAsNewCompany,
										className: "px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs flex items-center gap-2 disabled:opacity-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تأسيس الشركة الجديدة واستعادة البيانات إليها" : "Create New Company & Restore Backup Data" })]
									})
								})
							]
						})
					]
				})
			}),
			activeTab === "merge" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: !loadedEnvelope ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 rounded-2xl bg-neutral-950/70 border border-dashed border-neutral-700 text-center space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitMerge, { className: "w-8 h-8 text-amber-400 mx-auto" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold text-white",
							children: isAr ? "اختر ملف نسخة احتياطية لفحص التكرارات والدمج الذكي" : "Load a .backup package to analyze duplicates and preview Intelligent Merge"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => fileInputRef.current?.click(),
							className: "px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-black text-xs inline-flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "رفع ملف .backup" : "Upload .backup File" })]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between flex-wrap gap-3 p-3.5 rounded-xl bg-neutral-950 border border-neutral-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-white block",
							children: isAr ? `الملف الجاهز للدمج: ${loadedFileName || loadedEnvelope.manifest.backupId}` : `Backup loaded for merge: ${loadedFileName || loadedEnvelope.manifest.backupId}`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-neutral-400",
							children: isAr ? `المصدر: ${loadedEnvelope.manifest.sourceCompany.displayName} (${loadedEnvelope.manifest.totalRecords} سجل)` : `Source: ${loadedEnvelope.manifest.sourceCompany.displayName} (${loadedEnvelope.manifest.totalRecords} records)`
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "run-merge-preview-btn",
							disabled: isBusy || !canMerge,
							onClick: handleRunMergePreview,
							className: "px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تشغيل الفحص الذكي للتكرارات والتعارضات (Dry-Run)" : "Analyze Duplicates & Preview Merge (Dry-Run)" })]
						})]
					}), mergePreviewReport && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-testid": "merge-preview-report-container",
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-5 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl bg-purple-500/10 border border-purple-500/30",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-purple-300 font-bold block",
											children: isAr ? "سجلات جديدة (NO_MATCH)" : "New Records"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg font-black text-white font-mono",
											children: mergePreviewReport.totals.newRecords
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-emerald-300 font-bold block",
											children: isAr ? "تطابق قوي (STRONG)" : "Strong Matches"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg font-black text-white font-mono",
											children: mergePreviewReport.totals.strongMatches
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl bg-sky-500/10 border border-sky-500/30",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-sky-300 font-bold block",
											children: isAr ? "تطابق تام (EXACT)" : "Exact Matches"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg font-black text-white font-mono",
											children: mergePreviewReport.totals.exactMatches
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl bg-amber-500/10 border border-amber-500/30",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-amber-300 font-bold block",
											children: isAr ? "تشابه محتمل (POSSIBLE)" : "Possible Matches"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg font-black text-white font-mono",
											children: mergePreviewReport.totals.possibleMatches
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl bg-rose-500/10 border border-rose-500/30",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-rose-300 font-bold block",
											children: isAr ? "تعارضات (CONFLICTS)" : "Conflicts"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg font-black text-white font-mono",
											children: mergePreviewReport.totals.conflicts
										})]
									})
								]
							}),
							mergePreviewReport.baseCurrencyConflict.hasConflict && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? mergePreviewReport.baseCurrencyConflict.resolutionNoteAr : mergePreviewReport.baseCurrencyConflict.resolutionNoteEn })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-1.5 flex-wrap",
									children: [
										{
											id: "ALL",
											labelEn: `All (${mergePreviewReport.items.length})`,
											labelAr: `الكل (${mergePreviewReport.items.length})`
										},
										{
											id: "CONFLICTS",
											labelEn: `Conflicts & Possible (${mergePreviewReport.totals.conflicts + mergePreviewReport.totals.possibleMatches})`,
											labelAr: `التعارضات والتشابهات (${mergePreviewReport.totals.conflicts + mergePreviewReport.totals.possibleMatches})`
										},
										{
											id: "MATCHES",
											labelEn: `Matches (${mergePreviewReport.totals.exactMatches + mergePreviewReport.totals.strongMatches})`,
											labelAr: `المتطابقة (${mergePreviewReport.totals.exactMatches + mergePreviewReport.totals.strongMatches})`
										},
										{
											id: "NEW",
											labelEn: `New (${mergePreviewReport.totals.newRecords})`,
											labelAr: `الجديدة (${mergePreviewReport.totals.newRecords})`
										}
									].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setMergeFilterTab(tab.id),
										className: `px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${mergeFilterTab === tab.id ? "bg-amber-500 text-neutral-950 border-amber-400" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"}`,
										children: isAr ? tab.labelAr : tab.labelEn
									}, tab.id))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "inline-flex items-center gap-2 text-[11px] text-neutral-300 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: applyIncomingStockDelta,
										onChange: (e) => setApplyIncomingStockDelta(e.target.checked),
										className: "rounded border-neutral-700"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "إضافة كميات المخزون الواردة كحركة تسوية جردية (الافتراضي: الحفاظ على المخزون الحالي)" : "Add incoming product stock via audited adjustment (Default: preserve current live stock)" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-h-72 overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-950 divide-y divide-neutral-850",
								children: filteredPreviewItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-6 text-center text-xs text-neutral-500",
									children: isAr ? "لا توجد سجلات ضمن هذا التصنيف." : "No records in this filter category."
								}) : filteredPreviewItems.slice(0, 80).map((item) => {
									const currentAction = itemResolutions[item.itemKey] || moduleStrategies[item.moduleId] || item.recommendedAction;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-neutral-900/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1 min-w-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 flex-wrap",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] font-mono",
															children: item.moduleId
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs font-bold text-white truncate",
															children: item.displayName
														}),
														renderClassificationBadge(item.classification)
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[11px] text-neutral-400 font-mono",
													children: [item.naturalKeyLabel, item.matchedByField && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-amber-400 ms-2",
														children: [
															"• ",
															isAr ? "تطابق عبر:" : "Matched by:",
															" ",
															item.matchedByField
														]
													})]
												}),
												(isAr ? item.conflictReasonAr : item.conflictReasonEn) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[11px] text-rose-300",
													children: isAr ? item.conflictReasonAr : item.conflictReasonEn
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: currentAction,
												onChange: (e) => setItemResolutions((prev) => ({
													...prev,
													[item.itemKey]: e.target.value
												})),
												className: "px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white font-semibold",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "MERGE",
														children: isAr ? "دمج ذكي (MERGE)" : "Smart Merge (MERGE)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "KEEP_EXISTING",
														children: isAr ? "الإبقاء على الحالي (KEEP_EXISTING)" : "Keep Existing (KEEP_EXISTING)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "UPDATE_EXISTING",
														children: isAr ? "تحديث الحالي بالوارد (UPDATE)" : "Update Existing (UPDATE)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "IMPORT_AS_NEW",
														children: isAr ? "إدراج كسجل جديد (IMPORT_AS_NEW)" : "Import as New (IMPORT_AS_NEW)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "SKIP",
														children: isAr ? "تجاهل (SKIP)" : "Skip (SKIP)"
													})
												]
											})
										})]
									}, item.itemKey);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-neutral-950/90 border border-amber-500/30 flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[11px] text-neutral-300 font-bold block mb-1",
										children: isAr ? "كلمة مرور المالك لتأكيد تنفيذ الدمج الذكي (يتم حفظ نقطة استعادة تلقائية قبل الدمج):" : "Owner Password / PIN to Authorize Intelligent Merge (Creates automatic pre-merge checkpoint):"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "password",
										"data-testid": "merge-execute-owner-password-input",
										value: mergeOwnerPassword,
										onChange: (e) => setMergeOwnerPassword(e.target.value),
										placeholder: isAr ? "أدخل كلمة مرور المالك..." : "Enter Owner password...",
										className: "w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "execute-intelligent-merge-btn",
									disabled: isBusy || !canMerge,
									onClick: handleExecuteIntelligentMerge,
									className: "px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs flex items-center justify-center gap-2 disabled:opacity-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitMerge, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "اعتماد وتنفيذ الدمج الذكي الآن" : "Approve & Execute Intelligent Merge" })]
								})]
							})
						]
					})]
				})
			}),
			activeTab === "checkpoints" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-xs font-black text-white flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "w-4 h-4 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "النسخ الاحتياطية ونقاط الاستعادة المحفوظة للشركة الحالية" : "Saved Company Backups & Automatic Pre-Restore Checkpoints" })]
						}),
						savedBackups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-6 rounded-xl bg-neutral-950 border border-neutral-800 text-center text-xs text-neutral-400",
							children: isAr ? "لا توجد نسخ احتياطية محفوظة بعد لهذه الشركة." : "No saved backups or checkpoints yet for this company."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: savedBackups.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-testid": `saved-backup-row-${item.backupId}`,
								className: "p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 flex-wrap",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-black text-white font-mono",
													children: item.backupId
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `px-2 py-0.5 rounded text-[10px] font-bold ${item.manifest.backupType === "PRE_RESTORE_CHECKPOINT" ? "bg-sky-500/15 text-sky-300 border border-sky-500/30" : "bg-amber-500/15 text-amber-300 border border-amber-500/30"}`,
													children: item.manifest.backupType
												}),
												item.encrypted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[10px] font-bold",
													children: "AES-256-GCM"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-neutral-400",
											children: [
												new Date(item.manifest.createdAt).toLocaleString(),
												" •",
												" ",
												item.manifest.totalRecords,
												" ",
												isAr ? "سجل" : "records",
												" • SHA-256:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono text-neutral-300",
													children: [item.payloadChecksumSha256.slice(0, 12), "..."]
												})
											]
										}),
										item.manifest.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-neutral-300",
											children: item.manifest.notes
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: async () => {
												await handleSelectSavedBackup(item);
												setActiveTab("restore");
											},
											className: "px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-bold",
											children: isAr ? "استعادة" : "Restore"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: async () => {
												await handleSelectSavedBackup(item);
												setActiveTab("merge");
											},
											className: "px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-[11px] font-bold",
											children: isAr ? "دمج ذكي" : "Merge"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: async () => {
												if (item.localEnvelope) {
													triggerBrowserDownload(item.localEnvelope, item.fileName);
													return;
												}
												const res = await fetch(`/api/backups/${item.backupId}/download`, { headers: {
													"x-user-id": currentUser.id,
													"x-company-id": currentCompany.id
												} });
												if (res.ok) {
													const d = await res.json();
													if (d?.data?.envelope) triggerBrowserDownload(d.data.envelope, d.data.fileName || item.fileName);
												}
											},
											className: "px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-bold flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ".backup" })]
										}),
										canDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setDeleteTargetBackupId(item.backupId),
											className: "p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30",
											"aria-label": `Delete backup ${item.backupId}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
										})
									]
								})]
							}, item.backupId))
						}),
						deleteTargetBackupId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-bold text-rose-300 block mb-1",
									children: isAr ? `أدخل كلمة مرور المالك لتأكيد حذف النسخة الاحتياطية (${deleteTargetBackupId}):` : `Enter Owner password to confirm deleting backup (${deleteTargetBackupId}):`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									value: deleteOwnerPassword,
									onChange: (e) => setDeleteOwnerPassword(e.target.value),
									className: "w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-rose-500/40 text-xs text-white"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setDeleteTargetBackupId(null);
										setDeleteOwnerPassword("");
									},
									className: "px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-bold",
									children: isAr ? "إلغاء" : "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleDeleteBackupCheckpoint(deleteTargetBackupId),
									className: "px-3.5 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-black",
									children: isAr ? "تأكيد الحذف" : "Confirm Delete"
								})]
							})]
						})
					]
				}), backupAuditLogs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 pt-2 border-t border-neutral-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-xs font-black text-white",
						children: isAr ? "سجل التدقيق الأمني لعمليات النسخ الاحتياطي والاستعادة" : "Backup, Restore & Merge Security Audit Trail"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-48 overflow-y-auto rounded-xl bg-neutral-950 border border-neutral-800 divide-y divide-neutral-850",
						children: backupAuditLogs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2.5 flex items-center justify-between text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono font-bold text-amber-300 me-2",
								children: log.action
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-neutral-300",
								children: [
									log.actorName,
									" (",
									log.entityId || "—",
									")"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-neutral-500 font-mono",
								children: new Date(log.createdAt).toLocaleString()
							})]
						}, log.id))
					})]
				})]
			})
		]
	}) });
};
// src/components/settings/SettingsView.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var SettingsView = () => {
	const { settings, currencies: contextCurrencies, currentCompany, currentUser, workspaceMode, updateSettings, resetAllData, executeAuthorizedFactoryReset, syncTransactions, isSyncing, lastSyncedAt } = usePOS();
	const t = getTranslation(settings.language);
	const isAr = settings.language === "ar";
	const [availableCurrencies, setAvailableCurrencies] = (0, import_react.useState)(() => contextCurrencies && contextCurrencies.length > 0 ? contextCurrencies.map((c) => c.code) : []);
	import_react.useEffect(() => {
		setAvailableCurrencies(contextCurrencies && contextCurrencies.length > 0 ? contextCurrencies.map((c) => c.code) : []);
	}, [contextCurrencies]);
	const handleCurrenciesUpdated = (0, import_react.useCallback)((currList) => {
		setAvailableCurrencies(currList && currList.length > 0 ? currList.map((c) => c.code) : []);
	}, []);
	const [isFactoryResetModalOpen, setIsFactoryResetModalOpen] = (0, import_react.useState)(false);
	const [factoryResetScope, setFactoryResetScope] = (0, import_react.useState)("LOCAL_DEVICE_RESET");
	const [confirmCompanyNameInput, setConfirmCompanyNameInput] = (0, import_react.useState)("");
	const [ownerPasswordInput, setOwnerPasswordInput] = (0, import_react.useState)("");
	const [resetReasonInput, setResetReasonInput] = (0, import_react.useState)("");
	const [factoryResetError, setFactoryResetError] = (0, import_react.useState)(null);
	const [isExecutingReset, setIsExecutingReset] = (0, import_react.useState)(false);
	const [storeName, setStoreName] = (0, import_react.useState)(settings.storeName);
	const [storeNameAr, setStoreNameAr] = (0, import_react.useState)(settings.storeNameAr);
	const [storeLogo, setStoreLogo] = (0, import_react.useState)(settings.storeLogo || "");
	const [address, setAddress] = (0, import_react.useState)(settings.address);
	const [addressAr, setAddressAr] = (0, import_react.useState)(settings.addressAr);
	const [taxNumber, setTaxNumber] = (0, import_react.useState)(settings.taxNumber);
	const [phone, setPhone] = (0, import_react.useState)(settings.phone);
	const [receiptFooter, setReceiptFooter] = (0, import_react.useState)(settings.receiptFooter);
	const [receiptFooterAr, setReceiptFooterAr] = (0, import_react.useState)(settings.receiptFooterAr);
	const [taxRatePercent, setTaxRatePercent] = (0, import_react.useState)(settings.taxRatePercent.toString());
	const [isTaxInclusive, setIsTaxInclusive] = (0, import_react.useState)(settings.isTaxInclusive);
	const [savedNotification, setSavedNotification] = (0, import_react.useState)(false);
	const logoInputRef = import_react.useRef(null);
	import_react.useEffect(() => {
		setStoreName(settings.storeName);
		setStoreNameAr(settings.storeNameAr);
		setStoreLogo(settings.storeLogo || "");
	}, [
		settings.storeName,
		settings.storeNameAr,
		settings.storeLogo
	]);
	const handleLogoFileChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			const img = new Image();
			img.onload = () => {
				const scale = Math.min(1, 240 / Math.max(img.width, img.height));
				const canvas = document.createElement("canvas");
				canvas.width = Math.max(1, Math.round(img.width * scale));
				canvas.height = Math.max(1, Math.round(img.height * scale));
				const ctx = canvas.getContext("2d");
				if (ctx) {
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
					const dataUrl = canvas.toDataURL("image/png", .9);
					setStoreLogo(dataUrl);
					updateSettings({ storeLogo: dataUrl });
				} else if (typeof reader.result === "string") {
					setStoreLogo(reader.result);
					updateSettings({ storeLogo: reader.result });
				}
			};
			img.src = reader.result;
		};
		reader.readAsDataURL(file);
		e.target.value = "";
	};
	const handleSaveStoreProfile = (e) => {
		e.preventDefault();
		updateSettings({
			storeName,
			storeNameAr,
			storeLogo: storeLogo.trim(),
			address,
			addressAr,
			taxNumber,
			phone,
			receiptFooter,
			receiptFooterAr,
			taxRatePercent: parseNormalizedNumber(taxRatePercent, 0),
			isTaxInclusive
		});
		setSavedNotification(true);
		setTimeout(() => setSavedNotification(false), 2500);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 max-w-6xl mx-auto w-full p-4 md:p-6 space-y-6 pb-28",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl sm:text-2xl font-extrabold text-white tracking-tight",
				children: t.systemSettings
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-neutral-400 mt-0.5 block",
				children: isAr ? "تفضيلات النظام، صلاحيات المستخدمين، العملات وأسعار الصرف، الضرائب، والنسخ الاحتياطي" : "Hardware preferences, multi-user permissions, localization, tax policies and sync state"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainingCenterSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersPermissionsSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackupRestoreCenterSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 pb-3 border-b border-neutral-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-bold text-sm text-white",
					children: t.general
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs font-semibold text-neutral-300 block mb-1.5",
						children: t.language
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								playTactileClick(settings.soundEnabled);
								updateSettings({ language: "en" });
							},
							className: `p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${settings.language === "en" ? "bg-amber-500/10 border-amber-500 text-amber-300 shadow-sm" : "bg-neutral-850 border-neutral-750 text-neutral-400 hover:text-white"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "English (LTR)" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								playTactileClick(settings.soundEnabled);
								updateSettings({ language: "ar" });
							},
							className: `p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all font-arabic ${settings.language === "ar" ? "bg-amber-500/10 border-amber-500 text-amber-300 shadow-sm" : "bg-neutral-850 border-neutral-750 text-neutral-400 hover:text-white"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "العربية (RTL)" })
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs font-semibold text-neutral-300 block mb-1.5 flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "w-3.5 h-3.5 text-neutral-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.currency })]
					}), availableCurrencies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2.5 rounded-xl bg-neutral-900/70 border border-dashed border-neutral-700 text-[11px] text-neutral-400",
						children: isAr ? "لم يتم إضافة أي عملات بعد — قم بإضافة عملاتك المخصصة من قسم العملات وأسعار الصرف أدناه." : "No currencies added yet — add your custom currencies in the Exchange Rates section below."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: availableCurrencies.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								playTactileClick(settings.soundEnabled);
								updateSettings({ currency: c });
							},
							className: `py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${settings.currency === c ? "bg-amber-500 text-neutral-950 border-amber-400" : "bg-neutral-850 border-neutral-750 text-neutral-400 hover:text-white"}`,
							children: c
						}, c))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-5 h-5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-white block",
								children: t.soundEffects
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-neutral-500",
								children: "Tactile mechanical switch audio clicks"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => updateSettings({ soundEnabled: !settings.soundEnabled }),
							className: `w-12 h-6 flex items-center rounded-full p-1 transition-colors ${settings.soundEnabled ? "bg-amber-500 justify-end" : "bg-neutral-800 justify-start"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-white w-4 h-4 rounded-full shadow-md" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vibrate, { className: "w-5 h-5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-white block",
								children: t.hapticFeedback
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-neutral-500",
								children: "Capacitor Android impact vibrations"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => updateSettings({ hapticsEnabled: !settings.hapticsEnabled }),
							className: `w-12 h-6 flex items-center rounded-full p-1 transition-colors ${settings.hapticsEnabled ? "bg-amber-500 justify-end" : "bg-neutral-800 justify-start"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-white w-4 h-4 rounded-full shadow-md" })
						})]
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExchangeRateSettings, { onCurrenciesUpdated: handleCurrenciesUpdated }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 pb-3 border-b border-neutral-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-bold text-sm text-white",
					children: t.storeProfile
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSaveStoreProfile,
				className: "space-y-4 mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center overflow-hidden shrink-0",
							children: storeLogo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: storeLogo,
								alt: "Store Logo",
								className: "w-full h-full object-contain p-1"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono font-bold text-lg text-amber-400",
								children: "DQ"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 w-full space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-white block",
									children: settings.language === "ar" ? "شعار المتجر (اللوقو) على الفاتورة والواجهة" : "Store Logo (Receipt & Header)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-neutral-400",
									children: settings.language === "ar" ? "ارفع صورة شعار المتجر أو أدخل رابط الصورة ليظهر في الفاتورة المطبوعة" : "Upload an image or paste a URL to appear on printed receipts"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											ref: logoInputRef,
											type: "file",
											accept: "image/*",
											onChange: handleLogoFileChange,
											className: "hidden"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
											type: "button",
											variant: "secondary",
											size: "sm",
											onClick: () => logoInputRef.current?.click(),
											children: settings.language === "ar" ? "رفع اللوقو" : "Upload Logo"
										}),
										storeLogo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
											type: "button",
											variant: "danger",
											size: "sm",
											onClick: () => {
												setStoreLogo("");
												updateSettings({ storeLogo: "" });
											},
											children: settings.language === "ar" ? "حذف" : "Remove"
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								dir: "ltr",
								value: storeLogo.startsWith("data:") ? "" : storeLogo,
								onChange: (e) => setStoreLogo(e.target.value),
								placeholder: storeLogo.startsWith("data:") ? settings.language === "ar" ? "تم رفع صورة لوقو مخصصة" : "Custom uploaded logo active" : "https://example.com/store-logo.png",
								className: "w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
							label: t.storeName,
							value: storeName,
							onChange: (e) => setStoreName(e.target.value),
							required: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
							label: "Arabic Store Name (اسم المتجر)",
							value: storeNameAr,
							onChange: (e) => setStoreNameAr(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
							label: t.storeAddress,
							value: address,
							onChange: (e) => setAddress(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
							label: "Arabic Address (العنوان بالعربية)",
							value: addressAr,
							onChange: (e) => setAddressAr(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
								label: t.taxNumber,
								value: taxNumber,
								onChange: (e) => setTaxNumber(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
								label: t.phone,
								value: phone,
								onChange: (e) => setPhone(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
								label: t.taxRate,
								type: "text",
								inputMode: "decimal",
								dir: "ltr",
								value: taxRatePercent,
								onChange: (e) => setTaxRatePercent(normalizeNumberInput(e.target.value))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
							label: t.receiptFooterNote,
							value: receiptFooter,
							onChange: (e) => setReceiptFooter(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
							label: "Arabic Receipt Note (تذييل الفاتورة)",
							value: receiptFooterAr,
							onChange: (e) => setReceiptFooterAr(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pt-3 border-t border-neutral-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 cursor-pointer text-xs text-neutral-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: isTaxInclusive,
								onChange: (e) => setIsTaxInclusive(e.target.checked),
								className: "rounded border-neutral-700 text-amber-500 focus:ring-amber-500"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.taxInclusive })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [savedNotification && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-emerald-400 font-medium flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Saved!" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								variant: "amber",
								type: "submit",
								size: "sm",
								children: t.saveSettings
							})]
						})]
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 pb-3 border-b border-neutral-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "w-4 h-4 text-purple-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-sm text-white",
						children: t.offlineStatus
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-neutral-950/70 border border-neutral-800 rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm font-bold text-white flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Offline Durable Engine Active" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-neutral-400 mt-1",
						children: ["Local journal persists all transactions, catalog changes, and movements on Android storage.", lastSyncedAt && ` Last synced: ${lastSyncedAt.toLocaleTimeString()}`]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						variant: "secondary",
						size: "sm",
						onClick: syncTransactions,
						isLoading: isSyncing,
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }),
						children: t.syncNow
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold text-rose-400 block",
						children: isAr ? "إعادة ضبط المصنع وإدارة تصفير البيانات (Factory Reset)" : "Authorized Factory Reset & Zero-Default-Data Wipe"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-neutral-500",
						children: isAr ? "اختر بين مسح بيانات هذا الجهاز محلياً أو إعادة ضبط الشركة بالكامل بدون أي بيانات افتراضية" : "Choose between Local Device Reset or Authorized Company Factory Reset (zero default data)"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							type: "button",
							variant: "danger",
							size: "sm",
							"data-testid": "open-factory-reset-modal-btn",
							onClick: () => {
								setFactoryResetError(null);
								setConfirmCompanyNameInput("");
								setOwnerPasswordInput("");
								setResetReasonInput("");
								setFactoryResetScope("LOCAL_DEVICE_RESET");
								setIsFactoryResetModalOpen(true);
							},
							leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-3.5 h-3.5" }),
							children: isAr ? "خيارات إعادة الضبط المعتمدة" : "Authorized Factory Reset"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldToConfirm, {
							onConfirm: resetAllData,
							label: isAr ? "مسح محلي سريع" : t.resetData,
							confirmingLabel: isAr ? "جاري المسح..." : "Erasing data...",
							confirmedLabel: isAr ? "تم المسح" : "Reset Complete",
							variant: "danger",
							className: "w-full sm:w-auto text-xs min-h-[38px]"
						})]
					})]
				})
			] }),
			isFactoryResetModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-testid": "factory-reset-modal",
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-xl bg-neutral-900 border border-rose-500/40 rounded-2xl shadow-2xl overflow-hidden my-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-5 h-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm sm:text-base font-black text-white",
								children: isAr ? "بوابة إعادة ضبط المصنع المعتمدة (بدون بيانات افتراضية)" : "Authorized Factory Reset (Zero Default Business Data)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-neutral-400",
								children: isAr ? "لن يتم توليد أي منتجات أو عملات أو حسابات افتراضية بعد إعادة الضبط" : "No sample products, currencies, or fictional accounts will be created after reset"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-testid": "factory-reset-close-btn",
							onClick: () => setIsFactoryResetModalOpen(false),
							className: "p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 space-y-4",
						children: [
							factoryResetError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-testid": "factory-reset-error-banner",
								className: "p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 shrink-0 text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: factoryResetError })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "reset-scope-local-btn",
									onClick: () => {
										setFactoryResetScope("LOCAL_DEVICE_RESET");
										setFactoryResetError(null);
									},
									className: `p-3.5 rounded-xl border text-start transition-all ${factoryResetScope === "LOCAL_DEVICE_RESET" ? "bg-amber-500/15 border-amber-500 text-amber-200" : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1",
											children: isAr ? "النطاق أ — الجهاز المحلي فقط" : "SCOPE A — LOCAL DEVICE RESET"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-white block",
											children: isAr ? "مسح حالة الجهاز المحلي فقط" : "Local Device Reset Only"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-neutral-400 mt-1 block",
											children: isAr ? "يمسح الكاش المحلي وبيانات المتصفح دون حذف سجلات الشركة على الخادم." : "Clears local cached data and local session without deleting server-side company records."
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "reset-scope-company-btn",
									onClick: () => {
										setFactoryResetScope("COMPANY_FACTORY_RESET");
										setFactoryResetError(null);
									},
									className: `p-3.5 rounded-xl border text-start transition-all ${factoryResetScope === "COMPANY_FACTORY_RESET" ? "bg-rose-500/15 border-rose-500 text-rose-200" : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-black uppercase tracking-wider text-rose-400 block mb-1",
											children: isAr ? "النطاق ب — إعادة ضبط الشركة بالكامل" : "SCOPE B — COMPANY FACTORY RESET"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-white block",
											children: isAr ? "تصفير الشركة بالكامل وإلغاء الجلسات" : "Full Company Workspace Reset"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-neutral-400 mt-1 block",
											children: isAr ? "يحذف بيانات الشركة المحددة فقط ويعيدها إلى شاشة التأسيس النظيفة مع حفظ سجل التدقيق." : "Wipes selected company data, revokes sessions, preserves audit logs & other companies."
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-black text-rose-300 block",
										children: isAr ? "ما الذي سيتم حذفه:" : "What Will Be Deleted:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-1 text-[11px] text-neutral-300 list-disc list-inside",
										children: factoryResetScope === "LOCAL_DEVICE_RESET" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: isAr ? "المنتجات والفواتير المخزنة محلياً في هذا الجهاز" : "Local cached products, sales & cart on this device" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: isAr ? "العملات وأسعار الصرف المحفوظة محلياً" : "Local cached currencies & exchange rates" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: isAr ? "جلسة العمل المحلية الحالية" : "Current local device session state" })
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: isAr ? "جميع المنتجات والعملاء والفواتير وحركات المخزون للشركة الحالية" : "All products, customers, sales & stock movements for this company" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: isAr ? "جميع العملات وأسعار الصرف والحسابات المضافة في هذه الشركة" : "All company currencies, exchange rates & employee accounts" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: isAr ? "إلغاء جميع الجلسات النشطة وإعادة التوجيه لشاشة التأسيس" : "All active company sessions (revoked immediately)" })
										] })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-black text-emerald-300 block",
										children: isAr ? "ما الذي سيتم الحفاظ عليه:" : "What Will Be Preserved:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-1 text-[11px] text-neutral-300 list-disc list-inside",
										children: factoryResetScope === "LOCAL_DEVICE_RESET" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: isAr ? "حساب الشركة وسجلات الخادم" : "Server-side company records & accounts" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: isAr ? "الشركات الأخرى وبيئة التدريب المعزولة" : "Other companies & isolated Practice Mode" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: isAr ? "عدم إضافة أي بيانات افتراضية (0 منتجات / 0 عملات)" : "Zero default business data injected (0 products / 0 currencies)" })
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: isAr ? "سجلات التدقيق والامتثال الأمني (Audit Logs)" : "Immutable compliance & security audit trail records" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: isAr ? "جميع الشركات الأخرى المستقلة وبياناتها" : "All other tenant companies & isolated Practice Mode" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: isAr ? "عودة نظيفة 100% بدون أي بيانات افتراضية" : "100% clean onboarding state with zero default records" })
										] })
									})]
								})]
							}),
							factoryResetScope === "COMPANY_FACTORY_RESET" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-xl bg-neutral-950 border border-rose-500/30 space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs font-bold text-rose-300",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? `تأكيد مصادقة المالك لإعادة ضبط الشركة (${currentCompany.displayName || currentCompany.legalName})` : `Owner Re-Authentication Required for (${currentCompany.displayName || currentCompany.legalName})` })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-[11px] font-bold text-neutral-300 mb-1",
											children: isAr ? `اكتب اسم الشركة للتأكيد (${currentCompany.displayName || currentCompany.legalName}) *` : `Type Company Name (${currentCompany.displayName || currentCompany.legalName}) *`
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											"data-testid": "factory-reset-company-name-input",
											value: confirmCompanyNameInput,
											onChange: (e) => setConfirmCompanyNameInput(e.target.value),
											placeholder: currentCompany.displayName || currentCompany.legalName,
											className: "w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-rose-500"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-[11px] font-bold text-neutral-300 mb-1",
											children: isAr ? "كلمة مرور المالك أو رمز PIN للتأكيد *" : "Owner Password or PIN *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "password",
											"data-testid": "factory-reset-password-input",
											value: ownerPasswordInput,
											onChange: (e) => setOwnerPasswordInput(e.target.value),
											placeholder: "••••••••",
											className: "w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-rose-500"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[11px] font-bold text-neutral-400 mb-1",
										children: isAr ? "سبب إعادة الضبط (يُحفظ في سجل التدقيق)" : "Reset Reason (Saved in Audit Trail)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										"data-testid": "factory-reset-reason-input",
										value: resetReasonInput,
										onChange: (e) => setResetReasonInput(e.target.value),
										placeholder: isAr ? "مثال: إعادة تهيئة المتجر لبداية سنة مالية جديدة" : "e.g. Clean re-initialization for production launch",
										className: "w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-rose-500"
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
									type: "button",
									variant: "secondary",
									size: "sm",
									onClick: () => setIsFactoryResetModalOpen(false),
									children: isAr ? "إلغاء" : "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
									type: "button",
									variant: "danger",
									size: "sm",
									"data-testid": "factory-reset-confirm-btn",
									isLoading: isExecutingReset,
									leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }),
									onClick: async () => {
										setFactoryResetError(null);
										setIsExecutingReset(true);
										try {
											const res = await executeAuthorizedFactoryReset({
												scope: factoryResetScope,
												confirmCompanyName: confirmCompanyNameInput,
												ownerUsernameOrId: currentUser.username || currentUser.id,
												ownerPassword: ownerPasswordInput,
												reason: resetReasonInput
											});
											if (!res.ok) {
												setFactoryResetError(res.error || (isAr ? "فشل التحقق من صلاحيات إعادة الضبط." : "Factory reset authorization failed."));
												return;
											}
											setIsFactoryResetModalOpen(false);
										} finally {
											setIsExecutingReset(false);
										}
									},
									children: factoryResetScope === "LOCAL_DEVICE_RESET" ? isAr ? "تأكيد مسح بيانات الجهاز المحلي (0 بيانات افتراضية)" : "Confirm Local Device Reset (0 Defaults)" : isAr ? "تأكيد إعادة ضبط الشركة بالكامل" : "Confirm Company Factory Reset"
								})]
							})
						]
					})]
				})
			})
		]
	});
};
export { SettingsView };
