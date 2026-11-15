const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/web-EkuYvCQS.js","assets/dist-DBWXrrw4.js","assets/DashboardView-BxFZLIyW.js","assets/rolldown-runtime-DQp2zzRu.js","assets/vendor-icons-CI9orWhJ.js","assets/POSContext-BOgzURdy.js","assets/definitions-6LZk6z8n.js","assets/vendor-motion-D4PRzaI1.js","assets/AppCard-Bz1niKzT.js","assets/CartesianChart-CoKLjEzo.js","assets/vendor-react-BPWmj-cb.js","assets/ProductsView-Czn8GjGF.js","assets/InventoryView-Bq18JZfA.js","assets/GoodsReceiptModal-BwfknPst.js","assets/CustomersView-CenZiJ_M.js","assets/SalesView-C6hTxmNK.js","assets/ExpensesView-BOcFw7re.js","assets/native-file-download-Co0EE1WC.js","assets/ReportsView-Cy20sbP6.js","assets/analytics.snapshot-Cve3ZbCV.js","assets/SettingsView-CnQbO71r.js","assets/TrainingTourOverlay-BcDtYppT.js","assets/UnmetDemandCaptureModal-QutYyGVG.js"])))=>i.map(i=>d[i]);
import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { n as require_react_dom, t as require_client } from "./vendor-react-BPWmj-cb.js";
import { $t as ChartColumn, A as Settings, B as Printer, C as Sparkles, Cn as require_react, Ct as Flashlight, D as ShieldCheck, Dt as Eye, E as ShoppingBag, F as RotateCcw, G as PenLine, Gt as CircleAlert, Ht as CirclePlus, I as RefreshCw, Jt as ChevronLeft, K as Package, L as Receipt, M as Search, Mt as Copy, N as ScanLine, Nt as Compass, O as ShieldAlert, Pt as Coins, R as Radio, Rt as Clock, S as Store, Sn as Activity, St as FlaskConical, Tt as FileText, Ut as CircleCheck, V as Plus, Vt as CircleX, Xt as Check, Y as PackageCheck, Z as Minus, Zt as CheckCheck, _n as ArrowLeftRight, _t as Globe, a as WifiOff, an as Briefcase, at as Link2, b as Terminal, cn as BellRing, ct as Layers, f as UserCheck, g as TriangleAlert, gn as ArrowLeft, h as Truck, ht as Hash, i as Wifi, in as Building2, it as LoaderCircle, j as Server, jt as CreditCard, l as Users, ln as Barcode, lt as Laptop, m as Unlink, mn as ArrowRight, n as Zap, nn as CameraOff, o as Wallet, p as Upload, pt as Image$1, q as PackageX, qt as ChevronRight, r as X, rn as Calendar, rt as Lock, sn as Bell, st as LayoutDashboard, t as ZoomIn, tn as Camera, tt as LogOut, u as User, un as Banknote, ut as Landmark, vt as GraduationCap, w as Smartphone, wt as FileWarning, x as Tag, xn as ArchiveRestore, y as Trash2, z as QrCode } from "./vendor-icons-CI9orWhJ.js";
import { $ as buildProductSearchIndexMap, At as calculateDebtBreakdown, Bt as getConvertedTransactionView, Ft as formatCurrency, Ht as getProductPricesInCurrency, It as formatPaymentMethodLabel, J as playHoldTick, K as initRealUserMonitoring, Lt as formatProductStockBreakdown, Q as triggerHaptic, Ut as roundCurrencyValue, Vt as getProductPackaging, W as api, X as playSuccessChime, Y as playScannerBeep, Z as playTactileClick, _t as __vitePreload, a as normalizeLanHostUrl, ct as matchesProductBarcode, ht as tokenizeProductSearchQuery, i as isStandaloneCapacitorApk, it as getAllProductBarcodes, lt as matchesProductSearchIndexEntry, n as usePOS, nt as formatProductSerialNumber, ot as getProductExpiryStatus, q as useDebouncedValue, r as encodeCode128B, st as getProductSerialNumber, t as POSProvider, zt as getCartItemUnitPricing } from "./POSContext-BOgzURdy.js";
import { a as registerPlugin, t as Capacitor } from "./dist-DBWXrrw4.js";
import { i as require_jsx_runtime, n as useReducedMotion, r as AnimatePresence, t as motion } from "./vendor-motion-D4PRzaI1.js";
import { n as I, t as esm_exports } from "./vendor-scanner-BLp9p32H.js";
// \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
// src/lib/translations.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_client = require_client();
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var translations = {
	en: {
		appName: "Dqnamo POS",
		tagline: "Modern Mobile POS for Retail",
		dashboard: "Dashboard",
		checkout: "Checkout",
		products: "Products",
		inventory: "Inventory",
		customers: "Customers",
		sales: "Sales",
		expenses: "Expenses",
		reports: "Reports",
		settings: "Settings",
		todaySales: "Today's Sales",
		todayTransactions: "Transactions Today",
		totalProducts: "Total Products",
		lowStockAlerts: "Low Stock Alerts",
		recentTransactions: "Recent Transactions",
		quickShortcuts: "Quick Shortcuts",
		newSale: "New Sale",
		addProduct: "Add Product",
		scanBarcode: "Scan Barcode",
		stockAudit: "Stock Audit",
		noRecentTransactions: "No transactions recorded yet today.",
		searchProducts: "Search products or scan SKU...",
		allCategories: "All Items",
		cart: "Shopping Cart",
		cartEmpty: "Cart is empty. Tap products to add.",
		subtotal: "Subtotal",
		discount: "Discount",
		tax: "VAT / Tax",
		total: "Grand Total",
		itemsCount: "items",
		clearCart: "Void Cart",
		holdToClearCart: "Hold to Void Cart",
		payNow: "Pay Now",
		selectCustomer: "Assign Customer (Optional)",
		walkInCustomer: "Walk-in Customer",
		paymentMethod: "Payment Method",
		cash: "Cash",
		card: "Bank Transfer",
		bankTransfer: "Bank Transfer",
		qrNfc: "Digital Wallet (NFC/QR)",
		transferReference: "Operation / Reference #",
		transferReferencePlaceholder: "Enter bank transfer operation number...",
		transferReceiptImage: "Transfer Notification Image",
		uploadReceiptImage: "Attach Notification Image",
		changeReceiptImage: "Change Image",
		removeReceiptImage: "Remove",
		paymentSettlementStatus: "Invoice Payment / Debt Status",
		paidInFull: "Paid in Full",
		partialPaymentDebt: "Partial Payment (Debt)",
		unpaidFullDebt: "Unpaid (Full Debt)",
		amountPaidLabel: "Amount Paid",
		remainingDebt: "Remaining Debt",
		totalDebt: "Total Debt",
		settleDebt: "Settle Debt",
		amountTendered: "Amount Tendered",
		changeDue: "Change Due",
		exactAmount: "Exact",
		processingPayment: "Authorizing Transaction...",
		paymentCompleted: "Payment Successful!",
		paymentFailed: "Payment Failed",
		printReceipt: "Print Receipt",
		newTransaction: "New Transaction",
		receipt: "Sale Receipt",
		thankYou: "Thank you for your purchase!",
		productCatalog: "Product Catalog",
		editProduct: "Edit Product",
		createProduct: "New Product",
		productName: "Product Name",
		category: "Category",
		sku: "SKU Code",
		barcode: "Barcode",
		generateBarcode: "Generate Barcode",
		costPrice: "Cost Price",
		sellingPrice: "Selling Price",
		stockQty: "Stock Quantity",
		minStockAlert: "Low Stock Alert Threshold",
		deleteProduct: "Delete Product",
		holdToDelete: "Hold to Delete Product",
		saveProduct: "Save Product",
		cancel: "Cancel",
		inStock: "In Stock",
		outOfStock: "Out of Stock",
		lowStock: "Low Stock",
		inventoryManagement: "Inventory & Stock Movements",
		adjustStock: "Adjust Stock",
		movementType: "Movement Type",
		restock: "Restock (+)",
		damage: "Damaged / Spoiled (-)",
		loss: "Theft / Loss (-)",
		audit: "Physical Audit (Set Exact)",
		quantityDelta: "Quantity",
		reason: "Reason / Notes",
		saveAdjustment: "Apply Adjustment",
		totalAssetValue: "Inventory Valuation",
		potentialRevenue: "Potential Revenue",
		movementHistory: "Stock Movements Log",
		customerDirectory: "Customer Directory",
		newCustomer: "New Customer",
		customerName: "Full Name",
		phone: "Phone Number",
		email: "Email (Optional)",
		notes: "Customer Notes",
		totalSpent: "Total Spent",
		loyaltyPoints: "Loyalty Points",
		saveCustomer: "Save Customer",
		salesHistory: "Transaction History",
		searchTransactions: "Search by ID or customer...",
		status: "Status",
		completed: "Completed",
		voided: "Voided",
		voidSale: "Void / Refund Transaction",
		holdToVoidSale: "Hold to Void & Refund",
		salesDisplayCurrency: "Display Currency",
		rateValuationMode: "Exchange Rate Valuation Mode",
		modeLiveRate: "Live Rate (Direct)",
		modeIndexedRate: "Linked to New Rate (Inflation Protected)",
		modeHistoricalRate: "Invoice Historical Rate",
		quickRateUpdate: "Quick Exchange Rate Update",
		applyNewRateBtn: "Update Rate",
		syncInvoiceToNewRate: "Link Invoice to New Rate",
		syncAllDebtsToNewRate: "Update All Debts to New Rate",
		originalInvoiceValue: "Original Invoice",
		invoiceHistoricalRateLabel: "Invoice Rate",
		currentLiveRateLabel: "New Rate",
		rateDiffLabel: "Rate Diff",
		totalCollectedSales: "Collected Amount",
		totalOutstandingDebts: "Remaining Debts",
		analyticsAndReports: "Business Reports & Analytics",
		grossSales: "Gross Sales",
		netProfit: "Net Gross Profit",
		averageOrderValue: "Avg Basket Value",
		topSellingProducts: "Top Selling Products",
		salesByMethod: "Payment Distribution",
		exportCsv: "Export Sales CSV",
		exportInventoryCsv: "Export Inventory CSV",
		storePerformanceBadges: "Store Performance Badges & Health",
		storePerformanceChart: "Store Financial Performance Chart",
		productSalesAndCurrencyChart: "Per-Product Sales & Currency Price Change Chart",
		exchangeRateFluctuationBadges: "Exchange Rate Fluctuation Badges & Chart",
		fulfillmentOptionTitle: "Invoice & Goods Receipt Option",
		receiveGoodsAndInvoice: "Receive Invoice & Goods Now",
		receiveInvoiceOnly: "Receive Invoice Only (Goods Pending)",
		receiveGoodsOnly: "Receive Goods Only (Invoice Pending)",
		fulfillmentReceivedBadge: "Goods & Invoice Received",
		fulfillmentPendingGoodsBadge: "Invoice Received • Goods Pending",
		fulfillmentPendingInvoiceBadge: "Goods Received • Invoice Pending",
		confirmGoodsReceiptBtn: "Confirm Goods/Invoice Receipt",
		receiveSupplierGoodsBtn: "Receive Goods / Purchase Invoice",
		systemSettings: "Store & System Settings",
		general: "General Preferences",
		language: "Language",
		theme: "Theme Mode",
		dark: "Tactile Dark",
		light: "Clean Light",
		soundEffects: "Tactile Audio Feedback",
		hapticFeedback: "Haptic Vibration",
		storeProfile: "Store Information",
		storeName: "Store Name",
		storeAddress: "Store Address",
		taxNumber: "Tax Registration #",
		taxRate: "Default Tax Rate (%)",
		taxInclusive: "Prices Include Tax",
		currency: "Currency",
		receiptFooterNote: "Receipt Footer Message",
		saveSettings: "Save Settings",
		resetData: "Factory Reset All Data",
		holdToResetData: "Hold to Reset Everything",
		offlineStatus: "Sync Status",
		allSynced: "All transactions synchronized",
		pendingSync: "Transactions stored locally (offline ready)",
		syncNow: "Synchronize Now"
	},
	ar: {
		appName: "دينامو للمبيعات",
		tagline: "نظام نقاط بيع متنقل وعصري للتجزئة",
		dashboard: "الرئيسية",
		checkout: "نقطة البيع",
		products: "المنتجات",
		inventory: "المخزون",
		customers: "العملاء",
		sales: "المبيعات",
		expenses: "المنصرفات",
		reports: "التقارير",
		settings: "الإعدادات",
		todaySales: "مبيعات اليوم",
		todayTransactions: "عدد عمليات اليوم",
		totalProducts: "إجمالي المنتجات",
		lowStockAlerts: "تنبيهات انخفاض المخزون",
		recentTransactions: "أحدث العمليات",
		quickShortcuts: "اختصارات سريعة",
		newSale: "عملية بيع جديدة",
		addProduct: "إضافة منتج",
		scanBarcode: "مسح الباركود",
		stockAudit: "جرد المخزون",
		noRecentTransactions: "لم يتم تسجيل أي عمليات اليوم بعد.",
		searchProducts: "ابحث عن منتج أو امسح الرمز...",
		allCategories: "جميع الأصناف",
		cart: "سلة المشتريات",
		cartEmpty: "السلة فارغة. اضغط على أي منتج لإضافته.",
		subtotal: "المجموع الفرعي",
		discount: "الخصم",
		tax: "ضريبة القيمة المضافة",
		total: "المجموع الكلي",
		itemsCount: "قطع",
		clearCart: "إفراغ السلة",
		holdToClearCart: "اضغط باستمرار لإلغاء السلة",
		payNow: "إتمام الدفع",
		selectCustomer: "تحديد العميل (اختياري)",
		walkInCustomer: "عميل نقدي عابر",
		paymentMethod: "طريقة الدفع",
		cash: "نقداً (كاش)",
		card: "تحويل بنكي",
		bankTransfer: "تحويل بنكي",
		qrNfc: "محفظة رقمية (NFC / QR)",
		transferReference: "رقم العملية",
		transferReferencePlaceholder: "أدخل رقم العملية للتحويل البنكي...",
		transferReceiptImage: "صورة الإشعار",
		uploadReceiptImage: "إرفاق صورة الإشعار",
		changeReceiptImage: "تغيير الصورة",
		removeReceiptImage: "حذف الصورة",
		paymentSettlementStatus: "حالة الدفع / الدين",
		paidInFull: "مدفوع بالكامل",
		partialPaymentDebt: "دفع جزئي (متبقي دين)",
		unpaidFullDebt: "لم يدفع (دين كامل)",
		amountPaidLabel: "المبلغ المدفوع",
		remainingDebt: "المبلغ المتبقي (الدين)",
		totalDebt: "إجمالي الديون",
		settleDebt: "تسديد الدين",
		amountTendered: "المبلغ المستلم",
		changeDue: "المتبقي للعميل",
		exactAmount: "المبلغ بالتمام",
		processingPayment: "جارٍ تسجيل العملية...",
		paymentCompleted: "تم الدفع بنجاح!",
		paymentFailed: "فشلت العملية",
		printReceipt: "طباعة الفاتورة",
		newTransaction: "عملية جديدة",
		receipt: "فاتورة ضريبية مبسطة",
		thankYou: "شكراً لتسوقكم معنا!",
		productCatalog: "دليل المنتجات",
		editProduct: "تعديل المنتج",
		createProduct: "منتج جديد",
		productName: "اسم المنتج",
		category: "التصنيف",
		sku: "رمز الصنف (SKU)",
		barcode: "الباركود",
		generateBarcode: "توليد باركود تلقائي",
		costPrice: "سعر التكلفة",
		sellingPrice: "سعر البيع",
		stockQty: "الكمية المتوفرة",
		minStockAlert: "حد تنبيه انخفاض المخزون",
		deleteProduct: "حذف المنتج",
		holdToDelete: "اضغط باستمرار لحذف المنتج",
		saveProduct: "حفظ المنتج",
		cancel: "إلغاء",
		inStock: "متوفر",
		outOfStock: "نفد المخزون",
		lowStock: "مخزون منخفض",
		inventoryManagement: "إدارة المخزون وحركات الأصناف",
		adjustStock: "تعديل المخزون",
		movementType: "نوع الحركة",
		restock: "توريد مخزون جديد (+)",
		damage: "تالف / منتهي الصلاحية (-)",
		loss: "عجز / مفقود (-)",
		audit: "جرد فعلي (تحديد الكمية الدقيقة)",
		quantityDelta: "الكمية",
		reason: "السبب / الملاحظات",
		saveAdjustment: "تطبيق التعديل",
		totalAssetValue: "القيمة التقديرية للمخزون",
		potentialRevenue: "الإيراد المتوقع للمخزون",
		movementHistory: "سجل حركات المخزون",
		customerDirectory: "دليل العملاء",
		newCustomer: "عميل جديد",
		customerName: "الاسم الكامل",
		phone: "رقم الجوال",
		email: "البريد الإلكتروني (اختياري)",
		notes: "ملاحظات العميل",
		totalSpent: "إجمالي المشتريات",
		loyaltyPoints: "نقاط الولاء",
		saveCustomer: "حفظ العميل",
		salesHistory: "سجل الفواتير والمبيعات",
		searchTransactions: "ابحث برقم الفاتورة أو العميل...",
		status: "الحالة",
		completed: "مكتملة",
		voided: "ملغاة / مسترجعة",
		voidSale: "إلغاء واسترجاع الفاتورة",
		holdToVoidSale: "اضغط باستمرار للإلغاء والاسترجاع",
		salesDisplayCurrency: "عملة عرض المبيعات",
		rateValuationMode: "طريقة حساب سعر الصرف المتغير",
		modeLiveRate: "سعر الصرف الجديد (تحويل مباشر)",
		modeIndexedRate: "ربط القيمة بسعر الصرف الجديد (حماية من فرق السعر)",
		modeHistoricalRate: "سعر الصرف وقت الفاتورة (تاريخي)",
		quickRateUpdate: "تحديث سعر الصرف الفوري",
		applyNewRateBtn: "اعتماد السعر الجديد",
		syncInvoiceToNewRate: "تثبيت الفاتورة بالسعر الجديد",
		syncAllDebtsToNewRate: "تحديث كل الديون للسعر الجديد",
		originalInvoiceValue: "أصل الفاتورة",
		invoiceHistoricalRateLabel: "سعر الفاتورة",
		currentLiveRateLabel: "السعر الجديد",
		rateDiffLabel: "فرق الصرف",
		totalCollectedSales: "إجمالي المبالغ المستلمة",
		totalOutstandingDebts: "إجمالي الديون المتبقية",
		analyticsAndReports: "تقارير الأعمال والإحصائيات",
		grossSales: "إجمالي المبيعات",
		netProfit: "الربح الإجمالي التقديري",
		averageOrderValue: "متوسط قيمة الفاتورة",
		topSellingProducts: "المنتجات الأكثر مبيعاً",
		salesByMethod: "توزيع طرق الدفع",
		exportCsv: "تصدير المبيعات CSV",
		exportInventoryCsv: "تصدير المخزون CSV",
		storePerformanceBadges: "شارات تقييم أداء المتجر",
		storePerformanceChart: "شارت الأداء المالي للمتجر",
		productSalesAndCurrencyChart: "شارت مبيعات كل منتج وتغير سعر العملة",
		exchangeRateFluctuationBadges: "شارات وشارت تغير أسعار الصرف",
		fulfillmentOptionTitle: "خيار استلام الفاتورة أو استلام البضاعة",
		receiveGoodsAndInvoice: "استلام البضاعة والفاتورة فوراً",
		receiveInvoiceOnly: "استلام الفاتورة فقط (البضاعة قيد التسليم)",
		receiveGoodsOnly: "استلام البضاعة فقط (بانتظار الفاتورة)",
		fulfillmentReceivedBadge: "تم استلام البضاعة والفاتورة",
		fulfillmentPendingGoodsBadge: "تم استلام الفاتورة • بانتظار البضاعة",
		fulfillmentPendingInvoiceBadge: "تم استلام البضاعة • بانتظار الفاتورة",
		confirmGoodsReceiptBtn: "تأكيد استلام البضاعة / الفاتورة",
		receiveSupplierGoodsBtn: "استلام فاتورة أو استلام بضاعة",
		systemSettings: "إعدادات المتجر والنظام",
		general: "التفضيلات العامة",
		language: "اللغة / Language",
		theme: "المظهر",
		dark: "داكن ملموس (Tactile Dark)",
		light: "فاتح ناصع",
		soundEffects: "المؤثرات الصوتية للأزرار",
		hapticFeedback: "الاهتزاز اللمسي (Haptic)",
		storeProfile: "بيانات المتجر",
		storeName: "اسم المتجر",
		storeAddress: "عنوان المتجر",
		taxNumber: "الرقم الضريبي",
		taxRate: "نسبة الضريبة الافتراضية (%)",
		taxInclusive: "الأسعار شاملة الضريبة",
		currency: "العملة",
		receiptFooterNote: "رسالة أسفل الفاتورة",
		saveSettings: "حفظ الإعدادات",
		resetData: "إعادة ضبط المصنع لجميع البيانات",
		holdToResetData: "اضغط باستمرار لمسح كافة البيانات",
		offlineStatus: "حالة المزامنة",
		allSynced: "جميع العمليات متزامنة بنجاح",
		pendingSync: "العمليات محفوظة محلياً (جاهزة للمزامنة)",
		syncNow: "مزامنة فورية"
	}
};
function getTranslation(lang) {
	return translations[lang] || translations.en;
}
// src/components/ui/TactileButton.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var import_jsx_runtime = require_jsx_runtime();
var TactileButton = (0, import_react.forwardRef)(({ children, className = "", variant = "primary", size = "md", isLoading = false, leftIcon, rightIcon, disabled, disableTactileFeedback = false, onClick, ...props }, ref) => {
	const handleClick = (e) => {
		if (disabled || isLoading) return;
		if (!disableTactileFeedback) {
			playTactileClick();
			triggerHaptic("light");
		}
		onClick?.(e);
	};
	const sizeClasses = {
		sm: "h-9 px-3 text-xs gap-1.5 rounded-lg",
		md: "h-11 px-4 text-sm gap-2 rounded-xl min-h-[44px]",
		lg: "h-13 px-5 text-base gap-2.5 rounded-xl min-h-[48px]",
		xl: "h-15 px-6 text-lg gap-3 rounded-2xl min-h-[56px] font-semibold",
		icon: "w-11 h-11 min-h-[44px] min-w-[44px] p-0 flex items-center justify-center rounded-xl"
	}[size];
	const variantClasses = {
		primary: "bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700/80 shadow-[0_3px_0_0_#171717,0_6px_10px_rgba(0,0,0,0.3)] active:shadow-[0_1px_0_0_#171717,0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-[2px]",
		secondary: "bg-neutral-800/90 hover:bg-neutral-750 text-neutral-200 border border-neutral-700/60 shadow-[0_3px_0_0_#262626,0_4px_8px_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_0_#262626] active:translate-y-[2px]",
		emerald: "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/30 shadow-[0_3px_0_0_#065f46,0_6px_14px_rgba(16,185,129,0.3)] active:shadow-[0_1px_0_0_#065f46] active:translate-y-[2px]",
		amber: "bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold border border-amber-300/40 shadow-[0_3px_0_0_#b45309,0_6px_14px_rgba(245,158,11,0.25)] active:shadow-[0_1px_0_0_#b45309] active:translate-y-[2px]",
		danger: "bg-rose-600 hover:bg-rose-500 text-white border border-rose-400/30 shadow-[0_3px_0_0_#9f1239,0_6px_14px_rgba(244,63,94,0.3)] active:shadow-[0_1px_0_0_#9f1239] active:translate-y-[2px]",
		ghost: "bg-transparent hover:bg-neutral-800/60 text-neutral-300 border border-transparent active:bg-neutral-800/80 active:translate-y-[1px]"
	}[variant];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		ref,
		disabled: disabled || isLoading,
		onClick: handleClick,
		className: `relative inline-flex items-center justify-center font-medium transition-all duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 ${sizeClasses} ${variantClasses} ${disabled || isLoading ? "opacity-40 cursor-not-allowed pointer-events-none transform-none shadow-none active:translate-y-0" : "cursor-pointer select-none"} ${className}`,
		...props,
		children: [
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
				className: "w-4 h-4 animate-spin shrink-0",
				"aria-hidden": "true"
			}) : leftIcon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0",
				children: leftIcon
			}),
			children && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate",
				children
			}),
			!isLoading && rightIcon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0",
				children: rightIcon
			})
		]
	});
});
TactileButton.displayName = "TactileButton";
// src/components/ui/AppModal.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var import_react_dom = require_react_dom();
var AppModal = ({ isOpen, onClose, title, description, children, maxWidth = "md", asSheetOnMobile = true }) => {
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && isOpen) onClose();
		};
		if (isOpen) {
			document.body.style.overflow = "hidden";
			window.addEventListener("keydown", handleKeyDown);
		}
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose]);
	const maxWidthClass = {
		sm: "max-w-sm",
		md: "max-w-md",
		lg: "max-w-lg",
		xl: "max-w-xl",
		"2xl": "max-w-2xl",
		full: "max-w-4xl"
	}[maxWidth];
	const modalContent = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-modal-portal-root fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 overflow-y-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
			transition: { duration: .2 },
			onClick: onClose,
			className: "app-modal-backdrop fixed inset-0 bg-black/75 backdrop-blur-sm",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: asSheetOnMobile ? {
				opacity: 0,
				y: 40
			} : {
				opacity: 0,
				scale: .95
			},
			animate: {
				opacity: 1,
				y: 0,
				scale: 1
			},
			exit: asSheetOnMobile ? {
				opacity: 0,
				y: 40
			} : {
				opacity: 0,
				scale: .95
			},
			transition: {
				type: "spring",
				damping: 28,
				stiffness: 350
			},
			className: `app-modal-card relative z-10 w-full ${maxWidthClass} bg-neutral-900 border border-neutral-800 text-neutral-100 shadow-2xl flex flex-col max-h-[90vh] ${asSheetOnMobile ? "max-md:mt-auto max-md:rounded-t-3xl max-md:border-b-0 rounded-2xl" : "rounded-2xl"}`,
			role: "dialog",
			"aria-modal": "true",
			children: [
				asSheetOnMobile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:hidden pt-3 pb-1 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-1 bg-neutral-700 rounded-full" })
				}),
				(title || description) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "app-modal-header flex items-start justify-between p-5 pb-3 border-b border-neutral-800/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pr-4",
						children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base sm:text-lg font-bold text-neutral-100 tracking-tight",
							children: title
						}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-neutral-400 mt-0.5",
							children: description
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						variant: "ghost",
						size: "icon",
						className: "w-8 h-8 min-h-[32px] min-w-[32px] text-neutral-400 hover:text-white rounded-lg -mt-1 -mr-2",
						onClick: onClose,
						"aria-label": "Close dialog",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "app-modal-body p-5 overflow-y-auto flex-1",
					children
				})
			]
		})]
	}) });
	if (typeof document !== "undefined" && document.body) return (0, import_react_dom.createPortal)(modalContent, document.body);
	return modalContent;
};
// src/lib/notifications-center.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var NOTIFICATIONS_LIFECYCLE_STORAGE_KEY = "pos_notifications_lifecycle_v1";
var NOTIFICATIONS_UPDATED_EVENT = "pos-notifications-lifecycle-updated";
function loadNotificationLifecycleMap(storage) {
	try {
		const store = storage || (typeof window !== "undefined" ? window.localStorage : void 0);
		if (!store) return {};
		const raw = store.getItem(NOTIFICATIONS_LIFECYCLE_STORAGE_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return {};
		return parsed;
	} catch {
		return {};
	}
}
function saveNotificationLifecycleStatus(keys, status, note, storage) {
	const current = loadNotificationLifecycleMap(storage);
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const next = { ...current };
	for (const key of keys) {
		if (!key) continue;
		next[key] = {
			status,
			note: note?.trim() || next[key]?.note,
			updatedAt: nowIso
		};
	}
	try {
		const store = storage || (typeof window !== "undefined" ? window.localStorage : void 0);
		if (store) store.setItem(NOTIFICATIONS_LIFECYCLE_STORAGE_KEY, JSON.stringify(next));
		if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT));
	} catch {}
	return next;
}
var SEVERITY_WEIGHT = {
	CRITICAL: 4,
	HIGH: 3,
	MEDIUM: 2,
	LOW: 1
};
function resolveSmartAlertQuickAction(alert) {
	switch (alert.category) {
		case "STOCKOUT_RISK":
		case "INVENTORY_RISK":
		case "REPLENISHMENT": return {
			target: "inventory",
			labelAr: "فتح المخزون والتوريد الآن",
			labelEn: "Open Inventory & Restock"
		};
		case "UNMET_DEMAND": return {
			target: "unmet_demand_modal",
			labelAr: "فتح سجل الطلبات غير المتوفرة",
			labelEn: "Open Unmet Demand Capture"
		};
		case "FINANCIAL_RISK":
		case "SALES_ANOMALY": return {
			target: "sales",
			labelAr: "مراجعة الفواتير والمبيعات",
			labelEn: "Review Sales & Invoices"
		};
		default: return {
			target: "products",
			labelAr: "فحص المنتجات والأسعار",
			labelEn: "Inspect Products Catalog"
		};
	}
}
function buildStoreNotificationsList(params) {
	const { products = [], transactions = [], customers = [], unmetDemandRequests = [], smartAlerts = [], lifecycleMap = {}, nowMs = Date.now() } = params;
	const items = [];
	const seenKeys = /* @__PURE__ */ new Set();
	const nowIso = new Date(nowMs).toISOString();
	const resolveStatus = (id, dedupeKey, fallback = "active") => {
		const rec = lifecycleMap[dedupeKey] || lifecycleMap[id];
		if (rec) return {
			status: rec.status,
			note: rec.note,
			updatedAt: rec.updatedAt
		};
		return { status: fallback };
	};
	if (products.length === 0) {
		const id = "notif-empty-catalog-readiness";
		const dedupeKey = "readiness:empty_catalog";
		seenKeys.add(dedupeKey);
		const st = resolveStatus(id, dedupeKey);
		items.push({
			id,
			dedupeKey,
			type: "SMART_BI_ALERT",
			severity: "HIGH",
			categoryLabelAr: "جاهزية المتجر والمخزون",
			categoryLabelEn: "Store Catalog Readiness",
			titleAr: "قائمة المنتجات فارغة — ابدأ بإضافة أصناف المتجر",
			titleEn: "Product Catalog Empty — Add Store Products",
			summaryAr: "لا توجد منتجات مسجلة في المتجر حالياً (0 صنف).",
			summaryEn: "There are currently 0 products registered in the store catalog.",
			detailsAr: "كتالوج المنتجات الحالي فارغ (0 صنف). للبدء في البيع ومراقبة المخزون والصلاحية والتقارير الذكية، قم بإضافة منتجات المتجر أو تفعيل وضع التدريب التجريبي.",
			detailsEn: "Your store catalog is currently empty (0 items). Add products in the Products page or switch to Practice Mode to start selling and tracking inventory.",
			recommendationAr: "افتح صفحة المنتجات لإضافة أول صنف أو استيراد قائمة المنتجات.",
			recommendationEn: "Open Products page to add your first item or import catalog.",
			metricBadge: "0 أصناف",
			timestamp: nowIso,
			status: st.status,
			resolutionNote: st.note,
			updatedAt: st.updatedAt,
			primaryActionTarget: "products",
			primaryActionLabelAr: "فتح صفحة المنتجات لإضافة صنف",
			primaryActionLabelEn: "Open Products to Add Item",
			evidenceMetrics: [{
				name: "عدد المنتجات / Products",
				valueFormatted: "0"
			}, {
				name: "حالة المتجر / Status",
				valueFormatted: "يحتاج تأسيس / Setup Needed"
			}]
		});
	}
	for (const prod of products) {
		const nameAr = prod.nameAr || prod.name;
		const nameEn = prod.name;
		if (prod.stock <= 0) {
			const id = `notif-out-of-stock-${prod.id}`;
			const dedupeKey = `stockout:${prod.id}`;
			seenKeys.add(dedupeKey);
			const st = resolveStatus(id, dedupeKey);
			items.push({
				id,
				dedupeKey,
				type: "OUT_OF_STOCK",
				severity: "CRITICAL",
				categoryLabelAr: "نفاد المخزون",
				categoryLabelEn: "Out of Stock",
				titleAr: `نفاد مخزون المنتج: ${nameAr}`,
				titleEn: `Product Out of Stock: ${nameEn}`,
				summaryAr: `الرصيد الحالي 0 وحدة (حد التنبيه: ${prod.minStockAlert}).`,
				summaryEn: `Current stock is 0 units (Alert threshold: ${prod.minStockAlert}).`,
				detailsAr: `المنتج "${nameAr}" (رمز الباركود/SKU: ${prod.sku}) نفد بالكامل من المخزون ولا يمكن بيعه في الكاشير حالياً. يُنصح باستلام بضاعة جديدة أو تعديل الرصيد فوراً لتجنب ضياع المبيعات.`,
				detailsEn: `Product "${nameEn}" (SKU: ${prod.sku}) has 0 units remaining and cannot be sold at checkout. Receive supplier goods or restock immediately.`,
				recommendationAr: "قم بفتح شاشة المخزون واستلام بضاعة جديدة أو تحديث الكمية المتوفرة.",
				recommendationEn: "Open Inventory to receive goods or restock this item.",
				metricBadge: `0 / ${prod.minStockAlert}`,
				timestamp: prod.updatedAt || nowIso,
				status: st.status,
				resolutionNote: st.note,
				updatedAt: st.updatedAt,
				productId: prod.id,
				primaryActionTarget: "inventory",
				primaryActionLabelAr: "تزويد المخزون الآن",
				primaryActionLabelEn: "Restock in Inventory",
				evidenceMetrics: [
					{
						name: "الرصيد الحالي / Stock",
						valueFormatted: "0"
					},
					{
						name: "حد التنبيه / Min Alert",
						valueFormatted: String(prod.minStockAlert)
					},
					{
						name: "SKU",
						valueFormatted: prod.sku
					}
				]
			});
		} else if (prod.stock <= prod.minStockAlert) {
			const id = `notif-low-stock-${prod.id}`;
			const dedupeKey = `lowstock:${prod.id}`;
			seenKeys.add(dedupeKey);
			const st = resolveStatus(id, dedupeKey);
			items.push({
				id,
				dedupeKey,
				type: "LOW_STOCK",
				severity: "HIGH",
				categoryLabelAr: "انخفاض المخزون",
				categoryLabelEn: "Low Stock Alert",
				titleAr: `مخزون منخفض: ${nameAr}`,
				titleEn: `Low Stock Alert: ${nameEn}`,
				summaryAr: `المتبقي ${prod.stock} وحدة فقط (حد التنبيه: ${prod.minStockAlert}).`,
				summaryEn: `Only ${prod.stock} units left (Alert threshold: ${prod.minStockAlert}).`,
				detailsAr: `وصل رصيد المنتج "${nameAr}" (${prod.sku}) إلى ${prod.stock} وحدة وهو أقل من أو يساوي حد إعادة الطلب (${prod.minStockAlert}). يُوصى بطلب توريد جديد قبل النفاد التام.`,
				detailsEn: `Stock for "${nameEn}" (${prod.sku}) dropped to ${prod.stock} units (threshold: ${prod.minStockAlert}). Reorder soon to avoid stockout.`,
				recommendationAr: "إصدار أمر تزويد مخزون أو تسجيل استلام بضاعة من المورد.",
				recommendationEn: "Create a restock entry or receive supplier goods in Inventory.",
				metricBadge: `${prod.stock} وحدة`,
				timestamp: prod.updatedAt || nowIso,
				status: st.status,
				resolutionNote: st.note,
				updatedAt: st.updatedAt,
				productId: prod.id,
				primaryActionTarget: "inventory",
				primaryActionLabelAr: "تزويد المخزون",
				primaryActionLabelEn: "Restock Product",
				evidenceMetrics: [{
					name: "الرصيد المتبقي / Stock",
					valueFormatted: String(prod.stock)
				}, {
					name: "حد التنبيه / Min Alert",
					valueFormatted: String(prod.minStockAlert)
				}]
			});
		}
		const expiry = getProductExpiryStatus(prod, new Date(nowMs));
		if (expiry.status === "expired" && expiry.expiryDate) {
			const id = `notif-expired-${prod.id}`;
			const dedupeKey = `expired:${prod.id}`;
			seenKeys.add(dedupeKey);
			const st = resolveStatus(id, dedupeKey);
			items.push({
				id,
				dedupeKey,
				type: "EXPIRED_PRODUCT",
				severity: "CRITICAL",
				categoryLabelAr: "انتهاء الصلاحية",
				categoryLabelEn: "Expired Product",
				titleAr: `منتج منتهي الصلاحية: ${nameAr}`,
				titleEn: `Expired Product: ${nameEn}`,
				summaryAr: `تاريخ الانتهاء: ${expiry.expiryDate} (الكمية: ${prod.stock} وحدة).`,
				summaryEn: `Expiry Date: ${expiry.expiryDate} (Stock: ${prod.stock} units).`,
				detailsAr: `المنتج "${nameAr}" انتهت صلاحيته بتاريخ ${expiry.expiryDate} ويوجد منه ${prod.stock} وحدة في المخزون. يجب عزله فوراً أو تحديث تاريخ صلاحية الدفعة الجديدة.`,
				detailsEn: `Product "${nameEn}" expired on ${expiry.expiryDate} with ${prod.stock} units in stock. Quarantine stock or update batch expiry date.`,
				recommendationAr: "افتح بيانات المنتج لتحديث تاريخ الصلاحية أو خصم التالف من المخزون.",
				recommendationEn: "Open Products or Inventory to update batch expiry or record damage.",
				metricBadge: expiry.expiryDate,
				timestamp: prod.updatedAt || nowIso,
				status: st.status,
				resolutionNote: st.note,
				updatedAt: st.updatedAt,
				productId: prod.id,
				primaryActionTarget: "products",
				primaryActionLabelAr: "مراجعة المنتج والصلاحية",
				primaryActionLabelEn: "Inspect Product Expiry"
			});
		} else if (expiry.status === "expiring_soon" && expiry.expiryDate) {
			const id = `notif-expiring-soon-${prod.id}`;
			const dedupeKey = `expiring:${prod.id}`;
			seenKeys.add(dedupeKey);
			const st = resolveStatus(id, dedupeKey);
			items.push({
				id,
				dedupeKey,
				type: "EXPIRING_SOON",
				severity: "HIGH",
				categoryLabelAr: "قرب انتهاء الصلاحية",
				categoryLabelEn: "Expiring Soon",
				titleAr: `ينتهي قريباً: ${nameAr}`,
				titleEn: `Expiring Soon: ${nameEn}`,
				summaryAr: `ينتهي خلال ${expiry.daysRemaining} يوم (${expiry.expiryDate}).`,
				summaryEn: `Expires in ${expiry.daysRemaining} days (${expiry.expiryDate}).`,
				detailsAr: `المنتج "${nameAr}" يقترب من تاريخ انتهاء الصلاحية (${expiry.expiryDate}) ويتبقى له ${expiry.daysRemaining} يوم فقط مع وجود ${prod.stock} وحدة بالمخزون.`,
				detailsEn: `Product "${nameEn}" expires on ${expiry.expiryDate} (${expiry.daysRemaining} days left) with ${prod.stock} units in stock.`,
				recommendationAr: "ترويج الصنف لسرعة تصريفه أو مراجعة المورد للاستبدال.",
				recommendationEn: "Promote item for fast clearance or arrange supplier return.",
				metricBadge: `${expiry.daysRemaining} يوم`,
				timestamp: prod.updatedAt || nowIso,
				status: st.status,
				resolutionNote: st.note,
				updatedAt: st.updatedAt,
				productId: prod.id,
				primaryActionTarget: "products",
				primaryActionLabelAr: "عرض المنتج",
				primaryActionLabelEn: "View Product"
			});
		}
	}
	const unmetByProduct = /* @__PURE__ */ new Map();
	for (const req of unmetDemandRequests) {
		const rawName = (req.productNameArSnapshot || req.productNameSnapshot || "").trim();
		if (!rawName) continue;
		const key = rawName.toLowerCase();
		const prev = unmetByProduct.get(key);
		const units = Number(req.requestedBaseUnits || req.requestedQuantity || 1);
		const reqTs = req.requestedTimestamp || nowIso;
		if (!prev) unmetByProduct.set(key, {
			name: rawName,
			count: 1,
			totalUnits: units,
			lastTs: reqTs
		});
		else {
			prev.count += 1;
			prev.totalUnits += units;
			if (reqTs > prev.lastTs) prev.lastTs = reqTs;
		}
	}
	for (const [key, info] of unmetByProduct.entries()) {
		const id = `notif-unmet-${key}`;
		const dedupeKey = `unmet:${key}`;
		seenKeys.add(dedupeKey);
		const st = resolveStatus(id, dedupeKey);
		const isCritical = info.count >= 3;
		items.push({
			id,
			dedupeKey,
			type: "UNMET_DEMAND",
			severity: isCritical ? "CRITICAL" : info.count >= 2 ? "HIGH" : "MEDIUM",
			categoryLabelAr: "منتج مطلوب غير متوفر",
			categoryLabelEn: "Unmet Customer Demand",
			titleAr: `طلب زبائن على منتج غير متوفر: ${info.name}`,
			titleEn: `Customer Inquiry for Unavailable Item: ${info.name}`,
			summaryAr: `تم السؤال عنه ${info.count} مرات بإجمالي ${info.totalUnits} وحدة مطلوبة.`,
			summaryEn: `Asked ${info.count} time(s) for a total of ${info.totalUnits} requested units.`,
			detailsAr: `سأل الزبائن عن "${info.name}" عدد (${info.count}) مرات في أوقات مختلفة بإجمالي كمية مطلوبة (${info.totalUnits} وحدة). توفير هذا الصنف يساعد في زيادة المبيعات وتلبية احتياجات العملاء.`,
			detailsEn: `Customers inquired about "${info.name}" ${info.count} time(s) across different visits (${info.totalUnits} total units). Sourcing this item captures lost revenue.`,
			recommendationAr: "توفير المنتج من المورد وإضافته إلى كتالوج المنتجات.",
			recommendationEn: "Source this product from suppliers and add it to the catalog.",
			metricBadge: `${info.count}× طلب`,
			timestamp: info.lastTs,
			status: st.status,
			resolutionNote: st.note,
			updatedAt: st.updatedAt,
			primaryActionTarget: "reports",
			primaryActionLabelAr: "عرض في تقرير غير المتوفر",
			primaryActionLabelEn: "View in Unmet Demand Report"
		});
	}
	const openDebtTxns = transactions.filter((tx) => tx.status === "completed" && (tx.debtAmount || 0) > 0);
	if (openDebtTxns.length > 0) {
		const totalDebt = openDebtTxns.reduce((acc, tx) => acc + (tx.debtAmount || 0), 0);
		const id = "notif-open-sales-debts";
		const dedupeKey = "debt:open_invoices";
		seenKeys.add(dedupeKey);
		const st = resolveStatus(id, dedupeKey);
		items.push({
			id,
			dedupeKey,
			type: "CUSTOMER_DEBT",
			severity: openDebtTxns.length >= 3 ? "HIGH" : "MEDIUM",
			categoryLabelAr: "مديونيات الفواتير",
			categoryLabelEn: "Outstanding Invoice Debt",
			titleAr: `فواتير آجلة غير محصلة (${openDebtTxns.length} فاتورة)`,
			titleEn: `Uncollected Credit Invoices (${openDebtTxns.length} invoices)`,
			summaryAr: `توجد ${openDebtTxns.length} فاتورة تحتوي على مديونية متبقية تحتاج للتحصيل.`,
			summaryEn: `There are ${openDebtTxns.length} completed invoices with remaining unpaid debt.`,
			detailsAr: `يوجد عدد (${openDebtTxns.length}) فاتورة مبيعات لم يتم سداد كامل قيمتها بعد. يمكنك فتح سجل المبيعات لتسوية الأقساط أو تحصيل الديون المتبقية.`,
			detailsEn: `There are ${openDebtTxns.length} sales transactions with outstanding balances. Open Sales History to record installment payments.`,
			recommendationAr: "افتح صفحة المبيعات لتسوية المديونية أو تسجيل دفعة جديدة.",
			recommendationEn: "Open Sales History to settle outstanding customer debt.",
			metricBadge: `${openDebtTxns.length} فواتير`,
			timestamp: openDebtTxns[0]?.timestamp || nowIso,
			status: st.status,
			resolutionNote: st.note,
			updatedAt: st.updatedAt,
			primaryActionTarget: "sales",
			primaryActionLabelAr: "فتح المبيعات لتحصيل الديون",
			primaryActionLabelEn: "Open Sales to Settle Debt",
			evidenceMetrics: [{
				name: "عدد الفواتير / Invoices",
				valueFormatted: String(openDebtTxns.length)
			}, {
				name: "إجمالي المتبقي / Total Debt",
				valueFormatted: totalDebt.toLocaleString()
			}]
		});
	} else {
		const indebtedCustomers = customers.filter((c) => (c.totalDebt || 0) > 0);
		if (indebtedCustomers.length > 0) {
			const id = "notif-customer-accounts-debt";
			const dedupeKey = "debt:customers";
			seenKeys.add(dedupeKey);
			const st = resolveStatus(id, dedupeKey);
			items.push({
				id,
				dedupeKey,
				type: "CUSTOMER_DEBT",
				severity: "MEDIUM",
				categoryLabelAr: "ذمم العملاء",
				categoryLabelEn: "Customer Balances",
				titleAr: `ذمم عملاء مستحقة (${indebtedCustomers.length} عميل)`,
				titleEn: `Customer Outstanding Balances (${indebtedCustomers.length})`,
				summaryAr: `يوجد ${indebtedCustomers.length} عميل لديهم أرصدة مديونية مسجلة.`,
				summaryEn: `${indebtedCustomers.length} customer account(s) have outstanding debt balances.`,
				detailsAr: `توجد ذمم مالية مسجلة على ${indebtedCustomers.length} من حسابات العملاء. راجع قائمة العملاء لمتابعة السداد.`,
				detailsEn: `${indebtedCustomers.length} customer account(s) carry open debt balances. Review Customers directory for follow-up.`,
				recommendationAr: "مراجعة صفحة العملاء لتحديث الأرصدة أو تحصيل الذمم.",
				recommendationEn: "Open Customers directory to review and collect balances.",
				metricBadge: `${indebtedCustomers.length} عملاء`,
				timestamp: nowIso,
				status: st.status,
				resolutionNote: st.note,
				updatedAt: st.updatedAt,
				primaryActionTarget: "customers",
				primaryActionLabelAr: "فتح حسابات العملاء",
				primaryActionLabelEn: "Open Customers Directory"
			});
		}
	}
	for (const alert of smartAlerts) {
		const dedupeKey = alert.dedupeKey || `smart_alert:${alert.id}`;
		if (seenKeys.has(dedupeKey)) continue;
		seenKeys.add(dedupeKey);
		const st = resolveStatus(alert.id, dedupeKey, alert.lifecycleStatus || "active");
		const actionMeta = resolveSmartAlertQuickAction(alert);
		const sev = alert.severity === "CRITICAL" ? "CRITICAL" : alert.severity === "HIGH" ? "HIGH" : alert.severity === "MEDIUM" ? "MEDIUM" : "LOW";
		items.push({
			id: alert.id,
			dedupeKey,
			type: "SMART_BI_ALERT",
			severity: sev,
			categoryLabelAr: "تنبيه ذكي وتشغيلي",
			categoryLabelEn: "Smart Operational Alert",
			titleAr: alert.titleAr,
			titleEn: alert.titleEn,
			summaryAr: alert.descriptionAr,
			summaryEn: alert.descriptionEn,
			detailsAr: `${alert.descriptionAr} — ${alert.explanationAr}`,
			detailsEn: `${alert.descriptionEn} — ${alert.explanationEn}`,
			recommendationAr: alert.recommendedActionAr,
			recommendationEn: alert.recommendedActionEn,
			metricBadge: alert.evidenceMetrics?.[0]?.valueFormatted,
			timestamp: nowIso,
			status: st.status,
			resolutionNote: st.note,
			updatedAt: st.updatedAt,
			productId: alert.productId || void 0,
			primaryActionTarget: actionMeta.target,
			primaryActionLabelAr: actionMeta.labelAr,
			primaryActionLabelEn: actionMeta.labelEn,
			evidenceMetrics: alert.evidenceMetrics?.map((m) => ({
				name: m.name,
				valueFormatted: m.valueFormatted,
				comparisonText: m.comparisonText
			}))
		});
	}
	return items.sort((a, b) => {
		const aActive = a.status === "active" ? 1 : 0;
		const bActive = b.status === "active" ? 1 : 0;
		if (aActive !== bActive) return bActive - aActive;
		const sevDiff = SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity];
		if (sevDiff !== 0) return sevDiff;
		return b.timestamp.localeCompare(a.timestamp);
	});
}
function computeNotificationSummaryCounts(items) {
	let active = 0;
	let acknowledged = 0;
	let resolved = 0;
	let dismissed = 0;
	let criticalActive = 0;
	let highActive = 0;
	for (const item of items) if (item.status === "active") {
		active += 1;
		if (item.severity === "CRITICAL") criticalActive += 1;
		if (item.severity === "HIGH") highActive += 1;
	} else if (item.status === "acknowledged") acknowledged += 1;
	else if (item.status === "resolved") resolved += 1;
	else if (item.status === "dismissed") dismissed += 1;
	return {
		total: items.length,
		active,
		acknowledged,
		resolved,
		dismissed,
		criticalActive,
		highActive
	};
}
// src/components/layout/NotificationsBellModal.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var NotificationsBellModal = ({ isOpen, onClose, isAr, notifications, initialSelectedNotificationId = null, initialSelectedId = null, onUpdateStatus, onMarkAllAcknowledged, onMarkAllRead, onExecutePrimaryAction }) => {
	const effectiveInitialId = initialSelectedNotificationId ?? initialSelectedId ?? null;
	const effectiveMarkAll = onMarkAllAcknowledged || onMarkAllRead;
	const [filterTab, setFilterTab] = (0, import_react.useState)("active");
	const [selectedId, setSelectedId] = (0, import_react.useState)(effectiveInitialId);
	const [resolutionNoteDraft, setResolutionNoteDraft] = (0, import_react.useState)("");
	const [actionFeedback, setActionFeedback] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (isOpen) {
			setSelectedId(effectiveInitialId);
			setActionFeedback(null);
		}
	}, [isOpen, effectiveInitialId]);
	const counts = (0, import_react.useMemo)(() => computeNotificationSummaryCounts(notifications), [notifications]);
	const selectedNotification = (0, import_react.useMemo)(() => {
		if (!selectedId) return null;
		return notifications.find((n) => n.id === selectedId || n.dedupeKey === selectedId) || null;
	}, [notifications, selectedId]);
	(0, import_react.useEffect)(() => {
		if (selectedNotification) setResolutionNoteDraft(selectedNotification.resolutionNote || "");
		else setResolutionNoteDraft("");
	}, [selectedNotification]);
	const filteredList = (0, import_react.useMemo)(() => {
		return notifications.filter((item) => {
			if (filterTab === "active") return item.status === "active" || item.status === "acknowledged";
			if (filterTab === "stock_expiry") return item.type === "OUT_OF_STOCK" || item.type === "LOW_STOCK" || item.type === "EXPIRED_PRODUCT" || item.type === "EXPIRING_SOON";
			if (filterTab === "unmet_demand") return item.type === "UNMET_DEMAND";
			if (filterTab === "handled") return item.status === "resolved" || item.status === "dismissed";
			return true;
		});
	}, [notifications, filterTab]);
	const getSeverityBadge = (sev) => {
		if (sev === "CRITICAL") return {
			label: isAr ? "حرج جداً" : "Critical",
			cls: "text-rose-400",
			border: "border-rose-500/40 bg-rose-950/20"
		};
		if (sev === "HIGH") return {
			label: isAr ? "أولوية عالية" : "High Priority",
			cls: "text-amber-400",
			border: "border-amber-500/40 bg-amber-950/20"
		};
		return {
			label: isAr ? "تنبيه تشغيلي" : "Operational",
			cls: "text-sky-400",
			border: "border-neutral-800 bg-neutral-900/90"
		};
	};
	const getStatusLabel = (st) => {
		const map = {
			active: {
				ar: "نشط (جديد)",
				en: "Active",
				cls: "text-rose-400"
			},
			acknowledged: {
				ar: "تم الاطلاع",
				en: "Acknowledged",
				cls: "text-amber-400"
			},
			resolved: {
				ar: "تم الحل والمعالجة",
				en: "Resolved",
				cls: "text-emerald-400"
			},
			dismissed: {
				ar: "تم التجاهل",
				en: "Dismissed",
				cls: "text-neutral-400"
			}
		};
		return map[st] || map.active;
	};
	const getTypeIcon = (type) => {
		switch (type) {
			case "OUT_OF_STOCK":
			case "LOW_STOCK": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "w-4 h-4 text-amber-400 shrink-0" });
			case "EXPIRED_PRODUCT":
			case "EXPIRING_SOON": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4 text-rose-400 shrink-0" });
			case "UNMET_DEMAND": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageX, { className: "w-4 h-4 text-rose-400 shrink-0" });
			case "CUSTOMER_DEBT": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "w-4 h-4 text-sky-400 shrink-0" });
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-amber-400 shrink-0" });
		}
	};
	const handleStatusButtonClick = (item, nextStatus) => {
		onUpdateStatus(item, nextStatus, resolutionNoteDraft.trim() || void 0);
		const statusText = getStatusLabel(nextStatus);
		setActionFeedback(isAr ? `تم تحديث حالة التنبيه إلى: ${statusText.ar}` : `Alert status updated to: ${statusText.en}`);
		setTimeout(() => setActionFeedback(null), 2500);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
		isOpen,
		onClose,
		title: isAr ? `جرس التنبيهات ومركز المتابعة (${counts.active} نشط)` : `Notifications Bell & Action Center (${counts.active} Active)`,
		description: isAr ? "اضغط على أي تنبيه لعرض التفاصيل الكاملة والتعامل معه فوراً أو تحديث حالته" : "Click any notification to view full diagnostic details and take immediate operational action",
		maxWidth: "2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-testid": "notifications-bell-modal-content",
			className: "flex flex-col gap-4 max-h-[76vh] overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-neutral-950 border border-neutral-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 font-bold text-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "w-4 h-4 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									isAr ? "النشطة:" : "Active:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-mono tabular-nums text-amber-400",
										children: counts.active
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-neutral-700",
								"aria-hidden": "true",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-rose-400 font-semibold",
								children: [
									isAr ? "حرجة:" : "Critical:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-mono tabular-nums",
										children: counts.criticalActive
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-neutral-700",
								"aria-hidden": "true",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-amber-300 font-semibold",
								children: [
									isAr ? "تم الاطلاع:" : "Acknowledged:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-mono tabular-nums",
										children: counts.acknowledged
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-neutral-700",
								"aria-hidden": "true",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-emerald-400 font-semibold",
								children: [
									isAr ? "تم حلها:" : "Resolved:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-mono tabular-nums",
										children: counts.resolved
									})
								]
							})
						]
					}), counts.active > 0 && effectiveMarkAll && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": "notifications-mark-all-read-btn",
						onClick: effectiveMarkAll,
						className: "px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold text-amber-300 flex items-center gap-1.5 transition-colors whitespace-nowrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تحديد الكل كمقروء" : "Acknowledge All" })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none",
					children: [
						{
							id: "active",
							labelAr: `التنبيهات النشطة (${counts.active + counts.acknowledged})`,
							labelEn: `Active (${counts.active + counts.acknowledged})`
						},
						{
							id: "all",
							labelAr: `الكل (${counts.total})`,
							labelEn: `All (${counts.total})`
						},
						{
							id: "stock_expiry",
							labelAr: "المخزون والصلاحية",
							labelEn: "Stock & Expiry"
						},
						{
							id: "unmet_demand",
							labelAr: "طلبات غير متوفرة",
							labelEn: "Unmet Demand"
						},
						{
							id: "handled",
							labelAr: `تم التعامل معها (${counts.resolved + counts.dismissed})`,
							labelEn: `Handled (${counts.resolved + counts.dismissed})`
						}
					].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-testid": `notifications-filter-tab-${tab.id}`,
						onClick: () => {
							setFilterTab(tab.id);
							setSelectedId(null);
						},
						className: `px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${filterTab === tab.id && !selectedNotification ? "bg-amber-500 text-neutral-950 border-amber-400" : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white"}`,
						children: isAr ? tab.labelAr : tab.labelEn
					}, tab.id))
				}),
				actionFeedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 shrink-0 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: actionFeedback })]
				}),
				selectedNotification ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-testid": "notification-detail-action-panel",
					className: "flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-neutral-950 border border-amber-500/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 pb-3 border-b border-neutral-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "notification-back-to-list-btn",
								onClick: () => setSelectedId(null),
								className: "px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-200 flex items-center gap-1.5 transition-colors",
								children: [isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4 text-amber-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "العودة لقائمة التنبيهات" : "Back to Notifications List" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: getSeverityBadge(selectedNotification.severity).cls + " font-bold",
										children: getSeverityBadge(selectedNotification.severity).label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-neutral-600",
										"aria-hidden": "true",
										children: "·"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: getStatusLabel(selectedNotification.status).cls + " font-bold",
										children: isAr ? getStatusLabel(selectedNotification.status).ar : getStatusLabel(selectedNotification.status).en
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs text-neutral-400",
								children: [
									getTypeIcon(selectedNotification.type),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? selectedNotification.categoryLabelAr : selectedNotification.categoryLabelEn }),
									selectedNotification.metricBadge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										children: "·"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-amber-400 tabular-nums",
										children: selectedNotification.metricBadge
									})] })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base sm:text-lg font-extrabold text-white",
								children: isAr ? selectedNotification.titleAr : selectedNotification.titleEn
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-bold text-amber-400",
								children: isAr ? "التفاصيل والتشخيص الكامل:" : "Full Diagnostic Details:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs sm:text-sm text-neutral-200 leading-relaxed",
								children: isAr ? selectedNotification.detailsAr : selectedNotification.detailsEn
							})]
						}),
						selectedNotification.evidenceMetrics && selectedNotification.evidenceMetrics.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
							children: selectedNotification.evidenceMetrics.map((m, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 rounded-xl bg-neutral-900 border border-neutral-800",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-neutral-400",
										children: m.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs sm:text-sm font-mono font-bold text-white tabular-nums mt-0.5",
										children: m.valueFormatted
									}),
									m.comparisonText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-amber-300 mt-0.5",
										children: m.comparisonText
									})
								]
							}, idx))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold text-emerald-400",
									children: isAr ? "التوصية والإجراء المقترح للتعامل مع التنبيه:" : "Recommended Operational Action:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs sm:text-sm text-emerald-200 font-medium leading-relaxed",
									children: isAr ? selectedNotification.recommendationAr : selectedNotification.recommendationEn
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": "notification-execute-primary-action-btn",
										onClick: () => onExecutePrimaryAction(selectedNotification),
										className: "px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-extrabold inline-flex items-center gap-2 transition-colors shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? selectedNotification.primaryActionLabelAr : selectedNotification.primaryActionLabelEn }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-white",
									children: isAr ? "ملاحظة المعالجة / الإجراء المتخذ (اختياري):" : "Handling / Resolution Note (Optional):"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									"data-testid": "notification-resolution-note-input",
									value: resolutionNoteDraft,
									onChange: (e) => setResolutionNoteDraft(e.target.value),
									placeholder: isAr ? "اكتب ما تم اتخاذه بشأن هذا التنبيه (مثال: تم طلب البضاعة من المورد)..." : "Record how this alert was handled (e.g. Ordered restock from supplier)...",
									className: "w-full min-h-[38px] px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2 pt-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											"data-testid": "notification-action-acknowledge-btn",
											onClick: () => handleStatusButtonClick(selectedNotification, "acknowledged"),
											className: `px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${selectedNotification.status === "acknowledged" ? "bg-amber-500 text-neutral-950 border-amber-400" : "bg-neutral-950 text-amber-300 border-amber-500/40 hover:bg-amber-500/15"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تم الاطلاع والمتابعة" : "Acknowledge" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											"data-testid": "notification-action-resolve-btn",
											onClick: () => handleStatusButtonClick(selectedNotification, "resolved"),
											className: `px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${selectedNotification.status === "resolved" ? "bg-emerald-500 text-neutral-950 border-emerald-400" : "bg-neutral-950 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/15"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تم الحل والمعالجة" : "Mark Resolved" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											"data-testid": "notification-action-dismiss-btn",
											onClick: () => handleStatusButtonClick(selectedNotification, "dismissed"),
											className: `px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${selectedNotification.status === "dismissed" ? "bg-neutral-200 text-neutral-950 border-white" : "bg-neutral-950 text-neutral-400 border-neutral-700 hover:text-white"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تجاهل التنبيه" : "Dismiss" })]
										}),
										selectedNotification.status !== "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											"data-testid": "notification-action-reopen-btn",
											onClick: () => handleStatusButtonClick(selectedNotification, "active"),
											className: "px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-rose-500/40 bg-neutral-950 text-rose-300 hover:bg-rose-500/15 transition-colors",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "إعادة تفعيل كنشط" : "Reopen Alert" })]
										})
									]
								})
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-testid": "notifications-bell-list",
					className: "flex-1 overflow-y-auto space-y-2 pr-1 max-h-[52vh]",
					children: filteredList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-8 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-center space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-8 h-8 text-neutral-600 mx-auto" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-neutral-300",
								children: isAr ? "لا توجد تنبيهات ضمن هذا التصنيف حالياً" : "No notifications in this filter right now"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-neutral-500",
								children: isAr ? "جميع المؤشرات التشغيلية والمخزون في حالة مستقرة." : "All operational and inventory indicators are healthy."
							})
						]
					}) : filteredList.map((item) => {
						const sevMeta = getSeverityBadge(item.severity);
						const statusMeta = getStatusLabel(item.status);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"data-testid": `notification-bell-item-${item.id}`,
							onClick: () => setSelectedId(item.id),
							role: "button",
							tabIndex: 0,
							onKeyDown: (e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									setSelectedId(item.id);
								}
							},
							className: `p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-amber-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${sevMeta.border}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-9 h-9 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0 mt-0.5",
									children: getTypeIcon(item.type)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-400",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `font-bold ${sevMeta.cls}`,
													children: sevMeta.label
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													"aria-hidden": "true",
													children: "·"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? item.categoryLabelAr : item.categoryLabelEn }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													"aria-hidden": "true",
													children: "·"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `font-semibold ${statusMeta.cls}`,
													children: isAr ? statusMeta.ar : statusMeta.en
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs sm:text-sm font-bold text-white truncate",
											children: isAr ? item.titleAr : item.titleEn
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-neutral-300 line-clamp-1",
											children: isAr ? item.summaryAr : item.summaryEn
										}),
										item.resolutionNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-emerald-400 truncate",
											children: isAr ? `ملاحظة المعالجة: ${item.resolutionNote}` : `Note: ${item.resolutionNote}`
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800/80",
								children: [item.metricBadge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs font-bold text-amber-400 tabular-nums",
									children: item.metricBadge
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"data-testid": `notification-open-details-btn-${item.id}`,
									onClick: (e) => {
										e.stopPropagation();
										setSelectedId(item.id);
									},
									className: "px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 border border-amber-500/40 text-xs font-bold transition-colors whitespace-nowrap",
									children: isAr ? "التفاصيل والتعامل" : "Details & Handle"
								})]
							})]
						}, item.id);
					})
				})
			]
		})
	});
};
// node_modules/@capacitor-mlkit/barcode-scanning/dist/esm/definitions.js
/**
* @since 0.0.1
*/
var BarcodeFormat;
(function(BarcodeFormat) {
	/**
	* Only available on Android and iOS.
	*
	* @since 0.0.1
	*/
	BarcodeFormat["Aztec"] = "AZTEC";
	/**
	* Only available on Android and iOS.
	*
	* @since 0.0.1
	*/
	BarcodeFormat["Codabar"] = "CODABAR";
	/**
	* Only available on Android and iOS.
	*
	* @since 0.0.1
	*/
	BarcodeFormat["Code39"] = "CODE_39";
	/**
	* Only available on Android and iOS.
	*
	* @since 0.0.1
	*/
	BarcodeFormat["Code93"] = "CODE_93";
	/**
	* Only available on Android and iOS.
	*
	* @since 0.0.1
	*/
	BarcodeFormat["Code128"] = "CODE_128";
	/**
	* Only available on Android and iOS.
	*
	* @since 0.0.1
	*/
	BarcodeFormat["DataMatrix"] = "DATA_MATRIX";
	/**
	* Only available on Android and iOS.
	*
	* @since 0.0.1
	*/
	BarcodeFormat["Ean8"] = "EAN_8";
	/**
	* Only available on Android and iOS.
	*
	* @since 0.0.1
	*/
	BarcodeFormat["Ean13"] = "EAN_13";
	/**
	* Only available on Android and iOS.
	*
	* @since 0.0.1
	*/
	BarcodeFormat["Itf"] = "ITF";
	/**
	* Only available on Android and iOS.
	*
	* @since 0.0.1
	*/
	BarcodeFormat["Pdf417"] = "PDF_417";
	/**
	* Only available on Android and iOS.
	*
	* @since 0.0.1
	*/
	BarcodeFormat["QrCode"] = "QR_CODE";
	/**
	* Only available on Android and iOS.
	*
	* @since 0.0.1
	*/
	BarcodeFormat["UpcA"] = "UPC_A";
	/**
	* Only available on Android and iOS.
	*
	* @since 0.0.1
	*/
	BarcodeFormat["UpcE"] = "UPC_E";
})(BarcodeFormat || (BarcodeFormat = {}));
/**
* @since 0.0.1
*/
var BarcodeValueType;
(function(BarcodeValueType) {
	/**
	* @since 0.0.1
	*/
	BarcodeValueType["CalendarEvent"] = "CALENDAR_EVENT";
	/**
	* @since 0.0.1
	*/
	BarcodeValueType["ContactInfo"] = "CONTACT_INFO";
	/**
	* @since 0.0.1
	*/
	BarcodeValueType["DriversLicense"] = "DRIVERS_LICENSE";
	/**
	* @since 0.0.1
	*/
	BarcodeValueType["Email"] = "EMAIL";
	/**
	* @since 0.0.1
	*/
	BarcodeValueType["Geo"] = "GEO";
	/**
	* @since 0.0.1
	*/
	BarcodeValueType["Isbn"] = "ISBN";
	/**
	* @since 0.0.1
	*/
	BarcodeValueType["Phone"] = "PHONE";
	/**
	* @since 0.0.1
	*/
	BarcodeValueType["Product"] = "PRODUCT";
	/**
	* @since 0.0.1
	*/
	BarcodeValueType["Sms"] = "SMS";
	/**
	* @since 0.0.1
	*/
	BarcodeValueType["Text"] = "TEXT";
	/**
	* @since 0.0.1
	*/
	BarcodeValueType["Url"] = "URL";
	/**
	* @since 0.0.1
	*/
	BarcodeValueType["Wifi"] = "WIFI";
	/**
	* @since 0.0.1
	*/
	BarcodeValueType["Unknown"] = "UNKNOWN";
})(BarcodeValueType || (BarcodeValueType = {}));
/**
* @since 7.0.0
*/
var Resolution;
(function(Resolution) {
	/**
	* @since 7.0.0
	*/
	Resolution[Resolution["640x480"] = 0] = "640x480";
	/**
	* @since 7.0.0
	*/
	Resolution[Resolution["1280x720"] = 1] = "1280x720";
	/**
	* @since 7.0.0
	*/
	Resolution[Resolution["1920x1080"] = 2] = "1920x1080";
	/**
	* @since 7.2.0
	*/
	Resolution[Resolution["3840x2160"] = 3] = "3840x2160";
})(Resolution || (Resolution = {}));
/**
* @since 0.0.1
*/
var LensFacing;
(function(LensFacing) {
	/**
	* @since 0.0.1
	*/
	LensFacing["Front"] = "FRONT";
	/**
	* @since 0.0.1
	*/
	LensFacing["Back"] = "BACK";
})(LensFacing || (LensFacing = {}));
/**
* @since 5.1.0
*/
var GoogleBarcodeScannerModuleInstallState;
(function(GoogleBarcodeScannerModuleInstallState) {
	/**
	* @since 5.1.0
	*/
	GoogleBarcodeScannerModuleInstallState[GoogleBarcodeScannerModuleInstallState["UNKNOWN"] = 0] = "UNKNOWN";
	/**
	* @since 5.1.0
	*/
	GoogleBarcodeScannerModuleInstallState[GoogleBarcodeScannerModuleInstallState["PENDING"] = 1] = "PENDING";
	/**
	* @since 5.1.0
	*/
	GoogleBarcodeScannerModuleInstallState[GoogleBarcodeScannerModuleInstallState["DOWNLOADING"] = 2] = "DOWNLOADING";
	/**
	* @since 5.1.0
	*/
	GoogleBarcodeScannerModuleInstallState[GoogleBarcodeScannerModuleInstallState["CANCELED"] = 3] = "CANCELED";
	/**
	* @since 5.1.0
	*/
	GoogleBarcodeScannerModuleInstallState[GoogleBarcodeScannerModuleInstallState["COMPLETED"] = 4] = "COMPLETED";
	/**
	* @since 5.1.0
	*/
	GoogleBarcodeScannerModuleInstallState[GoogleBarcodeScannerModuleInstallState["FAILED"] = 5] = "FAILED";
	/**
	* @since 5.1.0
	*/
	GoogleBarcodeScannerModuleInstallState[GoogleBarcodeScannerModuleInstallState["INSTALLING"] = 6] = "INSTALLING";
	/**
	* @since 5.1.0
	*/
	GoogleBarcodeScannerModuleInstallState[GoogleBarcodeScannerModuleInstallState["DOWNLOAD_PAUSED"] = 7] = "DOWNLOAD_PAUSED";
})(GoogleBarcodeScannerModuleInstallState || (GoogleBarcodeScannerModuleInstallState = {}));
/**
* @since 7.0.0
*/
var AddressType;
(function(AddressType) {
	/**
	* @since 7.0.0
	*/
	AddressType[AddressType["HOME"] = 0] = "HOME";
	/**
	* @since 7.0.0
	*/
	AddressType[AddressType["UNKNOWN"] = 1] = "UNKNOWN";
	/**
	* @since 7.0.0
	*/
	AddressType[AddressType["WORK"] = 2] = "WORK";
})(AddressType || (AddressType = {}));
/**
* @since 7.0.0
*/
var EmailFormatType;
(function(EmailFormatType) {
	/**
	* @since 7.0.0
	*/
	EmailFormatType[EmailFormatType["HOME"] = 0] = "HOME";
	/**
	* @since 7.0.0
	*/
	EmailFormatType[EmailFormatType["UNKNOWN"] = 1] = "UNKNOWN";
	/**
	* @since 7.0.0
	*/
	EmailFormatType[EmailFormatType["WORK"] = 2] = "WORK";
})(EmailFormatType || (EmailFormatType = {}));
/**
* @since 7.0.0
*/
var PhoneFormatType;
(function(PhoneFormatType) {
	/**
	* @since 7.0.0
	*/
	PhoneFormatType[PhoneFormatType["FAX"] = 0] = "FAX";
	/**
	* @since 7.0.0
	*/
	PhoneFormatType[PhoneFormatType["HOME"] = 1] = "HOME";
	/**
	* @since 7.0.0
	*/
	PhoneFormatType[PhoneFormatType["MOBILE"] = 2] = "MOBILE";
	/**
	* @since 7.0.0
	*/
	PhoneFormatType[PhoneFormatType["UNKNOWN"] = 3] = "UNKNOWN";
	/**
	* @since 7.0.0
	*/
	PhoneFormatType[PhoneFormatType["WORK"] = 4] = "WORK";
})(PhoneFormatType || (PhoneFormatType = {}));
/**
* @since 7.0.0
*/
var WifiEncryptionType;
(function(WifiEncryptionType) {
	/**
	* @since 7.0.0
	*/
	WifiEncryptionType[WifiEncryptionType["OPEN"] = 1] = "OPEN";
	/**
	* @since 7.0.0
	*/
	WifiEncryptionType[WifiEncryptionType["WEP"] = 2] = "WEP";
	/**
	* @since 7.0.0
	*/
	WifiEncryptionType[WifiEncryptionType["WPA"] = 3] = "WPA";
})(WifiEncryptionType || (WifiEncryptionType = {}));
// node_modules/@capacitor-mlkit/barcode-scanning/dist/esm/index.js
var BarcodeScanner = registerPlugin("BarcodeScanner", { web: () => __vitePreload(() => import("./web-EkuYvCQS.js").then((m) => new m.BarcodeScannerWeb()), __vite__mapDeps([0,1])) });
// src/lib/barcode-scanner-engine.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
function resolveZXingModule(mod) {
	const defaultExport = Reflect.get(mod, "default");
	if (defaultExport && typeof defaultExport === "object" && "MultiFormatOneDReader" in defaultExport) return defaultExport;
	return mod;
}
var { MultiFormatOneDReader, QRCodeReader, DataMatrixReader, PDF417Reader, BarcodeFormat: ZXingBarcodeFormat, DecodeHintType, RGBLuminanceSource, BinaryBitmap, HybridBinarizer, GlobalHistogramBinarizer, MultiFormatWriter } = resolveZXingModule(esm_exports);
/**
* Phase 3: Enabled Barcode Formats across Web & Native Android ML Kit
*/
var ENABLED_BARCODE_FORMAT_LABELS = [
	"EAN-13",
	"EAN-8",
	"UPC-A",
	"UPC-E",
	"CODE-128",
	"CODE-39",
	"CODE-93",
	"ITF",
	"QR_CODE",
	"PDF417",
	"DATA_MATRIX"
];
var WEB_DETECTOR_FORMATS = [
	"ean_13",
	"ean_8",
	"upc_a",
	"upc_e",
	"code_128",
	"code_39",
	"code_93",
	"itf",
	"qr_code",
	"pdf417",
	"data_matrix"
];
var MLKIT_BARCODE_FORMATS = [
	BarcodeFormat.Ean13,
	BarcodeFormat.Ean8,
	BarcodeFormat.UpcA,
	BarcodeFormat.UpcE,
	BarcodeFormat.Code128,
	BarcodeFormat.Code39,
	BarcodeFormat.Code93,
	BarcodeFormat.Itf,
	BarcodeFormat.QrCode,
	BarcodeFormat.Pdf417,
	BarcodeFormat.DataMatrix
];
var ZXING_FORMATS = [
	ZXingBarcodeFormat.EAN_13,
	ZXingBarcodeFormat.EAN_8,
	ZXingBarcodeFormat.UPC_A,
	ZXingBarcodeFormat.UPC_E,
	ZXingBarcodeFormat.CODE_128,
	ZXingBarcodeFormat.CODE_39,
	ZXingBarcodeFormat.CODE_93,
	ZXingBarcodeFormat.ITF,
	ZXingBarcodeFormat.QR_CODE,
	ZXingBarcodeFormat.PDF_417,
	ZXingBarcodeFormat.DATA_MATRIX
];
function isNativeCapacitorEnvironment() {
	try {
		return Capacitor.isNativePlatform();
	} catch {
		return false;
	}
}
var diagnosticsState = {
	environment: isNativeCapacitorEnvironment() ? "Native" : "Web",
	platform: (() => {
		try {
			return Capacitor.getPlatform();
		} catch {
			return "web";
		}
	})(),
	engineName: isNativeCapacitorEnvironment() ? "Google ML Kit (@capacitor-mlkit/barcode-scanning)" : "BarcodeDetector (ZXing-WASM Polyfill) + ZXing MultiFormatReader",
	cameraStatus: "Idle",
	enabledFormats: [...ENABLED_BARCODE_FORMAT_LABELS],
	framesProcessed: 0,
	skippedDuplicateFrames: 0,
	lastDetectedValue: null,
	lastDetectedFormat: null,
	lastError: null,
	torchAvailable: false,
	torchEnabled: false,
	zoomAvailable: false,
	zoomRatio: 1,
	minZoom: 1,
	maxZoom: 1,
	logs: []
};
var listeners = /* @__PURE__ */ new Set();
function notifyDiagnosticsListeners() {
	const snapshot = {
		...diagnosticsState,
		logs: [...diagnosticsState.logs]
	};
	listeners.forEach((cb) => cb(snapshot));
}
function getScannerDiagnostics() {
	return {
		...diagnosticsState,
		logs: [...diagnosticsState.logs]
	};
}
function subscribeScannerDiagnostics(listener) {
	listeners.add(listener);
	listener(getScannerDiagnostics());
	return () => {
		listeners.delete(listener);
	};
}
function updateScannerDiagnostics(partial) {
	diagnosticsState = {
		...diagnosticsState,
		...partial
	};
	notifyDiagnosticsListeners();
}
function recordScannerStage(stage, detail) {
	const timestamp = (/* @__PURE__ */ new Date()).toISOString().slice(11, 23);
	const entry = {
		id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
		timestamp,
		stage,
		detail
	};
	console.info(`[POS-BarcodeScanner] [${stage}] ${detail}`);
	diagnosticsState = {
		...diagnosticsState,
		...stage === "Scanner Error" ? { lastError: detail } : {},
		logs: [entry, ...diagnosticsState.logs].slice(0, 40)
	};
	notifyDiagnosticsListeners();
}
function resetScannerDiagnosticsLogs() {
	diagnosticsState = {
		...diagnosticsState,
		framesProcessed: 0,
		skippedDuplicateFrames: 0,
		lastError: null,
		logs: []
	};
	notifyDiagnosticsListeners();
}
var webPonyfillDetector = null;
var nativeBrowserDetector = null;
var zxingOneDReader = null;
var zxingQrReader = null;
var zxingDataMatrixReader = null;
var zxingPdf417Reader = null;
var zxingHints = null;
var engineInitializedLogged = false;
function ensureWebEnginesInitialized() {
	if (!zxingOneDReader) {
		const hints = /* @__PURE__ */ new Map();
		hints.set(DecodeHintType.POSSIBLE_FORMATS, ZXING_FORMATS);
		hints.set(DecodeHintType.TRY_HARDER, true);
		zxingHints = hints;
		zxingOneDReader = new MultiFormatOneDReader(hints);
		zxingQrReader = new QRCodeReader();
		zxingDataMatrixReader = new DataMatrixReader();
		zxingPdf417Reader = new PDF417Reader();
	}
	if (!webPonyfillDetector) try {
		webPonyfillDetector = new I({ formats: WEB_DETECTOR_FORMATS });
	} catch (err) {
		recordScannerStage("Scanner Error", `PonyfillBarcodeDetector init warning: ${err?.message || String(err)}`);
	}
	if (!nativeBrowserDetector && typeof window !== "undefined" && "BarcodeDetector" in window) try {
		const NativeClass = window.BarcodeDetector;
		nativeBrowserDetector = new NativeClass({ formats: WEB_DETECTOR_FORMATS });
	} catch {
		try {
			const NativeClass = window.BarcodeDetector;
			nativeBrowserDetector = new NativeClass();
		} catch {
			nativeBrowserDetector = null;
		}
	}
	if (!engineInitializedLogged) {
		engineInitializedLogged = true;
		const hasNative = Boolean(nativeBrowserDetector);
		const engineLabel = isNativeCapacitorEnvironment() ? "Google ML Kit (@capacitor-mlkit/barcode-scanning)" : hasNative ? "Native BarcodeDetector + ZXing-WASM Polyfill + ZXing 1D/2D" : "ZXing-WASM BarcodeDetector Polyfill + ZXing 1D/2D Engine";
		updateScannerDiagnostics({
			environment: isNativeCapacitorEnvironment() ? "Native" : "Web",
			engineName: engineLabel
		});
		recordScannerStage("Barcode Engine Initialized", `${engineLabel} (${ENABLED_BARCODE_FORMAT_LABELS.join(", ")})`);
	}
}
function tryDecodeBitmapWithZXingReaders(bitmap, passLabel) {
	const readers = [
		{
			reader: zxingOneDReader,
			name: "ZXing-1D"
		},
		{
			reader: zxingQrReader,
			name: "ZXing-QR"
		},
		{
			reader: zxingPdf417Reader,
			name: "ZXing-PDF417"
		},
		{
			reader: zxingDataMatrixReader,
			name: "ZXing-DataMatrix"
		}
	];
	for (const { reader, name } of readers) {
		if (!reader) continue;
		try {
			const result = reader.decode(bitmap, zxingHints || void 0);
			const rawText = String(result?.getText?.() ?? "").trim();
			if (rawText.length > 0) return {
				rawValue: rawText,
				format: ZXingBarcodeFormat[result.getBarcodeFormat()] || "UNKNOWN",
				engine: `${name} (${passLabel})`
			};
		} catch {} finally {
			try {
				reader.reset?.();
			} catch {}
		}
	}
	return null;
}
/**
* Pure RGBA ImageData decoder using @zxing/library 1D + 2D readers.
* Runs synchronously in < 2ms in both Browser and Node.js test environments,
* preserving leading zeros by always returning raw text as a String.
*/
function decodeBarcodeFromRGBA(rgbaData, width, height) {
	if (!rgbaData || width <= 0 || height <= 0) return null;
	ensureWebEnginesInitialized();
	const pixelCount = width * height;
	const luminances = new Uint8ClampedArray(pixelCount);
	for (let i = 0, j = 0; i < pixelCount; i++, j += 4) {
		const r = rgbaData[j];
		const g = rgbaData[j + 1];
		const b = rgbaData[j + 2];
		if (rgbaData[j + 3] < 32) luminances[i] = 255;
		else luminances[i] = r * 306 + g * 601 + b * 117 >> 10;
	}
	const source = new RGBLuminanceSource(luminances, width, height);
	const hit1 = tryDecodeBitmapWithZXingReaders(new BinaryBitmap(new HybridBinarizer(source)), "HybridBinarizer");
	if (hit1) return hit1;
	const hit2 = tryDecodeBitmapWithZXingReaders(new BinaryBitmap(new GlobalHistogramBinarizer(source)), "GlobalHistogram");
	if (hit2) return hit2;
	const contrastLuminances = new Uint8ClampedArray(pixelCount);
	for (let i = 0; i < pixelCount; i++) {
		const v = luminances[i];
		contrastLuminances[i] = Math.max(0, Math.min(255, Math.round((v - 128) * 1.65 + 128)));
	}
	const hit3 = tryDecodeBitmapWithZXingReaders(new BinaryBitmap(new HybridBinarizer(new RGBLuminanceSource(contrastLuminances, width, height))), "ContrastEnhanced");
	if (hit3) return hit3;
	return null;
}
/**
* Computes a fast lightweight luminance signature on a 16x16 grid of an ImageData buffer
* to prevent processing identical/frozen camera frames multiple times (Phase 4).
*/
function computeFrameSignature(rgba, width, height) {
	const stepX = Math.max(1, Math.floor(width / 16));
	const stepY = Math.max(1, Math.floor(height / 16));
	let hash = 2166136261;
	for (let y = 0; y < height; y += stepY) for (let x = 0; x < width; x += stepX) {
		const idx = (y * width + x) * 4;
		const lum = rgba[idx] + rgba[idx + 1] + rgba[idx + 2] >> 2;
		hash ^= lum;
		hash = Math.imul(hash, 16777619);
	}
	return `${width}x${height}:${hash >>> 0}`;
}
var reusableScanCanvas = null;
var lastProcessedFrameSignature = null;
var isFrameDecodeInFlight = false;
function getReusableScanCanvas(width, height) {
	if (typeof document === "undefined") return null;
	if (!reusableScanCanvas) reusableScanCanvas = document.createElement("canvas");
	if (reusableScanCanvas.width !== width || reusableScanCanvas.height !== height) {
		reusableScanCanvas.width = width;
		reusableScanCanvas.height = height;
	}
	const ctx = reusableScanCanvas.getContext("2d", { willReadFrequently: true });
	return {
		canvas: reusableScanCanvas,
		ctx
	};
}
/**
* Decodes a barcode from an ImageData or Canvas using:
* 1. Native Browser BarcodeDetector (if available)
* 2. ZXing MultiFormatReader (RGBA luminance + contrast pass)
* 3. barcode-detector/ponyfill (ZXing-C++ WebAssembly)
*/
async function decodeBarcodeFromImageData(imageData) {
	ensureWebEnginesInitialized();
	const zxingHit = decodeBarcodeFromRGBA(imageData.data, imageData.width, imageData.height);
	if (zxingHit && zxingHit.rawValue) return zxingHit;
	if (nativeBrowserDetector) try {
		const detected = await nativeBrowserDetector.detect(imageData);
		if (detected && detected.length > 0) {
			const raw = String(detected[0].rawValue ?? "").trim();
			if (raw) return {
				rawValue: raw,
				format: String(detected[0].format || "UNKNOWN").toUpperCase(),
				engine: "Native BarcodeDetector"
			};
		}
	} catch (err) {
		if (err?.message && !String(err.message).includes("not supported")) console.debug("[POS-BarcodeScanner] Native BarcodeDetector frame warning:", err.message);
	}
	if (webPonyfillDetector) try {
		const detected = await webPonyfillDetector.detect(imageData);
		if (detected && detected.length > 0) {
			const raw = String(detected[0].rawValue ?? "").trim();
			if (raw) return {
				rawValue: raw,
				format: String(detected[0].format || "UNKNOWN").toUpperCase(),
				engine: "BarcodeDetector WASM Polyfill"
			};
		}
	} catch (err) {
		console.debug("[POS-BarcodeScanner] WASM Ponyfill frame warning:", err?.message || err);
	}
	return null;
}
/**
* Decodes a barcode from an HTMLVideoElement frame with:
* - Frame readiness validation
* - Full-frame non-cropping capture (scaled to max 1280px width for optimal 1D/2D bar sharpness)
* - Duplicate frame deduplication (prevents re-scanning identical frames)
* - Concurrency lock (prevents CPU spikes)
*/
async function decodeBarcodeFromVideoElementWithDiagnostics(video, options) {
	if (!video || video.readyState < 2 || video.videoWidth <= 0 || video.videoHeight <= 0) return null;
	if (isFrameDecodeInFlight && !options?.bypassDeduplication) return null;
	isFrameDecodeInFlight = true;
	try {
		ensureWebEnginesInitialized();
		const maxDim = 1280;
		let targetW = video.videoWidth;
		let targetH = video.videoHeight;
		if (targetW > maxDim || targetH > maxDim) {
			const scale = Math.min(maxDim / targetW, maxDim / targetH);
			targetW = Math.max(1, Math.round(targetW * scale));
			targetH = Math.max(1, Math.round(targetH * scale));
		}
		const surface = getReusableScanCanvas(targetW, targetH);
		if (!surface || !surface.ctx) return null;
		surface.ctx.drawImage(video, 0, 0, targetW, targetH);
		const imageData = surface.ctx.getImageData(0, 0, targetW, targetH);
		const signature = computeFrameSignature(imageData.data, targetW, targetH);
		if (!options?.bypassDeduplication && signature === lastProcessedFrameSignature) {
			updateScannerDiagnostics({ skippedDuplicateFrames: diagnosticsState.skippedDuplicateFrames + 1 });
			return null;
		}
		lastProcessedFrameSignature = signature;
		const nextCount = diagnosticsState.framesProcessed + 1;
		if (nextCount === 1) recordScannerStage("Frame Processing Started", `Resolution ${targetW}x${targetH}px`);
		updateScannerDiagnostics({ framesProcessed: nextCount });
		const outcome = await decodeBarcodeFromImageData(imageData);
		if (outcome && outcome.rawValue) {
			const preservedString = String(outcome.rawValue).trim();
			updateScannerDiagnostics({
				lastDetectedValue: preservedString,
				lastDetectedFormat: outcome.format,
				lastError: null
			});
			recordScannerStage("Barcode Detected", `Format: ${outcome.format} | Engine: ${outcome.engine}`);
			recordScannerStage("Raw Value Received", `"${preservedString}" (String length: ${preservedString.length})`);
			return {
				...outcome,
				rawValue: preservedString
			};
		}
		return null;
	} catch (err) {
		recordScannerStage("Scanner Error", `Video frame decode error: ${err?.message || String(err)}`);
		return null;
	} finally {
		isFrameDecodeInFlight = false;
	}
}
/**
* Decodes a barcode from an Image File or Blob (Phase 7: Saved Image Barcode Testing & Upload).
* Never shrinks the image to 1x1px; decodes at full natural resolution up to 1600px.
*/
async function decodeBarcodeFromImageFileWithDiagnostics(file) {
	if (!file) return null;
	ensureWebEnginesInitialized();
	recordScannerStage("Frame Processing Started", `Decoding uploaded image (${file.size} bytes)`);
	try {
		if (typeof createImageBitmap === "function" && typeof document !== "undefined") {
			const bitmap = await createImageBitmap(file);
			const maxDim = 1600;
			let w = bitmap.width;
			let h = bitmap.height;
			if (w > maxDim || h > maxDim) {
				const scale = Math.min(maxDim / w, maxDim / h);
				w = Math.max(1, Math.round(w * scale));
				h = Math.max(1, Math.round(h * scale));
			}
			const canvas = document.createElement("canvas");
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext("2d", { willReadFrequently: true });
			if (ctx) {
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(0, 0, w, h);
				ctx.drawImage(bitmap, 0, 0, w, h);
				const imageData = ctx.getImageData(0, 0, w, h);
				updateScannerDiagnostics({ framesProcessed: diagnosticsState.framesProcessed + 1 });
				const outcome = await decodeBarcodeFromImageData(imageData);
				if (outcome && outcome.rawValue) {
					const preserved = String(outcome.rawValue).trim();
					updateScannerDiagnostics({
						lastDetectedValue: preserved,
						lastDetectedFormat: outcome.format,
						lastError: null
					});
					recordScannerStage("Barcode Detected", `Image File | Format: ${outcome.format} | Engine: ${outcome.engine}`);
					recordScannerStage("Raw Value Received", `"${preserved}"`);
					return {
						...outcome,
						rawValue: preserved
					};
				}
			}
		}
		if (typeof document !== "undefined" && typeof Image !== "undefined") {
			const imgOutcome = await new Promise((resolve) => {
				const img = new Image();
				const url = URL.createObjectURL(file);
				img.onload = async () => {
					URL.revokeObjectURL(url);
					try {
						const w = Math.max(1, img.naturalWidth || img.width);
						const h = Math.max(1, img.naturalHeight || img.height);
						const canvas = document.createElement("canvas");
						canvas.width = w;
						canvas.height = h;
						const ctx = canvas.getContext("2d", { willReadFrequently: true });
						if (!ctx) {
							resolve(null);
							return;
						}
						ctx.fillStyle = "#FFFFFF";
						ctx.fillRect(0, 0, w, h);
						ctx.drawImage(img, 0, 0, w, h);
						resolve(await decodeBarcodeFromImageData(ctx.getImageData(0, 0, w, h)));
					} catch {
						resolve(null);
					}
				};
				img.onerror = () => {
					URL.revokeObjectURL(url);
					resolve(null);
				};
				img.src = url;
			});
			if (imgOutcome && imgOutcome.rawValue) {
				const preserved = String(imgOutcome.rawValue).trim();
				updateScannerDiagnostics({
					lastDetectedValue: preserved,
					lastDetectedFormat: imgOutcome.format,
					lastError: null
				});
				recordScannerStage("Barcode Detected", `Image Element | Format: ${imgOutcome.format}`);
				recordScannerStage("Raw Value Received", `"${preserved}"`);
				return {
					...imgOutcome,
					rawValue: preserved
				};
			}
		}
		if (webPonyfillDetector) {
			const results = await webPonyfillDetector.detect(file);
			if (results && results.length > 0 && results[0].rawValue) {
				const preserved = String(results[0].rawValue).trim();
				const fmt = String(results[0].format || "UNKNOWN").toUpperCase();
				updateScannerDiagnostics({
					lastDetectedValue: preserved,
					lastDetectedFormat: fmt,
					lastError: null
				});
				recordScannerStage("Barcode Detected", `Blob Ponyfill | Format: ${fmt}`);
				recordScannerStage("Raw Value Received", `"${preserved}"`);
				return {
					rawValue: preserved,
					format: fmt,
					engine: "BarcodeDetector WASM Polyfill (Blob)"
				};
			}
		}
		recordScannerStage("Scanner Error", "No readable barcode found in the provided image file.");
		return null;
	} catch (err) {
		recordScannerStage("Scanner Error", `Image decode error: ${err?.message || String(err)}`);
		return null;
	}
}
/**
* Phase 4: Web MediaStream Hardware Capabilities (Continuous Autofocus, Torch/Flashlight, Zoom)
*/
async function applyWebCameraTrackEnhancements(stream) {
	const defaultCaps = {
		torchAvailable: false,
		zoomAvailable: false,
		minZoom: 1,
		maxZoom: 1,
		currentZoom: 1
	};
	try {
		const track = stream.getVideoTracks()[0];
		if (!track || typeof track.getCapabilities !== "function") {
			updateScannerDiagnostics(defaultCaps);
			return defaultCaps;
		}
		const caps = track.getCapabilities();
		const settings = typeof track.getSettings === "function" ? track.getSettings() : {};
		const advancedConstraints = {};
		if (Array.isArray(caps.focusMode) && caps.focusMode.includes("continuous")) advancedConstraints.focusMode = "continuous";
		if (Array.isArray(caps.exposureMode) && caps.exposureMode.includes("continuous")) advancedConstraints.exposureMode = "continuous";
		if (Object.keys(advancedConstraints).length > 0 && typeof track.applyConstraints === "function") await track.applyConstraints({ advanced: [advancedConstraints] }).catch((e) => {
			console.debug("[POS-BarcodeScanner] Focus constraint note:", e?.message || e);
		});
		const torchAvailable = Boolean(caps.torch);
		const zoomAvailable = typeof caps.zoom === "object" && caps.zoom !== null;
		const minZoom = zoomAvailable ? Number(caps.zoom.min || 1) : 1;
		const maxZoom = zoomAvailable ? Number(caps.zoom.max || 1) : 1;
		const currentZoom = Number(settings.zoom || minZoom || 1);
		updateScannerDiagnostics({
			torchAvailable,
			torchEnabled: Boolean(settings.torch),
			zoomAvailable,
			minZoom,
			maxZoom,
			zoomRatio: currentZoom
		});
		return {
			torchAvailable,
			zoomAvailable,
			minZoom,
			maxZoom,
			currentZoom
		};
	} catch (err) {
		recordScannerStage("Scanner Error", `Camera capabilities check warning: ${err?.message || err}`);
		return defaultCaps;
	}
}
async function setScannerTorch(enabled, webStream) {
	try {
		const track = webStream?.getVideoTracks()?.[0];
		if (track && typeof track.applyConstraints === "function") {
			await track.applyConstraints({ advanced: [{ torch: enabled }] });
			updateScannerDiagnostics({ torchEnabled: enabled });
			return enabled;
		}
		if (isNativeCapacitorEnvironment()) {
			if (enabled) await BarcodeScanner.enableTorch();
			else await BarcodeScanner.disableTorch();
			updateScannerDiagnostics({ torchEnabled: enabled });
			return enabled;
		}
	} catch (err) {
		recordScannerStage("Scanner Error", `Flashlight toggle failed: ${err?.message || err}`);
	}
	return false;
}
async function setScannerZoom(zoomRatio, webStream) {
	try {
		const track = webStream?.getVideoTracks()?.[0];
		if (track && typeof track.applyConstraints === "function") {
			await track.applyConstraints({ advanced: [{ zoom: zoomRatio }] });
			updateScannerDiagnostics({ zoomRatio });
			return zoomRatio;
		}
		if (isNativeCapacitorEnvironment()) {
			await BarcodeScanner.setZoomRatio({ zoomRatio });
			updateScannerDiagnostics({ zoomRatio });
			return zoomRatio;
		}
	} catch (err) {
		recordScannerStage("Scanner Error", `Zoom adjustment failed: ${err?.message || err}`);
	}
	return zoomRatio;
}
var activeNativeScanResolve = null;
/**
* Ensures Android OS runtime camera permission is granted and stops any previous native scan session
* so the hardware camera is free.
*/
async function ensureNativeCameraPermission() {
	if (!isNativeCapacitorEnvironment()) return true;
	try {
		if ((await BarcodeScanner.checkPermissions()).camera !== "granted") return (await BarcodeScanner.requestPermissions()).camera === "granted";
		return true;
	} catch {
		return true;
	}
}
/**
* Phase 2B: Native Android Capacitor 8 ML Kit Barcode Scanner
* Directly launches the bundled CameraX + Google ML Kit `startScan()` inside our transparent viewfinder
* with zero delay (no waiting for external Play Services UI module downloads), plus Torch & Zoom support.
*/
async function scanWithNativeMLKit() {
	if (!isNativeCapacitorEnvironment()) return null;
	return await startInteractiveNativeMLKitScan();
}
/**
* Interactive Native ML Kit `startScan()` with transparent WebView viewfinder support,
* Torch detection, and Zoom range initialization.
*/
async function startInteractiveNativeMLKitScan() {
	if (!isNativeCapacitorEnvironment()) return null;
	recordScannerStage("Camera Initialized", "Starting Native Android CameraX + ML Kit Viewfinder");
	updateScannerDiagnostics({
		environment: "Native",
		engineName: "Google ML Kit CameraX (@capacitor-mlkit/barcode-scanning)",
		cameraStatus: "Initializing",
		lastError: null
	});
	try {
		if (!(await BarcodeScanner.isSupported()).supported) throw new Error("Hardware camera is not supported on this Android device.");
		if (!await ensureNativeCameraPermission()) throw new Error("Camera permission denied on Android device.");
		if (activeNativeScanResolve) {
			const prevResolve = activeNativeScanResolve;
			activeNativeScanResolve = null;
			prevResolve(null);
		}
		try {
			await BarcodeScanner.removeAllListeners();
			await BarcodeScanner.stopScan();
		} catch {}
		if (typeof document !== "undefined") document.body.classList.add("barcode-scanner-active");
		updateScannerDiagnostics({ cameraStatus: "Streaming" });
		return await new Promise(async (resolve) => {
			let resolved = false;
			const finish = async (result) => {
				if (resolved) return;
				resolved = true;
				if (activeNativeScanResolve === finishResolve) activeNativeScanResolve = null;
				if (typeof document !== "undefined") document.body.classList.remove("barcode-scanner-active");
				try {
					await BarcodeScanner.removeAllListeners();
					await BarcodeScanner.stopScan();
				} catch {}
				updateScannerDiagnostics({
					cameraStatus: "Stopped",
					torchEnabled: false
				});
				resolve(result);
			};
			const finishResolve = (res) => {
				finish(res);
			};
			activeNativeScanResolve = finishResolve;
			const onBarcodeCandidate = async (b) => {
				if (!b || resolved) return;
				const rawValue = String(b.rawValue || b.displayValue || "").trim();
				if (rawValue.length > 0) {
					const fmt = String(b.format || "UNKNOWN");
					updateScannerDiagnostics({
						framesProcessed: diagnosticsState.framesProcessed + 1,
						lastDetectedValue: rawValue,
						lastDetectedFormat: fmt,
						lastError: null
					});
					recordScannerStage("Barcode Detected", `ML Kit CameraX | Format: ${fmt}`);
					recordScannerStage("Raw Value Received", `"${rawValue}"`);
					await finish({
						rawValue,
						format: fmt,
						engine: "Google ML Kit CameraX (startScan)"
					});
				}
			};
			await BarcodeScanner.addListener("barcodeScanned", async (event) => {
				if (event?.barcode) await onBarcodeCandidate(event.barcode);
			});
			await BarcodeScanner.addListener("barcodesScanned", async (event) => {
				if (event.barcodes && event.barcodes.length > 0) await onBarcodeCandidate(event.barcodes[0]);
			});
			await BarcodeScanner.addListener("scanError", async (event) => {
				recordScannerStage("Scanner Error", `ML Kit scanError: ${event.message}`);
				await finish(null);
			});
			await BarcodeScanner.startScan({
				formats: MLKIT_BARCODE_FORMATS,
				lensFacing: LensFacing.Back,
				resolution: Resolution["1280x720"]
			});
			recordScannerStage("Video Stream Started", `Native CameraX PreviewView active (1280x720, ${ENABLED_BARCODE_FORMAT_LABELS.length} formats)`);
			try {
				const torchAvail = await BarcodeScanner.isTorchAvailable();
				const minZ = await BarcodeScanner.getMinZoomRatio();
				const maxZ = await BarcodeScanner.getMaxZoomRatio();
				updateScannerDiagnostics({
					torchAvailable: Boolean(torchAvail.available),
					zoomAvailable: maxZ.zoomRatio > minZ.zoomRatio,
					minZoom: minZ.zoomRatio,
					maxZoom: maxZ.zoomRatio,
					zoomRatio: minZ.zoomRatio
				});
			} catch {}
		});
	} catch (err) {
		if (typeof document !== "undefined") document.body.classList.remove("barcode-scanner-active");
		const msg = err?.message || String(err);
		updateScannerDiagnostics({
			cameraStatus: "Error",
			lastError: msg
		});
		recordScannerStage("Scanner Error", `Native startScan failed: ${msg}`);
		return null;
	}
}
async function stopInteractiveNativeMLKitScan() {
	if (typeof document !== "undefined") document.body.classList.remove("barcode-scanner-active");
	if (activeNativeScanResolve) {
		const fn = activeNativeScanResolve;
		activeNativeScanResolve = null;
		fn(null);
	}
	if (!isNativeCapacitorEnvironment()) return;
	try {
		await BarcodeScanner.removeAllListeners();
		await BarcodeScanner.stopScan();
		updateScannerDiagnostics({
			cameraStatus: "Stopped",
			torchEnabled: false
		});
		recordScannerStage("Camera Stopped", "Stopped Native ML Kit Scanner");
	} catch {}
}
var EAN_L_CODES = [
	"0001101",
	"0011001",
	"0010011",
	"0111101",
	"0100011",
	"0110001",
	"0101111",
	"0111011",
	"0110111",
	"0001011"
];
var EAN_G_CODES = [
	"0100111",
	"0110011",
	"0011011",
	"0100001",
	"0011101",
	"0111001",
	"0000101",
	"0010001",
	"0001001",
	"0010111"
];
var EAN_R_CODES = [
	"1110010",
	"1100110",
	"1101100",
	"1000010",
	"1011100",
	"1001110",
	"1010000",
	"1000100",
	"1001000",
	"1110100"
];
var EAN13_PARITY = [
	"LLLLLL",
	"LLGLGG",
	"LLGGLG",
	"LLGGGL",
	"LGLLGG",
	"LGGLLG",
	"LGGGLL",
	"LGLGLG",
	"LGLGGL",
	"LGGLGL"
];
var CODE128_PATTERNS = [
	"11011001100",
	"11001101100",
	"11001100110",
	"10010011000",
	"10010001100",
	"10001001100",
	"10011001000",
	"10011000100",
	"10001100100",
	"11001001000",
	"11001000100",
	"11000100100",
	"10110011100",
	"10011011100",
	"10011001110",
	"10111001100",
	"10011101100",
	"10011100110",
	"11001110010",
	"11001011100",
	"11001001110",
	"11011100100",
	"11001110100",
	"11101101110",
	"11101001100",
	"11100101100",
	"11100100110",
	"11101100100",
	"11100110100",
	"11100110010",
	"11011011000",
	"11011000110",
	"11000110110",
	"10100011000",
	"10001011000",
	"10001000110",
	"10110001000",
	"10001101000",
	"10001100010",
	"11010001000",
	"11000101000",
	"11000100010",
	"10110111000",
	"10110001110",
	"10001101110",
	"10111011000",
	"10111000110",
	"10001110110",
	"11101110110",
	"11010001110",
	"11000101110",
	"11011101000",
	"11011100010",
	"11011101110",
	"11101011000",
	"11101000110",
	"11100010110",
	"11101101000",
	"11101100010",
	"11100011010",
	"11101111010",
	"11001000010",
	"11110001010",
	"10100110000",
	"10100001100",
	"10010110000",
	"10010000110",
	"10000101100",
	"10000100110",
	"10110010000",
	"10110000100",
	"10011010000",
	"10011000010",
	"10000110100",
	"10000110010",
	"11000010010",
	"11001010000",
	"11110111010",
	"11000010100",
	"10001111010",
	"10100111100",
	"10010111100",
	"10010011110",
	"10111100100",
	"10011110100",
	"10011110010",
	"11110100100",
	"11110010100",
	"11110010010",
	"11011011110",
	"11011110110",
	"11110110110",
	"10101111000",
	"10100011110",
	"10001011110",
	"10111101000",
	"10111100010",
	"11110101000",
	"11110100010",
	"10111011110",
	"10111101110",
	"11101011110",
	"11110101110",
	"11010000100",
	"11010010000",
	"11010011100",
	"1100011101011"
];
function encode1DBits(value, format) {
	if (format === "EAN_13") {
		const digits = value.replace(/\D/g, "").padStart(13, "0").slice(0, 13);
		const parity = EAN13_PARITY[Number(digits[0])];
		let bits = "101";
		for (let i = 1; i <= 6; i++) {
			const d = Number(digits[i]);
			bits += parity[i - 1] === "L" ? EAN_L_CODES[d] : EAN_G_CODES[d];
		}
		bits += "01010";
		for (let i = 7; i <= 12; i++) {
			const d = Number(digits[i]);
			bits += EAN_R_CODES[d];
		}
		bits += "101";
		return bits;
	}
	if (format === "UPC_A") {
		const digits = value.replace(/\D/g, "").padStart(12, "0").slice(0, 12);
		let bits = "101";
		for (let i = 0; i < 6; i++) bits += EAN_L_CODES[Number(digits[i])];
		bits += "01010";
		for (let i = 6; i < 12; i++) bits += EAN_R_CODES[Number(digits[i])];
		bits += "101";
		return bits;
	}
	if (format === "EAN_8") {
		const digits = value.replace(/\D/g, "").padStart(8, "0").slice(0, 8);
		let bits = "101";
		for (let i = 0; i < 4; i++) bits += EAN_L_CODES[Number(digits[i])];
		bits += "01010";
		for (let i = 4; i < 8; i++) bits += EAN_R_CODES[Number(digits[i])];
		bits += "101";
		return bits;
	}
	const startCodeB = 104;
	let checksum = startCodeB;
	let bits = CODE128_PATTERNS[startCodeB];
	for (let i = 0; i < value.length; i++) {
		const codeVal = Math.max(0, Math.min(94, value.charCodeAt(i) - 32));
		bits += CODE128_PATTERNS[codeVal];
		checksum += codeVal * (i + 1);
	}
	const checkIndex = checksum % 103;
	bits += CODE128_PATTERNS[checkIndex];
	bits += CODE128_PATTERNS[106];
	return bits;
}
/**
* Phase 7: Standard Barcode Image Generator (EAN-13, EAN-8, UPC-A, CODE-128, QR_CODE)
* Generates a real bit-accurate barcode RGBA buffer (and File/Canvas in browser)
* so the decoding engine can be verified against real EAN-13, EAN-8, UPC-A, CODE-128, and QR barcodes.
*/
function generateStandardBarcodeRGBA(value, format, width = 420, height = 180) {
	if (format === "QR_CODE") {
		const matrix = new MultiFormatWriter().encode(value, ZXingBarcodeFormat.QR_CODE, 260, 260, /* @__PURE__ */ new Map());
		const actualW = matrix.getWidth();
		const actualH = matrix.getHeight();
		const rgba = new Uint8ClampedArray(actualW * actualH * 4);
		for (let y = 0; y < actualH; y++) for (let x = 0; x < actualW; x++) {
			const color = matrix.get(x, y) ? 0 : 255;
			const idx = (y * actualW + x) * 4;
			rgba[idx] = color;
			rgba[idx + 1] = color;
			rgba[idx + 2] = color;
			rgba[idx + 3] = 255;
		}
		return {
			data: rgba,
			width: actualW,
			height: actualH
		};
	}
	const bits = encode1DBits(value, format);
	const quietZoneModules = 14;
	const totalModules = bits.length + 28;
	const barScale = Math.max(3, Math.floor(width / totalModules));
	const actualW = totalModules * barScale;
	const actualH = height;
	const padY = Math.round(actualH * .15);
	const rgba = new Uint8ClampedArray(actualW * actualH * 4);
	rgba.fill(255);
	for (let m = 0; m < bits.length; m++) if (bits[m] === "1") {
		const startX = (quietZoneModules + m) * barScale;
		for (let y = padY; y < actualH - padY; y++) for (let dx = 0; dx < barScale; dx++) {
			const idx = (y * actualW + (startX + dx)) * 4;
			rgba[idx] = 0;
			rgba[idx + 1] = 0;
			rgba[idx + 2] = 0;
			rgba[idx + 3] = 255;
		}
	}
	return {
		data: rgba,
		width: actualW,
		height: actualH
	};
}
async function createStandardBarcodeTestFile(value, format) {
	if (typeof document === "undefined") return null;
	const { data, width, height } = generateStandardBarcodeRGBA(value, format);
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) return null;
	const imageData = new ImageData(new Uint8ClampedArray(data), width, height);
	ctx.putImageData(imageData, 0, 0);
	const blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
	if (!blob) return null;
	return new File([blob], `test-${format}-${value}.png`, { type: "image/png" });
}
function resetScannerFrameSignatureCache() {
	lastProcessedFrameSignature = "";
	isFrameDecodeInFlight = false;
}
// src/components/checkout/ScannerDiagnosticsPanel.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var TEST_BARCODE_SAMPLES = [
	{
		label: "EAN-13 (موجود)",
		format: "EAN_13",
		value: "2001010010118"
	},
	{
		label: "EAN-8",
		format: "EAN_8",
		value: "96385074"
	},
	{
		label: "UPC-A (بصفر بادئ)",
		format: "UPC_A",
		value: "012345678905"
	},
	{
		label: "CODE-128 (صبغة)",
		format: "CODE_128",
		value: "200801008018"
	},
	{
		label: "QR Code (جديد)",
		format: "QR_CODE",
		value: "009988776655"
	}
];
var ScannerDiagnosticsPanel = ({ isAr, onTestBarcodeDecoded }) => {
	const [diag, setDiag] = (0, import_react.useState)(() => getScannerDiagnostics());
	const [isExpanded, setIsExpanded] = (0, import_react.useState)(false);
	const [testingFormat, setTestingFormat] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		return subscribeScannerDiagnostics((next) => setDiag(next));
	}, []);
	const handleRunImageSelfTest = async (sample) => {
		setTestingFormat(sample.label);
		try {
			const file = await createStandardBarcodeTestFile(sample.value, sample.format);
			if (!file) return;
			const outcome = await decodeBarcodeFromImageFileWithDiagnostics(file);
			if (outcome && outcome.rawValue && onTestBarcodeDecoded) onTestBarcodeDecoded(outcome.rawValue, outcome.format);
		} finally {
			setTestingFormat(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "scanner-diagnostics-panel",
		className: "rounded-2xl bg-neutral-950/90 border border-neutral-800/90 p-3 space-y-2.5 text-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-testid": "toggle-scanner-diagnostics-btn",
					onClick: () => setIsExpanded((prev) => !prev),
					className: "flex items-center gap-2 text-left font-bold text-amber-300 hover:text-amber-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-amber-400 shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "لوحة تشخيص وفحص محرك الباركود (Scanner Diagnostics)" : "Barcode Scanner Diagnostics & Engine Inspector" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[10px]",
							children: [
								diag.environment,
								" • ",
								diag.cameraStatus
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [diag.logs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => resetScannerDiagnosticsLogs(),
						className: "p-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white",
						title: isAr ? "مسح السجل" : "Clear logs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setIsExpanded((prev) => !prev),
						className: "px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-300",
						children: isExpanded ? isAr ? "إخفاء" : "Hide" : isAr ? "عرض التفاصيل" : "Details"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2 rounded-xl bg-neutral-900/80 border border-neutral-800/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-neutral-400 block text-[10px]",
							children: isAr ? "البيئة والمحرك" : "Environment & Engine"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono font-bold text-white truncate block",
							title: diag.engineName,
							children: [
								diag.environment,
								" (",
								diag.platform,
								")"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2 rounded-xl bg-neutral-900/80 border border-neutral-800/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-neutral-400 block text-[10px]",
							children: isAr ? "حالة الكاميرا" : "Camera Status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `font-mono font-bold block ${diag.cameraStatus === "Streaming" || diag.cameraStatus === "Native ML Kit Active" ? "text-emerald-400" : diag.cameraStatus === "Error" ? "text-rose-400" : "text-amber-300"}`,
							children: diag.cameraStatus
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2 rounded-xl bg-neutral-900/80 border border-neutral-800/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-neutral-400 block text-[10px]",
							children: isAr ? "الإطارات المعالجة" : "Frames Processed"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono font-bold text-sky-300 block",
							children: [
								diag.framesProcessed,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-neutral-500",
									children: [
										"(تخطي مكرر: ",
										diag.skippedDuplicateFrames,
										")"
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2 rounded-xl bg-neutral-900/80 border border-neutral-800/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-neutral-400 block text-[10px]",
							children: isAr ? "آخر باركود مكتشف" : "Last Detected Value"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"data-testid": "diag-last-detected-value",
							className: "font-mono font-bold text-emerald-400 truncate block",
							children: diag.lastDetectedValue ? `${diag.lastDetectedValue} (${diag.lastDetectedFormat})` : "—"
						})]
					})
				]
			}),
			isExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2.5 pt-2 border-t border-neutral-800/80",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-1 text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-neutral-400",
								children: isAr ? "محرك التعرف النشط:" : "Active Engine:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-amber-300 font-semibold",
								children: diag.engineName
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1 pt-1",
							children: diag.enabledFormats.map((fmt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300",
								children: fmt
							}, fmt))
						})]
					}),
					diag.lastError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-[11px] flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3.5 h-3.5 text-rose-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono break-all",
							children: diag.lastError
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-[11px] font-bold text-emerald-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: "w-3.5 h-3.5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "اختبار محرك القراءة بصور باركود حقيقية (بدون كاميرا):" : "Test Barcode Engine with Real Generated Barcode Images:" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: TEST_BARCODE_SAMPLES.map((sample) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"data-testid": `self-test-${sample.format}`,
								disabled: Boolean(testingFormat),
								onClick: () => handleRunImageSelfTest(sample),
								className: "px-2 py-1 rounded-lg bg-neutral-800 hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-neutral-700 text-[10px] font-mono font-bold text-neutral-200 hover:text-emerald-300 transition-colors",
								children: testingFormat === sample.label ? "..." : `${sample.label}: ${sample.value}`
							}, sample.label))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] font-bold text-neutral-400 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "w-3 h-3 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "سجل مراحل الكاميرا والتعرف والبحث (Live Stage Logs):" : "Live Stage Logs:" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-36 overflow-y-auto rounded-xl bg-black/60 border border-neutral-800 p-2 font-mono text-[10px] space-y-1",
							children: diag.logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-neutral-500",
								children: isAr ? "لا توجد سجلات بعد — افتح الكاميرا أو اختبر صورة باركود." : "No logs yet."
							}) : diag.logs.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-1.5 leading-relaxed",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-neutral-500 shrink-0",
										children: [
											"[",
											entry.timestamp,
											"]"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `font-bold shrink-0 ${entry.stage === "Barcode Detected" || entry.stage === "Raw Value Received" || entry.stage === "Product Found" ? "text-emerald-400" : entry.stage === "Scanner Error" || entry.stage === "Product Not Found" ? "text-rose-400" : "text-amber-300"}`,
										children: [
											"[",
											entry.stage,
											"]"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-neutral-300 break-all",
										children: entry.detail
									})
								]
							}, entry.id))
						})]
					})
				]
			})
		]
	});
};
// src/components/ui/AppInput.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var AppInput = (0, import_react.forwardRef)(({ label, error, leftIcon, rightIcon, helperText, className = "", id, ...props }, ref) => {
	const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : void 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full flex flex-col gap-1.5 text-left",
		children: [
			label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: inputId,
				className: "text-xs font-semibold text-neutral-300",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex items-center",
				children: [
					leftIcon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute left-3.5 flex items-center pointer-events-none text-neutral-400",
						children: leftIcon
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: inputId,
						ref,
						className: `w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-neutral-900 border text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-all ${leftIcon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""} ${error ? "border-rose-500/80 focus:ring-rose-500/30" : "border-neutral-800 hover:border-neutral-700 focus:border-amber-500/70 focus:ring-amber-500/20"} ${className}`,
						...props
					}),
					rightIcon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute right-3.5 flex items-center text-neutral-400",
						children: rightIcon
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-rose-400 font-medium",
				children: error
			}),
			!error && helperText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-neutral-500",
				children: helperText
			})
		]
	});
});
AppInput.displayName = "AppInput";
// src/components/checkout/BarcodeScannerModal.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var BarcodeScannerModal = ({ isOpen, onClose, onScan }) => {
	const { products, addToCart, settings, openAddProductWithBarcode } = usePOS();
	const t = getTranslation(settings.language);
	const isAr = settings.language === "ar";
	const [barcodeInput, setBarcodeInput] = (0, import_react.useState)("");
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [cameraActive, setCameraActive] = (0, import_react.useState)(false);
	const [isNativeCutoutActive, setIsNativeCutoutActive] = (0, import_react.useState)(false);
	const [androidCameraMode, setAndroidCameraMode] = (0, import_react.useState)("native");
	const [cameraError, setCameraError] = (0, import_react.useState)(null);
	const [isDecodingFrame, setIsDecodingFrame] = (0, import_react.useState)(false);
	const [autoOpenNewProductOnMiss, setAutoOpenNewProductOnMiss] = (0, import_react.useState)(true);
	const [diagState, setDiagState] = (0, import_react.useState)(() => getScannerDiagnostics());
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const imageInputRef = (0, import_react.useRef)(null);
	const isMountedRef = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		return subscribeScannerDiagnostics((next) => setDiagState(next));
	}, []);
	const stopCamera = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}
		if (videoRef.current) videoRef.current.srcObject = null;
		if (typeof document !== "undefined") document.body.classList.remove("barcode-scanner-active");
		if (isNativeCapacitorEnvironment()) stopInteractiveNativeMLKitScan().catch(() => {});
		setIsNativeCutoutActive(false);
		setCameraActive(false);
		updateScannerDiagnostics({
			cameraStatus: "Stopped",
			torchEnabled: false
		});
	};
	const startWebRTCCamera = async () => {
		setCameraError(null);
		setIsNativeCutoutActive(false);
		if (typeof document !== "undefined") document.body.classList.remove("barcode-scanner-active");
		if (isNativeCapacitorEnvironment()) {
			await stopInteractiveNativeMLKitScan().catch(() => {});
			await ensureNativeCameraPermission();
		}
		recordScannerStage("Camera Initialized", "Requesting rear environment camera (1280x720)");
		updateScannerDiagnostics({
			cameraStatus: "Initializing",
			lastError: null
		});
		try {
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				const msg = isAr ? "متصفحك لا يدعم تشغيل الكاميرا المباشرة. يمكنك التقاط صورة للباركود أو إدخاله يدوياً." : "Camera API is not supported in this browser. You can upload a barcode photo or enter it manually.";
				setCameraError(msg);
				setCameraActive(false);
				updateScannerDiagnostics({
					cameraStatus: "Error",
					lastError: msg
				});
				recordScannerStage("Scanner Error", msg);
				return;
			}
			let stream;
			try {
				stream = await navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: { ideal: "environment" },
						width: { ideal: 1280 },
						height: { ideal: 720 }
					},
					audio: false
				});
			} catch (envErr) {
				recordScannerStage("Camera Initialized", `Rear camera fallback to default camera (${envErr?.message || "fallback"})`);
				stream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: false
				});
			}
			if (!isMountedRef.current || !isOpen) {
				stream.getTracks().forEach((track) => track.stop());
				return;
			}
			streamRef.current = stream;
			setCameraActive(true);
			await applyWebCameraTrackEnhancements(stream);
		} catch (err) {
			const msg = isAr ? "تعذر الوصول إلى الكاميرا. تأكد من منح صلاحية الكاميرا للتطبيق أو ارفع صورة الباركود." : "Camera permission denied or unavailable. Grant camera permission or upload a barcode photo.";
			setCameraError(msg);
			setCameraActive(false);
			updateScannerDiagnostics({
				cameraStatus: "Error",
				lastError: `${msg} (${err?.message || String(err)})`
			});
			recordScannerStage("Scanner Error", `Camera access failed: ${err?.message || String(err)}`);
		}
	};
	const startCamera = async (preferredMode) => {
		setCameraError(null);
		setFeedback(null);
		const modeToUse = preferredMode || androidCameraMode;
		if (isNativeCapacitorEnvironment() && modeToUse === "native") {
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
				streamRef.current = null;
			}
			setIsNativeCutoutActive(true);
			setCameraActive(true);
			if (typeof document !== "undefined") document.body.classList.add("barcode-scanner-active");
			const outcome = await scanWithNativeMLKit();
			if (!isMountedRef.current) return;
			if (outcome && outcome.rawValue) {
				setIsNativeCutoutActive(false);
				setCameraActive(false);
				handleLookupAndAdd(outcome.rawValue, outcome.format);
				return;
			}
			if (getScannerDiagnostics().cameraStatus === "Error") {
				setAndroidCameraMode("webrtc");
				await startWebRTCCamera();
			} else {
				setIsNativeCutoutActive(false);
				setCameraActive(false);
			}
			return;
		}
		await startWebRTCCamera();
	};
	const handleToggleAndroidCameraMode = async () => {
		const nextMode = androidCameraMode === "native" ? "webrtc" : "native";
		setAndroidCameraMode(nextMode);
		stopCamera();
		await startCamera(nextMode);
	};
	(0, import_react.useEffect)(() => {
		if (isOpen) startCamera();
		else {
			stopCamera();
			setBarcodeInput("");
			setFeedback(null);
			setCameraError(null);
			setIsDecodingFrame(false);
		}
		return () => stopCamera();
	}, [isOpen]);
	(0, import_react.useEffect)(() => {
		if (!cameraActive || isNativeCutoutActive || !streamRef.current || !videoRef.current) return;
		const videoEl = videoRef.current;
		if (videoEl.srcObject !== streamRef.current) videoEl.srcObject = streamRef.current;
		videoEl.play().then(() => {
			updateScannerDiagnostics({ cameraStatus: "Streaming" });
			recordScannerStage("Video Stream Started", `Live video active (${videoEl.videoWidth || 1280}x${videoEl.videoHeight || 720})`);
		}).catch((err) => {
			recordScannerStage("Scanner Error", `Video playback start error: ${err?.message || err}`);
		});
	}, [cameraActive, isNativeCutoutActive]);
	(0, import_react.useEffect)(() => {
		if (!cameraActive || isNativeCutoutActive || !isOpen) return;
		let cancelled = false;
		let timerId;
		const scanLoop = async () => {
			if (cancelled || !videoRef.current) return;
			try {
				const outcome = await decodeBarcodeFromVideoElementWithDiagnostics(videoRef.current);
				if (!cancelled && outcome && outcome.rawValue) {
					stopCamera();
					handleLookupAndAdd(outcome.rawValue, outcome.format);
					return;
				}
			} catch (err) {
				recordScannerStage("Scanner Error", `Frame loop error: ${err?.message || err}`);
			}
			if (!cancelled) timerId = window.setTimeout(scanLoop, 220);
		};
		timerId = window.setTimeout(scanLoop, 300);
		return () => {
			cancelled = true;
			if (timerId) window.clearTimeout(timerId);
		};
	}, [
		cameraActive,
		isNativeCutoutActive,
		isOpen,
		products
	]);
	const handleCaptureCurrentVideoFrame = async () => {
		if (!videoRef.current) return;
		setIsDecodingFrame(true);
		setFeedback(null);
		try {
			const outcome = await decodeBarcodeFromVideoElementWithDiagnostics(videoRef.current, { bypassDeduplication: true });
			if (outcome && outcome.rawValue) {
				stopCamera();
				handleLookupAndAdd(outcome.rawValue, outcome.format);
			} else setFeedback({
				type: "error",
				message: isAr ? "لم يتم العثور على باركود واضح في الكادر الحالي. قرّب الكاميرا من الباركود أو ارفع صورة واضحة." : "No readable barcode detected in current frame. Hold steady closer to the barcode or upload a clear photo."
			});
		} finally {
			setIsDecodingFrame(false);
		}
	};
	const handleScanImageUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setIsDecodingFrame(true);
		setFeedback(null);
		try {
			const outcome = await decodeBarcodeFromImageFileWithDiagnostics(file);
			if (outcome && outcome.rawValue) handleLookupAndAdd(outcome.rawValue, outcome.format);
			else setFeedback({
				type: "error",
				message: isAr ? "تعذر قراءة الباركود من الصورة المرفوعة. تأكد من وضوح خطوط الباركود." : "Could not decode a barcode from the selected image. Ensure the barcode lines are clear."
			});
		} finally {
			setIsDecodingFrame(false);
			e.target.value = "";
		}
	};
	/**
	* Phase 5: Process Decoded Barcode Result
	* 1. Extract rawValue as String (preserving leading zeros).
	* 2. Verify non-empty.
	* 3. Stop camera scanning.
	* 4. Search product catalog.
	* 5. If found -> display & add to cart.
	* 6. If NOT found -> open Add Product modal with barcode pre-filled!
	*/
	const handleLookupAndAdd = (codeToFind, detectedFormat) => {
		const cleanCode = String(codeToFind ?? "").trim();
		if (!cleanCode) return;
		recordScannerStage("Product Search Started", `Searching catalog for barcode/SKU "${cleanCode}"${detectedFormat ? ` [${detectedFormat}]` : ""}`);
		const matchedProduct = products.find((p, idx) => {
			const serial = getProductSerialNumber(p, idx);
			return matchesProductBarcode(p, cleanCode, true) || p.sku.toLowerCase() === cleanCode.toLowerCase() || String(serial) === cleanCode.replace(/^#0*/, "");
		});
		if (matchedProduct) {
			const prodTitle = isAr && matchedProduct.nameAr ? matchedProduct.nameAr : matchedProduct.name;
			recordScannerStage("Product Found", `${prodTitle} (ID: ${matchedProduct.id}, Barcode: ${cleanCode})`);
			playScannerBeep(settings.soundEnabled);
			if (onScan) {
				onScan(cleanCode);
				setFeedback({
					type: "success",
					message: `${isAr ? "تمت قراءة الباركود بنجاح وإضافة المنتج" : "Scan Successful — Added"}: ${prodTitle} (${cleanCode})`
				});
				setBarcodeInput("");
				return;
			}
			if (addToCart(matchedProduct, 1)) {
				setFeedback({
					type: "success",
					message: `${isAr ? "تمت قراءة الباركود بنجاح وإضافة المنتج" : "Scan Successful — Added"}: ${prodTitle} (${cleanCode})`
				});
				setBarcodeInput("");
			} else setFeedback({
				type: "error",
				message: `${prodTitle} — ${t.outOfStock}`
			});
		} else {
			recordScannerStage("Product Not Found", `No product registered with barcode "${cleanCode}". Ready to register as new product.`);
			setFeedback({
				type: "not_found",
				unmatchedBarcode: cleanCode,
				message: isAr ? `الباركود (${cleanCode}) غير مسجل في قاعدة البيانات.` : `Barcode (${cleanCode}) is not registered in the product catalog.`
			});
			if (autoOpenNewProductOnMiss) {
				onClose();
				openAddProductWithBarcode(cleanCode);
			}
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		handleLookupAndAdd(barcodeInput, "MANUAL");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
		isOpen,
		onClose,
		title: t.scanBarcode,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-testid": "scanner-viewfinder-box",
					className: `relative rounded-2xl overflow-hidden border aspect-video flex flex-col items-center justify-center ${cameraActive && isNativeCutoutActive ? "scanner-viewfinder-active bg-transparent border-amber-500/80" : "bg-neutral-950 border-neutral-800"}`,
					children: cameraActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						isNativeCutoutActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full h-full bg-transparent" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							ref: videoRef,
							autoPlay: true,
							playsInline: true,
							muted: true,
							className: "w-full h-full object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 pointer-events-none flex items-center justify-center p-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full max-w-xs h-32 border-2 border-amber-500/80 rounded-2xl relative shadow-[0_0_30px_rgba(245,158,11,0.3)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-2 top-1/2 h-0.5 bg-rose-500/90 animate-pulse" })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [diagState.torchAvailable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setScannerTorch(!diagState.torchEnabled, streamRef.current),
									className: `px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${diagState.torchEnabled ? "bg-amber-500 text-neutral-950 border-amber-400" : "bg-neutral-900/90 text-white border-neutral-700"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flashlight, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "الفلاش" : "Flash" })]
								}), isNativeCapacitorEnvironment() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleToggleAndroidCameraMode,
									className: "px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 border bg-neutral-900/90 text-amber-300 border-amber-500/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: androidCameraMode === "native" ? isAr ? "كاميرا الويب" : "Web Video" : isAr ? "كاميرا ML Kit" : "ML Kit" })]
								})]
							}), diagState.zoomAvailable && diagState.maxZoom > diagState.minZoom && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 px-3 py-1 rounded-xl bg-neutral-900/90 border border-neutral-700",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "w-3.5 h-3.5 text-amber-400" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: diagState.minZoom,
										max: Math.min(diagState.maxZoom, 5),
										step: .1,
										value: diagState.zoomRatio,
										onChange: (e) => setScannerZoom(Number(e.target.value), streamRef.current),
										className: "w-20 accent-amber-500"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[10px] text-white",
										children: [diagState.zoomRatio.toFixed(1), "x"]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 z-20",
							children: [!isNativeCutoutActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								type: "button",
								variant: "amber",
								size: "sm",
								disabled: isDecodingFrame,
								onClick: handleCaptureCurrentVideoFrame,
								leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "w-4 h-4" }),
								children: isDecodingFrame ? isAr ? "جاري قراءة الباركود..." : "Decoding..." : isAr ? "التقاط وقراءة الباركود الآن" : "Capture & Read Barcode"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2.5 py-1 rounded-xl bg-neutral-900/90 border border-emerald-500/40 text-[11px] font-bold text-emerald-300",
								children: isAr ? "وجّه الباركود داخل الإطار للقراءة التلقائية" : "Align barcode inside frame"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								type: "button",
								variant: "secondary",
								size: "sm",
								onClick: stopCamera,
								leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOff, { className: "w-4 h-4" }),
								children: isAr ? "إيقاف الكاميرا" : "Stop Camera"
							})]
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center p-6 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-amber-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Barcode, { className: "w-6 h-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-neutral-200",
									children: isAr ? "وجّه الكاميرا الخلفية نحو الباركود، أو ارفع صورة باركود محفوظة، أو أدخل الرقم يدوياً" : "Point rear camera at barcode, upload a saved barcode image, or enter code manually"
								}), cameraError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-rose-400",
									children: cameraError
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
										type: "button",
										variant: "amber",
										size: "sm",
										onClick: () => startCamera(),
										leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-4 h-4" }),
										"data-testid": "start-barcode-camera-btn",
										children: isAr ? "تشغيل الكاميرا الخلفية" : "Start Rear Camera"
									}),
									isNativeCapacitorEnvironment() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
										type: "button",
										variant: "secondary",
										size: "sm",
										onClick: () => {
											setAndroidCameraMode("webrtc");
											startCamera("webrtc");
										},
										leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 text-amber-400" }),
										children: isAr ? "تشغيل كاميرا الويب المباشرة" : "Start Web Video Camera"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
										type: "button",
										variant: "ghost",
										size: "sm",
										onClick: () => imageInputRef.current?.click(),
										leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, { className: "w-4 h-4 text-emerald-400" }),
										className: "border border-neutral-800 bg-neutral-900/80",
										"data-testid": "upload-barcode-photo-btn",
										children: isAr ? "قراءة باركود من صورة محفوظة" : "Scan from Saved Photo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: imageInputRef,
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: handleScanImageUpload
									})
								]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-900/70 border border-neutral-800 text-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 cursor-pointer text-neutral-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: autoOpenNewProductOnMiss,
							onChange: (e) => setAutoOpenNewProductOnMiss(e.target.checked),
							className: "rounded border-neutral-700 text-amber-500 focus:ring-amber-500"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "فتح نموذج \"إضافة منتج جديد\" تلقائياً مع تعبئة الباركود إذا لم يكن المنتج مسجلاً" : "Auto-open \"Add New Product\" with barcode pre-filled when product is not found" })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
							placeholder: isAr ? "أدخل رقم الباركود أو امسحه بجهاز الليزر..." : "Enter barcode manually or scan with USB laser...",
							value: barcodeInput,
							onChange: (e) => setBarcodeInput(e.target.value),
							leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Barcode, { className: "w-4 h-4" }),
							autoFocus: true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						type: "submit",
						variant: "primary",
						children: isAr ? "بحث / إضافة" : "Search / Add"
					})]
				}),
				feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-testid": "scanner-feedback-banner",
					className: `p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-semibold ${feedback.type === "success" ? "bg-emerald-950/50 border-emerald-800/60 text-emerald-300" : feedback.type === "not_found" ? "bg-amber-950/50 border-amber-500/50 text-amber-200" : "bg-rose-950/50 border-rose-800/60 text-rose-300"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [feedback.type === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-400 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 text-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: feedback.message })]
					}), feedback.type === "not_found" && feedback.unmatchedBarcode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						type: "button",
						variant: "amber",
						size: "sm",
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "w-3.5 h-3.5" }),
						onClick: () => {
							const code = feedback.unmatchedBarcode;
							onClose();
							openAddProductWithBarcode(code);
						},
						"data-testid": "register-unmatched-barcode-btn",
						children: isAr ? "تسجيل منتج جديد بهذا الباركود" : "Add Product with Barcode"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScannerDiagnosticsPanel, {
					isAr,
					onTestBarcodeDecoded: (rawValue, format) => handleLookupAndAdd(rawValue, format)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-2 border-t border-neutral-800/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-xs font-semibold text-neutral-400 mb-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [isAr ? "باركودات المنتجات المسجلة حالياً" : "Registered Product Barcodes", ":"] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1",
						children: products.map((prod) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handleLookupAndAdd(prod.barcode, "CATALOG"),
							disabled: prod.stock <= 0,
							className: "flex items-center justify-between p-2.5 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/50 text-left transition-colors disabled:opacity-40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-lg",
									children: prod.emoji || "📦"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-white truncate",
										children: isAr && prod.nameAr ? prod.nameAr : prod.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] font-mono text-neutral-400 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: prod.barcode || prod.sku }), getAllProductBarcodes(prod).length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold",
											children: ["+", getAllProductBarcodes(prod).length - 1]
										})]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-mono font-bold text-amber-400 shrink-0 ml-2 tabular-nums",
								children: formatCurrency(prod.sellingPrice, settings.currency, settings.language)
							})]
						}, prod.id))
					})]
				})
			]
		})
	});
};
// src/components/settings/LiveWifiSyncSection.tsx
var LiveWifiSyncSection = ({ compact = false }) => {
	const { settings, lanSyncConfig, updateLanSyncConfig, lanConnectionStatus, lanConnectedDevices, lanRecentEvents, lanNetworkAddresses, lanPrimaryHostUrl, lanLastSyncError, pushLiveLanSyncNow } = usePOS();
	const isAr = settings.language === "ar";
	const isAndroidApk = (0, import_react.useMemo)(() => isStandaloneCapacitorApk(), []);
	const [hostInput, setHostInput] = (0, import_react.useState)(lanSyncConfig.hostUrl || "");
	const [deviceNameInput, setDeviceNameInput] = (0, import_react.useState)(lanSyncConfig.deviceName || "");
	const [selectedAddressIdx, setSelectedAddressIdx] = (0, import_react.useState)(0);
	const [copiedUrl, setCopiedUrl] = (0, import_react.useState)(false);
	const [isManualSyncing, setIsManualSyncing] = (0, import_react.useState)(false);
	const [isScannerOpen, setIsScannerOpen] = (0, import_react.useState)(false);
	const [statusFeedback, setStatusFeedback] = (0, import_react.useState)(null);
	const activeHostAddress = (0, import_react.useMemo)(() => {
		if (lanNetworkAddresses.length > 0) return (lanNetworkAddresses[selectedAddressIdx] || lanNetworkAddresses[0]).url;
		if (lanPrimaryHostUrl) return lanPrimaryHostUrl;
		if (typeof window !== "undefined" && window.location?.origin?.startsWith("http")) return window.location.origin;
		return "http://192.168.1.100:3000";
	}, [
		lanNetworkAddresses,
		selectedAddressIdx,
		lanPrimaryHostUrl
	]);
	const compactPairingCode = (0, import_react.useMemo)(() => {
		return activeHostAddress.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
	}, [activeHostAddress]);
	const barcodeBits = (0, import_react.useMemo)(() => {
		return encodeCode128B(compactPairingCode);
	}, [compactPairingCode]);
	const handleCopyHostUrl = async () => {
		try {
			await navigator.clipboard.writeText(activeHostAddress);
			setCopiedUrl(true);
			triggerHaptic("light", settings.hapticsEnabled);
			setTimeout(() => setCopiedUrl(false), 2e3);
		} catch {}
	};
	const handleSaveAndConnect = async (overrideUrl) => {
		const normalized = normalizeLanHostUrl(overrideUrl !== void 0 ? overrideUrl : hostInput);
		const cleanName = deviceNameInput.trim() || (lanSyncConfig.platform === "android" ? "هاتف أندرويد POS" : "كمبيوتر ويندوز POS");
		updateLanSyncConfig({
			enabled: true,
			hostUrl: normalized,
			deviceName: cleanName,
			autoSyncOnEveryAction: true
		});
		setHostInput(normalized);
		setIsManualSyncing(true);
		setStatusFeedback(null);
		try {
			setTimeout(async () => {
				const ok = await pushLiveLanSyncNow(`ربط ومزامنة حية من ${cleanName}`, `Live Wi-Fi pairing & sync from ${cleanName}`);
				setIsManualSyncing(false);
				if (ok) {
					playSuccessChime(settings.soundEnabled);
					triggerHaptic("success", settings.hapticsEnabled);
					setStatusFeedback({
						type: "success",
						message: isAr ? "تم الربط والمزامنة الحية عبر الواي فاي بنجاح! كل العمليات تظهر الآن لايف في الجهازين." : "Connected & synced live over Wi-Fi! All operations now appear live on both devices."
					});
				} else setStatusFeedback({
					type: "error",
					message: isAr ? "تعذر الوصول إلى عنوان IP للكمبيوتر. تأكد أن الهاتف واللابتوب على نفس شبكة الواي فاي أو نقطة الاتصال." : "Could not reach Laptop IP. Ensure both Android and Windows are on the same Wi-Fi or Hotspot."
				});
			}, 150);
		} catch {
			setIsManualSyncing(false);
		}
	};
	const handleManualPushNow = async () => {
		setIsManualSyncing(true);
		setStatusFeedback(null);
		const ok = await pushLiveLanSyncNow("مزامنة شاملة فورية عبر الواي فاي", "Manual full Wi-Fi sync");
		setIsManualSyncing(false);
		if (ok) {
			playSuccessChime(settings.soundEnabled);
			triggerHaptic("success", settings.hapticsEnabled);
			setStatusFeedback({
				type: "success",
				message: isAr ? "تمت المزامنة الفورية بنجاح بين الويندوز والأندرويد!" : "Instant bidirectional sync completed between Windows and Android!"
			});
		} else setStatusFeedback({
			type: "error",
			message: isAr ? "فشل الاتصال بالمضيف. تحقق من عنوان IP واتصال الواي فاي." : "Failed to reach host. Verify the IP address and Wi-Fi connection."
		});
	};
	const handleDisconnect = () => {
		updateLanSyncConfig({ enabled: false });
		setStatusFeedback({
			type: "error",
			message: isAr ? "تم إيقاف المزامنة الحية مؤقتاً." : "Live Wi-Fi sync paused."
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		"data-testid": "live-wifi-sync-section",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `p-4 rounded-xl border transition-all ${lanConnectionStatus === "connected" ? "bg-emerald-500/10 border-emerald-500/30" : lanConnectionStatus === "connecting" ? "bg-amber-500/10 border-amber-500/30" : "bg-zinc-950/90 border-zinc-800"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `w-11 h-11 rounded-xl flex items-center justify-center border ${lanConnectionStatus === "connected" ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : lanConnectionStatus === "connecting" ? "bg-amber-500/20 border-amber-500/40 text-amber-400" : "bg-zinc-900 border-zinc-700 text-zinc-400"}`,
								children: lanConnectionStatus === "connected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "w-5 h-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-black text-white",
									children: isAr ? "المزامنة الحية ثنائية الاتجاه عبر الواي فاي (Windows ⇄ Android)" : "Live Bidirectional Wi-Fi Sync (Windows ⇄ Android)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${lanConnectionStatus === "connected" ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" : lanConnectionStatus === "connecting" ? "bg-amber-500/20 border-amber-500/40 text-amber-300" : "bg-zinc-800 border-zinc-700 text-zinc-400"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${lanConnectionStatus === "connected" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" : lanConnectionStatus === "connecting" ? "bg-amber-400" : "bg-zinc-500"}` }), lanConnectionStatus === "connected" ? isAr ? "متصل لايف (مزامنة فورية)" : "Connected Live (Real-Time)" : lanConnectionStatus === "connecting" ? isAr ? "جاري الاتصال..." : "Connecting..." : lanConnectionStatus === "unconfigured" ? isAr ? "بانتظار إدخال IP الكمبيوتر" : "Awaiting Laptop IP" : isAr ? "غير متصل" : "Disconnected"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-zinc-400 mt-1",
								children: isAr ? "أي عملية بيع، إضافة منتج، تعديل مخزون، أو عميل تتم على الأندرويد تظهر فوراً في الويندوز والعكس بدون إنترنت سحابي." : "Every sale, product edit, stock movement, or customer action on Android appears instantly on Windows and vice-versa over local Wi-Fi."
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleManualPushNow,
								disabled: isManualSyncing,
								"data-testid": "lan-sync-push-now-btn",
								className: "px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-3.5 h-3.5 ${isManualSyncing ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "مزامنة فورية الآن" : "Sync Live Now" })]
							}), lanSyncConfig.enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleDisconnect,
								className: "px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unlink, { className: "w-3.5 h-3.5 text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "إيقاف مؤقت" : "Pause" })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => handleSaveAndConnect(),
								className: "px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تفعيل المزامنة" : "Enable Sync" })]
							})]
						})]
					}),
					statusFeedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `mt-3 p-2.5 rounded-lg border text-xs font-bold flex items-center gap-2 ${statusFeedback.type === "success" ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300" : "bg-rose-950/60 border-rose-500/40 text-rose-300"}`,
						children: [statusFeedback.type === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 shrink-0 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0 text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: statusFeedback.message })]
					}),
					lanLastSyncError && lanConnectionStatus === "disconnected" && !statusFeedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0 text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? `تنبيه الاتصال: تأكد من تشغيل النظام على اللابتوب واتصال الجهازين بنفس شبكة الواي فاي (${lanLastSyncError})` : `Connection notice: Ensure the Windows Laptop server is running on the same Wi-Fi (${lanLastSyncError})` })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-xl bg-zinc-950/90 border border-zinc-800/80 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, { className: "w-4 h-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-black text-white",
									children: isAr ? "1. عنوان مضيف الويندوز (Laptop Wi-Fi Host)" : "1. Windows Laptop Wi-Fi Host Address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-zinc-400",
									children: isAr ? "استخدم هذا العنوان أو امسح الباركود من تطبيق الأندرويد للربط الفوري" : "Enter this IP or scan the barcode from the Android app to pair"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 text-[10px] font-mono",
								children: "Port 3000"
							})]
						}),
						lanNetworkAddresses.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[11px] font-bold text-zinc-400 mb-1",
							children: isAr ? "اختر شبكة الواي فاي / نقطة الاتصال:" : "Select Wi-Fi / Hotspot Interface:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: selectedAddressIdx,
							onChange: (e) => setSelectedAddressIdx(Number(e.target.value)),
							className: "w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white font-mono focus:outline-none focus:border-sky-500",
							children: lanNetworkAddresses.map((addr, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: idx,
								children: [
									addr.url,
									" (",
									addr.interfaceName,
									")"
								]
							}, `${addr.ip}-${idx}`))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-bold text-zinc-400 uppercase tracking-wider",
									children: isAr ? "رابط الربط المباشر عبر الواي فاي" : "Direct Wi-Fi Pairing URL"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm sm:text-base font-black font-mono text-sky-400 truncate mt-0.5",
									dir: "ltr",
									"data-testid": "lan-host-primary-url",
									children: activeHostAddress
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleCopyHostUrl,
								className: "px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors",
								children: copiedUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-emerald-400",
									children: isAr ? "تم النسخ" : "Copied"
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "نسخ الرابط" : "Copy URL" })] })
							})]
						}),
						!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl bg-white text-zinc-950 border border-zinc-300 flex flex-col items-center justify-center space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-black uppercase tracking-wider text-zinc-700",
									children: isAr ? "امسح الباركود بكاميرا تطبيق الأندرويد للربط التلقائي" : "Scan with Android App Camera for Instant Pairing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									viewBox: `0 0 ${barcodeBits.length + 20} 48`,
									className: "w-full max-w-[300px] h-12",
									preserveAspectRatio: "none",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: "0",
										y: "0",
										width: barcodeBits.length + 20,
										height: "48",
										fill: "#ffffff"
									}), barcodeBits.split("").map((bit, idx) => bit === "1" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: idx + 10,
										y: "4",
										width: "1",
										height: "40",
										fill: "#09090b"
									}, idx) : null)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-mono font-black tracking-widest text-zinc-900",
									dir: "ltr",
									children: compactPairingCode
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-xl bg-zinc-950/90 border border-zinc-800/80 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-4 h-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-black text-white",
									children: isAr ? "2. إعدادات ربط الجهاز (الأندرويد أو نقطة بيع فرعية)" : "2. Pair Android Phone or Secondary Terminal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-zinc-400",
									children: isAr ? "أدخل عنوان IP الخاص باللابتوب أو امسح الباركود بالكاميرا" : "Enter the Windows Laptop IP or scan the pairing barcode"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold",
								children: lanSyncConfig.platform === "android" ? isAr ? "جهاز أندرويد" : "Android Device" : isAr ? "جهاز ويندوز" : "Windows PC"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[11px] font-bold text-zinc-400 mb-1",
								children: isAr ? "اسم هذا الجهاز في الشبكة" : "This Device Name on LAN"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: deviceNameInput,
								onChange: (e) => setDeviceNameInput(e.target.value),
								placeholder: isAr ? "مثال: كاشير أندرويد 1" : "e.g. Android POS 1",
								className: "w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-emerald-500"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-[11px] font-bold text-zinc-400 mb-1",
								children: isAr ? "عنوان IP للابتوب الويندوز (اختياري على المضيف)" : "Windows Laptop IP (Required on Android)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								dir: "ltr",
								value: hostInput,
								onChange: (e) => setHostInput(e.target.value),
								placeholder: "http://192.168.1.100:3000",
								"data-testid": "lan-host-url-input",
								className: "w-full h-9 px-3 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-emerald-300 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => handleSaveAndConnect(),
								disabled: isManualSyncing,
								"data-testid": "lan-save-connect-btn",
								className: "flex-1 min-w-[160px] h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "حفظ واتصال لايف عبر الواي فاي" : "Save & Connect Live via Wi-Fi" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setIsScannerOpen(true),
								"data-testid": "lan-scan-barcode-btn",
								className: "h-10 px-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "مسح باركود الربط بالكاميرا" : "Scan Pairing Barcode" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-4 h-4 text-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-zinc-300",
									children: isAr ? "مزامنة لحظية تلقائية عند كل عملية بيع أو تعديل" : "Instant auto-sync on every sale or edit"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => updateLanSyncConfig({ autoSyncOnEveryAction: !lanSyncConfig.autoSyncOnEveryAction }),
								className: `w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${lanSyncConfig.autoSyncOnEveryAction ? "bg-emerald-500" : "bg-zinc-700"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-5 h-5 rounded-full bg-white transition-transform ${lanSyncConfig.autoSyncOnEveryAction ? isAr ? "-translate-x-5" : "translate-x-5" : "translate-x-0"}` })
							})]
						}),
						isAndroidApk && !lanSyncConfig.hostUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300",
							children: isAr ? "ملاحظة لتطبيق الأندرويد: اكتب عنوان الـ IP الظاهر في شاشة اللابتوب (مثل 192.168.1.100:3000) أو اضغط \"مسح باركود الربط بالكاميرا\" ليتم الربط فوراً." : "Android Tip: Enter the IP shown on your Windows Laptop (e.g. 192.168.1.100:3000) or tap Scan Pairing Barcode."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-xl bg-zinc-950/90 border border-zinc-800/80 space-y-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "w-4 h-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs font-black text-white",
								children: isAr ? "الأجهزة المتصلة حالياً على الشبكة" : "Devices Currently Online on LAN"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold",
							children: [
								lanConnectedDevices.length,
								" ",
								isAr ? "جهاز متصل" : lanConnectedDevices.length === 1 ? "Device" : "Devices"
							]
						})]
					}), lanConnectedDevices.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/60 text-center text-xs text-zinc-500",
						children: isAr ? "لا توجد أجهزة مقترنة نشطة حالياً. بمجرد ربط الأندرويد والويندوز سيظهران هنا لايف." : "No active paired peers yet. Once Windows and Android connect, both appear here live."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2 max-h-44 overflow-y-auto pr-1",
						children: lanConnectedDevices.map((dev) => {
							const isSelf = dev.deviceId === lanSyncConfig.deviceId;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${dev.platform === "android" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-sky-500/15 text-sky-400 border border-sky-500/30"}`,
										children: dev.platform === "android" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, { className: "w-4 h-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold text-white truncate",
												children: dev.deviceName
											}), isSelf && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold",
												children: isAr ? "هذا الجهاز" : "This Device"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] text-zinc-400 font-mono",
											dir: "ltr",
											children: [
												dev.platform.toUpperCase(),
												" • ",
												dev.ipAddress || "LAN"
											]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" }), isAr ? "متصل لايف" : "Live"]
								})]
							}, dev.deviceId);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-xl bg-zinc-950/90 border border-zinc-800/80 space-y-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-4 h-4 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs font-black text-white",
								children: isAr ? "سجل العمليات المتزامنة لحظياً (Live Feed)" : "Real-Time Synced Operations Feed"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "w-3.5 h-3.5 text-zinc-500" })]
					}), lanRecentEvents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/60 text-center text-xs text-zinc-500",
						children: isAr ? "سيظهر هنا سجل حي لكل عملية بيع أو تعديل تتم بين الويندوز والأندرويد." : "Live log of sales, product updates, and stock actions synced between devices will appear here."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5 max-h-44 overflow-y-auto pr-1",
						children: lanRecentEvents.slice(0, 8).map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-2 rounded-lg bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-zinc-200 truncate",
									children: isAr ? ev.summaryAr : ev.summaryEn
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-zinc-400",
									children: [
										ev.deviceName,
										" (",
										ev.platform === "android" ? "Android" : "Windows",
										")"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono text-emerald-400 shrink-0",
								dir: "ltr",
								children: new Date(ev.timestamp).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
									second: "2-digit"
								})
							})]
						}, ev.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarcodeScannerModal, {
				isOpen: isScannerOpen,
				onClose: () => setIsScannerOpen(false),
				onScan: (scannedValue) => {
					setIsScannerOpen(false);
					const normalized = normalizeLanHostUrl(scannedValue);
					if (normalized) {
						setHostInput(normalized);
						handleSaveAndConnect(normalized);
					}
				}
			})
		]
	});
};
// src/components/layout/AppHeader.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var ROLE_LABELS = {
	admin: {
		en: "Admin",
		ar: "مدير النظام",
		badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40"
	},
	manager: {
		en: "Branch Manager",
		ar: "مدير الفرع",
		badgeClass: "bg-sky-500/20 text-sky-300 border-sky-500/40"
	},
	cashier: {
		en: "Cashier",
		ar: "كاشير مبيعات",
		badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
	},
	inventory_clerk: {
		en: "Inventory Clerk",
		ar: "أمين مخزن",
		badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/40"
	}
};
var AppHeader = ({ onOpenCart }) => {
	const { products, transactions, customers, unmetDemandRequests, openUnmetDemandModal, settings, updateSettings, currencies, cartTotals, cart, activeTab, setActiveTab, users, activeSessions, currentUser, switchCurrentUser, toggleUserActiveSession, startTrainingTour, trainingTourProgress, workspaceMode, openOnboardingModal, lanConnectionStatus, lanConnectedDevices } = usePOS();
	const t = getTranslation(settings.language);
	const isAr = settings.language === "ar";
	const [isUserMenuOpen, setIsUserMenuOpen] = (0, import_react.useState)(false);
	const [isNotificationsModalOpen, setIsNotificationsModalOpen] = (0, import_react.useState)(false);
	const [isWifiSyncModalOpen, setIsWifiSyncModalOpen] = (0, import_react.useState)(false);
	const [lifecycleMap, setLifecycleMap] = (0, import_react.useState)(() => loadNotificationLifecycleMap());
	const userMenuRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const refreshLifecycle = () => {
			setLifecycleMap(loadNotificationLifecycleMap());
		};
		window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, refreshLifecycle);
		return () => window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, refreshLifecycle);
	}, []);
	const storeNotifications = (0, import_react.useMemo)(() => buildStoreNotificationsList({
		products,
		transactions,
		customers,
		unmetDemandRequests,
		lifecycleMap
	}), [
		products,
		transactions,
		customers,
		unmetDemandRequests,
		lifecycleMap
	]);
	const notificationCounts = (0, import_react.useMemo)(() => computeNotificationSummaryCounts(storeNotifications), [storeNotifications]);
	const handleUpdateNotificationStatus = (0, import_react.useCallback)((item, nextStatus, note) => {
		const updated = saveNotificationLifecycleStatus([item.id, item.dedupeKey], nextStatus, note);
		setLifecycleMap(updated);
	}, []);
	const handleMarkAllNotificationsRead = (0, import_react.useCallback)(() => {
		const activeKeys = [];
		for (const item of storeNotifications) if (item.status === "active") activeKeys.push(item.id, item.dedupeKey);
		if (activeKeys.length > 0) {
			const updated = saveNotificationLifecycleStatus(activeKeys, "acknowledged");
			setLifecycleMap(updated);
		}
	}, [storeNotifications]);
	const handleExecuteNotificationPrimaryAction = (0, import_react.useCallback)((item) => {
		if (item.status === "active") {
			const updated = saveNotificationLifecycleStatus([item.id, item.dedupeKey], "acknowledged");
			setLifecycleMap(updated);
		}
		setIsNotificationsModalOpen(false);
		if (item.primaryActionTarget === "unmet_demand_modal") openUnmetDemandModal({ sourceScreen: "analytics" });
		else setActiveTab(item.primaryActionTarget);
	}, [openUnmetDemandModal, setActiveTab]);
	(0, import_react.useEffect)(() => {
		const handleClickOutside = (e) => {
			if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setIsUserMenuOpen(false);
		};
		if (isUserMenuOpen) document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isUserMenuOpen]);
	const toggleLanguage = () => {
		updateSettings({ language: settings.language === "en" ? "ar" : "en" });
	};
	const activeCurrencyCodes = currencies && currencies.length > 0 ? currencies.filter((c) => c.isActive !== false).map((c) => c.code) : [];
	const roleMeta = ROLE_LABELS[currentUser.role] || ROLE_LABELS.admin;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-30 w-full bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 px-2.5 sm:px-4 py-2.5 pt-safe",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-[1600px] mx-auto flex items-center justify-between gap-1.5 sm:gap-2 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2 min-w-0 shrink-0 sm:shrink",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("dashboard"),
						className: "flex items-center gap-2 text-start focus:outline-none group min-w-0 shrink-0",
						"aria-label": "Go to Dashboard",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-neutral-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform overflow-hidden shrink-0",
							children: settings.storeLogo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: settings.storeLogo,
								alt: settings.language === "ar" ? settings.storeNameAr : settings.storeName,
								className: "w-full h-full object-contain bg-neutral-950 p-0.5"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-sm sm:text-base",
								children: "DQ"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden sm:block min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1.5 min-w-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs sm:text-base font-bold tracking-tight text-white truncate max-w-[150px] md:max-w-[220px] lg:max-w-none",
									children: settings.language === "ar" ? settings.storeNameAr : settings.storeName
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-neutral-400 font-medium hidden lg:block truncate max-w-[240px]",
								children: t.tagline
							})]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-1 sm:gap-2 min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-1 sm:gap-2 min-w-0 overflow-x-auto sm:overflow-visible no-scrollbar py-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative shrink-0",
								ref: userMenuRef,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "active-user-switcher-btn",
									onClick: () => setIsUserMenuOpen((prev) => !prev),
									className: "min-h-[34px] sm:min-h-[36px] px-2 sm:px-2.5 py-1 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/60 flex items-center gap-1.5 sm:gap-2 text-xs transition-colors",
									title: isAr ? "إدارة الحسابات والمستخدمين النشطين" : "Accounts & Concurrent Active Users",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "relative flex h-2 w-2 shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `relative inline-flex rounded-full h-2 w-2 ${users.length > 0 ? "bg-emerald-500" : "bg-amber-400"}` })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "hidden sm:inline font-bold text-white truncate max-w-[95px] md:max-w-[130px]",
											children: users.length === 0 ? isAr ? "الحسابات" : "Accounts" : isAr && currentUser.nameAr ? currentUser.nameAr : currentUser.name
										}),
										users.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `hidden lg:inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold border ${roleMeta.badgeClass}`,
											children: isAr ? roleMeta.ar : roleMeta.en
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "px-1.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-[10px] flex items-center gap-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: users.length })]
										})
									]
								}), isUserMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "fixed sm:absolute inset-x-3 sm:inset-x-auto sm:end-0 top-14 sm:top-full sm:mt-2 sm:w-80 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-3 z-50 space-y-2.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center justify-between pb-2 border-b border-neutral-800",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs font-bold text-white flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "الحسابات المضافة والجلسات النشطة" : "Configured Accounts & Active Sessions" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-neutral-400 block",
												children: users.length === 0 ? isAr ? "لا توجد أي حسابات افتراضية — أضف حساباتك الخاصة فقط" : "Zero default accounts — add only your own custom accounts" : isAr ? `${users.length} حساب مسجل • ${activeSessions.length} نشط حالياً` : `${users.length} configured accounts • ${activeSessions.length} active`
											})] })
										}),
										users.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "py-5 px-3 text-center rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-neutral-300",
												children: isAr ? "لم تقم بإضافة أي حسابات بعد" : "No accounts added yet"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-neutral-500",
												children: isAr ? "اضغط بالأسفل للانتقال إلى صفحة تخصيص الحسابات وإضافة حسابك الأول." : "Click below to open the Accounts page and create your own custom account."
											})]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-1.5 max-h-60 overflow-y-auto pe-0.5",
											children: users.map((u) => {
												const isCurrent = u.id === currentUser.id;
												const isSessionOnline = activeSessions.some((s) => s.userId === u.id);
												const rMeta = ROLE_LABELS[u.role] || ROLE_LABELS.cashier;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `p-2 rounded-xl border flex items-center justify-between gap-2 transition-colors ${isCurrent ? "bg-amber-500/10 border-amber-500/40" : "bg-neutral-950/70 border-neutral-800/80 hover:border-neutral-700"}`,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: () => {
															switchCurrentUser(u.id);
															setIsUserMenuOpen(false);
														},
														className: "flex-1 text-start min-w-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full shrink-0 ${isSessionOnline ? "bg-emerald-400" : "bg-neutral-600"}` }),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-xs font-bold text-white truncate",
																	children: isAr && u.nameAr ? u.nameAr : u.name
																}),
																isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-amber-400 shrink-0" })
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5 mt-0.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: `px-1.5 py-0.2 rounded text-[9px] font-bold border ${rMeta.badgeClass}`,
																children: isAr ? rMeta.ar : rMeta.en
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[10px] text-neutral-400 truncate",
																children: isAr && u.terminalNameAr ? u.terminalNameAr : u.terminalName
															})]
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => toggleUserActiveSession(u.id),
														className: `px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors shrink-0 ${isSessionOnline ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25" : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white"}`,
														children: isSessionOnline ? isAr ? "نشط الآن" : "Active" : isAr ? "تفعيل" : "Activate"
													})]
												}, u.id);
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setActiveTab("settings");
												setIsUserMenuOpen(false);
											},
											className: "w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تخصيص وإدارة الحسابات والصلاحيات" : "Customize & Manage Accounts" })]
										})
									]
								})]
							}),
							activeCurrencyCodes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex items-center shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "hidden sm:block w-3.5 h-3.5 text-amber-400 absolute start-2.5 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									"aria-label": "Active Currency",
									value: activeCurrencyCodes.includes(settings.currency) ? settings.currency : activeCurrencyCodes[0],
									onChange: (e) => updateSettings({ currency: e.target.value }),
									className: "min-h-[34px] sm:min-h-[36px] ps-2 sm:ps-7 pe-1.5 sm:pe-2.5 py-1 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/60 text-[11px] sm:text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-500 cursor-pointer",
									children: activeCurrencyCodes.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: code,
										className: "bg-neutral-900 text-white",
										children: code
									}, code))
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "header-add-currency-shortcut-btn",
								onClick: () => setActiveTab("settings"),
								title: isAr ? "إضافة عملات المتجر" : "Add Store Currencies",
								className: "shrink-0 min-h-[34px] sm:min-h-[36px] px-2 sm:px-2.5 py-1 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/60 text-[11px] sm:text-xs font-bold text-amber-400 flex items-center gap-1 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "w-3.5 h-3.5 text-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden md:inline",
									children: isAr ? "+ عملة" : "+ Currency"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "header-workspace-onboarding-btn",
								onClick: () => openOnboardingModal("hub"),
								"aria-label": isAr ? "بوابة الشركات ووضع التدريب التجريبي" : "Company Onboarding & Practice Mode",
								className: `shrink-0 min-h-[34px] sm:min-h-[36px] px-2 sm:px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${workspaceMode === "PRACTICE" ? "bg-amber-500/20 border-amber-400/60 text-amber-300" : "bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-emerald-400"}`,
								title: isAr ? "الشركات ووضع التدريب التجريبي" : "Company Setup & Practice Mode",
								children: [workspaceMode === "PRACTICE" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: "w-3.5 h-3.5 text-amber-400 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-3.5 h-3.5 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden xl:inline",
									children: workspaceMode === "PRACTICE" ? isAr ? "وضع التدريب" : "Practice" : isAr ? "الشركة / التأسيس" : "Workspace"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "launch-training-tour-btn",
								onClick: () => startTrainingTour(trainingTourProgress.completed ? 0 : trainingTourProgress.lastStepIndex),
								"aria-label": isAr ? "بدء الجولة التدريبية للبرنامج" : "Start Interactive Training Tour",
								className: "shrink-0 min-h-[34px] sm:min-h-[36px] px-2 sm:px-2.5 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors relative",
								title: isAr ? "بدء الجولة التدريبية التفاعلية للبرنامج" : "Launch Interactive POS Training Tour",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "w-3.5 h-3.5 text-amber-400 shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden md:inline",
										children: isAr ? "جولة تدريبية" : "Tour"
									}),
									!trainingTourProgress.completed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-amber-400 animate-pulse" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "header-live-wifi-sync-btn",
								onClick: () => setIsWifiSyncModalOpen(true),
								"aria-label": isAr ? "المزامنة الحية عبر الواي فاي بين الويندوز والأندرويد" : "Live Wi-Fi Sync (Windows & Android)",
								title: isAr ? "ربط ومزامنة حية عبر الواي فاي بين اللابتوب والأندرويد" : "Pair & Sync Live over Wi-Fi between Windows Laptop and Android",
								className: `shrink-0 min-h-[34px] sm:min-h-[36px] px-2 sm:px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${lanConnectionStatus === "connected" ? "bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/40 text-emerald-300" : lanConnectionStatus === "connecting" ? "bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-300" : "bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-400"}`,
								children: [
									lanConnectionStatus === "connected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "w-3.5 h-3.5 text-emerald-400 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "w-3.5 h-3.5 text-neutral-400 shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden md:inline",
										children: isAr ? "مزامنة Wi-Fi" : "Wi-Fi Sync"
									}),
									lanConnectedDevices.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-black leading-none",
										children: lanConnectedDevices.length
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "header-notifications-bell-btn",
								onClick: () => {
									setIsNotificationsModalOpen(true);
								},
								"aria-label": isAr ? "جرس التنبيهات والإشعارات الذكية" : "Smart Notifications & Alerts Bell",
								title: isAr ? "جرس التنبيهات (اضغط لعرض التفاصيل والتعامل معها)" : "Notifications Bell (Click to view details & handle)",
								className: `shrink-0 relative min-h-[34px] sm:min-h-[36px] px-2 sm:px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${notificationCounts.criticalActive > 0 ? "bg-rose-500/20 hover:bg-rose-500/30 border-rose-500/50 text-rose-300" : notificationCounts.active > 0 ? "bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/50 text-amber-300" : "bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300"}`,
								children: [
									notificationCounts.active > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "w-4 h-4 text-amber-400 shrink-0 animate-pulse" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-4 h-4 text-neutral-400 shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden lg:inline",
										children: isAr ? "التنبيهات" : "Alerts"
									}),
									notificationCounts.active > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"data-testid": "header-notifications-bell-badge",
										className: `px-1.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold leading-none ${notificationCounts.criticalActive > 0 ? "bg-rose-500 text-white" : "bg-amber-500 text-neutral-950"}`,
										children: notificationCounts.active
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								variant: "ghost",
								size: "sm",
								onClick: toggleLanguage,
								leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-3.5 h-3.5 shrink-0" }),
								className: "shrink-0 whitespace-nowrap font-medium text-neutral-300 hover:text-white px-2 sm:px-2.5",
								"aria-label": `Switch language to ${settings.language === "en" ? "Arabic" : "English"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] sm:text-xs",
									children: settings.language === "en" ? "عربي" : "EN"
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TactileButton, {
						variant: cart.length > 0 ? "amber" : "secondary",
						size: "sm",
						onClick: () => {
							if (activeTab !== "checkout") setActiveTab("checkout");
							onOpenCart?.();
						},
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "w-4 h-4 shrink-0" }),
						className: "relative shrink-0 whitespace-nowrap font-mono font-semibold px-2 sm:px-3",
						"aria-label": `Cart contains ${cartTotals.totalItemsCount} items`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline tabular-nums text-xs",
							children: formatCurrency(cartTotals.grandTotal, settings.currency, settings.language)
						}), cart.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -top-1 -end-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-neutral-950",
							children: cartTotals.totalItemsCount
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsBellModal, {
				isOpen: isNotificationsModalOpen,
				onClose: () => {
					setIsNotificationsModalOpen(false);
				},
				notifications: storeNotifications,
				counts: notificationCounts,
				isAr,
				onUpdateStatus: handleUpdateNotificationStatus,
				onMarkAllRead: handleMarkAllNotificationsRead,
				onExecutePrimaryAction: handleExecuteNotificationPrimaryAction
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
				isOpen: isWifiSyncModalOpen,
				onClose: () => setIsWifiSyncModalOpen(false),
				maxWidth: "full",
				title: isAr ? "المزامنة الحية عبر الواي فاي (ربط اللابتوب مع الأندرويد)" : "Live Wi-Fi LAN Sync (Windows Laptop ⇄ Android)",
				description: isAr ? "كل العمليات التي تقوم بها في الأندرويد تظهر لايف في الويندوز وكذلك العكس" : "All actions on Android appear live on Windows and vice-versa",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveWifiSyncSection, {})
			})
		]
	});
};
// src/components/layout/BottomNavigation.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var NAV_ITEMS = [
	{
		id: "checkout",
		labelKey: "checkout",
		icon: CreditCard
	},
	{
		id: "dashboard",
		labelKey: "dashboard",
		icon: LayoutDashboard
	},
	{
		id: "products",
		labelKey: "products",
		icon: Package
	},
	{
		id: "inventory",
		labelKey: "inventory",
		icon: Layers
	},
	{
		id: "sales",
		labelKey: "sales",
		icon: Receipt
	},
	{
		id: "expenses",
		labelKey: "expenses",
		icon: Wallet
	},
	{
		id: "customers",
		labelKey: "customers",
		icon: Users
	},
	{
		id: "reports",
		labelKey: "reports",
		icon: ChartColumn
	},
	{
		id: "settings",
		labelKey: "settings",
		icon: Settings
	}
];
var BottomNavigation = () => {
	const { activeTab, setActiveTab, settings } = usePOS();
	const t = getTranslation(settings.language);
	const handleSelect = (tab) => {
		if (tab === activeTab) return;
		playTactileClick(settings.soundEnabled);
		triggerHaptic("light", settings.hapticsEnabled);
		setActiveTab(tab);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800/80 pb-safe",
		role: "navigation",
		"aria-label": "Main application navigation",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-[1600px] mx-auto px-1 sm:px-3 grid grid-cols-9 gap-0.5 sm:gap-1 h-16 items-center",
			children: NAV_ITEMS.map((item) => {
				const Icon = item.icon;
				const isActive = activeTab === item.id;
				const label = t[item.labelKey];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					"data-testid": `nav-tab-${item.id}`,
					onClick: () => handleSelect(item.id),
					"aria-label": label,
					className: `relative flex flex-col items-center justify-center min-w-0 w-full min-h-[48px] px-0.5 sm:px-2 py-1 transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 rounded-xl ${isActive ? "text-amber-400 font-semibold" : "text-neutral-400 hover:text-neutral-200"}`,
					children: [isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						layoutId: "activeTabBadge",
						className: "absolute inset-0 bg-neutral-900 border border-neutral-700/70 rounded-xl",
						transition: {
							type: "spring",
							stiffness: 500,
							damping: 35
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 flex flex-col items-center min-w-0 w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `w-4 h-4 sm:w-5 sm:h-5 transition-transform shrink-0 ${isActive ? "scale-110" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] sm:text-[10px] tracking-tight mt-0.5 truncate max-w-full px-0.5",
							children: label
						})]
					})]
				}, item.id);
			})
		})
	});
};
// src/lib/number-utils.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
/**
* Normalizes numeric string input from any keyboard layout or locale:
* - Converts Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) to Latin numerals (0-9).
* - Handles thousands separators vs decimal separators (comma vs dot).
* - Converts Arabic comma (،) and Arabic decimal separator (٫) to dot (.).
* - Strips non-numeric characters while preserving sign and decimal point.
* - Prevents multiple decimal points.
*/
function normalizeNumberInput(val) {
	if (!val) return "";
	const arabicDigits = [
		"٠",
		"١",
		"٢",
		"٣",
		"٤",
		"٥",
		"٦",
		"٧",
		"٨",
		"٩"
	];
	let normalized = val.trim();
	for (let i = 0; i < 10; i++) normalized = normalized.replaceAll(arabicDigits[i], i.toString());
	normalized = normalized.replaceAll("٫", ".");
	const hasComma = normalized.includes(",") || normalized.includes("،");
	const hasDot = normalized.includes(".");
	if (hasComma && hasDot) {
		const lastComma = Math.max(normalized.lastIndexOf(","), normalized.lastIndexOf("،"));
		if (normalized.lastIndexOf(".") > lastComma) normalized = normalized.replace(/[،,]/g, "");
		else normalized = normalized.replaceAll(".", "").replace(/[،,]/g, ".");
	} else if (hasComma) normalized = normalized.replace(/[،,]/g, ".");
	normalized = normalized.replace(/[^0-9.]/g, "");
	const parts = normalized.split(".");
	if (parts.length > 2) normalized = parts[0] + "." + parts.slice(1).join("");
	return normalized;
}
/**
* Safely parses a normalized numeric string into a float, returning fallback (default 0) if invalid.
*/
function parseNormalizedNumber(val, fallback = 0) {
	const normalized = normalizeNumberInput(val);
	const num = parseFloat(normalized);
	return isNaN(num) || !isFinite(num) ? fallback : num;
}
// src/components/ui/DynamicButton.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var DynamicButton = ({ status, onClick, readyLabel, readyIcon, processingLabel = "Processing...", successLabel = "Completed!", errorLabel = "Failed - Tap to Retry", className = "", variant = "emerald", disabled = false }) => {
	const handleClick = () => {
		if (disabled || status === "processing") return;
		playTactileClick();
		triggerHaptic("medium");
		onClick?.();
	};
	const variantStyles = {
		emerald: {
			ready: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_4px_0_0_#065f46,0_8px_16px_rgba(16,185,129,0.3)]",
			processing: "bg-emerald-700 text-emerald-100 shadow-[0_2px_0_0_#065f46]",
			success: "bg-emerald-500 text-white shadow-[0_4px_0_0_#047857,0_8px_20px_rgba(16,185,129,0.4)]",
			error: "bg-rose-600 text-white shadow-[0_4px_0_0_#9f1239]"
		},
		amber: {
			ready: "bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-[0_4px_0_0_#b45309,0_8px_16px_rgba(245,158,11,0.25)]",
			processing: "bg-amber-600 text-neutral-950 shadow-[0_2px_0_0_#b45309]",
			success: "bg-emerald-500 text-white shadow-[0_4px_0_0_#047857]",
			error: "bg-rose-600 text-white shadow-[0_4px_0_0_#9f1239]"
		},
		primary: {
			ready: "bg-neutral-900 hover:bg-neutral-800 text-white shadow-[0_4px_0_0_#171717,0_8px_16px_rgba(0,0,0,0.35)]",
			processing: "bg-neutral-800 text-neutral-300 shadow-[0_2px_0_0_#171717]",
			success: "bg-emerald-600 text-white shadow-[0_4px_0_0_#047857]",
			error: "bg-rose-600 text-white shadow-[0_4px_0_0_#9f1239]"
		},
		danger: {
			ready: "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_4px_0_0_#9f1239,0_8px_16px_rgba(244,63,94,0.3)]",
			processing: "bg-rose-700 text-rose-100 shadow-[0_2px_0_0_#9f1239]",
			success: "bg-emerald-600 text-white shadow-[0_4px_0_0_#047857]",
			error: "bg-rose-700 text-white shadow-[0_2px_0_0_#9f1239]"
		}
	}[variant];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
		layout: true,
		transition: {
			type: "spring",
			stiffness: 450,
			damping: 32,
			mass: .8
		},
		disabled: disabled || status === "processing",
		onClick: handleClick,
		whileTap: { y: 2 },
		className: `relative inline-flex items-center justify-center min-h-[50px] px-6 py-3 rounded-2xl font-semibold text-sm transition-colors duration-150 border border-white/10 select-none overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${variantStyles[status]} ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${className}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, {
			mode: "popLayout",
			initial: false,
			children: [
				status === "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 12,
						filter: "blur(2px)"
					},
					animate: {
						opacity: 1,
						y: 0,
						filter: "blur(0px)"
					},
					exit: {
						opacity: 0,
						y: -12,
						filter: "blur(2px)"
					},
					transition: {
						duration: .2,
						ease: [
							.16,
							1,
							.3,
							1
						]
					},
					className: "flex items-center gap-2 whitespace-nowrap",
					children: [readyIcon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0",
						children: readyIcon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tracking-tight",
						children: readyLabel
					})]
				}, "ready"),
				status === "processing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 12,
						filter: "blur(2px)"
					},
					animate: {
						opacity: 1,
						y: 0,
						filter: "blur(0px)"
					},
					exit: {
						opacity: 0,
						y: -12,
						filter: "blur(2px)"
					},
					transition: {
						duration: .2,
						ease: [
							.16,
							1,
							.3,
							1
						]
					},
					className: "flex items-center gap-2 whitespace-nowrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin text-current shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tracking-tight",
						children: processingLabel
					})]
				}, "processing"),
				status === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						scale: .85,
						filter: "blur(2px)"
					},
					animate: {
						opacity: 1,
						scale: 1,
						filter: "blur(0px)"
					},
					exit: {
						opacity: 0,
						y: -12,
						filter: "blur(2px)"
					},
					transition: {
						duration: .25,
						ease: [
							.16,
							1,
							.3,
							1
						]
					},
					className: "flex items-center gap-2 whitespace-nowrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 stroke-[2.5] text-current shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tracking-tight",
						children: successLabel
					})]
				}, "success"),
				status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 12,
						filter: "blur(2px)"
					},
					animate: {
						opacity: 1,
						y: 0,
						filter: "blur(0px)"
					},
					exit: {
						opacity: 0,
						y: -12,
						filter: "blur(2px)"
					},
					transition: {
						duration: .2,
						ease: [
							.16,
							1,
							.3,
							1
						]
					},
					className: "flex items-center gap-2 whitespace-nowrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 text-current shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tracking-tight",
						children: errorLabel
					})]
				}, "error")
			]
		})
	});
};
// src/components/ui/HoldToConfirm.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var HoldToConfirm = ({ onConfirm, label, confirmingLabel = "Hold to confirm...", confirmedLabel = "Confirmed", holdDurationMs = 1200, variant = "danger", icon = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4" }), allowUndo = true, undoDurationSeconds = 4, onUndo, className = "", disabled = false }) => {
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [isHolding, setIsHolding] = (0, import_react.useState)(false);
	const [isConfirmed, setIsConfirmed] = (0, import_react.useState)(false);
	const [isUndoPeriod, setIsUndoPeriod] = (0, import_react.useState)(false);
	const [undoSecondsLeft, setUndoSecondsLeft] = (0, import_react.useState)(undoDurationSeconds);
	const startTimeRef = (0, import_react.useRef)(null);
	const animFrameRef = (0, import_react.useRef)(null);
	const undoTimerRef = (0, import_react.useRef)(null);
	const undoIntervalRef = (0, import_react.useRef)(null);
	const cancelHold = (0, import_react.useCallback)(() => {
		if (isConfirmed) return;
		setIsHolding(false);
		startTimeRef.current = null;
		if (animFrameRef.current) {
			cancelAnimationFrame(animFrameRef.current);
			animFrameRef.current = null;
		}
		setProgress(0);
	}, [isConfirmed]);
	const executeConfirmedAction = (0, import_react.useCallback)(() => {
		setIsConfirmed(true);
		setIsHolding(false);
		setProgress(1);
		triggerHaptic("success");
		if (allowUndo) {
			setIsUndoPeriod(true);
			setUndoSecondsLeft(undoDurationSeconds);
			undoIntervalRef.current = setInterval(() => {
				setUndoSecondsLeft((prev) => Math.max(0, prev - 1));
			}, 1e3);
			undoTimerRef.current = setTimeout(() => {
				setIsUndoPeriod(false);
				setIsConfirmed(false);
				setProgress(0);
				onConfirm();
			}, undoDurationSeconds * 1e3);
		} else {
			onConfirm();
			setTimeout(() => {
				setIsConfirmed(false);
				setProgress(0);
			}, 1500);
		}
	}, [
		allowUndo,
		onConfirm,
		undoDurationSeconds
	]);
	const startHold = () => {
		if (disabled || isConfirmed || isUndoPeriod) return;
		setIsHolding(true);
		playTactileClick();
		triggerHaptic("medium");
		startTimeRef.current = performance.now();
		const updateLoop = (now) => {
			if (!startTimeRef.current) return;
			const elapsed = now - startTimeRef.current;
			const rawProgress = Math.min(1, elapsed / holdDurationMs);
			setProgress(rawProgress);
			if (rawProgress > 0 && Math.floor(rawProgress * 10) > Math.floor((rawProgress - .05) * 10)) {
				playHoldTick(rawProgress);
				triggerHaptic("light");
			}
			if (rawProgress >= 1) executeConfirmedAction();
			else animFrameRef.current = requestAnimationFrame(updateLoop);
		};
		animFrameRef.current = requestAnimationFrame(updateLoop);
	};
	const handleUndo = () => {
		if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
		if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
		setIsUndoPeriod(false);
		setIsConfirmed(false);
		setProgress(0);
		playTactileClick();
		triggerHaptic("medium");
		onUndo?.();
	};
	(0, import_react.useEffect)(() => {
		return () => {
			if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
			if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
			if (undoIntervalRef.current) clearInterval(undoIntervalRef.current);
		};
	}, []);
	const variantBorder = {
		danger: "border-rose-500/40 hover:border-rose-400 bg-neutral-900",
		warning: "border-amber-500/40 hover:border-amber-400 bg-neutral-900",
		primary: "border-neutral-700 hover:border-neutral-500 bg-neutral-900"
	}[variant];
	const fillBg = {
		danger: "bg-rose-600/80",
		warning: "bg-amber-600/80",
		primary: "bg-neutral-700/90"
	}[variant];
	if (isUndoPeriod) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative flex items-center justify-between gap-3 p-2.5 px-4 bg-neutral-900 border border-amber-500/40 rounded-2xl ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-xs font-medium text-amber-200",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				"Action triggered. Executing in ",
				undoSecondsLeft,
				"s"
			] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: handleUndo,
			className: "flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-xl shadow-sm active:scale-95 transition-all",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Undo" })]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "button",
		tabIndex: 0,
		"aria-label": label,
		onMouseDown: startHold,
		onMouseUp: cancelHold,
		onMouseLeave: cancelHold,
		onTouchStart: startHold,
		onTouchEnd: cancelHold,
		onTouchCancel: cancelHold,
		className: `relative overflow-hidden select-none cursor-pointer rounded-2xl border min-h-[46px] px-4 py-2.5 flex items-center justify-center transition-all duration-150 active:scale-[0.98] ${variantBorder} ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""} ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			className: `absolute inset-0 ${fillBg} origin-left pointer-events-none`,
			style: { width: `${progress * 100}%` },
			transition: {
				ease: "linear",
				duration: 0
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative z-10 flex items-center gap-2 text-sm font-semibold tracking-tight text-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "wait",
				children: isConfirmed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						scale: .8,
						opacity: 0
					},
					animate: {
						scale: 1,
						opacity: 1
					},
					exit: { opacity: 0 },
					className: "flex items-center gap-2 text-emerald-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: confirmedLabel })]
				}, "confirmed") : isHolding ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					exit: { opacity: 0 },
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-white animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						confirmingLabel,
						" (",
						Math.round(progress * 100),
						"%)"
					] })]
				}, "holding") : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					exit: { opacity: 0 },
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-rose-400 shrink-0",
						children: icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
				}, "idle")
			})
		})]
	});
};
// src/components/checkout/PaymentModal.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
/**
* Compresses an uploaded transfer notification receipt image into a compact Data URL for localStorage.
*/
function compressReceiptNotificationImage(file, maxDim = 640) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const img = new Image();
			img.onload = () => {
				const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
				const width = Math.max(1, Math.round(img.width * scale));
				const height = Math.max(1, Math.round(img.height * scale));
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					resolve(reader.result);
					return;
				}
				ctx.clearRect(0, 0, width, height);
				ctx.drawImage(img, 0, 0, width, height);
				resolve(canvas.toDataURL("image/jpeg", .82));
			};
			img.onerror = () => resolve(reader.result);
			img.src = reader.result;
		};
		reader.onerror = (err) => reject(err);
		reader.readAsDataURL(file);
	});
}
var PaymentModal = ({ isOpen, onClose, onSuccess }) => {
	const { cartTotals, settings, currencies: contextCurrencies, exchangeRates: contextExchangeRates, customers, selectedCustomer, setSelectedCustomer, processCheckout } = usePOS();
	const t = getTranslation(settings.language);
	const isAr = settings.language === "ar";
	const [paymentMethod, setPaymentMethod] = (0, import_react.useState)("cash");
	const [paymentStatus, setPaymentStatus] = (0, import_react.useState)("paid");
	const [fulfillmentType, setFulfillmentType] = (0, import_react.useState)("goods_and_invoice");
	const [transferReference, setTransferReference] = (0, import_react.useState)("");
	const [transferReceiptImage, setTransferReceiptImage] = (0, import_react.useState)("");
	const receiptFileInputRef = (0, import_react.useRef)(null);
	const [availableCurrencies, setAvailableCurrencies] = (0, import_react.useState)(() => contextCurrencies && contextCurrencies.length > 0 ? contextCurrencies.map((c) => c.code) : [
		"SDG",
		"USD",
		"SAR",
		"AED",
		"EUR",
		"GBP"
	]);
	const [tenderCurrency, setTenderCurrency] = (0, import_react.useState)(settings.currency);
	const [exchangeRatesMap, setExchangeRatesMap] = (0, import_react.useState)(() => ({
		USD: 2700,
		SAR: 720,
		AED: 735,
		EUR: 2950,
		GBP: 3450,
		SDG: 1,
		...contextExchangeRates || {}
	}));
	const [tenderedInput, setTenderedInput] = (0, import_react.useState)("");
	const [buttonStatus, setButtonStatus] = (0, import_react.useState)("ready");
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (contextCurrencies && contextCurrencies.length > 0) setAvailableCurrencies(contextCurrencies.map((c) => c.code));
	}, [contextCurrencies]);
	(0, import_react.useEffect)(() => {
		if (contextExchangeRates) setExchangeRatesMap((prev) => ({
			...prev,
			...contextExchangeRates,
			SDG: 1
		}));
	}, [contextExchangeRates]);
	const getRateToBase = (curr, mapObj = exchangeRatesMap) => {
		if (curr === settings.currency) return 1;
		if (settings.currency === "SDG") return mapObj[curr] || 1;
		const currToSdg = mapObj[curr] || 1;
		const baseToSdg = mapObj[settings.currency] || 1;
		return baseToSdg > 0 ? currToSdg / baseToSdg : 1;
	};
	const formatAmountForInput = (val) => {
		if (!Number.isFinite(val) || val <= 0) return "0";
		const rounded = roundCurrencyValue(val);
		if (rounded > 0 && rounded < .05) return rounded.toString();
		return rounded.toFixed(2);
	};
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		let isCancelled = false;
		setTenderCurrency(settings.currency);
		setTenderedInput(formatAmountForInput(cartTotals.grandTotal));
		setPaymentStatus("paid");
		setFulfillmentType("goods_and_invoice");
		setTransferReference("");
		setTransferReceiptImage("");
		setButtonStatus("ready");
		setErrorMessage(null);
		Promise.all([api.getCurrencies(), api.getExchangeRates(true)]).then(([currData, rates]) => {
			if (isCancelled) return;
			if (currData.currencies && currData.currencies.length > 0) setAvailableCurrencies(currData.currencies.map((c) => c.code));
			const map = { SDG: 1 };
			for (const r of rates) if (r.targetCurrency === "SDG") map[r.sourceCurrency] = r.rate;
			else if (r.sourceCurrency === "SDG" && r.rate > 0) map[r.targetCurrency] = 1 / r.rate;
			setExchangeRatesMap((prev) => ({
				...prev,
				...map
			}));
		}).catch(() => {});
		return () => {
			isCancelled = true;
		};
	}, [
		isOpen,
		cartTotals.grandTotal,
		settings.currency
	]);
	const conversionRate = getRateToBase(tenderCurrency);
	const totalInTenderCurrency = tenderCurrency === settings.currency ? cartTotals.grandTotal : cartTotals.grandTotal / (conversionRate || 1);
	const handleSelectTenderCurrency = (newCurr) => {
		playTactileClick(settings.soundEnabled);
		setTenderCurrency(newCurr);
		const rate = getRateToBase(newCurr);
		const convertedTotal = newCurr === settings.currency ? cartTotals.grandTotal : cartTotals.grandTotal / (rate || 1);
		if (paymentStatus === "paid") setTenderedInput(formatAmountForInput(convertedTotal));
		else if (paymentStatus === "unpaid") setTenderedInput("0");
		else setTenderedInput(formatAmountForInput(convertedTotal / 2));
		setErrorMessage(null);
	};
	const handleSelectPaymentStatus = (nextStatus) => {
		playTactileClick(settings.soundEnabled);
		setPaymentStatus(nextStatus);
		setErrorMessage(null);
		if (nextStatus === "paid") setTenderedInput(formatAmountForInput(totalInTenderCurrency));
		else if (nextStatus === "unpaid") setTenderedInput("0");
		else if (nextStatus === "partial") setTenderedInput(formatAmountForInput(totalInTenderCurrency / 2));
	};
	const tenderedAmount = parseNormalizedNumber(tenderedInput, 0);
	const tenderedInBaseCurrency = tenderCurrency === settings.currency ? tenderedAmount : tenderedAmount * (conversionRate || 1);
	const debtBreakdown = calculateDebtBreakdown(cartTotals.grandTotal, paymentStatus, paymentStatus === "paid" && paymentMethod !== "cash" ? cartTotals.grandTotal : tenderedInBaseCurrency);
	const changeDueInBase = paymentMethod === "cash" && paymentStatus === "paid" ? Math.max(0, Math.round((tenderedInBaseCurrency - cartTotals.grandTotal) * 100) / 100) : 0;
	const changeDueInTender = tenderCurrency === settings.currency ? changeDueInBase : changeDueInBase / (conversionRate || 1);
	const isCashUnderpaid = paymentStatus === "paid" && paymentMethod === "cash" && tenderedInBaseCurrency < cartTotals.grandTotal - .01;
	const cashPresets = (0, import_react.useMemo)(() => {
		const exact = {
			label: t.exactAmount,
			value: totalInTenderCurrency
		};
		const needed = totalInTenderCurrency;
		if (tenderCurrency === "SDG") {
			const presets = [exact];
			for (const step of [
				1e3,
				5e3,
				1e4,
				5e4,
				1e5
			]) {
				const nextRounded = Math.ceil(needed / step) * step;
				if (nextRounded > needed && !presets.some((p) => p.value === nextRounded)) presets.push({
					label: `${nextRounded.toLocaleString()} ج.س`,
					value: nextRounded
				});
			}
			return presets.slice(0, 5);
		}
		if (tenderCurrency === "USD" || tenderCurrency === "EUR" || tenderCurrency === "GBP") {
			const sym = tenderCurrency === "USD" ? "$" : tenderCurrency === "EUR" ? "€" : "£";
			return [exact, ...[
				10,
				20,
				50,
				100,
				200
			].filter((v) => v >= needed).map((v) => ({
				label: `${sym}${v}`,
				value: v
			}))].slice(0, 5);
		}
		if (tenderCurrency === "SAR" || tenderCurrency === "AED") {
			const unit = tenderCurrency === "SAR" ? "ر.س" : "د.إ";
			return [exact, ...[
				50,
				100,
				200,
				500
			].filter((v) => v >= needed).map((v) => ({
				label: `${v} ${unit}`,
				value: v
			}))].slice(0, 5);
		}
		return [exact];
	}, [
		tenderCurrency,
		totalInTenderCurrency,
		t.exactAmount
	]);
	const handleCashPreset = (val) => {
		playTactileClick(settings.soundEnabled);
		setTenderedInput(val.toFixed(2));
		setErrorMessage(null);
	};
	const handleReceiptImageUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const compressed = await compressReceiptNotificationImage(file);
			setTransferReceiptImage(compressed);
			setErrorMessage(null);
		} catch {} finally {
			if (receiptFileInputRef.current) receiptFileInputRef.current.value = "";
		}
	};
	const handleExecutePayment = async () => {
		if (paymentMethod === "bank_transfer" && paymentStatus !== "unpaid" && !transferReference.trim()) {
			setErrorMessage(isAr ? "يرجى إدخال رقم العملية للتحويل البنكي قبل إتمام الدفع." : "Please enter the Bank Transfer operation reference number before completing payment.");
			setButtonStatus("error");
			setTimeout(() => setButtonStatus("ready"), 2500);
			return;
		}
		if (paymentStatus === "partial" && (tenderedInBaseCurrency <= 0 || tenderedInBaseCurrency >= cartTotals.grandTotal)) {
			setErrorMessage(isAr ? "في حالة الدفع الجزئي يجب أن يكون المبلغ المدفوع أكبر من صفر وأقل من إجمالي الفاتورة." : "For partial payment, the paid amount must be greater than zero and less than the invoice total.");
			setButtonStatus("error");
			setTimeout(() => setButtonStatus("ready"), 2500);
			return;
		}
		if (isCashUnderpaid) {
			setErrorMessage(isAr ? `المبلغ المدفوع (${tenderedAmount.toFixed(2)} ${tenderCurrency}) أقل من الإجمالي المطلوب (${totalInTenderCurrency.toFixed(2)} ${tenderCurrency}). يمكنك اختيار "دفع جزئي" أو "لم يدفع (دين)" لتسجيل المتبقي كدين.` : `Tendered amount (${tenderedAmount.toFixed(2)} ${tenderCurrency}) is less than total due (${totalInTenderCurrency.toFixed(2)} ${tenderCurrency}). Choose Partial or Unpaid Debt to record the balance as debt.`);
			setButtonStatus("error");
			setTimeout(() => setButtonStatus("ready"), 2500);
			return;
		}
		setButtonStatus("processing");
		setErrorMessage(null);
		await new Promise((res) => setTimeout(res, 500));
		const activeCurrencyCode = (settings.currency || "SDG").toUpperCase().trim();
		const saleRateSnapshot = {
			...exchangeRatesMap,
			...contextExchangeRates || {},
			SDG: 1
		};
		const saleRateUsed = activeCurrencyCode === "SDG" ? Number(saleRateSnapshot[tenderCurrency !== "SDG" ? tenderCurrency : "USD"] || 2700) : Number(saleRateSnapshot[activeCurrencyCode] || 1);
		const result = await processCheckout(paymentMethod, tenderedInBaseCurrency, {
			transferReference: paymentMethod === "bank_transfer" ? transferReference.trim() : void 0,
			transferReceiptImage: paymentMethod === "bank_transfer" ? transferReceiptImage : void 0,
			paymentStatus,
			amountPaid: debtBreakdown.amountPaid,
			debtAmount: debtBreakdown.debtAmount,
			fulfillmentType,
			fulfillmentStatus: fulfillmentType === "invoice_only" ? "pending_goods" : fulfillmentType === "goods_only" ? "pending_invoice" : "received",
			exchangeRateUsed: saleRateUsed,
			exchangeRatesSnapshot: saleRateSnapshot
		});
		if (result.success && result.transaction) {
			setButtonStatus("success");
			setTimeout(() => {
				onSuccess(result.transaction);
			}, 650);
		} else {
			setButtonStatus("error");
			setErrorMessage(result.error || "Payment failed to process");
			setTimeout(() => setButtonStatus("ready"), 2500);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
		isOpen,
		onClose,
		title: t.payNow,
		description: `${cartTotals.totalItemsCount} ${t.itemsCount} • ${formatCurrency(cartTotals.grandTotal, settings.currency, settings.language)}`,
		maxWidth: "lg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-neutral-400 block font-medium",
								children: t.total
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight tabular-nums",
									children: formatCurrency(cartTotals.grandTotal, settings.currency, settings.language)
								}), tenderCurrency !== settings.currency && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-mono text-neutral-300 font-semibold",
									children: [
										"≈ ",
										totalInTenderCurrency.toFixed(2),
										" ",
										tenderCurrency
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-emerald-400 font-semibold block mt-1",
								children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									"يحفظ بسعر صرف البيع:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold text-white",
										dir: "ltr",
										children: [
											"1 ",
											tenderCurrency !== "SDG" ? tenderCurrency : settings.currency !== "SDG" ? settings.currency : "USD",
											" =",
											" ",
											(exchangeRatesMap[tenderCurrency !== "SDG" ? tenderCurrency : settings.currency !== "SDG" ? settings.currency : "USD"] || 2700).toLocaleString(),
											" ",
											"SDG"
										]
									})
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									"Saved at Sale Rate:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold text-white",
										dir: "ltr",
										children: [
											"1 ",
											tenderCurrency !== "SDG" ? tenderCurrency : settings.currency !== "SDG" ? settings.currency : "USD",
											" =",
											" ",
											(exchangeRatesMap[tenderCurrency !== "SDG" ? tenderCurrency : settings.currency !== "SDG" ? settings.currency : "USD"] || 2700).toLocaleString(),
											" ",
											"SDG"
										]
									})
								] })
							})
						] }),
						paymentStatus === "paid" && paymentMethod === "cash" && changeDueInBase > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-neutral-400 block font-medium",
								children: t.changeDue
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xl sm:text-2xl font-bold text-emerald-400 font-mono tracking-tight tabular-nums",
									children: formatCurrency(changeDueInBase, settings.currency, settings.language)
								}), tenderCurrency !== settings.currency && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-mono text-emerald-300/80 font-semibold",
									children: [
										"≈ ",
										changeDueInTender.toFixed(2),
										" ",
										tenderCurrency
									]
								})]
							})]
						}),
						debtBreakdown.debtAmount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-rose-400 block font-bold",
								children: t.remainingDebt
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xl sm:text-2xl font-extrabold text-rose-400 font-mono tracking-tight tabular-nums",
									children: formatCurrency(debtBreakdown.debtAmount, settings.currency, settings.language)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] font-mono text-emerald-400",
									children: [
										t.amountPaidLabel,
										":",
										" ",
										formatCurrency(debtBreakdown.amountPaid, settings.currency, settings.language)
									]
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs font-semibold text-neutral-300 block mb-1.5 flex items-center justify-between gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-3.5 h-3.5 text-neutral-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.selectCustomer })]
					}), debtBreakdown.debtAmount > 0 && !selectedCustomer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-amber-400 font-medium",
						children: isAr ? "يفضل اختيار العميل لتسجيل الدين باسمه" : "Assign customer to track debt"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: selectedCustomer?.id || "",
					onChange: (e) => {
						const cust = customers.find((c) => c.id === e.target.value) || null;
						setSelectedCustomer(cust);
					},
					"aria-label": t.selectCustomer,
					className: "w-full min-h-[44px] px-3 py-2 bg-neutral-850 border border-neutral-750 text-neutral-100 rounded-xl text-sm focus:outline-none focus:border-amber-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: t.walkInCustomer
					}), customers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: c.id,
						children: [
							c.name,
							" (",
							c.phone,
							") - ",
							c.loyaltyPoints,
							" pts",
							c.totalDebt && c.totalDebt > 0 ? ` • ${isAr ? "دين:" : "Debt:"} ${formatCurrency(c.totalDebt, settings.currency, settings.language)}` : ""
						]
					}, c.id))]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-neutral-300 block mb-2",
							children: t.paymentMethod
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setPaymentMethod("bank_transfer");
										playTactileClick(settings.soundEnabled);
										setErrorMessage(null);
									},
									className: `flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all min-h-[58px] ${paymentMethod === "bank_transfer" ? "bg-amber-500/15 border-amber-500 text-amber-300 font-bold shadow-sm" : "bg-neutral-850 border-neutral-750 text-neutral-400 hover:text-neutral-200"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "w-5 h-5 mb-1 text-current" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs",
										children: t.bankTransfer
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setPaymentMethod("cash");
										playTactileClick(settings.soundEnabled);
										setErrorMessage(null);
									},
									className: `flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all min-h-[58px] ${paymentMethod === "cash" ? "bg-amber-500/15 border-amber-500 text-amber-300 font-bold shadow-sm" : "bg-neutral-850 border-neutral-750 text-neutral-400 hover:text-neutral-200"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "w-5 h-5 mb-1 text-current" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs",
										children: t.cash
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setPaymentMethod("qr_nfc");
										playTactileClick(settings.soundEnabled);
										setErrorMessage(null);
									},
									className: `flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all min-h-[58px] ${paymentMethod === "qr_nfc" ? "bg-amber-500/15 border-amber-500 text-amber-300 font-bold shadow-sm" : "bg-neutral-850 border-neutral-750 text-neutral-400 hover:text-neutral-200"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "w-5 h-5 mb-1 text-current" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs",
										children: t.qrNfc
									})]
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 bg-neutral-950/80 border border-neutral-800 rounded-2xl space-y-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-neutral-300 block",
									children: t.paymentSettlementStatus
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => handleSelectPaymentStatus("paid"),
											className: `flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all ${paymentStatus === "paid" ? "bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-xs" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.paidInFull })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => handleSelectPaymentStatus("partial"),
											className: `flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all ${paymentStatus === "partial" ? "bg-amber-500/15 border-amber-500 text-amber-300 shadow-xs" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.partialPaymentDebt })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => handleSelectPaymentStatus("unpaid"),
											className: `flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all ${paymentStatus === "unpaid" ? "bg-rose-500/15 border-rose-500 text-rose-300 shadow-xs" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileWarning, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.unpaidFullDebt })]
										})
									]
								}),
								paymentStatus !== "paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-xl bg-neutral-900 border border-neutral-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-neutral-400 block",
											children: t.amountPaidLabel
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-mono font-bold text-emerald-400 tabular-nums",
											children: formatCurrency(debtBreakdown.amountPaid, settings.currency, settings.language)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-rose-300 block",
											children: t.remainingDebt
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-mono font-bold text-rose-400 tabular-nums",
											children: formatCurrency(debtBreakdown.debtAmount, settings.currency, settings.language)
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 bg-neutral-950/80 border border-neutral-800 rounded-2xl space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs font-semibold text-neutral-300 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.fulfillmentOptionTitle })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": "fulfillment-opt-goods-and-invoice",
										onClick: () => {
											playTactileClick(settings.soundEnabled);
											setFulfillmentType("goods_and_invoice");
										},
										className: `flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all ${fulfillmentType === "goods_and_invoice" ? "bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-xs" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "استلام البضاعة والفاتورة" : "Goods & Invoice" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": "fulfillment-opt-invoice-only",
										onClick: () => {
											playTactileClick(settings.soundEnabled);
											setFulfillmentType("invoice_only");
										},
										className: `flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all ${fulfillmentType === "invoice_only" ? "bg-amber-500/15 border-amber-500 text-amber-300 shadow-xs" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "استلام الفاتورة فقط" : "Invoice Only" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": "fulfillment-opt-goods-only",
										onClick: () => {
											playTactileClick(settings.soundEnabled);
											setFulfillmentType("goods_only");
										},
										className: `flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all ${fulfillmentType === "goods_only" ? "bg-blue-500/15 border-blue-500 text-blue-300 shadow-xs" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "استلام بضاعة فقط" : "Goods Only" })]
									})
								]
							})]
						})
					]
				}),
				paymentMethod === "bank_transfer" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 p-3.5 bg-neutral-950/70 border border-amber-500/30 rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-bold text-amber-400 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "بيانات التحويل البنكي والإشعار" : "Bank Transfer & Notification Details" })]
							}), paymentStatus !== "unpaid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono text-neutral-400",
								children: isAr ? "* رقم العملية مطلوب" : "* Reference # required"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs font-semibold text-neutral-300 block mb-1 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.transferReference })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							dir: "ltr",
							value: transferReference,
							onChange: (e) => {
								setTransferReference(e.target.value);
								setErrorMessage(null);
							},
							placeholder: t.transferReferencePlaceholder,
							"aria-label": t.transferReference,
							className: "w-full bg-neutral-900 border border-neutral-750 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs font-semibold text-neutral-300 block mb-1.5 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.transferReceiptImage })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: receiptFileInputRef,
								type: "file",
								accept: "image/*",
								onChange: handleReceiptImageUpload,
								className: "hidden",
								"aria-label": t.uploadReceiptImage
							}),
							transferReceiptImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 p-2.5 bg-neutral-900 border border-neutral-750 rounded-xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-14 h-14 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-700 shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: transferReceiptImage,
											alt: t.transferReceiptImage,
											className: "w-full h-full object-cover"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-emerald-400 block",
											children: isAr ? "تم إرفاق صورة الإشعار بنجاح" : "Notification image attached"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-neutral-400 block truncate",
											children: isAr ? "ستظهر مع الفاتورة وفي سجل المبيعات" : "Saved with invoice & receipt"
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
										type: "button",
										variant: "secondary",
										size: "sm",
										onClick: () => receiptFileInputRef.current?.click(),
										leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-3.5 h-3.5" }),
										children: t.changeReceiptImage
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
										type: "button",
										variant: "danger",
										size: "sm",
										onClick: () => setTransferReceiptImage(""),
										leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }),
										"aria-label": t.removeReceiptImage,
										children: t.removeReceiptImage
									})]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => receiptFileInputRef.current?.click(),
								className: "w-full py-3 px-4 rounded-xl border border-dashed border-neutral-700 hover:border-amber-500/70 bg-neutral-900/60 hover:bg-neutral-900 text-neutral-300 hover:text-amber-300 flex items-center justify-center gap-2 text-xs font-semibold transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-4 h-4 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.uploadReceiptImage })]
							})
						] })
					]
				}),
				(paymentMethod === "cash" && paymentStatus !== "unpaid" || paymentStatus === "partial" && paymentMethod !== "cash") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-semibold text-neutral-300 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "اختر عملة الدفع المسلمة من العميل" : "Customer Tender Currency" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-mono text-neutral-400",
								children: ["Base: ", settings.currency]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: availableCurrencies.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleSelectTenderCurrency(c),
								className: `py-1.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${tenderCurrency === c ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-sm" : "bg-neutral-850 border-neutral-750 text-neutral-400 hover:text-white"}`,
								children: c
							}, c))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs font-semibold text-neutral-300 block mb-1",
							children: [
								paymentStatus === "partial" ? t.amountPaidLabel : t.amountTendered,
								" (",
								tenderCurrency,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									inputMode: "decimal",
									dir: "ltr",
									value: tenderedInput,
									onFocus: (e) => e.target.select(),
									onChange: (e) => {
										const normalized = normalizeNumberInput(e.target.value);
										setTenderedInput(normalized);
										setErrorMessage(null);
									},
									placeholder: "0.00",
									"aria-label": paymentStatus === "partial" ? t.amountPaidLabel : t.amountTendered,
									className: "w-full bg-neutral-900 border border-neutral-750 focus:border-amber-500 rounded-xl pl-3.5 pr-20 py-2.5 text-xl font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-500 tabular-nums"
								}),
								tenderedInput && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setTenderedInput("");
										setErrorMessage(null);
									},
									className: "absolute right-14 px-2 py-0.5 text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded",
									children: isAr ? "مسح" : "CLR"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute right-3.5 text-xs font-mono font-bold text-amber-400 pointer-events-none",
									children: tenderCurrency
								})
							]
						})] }),
						paymentMethod === "cash" && paymentStatus === "paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: cashPresets.map((preset, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleCashPreset(preset.value),
								className: "px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg font-mono border border-neutral-700 transition-colors",
								children: preset.label
							}, idx))
						})
					]
				}),
				paymentMethod === "qr_nfc" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 bg-neutral-950/70 border border-neutral-800 rounded-2xl flex items-center gap-3 text-xs text-neutral-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "w-8 h-8 text-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-white font-medium",
						children: isAr ? "مسح رمز QR / محفظة رقمية" : "Scan Dynamic QR / NFC Terminal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: isAr ? "يدعم الدفع الفوري عبر المحافظ الرقمية ونقاط الاتصال القريب." : "Supports instant wallet checkout and peer-to-peer settlement." })] })]
				}),
				errorMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-rose-300 text-xs font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errorMessage })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						variant: "ghost",
						onClick: onClose,
						size: "md",
						children: t.cancel
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DynamicButton, {
						status: buttonStatus,
						onClick: handleExecutePayment,
						readyLabel: paymentStatus === "unpaid" ? `${isAr ? "تسجيل الفاتورة كدين" : "Record Invoice on Debt"} (${formatCurrency(cartTotals.grandTotal, settings.currency, settings.language)})` : paymentStatus === "partial" ? `${isAr ? "تأكيد الدفع الجزئي والدين" : "Confirm Partial & Debt"} (${formatCurrency(debtBreakdown.amountPaid, settings.currency, settings.language)})` : `${t.payNow} (${formatCurrency(cartTotals.grandTotal, settings.currency, settings.language)})`,
						processingLabel: t.processingPayment,
						successLabel: t.paymentCompleted,
						errorLabel: t.paymentFailed,
						variant: "emerald",
						className: "flex-1"
					})]
				})
			]
		})
	});
};
// node_modules/canvas-confetti/dist/confetti.module.mjs
var module = {};
(function main(global, module, isWorker, workerSize) {
	var canUseWorker = !!(global.Worker && global.Blob && global.Promise && global.OffscreenCanvas && global.OffscreenCanvasRenderingContext2D && global.HTMLCanvasElement && global.HTMLCanvasElement.prototype.transferControlToOffscreen && global.URL && global.URL.createObjectURL);
	var canUsePaths = typeof Path2D === "function" && typeof DOMMatrix === "function";
	var canDrawBitmap = (function() {
		if (!global.OffscreenCanvas) return false;
		try {
			var canvas = new OffscreenCanvas(1, 1);
			var ctx = canvas.getContext("2d");
			ctx.fillRect(0, 0, 1, 1);
			var bitmap = canvas.transferToImageBitmap();
			ctx.createPattern(bitmap, "no-repeat");
		} catch (e) {
			return false;
		}
		return true;
	})();
	function noop() {}
	function promise(func) {
		var ModulePromise = module.exports.Promise;
		var Prom = ModulePromise !== void 0 ? ModulePromise : global.Promise;
		if (typeof Prom === "function") return new Prom(func);
		func(noop, noop);
		return null;
	}
	var bitmapMapper = (function(skipTransform, map) {
		return {
			transform: function(bitmap) {
				if (skipTransform) return bitmap;
				if (map.has(bitmap)) return map.get(bitmap);
				var canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
				canvas.getContext("2d").drawImage(bitmap, 0, 0);
				map.set(bitmap, canvas);
				return canvas;
			},
			clear: function() {
				map.clear();
			}
		};
	})(canDrawBitmap, /* @__PURE__ */ new Map());
	var raf = function() {
		var TIME = Math.floor(1e3 / 60);
		var frame, cancel;
		var frames = {};
		var lastFrameTime = 0;
		if (typeof requestAnimationFrame === "function" && typeof cancelAnimationFrame === "function") {
			frame = function(cb) {
				var id = Math.random();
				frames[id] = requestAnimationFrame(function onFrame(time) {
					if (lastFrameTime === time || lastFrameTime + TIME - 1 < time) {
						lastFrameTime = time;
						delete frames[id];
						cb();
					} else frames[id] = requestAnimationFrame(onFrame);
				});
				return id;
			};
			cancel = function(id) {
				if (frames[id]) cancelAnimationFrame(frames[id]);
			};
		} else {
			frame = function(cb) {
				return setTimeout(cb, TIME);
			};
			cancel = function(timer) {
				return clearTimeout(timer);
			};
		}
		return {
			frame,
			cancel
		};
	}();
	var getWorker = (function() {
		var worker;
		var prom;
		var resolves = {};
		function decorate(worker) {
			function execute(options, callback) {
				worker.postMessage({
					options: options || {},
					callback
				});
			}
			worker.init = function initWorker(canvas) {
				var offscreen = canvas.transferControlToOffscreen();
				worker.postMessage({ canvas: offscreen }, [offscreen]);
			};
			worker.fire = function fireWorker(options, size, done) {
				if (prom) {
					execute(options, null);
					return prom;
				}
				var id = Math.random().toString(36).slice(2);
				prom = promise(function(resolve) {
					function workerDone(msg) {
						if (msg.data.callback !== id) return;
						delete resolves[id];
						worker.removeEventListener("message", workerDone);
						prom = null;
						bitmapMapper.clear();
						done();
						resolve();
					}
					worker.addEventListener("message", workerDone);
					execute(options, id);
					resolves[id] = workerDone.bind(null, { data: { callback: id } });
				});
				return prom;
			};
			worker.reset = function resetWorker() {
				worker.postMessage({ reset: true });
				for (var id in resolves) {
					resolves[id]();
					delete resolves[id];
				}
			};
		}
		return function() {
			if (worker) return worker;
			if (!isWorker && canUseWorker) {
				var code = [
					"var CONFETTI, SIZE = {}, module = {};",
					"(" + main.toString() + ")(this, module, true, SIZE);",
					"onmessage = function(msg) {",
					"  if (msg.data.options) {",
					"    CONFETTI(msg.data.options).then(function () {",
					"      if (msg.data.callback) {",
					"        postMessage({ callback: msg.data.callback });",
					"      }",
					"    });",
					"  } else if (msg.data.reset) {",
					"    CONFETTI && CONFETTI.reset();",
					"  } else if (msg.data.resize) {",
					"    SIZE.width = msg.data.resize.width;",
					"    SIZE.height = msg.data.resize.height;",
					"  } else if (msg.data.canvas) {",
					"    SIZE.width = msg.data.canvas.width;",
					"    SIZE.height = msg.data.canvas.height;",
					"    CONFETTI = module.exports.create(msg.data.canvas);",
					"  }",
					"}"
				].join("\n");
				try {
					worker = new Worker(URL.createObjectURL(new Blob([code])));
				} catch (e) {
					typeof console !== "undefined" && typeof console.warn === "function" && console.warn("🎊 Could not load worker", e);
					return null;
				}
				decorate(worker);
			}
			return worker;
		};
	})();
	var defaults = {
		particleCount: 50,
		angle: 90,
		spread: 45,
		startVelocity: 45,
		decay: .9,
		gravity: 1,
		drift: 0,
		ticks: 200,
		x: .5,
		y: .5,
		shapes: ["square", "circle"],
		zIndex: 100,
		colors: [
			"#26ccff",
			"#a25afd",
			"#ff5e7e",
			"#88ff5a",
			"#fcff42",
			"#ffa62d",
			"#ff36ff"
		],
		disableForReducedMotion: false,
		scalar: 1
	};
	function convert(val, transform) {
		return transform ? transform(val) : val;
	}
	function isOk(val) {
		return !(val === null || val === void 0);
	}
	function prop(options, name, transform) {
		return convert(options && isOk(options[name]) ? options[name] : defaults[name], transform);
	}
	function onlyPositiveInt(number) {
		return number < 0 ? 0 : Math.floor(number);
	}
	function randomInt(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}
	function toDecimal(str) {
		return parseInt(str, 16);
	}
	function colorsToRgb(colors) {
		return colors.map(hexToRgb);
	}
	function hexToRgb(str) {
		var val = String(str).replace(/[^0-9a-f]/gi, "");
		if (val.length < 6) val = val[0] + val[0] + val[1] + val[1] + val[2] + val[2];
		return {
			r: toDecimal(val.substring(0, 2)),
			g: toDecimal(val.substring(2, 4)),
			b: toDecimal(val.substring(4, 6))
		};
	}
	function getOrigin(options) {
		var origin = prop(options, "origin", Object);
		origin.x = prop(origin, "x", Number);
		origin.y = prop(origin, "y", Number);
		return origin;
	}
	function setCanvasWindowSize(canvas) {
		canvas.width = document.documentElement.clientWidth;
		canvas.height = document.documentElement.clientHeight;
	}
	function setCanvasRectSize(canvas) {
		var rect = canvas.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;
	}
	function getCanvas(zIndex) {
		var canvas = document.createElement("canvas");
		canvas.style.position = "fixed";
		canvas.style.top = "0px";
		canvas.style.left = "0px";
		canvas.style.pointerEvents = "none";
		canvas.style.zIndex = zIndex;
		return canvas;
	}
	function ellipse(context, x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
		context.save();
		context.translate(x, y);
		context.rotate(rotation);
		context.scale(radiusX, radiusY);
		context.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
		context.restore();
	}
	function randomPhysics(opts) {
		var radAngle = opts.angle * (Math.PI / 180);
		var radSpread = opts.spread * (Math.PI / 180);
		return {
			x: opts.x,
			y: opts.y,
			wobble: Math.random() * 10,
			wobbleSpeed: Math.min(.11, Math.random() * .1 + .05),
			velocity: opts.startVelocity * .5 + Math.random() * opts.startVelocity,
			angle2D: -radAngle + (.5 * radSpread - Math.random() * radSpread),
			tiltAngle: (Math.random() * .5 + .25) * Math.PI,
			color: opts.color,
			shape: opts.shape,
			tick: 0,
			totalTicks: opts.ticks,
			decay: opts.decay,
			drift: opts.drift,
			random: Math.random() + 2,
			tiltSin: 0,
			tiltCos: 0,
			wobbleX: 0,
			wobbleY: 0,
			gravity: opts.gravity * 3,
			ovalScalar: .6,
			scalar: opts.scalar,
			flat: opts.flat
		};
	}
	function updateFetti(context, fetti) {
		fetti.x += Math.cos(fetti.angle2D) * fetti.velocity + fetti.drift;
		fetti.y += Math.sin(fetti.angle2D) * fetti.velocity + fetti.gravity;
		fetti.velocity *= fetti.decay;
		if (fetti.flat) {
			fetti.wobble = 0;
			fetti.wobbleX = fetti.x + 10 * fetti.scalar;
			fetti.wobbleY = fetti.y + 10 * fetti.scalar;
			fetti.tiltSin = 0;
			fetti.tiltCos = 0;
			fetti.random = 1;
		} else {
			fetti.wobble += fetti.wobbleSpeed;
			fetti.wobbleX = fetti.x + 10 * fetti.scalar * Math.cos(fetti.wobble);
			fetti.wobbleY = fetti.y + 10 * fetti.scalar * Math.sin(fetti.wobble);
			fetti.tiltAngle += .1;
			fetti.tiltSin = Math.sin(fetti.tiltAngle);
			fetti.tiltCos = Math.cos(fetti.tiltAngle);
			fetti.random = Math.random() + 2;
		}
		var progress = fetti.tick++ / fetti.totalTicks;
		var x1 = fetti.x + fetti.random * fetti.tiltCos;
		var y1 = fetti.y + fetti.random * fetti.tiltSin;
		var x2 = fetti.wobbleX + fetti.random * fetti.tiltCos;
		var y2 = fetti.wobbleY + fetti.random * fetti.tiltSin;
		context.fillStyle = "rgba(" + fetti.color.r + ", " + fetti.color.g + ", " + fetti.color.b + ", " + (1 - progress) + ")";
		context.beginPath();
		if (canUsePaths && fetti.shape.type === "path" && typeof fetti.shape.path === "string" && Array.isArray(fetti.shape.matrix)) context.fill(transformPath2D(fetti.shape.path, fetti.shape.matrix, fetti.x, fetti.y, Math.abs(x2 - x1) * .1, Math.abs(y2 - y1) * .1, Math.PI / 10 * fetti.wobble));
		else if (fetti.shape.type === "bitmap") {
			var rotation = Math.PI / 10 * fetti.wobble;
			var scaleX = Math.abs(x2 - x1) * .1;
			var scaleY = Math.abs(y2 - y1) * .1;
			var width = fetti.shape.bitmap.width * fetti.scalar;
			var height = fetti.shape.bitmap.height * fetti.scalar;
			var matrix = new DOMMatrix([
				Math.cos(rotation) * scaleX,
				Math.sin(rotation) * scaleX,
				-Math.sin(rotation) * scaleY,
				Math.cos(rotation) * scaleY,
				fetti.x,
				fetti.y
			]);
			matrix.multiplySelf(new DOMMatrix(fetti.shape.matrix));
			var pattern = context.createPattern(bitmapMapper.transform(fetti.shape.bitmap), "no-repeat");
			pattern.setTransform(matrix);
			context.globalAlpha = 1 - progress;
			context.fillStyle = pattern;
			context.fillRect(fetti.x - width / 2, fetti.y - height / 2, width, height);
			context.globalAlpha = 1;
		} else if (fetti.shape === "circle") context.ellipse ? context.ellipse(fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI) : ellipse(context, fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI);
		else if (fetti.shape === "star") {
			var rot = Math.PI / 2 * 3;
			var innerRadius = 4 * fetti.scalar;
			var outerRadius = 8 * fetti.scalar;
			var x = fetti.x;
			var y = fetti.y;
			var spikes = 5;
			var step = Math.PI / spikes;
			while (spikes--) {
				x = fetti.x + Math.cos(rot) * outerRadius;
				y = fetti.y + Math.sin(rot) * outerRadius;
				context.lineTo(x, y);
				rot += step;
				x = fetti.x + Math.cos(rot) * innerRadius;
				y = fetti.y + Math.sin(rot) * innerRadius;
				context.lineTo(x, y);
				rot += step;
			}
		} else {
			context.moveTo(Math.floor(fetti.x), Math.floor(fetti.y));
			context.lineTo(Math.floor(fetti.wobbleX), Math.floor(y1));
			context.lineTo(Math.floor(x2), Math.floor(y2));
			context.lineTo(Math.floor(x1), Math.floor(fetti.wobbleY));
		}
		context.closePath();
		context.fill();
		return fetti.tick < fetti.totalTicks;
	}
	function animate(canvas, fettis, resizer, size, done) {
		var animatingFettis = fettis.slice();
		var context = canvas.getContext("2d");
		var animationFrame;
		var destroy;
		var prom = promise(function(resolve) {
			function onDone() {
				animationFrame = destroy = null;
				context.clearRect(0, 0, size.width, size.height);
				bitmapMapper.clear();
				done();
				resolve();
			}
			function update() {
				if (isWorker && !(size.width === workerSize.width && size.height === workerSize.height)) {
					size.width = canvas.width = workerSize.width;
					size.height = canvas.height = workerSize.height;
				}
				if (!size.width && !size.height) {
					resizer(canvas);
					size.width = canvas.width;
					size.height = canvas.height;
				}
				context.clearRect(0, 0, size.width, size.height);
				animatingFettis = animatingFettis.filter(function(fetti) {
					return updateFetti(context, fetti);
				});
				if (animatingFettis.length) animationFrame = raf.frame(update);
				else onDone();
			}
			animationFrame = raf.frame(update);
			destroy = onDone;
		});
		return {
			addFettis: function(fettis) {
				animatingFettis = animatingFettis.concat(fettis);
				return prom;
			},
			canvas,
			promise: prom,
			reset: function() {
				if (animationFrame) raf.cancel(animationFrame);
				if (destroy) destroy();
			}
		};
	}
	function confettiCannon(canvas, globalOpts) {
		var isLibCanvas = !canvas;
		var allowResize = !!prop(globalOpts || {}, "resize");
		var hasResizeEventRegistered = false;
		var globalDisableForReducedMotion = prop(globalOpts, "disableForReducedMotion", Boolean);
		var worker = canUseWorker && !!prop(globalOpts || {}, "useWorker") ? getWorker() : null;
		var resizer = isLibCanvas ? setCanvasWindowSize : setCanvasRectSize;
		var initialized = canvas && worker ? !!canvas.__confetti_initialized : false;
		var preferLessMotion = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion)").matches;
		var animationObj;
		function fireLocal(options, size, done) {
			var particleCount = prop(options, "particleCount", onlyPositiveInt);
			var angle = prop(options, "angle", Number);
			var spread = prop(options, "spread", Number);
			var startVelocity = prop(options, "startVelocity", Number);
			var decay = prop(options, "decay", Number);
			var gravity = prop(options, "gravity", Number);
			var drift = prop(options, "drift", Number);
			var colors = prop(options, "colors", colorsToRgb);
			var ticks = prop(options, "ticks", Number);
			var shapes = prop(options, "shapes");
			var scalar = prop(options, "scalar");
			var flat = !!prop(options, "flat");
			var origin = getOrigin(options);
			var temp = particleCount;
			var fettis = [];
			var startX = canvas.width * origin.x;
			var startY = canvas.height * origin.y;
			while (temp--) fettis.push(randomPhysics({
				x: startX,
				y: startY,
				angle,
				spread,
				startVelocity,
				color: colors[temp % colors.length],
				shape: shapes[randomInt(0, shapes.length)],
				ticks,
				decay,
				gravity,
				drift,
				scalar,
				flat
			}));
			if (animationObj) return animationObj.addFettis(fettis);
			animationObj = animate(canvas, fettis, resizer, size, done);
			return animationObj.promise;
		}
		function fire(options) {
			var disableForReducedMotion = globalDisableForReducedMotion || prop(options, "disableForReducedMotion", Boolean);
			var zIndex = prop(options, "zIndex", Number);
			if (disableForReducedMotion && preferLessMotion) return promise(function(resolve) {
				resolve();
			});
			if (isLibCanvas && animationObj) canvas = animationObj.canvas;
			else if (isLibCanvas && !canvas) {
				canvas = getCanvas(zIndex);
				document.body.appendChild(canvas);
			}
			if (allowResize && !initialized) resizer(canvas);
			var size = {
				width: canvas.width,
				height: canvas.height
			};
			if (worker && !initialized) worker.init(canvas);
			initialized = true;
			if (worker) canvas.__confetti_initialized = true;
			function onResize() {
				if (worker) {
					var obj = { getBoundingClientRect: function() {
						if (!isLibCanvas) return canvas.getBoundingClientRect();
					} };
					resizer(obj);
					worker.postMessage({ resize: {
						width: obj.width,
						height: obj.height
					} });
					return;
				}
				size.width = size.height = null;
			}
			function done() {
				animationObj = null;
				if (allowResize) {
					hasResizeEventRegistered = false;
					global.removeEventListener("resize", onResize);
				}
				if (isLibCanvas && canvas) {
					if (document.body.contains(canvas)) document.body.removeChild(canvas);
					canvas = null;
					initialized = false;
				}
			}
			if (allowResize && !hasResizeEventRegistered) {
				hasResizeEventRegistered = true;
				global.addEventListener("resize", onResize, false);
			}
			if (worker) return worker.fire(options, size, done);
			return fireLocal(options, size, done);
		}
		fire.reset = function() {
			if (worker) worker.reset();
			if (animationObj) animationObj.reset();
		};
		return fire;
	}
	var defaultFire;
	function getDefaultFire() {
		if (!defaultFire) defaultFire = confettiCannon(null, {
			useWorker: true,
			resize: true
		});
		return defaultFire;
	}
	function transformPath2D(pathString, pathMatrix, x, y, scaleX, scaleY, rotation) {
		var path2d = new Path2D(pathString);
		var t1 = new Path2D();
		t1.addPath(path2d, new DOMMatrix(pathMatrix));
		var t2 = new Path2D();
		t2.addPath(t1, new DOMMatrix([
			Math.cos(rotation) * scaleX,
			Math.sin(rotation) * scaleX,
			-Math.sin(rotation) * scaleY,
			Math.cos(rotation) * scaleY,
			x,
			y
		]));
		return t2;
	}
	function shapeFromPath(pathData) {
		if (!canUsePaths) throw new Error("path confetti are not supported in this browser");
		var path, matrix;
		if (typeof pathData === "string") path = pathData;
		else {
			path = pathData.path;
			matrix = pathData.matrix;
		}
		var path2d = new Path2D(path);
		var tempCtx = document.createElement("canvas").getContext("2d");
		if (!matrix) {
			var maxSize = 1e3;
			var minX = maxSize;
			var minY = maxSize;
			var maxX = 0;
			var maxY = 0;
			var width, height;
			for (var x = 0; x < maxSize; x += 2) for (var y = 0; y < maxSize; y += 2) if (tempCtx.isPointInPath(path2d, x, y, "nonzero")) {
				minX = Math.min(minX, x);
				minY = Math.min(minY, y);
				maxX = Math.max(maxX, x);
				maxY = Math.max(maxY, y);
			}
			width = maxX - minX;
			height = maxY - minY;
			var maxDesiredSize = 10;
			var scale = Math.min(maxDesiredSize / width, maxDesiredSize / height);
			matrix = [
				scale,
				0,
				0,
				scale,
				-Math.round(width / 2 + minX) * scale,
				-Math.round(height / 2 + minY) * scale
			];
		}
		return {
			type: "path",
			path,
			matrix
		};
	}
	function shapeFromText(textData) {
		var text, scalar = 1, color = "#000000", fontFamily = "\"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\", \"EmojiOne Color\", \"Android Emoji\", \"Twemoji Mozilla\", \"system emoji\", sans-serif";
		if (typeof textData === "string") text = textData;
		else {
			text = textData.text;
			scalar = "scalar" in textData ? textData.scalar : scalar;
			fontFamily = "fontFamily" in textData ? textData.fontFamily : fontFamily;
			color = "color" in textData ? textData.color : color;
		}
		var fontSize = 10 * scalar;
		var font = "" + fontSize + "px " + fontFamily;
		var canvas = new OffscreenCanvas(fontSize, fontSize);
		var ctx = canvas.getContext("2d");
		ctx.font = font;
		var size = ctx.measureText(text);
		var width = Math.ceil(size.actualBoundingBoxRight + size.actualBoundingBoxLeft);
		var height = Math.ceil(size.actualBoundingBoxAscent + size.actualBoundingBoxDescent);
		var padding = 2;
		var x = size.actualBoundingBoxLeft + padding;
		var y = size.actualBoundingBoxAscent + padding;
		width += padding + padding;
		height += padding + padding;
		canvas = new OffscreenCanvas(width, height);
		ctx = canvas.getContext("2d");
		ctx.font = font;
		ctx.fillStyle = color;
		ctx.fillText(text, x, y);
		var scale = 1 / scalar;
		return {
			type: "bitmap",
			bitmap: canvas.transferToImageBitmap(),
			matrix: [
				scale,
				0,
				0,
				scale,
				-width * scale / 2,
				-height * scale / 2
			]
		};
	}
	module.exports = function() {
		return getDefaultFire().apply(this, arguments);
	};
	module.exports.reset = function() {
		getDefaultFire().reset();
	};
	module.exports.create = confettiCannon;
	module.exports.shapeFromPath = shapeFromPath;
	module.exports.shapeFromText = shapeFromText;
})((function() {
	if (typeof window !== "undefined") return window;
	if (typeof self !== "undefined") return self;
	return this || {};
})(), module, false);
var confetti_module_default = module.exports;
module.exports.create;
// src/components/ui/ReceiptPrinter.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
function cn(...classes) {
	return classes.filter(Boolean).join(" ");
}
var ReceiptPrinterContext = (0, import_react.createContext)(null);
var easeOut = [
	.23,
	1,
	.32,
	1
];
var easeInOut = [
	.77,
	0,
	.175,
	1
];
var receiptToothDepth = 4;
var receiptClipPath = `polygon(0 0, 100% 0, 100% calc(100% - ${receiptToothDepth}px), ${Array.from({ length: 80 }, (_, index) => {
	return `${100 - (index + 1) * 100 / 80}% ${index % 2 === 0 ? "100%" : `calc(100% - ${receiptToothDepth}px)`}`;
}).join(", ")})`;
var printingTransformKeyframes = [
	"translateY(calc(-100% + 2px))",
	"translateY(-91%)",
	"translateY(-91%)",
	"translateY(-81%)",
	"translateY(-81%)",
	"translateY(-70%)",
	"translateY(-70%)",
	"translateY(-58%)",
	"translateY(-58%)",
	"translateY(-45%)",
	"translateY(-45%)",
	"translateY(-32%)",
	"translateY(-32%)",
	"translateY(-20%)",
	"translateY(-20%)",
	"translateY(-10%)",
	"translateY(-10%)",
	"translateY(-3%)",
	"translateY(-3%)",
	"translateY(0%)"
];
var printingKeyframeTimes = [
	0,
	.075,
	.105,
	.18,
	.21,
	.285,
	.315,
	.39,
	.42,
	.495,
	.525,
	.6,
	.63,
	.705,
	.735,
	.81,
	.84,
	.915,
	.945,
	1
];
var PLASTIC_NOISE_DATA_URI = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.22'/%3E%3C/svg%3E";
function useReceiptPrinterContext(componentName) {
	const context = (0, import_react.useContext)(ReceiptPrinterContext);
	if (!context) throw new Error(`${componentName} must be used within ReceiptPrinter.Root.`);
	return context;
}
function getDefaultStatusLabel(stage) {
	if (stage === "processing") return "Processing transaction";
	if (stage === "printing") return "Printing receipt";
	return "Receipt printed";
}
function Root({ animate = true, children, className, feedMotion = "stepped", stage, style, ...props }) {
	const prefersReducedMotion = Boolean(useReducedMotion());
	const shouldMove = animate && !prefersReducedMotion;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptPrinterContext.Provider, {
		value: {
			animate,
			feedMotion,
			shouldMove,
			stage
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: cn("[--printer-inner-radius:calc(var(--printer-radius)-var(--printer-inset))] [--printer-inset:8px] [--printer-radius:20px] flex w-full flex-col items-center", className),
			style,
			...props,
			children
		})
	});
}
function Machine({ children, className, style, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative w-full overflow-hidden rounded-[var(--printer-radius)] border border-neutral-700/80 bg-neutral-900 p-[var(--printer-inset)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.45),0_18px_36px_-18px_rgba(0,0,0,0.65)]", className),
		style,
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": "true",
			className: "pointer-events-none absolute inset-0 bg-repeat opacity-15 mix-blend-overlay",
			style: {
				backgroundImage: `url("${PLASTIC_NOISE_DATA_URI}")`,
				backgroundSize: "160px 160px"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative z-10",
			children
		})]
	});
}
function Header({ children, className, style, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex items-center justify-between px-1 pb-2 text-neutral-100", className),
		style,
		...props,
		children
	});
}
function Screen({ children, className, style, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("relative overflow-hidden rounded-[var(--printer-inner-radius)] border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-neutral-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_12px_20px_rgba(0,0,0,0.45)]", className),
		style,
		...props,
		children
	});
}
function Status({ children, className, style, ...props }) {
	const { shouldMove, stage } = useReceiptPrinterContext("ReceiptPrinter.Status");
	const label = children ?? getDefaultStatusLabel(stage);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"aria-live": "polite",
		className: cn("min-h-4 flex items-center text-xs text-neutral-200", className),
		role: "status",
		style,
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex size-4 items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					initial: false,
					mode: "wait",
					children: stage === "complete" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
						animate: {
							opacity: 1,
							scale: 1
						},
						className: "inline-flex items-center justify-center text-emerald-400",
						exit: {
							opacity: 0,
							scale: .85
						},
						initial: shouldMove ? {
							opacity: 0,
							scale: .85
						} : { opacity: 1 },
						transition: shouldMove ? {
							duration: .18,
							ease: easeOut
						} : { duration: 0 },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
							"aria-hidden": "true",
							className: "size-3.5"
						})
					}, "complete") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
						animate: {
							opacity: 1,
							scale: 1
						},
						className: "inline-flex items-center justify-center text-amber-400",
						exit: {
							opacity: 0,
							scale: .85
						},
						initial: shouldMove ? {
							opacity: 0,
							scale: .85
						} : { opacity: 1 },
						transition: shouldMove ? {
							duration: .18,
							ease: easeOut
						} : { duration: 0 },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							"aria-hidden": "true",
							className: cn("size-3.5", shouldMove && "animate-spin")
						})
					}, "busy")
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				initial: false,
				mode: "wait",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
					animate: {
						opacity: 1,
						filter: "blur(0px)"
					},
					exit: {
						opacity: 0,
						filter: "blur(2px)"
					},
					initial: shouldMove ? {
						opacity: 0,
						filter: "blur(2px)"
					} : {
						opacity: 1,
						filter: "blur(0px)"
					},
					transition: shouldMove ? {
						duration: .2,
						ease: easeInOut
					} : { duration: 0 },
					children: label
				}, stage)
			})]
		})
	});
}
function Output({ children, className, style, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("relative mt-2 pt-1.5 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-2.5 before:rounded-full before:bg-neutral-950 before:shadow-[inset_0_2px_4px_rgba(0,0,0,0.85),0_1px_0_rgba(255,255,255,0.08)]", className),
		style,
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 overflow-hidden px-1.5 pb-2 pt-0.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": "true",
				className: "pointer-events-none absolute inset-x-1.5 top-0 z-20 h-4 bg-gradient-to-b from-neutral-950/75 via-neutral-950/25 to-transparent"
			}), children]
		})
	});
}
function Paper({ children, className, style, ...props }) {
	const { feedMotion, shouldMove, stage } = useReceiptPrinterContext("ReceiptPrinter.Paper");
	const isPrinting = stage === "printing";
	const isVisible = stage === "printing" || stage === "complete";
	const getTransformAnimation = () => {
		if (!isVisible) return "translateY(calc(-100% + 2px))";
		if (isPrinting && shouldMove && feedMotion === "stepped") return printingTransformKeyframes;
		return "translateY(0%)";
	};
	const getTransition = () => {
		if (!shouldMove) return { duration: 0 };
		if (isPrinting && feedMotion === "stepped") return {
			duration: 1.75,
			ease: "linear",
			times: printingKeyframeTimes
		};
		if (isPrinting && feedMotion === "smooth") return {
			duration: 1.35,
			ease: easeOut
		};
		return {
			duration: .35,
			ease: easeOut
		};
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.article, {
		animate: { transform: getTransformAnimation() },
		className: cn("relative w-full origin-top bg-[#faf9f5] px-4 pb-6 pt-4 font-mono text-xs text-neutral-900 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.55)] will-change-transform print:transform-none print:shadow-none", className),
		initial: shouldMove ? { transform: "translateY(calc(-100% + 2px))" } : { transform: isVisible ? "translateY(0%)" : "translateY(calc(-100% + 2px))" },
		style: {
			clipPath: receiptClipPath,
			...style
		},
		transition: getTransition(),
		...props,
		children
	});
}
var ReceiptPrinter = {
	Root,
	Machine,
	Header,
	Screen,
	Status,
	Output,
	Paper
};
// src/components/checkout/ReceiptModal.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
/**
* Helper to compress an uploaded logo image into a compact Data URL for localStorage.
*/
function compressLogoFile(file, maxDim = 240) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const img = new Image();
			img.onload = () => {
				const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
				const width = Math.max(1, Math.round(img.width * scale));
				const height = Math.max(1, Math.round(img.height * scale));
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					resolve(reader.result);
					return;
				}
				ctx.clearRect(0, 0, width, height);
				ctx.drawImage(img, 0, 0, width, height);
				resolve(canvas.toDataURL("image/png", .9));
			};
			img.onerror = () => resolve(reader.result);
			img.src = reader.result;
		};
		reader.onerror = (err) => reject(err);
		reader.readAsDataURL(file);
	});
}
var ReceiptModal = ({ isOpen, onClose, transaction, onNewSale, valuationMode = "historical", anchorCurrency = "USD" }) => {
	const { settings, updateSettings, exchangeRates } = usePOS();
	const t = getTranslation(settings.language);
	const isAr = settings.language === "ar";
	const [stage, setStage] = (0, import_react.useState)("processing");
	const [feedMotion, setFeedMotion] = (0, import_react.useState)("stepped");
	const [printCycleKey, setPrintCycleKey] = (0, import_react.useState)(0);
	const [isEditingBranding, setIsEditingBranding] = (0, import_react.useState)(false);
	const [draftNameEn, setDraftNameEn] = (0, import_react.useState)(settings.storeName);
	const [draftNameAr, setDraftNameAr] = (0, import_react.useState)(settings.storeNameAr);
	const [draftLogo, setDraftLogo] = (0, import_react.useState)(settings.storeLogo || "");
	const [brandingSaved, setBrandingSaved] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setDraftNameEn(settings.storeName);
		setDraftNameAr(settings.storeNameAr);
		setDraftLogo(settings.storeLogo || "");
	}, [
		settings.storeName,
		settings.storeNameAr,
		settings.storeLogo
	]);
	const triggerPrintSequence = (0, import_react.useCallback)(() => {
		setStage("processing");
		playTactileClick(settings.soundEnabled);
		const printingTimer = setTimeout(() => {
			setStage("printing");
			triggerHaptic("light", settings.hapticsEnabled);
		}, 420);
		const completeTimer = setTimeout(() => {
			setStage("complete");
			playSuccessChime(settings.soundEnabled);
			triggerHaptic("success", settings.hapticsEnabled);
		}, feedMotion === "stepped" ? 2200 : 1800);
		return () => {
			clearTimeout(printingTimer);
			clearTimeout(completeTimer);
		};
	}, [
		feedMotion,
		settings.soundEnabled,
		settings.hapticsEnabled
	]);
	(0, import_react.useEffect)(() => {
		if (!isOpen || !transaction) return;
		const cleanup = triggerPrintSequence();
		try {
			confetti_module_default({
				particleCount: 45,
				spread: 60,
				origin: { y: .6 },
				colors: [
					"#f59e0b",
					"#10b981",
					"#3b82f6",
					"#ec4899"
				]
			});
		} catch {}
		return cleanup;
	}, [
		isOpen,
		transaction?.id,
		printCycleKey,
		triggerPrintSequence
	]);
	if (!transaction) return null;
	const converted = getConvertedTransactionView(transaction, settings.currency, exchangeRates, valuationMode, anchorCurrency);
	const displayStoreName = isAr ? settings.storeNameAr || settings.storeName : settings.storeName || settings.storeNameAr;
	const storeMonogram = displayStoreName.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "DQ";
	const handleReplayPrint = () => {
		setPrintCycleKey((prev) => prev + 1);
	};
	const handleSystemPrint = () => {
		setStage("complete");
		setTimeout(() => {
			window.print();
		}, 120);
	};
	const handleLogoUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const compressed = await compressLogoFile(file);
			setDraftLogo(compressed);
			updateSettings({ storeLogo: compressed });
			setBrandingSaved(true);
			setTimeout(() => setBrandingSaved(false), 2e3);
		} catch {} finally {
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};
	const handleSaveBranding = (e) => {
		e.preventDefault();
		const cleanEn = draftNameEn.trim() || settings.storeName;
		const cleanAr = draftNameAr.trim() || settings.storeNameAr;
		updateSettings({
			storeName: cleanEn,
			storeNameAr: cleanAr,
			storeLogo: draftLogo.trim()
		});
		playTactileClick(settings.soundEnabled);
		setBrandingSaved(true);
		setTimeout(() => {
			setBrandingSaved(false);
			setIsEditingBranding(false);
		}, 900);
	};
	const statusText = stage === "processing" ? isAr ? "جاري تجهيز الفاتورة..." : "Processing transaction..." : stage === "printing" ? isAr ? "جاري طباعة الفاتورة الحرارية..." : "Printing thermal receipt..." : isAr ? "اكتملت طباعة الفاتورة" : "Receipt printed";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
		isOpen,
		onClose,
		title: t.receipt,
		maxWidth: "md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 bg-neutral-950/70 border border-neutral-800 rounded-xl p-2.5 print:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							playTactileClick(settings.soundEnabled);
							setIsEditingBranding((prev) => !prev);
						},
						className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isEditingBranding ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-sm" : "bg-neutral-900 text-amber-400 border-neutral-700 hover:border-amber-500/60"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تعديل لوقو واسم المتجر" : "Edit Store Logo & Name" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								playTactileClick(settings.soundEnabled);
								setFeedMotion((prev) => prev === "stepped" ? "smooth" : "stepped");
							},
							className: "px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-[11px] font-mono text-neutral-300 flex items-center gap-1",
							title: "Toggle thermal paper feed motion",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3 h-3 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: feedMotion === "stepped" ? isAr ? "سحب متدرج (Stepped)" : "Stepped Feed" : isAr ? "سحب سلس (Smooth)" : "Smooth Feed" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleReplayPrint,
							className: "px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 text-[11px] font-mono text-neutral-200 flex items-center gap-1",
							title: isAr ? "إعادة حركة الطباعة" : "Replay print animation",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3 h-3 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "إعادة الطباعة" : "Replay" })]
						})]
					})]
				}),
				isEditingBranding && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSaveBranding,
					className: "bg-neutral-950 border border-amber-500/40 rounded-2xl p-3.5 space-y-3 animate-in fade-in duration-150 print:hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-neutral-800 pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "w-4 h-4 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-white",
									children: isAr ? "تخصيص شعار (لوقو) واسم المتجر على الفاتورة" : "Customize Receipt Store Logo & Name"
								})]
							}), brandingSaved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-bold text-emerald-400 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تم الحفظ!" : "Saved!" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row items-start sm:items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-16 h-16 rounded-2xl border border-neutral-700 bg-neutral-900 flex items-center justify-center overflow-hidden shrink-0 shadow-inner",
								children: draftLogo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: draftLogo,
									alt: "Store Logo Preview",
									className: "w-full h-full object-contain p-1"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-extrabold text-lg text-amber-400",
									children: storeMonogram
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 w-full space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											ref: fileInputRef,
											type: "file",
											accept: "image/*",
											onChange: handleLogoUpload,
											className: "hidden"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
											type: "button",
											variant: "secondary",
											size: "sm",
											onClick: () => fileInputRef.current?.click(),
											leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-3.5 h-3.5" }),
											children: isAr ? "رفع صورة اللوقو" : "Upload Logo"
										}),
										draftLogo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
											type: "button",
											variant: "danger",
											size: "sm",
											onClick: () => {
												setDraftLogo("");
												updateSettings({ storeLogo: "" });
											},
											leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }),
											children: isAr ? "حذف الشعار" : "Remove"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									dir: "ltr",
									value: draftLogo.startsWith("data:") ? "" : draftLogo,
									onChange: (e) => setDraftLogo(e.target.value),
									placeholder: draftLogo.startsWith("data:") ? isAr ? "تم رفع صورة شعار مخصصة من الجهاز" : "Custom uploaded logo image active" : isAr ? "أو الصق رابط صورة اللوقو (https://...)" : "Or paste logo image URL (https://...)",
									className: "w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
								label: isAr ? "اسم المتجر (بالعربية)" : "Arabic Store Name (اسم المتجر)",
								value: draftNameAr,
								onChange: (e) => setDraftNameAr(e.target.value),
								placeholder: "محمصة ومخبز دينامو الحرفي"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
								label: isAr ? "اسم المتجر ( بالإنجليزية)" : "Store Name (English)",
								value: draftNameEn,
								onChange: (e) => setDraftNameEn(e.target.value),
								placeholder: "Dqnamo Artisan Roasters"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								type: "button",
								variant: "ghost",
								size: "sm",
								onClick: () => setIsEditingBranding(false),
								children: isAr ? "إغلاق" : "Close"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								type: "submit",
								variant: "amber",
								size: "sm",
								leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" }),
								children: isAr ? "حفظ وتطبيق على الفاتورة" : "Save & Apply to Receipt"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptPrinter.Root, {
					stage,
					feedMotion,
					animate: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ReceiptPrinter.Machine, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ReceiptPrinter.Header, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-6 h-6 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center overflow-hidden shrink-0",
								children: settings.storeLogo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: settings.storeLogo,
									alt: displayStoreName,
									className: "w-full h-full object-contain"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] font-bold text-amber-400",
									children: storeMonogram
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold tracking-tight text-neutral-200 truncate",
								children: displayStoreName
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono uppercase tracking-wider text-neutral-400",
								children: "POS-80MM"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${stage === "complete" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"}` })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptPrinter.Screen, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptPrinter.Status, { children: statusText }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs font-bold text-amber-400 tabular-nums shrink-0",
								children: formatCurrency(converted.grandTotal, settings.currency, settings.language)
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptPrinter.Output, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ReceiptPrinter.Paper, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center pb-3 border-b border-dashed border-neutral-400",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-center mb-2",
										children: settings.storeLogo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-16 h-16 rounded-xl border border-neutral-300 bg-white p-1.5 flex items-center justify-center shadow-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: settings.storeLogo,
												alt: displayStoreName,
												className: "max-w-full max-h-full object-contain"
											})
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-12 h-12 rounded-xl border-2 border-neutral-900 bg-neutral-900 text-white flex items-center justify-center font-mono font-extrabold text-base tracking-wider",
											children: storeMonogram
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-extrabold text-sm text-neutral-950 uppercase tracking-wider",
										children: displayStoreName
									}),
									settings.storeName && settings.storeNameAr && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-semibold text-neutral-600 mt-0.5",
										children: isAr ? settings.storeName : settings.storeNameAr
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-neutral-600 mt-0.5",
										children: isAr ? settings.addressAr : settings.address
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-neutral-500 mt-0.5",
										children: ["TAX ID: ", settings.taxNumber]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-neutral-500",
										children: ["TEL: ", settings.phone]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-2.5 border-b border-dashed border-neutral-400 text-[11px] space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Receipt #:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold",
											children: transaction.id
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Date:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(transaction.timestamp).toLocaleString() })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cashier:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: transaction.cashierName })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Customer:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: transaction.customerName || "Walk-in"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Payment:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "uppercase font-bold",
											children: formatPaymentMethodLabel(transaction.paymentMethod, settings.language)
										})]
									}),
									transaction.transferReference && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [t.transferReference, ":"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold font-mono",
											children: transaction.transferReference
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "سعر الصرف وقت البيع:" : "Sale Exchange Rate:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold font-mono",
											dir: "ltr",
											children: [
												"1 ",
												converted.referenceCurrency,
												" = ",
												converted.historicalRate,
												" SDG"
											]
										})]
									}),
									converted.originalCurrency !== settings.currency && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-neutral-600",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [t.originalInvoiceValue, ":"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold",
											children: formatCurrency(transaction.grandTotal, converted.originalCurrency, settings.language)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [t.status, ":"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-bold ${converted.debtAmount > 0 ? "text-rose-700" : "text-emerald-700"}`,
											children: transaction.paymentStatus === "unpaid" ? t.unpaidFullDebt : transaction.paymentStatus === "partial" ? t.partialPaymentDebt : t.paidInFull
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-3 border-b border-dashed border-neutral-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between font-bold text-[11px] pb-1 border-b border-neutral-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Item" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "divide-y divide-neutral-200/80 mt-1",
									children: converted.items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "py-1.5 flex justify-between items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-neutral-900",
											children: item.productName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] text-neutral-500",
											children: [
												item.quantity,
												" x",
												" ",
												formatCurrency(item.unitPrice, settings.currency, settings.language),
												item.discountPercent > 0 && ` (-${item.discountPercent}%)`
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-neutral-950 tabular-nums shrink-0",
											children: formatCurrency(item.total, settings.currency, settings.language)
										})]
									}, idx))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-2.5 space-y-1 text-[11px] border-b border-dashed border-neutral-400",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums",
											children: formatCurrency(converted.subtotal, settings.currency, settings.language)
										})]
									}),
									converted.discountAmount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-rose-600",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Discount:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "tabular-nums",
											children: ["-", formatCurrency(converted.discountAmount, settings.currency, settings.language)]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"VAT / Tax (",
											transaction.taxRatePercent,
											"%):"
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums",
											children: formatCurrency(converted.taxAmount, settings.currency, settings.language)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between font-extrabold text-sm pt-1.5 text-neutral-950 border-t border-neutral-300",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TOTAL DUE:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums",
											children: formatCurrency(converted.grandTotal, settings.currency, settings.language)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between pt-1 font-semibold text-emerald-800",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [t.amountPaidLabel, ":"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums",
											children: formatCurrency(converted.amountPaid, settings.currency, settings.language)
										})]
									}),
									converted.debtAmount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between font-extrabold text-rose-700",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [t.remainingDebt, ":"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums",
											children: formatCurrency(converted.debtAmount, settings.currency, settings.language)
										})]
									}),
									transaction.paymentMethod === "cash" && converted.debtAmount === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tendered:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums",
											children: formatCurrency(converted.amountTendered, settings.currency, settings.language)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between font-bold text-emerald-700",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Change Due:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums",
											children: formatCurrency(converted.changeDue, settings.currency, settings.language)
										})]
									})] })
								]
							}),
							transaction.transferReceiptImage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-2.5 border-b border-dashed border-neutral-400 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold text-neutral-700 block mb-1.5",
									children: t.transferReceiptImage
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto max-w-[180px] rounded-lg overflow-hidden border border-neutral-300 bg-white p-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: transaction.transferReceiptImage,
										alt: t.transferReceiptImage,
										className: "w-full h-auto max-h-36 object-contain mx-auto"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-neutral-600",
									children: isAr ? settings.receiptFooterAr : settings.receiptFooter
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-col items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-0.5 h-7",
										children: [
											2,
											1,
											3,
											1,
											2,
											4,
											1,
											3,
											2,
											1,
											2,
											3,
											1,
											2,
											1,
											3,
											2,
											1,
											3,
											1
										].map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bg-neutral-950 h-full",
											style: { width: `${w}px` }
										}, i))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[9px] tracking-widest mt-1 text-neutral-500",
										children: [
											"*",
											transaction.id,
											"*"
										]
									})]
								})]
							})
						] }) })
					] })
				}, printCycleKey),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 pt-1 print:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						variant: "secondary",
						size: "md",
						onClick: handleSystemPrint,
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-4 h-4" }),
						className: "flex-1",
						children: t.printReceipt
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						variant: "emerald",
						size: "md",
						onClick: onNewSale,
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }),
						className: "flex-1",
						children: t.newTransaction
					})]
				})
			]
		})
	});
};
// src/components/checkout/CheckoutView.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var CHECKOUT_PAGE_SIZE = 48;
var CheckoutProductCard = (0, import_react.memo)(({ product, serialNum, inCartQty, inCartSaleUnit, currency, exchangeRates, language, onAddToCart, onOpenUnmetDemand }) => {
	const isAr = language === "ar";
	const isOutOfStock = product.stock <= 0;
	const isLow = product.stock > 0 && product.stock <= product.minStockAlert;
	const prices = getProductPricesInCurrency(product, currency, exchangeRates);
	const convertedPrice = prices.sellingPrice;
	const pkg = getProductPackaging(product);
	const hasMultiUnit = pkg.enablePackaging && pkg.unitsPerPack > 1;
	const unitLabel = isAr ? pkg.unitNameAr : pkg.unitName;
	const packLabel = isAr ? pkg.packNameAr : pkg.packName;
	const canAddPack = product.stock >= pkg.unitsPerPack && pkg.allowedSaleUnits !== "unit_only";
	const canAddUnit = product.stock >= 1 && pkg.allowedSaleUnits !== "pack_only";
	const productImg = product.image || product.imageUrl || product.customFields?.image;
	const prodDesc = isAr && product.descriptionAr ? product.descriptionAr : product.description;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onClick: () => {
			if (!isOutOfStock) onAddToCart(product, 1);
		},
		role: "button",
		tabIndex: isOutOfStock ? -1 : 0,
		onKeyDown: (e) => {
			if ((e.key === "Enter" || e.key === " ") && !isOutOfStock) {
				e.preventDefault();
				onAddToCart(product, 1);
			}
		},
		className: `group relative flex flex-col justify-between p-3.5 rounded-2xl border text-left transition-all select-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${isOutOfStock ? "opacity-40 cursor-not-allowed bg-neutral-900/50 border-neutral-850" : "bg-neutral-900 hover:bg-neutral-850 border-neutral-800 hover:border-neutral-700 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.99]"}`,
		"aria-label": `Add ${product.name} to cart`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-1 mb-2 w-full",
				children: [productImg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-11 h-11 rounded-xl overflow-hidden bg-neutral-800 border border-white/10 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: productImg,
						alt: product.name,
						loading: "lazy",
						decoding: "async",
						className: "w-full h-full object-cover"
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-inner border border-white/5",
					style: { backgroundColor: `${product.colorHex || "#d97706"}22` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: product.emoji || "📦" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-end gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-amber-400 font-mono font-bold text-[10px] inline-flex items-center gap-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "w-2.5 h-2.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatProductSerialNumber(serialNum).replace("#", "") })]
						}),
						inCartQty > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-bold text-[10px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: inCartQty
								}),
								" ",
								hasMultiUnit ? inCartSaleUnit === "pack" ? packLabel : unitLabel : isAr ? "بالسلة" : "in cart"
							]
						}),
						hasMultiUnit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "px-1.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-2.5 h-2.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								packLabel,
								" = ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: pkg.unitsPerPack
								}),
								" ",
								unitLabel
							] })]
						}),
						isLow && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] text-amber-400 font-medium flex items-center gap-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-2.5 h-2.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatProductStockBreakdown(product, language) })]
						}),
						isOutOfStock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-rose-400 font-medium",
							children: isAr ? "نفد" : "Out"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-sm font-semibold text-white group-hover:text-amber-200 transition-colors line-clamp-2 leading-snug",
						children: isAr && product.nameAr ? product.nameAr : product.name
					}),
					prodDesc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-neutral-400 line-clamp-1 mt-0.5",
						children: prodDesc
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-mono text-neutral-500 block mt-0.5",
						children: product.sku
					})
				]
			}),
			hasMultiUnit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-2 border-t border-neutral-800/80 w-full space-y-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-neutral-400",
							children: [unitLabel, ":"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-bold text-emerald-400 tabular-nums",
							children: formatCurrency(prices.sellingPrice, currency, language)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-amber-300 font-medium",
							children: [
								packLabel,
								" (",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: pkg.unitsPerPack
								}),
								"):"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-bold text-amber-400 tabular-nums",
							children: formatCurrency(prices.packSellingPrice, currency, language)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-1.5 pt-1",
						children: [canAddUnit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": `add-unit-${product.id}`,
							onClick: (e) => {
								e.stopPropagation();
								onAddToCart(product, 1, "unit");
							},
							className: "px-2 py-1.5 rounded-lg bg-neutral-800 hover:bg-emerald-500 hover:text-neutral-950 text-neutral-200 text-[11px] font-bold transition-colors flex items-center justify-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3 h-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: unitLabel })]
						}), canAddPack && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": `add-pack-${product.id}`,
							onClick: (e) => {
								e.stopPropagation();
								onAddToCart(product, 1, "pack");
							},
							className: "px-2 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-neutral-950 border border-amber-500/40 text-amber-300 text-[11px] font-bold transition-colors flex items-center justify-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3 h-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: packLabel })]
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between pt-2 border-t border-neutral-800/80 w-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-bold font-mono text-emerald-400 tabular-nums",
					children: formatCurrency(convertedPrice, currency, language)
				}), isOutOfStock || isLow ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": `record-unmet-${product.id}`,
						onClick: (e) => {
							e.stopPropagation();
							onOpenUnmetDemand(product.id);
						},
						className: "px-2 py-1 rounded-lg border border-rose-500/40 bg-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-300 text-[10px] font-bold transition-colors flex items-center gap-1",
						title: isAr ? "تسجيل طلب عميل لهذا المنتج النافد أو المنخفض" : "Record customer unmet demand for this item",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageX, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "طلب عميل" : "Log Demand" })]
					}), !isOutOfStock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-7 h-7 rounded-lg bg-neutral-800 group-hover:bg-amber-500 group-hover:text-neutral-950 text-neutral-300 flex items-center justify-center transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" })
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-7 h-7 rounded-lg bg-neutral-800 group-hover:bg-amber-500 group-hover:text-neutral-950 text-neutral-300 flex items-center justify-center transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" })
				})]
			})
		]
	});
});
CheckoutProductCard.displayName = "CheckoutProductCard";
var CheckoutView = ({ isCartDrawerOpen = false, onCloseCartDrawer }) => {
	const { products, cart, addToCart, setCartItemSaleUnit, updateCartQuantity, removeFromCart, clearCart, cartTotals, settings, exchangeRates, globalDiscountPercent, setGlobalDiscountPercent, globalDiscountAmount, setGlobalDiscountAmount, openUnmetDemandModal } = usePOS();
	const t = getTranslation(settings.language);
	const isAr = settings.language === "ar";
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const debouncedSearchQuery = useDebouncedValue(searchQuery, 120);
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("all");
	const [visibleCount, setVisibleCount] = (0, import_react.useState)(CHECKOUT_PAGE_SIZE);
	const [discountAmountInput, setDiscountAmountInput] = (0, import_react.useState)(globalDiscountAmount > 0 ? String(globalDiscountAmount) : "");
	const [isScannerOpen, setIsScannerOpen] = (0, import_react.useState)(false);
	const [isPaymentOpen, setIsPaymentOpen] = (0, import_react.useState)(false);
	const [completedTransaction, setCompletedTransaction] = (0, import_react.useState)(null);
	const [isReceiptOpen, setIsReceiptOpen] = (0, import_react.useState)(false);
	const productIndexMap = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		products.forEach((p, idx) => map.set(p.id, idx));
		return map;
	}, [products]);
	const cartItemMap = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		cart.forEach((item) => map.set(item.product.id, item));
		return map;
	}, [cart]);
	const searchIndexMap = (0, import_react.useMemo)(() => buildProductSearchIndexMap(products), [products]);
	const categories = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		products.forEach((p) => {
			const cat = settings.language === "ar" && p.categoryAr ? p.categoryAr : p.category;
			set.add(cat);
		});
		return Array.from(set);
	}, [products, settings.language]);
	const filteredProducts = (0, import_react.useMemo)(() => {
		const tokens = tokenizeProductSearchQuery(debouncedSearchQuery);
		if (tokens.length === 0 && selectedCategory === "all") return products;
		return products.filter((prod, idx) => {
			const prodCat = settings.language === "ar" && prod.categoryAr ? prod.categoryAr : prod.category;
			if (selectedCategory !== "all" && prodCat !== selectedCategory) return false;
			if (tokens.length === 0) return true;
			const entry = searchIndexMap.get(prod.id);
			return entry ? matchesProductSearchIndexEntry(entry, tokens) : true;
		});
	}, [
		products,
		searchIndexMap,
		debouncedSearchQuery,
		selectedCategory,
		settings.language
	]);
	(0, import_react.useEffect)(() => {
		setVisibleCount(CHECKOUT_PAGE_SIZE);
	}, [debouncedSearchQuery, selectedCategory]);
	const visibleProducts = (0, import_react.useMemo)(() => filteredProducts.slice(0, visibleCount), [filteredProducts, visibleCount]);
	const handleOpenProductUnmetDemand = (0, import_react.useMemo)(() => (productId) => {
		openUnmetDemandModal({
			productId,
			isRegisteredProduct: true,
			unavailabilityReason: "OUT_OF_STOCK",
			sourceScreen: "checkout"
		});
	}, [openUnmetDemandModal]);
	const handleBarcodeScanned = (code) => {
		const item = products.find((p, idx) => {
			const serial = getProductSerialNumber(p, idx);
			return matchesProductBarcode(p, code, true) || p.sku.toLowerCase() === code.toLowerCase() || String(serial) === code.replace(/^#0*/, "");
		});
		if (item) {
			if (item.stock <= 0) openUnmetDemandModal({
				productId: item.id,
				isRegisteredProduct: true,
				unavailabilityReason: "OUT_OF_STOCK",
				sourceScreen: "checkout"
			});
			else addToCart(item, 1);
		} else if (code.trim()) openUnmetDemandModal({
			isRegisteredProduct: false,
			barcode: code.trim(),
			productNameSnapshot: `Unregistered Barcode (${code.trim()})`,
			unavailabilityReason: "NOT_STOCKED",
			sourceScreen: "checkout"
		});
	};
	const handlePaymentSuccess = (transaction) => {
		setIsPaymentOpen(false);
		setCompletedTransaction(transaction);
		setIsReceiptOpen(true);
		onCloseCartDrawer?.();
	};
	const handleNewSale = () => {
		setIsReceiptOpen(false);
		setCompletedTransaction(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 flex flex-col lg:flex-row gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col gap-4 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
									placeholder: isAr ? "ابحث بأي كلمة من الاسم، الوصف، الرقم التسلسلي (#0001)، أو الباركود..." : "Search by any word in name, description, serial (#0001), SKU, or barcode...",
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value),
									leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4" }),
									rightIcon: searchQuery ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setSearchQuery(""),
										className: "p-1 hover:text-white",
										"aria-label": "Clear search",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
									}) : void 0
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								variant: "amber",
								size: "md",
								onClick: () => setIsScannerOpen(true),
								leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Barcode, { className: "w-5 h-5" }),
								"aria-label": "Scan barcode",
								className: "shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: t.scanBarcode
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "checkout-open-unmet-demand-btn",
								onClick: () => openUnmetDemandModal({
									sourceScreen: "checkout",
									productNameSnapshot: searchQuery.trim() || void 0
								}),
								className: "shrink-0 inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold transition-all",
								title: isAr ? "تسجيل سريع لطلب عميل غير متوفر" : "Fast Capture: Customer Requested Unavailable Product",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageX, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden md:inline",
									children: isAr ? "طلب غير متوفر" : "Unmet Demand"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								playTactileClick(settings.soundEnabled);
								setSelectedCategory("all");
							},
							className: `px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${selectedCategory === "all" ? "bg-white text-neutral-950 border-white shadow-sm" : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700"}`,
							children: t.allCategories
						}), categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								playTactileClick(settings.soundEnabled);
								setSelectedCategory(cat);
							},
							className: `px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${selectedCategory === cat ? "bg-amber-400 text-neutral-950 border-amber-400 shadow-sm" : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700"}`,
							children: cat
						}, cat))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3",
						children: visibleProducts.map((product) => {
							const prodIndex = productIndexMap.get(product.id) ?? 0;
							const serialNum = getProductSerialNumber(product, prodIndex);
							const inCartItem = cartItemMap.get(product.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckoutProductCard, {
								product,
								serialNum,
								inCartQty: inCartItem?.quantity || 0,
								inCartSaleUnit: inCartItem?.selectedSaleUnit,
								currency: settings.currency,
								exchangeRates,
								language: settings.language,
								onAddToCart: addToCart,
								onOpenUnmetDemand: handleOpenProductUnmetDemand
							}, product.id);
						})
					}),
					filteredProducts.length > visibleCount && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setVisibleCount((prev) => prev + CHECKOUT_PAGE_SIZE),
							className: "px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold text-amber-400 transition-colors",
							children: isAr ? `عرض المزيد (${filteredProducts.length - visibleCount} متبقية)` : `Load More (${filteredProducts.length - visibleCount} remaining)`
						})
					}),
					filteredProducts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center p-10 text-center bg-neutral-900/40 rounded-2xl border border-neutral-800 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "w-10 h-10 text-neutral-600" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-neutral-300",
								children: isAr ? "لا توجد منتجات مطابقة لبحثك في الكتالوج الحالي." : "No products match your search in the current catalog."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "empty-search-record-unmet-btn",
								onClick: () => openUnmetDemandModal({
									isRegisteredProduct: false,
									productNameSnapshot: searchQuery.trim() || "",
									unavailabilityReason: "NOT_STOCKED",
									sourceScreen: "checkout"
								}),
								className: "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageX, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? `تسجيل طلب عميل لمنتج غير متوفر${searchQuery.trim() ? `: "${searchQuery.trim()}"` : ""}` : `Record Unmet Customer Request${searchQuery.trim() ? `: "${searchQuery.trim()}"` : ""}` })]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-testid": "checkout-cart-panel",
				className: `w-full lg:w-[390px] xl:w-[410px] shrink-0 flex flex-col bg-neutral-900/95 border border-neutral-800 rounded-3xl p-4 sm:p-5 shadow-xl transition-all ${isCartDrawerOpen ? "fixed inset-x-3 bottom-20 top-16 z-50 rounded-3xl p-4 sm:p-5 overflow-y-auto max-w-lg mx-auto bg-neutral-900 border-amber-500/40 shadow-2xl lg:static lg:inset-auto lg:z-auto lg:max-w-none lg:w-[390px] xl:w-[410px] lg:sticky lg:top-20 lg:h-fit" : "flex lg:sticky lg:top-20 lg:h-fit"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 pb-3.5 border-b border-neutral-800/90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-center text-amber-400 shrink-0 shadow-inner",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "w-4 h-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-extrabold text-sm sm:text-base text-white tracking-tight truncate",
										children: t.cart
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/35 text-xs font-mono font-extrabold text-amber-300 tabular-nums",
										children: cartTotals.totalItemsCount
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-neutral-400 font-mono tabular-nums block",
									children: isAr ? `عملة الفاتورة: ${settings.currency}` : `Billing Currency: ${settings.currency}`
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 shrink-0",
							children: [cart.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldToConfirm, {
								onConfirm: clearCart,
								label: t.clearCart,
								confirmingLabel: "Clearing...",
								variant: "danger",
								className: "py-1 px-2.5 text-xs min-h-[34px] whitespace-nowrap",
								allowUndo: false
							}), isCartDrawerOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: onCloseCartDrawer,
								className: "p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 lg:hidden transition-colors",
								"aria-label": "Close cart drawer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-y-auto py-3.5 space-y-2.5 min-h-[140px] max-h-[36vh] lg:max-h-[38vh]",
						children: cart.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center h-40 text-center text-neutral-400 px-4 rounded-2xl bg-neutral-950/60 border border-dashed border-neutral-800/90",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400/80 mb-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "w-5 h-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-neutral-200",
									children: t.cartEmpty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-neutral-400 mt-1",
									children: isAr ? "امسح الباركود أو اضغط على أي صنف لإضافته للفاتورة" : "Scan a barcode or tap any catalog item to begin"
								})
							]
						}) : cart.map((item) => {
							const pkg = getProductPackaging(item.product);
							const pricing = getCartItemUnitPricing(item, settings.currency, exchangeRates, settings.language);
							const maxAllowedQty = pricing.saleUnit === "pack" ? Math.floor(item.product.stock / pkg.unitsPerPack) : item.product.stock;
							const unitLabel = isAr ? pkg.unitNameAr : pkg.unitName;
							const packLabel = isAr ? pkg.packNameAr : pkg.packName;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-neutral-950/80 border border-neutral-800/90 rounded-2xl flex flex-col gap-2.5 group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
											className: "text-xs sm:text-sm font-bold text-white truncate",
											children: isAr && item.product.nameAr ? item.product.nameAr : item.product.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center flex-wrap gap-1.5 text-[11px] text-neutral-400 mt-0.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-emerald-400 font-mono font-bold tabular-nums",
													children: formatCurrency(pricing.unitSellingPrice, settings.currency, settings.language)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono",
													children: ["× ", item.quantity]
												}),
												pkg.enablePackaging && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "px-1.5 py-0.5 rounded bg-neutral-800 text-amber-300 text-[10px] font-bold",
													children: pricing.saleUnitLabel
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono",
													children: "="
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-bold text-white tabular-nums",
													children: formatCurrency(pricing.unitSellingPrice * item.quantity, settings.currency, settings.language)
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 shrink-0 bg-neutral-900 p-1 rounded-xl border border-neutral-800",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => updateCartQuantity(item.product.id, -1),
												className: "w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 flex items-center justify-center font-bold",
												"aria-label": `Decrease ${item.product.name} quantity`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "w-3.5 h-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-7 text-center font-mono font-bold text-xs tabular-nums text-white",
												children: item.quantity
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => updateCartQuantity(item.product.id, 1),
												disabled: item.quantity >= maxAllowedQty,
												className: "w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 flex items-center justify-center font-bold disabled:opacity-30 disabled:pointer-events-none",
												"aria-label": `Increase ${item.product.name} quantity`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => removeFromCart(item.product.id),
												className: "w-7 h-7 ms-0.5 rounded-lg text-neutral-500 hover:text-rose-400 flex items-center justify-center",
												"aria-label": `Remove ${item.product.name} from cart`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
											})
										]
									})]
								}), pkg.enablePackaging && pkg.unitsPerPack > 1 && pkg.allowedSaleUnits === "both" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-1.5 pt-2 border-t border-neutral-800/80",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-neutral-400 font-semibold",
										children: isAr ? "وحدة البيع:" : "Sale Unit:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"data-testid": `cart-unit-mode-${item.product.id}`,
											onClick: () => {
												playTactileClick(settings.soundEnabled);
												setCartItemSaleUnit(item.product.id, "unit");
											},
											className: `px-2.5 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${pricing.saleUnit === "unit" ? "bg-emerald-500 text-neutral-950 border-emerald-400" : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700"}`,
											children: isAr ? `بالـ${unitLabel} (1)` : `${unitLabel} (1)`
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"data-testid": `cart-pack-mode-${item.product.id}`,
											disabled: item.product.stock < pkg.unitsPerPack,
											onClick: () => {
												playTactileClick(settings.soundEnabled);
												setCartItemSaleUnit(item.product.id, "pack");
											},
											className: `px-2.5 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${pricing.saleUnit === "pack" ? "bg-amber-500 text-neutral-950 border-amber-400" : "bg-neutral-900 text-amber-300 border-neutral-800 hover:border-neutral-700 disabled:opacity-40"}`,
											children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
												"بالـ",
												packLabel,
												" (",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono",
													children: pkg.unitsPerPack
												}),
												" ",
												unitLabel,
												")"
											] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
												packLabel,
												" (",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono",
													children: pkg.unitsPerPack
												}),
												")"
											] })
										})]
									})]
								})]
							}, item.product.id);
						})
					}),
					cart.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-testid": "cart-discount-section",
						className: "pt-2.5 pb-1.5 border-t border-neutral-800/80 space-y-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-neutral-300 flex items-center gap-1.5 font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "نسبة الخصم %:" : "Discount %:" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-1",
								children: [
									0,
									5,
									10,
									15
								].map((d) => {
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											playTactileClick(settings.soundEnabled);
											setDiscountAmountInput("");
											setGlobalDiscountPercent(d);
										},
										className: `px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-colors ${globalDiscountAmount === 0 && globalDiscountPercent === d ? "bg-amber-500 text-neutral-950 font-bold border-amber-400" : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-600"}`,
										children: [d, "%"]
									}, d);
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "cart-custom-discount-amount",
								className: "text-xs text-neutral-300 font-semibold whitespace-nowrap",
								children: isAr ? "أو مبلغ الخصم:" : "Or Discount Amount:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1 max-w-[200px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "cart-custom-discount-amount",
									"data-testid": "cart-discount-amount-input",
									type: "text",
									inputMode: "decimal",
									dir: "ltr",
									value: globalDiscountAmount === 0 && discountAmountInput === "" ? "" : discountAmountInput,
									onChange: (e) => {
										const cleaned = normalizeNumberInput(e.target.value);
										setDiscountAmountInput(cleaned);
										const parsed = parseNormalizedNumber(cleaned, 0);
										setGlobalDiscountAmount(Math.max(0, parsed));
									},
									placeholder: isAr ? `المبلغ (${settings.currency})` : `0.00 (${settings.currency})`,
									className: `w-full min-h-[36px] pl-3 pr-14 py-1 rounded-xl bg-neutral-950 border text-xs font-mono text-white placeholder:font-sans placeholder:text-neutral-500 focus:outline-none transition-colors ${globalDiscountAmount > 0 ? "border-amber-500 ring-1 ring-amber-500/30" : "border-neutral-800 focus:border-amber-500"}`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-y-0 right-2 flex items-center gap-1",
									children: [globalDiscountAmount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"data-testid": "clear-discount-amount-btn",
										onClick: () => {
											playTactileClick(settings.soundEnabled);
											setDiscountAmountInput("");
											setGlobalDiscountAmount(0);
										},
										className: "p-0.5 rounded text-neutral-400 hover:text-white",
										"aria-label": isAr ? "مسح مبلغ الخصم" : "Clear discount amount",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3 h-3" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-mono font-bold text-amber-400 pointer-events-none",
										children: settings.currency
									})]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800/90 space-y-2 text-xs text-neutral-300 mt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.subtotal }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono tabular-nums text-white font-semibold",
									children: formatCurrency(cartTotals.subtotal, settings.currency, settings.language)
								})]
							}),
							cartTotals.discountAmount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-rose-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.discount }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono tabular-nums font-semibold",
									children: ["-", formatCurrency(cartTotals.discountAmount, settings.currency, settings.language)]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									t.tax,
									" (",
									settings.taxRatePercent,
									"%)",
									settings.isTaxInclusive && " (incl.)"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono tabular-nums text-white font-semibold",
									children: formatCurrency(cartTotals.taxAmount, settings.currency, settings.language)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-baseline text-base font-extrabold text-white pt-2.5 border-t border-neutral-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.total }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono tabular-nums text-amber-400 text-xl tracking-tight",
									children: formatCurrency(cartTotals.grandTotal, settings.currency, settings.language)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-3.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DynamicButton, {
							status: "ready",
							onClick: () => setIsPaymentOpen(true),
							readyLabel: `${t.payNow} • ${formatCurrency(cartTotals.grandTotal, settings.currency, settings.language)}`,
							readyIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "w-5 h-5 text-current" }),
							variant: "emerald",
							disabled: cart.length === 0,
							className: "w-full text-base py-3.5 shadow-lg"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarcodeScannerModal, {
				isOpen: isScannerOpen,
				onClose: () => setIsScannerOpen(false),
				onScan: handleBarcodeScanned
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentModal, {
				isOpen: isPaymentOpen,
				onClose: () => setIsPaymentOpen(false),
				onSuccess: handlePaymentSuccess
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptModal, {
				isOpen: isReceiptOpen,
				onClose: () => setIsReceiptOpen(false),
				transaction: completedTransaction,
				onNewSale: handleNewSale
			})
		]
	});
};
// src/components/onboarding/PracticeModeBanner.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var PracticeModeBanner = () => {
	const { workspaceMode, settings, resetPracticeModeData, exitPracticeMode, openOnboardingModal, startTrainingTour } = usePOS();
	const isAr = settings.language === "ar";
	const [isResetting, setIsResetting] = (0, import_react.useState)(false);
	const [resetSuccess, setResetSuccess] = (0, import_react.useState)(false);
	if (workspaceMode !== "PRACTICE") return null;
	const handleResetDemo = async () => {
		setIsResetting(true);
		try {
			await resetPracticeModeData();
			setResetSuccess(true);
			setTimeout(() => setResetSuccess(false), 3e3);
		} finally {
			setIsResetting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-testid": "practice-mode-banner",
		className: "bg-gradient-to-r from-amber-600/95 via-amber-500/95 to-orange-600/95 text-zinc-950 border-b border-amber-300/60 px-3 sm:px-5 py-2 shrink-0 z-40 shadow-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-7 h-7 rounded-lg bg-zinc-950/20 flex items-center justify-center shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: "w-4 h-4 text-zinc-950" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-950 text-amber-300 text-[10px] font-black uppercase tracking-wider",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-3 h-3" }), isAr ? "وضع التدريب التجريبي" : "PRACTICE MODE"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs sm:text-sm font-black text-zinc-950 truncate",
							children: isAr ? "بيئة تدريب معزولة بالكامل — لا تؤثر المبيعات أو التعديلات هنا على بيانات الشركة الحقيقية" : "Isolated Training Sandbox — Sales, stock edits & resets never affect production company data"
						})]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 sm:gap-2 flex-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": "practice-start-tour-btn",
						onClick: () => startTrainingTour(0),
						className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950/15 hover:bg-zinc-950/25 text-zinc-950 text-xs font-bold transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "الجولة الإرشادية" : "Guided Tour" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-testid": "practice-reset-demo-btn",
						disabled: isResetting,
						onClick: handleResetDemo,
						className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950/15 hover:bg-zinc-950/25 text-zinc-950 text-xs font-bold transition-colors disabled:opacity-50",
						children: resetSuccess ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-emerald-950" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تمت إعادة ضبط التدريب" : "Demo Data Reset!" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: `w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "إعادة ضبط بيانات التدريب" : "Reset Demo Data" })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": "practice-create-company-btn",
						onClick: () => openOnboardingModal("create-company"),
						className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950/20 hover:bg-zinc-950/30 text-zinc-950 text-xs font-black transition-colors border border-zinc-950/25",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تأسيس شركة حقيقية" : "Create New Company" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": "practice-exit-btn",
						onClick: () => exitPracticeMode(),
						className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-900 text-amber-300 text-xs font-black transition-colors shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "الخروج للوضع الحقيقي" : "Exit Practice Mode" })]
					})
				]
			})]
		})
	});
};
// src/components/onboarding/FirstRunOnboardingModal.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var FirstRunOnboardingModal = () => {
	const { isOnboardingModalOpen, onboardingModalInitialView, closeOnboardingModal, settings, workspaceMode, currentCompany, companies, currentUser, enterPracticeMode, exitPracticeMode, createNewCompanyWorkspace, switchCompanyWorkspace, resetAllData, startTrainingTour, hydrateCompanyFromBackupPayload } = usePOS();
	const isAr = settings.language === "ar";
	const [activeView, setActiveView] = (0, import_react.useState)(onboardingModalInitialView);
	const [wizardStep, setWizardStep] = (0, import_react.useState)(1);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const [launchTourAfterSetup, setLaunchTourAfterSetup] = (0, import_react.useState)(false);
	const [restoreEnvelope, setRestoreEnvelope] = (0, import_react.useState)(null);
	const [restoreFileName, setRestoreFileName] = (0, import_react.useState)("");
	const [restoreDecryptionPassword, setRestoreDecryptionPassword] = (0, import_react.useState)("");
	const [restoreCompanyName, setRestoreCompanyName] = (0, import_react.useState)("");
	const [restoreCompanyNameAr, setRestoreCompanyNameAr] = (0, import_react.useState)("");
	const [restoreOwnerName, setRestoreOwnerName] = (0, import_react.useState)("");
	const [restoreOwnerUsername, setRestoreOwnerUsername] = (0, import_react.useState)("");
	const [restoreOwnerPassword, setRestoreOwnerPassword] = (0, import_react.useState)("");
	const [restoreOwnerConfirmPassword, setRestoreOwnerConfirmPassword] = (0, import_react.useState)("");
	const [legalName, setLegalName] = (0, import_react.useState)("");
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [displayNameAr, setDisplayNameAr] = (0, import_react.useState)("");
	const [businessType, setBusinessType] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [taxNumber, setTaxNumber] = (0, import_react.useState)("");
	const [defaultLanguage, setDefaultLanguage] = (0, import_react.useState)(settings.language === "ar" ? "ar" : "en");
	const [timezone, setTimezone] = (0, import_react.useState)("Africa/Khartoum");
	const [fiscalYearStartMonth, setFiscalYearStartMonth] = (0, import_react.useState)(1);
	const [skipInitialCurrencies, setSkipInitialCurrencies] = (0, import_react.useState)(false);
	const [baseCurrency, setBaseCurrency] = (0, import_react.useState)("SDG");
	const [secondaryCurrencies, setSecondaryCurrencies] = (0, import_react.useState)([]);
	const [usdRate, setUsdRate] = (0, import_react.useState)("");
	const [sarRate, setSarRate] = (0, import_react.useState)("");
	const [aedRate, setAedRate] = (0, import_react.useState)("");
	const [egpRate, setEgpRate] = (0, import_react.useState)("");
	const [exchangeRatePolicy, setExchangeRatePolicy] = (0, import_react.useState)("manual_daily");
	const [branchName, setBranchName] = (0, import_react.useState)("");
	const [branchNameAr, setBranchNameAr] = (0, import_react.useState)("");
	const [branchCode, setBranchCode] = (0, import_react.useState)("");
	const [branchCity, setBranchCity] = (0, import_react.useState)("");
	const [branchAddress, setBranchAddress] = (0, import_react.useState)("");
	const [branchPhone, setBranchPhone] = (0, import_react.useState)("");
	const [ownerName, setOwnerName] = (0, import_react.useState)("");
	const [ownerNameAr, setOwnerNameAr] = (0, import_react.useState)("");
	const [ownerUsername, setOwnerUsername] = (0, import_react.useState)("");
	const [ownerEmail, setOwnerEmail] = (0, import_react.useState)("");
	const [ownerPhone, setOwnerPhone] = (0, import_react.useState)("");
	const [ownerPassword, setOwnerPassword] = (0, import_react.useState)("");
	const [ownerConfirmPassword, setOwnerConfirmPassword] = (0, import_react.useState)("");
	const [ownerPin, setOwnerPin] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (isOnboardingModalOpen) {
			setActiveView(onboardingModalInitialView);
			setWizardStep(1);
			setErrorMessage(null);
		}
	}, [isOnboardingModalOpen, onboardingModalInitialView]);
	if (!isOnboardingModalOpen) return null;
	const handleRestoreFileUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setErrorMessage(null);
		try {
			const text = await file.text();
			const parsed = JSON.parse(text);
			if (!parsed || parsed.formatSignature !== "DQNAMO_POS_BACKUP_V1" || !parsed.manifest) throw new Error(isAr ? "ملف النسخة الاحتياطية غير صالح أو لا يطابق صيغة DQNAMO_POS_BACKUP_V1." : "Invalid backup file or unsupported format signature.");
			setRestoreEnvelope(parsed);
			setRestoreFileName(file.name);
			const srcName = parsed.manifest.sourceCompany?.displayName;
			const srcNameAr = parsed.manifest.sourceCompany?.displayNameAr;
			if (!restoreCompanyName && srcName) setRestoreCompanyName(`${srcName} (Restored)`);
			if (!restoreCompanyNameAr && srcNameAr) setRestoreCompanyNameAr(`${srcNameAr} (مستعادة)`);
		} catch (err) {
			setErrorMessage(err?.message || "Failed to parse backup file.");
		}
		e.target.value = "";
	};
	const handleRestoreAsNewCompanySubmit = async () => {
		setErrorMessage(null);
		if (!restoreEnvelope) {
			setErrorMessage(isAr ? "يرجى اختيار ملف النسخة الاحتياطية (.backup) أولاً." : "Please select a .backup file first.");
			return;
		}
		if (!restoreCompanyName.trim()) {
			setErrorMessage(isAr ? "يرجى إدخال اسم الشركة الجديدة." : "Please enter the New Company Name.");
			return;
		}
		if (!restoreOwnerUsername.trim()) {
			setErrorMessage(isAr ? "يرجى إدخال اسم المستخدم لحساب المالك الجديد." : "Owner Username is required.");
			return;
		}
		if (!restoreOwnerPassword || restoreOwnerPassword.length < 4) {
			setErrorMessage(isAr ? "كلمة مرور المالك مطلوبة (4 أحرف على الأقل)." : "Owner Password is required (at least 4 characters).");
			return;
		}
		if (restoreOwnerPassword !== restoreOwnerConfirmPassword) {
			setErrorMessage(isAr ? "كلمة المرور وتأكيد كلمة المرور غير متطابقين." : "Owner Password and Confirm Password do not match.");
			return;
		}
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/backups/restore-new-company", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-user-id": currentUser.id
				},
				body: JSON.stringify({
					envelope: restoreEnvelope,
					decryptionPassword: restoreDecryptionPassword || void 0,
					companyName: restoreCompanyName.trim(),
					companyNameAr: restoreCompanyNameAr.trim() || restoreCompanyName.trim(),
					ownerName: restoreOwnerName.trim() || restoreOwnerUsername.trim(),
					ownerUsername: restoreOwnerUsername.trim(),
					ownerPassword: restoreOwnerPassword,
					ownerConfirmPassword: restoreOwnerConfirmPassword
				})
			});
			const json = await response.json();
			const resultData = json?.data || json;
			if (!response.ok || !json.success && !resultData?.ok) throw new Error(json.error || "Failed to restore backup as new company.");
			if (resultData.restoredPayload && resultData.company) hydrateCompanyFromBackupPayload(resultData.restoredPayload, {
				switchToNewCompany: true,
				newOwner: resultData.owner
			});
			closeOnboardingModal();
		} catch (err) {
			setErrorMessage(err?.message || "Restore as new company failed.");
		} finally {
			setIsSubmitting(false);
		}
	};
	const toggleSecondaryCurrency = (code) => {
		setSecondaryCurrencies((prev) => prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]);
	};
	const validateCurrentWizardStep = () => {
		setErrorMessage(null);
		if (wizardStep === 1) {
			const effectiveName = legalName.trim() || displayName.trim() || displayNameAr.trim();
			if (!effectiveName) {
				setErrorMessage(isAr ? "يرجى إدخال اسم الشركة أو المتجر أولاً." : "Please enter the company or store name.");
				return false;
			}
			if (!legalName.trim()) setLegalName(effectiveName);
			if (!displayName.trim()) setDisplayName(effectiveName);
			if (!displayNameAr.trim()) setDisplayNameAr(effectiveName);
			return true;
		}
		if (wizardStep === 2) {
			if (skipInitialCurrencies) return true;
			if (!baseCurrency.trim()) setBaseCurrency("SDG");
			const rateMap = {
				USD: usdRate,
				SAR: sarRate,
				AED: aedRate,
				EGP: egpRate
			};
			for (const code of secondaryCurrencies) {
				const val = Number(rateMap[code]);
				if (!rateMap[code]?.trim() || isNaN(val) || val <= 0) {
					setErrorMessage(isAr ? `يرجى إدخال سعر صرف صحيح أكبر من 0 للعملة المحددة (${code}) أو إلغاء تحديدها.` : `Please enter a valid exchange rate greater than 0 for (${code}) or uncheck it.`);
					return false;
				}
			}
			return true;
		}
		if (wizardStep === 3) {
			const effectiveBranch = branchName.trim() || branchNameAr.trim() || displayNameAr.trim() || displayName.trim() || legalName.trim();
			if (!effectiveBranch) {
				setErrorMessage(isAr ? "يرجى إدخال اسم الفرع." : "Please enter the branch name.");
				return false;
			}
			if (!branchName.trim()) setBranchName(effectiveBranch);
			if (!branchNameAr.trim()) setBranchNameAr(effectiveBranch);
			return true;
		}
		if (wizardStep === 4) {
			const effectiveOwner = ownerName.trim() || ownerNameAr.trim() || ownerUsername.trim() || displayNameAr.trim() || displayName.trim() || legalName.trim();
			if (!effectiveOwner) {
				setErrorMessage(isAr ? "يرجى إدخال اسم المالك أو المدير." : "Please enter the owner name.");
				return false;
			}
			if (!ownerName.trim()) setOwnerName(effectiveOwner);
			if (!ownerNameAr.trim()) setOwnerNameAr(effectiveOwner);
			if (!ownerUsername.trim() && !ownerEmail.trim()) {
				setErrorMessage(isAr ? "يرجى إدخال اسم المستخدم (Username) لحساب المالك." : "Owner username is required.");
				return false;
			}
			if (!ownerPassword.trim() || ownerPassword.trim().length < 8 || !/[A-Za-z\u0600-\u06FF]/.test(ownerPassword.trim()) || !/\d/.test(ownerPassword.trim())) {
				setErrorMessage(isAr ? "يرجى إدخال كلمة مرور للمالك تتكون من 8 خانات على الأقل وتحتوي على أحرف وأرقام." : "Owner password must be at least 8 characters and contain both letters and numbers.");
				return false;
			}
			if (ownerPassword !== ownerConfirmPassword) {
				setErrorMessage(isAr ? "كلمة المرور وتأكيد كلمة المرور غير متطابقين." : "Password and Confirm Password do not match.");
				return false;
			}
			return true;
		}
		return true;
	};
	const handleNextStep = () => {
		if (!validateCurrentWizardStep()) return;
		setWizardStep((prev) => Math.min(5, prev + 1));
	};
	const handlePrevStep = () => {
		setErrorMessage(null);
		if (wizardStep === 1) setActiveView("hub");
		else setWizardStep((prev) => Math.max(1, prev - 1));
	};
	const handleCreateCompanySubmit = async () => {
		setErrorMessage(null);
		const effectiveCompanyName = legalName.trim() || displayName.trim() || displayNameAr.trim();
		if (!effectiveCompanyName) {
			setWizardStep(1);
			setErrorMessage(isAr ? "يرجى إدخال اسم الشركة أو المتجر في الخطوة 1." : "Please enter the company or store name in Step 1.");
			return;
		}
		if (!ownerUsername.trim() && !ownerEmail.trim()) {
			setWizardStep(4);
			setErrorMessage(isAr ? "يرجى إدخال اسم المستخدم (Username) لحساب المالك في الخطوة 4." : "Please enter the Owner Username in Step 4.");
			return;
		}
		if (!ownerPassword.trim() || ownerPassword.trim().length < 8 || !/[A-Za-z\u0600-\u06FF]/.test(ownerPassword.trim()) || !/\d/.test(ownerPassword.trim())) {
			setWizardStep(4);
			setErrorMessage(isAr ? "يرجى إدخال كلمة مرور المالك (8 خانات على الأقل تحتوي على أحرف وأرقام) في الخطوة 4." : "Please enter an Owner Password (at least 8 characters with letters and numbers) in Step 4.");
			return;
		}
		if (ownerPassword !== ownerConfirmPassword) {
			setWizardStep(4);
			setErrorMessage(isAr ? "كلمة المرور وتأكيد كلمة المرور غير متطابقين في الخطوة 4." : "Password and Confirm Password do not match in Step 4.");
			return;
		}
		setIsSubmitting(true);
		try {
			const finalLegalName = legalName.trim() || effectiveCompanyName;
			const finalDisplayName = displayName.trim() || finalLegalName;
			const finalDisplayNameAr = displayNameAr.trim() || finalDisplayName;
			const finalBranchName = branchName.trim() || branchNameAr.trim() || finalDisplayName;
			const finalBranchNameAr = branchNameAr.trim() || finalBranchName;
			const finalOwnerName = ownerName.trim() || ownerNameAr.trim() || ownerUsername.trim() || finalDisplayName;
			const finalOwnerNameAr = ownerNameAr.trim() || finalOwnerName;
			const finalPassword = ownerPassword.trim();
			const uniqueSuffix = Date.now().toString(36).slice(-4);
			const finalUsername = ownerUsername.trim() || ownerEmail.trim();
			const idempotencyKey = `onboard-${Date.now().toString(36)}-${uniqueSuffix}`;
			const cleanBase = skipInitialCurrencies ? "" : baseCurrency.trim().toUpperCase() || "SDG";
			const userEnteredExchangeRates = cleanBase ? { [cleanBase]: 1 } : {};
			const activeSecondaryList = [];
			const rateCandidates = {
				USD: usdRate,
				SAR: sarRate,
				AED: aedRate,
				EGP: egpRate
			};
			if (!skipInitialCurrencies) for (const code of secondaryCurrencies) {
				const parsedRate = Number(rateCandidates[code]);
				if (!isNaN(parsedRate) && parsedRate > 0) {
					userEnteredExchangeRates[code] = parsedRate;
					activeSecondaryList.push(code);
				}
			}
			const result = await createNewCompanyWorkspace({
				idempotencyKey,
				skipInitialCurrencies,
				legalName: finalLegalName,
				displayName: finalDisplayName,
				displayNameAr: finalDisplayNameAr,
				businessType: businessType.trim(),
				country: country.trim(),
				city: city.trim(),
				address: address.trim(),
				phone: phone.trim(),
				email: email.trim(),
				taxNumber: taxNumber.trim(),
				defaultLanguage,
				timezone,
				fiscalYearStartMonth,
				baseCurrency: cleanBase || "SDG",
				secondaryCurrencies: activeSecondaryList,
				exchangeRatePolicy,
				initialExchangeRates: userEnteredExchangeRates,
				branchName: finalBranchName,
				branchNameAr: finalBranchNameAr,
				branchCode: branchCode.trim() || `BR-${uniqueSuffix.toUpperCase()}`,
				branchCity: branchCity.trim() || city.trim(),
				branchAddress: branchAddress.trim() || address.trim(),
				branchPhone: branchPhone.trim() || phone.trim(),
				ownerName: finalOwnerName,
				ownerNameAr: finalOwnerNameAr,
				ownerUsername: finalUsername,
				ownerEmail: ownerEmail.trim(),
				ownerPhone: ownerPhone.trim() || phone.trim(),
				ownerPassword: finalPassword,
				ownerConfirmPassword: ownerConfirmPassword.trim(),
				ownerPin: ownerPin.trim() || "1111"
			});
			if (!result.ok) {
				setErrorMessage(result.error || "Failed to create company.");
				return;
			}
			if (launchTourAfterSetup) setTimeout(() => {
				startTrainingTour(0);
			}, 250);
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-testid": "first-run-onboarding-modal",
		className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 py-4 bg-zinc-950/90 border-b border-zinc-800 flex items-center justify-between gap-3 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base sm:text-lg font-black text-zinc-100",
							children: activeView === "create-company" ? isAr ? "معالج تأسيس شركة جديدة وإعداد المالك" : "New Company & Initial Owner Setup Wizard" : isAr ? "بوابة التأسيس ووضع التدريب التجريبي وإدارة الشركات" : "Company Onboarding, Practice Mode & Workspace Hub"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase",
							children: "Release v1.0"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-zinc-400",
						children: isAr ? "اختر الدخول لبيئة التدريب المعزولة أو تأسيس شركة حقيقية جديدة مع الحفاظ التام على بياناتك الحالية" : "Enter the isolated Practice Mode sandbox, create a new production company, or switch active company workspaces"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-testid": "onboarding-modal-close-btn",
					onClick: closeOnboardingModal,
					className: "p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5 sm:p-6 overflow-y-auto space-y-6 flex-1",
				children: [errorMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-testid": "onboarding-error-banner",
					className: "p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 text-rose-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errorMessage })]
				}), activeView === "hub" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-testid": "onboarding-option-practice-card",
								className: "p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-950 border border-amber-500/30 flex flex-col justify-between gap-4 hover:border-amber-400/60 transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-[11px] font-black uppercase tracking-wider",
												children: isAr ? "الخيار أ — بيئة تدريب معزولة" : "OPTION A — TRAINING SANDBOX"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: "w-5 h-5 text-amber-400" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-base sm:text-lg font-black text-zinc-100",
											children: isAr ? "وضع التدريب التجريبي (Practice Mode)" : "Practice Mode (Isolated Demo)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-zinc-400 leading-relaxed",
											children: isAr ? "ادخل فوراً إلى شركة تدريبية معزولة بالكامل تحتوي على أصناف، عملاء، فواتير، مخزون، وتقارير ذكاء أعمال جاهزة للتجربة والتدريب دون أي تأثير على قاعدة بيانات الإنتاج." : "Enter a 100% isolated demo company preloaded with sample products, customers, sales, stock movements, and intelligence recommendations. Zero impact on production data."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
											className: "space-y-1.5 text-xs text-zinc-300 pt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تجربة البيع، المرتجعات، الجرد، والعملات بأمان تام" : "Practice sales, returns, stock adjustments & multi-currency safely" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "إمكانية إعادة ضبط بيانات التدريب في أي وقت بضغطة زر" : "One-click Reset Demo Data anytime without touching production" })]
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "onboarding-enter-practice-btn",
									onClick: () => enterPracticeMode(),
									className: "w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "بدء وضع التدريب التجريبي الآن" : "Launch Practice Mode Sandbox" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-testid": "onboarding-option-create-company-card",
								className: "p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-zinc-900 to-zinc-950 border border-emerald-500/30 flex flex-col justify-between gap-4 hover:border-emerald-400/60 transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] font-black uppercase tracking-wider",
												children: isAr ? "الخيار ب — بيئة إنتاج حقيقية" : "OPTION B — PRODUCTION SETUP"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-5 h-5 text-emerald-400" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-base sm:text-lg font-black text-zinc-100",
											children: isAr ? "تأسيس شركة جديدة (Create New Company)" : "Create New Company"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-zinc-400 leading-relaxed",
											children: isAr ? "معالج تأسيس احترافي من 5 خطوات لإعداد ملف الشركة، العملة الأساسية (SDG) وأسعار الصرف، الفرع الرئيسي، وحساب المالك / المدير العام بصلاحيات كاملة وعزل تام للبيانات." : "Guided 5-step production setup wizard for Company Profile, SDG Base Currency & Exchange Rates, Initial Main Branch, and Initial Company Owner / Admin account."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
											className: "space-y-1.5 text-xs text-zinc-300 pt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "عزل كامل لبيانات كل شركة وفروعها ومستخدميها" : "Complete multi-company & branch data isolation" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "إنشاء حساب المالك المشفر وإطلاق الجولة الإرشادية" : "Encrypted Owner credentials + interactive 13-step guided tour" })]
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "onboarding-start-company-wizard-btn",
									onClick: () => {
										setActiveView("create-company");
										setWizardStep(1);
									},
									className: "w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "بدء معالج تأسيس شركة جديدة" : "Start New Company Setup Wizard" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-testid": "onboarding-option-restore-backup-card",
								className: "p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 via-zinc-900 to-zinc-950 border border-sky-500/30 flex flex-col justify-between gap-4 hover:border-sky-400/60 transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 text-[11px] font-black uppercase tracking-wider",
												children: isAr ? "الخيار ج — استعادة وترحيل" : "OPTION C — BACKUP RESTORE"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArchiveRestore, { className: "w-5 h-5 text-sky-400" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-base sm:text-lg font-black text-zinc-100",
											children: isAr ? "استعادة شركة من نسخة احتياطية (.backup)" : "Restore Company from Backup (.backup)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-zinc-400 leading-relaxed",
											children: isAr ? "قم برفع ملف نسخة احتياطية (.backup) لاستعادة متجرك بالكامل أو ترحيل بيانات شركة من جهاز آخر مع توليد معرّف شركة جديد وإعداد حساب مالك آمن." : "Upload a verified .backup archive to migrate or clone a company from another device with fresh tenant isolation and secure new Owner credentials."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
											className: "space-y-1.5 text-xs text-zinc-300 pt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-sky-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "التحقق التلقائي من البصمة الرقمية SHA-256 وفك التشفير" : "SHA-256 checksum validation & AES-256-GCM decryption" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3.5 h-3.5 text-sky-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "إعادة ربط جميع الأصناف والفواتير والعملاء تلقائياً" : "Automatic ID remapping for products, sales & accounting" })]
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "onboarding-start-restore-backup-btn",
									onClick: () => {
										setErrorMessage(null);
										setActiveView("restore-backup");
									},
									className: "w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-sky-500/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArchiveRestore, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "استعادة شركة من ملف .backup" : "Restore Company from Backup" })]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-sky-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs sm:text-sm font-black text-zinc-200",
									children: isAr ? "الشركات والمتاجر المؤسسة (تعمل أوفلاين بالكامل وبدون أي بيانات افتراضية)" : "Configured Production Companies (100% Offline & Zero Default Seed Data)"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"data-testid": "onboarding-clear-default-data-btn",
									onClick: () => {
										resetAllData();
									},
									className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "مسح جميع البيانات الافتراضية في الشركات" : "Clear All Default Data in Companies" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "onboarding-hub-launch-tour-btn",
									onClick: () => {
										closeOnboardingModal();
										startTrainingTour(0);
									},
									className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تشغيل الجولة الإرشادية (13 قسماً)" : "Launch 13-Step Guided Tour" })]
								})]
							})]
						}), companies.filter((c) => !c.isDemoPractice && c.id !== "comp-default").length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-xs text-zinc-400 text-center",
							children: isAr ? "لا توجد شركات افتراضية مسجلة حالياً — جميع البيانات التجريبية معزولة في وضع التدريب (Practice Mode) فقط. اضغط \"بدء معالج تأسيس شركة جديدة\" أعلاه لإنشاء متجرك الفارغ والبدء بإدخال منتجاتك وأسعار الصرف الخاصة بك." : "No default companies loaded — all sample data is isolated strictly inside Practice Mode. Click \"Start New Company Setup Wizard\" above to create your clean store."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
							children: companies.filter((c) => !c.isDemoPractice && c.id !== "comp-default").map((comp) => {
								const isCurrent = workspaceMode === "PRODUCTION" && currentCompany.id === comp.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									"data-testid": `company-workspace-card-${comp.id}`,
									className: `p-3.5 rounded-xl border flex items-center justify-between gap-3 ${isCurrent ? "bg-sky-500/10 border-sky-500/40" : "bg-zinc-900/70 border-zinc-800"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs sm:text-sm font-black text-zinc-100 truncate",
												children: isAr ? comp.displayNameAr || comp.displayName : comp.displayName
											}), isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-bold",
												children: isAr ? "نشطة حالياً" : "Active"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-zinc-400 truncate mt-0.5",
											children: [
												comp.businessType,
												comp.city || comp.country,
												comp.baseCurrency
											].filter(Boolean).join(" • ")
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"data-testid": `switch-company-btn-${comp.id}`,
										onClick: () => switchCompanyWorkspace(comp.id),
										className: "px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-bold shrink-0 transition-colors",
										children: isCurrent ? isAr ? "متابعة العمل" : "Continue" : isAr ? "التبديل للشركة" : "Switch"
									})]
								}, comp.id);
							})
						})]
					})]
				}) : activeView === "restore-backup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					"data-testid": "onboarding-restore-backup-view",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArchiveRestore, { className: "w-5 h-5 text-sky-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-zinc-300 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-black text-sm text-white",
									children: isAr ? "استعادة شركة كاملة من نسخة احتياطية (.backup) كشركة مستقلة جديدة" : "Restore Full Company from Backup (.backup) as a New Independent Workspace"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-zinc-400",
									children: isAr ? "يتم التحقق من سلامة الحزمة عبر SHA-256، وإعادة توليد معرّفات السجلات (Company ID, Branch IDs, Product IDs, Invoice IDs) مع حذف أي كلمات مرور قديمة وتعيين حساب المالك الجديد." : "Verifies SHA-256 checksums, remaps all internal IDs (Company, Branches, Products, Sales, Accounts) to prevent collisions, strips legacy credentials, and binds your new Owner account."
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950/60 p-4 sm:p-5 rounded-2xl border border-zinc-800",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-bold text-zinc-300 mb-1.5",
											children: isAr ? "ملف النسخة الاحتياطية (.backup) *" : "Select Backup File (.backup) *"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-900 border border-dashed border-sky-500/40 hover:border-sky-400 cursor-pointer transition-colors",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5 min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-4 h-4 text-sky-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs font-bold text-zinc-200 truncate",
														children: restoreFileName || (isAr ? "اضغط لاختيار ملف .backup من جهازك..." : "Click to browse for a .backup file...")
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "file",
													"data-testid": "onboarding-restore-file-input",
													accept: ".backup,.json,application/json",
													onChange: handleRestoreFileUpload,
													className: "hidden"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 text-[11px] font-black shrink-0",
													children: isAr ? "اختيار ملف" : "Browse"
												})
											]
										}),
										restoreEnvelope && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 flex flex-wrap items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												isAr ? "الشركة المصدر:" : "Source Company:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-sky-400",
													children: restoreEnvelope.manifest.sourceCompany?.displayName
												}),
												" ",
												"(",
												restoreEnvelope.manifest.sourceCompany?.baseCurrency || "SDG",
												")"
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												isAr ? "تاريخ النسخة:" : "Created:",
												" ",
												new Date(restoreEnvelope.manifest.createdAt).toLocaleString()
											] })]
										})
									]
								}),
								restoreEnvelope?.encrypted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-amber-300 mb-1",
										children: isAr ? "كلمة مرور فك تشفير النسخة الاحتياطية (AES-256-GCM) *" : "Backup Decryption Password (AES-256-GCM) *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "password",
										"data-testid": "onboarding-restore-decryption-password",
										value: restoreDecryptionPassword,
										onChange: (e) => setRestoreDecryptionPassword(e.target.value),
										placeholder: "••••••••",
										className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-amber-500/40 text-sm text-zinc-100 focus:outline-none focus:border-amber-400"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "اسم الشركة الجديدة (EN) *" : "New Company Name (EN) *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									"data-testid": "onboarding-restore-company-name",
									value: restoreCompanyName,
									onChange: (e) => setRestoreCompanyName(e.target.value),
									placeholder: "e.g. Nile Mart Branch 2",
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-sky-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "اسم الشركة الجديدة (بالعربية)" : "New Company Name (Arabic)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									"data-testid": "onboarding-restore-company-name-ar",
									value: restoreCompanyNameAr,
									onChange: (e) => setRestoreCompanyNameAr(e.target.value),
									placeholder: "مثال: أسواق النيل - الفرع الجديد",
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-sky-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "الاسم الكامل للمالك الجديد" : "New Owner Full Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									"data-testid": "onboarding-restore-owner-name",
									value: restoreOwnerName,
									onChange: (e) => setRestoreOwnerName(e.target.value),
									placeholder: "e.g. Ahmed Hassan",
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-sky-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "اسم المستخدم للمالك الجديد (Username) *" : "New Owner Username *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									"data-testid": "onboarding-restore-owner-username",
									value: restoreOwnerUsername,
									onChange: (e) => setRestoreOwnerUsername(e.target.value),
									placeholder: "ahmed.owner",
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-mono text-zinc-100 focus:outline-none focus:border-sky-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "كلمة مرور المالك الجديد *" : "New Owner Password *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									"data-testid": "onboarding-restore-owner-password",
									value: restoreOwnerPassword,
									onChange: (e) => setRestoreOwnerPassword(e.target.value),
									placeholder: "••••••••",
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-sky-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "تأكيد كلمة مرور المالك الجديد *" : "Confirm New Owner Password *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									"data-testid": "onboarding-restore-owner-confirm-password",
									value: restoreOwnerConfirmPassword,
									onChange: (e) => setRestoreOwnerConfirmPassword(e.target.value),
									placeholder: "••••••••",
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-sky-500"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "onboarding-restore-back-btn",
								onClick: () => {
									setErrorMessage(null);
									setActiveView("hub");
								},
								className: "px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-bold inline-flex items-center gap-2 transition-colors",
								children: [isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "العودة للخيارات" : "Back to Options" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "onboarding-restore-submit-btn",
								disabled: isSubmitting,
								onClick: handleRestoreAsNewCompanySubmit,
								className: "px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 text-xs sm:text-sm font-black inline-flex items-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-sky-500/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArchiveRestore, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? isAr ? "جاري استعادة الشركة..." : "Restoring Company..." : isAr ? "استعادة وتأسيس الشركة الآن" : "Restore & Initialize Company Now" })]
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					"data-testid": "create-company-wizard-form",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-5 gap-2",
							children: [
								{
									step: 1,
									labelEn: "1. Company Info",
									labelAr: "1. بيانات الشركة",
									icon: Briefcase
								},
								{
									step: 2,
									labelEn: "2. Currencies",
									labelAr: "2. العملات والصرف",
									icon: Coins
								},
								{
									step: 3,
									labelEn: "3. Main Branch",
									labelAr: "3. الفرع الرئيسي",
									icon: Store
								},
								{
									step: 4,
									labelEn: "4. Owner Account",
									labelAr: "4. حساب المالك",
									icon: UserCheck
								},
								{
									step: 5,
									labelEn: "5. Review & Launch",
									labelAr: "5. المراجعة والاعتماد",
									icon: Sparkles
								}
							].map((s) => {
								const Icon = s.icon;
								const active = wizardStep === s.step;
								const done = wizardStep > s.step;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"data-testid": `wizard-step-pill-${s.step}`,
									onClick: () => {
										setErrorMessage(null);
										setWizardStep(s.step);
									},
									className: `p-2.5 rounded-xl border text-center transition-all cursor-pointer ${active ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-300" : done ? "bg-zinc-900 border-emerald-500/30 text-emerald-400 hover:border-emerald-400" : "bg-zinc-950/60 border-zinc-800 text-zinc-500 hover:text-zinc-300"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-center gap-1.5 text-xs font-black",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: isAr ? s.labelAr : s.labelEn
										})]
									})
								}, s.step);
							})
						}),
						wizardStep === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950/60 p-4 sm:p-5 rounded-2xl border border-zinc-800",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "الاسم القانوني للشركة *" : "Company Legal Name *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									"data-testid": "wizard-company-legal-name",
									value: legalName,
									onChange: (e) => {
										setLegalName(e.target.value);
										if (!displayName) setDisplayName(e.target.value);
									},
									placeholder: isAr ? "مثال: شركة النيل للتجارة المحدودة" : "e.g. Nile Trading Co. LLC",
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "الاسم التجاري المختصر (EN)" : "Display Name (English)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									"data-testid": "wizard-company-display-name",
									value: displayName,
									onChange: (e) => setDisplayName(e.target.value),
									placeholder: "e.g. Nile Mart & Roastery",
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "الاسم التجاري بالعربية" : "Display Name (Arabic)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									"data-testid": "wizard-company-display-name-ar",
									value: displayNameAr,
									onChange: (e) => setDisplayNameAr(e.target.value),
									placeholder: "مثال: أسواق النيل التجارية",
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "نوع النشاط التجاري" : "Business Type / Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: businessType,
									onChange: (e) => setBusinessType(e.target.value),
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Retail & Wholesale",
											children: "Retail & Wholesale (تجزئة وجملة)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Supermarket & Grocery",
											children: "Supermarket & Grocery (سوبرماركت ومواد غذائية)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Pharmacy & Medical",
											children: "Pharmacy & Medical (صيدلية ومستلزمات طبية)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Specialty Cafe & Roastery",
											children: "Specialty Cafe & Roastery (مقهى وتحميص مختص)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Electronics & Hardware",
											children: "Electronics & Hardware (إلكترونيات ومعدات)"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "الدولة" : "Country"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: country,
									onChange: (e) => setCountry(e.target.value),
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "المدينة" : "City"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: city,
									onChange: (e) => {
										setCity(e.target.value);
										setBranchCity(e.target.value);
									},
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "رقم الهاتف الرسمي" : "Company Phone"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "البريد الإلكتروني الرسمي" : "Company Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "info@company.com",
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "الرقم الضريبي / السجل التجاري" : "Tax / Commercial Registration No."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: taxNumber,
									onChange: (e) => setTaxNumber(e.target.value),
									placeholder: "SD-TIN-XXXXXX",
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "اللغة الافتراضية للنظام" : "Default System Language"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: defaultLanguage,
									onChange: (e) => setDefaultLanguage(e.target.value),
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "ar",
										children: "العربية (RTL)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "en",
										children: "English (LTR)"
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-zinc-300 mb-1",
										children: isAr ? "العنوان التفصيلي" : "Street Address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: address,
										onChange: (e) => setAddress(e.target.value),
										placeholder: isAr ? "الخرطوم - شارع الجمهورية" : "100 Main Avenue, Business District",
										className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
									})]
								})
							]
						}),
						wizardStep === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 bg-zinc-950/60 p-4 sm:p-5 rounded-2xl border border-zinc-800",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-900 border border-amber-500/30 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-black text-amber-300 block",
											children: isAr ? "تخطي إضافة العملات الآن (البدء بدون أي عملات افتراضية وإضافتها يدوياً من الإعدادات)" : "Skip Currency Setup Now (Start with 0 default currencies & add manually in Settings)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-zinc-400 block",
											children: isAr ? "فعّل هذا الخيار إذا كنت لا تريد إضافة أي عملة تلقائياً وتفضل تخصيص العملات بنفسك لاحقاً." : "Enable this to start with zero pre-configured currencies and customize them yourself later."
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										"data-testid": "wizard-skip-currencies-checkbox",
										checked: skipInitialCurrencies,
										onChange: (e) => setSkipInitialCurrencies(e.target.checked),
										className: "w-4 h-4 accent-amber-500 shrink-0"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `grid grid-cols-1 sm:grid-cols-2 gap-4 ${skipInitialCurrencies ? "opacity-40 pointer-events-none" : ""}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-bold text-zinc-300 mb-1",
											children: isAr ? "العملة الأساسية للمحاسبة (Base Currency)" : "Accounting Base Currency"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: baseCurrency,
											onChange: (e) => setBaseCurrency(e.target.value.toUpperCase()),
											disabled: skipInitialCurrencies,
											className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-black text-amber-400 focus:outline-none focus:border-emerald-500"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-zinc-500 mt-1 block",
											children: isAr ? "الجنيه السوداني (SDG) هو العملة الأساسية الافتراضية للتقارير والمحاسبة" : "Sudanese Pound (SDG) is the default base currency for unified accounting"
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-zinc-300 mb-1",
										children: isAr ? "سياسة تحديث أسعار الصرف" : "Exchange Rate Update Policy"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: exchangeRatePolicy,
										onChange: (e) => setExchangeRatePolicy(e.target.value),
										disabled: skipInitialCurrencies,
										className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "manual_daily",
												children: isAr ? "تحديث يومي معتمد من الإدارة" : "Manual Daily Admin Rate"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "locked_per_shift",
												children: isAr ? "تثبيت السعر لكل وردية" : "Locked Per Shift"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "flexible_cashier",
												children: isAr ? "مرن مع توثيق لقطة الفاتورة" : "Flexible with Invoice Snapshot"
											})
										]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-2",
									children: isAr ? "العملات الأجنبية المفعلة وأسعار الصرف مقابل SDG" : "Active Foreign Currencies & Initial Rates to SDG"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
									children: [
										{
											code: "USD",
											val: usdRate,
											setVal: setUsdRate
										},
										{
											code: "SAR",
											val: sarRate,
											setVal: setSarRate
										},
										{
											code: "AED",
											val: aedRate,
											setVal: setAedRate
										},
										{
											code: "EGP",
											val: egpRate,
											setVal: setEgpRate
										}
									].map((curr) => {
										const enabled = secondaryCurrencies.includes(curr.code);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `p-3 rounded-xl border ${enabled ? "bg-zinc-900 border-emerald-500/40" : "bg-zinc-950 border-zinc-800 opacity-60"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between mb-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs font-black text-zinc-100",
														children: curr.code
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "checkbox",
														checked: enabled,
														onChange: () => toggleSecondaryCurrency(curr.code),
														className: "accent-emerald-500"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													value: curr.val,
													placeholder: enabled ? isAr ? "أدخل سعر الصرف..." : "Enter rate..." : "—",
													onChange: (e) => curr.setVal(e.target.value),
													disabled: !enabled,
													className: "w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-zinc-500 mt-1 block",
													children: enabled && curr.val ? `1 ${curr.code} = ${curr.val} ${baseCurrency}` : isAr ? "اختياري — فعّل العملة وأدخل السعر" : "Optional — check & enter rate"
												})
											]
										}, curr.code);
									})
								})] })
							]
						}),
						wizardStep === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950/60 p-4 sm:p-5 rounded-2xl border border-zinc-800",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "اسم الفرع الرئيسي (EN) *" : "Main Branch Name (EN) *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									"data-testid": "wizard-branch-name",
									value: branchName,
									onChange: (e) => setBranchName(e.target.value),
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "اسم الفرع الرئيسي بالعربية" : "Main Branch Name (Arabic)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: branchNameAr,
									onChange: (e) => setBranchNameAr(e.target.value),
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "كود الفرع (Branch Code)" : "Branch Code"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: branchCode,
									onChange: (e) => setBranchCode(e.target.value.toUpperCase()),
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "مدينة الفرع" : "Branch City"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: branchCity,
									onChange: (e) => setBranchCity(e.target.value),
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "عنوان الفرع" : "Branch Address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: branchAddress,
									onChange: (e) => setBranchAddress(e.target.value),
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "هاتف الفرع" : "Branch Phone"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: branchPhone,
									onChange: (e) => setBranchPhone(e.target.value),
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] })
							]
						}),
						wizardStep === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950/60 p-4 sm:p-5 rounded-2xl border border-zinc-800",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "الاسم الكامل للمالك / المدير العام *" : "Owner / Super Admin Full Name *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									"data-testid": "wizard-owner-name",
									value: ownerName,
									onChange: (e) => setOwnerName(e.target.value),
									placeholder: "e.g. Tariq Al-Mansoor",
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "الاسم بالعربية" : "Owner Name (Arabic)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: ownerNameAr,
									onChange: (e) => setOwnerNameAr(e.target.value),
									placeholder: "مثال: طارق المنصور",
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "اسم المستخدم للدخول (Username)" : "Login Username"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									"data-testid": "wizard-owner-username",
									value: ownerUsername,
									onChange: (e) => setOwnerUsername(e.target.value),
									placeholder: "tariq.owner",
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "البريد الإلكتروني للمالك" : "Owner Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									value: ownerEmail,
									onChange: (e) => setOwnerEmail(e.target.value),
									placeholder: "owner@company.com",
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "كلمة المرور (6 أحرف على الأقل) *" : "Password (min 6 chars) *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									"data-testid": "wizard-owner-password",
									value: ownerPassword,
									onChange: (e) => setOwnerPassword(e.target.value),
									placeholder: "••••••••",
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "تأكيد كلمة المرور *" : "Confirm Password *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									"data-testid": "wizard-owner-confirm-password",
									value: ownerConfirmPassword,
									onChange: (e) => setOwnerConfirmPassword(e.target.value),
									placeholder: "••••••••",
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-zinc-300 mb-1",
									children: isAr ? "رمز نقطة البيع السريع (PIN)" : "Quick Terminal PIN (4-8 digits)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: ownerPin,
									onChange: (e) => setOwnerPin(e.target.value),
									className: "w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "سيتم منح هذا الحساب دور المالك (COMPANY_OWNER) مع جميع الصلاحيات الـ 46 وتشفير كلمة المرور عبر scrypt." : "Account is assigned COMPANY_OWNER role with all 46 capabilities and scrypt password hashing." })]
								})
							]
						}),
						wizardStep === 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 bg-zinc-950/60 p-4 sm:p-5 rounded-2xl border border-zinc-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-black uppercase text-emerald-400",
											children: isAr ? "ملف الشركة" : "COMPANY PROFILE"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-black text-zinc-100",
											children: displayName || legalName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-zinc-400",
											children: [
												businessType,
												" • ",
												city,
												", ",
												country
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-zinc-400",
											children: [
												isAr ? "العملة الأساسية:" : "Base Currency:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-amber-400",
													children: baseCurrency
												}),
												" (",
												secondaryCurrencies.join(", "),
												")"
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-black uppercase text-sky-400",
											children: isAr ? "الفرع الرئيسي وحساب المالك" : "MAIN BRANCH & INITIAL OWNER"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm font-black text-zinc-100",
											children: [
												branchName,
												" (",
												branchCode,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-zinc-300",
											children: [
												isAr ? "المالك:" : "Owner:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: ownerName }),
												" (COMPANY_OWNER)"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-zinc-400 font-mono",
											children: ownerUsername || ownerEmail || ownerName
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer text-xs text-zinc-200 font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: launchTourAfterSetup,
									onChange: (e) => setLaunchTourAfterSetup(e.target.checked),
									className: "accent-emerald-500 w-4 h-4"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تشغيل الجولة الإرشادية التفاعلية (13 قسماً) فور إتمام تأسيس الشركة" : "Launch the interactive 13-step Guided Product Tour immediately after company creation" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "wizard-prev-btn",
								onClick: handlePrevStep,
								className: "px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-bold inline-flex items-center gap-2 transition-colors",
								children: [isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: wizardStep === 1 ? isAr ? "العودة للخيارات" : "Back to Options" : isAr ? "السابق" : "Previous" })]
							}), wizardStep < 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "wizard-next-btn",
								onClick: handleNextStep,
								className: "px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs sm:text-sm font-black inline-flex items-center gap-2 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "الخطوة التالية" : "Next Step" }), isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "wizard-submit-company-btn",
								disabled: isSubmitting,
								onClick: handleCreateCompanySubmit,
								className: "px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs sm:text-sm font-black inline-flex items-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSubmitting ? isAr ? "جاري تأسيس الشركة..." : "Creating Company Workspace..." : isAr ? "اعتماد وتأسيس الشركة الآن" : "Confirm & Create Company Workspace" })]
							})]
						})
					]
				})]
			})]
		})
	});
};
// src/components/ui/ViewSkeleton.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var ViewSkeleton = ({ cards = 6 }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "view-skeleton-loader",
		"aria-busy": "true",
		"aria-label": "Loading view",
		className: "flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6 pb-24 animate-pulse",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-7 w-48 rounded-lg bg-neutral-800/80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 w-72 rounded bg-neutral-900" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-36 rounded-xl bg-neutral-800/70" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4",
				children: [
					0,
					1,
					2
				].map((idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800/80 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 w-24 rounded bg-neutral-800" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-4 rounded bg-neutral-800" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-7 w-32 rounded bg-neutral-800/90" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-40 rounded bg-neutral-850" })
					]
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
				children: Array.from({ length: cards }).map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/70 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-11 h-11 rounded-xl bg-neutral-800" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-16 rounded bg-neutral-800" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-3/4 rounded bg-neutral-800" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-1/2 rounded bg-neutral-850" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t border-neutral-800/60 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-20 rounded bg-neutral-800" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-7 w-16 rounded-lg bg-neutral-800" })]
						})
					]
				}, idx))
			})
		]
	});
};
// node_modules/@capacitor/status-bar/dist/esm/definitions.js
var Style;
(function(Style) {
	/**
	* Light text for dark backgrounds.
	*
	* @since 1.0.0
	*/
	Style["Dark"] = "DARK";
	/**
	* Dark text for light backgrounds.
	*
	* @since 1.0.0
	*/
	Style["Light"] = "LIGHT";
	/**
	* The style is based on the device appearance.
	* If the device is using Dark mode, the statusbar text will be light.
	* If the device is using Light mode, the statusbar text will be dark.
	*
	* @since 1.0.0
	*/
	Style["Default"] = "DEFAULT";
})(Style || (Style = {}));
var Animation;
(function(Animation) {
	/**
	* No animation during show/hide.
	*
	* @since 1.0.0
	*/
	Animation["None"] = "NONE";
	/**
	* Slide animation during show/hide.
	* It doesn't work on iOS 15+.
	*
	* @deprecated Use Animation.Fade or Animation.None instead.
	*
	* @since 1.0.0
	*/
	Animation["Slide"] = "SLIDE";
	/**
	* Fade animation during show/hide.
	*
	* @since 1.0.0
	*/
	Animation["Fade"] = "FADE";
})(Animation || (Animation = {}));
// node_modules/@capacitor/status-bar/dist/esm/index.js
var StatusBar = registerPlugin("StatusBar");
// src/App.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var DashboardView = (0, import_react.lazy)(() => __vitePreload(() => import("./DashboardView-BxFZLIyW.js").then((m) => ({ default: m.DashboardView })), __vite__mapDeps([2,3,4,5,1,6,7,8,9,10])));
var ProductsView = (0, import_react.lazy)(() => __vitePreload(() => import("./ProductsView-Czn8GjGF.js").then((m) => ({ default: m.ProductsView })), __vite__mapDeps([11,3,4,5,1,6,7,8])));
var InventoryView = (0, import_react.lazy)(() => __vitePreload(() => import("./InventoryView-Bq18JZfA.js").then((m) => ({ default: m.InventoryView })), __vite__mapDeps([12,3,4,5,1,6,7,8,13])));
var CustomersView = (0, import_react.lazy)(() => __vitePreload(() => import("./CustomersView-CenZiJ_M.js").then((m) => ({ default: m.CustomersView })), __vite__mapDeps([14,3,4,5,1,6,7,8])));
var SalesView = (0, import_react.lazy)(() => __vitePreload(() => import("./SalesView-C6hTxmNK.js").then((m) => ({ default: m.SalesView })), __vite__mapDeps([15,3,4,5,1,6,7,8,13])));
var ExpensesView = (0, import_react.lazy)(() => __vitePreload(() => import("./ExpensesView-BOcFw7re.js").then((m) => ({ default: m.ExpensesView })), __vite__mapDeps([16,3,4,5,1,6,7,8,9,10,17])));
var ReportsView = (0, import_react.lazy)(() => __vitePreload(() => import("./ReportsView-Cy20sbP6.js").then((m) => ({ default: m.ReportsView })), __vite__mapDeps([18,3,4,5,1,6,7,19,8,17])));
var SettingsView = (0, import_react.lazy)(() => __vitePreload(() => import("./SettingsView-CnQbO71r.js").then((m) => ({ default: m.SettingsView })), __vite__mapDeps([20,3,4,5,1,6,7,8,17])));
var TrainingTourOverlay = (0, import_react.lazy)(() => __vitePreload(() => import("./TrainingTourOverlay-BcDtYppT.js").then((m) => ({ default: m.TrainingTourOverlay })), __vite__mapDeps([21,3,4,5,1,6,7])));
var UnmetDemandCaptureModal = (0, import_react.lazy)(() => __vitePreload(() => import("./UnmetDemandCaptureModal-QutYyGVG.js").then((m) => ({ default: m.UnmetDemandCaptureModal })), __vite__mapDeps([22,3,4,5,1,6,7,19])));
function POSAppInner() {
	const { activeTab, setActiveTab, isTrainingTourOpen, trainingTourStepIndex, trainingTourProgress, selectTrainingTourStep, nextTrainingTourStep, prevTrainingTourStep, finishTrainingTour, closeTrainingTour, resetTrainingTour, isUnmetDemandModalOpen } = usePOS();
	const [isMobileCartOpen, setIsMobileCartOpen] = (0, import_react.useState)(false);
	const isMobileCartOpenRef = (0, import_react.useRef)(isMobileCartOpen);
	isMobileCartOpenRef.current = isMobileCartOpen;
	const activeTabRef = (0, import_react.useRef)(activeTab);
	activeTabRef.current = activeTab;
	(0, import_react.useEffect)(() => {
		try {
			StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
			StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
			StatusBar.setBackgroundColor({ color: "#090a0f" }).catch(() => {});
			StatusBar.show().catch(() => {});
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		const handleBackButton = () => {
			if (isMobileCartOpenRef.current) setIsMobileCartOpen(false);
			else if (activeTabRef.current !== "checkout") setActiveTab("checkout");
		};
		window.addEventListener("popstate", handleBackButton);
		return () => {
			window.removeEventListener("popstate", handleBackButton);
		};
	}, [setActiveTab]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PracticeModeBanner, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, { onOpenCart: () => setIsMobileCartOpen(true) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 flex flex-col overflow-x-hidden",
				children: [activeTab === "checkout" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckoutView, {
					isCartDrawerOpen: isMobileCartOpen,
					onCloseCartDrawer: () => setIsMobileCartOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Suspense, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewSkeleton, {}),
					children: [
						activeTab === "dashboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardView, {}),
						activeTab === "products" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductsView, {}),
						activeTab === "inventory" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InventoryView, {}),
						activeTab === "customers" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomersView, {}),
						activeTab === "sales" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SalesView, {}),
						activeTab === "expenses" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpensesView, {}),
						activeTab === "reports" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportsView, {}),
						activeTab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsView, {})
					]
				})]
			}),
			isUnmetDemandModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnmetDemandCaptureModal, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FirstRunOnboardingModal, {}),
			isTrainingTourOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainingTourOverlay, {
					isOpen: isTrainingTourOpen,
					currentStepIndex: trainingTourStepIndex,
					progress: trainingTourProgress,
					onSelectStep: selectTrainingTourStep,
					onNext: nextTrainingTourStep,
					onPrev: prevTrainingTourStep,
					onFinish: finishTrainingTour,
					onClose: closeTrainingTour,
					onResetProgress: resetTrainingTour
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNavigation, {})
		]
	});
}
function App() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(POSProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(POSAppInner, {}) });
}
// src/main.tsx
initRealUserMonitoring();
(0, import_client.createRoot)(document.getElementById("root")).render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {}));
export { loadNotificationLifecycleMap as C, getTranslation as D, TactileButton as E, computeNotificationSummaryCounts as S, AppModal as T, stopInteractiveNativeMLKitScan as _, LiveWifiSyncSection as a, NotificationsBellModal as b, applyWebCameraTrackEnhancements as c, ensureNativeCameraPermission as d, getScannerDiagnostics as f, scanWithNativeMLKit as g, resetScannerFrameSignatureCache as h, parseNormalizedNumber as i, decodeBarcodeFromImageFileWithDiagnostics as l, recordScannerStage as m, HoldToConfirm as n, AppInput as o, isNativeCapacitorEnvironment as p, normalizeNumberInput as r, ScannerDiagnosticsPanel as s, ReceiptModal as t, decodeBarcodeFromVideoElementWithDiagnostics as u, BarcodeValueType as v, saveNotificationLifecycleStatus as w, buildStoreNotificationsList as x, LensFacing as y };
