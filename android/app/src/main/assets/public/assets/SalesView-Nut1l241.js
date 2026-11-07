import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { A as RotateCcw, D as Search, F as Plus, N as QrCode, Nt as CircleAlert, Rt as Check, Tt as Coins, U as PackageCheck, Yt as Banknote, at as Image, d as Upload, en as ArrowRightLeft, f as Truck, g as Trash2, gt as FileText, j as RefreshCw, jt as CircleCheck, kt as CircleX, m as TrendingUp, n as X, nt as Landmark, ot as History, sn as require_react, st as Hash, vt as Eye, w as ShieldCheck } from "./vendor-icons-DoijI_tq.js";
import { A as useDebouncedValue, O as compressImageToOptimalDataUrl, P as playTactileClick, it as getAllTransactionReceiptImages, lt as roundCurrencyValue, n as usePOS, nt as formatPaymentMethodLabel, ot as getConvertedTransactionView, tt as formatCurrency } from "./POSContext-nila8oYV.js";
import { i as require_jsx_runtime } from "./vendor-motion-CekIsQM-.js";
import { _ as TactileButton, g as parseNormalizedNumber, h as normalizeNumberInput, m as HoldToConfirm, n as AppModal, p as AppInput, t as ReceiptModal, v as getTranslation } from "./index-DYJDckRU.js";
import { t as AppCard } from "./AppCard-B2erL08q.js";
import { t as GoodsReceiptModal } from "./GoodsReceiptModal-DiRfRwIF.js";
// src/components/sales/SalesView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
function compressReceiptImageToDataUrl(file, maxDim = 640) {
	return compressImageToOptimalDataUrl(file, maxDim, .82);
}
var SalesView = () => {
	const { transactions, voidTransaction, settleTransactionDebt, updateTransactionFulfillment, applyNewRateToTransaction, applyNewRateToAllTransactions, settings, updateSettings, currencies, exchangeRates, updateExchangeRate, setActiveTab } = usePOS();
	const t = getTranslation(settings.language);
	const isAr = settings.language === "ar";
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const debouncedSearchQuery = useDebouncedValue(searchQuery, 120);
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [valuationMode, setValuationMode] = (0, import_react.useState)("historical");
	const [anchorCurrency, setAnchorCurrency] = (0, import_react.useState)("USD");
	const [rateEditCurrency, setRateEditCurrency] = (0, import_react.useState)(settings.currency && settings.currency !== "SDG" ? settings.currency : "USD");
	const [rateInputDraft, setRateInputDraft] = (0, import_react.useState)(() => {
		const initialCode = settings.currency && settings.currency !== "SDG" ? settings.currency : "USD";
		return String(exchangeRates[initialCode] || 2700);
	});
	const [rateSaveFeedback, setRateSaveFeedback] = (0, import_react.useState)(null);
	const [selectedReceiptTxn, setSelectedReceiptTxn] = (0, import_react.useState)(null);
	const [previewNotificationTxn, setPreviewNotificationTxn] = (0, import_react.useState)(null);
	const [isGoodsReceiptOpen, setIsGoodsReceiptOpen] = (0, import_react.useState)(false);
	const [settlingTxnId, setSettlingTxnId] = (0, import_react.useState)(null);
	const [debtInstallmentInput, setDebtInstallmentInput] = (0, import_react.useState)("");
	const [debtTotalPaidInput, setDebtTotalPaidInput] = (0, import_react.useState)("");
	const [debtRemainingInput, setDebtRemainingInput] = (0, import_react.useState)("");
	const [debtSaleRateInput, setDebtSaleRateInput] = (0, import_react.useState)("");
	const [debtPaymentMethod, setDebtPaymentMethod] = (0, import_react.useState)("bank_transfer");
	const [debtTransferRef, setDebtTransferRef] = (0, import_react.useState)("");
	const [debtNewReceiptImages, setDebtNewReceiptImages] = (0, import_react.useState)([]);
	const [debtReceiptUrlInput, setDebtReceiptUrlInput] = (0, import_react.useState)("");
	const [debtSettlementNote, setDebtSettlementNote] = (0, import_react.useState)("");
	const [debtErrorMsg, setDebtErrorMsg] = (0, import_react.useState)(null);
	const debtReceiptFileInputRef = (0, import_react.useRef)(null);
	const activeCurrencyCodes = (0, import_react.useMemo)(() => {
		const list = currencies && currencies.length > 0 ? currencies.filter((c) => c.isActive !== false).map((c) => c.code.toUpperCase()) : [
			"SDG",
			"USD",
			"SAR",
			"AED",
			"EUR",
			"GBP"
		];
		return Array.from(/* @__PURE__ */ new Set(["SDG", ...list]));
	}, [currencies]);
	const foreignCurrencyCodes = (0, import_react.useMemo)(() => {
		const list = activeCurrencyCodes.filter((c) => c !== "SDG");
		return list.length > 0 ? list : [
			"USD",
			"SAR",
			"AED",
			"EUR",
			"GBP"
		];
	}, [activeCurrencyCodes]);
	(0, import_react.useEffect)(() => {
		const targetCode = settings.currency && settings.currency !== "SDG" ? settings.currency.toUpperCase() : anchorCurrency.toUpperCase();
		setRateEditCurrency(targetCode);
		if (exchangeRates[targetCode]) setRateInputDraft(String(exchangeRates[targetCode]));
	}, [
		settings.currency,
		anchorCurrency,
		exchangeRates
	]);
	const handleSelectRateEditCurrency = (code) => {
		const clean = code.toUpperCase();
		setRateEditCurrency(clean);
		setAnchorCurrency(clean);
		setRateInputDraft(String(exchangeRates[clean] || 1));
	};
	const handleSaveQuickRate = async (e) => {
		e.preventDefault();
		const parsed = parseFloat(rateInputDraft);
		if (!Number.isFinite(parsed) || parsed <= 0) return;
		setAnchorCurrency(rateEditCurrency);
		await updateExchangeRate({
			sourceCurrency: rateEditCurrency,
			targetCurrency: "SDG",
			rate: parsed
		});
		setRateSaveFeedback(isAr ? `تم تحديث سعر الصرف: 1 ${rateEditCurrency} = ${parsed} ج.س` : `Updated rate: 1 ${rateEditCurrency} = ${parsed} SDG`);
		setTimeout(() => setRateSaveFeedback(null), 3e3);
	};
	const filteredTransactions = (0, import_react.useMemo)(() => {
		const q = debouncedSearchQuery.toLowerCase();
		return transactions.filter((tx) => {
			const matchSearch = !q || tx.id.toLowerCase().includes(q) || tx.customerName && tx.customerName.toLowerCase().includes(q) || tx.paymentMethod.toLowerCase().includes(q) || tx.transferReference && tx.transferReference.toLowerCase().includes(q);
			const matchStatus = statusFilter === "all" || tx.status === statusFilter;
			return matchSearch && matchStatus;
		});
	}, [
		transactions,
		debouncedSearchQuery,
		statusFilter
	]);
	const convertedRows = (0, import_react.useMemo)(() => {
		return filteredTransactions.map((tx) => ({
			tx,
			view: getConvertedTransactionView(tx, settings.currency, exchangeRates, valuationMode, anchorCurrency)
		}));
	}, [
		filteredTransactions,
		settings.currency,
		exchangeRates,
		valuationMode,
		anchorCurrency
	]);
	const salesSummary = (0, import_react.useMemo)(() => {
		let grossTotal = 0;
		let collectedTotal = 0;
		let debtTotal = 0;
		let outOfSyncCount = 0;
		for (const { tx, view } of convertedRows) if (tx.status === "completed") {
			grossTotal += view.grandTotal;
			collectedTotal += view.amountPaid;
			debtTotal += view.debtAmount;
			if (view.hasRateChanged) outOfSyncCount += 1;
		}
		return {
			grossTotal,
			collectedTotal,
			debtTotal,
			outOfSyncCount
		};
	}, [convertedRows]);
	const handleVoid = (id) => {
		voidTransaction(id);
	};
	const handleSyncAllToNewRate = () => {
		const count = applyNewRateToAllTransactions(false, anchorCurrency);
		setRateSaveFeedback(isAr ? `تم ربط وتحديث ${count} فاتورة بسعر الصرف الجديد بنجاح` : `Successfully linked & updated ${count} invoices to the new exchange rate`);
		setTimeout(() => setRateSaveFeedback(null), 3e3);
	};
	const activeSettlingData = (0, import_react.useMemo)(() => {
		if (!settlingTxnId) return null;
		const found = convertedRows.find((r) => r.tx.id === settlingTxnId);
		if (found) return found;
		const rawTx = transactions.find((t) => t.id === settlingTxnId);
		if (!rawTx) return null;
		return {
			tx: rawTx,
			view: getConvertedTransactionView(rawTx, settings.currency, exchangeRates, valuationMode, anchorCurrency)
		};
	}, [
		settlingTxnId,
		convertedRows,
		transactions,
		settings.currency,
		exchangeRates,
		valuationMode,
		anchorCurrency
	]);
	const openDebtSettlementModal = (tx) => {
		playTactileClick(settings.soundEnabled);
		const view = getConvertedTransactionView(tx, settings.currency, exchangeRates, valuationMode, anchorCurrency);
		const grandTotal = roundCurrencyValue(view.grandTotal);
		const prevPaid = roundCurrencyValue(view.amountPaid);
		const currentDebt = roundCurrencyValue(view.debtAmount);
		const defaultInstallment = currentDebt > 0 ? currentDebt : 0;
		const nextTotalPaid = roundCurrencyValue(Math.min(grandTotal, prevPaid + defaultInstallment));
		const nextRemaining = roundCurrencyValue(Math.max(0, grandTotal - nextTotalPaid));
		setSettlingTxnId(tx.id);
		setDebtInstallmentInput(String(defaultInstallment));
		setDebtTotalPaidInput(String(nextTotalPaid));
		setDebtRemainingInput(String(nextRemaining));
		setDebtSaleRateInput(String(view.historicalRate || tx.exchangeRateUsed || 2700));
		setDebtPaymentMethod(tx.paymentMethod || "bank_transfer");
		setDebtTransferRef(tx.transferReference || "");
		setDebtNewReceiptImages([]);
		setDebtReceiptUrlInput("");
		setDebtSettlementNote("");
		setDebtErrorMsg(null);
	};
	const handleInstallmentAmountChange = (rawVal) => {
		if (!activeSettlingData) return;
		const cleaned = normalizeNumberInput(rawVal);
		setDebtInstallmentInput(cleaned);
		const grandTotal = roundCurrencyValue(activeSettlingData.view.grandTotal);
		const prevPaid = roundCurrencyValue(activeSettlingData.view.amountPaid);
		const maxInstallment = roundCurrencyValue(Math.max(0, grandTotal - prevPaid));
		const parsedInstallment = Math.max(0, Math.min(maxInstallment, parseNormalizedNumber(cleaned, 0)));
		const nextTotalPaid = roundCurrencyValue(Math.min(grandTotal, prevPaid + parsedInstallment));
		const nextRemaining = roundCurrencyValue(Math.max(0, grandTotal - nextTotalPaid));
		setDebtTotalPaidInput(String(nextTotalPaid));
		setDebtRemainingInput(String(nextRemaining));
		setDebtErrorMsg(null);
	};
	const handleTotalPaidDirectChange = (rawVal) => {
		if (!activeSettlingData) return;
		const cleaned = normalizeNumberInput(rawVal);
		setDebtTotalPaidInput(cleaned);
		const grandTotal = roundCurrencyValue(activeSettlingData.view.grandTotal);
		const prevPaid = roundCurrencyValue(activeSettlingData.view.amountPaid);
		const parsedTotalPaid = Math.max(0, Math.min(grandTotal, parseNormalizedNumber(cleaned, 0)));
		const nextRemaining = roundCurrencyValue(Math.max(0, grandTotal - parsedTotalPaid));
		const nextInstallment = roundCurrencyValue(Math.max(0, parsedTotalPaid - prevPaid));
		setDebtRemainingInput(String(nextRemaining));
		setDebtInstallmentInput(String(nextInstallment));
		setDebtErrorMsg(null);
	};
	const handleRemainingDirectChange = (rawVal) => {
		if (!activeSettlingData) return;
		const cleaned = normalizeNumberInput(rawVal);
		setDebtRemainingInput(cleaned);
		const grandTotal = roundCurrencyValue(activeSettlingData.view.grandTotal);
		const prevPaid = roundCurrencyValue(activeSettlingData.view.amountPaid);
		const parsedRemaining = Math.max(0, Math.min(grandTotal, parseNormalizedNumber(cleaned, 0)));
		const nextTotalPaid = roundCurrencyValue(Math.max(0, grandTotal - parsedRemaining));
		const nextInstallment = roundCurrencyValue(Math.max(0, nextTotalPaid - prevPaid));
		setDebtTotalPaidInput(String(nextTotalPaid));
		setDebtInstallmentInput(String(nextInstallment));
		setDebtErrorMsg(null);
	};
	const handleDebtReceiptFilesUpload = async (e) => {
		const fileList = e.target.files;
		if (!fileList || fileList.length === 0) return;
		const files = Array.from(fileList);
		try {
			const compressedList = [];
			for (const file of files) {
				const dataUrl = await compressReceiptImageToDataUrl(file);
				if (dataUrl) compressedList.push(dataUrl);
			}
			setDebtNewReceiptImages((prev) => [...prev, ...compressedList]);
			setDebtErrorMsg(null);
		} catch {
			setDebtErrorMsg(isAr ? "تعذر معالجة إحدى صور الإشعار" : "Failed to process one of the receipt images");
		} finally {
			if (debtReceiptFileInputRef.current) debtReceiptFileInputRef.current.value = "";
		}
	};
	const handleAddDebtReceiptUrl = () => {
		const clean = debtReceiptUrlInput.trim();
		if (!clean) return;
		playTactileClick(settings.soundEnabled);
		setDebtNewReceiptImages((prev) => prev.includes(clean) ? prev : [...prev, clean]);
		setDebtReceiptUrlInput("");
	};
	const handleRemoveStagedReceiptImage = (index) => {
		playTactileClick(settings.soundEnabled);
		setDebtNewReceiptImages((prev) => prev.filter((_, idx) => idx !== index));
	};
	const handleSubmitDebtSettlement = (e) => {
		e.preventDefault();
		if (!activeSettlingData) return;
		const grandTotal = roundCurrencyValue(activeSettlingData.view.grandTotal);
		const customTotalPaid = Math.max(0, Math.min(grandTotal, parseNormalizedNumber(debtTotalPaidInput, 0)));
		const pendingUrl = debtReceiptUrlInput.trim();
		const finalReceiptImages = pendingUrl ? Array.from(/* @__PURE__ */ new Set([...debtNewReceiptImages, pendingUrl])) : debtNewReceiptImages;
		if (debtPaymentMethod === "bank_transfer" && customTotalPaid > 0 && !debtTransferRef.trim() && !activeSettlingData.tx.transferReference) {
			setDebtErrorMsg(isAr ? "يرجى إدخال رقم العملية للتحويل البنكي أو اختيار طريقة دفع أخرى." : "Please enter the Bank Transfer reference number or select another payment method.");
			return;
		}
		const parsedCustomSaleRate = parseNormalizedNumber(debtSaleRateInput, activeSettlingData.view.historicalRate);
		settleTransactionDebt(activeSettlingData.tx.id, valuationMode === "indexed", anchorCurrency, {
			customTotalPaidInDisplayCurrency: customTotalPaid,
			displayCurrency: settings.currency,
			paymentMethod: debtPaymentMethod,
			transferReference: debtTransferRef.trim() || void 0,
			receiptImages: finalReceiptImages,
			note: debtSettlementNote.trim() || void 0,
			useIndexedNewRate: valuationMode === "indexed",
			anchorCurrency,
			customSaleExchangeRate: Number.isFinite(parsedCustomSaleRate) && parsedCustomSaleRate > 0 ? parsedCustomSaleRate : void 0
		});
		setSettlingTxnId(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-5 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl sm:text-2xl font-extrabold text-white tracking-tight",
					children: t.salesHistory
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-neutral-400",
					children: isAr ? `${transactions.length} فاتورة مسجلة • يتم تحويل القيم والديون تلقائياً حسب العملة وسعر الصرف` : `${transactions.length} total orders • Totals & debts convert dynamically by currency & exchange rate`
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						variant: "emerald",
						size: "sm",
						"data-testid": "sales-open-goods-receipt-btn",
						onClick: () => setIsGoodsReceiptOpen(true),
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "w-3.5 h-3.5" }),
						children: t.receiveSupplierGoodsBtn
					}), salesSummary.outOfSyncCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						variant: "amber",
						size: "sm",
						onClick: handleSyncAllToNewRate,
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5" }),
						children: isAr ? `تثبيت كل الفواتير والديون بالسعر الجديد (${salesSummary.outOfSyncCount})` : `Sync All Invoices to New Rate (${salesSummary.outOfSyncCount})`
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4 border-neutral-800 bg-neutral-900/80 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] font-semibold text-neutral-400 block mb-1",
							children: [
								t.grossSales,
								" (",
								settings.currency,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"data-testid": "sales-kpi-gross",
							className: "text-lg sm:text-xl font-extrabold text-emerald-400 tabular-nums",
							children: formatCurrency(salesSummary.grossTotal, settings.currency, settings.language)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-5 h-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4 border-neutral-800 bg-neutral-900/80 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] font-semibold text-neutral-400 block mb-1",
							children: [
								t.totalCollectedSales,
								" (",
								settings.currency,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"data-testid": "sales-kpi-collected",
							className: "text-lg sm:text-xl font-extrabold text-amber-400 tabular-nums",
							children: formatCurrency(salesSummary.collectedTotal, settings.currency, settings.language)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800/50 flex items-center justify-center text-amber-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "w-5 h-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4 border-neutral-800 bg-neutral-900/80 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] font-semibold text-neutral-400 block mb-1",
							children: [
								t.totalOutstandingDebts,
								" (",
								settings.currency,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"data-testid": "sales-kpi-debt",
							className: "text-lg sm:text-xl font-extrabold text-rose-400 tabular-nums",
							children: formatCurrency(salesSummary.debtTotal, settings.currency, settings.language)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-800/50 flex items-center justify-center text-rose-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-5 h-5" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
				className: "p-4 border-amber-500/30 bg-neutral-900/95 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-4 items-start",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:col-span-4 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs font-bold text-neutral-300 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.salesDisplayCurrency })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap items-center gap-1.5",
								children: activeCurrencyCodes.map((code) => {
									const isSelected = settings.currency.toUpperCase() === code;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"data-testid": `sales-currency-btn-${code}`,
										onClick: () => updateSettings({ currency: code }),
										className: `px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${isSelected ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-sm" : "bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-amber-500/50 hover:text-white"}`,
										children: code
									}, code);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:col-span-4 space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs font-bold text-neutral-300 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "w-3.5 h-3.5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.quickRateUpdate })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleSaveQuickRate,
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center bg-neutral-950 border border-neutral-800 rounded-xl px-2 py-1 text-xs font-mono text-neutral-300 shrink-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													"aria-label": "Currency to edit exchange rate",
													value: rateEditCurrency,
													onChange: (e) => handleSelectRateEditCurrency(e.target.value),
													className: "bg-transparent font-bold text-amber-400 pl-1 pr-0.5 py-0.5 focus:outline-none cursor-pointer",
													children: foreignCurrencyCodes.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: code,
														className: "bg-neutral-900 text-white",
														children: code
													}, code))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mx-1",
													children: "="
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											step: "any",
											min: "0.0001",
											dir: "ltr",
											"data-testid": "sales-quick-rate-input",
											value: rateInputDraft,
											onChange: (e) => setRateInputDraft(e.target.value),
											className: "w-28 px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500",
											placeholder: "2700"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-mono text-neutral-400 shrink-0",
											children: "SDG"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
											type: "submit",
											variant: "emerald",
											size: "sm",
											"data-testid": "sales-quick-rate-submit",
											className: "shrink-0 px-3 py-1.5 text-xs",
											children: t.applyNewRateBtn
										})
									]
								}),
								rateSaveFeedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] font-semibold text-emerald-400 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rateSaveFeedback })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:col-span-4 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs font-bold text-neutral-300 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.rateValuationMode })]
								}), valuationMode === "indexed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 text-[10px] text-neutral-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "العملة المرجعية:" : "Anchor:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										"aria-label": "Anchor Hard Currency",
										value: anchorCurrency,
										onChange: (e) => handleSelectRateEditCurrency(e.target.value),
										className: "bg-neutral-950 border border-neutral-800 rounded px-1.5 py-0.5 text-amber-400 font-mono font-bold focus:outline-none",
										children: foreignCurrencyCodes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: c,
											className: "bg-neutral-900 text-white",
											children: c
										}, c))
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": "valuation-mode-historical",
										onClick: () => setValuationMode("historical"),
										className: `px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${valuationMode === "historical" ? "bg-emerald-500 text-neutral-950 shadow-sm" : "text-neutral-400 hover:text-white"}`,
										title: t.modeHistoricalRate,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-3 h-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: isAr ? "سعر الصرف وقت البيع" : "Saved Sale Rate"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": "valuation-mode-indexed",
										onClick: () => setValuationMode("indexed"),
										className: `px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${valuationMode === "indexed" ? "bg-amber-500 text-neutral-950 shadow-sm" : "text-neutral-400 hover:text-white"}`,
										title: t.modeIndexedRate,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3 h-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: isAr ? "ربط بالسعر الجديد" : "Linked New Rate"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": "valuation-mode-live",
										onClick: () => setValuationMode("live"),
										className: `px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${valuationMode === "live" ? "bg-blue-500 text-neutral-950 shadow-sm" : "text-neutral-400 hover:text-white"}`,
										title: t.modeLiveRate,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3 h-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: isAr ? "تحويل مباشر" : "Live Direct"
										})]
									})
								]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						valuationMode === "historical" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-emerald-300 font-semibold",
							children: isAr ? "وضع حفظ الفواتير بسعر الصرف وقت البيع (مفعل افتراضياً): تحفظ وتُعرض كل فاتورة بسعر الصرف الذي تم البيع به لحظة إصدارها دون أن تتغير عند تعديل سعر الصرف لاحقاً." : "Saved Sale Exchange Rate Mode (Default): Every invoice is saved and displayed at the exact exchange rate locked when the sale was made."
						}),
						valuationMode === "indexed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? `وضع الحماية من تغير الصرف: يتم حفظ قيمة الفاتورة والدين بعملة (${anchorCurrency}) وقت البيع، وعند تغير سعر الصرف تتعدل القيمة تلقائياً بالسعر الجديد (${exchangeRates[anchorCurrency] || 2700} ج.س).` : `Inflation-Protected Mode: Invoices & debts retain their ${anchorCurrency} value at time of sale and automatically adjust to the new exchange rate (${exchangeRates[anchorCurrency] || 2700} SDG).` }),
						valuationMode === "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? `وضع التحويل المباشر: يحول مبلغ الفاتورة المسجل مباشرة إلى (${settings.currency}) باستخدام سعر الصرف الحالي.` : `Direct Live Mode: Converts the recorded invoice amount directly to ${settings.currency} using today's exchange rate.` })
					] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
						placeholder: t.searchTransactions,
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4" }),
						rightIcon: searchQuery ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSearchQuery(""),
							className: "p-1 text-neutral-400 hover:text-white",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
						}) : void 0
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800",
					children: [
						"all",
						"completed",
						"voided"
					].map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setStatusFilter(st),
						className: `px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${statusFilter === st ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-400 hover:text-neutral-200"}`,
						children: st === "all" ? isAr ? "الكل" : "All" : st === "completed" ? t.completed : t.voided
					}, st))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: convertedRows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppCard, {
					className: "text-center p-12 text-xs text-neutral-500",
					children: isAr ? "لا توجد فواتير مطابقة للبحث." : "No transactions match your search filter."
				}) : convertedRows.map(({ tx, view }) => {
					const isCompleted = tx.status === "completed";
					const hasDebt = isCompleted && view.debtAmount > 0;
					const allReceiptImages = getAllTransactionReceiptImages(tx);
					const installmentsCount = tx.debtPayments?.length || 0;
					const showOriginalBadge = view.originalCurrency !== settings.currency || Math.abs(view.grandTotal - tx.grandTotal) > 1e-4;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 mb-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-sm text-white",
										children: tx.id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${isCompleted ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/50" : "bg-rose-950/80 text-rose-400 border border-rose-800/50"}`,
										children: [isCompleted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3 h-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "capitalize",
											children: isCompleted ? t.completed : t.voided
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-semibold text-amber-300 px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded",
										children: formatPaymentMethodLabel(tx.paymentMethod, settings.language)
									}),
									tx.transferReference && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] font-mono text-neutral-300 px-2 py-0.5 bg-neutral-900 border border-neutral-750 rounded flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "w-3 h-3 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tx.transferReference })]
									}),
									hasDebt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-950/90 text-rose-300 border border-rose-700/70 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											t.remainingDebt,
											":",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "tabular-nums",
												children: formatCurrency(view.debtAmount, settings.currency, settings.language)
											})
										] })]
									}) : isCompleted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-950/50 text-emerald-300 border border-emerald-800/40",
										children: t.paidInFull
									}),
									installmentsCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/40",
										children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["دفعات السداد: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono",
											children: installmentsCount
										})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Installments: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono",
											children: installmentsCount
										})] })
									}),
									allReceiptImages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setPreviewNotificationTxn(tx),
										className: "text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											"إشعارات الدفع (",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: allReceiptImages.length
											}),
											")"
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											"Receipts (",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: allReceiptImages.length
											}),
											")"
										] }) })]
									}),
									isCompleted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										(!tx.fulfillmentStatus || tx.fulfillmentStatus === "received") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											"data-testid": `sales-fulfillment-badge-${tx.id}`,
											className: "text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.fulfillmentReceivedBadge })]
										}),
										tx.fulfillmentStatus === "pending_goods" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											"data-testid": `sales-fulfillment-badge-${tx.id}`,
											className: "text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-700/60 flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.fulfillmentPendingGoodsBadge })]
										}),
										tx.fulfillmentStatus === "pending_invoice" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											"data-testid": `sales-fulfillment-badge-${tx.id}`,
											className: "text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-950/80 text-blue-300 border border-blue-700/60 flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.fulfillmentPendingInvoiceBadge })]
										})
									] }),
									showOriginalBadge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] px-2 py-0.5 rounded-md bg-neutral-950 text-neutral-300 border border-neutral-800",
										children: [
											t.originalInvoiceValue,
											":",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold tabular-nums",
												children: formatCurrency(tx.grandTotal, view.originalCurrency, settings.language)
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": `saved-sale-rate-badge-${tx.id}`,
										onClick: () => openDebtSettlementModal(tx),
										className: "text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 flex items-center gap-1.5 transition-colors",
										title: isAr ? "الفاتورة محفوظة بسعر الصرف الذي تم البيع به (اضغط للتخصيص)" : "Invoice is saved at the exchange rate used at time of sale (click to customize)",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-3 h-3 text-emerald-400 shrink-0" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												isAr ? "سعر الصرف المحفوظ وقت البيع:" : "Saved Sale Rate:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono font-extrabold text-white tabular-nums",
													dir: "ltr",
													children: [
														"1 ",
														view.referenceCurrency,
														" = ",
														view.historicalRate,
														" SDG"
													]
												})
											] }),
											view.hasRateChanged && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] text-amber-300 font-semibold",
												children: valuationMode === "historical" ? isAr ? `(ثابت • الحالي ${view.currentRate})` : `(Locked • Live ${view.currentRate})` : `→ ${view.currentRate}`
											})
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-neutral-400 flex flex-wrap items-center gap-x-3 gap-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: new Date(tx.timestamp).toLocaleString()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tx.customerName || t.walkInCustomer }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										tx.items.reduce((acc, i) => acc + i.quantity, 0),
										" ",
										t.itemsCount,
										" (",
										tx.items.map((i) => i.productName).slice(0, 2).join(", "),
										tx.items.length > 2 ? "..." : "",
										")"
									] })
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-left sm:text-right",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"data-testid": `sales-row-total-${tx.id}`,
										className: "text-base font-bold text-emerald-400 tabular-nums block",
										children: formatCurrency(view.grandTotal, settings.currency, settings.language)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center sm:justify-end gap-2 text-[10px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-neutral-300",
											children: [
												isAr ? "المدفوع:" : "Paid:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-emerald-300 tabular-nums",
													children: formatCurrency(view.amountPaid, settings.currency, settings.language)
												})
											]
										}), hasDebt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-rose-400 font-semibold",
											children: [
												isAr ? "المتبقي:" : "Remaining:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold tabular-nums",
													children: formatCurrency(view.debtAmount, settings.currency, settings.language)
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-neutral-400 block mt-0.5",
										children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											"بسعر صرف البيع:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono font-semibold text-amber-300 tabular-nums",
												dir: "ltr",
												children: [
													"1 ",
													view.referenceCurrency,
													" = ",
													view.historicalRate
												]
											})
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											"At Sale Rate:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono font-semibold text-amber-300 tabular-nums",
												dir: "ltr",
												children: [
													"1 ",
													view.referenceCurrency,
													" = ",
													view.historicalRate
												]
											})
										] })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									isCompleted && tx.fulfillmentStatus && tx.fulfillmentStatus !== "received" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
										variant: "emerald",
										size: "sm",
										"data-testid": `confirm-fulfillment-btn-${tx.id}`,
										onClick: () => updateTransactionFulfillment(tx.id, "received"),
										leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "w-3.5 h-3.5" }),
										children: t.confirmGoodsReceiptBtn
									}),
									isCompleted && view.hasRateChanged && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
										variant: "secondary",
										size: "sm",
										onClick: () => applyNewRateToTransaction(tx.id, anchorCurrency),
										leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5 text-amber-400" }),
										title: t.syncInvoiceToNewRate,
										children: t.syncInvoiceToNewRate
									}),
									allReceiptImages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TactileButton, {
										variant: "secondary",
										size: "sm",
										onClick: () => setPreviewNotificationTxn(tx),
										leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-3.5 h-3.5 text-amber-400" }),
										children: [
											t.transferReceiptImage,
											" (",
											allReceiptImages.length,
											")"
										]
									}),
									isCompleted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
										variant: hasDebt ? "emerald" : "secondary",
										size: "sm",
										"data-testid": `open-debt-settlement-btn-${tx.id}`,
										onClick: () => openDebtSettlementModal(tx),
										leftIcon: hasDebt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "w-3.5 h-3.5 text-amber-400" }),
										children: hasDebt ? t.settleDebt : isAr ? "تخصيص الدفع / الإشعارات" : "Customize Payment"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
										variant: "secondary",
										size: "sm",
										onClick: () => setSelectedReceiptTxn(tx),
										leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" }),
										children: isAr ? "الفاتورة" : "Receipt"
									}),
									isCompleted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldToConfirm, {
										onConfirm: () => handleVoid(tx.id),
										label: isAr ? "إلغاء" : "Void",
										confirmingLabel: isAr ? "جارٍ الإلغاء..." : "Voiding...",
										confirmedLabel: isAr ? "ملغاة" : "Voided",
										variant: "danger",
										className: "py-1 px-3 text-xs min-h-[36px]",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3.5 h-3.5" })
									})
								]
							})]
						})]
					}, tx.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
				isOpen: Boolean(activeSettlingData),
				onClose: () => setSettlingTxnId(null),
				title: isAr ? `تسديد الدين وتخصيص الدفعات • ${activeSettlingData?.tx.id || ""}` : `Debt Settlement & Payment Customization • ${activeSettlingData?.tx.id || ""}`,
				description: isAr ? "خصّص المبلغ المدفوع من الإجمالي والمبلغ المتبقي، وحدد طريقة الدفع، وأرفق صورة أو عدة صور إشعار لكل دفعة" : "Customize how much was paid out of the total and how much remains, choose payment method, and attach multiple receipt images",
				maxWidth: "2xl",
				children: activeSettlingData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmitDebtSettlement,
					"data-testid": "debt-settlement-modal",
					className: "flex flex-col gap-4 max-h-[78vh] overflow-y-auto pr-1",
					children: [
						debtErrorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0 text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: debtErrorMsg })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-3 gap-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-2xl bg-neutral-950 border border-neutral-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-neutral-400 block mb-0.5",
										children: isAr ? "المبلغ الإجمالي للفاتورة" : "Invoice Grand Total"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base font-extrabold text-white tabular-nums",
										children: formatCurrency(activeSettlingData.view.grandTotal, settings.currency, settings.language)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-emerald-300 block mb-0.5",
										children: isAr ? "المدفوع سابقاً" : "Previously Paid"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base font-extrabold text-emerald-400 tabular-nums",
										children: formatCurrency(activeSettlingData.view.amountPaid, settings.currency, settings.language)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-2xl bg-rose-950/30 border border-rose-800/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-rose-300 block mb-0.5",
										children: isAr ? "الدين المتبقي حالياً" : "Current Remaining Debt"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base font-extrabold text-rose-400 tabular-nums",
										children: formatCurrency(activeSettlingData.view.debtAmount, settings.currency, settings.language)
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl bg-neutral-950/90 border border-amber-500/30 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold text-amber-400 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تخصيص كم دفع من المبلغ الإجمالي وكم المتبقي" : "Customize Paid Amount & Remaining Balance" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center flex-wrap gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"data-testid": "debt-preset-full-btn",
												onClick: () => {
													playTactileClick(settings.soundEnabled);
													handleTotalPaidDirectChange(String(roundCurrencyValue(activeSettlingData.view.grandTotal)));
												},
												className: "px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold transition-colors",
												children: isAr ? "سداد كامل المتبقي (100%)" : "Pay Full Remaining (100%)"
											}),
											activeSettlingData.view.debtAmount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"data-testid": "debt-preset-half-btn",
												onClick: () => {
													playTactileClick(settings.soundEnabled);
													handleInstallmentAmountChange(String(roundCurrencyValue(activeSettlingData.view.debtAmount / 2)));
												},
												className: "px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[11px] font-bold transition-colors",
												children: isAr ? "نصف المتبقي (50%)" : "Half Remaining (50%)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													playTactileClick(settings.soundEnabled);
													handleTotalPaidDirectChange("0");
												},
												className: "px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-[11px] font-semibold transition-colors",
												children: isAr ? "تصفير المدفوع (دين كامل)" : "Reset to Unpaid"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
											label: isAr ? `مبلغ الدفعة الحالية الآن (${settings.currency})` : `Current Installment Paid (${settings.currency})`,
											"data-testid": "debt-installment-amount-input",
											type: "text",
											inputMode: "decimal",
											dir: "ltr",
											value: debtInstallmentInput,
											onChange: (e) => handleInstallmentAmountChange(e.target.value)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
											label: isAr ? `إجمالي المدفوع من الفاتورة (${settings.currency})` : `Total Paid of Invoice (${settings.currency})`,
											"data-testid": "debt-custom-total-paid-input",
											type: "text",
											inputMode: "decimal",
											dir: "ltr",
											value: debtTotalPaidInput,
											onChange: (e) => handleTotalPaidDirectChange(e.target.value)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
											label: isAr ? `المبلغ المتبقي كدين (${settings.currency})` : `Remaining Debt Balance (${settings.currency})`,
											"data-testid": "debt-custom-remaining-input",
											type: "text",
											inputMode: "decimal",
											dir: "ltr",
											value: debtRemainingInput,
											onChange: (e) => handleRemainingDirectChange(e.target.value)
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-neutral-400",
											children: isAr ? "حالة الفاتورة بعد الحفظ:" : "Status After Save:"
										}), parseNormalizedNumber(debtRemainingInput, 0) <= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold",
											children: isAr ? "مدفوعة بالكامل (لا يوجد دين متبقي)" : "Paid in Full (0 Debt)"
										}) : parseNormalizedNumber(debtTotalPaidInput, 0) > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold",
											children: isAr ? "مدفوعة جزئياً (يوجد متبقي)" : "Partially Paid (Remaining Debt)"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold",
											children: isAr ? "غير مدفوعة (دين كامل)" : "Unpaid (Full Debt)"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-neutral-300",
											children: [
												isAr ? "المدفوع:" : "Paid:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-emerald-400 tabular-nums",
													children: formatCurrency(parseNormalizedNumber(debtTotalPaidInput, 0), settings.currency, settings.language)
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-neutral-300",
											children: [
												isAr ? "المتبقي:" : "Remaining:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-rose-400 tabular-nums",
													children: formatCurrency(parseNormalizedNumber(debtRemainingInput, 0), settings.currency, settings.language)
												})
											]
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-white block",
									children: isAr ? "تحديد طريقة دفع هذه الدفعة" : "Select Payment Method"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-3 gap-2",
									children: [
										{
											id: "cash",
											labelAr: "نقداً (كاش)",
											labelEn: "Cash",
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "w-4 h-4" })
										},
										{
											id: "bank_transfer",
											labelAr: "تحويل بنكي",
											labelEn: "Bank Transfer",
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "w-4 h-4" })
										},
										{
											id: "qr_nfc",
											labelAr: "محفظة رقمية",
											labelEn: "Digital Wallet",
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "w-4 h-4" })
										}
									].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": `debt-method-${m.id}`,
										onClick: () => {
											playTactileClick(settings.soundEnabled);
											setDebtPaymentMethod(m.id);
										},
										className: `p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${debtPaymentMethod === m.id ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-sm" : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700"}`,
										children: [m.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? m.labelAr : m.labelEn })]
									}, m.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
											label: isAr ? "رقم العملية / مرجع التحويل أو السداد" : "Operation / Transfer Reference Number",
											"data-testid": "debt-transfer-ref-input",
											value: debtTransferRef,
											onChange: (e) => setDebtTransferRef(e.target.value),
											placeholder: isAr ? "مثال: BNK-2026-9941" : "e.g. BNK-2026-9941"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
											label: isAr ? `سعر الصرف المحفوظ وقت البيع (1 ${activeSettlingData.view.referenceCurrency} = ج.س)` : `Saved Sale Rate (1 ${activeSettlingData.view.referenceCurrency} = SDG)`,
											"data-testid": "debt-sale-rate-input",
											type: "text",
											inputMode: "decimal",
											dir: "ltr",
											value: debtSaleRateInput,
											onChange: (e) => setDebtSaleRateInput(normalizeNumberInput(e.target.value))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
											label: isAr ? "ملاحظة على الدفعة (اختياري)" : "Installment Note (Optional)",
											value: debtSettlementNote,
											onChange: (e) => setDebtSettlementNote(e.target.value),
											placeholder: isAr ? "مثال: الدفعة الثانية عبر بنكك" : "e.g. Second installment via bank app"
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold text-emerald-400 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "إرفاق صور إشعارات الدفع (يدعم إرفاق أكثر من صورة إشعار للدفعات المتعددة)" : "Attach Payment Notification Receipts (Multiple Images Supported)" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-neutral-400 block mt-0.5",
										children: isAr ? "يمكنك رفع صورة أو عدة صور إشعار في كل مرة يدفع فيها العميل دفعة من الدين" : "Upload one or more receipt photos each time the customer makes an installment payment"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: debtReceiptFileInputRef,
										type: "file",
										accept: "image/*",
										multiple: true,
										onChange: handleDebtReceiptFilesUpload,
										className: "hidden"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": "debt-upload-receipts-btn",
										onClick: () => debtReceiptFileInputRef.current?.click(),
										className: "px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "+ رفع صورة / عدة صور إشعار" : "+ Upload Receipt Image(s)" })]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										dir: "ltr",
										"data-testid": "debt-receipt-url-input",
										value: debtReceiptUrlInput,
										onChange: (e) => setDebtReceiptUrlInput(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddDebtReceiptUrl();
											}
										},
										placeholder: isAr ? "أو الصق رابط صورة إشعار الدفع واضغط إضافة (https://...)" : "Or paste receipt image URL and click Add (https://...)",
										className: "flex-1 min-h-[38px] px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-200 placeholder:font-sans focus:outline-none focus:border-amber-500"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": "debt-add-receipt-url-btn",
										onClick: handleAddDebtReceiptUrl,
										className: "px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-amber-300 text-xs font-bold flex items-center gap-1 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "إضافة إشعار" : "Add Receipt" })]
									})]
								}),
								debtNewReceiptImages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-semibold text-amber-300 block",
										children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											"إشعارات الدفعة الجديدة المرفقة (",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: debtNewReceiptImages.length
											}),
											"):"
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											"New Staged Receipt Images (",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: debtNewReceiptImages.length
											}),
											"):"
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-3 sm:grid-cols-5 gap-2",
										children: debtNewReceiptImages.map((imgSrc, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative group h-20 rounded-xl overflow-hidden bg-neutral-900 border border-amber-500/50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: imgSrc,
												alt: `Receipt ${idx + 1}`,
												className: "w-full h-full object-cover"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => handleRemoveStagedReceiptImage(idx),
												className: "absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow",
												title: isAr ? "حذف الإشعار" : "Remove receipt",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3 h-3" })
											})]
										}, `${idx}-${imgSrc.slice(0, 24)}`))
									})]
								}),
								getAllTransactionReceiptImages(activeSettlingData.tx).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 pt-2 border-t border-neutral-800/80",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-semibold text-neutral-400 block",
										children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											"صور الإشعارات المحفوظة مسبقاً لهذه الفاتورة (",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: getAllTransactionReceiptImages(activeSettlingData.tx).length
											}),
											"):"
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											"Previously Saved Receipt Images (",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: getAllTransactionReceiptImages(activeSettlingData.tx).length
											}),
											"):"
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-3 sm:grid-cols-5 gap-2",
										children: getAllTransactionReceiptImages(activeSettlingData.tx).map((imgSrc, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative h-16 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: imgSrc,
												alt: `Saved Receipt ${idx + 1}`,
												className: "w-full h-full object-cover"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-neutral-950/80 text-[9px] font-mono text-neutral-200",
												children: ["#", idx + 1]
											})]
										}, `prev-${idx}`))
									})]
								})
							]
						}),
						activeSettlingData.tx.debtPayments && activeSettlingData.tx.debtPayments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-neutral-200 block",
								children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									"سجل دفعات السداد السابقة (",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: activeSettlingData.tx.debtPayments.length
									}),
									")"
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									"Previous Debt Installments (",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: activeSettlingData.tx.debtPayments.length
									}),
									")"
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1.5 max-h-40 overflow-y-auto pr-1",
								children: activeSettlingData.tx.debtPayments.map((inst, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center flex-wrap gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-mono font-bold text-[10px]",
												children: ["#", idx + 1]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-[11px] text-neutral-400",
												children: new Date(inst.timestamp).toLocaleString()
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-2 py-0.5 rounded bg-neutral-800 text-neutral-200 text-[10px] font-semibold",
												children: formatPaymentMethodLabel(inst.paymentMethod, settings.language)
											}),
											inst.transferReference && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-[10px] text-amber-300",
												children: ["#", inst.transferReference]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-emerald-400 font-bold tabular-nums",
											children: ["+", formatCurrency(inst.amountPaid, activeSettlingData.view.originalCurrency, settings.language)]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-neutral-400 text-[11px]",
											children: [
												isAr ? "المتبقي بعدها:" : "Remained:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-rose-300 tabular-nums",
													children: formatCurrency(inst.remainingDebtAfter, activeSettlingData.view.originalCurrency, settings.language)
												})
											]
										})]
									})]
								}, inst.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2 pt-2 border-t border-neutral-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								variant: "ghost",
								type: "button",
								onClick: () => setSettlingTxnId(null),
								children: t.cancel
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								variant: "emerald",
								type: "submit",
								"data-testid": "debt-submit-settlement-btn",
								leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }),
								children: isAr ? "حفظ الدفعة وتحديث الفاتورة" : "Save Payment & Update Invoice"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptModal, {
				isOpen: Boolean(selectedReceiptTxn),
				onClose: () => setSelectedReceiptTxn(null),
				transaction: selectedReceiptTxn,
				valuationMode,
				anchorCurrency,
				onNewSale: () => {
					setSelectedReceiptTxn(null);
					setActiveTab("checkout");
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
				isOpen: Boolean(previewNotificationTxn),
				onClose: () => setPreviewNotificationTxn(null),
				title: `${t.transferReceiptImage} • ${previewNotificationTxn?.id || ""}`,
				description: previewNotificationTxn?.transferReference ? `${t.transferReference}: ${previewNotificationTxn.transferReference}` : void 0,
				maxWidth: "lg",
				children: previewNotificationTxn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 max-h-[75vh] overflow-y-auto pr-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
						children: getAllTransactionReceiptImages(previewNotificationTxn).map((imgUrl, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 flex flex-col",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-3 py-1.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-amber-300",
									children: isAr ? `صورة الإشعار #${idx + 1}` : `Receipt Image #${idx + 1}`
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-2 flex items-center justify-center max-h-64",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: imgUrl,
									alt: `${t.transferReceiptImage} #${idx + 1}`,
									className: "max-w-full max-h-60 object-contain rounded-lg"
								})
							})]
						}, idx))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end pt-2 border-t border-neutral-800",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							variant: "secondary",
							size: "sm",
							onClick: () => setPreviewNotificationTxn(null),
							children: isAr ? "إغلاق" : "Close"
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoodsReceiptModal, {
				isOpen: isGoodsReceiptOpen,
				onClose: () => setIsGoodsReceiptOpen(false)
			})
		]
	});
};
export { SalesView };
