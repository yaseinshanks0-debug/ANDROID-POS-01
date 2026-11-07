import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { At as CirclePlus, Qt as ArrowUpRight, U as PackageCheck, bt as DollarSign, f as Truck, gt as FileText, m as TrendingUp, ot as History, p as TriangleAlert, rn as ArrowDownLeft, sn as require_react } from "./vendor-icons-DoijI_tq.js";
import { ct as getProductPricesInCurrency, n as usePOS, tt as formatCurrency } from "./POSContext-nila8oYV.js";
import { i as require_jsx_runtime } from "./vendor-motion-CekIsQM-.js";
import { _ as TactileButton, g as parseNormalizedNumber, h as normalizeNumberInput, n as AppModal, p as AppInput, v as getTranslation } from "./index-DYJDckRU.js";
import { t as AppCard } from "./AppCard-B2erL08q.js";
import { t as GoodsReceiptModal } from "./GoodsReceiptModal-DiRfRwIF.js";
// src/components/inventory/InventoryView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var InventoryView = () => {
	const { products, stockMovements, recordStockAdjustment, settings, exchangeRates } = usePOS();
	const t = getTranslation(settings.language);
	const isAr = settings.language === "ar";
	const [selectedProduct, setSelectedProduct] = (0, import_react.useState)(null);
	const [isAdjustModalOpen, setIsAdjustModalOpen] = (0, import_react.useState)(false);
	const [isGoodsReceiptOpen, setIsGoodsReceiptOpen] = (0, import_react.useState)(false);
	const [goodsReceiptProduct, setGoodsReceiptProduct] = (0, import_react.useState)(null);
	const [movementType, setMovementType] = (0, import_react.useState)("restock");
	const [amountInput, setAmountInput] = (0, import_react.useState)("10");
	const [reasonInput, setReasonInput] = (0, import_react.useState)("");
	const valuation = (0, import_react.useMemo)(() => {
		let totalCost = 0;
		let potentialRev = 0;
		let lowStockCount = 0;
		products.forEach((p) => {
			const converted = getProductPricesInCurrency(p, settings.currency, exchangeRates);
			totalCost += converted.costPrice * p.stock;
			potentialRev += converted.sellingPrice * p.stock;
			if (p.stock <= p.minStockAlert) lowStockCount += 1;
		});
		return {
			cost: Math.round(totalCost * 100) / 100,
			revenue: Math.round(potentialRev * 100) / 100,
			lowStockCount
		};
	}, [
		products,
		settings.currency,
		exchangeRates
	]);
	const openAdjustment = (product) => {
		setSelectedProduct(product);
		setMovementType("restock");
		setAmountInput("10");
		setReasonInput("Weekly supplier restock batch");
		setIsAdjustModalOpen(true);
	};
	const openGoodsReceipt = (product) => {
		setGoodsReceiptProduct(product || null);
		setIsGoodsReceiptOpen(true);
	};
	const handleApplyAdjustment = (e) => {
		e.preventDefault();
		if (!selectedProduct) return;
		const amount = parseNormalizedNumber(amountInput, 0);
		if (amount <= 0 && movementType !== "audit") return;
		recordStockAdjustment(selectedProduct.id, movementType, amount, reasonInput);
		setIsAdjustModalOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl sm:text-2xl font-extrabold text-white tracking-tight",
					children: t.inventoryManagement
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-neutral-400",
					children: isAr ? "إدارة المخزون، استلام فواتير المشتريات والبضائع، وسجل الحركات المباشر" : "Real-time multi-SKU inventory tracking, goods receipt & audit logs"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						variant: "emerald",
						size: "sm",
						"data-testid": "inventory-open-goods-receipt-btn",
						onClick: () => openGoodsReceipt(),
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "w-4 h-4" }),
						children: t.receiveSupplierGoodsBtn
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-neutral-400",
								children: t.totalAssetValue
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-4 h-4 text-emerald-400" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold font-mono text-white tabular-nums",
							children: formatCurrency(valuation.cost, settings.currency, settings.language)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-neutral-500",
							children: isAr ? "بناءً على سعر التكلفة للوحدة" : "Based on unit cost price"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-neutral-400",
								children: t.potentialRevenue
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-amber-400" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold font-mono text-amber-400 tabular-nums",
							children: formatCurrency(valuation.revenue, settings.currency, settings.language)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-neutral-500",
							children: isAr ? "الإيراد التقديري عند بيع المخزون" : "Estimated retail liquidation"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: valuation.lowStockCount > 0 ? "border-amber-500/50 bg-amber-950/20" : "",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-neutral-400",
									children: t.lowStockAlerts
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 text-rose-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-2xl font-bold text-white",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono tabular-nums",
										children: valuation.lowStockCount
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-normal text-neutral-400",
										children: isAr ? "أصناف" : "items"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-neutral-500",
								children: isAr ? "أصناف وصلت لحد التنبيه" : "Threshold alert triggers"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between pb-3 border-b border-neutral-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-sm text-white",
						children: isAr ? "مستويات المخزون حسب المنتج" : "Stock Levels by Product"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-neutral-500",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono tabular-nums",
							children: products.length
						}),
						" ",
						isAr ? "صنف مسجل" : "catalog items"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-neutral-800/80 mt-1",
				children: products.map((p) => {
					const isLow = p.stock <= p.minStockAlert;
					const isOut = p.stock <= 0;
					const productImg = p.image || p.imageUrl || p.customFields?.image;
					const converted = getProductPricesInCurrency(p, settings.currency, exchangeRates);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [productImg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700/60 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: productImg,
									alt: p.name,
									className: "w-full h-full object-cover"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xl p-2 rounded-xl bg-neutral-800 border border-neutral-700/60",
								children: p.emoji || "📦"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold text-sm text-white",
								children: isAr && p.nameAr ? p.nameAr : p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-neutral-400 flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: p.sku
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										isAr ? "الشراء:" : "Cost:",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono tabular-nums",
											children: formatCurrency(converted.costPrice, settings.currency, settings.language)
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-emerald-400",
										children: [
											isAr ? "البيع:" : "Sell:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono tabular-nums",
												children: formatCurrency(converted.sellingPrice, settings.currency, settings.language)
											})
										]
									})
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between sm:justify-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `text-sm font-bold ${isOut ? "text-rose-400" : isLow ? "text-amber-400" : "text-emerald-400"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono tabular-nums",
											children: p.stock
										}),
										" ",
										isAr ? "وحدة" : "units"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[10px] text-neutral-500",
									children: isOut ? t.outOfStock : isLow ? t.lowStock : t.inStock
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
									variant: "secondary",
									size: "sm",
									onClick: () => openGoodsReceipt(p),
									leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "w-3.5 h-3.5 text-emerald-400" }),
									children: isAr ? "استلام بضاعة" : "Receive Goods"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
									variant: "secondary",
									size: "sm",
									onClick: () => openAdjustment(p),
									leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "w-3.5 h-3.5" }),
									children: t.adjustStock
								})]
							})]
						})]
					}, p.id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between pb-3 border-b border-neutral-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-4 h-4 text-purple-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-sm text-white",
						children: t.movementHistory
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-neutral-500",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono tabular-nums",
							children: stockMovements.length
						}),
						" ",
						isAr ? "سجل حركة" : "audit records"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-neutral-800/80 mt-1 max-h-80 overflow-y-auto pr-1",
				children: stockMovements.map((mov) => {
					const isPositive = mov.quantityChange >= 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-2.5 flex items-center justify-between gap-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `w-7 h-7 rounded-lg flex items-center justify-center font-bold shrink-0 ${isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`,
								children: isPositive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownLeft, { className: "w-4 h-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-white",
										children: mov.productName
									}),
									mov.receiptMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 flex items-center gap-1",
										children: [mov.receiptMode === "invoice_only" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-2.5 h-2.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "w-2.5 h-2.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: mov.receiptMode === "goods_and_invoice" ? isAr ? "استلام بضاعة وفاتورة" : "Goods & Invoice" : mov.receiptMode === "goods_only" ? isAr ? "استلام بضاعة فقط" : "Goods Only" : isAr ? "استلام فاتورة فقط" : "Invoice Only" })]
									}),
									mov.invoiceNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-amber-300 border border-neutral-800",
										children: mov.invoiceNumber
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-neutral-500 text-[11px] block",
								children: [
									mov.reason,
									" •",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: new Date(mov.timestamp).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit"
										})
									})
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `font-mono font-bold tabular-nums ${isPositive ? "text-emerald-400" : "text-rose-400"}`,
								children: mov.quantityChange > 0 ? `+${mov.quantityChange}` : mov.quantityChange
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-[10px] font-mono text-neutral-500",
								children: [
									mov.previousStock,
									" → ",
									mov.newStock
								]
							})]
						})]
					}, mov.id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoodsReceiptModal, {
				isOpen: isGoodsReceiptOpen,
				onClose: () => setIsGoodsReceiptOpen(false),
				initialProduct: goodsReceiptProduct
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
				isOpen: isAdjustModalOpen,
				onClose: () => setIsAdjustModalOpen(false),
				title: t.adjustStock,
				description: selectedProduct ? `${selectedProduct.name} (Current Stock: ${selectedProduct.stock})` : "",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleApplyAdjustment,
					className: "flex flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-neutral-300 block mb-1.5",
							children: t.movementType
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [
								{
									id: "restock",
									label: t.restock,
									color: "text-emerald-400"
								},
								{
									id: "damage",
									label: t.damage,
									color: "text-rose-400"
								},
								{
									id: "loss",
									label: t.loss,
									color: "text-amber-400"
								},
								{
									id: "audit",
									label: t.audit,
									color: "text-blue-400"
								}
							].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMovementType(m.id),
								className: `p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${movementType === m.id ? "bg-neutral-800 border-amber-500 text-white" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: m.color,
									children: m.label
								})
							}, m.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
							label: movementType === "audit" ? "New Exact Stock Level" : t.quantityDelta,
							type: "text",
							inputMode: "numeric",
							dir: "ltr",
							value: amountInput,
							onChange: (e) => setAmountInput(normalizeNumberInput(e.target.value)),
							required: true,
							autoFocus: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
							label: t.reason,
							value: reasonInput,
							onChange: (e) => setReasonInput(e.target.value),
							placeholder: "e.g. Broken in transit, supplier delivery"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2 pt-3 border-t border-neutral-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								variant: "ghost",
								type: "button",
								onClick: () => setIsAdjustModalOpen(false),
								children: t.cancel
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								variant: "amber",
								type: "submit",
								children: t.saveAdjustment
							})]
						})
					]
				})
			})
		]
	});
};
export { InventoryView };
