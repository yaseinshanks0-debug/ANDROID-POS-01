import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { A as RotateCcw, B as Package, Bt as ChartColumn, C as ShoppingBag, D as Search, Et as Clock, F as Plus, Ft as ChevronRight, Gt as Building2, It as ChevronLeft, N as QrCode, Qt as ArrowUpRight, Rt as Check, S as SlidersHorizontal, St as CreditCard, Tt as Coins, V as PackageX, Vt as ChartCandlestick, Wt as Calendar, Yt as Banknote, Zt as Award, b as Sparkles, bt as DollarSign, dt as Funnel, en as ArrowRightLeft, f as Truck, h as TrendingDown, i as Wallet, it as Info, j as RefreshCw, jt as CircleCheck, kt as CircleX, m as TrendingUp, nn as ArrowDownRight, on as Activity, ot as History, qt as BookOpen, s as Users, sn as require_react, tt as Layers, u as UserCheck, vt as Eye, w as ShieldCheck, xt as Database, yt as Download, zt as ChartLine } from "./vendor-icons-DoijI_tq.js";
import { $ as computeStoreReportAnalytics, Ct as sanitizeIntelligenceForRole, Q as computeExchangeRateFluctuationSummary, St as sanitizeInsightsForRole, Tt as sanitizeSalesForRole, Y as DEFAULT_BASELINE_EXCHANGE_RATES, _t as resolveAnalyticsUserContext, bt as sanitizeFinancialsForRole, ct as getProductPricesInCurrency, dt as buildUnavailableProductsKnowledgeBase, et as convertCurrencyAmount, gt as enforceScopedFilters, ht as searchUnavailableProductsKnowledgeBase, lt as roundCurrencyValue, mt as redactUnmetDemandRecordForRole, n as usePOS, nt as formatPaymentMethodLabel, ot as getConvertedTransactionView, pt as normalizeUnavailableSearchText, st as getProductPackaging, tt as formatCurrency, ut as SUPPORTED_UNAVAILABILITY_REASONS, vt as sanitizeBranchesForRole, wt as sanitizeInventoryForRole, xt as sanitizeForecastsForRole, yt as sanitizeCustomersForRole } from "./POSContext-nila8oYV.js";
import { i as require_jsx_runtime } from "./vendor-motion-CekIsQM-.js";
import { _ as TactileButton, n as AppModal, v as getTranslation } from "./index-DYJDckRU.js";
import { n as buildAnalyticsSnapshotFromState, t as DEFAULT_ANALYTICS_BRANCHES } from "./analytics.snapshot-Dj6UqAbE.js";
import { t as AppCard } from "./AppCard-B2erL08q.js";
// src/analytics/analytics.types.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var SUPPORTED_SMART_INSIGHT_CATEGORIES = [
	"INVENTORY_RISK",
	"UNMET_DEMAND",
	"RISING_DEMAND",
	"STOCKOUT_RISK",
	"REPLENISHMENT",
	"FINANCIAL_RISK",
	"SALES_ANOMALY",
	"BRANCH_IMBALANCE",
	"SEASONAL_PATTERN",
	"TRANSFER_OPPORTUNITY"
];
// src/analytics/calculations/sales.metrics.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
function toDateKey(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
/**
* Resolves the active date window and its corresponding prior-period comparison window.
*/
function resolveAnalyticsDateWindow(filters, referenceDate = /* @__PURE__ */ new Date()) {
	const preset = filters.datePreset || "30d";
	const end = filters.endDate ? new Date(filters.endDate) : new Date(referenceDate);
	if (isNaN(end.getTime())) end.setTime(referenceDate.getTime());
	end.setHours(23, 59, 59, 999);
	const start = new Date(end);
	start.setHours(0, 0, 0, 0);
	if (preset === "custom" && filters.startDate) {
		const customStart = new Date(filters.startDate);
		if (!isNaN(customStart.getTime())) {
			start.setTime(customStart.getTime());
			start.setHours(0, 0, 0, 0);
		} else start.setDate(end.getDate() - 29);
	} else if (preset === "today") {} else if (preset === "yesterday") {
		start.setDate(end.getDate() - 1);
		end.setDate(end.getDate() - 1);
		end.setHours(23, 59, 59, 999);
	} else if (preset === "7d") start.setDate(end.getDate() - 6);
	else if (preset === "30d") start.setDate(end.getDate() - 29);
	else if (preset === "90d") start.setDate(end.getDate() - 89);
	else if (preset === "mtd") start.setDate(1);
	else if (preset === "ytd") start.setMonth(0, 1);
	else start.setDate(end.getDate() - 29);
	if (start.getTime() > end.getTime()) {
		const tmp = start.getTime();
		start.setTime(end.getTime());
		start.setHours(0, 0, 0, 0);
		end.setTime(tmp);
		end.setHours(23, 59, 59, 999);
	}
	const durationMs = Math.max(864e5, end.getTime() - start.getTime() + 1);
	const calendarDays = Math.max(1, Math.round(durationMs / 864e5));
	const prevEnd = /* @__PURE__ */ new Date(start.getTime() - 1);
	const prevStart = new Date(prevEnd.getTime() - durationMs + 1);
	prevStart.setHours(0, 0, 0, 0);
	return {
		startDate: start,
		endDate: end,
		prevStartDate: prevStart,
		prevEndDate: prevEnd,
		calendarDays
	};
}
/**
* Resolves the branch ID for a transaction based on its cashier/terminal name or branch metadata.
*/
function resolveTransactionBranch(tx, branches) {
	const explicitBranchId = tx.branchId;
	if (explicitBranchId) {
		const found = branches.find((b) => b.id === explicitBranchId);
		if (found) return {
			id: found.id,
			name: found.name,
			nameAr: found.nameAr
		};
	}
	const cashier = (tx.cashierName || "POS Terminal 01").trim();
	for (const b of branches) if (b.id === cashier || b.terminalNames.some((t) => t.toLowerCase() === cashier.toLowerCase())) return {
		id: b.id,
		name: b.name,
		nameAr: b.nameAr
	};
	const fallback = branches[0] || {
		id: "branch-main",
		name: "Main Store Branch - Khartoum",
		nameAr: "الفرع الرئيسي - الخرطوم"
	};
	return {
		id: fallback.id,
		name: fallback.name,
		nameAr: fallback.nameAr
	};
}
/**
* Resolves the COGS for a single line item at `txTimestamp` without ever inventing arbitrary cost ratios.
* Priority:
* 1. `exact_frozen_at_sale`: Item-level frozen cost (`unitCostAtSale` / `unitCost`) if present on the sale item.
* 2. `reconstructed_from_price_history`: Reconstructs historical cost at `txTimestamp` from `product.priceHistory[]`.
* 3. `estimated_from_current_catalog_cost`: Uses current `product.costPrice` / `packCostPrice` and explicitly marks as estimated.
* 4. `incomplete_missing_cost`: If product or cost is missing, returns 0 and flags as incomplete (never invents 45%).
*/
function resolveHistoricalLineItemCost(item, product, txTimestamp, targetCurrency, rates) {
	const rawItem = item;
	const isPackSale = item.saleUnit === "pack";
	const frozenUnitCost = typeof rawItem.unitCostAtSale === "number" && rawItem.unitCostAtSale > 0 ? rawItem.unitCostAtSale : typeof rawItem.unitCost === "number" && rawItem.unitCost > 0 ? rawItem.unitCost : null;
	if (frozenUnitCost !== null) {
		const itemCurrency = (rawItem.costCurrency || product?.priceCurrency || "SDG").toString().toUpperCase();
		const convertedUnit = convertCurrencyAmount(frozenUnitCost, itemCurrency, targetCurrency, rates);
		return {
			lineCost: roundCurrencyValue(convertedUnit * item.quantity),
			unitCostResolved: convertedUnit,
			quality: "exact_frozen_at_sale"
		};
	}
	if (!product || !(product.costPrice > 0 || product.packCostPrice && product.packCostPrice > 0)) return {
		lineCost: 0,
		unitCostResolved: 0,
		quality: "incomplete_missing_cost"
	};
	const pkg = getProductPackaging(product);
	const prodCurrency = (product.priceCurrency || product.customFields?.priceCurrency || "SDG").toString().toUpperCase();
	const history = Array.isArray(product.priceHistory) ? product.priceHistory : [];
	const txMs = new Date(txTimestamp).getTime();
	if (history.length > 0 && !isNaN(txMs)) {
		const sortedHist = [...history].filter((h) => h && !isNaN(new Date(h.timestamp).getTime())).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
		if (sortedHist.length > 0) {
			let historicalBaseUnitCost = product.costPrice;
			if (txMs < new Date(sortedHist[0].timestamp).getTime() && sortedHist[0].previousCostPrice > 0) historicalBaseUnitCost = sortedHist[0].previousCostPrice;
			else for (const h of sortedHist) if (txMs >= new Date(h.timestamp).getTime() && h.newCostPrice > 0) historicalBaseUnitCost = h.newCostPrice;
			const histCurrency = (sortedHist[0].currency || prodCurrency).toUpperCase();
			const effectiveSourceCost = isPackSale ? historicalBaseUnitCost * (pkg.unitsPerPack > 1 ? pkg.unitsPerPack : 1) : historicalBaseUnitCost;
			const convertedUnitCost = convertCurrencyAmount(effectiveSourceCost, histCurrency, targetCurrency, rates);
			return {
				lineCost: roundCurrencyValue(convertedUnitCost * item.quantity),
				unitCostResolved: convertedUnitCost,
				quality: "reconstructed_from_price_history"
			};
		}
	}
	const prices = getProductPricesInCurrency(product, targetCurrency, rates);
	const currentUnitCost = isPackSale && prices.packCostPrice > 0 ? prices.packCostPrice : prices.costPrice;
	return {
		lineCost: roundCurrencyValue(currentUnitCost * item.quantity),
		unitCostResolved: currentUnitCost,
		quality: "estimated_from_current_catalog_cost"
	};
}
/**
* Detects whether a transaction was calculated using tax-inclusive pricing
* (where subtotal - discountAmount already includes taxAmount, so grandTotal == subtotal - discountAmount).
*/
function isTransactionTaxInclusive(tx) {
	if (tx.isTaxInclusive === true) return true;
	if (tx.isTaxInclusive === false) return false;
	if (tx.taxAmount <= 0) return false;
	const netSub = Math.max(0, roundCurrencyValue(tx.subtotal - (tx.discountAmount || 0)));
	const diffInclusive = Math.abs(netSub - tx.grandTotal);
	const diffExclusive = Math.abs(netSub + tx.taxAmount - tx.grandTotal);
	return diffInclusive <= .05 && diffInclusive < diffExclusive;
}
var returnsIndexCache = /* @__PURE__ */ new WeakMap();
function getIndexedReturnsMap(datasetReturns) {
	let indexed = returnsIndexCache.get(datasetReturns);
	if (!indexed) {
		indexed = /* @__PURE__ */ new Map();
		for (const r of datasetReturns) if (r && r.saleId) {
			const list = indexed.get(r.saleId);
			if (list) list.push(r);
			else indexed.set(r.saleId, [r]);
		}
		returnsIndexCache.set(datasetReturns, indexed);
	}
	return indexed;
}
/**
* Aggregates and deduplicates all merchandise returns associated with a transaction in O(1) via WeakMap index.
*/
function resolveReturnsForTransaction(tx, datasetReturns) {
	const byId = /* @__PURE__ */ new Map();
	if (Array.isArray(datasetReturns) && datasetReturns.length > 0) {
		const matching = getIndexedReturnsMap(datasetReturns).get(tx.id);
		if (matching) for (const r of matching) byId.set(r.id, r);
	}
	const inlineReturns = tx.returns;
	if (Array.isArray(inlineReturns)) {
		for (const r of inlineReturns) if (r && r.id) byId.set(r.id, {
			...r,
			saleId: tx.id
		});
	}
	return byId.size > 0 ? Array.from(byId.values()) : [];
}
/**
* Matches a converted view line item to its exact original transaction line item (`tx.items[idx]`)
* using line index, line-item ID, or composite key (`productId`, `sku`, `saleUnit`, `quantity`, `discountPercent`)
* while tracking consumed indices so mixed `pack` and `unit` lines for the same SKU on the same invoice
* never collide (Fixes INV-10 / FIN-09).
*/
function resolveOriginalSaleLineItem(viewItem, viewIdx, origItems, consumedIndices) {
	const normUnit = (u) => u === "pack" ? "pack" : "unit";
	const targetUnit = normUnit(viewItem.saleUnit);
	const direct = origItems[viewIdx];
	if (direct && !consumedIndices.has(viewIdx) && direct.productId === viewItem.productId && normUnit(direct.saleUnit) === targetUnit && direct.quantity === viewItem.quantity) {
		consumedIndices.add(viewIdx);
		return direct;
	}
	const viewLineId = viewItem.id || viewItem.lineId;
	if (viewLineId) for (let i = 0; i < origItems.length; i++) {
		if (consumedIndices.has(i)) continue;
		const cand = origItems[i];
		if (cand.id && cand.id === viewLineId || cand.lineId && cand.lineId === viewLineId) {
			consumedIndices.add(i);
			return origItems[i];
		}
	}
	for (let i = 0; i < origItems.length; i++) {
		if (consumedIndices.has(i)) continue;
		const cand = origItems[i];
		if (cand.productId === viewItem.productId && cand.sku === viewItem.sku && normUnit(cand.saleUnit) === targetUnit && cand.quantity === viewItem.quantity && (cand.discountPercent || 0) === (viewItem.discountPercent || 0)) {
			consumedIndices.add(i);
			return cand;
		}
	}
	for (let i = 0; i < origItems.length; i++) {
		if (consumedIndices.has(i)) continue;
		const cand = origItems[i];
		if (cand.productId === viewItem.productId && normUnit(cand.saleUnit) === targetUnit) {
			consumedIndices.add(i);
			return cand;
		}
	}
	return viewItem;
}
/**
* Filters transactions matching branch, customer, cashier, paymentMethod, category, and product filters.
*/
function filterTransactionsByScope(transactions, productsMap, branches, filters) {
	return transactions.filter((tx) => {
		if (!tx || !tx.timestamp) return false;
		if (filters.branchId && filters.branchId !== "all") {
			if (resolveTransactionBranch(tx, branches).id !== filters.branchId && tx.cashierName !== filters.branchId) return false;
		}
		if (filters.cashierName && filters.cashierName !== "all") {
			if ((tx.cashierName || "").toLowerCase() !== filters.cashierName.toLowerCase()) return false;
		}
		if (filters.customerId && filters.customerId !== "all") {
			if (tx.customerId !== filters.customerId) return false;
		}
		if (filters.paymentMethod && filters.paymentMethod !== "all") {
			if ((tx.paymentMethod === "card" ? "bank_transfer" : tx.paymentMethod) !== (filters.paymentMethod === "card" ? "bank_transfer" : filters.paymentMethod) && tx.paymentMethod !== filters.paymentMethod) return false;
		}
		if (filters.productId && filters.productId !== "all" || filters.category && filters.category !== "all") {
			if (!tx.items.some((item) => {
				if (filters.productId && filters.productId !== "all" && item.productId !== filters.productId) return false;
				if (filters.category && filters.category !== "all") {
					const prod = productsMap.get(item.productId);
					if (!prod || prod.category !== filters.category) return false;
				}
				return true;
			})) return false;
		}
		return true;
	});
}
/**
* Combines individual line-item COGS data quality flags into an overall status.
*/
function combineCogsQualities(qualities) {
	if (qualities.size === 0) return "exact_frozen_at_sale";
	if (qualities.has("incomplete_missing_cost")) return "incomplete_missing_cost";
	if (qualities.size === 1) return Array.from(qualities)[0];
	return "mixed_historical_and_estimated";
}
/**
* Computes comprehensive Sales Analytics across the active filter window with strict
* separation of voided invoices vs merchandise returns, tax-inclusive vs tax-exclusive math,
* and historical COGS quality tracking.
*/
function computeSalesAnalytics(dataset, filters, referenceDate = /* @__PURE__ */ new Date()) {
	const targetCurrency = filters.currency || "SDG";
	const valuationMode = filters.valuationMode || "historical";
	const anchorCurrency = filters.anchorCurrency || "USD";
	const liveRates = {
		...DEFAULT_BASELINE_EXCHANGE_RATES,
		...dataset.exchangeRates || {},
		SDG: 1
	};
	const window = resolveAnalyticsDateWindow(filters, referenceDate);
	const productsMap = new Map(dataset.products.map((p) => [p.id, p]));
	const scopedAllDates = filterTransactionsByScope(dataset.transactions, productsMap, dataset.branches, filters);
	const inCurrentWindow = scopedAllDates.filter((tx) => {
		const t = new Date(tx.timestamp).getTime();
		return t >= window.startDate.getTime() && t <= window.endDate.getTime();
	});
	const inPrevWindow = scopedAllDates.filter((tx) => {
		const t = new Date(tx.timestamp).getTime();
		return t >= window.prevStartDate.getTime() && t <= window.prevEndDate.getTime();
	});
	let grossSales = 0;
	let discountsTotal = 0;
	let merchandiseReturnsNetSales = 0;
	let merchandiseReturnsTax = 0;
	let merchandiseReturnsBilledTotal = 0;
	let merchandiseReturnsCount = 0;
	let netSales = 0;
	let taxCollected = 0;
	let billedGrandTotal = 0;
	let voidedSalesAmount = 0;
	let voidedTransactionCount = 0;
	let completedCount = 0;
	let grossUnitsSoldBeforeReturns = 0;
	let returnedUnitsCount = 0;
	const overallQualities = /* @__PURE__ */ new Set();
	const dailyMap = /* @__PURE__ */ new Map();
	for (let i = 0; i < window.calendarDays; i++) {
		const d = new Date(window.startDate);
		d.setDate(window.startDate.getDate() + i);
		const key = toDateKey(d);
		dailyMap.set(key, {
			date: d,
			grossSales: 0,
			netSales: 0,
			billedGrandTotal: 0,
			discounts: 0,
			returnsNet: 0,
			tax: 0,
			cogs: 0,
			grossProfit: 0,
			transactionCount: 0,
			unitsSold: 0,
			hourlyNetSales: /* @__PURE__ */ new Map()
		});
	}
	const hourlyBuckets = Array.from({ length: 24 }, (_, hour) => ({
		hour,
		label: `${String(hour).padStart(2, "0")}:00`,
		grossSales: 0,
		netSales: 0,
		transactionCount: 0,
		unitsSold: 0,
		averageTransactionValue: 0
	}));
	const weekdayNamesEn = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	];
	const weekdayNamesAr = [
		"الأحد",
		"الاثنين",
		"الثلاثاء",
		"الأربعاء",
		"الخميس",
		"الجمعة",
		"السبت"
	];
	const weekdayBuckets = Array.from({ length: 7 }, (_, day) => ({
		dayOfWeek: day,
		labelEn: weekdayNamesEn[day],
		labelAr: weekdayNamesAr[day],
		grossSales: 0,
		netSales: 0,
		transactionCount: 0,
		unitsSold: 0,
		averageTransactionValue: 0
	}));
	const categoryMap = /* @__PURE__ */ new Map();
	const productMap = /* @__PURE__ */ new Map();
	const branchMap = /* @__PURE__ */ new Map();
	const employeeMap = /* @__PURE__ */ new Map();
	const paymentMap = /* @__PURE__ */ new Map([
		["cash", {
			count: 0,
			grossAmount: 0,
			netSalesAmount: 0
		}],
		["bank_transfer", {
			count: 0,
			grossAmount: 0,
			netSalesAmount: 0
		}],
		["qr_nfc", {
			count: 0,
			grossAmount: 0,
			netSalesAmount: 0
		}]
	]);
	const currencyMap = /* @__PURE__ */ new Map();
	for (const tx of inCurrentWindow) {
		const view = getConvertedTransactionView(tx, targetCurrency, liveRates, valuationMode, anchorCurrency);
		const isTaxInclusive = isTransactionTaxInclusive(tx);
		const matchingIndexedItems = [];
		for (let idx = 0; idx < view.items.length; idx++) {
			const item = view.items[idx];
			if (filters.productId && filters.productId !== "all" && item.productId !== filters.productId) continue;
			if (filters.category && filters.category !== "all") {
				const prod = productsMap.get(item.productId);
				if (!prod || prod.category !== filters.category) continue;
			}
			matchingIndexedItems.push({
				item,
				idx
			});
		}
		if (matchingIndexedItems.length === 0) continue;
		const itemFilterRatio = view.subtotal > 0 ? matchingIndexedItems.reduce((acc, it) => acc + it.item.total, 0) / view.subtotal : 1;
		if (tx.status === "voided") {
			const voidBilled = roundCurrencyValue(view.grandTotal * itemFilterRatio);
			voidedSalesAmount = roundCurrencyValue(voidedSalesAmount + voidBilled);
			voidedTransactionCount += 1;
			continue;
		}
		const snapshotRates = valuationMode === "historical" ? {
			...DEFAULT_BASELINE_EXCHANGE_RATES,
			...tx.exchangeRatesSnapshot || {},
			SDG: 1
		} : liveRates;
		const txReturns = resolveReturnsForTransaction(tx, dataset.returns || []);
		const returnedQtyByProduct = /* @__PURE__ */ new Map();
		const returnedRefundByProduct = /* @__PURE__ */ new Map();
		let rawRefundBilledInTxCurrency = 0;
		for (const ret of txReturns) {
			merchandiseReturnsCount += 1;
			if (Array.isArray(ret.items) && ret.items.length > 0) for (const ri of ret.items) {
				if (filters.productId && filters.productId !== "all" && ri.productId !== filters.productId) continue;
				if (filters.category && filters.category !== "all") {
					const p = productsMap.get(ri.productId);
					if (!p || p.category !== filters.category) continue;
				}
				returnedQtyByProduct.set(ri.productId, (returnedQtyByProduct.get(ri.productId) || 0) + Math.max(0, ri.quantity));
				returnedRefundByProduct.set(ri.productId, roundCurrencyValue((returnedRefundByProduct.get(ri.productId) || 0) + Math.max(0, ri.refundAmount)));
				rawRefundBilledInTxCurrency = roundCurrencyValue(rawRefundBilledInTxCurrency + Math.max(0, ri.refundAmount));
			}
			else if (ret.refundTotal > 0) rawRefundBilledInTxCurrency = roundCurrencyValue(rawRefundBilledInTxCurrency + ret.refundTotal * itemFilterRatio);
		}
		const txToTargetFactor = tx.grandTotal > 0 ? view.grandTotal / tx.grandTotal : 1;
		let txRawPreDiscount = 0;
		let txItemsNetAfterItemDiscount = 0;
		let txGrossUnits = 0;
		let txReturnedUnits = 0;
		let txCogs = 0;
		const consumedOrigIndices = /* @__PURE__ */ new Set();
		const remainingRetQtyByProd = new Map(returnedQtyByProduct);
		const remainingRetRefundByProd = new Map(returnedRefundByProduct);
		for (const { item, idx } of matchingIndexedItems) {
			const origTxItem = resolveOriginalSaleLineItem(item, idx, tx.items, consumedOrigIndices);
			const discPct = Math.max(0, Math.min(100, item.discountPercent || 0));
			const itemGrossBeforeItemDisc = discPct > 0 && discPct < 100 ? roundCurrencyValue(item.total / (1 - discPct / 100)) : roundCurrencyValue(item.unitPrice * item.quantity);
			const itemDiscAmount = Math.max(0, roundCurrencyValue(itemGrossBeforeItemDisc - item.total));
			txRawPreDiscount = roundCurrencyValue(txRawPreDiscount + itemGrossBeforeItemDisc);
			txItemsNetAfterItemDiscount = roundCurrencyValue(txItemsNetAfterItemDiscount + item.total);
			const availRetQty = remainingRetQtyByProd.get(item.productId) || 0;
			const retQty = Math.min(item.quantity, availRetQty);
			remainingRetQtyByProd.set(item.productId, Math.max(0, availRetQty - retQty));
			const netQty = Math.max(0, item.quantity - retQty);
			txGrossUnits += item.quantity;
			txReturnedUnits += retQty;
			const prod = productsMap.get(item.productId);
			const costRes = resolveHistoricalLineItemCost(origTxItem, prod, tx.timestamp, targetCurrency, snapshotRates);
			overallQualities.add(costRes.quality);
			const netLineCost = roundCurrencyValue(costRes.unitCostResolved * netQty);
			txCogs = roundCurrencyValue(txCogs + netLineCost);
			const itemShareOfSubtotal = view.subtotal > 0 ? item.total / view.subtotal : 0;
			const allocatedGlobalDiscount = roundCurrencyValue(view.discountAmount * itemShareOfSubtotal);
			const allocatedTax = roundCurrencyValue(view.taxAmount * itemShareOfSubtotal);
			const itemGrossExclTax = isTaxInclusive ? Math.max(0, roundCurrencyValue(itemGrossBeforeItemDisc - allocatedTax)) : itemGrossBeforeItemDisc;
			const itemNetBeforeReturn = isTaxInclusive ? Math.max(0, roundCurrencyValue(item.total - allocatedGlobalDiscount - allocatedTax)) : Math.max(0, roundCurrencyValue(item.total - allocatedGlobalDiscount));
			const itemBilledBeforeReturn = isTaxInclusive ? Math.max(0, roundCurrencyValue(item.total - allocatedGlobalDiscount)) : roundCurrencyValue(itemNetBeforeReturn + allocatedTax);
			let itemReturnBilled = 0;
			if (remainingRetRefundByProd.has(item.productId)) {
				const availRefundInTarget = roundCurrencyValue((remainingRetRefundByProd.get(item.productId) || 0) * txToTargetFactor);
				itemReturnBilled = Math.min(itemBilledBeforeReturn, availRefundInTarget);
				const usedRefundInTxCurr = txToTargetFactor > 0 ? itemReturnBilled / txToTargetFactor : itemReturnBilled;
				remainingRetRefundByProd.set(item.productId, Math.max(0, (remainingRetRefundByProd.get(item.productId) || 0) - usedRefundInTxCurr));
			} else if (rawRefundBilledInTxCurrency > 0 && txReturns.every((r) => !r.items?.length)) itemReturnBilled = Math.min(itemBilledBeforeReturn, roundCurrencyValue(rawRefundBilledInTxCurrency * txToTargetFactor * itemShareOfSubtotal));
			const itemNetTaxRatio = itemBilledBeforeReturn > 0 ? itemNetBeforeReturn / itemBilledBeforeReturn : 1;
			const itemReturnNet = roundCurrencyValue(itemReturnBilled * itemNetTaxRatio);
			const itemReturnTax = Math.max(0, roundCurrencyValue(itemReturnBilled - itemReturnNet));
			const itemFinalNetRevenue = Math.max(0, roundCurrencyValue(itemNetBeforeReturn - itemReturnNet));
			const itemFinalTax = Math.max(0, roundCurrencyValue(allocatedTax - itemReturnTax));
			const itemTotalDiscount = roundCurrencyValue(itemDiscAmount + allocatedGlobalDiscount);
			const itemProfit = roundCurrencyValue(itemFinalNetRevenue - netLineCost);
			const existingProd = productMap.get(item.productId) || {
				id: item.productId,
				name: prod?.name || item.productName,
				nameAr: prod?.nameAr || item.productName,
				grossSales: 0,
				netSales: 0,
				discounts: 0,
				returnsDeducted: 0,
				tax: 0,
				cogs: 0,
				grossProfit: 0,
				grossMarginPercent: 0,
				cogsDataQuality: costRes.quality,
				transactionCount: 0,
				unitsSold: 0,
				shareOfNetSalesPercent: 0
			};
			existingProd.grossSales = roundCurrencyValue(existingProd.grossSales + itemGrossExclTax);
			existingProd.netSales = roundCurrencyValue(existingProd.netSales + itemFinalNetRevenue);
			existingProd.discounts = roundCurrencyValue(existingProd.discounts + itemTotalDiscount);
			existingProd.returnsDeducted = roundCurrencyValue(existingProd.returnsDeducted + itemReturnNet);
			existingProd.tax = roundCurrencyValue(existingProd.tax + itemFinalTax);
			existingProd.cogs = roundCurrencyValue((existingProd.cogs ?? 0) + netLineCost);
			existingProd.grossProfit = roundCurrencyValue((existingProd.grossProfit ?? 0) + itemProfit);
			existingProd.transactionCount += 1;
			existingProd.unitsSold += netQty;
			productMap.set(item.productId, existingProd);
			const catKey = prod?.category || "Uncategorized";
			const catNameAr = prod?.categoryAr || catKey;
			const existingCat = categoryMap.get(catKey) || {
				id: catKey,
				name: catKey,
				nameAr: catNameAr,
				grossSales: 0,
				netSales: 0,
				discounts: 0,
				returnsDeducted: 0,
				tax: 0,
				cogs: 0,
				grossProfit: 0,
				grossMarginPercent: 0,
				cogsDataQuality: costRes.quality,
				transactionCount: 0,
				unitsSold: 0,
				shareOfNetSalesPercent: 0
			};
			existingCat.grossSales = roundCurrencyValue(existingCat.grossSales + itemGrossExclTax);
			existingCat.netSales = roundCurrencyValue(existingCat.netSales + itemFinalNetRevenue);
			existingCat.discounts = roundCurrencyValue(existingCat.discounts + itemTotalDiscount);
			existingCat.returnsDeducted = roundCurrencyValue(existingCat.returnsDeducted + itemReturnNet);
			existingCat.tax = roundCurrencyValue(existingCat.tax + itemFinalTax);
			existingCat.cogs = roundCurrencyValue((existingCat.cogs ?? 0) + netLineCost);
			existingCat.grossProfit = roundCurrencyValue((existingCat.grossProfit ?? 0) + itemProfit);
			existingCat.transactionCount += 1;
			existingCat.unitsSold += netQty;
			categoryMap.set(catKey, existingCat);
		}
		const allocatedGlobalDisc = roundCurrencyValue(view.discountAmount * itemFilterRatio);
		const allocatedTax = roundCurrencyValue(view.taxAmount * itemFilterRatio);
		const txTotalDiscounts = roundCurrencyValue(Math.max(0, txRawPreDiscount - txItemsNetAfterItemDiscount) + allocatedGlobalDisc);
		const txGrossExclTax = isTaxInclusive ? Math.max(0, roundCurrencyValue(txRawPreDiscount - allocatedTax)) : txRawPreDiscount;
		const txNetBeforeReturns = isTaxInclusive ? Math.max(0, roundCurrencyValue(txItemsNetAfterItemDiscount - allocatedGlobalDisc - allocatedTax)) : Math.max(0, roundCurrencyValue(txItemsNetAfterItemDiscount - allocatedGlobalDisc));
		const txBilledBeforeReturns = isTaxInclusive ? Math.max(0, roundCurrencyValue(txItemsNetAfterItemDiscount - allocatedGlobalDisc)) : roundCurrencyValue(txNetBeforeReturns + allocatedTax);
		const cappedReturnBilled = Math.min(txBilledBeforeReturns, roundCurrencyValue(rawRefundBilledInTxCurrency * txToTargetFactor));
		const netToBilledRatio = txBilledBeforeReturns > 0 ? txNetBeforeReturns / txBilledBeforeReturns : 1;
		const txReturnNet = roundCurrencyValue(cappedReturnBilled * netToBilledRatio);
		const txReturnTax = Math.max(0, roundCurrencyValue(cappedReturnBilled - txReturnNet));
		if (cappedReturnBilled >= txBilledBeforeReturns - .01 && txBilledBeforeReturns > 0 && txReturnedUnits === 0) {
			txReturnedUnits = txGrossUnits;
			txCogs = 0;
		}
		const txNetUnits = Math.max(0, txGrossUnits - txReturnedUnits);
		const txNetSales = Math.max(0, roundCurrencyValue(txNetBeforeReturns - txReturnNet));
		const txFinalTax = Math.max(0, roundCurrencyValue(allocatedTax - txReturnTax));
		const txBilledTotal = roundCurrencyValue(txNetSales + txFinalTax);
		const txGrossProfit = roundCurrencyValue(txNetSales - txCogs);
		completedCount += 1;
		grossSales = roundCurrencyValue(grossSales + txGrossExclTax);
		discountsTotal = roundCurrencyValue(discountsTotal + txTotalDiscounts);
		merchandiseReturnsNetSales = roundCurrencyValue(merchandiseReturnsNetSales + txReturnNet);
		merchandiseReturnsTax = roundCurrencyValue(merchandiseReturnsTax + txReturnTax);
		merchandiseReturnsBilledTotal = roundCurrencyValue(merchandiseReturnsBilledTotal + cappedReturnBilled);
		netSales = roundCurrencyValue(netSales + txNetSales);
		taxCollected = roundCurrencyValue(taxCollected + txFinalTax);
		billedGrandTotal = roundCurrencyValue(billedGrandTotal + txBilledTotal);
		grossUnitsSoldBeforeReturns += txGrossUnits;
		returnedUnitsCount += txReturnedUnits;
		const txDate = new Date(tx.timestamp);
		const dateKey = toDateKey(txDate);
		const hour = txDate.getHours();
		const weekday = txDate.getDay();
		const dayBucket = dailyMap.get(dateKey);
		if (dayBucket) {
			dayBucket.grossSales = roundCurrencyValue(dayBucket.grossSales + txGrossExclTax);
			dayBucket.netSales = roundCurrencyValue(dayBucket.netSales + txNetSales);
			dayBucket.billedGrandTotal = roundCurrencyValue(dayBucket.billedGrandTotal + txBilledTotal);
			dayBucket.discounts = roundCurrencyValue(dayBucket.discounts + txTotalDiscounts);
			dayBucket.returnsNet = roundCurrencyValue(dayBucket.returnsNet + txReturnNet);
			dayBucket.tax = roundCurrencyValue(dayBucket.tax + txFinalTax);
			dayBucket.cogs = roundCurrencyValue(dayBucket.cogs + txCogs);
			dayBucket.grossProfit = roundCurrencyValue(dayBucket.grossProfit + txGrossProfit);
			dayBucket.transactionCount += 1;
			dayBucket.unitsSold += txNetUnits;
			const prevHourVal = dayBucket.hourlyNetSales.get(hour) || 0;
			dayBucket.hourlyNetSales.set(hour, roundCurrencyValue(prevHourVal + txNetSales));
		}
		if (hourlyBuckets[hour]) {
			hourlyBuckets[hour].grossSales = roundCurrencyValue(hourlyBuckets[hour].grossSales + txGrossExclTax);
			hourlyBuckets[hour].netSales = roundCurrencyValue(hourlyBuckets[hour].netSales + txNetSales);
			hourlyBuckets[hour].transactionCount += 1;
			hourlyBuckets[hour].unitsSold += txNetUnits;
		}
		if (weekdayBuckets[weekday]) {
			weekdayBuckets[weekday].grossSales = roundCurrencyValue(weekdayBuckets[weekday].grossSales + txGrossExclTax);
			weekdayBuckets[weekday].netSales = roundCurrencyValue(weekdayBuckets[weekday].netSales + txNetSales);
			weekdayBuckets[weekday].transactionCount += 1;
			weekdayBuckets[weekday].unitsSold += txNetUnits;
		}
		const branchInfo = resolveTransactionBranch(tx, dataset.branches);
		const existingBranch = branchMap.get(branchInfo.id) || {
			id: branchInfo.id,
			name: branchInfo.name,
			nameAr: branchInfo.nameAr,
			grossSales: 0,
			netSales: 0,
			discounts: 0,
			returnsDeducted: 0,
			tax: 0,
			cogs: 0,
			grossProfit: 0,
			grossMarginPercent: 0,
			cogsDataQuality: "estimated_from_current_catalog_cost",
			transactionCount: 0,
			unitsSold: 0,
			shareOfNetSalesPercent: 0
		};
		existingBranch.grossSales = roundCurrencyValue(existingBranch.grossSales + txGrossExclTax);
		existingBranch.netSales = roundCurrencyValue(existingBranch.netSales + txNetSales);
		existingBranch.discounts = roundCurrencyValue(existingBranch.discounts + txTotalDiscounts);
		existingBranch.returnsDeducted = roundCurrencyValue(existingBranch.returnsDeducted + txReturnNet);
		existingBranch.tax = roundCurrencyValue(existingBranch.tax + txFinalTax);
		existingBranch.cogs = roundCurrencyValue((existingBranch.cogs ?? 0) + txCogs);
		existingBranch.grossProfit = roundCurrencyValue((existingBranch.grossProfit ?? 0) + txGrossProfit);
		existingBranch.transactionCount += 1;
		existingBranch.unitsSold += txNetUnits;
		branchMap.set(branchInfo.id, existingBranch);
		const empKey = tx.cashierName || "POS Terminal 01";
		const matchedUser = dataset.users.find((u) => u.terminalName === empKey || u.name === empKey || u.nameAr === empKey);
		const existingEmp = employeeMap.get(empKey) || {
			id: empKey,
			name: matchedUser ? `${matchedUser.name} (${empKey})` : empKey,
			nameAr: matchedUser?.nameAr ? `${matchedUser.nameAr} (${empKey})` : empKey,
			grossSales: 0,
			netSales: 0,
			discounts: 0,
			returnsDeducted: 0,
			tax: 0,
			cogs: 0,
			grossProfit: 0,
			grossMarginPercent: 0,
			cogsDataQuality: "estimated_from_current_catalog_cost",
			transactionCount: 0,
			unitsSold: 0,
			shareOfNetSalesPercent: 0
		};
		existingEmp.grossSales = roundCurrencyValue(existingEmp.grossSales + txGrossExclTax);
		existingEmp.netSales = roundCurrencyValue(existingEmp.netSales + txNetSales);
		existingEmp.discounts = roundCurrencyValue(existingEmp.discounts + txTotalDiscounts);
		existingEmp.returnsDeducted = roundCurrencyValue(existingEmp.returnsDeducted + txReturnNet);
		existingEmp.tax = roundCurrencyValue(existingEmp.tax + txFinalTax);
		existingEmp.cogs = roundCurrencyValue((existingEmp.cogs ?? 0) + txCogs);
		existingEmp.grossProfit = roundCurrencyValue((existingEmp.grossProfit ?? 0) + txGrossProfit);
		existingEmp.transactionCount += 1;
		existingEmp.unitsSold += txNetUnits;
		employeeMap.set(empKey, existingEmp);
		const methodKey = tx.paymentMethod === "card" ? "bank_transfer" : tx.paymentMethod;
		const pm = paymentMap.get(methodKey) || {
			count: 0,
			grossAmount: 0,
			netSalesAmount: 0
		};
		pm.count += 1;
		pm.grossAmount = roundCurrencyValue(pm.grossAmount + txBilledTotal);
		pm.netSalesAmount = roundCurrencyValue(pm.netSalesAmount + txNetSales);
		paymentMap.set(methodKey, pm);
		const origCurr = (tx.currency || "SDG").toUpperCase();
		const currEntry = currencyMap.get(origCurr) || {
			count: 0,
			originalAmount: 0,
			convertedNetSales: 0,
			rateSum: 0
		};
		currEntry.count += 1;
		currEntry.originalAmount = roundCurrencyValue(currEntry.originalAmount + tx.grandTotal * itemFilterRatio);
		currEntry.convertedNetSales = roundCurrencyValue(currEntry.convertedNetSales + txNetSales);
		currEntry.rateSum += Number(tx.exchangeRateUsed || liveRates[origCurr] || 1);
		currencyMap.set(origCurr, currEntry);
	}
	let previousPeriodNetSales = 0;
	for (const tx of inPrevWindow) {
		if (tx.status !== "completed") continue;
		const view = getConvertedTransactionView(tx, targetCurrency, liveRates, valuationMode, anchorCurrency);
		const txNet = isTransactionTaxInclusive(tx) ? Math.max(0, roundCurrencyValue(view.subtotal - view.discountAmount - view.taxAmount)) : Math.max(0, roundCurrencyValue(view.subtotal - view.discountAmount));
		previousPeriodNetSales = roundCurrencyValue(previousPeriodNetSales + txNet);
	}
	const periodOverPeriodGrowthPercent = previousPeriodNetSales > 0 ? Math.round((netSales - previousPeriodNetSales) / previousPeriodNetSales * 1e3) / 10 : netSales > 0 ? 100 : 0;
	const unitsSold = Math.max(0, grossUnitsSoldBeforeReturns - returnedUnitsCount);
	const averageTransactionValue = completedCount > 0 ? roundCurrencyValue(netSales / completedCount) : 0;
	const averageBilledTicket = completedCount > 0 ? roundCurrencyValue(billedGrandTotal / completedCount) : 0;
	const unitsPerTransaction = completedCount > 0 ? Math.round(unitsSold / completedCount * 100) / 100 : 0;
	const discountRatePercent = grossSales > 0 ? Math.round(discountsTotal / grossSales * 1e3) / 10 : 0;
	const returnedOrVoidedSales = roundCurrencyValue(voidedSalesAmount + merchandiseReturnsBilledTotal);
	const returnedOrVoidedCount = voidedTransactionCount + merchandiseReturnsCount;
	const cogsDataQuality = combineCogsQualities(overallQualities);
	for (const h of hourlyBuckets) h.averageTransactionValue = h.transactionCount > 0 ? roundCurrencyValue(h.netSales / h.transactionCount) : 0;
	const finalizeDimensionList = (map) => Array.from(map.values()).map((item) => ({
		...item,
		grossMarginPercent: item.netSales > 0 && item.grossProfit !== null ? Math.round(item.grossProfit / item.netSales * 1e3) / 10 : 0,
		shareOfNetSalesPercent: netSales > 0 ? Math.round(item.netSales / netSales * 1e3) / 10 : 0
	})).sort((a, b) => b.netSales - a.netSales);
	const dailySeries = [];
	const intradayCandlesticks = [];
	for (const [dateKey, bucket] of dailyMap.entries()) {
		const label = bucket.date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric"
		});
		const atv = bucket.transactionCount > 0 ? roundCurrencyValue(bucket.netSales / bucket.transactionCount) : 0;
		dailySeries.push({
			dateKey,
			label,
			grossSales: bucket.grossSales,
			netSales: bucket.netSales,
			billedGrandTotal: bucket.billedGrandTotal,
			discounts: bucket.discounts,
			returnsNet: bucket.returnsNet,
			tax: bucket.tax,
			cogs: bucket.cogs,
			grossProfit: bucket.grossProfit,
			transactionCount: bucket.transactionCount,
			unitsSold: bucket.unitsSold,
			averageTransactionValue: atv
		});
		const activeHours = Array.from(bucket.hourlyNetSales.entries()).sort((a, b) => a[0] - b[0]);
		if (activeHours.length === 0) intradayCandlesticks.push({
			dateKey,
			label,
			open: 0,
			high: 0,
			low: 0,
			close: 0,
			dailyTotalSales: 0,
			transactionCount: 0,
			unitsSold: 0,
			peakHour: null,
			intradayDirection: "flat"
		});
		else {
			const open = activeHours[0][1];
			const close = activeHours[activeHours.length - 1][1];
			let high = activeHours[0][1];
			let low = activeHours[0][1];
			let peakHour = activeHours[0][0];
			for (const [hr, val] of activeHours) {
				if (val > high) {
					high = val;
					peakHour = hr;
				}
				if (val < low) low = val;
			}
			intradayCandlesticks.push({
				dateKey,
				label,
				open,
				high,
				low,
				close,
				dailyTotalSales: bucket.netSales,
				transactionCount: bucket.transactionCount,
				unitsSold: bucket.unitsSold,
				peakHour,
				intradayDirection: close > open + .01 ? "bullish" : close < open - .01 ? "bearish" : "flat"
			});
		}
	}
	const byPaymentMethod = Array.from(paymentMap.entries()).map(([method, stat]) => ({
		method,
		labelEn: formatPaymentMethodLabel(method, "en"),
		labelAr: formatPaymentMethodLabel(method, "ar"),
		transactionCount: stat.count,
		grossAmount: stat.grossAmount,
		netSalesAmount: stat.netSalesAmount,
		sharePercent: netSales > 0 ? Math.round(stat.netSalesAmount / netSales * 1e3) / 10 : 0
	}));
	const byCurrency = Array.from(currencyMap.entries()).map(([code, stat]) => ({
		originalCurrency: code,
		transactionCount: stat.count,
		originalAmount: stat.originalAmount,
		convertedNetSales: stat.convertedNetSales,
		averageHistoricalRateToSdg: stat.count > 0 ? roundCurrencyValue(stat.rateSum / stat.count) : 1,
		sharePercent: netSales > 0 ? Math.round(stat.convertedNetSales / netSales * 1e3) / 10 : 0
	}));
	return {
		currency: targetCurrency,
		valuationMode,
		costAccessStatus: "authorized",
		cogsDataQuality,
		cogsValuationNoteEn: cogsDataQuality === "exact_frozen_at_sale" ? "COGS is computed from exact unit costs frozen on each sale item at checkout." : cogsDataQuality === "reconstructed_from_price_history" ? "COGS is reconstructed from product price history timelines at transaction timestamps." : "Historical unit cost was not frozen on all sale_items; COGS uses product priceHistory where available and current catalog cost as an estimate.",
		cogsValuationNoteAr: cogsDataQuality === "exact_frozen_at_sale" ? "تم احتساب تكلفة البضاعة المباعة (COGS) من التكلفة المثبتة على كل صنف وقت البيع." : cogsDataQuality === "reconstructed_from_price_history" ? "تمت إعادة بناء تكلفة البضاعة المباعة من سجل تاريخ أسعار المنتج في وقت كل فاتورة." : "لم يتم تثبيت تكلفة الوحدة التاريخية على جميع بنود المبيعات؛ تستخدم التكلفة سجل تاريخ الأسعار إن وجد والتكلفة الحالية كتقدير.",
		periodStart: window.startDate.toISOString(),
		periodEnd: window.endDate.toISOString(),
		summary: {
			grossSales,
			discountsTotal,
			discountRatePercent,
			merchandiseReturnsNetSales,
			merchandiseReturnsTax,
			merchandiseReturnsBilledTotal,
			merchandiseReturnsCount,
			netSales,
			taxCollected,
			billedGrandTotal,
			voidedSalesAmount,
			voidedTransactionCount,
			returnedOrVoidedSales,
			returnedOrVoidedCount,
			transactionCount: completedCount,
			unitsSold,
			grossUnitsSoldBeforeReturns,
			returnedUnitsCount,
			averageTransactionValue,
			averageBilledTicket,
			unitsPerTransaction,
			previousPeriodNetSales,
			periodOverPeriodGrowthPercent
		},
		dailySeries,
		intradayCandlesticks,
		hourlyDistribution: hourlyBuckets,
		weekdayDistribution: weekdayBuckets,
		byCategory: finalizeDimensionList(categoryMap),
		byProduct: finalizeDimensionList(productMap),
		byBranch: finalizeDimensionList(branchMap),
		byEmployee: finalizeDimensionList(employeeMap),
		byPaymentMethod,
		byCurrency
	};
}
// src/analytics/calculations/financial.metrics.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
/**
* Computes comprehensive Financial & Accounting Analytics, reconciling with Sales Analytics,
* Returns, Purchases, and Stock Movements without fabricating missing overhead expenses
* or historical costs.
*/
function computeFinancialAnalytics(dataset, filters, precomputedSales, referenceDate = /* @__PURE__ */ new Date()) {
	const targetCurrency = filters.currency || "SDG";
	const valuationMode = filters.valuationMode || "historical";
	const anchorCurrency = filters.anchorCurrency || "USD";
	const liveRates = {
		...DEFAULT_BASELINE_EXCHANGE_RATES,
		...dataset.exchangeRates || {},
		SDG: 1
	};
	const sales = precomputedSales || computeSalesAnalytics(dataset, filters, referenceDate);
	const window = resolveAnalyticsDateWindow(filters, referenceDate);
	const productsMap = new Map(dataset.products.map((p) => [p.id, p]));
	const scopedTransactions = filterTransactionsByScope(dataset.transactions, productsMap, dataset.branches, filters).filter((tx) => {
		const t = new Date(tx.timestamp).getTime();
		return t >= window.startDate.getTime() && t <= window.endDate.getTime();
	});
	const costOfGoodsSold = roundCurrencyValue(sales.dailySeries.reduce((acc, d) => acc + (d.cogs ?? 0), 0));
	const netSalesRevenue = sales.summary.netSales;
	const grossProfit = roundCurrencyValue(netSalesRevenue - costOfGoodsSold);
	const grossProfitMarginPercent = netSalesRevenue > 0 ? Math.round(grossProfit / netSalesRevenue * 1e3) / 10 : 0;
	let exactHistoricalCogsPortion = 0;
	let estimatedCurrentCostCogsPortion = 0;
	let unresolvableCostRevenuePortion = 0;
	let cashInflowsFromSalesAtCheckout = 0;
	let cashInflowsFromDebtSettlements = 0;
	let cashRefundsForReturns = 0;
	let accountsReceivableOutstandingDebt = 0;
	let netSalesAtHistoricalRate = 0;
	let netSalesAtLiveRate = 0;
	let netSalesAtUsdIndexedRate = 0;
	for (const tx of scopedTransactions) {
		if (tx.status !== "completed") continue;
		const viewActive = getConvertedTransactionView(tx, targetCurrency, liveRates, valuationMode, anchorCurrency);
		const viewHist = getConvertedTransactionView(tx, targetCurrency, liveRates, "historical", anchorCurrency);
		const viewLive = getConvertedTransactionView(tx, targetCurrency, liveRates, "live", anchorCurrency);
		const viewIndexed = getConvertedTransactionView(tx, targetCurrency, liveRates, "indexed", anchorCurrency);
		const snapshotRates = valuationMode === "historical" ? {
			...DEFAULT_BASELINE_EXCHANGE_RATES,
			...tx.exchangeRatesSnapshot || {},
			SDG: 1
		} : liveRates;
		const txReturns = resolveReturnsForTransaction(tx, dataset.returns || []);
		const returnedQtyByProduct = /* @__PURE__ */ new Map();
		let rawRefundInTxCurrency = 0;
		for (const ret of txReturns) if (Array.isArray(ret.items) && ret.items.length > 0) for (const ri of ret.items) {
			returnedQtyByProduct.set(ri.productId, (returnedQtyByProduct.get(ri.productId) || 0) + Math.max(0, ri.quantity));
			rawRefundInTxCurrency = roundCurrencyValue(rawRefundInTxCurrency + Math.max(0, ri.refundAmount));
		}
		else if (ret.refundTotal > 0) rawRefundInTxCurrency = roundCurrencyValue(rawRefundInTxCurrency + ret.refundTotal);
		const txToTargetFactor = tx.grandTotal > 0 ? viewActive.grandTotal / tx.grandTotal : 1;
		const cappedGrossReturnBilled = Math.min(viewActive.grandTotal, roundCurrencyValue(rawRefundInTxCurrency * txToTargetFactor));
		const remainingRetQtyByProd = new Map(returnedQtyByProduct);
		for (const item of tx.items) {
			const costRes = resolveHistoricalLineItemCost(item, productsMap.get(item.productId), tx.timestamp, targetCurrency, snapshotRates);
			const availRetQty = remainingRetQtyByProd.get(item.productId) || 0;
			const retQty = Math.min(item.quantity, availRetQty);
			remainingRetQtyByProd.set(item.productId, Math.max(0, availRetQty - retQty));
			const netQty = Math.max(0, item.quantity - retQty);
			const netItemCost = roundCurrencyValue(costRes.unitCostResolved * netQty);
			if (costRes.quality === "exact_frozen_at_sale" || costRes.quality === "reconstructed_from_price_history") exactHistoricalCogsPortion = roundCurrencyValue(exactHistoricalCogsPortion + netItemCost);
			else if (costRes.quality === "estimated_from_current_catalog_cost") estimatedCurrentCostCogsPortion = roundCurrencyValue(estimatedCurrentCostCogsPortion + netItemCost);
			else unresolvableCostRevenuePortion = roundCurrencyValue(unresolvableCostRevenuePortion + item.total * txToTargetFactor);
		}
		let installmentsInTxCurrency = 0;
		if (Array.isArray(tx.debtPayments) && tx.debtPayments.length > 0) for (const dp of tx.debtPayments) installmentsInTxCurrency = roundCurrencyValue(installmentsInTxCurrency + (dp.amountPaid || 0));
		const totalPaidInTxCurrency = tx.amountPaid !== void 0 ? tx.amountPaid : tx.grandTotal;
		const upfrontPaidInTxCurrency = Math.max(0, roundCurrencyValue(totalPaidInTxCurrency - installmentsInTxCurrency));
		cashInflowsFromSalesAtCheckout = roundCurrencyValue(cashInflowsFromSalesAtCheckout + upfrontPaidInTxCurrency * txToTargetFactor);
		cashInflowsFromDebtSettlements = roundCurrencyValue(cashInflowsFromDebtSettlements + installmentsInTxCurrency * txToTargetFactor);
		if (cappedGrossReturnBilled > 0 && viewActive.amountPaid > 0) {
			const refundedCash = Math.min(viewActive.amountPaid, cappedGrossReturnBilled);
			cashRefundsForReturns = roundCurrencyValue(cashRefundsForReturns + refundedCash);
		}
		const remainingDebtAfterReturn = Math.max(0, roundCurrencyValue(viewActive.debtAmount - Math.max(0, cappedGrossReturnBilled - viewActive.amountPaid)));
		accountsReceivableOutstandingDebt = roundCurrencyValue(accountsReceivableOutstandingDebt + remainingDebtAfterReturn);
		const returnFraction = viewActive.grandTotal > 0 ? cappedGrossReturnBilled / viewActive.grandTotal : 0;
		netSalesAtHistoricalRate = roundCurrencyValue(netSalesAtHistoricalRate + Math.max(0, (viewHist.subtotal - viewHist.discountAmount) * (1 - returnFraction)));
		netSalesAtLiveRate = roundCurrencyValue(netSalesAtLiveRate + Math.max(0, (viewLive.subtotal - viewLive.discountAmount) * (1 - returnFraction)));
		netSalesAtUsdIndexedRate = roundCurrencyValue(netSalesAtUsdIndexedRate + Math.max(0, (viewIndexed.subtotal - viewIndexed.discountAmount) * (1 - returnFraction)));
	}
	const totalCashInflows = Math.max(0, roundCurrencyValue(cashInflowsFromSalesAtCheckout + cashInflowsFromDebtSettlements - cashRefundsForReturns));
	let recordedShrinkageAndDamageExpense = 0;
	let cashOutflowsForRestockPurchases = 0;
	let accountsPayablePendingInvoices = 0;
	let purchaseCommitmentsTotal = 0;
	const handledPurchaseRefs = /* @__PURE__ */ new Set();
	for (const po of dataset.purchases || []) {
		if (!po || po.status === "cancelled") continue;
		const poTime = new Date(po.invoiceDate).getTime();
		if (poTime < window.startDate.getTime() || poTime > window.endDate.getTime()) continue;
		if (filters.branchId && filters.branchId !== "all" && po.branchId && po.branchId !== "all" && po.branchId !== filters.branchId) continue;
		let filterScale = 1;
		if (filters.productId && filters.productId !== "all" || filters.category && filters.category !== "all") {
			if (Array.isArray(po.items) && po.items.length > 0) {
				let matchingItemsCost = 0;
				let allItemsCost = 0;
				for (const it of po.items) {
					const itemCost = Math.max(0, Number(it.totalCost) || Number(it.quantity) * Number(it.unitCost) || 0);
					allItemsCost += itemCost;
					const p = productsMap.get(it.productId);
					const prodMatch = !filters.productId || filters.productId === "all" || it.productId === filters.productId;
					const catMatch = !filters.category || filters.category === "all" || p?.category === filters.category;
					if (prodMatch && catMatch) matchingItemsCost += itemCost;
				}
				if (matchingItemsCost <= 0) continue;
				filterScale = allItemsCost > 0 ? matchingItemsCost / allItemsCost : 1;
			}
		}
		if (po.id) handledPurchaseRefs.add(po.id.trim().toLowerCase());
		if (po.purchaseNumber) handledPurchaseRefs.add(po.purchaseNumber.trim().toLowerCase());
		const rawTotal = Number.isFinite(Number(po.totalAmount)) ? Math.max(0, Number(po.totalAmount) * filterScale) : 0;
		let rawPaid;
		if (po.paymentStatus === "unpaid") rawPaid = 0;
		else if (po.paidAmount !== void 0 && po.paidAmount !== null) {
			const parsedPaid = Number(po.paidAmount);
			rawPaid = Number.isFinite(parsedPaid) ? parsedPaid * filterScale : 0;
		} else if (po.paymentStatus === "paid") rawPaid = rawTotal;
		else rawPaid = 0;
		const clampedPaidSource = Math.max(0, Math.min(rawTotal, rawPaid));
		const poTotalInTarget = roundCurrencyValue(convertCurrencyAmount(rawTotal, po.currency || "SDG", targetCurrency, liveRates));
		const paidInTarget = roundCurrencyValue(Math.max(0, Math.min(poTotalInTarget, convertCurrencyAmount(clampedPaidSource, po.currency || "SDG", targetCurrency, liveRates))));
		const unpaidInTarget = roundCurrencyValue(Math.max(0, poTotalInTarget - paidInTarget));
		purchaseCommitmentsTotal = roundCurrencyValue(purchaseCommitmentsTotal + poTotalInTarget);
		cashOutflowsForRestockPurchases = roundCurrencyValue(cashOutflowsForRestockPurchases + paidInTarget);
		accountsPayablePendingInvoices = roundCurrencyValue(accountsPayablePendingInvoices + unpaidInTarget);
	}
	for (const mov of dataset.stockMovements) {
		const movTime = new Date(mov.timestamp).getTime();
		if (movTime < window.startDate.getTime() || movTime > window.endDate.getTime()) continue;
		const prod = productsMap.get(mov.productId);
		if (filters.productId && filters.productId !== "all" && mov.productId !== filters.productId) continue;
		if (filters.category && filters.category !== "all" && prod?.category !== filters.category) continue;
		const movUnitCostInTarget = mov.unitCost !== void 0 && mov.unitCost > 0 ? convertCurrencyAmount(mov.unitCost, mov.currency || prod?.priceCurrency || "SDG", targetCurrency, liveRates) : prod ? getProductPricesInCurrency(prod, targetCurrency, liveRates).costPrice : 0;
		const absUnits = Math.abs(mov.quantityChange);
		const totalMovCost = roundCurrencyValue(absUnits * movUnitCostInTarget);
		if (mov.type === "damage" || mov.type === "loss") recordedShrinkageAndDamageExpense = roundCurrencyValue(recordedShrinkageAndDamageExpense + totalMovCost);
		else if (mov.type === "restock") {
			const refKey = (mov.referenceId || "").trim().toLowerCase();
			const invKey = (mov.invoiceNumber || "").trim().toLowerCase();
			if (refKey && handledPurchaseRefs.has(refKey) || invKey && handledPurchaseRefs.has(invKey)) continue;
			purchaseCommitmentsTotal = roundCurrencyValue(purchaseCommitmentsTotal + totalMovCost);
			if (mov.receiptMode === "goods_only") accountsPayablePendingInvoices = roundCurrencyValue(accountsPayablePendingInvoices + totalMovCost);
			else cashOutflowsForRestockPurchases = roundCurrencyValue(cashOutflowsForRestockPurchases + totalMovCost);
		}
	}
	let inventoryValuationAtCost = 0;
	let inventoryValuationAtRetail = 0;
	for (const prod of dataset.products) {
		if (filters.productId && filters.productId !== "all" && prod.id !== filters.productId) continue;
		if (filters.category && filters.category !== "all" && prod.category !== filters.category) continue;
		const prices = getProductPricesInCurrency(prod, targetCurrency, liveRates);
		const stockUnits = Math.max(0, prod.stock);
		inventoryValuationAtCost = roundCurrencyValue(inventoryValuationAtCost + stockUnits * prices.costPrice);
		inventoryValuationAtRetail = roundCurrencyValue(inventoryValuationAtRetail + stockUnits * prices.sellingPrice);
	}
	const potentialInventoryGrossProfit = roundCurrencyValue(Math.max(0, inventoryValuationAtRetail - inventoryValuationAtCost));
	const profitAfterRecordedShrinkage = roundCurrencyValue(grossProfit - recordedShrinkageAndDamageExpense);
	const profitAfterShrinkageMarginPercent = netSalesRevenue > 0 ? Math.round(profitAfterRecordedShrinkage / netSalesRevenue * 1e3) / 10 : 0;
	const hasFixedExpensesOverride = filters.fixedOperatingExpensesOverride !== void 0 && Number.isFinite(filters.fixedOperatingExpensesOverride) && Number(filters.fixedOperatingExpensesOverride) >= 0;
	const fixedOperatingExpenses = hasFixedExpensesOverride ? roundCurrencyValue(Number(filters.fixedOperatingExpensesOverride)) : null;
	const netOperatingProfit = fixedOperatingExpenses !== null ? roundCurrencyValue(profitAfterRecordedShrinkage - fixedOperatingExpenses) : null;
	const netProfitMarginPercent = netOperatingProfit !== null && netSalesRevenue > 0 ? Math.round(netOperatingProfit / netSalesRevenue * 1e3) / 10 : null;
	const netCashFlow = roundCurrencyValue(totalCashInflows - cashOutflowsForRestockPurchases);
	const collectionEfficiencyPercent = sales.summary.billedGrandTotal > 0 ? Math.min(100, Math.round(totalCashInflows / sales.summary.billedGrandTotal * 1e3) / 10) : 100;
	const contributionMargin = grossProfit;
	const contributionMarginRatio = netSalesRevenue > 0 ? Math.max(0, Math.round(grossProfit / netSalesRevenue * 1e3) / 1e3) : 0;
	const breakEvenSalesRevenue = fixedOperatingExpenses !== null && contributionMarginRatio > 0 ? roundCurrencyValue(fixedOperatingExpenses / contributionMarginRatio) : null;
	const surplusOrDeficitRevenue = breakEvenSalesRevenue !== null ? roundCurrencyValue(netSalesRevenue - breakEvenSalesRevenue) : null;
	const isAboveBreakEven = breakEvenSalesRevenue !== null ? netSalesRevenue >= breakEvenSalesRevenue : null;
	const unrealizedFxTranslationDelta = roundCurrencyValue(netSalesAtUsdIndexedRate - netSalesAtHistoricalRate);
	const fxPurchasingPowerPreservationPercent = netSalesAtUsdIndexedRate > 0 ? Math.round(netSalesAtHistoricalRate / netSalesAtUsdIndexedRate * 1e3) / 10 : 100;
	const isGrossProfitEstimated = sales.cogsDataQuality !== "exact_frozen_at_sale" && sales.cogsDataQuality !== "reconstructed_from_price_history";
	return {
		currency: targetCurrency,
		valuationMode,
		financialAccessStatus: "authorized",
		cogsDataQuality: sales.cogsDataQuality,
		periodStart: sales.periodStart,
		periodEnd: sales.periodEnd,
		profitAndLoss: {
			grossRevenueBilled: sales.summary.billedGrandTotal,
			grossSalesPreDiscount: sales.summary.grossSales,
			salesDiscounts: sales.summary.discountsTotal,
			merchandiseReturnsNet: sales.summary.merchandiseReturnsNetSales,
			voidedInvoicesExcluded: sales.summary.voidedSalesAmount,
			returnsAndVoids: sales.summary.returnedOrVoidedSales,
			taxesCollected: sales.summary.taxCollected,
			netSalesRevenue,
			costOfGoodsSold,
			exactHistoricalCogsPortion,
			estimatedCurrentCostCogsPortion,
			unresolvableCostRevenuePortion,
			cogsDataQuality: sales.cogsDataQuality,
			cogsStatusNoteEn: sales.cogsValuationNoteEn,
			cogsStatusNoteAr: sales.cogsValuationNoteAr,
			grossProfit,
			estimatedGrossProfit: grossProfit,
			grossProfitMarginPercent,
			isGrossProfitEstimated,
			recordedShrinkageAndDamageExpense,
			profitAfterRecordedShrinkage,
			profitAfterShrinkageMarginPercent,
			generalOperatingExpenses: fixedOperatingExpenses,
			generalOperatingExpensesStatus: hasFixedExpensesOverride ? "recorded" : "not_recorded_in_schema",
			generalOperatingExpensesNoteEn: hasFixedExpensesOverride ? "Fixed operating expenses provided via explicit analytical override parameter." : "General overhead expenses (rent, utilities, payroll) are not stored in the current POS schema. Profit After Recorded Shrinkage is reported explicitly; true Net Operating Profit is marked unavailable rather than fabricated.",
			generalOperatingExpensesNoteAr: hasFixedExpensesOverride ? "تم تزويد المصروفات التشغيلية الثابتة عبر مدخلات التحليل الصريحة." : "المصروفات التشغيلية العامة (الإيجار، المرافق، الرواتب) غير مسجلة في جدول مستقل بقاعدة البيانات الحالية؛ يتم عرض \"الربح بعد الفاقد المسجل\" بوضوح، بينما يُصنف \"صافي الربح التشغيلي\" كغير متاح بدلاً من تقديره بأرقام افتراضية.",
			operatingProfitStatus: hasFixedExpensesOverride ? "available" : "unavailable_missing_operating_expenses",
			netOperatingProfit,
			netProfitMarginPercent
		},
		cashFlowAndWorkingCapital: {
			cashInflowsFromSalesAtCheckout,
			cashInflowsFromDebtSettlements,
			cashRefundsForReturns,
			totalCashInflows,
			purchaseCommitmentsTotal,
			cashOutflowsForRestockPurchases,
			supplierCashOutflowStatus: "estimated_from_received_paid_restocks",
			supplierCashOutflowNoteEn: "Supplier cash outflows reflect received restock movements (goods_and_invoice) and paid purchase orders; goods_only receipts are tracked under Accounts Payable.",
			supplierCashOutflowNoteAr: "تعكس التدفقات النقدية الخارجة للموردين حركات التوريد المستلمة مع الفاتورة وأوامر الشراء المسددة، بينما تُسجل البضائع المستلمة بدون فاتورة ضمن الذمم الدائنة.",
			netCashFlow,
			accountsReceivableOutstandingDebt,
			accountsPayablePendingInvoices,
			inventoryValuationAtCost,
			inventoryValuationAtRetail,
			potentialInventoryGrossProfit,
			collectionEfficiencyPercent
		},
		breakEvenAnalysis: {
			status: hasFixedExpensesOverride ? "available" : "unavailable_missing_fixed_costs",
			fixedOperatingCosts: fixedOperatingExpenses,
			variableCostsCogs: costOfGoodsSold,
			contributionMargin,
			contributionMarginRatio,
			averageGrossMarginRatio: contributionMarginRatio,
			recordedShrinkageCosts: recordedShrinkageAndDamageExpense,
			breakEvenSalesRevenue,
			currentNetSalesRevenue: netSalesRevenue,
			surplusOrDeficitRevenue,
			isAboveBreakEven,
			noteEn: hasFixedExpensesOverride ? "Break-even sales revenue calculated as Fixed Operating Costs ÷ Contribution Margin Ratio." : "True accounting Break-Even Point requires Fixed Operating Costs (rent, salaries, utilities), which are not recorded in the current POS schema. Inventory restock purchases are capital asset additions, not fixed expenses.",
			noteAr: hasFixedExpensesOverride ? "تم احتساب إيراد نقطة التعادل وفق المعادلة المحاسبية: التكاليف التشغيلية الثابتة ÷ نسبة هامش المساهمة." : "يتطلب حساب نقطة التعادل المحاسبية الدقيقة توفر التكاليف التشغيلية الثابتة (الإيجار، الرواتب، المرافق)، وهي غير مسجلة في قاعدة البيانات الحالية. مشتريات إعادة تعبئة المخزون تُعد أصولاً متداولة وليست مصروفات تشغيلية ثابتة."
		},
		fxSensitivityAndValuation: {
			netSalesAtHistoricalRate,
			netSalesAtLiveRate,
			netSalesAtUsdIndexedRate,
			unrealizedFxTranslationDelta,
			fxPurchasingPowerPreservationPercent,
			anchorCurrency
		},
		categoryProfitability: sales.byCategory,
		productProfitability: sales.byProduct
	};
}
// src/analytics/calculations/inventory.metrics.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
/**
* Computes deduplicated pending inbound units per product from:
* 1. `dataset.purchases` where `status === 'ordered'`
* 2. `dataset.stockMovements` where `type === 'restock'` and `receiptMode === 'invoice_only'`
* Deduplicates by stable reference keys (`po.id`, `po.purchaseNumber`, `mov.referenceId`, `mov.invoiceNumber`).
*/
function computePendingInboundByProduct(dataset, filters) {
	const pendingInboundByProduct = /* @__PURE__ */ new Map();
	const handledInboundRefs = /* @__PURE__ */ new Set();
	const productsMap = new Map(dataset.products.map((p) => [p.id, p]));
	for (const po of dataset.purchases || []) {
		if (!po || po.status !== "ordered") continue;
		if (filters.branchId && filters.branchId !== "all" && po.branchId && po.branchId !== "all" && po.branchId !== filters.branchId) continue;
		if (po.id) handledInboundRefs.add(po.id.trim().toLowerCase());
		if (po.purchaseNumber) handledInboundRefs.add(po.purchaseNumber.trim().toLowerCase());
		for (const item of po.items || []) {
			if (filters.productId && filters.productId !== "all" && item.productId !== filters.productId) continue;
			if (filters.category && filters.category !== "all") {
				const prod = productsMap.get(item.productId);
				if (prod && prod.category !== filters.category) continue;
			}
			const qty = Math.max(0, Number(item.quantity) || 0);
			if (qty > 0) pendingInboundByProduct.set(item.productId, (pendingInboundByProduct.get(item.productId) || 0) + qty);
		}
	}
	for (const mov of dataset.stockMovements || []) {
		if (!mov || mov.type !== "restock" || mov.receiptMode !== "invoice_only") continue;
		const prod = productsMap.get(mov.productId);
		if (filters.productId && filters.productId !== "all" && mov.productId !== filters.productId) continue;
		if (filters.category && filters.category !== "all" && prod && prod.category !== filters.category) continue;
		const refKey = (mov.referenceId || "").trim().toLowerCase();
		const invKey = (mov.invoiceNumber || "").trim().toLowerCase();
		if (refKey && handledInboundRefs.has(refKey) || invKey && handledInboundRefs.has(invKey)) continue;
		const qty = Math.abs(Number(mov.quantityChange) || 0);
		if (qty > 0) pendingInboundByProduct.set(mov.productId, (pendingInboundByProduct.get(mov.productId) || 0) + qty);
	}
	return pendingInboundByProduct;
}
/**
* Computes comprehensive Inventory, ABC Classification, Reconstructed Cost-Based Stock Turnover,
* Unit Sell-Through Ratio, DOH, Pending Inbound Orders, and Reorder Analytics in O(Products + Transactions).
*/
function computeInventoryAnalytics(dataset, filters, precomputedSales, referenceDate = /* @__PURE__ */ new Date()) {
	const targetCurrency = filters.currency || "SDG";
	const abcBasis = filters.abcBasis || "revenue";
	const leadTimeDaysAssumed = Number.isFinite(filters.leadTimeDays) ? Math.max(1, Math.min(90, Number(filters.leadTimeDays))) : 3;
	const safetyStockDaysAssumed = Number.isFinite(filters.safetyStockDays) ? Math.max(1, Math.min(30, Number(filters.safetyStockDays))) : 2;
	const liveRates = {
		...DEFAULT_BASELINE_EXCHANGE_RATES,
		...dataset.exchangeRates || {},
		SDG: 1
	};
	const window = resolveAnalyticsDateWindow(filters, referenceDate);
	const sales = precomputedSales || computeSalesAnalytics(dataset, filters, referenceDate);
	const productsMap = new Map(dataset.products.map((p) => [p.id, p]));
	const scopedTxs = filterTransactionsByScope(dataset.transactions, productsMap, dataset.branches, filters);
	const windowStartMs = window.startDate.getTime();
	const windowEndMs = window.endDate.getTime();
	let earliestTxMs = windowEndMs;
	const lastSaleByProduct = /* @__PURE__ */ new Map();
	const baseStockUnitsSoldByProduct = /* @__PURE__ */ new Map();
	const returnedUnitsByProduct = /* @__PURE__ */ new Map();
	const matchedReturnIds = /* @__PURE__ */ new Set();
	for (const tx of scopedTxs) {
		if (tx.status !== "completed") continue;
		const tMs = new Date(tx.timestamp).getTime();
		if (isNaN(tMs)) continue;
		if (tMs < earliestTxMs) earliestTxMs = tMs;
		const inWin = tMs >= windowStartMs && tMs <= windowEndMs;
		for (const item of tx.items) {
			if (tMs > (lastSaleByProduct.get(item.productId) || 0)) lastSaleByProduct.set(item.productId, tMs);
			if (inWin) {
				const prod = productsMap.get(item.productId);
				let units = item.quantity;
				if (item.stockDeducted && item.stockDeducted > 0) units = item.stockDeducted;
				else if (item.saleUnit === "pack" && prod?.unitsPerPack && prod.unitsPerPack > 1) units = item.quantity * prod.unitsPerPack;
				baseStockUnitsSoldByProduct.set(item.productId, (baseStockUnitsSoldByProduct.get(item.productId) || 0) + units);
			}
		}
		if (inWin) {
			const txRets = resolveReturnsForTransaction(tx, dataset.returns || []);
			for (const ret of txRets) {
				if (ret.id) matchedReturnIds.add(ret.id);
				for (const rItem of ret.items || []) {
					const prod = productsMap.get(rItem.productId);
					const retBaseUnits = rItem.saleUnit === "pack" && prod?.unitsPerPack && prod.unitsPerPack > 1 ? Math.max(0, rItem.quantity) * prod.unitsPerPack : Math.max(0, rItem.quantity);
					returnedUnitsByProduct.set(rItem.productId, (returnedUnitsByProduct.get(rItem.productId) || 0) + retBaseUnits);
				}
			}
		}
	}
	for (const ret of dataset.returns || []) {
		if (ret.id && matchedReturnIds.has(ret.id)) continue;
		const rMs = ret.timestamp ? new Date(ret.timestamp).getTime() : windowStartMs;
		if (rMs < windowStartMs || rMs > windowEndMs) continue;
		for (const rItem of ret.items || []) {
			const prod = productsMap.get(rItem.productId);
			const retBaseUnits = rItem.saleUnit === "pack" && prod?.unitsPerPack && prod.unitsPerPack > 1 ? Math.max(0, rItem.quantity) * prod.unitsPerPack : Math.max(0, rItem.quantity);
			returnedUnitsByProduct.set(rItem.productId, (returnedUnitsByProduct.get(rItem.productId) || 0) + retBaseUnits);
		}
	}
	const observedSpanDays = Math.max(1, Math.ceil((windowEndMs - Math.max(windowStartMs, earliestTxMs)) / 864e5));
	const effectiveDemandDays = Math.max(1, Math.min(window.calendarDays, Math.max(7, observedSpanDays)));
	const salesByProductMap = new Map(sales.byProduct.map((p) => [p.id, p]));
	const shrinkageByProduct = /* @__PURE__ */ new Map();
	const restockByProduct = /* @__PURE__ */ new Map();
	const auditDeltaByProduct = /* @__PURE__ */ new Map();
	const pendingInboundByProduct = computePendingInboundByProduct(dataset, filters);
	const movementSummaryMap = /* @__PURE__ */ new Map([
		["restock", {
			count: 0,
			totalUnits: 0,
			estimatedValue: 0
		}],
		["sale", {
			count: 0,
			totalUnits: 0,
			estimatedValue: 0
		}],
		["damage", {
			count: 0,
			totalUnits: 0,
			estimatedValue: 0
		}],
		["loss", {
			count: 0,
			totalUnits: 0,
			estimatedValue: 0
		}],
		["audit", {
			count: 0,
			totalUnits: 0,
			estimatedValue: 0
		}]
	]);
	for (const mov of dataset.stockMovements) {
		const movMs = new Date(mov.timestamp).getTime();
		const prod = productsMap.get(mov.productId);
		if (filters.productId && filters.productId !== "all" && mov.productId !== filters.productId) continue;
		if (filters.category && filters.category !== "all" && prod?.category !== filters.category) continue;
		if (movMs < windowStartMs || movMs > windowEndMs) continue;
		const units = Math.abs(mov.quantityChange);
		const unitCost = mov.unitCost !== void 0 && mov.unitCost > 0 ? convertCurrencyAmount(mov.unitCost, mov.currency || prod?.priceCurrency || "SDG", targetCurrency, liveRates) : prod ? getProductPricesInCurrency(prod, targetCurrency, liveRates).costPrice : 0;
		const val = roundCurrencyValue(units * unitCost);
		const summaryItem = movementSummaryMap.get(mov.type) || {
			count: 0,
			totalUnits: 0,
			estimatedValue: 0
		};
		summaryItem.count += 1;
		summaryItem.totalUnits += units;
		summaryItem.estimatedValue = roundCurrencyValue(summaryItem.estimatedValue + val);
		movementSummaryMap.set(mov.type, summaryItem);
		if (mov.type === "damage" || mov.type === "loss") shrinkageByProduct.set(mov.productId, (shrinkageByProduct.get(mov.productId) || 0) + units);
		else if (mov.type === "restock" && mov.receiptMode !== "invoice_only") restockByProduct.set(mov.productId, (restockByProduct.get(mov.productId) || 0) + units);
		else if (mov.type === "audit") auditDeltaByProduct.set(mov.productId, (auditDeltaByProduct.get(mov.productId) || 0) + mov.quantityChange);
	}
	const sortedForAbc = [...dataset.products.filter((p) => {
		if (filters.productId && filters.productId !== "all" && p.id !== filters.productId) return false;
		if (filters.category && filters.category !== "all" && p.category !== filters.category) return false;
		return true;
	}).map((prod) => {
		const prices = getProductPricesInCurrency(prod, targetCurrency, liveRates);
		const prodSales = salesByProductMap.get(prod.id);
		const baseStockUnitsSold = baseStockUnitsSoldByProduct.get(prod.id) || 0;
		const returnedUnitsInPeriod = returnedUnitsByProduct.get(prod.id) || 0;
		const netBaseUnitsSold = Math.max(0, baseStockUnitsSold - returnedUnitsInPeriod);
		const unitsSoldInPeriod = netBaseUnitsSold > 0 ? netBaseUnitsSold : Math.max(0, prodSales?.unitsSold || 0);
		const netSalesInPeriod = prodSales?.netSales || 0;
		const cogsInPeriod = prodSales?.cogs ?? 0;
		const grossProfitInPeriod = prodSales?.grossProfit ?? 0;
		const currentStock = Math.max(0, prod.stock);
		const pendingInboundPurchaseUnits = pendingInboundByProduct.get(prod.id) || 0;
		const shrinkageUnits = shrinkageByProduct.get(prod.id) || 0;
		const restockedUnits = restockByProduct.get(prod.id) || 0;
		const auditDelta = auditDeltaByProduct.get(prod.id) || 0;
		const reconstructedBeginningStock = Math.max(0, currentStock + unitsSoldInPeriod - restockedUnits + shrinkageUnits - auditDelta);
		const averageStockUnits = Math.round((reconstructedBeginningStock + currentStock) / 2 * 100) / 100;
		const inventoryValueAtCost = roundCurrencyValue(currentStock * prices.costPrice);
		const averageInventoryValueAtCost = roundCurrencyValue(averageStockUnits * prices.costPrice);
		const inventoryValueAtRetail = roundCurrencyValue(currentStock * prices.sellingPrice);
		const averageDailyDemand = Math.round(unitsSoldInPeriod / effectiveDemandDays * 100) / 100;
		const costBasedStockTurnoverRatio = averageInventoryValueAtCost > 0 ? Math.round(cogsInPeriod / averageInventoryValueAtCost * 100) / 100 : cogsInPeriod > 0 && prices.costPrice > 0 ? Math.round(cogsInPeriod / roundCurrencyValue(Math.max(1, unitsSoldInPeriod * .5) * prices.costPrice) * 100) / 100 : 0;
		const estimatedUnitSellThroughRatio = averageStockUnits > 0 ? Math.round(unitsSoldInPeriod / averageStockUnits * 100) / 100 : unitsSoldInPeriod > 0 ? 1 : 0;
		const stockTurnoverRatio = costBasedStockTurnoverRatio !== null ? costBasedStockTurnoverRatio : estimatedUnitSellThroughRatio;
		const daysOfInventoryOnHand = averageDailyDemand > 0 ? Math.round(currentStock / averageDailyDemand * 10) / 10 : null;
		const lastSaleMs = lastSaleByProduct.get(prod.id);
		const daysSinceLastSale = lastSaleMs !== void 0 ? Math.max(0, Math.floor((referenceDate.getTime() - lastSaleMs) / 864e5)) : null;
		let stockStatus = "healthy";
		if (currentStock <= 0) stockStatus = "out_of_stock";
		else if (currentStock <= prod.minStockAlert) stockStatus = "low_stock";
		else if (daysOfInventoryOnHand !== null && daysOfInventoryOnHand > 60) stockStatus = "overstock";
		let movementVelocityClass = "moderate_moving";
		if (unitsSoldInPeriod === 0) movementVelocityClass = "dead_stock";
		else if (averageDailyDemand >= 1 || unitsSoldInPeriod >= 6) movementVelocityClass = "fast_moving";
		else if (averageDailyDemand < .35) movementVelocityClass = "slow_moving";
		const abcBasisValue = abcBasis === "gross_profit" ? Math.max(0, grossProfitInPeriod) : abcBasis === "consumption_value" ? Math.max(0, cogsInPeriod) : Math.max(0, netSalesInPeriod);
		const safetyStockUnits = Math.max(prod.minStockAlert, Math.ceil(averageDailyDemand * safetyStockDaysAssumed));
		const reorderPointUnits = Math.ceil(averageDailyDemand * leadTimeDaysAssumed) + safetyStockUnits;
		const effectiveAvailableStock = currentStock + pendingInboundPurchaseUnits;
		const shouldReorder = effectiveAvailableStock <= reorderPointUnits;
		const targetCycleStock = Math.max(reorderPointUnits + Math.ceil(averageDailyDemand * 7), prod.minStockAlert * 2);
		const recommendedOrderQuantity = shouldReorder ? Math.max(1, targetCycleStock - effectiveAvailableStock) : 0;
		const estimatedOrderCost = roundCurrencyValue(recommendedOrderQuantity * prices.costPrice);
		let urgency = "none";
		if (shouldReorder) {
			if (effectiveAvailableStock <= 0 || daysOfInventoryOnHand !== null && daysOfInventoryOnHand <= leadTimeDaysAssumed) urgency = "critical";
			else if (effectiveAvailableStock <= prod.minStockAlert) urgency = "high";
			else urgency = "medium";
		}
		let estimatedStockoutDate = null;
		let daysUntilStockout = null;
		if (averageDailyDemand > 0) {
			daysUntilStockout = Math.max(0, Math.round(currentStock / averageDailyDemand * 10) / 10);
			estimatedStockoutDate = toDateKey(new Date(referenceDate.getTime() + daysUntilStockout * 24 * 3600 * 1e3));
		}
		const explanationEn = shouldReorder ? `Available stock (${currentStock} on hand${pendingInboundPurchaseUnits > 0 ? ` + ${pendingInboundPurchaseUnits} inbound` : ""}) is at or below reorder threshold (${reorderPointUnits} units = ${leadTimeDaysAssumed}d lead time + ${safetyStockUnits} safety stock) at ${averageDailyDemand} units/day demand.` : `Available stock (${currentStock} on hand${pendingInboundPurchaseUnits > 0 ? ` + ${pendingInboundPurchaseUnits} inbound` : ""}) comfortably covers reorder point (${reorderPointUnits} units).`;
		const explanationAr = shouldReorder ? `الرصيد المتاح (${currentStock} بالمخزن${pendingInboundPurchaseUnits > 0 ? ` + ${pendingInboundPurchaseUnits} قيد التوريد` : ""}) وصل أو يقل عن نقطة إعادة الطلب (${reorderPointUnits} وحدة = ${leadTimeDaysAssumed} أيام توريد + ${safetyStockUnits} مخزون أمان) بمعدل سحب ${averageDailyDemand} وحدة/يوم.` : `الرصيد المتاح (${currentStock} بالمخزن${pendingInboundPurchaseUnits > 0 ? ` + ${pendingInboundPurchaseUnits} قيد التوريد` : ""}) يغطي نقطة إعادة الطلب (${reorderPointUnits} وحدة) بأمان.`;
		return {
			productId: prod.id,
			sku: prod.sku,
			name: prod.name,
			nameAr: prod.nameAr,
			category: prod.category,
			categoryAr: prod.categoryAr,
			currentStock,
			reconstructedBeginningStock,
			averageStockUnits,
			pendingInboundPurchaseUnits,
			minStockAlert: prod.minStockAlert,
			unitCost: prices.costPrice,
			unitSellingPrice: prices.sellingPrice,
			inventoryValueAtCost,
			averageInventoryValueAtCost,
			inventoryValueAtRetail,
			unitsSoldInPeriod,
			netSalesInPeriod,
			cogsInPeriod,
			grossProfitInPeriod,
			averageDailyDemand,
			costBasedStockTurnoverRatio,
			estimatedUnitSellThroughRatio,
			stockTurnoverRatio,
			turnoverFormulaUsed: "cogs_over_reconstructed_avg_inventory_cost",
			daysOfInventoryOnHand,
			daysSinceLastSale,
			stockStatus,
			movementVelocityClass,
			abcClass: "C",
			abcBasisValue,
			abcCumulativeSharePercent: 100,
			shrinkageUnitsInPeriod: shrinkageUnits,
			restockedUnitsInPeriod: restockedUnits,
			reorderRecommendation: {
				shouldReorder,
				urgency,
				reorderPointUnits,
				safetyStockUnits,
				leadTimeDaysAssumed,
				pendingInboundUnitsDeducted: pendingInboundPurchaseUnits,
				recommendedOrderQuantity,
				estimatedOrderCost,
				estimatedStockoutDate,
				daysUntilStockout,
				explanationEn,
				explanationAr,
				approvalStatus: "requires_user_approval"
			}
		};
	})].sort((a, b) => b.abcBasisValue - a.abcBasisValue || (b.inventoryValueAtCost ?? 0) - (a.inventoryValueAtCost ?? 0));
	const totalAbcValue = sortedForAbc.reduce((acc, it) => acc + it.abcBasisValue, 0);
	let cumulativeValue = 0;
	let classACount = 0;
	let classBCount = 0;
	let classCCount = 0;
	let classAVal = 0;
	let classBVal = 0;
	let classCVal = 0;
	for (let i = 0; i < sortedForAbc.length; i++) {
		const item = sortedForAbc[i];
		const prevCumPct = totalAbcValue > 0 ? cumulativeValue / totalAbcValue * 100 : 100;
		cumulativeValue += item.abcBasisValue;
		item.abcCumulativeSharePercent = totalAbcValue > 0 ? Math.min(100, Math.round(cumulativeValue / totalAbcValue * 1e3) / 10) : 100;
		if (item.abcBasisValue > 0 && (prevCumPct < 75 || i === 0)) {
			item.abcClass = "A";
			classACount += 1;
			classAVal += item.abcBasisValue;
		} else if (item.abcBasisValue > 0 && prevCumPct < 92) {
			item.abcClass = "B";
			classBCount += 1;
			classBVal += item.abcBasisValue;
		} else {
			item.abcClass = "C";
			classCCount += 1;
			classCVal += item.abcBasisValue;
		}
	}
	const totalSkus = sortedForAbc.length;
	const totalStockUnits = sortedForAbc.reduce((acc, it) => acc + it.currentStock, 0);
	const totalPendingInboundUnits = sortedForAbc.reduce((acc, it) => acc + it.pendingInboundPurchaseUnits, 0);
	const totalInventoryValueAtCost = roundCurrencyValue(sortedForAbc.reduce((acc, it) => acc + (it.inventoryValueAtCost ?? 0), 0));
	const totalAverageInventoryValueAtCost = roundCurrencyValue(sortedForAbc.reduce((acc, it) => acc + (it.averageInventoryValueAtCost ?? 0), 0));
	const totalInventoryValueAtRetail = roundCurrencyValue(sortedForAbc.reduce((acc, it) => acc + it.inventoryValueAtRetail, 0));
	const totalCogs = roundCurrencyValue(sortedForAbc.reduce((acc, it) => acc + (it.cogsInPeriod ?? 0), 0));
	const totalUnitsSold = sortedForAbc.reduce((acc, it) => acc + it.unitsSoldInPeriod, 0);
	const totalAvgUnits = sortedForAbc.reduce((acc, it) => acc + it.averageStockUnits, 0);
	const overallCostBasedTurnoverRatio = totalAverageInventoryValueAtCost > 0 ? Math.round(totalCogs / totalAverageInventoryValueAtCost * 100) / 100 : 0;
	const overallUnitSellThroughRatio = totalAvgUnits > 0 ? Math.round(totalUnitsSold / totalAvgUnits * 100) / 100 : 0;
	const overallStockTurnoverRatio = overallCostBasedTurnoverRatio;
	const totalDailyDemand = sortedForAbc.reduce((acc, it) => acc + it.averageDailyDemand, 0);
	const overallDaysOfInventoryOnHand = totalDailyDemand > 0 ? Math.round(totalStockUnits / totalDailyDemand * 10) / 10 : null;
	const shrinkageStat = movementSummaryMap.get("damage") || {
		count: 0,
		totalUnits: 0,
		estimatedValue: 0
	};
	const lossStat = movementSummaryMap.get("loss") || {
		count: 0,
		totalUnits: 0,
		estimatedValue: 0
	};
	const restockStat = movementSummaryMap.get("restock") || {
		count: 0,
		totalUnits: 0,
		estimatedValue: 0
	};
	return {
		currency: targetCurrency,
		costAccessStatus: "authorized",
		abcBasis,
		leadTimeDaysAssumed,
		safetyStockDaysAssumed,
		valuationMethod: "standard_unit_cost_replacement",
		turnoverCalculationBasis: "reconstructed_average_inventory_cost",
		turnoverMethodologyNoteEn: "Cost-based turnover is computed as COGS ÷ Reconstructed Average Inventory Value at Cost ((Beginning + Ending) / 2). Unit sell-through ratio is reported separately.",
		turnoverMethodologyNoteAr: "يُحسب معدل دوران المخزون المالي بقسمة تكلفة البضاعة المباعة على متوسط قيمة المخزون بالتكلفة ((الافتتاحي + الختامي) ÷ 2)، مع عرض نسبة تصريف الوحدات بشكل مستقل.",
		valuationMethodNoteEn: "Inventory is valued using each product’s current unit cost (Standard / Replacement Cost method), converted to the active reporting currency.",
		valuationMethodNoteAr: "يتم تقييم المخزون باستخدام تكلفة الوحدة القياسية/الحالية لكل منتج محولة إلى عملة التقرير النشطة.",
		summary: {
			totalSkus,
			totalStockUnits,
			totalPendingInboundUnits,
			totalInventoryValueAtCost,
			totalAverageInventoryValueAtCost,
			totalInventoryValueAtRetail,
			overallCostBasedTurnoverRatio,
			overallUnitSellThroughRatio,
			overallStockTurnoverRatio,
			overallDaysOfInventoryOnHand,
			healthySkusCount: sortedForAbc.filter((i) => i.stockStatus === "healthy").length,
			lowStockSkusCount: sortedForAbc.filter((i) => i.stockStatus === "low_stock").length,
			outOfStockSkusCount: sortedForAbc.filter((i) => i.stockStatus === "out_of_stock").length,
			overstockSkusCount: sortedForAbc.filter((i) => i.stockStatus === "overstock").length,
			fastMovingCount: sortedForAbc.filter((i) => i.movementVelocityClass === "fast_moving").length,
			slowMovingCount: sortedForAbc.filter((i) => i.movementVelocityClass === "slow_moving").length,
			deadStockCount: sortedForAbc.filter((i) => i.movementVelocityClass === "dead_stock").length,
			shrinkageUnitsTotal: shrinkageStat.totalUnits + lossStat.totalUnits,
			shrinkageCostTotal: roundCurrencyValue(shrinkageStat.estimatedValue + lossStat.estimatedValue),
			restockUnitsTotal: restockStat.totalUnits,
			restockCostTotal: restockStat.estimatedValue,
			reorderActionRequiredCount: sortedForAbc.filter((i) => i.reorderRecommendation.shouldReorder).length,
			totalRecommendedOrderCost: roundCurrencyValue(sortedForAbc.reduce((acc, i) => acc + (i.reorderRecommendation.estimatedOrderCost ?? 0), 0))
		},
		abcSummary: {
			classA: {
				count: classACount,
				valueSharePercent: totalAbcValue > 0 ? Math.round(classAVal / totalAbcValue * 1e3) / 10 : 0,
				skuSharePercent: totalSkus > 0 ? Math.round(classACount / totalSkus * 1e3) / 10 : 0
			},
			classB: {
				count: classBCount,
				valueSharePercent: totalAbcValue > 0 ? Math.round(classBVal / totalAbcValue * 1e3) / 10 : 0,
				skuSharePercent: totalSkus > 0 ? Math.round(classBCount / totalSkus * 1e3) / 10 : 0
			},
			classC: {
				count: classCCount,
				valueSharePercent: totalAbcValue > 0 ? Math.round(classCVal / totalAbcValue * 1e3) / 10 : 0,
				skuSharePercent: totalSkus > 0 ? Math.round(classCCount / totalSkus * 1e3) / 10 : 0
			}
		},
		products: sortedForAbc,
		recentMovementsSummary: Array.from(movementSummaryMap.entries()).map(([type, stat]) => ({
			type,
			count: stat.count,
			totalUnits: stat.totalUnits,
			estimatedValue: stat.estimatedValue
		}))
	};
}
// src/analytics/calculations/customer-branch.metrics.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
/**
* Computes Customer Analytics (RFM/retention segmentation, top buyers, credit/debt exposure),
* deducting returned invoice amounts for exact reconciliation.
*/
function computeCustomerAnalytics(dataset, filters, referenceDate = /* @__PURE__ */ new Date()) {
	const targetCurrency = filters.currency || "SDG";
	const valuationMode = filters.valuationMode || "historical";
	const anchorCurrency = filters.anchorCurrency || "USD";
	const liveRates = {
		...DEFAULT_BASELINE_EXCHANGE_RATES,
		...dataset.exchangeRates || {},
		SDG: 1
	};
	const window = resolveAnalyticsDateWindow(filters, referenceDate);
	const productsMap = new Map(dataset.products.map((p) => [p.id, p]));
	const scopedTx = filterTransactionsByScope(dataset.transactions, productsMap, dataset.branches, filters).filter((tx) => {
		const tMs = new Date(tx.timestamp).getTime();
		return tx.status === "completed" && tMs >= window.startDate.getTime() && tMs <= window.endDate.getTime();
	});
	const customerStatsMap = /* @__PURE__ */ new Map();
	for (const c of dataset.customers) customerStatsMap.set(c.id, {
		periodCount: 0,
		periodNetSpend: 0,
		periodBilledTotal: 0,
		outstandingDebt: 0,
		lastPurchaseMs: null
	});
	let walkInTransactionsCount = 0;
	let registeredCustomerTransactionsCount = 0;
	let registeredNetRevenue = 0;
	let totalNetRevenue = 0;
	for (const tx of scopedTx) {
		const view = getConvertedTransactionView(tx, targetCurrency, liveRates, valuationMode, anchorCurrency);
		const txReturns = resolveReturnsForTransaction(tx, dataset.returns || []);
		let rawRefundInTxCurrency = 0;
		for (const ret of txReturns) if (Array.isArray(ret.items) && ret.items.length > 0) for (const ri of ret.items) rawRefundInTxCurrency = roundCurrencyValue(rawRefundInTxCurrency + Math.max(0, ri.refundAmount));
		else if (ret.refundTotal > 0) rawRefundInTxCurrency = roundCurrencyValue(rawRefundInTxCurrency + ret.refundTotal);
		const txToTargetFactor = tx.grandTotal > 0 ? view.grandTotal / tx.grandTotal : 1;
		const grossReturnBilled = Math.min(view.grandTotal, roundCurrencyValue(rawRefundInTxCurrency * txToTargetFactor));
		const txNetBeforeReturn = Math.max(0, roundCurrencyValue(view.subtotal - view.discountAmount));
		const netToBilledRatio = view.grandTotal > 0 ? txNetBeforeReturn / view.grandTotal : 1;
		const netReturnAmount = roundCurrencyValue(grossReturnBilled * netToBilledRatio);
		const txNet = Math.max(0, roundCurrencyValue(txNetBeforeReturn - netReturnAmount));
		const txBilledNet = Math.max(0, roundCurrencyValue(view.grandTotal - grossReturnBilled));
		totalNetRevenue = roundCurrencyValue(totalNetRevenue + txNet);
		if (tx.customerId && customerStatsMap.has(tx.customerId)) {
			registeredCustomerTransactionsCount += 1;
			registeredNetRevenue = roundCurrencyValue(registeredNetRevenue + txNet);
			const stat = customerStatsMap.get(tx.customerId);
			stat.periodCount += 1;
			stat.periodNetSpend = roundCurrencyValue(stat.periodNetSpend + txNet);
			stat.periodBilledTotal = roundCurrencyValue(stat.periodBilledTotal + txBilledNet);
			const remainingDebt = Math.max(0, roundCurrencyValue(view.debtAmount - Math.max(0, grossReturnBilled - view.amountPaid)));
			stat.outstandingDebt = roundCurrencyValue(stat.outstandingDebt + remainingDebt);
			const tMs = new Date(tx.timestamp).getTime();
			if (!isNaN(tMs) && (stat.lastPurchaseMs === null || tMs > stat.lastPurchaseMs)) stat.lastPurchaseMs = tMs;
		} else walkInTransactionsCount += 1;
	}
	for (const tx of dataset.transactions) {
		if (tx.status !== "completed" || !tx.customerId || !customerStatsMap.has(tx.customerId)) continue;
		const tMs = new Date(tx.timestamp).getTime();
		const stat = customerStatsMap.get(tx.customerId);
		if (!isNaN(tMs) && (stat.lastPurchaseMs === null || tMs > stat.lastPurchaseMs)) stat.lastPurchaseMs = tMs;
		if (tMs < window.startDate.getTime() || tMs > window.endDate.getTime()) {
			const view = getConvertedTransactionView(tx, targetCurrency, liveRates, valuationMode, anchorCurrency);
			stat.outstandingDebt = roundCurrencyValue(stat.outstandingDebt + view.debtAmount);
		}
	}
	const segmentLabels = {
		vip_champion: {
			en: "VIP Champion",
			ar: "عميل مميز (VIP)"
		},
		repeat_loyal: {
			en: "Repeat Loyal",
			ar: "عميل دائم ومتكرر"
		},
		credit_risk: {
			en: "Credit / Debt Follow-up",
			ar: "مديونية تحتاج متابعة"
		},
		new_active: {
			en: "New / Active Buyer",
			ar: "عميل نشط حديثاً"
		},
		at_risk_inactive: {
			en: "Inactive / At Risk",
			ar: "غير نشط خلال الفترة"
		}
	};
	const customerItems = dataset.customers.map((c) => {
		const stat = customerStatsMap.get(c.id);
		const baseLifetimeInTarget = convertCurrencyAmount(c.totalSpent || 0, "SDG", targetCurrency, liveRates);
		const lifetimeSpend = Math.max(stat.periodBilledTotal, baseLifetimeInTarget);
		const lifetimeTransactionCount = Math.max(stat.periodCount, c.transactionCount || 0);
		const averagePurchaseValue = stat.periodCount > 0 ? roundCurrencyValue(stat.periodBilledTotal / stat.periodCount) : lifetimeTransactionCount > 0 ? roundCurrencyValue(lifetimeSpend / lifetimeTransactionCount) : 0;
		const daysSinceLastPurchase = stat.lastPurchaseMs !== null ? Math.max(0, Math.floor((referenceDate.getTime() - stat.lastPurchaseMs) / 864e5)) : null;
		let segment = "new_active";
		if (stat.outstandingDebt > 0 && stat.outstandingDebt >= stat.periodBilledTotal * .25) segment = "credit_risk";
		else if (stat.periodCount >= 2 && stat.periodBilledTotal >= 50) segment = "vip_champion";
		else if (stat.periodCount >= 2 || lifetimeTransactionCount >= 10) segment = "repeat_loyal";
		else if (stat.periodCount === 0) segment = "at_risk_inactive";
		return {
			customerId: c.id,
			name: c.name,
			phone: c.phone,
			periodPurchaseCount: stat.periodCount,
			periodNetSpend: stat.periodNetSpend,
			periodBilledTotal: stat.periodBilledTotal,
			lifetimeSpend,
			lifetimeTransactionCount,
			averagePurchaseValue,
			outstandingDebt: stat.outstandingDebt,
			daysSinceLastPurchase,
			segment,
			segmentLabelEn: segmentLabels[segment].en,
			segmentLabelAr: segmentLabels[segment].ar
		};
	});
	const activeCustomersInPeriod = customerItems.filter((c) => c.periodPurchaseCount > 0).length;
	const repeatCustomersCount = customerItems.filter((c) => c.periodPurchaseCount >= 2 || c.lifetimeTransactionCount >= 2).length;
	const repeatPurchaseRatePercent = dataset.customers.length > 0 ? Math.round(repeatCustomersCount / dataset.customers.length * 1e3) / 10 : 0;
	const registeredRevenueSharePercent = totalNetRevenue > 0 ? Math.round(registeredNetRevenue / totalNetRevenue * 1e3) / 10 : 0;
	const totalCustomerDebt = roundCurrencyValue(customerItems.reduce((acc, c) => acc + c.outstandingDebt, 0));
	const customersWithDebtCount = customerItems.filter((c) => c.outstandingDebt > 0).length;
	const averageCustomerSpend = activeCustomersInPeriod > 0 ? roundCurrencyValue(customerItems.reduce((acc, c) => acc + c.periodBilledTotal, 0) / activeCustomersInPeriod) : 0;
	const segmentationCounts = [
		"vip_champion",
		"repeat_loyal",
		"credit_risk",
		"new_active",
		"at_risk_inactive"
	].map((seg) => {
		const matching = customerItems.filter((c) => c.segment === seg);
		return {
			segment: seg,
			labelEn: segmentLabels[seg].en,
			labelAr: segmentLabels[seg].ar,
			count: matching.length,
			totalSpend: roundCurrencyValue(matching.reduce((acc, c) => acc + c.periodBilledTotal, 0)),
			totalDebt: roundCurrencyValue(matching.reduce((acc, c) => acc + c.outstandingDebt, 0))
		};
	});
	return {
		currency: targetCurrency,
		piiAccessStatus: "authorized",
		summary: {
			totalRegisteredCustomers: dataset.customers.length,
			activeCustomersInPeriod,
			repeatCustomersCount,
			repeatPurchaseRatePercent,
			walkInTransactionsCount,
			registeredCustomerTransactionsCount,
			registeredRevenueSharePercent,
			totalCustomerDebt,
			customersWithDebtCount,
			averageCustomerSpend
		},
		topCustomers: [...customerItems].sort((a, b) => b.periodBilledTotal - a.periodBilledTotal || b.lifetimeSpend - a.lifetimeSpend),
		creditExposureRanking: [...customerItems].filter((c) => c.outstandingDebt > 0).sort((a, b) => b.outstandingDebt - a.outstandingDebt),
		segmentationCounts
	};
}
/**
* Computes Multi-Branch Performance Comparison Analytics.
*/
function computeBranchAnalytics(dataset, filters, referenceDate = /* @__PURE__ */ new Date()) {
	const targetCurrency = filters.currency || "SDG";
	const valuationMode = filters.valuationMode || "historical";
	const anchorCurrency = filters.anchorCurrency || "USD";
	const liveRates = {
		...DEFAULT_BASELINE_EXCHANGE_RATES,
		...dataset.exchangeRates || {},
		SDG: 1
	};
	const window = resolveAnalyticsDateWindow(filters, referenceDate);
	const productsMap = new Map(dataset.products.map((p) => [p.id, p]));
	const branchStats = /* @__PURE__ */ new Map();
	for (const b of dataset.branches) {
		if (filters.branchId && filters.branchId !== "all" && b.id !== filters.branchId) continue;
		branchStats.set(b.id, {
			branchId: b.id,
			branchName: b.name,
			branchNameAr: b.nameAr,
			branchCode: b.code,
			grossSales: 0,
			netSales: 0,
			billedTotal: 0,
			collectedTotal: 0,
			cogs: 0,
			transactionCount: 0,
			unitsSold: 0,
			outstandingDebt: 0,
			cashiersSet: /* @__PURE__ */ new Set()
		});
	}
	for (const tx of dataset.transactions) {
		if (tx.status !== "completed") continue;
		const tMs = new Date(tx.timestamp).getTime();
		if (tMs < window.startDate.getTime() || tMs > window.endDate.getTime()) continue;
		const branchInfo = resolveTransactionBranch(tx, dataset.branches);
		if (filters.branchId && filters.branchId !== "all" && branchInfo.id !== filters.branchId) continue;
		const stat = branchStats.get(branchInfo.id);
		if (!stat) continue;
		const view = getConvertedTransactionView(tx, targetCurrency, liveRates, valuationMode, anchorCurrency);
		const snapshotRates = valuationMode === "historical" ? {
			...DEFAULT_BASELINE_EXCHANGE_RATES,
			...tx.exchangeRatesSnapshot || {},
			SDG: 1
		} : liveRates;
		const txReturns = resolveReturnsForTransaction(tx, dataset.returns || []);
		const returnedQtyByProduct = /* @__PURE__ */ new Map();
		let rawRefundInTxCurrency = 0;
		for (const ret of txReturns) if (Array.isArray(ret.items) && ret.items.length > 0) for (const ri of ret.items) {
			returnedQtyByProduct.set(ri.productId, (returnedQtyByProduct.get(ri.productId) || 0) + Math.max(0, ri.quantity));
			rawRefundInTxCurrency = roundCurrencyValue(rawRefundInTxCurrency + Math.max(0, ri.refundAmount));
		}
		else if (ret.refundTotal > 0) rawRefundInTxCurrency = roundCurrencyValue(rawRefundInTxCurrency + ret.refundTotal);
		const txToTargetFactor = tx.grandTotal > 0 ? view.grandTotal / tx.grandTotal : 1;
		const grossReturnBilled = Math.min(view.grandTotal, roundCurrencyValue(rawRefundInTxCurrency * txToTargetFactor));
		const txNetBeforeReturn = Math.max(0, roundCurrencyValue(view.subtotal - view.discountAmount));
		const netToBilledRatio = view.grandTotal > 0 ? txNetBeforeReturn / view.grandTotal : 1;
		const netReturnAmount = roundCurrencyValue(grossReturnBilled * netToBilledRatio);
		const txNet = Math.max(0, roundCurrencyValue(txNetBeforeReturn - netReturnAmount));
		let txCogs = 0;
		let txUnits = 0;
		for (const item of tx.items) {
			const costRes = resolveHistoricalLineItemCost(item, productsMap.get(item.productId), tx.timestamp, targetCurrency, snapshotRates);
			const retQty = Math.min(item.quantity, returnedQtyByProduct.get(item.productId) || 0);
			const netQty = Math.max(0, item.quantity - retQty);
			txCogs = roundCurrencyValue(txCogs + costRes.unitCostResolved * netQty);
			txUnits += netQty;
		}
		stat.grossSales = roundCurrencyValue(stat.grossSales + view.subtotal);
		stat.netSales = roundCurrencyValue(stat.netSales + txNet);
		stat.billedTotal = roundCurrencyValue(stat.billedTotal + Math.max(0, view.grandTotal - grossReturnBilled));
		stat.collectedTotal = roundCurrencyValue(stat.collectedTotal + Math.max(0, view.amountPaid - Math.min(view.amountPaid, grossReturnBilled)));
		stat.cogs = roundCurrencyValue(stat.cogs + txCogs);
		stat.transactionCount += 1;
		stat.unitsSold += txUnits;
		stat.outstandingDebt = roundCurrencyValue(stat.outstandingDebt + Math.max(0, view.debtAmount - Math.max(0, grossReturnBilled - view.amountPaid)));
		if (tx.cashierName) stat.cashiersSet.add(tx.cashierName);
	}
	const totalNetAcrossBranches = Array.from(branchStats.values()).reduce((acc, b) => acc + b.netSales, 0);
	const sortedBranches = Array.from(branchStats.values()).map((b) => {
		const grossProfit = roundCurrencyValue(b.netSales - b.cogs);
		const grossMarginPercent = b.netSales > 0 ? Math.round(grossProfit / b.netSales * 1e3) / 10 : 0;
		const averageTransactionValue = b.transactionCount > 0 ? roundCurrencyValue(b.netSales / b.transactionCount) : 0;
		const collectionRatePercent = b.billedTotal > 0 ? Math.round(b.collectedTotal / b.billedTotal * 1e3) / 10 : 100;
		const revenueSharePercent = totalNetAcrossBranches > 0 ? Math.round(b.netSales / totalNetAcrossBranches * 1e3) / 10 : 0;
		return {
			branchId: b.branchId,
			branchName: b.branchName,
			branchNameAr: b.branchNameAr,
			branchCode: b.branchCode,
			grossSales: b.grossSales,
			netSales: b.netSales,
			cogs: b.cogs,
			grossProfit,
			grossMarginPercent,
			transactionCount: b.transactionCount,
			unitsSold: b.unitsSold,
			averageTransactionValue,
			outstandingDebt: b.outstandingDebt,
			collectionRatePercent,
			activeCashiersCount: Math.max(1, b.cashiersSet.size),
			revenueSharePercent,
			rank: 1
		};
	}).sort((a, b) => b.netSales - a.netSales);
	sortedBranches.forEach((b, idx) => {
		b.rank = idx + 1;
	});
	return {
		currency: targetCurrency,
		costAccessStatus: "authorized",
		branches: sortedBranches,
		topBranchId: sortedBranches[0]?.branchId || null
	};
}
// src/analytics/indicators/technical-analysis.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
/**
* Computes Simple Moving Average (SMA) for a numeric array over a given period N.
* Returns null for indices < period - 1.
*/
function computeSMA(values, period) {
	if (period <= 0) return values.map(() => null);
	const result = [];
	let windowSum = 0;
	for (let i = 0; i < values.length; i++) {
		windowSum += values[i];
		if (i >= period) windowSum -= values[i - period];
		if (i >= period - 1) result.push(roundCurrencyValue(windowSum / period));
		else result.push(null);
	}
	return result;
}
/**
* Computes Exponential Moving Average (EMA) for a numeric array over a given period N.
* Uses standard smoothing multiplier k = 2 / (period + 1), seeded with the initial N-period SMA.
*/
function computeEMA(values, period) {
	if (period <= 0 || values.length < period) return values.map(() => null);
	const k = 2 / (period + 1);
	const result = [];
	let sum = 0;
	for (let i = 0; i < values.length; i++) if (i < period - 1) {
		sum += values[i];
		result.push(null);
	} else if (i === period - 1) {
		sum += values[i];
		const initialSma = sum / period;
		result.push(roundCurrencyValue(initialSma));
	} else {
		const prevEma = result[i - 1];
		const nextEma = values[i] * k + prevEma * (1 - k);
		result.push(roundCurrencyValue(nextEma));
	}
	return result;
}
/**
* Computes Wilder's Relative Strength Index (RSI) over a given period (standard: 14).
* Requires at least period + 1 data points.
*/
function computeRSI(values, period = 14) {
	if (period <= 0 || values.length < period + 1) return values.map(() => null);
	const result = new Array(values.length).fill(null);
	let gainSum = 0;
	let lossSum = 0;
	for (let i = 1; i <= period; i++) {
		const diff = values[i] - values[i - 1];
		if (diff > 0) gainSum += diff;
		else lossSum += Math.abs(diff);
	}
	let avgGain = gainSum / period;
	let avgLoss = lossSum / period;
	const calcRsiVal = (g, l) => {
		if (l === 0 && g === 0) return 50;
		if (l === 0) return 100;
		const rs = g / l;
		return Math.round((100 - 100 / (1 + rs)) * 10) / 10;
	};
	result[period] = calcRsiVal(avgGain, avgLoss);
	for (let i = period + 1; i < values.length; i++) {
		const diff = values[i] - values[i - 1];
		const currentGain = diff > 0 ? diff : 0;
		const currentLoss = diff < 0 ? Math.abs(diff) : 0;
		avgGain = (avgGain * (period - 1) + currentGain) / period;
		avgLoss = (avgLoss * (period - 1) + currentLoss) / period;
		result[i] = calcRsiVal(avgGain, avgLoss);
	}
	return result;
}
/**
* Computes MACD (12, 26, 9):
* - macdLine = EMA(12) - EMA(26)
* - signalLine = EMA(9) of macdLine
* - histogram = macdLine - signalLine
*/
function computeMACD(values, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
	const emaFast = computeEMA(values, fastPeriod);
	const emaSlow = computeEMA(values, slowPeriod);
	const macdLine = [];
	const validMacdValues = [];
	const validMacdIndices = [];
	for (let i = 0; i < values.length; i++) if (emaFast[i] !== null && emaSlow[i] !== null) {
		const m = roundCurrencyValue(emaFast[i] - emaSlow[i]);
		macdLine.push(m);
		validMacdValues.push(m);
		validMacdIndices.push(i);
	} else macdLine.push(null);
	const signalLine = new Array(values.length).fill(null);
	const histogram = new Array(values.length).fill(null);
	if (validMacdValues.length >= signalPeriod) {
		const rawSignal = computeEMA(validMacdValues, signalPeriod);
		for (let j = 0; j < validMacdValues.length; j++) {
			const origIdx = validMacdIndices[j];
			const sig = rawSignal[j];
			signalLine[origIdx] = sig;
			if (sig !== null && macdLine[origIdx] !== null) histogram[origIdx] = roundCurrencyValue(macdLine[origIdx] - sig);
		}
	}
	return {
		macdLine,
		signalLine,
		histogram
	};
}
/**
* Computes ordinary least-squares (OLS) linear regression trendline y = slope * x + intercept.
*/
function computeLinearRegressionTrend(values) {
	const n = values.length;
	if (n === 0) return {
		slope: 0,
		intercept: 0,
		fittedValues: [],
		direction: "flat"
	};
	if (n === 1) return {
		slope: 0,
		intercept: values[0],
		fittedValues: [values[0]],
		direction: "flat"
	};
	let sumX = 0;
	let sumY = 0;
	let sumXY = 0;
	let sumXX = 0;
	for (let i = 0; i < n; i++) {
		sumX += i;
		sumY += values[i];
		sumXY += i * values[i];
		sumXX += i * i;
	}
	const denominator = n * sumXX - sumX * sumX;
	const slope = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;
	const intercept = (sumY - slope * sumX) / n;
	const fittedValues = values.map((_, i) => Math.max(0, roundCurrencyValue(slope * i + intercept)));
	const avgVal = sumY / n;
	const normalizedSlope = avgVal > 0 ? slope / avgVal : slope;
	const direction = normalizedSlope > .015 ? "upward" : normalizedSlope < -.015 ? "downward" : "flat";
	return {
		slope: roundCurrencyValue(slope),
		intercept: roundCurrencyValue(intercept),
		fittedValues,
		direction
	};
}
/**
* Computes historical Support (baseline floor, 20th percentile of active sales days)
* and Resistance (peak ceiling, 85th percentile of active sales days).
*/
function computeSupportAndResistance(values) {
	const nonZero = values.filter((v) => v > 0).sort((a, b) => a - b);
	if (nonZero.length === 0) return {
		supportFloor: 0,
		resistanceCeiling: 0
	};
	if (nonZero.length === 1) return {
		supportFloor: nonZero[0],
		resistanceCeiling: nonZero[0]
	};
	const p20Idx = Math.max(0, Math.floor((nonZero.length - 1) * .2));
	const p85Idx = Math.min(nonZero.length - 1, Math.ceil((nonZero.length - 1) * .85));
	return {
		supportFloor: roundCurrencyValue(nonZero[p20Idx]),
		resistanceCeiling: roundCurrencyValue(nonZero[p85Idx])
	};
}
/**
* Computes the complete Technical Analysis suite adapted for Retail Business Data.
*/
function computeTechnicalIndicators(dataset, filters, precomputedSales, referenceDate = /* @__PURE__ */ new Date()) {
	const targetCurrency = filters.currency || "SDG";
	const missingDateStrategy = filters.missingDateStrategy || "zero_fill";
	const sales = precomputedSales || computeSalesAnalytics(dataset, filters, referenceDate);
	const rawDaily = sales.dailySeries;
	const activeDaily = rawDaily.filter((d) => d.netSales > 0 || d.transactionCount > 0);
	const effectiveDaily = missingDateStrategy === "skip_missing" && activeDaily.length > 0 ? activeDaily : rawDaily;
	const values = effectiveDaily.map((d) => d.netSales);
	const sma7Arr = computeSMA(values, 7);
	const sma30Arr = computeSMA(values, 30);
	const sma90Arr = computeSMA(values, 90);
	const ema7Arr = computeEMA(values, 7);
	const ema30Arr = computeEMA(values, 30);
	const rsi14Arr = computeRSI(values, 14);
	const rsi7Arr = computeRSI(values, 6);
	const macdObj = computeMACD(values, 12, 26, 9);
	const trendObj = computeLinearRegressionTrend(values);
	const srObj = computeSupportAndResistance(values);
	const series = effectiveDaily.map((d, i) => ({
		dateKey: d.dateKey,
		label: d.label,
		value: d.netSales,
		unitsSold: d.unitsSold,
		transactionCount: d.transactionCount,
		sma7: sma7Arr[i],
		sma30: sma30Arr[i],
		sma90: sma90Arr[i],
		ema7: ema7Arr[i],
		ema30: ema30Arr[i],
		rsi14: rsi14Arr[i] !== null ? rsi14Arr[i] : rsi7Arr[i],
		macdLine: macdObj.macdLine[i],
		macdSignal: macdObj.signalLine[i],
		macdHistogram: macdObj.histogram[i],
		trendlineValue: trendObj.fittedValues[i] ?? 0
	}));
	const lastIdx = Math.max(0, series.length - 1);
	const latest = series[lastIdx];
	const latestSma7 = sma7Arr[lastIdx] ?? null;
	const latestSma30 = sma30Arr[lastIdx] ?? null;
	const latestSma90 = sma90Arr[lastIdx] ?? null;
	const latestEma7 = ema7Arr[lastIdx] ?? null;
	const latestEma30 = ema30Arr[lastIdx] ?? null;
	const latestRsi14 = rsi14Arr[lastIdx] ?? null;
	const latestRsiAdaptive7 = rsi7Arr[lastIdx] ?? null;
	const latestMacdLine = macdObj.macdLine[lastIdx] ?? null;
	const latestMacdSignal = macdObj.signalLine[lastIdx] ?? null;
	const latestMacdHist = macdObj.histogram[lastIdx] ?? null;
	const activeVals = activeDaily.map((d) => d.netSales);
	let momentumPercent = 0;
	if (activeVals.length >= 2) {
		const split = Math.max(1, Math.floor(activeVals.length / 2));
		const earlyAvg = activeVals.slice(0, split).reduce((a, b) => a + b, 0) / split;
		const recentAvg = activeVals.slice(split).reduce((a, b) => a + b, 0) / Math.max(1, activeVals.length - split);
		momentumPercent = earlyAvg > 0 ? Math.round((recentAvg - earlyAvg) / earlyAvg * 1e3) / 10 : 0;
	}
	const signals = [];
	if (latestEma7 !== null && latestSma7 !== null) {
		const isBullish = latestEma7 >= latestSma7;
		signals.push({
			indicator: "SMA_EMA_CROSS",
			nameEn: "Short-Term Moving Average Crossover (EMA 7 vs SMA 7)",
			nameAr: "تقاطع المتوسطات المتحركة قصيرة الأجل (EMA 7 مقابل SMA 7)",
			status: isBullish ? "bullish_expansion" : "bearish_contraction",
			currentValue: latestEma7,
			referenceThreshold: `SMA(7) = ${latestSma7}`,
			interpretationEn: isBullish ? `7-day Exponential Moving Average (${latestEma7}) is above or equal to the 7-day Simple Moving Average (${latestSma7}), indicating accelerating recent daily sales.` : `7-day Exponential Moving Average (${latestEma7}) is below the 7-day Simple Moving Average (${latestSma7}), indicating a short-term cooling in daily sales pace.`,
			interpretationAr: isBullish ? `المتوسط المتحرك الأسي لـ 7 أيام (${latestEma7}) أعلى من أو يساوي المتوسط البسيط (${latestSma7})، مما يشير إلى تسارع إيجابي في المبيعات اليومية الأخيرة.` : `المتوسط المتحرك الأسي لـ 7 أيام (${latestEma7}) أقل من المتوسط البسيط (${latestSma7})، مما يشير إلى تباطؤ قصير الأجل في وتيرة المبيعات.`,
			dataPointsUsed: values.length,
			minimumPointsRequired: 7
		});
	} else signals.push({
		indicator: "SMA_EMA_CROSS",
		nameEn: "Short-Term Moving Average Crossover (EMA 7 vs SMA 7)",
		nameAr: "تقاطع المتوسطات المتحركة قصيرة الأجل (EMA 7 مقابل SMA 7)",
		status: "insufficient_data",
		currentValue: null,
		referenceThreshold: "7 days required",
		interpretationEn: `At least 7 daily points are required to compute 7-day moving averages (currently ${values.length} points).`,
		interpretationAr: `يلزم توفر 7 أيام على الأقل لاحتساب المتوسط المتحرك لـ 7 أيام (المتوفر حالياً ${values.length} أيام).`,
		dataPointsUsed: values.length,
		minimumPointsRequired: 7
	});
	const effectiveRsi = latestRsi14 !== null ? latestRsi14 : latestRsiAdaptive7;
	if (effectiveRsi !== null) {
		const isOverbought = effectiveRsi >= 70;
		const isOversold = effectiveRsi <= 30;
		const status = isOverbought ? "overbought_peak" : isOversold ? "oversold_dip" : effectiveRsi >= 52 ? "bullish_expansion" : "neutral_consolidation";
		signals.push({
			indicator: "RSI_14",
			nameEn: latestRsi14 !== null ? "Retail Sales Momentum Index (RSI 14)" : "Adaptive Sales Momentum Index (RSI 7)",
			nameAr: latestRsi14 !== null ? "مؤشر القوة النسبية لزخم المبيعات (RSI 14)" : "مؤشر القوة النسبية التكيفي لزخم المبيعات (RSI 7)",
			status,
			currentValue: effectiveRsi,
			referenceThreshold: "30 (Oversold Dip) – 70 (Demand Surge Peak)",
			interpretationEn: isOverbought ? `RSI is at ${effectiveRsi} (>70), signaling an unusually strong demand surge. Ensure fast-moving stock is replenished to prevent stockouts.` : isOversold ? `RSI is at ${effectiveRsi} (<30), signaling a pronounced sales slowdown compared to recent norms. Consider promotional bundles.` : `RSI is at ${effectiveRsi} (balanced 30–70 zone), reflecting steady, sustainable daily demand.`,
			interpretationAr: isOverbought ? `مؤشر القوة النسبية عند ${effectiveRsi} (>70)، مما يدل على ذروة طلب قوية غير معتادة. تأكد من تعزيز مخزون الأصناف السريعة لتجنب النفاد.` : isOversold ? `مؤشر القوة النسبية عند ${effectiveRsi} (<30)، مما يشير إلى هدوء ملحوظ في المبيعات مقارنة بالمعدلات السابقة. يُنصح بتنشيط العروض الترويجية.` : `مؤشر القوة النسبية عند ${effectiveRsi} (ضمن النطاق المتوازن 30–70)، مما يعكس استقراراً طبيعياً في الطلب اليومي.`,
			dataPointsUsed: values.length,
			minimumPointsRequired: latestRsi14 !== null ? 15 : 7
		});
	} else signals.push({
		indicator: "RSI_14",
		nameEn: "Retail Sales Momentum Index (RSI 14)",
		nameAr: "مؤشر القوة النسبية لزخم المبيعات (RSI 14)",
		status: "insufficient_data",
		currentValue: null,
		referenceThreshold: "15 days required",
		interpretationEn: "Select at least a 14-day or 30-day window to compute Relative Strength Index (RSI).",
		interpretationAr: "يرجى اختيار نطاق زمني 14 أو 30 يوماً على الأقل لاحتساب مؤشر القوة النسبية (RSI).",
		dataPointsUsed: values.length,
		minimumPointsRequired: 15
	});
	if (latestMacdLine !== null && latestMacdSignal !== null) {
		const isBullish = (latestMacdHist ?? 0) >= 0;
		signals.push({
			indicator: "MACD_12_26_9",
			nameEn: "MACD Trend Acceleration (12, 26, 9)",
			nameAr: "مؤشر تقارب وتباعد المتوسطات (MACD 12, 26, 9)",
			status: isBullish ? "bullish_expansion" : "bearish_contraction",
			currentValue: latestMacdHist,
			referenceThreshold: `MACD=${latestMacdLine}, Signal=${latestMacdSignal}`,
			interpretationEn: isBullish ? `MACD Histogram is positive (${latestMacdHist}), showing medium-term sales momentum is expanding faster than the 26-day baseline.` : `MACD Histogram is negative (${latestMacdHist}), indicating recent 12-day sales pace is trailing the 26-day trend.`,
			interpretationAr: isBullish ? `مدرج MACD إيجابي (${latestMacdHist})، مما يوضح أن زخم المبيعات متوسط الأجل ينمو أسرع من خط الأساس لـ 26 يوماً.` : `مدرج MACD سلبي (${latestMacdHist})، مما يشير إلى أن وتيرة المبيعات لآخر 12 يوماً أقل من متوسط 26 يوماً.`,
			dataPointsUsed: values.length,
			minimumPointsRequired: 34
		});
	} else signals.push({
		indicator: "MACD_12_26_9",
		nameEn: "MACD Trend Acceleration (12, 26, 9)",
		nameAr: "مؤشر تقارب وتباعد المتوسطات (MACD 12, 26, 9)",
		status: "insufficient_data",
		currentValue: latestMacdLine,
		referenceThreshold: "34 daily points required for full Signal(9)",
		interpretationEn: `MACD (12,26,9) requires at least 34 daily points (26 slow EMA + 9 signal EMA). Switch the Date Filter to 90 Days to view the full MACD Signal & Histogram.`,
		interpretationAr: `يتطلب مؤشر MACD (12,26,9) الكامل 34 نقطة يومية على الأقل (26 يوم للمتوسط البطيء + 9 أيام لخط الإشارة). اختر نطاق 90 يوماً لعرض إشارة ومدرج MACD الكامل.`,
		dataPointsUsed: values.length,
		minimumPointsRequired: 34
	});
	signals.push({
		indicator: "LINEAR_TREND",
		nameEn: "Least-Squares Linear Regression Trendline",
		nameAr: "خط الاتجاه العام للانحدار الخطي",
		status: trendObj.direction === "upward" ? "bullish_expansion" : trendObj.direction === "downward" ? "bearish_contraction" : "neutral_consolidation",
		currentValue: trendObj.slope,
		referenceThreshold: "0.00 / day slope",
		interpretationEn: trendObj.direction === "upward" ? `Sales trendline is sloping upward at +${trendObj.slope} ${targetCurrency}/day across the selected window.` : trendObj.direction === "downward" ? `Sales trendline is sloping downward at ${trendObj.slope} ${targetCurrency}/day across the selected window.` : `Sales trendline is stable (${trendObj.slope} ${targetCurrency}/day) across the selected window.`,
		interpretationAr: trendObj.direction === "upward" ? `خط الاتجاه العام للمبيعات صاعد بمعدل +${trendObj.slope} ${targetCurrency}/يوم خلال الفترة المحددة.` : trendObj.direction === "downward" ? `خط الاتجاه العام للمبيعات هابط بمعدل ${trendObj.slope} ${targetCurrency}/يوم خلال الفترة المحددة.` : `خط الاتجاه العام للمبيعات مستقر (${trendObj.slope} ${targetCurrency}/يوم) خلال الفترة المحددة.`,
		dataPointsUsed: values.length,
		minimumPointsRequired: 2
	});
	signals.push({
		indicator: "SUPPORT_RESISTANCE",
		nameEn: "Historical Sales Support Floor & Resistance Ceiling",
		nameAr: "مستويات الدعم (الحد الأدنى المعتاد) والمقاومة (ذروة المبيعات)",
		status: (latest?.value ?? 0) >= srObj.resistanceCeiling && srObj.resistanceCeiling > 0 ? "overbought_peak" : "neutral_consolidation",
		currentValue: latest?.value ?? 0,
		referenceThreshold: `Support: ${srObj.supportFloor} | Resistance: ${srObj.resistanceCeiling}`,
		interpretationEn: `Active daily revenue typically holds above the ${srObj.supportFloor} ${targetCurrency} support floor and tests peak capacity near ${srObj.resistanceCeiling} ${targetCurrency}.`,
		interpretationAr: `تستقر المبيعات اليومية النشطة عادة فوق مستوى الدعم (${srObj.supportFloor} ${targetCurrency}) وتختبر سقف الذروة عند (${srObj.resistanceCeiling} ${targetCurrency}).`,
		dataPointsUsed: activeDaily.length,
		minimumPointsRequired: 2
	});
	return {
		currency: targetCurrency,
		targetMetric: "net_sales",
		missingDateStrategy,
		calendarDaysCount: rawDaily.length,
		activeSalesDaysCount: activeDaily.length,
		dataSufficiencyNoteEn: activeDaily.length < 14 ? `Dataset contains ${activeDaily.length} active sales days across a ${rawDaily.length}-day calendar window. Open calendar days without transactions are zero-filled (${missingDateStrategy}).` : `Dataset contains ${activeDaily.length} active sales days across ${rawDaily.length} calendar days.`,
		dataSufficiencyNoteAr: activeDaily.length < 14 ? `تحتوي البيانات على ${activeDaily.length} أيام مبيعات نشطة ضمن نافذة تقويمية مدتها ${rawDaily.length} يوماً. يتم تعبئة الأيام الخالية من الفواتير بقيمة صفر (${missingDateStrategy}).` : `تحتوي البيانات على ${activeDaily.length} أيام مبيعات نشطة ضمن ${rawDaily.length} يوماً تقويمياً.`,
		latestValues: {
			currentValue: latest?.value ?? 0,
			sma7: latestSma7,
			sma30: latestSma30,
			sma90: latestSma90,
			ema7: latestEma7,
			ema30: latestEma30,
			rsi14: latestRsi14,
			rsiAdaptive7: latestRsiAdaptive7,
			macdLine: latestMacdLine,
			macdSignal: latestMacdSignal,
			macdHistogram: latestMacdHist,
			trendSlopePerDay: trendObj.slope,
			trendDirection: trendObj.direction,
			supportFloor: srObj.supportFloor,
			resistanceCeiling: srObj.resistanceCeiling,
			momentumPercent
		},
		signals,
		series,
		intradayCandlesticks: sales.intradayCandlesticks
	};
}
// src/analytics/forecasting/forecasting.engine.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var MODEL_LABELS = {
	naive_last_value: {
		en: "Naive Last-Observation Baseline",
		ar: "النموذج المرجعي البسيط (آخر قيمة مرصودة)"
	},
	moving_average_7: {
		en: "7-Day Trailing Moving Average (MA)",
		ar: "المتوسط المتحرك المتأخر (7 أيام)"
	},
	seasonal_naive_weekly: {
		en: "Weekly Seasonal Naive (Day-of-Week Cycle)",
		ar: "النموذج الموسمي الأسبوعي (دورة أيام الأسبوع)"
	},
	simple_exponential_smoothing: {
		en: "Simple Exponential Smoothing (SES α=0.35)",
		ar: "التمهيد الأسي البسيط (SES α=0.35)"
	},
	holt_linear_exponential: {
		en: "Holt Damped Trend Exponential Smoothing",
		ar: "تمهيد هولت الأسي المزدوج للاتجاه (Holt-Winters)"
	}
};
/**
* Generates h-step ahead forecasts and in-sample one-step-ahead fitted values for a given univariate series
* using one of the 5 statistical retail forecasting models (including the Naive baseline).
*/
function runForecastModel(history, horizon, model) {
	const n = history.length;
	if (n === 0) return {
		fitted: [],
		forecast: new Array(horizon).fill(0)
	};
	if (model === "naive_last_value") {
		const fitted = [Math.max(0, roundCurrencyValue(history[0]))];
		for (let i = 1; i < n; i++) fitted.push(Math.max(0, roundCurrencyValue(history[i - 1])));
		const lastVal = Math.max(0, roundCurrencyValue(history[n - 1]));
		return {
			fitted,
			forecast: new Array(horizon).fill(lastVal)
		};
	}
	if (model === "moving_average_7") {
		const windowSize = Math.min(7, n);
		const fitted = [];
		for (let i = 0; i < n; i++) {
			const start = Math.max(0, i - windowSize);
			const slice = i === 0 ? [history[0]] : history.slice(start, i);
			const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
			fitted.push(Math.max(0, roundCurrencyValue(avg)));
		}
		const lastSlice = history.slice(Math.max(0, n - windowSize));
		const baseForecast = Math.max(0, roundCurrencyValue(lastSlice.reduce((a, b) => a + b, 0) / lastSlice.length));
		return {
			fitted,
			forecast: new Array(horizon).fill(baseForecast)
		};
	}
	if (model === "seasonal_naive_weekly") {
		const period = Math.min(7, n);
		const fitted = [];
		for (let i = 0; i < n; i++) {
			const lagIdx = i - period >= 0 ? i - period : Math.max(0, i - 1);
			fitted.push(Math.max(0, roundCurrencyValue(history[lagIdx])));
		}
		const lastCycle = history.slice(n - period);
		const forecast = [];
		for (let h = 0; h < horizon; h++) {
			const val = lastCycle[h % lastCycle.length] ?? 0;
			forecast.push(Math.max(0, roundCurrencyValue(val)));
		}
		return {
			fitted,
			forecast
		};
	}
	if (model === "simple_exponential_smoothing") {
		const alpha = .35;
		const fitted = [Math.max(0, roundCurrencyValue(history[0]))];
		let level = history[0];
		for (let i = 1; i < n; i++) {
			fitted.push(Math.max(0, roundCurrencyValue(level)));
			level = alpha * history[i] + .65 * level;
		}
		const finalForecast = Math.max(0, roundCurrencyValue(level));
		return {
			fitted,
			forecast: new Array(horizon).fill(finalForecast)
		};
	}
	const alpha = .4;
	const beta = .2;
	const phi = .88;
	let level = history[0];
	let trend = n > 1 ? (history[Math.min(n - 1, 3)] - history[0]) / Math.min(n - 1, 3) : 0;
	const fitted = [Math.max(0, roundCurrencyValue(level))];
	for (let i = 1; i < n; i++) {
		const pred = level + phi * trend;
		fitted.push(Math.max(0, roundCurrencyValue(pred)));
		const prevLevel = level;
		level = alpha * history[i] + .6 * (prevLevel + phi * trend);
		trend = beta * (level - prevLevel) + .8 * phi * trend;
	}
	const forecast = [];
	let phiSum = 0;
	for (let h = 1; h <= horizon; h++) {
		phiSum += Math.pow(phi, h);
		const val = level + phiSum * trend;
		forecast.push(Math.max(0, roundCurrencyValue(val)));
	}
	return {
		fitted,
		forecast
	};
}
/**
* Computes Mean Absolute Error (MAE), Weighted Absolute Percentage Error (WAPE %),
* Forecast Bias (Signed Error = Forecast - Actual), and Bias % between actual test observations
* and predicted values.
*/
function computeAccuracyMetrics(actuals, predictions) {
	const len = Math.min(actuals.length, predictions.length);
	if (len === 0) return {
		mae: 0,
		wapePercent: 0,
		forecastBias: 0,
		biasPercent: 0
	};
	let absErrSum = 0;
	let signedErrSum = 0;
	let actualSum = 0;
	for (let i = 0; i < len; i++) {
		const signedErr = predictions[i] - actuals[i];
		absErrSum += Math.abs(signedErr);
		signedErrSum += signedErr;
		actualSum += Math.abs(actuals[i]);
	}
	const mae = roundCurrencyValue(absErrSum / len);
	const forecastBias = roundCurrencyValue(signedErrSum / len);
	return {
		mae,
		wapePercent: actualSum > 0 ? Math.min(200, Math.round(absErrSum / actualSum * 1e3) / 10) : mae === 0 ? 0 : 100,
		forecastBias,
		biasPercent: actualSum > 0 ? Math.max(-200, Math.min(200, Math.round(signedErrSum / actualSum * 1e3) / 10)) : 0
	};
}
/**
* Performs multi-origin rolling-origin backtesting across all 5 candidate models
* for the requested forecast horizon and selects the most accurate and horizon-safe model.
*/
function evaluateAndSelectBestModel(series, requestedHorizonDays = 7) {
	const candidates = [
		"naive_last_value",
		"moving_average_7",
		"seasonal_naive_weekly",
		"simple_exponential_smoothing",
		"holt_linear_exponential"
	];
	let firstNonZeroIdx = series.findIndex((v) => v > 0);
	if (firstNonZeroIdx < 0) firstNonZeroIdx = 0;
	const activeSlice = series.slice(firstNonZeroIdx);
	const evalSeries = activeSlice.length >= 4 ? activeSlice : series;
	const n = evalSeries.length;
	const maxStepPerOrigin = Math.max(1, Math.min(requestedHorizonDays, Math.max(1, Math.floor(n / 3))));
	const minTrainLen = Math.max(2, n - Math.min(n - 2, maxStepPerOrigin + 4));
	const originIndices = [];
	for (let trainEnd = minTrainLen; trainEnd <= n - 1; trainEnd++) originIndices.push(trainEnd);
	const selectedOrigins = originIndices.length > 5 ? originIndices.slice(originIndices.length - 5) : originIndices.length > 0 ? originIndices : [Math.max(1, n - 1)];
	const evaluations = candidates.map((model) => {
		const allActuals = [];
		const allPredictions = [];
		let within80Count = 0;
		let within95Count = 0;
		let totalEvaluatedPoints = 0;
		for (const originIdx of selectedOrigins) {
			const train = evalSeries.slice(0, originIdx);
			const test = evalSeries.slice(originIdx, Math.min(n, originIdx + maxStepPerOrigin));
			if (test.length === 0) continue;
			const { fitted, forecast } = runForecastModel(train, test.length, model);
			let sumSq = 0;
			for (let i = 0; i < train.length; i++) {
				const err = train[i] - (fitted[i] ?? train[i]);
				sumSq += err * err;
			}
			const avgTrain = train.length > 0 ? train.reduce((a, b) => a + b, 0) / train.length : 0;
			const stdErr = train.length > 1 ? Math.sqrt(sumSq / (train.length - 1)) : avgTrain * .2;
			const sigmaBase = Math.max(avgTrain * .1, stdErr);
			for (let h = 0; h < test.length; h++) {
				const act = test[h];
				const pred = forecast[h] ?? 0;
				allActuals.push(act);
				allPredictions.push(pred);
				const sigmaH = sigmaBase * Math.sqrt(1 + .12 * h);
				const low80 = Math.max(0, pred - 1.28 * sigmaH);
				const high80 = pred + 1.28 * sigmaH;
				const low95 = Math.max(0, pred - 1.96 * sigmaH);
				const high95 = pred + 1.96 * sigmaH;
				if (act >= low80 && act <= high80) within80Count += 1;
				if (act >= low95 && act <= high95) within95Count += 1;
				totalEvaluatedPoints += 1;
			}
		}
		const { mae, wapePercent, forecastBias, biasPercent } = computeAccuracyMetrics(allActuals, allPredictions);
		const empiricalCoverage80Percent = totalEvaluatedPoints > 0 ? Math.round(within80Count / totalEvaluatedPoints * 1e3) / 10 : null;
		const empiricalCoverage95Percent = totalEvaluatedPoints > 0 ? Math.round(within95Count / totalEvaluatedPoints * 1e3) / 10 : null;
		return {
			model,
			modelNameEn: MODEL_LABELS[model].en,
			modelNameAr: MODEL_LABELS[model].ar,
			mae,
			wapePercent,
			forecastBias,
			biasPercent,
			trainPoints: selectedOrigins[selectedOrigins.length - 1] || 1,
			testPoints: totalEvaluatedPoints,
			rollingOriginsCount: selectedOrigins.length,
			horizonTestedDays: maxStepPerOrigin,
			empiricalCoverage80Percent,
			empiricalCoverage95Percent,
			beatsNaiveBaseline: false,
			isSelectedWinner: false
		};
	});
	const naiveEval = evaluations.find((e) => e.model === "naive_last_value");
	const naiveWape = naiveEval ? naiveEval.wapePercent : 100;
	const naiveMae = naiveEval ? naiveEval.mae : Infinity;
	for (const ev of evaluations) if (ev.model === "naive_last_value") ev.beatsNaiveBaseline = false;
	else ev.beatsNaiveBaseline = ev.wapePercent < naiveWape || ev.wapePercent === naiveWape && ev.mae <= naiveMae;
	const isShortHistoryForLongHorizon = requestedHorizonDays >= 30 && n < 21;
	evaluations.sort((a, b) => {
		const aPenalty = isShortHistoryForLongHorizon && a.model === "holt_linear_exponential" ? 5 : 0;
		const bPenalty = isShortHistoryForLongHorizon && b.model === "holt_linear_exponential" ? 5 : 0;
		return a.wapePercent + aPenalty - (b.wapePercent + bPenalty) || Math.abs(a.biasPercent) - Math.abs(b.biasPercent) || a.mae - b.mae;
	});
	const winner = evaluations[0].model;
	evaluations[0].isSelectedWinner = true;
	return {
		selectedModel: winner,
		evaluations
	};
}
/**
* Builds historical + future ForecastPoint[] with 80% and 95% uncertainty/prediction intervals.
*/
function buildForecastSeriesWithIntervals(historicalPoints, horizonDays, model, referenceDate) {
	let firstActiveIdx = historicalPoints.findIndex((p) => p.value > 0);
	if (firstActiveIdx < 0) firstActiveIdx = 0;
	const modelInputPoints = historicalPoints.slice(firstActiveIdx);
	const values = modelInputPoints.map((p) => p.value);
	const { fitted, forecast } = runForecastModel(values, horizonDays, model);
	let sumSqErr = 0;
	for (let i = 0; i < values.length; i++) {
		const err = values[i] - (fitted[i] ?? values[i]);
		sumSqErr += err * err;
	}
	const avgVal = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
	const rawStdErr = values.length > 1 ? Math.sqrt(sumSqErr / (values.length - 1)) : avgVal * .2;
	const baseStdErr = Math.max(avgVal * .1, rawStdErr);
	const output = [];
	const histDisplayStart = Math.max(0, modelInputPoints.length - 14);
	for (let i = histDisplayStart; i < modelInputPoints.length; i++) {
		const pt = modelInputPoints[i];
		output.push({
			dateKey: pt.dateKey,
			label: pt.label,
			isHistorical: true,
			actualValue: pt.value,
			fittedOrForecastValue: fitted[i] ?? pt.value,
			lowerBound80: null,
			upperBound80: null,
			lowerBound95: null,
			upperBound95: null
		});
	}
	const lastDate = modelInputPoints.length > 0 ? /* @__PURE__ */ new Date(modelInputPoints[modelInputPoints.length - 1].dateKey + "T12:00:00") : new Date(referenceDate);
	for (let h = 0; h < horizonDays; h++) {
		const fDate = new Date(lastDate);
		fDate.setDate(lastDate.getDate() + h + 1);
		const dateKey = toDateKey(fDate);
		const label = fDate.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric"
		});
		const fVal = forecast[h] ?? 0;
		const sigmaH = baseStdErr * Math.sqrt(1 + .12 * h);
		const lower80 = Math.max(0, roundCurrencyValue(fVal - 1.28 * sigmaH));
		const upper80 = Math.max(fVal, roundCurrencyValue(fVal + 1.28 * sigmaH));
		const lower95 = Math.max(0, roundCurrencyValue(fVal - 1.96 * sigmaH));
		const upper95 = Math.max(upper80, roundCurrencyValue(fVal + 1.96 * sigmaH));
		output.push({
			dateKey,
			label,
			isHistorical: false,
			actualValue: null,
			fittedOrForecastValue: fVal,
			lowerBound80: lower80,
			upperBound80: upper80,
			lowerBound95: lower95,
			upperBound95: upper95
		});
	}
	return output;
}
/**
* Computes statistical forecasts for 7, 30, or 90 days across Revenue, Gross Profit,
* and Product-level Demand & Depletion using Rolling-Origin Backtesting.
*/
function computeForecasts(dataset, filters, precomputedSales, referenceDate = /* @__PURE__ */ new Date()) {
	const targetCurrency = filters.currency || "SDG";
	const horizonDays = filters.forecastHorizonDays === 30 || filters.forecastHorizonDays === 90 ? filters.forecastHorizonDays : 7;
	const liveRates = {
		...DEFAULT_BASELINE_EXCHANGE_RATES,
		...dataset.exchangeRates || {},
		SDG: 1
	};
	const sales = precomputedSales || computeSalesAnalytics(dataset, filters, referenceDate);
	const dailyPoints = sales.dailySeries;
	const activeDaysCount = dailyPoints.filter((d) => d.netSales > 0).length;
	const minimumHistoryRequiredDays = horizonDays === 7 ? 14 : horizonDays === 30 ? 30 : 60;
	const horizonSufficiencyStatus = activeDaysCount >= minimumHistoryRequiredDays ? "sufficient_history" : activeDaysCount >= 5 ? "extrapolated_beyond_observed_history" : "insufficient_history";
	const revenueHistory = dailyPoints.map((d) => ({
		dateKey: d.dateKey,
		label: d.label,
		value: d.netSales
	}));
	const profitHistory = dailyPoints.map((d) => ({
		dateKey: d.dateKey,
		label: d.label,
		value: d.grossProfit ?? 0
	}));
	const { selectedModel, evaluations } = evaluateAndSelectBestModel(revenueHistory.map((r) => r.value), horizonDays);
	const winnerEval = evaluations[0];
	const intervalCalibrationStatus = winnerEval.testPoints >= 10 && activeDaysCount >= 21 ? "calibrated_empirical_coverage" : "estimated_uncertainty_range";
	const revenueSeries = buildForecastSeriesWithIntervals(revenueHistory, horizonDays, selectedModel, referenceDate);
	const profitSeries = buildForecastSeriesWithIntervals(profitHistory, horizonDays, selectedModel, referenceDate);
	const futureRevenuePoints = revenueSeries.filter((p) => !p.isHistorical);
	const futureProfitPoints = profitSeries.filter((p) => !p.isHistorical);
	const expectedTotalNetSales = roundCurrencyValue(futureRevenuePoints.reduce((acc, p) => acc + p.fittedOrForecastValue, 0));
	const lowerBound80Total = roundCurrencyValue(futureRevenuePoints.reduce((acc, p) => acc + (p.lowerBound80 ?? p.fittedOrForecastValue), 0));
	const upperBound80Total = roundCurrencyValue(futureRevenuePoints.reduce((acc, p) => acc + (p.upperBound80 ?? p.fittedOrForecastValue), 0));
	const expectedAverageDailySales = roundCurrencyValue(expectedTotalNetSales / horizonDays);
	const expectedTotalGrossProfit = roundCurrencyValue(futureProfitPoints.reduce((acc, p) => acc + p.fittedOrForecastValue, 0));
	const activeHistoricalAvg = activeDaysCount > 0 ? roundCurrencyValue(sales.summary.netSales / activeDaysCount) : 0;
	const projectedGrowthVsHistoricalPercent = activeHistoricalAvg > 0 ? Math.round((expectedAverageDailySales - activeHistoricalAvg) / activeHistoricalAvg * 1e3) / 10 : 0;
	const productsMap = new Map(dataset.products.map((p) => [p.id, p]));
	const scopedCompletedTx = filterTransactionsByScope(dataset.transactions, productsMap, dataset.branches, filters).filter((t) => t.status === "completed");
	const dateKeysInWindow = dailyPoints.map((d) => d.dateKey);
	const validDateKeysSet = new Set(dateKeysInWindow);
	const activeDatesSorted = Array.from(new Set(dailyPoints.filter((d) => d.netSales > 0 || d.transactionCount > 0).map((d) => d.dateKey))).sort();
	const effectiveSpanDays = Math.max(7, activeDatesSorted.length);
	const productDailyNetUnits = /* @__PURE__ */ new Map();
	const productTotalNetUnits = /* @__PURE__ */ new Map();
	for (const tx of scopedCompletedTx) {
		const dk = toDateKey(new Date(tx.timestamp));
		if (!validDateKeysSet.has(dk)) continue;
		const txReturns = resolveReturnsForTransaction(tx, dataset.returns || []);
		const returnedBaseUnitsByProd = /* @__PURE__ */ new Map();
		for (const ret of txReturns) for (const ri of ret.items || []) {
			const prod = productsMap.get(ri.productId);
			const retUnits = ri.saleUnit === "pack" && prod?.unitsPerPack && prod.unitsPerPack > 1 ? Math.max(0, ri.quantity) * prod.unitsPerPack : Math.max(0, ri.quantity);
			returnedBaseUnitsByProd.set(ri.productId, (returnedBaseUnitsByProd.get(ri.productId) || 0) + retUnits);
		}
		for (const item of tx.items) {
			const prod = productsMap.get(item.productId);
			const unitsPerPack = prod && prod.unitsPerPack && prod.unitsPerPack > 1 ? prod.unitsPerPack : 1;
			const grossUnits = item.stockDeducted && item.stockDeducted > 0 ? item.stockDeducted : item.saleUnit === "pack" ? item.quantity * unitsPerPack : item.quantity;
			const availRet = returnedBaseUnitsByProd.get(item.productId) || 0;
			const convertedAvailRet = availRet > 0 && item.saleUnit === "pack" && unitsPerPack > 1 && availRet <= item.quantity ? availRet * unitsPerPack : availRet;
			const deductedRet = Math.min(grossUnits, convertedAvailRet);
			if (availRet > 0) {
				const consumedRaw = item.saleUnit === "pack" && unitsPerPack > 1 && availRet <= item.quantity ? deductedRet / unitsPerPack : deductedRet;
				returnedBaseUnitsByProd.set(item.productId, Math.max(0, availRet - consumedRaw));
			}
			const netUnits = Math.max(0, grossUnits - deductedRet);
			if (netUnits <= 0) continue;
			let prodDayMap = productDailyNetUnits.get(item.productId);
			if (!prodDayMap) {
				prodDayMap = /* @__PURE__ */ new Map();
				productDailyNetUnits.set(item.productId, prodDayMap);
			}
			prodDayMap.set(dk, (prodDayMap.get(dk) || 0) + netUnits);
			productTotalNetUnits.set(item.productId, (productTotalNetUnits.get(item.productId) || 0) + netUnits);
		}
	}
	const pendingInboundByProduct = computePendingInboundByProduct(dataset, filters);
	const branchFilter = filters.branchId && filters.branchId !== "all" ? filters.branchId : null;
	const rawUnmetRequests = Array.isArray(dataset.unmetDemandRequests) ? dataset.unmetDemandRequests : [];
	const productUnmetRawUnits = /* @__PURE__ */ new Map();
	const productUnmetWeightedUnits = /* @__PURE__ */ new Map();
	const productUnmetDailyWeighted = /* @__PURE__ */ new Map();
	const productStockoutDaysSet = /* @__PURE__ */ new Map();
	const dailyUnmetWeightedRevenue = /* @__PURE__ */ new Map();
	let totalUnmetSignalsInScope = 0;
	for (const req of rawUnmetRequests) {
		if (!req || !req.id || req.fulfillmentStatus === "cancelled") continue;
		if (branchFilter && req.branchId !== branchFilter) continue;
		const dk = toDateKey(new Date(req.requestedTimestamp));
		if (!validDateKeysSet.has(dk)) continue;
		totalUnmetSignalsInScope += 1;
		const baseUnits = Math.max(1, Number(req.requestedBaseUnits || req.requestedQuantity || 1));
		const weightedUnits = baseUnits * (req.fulfillmentStatus === "fulfilled_later" ? 0 : req.confirmedPurchaseIntent ? .65 : .35);
		if (req.productId) {
			productUnmetRawUnits.set(req.productId, (productUnmetRawUnits.get(req.productId) || 0) + baseUnits);
			productUnmetWeightedUnits.set(req.productId, (productUnmetWeightedUnits.get(req.productId) || 0) + weightedUnits);
			let dMap = productUnmetDailyWeighted.get(req.productId);
			if (!dMap) {
				dMap = /* @__PURE__ */ new Map();
				productUnmetDailyWeighted.set(req.productId, dMap);
			}
			dMap.set(dk, (dMap.get(dk) || 0) + weightedUnits);
			if (req.unavailabilityReason === "OUT_OF_STOCK" || req.availabilityStatus === "OUT_OF_STOCK" || req.availabilityStatus === "INSUFFICIENT_QUANTITY") {
				let sDays = productStockoutDaysSet.get(req.productId);
				if (!sDays) {
					sDays = /* @__PURE__ */ new Set();
					productStockoutDaysSet.set(req.productId, sDays);
				}
				sDays.add(dk);
			}
		}
		const prod = req.productId ? productsMap.get(req.productId) : void 0;
		const unitPrice = prod ? getProductPricesInCurrency(prod, targetCurrency, liveRates).sellingPrice : req.unitSellingPriceSnapshot && req.unitSellingPriceSnapshot > 0 ? req.unitSellingPriceSnapshot : 0;
		if (unitPrice > 0 && weightedUnits > 0) dailyUnmetWeightedRevenue.set(dk, (dailyUnmetWeightedRevenue.get(dk) || 0) + weightedUnits * unitPrice);
	}
	let censoringCompensatedProductsCount = 0;
	const productDemandForecasts = dataset.products.filter((p) => {
		if (filters.productId && filters.productId !== "all" && p.id !== filters.productId) return false;
		if (filters.category && filters.category !== "all" && p.category !== filters.category) return false;
		return true;
	}).map((prod) => {
		const totalUnitsSold = productTotalNetUnits.get(prod.id) || 0;
		const prodDayMap = productDailyNetUnits.get(prod.id);
		const currentStock = Math.max(0, prod.stock);
		const pendingInboundUnits = pendingInboundByProduct.get(prod.id) || 0;
		const observedUnmetDemandUnits = productUnmetRawUnits.get(prod.id) || 0;
		const weightedUnmetUnits = productUnmetWeightedUnits.get(prod.id) || 0;
		const stockoutDaysObservedInWindow = productStockoutDaysSet.get(prod.id)?.size || 0;
		const censoringAdjusted = weightedUnmetUnits > 0;
		if (censoringAdjusted) censoringCompensatedProductsCount += 1;
		const fallbackHierarchyUsed = branchFilter ? (prodDayMap?.size || 0) + stockoutDaysObservedInWindow >= 2 ? "branch_product" : "store_product" : totalUnitsSold + observedUnmetDemandUnits > 0 ? "store_product" : "category_baseline";
		if (totalUnitsSold <= 0 || !prodDayMap) {
			const estimatedLatentDailyDemand = weightedUnmetUnits > 0 ? Math.round(weightedUnmetUnits / effectiveSpanDays * 100) / 100 : 0;
			const forecastedLatentTotalUnits = weightedUnmetUnits > 0 ? Math.max(1, Math.round(estimatedLatentDailyDemand * horizonDays)) : 0;
			const safetyBuffer = Math.max(prod.minStockAlert, 0);
			const recommendedReorderUnits = Math.max(0, Math.ceil(forecastedLatentTotalUnits + safetyBuffer - (currentStock + pendingInboundUnits)));
			return {
				productId: prod.id,
				sku: prod.sku,
				name: prod.name,
				nameAr: prod.nameAr,
				currentStock,
				pendingInboundUnits,
				historicalDailyDemand: 0,
				forecastedDailyDemand: 0,
				forecastHorizonDays: horizonDays,
				forecastedTotalUnits: 0,
				forecastedRevenue: 0,
				estimatedDaysUntilDepletion: null,
				estimatedDepletionDate: null,
				recommendedReorderUnits,
				selectedModel: "naive_last_value",
				wapePercent: 0,
				forecastBias: 0,
				confidenceLevel: "low",
				observedSalesDemandUnits: 0,
				observedUnmetDemandUnits,
				estimatedLatentDailyDemand,
				forecastedLatentTotalUnits,
				stockoutDaysObservedInWindow,
				censoringAdjusted,
				fallbackHierarchyUsed
			};
		}
		const allDailyUnits = new Array(dateKeysInWindow.length);
		let firstActive = -1;
		for (let i = 0; i < dateKeysInWindow.length; i++) {
			const u = prodDayMap.get(dateKeysInWindow[i]) || 0;
			allDailyUnits[i] = u;
			if (firstActive < 0 && u > 0) firstActive = i;
		}
		const demandWindow = firstActive >= 0 ? allDailyUnits.slice(firstActive) : allDailyUnits.slice(-7);
		const historicalDailyDemand = Math.round(totalUnitsSold / effectiveSpanDays * 100) / 100;
		const prodEval = evaluateAndSelectBestModel(demandWindow.length >= 3 ? demandWindow : [historicalDailyDemand, historicalDailyDemand], horizonDays);
		const { forecast: unitForecast } = runForecastModel(demandWindow.length >= 2 ? demandWindow : [historicalDailyDemand], horizonDays, prodEval.selectedModel);
		const rawForecastTotal = unitForecast.reduce((a, b) => a + b, 0);
		const forecastedTotalUnits = Math.max(totalUnitsSold > 0 ? 1 : 0, Math.round(rawForecastTotal > 0 ? rawForecastTotal : historicalDailyDemand * horizonDays));
		const forecastedDailyDemand = Math.round(forecastedTotalUnits / horizonDays * 100) / 100;
		const nonStockoutSpanDays = Math.max(1, effectiveSpanDays - Math.min(effectiveSpanDays - 1, stockoutDaysObservedInWindow));
		const uncensoredSalesRate = stockoutDaysObservedInWindow > 0 ? totalUnitsSold / nonStockoutSpanDays : historicalDailyDemand;
		const estimatedLatentDailyDemand = Math.round(Math.max(forecastedDailyDemand, uncensoredSalesRate + weightedUnmetUnits / effectiveSpanDays) * 100) / 100;
		const forecastedLatentTotalUnits = Math.max(forecastedTotalUnits, Math.round(estimatedLatentDailyDemand * horizonDays));
		const prices = getProductPricesInCurrency(prod, targetCurrency, liveRates);
		const forecastedRevenue = roundCurrencyValue(forecastedTotalUnits * prices.sellingPrice);
		const effectiveRate = Math.max(forecastedDailyDemand, historicalDailyDemand);
		const estimatedDaysUntilDepletion = effectiveRate > 0 ? Math.round(currentStock / effectiveRate * 10) / 10 : null;
		const estimatedDepletionDate = estimatedDaysUntilDepletion !== null ? toDateKey(new Date(referenceDate.getTime() + estimatedDaysUntilDepletion * 24 * 3600 * 1e3)) : null;
		const safetyBuffer = Math.max(prod.minStockAlert, Math.ceil(effectiveRate * 2));
		const recommendedReorderUnits = Math.max(0, Math.ceil((weightedUnmetUnits > 0 ? forecastedLatentTotalUnits : forecastedTotalUnits) + safetyBuffer - (currentStock + pendingInboundUnits)));
		const wape = prodEval.evaluations[0]?.wapePercent ?? 0;
		const forecastBias = prodEval.evaluations[0]?.forecastBias ?? 0;
		const confidenceLevel = activeDaysCount >= 14 && wape <= 25 ? "high" : activeDaysCount >= 5 && wape <= 45 ? "medium" : "low";
		return {
			productId: prod.id,
			sku: prod.sku,
			name: prod.name,
			nameAr: prod.nameAr,
			currentStock,
			pendingInboundUnits,
			historicalDailyDemand,
			forecastedDailyDemand,
			forecastHorizonDays: horizonDays,
			forecastedTotalUnits,
			forecastedRevenue,
			estimatedDaysUntilDepletion,
			estimatedDepletionDate,
			recommendedReorderUnits,
			selectedModel: prodEval.selectedModel,
			wapePercent: wape,
			forecastBias,
			confidenceLevel,
			observedSalesDemandUnits: totalUnitsSold,
			observedUnmetDemandUnits,
			estimatedLatentDailyDemand,
			forecastedLatentTotalUnits,
			stockoutDaysObservedInWindow,
			censoringAdjusted,
			fallbackHierarchyUsed
		};
	}).sort((a, b) => {
		if (b.forecastedRevenue !== a.forecastedRevenue) return b.forecastedRevenue - a.forecastedRevenue;
		return (b.observedUnmetDemandUnits || 0) - (a.observedUnmetDemandUnits || 0);
	});
	const latentRevenueSeriesValues = dailyPoints.map((d) => d.netSales + (dailyUnmetWeightedRevenue.get(d.dateKey) || 0));
	const latentWinner = evaluateAndSelectBestModel(latentRevenueSeriesValues, horizonDays).evaluations[0];
	const observedUnmetDemandEstimatedRevenue = roundCurrencyValue(Array.from(dailyUnmetWeightedRevenue.values()).reduce((a, b) => a + b, 0));
	const estimatedLatentDemandRevenue = roundCurrencyValue(expectedTotalNetSales + observedUnmetDemandEstimatedRevenue / Math.max(1, activeDaysCount) * horizonDays);
	const baselineVsLatentMetrics = computeAccuracyMetrics(latentRevenueSeriesValues, runForecastModel(revenueHistory.map((r) => r.value), horizonDays, selectedModel).fitted);
	const enhancedVsLatentMetrics = computeAccuracyMetrics(latentRevenueSeriesValues, runForecastModel(latentRevenueSeriesValues, horizonDays, latentWinner.model).fitted);
	const baselineSalesOnlyWapePercent = totalUnmetSignalsInScope > 0 ? baselineVsLatentMetrics.wapePercent : winnerEval.wapePercent;
	const latentDemandAdjustedWapePercent = totalUnmetSignalsInScope > 0 ? Math.min(latentWinner.wapePercent, enhancedVsLatentMetrics.wapePercent) : winnerEval.wapePercent;
	const baselineSalesOnlyMae = totalUnmetSignalsInScope > 0 ? baselineVsLatentMetrics.mae : winnerEval.mae;
	const latentDemandAdjustedMae = totalUnmetSignalsInScope > 0 ? Math.min(latentWinner.mae, enhancedVsLatentMetrics.mae) : winnerEval.mae;
	const improvementDemonstrated = totalUnmetSignalsInScope > 0 && (latentDemandAdjustedWapePercent < baselineSalesOnlyWapePercent || Math.abs(enhancedVsLatentMetrics.forecastBias) < Math.abs(baselineVsLatentMetrics.forecastBias));
	const dataQualityStatus = activeDaysCount >= 21 && horizonSufficiencyStatus === "sufficient_history" ? "high_confidence" : activeDaysCount >= 6 ? "moderate_confidence" : "short_history_warning";
	const intervalLabelEn = intervalCalibrationStatus === "calibrated_empirical_coverage" ? "Empirically Calibrated Prediction Intervals (80% / 95%)" : "Estimated Uncertainty Ranges (80% / 95%)";
	const intervalLabelAr = intervalCalibrationStatus === "calibrated_empirical_coverage" ? "نطاقات تنبؤ معايرة إحصائياً من البواقي (80% / 95%)" : "نطاقات عدم يقين تقديرية (80% / 95%)";
	return {
		currency: targetCurrency,
		horizonDays,
		minimumHistoryRequiredDays,
		observedHistoryDays: dailyPoints.length,
		activeHistoryDays: activeDaysCount,
		horizonSufficiencyStatus,
		intervalCalibrationStatus,
		intervalLabelEn,
		intervalLabelAr,
		selectedModel,
		selectedModelNameEn: MODEL_LABELS[selectedModel].en,
		selectedModelNameAr: MODEL_LABELS[selectedModel].ar,
		selectionReasonEn: `Selected via multi-origin rolling backtesting (${winnerEval.rollingOriginsCount} origins, ${winnerEval.testPoints} out-of-sample steps) with lowest error (WAPE = ${winnerEval.wapePercent}%, Bias = ${winnerEval.biasPercent}%, MAE = ${winnerEval.mae} ${targetCurrency}) across ${evaluations.length} models including the Naive baseline.`,
		selectionReasonAr: `تم اختيار النموذج عبر الاختبار العكسي المتدحرج متعدد النقاط (${winnerEval.rollingOriginsCount} نقاط قطع، ${winnerEval.testPoints} خطوات اختبار خارج العينة) لتحقيقه أقل نسبة خطأ (WAPE = ${winnerEval.wapePercent}%، الانحياز = ${winnerEval.biasPercent}%، MAE = ${winnerEval.mae} ${targetCurrency}) بين ${evaluations.length} نماذج تشمل النموذج المرجعي البسيط.`,
		dataQualityStatus,
		dataQualityNoteEn: horizonSufficiencyStatus !== "sufficient_history" ? `Forecast extrapolated over ${horizonDays} days from ${activeDaysCount} active sales days (recommended minimum for ${horizonDays}d horizon: ${minimumHistoryRequiredDays} days). Bands represent ${intervalLabelEn} rather than guaranteed empirical coverage.` : `Forecast calibrated on ${activeDaysCount} active sales days meeting the ${minimumHistoryRequiredDays}-day threshold for a ${horizonDays}-day horizon.`,
		dataQualityNoteAr: horizonSufficiencyStatus !== "sufficient_history" ? `تم استقراء التوقعات لأفق ${horizonDays} يوماً استناداً إلى ${activeDaysCount} أيام مبيعات نشطة (الحد الأدنى الموصى به لأفق ${horizonDays} يوماً هو ${minimumHistoryRequiredDays} يوماً). تمثل النطاقات "${intervalLabelAr}" لتوضيح تباين العينة.` : `تمت معايرة التوقعات استناداً إلى ${activeDaysCount} يوم مبيعات نشط مستوفية لشرط الـ ${minimumHistoryRequiredDays} يوماً لأفق ${horizonDays} يوماً.`,
		backtestEvaluations: evaluations,
		revenueForecastSummary: {
			horizonDays,
			expectedTotalNetSales,
			lowerBound80Total,
			upperBound80Total,
			expectedAverageDailySales,
			expectedTotalGrossProfit,
			projectedGrowthVsHistoricalPercent,
			observedHistoricalDemandRevenue: sales.summary.netSales,
			observedUnmetDemandEstimatedRevenue,
			estimatedLatentDemandRevenue
		},
		revenueSeries,
		profitSeries,
		productDemandForecasts,
		predictiveDemandComparison: {
			baselineSalesOnlyWapePercent,
			latentDemandAdjustedWapePercent,
			baselineSalesOnlyMae,
			latentDemandAdjustedMae,
			baselineBias: baselineVsLatentMetrics.forecastBias,
			latentDemandAdjustedBias: enhancedVsLatentMetrics.forecastBias,
			improvementDemonstrated,
			unmetDemandSignalsCount: totalUnmetSignalsInScope,
			censoringCompensatedProductsCount,
			comparisonNoteEn: totalUnmetSignalsInScope === 0 ? "No unmet demand inquiries recorded in this period; baseline sales-only and latent-demand models are identical." : improvementDemonstrated ? `Incorporating ${totalUnmetSignalsInScope} unmet demand signals across ${censoringCompensatedProductsCount} products reduced stockout-censoring error from ${baselineSalesOnlyWapePercent}% WAPE to ${latentDemandAdjustedWapePercent}% WAPE.` : `Evaluated ${totalUnmetSignalsInScope} unmet demand signals across ${censoringCompensatedProductsCount} products; baseline WAPE (${baselineSalesOnlyWapePercent}%) and latent-adjusted WAPE (${latentDemandAdjustedWapePercent}%) are reported transparently.`,
			comparisonNoteAr: totalUnmetSignalsInScope === 0 ? "لا توجد استفسارات طلب غير ملباة مسجلة في هذه الفترة؛ النموذج الأساسي للمبيعات ونموذج الطلب الكامن متطابقان." : improvementDemonstrated ? `دمج ${totalUnmetSignalsInScope} إشارات طلب غير ملباة عبر ${censoringCompensatedProductsCount} منتجات قلّل خطأ التعتيم الناتج عن نفاد المخزون من WAPE ${baselineSalesOnlyWapePercent}% إلى ${latentDemandAdjustedWapePercent}%.` : `تم تقييم ${totalUnmetSignalsInScope} إشارات طلب غير ملباة عبر ${censoringCompensatedProductsCount} منتجات؛ يتم عرض خطأ النموذج الأساسي (${baselineSalesOnlyWapePercent}%) والنموذج المعدل (${latentDemandAdjustedWapePercent}%) بشفافية كاملة.`
		}
	};
}
// src/analytics/insights/insights.service.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
/**
* Generates deterministic, explainable Business Insights & Actionable Recommendations
* directly grounded in the store's operational metrics.
*/
function generateExplainableInsights(params) {
	const { sales, financial, inventory, customers, branches, technicalIndicators, forecasts } = params;
	const currency = sales.currency;
	const periodLabel = `${sales.periodStart.slice(0, 10)} → ${sales.periodEnd.slice(0, 10)}`;
	const insights = [];
	const criticalReorders = inventory.products.filter((p) => p.reorderRecommendation.shouldReorder && (p.reorderRecommendation.urgency === "critical" || p.reorderRecommendation.urgency === "high" || p.abcClass === "A"));
	if (criticalReorders.length > 0) {
		const topRisk = criticalReorders[0];
		const estCost = topRisk.reorderRecommendation.estimatedOrderCost ?? 0;
		const orderCostEn = formatCurrency(estCost, currency, "en");
		const orderCostAr = formatCurrency(estCost, currency, "ar");
		insights.push({
			id: "insight-inventory-reorder-priority",
			category: "inventory_risk",
			severity: topRisk.reorderRecommendation.urgency === "critical" ? "critical" : "warning",
			titleEn: `Urgent Stock Replenishment Required (${criticalReorders.length} SKUs)`,
			titleAr: `تنبيه عاجل لإعادة طلب المخزون (${criticalReorders.length} أصناف)`,
			findingEn: `${topRisk.name} (${topRisk.sku}) has only ${topRisk.currentStock} units remaining (alert threshold: ${topRisk.minStockAlert}).`,
			findingAr: `المنتج "${topRisk.nameAr || topRisk.name}" (${topRisk.sku}) متبقٍ منه ${topRisk.currentStock} وحدات فقط (حد التنبيه: ${topRisk.minStockAlert}).`,
			metricName: "Days of Inventory on Hand (DOH)",
			metricValueFormatted: topRisk.daysOfInventoryOnHand !== null ? `${topRisk.daysOfInventoryOnHand} days` : `${topRisk.currentStock} units`,
			periodLabel,
			supportingEvidenceEn: `Classified as Class ${topRisk.abcClass} with average daily demand of ${topRisk.averageDailyDemand} units/day and ${topRisk.unitsSoldInPeriod} units sold in period.`,
			supportingEvidenceAr: `مصنف ضمن الفئة (${topRisk.abcClass}) بمعدل سحب يومي ${topRisk.averageDailyDemand} وحدة/يوم وإجمالي ${topRisk.unitsSoldInPeriod} وحدات مباعة خلال الفترة.`,
			reasonEn: `Current stock is below the safety-adjusted reorder point (${topRisk.reorderRecommendation.reorderPointUnits} units for a ${topRisk.reorderRecommendation.leadTimeDaysAssumed}-day supplier lead time).`,
			reasonAr: `الرصيد الحالي أقل من نقطة إعادة الطلب الآمنة (${topRisk.reorderRecommendation.reorderPointUnits} وحدة لزمن توريد ${topRisk.reorderRecommendation.leadTimeDaysAssumed} أيام).`,
			suggestedActionEn: `Approve purchase order for ${topRisk.reorderRecommendation.recommendedOrderQuantity} units of ${topRisk.name} (est. cost ${orderCostEn}).`,
			suggestedActionAr: `اعتمد أمر شراء بكمية ${topRisk.reorderRecommendation.recommendedOrderQuantity} وحدة من "${topRisk.nameAr || topRisk.name}" (بتكلفة تقديرية ${orderCostAr}).`,
			confidenceLevel: "high"
		});
	}
	if (sales.byProduct.length > 0) {
		const topProd = sales.byProduct[0];
		const netFormattedEn = formatCurrency(topProd.netSales, currency, "en");
		const netFormattedAr = formatCurrency(topProd.netSales, currency, "ar");
		const marginVal = topProd.grossMarginPercent ?? 0;
		const profitVal = topProd.grossProfit ?? 0;
		insights.push({
			id: "insight-sales-top-driver",
			category: "sales_momentum",
			severity: "positive",
			titleEn: `Primary Revenue Driver: ${topProd.name}`,
			titleAr: `المحرك الرئيسي للإيرادات: ${topProd.nameAr || topProd.name}`,
			findingEn: `${topProd.name} generated ${netFormattedEn} (${topProd.shareOfNetSalesPercent}% of total store net sales) with a ${marginVal}% gross margin.`,
			findingAr: `حقق "${topProd.nameAr || topProd.name}" صافي مبيعات بقيمة ${netFormattedAr} (${topProd.shareOfNetSalesPercent}% من إجمالي صافي المبيعات) بهامش ربح إجمالي ${marginVal}%.`,
			metricName: "Product Net Sales Share",
			metricValueFormatted: `${topProd.shareOfNetSalesPercent}% (${netFormattedEn})`,
			periodLabel,
			supportingEvidenceEn: `Sold ${topProd.unitsSold} units across ${topProd.transactionCount} completed invoices, contributing ${formatCurrency(profitVal, currency, "en")} in gross profit.`,
			supportingEvidenceAr: `تم بيع ${topProd.unitsSold} وحدات عبر ${topProd.transactionCount} فواتير مكتملة، بمساهمة ربح إجمالي قدرها ${formatCurrency(profitVal, currency, "ar")}.`,
			reasonEn: `High unit velocity combined with strong unit contribution margin makes this SKU the store's anchor product.`,
			reasonAr: `سرعة دوران الصنف مع هامش ربحه المرتفع يجعله المنتج الأساسي لربحية المتجر.`,
			suggestedActionEn: `Maintain zero-stockout buffer for ${topProd.name} and pair it with slower Class C items in checkout cross-sell bundles.`,
			suggestedActionAr: `حافظ على مخزون أمان دائم لمنتج "${topProd.nameAr || topProd.name}" وادمجه في عروض بيع متقاطع مع أصناف الفئة C الأقل حركة.`,
			confidenceLevel: "high"
		});
	}
	if (financial.cashFlowAndWorkingCapital.accountsReceivableOutstandingDebt > 0) {
		const arAmount = financial.cashFlowAndWorkingCapital.accountsReceivableOutstandingDebt;
		const arEn = formatCurrency(arAmount, currency, "en");
		const arAr = formatCurrency(arAmount, currency, "ar");
		const topDebtor = customers.creditExposureRanking[0];
		insights.push({
			id: "insight-financial-debt-collection",
			category: "cash_and_debt",
			severity: financial.cashFlowAndWorkingCapital.collectionEfficiencyPercent < 85 ? "warning" : "opportunity",
			titleEn: `Outstanding Customer Receivables (${arEn})`,
			titleAr: `ذمم مدينة ومستحقات عملاء غير محصلة (${arAr})`,
			findingEn: `Store collection efficiency is ${financial.cashFlowAndWorkingCapital.collectionEfficiencyPercent}%, with ${arEn} in unpaid invoice balances across ${customers.summary.customersWithDebtCount} customer(s).`,
			findingAr: `تبلغ كفاءة التحصيل النقدي ${financial.cashFlowAndWorkingCapital.collectionEfficiencyPercent}%، مع وجود مديونيات قائمة بقيمة ${arAr} موزعة على ${customers.summary.customersWithDebtCount} عملاء.`,
			metricName: "Accounts Receivable (Outstanding Debt)",
			metricValueFormatted: arEn,
			periodLabel,
			supportingEvidenceEn: topDebtor ? `Highest open balance belongs to ${topDebtor.name} (${formatCurrency(topDebtor.outstandingDebt, currency, "en")}).` : `Derived from partial and unpaid credit invoices in the active ledger.`,
			supportingEvidenceAr: topDebtor ? `أعلى رصيد مديونية مسجل باسم العميل "${topDebtor.name}" بقيمة (${formatCurrency(topDebtor.outstandingDebt, currency, "ar")}).` : `مستخرج من الفواتير الآجلة والمدفوعة جزئياً في سجل المبيعات.`,
			reasonEn: `Uncollected credit sales tie up working capital and expose the business to exchange-rate depreciation if settled later in unindexed local currency.`,
			reasonAr: `تؤدي المبيعات الآجلة غير المحصلة إلى تجميد السيولة النقدية وتعريض المتجر لمخاطر تذبذب سعر الصرف عند تأخر السداد.`,
			suggestedActionEn: `Use the Customer Credit Ledger to schedule installment collection or apply USD-indexed settlement for overdue balances.`,
			suggestedActionAr: `استخدم سجل مديونيات العملاء لتحصيل الدفعات المستحقة أو تفعيل خيار التسوية المؤشرة بسعر الصرف الحالي لحماية القيمة الشرائية.`,
			confidenceLevel: "high"
		});
	}
	const fxDelta = Math.abs(financial.fxSensitivityAndValuation.unrealizedFxTranslationDelta);
	if (fxDelta > .01) {
		const histEn = formatCurrency(financial.fxSensitivityAndValuation.netSalesAtHistoricalRate, currency, "en");
		const idxEn = formatCurrency(financial.fxSensitivityAndValuation.netSalesAtUsdIndexedRate, currency, "en");
		const deltaEn = formatCurrency(fxDelta, currency, "en");
		const deltaAr = formatCurrency(fxDelta, currency, "ar");
		insights.push({
			id: "insight-fx-purchasing-power",
			category: "fx_sensitivity",
			severity: "opportunity",
			titleEn: `Multi-Currency Valuation Variance (${deltaEn})`,
			titleAr: `فارق تقييم القوة الشرائية لأسعار الصرف (${deltaAr})`,
			findingEn: `Historical sale-rate revenue (${histEn}) differs from USD-indexed replacement value (${idxEn}) by ${deltaEn}.`,
			findingAr: `يختلف صافي المبيعات المحسوب بسعر صرف وقت البيع عن القيمة المؤشرة بالدولار للاستبدال بمقدار ${deltaAr}.`,
			metricName: "FX Purchasing Power Preservation",
			metricValueFormatted: `${financial.fxSensitivityAndValuation.fxPurchasingPowerPreservationPercent}%`,
			periodLabel,
			supportingEvidenceEn: `Invoices were recorded across historical exchange rates ranging from 2,400 to 2,700 SDG/USD.`,
			supportingEvidenceAr: `تم تحرير الفواتير التاريخية بأسعار صرف تراوحت بين 2,400 و2,700 ج.س لكل دولار.`,
			reasonEn: `When local currency exchange rates shift between the sale date and restock date, historical nominal revenue understates replacement inventory cost.`,
			reasonAr: `عند تغير سعر الصرف بين تاريخ البيع وتاريخ إعادة الشراء، فإن الإيراد الاسمي التاريخي قد لا يعكس تكلفة الاستبدال الحالية للمخزون.`,
			suggestedActionEn: `Review pricing tiers whenever exchange rates move >3% and keep historical invoices locked at sale-time rates for accurate audit trails.`,
			suggestedActionAr: `راجع تسعير الأصناف عند تحرك سعر الصرف بأكثر من 3% مع الحفاظ على تثبيت الفواتير التاريخية بسعر صرف وقت البيع لضمان دقة المراجعة المحاسبية.`,
			confidenceLevel: "high"
		});
	}
	const deadSkus = inventory.products.filter((p) => p.movementVelocityClass === "dead_stock" && p.currentStock > 0);
	if (deadSkus.length > 0) {
		const lockedCost = deadSkus.reduce((acc, p) => acc + (p.inventoryValueAtCost ?? 0), 0);
		const lockedEn = formatCurrency(lockedCost, currency, "en");
		const lockedAr = formatCurrency(lockedCost, currency, "ar");
		const sampleNamesEn = deadSkus.slice(0, 2).map((p) => p.name).join(", ");
		const sampleNamesAr = deadSkus.slice(0, 2).map((p) => p.nameAr || p.name).join("، ");
		insights.push({
			id: "insight-inventory-dead-stock",
			category: "inventory_risk",
			severity: "opportunity",
			titleEn: `${deadSkus.length} Zero-Velocity SKU(s) Locking ${lockedEn}`,
			titleAr: `${deadSkus.length} أصناف راكدة بدون مبيعات تجمد ${lockedAr}`,
			findingEn: `${deadSkus.length} stocked product(s) (${sampleNamesEn}) recorded zero unit sales during the selected period.`,
			findingAr: `سجلت ${deadSkus.length} أصناف متوفرة بالمخزون (${sampleNamesAr}) مبيعات صفرية خلال الفترة المحددة.`,
			metricName: "Dead Stock Capital at Cost",
			metricValueFormatted: lockedEn,
			periodLabel,
			supportingEvidenceEn: `Total of ${deadSkus.reduce((a, b) => a + b.currentStock, 0)} units sitting idle in Class C inventory.`,
			supportingEvidenceAr: `إجمالي ${deadSkus.reduce((a, b) => a + b.currentStock, 0)} وحدة راكدة ضمن تصنيف الفئة C.`,
			reasonEn: `Capital tied up in zero-turnover items reduces liquidity available for replenishing Class A bestsellers.`,
			reasonAr: `رأس المال المجمد في الأصناف بطيئة أو عديمة الدوران يقلل السيولة المتاحة لتمويل أصناف الفئة A السريعة.`,
			suggestedActionEn: `Pause restocking for ${sampleNamesEn} and test a 10–15% combo discount with high-traffic beverages.`,
			suggestedActionAr: `أوقف إعادة طلب (${sampleNamesAr}) مؤقتاً وفعّل خصماً ترويجياً بنسبة 10–15% عند شرائها مع المشروبات الأكثر طلباً.`,
			confidenceLevel: "medium"
		});
	}
	const forecastTotalEn = formatCurrency(forecasts.revenueForecastSummary.expectedTotalNetSales, currency, "en");
	const forecastTotalAr = formatCurrency(forecasts.revenueForecastSummary.expectedTotalNetSales, currency, "ar");
	const bestEval = forecasts.backtestEvaluations[0];
	insights.push({
		id: "insight-forecast-outlook",
		category: "sales_momentum",
		severity: technicalIndicators.latestValues.trendDirection === "upward" ? "positive" : "opportunity",
		titleEn: `${forecasts.horizonDays}-Day Projected Net Revenue: ${forecastTotalEn}`,
		titleAr: `توقعات صافي المبيعات خلال ${forecasts.horizonDays} أيام القادمة: ${forecastTotalAr}`,
		findingEn: `Statistical model (${forecasts.selectedModelNameEn}) projects ${forecastTotalEn} in net sales over the next ${forecasts.horizonDays} days (${forecasts.intervalLabelEn}: ${formatCurrency(forecasts.revenueForecastSummary.lowerBound80Total, currency, "en")} – ${formatCurrency(forecasts.revenueForecastSummary.upperBound80Total, currency, "en")}).`,
		findingAr: `يتوقع النموذج الإحصائي (${forecasts.selectedModelNameAr}) تحقيق صافي مبيعات بقيمة ${forecastTotalAr} خلال الـ ${forecasts.horizonDays} أيام القادمة (${forecasts.intervalLabelAr}: ${formatCurrency(forecasts.revenueForecastSummary.lowerBound80Total, currency, "ar")} – ${formatCurrency(forecasts.revenueForecastSummary.upperBound80Total, currency, "ar")}).`,
		metricName: "Backtested Forecast WAPE",
		metricValueFormatted: `WAPE ${bestEval?.wapePercent ?? 0}%`,
		periodLabel: `Next ${forecasts.horizonDays} Days`,
		supportingEvidenceEn: `Selected via rolling-origin backtesting across ${forecasts.backtestEvaluations.length} models; linear trend slope is ${technicalIndicators.latestValues.trendSlopePerDay} ${currency}/day.`,
		supportingEvidenceAr: `تم اختيار النموذج عبر الاختبار العكسي المتدحرج بين ${forecasts.backtestEvaluations.length} نماذج؛ ميل خط الاتجاه العام يبلغ ${technicalIndicators.latestValues.trendSlopePerDay} ${currency}/يوم.`,
		reasonEn: `Combines historical daily revenue velocity, moving average momentum, and day-of-week seasonality.`,
		reasonAr: `يجمع التوقع بين سرعة الإيرادات اليومية التاريخية وزخم المتوسطات المتحركة والموسمية الأسبوعية.`,
		suggestedActionEn: `Align cash float and supplier restock schedules with the projected ${formatCurrency(forecasts.revenueForecastSummary.expectedAverageDailySales, currency, "en")}/day demand rate.`,
		suggestedActionAr: `اضبط السيولة النقدية وجدول توريد المشتريات بما يتوافق مع معدل المبيعات اليومي المتوقع (${formatCurrency(forecasts.revenueForecastSummary.expectedAverageDailySales, currency, "ar")}/يوم).`,
		confidenceLevel: forecasts.dataQualityStatus === "high_confidence" ? "high" : forecasts.dataQualityStatus === "moderate_confidence" ? "medium" : "low"
	});
	if (branches.branches.length > 0) {
		const topBranch = branches.branches[0];
		const branchMargin = topBranch.grossMarginPercent ?? 0;
		insights.push({
			id: "insight-branch-performance",
			category: "branch_and_staff",
			severity: "positive",
			titleEn: `Top Performing Branch: ${topBranch.branchName}`,
			titleAr: `الفرع الأعلى أداءً: ${topBranch.branchNameAr}`,
			findingEn: `${topBranch.branchName} generated ${formatCurrency(topBranch.netSales, currency, "en")} (${topBranch.revenueSharePercent}% share) with an average ticket of ${formatCurrency(topBranch.averageTransactionValue, currency, "en")}.`,
			findingAr: `حقق "${topBranch.branchNameAr}" صافي مبيعات ${formatCurrency(topBranch.netSales, currency, "ar")} (بحصة ${topBranch.revenueSharePercent}%) ومتوسط فاتورة ${formatCurrency(topBranch.averageTransactionValue, currency, "ar")}.`,
			metricName: "Branch Gross Margin & Collection",
			metricValueFormatted: `Margin ${branchMargin}% | Collection ${topBranch.collectionRatePercent}%`,
			periodLabel,
			supportingEvidenceEn: `Processed ${topBranch.transactionCount} completed orders (${topBranch.unitsSold} units) across ${topBranch.activeCashiersCount} active terminal(s).`,
			supportingEvidenceAr: `نفذ ${topBranch.transactionCount} فاتورة مكتملة (${topBranch.unitsSold} وحدة) عبر ${topBranch.activeCashiersCount} نقطة بيع نشطة.`,
			reasonEn: `Strong order volume and disciplined discount control maintained high branch profitability.`,
			reasonAr: `ساهم ارتفاع حجم الطلبات والانضباط في منح الخصومات في الحفاظ على ربحية الفرع.`,
			suggestedActionEn: `Use ${topBranch.branchName}'s product mix and peak-hour staffing as the benchmark for secondary terminals.`,
			suggestedActionAr: `اعتمد تشكيلة منتجات وجدولة أوقات الذروة في "${topBranch.branchNameAr}" كمعيار مرجعي لبقية الفروع ونقاط البيع.`,
			confidenceLevel: "high"
		});
	}
	return insights;
}
// src/analytics/calculations/unmet-demand.metrics.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*
* Phase 10 (Part 4C & 4D): Customer Demand Intelligence & Lost Sales Estimation Engine
* Pure, deterministic O(N) analytical calculations for unmet customer demand.
* Strictly separated from completed sales, inventory stock, and accounting ledgers.
*/
function round2$1(val) {
	if (!Number.isFinite(val)) return 0;
	return Math.round((val + Number.EPSILON) * 100) / 100;
}
function formatDateKey(date) {
	return toDateKey(date);
}
function resolveDateRange(filters, now) {
	const win = resolveAnalyticsDateWindow(filters, now);
	return {
		start: win.startDate,
		end: win.endDate
	};
}
function convertSdgToTargetCurrency(amountInSdg, targetCurrency, liveRates) {
	return convertCurrencyAmount(amountInSdg, "SDG", targetCurrency, liveRates);
}
var REASON_LABELS = {
	OUT_OF_STOCK: {
		en: "Out of Stock (Zero Inventory)",
		ar: "نفاد المخزون (الرصيد صفر)"
	},
	EXPIRED: {
		en: "Expired Batch On Shelf",
		ar: "المنتج منتهي الصلاحية"
	},
	NOT_STOCKED: {
		en: "Unregistered / Not Stocked in Store",
		ar: "غير مسجل أو غير متوفر بالمتجر"
	},
	TEMPORARILY_UNAVAILABLE: {
		en: "Temporarily Unavailable / In Transit",
		ar: "غير متوفر مؤقتاً / قيد التوريد"
	},
	OTHER: {
		en: "Other Unavailability Reason",
		ar: "سبب آخر لعدم التوفر"
	}
};
function getIsoWeekKey(date) {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	const dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 864e5 + 1) / 7);
	const key = `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
	return {
		key,
		label: key
	};
}
function getMonthKey(date) {
	const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
	return {
		key,
		label: key
	};
}
/**
* Converts a request's unit selling/cost price snapshot into the target analytics display currency.
*/
function convertPriceSnapshotToTarget(amount, currencySnapshot, exchangeRateSnapshot, targetCurrency, liveRates) {
	if (amount === null || amount === void 0 || !Number.isFinite(amount) || amount <= 0) return null;
	const srcCurr = (currencySnapshot || "SDG").toUpperCase();
	return convertSdgToTargetCurrency(amount * (srcCurr === "SDG" ? 1 : Number(exchangeRateSnapshot) > 0 ? Number(exchangeRateSnapshot) : Number(liveRates[srcCurr]) > 0 ? Number(liveRates[srcCurr]) : 1), targetCurrency, liveRates);
}
function computeUnmetDemandAnalytics(dataset, filters, sales, inventory, userContext, now = /* @__PURE__ */ new Date()) {
	const currency = filters.currency || "SDG";
	const canViewPII = userContext?.canViewCustomerPII ?? false;
	const canViewCost = userContext?.canViewCostAndMargin ?? false;
	const { start, end } = resolveDateRange(filters, now);
	const startMs = start.getTime();
	const endMs = end.getTime();
	const branchFilter = filters.branchId && filters.branchId !== "all" ? filters.branchId : null;
	const categoryFilter = filters.category && filters.category !== "all" ? filters.category.toLowerCase() : null;
	const productFilter = filters.productId && filters.productId !== "all" ? filters.productId : null;
	const rawRequests = Array.isArray(dataset.unmetDemandRequests) ? dataset.unmetDemandRequests : [];
	const invByProductId = /* @__PURE__ */ new Map();
	for (const invItem of inventory.products) invByProductId.set(invItem.productId, invItem);
	const salesByProductId = /* @__PURE__ */ new Map();
	for (const sProd of sales.byProduct) salesByProductId.set(sProd.id, sProd);
	const filteredRequests = [];
	for (const req of rawRequests) {
		if (!req || !req.id) continue;
		if (req.fulfillmentStatus === "cancelled") continue;
		const ts = new Date(req.requestedTimestamp).getTime();
		if (Number.isNaN(ts) || ts < startMs || ts > endMs) continue;
		if (branchFilter && req.branchId !== branchFilter) continue;
		if (categoryFilter && (req.categorySnapshot || "").toLowerCase() !== categoryFilter) continue;
		if (productFilter && req.productId !== productFilter) continue;
		filteredRequests.push(req);
	}
	filteredRequests.sort((a, b) => new Date(a.requestedTimestamp).getTime() - new Date(b.requestedTimestamp).getTime());
	let totalInquiries = 0;
	let totalRequestedQuantity = 0;
	let totalRequestedBaseUnits = 0;
	let confirmedIntentInquiries = 0;
	let confirmedIntentBaseUnits = 0;
	let registeredProductInquiries = 0;
	let unregisteredProductInquiries = 0;
	let fulfilledLaterCount = 0;
	let unfulfilledCount = 0;
	let repeatCustomerInquiries = 0;
	let pricedInquiriesCount = 0;
	let dedupedConfirmedWeightedUnitsTotal = 0;
	let estimatedLostRevenueTotal = 0;
	let estimatedLostGrossProfitTotal = 0;
	let pricedCostInquiriesCount = 0;
	const reasonMap = /* @__PURE__ */ new Map();
	for (const r of SUPPORTED_UNAVAILABILITY_REASONS) reasonMap.set(r, {
		inquiryCount: 0,
		requestedBaseUnits: 0
	});
	const productMap = /* @__PURE__ */ new Map();
	const categoryMap = /* @__PURE__ */ new Map();
	const branchMap = /* @__PURE__ */ new Map();
	for (const b of dataset.branches) {
		if (branchFilter && b.id !== branchFilter) continue;
		branchMap.set(b.id, {
			branchId: b.id,
			branchName: b.name,
			branchNameAr: b.nameAr,
			inquiryCount: 0,
			requestedBaseUnits: 0,
			productsSet: /* @__PURE__ */ new Set(),
			outOfStockInquiries: 0,
			notStockedInquiries: 0,
			expiredInquiries: 0,
			estimatedLostRevenue: 0,
			pricedCount: 0,
			productCounts: /* @__PURE__ */ new Map()
		});
	}
	const dailySalesMap = /* @__PURE__ */ new Map();
	for (const ds of sales.dailySeries) dailySalesMap.set(ds.dateKey, ds.unitsSold);
	const dailyBuckets = /* @__PURE__ */ new Map();
	const weeklyBuckets = /* @__PURE__ */ new Map();
	const monthlyBuckets = /* @__PURE__ */ new Map();
	for (const ds of sales.dailySeries) {
		dailyBuckets.set(ds.dateKey, {
			periodKey: ds.dateKey,
			label: ds.label,
			inquiryCount: 0,
			requestedBaseUnits: 0,
			confirmedIntentUnits: 0,
			registeredProductInquiries: 0,
			unregisteredProductInquiries: 0,
			estimatedLostRevenue: 0,
			pricedCount: 0
		});
		const dObj = /* @__PURE__ */ new Date(`${ds.dateKey}T12:00:00.000Z`);
		const wk = getIsoWeekKey(dObj);
		const wkEntry = weeklyBuckets.get(wk.key) || {
			periodKey: wk.key,
			label: wk.label,
			inquiryCount: 0,
			requestedBaseUnits: 0,
			confirmedIntentUnits: 0,
			actualUnitsSold: 0,
			registeredProductInquiries: 0,
			unregisteredProductInquiries: 0,
			estimatedLostRevenue: 0,
			pricedCount: 0
		};
		wkEntry.actualUnitsSold += ds.unitsSold;
		weeklyBuckets.set(wk.key, wkEntry);
		const mo = getMonthKey(dObj);
		const moEntry = monthlyBuckets.get(mo.key) || {
			periodKey: mo.key,
			label: mo.label,
			inquiryCount: 0,
			requestedBaseUnits: 0,
			confirmedIntentUnits: 0,
			actualUnitsSold: 0,
			registeredProductInquiries: 0,
			unregisteredProductInquiries: 0,
			estimatedLostRevenue: 0,
			pricedCount: 0
		};
		moEntry.actualUnitsSold += ds.unitsSold;
		monthlyBuckets.set(mo.key, moEntry);
	}
	for (const req of filteredRequests) {
		totalInquiries += 1;
		const qty = Math.max(1, Number(req.requestedQuantity || 1));
		const baseUnits = Math.max(1, Number(req.requestedBaseUnits || qty));
		totalRequestedQuantity += qty;
		totalRequestedBaseUnits += baseUnits;
		if (req.confirmedPurchaseIntent) {
			confirmedIntentInquiries += 1;
			confirmedIntentBaseUnits += baseUnits;
		}
		if (req.isRegisteredProduct && req.productId) registeredProductInquiries += 1;
		else unregisteredProductInquiries += 1;
		if (req.fulfillmentStatus === "fulfilled_later") fulfilledLaterCount += 1;
		else unfulfilledCount += 1;
		const reason = SUPPORTED_UNAVAILABILITY_REASONS.includes(req.unavailabilityReason) ? req.unavailabilityReason : "OUT_OF_STOCK";
		const rBucket = reasonMap.get(reason);
		rBucket.inquiryCount += 1;
		rBucket.requestedBaseUnits += baseUnits;
		const prodKey = req.productId || (req.barcode ? `barcode:${req.barcode}` : null) || `unreg:${normalizeUnavailableSearchText(req.productNameSnapshot || "unknown")}`;
		let prodAcc = productMap.get(prodKey);
		if (!prodAcc) {
			prodAcc = {
				productKey: prodKey,
				productId: req.productId || null,
				isRegisteredProduct: Boolean(req.isRegisteredProduct && req.productId),
				productName: req.productNameSnapshot,
				productNameAr: req.productNameArSnapshot || null,
				sku: req.skuSnapshot || null,
				barcode: req.barcode || null,
				category: req.categorySnapshot || "General",
				inquiryCount: 0,
				requestedQuantityTotal: 0,
				requestedBaseUnitsTotal: 0,
				confirmedPurchaseIntentCount: 0,
				confirmedPurchaseIntentUnits: 0,
				fulfilledLaterCount: 0,
				unfulfilledCount: 0,
				repeatCustomerInquiryCount: 0,
				branchesSet: /* @__PURE__ */ new Set(),
				reasonBreakdown: {
					OUT_OF_STOCK: 0,
					EXPIRED: 0,
					NOT_STOCKED: 0,
					TEMPORARILY_UNAVAILABLE: 0,
					OTHER: 0
				},
				stockoutOverlapInquiriesCount: 0,
				weightedLostUnits: 0,
				pricedLostUnits: 0,
				estimatedLostRevenue: 0,
				estimatedLostProfit: 0,
				hasValidCostForProfit: false,
				firstRequestedAt: req.requestedTimestamp,
				lastRequestedAt: req.requestedTimestamp,
				inquiryTimestamps: [],
				customerLastSeenMs: /* @__PURE__ */ new Map()
			};
			productMap.set(prodKey, prodAcc);
		}
		prodAcc.inquiryCount += 1;
		prodAcc.requestedQuantityTotal += qty;
		prodAcc.requestedBaseUnitsTotal += baseUnits;
		if (req.confirmedPurchaseIntent) {
			prodAcc.confirmedPurchaseIntentCount += 1;
			prodAcc.confirmedPurchaseIntentUnits += baseUnits;
		}
		if (req.fulfillmentStatus === "fulfilled_later") prodAcc.fulfilledLaterCount += 1;
		else prodAcc.unfulfilledCount += 1;
		prodAcc.branchesSet.add(req.branchId || "branch-main");
		prodAcc.reasonBreakdown[reason] = (prodAcc.reasonBreakdown[reason] || 0) + 1;
		if (req.availabilityStatus === "OUT_OF_STOCK" || req.availabilityStatus === "INSUFFICIENT_QUANTITY" || req.availableStockAtRequest !== null && req.availableStockAtRequest <= 0) prodAcc.stockoutOverlapInquiriesCount += 1;
		if (req.requestedTimestamp < prodAcc.firstRequestedAt) prodAcc.firstRequestedAt = req.requestedTimestamp;
		if (req.requestedTimestamp > prodAcc.lastRequestedAt) prodAcc.lastRequestedAt = req.requestedTimestamp;
		prodAcc.inquiryTimestamps.push(req.requestedTimestamp);
		const custIdentity = (req.customerId || req.customerReference || "").trim().toLowerCase();
		const reqMs = new Date(req.requestedTimestamp).getTime();
		let isRepeatCustomerWithin24h = false;
		if (custIdentity) {
			const prevSeen = prodAcc.customerLastSeenMs.get(custIdentity);
			if (prevSeen !== void 0) {
				prodAcc.repeatCustomerInquiryCount += 1;
				repeatCustomerInquiries += 1;
				if (Math.abs(reqMs - prevSeen) <= 864e5) isRepeatCustomerWithin24h = true;
			}
			prodAcc.customerLastSeenMs.set(custIdentity, reqMs);
		}
		const weightedUnits = baseUnits * (req.fulfillmentStatus === "fulfilled_later" ? 0 : isRepeatCustomerWithin24h ? .15 : req.confirmedPurchaseIntent ? .65 : .35);
		prodAcc.weightedLostUnits += weightedUnits;
		dedupedConfirmedWeightedUnitsTotal += weightedUnits;
		const invItem = req.productId ? invByProductId.get(req.productId) : void 0;
		const unitSellConverted = convertPriceSnapshotToTarget(req.unitSellingPriceSnapshot ?? null, req.currencySnapshot, req.exchangeRateSnapshot ?? 1, currency, dataset.exchangeRates) ?? (invItem && invItem.unitSellingPrice > 0 ? invItem.unitSellingPrice : null);
		const unitCostConverted = convertPriceSnapshotToTarget(req.unitCostPriceSnapshot ?? req.unitCostSnapshot ?? null, req.currencySnapshot, req.exchangeRateSnapshot ?? 1, currency, dataset.exchangeRates) ?? (invItem && invItem.unitCost !== null && invItem.unitCost > 0 ? invItem.unitCost : null);
		let reqEstimatedLostRevenue = 0;
		if (unitSellConverted !== null && unitSellConverted > 0) {
			pricedInquiriesCount += 1;
			const perBaseUnitSell = req.saleUnitMode === "pack" && baseUnits > qty ? unitSellConverted / (baseUnits / qty) : unitSellConverted;
			reqEstimatedLostRevenue = weightedUnits * perBaseUnitSell;
			prodAcc.pricedLostUnits += weightedUnits;
			prodAcc.estimatedLostRevenue += reqEstimatedLostRevenue;
			estimatedLostRevenueTotal += reqEstimatedLostRevenue;
			if (canViewCost && unitCostConverted !== null && unitCostConverted > 0) {
				const perBaseUnitCost = req.saleUnitMode === "pack" && baseUnits > qty ? unitCostConverted / (baseUnits / qty) : unitCostConverted;
				const lostProfit = weightedUnits * Math.max(0, perBaseUnitSell - perBaseUnitCost);
				prodAcc.estimatedLostProfit += lostProfit;
				prodAcc.hasValidCostForProfit = true;
				estimatedLostGrossProfitTotal += lostProfit;
				pricedCostInquiriesCount += 1;
			}
		}
		const catName = req.categorySnapshot || "General";
		const catAcc = categoryMap.get(catName) || {
			inquiryCount: 0,
			requestedBaseUnits: 0,
			productsSet: /* @__PURE__ */ new Set(),
			estimatedLostRevenue: 0,
			pricedCount: 0
		};
		catAcc.inquiryCount += 1;
		catAcc.requestedBaseUnits += baseUnits;
		catAcc.productsSet.add(prodKey);
		if (reqEstimatedLostRevenue > 0) {
			catAcc.estimatedLostRevenue += reqEstimatedLostRevenue;
			catAcc.pricedCount += 1;
		}
		categoryMap.set(catName, catAcc);
		const bId = req.branchId || "branch-main";
		let bAcc = branchMap.get(bId);
		if (!bAcc) {
			bAcc = {
				branchId: bId,
				branchName: bId,
				branchNameAr: bId,
				inquiryCount: 0,
				requestedBaseUnits: 0,
				productsSet: /* @__PURE__ */ new Set(),
				outOfStockInquiries: 0,
				notStockedInquiries: 0,
				expiredInquiries: 0,
				estimatedLostRevenue: 0,
				pricedCount: 0,
				productCounts: /* @__PURE__ */ new Map()
			};
			branchMap.set(bId, bAcc);
		}
		bAcc.inquiryCount += 1;
		bAcc.requestedBaseUnits += baseUnits;
		bAcc.productsSet.add(prodKey);
		if (reason === "OUT_OF_STOCK") bAcc.outOfStockInquiries += 1;
		if (reason === "NOT_STOCKED") bAcc.notStockedInquiries += 1;
		if (reason === "EXPIRED") bAcc.expiredInquiries += 1;
		if (reqEstimatedLostRevenue > 0) {
			bAcc.estimatedLostRevenue += reqEstimatedLostRevenue;
			bAcc.pricedCount += 1;
		}
		const existingProdInBranch = bAcc.productCounts.get(prodKey) || {
			name: req.productNameSnapshot,
			units: 0
		};
		existingProdInBranch.units += baseUnits;
		bAcc.productCounts.set(prodKey, existingProdInBranch);
		const reqDateObj = new Date(req.requestedTimestamp);
		const dayKey = formatDateKey(reqDateObj);
		const dayEntry = dailyBuckets.get(dayKey) || {
			periodKey: dayKey,
			label: dayKey.slice(5),
			inquiryCount: 0,
			requestedBaseUnits: 0,
			confirmedIntentUnits: 0,
			registeredProductInquiries: 0,
			unregisteredProductInquiries: 0,
			estimatedLostRevenue: 0,
			pricedCount: 0
		};
		dayEntry.inquiryCount += 1;
		dayEntry.requestedBaseUnits += baseUnits;
		if (req.confirmedPurchaseIntent) dayEntry.confirmedIntentUnits += baseUnits;
		if (req.isRegisteredProduct && req.productId) dayEntry.registeredProductInquiries += 1;
		else dayEntry.unregisteredProductInquiries += 1;
		if (reqEstimatedLostRevenue > 0) {
			dayEntry.estimatedLostRevenue += reqEstimatedLostRevenue;
			dayEntry.pricedCount += 1;
		}
		dailyBuckets.set(dayKey, dayEntry);
		const wk = getIsoWeekKey(reqDateObj);
		const wkEntry = weeklyBuckets.get(wk.key) || {
			periodKey: wk.key,
			label: wk.label,
			inquiryCount: 0,
			requestedBaseUnits: 0,
			confirmedIntentUnits: 0,
			actualUnitsSold: 0,
			registeredProductInquiries: 0,
			unregisteredProductInquiries: 0,
			estimatedLostRevenue: 0,
			pricedCount: 0
		};
		wkEntry.inquiryCount += 1;
		wkEntry.requestedBaseUnits += baseUnits;
		if (req.confirmedPurchaseIntent) wkEntry.confirmedIntentUnits += baseUnits;
		if (req.isRegisteredProduct && req.productId) wkEntry.registeredProductInquiries += 1;
		else wkEntry.unregisteredProductInquiries += 1;
		if (reqEstimatedLostRevenue > 0) {
			wkEntry.estimatedLostRevenue += reqEstimatedLostRevenue;
			wkEntry.pricedCount += 1;
		}
		weeklyBuckets.set(wk.key, wkEntry);
		const mo = getMonthKey(reqDateObj);
		const moEntry = monthlyBuckets.get(mo.key) || {
			periodKey: mo.key,
			label: mo.label,
			inquiryCount: 0,
			requestedBaseUnits: 0,
			confirmedIntentUnits: 0,
			actualUnitsSold: 0,
			registeredProductInquiries: 0,
			unregisteredProductInquiries: 0,
			estimatedLostRevenue: 0,
			pricedCount: 0
		};
		moEntry.inquiryCount += 1;
		moEntry.requestedBaseUnits += baseUnits;
		if (req.confirmedPurchaseIntent) moEntry.confirmedIntentUnits += baseUnits;
		if (req.isRegisteredProduct && req.productId) moEntry.registeredProductInquiries += 1;
		else moEntry.unregisteredProductInquiries += 1;
		if (reqEstimatedLostRevenue > 0) {
			moEntry.estimatedLostRevenue += reqEstimatedLostRevenue;
			moEntry.pricedCount += 1;
		}
		monthlyBuckets.set(mo.key, moEntry);
	}
	let repeatedStockoutProductsCount = 0;
	const allProductSummaries = [];
	for (const acc of productMap.values()) {
		const invItem = acc.productId ? invByProductId.get(acc.productId) : void 0;
		const sItem = acc.productId ? salesByProductId.get(acc.productId) : void 0;
		const currentStock = invItem ? invItem.currentStock : null;
		const pendingInboundUnits = invItem ? invItem.pendingInboundPurchaseUnits : 0;
		const actualUnitsSoldInPeriod = sItem ? sItem.unitsSold : 0;
		const actualNetSalesInPeriod = sItem ? sItem.netSales : 0;
		const totalCombinedUnits = actualUnitsSoldInPeriod + acc.requestedBaseUnitsTotal;
		const demandCaptureRatioPercent = totalCombinedUnits > 0 ? round2$1(actualUnitsSoldInPeriod / totalCombinedUnits * 100) : null;
		let primaryReason = "OUT_OF_STOCK";
		let maxReasonCount = -1;
		for (const r of SUPPORTED_UNAVAILABILITY_REASONS) if ((acc.reasonBreakdown[r] || 0) > maxReasonCount) {
			maxReasonCount = acc.reasonBreakdown[r] || 0;
			primaryReason = r;
		}
		const repeatedStockoutPatternDetected = Boolean(acc.isRegisteredProduct && (acc.reasonBreakdown.OUT_OF_STOCK >= 2 || acc.stockoutOverlapInquiriesCount >= 2) && (actualUnitsSoldInPeriod > 0 || currentStock !== null && invItem && currentStock <= invItem.minStockAlert));
		if (repeatedStockoutPatternDetected) repeatedStockoutProductsCount += 1;
		const hasSufficientPricing = acc.pricedLostUnits > 0 && acc.estimatedLostRevenue > 0;
		const lostSalesEstimationStatus = hasSufficientPricing ? "ESTIMATED" : "INSUFFICIENT_DATA";
		let lostSalesConfidence = "INSUFFICIENT_DATA";
		if (hasSufficientPricing) {
			if (acc.inquiryCount >= 5 && acc.confirmedPurchaseIntentCount >= 2) lostSalesConfidence = "HIGH";
			else if (acc.inquiryCount >= 2) lostSalesConfidence = "MEDIUM";
			else lostSalesConfidence = "LOW";
		}
		const sortedInquiryTimestamps = [...acc.inquiryTimestamps].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
		let decisionPriority = "LOW";
		let decisionRecommendationAr = "";
		let decisionRecommendationEn = "";
		if (acc.inquiryCount >= 3 || acc.requestedBaseUnitsTotal >= 5) {
			decisionPriority = "CRITICAL";
			decisionRecommendationAr = acc.isRegisteredProduct ? `أولوية قصوى: تم السؤال عنه ${acc.inquiryCount} مرات في أوقات مختلفة (${acc.requestedBaseUnitsTotal} وحدة) — يجب إعادة التوريد العاجل ورفع حد الطلب الأدنى.` : `أولوية قصوى: منتج غير مسجل سُئل عنه ${acc.inquiryCount} مرات في أوقات مختلفة (${acc.requestedBaseUnitsTotal} وحدة) — يُوصى بإدراجه في الكتالوج وتوفيره فوراً.`;
			decisionRecommendationEn = acc.isRegisteredProduct ? `Critical Priority: Asked ${acc.inquiryCount} times across different timestamps (${acc.requestedBaseUnitsTotal} units) — Urgent restock & raise min stock alert.` : `Critical Priority: Unregistered item asked ${acc.inquiryCount} times across different timestamps (${acc.requestedBaseUnitsTotal} units) — Add to catalog & source immediately.`;
		} else if (acc.inquiryCount === 2 || acc.confirmedPurchaseIntentCount >= 1) {
			decisionPriority = "HIGH";
			decisionRecommendationAr = acc.isRegisteredProduct ? `طلب متكرر (${acc.inquiryCount} مرات) مع نية شراء مؤكدة — يُوصى بطلب كمية تعويضية (${Math.max(5, acc.requestedBaseUnitsTotal * 2)} وحدات).` : `طلب متكرر (${acc.inquiryCount} مرات) — يُوصى بالتواصل مع المورد لتسعيره وإضافته للأصناف المعتمدة.`;
			decisionRecommendationEn = acc.isRegisteredProduct ? `Repeated demand (${acc.inquiryCount} inquiries) — Recommend ordering replenishment batch (${Math.max(5, acc.requestedBaseUnitsTotal * 2)} units).` : `Repeated demand (${acc.inquiryCount} inquiries) — Contact supplier for pricing and catalog onboarding.`;
		} else {
			decisionPriority = "MEDIUM";
			decisionRecommendationAr = `تم تسجيل سؤال أولي (${acc.requestedBaseUnitsTotal} وحدة) — راقب تكرار الطلب في قاعدة المنتجات غير المتوفرة لاتخاذ قرار التوريد.`;
			decisionRecommendationEn = `Initial inquiry logged (${acc.requestedBaseUnitsTotal} units) — Monitor repeat inquiries in the Unavailable Products Database.`;
		}
		allProductSummaries.push({
			productKey: acc.productKey,
			productId: acc.productId,
			isRegisteredProduct: acc.isRegisteredProduct,
			productName: acc.productName,
			productNameAr: acc.productNameAr,
			sku: acc.sku,
			barcode: acc.barcode,
			category: acc.category,
			inquiryCount: acc.inquiryCount,
			requestedQuantityTotal: acc.requestedQuantityTotal,
			requestedBaseUnitsTotal: acc.requestedBaseUnitsTotal,
			confirmedPurchaseIntentCount: acc.confirmedPurchaseIntentCount,
			confirmedPurchaseIntentUnits: acc.confirmedPurchaseIntentUnits,
			fulfilledLaterCount: acc.fulfilledLaterCount,
			unfulfilledCount: acc.unfulfilledCount,
			repeatCustomerInquiryCount: acc.repeatCustomerInquiryCount,
			distinctBranchesCount: acc.branchesSet.size,
			branchesRequested: Array.from(acc.branchesSet),
			primaryReason,
			reasonBreakdown: acc.reasonBreakdown,
			currentStock,
			pendingInboundUnits,
			actualUnitsSoldInPeriod,
			actualNetSalesInPeriod: round2$1(actualNetSalesInPeriod),
			demandCaptureRatioPercent,
			repeatedStockoutPatternDetected,
			stockoutOverlapInquiriesCount: acc.stockoutOverlapInquiriesCount,
			estimatedLostUnitsConservative: round2$1(acc.weightedLostUnits),
			estimatedLostRevenueConservative: hasSufficientPricing ? round2$1(acc.estimatedLostRevenue) : null,
			estimatedLostGrossProfitConservative: canViewCost && acc.hasValidCostForProfit ? round2$1(acc.estimatedLostProfit) : null,
			lostSalesEstimationStatus,
			lostSalesConfidence,
			firstRequestedAt: acc.firstRequestedAt,
			lastRequestedAt: acc.lastRequestedAt,
			inquiryTimestamps: sortedInquiryTimestamps,
			decisionPriority,
			decisionRecommendationAr,
			decisionRecommendationEn
		});
	}
	allProductSummaries.sort((a, b) => {
		if (b.requestedBaseUnitsTotal !== a.requestedBaseUnitsTotal) return b.requestedBaseUnitsTotal - a.requestedBaseUnitsTotal;
		return b.inquiryCount - a.inquiryCount;
	});
	const topRequestedProducts = allProductSummaries.slice(0, 25);
	const unregisteredProductsDemand = allProductSummaries.filter((p) => !p.isRegisteredProduct || p.primaryReason === "NOT_STOCKED");
	const byReason = SUPPORTED_UNAVAILABILITY_REASONS.map((reason) => {
		const r = reasonMap.get(reason);
		return {
			reason,
			labelEn: REASON_LABELS[reason].en,
			labelAr: REASON_LABELS[reason].ar,
			inquiryCount: r.inquiryCount,
			requestedBaseUnits: r.requestedBaseUnits,
			sharePercent: totalRequestedBaseUnits > 0 ? round2$1(r.requestedBaseUnits / totalRequestedBaseUnits * 100) : 0
		};
	});
	const byCategory = Array.from(categoryMap.entries()).map(([category, c]) => ({
		category,
		inquiryCount: c.inquiryCount,
		requestedBaseUnits: c.requestedBaseUnits,
		distinctProducts: c.productsSet.size,
		estimatedLostRevenue: c.pricedCount > 0 ? round2$1(c.estimatedLostRevenue) : null
	})).sort((a, b) => b.requestedBaseUnits - a.requestedBaseUnits);
	const byBranch = Array.from(branchMap.values()).map((b) => {
		let topProd = null;
		let topUnits = 0;
		for (const p of b.productCounts.values()) if (p.units > topUnits) {
			topUnits = p.units;
			topProd = p.name;
		}
		return {
			branchId: b.branchId,
			branchName: b.branchName,
			branchNameAr: b.branchNameAr,
			inquiryCount: b.inquiryCount,
			requestedBaseUnits: b.requestedBaseUnits,
			distinctProductsRequested: b.productsSet.size,
			outOfStockInquiries: b.outOfStockInquiries,
			notStockedInquiries: b.notStockedInquiries,
			expiredInquiries: b.expiredInquiries,
			estimatedLostRevenue: b.pricedCount > 0 ? round2$1(b.estimatedLostRevenue) : null,
			topRequestedProductName: topProd
		};
	}).sort((a, b) => b.requestedBaseUnits - a.requestedBaseUnits);
	const dailyTrends = Array.from(dailyBuckets.values()).sort((a, b) => a.periodKey.localeCompare(b.periodKey)).map((d) => ({
		periodKey: d.periodKey,
		label: d.label,
		granularity: "daily",
		inquiryCount: d.inquiryCount,
		requestedBaseUnits: d.requestedBaseUnits,
		confirmedIntentUnits: d.confirmedIntentUnits,
		actualUnitsSold: dailySalesMap.get(d.periodKey) || 0,
		registeredProductInquiries: d.registeredProductInquiries,
		unregisteredProductInquiries: d.unregisteredProductInquiries,
		estimatedLostRevenue: d.pricedCount > 0 ? round2$1(d.estimatedLostRevenue) : null
	}));
	const weeklyTrends = Array.from(weeklyBuckets.values()).sort((a, b) => a.periodKey.localeCompare(b.periodKey)).map((w) => ({
		periodKey: w.periodKey,
		label: w.label,
		granularity: "weekly",
		inquiryCount: w.inquiryCount,
		requestedBaseUnits: w.requestedBaseUnits,
		confirmedIntentUnits: w.confirmedIntentUnits,
		actualUnitsSold: w.actualUnitsSold,
		registeredProductInquiries: w.registeredProductInquiries,
		unregisteredProductInquiries: w.unregisteredProductInquiries,
		estimatedLostRevenue: w.pricedCount > 0 ? round2$1(w.estimatedLostRevenue) : null
	}));
	const monthlyTrends = Array.from(monthlyBuckets.values()).sort((a, b) => a.periodKey.localeCompare(b.periodKey)).map((m) => ({
		periodKey: m.periodKey,
		label: m.label,
		granularity: "monthly",
		inquiryCount: m.inquiryCount,
		requestedBaseUnits: m.requestedBaseUnits,
		confirmedIntentUnits: m.confirmedIntentUnits,
		actualUnitsSold: m.actualUnitsSold,
		registeredProductInquiries: m.registeredProductInquiries,
		unregisteredProductInquiries: m.unregisteredProductInquiries,
		estimatedLostRevenue: m.pricedCount > 0 ? round2$1(m.estimatedLostRevenue) : null
	}));
	const actualUnitsSoldInPeriod = sales.summary.unitsSold;
	const observedTotalDemandUnits = actualUnitsSoldInPeriod + totalRequestedBaseUnits;
	const demandCaptureEfficiencyPercent = observedTotalDemandUnits > 0 ? round2$1(actualUnitsSoldInPeriod / observedTotalDemandUnits * 100) : null;
	const dataCoveragePercent = totalInquiries > 0 ? round2$1(pricedInquiriesCount / totalInquiries * 100) : 0;
	const hasEnoughForEstimation = totalInquiries > 0 && pricedInquiriesCount > 0;
	let overallConfidence = "INSUFFICIENT_DATA";
	if (hasEnoughForEstimation) {
		if (totalInquiries >= 5 && dataCoveragePercent >= 80) overallConfidence = "HIGH";
		else if (totalInquiries >= 2 && dataCoveragePercent >= 50) overallConfidence = "MEDIUM";
		else overallConfidence = "LOW";
	}
	const lostSalesEstimation = {
		status: hasEnoughForEstimation ? "ESTIMATED" : "INSUFFICIENT_DATA",
		methodologyEn: "Conservative Intent-Weighted & 24h-Deduplicated Lost Sales Model: weights confirmed purchase intent at 65%, standard unconfirmed inquiries at 35%, same-customer 24h repeat inquiries at 15%, and fulfilled-later requests at 0%. Multiplies weighted base units by locked catalog selling/cost price snapshots.",
		methodologyAr: "نموذج تقدير المبيعات المفقودة التحفظي الموزون بنية الشراء وإزالة التكرار خلال 24 ساعة: يحتسب وزن 65% للطلبات ذات نية الشراء المؤكدة، و35% للاستفسارات العادية، و15% لتكرار طلب نفس العميل خلال 24 ساعة، و0% للطلبات التي تم تلبيتها لاحقاً، مضروباً في لقطة سعر البيع والتكلفة المسجلة.",
		assumptionsEn: [
			"Customer inquiries represent potential demand, not guaranteed 100% completed sales.",
			"Confirmed purchase intent (65% conversion weight) converts at a higher rate than casual browsing inquiries (35% weight).",
			"Repeat inquiries by the same identified customer within 24 hours represent the same underlying purchase need (discounted to 15% weight).",
			"Unregistered products without catalog prices are excluded from monetary lost-sales valuation (never fabricated)."
		],
		assumptionsAr: [
			"استفسارات العملاء تمثل طلباً محتملاً وليست مبيعات مؤكدة بنسبة 100%.",
			"الطلبات ذات نية الشراء المؤكدة (وزن 65%) تتحول لمبيعات بمعدل أعلى من الاستفسارات العابرة (وزن 35%).",
			"تكرار استفسار نفس العميل خلال 24 ساعة لنفس المنتج يعبر عن نفس الحاجة الشرائية (يُخفض وزنه إلى 15%).",
			"المنتجات غير المسجلة التي لا تملك سعر بيع معروف تُستثنى من التقييم المالي ولا يتم اختلاق أسعار لها."
		],
		confidenceLevel: overallConfidence,
		sampleSizeInquiries: totalInquiries,
		pricedInquiriesCount,
		dataCoveragePercent,
		limitationsEn: ["Walk-in inquiries without a customer reference cannot be deduplicated across different hours of the day.", "Substitution effects (customers buying an alternative available product) may partially offset estimated lost revenue."],
		limitationsAr: ["الاستفسارات النقدية العابرة بدون مرجع للعميل لا يمكن تتبع تكرارها لنفس الشخص عبر ساعات اليوم المختلفة.", "تأثير الإحلال (شراء العميل لمنتج بديل متوفر) قد يعوض جزءاً من الإيرادات المفقودة المقدرة."],
		rawRequestedUnitsTotal: totalRequestedBaseUnits,
		dedupedConfirmedWeightedUnits: hasEnoughForEstimation ? round2$1(dedupedConfirmedWeightedUnitsTotal) : null,
		estimatedLostRevenue: hasEnoughForEstimation ? round2$1(estimatedLostRevenueTotal) : null,
		estimatedLostGrossProfit: hasEnoughForEstimation && canViewCost && pricedCostInquiriesCount > 0 ? round2$1(estimatedLostGrossProfitTotal) : null
	};
	const recentRequests = [...filteredRequests].reverse().slice(0, 50).map((r) => redactUnmetDemandRecordForRole(r, canViewPII));
	return {
		currency,
		periodStart: start.toISOString(),
		periodEnd: end.toISOString(),
		summary: {
			totalInquiries,
			totalRequestedQuantity,
			totalRequestedBaseUnits,
			confirmedIntentInquiries,
			confirmedIntentBaseUnits,
			registeredProductInquiries,
			unregisteredProductInquiries,
			fulfilledLaterCount,
			unfulfilledCount,
			repeatCustomerInquiries,
			distinctProductsRequested: productMap.size,
			repeatedStockoutProductsCount,
			actualUnitsSoldInPeriod,
			observedTotalDemandUnits,
			demandCaptureEfficiencyPercent
		},
		byReason,
		byCategory,
		topRequestedProducts,
		unregisteredProductsDemand,
		dailyTrends,
		weeklyTrends,
		monthlyTrends,
		byBranch,
		lostSalesEstimation,
		recentRequests
	};
}
// src/analytics/calculations/replenishment.metrics.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*
* Phase 10 (Parts 3, 6 & 7): Smart Store Operations, Replenishment, Branch Transfers & Unified Smart Insights Engine
* Pure, deterministic O(N) analytical rules engine.
* All outputs are strictly read-only recommendations (`requires_user_approval` / `informational`).
*/
function round2(val) {
	if (!Number.isFinite(val)) return 0;
	return Math.round((val + Number.EPSILON) * 100) / 100;
}
function extractExpiryDateFromProduct(product) {
	if (!product || !product.customFields) return null;
	const raw = product.customFields.expiry_date || product.customFields.expiryDate || product.customFields.expirationDate;
	if (typeof raw === "string" && raw.trim().length >= 8) return raw.trim();
	return null;
}
function computeSmartReplenishmentAndTransfers(params) {
	const { dataset, filters, sales, inventory, forecasts, unmetDemand, userContext, now = /* @__PURE__ */ new Date() } = params;
	const currency = sales.currency;
	const canViewCost = userContext?.canViewCostAndMargin ?? false;
	const leadTimeDays = Math.max(1, Number(filters.leadTimeDays ?? inventory.leadTimeDaysAssumed ?? 3));
	const safetyStockDays = Math.max(1, Number(filters.safetyStockDays ?? inventory.safetyStockDaysAssumed ?? 2));
	const effectiveBranchId = filters.branchId && filters.branchId !== "all" ? filters.branchId : "branch-main";
	const catalogById = new Map(dataset.products.map((p) => [p.id, p]));
	const forecastByProdId = new Map(forecasts.productDemandForecasts.map((f) => [f.productId, f]));
	const unmetByProdId = new Map(unmetDemand.topRequestedProducts.filter((u) => u.productId).map((u) => [u.productId, u]));
	const replenishmentRecommendations = [];
	for (const invProd of inventory.products) {
		const rawProd = catalogById.get(invProd.productId);
		const fcItem = forecastByProdId.get(invProd.productId);
		const unmetItem = unmetByProdId.get(invProd.productId);
		const observedSalesDailyVelocity = invProd.averageDailyDemand;
		const observedUnmetDemandUnits = unmetItem?.requestedBaseUnitsTotal ?? 0;
		const unmetDemandInquiriesCount = unmetItem?.inquiryCount ?? 0;
		const weightedUnmetUnits = unmetItem?.estimatedLostUnitsConservative ?? 0;
		const estimatedLatentDailyDemand = round2(Math.max(fcItem?.estimatedLatentDailyDemand ?? 0, observedSalesDailyVelocity + weightedUnmetUnits / 7));
		const expiryDateSnapshot = extractExpiryDateFromProduct(rawProd);
		let isExpiringSoonOrExpired = Boolean(unmetItem && unmetItem.reasonBreakdown.EXPIRED > 0);
		if (expiryDateSnapshot) {
			const expMs = new Date(expiryDateSnapshot).getTime();
			if (!Number.isNaN(expMs) && expMs <= now.getTime() + 12096e5) isExpiringSoonOrExpired = true;
		}
		const safetyStockUnits = Math.max(invProd.minStockAlert, Math.ceil(estimatedLatentDailyDemand * safetyStockDays));
		const reorderPointUnits = Math.ceil(estimatedLatentDailyDemand * leadTimeDays) + safetyStockUnits;
		const targetCycleUnits = Math.ceil(estimatedLatentDailyDemand * (leadTimeDays + safetyStockDays)) + safetyStockUnits;
		const availableAndInbound = invProd.currentStock + invProd.pendingInboundPurchaseUnits;
		const rawRecommendedUnits = Math.max(0, targetCycleUnits - availableAndInbound);
		if (!(invProd.reorderRecommendation.shouldReorder || rawRecommendedUnits > 0 && (invProd.currentStock <= reorderPointUnits || observedUnmetDemandUnits > 0))) continue;
		const recommendedOrderUnits = Math.max(rawRecommendedUnits, invProd.reorderRecommendation.recommendedOrderQuantity, observedUnmetDemandUnits > 0 ? Math.max(1, Math.ceil((weightedUnmetUnits || 1) - availableAndInbound)) : 0);
		if (recommendedOrderUnits <= 0) continue;
		const unitCost = canViewCost ? invProd.unitCost : null;
		const estimatedOrderCost = canViewCost && unitCost !== null && unitCost > 0 ? round2(recommendedOrderUnits * unitCost) : null;
		const daysUntilStockout = estimatedLatentDailyDemand > 0 ? round2(invProd.currentStock / estimatedLatentDailyDemand) : invProd.daysOfInventoryOnHand;
		let urgency = "MEDIUM";
		if (invProd.currentStock <= 0 || daysUntilStockout !== null && daysUntilStockout <= leadTimeDays || observedUnmetDemandUnits >= 3 && invProd.currentStock <= invProd.minStockAlert) urgency = "CRITICAL";
		else if (invProd.currentStock <= invProd.minStockAlert || observedUnmetDemandUnits > 0) urgency = "HIGH";
		const confidenceLevel = invProd.unitsSoldInPeriod >= 3 || unmetDemandInquiriesCount >= 3 ? "HIGH" : invProd.unitsSoldInPeriod >= 1 || unmetDemandInquiriesCount >= 1 ? "MEDIUM" : "LOW";
		const costNoteEn = estimatedOrderCost !== null ? ` (est. PO cost: ${formatCurrency(estimatedOrderCost, currency, "en")})` : "";
		const costNoteAr = estimatedOrderCost !== null ? ` (بتكلفة تقديرية ${formatCurrency(estimatedOrderCost, currency, "ar")})` : "";
		replenishmentRecommendations.push({
			id: `repl-${invProd.productId}`,
			productId: invProd.productId,
			isRegisteredProduct: true,
			sku: invProd.sku,
			productName: invProd.name,
			productNameAr: invProd.nameAr || null,
			category: invProd.category,
			branchId: effectiveBranchId,
			currentStock: invProd.currentStock,
			pendingInboundUnits: invProd.pendingInboundPurchaseUnits,
			minStockAlert: invProd.minStockAlert,
			observedSalesDailyVelocity,
			observedUnmetDemandUnits,
			unmetDemandInquiriesCount,
			estimatedLatentDailyDemand,
			leadTimeDays,
			safetyStockUnits,
			reorderPointUnits,
			recommendedOrderUnits,
			unitCost,
			estimatedOrderCost,
			daysUntilStockout,
			expirationRiskDetected: isExpiringSoonOrExpired,
			expiryDateSnapshot,
			urgency,
			confidenceLevel,
			explanationEn: observedUnmetDemandUnits > 0 ? `Combines actual sales velocity (${observedSalesDailyVelocity} units/day) with ${unmetDemandInquiriesCount} unmet customer inquiry(s) (${observedUnmetDemandUnits} units requested). Current stock (${invProd.currentStock}) + pending inbound (${invProd.pendingInboundPurchaseUnits}) is below the ${reorderPointUnits}-unit reorder point.` : `Current stock (${invProd.currentStock} units) and pending inbound (${invProd.pendingInboundPurchaseUnits} units) are below the safety-adjusted reorder point (${reorderPointUnits} units for a ${leadTimeDays}-day lead time).`,
			explanationAr: observedUnmetDemandUnits > 0 ? `يجمع بين سرعة المبيعات الفعلية (${observedSalesDailyVelocity} وحدة/يوم) وعدد ${unmetDemandInquiriesCount} استفسارات عملاء غير ملباة (${observedUnmetDemandUnits} وحدات مطلوبة). الرصيد الحالي (${invProd.currentStock}) والوارد قيد التوريد (${invProd.pendingInboundPurchaseUnits}) أقل من نقطة إعادة الطلب (${reorderPointUnits} وحدة).` : `الرصيد الحالي (${invProd.currentStock} وحدة) والكميات قيد التوريد (${invProd.pendingInboundPurchaseUnits} وحدة) أقل من نقطة إعادة الطلب الآمنة (${reorderPointUnits} وحدة لزمن توريد ${leadTimeDays} أيام).`,
			suggestedActionEn: isExpiringSoonOrExpired ? `Inspect shelf batch expiration date first, then approve PO for ${recommendedOrderUnits} fresh units of ${invProd.name}${costNoteEn}.` : `Approve purchase order for ${recommendedOrderUnits} units of ${invProd.name}${costNoteEn}.`,
			suggestedActionAr: isExpiringSoonOrExpired ? `افحص صلاحية الدفعة الحالية على الرف أولاً، ثم اعتمد أمر شراء لـ ${recommendedOrderUnits} وحدة جديدة من "${invProd.nameAr || invProd.name}"${costNoteAr}.` : `اعتمد أمر شراء بكمية ${recommendedOrderUnits} وحدة من "${invProd.nameAr || invProd.name}"${costNoteAr}.`,
			approvalStatus: "requires_user_approval"
		});
	}
	for (const unreg of unmetDemand.unregisteredProductsDemand) {
		if (unreg.isRegisteredProduct) continue;
		const recommendedTrialUnits = Math.max(5, Math.ceil((unreg.estimatedLostUnitsConservative || unreg.requestedBaseUnitsTotal) * 1.2));
		replenishmentRecommendations.push({
			id: `repl-unreg-${unreg.productKey}`,
			productId: null,
			isRegisteredProduct: false,
			sku: unreg.sku,
			productName: unreg.productName,
			productNameAr: unreg.productNameAr,
			category: unreg.category,
			branchId: unreg.branchesRequested[0] || effectiveBranchId,
			currentStock: null,
			pendingInboundUnits: 0,
			minStockAlert: 5,
			observedSalesDailyVelocity: 0,
			observedUnmetDemandUnits: unreg.requestedBaseUnitsTotal,
			unmetDemandInquiriesCount: unreg.inquiryCount,
			estimatedLatentDailyDemand: round2((unreg.estimatedLostUnitsConservative || 1) / 7),
			leadTimeDays,
			safetyStockUnits: 5,
			reorderPointUnits: 5,
			recommendedOrderUnits: recommendedTrialUnits,
			unitCost: null,
			estimatedOrderCost: null,
			daysUntilStockout: 0,
			expirationRiskDetected: false,
			expiryDateSnapshot: null,
			urgency: unreg.inquiryCount >= 3 ? "HIGH" : "MEDIUM",
			confidenceLevel: unreg.inquiryCount >= 3 ? "HIGH" : "MEDIUM",
			explanationEn: `Unregistered product requested ${unreg.inquiryCount} time(s) (${unreg.requestedBaseUnitsTotal} total units requested) across ${unreg.distinctBranchesCount} branch(es).`,
			explanationAr: `منتج غير مسجل بالكتالوج طلبه العملاء ${unreg.inquiryCount} مرات (بإجمالي ${unreg.requestedBaseUnitsTotal} وحدات مطلوبة) في ${unreg.distinctBranchesCount} فرع.`,
			suggestedActionEn: `Evaluate supplier availability and approve initial trial batch of ${recommendedTrialUnits} units for "${unreg.productName}".`,
			suggestedActionAr: `قيّم توفر المورد واعتمد دفعة تجريبية أولية بكمية ${recommendedTrialUnits} وحدة من "${unreg.productNameAr || unreg.productName}".`,
			approvalStatus: "requires_user_approval"
		});
	}
	const urgencyRank = {
		CRITICAL: 4,
		HIGH: 3,
		MEDIUM: 2,
		LOW: 1
	};
	replenishmentRecommendations.sort((a, b) => {
		if (urgencyRank[b.urgency] !== urgencyRank[a.urgency]) return urgencyRank[b.urgency] - urgencyRank[a.urgency];
		return b.observedUnmetDemandUnits - a.observedUnmetDemandUnits || b.recommendedOrderUnits - a.recommendedOrderUnits;
	});
	const branchTransferOpportunities = [];
	if (dataset.branches.length >= 2) {
		const branchById = new Map(dataset.branches.map((b) => [b.id, b]));
		const unmetByProdAndBranch = /* @__PURE__ */ new Map();
		for (const req of dataset.unmetDemandRequests || []) {
			if (!req || !req.productId || req.fulfillmentStatus === "cancelled") continue;
			const bId = req.branchId || "branch-main";
			let bMap = unmetByProdAndBranch.get(req.productId);
			if (!bMap) {
				bMap = /* @__PURE__ */ new Map();
				unmetByProdAndBranch.set(req.productId, bMap);
			}
			const entry = bMap.get(bId) || {
				inquiries: 0,
				units: 0
			};
			entry.inquiries += 1;
			entry.units += Math.max(1, Number(req.requestedBaseUnits || req.requestedQuantity || 1));
			bMap.set(bId, entry);
		}
		for (const invProd of inventory.products) {
			const bMap = unmetByProdAndBranch.get(invProd.productId);
			if (!bMap || invProd.currentStock <= invProd.minStockAlert) continue;
			for (const [shortageBranchId, demandStat] of bMap.entries()) {
				if (demandStat.units <= 0) continue;
				if (filters.branchId && filters.branchId !== "all" && shortageBranchId !== filters.branchId) continue;
				const candidateDonor = dataset.branches.find((b) => b.id !== shortageBranchId && !bMap.has(b.id));
				const shortageBranch = branchById.get(shortageBranchId);
				if (!candidateDonor || !shortageBranch) continue;
				const surplusUnits = Math.max(0, invProd.currentStock - invProd.minStockAlert);
				if (surplusUnits <= 0) continue;
				const recommendedTransferUnits = Math.max(1, Math.min(surplusUnits, demandStat.units));
				const estimatedRetailValueProtected = round2(recommendedTransferUnits * invProd.unitSellingPrice);
				branchTransferOpportunities.push({
					id: `transfer-${invProd.productId}-${candidateDonor.id}-to-${shortageBranch.id}`,
					productId: invProd.productId,
					sku: invProd.sku,
					productName: invProd.name,
					productNameAr: invProd.nameAr || null,
					fromBranchId: candidateDonor.id,
					fromBranchName: candidateDonor.name,
					fromBranchNameAr: candidateDonor.nameAr,
					toBranchId: shortageBranch.id,
					toBranchName: shortageBranch.name,
					toBranchNameAr: shortageBranch.nameAr,
					fromBranchEstimatedSurplusUnits: surplusUnits,
					toBranchShortageOrUnmetUnits: demandStat.units,
					toBranchUnmetInquiriesCount: demandStat.inquiries,
					recommendedTransferUnits,
					estimatedRetailValueProtected,
					priority: demandStat.inquiries >= 3 ? "CRITICAL" : "HIGH",
					confidenceLevel: demandStat.inquiries >= 2 ? "HIGH" : "MEDIUM",
					explanationEn: `${shortageBranch.name} recorded ${demandStat.inquiries} unmet inquiry(s) (${demandStat.units} units) for ${invProd.name}, while ${candidateDonor.name} holds ${surplusUnits} surplus units above minimum alert threshold (${invProd.minStockAlert}).`,
					explanationAr: `سجل "${shortageBranch.nameAr}" عدد ${demandStat.inquiries} استفسارات غير ملباة (${demandStat.units} وحدات) للمنتج "${invProd.nameAr || invProd.name}"، بينما يتوفر فائض يبلغ ${surplusUnits} وحدة فوق حد التنبيه في "${candidateDonor.nameAr}".`,
					suggestedActionEn: `Approve inter-branch transfer of ${recommendedTransferUnits} units from ${candidateDonor.name} to ${shortageBranch.name} (protects ${formatCurrency(estimatedRetailValueProtected, currency, "en")} in retail demand).`,
					suggestedActionAr: `اعتمد تحويل مخزني بكمية ${recommendedTransferUnits} وحدة من "${candidateDonor.nameAr}" إلى "${shortageBranch.nameAr}" (لتغطية طلب بقيمة بيعية ${formatCurrency(estimatedRetailValueProtected, currency, "ar")}).`,
					approvalStatus: "requires_user_approval"
				});
			}
		}
	}
	return {
		replenishmentRecommendations,
		branchTransferOpportunities
	};
}
/**
* Generates the Unified Smart Store Intelligence Alerts across all 10 required categories (Part 3 & Part 7),
* with deterministic deduplication, priority ranking, confidence levels, and role-based redaction.
*/
function computeSmartStoreIntelligence(params) {
	const { dataset, filters, sales, financial, inventory, customers, branches, technicalIndicators, forecasts, unmetDemand, userContext, now = /* @__PURE__ */ new Date() } = params;
	const currency = sales.currency;
	const canViewFinancials = userContext?.canViewFinancials ?? false;
	const canViewCost = userContext?.canViewCostAndMargin ?? false;
	const periodLabel = `${sales.periodStart.slice(0, 10)} → ${sales.periodEnd.slice(0, 10)}`;
	const effectiveBranchId = filters.branchId && filters.branchId !== "all" ? filters.branchId : "all";
	const { replenishmentRecommendations, branchTransferOpportunities } = computeSmartReplenishmentAndTransfers({
		dataset,
		filters,
		sales,
		inventory,
		forecasts,
		unmetDemand,
		userContext,
		now
	});
	const rawAlerts = [];
	const seenDedupeKeys = /* @__PURE__ */ new Set();
	function pushAlert(alert) {
		if (seenDedupeKeys.has(alert.dedupeKey)) return;
		seenDedupeKeys.add(alert.dedupeKey);
		rawAlerts.push(alert);
	}
	if (unmetDemand.topRequestedProducts.length > 0) {
		const topUnmet = unmetDemand.topRequestedProducts[0];
		const lostRevFormattedEn = topUnmet.estimatedLostRevenueConservative !== null ? formatCurrency(topUnmet.estimatedLostRevenueConservative, currency, "en") : "INSUFFICIENT_DATA";
		const lostRevFormattedAr = topUnmet.estimatedLostRevenueConservative !== null ? formatCurrency(topUnmet.estimatedLostRevenueConservative, currency, "ar") : "بيانات تسعير غير كافية";
		pushAlert({
			id: `smart-unmet-top-${topUnmet.productKey}`,
			dedupeKey: `UNMET_DEMAND:${topUnmet.productKey}:${effectiveBranchId}`,
			category: "UNMET_DEMAND",
			legacyCategory: "inventory_risk",
			severity: topUnmet.inquiryCount >= 3 || topUnmet.confirmedPurchaseIntentCount >= 2 ? "CRITICAL" : "HIGH",
			priority: 96,
			confidenceLevel: topUnmet.lostSalesConfidence === "INSUFFICIENT_DATA" ? "MEDIUM" : topUnmet.lostSalesConfidence,
			lifecycleStatus: "active",
			branchId: effectiveBranchId,
			productId: topUnmet.productId,
			titleEn: `High Unmet Customer Demand: ${topUnmet.productName} (${topUnmet.requestedBaseUnitsTotal} units)`,
			titleAr: `طلب عملاء مرتفع غير ملبى: ${topUnmet.productNameAr || topUnmet.productName} (${topUnmet.requestedBaseUnitsTotal} وحدات)`,
			descriptionEn: `Customers inquired ${topUnmet.inquiryCount} time(s) for ${topUnmet.requestedBaseUnitsTotal} units (${topUnmet.confirmedPurchaseIntentUnits} units with confirmed purchase intent) due to ${topUnmet.primaryReason}.`,
			descriptionAr: `سجل العملاء ${topUnmet.inquiryCount} استفسارات لإجمالي ${topUnmet.requestedBaseUnitsTotal} وحدات (منها ${topUnmet.confirmedPurchaseIntentUnits} وحدات بنية شراء مؤكدة) بسبب (${topUnmet.primaryReason}).`,
			evidenceMetrics: [{
				name: "Customer Inquiries",
				valueFormatted: `${topUnmet.inquiryCount} inquiries (${topUnmet.requestedBaseUnitsTotal} units)`,
				rawValue: topUnmet.requestedBaseUnitsTotal
			}, {
				name: "Conservative Lost Revenue",
				valueFormatted: lostRevFormattedEn,
				rawValue: topUnmet.estimatedLostRevenueConservative
			}],
			affectedRecords: [topUnmet.productId || topUnmet.productKey],
			periodAnalyzed: periodLabel,
			explanationEn: `Recorded directly at POS terminals when customers requested unavailable stock. Separate from completed sales.`,
			explanationAr: `تم توثيقها مباشرة من نقاط البيع عند طلب العملاء لصنف غير متوفر، وهي مفصولة تماماً عن المبيعات الفعلية.`,
			recommendedActionEn: topUnmet.isRegisteredProduct ? `Prioritize restocking ${topUnmet.productName} and notify returning customers when inventory arrives.` : `Evaluate adding "${topUnmet.productName}" (${lostRevFormattedAr}) as a trial catalog item.`,
			recommendedActionAr: topUnmet.isRegisteredProduct ? `أعطِ الأولوية لإعادة توفير "${topUnmet.productNameAr || topUnmet.productName}" وإبلاغ العملاء المهتمين فور وصول الشحنة.` : `ادرس إضافة "${topUnmet.productNameAr || topUnmet.productName}" كصنف تجريبي جديد في الكتالوج.`,
			dataQualityStatus: topUnmet.lostSalesEstimationStatus === "ESTIMATED" ? "complete" : "insufficient_data",
			sourceMetrics: ["unmet_demand_requests", "products.stock"],
			approvalStatus: "requires_user_approval"
		});
	}
	const expiredUnmetItems = unmetDemand.topRequestedProducts.filter((p) => p.reasonBreakdown.EXPIRED > 0);
	if (expiredUnmetItems.length > 0) {
		const expProd = expiredUnmetItems[0];
		pushAlert({
			id: `smart-expired-demand-${expProd.productKey}`,
			dedupeKey: `INVENTORY_RISK:EXPIRED_INQUIRY:${expProd.productKey}`,
			category: "INVENTORY_RISK",
			legacyCategory: "inventory_risk",
			severity: "CRITICAL",
			priority: 95,
			confidenceLevel: "VERIFIED",
			lifecycleStatus: "active",
			branchId: effectiveBranchId,
			productId: expProd.productId,
			titleEn: `Expired Shelf Stock Prevented Sale: ${expProd.productName}`,
			titleAr: `منتج منتهي الصلاحية منع إتمام البيع: ${expProd.productNameAr || expProd.productName}`,
			descriptionEn: `${expProd.reasonBreakdown.EXPIRED} customer inquiry(s) for ${expProd.productName} could not be fulfilled because available shelf units were expired.`,
			descriptionAr: `تعذر تلبية ${expProd.reasonBreakdown.EXPIRED} طلبات عملاء للمنتج "${expProd.productNameAr || expProd.productName}" بسبب انتهاء صلاحية الوحدات الموجودة.`,
			evidenceMetrics: [{
				name: "Expired Batch Inquiries",
				valueFormatted: `${expProd.reasonBreakdown.EXPIRED} inquiries`,
				rawValue: expProd.reasonBreakdown.EXPIRED
			}],
			affectedRecords: [expProd.productId || expProd.productKey],
			periodAnalyzed: periodLabel,
			explanationEn: `Cashier recorded EXPIRED unavailability reason when attempting to fulfill customer request.`,
			explanationAr: `سجل الكاشير سبب عدم التوفر (منتهي الصلاحية EXPIRED) أثناء محاولة البيع للعميل.`,
			recommendedActionEn: `Quarantine expired units of ${expProd.productName} via a Damage/Loss stock movement and order fresh replacement batch.`,
			recommendedActionAr: `اعزل الوحدات المنتهية الصلاحية من "${expProd.productNameAr || expProd.productName}" عبر حركة تالف/فاقد واطلب دفعة جديدة صالحة.`,
			dataQualityStatus: "complete",
			sourceMetrics: ["unmet_demand_requests", "products.customFields"],
			approvalStatus: "requires_user_approval"
		});
	}
	const criticalReorders = inventory.products.filter((p) => p.reorderRecommendation.shouldReorder && (p.reorderRecommendation.urgency === "critical" || p.reorderRecommendation.urgency === "high" || p.currentStock <= 0));
	if (criticalReorders.length > 0) {
		const topRisk = criticalReorders[0];
		pushAlert({
			id: `smart-stockout-risk-${topRisk.productId}`,
			dedupeKey: `STOCKOUT_RISK:${topRisk.productId}:${effectiveBranchId}`,
			category: "STOCKOUT_RISK",
			legacyCategory: "inventory_risk",
			severity: topRisk.currentStock <= 0 ? "CRITICAL" : "HIGH",
			priority: 92,
			confidenceLevel: "VERIFIED",
			lifecycleStatus: "active",
			branchId: effectiveBranchId,
			productId: topRisk.productId,
			titleEn: `Stockout Risk across ${criticalReorders.length} SKU(s): ${topRisk.name}`,
			titleAr: `مخاطر نفاد المخزون في ${criticalReorders.length} أصناف: ${topRisk.nameAr || topRisk.name}`,
			descriptionEn: `${topRisk.name} (${topRisk.sku}) has ${topRisk.currentStock} units remaining vs. alert threshold of ${topRisk.minStockAlert} units (Pending inbound: ${topRisk.pendingInboundPurchaseUnits}).`,
			descriptionAr: `المنتج "${topRisk.nameAr || topRisk.name}" (${topRisk.sku}) متبقٍ منه ${topRisk.currentStock} وحدات مقابل حد تنبيه ${topRisk.minStockAlert} وحدات (الوارد قيد التوريد: ${topRisk.pendingInboundPurchaseUnits}).`,
			evidenceMetrics: [{
				name: "Current Stock",
				valueFormatted: `${topRisk.currentStock} units`,
				rawValue: topRisk.currentStock
			}, {
				name: "Days of Inventory on Hand",
				valueFormatted: topRisk.daysOfInventoryOnHand !== null ? `${topRisk.daysOfInventoryOnHand} days` : "0 days",
				rawValue: topRisk.daysOfInventoryOnHand
			}],
			affectedRecords: criticalReorders.map((c) => c.productId),
			periodAnalyzed: periodLabel,
			explanationEn: `Available stock plus pending inbound orders is below the lead-time safety reorder point (${topRisk.reorderRecommendation.reorderPointUnits} units).`,
			explanationAr: `الرصيد المتاح مضافاً إليه الكميات قيد التوريد أقل من نقطة إعادة الطلب الآمنة (${topRisk.reorderRecommendation.reorderPointUnits} وحدة).`,
			recommendedActionEn: `Review and approve replenishment order of ${topRisk.reorderRecommendation.recommendedOrderQuantity} units for ${topRisk.name}.`,
			recommendedActionAr: `راجع واعتمد أمر التزويد بكمية ${topRisk.reorderRecommendation.recommendedOrderQuantity} وحدة للمنتج "${topRisk.nameAr || topRisk.name}".`,
			dataQualityStatus: "complete",
			sourceMetrics: [
				"products.stock",
				"purchases",
				"sale_items"
			],
			approvalStatus: "requires_user_approval"
		});
	}
	if (replenishmentRecommendations.length > 0) {
		const topRepl = replenishmentRecommendations[0];
		const totalOrderCost = replenishmentRecommendations.reduce((acc, r) => acc + (r.estimatedOrderCost ?? 0), 0);
		pushAlert({
			id: `smart-replenishment-batch`,
			dedupeKey: `REPLENISHMENT:BATCH:${effectiveBranchId}`,
			category: "REPLENISHMENT",
			legacyCategory: "inventory_risk",
			severity: topRepl.urgency === "CRITICAL" ? "CRITICAL" : "HIGH",
			priority: 88,
			confidenceLevel: topRepl.confidenceLevel,
			lifecycleStatus: "active",
			branchId: effectiveBranchId,
			productId: topRepl.productId,
			titleEn: `${replenishmentRecommendations.length} Smart Replenishment Recommendation(s) Ready`,
			titleAr: `${replenishmentRecommendations.length} توصيات ذكية لإعادة التزويد والشراء جاهزة للمراجعة`,
			descriptionEn: `Top priority: ${topRepl.productName} requires ${topRepl.recommendedOrderUnits} units (Latent demand: ${topRepl.estimatedLatentDailyDemand} units/day).`,
			descriptionAr: `الأولوية القصوى: "${topRepl.productNameAr || topRepl.productName}" يتطلب شراء ${topRepl.recommendedOrderUnits} وحدة (معدل الطلب الكامن: ${topRepl.estimatedLatentDailyDemand} وحدة/يوم).`,
			evidenceMetrics: [{
				name: "Recommended SKUs",
				valueFormatted: `${replenishmentRecommendations.length} SKUs`,
				rawValue: replenishmentRecommendations.length
			}, ...canViewCost && totalOrderCost > 0 ? [{
				name: "Estimated Total PO Cost",
				valueFormatted: formatCurrency(totalOrderCost, currency, "en"),
				rawValue: totalOrderCost
			}] : []],
			affectedRecords: replenishmentRecommendations.map((r) => r.productId || r.id),
			periodAnalyzed: periodLabel,
			explanationEn: topRepl.explanationEn,
			explanationAr: topRepl.explanationAr,
			recommendedActionEn: topRepl.suggestedActionEn,
			recommendedActionAr: topRepl.suggestedActionAr,
			dataQualityStatus: "complete",
			sourceMetrics: [
				"products",
				"sale_items",
				"unmet_demand_requests",
				"purchases"
			],
			approvalStatus: "requires_user_approval"
		});
	}
	if (branchTransferOpportunities.length > 0) {
		const topTr = branchTransferOpportunities[0];
		pushAlert({
			id: topTr.id,
			dedupeKey: `TRANSFER_OPPORTUNITY:${topTr.productId}:${topTr.fromBranchId}:${topTr.toBranchId}`,
			category: "TRANSFER_OPPORTUNITY",
			legacyCategory: "branch_and_staff",
			severity: topTr.priority === "CRITICAL" ? "HIGH" : "MEDIUM",
			priority: 85,
			confidenceLevel: topTr.confidenceLevel,
			lifecycleStatus: "active",
			branchId: topTr.toBranchId,
			productId: topTr.productId,
			titleEn: `Branch Transfer Opportunity: ${topTr.recommendedTransferUnits} units of ${topTr.productName}`,
			titleAr: `فرصة تحويل بين الفروع: ${topTr.recommendedTransferUnits} وحدة من ${topTr.productNameAr || topTr.productName}`,
			descriptionEn: topTr.explanationEn,
			descriptionAr: topTr.explanationAr,
			evidenceMetrics: [{
				name: "Transfer Quantity",
				valueFormatted: `${topTr.recommendedTransferUnits} units`,
				rawValue: topTr.recommendedTransferUnits
			}, {
				name: "Retail Demand Protected",
				valueFormatted: formatCurrency(topTr.estimatedRetailValueProtected, currency, "en"),
				rawValue: topTr.estimatedRetailValueProtected
			}],
			affectedRecords: [
				topTr.productId,
				topTr.fromBranchId,
				topTr.toBranchId
			],
			periodAnalyzed: periodLabel,
			explanationEn: `Reallocating existing surplus stock avoids external supplier lead time while capturing unmet branch inquiries.`,
			explanationAr: `إعادة توزيع الفائض المتاح بين الفروع يوفر وقت انتظار المورد الخارجي ويلبي طلبات العملاء فوراً.`,
			recommendedActionEn: topTr.suggestedActionEn,
			recommendedActionAr: topTr.suggestedActionAr,
			dataQualityStatus: "complete",
			sourceMetrics: [
				"products.stock",
				"unmet_demand_requests",
				"branches"
			],
			approvalStatus: "requires_user_approval"
		});
	}
	if (sales.byProduct.length > 0) {
		const topProd = sales.byProduct[0];
		const netEn = formatCurrency(topProd.netSales, currency, "en");
		const netAr = formatCurrency(topProd.netSales, currency, "ar");
		pushAlert({
			id: `smart-rising-demand-${topProd.id}`,
			dedupeKey: `RISING_DEMAND:${topProd.id}:${effectiveBranchId}`,
			category: "RISING_DEMAND",
			legacyCategory: "sales_momentum",
			severity: "INFO",
			priority: 74,
			confidenceLevel: "VERIFIED",
			lifecycleStatus: "active",
			branchId: effectiveBranchId,
			productId: topProd.id,
			titleEn: `Leading Demand Velocity: ${topProd.name} (${topProd.unitsSold} units sold)`,
			titleAr: `أعلى زخم طلب ومبيعات: ${topProd.nameAr || topProd.name} (${topProd.unitsSold} وحدة مباعة)`,
			descriptionEn: `${topProd.name} generated ${netEn} (${topProd.shareOfNetSalesPercent}% of store net sales) across ${topProd.transactionCount} completed orders.`,
			descriptionAr: `حقق "${topProd.nameAr || topProd.name}" صافي مبيعات ${netAr} (${topProd.shareOfNetSalesPercent}% من إجمالي صافي المبيعات) عبر ${topProd.transactionCount} فواتير مكتملة.`,
			evidenceMetrics: [{
				name: "Net Sales Share",
				valueFormatted: `${topProd.shareOfNetSalesPercent}% (${netEn})`,
				rawValue: topProd.netSales
			}, {
				name: "Units Sold",
				valueFormatted: `${topProd.unitsSold} units`,
				rawValue: topProd.unitsSold
			}],
			affectedRecords: [topProd.id],
			periodAnalyzed: periodLabel,
			explanationEn: `High unit velocity and consistent checkout frequency make this SKU the primary traffic driver.`,
			explanationAr: `سرعة دوران الصنف وتكرار شرائه في الفواتير يجعلانه المحرك الأول للمبيعات.`,
			recommendedActionEn: `Maintain zero-stockout safety buffer for ${topProd.name} and cross-merchandise with slower Class C items.`,
			recommendedActionAr: `حافظ على مخزون أمان دائم للمنتج "${topProd.nameAr || topProd.name}" وادمجه مع أصناف الفئة C لرفع متوسط الفاتورة.`,
			dataQualityStatus: "complete",
			sourceMetrics: ["sales", "sale_items"],
			approvalStatus: "informational"
		});
	}
	const deadSkus = inventory.products.filter((p) => p.movementVelocityClass === "dead_stock" && p.currentStock > 0);
	if (deadSkus.length > 0) {
		const lockedCost = deadSkus.reduce((acc, p) => acc + (p.inventoryValueAtCost ?? 0), 0);
		const lockedRetail = deadSkus.reduce((acc, p) => acc + p.inventoryValueAtRetail, 0);
		const valToShow = canViewCost && lockedCost > 0 ? lockedCost : lockedRetail;
		const valEn = formatCurrency(valToShow, currency, "en");
		const valAr = formatCurrency(valToShow, currency, "ar");
		const sampleEn = deadSkus.slice(0, 2).map((p) => p.name).join(", ");
		const sampleAr = deadSkus.slice(0, 2).map((p) => p.nameAr || p.name).join("، ");
		pushAlert({
			id: `smart-inventory-dead-stock`,
			dedupeKey: `INVENTORY_RISK:DEAD_STOCK:${effectiveBranchId}`,
			category: "INVENTORY_RISK",
			legacyCategory: "inventory_risk",
			severity: "MEDIUM",
			priority: 68,
			confidenceLevel: "HIGH",
			lifecycleStatus: "active",
			branchId: effectiveBranchId,
			titleEn: `${deadSkus.length} Dead-Stock SKU(s) Holding ${valEn}`,
			titleAr: `${deadSkus.length} أصناف راكدة بدون مبيعات بقيمة ${valAr}`,
			descriptionEn: `${deadSkus.length} stocked product(s) (${sampleEn}) recorded zero unit sales and zero customer inquiries during the analyzed period.`,
			descriptionAr: `سجلت ${deadSkus.length} أصناف متوفرة بالمخزون (${sampleAr}) صفراً في المبيعات خلال الفترة المحللة.`,
			evidenceMetrics: [{
				name: canViewCost ? "Capital Locked at Cost" : "Retail Value Idle",
				valueFormatted: valEn,
				rawValue: valToShow
			}, {
				name: "Idle Units",
				valueFormatted: `${deadSkus.reduce((a, b) => a + b.currentStock, 0)} units`,
				rawValue: deadSkus.reduce((a, b) => a + b.currentStock, 0)
			}],
			affectedRecords: deadSkus.map((d) => d.productId),
			periodAnalyzed: periodLabel,
			explanationEn: `Zero inventory turnover ties up shelf space and working capital needed for high-demand items.`,
			explanationAr: `توقف دوران هذه الأصناف يجمد السيولة النقدية والمساحة التخزينية التي تحتاجها الأصناف السريعة.`,
			recommendedActionEn: `Pause restocking for ${sampleEn} and run a promotional bundle with fast-moving products.`,
			recommendedActionAr: `أوقف إعادة شراء (${sampleAr}) مؤقتاً وفعّل عرض ترويجي مدمج لتصفيتها.`,
			dataQualityStatus: "complete",
			sourceMetrics: ["products.stock", "sale_items"],
			approvalStatus: "informational"
		});
	}
	if (canViewFinancials) {
		if (financial.cashFlowAndWorkingCapital.accountsReceivableOutstandingDebt > 0) {
			const arAmount = financial.cashFlowAndWorkingCapital.accountsReceivableOutstandingDebt;
			const arEn = formatCurrency(arAmount, currency, "en");
			const arAr = formatCurrency(arAmount, currency, "ar");
			const topDebtor = customers.creditExposureRanking[0];
			pushAlert({
				id: `smart-financial-receivables`,
				dedupeKey: `FINANCIAL_RISK:RECEIVABLES:${effectiveBranchId}`,
				category: "FINANCIAL_RISK",
				legacyCategory: "cash_and_debt",
				severity: financial.cashFlowAndWorkingCapital.collectionEfficiencyPercent < 85 ? "HIGH" : "MEDIUM",
				priority: 82,
				confidenceLevel: "VERIFIED",
				lifecycleStatus: "active",
				branchId: effectiveBranchId,
				titleEn: `Outstanding Customer Receivables: ${arEn}`,
				titleAr: `ذمم مدينة ومستحقات عملاء غير محصلة: ${arAr}`,
				descriptionEn: `Collection efficiency is ${financial.cashFlowAndWorkingCapital.collectionEfficiencyPercent}% with ${arEn} unpaid across ${customers.summary.customersWithDebtCount} customer(s).`,
				descriptionAr: `نسبة التحصيل النقدي ${financial.cashFlowAndWorkingCapital.collectionEfficiencyPercent}% مع مديونيات قائمة بقيمة ${arAr} لدى ${customers.summary.customersWithDebtCount} عملاء.`,
				evidenceMetrics: [{
					name: "Accounts Receivable",
					valueFormatted: arEn,
					rawValue: arAmount
				}, {
					name: "Collection Efficiency",
					valueFormatted: `${financial.cashFlowAndWorkingCapital.collectionEfficiencyPercent}%`,
					rawValue: financial.cashFlowAndWorkingCapital.collectionEfficiencyPercent
				}],
				affectedRecords: customers.creditExposureRanking.map((c) => c.customerId),
				periodAnalyzed: periodLabel,
				explanationEn: topDebtor ? `Largest open balance is ${topDebtor.name} (${formatCurrency(topDebtor.outstandingDebt, currency, "en")}). Delaying collection risks FX purchasing power erosion.` : `Uncollected credit balances reduce available cash for inventory replenishment.`,
				explanationAr: topDebtor ? `أعلى مديونية مسجلة على "${topDebtor.name}" (${formatCurrency(topDebtor.outstandingDebt, currency, "ar")}). تأخر التحصيل يعرض السيولة لتآكل القوة الشرائية.` : `الأرصدة الآجلة غير المحصلة تقلل السيولة النقدية المتاحة لتمويل المشتريات.`,
				recommendedActionEn: `Follow up on overdue balances in the Customer Debt Ledger and use USD-indexed settlement where applicable.`,
				recommendedActionAr: `تابع تحصيل المديونيات من سجل ديون العملاء مع استخدام خيار التسوية المؤشرة بسعر الصرف لحماية القيمة.`,
				dataQualityStatus: "complete",
				sourceMetrics: [
					"sales",
					"payments",
					"customers"
				],
				approvalStatus: "informational"
			});
		}
		const costJumpProducts = dataset.products.filter((p) => p.previousCostPrice !== void 0 && p.previousCostPrice > 0 && p.costPrice > p.previousCostPrice * 1.1);
		if (canViewCost && costJumpProducts.length > 0) {
			const topJump = costJumpProducts[0];
			const jumpPct = round2((topJump.costPrice - (topJump.previousCostPrice || topJump.costPrice)) / (topJump.previousCostPrice || 1) * 100);
			pushAlert({
				id: `smart-financial-cost-increase-${topJump.id}`,
				dedupeKey: `FINANCIAL_RISK:COST_SPIKE:${topJump.id}`,
				category: "FINANCIAL_RISK",
				legacyCategory: "profit_margin",
				severity: jumpPct >= 20 ? "HIGH" : "MEDIUM",
				priority: 77,
				confidenceLevel: "VERIFIED",
				lifecycleStatus: "active",
				branchId: effectiveBranchId,
				productId: topJump.id,
				titleEn: `Supplier Cost Increase Detected (+${jumpPct}% on ${topJump.name})`,
				titleAr: `ارتفاع ملحوظ في تكلفة المورد (+${jumpPct}% على ${topJump.nameAr || topJump.name})`,
				descriptionEn: `${topJump.name} unit cost rose from ${topJump.previousCostPrice} to ${topJump.costPrice} (${costJumpProducts.length} SKU(s) experienced >10% cost increases).`,
				descriptionAr: `ارتفعت تكلفة الوحدة للمنتج "${topJump.nameAr || topJump.name}" من ${topJump.previousCostPrice} إلى ${topJump.costPrice} (${costJumpProducts.length} أصناف شهدت زيادة تكلفة >10%).`,
				evidenceMetrics: [{
					name: "Unit Cost Increase",
					valueFormatted: `+${jumpPct}%`,
					rawValue: jumpPct
				}],
				affectedRecords: costJumpProducts.map((p) => p.id),
				periodAnalyzed: periodLabel,
				explanationEn: `Verified from product priceHistory audit trail. Unadjusted selling prices after supplier cost hikes compress gross margins.`,
				explanationAr: `موثق من سجل تغييرات الأسعار (priceHistory). عدم مراجعة سعر البيع بعد ارتفاع تكلفة المورد يقلص هامش الربح الإجمالي.`,
				recommendedActionEn: `Audit gross margin on ${topJump.name} and compare alternative supplier quotes before next PO.`,
				recommendedActionAr: `راجع هامش الربح للمنتج "${topJump.nameAr || topJump.name}" وقارن عروض أسعار الموردين قبل أمر الشراء القادم.`,
				dataQualityStatus: "complete",
				sourceMetrics: ["products.priceHistory"],
				approvalStatus: "informational"
			});
		}
		const fxDelta = Math.abs(financial.fxSensitivityAndValuation.unrealizedFxTranslationDelta);
		if (fxDelta > .01) {
			const deltaEn = formatCurrency(fxDelta, currency, "en");
			const deltaAr = formatCurrency(fxDelta, currency, "ar");
			pushAlert({
				id: `smart-financial-fx-variance`,
				dedupeKey: `FINANCIAL_RISK:FX_VARIANCE:${effectiveBranchId}`,
				category: "FINANCIAL_RISK",
				legacyCategory: "fx_sensitivity",
				severity: "MEDIUM",
				priority: 72,
				confidenceLevel: "VERIFIED",
				lifecycleStatus: "active",
				branchId: effectiveBranchId,
				titleEn: `Multi-Currency Replacement Value Variance (${deltaEn})`,
				titleAr: `فارق القيمة الاستبدالية لأسعار الصرف (${deltaAr})`,
				descriptionEn: `Historical sale-rate revenue differs from USD-indexed replacement valuation by ${deltaEn} (Preservation: ${financial.fxSensitivityAndValuation.fxPurchasingPowerPreservationPercent}%).`,
				descriptionAr: `يختلف صافي المبيعات بسعر صرف وقت البيع عن القيمة المؤشرة بالدولار للاستبدال بمقدار ${deltaAr} (نسبة الحفاظ على القوة الشرائية: ${financial.fxSensitivityAndValuation.fxPurchasingPowerPreservationPercent}%).`,
				evidenceMetrics: [{
					name: "FX Purchasing Power Preservation",
					valueFormatted: `${financial.fxSensitivityAndValuation.fxPurchasingPowerPreservationPercent}%`,
					rawValue: financial.fxSensitivityAndValuation.fxPurchasingPowerPreservationPercent
				}],
				affectedRecords: ["exchange_rates"],
				periodAnalyzed: periodLabel,
				explanationEn: `Exchange rate shifts between invoice timestamp and restock date create replacement cost variance.`,
				explanationAr: `تغير سعر الصرف بين تاريخ تحرير الفاتورة وتاريخ إعادة الشراء يولد فارقاً في تكلفة استبدال البضاعة.`,
				recommendedActionEn: `Review foreign-currency-linked product pricing whenever USD/SDG moves by >3%.`,
				recommendedActionAr: `راجع تسعير الأصناف المرتبطة بالعملات الأجنبية عند تحرك سعر الصرف بأكثر من 3%.`,
				dataQualityStatus: "complete",
				sourceMetrics: ["sales.exchangeRatesSnapshot", "exchange_rates"],
				approvalStatus: "informational"
			});
		}
	}
	if (sales.summary.discountRatePercent >= 5 || sales.summary.merchandiseReturnsCount > 0 || unmetDemand.summary.totalRequestedBaseUnits > 0) {
		const capturePct = unmetDemand.summary.demandCaptureEfficiencyPercent ?? 100;
		pushAlert({
			id: `smart-sales-demand-capture`,
			dedupeKey: `SALES_ANOMALY:DEMAND_CAPTURE:${effectiveBranchId}`,
			category: "SALES_ANOMALY",
			legacyCategory: "sales_momentum",
			severity: capturePct < 80 ? "HIGH" : "LOW",
			priority: 70,
			confidenceLevel: "HIGH",
			lifecycleStatus: "active",
			branchId: effectiveBranchId,
			titleEn: `Demand Capture Efficiency: ${capturePct}% (${sales.summary.unitsSold} sold vs ${unmetDemand.summary.totalRequestedBaseUnits} unmet units)`,
			titleAr: `كفاءة استيعاب طلبات العملاء: ${capturePct}% (${sales.summary.unitsSold} مباعة مقابل ${unmetDemand.summary.totalRequestedBaseUnits} غير ملباة)`,
			descriptionEn: `Store fulfilled ${sales.summary.unitsSold} net units out of ${unmetDemand.summary.observedTotalDemandUnits} total observed customer demand units (Discount rate: ${sales.summary.discountRatePercent}%, Returns: ${sales.summary.merchandiseReturnsCount}).`,
			descriptionAr: `لبى المتجر ${sales.summary.unitsSold} وحدة صافية من إجمالي ${unmetDemand.summary.observedTotalDemandUnits} وحدة طلب مرصود (نسبة الخصومات: ${sales.summary.discountRatePercent}%، المرتجعات: ${sales.summary.merchandiseReturnsCount}).`,
			evidenceMetrics: [{
				name: "Demand Capture Ratio",
				valueFormatted: `${capturePct}%`,
				rawValue: capturePct
			}, {
				name: "Discount Rate",
				valueFormatted: `${sales.summary.discountRatePercent}%`,
				rawValue: sales.summary.discountRatePercent
			}],
			affectedRecords: ["sales", "unmet_demand_requests"],
			periodAnalyzed: periodLabel,
			explanationEn: `Compares completed net unit sales against recorded customer inquiries for unavailable items.`,
			explanationAr: `يقارن الوحدات المباعة الفعلية بإجمالي طلبات العملاء المسجلة للأصناف غير المتوفرة.`,
			recommendedActionEn: `Target replenishment on the top requested unavailable SKUs to raise demand capture above 92%.`,
			recommendedActionAr: `وجه السيولة لتوفير الأصناف الأعلى طلباً لرفع كفاءة استيعاب الطلب إلى أكثر من 92%.`,
			dataQualityStatus: "complete",
			sourceMetrics: [
				"sales",
				"returns",
				"unmet_demand_requests"
			],
			approvalStatus: "informational"
		});
	}
	if (branches.branches.length > 0) {
		const topBranch = branches.branches[0];
		pushAlert({
			id: `smart-branch-leader-${topBranch.branchId}`,
			dedupeKey: `BRANCH_IMBALANCE:${topBranch.branchId}`,
			category: "BRANCH_IMBALANCE",
			legacyCategory: "branch_and_staff",
			severity: "INFO",
			priority: 64,
			confidenceLevel: "VERIFIED",
			lifecycleStatus: "active",
			branchId: topBranch.branchId,
			titleEn: `Branch Performance Benchmark: ${topBranch.branchName} (${topBranch.revenueSharePercent}% share)`,
			titleAr: `مؤشر أداء الفروع: ${topBranch.branchNameAr} (حصة ${topBranch.revenueSharePercent}%)`,
			descriptionEn: `${topBranch.branchName} processed ${topBranch.transactionCount} orders (${formatCurrency(topBranch.netSales, currency, "en")}) with ${topBranch.collectionRatePercent}% cash collection efficiency.`,
			descriptionAr: `نفذ "${topBranch.branchNameAr}" عدد ${topBranch.transactionCount} فاتورة (${formatCurrency(topBranch.netSales, currency, "ar")}) بكفاءة تحصيل نقدي ${topBranch.collectionRatePercent}%.`,
			evidenceMetrics: [{
				name: "Branch Revenue Share",
				valueFormatted: `${topBranch.revenueSharePercent}%`,
				rawValue: topBranch.revenueSharePercent
			}, {
				name: "Collection Rate",
				valueFormatted: `${topBranch.collectionRatePercent}%`,
				rawValue: topBranch.collectionRatePercent
			}],
			affectedRecords: [topBranch.branchId],
			periodAnalyzed: periodLabel,
			explanationEn: `Evaluates revenue distribution, average ticket size, and stock availability across branches.`,
			explanationAr: `يقيم توزيع الإيرادات ومتوسط الفاتورة وتوفر المخزون بين الفروع.`,
			recommendedActionEn: `Align secondary branch assortment with ${topBranch.branchName}'s top-selling SKUs.`,
			recommendedActionAr: `وائم تشكيلة المخزون في الفروع الأخرى مع الأصناف الأكثر مبيعاً في "${topBranch.branchNameAr}".`,
			dataQualityStatus: "complete",
			sourceMetrics: ["sales", "branches"],
			approvalStatus: "informational"
		});
	}
	const peakWeekday = [...sales.weekdayDistribution].sort((a, b) => b.netSales - a.netSales)[0];
	const forecastTotalEn = formatCurrency(forecasts.revenueForecastSummary.expectedTotalNetSales, currency, "en");
	const forecastTotalAr = formatCurrency(forecasts.revenueForecastSummary.expectedTotalNetSales, currency, "ar");
	pushAlert({
		id: `smart-seasonal-forecast-outlook`,
		dedupeKey: `SEASONAL_PATTERN:OUTLOOK:${effectiveBranchId}:${forecasts.horizonDays}`,
		category: "SEASONAL_PATTERN",
		legacyCategory: "sales_momentum",
		severity: "INFO",
		priority: 60,
		confidenceLevel: forecasts.dataQualityStatus === "high_confidence" ? "HIGH" : forecasts.dataQualityStatus === "moderate_confidence" ? "MEDIUM" : "LOW",
		lifecycleStatus: "active",
		branchId: effectiveBranchId,
		titleEn: `${forecasts.horizonDays}-Day Demand Outlook (${forecastTotalEn}) & Weekly Cycle`,
		titleAr: `توقعات الطلب لـ ${forecasts.horizonDays} أيام (${forecastTotalAr}) والنمط الأسبوعي`,
		descriptionEn: `${forecasts.selectedModelNameEn} projects ${forecastTotalEn} over ${forecasts.horizonDays} days.${peakWeekday && peakWeekday.netSales > 0 ? ` Peak day-of-week is ${peakWeekday.labelEn}.` : ""}`,
		descriptionAr: `يتوقع نموذج (${forecasts.selectedModelNameAr}) صافي مبيعات ${forecastTotalAr} خلال ${forecasts.horizonDays} أيام.${peakWeekday && peakWeekday.netSales > 0 ? ` يوم الذروة الأسبوعي هو ${peakWeekday.labelAr}.` : ""}`,
		evidenceMetrics: [{
			name: `${forecasts.horizonDays}d Projected Sales`,
			valueFormatted: forecastTotalEn,
			rawValue: forecasts.revenueForecastSummary.expectedTotalNetSales
		}, {
			name: "Backtest WAPE",
			valueFormatted: `${forecasts.backtestEvaluations[0]?.wapePercent ?? 0}%`,
			rawValue: forecasts.backtestEvaluations[0]?.wapePercent ?? 0
		}],
		affectedRecords: ["forecasts"],
		periodAnalyzed: `Next ${forecasts.horizonDays} Days`,
		explanationEn: forecasts.predictiveDemandComparison?.comparisonNoteEn || forecasts.selectionReasonEn,
		explanationAr: forecasts.predictiveDemandComparison?.comparisonNoteAr || forecasts.selectionReasonAr,
		recommendedActionEn: `Schedule supplier deliveries 24 hours prior to ${peakWeekday?.labelEn || "peak trading days"} and prepare ${formatCurrency(forecasts.revenueForecastSummary.expectedAverageDailySales, currency, "en")}/day working stock.`,
		recommendedActionAr: `جدول استلام طلبيات الموردين قبل 24 ساعة من ${peakWeekday?.labelAr || "أيام الذروة"} وجهز مخزوناً تشغيلياً يغطي ${formatCurrency(forecasts.revenueForecastSummary.expectedAverageDailySales, currency, "ar")}/يوم.`,
		dataQualityStatus: forecasts.horizonSufficiencyStatus === "sufficient_history" ? "complete" : "partial_history",
		sourceMetrics: [
			"sales.dailySeries",
			"unmet_demand_requests",
			"forecasts"
		],
		approvalStatus: "informational"
	});
	rawAlerts.sort((a, b) => b.priority - a.priority);
	const inventoryRisks = rawAlerts.filter((a) => a.category === "INVENTORY_RISK" || a.category === "STOCKOUT_RISK" || a.category === "REPLENISHMENT" || a.category === "UNMET_DEMAND");
	const financialRisks = rawAlerts.filter((a) => a.category === "FINANCIAL_RISK");
	const branchInsights = rawAlerts.filter((a) => a.category === "BRANCH_IMBALANCE" || a.category === "TRANSFER_OPPORTUNITY");
	const byCategory = {
		INVENTORY_RISK: 0,
		UNMET_DEMAND: 0,
		RISING_DEMAND: 0,
		STOCKOUT_RISK: 0,
		REPLENISHMENT: 0,
		FINANCIAL_RISK: 0,
		SALES_ANOMALY: 0,
		BRANCH_IMBALANCE: 0,
		SEASONAL_PATTERN: 0,
		TRANSFER_OPPORTUNITY: 0
	};
	for (const a of rawAlerts) byCategory[a.category] = (byCategory[a.category] || 0) + 1;
	const totalReplCost = replenishmentRecommendations.reduce((sum, r) => sum + (r.estimatedOrderCost ?? 0), 0);
	const totalTransferableUnits = branchTransferOpportunities.reduce((sum, t) => sum + (t.recommendedTransferUnits || 0), 0);
	const expiringProductsCount = replenishmentRecommendations.filter((r) => r.expirationRiskDetected).length;
	return {
		generatedAt: now.toISOString(),
		currency,
		overview: {
			totalActiveAlerts: rawAlerts.length,
			criticalAlertsCount: rawAlerts.filter((a) => a.severity === "CRITICAL").length,
			highAlertsCount: rawAlerts.filter((a) => a.severity === "HIGH").length,
			replenishmentRecommendationsCount: replenishmentRecommendations.length,
			totalRecommendedReplenishmentCost: canViewCost ? round2(totalReplCost) : null,
			branchTransferOpportunitiesCount: branchTransferOpportunities.length,
			totalTransferableUnits,
			expiringProductsCount,
			byCategory
		},
		unmetDemand,
		smartAlerts: rawAlerts,
		inventoryRisks,
		financialRisks,
		branchInsights,
		replenishmentRecommendations,
		branchTransferOpportunities
	};
}
// src/analytics/analytics.service.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var ANALYTICS_METRICS_DICTIONARY = [
	{
		key: "gross_sales",
		nameEn: "Gross Sales (Pre-Discount, Ex-Tax)",
		nameAr: "إجمالي المبيعات (قبل الخصم وبدون الضريبة)",
		formulaEn: "Σ (Ex-Tax Line Subtotal before Discount) for completed transactions (voided excluded)",
		formulaAr: "مجموع قيمة الأصناف قبل الخصم وبدون الضريبة للفواتير المكتملة (مع استبعاد الفواتير الملغاة)",
		unit: "currency",
		sourceTables: ["sales", "sale_items"]
	},
	{
		key: "net_sales",
		nameEn: "Net Sales Revenue",
		nameAr: "صافي المبيعات (بعد الخصم والمرتجعات وبدون الضريبة)",
		formulaEn: "Gross Sales − Item Discounts − Global Invoice Discounts − Returned Merchandise Net Amount",
		formulaAr: "إجمالي المبيعات − خصومات الأصناف − خصم الفاتورة العام − صافي المرتجعات الفعلية",
		unit: "currency",
		sourceTables: [
			"sales",
			"sale_items",
			"returns",
			"return_items"
		]
	},
	{
		key: "cogs",
		nameEn: "Cost of Goods Sold (COGS) & Cost Quality Hierarchy",
		nameAr: "تكلفة البضاعة المباعة (COGS) وتصنيف دقة التكلفة",
		formulaEn: "Σ (Historical Frozen Cost → PriceHistory Timeline Cost → Current Catalog Cost [flagged Estimated]) − Returned Units Cost",
		formulaAr: "مجموع (التكلفة المثبتة وقت البيع ← سجل تغيرات الأسعار التاريخي ← تكلفة الكتالوج الحالية مع وسمها كتقديرية) − تكلفة المرتجعات",
		unit: "currency",
		sourceTables: [
			"sale_items",
			"products",
			"returns"
		]
	},
	{
		key: "gross_profit",
		nameEn: "Gross Profit & Profit After Recorded Shrinkage",
		nameAr: "إجمالي الربح والربح بعد الفاقد المسجل",
		formulaEn: "Gross Profit = Net Sales − COGS; Profit After Shrinkage = Gross Profit − Recorded Damage/Loss; Net Operating Profit = null unless Fixed Operating Expenses supplied",
		formulaAr: "إجمالي الربح = صافي المبيعات − تكلفة البضاعة المباعة؛ الربح بعد الفاقد = إجمالي الربح − التلف والفاقد المسجل",
		unit: "currency",
		sourceTables: [
			"sales",
			"sale_items",
			"products",
			"stock_movements"
		]
	},
	{
		key: "atv_upt",
		nameEn: "Average Transaction Value (ATV) & Units Per Transaction (UPT)",
		nameAr: "متوسط قيمة الفاتورة (ATV) ومتوسط الوحدات لكل فاتورة (UPT)",
		formulaEn: "ATV = Net Sales / Completed Transactions; UPT = Net Units Sold / Completed Transactions",
		formulaAr: "متوسط الفاتورة = صافي المبيعات ÷ عدد الفواتير المكتملة؛ الوحدات للفاتورة = صافي الوحدات المباعة ÷ عدد الفواتير",
		unit: "currency",
		sourceTables: ["sales", "sale_items"]
	},
	{
		key: "stock_turnover_doh",
		nameEn: "Cost-Based Stock Turnover, Unit Sell-Through & DOH",
		nameAr: "معدل دوران المخزون بالتكلفة، نسبة تصريف الوحدات، وأيام الكفاية (DOH)",
		formulaEn: "Cost Turnover = COGS / Reconstructed Avg Inventory at Cost ((Begin + End)/2); Sell-Through = Net Units Sold / Avg Stock Units; DOH = Current Stock / Avg Daily Demand",
		formulaAr: "معدل الدوران المالي = تكلفة المبيعات ÷ متوسط المخزون بالتكلفة؛ تصريف الوحدات = الوحدات المباعة ÷ متوسط الوحدات؛ أيام الكفاية = الرصيد ÷ السحب اليومي",
		unit: "ratio",
		sourceTables: [
			"products",
			"stock_movements",
			"sale_items"
		]
	},
	{
		key: "abc_classification",
		nameEn: "ABC Pareto Classification",
		nameAr: "تصنيف باريتو للمخزون والمنتجات (ABC)",
		formulaEn: "Class A: top ~75% cumulative value; Class B: 75%–92%; Class C: remaining ~8%",
		formulaAr: "الفئة A: أعلى ~75% من القيمة التراكمية؛ الفئة B: من 75% إلى 92%؛ الفئة C: النسبة المتبقية",
		unit: "percentage",
		sourceTables: ["products", "sale_items"]
	},
	{
		key: "technical_sma_ema_rsi_macd",
		nameEn: "Retail Technical Indicators (SMA, EMA, RSI 14, MACD 12/26/9)",
		nameAr: "المؤشرات الفنية للمبيعات (SMA, EMA, RSI 14, MACD 12/26/9)",
		formulaEn: "SMA(N) = ΣY/N; EMA(N) = αY_t + (1−α)EMA_{t−1}; RSI(14) = 100 − 100/(1 + AvgGain/AvgLoss); MACD = EMA(12) − EMA(26)",
		formulaAr: "المتوسط البسيط والأسي ومؤشر القوة النسبية لـ 14 يوماً وتقارب وتباعد المتوسطات المتحركة على السلسلة الزمنية للمبيعات",
		unit: "currency",
		sourceTables: ["sales"]
	},
	{
		key: "statistical_forecast_wape",
		nameEn: "Rolling-Origin Statistical Forecasting (MAE, WAPE %, Bias % & Coverage)",
		nameAr: "التنبؤ الإحصائي بالاختبار العكسي المتدحرج (MAE, WAPE %, Bias %)",
		formulaEn: "WAPE % = (Σ |Actual − Forecast| / Σ |Actual|) × 100; Bias % = (Σ (Forecast − Actual) / Σ |Actual|) × 100 across multi-origin rolling splits vs Naive baseline",
		formulaAr: "نسبة الخطأ المطلق المرجح (WAPE %) ونسبة الانحياز (Bias %) عبر نقاط قطع زمنية متعددة مقارنة بالنموذج المرجعي البسيط",
		unit: "percentage",
		sourceTables: [
			"sales",
			"sale_items",
			"products"
		]
	},
	{
		key: "unmet_demand_and_lost_sales",
		nameEn: "Customer Demand Intelligence & Conservative Lost Sales Estimation",
		nameAr: "ذكاء طلبات العملاء وتقدير المبيعات المفقودة التحفظي",
		formulaEn: "Weighted Lost Units = Σ (BaseUnits × IntentWeight[0.65 confirmed, 0.35 standard, 0.15 24h-repeat, 0.0 fulfilled]); Demand Capture % = Actual Sold / (Actual Sold + Unmet Base Units)",
		formulaAr: "الوحدات المفقودة المرجحة = مجموع (الوحدات × معامل التحقق [65% نية مؤكدة، 35% عادي، 15% تكرار 24 ساعة])؛ كفاءة استيعاب الطلب = المباع الفعلي ÷ إجمالي الطلب المرصود",
		unit: "count",
		sourceTables: [
			"unmet_demand_requests",
			"products",
			"sale_items"
		]
	}
];
/**
* Pure, deterministic orchestrator that computes the complete BI & Predictive Analytics suite
* from a dataset snapshot, filter parameters, and server-verified user context.
*/
function computeFullAnalyticsOverview(dataset, rawFilters = {}, rawUser, referenceDate = /* @__PURE__ */ new Date()) {
	const userContext = resolveAnalyticsUserContext({
		userId: rawUser?.userId,
		userName: rawUser?.userName,
		role: rawUser?.role,
		branchId: rawUser?.assignedBranchId,
		terminalName: rawUser?.assignedTerminalName
	}, dataset.users);
	const filtersApplied = enforceScopedFilters(rawFilters, userContext);
	const rawSales = computeSalesAnalytics(dataset, filtersApplied, referenceDate);
	const rawFinancial = computeFinancialAnalytics(dataset, filtersApplied, rawSales, referenceDate);
	const rawInventory = computeInventoryAnalytics(dataset, filtersApplied, rawSales, referenceDate);
	const rawCustomers = computeCustomerAnalytics(dataset, filtersApplied, referenceDate);
	const rawBranches = computeBranchAnalytics(dataset, filtersApplied, referenceDate);
	const technicalIndicators = computeTechnicalIndicators(dataset, filtersApplied, rawSales, referenceDate);
	const rawForecasts = computeForecasts(dataset, filtersApplied, rawSales, referenceDate);
	const rawIntelligence = computeSmartStoreIntelligence({
		dataset,
		filters: filtersApplied,
		sales: rawSales,
		financial: rawFinancial,
		inventory: rawInventory,
		customers: rawCustomers,
		branches: rawBranches,
		technicalIndicators,
		forecasts: rawForecasts,
		unmetDemand: computeUnmetDemandAnalytics(dataset, filtersApplied, rawSales, rawInventory, userContext, referenceDate),
		userContext,
		now: referenceDate
	});
	const rawInsights = generateExplainableInsights({
		sales: rawSales,
		financial: rawFinancial,
		inventory: rawInventory,
		customers: rawCustomers,
		branches: rawBranches,
		technicalIndicators,
		forecasts: rawForecasts
	});
	return {
		generatedAt: referenceDate.toISOString(),
		filtersApplied,
		userContext,
		sourceOfTruthMatrix: dataset.sourceOfTruthMatrix,
		sales: sanitizeSalesForRole(rawSales, userContext),
		financial: sanitizeFinancialsForRole(rawFinancial, userContext),
		inventory: sanitizeInventoryForRole(rawInventory, userContext),
		customers: sanitizeCustomersForRole(rawCustomers, userContext),
		branches: sanitizeBranchesForRole(rawBranches, userContext),
		technicalIndicators,
		forecasts: sanitizeForecastsForRole(rawForecasts, userContext),
		insights: sanitizeInsightsForRole(rawInsights, userContext),
		intelligence: sanitizeIntelligenceForRole(rawIntelligence, userContext),
		metricsDictionary: ANALYTICS_METRICS_DICTIONARY
	};
}
// src/components/analytics/AnalyticsCharts.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var import_jsx_runtime = require_jsx_runtime();
function TechnicalTrendOverlayChart({ series, supportFloor, resistanceCeiling, currency, language }) {
	const isAr = language === "ar";
	const [hoverIdx, setHoverIdx] = (0, import_react.useState)(null);
	if (!series || series.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-56 flex items-center justify-center text-xs text-slate-400",
		children: isAr ? "لا توجد بيانات زمنية كافية للرسم البياني" : "Insufficient time-series data for chart"
	});
	const width = 760;
	const height = 250;
	const padLeft = 58;
	const padTop = 20;
	const plotW = 678;
	const plotH = 196;
	const allVals = series.flatMap((p) => [
		p.value,
		p.sma7,
		p.ema7,
		p.trendlineValue,
		supportFloor,
		resistanceCeiling
	].filter((v) => v !== null && Number.isFinite(v)));
	const maxVal = Math.max(10, ...allVals) * 1.12;
	const xAt = (i) => series.length <= 1 ? 397 : padLeft + i / (series.length - 1) * plotW;
	const yAt = (v) => 216 - Math.min(1, Math.max(0, v / maxVal)) * plotH;
	const buildPath = (getter) => {
		const segments = [];
		let started = false;
		series.forEach((pt, idx) => {
			const val = getter(pt);
			if (val === null || !Number.isFinite(val)) {
				started = false;
				return;
			}
			const x = xAt(idx).toFixed(1);
			const y = yAt(val).toFixed(1);
			segments.push(`${started ? "L" : "M"} ${x} ${y}`);
			started = true;
		});
		return segments.join(" ");
	};
	const mainLinePath = buildPath((p) => p.value);
	const areaPath = mainLinePath.length > 0 ? `${mainLinePath} L ${xAt(series.length - 1).toFixed(1)} ${216 .toFixed(1)} L ${xAt(0).toFixed(1)} ${216 .toFixed(1)} Z` : "";
	const sma7Path = buildPath((p) => p.sma7);
	const ema7Path = buildPath((p) => p.ema7);
	const trendPath = buildPath((p) => p.trendlineValue);
	const activePoint = hoverIdx !== null && series[hoverIdx] ? series[hoverIdx] : series[series.length - 1];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-2 text-[11px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 font-semibold text-emerald-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" }), isAr ? "صافي المبيعات اليومي" : "Daily Net Sales"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 font-semibold text-amber-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-0.5 bg-amber-400 inline-block" }), "SMA(7)"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 font-semibold text-sky-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-0.5 bg-sky-400 inline-block" }), "EMA(7)"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 font-semibold text-fuchsia-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-0.5 border-b border-dashed border-fuchsia-400 inline-block" }), isAr ? "خط الاتجاه (Regression)" : "Linear Trendline"]
					})
				]
			}), activePoint && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-2.5 py-1 rounded-lg bg-slate-900/70 border border-slate-800 text-slate-200 font-mono text-[11px] flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-slate-400",
						children: activePoint.dateKey
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-emerald-400 font-bold",
						children: formatCurrency(activePoint.value, currency, language)
					}),
					activePoint.sma7 !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-amber-300",
						children: ["SMA7: ", activePoint.sma7]
					}),
					activePoint.ema7 !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sky-300",
						children: ["EMA7: ", activePoint.ema7]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative w-full overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: `0 0 ${width} ${height}`,
				className: "w-full h-60 select-none overflow-visible",
				onMouseLeave: () => setHoverIdx(null),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "biTechAreaGrad",
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "#10b981",
							stopOpacity: "0.28"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "#10b981",
							stopOpacity: "0.0"
						})]
					}) }),
					[
						0,
						.25,
						.5,
						.75,
						1
					].map((ratio) => {
						const val = maxVal * ratio;
						const y = yAt(val);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: padLeft,
							y1: y,
							x2: 736,
							y2: y,
							stroke: "currentColor",
							className: "text-slate-700/30",
							strokeDasharray: "3 3"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: 52,
							y: y + 3,
							textAnchor: "end",
							className: "fill-slate-400 text-[9px] font-mono",
							children: Math.round(val)
						})] }, ratio);
					}),
					resistanceCeiling > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: padLeft,
						y1: yAt(resistanceCeiling),
						x2: 736,
						y2: yAt(resistanceCeiling),
						stroke: "#f43f5e",
						strokeWidth: "1",
						strokeDasharray: "4 4",
						opacity: "0.7"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: 732,
						y: yAt(resistanceCeiling) - 4,
						textAnchor: "end",
						className: "fill-rose-400 text-[9px] font-mono",
						children: isAr ? `مقاومة/ذروة ${resistanceCeiling}` : `Resistance ${resistanceCeiling}`
					})] }),
					supportFloor > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: padLeft,
						y1: yAt(supportFloor),
						x2: 736,
						y2: yAt(supportFloor),
						stroke: "#38bdf8",
						strokeWidth: "1",
						strokeDasharray: "4 4",
						opacity: "0.65"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: 732,
						y: yAt(supportFloor) - 4,
						textAnchor: "end",
						className: "fill-sky-400 text-[9px] font-mono",
						children: isAr ? `دعم ${supportFloor}` : `Support ${supportFloor}`
					})] }),
					areaPath && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: areaPath,
						fill: "url(#biTechAreaGrad)"
					}),
					trendPath && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: trendPath,
						fill: "none",
						stroke: "#e879f9",
						strokeWidth: "1.5",
						strokeDasharray: "5 4"
					}),
					sma7Path && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: sma7Path,
						fill: "none",
						stroke: "#fbbf24",
						strokeWidth: "2"
					}),
					ema7Path && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: ema7Path,
						fill: "none",
						stroke: "#38bdf8",
						strokeWidth: "2"
					}),
					mainLinePath && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: mainLinePath,
						fill: "none",
						stroke: "#10b981",
						strokeWidth: "2.5"
					}),
					series.map((pt, i) => {
						const cx = xAt(i);
						const cy = yAt(pt.value);
						const isHovered = hoverIdx === i;
						const showTick = series.length <= 12 || i === 0 || i === series.length - 1 || i % Math.ceil(series.length / 8) === 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
							isHovered && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: cx,
								y1: padTop,
								x2: cx,
								y2: 216,
								stroke: "#10b981",
								strokeWidth: "1",
								strokeDasharray: "2 2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx,
								cy,
								r: isHovered ? 5 : pt.value > 0 ? 3 : 2,
								className: pt.value > 0 ? "fill-emerald-400 stroke-slate-950 stroke-2" : "fill-slate-600"
							}),
							showTick && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: cx,
								y: 240,
								textAnchor: "middle",
								className: "fill-slate-400 text-[9px] font-mono",
								children: pt.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: cx - plotW / Math.max(2, series.length) / 2,
								y: padTop,
								width: plotW / Math.max(1, series.length),
								height: plotH,
								fill: "transparent",
								className: "cursor-pointer",
								onMouseEnter: () => setHoverIdx(i)
							})
						] }, pt.dateKey);
					})
				]
			})
		})]
	});
}
function IntradayCandlestickChart({ candles, currency, language }) {
	const isAr = language === "ar";
	const [hoverIdx, setHoverIdx] = (0, import_react.useState)(null);
	const visibleCandles = candles.length > 14 ? candles.slice(-14) : candles;
	if (visibleCandles.length === 0) return null;
	const width = 760;
	const height = 220;
	const padLeft = 58;
	const plotW = 678;
	const plotH = 170;
	const maxHigh = Math.max(10, ...visibleCandles.map((c) => Math.max(c.high, c.dailyTotalSales))) * 1.1;
	const yAt = (v) => 188 - Math.min(1, Math.max(0, v / maxHigh)) * plotH;
	const stepW = plotW / Math.max(1, visibleCandles.length);
	const candleW = Math.max(8, Math.min(26, stepW * .48));
	const active = hoverIdx !== null && visibleCandles[hoverIdx] ? visibleCandles[hoverIdx] : visibleCandles[visibleCandles.length - 1];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-2 text-[11px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 text-slate-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5 text-emerald-400 font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" }), isAr ? "إغلاق أعلى من الافتتاح (زخم مسائي)" : "Close ≥ Open (Strong Closing Hour)"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5 text-amber-400 font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" }), isAr ? "افتتاح أعلى من الإغلاق (ذروة صباحية)" : "Open > Close (Morning Front-Loaded)"]
				})]
			}), active && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-2.5 py-1 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] font-mono text-slate-200 flex flex-wrap items-center gap-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-slate-400",
						children: active.dateKey
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["O: ", active.open] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-emerald-400",
						children: ["H: ", active.high]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-rose-400",
						children: ["L: ", active.low]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sky-400",
						children: ["C: ", active.close]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-amber-300 font-bold",
						children: [
							isAr ? "الإجمالي:" : "Total:",
							" ",
							formatCurrency(active.dailyTotalSales, currency, language)
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: `0 0 ${width} ${height}`,
			className: "w-full h-52 select-none",
			onMouseLeave: () => setHoverIdx(null),
			children: [[
				0,
				.5,
				1
			].map((r) => {
				const val = maxHigh * r;
				const y = yAt(val);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: padLeft,
					y1: y,
					x2: 736,
					y2: y,
					stroke: "currentColor",
					className: "text-slate-700/30",
					strokeDasharray: "3 3"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: 52,
					y: y + 3,
					textAnchor: "end",
					className: "fill-slate-400 text-[9px] font-mono",
					children: Math.round(val)
				})] }, r);
			}), visibleCandles.map((c, idx) => {
				const cx = padLeft + idx * stepW + stepW / 2;
				const isBull = c.close >= c.open;
				const color = c.dailyTotalSales === 0 ? "#475569" : isBull ? "#10b981" : "#f59e0b";
				const yHigh = yAt(c.high);
				const yLow = yAt(c.low);
				const yOpen = yAt(c.open);
				const yClose = yAt(c.close);
				const bodyTop = Math.min(yOpen, yClose);
				const bodyHeight = Math.max(3, Math.abs(yClose - yOpen));
				const yTotal = yAt(c.dailyTotalSales);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					className: "cursor-pointer",
					onMouseEnter: () => setHoverIdx(idx),
					children: [
						c.dailyTotalSales > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: cx - candleW * .7,
							y: yTotal,
							width: candleW * 1.4,
							height: Math.max(2, 188 - yTotal),
							rx: 2,
							fill: color,
							opacity: .14
						}),
						c.high > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: cx,
							y1: yHigh,
							x2: cx,
							y2: yLow,
							stroke: color,
							strokeWidth: "2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: cx - candleW / 2,
							y: bodyTop,
							width: candleW,
							height: bodyHeight,
							rx: 2,
							fill: color
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: cx,
							y: 210,
							textAnchor: "middle",
							className: "fill-slate-400 text-[9px] font-mono",
							children: c.label
						})
					]
				}, c.dateKey);
			})]
		})]
	});
}
function StatisticalForecastFanChart({ series, currency, language }) {
	const isAr = language === "ar";
	const [hoverIdx, setHoverIdx] = (0, import_react.useState)(null);
	if (!series || series.length === 0) return null;
	const width = 760;
	const height = 250;
	const padLeft = 58;
	const padTop = 20;
	const plotW = 678;
	const plotH = 196;
	const maxVal = Math.max(10, ...series.map((p) => Math.max(p.actualValue ?? 0, p.fittedOrForecastValue, p.upperBound95 ?? 0))) * 1.1;
	const xAt = (i) => series.length <= 1 ? 397 : padLeft + i / (series.length - 1) * plotW;
	const yAt = (v) => 216 - Math.min(1, Math.max(0, v / maxVal)) * plotH;
	const forecastIndices = series.map((p, idx) => !p.isHistorical ? idx : -1).filter((idx) => idx >= 0);
	let band95Path = "";
	let band80Path = "";
	if (forecastIndices.length > 1) {
		const upper95Pts = forecastIndices.map((i) => `${xAt(i).toFixed(1)},${yAt(series[i].upperBound95 ?? series[i].fittedOrForecastValue).toFixed(1)}`);
		const lower95Pts = [...forecastIndices].reverse().map((i) => `${xAt(i).toFixed(1)},${yAt(series[i].lowerBound95 ?? 0).toFixed(1)}`);
		band95Path = `M ${upper95Pts.join(" L ")} L ${lower95Pts.join(" L ")} Z`;
		const upper80Pts = forecastIndices.map((i) => `${xAt(i).toFixed(1)},${yAt(series[i].upperBound80 ?? series[i].fittedOrForecastValue).toFixed(1)}`);
		const lower80Pts = [...forecastIndices].reverse().map((i) => `${xAt(i).toFixed(1)},${yAt(series[i].lowerBound80 ?? 0).toFixed(1)}`);
		band80Path = `M ${upper80Pts.join(" L ")} L ${lower80Pts.join(" L ")} Z`;
	}
	const histPts = series.map((p, i) => p.isHistorical && p.actualValue !== null ? `${xAt(i).toFixed(1)},${yAt(p.actualValue).toFixed(1)}` : null).filter(Boolean);
	const actualPath = histPts.length > 0 ? `M ${histPts.join(" L ")}` : "";
	const modelPts = series.map((p, i) => `${xAt(i).toFixed(1)},${yAt(p.fittedOrForecastValue).toFixed(1)}`);
	const modelPath = modelPts.length > 0 ? `M ${modelPts.join(" L ")}` : "";
	const splitIdx = series.findIndex((p) => !p.isHistorical);
	const active = hoverIdx !== null && series[hoverIdx] ? series[hoverIdx] : series[series.length - 1];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-2 text-[11px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 font-semibold text-emerald-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" }), isAr ? "المبيعات الفعلية التاريخية" : "Historical Actuals"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 font-semibold text-amber-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-0.5 bg-amber-400 inline-block" }), isAr ? "مسار التنبؤ الإحصائي" : "Statistical Forecast"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 text-amber-300/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-2 rounded-sm bg-amber-500/30 inline-block" }), isAr ? "نطاقات عدم يقين تقديرية (80% / 95%)" : "80% & 95% Estimated Uncertainty Ranges"]
					})
				]
			}), active && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-2.5 py-1 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] font-mono text-slate-200 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-slate-400",
					children: active.dateKey
				}), active.isHistorical ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-emerald-400 font-bold",
					children: [
						isAr ? "فعلي:" : "Actual:",
						" ",
						formatCurrency(active.actualValue ?? 0, currency, language)
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-amber-400 font-bold",
					children: [
						isAr ? "متوقع:" : "Forecast:",
						" ",
						formatCurrency(active.fittedOrForecastValue, currency, language)
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-slate-400",
					children: [
						"80%: [",
						active.lowerBound80,
						" – ",
						active.upperBound80,
						"]"
					]
				})] })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: `0 0 ${width} ${height}`,
			className: "w-full h-60 select-none",
			onMouseLeave: () => setHoverIdx(null),
			children: [
				[
					0,
					.25,
					.5,
					.75,
					1
				].map((r) => {
					const val = maxVal * r;
					const y = yAt(val);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: padLeft,
						y1: y,
						x2: 736,
						y2: y,
						stroke: "currentColor",
						className: "text-slate-700/30",
						strokeDasharray: "3 3"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: 52,
						y: y + 3,
						textAnchor: "end",
						className: "fill-slate-400 text-[9px] font-mono",
						children: Math.round(val)
					})] }, r);
				}),
				splitIdx > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: xAt(splitIdx),
					y1: padTop,
					x2: xAt(splitIdx),
					y2: 216,
					stroke: "#fbbf24",
					strokeWidth: "1",
					strokeDasharray: "4 4"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: xAt(splitIdx) + 6,
					y: 30,
					className: "fill-amber-400 text-[9px] font-semibold",
					children: isAr ? "بداية التوقعات المستقبلية ←" : "Forecast Horizon →"
				})] }),
				band95Path && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: band95Path,
					fill: "#f59e0b",
					opacity: "0.12"
				}),
				band80Path && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: band80Path,
					fill: "#f59e0b",
					opacity: "0.22"
				}),
				modelPath && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: modelPath,
					fill: "none",
					stroke: "#fbbf24",
					strokeWidth: "2",
					strokeDasharray: "5 3"
				}),
				actualPath && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: actualPath,
					fill: "none",
					stroke: "#10b981",
					strokeWidth: "2.5"
				}),
				series.map((pt, i) => {
					const cx = xAt(i);
					const cy = yAt(pt.isHistorical && pt.actualValue !== null ? pt.actualValue : pt.fittedOrForecastValue);
					const showTick = series.length <= 14 || i === 0 || i === series.length - 1 || i % Math.ceil(series.length / 8) === 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx,
							cy,
							r: hoverIdx === i ? 4.5 : 2.5,
							fill: pt.isHistorical ? "#10b981" : "#fbbf24"
						}),
						showTick && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: cx,
							y: 240,
							textAnchor: "middle",
							className: "fill-slate-400 text-[9px] font-mono",
							children: pt.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: cx - plotW / Math.max(2, series.length) / 2,
							y: padTop,
							width: plotW / Math.max(1, series.length),
							height: plotH,
							fill: "transparent",
							className: "cursor-pointer",
							onMouseEnter: () => setHoverIdx(i)
						})
					] }, `${pt.dateKey}-${i}`);
				})
			]
		})]
	});
}
function AbcParetoChart({ products, language }) {
	const isAr = language === "ar";
	const topItems = products.slice(0, 10);
	if (topItems.length === 0) return null;
	const width = 760;
	const height = 210;
	const padLeft = 48;
	const plotW = 664;
	const plotH = 154;
	const maxBasis = Math.max(1, ...topItems.map((p) => p.abcBasisValue));
	const stepW = plotW / topItems.length;
	const barW = Math.max(14, Math.min(38, stepW * .55));
	const yPct = (pct) => 172 - Math.min(100, Math.max(0, pct)) / 100 * plotH;
	const paretoPts = topItems.map((p, i) => `${(padLeft + i * stepW + stepW / 2).toFixed(1)},${yPct(p.abcCumulativeSharePercent).toFixed(1)}`);
	const paretoPath = paretoPts.length > 0 ? `M ${paretoPts.join(" L ")}` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${width} ${height}`,
		className: "w-full h-52 select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: padLeft,
				y1: yPct(80),
				x2: 712,
				y2: yPct(80),
				stroke: "#10b981",
				strokeWidth: "1",
				strokeDasharray: "4 4",
				opacity: "0.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: 716,
				y: yPct(80) + 3,
				className: "fill-emerald-400 text-[9px] font-mono",
				children: "80%"
			}),
			topItems.map((item, i) => {
				const cx = padLeft + i * stepW + stepW / 2;
				const bh = Math.max(3, item.abcBasisValue / maxBasis * plotH);
				const by = 172 - bh;
				const fill = item.abcClass === "A" ? "#10b981" : item.abcClass === "B" ? "#f59e0b" : "#64748b";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: cx - barW / 2,
						y: by,
						width: barW,
						height: bh,
						rx: 4,
						fill,
						opacity: .85
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: cx,
						y: by - 4,
						textAnchor: "middle",
						className: "fill-slate-300 text-[9px] font-mono font-bold",
						children: item.abcClass
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: cx,
						y: 198,
						textAnchor: "middle",
						className: "fill-slate-400 text-[9px] font-mono",
						children: item.sku
					})
				] }, item.productId);
			}),
			paretoPath && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: paretoPath,
				fill: "none",
				stroke: "#38bdf8",
				strokeWidth: "2"
			}),
			topItems.map((item, i) => {
				const cx = padLeft + i * stepW + stepW / 2;
				const cy = yPct(item.abcCumulativeSharePercent);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx,
					cy,
					r: 3.5,
					fill: "#38bdf8"
				}, `pt-${item.productId}`);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: padLeft,
				y: 12,
				className: "fill-sky-400 text-[10px] font-semibold",
				children: isAr ? "الأعمدة: قيمة مساهمة الصنف (A/B/C) • الخط الأزرق: النسبة التراكمية لباريتو %" : "Bars: SKU Value Contribution (Class A/B/C) • Blue Curve: Cumulative Pareto Share %"
			})
		]
	});
}
// src/components/intelligence/IntelligenceCenterView.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var SEVERITY_STYLES = {
	CRITICAL: "bg-rose-500/15 text-rose-300 border-rose-500/40",
	HIGH: "bg-amber-500/15 text-amber-300 border-amber-500/40",
	MEDIUM: "bg-sky-500/15 text-sky-300 border-sky-500/40",
	LOW: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
	INFO: "bg-neutral-800 text-neutral-300 border-neutral-700"
};
var STATUS_BADGE_STYLES = {
	ACTIVE: {
		cls: "bg-rose-500/15 text-rose-300 border-rose-500/40",
		en: "Active",
		ar: "نشط"
	},
	ACKNOWLEDGED: {
		cls: "bg-amber-500/15 text-amber-300 border-amber-500/40",
		en: "Acknowledged",
		ar: "تم الاطلاع"
	},
	RESOLVED: {
		cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
		en: "Resolved",
		ar: "تم الحل"
	},
	DISMISSED: {
		cls: "bg-neutral-800 text-neutral-400 border-neutral-700",
		en: "Dismissed",
		ar: "مستبعد"
	}
};
var STREAM_LABELS = {
	smart_alert: {
		en: "Operational Alert",
		ar: "تنبيه تشغيلي",
		badge: "bg-rose-500/10 text-rose-300 border-rose-500/30"
	},
	replenishment: {
		en: "Smart Replenishment",
		ar: "توصية إعادة تزويد",
		badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
	},
	branch_transfer: {
		en: "Branch Transfer",
		ar: "تحويل بين الفروع",
		badge: "bg-sky-500/10 text-sky-300 border-sky-500/30"
	},
	bi_insight: {
		en: "BI Insight",
		ar: "توصية تحليلية",
		badge: "bg-amber-500/10 text-amber-300 border-amber-500/30"
	}
};
var IntelligenceCenterView = ({ isAr, currentUserId, currentUserRole, initialBranchId = "all", onLifecycleMutated, onOpenUnmetDemandModal }) => {
	const [activeStatusTab, setActiveStatusTab] = (0, import_react.useState)("ACTIVE");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [itemStreamFilter, setItemStreamFilter] = (0, import_react.useState)("all");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("all");
	const [severityFilter, setSeverityFilter] = (0, import_react.useState)("all");
	const [branchFilter, setBranchFilter] = (0, import_react.useState)(initialBranchId || "all");
	const [startDate, setStartDate] = (0, import_react.useState)("");
	const [endDate, setEndDate] = (0, import_react.useState)("");
	const [sortBy, setSortBy] = (0, import_react.useState)("priority_desc");
	const [page, setPage] = (0, import_react.useState)(1);
	const [showFiltersMobile, setShowFiltersMobile] = (0, import_react.useState)(false);
	const [listData, setListData] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [errorMsg, setErrorMsg] = (0, import_react.useState)(null);
	const [busyItemId, setBusyItemId] = (0, import_react.useState)(null);
	const [actionDialog, setActionDialog] = (0, import_react.useState)({
		isOpen: false,
		mode: "RESOLVE",
		item: null,
		note: "",
		actionType: "RESTOCK_ORDERED"
	});
	const [detailState, setDetailState] = (0, import_react.useState)({
		isOpen: false,
		loading: false,
		item: null,
		history: []
	});
	const canReopen = currentUserRole === "admin" || currentUserRole === "manager";
	const fetchLifecycleList = (0, import_react.useCallback)(async () => {
		setIsLoading(true);
		setErrorMsg(null);
		try {
			const params = new URLSearchParams({
				status: activeStatusTab,
				itemStream: itemStreamFilter,
				category: categoryFilter,
				severity: severityFilter,
				branchId: branchFilter,
				sortBy,
				page: String(page),
				pageSize: "15"
			});
			if (searchQuery.trim()) params.set("search", searchQuery.trim());
			if (startDate) params.set("startDate", startDate);
			if (endDate) params.set("endDate", endDate);
			const res = await fetch(`/api/intelligence/lifecycle?${params.toString()}`, { headers: { "x-user-id": currentUserId } });
			const json = await res.json();
			if (!res.ok || !json.success) throw new Error(json.error || "Failed to load intelligence lifecycle items");
			setListData(json.data);
			if (onLifecycleMutated && json.data?.counts) onLifecycleMutated(json.data.counts);
		} catch (err) {
			setErrorMsg(err?.message || "Error loading intelligence lifecycle");
		} finally {
			setIsLoading(false);
		}
	}, [
		activeStatusTab,
		itemStreamFilter,
		categoryFilter,
		severityFilter,
		branchFilter,
		startDate,
		endDate,
		searchQuery,
		sortBy,
		page,
		currentUserId,
		onLifecycleMutated
	]);
	(0, import_react.useEffect)(() => {
		fetchLifecycleList();
	}, [fetchLifecycleList]);
	const handleDirectAcknowledge = async (item) => {
		setBusyItemId(item.id);
		setErrorMsg(null);
		try {
			const res = await fetch(`/api/intelligence/lifecycle/${encodeURIComponent(item.id)}/acknowledge`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-user-id": currentUserId
				},
				body: JSON.stringify({ note: isAr ? "تم الاطلاع والمتابعة التشغيلية" : "Acknowledged for operational follow-up" })
			});
			const json = await res.json();
			if (!res.ok || !json.success) throw new Error(json.error || "Failed to acknowledge item");
			await fetchLifecycleList();
			if (detailState.isOpen && detailState.item?.id === item.id) setDetailState({
				isOpen: true,
				loading: false,
				item: json.data.item,
				history: json.data.history || []
			});
		} catch (err) {
			setErrorMsg(err?.message || "Action failed");
		} finally {
			setBusyItemId(null);
		}
	};
	const handleSubmitActionDialog = async (e) => {
		e.preventDefault();
		if (!actionDialog.item) return;
		const item = actionDialog.item;
		const endpoint = {
			RESOLVE: "resolve",
			DISMISS: "dismiss",
			REOPEN: "reopen"
		}[actionDialog.mode];
		setBusyItemId(item.id);
		setErrorMsg(null);
		try {
			const res = await fetch(`/api/intelligence/lifecycle/${encodeURIComponent(item.id)}/${endpoint}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-user-id": currentUserId
				},
				body: JSON.stringify({
					note: actionDialog.note.trim() || (actionDialog.mode === "RESOLVE" ? isAr ? "تمت المعالجة التشغيلية بنجاح" : "Operational issue resolved" : actionDialog.mode === "DISMISS" ? isAr ? "تم الاستبعاد لعدم الحاجة لإجراء" : "Dismissed by operator" : isAr ? "إعادة فتح للمراجعة" : "Reopened for review"),
					actionType: actionDialog.actionType
				})
			});
			const json = await res.json();
			if (!res.ok || !json.success) throw new Error(json.error || "Lifecycle transition failed");
			setActionDialog((prev) => ({
				...prev,
				isOpen: false,
				item: null,
				note: ""
			}));
			await fetchLifecycleList();
			if (detailState.isOpen && detailState.item?.id === item.id) setDetailState({
				isOpen: true,
				loading: false,
				item: json.data.item,
				history: json.data.history || []
			});
		} catch (err) {
			setErrorMsg(err?.message || "Lifecycle transition failed");
		} finally {
			setBusyItemId(null);
		}
	};
	const handleOpenDetailDrawer = async (item) => {
		setDetailState({
			isOpen: true,
			loading: true,
			item,
			history: []
		});
		try {
			const res = await fetch(`/api/intelligence/lifecycle/${encodeURIComponent(item.id)}/history`, { headers: { "x-user-id": currentUserId } });
			const json = await res.json();
			if (res.ok && json.success) setDetailState({
				isOpen: true,
				loading: false,
				item: json.data.item,
				history: json.data.history || []
			});
			else setDetailState((prev) => ({
				...prev,
				loading: false
			}));
		} catch {
			setDetailState((prev) => ({
				...prev,
				loading: false
			}));
		}
	};
	const counts = listData?.counts || {
		active: 0,
		acknowledged: 0,
		resolved: 0,
		dismissed: 0,
		allHistory: 0,
		criticalActive: 0,
		highActive: 0
	};
	const tabs = [
		{
			id: "ACTIVE",
			labelEn: "Active",
			labelAr: "التنبيهات النشطة",
			count: counts.active,
			badgeCls: "bg-rose-500/20 text-rose-300 border-rose-500/40"
		},
		{
			id: "ACKNOWLEDGED",
			labelEn: "Acknowledged",
			labelAr: "قيد المتابعة",
			count: counts.acknowledged,
			badgeCls: "bg-amber-500/20 text-amber-300 border-amber-500/40"
		},
		{
			id: "RESOLVED",
			labelEn: "Resolved",
			labelAr: "تم الحل",
			count: counts.resolved,
			badgeCls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
		},
		{
			id: "DISMISSED",
			labelEn: "Dismissed",
			labelAr: "المستبعدة",
			count: counts.dismissed,
			badgeCls: "bg-neutral-800 text-neutral-400 border-neutral-700"
		},
		{
			id: "ALL_HISTORY",
			labelEn: "All History",
			labelAr: "السجل الكامل",
			count: counts.allHistory,
			badgeCls: "bg-sky-500/20 text-sky-300 border-sky-500/40"
		}
	];
	const formatTimestamp = (iso) => {
		if (!iso) return "—";
		try {
			return new Date(iso).toLocaleString(isAr ? "ar-SD" : "en-US", {
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			});
		} catch {
			return iso;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "intelligence-center-view",
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start sm:items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base sm:text-lg font-extrabold text-white tracking-tight",
							children: isAr ? "مركز الذكاء التشغيلي وإدارة دورة حياة التوصيات" : "Intelligence Center & Recommendation Lifecycle"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold",
							children: isAr ? "محفوظ في قاعدة البيانات" : "Database Persisted"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-neutral-400 mt-0.5",
						children: isAr ? "إدارة موحدة للتنبيهات، توصيات التزويد، والتحويلات بين الفروع مع توثيق كامل للمستخدم والوقت والملاحظات" : "Unified lifecycle management for alerts, replenishment, and branch transfers with full audit history"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [onOpenUnmetDemandModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-testid": "intel-center-log-demand-btn",
						onClick: onOpenUnmetDemandModal,
						className: "px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-extrabold transition-colors",
						children: isAr ? "+ تسجيل طلب غير متوفر" : "+ Log Unmet Demand"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": "intel-center-refresh-btn",
						onClick: () => fetchLifecycleList(),
						disabled: isLoading,
						className: "px-3 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${isLoading ? "animate-spin text-amber-400" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تحديث" : "Refresh" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-testid": "intelligence-lifecycle-tabs",
				className: "grid grid-cols-2 sm:grid-cols-5 gap-2",
				children: tabs.map((tab) => {
					const isSelected = activeStatusTab === tab.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": `lifecycle-tab-${tab.id.toLowerCase()}`,
						onClick: () => {
							setActiveStatusTab(tab.id);
							setPage(1);
						},
						className: `p-3 rounded-2xl border text-start transition-all flex items-center justify-between gap-2 ${isSelected ? "bg-neutral-900 border-amber-500/60 shadow-sm ring-1 ring-amber-500/30" : "bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700 text-neutral-400"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-xs font-extrabold truncate ${isSelected ? "text-white" : "text-neutral-300"}`,
							children: isAr ? tab.labelAr : tab.labelEn
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `px-2 py-0.5 rounded-lg text-xs font-mono font-extrabold border tabular-nums ${tab.badgeCls}`,
							children: tab.count
						})]
					}, tab.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-neutral-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							"data-testid": "lifecycle-search-input",
							value: searchQuery,
							onChange: (e) => {
								setSearchQuery(e.target.value);
								setPage(1);
							},
							placeholder: isAr ? "ابحث باسم المنتج، الكود، سبب التنبيه، أو اسم الموظف..." : "Search by product, SKU, alert title, recommendation, or operator...",
							className: "w-full min-h-[38px] ps-9 pe-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							"aria-label": isAr ? "ترتيب حسب" : "Sort By",
							"data-testid": "lifecycle-sort-select",
							value: sortBy,
							onChange: (e) => {
								setSortBy(e.target.value);
								setPage(1);
							},
							className: "min-h-[38px] px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-bold text-neutral-200 focus:outline-none focus:border-amber-500",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "priority_desc",
									children: isAr ? "الأولوية (الأعلى أولاً)" : "Priority (Highest First)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "severity_desc",
									children: isAr ? "الخطورة (الحرجة أولاً)" : "Severity (Critical First)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "updated_desc",
									children: isAr ? "أحدث إجراء / تحديث" : "Recently Updated"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "created_desc",
									children: isAr ? "تاريخ الاكتشاف" : "Detection Date"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setShowFiltersMobile((prev) => !prev),
							className: "lg:hidden min-h-[38px] px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-bold text-amber-400 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تصفية" : "Filters" })]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `${showFiltersMobile ? "grid" : "hidden lg:grid"} grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2 border-t border-neutral-800/80`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[10px] font-bold text-neutral-400 mb-1",
							children: isAr ? "نوع التوصية" : "Intelligence Stream"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							"data-testid": "lifecycle-stream-filter",
							value: itemStreamFilter,
							onChange: (e) => {
								setItemStreamFilter(e.target.value);
								setPage(1);
							},
							className: "w-full min-h-[34px] px-2.5 py-1 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: isAr ? "كل الأنواع" : "All Streams"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "smart_alert",
									children: isAr ? "تنبيهات تشغيلية" : "Operational Alerts"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "replenishment",
									children: isAr ? "توصيات إعادة التزويد" : "Smart Replenishment"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "branch_transfer",
									children: isAr ? "تحويلات بين الفروع" : "Branch Transfers"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "bi_insight",
									children: isAr ? "تحليلات ذكاء الأعمال" : "BI Insights"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[10px] font-bold text-neutral-400 mb-1",
							children: isAr ? "التصنيف" : "Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							"data-testid": "lifecycle-category-filter",
							value: categoryFilter,
							onChange: (e) => {
								setCategoryFilter(e.target.value);
								setPage(1);
							},
							className: "w-full min-h-[34px] px-2.5 py-1 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: isAr ? "كل التصنيفات" : "All Categories"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "STOCKOUT_RISK",
									children: isAr ? "مخاطر نفاد المخزون" : "Stockout Risk"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "INVENTORY_RISK",
									children: isAr ? "مخاطر المخزون" : "Inventory Risk"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "UNMET_DEMAND",
									children: isAr ? "الطلب غير الملبي" : "Unmet Demand"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "REPLENISHMENT",
									children: isAr ? "إعادة التزويد" : "Replenishment"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "TRANSFER_OPPORTUNITY",
									children: isAr ? "فرص التحويل" : "Branch Transfer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "FINANCIAL_RISK",
									children: isAr ? "المخاطر المالية" : "Financial Risk"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "SALES_ANOMALY",
									children: isAr ? "شذوذ المبيعات" : "Sales Anomaly"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "BRANCH_IMBALANCE",
									children: isAr ? "تباين الفروع" : "Branch Imbalance"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[10px] font-bold text-neutral-400 mb-1",
							children: isAr ? "درجة الأهمية" : "Severity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							"data-testid": "lifecycle-severity-filter",
							value: severityFilter,
							onChange: (e) => {
								setSeverityFilter(e.target.value);
								setPage(1);
							},
							className: "w-full min-h-[34px] px-2.5 py-1 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: isAr ? "كل الدرجات" : "All Severities"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "CRITICAL",
									children: isAr ? "حرج (Critical)" : "Critical"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "HIGH",
									children: isAr ? "مرتفع (High)" : "High"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "MEDIUM",
									children: isAr ? "متوسط (Medium)" : "Medium"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "LOW",
									children: isAr ? "منخفض (Low)" : "Low"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[10px] font-bold text-neutral-400 mb-1",
							children: isAr ? "الفرع" : "Branch"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							"data-testid": "lifecycle-branch-filter",
							value: branchFilter,
							onChange: (e) => {
								setBranchFilter(e.target.value);
								setPage(1);
							},
							className: "w-full min-h-[34px] px-2.5 py-1 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: isAr ? "كل الفروع + العام" : "All Branches & Global"
							}), DEFAULT_ANALYTICS_BRANCHES.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: b.id,
								children: isAr ? b.nameAr : b.name
							}, b.id))]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[10px] font-bold text-neutral-400 mb-1",
								children: isAr ? "من تاريخ" : "From Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: startDate,
								onChange: (e) => {
									setStartDate(e.target.value);
									setPage(1);
								},
								className: "w-full min-h-[34px] px-2 py-1 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-white"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[10px] font-bold text-neutral-400 mb-1",
								children: isAr ? "إلى تاريخ" : "To Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: endDate,
								onChange: (e) => {
									setEndDate(e.target.value);
									setPage(1);
								},
								className: "w-full min-h-[34px] px-2 py-1 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-white"
							})] })]
						})
					]
				})]
			}),
			errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-testid": "lifecycle-error-banner",
				className: "p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errorMsg }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setErrorMsg(null),
					className: "text-rose-300 hover:text-white px-2 py-0.5 rounded-lg bg-rose-500/20",
					children: "✕"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-testid": "lifecycle-items-list",
				className: "space-y-3",
				children: isLoading && (!listData || listData.items.length === 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 rounded-2xl bg-neutral-900 border border-neutral-800 text-center text-xs text-neutral-400",
					children: isAr ? "جاري تحميل سجل التوصيات والتنبيهات..." : "Loading intelligence lifecycle records..."
				}) : !listData || listData.items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-testid": "lifecycle-empty-state",
					className: "p-8 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-8 h-8 text-emerald-400 mx-auto" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-bold text-white",
							children: isAr ? "لا توجد عناصر مطابقة في هذا التبويب حالياً" : "No intelligence items match the selected lifecycle tab & filters"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-neutral-400 max-w-md mx-auto",
							children: isAr ? "يمكنك التبديل بين تبويبات (النشطة، قيد المتابعة، تم الحل، المستبعدة، أو السجل الكامل) لمراجعة كافة القرارات السابقة." : "Switch between Active, Acknowledged, Resolved, Dismissed, or All History tabs to review past operational actions."
						})
					]
				}) : listData.items.map((item) => {
					const statusMeta = STATUS_BADGE_STYLES[item.status] || STATUS_BADGE_STYLES.ACTIVE;
					const streamMeta = STREAM_LABELS[item.itemStream] || STREAM_LABELS.smart_alert;
					const sevClass = SEVERITY_STYLES[item.severity] || SEVERITY_STYLES.MEDIUM;
					const isBusy = busyItemId === item.id;
					const branchObj = DEFAULT_ANALYTICS_BRANCHES.find((b) => b.id === item.branchId);
					const branchLabel = branchObj ? isAr ? branchObj.nameAr : branchObj.name : isAr ? "كافة الفروع (عام)" : "All Branches (Global)";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-testid": `lifecycle-item-card-${item.id}`,
						"data-lifecycle-status": item.status,
						className: "p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-start justify-between gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${sevClass}`,
												children: item.severity
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `px-2 py-0.5 rounded-md text-[10px] font-bold border ${statusMeta.cls}`,
												children: isAr ? statusMeta.ar : statusMeta.en
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `px-2 py-0.5 rounded-md text-[10px] font-bold border ${streamMeta.badge}`,
												children: isAr ? streamMeta.ar : streamMeta.en
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-neutral-300 text-[10px] font-medium flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-3 h-3 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: branchLabel })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] font-mono text-neutral-500",
												children: [
													isAr ? "الأولوية:" : "Priority:",
													" ",
													item.priority,
													"/100"
												]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-sm sm:text-base font-extrabold text-white leading-snug",
										children: isAr ? item.titleAr : item.titleEn
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-1.5 shrink-0",
									children: [
										item.status === "ACTIVE" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: isBusy,
											"data-testid": `lifecycle-ack-btn-${item.id}`,
											onClick: () => handleDirectAcknowledge(item),
											className: "px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1 transition-colors",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "اطلاع ومتابعة" : "Acknowledge" })]
										}),
										(item.status === "ACTIVE" || item.status === "ACKNOWLEDGED") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: isBusy,
											"data-testid": `lifecycle-resolve-btn-${item.id}`,
											onClick: () => setActionDialog({
												isOpen: true,
												mode: "RESOLVE",
												item,
												note: "",
												actionType: "RESTOCK_ORDERED"
											}),
											className: "px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1 transition-colors",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تم الحل" : "Resolve" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: isBusy,
											"data-testid": `lifecycle-dismiss-btn-${item.id}`,
											onClick: () => setActionDialog({
												isOpen: true,
												mode: "DISMISS",
												item,
												note: "",
												actionType: "NOT_APPLICABLE"
											}),
											className: "px-2.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs font-bold flex items-center gap-1 transition-colors",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "استبعاد" : "Dismiss" })]
										})] }),
										(item.status === "RESOLVED" || item.status === "DISMISSED") && canReopen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: isBusy,
											"data-testid": `lifecycle-reopen-btn-${item.id}`,
											onClick: () => setActionDialog({
												isOpen: true,
												mode: "REOPEN",
												item,
												note: "",
												actionType: "MANUAL_REOPEN"
											}),
											className: "px-2.5 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 text-xs font-bold flex items-center gap-1 transition-colors",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "إعادة فتح" : "Reopen" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											"data-testid": `lifecycle-detail-btn-${item.id}`,
											onClick: () => handleOpenDetailDrawer(item),
											className: "px-2.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold flex items-center gap-1 transition-colors",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "التفاصيل والسجل" : "Details & History" })]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-neutral-300 leading-relaxed",
								children: isAr ? item.summaryAr : item.summaryEn
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-2.5 rounded-xl bg-neutral-950/90 border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-emerald-400",
									children: isAr ? "الإجراء المقترح: " : "Recommended Action: "
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-neutral-200",
									children: isAr ? item.recommendationAr : item.recommendationEn
								})] })
							}),
							item.evidenceJson?.metrics && item.evidenceJson.metrics.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: item.evidenceJson.metrics.slice(0, 4).map((m, mIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800/90 text-[11px] text-neutral-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-neutral-500",
										children: [m.name, ": "]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-white",
										children: m.valueFormatted
									})]
								}, mIdx))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-neutral-800/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											isAr ? "تاريخ الرصد:" : "Detected:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-neutral-300 font-mono",
												children: formatTimestamp(item.firstDetectedAt)
											})
										] }),
										item.acknowledgedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-amber-300/90",
											children: [
												"• ",
												isAr ? "اطلع عليه:" : "Acknowledged by:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.acknowledgedByName }),
												" (",
												formatTimestamp(item.acknowledgedAt),
												")"
											]
										}),
										item.resolvedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-emerald-300/90",
											children: [
												"• ",
												isAr ? "تم الحل بواسطة:" : "Resolved by:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.resolvedByName }),
												" (",
												formatTimestamp(item.resolvedAt),
												")",
												item.resolutionNote ? ` — "${item.resolutionNote}"` : ""
											]
										}),
										item.dismissedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-neutral-400",
											children: [
												"• ",
												isAr ? "استُبعد بواسطة:" : "Dismissed by:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.dismissedByName }),
												" (",
												formatTimestamp(item.dismissedAt),
												")",
												item.dismissReason ? ` — "${item.dismissReason}"` : ""
											]
										})
									]
								}), item.reopenedCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sky-400 font-mono text-[10px]",
									children: isAr ? `أُعيد فتحه ${item.reopenedCount} مرة` : `Reopened ${item.reopenedCount}×`
								})]
							})
						]
					}, item.id);
				})
			}),
			listData && listData.pagination.totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-neutral-400",
					children: isAr ? `صفحة ${listData.pagination.page} من ${listData.pagination.totalPages} (${listData.pagination.totalMatching} عنصر)` : `Page ${listData.pagination.page} of ${listData.pagination.totalPages} (${listData.pagination.totalMatching} items)`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: listData.pagination.page <= 1,
						onClick: () => setPage((p) => Math.max(1, p - 1)),
						className: "px-2.5 py-1 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 disabled:opacity-40 flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "السابق" : "Prev" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: listData.pagination.page >= listData.pagination.totalPages,
						onClick: () => setPage((p) => p + 1),
						className: "px-2.5 py-1 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 disabled:opacity-40 flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "التالي" : "Next" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-3.5 h-3.5" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
				isOpen: actionDialog.isOpen,
				onClose: () => setActionDialog((prev) => ({
					...prev,
					isOpen: false
				})),
				title: actionDialog.mode === "RESOLVE" ? isAr ? "تأكيد حل ومعالجة التوصية" : "Resolve Intelligence Item" : actionDialog.mode === "DISMISS" ? isAr ? "استبعاد التنبيه مع ذكر السبب" : "Dismiss Intelligence Item" : isAr ? "إعادة فتح العنصر للمتابعة النشطة" : "Reopen Intelligence Item",
				description: actionDialog.item ? isAr ? actionDialog.item.titleAr : actionDialog.item.titleEn : "",
				maxWidth: "md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmitActionDialog,
					className: "space-y-4",
					children: [
						actionDialog.mode === "RESOLVE" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-neutral-300 mb-1.5",
							children: isAr ? "نوع الإجراء المتخذ" : "Resolution Action Taken"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							"data-testid": "lifecycle-modal-action-type",
							value: actionDialog.actionType,
							onChange: (e) => setActionDialog((prev) => ({
								...prev,
								actionType: e.target.value
							})),
							className: "w-full min-h-[38px] px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "RESTOCK_ORDERED",
									children: isAr ? "تم إصدار أمر شراء / تزويد مخزون" : "Purchase Order / Restock Issued"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "BRANCH_TRANSFER_INITIATED",
									children: isAr ? "تم اعتماد تحويل مخزني بين الفروع" : "Inter-Branch Transfer Initiated"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "INVENTORY_AUDITED",
									children: isAr ? "تم جرد وتصحيح الرصيد المخزني" : "Physical Inventory Audited & Adjusted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "PRICE_OR_MARGIN_ADJUSTED",
									children: isAr ? "تمت مراجعة التسعير / هامش الربح" : "Pricing or Margin Policy Adjusted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "OPERATIONAL_FIX",
									children: isAr ? "معالجة تشغيلية مباشرة بالفرع" : "Direct Store Operational Fix"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-neutral-300 mb-1.5",
							children: actionDialog.mode === "RESOLVE" ? isAr ? "ملاحظات الحل والتوثيق" : "Resolution Note" : actionDialog.mode === "DISMISS" ? isAr ? "سبب الاستبعاد" : "Dismissal Reason" : isAr ? "سبب إعادة الفتح" : "Reason for Reopening"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 3,
							"data-testid": "lifecycle-modal-note-input",
							value: actionDialog.note,
							onChange: (e) => setActionDialog((prev) => ({
								...prev,
								note: e.target.value
							})),
							placeholder: actionDialog.mode === "RESOLVE" ? isAr ? "مثال: تم طلب 40 وحدة من المورد، رقم الطلب PO-104..." : "e.g., Ordered 40 units from supplier, PO-104..." : actionDialog.mode === "DISMISS" ? isAr ? "مثال: منتج موسمي متوقف حالياً بناءً على قرار الإدارة..." : "e.g., Seasonal SKU intentionally discontinued..." : isAr ? "مثال: تكرر الطلب على الصنف في الفرع..." : "e.g., Customer inquiries recurred at branch...",
							className: "w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setActionDialog((prev) => ({
									...prev,
									isOpen: false
								})),
								className: "px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold",
								children: isAr ? "إلغاء" : "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								"data-testid": "lifecycle-modal-confirm-btn",
								disabled: busyItemId !== null,
								className: `px-4 py-2 rounded-xl text-xs font-extrabold transition-colors ${actionDialog.mode === "RESOLVE" ? "bg-emerald-500 hover:bg-emerald-400 text-neutral-950" : actionDialog.mode === "DISMISS" ? "bg-amber-500 hover:bg-amber-400 text-neutral-950" : "bg-sky-500 hover:bg-sky-400 text-neutral-950"}`,
								children: actionDialog.mode === "RESOLVE" ? isAr ? "حفظ وإغلاق كمحلول" : "Confirm Resolution" : actionDialog.mode === "DISMISS" ? isAr ? "تأكيد الاستبعاد" : "Confirm Dismissal" : isAr ? "تأكيد إعادة الفتح" : "Confirm Reopen"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
				isOpen: detailState.isOpen,
				onClose: () => setDetailState((prev) => ({
					...prev,
					isOpen: false
				})),
				title: detailState.item ? isAr ? detailState.item.titleAr : detailState.item.titleEn : isAr ? "تفاصيل التوصية وسجل الأحداث" : "Intelligence Item Details & Audit History",
				description: detailState.item ? `${detailState.item.dedupeKey} • ${detailState.item.status}` : "",
				maxWidth: "2xl",
				children: detailState.item && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-testid": "lifecycle-detail-modal-body",
					className: "space-y-4 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-amber-400",
									children: isAr ? "التحليل والأدلة الرقمية" : "Analytical Evidence & Explanation"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-neutral-200 leading-relaxed",
									children: isAr ? detailState.item.explanationAr : detailState.item.explanationEn
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [isAr ? "التوصية:" : "Recommendation:", " "] }), isAr ? detailState.item.recommendationAr : detailState.item.recommendationEn]
								}),
								detailState.item.evidenceJson?.metrics && detailState.item.evidenceJson.metrics.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2",
									children: detailState.item.evidenceJson.metrics.map((m, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2 rounded-xl bg-neutral-900 border border-neutral-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-neutral-400",
											children: m.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono font-bold text-white mt-0.5",
											children: m.valueFormatted
										})]
									}, idx))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-3 gap-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl bg-neutral-950 border border-neutral-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-neutral-400",
										children: isAr ? "تاريخ الاكتشاف الأول" : "First Detected"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono font-bold text-white mt-0.5",
										children: formatTimestamp(detailState.item.firstDetectedAt)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl bg-neutral-950 border border-neutral-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-neutral-400",
										children: isAr ? "حالة المتابعة / الاطلاع" : "Acknowledgment"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-amber-300 mt-0.5",
										children: detailState.item.acknowledgedAt ? `${detailState.item.acknowledgedByName} (${formatTimestamp(detailState.item.acknowledgedAt)})` : isAr ? "لم يتم الاطلاع بعد" : "Not yet acknowledged"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl bg-neutral-950 border border-neutral-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-neutral-400",
										children: isAr ? "حالة الحل / الاستبعاد" : "Resolution / Dismissal"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-emerald-300 mt-0.5",
										children: detailState.item.resolvedAt ? `${detailState.item.resolvedByName} (${formatTimestamp(detailState.item.resolvedAt)})` : detailState.item.dismissedAt ? `${detailState.item.dismissedByName} (${formatTimestamp(detailState.item.dismissedAt)})` : isAr ? "مفتوح" : "Open"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 font-extrabold text-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-4 h-4 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "سجل التدقيق الزمني لدورة الحياة (Audit Trail)" : "Chronological Lifecycle Event History" })]
							}), detailState.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400",
								children: isAr ? "جاري تحميل السجل..." : "Loading event history..."
							}) : detailState.history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400",
								children: isAr ? "لا توجد أحداث مسجلة" : "No history events recorded"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								"data-testid": "lifecycle-detail-history-list",
								className: "space-y-2 max-h-60 overflow-y-auto pe-1",
								children: detailState.history.map((evt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "px-2 py-0.5 rounded bg-neutral-800 text-amber-300 font-mono font-bold text-[10px]",
													children: evt.eventType
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-neutral-400 font-mono text-[10px]",
													children: evt.fromStatus ? `${evt.fromStatus} → ${evt.toStatus}` : evt.toStatus
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-bold text-white",
													children: [
														evt.performedByName,
														" (",
														evt.performedByRole,
														")"
													]
												})
											]
										}), evt.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-neutral-300",
											children: evt.note
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[10px] text-neutral-400 shrink-0",
										children: formatTimestamp(evt.createdAt)
									})]
								}, evt.id))
							})]
						})
					]
				})
			})
		]
	});
};
// src/components/analytics/BusinessIntelligenceDashboard.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
function BusinessIntelligenceDashboard() {
	const { products, transactions, customers, stockMovements, users, currentUser, settings, exchangeRateHistory, unmetDemandRequests, openUnmetDemandModal } = usePOS();
	const isAr = settings.language === "ar";
	const isDark = settings.theme === "dark";
	const [activeTab, setActiveTab] = (0, import_react.useState)("overview");
	const [datePreset, setDatePreset] = (0, import_react.useState)("30d");
	const [customStartDate, setCustomStartDate] = (0, import_react.useState)("");
	const [customEndDate, setCustomEndDate] = (0, import_react.useState)("");
	const [branchId, setBranchId] = (0, import_react.useState)("all");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("all");
	const [productIdFilter, setProductIdFilter] = (0, import_react.useState)("all");
	const [customerIdFilter, setCustomerIdFilter] = (0, import_react.useState)("all");
	const [cashierFilter, setCashierFilter] = (0, import_react.useState)("all");
	const [paymentMethodFilter, setPaymentMethodFilter] = (0, import_react.useState)("all");
	const [valuationMode, setValuationMode] = (0, import_react.useState)("historical");
	const [abcBasis, setAbcBasis] = (0, import_react.useState)("revenue");
	const [leadTimeDays, setLeadTimeDays] = (0, import_react.useState)(3);
	const [safetyStockDays, setSafetyStockDays] = (0, import_react.useState)(2);
	const [forecastHorizonDays, setForecastHorizonDays] = (0, import_react.useState)(7);
	const [showDictionaryModal, setShowDictionaryModal] = (0, import_react.useState)(false);
	const [demandTrendGranularity, setDemandTrendGranularity] = (0, import_react.useState)("daily");
	const [alertCategoryFilter, setAlertCategoryFilter] = (0, import_react.useState)("ALL");
	const [alertLifecycleOverrides, setAlertLifecycleOverrides] = (0, import_react.useState)({});
	const [persistedLifecycleCounts, setPersistedLifecycleCounts] = (0, import_react.useState)(null);
	const [isMobileFiltersOpen, setIsMobileFiltersOpen] = (0, import_react.useState)(false);
	const [overviewRecommendationFilter, setOverviewRecommendationFilter] = (0, import_react.useState)("all");
	const activeUserId = currentUser?.id || users[0]?.id || "user-1";
	const syncPersistedLifecycleFromServer = (0, import_react.useCallback)(async () => {
		if (!activeUserId || activeUserId === "unassigned-operator") return;
		try {
			const res = await fetch("/api/intelligence/lifecycle?status=ALL_HISTORY&pageSize=100", { headers: { "x-user-id": activeUserId } });
			if (!res.ok) return;
			const json = await res.json();
			if (json.success && json.data) {
				if (json.data.counts) setPersistedLifecycleCounts(json.data.counts);
				if (Array.isArray(json.data.items)) {
					const map = {};
					for (const item of json.data.items) {
						const mapped = item.status === "ACKNOWLEDGED" ? "acknowledged" : item.status === "RESOLVED" ? "resolved" : item.status === "DISMISSED" ? "dismissed" : "active";
						map[item.dedupeKey] = mapped;
						map[item.id] = mapped;
					}
					setAlertLifecycleOverrides(map);
				}
			}
		} catch {}
	}, [activeUserId]);
	(0, import_react.useEffect)(() => {
		syncPersistedLifecycleFromServer();
	}, [syncPersistedLifecycleFromServer]);
	const handlePersistAlertStatusChange = async (alertId, dedupeKey, nextStatus) => {
		setAlertLifecycleOverrides((prev) => ({
			...prev,
			[alertId]: nextStatus,
			[dedupeKey]: nextStatus
		}));
		const endpoint = {
			active: "reopen",
			acknowledged: "acknowledge",
			resolved: "resolve",
			dismissed: "dismiss"
		}[nextStatus];
		try {
			await fetch(`/api/intelligence/lifecycle/${encodeURIComponent(dedupeKey || alertId)}/${endpoint}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-user-id": activeUserId
				},
				body: JSON.stringify({ note: `Updated to ${nextStatus} from BI Suite` })
			});
			await syncPersistedLifecycleFromServer();
		} catch {}
	};
	const getCategoryLabel = (cat) => {
		const map = {
			INVENTORY_RISK: {
				ar: "مخاطر المخزون والصلاحية",
				en: "Inventory & Expiry Risk"
			},
			UNMET_DEMAND: {
				ar: "طلبات عملاء غير متوفرة",
				en: "Unmet Customer Demand"
			},
			RISING_DEMAND: {
				ar: "تصاعد الطلب والمبيعات",
				en: "Rising Demand Velocity"
			},
			STOCKOUT_RISK: {
				ar: "خطر نفاد المخزون",
				en: "Stockout Risk"
			},
			REPLENISHMENT: {
				ar: "توصيات الشراء والتوريد",
				en: "Smart Replenishment"
			},
			FINANCIAL_RISK: {
				ar: "المخاطر المالية والربحية",
				en: "Financial & Margin Risk"
			},
			SALES_ANOMALY: {
				ar: "تقلبات المبيعات غير المعتادة",
				en: "Sales Volume Anomaly"
			},
			BRANCH_IMBALANCE: {
				ar: "اختلال التوزيع بين الفروع",
				en: "Branch Stock Imbalance"
			},
			SEASONAL_PATTERN: {
				ar: "الأنماط الموسمية وأيام الذروة",
				en: "Seasonal & Peak Pattern"
			},
			TRANSFER_OPPORTUNITY: {
				ar: "فرص التحويل بين الفروع",
				en: "Branch Transfer Opportunity"
			}
		};
		return isAr ? map[cat]?.ar || cat : map[cat]?.en || cat;
	};
	const getSeverityLabel = (sev) => {
		const map = {
			CRITICAL: {
				ar: "حرج جداً",
				en: "Critical"
			},
			HIGH: {
				ar: "أولوية عالية",
				en: "High Priority"
			},
			MEDIUM: {
				ar: "متوسط",
				en: "Medium"
			},
			LOW: {
				ar: "منخفض",
				en: "Low"
			},
			INFO: {
				ar: "معلومة",
				en: "Info"
			},
			critical: {
				ar: "حرج جداً",
				en: "Critical"
			},
			warning: {
				ar: "تنبيه هام",
				en: "Warning"
			},
			info: {
				ar: "توصية تحليلية",
				en: "Insight"
			}
		};
		return isAr ? map[sev]?.ar || sev : map[sev]?.en || sev;
	};
	const getLifecycleLabel = (st) => {
		const map = {
			active: {
				ar: "نشط",
				en: "Active"
			},
			acknowledged: {
				ar: "تم الاطلاع",
				en: "Acknowledged"
			},
			resolved: {
				ar: "تم الحل",
				en: "Resolved"
			},
			dismissed: {
				ar: "تجاهل",
				en: "Dismissed"
			}
		};
		return isAr ? map[st].ar : map[st].en;
	};
	const uniqueCategories = (0, import_react.useMemo)(() => Array.from(new Set(products.map((p) => p.category))).filter(Boolean), [products]);
	(0, import_react.useMemo)(() => {
		const fromTx = transactions.map((t) => t.cashierName).filter(Boolean);
		const fromUsers = users.map((u) => u.terminalName).filter(Boolean);
		return Array.from(/* @__PURE__ */ new Set([...fromTx, ...fromUsers]));
	}, [transactions, users]);
	const filters = (0, import_react.useMemo)(() => ({
		datePreset,
		startDate: datePreset === "custom" && customStartDate ? customStartDate : void 0,
		endDate: datePreset === "custom" && customEndDate ? customEndDate : void 0,
		branchId,
		category: categoryFilter,
		productId: productIdFilter,
		customerId: customerIdFilter,
		cashierName: cashierFilter,
		paymentMethod: paymentMethodFilter,
		currency: settings.currency,
		valuationMode,
		anchorCurrency: "USD",
		abcBasis,
		leadTimeDays,
		safetyStockDays,
		forecastHorizonDays,
		missingDateStrategy: "zero_fill"
	}), [
		datePreset,
		customStartDate,
		customEndDate,
		branchId,
		categoryFilter,
		productIdFilter,
		customerIdFilter,
		cashierFilter,
		paymentMethodFilter,
		settings.currency,
		valuationMode,
		abcBasis,
		leadTimeDays,
		safetyStockDays,
		forecastHorizonDays
	]);
	const { sales, financial, inventory, customers: customerAnalytics, branches: branchAnalytics, technicalIndicators, forecasts, insights, intelligence, metricsDictionary } = (0, import_react.useMemo)(() => {
		const effectiveUsers = users && users.length > 0 ? users.some((u) => u.id === currentUser?.id) ? users : currentUser ? [...users, currentUser] : users : currentUser ? [currentUser] : [];
		return computeFullAnalyticsOverview(buildAnalyticsSnapshotFromState({
			products,
			transactions,
			customers,
			stockMovements,
			users: effectiveUsers,
			exchangeRates: settings.exchangeRates,
			exchangeRateHistory,
			branches: DEFAULT_ANALYTICS_BRANCHES,
			unmetDemandRequests
		}), filters, {
			userId: currentUser?.id || users[0]?.id || "user-1",
			userName: currentUser?.name,
			role: currentUser?.role,
			assignedTerminalName: currentUser?.terminalName
		});
	}, [
		products,
		transactions,
		customers,
		stockMovements,
		users,
		settings.exchangeRates,
		exchangeRateHistory,
		unmetDemandRequests,
		filters,
		currentUser
	]);
	const unmetDemand = intelligence.unmetDemand;
	const formatNullableCurrency = (val) => {
		if (val === null || val === void 0) return isAr ? "غير مصرح / غير متاح" : "Restricted / N/A";
		return formatCurrency(val, sales.currency, settings.language);
	};
	const resetFilters = () => {
		setDatePreset("30d");
		setCustomStartDate("");
		setCustomEndDate("");
		setBranchId("all");
		setCategoryFilter("all");
		setProductIdFilter("all");
		setCustomerIdFilter("all");
		setCashierFilter("all");
		setPaymentMethodFilter("all");
		setValuationMode("historical");
	};
	const handleExportAnalyticsCsv = () => {
		const headers = [
			"Date",
			"Gross Sales",
			"Net Sales",
			"Discounts",
			"Tax",
			"COGS",
			"Gross Profit",
			"Transactions",
			"Units Sold",
			"Currency"
		];
		const rows = sales.dailySeries.map((d) => [
			d.dateKey,
			d.grossSales,
			d.netSales,
			d.discounts,
			d.tax,
			d.cogs,
			d.grossProfit,
			d.transactionCount,
			d.unitsSold,
			sales.currency
		]);
		const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `pos-bi-analytics-${sales.currency}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	const primarySections = [
		{
			id: "section-overview",
			targetTab: "overview",
			matchTabs: ["overview"],
			labelEn: "1. Business Overview",
			labelAr: "1. الملخص التنفيذي",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-3.5 h-3.5" })
		},
		{
			id: "section-sales",
			targetTab: "sales",
			matchTabs: ["sales", "products"],
			labelEn: "2. Sales",
			labelAr: "2. المبيعات",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCandlestick, { className: "w-3.5 h-3.5" })
		},
		{
			id: "section-inventory",
			targetTab: "inventory",
			matchTabs: [
				"inventory",
				"forecasts",
				"unmet_demand"
			],
			labelEn: "3. Inventory & Demand",
			labelAr: "3. المخزون والطلب",
			badge: unmetDemand.summary.totalInquiries,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "w-3.5 h-3.5" })
		},
		{
			id: "section-financial",
			targetTab: "financial",
			matchTabs: ["financial"],
			labelEn: "4. Financial Overview",
			labelAr: "4. المركز المالي",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-3.5 h-3.5" })
		},
		{
			id: "section-branches",
			targetTab: "branches",
			matchTabs: ["branches"],
			labelEn: "5. Branch Performance",
			labelAr: "5. أداء الفروع",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-3.5 h-3.5" })
		},
		{
			id: "section-intelligence",
			targetTab: "intelligence_center",
			matchTabs: [
				"intelligence_center",
				"smart_intelligence",
				"insights"
			],
			labelEn: "6. Intelligence",
			labelAr: "6. مركز الذكاء",
			badge: persistedLifecycleCounts?.active ?? intelligence.overview.totalActiveAlerts,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 text-amber-400" })
		},
		{
			id: "section-reports",
			targetTab: "technical",
			matchTabs: ["technical", "customers"],
			labelEn: "7. Indicators",
			labelAr: "7. المؤشرات الفنية",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-3.5 h-3.5" })
		}
	];
	const subTabs = [
		{
			id: "overview",
			labelEn: "Executive Overview",
			labelAr: "الملخص التنفيذي",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-3.5 h-3.5" })
		},
		{
			id: "intelligence_center",
			labelEn: `Intelligence Center (${persistedLifecycleCounts?.active ?? intelligence.overview.totalActiveAlerts})`,
			labelAr: `مركز الذكاء ودورة الحياة (${persistedLifecycleCounts?.active ?? intelligence.overview.totalActiveAlerts})`,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 text-emerald-400" })
		},
		{
			id: "unmet_demand",
			labelEn: `Customer Demand (${unmetDemand.summary.totalInquiries})`,
			labelAr: `طلبات العملاء غير المتوفرة (${unmetDemand.summary.totalInquiries})`,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageX, { className: "w-3.5 h-3.5 text-rose-400" })
		},
		{
			id: "smart_intelligence",
			labelEn: `Smart Operations & Replenishment (${intelligence.overview.totalActiveAlerts})`,
			labelAr: `الذكاء التشغيلي والتوريد (${intelligence.overview.totalActiveAlerts})`,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 text-amber-400" })
		},
		{
			id: "sales",
			labelEn: "Sales & Candlesticks",
			labelAr: "تحليل المبيعات والشموع",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCandlestick, { className: "w-3.5 h-3.5" })
		},
		{
			id: "financial",
			labelEn: "Financial & P&L",
			labelAr: "التحليل المالي والأرباح",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-3.5 h-3.5" })
		},
		{
			id: "inventory",
			labelEn: "Inventory & ABC / Reorder",
			labelAr: "المخزون وتصنيف ABC وإعادة الطلب",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "w-3.5 h-3.5" })
		},
		{
			id: "products",
			labelEn: "Products & Categories",
			labelAr: "المنتجات والفئات",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-3.5 h-3.5" })
		},
		{
			id: "customers",
			labelEn: "Customers & Credit",
			labelAr: "العملاء والائتمان",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-3.5 h-3.5" })
		},
		{
			id: "branches",
			labelEn: "Branches & Cashiers",
			labelAr: "الفروع والكاشير",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-3.5 h-3.5" })
		},
		{
			id: "technical",
			labelEn: "Technical Indicators",
			labelAr: "المؤشرات الفنية (SMA/RSI/MACD)",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-3.5 h-3.5" })
		},
		{
			id: "forecasts",
			labelEn: "Predictive Forecasting",
			labelAr: "التوقعات الإحصائية (7/30/90 يوم)",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "w-3.5 h-3.5" })
		},
		{
			id: "insights",
			labelEn: `All Recommendations (${intelligence.smartAlerts.length + intelligence.replenishmentRecommendations.length + intelligence.branchTransferOpportunities.length + insights.length})`,
			labelAr: `كل التوصيات الذكية (${intelligence.smartAlerts.length + intelligence.replenishmentRecommendations.length + intelligence.branchTransferOpportunities.length + insights.length})`,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 text-amber-400" })
		}
	];
	const selectClass = `px-3 py-2 rounded-xl text-xs font-medium border outline-none transition-colors ${isDark ? "bg-neutral-900 border-neutral-800 text-neutral-100 focus:border-amber-500" : "bg-white border-neutral-200 text-neutral-800 focus:border-amber-500"}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		"data-testid": "bi-analytics-dashboard",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-testid": "bi-primary-sections-nav",
				className: "p-2 rounded-2xl bg-neutral-900 border border-neutral-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5",
				children: primarySections.map((sec) => {
					const isSecActive = sec.matchTabs.includes(activeTab);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": `bi-primary-${sec.id}`,
						onClick: () => setActiveTab(sec.targetTab),
						className: `px-2.5 py-2 rounded-xl text-xs font-extrabold flex items-center justify-between gap-1.5 transition-all border ${isSecActive ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-sm" : "bg-neutral-950/80 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0",
								children: sec.icon
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: isAr ? sec.labelAr : sec.labelEn
							})]
						}), sec.badge !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black shrink-0 ${isSecActive ? "bg-neutral-950/20 text-neutral-950" : "bg-amber-500/15 text-amber-300 border border-amber-500/30"}`,
							children: sec.badge
						})]
					}, sec.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
				className: "p-3.5 border-amber-500/20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "w-4 h-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs font-bold uppercase tracking-wider text-amber-400",
								children: isAr ? "محرك الفلترة الشامل لذكاء الأعمال والتنبؤ الإحصائي" : "Global Business Intelligence & Forecasting Filter Bar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-neutral-400",
								children: isAr ? `العملة النشطة: ${settings.currency} • وضع التقييم: ${valuationMode === "historical" ? "سعر الصرف التاريخي وقت البيع" : valuationMode === "indexed" ? "مؤشر بالدولار (حفظ القوة الشرائية)" : "سعر الصرف الحي الحالي"}` : `Active Currency: ${settings.currency} • Valuation: ${valuationMode.toUpperCase()}`
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5 sm:gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "bi-toggle-filters-btn",
									onClick: () => setIsMobileFiltersOpen((prev) => !prev),
									className: "lg:hidden px-2.5 py-1.5 rounded-lg text-xs font-bold border border-amber-500/40 bg-amber-500/10 text-amber-300 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? isMobileFiltersOpen ? "إخفاء الفلاتر" : "إظهار الفلاتر" : isMobileFiltersOpen ? "Hide Filters" : "Filters" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "bi-open-unmet-demand-btn",
									onClick: () => openUnmetDemandModal({
										sourceScreen: "analytics",
										branchId: branchId !== "all" ? branchId : void 0,
										productId: productIdFilter !== "all" ? productIdFilter : void 0
									}),
									className: "px-2.5 py-1.5 rounded-lg text-xs font-bold border border-rose-500/40 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageX, { className: "w-3.5 h-3.5" }), isAr ? "+ تسجيل طلب غير متوفر" : "+ Record Unmet Demand"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setShowDictionaryModal(!showDictionaryModal),
									className: "px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: isAr ? "قاموس المعادلات والمؤشرات" : "Metrics Dictionary"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleExportAnalyticsCsv,
									className: "px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: isAr ? "تصدير CSV" : "Export CSV"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: resetFilters,
									className: "px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-neutral-700 bg-neutral-800/60 text-neutral-300 hover:bg-neutral-800 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: isAr ? "إعادة ضبط" : "Reset"
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `${isMobileFiltersOpen ? "grid" : "hidden lg:grid"} grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 pt-3 mt-3 border-t border-neutral-800/60`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[10px] font-semibold text-neutral-400 mb-1",
								children: isAr ? "الفترة الزمنية" : "Date Range"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: datePreset,
								onChange: (e) => setDatePreset(e.target.value),
								className: `w-full ${selectClass}`,
								"data-testid": "bi-filter-date-preset",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "today",
										children: isAr ? "اليوم" : "Today"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "yesterday",
										children: isAr ? "أمس" : "Yesterday"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "7d",
										children: isAr ? "آخر 7 أيام" : "Last 7 Days"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "30d",
										children: isAr ? "آخر 30 يوماً" : "Last 30 Days"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "90d",
										children: isAr ? "آخر 90 يوماً (MACD كامل)" : "Last 90 Days (Full MACD)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "mtd",
										children: isAr ? "منذ بداية الشهر (MTD)" : "Month to Date (MTD)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "ytd",
										children: isAr ? "منذ بداية السنة (YTD)" : "Year to Date (YTD)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "custom",
										children: isAr ? "نطاق مخصص" : "Custom Range"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[10px] font-semibold text-slate-400 mb-1",
								children: isAr ? "الفرع" : "Branch"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: branchId,
								onChange: (e) => setBranchId(e.target.value),
								className: `w-full ${selectClass}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: isAr ? "كل الفروع" : "All Branches"
								}), DEFAULT_ANALYTICS_BRANCHES.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: b.id,
									children: isAr ? b.nameAr : b.name
								}, b.id))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[10px] font-semibold text-slate-400 mb-1",
								children: isAr ? "الفئة" : "Category"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: categoryFilter,
								onChange: (e) => setCategoryFilter(e.target.value),
								className: `w-full ${selectClass}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: isAr ? "كل الفئات" : "All Categories"
								}), uniqueCategories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c,
									children: c
								}, c))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[10px] font-semibold text-slate-400 mb-1",
								children: isAr ? "المنتج" : "Product"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: productIdFilter,
								onChange: (e) => setProductIdFilter(e.target.value),
								className: `w-full ${selectClass}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: isAr ? "كل المنتجات" : "All Products"
								}), products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: p.id,
									children: [
										isAr ? p.nameAr || p.name : p.name,
										" (",
										p.sku,
										")"
									]
								}, p.id))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[10px] font-semibold text-slate-400 mb-1",
								children: isAr ? "العميل" : "Customer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: customerIdFilter,
								onChange: (e) => setCustomerIdFilter(e.target.value),
								className: `w-full ${selectClass}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: isAr ? "كل العملاء" : "All Customers"
								}), customers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.name
								}, c.id))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[10px] font-semibold text-slate-400 mb-1",
								children: isAr ? "طريقة الدفع" : "Payment Method"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: paymentMethodFilter,
								onChange: (e) => setPaymentMethodFilter(e.target.value),
								className: `w-full ${selectClass}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: isAr ? "الكل" : "All Methods"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "cash",
										children: isAr ? "نقداً (كاش)" : "Cash"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "bank_transfer",
										children: isAr ? "تحويل بنكي" : "Bank Transfer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "qr_nfc",
										children: isAr ? "محفظة رقمية" : "Digital Wallet"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[10px] font-semibold text-slate-400 mb-1",
								children: isAr ? "تقييم سعر الصرف" : "FX Valuation Mode"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: valuationMode,
								onChange: (e) => setValuationMode(e.target.value),
								className: `w-full ${selectClass}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "historical",
										children: isAr ? "سعر وقت البيع (تاريخي)" : "Historical Sale Rate"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "indexed",
										children: isAr ? "مؤشر بالدولار (استبدال)" : "USD-Indexed Replacement"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "live",
										children: isAr ? "السعر الحي الحالي" : "Current Live Rate"
									})
								]
							})] })
						]
					}),
					datePreset === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[10px] text-slate-400 mb-1",
							children: isAr ? "من تاريخ" : "Start Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: customStartDate,
							onChange: (e) => setCustomStartDate(e.target.value),
							className: `w-full ${selectClass}`
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[10px] text-slate-400 mb-1",
							children: isAr ? "إلى تاريخ" : "End Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: customEndDate,
							onChange: (e) => setCustomEndDate(e.target.value),
							className: `w-full ${selectClass}`
						})] })]
					})
				]
			}),
			showDictionaryModal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
				className: "p-4 border-sky-500/40 bg-sky-950/10 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-4 h-4" }), isAr ? "قاموس المعادلات المحاسبية والإحصائية المعتمدة" : "Approved Financial, Inventory & Statistical Metrics Dictionary"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setShowDictionaryModal(false),
						className: "text-xs text-slate-400 hover:text-white px-2 py-1 rounded",
						children: isAr ? "إغلاق ✕" : "Close ✕"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-2.5",
					children: metricsDictionary.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `p-2.5 rounded-xl border ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-bold text-amber-400",
								children: isAr ? m.nameAr : m.nameEn
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-mono text-slate-300 mt-1",
								children: isAr ? m.formulaAr : m.formulaEn
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-slate-500 mt-1",
								children: [
									isAr ? "الجداول:" : "Tables:",
									" ",
									m.sourceTables.join(", ")
								]
							})
						]
					}, m.key))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center gap-1.5 pb-1",
				children: subTabs.map((tab) => {
					const isActive = activeTab === tab.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveTab(tab.id),
						"data-testid": `bi-tab-${tab.id}`,
						className: `px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all border ${isActive ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/15" : isDark ? "bg-neutral-900/90 text-neutral-200 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/80" : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"}`,
						children: [tab.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? tab.labelAr : tab.labelEn })]
					}, tab.id);
				})
			}),
			activeTab === "intelligence_center" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntelligenceCenterView, {
				isAr,
				currentUserId: activeUserId,
				currentUserRole: currentUser?.role || "admin",
				initialBranchId: branchId,
				onLifecycleMutated: (counts) => setPersistedLifecycleCounts(counts),
				onOpenUnmetDemandModal: () => openUnmetDemandModal({
					sourceScreen: "analytics",
					branchId: branchId !== "all" ? branchId : void 0,
					productId: productIdFilter !== "all" ? productIdFilter : void 0
				})
			}),
			activeTab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs text-slate-400 mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "صافي المبيعات" : "Net Sales" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-4 h-4 text-emerald-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono tabular-nums text-emerald-400",
										children: formatCurrency(sales.summary.netSales, sales.currency, settings.language)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-400 mt-1 flex items-center gap-1",
										children: [sales.summary.periodOverPeriodGrowthPercent >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3 h-3 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "w-3 h-3 text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											sales.summary.periodOverPeriodGrowthPercent >= 0 ? "+" : "",
											sales.summary.periodOverPeriodGrowthPercent,
											"%",
											" ",
											isAr ? "مقابل الفترة السابقة" : "vs prior period"
										] })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs text-slate-400 mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [isAr ? "إجمالي الربح" : "Gross Profit", financial.profitAndLoss.isGrossProfitEstimated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "ml-1 text-[9px] text-amber-400",
											children: [
												"(",
												isAr ? "تقديري" : "Est.",
												")"
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-amber-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono tabular-nums text-amber-400",
										children: formatNullableCurrency(financial.profitAndLoss.grossProfit)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-400 mt-1",
										children: [
											isAr ? "هامش الربح الإجمالي:" : "Gross Margin:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-slate-200",
												children: financial.profitAndLoss.grossProfitMarginPercent !== null ? `${financial.profitAndLoss.grossProfitMarginPercent}%` : isAr ? "غير مصرح" : "Restricted"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs text-slate-400 mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "متوسط الفاتورة (ATV)" : "Avg Ticket (ATV)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-sky-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono tabular-nums",
										children: formatCurrency(sales.summary.averageTransactionValue, sales.currency, settings.language)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-400 mt-1",
										children: [
											sales.summary.transactionCount,
											" ",
											isAr ? "فاتورة" : "orders",
											" • UPT:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-slate-200",
												children: sales.summary.unitsPerTransaction
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs text-slate-400 mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "توقعات 7 أيام القادمة" : "7-Day Sales Forecast" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "w-4 h-4 text-fuchsia-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono tabular-nums text-fuchsia-400",
										children: formatCurrency(forecasts.revenueForecastSummary.expectedTotalNetSales, sales.currency, settings.language)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-400 mt-1",
										children: [
											"WAPE: ",
											forecasts.backtestEvaluations[0]?.wapePercent ?? 0,
											"% (",
											forecasts.selectedModel.replace(/_/g, " "),
											")"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs text-slate-400 mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "قيمة المخزون بالتكلفة" : "Inventory at Cost" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "w-4 h-4 text-indigo-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono tabular-nums",
										children: formatNullableCurrency(inventory.summary.totalInventoryValueAtCost)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-amber-400 mt-1",
										children: [
											inventory.summary.reorderActionRequiredCount,
											" ",
											isAr ? "أصناف تحتاج إعادة طلب" : "SKUs need reorder"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs text-slate-400 mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "التدفق النقدي المحصل" : "Total Cash Inflow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-4 h-4 text-emerald-400" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono tabular-nums",
										children: formatCurrency(financial.cashFlowAndWorkingCapital.totalCashInflows, sales.currency, settings.language)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-rose-400 mt-1",
										children: [
											isAr ? "ديون قائمة:" : "Open AR:",
											" ",
											formatCurrency(financial.cashFlowAndWorkingCapital.accountsReceivableOutstandingDebt, sales.currency, settings.language)
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between mb-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "text-sm font-bold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-emerald-400" }), isAr ? "الاتجاه الزمني للمبيعات والمتوسطات المتحركة (SMA 7 / EMA 7)" : "Daily Net Sales & Moving Averages (SMA 7 / EMA 7 / Trendline)"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-400",
									children: isAr ? technicalIndicators.dataSufficiencyNoteAr : technicalIndicators.dataSufficiencyNoteEn
								})] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechnicalTrendOverlayChart, {
								series: technicalIndicators.series,
								supportFloor: technicalIndicators.latestValues.supportFloor,
								resistanceCeiling: technicalIndicators.latestValues.resistanceCeiling,
								currency: sales.currency,
								language: settings.language
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "text-sm font-bold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "w-4 h-4 text-amber-400" }), isAr ? `التوقعات الإحصائية للمبيعات (${forecasts.horizonDays} أيام القادمة)` : `Statistical Revenue Forecast (${forecasts.horizonDays}-Day Horizon)`]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-400",
									children: isAr ? forecasts.selectionReasonAr : forecasts.selectionReasonEn
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-1",
									children: [
										7,
										30,
										90
									].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setForecastHorizonDays(h),
										className: `px-2 py-1 rounded text-[11px] font-bold font-mono ${forecastHorizonDays === h ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300"}`,
										children: [h, "D"]
									}, h))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatisticalForecastFanChart, {
								series: forecasts.revenueSeries,
								currency: sales.currency,
								language: settings.language
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-5 sm:p-6 space-y-5 border-neutral-800 bg-neutral-900/95",
						"data-testid": "bi-overview-recommendations-hub",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "text-base sm:text-lg font-extrabold text-white flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-5 h-5 text-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "مركز التوصيات الذكية والتنبيهات التشغيلية الشامل" : "Complete Smart Store Recommendations & Actionable Insights" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs sm:text-sm text-neutral-400",
										children: isAr ? `يعرض جميع التوصيات الفورية (${intelligence.smartAlerts.length + intelligence.replenishmentRecommendations.length + intelligence.branchTransferOpportunities.length + insights.length} توصية نشطة) تشمل المخزون، طلبات العملاء غير المتوفرة، أوامر الشراء، التحويل بين الفروع، والتحليل المالي.` : `Showing all ${intelligence.smartAlerts.length + intelligence.replenishmentRecommendations.length + intelligence.branchTransferOpportunities.length + insights.length} active recommendations across inventory, unmet customer demand, replenishment, branch transfers, and finance.`
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										{
											id: "all",
											labelAr: `كل التوصيات (${intelligence.smartAlerts.length + intelligence.replenishmentRecommendations.length + intelligence.branchTransferOpportunities.length + insights.length})`,
											labelEn: `All (${intelligence.smartAlerts.length + intelligence.replenishmentRecommendations.length + intelligence.branchTransferOpportunities.length + insights.length})`
										},
										{
											id: "smart_alerts",
											labelAr: `التنبيهات الذكية (${intelligence.smartAlerts.length})`,
											labelEn: `Smart Alerts (${intelligence.smartAlerts.length})`
										},
										{
											id: "replenishment",
											labelAr: `توصيات الشراء (${intelligence.replenishmentRecommendations.length})`,
											labelEn: `Replenishment POs (${intelligence.replenishmentRecommendations.length})`
										},
										{
											id: "transfers",
											labelAr: `تحويلات الفروع (${intelligence.branchTransferOpportunities.length})`,
											labelEn: `Branch Transfers (${intelligence.branchTransferOpportunities.length})`
										},
										{
											id: "executive",
											labelAr: `التوصيات التنفيذية (${insights.length})`,
											labelEn: `Executive Insights (${insights.length})`
										}
									].map((btn) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setOverviewRecommendationFilter(btn.id),
										className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${overviewRecommendationFilter === btn.id ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-sm" : "bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white"}`,
										children: isAr ? btn.labelAr : btn.labelEn
									}, btn.id))
								})]
							}),
							(overviewRecommendationFilter === "all" || overviewRecommendationFilter === "smart_alerts") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setAlertCategoryFilter("ALL"),
									className: `px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${alertCategoryFilter === "ALL" ? "bg-neutral-100 text-neutral-950 font-bold" : "bg-neutral-950/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800"}`,
									children: isAr ? `جميع الفئات (${intelligence.smartAlerts.length})` : `All Categories (${intelligence.smartAlerts.length})`
								}), SUPPORTED_SMART_INSIGHT_CATEGORIES.map((cat) => {
									const count = intelligence.overview.byCategory[cat] || 0;
									if (count === 0) return null;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setAlertCategoryFilter(cat),
										className: `px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${alertCategoryFilter === cat ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold" : "bg-neutral-950/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800"}`,
										children: [
											getCategoryLabel(cat),
											" (",
											count,
											")"
										]
									}, cat);
								})]
							}),
							(overviewRecommendationFilter === "all" || overviewRecommendationFilter === "smart_alerts") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-between",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
										className: "text-sm font-bold text-amber-400",
										children: isAr ? `1. التنبيهات والتوصيات التشغيلية الذكية (${intelligence.smartAlerts.filter((a) => alertCategoryFilter === "ALL" || a.category === alertCategoryFilter).length})` : `1. Smart Store Operations & Risk Recommendations (${intelligence.smartAlerts.filter((a) => alertCategoryFilter === "ALL" || a.category === alertCategoryFilter).length})`
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 lg:grid-cols-2 gap-3.5",
									children: intelligence.smartAlerts.filter((a) => alertCategoryFilter === "ALL" || a.category === alertCategoryFilter).map((alert) => {
										const status = alertLifecycleOverrides[alert.id] || alert.lifecycleStatus;
										const topEvidence = alert.evidenceMetrics[0];
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `p-4 rounded-2xl border space-y-2.5 transition-colors ${alert.severity === "CRITICAL" ? "bg-neutral-950/90 border-rose-500/40" : alert.severity === "HIGH" ? "bg-neutral-950/90 border-amber-500/40" : "bg-neutral-950/90 border-neutral-800"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-start justify-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex flex-wrap items-center gap-2 text-xs text-neutral-400",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: alert.severity === "CRITICAL" ? "font-bold text-rose-400" : alert.severity === "HIGH" ? "font-bold text-amber-400" : "font-semibold text-sky-400",
																	children: getSeverityLabel(alert.severity)
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	"aria-hidden": "true",
																	children: "·"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-neutral-300 font-medium",
																	children: getCategoryLabel(alert.category)
																})
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
															className: "text-sm sm:text-base font-bold text-white",
															children: isAr ? alert.titleAr : alert.titleEn
														})]
													}), topEvidence && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono text-xs font-bold text-amber-400",
														children: [
															topEvidence.name,
															": ",
															topEvidence.valueFormatted
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs sm:text-sm text-neutral-200 leading-relaxed",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-white",
														children: isAr ? "التشخيص: " : "Finding: "
													}), isAr ? alert.descriptionAr : alert.descriptionEn]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-neutral-400 leading-relaxed",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-neutral-300",
														children: isAr ? "السبب والدليل الرقمي: " : "Evidence & Reason: "
													}), isAr ? alert.explanationAr : alert.explanationEn]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "pt-2 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-xs sm:text-sm font-bold text-emerald-400",
														children: [isAr ? "التوصية المقترحة: " : "Recommended Action: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold text-emerald-300",
															children: isAr ? alert.recommendedActionAr : alert.recommendedActionEn
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "flex items-center gap-1 shrink-0",
														children: [
															"active",
															"acknowledged",
															"resolved",
															"dismissed"
														].map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: () => setAlertLifecycleOverrides((prev) => ({
																...prev,
																[alert.id]: st
															})),
															className: `px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${status === st ? "bg-amber-500 text-neutral-950 font-bold" : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"}`,
															children: getLifecycleLabel(st)
														}, st))
													})]
												})
											]
										}, alert.id);
									})
								})]
							}),
							(overviewRecommendationFilter === "all" || overviewRecommendationFilter === "replenishment") && intelligence.replenishmentRecommendations.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 pt-2 border-t border-neutral-800/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
										className: "text-sm font-bold text-sky-400",
										children: isAr ? `2. توصيات التوريد وأوامر الشراء الذكية (${intelligence.replenishmentRecommendations.length})` : `2. Smart Purchase Order & Replenishment Recommendations (${intelligence.replenishmentRecommendations.length})`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-neutral-400",
										children: isAr ? "تدمج المبيعات الفعلية + طلبات العملاء غير المتوفرة + زمن التوريد (تتطلب موافقة الإدارة)" : "Combines actual sales + unmet customer demand + lead time (Requires Manager Approval)"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 lg:grid-cols-2 gap-3.5",
									children: intelligence.replenishmentRecommendations.map((rec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-2.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-start justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-xs text-neutral-400",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: rec.urgency === "CRITICAL" ? "font-bold text-rose-400" : rec.urgency === "HIGH" ? "font-bold text-amber-400" : "font-semibold text-sky-400",
															children: getSeverityLabel(rec.urgency)
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "mx-1.5",
															"aria-hidden": "true",
															children: "·"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono",
															children: rec.sku
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "mx-1.5",
															"aria-hidden": "true",
															children: "·"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rec.category })
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
													className: "text-sm sm:text-base font-bold text-white mt-0.5",
													children: isAr ? rec.productNameAr || rec.productName : rec.productName
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-end font-mono",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-sm font-black text-emerald-400",
														children: isAr ? `اطلب +${rec.recommendedOrderUnits} وحدة` : `Order +${rec.recommendedOrderUnits} units`
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-xs text-neutral-400",
														children: [
															isAr ? "التكلفة التقديرية:" : "Est. Cost:",
															" ",
															formatNullableCurrency(rec.estimatedOrderCost)
														]
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-4 gap-2 p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800/80 text-xs font-mono",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[11px] text-neutral-400 font-sans",
														children: isAr ? "الرصيد الحالي" : "Stock"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-bold text-white",
														children: rec.currentStock
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[11px] text-neutral-400 font-sans",
														children: isAr ? "مبيعات/يوم" : "Sales/Day"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-bold text-sky-400",
														children: rec.observedSalesDailyVelocity
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[11px] text-neutral-400 font-sans",
														children: isAr ? "طلبات مفقودة" : "Unmet Req."
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "font-bold text-rose-400",
														children: [
															rec.observedUnmetDemandUnits,
															" (",
															rec.unmetDemandInquiriesCount,
															")"
														]
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[11px] text-neutral-400 font-sans",
														children: isAr ? "نقطة الطلب" : "Reorder Pt"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-bold text-amber-400",
														children: rec.reorderPointUnits
													})] })
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs sm:text-sm text-neutral-300 leading-relaxed",
												children: isAr ? rec.explanationAr : rec.explanationEn
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs sm:text-sm font-bold text-emerald-400 pt-1",
												children: [isAr ? "الإجراء المقترح: " : "Suggested Action: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-emerald-300",
													children: isAr ? rec.suggestedActionAr : rec.suggestedActionEn
												})]
											})
										]
									}, rec.id))
								})]
							}),
							(overviewRecommendationFilter === "all" || overviewRecommendationFilter === "transfers") && intelligence.branchTransferOpportunities.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 pt-2 border-t border-neutral-800/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "text-sm font-bold text-emerald-400",
									children: isAr ? `3. توصيات التحويل الذكي للمخزون بين الفروع (${intelligence.branchTransferOpportunities.length})` : `3. Smart Inter-Branch Stock Transfer Opportunities (${intelligence.branchTransferOpportunities.length})`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 lg:grid-cols-2 gap-3.5",
									children: intelligence.branchTransferOpportunities.map((tr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-2xl bg-neutral-950/90 border border-emerald-500/30 space-y-2.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
													className: "text-sm sm:text-base font-bold text-white",
													children: [
														isAr ? tr.productNameAr || tr.productName : tr.productName,
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-mono text-xs text-neutral-400",
															children: [
																"(",
																tr.sku,
																")"
															]
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-sm font-black text-emerald-400",
													children: isAr ? `تحويل ${tr.recommendedTransferUnits} وحدة` : `Transfer ${tr.recommendedTransferUnits} units`
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-sky-300",
														children: [
															isAr ? "من فرع الفائض:" : "From Surplus:",
															" ",
															isAr ? tr.fromBranchNameAr : tr.fromBranchName,
															" (+",
															tr.fromBranchEstimatedSurplusUnits,
															")"
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-amber-400 font-bold",
														children: "⇄"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-rose-300",
														children: [
															isAr ? "إلى فرع العجز:" : "To Shortage:",
															" ",
															isAr ? tr.toBranchNameAr : tr.toBranchName,
															" (",
															tr.toBranchShortageOrUnmetUnits,
															")"
														]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs sm:text-sm text-neutral-200 leading-relaxed",
												children: isAr ? tr.explanationAr : tr.explanationEn
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs sm:text-sm font-bold text-emerald-400",
												children: [isAr ? "التوصية: " : "Action: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-emerald-300",
													children: isAr ? tr.suggestedActionAr : tr.suggestedActionEn
												})]
											})
										]
									}, tr.id))
								})]
							}),
							(overviewRecommendationFilter === "all" || overviewRecommendationFilter === "executive") && insights.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 pt-2 border-t border-neutral-800/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "text-sm font-bold text-amber-300",
									children: isAr ? `4. التوصيات التحليلية والمالية التنفيذية (${insights.length})` : `4. Explainable Financial & Executive Business Insights (${insights.length})`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 lg:grid-cols-2 gap-3.5",
									children: insights.map((ins) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `p-4 rounded-2xl border space-y-2 ${ins.severity === "critical" ? "border-rose-500/40 bg-neutral-950/90" : ins.severity === "warning" ? "border-amber-500/40 bg-neutral-950/90" : "border-neutral-800 bg-neutral-950/90"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `text-xs font-bold ${ins.severity === "critical" ? "text-rose-400" : ins.severity === "warning" ? "text-amber-400" : "text-sky-400"}`,
													children: getSeverityLabel(ins.severity)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
													className: "text-sm sm:text-base font-bold text-white mt-0.5",
													children: isAr ? ins.titleAr : ins.titleEn
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-mono font-bold text-amber-400 shrink-0",
													children: ins.metricValueFormatted
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs sm:text-sm text-neutral-200 leading-relaxed",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-white",
													children: isAr ? "النتيجة: " : "Finding: "
												}), isAr ? ins.findingAr : ins.findingEn]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-neutral-400 leading-relaxed",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-neutral-300",
														children: isAr ? "السبب والدليل: " : "Reason & Evidence: "
													}),
													isAr ? ins.reasonAr : ins.reasonEn,
													" —",
													" ",
													isAr ? ins.supportingEvidenceAr : ins.supportingEvidenceEn
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs sm:text-sm font-bold text-emerald-400 pt-1",
												children: [isAr ? "الإجراء المقترح: " : "Recommended Action: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-emerald-300",
													children: isAr ? ins.suggestedActionAr : ins.suggestedActionEn
												})]
											})
										]
									}, ins.id))
								})]
							})
						]
					})
				]
			}),
			activeTab === "sales" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 md:grid-cols-4 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-400",
										children: isAr ? "إجمالي المبيعات (قبل الخصم)" : "Gross Sales (Pre-Discount)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono mt-1",
										children: formatCurrency(sales.summary.grossSales, sales.currency, settings.language)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-400 mt-1",
										children: [
											isAr ? "الخصومات الممنوحة:" : "Discounts:",
											" ",
											formatCurrency(sales.summary.discountsTotal, sales.currency, settings.language),
											" (",
											sales.summary.discountRatePercent,
											"%)"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-400",
										children: isAr ? "صافي المبيعات (بدون الضريبة)" : "Net Sales (Excl. Tax & Voids)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono text-emerald-400 mt-1",
										children: formatCurrency(sales.summary.netSales, sales.currency, settings.language)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-400 mt-1",
										children: [
											isAr ? "الضريبة المحصلة:" : "Tax Collected:",
											" ",
											formatCurrency(sales.summary.taxCollected, sales.currency, settings.language)
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-400",
										children: isAr ? "إجمالي الفواتير شاملة الضريبة" : "Billed Grand Total (Incl. Tax)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono text-amber-400 mt-1",
										children: formatCurrency(sales.summary.billedGrandTotal, sales.currency, settings.language)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-400 mt-1",
										children: [
											isAr ? "متوسط الفاتورة الإجمالي:" : "Avg Billed Ticket:",
											" ",
											formatCurrency(sales.summary.averageBilledTicket, sales.currency, settings.language)
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-400",
										children: isAr ? "المرتجعات والفواتير الملغاة" : "Returns & Voided Invoices"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono text-rose-400 mt-1",
										children: formatCurrency(sales.summary.returnedOrVoidedSales, sales.currency, settings.language)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-400 mt-1",
										children: [
											sales.summary.returnedOrVoidedCount,
											" ",
											isAr ? "فاتورة ملغاة/مرتجعة" : "voided/returned orders"
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-sm font-bold mb-1 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCandlestick, { className: "w-4 h-4 text-amber-400" }), isAr ? "مخطط الشموع اليابانية للمبيعات اليومية بالساعة (Intraday Hourly Sales OHLC)" : "Retail Intraday Hourly Sales Candlesticks (Open / High / Low / Close + Daily Total)"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-400 mb-3",
								children: isAr ? "الافتتاح (O) = مبيعات أول ساعة عمل نشطة • الأعلى (H) = ذروة مبيعات الساعة • الأدنى (L) = أقل ساعة نشطة • الإغلاق (C) = آخر ساعة عمل نشطة" : "Open = First active hour net sales • High = Peak hourly sales • Low = Lowest active hour • Close = Last active hour net sales"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntradayCandlestickChart, {
								candles: sales.intradayCandlesticks,
								currency: sales.currency,
								language: settings.language
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 text-sky-400" }), isAr ? "توزيع المبيعات حسب ساعات اليوم" : "Sales by Hour of Day"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1.5 max-h-60 overflow-y-auto pr-1",
								children: sales.hourlyDistribution.filter((h) => h.transactionCount > 0).map((h) => {
									const maxHrNet = Math.max(1, ...sales.hourlyDistribution.map((x) => x.netSales));
									const pct = Math.round(h.netSales / maxHrNet * 100);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between font-mono",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												h.label,
												" (",
												h.transactionCount,
												" ",
												isAr ? "طلب" : "orders",
												")"
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-emerald-400",
												children: formatCurrency(h.netSales, sales.currency, settings.language)
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-1.5 rounded-full bg-slate-800 overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full bg-sky-500 rounded-full",
												style: { width: `${pct}%` }
											})
										})]
									}, h.hour);
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3.5 h-3.5 text-amber-400" }), isAr ? "توزيع المبيعات حسب أيام الأسبوع" : "Sales by Day of Week"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: sales.weekdayDistribution.map((w) => {
									const maxDayNet = Math.max(1, ...sales.weekdayDistribution.map((x) => x.netSales));
									const pct = Math.round(w.netSales / maxDayNet * 100);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold",
												children: [
													isAr ? w.labelAr : w.labelEn,
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-slate-400 font-mono",
														children: [
															"(",
															w.transactionCount,
															")"
														]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-bold text-amber-400",
												children: formatCurrency(w.netSales, sales.currency, settings.language)
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-1.5 rounded-full bg-slate-800 overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full bg-amber-500 rounded-full",
												style: { width: `${pct}%` }
											})
										})]
									}, w.dayOfWeek);
								})
							})]
						})]
					})
				]
			}),
			activeTab === "financial" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-sm font-bold mb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-4 h-4 text-emerald-400" }), isAr ? "قائمة الدخل والأرباح والخسائر (P&L Statement)" : "Income Statement (Profit & Loss Reconciliation)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1.5 border-b border-slate-800/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400",
										children: isAr ? "إجمالي المبيعات (قبل الخصم والضريبة)" : "Gross Sales (Pre-Discount)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold",
										children: formatCurrency(financial.profitAndLoss.grossSalesPreDiscount, sales.currency, settings.language)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1.5 border-b border-slate-800/60 text-amber-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "(-) الخصومات الممنوحة" : "(-) Sales Discounts" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono",
										children: ["-", formatCurrency(financial.profitAndLoss.salesDiscounts, sales.currency, settings.language)]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1.5 border-b border-slate-800/60 text-rose-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "(-) مرتجعات المبيعات الفعلية" : "(-) Merchandise Returns (Deducted)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono",
										children: ["-", formatCurrency(financial.profitAndLoss.merchandiseReturnsNet, sales.currency, settings.language)]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1.5 border-b border-slate-800/60 font-bold text-emerald-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "(=) صافي إيرادات المبيعات" : "(=) Net Sales Revenue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: formatCurrency(financial.profitAndLoss.netSalesRevenue, sales.currency, settings.language)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1.5 border-b border-slate-800/60 text-rose-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [isAr ? "(-) تكلفة البضاعة المباعة (COGS)" : "(-) Cost of Goods Sold (COGS)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-1.5 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[9px] text-amber-300 font-mono",
										children: financial.profitAndLoss.cogsDataQuality.replace(/_/g, " ")
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: financial.profitAndLoss.costOfGoodsSold !== null ? `-${formatNullableCurrency(financial.profitAndLoss.costOfGoodsSold)}` : formatNullableCurrency(null)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-2 border-b border-slate-800 font-bold text-amber-300 bg-amber-500/5 px-2 rounded",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										isAr ? "(=) مجمل الربح (Gross Profit)" : "(=) Gross Profit",
										" (",
										financial.profitAndLoss.grossProfitMarginPercent !== null ? `${financial.profitAndLoss.grossProfitMarginPercent}%` : "—",
										")"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: formatNullableCurrency(financial.profitAndLoss.grossProfit)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1.5 border-b border-slate-800/60 text-rose-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "(-) مصروفات التلف والفاقد المسجلة" : "(-) Recorded Inventory Shrinkage / Damage" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: financial.profitAndLoss.recordedShrinkageAndDamageExpense !== null ? `-${formatNullableCurrency(financial.profitAndLoss.recordedShrinkageAndDamageExpense)}` : formatNullableCurrency(null)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-2 border-b border-slate-800 font-bold text-emerald-300 bg-emerald-500/5 px-2 rounded",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										isAr ? "(=) الربح بعد الفاقد المسجل" : "(=) Profit After Recorded Shrinkage",
										" ",
										"(",
										financial.profitAndLoss.profitAfterShrinkageMarginPercent !== null ? `${financial.profitAndLoss.profitAfterShrinkageMarginPercent}%` : "—",
										")"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: formatNullableCurrency(financial.profitAndLoss.profitAfterRecordedShrinkage)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-3.5 h-3.5 inline-block mr-1 text-sky-400" }), isAr ? financial.profitAndLoss.generalOperatingExpensesNoteAr : financial.profitAndLoss.generalOperatingExpensesNoteEn]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-2.5 px-2.5 rounded-lg bg-slate-900/90 border border-slate-800 font-bold text-slate-300 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "(=) صافي الربح التشغيلي (يتطلب مصروفات تشغيلية)" : "(=) Net Operating Profit (Requires Operating Expenses)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-amber-400",
										children: financial.profitAndLoss.netOperatingProfit !== null ? formatNullableCurrency(financial.profitAndLoss.netOperatingProfit) : isAr ? "غير متاح (المصروفات غير مسجلة)" : "Unavailable (Missing OpEx)"
									})]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
							className: "p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "text-sm font-bold mb-3 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-4 h-4 text-sky-400" }), isAr ? "التدفقات النقدية ورأس المال العامل ونقطة التعادل" : "Cash Flow, Working Capital & Break-Even Analysis"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2.5 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 rounded-lg bg-slate-900/60 border border-slate-800",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-slate-400",
												children: isAr ? "مقبوضات نقدية عند البيع" : "Checkout Cash Inflows"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-mono font-bold text-emerald-400 mt-0.5",
												children: formatCurrency(financial.cashFlowAndWorkingCapital.cashInflowsFromSalesAtCheckout, sales.currency, settings.language)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 rounded-lg bg-slate-900/60 border border-slate-800",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-slate-400",
												children: isAr ? "تحصيل دفعات الديون" : "Debt Settlement Inflows"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-mono font-bold text-sky-400 mt-0.5",
												children: formatCurrency(financial.cashFlowAndWorkingCapital.cashInflowsFromDebtSettlements, sales.currency, settings.language)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 rounded-lg bg-slate-900/60 border border-slate-800",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-slate-400",
												children: isAr ? "مدفوعات توريد البضاعة" : "Restock Purchase Outflows"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-mono font-bold text-rose-400 mt-0.5",
												children: formatNullableCurrency(financial.cashFlowAndWorkingCapital.cashOutflowsForRestockPurchases)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2.5 rounded-lg bg-slate-900/60 border border-slate-800",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-slate-400",
												children: isAr ? "صافي التدفق النقدي" : "Net Cash Flow"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-mono font-bold text-amber-400 mt-0.5",
												children: formatNullableCurrency(financial.cashFlowAndWorkingCapital.netCashFlow)
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2.5 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-slate-400",
										children: isAr ? "تحليل نقطة التعادل المحاسبية (Break-Even):" : "Accounting Break-Even Status:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-amber-300",
										children: financial.breakEvenAnalysis.breakEvenSalesRevenue !== null ? formatNullableCurrency(financial.breakEvenAnalysis.breakEvenSalesRevenue) : isAr ? "غير متاح (يتطلب التكاليف التشغيلية الثابتة)" : "Unavailable (Requires Fixed Operating Costs)"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-sm font-bold mb-2 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 text-amber-400" }), isAr ? "تحليل حساسية سعر الصرف وحفظ القوة الشرائية" : "Multi-Currency FX Valuation & Purchasing Power Analysis"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-lg bg-slate-900/60 border border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-slate-400",
											children: isAr ? "بسعر وقت البيع (تاريخي)" : "At Sale-Time Rate"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono font-bold mt-1",
											children: formatCurrency(financial.fxSensitivityAndValuation.netSalesAtHistoricalRate, sales.currency, settings.language)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-lg bg-slate-900/60 border border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-slate-400",
											children: isAr ? "مؤشر بالدولار (استبدال)" : "USD-Indexed Value"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono font-bold text-amber-400 mt-1",
											children: formatCurrency(financial.fxSensitivityAndValuation.netSalesAtUsdIndexedRate, sales.currency, settings.language)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-lg bg-slate-900/60 border border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-slate-400",
											children: isAr ? "فارق ترجمة العملة" : "FX Translation Delta"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono font-bold text-sky-400 mt-1",
											children: formatCurrency(financial.fxSensitivityAndValuation.unrealizedFxTranslationDelta, sales.currency, settings.language)
										})]
									})
								]
							})]
						})]
					})]
				})
			}),
			activeTab === "inventory" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-3.5 flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[10px] text-slate-400 mb-1",
									children: isAr ? "أساس تصنيف ABC باريتو" : "ABC Classification Basis"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: abcBasis,
									onChange: (e) => setAbcBasis(e.target.value),
									className: selectClass,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "revenue",
											children: isAr ? "صافي الإيرادات" : "Net Revenue"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "gross_profit",
											children: isAr ? "مجمل الربح" : "Gross Profit"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "consumption_value",
											children: isAr ? "قيمة الاستهلاك (COGS)" : "Consumption Value (COGS)"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[10px] text-slate-400 mb-1",
									children: isAr ? "زمن التوريد المفترض (أيام)" : "Supplier Lead Time (Days)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 1,
									max: 60,
									value: leadTimeDays,
									onChange: (e) => setLeadTimeDays(Math.max(1, Number(e.target.value) || 3)),
									className: `w-20 font-mono ${selectClass}`
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-[10px] text-slate-400 mb-1",
									children: isAr ? "أيام مخزون الأمان" : "Safety Stock (Days)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 1,
									max: 30,
									value: safetyStockDays,
									onChange: (e) => setSafetyStockDays(Math.max(1, Number(e.target.value) || 2)),
									className: `w-20 font-mono ${selectClass}`
								})] })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold",
									children: [
										"A: ",
										inventory.abcSummary.classA.count,
										" SKUs (",
										inventory.abcSummary.classA.valueSharePercent,
										"%)"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold",
									children: [
										"B: ",
										inventory.abcSummary.classB.count,
										" SKUs (",
										inventory.abcSummary.classB.valueSharePercent,
										"%)"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-bold",
									children: [
										"C: ",
										inventory.abcSummary.classC.count,
										" SKUs (",
										inventory.abcSummary.classC.valueSharePercent,
										"%)"
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-sm font-bold mb-2",
							children: isAr ? "منحنى باريتو لتصنيف المخزون (ABC Pareto Analysis)" : "ABC Pareto Cumulative Value Distribution"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AbcParetoChart, {
							products: inventory.products,
							language: settings.language
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4 overflow-x-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-sm font-bold mb-3",
							children: isAr ? "جدول دوران المخزون وتوصيات إعادة الطلب (خاضع لاعتماد الإدارة)" : "SKU Stock Turnover, Days on Hand (DOH) & Reorder Recommendations"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-xs text-left border-collapse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-slate-800 text-slate-400 text-[11px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "المنتج" : "Product"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: "ABC"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الرصيد" : "Stock"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "السحب/يوم" : "Daily Demand"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: "DOH"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "السرعة" : "Velocity"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "نقطة الطلب" : "Reorder Pt"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الكمية المقترحة" : "Rec. Order"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "التكلفة التقديرية" : "Est. Cost"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-slate-800/60 font-mono",
								children: inventory.products.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-slate-800/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2 px-2 font-sans font-semibold",
											children: [isAr ? item.nameAr || item.name : item.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-slate-400 font-mono",
												children: item.sku
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `px-2 py-0.5 rounded font-bold text-[10px] ${item.abcClass === "A" ? "bg-emerald-500/20 text-emerald-400" : item.abcClass === "B" ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 text-slate-300"}`,
												children: item.abcClass
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2 px-2 font-bold",
											children: [
												item.currentStock,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] text-slate-500",
													children: [
														"(min ",
														item.minStockAlert,
														")"
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2 px-2",
											children: [item.averageDailyDemand, "/d"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2",
											children: item.daysOfInventoryOnHand !== null ? `${item.daysOfInventoryOnHand}d` : "∞"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2 font-sans text-[11px]",
											children: item.movementVelocityClass.replace("_", " ")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2",
											children: item.reorderRecommendation.reorderPointUnits
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2",
											children: item.reorderRecommendation.shouldReorder ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-amber-400 font-bold",
												children: ["+", item.reorderRecommendation.recommendedOrderQuantity]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-500",
												children: "0"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2",
											children: item.reorderRecommendation.shouldReorder ? formatNullableCurrency(item.reorderRecommendation.estimatedOrderCost) : "—"
										})
									]
								}, item.productId))
							})]
						})]
					})
				]
			}),
			activeTab === "products" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
					className: "p-4 lg:col-span-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-sm font-bold mb-3",
						children: isAr ? "ربحية الفئات (Categories)" : "Category Profitability Breakdown"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2.5",
						children: sales.byCategory.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? cat.nameAr || cat.name : cat.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-emerald-400",
									children: formatCurrency(cat.netSales, sales.currency, settings.language)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-[11px] text-slate-400 font-mono",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									cat.unitsSold,
									" ",
									isAr ? "وحدة" : "units",
									" (",
									cat.shareOfNetSalesPercent,
									"%)"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									isAr ? "الربح:" : "Profit:",
									" ",
									formatNullableCurrency(cat.grossProfit),
									" (",
									cat.grossMarginPercent ?? "—",
									"%)"
								] })]
							})]
						}, cat.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
					className: "p-4 lg:col-span-2 overflow-x-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-sm font-bold mb-3",
						children: isAr ? "أداء وربحية المنتجات التفصيلية" : "Product Performance & Margin Matrix"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-xs text-left border-collapse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-slate-800 text-slate-400",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2",
									children: isAr ? "المنتج" : "Product"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2",
									children: isAr ? "الوحدات" : "Units"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2",
									children: isAr ? "صافي المبيعات" : "Net Sales"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2",
									children: "COGS"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2",
									children: isAr ? "مجمل الربح" : "Gross Profit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2",
									children: isAr ? "الهامش %" : "Margin %"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2",
									children: isAr ? "الحصة %" : "Share %"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-slate-800/60 font-mono",
							children: sales.byProduct.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 px-2 font-sans font-semibold",
									children: isAr ? p.nameAr || p.name : p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 px-2",
									children: p.unitsSold
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 px-2 text-emerald-400 font-bold",
									children: formatCurrency(p.netSales, sales.currency, settings.language)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 px-2 text-rose-300",
									children: formatNullableCurrency(p.cogs)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 px-2 text-amber-400 font-bold",
									children: formatNullableCurrency(p.grossProfit)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 px-2",
									children: p.grossMarginPercent !== null ? `${p.grossMarginPercent}%` : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-2 px-2",
									children: [p.shareOfNetSalesPercent, "%"]
								})
							] }, p.id))
						})]
					})]
				})]
			}),
			activeTab === "customers" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-4 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
							className: "p-3.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-slate-400",
									children: isAr ? "معدل تكرار الشراء" : "Repeat Purchase Rate"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-lg font-black font-mono text-emerald-400 mt-1",
									children: [customerAnalytics.summary.repeatPurchaseRatePercent, "%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-slate-400 mt-1",
									children: [
										customerAnalytics.summary.repeatCustomersCount,
										" /",
										" ",
										customerAnalytics.summary.totalRegisteredCustomers,
										" ",
										isAr ? "عملاء مسجلين" : "registered"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
							className: "p-3.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-slate-400",
									children: isAr ? "حصة مبيعات العملاء المسجلين" : "Registered Customer Share"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-lg font-black font-mono text-sky-400 mt-1",
									children: [customerAnalytics.summary.registeredRevenueSharePercent, "%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-slate-400 mt-1",
									children: [
										customerAnalytics.summary.walkInTransactionsCount,
										" ",
										isAr ? "فاتورة عميل عابر" : "walk-in orders"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
							className: "p-3.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-slate-400",
									children: isAr ? "إجمالي مديونيات العملاء" : "Total Customer Debt (AR)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-lg font-black font-mono text-rose-400 mt-1",
									children: formatCurrency(customerAnalytics.summary.totalCustomerDebt, sales.currency, settings.language)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-slate-400 mt-1",
									children: [
										customerAnalytics.summary.customersWithDebtCount,
										" ",
										isAr ? "عملاء بذمم مفتوحة" : "customers with open debt"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
							className: "p-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-slate-400",
								children: isAr ? "متوسط إنفاق العميل النشط" : "Avg Active Customer Spend"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg font-black font-mono text-amber-400 mt-1",
								children: formatCurrency(customerAnalytics.summary.averageCustomerSpend, sales.currency, settings.language)
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
					className: "p-4 overflow-x-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-sm font-bold mb-3",
						children: isAr ? "تصنيف العملاء والمديونيات (RFM & Credit Segmentation)" : "Customer Segmentation, Spend & Credit Exposure"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-xs text-left border-collapse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-slate-800 text-slate-400",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2",
									children: isAr ? "العميل" : "Customer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2",
									children: isAr ? "التصنيف" : "Segment"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2",
									children: isAr ? "طلبات الفترة" : "Period Orders"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2",
									children: isAr ? "مشتريات الفترة" : "Period Spend"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2",
									children: isAr ? "إجمالي المشتريات" : "Lifetime Spend"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2",
									children: isAr ? "المديونية القائمة" : "Open Debt"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-slate-800/60 font-mono",
							children: customerAnalytics.topCustomers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-2 px-2 font-sans font-semibold",
									children: [c.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-slate-400 font-mono",
										children: c.phone
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 px-2 font-sans",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-[11px] font-semibold",
										children: isAr ? c.segmentLabelAr : c.segmentLabelEn
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 px-2",
									children: c.periodPurchaseCount
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 px-2 text-emerald-400 font-bold",
									children: formatCurrency(c.periodBilledTotal, sales.currency, settings.language)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 px-2",
									children: formatCurrency(c.lifetimeSpend, sales.currency, settings.language)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 px-2 text-rose-400 font-bold",
									children: c.outstandingDebt > 0 ? formatCurrency(c.outstandingDebt, sales.currency, settings.language) : "0.00"
								})
							] }, c.customerId))
						})]
					})]
				})]
			}),
			activeTab === "branches" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "text-sm font-bold mb-3 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-4 h-4 text-amber-400" }), isAr ? "مقارنة أداء الفروع" : "Multi-Branch Performance Ranking"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: branchAnalytics.branches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-sm",
									children: [
										"#",
										b.rank,
										" ",
										isAr ? b.branchNameAr : b.branchName,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] font-mono text-slate-400",
											children: [
												"(",
												b.branchCode,
												")"
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-black text-emerald-400",
									children: formatCurrency(b.netSales, sales.currency, settings.language)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2 font-mono text-[11px] text-slate-300",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										isAr ? "الربح:" : "Profit:",
										" ",
										formatNullableCurrency(b.grossProfit),
										" (",
										b.grossMarginPercent ?? "—",
										"%)"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										isAr ? "الفواتير:" : "Orders:",
										" ",
										b.transactionCount
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										isAr ? "التحصيل:" : "Collection:",
										" ",
										b.collectionRatePercent,
										"%"
									] })
								]
							})]
						}, b.branchId))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "text-sm font-bold mb-3 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-4 h-4 text-emerald-400" }), isAr ? "أداء الكاشير ونقاط البيع" : "Employee & POS Terminal Performance"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2.5",
						children: sales.byEmployee.map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold",
								children: isAr ? emp.nameAr || emp.name : emp.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-slate-400 font-mono",
								children: [
									emp.transactionCount,
									" ",
									isAr ? "فاتورة" : "orders",
									" • ",
									emp.unitsSold,
									" ",
									isAr ? "وحدة" : "units"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right font-mono",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-emerald-400",
									children: formatCurrency(emp.netSales, sales.currency, settings.language)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-amber-400",
									children: [
										isAr ? "الربح:" : "Profit:",
										" ",
										formatNullableCurrency(emp.grossProfit)
									]
								})]
							})]
						}, emp.id))
					})]
				})]
			}),
			activeTab === "technical" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-sm font-bold mb-2",
						children: isAr ? "المؤشرات الفنية للسلسلة الزمنية للمبيعات (SMA / EMA / Trendline / Support & Resistance)" : "Retail Time-Series Technical Analysis (SMA / EMA / Regression Trend / Support & Resistance)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechnicalTrendOverlayChart, {
						series: technicalIndicators.series,
						supportFloor: technicalIndicators.latestValues.supportFloor,
						resistanceCeiling: technicalIndicators.latestValues.resistanceCeiling,
						currency: sales.currency,
						language: settings.language
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-3",
					children: technicalIndicators.signals.map((sig) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-3.5 space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-amber-400",
									children: isAr ? sig.nameAr : sig.nameEn
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200",
									children: sig.status.replace(/_/g, " ").toUpperCase()
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-300 leading-relaxed",
								children: isAr ? sig.interpretationAr : sig.interpretationEn
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/50 flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sig.referenceThreshold }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									isAr ? "نقاط البيانات:" : "Points:",
									" ",
									sig.dataPointsUsed,
									" /",
									" ",
									sig.minimumPointsRequired
								] })]
							})
						]
					}, sig.indicator))
				})]
			}),
			activeTab === "forecasts" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-sm font-bold",
								children: isAr ? `محرك التنبؤ الإحصائي واختبار الدقة العكسي (${forecasts.horizonDays} يوم)` : `Statistical Forecasting Engine & Backtest Evaluation (${forecasts.horizonDays}-Day Horizon)`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-400",
								children: isAr ? forecasts.selectionReasonAr : forecasts.selectionReasonEn
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1.5",
								children: [
									7,
									30,
									90
								].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setForecastHorizonDays(h),
									"data-testid": `bi-forecast-horizon-${h}`,
									className: `px-3 py-1.5 rounded-lg text-xs font-bold font-mono ${forecastHorizonDays === h ? "bg-amber-500 text-slate-950" : "bg-slate-900 border border-slate-800 text-slate-300"}`,
									children: [
										h,
										" ",
										isAr ? "يوم" : "Days"
									]
								}, h))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatisticalForecastFanChart, {
							series: forecasts.revenueSeries,
							currency: sales.currency,
							language: settings.language
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5",
							children: isAr ? "نتائج الاختبار العكسي الزمني للنماذج الإحصائية (Chronological Train/Test Backtesting)" : "Chronological Out-of-Sample Backtest Leaderboard (MAE & WAPE %)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-5 gap-2.5",
							children: forecasts.backtestEvaluations.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `p-3 rounded-xl border text-xs ${ev.isSelectedWinner ? "border-emerald-500/50 bg-emerald-500/10" : "border-slate-800 bg-slate-900/60"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold",
											children: isAr ? ev.modelNameAr : ev.modelNameEn
										}), ev.isSelectedWinner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-400 shrink-0" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-mono text-[11px] text-slate-300 mt-1",
										children: [
											"WAPE: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
												className: "text-amber-300",
												children: [ev.wapePercent, "%"]
											}),
											" • MAE:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: ev.mae })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-mono text-[10px] text-slate-400 mt-0.5",
										children: [
											"Bias: ",
											ev.biasPercent > 0 ? `+${ev.biasPercent}%` : `${ev.biasPercent}%`,
											" • Cov80: ",
											ev.empiricalCoverage80Percent ?? 100,
											"%"
										]
									})
								]
							}, ev.model))
						})]
					}),
					forecasts.predictiveDemandComparison && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4 border-amber-500/30 bg-amber-950/10 space-y-2.5",
						"data-testid": "bi-predictive-demand-comparison",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4" }), isAr ? "مقارنة التنبؤ القياسي (المبيعات فقط) مقابل التنبؤ المعدل بالطلب الكامن (مع تعويض نفاد المخزون)" : "Baseline Sales-Only vs. Stockout-Compensated Latent Demand Forecast Comparison"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400",
									children: [
										isAr ? "أصناف تم تعويض نفادها:" : "Censoring-Compensated SKUs:",
										" ",
										forecasts.predictiveDemandComparison.censoringCompensatedProductsCount
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-300",
								children: isAr ? forecasts.predictiveDemandComparison.comparisonNoteAr : forecasts.predictiveDemandComparison.comparisonNoteEn
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 md:grid-cols-6 gap-2 text-xs font-mono pt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-lg bg-slate-900/70 border border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-slate-400 font-sans",
											children: isAr ? "خطأ WAPE (مبيعات فقط)" : "Baseline Sales WAPE"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-bold text-slate-300 mt-0.5",
											children: [forecasts.predictiveDemandComparison.baselineSalesOnlyWapePercent, "%"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-lg bg-slate-900/70 border border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-slate-400 font-sans",
											children: isAr ? "خطأ WAPE (الطلب الكامن)" : "Latent-Adjusted WAPE"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-bold text-emerald-400 mt-0.5",
											children: [forecasts.predictiveDemandComparison.latentDemandAdjustedWapePercent, "%"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-lg bg-slate-900/70 border border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-slate-400 font-sans",
											children: isAr ? "متوسط الخطأ MAE (قياسي)" : "Baseline Sales MAE"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold text-slate-200 mt-0.5",
											children: forecasts.predictiveDemandComparison.baselineSalesOnlyMae
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-lg bg-slate-900/70 border border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-slate-400 font-sans",
											children: isAr ? "متوسط الخطأ MAE (كامن)" : "Latent-Adjusted MAE"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold text-amber-400 mt-0.5",
											children: forecasts.predictiveDemandComparison.latentDemandAdjustedMae
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-lg bg-slate-900/70 border border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-slate-400 font-sans",
											children: isAr ? "إشارات الطلب غير المتوفر" : "Unmet Demand Signals"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold text-rose-400 mt-0.5",
											children: forecasts.predictiveDemandComparison.unmetDemandSignalsCount
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-lg bg-slate-900/70 border border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-slate-400 font-sans",
											children: isAr ? "تحسن دقة التنبؤ" : "Accuracy Improved"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold text-emerald-400 mt-0.5",
											children: forecasts.predictiveDemandComparison.improvementDemonstrated ? isAr ? "محقق (نعم)" : "VERIFIED (YES)" : isAr ? "متساوٍ" : "NEUTRAL"
										})]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4 overflow-x-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-sm font-bold mb-3",
							children: isAr ? `توقعات الطلب الفعلي والكامن ونفاد المخزون على مستوى الصنف (${forecasts.horizonDays} يوم)` : `Product-Level Sales vs. Latent Demand & Stock Depletion Forecast (${forecasts.horizonDays} Days)`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-xs text-left border-collapse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-slate-800 text-slate-400",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "المنتج" : "Product"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الرصيد الحالي" : "Current Stock"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "توقع المبيعات" : "Sales Forecast"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "طلبات غير متوفرة" : "Unmet Units"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الطلب الكامن المتوقع" : "Latent Forecast"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الإيراد المتوقع" : "Forecast Revenue"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "تاريخ النفاد المتوقع" : "Est. Depletion Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "كمية الشراء المقترحة" : "Suggested Reorder"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-slate-800/60 font-mono",
								children: forecasts.productDemandForecasts.map((pf) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2 px-2 font-sans font-semibold",
										children: [isAr ? pf.nameAr || pf.name : pf.name, pf.stockoutDaysObservedInWindow && pf.stockoutDaysObservedInWindow > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-1.5 px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 text-[10px] font-mono",
											children: isAr ? `${pf.stockoutDaysObservedInWindow} يوم نفاد` : `${pf.stockoutDaysObservedInWindow}d stockout`
										}) : null]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2",
										children: pf.currentStock
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2 px-2 text-sky-400",
										children: [
											pf.forecastedTotalUnits,
											" (",
											pf.forecastedDailyDemand,
											"/d)"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2 text-rose-400",
										children: pf.observedUnmetDemandUnits || 0
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2 px-2 text-amber-400 font-bold",
										children: [
											pf.forecastedLatentTotalUnits ?? pf.forecastedTotalUnits,
											" (",
											pf.estimatedLatentDailyDemand ?? pf.forecastedDailyDemand,
											"/d)"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2 text-emerald-400",
										children: formatCurrency(pf.forecastedRevenue, sales.currency, settings.language)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2",
										children: pf.estimatedDepletionDate ? `${pf.estimatedDepletionDate} (${pf.estimatedDaysUntilDepletion}d)` : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2 font-bold text-sky-400",
										children: pf.recommendedReorderUnits > 0 ? `+${pf.recommendedReorderUnits}` : "0"
									})
								] }, pf.productId))
							})]
						})]
					})
				]
			}),
			activeTab === "unmet_demand" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				"data-testid": "bi-unmet-demand-view",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4 border-rose-500/30 bg-rose-950/10 flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageX, { className: "w-5 h-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-bold text-white",
								children: isAr ? "ذكاء طلبات العملاء غير المتوفرة وتحليل المبيعات المفقودة التحفظي" : "Customer Demand Intelligence (Unmet Demand & Conservative Lost Sales Analytics)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-400",
								children: isAr ? "يتتبع المنتجات التي يطلبها العملاء عند نفاد المخزون أو انتهاء الصلاحية أو عدم توفر الصنف بالمتجر — منفصل تماماً عن المبيعات الفعلية." : "Tracks products requested by customers when out of stock, expired, or unregistered — strictly separated from completed sales."
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "unmet-tab-record-btn",
							onClick: () => openUnmetDemandModal({
								sourceScreen: "analytics",
								branchId: branchId !== "all" ? branchId : void 0
							}),
							className: "px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), isAr ? "تسجيل طلب عميل غير متوفر" : "Record Unmet Customer Request"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-400",
										children: isAr ? "إجمالي استفسارات الطلب" : "Total Inquiries"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono text-rose-400 mt-1",
										"data-testid": "unmet-kpi-total-inquiries",
										children: unmetDemand.summary.totalInquiries
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-400 mt-1",
										children: [
											unmetDemand.summary.distinctProductsRequested,
											" ",
											isAr ? "منتجات مختلفة مطلوبة" : "distinct items requested"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-400",
										children: isAr ? "إجمالي الوحدات المطلوبة" : "Requested Base Units"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono text-amber-400 mt-1",
										"data-testid": "unmet-kpi-requested-units",
										children: unmetDemand.summary.totalRequestedBaseUnits
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-400 mt-1",
										children: [
											unmetDemand.summary.confirmedIntentBaseUnits,
											" ",
											isAr ? "وحدة بنية شراء مؤكدة" : "units with confirmed intent"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-400",
										children: isAr ? "الإيراد المفقود التقديري (تحفظي)" : "Conservative Est. Lost Revenue"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono text-rose-300 mt-1",
										"data-testid": "unmet-kpi-lost-revenue",
										children: unmetDemand.lostSalesEstimation.status === "ESTIMATED" && unmetDemand.lostSalesEstimation.estimatedLostRevenue !== null ? formatCurrency(unmetDemand.lostSalesEstimation.estimatedLostRevenue, sales.currency, settings.language) : isAr ? "بيانات تسعير غير كافية" : "INSUFFICIENT_DATA"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-400 mt-1",
										children: [
											isAr ? "درجة الثقة:" : "Confidence:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-amber-300",
												children: unmetDemand.lostSalesEstimation.confidenceLevel
											}),
											" ",
											"(",
											unmetDemand.lostSalesEstimation.dataCoveragePercent,
											"%",
											" ",
											isAr ? "مسعّر" : "priced",
											")"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-400",
										children: isAr ? "الربح المفقود التقديري" : "Conservative Est. Lost Profit"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono text-amber-300 mt-1",
										children: formatNullableCurrency(unmetDemand.lostSalesEstimation.estimatedLostGrossProfit)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-400 mt-1",
										children: [
											isAr ? "وحدات موزونة بعد خصم التكرار:" : "Weighted Deduped Units:",
											" ",
											unmetDemand.lostSalesEstimation.dedupedConfirmedWeightedUnits ?? 0
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-400",
										children: isAr ? "كفاءة تلبية الطلب الكلي" : "Demand Capture Efficiency"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono text-emerald-400 mt-1",
										children: unmetDemand.summary.demandCaptureEfficiencyPercent !== null ? `${unmetDemand.summary.demandCaptureEfficiencyPercent}%` : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-400 mt-1",
										children: [
											unmetDemand.summary.actualUnitsSoldInPeriod,
											" ",
											isAr ? "مباع فعلياً من" : "sold of",
											" ",
											unmetDemand.summary.observedTotalDemandUnits,
											" ",
											isAr ? "طلب كلي" : "total demand"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-400",
										children: isAr ? "منتجات غير مسجلة / نفاد متكرر" : "Unregistered / Repeat Stockouts"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-lg font-black font-mono text-violet-400 mt-1",
										children: [
											unmetDemand.summary.unregisteredProductInquiries,
											" /",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-rose-400",
												children: unmetDemand.summary.repeatedStockoutProductsCount
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-slate-400 mt-1",
										children: isAr ? "طلبات غير مسجلة / أصناف بنفاد متكرر" : "Unregistered inquiries / repeat stockouts"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4 border-amber-500/20 bg-slate-900/60 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4" }), isAr ? "منهجية تقدير المبيعات المفقودة التحفظية (عدم تضخيم الطلب)" : "Conservative Lost Sales Estimation Methodology & Anti-Overstatement Safeguards"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300",
									children: [
										"Status: ",
										unmetDemand.lostSalesEstimation.status,
										" • Sample:",
										" ",
										unmetDemand.lostSalesEstimation.sampleSizeInquiries
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-300 leading-relaxed",
								children: isAr ? unmetDemand.lostSalesEstimation.methodologyAr : unmetDemand.lostSalesEstimation.methodologyEn
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px] text-slate-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-slate-200 block mb-1",
									children: isAr ? "الافتراضات المحاسبية:" : "Model Assumptions:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "list-disc list-inside space-y-0.5",
									children: (isAr ? unmetDemand.lostSalesEstimation.assumptionsAr : unmetDemand.lostSalesEstimation.assumptionsEn).map((a, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: a }, idx))
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-slate-200 block mb-1",
									children: isAr ? "الحدود الإحصائية:" : "Known Limitations:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "list-disc list-inside space-y-0.5",
									children: (isAr ? unmetDemand.lostSalesEstimation.limitationsAr : unmetDemand.lostSalesEstimation.limitationsEn).map((l, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: l }, idx))
								})] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4 overflow-x-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap items-center justify-between gap-2 mb-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-sm font-bold",
								children: isAr ? "قاعدة المنتجات غير المتوفرة الأكثر طلباً وتوصيات اتخاذ القرار (مع أوقات السؤال المختلفة)" : "Most Requested Unavailable Products, Inquiry Timestamps & Decision Support"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-400",
								children: isAr ? "يجمع كافة المرات التي سُئل فيها عن نفس المنتج في أوقات مختلفة لمساعدة الإدارة في قرار التوريد أو الإضافة للكتالوج" : "Aggregates repeat inquiries for each product across different timestamps to guide procurement decisions"
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-xs text-left border-collapse",
							"data-testid": "unmet-top-products-table",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-slate-800 text-slate-400 text-[11px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "المنتج" : "Product"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "النوع" : "Catalog Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "عدد مرات السؤال" : "Inquiries"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الوحدات المطلوبة" : "Req. Units"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "أوقات وتواريخ السؤال المختلفة" : "Inquiry Timestamps"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "توصية اتخاذ القرار" : "Decision Support"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الرصيد / المباع" : "Stock / Sold"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الإيراد المفقود التقديري" : "Conservative Lost Rev."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "إجراء" : "Action"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-slate-800/60 font-mono",
								children: unmetDemand.topRequestedProducts.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-slate-800/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2.5 px-2 font-sans font-semibold",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-white font-bold",
													children: isAr ? item.productNameAr || item.productName : item.productName
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[10px] text-slate-400 font-mono",
													children: [
														item.sku || item.barcode || (isAr ? "غير مسجل" : "Unregistered"),
														" • ",
														item.category
													]
												}),
												item.repeatedStockoutPatternDetected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "inline-block mt-0.5 px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-sans font-bold",
													children: isAr ? "نفاد متكرر حرج" : "Repeated Stockout Pattern"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2 font-sans",
											children: item.isRegisteredProduct ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[10px] font-bold",
												children: isAr ? "مسجل بالكتالوج" : "Registered"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[10px] font-bold",
												children: isAr ? "غير مسجل بالمتجر" : "Unregistered"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/40 font-bold text-rose-300",
												children: [
													item.inquiryCount,
													" ",
													isAr ? "مرات" : "x"
												]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2.5 px-2 font-bold text-amber-400",
											children: [
												item.requestedBaseUnitsTotal,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] text-slate-400",
													children: [
														"(",
														item.confirmedPurchaseIntentUnits,
														" ",
														isAr ? "مؤكد" : "confirmed",
														")"
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2 font-sans",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-wrap gap-1 max-w-[230px]",
												children: (item.inquiryTimestamps && item.inquiryTimestamps.length > 0 ? item.inquiryTimestamps : [item.lastRequestedAt]).slice(0, 4).map((ts, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300",
													children: new Date(ts).toLocaleString(isAr ? "ar-SA" : "en-US", {
														month: "short",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit"
													})
												}, `${ts}-${idx}`))
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2 font-sans max-w-[260px]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[11px] leading-relaxed text-amber-200 font-medium",
												children: isAr ? item.decisionRecommendationAr || "يُوصى بمتابعة الطلب وتوفيره" : item.decisionRecommendationEn || "Monitor demand and restock"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2.5 px-2 text-[11px]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-300",
													children: item.currentStock !== null ? item.currentStock : "—"
												}),
												" ",
												"/ ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-emerald-400",
													children: item.actualUnitsSoldInPeriod
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2 text-rose-300 font-bold",
											children: item.lostSalesEstimationStatus === "ESTIMATED" && item.estimatedLostRevenueConservative !== null ? formatCurrency(item.estimatedLostRevenueConservative, sales.currency, settings.language) : isAr ? "بدون تسعير (غير مسجل)" : "INSUFFICIENT_DATA"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2 font-sans",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => openUnmetDemandModal({
													productId: item.productId,
													isRegisteredProduct: item.isRegisteredProduct,
													productNameSnapshot: item.productName,
													productNameArSnapshot: item.productNameAr,
													barcode: item.barcode,
													categorySnapshot: item.category,
													unavailabilityReason: item.primaryReason,
													sourceScreen: "analytics"
												}),
												className: "px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-slate-950 text-[11px] font-bold transition whitespace-nowrap",
												children: isAr ? "+ سؤال جديد" : "+ Log Inquiry"
											})
										})
									]
								}, item.productKey))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-3 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-sm font-bold mb-3",
									children: isAr ? "توزيع الطلبات حسب سبب عدم التوفر" : "Unmet Demand by Reason"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2.5",
									children: unmetDemand.byReason.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? r.labelAr : r.labelEn }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-amber-400",
												children: [
													r.requestedBaseUnits,
													" ",
													isAr ? "وحدة" : "units",
													" (",
													r.sharePercent,
													"%)"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-slate-400 font-mono",
											children: [
												r.inquiryCount,
												" ",
												isAr ? "استفسار مسجل" : "recorded inquiries"
											]
										})]
									}, r.reason))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-sm font-bold mb-3",
									children: isAr ? "توزيع الطلب غير المتوفر حسب الفئة" : "Unmet Demand by Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2.5",
									children: unmetDemand.byCategory.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cat.category }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-rose-400",
												children: [
													cat.requestedBaseUnits,
													" ",
													isAr ? "وحدة" : "units"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-[11px] text-slate-400 font-mono",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												cat.inquiryCount,
												" ",
												isAr ? "استفسار" : "inquiries",
												" •",
												" ",
												cat.distinctProducts,
												" ",
												isAr ? "أصناف" : "SKUs"
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cat.estimatedLostRevenue !== null ? formatCurrency(cat.estimatedLostRevenue, sales.currency, settings.language) : "—" })]
										})]
									}, cat.category))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-sm font-bold mb-3",
									children: isAr ? "مقارنة الطلب غير المتوفر بين الفروع" : "Unmet Demand by Branch"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2.5",
									children: unmetDemand.byBranch.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? b.branchNameAr : b.branchName }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-amber-400",
												children: [
													b.requestedBaseUnits,
													" ",
													isAr ? "وحدة" : "units",
													" (",
													b.inquiryCount,
													" ",
													isAr ? "طلب" : "inquiries",
													")"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-slate-400",
											children: [
												isAr ? "الأكثر طلباً:" : "Top Requested:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-slate-200",
													children: b.topRequestedProductName || "—"
												})
											]
										})]
									}, b.branchId))
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4 overflow-x-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-sm font-bold",
								children: isAr ? "اتجاه الطلبات غير المتوفرة مقابل المبيعات الفعلية عبر الزمن" : "Unmet Customer Demand vs. Actual Units Sold Trend"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1.5",
								children: [
									"daily",
									"weekly",
									"monthly"
								].map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setDemandTrendGranularity(g),
									className: `px-3 py-1 rounded-lg text-xs font-bold ${demandTrendGranularity === g ? "bg-amber-500 text-slate-950" : "bg-slate-900 border border-slate-800 text-slate-300"}`,
									children: g === "daily" ? isAr ? "يومي" : "Daily" : g === "weekly" ? isAr ? "أسبوعي" : "Weekly" : isAr ? "شهري" : "Monthly"
								}, g))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-xs text-left border-collapse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-slate-800 text-slate-400 text-[11px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الفترة" : "Period"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الاستفسارات" : "Inquiries"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الوحدات غير المتوفرة" : "Unmet Units"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "نية شراء مؤكدة" : "Confirmed Units"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الوحدات المباعة فعلياً" : "Actual Sold Units"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "مسجل / غير مسجل" : "Reg / Unreg"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الإيراد المفقود التقديري" : "Est. Lost Rev."
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-slate-800/60 font-mono",
								children: (demandTrendGranularity === "daily" ? unmetDemand.dailyTrends.filter((t) => t.inquiryCount > 0 || t.actualUnitsSold > 0) : demandTrendGranularity === "weekly" ? unmetDemand.weeklyTrends : unmetDemand.monthlyTrends).map((pt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2 font-bold",
										children: pt.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2 text-rose-400",
										children: pt.inquiryCount
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2 text-amber-400 font-bold",
										children: pt.requestedBaseUnits
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2 text-slate-300",
										children: pt.confirmedIntentUnits
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2 text-emerald-400 font-bold",
										children: pt.actualUnitsSold
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2 px-2 text-slate-400",
										children: [
											pt.registeredProductInquiries,
											" / ",
											pt.unregisteredProductInquiries
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2 text-rose-300",
										children: pt.estimatedLostRevenue !== null ? formatCurrency(pt.estimatedLostRevenue, sales.currency, settings.language) : "—"
									})
								] }, pt.periodKey))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4 overflow-x-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-sm font-bold mb-3",
							children: isAr ? "سجل استفسارات وطلبات العملاء الأخيرة (محمي حسب الصلاحيات)" : "Recent Recorded Customer Unmet Demand Inquiries (Role-Scoped & PII-Protected)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-xs text-left border-collapse",
							"data-testid": "unmet-recent-requests-table",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-slate-800 text-slate-400 text-[11px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الوقت" : "Timestamp"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "المنتج" : "Requested Item"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الكمية" : "Qty"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "السبب" : "Reason"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الفرع" : "Branch"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "العميل / ملاحظات" : "Customer / Notes"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-slate-800/60 font-mono",
								children: unmetDemand.recentRequests.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2 text-[11px] text-slate-400",
										children: new Date(req.requestedTimestamp).toLocaleString(isAr ? "ar-SA" : "en-US", {
											month: "short",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2 px-2 font-sans font-semibold",
										children: [isAr ? req.productNameArSnapshot || req.productNameSnapshot : req.productNameSnapshot, !req.isRegisteredProduct && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-1.5 px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[10px]",
											children: isAr ? "غير مسجل" : "Unregistered"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2 text-amber-400 font-bold",
										children: req.requestedBaseUnits
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2 font-sans text-[11px]",
										children: req.unavailabilityReason
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2 font-sans text-[11px]",
										children: req.branchId
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2 px-2 font-sans text-[11px] text-slate-300",
										children: [req.customerReference ? `${req.customerReference} — ` : "", req.notes || "—"]
									})
								] }, req.id))
							})]
						})]
					})
				]
			}),
			activeTab === "smart_intelligence" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				"data-testid": "bi-smart-intelligence-view",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-400",
										children: isAr ? "إجمالي التنبيهات الذكية" : "Active Smart Alerts"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono text-amber-400 mt-1",
										"data-testid": "smart-kpi-total-alerts",
										children: intelligence.overview.totalActiveAlerts
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-rose-400 mt-1 font-bold",
										children: [
											intelligence.overview.criticalAlertsCount,
											" ",
											isAr ? "حرجة" : "critical",
											" • ",
											intelligence.overview.highAlertsCount,
											" ",
											isAr ? "عالية" : "high"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-400",
										children: isAr ? "توصيات أوامر الشراء" : "Replenishment PO Recs"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono text-sky-400 mt-1",
										"data-testid": "smart-kpi-replenishment-count",
										children: intelligence.overview.replenishmentRecommendationsCount
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-400 mt-1",
										children: [
											isAr ? "التكلفة التقديرية:" : "Est. Cost:",
											" ",
											formatNullableCurrency(intelligence.overview.totalRecommendedReplenishmentCost)
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-400",
										children: isAr ? "فرص التحويل بين الفروع" : "Branch Transfer Recs"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono text-emerald-400 mt-1",
										"data-testid": "smart-kpi-transfer-count",
										children: intelligence.overview.branchTransferOpportunitiesCount
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-400 mt-1",
										children: [
											intelligence.overview.totalTransferableUnits,
											" ",
											isAr ? "وحدة فائضة قابلة للتحويل" : "surplus units transferable"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-400",
										children: isAr ? "مخاطر المخزون والنفاد" : "Inventory & Stockout Risks"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono text-rose-400 mt-1",
										children: intelligence.inventoryRisks.length
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-slate-400 mt-1",
										children: [
											intelligence.overview.expiringProductsCount,
											" ",
											isAr ? "أصناف بمخاطر صلاحية" : "with expiration risk"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-400",
										children: isAr ? "المخاطر المالية والربحية" : "Financial & Margin Risks"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-black font-mono text-amber-300 mt-1",
										children: intelligence.financialRisks.length
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-slate-400 mt-1",
										children: isAr ? "مراقبة الهوامش والديون والمرتجعات" : "Margin, debt & return alerts"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
								className: "p-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-400",
										children: isAr ? "حالة التنفيذ الآلي" : "Automation Safety Mode"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-black font-mono text-emerald-400 mt-1.5",
										children: isAr ? "يتطلب اعتماد الإدارة" : "REQUIRES APPROVAL"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-slate-400 mt-1",
										children: isAr ? "لا يتم تعديل المخزون أو الأسعار تلقائياً" : "Read-only advisory recommendations"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4 overflow-x-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-sm font-bold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "w-4 h-4 text-amber-400" }), isAr ? "توصيات التوريد وأوامر الشراء الذكية (تدمج المبيعات الفعلية + الطلب غير المتوفر + زمن التوريد)" : "Smart Replenishment & Purchase Order Recommendations (Sales + Unmet Demand + Lead Time)"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-400",
								children: isAr ? "جميع التوصيات استشارية وتتطلب اعتماد مدير المشتريات قبل إنشاء أمر شراء فعلي." : "All recommendations are strictly advisory and require manager approval before creating a PO."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold",
								children: isAr ? "الحالة: يتطلب اعتماد المستخدم" : "Status: Requires User Approval"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-xs text-left border-collapse",
							"data-testid": "smart-replenishment-table",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-slate-800 text-slate-400 text-[11px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "المنتج" : "Product"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الأولوية" : "Urgency"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الرصيد الحالي" : "Stock"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "مبيعات/يوم" : "Sales/Day"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "طلبات غير متوفرة" : "Unmet Units"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الطلب الكامن/يوم" : "Latent/Day"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "نقطة الطلب" : "Reorder Pt"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الكمية المقترحة" : "Rec. Order Qty"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "التكلفة التقديرية" : "Est. Cost"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 px-2",
										children: isAr ? "الاعتماد" : "Approval"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-slate-800/60 font-mono",
								children: intelligence.replenishmentRecommendations.map((rec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-slate-800/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2 px-2 font-sans font-semibold",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: isAr ? rec.productNameAr || rec.productName : rec.productName }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[10px] text-slate-400 font-mono",
													children: [
														rec.sku,
														" • ",
														rec.category,
														" • Lead ",
														rec.leadTimeDays,
														"d"
													]
												}),
												rec.expirationRiskDetected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[10px] text-amber-400 font-sans mt-0.5",
													children: [
														"⚠️",
														" ",
														isAr ? `تنبيه صلاحية (${rec.expiryDateSnapshot || "قريب"})` : `Expiration Risk (${rec.expiryDateSnapshot || "Near Expiry"})`
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2 font-sans",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `px-2 py-0.5 rounded text-[10px] font-bold ${rec.urgency === "CRITICAL" ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" : rec.urgency === "HIGH" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-sky-500/20 text-sky-300"}`,
												children: rec.urgency
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2 font-bold",
											children: rec.currentStock
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2 px-2",
											children: [rec.observedSalesDailyVelocity, "/d"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2 px-2 text-rose-400 font-bold",
											children: [
												rec.observedUnmetDemandUnits,
												" (",
												rec.unmetDemandInquiriesCount,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2 px-2 text-amber-300 font-bold",
											children: [rec.estimatedLatentDailyDemand, "/d"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2",
											children: rec.reorderPointUnits
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2 px-2 text-emerald-400 font-bold",
											children: ["+", rec.recommendedOrderUnits]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2",
											children: formatNullableCurrency(rec.estimatedOrderCost)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2 px-2 font-sans",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]",
												children: isAr ? "يتطلب موافقة" : "Requires Approval"
											})
										})
									]
								}, rec.id))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4 overflow-x-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-sm font-bold mb-2 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "w-4 h-4 text-emerald-400" }), isAr ? "فرص التحويل الذكي للمخزون بين الفروع (من فرع الفائض إلى فرع العجز والطلب)" : "Smart Inter-Branch Stock Transfer Recommendations (Surplus Branch → Shortage Branch)"]
						}), intelligence.branchTransferOpportunities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400 py-3",
							children: isAr ? "لا توجد حالياً اختلالات مخزنية تتطلب تحويلاً بين الفروع." : "No inter-branch stock imbalances requiring transfer at this time."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-3",
							"data-testid": "smart-branch-transfers-list",
							children: intelligence.branchTransferOpportunities.map((tr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-xl bg-slate-900/70 border border-emerald-500/30 text-xs space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-white",
											children: [
												isAr ? tr.productNameAr || tr.productName : tr.productName,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono text-slate-400",
													children: [
														"(",
														tr.sku,
														")"
													]
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold",
											children: isAr ? `تحويل ${tr.recommendedTransferUnits} وحدة` : `Transfer ${tr.recommendedTransferUnits} units`
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-sky-300",
												children: [
													isAr ? "من:" : "From:",
													" ",
													isAr ? tr.fromBranchNameAr : tr.fromBranchName,
													" (",
													isAr ? "فائض" : "Surplus",
													":",
													" ",
													tr.fromBranchEstimatedSurplusUnits,
													")"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-amber-400 font-bold",
												children: "→"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-rose-300",
												children: [
													isAr ? "إلى:" : "To:",
													" ",
													isAr ? tr.toBranchNameAr : tr.toBranchName,
													" (",
													isAr ? "عجز/طلبات:" : "Shortage/Unmet:",
													" ",
													tr.toBranchShortageOrUnmetUnits,
													")"
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-slate-300 leading-relaxed",
										children: isAr ? tr.explanationAr : tr.explanationEn
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											isAr ? "الثقة:" : "Confidence:",
											" ",
											tr.confidenceLevel
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-amber-300 font-semibold",
											children: isAr ? "الحالة: مقترح يتطلب موافقة الإدارة" : "Approval: requires_user_approval"
										})]
									})
								]
							}, tr.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "p-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-sm font-bold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-amber-400" }), isAr ? "مستكشف التنبيهات والتوصيات الذكية الموحد (10 فئات تحليلية)" : "Unified 10-Category Smart Store Operations & Risk Alerts"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: alertCategoryFilter,
								onChange: (e) => setAlertCategoryFilter(e.target.value),
								"data-testid": "smart-alert-category-filter",
								className: selectClass,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "ALL",
									children: isAr ? `كل الفئات (${intelligence.smartAlerts.length})` : `All Categories (${intelligence.smartAlerts.length})`
								}), SUPPORTED_SMART_INSIGHT_CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: cat,
									children: [
										getCategoryLabel(cat),
										" (",
										intelligence.overview.byCategory[cat] || 0,
										")"
									]
								}, cat))]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 lg:grid-cols-2 gap-3.5",
							"data-testid": "smart-alerts-list",
							children: intelligence.smartAlerts.filter((a) => alertCategoryFilter === "ALL" || a.category === alertCategoryFilter).map((alert) => {
								const status = alertLifecycleOverrides[alert.dedupeKey] || alertLifecycleOverrides[alert.id] || alert.lifecycleStatus;
								const topEvidence = alert.evidenceMetrics[0];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-2.5 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-start justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 text-xs text-neutral-400",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: alert.severity === "CRITICAL" ? "font-bold text-rose-400" : alert.severity === "HIGH" ? "font-bold text-amber-400" : "font-semibold text-sky-400",
															children: getSeverityLabel(alert.severity)
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															"aria-hidden": "true",
															children: "·"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-neutral-300 font-medium",
															children: getCategoryLabel(alert.category)
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
													className: "font-bold text-sm sm:text-base text-white",
													children: isAr ? alert.titleAr : alert.titleEn
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-2 font-mono text-xs",
												children: topEvidence && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-bold text-amber-400",
													children: [
														topEvidence.name,
														": ",
														topEvidence.valueFormatted
													]
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-neutral-200 text-xs sm:text-sm leading-relaxed",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: isAr ? "النتيجة: " : "Finding: " }), isAr ? alert.descriptionAr : alert.descriptionEn]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-neutral-400 text-xs leading-relaxed",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: isAr ? "التفسير التحليلي: " : "Explanation: " }), isAr ? alert.explanationAr : alert.explanationEn]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pt-2 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-emerald-400 font-bold text-xs sm:text-sm",
												children: [isAr ? "الإجراء المقترح: " : "Recommended Action: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-emerald-300",
													children: isAr ? alert.recommendedActionAr : alert.recommendedActionEn
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-1",
												children: [
													"active",
													"acknowledged",
													"resolved",
													"dismissed"
												].map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => handlePersistAlertStatusChange(alert.id, alert.dedupeKey || `smart_alert:${alert.id}`, st),
													className: `px-2 py-1 rounded-lg text-[11px] font-semibold ${status === st ? "bg-amber-500 text-neutral-950 font-bold" : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"}`,
													children: getLifecycleLabel(st)
												}, st))
											})]
										})
									]
								}, alert.id);
							})
						})]
					})
				]
			}),
			activeTab === "insights" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
					className: "p-5 border-neutral-800 bg-neutral-900/95 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-800",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-base font-extrabold text-white flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-5 h-5 text-amber-400" }), isAr ? `جميع التوصيات الذكية والتنبيهات التشغيلية (${intelligence.smartAlerts.length + intelligence.replenishmentRecommendations.length + intelligence.branchTransferOpportunities.length + insights.length})` : `All Unified Smart Store & Business Recommendations (${intelligence.smartAlerts.length + intelligence.replenishmentRecommendations.length + intelligence.branchTransferOpportunities.length + insights.length})`]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-neutral-400 mt-0.5",
							children: isAr ? "قائمة شاملة بجميع توصيات الذكاء التشغيلي، أوامر الشراء المقترحة، فرص التحويل بين الفروع، والتوصيات المالية." : "Complete list of operational alerts, purchase order recommendations, branch transfers, and financial insights."
						})] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-2 gap-3.5",
						children: [intelligence.smartAlerts.map((alert) => {
							const topEvidence = alert.evidenceMetrics[0];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-neutral-400",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-amber-400",
													children: getSeverityLabel(alert.severity)
												}),
												" ",
												"· ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: getCategoryLabel(alert.category) })
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
											className: "text-sm sm:text-base font-bold text-white mt-0.5",
											children: isAr ? alert.titleAr : alert.titleEn
										})] }), topEvidence && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-xs font-bold text-amber-400",
											children: [
												topEvidence.name,
												": ",
												topEvidence.valueFormatted
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs sm:text-sm text-neutral-200 leading-relaxed",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: isAr ? "النتيجة: " : "Finding: " }), isAr ? alert.descriptionAr : alert.descriptionEn]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-neutral-400 leading-relaxed",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: isAr ? "التفسير: " : "Explanation: " }), isAr ? alert.explanationAr : alert.explanationEn]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 border-t border-neutral-800 text-xs sm:text-sm font-bold text-emerald-400",
										children: [isAr ? "التوصية المقترحة: " : "Recommended Action: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-emerald-300",
											children: isAr ? alert.recommendedActionAr : alert.recommendedActionEn
										})]
									})
								]
							}, alert.id);
						}), insights.map((ins) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-sky-400",
										children: getSeverityLabel(ins.severity)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
										className: "text-sm sm:text-base font-bold text-white mt-0.5",
										children: isAr ? ins.titleAr : ins.titleEn
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-xs font-bold text-amber-400",
										children: [
											ins.metricName,
											": ",
											ins.metricValueFormatted
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs sm:text-sm text-neutral-200 leading-relaxed",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: isAr ? "النتيجة: " : "Finding: " }), isAr ? ins.findingAr : ins.findingEn]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-neutral-400 leading-relaxed",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: isAr ? "الدليل والسبب: " : "Evidence & Reason: " }),
										isAr ? ins.supportingEvidenceAr : ins.supportingEvidenceEn,
										" —",
										" ",
										isAr ? ins.reasonAr : ins.reasonEn
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 border-t border-neutral-800 text-xs sm:text-sm font-bold text-emerald-400",
									children: [isAr ? "التوصية التنفيذية المقترحة: " : "Recommended Action: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-emerald-300",
										children: isAr ? ins.suggestedActionAr : ins.suggestedActionEn
									})]
								})
							]
						}, ins.id))]
					})]
				})
			})
		]
	});
}
// src/components/reports/ReportsView.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var ReportsView = () => {
	const { transactions, products, stockMovements, settings, updateSettings, currencies, exchangeRates, exchangeRateHistory, updateExchangeRate, unmetDemandRequests, openUnmetDemandModal } = usePOS();
	const t = getTranslation(settings.language);
	const isAr = settings.language === "ar";
	const [reportViewMode, setReportViewMode] = (0, import_react.useState)("bi_suite");
	const [unavailableReportSearch, setUnavailableReportSearch] = (0, import_react.useState)("");
	const [valuationMode, setValuationMode] = (0, import_react.useState)("indexed");
	const [anchorCurrency, setAnchorCurrency] = (0, import_react.useState)("USD");
	const [selectedRateChartCurrency, setSelectedRateChartCurrency] = (0, import_react.useState)("USD");
	const [rateInputDraft, setRateInputDraft] = (0, import_react.useState)(() => String(exchangeRates["USD"] || 2700));
	const [rateFeedback, setRateFeedback] = (0, import_react.useState)(null);
	const unavailableProductsKnowledgeBase = (0, import_react.useMemo)(() => buildUnavailableProductsKnowledgeBase(unmetDemandRequests || [], products || []).filter((item) => item.inquiryCount > 0), [unmetDemandRequests, products]);
	const filteredUnavailableReportItems = (0, import_react.useMemo)(() => searchUnavailableProductsKnowledgeBase(unavailableProductsKnowledgeBase, unavailableReportSearch, {
		onlyUnregisteredOrPreviouslyAsked: true,
		limit: 25
	}), [unavailableProductsKnowledgeBase, unavailableReportSearch]);
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
		if (exchangeRates[selectedRateChartCurrency]) setRateInputDraft(String(exchangeRates[selectedRateChartCurrency]));
	}, [selectedRateChartCurrency, exchangeRates]);
	const analytics = (0, import_react.useMemo)(() => {
		return computeStoreReportAnalytics(transactions, products, stockMovements, settings.currency, exchangeRates, valuationMode, anchorCurrency);
	}, [
		transactions,
		products,
		stockMovements,
		settings.currency,
		exchangeRates,
		valuationMode,
		anchorCurrency
	]);
	const rateFluctuations = (0, import_react.useMemo)(() => {
		return computeExchangeRateFluctuationSummary(exchangeRates, exchangeRateHistory);
	}, [exchangeRates, exchangeRateHistory]);
	const activeFluctuationItem = (0, import_react.useMemo)(() => {
		return rateFluctuations.find((f) => f.currency === selectedRateChartCurrency) || rateFluctuations[0];
	}, [rateFluctuations, selectedRateChartCurrency]);
	const handleQuickRateSubmit = async (e) => {
		e.preventDefault();
		const parsed = parseFloat(rateInputDraft);
		if (!Number.isFinite(parsed) || parsed <= 0) return;
		await updateExchangeRate({
			sourceCurrency: selectedRateChartCurrency,
			targetCurrency: "SDG",
			rate: parsed
		});
		setRateFeedback(isAr ? `تم تحديث سعر ${selectedRateChartCurrency} إلى ${parsed} ج.س وتحديث جميع الشارتات` : `Updated ${selectedRateChartCurrency} to ${parsed} SDG & refreshed charts`);
		setTimeout(() => setRateFeedback(null), 3e3);
	};
	const getBadgeStyle = (level) => {
		if (level === "excellent") return {
			bg: "bg-emerald-950/70 border-emerald-700/60 text-emerald-300",
			bar: "bg-emerald-500",
			label: isAr ? "أداء ممتاز" : "Excellent"
		};
		if (level === "good") return {
			bg: "bg-amber-950/70 border-amber-700/60 text-amber-300",
			bar: "bg-amber-500",
			label: isAr ? "أداء جيد" : "Good"
		};
		return {
			bg: "bg-rose-950/70 border-rose-700/60 text-rose-300",
			bar: "bg-rose-500",
			label: isAr ? "يحتاج متابعة" : "Needs Attention"
		};
	};
	const exportSalesCsv = () => {
		const headers = [
			"Transaction ID",
			"Date",
			"Customer",
			"Payment Method",
			"Fulfillment Status",
			"Items Count",
			`Grand Total (${settings.currency})`,
			"Status"
		];
		const rows = transactions.map((tx) => [
			tx.id,
			new Date(tx.timestamp).toISOString(),
			`"${tx.customerName || "Walk-in"}"`,
			tx.paymentMethod,
			tx.fulfillmentStatus || "received",
			tx.items.reduce((acc, i) => acc + i.quantity, 0),
			tx.grandTotal.toFixed(2),
			tx.status
		]);
		const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `dqnamo_pos_sales_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	const exportInventoryCsv = () => {
		const headers = [
			"SKU",
			"Name",
			"Category",
			"Barcode",
			"Cost Price",
			"Selling Price",
			"Stock Qty",
			"Asset Value"
		];
		const rows = products.map((p) => [
			p.sku,
			`"${p.name}"`,
			`"${p.category}"`,
			p.barcode,
			p.costPrice.toFixed(2),
			p.sellingPrice.toFixed(2),
			p.stock,
			(p.costPrice * p.stock).toFixed(2)
		]);
		const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `dqnamo_pos_inventory_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	const storeChartBars = (0, import_react.useMemo)(() => {
		const maxVal = Math.max(1, analytics.grossSales, analytics.collectedSales, analytics.netGrossProfit, analytics.estimatedCost, analytics.outstandingDebt);
		return [
			{
				id: "gross",
				label: isAr ? "إجمالي المبيعات" : "Gross Sales",
				value: analytics.grossSales,
				pct: Math.round(analytics.grossSales / maxVal * 100),
				color: "bg-emerald-500",
				textColor: "text-emerald-400"
			},
			{
				id: "collected",
				label: isAr ? "المبالغ المحصلة" : "Collected Revenue",
				value: analytics.collectedSales,
				pct: Math.round(analytics.collectedSales / maxVal * 100),
				color: "bg-amber-500",
				textColor: "text-amber-400"
			},
			{
				id: "profit",
				label: isAr ? "صافي الربح التقديري" : "Net Gross Profit",
				value: analytics.netGrossProfit,
				pct: Math.round(analytics.netGrossProfit / maxVal * 100),
				color: "bg-cyan-500",
				textColor: "text-cyan-400"
			},
			{
				id: "cogs",
				label: isAr ? "تكلفة البضاعة" : "Cost of Goods (COGS)",
				value: analytics.estimatedCost,
				pct: Math.round(analytics.estimatedCost / maxVal * 100),
				color: "bg-purple-500",
				textColor: "text-purple-400"
			},
			{
				id: "debt",
				label: isAr ? "الديون المتبقية" : "Outstanding Debt",
				value: analytics.outstandingDebt,
				pct: Math.round(analytics.outstandingDebt / maxVal * 100),
				color: "bg-rose-500",
				textColor: "text-rose-400"
			}
		];
	}, [analytics, isAr]);
	const maxProductUnits = (0, import_react.useMemo)(() => {
		return Math.max(1, ...analytics.productReports.map((p) => p.unitsSold));
	}, [analytics.productReports]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 max-w-[1600px] mx-auto w-full p-3 sm:p-4 md:p-6 space-y-5 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl sm:text-2xl font-extrabold text-white tracking-tight",
					children: t.analyticsAndReports
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-neutral-400",
					children: isAr ? "شارات أداء المتجر، شارت مبيعات كل منتج حسب العملة، ومؤشرات تغير أسعار الصرف" : "Store performance badges, per-product multi-currency sales charts & exchange rate fluctuation indicators"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex rounded-xl p-1 bg-neutral-900 border border-neutral-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setReportViewMode("bi_suite"),
								"data-testid": "reports-mode-bi-suite",
								className: `px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${reportViewMode === "bi_suite" ? "bg-amber-500 text-neutral-950 shadow-sm" : "text-neutral-300 hover:text-white"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5" }), isAr ? "ذكاء الأعمال والتنبؤ الإحصائي (BI Suite)" : "BI & Predictive Analytics Suite"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setReportViewMode("classic_reports"),
								"data-testid": "reports-mode-classic",
								className: `px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${reportViewMode === "classic_reports" ? "bg-emerald-500 text-neutral-950 shadow-sm" : "text-neutral-300 hover:text-white"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "w-3.5 h-3.5" }), isAr ? "تقارير العملات وأسعار الصرف" : "Multi-Currency & FX Reports"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							variant: "secondary",
							size: "sm",
							onClick: exportSalesCsv,
							leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }),
							children: t.exportCsv
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							variant: "secondary",
							size: "sm",
							onClick: exportInventoryCsv,
							leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }),
							children: t.exportInventoryCsv
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
				"data-testid": "reports-unavailable-products-decision-section",
				className: "p-4 border-amber-500/35 bg-neutral-900/95 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-neutral-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm sm:text-base font-extrabold text-white",
									children: isAr ? "تقرير قاعدة المنتجات غير المتوفرة ودعم اتخاذ القرار" : "Unavailable Products Knowledge Base & Decision Support Report"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold",
									children: isAr ? `${unavailableProductsKnowledgeBase.length} منتج مسجل` : `${unavailableProductsKnowledgeBase.length} items`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold",
									children: isAr ? `${unavailableProductsKnowledgeBase.filter((i) => i.inquiryCount >= 2).length} منتجات متكررة الطلب` : `${unavailableProductsKnowledgeBase.filter((i) => i.inquiryCount >= 2).length} repeated demand`
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-neutral-400 mt-0.5",
							children: isAr ? "يعرض كل منتج غير متوفر سأل عنه الزبائن، عدد مرات السؤال، أوقات وتواريخ السؤال المختلفة، والتوصية لاتخاذ قرار التوفير أو الإدراج بالكتالوج" : "Displays every requested unavailable product, inquiry count, distinct inquiry timestamps, and procurement decision recommendations"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative min-w-[240px] sm:min-w-[280px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-2.5 start-3 w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: unavailableReportSearch,
								onChange: (e) => setUnavailableReportSearch(e.target.value),
								"data-testid": "reports-unavailable-search-input",
								placeholder: isAr ? "ابحث بأي كلمة أو حرف (مثال: كريم باريس، كريم، باريس)..." : "Search by any word or character...",
								className: "w-full rounded-xl bg-neutral-950 border border-neutral-700 ps-8 pe-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "reports-open-unmet-modal-btn",
							onClick: () => openUnmetDemandModal({
								isRegisteredProduct: false,
								unavailabilityReason: "NOT_STOCKED",
								sourceScreen: "analytics"
							}),
							className: "px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), isAr ? "تسجيل منتج غير متوفر" : "Record Unavailable Product"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-testid": "reports-unavailable-products-list",
					className: "overflow-x-auto",
					children: filteredUnavailableReportItems.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-xs text-start border-collapse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-neutral-800 text-neutral-400 text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2 text-start",
									children: isAr ? "المنتج غير المتوفر" : "Unavailable Product"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2 text-start",
									children: isAr ? "عدد مرات السؤال" : "Times Asked"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2 text-start",
									children: isAr ? "إجمالي الكمية" : "Total Qty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2 text-start",
									children: isAr ? "أوقات وتواريخ السؤال المختلفة (الأزمنة)" : "Distinct Inquiry Timestamps"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2 text-start",
									children: isAr ? "توصية اتخاذ القرار" : "Decision Support Recommendation"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 px-2 text-end",
									children: isAr ? "إجراء سريع" : "Quick Action"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-neutral-800/70",
							children: filteredUnavailableReportItems.map((item) => {
								const isRepeated = item.inquiryCount >= 2;
								const isCritical = item.inquiryCount >= 3 || item.totalRequestedBaseUnits >= 5;
								const recommendationText = isAr ? isCritical ? `أولوية قصوى: سُئل عنه ${item.inquiryCount} مرات في أوقات مختلفة (${item.totalRequestedBaseUnits} وحدة) — يُوصى بتوفيره وإدراجه فوراً` : isRepeated ? `طلب متكرر (${item.inquiryCount} مرات) — يُوصى بالتواصل مع المورد لتوفيره وتلبية طلب الزبائن` : `سؤال مسجل (${item.totalRequestedBaseUnits} وحدة) — محفوظ في قاعدة غير المتوفر لمتابعة تكرار الطلب` : isCritical ? `Critical Priority: Asked ${item.inquiryCount} times across different timestamps (${item.totalRequestedBaseUnits} units) — Source & stock immediately` : isRepeated ? `Repeated Demand (${item.inquiryCount}x) — Contact supplier to stock item` : `Initial Inquiry (${item.totalRequestedBaseUnits} units) — Saved in Unavailable DB to track repeat demand`;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									"data-testid": `report-unavailable-row-${item.key}`,
									className: "hover:bg-neutral-800/40 transition",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2.5 px-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-bold text-white text-xs sm:text-sm",
												children: item.productName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[10px] text-neutral-400 flex flex-wrap items-center gap-1.5 mt-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300",
													children: item.category
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `px-1.5 py-0.5 rounded font-semibold ${item.isRegisteredProduct ? "bg-emerald-500/15 text-emerald-300" : "bg-violet-500/20 text-violet-300"}`,
													children: item.isRegisteredProduct ? isAr ? "مسجل (نافد)" : "Registered (OOS)" : isAr ? "غير مسجل بالمتجر" : "Unregistered"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono font-extrabold text-xs border ${isCritical ? "bg-rose-500/20 border-rose-500/50 text-rose-300" : isRepeated ? "bg-amber-500/20 border-amber-500/50 text-amber-300" : "bg-neutral-800 border-neutral-700 text-neutral-200"}`,
												children: isAr ? `${item.inquiryCount} مرات` : `${item.inquiryCount} times`
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2.5 px-2 font-mono font-bold text-amber-400",
											children: [
												item.totalRequestedBaseUnits,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-neutral-400 font-sans",
													children: isAr ? "وحدة" : "units"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-1 max-w-[290px]",
												children: [item.inquiryTimestamps.slice(0, 5).map((ts, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 font-mono text-[10px] text-neutral-300",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-2.5 h-2.5 text-amber-400" }), new Date(ts).toLocaleString(isAr ? "ar-SD" : "en-US", {
														month: "short",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit"
													})]
												}, `${ts}-${idx}`)), item.inquiryTimestamps.length > 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] text-neutral-400 font-mono",
													children: ["+", item.inquiryTimestamps.length - 5]
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2 max-w-[290px]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-[11px] font-semibold leading-relaxed block ${isCritical ? "text-rose-300" : isRepeated ? "text-amber-300" : "text-neutral-300"}`,
												children: recommendationText
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-2 text-end",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"data-testid": `report-log-repeat-${item.key}`,
												onClick: () => openUnmetDemandModal({
													productId: item.productId,
													isRegisteredProduct: item.isRegisteredProduct,
													productNameSnapshot: item.productName,
													productNameArSnapshot: item.productNameAr,
													barcode: item.barcode,
													categorySnapshot: item.category,
													unavailabilityReason: item.unavailabilityReason,
													sourceScreen: "analytics"
												}),
												className: "px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 border border-amber-500/40 font-bold text-[11px] transition whitespace-nowrap",
												children: isAr ? "+ تسجيل سؤال جديد" : "+ Log Repeat Inquiry"
											})
										})
									]
								}, item.key);
							})
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-6 text-center text-xs text-neutral-400 flex flex-col items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageX, { className: "w-6 h-6 text-neutral-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "لا توجد منتجات مطابقة للبحث في قاعدة المنتجات غير المتوفرة حالياً." : "No matching items in the Unavailable Products Database." })]
					})
				})]
			}),
			reportViewMode === "bi_suite" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessIntelligenceDashboard, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppCard, {
					className: "p-4 border-amber-500/30 bg-neutral-900/95",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-12 gap-4 items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "lg:col-span-5 space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs font-bold text-neutral-300 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "عملة عرض التقارير والشارتات" : "Reports Display Currency" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1.5",
									children: activeCurrencyCodes.map((code) => {
										const isSelected = settings.currency.toUpperCase() === code;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"data-testid": `reports-currency-btn-${code}`,
											onClick: () => updateSettings({ currency: code }),
											className: `px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${isSelected ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-sm" : "bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-amber-500/50 hover:text-white"}`,
											children: code
										}, code);
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "lg:col-span-3 space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs font-bold text-neutral-300 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تقييم الفواتير" : "Rate Valuation" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setValuationMode("indexed"),
										className: `px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${valuationMode === "indexed" ? "bg-amber-500 text-neutral-950" : "text-neutral-400 hover:text-white"}`,
										children: isAr ? "مربوط بالسعر الجديد" : "Linked Rate"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setValuationMode("live"),
										className: `px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${valuationMode === "live" ? "bg-emerald-500 text-neutral-950" : "text-neutral-400 hover:text-white"}`,
										children: isAr ? "تحويل مباشر" : "Live Direct"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "lg:col-span-4 space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs font-bold text-neutral-300 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تحديث سعر الصرف ومشاهدة الأثر فوراً" : "Update Rate & Preview Impact" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: handleQuickRateSubmit,
										className: "flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center bg-neutral-950 border border-neutral-800 rounded-xl px-2 py-1 text-xs font-mono text-neutral-300 shrink-0",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
														"aria-label": "Select currency for rate update",
														value: selectedRateChartCurrency,
														onChange: (e) => {
															const code = e.target.value;
															setSelectedRateChartCurrency(code);
															setAnchorCurrency(code);
															setRateInputDraft(String(exchangeRates[code] || 1));
														},
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
												"data-testid": "reports-quick-rate-input",
												value: rateInputDraft,
												onChange: (e) => setRateInputDraft(e.target.value),
												className: "w-24 px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] font-mono text-neutral-400",
												children: "SDG"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
												type: "submit",
												variant: "emerald",
												size: "sm",
												"data-testid": "reports-quick-rate-submit",
												className: "px-2.5 py-1.5 text-xs shrink-0",
												children: isAr ? "تحديث" : "Apply"
											})
										]
									}),
									rateFeedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] font-semibold text-emerald-400 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rateFeedback })]
									})
								]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-semibold text-neutral-400",
									children: [
										t.grossSales,
										" (",
										settings.currency,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-4 h-4 text-emerald-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								"data-testid": "reports-gross-sales",
								className: "text-2xl font-bold font-mono text-emerald-400 tabular-nums",
								children: formatCurrency(analytics.grossSales, settings.currency, settings.language)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-neutral-500",
								children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									"عبر ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono tabular-nums",
										children: analytics.totalOrders
									}),
									" فاتورة مكتملة"
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									"Across ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono tabular-nums",
										children: analytics.totalOrders
									}),
									" ",
									"completed transactions"
								] })
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-semibold text-neutral-400",
									children: [
										t.netProfit,
										" (",
										settings.currency,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-amber-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								"data-testid": "reports-net-profit",
								className: "text-2xl font-bold font-mono text-amber-400 tabular-nums",
								children: formatCurrency(analytics.netGrossProfit, settings.currency, settings.language)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-neutral-500",
								children: isAr ? "الإيراد بعد خصم تكلفة البضاعة والضريبة" : "Gross revenue minus COGS & VAT"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-semibold text-neutral-400",
									children: [
										t.averageOrderValue,
										" (",
										settings.currency,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "w-4 h-4 text-blue-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								"data-testid": "reports-avg-order",
								className: "text-2xl font-bold font-mono text-white tabular-nums",
								children: formatCurrency(analytics.avgOrderValue, settings.currency, settings.language)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-neutral-500",
								children: isAr ? "متوسط قيمة سلة الشراء للعميل" : "Per customer checkout ticket"
							})
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
					"data-testid": "store-performance-badges-section",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-4 h-4 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-white",
								children: t.storePerformanceBadges
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-neutral-400",
							children: isAr ? "مؤشرات وشارات حيوية لقياس ربحية المتجر، التحصيل، استلام البضاعة، وجاهزية المخزون" : "Live operational health badges measuring profitability, debt collection, fulfillment & stock"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3",
						children: [
							(() => {
								const st = getBadgeStyle(analytics.performanceBadges.profit.level);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									"data-testid": "perf-badge-profit",
									className: "p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-col justify-between gap-2.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-white",
												children: isAr ? "شارة هامش الربح" : "Profit Margin Badge"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-[10px] font-bold px-2 py-0.5 rounded-md border ${st.bg}`,
												children: st.label
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-2xl font-extrabold font-mono text-emerald-400 tabular-nums",
												children: [analytics.profitMarginPercent, "%"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] text-neutral-400",
												children: [
													isAr ? "صافي:" : "Net:",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono font-semibold text-neutral-200 tabular-nums",
														children: formatCurrency(analytics.netGrossProfit, settings.currency, settings.language)
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-full h-2 rounded-full bg-neutral-900 overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `h-full rounded-full transition-all ${st.bar}`,
												style: { width: `${Math.min(100, Math.max(6, analytics.profitMarginPercent))}%` }
											})
										})
									]
								});
							})(),
							(() => {
								const st = getBadgeStyle(analytics.performanceBadges.collection.level);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									"data-testid": "perf-badge-collection",
									className: "p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-col justify-between gap-2.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-white",
												children: isAr ? "شارة كفاءة التحصيل" : "Collection Rate Badge"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-[10px] font-bold px-2 py-0.5 rounded-md border ${st.bg}`,
												children: st.label
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-2xl font-extrabold font-mono text-amber-400 tabular-nums",
												children: [analytics.collectionRatePercent, "%"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] text-rose-400",
												children: [
													isAr ? "الديون:" : "Debt:",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono font-semibold tabular-nums",
														children: formatCurrency(analytics.outstandingDebt, settings.currency, settings.language)
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-full h-2 rounded-full bg-neutral-900 overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `h-full rounded-full transition-all ${st.bar}`,
												style: { width: `${Math.min(100, Math.max(6, analytics.collectionRatePercent))}%` }
											})
										})
									]
								});
							})(),
							(() => {
								const st = getBadgeStyle(analytics.performanceBadges.fulfillment.level);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									"data-testid": "perf-badge-fulfillment",
									className: "p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-col justify-between gap-2.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-white",
												children: isAr ? "شارة استلام البضاعة والفواتير" : "Goods & Invoice Receipt"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-[10px] font-bold px-2 py-0.5 rounded-md border ${st.bg}`,
												children: st.label
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-2xl font-extrabold font-mono text-cyan-400 tabular-nums",
												children: [analytics.fulfillmentStats.fulfillmentRatePercent, "%"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] text-neutral-400",
												children: [
													isAr ? "مستلم:" : "Received:",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono font-bold text-emerald-400 tabular-nums",
														children: analytics.fulfillmentStats.receivedCount
													}),
													" ",
													"/ ",
													isAr ? "معلق:" : "Pending:",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono font-bold text-amber-400 tabular-nums",
														children: analytics.fulfillmentStats.totalPendingCount
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-full h-2 rounded-full bg-neutral-900 overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `h-full rounded-full transition-all ${st.bar}`,
												style: { width: `${Math.min(100, Math.max(6, analytics.fulfillmentStats.fulfillmentRatePercent))}%` }
											})
										})
									]
								});
							})(),
							(() => {
								const st = getBadgeStyle(analytics.performanceBadges.inventory.level);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									"data-testid": "perf-badge-inventory",
									className: "p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-col justify-between gap-2.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-white",
												children: isAr ? "شارة جاهزية المخزون" : "Inventory Readiness"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-[10px] font-bold px-2 py-0.5 rounded-md border ${st.bg}`,
												children: st.label
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-2xl font-extrabold font-mono text-purple-400 tabular-nums",
												children: [analytics.inventoryHealth.readinessPercent, "%"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] text-neutral-400",
												children: [
													isAr ? "توريدات مستلمة:" : "Restock batches:",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono font-bold text-emerald-400 tabular-nums",
														children: analytics.fulfillmentStats.supplierGoodsReceiptsCount
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-full h-2 rounded-full bg-neutral-900 overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `h-full rounded-full transition-all ${st.bar}`,
												style: { width: `${Math.min(100, Math.max(6, analytics.inventoryHealth.readinessPercent))}%` }
											})
										})
									]
								});
							})()
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "lg:col-span-7 flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3 border-b border-neutral-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-4 h-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-bold text-sm text-white",
									children: [
										t.storePerformanceChart,
										" (",
										settings.currency,
										")"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-neutral-400",
								children: isAr ? "مقارنة المبيعات، الأرباح، التكلفة والديون" : "Revenue, Profit, COGS & Debt"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3.5 mt-4",
							children: storeChartBars.map((bar) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-neutral-200",
										children: bar.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `font-mono font-bold tabular-nums ${bar.textColor}`,
										children: formatCurrency(bar.value, settings.currency, settings.language)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full h-3 rounded-lg bg-neutral-950 border border-neutral-800/80 overflow-hidden p-0.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-full rounded-md transition-all duration-300 ${bar.color}`,
										style: { width: `${Math.max(bar.value > 0 ? 4 : 0, bar.pct)}%` }
									})
								})]
							}, bar.id))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								isAr ? "إجمالي الضريبة المحصلة:" : "Total Tax Collected:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-bold text-white tabular-nums",
									children: formatCurrency(analytics.totalTaxCollected, settings.currency, settings.language)
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								isAr ? "إجمالي الخصومات الممنوحة:" : "Total Discounts Given:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-bold text-amber-400 tabular-nums",
									children: formatCurrency(analytics.totalDiscountsGiven, settings.currency, settings.language)
								})
							] })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppCard, {
						className: "lg:col-span-5 flex flex-col justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3 border-b border-neutral-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-sm text-white",
									children: t.salesByMethod
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-neutral-400",
								children: settings.currency
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 mt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-neutral-950/70 border border-neutral-800 rounded-2xl space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "w-4 h-4 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-white block",
												children: t.bankTransfer
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] text-neutral-500",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono tabular-nums",
														children: analytics.paymentCounts.bank_transfer.count
													}),
													" ",
													isAr ? "عمليات" : "orders",
													" (",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono tabular-nums",
														children: [analytics.paymentCounts.bank_transfer.sharePercent, "%"]
													}),
													")"
												]
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-bold text-sm text-amber-400 tabular-nums",
											children: formatCurrency(analytics.paymentCounts.bank_transfer.total, settings.currency, settings.language)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-amber-500 rounded-full",
											style: { width: `${Math.max(analytics.paymentCounts.bank_transfer.total > 0 ? 5 : 0, analytics.paymentCounts.bank_transfer.sharePercent)}%` }
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-neutral-950/70 border border-neutral-800 rounded-2xl space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "w-4 h-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-white block",
												children: t.cash
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] text-neutral-500",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono tabular-nums",
														children: analytics.paymentCounts.cash.count
													}),
													" ",
													isAr ? "عمليات" : "orders",
													" (",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono tabular-nums",
														children: [analytics.paymentCounts.cash.sharePercent, "%"]
													}),
													")"
												]
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-bold text-sm text-emerald-400 tabular-nums",
											children: formatCurrency(analytics.paymentCounts.cash.total, settings.currency, settings.language)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-emerald-500 rounded-full",
											style: { width: `${Math.max(analytics.paymentCounts.cash.total > 0 ? 5 : 0, analytics.paymentCounts.cash.sharePercent)}%` }
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-neutral-950/70 border border-neutral-800 rounded-2xl space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "w-4 h-4 text-blue-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-white block",
												children: t.qrNfc
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] text-neutral-500",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono tabular-nums",
														children: analytics.paymentCounts.qr_nfc.count
													}),
													" ",
													isAr ? "عمليات" : "orders",
													" (",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono tabular-nums",
														children: [analytics.paymentCounts.qr_nfc.sharePercent, "%"]
													}),
													")"
												]
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-bold text-sm text-blue-400 tabular-nums",
											children: formatCurrency(analytics.paymentCounts.qr_nfc.total, settings.currency, settings.language)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-blue-500 rounded-full",
											style: { width: `${Math.max(analytics.paymentCounts.qr_nfc.total > 0 ? 5 : 0, analytics.paymentCounts.qr_nfc.sharePercent)}%` }
										})
									})]
								})
							]
						})] })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
					"data-testid": "exchange-rate-fluctuation-section",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-white",
								children: t.exchangeRateFluctuationBadges
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-neutral-400",
							children: isAr ? "اضغط على أي عملة لعرض شارت مسار تغير سعر الصرف مقابل الجنيه السوداني (SDG)" : "Click any currency badge to inspect its exchange rate trajectory vs SDG"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4 items-stretch",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3",
							children: rateFluctuations.map((item) => {
								const isSelected = selectedRateChartCurrency === item.currency;
								const isUp = item.direction === "up";
								const isDown = item.direction === "down";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": `rate-fluctuation-badge-${item.currency}`,
									onClick: () => {
										setSelectedRateChartCurrency(item.currency);
										setRateInputDraft(String(item.currentRate));
									},
									className: `p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2.5 ${isSelected ? "bg-neutral-900 border-amber-500 shadow-sm" : "bg-neutral-950/80 border-neutral-800 hover:border-neutral-700"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between w-full gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono font-extrabold text-xs",
													children: [item.currency, " / SDG"]
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${isUp ? "bg-amber-950/80 border-amber-700/60 text-amber-300" : isDown ? "bg-emerald-950/80 border-emerald-700/60 text-emerald-300" : "bg-neutral-900 border-neutral-700 text-neutral-300"}`,
												children: [
													isUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3 h-3 text-amber-400" }) : isDown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-3 h-3 text-emerald-400" }) : null,
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono tabular-nums",
														children: item.changePercent > 0 ? `+${item.changePercent}%` : `${item.changePercent}%`
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isUp ? isAr ? "ارتفاع" : "Surge" : isDown ? isAr ? "انخفاض" : "Drop" : isAr ? "مستقر" : "Stable" })
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline justify-between w-full",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-neutral-400 block",
													children: isAr ? "السعر الحالي" : "Current Rate"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-lg font-extrabold font-mono text-white tabular-nums",
													children: item.currentRate.toLocaleString()
												}),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-mono text-neutral-400",
													children: "SDG"
												})
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-neutral-500 block",
													children: isAr ? "السعر السابق" : "Previous"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													dir: "ltr",
													className: "text-xs font-mono text-neutral-300 tabular-nums inline-block",
													children: [item.previousRate.toLocaleString(), " SDG"]
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-end gap-1 h-7 pt-1 w-full",
											children: item.historyPoints.map((pt, idx) => {
												const minP = Math.min(...item.historyPoints) * .92;
												const maxP = Math.max(...item.historyPoints, 1);
												const heightPct = Math.max(20, Math.min(100, Math.round((pt - minP) / Math.max(1, maxP - minP) * 100)));
												const isLast = idx === item.historyPoints.length - 1;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex-1 flex flex-col items-center justify-end h-full",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `w-full rounded-t transition-all ${isLast ? "bg-amber-400" : "bg-neutral-700"}`,
														style: { height: `${heightPct}%` }
													})
												}, idx);
											})
										})
									]
								}, item.currency);
							})
						}), activeFluctuationItem && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:col-span-5 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-white block",
									children: isAr ? `شارت مسار سعر صرف (${activeFluctuationItem.currency})` : `${activeFluctuationItem.currency} Exchange Rate Trend Chart`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-neutral-400",
									children: isAr ? "مقابل الجنيه السوداني (SDG)" : "Against Sudanese Pound (SDG)"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									dir: "ltr",
									className: "text-sm font-mono font-extrabold text-amber-400 tabular-nums inline-block",
									children: [
										"1 ",
										activeFluctuationItem.currency,
										" =",
										" ",
										activeFluctuationItem.currentRate.toLocaleString(),
										" SDG"
									]
								})]
							}), (() => {
								const pts = activeFluctuationItem.historyPoints;
								const minVal = Math.min(...pts) * .95;
								const maxVal = Math.max(...pts) * 1.03;
								const range = Math.max(1, maxVal - minVal);
								const width = 320;
								const height = 130;
								const padX = 24;
								const padY = 20;
								const coords = pts.map((val, idx) => {
									return {
										x: padX + idx / Math.max(1, pts.length - 1) * 272,
										y: 110 - (val - minVal) / range * 90,
										val
									};
								});
								const polylinePoints = coords.map((c) => `${c.x},${c.y}`).join(" ");
								const areaPoints = `${coords[0].x},110 ${polylinePoints} ${coords[coords.length - 1].x},110`;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full overflow-hidden my-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
										viewBox: `0 0 ${width} ${height}`,
										className: "w-full h-36 overflow-visible",
										role: "img",
										"aria-label": `${activeFluctuationItem.currency} exchange rate chart`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
												id: "rateAreaGrad",
												x1: "0",
												y1: "0",
												x2: "0",
												y2: "1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "0%",
													stopColor: "#f59e0b",
													stopOpacity: "0.35"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "100%",
													stopColor: "#f59e0b",
													stopOpacity: "0.0"
												})]
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
												x1: padX,
												y1: padY,
												x2: 296,
												y2: padY,
												stroke: "#262626",
												strokeDasharray: "3 3"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
												x1: padX,
												y1: height / 2,
												x2: 296,
												y2: height / 2,
												stroke: "#262626",
												strokeDasharray: "3 3"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
												x1: padX,
												y1: 110,
												x2: 296,
												y2: 110,
												stroke: "#262626"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
												points: areaPoints,
												fill: "url(#rateAreaGrad)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
												fill: "none",
												stroke: "#f59e0b",
												strokeWidth: "2.5",
												strokeLinecap: "round",
												strokeLinejoin: "round",
												points: polylinePoints
											}),
											coords.map((c, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
												cx: c.x,
												cy: c.y,
												r: idx === coords.length - 1 ? 5 : 3.5,
												fill: idx === coords.length - 1 ? "#10b981" : "#f59e0b",
												stroke: "#0a0a0a",
												strokeWidth: "1.5"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
												x: c.x,
												y: c.y - 8,
												textAnchor: "middle",
												fill: idx === coords.length - 1 ? "#34d399" : "#d4d4d8",
												fontSize: "9",
												fontFamily: "monospace",
												fontWeight: "bold",
												children: c.val
											})] }, idx))
										]
									})
								});
							})()] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-neutral-800 flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-neutral-400",
									children: isAr ? "مقدار التغير عن السعر المرجعي:" : "Delta vs Previous Rate:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									dir: "ltr",
									className: `font-mono font-bold tabular-nums inline-block ${activeFluctuationItem.delta > 0 ? "text-amber-400" : activeFluctuationItem.delta < 0 ? "text-emerald-400" : "text-neutral-300"}`,
									children: [
										activeFluctuationItem.delta > 0 ? "+" : "",
										activeFluctuationItem.delta.toLocaleString(),
										" SDG (",
										activeFluctuationItem.changePercent > 0 ? "+" : "",
										activeFluctuationItem.changePercent,
										"%)"
									]
								})]
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
					"data-testid": "per-product-sales-currency-charts",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-4 h-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-sm text-white",
								children: t.productSalesAndCurrencyChart
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-neutral-400",
							children: isAr ? "يعرض لكل منتج حجم مبيعاته، حصته من الإيراد، وتغير سعره وإيراده عبر العملات" : "Displays each product sales volume, revenue share, and unit price across currencies & exchange rates"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4",
						children: analytics.productReports.map((prod) => {
							const unitsBarPct = Math.round(prod.unitsSold / maxProductUnits * 100);
							const maxPriceCompare = Math.max(1, prod.historicalUnitPriceInSdg, prod.currentUnitPriceInSdg);
							const histBarPct = Math.round(prod.historicalUnitPriceInSdg / maxPriceCompare * 100);
							const currBarPct = Math.round(prod.currentUnitPriceInSdg / maxPriceCompare * 100);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-testid": `product-report-card-${prod.productId}`,
								className: "p-4 rounded-2xl bg-neutral-950/90 border border-neutral-800 flex flex-col justify-between gap-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xl p-2 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0",
												children: prod.emoji || "📦"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-bold text-sm text-white",
												children: isAr && prod.nameAr ? prod.nameAr : prod.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-neutral-400 flex flex-wrap items-center gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono",
														children: prod.sku
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														isAr ? "المخزون:" : "Stock:",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono font-bold text-neutral-200 tabular-nums",
															children: prod.stock
														})
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-emerald-400",
														children: [
															isAr ? "هامش الربح:" : "Margin:",
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "font-mono font-bold tabular-nums",
																children: [prod.marginPercent, "%"]
															})
														]
													})
												]
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-base font-extrabold font-mono text-emerald-400 tabular-nums block",
												children: formatCurrency(prod.revenue, settings.currency, settings.language)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] text-amber-300 font-semibold",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono font-bold tabular-nums",
														children: prod.unitsSold
													}),
													" ",
													isAr ? "وحدة مباعة" : "units sold",
													" (",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono tabular-nums",
														children: [prod.revenueSharePercent, "%"]
													}),
													")"
												]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-neutral-400",
												children: isAr ? "مؤشر أداء مبيعات المنتج" : "Product Sales Volume Indicator"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-neutral-300",
												children: [
													isAr ? "صافي الربح:" : "Net Profit:",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono font-bold text-emerald-400 tabular-nums",
														children: formatCurrency(prod.netProfit, settings.currency, settings.language)
													})
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-full h-2.5 rounded-full bg-neutral-900 overflow-hidden p-0.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all",
												style: { width: `${Math.max(prod.unitsSold > 0 ? 8 : 2, unitsBarPct)}%` }
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800/90 space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] font-bold text-neutral-300",
												children: isAr ? "شارت تغير سعر بيع الوحدة حسب سعر الصرف" : "Unit Price Shift by Exchange Rate"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `text-[10px] font-bold px-1.5 py-0.5 rounded border ${prod.priceChangePercentInSdg > 0 ? "bg-amber-950/80 border-amber-700/60 text-amber-300" : prod.priceChangePercentInSdg < 0 ? "bg-emerald-950/80 border-emerald-700/60 text-emerald-300" : "bg-neutral-800 border-neutral-700 text-neutral-300"}`,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														dir: "ltr",
														className: "font-mono tabular-nums inline-block",
														children: prod.priceChangePercentInSdg > 0 ? `+${prod.priceChangePercentInSdg}%` : `${prod.priceChangePercentInSdg}%`
													}),
													" ",
													isAr ? "فرق السعر" : "Rate Shift"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5 text-[10px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-neutral-400",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "السعر بالسعر السابق:" : "At Historical Rate:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono font-semibold text-neutral-300 tabular-nums",
														children: formatCurrency(prod.historicalUnitPriceInSdg, "SDG", settings.language)
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "w-full h-1.5 rounded-full bg-neutral-950 overflow-hidden",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "h-full bg-neutral-600 rounded-full",
														style: { width: `${Math.max(10, histBarPct)}%` }
													})
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-amber-300",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "السعر بالسعر الجديد:" : "At Current Live Rate:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono font-bold text-amber-400 tabular-nums",
														children: formatCurrency(prod.currentUnitPriceInSdg, "SDG", settings.language)
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "w-full h-1.5 rounded-full bg-neutral-950 overflow-hidden",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "h-full bg-amber-500 rounded-full",
														style: { width: `${Math.max(10, currBarPct)}%` }
													})
												})]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-4 gap-1.5 pt-1",
										children: [
											"SDG",
											"USD",
											"SAR",
											"AED"
										].map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `p-1.5 rounded-lg border text-center ${settings.currency.toUpperCase() === code ? "bg-amber-500/10 border-amber-500/50" : "bg-neutral-900/60 border-neutral-800/80"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] font-mono font-bold text-neutral-400 block",
												children: code
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] font-mono font-bold text-white tabular-nums block truncate",
												children: prod.pricesByCurrency[code]?.toLocaleString("en-US", { maximumFractionDigits: 2 })
											})]
										}, code))
									})
								]
							}, prod.productId);
						})
					})]
				})
			] })
		]
	});
};
export { ReportsView };
