import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { Gt as Building2, Tt as Coins, U as PackageCheck, f as Truck, gt as FileText, jt as CircleCheck, sn as require_react, st as Hash } from "./vendor-icons-DoijI_tq.js";
import { et as convertCurrencyAmount, n as usePOS, tt as formatCurrency } from "./POSContext-nila8oYV.js";
import { i as require_jsx_runtime } from "./vendor-motion-CekIsQM-.js";
import { _ as TactileButton, g as parseNormalizedNumber, h as normalizeNumberInput, n as AppModal, p as AppInput, v as getTranslation } from "./index-DYJDckRU.js";
// src/components/inventory/GoodsReceiptModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var GoodsReceiptModal = ({ isOpen, onClose, initialProduct }) => {
	const { products, recordGoodsReceipt, settings, currencies, exchangeRates } = usePOS();
	const t = getTranslation(settings.language);
	const isAr = settings.language === "ar";
	const [receiptMode, setReceiptMode] = (0, import_react.useState)("goods_and_invoice");
	const [selectedProductId, setSelectedProductId] = (0, import_react.useState)("");
	const [quantityInput, setQuantityInput] = (0, import_react.useState)("10");
	const [receiptCurrency, setReceiptCurrency] = (0, import_react.useState)(settings.currency || "SDG");
	const [unitCostInput, setUnitCostInput] = (0, import_react.useState)("");
	const [updateProductCost, setUpdateProductCost] = (0, import_react.useState)(true);
	const [invoiceNumber, setInvoiceNumber] = (0, import_react.useState)("");
	const [supplierName, setSupplierName] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const activeCurrencyCodes = currencies && currencies.length > 0 ? currencies.filter((c) => c.isActive !== false).map((c) => c.code.toUpperCase()) : [
		"SDG",
		"USD",
		"SAR",
		"AED",
		"EUR",
		"GBP"
	];
	const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0] || null;
	(0, import_react.useEffect)(() => {
		if (isOpen) {
			const targetProd = initialProduct || products[0] || null;
			setSelectedProductId(targetProd?.id || "");
			setReceiptMode("goods_and_invoice");
			setQuantityInput("15");
			setReceiptCurrency(settings.currency || "SDG");
			if (targetProd) {
				const prodCurr = (targetProd.priceCurrency || targetProd.customFields?.priceCurrency || "SDG").toString().toUpperCase();
				const convertedCost = convertCurrencyAmount(targetProd.costPrice, prodCurr, settings.currency || "SDG", exchangeRates);
				setUnitCostInput(String(convertedCost));
			} else setUnitCostInput("");
			setUpdateProductCost(true);
			setInvoiceNumber(`INV-${Math.floor(1e3 + Math.random() * 9e3)}`);
			setSupplierName("");
			setNotes("");
		}
	}, [
		isOpen,
		initialProduct,
		products,
		settings.currency,
		exchangeRates
	]);
	const handleProductChange = (prodId) => {
		setSelectedProductId(prodId);
		const prod = products.find((p) => p.id === prodId);
		if (prod) {
			const prodCurr = (prod.priceCurrency || prod.customFields?.priceCurrency || "SDG").toString().toUpperCase();
			const convertedCost = convertCurrencyAmount(prod.costPrice, prodCurr, receiptCurrency, exchangeRates);
			setUnitCostInput(String(convertedCost));
		}
	};
	const handleCurrencyChange = (nextCurr) => {
		const prevCurr = receiptCurrency;
		setReceiptCurrency(nextCurr);
		const currentVal = parseNormalizedNumber(unitCostInput, 0);
		if (currentVal > 0) {
			const converted = convertCurrencyAmount(currentVal, prevCurr, nextCurr, exchangeRates);
			setUnitCostInput(String(converted));
		}
	};
	const qtyNum = Math.max(0, Math.round(parseNormalizedNumber(quantityInput, 0)));
	const unitCostNum = Math.max(0, parseNormalizedNumber(unitCostInput, 0));
	const totalInvoiceValue = Math.round(qtyNum * unitCostNum * 100) / 100;
	const totalInStoreCurrency = convertCurrencyAmount(totalInvoiceValue, receiptCurrency, settings.currency, exchangeRates);
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!selectedProduct || qtyNum <= 0) return;
		if (recordGoodsReceipt({
			productId: selectedProduct.id,
			quantity: qtyNum,
			receiptMode,
			supplierName: supplierName.trim() || void 0,
			invoiceNumber: invoiceNumber.trim() || void 0,
			unitCost: unitCostNum > 0 ? unitCostNum : void 0,
			currency: receiptCurrency,
			updateProductCost,
			notes: notes.trim() || void 0
		})) onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
		isOpen,
		onClose,
		title: t.receiveSupplierGoodsBtn,
		description: isAr ? "تسجيل استلام فاتورة مشتريات أو استلام بضاعة للمخزون مع تحديث الكميات والتكلفة حسب سعر الصرف" : "Record a supplier invoice or goods receipt with automatic stock and multi-currency cost updates",
		maxWidth: "lg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs font-bold text-neutral-300 block",
						children: isAr ? "نوع الاستلام" : "Receipt Mode"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "goods-receipt-mode-both",
								onClick: () => setReceiptMode("goods_and_invoice"),
								className: `p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${receiptMode === "goods_and_invoice" ? "bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-xs" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "w-4 h-4 shrink-0 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "استلام بضاعة وفاتورة" : "Goods & Invoice" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "goods-receipt-mode-goods",
								onClick: () => setReceiptMode("goods_only"),
								className: `p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${receiptMode === "goods_only" ? "bg-amber-500/15 border-amber-500 text-amber-300 shadow-xs" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "w-4 h-4 shrink-0 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "استلام بضاعة فقط" : "Goods Receipt Only" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "goods-receipt-mode-invoice",
								onClick: () => setReceiptMode("invoice_only"),
								className: `p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${receiptMode === "invoice_only" ? "bg-blue-500/15 border-blue-500 text-blue-300 shadow-xs" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 shrink-0 text-blue-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "استلام فاتورة فقط" : "Invoice Only" })]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-neutral-300 block mb-1.5",
							children: t.productName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: selectedProduct?.id || "",
							onChange: (e) => handleProductChange(e.target.value),
							"aria-label": t.productName,
							className: "w-full min-h-[42px] px-3 py-2 bg-neutral-900 border border-neutral-750 text-white rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500",
							children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: p.id,
								children: [
									isAr && p.nameAr ? p.nameAr : p.name,
									" (",
									p.sku,
									") — ",
									isAr ? "المخزون:" : "Stock:",
									" ",
									p.stock
								]
							}, p.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
						label: isAr ? "الكمية المستلمة" : "Quantity",
						type: "text",
						inputMode: "numeric",
						dir: "ltr",
						"data-testid": "goods-receipt-qty-input",
						value: quantityInput,
						onChange: (e) => setQuantityInput(normalizeNumberInput(e.target.value)),
						required: true
					}) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3.5 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-bold text-neutral-300 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "عملة الفاتورة وسعر الشراء" : "Invoice Currency & Unit Cost" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1",
								children: activeCurrencyCodes.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleCurrencyChange(code),
									className: `px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-all ${receiptCurrency === code ? "bg-amber-500 text-neutral-950 border-amber-400" : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"}`,
									children: code
								}, code))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3 items-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
								label: `${isAr ? "سعر الشراء للوحدة" : "Unit Cost Price"} (${receiptCurrency})`,
								type: "text",
								inputMode: "decimal",
								dir: "ltr",
								value: unitCostInput,
								onChange: (e) => setUnitCostInput(normalizeNumberInput(e.target.value)),
								placeholder: "0.00"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-neutral-400 block",
									children: isAr ? "إجمالي قيمة الاستلام" : "Total Receipt Value"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-mono font-extrabold text-amber-400 tabular-nums",
									children: formatCurrency(totalInvoiceValue, receiptCurrency, settings.language)
								})] }), receiptCurrency !== settings.currency && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-neutral-500 block",
										children: isAr ? "بعمـلة المتجر" : "In Store Currency"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-mono font-bold text-emerald-400 tabular-nums",
										children: formatCurrency(totalInStoreCurrency, settings.currency, settings.language)
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-xs text-neutral-300 cursor-pointer select-none pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: updateProductCost,
								onChange: (e) => setUpdateProductCost(e.target.checked),
								className: "rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-amber-500"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تحديث سعر التكلفة الأساسي للمنتج تلقائياً حسب سعر الصرف الحالي" : "Automatically update product unit cost price using current exchange rate" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
						label: isAr ? "رقم فاتورة المشتريات / الاستلام" : "Invoice / Receipt Reference #",
						dir: "ltr",
						value: invoiceNumber,
						onChange: (e) => setInvoiceNumber(e.target.value),
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "w-3.5 h-3.5 text-amber-400" }),
						placeholder: "INV-2026-001"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
						label: isAr ? "اسم المورد / الجهة" : "Supplier Name",
						value: supplierName,
						onChange: (e) => setSupplierName(e.target.value),
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-3.5 h-3.5 text-neutral-400" }),
						placeholder: isAr ? "مثال: شركة النيلين للتوريد" : "e.g. Global Roasters Co."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
					label: t.reason,
					value: notes,
					onChange: (e) => setNotes(e.target.value),
					placeholder: isAr ? "ملاحظات إضافية حول حالة البضاعة أو الفاتورة..." : "Optional notes about goods condition or delivery..."
				}),
				selectedProduct && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-emerald-300 font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: receiptMode === "invoice_only" ? isAr ? "سيتم تسجيل الفاتورة فقط دون زيادة المخزون حتى وصول البضاعة" : "Invoice will be logged; stock remains unchanged until goods arrive" : isAr ? "سيتم إضافة الكمية المستلمة مباشرة إلى مخزون المنتج" : "Received quantity will be added immediately to product stock" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono font-bold text-white tabular-nums shrink-0",
						children: [
							selectedProduct.stock,
							" →",
							" ",
							receiptMode === "invoice_only" ? selectedProduct.stock : selectedProduct.stock + qtyNum
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-2 pt-2 border-t border-neutral-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						type: "button",
						variant: "ghost",
						onClick: onClose,
						children: t.cancel
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						type: "submit",
						variant: "emerald",
						"data-testid": "goods-receipt-submit-btn",
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "w-4 h-4" }),
						children: isAr ? "تأكيد وحفظ الاستلام" : "Confirm Receipt"
					})]
				})
			]
		})
	});
};
export { GoodsReceiptModal as t };
