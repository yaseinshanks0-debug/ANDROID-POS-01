import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { B as Printer, Cn as require_react, Dt as Eye, F as RotateCcw, G as PenLine, Gt as CircleAlert, M as Search, Ot as Download, Tt as FileText, Ut as CircleCheck, V as Plus, _ as TrendingUp, bt as Funnel, dn as Ban, ht as Hash, jt as CreditCard, o as Wallet, p as Upload, r as X, rn as Calendar, u as User, un as Banknote, v as TrendingDown, y as Trash2, z as QrCode } from "./vendor-icons-CI9orWhJ.js";
import { Ft as formatCurrency, It as formatPaymentMethodLabel, Nt as computeStoreReportAnalytics, c as computeNetFinancialPosition, d as getExpenseCategoryMeta, l as formatExpenseCategoryLabel, n as usePOS, o as EXPENSE_CATEGORIES, s as computeExpensesSummary, u as getConvertedExpenseView } from "./POSContext-BOgzURdy.js";
import { i as require_jsx_runtime } from "./vendor-motion-D4PRzaI1.js";
import { E as TactileButton } from "./index-QdWo-Hfe.js";
import { t as AppCard } from "./AppCard-Bz1niKzT.js";
import { F as arrayTooltipSearcher, N as Cell, P as Tooltip, i as Bar, n as YAxis, r as XAxis, rt as ResponsiveContainer, t as CartesianChart, u as CartesianGrid } from "./CartesianChart-CoKLjEzo.js";
import { a as triggerUniversalFileDownload } from "./native-file-download-Co0EE1WC.js";
// node_modules/recharts/es6/chart/BarChart.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var allowedTooltipTypes = ["axis", "item"];
/**
* @consumes ResponsiveContainerContext
* @provides CartesianViewBoxContext
* @provides CartesianChartContext
*/
var BarChart = /*#__PURE__*/ (0, import_react.forwardRef)((props, ref) => {
	return /*#__PURE__*/ import_react.createElement(CartesianChart, {
		chartName: "BarChart",
		defaultTooltipEventType: "axis",
		validateTooltipEventTypes: allowedTooltipTypes,
		tooltipPayloadSearcher: arrayTooltipSearcher,
		categoricalChartProps: props,
		ref
	});
});
// src/components/expenses/ExpensesView.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var import_jsx_runtime = require_jsx_runtime();
var QUICK_EXPENSE_PRESETS = [
	{
		titleAr: "إيجار المحل الشهري",
		titleEn: "Monthly Store Rent",
		category: "rent"
	},
	{
		titleAr: "شحن كهرباء ومياه",
		titleEn: "Electricity & Water Top-up",
		category: "utilities"
	},
	{
		titleAr: "اشتراك الإنترنت الشهري",
		titleEn: "Monthly Internet Subscription",
		category: "utilities"
	},
	{
		titleAr: "ترحيل ونقل بضائع",
		titleEn: "Goods Transport & Delivery",
		category: "transport"
	},
	{
		titleAr: "رواتب ويوميات الموظفين",
		titleEn: "Staff Wages & Salaries",
		category: "salaries"
	},
	{
		titleAr: "أكياس تغليف ورول فواتير",
		titleEn: "Packaging Bags & Receipt Rolls",
		category: "supplies"
	},
	{
		titleAr: "صيانة وإصلاحات بالمحل",
		titleEn: "Store Maintenance & Repairs",
		category: "maintenance"
	},
	{
		titleAr: "رسوم محلية وضرائب",
		titleEn: "Local Fees & Taxes",
		category: "taxes_fees"
	},
	{
		titleAr: "منصرفات ضيافة ونثريات",
		titleEn: "Hospitality & Petty Cash",
		category: "other"
	}
];
var ExpensesView = () => {
	const { expenses, addExpense, updateExpense, voidExpense, deleteExpense, transactions, products, stockMovements, settings, currencies, exchangeRates } = usePOS();
	const isAr = settings.language === "ar";
	const [displayCurrency, setDisplayCurrency] = (0, import_react.useState)(settings.currency || "SDG");
	const [valuationMode, setValuationMode] = (0, import_react.useState)("historical");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [selectedCategoryFilter, setSelectedCategoryFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [isFormOpen, setIsFormOpen] = (0, import_react.useState)(true);
	const [editingExpenseId, setEditingExpenseId] = (0, import_react.useState)(null);
	const [titleInput, setTitleInput] = (0, import_react.useState)("");
	const [categoryInput, setCategoryInput] = (0, import_react.useState)("utilities");
	const [amountInput, setAmountInput] = (0, import_react.useState)("");
	const [currencyInput, setCurrencyInput] = (0, import_react.useState)(settings.currency || "SDG");
	const [paymentMethodInput, setPaymentMethodInput] = (0, import_react.useState)("cash");
	const [transferReferenceInput, setTransferReferenceInput] = (0, import_react.useState)("");
	const [beneficiaryInput, setBeneficiaryInput] = (0, import_react.useState)("");
	const [notesInput, setNotesInput] = (0, import_react.useState)("");
	const [receiptImageInput, setReceiptImageInput] = (0, import_react.useState)("");
	const [formError, setFormError] = (0, import_react.useState)(null);
	const [feedbackBanner, setFeedbackBanner] = (0, import_react.useState)(null);
	const [inspectedVoucher, setInspectedVoucher] = (0, import_react.useState)(null);
	const availableCurrencies = (0, import_react.useMemo)(() => {
		const activeCodes = currencies && currencies.length > 0 ? currencies.filter((c) => c.isActive !== false).map((c) => c.code.toUpperCase()) : [
			"SDG",
			"USD",
			"SAR",
			"AED",
			"EUR",
			"GBP"
		];
		return Array.from(/* @__PURE__ */ new Set([
			"SDG",
			settings.currency || "SDG",
			...activeCodes
		]));
	}, [currencies, settings.currency]);
	const expenseSummary = (0, import_react.useMemo)(() => {
		return computeExpensesSummary(expenses, displayCurrency, exchangeRates, valuationMode, "USD");
	}, [
		expenses,
		displayCurrency,
		exchangeRates,
		valuationMode
	]);
	const storeAnalytics = (0, import_react.useMemo)(() => {
		return computeStoreReportAnalytics(transactions, products, stockMovements, displayCurrency, exchangeRates, valuationMode, "USD");
	}, [
		transactions,
		products,
		stockMovements,
		displayCurrency,
		exchangeRates,
		valuationMode
	]);
	const netFinancials = (0, import_react.useMemo)(() => {
		return computeNetFinancialPosition({
			grossSales: storeAnalytics.grossSales,
			collectedSales: storeAnalytics.collectedSales,
			grossProfitBeforeExpenses: storeAnalytics.netGrossProfit,
			totalExpenses: expenseSummary.totalExpenses
		});
	}, [storeAnalytics, expenseSummary.totalExpenses]);
	const filteredExpenses = (0, import_react.useMemo)(() => {
		const q = searchQuery.trim().toLowerCase();
		return expenses.filter((exp) => {
			if (selectedCategoryFilter !== "all" && exp.category !== selectedCategoryFilter) return false;
			if (statusFilter !== "all" && exp.status !== statusFilter) return false;
			if (!q) return true;
			const catMeta = getExpenseCategoryMeta(exp.category);
			return exp.title.toLowerCase().includes(q) || exp.id.toLowerCase().includes(q) || exp.beneficiary && exp.beneficiary.toLowerCase().includes(q) || exp.transferReference && exp.transferReference.toLowerCase().includes(q) || exp.notes && exp.notes.toLowerCase().includes(q) || catMeta.labelAr.toLowerCase().includes(q) || catMeta.labelEn.toLowerCase().includes(q);
		});
	}, [
		expenses,
		selectedCategoryFilter,
		statusFilter,
		searchQuery
	]);
	const categoryChartData = (0, import_react.useMemo)(() => {
		return expenseSummary.byCategory.map((item) => ({
			category: item.category,
			name: isAr ? item.labelAr : item.labelEn,
			shortName: isAr ? item.labelAr.split(" ")[0] : item.labelEn.split(" ")[0],
			emoji: item.emoji,
			amount: item.totalAmount,
			count: item.count,
			sharePercent: item.sharePercent,
			colorHex: item.colorHex
		}));
	}, [expenseSummary.byCategory, isAr]);
	const resetFormFields = () => {
		setEditingExpenseId(null);
		setTitleInput("");
		setCategoryInput("utilities");
		setAmountInput("");
		setCurrencyInput(settings.currency || "SDG");
		setPaymentMethodInput("cash");
		setTransferReferenceInput("");
		setBeneficiaryInput("");
		setNotesInput("");
		setReceiptImageInput("");
		setFormError(null);
	};
	const handleOpenNewExpenseForm = () => {
		resetFormFields();
		setIsFormOpen(true);
		setTimeout(() => {
			const inputEl = document.getElementById("expense-title-input");
			if (inputEl) inputEl.focus();
		}, 50);
	};
	const handleOpenEditExpenseForm = (exp) => {
		setEditingExpenseId(exp.id);
		setTitleInput(exp.title);
		setCategoryInput(exp.category);
		setAmountInput(String(exp.amount));
		setCurrencyInput(exp.currency || settings.currency || "SDG");
		setPaymentMethodInput(exp.paymentMethod || "cash");
		setTransferReferenceInput(exp.transferReference || "");
		setBeneficiaryInput(exp.beneficiary || "");
		setNotesInput(exp.notes || "");
		setReceiptImageInput(exp.receiptImage || "");
		setFormError(null);
		setIsFormOpen(true);
	};
	const handleReceiptImageChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === "string") setReceiptImageInput(reader.result);
		};
		reader.readAsDataURL(file);
	};
	const handleSubmitExpense = (e) => {
		e.preventDefault();
		setFormError(null);
		const parsedAmount = parseFloat(amountInput);
		if (!titleInput.trim()) {
			setFormError(isAr ? "يرجى إدخال بيان أو وصف المنصرف." : "Please enter an expense description.");
			return;
		}
		if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
			setFormError(isAr ? "يرجى إدخال مبلغ صحيح أكبر من الصفر للمنصرف." : "Please enter a valid amount greater than zero.");
			return;
		}
		if (editingExpenseId) {
			updateExpense(editingExpenseId, {
				title: titleInput.trim(),
				category: categoryInput,
				amount: parsedAmount,
				currency: currencyInput,
				paymentMethod: paymentMethodInput,
				transferReference: transferReferenceInput.trim() || void 0,
				beneficiary: beneficiaryInput.trim() || void 0,
				notes: notesInput.trim() || void 0,
				receiptImage: receiptImageInput || void 0
			});
			setFeedbackBanner(isAr ? "تم تحديث بيانات سند المنصرف بنجاح." : "Expense voucher updated successfully.");
		} else {
			const result = addExpense({
				title: titleInput.trim(),
				category: categoryInput,
				amount: parsedAmount,
				currency: currencyInput,
				paymentMethod: paymentMethodInput,
				transferReference: transferReferenceInput.trim() || void 0,
				beneficiary: beneficiaryInput.trim() || void 0,
				notes: notesInput.trim() || void 0,
				receiptImage: receiptImageInput || void 0
			});
			if (!result.ok) {
				setFormError(result.error || (isAr ? "بيانات المنصرف غير مكتملة." : "Invalid expense data."));
				return;
			}
			setFeedbackBanner(isAr ? `تم تسجيل المنصرف (${result.expense?.title}) بقيمة ${formatCurrency(parsedAmount, currencyInput, settings.language)} بنجاح.` : `Recorded expense (${result.expense?.title}) successfully.`);
		}
		resetFormFields();
		setIsFormOpen(false);
		setTimeout(() => setFeedbackBanner(null), 4e3);
	};
	const handleExportExpensesCsv = () => {
		const headers = [
			"Expense ID",
			"Date",
			"Title",
			"Category",
			"Beneficiary",
			"Payment Method",
			"Reference #",
			"Original Amount",
			"Original Currency",
			`Converted Amount (${displayCurrency})`,
			"Recorded By",
			"Status",
			"Notes"
		];
		const rows = filteredExpenses.map((exp) => {
			const view = getConvertedExpenseView(exp, displayCurrency, exchangeRates, valuationMode, "USD");
			return [
				exp.id,
				new Date(exp.timestamp).toISOString(),
				`"${(exp.title || "").replace(/"/g, "\"\"")}"`,
				`"${formatExpenseCategoryLabel(exp.category, settings.language)}"`,
				`"${(exp.beneficiary || "").replace(/"/g, "\"\"")}"`,
				exp.paymentMethod,
				`"${(exp.transferReference || "").replace(/"/g, "\"\"")}"`,
				exp.amount.toFixed(2),
				exp.currency,
				view.convertedAmount.toFixed(2),
				`"${(exp.recordedBy || "").replace(/"/g, "\"\"")}"`,
				exp.status,
				`"${(exp.notes || "").replace(/"/g, "\"\"")}"`
			];
		});
		const csvContent = "﻿" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
		triggerUniversalFileDownload(csvContent, `dqnamo_pos_expenses_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, "text/csv;charset=utf-8");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "expenses-view",
		className: "flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-5 rounded-3xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-6 h-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-xl sm:text-2xl font-extrabold text-white tracking-tight",
							children: isAr ? "إدارة المنصرفات والمصروفات التشغيلية" : "Operating Expenses & Vouchers"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30",
							children: [
								expenseSummary.activeCount,
								" ",
								isAr ? "سند صرف" : "Vouchers"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-neutral-400 mt-1",
						children: isAr ? "تسجيل ومتابعة كافة بنود المنصرفات اليومية والشهرية وخصمها تلقائياً لحساب صافي الربح التشغيلي والسيولة النقدية" : "Track daily and monthly store operating expenses and automatically calculate net operating profit and cash balance"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold text-neutral-400",
								children: isAr ? "عملة العرض:" : "Currency:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								"aria-label": isAr ? "عملة عرض المنصرفات" : "Expenses display currency",
								value: displayCurrency,
								onChange: (e) => setDisplayCurrency(e.target.value),
								className: "bg-transparent text-xs font-bold text-amber-400 focus:outline-none cursor-pointer",
								children: availableCurrencies.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: code,
									className: "bg-neutral-900 text-white",
									children: code
								}, code))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							variant: "secondary",
							size: "md",
							onClick: handleExportExpensesCsv,
							leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }),
							children: isAr ? "تصدير المنصرفات CSV" : "Export CSV"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							"data-testid": "open-add-expense-btn",
							variant: "amber",
							size: "md",
							onClick: handleOpenNewExpenseForm,
							leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }),
							children: isAr ? "إضافة منصرف جديد" : "Add New Expense"
						})
					]
				})]
			}),
			feedbackBanner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "status",
				className: "flex items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: feedbackBanner })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setFeedbackBanner(null),
					"aria-label": isAr ? "إغلاق التنبيه" : "Dismiss notification",
					className: "text-emerald-400 hover:text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "border-rose-500/30 bg-gradient-to-br from-neutral-900 via-neutral-900 to-rose-950/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-neutral-400",
									children: isAr ? "إجمالي المنصرفات المعتمدة" : "Total Active Expenses"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								"data-testid": "kpi-total-expenses",
								className: "text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono tabular-nums",
								children: formatCurrency(expenseSummary.totalExpenses, displayCurrency, settings.language)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mt-2 text-[11px] text-neutral-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									expenseSummary.activeCount,
									" ",
									isAr ? "عملية صرف معتمدة" : "active records"
								] }), expenseSummary.voidedCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-neutral-500",
									children: [
										"(",
										expenseSummary.voidedCount,
										" ",
										isAr ? "ملغاة" : "voided",
										")"
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-neutral-400",
								children: isAr ? "منصرفات اليوم" : "Today's Expenses"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"data-testid": "kpi-today-expenses",
							className: "text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums",
							children: formatCurrency(expenseSummary.todayExpenses, displayCurrency, settings.language)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 text-[11px] text-neutral-400",
							children: [
								expenseSummary.todayCount,
								" ",
								isAr ? "سندات صرف مسجلة اليوم" : "expenses recorded today"
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-neutral-400",
								children: isAr ? "منصرفات هذا الشهر" : "This Month's Expenses"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums",
							children: formatCurrency(expenseSummary.thisMonthExpenses, displayCurrency, settings.language)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 text-[11px] text-neutral-400",
							children: [
								isAr ? "متوسط السند:" : "Avg voucher:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-neutral-300",
									children: formatCurrency(expenseSummary.averageExpenseAmount, displayCurrency, settings.language)
								})
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: netFinancials.netOperatingProfit >= 0 ? "border-emerald-500/30 bg-emerald-950/10" : "border-rose-500/40 bg-rose-950/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-neutral-400",
									children: isAr ? "صافي الربح بعد المنصرفات" : "Net Profit After Expenses"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `w-8 h-8 rounded-xl flex items-center justify-center ${netFinancials.netOperatingProfit >= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								"data-testid": "kpi-net-profit-after-expenses",
								className: `text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${netFinancials.netOperatingProfit >= 0 ? "text-emerald-400" : "text-rose-400"}`,
								children: formatCurrency(netFinancials.netOperatingProfit, displayCurrency, settings.language)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center justify-between text-[11px] text-neutral-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									isAr ? "مجمل الربح:" : "Gross Profit:",
									" ",
									formatCurrency(netFinancials.grossProfitBeforeExpenses, displayCurrency, settings.language)
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-amber-400",
									children: [
										netFinancials.expenseToSalesRatioPercent,
										"% ",
										isAr ? "من المبيعات" : "of sales"
									]
								})]
							})
						]
					})
				]
			}),
			isFormOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
				"data-testid": "expense-form-card",
				className: "border-amber-500/40 bg-neutral-900/95 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-neutral-800 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center",
								children: editingExpenseId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base font-extrabold text-white",
								children: editingExpenseId ? isAr ? "تعديل سند المنصرف" : "Edit Expense Voucher" : isAr ? "تسجيل سند منصرف جديد" : "Record New Expense Voucher"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-neutral-400",
								children: isAr ? "اختر بند المنصرف سريعاً أو أدخل التفاصيل والمبلغ وطريقة الدفع" : "Choose a quick preset or fill in the expense details, amount, and payment method"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								resetFormFields();
								setIsFormOpen(false);
							},
							"aria-label": isAr ? "إغلاق نموذج المنصرف" : "Close expense form",
							className: "p-2 rounded-xl bg-neutral-800/80 text-neutral-400 hover:text-white",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-bold text-neutral-400 block mb-2",
						children: isAr ? "اختيار سريع لبند المنصرف الشائع:" : "Quick Expense Presets:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: QUICK_EXPENSE_PRESETS.map((preset, idx) => {
							const meta = getExpenseCategoryMeta(preset.category);
							const label = isAr ? preset.titleAr : preset.titleEn;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setTitleInput(label);
									setCategoryInput(preset.category);
								},
								className: "px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-950 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-amber-500/40 transition-all flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: meta.emoji }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
							}, idx);
						})
					})] }),
					formError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						role: "alert",
						"data-testid": "expense-form-error",
						className: "flex items-center gap-2 p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 text-rose-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formError })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmitExpense,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 md:grid-cols-3 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "md:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "expense-title-input",
										className: "block text-xs font-bold text-neutral-300 mb-1.5",
										children: isAr ? "بيان / وصف المنصرف *" : "Expense Title / Description *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "expense-title-input",
										"data-testid": "expense-title-input",
										type: "text",
										value: titleInput,
										onChange: (e) => setTitleInput(e.target.value),
										placeholder: isAr ? "مثال: فاتورة كهرباء المحل، إيجار الشهر، ترحيل بضاعة..." : "e.g., Store electricity bill, monthly rent, freight...",
										className: "w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "expense-category-select",
									className: "block text-xs font-bold text-neutral-300 mb-1.5",
									children: isAr ? "بند / تصنيف المنصرف *" : "Expense Category *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									id: "expense-category-select",
									"data-testid": "expense-category-select",
									value: categoryInput,
									onChange: (e) => setCategoryInput(e.target.value),
									className: "w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-500",
									children: EXPENSE_CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: cat.id,
										className: "bg-neutral-900 text-white",
										children: [
											cat.emoji,
											" ",
											isAr ? cat.labelAr : cat.labelEn
										]
									}, cat.id))
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "expense-amount-input",
										className: "block text-xs font-bold text-neutral-300 mb-1.5",
										children: isAr ? "المبلغ *" : "Amount *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "expense-amount-input",
										"data-testid": "expense-amount-input",
										type: "number",
										step: "any",
										min: "0",
										value: amountInput,
										onChange: (e) => setAmountInput(e.target.value),
										placeholder: "0.00",
										className: "w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-mono font-bold text-amber-400 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "expense-currency-select",
										className: "block text-xs font-bold text-neutral-300 mb-1.5",
										children: isAr ? "العملة" : "Currency"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										id: "expense-currency-select",
										"data-testid": "expense-currency-select",
										value: currencyInput,
										onChange: (e) => setCurrencyInput(e.target.value),
										className: "w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-bold text-white focus:outline-none focus:border-amber-500",
										children: availableCurrencies.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: code,
											className: "bg-neutral-900 text-white",
											children: code
										}, code))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs font-bold text-neutral-300 mb-1.5",
										children: isAr ? "طريقة الصرف" : "Payment Method"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-3 gap-1.5",
										children: [
											{
												id: "cash",
												labelAr: "كاش",
												labelEn: "Cash",
												icon: Banknote
											},
											{
												id: "bank_transfer",
												labelAr: "تحويل بنكي",
												labelEn: "Transfer",
												icon: CreditCard
											},
											{
												id: "qr_nfc",
												labelAr: "محفظة",
												labelEn: "Wallet",
												icon: QrCode
											}
										].map((pm) => {
											const Icon = pm.icon;
											const active = paymentMethodInput === pm.id;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setPaymentMethodInput(pm.id),
												className: `flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl text-xs font-bold border transition-all ${active ? "bg-amber-500/20 border-amber-500 text-amber-300" : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate",
													children: isAr ? pm.labelAr : pm.labelEn
												})]
											}, pm.id);
										})
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "expense-beneficiary-input",
										className: "block text-xs font-bold text-neutral-300 mb-1.5",
										children: isAr ? "المستفيد / الجهة المستلمة (اختياري)" : "Beneficiary / Payee (Optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-4 h-4 text-neutral-500 absolute top-3 start-3 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "expense-beneficiary-input",
											type: "text",
											value: beneficiaryInput,
											onChange: (e) => setBeneficiaryInput(e.target.value),
											placeholder: isAr ? "اسم المستلم أو الجهة..." : "Payee or vendor name...",
											className: "w-full ps-9 pe-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "expense-reference-input",
										className: "block text-xs font-bold text-neutral-300 mb-1.5",
										children: isAr ? "رقم العملية / الإيصال (اختياري)" : "Transfer / Receipt Reference # (Optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "w-4 h-4 text-neutral-500 absolute top-3 start-3 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "expense-reference-input",
											type: "text",
											value: transferReferenceInput,
											onChange: (e) => setTransferReferenceInput(e.target.value),
											placeholder: isAr ? "رقم إشعار بنكك أو الإيصال..." : "Bank ref or voucher #...",
											className: "w-full ps-9 pe-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs font-bold text-neutral-300 mb-1.5",
										children: isAr ? "صورة الإشعار أو الفاتورة (اختياري)" : "Receipt Image (Optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 cursor-pointer transition-all",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-4 h-4 text-amber-400" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate",
													children: receiptImageInput ? isAr ? "تغيير الصورة المرفقة" : "Change Attached Image" : isAr ? "إرفاق صورة الإشعار" : "Attach Receipt Image"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "file",
													accept: "image/*",
													onChange: handleReceiptImageChange,
													className: "hidden"
												})
											]
										}), receiptImageInput && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setReceiptImageInput(""),
											"aria-label": isAr ? "إزالة الصورة" : "Remove image",
											className: "p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:text-white",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
										})]
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "expense-notes-input",
								className: "block text-xs font-bold text-neutral-300 mb-1.5",
								children: isAr ? "ملاحظات إضافية" : "Additional Notes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "expense-notes-input",
								type: "text",
								value: notesInput,
								onChange: (e) => setNotesInput(e.target.value),
								placeholder: isAr ? "أي تفاصيل إضافية حول سبب الصرف..." : "Any extra details about this expense...",
								className: "w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
									type: "button",
									variant: "secondary",
									size: "md",
									onClick: () => {
										resetFormFields();
										setIsFormOpen(false);
									},
									children: isAr ? "إلغاء" : "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
									"data-testid": "submit-expense-btn",
									type: "submit",
									variant: "amber",
									size: "md",
									leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }),
									children: editingExpenseId ? isAr ? "حفظ تعديلات السند" : "Save Changes" : isAr ? "حفظ واعتماد سند الصرف" : "Save Expense Voucher"
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
					className: "lg:col-span-2 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-neutral-800 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm sm:text-base font-extrabold text-white",
							children: isAr ? "تحليل المنصرفات حسب البنود (Recharts)" : "Expenses Breakdown by Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-neutral-400",
							children: isAr ? "مقارنة حجم الصرف الفعلي لكل بند تشغيلي بعملة العرض المختارة" : "Visual comparison of spending across each operating category"
						})] }), expenseSummary.topCategory && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-3 py-1 rounded-xl bg-rose-950/50 border border-rose-500/30 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-neutral-400",
								children: isAr ? "أعلى بند صرف: " : "Top Category: "
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-rose-300",
								children: [
									expenseSummary.topCategory.emoji,
									" ",
									isAr ? expenseSummary.topCategory.labelAr : expenseSummary.topCategory.labelEn,
									" ",
									"(",
									expenseSummary.topCategory.sharePercent,
									"%)"
								]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full h-[230px]",
						dir: "ltr",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: categoryChartData,
								margin: {
									top: 10,
									right: 16,
									left: 4,
									bottom: 8
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 4",
										stroke: "#1f2937",
										strokeOpacity: .7,
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "shortName",
										stroke: "#9ca3af",
										tick: {
											fill: "#9ca3af",
											fontSize: 11,
											fontWeight: 600
										},
										tickLine: false,
										axisLine: { stroke: "#1f2937" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "#6b7280",
										tick: {
											fill: "#6b7280",
											fontSize: 10
										},
										tickLine: false,
										axisLine: false,
										width: 56
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: {
											fill: "#ffffff",
											opacity: .04
										},
										content: ({ active, payload }) => {
											if (!active || !payload || payload.length === 0) return null;
											const row = payload[0]?.payload;
											if (!row) return null;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-neutral-950/95 border border-neutral-700 rounded-2xl p-3 shadow-2xl text-xs space-y-1",
												dir: isAr ? "rtl" : "ltr",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "font-extrabold text-white flex items-center gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.emoji }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.name })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-rose-400 font-mono font-bold",
														children: formatCurrency(row.amount, displayCurrency, settings.language)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-neutral-400 text-[11px]",
														children: [
															row.count,
															" ",
															isAr ? "سندات" : "vouchers",
															" • ",
															row.sharePercent,
															"%"
														]
													})
												]
											});
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "amount",
										radius: [
											8,
											8,
											0,
											0
										],
										maxBarSize: 42,
										children: categoryChartData.map((entry, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.colorHex }, `cell-${idx}`))
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
					className: "space-y-4 flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-extrabold text-white border-b border-neutral-800 pb-2.5",
							children: isAr ? "توزيع نسب البنود وطرق الصرف" : "Category Shares & Payment Methods"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2.5 max-h-[165px] overflow-y-auto pe-1",
							children: [expenseSummary.byCategory.filter((c) => c.totalAmount > 0).map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-neutral-200 flex items-center gap-1.5 truncate",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cat.emoji }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: isAr ? cat.labelAr : cat.labelEn
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold text-rose-400 shrink-0",
										children: [
											formatCurrency(cat.totalAmount, displayCurrency, settings.language),
											" (",
											cat.sharePercent,
											"%)"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full transition-all",
										style: {
											width: `${Math.min(100, Math.max(4, cat.sharePercent))}%`,
											backgroundColor: cat.colorHex
										}
									})
								})]
							}, cat.category)), expenseSummary.totalExpenses === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-neutral-500 py-6 text-center",
								children: isAr ? "لا توجد منصرفات مسجلة بعد لعرض التوزيع النسبي." : "No expenses recorded yet."
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-neutral-400",
									children: isAr ? "المبيعات المحصلة نقداً/بنكياً:" : "Collected Sales:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-bold text-emerald-400",
									children: formatCurrency(netFinancials.collectedSales, displayCurrency, settings.language)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-neutral-400",
									children: isAr ? "إجمالي المنصرفات المخصومة:" : "Less Operating Expenses:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono font-bold text-rose-400",
									children: ["-", formatCurrency(expenseSummary.totalExpenses, displayCurrency, settings.language)]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-1.5 border-t border-neutral-800 flex items-center justify-between text-xs font-extrabold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-white",
									children: isAr ? "صافي السيولة بعد المنصرفات:" : "Net Cash After Expenses:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `font-mono ${netFinancials.netCashAfterExpenses >= 0 ? "text-amber-400" : "text-rose-400"}`,
									children: formatCurrency(netFinancials.netCashAfterExpenses, displayCurrency, settings.language)
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col md:flex-row md:items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-neutral-500 absolute top-3 start-3.5 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"data-testid": "expenses-search-input",
								type: "text",
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								placeholder: isAr ? "ابحث في المنصرفات بالبيان، رقم السند، المستفيد، أو رقم العملية..." : "Search expenses by title, voucher ID, beneficiary, or reference...",
								className: "w-full ps-10 pe-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-1 gap-1",
								children: [
									{
										id: "all",
										labelAr: "الكل",
										labelEn: "All"
									},
									{
										id: "recorded",
										labelAr: "معتمد",
										labelEn: "Active"
									},
									{
										id: "voided",
										labelAr: "ملغي",
										labelEn: "Voided"
									}
								].map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setStatusFilter(st.id),
									className: `px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${statusFilter === st.id ? "bg-amber-500 text-neutral-950" : "text-neutral-400 hover:text-white"}`,
									children: isAr ? st.labelAr : st.labelEn
								}, st.id))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								"aria-label": isAr ? "طريقة تقييم سعر الصرف" : "Exchange rate valuation mode",
								value: valuationMode,
								onChange: (e) => setValuationMode(e.target.value),
								className: "px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-semibold text-neutral-300 focus:outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "historical",
										children: isAr ? "سعر الصرف وقت السند" : "Historical Voucher Rate"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "live",
										children: isAr ? "سعر الصرف الحالي المباشر" : "Current Live Rate"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "indexed",
										children: isAr ? "مربوط بسعر الدولار الحالي" : "USD-Indexed Rate"
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 overflow-x-auto pb-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "w-3.5 h-3.5 text-neutral-500 shrink-0 me-1" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSelectedCategoryFilter("all"),
								className: `px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition-all ${selectedCategoryFilter === "all" ? "bg-rose-500/20 border-rose-500 text-rose-300" : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"}`,
								children: [
									isAr ? "جميع البنود" : "All Categories",
									" (",
									expenses.length,
									")"
								]
							}),
							EXPENSE_CATEGORIES.map((cat) => {
								const active = selectedCategoryFilter === cat.id;
								const count = expenses.filter((e) => e.category === cat.id).length;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setSelectedCategoryFilter(cat.id),
									className: `px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition-all flex items-center gap-1.5 ${active ? "bg-amber-500/20 border-amber-500 text-amber-300" : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cat.emoji }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? cat.labelAr : cat.labelEn }),
										count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-1.5 py-0.2 rounded-md bg-neutral-800 text-[10px] text-neutral-300",
											children: count
										})
									]
								}, cat.id);
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2.5 pt-2",
						children: filteredExpenses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-12 text-center bg-neutral-950/60 border border-neutral-800/80 rounded-2xl space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 flex items-center justify-center mx-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-6 h-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-bold text-neutral-300",
									children: isAr ? "لا توجد سندات منصرفات مطابقة للبحث الحالي" : "No expense vouchers match the current filter"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-neutral-500",
									children: isAr ? "اضغط على زر \"إضافة منصرف جديد\" لتسجيل أول سند صرف في النظام" : "Click \"Add New Expense\" above to record an operating expense"
								})]
							})]
						}) : filteredExpenses.map((exp) => {
							const catMeta = getExpenseCategoryMeta(exp.category);
							const view = getConvertedExpenseView(exp, displayCurrency, exchangeRates, valuationMode, "USD");
							const isVoided = exp.status === "voided";
							const isDifferentCurrency = exp.currency.toUpperCase() !== displayCurrency.toUpperCase();
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-testid": `expense-row-${exp.id}`,
								className: `p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isVoided ? "bg-neutral-950/40 border-neutral-800/50 opacity-60" : "bg-neutral-950/90 border-neutral-800 hover:border-neutral-700"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-11 h-11 rounded-2xl flex items-center justify-center text-lg shrink-0 border",
										style: {
											backgroundColor: `${catMeta.colorHex}18`,
											borderColor: `${catMeta.colorHex}45`
										},
										children: catMeta.emoji
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `text-sm font-extrabold truncate ${isVoided ? "line-through text-neutral-400" : "text-white"}`,
														children: exp.title
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "px-2 py-0.5 rounded-lg text-[10px] font-bold border",
														style: {
															backgroundColor: `${catMeta.colorHex}15`,
															borderColor: `${catMeta.colorHex}40`,
															color: catMeta.colorHex
														},
														children: isAr ? catMeta.labelAr : catMeta.labelEn
													}),
													isVoided && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-700/50",
														children: isAr ? "ملغي" : "VOIDED"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-400",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-neutral-500",
														children: exp.id
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(exp.timestamp).toLocaleString(isAr ? "ar-SA" : "en-US", {
														month: "short",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit"
													}) }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-neutral-300 font-semibold",
														children: formatPaymentMethodLabel(exp.paymentMethod, settings.language)
													}),
													exp.transferReference && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono text-amber-400",
														children: ["#", exp.transferReference]
													})] }),
													exp.beneficiary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-emerald-300",
														children: [
															isAr ? "المستفيد:" : "To:",
															" ",
															exp.beneficiary
														]
													})] })
												]
											}),
											exp.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-neutral-500 truncate max-w-xl",
												children: exp.notes
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 border-neutral-800/80 pt-2.5 sm:pt-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-end",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `text-base sm:text-lg font-extrabold font-mono tabular-nums ${isVoided ? "line-through text-neutral-500" : "text-rose-400"}`,
											children: ["-", formatCurrency(view.convertedAmount, displayCurrency, settings.language)]
										}), isDifferentCurrency && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] font-mono text-neutral-400",
											children: [
												isAr ? "أصل السند:" : "Orig:",
												" ",
												formatCurrency(exp.amount, exp.currency, settings.language)
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setInspectedVoucher(exp),
												"aria-label": isAr ? `عرض سند الصرف ${exp.title}` : `View voucher ${exp.title}`,
												className: "p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-all",
												title: isAr ? "عرض وطباعة السند" : "View & Print Voucher",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => handleOpenEditExpenseForm(exp),
												"aria-label": isAr ? `تعديل المنصرف ${exp.title}` : `Edit ${exp.title}`,
												className: "p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-amber-400 hover:text-amber-300 transition-all",
												title: isAr ? "تعديل" : "Edit",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-3.5 h-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => voidExpense(exp.id),
												"aria-label": isVoided ? isAr ? `استعادة المنصرف ${exp.title}` : `Restore ${exp.title}` : isAr ? `إلغاء المنصرف ${exp.title}` : `Void ${exp.title}`,
												className: "p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-amber-300 transition-all",
												title: isVoided ? isAr ? "استعادة السند" : "Restore Voucher" : isAr ? "إلغاء السند" : "Void Voucher",
												children: isVoided ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "w-3.5 h-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => deleteExpense(exp.id),
												"aria-label": isAr ? `حذف المنصرف ${exp.title}` : `Delete ${exp.title}`,
												className: "p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-400 hover:text-rose-200 transition-all",
												title: isAr ? "حذف نهائي" : "Delete",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
											})
										]
									})]
								})]
							}, exp.id);
						})
					})
				]
			}),
			inspectedVoucher && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "dialog",
				"aria-modal": "true",
				"aria-label": isAr ? "تفاصيل سند الصرف" : "Expense Voucher Details",
				className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-neutral-900 border border-neutral-700 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-neutral-800 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono uppercase tracking-widest text-rose-400 block",
								children: isAr ? "سند صرف مالي" : "EXPENSE VOUCHER"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-extrabold text-white",
								children: inspectedVoucher.id
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setInspectedVoucher(null),
								"aria-label": isAr ? "إغلاق السند" : "Close voucher",
								className: "p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-neutral-400",
										children: isAr ? "البيان:" : "Description:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-white",
										children: inspectedVoucher.title
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-neutral-400",
										children: isAr ? "البند / التصنيف:" : "Category:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-amber-400",
										children: formatExpenseCategoryLabel(inspectedVoucher.category, settings.language)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-neutral-400",
										children: isAr ? "المبلغ:" : "Amount:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base font-extrabold font-mono text-rose-400",
										children: formatCurrency(inspectedVoucher.amount, inspectedVoucher.currency, settings.language)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-neutral-400",
										children: isAr ? "طريقة الدفع:" : "Payment Method:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-neutral-200",
										children: formatPaymentMethodLabel(inspectedVoucher.paymentMethod, settings.language)
									})]
								}),
								inspectedVoucher.transferReference && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-neutral-400",
										children: isAr ? "رقم العملية:" : "Reference #:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-amber-300",
										children: inspectedVoucher.transferReference
									})]
								}),
								inspectedVoucher.beneficiary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-neutral-400",
										children: isAr ? "المستفيد:" : "Beneficiary:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-emerald-300",
										children: inspectedVoucher.beneficiary
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-neutral-400",
										children: isAr ? "التاريخ والوقت:" : "Timestamp:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-neutral-300",
										children: new Date(inspectedVoucher.timestamp).toLocaleString(isAr ? "ar-SA" : "en-US")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-neutral-400",
										children: isAr ? "بواسطة:" : "Recorded By:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-neutral-300",
										children: inspectedVoucher.recordedBy
									})]
								}),
								inspectedVoucher.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 border-t border-neutral-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-neutral-400 block mb-1",
										children: isAr ? "ملاحظات:" : "Notes:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-neutral-200",
										children: inspectedVoucher.notes
									})]
								}),
								inspectedVoucher.receiptImage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 border-t border-neutral-800 space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-neutral-400 block",
										children: isAr ? "صورة الإشعار / الفاتورة المرفقة:" : "Attached Receipt Image:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: inspectedVoucher.receiptImage,
										alt: inspectedVoucher.title,
										className: "w-full max-h-48 object-contain rounded-xl border border-neutral-800 bg-neutral-900"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								variant: "secondary",
								size: "md",
								onClick: () => window.print(),
								leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-4 h-4" }),
								children: isAr ? "طباعة السند" : "Print Voucher"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								variant: "amber",
								size: "md",
								onClick: () => setInspectedVoucher(null),
								children: isAr ? "إغلاق" : "Close"
							})]
						})
					]
				})
			})
		]
	});
};
export { ExpensesView };
