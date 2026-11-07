import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { $t as ArrowRight, At as CirclePlus, B as Package, M as Receipt, Wt as Calendar, Zt as Award, bt as DollarSign, m as TrendingUp, on as Activity, p as TriangleAlert, sn as require_react, tt as Layers } from "./vendor-icons-DoijI_tq.js";
import { Z as computeDailyRevenueTrends, n as usePOS, ot as getConvertedTransactionView, tt as formatCurrency } from "./POSContext-nila8oYV.js";
import { i as require_jsx_runtime } from "./vendor-motion-CekIsQM-.js";
import { _ as TactileButton, t as ReceiptModal, v as getTranslation } from "./index-DYJDckRU.js";
import { t as AppCard } from "./AppCard-B2erL08q.js";
import { a as point, i as linear, n as area_default, o as max, r as line_default, t as monotoneX } from "./vendor-d3-C9FAD5n0.js";
// src/components/ui/ScrambleText.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var CIPHER_CHARS = "!<>-_\\/[]{}—=+*^?#________";
var ScrambleText = ({ text, speed = 30, scrambleLoops = 2, className = "", trigger }) => {
	const [displayText, setDisplayText] = (0, import_react.useState)(text);
	const frameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let iteration = 0;
		const maxIterations = text.length + scrambleLoops;
		let timer = null;
		timer = setInterval(() => {
			setDisplayText(() => {
				return text.split("").map((char, index) => {
					if (char === " ") return " ";
					if (index < iteration - scrambleLoops) return text[index];
					return CIPHER_CHARS[Math.floor(Math.random() * 26)];
				}).join("");
			});
			iteration += 1;
			if (iteration > maxIterations) {
				setDisplayText(text);
				if (timer) clearInterval(timer);
			}
		}, speed);
		return () => {
			if (timer) clearInterval(timer);
			if (frameRef.current) cancelAnimationFrame(frameRef.current);
		};
	}, [
		text,
		speed,
		scrambleLoops,
		trigger
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-block font-mono tracking-tight ${className}`,
		children: displayText
	});
};
// src/components/dashboard/DashboardView.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var DashboardView = () => {
	const { transactions, products, settings, exchangeRates, setActiveTab } = usePOS();
	const t = getTranslation(settings.language);
	const isAr = settings.language === "ar";
	const [selectedTxn, setSelectedTxn] = (0, import_react.useState)(null);
	const [rangeDays, setRangeDays] = (0, import_react.useState)(7);
	const [showCollectedCurve, setShowCollectedCurve] = (0, import_react.useState)(true);
	const [activePointKey, setActivePointKey] = (0, import_react.useState)(null);
	const todayMetrics = (0, import_react.useMemo)(() => {
		const today = (/* @__PURE__ */ new Date()).toDateString();
		const todayTxns = transactions.filter((tx) => new Date(tx.timestamp).toDateString() === today && tx.status === "completed");
		const todayGross = todayTxns.reduce((acc, curr) => {
			return acc + getConvertedTransactionView(curr, settings.currency, exchangeRates, "historical").grandTotal;
		}, 0);
		const lowStockCount = products.filter((p) => p.stock <= p.minStockAlert).length;
		return {
			salesTotal: Math.round(todayGross * 100) / 100,
			txCount: todayTxns.length,
			totalProducts: products.length,
			lowStockCount,
			recentTxns: transactions.slice(0, 5)
		};
	}, [
		transactions,
		products,
		settings.currency,
		exchangeRates
	]);
	const trendSummary = (0, import_react.useMemo)(() => {
		return computeDailyRevenueTrends(transactions, rangeDays, settings.currency, exchangeRates, "historical", settings.language);
	}, [
		transactions,
		rangeDays,
		settings.currency,
		exchangeRates,
		settings.language
	]);
	const chartGeometry = (0, import_react.useMemo)(() => {
		const width = 1080;
		const height = 235;
		const margin = {
			top: 34,
			right: 32,
			bottom: 34,
			left: 54
		};
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;
		const points = trendSummary.points;
		const domainKeys = points.map((p) => p.dateKey);
		const xScale = point().domain(domainKeys).range([0, innerWidth]).padding(.12);
		const maxRev = max(points, (d) => Math.max(d.revenue, d.collected)) || 0;
		const yMax = maxRev > 0 ? maxRev * 1.22 : 100;
		const yScale = linear().domain([0, yMax]).nice(4).range([innerHeight, 0]);
		const revenueLineGen = line_default().x((d) => xScale(d.dateKey) ?? 0).y((d) => yScale(d.revenue)).curve(monotoneX);
		const revenueAreaGen = area_default().x((d) => xScale(d.dateKey) ?? 0).y0(innerHeight).y1((d) => yScale(d.revenue)).curve(monotoneX);
		const collectedLineGen = line_default().x((d) => xScale(d.dateKey) ?? 0).y((d) => yScale(d.collected)).curve(monotoneX);
		const revenueLinePath = revenueLineGen(points) || "";
		const revenueAreaPath = revenueAreaGen(points) || "";
		const collectedLinePath = collectedLineGen(points) || "";
		const yTicks = yScale.ticks(4);
		const avgY = yScale(trendSummary.averageDailyRevenue);
		const labelStep = points.length > 16 ? 4 : points.length > 9 ? 2 : 1;
		return {
			width,
			height,
			margin,
			innerWidth,
			innerHeight,
			revenueLinePath,
			revenueAreaPath,
			collectedLinePath,
			yTicks,
			yScale,
			avgY,
			plottedPoints: points.map((pt, idx) => ({
				...pt,
				x: xScale(pt.dateKey) ?? 0,
				y: yScale(pt.revenue),
				collectedY: yScale(pt.collected),
				showXLabel: idx % labelStep === 0 || idx === points.length - 1 || pt.isPeak
			}))
		};
	}, [trendSummary]);
	const inspectedPoint = (0, import_react.useMemo)(() => {
		if (activePointKey) {
			const match = trendSummary.points.find((p) => p.dateKey === activePointKey);
			if (match) return match;
		}
		return trendSummary.peakPoint || trendSummary.points[trendSummary.points.length - 1] || null;
	}, [activePointKey, trendSummary]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 p-5 rounded-3xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-amber-400 uppercase tracking-widest",
							children: "POS Terminal 01"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-neutral-600",
							children: "/"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-neutral-400 font-mono",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrambleText, {
								text: "SYSTEM ACTIVE",
								speed: 25
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-extrabold text-white tracking-tight",
					children: isAr ? settings.storeNameAr : settings.storeName
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						variant: "amber",
						size: "md",
						onClick: () => setActiveTab("checkout"),
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "w-4 h-4" }),
						children: t.newSale
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-neutral-400",
								children: t.todaySales
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "w-4 h-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight tabular-nums",
							children: formatCurrency(todayMetrics.salesTotal, settings.currency, settings.language)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] text-neutral-500 font-medium mt-1 block",
							children: [
								todayMetrics.txCount,
								" ",
								t.completed.toLowerCase()
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-neutral-400",
								children: t.todayTransactions
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight tabular-nums",
							children: todayMetrics.txCount
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-neutral-500 font-medium mt-1 block",
							children: isAr ? "مقيّدة في السجل المحلي" : "Audited in local journal"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-neutral-400",
								children: t.totalProducts
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "w-4 h-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight tabular-nums",
							children: todayMetrics.totalProducts
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-neutral-500 font-medium mt-1 block",
							children: isAr ? "ضمن التصنيفات النشطة" : "Across active categories"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: `flex flex-col justify-between ${todayMetrics.lowStockCount > 0 ? "border-amber-500/50 bg-amber-950/20" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-neutral-400",
								children: t.lowStockAlerts
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `text-2xl sm:text-3xl font-extrabold font-mono tracking-tight tabular-nums ${todayMetrics.lowStockCount > 0 ? "text-amber-400" : "text-neutral-400"}`,
							children: todayMetrics.lowStockCount
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-neutral-500 font-medium mt-1 block",
							children: isAr ? "تتطلب إعادة التزويد" : "Requires restock action"
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
				"data-testid": "dashboard-revenue-chart-card",
				className: "space-y-4 border-neutral-800 bg-neutral-900/95",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-neutral-800",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-extrabold text-white tracking-tight",
								children: isAr ? "اتجاهات الإيرادات اليومية وذروة الأداء" : "Daily Revenue Trends & Performance Peaks"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-neutral-400",
								children: isAr ? `منحنى D3.js التفاعلي للمبيعات اليومية (${settings.currency}) محسوباً بسعر الصرف المحفوظ لكل فاتورة` : `Interactive D3.js daily revenue trajectory (${settings.currency}) valued at each invoice's saved exchange rate`
							})] })]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "toggle-collected-curve-btn",
								onClick: () => setShowCollectedCurve((prev) => !prev),
								className: `px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${showCollectedCurve ? "bg-sky-950/60 border-sky-500/40 text-sky-300" : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${showCollectedCurve ? "bg-sky-400" : "bg-neutral-600"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "المبيعات المحصلة" : "Collected Cash" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-flex items-center rounded-xl bg-neutral-950 p-1 border border-neutral-800",
								children: [
									7,
									14,
									30
								].map((days) => {
									const isSelected = rangeDays === days;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"data-testid": `chart-range-${days}d`,
										onClick: () => {
											setRangeDays(days);
											setActivePointKey(null);
										},
										className: `px-3 py-1 rounded-lg text-xs font-bold transition-all ${isSelected ? "bg-amber-500 text-neutral-950 shadow-sm" : "text-neutral-400 hover:text-white"}`,
										children: isAr ? `${days} يوم` : `${days}D`
									}, days);
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-testid": "dashboard-peak-revenue-badge",
								className: "p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "ذروة الأداء (أعلى يوم)" : "Peak Performance Day" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-extrabold text-white tabular-nums mt-1",
										children: formatCurrency(trendSummary.peakPoint?.revenue || 0, settings.currency, settings.language)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-amber-300/80 font-medium mt-0.5",
										children: trendSummary.peakPoint ? `${trendSummary.peakPoint.weekdayLabel} • ${trendSummary.peakPoint.label} (${trendSummary.peakPoint.transactionCount} ${isAr ? trendSummary.peakPoint.transactionCount === 1 ? "فاتورة" : "فواتير" : trendSummary.peakPoint.transactionCount === 1 ? "order" : "orders"})` : isAr ? "لا توجد مبيعات في هذه الفترة" : "No sales in period"
									})
								] }), trendSummary.peakPoint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setActivePointKey(trendSummary.peakPoint?.dateKey || null),
									className: "px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-[11px] font-bold text-amber-300 transition-colors shrink-0",
									children: isAr ? "تحديد الذروة" : "Focus Peak"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								"data-testid": "dashboard-avg-revenue-badge",
								className: "p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between gap-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3.5 h-3.5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "المتوسط اليومي" : "Daily Average" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-extrabold text-emerald-400 tabular-nums mt-1",
										children: formatCurrency(trendSummary.averageDailyRevenue, settings.currency, settings.language)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-neutral-500 font-medium mt-0.5",
										children: [
											isAr ? "متوسط الأيام النشطة:" : "Active days avg:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-neutral-300 tabular-nums",
												children: formatCurrency(trendSummary.activeDaysAverageRevenue, settings.currency, settings.language)
											})
										]
									})
								] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-testid": "dashboard-period-total-badge",
								className: "p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5 text-sky-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? `إجمالي إيرادات (${rangeDays} يوم)` : `Period Total (${rangeDays}D)` })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-lg font-extrabold text-white tabular-nums mt-1",
										children: formatCurrency(trendSummary.totalRevenue, settings.currency, settings.language)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-neutral-500 font-medium mt-0.5",
										children: [
											trendSummary.totalTransactions,
											" ",
											isAr ? "عملية مكتملة" : "completed transactions"
										]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `px-2.5 py-1 rounded-xl text-xs font-extrabold tabular-nums border ${trendSummary.growthPercent >= 0 ? "bg-emerald-950/60 border-emerald-500/30 text-emerald-400" : "bg-rose-950/60 border-rose-500/30 text-rose-400"}`,
									children: [
										trendSummary.growthPercent >= 0 ? "+" : "",
										trendSummary.growthPercent,
										"%"
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative rounded-2xl bg-neutral-950/90 border border-neutral-800/90 p-3 sm:p-4 overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							"data-testid": "d3-revenue-line-chart",
							viewBox: `0 0 ${chartGeometry.width} ${chartGeometry.height}`,
							className: "w-full h-auto overflow-visible select-none",
							role: "img",
							"aria-label": isAr ? "مخطط خطي لاتجاهات الإيرادات اليومية وذروة الأداء" : "Daily revenue trends and performance peaks line chart",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "d3RevenueAreaGradient",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "#10b981",
										stopOpacity: "0.38"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "65%",
										stopColor: "#10b981",
										stopOpacity: "0.08"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "#10b981",
										stopOpacity: "0.0"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "d3RevenueStrokeGradient",
								x1: "0",
								y1: "0",
								x2: "1",
								y2: "0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "#34d399"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "50%",
										stopColor: "#10b981"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "#f59e0b"
									})
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								transform: `translate(${chartGeometry.margin.left}, ${chartGeometry.margin.top})`,
								children: [
									chartGeometry.yTicks.map((tickVal) => {
										const yPos = chartGeometry.yScale(tickVal);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
											transform: `translate(0, ${yPos})`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
												x1: 0,
												x2: chartGeometry.innerWidth,
												stroke: "#262626",
												strokeDasharray: "4 4",
												strokeWidth: 1
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
												x: -10,
												y: 4,
												textAnchor: "end",
												direction: "ltr",
												className: "fill-neutral-500 text-[10px] font-semibold tabular-nums",
												children: tickVal >= 1e3 ? `${(tickVal / 1e3).toFixed(1)}k` : tickVal.toFixed(0)
											})]
										}, `ytick-${tickVal}`);
									}),
									trendSummary.averageDailyRevenue > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
										transform: `translate(0, ${chartGeometry.avgY})`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
												x1: 0,
												x2: chartGeometry.innerWidth,
												stroke: "#f59e0b",
												strokeOpacity: .45,
												strokeDasharray: "6 4",
												strokeWidth: 1.25
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
												x: 8,
												y: -18,
												width: 78,
												height: 15,
												rx: 4,
												fill: "#171717",
												stroke: "#f59e0b",
												strokeOpacity: .4
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
												x: 47,
												y: -7,
												textAnchor: "middle",
												className: "fill-amber-400 text-[9px] font-bold",
												children: isAr ? "المتوسط اليومي" : "DAILY AVG"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										"data-testid": "d3-revenue-area-path",
										d: chartGeometry.revenueAreaPath,
										fill: "url(#d3RevenueAreaGradient)"
									}),
									showCollectedCurve && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										"data-testid": "d3-collected-line-path",
										d: chartGeometry.collectedLinePath,
										fill: "none",
										stroke: "#38bdf8",
										strokeWidth: 2,
										strokeDasharray: "5 3",
										strokeLinecap: "round",
										opacity: .85
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										"data-testid": "d3-revenue-line-path",
										d: chartGeometry.revenueLinePath,
										fill: "none",
										stroke: "url(#d3RevenueStrokeGradient)",
										strokeWidth: 3,
										strokeLinecap: "round",
										strokeLinejoin: "round"
									}),
									chartGeometry.plottedPoints.map((pt) => {
										const isSelected = inspectedPoint?.dateKey === pt.dateKey;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
											"data-testid": `chart-point-${pt.dateKey}`,
											transform: `translate(${pt.x}, 0)`,
											className: "cursor-pointer group",
											onMouseEnter: () => setActivePointKey(pt.dateKey),
											onClick: () => setActivePointKey(pt.dateKey),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: 0,
													x2: 0,
													y1: 0,
													y2: chartGeometry.innerHeight,
													stroke: pt.isPeak ? "#f59e0b" : isSelected ? "#10b981" : "transparent",
													strokeOpacity: pt.isPeak || isSelected ? .35 : 0,
													strokeDasharray: "3 3",
													strokeWidth: 1.5
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: -16,
													y: 0,
													width: 32,
													height: chartGeometry.innerHeight + 28,
													fill: "transparent"
												}),
												showCollectedCurve && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
													cx: 0,
													cy: pt.collectedY,
													r: isSelected ? 4 : 2.5,
													fill: "#0284c7",
													stroke: "#bae6fd",
													strokeWidth: 1.5
												}),
												pt.isPeak && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
													transform: `translate(0, ${pt.y})`,
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
															cx: 0,
															cy: 0,
															r: 11,
															fill: "#f59e0b",
															fillOpacity: .22
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
															x: -34,
															y: -28,
															width: 68,
															height: 18,
															rx: 6,
															fill: "#451a03",
															stroke: "#f59e0b",
															strokeWidth: 1.2
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
															x: 0,
															y: -16,
															textAnchor: "middle",
															className: "fill-amber-300 text-[9px] font-extrabold tracking-wide",
															children: isAr ? "★ الذروة" : "★ PEAK"
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
													cx: 0,
													cy: pt.y,
													r: pt.isPeak ? 6.5 : isSelected ? 5.5 : 4,
													fill: pt.isPeak ? "#f59e0b" : isSelected ? "#10b981" : "#064e3b",
													stroke: pt.isPeak ? "#fef3c7" : "#34d399",
													strokeWidth: pt.isPeak || isSelected ? 2.5 : 2
												}),
												pt.showXLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: 0,
													y: chartGeometry.innerHeight + 22,
													textAnchor: "middle",
													className: `text-[10px] tabular-nums transition-colors ${pt.isPeak ? "fill-amber-400 font-extrabold" : isSelected ? "fill-emerald-400 font-bold" : "fill-neutral-400 font-medium"}`,
													children: pt.label
												})
											]
										}, pt.dateKey);
									})
								]
							})]
						})
					}),
					inspectedPoint && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-testid": "dashboard-chart-inspector",
						className: "p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${inspectedPoint.isPeak ? "bg-amber-500/20 border border-amber-500/40 text-amber-300" : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"}`,
								children: inspectedPoint.isPeak ? "★" : inspectedPoint.transactionCount
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-extrabold text-white",
										children: [
											inspectedPoint.weekdayLabel,
											" • ",
											inspectedPoint.label
										]
									}),
									inspectedPoint.isPeak && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30",
										children: isAr ? "ذروة المبيعات" : "Performance Peak"
									}),
									inspectedPoint.isToday && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300",
										children: isAr ? "اليوم" : "Today"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-neutral-400 block mt-0.5",
								children: [
									inspectedPoint.transactionCount,
									" ",
									isAr ? "فواتير مكتملة" : "completed orders",
									" •",
									" ",
									isAr ? "متوسط الفاتورة:" : "Avg order:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-neutral-200 tabular-nums",
										children: formatCurrency(inspectedPoint.avgOrderValue, settings.currency, settings.language)
									})
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-3 sm:gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800/80",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-neutral-500 font-semibold block",
									children: isAr ? "إجمالي اليوم" : "Day Revenue"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs sm:text-sm font-extrabold text-emerald-400 tabular-nums",
									children: formatCurrency(inspectedPoint.revenue, settings.currency, settings.language)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-neutral-500 font-semibold block",
									children: isAr ? "المحصل نقداً/بنكياً" : "Collected"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs sm:text-sm font-extrabold text-sky-400 tabular-nums",
									children: formatCurrency(inspectedPoint.collected, settings.currency, settings.language)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-neutral-500 font-semibold block",
									children: isAr ? "الديون المتبقية" : "Remaining Debt"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs sm:text-sm font-extrabold tabular-nums ${inspectedPoint.debt > 0 ? "text-amber-400" : "text-neutral-400"}`,
									children: formatCurrency(inspectedPoint.debt, settings.currency, settings.language)
								})] })
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3",
				children: t.quickShortcuts
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("checkout"),
						className: "flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-left transition-all active:scale-[0.98] group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-bold text-white block",
							children: t.newSale
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-neutral-500",
							children: isAr ? "فتح نقطة البيع" : "Open register"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("products"),
						className: "flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-left transition-all active:scale-[0.98] group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-bold text-white block",
							children: t.addProduct
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-neutral-500",
							children: isAr ? "إدارة الأصناف" : "Catalog items"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("inventory"),
						className: "flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-left transition-all active:scale-[0.98] group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-bold text-white block",
							children: t.stockAudit
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-neutral-500",
							children: isAr ? "الجرد والتوريد" : "Restock & counts"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("sales"),
						className: "flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-left transition-all active:scale-[0.98] group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-bold text-white block",
							children: t.salesHistory
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-neutral-500",
							children: isAr ? "الفواتير والمرتجعات" : "Slips & refunds"
						})] })]
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between pb-3 border-b border-neutral-800",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-sm text-white",
						children: t.recentTransactions
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab("sales"),
					className: "text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "عرض الكل" : "View All" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-3.5 h-3.5" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-neutral-800/80 mt-2",
				children: todayMetrics.recentTxns.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-xs text-neutral-500",
					children: t.noRecentTransactions
				}) : todayMetrics.recentTxns.map((tx) => {
					const convertedTx = getConvertedTransactionView(tx, settings.currency, exchangeRates, "historical");
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						role: "button",
						tabIndex: 0,
						onClick: () => setSelectedTxn(tx),
						className: "py-3 flex items-center justify-between gap-3 hover:bg-neutral-850/60 -mx-2 px-2 rounded-xl transition-colors cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold font-mono text-white",
								children: tx.id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[10px] font-semibold px-2 py-0.5 rounded-md ${tx.status === "completed" ? "bg-emerald-950/80 text-emerald-400" : "bg-rose-950/80 text-rose-400"}`,
								children: tx.status
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] text-neutral-400 mt-0.5",
							children: [
								tx.customerName || "Walk-in",
								" • ",
								tx.items.length,
								" items •",
								" ",
								new Date(tx.timestamp).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit"
								})
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-bold text-emerald-400 tabular-nums",
								children: formatCurrency(convertedTx.grandTotal, settings.currency, settings.language)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono text-neutral-500 uppercase",
								children: tx.paymentMethod
							})]
						})]
					}, tx.id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptModal, {
				isOpen: Boolean(selectedTxn),
				onClose: () => setSelectedTxn(null),
				transaction: selectedTxn,
				onNewSale: () => {
					setSelectedTxn(null);
					setActiveTab("checkout");
				}
			})
		]
	});
};
export { DashboardView };
