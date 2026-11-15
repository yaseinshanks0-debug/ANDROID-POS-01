const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/web-C2C3TIwG.js","assets/dist-DBWXrrw4.js","assets/web-Br5jMjt2.js","assets/definitions-6LZk6z8n.js"])))=>i.map(i=>d[i]);
import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { Cn as require_react } from "./vendor-icons-CI9orWhJ.js";
import { a as registerPlugin, t as Capacitor } from "./dist-DBWXrrw4.js";
import { n as NotificationType, t as ImpactStyle } from "./definitions-6LZk6z8n.js";
import { i as require_jsx_runtime } from "./vendor-motion-D4PRzaI1.js";
// src/lib/rbac-capabilities.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var CAPABILITY_GROUPS = [
	{
		groupKey: "dashboard",
		labelEn: "Dashboard",
		labelAr: "لوحة التحكم",
		capabilities: [{
			code: "dashboard.view",
			labelEn: "View Executive Dashboard",
			labelAr: "عرض لوحة التحكم الرئيسية"
		}]
	},
	{
		groupKey: "sales",
		labelEn: "Sales & Checkout",
		labelAr: "المبيعات والكاشير",
		capabilities: [
			{
				code: "sales.view",
				labelEn: "View Sales & Invoices",
				labelAr: "عرض سجل المبيعات والفواتير"
			},
			{
				code: "sales.create",
				labelEn: "Create POS Sales",
				labelAr: "إجراء المبيعات وإصدار الفواتير"
			},
			{
				code: "sales.edit",
				labelEn: "Edit Invoices & Fulfillment",
				labelAr: "تعديل حالة استلام الفواتير"
			},
			{
				code: "sales.cancel",
				labelEn: "Cancel / Void Invoices",
				labelAr: "إلغاء الفواتير",
				sensitive: true
			},
			{
				code: "sales.refund",
				labelEn: "Process Merchandise Refunds",
				labelAr: "تنفيذ مرتجعات المبيعات",
				sensitive: true
			},
			{
				code: "sales.discount",
				labelEn: "Apply Cart & Item Discounts",
				labelAr: "منح الخصومات على السلة والأصناف"
			},
			{
				code: "sales.view_cost",
				labelEn: "View Unit Cost & Margin",
				labelAr: "عرض سعر التكلفة وهامش الربح",
				sensitive: true
			}
		]
	},
	{
		groupKey: "products",
		labelEn: "Products & Catalog",
		labelAr: "المنتجات والباركود",
		capabilities: [
			{
				code: "products.view",
				labelEn: "View Product Catalog",
				labelAr: "عرض دليل المنتجات"
			},
			{
				code: "products.create",
				labelEn: "Create Products & Barcodes",
				labelAr: "إضافة منتجات وباركود جديد"
			},
			{
				code: "products.edit",
				labelEn: "Edit Products & Prices",
				labelAr: "تعديل المنتجات والأسعار"
			},
			{
				code: "products.delete",
				labelEn: "Delete / Archive Products",
				labelAr: "حذف أو أرشفة المنتجات",
				sensitive: true
			}
		]
	},
	{
		groupKey: "inventory",
		labelEn: "Inventory & Stock",
		labelAr: "المخزون والحركات المخزنية",
		capabilities: [
			{
				code: "inventory.view",
				labelEn: "View Stock Levels & Movements",
				labelAr: "عرض أرصدة وحركات المخزون"
			},
			{
				code: "inventory.adjust",
				labelEn: "Record Stock Adjustments & Damage",
				labelAr: "تسجيل تسويات الجرد والتالف"
			},
			{
				code: "inventory.receive",
				labelEn: "Receive Inbound Goods",
				labelAr: "استلام البضائع الواردة"
			},
			{
				code: "inventory.transfer",
				labelEn: "Initiate Branch Stock Transfers",
				labelAr: "تحويل المخزون بين الفروع"
			},
			{
				code: "inventory.approve_adjustments",
				labelEn: "Approve Stock Adjustments",
				labelAr: "اعتماد تسويات المخزون",
				sensitive: true
			}
		]
	},
	{
		groupKey: "purchases",
		labelEn: "Purchasing & Suppliers",
		labelAr: "المشتريات والموردون",
		capabilities: [
			{
				code: "purchases.view",
				labelEn: "View Purchase Orders",
				labelAr: "عرض أوامر وفواتير الشراء"
			},
			{
				code: "purchases.create",
				labelEn: "Create Purchase Orders",
				labelAr: "إنشاء أوامر شراء جديدة"
			},
			{
				code: "purchases.approve",
				labelEn: "Approve Purchase Orders",
				labelAr: "اعتماد أوامر الشراء",
				sensitive: true
			},
			{
				code: "purchases.receive",
				labelEn: "Receive Supplier Shipments",
				labelAr: "استلام شحنات الموردين"
			},
			{
				code: "suppliers.manage",
				labelEn: "Manage Suppliers Directory",
				labelAr: "إدارة بيانات الموردين"
			}
		]
	},
	{
		groupKey: "customers",
		labelEn: "Customers & Receivables",
		labelAr: "العملاء والديون",
		capabilities: [
			{
				code: "customers.view",
				labelEn: "View Customer Directory",
				labelAr: "عرض سجل العملاء"
			},
			{
				code: "customers.create",
				labelEn: "Create New Customers",
				labelAr: "إضافة عملاء جدد"
			},
			{
				code: "customers.edit",
				labelEn: "Edit Customer Profiles",
				labelAr: "تعديل بيانات العملاء"
			},
			{
				code: "customers.view_debts",
				labelEn: "View & Settle Customer Debts",
				labelAr: "عرض وتسديد ديون العملاء"
			}
		]
	},
	{
		groupKey: "accounting",
		labelEn: "Accounting & Finance",
		labelAr: "المحاسبة والمالية",
		capabilities: [
			{
				code: "accounting.view",
				labelEn: "View Accounting Ledger",
				labelAr: "عرض الدفتر المحاسبي"
			},
			{
				code: "accounting.create_expense",
				labelEn: "Record Operating Expenses",
				labelAr: "تسجيل المصروفات التشغيلية"
			},
			{
				code: "accounting.manage_payables",
				labelEn: "Manage Supplier Payables",
				labelAr: "إدارة مستحقات الموردين"
			},
			{
				code: "accounting.manage_receivables",
				labelEn: "Manage Customer Receivables",
				labelAr: "إدارة الذمم المدينة والتحصيل"
			},
			{
				code: "accounting.view_financial_reports",
				labelEn: "View P&L & Financial Statements",
				labelAr: "عرض قائمة الدخل والتقارير المالية",
				sensitive: true
			}
		]
	},
	{
		groupKey: "analytics",
		labelEn: "Analytics & Forecasting",
		labelAr: "التحليلات والتوقعات الذكية",
		capabilities: [
			{
				code: "analytics.view",
				labelEn: "View Operational Analytics",
				labelAr: "عرض التحليلات التشغيلية"
			},
			{
				code: "analytics.financial.view",
				labelEn: "View Financial & Margin Analytics",
				labelAr: "عرض التحليلات المالية والهوامش",
				sensitive: true
			},
			{
				code: "analytics.inventory.view",
				labelEn: "View Inventory & Demand Analytics",
				labelAr: "عرض تحليلات المخزون والطلب"
			},
			{
				code: "analytics.export",
				labelEn: "Export Analytics & CSV Reports",
				labelAr: "تصدير التقارير والبيانات (CSV)"
			}
		]
	},
	{
		groupKey: "intelligence",
		labelEn: "Intelligence Center & Alerts",
		labelAr: "مركز الذكاء ودورة حياة التنبيهات",
		capabilities: [
			{
				code: "intelligence.view",
				labelEn: "View Smart Alerts & Recommendations",
				labelAr: "عرض التنبيهات والتوصيات الذكية"
			},
			{
				code: "intelligence.acknowledge",
				labelEn: "Acknowledge Alerts",
				labelAr: "تأكيد الاطلاع والمتابعة للتنبيهات"
			},
			{
				code: "intelligence.resolve",
				labelEn: "Resolve Alerts & Recommendations",
				labelAr: "إغلاق وحل التنبيهات مع التوثيق"
			},
			{
				code: "intelligence.dismiss",
				labelEn: "Dismiss Non-Actionable Alerts",
				labelAr: "استبعاد التنبيهات غير اللازمة"
			},
			{
				code: "intelligence.reopen",
				labelEn: "Reopen Resolved/Dismissed Items",
				labelAr: "إعادة فتح التنبيهات المغلقة",
				sensitive: true
			}
		]
	},
	{
		groupKey: "users",
		labelEn: "Users & Access Control",
		labelAr: "المستخدمون والصلاحيات",
		capabilities: [
			{
				code: "users.view",
				labelEn: "View Employee Directory & Sessions",
				labelAr: "عرض قائمة الموظفين والجلسات"
			},
			{
				code: "users.create",
				labelEn: "Create Employee Accounts",
				labelAr: "إنشاء حسابات موظفين جديدة",
				sensitive: true
			},
			{
				code: "users.edit",
				labelEn: "Edit Employee Profiles & Branches",
				labelAr: "تعديل بيانات وفروع الموظفين",
				sensitive: true
			},
			{
				code: "users.deactivate",
				labelEn: "Activate / Deactivate Employees",
				labelAr: "تفعيل أو إيقاف حسابات الموظفين",
				sensitive: true
			},
			{
				code: "roles.manage",
				labelEn: "Assign & Manage Roles",
				labelAr: "إدارة وتعيين الأدوار الوظيفية",
				sensitive: true
			},
			{
				code: "permissions.manage",
				labelEn: "Customize Granular Permissions",
				labelAr: "تخصيص الصلاحيات التفصيلية",
				sensitive: true
			}
		]
	},
	{
		groupKey: "company",
		labelEn: "Company, Branches & Currencies",
		labelAr: "إعدادات الشركة والفروع والعملات",
		capabilities: [
			{
				code: "company.view",
				labelEn: "View Company Profile & Settings",
				labelAr: "عرض ملف وإعدادات الشركة"
			},
			{
				code: "company.edit",
				labelEn: "Edit Company Profile & Tax Policy",
				labelAr: "تعديل بيانات الشركة والضرائب",
				sensitive: true
			},
			{
				code: "company.currency.manage",
				labelEn: "Manage Currencies & Exchange Rates",
				labelAr: "إدارة العملات وأسعار الصرف",
				sensitive: true
			},
			{
				code: "company.branches.manage",
				labelEn: "Create & Manage Company Branches",
				labelAr: "إنشاء وإدارة فروع الشركة",
				sensitive: true
			}
		]
	},
	{
		groupKey: "backup",
		labelEn: "Backup, Restore & Data Migration",
		labelAr: "النسخ الاحتياطي والاستعادة والدمج الذكي",
		capabilities: [
			{
				code: "backup.view",
				labelEn: "View Backups, Checkpoints & Manifests",
				labelAr: "عرض النسخ الاحتياطية ونقاط الاستعادة"
			},
			{
				code: "backup.create",
				labelEn: "Create Full & Selective Backups",
				labelAr: "إنشاء نسخ احتياطية كاملة أو انتقائية",
				sensitive: true
			},
			{
				code: "backup.download",
				labelEn: "Download Backup Packages",
				labelAr: "تنزيل ملفات النسخ الاحتياطي (.backup)",
				sensitive: true
			},
			{
				code: "backup.restore",
				labelEn: "Restore Company Backup",
				labelAr: "استعادة النسخة الاحتياطية للشركة",
				sensitive: true
			},
			{
				code: "backup.import",
				labelEn: "Import & Inspect External Backups",
				labelAr: "استيراد وفحص ملفات النسخ الاحتياطي",
				sensitive: true
			},
			{
				code: "backup.merge",
				labelEn: "Execute Intelligent Data Merge",
				labelAr: "تنفيذ الدمج الذكي للبيانات ومعالجة التعارضات",
				sensitive: true
			},
			{
				code: "backup.manage",
				labelEn: "Manage Encryption & Recovery Checkpoints",
				labelAr: "إدارة تشفير النسخ الاحتياطية ونقاط الاستعادة",
				sensitive: true
			},
			{
				code: "backup.delete",
				labelEn: "Delete Stored Backup Checkpoints",
				labelAr: "حذف النسخ الاحتياطية المخزنة",
				sensitive: true
			}
		]
	}
];
var ALL_CAPABILITY_CODES = CAPABILITY_GROUPS.flatMap((g) => g.capabilities.map((c) => c.code));
var SYSTEM_ROLE_DEFINITIONS = [
	{
		code: "COMPANY_OWNER",
		legacyRole: "admin",
		labelEn: "Company Owner",
		labelAr: "مالك الشركة (صلاحيات مطلقة)",
		descriptionEn: "Full administrative control over company profile, branches, currencies, users, and financial intelligence.",
		descriptionAr: "تحكم كامل بملف الشركة، الفروع، العملات، الموظفين، الصلاحيات، والتقارير المالية.",
		badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
		defaultCapabilities: [...ALL_CAPABILITY_CODES]
	},
	{
		code: "ADMIN",
		legacyRole: "admin",
		labelEn: "System Administrator",
		labelAr: "مدير النظام",
		descriptionEn: "Full operational and user management access across all branches.",
		descriptionAr: "صلاحيات إدارية وتشغيلية شاملة عبر جميع الفروع والمستخدمين.",
		badgeClass: "bg-amber-500/15 text-amber-200 border-amber-500/30",
		defaultCapabilities: [...ALL_CAPABILITY_CODES]
	},
	{
		code: "MANAGER",
		legacyRole: "manager",
		labelEn: "Branch / Store Manager",
		labelAr: "مدير فرع / متجر",
		descriptionEn: "Manages daily store operations, pricing, inventory, refunds, exchange rates, and intelligence workflows.",
		descriptionAr: "إدارة العمليات اليومية، التسعير، المخزون، المرتجعات، أسعار الصرف، ومركز الذكاء.",
		badgeClass: "bg-sky-500/20 text-sky-300 border-sky-500/40",
		defaultCapabilities: ALL_CAPABILITY_CODES.filter((c) => c !== "roles.manage" && c !== "permissions.manage" && c !== "company.branches.manage" && c !== "users.deactivate" && c !== "backup.restore" && c !== "backup.merge" && c !== "backup.manage" && c !== "backup.delete")
	},
	{
		code: "CASHIER",
		legacyRole: "cashier",
		labelEn: "Sales Cashier",
		labelAr: "كاشير مبيعات",
		descriptionEn: "Executes POS checkout, barcode scanning, customer selection, debt collection, and unmet demand logging.",
		descriptionAr: "إجراء عمليات البيع، مسح الباركود، تحصيل دفعات العملاء، وتسجيل الطلبات غير المتوفرة.",
		badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
		defaultCapabilities: [
			"dashboard.view",
			"sales.view",
			"sales.create",
			"sales.edit",
			"sales.discount",
			"products.view",
			"customers.view",
			"customers.create",
			"customers.edit",
			"customers.view_debts",
			"intelligence.view",
			"intelligence.acknowledge",
			"company.view"
		]
	},
	{
		code: "INVENTORY_MANAGER",
		legacyRole: "inventory_clerk",
		labelEn: "Inventory Manager",
		labelAr: "مدير المخزون والمستودع",
		descriptionEn: "Controls product catalog, barcodes, stock adjustments, inbound goods receipts, and branch transfers.",
		descriptionAr: "إدارة المنتجات والباركود، الجرد المخزني، استلام البضائع، والتحويلات بين الفروع.",
		badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/40",
		defaultCapabilities: [
			"dashboard.view",
			"products.view",
			"products.create",
			"products.edit",
			"inventory.view",
			"inventory.adjust",
			"inventory.receive",
			"inventory.transfer",
			"inventory.approve_adjustments",
			"purchases.view",
			"purchases.receive",
			"analytics.view",
			"analytics.inventory.view",
			"intelligence.view",
			"intelligence.acknowledge",
			"intelligence.resolve",
			"company.view"
		]
	},
	{
		code: "ACCOUNTANT",
		legacyRole: "manager",
		labelEn: "Accountant & Financial Auditor",
		labelAr: "محاسب ومدقق مالي",
		descriptionEn: "Audits sales, COGS, profit margins, expenses, receivables/payables, and multi-currency exchange rates.",
		descriptionAr: "مراجعة المبيعات، تكلفة البضاعة، الأرباح، المصروفات، الديون، وتقارير العملات.",
		badgeClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
		defaultCapabilities: [
			"dashboard.view",
			"sales.view",
			"sales.view_cost",
			"products.view",
			"inventory.view",
			"purchases.view",
			"customers.view",
			"customers.view_debts",
			"accounting.view",
			"accounting.create_expense",
			"accounting.manage_payables",
			"accounting.manage_receivables",
			"accounting.view_financial_reports",
			"analytics.view",
			"analytics.financial.view",
			"analytics.inventory.view",
			"analytics.export",
			"intelligence.view",
			"company.view",
			"company.currency.manage"
		]
	},
	{
		code: "PURCHASING_MANAGER",
		legacyRole: "inventory_clerk",
		labelEn: "Purchasing & Supply Manager",
		labelAr: "مدير المشتريات والتوريد",
		descriptionEn: "Manages suppliers, purchase orders, inbound stock receipts, cost prices, and replenishment recommendations.",
		descriptionAr: "إدارة الموردين وأوامر الشراء واستلام البضائع وتوصيات إعادة التزويد.",
		badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		defaultCapabilities: [
			"dashboard.view",
			"sales.view_cost",
			"products.view",
			"products.create",
			"products.edit",
			"inventory.view",
			"inventory.receive",
			"purchases.view",
			"purchases.create",
			"purchases.approve",
			"purchases.receive",
			"suppliers.manage",
			"analytics.view",
			"analytics.inventory.view",
			"intelligence.view",
			"intelligence.acknowledge",
			"intelligence.resolve",
			"company.view"
		]
	},
	{
		code: "REPORT_VIEWER",
		legacyRole: "cashier",
		labelEn: "Report & Analytics Viewer",
		labelAr: "مستعرض التقارير والتحليلات",
		descriptionEn: "Read-only access to dashboards, operational analytics, inventory health, and intelligence reports.",
		descriptionAr: "صلاحية قراءة فقط للوحات التحكم، التحليلات التشغيلية، وتقارير الأداء.",
		badgeClass: "bg-neutral-700/40 text-neutral-300 border-neutral-600/50",
		defaultCapabilities: [
			"dashboard.view",
			"sales.view",
			"products.view",
			"inventory.view",
			"purchases.view",
			"customers.view",
			"analytics.view",
			"analytics.inventory.view",
			"intelligence.view",
			"company.view"
		]
	},
	{
		code: "CUSTOM_ROLE",
		legacyRole: "cashier",
		labelEn: "Custom Role",
		labelAr: "دور مخصص",
		descriptionEn: "Tailored capability set configured per employee.",
		descriptionAr: "مجموعة صلاحيات مخصصة يتم تحديدها حسب مهام الموظف.",
		badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/40",
		defaultCapabilities: [
			"dashboard.view",
			"sales.view",
			"products.view",
			"company.view"
		]
	}
];
function normalizeSystemRoleCode(roleCodeOrLegacy) {
	const upper = (roleCodeOrLegacy || "").trim().toUpperCase();
	const matched = SYSTEM_ROLE_DEFINITIONS.find((r) => r.code === upper);
	if (matched) return matched.code;
	switch ((roleCodeOrLegacy || "").trim().toLowerCase()) {
		case "owner":
		case "company_owner": return "COMPANY_OWNER";
		case "admin": return "ADMIN";
		case "manager": return "MANAGER";
		case "inventory_clerk":
		case "inventory_manager": return "INVENTORY_MANAGER";
		case "accountant": return "ACCOUNTANT";
		case "purchasing_manager": return "PURCHASING_MANAGER";
		case "report_viewer": return "REPORT_VIEWER";
		case "custom_role": return "CUSTOM_ROLE";
		default: return "CASHIER";
	}
}
function mapLegacyRoleToSystemRole(roleCodeOrLegacy) {
	return normalizeSystemRoleCode(roleCodeOrLegacy);
}
function mapSystemRoleToLegacyRole(systemRole) {
	const normalized = normalizeSystemRoleCode(systemRole);
	const found = SYSTEM_ROLE_DEFINITIONS.find((r) => r.code === normalized);
	return found ? found.legacyRole : "cashier";
}
function getDefaultCapabilitiesForRole(roleCodeOrLegacy) {
	const code = normalizeSystemRoleCode(roleCodeOrLegacy);
	const found = SYSTEM_ROLE_DEFINITIONS.find((r) => r.code === code);
	return found ? [...found.defaultCapabilities] : [...SYSTEM_ROLE_DEFINITIONS[3].defaultCapabilities];
}
function deriveLegacyPermissionsFromCapabilities(capabilities) {
	const set = new Set(capabilities);
	return {
		canCheckout: set.has("sales.create"),
		canApplyDiscounts: set.has("sales.discount"),
		canManageProducts: set.has("products.create") || set.has("products.edit"),
		canEditPrices: set.has("products.edit") || set.has("sales.view_cost"),
		canManageInventory: set.has("inventory.adjust") || set.has("inventory.receive") || set.has("inventory.transfer"),
		canVoidTransactions: set.has("sales.cancel") || set.has("sales.refund"),
		canManageExchangeRates: set.has("company.currency.manage"),
		canViewReports: set.has("analytics.view") || set.has("accounting.view_financial_reports") || set.has("analytics.financial.view"),
		canManageUsers: set.has("users.create") || set.has("users.edit") || set.has("roles.manage") || set.has("permissions.manage")
	};
}
function deriveCapabilitiesFromUser(user) {
	if (!user) return [];
	if (Array.isArray(user.capabilities) && user.capabilities.length > 0) return Array.from(new Set(user.capabilities));
	const base = new Set(getDefaultCapabilitiesForRole(user.systemRole || user.role));
	if (user.permissions) {
		if (user.permissions.canCheckout) base.add("sales.create");
		else base.delete("sales.create");
		if (user.permissions.canApplyDiscounts) base.add("sales.discount");
		else base.delete("sales.discount");
		if (user.permissions.canManageProducts) {
			base.add("products.create");
			base.add("products.edit");
		}
		if (user.permissions.canEditPrices) {
			base.add("products.edit");
			base.add("sales.view_cost");
		}
		if (user.permissions.canManageInventory) {
			base.add("inventory.adjust");
			base.add("inventory.receive");
		}
		if (user.permissions.canVoidTransactions) {
			base.add("sales.cancel");
			base.add("sales.refund");
		}
		if (user.permissions.canManageExchangeRates) base.add("company.currency.manage");
		else base.delete("company.currency.manage");
		if (user.permissions.canViewReports) {
			base.add("analytics.view");
			base.add("accounting.view_financial_reports");
			base.add("analytics.financial.view");
		}
		if (user.permissions.canManageUsers) {
			base.add("users.view");
			base.add("users.create");
			base.add("users.edit");
			base.add("roles.manage");
			base.add("permissions.manage");
		}
	}
	return Array.from(base);
}
function userHasCapability(user, capability) {
	if (!user || user.isActive === false) return false;
	if (normalizeSystemRoleCode(user.systemRole || user.role) === "COMPANY_OWNER") return true;
	return deriveCapabilitiesFromUser(user).includes(capability);
}
// src/lib/initial-data.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var DEFAULT_ROLE_PERMISSIONS = {
	admin: {
		canCheckout: true,
		canManageProducts: true,
		canEditPrices: true,
		canManageInventory: true,
		canVoidTransactions: true,
		canManageExchangeRates: true,
		canViewReports: true,
		canManageUsers: true,
		canApplyDiscounts: true
	},
	manager: {
		canCheckout: true,
		canManageProducts: true,
		canEditPrices: true,
		canManageInventory: true,
		canVoidTransactions: true,
		canManageExchangeRates: true,
		canViewReports: true,
		canManageUsers: false,
		canApplyDiscounts: true
	},
	cashier: {
		canCheckout: true,
		canManageProducts: false,
		canEditPrices: false,
		canManageInventory: false,
		canVoidTransactions: false,
		canManageExchangeRates: false,
		canViewReports: false,
		canManageUsers: false,
		canApplyDiscounts: true
	},
	inventory_clerk: {
		canCheckout: false,
		canManageProducts: true,
		canEditPrices: false,
		canManageInventory: true,
		canVoidTransactions: false,
		canManageExchangeRates: false,
		canViewReports: false,
		canManageUsers: false,
		canApplyDiscounts: false
	}
};
var INITIAL_USERS = [
	{
		id: "user-1",
		name: "Ahmed Al-Amin",
		nameAr: "أحمد الأمين (المدير العام)",
		role: "admin",
		pin: "1111",
		terminalName: "POS Terminal 01 (Main)",
		terminalNameAr: "كاشير 1 (الرئيسي)",
		avatarColor: "#f59e0b",
		isActive: true,
		permissions: { ...DEFAULT_ROLE_PERMISSIONS.admin },
		lastActiveAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "user-2",
		name: "Sara Khalid",
		nameAr: "سارة خالد (مشرف المبيعات)",
		role: "manager",
		pin: "2222",
		terminalName: "POS Terminal 02 (Counter B)",
		terminalNameAr: "كاشير 2 (نقطة بيع ب)",
		avatarColor: "#10b981",
		isActive: true,
		permissions: { ...DEFAULT_ROLE_PERMISSIONS.manager },
		lastActiveAt: (/* @__PURE__ */ new Date(Date.now() - 12e4)).toISOString()
	},
	{
		id: "user-3",
		name: "Omer Hassan",
		nameAr: "عمر حسن (كاشير مبيعات)",
		role: "cashier",
		pin: "3333",
		terminalName: "POS Terminal 03 (Express)",
		terminalNameAr: "كاشير 3 (المبيعات السريعة)",
		avatarColor: "#3b82f6",
		isActive: true,
		permissions: { ...DEFAULT_ROLE_PERMISSIONS.cashier },
		lastActiveAt: (/* @__PURE__ */ new Date(Date.now() - 3e5)).toISOString()
	},
	{
		id: "user-4",
		name: "Mustafa Osman",
		nameAr: "مصطفى عثمان (أمين المخزن)",
		role: "inventory_clerk",
		pin: "4444",
		terminalName: "Warehouse Terminal 04",
		terminalNameAr: "جهاز المخزن 4",
		avatarColor: "#a855f7",
		isActive: true,
		permissions: { ...DEFAULT_ROLE_PERMISSIONS.inventory_clerk },
		lastActiveAt: (/* @__PURE__ */ new Date(Date.now() - 72e4)).toISOString()
	}
];
var INITIAL_ACTIVE_SESSIONS = [
	{
		sessionId: "sess-term-1",
		userId: "user-1",
		userName: "Ahmed Al-Amin",
		userNameAr: "أحمد الأمين (المدير العام)",
		role: "admin",
		terminalName: "POS Terminal 01 (Main)",
		terminalNameAr: "كاشير 1 (الرئيسي)",
		startedAt: (/* @__PURE__ */ new Date(Date.now() - 108e5)).toISOString(),
		lastPingAt: (/* @__PURE__ */ new Date()).toISOString(),
		status: "online"
	},
	{
		sessionId: "sess-term-2",
		userId: "user-2",
		userName: "Sara Khalid",
		userNameAr: "سارة خالد (مشرف المبيعات)",
		role: "manager",
		terminalName: "POS Terminal 02 (Counter B)",
		terminalNameAr: "كاشير 2 (نقطة بيع ب)",
		startedAt: (/* @__PURE__ */ new Date(Date.now() - 57e5)).toISOString(),
		lastPingAt: (/* @__PURE__ */ new Date(Date.now() - 4e4)).toISOString(),
		status: "online"
	},
	{
		sessionId: "sess-term-3",
		userId: "user-3",
		userName: "Omer Hassan",
		userNameAr: "عمر حسن (كاشير مبيعات)",
		role: "cashier",
		terminalName: "POS Terminal 03 (Express)",
		terminalNameAr: "كاشير 3 (المبيعات السريعة)",
		startedAt: (/* @__PURE__ */ new Date(Date.now() - 36e5)).toISOString(),
		lastPingAt: (/* @__PURE__ */ new Date(Date.now() - 9e4)).toISOString(),
		status: "online"
	}
];
var INITIAL_SETTINGS = {
	storeName: "Dqnamo Artisan Roasters & Deli",
	storeNameAr: "محمصة ومخبز دينامو الحرفي",
	storeLogo: "",
	address: "42 Market Street, London / Riyadh",
	addressAr: "شارع السوق التجاري، الرياض",
	taxNumber: "GB-942851029 / 300482910400003",
	phone: "+1 (555) 019-2834",
	receiptFooter: "Thank you for shopping with us! Freshly brewed every day.",
	receiptFooterAr: "شكراً لزيارتكم! يسعدنا خدمتكم دائماً.",
	currency: "SDG",
	exchangeRates: {
		SDG: 1,
		USD: 2700,
		SAR: 720,
		AED: 735,
		EUR: 2950,
		GBP: 3450
	},
	taxRatePercent: 8.5,
	isTaxInclusive: false,
	soundEnabled: true,
	hapticsEnabled: true,
	theme: "dark",
	language: "en"
};
var INITIAL_PRODUCTS = [
	{
		id: "prod-1",
		serialNumber: 1,
		name: "Espresso Double Shot",
		nameAr: "إسبريسو دبل شوت",
		description: "Rich double shot specialty Arabica espresso extracted at 9 bars",
		descriptionAr: "قهوة إسبريسو دبل شوت مركزة من بن أرابيكا الفاخر المحمص طازجاً",
		sku: "BEV-001",
		barcode: "200101001011",
		category: "Coffee & Drinks",
		categoryAr: "القهوة والمشروبات",
		costPrice: .85,
		sellingPrice: 3.75,
		previousCostPrice: .75,
		previousSellingPrice: 3.25,
		priceUpdatedAt: "2026-10-25T10:15:00.000Z",
		priceHistory: [{
			id: "ph-prod-1-2",
			timestamp: "2026-10-25T10:15:00.000Z",
			previousCostPrice: .75,
			newCostPrice: .85,
			previousSellingPrice: 3.25,
			newSellingPrice: 3.75,
			currency: "SDG",
			changedBy: "أحمد الأمين (المدير العام)"
		}, {
			id: "ph-prod-1-1",
			timestamp: "2026-09-10T08:00:00.000Z",
			previousCostPrice: .75,
			newCostPrice: .75,
			previousSellingPrice: 3.25,
			newSellingPrice: 3.25,
			currency: "SDG",
			changedBy: "أحمد الأمين (المدير العام)",
			note: "Initial price / السعر الابتدائي"
		}],
		modificationHistory: [{
			id: "mod-prod-1-2",
			timestamp: "2026-10-25T10:15:00.000Z",
			action: "price_changed",
			summaryEn: "Selling Price: 3.25 → 3.75 SDG • Cost Price: 0.75 → 0.85 SDG",
			summaryAr: "سعر البيع: 3.25 ← 3.75 SDG • سعر التكلفة: 0.75 ← 0.85 SDG",
			changedFields: ["sellingPrice", "costPrice"],
			changedBy: "أحمد الأمين (المدير العام)"
		}, {
			id: "mod-prod-1-1",
			timestamp: "2026-09-10T08:00:00.000Z",
			action: "created",
			summaryEn: "Product created with selling price 3.25 SDG",
			summaryAr: "تمت إضافة المنتج بسعر بيع 3.25 SDG",
			changedFields: ["created"],
			changedBy: "أحمد الأمين (المدير العام)"
		}],
		stock: 45,
		minStockAlert: 10,
		emoji: "☕",
		colorHex: "#d97706",
		createdAt: "2026-09-10T08:00:00.000Z",
		updatedAt: "2026-10-25T10:15:00.000Z"
	},
	{
		id: "prod-2",
		serialNumber: 2,
		name: "Oat Milk Flat White",
		nameAr: "فلات وايت بحليب الشوفان",
		description: "Velvety micro-foam organic oat milk poured over doubleristretto",
		descriptionAr: "مشروب فلات وايت بحليب الشوفان العضوي النباتي ورغوة ناعمة",
		sku: "BEV-002",
		barcode: "200101001028",
		category: "Coffee & Drinks",
		categoryAr: "القهوة والمشروبات",
		costPrice: 1.2,
		sellingPrice: 4.85,
		stock: 32,
		minStockAlert: 8,
		emoji: "🥛",
		colorHex: "#b45309",
		createdAt: "2026-09-12T09:30:00.000Z",
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "prod-3",
		serialNumber: 3,
		name: "Cold Brew Reserve (Bottle)",
		nameAr: "كولد برو منقوع بارد (قارورة)",
		description: "18-hour slow-steeped single origin cold brew coffee glass bottle 300ml",
		descriptionAr: "قهوة كولد برو مقطرة على البارد لمدة 18 ساعة في قارورة زجاجية 300 مل",
		sku: "BEV-003",
		barcode: "200101001035",
		category: "Coffee & Drinks",
		categoryAr: "القهوة والمشروبات",
		costPrice: 1.8,
		sellingPrice: 5.5,
		stock: 6,
		minStockAlert: 10,
		emoji: "🧊",
		colorHex: "#78350f",
		createdAt: "2026-09-14T11:00:00.000Z",
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "prod-4",
		serialNumber: 4,
		name: "Butter Croissant French",
		nameAr: "كرواسون الزبدة الفرنسي",
		description: "Flaky laminated French pastry baked with Normandy cultured butter",
		descriptionAr: "كرواسون فرنسي هش مخبوز بالزبدة الطبيعية الطازجة يومياً",
		sku: "BAK-001",
		barcode: "200201002018",
		category: "Bakery",
		categoryAr: "المخبوزات والحلويات",
		costPrice: 1.1,
		sellingPrice: 3.95,
		stock: 18,
		minStockAlert: 5,
		emoji: "🥐",
		colorHex: "#ea580c",
		createdAt: "2026-09-15T07:45:00.000Z",
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "prod-5",
		serialNumber: 5,
		name: "Pistachio Cardamom Bun",
		nameAr: "لفافة الفستق والهيل",
		description: "Swirled brioche bun glazed with roasted green pistachio and aromatic cardamom",
		descriptionAr: "لفافة بريوش محشوة ومغطاة بالفستق الحلبي المحمص والهيل العربي الفاخر",
		sku: "BAK-002",
		barcode: "200201002025",
		category: "Bakery",
		categoryAr: "المخبوزات والحلويات",
		costPrice: 1.6,
		sellingPrice: 4.75,
		stock: 3,
		minStockAlert: 6,
		emoji: "🧁",
		colorHex: "#10b981",
		createdAt: "2026-09-18T10:20:00.000Z",
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "prod-6",
		serialNumber: 6,
		name: "Smoked Salmon Sourdough Bagel",
		nameAr: "بيغل السلمون المدخن",
		description: "Artisan sesame sourdough bagel with Scottish smoked salmon, capers and cream cheese",
		descriptionAr: "خبز بيغل بالعجين المخمر والسمسم مع شرائح السلمون المدخن والجبن الكريمي",
		sku: "DEL-001",
		barcode: "200301003015",
		category: "Deli & Meals",
		categoryAr: "الساندويتشات والوجبات",
		costPrice: 3.5,
		sellingPrice: 8.95,
		stock: 14,
		minStockAlert: 5,
		emoji: "🥯",
		colorHex: "#f43f5e",
		createdAt: "2026-09-20T12:00:00.000Z",
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "prod-7",
		serialNumber: 7,
		name: "Truffle Grilled Cheese",
		nameAr: "ساندويتش الجبن المشوي بالكمأة",
		description: "Toasted country sourdough panini with aged cheddar, gruyere, and black truffle oil",
		descriptionAr: "ساندويتش جبن شيدر وغرويير مشوي على خبز ريفي مع زيت الكمأة السوداء",
		sku: "DEL-002",
		barcode: "200301003022",
		category: "Deli & Meals",
		categoryAr: "الساندويتشات والوجبات",
		costPrice: 2.8,
		sellingPrice: 7.5,
		stock: 22,
		minStockAlert: 5,
		emoji: "🥪",
		colorHex: "#eab308",
		createdAt: "2026-09-22T13:15:00.000Z",
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "prod-8",
		serialNumber: 8,
		name: "Ethiopia Yirgacheffe Beans 250g",
		nameAr: "حبوب إثيوبيا ييرغاتشيف 250 جم",
		description: "Whole bean washed process specialty coffee with jasmine, bergamot, and peach notes",
		descriptionAr: "بن قهوة مختصة إثيوبي ييرغاتشيف مجفف ومغسول بإيحاءات الياسمين والخوخ 250 جرام",
		sku: "RET-001",
		barcode: "200401004012",
		category: "Packaged Retail",
		categoryAr: "منتجات التجزئة والبن",
		costPrice: 7,
		sellingPrice: 18,
		previousCostPrice: 6.2,
		previousSellingPrice: 16.5,
		priceUpdatedAt: "2026-10-22T16:40:00.000Z",
		priceHistory: [{
			id: "ph-prod-8-1",
			timestamp: "2026-10-22T16:40:00.000Z",
			previousCostPrice: 6.2,
			newCostPrice: 7,
			previousSellingPrice: 16.5,
			newSellingPrice: 18,
			currency: "SDG",
			changedBy: "سارة خالد (مشرف المبيعات)"
		}],
		modificationHistory: [{
			id: "mod-prod-8-1",
			timestamp: "2026-10-22T16:40:00.000Z",
			action: "price_changed",
			summaryEn: "Selling Price: 16.5 → 18 SDG • Cost Price: 6.2 → 7 SDG",
			summaryAr: "سعر البيع: 16.5 ← 18 SDG • سعر التكلفة: 6.2 ← 7 SDG",
			changedFields: ["sellingPrice", "costPrice"],
			changedBy: "سارة خالد (مشرف المبيعات)"
		}],
		stock: 15,
		minStockAlert: 4,
		emoji: "🫘",
		colorHex: "#854d0e",
		createdAt: "2026-09-25T15:00:00.000Z",
		updatedAt: "2026-10-22T16:40:00.000Z"
	},
	{
		id: "prod-9",
		serialNumber: 9,
		name: "Ceramic Tactile Tumbler 350ml",
		nameAr: "كوب سيراميك ملموس 350 مل",
		description: "Handcrafted matte stoneware thermal coffee tumbler with leak-proof lid",
		descriptionAr: "كوب قهوة سيراميك حراري مصنوع يدوياً بغطاء محكم لحفظ الحرارة 350 مل",
		sku: "MER-001",
		barcode: "200501005019",
		category: "Merchandise",
		categoryAr: "الإكسسوارات والهدايا",
		costPrice: 9.5,
		sellingPrice: 24,
		stock: 8,
		minStockAlert: 3,
		emoji: "🏺",
		colorHex: "#64748b",
		createdAt: "2026-09-28T11:30:00.000Z",
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "prod-10",
		serialNumber: 10,
		name: "Natural Hair Dye (Pack = 8 Strips)",
		nameAr: "صبغة شعر طبيعية (الباكو 8 أشرطة)",
		description: "Herbal ammonia-free black henna hair dye sold by individual strip or full 8-strip pack",
		descriptionAr: "صبغة شعر حناء طبيعية سوداء خالية من الأمونيا تباع بالشريط المفرد أو الباكو الكامل (8 أشرطة)",
		sku: "COS-008",
		barcode: "200801008018",
		barcodes: ["200801008018", "200801008088"],
		category: "Packaged Retail",
		categoryAr: "منتجات التجزئة والبن",
		costPrice: .75,
		sellingPrice: 1.5,
		previousCostPrice: .65,
		previousSellingPrice: 1.25,
		priceUpdatedAt: "2026-10-27T14:20:00.000Z",
		priceHistory: [{
			id: "ph-prod-10-2",
			timestamp: "2026-10-27T14:20:00.000Z",
			previousCostPrice: .65,
			newCostPrice: .75,
			previousSellingPrice: 1.25,
			newSellingPrice: 1.5,
			currency: "SDG",
			changedBy: "أحمد الأمين (المدير العام)"
		}, {
			id: "ph-prod-10-1",
			timestamp: "2026-10-01T09:00:00.000Z",
			previousCostPrice: .65,
			newCostPrice: .65,
			previousSellingPrice: 1.25,
			newSellingPrice: 1.25,
			currency: "SDG",
			changedBy: "أحمد الأمين (المدير العام)",
			note: "Initial price / السعر الابتدائي"
		}],
		modificationHistory: [{
			id: "mod-prod-10-2",
			timestamp: "2026-10-27T14:20:00.000Z",
			action: "price_changed",
			summaryEn: "Selling Price: 1.25 → 1.5 SDG • Pack Selling Price updated to 11.5 SDG",
			summaryAr: "سعر البيع للشريط: 1.25 ← 1.5 SDG • تحديث سعر الباكو (8 أشرطة) إلى 11.5 SDG",
			changedFields: ["sellingPrice", "costPrice"],
			changedBy: "أحمد الأمين (المدير العام)"
		}, {
			id: "mod-prod-10-1",
			timestamp: "2026-10-01T09:00:00.000Z",
			action: "created",
			summaryEn: "Product created with multi-unit packaging (1 Pack = 8 Strips)",
			summaryAr: "تمت إضافة المنتج مع تخصيص البيع بالشريط أو الباكو (1 باكو = 8 أشرطة)",
			changedFields: ["created"],
			changedBy: "أحمد الأمين (المدير العام)"
		}],
		stock: 48,
		minStockAlert: 8,
		enablePackaging: true,
		unitName: "Strip",
		unitNameAr: "شريط",
		packName: "Pack",
		packNameAr: "باكو",
		unitsPerPack: 8,
		defaultSaleUnit: "unit",
		allowedSaleUnits: "both",
		packCostPrice: 6,
		packSellingPrice: 11.5,
		emoji: "🎨",
		colorHex: "#a855f7",
		customFields: {
			serialNumber: 10,
			description: "Herbal ammonia-free black henna hair dye sold by individual strip or full 8-strip pack",
			descriptionAr: "صبغة شعر حناء طبيعية سوداء خالية من الأمونيا تباع بالشريط المفرد أو الباكو الكامل (8 أشرطة)",
			createdAt: "2026-10-01T09:00:00.000Z",
			previousCostPrice: .65,
			previousSellingPrice: 1.25,
			priceUpdatedAt: "2026-10-27T14:20:00.000Z",
			enablePackaging: true,
			unitName: "Strip",
			unitNameAr: "شريط",
			packName: "Pack",
			packNameAr: "باكو",
			unitsPerPack: 8,
			defaultSaleUnit: "unit",
			allowedSaleUnits: "both",
			packCostPrice: 6,
			packSellingPrice: 11.5
		},
		createdAt: "2026-10-01T09:00:00.000Z",
		updatedAt: "2026-10-27T14:20:00.000Z"
	}
];
var INITIAL_CUSTOMERS = [
	{
		id: "cust-1",
		name: "Sarah Al-Mansoor",
		phone: "+966 50 123 4567",
		email: "sarah.m@example.com",
		notes: "Prefers oat milk in coffee. Frequent morning regular.",
		totalSpent: 184.5,
		transactionCount: 22,
		loyaltyPoints: 185,
		createdAt: "2026-08-14T09:30:00.000Z"
	},
	{
		id: "cust-2",
		name: "David Reynolds",
		phone: "+1 (555) 987-6543",
		email: "david.r@example.com",
		notes: "Local architect office, orders for team meetings.",
		totalSpent: 420,
		transactionCount: 14,
		loyaltyPoints: 420,
		createdAt: "2026-09-02T11:15:00.000Z"
	},
	{
		id: "cust-3",
		name: "Nora Al-Khatib",
		phone: "+966 55 981 2233",
		email: "nora.k@example.com",
		notes: "Loves bakery items and single-origin retail beans.",
		totalSpent: 96,
		transactionCount: 8,
		loyaltyPoints: 95,
		createdAt: "2026-10-10T14:20:00.000Z"
	}
];
var INITIAL_TRANSACTIONS = [
	{
		id: "TXN-20261029-9182",
		idempotencyKey: "init_tx_1",
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 21e5)).toISOString(),
		currency: "SDG",
		exchangeRateUsed: 2700,
		exchangeRatesSnapshot: {
			SDG: 1,
			USD: 2700,
			SAR: 720,
			AED: 735,
			EUR: 2950,
			GBP: 3450
		},
		items: [{
			productId: "prod-2",
			productName: "Oat Milk Flat White",
			sku: "BEV-002",
			quantity: 2,
			unitPrice: 4.85,
			discountPercent: 0,
			total: 9.7
		}, {
			productId: "prod-4",
			productName: "Butter Croissant French",
			sku: "BAK-001",
			quantity: 1,
			unitPrice: 3.95,
			discountPercent: 0,
			total: 3.95
		}],
		subtotal: 13.65,
		taxRatePercent: 8.5,
		taxAmount: 1.16,
		discountAmount: 0,
		grandTotal: 14.81,
		paymentMethod: "bank_transfer",
		transferReference: "BNK-2026-9182",
		amountTendered: 8.81,
		changeDue: 0,
		paymentStatus: "partial",
		amountPaid: 8.81,
		debtAmount: 6,
		fulfillmentType: "goods_and_invoice",
		fulfillmentStatus: "received",
		customerId: "cust-1",
		customerName: "Sarah Al-Mansoor",
		cashierName: "POS Terminal 01",
		status: "completed",
		syncStatus: "synced"
	},
	{
		id: "TXN-20261029-8421",
		idempotencyKey: "init_tx_2",
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 66e5)).toISOString(),
		currency: "SDG",
		exchangeRateUsed: 2500,
		exchangeRatesSnapshot: {
			SDG: 1,
			USD: 2500,
			SAR: 670,
			AED: 680,
			EUR: 2700,
			GBP: 3150
		},
		items: [{
			productId: "prod-6",
			productName: "Smoked Salmon Sourdough Bagel",
			sku: "DEL-001",
			quantity: 2,
			unitPrice: 8.95,
			discountPercent: 0,
			total: 17.9
		}, {
			productId: "prod-1",
			productName: "Espresso Double Shot",
			sku: "BEV-001",
			quantity: 2,
			unitPrice: 3.75,
			discountPercent: 0,
			total: 7.5
		}],
		subtotal: 25.4,
		taxRatePercent: 8.5,
		taxAmount: 2.16,
		discountAmount: 0,
		grandTotal: 27.56,
		paymentMethod: "cash",
		amountTendered: 30,
		changeDue: 2.44,
		paymentStatus: "paid",
		amountPaid: 27.56,
		debtAmount: 0,
		fulfillmentType: "invoice_only",
		fulfillmentStatus: "pending_goods",
		customerId: "cust-2",
		customerName: "David Reynolds",
		cashierName: "POS Terminal 01",
		status: "completed",
		syncStatus: "synced"
	},
	{
		id: "TXN-20261029-7150",
		idempotencyKey: "init_tx_3",
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 144e5)).toISOString(),
		currency: "SDG",
		exchangeRateUsed: 2500,
		exchangeRatesSnapshot: {
			SDG: 1,
			USD: 2500,
			SAR: 670,
			AED: 680,
			EUR: 2700,
			GBP: 3150
		},
		items: [{
			productId: "prod-8",
			productName: "Ethiopia Yirgacheffe Beans 250g",
			sku: "RET-001",
			quantity: 1,
			unitPrice: 18,
			discountPercent: 10,
			total: 16.2
		}],
		subtotal: 16.2,
		taxRatePercent: 8.5,
		taxAmount: 1.38,
		discountAmount: 1.8,
		grandTotal: 17.58,
		paymentMethod: "qr_nfc",
		amountTendered: 17.58,
		changeDue: 0,
		paymentStatus: "paid",
		amountPaid: 17.58,
		debtAmount: 0,
		fulfillmentType: "goods_and_invoice",
		fulfillmentStatus: "received",
		customerName: "Walk-in Customer",
		cashierName: "POS Terminal 01",
		status: "completed",
		syncStatus: "synced"
	},
	{
		id: "TXN-20261028-6410",
		idempotencyKey: "init_tx_day1",
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString(),
		currency: "SDG",
		exchangeRateUsed: 2600,
		exchangeRatesSnapshot: {
			SDG: 1,
			USD: 2600,
			SAR: 695,
			AED: 710,
			EUR: 2820,
			GBP: 3300
		},
		items: [{
			productId: "prod-9",
			productName: "Ceramic Tactile Tumbler 350ml",
			sku: "MER-001",
			quantity: 2,
			unitPrice: 24,
			discountPercent: 0,
			total: 48
		}, {
			productId: "prod-8",
			productName: "Ethiopia Yirgacheffe Beans 250g",
			sku: "RET-001",
			quantity: 1,
			unitPrice: 18,
			discountPercent: 0,
			total: 18
		}],
		subtotal: 66,
		taxRatePercent: 8.5,
		taxAmount: 5.61,
		discountAmount: 0,
		grandTotal: 71.61,
		paymentMethod: "bank_transfer",
		transferReference: "BNK-2026-6410",
		amountTendered: 71.61,
		changeDue: 0,
		paymentStatus: "paid",
		amountPaid: 71.61,
		debtAmount: 0,
		fulfillmentType: "goods_and_invoice",
		fulfillmentStatus: "received",
		customerId: "cust-2",
		customerName: "David Reynolds",
		cashierName: "POS Terminal 01",
		status: "completed",
		syncStatus: "synced"
	},
	{
		id: "TXN-20261027-5390",
		idempotencyKey: "init_tx_day2_peak",
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 1728e5)).toISOString(),
		currency: "SDG",
		exchangeRateUsed: 2600,
		exchangeRatesSnapshot: {
			SDG: 1,
			USD: 2600,
			SAR: 695,
			AED: 710,
			EUR: 2820,
			GBP: 3300
		},
		items: [{
			productId: "prod-8",
			productName: "Ethiopia Yirgacheffe Beans 250g",
			sku: "RET-001",
			quantity: 3,
			unitPrice: 18,
			discountPercent: 0,
			total: 54
		}, {
			productId: "prod-10",
			productName: "Natural Hair Dye (Pack = 8 Strips)",
			sku: "COS-008",
			quantity: 3,
			unitPrice: 11.5,
			discountPercent: 0,
			total: 34.5,
			saleUnit: "pack",
			saleUnitLabel: "Pack (8 Strip)",
			unitsPerPack: 8,
			stockDeducted: 24
		}],
		subtotal: 88.5,
		taxRatePercent: 8.5,
		taxAmount: 7.52,
		discountAmount: 0,
		grandTotal: 96.02,
		paymentMethod: "bank_transfer",
		transferReference: "BNK-2026-5390",
		amountTendered: 80.02,
		changeDue: 0,
		paymentStatus: "partial",
		amountPaid: 80.02,
		debtAmount: 16,
		fulfillmentType: "goods_and_invoice",
		fulfillmentStatus: "received",
		customerId: "cust-1",
		customerName: "Sarah Al-Mansoor",
		cashierName: "POS Terminal 01",
		status: "completed",
		syncStatus: "synced"
	},
	{
		id: "TXN-20261026-4120",
		idempotencyKey: "init_tx_day3",
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 2592e5)).toISOString(),
		currency: "SDG",
		exchangeRateUsed: 2500,
		exchangeRatesSnapshot: {
			SDG: 1,
			USD: 2500,
			SAR: 670,
			AED: 680,
			EUR: 2700,
			GBP: 3150
		},
		items: [{
			productId: "prod-6",
			productName: "Smoked Salmon Sourdough Bagel",
			sku: "DEL-001",
			quantity: 4,
			unitPrice: 8.95,
			discountPercent: 0,
			total: 35.8
		}, {
			productId: "prod-3",
			productName: "Cold Brew Reserve (Bottle)",
			sku: "BEV-003",
			quantity: 2,
			unitPrice: 5.5,
			discountPercent: 0,
			total: 11
		}],
		subtotal: 46.8,
		taxRatePercent: 8.5,
		taxAmount: 3.98,
		discountAmount: 0,
		grandTotal: 50.78,
		paymentMethod: "cash",
		amountTendered: 55,
		changeDue: 4.22,
		paymentStatus: "paid",
		amountPaid: 50.78,
		debtAmount: 0,
		fulfillmentType: "goods_and_invoice",
		fulfillmentStatus: "received",
		customerId: "cust-3",
		customerName: "Nora Al-Khatib",
		cashierName: "POS Terminal 01",
		status: "completed",
		syncStatus: "synced"
	},
	{
		id: "TXN-20261025-3085",
		idempotencyKey: "init_tx_day4",
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 3456e5)).toISOString(),
		currency: "SDG",
		exchangeRateUsed: 2500,
		exchangeRatesSnapshot: {
			SDG: 1,
			USD: 2500,
			SAR: 670,
			AED: 680,
			EUR: 2700,
			GBP: 3150
		},
		items: [{
			productId: "prod-7",
			productName: "Truffle Grilled Cheese",
			sku: "DEL-002",
			quantity: 5,
			unitPrice: 7.5,
			discountPercent: 0,
			total: 37.5
		}],
		subtotal: 37.5,
		taxRatePercent: 8.5,
		taxAmount: 3.19,
		discountAmount: 0,
		grandTotal: 40.69,
		paymentMethod: "qr_nfc",
		amountTendered: 40.69,
		changeDue: 0,
		paymentStatus: "paid",
		amountPaid: 40.69,
		debtAmount: 0,
		fulfillmentType: "goods_and_invoice",
		fulfillmentStatus: "received",
		customerName: "Walk-in Customer",
		cashierName: "POS Terminal 01",
		status: "completed",
		syncStatus: "synced"
	},
	{
		id: "TXN-20261024-2190",
		idempotencyKey: "init_tx_day5",
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 432e6)).toISOString(),
		currency: "SDG",
		exchangeRateUsed: 2450,
		exchangeRatesSnapshot: {
			SDG: 1,
			USD: 2450,
			SAR: 655,
			AED: 670,
			EUR: 2650,
			GBP: 3100
		},
		items: [{
			productId: "prod-9",
			productName: "Ceramic Tactile Tumbler 350ml",
			sku: "MER-001",
			quantity: 2,
			unitPrice: 24,
			discountPercent: 0,
			total: 48
		}, {
			productId: "prod-5",
			productName: "Pistachio Cardamom Bun",
			sku: "BAK-002",
			quantity: 3,
			unitPrice: 4.75,
			discountPercent: 0,
			total: 14.25
		}],
		subtotal: 62.25,
		taxRatePercent: 8.5,
		taxAmount: 5.29,
		discountAmount: 0,
		grandTotal: 67.54,
		paymentMethod: "cash",
		amountTendered: 70,
		changeDue: 2.46,
		paymentStatus: "paid",
		amountPaid: 67.54,
		debtAmount: 0,
		fulfillmentType: "goods_and_invoice",
		fulfillmentStatus: "received",
		customerId: "cust-2",
		customerName: "David Reynolds",
		cashierName: "POS Terminal 01",
		status: "completed",
		syncStatus: "synced"
	},
	{
		id: "TXN-20261023-1104",
		idempotencyKey: "init_tx_day6",
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 5184e5)).toISOString(),
		currency: "SDG",
		exchangeRateUsed: 2400,
		exchangeRatesSnapshot: {
			SDG: 1,
			USD: 2400,
			SAR: 640,
			AED: 655,
			EUR: 2600,
			GBP: 3050
		},
		items: [{
			productId: "prod-4",
			productName: "Butter Croissant French",
			sku: "BAK-001",
			quantity: 6,
			unitPrice: 3.95,
			discountPercent: 0,
			total: 23.7
		}, {
			productId: "prod-2",
			productName: "Oat Milk Flat White",
			sku: "BEV-002",
			quantity: 4,
			unitPrice: 4.85,
			discountPercent: 0,
			total: 19.4
		}],
		subtotal: 43.1,
		taxRatePercent: 8.5,
		taxAmount: 3.66,
		discountAmount: 0,
		grandTotal: 46.76,
		paymentMethod: "bank_transfer",
		transferReference: "BNK-2026-1104",
		amountTendered: 46.76,
		changeDue: 0,
		paymentStatus: "paid",
		amountPaid: 46.76,
		debtAmount: 0,
		fulfillmentType: "goods_and_invoice",
		fulfillmentStatus: "received",
		customerId: "cust-1",
		customerName: "Sarah Al-Mansoor",
		cashierName: "POS Terminal 01",
		status: "completed",
		syncStatus: "synced"
	}
];
var INITIAL_STOCK_MOVEMENTS = [{
	id: "mov-1",
	timestamp: (/* @__PURE__ */ new Date(Date.now() - 18e6)).toISOString(),
	productId: "prod-1",
	productName: "Espresso Double Shot",
	type: "restock",
	quantityChange: 50,
	previousStock: 0,
	newStock: 50,
	reason: "Weekly coffee beans roast delivery (INV-SUP-104)",
	receiptMode: "goods_and_invoice",
	supplierName: "Al-Nilein Roasters",
	invoiceNumber: "INV-SUP-104",
	unitCost: .85,
	currency: "USD"
}, {
	id: "mov-2",
	timestamp: (/* @__PURE__ */ new Date(Date.now() - 144e5)).toISOString(),
	productId: "prod-5",
	productName: "Pistachio Cardamom Bun",
	type: "damage",
	quantityChange: 2,
	previousStock: 5,
	newStock: 3,
	reason: "Damaged during oven tray transfer"
}];
var INITIAL_EXCHANGE_RATE_HISTORY = [
	{
		id: "hist-usd-1",
		currency: "USD",
		previousRate: 2400,
		newRate: 2500,
		changePercent: 4.2,
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 2592e5)).toISOString(),
		note: "Market rate adjustment"
	},
	{
		id: "hist-usd-2",
		currency: "USD",
		previousRate: 2500,
		newRate: 2600,
		changePercent: 4,
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 1296e5)).toISOString(),
		note: "Morning bank update"
	},
	{
		id: "hist-usd-3",
		currency: "USD",
		previousRate: 2600,
		newRate: 2700,
		changePercent: 3.8,
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 144e5)).toISOString(),
		note: "Current active rate"
	},
	{
		id: "hist-sar-1",
		currency: "SAR",
		previousRate: 670,
		newRate: 700,
		changePercent: 4.5,
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 1728e5)).toISOString()
	},
	{
		id: "hist-sar-2",
		currency: "SAR",
		previousRate: 700,
		newRate: 720,
		changePercent: 2.9,
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 216e5)).toISOString()
	},
	{
		id: "hist-aed-1",
		currency: "AED",
		previousRate: 680,
		newRate: 735,
		changePercent: 8.1,
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 432e5)).toISOString()
	},
	{
		id: "hist-eur-1",
		currency: "EUR",
		previousRate: 2700,
		newRate: 2950,
		changePercent: 9.3,
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 648e5)).toISOString()
	},
	{
		id: "hist-gbp-1",
		currency: "GBP",
		previousRate: 3150,
		newRate: 3450,
		changePercent: 9.5,
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString()
	}
];
var INITIAL_UNMET_DEMAND_REQUESTS = [
	{
		id: "udr-seed-1",
		idempotencyKey: "udr-seed-idem-1",
		dedupeFingerprint: "seed-fp-1",
		branchId: "branch-main",
		productId: "prod-5",
		isRegisteredProduct: true,
		productNameSnapshot: "Pistachio Cardamom Bun",
		productNameArSnapshot: "لفافة الفستق والهيل",
		skuSnapshot: "BAK-002",
		barcode: "200201002025",
		categorySnapshot: "Bakery",
		requestedTimestamp: (/* @__PURE__ */ new Date(Date.now() - 648e5)).toISOString(),
		requestedQuantity: 6,
		saleUnitMode: "unit",
		requestedBaseUnits: 6,
		availableStockAtRequest: 3,
		availabilityStatus: "INSUFFICIENT_QUANTITY",
		unavailabilityReason: "OUT_OF_STOCK",
		confirmedPurchaseIntent: true,
		fulfillmentStatus: "unfulfilled",
		unitSellingPriceSnapshot: 4.75,
		unitCostPriceSnapshot: 1.6,
		currencySnapshot: "SDG",
		exchangeRateSnapshot: 1,
		customerId: "cust-1",
		customerReference: "Sarah Al-Mansoor",
		notes: "Requested a box of 6 buns for morning office meeting; only 3 available",
		recordedByUserId: "user-1",
		recordedByUserName: "Ahmed Al-Amin",
		recordedByRole: "admin",
		sourceScreen: "checkout",
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 648e5)).toISOString()
	},
	{
		id: "udr-seed-2",
		idempotencyKey: "udr-seed-idem-2",
		dedupeFingerprint: "seed-fp-2",
		branchId: "branch-main",
		productId: "prod-5",
		isRegisteredProduct: true,
		productNameSnapshot: "Pistachio Cardamom Bun",
		productNameArSnapshot: "لفافة الفستق والهيل",
		skuSnapshot: "BAK-002",
		barcode: "200201002025",
		categorySnapshot: "Bakery",
		requestedTimestamp: (/* @__PURE__ */ new Date(Date.now() - 216e5)).toISOString(),
		requestedQuantity: 4,
		saleUnitMode: "unit",
		requestedBaseUnits: 4,
		availableStockAtRequest: 0,
		availabilityStatus: "OUT_OF_STOCK",
		unavailabilityReason: "OUT_OF_STOCK",
		confirmedPurchaseIntent: true,
		fulfillmentStatus: "unfulfilled",
		unitSellingPriceSnapshot: 4.75,
		unitCostPriceSnapshot: 1.6,
		currencySnapshot: "SDG",
		exchangeRateSnapshot: 1,
		customerId: null,
		customerReference: "Walk-in regular customer",
		notes: "Sold out before 2 PM for the second time this week",
		recordedByUserId: "user-2",
		recordedByUserName: "Sara Khalid",
		recordedByRole: "manager",
		sourceScreen: "checkout",
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 216e5)).toISOString()
	},
	{
		id: "udr-seed-3",
		idempotencyKey: "udr-seed-idem-3",
		dedupeFingerprint: "seed-fp-3",
		branchId: "branch-bahri",
		productId: "prod-3",
		isRegisteredProduct: true,
		productNameSnapshot: "Cold Brew Reserve (Bottle)",
		productNameArSnapshot: "كولد برو منقوع بارد (قارورة)",
		skuSnapshot: "BEV-003",
		barcode: "200101001035",
		categorySnapshot: "Coffee & Drinks",
		requestedTimestamp: (/* @__PURE__ */ new Date(Date.now() - 108e6)).toISOString(),
		requestedQuantity: 5,
		saleUnitMode: "unit",
		requestedBaseUnits: 5,
		availableStockAtRequest: 0,
		availabilityStatus: "OUT_OF_STOCK",
		unavailabilityReason: "OUT_OF_STOCK",
		confirmedPurchaseIntent: true,
		fulfillmentStatus: "unfulfilled",
		unitSellingPriceSnapshot: 5.5,
		unitCostPriceSnapshot: 1.8,
		currencySnapshot: "SDG",
		exchangeRateSnapshot: 1,
		customerId: null,
		customerReference: null,
		notes: "Bahri branch refrigerator out of bottled Cold Brew",
		recordedByUserId: "user-2",
		recordedByUserName: "Sara Khalid",
		recordedByRole: "manager",
		sourceScreen: "checkout",
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 108e6)).toISOString()
	},
	{
		id: "udr-seed-4",
		idempotencyKey: "udr-seed-idem-4",
		dedupeFingerprint: "seed-fp-4",
		branchId: "branch-omdurman",
		productId: "prod-8",
		isRegisteredProduct: true,
		productNameSnapshot: "Ethiopia Yirgacheffe Beans 250g",
		productNameArSnapshot: "حبوب إثيوبيا ييرغاتشيف 250 جم",
		skuSnapshot: "RET-001",
		barcode: "200401004012",
		categorySnapshot: "Packaged Retail",
		requestedTimestamp: (/* @__PURE__ */ new Date(Date.now() - 432e5)).toISOString(),
		requestedQuantity: 6,
		saleUnitMode: "unit",
		requestedBaseUnits: 6,
		availableStockAtRequest: 0,
		availabilityStatus: "OUT_OF_STOCK",
		unavailabilityReason: "OUT_OF_STOCK",
		confirmedPurchaseIntent: true,
		fulfillmentStatus: "unfulfilled",
		unitSellingPriceSnapshot: 18,
		unitCostPriceSnapshot: 7,
		currencySnapshot: "SDG",
		exchangeRateSnapshot: 1,
		customerId: "cust-2",
		customerReference: "Tariq Ibrahim",
		notes: "Omdurman branch out of stock while Main branch has surplus",
		recordedByUserId: "user-1",
		recordedByUserName: "Ahmed Al-Amin",
		recordedByRole: "admin",
		sourceScreen: "products",
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 432e5)).toISOString()
	},
	{
		id: "udr-seed-5",
		idempotencyKey: "udr-seed-idem-5",
		dedupeFingerprint: "seed-fp-5",
		branchId: "branch-main",
		productId: "prod-4",
		isRegisteredProduct: true,
		productNameSnapshot: "Butter Croissant French",
		productNameArSnapshot: "كرواسون الزبدة الفرنسي",
		skuSnapshot: "BAK-001",
		barcode: "200201002018",
		categorySnapshot: "Bakery",
		requestedTimestamp: (/* @__PURE__ */ new Date(Date.now() - 1512e5)).toISOString(),
		requestedQuantity: 2,
		saleUnitMode: "unit",
		requestedBaseUnits: 2,
		availableStockAtRequest: 2,
		availabilityStatus: "EXPIRED",
		unavailabilityReason: "EXPIRED",
		confirmedPurchaseIntent: true,
		fulfillmentStatus: "unfulfilled",
		unitSellingPriceSnapshot: 3.95,
		unitCostPriceSnapshot: 1.1,
		currencySnapshot: "SDG",
		exchangeRateSnapshot: 1,
		customerId: null,
		customerReference: null,
		notes: "Remaining 2 items on evening shelf past freshness window",
		recordedByUserId: "user-3",
		recordedByUserName: "Omer Hassan",
		recordedByRole: "cashier",
		sourceScreen: "checkout",
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 1512e5)).toISOString()
	},
	{
		id: "udr-seed-6",
		idempotencyKey: "udr-seed-idem-6",
		dedupeFingerprint: "seed-fp-6",
		branchId: "branch-main",
		productId: null,
		isRegisteredProduct: false,
		productNameSnapshot: "Matcha Ceremonial Grade 100g",
		productNameArSnapshot: "شاي ماتشا ياباني احتفالي 100 جم",
		skuSnapshot: null,
		barcode: "490101099281",
		categorySnapshot: "Coffee & Drinks",
		requestedTimestamp: (/* @__PURE__ */ new Date(Date.now() - 144e5)).toISOString(),
		requestedQuantity: 3,
		saleUnitMode: "unit",
		requestedBaseUnits: 3,
		availableStockAtRequest: null,
		availabilityStatus: "NOT_STOCKED",
		unavailabilityReason: "NOT_STOCKED",
		confirmedPurchaseIntent: true,
		fulfillmentStatus: "unfulfilled",
		unitSellingPriceSnapshot: null,
		unitCostPriceSnapshot: null,
		currencySnapshot: "SDG",
		exchangeRateSnapshot: 1,
		customerId: "cust-1",
		customerReference: "Sarah Al-Mansoor",
		notes: "Customer asked if we carry ceremonial grade Uji Matcha tins",
		recordedByUserId: "user-3",
		recordedByUserName: "Omer Hassan",
		recordedByRole: "cashier",
		sourceScreen: "checkout",
		createdAt: (/* @__PURE__ */ new Date(Date.now() - 144e5)).toISOString()
	}
];
var INITIAL_EXPENSES = [
	{
		id: "EXP-20261108-4102",
		companyId: "comp-demo-practice",
		branchId: "branch-practice-main",
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 72e5)).toISOString(),
		title: "فاتورة كهرباء وإنترنت للمحل",
		category: "utilities",
		amount: 45,
		currency: "SDG",
		exchangeRateUsed: 2700,
		exchangeRatesSnapshot: {
			SDG: 1,
			USD: 2700,
			SAR: 720,
			AED: 735
		},
		paymentMethod: "bank_transfer",
		transferReference: "BNK-EXP-7721",
		beneficiary: "الشركة السودانية لتوزيع الكهرباء",
		notes: "شحن رصيد عداد الكهرباء وباقة الإنترنت الشهرية",
		recordedBy: "Ahmed Al-Amin",
		status: "recorded",
		syncStatus: "synced"
	},
	{
		id: "EXP-20261108-3908",
		companyId: "comp-demo-practice",
		branchId: "branch-practice-main",
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 216e5)).toISOString(),
		title: "ترحيل وتوصيل بضائع من المخزن",
		category: "transport",
		amount: 25,
		currency: "SDG",
		exchangeRateUsed: 2700,
		exchangeRatesSnapshot: {
			SDG: 1,
			USD: 2700,
			SAR: 720,
			AED: 735
		},
		paymentMethod: "cash",
		beneficiary: "سائق الترحيل - محمد عثمان",
		notes: "نقل 15 كرتونة بضاعة للفرع الرئيسي",
		recordedBy: "Omer Hassan",
		status: "recorded",
		syncStatus: "synced"
	},
	{
		id: "EXP-20261106-1840",
		companyId: "comp-demo-practice",
		branchId: "branch-practice-main",
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 1728e5)).toISOString(),
		title: "أكياس تغليف ورول ورق طابعة الكاشير",
		category: "supplies",
		amount: 32,
		currency: "SDG",
		exchangeRateUsed: 2700,
		exchangeRatesSnapshot: {
			SDG: 1,
			USD: 2700,
			SAR: 720,
			AED: 735
		},
		paymentMethod: "cash",
		beneficiary: "مطبعة النيلين للتغليف",
		notes: "شراء 20 رول حراري وأكياس مطبوعة",
		recordedBy: "Ahmed Al-Amin",
		status: "recorded",
		syncStatus: "synced"
	}
];
// src/lib/pos-calculations.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
/**
* Rounds monetary amounts cleanly: 2 decimals for standard values, up to 4 decimals for micro unit conversions.
*/
function roundCurrencyValue(value, _currency) {
	if (!Number.isFinite(value)) return 0;
	const abs = Math.abs(value);
	if (abs > 0 && abs < .05) return Math.round(value * 1e4) / 1e4;
	return Math.round(value * 100) / 100;
}
/**
* Converts a monetary amount between any two currencies using an exchangeRates map
* where exchangeRates[CODE] represents 1 unit of CODE in base currency (SDG = 1).
*/
function convertCurrencyAmount(amount, fromCurrency = "SDG", toCurrency = "SDG", exchangeRates = { SDG: 1 }) {
	if (!Number.isFinite(amount) || amount < 0) return 0;
	const from = (fromCurrency || "SDG").toUpperCase().trim();
	const to = (toCurrency || "SDG").toUpperCase().trim();
	if (from === to) return roundCurrencyValue(amount);
	const fromRateToSdg = from === "SDG" ? 1 : exchangeRates && exchangeRates[from] && exchangeRates[from] > 0 ? Number(exchangeRates[from]) : 1;
	const toRateToSdg = to === "SDG" ? 1 : exchangeRates && exchangeRates[to] && exchangeRates[to] > 0 ? Number(exchangeRates[to]) : 1;
	return roundCurrencyValue(amount * fromRateToSdg / toRateToSdg);
}
/**
* Extracts and normalizes multi-unit packaging (e.g. Strip vs Pack of 8 Strips) from a Product.
*/
function getProductPackaging(product) {
	const cf = product.customFields || {};
	const rawUnitsPerPack = Number(product.unitsPerPack ?? cf.unitsPerPack ?? 1);
	const unitsPerPack = Number.isFinite(rawUnitsPerPack) && rawUnitsPerPack >= 2 ? Math.floor(rawUnitsPerPack) : 1;
	const enablePackaging = Boolean((product.enablePackaging ?? cf.enablePackaging ?? false) && unitsPerPack >= 2);
	const unitName = String(product.unitName || cf.unitName || "Piece").trim() || "Piece";
	const unitNameAr = String(product.unitNameAr || cf.unitNameAr || "قطعة").trim() || "قطعة";
	const packName = String(product.packName || cf.packName || "Pack").trim() || "Pack";
	const packNameAr = String(product.packNameAr || cf.packNameAr || "باكو").trim() || "باكو";
	const allowedRaw = product.allowedSaleUnits || cf.allowedSaleUnits || "both";
	const allowedSaleUnits = allowedRaw === "unit_only" || allowedRaw === "pack_only" ? allowedRaw : "both";
	const defaultRaw = product.defaultSaleUnit || cf.defaultSaleUnit || "unit";
	const defaultSaleUnit = !enablePackaging || allowedSaleUnits === "unit_only" ? "unit" : allowedSaleUnits === "pack_only" ? "pack" : defaultRaw === "pack" ? "pack" : "unit";
	const unitCostPrice = Number(product.costPrice) || 0;
	const unitSellingPrice = Number(product.sellingPrice) || 0;
	const rawPackCost = product.packCostPrice ?? cf.packCostPrice;
	const packCostPrice = rawPackCost !== void 0 && Number.isFinite(Number(rawPackCost)) && Number(rawPackCost) > 0 ? roundCurrencyValue(Number(rawPackCost)) : roundCurrencyValue(unitCostPrice * (enablePackaging ? unitsPerPack : 1));
	const rawPackSelling = product.packSellingPrice ?? cf.packSellingPrice;
	const packSellingPrice = rawPackSelling !== void 0 && Number.isFinite(Number(rawPackSelling)) && Number(rawPackSelling) > 0 ? roundCurrencyValue(Number(rawPackSelling)) : roundCurrencyValue(unitSellingPrice * (enablePackaging ? unitsPerPack : 1));
	return {
		enablePackaging,
		unitName,
		unitNameAr,
		packName,
		packNameAr,
		unitsPerPack: enablePackaging ? unitsPerPack : 1,
		defaultSaleUnit,
		allowedSaleUnits,
		unitCostPrice,
		unitSellingPrice,
		packCostPrice,
		packSellingPrice
	};
}
/**
* Formats a product's stock in individual units into a readable Pack + Sub-Unit breakdown
* (e.g., 40 strips with 8 strips/pack -> "5 باكو (40 شريط)").
*/
function formatProductStockBreakdown(stockOrProduct, productOrLanguage, language = "ar") {
	const isFirstArgObject = typeof stockOrProduct === "object" && stockOrProduct !== null;
	const product = isFirstArgObject ? stockOrProduct : productOrLanguage;
	const resolvedLanguage = isFirstArgObject ? productOrLanguage || "ar" : language;
	const rawStock = isFirstArgObject ? Number(stockOrProduct.stock ?? 0) : Number(stockOrProduct);
	const safeStock = Math.max(0, Math.floor(rawStock));
	const pkg = getProductPackaging(product);
	const isAr = resolvedLanguage === "ar";
	const uLabel = isAr ? pkg.unitNameAr : pkg.unitName;
	const pLabel = isAr ? pkg.packNameAr : pkg.packName;
	if (!pkg.enablePackaging || pkg.unitsPerPack <= 1) return `${safeStock} ${uLabel}`;
	const fullPacks = Math.floor(safeStock / pkg.unitsPerPack);
	const remainderUnits = safeStock % pkg.unitsPerPack;
	if (fullPacks === 0) return `${safeStock} ${uLabel}`;
	if (remainderUnits === 0) return `${fullPacks} ${pLabel} (${safeStock} ${uLabel})`;
	return `${fullPacks} ${pLabel} + ${remainderUnits} ${uLabel} (${safeStock} ${uLabel})`;
}
/**
* Resolves a product's cost price, selling price, pack prices, unit profit, and profit margin % in the target currency.
*/
function getProductPricesInCurrency(product, targetCurrency = "SDG", exchangeRates = { SDG: 1 }) {
	const sourceCurrency = (product.priceCurrency || product.customFields?.priceCurrency || "SDG").toString().toUpperCase().trim();
	const packaging = getProductPackaging(product);
	const costPrice = convertCurrencyAmount(product.costPrice, sourceCurrency, targetCurrency, exchangeRates);
	const sellingPrice = convertCurrencyAmount(product.sellingPrice, sourceCurrency, targetCurrency, exchangeRates);
	const profit = roundCurrencyValue(sellingPrice - costPrice);
	const marginPercent = sellingPrice > 0 ? Math.round((sellingPrice - costPrice) / sellingPrice * 1e3) / 10 : 0;
	const packCostPrice = convertCurrencyAmount(packaging.packCostPrice, sourceCurrency, targetCurrency, exchangeRates);
	const packSellingPrice = convertCurrencyAmount(packaging.packSellingPrice, sourceCurrency, targetCurrency, exchangeRates);
	return {
		costPrice,
		sellingPrice,
		profit,
		marginPercent,
		packCostPrice,
		packSellingPrice,
		packProfit: roundCurrencyValue(packSellingPrice - packCostPrice),
		packMarginPercent: packSellingPrice > 0 ? Math.round((packSellingPrice - packCostPrice) / packSellingPrice * 1e3) / 10 : 0,
		packaging,
		sourceCurrency
	};
}
/**
* Resolves the active sale unit ('unit' vs 'pack'), unit price in targetCurrency, localized unit label,
* and total base stock units required for a CartItem.
*/
function getCartItemUnitPricing(item, targetCurrency, exchangeRates, language = "ar") {
	const pkg = getProductPackaging(item.product);
	const isAr = language === "ar";
	const resolvedSaleUnit = pkg.enablePackaging && pkg.unitsPerPack > 1 && (item.selectedSaleUnit === "pack" || !item.selectedSaleUnit && pkg.defaultSaleUnit === "pack") ? "pack" : "unit";
	const converted = targetCurrency && exchangeRates ? getProductPricesInCurrency(item.product, targetCurrency, exchangeRates) : {
		sellingPrice: item.product.sellingPrice,
		packSellingPrice: pkg.packSellingPrice
	};
	const unitPrice = resolvedSaleUnit === "pack" ? converted.packSellingPrice : converted.sellingPrice;
	const stockUnitsPerItem = resolvedSaleUnit === "pack" ? pkg.unitsPerPack : 1;
	const totalStockUnitsRequired = Math.max(0, item.quantity * stockUnitsPerItem);
	const unitLabel = resolvedSaleUnit === "pack" ? isAr ? `${pkg.packNameAr} (${pkg.unitsPerPack} ${pkg.unitNameAr})` : `${pkg.packName} (${pkg.unitsPerPack} ${pkg.unitName})` : isAr ? pkg.unitNameAr : pkg.unitName;
	return {
		saleUnit: resolvedSaleUnit,
		unitLabel,
		saleUnitLabel: unitLabel,
		unitPrice,
		unitSellingPrice: unitPrice,
		stockUnitsPerItem,
		totalStockUnitsRequired,
		packaging: pkg
	};
}
/**
* Calculates line-item total taking into account unit price, quantity, and item-specific discount percentage.
*/
function calculateItemTotal(price, quantity, discountPercent = 0) {
	if (price < 0 || quantity <= 0) return 0;
	const clampedDiscount = Math.max(0, Math.min(100, discountPercent));
	return roundCurrencyValue(price * quantity * (1 - clampedDiscount / 100));
}
/**
* Computes all cart monetary totals, supporting tax-inclusive, tax-exclusive, multi-unit (piece/strip vs pack),
* and active currency conversion.
*/
function calculateCartTotals(items, taxRatePercent = 0, globalDiscountPercent = 0, isTaxInclusive = false, targetCurrency, exchangeRates, globalDiscountFixedAmount = 0) {
	if (!items || items.length === 0) return {
		subtotal: 0,
		discountAmount: 0,
		netSubtotal: 0,
		taxAmount: 0,
		grandTotal: 0,
		totalItemsCount: 0
	};
	let subtotal = 0;
	let totalItemsCount = 0;
	for (const item of items) {
		const { unitPrice } = getCartItemUnitPricing(item, targetCurrency, exchangeRates);
		const itemTotal = calculateItemTotal(unitPrice, item.quantity, item.itemDiscountPercent);
		subtotal += itemTotal;
		totalItemsCount += item.quantity;
	}
	subtotal = roundCurrencyValue(subtotal);
	const clampedGlobalDiscount = Math.max(0, Math.min(100, globalDiscountPercent));
	const safeFixedDiscount = Number.isFinite(globalDiscountFixedAmount) ? Math.max(0, globalDiscountFixedAmount) : 0;
	const discountAmount = safeFixedDiscount > 0 ? roundCurrencyValue(Math.min(subtotal, safeFixedDiscount)) : roundCurrencyValue(subtotal * (clampedGlobalDiscount / 100));
	const netSubtotal = Math.max(0, roundCurrencyValue(subtotal - discountAmount));
	const safeTaxRate = Math.max(0, taxRatePercent);
	let taxAmount = 0;
	let grandTotal = 0;
	if (isTaxInclusive) {
		taxAmount = roundCurrencyValue(netSubtotal - netSubtotal / (1 + safeTaxRate / 100));
		grandTotal = netSubtotal;
	} else {
		taxAmount = roundCurrencyValue(netSubtotal * (safeTaxRate / 100));
		grandTotal = roundCurrencyValue(netSubtotal + taxAmount);
	}
	return {
		subtotal,
		discountAmount,
		netSubtotal,
		taxAmount,
		grandTotal,
		totalItemsCount
	};
}
/**
* Calculates paid amount, remaining debt, and change due based on payment status and tendered amount.
*/
function calculateDebtBreakdown(grandTotal, paymentStatus = "paid", amountTendered) {
	const safeTotal = Math.max(0, roundCurrencyValue(grandTotal));
	if (paymentStatus === "unpaid") return {
		paymentStatus: "unpaid",
		amountPaid: 0,
		debtAmount: safeTotal,
		changeDue: 0
	};
	if (paymentStatus === "partial") {
		const rawPaid = Number.isFinite(amountTendered) ? Math.max(0, Number(amountTendered)) : 0;
		const clampedPaid = roundCurrencyValue(Math.min(safeTotal, rawPaid));
		const debt = roundCurrencyValue(Math.max(0, safeTotal - clampedPaid));
		return {
			paymentStatus: debt <= 0 ? "paid" : clampedPaid <= 0 ? "unpaid" : "partial",
			amountPaid: clampedPaid,
			debtAmount: debt,
			changeDue: 0
		};
	}
	const tendered = amountTendered !== void 0 && Number.isFinite(amountTendered) ? Math.max(safeTotal, Number(amountTendered)) : safeTotal;
	return {
		paymentStatus: "paid",
		amountPaid: safeTotal,
		debtAmount: 0,
		changeDue: roundCurrencyValue(Math.max(0, tendered - safeTotal))
	};
}
/**
* Returns a localized display label for any payment method.
*/
function formatPaymentMethodLabel(method, language = "en") {
	const isAr = language === "ar";
	switch (method) {
		case "bank_transfer": return isAr ? "تحويل بنكي" : "Bank Transfer";
		case "cash": return isAr ? "نقداً (كاش)" : "Cash";
		case "qr_nfc": return isAr ? "محفظة رقمية (QR/NFC)" : "Digital Wallet (QR/NFC)";
		case "card": return isAr ? "تحويل بنكي / بطاقة" : "Bank Transfer / Card";
		default: return String(method);
	}
}
/**
* Validates whether a checkout submission satisfies business criteria, including multi-unit stock (strip vs pack),
* bank transfer reference, debt rules, dynamic currency formatting, and bilingual (Arabic/English) error messages.
*/
function validateCheckout(items, paymentMethod, amountTendered, grandTotal, details, options) {
	const isAr = options?.language === "ar";
	const currencyCode = (options?.currency || "USD").toUpperCase().trim() || "USD";
	const fail = (enMsg, arMsg) => ({
		valid: false,
		error: isAr ? arMsg : enMsg,
		errorAr: arMsg
	});
	if (!items || items.length === 0) return fail("Shopping cart cannot be empty.", "لا يمكن إتمام العملية والسلة فارغة.");
	if (grandTotal < 0) return fail("Total amount cannot be negative.", "لا يمكن أن يكون المبلغ الإجمالي بالسالب.");
	for (const item of items) {
		const prodNameEn = item.product.name;
		const prodNameAr = item.product.nameAr || item.product.name;
		if (item.quantity <= 0) return fail(`Invalid quantity for ${prodNameEn}.`, `كمية غير صالحة للصنف ${prodNameAr}.`);
		const { totalStockUnitsRequired } = getCartItemUnitPricing(item);
		if (totalStockUnitsRequired > item.product.stock) return fail(`Insufficient stock for ${prodNameEn}. In stock: ${item.product.stock}, requested: ${totalStockUnitsRequired}.`, `المخزون غير كافٍ للصنف ${prodNameAr}. المتوفر: ${item.product.stock}، المطلوب: ${totalStockUnitsRequired}.`);
	}
	const paymentStatus = details?.paymentStatus || "paid";
	const transferCheck = validateBankTransferTransaction({
		paymentMethod,
		paymentStatus,
		transferReference: details?.transferReference
	});
	if (!transferCheck.valid) return fail(transferCheck.error || "Transaction reference number (رقم العملية) is required for Bank Transfer.", transferCheck.errorAr || "رقم العملية مطلوب عند الدفع عبر التحويل البنكي.");
	if (paymentStatus === "partial") {
		const paid = details?.amountPaid !== void 0 ? details.amountPaid : amountTendered;
		if (!Number.isFinite(paid) || paid <= 0) return fail("Partial payment amount must be greater than zero, or choose Unpaid (Full Debt).", "يجب أن يكون المبلغ المدفوع جزئياً أكبر من الصفر، أو اختر آجل بالكامل (غير مدفوع).");
		if (paid > grandTotal + 1e-4) return fail("Partial payment amount cannot exceed the grand total.", "لا يمكن أن يتجاوز المبلغ المدفوع جزئياً إجمالي الفاتورة.");
	} else if (paymentStatus === "paid" && paymentMethod === "cash") {
		if (amountTendered < grandTotal - 1e-4) {
			const tenderedEn = formatCurrency(amountTendered, currencyCode, "en");
			const totalEn = formatCurrency(grandTotal, currencyCode, "en");
			const tenderedAr = formatCurrency(amountTendered, currencyCode, "ar");
			const totalAr = formatCurrency(grandTotal, currencyCode, "ar");
			return fail(`Tendered amount (${tenderedEn}) is less than total due (${totalEn}).`, `المبلغ المدفوع (${tenderedAr}) أقل من الإجمالي المستحق (${totalAr}).`);
		}
	}
	return { valid: true };
}
/**
* Validates that a transaction or payment using `bank_transfer` (when not unpaid/cancelled)
* includes a non-empty operation reference number (`transferReference`).
* Shared between client checkout validation and server API endpoints (`/api/store-sync`, `/api/transactions`, `/api/lan-sync/push`).
*/
function validateBankTransferTransaction(tx) {
	if (!tx || typeof tx !== "object") return {
		valid: false,
		errorCode: "INVALID_TRANSACTION_PAYLOAD",
		error: "Invalid transaction payload.",
		errorAr: "بيانات العملية غير صالحة."
	};
	if (tx.status === "cancelled") return { valid: true };
	const paymentMethod = String(tx.paymentMethod || "cash").trim();
	const paymentStatus = tx.paymentStatus || "paid";
	const topLevelRef = typeof tx.transferReference === "string" ? tx.transferReference.trim() : "";
	const debtPayments = Array.isArray(tx.debtPayments) ? tx.debtPayments : [];
	if (paymentMethod === "bank_transfer" && paymentStatus !== "unpaid") {
		const hasDebtRef = debtPayments.some((dp) => dp && dp.paymentMethod === "bank_transfer" && typeof dp.transferReference === "string" && dp.transferReference.trim().length > 0);
		if (!topLevelRef && !hasDebtRef) return {
			valid: false,
			errorCode: "BANK_TRANSFER_REFERENCE_REQUIRED",
			error: "Transaction reference number (رقم العملية) is required for Bank Transfer.",
			errorAr: "رقم مرجع العملية مطلوب عند الدفع عبر التحويل البنكي."
		};
	}
	for (const dp of debtPayments) if (dp && dp.paymentMethod === "bank_transfer" && (dp.amountPaid === void 0 || Number(dp.amountPaid) > 0)) {
		if (!(typeof dp.transferReference === "string" ? dp.transferReference.trim() : "") && !topLevelRef) return {
			valid: false,
			errorCode: "BANK_TRANSFER_REFERENCE_REQUIRED",
			error: "Transaction reference number (رقم العملية) is required for Bank Transfer debt settlement.",
			errorAr: "رقم مرجع العملية مطلوب عند سداد المديونية عبر التحويل البنكي."
		};
	}
	return { valid: true };
}
var CURRENCY_SYMBOLS = Object.freeze({
	SDG: {
		en: "SDG ",
		ar: " ج.س"
	},
	USD: {
		en: "$",
		ar: "$"
	},
	SAR: {
		en: "SAR ",
		ar: " ر.س"
	},
	AED: {
		en: "AED ",
		ar: " د.إ"
	},
	EUR: {
		en: "€",
		ar: "€"
	},
	GBP: {
		en: "£",
		ar: "£"
	},
	EGP: {
		en: "EGP ",
		ar: " ج.م"
	},
	QAR: {
		en: "QAR ",
		ar: " ر.ق"
	},
	KWD: {
		en: "KWD ",
		ar: " د.ك"
	},
	TRY: {
		en: "₺",
		ar: "₺"
	}
});
var ARABIC_SUFFIX_CURRENCIES = /* @__PURE__ */ new Set([
	"SAR",
	"AED",
	"SDG",
	"EGP",
	"QAR",
	"KWD"
]);
/**
* Currency formatter with symbol placement and localized numerals.
*/
function formatCurrency(amount, currency = "USD", locale = "en") {
	const safeAmount = isNaN(amount) ? 0 : amount;
	const code = (currency || "SDG").toUpperCase();
	const isMicro = Math.abs(safeAmount) > 0 && Math.abs(safeAmount) < .05;
	const formattedNum = safeAmount.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: isMicro ? 4 : 2
	});
	const sym = CURRENCY_SYMBOLS[code] || {
		en: `${code} `,
		ar: ` ${code}`
	};
	if (locale === "ar") {
		if (ARABIC_SUFFIX_CURRENCIES.has(code) || !CURRENCY_SYMBOLS[code]) return `${formattedNum}${sym.ar}`;
		return `${sym.ar}${formattedNum}`;
	}
	return `${sym.en}${formattedNum}`;
}
var DEFAULT_BASELINE_EXCHANGE_RATES = {
	SDG: 1,
	USD: 2700,
	SAR: 720,
	AED: 735,
	EUR: 2950,
	GBP: 3450
};
/**
* Converts all monetary fields of a Transaction into targetCurrency according to the chosen
* exchange rate valuation mode:
* - 'live': Converts from tx.currency -> targetCurrency using current live exchange rates.
* - 'indexed': Anchors the transaction's value at the time of sale in anchorCurrency (e.g. USD)
*              using the invoice's historical rate snapshot, and re-values it at the current live rate.
* - 'historical': Converts from tx.currency -> targetCurrency using the historical snapshot rate at the time of sale.
*/
function getConvertedTransactionView(tx, targetCurrency = "SDG", currentExchangeRates = DEFAULT_BASELINE_EXCHANGE_RATES, mode = "historical", anchorCurrency = "USD") {
	const txCurrency = (tx.currency || "SDG").toString().toUpperCase().trim();
	const target = (targetCurrency || "SDG").toString().toUpperCase().trim();
	const anchor = (anchorCurrency || "USD").toString().toUpperCase().trim();
	const liveRates = {
		...DEFAULT_BASELINE_EXCHANGE_RATES,
		...currentExchangeRates || {},
		SDG: 1
	};
	const snapshotRates = {
		...DEFAULT_BASELINE_EXCHANGE_RATES,
		...tx.exchangeRatesSnapshot || {},
		SDG: 1
	};
	if (tx.exchangeRateUsed && tx.exchangeRateUsed > 0) {
		if (txCurrency !== "SDG") snapshotRates[txCurrency] = Number(tx.exchangeRateUsed);
		else snapshotRates[anchor] = Number(tx.exchangeRateUsed);
	}
	const convertAmount = (amount, evalMode) => {
		if (!Number.isFinite(amount) || amount <= 0) return 0;
		if (evalMode === "historical") return convertCurrencyAmount(amount, txCurrency, target, snapshotRates);
		if (evalMode === "indexed") {
			const txRateSnapshot = txCurrency === "SDG" ? 1 : snapshotRates[txCurrency] && snapshotRates[txCurrency] > 0 ? Number(snapshotRates[txCurrency]) : 1;
			const anchorRateSnapshot = anchor === "SDG" ? 1 : snapshotRates[anchor] && snapshotRates[anchor] > 0 ? Number(snapshotRates[anchor]) : 1;
			const anchorAmountRaw = amount * txRateSnapshot / anchorRateSnapshot;
			const anchorRateLive = anchor === "SDG" ? 1 : liveRates[anchor] && liveRates[anchor] > 0 ? Number(liveRates[anchor]) : 1;
			const targetRateLive = target === "SDG" ? 1 : liveRates[target] && liveRates[target] > 0 ? Number(liveRates[target]) : 1;
			return roundCurrencyValue(anchorAmountRaw * anchorRateLive / targetRateLive);
		}
		return convertCurrencyAmount(amount, txCurrency, target, liveRates);
	};
	const rawPaid = tx.amountPaid !== void 0 ? tx.amountPaid : tx.grandTotal;
	const rawDebt = tx.debtAmount || 0;
	const subtotal = convertAmount(tx.subtotal, mode);
	const taxAmount = convertAmount(tx.taxAmount, mode);
	const discountAmount = convertAmount(tx.discountAmount, mode);
	const grandTotal = convertAmount(tx.grandTotal, mode);
	const amountPaid = convertAmount(rawPaid, mode);
	const debtAmount = convertAmount(rawDebt, mode);
	const amountTendered = convertAmount(tx.amountTendered, mode);
	const changeDue = convertAmount(tx.changeDue, mode);
	const items = tx.items.map((item) => ({
		...item,
		unitPrice: convertAmount(item.unitPrice, mode),
		total: convertAmount(item.total, mode)
	}));
	const historicalGrandTotal = convertAmount(tx.grandTotal, "historical");
	const liveGrandTotal = convertAmount(tx.grandTotal, "live");
	const indexedGrandTotal = convertAmount(tx.grandTotal, "indexed");
	const rateDifference = roundCurrencyValue(grandTotal - historicalGrandTotal);
	const referenceCurrency = target !== "SDG" ? target : anchor;
	const historicalRate = referenceCurrency === "SDG" ? 1 : Number(snapshotRates[referenceCurrency] || 1);
	const currentRate = referenceCurrency === "SDG" ? 1 : Number(liveRates[referenceCurrency] || 1);
	return {
		currency: target,
		originalCurrency: txCurrency,
		subtotal,
		taxAmount,
		discountAmount,
		grandTotal,
		amountPaid,
		debtAmount,
		amountTendered,
		changeDue,
		items,
		historicalGrandTotal,
		liveGrandTotal,
		indexedGrandTotal,
		rateDifference,
		referenceCurrency,
		historicalRate,
		currentRate,
		hasRateChanged: Math.abs(currentRate - historicalRate) > 1e-4
	};
}
/**
* Locks and saves a specific sale-time exchange rate onto a transaction without altering its original sale amounts,
* ensuring the invoice remains permanently saved at the exchange rate at which the sale was made.
*/
function lockTransactionSaleExchangeRate(tx, saleRateToSdg, referenceCurrency = "USD") {
	const safeRate = Number.isFinite(saleRateToSdg) && saleRateToSdg > 0 ? Number(saleRateToSdg) : 2700;
	const txCurrency = (tx.currency || "SDG").toString().toUpperCase().trim();
	const refCurr = (txCurrency !== "SDG" ? txCurrency : referenceCurrency || "USD").toString().toUpperCase().trim();
	const existingSnapshot = {
		...DEFAULT_BASELINE_EXCHANGE_RATES,
		...tx.exchangeRatesSnapshot || {},
		SDG: 1
	};
	const oldRefRate = existingSnapshot[refCurr] && existingSnapshot[refCurr] > 0 ? existingSnapshot[refCurr] : DEFAULT_BASELINE_EXCHANGE_RATES[refCurr] || 2700;
	const scaleFactor = oldRefRate > 0 ? safeRate / oldRefRate : 1;
	const updatedSnapshot = {
		...existingSnapshot,
		SDG: 1
	};
	for (const [code, val] of Object.entries(existingSnapshot)) if (code === "SDG") updatedSnapshot[code] = 1;
	else if (code === refCurr) updatedSnapshot[code] = roundCurrencyValue(safeRate);
	else if (Number.isFinite(val) && val > 0) updatedSnapshot[code] = roundCurrencyValue(val * scaleFactor);
	updatedSnapshot[refCurr] = roundCurrencyValue(safeRate);
	return {
		...tx,
		exchangeRateUsed: roundCurrencyValue(safeRate),
		exchangeRatesSnapshot: updatedSnapshot
	};
}
/**
* Re-prices a transaction's stored monetary values and remaining debt to the current exchange rate
* (anchored against anchorCurrency, e.g. USD) and updates its exchangeRatesSnapshot.
*/
function repriceTransactionToNewRate(tx, currentExchangeRates, anchorCurrency = "USD") {
	const txCurrency = (tx.currency || "SDG").toString().toUpperCase().trim();
	const indexedViewInTxCurrency = getConvertedTransactionView(tx, txCurrency, currentExchangeRates, "indexed", anchorCurrency);
	const liveRates = {
		...DEFAULT_BASELINE_EXCHANGE_RATES,
		...currentExchangeRates || {},
		SDG: 1
	};
	const anchor = (anchorCurrency || "USD").toString().toUpperCase().trim();
	const nextRateUsed = txCurrency === "SDG" ? Number(liveRates[anchor] || 2700) : Number(liveRates[txCurrency] || 1);
	return {
		...tx,
		currency: txCurrency,
		subtotal: indexedViewInTxCurrency.subtotal,
		taxAmount: indexedViewInTxCurrency.taxAmount,
		discountAmount: indexedViewInTxCurrency.discountAmount,
		grandTotal: indexedViewInTxCurrency.grandTotal,
		amountPaid: indexedViewInTxCurrency.amountPaid,
		debtAmount: indexedViewInTxCurrency.debtAmount,
		amountTendered: indexedViewInTxCurrency.amountTendered,
		changeDue: indexedViewInTxCurrency.changeDue,
		items: indexedViewInTxCurrency.items,
		exchangeRateUsed: nextRateUsed,
		exchangeRatesSnapshot: liveRates
	};
}
/**
* Returns all unique receipt notification images attached to a transaction
* (including initial transferReceiptImage, transferReceiptImages array, and all debtPayments installments).
*/
function getAllTransactionReceiptImages(tx) {
	if (!tx) return [];
	const list = [];
	if (tx.transferReceiptImage && tx.transferReceiptImage.trim()) list.push(tx.transferReceiptImage.trim());
	if (Array.isArray(tx.transferReceiptImages)) {
		for (const img of tx.transferReceiptImages) if (img && img.trim() && !list.includes(img.trim())) list.push(img.trim());
	}
	if (Array.isArray(tx.debtPayments)) {
		for (const payment of tx.debtPayments) if (Array.isArray(payment.receiptImages)) {
			for (const img of payment.receiptImages) if (img && img.trim() && !list.includes(img.trim())) list.push(img.trim());
		}
	}
	return list;
}
/**
* Applies a customizable debt installment or full settlement to a Transaction,
* supporting custom amount paid, custom total paid, payment method selection,
* transfer reference, and attaching multiple receipt notification images across installments.
*/
function applyDebtSettlementPayment(tx, input = {}, currentExchangeRates = DEFAULT_BASELINE_EXCHANGE_RATES) {
	let baseTx = input.useIndexedNewRate ? repriceTransactionToNewRate(tx, currentExchangeRates, input.anchorCurrency || "USD") : tx;
	if (input.customSaleExchangeRate && input.customSaleExchangeRate > 0) baseTx = lockTransactionSaleExchangeRate(baseTx, input.customSaleExchangeRate, input.anchorCurrency || "USD");
	const txCurrency = (baseTx.currency || "SDG").toString().toUpperCase().trim();
	const displayCurr = (input.displayCurrency || txCurrency).toString().toUpperCase().trim();
	const anchor = (input.anchorCurrency || "USD").toString().toUpperCase().trim();
	const conversionRatesMap = input.useIndexedNewRate ? {
		...DEFAULT_BASELINE_EXCHANGE_RATES,
		...currentExchangeRates || {},
		SDG: 1
	} : {
		...DEFAULT_BASELINE_EXCHANGE_RATES,
		...baseTx.exchangeRatesSnapshot || {},
		...baseTx.exchangeRateUsed && baseTx.exchangeRateUsed > 0 ? { [txCurrency !== "SDG" ? txCurrency : anchor]: Number(baseTx.exchangeRateUsed) } : {},
		SDG: 1
	};
	const grandTotal = Math.max(0, roundCurrencyValue(baseTx.grandTotal));
	const previousPaid = Math.max(0, roundCurrencyValue(baseTx.amountPaid !== void 0 ? baseTx.amountPaid : Math.max(0, grandTotal - (baseTx.debtAmount || 0))));
	const previousDebt = Math.max(0, roundCurrencyValue(grandTotal - previousPaid));
	let nextTotalPaid = grandTotal;
	let installmentPaid = previousDebt;
	if (input.customTotalPaidInDisplayCurrency !== void 0 && Number.isFinite(input.customTotalPaidInDisplayCurrency)) {
		const customTotalInTx = displayCurr === txCurrency ? input.customTotalPaidInDisplayCurrency : convertCurrencyAmount(input.customTotalPaidInDisplayCurrency, displayCurr, txCurrency, conversionRatesMap);
		nextTotalPaid = roundCurrencyValue(Math.max(0, Math.min(grandTotal, customTotalInTx)));
		installmentPaid = roundCurrencyValue(Math.max(0, nextTotalPaid - previousPaid));
	} else if (input.amountPaidInDisplayCurrency !== void 0 && Number.isFinite(input.amountPaidInDisplayCurrency)) {
		const rawInstallmentInTx = displayCurr === txCurrency ? input.amountPaidInDisplayCurrency : convertCurrencyAmount(input.amountPaidInDisplayCurrency, displayCurr, txCurrency, conversionRatesMap);
		const snappedInstallment = Math.abs(rawInstallmentInTx - previousDebt) <= .02 ? previousDebt : rawInstallmentInTx;
		installmentPaid = roundCurrencyValue(Math.max(0, Math.min(previousDebt, snappedInstallment)));
		nextTotalPaid = roundCurrencyValue(Math.min(grandTotal, previousPaid + installmentPaid));
	}
	const nextRemainingDebt = Math.max(0, roundCurrencyValue(grandTotal - nextTotalPaid));
	const nextStatus = nextRemainingDebt <= 0 ? "paid" : nextTotalPaid <= 0 ? "unpaid" : "partial";
	const chosenMethod = input.paymentMethod || baseTx.paymentMethod || "cash";
	const cleanRef = input.transferReference?.trim() || baseTx.transferReference;
	const newImages = (input.receiptImages || []).map((img) => img.trim()).filter((img) => img.length > 0);
	const paymentRecord = {
		id: `debt_pay_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		amountPaid: installmentPaid > 0 ? installmentPaid : nextTotalPaid,
		remainingDebtAfter: nextRemainingDebt,
		paymentMethod: chosenMethod,
		transferReference: input.transferReference?.trim() || void 0,
		receiptImages: newImages.length > 0 ? newImages : void 0,
		note: input.note?.trim() || void 0
	};
	const existingPayments = Array.isArray(baseTx.debtPayments) ? baseTx.debtPayments : [];
	const combinedReceiptImages = getAllTransactionReceiptImages({
		transferReceiptImage: baseTx.transferReceiptImage,
		transferReceiptImages: baseTx.transferReceiptImages,
		debtPayments: [...existingPayments, paymentRecord]
	});
	const settledDeltaInTxCurrency = roundCurrencyValue(nextTotalPaid - previousPaid);
	return {
		updatedTransaction: {
			...baseTx,
			paymentMethod: chosenMethod,
			paymentStatus: nextStatus,
			amountPaid: nextTotalPaid,
			debtAmount: nextRemainingDebt,
			amountTendered: Math.max(baseTx.amountTendered || 0, nextTotalPaid),
			transferReference: cleanRef,
			transferReceiptImage: newImages[newImages.length - 1] || baseTx.transferReceiptImage || combinedReceiptImages[0] || void 0,
			transferReceiptImages: combinedReceiptImages,
			debtPayments: [...existingPayments, paymentRecord]
		},
		paymentRecord,
		settledDeltaInTxCurrency
	};
}
var HISTORICAL_BASELINE_RATES_TO_SDG = {
	SDG: 1,
	USD: 2500,
	SAR: 670,
	AED: 680,
	EUR: 2700,
	GBP: 3150
};
/**
* Computes store performance metrics, badges, and per-product sales + multi-currency price analytics.
*/
function computeStoreReportAnalytics(transactions, products, stockMovements = [], targetCurrency = "SDG", currentExchangeRates = DEFAULT_BASELINE_EXCHANGE_RATES, valuationMode = "indexed", anchorCurrency = "USD") {
	const completedTx = transactions.filter((t) => t.status === "completed");
	const liveRates = {
		...DEFAULT_BASELINE_EXCHANGE_RATES,
		...currentExchangeRates || {},
		SDG: 1
	};
	let grossSales = 0;
	let collectedSales = 0;
	let outstandingDebt = 0;
	let totalTaxCollected = 0;
	let totalDiscountsGiven = 0;
	let estimatedCost = 0;
	let receivedCount = 0;
	let pendingGoodsCount = 0;
	let pendingInvoiceCount = 0;
	const paymentCounts = {
		bank_transfer: {
			count: 0,
			total: 0,
			sharePercent: 0
		},
		cash: {
			count: 0,
			total: 0,
			sharePercent: 0
		},
		qr_nfc: {
			count: 0,
			total: 0,
			sharePercent: 0
		}
	};
	const prodStatsMap = {};
	for (const p of products) prodStatsMap[p.id] = {
		units: 0,
		orders: 0,
		revenue: 0,
		cost: 0,
		trend: []
	};
	const chronologicalTx = [...completedTx].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
	for (const tx of chronologicalTx) {
		const view = getConvertedTransactionView(tx, targetCurrency, liveRates, valuationMode, anchorCurrency);
		grossSales += view.grandTotal;
		collectedSales += view.amountPaid;
		outstandingDebt += view.debtAmount;
		totalTaxCollected += view.taxAmount;
		totalDiscountsGiven += view.discountAmount;
		const fStatus = tx.fulfillmentStatus || "received";
		if (fStatus === "pending_goods") pendingGoodsCount += 1;
		else if (fStatus === "pending_invoice") pendingInvoiceCount += 1;
		else receivedCount += 1;
		const methodKey = tx.paymentMethod === "card" ? "bank_transfer" : tx.paymentMethod;
		if (paymentCounts[methodKey]) {
			paymentCounts[methodKey].count += 1;
			paymentCounts[methodKey].total = roundCurrencyValue(paymentCounts[methodKey].total + view.grandTotal);
		}
		const seenInThisTx = /* @__PURE__ */ new Set();
		for (const item of view.items) {
			const prod = products.find((p) => p.id === item.productId);
			const lineCost = roundCurrencyValue((prod ? getProductPricesInCurrency(prod, targetCurrency, liveRates).costPrice : roundCurrencyValue(item.unitPrice * .45)) * item.quantity);
			estimatedCost += lineCost;
			if (!prodStatsMap[item.productId]) prodStatsMap[item.productId] = {
				units: 0,
				orders: 0,
				revenue: 0,
				cost: 0,
				trend: []
			};
			prodStatsMap[item.productId].units += item.quantity;
			prodStatsMap[item.productId].revenue = roundCurrencyValue(prodStatsMap[item.productId].revenue + item.total);
			prodStatsMap[item.productId].cost = roundCurrencyValue(prodStatsMap[item.productId].cost + lineCost);
			prodStatsMap[item.productId].trend.push(item.quantity);
			if (!seenInThisTx.has(item.productId)) {
				prodStatsMap[item.productId].orders += 1;
				seenInThisTx.add(item.productId);
			}
		}
	}
	grossSales = roundCurrencyValue(grossSales);
	collectedSales = roundCurrencyValue(collectedSales);
	outstandingDebt = roundCurrencyValue(outstandingDebt);
	totalTaxCollected = roundCurrencyValue(totalTaxCollected);
	totalDiscountsGiven = roundCurrencyValue(totalDiscountsGiven);
	estimatedCost = roundCurrencyValue(estimatedCost);
	const netGrossProfit = roundCurrencyValue(Math.max(0, grossSales - estimatedCost - totalTaxCollected));
	const avgOrderValue = completedTx.length > 0 ? roundCurrencyValue(grossSales / completedTx.length) : 0;
	const profitMarginPercent = grossSales > 0 ? Math.round(netGrossProfit / grossSales * 1e3) / 10 : 0;
	const collectionRatePercent = grossSales > 0 ? Math.round(collectedSales / grossSales * 1e3) / 10 : 100;
	const totalPendingCount = pendingGoodsCount + pendingInvoiceCount;
	const fulfillmentRatePercent = completedTx.length > 0 ? Math.round(receivedCount / completedTx.length * 1e3) / 10 : 100;
	const supplierGoodsReceiptsCount = stockMovements.filter((m) => m.type === "restock").length;
	let healthySkus = 0;
	let lowStockSkus = 0;
	let outOfStockSkus = 0;
	for (const p of products) if (p.stock <= 0) outOfStockSkus += 1;
	else if (p.stock <= p.minStockAlert) lowStockSkus += 1;
	else healthySkus += 1;
	const readinessPercent = products.length > 0 ? Math.round(healthySkus / products.length * 1e3) / 10 : 100;
	for (const key of Object.keys(paymentCounts)) paymentCounts[key].sharePercent = grossSales > 0 ? Math.round(paymentCounts[key].total / grossSales * 1e3) / 10 : 0;
	const classifyBadge = (pct, excellentThreshold, goodThreshold) => {
		if (pct >= excellentThreshold) return "excellent";
		if (pct >= goodThreshold) return "good";
		return "warning";
	};
	const comparisonCurrencies = [
		"SDG",
		"USD",
		"SAR",
		"AED",
		"EUR"
	];
	const productReports = products.map((p) => {
		const stat = prodStatsMap[p.id] || {
			units: 0,
			orders: 0,
			revenue: 0,
			cost: 0,
			trend: []
		};
		const convertedCurrent = getProductPricesInCurrency(p, targetCurrency, liveRates);
		const prodSourceCurrency = (p.priceCurrency || p.customFields?.priceCurrency || "SDG").toString().toUpperCase().trim();
		let historicalUnitPriceInSdg = 0;
		let currentUnitPriceInSdg = 0;
		if (prodSourceCurrency !== "SDG") {
			historicalUnitPriceInSdg = convertCurrencyAmount(p.sellingPrice, prodSourceCurrency, "SDG", HISTORICAL_BASELINE_RATES_TO_SDG);
			currentUnitPriceInSdg = convertCurrencyAmount(p.sellingPrice, prodSourceCurrency, "SDG", liveRates);
		} else {
			const usdBaseline = HISTORICAL_BASELINE_RATES_TO_SDG[anchorCurrency] || 2500;
			const usdCurrent = liveRates[anchorCurrency] || 2700;
			const basePriceInSdg = p.sellingPrice < 100 ? p.sellingPrice * usdBaseline : p.sellingPrice;
			historicalUnitPriceInSdg = roundCurrencyValue(basePriceInSdg);
			currentUnitPriceInSdg = roundCurrencyValue(basePriceInSdg / usdBaseline * usdCurrent);
		}
		const pricesByCurrency = {};
		const revenuesByCurrency = {};
		for (const code of comparisonCurrencies) {
			pricesByCurrency[code] = prodSourceCurrency === "SDG" && p.sellingPrice < 100 ? convertCurrencyAmount(currentUnitPriceInSdg, "SDG", code, liveRates) : getProductPricesInCurrency(p, code, liveRates).sellingPrice;
			revenuesByCurrency[code] = convertCurrencyAmount(stat.revenue, targetCurrency, code, liveRates);
		}
		const priceChangeDeltaInSdg = roundCurrencyValue(currentUnitPriceInSdg - historicalUnitPriceInSdg);
		const priceChangePercentInSdg = historicalUnitPriceInSdg > 0 ? Math.round(priceChangeDeltaInSdg / historicalUnitPriceInSdg * 1e3) / 10 : 0;
		const netProfit = roundCurrencyValue(Math.max(0, stat.revenue - stat.cost));
		const marginPercent = stat.revenue > 0 ? Math.round(netProfit / stat.revenue * 1e3) / 10 : convertedCurrent.marginPercent;
		const revenueSharePercent = grossSales > 0 ? Math.round(stat.revenue / grossSales * 1e3) / 10 : 0;
		const trendPoints = stat.trend.length > 0 ? stat.trend : [0];
		return {
			productId: p.id,
			name: p.name,
			nameAr: p.nameAr,
			sku: p.sku,
			emoji: p.emoji,
			stock: p.stock,
			minStockAlert: p.minStockAlert,
			unitsSold: stat.units,
			orderCount: stat.orders,
			revenue: stat.revenue,
			estimatedCost: stat.cost,
			netProfit,
			marginPercent,
			revenueSharePercent,
			unitPriceInActiveCurrency: convertedCurrent.sellingPrice,
			pricesByCurrency,
			revenuesByCurrency,
			historicalUnitPriceInSdg,
			currentUnitPriceInSdg,
			priceChangeDeltaInSdg,
			priceChangePercentInSdg,
			salesTrendPoints: trendPoints
		};
	}).sort((a, b) => b.unitsSold - a.unitsSold || b.revenue - a.revenue);
	return {
		currency: targetCurrency,
		grossSales,
		collectedSales,
		outstandingDebt,
		totalTaxCollected,
		totalDiscountsGiven,
		estimatedCost,
		netGrossProfit,
		avgOrderValue,
		totalOrders: completedTx.length,
		profitMarginPercent,
		collectionRatePercent,
		fulfillmentStats: {
			receivedCount,
			pendingGoodsCount,
			pendingInvoiceCount,
			totalPendingCount,
			fulfillmentRatePercent,
			supplierGoodsReceiptsCount
		},
		inventoryHealth: {
			totalSkus: products.length,
			healthySkus,
			lowStockSkus,
			outOfStockSkus,
			readinessPercent
		},
		performanceBadges: {
			profit: {
				level: classifyBadge(profitMarginPercent, 45, 25),
				valuePercent: profitMarginPercent
			},
			collection: {
				level: classifyBadge(collectionRatePercent, 85, 60),
				valuePercent: collectionRatePercent
			},
			fulfillment: {
				level: classifyBadge(fulfillmentRatePercent, 90, 70),
				valuePercent: fulfillmentRatePercent
			},
			inventory: {
				level: classifyBadge(readinessPercent, 80, 60),
				valuePercent: readinessPercent
			}
		},
		paymentCounts,
		productReports
	};
}
/**
* Computes exchange rate fluctuation badges and historical rate trend series for all foreign currencies.
*/
function computeExchangeRateFluctuationSummary(currentExchangeRates = DEFAULT_BASELINE_EXCHANGE_RATES, rateHistory = [], baselineRates = HISTORICAL_BASELINE_RATES_TO_SDG) {
	const liveRates = {
		...DEFAULT_BASELINE_EXCHANGE_RATES,
		...currentExchangeRates || {},
		SDG: 1
	};
	return Array.from(/* @__PURE__ */ new Set([
		"USD",
		"SAR",
		"AED",
		"EUR",
		"GBP",
		...Object.keys(liveRates).filter((c) => c.toUpperCase() !== "SDG")
	])).map((code) => {
		const cleanCode = code.toUpperCase().trim();
		const currentRate = Number(liveRates[cleanCode] || 1);
		const baselineRate = Number(baselineRates[cleanCode] || Math.round(currentRate * .92 * 100) / 100 || currentRate);
		const matchingHistory = rateHistory.filter((h) => h.currency.toUpperCase() === cleanCode).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
		const lastEntry = matchingHistory.length > 0 ? matchingHistory[matchingHistory.length - 1] : void 0;
		const previousRate = lastEntry && Math.abs(lastEntry.previousRate - currentRate) > 1e-4 ? lastEntry.previousRate : baselineRate;
		const delta = roundCurrencyValue(currentRate - previousRate);
		const changePercent = previousRate > 0 ? Math.round(delta / previousRate * 1e3) / 10 : 0;
		const direction = changePercent > .05 ? "up" : changePercent < -.05 ? "down" : "stable";
		const rawPoints = [
			baselineRate,
			...matchingHistory.map((h) => h.newRate),
			currentRate
		];
		return {
			currency: cleanCode,
			baselineRate,
			previousRate,
			currentRate,
			delta,
			changePercent,
			direction,
			historyPoints: rawPoints.length >= 4 ? rawPoints.slice(-6) : [
				Math.round(baselineRate * .96 * 100) / 100,
				baselineRate,
				Math.round((baselineRate + currentRate) / 2 * 100) / 100,
				currentRate
			],
			lastUpdated: lastEntry?.timestamp
		};
	});
}
function toLocalDateKey(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
/**
* Aggregates completed transactions into chronological daily revenue buckets for D3 visualization,
* identifying performance peaks, daily averages, and period-over-period momentum in the active currency.
*/
function computeDailyRevenueTrends(transactions, daysCount = 7, targetCurrency = "SDG", currentExchangeRates = DEFAULT_BASELINE_EXCHANGE_RATES, valuationMode = "historical", language = "en", referenceDate = /* @__PURE__ */ new Date(), anchorCurrency = "USD") {
	const safeDays = Math.max(2, Math.min(90, Math.floor(daysCount || 7)));
	const localeCode = language === "ar" ? "ar-SA" : "en-US";
	const endDay = new Date(referenceDate);
	endDay.setHours(0, 0, 0, 0);
	const todayKey = toLocalDateKey(endDay);
	const bucketsMap = /* @__PURE__ */ new Map();
	for (let i = safeDays - 1; i >= 0; i--) {
		const d = new Date(endDay);
		d.setDate(endDay.getDate() - i);
		const key = toLocalDateKey(d);
		bucketsMap.set(key, {
			date: d,
			revenue: 0,
			collected: 0,
			debt: 0,
			transactionCount: 0
		});
	}
	const completedTx = (transactions || []).filter((t) => t && t.status === "completed");
	for (const tx of completedTx) {
		const txDate = new Date(tx.timestamp);
		if (isNaN(txDate.getTime())) continue;
		const key = toLocalDateKey(txDate);
		const bucket = bucketsMap.get(key);
		if (!bucket) continue;
		const converted = getConvertedTransactionView(tx, targetCurrency, currentExchangeRates, valuationMode, anchorCurrency);
		bucket.revenue = roundCurrencyValue(bucket.revenue + converted.grandTotal);
		bucket.collected = roundCurrencyValue(bucket.collected + converted.amountPaid);
		bucket.debt = roundCurrencyValue(bucket.debt + converted.debtAmount);
		bucket.transactionCount += 1;
	}
	let maxRevenue = 0;
	let peakKey = null;
	for (const [key, bucket] of bucketsMap.entries()) if (bucket.revenue > maxRevenue) {
		maxRevenue = bucket.revenue;
		peakKey = key;
	}
	let totalRevenue = 0;
	let totalCollected = 0;
	let totalDebt = 0;
	let totalTransactions = 0;
	let activeDaysCount = 0;
	const points = [];
	for (const [key, bucket] of bucketsMap.entries()) {
		const avgOrderValue = bucket.transactionCount > 0 ? roundCurrencyValue(bucket.revenue / bucket.transactionCount) : 0;
		const isPeak = peakKey !== null && key === peakKey && bucket.revenue > 0;
		const isToday = key === todayKey;
		const label = bucket.date.toLocaleDateString(localeCode, {
			month: "short",
			day: "numeric"
		});
		const weekdayLabel = bucket.date.toLocaleDateString(localeCode, { weekday: "short" });
		totalRevenue = roundCurrencyValue(totalRevenue + bucket.revenue);
		totalCollected = roundCurrencyValue(totalCollected + bucket.collected);
		totalDebt = roundCurrencyValue(totalDebt + bucket.debt);
		totalTransactions += bucket.transactionCount;
		if (bucket.revenue > 0) activeDaysCount += 1;
		points.push({
			dateKey: key,
			timestamp: bucket.date.toISOString(),
			label,
			weekdayLabel,
			revenue: bucket.revenue,
			collected: bucket.collected,
			debt: bucket.debt,
			transactionCount: bucket.transactionCount,
			avgOrderValue,
			isPeak,
			isToday
		});
	}
	const peakPoint = points.find((p) => p.isPeak) || null;
	const averageDailyRevenue = roundCurrencyValue(totalRevenue / safeDays);
	const activeDaysAverageRevenue = activeDaysCount > 0 ? roundCurrencyValue(totalRevenue / activeDaysCount) : 0;
	const halfIndex = Math.floor(points.length / 2);
	const firstHalfRev = points.slice(0, halfIndex).reduce((acc, p) => acc + p.revenue, 0);
	const secondHalfRev = points.slice(halfIndex).reduce((acc, p) => acc + p.revenue, 0);
	const firstHalfAvg = halfIndex > 0 ? firstHalfRev / halfIndex : 0;
	const secondHalfAvg = secondHalfRev / Math.max(1, points.length - halfIndex);
	const growthPercent = firstHalfAvg > 0 ? Math.round((secondHalfAvg - firstHalfAvg) / firstHalfAvg * 1e3) / 10 : secondHalfAvg > 0 ? 100 : 0;
	return {
		points,
		peakPoint,
		totalRevenue,
		totalCollected,
		totalDebt,
		averageDailyRevenue,
		activeDaysAverageRevenue,
		totalTransactions,
		growthPercent
	};
}
/**
* Pure, side-effect-free atomic state transition for POS Checkout.
* Computes updated products, stock movements, customer balances, and transactions
* in a single deterministic pass so all four slices transition atomically inside a reducer.
*/
function computeAtomicCheckoutStateTransition(state, payload) {
	const { cart, newTransaction, selectedCustomerId, grandTotal, debtAmount, currency, exchangeRates, language } = payload;
	if (state.transactions.some((t) => t.id === newTransaction.id)) return {
		...state,
		createdMovements: []
	};
	const timestampIso = payload.nowIso || newTransaction.timestamp || (/* @__PURE__ */ new Date()).toISOString();
	const createdMovements = [];
	const cartItemsByProductId = /* @__PURE__ */ new Map();
	for (const item of cart) {
		const prodId = item?.product?.id;
		if (!prodId) continue;
		const list = cartItemsByProductId.get(prodId);
		if (list) list.push(item);
		else cartItemsByProductId.set(prodId, [item]);
	}
	return {
		products: state.products.map((prod) => {
			const matchingCartItems = cartItemsByProductId.get(prod.id);
			if (!matchingCartItems || matchingCartItems.length === 0) return prod;
			let totalStockUnitsRequired = 0;
			const reasonSegments = [];
			for (const cartItem of matchingCartItems) {
				const pricing = getCartItemUnitPricing({
					...cartItem,
					product: prod
				}, currency, exchangeRates, language);
				totalStockUnitsRequired += pricing.totalStockUnitsRequired;
				reasonSegments.push(`${cartItem.quantity} × ${pricing.unitLabel}`);
			}
			const updatedStock = Math.max(0, prod.stock - totalStockUnitsRequired);
			createdMovements.push({
				id: `mov_${Date.parse(timestampIso) || Date.now()}_${prod.id}_${newTransaction.id}`,
				timestamp: timestampIso,
				productId: prod.id,
				productName: prod.name,
				type: "sale",
				quantityChange: -totalStockUnitsRequired,
				previousStock: prod.stock,
				newStock: updatedStock,
				reason: `POS Checkout (${newTransaction.id}) — ${reasonSegments.join(", ")}`,
				referenceId: newTransaction.id
			});
			return {
				...prod,
				stock: updatedStock,
				updatedAt: timestampIso
			};
		}),
		stockMovements: createdMovements.length > 0 ? [...createdMovements, ...state.stockMovements] : state.stockMovements,
		customers: selectedCustomerId ? state.customers.map((cust) => {
			if (cust.id !== selectedCustomerId) return cust;
			const addedPoints = Math.floor(grandTotal);
			const prevDebt = cust.totalDebt || 0;
			return {
				...cust,
				totalSpent: Math.round((cust.totalSpent + grandTotal) * 100) / 100,
				totalDebt: Math.round((prevDebt + debtAmount) * 100) / 100,
				transactionCount: cust.transactionCount + 1,
				loyaltyPoints: cust.loyaltyPoints + addedPoints
			};
		}) : state.customers,
		transactions: [newTransaction, ...state.transactions],
		createdMovements
	};
}
/**
* Pure, side-effect-free atomic state transition for voiding a transaction.
* Restores product stock, records restock audit movements, marks the transaction voided,
* and reverses customer spent/debt/loyalty balances in one atomic pass.
*/
function computeAtomicVoidTransactionStateTransition(state, payload) {
	const txn = state.transactions.find((t) => t.id === payload.transactionId);
	if (!txn || txn.status === "voided") return {
		...state,
		voided: false,
		returnMovements: []
	};
	const timestampIso = payload.nowIso || (/* @__PURE__ */ new Date()).toISOString();
	const returnMovements = [];
	const unitsToRestoreByProductId = /* @__PURE__ */ new Map();
	for (const item of txn.items) {
		if (!item?.productId) continue;
		const units = item.stockDeducted ?? item.quantity;
		unitsToRestoreByProductId.set(item.productId, (unitsToRestoreByProductId.get(item.productId) || 0) + units);
	}
	const nextProducts = state.products.map((prod) => {
		const unitsToRestore = unitsToRestoreByProductId.get(prod.id);
		if (unitsToRestore === void 0) return prod;
		const restoredStock = prod.stock + unitsToRestore;
		returnMovements.push({
			id: `mov_void_${Date.parse(timestampIso) || Date.now()}_${prod.id}_${txn.id}`,
			timestamp: timestampIso,
			productId: prod.id,
			productName: prod.name,
			type: "restock",
			quantityChange: unitsToRestore,
			previousStock: prod.stock,
			newStock: restoredStock,
			reason: `Transaction Void/Refund (${txn.id})`,
			referenceId: txn.id
		});
		return {
			...prod,
			stock: restoredStock,
			updatedAt: timestampIso
		};
	});
	const nextStockMovements = returnMovements.length > 0 ? [...returnMovements, ...state.stockMovements] : state.stockMovements;
	const nextTransactions = state.transactions.map((t) => t.id === payload.transactionId ? {
		...t,
		status: "voided"
	} : t);
	return {
		products: nextProducts,
		stockMovements: nextStockMovements,
		customers: txn.customerId ? state.customers.map((cust) => {
			if (cust.id !== txn.customerId) return cust;
			const prevDebt = cust.totalDebt || 0;
			const txnDebt = txn.debtAmount || 0;
			return {
				...cust,
				totalSpent: Math.max(0, Math.round((cust.totalSpent - txn.grandTotal) * 100) / 100),
				totalDebt: Math.max(0, Math.round((prevDebt - txnDebt) * 100) / 100),
				loyaltyPoints: Math.max(0, cust.loyaltyPoints - Math.floor(txn.grandTotal))
			};
		}) : state.customers,
		transactions: nextTransactions,
		voided: true,
		returnMovements
	};
}
// src/lib/exchange-rate-storage.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var EXCHANGE_RATES_STORAGE_KEY = "dqnamo_pos_exchange_rates_v1";
var EXCHANGE_RATE_ITEMS_STORAGE_KEY = "dqnamo_pos_exchange_rate_items_v1";
var EXCHANGE_RATE_INPUTS_STORAGE_KEY = "dqnamo_pos_exchange_rate_inputs_v1";
var CURRENCIES_STORAGE_KEY = "dqnamo_pos_currencies_v1";
var DEFAULT_EXCHANGE_RATES_MAP = {
	SDG: 1,
	USD: 2700,
	SAR: 720,
	AED: 735,
	EUR: 2950,
	GBP: 3450
};
var DEFAULT_CURRENCIES_LIST = [
	{
		code: "SDG",
		name: "Sudanese Pound",
		nameAr: "جنيه سوداني",
		symbol: "ج.س",
		decimalPlaces: 2,
		isBase: true,
		isActive: true
	},
	{
		code: "USD",
		name: "US Dollar",
		nameAr: "دولار أمريكي",
		symbol: "$",
		decimalPlaces: 2,
		isBase: false,
		isActive: true
	},
	{
		code: "SAR",
		name: "Saudi Riyal",
		nameAr: "ريال سعودي",
		symbol: "ر.س",
		decimalPlaces: 2,
		isBase: false,
		isActive: true
	},
	{
		code: "AED",
		name: "UAE Dirham",
		nameAr: "درهم إماراتي",
		symbol: "د.إ",
		decimalPlaces: 2,
		isBase: false,
		isActive: true
	},
	{
		code: "EUR",
		name: "Euro",
		nameAr: "يورو",
		symbol: "€",
		decimalPlaces: 2,
		isBase: false,
		isActive: true
	},
	{
		code: "GBP",
		name: "British Pound",
		nameAr: "جنيه إسترليني",
		symbol: "£",
		decimalPlaces: 2,
		isBase: false,
		isActive: true
	}
];
var CURRENCY_TEMPLATES = [
	{
		code: "SDG",
		name: "Sudanese Pound",
		nameAr: "جنيه سوداني",
		symbol: "ج.س",
		defaultRate: 1,
		keywords: [
			"جنيه سوداني",
			"سوداني",
			"ج.س",
			"جس",
			"sdg",
			"sudan"
		]
	},
	{
		code: "USD",
		name: "US Dollar",
		nameAr: "دولار أمريكي",
		symbol: "$",
		defaultRate: 2700,
		keywords: [
			"دولار أمريكي",
			"دولار امريكي",
			"دولار",
			"$",
			"usd",
			"dollar"
		]
	},
	{
		code: "SAR",
		name: "Saudi Riyal",
		nameAr: "ريال سعودي",
		symbol: "ر.س",
		defaultRate: 720,
		keywords: [
			"ريال سعودي",
			"سعودي",
			"ر.س",
			"رس",
			"sar",
			"saudi"
		]
	},
	{
		code: "AED",
		name: "UAE Dirham",
		nameAr: "درهم إماراتي",
		symbol: "د.إ",
		defaultRate: 735,
		keywords: [
			"درهم إماراتي",
			"درهم اماراتي",
			"درهم",
			"إماراتي",
			"اماراتي",
			"د.إ",
			"aed",
			"dirham"
		]
	},
	{
		code: "EGP",
		name: "Egyptian Pound",
		nameAr: "جنيه مصري",
		symbol: "ج.م",
		defaultRate: 55,
		keywords: [
			"جنيه مصري",
			"مصري",
			"ج.م",
			"جم",
			"egp",
			"egypt"
		]
	},
	{
		code: "QAR",
		name: "Qatari Riyal",
		nameAr: "ريال قطري",
		symbol: "ر.ق",
		defaultRate: 740,
		keywords: [
			"ريال قطري",
			"قطري",
			"ر.ق",
			"رق",
			"qar",
			"qatar"
		]
	},
	{
		code: "KWD",
		name: "Kuwaiti Dinar",
		nameAr: "دينار كويتي",
		symbol: "د.ك",
		defaultRate: 8800,
		keywords: [
			"دينار كويتي",
			"كويتي",
			"د.ك",
			"دك",
			"kwd",
			"kuwait"
		]
	},
	{
		code: "TRY",
		name: "Turkish Lira",
		nameAr: "ليرة تركية",
		symbol: "₺",
		defaultRate: 80,
		keywords: [
			"ليرة تركية",
			"ليره تركيه",
			"تركي",
			"تركية",
			"try",
			"tl",
			"turkish"
		]
	},
	{
		code: "ETB",
		name: "Ethiopian Birr",
		nameAr: "بير إثيوبي",
		symbol: "Br",
		defaultRate: 22,
		keywords: [
			"بير إثيوبي",
			"بير اثيوبي",
			"اثيوبي",
			"إثيوبي",
			"بير",
			"etb",
			"birr"
		]
	},
	{
		code: "LYD",
		name: "Libyan Dinar",
		nameAr: "دينار ليبي",
		symbol: "د.ل",
		defaultRate: 560,
		keywords: [
			"دينار ليبي",
			"ليبي",
			"د.ل",
			"دل",
			"lyd",
			"libya"
		]
	},
	{
		code: "JOD",
		name: "Jordanian Dinar",
		nameAr: "دينار أردني",
		symbol: "د.أ",
		defaultRate: 3800,
		keywords: [
			"دينار أردني",
			"دينار اردني",
			"اردني",
			"أردني",
			"د.أ",
			"jod",
			"jordan"
		]
	},
	{
		code: "OMR",
		name: "Omani Rial",
		nameAr: "ريال عماني",
		symbol: "ر.ع",
		defaultRate: 7e3,
		keywords: [
			"ريال عماني",
			"عماني",
			"ر.ع",
			"رع",
			"omr",
			"oman"
		]
	},
	{
		code: "BHD",
		name: "Bahraini Dinar",
		nameAr: "دينار بحريني",
		symbol: "د.ب",
		defaultRate: 7150,
		keywords: [
			"دينار بحريني",
			"بحريني",
			"د.ب",
			"دب",
			"bhd",
			"bahrain"
		]
	},
	{
		code: "CNY",
		name: "Chinese Yuan",
		nameAr: "يوان صيني",
		symbol: "¥",
		defaultRate: 375,
		keywords: [
			"يوان صيني",
			"يوان",
			"صيني",
			"رممبي",
			"cny",
			"rmb",
			"yuan"
		]
	},
	{
		code: "GBP",
		name: "British Pound",
		nameAr: "جنيه إسترليني",
		symbol: "£",
		defaultRate: 3450,
		keywords: [
			"جنيه إسترليني",
			"جنيه استرليني",
			"استرليني",
			"إسترليني",
			"gbp",
			"british"
		]
	},
	{
		code: "EUR",
		name: "Euro",
		nameAr: "يورو",
		symbol: "€",
		defaultRate: 2950,
		keywords: [
			"يورو",
			"€",
			"eur",
			"euro"
		]
	},
	{
		code: "CHF",
		name: "Swiss Franc",
		nameAr: "فرنك سويسري",
		symbol: "CHF",
		defaultRate: 3050,
		keywords: [
			"فرنك سويسري",
			"فرنك",
			"سويسري",
			"chf",
			"franc"
		]
	},
	{
		code: "INR",
		name: "Indian Rupee",
		nameAr: "روبية هندية",
		symbol: "₹",
		defaultRate: 32,
		keywords: [
			"روبية هندية",
			"روبيه",
			"روبية",
			"هندي",
			"inr",
			"rupee"
		]
	}
];
var ARABIC_TO_LATIN_MAP = {
	ا: "A",
	أ: "A",
	إ: "E",
	آ: "A",
	ب: "B",
	ت: "T",
	ث: "TH",
	ج: "J",
	ح: "H",
	خ: "KH",
	د: "D",
	ذ: "Z",
	ر: "R",
	ز: "Z",
	س: "S",
	ش: "SH",
	ص: "S",
	ض: "D",
	ط: "T",
	ظ: "Z",
	ع: "A",
	غ: "GH",
	ف: "F",
	ق: "Q",
	ك: "K",
	ل: "L",
	م: "M",
	ن: "N",
	ه: "H",
	و: "W",
	ي: "Y",
	ى: "A",
	ة: "H",
	ء: "A",
	ئ: "Y",
	ؤ: "W"
};
/**
* Transliterates an Arabic string into a 3-6 uppercase alphanumeric ASCII currency code.
*/
function transliterateToCurrencyCode(text) {
	const normalized = (text || "").trim();
	let out = "";
	for (const ch of normalized) if (/[A-Za-z0-9]/.test(ch)) out += ch.toUpperCase();
	else if (ARABIC_TO_LATIN_MAP[ch]) out += ARABIC_TO_LATIN_MAP[ch];
	const cleaned = out.replace(/[^A-Z0-9]/g, "").slice(0, 6);
	if (cleaned.length >= 2) return cleaned;
	return "";
}
/**
* Resolves user input for adding/editing a currency, supporting English ISO codes,
* Arabic currency names/symbols, and partial form inputs without failing.
*/
function resolveCurrencyInput(input) {
	const rawCode = (input.code || "").trim();
	const rawName = (input.name || "").trim();
	const rawNameAr = (input.nameAr || "").trim();
	const rawSymbol = (input.symbol || "").trim();
	const searchTerms = [
		rawCode,
		rawNameAr,
		rawName,
		rawSymbol
	].map((s) => s.toLowerCase().trim()).filter(Boolean);
	let matchedTemplate;
	for (const tpl of CURRENCY_TEMPLATES) {
		if (rawCode.toUpperCase() === tpl.code) {
			matchedTemplate = tpl;
			break;
		}
		if (searchTerms.some((term) => tpl.keywords.includes(term) || tpl.name.toLowerCase() === term || tpl.nameAr === term)) {
			matchedTemplate = tpl;
			break;
		}
	}
	let cleanCode = rawCode.toUpperCase().replace(/[^A-Z0-9]/g, "");
	if (cleanCode.length < 2 && matchedTemplate) cleanCode = matchedTemplate.code;
	if (cleanCode.length < 2) cleanCode = transliterateToCurrencyCode(rawCode) || transliterateToCurrencyCode(rawName) || transliterateToCurrencyCode(rawNameAr) || transliterateToCurrencyCode(rawSymbol);
	if (cleanCode.length > 6) cleanCode = cleanCode.slice(0, 6);
	const finalNameAr = rawNameAr || matchedTemplate?.nameAr || rawName || cleanCode;
	const finalName = rawName || matchedTemplate?.name || rawNameAr || cleanCode;
	const finalSymbol = (rawSymbol || matchedTemplate?.symbol || cleanCode).slice(0, 6);
	return {
		code: cleanCode,
		name: finalName,
		nameAr: finalNameAr,
		symbol: finalSymbol,
		suggestedRate: matchedTemplate?.defaultRate
	};
}
/**
* Load persisted currencies list from localStorage.
*/
function loadPersistedCurrencies(storage = typeof localStorage !== "undefined" ? localStorage : void 0) {
	if (!storage) return [...DEFAULT_CURRENCIES_LIST];
	try {
		const raw = storage.getItem(CURRENCIES_STORAGE_KEY);
		if (!raw) return [...DEFAULT_CURRENCIES_LIST];
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed) && parsed.length > 0) {
			const valid = parsed.filter((c) => Boolean(c && typeof c.code === "string" && c.code.trim().length >= 2));
			if (valid.length > 0) {
				if (!valid.some((c) => c.code === "SDG")) valid.unshift(DEFAULT_CURRENCIES_LIST[0]);
				return valid;
			}
		}
	} catch {}
	return [...DEFAULT_CURRENCIES_LIST];
}
/**
* Save currencies list to localStorage.
*/
function savePersistedCurrencies(currenciesList, storage = typeof localStorage !== "undefined" ? localStorage : void 0) {
	if (!storage) return;
	try {
		storage.setItem(CURRENCIES_STORAGE_KEY, JSON.stringify(currenciesList));
	} catch {}
}
/**
* Merge remote currencies with locally persisted currencies so newly added custom currencies
* in localStorage are preserved.
*/
function reconcileCurrenciesWithPersisted(remoteCurrencies, persistedCurrencies) {
	const map = /* @__PURE__ */ new Map();
	for (const c of remoteCurrencies) if (c && c.code && c.isActive !== false) map.set(c.code.toUpperCase(), c);
	for (const localCur of persistedCurrencies) {
		const code = localCur?.code?.toUpperCase();
		if (code && localCur.isActive !== false && !map.has(code)) map.set(code, localCur);
	}
	if (!map.has("SDG")) map.set("SDG", DEFAULT_CURRENCIES_LIST[0]);
	return Array.from(map.values());
}
/**
* Load persisted exchange rates map (currency code -> rate to SDG) from localStorage.
*/
function loadPersistedExchangeRates(storage = typeof localStorage !== "undefined" ? localStorage : void 0) {
	if (!storage) return { ...DEFAULT_EXCHANGE_RATES_MAP };
	try {
		const raw = storage.getItem(EXCHANGE_RATES_STORAGE_KEY);
		if (!raw) return { ...DEFAULT_EXCHANGE_RATES_MAP };
		const parsed = JSON.parse(raw);
		if (parsed && typeof parsed === "object") {
			const cleaned = { ...DEFAULT_EXCHANGE_RATES_MAP };
			for (const [k, v] of Object.entries(parsed)) {
				const num = Number(v);
				if (!isNaN(num) && isFinite(num) && num > 0) cleaned[k.toUpperCase()] = num;
			}
			cleaned.SDG = 1;
			return cleaned;
		}
	} catch {}
	return { ...DEFAULT_EXCHANGE_RATES_MAP };
}
/**
* Save exchange rates map to localStorage.
*/
function savePersistedExchangeRates(ratesMap, storage = typeof localStorage !== "undefined" ? localStorage : void 0) {
	if (!storage) return;
	try {
		storage.setItem(EXCHANGE_RATES_STORAGE_KEY, JSON.stringify({
			...ratesMap,
			SDG: 1
		}));
	} catch {}
}
/**
* Load persisted draft input strings per currency from localStorage so input fields
* never revert across state updates or component remounts.
*/
function loadPersistedRateInputs(storage = typeof localStorage !== "undefined" ? localStorage : void 0) {
	if (!storage) return {};
	try {
		const raw = storage.getItem(EXCHANGE_RATE_INPUTS_STORAGE_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		if (parsed && typeof parsed === "object") {
			const result = {};
			for (const [k, v] of Object.entries(parsed)) if (typeof v === "string") result[k.toUpperCase()] = v;
			return result;
		}
	} catch {}
	return {};
}
/**
* Save draft input strings per currency to localStorage.
*/
function savePersistedRateInputs(inputsMap, storage = typeof localStorage !== "undefined" ? localStorage : void 0) {
	if (!storage) return;
	try {
		storage.setItem(EXCHANGE_RATE_INPUTS_STORAGE_KEY, JSON.stringify(inputsMap));
	} catch {}
}
/**
* Load persisted ExchangeRateItem array from localStorage.
*/
function loadPersistedExchangeRateItems(storage = typeof localStorage !== "undefined" ? localStorage : void 0) {
	if (!storage) return [];
	try {
		const raw = storage.getItem(EXCHANGE_RATE_ITEMS_STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed)) return parsed;
	} catch {}
	return [];
}
/**
* Save ExchangeRateItem array to localStorage.
*/
function savePersistedExchangeRateItems(items, storage = typeof localStorage !== "undefined" ? localStorage : void 0) {
	if (!storage) return;
	try {
		storage.setItem(EXCHANGE_RATE_ITEMS_STORAGE_KEY, JSON.stringify(items));
	} catch {}
}
/**
* Merge incoming ExchangeRateItem[] with locally persisted rates map and active currencies so that
* user-persisted rates and newly added currencies in localStorage are never overwritten or dropped.
*/
function reconcileRatesWithPersisted(remoteItems, persistedMap, persistedItems = [], activeCurrencies = []) {
	const persistedItemMap = new Map(persistedItems.map((item) => [item.sourceCurrency.toUpperCase(), item]));
	const seenCodes = /* @__PURE__ */ new Set();
	const result = remoteItems.map((item) => {
		const code = item.sourceCurrency.toUpperCase();
		seenCodes.add(code);
		const localItem = persistedItemMap.get(code);
		const localRate = persistedMap[code];
		if (localItem && localItem.rate > 0) {
			if (new Date(localItem.effectiveFrom).getTime() >= new Date(item.effectiveFrom).getTime() || item.id.endsWith("-initial")) return {
				...item,
				rate: localItem.rate,
				inverseRate: Math.round(1 / localItem.rate * 1e6) / 1e6,
				effectiveFrom: localItem.effectiveFrom
			};
		} else if (typeof localRate === "number" && localRate > 0 && item.id.endsWith("-initial") && localRate !== item.rate) return {
			...item,
			rate: localRate,
			inverseRate: Math.round(1 / localRate * 1e6) / 1e6
		};
		return item;
	});
	const activeSet = activeCurrencies.length > 0 ? new Set(activeCurrencies.filter((c) => !c.isBase && c.isActive !== false).map((c) => c.code.toUpperCase())) : null;
	for (const localItem of persistedItems) {
		const code = localItem.sourceCurrency.toUpperCase();
		if (code !== "SDG" && !seenCodes.has(code) && localItem.rate > 0 && (!activeSet || activeSet.has(code))) {
			seenCodes.add(code);
			result.push(localItem);
		}
	}
	if (activeCurrencies.length > 0) for (const cur of activeCurrencies) {
		const code = cur.code.toUpperCase();
		if (!cur.isBase && cur.isActive !== false && !seenCodes.has(code)) {
			const fallbackRate = persistedMap[code] || DEFAULT_EXCHANGE_RATES_MAP[code] || 100;
			seenCodes.add(code);
			result.push({
				id: `effective-${code.toLowerCase()}-sdg`,
				sourceCurrency: code,
				targetCurrency: "SDG",
				rate: fallbackRate,
				inverseRate: Math.round(1 / fallbackRate * 1e6) / 1e6,
				effectiveFrom: (/* @__PURE__ */ new Date()).toISOString(),
				expiryDate: null,
				isActive: true,
				sourceSymbol: cur.symbol,
				targetSymbol: "ج.س",
				sourceName: cur.name,
				targetName: "Sudanese Pound"
			});
		}
	}
	return result;
}
/**
* Merge incoming rate items into the UI `editForms` state without reverting
* any existing input field values during state updates.
*
* - If a currency already has an entry in `prevForms` and `forceOverwriteCurrencies` does not include it,
*   its current `rate`, `effectiveFrom`, and `expiryDate` strings are preserved intact so typing or
*   context state updates never revert the input field.
*/
function mergeEditFormsState(prevForms, rateItems, persistedRatesMap, options) {
	const forceAll = Boolean(options?.forceOverwriteAll);
	const forceSet = new Set((options?.forceOverwriteCurrencies || []).map((c) => c.toUpperCase()));
	const draftInputs = options?.persistedDraftInputs || {};
	const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const nextForms = { ...prevForms };
	for (const r of rateItems) {
		const code = r.sourceCurrency.toUpperCase();
		const existingForm = prevForms[code];
		if (!(forceAll || forceSet.has(code) || !existingForm) && existingForm) nextForms[code] = existingForm;
		else {
			const draftStr = !forceAll && !forceSet.has(code) ? draftInputs[code] : void 0;
			const effectiveRate = r.rate > 0 ? r.rate : persistedRatesMap[code] || DEFAULT_EXCHANGE_RATES_MAP[code] || 100;
			nextForms[code] = {
				rate: draftStr !== void 0 && draftStr !== "" ? draftStr : effectiveRate.toString(),
				effectiveFrom: r.effectiveFrom ? r.effectiveFrom.slice(0, 10) : todayStr,
				expiryDate: r.expiryDate ? r.expiryDate.slice(0, 10) : "",
				isSaving: false,
				saveSuccess: existingForm?.saveSuccess || false,
				error: null
			};
		}
	}
	return nextForms;
}
// node_modules/@capacitor-community/sqlite/dist/esm/definitions.js
/**
* SQLiteConnection Class
*/
var SQLiteConnection = class {
	constructor(sqlite) {
		this.sqlite = sqlite;
		this._connectionDict = /* @__PURE__ */ new Map();
	}
	async initWebStore() {
		try {
			await this.sqlite.initWebStore();
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async saveToStore(database) {
		try {
			await this.sqlite.saveToStore({ database });
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async saveToLocalDisk(database) {
		try {
			await this.sqlite.saveToLocalDisk({ database });
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async getFromLocalDiskToStore(overwrite) {
		const mOverwrite = overwrite != null ? overwrite : true;
		try {
			await this.sqlite.getFromLocalDiskToStore({ overwrite: mOverwrite });
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async echo(value) {
		try {
			const res = await this.sqlite.echo({ value });
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async isSecretStored() {
		try {
			const res = await this.sqlite.isSecretStored();
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async setEncryptionSecret(passphrase) {
		try {
			await this.sqlite.setEncryptionSecret({ passphrase });
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async changeEncryptionSecret(passphrase, oldpassphrase) {
		try {
			await this.sqlite.changeEncryptionSecret({
				passphrase,
				oldpassphrase
			});
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async clearEncryptionSecret() {
		try {
			await this.sqlite.clearEncryptionSecret();
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async checkEncryptionSecret(passphrase) {
		try {
			const res = await this.sqlite.checkEncryptionSecret({ passphrase });
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async addUpgradeStatement(database, upgrade) {
		try {
			if (database.endsWith(".db")) database = database.slice(0, -3);
			await this.sqlite.addUpgradeStatement({
				database,
				upgrade
			});
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async createConnection(database, encrypted, mode, version, readonly) {
		try {
			if (database.endsWith(".db")) database = database.slice(0, -3);
			await this.sqlite.createConnection({
				database,
				encrypted,
				mode,
				version,
				readonly
			});
			const conn = new SQLiteDBConnection(database, readonly, this.sqlite);
			const connName = readonly ? `RO_${database}` : `RW_${database}`;
			this._connectionDict.set(connName, conn);
			return Promise.resolve(conn);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async closeConnection(database, readonly) {
		try {
			if (database.endsWith(".db")) database = database.slice(0, -3);
			await this.sqlite.closeConnection({
				database,
				readonly
			});
			const connName = readonly ? `RO_${database}` : `RW_${database}`;
			this._connectionDict.delete(connName);
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async isConnection(database, readonly) {
		const res = {};
		if (database.endsWith(".db")) database = database.slice(0, -3);
		const connName = readonly ? `RO_${database}` : `RW_${database}`;
		res.result = this._connectionDict.has(connName);
		return Promise.resolve(res);
	}
	async retrieveConnection(database, readonly) {
		if (database.endsWith(".db")) database = database.slice(0, -3);
		const connName = readonly ? `RO_${database}` : `RW_${database}`;
		if (this._connectionDict.has(connName)) {
			const conn = this._connectionDict.get(connName);
			if (typeof conn != "undefined") return Promise.resolve(conn);
			else return Promise.reject(`Connection ${database} is undefined`);
		} else return Promise.reject(`Connection ${database} does not exist`);
	}
	async getNCDatabasePath(path, database) {
		try {
			const databasePath = await this.sqlite.getNCDatabasePath({
				path,
				database
			});
			return Promise.resolve(databasePath);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async createNCConnection(databasePath, version) {
		try {
			await this.sqlite.createNCConnection({
				databasePath,
				version
			});
			const conn = new SQLiteDBConnection(databasePath, true, this.sqlite);
			const connName = `RO_${databasePath})`;
			this._connectionDict.set(connName, conn);
			return Promise.resolve(conn);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async closeNCConnection(databasePath) {
		try {
			await this.sqlite.closeNCConnection({ databasePath });
			const connName = `RO_${databasePath})`;
			this._connectionDict.delete(connName);
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async isNCConnection(databasePath) {
		const res = {};
		const connName = `RO_${databasePath})`;
		res.result = this._connectionDict.has(connName);
		return Promise.resolve(res);
	}
	async retrieveNCConnection(databasePath) {
		if (this._connectionDict.has(databasePath)) {
			const connName = `RO_${databasePath})`;
			const conn = this._connectionDict.get(connName);
			if (typeof conn != "undefined") return Promise.resolve(conn);
			else return Promise.reject(`Connection ${databasePath} is undefined`);
		} else return Promise.reject(`Connection ${databasePath} does not exist`);
	}
	async isNCDatabase(databasePath) {
		try {
			const res = await this.sqlite.isNCDatabase({ databasePath });
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async retrieveAllConnections() {
		return this._connectionDict;
	}
	async closeAllConnections() {
		const delDict = /* @__PURE__ */ new Map();
		try {
			for (const key of this._connectionDict.keys()) {
				const database = key.substring(3);
				const readonly = key.substring(0, 3) === "RO_" ? true : false;
				await this.sqlite.closeConnection({
					database,
					readonly
				});
				delDict.set(key, null);
			}
			for (const key of delDict.keys()) this._connectionDict.delete(key);
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async checkConnectionsConsistency() {
		try {
			const keys = [...this._connectionDict.keys()];
			const openModes = [];
			const dbNames = [];
			for (const key of keys) {
				openModes.push(key.substring(0, 2));
				dbNames.push(key.substring(3));
			}
			const res = await this.sqlite.checkConnectionsConsistency({
				dbNames,
				openModes
			});
			if (!res.result) this._connectionDict = /* @__PURE__ */ new Map();
			return Promise.resolve(res);
		} catch (err) {
			this._connectionDict = /* @__PURE__ */ new Map();
			return Promise.reject(err);
		}
	}
	async importFromJson(jsonstring) {
		try {
			const ret = await this.sqlite.importFromJson({ jsonstring });
			return Promise.resolve(ret);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async isJsonValid(jsonstring) {
		try {
			const ret = await this.sqlite.isJsonValid({ jsonstring });
			return Promise.resolve(ret);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async copyFromAssets(overwrite) {
		const mOverwrite = overwrite != null ? overwrite : true;
		try {
			await this.sqlite.copyFromAssets({ overwrite: mOverwrite });
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async getFromHTTPRequest(url, overwrite) {
		const mOverwrite = overwrite != null ? overwrite : true;
		try {
			await this.sqlite.getFromHTTPRequest({
				url,
				overwrite: mOverwrite
			});
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async isDatabaseEncrypted(database) {
		if (database.endsWith(".db")) database = database.slice(0, -3);
		try {
			const res = await this.sqlite.isDatabaseEncrypted({ database });
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async isInConfigEncryption() {
		try {
			const res = await this.sqlite.isInConfigEncryption();
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async isInConfigBiometricAuth() {
		try {
			const res = await this.sqlite.isInConfigBiometricAuth();
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async isDatabase(database) {
		if (database.endsWith(".db")) database = database.slice(0, -3);
		try {
			const res = await this.sqlite.isDatabase({ database });
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async getDatabaseList() {
		try {
			const values = (await this.sqlite.getDatabaseList()).values;
			values.sort();
			const ret = { values };
			return Promise.resolve(ret);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async getMigratableDbList(folderPath) {
		const path = folderPath ? folderPath : "default";
		try {
			const res = await this.sqlite.getMigratableDbList({ folderPath: path });
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async addSQLiteSuffix(folderPath, dbNameList) {
		const path = folderPath ? folderPath : "default";
		const dbList = dbNameList ? dbNameList : [];
		try {
			const res = await this.sqlite.addSQLiteSuffix({
				folderPath: path,
				dbNameList: dbList
			});
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async deleteOldDatabases(folderPath, dbNameList) {
		const path = folderPath ? folderPath : "default";
		const dbList = dbNameList ? dbNameList : [];
		try {
			const res = await this.sqlite.deleteOldDatabases({
				folderPath: path,
				dbNameList: dbList
			});
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async moveDatabasesAndAddSuffix(folderPath, dbNameList) {
		const path = folderPath ? folderPath : "default";
		const dbList = dbNameList ? dbNameList : [];
		return this.sqlite.moveDatabasesAndAddSuffix({
			folderPath: path,
			dbNameList: dbList
		});
	}
};
/**
* SQLiteDBConnection Class
*/
var SQLiteDBConnection = class {
	constructor(dbName, readonly, sqlite) {
		this.dbName = dbName;
		this.readonly = readonly;
		this.sqlite = sqlite;
	}
	getConnectionDBName() {
		return this.dbName;
	}
	getConnectionReadOnly() {
		return this.readonly;
	}
	async open() {
		try {
			await this.sqlite.open({
				database: this.dbName,
				readonly: this.readonly
			});
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async close() {
		try {
			await this.sqlite.close({
				database: this.dbName,
				readonly: this.readonly
			});
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async beginTransaction() {
		try {
			const changes = await this.sqlite.beginTransaction({ database: this.dbName });
			return Promise.resolve(changes);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async commitTransaction() {
		try {
			const changes = await this.sqlite.commitTransaction({ database: this.dbName });
			return Promise.resolve(changes);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async rollbackTransaction() {
		try {
			const changes = await this.sqlite.rollbackTransaction({ database: this.dbName });
			return Promise.resolve(changes);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async isTransactionActive() {
		try {
			const result = await this.sqlite.isTransactionActive({ database: this.dbName });
			return Promise.resolve(result);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async loadExtension(path) {
		try {
			await this.sqlite.loadExtension({
				database: this.dbName,
				path,
				readonly: this.readonly
			});
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async enableLoadExtension(toggle) {
		try {
			await this.sqlite.enableLoadExtension({
				database: this.dbName,
				toggle,
				readonly: this.readonly
			});
			return Promise.resolve();
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async getUrl() {
		try {
			const res = await this.sqlite.getUrl({
				database: this.dbName,
				readonly: this.readonly
			});
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async getVersion() {
		try {
			const version = await this.sqlite.getVersion({
				database: this.dbName,
				readonly: this.readonly
			});
			return Promise.resolve(version);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async getTableList() {
		try {
			const res = await this.sqlite.getTableList({
				database: this.dbName,
				readonly: this.readonly
			});
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async execute(statements, transaction = true, isSQL92 = true) {
		try {
			if (!this.readonly) {
				const res = await this.sqlite.execute({
					database: this.dbName,
					statements,
					transaction,
					readonly: false,
					isSQL92
				});
				return Promise.resolve(res);
			} else return Promise.reject("not allowed in read-only mode");
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async query(statement, values, isSQL92 = true) {
		let res;
		try {
			if (values && values.length > 0) res = await this.sqlite.query({
				database: this.dbName,
				statement,
				values,
				readonly: this.readonly,
				isSQL92: true
			});
			else res = await this.sqlite.query({
				database: this.dbName,
				statement,
				values: [],
				readonly: this.readonly,
				isSQL92
			});
			res = await this.reorderRows(res);
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async run(statement, values, transaction = true, returnMode = "no", isSQL92 = true) {
		let res;
		try {
			if (!this.readonly) {
				if (values && values.length > 0) res = await this.sqlite.run({
					database: this.dbName,
					statement,
					values,
					transaction,
					readonly: false,
					returnMode,
					isSQL92: true
				});
				else res = await this.sqlite.run({
					database: this.dbName,
					statement,
					values: [],
					transaction,
					readonly: false,
					returnMode,
					isSQL92
				});
				res.changes = await this.reorderRows(res.changes);
				return Promise.resolve(res);
			} else return Promise.reject("not allowed in read-only mode");
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async executeSet(set, transaction = true, returnMode = "no", isSQL92 = true) {
		let res;
		try {
			if (!this.readonly) {
				res = await this.sqlite.executeSet({
					database: this.dbName,
					set,
					transaction,
					readonly: false,
					returnMode,
					isSQL92
				});
				res.changes = await this.reorderRows(res.changes);
				return Promise.resolve(res);
			} else return Promise.reject("not allowed in read-only mode");
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async isExists() {
		try {
			const res = await this.sqlite.isDBExists({
				database: this.dbName,
				readonly: this.readonly
			});
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async isTable(table) {
		try {
			const res = await this.sqlite.isTableExists({
				database: this.dbName,
				table,
				readonly: this.readonly
			});
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async isDBOpen() {
		try {
			const res = await this.sqlite.isDBOpen({
				database: this.dbName,
				readonly: this.readonly
			});
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async delete() {
		try {
			if (!this.readonly) {
				await this.sqlite.deleteDatabase({
					database: this.dbName,
					readonly: false
				});
				return Promise.resolve();
			} else return Promise.reject("not allowed in read-only mode");
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async createSyncTable() {
		try {
			if (!this.readonly) {
				const res = await this.sqlite.createSyncTable({
					database: this.dbName,
					readonly: false
				});
				return Promise.resolve(res);
			} else return Promise.reject("not allowed in read-only mode");
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async setSyncDate(syncdate) {
		try {
			if (!this.readonly) {
				await this.sqlite.setSyncDate({
					database: this.dbName,
					syncdate,
					readonly: false
				});
				return Promise.resolve();
			} else return Promise.reject("not allowed in read-only mode");
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async getSyncDate() {
		try {
			const res = await this.sqlite.getSyncDate({
				database: this.dbName,
				readonly: this.readonly
			});
			let retDate = "";
			if (res.syncDate > 0) retDate = (/* @__PURE__ */ new Date(res.syncDate * 1e3)).toISOString();
			return Promise.resolve(retDate);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async exportToJson(mode, encrypted = false) {
		try {
			const res = await this.sqlite.exportToJson({
				database: this.dbName,
				jsonexportmode: mode,
				readonly: this.readonly,
				encrypted
			});
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async deleteExportedRows() {
		try {
			if (!this.readonly) {
				await this.sqlite.deleteExportedRows({
					database: this.dbName,
					readonly: false
				});
				return Promise.resolve();
			} else return Promise.reject("not allowed in read-only mode");
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async executeTransaction(txn, isSQL92 = true) {
		let changes = 0;
		let isActive = false;
		if (!this.readonly) {
			await this.sqlite.beginTransaction({ database: this.dbName });
			isActive = await this.sqlite.isTransactionActive({ database: this.dbName });
			if (!isActive) return Promise.reject("After Begin Transaction, no transaction active");
			try {
				for (const task of txn) {
					if (typeof task !== "object" || !("statement" in task)) throw new Error("Error a task.statement must be provided");
					if ("values" in task && task.values && task.values.length > 0) {
						const retMode = task.statement.toUpperCase().includes("RETURNING") ? "all" : "no";
						const ret = await this.sqlite.run({
							database: this.dbName,
							statement: task.statement,
							values: task.values,
							transaction: false,
							readonly: false,
							returnMode: retMode,
							isSQL92
						});
						if (ret.changes.changes < 0) throw new Error("Error in transaction method run ");
						changes += ret.changes.changes;
					} else {
						const ret = await this.sqlite.execute({
							database: this.dbName,
							statements: task.statement,
							transaction: false,
							readonly: false
						});
						if (ret.changes.changes < 0) throw new Error("Error in transaction method execute ");
						changes += ret.changes.changes;
					}
				}
				const retC = await this.sqlite.commitTransaction({ database: this.dbName });
				changes += retC.changes.changes;
				const retChanges = { changes: { changes } };
				return Promise.resolve(retChanges);
			} catch (err) {
				const msg = err.message ? err.message : err;
				await this.sqlite.rollbackTransaction({ database: this.dbName });
				return Promise.reject(msg);
			}
		} else return Promise.reject("not allowed in read-only mode");
	}
	async reorderRows(res) {
		const retRes = res;
		if (res?.values && typeof res.values[0] === "object") {
			if (Object.keys(res.values[0]).includes("ios_columns")) {
				const columnList = res.values[0]["ios_columns"];
				const iosRes = [];
				for (let i = 1; i < res.values.length; i++) {
					const rowJson = res.values[i];
					const resRowJson = {};
					for (const item of columnList) resRowJson[item] = rowJson[item];
					iosRes.push(resRowJson);
				}
				retRes["values"] = iosRes;
			}
		}
		return Promise.resolve(retRes);
	}
};
// \0vite/preload-helper.js
var scriptRel = "modulepreload";
var assetsURL = function(dep) {
	return "/" + dep;
};
var seen = {};
var isCssPreloadUrl = function isCssPreloadUrl(url) {
	return url.pathname.endsWith(".css");
};
var preloadOnce = function preloadOnce(seen, href, preload) {
	if (href in seen) return seen[href];
	const promise = preload();
	if (!promise) {
		seen[href] = void 0;
		return;
	}
	const preloadPromise = promise.then(() => {
		seen[href] = void 0;
	}, (err) => {
		seen[href] = void 0;
		throw err;
	});
	seen[href] = preloadPromise;
	return preloadPromise;
};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		let preloadedHrefs;
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		function importMetaResolve(specifier) {
			if (import.meta.resolve) return new URL(import.meta.resolve(specifier));
			return new URL(
				specifier,
				/** #__KEEP__ */
				import.meta.url
			);
		}
		promise = allSettled(deps.map((depString) => {
			depString = assetsURL(depString, importerUrl);
			const dep = importMetaResolve(depString);
			const isCss = isCssPreloadUrl(dep);
			return preloadOnce(seen, dep.href, () => {
				if (preloadedHrefs === void 0) {
					preloadedHrefs = {
						all: /* @__PURE__ */ new Set(),
						styles: /* @__PURE__ */ new Set()
					};
					const links = document.getElementsByTagName("link");
					for (let i = links.length - 1; i >= 0; i--) {
						const link = links[i];
						preloadedHrefs.all.add(link.href);
						if (link.rel === "stylesheet") preloadedHrefs.styles.add(link.href);
					}
				}
				if ((isCss ? preloadedHrefs.styles : preloadedHrefs.all).has(dep.href)) return;
				const link = document.createElement("link");
				link.rel = isCss ? "stylesheet" : scriptRel;
				if (!isCss) link.as = "script";
				link.crossOrigin = "";
				link.href = dep.href;
				if (cspNonce) link.setAttribute("nonce", cspNonce);
				document.head.appendChild(link);
				if (isCss) return new Promise((res, rej) => {
					link.addEventListener("load", res);
					link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
				});
			});
		}).filter((p) => p !== void 0));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
// node_modules/@capacitor-community/sqlite/dist/esm/index.js
var CapacitorSQLite = registerPlugin("CapacitorSQLite", {
	web: () => __vitePreload(() => import("./web-C2C3TIwG.js").then((m) => new m.CapacitorSQLiteWeb()), __vite__mapDeps([0,1])),
	electron: () => window.CapacitorCustomPlatform.plugins.CapacitorSQLite
});
// src/lib/offline-sqlite-storage.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var SQLITE_DB_NAME = "dqnamo_pos_offline_db";
var IDB_NAME = "dqnamo_pos_sqlite_idb_v1";
var IDB_TX_STORE = "offline_transactions";
var IDB_KV_STORE = "offline_kv_snapshots";
var IDB_OUTBOX_STORE = "offline_outbox_queue";
var SCHEMA_DDL = `
CREATE TABLE IF NOT EXISTS offline_transactions (
  id TEXT PRIMARY KEY NOT NULL,
  company_id TEXT NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  timestamp TEXT NOT NULL,
  total REAL NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'cash',
  payload_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_offline_tx_company ON offline_transactions(company_id);
CREATE INDEX IF NOT EXISTS idx_offline_tx_sync ON offline_transactions(company_id, sync_status);

CREATE TABLE IF NOT EXISTS offline_kv_snapshots (
  store_key TEXT PRIMARY KEY NOT NULL,
  company_id TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS offline_outbox_queue (
  queue_id TEXT PRIMARY KEY NOT NULL,
  company_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  operation TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  retry_count INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_outbox_company ON offline_outbox_queue(company_id);
`;
var OfflineSqlitePersistenceManager = class {
	constructor() {
		this.sqliteConnection = null;
		this.dbConnection = null;
		this.engineType = "memory-journal";
		this.initialized = false;
		this.initPromise = null;
		this.lastPersistedAt = null;
		this.memoryTransactions = /* @__PURE__ */ new Map();
		this.memoryKv = /* @__PURE__ */ new Map();
		this.memoryOutbox = /* @__PURE__ */ new Map();
		this.idbPromise = null;
		this.txSignatureCache = /* @__PURE__ */ new Map();
	}
	async initialize() {
		if (this.initialized) return this.engineType;
		if (this.initPromise) return this.initPromise;
		this.initPromise = this.performInitialization();
		return this.initPromise;
	}
	async performInitialization() {
		if (typeof window !== "undefined" && typeof Capacitor?.isNativePlatform === "function" && Capacitor.isNativePlatform()) try {
			this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
			const retCC = await this.sqliteConnection.checkConnectionsConsistency();
			const isConn = (await this.sqliteConnection.isConnection(SQLITE_DB_NAME, false)).result;
			if (retCC.result && isConn) this.dbConnection = await this.sqliteConnection.retrieveConnection(SQLITE_DB_NAME, false);
			else this.dbConnection = await this.sqliteConnection.createConnection(SQLITE_DB_NAME, false, "no-encryption", 1, false);
			await this.dbConnection.open();
			await this.dbConnection.execute(SCHEMA_DDL);
			this.engineType = "capacitor-sqlite";
			this.initialized = true;
			return this.engineType;
		} catch (err) {
			console.warn("CapacitorSQLite native init fallback to IndexedDB/Journal:", err);
		}
		if (typeof window !== "undefined" && typeof window.indexedDB !== "undefined") try {
			await this.openIndexedDb();
			this.engineType = "indexeddb-sqlite-mirror";
			this.initialized = true;
			return this.engineType;
		} catch (err) {
			console.warn("IndexedDB unavailable, using durable memory/localStorage journal:", err);
		}
		this.engineType = "memory-journal";
		this.initialized = true;
		return this.engineType;
	}
	openIndexedDb() {
		if (this.idbPromise) return this.idbPromise;
		this.idbPromise = new Promise((resolve, reject) => {
			const req = window.indexedDB.open(IDB_NAME, 1);
			req.onupgradeneeded = () => {
				const db = req.result;
				if (!db.objectStoreNames.contains(IDB_TX_STORE)) db.createObjectStore(IDB_TX_STORE, { keyPath: "id" }).createIndex("companyId", "companyId", { unique: false });
				if (!db.objectStoreNames.contains(IDB_KV_STORE)) db.createObjectStore(IDB_KV_STORE, { keyPath: "storeKey" });
				if (!db.objectStoreNames.contains(IDB_OUTBOX_STORE)) db.createObjectStore(IDB_OUTBOX_STORE, { keyPath: "queueId" }).createIndex("companyId", "companyId", { unique: false });
			};
			req.onsuccess = () => {
				const db = req.result;
				db.onclose = () => {
					this.idbPromise = null;
				};
				db.onversionchange = () => {
					this.idbPromise = null;
					db.close();
				};
				resolve(db);
			};
			req.onerror = () => {
				this.idbPromise = null;
				reject(req.error);
			};
		});
		return this.idbPromise;
	}
	getTransactionWriteSignature(tx, syncStatus) {
		return `${tx.status || ""}:${syncStatus}:${tx.amountPaid ?? 0}:${tx.debtAmount ?? 0}:${tx.grandTotal ?? 0}:${tx.paymentStatus || ""}:${tx.fulfillmentStatus || ""}:${tx.exchangeRateUsed ?? ""}:${tx.timestamp || ""}:${tx.debtPayments?.length || 0}`;
	}
	async persistTransactions(companyId, transactions) {
		await this.initialize();
		const safeCompanyId = String(companyId || "comp-default");
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		const dirtyTransactions = [];
		for (const tx of transactions || []) {
			if (!tx?.id) continue;
			const resolvedSyncStatus = tx.syncStatus || (this.isOnline() ? "synced" : "pending_sync");
			const scopedTx = tx.syncStatus === resolvedSyncStatus ? tx : {
				...tx,
				syncStatus: resolvedSyncStatus
			};
			const scopedKey = `${safeCompanyId}:${scopedTx.id}`;
			this.memoryTransactions.set(scopedKey, {
				companyId: safeCompanyId,
				tx: scopedTx,
				updatedAt: nowIso
			});
			const queueId = `${safeCompanyId}:tx:${scopedTx.id}`;
			if (resolvedSyncStatus !== "synced") this.memoryOutbox.set(queueId, {
				queueId,
				companyId: safeCompanyId,
				entityType: "transaction",
				entityId: scopedTx.id,
				operation: scopedTx.status === "voided" ? "VOID" : "UPSERT",
				payloadJson: JSON.stringify(scopedTx),
				createdAt: scopedTx.timestamp || nowIso,
				retryCount: 0
			});
			else this.memoryOutbox.delete(queueId);
			const signature = this.getTransactionWriteSignature(scopedTx, resolvedSyncStatus);
			if (this.txSignatureCache.get(scopedKey) !== signature) dirtyTransactions.push({
				tx: scopedTx,
				syncStatus: resolvedSyncStatus,
				signature
			});
		}
		if (dirtyTransactions.length === 0) return;
		if (this.engineType === "capacitor-sqlite" && this.dbConnection) try {
			for (const { tx, syncStatus, signature } of dirtyTransactions) {
				const payloadStr = JSON.stringify(tx);
				await this.dbConnection.run(`INSERT OR REPLACE INTO offline_transactions (id, company_id, sync_status, timestamp, total, payment_method, payload_json, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?);`, [
					tx.id,
					safeCompanyId,
					syncStatus,
					tx.timestamp || nowIso,
					Number(tx.grandTotal || 0),
					tx.paymentMethod || "cash",
					payloadStr,
					nowIso
				]);
				const queueId = `${safeCompanyId}:tx:${tx.id}`;
				if (syncStatus !== "synced") await this.dbConnection.run(`INSERT OR REPLACE INTO offline_outbox_queue (queue_id, company_id, entity_type, entity_id, operation, payload_json, created_at, retry_count)
               VALUES (?, ?, 'transaction', ?, ?, ?, ?, 0);`, [
					queueId,
					safeCompanyId,
					tx.id,
					tx.status === "voided" ? "VOID" : "UPSERT",
					payloadStr,
					tx.timestamp || nowIso
				]);
				else await this.dbConnection.run(`DELETE FROM offline_outbox_queue WHERE queue_id = ?;`, [queueId]);
				this.txSignatureCache.set(`${safeCompanyId}:${tx.id}`, signature);
			}
		} catch (err) {
			console.warn("CapacitorSQLite persistTransactions error:", err);
		}
		else if (this.engineType === "indexeddb-sqlite-mirror") try {
			const db = await this.openIndexedDb();
			await new Promise((resolve, reject) => {
				const txObj = db.transaction([IDB_TX_STORE, IDB_OUTBOX_STORE], "readwrite");
				const store = txObj.objectStore(IDB_TX_STORE);
				const outbox = txObj.objectStore(IDB_OUTBOX_STORE);
				for (const { tx, syncStatus } of dirtyTransactions) {
					store.put({
						id: `${safeCompanyId}:${tx.id}`,
						rawId: tx.id,
						companyId: safeCompanyId,
						syncStatus,
						timestamp: tx.timestamp || nowIso,
						total: Number(tx.grandTotal || 0),
						paymentMethod: tx.paymentMethod || "cash",
						payload: tx,
						updatedAt: nowIso
					});
					const queueId = `${safeCompanyId}:tx:${tx.id}`;
					if (syncStatus !== "synced") outbox.put({
						queueId,
						companyId: safeCompanyId,
						entityType: "transaction",
						entityId: tx.id,
						operation: tx.status === "voided" ? "VOID" : "UPSERT",
						payloadJson: JSON.stringify(tx),
						createdAt: tx.timestamp || nowIso,
						retryCount: 0
					});
					else outbox.delete(queueId);
				}
				txObj.oncomplete = () => {
					for (const { tx, signature } of dirtyTransactions) this.txSignatureCache.set(`${safeCompanyId}:${tx.id}`, signature);
					resolve();
				};
				txObj.onerror = () => {
					reject(txObj.error);
				};
			});
		} catch (err) {
			console.warn("IndexedDB persistTransactions error:", err);
		}
		else for (const { tx, signature } of dirtyTransactions) this.txSignatureCache.set(`${safeCompanyId}:${tx.id}`, signature);
		this.lastPersistedAt = nowIso;
	}
	async loadTransactions(companyId) {
		await this.initialize();
		const safeCompanyId = String(companyId || "comp-default");
		if (this.engineType === "capacitor-sqlite" && this.dbConnection) try {
			const rows = (await this.dbConnection.query(`SELECT payload_json, sync_status FROM offline_transactions WHERE company_id = ? ORDER BY timestamp DESC;`, [safeCompanyId])).values || [];
			const parsed = [];
			for (const row of rows) try {
				const tx = JSON.parse(row.payload_json);
				if (tx?.id) {
					tx.syncStatus = row.sync_status || tx.syncStatus || "synced";
					parsed.push(tx);
					this.memoryTransactions.set(`${safeCompanyId}:${tx.id}`, {
						companyId: safeCompanyId,
						tx,
						updatedAt: (/* @__PURE__ */ new Date()).toISOString()
					});
				}
			} catch {}
			return parsed;
		} catch (err) {
			console.warn("CapacitorSQLite loadTransactions error:", err);
		}
		else if (this.engineType === "indexeddb-sqlite-mirror") try {
			const db = await this.openIndexedDb();
			const records = await new Promise((resolve, reject) => {
				const req = db.transaction(IDB_TX_STORE, "readonly").objectStore(IDB_TX_STORE).index("companyId").getAll(safeCompanyId);
				req.onsuccess = () => {
					resolve((req.result || []).map((r) => r.payload).filter((t) => Boolean(t?.id)));
				};
				req.onerror = () => {
					reject(req.error);
				};
			});
			for (const tx of records) {
				const key = `${safeCompanyId}:${tx.id}`;
				this.memoryTransactions.set(key, {
					companyId: safeCompanyId,
					tx,
					updatedAt: (/* @__PURE__ */ new Date()).toISOString()
				});
				this.txSignatureCache.set(key, this.getTransactionWriteSignature(tx, tx.syncStatus || "synced"));
			}
			return records.sort((a, b) => (Date.parse(b.timestamp || "") || 0) - (Date.parse(a.timestamp || "") || 0));
		} catch (err) {
			console.warn("IndexedDB loadTransactions error:", err);
		}
		const fallbackList = [];
		for (const entry of this.memoryTransactions.values()) if (entry.companyId === safeCompanyId) fallbackList.push(entry.tx);
		return fallbackList.sort((a, b) => (Date.parse(b.timestamp || "") || 0) - (Date.parse(a.timestamp || "") || 0));
	}
	async markTransactionsSynced(companyId, transactionIds) {
		await this.initialize();
		const safeCompanyId = String(companyId || "comp-default");
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		const idSet = transactionIds ? new Set(transactionIds) : null;
		for (const [key, entry] of this.memoryTransactions.entries()) if (entry.companyId === safeCompanyId && (!idSet || idSet.has(entry.tx.id))) {
			entry.tx = {
				...entry.tx,
				syncStatus: "synced"
			};
			entry.updatedAt = nowIso;
			this.memoryTransactions.set(key, entry);
			this.memoryOutbox.delete(`${safeCompanyId}:tx:${entry.tx.id}`);
		}
		if (this.engineType === "capacitor-sqlite" && this.dbConnection) try {
			if (!idSet) {
				await this.dbConnection.run(`UPDATE offline_transactions SET sync_status = 'synced', updated_at = ? WHERE company_id = ?;`, [nowIso, safeCompanyId]);
				await this.dbConnection.run(`DELETE FROM offline_outbox_queue WHERE company_id = ? AND entity_type = 'transaction';`, [safeCompanyId]);
			} else for (const txId of idSet) {
				await this.dbConnection.run(`UPDATE offline_transactions SET sync_status = 'synced', updated_at = ? WHERE id = ? AND company_id = ?;`, [
					nowIso,
					txId,
					safeCompanyId
				]);
				await this.dbConnection.run(`DELETE FROM offline_outbox_queue WHERE queue_id = ?;`, [`${safeCompanyId}:tx:${txId}`]);
			}
		} catch (err) {
			console.warn("CapacitorSQLite markTransactionsSynced error:", err);
		}
		else if (this.engineType === "indexeddb-sqlite-mirror") try {
			const updated = (await this.loadTransactions(safeCompanyId)).map((t) => !idSet || idSet.has(t.id) ? {
				...t,
				syncStatus: "synced"
			} : t);
			await this.persistTransactions(safeCompanyId, updated);
		} catch {}
		this.lastPersistedAt = nowIso;
	}
	async persistWorkspaceSnapshot(companyId, moduleKey, data) {
		await this.initialize();
		const safeCompanyId = String(companyId || "comp-default");
		const storeKey = `${safeCompanyId}:${moduleKey}`;
		const payloadJson = JSON.stringify(data);
		const prev = this.memoryKv.get(storeKey);
		if (prev && prev.payloadJson === payloadJson) return;
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		this.memoryKv.set(storeKey, {
			companyId: safeCompanyId,
			payloadJson,
			updatedAt: nowIso
		});
		if (this.engineType === "capacitor-sqlite" && this.dbConnection) try {
			await this.dbConnection.run(`INSERT OR REPLACE INTO offline_kv_snapshots (store_key, company_id, payload_json, updated_at)
           VALUES (?, ?, ?, ?);`, [
				storeKey,
				safeCompanyId,
				payloadJson,
				nowIso
			]);
		} catch (err) {
			console.warn("CapacitorSQLite persistWorkspaceSnapshot error:", err);
		}
		else if (this.engineType === "indexeddb-sqlite-mirror") try {
			const db = await this.openIndexedDb();
			await new Promise((resolve, reject) => {
				const txObj = db.transaction(IDB_KV_STORE, "readwrite");
				txObj.objectStore(IDB_KV_STORE).put({
					storeKey,
					companyId: safeCompanyId,
					payloadJson,
					updatedAt: nowIso
				});
				txObj.oncomplete = () => resolve();
				txObj.onerror = () => reject(txObj.error);
			});
		} catch {}
		this.lastPersistedAt = nowIso;
	}
	async loadWorkspaceSnapshot(companyId, moduleKey) {
		await this.initialize();
		const storeKey = `${String(companyId || "comp-default")}:${moduleKey}`;
		if (this.engineType === "capacitor-sqlite" && this.dbConnection) try {
			const raw = (await this.dbConnection.query(`SELECT payload_json FROM offline_kv_snapshots WHERE store_key = ? LIMIT 1;`, [storeKey])).values?.[0]?.payload_json;
			if (raw) return JSON.parse(raw);
		} catch {}
		else if (this.engineType === "indexeddb-sqlite-mirror") try {
			const db = await this.openIndexedDb();
			const raw = await new Promise((resolve, reject) => {
				const req = db.transaction(IDB_KV_STORE, "readonly").objectStore(IDB_KV_STORE).get(storeKey);
				req.onsuccess = () => resolve(req.result?.payloadJson || null);
				req.onerror = () => reject(req.error);
			});
			if (raw) return JSON.parse(raw);
		} catch {}
		const mem = this.memoryKv.get(storeKey);
		if (mem?.payloadJson) try {
			return JSON.parse(mem.payloadJson);
		} catch {}
		return null;
	}
	async clearCompanySqliteData(companyId) {
		await this.initialize();
		const safeCompanyId = String(companyId || "comp-default");
		for (const [key, entry] of this.memoryTransactions.entries()) if (entry.companyId === safeCompanyId) {
			this.memoryTransactions.delete(key);
			this.txSignatureCache.delete(key);
		}
		for (const [key, entry] of this.memoryKv.entries()) if (entry.companyId === safeCompanyId) this.memoryKv.delete(key);
		for (const [key, entry] of this.memoryOutbox.entries()) if (entry.companyId === safeCompanyId) this.memoryOutbox.delete(key);
		if (this.engineType === "capacitor-sqlite" && this.dbConnection) try {
			await this.dbConnection.run(`DELETE FROM offline_transactions WHERE company_id = ?;`, [safeCompanyId]);
			await this.dbConnection.run(`DELETE FROM offline_kv_snapshots WHERE company_id = ?;`, [safeCompanyId]);
			await this.dbConnection.run(`DELETE FROM offline_outbox_queue WHERE company_id = ?;`, [safeCompanyId]);
		} catch {}
	}
	isOnline() {
		if (typeof navigator !== "undefined" && typeof navigator.onLine === "boolean") return navigator.onLine;
		return true;
	}
	getDiagnostics(companyId) {
		const safeCompanyId = String(companyId || "comp-default");
		let totalTx = 0;
		let pendingTx = 0;
		for (const entry of this.memoryTransactions.values()) if (entry.companyId === safeCompanyId) {
			totalTx++;
			if (entry.tx.syncStatus !== "synced") pendingTx++;
		}
		let outboxCount = 0;
		for (const item of this.memoryOutbox.values()) if (item.companyId === safeCompanyId) outboxCount++;
		return {
			engineType: this.engineType,
			isInitialized: this.initialized,
			isDeviceOnline: this.isOnline(),
			databaseName: SQLITE_DB_NAME,
			companyId: safeCompanyId,
			totalPersistedTransactions: totalTx,
			pendingOfflineTransactions: pendingTx,
			pendingOutboxCount: outboxCount,
			lastPersistedAt: this.lastPersistedAt
		};
	}
	/**
	* Exports the entire Capacitor SQLite database (`exportToJson('full')` when running on native Android,
	* or a standard JsonSQLite-compatible table dump on Web/Desktop) along with the structured POS dataset
	* so the user can download a portable `.sqlite.json` database backup file.
	*/
	async exportDatabaseToBackupFile(params) {
		await this.initialize();
		const safeCompanyId = String(params.companyId || "comp-default");
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		const dateStamp = nowIso.slice(0, 10);
		await this.persistTransactions(safeCompanyId, params.transactions || []);
		if (params.products) await this.persistWorkspaceSnapshot(safeCompanyId, "products", params.products);
		if (params.customers) await this.persistWorkspaceSnapshot(safeCompanyId, "customers", params.customers);
		if (params.stockMovements) await this.persistWorkspaceSnapshot(safeCompanyId, "stockMovements", params.stockMovements);
		if (params.currencies) await this.persistWorkspaceSnapshot(safeCompanyId, "currencies", params.currencies);
		if (params.settings) await this.persistWorkspaceSnapshot(safeCompanyId, "settings", params.settings);
		let capacitorSqliteExport = null;
		if (this.engineType === "capacitor-sqlite" && this.dbConnection) try {
			const exported = await this.dbConnection.exportToJson("full");
			if (exported?.export) capacitorSqliteExport = exported.export;
		} catch (err) {
			console.warn("CapacitorSQLite native exportToJson fallback:", err);
		}
		if (!capacitorSqliteExport) {
			const txValues = [];
			for (const entry of this.memoryTransactions.values()) if (entry.companyId === safeCompanyId) {
				const tx = entry.tx;
				txValues.push([
					tx.id,
					safeCompanyId,
					tx.syncStatus || "synced",
					tx.timestamp || nowIso,
					Number(tx.grandTotal || 0),
					tx.paymentMethod || "cash",
					JSON.stringify(tx),
					entry.updatedAt || nowIso
				]);
			}
			const kvValues = [];
			for (const [storeKey, kv] of this.memoryKv.entries()) if (kv.companyId === safeCompanyId) kvValues.push([
				storeKey,
				safeCompanyId,
				kv.payloadJson,
				kv.updatedAt
			]);
			const outboxValues = [];
			for (const item of this.memoryOutbox.values()) if (item.companyId === safeCompanyId) outboxValues.push([
				item.queueId,
				item.companyId,
				item.entityType,
				item.entityId,
				item.operation,
				item.payloadJson,
				item.createdAt,
				item.retryCount
			]);
			capacitorSqliteExport = {
				database: SQLITE_DB_NAME,
				version: 1,
				encrypted: false,
				mode: "full",
				tables: [
					{
						name: "offline_transactions",
						schema: [
							{
								column: "id",
								value: "TEXT PRIMARY KEY NOT NULL"
							},
							{
								column: "company_id",
								value: "TEXT NOT NULL"
							},
							{
								column: "sync_status",
								value: "TEXT NOT NULL"
							},
							{
								column: "timestamp",
								value: "TEXT NOT NULL"
							},
							{
								column: "total",
								value: "REAL NOT NULL"
							},
							{
								column: "payment_method",
								value: "TEXT NOT NULL"
							},
							{
								column: "payload_json",
								value: "TEXT NOT NULL"
							},
							{
								column: "updated_at",
								value: "TEXT NOT NULL"
							}
						],
						values: txValues
					},
					{
						name: "offline_kv_snapshots",
						schema: [
							{
								column: "store_key",
								value: "TEXT PRIMARY KEY NOT NULL"
							},
							{
								column: "company_id",
								value: "TEXT NOT NULL"
							},
							{
								column: "payload_json",
								value: "TEXT NOT NULL"
							},
							{
								column: "updated_at",
								value: "TEXT NOT NULL"
							}
						],
						values: kvValues
					},
					{
						name: "offline_outbox_queue",
						schema: [
							{
								column: "queue_id",
								value: "TEXT PRIMARY KEY NOT NULL"
							},
							{
								column: "company_id",
								value: "TEXT NOT NULL"
							},
							{
								column: "entity_type",
								value: "TEXT NOT NULL"
							},
							{
								column: "entity_id",
								value: "TEXT NOT NULL"
							},
							{
								column: "operation",
								value: "TEXT NOT NULL"
							},
							{
								column: "payload_json",
								value: "TEXT NOT NULL"
							},
							{
								column: "created_at",
								value: "TEXT NOT NULL"
							},
							{
								column: "retry_count",
								value: "INTEGER NOT NULL DEFAULT 0"
							}
						],
						values: outboxValues
					}
				]
			};
		}
		const posDataset = {
			transactions: params.transactions || [],
			products: params.products || [],
			customers: params.customers || [],
			stockMovements: params.stockMovements || [],
			currencies: params.currencies || [],
			settings: params.settings || {}
		};
		const envelope = {
			format: "DQNAMO_CAPACITOR_SQLITE_EXPORT_V1",
			exportedAt: nowIso,
			engineType: this.engineType,
			databaseName: SQLITE_DB_NAME,
			databaseVersion: 1,
			companyId: safeCompanyId,
			companyName: params.companyName || "Dqnamo POS",
			capacitorSqliteExport,
			posDataset
		};
		return {
			fileName: `dqnamo-sqlite-backup-${String(params.companyName || safeCompanyId).replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 32) || "pos"}-${dateStamp}.sqlite.json`,
			jsonContent: JSON.stringify(envelope, null, 2),
			tablesExported: Array.isArray(capacitorSqliteExport?.tables) ? capacitorSqliteExport.tables.length : 3,
			transactionsCount: posDataset.transactions.length,
			productsCount: posDataset.products.length,
			customersCount: posDataset.customers.length
		};
	}
	/**
	* Imports a Capacitor SQLite backup file (`.sqlite.json` produced by `exportDatabaseToBackupFile`
	* or a raw `JsonSQLite` export) back into SQLite and returns the restored POS records.
	*/
	async importDatabaseFromBackupFile(rawJsonText, targetCompanyId) {
		await this.initialize();
		const safeCompanyId = String(targetCompanyId || "comp-default");
		let parsed;
		try {
			parsed = JSON.parse(rawJsonText);
		} catch {
			return {
				ok: false,
				restoredTransactions: [],
				restoredProducts: [],
				restoredCustomers: [],
				restoredStockMovements: [],
				restoredCurrencies: [],
				error: "Invalid JSON file format."
			};
		}
		const sqliteExportObj = parsed?.capacitorSqliteExport || (parsed?.tables ? parsed : null);
		if (this.engineType === "capacitor-sqlite" && this.sqliteConnection && sqliteExportObj) try {
			const jsonStr = JSON.stringify(sqliteExportObj);
			if ((await this.sqliteConnection.isJsonValid(jsonStr)).result) await this.sqliteConnection.importFromJson(jsonStr);
		} catch (err) {
			console.warn("CapacitorSQLite native importFromJson warning:", err);
		}
		let restoredTransactions = [];
		let restoredProducts = [];
		let restoredCustomers = [];
		let restoredStockMovements = [];
		let restoredCurrencies = [];
		if (parsed?.posDataset && typeof parsed.posDataset === "object") {
			restoredTransactions = Array.isArray(parsed.posDataset.transactions) ? parsed.posDataset.transactions : [];
			restoredProducts = Array.isArray(parsed.posDataset.products) ? parsed.posDataset.products : [];
			restoredCustomers = Array.isArray(parsed.posDataset.customers) ? parsed.posDataset.customers : [];
			restoredStockMovements = Array.isArray(parsed.posDataset.stockMovements) ? parsed.posDataset.stockMovements : [];
			restoredCurrencies = Array.isArray(parsed.posDataset.currencies) ? parsed.posDataset.currencies : [];
		} else if (Array.isArray(sqliteExportObj?.tables)) {
			const txTable = sqliteExportObj.tables.find((t) => t.name === "offline_transactions");
			if (Array.isArray(txTable?.values)) for (const row of txTable.values) {
				const payloadJson = row?.[6];
				if (typeof payloadJson === "string") try {
					const tx = JSON.parse(payloadJson);
					if (tx?.id) restoredTransactions.push(tx);
				} catch {}
			}
		}
		if (restoredTransactions.length > 0) await this.persistTransactions(safeCompanyId, restoredTransactions);
		if (restoredProducts.length > 0) await this.persistWorkspaceSnapshot(safeCompanyId, "products", restoredProducts);
		if (restoredCustomers.length > 0) await this.persistWorkspaceSnapshot(safeCompanyId, "customers", restoredCustomers);
		if (restoredStockMovements.length > 0) await this.persistWorkspaceSnapshot(safeCompanyId, "stockMovements", restoredStockMovements);
		if (restoredCurrencies.length > 0) await this.persistWorkspaceSnapshot(safeCompanyId, "currencies", restoredCurrencies);
		return {
			ok: true,
			restoredTransactions,
			restoredProducts,
			restoredCustomers,
			restoredStockMovements,
			restoredCurrencies
		};
	}
};
var offlineSqliteStorage = new OfflineSqlitePersistenceManager();
// src/lib/inventory-rules.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
/**
* Calculates updated stock quantity based on stock movement type and quantity delta.
*/
function calculateStockAdjustment(currentStock, type, amount) {
	const safeAmount = Math.max(0, Math.floor(amount));
	switch (type) {
		case "sale":
		case "damage":
		case "loss": return Math.max(0, currentStock - safeAmount);
		case "restock": return currentStock + safeAmount;
		case "audit": return safeAmount;
		default: return currentStock;
	}
}
/**
* Generates a collision-resistant, audit-safe transaction reference ID using `crypto.randomUUID()`.
*/
function generateTransactionId(date = /* @__PURE__ */ new Date()) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	let uniqueSuffix;
	if (typeof globalThis.crypto?.randomUUID === "function") uniqueSuffix = globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
	else if (typeof globalThis.crypto?.getRandomValues === "function") {
		const bytes = /* @__PURE__ */ new Uint8Array(6);
		globalThis.crypto.getRandomValues(bytes);
		uniqueSuffix = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
	} else uniqueSuffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
	return `TXN-${y}${m}${d}-${uniqueSuffix}`;
}
/**
* Generates a valid 12-digit EAN/UPC-like barcode ONLY when explicitly requested by the user.
*/
function generateBarcode() {
	let code = "200";
	for (let i = 0; i < 9; i++) code += Math.floor(Math.random() * 10).toString();
	return code;
}
/**
* Generates a collision-resistant idempotency key to prevent duplicate checkout requests.
*/
function generateIdempotencyKey() {
	if (typeof globalThis.crypto?.randomUUID === "function") return `idemp_${Date.now()}_${globalThis.crypto.randomUUID()}`;
	return `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
/**
* Normalizes a primary barcode and optional additional barcodes into a deduplicated array
* where the first item is always the primary barcode.
*/
function normalizeProductBarcodes(primaryBarcode, extraBarcodes) {
	const result = [];
	const seen = /* @__PURE__ */ new Set();
	const addCode = (raw) => {
		if (!raw || typeof raw !== "string") return;
		const trimmed = raw.trim();
		if (!trimmed) return;
		if (!seen.has(trimmed)) {
			seen.add(trimmed);
			result.push(trimmed);
		}
	};
	addCode(primaryBarcode);
	if (Array.isArray(extraBarcodes)) for (const code of extraBarcodes) addCode(code);
	return result;
}
/**
* Returns all barcodes associated with a product (primary + any secondary barcodes in barcodes or customFields).
*/
function getAllProductBarcodes$1(product) {
	const extra = product.barcodes || product.customFields?.barcodes || [];
	return normalizeProductBarcodes(product.barcode, extra);
}
/**
* Splits a raw SKU / multi-barcode input string (separated by "|", ",", ";", or spaces)
* into clean individual barcode tokens.
*/
function parseBarcodeSkuInput(rawInput) {
	if (!rawInput || typeof rawInput !== "string") return [];
	const parts = rawInput.split(/[|,;\n]+/).map((part) => part.trim()).filter(Boolean);
	return normalizeProductBarcodes(parts[0] || "", parts.slice(1));
}
/**
* Synchronizes a product's SKU with its single barcode or multiple barcodes.
* When the product has one or more barcodes, SKU is formatted as those barcode(s) (e.g. "6281001" or "6281001 | 6281002").
*/
function formatProductBarcodeSku(barcodes, fallbackSku, serialNumber) {
	const normalized = normalizeProductBarcodes(barcodes[0] || "", barcodes.slice(1));
	if (normalized.length > 0) return normalized.join(" | ");
	const cleanFallback = (fallbackSku || "").trim();
	if (cleanFallback) return cleanFallback;
	const safeSerial = Number(serialNumber);
	if (Number.isFinite(safeSerial) && safeSerial > 0) return `ITEM-${String(Math.floor(safeSerial)).padStart(4, "0")}`;
	return `ITEM-${Date.now().toString().slice(-4)}`;
}
/**
* Evaluates the expiry status of a product given its expiryDate (YYYY-MM-DD) or customFields.expiryDate.
*/
function getProductExpiryStatus(productOrDate, nowDate = /* @__PURE__ */ new Date()) {
	const rawDate = typeof productOrDate === "string" ? productOrDate : productOrDate && typeof productOrDate === "object" ? productOrDate.expiryDate || productOrDate.customFields?.expiryDate : null;
	const cleanDate = typeof rawDate === "string" ? rawDate.trim() : "";
	if (!cleanDate) return {
		expiryDate: null,
		status: "none",
		daysRemaining: null
	};
	const parsed = /* @__PURE__ */ new Date(`${cleanDate.slice(0, 10)}T23:59:59`);
	if (Number.isNaN(parsed.getTime())) return {
		expiryDate: cleanDate,
		status: "none",
		daysRemaining: null
	};
	const todayStart = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
	const expiryDay = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
	const diffDays = Math.round((expiryDay.getTime() - todayStart.getTime()) / 864e5);
	if (diffDays < 0) return {
		expiryDate: cleanDate.slice(0, 10),
		status: "expired",
		daysRemaining: diffDays
	};
	if (diffDays <= 30) return {
		expiryDate: cleanDate.slice(0, 10),
		status: "expiring_soon",
		daysRemaining: diffDays
	};
	return {
		expiryDate: cleanDate.slice(0, 10),
		status: "valid",
		daysRemaining: diffDays
	};
}
/**
* Checks whether a search query or scanned code matches a product's primary barcode or any secondary barcode.
*/
function matchesProductBarcode(product, queryOrCode, exact = false) {
	const clean = queryOrCode.trim();
	if (!clean) return false;
	const allCodes = getAllProductBarcodes$1(product);
	if (exact) return allCodes.some((c) => c === clean);
	return allCodes.some((c) => c.toLowerCase().includes(clean.toLowerCase()));
}
/**
* Resolves a barcode scanned via camera (or captured from image) into a product's primary or additional barcode list,
* checking for duplicates and conflicts with other products.
* IMPORTANT: Never auto-generates a barcode if scannedCode is empty.
*/
function resolveScannedProductBarcode(params) {
	const code = (params.scannedCode || "").trim();
	if (!code) return {
		ok: false,
		code: "",
		primaryBarcode: params.currentPrimary,
		additionalBarcodes: params.currentAdditional,
		errorEn: "No barcode was detected or entered. Point the camera at a clear barcode or click Generate Barcode explicitly.",
		errorAr: "لم يتم قراءة أو إدخال أي باركود. يرجى توجيه الكاميرا نحو باركود واضح أو الضغط على زر توليد باركود يدوياً."
	};
	const conflict = params.existingProducts.find((p) => (!params.editingProductId || p.id !== params.editingProductId) && matchesProductBarcode(p, code, true));
	if (conflict) return {
		ok: false,
		code,
		primaryBarcode: params.currentPrimary,
		additionalBarcodes: params.currentAdditional,
		errorEn: `Barcode "${code}" is already assigned to "${conflict.name}".`,
		errorAr: `الباركود "${code}" مستخدم بالفعل للمنتج "${conflict.nameAr || conflict.name}".`
	};
	const allExisting = normalizeProductBarcodes(params.currentPrimary, params.currentAdditional);
	if (params.target === "primary") return {
		ok: true,
		code,
		primaryBarcode: code,
		additionalBarcodes: params.currentAdditional.filter((c) => c.trim() !== code)
	};
	if (!params.currentPrimary.trim()) return {
		ok: true,
		code,
		primaryBarcode: code,
		additionalBarcodes: params.currentAdditional
	};
	if (allExisting.includes(code)) return {
		ok: false,
		code,
		primaryBarcode: params.currentPrimary,
		additionalBarcodes: params.currentAdditional,
		errorEn: `Barcode "${code}" is already added to this product.`,
		errorAr: `الباركود "${code}" مضاف بالفعل لهذا المنتج.`
	};
	return {
		ok: true,
		code,
		primaryBarcode: params.currentPrimary,
		additionalBarcodes: [...params.currentAdditional, code]
	};
}
/**
* Extracts or infers the sequential serial number of a product.
*/
function getProductSerialNumber(product, fallbackIndex) {
	const direct = Number(product.serialNumber ?? product.customFields?.serialNumber);
	if (Number.isFinite(direct) && direct > 0) return Math.floor(direct);
	if (typeof product.id === "string") {
		const match = product.id.match(/^prod-(\d+)$/);
		if (match) {
			const parsed = parseInt(match[1], 10);
			if (parsed > 0 && parsed < 1e5) return parsed;
		}
	}
	return fallbackIndex !== void 0 && fallbackIndex >= 0 ? fallbackIndex + 1 : 1;
}
/**
* Formats a product serial number into a padded badge string (e.g. #0001).
*/
function formatProductSerialNumber(serialNumber) {
	const safe = Number(serialNumber);
	if (!Number.isFinite(safe) || safe <= 0) return "#0001";
	return `#${String(Math.floor(safe)).padStart(4, "0")}`;
}
/**
* Calculates the next sequential product serial number based on existing products.
*/
function getNextProductSerialNumber(products) {
	if (!products || products.length === 0) return 1;
	let maxSerial = 0;
	products.forEach((p, idx) => {
		const s = getProductSerialNumber(p, idx);
		if (s > maxSerial) maxSerial = s;
	});
	return maxSerial + 1;
}
/**
* Precomputes lowercased searchable fields and serial tokens for a single product
* so repeated search keystrokes do not rebuild strings or barcode arrays.
*/
function buildProductSearchIndexEntry(product, fallbackIndex) {
	const serial = getProductSerialNumber(product, fallbackIndex);
	const serialPlain = String(serial);
	const serialPadded3 = serialPlain.padStart(3, "0");
	const serialPadded4 = serialPlain.padStart(4, "0");
	const descEn = (product.description || product.customFields?.description || "").toString().toLowerCase();
	const descAr = (product.descriptionAr || product.customFields?.descriptionAr || "").toString().toLowerCase();
	const nameEn = (product.name || "").toLowerCase();
	const nameAr = (product.nameAr || "").toLowerCase();
	const sku = (product.sku || "").toLowerCase();
	const catEn = (product.category || "").toLowerCase();
	const catAr = (product.categoryAr || "").toLowerCase();
	const expiryStr = (product.expiryDate || product.customFields?.expiryDate || "").toString().toLowerCase();
	const barcodes = getAllProductBarcodes$1({
		barcode: product.barcode || "",
		barcodes: product.barcodes,
		customFields: product.customFields
	});
	const parts = [
		nameEn,
		nameAr,
		descEn,
		descAr,
		sku,
		catEn,
		catAr
	];
	if (expiryStr) parts.push(expiryStr);
	for (const code of barcodes) if (code) parts.push(code.toLowerCase());
	return {
		serial,
		serialPlain,
		serialPadded3,
		serialPadded4,
		serialHashPlain: `#${serialPlain}`,
		serialHashPadded3: `#${serialPadded3}`,
		serialHashPadded4: `#${serialPadded4}`,
		searchableText: parts.join("\n")
	};
}
/**
* Precomputes a search index map keyed by product ID for memoized O(1) filtering in UI lists.
*/
function buildProductSearchIndexMap(products) {
	const map = /* @__PURE__ */ new Map();
	products.forEach((product, idx) => {
		const key = product.id || `__idx_${idx}`;
		map.set(key, buildProductSearchIndexEntry(product, idx));
	});
	return map;
}
/**
* Splits a search string into normalized lowercase tokens once per filter pass.
*/
function tokenizeProductSearchQuery(query) {
	const cleanQuery = (query || "").trim().toLowerCase();
	if (!cleanQuery) return [];
	return cleanQuery.split(/\s+/).filter(Boolean);
}
/**
* Evaluates pre-tokenized search terms against a precomputed ProductSearchIndexEntry.
*/
function matchesProductSearchIndexEntry(entry, tokens) {
	if (!tokens || tokens.length === 0) return true;
	return tokens.every((token) => {
		const strippedHash = token.startsWith("#") ? token.slice(1) : token;
		const isNumericToken = /^\d+$/.test(strippedHash);
		if (token === entry.serialPlain || token === entry.serialPadded3 || token === entry.serialPadded4 || token === entry.serialHashPlain || token === entry.serialHashPadded3 || token === entry.serialHashPadded4 || isNumericToken && parseInt(strippedHash, 10) === entry.serial) return true;
		return entry.searchableText.includes(token);
	});
}
/**
* Builds the price history and modification audit trail when creating or updating a product.
*/
function buildProductAuditTrail(params) {
	const now = params.nowIso || (/* @__PURE__ */ new Date()).toISOString();
	const actor = params.changedBy || "Main Terminal";
	const existing = params.existingProduct;
	const next = params.nextProduct;
	const nextCurrency = (next.priceCurrency || next.customFields?.priceCurrency || existing?.priceCurrency || existing?.customFields?.priceCurrency || "SDG").toString().toUpperCase();
	const nextCost = Number(next.costPrice ?? existing?.costPrice ?? 0);
	const nextSell = Number(next.sellingPrice ?? existing?.sellingPrice ?? 0);
	if (!existing) {
		const initMod = {
			id: `mod_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
			timestamp: now,
			action: "created",
			summaryEn: `Product created with selling price ${nextSell} ${nextCurrency}`,
			summaryAr: `تمت إضافة المنتج بسعر بيع ${nextSell} ${nextCurrency}`,
			changedFields: ["created"],
			changedBy: actor
		};
		const initPrice = {
			id: `ph_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
			timestamp: now,
			previousCostPrice: nextCost,
			newCostPrice: nextCost,
			previousSellingPrice: nextSell,
			newSellingPrice: nextSell,
			currency: nextCurrency,
			changedBy: actor,
			note: "Initial price / السعر الابتدائي"
		};
		return {
			createdAt: next.createdAt || now,
			previousCostPrice: void 0,
			previousSellingPrice: void 0,
			priceUpdatedAt: now,
			priceHistory: [initPrice],
			modificationHistory: [initMod]
		};
	}
	const prevPriceHistory = existing.priceHistory || existing.customFields?.priceHistory || [];
	const prevModHistory = existing.modificationHistory || existing.customFields?.modificationHistory || [];
	const oldCost = Number(existing.costPrice || 0);
	const oldSell = Number(existing.sellingPrice || 0);
	const costChanged = Math.abs(nextCost - oldCost) > 1e-4;
	const sellChanged = Math.abs(nextSell - oldSell) > 1e-4;
	const priceChanged = costChanged || sellChanged;
	const changedFields = [];
	const summaryPartsEn = [];
	const summaryPartsAr = [];
	if (next.name !== void 0 && next.name !== existing.name) {
		changedFields.push("name");
		summaryPartsEn.push(`Name: "${existing.name}" → "${next.name}"`);
		summaryPartsAr.push(`الاسم: "${existing.name}" ← "${next.name}"`);
	}
	if (next.nameAr !== void 0 && (next.nameAr || "") !== (existing.nameAr || "")) {
		changedFields.push("nameAr");
		summaryPartsEn.push(`Arabic Name updated`);
		summaryPartsAr.push(`تعديل الاسم العربي إلى "${next.nameAr}"`);
	}
	const oldDesc = existing.description || existing.customFields?.description || "";
	if ((next.description ?? next.customFields?.description ?? oldDesc) !== oldDesc) {
		changedFields.push("description");
		summaryPartsEn.push(`Description updated`);
		summaryPartsAr.push(`تحديث وصف المنتج`);
	}
	if (sellChanged) {
		changedFields.push("sellingPrice");
		summaryPartsEn.push(`Selling Price: ${oldSell} → ${nextSell} ${nextCurrency}`);
		summaryPartsAr.push(`سعر البيع: ${oldSell} ← ${nextSell} ${nextCurrency}`);
	}
	if (costChanged) {
		changedFields.push("costPrice");
		summaryPartsEn.push(`Cost Price: ${oldCost} → ${nextCost} ${nextCurrency}`);
		summaryPartsAr.push(`سعر التكلفة: ${oldCost} ← ${nextCost} ${nextCurrency}`);
	}
	if (next.stock !== void 0 && Number(next.stock) !== Number(existing.stock)) {
		changedFields.push("stock");
		summaryPartsEn.push(`Stock: ${existing.stock} → ${next.stock}`);
		summaryPartsAr.push(`المخزون: ${existing.stock} ← ${next.stock}`);
	}
	const oldCodes = getAllProductBarcodes$1(existing).join(",");
	const newCodes = normalizeProductBarcodes(next.barcode !== void 0 ? next.barcode : existing.barcode, next.barcodes !== void 0 ? next.barcodes : existing.barcodes).join(",");
	if (oldCodes !== newCodes) {
		changedFields.push("barcode");
		summaryPartsEn.push(`Barcodes updated (${newCodes || "cleared"})`);
		summaryPartsAr.push(`تحديث الباركود (${newCodes || "بدون باركود"})`);
	}
	if (next.sku !== void 0 && next.sku !== existing.sku) {
		changedFields.push("sku");
		summaryPartsEn.push(`SKU: ${existing.sku} → ${next.sku}`);
		summaryPartsAr.push(`رمز SKU: ${existing.sku} ← ${next.sku}`);
	}
	const oldExpiry = (existing.expiryDate || existing.customFields?.expiryDate || "").toString().trim();
	const newExpiry = next.expiryDate !== void 0 ? (next.expiryDate || "").toString().trim() : next.customFields?.expiryDate !== void 0 ? (next.customFields?.expiryDate || "").toString().trim() : oldExpiry;
	if (oldExpiry !== newExpiry) {
		changedFields.push("expiryDate");
		summaryPartsEn.push(`Expiry Date: ${oldExpiry || "None"} → ${newExpiry || "Cleared"}`);
		summaryPartsAr.push(`تاريخ الانتهاء: ${oldExpiry || "غير محدد"} ← ${newExpiry || "تم مسحه"}`);
	}
	let nextPriceHistory = [...prevPriceHistory];
	let previousCostPrice = existing.previousCostPrice ?? existing.customFields?.previousCostPrice;
	let previousSellingPrice = existing.previousSellingPrice ?? existing.customFields?.previousSellingPrice;
	let priceUpdatedAt = existing.priceUpdatedAt ?? existing.customFields?.priceUpdatedAt;
	if (priceChanged) {
		previousCostPrice = oldCost;
		previousSellingPrice = oldSell;
		priceUpdatedAt = now;
		nextPriceHistory = [{
			id: `ph_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
			timestamp: now,
			previousCostPrice: oldCost,
			newCostPrice: nextCost,
			previousSellingPrice: oldSell,
			newSellingPrice: nextSell,
			currency: nextCurrency,
			changedBy: actor
		}, ...prevPriceHistory].slice(0, 30);
	}
	let nextModHistory = [...prevModHistory];
	if (changedFields.length > 0) nextModHistory = [{
		id: `mod_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
		timestamp: now,
		action: priceChanged ? "price_changed" : changedFields.includes("barcode") ? "barcode_changed" : "updated",
		summaryEn: summaryPartsEn.join(" • ") || "Product details updated",
		summaryAr: summaryPartsAr.join(" • ") || "تم تعديل بيانات المنتج",
		changedFields,
		changedBy: actor
	}, ...prevModHistory].slice(0, 40);
	return {
		createdAt: existing.createdAt || existing.customFields?.createdAt || now,
		previousCostPrice,
		previousSellingPrice,
		priceUpdatedAt,
		priceHistory: nextPriceHistory,
		modificationHistory: nextModHistory
	};
}
/**
* Normalizes Arabic and English text for tolerant category search by any letter or word
* (unifies Alef variants أ/إ/آ -> ا, Teh Marbuta ة -> ه, Alef Maksura ى -> ي, strips diacritics/tatweel).
*/
function normalizeCategorySearchText(value) {
	return String(value || "").trim().toLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي").replace(/\s+/g, " ");
}
/**
* Merges categories from existing products and custom saved categories (`pos_categories`),
* removing empty values and deduplicating by normalized name while preserving original display text.
*/
function mergeAndDeduplicateCategories(productCategories, savedCategories) {
	const seen = /* @__PURE__ */ new Set();
	const result = [];
	const addCandidate = (raw) => {
		const clean = String(raw || "").trim();
		if (!clean) return;
		const norm = normalizeCategorySearchText(clean);
		if (!norm || seen.has(norm)) return;
		seen.add(norm);
		result.push(clean);
	};
	if (Array.isArray(savedCategories)) {
		for (const item of savedCategories) if (typeof item === "string") addCandidate(item);
		else if (item && typeof item === "object") addCandidate(item.name || item.nameAr);
	}
	if (Array.isArray(productCategories)) for (const cat of productCategories) addCandidate(cat);
	return result;
}
/**
* Filters categories by any single character, substring, or multi-word query (Arabic & English).
* Ranks exact matches first, then prefix matches, then substring matches.
*/
function filterCategoriesByQuery(categories, query) {
	const deduped = mergeAndDeduplicateCategories(categories);
	const normQuery = normalizeCategorySearchText(query);
	if (!normQuery) return deduped;
	const queryTokens = normQuery.split(" ").filter(Boolean);
	if (queryTokens.length === 0) return deduped;
	return deduped.filter((cat) => {
		const normCat = normalizeCategorySearchText(cat);
		return queryTokens.every((token) => normCat.includes(token));
	}).sort((a, b) => {
		const normA = normalizeCategorySearchText(a);
		const normB = normalizeCategorySearchText(b);
		const exactA = normA === normQuery ? 0 : 1;
		const exactB = normB === normQuery ? 0 : 1;
		if (exactA !== exactB) return exactA - exactB;
		const startsA = normA.startsWith(normQuery) ? 0 : 1;
		const startsB = normB.startsWith(normQuery) ? 0 : 1;
		if (startsA !== startsB) return startsA - startsB;
		const indexA = normA.indexOf(queryTokens[0]);
		const indexB = normB.indexOf(queryTokens[0]);
		if (indexA !== indexB) return indexA - indexB;
		return a.localeCompare(b);
	});
}
// src/context/pos-storage-helpers.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var STORAGE_KEYS = {
	PRODUCTS: "dqnamo_pos_products_v1",
	TRANSACTIONS: "dqnamo_pos_transactions_v1",
	CUSTOMERS: "dqnamo_pos_customers_v1",
	MOVEMENTS: "dqnamo_pos_movements_v1",
	SETTINGS: "dqnamo_pos_settings_v1",
	CURRENCIES: CURRENCIES_STORAGE_KEY,
	EXCHANGE_RATES: EXCHANGE_RATES_STORAGE_KEY,
	EXCHANGE_RATE_ITEMS: EXCHANGE_RATE_ITEMS_STORAGE_KEY,
	RATE_HISTORY: "dqnamo_pos_rate_history_v1",
	USERS: "dqnamo_pos_users_v1",
	ACTIVE_SESSIONS: "dqnamo_pos_active_sessions_v1",
	CURRENT_USER_ID: "dqnamo_pos_current_user_id_v1",
	UNMET_DEMAND_REQUESTS: "dqnamo_pos_unmet_demand_v1",
	WORKSPACE_MODE: "dqnamo_pos_workspace_mode_v1",
	CURRENT_COMPANY_ID: "dqnamo_pos_current_company_id_v1",
	COMPANIES: "dqnamo_pos_companies_v1",
	BRANCHES: "dqnamo_pos_branches_v1",
	ACTIVE_BRANCH_ID: "dqnamo_pos_active_branch_id_v1",
	EXPENSES: "pos_expenses",
	SESSION_TOKEN: "dqnamo_pos_session_token_v1"
};
var PRACTICE_STORAGE_KEYS = {
	PRODUCTS: "dqnamo_pos_practice_products_v1",
	TRANSACTIONS: "dqnamo_pos_practice_transactions_v1",
	CUSTOMERS: "dqnamo_pos_practice_customers_v1",
	MOVEMENTS: "dqnamo_pos_practice_movements_v1",
	SETTINGS: "dqnamo_pos_practice_settings_v1",
	USERS: "dqnamo_pos_practice_users_v1",
	UNMET_DEMAND_REQUESTS: "dqnamo_pos_practice_unmet_demand_v1",
	EXPENSES: "dqnamo_pos_practice_expenses_v1"
};
var DEFAULT_COMPANY_PROFILE = {
	id: "comp-default",
	legalName: "",
	displayName: "New Store (Offline)",
	displayNameAr: "متجر جديد (أوفلاين)",
	businessType: "",
	country: "Sudan",
	city: "Khartoum",
	address: "",
	phone: "",
	email: "",
	taxNumber: "",
	defaultLanguage: "ar",
	timezone: "Africa/Khartoum",
	fiscalYearStartMonth: 1,
	baseCurrency: "SDG",
	secondaryCurrencies: [],
	exchangeRatePolicy: "manual_daily",
	isDemoPractice: false,
	onboardingCompleted: false,
	createdAt: "2025-01-01T00:00:00.000Z",
	updatedAt: "2025-01-01T00:00:00.000Z"
};
var PRACTICE_COMPANY_PROFILE = {
	id: "comp-demo-practice",
	legalName: "Al-Noor Retail Training Sandbox LLC",
	displayName: "Al-Noor Retail Training Co. (Practice)",
	displayNameAr: "شركة النور للتدريب التجريبي (بيئة معزولة)",
	businessType: "Retail & Wholesale Training Sandbox",
	country: "Sudan",
	city: "Khartoum",
	address: "Practice Sandbox Avenue — Isolated Demo Environment",
	phone: "+249 90 000 0000",
	email: "training@practice.local",
	taxNumber: "PRACTICE-DEMO-000",
	defaultLanguage: "ar",
	timezone: "Africa/Khartoum",
	fiscalYearStartMonth: 1,
	baseCurrency: "SDG",
	secondaryCurrencies: [
		"USD",
		"SAR",
		"AED",
		"EGP"
	],
	exchangeRatePolicy: "manual_daily",
	isDemoPractice: true,
	onboardingCompleted: true,
	createdAt: "2025-01-01T00:00:00.000Z",
	updatedAt: "2025-01-01T00:00:00.000Z"
};
function enrichProductWithSeedMetadata(p, idx) {
	const seedMatch = INITIAL_PRODUCTS.find((sp) => sp.id === p.id || sp.sku === p.sku);
	const serialNumber = getProductSerialNumber(p, seedMatch?.serialNumber ? seedMatch.serialNumber - 1 : idx);
	const description = p.description ?? p.customFields?.description ?? seedMatch?.description;
	const descriptionAr = p.descriptionAr ?? p.customFields?.descriptionAr ?? seedMatch?.descriptionAr;
	const createdAt = p.createdAt ?? p.customFields?.createdAt ?? seedMatch?.createdAt ?? p.updatedAt;
	const previousCostPrice = p.previousCostPrice ?? p.customFields?.previousCostPrice ?? seedMatch?.previousCostPrice;
	const previousSellingPrice = p.previousSellingPrice ?? p.customFields?.previousSellingPrice ?? seedMatch?.previousSellingPrice;
	const priceUpdatedAt = p.priceUpdatedAt ?? p.customFields?.priceUpdatedAt ?? seedMatch?.priceUpdatedAt;
	const priceHistory = p.priceHistory && p.priceHistory.length > 0 ? p.priceHistory : p.customFields?.priceHistory && p.customFields.priceHistory.length > 0 ? p.customFields.priceHistory : seedMatch?.priceHistory;
	const modificationHistory = p.modificationHistory && p.modificationHistory.length > 0 ? p.modificationHistory : p.customFields?.modificationHistory && p.customFields.modificationHistory.length > 0 ? p.customFields.modificationHistory : seedMatch?.modificationHistory;
	return {
		...p,
		serialNumber,
		description,
		descriptionAr,
		createdAt,
		previousCostPrice,
		previousSellingPrice,
		priceUpdatedAt,
		priceHistory,
		modificationHistory,
		customFields: {
			...p.customFields || {},
			serialNumber,
			description,
			descriptionAr,
			createdAt,
			previousCostPrice,
			previousSellingPrice,
			priceUpdatedAt,
			priceHistory,
			modificationHistory
		}
	};
}
var CLEAN_PRODUCTION_MIGRATION_KEY = "dqnamo_pos_clean_prod_v5";
var DEMO_SEED_PRODUCT_IDS = new Set(INITIAL_PRODUCTS.map((p) => p.id));
var DEMO_SEED_SKUS = new Set(INITIAL_PRODUCTS.map((p) => p.sku));
var DEMO_SEED_TX_IDS = new Set(INITIAL_TRANSACTIONS.map((t) => t.id));
var DEMO_SEED_CUSTOMER_IDS = new Set(INITIAL_CUSTOMERS.map((c) => c.id));
var DEMO_SEED_MOVEMENT_IDS = new Set(INITIAL_STOCK_MOVEMENTS.map((m) => m.id));
var DEMO_SEED_USER_IDS = new Set(INITIAL_USERS.map((u) => u.id));
var DEMO_SEED_DEMAND_IDS = new Set(INITIAL_UNMET_DEMAND_REQUESTS.map((d) => d.id));
function getCompanyStorageKey(baseKey, companyId) {
	return `${baseKey}_${(companyId || "comp-default").trim()}`;
}
function filterOutDemoProducts(list) {
	if (!Array.isArray(list)) return [];
	return list.filter((p) => p && !DEMO_SEED_PRODUCT_IDS.has(p.id) && !DEMO_SEED_SKUS.has(p.sku) && !String(p.sku || "").startsWith("PERF-SKU-"));
}
function filterOutDemoUsers(list) {
	if (!Array.isArray(list)) return [];
	return list.filter((u) => u && !DEMO_SEED_USER_IDS.has(u.id));
}
var hasCompletedCleanProductionMigrationInSession = false;
function ensureCleanProductionMigration() {
	if (hasCompletedCleanProductionMigrationInSession) return false;
	if (typeof localStorage === "undefined") return false;
	try {
		if (localStorage.getItem("dqnamo_pos_clean_prod_v5") === "true") {
			hasCompletedCleanProductionMigrationInSession = true;
			return false;
		}
		localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
		localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
		localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
		localStorage.removeItem(STORAGE_KEYS.MOVEMENTS);
		localStorage.removeItem(STORAGE_KEYS.CURRENCIES);
		localStorage.removeItem(STORAGE_KEYS.EXCHANGE_RATES);
		localStorage.removeItem(STORAGE_KEYS.EXCHANGE_RATE_ITEMS);
		localStorage.removeItem(STORAGE_KEYS.RATE_HISTORY);
		localStorage.removeItem(STORAGE_KEYS.UNMET_DEMAND_REQUESTS);
		localStorage.removeItem(STORAGE_KEYS.USERS);
		localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSIONS);
		localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
		const keysToPurge = [];
		for (let i = 0; i < localStorage.length; i++) {
			const k = localStorage.key(i);
			if (k && (k.startsWith(STORAGE_KEYS.CURRENCIES) || k.startsWith(STORAGE_KEYS.EXCHANGE_RATES) || k.startsWith(STORAGE_KEYS.EXCHANGE_RATE_ITEMS) || k.startsWith(STORAGE_KEYS.RATE_HISTORY) || k.startsWith("dqnamo_pos_exchange_rate_inputs_v1"))) keysToPurge.push(k);
		}
		for (const k of keysToPurge) localStorage.removeItem(k);
		const savedCompanies = localStorage.getItem(STORAGE_KEYS.COMPANIES);
		if (savedCompanies) {
			const parsed = JSON.parse(savedCompanies);
			if (Array.isArray(parsed)) {
				const userCompanies = parsed.filter((c) => c && !c.isDemoPractice && c.id !== "comp-default");
				localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(userCompanies));
			}
		}
		localStorage.setItem(CLEAN_PRODUCTION_MIGRATION_KEY, "true");
		hasCompletedCleanProductionMigrationInSession = true;
		return true;
	} catch {
		return false;
	}
}
function buildPracticeExchangeRateItems() {
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	return DEFAULT_CURRENCIES_LIST.filter((c) => !c.isBase).map((c) => {
		const r = DEFAULT_EXCHANGE_RATES_MAP[c.code] || 100;
		return {
			id: `prac-rate-${c.code.toLowerCase()}-sdg`,
			sourceCurrency: c.code,
			targetCurrency: "SDG",
			rate: r,
			inverseRate: Math.round(1 / r * 1e6) / 1e6,
			effectiveFrom: nowIso,
			expiryDate: null,
			isActive: true,
			sourceSymbol: c.symbol,
			targetSymbol: "ج.س",
			sourceName: c.name,
			targetName: "Sudanese Pound"
		};
	});
}
function createEmptyCompanyOperationalState() {
	return {
		products: [],
		transactions: [],
		expenses: [],
		customers: [],
		stockMovements: [],
		unmetDemandRequests: [],
		currencies: [],
		exchangeRates: { SDG: 1 },
		exchangeRateItems: [],
		exchangeRateHistory: [],
		users: [],
		activeSessions: []
	};
}
function loadCompanyOperationalState(companyId, workspaceMode = "PRODUCTION") {
	if (workspaceMode === "PRACTICE") return createEmptyCompanyOperationalState();
	let products = [];
	let transactions = [];
	let expenses = [];
	let customers = [];
	let stockMovements = [];
	let unmetDemandRequests = [];
	let currencies = [];
	let exchangeRates = { SDG: 1 };
	let exchangeRateItems = [];
	let exchangeRateHistory = [];
	let users = [];
	let activeSessions = [];
	let isRestoredCompany = false;
	try {
		isRestoredCompany = localStorage.getItem(getCompanyStorageKey("pos_backup_restored", companyId)) === "true" || localStorage.getItem("pos_backup_restored_global") === "true";
	} catch {}
	try {
		const rawProds = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.PRODUCTS, companyId));
		if (rawProds) {
			const parsedProds = JSON.parse(rawProds);
			products = isRestoredCompany ? Array.isArray(parsedProds) ? parsedProds : [] : filterOutDemoProducts(parsedProds);
		}
	} catch {}
	try {
		const rawTxs = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.TRANSACTIONS, companyId));
		if (rawTxs) {
			const parsed = JSON.parse(rawTxs);
			transactions = Array.isArray(parsed) ? isRestoredCompany ? parsed : parsed.filter((t) => t && !DEMO_SEED_TX_IDS.has(t.id)) : [];
		}
	} catch {}
	try {
		const rawCusts = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.CUSTOMERS, companyId));
		if (rawCusts) {
			const parsed = JSON.parse(rawCusts);
			customers = Array.isArray(parsed) ? isRestoredCompany ? parsed : parsed.filter((c) => c && !DEMO_SEED_CUSTOMER_IDS.has(c.id)) : [];
		}
	} catch {}
	try {
		const rawMovs = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.MOVEMENTS, companyId));
		if (rawMovs) {
			const parsed = JSON.parse(rawMovs);
			stockMovements = Array.isArray(parsed) ? isRestoredCompany ? parsed : parsed.filter((m) => m && !DEMO_SEED_MOVEMENT_IDS.has(m.id)) : [];
		}
	} catch {}
	try {
		const rawDemand = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.UNMET_DEMAND_REQUESTS, companyId));
		if (rawDemand) {
			const parsed = JSON.parse(rawDemand);
			unmetDemandRequests = Array.isArray(parsed) ? isRestoredCompany ? parsed : parsed.filter((d) => d && !DEMO_SEED_DEMAND_IDS.has(d.id)) : [];
		}
	} catch {}
	try {
		const rawCur = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.CURRENCIES, companyId));
		if (rawCur) {
			const parsed = JSON.parse(rawCur);
			if (Array.isArray(parsed)) currencies = parsed;
		}
	} catch {}
	try {
		const rawRates = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.EXCHANGE_RATES, companyId));
		if (rawRates) {
			const parsed = JSON.parse(rawRates);
			if (parsed && typeof parsed === "object") exchangeRates = {
				...parsed,
				SDG: 1
			};
		}
	} catch {}
	try {
		const rawItems = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.EXCHANGE_RATE_ITEMS, companyId));
		if (rawItems) {
			const parsed = JSON.parse(rawItems);
			if (Array.isArray(parsed)) exchangeRateItems = parsed;
		}
	} catch {}
	try {
		const rawHist = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.RATE_HISTORY, companyId));
		if (rawHist) {
			const parsed = JSON.parse(rawHist);
			if (Array.isArray(parsed)) exchangeRateHistory = parsed;
		}
	} catch {}
	try {
		const rawUsers = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.USERS, companyId));
		if (rawUsers) users = filterOutDemoUsers(JSON.parse(rawUsers));
	} catch {}
	try {
		const rawSessions = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.ACTIVE_SESSIONS, companyId));
		if (rawSessions) {
			const parsed = JSON.parse(rawSessions);
			const validUserIds = new Set(users.map((u) => u.id));
			activeSessions = Array.isArray(parsed) ? parsed.filter((s) => s && validUserIds.has(s.userId) && !DEMO_SEED_USER_IDS.has(s.userId)) : [];
		}
	} catch {}
	try {
		const rawExpenses = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.EXPENSES, companyId));
		if (rawExpenses) {
			const parsed = JSON.parse(rawExpenses);
			if (Array.isArray(parsed)) expenses = parsed.filter((e) => e && e.id && e.title);
		}
	} catch {}
	return {
		products,
		transactions,
		expenses,
		customers,
		stockMovements,
		unmetDemandRequests,
		currencies,
		exchangeRates,
		exchangeRateItems,
		exchangeRateHistory,
		users,
		activeSessions
	};
}
/**
* Serializes `value` once and persists it to the appropriate company-scoped or practice-mode
* localStorage keys without redundant `JSON.stringify` allocations.
*/
function persistCompanyScopedSlice({ value, workspaceMode, currentCompanyId, prodBaseKey, practiceKey, mirrorGlobalProdKey = true }) {
	try {
		if (workspaceMode === "PRACTICE") {
			if (practiceKey) localStorage.setItem(practiceKey, JSON.stringify(value));
			return;
		}
		const serialized = JSON.stringify(value);
		localStorage.setItem(getCompanyStorageKey(prodBaseKey, currentCompanyId), serialized);
		if (mirrorGlobalProdKey) localStorage.setItem(prodBaseKey, serialized);
	} catch {}
}
function persistStorageValue(key, value, options) {
	if (options?.enabled === false) return;
	try {
		const serialized = options?.rawString ? String(value) : JSON.stringify(value);
		localStorage.setItem(key, serialized);
	} catch {}
}
/**
* Applies a browser cross-tab `storage` event (`e.key`, `e.newValue`) to the matching
* state slice setter when in `PRODUCTION` mode, including `customers`, `expenses`, and `stockMovements`.
*/
function applyCrossTabStorageEvent(event, workspaceMode, currentCompanyId, handlers) {
	if (!event.key || !event.newValue || workspaceMode === "PRACTICE") return false;
	try {
		const parsed = JSON.parse(event.newValue);
		if (!Array.isArray(parsed)) return false;
		if (event.key === getCompanyStorageKey(STORAGE_KEYS.PRODUCTS, currentCompanyId)) {
			handlers.setProducts(parsed);
			return true;
		}
		if (event.key === getCompanyStorageKey(STORAGE_KEYS.TRANSACTIONS, currentCompanyId)) {
			handlers.setTransactions(parsed);
			return true;
		}
		if (event.key === getCompanyStorageKey(STORAGE_KEYS.CUSTOMERS, currentCompanyId)) {
			handlers.setCustomers(parsed);
			return true;
		}
		if (handlers.setExpenses && event.key === getCompanyStorageKey(STORAGE_KEYS.EXPENSES, currentCompanyId)) {
			handlers.setExpenses(parsed);
			return true;
		}
		if (handlers.setStockMovements && event.key === getCompanyStorageKey(STORAGE_KEYS.MOVEMENTS, currentCompanyId)) {
			handlers.setStockMovements(parsed);
			return true;
		}
		if (event.key === getCompanyStorageKey(STORAGE_KEYS.USERS, currentCompanyId) || event.key === STORAGE_KEYS.USERS) {
			handlers.setUsers(parsed);
			return true;
		}
		if (event.key === getCompanyStorageKey(STORAGE_KEYS.ACTIVE_SESSIONS, currentCompanyId) || event.key === STORAGE_KEYS.ACTIVE_SESSIONS) {
			handlers.setActiveSessions(parsed);
			return true;
		}
		if (event.key === getCompanyStorageKey(STORAGE_KEYS.UNMET_DEMAND_REQUESTS, currentCompanyId)) {
			handlers.setUnmetDemandRequests(parsed);
			return true;
		}
	} catch {}
	return false;
}
// src/context/SettingsContext.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var SettingsContext = (0, import_react.createContext)(null);
// src/context/UserContext.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var UserContext = (0, import_react.createContext)(null);
// src/context/ProductContext.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var ProductContext = (0, import_react.createContext)(null);
// src/context/CartContext.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var CartContext = (0, import_react.createContext)(null);
// src/context/ExpenseContext.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var ExpenseContext = (0, import_react.createContext)(null);
// node_modules/@capacitor/haptics/dist/esm/index.js
var Haptics = registerPlugin("Haptics", { web: () => __vitePreload(() => import("./web-Br5jMjt2.js").then((m) => new m.HapticsWeb()), __vite__mapDeps([2,1,3])) });
// src/lib/sound-fx.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var audioCtx = null;
function getAudioContext() {
	if (typeof window === "undefined") return null;
	if (!audioCtx) {
		const AudioContextClass = window.AudioContext || window.webkitAudioContext;
		if (AudioContextClass) audioCtx = new AudioContextClass();
	}
	if (audioCtx && audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
	return audioCtx;
}
/**
* Synthesizes a subtle, tactile mechanical switch click (no external asset required).
*/
function playTactileClick(enabled = true) {
	if (!enabled) return;
	try {
		const ctx = getAudioContext();
		if (!ctx) return;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "triangle";
		osc.frequency.setValueAtTime(140, ctx.currentTime);
		osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + .04);
		gain.gain.setValueAtTime(.12, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .04);
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start();
		osc.stop(ctx.currentTime + .04);
	} catch {}
}
/**
* Barcode scanner audio chirp.
*/
function playScannerBeep(enabled = true) {
	if (!enabled) return;
	try {
		const ctx = getAudioContext();
		if (!ctx) return;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "sine";
		osc.frequency.setValueAtTime(1850, ctx.currentTime);
		gain.gain.setValueAtTime(.15, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .09);
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start();
		osc.stop(ctx.currentTime + .09);
	} catch {}
}
/**
* Cash register completion chime.
*/
function playSuccessChime(enabled = true) {
	if (!enabled) return;
	try {
		const ctx = getAudioContext();
		if (!ctx) return;
		const now = ctx.currentTime;
		[
			523.25,
			659.25,
			783.99,
			1046.5
		].forEach((freq, index) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = "sine";
			osc.frequency.setValueAtTime(freq, now + index * .07);
			gain.gain.setValueAtTime(.08, now + index * .07);
			gain.gain.exponentialRampToValueAtTime(.001, now + index * .07 + .35);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start(now + index * .07);
			osc.stop(now + index * .07 + .35);
		});
	} catch {}
}
/**
* Ticking sound while holding HoldToConfirm button.
*/
function playHoldTick(progressRatio, enabled = true) {
	if (!enabled) return;
	try {
		const ctx = getAudioContext();
		if (!ctx) return;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		const pitch = 200 + progressRatio * 600;
		osc.type = "sine";
		osc.frequency.setValueAtTime(pitch, ctx.currentTime);
		gain.gain.setValueAtTime(.05, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .03);
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start();
		osc.stop(ctx.currentTime + .03);
	} catch {}
}
/**
* Cross-platform haptic pulse via Capacitor Haptics with navigator.vibrate fallback.
*/
async function triggerHaptic(type, enabled = true) {
	if (!enabled) return;
	try {
		if (type === "light") await Haptics.impact({ style: ImpactStyle.Light });
		else if (type === "medium") await Haptics.impact({ style: ImpactStyle.Medium });
		else if (type === "heavy") await Haptics.impact({ style: ImpactStyle.Heavy });
		else if (type === "success") await Haptics.notification({ type: NotificationType.Success });
		else if (type === "warning") await Haptics.notification({ type: NotificationType.Warning });
	} catch {
		if (typeof navigator !== "undefined" && navigator.vibrate) {
			if (type === "light") navigator.vibrate(10);
			else if (type === "medium") navigator.vibrate(25);
			else if (type === "heavy") navigator.vibrate(50);
			else if (type === "success") navigator.vibrate([
				15,
				30,
				25
			]);
		}
	}
}
// src/lib/performance-monitor.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
/**
* Detects whether the client is running on a budget mobile CPU or a constrained 2G/3G network.
*/
function isLowEndOrSlowNetwork() {
	if (typeof navigator === "undefined") return false;
	const cores = navigator.hardwareConcurrency || 4;
	const memory = navigator.deviceMemory || 4;
	const conn = navigator.connection;
	const effectiveType = String(conn?.effectiveType || "4g").toLowerCase();
	return Boolean(conn?.saveData) || cores <= 2 || memory <= 2 || effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g";
}
/**
* Debounces rapidly changing values (such as search inputs or filter queries).
* Automatically clears immediately when value is emptied so "Clear Search" feels instant.
*/
function useDebouncedValue(value, delayMs = 140) {
	const [debouncedValue, setDebouncedValue] = (0, import_react.useState)(value);
	(0, import_react.useEffect)(() => {
		if (value === "" || value === null || value === void 0) {
			setDebouncedValue(value);
			return;
		}
		const adaptiveDelay = isLowEndOrSlowNetwork() ? Math.max(delayMs, 220) : delayMs;
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, adaptiveDelay);
		return () => clearTimeout(timer);
	}, [value, delayMs]);
	return debouncedValue;
}
/**
* Compresses an uploaded image file to WebP (with automatic JPEG fallback) and resizes to maxDim.
*/
function compressImageToOptimalDataUrl(file, maxDim = 360, quality = .82) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Failed to read image file"));
		reader.onload = () => {
			const dataUrl = reader.result;
			const img = new Image();
			img.onerror = () => resolve(dataUrl);
			img.onload = () => {
				try {
					let { width, height } = img;
					if (width > maxDim || height > maxDim) {
						if (width > height) {
							height = Math.round(height * maxDim / width);
							width = maxDim;
						} else {
							width = Math.round(width * maxDim / height);
							height = maxDim;
						}
					}
					const canvas = document.createElement("canvas");
					canvas.width = Math.max(1, width);
					canvas.height = Math.max(1, height);
					const ctx = canvas.getContext("2d");
					if (!ctx) {
						resolve(dataUrl);
						return;
					}
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
					const webpUrl = canvas.toDataURL("image/webp", quality);
					if (webpUrl.startsWith("data:image/webp")) {
						resolve(webpUrl);
						return;
					}
					resolve(canvas.toDataURL("image/jpeg", quality));
				} catch {
					resolve(dataUrl);
				}
			};
			img.src = dataUrl;
		};
		reader.readAsDataURL(file);
	});
}
/**
* Records API call timing into the Real User Monitoring (RUM) ring buffer.
*/
function recordApiTiming(url, durationMs, status) {
	if (typeof window === "undefined" || !window.__DQNAMO_PERF_METRICS__) return;
	const list = window.__DQNAMO_PERF_METRICS__.apiTimings;
	list.push({
		url,
		durationMs: Math.round(durationMs * 100) / 100,
		status,
		timestamp: Date.now()
	});
	if (list.length > 50) list.shift();
}
/**
* Initializes lightweight Real User Monitoring (RUM) for Core Web Vitals (FCP, LCP, CLS)
* and Navigation Timing without external third-party scripts.
*/
function initRealUserMonitoring() {
	if (typeof window === "undefined" || window.__DQNAMO_PERF_METRICS__) return;
	const conn = navigator.connection;
	const metrics = {
		fcpMs: null,
		lcpMs: null,
		clsScore: 0,
		domInteractiveMs: null,
		loadCompleteMs: null,
		effectiveNetworkType: String(conn?.effectiveType || "4g"),
		saveData: Boolean(conn?.saveData),
		hardwareConcurrency: navigator.hardwareConcurrency || 4,
		isLowEndDevice: isLowEndOrSlowNetwork(),
		apiTimings: []
	};
	window.__DQNAMO_PERF_METRICS__ = metrics;
	try {
		if ("PerformanceObserver" in window) {
			new PerformanceObserver((entryList) => {
				for (const entry of entryList.getEntries()) if (entry.name === "first-contentful-paint") metrics.fcpMs = Math.round(entry.startTime);
			}).observe({
				type: "paint",
				buffered: true
			});
			new PerformanceObserver((entryList) => {
				const entries = entryList.getEntries();
				const lastEntry = entries[entries.length - 1];
				if (lastEntry) metrics.lcpMs = Math.round(lastEntry.startTime);
			}).observe({
				type: "largest-contentful-paint",
				buffered: true
			});
			new PerformanceObserver((entryList) => {
				for (const entry of entryList.getEntries()) if (!entry.hadRecentInput && typeof entry.value === "number") metrics.clsScore = Math.round((metrics.clsScore + entry.value) * 1e4) / 1e4;
			}).observe({
				type: "layout-shift",
				buffered: true
			});
		}
		window.addEventListener("load", () => {
			setTimeout(() => {
				const nav = performance.getEntriesByType("navigation")[0];
				if (nav) {
					metrics.domInteractiveMs = Math.round(nav.domInteractive);
					metrics.loadCompleteMs = Math.round(nav.loadEventEnd || performance.now());
				}
			}, 0);
		}, { once: true });
	} catch {}
}
// src/services/api.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var DEFAULT_API_TIMEOUT_MS = 8e3;
var SHORT_CACHE_TTL_MS = 2500;
var inFlightGetRequests = /* @__PURE__ */ new Map();
var shortTermResponseCache = /* @__PURE__ */ new Map();
function invalidateApiCache(prefix) {
	if (!prefix) {
		shortTermResponseCache.clear();
		return;
	}
	for (const key of shortTermResponseCache.keys()) if (key.startsWith(prefix)) shortTermResponseCache.delete(key);
}
/**
* Executes a fetch request with an AbortController timeout (#12 API Timeouts)
* and records latency in Real User Monitoring (#30 RUM).
*/
async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_API_TIMEOUT_MS) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
	const startMs = typeof performance !== "undefined" ? performance.now() : Date.now();
	let mergedHeaders = options.headers;
	try {
		if (typeof window !== "undefined" && window.localStorage) {
			const sessionToken = window.localStorage.getItem("dqnamo_pos_session_token_v1");
			if (sessionToken) {
				const headersObj = new Headers(options.headers || {});
				if (!headersObj.has("Authorization") && !headersObj.has("x-session-token")) headersObj.set("Authorization", `Bearer ${sessionToken}`);
				mergedHeaders = headersObj;
			}
		}
	} catch {}
	try {
		const res = await fetch(url, {
			...options,
			headers: mergedHeaders,
			signal: options.signal || controller.signal
		});
		recordApiTiming(url, (typeof performance !== "undefined" ? performance.now() : Date.now()) - startMs, res.status);
		return res;
	} catch (err) {
		recordApiTiming(url, (typeof performance !== "undefined" ? performance.now() : Date.now()) - startMs, 0);
		if (err?.name === "AbortError") throw new Error(`API request timed out after ${timeoutMs}ms: ${url}`);
		throw err;
	} finally {
		clearTimeout(timeoutId);
	}
}
/**
* Deduplicates concurrent identical GET requests and caches responses briefly (#3 Duplicate API Calls).
*/
async function deduplicatedGetJson(url, errorMessage) {
	const now = Date.now();
	const cached = shortTermResponseCache.get(url);
	if (cached && cached.expiresAt > now) return cached.data;
	const existingPromise = inFlightGetRequests.get(url);
	if (existingPromise) return existingPromise;
	const requestPromise = (async () => {
		try {
			const res = await fetchWithTimeout(url, { method: "GET" });
			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData.error || `${errorMessage}: ${res.statusText}`);
			}
			const data = await res.json();
			shortTermResponseCache.set(url, {
				expiresAt: Date.now() + SHORT_CACHE_TTL_MS,
				data
			});
			return data;
		} finally {
			inFlightGetRequests.delete(url);
		}
	})();
	inFlightGetRequests.set(url, requestPromise);
	return requestPromise;
}
var api = {
	async fetchBootstrapData() {
		const [productsRes, currenciesRes, ratesRes] = await Promise.allSettled([
			this.getProducts(),
			this.getCurrencies(),
			this.getExchangeRates(true)
		]);
		return {
			products: productsRes.status === "fulfilled" ? productsRes.value : null,
			currencies: currenciesRes.status === "fulfilled" ? currenciesRes.value : null,
			exchangeRates: ratesRes.status === "fulfilled" ? ratesRes.value : null
		};
	},
	async getProducts(search, category) {
		const params = new URLSearchParams();
		if (search) params.set("q", search);
		if (category && category !== "all") params.set("category", category);
		const qs = params.toString();
		return deduplicatedGetJson(qs ? `/api/products?${qs}` : "/api/products", "Failed to fetch products");
	},
	async getProduct(id) {
		return deduplicatedGetJson(`/api/products/${id}`, "Failed to fetch product");
	},
	async createProduct(data) {
		const res = await fetchWithTimeout("/api/products", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});
		if (!res.ok) {
			const errData = await res.json().catch(() => ({}));
			throw new Error(errData.error || `Failed to create product: ${res.statusText}`);
		}
		invalidateApiCache("/api/products");
		return res.json();
	},
	async updateProduct(id, updates) {
		const res = await fetchWithTimeout(`/api/products/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updates)
		});
		if (!res.ok) {
			const errData = await res.json().catch(() => ({}));
			throw new Error(errData.error || `Failed to update product: ${res.statusText}`);
		}
		invalidateApiCache("/api/products");
		return res.json();
	},
	async deleteProduct(id) {
		const res = await fetchWithTimeout(`/api/products/${id}`, { method: "DELETE" });
		if (!res.ok) {
			const errData = await res.json().catch(() => ({}));
			throw new Error(errData.error || `Failed to delete product: ${res.statusText}`);
		}
		invalidateApiCache("/api/products");
	},
	async getCurrencies() {
		return deduplicatedGetJson("/api/currencies", "Failed to fetch currencies");
	},
	async saveCurrency(data) {
		const res = await fetchWithTimeout("/api/currencies", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});
		if (!res.ok) {
			const errData = await res.json().catch(() => ({}));
			throw new Error(errData.error || "Failed to save currency");
		}
		invalidateApiCache("/api/currencies");
		invalidateApiCache("/api/exchange-rates");
		return res.json();
	},
	async deleteCurrency(code) {
		const res = await fetchWithTimeout(`/api/currencies/${encodeURIComponent(code)}`, { method: "DELETE" });
		if (!res.ok) {
			const errData = await res.json().catch(() => ({}));
			throw new Error(errData.error || "Failed to delete currency");
		}
		invalidateApiCache("/api/currencies");
		invalidateApiCache("/api/exchange-rates");
		return res.json();
	},
	async getExchangeRates(effectiveOnly = false) {
		return deduplicatedGetJson(effectiveOnly ? "/api/exchange-rates?effective=true" : "/api/exchange-rates", "Failed to fetch exchange rates");
	},
	async getExchangeRateHistory(source, target) {
		return deduplicatedGetJson(`/api/exchange-rates/history?source=${encodeURIComponent(source)}&target=${encodeURIComponent(target)}`, "Failed to fetch exchange rate history");
	},
	async saveExchangeRate(data) {
		const res = await fetchWithTimeout("/api/exchange-rates", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});
		if (!res.ok) {
			const errData = await res.json().catch(() => ({}));
			throw new Error(errData.error || "Failed to save exchange rate");
		}
		invalidateApiCache("/api/exchange-rates");
		return res.json();
	},
	async updateExchangeRate(id, updates) {
		const res = await fetchWithTimeout(`/api/exchange-rates/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updates)
		});
		if (!res.ok) {
			const errData = await res.json().catch(() => ({}));
			throw new Error(errData.error || "Failed to update exchange rate");
		}
		invalidateApiCache("/api/exchange-rates");
		return res.json();
	},
	async deleteExchangeRate(id) {
		const res = await fetchWithTimeout(`/api/exchange-rates/${encodeURIComponent(id)}`, { method: "DELETE" });
		if (!res.ok) {
			const errData = await res.json().catch(() => ({}));
			throw new Error(errData.error || "Failed to delete exchange rate");
		}
		invalidateApiCache("/api/exchange-rates");
		return res.json();
	},
	async convertAmount(amount, from, to, timestamp) {
		const params = new URLSearchParams({
			amount: amount.toString(),
			from,
			to
		});
		if (timestamp) params.set("timestamp", timestamp);
		return deduplicatedGetJson(`/api/convert?${params.toString()}`, "Conversion failed");
	},
	async checkHealth() {
		return deduplicatedGetJson("/api/health", "Health check failed");
	}
};
// src/context/domains/useCurrenciesAndSettingsDomain.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
function useCurrenciesAndSettingsDomain({ settings, setSettings, currencies, setCurrencies, setExchangeRates, setExchangeRateItems, setExchangeRateHistory, workspaceMode, currentCompany, currentCompanyId, currentUser }) {
	return {
		updateSettings: (0, import_react.useCallback)((updates) => {
			setSettings((prev) => {
				const next = {
					...prev,
					...updates
				};
				if (updates.exchangeRates) {
					const mergedRates = {
						...prev.exchangeRates,
						...updates.exchangeRates,
						SDG: 1
					};
					next.exchangeRates = mergedRates;
					setExchangeRates(mergedRates);
					savePersistedExchangeRates(mergedRates);
				}
				return next;
			});
			triggerHaptic("light", settings.hapticsEnabled);
		}, [
			setSettings,
			setExchangeRates,
			settings.hapticsEnabled
		]),
		syncCurrenciesState: (0, import_react.useCallback)((list) => {
			if (!list) return;
			setCurrencies(list);
			savePersistedCurrencies(list);
		}, [setCurrencies]),
		saveCurrency: (0, import_react.useCallback)(async (data) => {
			const code = data.code.toUpperCase().trim();
			const name = data.name.trim() || code;
			const nameAr = data.nameAr?.trim() || name;
			const symbol = data.symbol.trim() || code;
			const decimalPlaces = data.decimalPlaces ?? 2;
			const initialRate = data.initialRateToBase && data.initialRateToBase > 0 ? Number(data.initialRateToBase) : void 0;
			const shouldBeBase = Boolean(data.isBase) || code === "SDG";
			let savedCurrency = {
				code,
				name,
				nameAr,
				symbol,
				decimalPlaces,
				isBase: shouldBeBase,
				isActive: true
			};
			if (workspaceMode === "PRACTICE" || currentCompany.id !== "comp-clean-store" && currentUser.id !== "unassigned-operator") try {
				savedCurrency = {
					...await api.saveCurrency({
						code,
						name,
						nameAr,
						symbol,
						decimalPlaces,
						initialRateToBase: !shouldBeBase ? initialRate : void 0
					}),
					isBase: shouldBeBase,
					isActive: true
				};
			} catch {}
			setCurrencies((prev) => {
				let nextList = prev.some((c) => c.code.toUpperCase() === code) ? prev.map((c) => c.code.toUpperCase() === code ? {
					...c,
					...savedCurrency,
					isBase: shouldBeBase,
					isActive: true
				} : shouldBeBase ? {
					...c,
					isBase: false
				} : c) : [...shouldBeBase ? prev.map((c) => ({
					...c,
					isBase: false
				})) : prev, savedCurrency];
				if (!nextList.some((c) => c.isBase)) {
					if (nextList.some((c) => c.code.toUpperCase() === "SDG")) nextList = nextList.map((c) => c.code.toUpperCase() === "SDG" ? {
						...c,
						isBase: true
					} : c);
					else nextList = [{
						code: "SDG",
						name: "Sudanese Pound",
						nameAr: "جنيه سوداني",
						symbol: "ج.س",
						decimalPlaces: 2,
						isBase: true,
						isActive: true
					}, ...nextList];
				}
				savePersistedCurrencies(nextList);
				return nextList;
			});
			if (shouldBeBase) {
				setExchangeRates((prev) => {
					const nextMap = {
						...prev,
						[code]: 1,
						SDG: prev.SDG || 1
					};
					savePersistedExchangeRates(nextMap);
					return nextMap;
				});
				setSettings((prevSettings) => ({
					...prevSettings,
					currency: code,
					exchangeRates: {
						...prevSettings.exchangeRates || {},
						[code]: 1,
						SDG: 1
					}
				}));
			} else if (initialRate && initialRate > 0) {
				const currentBase = currencies.find((c) => c.isBase);
				const targetCode = currentBase?.code || "SDG";
				const targetSymbol = currentBase?.symbol || "ج.س";
				const targetName = currentBase?.name || "Sudanese Pound";
				const nowIso = (/* @__PURE__ */ new Date()).toISOString();
				setExchangeRates((prev) => {
					const nextMap = {
						...prev,
						[code]: initialRate,
						SDG: prev.SDG || 1
					};
					savePersistedExchangeRates(nextMap);
					return nextMap;
				});
				setSettings((prevSettings) => ({
					...prevSettings,
					exchangeRates: {
						...prevSettings.exchangeRates || {},
						[code]: initialRate,
						SDG: 1
					}
				}));
				setExchangeRateItems((prevItems) => {
					const newItem = {
						id: `rate-${code.toLowerCase()}-${targetCode.toLowerCase()}-${Date.now()}`,
						sourceCurrency: code,
						targetCurrency: targetCode,
						rate: initialRate,
						inverseRate: Math.round(1 / initialRate * 1e6) / 1e6,
						effectiveFrom: nowIso,
						expiryDate: null,
						isActive: true,
						sourceSymbol: symbol,
						targetSymbol,
						sourceName: name,
						targetName
					};
					const nextItems = prevItems.some((i) => i.sourceCurrency.toUpperCase() === code && i.targetCurrency.toUpperCase() === targetCode) ? prevItems.map((i) => i.sourceCurrency.toUpperCase() === code && i.targetCurrency.toUpperCase() === targetCode ? {
						...i,
						...newItem
					} : i) : [...prevItems, newItem];
					savePersistedExchangeRateItems(nextItems);
					return nextItems;
				});
			}
			return savedCurrency;
		}, [
			currencies,
			workspaceMode,
			currentCompany.id,
			currentUser.id,
			setCurrencies,
			setExchangeRates,
			setSettings,
			setExchangeRateItems
		]),
		removeCurrency: (0, import_react.useCallback)(async (code) => {
			const cleanCode = code.toUpperCase().trim();
			if (!cleanCode) return;
			if (workspaceMode === "PRACTICE" || currentCompany.id !== "comp-clean-store" && currentUser.id !== "unassigned-operator") try {
				if (cleanCode !== "SDG") await api.deleteCurrency(cleanCode);
			} catch {}
			setCurrencies((prev) => {
				let nextList = prev.filter((c) => c.code.toUpperCase() !== cleanCode);
				if (nextList.length > 0 && !nextList.some((c) => c.isBase)) nextList = nextList.map((c, idx) => idx === 0 ? {
					...c,
					isBase: true
				} : c);
				savePersistedCurrencies(nextList);
				return nextList;
			});
			setExchangeRateItems((prev) => {
				const nextItems = prev.filter((r) => r.sourceCurrency.toUpperCase() !== cleanCode && r.targetCurrency.toUpperCase() !== cleanCode);
				savePersistedExchangeRateItems(nextItems);
				return nextItems;
			});
			setSettings((prev) => {
				if (prev.currency === cleanCode) {
					const remaining = currencies.filter((c) => c.code.toUpperCase() !== cleanCode);
					return {
						...prev,
						currency: remaining[0]?.code || "SDG"
					};
				}
				return prev;
			});
		}, [
			currencies,
			workspaceMode,
			currentCompany.id,
			currentUser.id,
			setCurrencies,
			setExchangeRateItems,
			setSettings
		]),
		clearAllCurrencies: (0, import_react.useCallback)(() => {
			setCurrencies([]);
			setExchangeRateItems([]);
			setExchangeRates({ SDG: 1 });
			setExchangeRateHistory([]);
			savePersistedCurrencies([]);
			savePersistedExchangeRateItems([]);
			try {
				localStorage.removeItem(STORAGE_KEYS.CURRENCIES);
				localStorage.removeItem(STORAGE_KEYS.EXCHANGE_RATES);
				localStorage.removeItem(STORAGE_KEYS.EXCHANGE_RATE_ITEMS);
				localStorage.removeItem(STORAGE_KEYS.RATE_HISTORY);
				localStorage.removeItem(getCompanyStorageKey(STORAGE_KEYS.CURRENCIES, currentCompanyId));
				localStorage.removeItem(getCompanyStorageKey(STORAGE_KEYS.EXCHANGE_RATES, currentCompanyId));
				localStorage.removeItem(getCompanyStorageKey(STORAGE_KEYS.EXCHANGE_RATE_ITEMS, currentCompanyId));
				localStorage.removeItem(getCompanyStorageKey(STORAGE_KEYS.RATE_HISTORY, currentCompanyId));
			} catch {}
			playSuccessChime(settings.soundEnabled);
			triggerHaptic("heavy", settings.hapticsEnabled);
		}, [
			currentCompanyId,
			settings.soundEnabled,
			settings.hapticsEnabled,
			setCurrencies,
			setExchangeRateItems,
			setExchangeRates,
			setExchangeRateHistory
		]),
		setBaseCurrencyCode: (0, import_react.useCallback)((code) => {
			const cleanCode = code.toUpperCase().trim();
			if (!cleanCode) return;
			setCurrencies((prev) => {
				const nextList = prev.map((c) => ({
					...c,
					isBase: c.code.toUpperCase() === cleanCode
				}));
				savePersistedCurrencies(nextList);
				return nextList;
			});
			setSettings((prev) => ({
				...prev,
				currency: cleanCode
			}));
			triggerHaptic("light", settings.hapticsEnabled);
		}, [
			setCurrencies,
			setSettings,
			settings.hapticsEnabled
		]),
		syncExchangeRatesState: (0, import_react.useCallback)((items) => {
			setExchangeRateItems(items);
			savePersistedExchangeRateItems(items);
			const ratesPatch = { SDG: 1 };
			for (const r of items) if (r.targetCurrency === "SDG" && r.rate > 0) ratesPatch[r.sourceCurrency.toUpperCase()] = r.rate;
			setExchangeRates((prevMap) => {
				const nextMap = {
					...prevMap,
					...ratesPatch,
					SDG: 1
				};
				savePersistedExchangeRates(nextMap);
				return nextMap;
			});
			setSettings((prevSettings) => ({
				...prevSettings,
				exchangeRates: {
					...prevSettings.exchangeRates || {},
					...ratesPatch,
					SDG: 1
				}
			}));
		}, [
			setExchangeRateItems,
			setExchangeRates,
			setSettings
		]),
		updateExchangeRate: (0, import_react.useCallback)(async (data) => {
			const source = data.sourceCurrency.toUpperCase().trim();
			const target = data.targetCurrency.toUpperCase().trim();
			const rateNum = Number(data.rate);
			const effectiveIso = data.effectiveFrom || (/* @__PURE__ */ new Date()).toISOString();
			let savedRecord;
			try {
				savedRecord = await api.saveExchangeRate({
					sourceCurrency: source,
					targetCurrency: target,
					rate: rateNum,
					effectiveFrom: effectiveIso,
					expiryDate: data.expiryDate ?? null
				});
			} catch {
				savedRecord = {
					id: `rate-${source.toLowerCase()}-${target.toLowerCase()}-${Date.now()}`,
					sourceCurrency: source,
					targetCurrency: target,
					rate: rateNum,
					inverseRate: rateNum > 0 ? Math.round(1 / rateNum * 1e6) / 1e6 : 0,
					effectiveFrom: effectiveIso,
					expiryDate: data.expiryDate ?? null,
					isActive: true
				};
			}
			const computedRateToSdg = target === "SDG" ? savedRecord.rate : source === "SDG" && savedRecord.rate > 0 ? 1 / savedRecord.rate : null;
			if (computedRateToSdg && computedRateToSdg > 0) {
				const foreignCode = target === "SDG" ? source : target;
				setExchangeRates((prev) => {
					const prevRate = Number(prev[foreignCode] || computedRateToSdg);
					if (Math.abs(computedRateToSdg - prevRate) > 1e-4) {
						const pct = prevRate > 0 ? Math.round((computedRateToSdg - prevRate) / prevRate * 1e3) / 10 : 0;
						setExchangeRateHistory((prevHist) => [...prevHist, {
							id: `hist-${foreignCode.toLowerCase()}-${Date.now()}`,
							currency: foreignCode,
							previousRate: prevRate,
							newRate: computedRateToSdg,
							changePercent: pct,
							timestamp: effectiveIso
						}]);
					}
					const nextMap = {
						...prev,
						[foreignCode]: computedRateToSdg,
						SDG: 1
					};
					savePersistedExchangeRates(nextMap);
					return nextMap;
				});
				setSettings((prevSettings) => ({
					...prevSettings,
					exchangeRates: {
						...prevSettings.exchangeRates || {},
						[foreignCode]: computedRateToSdg,
						SDG: 1
					}
				}));
			}
			setExchangeRateItems((prevItems) => {
				const nextItems = prevItems.some((i) => i.sourceCurrency === savedRecord.sourceCurrency && i.targetCurrency === savedRecord.targetCurrency) ? prevItems.map((i) => i.sourceCurrency === savedRecord.sourceCurrency && i.targetCurrency === savedRecord.targetCurrency ? {
					...i,
					...savedRecord
				} : i) : [...prevItems, savedRecord];
				savePersistedExchangeRateItems(nextItems);
				return nextItems;
			});
			return savedRecord;
		}, [
			setExchangeRates,
			setExchangeRateHistory,
			setSettings,
			setExchangeRateItems
		])
	};
}
// src/context/domains/useUserAccountsDomain.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
function useUserAccountsDomain({ users, setUsers, setActiveSessions, currentUserId, setCurrentUserId, currentUser, currentCompany, currentCompanyId, activeBranchId, workspaceMode, settings }) {
	const switchCurrentUser = (0, import_react.useCallback)((userId) => {
		const targetUser = users.find((u) => u.id === userId);
		if (!targetUser || targetUser.isActive === false) return;
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		setCurrentUserId(userId);
		setUsers((prev) => prev.map((u) => u.id === userId ? {
			...u,
			lastActiveAt: nowIso,
			isActive: true
		} : u));
		setActiveSessions((prev) => {
			if (prev.some((s) => s.userId === userId)) return prev.map((s) => s.userId === userId ? {
				...s,
				lastPingAt: nowIso,
				status: "online"
			} : s);
			return [...prev, {
				sessionId: `sess-${userId}-${Date.now()}`,
				userId: targetUser.id,
				userName: targetUser.name,
				userNameAr: targetUser.nameAr,
				role: targetUser.role,
				terminalName: targetUser.terminalName,
				terminalNameAr: targetUser.terminalNameAr,
				startedAt: nowIso,
				lastPingAt: nowIso,
				status: "online"
			}];
		});
		triggerHaptic("light", settings.hapticsEnabled);
	}, [
		users,
		settings.hapticsEnabled,
		setCurrentUserId,
		setUsers,
		setActiveSessions
	]);
	const saveUser = (0, import_react.useCallback)((userData) => {
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		const existing = userData.id ? users.find((u) => u.id === userData.id) : void 0;
		const resolvedLegacyRole = userData.systemRole ? mapSystemRoleToLegacyRole(userData.systemRole) : userData.role;
		const fallbackPerms = { ...DEFAULT_ROLE_PERMISSIONS[resolvedLegacyRole] };
		const resolvedCapabilities = Array.isArray(userData.capabilities) && userData.capabilities.length > 0 ? userData.capabilities : deriveCapabilitiesFromUser({
			role: resolvedLegacyRole,
			systemRole: userData.systemRole,
			permissions: userData.permissions || fallbackPerms
		});
		const rolePerms = userData.permissions || deriveLegacyPermissionsFromCapabilities(resolvedCapabilities) || fallbackPerms;
		const saved = existing ? {
			...existing,
			...userData,
			role: resolvedLegacyRole,
			capabilities: resolvedCapabilities,
			permissions: rolePerms,
			lastActiveAt: nowIso
		} : {
			id: `user-${Date.now()}`,
			companyId: currentCompany.id,
			branchId: userData.branchId || activeBranchId || "branch-main",
			assignedBranchIds: userData.assignedBranchIds || [userData.branchId || activeBranchId || "branch-main"],
			name: userData.name.trim(),
			nameAr: userData.nameAr?.trim() || userData.name.trim(),
			username: userData.username?.trim() || userData.name.trim().toLowerCase().replace(/[^a-z0-9]/g, "."),
			email: userData.email?.trim() || void 0,
			phone: userData.phone?.trim() || void 0,
			role: resolvedLegacyRole,
			systemRole: userData.systemRole,
			capabilities: resolvedCapabilities,
			pin: userData.pin || "0000",
			terminalName: userData.terminalName || `POS Terminal 0${users.length + 1}`,
			terminalNameAr: userData.terminalNameAr || `نقطة بيع ${users.length + 1}`,
			avatarColor: userData.avatarColor || "#f59e0b",
			isActive: userData.isActive ?? true,
			permissions: rolePerms,
			lastActiveAt: nowIso
		};
		setUsers((prev) => {
			return prev.some((u) => u.id === saved.id) ? prev.map((u) => u.id === saved.id ? saved : u) : [...prev, saved];
		});
		if (workspaceMode === "PRODUCTION" && currentUser.id !== "unassigned-operator" && currentCompany.id !== "comp-clean-store") {
			const endpoint = existing ? `/api/users/${saved.id}` : "/api/users";
			fetch(endpoint, {
				method: existing ? "PUT" : "POST",
				headers: {
					"Content-Type": "application/json",
					"x-user-id": currentUser.id,
					"x-company-id": currentCompany.id
				},
				body: JSON.stringify({
					...saved,
					password: userData.password
				})
			}).catch(() => {});
		}
		if (saved.isActive) setActiveSessions((prev) => {
			if (prev.some((s) => s.userId === saved.id)) return prev.map((s) => s.userId === saved.id ? {
				...s,
				userName: saved.name,
				userNameAr: saved.nameAr,
				role: saved.role,
				terminalName: saved.terminalName,
				terminalNameAr: saved.terminalNameAr,
				lastPingAt: nowIso
			} : s);
			return [...prev, {
				sessionId: `sess-${saved.id}-${Date.now()}`,
				userId: saved.id,
				userName: saved.name,
				userNameAr: saved.nameAr,
				role: saved.role,
				terminalName: saved.terminalName,
				terminalNameAr: saved.terminalNameAr,
				startedAt: nowIso,
				lastPingAt: nowIso,
				status: "online"
			}];
		});
		else setActiveSessions((prev) => prev.filter((s) => s.userId !== saved.id));
		triggerHaptic("success", settings.hapticsEnabled);
		return saved;
	}, [
		users,
		currentCompany.id,
		activeBranchId,
		workspaceMode,
		currentUser.id,
		settings.hapticsEnabled,
		setUsers,
		setActiveSessions
	]);
	const deactivateUserAccount = (0, import_react.useCallback)(async (userId, reason) => {
		if (!users.find((u) => u.id === userId)) return {
			ok: false,
			error: "User not found."
		};
		if (workspaceMode === "PRODUCTION" && currentUser.id !== "unassigned-operator" && currentCompany.id !== "comp-clean-store") try {
			await fetch(`/api/users/${userId}/deactivate`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-user-id": currentUser.id,
					"x-company-id": currentCompany.id
				},
				body: JSON.stringify({ reason })
			});
		} catch {}
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		setUsers((prev) => prev.map((u) => u.id === userId ? {
			...u,
			isActive: false,
			deactivatedAt: nowIso,
			deactivatedBy: currentUser.id,
			deactivationReason: reason || "Deactivated by administrator"
		} : u));
		setActiveSessions((prev) => prev.filter((s) => s.userId !== userId));
		if (currentUserId === userId) setCurrentUserId(users.find((u) => u.id !== userId && u.isActive !== false)?.id || "unassigned-operator");
		triggerHaptic("medium", settings.hapticsEnabled);
		return { ok: true };
	}, [
		users,
		workspaceMode,
		currentUser.id,
		currentCompany.id,
		currentUserId,
		settings.hapticsEnabled,
		setUsers,
		setActiveSessions,
		setCurrentUserId
	]);
	const reactivateUserAccount = (0, import_react.useCallback)(async (userId) => {
		if (workspaceMode === "PRODUCTION" && currentUser.id !== "unassigned-operator" && currentCompany.id !== "comp-clean-store") try {
			await fetch(`/api/users/${userId}/activate`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-user-id": currentUser.id,
					"x-company-id": currentCompany.id
				}
			});
		} catch {}
		setUsers((prev) => prev.map((u) => u.id === userId ? {
			...u,
			isActive: true,
			deactivatedAt: void 0,
			deactivatedBy: void 0
		} : u));
		triggerHaptic("success", settings.hapticsEnabled);
		return { ok: true };
	}, [
		workspaceMode,
		currentUser.id,
		currentCompany.id,
		settings.hapticsEnabled,
		setUsers
	]);
	const resetUserPasswordOrPin = (0, import_react.useCallback)(async (userId, newPassword, newPin) => {
		if (workspaceMode === "PRODUCTION" && currentUser.id !== "unassigned-operator" && currentCompany.id !== "comp-clean-store") try {
			await fetch(`/api/users/${userId}/reset-password`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-user-id": currentUser.id,
					"x-company-id": currentCompany.id
				},
				body: JSON.stringify({
					newPassword,
					newPin
				})
			});
		} catch {}
		if (newPin && newPin.trim().length > 0) setUsers((prev) => prev.map((u) => u.id === userId ? {
			...u,
			pin: newPin.trim()
		} : u));
		playSuccessChime(settings.soundEnabled);
		triggerHaptic("success", settings.hapticsEnabled);
		return { ok: true };
	}, [
		workspaceMode,
		currentUser.id,
		currentCompany.id,
		settings.soundEnabled,
		settings.hapticsEnabled,
		setUsers
	]);
	const deleteUserAccount = (0, import_react.useCallback)((userId) => {
		setUsers((prev) => {
			const next = prev.filter((u) => u.id !== userId);
			if (currentUserId === userId) setCurrentUserId(next[0]?.id || "unassigned-operator");
			return next;
		});
		setActiveSessions((prev) => prev.filter((s) => s.userId !== userId));
		triggerHaptic("medium", settings.hapticsEnabled);
	}, [
		currentUserId,
		settings.hapticsEnabled,
		setUsers,
		setCurrentUserId,
		setActiveSessions
	]);
	return {
		switchCurrentUser,
		saveUser,
		deactivateUserAccount,
		reactivateUserAccount,
		resetUserPasswordOrPin,
		deleteUserAccount,
		clearAllUserAccounts: (0, import_react.useCallback)(() => {
			setUsers([]);
			setActiveSessions([]);
			setCurrentUserId("unassigned-operator");
			try {
				localStorage.removeItem(STORAGE_KEYS.USERS);
				localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSIONS);
				localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
				localStorage.removeItem(getCompanyStorageKey(STORAGE_KEYS.USERS, currentCompanyId));
				localStorage.removeItem(getCompanyStorageKey(STORAGE_KEYS.ACTIVE_SESSIONS, currentCompanyId));
			} catch {}
			playSuccessChime(settings.soundEnabled);
			triggerHaptic("heavy", settings.hapticsEnabled);
		}, [
			currentCompanyId,
			settings.soundEnabled,
			settings.hapticsEnabled,
			setUsers,
			setActiveSessions,
			setCurrentUserId
		]),
		removeUser: (0, import_react.useCallback)((userId) => {
			deleteUserAccount(userId);
		}, [deleteUserAccount]),
		toggleUserActiveSession: (0, import_react.useCallback)((userId, terminalName) => {
			const targetUser = users.find((u) => u.id === userId);
			if (!targetUser || targetUser.isActive === false) return;
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			setActiveSessions((prev) => {
				if (prev.some((s) => s.userId === userId)) {
					if (prev.length <= 1) return prev;
					return prev.filter((s) => s.userId !== userId);
				}
				return [...prev, {
					sessionId: `sess-${userId}-${Date.now()}`,
					userId: targetUser.id,
					userName: targetUser.name,
					userNameAr: targetUser.nameAr,
					role: targetUser.role,
					terminalName: terminalName || targetUser.terminalName,
					terminalNameAr: targetUser.terminalNameAr,
					startedAt: nowIso,
					lastPingAt: nowIso,
					status: "online"
				}];
			});
			triggerHaptic("light", settings.hapticsEnabled);
		}, [
			users,
			settings.hapticsEnabled,
			setActiveSessions
		]),
		hasPermission: (0, import_react.useCallback)((permission) => {
			if (!currentUser || !currentUser.permissions) return true;
			return Boolean(currentUser.permissions[permission]);
		}, [currentUser]),
		hasCapability: (0, import_react.useCallback)((capability) => {
			return userHasCapability(currentUser, capability);
		}, [currentUser])
	};
}
// src/lib/training-tour.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var TRAINING_TOUR_STORAGE_KEY = "dqnamo_pos_training_tour_v1";
function getUserTourStorageKey(userId, companyId) {
	return `${TRAINING_TOUR_STORAGE_KEY}_${companyId ? `${companyId}_` : ""}${userId || "default"}`;
}
var TRAINING_TOUR_STEPS = [
	{
		id: "step-dashboard-overview",
		stepNumber: 1,
		categoryKey: "dashboard_overview",
		tab: "dashboard",
		targetSelector: "[data-testid=\"daily-revenue-d3-chart-card\"]",
		requiredCapability: "dashboard.view",
		titleEn: "1. Dashboard & Business Overview",
		titleAr: "1. لوحة التحكم والنظرة العامة للأعمال",
		subtitleEn: "Live Store KPIs, Revenue Trends & Peak Day Detection",
		subtitleAr: "مؤشرات الأداء اللحظية ومنحنى الإيرادات وتحديد ذروة المبيعات",
		descriptionEn: "Monitor daily sales, total invoices, average basket value, low-stock alerts, and interactive D3.js revenue trend curves in real time.",
		descriptionAr: "تابع مبيعات اليوم، إجمالي الفواتير، متوسط السلة، تنبيهات المخزون، ومنحنى الإيرادات اليومية التفاعلي (D3.js) لحظة بلحظة.",
		keyPointsEn: [
			"Interactive D3.js Revenue Chart: Filter by 7, 14, or 30 days and inspect daily peaks.",
			"Instant Currency Switching: Convert all KPIs between SDG, USD, SAR, AED, EUR, and GBP.",
			"Quick Action Shortcuts: Jump directly to low-stock items or recent invoices."
		],
		keyPointsAr: [
			"مخطط D3.js تفاعلي للإيرادات: استعرض آخر 7 أو 14 أو 30 يوماً وتعرف على أعلى يوم مبيعات.",
			"تبديل فوري للعملة: حوّل جميع مؤشرات لوحة التحكم فوراً بين الجنيه السوداني والدولار والريال.",
			"اختصارات تشغيلية سريعة: انتقل مباشرة للأصناف المنخفضة أو أحدث الفواتير."
		],
		practicalTipEn: "Tip: Switching the active currency in the top header converts all Dashboard KPIs immediately without altering historical invoices.",
		practicalTipAr: "نصيحة عملية: تغيير العملة من الشريط العلوي يحوّل مؤشرات لوحة التحكم فوراً دون المساس بقيم الفواتير التاريخية.",
		roleRelevance: [
			"admin",
			"manager",
			"cashier",
			"inventory_clerk"
		]
	},
	{
		id: "step-products-catalog",
		stepNumber: 2,
		categoryKey: "products_barcodes",
		tab: "products",
		targetSelector: "[data-testid=\"open-create-product-modal-btn\"]",
		requiredCapability: "products.view",
		restrictedExplanationEn: "Creating or editing products requires \"products.create\" / \"products.edit\" permissions.",
		restrictedExplanationAr: "إضافة أو تعديل المنتجات تتطلب صلاحية إدارة المنتجات (products.create / products.edit).",
		titleEn: "2. Products & Barcode Management",
		titleAr: "2. إدارة المنتجات والباركود والعبوات",
		subtitleEn: "Explicit Barcode Rules, Multi-Unit Packaging & Price History",
		subtitleAr: "تحكم كامل بالباركود والبيع بالقطعة/الباكو وسجل الأسعار",
		descriptionEn: "Manage your product catalog with sequential serial numbers (#0001), camera barcode scanning, multi-unit packaging (Strip/Pack), and full price modification audit trails.",
		descriptionAr: "أدر دليل المنتجات مع الترقيم التسلسلي (#0001)، مسح الباركود بالكاميرا، البيع بالقطعة أو الباكو، وسجل تدقيق كامل لتاريخ تعديل الأسعار.",
		keyPointsEn: [
			"Explicit Barcode Control: Scan real barcodes or click \"Generate Barcode\" when needed.",
			"Multi-Unit Packaging: Sell individual units/strips or full boxes/packs from a unified stock pool.",
			"Historical Price Audit: Every cost and selling price update is logged with timestamps."
		],
		keyPointsAr: [
			"تحكم صريح بالباركود: امسح الباركود بالكاميرا أو اضغط \"توليد باركود\" عند الحاجة فقط.",
			"نظام العبوات المتعددة: بيع بالقطعة/الشريط أو الباكو/الكرتون من نفس الرصيد المخزني.",
			"سجل تدقيق الأسعار: حفظ السعر القديم وتاريخ كل تعديل لأغراض حساب تكلفة البضاعة المباعة."
		],
		practicalTipEn: "Tip: Enable \"Multi-Unit Packaging\" (e.g., 1 Pack = 8 Strips) so cashiers can switch between unit and pack in one tap.",
		practicalTipAr: "نصيحة عملية: فعّل \"البيع بالقطعة أو الباكو\" ليتمكن الكاشير من التبديل بينهما بضغطة واحدة داخل السلة.",
		roleRelevance: [
			"admin",
			"manager",
			"inventory_clerk",
			"cashier"
		]
	},
	{
		id: "step-checkout-pos",
		stepNumber: 3,
		categoryKey: "sales_cashier",
		tab: "checkout",
		targetSelector: "[data-testid=\"open-barcode-scanner-btn\"]",
		requiredCapability: "sales.create",
		restrictedExplanationEn: "Completing sales requires the \"sales.create\" cashier permission.",
		restrictedExplanationAr: "إصدار الفواتير يتطلب صلاحية البيع (sales.create).",
		titleEn: "3. Sales & Cashier Checkout Workflow",
		titleAr: "3. سير عمل المبيعات وشاشة الكاشير السريعة",
		subtitleEn: "Barcode Scanning, Flexible Discounts & Split/Credit Payments",
		subtitleAr: "مسح الباركود، الخصومات المرنة، والدفع النقدي أو الآجل",
		descriptionEn: "Ring up sales rapidly by tapping products, searching by serial/SKU/name, or scanning barcodes. Supports cash, Bankak transfer with receipt photos, and partial credit sales.",
		descriptionAr: "أنجز عمليات البيع بسرعة بالضغط على المنتج أو البحث بالاسم/الرقم التسلسلي أو مسح الباركود، مع دعم الدفع النقدي والتحويل البنكي (بنكك) والبيع الآجل.",
		keyPointsEn: [
			"Dual Barcode Scanner: Works on web cameras and Android ML Kit hardware scanners.",
			"Sale-Time Exchange Rate Lock: Locks the exact currency rate on every completed invoice.",
			"Unmet Demand Logging: Log unavailable customer requests directly from the checkout bar."
		],
		keyPointsAr: [
			"ماسح باركود مزدوج: يعمل بكاميرا المتصفح وتطبيق الأندرويد (Google ML Kit).",
			"تثبيت سعر صرف البيع: يحفظ سعر الصرف الفعلي لحظة إصدار الفاتورة لحمايتها من التقلبات.",
			"تسجيل الطلبات غير المتوفرة: سجّل أي منتج يطلبه العميل وغير متوفر بضغطة زر من شاشة الكاشير."
		],
		practicalTipEn: "Tip: Use the \"+ Unmet Demand\" button whenever a customer asks for an out-of-stock or unstocked item to feed the predictive demand engine.",
		practicalTipAr: "نصيحة عملية: استخدم زر \"تسجيل طلب غير متوفر\" عندما يطلب العميل صنفاً نافداً ليقوم النظام بحساب الطلب الكامن وتوصيات الشراء.",
		roleRelevance: [
			"admin",
			"manager",
			"cashier"
		]
	},
	{
		id: "step-inventory-control",
		stepNumber: 4,
		categoryKey: "inventory_movements",
		tab: "inventory",
		targetSelector: "[data-testid=\"inventory-search-input\"]",
		requiredCapability: "inventory.view",
		titleEn: "4. Inventory & Stock Movements",
		titleAr: "4. إدارة المخزون والحركات المخزنية",
		subtitleEn: "Stock Adjustments, Damage/Shrinkage & Audit Ledger",
		subtitleAr: "تسويات الجرد، تسجيل التالف والفاقد، وسجل حركة الأصناف",
		descriptionEn: "Track real-time stock quantities by Pack and Unit, filter low-stock or out-of-stock SKUs, and record stock adjustments, damage, or audit counts.",
		descriptionAr: "راقب الكميات المتوفرة مفصلةً بالباكو والوحدة، وفلتر الأصناف المنخفضة أو النافدة، وسجّل تسويات الجرد أو التالف مع السبب والموظف المسؤول.",
		keyPointsEn: [
			"Pack & Unit Breakdown: View available stock in both full packs and loose units.",
			"Audited Stock Movements: Every restock, sale, return, and damage entry is permanently logged.",
			"Shrinkage Tracking: Recorded damage and loss automatically feed the Financial P&L reconciliation."
		],
		keyPointsAr: [
			"تفصيل الرصيد بالباكو والوحدة: عرض دقيق للعبوات الكاملة والوحدات المفردة.",
			"سجل حركات مخزنية موثق: توثيق كامل لكل حركة بيع أو توريد أو تالف مع التاريخ والمستخدم.",
			"ربط التالف بالتقارير المالية: ينعكس التالف المسجل تلقائياً في صافي الربح بعد الفاقد."
		],
		practicalTipEn: "Tip: Recording damaged stock with the \"damage\" movement type ensures accurate shrinkage reconciliation in Financial Analytics.",
		practicalTipAr: "نصيحة عملية: تسجيل البضاعة التالفة بنوع حركة \"تالف\" يضمن دقة حساب صافي الربح بعد الفاقد في التقارير المالية.",
		roleRelevance: [
			"admin",
			"manager",
			"inventory_clerk"
		]
	},
	{
		id: "step-purchasing-suppliers",
		stepNumber: 5,
		categoryKey: "purchasing_suppliers",
		tab: "inventory",
		targetSelector: "[data-testid=\"inventory-search-input\"]",
		requiredCapability: "purchases.view",
		titleEn: "5. Purchasing, Goods Receipt & Suppliers",
		titleAr: "5. المشتريات واستلام البضائع والموردون",
		subtitleEn: "Inbound Shipments, Supplier Invoices & Cost Price Updates",
		subtitleAr: "استلام الشحنات الواردة، فواتير الموردين، وتحديث سعر التكلفة",
		descriptionEn: "Record inbound supplier shipments (Goods & Invoice, Goods Only, or Invoice Only), attach supplier invoice numbers, and optionally update product unit cost.",
		descriptionAr: "سجّل استلام بضائع الموردين (بضاعة وفاتورة، بضاعة فقط، أو فاتورة فقط) مع رقم فاتورة المورد وتحديث تكلفة الوحدة تلقائياً.",
		keyPointsEn: [
			"Three Receipt Modes: Handle immediate deliveries, goods pending invoice, or advance invoices.",
			"Supplier Cost Tracking: Automatically records historical cost changes for accurate COGS.",
			"Smart Replenishment Integration: Convert replenishment recommendations into supplier orders."
		],
		keyPointsAr: [
			"ثلاثة أنماط للاستلام: استلام بضاعة مع فاتورة، أو بضاعة لحين وصول الفاتورة، أو فاتورة مقدمة.",
			"تتبع تكلفة المورد: يحفظ تغير سعر التكلفة تلقائياً لضمان دقة حساب تكلفة المبيعات (COGS).",
			"تكامل مع توصيات التزويد: اعتمد توصيات الشراء الذكية لتوليد أوامر التوريد."
		],
		practicalTipEn: "Tip: Check \"Update Product Cost\" when receiving a shipment at a new supplier price so your profit margins stay accurate.",
		practicalTipAr: "نصيحة عملية: فعّل خيار \"تحديث سعر التكلفة\" عند استلام شحنة بسعر جديد ليحافظ النظام على دقة هوامش الربح.",
		roleRelevance: [
			"admin",
			"manager",
			"inventory_clerk"
		]
	},
	{
		id: "step-customers-debts",
		stepNumber: 6,
		categoryKey: "customers_receivables",
		tab: "customers",
		targetSelector: "[data-testid=\"customers-search-input\"]",
		requiredCapability: "customers.view",
		titleEn: "6. Customers & Accounts Receivable (Debts)",
		titleAr: "6. العملاء والذمم المدينة وتسديد الديون",
		subtitleEn: "Customer Profiles, Multi-Installment Debt Collection & Receipts",
		subtitleAr: "ملفات العملاء، تحصيل الديون على دفعات، وإرفاق الإشعارات البنكية",
		descriptionEn: "Track customer purchase history, loyalty points, and outstanding credit balances. Collect partial or full debt payments with multi-currency indexing and receipt image attachments.",
		descriptionAr: "تابع سجل مشتريات العملاء ونقاط الولاء والديون المستحقة، وسدّد الديون جزئياً أو كلياً مع دعم التسعير بسعر الصرف المحدث وإرفاق صور إشعارات الدفع.",
		keyPointsEn: [
			"Installment Ledger: View every historical debt payment with remaining balance after each installment.",
			"Exchange-Rate Indexed Settlement: Settle old debts using either the original sale rate or today’s rate.",
			"Receipt Photo Proof: Attach multiple Bankak/transfer screenshots per installment."
		],
		keyPointsAr: [
			"دفتر أقساط مفصل: استعرض كل دفعة مسددة والرصيد المتبقي بعدها بدقة.",
			"معالجة تغير سعر الصرف عند السداد: إمكانية السداد بسعر يوم البيع أو بسعر الصرف المحدث.",
			"توثيق صور الإشعارات: إرفاق صور إشعارات التحويل البنكي لكل دفعة."
		],
		practicalTipEn: "Tip: Filter the Customer Directory by \"Has Debt\" to prioritize accounts receivable collections.",
		practicalTipAr: "نصيحة عملية: فلتر قائمة العملاء حسب \"عليه دين\" لمتابعة تحصيل الذمم المدينة بسرعة.",
		roleRelevance: [
			"admin",
			"manager",
			"cashier"
		]
	},
	{
		id: "step-expenses-accounting",
		stepNumber: 7,
		categoryKey: "expenses_accounting",
		tab: "sales",
		targetSelector: "[data-testid=\"sales-history-view\"]",
		requiredCapability: "sales.view",
		restrictedExplanationEn: "Full P&L and cost accounting require \"accounting.view_financial_reports\" permission.",
		restrictedExplanationAr: "عرض التقارير المالية التفصيلية وتكلفة البضاعة يتطلب صلاحية المحاسبة والتقارير المالية.",
		titleEn: "7. Invoices, Refunds & Financial Accounting Reconciliation",
		titleAr: "7. الفواتير والمرتجعات والمطابقة المحاسبية",
		subtitleEn: "Gross-to-Net Sales Bridge, Historical COGS & Cash Collections",
		subtitleAr: "مطابقة إجمالي وصافي المبيعات، تكلفة البضاعة، والتحصيل النقدي",
		descriptionEn: "Audit completed and voided invoices, process full or partial merchandise returns, and reconcile checkout cash collections, subsequent debt collections, and net profit.",
		descriptionAr: "راجع الفواتير المكتملة والملغاة، ونفّذ المرتجعات الكلية أو الجزئية، وطابق التحصيل النقدي عند البيع وتحصيل الديون اللاحق وصافي الأرباح.",
		keyPointsEn: [
			"Sale-Time Rate Preservation: Historical invoices never silently rewrite their sale-time totals.",
			"4-Tier Historical COGS: Resolves exact cost at sale time without fabricating fallback percentages.",
			"Cash vs. Accrual Separation: Distinguishes invoice revenue from actual cash collected."
		],
		keyPointsAr: [
			"حماية الفواتير التاريخية: لا يتم تغيير قيم الفواتير السابقة تلقائياً عند تغير سعر الصرف.",
			"حساب دقيق لتكلفة البضاعة (COGS): يعتمد على التكلفة الفعلية وقت البيع وسجل أسعار الشراء.",
			"فصل المبيعات عن التدفق النقدي: يميز بدقة بين قيمة الفواتير والنقد المحصل فعلياً."
		],
		practicalTipEn: "Tip: Open any invoice card in the Sales tab to inspect its locked exchange-rate snapshot and installment history.",
		practicalTipAr: "نصيحة عملية: افتح أي فاتورة في سجل المبيعات لمعاينة سعر الصرف المحفوظ وقت البيع وسجل الدفعات.",
		roleRelevance: [
			"admin",
			"manager",
			"cashier"
		]
	},
	{
		id: "step-branch-management",
		stepNumber: 8,
		categoryKey: "branch_management",
		tab: "reports",
		targetSelector: "[data-testid=\"bi-primary-section-branches\"]",
		requiredCapability: "analytics.view",
		titleEn: "8. Multi-Branch Performance & Stock Transfers",
		titleAr: "8. إدارة الفروع ومقارنة الأداء والتحويلات المخزنية",
		subtitleEn: "Branch Health Scores, Surplus/Shortage Detection & Scoping",
		subtitleAr: "مؤشر صحة الفروع، رصد الفائض والعجز، وصلاحيات الفروع",
		descriptionEn: "Compare revenue, stock coverage, and unmet customer demand across branches, and identify inter-branch stock transfer opportunities before ordering from external suppliers.",
		descriptionAr: "قارن الإيرادات وتغطية المخزون والطلبات غير المتوفرة بين الفروع، واكتشف فرص تحويل الفائض المخزني من فرع لآخر قبل الشراء من المورد.",
		keyPointsEn: [
			"Branch Health Scorecard: Evaluates sales velocity, stockout risk, and margin per branch.",
			"Smart Transfer Recommendations: Matches surplus stock in Branch A with shortages in Branch B.",
			"Server-Side Branch Isolation: Restricts branch staff to their assigned branch data."
		],
		keyPointsAr: [
			"بطاقة صحة الفرع: تقييم شامل لسرعة المبيعات ومخاطر النفاد لكل فرع.",
			"توصيات التحويل الذكي: ربط الفائض المخزني في فرع بالعجز والطلب الكامن في فرع آخر.",
			"عزل بيانات الفروع أمنياً: يقتصر وصول موظف الفرع على بيانات الفروع المصرح له بها فقط."
		],
		practicalTipEn: "Tip: You can create additional company branches and assign employees to specific branches in Settings → Company & Branches.",
		practicalTipAr: "نصيحة عملية: يمكنك إنشاء فروع جديدة وتعيين الموظفين لكل فرع من صفحة الإعدادات ← الفروع.",
		roleRelevance: ["admin", "manager"]
	},
	{
		id: "step-reports-analytics",
		stepNumber: 9,
		categoryKey: "reports_analytics",
		tab: "reports",
		targetSelector: "[data-testid=\"bi-primary-sections-nav\"]",
		requiredCapability: "analytics.view",
		titleEn: "9. Business Intelligence & Predictive Demand Forecasting",
		titleAr: "9. ذكاء الأعمال والتوقعات الإحصائية للطلب (7/30/90 يوم)",
		subtitleEn: "7-Section BI Navigation, Unmet Demand & Latent Forecasting",
		subtitleAr: "الأقسام السبعة للتحليلات، الطلب غير المتوفر، والتوقع الكامن",
		descriptionEn: "Navigate across the 7 primary BI sections: Business Overview, Sales, Inventory & Demand, Financial Overview, Branch Performance, Intelligence Center, and Reports & Signals.",
		descriptionAr: "تنقّل بسهولة بين الأقسام السبعة: نظرة عامة، المبيعات، المخزون والطلب، الملخص المالي، أداء الفروع، مركز الذكاء، والتقارير والإشارات.",
		keyPointsEn: [
			"Stockout-Censored Forecasting: Compares baseline sales forecasts against latent demand (including unmet inquiries).",
			"Conservative Lost Revenue Model: Discounts repeat 24h inquiries and weights confirmed purchase intent.",
			"Multi-Currency Valuation Modes: Analyze reports in Live, Indexed, or Historical Sale-Time rates."
		],
		keyPointsAr: [
			"توقعات تعالج فترات نفاد المخزون: مقارنة التوقع المبني على المبيعات فقط مقابل الطلب الحقيقي الكامن.",
			"تقدير متحفظ للمبيعات الضائعة: يستبعد التكرار خلال 24 ساعة ويزن نية الشراء المؤكدة.",
			"أوضاع تقييم متعددة للعملات: استعرض التقارير بالسعر اللحظي أو المؤشر أو التاريخي وقت البيع."
		],
		practicalTipEn: "Tip: On mobile and tablet screens, use the collapsible \"Filters\" button to keep charts and KPIs front and center.",
		practicalTipAr: "نصيحة عملية: في شاشات الجوال والتابلت، استخدم زر \"الفلاتر\" القابل للطي لإبقاء المخططات واضحة في أعلى الشاشة.",
		roleRelevance: ["admin", "manager"]
	},
	{
		id: "step-intelligence-center",
		stepNumber: 10,
		categoryKey: "intelligence_center",
		tab: "reports",
		targetSelector: "[data-testid=\"bi-primary-section-intelligence\"]",
		requiredCapability: "intelligence.view",
		titleEn: "10. Intelligence Center & Persistent Alert Lifecycle",
		titleAr: "10. مركز الذكاء التشغيلي وإدارة دورة حياة التوصيات",
		subtitleEn: "Active, Acknowledged, Resolved, Dismissed & Full Audit History",
		subtitleAr: "التنبيهات النشطة، قيد المتابعة، المحلولة، المستبعدة، والسجل الكامل",
		descriptionEn: "Manage every operational alert, replenishment recommendation, and branch transfer through a persistent database-backed workflow with full operator attribution and notes.",
		descriptionAr: "أدر جميع التنبيهات وتوصيات التزويد والتحويلات عبر دورة حياة محفوظة في قاعدة البيانات مع توثيق اسم الموظف والوقت والملاحظات.",
		keyPointsEn: [
			"5 Lifecycle Tabs: Switch between Active, Acknowledged, Resolved, Dismissed, and All History.",
			"Non-Reactivation Guarantee: Resolved or dismissed alerts stay closed across page reloads.",
			"Chronological Event Drawer: Inspect every status transition, note, and operator timestamp."
		],
		keyPointsAr: [
			"خمسة تبويبات لدورة الحياة: النشطة، قيد المتابعة، تم الحل، المستبعدة، والسجل الكامل.",
			"ضمان عدم إعادة التفعيل العشوائي: التنبيهات المحلولة أو المستبعدة تبقى مغلقة حتى بعد تحديث الصفحة.",
			"نافذة السجل الزمني: استعرض تاريخ كل إجراء وملاحظة واسم الموظف بالتفصيل."
		],
		practicalTipEn: "Tip: Click \"Resolve\" on an alert after ordering stock and record the Purchase Order number in the resolution note for future audits.",
		practicalTipAr: "نصيحة عملية: اضغط \"تم الحل\" بعد إصدار أمر الشراء واكتب رقم أمر الشراء في ملاحظة الحل للرجوع إليها لاحقاً.",
		roleRelevance: [
			"admin",
			"manager",
			"cashier",
			"inventory_clerk"
		]
	},
	{
		id: "step-notifications-recommendations",
		stepNumber: 11,
		categoryKey: "notifications_recommendations",
		tab: "reports",
		targetSelector: "[data-testid=\"bi-primary-section-signals\"]",
		requiredCapability: "intelligence.view",
		titleEn: "11. Smart Notifications & Replenishment Formulas",
		titleAr: "11. الإشعارات الذكية ومعادلات إعادة التزويد",
		subtitleEn: "Explainable Signals, Reorder Point (ROP) & Safety Stock",
		subtitleAr: "تنبيهات مفسّرة علمياً، نقطة إعادة الطلب (ROP)، ومخزون الأمان",
		descriptionEn: "Inspect the transparent mathematical formula behind every recommendation: Current Stock, Blended Daily Demand, Lead Time, Safety Stock, and Protected Revenue.",
		descriptionAr: "اطّلع على المعادلة الرياضية الشفافة خلف كل توصية: المخزون الحالي، الطلب اليومي المدمج، فترة التوريد، مخزون الأمان، والإيراد المحمي.",
		keyPointsEn: [
			"Header Bell Popover: Access top-priority alerts from anywhere in the POS.",
			"Zero Black-Box AI: Every insight cites exact observed metrics, time windows, and confidence scores.",
			"Human-in-the-Loop Safety: Recommendations never auto-mutate stock without operator action."
		],
		keyPointsAr: [
			"جرس الإشعارات العلوي: الوصول السريع لأهم التنبيهات من أي شاشة في النظام.",
			"شفافية كاملة دون تخمين: كل توصية تعرض الأرقام الفعلية وفترة الرصد ودرجة الثقة.",
			"قرار بشري آمن: لا يقوم النظام بتعديل المخزون تلقائياً دون اعتماد المسؤول."
		],
		practicalTipEn: "Tip: Use the top header bell icon to jump straight to critical stockout or margin alerts.",
		practicalTipAr: "نصيحة عملية: اضغط على أيقونة الجرس في أعلى الشاشة للانتقال المباشر للتنبيهات الحرجة.",
		roleRelevance: [
			"admin",
			"manager",
			"cashier",
			"inventory_clerk"
		]
	},
	{
		id: "step-users-permissions",
		stepNumber: 12,
		categoryKey: "users_permissions",
		tab: "settings",
		targetSelector: "[data-testid=\"open-add-user-btn\"]",
		requiredCapability: "users.view",
		restrictedExplanationEn: "Managing employee accounts and granular capabilities requires Owner/Admin permissions.",
		restrictedExplanationAr: "إدارة حسابات الموظفين والصلاحيات التفصيلية تتطلب صلاحية مالك الشركة أو مدير النظام.",
		titleEn: "12. Employee Management & Granular RBAC Permissions",
		titleAr: "12. إدارة الموظفين والأدوار والصلاحيات التفصيلية",
		subtitleEn: "9 Roles, 46 Capabilities, Branch Assignment & Safe Deactivation",
		subtitleAr: "9 أدوار وظيفية، 46 صلاحية دقيقة، تعيين الفروع، والإيقاف الآمن للحسابات",
		descriptionEn: "Create employee accounts, assign roles (Owner, Admin, Manager, Cashier, Inventory Manager, Accountant, Purchasing Manager, Report Viewer, Custom Role), assign branches, and customize capabilities.",
		descriptionAr: "أنشئ حسابات الموظفين، وعيّن الأدوار الوظيفية والفروع المسموحة، وخصّص الصلاحيات الدقيقة مع حماية المالك الأساسي وسجل التدقيق.",
		keyPointsEn: [
			"Safe Account Deactivation: Deactivate former employees without deleting historical sales or audit logs.",
			"Last-Owner Protection: Prevents accidentally deactivating or demoting the last active Company Owner.",
			"Multi-Branch Scoping: Assign employees to one specific branch or multiple branches."
		],
		keyPointsAr: [
			"إيقاف آمن دون حذف السجلات: إيقاف حساب الموظف مع الحفاظ الكامل على فواتيره وسجلاته السابقة.",
			"حماية مالك الشركة: يمنع النظام إيقاف أو خفض صلاحيات آخر مالك نشط للشركة.",
			"تخصيص الفروع للموظف: ربط الموظف بفرع محدد أو عدة فروع."
		],
		practicalTipEn: "Tip: Prefer deactivating an employee account over deletion so all historical invoices retain accurate cashier attribution.",
		practicalTipAr: "نصيحة عملية: استخدم إيقاف الحساب بدلاً من الحذف للحفاظ على دقة تقارير الكاشير التاريخية.",
		roleRelevance: ["admin", "manager"]
	},
	{
		id: "step-company-settings",
		stepNumber: 13,
		categoryKey: "company_settings",
		tab: "settings",
		targetSelector: "[data-testid=\"training-center-section\"]",
		requiredCapability: "company.view",
		titleEn: "13. Company Settings, Multi-Currency & Practice Mode",
		titleAr: "13. إعدادات الشركة والعملات ووضع التدريب التجريبي",
		subtitleEn: "Company Profile, SDG Base Currency, Exchange Rates & Practice Sandbox",
		subtitleAr: "ملف الشركة، العملة الأساسية (SDG)، أسعار الصرف، وبيئة التدريب المعزولة",
		descriptionEn: "Configure company legal identity, logo, tax policy, base currency (SDG), exchange rates, and switch safely into Practice Mode anytime to train new staff without touching production data.",
		descriptionAr: "اضبط الاسم القانوني للشركة والشعار والضرائب وأسعار الصرف، وانتقل بأمان إلى \"وضع التدريب التجريبي\" لتدريب الموظفين الجدد دون التأثير على بيانات الشركة الحقيقية.",
		keyPointsEn: [
			"Isolated Practice Mode: Train staff on realistic synthetic data with a safe one-click Demo Reset.",
			"Historical Rate Integrity: Updating exchange rates never rewrites past transactions.",
			"Onboarding Checklist: Track your company setup completion step by step."
		],
		keyPointsAr: [
			"وضع تدريب معزول تماماً: درّب الموظفين على بيانات افتراضية مع إمكانية إعادة ضبط بيانات التدريب بأمان.",
			"سلامة أسعار الصرف التاريخية: تحديث سعر الصرف يطبق على العمليات الجديدة دون تغيير الفواتير السابقة.",
			"قائمة التحقق التأسيسية: تابع اكتمال خطوات تهيئة الشركة خطوة بخطوة."
		],
		practicalTipEn: "Tip: You can relaunch the full guided tour or any of the 13 individual module tours anytime from the top header or Settings!",
		practicalTipAr: "نصيحة عملية: يمكنك إعادة تشغيل الجولة الشاملة أو اختيار أي قسم من الأقسام الـ 13 في أي وقت من الشريط العلوي أو الإعدادات!",
		roleRelevance: [
			"admin",
			"manager",
			"cashier",
			"inventory_clerk"
		]
	}
];
function createInitialTourProgress() {
	return {
		completed: false,
		isCompleted: false,
		lastStepIndex: 0,
		completedStepIds: [],
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function clampTourStepIndex(index, totalSteps = TRAINING_TOUR_STEPS.length) {
	if (totalSteps <= 0) return 0;
	if (!Number.isFinite(index)) return 0;
	return Math.max(0, Math.min(totalSteps - 1, Math.floor(index)));
}
function markTourStepVisited(state, stepIndex, steps = TRAINING_TOUR_STEPS) {
	const safeIndex = clampTourStepIndex(stepIndex, steps.length);
	const step = steps[safeIndex];
	if (!step) return state;
	const set = new Set(state.completedStepIds);
	set.add(step.id);
	return {
		...state,
		lastStepIndex: safeIndex,
		completedStepIds: Array.from(set),
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function markTourCompleted(state, steps = TRAINING_TOUR_STEPS) {
	const allIds = steps.map((s) => s.id);
	return {
		completed: true,
		isCompleted: true,
		lastStepIndex: Math.max(0, steps.length - 1),
		completedStepIds: Array.from(/* @__PURE__ */ new Set([...state.completedStepIds, ...allIds])),
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function calculateTourCompletionPercent(state, steps = TRAINING_TOUR_STEPS) {
	if (!steps.length) return 100;
	if (state.completed || state.isCompleted) return 100;
	const validIds = new Set(steps.map((s) => s.id));
	const completedCount = state.completedStepIds.filter((id) => validIds.has(id)).length;
	return Math.min(100, Math.round(completedCount / steps.length * 100));
}
function isTourStepAccessibleForUser(step, user) {
	if (!step?.requiredCapability) return true;
	if (!user) return true;
	return userHasCapability(user, step.requiredCapability);
}
/**
* Computes real, non-fabricated onboarding checklist completion status from actual workspace data.
*/
function computeOnboardingChecklistStatus(params) {
	const companyProfileCompleted = params.companyProfileConfigured !== void 0 ? Boolean(params.companyProfileConfigured) : Boolean(params.settings?.storeName && params.settings.storeName.trim().length >= 2 && (params.settings.phone?.trim() || params.settings.address?.trim()));
	const currencyConfigured = params.currenciesConfigured !== void 0 ? Boolean(params.currenciesConfigured) : Boolean(params.settings?.currency && (params.currencies?.length ?? 1) >= 1 && Object.keys(params.exchangeRates || {}).length >= 1);
	const branchesCreated = params.branchCreated !== void 0 ? Boolean(params.branchCreated) : (params.branches?.length ?? 0) >= 1 || Boolean(params.users?.some((u) => Boolean(u.terminalName)));
	const productsAdded = params.productsCount !== void 0 ? params.productsCount > 0 : (params.products?.length ?? 0) > 0;
	const employeesAdded = (params.employeesCount !== void 0 ? params.employeesCount : (params.users || []).filter((u) => u.isActive !== false).length) >= 1;
	const permissionsAssigned = params.salesCount !== void 0 ? params.salesCount > 0 : (params.users || []).some((u) => Array.isArray(u.capabilities) && u.capabilities.length > 0 || Boolean(u.permissions && Object.values(u.permissions).some(Boolean)));
	const openingInventoryConfigured = params.inventoryReviewed !== void 0 ? Boolean(params.inventoryReviewed) : Boolean((params.products || []).some((p) => Number(p.stock) > 0) || (params.stockMovements?.length ?? 0) > 0);
	const guidedTourCompleted = params.guidedTourCompleted !== void 0 ? Boolean(params.guidedTourCompleted) : Boolean(params.tourProgress?.completed || params.tourProgress?.isCompleted || (params.tourProgress?.completedStepIds?.length ?? 0) >= 5);
	const flags = [
		companyProfileCompleted,
		currencyConfigured,
		branchesCreated,
		productsAdded,
		employeesAdded,
		permissionsAssigned,
		openingInventoryConfigured,
		guidedTourCompleted
	];
	const completedCount = flags.filter(Boolean).length;
	const totalCount = flags.length;
	return {
		companyProfileCompleted,
		companyProfileConfigured: companyProfileCompleted,
		currencyConfigured,
		currenciesConfigured: currencyConfigured,
		branchesCreated,
		branchCreated: branchesCreated,
		productsAdded,
		firstProductsAdded: productsAdded,
		employeesAdded,
		firstEmployeeCreated: employeesAdded,
		permissionsAssigned,
		firstSaleCompleted: permissionsAssigned,
		openingInventoryConfigured,
		inventoryReviewed: openingInventoryConfigured,
		guidedTourCompleted,
		completedCount,
		totalCount,
		completionPercent: Math.round(completedCount / totalCount * 100)
	};
}
// src/analytics/analytics.permissions.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
/**
* Resolves the authenticated/active POS user context and verifies the user's role
* and assigned branch against the server-side user directory (`knownUsers`) to prevent
* header/query privilege spoofing.
*
* Security Rules (SEC-01 & SEC-02):
* - Never default to `'admin'` or `'usr-admin-1'`.
* - Never infer administrator or manager privileges from client headers or query parameters (`input.role`).
* - Missing `userId` or unknown `userId` (not found in `knownUsers`) receives `roleVerifiedFromServerStore = false`
*   and zero sensitive permissions (`canViewFinancials = false`, `canViewCostAndMargin = false`, etc.).
*/
function resolveAnalyticsUserContext(input, knownUsers) {
	const validRoles = [
		"admin",
		"manager",
		"cashier",
		"inventory_clerk"
	];
	const normalizedUserId = typeof input.userId === "string" ? input.userId.trim() : "";
	const matchedServerUser = Array.isArray(knownUsers) && knownUsers.length > 0 && normalizedUserId.length > 0 ? knownUsers.find((u) => u && u.id === normalizedUserId) : void 0;
	if (!matchedServerUser) return {
		userId: normalizedUserId || "unauthenticated",
		userName: "Unverified User",
		role: "cashier",
		assignedBranchId: "unverified-restricted-branch",
		assignedTerminalName: "unverified-restricted-terminal",
		canViewFinancials: false,
		canViewCostAndMargin: false,
		canViewAllBranches: false,
		canViewCustomerPII: false,
		canExportAnalytics: false,
		roleVerifiedFromServerStore: false,
		branchRestrictionEnforced: true
	};
	const role = validRoles.includes(matchedServerUser.role) ? matchedServerUser.role : "cashier";
	const explicitUserBranch = matchedServerUser.branchId;
	const inferredBranchFromTerminal = matchedServerUser.terminalName && (matchedServerUser.terminalName.includes("02") || matchedServerUser.terminalName.toLowerCase().includes("bahri")) ? "branch-bahri" : "branch-main";
	const assignedBranchId = explicitUserBranch || inferredBranchFromTerminal || void 0;
	const assignedTerminalName = matchedServerUser.terminalName || void 0;
	const userName = matchedServerUser.name || "POS User";
	const canViewFinancials = role === "admin" || role === "manager";
	const canViewCostAndMargin = role === "admin" || role === "manager" || role === "inventory_clerk";
	const canViewAllBranches = role === "admin" || role === "manager";
	const canViewCustomerPII = role === "admin" || role === "manager" || role === "cashier";
	const canExportAnalytics = role === "admin" || role === "manager";
	const branchRestrictionEnforced = !canViewAllBranches;
	return {
		userId: matchedServerUser.id,
		userName,
		role,
		assignedBranchId,
		assignedTerminalName,
		canViewFinancials,
		canViewCostAndMargin,
		canViewAllBranches,
		canViewCustomerPII,
		canExportAnalytics,
		roleVerifiedFromServerStore: true,
		branchRestrictionEnforced
	};
}
/**
* Enforces server-side branch and cashier scope restrictions on incoming filter parameters.
* Non-admin/non-manager users are automatically scoped to their assigned branch or terminal.
*/
function enforceScopedFilters(filters, user) {
	const scoped = {
		datePreset: filters.datePreset || "30d",
		branchId: filters.branchId || "all",
		category: filters.category || "all",
		productId: filters.productId || "all",
		customerId: filters.customerId || "all",
		supplierName: filters.supplierName || "all",
		cashierName: filters.cashierName || "all",
		paymentMethod: filters.paymentMethod || "all",
		currency: filters.currency || "SDG",
		valuationMode: filters.valuationMode || "historical",
		anchorCurrency: filters.anchorCurrency || "USD",
		transactionStatus: filters.transactionStatus || "completed",
		abcBasis: filters.abcBasis || "revenue",
		leadTimeDays: Number.isFinite(filters.leadTimeDays) ? Math.max(1, Math.min(90, Number(filters.leadTimeDays))) : 3,
		safetyStockDays: Number.isFinite(filters.safetyStockDays) ? Math.max(1, Math.min(30, Number(filters.safetyStockDays))) : 2,
		forecastHorizonDays: filters.forecastHorizonDays === 7 || filters.forecastHorizonDays === 30 || filters.forecastHorizonDays === 90 ? filters.forecastHorizonDays : 7,
		missingDateStrategy: filters.missingDateStrategy || "zero_fill",
		fixedOperatingExpensesOverride: filters.fixedOperatingExpensesOverride,
		startDate: filters.startDate,
		endDate: filters.endDate
	};
	if (!user.canViewAllBranches) {
		if (user.assignedBranchId && user.assignedBranchId !== "all") scoped.branchId = user.assignedBranchId;
		if (user.role === "cashier" && user.assignedTerminalName) scoped.cashierName = user.assignedTerminalName;
	}
	return scoped;
}
/**
* Masks sensitive cost/margin fields in SalesAnalyticsResult as `null` (NEVER `0`)
* if user lacks cost/margin permission.
*/
function sanitizeSalesForRole(sales, user) {
	if (user.canViewCostAndMargin) return sales;
	const maskDimension = (items) => items.map((item) => ({
		...item,
		cogs: null,
		grossProfit: null,
		grossMarginPercent: null
	}));
	return {
		...sales,
		costAccessStatus: "restricted_by_role",
		dailySeries: sales.dailySeries.map((d) => ({
			...d,
			cogs: null,
			grossProfit: null
		})),
		byCategory: maskDimension(sales.byCategory),
		byProduct: maskDimension(sales.byProduct),
		byBranch: maskDimension(sales.byBranch),
		byEmployee: maskDimension(sales.byEmployee)
	};
}
/**
* Masks sensitive P&L, Cost, Working Capital, and Break-Even fields in FinancialAnalyticsResult
* as `null` (NEVER `0`) if user lacks financial report permission.
*/
function sanitizeFinancialsForRole(financial, user) {
	if (user.canViewFinancials) return financial;
	return {
		...financial,
		financialAccessStatus: "restricted_by_role",
		profitAndLoss: {
			...financial.profitAndLoss,
			costOfGoodsSold: null,
			exactHistoricalCogsPortion: null,
			estimatedCurrentCostCogsPortion: null,
			unresolvableCostRevenuePortion: null,
			grossProfit: null,
			estimatedGrossProfit: null,
			grossProfitMarginPercent: null,
			recordedShrinkageAndDamageExpense: null,
			profitAfterRecordedShrinkage: null,
			profitAfterShrinkageMarginPercent: null,
			generalOperatingExpenses: null,
			operatingProfitStatus: "restricted_by_role",
			netOperatingProfit: null,
			netProfitMarginPercent: null
		},
		cashFlowAndWorkingCapital: {
			...financial.cashFlowAndWorkingCapital,
			inventoryValuationAtCost: null,
			potentialInventoryGrossProfit: null
		},
		breakEvenAnalysis: {
			...financial.breakEvenAnalysis,
			status: "restricted_by_role",
			fixedOperatingCosts: null,
			variableCostsCogs: null,
			contributionMargin: null,
			contributionMarginRatio: null,
			averageGrossMarginRatio: null,
			recordedShrinkageCosts: null,
			breakEvenSalesRevenue: null,
			surplusOrDeficitRevenue: null,
			isAboveBreakEven: null
		},
		categoryProfitability: [],
		productProfitability: []
	};
}
/**
* Masks sensitive unit cost, inventory cost valuation, and COGS fields in InventoryAnalyticsResult
* as `null` (NEVER `0`) if user lacks cost/margin permission (e.g. `cashier`).
*/
function sanitizeInventoryForRole(inventory, user) {
	if (user.canViewCostAndMargin) return inventory;
	return {
		...inventory,
		costAccessStatus: "restricted_by_role",
		summary: {
			...inventory.summary,
			totalInventoryValueAtCost: null,
			totalAverageInventoryValueAtCost: null,
			overallCostBasedTurnoverRatio: null,
			shrinkageCostTotal: null,
			restockCostTotal: null,
			totalRecommendedOrderCost: null
		},
		products: inventory.products.map((p) => ({
			...p,
			unitCost: null,
			inventoryValueAtCost: null,
			averageInventoryValueAtCost: null,
			cogsInPeriod: null,
			grossProfitInPeriod: null,
			costBasedStockTurnoverRatio: null,
			reorderRecommendation: {
				...p.reorderRecommendation,
				estimatedOrderCost: null
			}
		})),
		recentMovementsSummary: inventory.recentMovementsSummary.map((m) => ({
			...m,
			estimatedValue: null
		}))
	};
}
/**
* Enforces branch visibility and cost/margin masking on BranchAnalyticsResult.
*/
function sanitizeBranchesForRole(branches, user) {
	let scopedBranches = branches.branches;
	if (!user.canViewAllBranches && user.assignedBranchId && user.assignedBranchId !== "all") scopedBranches = scopedBranches.filter((b) => b.branchId === user.assignedBranchId);
	if (!user.canViewCostAndMargin) scopedBranches = scopedBranches.map((b) => ({
		...b,
		cogs: null,
		grossProfit: null,
		grossMarginPercent: null
	}));
	return {
		...branches,
		costAccessStatus: user.canViewCostAndMargin ? "authorized" : "restricted_by_role",
		branches: scopedBranches,
		topBranchId: scopedBranches[0]?.branchId || null
	};
}
/**
* Masks profit forecast series if user lacks cost/margin permission.
*/
function sanitizeForecastsForRole(forecasts, user) {
	if (user.canViewCostAndMargin) return forecasts;
	return {
		...forecasts,
		revenueForecastSummary: {
			...forecasts.revenueForecastSummary,
			expectedTotalGrossProfit: null
		},
		profitSeries: []
	};
}
/**
* Filters out sensitive financial/margin insights for roles without financial or cost access.
*/
function sanitizeInsightsForRole(insights, user) {
	return insights.filter((item) => {
		if (!user.canViewFinancials) {
			if (item.category === "cash_and_debt" || item.category === "fx_sensitivity") return false;
		}
		if (!user.canViewCostAndMargin) {
			if (item.id === "insight-inventory-dead-stock") return false;
		}
		return true;
	});
}
/**
* Masks customer phone numbers if user lacks customer PII permission.
*/
function sanitizeCustomersForRole(customers, user) {
	if (user.canViewCustomerPII) return customers;
	const maskPhone = (phone) => phone && phone.length > 4 ? `${"*".repeat(Math.max(0, phone.length - 4))}${phone.slice(-4)}` : "****";
	return {
		...customers,
		piiAccessStatus: "restricted_by_role",
		topCustomers: customers.topCustomers.map((c) => ({
			...c,
			phone: maskPhone(c.phone)
		})),
		creditExposureRanking: customers.creditExposureRanking.map((c) => ({
			...c,
			phone: maskPhone(c.phone)
		}))
	};
}
/**
* Masks sensitive financial alerts, unit costs, and customer PII from SmartStoreIntelligenceResult
* according to the verified server-side user role.
*/
function sanitizeIntelligenceForRole(intelligence, user) {
	const filterAlerts = (alerts) => alerts.filter((a) => {
		if (!user.canViewFinancials && a.category === "FINANCIAL_RISK") return false;
		if (!user.canViewAllBranches && user.assignedBranchId && user.assignedBranchId !== "all" && a.branchId !== "all" && a.branchId !== user.assignedBranchId) return false;
		return true;
	});
	const filteredSmartAlerts = filterAlerts(intelligence.smartAlerts);
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
	for (const a of filteredSmartAlerts) byCategory[a.category] = (byCategory[a.category] || 0) + 1;
	return {
		...intelligence,
		overview: {
			...intelligence.overview,
			totalActiveAlerts: filteredSmartAlerts.length,
			criticalAlertsCount: filteredSmartAlerts.filter((a) => a.severity === "CRITICAL").length,
			highAlertsCount: filteredSmartAlerts.filter((a) => a.severity === "HIGH").length,
			totalRecommendedReplenishmentCost: user.canViewCostAndMargin ? intelligence.overview.totalRecommendedReplenishmentCost : null,
			byCategory
		},
		unmetDemand: {
			...intelligence.unmetDemand,
			topRequestedProducts: intelligence.unmetDemand.topRequestedProducts.map((p) => ({
				...p,
				estimatedLostGrossProfitConservative: user.canViewCostAndMargin ? p.estimatedLostGrossProfitConservative : null
			})),
			lostSalesEstimation: {
				...intelligence.unmetDemand.lostSalesEstimation,
				estimatedLostGrossProfit: user.canViewCostAndMargin ? intelligence.unmetDemand.lostSalesEstimation.estimatedLostGrossProfit : null
			},
			recentRequests: intelligence.unmetDemand.recentRequests.map((r) => redactUnmetDemandRecordForRole(r, user.canViewCustomerPII))
		},
		smartAlerts: filteredSmartAlerts,
		inventoryRisks: filterAlerts(intelligence.inventoryRisks),
		financialRisks: user.canViewFinancials ? filterAlerts(intelligence.financialRisks) : [],
		branchInsights: filterAlerts(intelligence.branchInsights),
		replenishmentRecommendations: intelligence.replenishmentRecommendations.map((r) => ({
			...r,
			unitCost: user.canViewCostAndMargin ? r.unitCost : null,
			estimatedOrderCost: user.canViewCostAndMargin ? r.estimatedOrderCost : null
		})),
		branchTransferOpportunities: user.canViewAllBranches ? intelligence.branchTransferOpportunities : intelligence.branchTransferOpportunities.filter((t) => !user.assignedBranchId || t.fromBranchId === user.assignedBranchId || t.toBranchId === user.assignedBranchId)
	};
}
// src/analytics/unmet-demand.validation.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*
* Phase 10 (Phase B): Customer Demand Intelligence (Unmet Demand)
* Pure Data Model, Input Validation, Server-Side RBAC Binding & Deduplication Logic
*/
var SUPPORTED_UNAVAILABILITY_REASONS = [
	"OUT_OF_STOCK",
	"EXPIRED",
	"DISCONTINUED",
	"NOT_STOCKED",
	"TEMPORARILY_UNAVAILABLE",
	"OTHER"
];
var RAPID_DEDUPE_WINDOW_MS = 6e4;
function sanitizeText(val, maxLen) {
	if (typeof val !== "string") return "";
	return val.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, maxLen);
}
/**
* Resolves the explicit catalog lifecycle state of a product.
* CRITICAL RULE: An inactive product (`isActive === false`) without explicit
* `catalogLifecycleStatus === 'DISCONTINUED'` is classified as `'TEMPORARILY_PAUSED'`,
* NEVER automatically as `'DISCONTINUED'`.
*/
function resolveProductCatalogLifecycleStatus(product) {
	if (!product) return "ACTIVE";
	const explicitStatus = product.catalogLifecycleStatus || product.customFields?.catalogLifecycleStatus;
	if (explicitStatus === "DISCONTINUED") return "DISCONTINUED";
	if (explicitStatus === "TEMPORARILY_PAUSED") return "TEMPORARILY_PAUSED";
	if (product.isActive === false) return "TEMPORARILY_PAUSED";
	return "ACTIVE";
}
/**
* Calculates sellable inventory using valid, non-expired batches without ever setting
* the entire product's available stock to zero just because one batch has expired.
*/
function computeProductSellableStock(product, now = /* @__PURE__ */ new Date(), fallbackExpiredUnitsObserved) {
	const totalPhysicalStock = Math.max(0, Math.trunc(Number(product.stock || 0)));
	const batches = Array.isArray(product.batches) && product.batches.length > 0 ? product.batches : Array.isArray(product.customFields?.batches) && product.customFields.batches.length > 0 ? product.customFields.batches : void 0;
	if (batches && batches.length > 0) {
		const nowMs = now.getTime();
		let expiredFromBatches = 0;
		for (const batch of batches) {
			if (!batch) continue;
			const qty = Math.max(0, Math.trunc(Number(batch.quantityOnHand || 0)));
			if (qty <= 0) continue;
			const isQuarantined = batch.status === "QUARANTINED_EXPIRED";
			let isPastExpiry = false;
			if (batch.expiryDate) {
				const expMs = new Date(batch.expiryDate).getTime();
				if (!Number.isNaN(expMs) && expMs <= nowMs) isPastExpiry = true;
			}
			if (isQuarantined || isPastExpiry) expiredFromBatches += qty;
		}
		const expiredStockUnits = Math.min(totalPhysicalStock, expiredFromBatches);
		return {
			totalPhysicalStock,
			expiredStockUnits,
			sellableStockUnits: Math.max(0, totalPhysicalStock - expiredStockUnits)
		};
	}
	const observedExpired = fallbackExpiredUnitsObserved !== void 0 && fallbackExpiredUnitsObserved !== null && Number.isFinite(Number(fallbackExpiredUnitsObserved)) && Number(fallbackExpiredUnitsObserved) > 0 ? Math.min(totalPhysicalStock, Math.trunc(Number(fallbackExpiredUnitsObserved))) : 0;
	return {
		totalPhysicalStock,
		expiredStockUnits: observedExpired,
		sellableStockUnits: Math.max(0, totalPhysicalStock - observedExpired)
	};
}
/**
* Pure domain calculator for partial and full fulfillment state derived from sale-linked fulfillment records.
* Never marks a request as fulfilled without active sale-linked fulfillment units.
*/
function computeUnmetDemandFulfillmentState(params) {
	const requested = Math.max(1, Math.trunc(Number(params.requestedBaseUnits || 1)));
	let lastFulfilledAt = null;
	const activeFulfilledSum = (params.fulfillments || []).reduce((acc, link) => {
		if (!link || link.status !== "active") return acc;
		const units = Math.max(0, Math.trunc(Number(link.fulfilledBaseUnits || 0)));
		const ts = link.fulfilledAt || link.linkedAt || null;
		if (ts && (!lastFulfilledAt || ts > lastFulfilledAt)) lastFulfilledAt = ts;
		return acc + units;
	}, 0);
	const fulfilledBaseUnits = Math.min(requested, activeFulfilledSum);
	const remainingUnfulfilledBaseUnits = Math.max(0, requested - fulfilledBaseUnits);
	if (params.isCancelled) return {
		fulfilledBaseUnits,
		remainingUnfulfilledBaseUnits,
		fulfillmentStatus: "cancelled",
		lastFulfilledAt
	};
	return {
		fulfilledBaseUnits,
		remainingUnfulfilledBaseUnits,
		fulfillmentStatus: fulfilledBaseUnits <= 0 ? "unfulfilled" : fulfilledBaseUnits < requested ? "partially_fulfilled" : "fulfilled_later",
		lastFulfilledAt
	};
}
/**
* Generates a deterministic fingerprint for 60-second accidental duplicate detection.
* Separate customers or requests separated by >60s are preserved as distinct inquiries.
*/
function buildUnmetDemandDedupeFingerprint(params) {
	const itemKey = (params.productId || params.barcode || params.productNameSnapshot.toLowerCase().replace(/\s+/g, " ")).trim();
	const custKey = (params.customerId || params.customerReference || "walk_in").trim().toLowerCase();
	return [
		params.branchId,
		params.recordedByUserId,
		itemKey,
		params.unavailabilityReason,
		`${params.requestedQuantity}:${params.saleUnitMode}`,
		custKey
	].join("|");
}
function makeErrorResult(statusCode, errorCode, errorMessage, errorMessageAr, isDuplicateRapidSubmission = false) {
	return {
		valid: false,
		ok: false,
		statusCode,
		isDuplicateRapidSubmission,
		errorCode,
		errorMessage,
		errorMessageAr,
		errorEn: errorMessage,
		errorAr: errorMessageAr
	};
}
/**
* Pure, deterministic validator and normalizer for Customer Demand Capture (Part 4A & 4B).
* Supports both single-object `(params)` and two-argument `(input, context)` invocation styles.
*/
function validateAndBuildUnmetDemandRequest(paramsOrInput, legacyContext) {
	const { input, claimingUserId, serverUsers, catalogProducts, existingRequests, exchangeRates = {
		SDG: 1,
		USD: 2700
	}, now = /* @__PURE__ */ new Date() } = legacyContext ? {
		input: paramsOrInput,
		claimingUserId: legacyContext.authenticatedUser?.id,
		serverUsers: legacyContext.authenticatedUser ? [legacyContext.authenticatedUser] : [],
		catalogProducts: legacyContext.products,
		existingRequests: legacyContext.existingRequests,
		exchangeRates: legacyContext.exchangeRates,
		now: legacyContext.now
	} : paramsOrInput;
	const cleanUserId = sanitizeText(claimingUserId, 64);
	if (!cleanUserId) return makeErrorResult(401, "UNAUTHENTICATED_USER", "Authentication required: recording employee ID is missing.", "يلزم تسجيل الدخول: معرف الموظف المسجل للطلب مفقود.");
	const userContext = resolveAnalyticsUserContext({ userId: cleanUserId }, serverUsers);
	if (!userContext.roleVerifiedFromServerStore) return makeErrorResult(401, "UNAUTHENTICATED_USER", `Authentication failed: user "${cleanUserId}" is not recognized in the server user directory.`, `فشل التحقق من الهوية: المستخدم "${cleanUserId}" غير مسجل في دليل موظفي النظام.`);
	const rawReason = sanitizeText(input.unavailabilityReason || "OUT_OF_STOCK", 40).toUpperCase();
	if (!SUPPORTED_UNAVAILABILITY_REASONS.includes(rawReason)) return makeErrorResult(400, "INVALID_REASON", `Invalid unavailability reason "${rawReason}". Supported: ${SUPPORTED_UNAVAILABILITY_REASONS.join(", ")}.`, "سبب عدم التوفر غير صالح. يرجى اختيار سبب معتمد.");
	let unavailabilityReason = rawReason;
	const rawQty = input.requestedQuantity === void 0 || input.requestedQuantity === null ? 1 : Number(input.requestedQuantity);
	if (!Number.isFinite(rawQty) || !Number.isInteger(rawQty) || rawQty < 1 || rawQty > 1e4) return makeErrorResult(400, "INVALID_QUANTITY", "Requested quantity must be a whole number between 1 and 10,000.", "يجب أن تكون الكمية المطلوبة عدداً صحيحاً موجباً بين 1 و 10,000.");
	const requestedQuantity = rawQty;
	let expiredUnitsObserved = null;
	if (input.expiredUnitsObserved !== void 0 && input.expiredUnitsObserved !== null) {
		const rawExpQty = Number(input.expiredUnitsObserved);
		if (!Number.isFinite(rawExpQty) || !Number.isInteger(rawExpQty) || rawExpQty < 1 || rawExpQty > 1e4) return makeErrorResult(400, "INVALID_QUANTITY", "Observed expired units must be a whole number between 1 and 10,000.", "يجب أن يكون عدد الوحدات منتهية الصلاحية المرصودة عدداً صحيحاً موجباً بين 1 و 10,000.");
		expiredUnitsObserved = rawExpQty;
	}
	const cleanProductId = input.isRegisteredProduct === false ? null : sanitizeText(input.productId, 100) || null;
	const cleanBarcode = sanitizeText(input.barcode, 64) || null;
	let matchedProduct;
	if (cleanProductId) {
		matchedProduct = catalogProducts.find((p) => p.id === cleanProductId);
		if (!matchedProduct) return makeErrorResult(400, "UNREGISTERED_PRODUCT_ID_NOT_FOUND", `Product ID "${cleanProductId}" does not exist in the catalog. Omit productId for unregistered product requests.`, `معرف المنتج "${cleanProductId}" غير موجود في الكتالوج. لتسجيل منتج غير مسجل، اترك معرف المنتج فارغاً.`);
	} else if (cleanBarcode && unavailabilityReason !== "NOT_STOCKED" && input.isRegisteredProduct !== false) matchedProduct = catalogProducts.find((p) => p.barcode === cleanBarcode || Array.isArray(p.barcodes) && p.barcodes.includes(cleanBarcode));
	const isRegisteredProduct = Boolean(matchedProduct);
	const rawProvidedName = input.productName || input.productNameSnapshot;
	const rawProvidedNameAr = input.productNameAr || input.productNameArSnapshot;
	const rawProvidedCategory = input.category || input.categorySnapshot;
	const productNameSnapshot = matchedProduct ? matchedProduct.name : sanitizeText(rawProvidedName, 160);
	const productNameArSnapshot = matchedProduct ? matchedProduct.nameAr || null : sanitizeText(rawProvidedNameAr, 160) || null;
	if (!productNameSnapshot && !cleanBarcode) return makeErrorResult(400, "MISSING_PRODUCT_IDENTITY", "A product selection, descriptive product name, or barcode is required.", "يرجى تحديد منتج من الكتالوج أو إدخال اسم وصفي أو باركود للمنتج المطلوب.");
	const finalProductName = productNameSnapshot || `Unregistered Barcode (${cleanBarcode})`;
	const saleUnitMode = input.saleUnitMode === "pack" && matchedProduct?.enablePackaging && (matchedProduct?.unitsPerPack ?? 1) > 1 ? "pack" : "unit";
	const unitsPerPack = saleUnitMode === "pack" && matchedProduct?.unitsPerPack && matchedProduct.unitsPerPack > 1 ? matchedProduct.unitsPerPack : 1;
	const requestedBaseUnits = requestedQuantity * unitsPerPack;
	const catalogLifecycle = resolveProductCatalogLifecycleStatus(matchedProduct);
	const availableStockAtRequest = matchedProduct ? computeProductSellableStock(matchedProduct, now, expiredUnitsObserved).sellableStockUnits : null;
	if (matchedProduct && catalogLifecycle === "DISCONTINUED" && !input.unavailabilityReason) unavailabilityReason = "DISCONTINUED";
	let availabilityStatus;
	if (!isRegisteredProduct || unavailabilityReason === "NOT_STOCKED") availabilityStatus = "UNREGISTERED";
	else if (unavailabilityReason === "DISCONTINUED" || catalogLifecycle === "DISCONTINUED") availabilityStatus = "DISCONTINUED";
	else if (unavailabilityReason === "EXPIRED") availabilityStatus = "EXPIRED";
	else if (unavailabilityReason === "TEMPORARILY_UNAVAILABLE" || catalogLifecycle === "TEMPORARILY_PAUSED") availabilityStatus = "TEMPORARILY_UNAVAILABLE";
	else if (availableStockAtRequest !== null && availableStockAtRequest <= 0) availabilityStatus = "OUT_OF_STOCK";
	else if (availableStockAtRequest !== null && availableStockAtRequest < requestedBaseUnits) availabilityStatus = "INSUFFICIENT_QUANTITY";
	else availabilityStatus = "OUT_OF_STOCK";
	const requestedBranch = sanitizeText(input.branchId, 64);
	const effectiveBranchId = userContext.canViewAllBranches ? requestedBranch && requestedBranch !== "all" ? requestedBranch : userContext.assignedBranchId || "branch-main" : userContext.assignedBranchId || "branch-main";
	const effectiveTerminalName = userContext.assignedTerminalName || "Main Terminal";
	const effectiveCompanyId = serverUsers.find((u) => u && u.id === userContext.userId)?.companyId || sanitizeText(input.companyId, 64) || "comp-default";
	let reqDate = now;
	if (input.requestedTimestamp) {
		const parsed = new Date(input.requestedTimestamp);
		if (!Number.isNaN(parsed.getTime()) && parsed.getTime() <= now.getTime() + 3e5) reqDate = parsed;
	}
	const customerId = sanitizeText(input.customerId, 64) || null;
	const customerReference = sanitizeText(input.customerReference, 100) || null;
	const notes = sanitizeText(input.notes, 500) || null;
	const expiredBatchNumber = sanitizeText(input.expiredBatchNumber, 80) || null;
	const expiredBatchDate = sanitizeText(input.expiredBatchDate, 40) || null;
	const substituteProductId = sanitizeText(input.substituteProductId, 100) || matchedProduct?.replacementProductId || matchedProduct?.customFields?.replacementProductId || null;
	const dedupeFingerprint = buildUnmetDemandDedupeFingerprint({
		branchId: effectiveBranchId,
		recordedByUserId: userContext.userId,
		productId: matchedProduct ? matchedProduct.id : null,
		barcode: cleanBarcode || (matchedProduct ? matchedProduct.barcode : null),
		productNameSnapshot: finalProductName,
		unavailabilityReason,
		requestedQuantity,
		saleUnitMode,
		customerId,
		customerReference
	});
	const idempotencyKey = sanitizeText(input.idempotencyKey, 100) || `udr-idem-${reqDate.getTime()}-${Math.random().toString(36).slice(2, 8)}`;
	for (const existing of existingRequests) {
		if (existing.idempotencyKey === idempotencyKey) return makeErrorResult(409, "DUPLICATE_IDEMPOTENCY_KEY", "Duplicate submission: this request idempotency key has already been recorded.", "تم تسجيل هذا الطلب مسبقاً (مفتاح عدم التكرار مطابق).", true);
		if (!input.allowRapidRepeat && existing.dedupeFingerprint === dedupeFingerprint) {
			const existingMs = new Date(existing.requestedTimestamp).getTime();
			if (Math.abs(reqDate.getTime() - existingMs) <= RAPID_DEDUPE_WINDOW_MS) return makeErrorResult(409, "DUPLICATE_RAPID_SUBMISSION", "Duplicate submission prevented: an identical inquiry was logged by you within the last 60 seconds.", "تم منع التكرار غير المقصود: تم تسجيل نفس الاستفسار خلال آخر 60 ثانية.", true);
		}
	}
	const currencySnapshot = matchedProduct?.priceCurrency || "SDG";
	const rateSnapshot = currencySnapshot === "SDG" ? 1 : Number(exchangeRates[currencySnapshot]) > 0 ? Number(exchangeRates[currencySnapshot]) : 1;
	const unitSellingPriceSnapshot = matchedProduct ? saleUnitMode === "pack" && matchedProduct.packSellingPrice && matchedProduct.packSellingPrice > 0 ? matchedProduct.packSellingPrice : matchedProduct.sellingPrice : null;
	const unitCostPriceSnapshot = matchedProduct ? saleUnitMode === "pack" && matchedProduct.packCostPrice && matchedProduct.packCostPrice > 0 ? matchedProduct.packCostPrice : matchedProduct.costPrice > 0 ? matchedProduct.costPrice : null : null;
	return {
		valid: true,
		ok: true,
		statusCode: 201,
		isDuplicateRapidSubmission: false,
		record: {
			id: `UDR-${reqDate.toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
			companyId: effectiveCompanyId,
			idempotencyKey,
			dedupeFingerprint,
			productId: matchedProduct ? matchedProduct.id : null,
			isRegisteredProduct,
			productNameSnapshot: finalProductName,
			productNameArSnapshot,
			skuSnapshot: matchedProduct ? matchedProduct.sku : null,
			barcode: cleanBarcode || (matchedProduct ? matchedProduct.barcode : null),
			categorySnapshot: matchedProduct ? matchedProduct.category : sanitizeText(rawProvidedCategory, 80) || "Unregistered",
			branchId: effectiveBranchId,
			terminalName: effectiveTerminalName,
			requestedTimestamp: reqDate.toISOString(),
			requestedQuantity,
			saleUnitMode,
			packConversionFactor: unitsPerPack,
			requestedBaseUnits,
			availableStockAtRequest,
			availabilityStatus,
			unavailabilityReason,
			confirmedPurchaseIntent: Boolean(input.confirmedPurchaseIntent),
			fulfillmentStatus: "unfulfilled",
			fulfilledBaseUnits: 0,
			remainingUnfulfilledBaseUnits: requestedBaseUnits,
			expiredUnitsObserved,
			expiredBatchNumber,
			expiredBatchDate,
			substituteProductId,
			lastFulfilledAt: null,
			fulfillments: [],
			customerId,
			customerReference,
			unitSellingPriceSnapshot,
			unitCostPriceSnapshot,
			unitCostSnapshot: unitCostPriceSnapshot,
			currencySnapshot,
			exchangeRateSnapshot: rateSnapshot,
			notes,
			sourceScreen: input.sourceScreen || "checkout",
			recordedByUserId: userContext.userId,
			recordedByName: userContext.userName,
			recordedByUserNameSnapshot: userContext.userName,
			recordedByRoleSnapshot: userContext.role,
			createdAt: now.toISOString()
		}
	};
}
/**
* Redacts customer PII from unmet demand records when viewed by unauthorized roles
* or exported in aggregate analytics (Part 4B & Part 8).
*/
function redactUnmetDemandRecordForRole(record, canViewCustomerPII) {
	if (canViewCustomerPII) return record;
	return {
		...record,
		customerReference: record.customerReference ? "[REDACTED]" : null
	};
}
/**
* Normalizes Arabic & English text for flexible product search and canonical deduplication:
* - Removes Arabic diacritics (tashkeel) and tatweel
* - Normalizes Alef variants (أ، إ، آ، ٱ) -> ا
* - Normalizes Ta-Marbuta (ة) -> ه
* - Normalizes Alef-Maqsura / Ya variants (ى، ئ) -> ي
* - Normalizes Waw-Hamza (ؤ) -> و
* - Strips punctuation into spaces and collapses whitespace
*/
function normalizeUnavailableSearchText(text) {
	if (!text) return "";
	return String(text).toLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ة/g, "ه").replace(/[ىئ]/g, "ي").replace(/ؤ/g, "و").replace(/[^\p{L}\p{N}\s]+/gu, " ").replace(/\s+/g, " ").trim();
}
/**
* Computes a relevance score (0..100) for a candidate product against a user search query.
* Supports:
* - Searching by ANY word, partial word/prefix, or single character in the product name
*   (e.g., "كريم", "باريس", "باري", "كريم باريس", or "كريم باري بالكرياتن" all match "كريم باريس الابيض")
* - Barcode / SKU substring matching
*/
function scoreUnavailableProductMatch(candidateFields, rawQuery) {
	const normQuery = normalizeUnavailableSearchText(rawQuery);
	if (!normQuery) return 1;
	const normCandidates = candidateFields.map((f) => normalizeUnavailableSearchText(f)).filter((s) => s.length > 0);
	if (normCandidates.length === 0) return 0;
	const combinedText = normCandidates.join(" ");
	const candidateTokens = Array.from(new Set(combinedText.split(" ").filter((t) => t.length > 0)));
	if (normCandidates[0] === normQuery) return 100;
	if (combinedText.includes(normQuery)) return normCandidates[0].startsWith(normQuery) ? 95 : 88;
	const queryTokens = normQuery.split(" ").filter((t) => t.length > 0);
	if (queryTokens.length === 0) return 0;
	let matchedTokenCount = 0;
	let strongTokenMatches = 0;
	for (const qToken of queryTokens) {
		let tokenMatched = false;
		for (const cToken of candidateTokens) {
			if (cToken === qToken) {
				tokenMatched = true;
				strongTokenMatches += 1;
				break;
			}
			if (cToken.includes(qToken) || qToken.length >= 2 && cToken.length >= 2 && qToken.includes(cToken)) {
				tokenMatched = true;
				if (cToken.startsWith(qToken) || qToken.startsWith(cToken)) strongTokenMatches += 1;
				break;
			}
			if (qToken.length >= 3 && cToken.length >= 3 && cToken.slice(0, 3) === qToken.slice(0, 3)) {
				tokenMatched = true;
				break;
			}
		}
		if (tokenMatched) matchedTokenCount += 1;
	}
	if (matchedTokenCount === 0) return 0;
	if (matchedTokenCount === queryTokens.length) return 80 + Math.min(12, strongTokenMatches * 4);
	const ratio = matchedTokenCount / queryTokens.length;
	return Math.round(45 + ratio * 30 + Math.min(10, strongTokenMatches * 5));
}
function matchesUnavailableProductQuery(candidateFields, rawQuery) {
	return scoreUnavailableProductMatch(candidateFields, rawQuery) > 0;
}
/**
* Builds the searchable Unavailable Products Knowledge Base (`قاعدة المنتجات غير المتوفرة`)
* from all historical unmet demand requests and out-of-stock catalog products.
*/
function buildUnavailableProductsKnowledgeBase(existingRequests, catalogProducts = []) {
	const catalogById = /* @__PURE__ */ new Map();
	const catalogByNormName = /* @__PURE__ */ new Map();
	for (const p of catalogProducts) {
		catalogById.set(p.id, p);
		const nEn = normalizeUnavailableSearchText(p.name);
		if (nEn) catalogByNormName.set(nEn, p);
		if (p.nameAr) {
			const nAr = normalizeUnavailableSearchText(p.nameAr);
			if (nAr) catalogByNormName.set(nAr, p);
		}
	}
	const map = /* @__PURE__ */ new Map();
	const sortedRequests = [...existingRequests].sort((a, b) => new Date(a.requestedTimestamp).getTime() - new Date(b.requestedTimestamp).getTime());
	for (const req of sortedRequests) {
		const matchedProd = (req.productId ? catalogById.get(req.productId) : void 0) || catalogByNormName.get(normalizeUnavailableSearchText(req.productNameSnapshot));
		const normName = normalizeUnavailableSearchText(req.productNameSnapshot || req.productNameArSnapshot || "unknown");
		const key = matchedProd ? `prod:${matchedProd.id}` : req.productId ? `prod:${req.productId}` : req.barcode ? `barcode:${req.barcode.trim()}` : `unreg:${normName}`;
		let entry = map.get(key);
		if (!entry) {
			entry = {
				key,
				productId: matchedProd ? matchedProd.id : req.productId || null,
				isRegisteredProduct: Boolean(matchedProd || req.isRegisteredProduct && req.productId),
				productName: matchedProd ? matchedProd.name : req.productNameSnapshot,
				productNameAr: matchedProd ? matchedProd.nameAr || req.productNameArSnapshot || null : req.productNameArSnapshot || req.productNameSnapshot,
				sku: matchedProd ? matchedProd.sku : req.skuSnapshot || null,
				barcode: matchedProd ? matchedProd.barcode : req.barcode || null,
				category: matchedProd ? matchedProd.category : req.categorySnapshot || "Unregistered",
				unavailabilityReason: req.unavailabilityReason || "NOT_STOCKED",
				inquiryCount: 0,
				totalRequestedQuantity: 0,
				totalRequestedBaseUnits: 0,
				confirmedIntentCount: 0,
				firstRequestedAt: req.requestedTimestamp,
				lastRequestedAt: req.requestedTimestamp,
				inquiryTimestamps: [],
				recentNotes: [],
				currentStock: matchedProd ? matchedProd.stock : req.availableStockAtRequest ?? null
			};
			map.set(key, entry);
		}
		entry.inquiryCount += 1;
		entry.totalRequestedQuantity += Math.max(1, Number(req.requestedQuantity || 1));
		entry.totalRequestedBaseUnits += Math.max(1, Number(req.requestedBaseUnits || req.requestedQuantity || 1));
		if (req.confirmedPurchaseIntent) entry.confirmedIntentCount += 1;
		if (req.requestedTimestamp < entry.firstRequestedAt) entry.firstRequestedAt = req.requestedTimestamp;
		if (req.requestedTimestamp >= entry.lastRequestedAt) {
			entry.lastRequestedAt = req.requestedTimestamp;
			entry.unavailabilityReason = req.unavailabilityReason || entry.unavailabilityReason;
		}
		entry.inquiryTimestamps.push(req.requestedTimestamp);
		if (req.notes && req.notes.trim() && !entry.recentNotes.includes(req.notes.trim())) {
			entry.recentNotes.unshift(req.notes.trim());
			if (entry.recentNotes.length > 5) entry.recentNotes.pop();
		}
	}
	for (const entry of map.values()) entry.inquiryTimestamps.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
	for (const prod of catalogProducts) {
		const key = `prod:${prod.id}`;
		if (!map.has(key) && prod.stock <= (prod.minStockAlert || 5)) map.set(key, {
			key,
			productId: prod.id,
			isRegisteredProduct: true,
			productName: prod.name,
			productNameAr: prod.nameAr || null,
			sku: prod.sku,
			barcode: prod.barcode,
			category: prod.category,
			unavailabilityReason: prod.stock <= 0 ? "OUT_OF_STOCK" : "TEMPORARILY_UNAVAILABLE",
			inquiryCount: 0,
			totalRequestedQuantity: 0,
			totalRequestedBaseUnits: 0,
			confirmedIntentCount: 0,
			firstRequestedAt: "",
			lastRequestedAt: "",
			inquiryTimestamps: [],
			recentNotes: [],
			currentStock: prod.stock
		});
	}
	return Array.from(map.values()).sort((a, b) => {
		if (b.inquiryCount !== a.inquiryCount) return b.inquiryCount - a.inquiryCount;
		if (b.lastRequestedAt !== a.lastRequestedAt) return b.lastRequestedAt.localeCompare(a.lastRequestedAt);
		return a.productName.localeCompare(b.productName);
	});
}
/**
* Searches the Unavailable Products Knowledge Base by any word, partial word, or character.
*/
function searchUnavailableProductsKnowledgeBase(items, query, options) {
	const limit = options?.limit ?? 15;
	const source = options?.onlyUnregisteredOrPreviouslyAsked ? items.filter((item) => !item.isRegisteredProduct || item.inquiryCount > 0) : items;
	const trimmed = query.trim();
	if (!trimmed) return source.slice(0, limit).map((item) => ({
		...item,
		matchScore: item.inquiryCount > 0 ? 50 : 10
	}));
	const scored = [];
	for (const item of source) {
		const score = scoreUnavailableProductMatch([
			item.productName,
			item.productNameAr,
			item.barcode,
			item.sku,
			item.category,
			...item.recentNotes
		], trimmed);
		if (score > 0) scored.push({
			...item,
			matchScore: score
		});
	}
	scored.sort((a, b) => {
		if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
		if (b.inquiryCount !== a.inquiryCount) return b.inquiryCount - a.inquiryCount;
		return b.lastRequestedAt.localeCompare(a.lastRequestedAt);
	});
	return scored.slice(0, limit);
}
// src/context/domains/useTrainingAndDemandDomain.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
function useTrainingAndDemandDomain({ currentUser, currentCompany, exchangeRates, branches, products, users, transactions, stockMovements, settings, workspaceMode, setActiveTab, unmetDemandRequests, setUnmetDemandRequests }) {
	const [isUnmetDemandModalOpen, setIsUnmetDemandModalOpen] = (0, import_react.useState)(false);
	const [unmetDemandModalInitialData, setUnmetDemandModalInitialData] = (0, import_react.useState)(null);
	const userTourStorageKey = (0, import_react.useMemo)(() => getUserTourStorageKey(currentUser?.id, currentCompany?.id), [currentUser?.id, currentCompany?.id]);
	const [trainingTourProgress, setTrainingTourProgress] = (0, import_react.useState)(() => {
		try {
			const saved = localStorage.getItem(getUserTourStorageKey(currentUser?.id, currentCompany?.id)) || localStorage.getItem("dqnamo_pos_training_tour_v1");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (parsed && Array.isArray(parsed.completedStepIds)) return parsed;
			}
		} catch {}
		return createInitialTourProgress();
	});
	(0, import_react.useEffect)(() => {
		try {
			const saved = localStorage.getItem(userTourStorageKey) || localStorage.getItem("dqnamo_pos_training_tour_v1");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (parsed && Array.isArray(parsed.completedStepIds)) {
					setTrainingTourProgress(parsed);
					return;
				}
			}
		} catch {}
	}, [userTourStorageKey]);
	const [isTrainingTourOpen, setIsTrainingTourOpen] = (0, import_react.useState)(false);
	const [trainingTourStepIndex, setTrainingTourStepIndex] = (0, import_react.useState)(() => clampTourStepIndex(trainingTourProgress.lastStepIndex || 0, TRAINING_TOUR_STEPS.length));
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(userTourStorageKey, JSON.stringify(trainingTourProgress));
			localStorage.setItem(TRAINING_TOUR_STORAGE_KEY, JSON.stringify(trainingTourProgress));
		} catch {}
	}, [trainingTourProgress, userTourStorageKey]);
	const onboardingChecklist = (0, import_react.useMemo)(() => {
		return computeOnboardingChecklistStatus({
			companyProfileConfigured: Boolean(currentCompany?.legalName && currentCompany?.onboardingCompleted !== false),
			currenciesConfigured: Boolean(currentCompany?.baseCurrency === "SDG" && Object.keys(exchangeRates || {}).length > 1),
			branchCreated: branches.length > 0,
			productsCount: products.length,
			employeesCount: users.filter((u) => u.isActive !== false).length,
			salesCount: transactions.filter((t) => t.status === "completed").length,
			inventoryReviewed: stockMovements.length > 0,
			guidedTourCompleted: Boolean(trainingTourProgress.isCompleted)
		});
	}, [
		currentCompany,
		exchangeRates,
		branches.length,
		products.length,
		users,
		transactions,
		stockMovements.length,
		trainingTourProgress.isCompleted
	]);
	const startTrainingTour = (0, import_react.useCallback)((stepIndex = 0) => {
		const safeIdx = clampTourStepIndex(stepIndex, TRAINING_TOUR_STEPS.length);
		setTrainingTourStepIndex(safeIdx);
		setTrainingTourProgress((prev) => markTourStepVisited(prev, safeIdx, TRAINING_TOUR_STEPS));
		const targetTab = TRAINING_TOUR_STEPS[safeIdx]?.tab;
		if (targetTab) setActiveTab(targetTab);
		setIsTrainingTourOpen(true);
	}, [setActiveTab]);
	const closeTrainingTour = (0, import_react.useCallback)(() => {
		setIsTrainingTourOpen(false);
	}, []);
	const selectTrainingTourStep = (0, import_react.useCallback)((stepIndex) => {
		const safeIdx = clampTourStepIndex(stepIndex, TRAINING_TOUR_STEPS.length);
		setTrainingTourStepIndex(safeIdx);
		setTrainingTourProgress((prev) => markTourStepVisited(prev, safeIdx, TRAINING_TOUR_STEPS));
		const targetTab = TRAINING_TOUR_STEPS[safeIdx]?.tab;
		if (targetTab) setActiveTab(targetTab);
	}, [setActiveTab]);
	return {
		onboardingChecklist,
		isTrainingTourOpen,
		trainingTourStepIndex,
		trainingTourProgress,
		startTrainingTour,
		closeTrainingTour,
		nextTrainingTourStep: (0, import_react.useCallback)(() => {
			setTrainingTourStepIndex((prevIdx) => {
				const nextIdx = clampTourStepIndex(prevIdx + 1, TRAINING_TOUR_STEPS.length);
				setTrainingTourProgress((prevProg) => markTourStepVisited(prevProg, nextIdx, TRAINING_TOUR_STEPS));
				const targetTab = TRAINING_TOUR_STEPS[nextIdx]?.tab;
				if (targetTab) setActiveTab(targetTab);
				return nextIdx;
			});
		}, [setActiveTab]),
		prevTrainingTourStep: (0, import_react.useCallback)(() => {
			setTrainingTourStepIndex((prevIdx) => {
				const prevStep = clampTourStepIndex(prevIdx - 1, TRAINING_TOUR_STEPS.length);
				setTrainingTourProgress((prevProg) => markTourStepVisited(prevProg, prevStep, TRAINING_TOUR_STEPS));
				const targetTab = TRAINING_TOUR_STEPS[prevStep]?.tab;
				if (targetTab) setActiveTab(targetTab);
				return prevStep;
			});
		}, [setActiveTab]),
		selectTrainingTourStep,
		finishTrainingTour: (0, import_react.useCallback)(() => {
			setTrainingTourProgress((prev) => markTourCompleted(prev, TRAINING_TOUR_STEPS));
			setIsTrainingTourOpen(false);
			playSuccessChime(settings.soundEnabled);
			triggerHaptic("success", settings.hapticsEnabled);
		}, [settings.soundEnabled, settings.hapticsEnabled]),
		resetTrainingTour: (0, import_react.useCallback)(() => {
			const fresh = createInitialTourProgress();
			setTrainingTourProgress(fresh);
			setTrainingTourStepIndex(0);
		}, []),
		isUnmetDemandModalOpen,
		unmetDemandModalInitialData,
		openUnmetDemandModal: (0, import_react.useCallback)((initial) => {
			setUnmetDemandModalInitialData(initial || null);
			setIsUnmetDemandModalOpen(true);
			triggerHaptic("light", settings.hapticsEnabled);
		}, [settings.hapticsEnabled]),
		closeUnmetDemandModal: (0, import_react.useCallback)(() => {
			setIsUnmetDemandModalOpen(false);
			setUnmetDemandModalInitialData(null);
		}, []),
		recordUnmetDemandRequest: (0, import_react.useCallback)(async (input) => {
			const validation = validateAndBuildUnmetDemandRequest(input, {
				authenticatedUser: currentUser,
				products,
				existingRequests: unmetDemandRequests,
				activeCurrency: settings.currency || "SDG",
				exchangeRates
			});
			if (!validation.ok || !validation.record) {
				triggerHaptic("warning", settings.hapticsEnabled);
				return validation;
			}
			if (!validation.isDuplicateRapidSubmission) {
				const newRecord = validation.record;
				setUnmetDemandRequests((prev) => [newRecord, ...prev]);
				if (workspaceMode === "PRODUCTION" && currentUser.id && currentUser.id !== "unassigned-operator") fetch("/api/unmet-demand/requests", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-user-id": currentUser.id
					},
					body: JSON.stringify({
						...input,
						idempotencyKey: newRecord.idempotencyKey
					})
				}).catch(() => {});
			}
			playSuccessChime(settings.soundEnabled);
			triggerHaptic("success", settings.hapticsEnabled);
			return validation;
		}, [
			workspaceMode,
			currentUser,
			products,
			unmetDemandRequests,
			settings.currency,
			settings.soundEnabled,
			settings.hapticsEnabled,
			exchangeRates,
			setUnmetDemandRequests
		]),
		fulfillUnmetDemandFromSale: (0, import_react.useCallback)(async (params) => {
			const req = unmetDemandRequests.find((r) => r.id === params.requestId);
			if (!req) return {
				ok: false,
				errorEn: "Unmet demand request not found",
				errorAr: "طلب المنتج غير المتوفر غير موجود"
			};
			if (req.fulfillmentStatus === "cancelled") return {
				ok: false,
				errorEn: "Cannot fulfill a cancelled request",
				errorAr: "لا يمكن تلبية طلب ملغى"
			};
			const sale = transactions.find((t) => t.id === params.saleId);
			if (!sale || sale.status !== "completed") return {
				ok: false,
				errorEn: "Verified completed sale not found",
				errorAr: "فاتورة البيع المكتملة غير موجودة أو ملغاة"
			};
			const matchingItemIdx = sale.items.findIndex((item) => req.productId ? item.productId === req.productId : item.productName.trim().toLowerCase() === req.productNameSnapshot.trim().toLowerCase());
			if (matchingItemIdx < 0) return {
				ok: false,
				errorEn: "Selected sale does not contain the requested product",
				errorAr: "فاتورة البيع المختارة لا تحتوي على المنتج المطلوب"
			};
			const existingFulfillments = req.fulfillments || [];
			if (existingFulfillments.some((f) => f.saleTransactionId === sale.id && f.status === "active")) return {
				ok: false,
				errorEn: "This sale is already linked to this request",
				errorAr: "تم ربط فاتورة البيع هذه بهذا الطلب مسبقاً"
			};
			const saleItem = sale.items[matchingItemIdx];
			const saleItemBaseUnits = Math.max(1, Math.round(Number(saleItem.stockDeducted || saleItem.quantity || 1)));
			const requestedBase = Math.max(1, Math.round(Number(req.requestedBaseUnits || req.requestedQuantity || 1)));
			const currentState = computeUnmetDemandFulfillmentState({
				requestedBaseUnits: requestedBase,
				fulfillments: existingFulfillments,
				isCancelled: false
			});
			if (currentState.remainingUnfulfilledBaseUnits <= 0) return {
				ok: false,
				errorEn: "Request is already 100% fulfilled",
				errorAr: "تمت تلبية هذا الطلب بالكامل مسبقاً"
			};
			const desiredUnits = params.fulfilledBaseUnits && params.fulfilledBaseUnits > 0 ? Math.round(params.fulfilledBaseUnits) : Math.min(saleItemBaseUnits, currentState.remainingUnfulfilledBaseUnits);
			const unitsToFulfill = Math.max(1, Math.min(desiredUnits, saleItemBaseUnits, currentState.remainingUnfulfilledBaseUnits));
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			const newLink = {
				id: `udfl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
				companyId: req.companyId || currentCompany?.id || "comp-default",
				requestId: req.id,
				saleId: sale.id,
				saleTransactionId: sale.id,
				saleLineIndex: matchingItemIdx,
				branchId: req.branchId,
				productId: req.productId || saleItem.productId,
				fulfilledBaseUnits: unitsToFulfill,
				status: "active",
				linkedByUserId: currentUser.id,
				recordedByUserId: currentUser.id,
				linkedAt: nowIso,
				fulfilledAt: nowIso
			};
			const nextFulfillments = [...existingFulfillments, newLink];
			const nextState = computeUnmetDemandFulfillmentState({
				requestedBaseUnits: requestedBase,
				fulfillments: nextFulfillments,
				isCancelled: false
			});
			const updatedRecord = {
				...req,
				fulfilledBaseUnits: nextState.fulfilledBaseUnits,
				remainingUnfulfilledBaseUnits: nextState.remainingUnfulfilledBaseUnits,
				fulfillmentStatus: nextState.fulfillmentStatus,
				lastFulfilledAt: nextState.lastFulfilledAt,
				fulfillments: nextFulfillments
			};
			setUnmetDemandRequests((prev) => prev.map((r) => r.id === req.id ? updatedRecord : r));
			if (workspaceMode === "PRODUCTION" && currentUser.id && currentUser.id !== "unassigned-operator") fetch(`/api/unmet-demand/requests/${encodeURIComponent(req.id)}/fulfill-from-sale`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-user-id": currentUser.id
				},
				body: JSON.stringify({
					saleId: sale.id,
					fulfilledBaseUnits: unitsToFulfill
				})
			}).catch(() => {});
			playSuccessChime(settings.soundEnabled);
			triggerHaptic("success", settings.hapticsEnabled);
			return {
				ok: true,
				record: updatedRecord
			};
		}, [
			unmetDemandRequests,
			transactions,
			currentCompany?.id,
			currentUser.id,
			workspaceMode,
			settings.soundEnabled,
			settings.hapticsEnabled,
			setUnmetDemandRequests
		]),
		cancelUnmetDemandRequest: (0, import_react.useCallback)(async (params) => {
			const cleanReason = (params.reason || "").trim();
			if (cleanReason.length < 3) return {
				ok: false,
				errorEn: "Cancellation reason is required (min 3 characters)",
				errorAr: "يرجى إدخال سبب واضح لإلغاء الطلب (3 أحرف على الأقل)"
			};
			const req = unmetDemandRequests.find((r) => r.id === params.requestId);
			if (!req) return {
				ok: false,
				errorEn: "Unmet demand request not found",
				errorAr: "طلب المنتج غير المتوفر غير موجود"
			};
			const nextState = computeUnmetDemandFulfillmentState({
				requestedBaseUnits: Math.max(1, Math.round(Number(req.requestedBaseUnits || req.requestedQuantity || 1))),
				fulfillments: req.fulfillments || [],
				isCancelled: true
			});
			const updatedRecord = {
				...req,
				fulfillmentStatus: nextState.fulfillmentStatus,
				fulfilledBaseUnits: nextState.fulfilledBaseUnits,
				remainingUnfulfilledBaseUnits: nextState.remainingUnfulfilledBaseUnits,
				notes: req.notes ? `${req.notes} | [CANCELLED: ${cleanReason}]` : `[CANCELLED: ${cleanReason}]`
			};
			setUnmetDemandRequests((prev) => prev.map((r) => r.id === req.id ? updatedRecord : r));
			if (workspaceMode === "PRODUCTION" && currentUser.id && currentUser.id !== "unassigned-operator") fetch(`/api/unmet-demand/requests/${encodeURIComponent(req.id)}/cancel`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					"x-user-id": currentUser.id
				},
				body: JSON.stringify({
					status: "cancelled",
					reason: cleanReason
				})
			}).catch(() => {});
			triggerHaptic("light", settings.hapticsEnabled);
			return {
				ok: true,
				record: updatedRecord
			};
		}, [
			unmetDemandRequests,
			workspaceMode,
			currentUser.id,
			settings.hapticsEnabled,
			setUnmetDemandRequests
		]),
		reverseUnmetDemandBySale: (0, import_react.useCallback)((saleId) => {
			if (!saleId) return;
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			setUnmetDemandRequests((prev) => prev.map((req) => {
				if (!Array.isArray(req.fulfillments) || !req.fulfillments.some((f) => (f.saleTransactionId === saleId || f.saleId === saleId) && f.status === "active")) return req;
				const nextLinks = req.fulfillments.map((f) => (f.saleTransactionId === saleId || f.saleId === saleId) && f.status === "active" ? {
					...f,
					status: "reversed_by_void",
					reversedAt: nowIso,
					reversalReferenceId: saleId
				} : f);
				const nextState = computeUnmetDemandFulfillmentState({
					requestedBaseUnits: Math.max(1, Math.round(Number(req.requestedBaseUnits || req.requestedQuantity || 1))),
					fulfillments: nextLinks,
					isCancelled: req.fulfillmentStatus === "cancelled"
				});
				return {
					...req,
					fulfillments: nextLinks,
					fulfilledBaseUnits: nextState.fulfilledBaseUnits,
					remainingUnfulfilledBaseUnits: nextState.remainingUnfulfilledBaseUnits,
					fulfillmentStatus: nextState.fulfillmentStatus,
					lastFulfilledAt: nextState.lastFulfilledAt
				};
			}));
			if (workspaceMode === "PRODUCTION" && currentUser.id && currentUser.id !== "unassigned-operator") fetch(`/api/unmet-demand/sales/${encodeURIComponent(saleId)}/reverse-fulfillment`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-user-id": currentUser.id
				},
				body: JSON.stringify({
					reversalType: "void",
					referenceId: saleId
				})
			}).catch(() => {});
		}, [
			workspaceMode,
			currentUser.id,
			setUnmetDemandRequests
		])
	};
}
// src/lib/backup-merge-engine.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var ALL_BACKUP_MODULE_IDS = [
	"company_settings",
	"currencies",
	"branches",
	"employees_permissions",
	"uom_custom_fields",
	"categories",
	"products",
	"customers",
	"suppliers",
	"inventory",
	"purchases",
	"sales",
	"expenses",
	"accounting",
	"intelligence_audit"
];
var BACKUP_MODULE_DEFINITIONS = [
	{
		id: "company_settings",
		labelEn: "Company Profile, Store & Invoice Branding",
		labelAr: "ملف الشركة وإعدادات المتجر والفواتير والشعار",
		descriptionEn: "Company legal profile, tax policy, receipt header/footer, and store logo.",
		descriptionAr: "بيانات الشركة، الرقم الضريبي، ترويسة وتذييل الفاتورة، وشعار المتجر.",
		hardDependencies: [],
		softDependencies: ["currencies"]
	},
	{
		id: "currencies",
		labelEn: "Currencies & Exchange Rate History",
		labelAr: "العملات وسجل أسعار الصرف التاريخية",
		descriptionEn: "Configured base and secondary currencies with historical exchange-rate records.",
		descriptionAr: "العملة الأساسية والعملات الإضافية وسجل تغيرات أسعار الصرف.",
		hardDependencies: [],
		softDependencies: []
	},
	{
		id: "branches",
		labelEn: "Branches & Locations",
		labelAr: "الفروع والمواقع",
		descriptionEn: "Company branches, branch codes, and contact details.",
		descriptionAr: "فروع الشركة وأكوادها وعناوينها.",
		hardDependencies: ["company_settings"],
		softDependencies: []
	},
	{
		id: "employees_permissions",
		labelEn: "Employees, Roles & Permissions (Zero Credentials)",
		labelAr: "الموظفون والأدوار والصلاحيات (بدون كلمات المرور)",
		descriptionEn: "Employee profiles, branch assignments, and RBAC capabilities (passwords & tokens stripped).",
		descriptionAr: "ملفات الموظفين والفروع المعينة والصلاحيات التفصيلية (بدون كلمات المرور أو الجلسات).",
		hardDependencies: ["branches"],
		softDependencies: ["company_settings"]
	},
	{
		id: "uom_custom_fields",
		labelEn: "Units of Measurement & Custom Product Fields",
		labelAr: "وحدات القياس والحقول المخصصة للمنتجات",
		descriptionEn: "Units of measure (UOM), conversion definitions, and custom product field schemas.",
		descriptionAr: "وحدات القياس ومعاملات التحويل وتعريفات الحقول الإضافية.",
		hardDependencies: [],
		softDependencies: []
	},
	{
		id: "categories",
		labelEn: "Product Categories",
		labelAr: "فئات وتصنيفات المنتجات",
		descriptionEn: "Product categories and classification slugs.",
		descriptionAr: "تصنيفات وأقسام المنتجات.",
		hardDependencies: [],
		softDependencies: []
	},
	{
		id: "products",
		labelEn: "Products, Barcodes & UOM Conversions",
		labelAr: "المنتجات والباركودات المتعددة ووحدات البيع",
		descriptionEn: "Full product catalog, primary/additional barcodes, unit conversions, and custom field values.",
		descriptionAr: "دليل المنتجات الكامل، الباركود الأساسي والإضافي، أسعار الوحدات، والحقول المخصصة.",
		hardDependencies: ["categories", "uom_custom_fields"],
		softDependencies: ["currencies", "branches"]
	},
	{
		id: "customers",
		labelEn: "Customers & Receivables Directory",
		labelAr: "سجل العملاء والذمم والولاء",
		descriptionEn: "Customer profiles, contact numbers, loyalty points, and credit balances.",
		descriptionAr: "بيانات العملاء، أرقام الهواتف، نقاط الولاء، وأرصدة الديون.",
		hardDependencies: [],
		softDependencies: []
	},
	{
		id: "suppliers",
		labelEn: "Suppliers Directory",
		labelAr: "سجل الموردين",
		descriptionEn: "Suppliers, tax numbers, and contact details.",
		descriptionAr: "بيانات الموردين والأرقام الضريبية وبيانات التواصل.",
		hardDependencies: [],
		softDependencies: []
	},
	{
		id: "inventory",
		labelEn: "Inventory Balances, Stock Movements & Transfers",
		labelAr: "أرصدة المخزون والحركات المخزنية والتحويلات",
		descriptionEn: "Stock balances, audit movements, goods receipts, and inter-branch stock transfers.",
		descriptionAr: "أرصدة المخزون، سجل الحركات المخزنية، التسويات، والتحويلات بين الفروع.",
		hardDependencies: [
			"products",
			"branches",
			"uom_custom_fields"
		],
		softDependencies: ["suppliers"]
	},
	{
		id: "purchases",
		labelEn: "Purchase Orders & Supplier Invoices",
		labelAr: "أوامر وفواتير المشتريات",
		descriptionEn: "Purchase orders, supplier invoices, and purchase line items.",
		descriptionAr: "أوامر الشراء وفواتير الموردين وتفاصيل الأصناف المشتراة.",
		hardDependencies: [
			"products",
			"suppliers",
			"branches",
			"currencies"
		],
		softDependencies: ["inventory", "accounting"]
	},
	{
		id: "sales",
		labelEn: "Sales, Invoices, Payments, Debt Settlements & Returns",
		labelAr: "المبيعات والفواتير والمدفوعات وتسديدات الديون والمرتجعات",
		descriptionEn: "POS sales transactions, line items, payment records, debt settlements, returns, and locked exchange-rate snapshots.",
		descriptionAr: "فواتير المبيعات، الأصناف المباعة، الدفعات، تحصيل الديون، المرتجعات،ولقطات أسعار الصرف التاريخية.",
		hardDependencies: [
			"products",
			"categories",
			"branches",
			"currencies"
		],
		softDependencies: [
			"customers",
			"accounting",
			"employees_permissions"
		]
	},
	{
		id: "expenses",
		labelEn: "Operating Expenses",
		labelAr: "المصروفات التشغيلية",
		descriptionEn: "Recorded store operating expenses and expense categories.",
		descriptionAr: "المصروفات التشغيلية المسجلة وتصنيفاتها.",
		hardDependencies: ["currencies", "branches"],
		softDependencies: ["accounting"]
	},
	{
		id: "accounting",
		labelEn: "Chart of Accounts & Journal Entries",
		labelAr: "دليل الحسابات والقيود اليومية المحاسبية",
		descriptionEn: "Custom chart of accounts and double-entry accounting journal entries.",
		descriptionAr: "شجرة الحسابات المخصصة والقيود المحاسبية المزدوجة.",
		hardDependencies: ["currencies"],
		softDependencies: [
			"sales",
			"purchases",
			"expenses"
		]
	},
	{
		id: "intelligence_audit",
		labelEn: "Unmet Demand, Intelligence Lifecycle & Audit Logs",
		labelAr: "الطلبات غير المتوفرة ودورة حياة التنبيهات وسجل التدقيق",
		descriptionEn: "Customer unmet demand records, intelligence alert workflow states, and security audit trail.",
		descriptionAr: "سجل طلبات العملاء غير المتوفرة، حالات معالجة التنبيهات الذكية، وسجل التدقيق الأمني.",
		hardDependencies: ["branches", "products"],
		softDependencies: ["customers"]
	}
];
function resolveBackupModuleDependencies(selectedModules, options) {
	const autoInclude = options?.autoIncludeHardDependencies ?? true;
	const requestedSet = new Set(selectedModules.filter((m) => ALL_BACKUP_MODULE_IDS.includes(m)));
	const finalSet = new Set(requestedSet);
	const autoIncludedSet = /* @__PURE__ */ new Set();
	const warningsEn = [];
	const warningsAr = [];
	const defMap = new Map(BACKUP_MODULE_DEFINITIONS.map((d) => [d.id, d]));
	if (autoInclude) {
		let added = true;
		while (added) {
			added = false;
			for (const modId of Array.from(finalSet)) {
				const def = defMap.get(modId);
				if (!def) continue;
				for (const dep of def.hardDependencies) if (!finalSet.has(dep)) {
					finalSet.add(dep);
					autoIncludedSet.add(dep);
					added = true;
				}
			}
		}
	} else for (const modId of Array.from(requestedSet)) {
		const def = defMap.get(modId);
		if (!def) continue;
		for (const dep of def.hardDependencies) if (!requestedSet.has(dep)) {
			const depDef = defMap.get(dep);
			warningsEn.push(`Module "${def.labelEn}" requires "${depDef?.labelEn || dep}" for full referential integrity.`);
			warningsAr.push(`قسم "${def.labelAr}" يعتمد على "${depDef?.labelAr || dep}" لضمان سلامة الروابط المرجعية.`);
		}
	}
	for (const modId of Array.from(finalSet)) {
		const def = defMap.get(modId);
		if (!def) continue;
		for (const softDep of def.softDependencies) if (!finalSet.has(softDep)) {
			const softDef = defMap.get(softDep);
			warningsEn.push(`Note: "${def.labelEn}" is exported without optional related module "${softDef?.labelEn || softDep}".`);
			warningsAr.push(`ملاحظة: تم تضمين "${def.labelAr}" بدون القسم المرتبط الاختياري "${softDef?.labelAr || softDep}".`);
		}
	}
	const modulesIncluded = ALL_BACKUP_MODULE_IDS.filter((m) => finalSet.has(m));
	const autoIncludedDependencies = ALL_BACKUP_MODULE_IDS.filter((m) => autoIncludedSet.has(m));
	return {
		requestedModules: ALL_BACKUP_MODULE_IDS.filter((m) => requestedSet.has(m)),
		modulesIncluded,
		autoIncludedDependencies,
		dependencyWarnings: warningsEn,
		dependencyWarningsAr: warningsAr
	};
}
function scrubSensitiveUserFields(user) {
	if (!user || typeof user !== "object") return {
		id: "unknown",
		name: "Employee",
		role: "cashier",
		terminalName: "POS Terminal",
		avatarColor: "#3b82f6",
		isActive: true,
		permissions: deriveLegacyPermissionsFromCapabilities(getDefaultCapabilitiesForRole("CASHIER")),
		lastActiveAt: (/* @__PURE__ */ new Date()).toISOString(),
		requiresCredentialSetup: true
	};
	const clone = { ...user };
	delete clone.passwordHash;
	delete clone.passwordSalt;
	delete clone.password;
	delete clone.confirmPassword;
	delete clone.pin;
	delete clone.pinCode;
	delete clone.pinHash;
	delete clone.pinSalt;
	delete clone.sessionToken;
	delete clone.tokenHash;
	clone.hasPassword = false;
	clone.requiresCredentialSetup = true;
	return clone;
}
function computeBackupModuleRecordCounts(payload, modulesIncluded) {
	const inc = new Set(modulesIncluded);
	const counts = {
		company_settings: inc.has("company_settings") && payload.companyProfile ? 1 : 0,
		currencies: inc.has("currencies") ? (payload.currencies?.length || 0) + (payload.exchangeRateItems?.length || 0) : 0,
		branches: inc.has("branches") ? payload.branches?.length || 0 : 0,
		employees_permissions: inc.has("employees_permissions") ? payload.employees?.length || 0 : 0,
		uom_custom_fields: inc.has("uom_custom_fields") ? (payload.unitsOfMeasure?.length || 0) + (payload.customFieldDefinitions?.length || 0) : 0,
		categories: inc.has("categories") ? payload.categories?.length || 0 : 0,
		products: inc.has("products") ? payload.products?.length || 0 : 0,
		customers: inc.has("customers") ? payload.customers?.length || 0 : 0,
		suppliers: inc.has("suppliers") ? payload.suppliers?.length || 0 : 0,
		inventory: inc.has("inventory") ? (payload.stockMovements?.length || 0) + (payload.branchTransfers?.length || 0) : 0,
		purchases: inc.has("purchases") ? payload.purchases?.length || 0 : 0,
		sales: inc.has("sales") ? payload.transactions?.length || 0 : 0,
		expenses: inc.has("expenses") ? payload.expenses?.length || 0 : 0,
		accounting: inc.has("accounting") ? (payload.accounts?.length || 0) + (payload.journalEntries?.length || 0) : 0,
		intelligence_audit: inc.has("intelligence_audit") ? (payload.unmetDemandRequests?.length || 0) + (payload.intelligenceLifecycleItems?.length || 0) + (payload.auditLogs?.length || 0) : 0
	};
	return {
		recordCounts: counts,
		totalRecords: Object.values(counts).reduce((sum, n) => sum + n, 0)
	};
}
function filterPayloadByIncludedModules(fullPayload, modulesIncluded) {
	const inc = new Set(modulesIncluded);
	return {
		companyProfile: fullPayload.companyProfile,
		storeSettings: inc.has("company_settings") ? fullPayload.storeSettings : void 0,
		invoiceSettings: inc.has("company_settings") ? fullPayload.invoiceSettings : void 0,
		currencies: inc.has("currencies") ? fullPayload.currencies || [] : [],
		exchangeRates: inc.has("currencies") ? fullPayload.exchangeRates || { SDG: 1 } : { SDG: 1 },
		exchangeRateItems: inc.has("currencies") ? fullPayload.exchangeRateItems || [] : [],
		exchangeRateHistory: inc.has("currencies") ? fullPayload.exchangeRateHistory || [] : [],
		branches: inc.has("branches") ? fullPayload.branches || [] : [],
		employees: inc.has("employees_permissions") ? (fullPayload.employees || []).map((u) => scrubSensitiveUserFields(u)) : [],
		unitsOfMeasure: inc.has("uom_custom_fields") ? fullPayload.unitsOfMeasure || [] : [],
		customFieldDefinitions: inc.has("uom_custom_fields") ? fullPayload.customFieldDefinitions || [] : [],
		categories: inc.has("categories") ? fullPayload.categories || [] : [],
		products: inc.has("products") ? fullPayload.products || [] : [],
		customers: inc.has("customers") ? fullPayload.customers || [] : [],
		suppliers: inc.has("suppliers") ? fullPayload.suppliers || [] : [],
		stockMovements: inc.has("inventory") ? fullPayload.stockMovements || [] : [],
		branchTransfers: inc.has("inventory") ? fullPayload.branchTransfers || [] : [],
		purchases: inc.has("purchases") ? fullPayload.purchases || [] : [],
		transactions: inc.has("sales") ? fullPayload.transactions || [] : [],
		expenses: inc.has("expenses") ? fullPayload.expenses || [] : [],
		accounts: inc.has("accounting") ? fullPayload.accounts || [] : [],
		journalEntries: inc.has("accounting") ? fullPayload.journalEntries || [] : [],
		unmetDemandRequests: inc.has("intelligence_audit") ? fullPayload.unmetDemandRequests || [] : [],
		intelligenceLifecycleItems: inc.has("intelligence_audit") ? fullPayload.intelligenceLifecycleItems || [] : [],
		auditLogs: inc.has("intelligence_audit") ? fullPayload.auditLogs || [] : []
	};
}
function normalizeEasternArabicDigits(input) {
	return input.replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 1632)).replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 1776));
}
function normalizeEntityName(raw) {
	if (!raw) return "";
	return normalizeEasternArabicDigits(String(raw)).normalize("NFKC").replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}
function normalizeCode(raw) {
	if (!raw) return "";
	return normalizeEasternArabicDigits(String(raw)).trim().toUpperCase().replace(/\s+/g, "");
}
function normalizePhone(raw) {
	if (!raw) return "";
	let digits = normalizeEasternArabicDigits(String(raw)).replace(/\D/g, "");
	if (!digits) return "";
	if (digits.startsWith("00249")) digits = digits.slice(5);
	else if (digits.startsWith("249") && digits.length >= 11) digits = digits.slice(3);
	else if (digits.startsWith("0") && digits.length >= 9) digits = digits.slice(1);
	return digits;
}
function normalizeEmail(raw) {
	if (!raw) return "";
	return String(raw).trim().toLowerCase();
}
function computeStringSimilarity(a, b) {
	const normA = normalizeEntityName(a);
	const normB = normalizeEntityName(b);
	if (!normA || !normB) return 0;
	if (normA === normB) return 1;
	if (normA.length < 2 || normB.length < 2) return normA === normB ? 1 : 0;
	const bigramsA = /* @__PURE__ */ new Map();
	for (let i = 0; i < normA.length - 1; i++) {
		const bg = normA.slice(i, i + 2);
		bigramsA.set(bg, (bigramsA.get(bg) || 0) + 1);
	}
	let intersection = 0;
	for (let i = 0; i < normB.length - 1; i++) {
		const bg = normB.slice(i, i + 2);
		const count = bigramsA.get(bg) || 0;
		if (count > 0) {
			bigramsA.set(bg, count - 1);
			intersection++;
		}
	}
	return 2 * intersection / (normA.length - 1 + (normB.length - 1));
}
function getAllProductBarcodes(p) {
	const codes = /* @__PURE__ */ new Set();
	if (p.barcode && String(p.barcode).trim()) codes.add(normalizeCode(p.barcode));
	if (Array.isArray(p.barcodes)) {
		for (const b of p.barcodes) if (b && String(b).trim()) codes.add(normalizeCode(b));
	}
	if (Array.isArray(p.additionalBarcodes)) for (const b of p.additionalBarcodes) {
		const val = typeof b === "string" ? b : b?.barcode;
		if (val && String(val).trim()) codes.add(normalizeCode(val));
	}
	return Array.from(codes);
}
function analyzeBackupMergePreview(incomingPayload, targetDataset, modulesIncluded) {
	const activeModules = new Set(modulesIncluded && modulesIncluded.length > 0 ? modulesIncluded : ALL_BACKUP_MODULE_IDS);
	const items = [];
	const targetBaseCurr = normalizeCode(targetDataset.companyProfile?.baseCurrency || "SDG");
	const incomingBaseCurr = normalizeCode(incomingPayload.companyProfile?.baseCurrency || "");
	const hasBaseCurrencyConflict = Boolean(incomingBaseCurr && targetBaseCurr && incomingBaseCurr !== targetBaseCurr);
	if (activeModules.has("categories")) {
		const existingCats = targetDataset.categories || [];
		for (const inc of incomingPayload.categories || []) {
			const incSlug = normalizeCode(inc.slug || inc.name);
			const incName = normalizeEntityName(inc.name);
			const incNameAr = normalizeEntityName(inc.nameAr);
			const exactById = existingCats.find((e) => e.id === inc.id);
			const bySlugOrName = existingCats.find((e) => normalizeCode(e.slug || e.name) === incSlug || incName && normalizeEntityName(e.name) === incName || incNameAr && normalizeEntityName(e.nameAr) === incNameAr);
			const matched = exactById || bySlugOrName || null;
			let classification = "NO_MATCH";
			let recommendedAction = "IMPORT_AS_NEW";
			let matchedByField = null;
			if (matched) {
				matchedByField = exactById ? "id" : "name/slug";
				const sameName = normalizeEntityName(matched.name) === incName && normalizeEntityName(matched.nameAr || "") === incNameAr;
				classification = sameName ? "EXACT_MATCH" : "STRONG_MATCH";
				recommendedAction = sameName ? "KEEP_EXISTING" : "MERGE";
			}
			items.push({
				itemKey: `categories:${inc.id}`,
				moduleId: "categories",
				entityType: "category",
				sourceId: inc.id,
				matchedTargetId: matched?.id || null,
				displayName: inc.nameAr ? `${inc.name} (${inc.nameAr})` : inc.name,
				naturalKeyLabel: inc.slug || inc.name,
				classification,
				matchedByField,
				similarityScore: matched ? 1 : 0,
				recommendedAction,
				existingSummary: matched ? {
					id: matched.id,
					name: matched.name,
					nameAr: matched.nameAr
				} : void 0,
				incomingSummary: {
					id: inc.id,
					name: inc.name,
					nameAr: inc.nameAr
				}
			});
		}
	}
	if (activeModules.has("products")) {
		const existingProds = targetDataset.products || [];
		for (const inc of incomingPayload.products || []) {
			const incBarcodes = getAllProductBarcodes(inc);
			const incSku = normalizeCode(inc.sku);
			const incName = normalizeEntityName(inc.name);
			const incNameAr = normalizeEntityName(inc.nameAr);
			const byBarcode = incBarcodes.length > 0 ? existingProds.find((e) => {
				const eCodes = getAllProductBarcodes(e);
				return incBarcodes.some((code) => eCodes.includes(code));
			}) : void 0;
			const bySku = !byBarcode && incSku ? existingProds.find((e) => normalizeCode(e.sku) === incSku) : void 0;
			const byId = !byBarcode && !bySku ? existingProds.find((e) => e.id === inc.id) : void 0;
			let byNameFuzzy;
			let bestSim = 0;
			if (!byBarcode && !bySku && !byId) for (const e of existingProds) {
				const simEn = computeStringSimilarity(inc.name, e.name);
				const simAr = incNameAr && e.nameAr ? computeStringSimilarity(inc.nameAr, e.nameAr) : 0;
				const sim = Math.max(simEn, simAr);
				if (sim > bestSim) {
					bestSim = sim;
					if (sim >= .88) byNameFuzzy = e;
				}
			}
			const matched = byBarcode || bySku || byId || byNameFuzzy || null;
			let classification = "NO_MATCH";
			let recommendedAction = "IMPORT_AS_NEW";
			let matchedByField = null;
			let conflictReasonEn;
			let conflictReasonAr;
			let similarityScore = 0;
			if (byBarcode || bySku || byId) {
				matchedByField = byBarcode ? "barcode" : bySku ? "sku" : "id";
				const nameSim = Math.max(computeStringSimilarity(inc.name, matched.name), computeStringSimilarity(inc.nameAr || inc.name, matched.nameAr || matched.name));
				similarityScore = nameSim;
				if (nameSim < .35) {
					classification = "CONFLICTING_RECORD";
					recommendedAction = "KEEP_EXISTING";
					conflictReasonEn = `Incoming product "${inc.name}" shares ${matchedByField.toUpperCase()} with existing product "${matched.name}" but has a different name.`;
					conflictReasonAr = `المنتج الوارد "${inc.nameAr || inc.name}" يشترك في (${matchedByField.toUpperCase()}) مع المنتج الحالي "${matched.nameAr || matched.name}" ولكن باسم مختلف تماماً.`;
				} else {
					const identicalPricesAndMeta = Number(matched.sellingPrice) === Number(inc.sellingPrice) && Number(matched.costPrice) === Number(inc.costPrice) && normalizeEntityName(matched.name) === incName;
					classification = identicalPricesAndMeta ? "EXACT_MATCH" : "STRONG_MATCH";
					recommendedAction = identicalPricesAndMeta ? "KEEP_EXISTING" : "MERGE";
				}
			} else if (byNameFuzzy) {
				matchedByField = "name+category";
				similarityScore = bestSim;
				classification = "POSSIBLE_MATCH";
				recommendedAction = "MERGE";
				conflictReasonEn = `Similar product name (${Math.round(bestSim * 100)}% match) with different SKU/Barcode (${inc.sku} vs ${byNameFuzzy.sku}).`;
				conflictReasonAr = `تشابه في اسم المنتج (${Math.round(bestSim * 100)}%) مع اختلاف رمز SKU أو الباركود (${inc.sku} مقابل ${byNameFuzzy.sku}).`;
			}
			items.push({
				itemKey: `products:${inc.id}`,
				moduleId: "products",
				entityType: "product",
				sourceId: inc.id,
				matchedTargetId: matched?.id || null,
				displayName: inc.nameAr ? `${inc.name} — ${inc.nameAr}` : inc.name,
				naturalKeyLabel: `SKU: ${inc.sku || "—"} | Barcode: ${inc.barcode || "—"}`,
				classification,
				matchedByField,
				similarityScore,
				recommendedAction,
				conflictReasonEn,
				conflictReasonAr,
				existingSummary: matched ? {
					id: matched.id,
					name: matched.name,
					sku: matched.sku,
					barcode: matched.barcode,
					sellingPrice: matched.sellingPrice,
					costPrice: matched.costPrice,
					stock: matched.stock
				} : void 0,
				incomingSummary: {
					id: inc.id,
					name: inc.name,
					sku: inc.sku,
					barcode: inc.barcode,
					sellingPrice: inc.sellingPrice,
					costPrice: inc.costPrice,
					stock: inc.stock
				}
			});
		}
	}
	if (activeModules.has("customers")) {
		const existingCusts = targetDataset.customers || [];
		for (const inc of incomingPayload.customers || []) {
			const incPhone = normalizePhone(inc.phone);
			const incEmail = normalizeEmail(inc.email);
			const incName = normalizeEntityName(inc.name);
			const byPhone = incPhone.length >= 6 ? existingCusts.find((e) => normalizePhone(e.phone) === incPhone) : void 0;
			const byEmail = !byPhone && incEmail ? existingCusts.find((e) => normalizeEmail(e.email) === incEmail) : void 0;
			const byId = !byPhone && !byEmail ? existingCusts.find((e) => e.id === inc.id) : void 0;
			const byName = !byPhone && !byEmail && !byId && incName ? existingCusts.find((e) => normalizeEntityName(e.name) === incName) : void 0;
			const matched = byPhone || byEmail || byId || byName || null;
			let classification = "NO_MATCH";
			let recommendedAction = "IMPORT_AS_NEW";
			let matchedByField = null;
			if (byPhone || byEmail || byId) {
				matchedByField = byPhone ? "phone" : byEmail ? "email" : "id";
				classification = normalizeEntityName(matched.name) === incName ? "EXACT_MATCH" : "STRONG_MATCH";
				recommendedAction = "MERGE";
			} else if (byName) {
				matchedByField = "name";
				classification = "POSSIBLE_MATCH";
				recommendedAction = "MERGE";
			}
			items.push({
				itemKey: `customers:${inc.id}`,
				moduleId: "customers",
				entityType: "customer",
				sourceId: inc.id,
				matchedTargetId: matched?.id || null,
				displayName: inc.name,
				naturalKeyLabel: `Phone: ${inc.phone || "—"} | Email: ${inc.email || "—"}`,
				classification,
				matchedByField,
				similarityScore: matched ? 1 : 0,
				recommendedAction,
				existingSummary: matched ? {
					id: matched.id,
					name: matched.name,
					phone: matched.phone,
					totalSpent: matched.totalSpent
				} : void 0,
				incomingSummary: {
					id: inc.id,
					name: inc.name,
					phone: inc.phone,
					totalSpent: inc.totalSpent
				}
			});
		}
	}
	if (activeModules.has("suppliers")) {
		const existingSups = targetDataset.suppliers || [];
		for (const inc of incomingPayload.suppliers || []) {
			const incTax = normalizeCode(inc.taxNumber);
			const incPhone = normalizePhone(inc.phone);
			const incName = normalizeEntityName(inc.name);
			const byTax = incTax.length >= 3 ? existingSups.find((e) => normalizeCode(e.taxNumber) === incTax) : void 0;
			const byPhone = !byTax && incPhone.length >= 6 ? existingSups.find((e) => normalizePhone(e.phone) === incPhone) : void 0;
			const byName = !byTax && !byPhone && incName ? existingSups.find((e) => normalizeEntityName(e.name) === incName) : void 0;
			const matched = byTax || byPhone || byName || null;
			let classification = "NO_MATCH";
			let recommendedAction = "IMPORT_AS_NEW";
			let matchedByField = null;
			if (byTax || byPhone) {
				matchedByField = byTax ? "taxNumber" : "phone";
				classification = normalizeEntityName(matched.name) === incName ? "EXACT_MATCH" : "STRONG_MATCH";
				recommendedAction = "MERGE";
			} else if (byName) {
				matchedByField = "name";
				classification = "POSSIBLE_MATCH";
				recommendedAction = "MERGE";
			}
			items.push({
				itemKey: `suppliers:${inc.id}`,
				moduleId: "suppliers",
				entityType: "supplier",
				sourceId: inc.id,
				matchedTargetId: matched?.id || null,
				displayName: inc.name,
				naturalKeyLabel: `Tax: ${inc.taxNumber || "—"} | Phone: ${inc.phone || "—"}`,
				classification,
				matchedByField,
				similarityScore: matched ? 1 : 0,
				recommendedAction,
				existingSummary: matched ? {
					id: matched.id,
					name: matched.name,
					phone: matched.phone
				} : void 0,
				incomingSummary: {
					id: inc.id,
					name: inc.name,
					phone: inc.phone
				}
			});
		}
	}
	if (activeModules.has("currencies")) {
		const existingCurrs = targetDataset.currencies || [];
		for (const inc of incomingPayload.currencies || []) {
			const code = normalizeCode(inc.code);
			const matched = existingCurrs.find((e) => normalizeCode(e.code) === code) || null;
			const isBaseConflict = Boolean(inc.isBase && hasBaseCurrencyConflict);
			items.push({
				itemKey: `currencies:${code}`,
				moduleId: "currencies",
				entityType: "currency",
				sourceId: code,
				matchedTargetId: matched?.code || null,
				displayName: `${code} — ${inc.nameAr || inc.name}`,
				naturalKeyLabel: `ISO: ${code}${inc.isBase ? " (Incoming Base)" : ""}`,
				classification: isBaseConflict ? "CONFLICTING_RECORD" : matched ? "EXACT_MATCH" : "NO_MATCH",
				matchedByField: matched ? "code" : null,
				similarityScore: matched ? 1 : 0,
				recommendedAction: matched ? "KEEP_EXISTING" : "IMPORT_AS_NEW",
				conflictReasonEn: isBaseConflict ? `Backup currency ${code} is marked as base currency, but target company uses ${targetBaseCurr}. Target base currency ${targetBaseCurr} will be preserved.` : void 0,
				conflictReasonAr: isBaseConflict ? `عملة النسخة الاحتياطية (${code}) محددة كعملة أساسية، بينما العملة الأساسية للشركة الحالية هي (${targetBaseCurr}). سيتم الحفاظ على العملة الأساسية الحالية.` : void 0,
				existingSummary: matched ? {
					code: matched.code,
					isBase: matched.isBase
				} : void 0,
				incomingSummary: {
					code: inc.code,
					isBase: inc.isBase
				}
			});
		}
	}
	if (activeModules.has("branches")) {
		const existingBranches = targetDataset.branches || [];
		for (const inc of incomingPayload.branches || []) {
			const incCode = normalizeCode(inc.code);
			const incName = normalizeEntityName(inc.name);
			const matched = existingBranches.find((e) => normalizeCode(e.code) === incCode || normalizeEntityName(e.name) === incName || e.id === inc.id) || null;
			items.push({
				itemKey: `branches:${inc.id}`,
				moduleId: "branches",
				entityType: "branch",
				sourceId: inc.id,
				matchedTargetId: matched?.id || null,
				displayName: inc.nameAr ? `${inc.name} (${inc.nameAr})` : inc.name,
				naturalKeyLabel: `Code: ${inc.code}`,
				classification: matched ? "EXACT_MATCH" : "NO_MATCH",
				matchedByField: matched ? "code/name" : null,
				similarityScore: matched ? 1 : 0,
				recommendedAction: matched ? "KEEP_EXISTING" : "IMPORT_AS_NEW"
			});
		}
	}
	if (activeModules.has("employees_permissions")) {
		const existingUsers = targetDataset.employees || [];
		for (const inc of incomingPayload.employees || []) {
			const incUser = normalizeCode(inc.username || inc.id);
			const incEmail = normalizeEmail(inc.email);
			const matched = existingUsers.find((e) => normalizeCode(e.username || e.id) === incUser || incEmail && normalizeEmail(e.email) === incEmail || e.id === inc.id) || null;
			items.push({
				itemKey: `employees_permissions:${inc.id}`,
				moduleId: "employees_permissions",
				entityType: "employee",
				sourceId: inc.id,
				matchedTargetId: matched?.id || null,
				displayName: inc.nameAr ? `${inc.name} (${inc.nameAr})` : inc.name,
				naturalKeyLabel: `User: ${inc.username || inc.id} | Role: ${inc.systemRole || inc.role}`,
				classification: matched ? "STRONG_MATCH" : "NO_MATCH",
				matchedByField: matched ? "username" : null,
				similarityScore: matched ? 1 : 0,
				recommendedAction: matched ? "KEEP_EXISTING" : "IMPORT_AS_NEW"
			});
		}
	}
	if (activeModules.has("sales")) {
		const existingTxs = targetDataset.transactions || [];
		for (const inc of incomingPayload.transactions || []) {
			const matched = existingTxs.find((e) => e.id === inc.id || inc.idempotencyKey && e.idempotencyKey === inc.idempotencyKey) || null;
			let classification = "NO_MATCH";
			let recommendedAction = "IMPORT_AS_NEW";
			let conflictReasonEn;
			let conflictReasonAr;
			if (matched) {
				if (Math.abs(Number(matched.grandTotal) - Number(inc.grandTotal)) < .01) {
					classification = "EXACT_MATCH";
					recommendedAction = "SKIP";
				} else {
					classification = "CONFLICTING_RECORD";
					recommendedAction = "KEEP_EXISTING";
					conflictReasonEn = `Invoice #${inc.id} already exists with grandTotal ${matched.grandTotal} vs incoming ${inc.grandTotal}. Posted invoices are protected against overwrite.`;
					conflictReasonAr = `الفاتورة رقم #${inc.id} موجودة مسبقاً بإجمالي (${matched.grandTotal}) مقابل (${inc.grandTotal}) في النسخة الواردة. الفواتير المرحلة محمية من الكتابة الفوقية.`;
				}
			}
			items.push({
				itemKey: `sales:${inc.id}`,
				moduleId: "sales",
				entityType: "transaction",
				sourceId: inc.id,
				matchedTargetId: matched?.id || null,
				displayName: `Invoice #${inc.id} (${inc.customerName || "Walk-in"})`,
				naturalKeyLabel: `Total: ${inc.grandTotal} ${inc.currency || "SDG"} | ${inc.timestamp?.slice(0, 10) || ""}`,
				classification,
				matchedByField: matched ? "transactionId" : null,
				similarityScore: matched ? 1 : 0,
				recommendedAction,
				conflictReasonEn,
				conflictReasonAr,
				existingSummary: matched ? {
					id: matched.id,
					grandTotal: matched.grandTotal,
					status: matched.status
				} : void 0,
				incomingSummary: {
					id: inc.id,
					grandTotal: inc.grandTotal,
					status: inc.status
				}
			});
		}
	}
	if (activeModules.has("inventory")) {
		const existingMovs = targetDataset.stockMovements || [];
		for (const inc of incomingPayload.stockMovements || []) {
			const matched = existingMovs.find((e) => e.id === inc.id || e.productId === inc.productId && e.type === inc.type && e.timestamp === inc.timestamp && e.quantityChange === inc.quantityChange) || null;
			items.push({
				itemKey: `inventory:${inc.id}`,
				moduleId: "inventory",
				entityType: "stock_movement",
				sourceId: inc.id,
				matchedTargetId: matched?.id || null,
				displayName: `${inc.productName} (${inc.type}: ${inc.quantityChange > 0 ? "+" : ""}${inc.quantityChange})`,
				naturalKeyLabel: `Ref: ${inc.referenceId || inc.id}`,
				classification: matched ? "EXACT_MATCH" : "NO_MATCH",
				matchedByField: matched ? "id/timestamp" : null,
				similarityScore: matched ? 1 : 0,
				recommendedAction: matched ? "SKIP" : "IMPORT_AS_NEW"
			});
		}
	}
	if (activeModules.has("purchases")) {
		const existingPurchases = targetDataset.purchases || [];
		for (const inc of incomingPayload.purchases || []) {
			const matched = existingPurchases.find((e) => e.id === inc.id || normalizeCode(e.purchaseNumber) === normalizeCode(inc.purchaseNumber)) || null;
			items.push({
				itemKey: `purchases:${inc.id}`,
				moduleId: "purchases",
				entityType: "purchase",
				sourceId: inc.id,
				matchedTargetId: matched?.id || null,
				displayName: `PO #${inc.purchaseNumber} (${inc.supplierName || "Supplier"})`,
				naturalKeyLabel: `Total: ${inc.totalAmount}`,
				classification: matched ? "EXACT_MATCH" : "NO_MATCH",
				matchedByField: matched ? "purchaseNumber" : null,
				similarityScore: matched ? 1 : 0,
				recommendedAction: matched ? "SKIP" : "IMPORT_AS_NEW"
			});
		}
	}
	if (activeModules.has("accounting")) {
		const existingAccs = targetDataset.accounts || [];
		for (const inc of incomingPayload.accounts || []) {
			const matched = existingAccs.find((e) => normalizeCode(e.code) === normalizeCode(inc.code) || normalizeEntityName(e.name) === normalizeEntityName(inc.name) || e.id === inc.id) || null;
			items.push({
				itemKey: `accounting:acc:${inc.id}`,
				moduleId: "accounting",
				entityType: "account",
				sourceId: inc.id,
				matchedTargetId: matched?.id || null,
				displayName: `${inc.code} — ${inc.nameAr || inc.name}`,
				naturalKeyLabel: `Code: ${inc.code} (${inc.type})`,
				classification: matched ? "EXACT_MATCH" : "NO_MATCH",
				matchedByField: matched ? "code/name" : null,
				similarityScore: matched ? 1 : 0,
				recommendedAction: matched ? "KEEP_EXISTING" : "IMPORT_AS_NEW"
			});
		}
		const existingJournals = targetDataset.journalEntries || [];
		for (const inc of incomingPayload.journalEntries || []) {
			const matched = existingJournals.find((e) => e.id === inc.id || inc.reference && e.reference === inc.reference && e.date === inc.date) || null;
			items.push({
				itemKey: `accounting:je:${inc.id}`,
				moduleId: "accounting",
				entityType: "journal_entry",
				sourceId: inc.id,
				matchedTargetId: matched?.id || null,
				displayName: `Journal ${inc.reference || inc.id}: ${inc.description}`,
				naturalKeyLabel: `Debit/Credit: ${inc.totalDebit}`,
				classification: matched ? "EXACT_MATCH" : "NO_MATCH",
				matchedByField: matched ? "id/reference" : null,
				similarityScore: matched ? 1 : 0,
				recommendedAction: matched ? "SKIP" : "IMPORT_AS_NEW"
			});
		}
	}
	if (activeModules.has("expenses")) {
		const existingExps = targetDataset.expenses || [];
		for (const inc of incomingPayload.expenses || []) {
			const matched = existingExps.find((e) => e.id === inc.id || normalizeEntityName(e.title) === normalizeEntityName(inc.title) && e.date === inc.date && Number(e.amount) === Number(inc.amount)) || null;
			items.push({
				itemKey: `expenses:${inc.id}`,
				moduleId: "expenses",
				entityType: "expense",
				sourceId: inc.id,
				matchedTargetId: matched?.id || null,
				displayName: `${inc.title} (${inc.amount} ${inc.currency || "SDG"})`,
				naturalKeyLabel: `${inc.category} | ${inc.date?.slice(0, 10) || ""}`,
				classification: matched ? "EXACT_MATCH" : "NO_MATCH",
				matchedByField: matched ? "id/title+date" : null,
				similarityScore: matched ? 1 : 0,
				recommendedAction: matched ? "SKIP" : "IMPORT_AS_NEW"
			});
		}
	}
	const moduleSummaries = {};
	for (const modId of ALL_BACKUP_MODULE_IDS) {
		const modItems = items.filter((i) => i.moduleId === modId);
		moduleSummaries[modId] = {
			moduleId: modId,
			incomingCount: modItems.length,
			existingCount: modId === "products" ? targetDataset.products?.length || 0 : modId === "customers" ? targetDataset.customers?.length || 0 : modId === "categories" ? targetDataset.categories?.length || 0 : modId === "suppliers" ? targetDataset.suppliers?.length || 0 : modId === "sales" ? targetDataset.transactions?.length || 0 : modId === "inventory" ? targetDataset.stockMovements?.length || 0 : modId === "currencies" ? targetDataset.currencies?.length || 0 : modId === "branches" ? targetDataset.branches?.length || 0 : modId === "employees_permissions" ? targetDataset.employees?.length || 0 : modId === "accounting" ? (targetDataset.accounts?.length || 0) + (targetDataset.journalEntries?.length || 0) : modId === "expenses" ? targetDataset.expenses?.length || 0 : modId === "purchases" ? targetDataset.purchases?.length || 0 : 0,
			exactMatches: modItems.filter((i) => i.classification === "EXACT_MATCH").length,
			strongMatches: modItems.filter((i) => i.classification === "STRONG_MATCH").length,
			possibleMatches: modItems.filter((i) => i.classification === "POSSIBLE_MATCH").length,
			noMatchesNew: modItems.filter((i) => i.classification === "NO_MATCH").length,
			conflicts: modItems.filter((i) => i.classification === "CONFLICTING_RECORD").length,
			defaultModuleStrategy: modId === "sales" || modId === "inventory" || modId === "purchases" || modId === "expenses" ? "KEEP_EXISTING" : "MERGE"
		};
	}
	const totals = {
		incomingRecords: items.length,
		exactMatches: items.filter((i) => i.classification === "EXACT_MATCH").length,
		strongMatches: items.filter((i) => i.classification === "STRONG_MATCH").length,
		possibleMatches: items.filter((i) => i.classification === "POSSIBLE_MATCH").length,
		newRecords: items.filter((i) => i.classification === "NO_MATCH").length,
		conflicts: items.filter((i) => i.classification === "CONFLICTING_RECORD").length
	};
	return {
		sourceCompany: {
			companyId: incomingPayload.companyProfile?.id || "unknown",
			code: incomingPayload.companyProfile?.code || "BACKUP",
			legalName: incomingPayload.companyProfile?.legalName || "Backup Company",
			displayName: incomingPayload.companyProfile?.displayName || "Backup Company",
			displayNameAr: incomingPayload.companyProfile?.displayNameAr,
			baseCurrency: incomingPayload.companyProfile?.baseCurrency || null,
			businessType: incomingPayload.companyProfile?.businessType
		},
		targetCompanyId: targetDataset.companyProfile?.id || "target-company",
		targetCompanyName: targetDataset.companyProfile?.displayName || targetDataset.companyProfile?.legalName || "Target Company",
		baseCurrencyConflict: {
			hasConflict: hasBaseCurrencyConflict,
			targetBaseCurrency: targetBaseCurr,
			incomingBaseCurrency: incomingBaseCurr || null,
			resolutionNoteEn: hasBaseCurrencyConflict ? `Target company base currency (${targetBaseCurr}) will be preserved. Incoming base currency (${incomingBaseCurr}) will be imported as a secondary currency.` : `Base currency (${targetBaseCurr}) matches.`,
			resolutionNoteAr: hasBaseCurrencyConflict ? `سيتم الحفاظ على العملة الأساسية للشركة الحالية (${targetBaseCurr}) وإدراج عملة النسخة الاحتياطية (${incomingBaseCurr}) كعملة فرعية.` : `العملة الأساسية (${targetBaseCurr}) متطابقة.`
		},
		totals,
		moduleSummaries,
		items
	};
}
function applyIntelligentBackupMerge(incomingPayload, targetDataset, options = {}) {
	const activeModules = new Set(options.selectedModules && options.selectedModules.length > 0 ? options.selectedModules : ALL_BACKUP_MODULE_IDS);
	const preview = analyzeBackupMergePreview(incomingPayload, targetDataset, Array.from(activeModules));
	const previewItemMap = new Map(preview.items.map((item) => [item.itemKey, item]));
	const result = JSON.parse(JSON.stringify(targetDataset));
	const targetCompanyId = result.companyProfile.id;
	const targetBaseCurr = normalizeCode(result.companyProfile.baseCurrency || "SDG");
	const idRemapTable = {};
	let remappedReferencesCount = 0;
	const summary = {
		insertedCount: 0,
		updatedCount: 0,
		mergedCount: 0,
		keptExistingCount: 0,
		skippedCount: 0,
		remappedReferencesCount: 0,
		byModule: {}
	};
	for (const modId of ALL_BACKUP_MODULE_IDS) summary.byModule[modId] = {
		inserted: 0,
		updated: 0,
		merged: 0,
		kept: 0,
		skipped: 0
	};
	const resolveAction = (itemKey, moduleId, fallback) => {
		if (options.itemResolutions && options.itemResolutions[itemKey]) return options.itemResolutions[itemKey];
		const previewItem = previewItemMap.get(itemKey);
		if (options.moduleStrategies && options.moduleStrategies[moduleId]) {
			const modStrat = options.moduleStrategies[moduleId];
			if (previewItem?.classification === "NO_MATCH" && modStrat !== "SKIP") return "IMPORT_AS_NEW";
			if (moduleId === "sales" && previewItem?.classification === "CONFLICTING_RECORD" && (modStrat === "UPDATE_EXISTING" || modStrat === "MERGE")) return "KEEP_EXISTING";
			return modStrat;
		}
		return previewItem?.recommendedAction || fallback;
	};
	const recordOutcome = (modId, action) => {
		summary.byModule[modId][action]++;
		if (action === "inserted") summary.insertedCount++;
		else if (action === "updated") summary.updatedCount++;
		else if (action === "merged") summary.mergedCount++;
		else if (action === "kept") summary.keptExistingCount++;
		else if (action === "skipped") summary.skippedCount++;
	};
	if (activeModules.has("currencies")) {
		result.currencies = result.currencies || [];
		result.exchangeRates = result.exchangeRates || {
			[targetBaseCurr]: 1,
			SDG: 1
		};
		result.exchangeRateItems = result.exchangeRateItems || [];
		for (const inc of incomingPayload.currencies || []) {
			const code = normalizeCode(inc.code);
			const action = resolveAction(`currencies:${code}`, "currencies", "MERGE");
			const existingIdx = result.currencies.findIndex((c) => normalizeCode(c.code) === code);
			if (action === "SKIP") {
				recordOutcome("currencies", "skipped");
				continue;
			}
			const safeCurrency = {
				...inc,
				code,
				isBase: result.currencies.length === 0 ? Boolean(inc.isBase) : code === targetBaseCurr,
				isActive: true
			};
			if (existingIdx === -1) {
				result.currencies.push(safeCurrency);
				recordOutcome("currencies", "inserted");
			} else if (action === "UPDATE_EXISTING" || action === "MERGE") {
				result.currencies[existingIdx] = {
					...result.currencies[existingIdx],
					name: result.currencies[existingIdx].name || inc.name,
					nameAr: result.currencies[existingIdx].nameAr || inc.nameAr,
					symbol: result.currencies[existingIdx].symbol || inc.symbol,
					isBase: result.currencies[existingIdx].isBase
				};
				recordOutcome("currencies", "merged");
			} else recordOutcome("currencies", "kept");
		}
		for (const incRate of incomingPayload.exchangeRateItems || []) {
			const src = normalizeCode(incRate.sourceCurrency);
			const tgt = normalizeCode(incRate.targetCurrency);
			if (result.exchangeRateItems.findIndex((r) => normalizeCode(r.sourceCurrency) === src && normalizeCode(r.targetCurrency) === tgt) === -1) {
				result.exchangeRateItems.push({ ...incRate });
				if (tgt === targetBaseCurr || tgt === "SDG") result.exchangeRates[src] = Number(incRate.rate);
			}
		}
	}
	if (activeModules.has("branches")) {
		result.branches = result.branches || [];
		for (const inc of incomingPayload.branches || []) {
			const itemKey = `branches:${inc.id}`;
			const pItem = previewItemMap.get(itemKey);
			const action = resolveAction(itemKey, "branches", "MERGE");
			const matchedId = pItem?.matchedTargetId || null;
			if (action === "SKIP") {
				if (matchedId) idRemapTable[inc.id] = matchedId;
				recordOutcome("branches", "skipped");
				continue;
			}
			if (matchedId && action !== "IMPORT_AS_NEW") {
				idRemapTable[inc.id] = matchedId;
				remappedReferencesCount++;
				const idx = result.branches.findIndex((b) => b.id === matchedId);
				if (idx !== -1 && (action === "MERGE" || action === "UPDATE_EXISTING")) {
					const ex = result.branches[idx];
					result.branches[idx] = {
						...ex,
						nameAr: ex.nameAr || inc.nameAr,
						city: ex.city || inc.city,
						address: ex.address || inc.address,
						phone: ex.phone || inc.phone
					};
					recordOutcome("branches", action === "MERGE" ? "merged" : "updated");
				} else recordOutcome("branches", "kept");
			} else {
				const newId = result.branches.some((b) => b.id === inc.id) ? `br-imp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}` : inc.id;
				idRemapTable[inc.id] = newId;
				result.branches.push({
					...inc,
					id: newId,
					companyId: targetCompanyId,
					isMain: result.branches.length === 0 ? true : false,
					isMainBranch: result.branches.length === 0 ? true : false
				});
				recordOutcome("branches", "inserted");
			}
		}
	}
	if (activeModules.has("categories")) {
		result.categories = result.categories || [];
		for (const inc of incomingPayload.categories || []) {
			const itemKey = `categories:${inc.id}`;
			const pItem = previewItemMap.get(itemKey);
			const action = resolveAction(itemKey, "categories", "MERGE");
			const matchedId = pItem?.matchedTargetId || null;
			if (action === "SKIP") {
				if (matchedId) idRemapTable[inc.id] = matchedId;
				recordOutcome("categories", "skipped");
				continue;
			}
			if (matchedId && action !== "IMPORT_AS_NEW") {
				idRemapTable[inc.id] = matchedId;
				remappedReferencesCount++;
				const idx = result.categories.findIndex((c) => c.id === matchedId);
				if (idx !== -1 && (action === "MERGE" || action === "UPDATE_EXISTING")) {
					const ex = result.categories[idx];
					result.categories[idx] = {
						...ex,
						name: action === "UPDATE_EXISTING" ? inc.name : ex.name || inc.name,
						nameAr: action === "UPDATE_EXISTING" ? inc.nameAr || ex.nameAr : ex.nameAr || inc.nameAr
					};
					recordOutcome("categories", action === "MERGE" ? "merged" : "updated");
				} else recordOutcome("categories", "kept");
			} else {
				const newId = result.categories.some((c) => c.id === inc.id) ? `cat-imp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}` : inc.id;
				idRemapTable[inc.id] = newId;
				result.categories.push({
					...inc,
					id: newId,
					companyId: targetCompanyId
				});
				recordOutcome("categories", "inserted");
			}
		}
	}
	if (activeModules.has("uom_custom_fields")) {
		result.unitsOfMeasure = result.unitsOfMeasure || [];
		for (const uom of incomingPayload.unitsOfMeasure || []) {
			const exists = result.unitsOfMeasure.find((e) => normalizeCode(e.code) === normalizeCode(uom.code) || e.id === uom.id);
			if (!exists) {
				result.unitsOfMeasure.push({ ...uom });
				recordOutcome("uom_custom_fields", "inserted");
			} else {
				idRemapTable[uom.id] = exists.id;
				recordOutcome("uom_custom_fields", "kept");
			}
		}
		result.customFieldDefinitions = result.customFieldDefinitions || [];
		for (const cf of incomingPayload.customFieldDefinitions || []) {
			const exists = result.customFieldDefinitions.find((e) => normalizeEntityName(e.name) === normalizeEntityName(cf.name) || e.id === cf.id);
			if (!exists) {
				result.customFieldDefinitions.push({ ...cf });
				recordOutcome("uom_custom_fields", "inserted");
			} else {
				idRemapTable[cf.id] = exists.id;
				recordOutcome("uom_custom_fields", "kept");
			}
		}
	}
	if (activeModules.has("products")) {
		result.products = result.products || [];
		result.stockMovements = result.stockMovements || [];
		for (const inc of incomingPayload.products || []) {
			const itemKey = `products:${inc.id}`;
			const pItem = previewItemMap.get(itemKey);
			const action = resolveAction(itemKey, "products", "MERGE");
			const matchedId = pItem?.matchedTargetId || null;
			if (action === "SKIP") {
				if (matchedId) idRemapTable[inc.id] = matchedId;
				recordOutcome("products", "skipped");
				continue;
			}
			if (matchedId && action !== "IMPORT_AS_NEW") {
				idRemapTable[inc.id] = matchedId;
				remappedReferencesCount++;
				const idx = result.products.findIndex((p) => p.id === matchedId);
				if (idx === -1) {
					recordOutcome("products", "skipped");
					continue;
				}
				const ex = result.products[idx];
				if (action === "KEEP_EXISTING") {
					recordOutcome("products", "kept");
					continue;
				}
				const combinedBarcodes = Array.from(/* @__PURE__ */ new Set([...getAllProductBarcodes(ex), ...getAllProductBarcodes(inc)]));
				let nextStock = ex.stock;
				if (options.applyIncomingStockDelta && Number(inc.stock) > 0) {
					nextStock = ex.stock + Number(inc.stock);
					result.stockMovements.unshift({
						id: `mov-merge-${Date.now()}-${ex.id}`,
						timestamp: (/* @__PURE__ */ new Date()).toISOString(),
						productId: ex.id,
						productName: ex.name,
						type: "restock",
						quantityChange: Number(inc.stock),
						previousStock: ex.stock,
						newStock: nextStock,
						reason: `Backup Merge Stock Addition (${inc.id})`
					});
				}
				if (action === "UPDATE_EXISTING") {
					result.products[idx] = {
						...ex,
						...inc,
						id: ex.id,
						companyId: targetCompanyId,
						stock: nextStock,
						barcodes: combinedBarcodes,
						updatedAt: (/* @__PURE__ */ new Date()).toISOString()
					};
					recordOutcome("products", "updated");
				} else {
					result.products[idx] = {
						...ex,
						nameAr: ex.nameAr || inc.nameAr,
						description: ex.description || inc.description,
						descriptionAr: ex.descriptionAr || inc.descriptionAr,
						category: ex.category || inc.category,
						categoryAr: ex.categoryAr || inc.categoryAr,
						barcode: ex.barcode || inc.barcode,
						barcodes: combinedBarcodes,
						image: ex.image || inc.image,
						minStockAlert: ex.minStockAlert ?? inc.minStockAlert,
						stock: nextStock,
						customFields: {
							...inc.customFields || {},
							...ex.customFields || {}
						},
						updatedAt: (/* @__PURE__ */ new Date()).toISOString()
					};
					recordOutcome("products", "merged");
				}
			} else {
				const collisionId = result.products.some((p) => p.id === inc.id);
				const collisionSku = result.products.some((p) => normalizeCode(p.sku) === normalizeCode(inc.sku));
				const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
				const newId = collisionId ? `prod-imp-${Date.now().toString(36)}-${suffix.toLowerCase()}` : inc.id;
				const newSku = collisionSku ? `${inc.sku}-IMP-${suffix}` : inc.sku;
				idRemapTable[inc.id] = newId;
				result.products.push({
					...inc,
					id: newId,
					sku: newSku,
					companyId: targetCompanyId,
					updatedAt: (/* @__PURE__ */ new Date()).toISOString()
				});
				recordOutcome("products", "inserted");
			}
		}
	}
	if (activeModules.has("customers")) {
		result.customers = result.customers || [];
		for (const inc of incomingPayload.customers || []) {
			const itemKey = `customers:${inc.id}`;
			const pItem = previewItemMap.get(itemKey);
			const action = resolveAction(itemKey, "customers", "MERGE");
			const matchedId = pItem?.matchedTargetId || null;
			if (action === "SKIP") {
				if (matchedId) idRemapTable[inc.id] = matchedId;
				recordOutcome("customers", "skipped");
				continue;
			}
			if (matchedId && action !== "IMPORT_AS_NEW") {
				idRemapTable[inc.id] = matchedId;
				remappedReferencesCount++;
				const idx = result.customers.findIndex((c) => c.id === matchedId);
				if (idx === -1) {
					recordOutcome("customers", "skipped");
					continue;
				}
				const ex = result.customers[idx];
				if (action === "KEEP_EXISTING") {
					recordOutcome("customers", "kept");
					continue;
				}
				result.customers[idx] = {
					...ex,
					name: action === "UPDATE_EXISTING" ? inc.name : ex.name || inc.name,
					phone: action === "UPDATE_EXISTING" ? inc.phone || ex.phone : ex.phone || inc.phone,
					email: action === "UPDATE_EXISTING" ? inc.email || ex.email : ex.email || inc.email,
					notes: ex.notes ? inc.notes && !ex.notes.includes(inc.notes) ? `${ex.notes} | ${inc.notes}` : ex.notes : inc.notes
				};
				recordOutcome("customers", action === "MERGE" ? "merged" : "updated");
			} else {
				const newId = result.customers.some((c) => c.id === inc.id) ? `cust-imp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}` : inc.id;
				idRemapTable[inc.id] = newId;
				result.customers.push({
					...inc,
					id: newId
				});
				recordOutcome("customers", "inserted");
			}
		}
	}
	if (activeModules.has("suppliers")) {
		result.suppliers = result.suppliers || [];
		for (const inc of incomingPayload.suppliers || []) {
			const itemKey = `suppliers:${inc.id}`;
			const pItem = previewItemMap.get(itemKey);
			const action = resolveAction(itemKey, "suppliers", "MERGE");
			const matchedId = pItem?.matchedTargetId || null;
			if (action === "SKIP") {
				if (matchedId) idRemapTable[inc.id] = matchedId;
				recordOutcome("suppliers", "skipped");
				continue;
			}
			if (matchedId && action !== "IMPORT_AS_NEW") {
				idRemapTable[inc.id] = matchedId;
				remappedReferencesCount++;
				const idx = result.suppliers.findIndex((s) => s.id === matchedId);
				if (idx !== -1 && (action === "MERGE" || action === "UPDATE_EXISTING")) {
					const ex = result.suppliers[idx];
					result.suppliers[idx] = {
						...ex,
						contactName: ex.contactName || inc.contactName,
						phone: ex.phone || inc.phone,
						email: ex.email || inc.email,
						address: ex.address || inc.address,
						taxNumber: ex.taxNumber || inc.taxNumber
					};
					recordOutcome("suppliers", action === "MERGE" ? "merged" : "updated");
				} else recordOutcome("suppliers", "kept");
			} else {
				const newId = result.suppliers.some((s) => s.id === inc.id) ? `sup-imp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}` : inc.id;
				idRemapTable[inc.id] = newId;
				result.suppliers.push({
					...inc,
					id: newId,
					companyId: targetCompanyId
				});
				recordOutcome("suppliers", "inserted");
			}
		}
	}
	if (activeModules.has("employees_permissions")) {
		result.employees = result.employees || [];
		for (const inc of incomingPayload.employees || []) {
			const itemKey = `employees_permissions:${inc.id}`;
			const pItem = previewItemMap.get(itemKey);
			const action = resolveAction(itemKey, "employees_permissions", "KEEP_EXISTING");
			const matchedId = pItem?.matchedTargetId || null;
			if (action === "SKIP") {
				recordOutcome("employees_permissions", "skipped");
				continue;
			}
			if (matchedId && action !== "IMPORT_AS_NEW") {
				idRemapTable[inc.id] = matchedId;
				recordOutcome("employees_permissions", "kept");
			} else {
				const newId = result.employees.some((u) => u.id === inc.id) ? `usr-imp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}` : inc.id;
				idRemapTable[inc.id] = newId;
				const safeUser = scrubSensitiveUserFields(inc);
				result.employees.push({
					...safeUser,
					id: newId,
					companyId: targetCompanyId,
					branchId: inc.branchId && idRemapTable[inc.branchId] || inc.branchId || result.branches[0]?.id || "branch-main"
				});
				recordOutcome("employees_permissions", "inserted");
			}
		}
	}
	if (activeModules.has("sales")) {
		result.transactions = result.transactions || [];
		for (const inc of incomingPayload.transactions || []) {
			const itemKey = `sales:${inc.id}`;
			const pItem = previewItemMap.get(itemKey);
			const action = resolveAction(itemKey, "sales", "KEEP_EXISTING");
			const matchedId = pItem?.matchedTargetId || null;
			if (action === "SKIP") {
				recordOutcome("sales", "skipped");
				continue;
			}
			if (matchedId && action !== "IMPORT_AS_NEW") {
				idRemapTable[inc.id] = matchedId;
				recordOutcome("sales", "kept");
				continue;
			}
			const newTxId = result.transactions.some((t) => t.id === inc.id) ? `${inc.id}-IMP-${Math.random().toString(36).slice(2, 6).toUpperCase()}` : inc.id;
			idRemapTable[inc.id] = newTxId;
			const remappedCustomerId = inc.customerId ? idRemapTable[inc.customerId] || inc.customerId : void 0;
			if (inc.customerId && idRemapTable[inc.customerId]) remappedReferencesCount++;
			const remappedItems = (inc.items || []).map((line) => {
				const mappedProdId = idRemapTable[line.productId] || line.productId;
				if (idRemapTable[line.productId]) remappedReferencesCount++;
				return {
					...line,
					productId: mappedProdId
				};
			});
			result.transactions.push({
				...inc,
				id: newTxId,
				customerId: remappedCustomerId,
				items: remappedItems,
				exchangeRatesSnapshot: inc.exchangeRatesSnapshot ? { ...inc.exchangeRatesSnapshot } : void 0
			});
			recordOutcome("sales", "inserted");
		}
	}
	if (activeModules.has("inventory")) {
		result.stockMovements = result.stockMovements || [];
		for (const inc of incomingPayload.stockMovements || []) {
			const itemKey = `inventory:${inc.id}`;
			const pItem = previewItemMap.get(itemKey);
			const action = resolveAction(itemKey, "inventory", "SKIP");
			const matchedId = pItem?.matchedTargetId || null;
			if (matchedId || action === "SKIP" || action === "KEEP_EXISTING") {
				recordOutcome("inventory", matchedId ? "kept" : "skipped");
				continue;
			}
			const mappedProductId = idRemapTable[inc.productId] || inc.productId;
			if (idRemapTable[inc.productId]) remappedReferencesCount++;
			result.stockMovements.push({
				...inc,
				id: result.stockMovements.some((m) => m.id === inc.id) ? `mov-imp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}` : inc.id,
				productId: mappedProductId,
				referenceId: inc.referenceId ? idRemapTable[inc.referenceId] || inc.referenceId : void 0
			});
			recordOutcome("inventory", "inserted");
		}
	}
	if (activeModules.has("purchases")) {
		result.purchases = result.purchases || [];
		for (const inc of incomingPayload.purchases || []) {
			const itemKey = `purchases:${inc.id}`;
			const pItem = previewItemMap.get(itemKey);
			const action = resolveAction(itemKey, "purchases", "KEEP_EXISTING");
			if (pItem?.matchedTargetId || action === "SKIP" || action === "KEEP_EXISTING") {
				recordOutcome("purchases", pItem?.matchedTargetId ? "kept" : "skipped");
				continue;
			}
			const mappedSupplierId = inc.supplierId ? idRemapTable[inc.supplierId] || inc.supplierId : void 0;
			result.purchases.push({
				...inc,
				id: result.purchases.some((p) => p.id === inc.id) ? `po-imp-${Date.now().toString(36)}` : inc.id,
				companyId: targetCompanyId,
				supplierId: mappedSupplierId,
				items: (inc.items || []).map((li) => ({
					...li,
					productId: idRemapTable[li.productId] || li.productId
				}))
			});
			recordOutcome("purchases", "inserted");
		}
	}
	if (activeModules.has("accounting")) {
		result.accounts = result.accounts || [];
		for (const inc of incomingPayload.accounts || []) {
			const itemKey = `accounting:acc:${inc.id}`;
			const pItem = previewItemMap.get(itemKey);
			const action = resolveAction(itemKey, "accounting", "MERGE");
			const matchedId = pItem?.matchedTargetId || null;
			if (action === "SKIP") {
				recordOutcome("accounting", "skipped");
				continue;
			}
			if (matchedId && action !== "IMPORT_AS_NEW") {
				idRemapTable[inc.id] = matchedId;
				remappedReferencesCount++;
				recordOutcome("accounting", "kept");
			} else {
				const newId = result.accounts.some((a) => a.id === inc.id) ? `acc-imp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}` : inc.id;
				idRemapTable[inc.id] = newId;
				result.accounts.push({
					...inc,
					id: newId,
					companyId: targetCompanyId
				});
				recordOutcome("accounting", "inserted");
			}
		}
		result.journalEntries = result.journalEntries || [];
		for (const inc of incomingPayload.journalEntries || []) {
			const itemKey = `accounting:je:${inc.id}`;
			const pItem = previewItemMap.get(itemKey);
			const action = resolveAction(itemKey, "accounting", "KEEP_EXISTING");
			if (pItem?.matchedTargetId || action === "SKIP") {
				recordOutcome("accounting", pItem?.matchedTargetId ? "kept" : "skipped");
				continue;
			}
			result.journalEntries.push({
				...inc,
				id: result.journalEntries.some((j) => j.id === inc.id) ? `je-imp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}` : inc.id,
				companyId: targetCompanyId,
				lines: (inc.lines || []).map((ln) => ({
					...ln,
					accountId: idRemapTable[ln.accountId] || ln.accountId
				}))
			});
			recordOutcome("accounting", "inserted");
		}
	}
	if (activeModules.has("expenses")) {
		result.expenses = result.expenses || [];
		for (const inc of incomingPayload.expenses || []) {
			const itemKey = `expenses:${inc.id}`;
			const pItem = previewItemMap.get(itemKey);
			const action = resolveAction(itemKey, "expenses", "KEEP_EXISTING");
			if (pItem?.matchedTargetId || action === "SKIP") {
				recordOutcome("expenses", pItem?.matchedTargetId ? "kept" : "skipped");
				continue;
			}
			result.expenses.push({
				...inc,
				id: result.expenses.some((e) => e.id === inc.id) ? `exp-imp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}` : inc.id,
				companyId: targetCompanyId
			});
			recordOutcome("expenses", "inserted");
		}
	}
	summary.remappedReferencesCount = remappedReferencesCount;
	return {
		mergedDataset: result,
		summary,
		idRemapTable
	};
}
function remapBackupPayloadForNewCompany(sourcePayload, newCompanyInput) {
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const suffix = Date.now().toString(36).slice(-5).toLowerCase();
	const newCompanyId = newCompanyInput.newCompanyId || `comp-${suffix}`;
	const newCompanyCode = newCompanyInput.newCompanyCode || `CMP-${suffix.toUpperCase()}`;
	const idRemapTable = {};
	const mapId = (prefix, oldId) => {
		if (!oldId) return `${prefix}-${suffix}-${Math.random().toString(36).slice(2, 6)}`;
		if (idRemapTable[oldId]) return idRemapTable[oldId];
		const generated = `${prefix}-${suffix}-${Math.random().toString(36).slice(2, 7)}`;
		idRemapTable[oldId] = generated;
		return generated;
	};
	idRemapTable[sourcePayload.companyProfile?.id || "source-company"] = newCompanyId;
	const baseCurr = sourcePayload.companyProfile?.baseCurrency || "SDG";
	const newCompany = {
		...sourcePayload.companyProfile || {},
		id: newCompanyId,
		code: newCompanyCode,
		legalName: newCompanyInput.companyName.trim(),
		displayName: newCompanyInput.companyName.trim(),
		displayNameAr: (newCompanyInput.companyNameAr || newCompanyInput.companyName).trim(),
		businessType: newCompanyInput.businessType || sourcePayload.companyProfile?.businessType || "retail",
		baseCurrency: baseCurr,
		isDemo: false,
		isDemoPractice: false,
		setupCompleted: true,
		onboardingCompleted: true,
		createdAt: nowIso,
		updatedAt: nowIso
	};
	const sourceBranches = sourcePayload.branches || [];
	const remappedBranches = sourceBranches.length > 0 ? sourceBranches.map((b, idx) => {
		const nbId = mapId("br", b.id);
		return {
			...b,
			id: nbId,
			companyId: newCompanyId,
			code: `${b.code || "BR"}-${suffix.toUpperCase()}-${idx + 1}`,
			isMain: idx === 0 ? true : Boolean(b.isMain),
			isMainBranch: idx === 0 ? true : Boolean(b.isMainBranch),
			createdAt: nowIso
		};
	}) : [{
		id: `br-${suffix}-main`,
		companyId: newCompanyId,
		code: `BR-${suffix.toUpperCase()}-01`,
		name: `${newCompany.displayName} — Main Branch`,
		nameAr: `${newCompany.displayNameAr} — الفرع الرئيسي`,
		city: newCompany.city || "Khartoum",
		address: newCompany.address || "",
		phone: newCompany.phone || "",
		isMain: true,
		isMainBranch: true,
		isActive: true,
		createdAt: nowIso
	}];
	const newMainBranch = remappedBranches[0];
	const ownerId = newCompanyInput.ownerId || `usr-owner-${suffix}`;
	newCompany.ownerUserId = ownerId;
	const ownerCaps = [...ALL_CAPABILITY_CODES];
	const newOwnerProfile = {
		id: ownerId,
		companyId: newCompanyId,
		branchId: newMainBranch.id,
		assignedBranchIds: remappedBranches.map((b) => b.id),
		name: newCompanyInput.ownerName.trim() || newCompanyInput.ownerUsername.trim(),
		nameAr: newCompanyInput.ownerName.trim() || newCompanyInput.ownerUsername.trim(),
		username: newCompanyInput.ownerUsername.trim().toLowerCase(),
		email: newCompanyInput.ownerEmail?.trim() || void 0,
		role: "admin",
		systemRole: "COMPANY_OWNER",
		capabilities: ownerCaps,
		pin: newCompanyInput.ownerPin?.trim() || "1111",
		terminalName: `${newMainBranch.name} — Owner Terminal`,
		terminalNameAr: `${newMainBranch.nameAr} — جهاز المالك`,
		avatarColor: "#10b981",
		isActive: true,
		permissions: deriveLegacyPermissionsFromCapabilities(ownerCaps),
		lastActiveAt: nowIso
	};
	const remappedEmployees = [scrubSensitiveUserFields(newOwnerProfile), ...(sourcePayload.employees || []).filter((e) => e.systemRole !== "COMPANY_OWNER").map((e, idx) => {
		const neId = mapId("usr", e.id);
		return {
			...scrubSensitiveUserFields(e),
			id: neId,
			companyId: newCompanyId,
			username: `${e.username || `emp${idx + 1}`}.${suffix}`,
			branchId: e.branchId && idRemapTable[e.branchId] || newMainBranch.id,
			assignedBranchIds: Array.isArray(e.assignedBranchIds) ? e.assignedBranchIds.map((bid) => idRemapTable[bid] || newMainBranch.id) : [newMainBranch.id],
			requiresCredentialSetup: true
		};
	})];
	const remappedCategories = (sourcePayload.categories || []).map((c) => ({
		...c,
		id: mapId("cat", c.id),
		companyId: newCompanyId,
		slug: `${c.slug || c.id}-${suffix}`
	}));
	const remappedSuppliers = (sourcePayload.suppliers || []).map((s) => ({
		...s,
		id: mapId("sup", s.id),
		companyId: newCompanyId
	}));
	const remappedCustomers = (sourcePayload.customers || []).map((c) => ({
		...c,
		id: mapId("cust", c.id)
	}));
	const remappedProducts = (sourcePayload.products || []).map((p) => {
		const npId = mapId("prod", p.id);
		const remappedBranchStock = p.branchStock ? Object.fromEntries(Object.entries(p.branchStock).map(([bId, qty]) => [idRemapTable[bId] || newMainBranch.id, Number(qty) || 0])) : void 0;
		return {
			...p,
			id: npId,
			companyId: newCompanyId,
			...remappedBranchStock ? { branchStock: remappedBranchStock } : {}
		};
	});
	const remappedAccounts = (sourcePayload.accounts || []).map((a) => ({
		...a,
		id: mapId("acc", a.id),
		companyId: newCompanyId
	}));
	const remappedPurchases = (sourcePayload.purchases || []).map((po) => ({
		...po,
		id: mapId("po", po.id),
		companyId: newCompanyId,
		purchaseNumber: `${po.purchaseNumber}-${suffix.toUpperCase()}`,
		supplierId: po.supplierId ? idRemapTable[po.supplierId] || po.supplierId : void 0,
		branchId: po.branchId ? idRemapTable[po.branchId] || newMainBranch.id : newMainBranch.id,
		items: (po.items || []).map((item) => ({
			...item,
			productId: idRemapTable[item.productId] || item.productId
		}))
	}));
	const remappedTransactions = (sourcePayload.transactions || []).map((tx) => {
		const nTxId = mapId("tx", tx.id);
		return {
			...tx,
			id: nTxId,
			idempotencyKey: `idem-${nTxId}`,
			customerId: tx.customerId ? idRemapTable[tx.customerId] || tx.customerId : void 0,
			items: (tx.items || []).map((item) => ({
				...item,
				productId: idRemapTable[item.productId] || item.productId
			})),
			exchangeRatesSnapshot: tx.exchangeRatesSnapshot ? { ...tx.exchangeRatesSnapshot } : void 0
		};
	});
	const remappedStockMovements = (sourcePayload.stockMovements || []).map((mov) => ({
		...mov,
		id: mapId("mov", mov.id),
		productId: idRemapTable[mov.productId] || mov.productId,
		referenceId: mov.referenceId ? idRemapTable[mov.referenceId] || mov.referenceId : void 0
	}));
	const remappedExpenses = (sourcePayload.expenses || []).map((exp) => ({
		...exp,
		id: mapId("exp", exp.id),
		companyId: newCompanyId,
		branchId: exp.branchId ? idRemapTable[exp.branchId] || newMainBranch.id : newMainBranch.id
	}));
	const remappedJournalEntries = (sourcePayload.journalEntries || []).map((je) => ({
		...je,
		id: mapId("je", je.id),
		companyId: newCompanyId,
		lines: (je.lines || []).map((ln) => ({
			...ln,
			accountId: idRemapTable[ln.accountId] || ln.accountId
		}))
	}));
	const remappedDemand = (sourcePayload.unmetDemandRequests || []).map((req) => ({
		...req,
		id: mapId("udr", req.id),
		idempotencyKey: `idem-udr-${suffix}-${req.id}`,
		...req.matchedProductId ? { matchedProductId: idRemapTable[req.matchedProductId] || req.matchedProductId } : {}
	}));
	return {
		remappedPayload: {
			companyProfile: newCompany,
			storeSettings: sourcePayload.storeSettings ? {
				...sourcePayload.storeSettings,
				storeName: newCompany.displayName,
				storeNameAr: newCompany.displayNameAr
			} : void 0,
			invoiceSettings: sourcePayload.invoiceSettings ? { ...sourcePayload.invoiceSettings } : void 0,
			currencies: JSON.parse(JSON.stringify(sourcePayload.currencies || [])),
			exchangeRates: JSON.parse(JSON.stringify(sourcePayload.exchangeRates || { SDG: 1 })),
			exchangeRateItems: JSON.parse(JSON.stringify(sourcePayload.exchangeRateItems || [])),
			exchangeRateHistory: JSON.parse(JSON.stringify(sourcePayload.exchangeRateHistory || [])),
			branches: remappedBranches,
			employees: remappedEmployees,
			unitsOfMeasure: JSON.parse(JSON.stringify(sourcePayload.unitsOfMeasure || [])),
			customFieldDefinitions: JSON.parse(JSON.stringify(sourcePayload.customFieldDefinitions || [])),
			categories: remappedCategories,
			products: remappedProducts,
			customers: remappedCustomers,
			suppliers: remappedSuppliers,
			stockMovements: remappedStockMovements,
			branchTransfers: [],
			purchases: remappedPurchases,
			transactions: remappedTransactions,
			expenses: remappedExpenses,
			accounts: remappedAccounts,
			journalEntries: remappedJournalEntries,
			unmetDemandRequests: remappedDemand,
			intelligenceLifecycleItems: [],
			auditLogs: []
		},
		idRemapTable,
		newCompany,
		newMainBranch,
		newOwnerProfile
	};
}
// src/lib/expense-calculations.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var EXPENSE_CATEGORIES = [
	{
		id: "rent",
		labelAr: "إيجار المحل والمخازن",
		labelEn: "Store & Warehouse Rent",
		emoji: "🏢",
		colorHex: "#f59e0b"
	},
	{
		id: "utilities",
		labelAr: "كهرباء، مياه، وإنترنت",
		labelEn: "Electricity, Water & Internet",
		emoji: "⚡",
		colorHex: "#3b82f6"
	},
	{
		id: "salaries",
		labelAr: "رواتب وأجور وحوافز",
		labelEn: "Salaries, Wages & Bonuses",
		emoji: "👥",
		colorHex: "#10b981"
	},
	{
		id: "transport",
		labelAr: "ترحيل، شحن، ومواصلات",
		labelEn: "Transport, Freight & Delivery",
		emoji: "🚚",
		colorHex: "#8b5cf6"
	},
	{
		id: "maintenance",
		labelAr: "صيانة وإصلاحات وتشغيل",
		labelEn: "Maintenance & Repairs",
		emoji: "🛠️",
		colorHex: "#ec4899"
	},
	{
		id: "supplies",
		labelAr: "قرطاسية وأكياس ومستلزمات",
		labelEn: "Packaging & Store Supplies",
		emoji: "📦",
		colorHex: "#14b8a6"
	},
	{
		id: "taxes_fees",
		labelAr: "ضرائب، رسوم محلية، وتراخيص",
		labelEn: "Taxes, Fees & Licenses",
		emoji: "🏛️",
		colorHex: "#ef4444"
	},
	{
		id: "marketing",
		labelAr: "دعاية، إعلان، وتسويق",
		labelEn: "Marketing & Promotions",
		emoji: "📣",
		colorHex: "#f97316"
	},
	{
		id: "other",
		labelAr: "منصرفات نثرية وأخرى",
		labelEn: "Miscellaneous / Other Expenses",
		emoji: "🧾",
		colorHex: "#64748b"
	}
];
var VALID_EXPENSE_CATEGORY_SET = new Set(EXPENSE_CATEGORIES.map((c) => c.id));
function getExpenseCategoryMeta(category) {
	return EXPENSE_CATEGORIES.find((c) => c.id === category) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
}
function formatExpenseCategoryLabel(category, language = "ar") {
	const meta = getExpenseCategoryMeta(category);
	return language === "ar" ? meta.labelAr : meta.labelEn;
}
function generateExpenseId(now = /* @__PURE__ */ new Date()) {
	return `EXP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(1e3 + Math.random() * 9e3)}`;
}
/**
* Validates an ExpenseInput before creating or updating an ExpenseRecord.
*/
function validateExpenseInput(input, language = "ar") {
	const isAr = language === "ar";
	const cleanTitle = String(input.title ?? "").trim();
	if (!cleanTitle) {
		const msgAr = "يرجى إدخال بيان أو وصف المنصرف.";
		return {
			valid: false,
			error: isAr ? msgAr : "Please enter an expense title or description.",
			errorAr: msgAr
		};
	}
	if (cleanTitle.length > 160) {
		const msgAr = "بيان المنصرف طويل جداً (الحد الأقصى 160 حرفاً).";
		return {
			valid: false,
			error: isAr ? msgAr : "Expense title is too long (maximum 160 characters).",
			errorAr: msgAr
		};
	}
	const rawAmount = Number(input.amount);
	if (!Number.isFinite(rawAmount) || rawAmount <= 0) {
		const msgAr = "يرجى إدخال مبلغ صحيح أكبر من الصفر للمنصرف.";
		return {
			valid: false,
			error: isAr ? msgAr : "Please enter a valid expense amount greater than zero.",
			errorAr: msgAr
		};
	}
	const category = String(input.category || "other");
	if (!VALID_EXPENSE_CATEGORY_SET.has(category)) {
		const msgAr = "يرجى اختيار بند/تصنيف صحيح للمنصرف.";
		return {
			valid: false,
			error: isAr ? msgAr : "Please select a valid expense category.",
			errorAr: msgAr
		};
	}
	return { valid: true };
}
/**
* Converts an ExpenseRecord into targetCurrency using the specified valuation mode.
*/
function getConvertedExpenseView(expense, targetCurrency = "SDG", currentExchangeRates = DEFAULT_BASELINE_EXCHANGE_RATES, mode = "historical", anchorCurrency = "USD") {
	const expCurrency = (expense.currency || "SDG").toString().toUpperCase().trim();
	const target = (targetCurrency || "SDG").toString().toUpperCase().trim();
	const anchor = (anchorCurrency || "USD").toString().toUpperCase().trim();
	const liveRates = {
		...DEFAULT_BASELINE_EXCHANGE_RATES,
		...currentExchangeRates || {},
		SDG: 1
	};
	const snapshotRates = {
		...DEFAULT_BASELINE_EXCHANGE_RATES,
		...expense.exchangeRatesSnapshot || {},
		SDG: 1
	};
	if (expense.exchangeRateUsed && expense.exchangeRateUsed > 0) {
		if (expCurrency !== "SDG") snapshotRates[expCurrency] = Number(expense.exchangeRateUsed);
		else snapshotRates[anchor] = Number(expense.exchangeRateUsed);
	}
	const convertByMode = (amount, evalMode) => {
		if (!Number.isFinite(amount) || amount <= 0) return 0;
		if (evalMode === "historical") return convertCurrencyAmount(amount, expCurrency, target, snapshotRates);
		if (evalMode === "indexed") {
			const expRateSnapshot = expCurrency === "SDG" ? 1 : snapshotRates[expCurrency] && snapshotRates[expCurrency] > 0 ? Number(snapshotRates[expCurrency]) : 1;
			const anchorRateSnapshot = anchor === "SDG" ? 1 : snapshotRates[anchor] && snapshotRates[anchor] > 0 ? Number(snapshotRates[anchor]) : 1;
			const anchorAmountRaw = amount * expRateSnapshot / anchorRateSnapshot;
			const anchorRateLive = anchor === "SDG" ? 1 : liveRates[anchor] && liveRates[anchor] > 0 ? Number(liveRates[anchor]) : 1;
			const targetRateLive = target === "SDG" ? 1 : liveRates[target] && liveRates[target] > 0 ? Number(liveRates[target]) : 1;
			return roundCurrencyValue(anchorAmountRaw * anchorRateLive / targetRateLive);
		}
		return convertCurrencyAmount(amount, expCurrency, target, liveRates);
	};
	const convertedAmount = convertByMode(expense.amount, mode);
	const historicalAmount = convertByMode(expense.amount, "historical");
	const liveAmount = convertByMode(expense.amount, "live");
	const indexedAmount = convertByMode(expense.amount, "indexed");
	const refCurr = expCurrency !== "SDG" ? expCurrency : anchor;
	const exchangeRateUsed = expense.exchangeRateUsed && expense.exchangeRateUsed > 0 ? Number(expense.exchangeRateUsed) : Number(snapshotRates[refCurr] || 2700);
	return {
		id: expense.id,
		currency: target,
		originalCurrency: expCurrency,
		originalAmount: roundCurrencyValue(expense.amount),
		convertedAmount,
		historicalAmount,
		liveAmount,
		indexedAmount,
		exchangeRateUsed
	};
}
/**
* Computes comprehensive expense analytics across all active ExpenseRecords.
*/
function computeExpensesSummary(expenses, targetCurrency = "SDG", currentExchangeRates = DEFAULT_BASELINE_EXCHANGE_RATES, mode = "historical", anchorCurrency = "USD", referenceDate = /* @__PURE__ */ new Date()) {
	const safeList = Array.isArray(expenses) ? expenses : [];
	const todayDateStr = referenceDate.toDateString();
	const refYear = referenceDate.getFullYear();
	const refMonth = referenceDate.getMonth();
	let totalExpenses = 0;
	let todayExpenses = 0;
	let thisMonthExpenses = 0;
	let activeCount = 0;
	let voidedCount = 0;
	let todayCount = 0;
	const categoryTotalsMap = {
		rent: {
			count: 0,
			totalAmount: 0
		},
		utilities: {
			count: 0,
			totalAmount: 0
		},
		salaries: {
			count: 0,
			totalAmount: 0
		},
		transport: {
			count: 0,
			totalAmount: 0
		},
		maintenance: {
			count: 0,
			totalAmount: 0
		},
		supplies: {
			count: 0,
			totalAmount: 0
		},
		taxes_fees: {
			count: 0,
			totalAmount: 0
		},
		marketing: {
			count: 0,
			totalAmount: 0
		},
		other: {
			count: 0,
			totalAmount: 0
		}
	};
	const byPaymentMethod = {
		cash: {
			count: 0,
			totalAmount: 0,
			sharePercent: 0
		},
		bank_transfer: {
			count: 0,
			totalAmount: 0,
			sharePercent: 0
		},
		qr_nfc: {
			count: 0,
			totalAmount: 0,
			sharePercent: 0
		},
		card: {
			count: 0,
			totalAmount: 0,
			sharePercent: 0
		}
	};
	for (const exp of safeList) {
		if (!exp) continue;
		if (exp.status === "voided") {
			voidedCount += 1;
			continue;
		}
		activeCount += 1;
		const val = getConvertedExpenseView(exp, targetCurrency, currentExchangeRates, mode, anchorCurrency).convertedAmount;
		totalExpenses = roundCurrencyValue(totalExpenses + val);
		const expDate = new Date(exp.timestamp);
		if (!isNaN(expDate.getTime())) {
			if (expDate.toDateString() === todayDateStr) {
				todayExpenses = roundCurrencyValue(todayExpenses + val);
				todayCount += 1;
			}
			if (expDate.getFullYear() === refYear && expDate.getMonth() === refMonth) thisMonthExpenses = roundCurrencyValue(thisMonthExpenses + val);
		}
		const catKey = VALID_EXPENSE_CATEGORY_SET.has(exp.category) ? exp.category : "other";
		categoryTotalsMap[catKey].count += 1;
		categoryTotalsMap[catKey].totalAmount = roundCurrencyValue(categoryTotalsMap[catKey].totalAmount + val);
		const methodKey = exp.paymentMethod === "card" ? "bank_transfer" : exp.paymentMethod in byPaymentMethod ? exp.paymentMethod : "cash";
		byPaymentMethod[methodKey].count += 1;
		byPaymentMethod[methodKey].totalAmount = roundCurrencyValue(byPaymentMethod[methodKey].totalAmount + val);
	}
	const byCategory = EXPENSE_CATEGORIES.map((meta) => {
		const stat = categoryTotalsMap[meta.id] || {
			count: 0,
			totalAmount: 0
		};
		const sharePercent = totalExpenses > 0 ? Math.round(stat.totalAmount / totalExpenses * 1e3) / 10 : 0;
		return {
			category: meta.id,
			labelAr: meta.labelAr,
			labelEn: meta.labelEn,
			emoji: meta.emoji,
			colorHex: meta.colorHex,
			count: stat.count,
			totalAmount: stat.totalAmount,
			sharePercent
		};
	}).sort((a, b) => b.totalAmount - a.totalAmount);
	for (const method of Object.keys(byPaymentMethod)) byPaymentMethod[method].sharePercent = totalExpenses > 0 ? Math.round(byPaymentMethod[method].totalAmount / totalExpenses * 1e3) / 10 : 0;
	const topCategory = byCategory.find((c) => c.totalAmount > 0) || null;
	const averageExpenseAmount = activeCount > 0 ? roundCurrencyValue(totalExpenses / activeCount) : 0;
	return {
		currency: targetCurrency,
		totalExpenses,
		todayExpenses,
		thisMonthExpenses,
		averageExpenseAmount,
		activeCount,
		voidedCount,
		todayCount,
		byCategory,
		byPaymentMethod,
		topCategory
	};
}
/**
* Computes the net operating profit and net cash position after deducting operating expenses.
*/
function computeNetFinancialPosition(params) {
	const grossSales = roundCurrencyValue(Math.max(0, Number(params.grossSales) || 0));
	const collectedSales = roundCurrencyValue(Math.max(0, Number(params.collectedSales) || 0));
	const grossProfitBeforeExpenses = roundCurrencyValue(Number(params.grossProfitBeforeExpenses) || 0);
	const totalExpenses = roundCurrencyValue(Math.max(0, Number(params.totalExpenses) || 0));
	const netOperatingProfit = roundCurrencyValue(grossProfitBeforeExpenses - totalExpenses);
	return {
		grossSales,
		collectedSales,
		grossProfitBeforeExpenses,
		totalExpenses,
		netOperatingProfit,
		netCashAfterExpenses: roundCurrencyValue(collectedSales - totalExpenses),
		expenseToSalesRatioPercent: grossSales > 0 ? Math.round(totalExpenses / grossSales * 1e3) / 10 : 0,
		netProfitMarginAfterExpensesPercent: grossSales > 0 ? Math.round(netOperatingProfit / grossSales * 1e3) / 10 : 0
	};
}
// src/context/domains/useBackupHydrationDomain.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
function useBackupHydrationDomain({ currentCompany, currentCompanyId, setCurrentCompanyId, setCompanies, setWorkspaceMode, branches, setAllBranches, activeBranchId, setActiveBranchId, settings, setSettings, currencies, setCurrencies, exchangeRates, setExchangeRates, exchangeRateItems, setExchangeRateItems, exchangeRateHistory, setExchangeRateHistory, users, setUsers, currentUser, setCurrentUserId, products, setProducts, customers, setCustomers, stockMovements, setStockMovements, transactions, setTransactions, expenses, setExpenses, unmetDemandRequests, setUnmetDemandRequests, setCart, setSelectedCustomer, setIsOnboardingModalOpen }) {
	return {
		collectClientBackupDataset: (0, import_react.useCallback)(() => {
			const compId = currentCompany.id;
			const readScopedJson = (baseKey, fallback) => {
				try {
					const raw = localStorage.getItem(getCompanyStorageKey(baseKey, compId)) || localStorage.getItem(`${baseKey}__${compId}`) || localStorage.getItem(baseKey);
					if (raw) return JSON.parse(raw);
				} catch {}
				return fallback;
			};
			const categoriesFromProducts = Array.from(new Set(products.map((p) => p.category).filter(Boolean))).map((catName, idx) => ({
				id: `cat-${idx + 1}-${catName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
				companyId: compId,
				name: catName,
				nameAr: products.find((p) => p.category === catName)?.categoryAr || catName,
				slug: catName.toLowerCase().replace(/[^a-z0-9]/g, "-")
			}));
			return {
				companyProfile: currentCompany,
				storeSettings: settings,
				invoiceSettings: readScopedJson("pos_invoice_settings", {}),
				currencies,
				exchangeRates,
				exchangeRateItems,
				exchangeRateHistory,
				branches,
				employees: users.map((u) => scrubSensitiveUserFields(u)),
				unitsOfMeasure: readScopedJson("pos_uom", []),
				customFieldDefinitions: readScopedJson("pos_custom_fields", []),
				categories: readScopedJson("pos_categories", categoriesFromProducts),
				products,
				customers,
				suppliers: readScopedJson("pos_suppliers", []),
				stockMovements,
				branchTransfers: readScopedJson("pos_branch_transfers", []),
				purchases: readScopedJson("pos_purchase_orders", []),
				transactions,
				expenses: expenses.map((e) => ({
					id: e.id,
					companyId: e.companyId || currentCompany.id,
					branchId: e.branchId || activeBranchId,
					title: e.title,
					category: e.category,
					amount: e.amount,
					currency: e.currency,
					paymentMethod: e.paymentMethod,
					reference: e.transferReference,
					notes: e.notes,
					date: e.timestamp,
					createdBy: e.recordedBy
				})),
				accounts: readScopedJson("pos_accounts", []),
				journalEntries: readScopedJson("pos_journal_entries", []),
				unmetDemandRequests,
				intelligenceLifecycleItems: [],
				auditLogs: []
			};
		}, [
			currentCompany,
			activeBranchId,
			settings,
			currencies,
			exchangeRates,
			exchangeRateItems,
			exchangeRateHistory,
			branches,
			users,
			products,
			customers,
			stockMovements,
			transactions,
			expenses,
			unmetDemandRequests
		]),
		hydrateCompanyFromBackupPayload: (0, import_react.useCallback)((payload, options) => {
			if (!payload || !payload.companyProfile) return;
			const incomingComp = payload.companyProfile;
			const resolvedCompId = options?.switchToNewCompany && incomingComp.id && incomingComp.id !== "comp-default" && incomingComp.id !== "comp-demo-practice" ? incomingComp.id : currentCompanyId && currentCompanyId !== "comp-default" && currentCompanyId !== "comp-demo-practice" ? currentCompanyId : incomingComp.id && incomingComp.id !== "comp-default" && incomingComp.id !== "comp-demo-practice" ? incomingComp.id : "comp-clean-store";
			const targetComp = {
				...incomingComp,
				id: resolvedCompId,
				isDemoPractice: false,
				onboardingCompleted: true
			};
			const targetCompId = targetComp.id;
			setWorkspaceMode("PRODUCTION");
			setCompanies((prev) => {
				const filtered = prev.filter((c) => c.id !== "comp-default" && !c.isDemoPractice);
				const nextCompanies = filtered.some((c) => c.id === targetCompId) ? filtered.map((c) => c.id === targetCompId ? targetComp : c) : [...filtered, targetComp];
				try {
					localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(nextCompanies));
				} catch {}
				return nextCompanies;
			});
			setCurrentCompanyId(targetCompId);
			if (Array.isArray(payload.branches) && payload.branches.length > 0) {
				const normalizedBranches = payload.branches.map((b) => ({
					...b,
					companyId: targetCompId
				}));
				setAllBranches((prev) => {
					const nextBranches = [...prev.filter((b) => b.companyId !== targetCompId), ...normalizedBranches];
					try {
						localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(nextBranches));
					} catch {}
					return nextBranches;
				});
				setActiveBranchId(normalizedBranches[0].id);
			}
			const restoredProducts = Array.isArray(payload.products) ? payload.products : [];
			const restoredTransactions = Array.isArray(payload.transactions) ? payload.transactions : [];
			const restoredCustomers = Array.isArray(payload.customers) ? payload.customers : [];
			const restoredMovements = Array.isArray(payload.stockMovements) ? payload.stockMovements : [];
			const restoredDemand = Array.isArray(payload.unmetDemandRequests) ? payload.unmetDemandRequests : [];
			setProducts(restoredProducts);
			setTransactions(restoredTransactions);
			setCustomers(restoredCustomers);
			setStockMovements(restoredMovements);
			setUnmetDemandRequests(restoredDemand);
			if (Array.isArray(payload.currencies)) {
				setCurrencies(payload.currencies);
				savePersistedCurrencies(payload.currencies);
			}
			if (payload.exchangeRates && typeof payload.exchangeRates === "object") {
				setExchangeRates({
					...payload.exchangeRates,
					SDG: 1
				});
				savePersistedExchangeRates({
					...payload.exchangeRates,
					SDG: 1
				});
			}
			if (Array.isArray(payload.exchangeRateItems)) {
				setExchangeRateItems(payload.exchangeRateItems);
				savePersistedExchangeRateItems(payload.exchangeRateItems);
			}
			if (Array.isArray(payload.exchangeRateHistory)) setExchangeRateHistory(payload.exchangeRateHistory);
			if (payload.storeSettings) setSettings((prev) => {
				const nextSettings = {
					...prev,
					...payload.storeSettings,
					storeName: payload.storeSettings?.storeName || targetComp.displayName || targetComp.legalName,
					storeNameAr: payload.storeSettings?.storeNameAr || targetComp.displayNameAr || targetComp.displayName
				};
				try {
					localStorage.setItem(getCompanyStorageKey(STORAGE_KEYS.SETTINGS, targetCompId), JSON.stringify(nextSettings));
					localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(nextSettings));
				} catch {}
				return nextSettings;
			});
			if (options?.newOwner) {
				const ownerRecord = options.newOwner;
				const nextUsers = [ownerRecord, ...(payload.employees || []).filter((e) => e.id !== ownerRecord.id && e.systemRole !== "COMPANY_OWNER").map((e) => ({
					...e,
					pin: "0000"
				}))];
				setUsers(nextUsers);
				setCurrentUserId(ownerRecord.id);
				try {
					localStorage.setItem(getCompanyStorageKey(STORAGE_KEYS.USERS, targetCompId), JSON.stringify(nextUsers));
					localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(nextUsers));
					localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, ownerRecord.id);
				} catch {}
			} else if (Array.isArray(payload.employees) && payload.employees.length > 0) setUsers((prev) => {
				const existingMap = new Map(prev.map((u) => [u.id, u]));
				const mergedUsers = payload.employees.map((e) => {
					const ex = existingMap.get(e.id);
					return {
						...e,
						pin: ex?.pin || "1111"
					};
				});
				if (currentUser && currentUser.id !== "unassigned-operator" && !mergedUsers.some((u) => u.id === currentUser.id)) mergedUsers.unshift(currentUser);
				try {
					localStorage.setItem(getCompanyStorageKey(STORAGE_KEYS.USERS, targetCompId), JSON.stringify(mergedUsers));
					localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mergedUsers));
				} catch {}
				return mergedUsers;
			});
			try {
				localStorage.setItem(STORAGE_KEYS.WORKSPACE_MODE, "PRODUCTION");
				localStorage.setItem(STORAGE_KEYS.CURRENT_COMPANY_ID, targetCompId);
				localStorage.setItem(getCompanyStorageKey("pos_backup_restored", targetCompId), "true");
				localStorage.setItem("pos_backup_restored_global", "true");
				localStorage.setItem(getCompanyStorageKey(STORAGE_KEYS.PRODUCTS, targetCompId), JSON.stringify(restoredProducts));
				localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(restoredProducts));
				localStorage.setItem(getCompanyStorageKey(STORAGE_KEYS.TRANSACTIONS, targetCompId), JSON.stringify(restoredTransactions));
				localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(restoredTransactions));
				localStorage.setItem(getCompanyStorageKey(STORAGE_KEYS.CUSTOMERS, targetCompId), JSON.stringify(restoredCustomers));
				localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(restoredCustomers));
				localStorage.setItem(getCompanyStorageKey(STORAGE_KEYS.MOVEMENTS, targetCompId), JSON.stringify(restoredMovements));
				localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(restoredMovements));
				localStorage.setItem(getCompanyStorageKey(STORAGE_KEYS.UNMET_DEMAND_REQUESTS, targetCompId), JSON.stringify(restoredDemand));
				localStorage.setItem(STORAGE_KEYS.UNMET_DEMAND_REQUESTS, JSON.stringify(restoredDemand));
				if (Array.isArray(payload.currencies)) localStorage.setItem(getCompanyStorageKey(STORAGE_KEYS.CURRENCIES, targetCompId), JSON.stringify(payload.currencies));
				if (payload.exchangeRates && typeof payload.exchangeRates === "object") localStorage.setItem(getCompanyStorageKey(STORAGE_KEYS.EXCHANGE_RATES, targetCompId), JSON.stringify({
					...payload.exchangeRates,
					SDG: 1
				}));
				if (Array.isArray(payload.exchangeRateItems)) localStorage.setItem(getCompanyStorageKey(STORAGE_KEYS.EXCHANGE_RATE_ITEMS, targetCompId), JSON.stringify(payload.exchangeRateItems));
				if (Array.isArray(payload.exchangeRateHistory)) localStorage.setItem(getCompanyStorageKey(STORAGE_KEYS.RATE_HISTORY, targetCompId), JSON.stringify(payload.exchangeRateHistory));
				if (payload.categories) localStorage.setItem(getCompanyStorageKey("pos_categories", targetCompId), JSON.stringify(payload.categories));
				if (payload.suppliers) localStorage.setItem(getCompanyStorageKey("pos_suppliers", targetCompId), JSON.stringify(payload.suppliers));
				if (payload.purchases) localStorage.setItem(getCompanyStorageKey("pos_purchase_orders", targetCompId), JSON.stringify(payload.purchases));
				if (Array.isArray(payload.expenses)) {
					const normalizedExpenses = payload.expenses.map((be) => ({
						id: be.id || generateExpenseId(),
						companyId: targetCompId,
						branchId: be.branchId,
						timestamp: be.timestamp || be.date || (/* @__PURE__ */ new Date()).toISOString(),
						title: be.title || "منصرف",
						category: be.category || "other",
						amount: Number(be.amount || 0),
						currency: be.currency || "SDG",
						exchangeRateUsed: be.exchangeRateUsed,
						exchangeRatesSnapshot: be.exchangeRatesSnapshot,
						paymentMethod: be.paymentMethod || "cash",
						transferReference: be.transferReference || be.reference,
						receiptImage: be.receiptImage,
						beneficiary: be.beneficiary,
						notes: be.notes,
						recordedBy: be.recordedBy || be.createdBy || "POS Operator",
						status: be.status || "recorded",
						syncStatus: "synced"
					}));
					setExpenses(normalizedExpenses);
					localStorage.setItem(getCompanyStorageKey("pos_expenses", targetCompId), JSON.stringify(normalizedExpenses));
				}
				if (payload.accounts) localStorage.setItem(getCompanyStorageKey("pos_accounts", targetCompId), JSON.stringify(payload.accounts));
				if (payload.journalEntries) localStorage.setItem(getCompanyStorageKey("pos_journal_entries", targetCompId), JSON.stringify(payload.journalEntries));
			} catch {}
			setCart([]);
			setSelectedCustomer(null);
			setIsOnboardingModalOpen(false);
			playSuccessChime(settings.soundEnabled);
			triggerHaptic("success", settings.hapticsEnabled);
		}, [
			currentCompanyId,
			currentUser,
			settings.soundEnabled,
			settings.hapticsEnabled,
			setActiveBranchId,
			setWorkspaceMode,
			setCompanies,
			setCurrentCompanyId,
			setAllBranches,
			setProducts,
			setTransactions,
			setCustomers,
			setStockMovements,
			setUnmetDemandRequests,
			setCurrencies,
			setExchangeRates,
			setExchangeRateItems,
			setExchangeRateHistory,
			setSettings,
			setUsers,
			setCurrentUserId,
			setExpenses,
			setCart,
			setSelectedCustomer,
			setIsOnboardingModalOpen
		])
	};
}
// src/lib/lan-sync-client.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var LAN_SYNC_CONFIG_STORAGE_KEY = "dqnamo_lan_sync_config_v1";
var LAN_SYNC_STATUS_EVENT = "dqnamo:lan-sync-status-changed";
function detectClientPlatform() {
	if (typeof window === "undefined") return "web";
	const w = window;
	if (w.AndroidNativeFileBridge) return "android";
	if (w.Capacitor && typeof w.Capacitor.getPlatform === "function") {
		if (w.Capacitor.getPlatform() === "android") return "android";
	}
	const ua = (navigator?.userAgent || "").toLowerCase();
	if (ua.includes("android")) return "android";
	if (ua.includes("windows") || ua.includes("win64") || ua.includes("win32")) return "windows";
	return "web";
}
function isStandaloneCapacitorApk() {
	if (typeof window === "undefined") return false;
	const w = window;
	if (w.AndroidNativeFileBridge) return true;
	if (w.Capacitor && typeof w.Capacitor.isNativePlatform === "function") return Boolean(w.Capacitor.isNativePlatform());
	return window.location.protocol === "capacitor:" || window.location.hostname === "localhost" && detectClientPlatform() === "android";
}
function normalizeLanHostUrl(rawInput) {
	let cleaned = (rawInput || "").trim();
	if (!cleaned) return "";
	if (cleaned.startsWith("{")) try {
		const parsedJson = JSON.parse(cleaned);
		cleaned = String(parsedJson.hostUrl || parsedJson.remoteHostUrl || parsedJson.url || "").trim();
	} catch {}
	if (cleaned.toUpperCase().startsWith("DQSYNC|")) cleaned = cleaned.slice(7).trim();
	cleaned = cleaned.replace(/\/api\/lan-sync.*$/i, "").replace(/\/+$/, "");
	if (!cleaned) return "";
	if (!/^https?:\/\//i.test(cleaned)) {
		if (/^\d{1,3}(\.\d{1,3}){3}$/.test(cleaned)) cleaned = `http://${cleaned}:3000`;
		else if (/^[a-zA-Z0-9.-]+:\d+$/.test(cleaned)) cleaned = `http://${cleaned}`;
		else cleaned = `http://${cleaned}:3000`;
	} else try {
		const parsed = new URL(cleaned);
		if (!parsed.port && parsed.protocol === "http:" && /^\d{1,3}(\.\d{1,3}){3}$/.test(parsed.hostname)) {
			parsed.port = "3000";
			cleaned = parsed.origin;
		} else cleaned = parsed.origin;
	} catch {}
	return cleaned.replace(/\/+$/, "");
}
function loadLanSyncConfig() {
	const platform = detectClientPlatform();
	const isApk = isStandaloneCapacitorApk();
	const defaultDeviceId = `${platform}-${Math.random().toString(36).slice(2, 8)}`;
	const defaultDeviceName = platform === "android" ? "جهاز الأندرويد (Android POS)" : platform === "windows" ? "كمبيوتر الويندوز (Windows POS)" : "نقطة بيع المتصفح (Web POS)";
	try {
		if (typeof localStorage !== "undefined") {
			const raw = localStorage.getItem(LAN_SYNC_CONFIG_STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				const normalizedHost = normalizeLanHostUrl(parsed.hostUrl || parsed.remoteHostUrl || "");
				return {
					enabled: parsed.enabled !== void 0 ? Boolean(parsed.enabled) : !isApk,
					remoteHostUrl: normalizedHost,
					hostUrl: normalizedHost,
					deviceId: parsed.deviceId || defaultDeviceId,
					deviceName: parsed.deviceName || defaultDeviceName,
					platform: parsed.platform || platform,
					autoSyncOnEveryAction: parsed.autoSyncOnEveryAction !== void 0 ? Boolean(parsed.autoSyncOnEveryAction) : true
				};
			}
		}
	} catch {}
	const initial = {
		enabled: !isApk,
		remoteHostUrl: "",
		hostUrl: "",
		deviceId: defaultDeviceId,
		deviceName: defaultDeviceName,
		platform,
		autoSyncOnEveryAction: true
	};
	try {
		if (typeof localStorage !== "undefined") localStorage.setItem(LAN_SYNC_CONFIG_STORAGE_KEY, JSON.stringify(initial));
	} catch {}
	return initial;
}
function saveLanSyncConfig(updates) {
	const current = loadLanSyncConfig();
	const normalizedHost = normalizeLanHostUrl(updates.hostUrl !== void 0 ? updates.hostUrl : updates.remoteHostUrl !== void 0 ? updates.remoteHostUrl : current.hostUrl || current.remoteHostUrl);
	const next = {
		...current,
		...updates,
		remoteHostUrl: normalizedHost,
		hostUrl: normalizedHost
	};
	try {
		if (typeof localStorage !== "undefined") localStorage.setItem(LAN_SYNC_CONFIG_STORAGE_KEY, JSON.stringify(next));
		if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(LAN_SYNC_STATUS_EVENT, { detail: next }));
	} catch {}
	return next;
}
function resolveEffectiveLanBaseUrl(config) {
	if (!config.enabled) return null;
	const host = config.hostUrl || config.remoteHostUrl;
	if (host) return host;
	if (!isStandaloneCapacitorApk()) return "";
	return null;
}
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
/**
* Encodes an ASCII string (such as `192.168.1.15:3000`) into a binary bar pattern
* for rendering a scannable Code-128B SVG barcode on the Windows Laptop screen.
*/
function encodeCode128B(text) {
	const clean = text.trim();
	if (!clean) return "";
	const codes = [104];
	let checksum = 104;
	for (let i = 0; i < clean.length; i++) {
		const ascii = clean.charCodeAt(i);
		const val = ascii >= 32 && ascii <= 126 ? ascii - 32 : 0;
		codes.push(val);
		checksum += val * (i + 1);
	}
	const checkCode = checksum % 103;
	codes.push(checkCode);
	codes.push(106);
	return codes.map((c) => CODE128_PATTERNS[c] || "").join("");
}
// src/context/domains/useLanSyncDomain.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
function useLanSyncDomain({ currentCompany, settings, setSettings, products, setProducts, deletedProductIdsRef, transactions, setTransactions, expenses, setExpenses, customers, setCustomers, deletedCustomerIdsRef, stockMovements, setStockMovements, unmetDemandRequests, setUnmetDemandRequests, currencies, setCurrencies, exchangeRates, setExchangeRates, exchangeRateItems, setExchangeRateItems, exchangeRateHistory, branches, users, activeSessions, setLastSyncedAt }) {
	const [lanSyncConfig, setLanSyncConfig] = (0, import_react.useState)(() => loadLanSyncConfig());
	const [lanConnectionStatus, setLanConnectionStatus] = (0, import_react.useState)("connecting");
	const [lanConnectedDevices, setLanConnectedDevices] = (0, import_react.useState)([]);
	const [lanRecentEvents, setLanRecentEvents] = (0, import_react.useState)([]);
	const [lanNetworkAddresses, setLanNetworkAddresses] = (0, import_react.useState)([]);
	const [lanPrimaryHostUrl, setLanPrimaryHostUrl] = (0, import_react.useState)("");
	const [lanLastSyncError, setLanLastSyncError] = (0, import_react.useState)(null);
	const isApplyingRemoteLanSyncRef = (0, import_react.useRef)(false);
	const lanSyncRevisionRef = (0, import_react.useRef)(0);
	const lanPushDebounceTimerRef = (0, import_react.useRef)(null);
	const lanHasInitialHandshakedRef = (0, import_react.useRef)(false);
	const updateLanSyncConfig = (0, import_react.useCallback)((updates) => {
		const saved = saveLanSyncConfig(updates);
		setLanSyncConfig(saved);
		return saved;
	}, []);
	const applyIncomingLanSyncState = (0, import_react.useCallback)((remoteState, sourceDeviceId) => {
		if (!remoteState || typeof remoteState !== "object") return;
		if (sourceDeviceId && sourceDeviceId === lanSyncConfig.deviceId) {
			if (typeof remoteState.revision === "number") lanSyncRevisionRef.current = Math.max(lanSyncRevisionRef.current, remoteState.revision);
			return;
		}
		const incomingRev = Number(remoteState.revision || 0);
		if (incomingRev > 0 && incomingRev < lanSyncRevisionRef.current) return;
		isApplyingRemoteLanSyncRef.current = true;
		try {
			if (incomingRev > 0) lanSyncRevisionRef.current = incomingRev;
			const deletedProdSet = new Set(Array.isArray(remoteState.deletedProductIds) ? remoteState.deletedProductIds : []);
			deletedProdSet.forEach((id) => deletedProductIdsRef.current.add(id));
			const deletedCustSet = new Set(Array.isArray(remoteState.deletedCustomerIds) ? remoteState.deletedCustomerIds : []);
			deletedCustSet.forEach((id) => deletedCustomerIdsRef.current.add(id));
			if (Array.isArray(remoteState.products)) setProducts((prev) => {
				const byId = /* @__PURE__ */ new Map();
				for (const p of prev) if (p?.id && !deletedProdSet.has(p.id)) byId.set(p.id, p);
				for (const inc of remoteState.products) {
					if (!inc?.id || deletedProdSet.has(inc.id)) continue;
					const ex = byId.get(inc.id);
					if (!ex) byId.set(inc.id, inc);
					else {
						const exTime = Date.parse(ex.updatedAt || ex.createdAt || "") || 0;
						if ((Date.parse(inc.updatedAt || inc.createdAt || "") || 0) >= exTime) byId.set(inc.id, {
							...ex,
							...inc
						});
					}
				}
				return Array.from(byId.values());
			});
			if (Array.isArray(remoteState.transactions)) setTransactions((prev) => {
				const byId = /* @__PURE__ */ new Map();
				for (const t of prev) if (t?.id) byId.set(t.id, t);
				for (const inc of remoteState.transactions) {
					if (!inc?.id) continue;
					const ex = byId.get(inc.id);
					if (!ex) byId.set(inc.id, {
						...inc,
						syncStatus: "synced"
					});
					else {
						const exPaid = Number(ex.amountPaid || 0);
						const incPaid = Number(inc.amountPaid || 0);
						if (inc.status === "voided" || incPaid >= exPaid || inc.fulfillmentStatus !== ex.fulfillmentStatus) byId.set(inc.id, {
							...ex,
							...inc,
							syncStatus: "synced"
						});
					}
				}
				return Array.from(byId.values()).sort((a, b) => (Date.parse(b.timestamp || "") || 0) - (Date.parse(a.timestamp || "") || 0));
			});
			if (Array.isArray(remoteState.expenses)) setExpenses((prev) => {
				const byId = /* @__PURE__ */ new Map();
				for (const e of prev) if (e?.id) byId.set(e.id, e);
				for (const inc of remoteState.expenses) {
					if (!inc?.id) continue;
					const ex = byId.get(inc.id);
					if (!ex || inc.status === "voided") byId.set(inc.id, {
						...inc,
						syncStatus: "synced"
					});
					else byId.set(inc.id, {
						...ex,
						...inc,
						syncStatus: "synced"
					});
				}
				return Array.from(byId.values()).sort((a, b) => (Date.parse(b.timestamp || "") || 0) - (Date.parse(a.timestamp || "") || 0));
			});
			if (Array.isArray(remoteState.customers)) setCustomers((prev) => {
				const byId = /* @__PURE__ */ new Map();
				for (const c of prev) if (c?.id && !deletedCustSet.has(c.id)) byId.set(c.id, c);
				for (const inc of remoteState.customers) {
					if (!inc?.id || deletedCustSet.has(inc.id)) continue;
					const ex = byId.get(inc.id);
					if (!ex) byId.set(inc.id, inc);
					else byId.set(inc.id, {
						...ex,
						...inc
					});
				}
				return Array.from(byId.values());
			});
			if (Array.isArray(remoteState.stockMovements)) setStockMovements((prev) => {
				const byId = /* @__PURE__ */ new Map();
				for (const m of prev) if (m?.id) byId.set(m.id, m);
				for (const inc of remoteState.stockMovements) if (inc?.id) byId.set(inc.id, inc);
				return Array.from(byId.values()).sort((a, b) => (Date.parse(b.timestamp || "") || 0) - (Date.parse(a.timestamp || "") || 0));
			});
			if (Array.isArray(remoteState.unmetDemandRequests)) setUnmetDemandRequests((prev) => {
				const byId = /* @__PURE__ */ new Map();
				for (const r of prev) if (r?.id) byId.set(r.id, r);
				for (const inc of remoteState.unmetDemandRequests) if (inc?.id) byId.set(inc.id, inc);
				return Array.from(byId.values());
			});
			if (Array.isArray(remoteState.currencies) && remoteState.currencies.length > 0) setCurrencies((prev) => {
				const byCode = /* @__PURE__ */ new Map();
				for (const c of prev) if (c?.code) byCode.set(c.code.toUpperCase(), c);
				for (const inc of remoteState.currencies) if (inc?.code) byCode.set(inc.code.toUpperCase(), inc);
				return Array.from(byCode.values());
			});
			if (remoteState.exchangeRates && typeof remoteState.exchangeRates === "object") setExchangeRates((prev) => ({
				...prev,
				...remoteState.exchangeRates,
				SDG: 1
			}));
			if (Array.isArray(remoteState.exchangeRateItems) && remoteState.exchangeRateItems.length > 0) setExchangeRateItems((prev) => {
				const byKey = /* @__PURE__ */ new Map();
				for (const item of prev) if (item?.sourceCurrency && item?.targetCurrency) byKey.set(`${item.sourceCurrency}->${item.targetCurrency}`, item);
				for (const inc of remoteState.exchangeRateItems) if (inc?.sourceCurrency && inc?.targetCurrency) byKey.set(`${inc.sourceCurrency}->${inc.targetCurrency}`, inc);
				return Array.from(byKey.values());
			});
			if (Array.isArray(remoteState.categories) && remoteState.categories.length > 0) try {
				const catKey = getCompanyStorageKey("pos_categories", currentCompany.id);
				const rawExisting = localStorage.getItem(catKey) || localStorage.getItem("pos_categories");
				const existingCats = rawExisting ? JSON.parse(rawExisting) : [];
				const byName = /* @__PURE__ */ new Map();
				for (const c of existingCats) {
					const nameVal = typeof c === "string" ? c : c?.name || c?.id || "";
					const k = String(nameVal).trim().toLowerCase();
					if (k) byName.set(k, typeof c === "string" ? {
						id: k,
						name: c,
						nameAr: c
					} : c);
				}
				for (const inc of remoteState.categories) {
					const nameVal = typeof inc === "string" ? inc : inc?.name || inc?.id || "";
					const k = String(nameVal).trim().toLowerCase();
					if (k) {
						const incObj = typeof inc === "string" ? {
							id: k,
							name: inc,
							nameAr: inc
						} : inc;
						byName.set(k, {
							...byName.get(k) || {},
							...incObj
						});
					}
				}
				const mergedCatsJson = JSON.stringify(Array.from(byName.values()));
				localStorage.setItem(catKey, mergedCatsJson);
				localStorage.setItem("pos_categories", mergedCatsJson);
				if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("pos:categories-updated"));
			} catch {}
			if (remoteState.settings && typeof remoteState.settings === "object") setSettings((prev) => ({
				...prev,
				storeName: remoteState.settings.storeName || prev.storeName,
				storeNameAr: remoteState.settings.storeNameAr || prev.storeNameAr,
				currency: remoteState.settings.currency || prev.currency,
				taxRatePercent: typeof remoteState.settings.taxRatePercent === "number" ? remoteState.settings.taxRatePercent : prev.taxRatePercent,
				exchangeRates: {
					...prev.exchangeRates || {},
					...remoteState.settings.exchangeRates || {},
					...remoteState.exchangeRates || {},
					SDG: 1
				}
			}));
			setLastSyncedAt(/* @__PURE__ */ new Date());
		} finally {
			setTimeout(() => {
				isApplyingRemoteLanSyncRef.current = false;
			}, 400);
		}
	}, [
		lanSyncConfig.deviceId,
		currentCompany.id,
		deletedProductIdsRef,
		deletedCustomerIdsRef,
		setProducts,
		setTransactions,
		setExpenses,
		setCustomers,
		setStockMovements,
		setUnmetDemandRequests,
		setCurrencies,
		setExchangeRates,
		setExchangeRateItems,
		setSettings,
		setLastSyncedAt
	]);
	const pushLiveLanSyncNow = (0, import_react.useCallback)(async (summaryAr, summaryEn) => {
		const baseUrl = resolveEffectiveLanBaseUrl(lanSyncConfig);
		if (baseUrl === null) {
			setLanConnectionStatus("unconfigured");
			return false;
		}
		let localCategories = [];
		try {
			const rawCats = localStorage.getItem(getCompanyStorageKey("pos_categories", currentCompany.id));
			if (rawCats) localCategories = JSON.parse(rawCats);
		} catch {}
		try {
			const res = await fetch(`${baseUrl}/api/lan-sync/push`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					companyId: currentCompany.id,
					deviceId: lanSyncConfig.deviceId,
					deviceName: lanSyncConfig.deviceName,
					platform: lanSyncConfig.platform,
					summaryAr: summaryAr || "مزامنة حية للعمليات عبر الواي فاي",
					summaryEn: summaryEn || "Live Wi-Fi LAN operational sync",
					snapshot: {
						companyProfile: currentCompany,
						settings,
						products,
						deletedProductIds: Array.from(deletedProductIdsRef.current),
						transactions: transactions.map((t) => ({
							...t,
							syncStatus: "synced"
						})),
						expenses: expenses.map((e) => ({
							...e,
							syncStatus: "synced"
						})),
						customers,
						deletedCustomerIds: Array.from(deletedCustomerIdsRef.current),
						stockMovements,
						unmetDemandRequests,
						currencies,
						exchangeRates,
						exchangeRateItems,
						exchangeRateHistory,
						branches,
						users,
						activeSessions,
						categories: localCategories
					}
				})
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			if (typeof data?.revision === "number") lanSyncRevisionRef.current = Math.max(lanSyncRevisionRef.current, data.revision);
			if (data?.state) {
				const remoteProdsLen = Array.isArray(data.state.products) ? data.state.products.length : 0;
				const remoteTxLen = Array.isArray(data.state.transactions) ? data.state.transactions.length : 0;
				if (remoteProdsLen !== products.length || remoteTxLen !== transactions.length) applyIncomingLanSyncState(data.state);
			}
			if (Array.isArray(data?.connectedDevices)) setLanConnectedDevices(data.connectedDevices);
			if (Array.isArray(data?.state?.recentEvents)) setLanRecentEvents(data.state.recentEvents);
			else if (data?.event) setLanRecentEvents((prev) => [data.event, ...prev.filter((e) => e.id !== data.event.id).slice(0, 29)]);
			setLanConnectionStatus("connected");
			setLanLastSyncError(null);
			setLastSyncedAt(/* @__PURE__ */ new Date());
			return true;
		} catch (err) {
			setLanConnectionStatus("disconnected");
			setLanLastSyncError(err?.message || "LAN host unreachable");
			return false;
		}
	}, [
		lanSyncConfig,
		currentCompany,
		settings,
		products,
		deletedProductIdsRef,
		transactions,
		expenses,
		customers,
		deletedCustomerIdsRef,
		stockMovements,
		unmetDemandRequests,
		currencies,
		exchangeRates,
		exchangeRateItems,
		exchangeRateHistory,
		branches,
		users,
		activeSessions,
		applyIncomingLanSyncState,
		setLastSyncedAt
	]);
	(0, import_react.useEffect)(() => {
		if (!lanSyncConfig.enabled) {
			setLanConnectionStatus("disconnected");
			return;
		}
		const baseUrl = resolveEffectiveLanBaseUrl(lanSyncConfig);
		if (baseUrl === null) {
			setLanConnectionStatus("unconfigured");
			return;
		}
		setLanConnectionStatus((prev) => prev === "connecting" ? prev : "connecting");
		let eventSource = null;
		let isDisposed = false;
		let isSseOpen = false;
		let lastDevicesSig = "";
		let lastEventsSig = "";
		let lastAddressesSig = "";
		let lastPrimaryUrl = "";
		const applyDevicesIfChanged = (devices) => {
			const sig = devices.map((d) => `${d?.deviceId || ""}:${d?.lastSeenAt || ""}:${d?.ipAddress || ""}`).join("|");
			if (sig === lastDevicesSig) return;
			lastDevicesSig = sig;
			setLanConnectedDevices(devices);
		};
		const applyEventsIfChanged = (events) => {
			const sig = events.map((e) => `${e?.id || ""}:${e?.revision || ""}`).join("|");
			if (sig === lastEventsSig) return;
			lastEventsSig = sig;
			setLanRecentEvents(events);
		};
		const applyAddressesIfChanged = (addresses) => {
			const sig = addresses.map((a) => `${a?.url || ""}:${a?.interfaceName || ""}`).join("|");
			if (sig === lastAddressesSig) return;
			lastAddressesSig = sig;
			setLanNetworkAddresses(addresses);
		};
		const streamParams = new URLSearchParams({
			companyId: currentCompany.id,
			deviceId: lanSyncConfig.deviceId,
			deviceName: lanSyncConfig.deviceName,
			platform: lanSyncConfig.platform
		});
		try {
			eventSource = new EventSource(`${baseUrl}/api/lan-sync/stream?${streamParams.toString()}`);
			eventSource.onopen = () => {
				if (isDisposed) return;
				isSseOpen = true;
				setLanConnectionStatus((prev) => prev === "connected" ? prev : "connected");
				setLanLastSyncError((prev) => prev === null ? prev : null);
			};
			eventSource.onmessage = (ev) => {
				if (isDisposed || !ev.data) return;
				try {
					const payload = JSON.parse(ev.data);
					isSseOpen = true;
					setLanConnectionStatus((prev) => prev === "connected" ? prev : "connected");
					setLanLastSyncError((prev) => prev === null ? prev : null);
					if (payload.type === "init" || payload.type === "sync_update") {
						if (payload.state) applyIncomingLanSyncState(payload.state, payload.sourceDeviceId);
						if (Array.isArray(payload.connectedDevices)) applyDevicesIfChanged(payload.connectedDevices);
						if (Array.isArray(payload.recentEvents)) applyEventsIfChanged(payload.recentEvents);
						else if (payload.event) setLanRecentEvents((prev) => {
							const next = [payload.event, ...prev.filter((e) => e.id !== payload.event.id).slice(0, 29)];
							lastEventsSig = next.map((e) => `${e?.id || ""}:${e?.revision || ""}`).join("|");
							return next;
						});
					} else if (payload.type === "presence") {
						if (Array.isArray(payload.connectedDevices)) applyDevicesIfChanged(payload.connectedDevices);
					}
				} catch {}
			};
			eventSource.onerror = () => {
				if (isDisposed) return;
				isSseOpen = false;
			};
		} catch {}
		let tickCount = 0;
		const fetchLanInfoAndState = async () => {
			if (isDisposed) return;
			tickCount += 1;
			if (isSseOpen && tickCount > 1 && tickCount % 3 !== 0) return;
			try {
				const [infoRes, stateRes] = await Promise.all([fetch(`${baseUrl}/api/lan-sync/info?companyId=${encodeURIComponent(currentCompany.id)}`), fetch(`${baseUrl}/api/lan-sync/state?companyId=${encodeURIComponent(currentCompany.id)}&sinceRevision=${lanSyncRevisionRef.current}&deviceId=${encodeURIComponent(lanSyncConfig.deviceId)}&deviceName=${encodeURIComponent(lanSyncConfig.deviceName)}&platform=${encodeURIComponent(lanSyncConfig.platform)}`)]);
				if (infoRes.ok) {
					const infoData = await infoRes.json();
					if (Array.isArray(infoData?.addresses)) applyAddressesIfChanged(infoData.addresses);
					if (infoData?.primaryUrl && infoData.primaryUrl !== lastPrimaryUrl) {
						lastPrimaryUrl = infoData.primaryUrl;
						setLanPrimaryHostUrl(infoData.primaryUrl);
					}
					if (Array.isArray(infoData?.connectedDevices)) applyDevicesIfChanged(infoData.connectedDevices);
					if (Array.isArray(infoData?.recentEvents)) applyEventsIfChanged(infoData.recentEvents);
				}
				if (stateRes.ok) {
					const stateData = await stateRes.json();
					setLanConnectionStatus((prev) => prev === "connected" ? prev : "connected");
					setLanLastSyncError((prev) => prev === null ? prev : null);
					if (stateData?.hasUpdates && stateData?.state) applyIncomingLanSyncState(stateData.state);
					if (Array.isArray(stateData?.connectedDevices)) applyDevicesIfChanged(stateData.connectedDevices);
				} else setLanConnectionStatus((prev) => prev === "disconnected" ? prev : "disconnected");
			} catch (err) {
				if (!isDisposed) {
					isSseOpen = false;
					setLanConnectionStatus((prev) => prev === "disconnected" ? prev : "disconnected");
					const msg = err?.message || "Unable to reach Wi-Fi LAN Host";
					setLanLastSyncError((prev) => prev === msg ? prev : msg);
				}
			}
		};
		fetchLanInfoAndState();
		const pollInterval = setInterval(fetchLanInfoAndState, 4e3);
		return () => {
			isDisposed = true;
			clearInterval(pollInterval);
			if (eventSource) eventSource.close();
		};
	}, [
		lanSyncConfig.enabled,
		lanSyncConfig.hostUrl,
		lanSyncConfig.deviceId,
		lanSyncConfig.deviceName,
		lanSyncConfig.platform,
		currentCompany.id,
		applyIncomingLanSyncState
	]);
	const lastLanStateFingerprintRef = (0, import_react.useRef)("");
	(0, import_react.useEffect)(() => {
		if (!lanSyncConfig.enabled || !lanSyncConfig.autoSyncOnEveryAction) return;
		const fingerprint = JSON.stringify({
			c: currentCompany.id,
			p: products.map((p) => `${p.id}:${p.stock}:${p.sellingPrice}:${p.updatedAt || ""}`),
			t: transactions.map((t) => `${t.id}:${t.status}:${t.amountPaid || 0}:${t.fulfillmentStatus || ""}`),
			e: expenses.map((e) => `${e.id}:${e.status}:${e.amount}`),
			cu: customers.map((c) => `${c.id}:${c.totalDebt || 0}:${c.totalSpent || 0}`),
			m: stockMovements.length,
			u: unmetDemandRequests.length,
			cur: currencies.map((c) => `${c.code}:${c.isBase}`),
			r: exchangeRates,
			b: branches.length,
			usr: users.length
		});
		if (isApplyingRemoteLanSyncRef.current) {
			lastLanStateFingerprintRef.current = fingerprint;
			return;
		}
		if (fingerprint === lastLanStateFingerprintRef.current) return;
		lastLanStateFingerprintRef.current = fingerprint;
		if (resolveEffectiveLanBaseUrl(lanSyncConfig) === null) return;
		if (!lanHasInitialHandshakedRef.current) {
			lanHasInitialHandshakedRef.current = true;
			const initTimer = setTimeout(() => {
				if (!isApplyingRemoteLanSyncRef.current) pushLiveLanSyncNow("ربط ومزامنة أولية عبر الواي فاي", "Initial Wi-Fi LAN handshake sync");
			}, 600);
			return () => clearTimeout(initTimer);
		}
		if (lanPushDebounceTimerRef.current) clearTimeout(lanPushDebounceTimerRef.current);
		lanPushDebounceTimerRef.current = setTimeout(() => {
			if (!isApplyingRemoteLanSyncRef.current) pushLiveLanSyncNow();
		}, 350);
		return () => {
			if (lanPushDebounceTimerRef.current) clearTimeout(lanPushDebounceTimerRef.current);
		};
	}, [
		currentCompany.id,
		products,
		transactions,
		expenses,
		customers,
		stockMovements,
		unmetDemandRequests,
		currencies,
		exchangeRates,
		branches,
		users,
		lanSyncConfig.enabled,
		lanSyncConfig.autoSyncOnEveryAction,
		pushLiveLanSyncNow
	]);
	return {
		lanSyncConfig,
		updateLanSyncConfig,
		lanConnectionStatus,
		lanConnectedDevices,
		lanRecentEvents,
		lanNetworkAddresses,
		lanPrimaryHostUrl,
		lanLastSyncError,
		pushLiveLanSyncNow,
		applyIncomingLanSyncState
	};
}
// src/context/domains/useWorkspaceCompanyDomain.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
function useWorkspaceCompanyDomain({ workspaceMode, setWorkspaceMode, companies, setCompanies, currentCompanyId, setCurrentCompanyId, currentCompany, allBranches, setAllBranches, branches, setActiveBranchId, products, setProducts, transactions, setTransactions, expenses, setExpenses, customers, setCustomers, stockMovements, setStockMovements, users, setUsers, activeSessions, setActiveSessions, currentUserId, setCurrentUserId, currentUser, settings, setSettings, currencies, setCurrencies, exchangeRates, setExchangeRates, exchangeRateItems, setExchangeRateItems, exchangeRateHistory, setExchangeRateHistory, unmetDemandRequests, setUnmetDemandRequests, setCart, setSelectedCustomer, setGlobalDiscountPercent, setGlobalDiscountPercentState, setGlobalDiscountAmountState, sqliteCompanyScope, setSqliteDiagnostics, setIsSyncing, setLastSyncedAt }) {
	const [isOnboardingModalOpen, setIsOnboardingModalOpen] = (0, import_react.useState)(false);
	const [onboardingModalInitialView, setOnboardingModalInitialView] = (0, import_react.useState)("hub");
	const openOnboardingModal = (0, import_react.useCallback)((view = "hub") => {
		setOnboardingModalInitialView(view);
		setIsOnboardingModalOpen(true);
	}, []);
	const closeOnboardingModal = (0, import_react.useCallback)(() => {
		setIsOnboardingModalOpen(false);
	}, []);
	const [productionSnapshot, setProductionSnapshot] = (0, import_react.useState)(null);
	const enterPracticeMode = (0, import_react.useCallback)(async () => {
		if (workspaceMode !== "PRACTICE") setProductionSnapshot({
			products,
			transactions,
			expenses,
			customers,
			stockMovements,
			users,
			settings,
			currencies,
			exchangeRates,
			exchangeRateItems,
			exchangeRateHistory,
			unmetDemandRequests,
			currentUserId
		});
		setWorkspaceMode("PRACTICE");
		setCart([]);
		setSelectedCustomer(null);
		setGlobalDiscountPercentState(0);
		setGlobalDiscountAmountState(0);
		setCurrencies([...DEFAULT_CURRENCIES_LIST]);
		setExchangeRates({ ...DEFAULT_EXCHANGE_RATES_MAP });
		setExchangeRateItems(buildPracticeExchangeRateItems());
		setExchangeRateHistory(INITIAL_EXCHANGE_RATE_HISTORY);
		setSettings((prev) => ({
			...prev,
			storeName: PRACTICE_COMPANY_PROFILE.displayName,
			storeNameAr: PRACTICE_COMPANY_PROFILE.displayNameAr || PRACTICE_COMPANY_PROFILE.displayName,
			exchangeRates: { ...DEFAULT_EXCHANGE_RATES_MAP }
		}));
		setProducts(INITIAL_PRODUCTS.map((p, idx) => enrichProductWithSeedMetadata(p, idx)));
		setTransactions(INITIAL_TRANSACTIONS);
		setExpenses(INITIAL_EXPENSES);
		setCustomers(INITIAL_CUSTOMERS);
		setStockMovements(INITIAL_STOCK_MOVEMENTS);
		setUnmetDemandRequests(INITIAL_UNMET_DEMAND_REQUESTS);
		setUsers(INITIAL_USERS);
		setActiveSessions(INITIAL_ACTIVE_SESSIONS);
		setCurrentUserId("user-1");
		try {
			const res = await fetch("/api/onboarding/practice/state");
			if (res.ok) {
				const prac = (await res.json())?.data;
				if (prac) {
					if (Array.isArray(prac.products) && prac.products.length > 0) setProducts(prac.products);
					if (Array.isArray(prac.transactions)) setTransactions(prac.transactions);
					if (Array.isArray(prac.customers)) setCustomers(prac.customers);
					if (Array.isArray(prac.stockMovements)) setStockMovements(prac.stockMovements);
					if (Array.isArray(prac.users) && prac.users.length > 0) {
						setUsers(prac.users);
						setCurrentUserId(prac.users[0].id);
					}
					if (Array.isArray(prac.unmetDemandRequests)) setUnmetDemandRequests(prac.unmetDemandRequests);
				}
			}
		} catch {}
		setActiveBranchId("branch-practice-main");
		setIsOnboardingModalOpen(false);
		playSuccessChime(settings.soundEnabled);
		triggerHaptic("success", settings.hapticsEnabled);
	}, [
		workspaceMode,
		products,
		transactions,
		expenses,
		customers,
		stockMovements,
		users,
		settings,
		currencies,
		exchangeRates,
		exchangeRateItems,
		exchangeRateHistory,
		unmetDemandRequests,
		currentUserId,
		setActiveBranchId,
		setWorkspaceMode,
		setCart,
		setSelectedCustomer,
		setGlobalDiscountPercentState,
		setGlobalDiscountAmountState,
		setCurrencies,
		setExchangeRates,
		setExchangeRateItems,
		setExchangeRateHistory,
		setSettings,
		setProducts,
		setTransactions,
		setExpenses,
		setCustomers,
		setStockMovements,
		setUnmetDemandRequests,
		setUsers,
		setActiveSessions,
		setCurrentUserId
	]);
	const exitPracticeMode = (0, import_react.useCallback)(async () => {
		setWorkspaceMode("PRODUCTION");
		setCart([]);
		setSelectedCustomer(null);
		setGlobalDiscountPercentState(0);
		setGlobalDiscountAmountState(0);
		if (productionSnapshot) {
			setProducts(productionSnapshot.products);
			setTransactions(productionSnapshot.transactions);
			setExpenses(productionSnapshot.expenses || []);
			setCustomers(productionSnapshot.customers);
			setStockMovements(productionSnapshot.stockMovements);
			setUsers(productionSnapshot.users);
			setSettings(productionSnapshot.settings);
			setCurrencies(productionSnapshot.currencies);
			setExchangeRates(productionSnapshot.exchangeRates);
			setExchangeRateItems(productionSnapshot.exchangeRateItems);
			setExchangeRateHistory(productionSnapshot.exchangeRateHistory);
			setUnmetDemandRequests(productionSnapshot.unmetDemandRequests);
			setCurrentUserId(productionSnapshot.currentUserId || productionSnapshot.users[0]?.id || "unassigned-operator");
			const validIds = new Set(productionSnapshot.users.map((u) => u.id));
			setActiveSessions((prev) => prev.filter((s) => validIds.has(s.userId)));
		} else {
			const loaded = loadCompanyOperationalState(currentCompanyId);
			setProducts(loaded.products);
			setTransactions(loaded.transactions);
			setExpenses(loaded.expenses);
			setCustomers(loaded.customers);
			setStockMovements(loaded.stockMovements);
			setCurrencies(loaded.currencies);
			setExchangeRates(loaded.exchangeRates);
			setExchangeRateItems(loaded.exchangeRateItems);
			setExchangeRateHistory(loaded.exchangeRateHistory);
			setUnmetDemandRequests(loaded.unmetDemandRequests);
			setUsers(loaded.users);
			setActiveSessions(loaded.activeSessions);
			setCurrentUserId(loaded.users[0]?.id || "unassigned-operator");
		}
		setActiveBranchId("branch-main");
		triggerHaptic("medium", settings.hapticsEnabled);
	}, [
		productionSnapshot,
		currentCompanyId,
		settings.hapticsEnabled,
		setActiveBranchId,
		setWorkspaceMode,
		setCart,
		setSelectedCustomer,
		setGlobalDiscountPercentState,
		setGlobalDiscountAmountState,
		setProducts,
		setTransactions,
		setExpenses,
		setCustomers,
		setStockMovements,
		setUsers,
		setSettings,
		setCurrencies,
		setExchangeRates,
		setExchangeRateItems,
		setExchangeRateHistory,
		setUnmetDemandRequests,
		setCurrentUserId,
		setActiveSessions
	]);
	const resetPracticeModeData = (0, import_react.useCallback)(async () => {
		Object.values(PRACTICE_STORAGE_KEYS).forEach((k) => {
			try {
				localStorage.removeItem(k);
			} catch {}
		});
		if (workspaceMode === "PRACTICE") {
			setProducts(INITIAL_PRODUCTS.map((p, idx) => enrichProductWithSeedMetadata(p, idx)));
			setTransactions(INITIAL_TRANSACTIONS);
			setExpenses(INITIAL_EXPENSES);
			setCustomers(INITIAL_CUSTOMERS);
			setStockMovements(INITIAL_STOCK_MOVEMENTS);
			setUnmetDemandRequests(INITIAL_UNMET_DEMAND_REQUESTS);
			setCurrencies([...DEFAULT_CURRENCIES_LIST]);
			setExchangeRates({ ...DEFAULT_EXCHANGE_RATES_MAP });
			setExchangeRateItems(buildPracticeExchangeRateItems());
			setExchangeRateHistory(INITIAL_EXCHANGE_RATE_HISTORY);
			setUsers(INITIAL_USERS);
			setActiveSessions(INITIAL_ACTIVE_SESSIONS);
			setCurrentUserId("user-1");
		}
		try {
			const res = await fetch("/api/onboarding/practice/reset", {
				method: "POST",
				headers: { "Content-Type": "application/json" }
			});
			if (res.ok) {
				const prac = (await res.json())?.data?.state;
				if (prac && workspaceMode === "PRACTICE") {
					if (Array.isArray(prac.products)) setProducts(prac.products);
					if (Array.isArray(prac.transactions)) setTransactions(prac.transactions);
					if (Array.isArray(prac.customers)) setCustomers(prac.customers);
					if (Array.isArray(prac.stockMovements)) setStockMovements(prac.stockMovements);
					if (Array.isArray(prac.users) && prac.users.length > 0) {
						setUsers(prac.users);
						setCurrentUserId(prac.users[0].id);
					}
					if (Array.isArray(prac.unmetDemandRequests)) setUnmetDemandRequests(prac.unmetDemandRequests);
				}
			}
		} catch {}
		setCart([]);
		setSelectedCustomer(null);
		setGlobalDiscountPercentState(0);
		setGlobalDiscountAmountState(0);
		playSuccessChime(settings.soundEnabled);
		triggerHaptic("heavy", true);
	}, [
		workspaceMode,
		settings.soundEnabled,
		setProducts,
		setTransactions,
		setExpenses,
		setCustomers,
		setStockMovements,
		setUnmetDemandRequests,
		setCurrencies,
		setExchangeRates,
		setExchangeRateItems,
		setExchangeRateHistory,
		setUsers,
		setActiveSessions,
		setCurrentUserId,
		setCart,
		setSelectedCustomer,
		setGlobalDiscountPercentState,
		setGlobalDiscountAmountState
	]);
	const resetAllData = (0, import_react.useCallback)(() => {
		if (workspaceMode === "PRACTICE") {
			resetPracticeModeData();
			return;
		}
		const keysToRemove = [
			STORAGE_KEYS.PRODUCTS,
			STORAGE_KEYS.TRANSACTIONS,
			STORAGE_KEYS.CUSTOMERS,
			STORAGE_KEYS.MOVEMENTS,
			STORAGE_KEYS.SETTINGS,
			STORAGE_KEYS.CURRENCIES,
			STORAGE_KEYS.EXCHANGE_RATES,
			STORAGE_KEYS.EXCHANGE_RATE_ITEMS,
			STORAGE_KEYS.RATE_HISTORY,
			STORAGE_KEYS.UNMET_DEMAND_REQUESTS,
			STORAGE_KEYS.USERS,
			STORAGE_KEYS.ACTIVE_SESSIONS,
			STORAGE_KEYS.CURRENT_USER_ID,
			getCompanyStorageKey(STORAGE_KEYS.PRODUCTS, currentCompanyId),
			getCompanyStorageKey(STORAGE_KEYS.TRANSACTIONS, currentCompanyId),
			getCompanyStorageKey(STORAGE_KEYS.CUSTOMERS, currentCompanyId),
			getCompanyStorageKey(STORAGE_KEYS.MOVEMENTS, currentCompanyId),
			getCompanyStorageKey(STORAGE_KEYS.SETTINGS, currentCompanyId),
			getCompanyStorageKey(STORAGE_KEYS.CURRENCIES, currentCompanyId),
			getCompanyStorageKey(STORAGE_KEYS.EXCHANGE_RATES, currentCompanyId),
			getCompanyStorageKey(STORAGE_KEYS.EXCHANGE_RATE_ITEMS, currentCompanyId),
			getCompanyStorageKey(STORAGE_KEYS.RATE_HISTORY, currentCompanyId),
			getCompanyStorageKey(STORAGE_KEYS.UNMET_DEMAND_REQUESTS, currentCompanyId),
			getCompanyStorageKey(STORAGE_KEYS.USERS, currentCompanyId),
			getCompanyStorageKey(STORAGE_KEYS.ACTIVE_SESSIONS, currentCompanyId),
			STORAGE_KEYS.EXPENSES,
			getCompanyStorageKey(STORAGE_KEYS.EXPENSES, currentCompanyId)
		];
		for (const k of keysToRemove) try {
			localStorage.removeItem(k);
		} catch {}
		setProducts([]);
		setTransactions([]);
		setExpenses([]);
		setCustomers([]);
		setStockMovements([]);
		setCurrencies([]);
		setExchangeRates({ SDG: 1 });
		setExchangeRateItems([]);
		setExchangeRateHistory([]);
		setUnmetDemandRequests([]);
		setUsers([]);
		setActiveSessions([]);
		setCurrentUserId("unassigned-operator");
		setSettings((prev) => ({
			...prev,
			currency: "SDG",
			exchangeRates: { SDG: 1 }
		}));
		setCart([]);
		setSelectedCustomer(null);
		setGlobalDiscountPercent(0);
		playSuccessChime(settings.soundEnabled);
		triggerHaptic("heavy", true);
	}, [
		workspaceMode,
		currentCompanyId,
		resetPracticeModeData,
		setGlobalDiscountPercent,
		settings.soundEnabled,
		setProducts,
		setTransactions,
		setExpenses,
		setCustomers,
		setStockMovements,
		setCurrencies,
		setExchangeRates,
		setExchangeRateItems,
		setExchangeRateHistory,
		setUnmetDemandRequests,
		setUsers,
		setActiveSessions,
		setCurrentUserId,
		setSettings,
		setCart,
		setSelectedCustomer
	]);
	return {
		isOnboardingModalOpen,
		setIsOnboardingModalOpen,
		onboardingModalInitialView,
		openOnboardingModal,
		closeOnboardingModal,
		enterPracticeMode,
		exitPracticeMode,
		resetPracticeModeData,
		resetAllData,
		executeAuthorizedFactoryReset: (0, import_react.useCallback)(async (params) => {
			if (workspaceMode === "PRACTICE") {
				await resetPracticeModeData();
				return {
					ok: true,
					scope: "PRACTICE_MODE_RESET"
				};
			}
			if ((params.scope || "LOCAL_DEVICE_RESET") === "LOCAL_DEVICE_RESET") {
				try {
					await fetch("/api/onboarding/factory-reset", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"x-user-id": currentUser.id,
							"x-company-id": currentCompany.id
						},
						body: JSON.stringify({
							scope: "LOCAL_DEVICE_RESET",
							companyId: currentCompany.id,
							reason: params.reason || "Local device cache reset"
						})
					});
				} catch {}
				resetAllData();
				return {
					ok: true,
					scope: "LOCAL_DEVICE_RESET"
				};
			}
			const confirmName = String(params.confirmCompanyName || "").trim();
			const password = String(params.ownerPassword || "").trim();
			const expectedLegal = String(currentCompany.legalName || "").trim().toLowerCase();
			const expectedDisplay = String(currentCompany.displayName || "").trim().toLowerCase();
			const expectedAr = String(currentCompany.displayNameAr || "").trim().toLowerCase();
			const enteredLower = confirmName.toLowerCase();
			if (!enteredLower || enteredLower !== expectedLegal && enteredLower !== expectedDisplay && enteredLower !== expectedAr) return {
				ok: false,
				error: settings.language === "ar" ? "اسم الشركة المدخل للتأكيد لا يطابق اسم الشركة الحالية." : "Company name confirmation does not match the active company name."
			};
			if (!password) return {
				ok: false,
				error: settings.language === "ar" ? "يرجى إدخال كلمة مرور المالك أو الرمز السري لتأكيد إعادة ضبط المصنع." : "Owner password or PIN is required to authorize Company Factory Reset."
			};
			let serverDeletedCounts;
			try {
				const res = await fetch("/api/onboarding/factory-reset", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-user-id": currentUser.id,
						"x-company-id": currentCompany.id
					},
					body: JSON.stringify({
						scope: "COMPANY_FACTORY_RESET",
						companyId: currentCompany.id,
						confirmCompanyName: confirmName,
						ownerUsernameOrId: params.ownerUsernameOrId || currentUser.username || currentUser.id,
						ownerPassword: password,
						reason: params.reason || "Authorized Company Factory Reset"
					})
				});
				if (res.ok) serverDeletedCounts = (await res.json())?.data?.deletedCounts;
				else {
					const errPayload = await res.json().catch(() => null);
					if (errPayload?.code === "INVALID_OWNER_PASSWORD" || errPayload?.code === "COMPANY_NAME_CONFIRMATION_MISMATCH") return {
						ok: false,
						error: errPayload?.message || "Owner authentication failed."
					};
				}
			} catch {
				const localOwner = users.find((u) => u.companyId === currentCompany.id && (u.systemRole === "COMPANY_OWNER" || u.role === "admin"));
				if (localOwner && localOwner.pin && localOwner.pin !== password) return {
					ok: false,
					error: settings.language === "ar" ? "كلمة المرور أو رمز PIN للمالك غير صحيح." : "Invalid Owner password or PIN."
				};
			}
			const resetCompanyId = currentCompany.id;
			resetAllData();
			const remainingCompanies = companies.filter((c) => c.id !== resetCompanyId);
			setCompanies(remainingCompanies);
			setAllBranches((prev) => prev.filter((b) => b.companyId !== resetCompanyId));
			if (remainingCompanies.length > 0) setCurrentCompanyId(remainingCompanies[0].id);
			else {
				setCurrentCompanyId("comp-clean-store");
				setOnboardingModalInitialView("create-company");
				setIsOnboardingModalOpen(true);
			}
			return {
				ok: true,
				scope: "COMPANY_FACTORY_RESET",
				deletedCounts: serverDeletedCounts
			};
		}, [
			workspaceMode,
			resetPracticeModeData,
			currentUser,
			currentCompany,
			resetAllData,
			settings.language,
			users,
			companies,
			setCompanies,
			setAllBranches,
			setCurrentCompanyId
		]),
		createNewCompanyWorkspace: (0, import_react.useCallback)(async (input) => {
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			const suffix = Date.now().toString(36).slice(-5);
			const rawUserBase = String(input.baseCurrency || "").toUpperCase().trim();
			const skipInitialCurrencies = Boolean(input.skipInitialCurrencies);
			const cleanBase = rawUserBase || "SDG";
			const secondaryList = Array.isArray(input.secondaryCurrencies) ? input.secondaryCurrencies.map((c) => String(c).toUpperCase().trim()).filter(Boolean) : [];
			const rawRatesMap = input.initialExchangeRates && typeof input.initialExchangeRates === "object" ? input.initialExchangeRates : {};
			const localCompany = {
				id: `comp-${suffix}`,
				legalName: String(input.legalName || input.displayName || "").trim(),
				displayName: String(input.displayName || input.legalName || "").trim(),
				displayNameAr: String(input.displayNameAr || input.displayName || input.legalName || "").trim(),
				businessType: String(input.businessType || "").trim(),
				country: String(input.country || "").trim(),
				city: String(input.city || "").trim(),
				address: String(input.address || "").trim(),
				phone: String(input.phone || "").trim(),
				email: String(input.email || "").trim(),
				taxNumber: String(input.taxNumber || "").trim(),
				defaultLanguage: input.defaultLanguage === "en" ? "en" : "ar",
				timezone: String(input.timezone || "Africa/Khartoum"),
				fiscalYearStartMonth: Number(input.fiscalYearStartMonth) || 1,
				baseCurrency: cleanBase,
				secondaryCurrencies: secondaryList,
				exchangeRatePolicy: input.exchangeRatePolicy || "manual_daily",
				isDemoPractice: false,
				onboardingCompleted: true,
				createdAt: nowIso,
				updatedAt: nowIso
			};
			const localBranch = {
				id: `br-${suffix}-main`,
				companyId: localCompany.id,
				code: String(input.branchCode || `BR-${suffix.toUpperCase()}`).trim(),
				name: String(input.branchName || localCompany.displayName || "Main Branch").trim(),
				nameAr: String(input.branchNameAr || input.branchName || localCompany.displayNameAr || "الفرع الرئيسي").trim(),
				city: String(input.branchCity || localCompany.city || "").trim(),
				address: String(input.branchAddress || localCompany.address || "").trim(),
				phone: String(input.branchPhone || localCompany.phone || "").trim(),
				isMainBranch: true,
				isActive: true,
				createdAt: nowIso
			};
			const ownerCapabilities = deriveCapabilitiesFromUser({
				role: "admin",
				systemRole: "COMPANY_OWNER",
				permissions: { ...DEFAULT_ROLE_PERMISSIONS.admin }
			});
			const localOwner = {
				id: `usr-owner-${suffix}`,
				companyId: localCompany.id,
				branchId: localBranch.id,
				assignedBranchIds: [localBranch.id],
				name: String(input.ownerName || localCompany.displayName).trim(),
				nameAr: String(input.ownerNameAr || input.ownerName || localCompany.displayNameAr).trim(),
				username: String(input.ownerUsername || `owner.${suffix}`).trim(),
				email: String(input.ownerEmail || "").trim() || void 0,
				phone: String(input.ownerPhone || localCompany.phone || "").trim() || void 0,
				role: "admin",
				systemRole: "COMPANY_OWNER",
				capabilities: ownerCapabilities,
				pin: String(input.ownerPin || "1111").trim(),
				terminalName: `${localBranch.name} Terminal 01`,
				terminalNameAr: `نقطة بيع ${localBranch.nameAr}`,
				avatarColor: "#10b981",
				isActive: true,
				permissions: deriveLegacyPermissionsFromCapabilities(ownerCapabilities),
				lastActiveAt: nowIso
			};
			let finalCompany = localCompany;
			let finalBranch = localBranch;
			let finalOwner = localOwner;
			try {
				const res = await fetch("/api/onboarding/companies", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-user-id": currentUser.id,
						"x-company-id": currentCompany.id
					},
					body: JSON.stringify(input)
				});
				if (res.ok) {
					const payload = await res.json();
					if (payload?.data?.company) finalCompany = payload.data.company;
					if (payload?.data?.branch) finalBranch = payload.data.branch;
					if (payload?.data?.owner) finalOwner = payload.data.owner;
					if (payload?.data?.sessionToken) try {
						localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, payload.data.sessionToken);
					} catch {}
				}
			} catch {}
			const newCompanyCurrencies = [];
			const newCompanyRatesMap = {
				[cleanBase]: 1,
				SDG: 1
			};
			const newCompanyRateItems = [];
			if (!skipInitialCurrencies && rawUserBase.length >= 2) {
				const matchedBasePreset = DEFAULT_CURRENCIES_LIST.find((c) => c.code === rawUserBase);
				newCompanyCurrencies.push(matchedBasePreset ? {
					...matchedBasePreset,
					isBase: true,
					isActive: true
				} : {
					code: rawUserBase,
					name: rawUserBase,
					nameAr: rawUserBase,
					symbol: rawUserBase,
					decimalPlaces: 2,
					isBase: true,
					isActive: true
				});
			}
			for (const code of secondaryList) {
				if (skipInitialCurrencies) break;
				const cleanCode = code.toUpperCase().trim();
				const enteredRate = Number(rawRatesMap[cleanCode]);
				if (cleanCode && cleanCode !== cleanBase && !isNaN(enteredRate) && enteredRate > 0) {
					const matchedPreset = DEFAULT_CURRENCIES_LIST.find((c) => c.code === cleanCode);
					const curObj = matchedPreset ? {
						...matchedPreset,
						isBase: false,
						isActive: true
					} : {
						code: cleanCode,
						name: cleanCode,
						nameAr: cleanCode,
						symbol: cleanCode,
						decimalPlaces: 2,
						isBase: false,
						isActive: true
					};
					newCompanyCurrencies.push(curObj);
					newCompanyRatesMap[cleanCode] = enteredRate;
					newCompanyRateItems.push({
						id: `rate-${cleanCode.toLowerCase()}-${cleanBase.toLowerCase()}-${Date.now()}`,
						sourceCurrency: cleanCode,
						targetCurrency: cleanBase,
						rate: enteredRate,
						inverseRate: Math.round(1 / enteredRate * 1e6) / 1e6,
						effectiveFrom: nowIso,
						expiryDate: null,
						isActive: true,
						sourceSymbol: curObj.symbol,
						targetSymbol: newCompanyCurrencies[0]?.symbol || cleanBase,
						sourceName: curObj.name,
						targetName: newCompanyCurrencies[0]?.name || cleanBase
					});
				}
			}
			setCompanies((prev) => {
				const filtered = prev.filter((c) => c.id !== "comp-default");
				return filtered.some((c) => c.id === finalCompany.id) ? filtered.map((c) => c.id === finalCompany.id ? finalCompany : c) : [...filtered, finalCompany];
			});
			setCurrentCompanyId(finalCompany.id);
			setWorkspaceMode("PRODUCTION");
			setProducts([]);
			setTransactions([]);
			setExpenses([]);
			setCustomers([]);
			setStockMovements([]);
			setUnmetDemandRequests([]);
			setExchangeRateHistory([]);
			setCurrencies(newCompanyCurrencies);
			setExchangeRates(newCompanyRatesMap);
			setExchangeRateItems(newCompanyRateItems);
			setCart([]);
			setSelectedCustomer(null);
			setSettings((prev) => ({
				...prev,
				storeName: finalCompany.displayName || finalCompany.legalName,
				storeNameAr: finalCompany.displayNameAr || finalCompany.displayName,
				storeAddress: finalCompany.address || "",
				storePhone: finalCompany.phone || "",
				currency: finalCompany.baseCurrency || "SDG",
				language: finalCompany.defaultLanguage || prev.language,
				exchangeRates: newCompanyRatesMap
			}));
			setAllBranches((prev) => {
				return prev.some((b) => b.id === finalBranch.id) ? prev.map((b) => b.id === finalBranch.id ? finalBranch : b) : [...prev, finalBranch];
			});
			setActiveBranchId(finalBranch.id);
			if (Boolean(String(input.ownerName || "").trim() || String(input.ownerNameAr || "").trim())) {
				setUsers([finalOwner]);
				setCurrentUserId(finalOwner.id);
				setActiveSessions([{
					sessionId: `sess-${finalOwner.id}-${Date.now()}`,
					userId: finalOwner.id,
					userName: finalOwner.name,
					userNameAr: finalOwner.nameAr,
					role: finalOwner.role,
					terminalName: finalOwner.terminalName,
					terminalNameAr: finalOwner.terminalNameAr,
					startedAt: nowIso,
					lastPingAt: nowIso,
					status: "online"
				}]);
			} else {
				setUsers([]);
				setActiveSessions([]);
				setCurrentUserId("unassigned-operator");
			}
			setIsOnboardingModalOpen(false);
			playSuccessChime(settings.soundEnabled);
			triggerHaptic("success", settings.hapticsEnabled);
			return {
				ok: true,
				company: finalCompany,
				branch: finalBranch,
				owner: finalOwner
			};
		}, [
			currentUser.id,
			currentCompany.id,
			settings.soundEnabled,
			settings.hapticsEnabled,
			setActiveBranchId,
			setCompanies,
			setCurrentCompanyId,
			setWorkspaceMode,
			setProducts,
			setTransactions,
			setExpenses,
			setCustomers,
			setStockMovements,
			setUnmetDemandRequests,
			setExchangeRateHistory,
			setCurrencies,
			setExchangeRates,
			setExchangeRateItems,
			setCart,
			setSelectedCustomer,
			setSettings,
			setAllBranches,
			setUsers,
			setCurrentUserId,
			setActiveSessions
		]),
		switchCompanyWorkspace: (0, import_react.useCallback)(async (companyId, userId) => {
			if (companyId === "comp-demo-practice") {
				await enterPracticeMode();
				return;
			}
			if (workspaceMode === "PRACTICE") setWorkspaceMode("PRODUCTION");
			setCurrentCompanyId(companyId);
			const loaded = loadCompanyOperationalState(companyId);
			setProducts(loaded.products);
			setTransactions(loaded.transactions);
			setExpenses(loaded.expenses);
			setCustomers(loaded.customers);
			setStockMovements(loaded.stockMovements);
			setUnmetDemandRequests(loaded.unmetDemandRequests);
			setCurrencies(loaded.currencies);
			setExchangeRates(loaded.exchangeRates);
			setExchangeRateItems(loaded.exchangeRateItems);
			setExchangeRateHistory(loaded.exchangeRateHistory);
			setUsers(loaded.users);
			setActiveSessions(loaded.activeSessions);
			setCart([]);
			setSelectedCustomer(null);
			const targetCompany = companies.find((c) => c.id === companyId);
			if (targetCompany) setSettings((prev) => ({
				...prev,
				storeName: targetCompany.displayName || targetCompany.legalName,
				storeNameAr: targetCompany.displayNameAr || targetCompany.displayName,
				storeAddress: targetCompany.address || "",
				storePhone: targetCompany.phone || "",
				currency: targetCompany.baseCurrency || "SDG",
				exchangeRates: loaded.exchangeRates
			}));
			const companyBranches = allBranches.filter((b) => (b.companyId || "comp-default") === companyId);
			if (companyBranches.length > 0) setActiveBranchId(companyBranches[0].id);
			if (userId) setCurrentUserId(userId);
			else if (loaded.users.length > 0) setCurrentUserId(loaded.users[0].id);
			else setCurrentUserId("unassigned-operator");
			setIsOnboardingModalOpen(false);
			triggerHaptic("light", settings.hapticsEnabled);
		}, [
			workspaceMode,
			enterPracticeMode,
			companies,
			allBranches,
			settings.hapticsEnabled,
			setActiveBranchId,
			setWorkspaceMode,
			setCurrentCompanyId,
			setProducts,
			setTransactions,
			setExpenses,
			setCustomers,
			setStockMovements,
			setUnmetDemandRequests,
			setCurrencies,
			setExchangeRates,
			setExchangeRateItems,
			setExchangeRateHistory,
			setUsers,
			setActiveSessions,
			setCart,
			setSelectedCustomer,
			setSettings,
			setCurrentUserId
		]),
		createBranch: (0, import_react.useCallback)(async (input) => {
			const targetCompanyId = workspaceMode === "PRACTICE" ? "comp-demo-practice" : currentCompany.id;
			try {
				const res = await fetch("/api/branches", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-user-id": currentUser.id,
						"x-company-id": targetCompanyId
					},
					body: JSON.stringify({
						...input,
						companyId: targetCompanyId
					})
				});
				if (res.ok) {
					const created = (await res.json())?.data?.branch;
					if (created) {
						setAllBranches((prev) => [...prev, created]);
						playSuccessChime(settings.soundEnabled);
						triggerHaptic("success", settings.hapticsEnabled);
						return created;
					}
				}
			} catch {}
			const fallbackBranch = {
				id: `branch-${Date.now()}`,
				companyId: targetCompanyId,
				code: (input.code || `BR-0${branches.length + 1}`).toUpperCase(),
				name: input.name.trim(),
				nameAr: input.nameAr?.trim() || input.name.trim(),
				city: input.city?.trim() || "",
				address: input.address?.trim() || "",
				phone: input.phone?.trim() || "",
				isMainBranch: Boolean(input.isMainBranch),
				isActive: true,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			setAllBranches((prev) => [...prev, fallbackBranch]);
			playSuccessChime(settings.soundEnabled);
			triggerHaptic("success", settings.hapticsEnabled);
			return fallbackBranch;
		}, [
			workspaceMode,
			currentCompany.id,
			currentUser.id,
			branches.length,
			settings.soundEnabled,
			settings.hapticsEnabled,
			setAllBranches
		]),
		updateBranch: (0, import_react.useCallback)((branchId, updates) => {
			setAllBranches((prev) => prev.map((b) => b.id === branchId ? {
				...b,
				...updates
			} : b));
			triggerHaptic("light", settings.hapticsEnabled);
		}, [settings.hapticsEnabled, setAllBranches]),
		deleteBranch: (0, import_react.useCallback)((branchId) => {
			setAllBranches((prev) => prev.filter((b) => b.id !== branchId));
			triggerHaptic("medium", settings.hapticsEnabled);
		}, [settings.hapticsEnabled, setAllBranches]),
		syncTransactions: (0, import_react.useCallback)(async () => {
			setIsSyncing(true);
			triggerHaptic("light", settings.hapticsEnabled);
			try {
				const response = await fetch("/api/store-sync", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-workspace-mode": workspaceMode,
						"x-company-id": currentCompany.id
					},
					body: JSON.stringify({
						workspaceMode,
						companyId: currentCompany.id,
						transactions: transactions.map((t) => ({
							...t,
							syncStatus: "synced"
						})),
						customers,
						stockMovements,
						users,
						activeSessions,
						unmetDemandRequests
					})
				});
				if (response.ok) {
					const syncedData = await response.json();
					if (workspaceMode === "PRACTICE") {
						if (Array.isArray(syncedData.transactions) && syncedData.transactions.length > 0) setTransactions(syncedData.transactions.map((t) => ({
							...t,
							syncStatus: "synced"
						})));
						if (Array.isArray(syncedData.customers) && syncedData.customers.length > 0) setCustomers(syncedData.customers);
						if (Array.isArray(syncedData.stockMovements) && syncedData.stockMovements.length > 0) setStockMovements(syncedData.stockMovements);
						if (Array.isArray(syncedData.users) && syncedData.users.length > 0) setUsers(syncedData.users);
						if (Array.isArray(syncedData.activeSessions) && syncedData.activeSessions.length > 0) setActiveSessions(syncedData.activeSessions);
						if (Array.isArray(syncedData.products) && syncedData.products.length > 0) setProducts(syncedData.products);
					} else setTransactions((prev) => prev.map((t) => t.syncStatus !== "synced" ? {
						...t,
						syncStatus: "synced"
					} : t));
					await offlineSqliteStorage.markTransactionsSynced(sqliteCompanyScope);
					setSqliteDiagnostics(offlineSqliteStorage.getDiagnostics(sqliteCompanyScope));
				} else setTransactions((prev) => prev.map((t) => t.syncStatus !== "synced" ? {
					...t,
					syncStatus: "synced"
				} : t));
			} catch {} finally {
				setLastSyncedAt(/* @__PURE__ */ new Date());
				setIsSyncing(false);
				setSqliteDiagnostics(offlineSqliteStorage.getDiagnostics(sqliteCompanyScope));
				triggerHaptic("success", settings.hapticsEnabled);
			}
		}, [
			workspaceMode,
			currentCompany.id,
			sqliteCompanyScope,
			settings.hapticsEnabled,
			transactions,
			customers,
			stockMovements,
			users,
			activeSessions,
			unmetDemandRequests,
			setIsSyncing,
			setTransactions,
			setCustomers,
			setStockMovements,
			setUsers,
			setActiveSessions,
			setProducts,
			setSqliteDiagnostics,
			setLastSyncedAt
		])
	};
}
// src/context/domains/useCatalogAndCartDomain.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
function useCatalogAndCartDomain({ products, setProducts, cart, setCart, transactions, setTransactions, setExpenses, setCustomers, setStockMovements, selectedCustomer, setSelectedCustomer, globalDiscountPercent, setGlobalDiscountPercentState, globalDiscountAmount, setGlobalDiscountAmountState, settings, exchangeRates, currentUser, currentCompany, activeBranchId, commitCheckoutAtomic, voidTransactionAtomic }) {
	const deletedProductIdsRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const deletedCustomerIdsRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const productsByIdMap = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of products) map.set(p.id, p);
		return map;
	}, [products]);
	const productsMapRef = (0, import_react.useRef)(productsByIdMap);
	productsMapRef.current = productsByIdMap;
	const cartRef = (0, import_react.useRef)(cart);
	cartRef.current = cart;
	const hapticsEnabledRef = (0, import_react.useRef)(settings.hapticsEnabled);
	hapticsEnabledRef.current = settings.hapticsEnabled;
	const cartTotals = (0, import_react.useMemo)(() => {
		return calculateCartTotals(cart, settings.taxRatePercent, globalDiscountPercent, settings.isTaxInclusive, settings.currency, exchangeRates, globalDiscountAmount);
	}, [
		cart,
		settings.taxRatePercent,
		globalDiscountPercent,
		globalDiscountAmount,
		settings.isTaxInclusive,
		settings.currency,
		exchangeRates
	]);
	return {
		deletedProductIdsRef,
		deletedCustomerIdsRef,
		cartTotals,
		addToCart: (0, import_react.useCallback)((product, quantity = 1, saleUnit) => {
			const currentProduct = productsMapRef.current.get(product.id) || product;
			const pkg = getProductPackaging(currentProduct);
			const prevCart = cartRef.current;
			const existingItem = prevCart.find((item) => item.product.id === currentProduct.id);
			const resolvedUnit = pkg.enablePackaging && pkg.unitsPerPack > 1 ? saleUnit || existingItem?.selectedSaleUnit || pkg.defaultSaleUnit : "unit";
			const stockPerItem = resolvedUnit === "pack" ? pkg.unitsPerPack : 1;
			const newQty = (existingItem && (existingItem.selectedSaleUnit || "unit") === resolvedUnit ? existingItem.quantity : 0) + quantity;
			if (newQty * stockPerItem > currentProduct.stock) {
				triggerHaptic("warning", hapticsEnabledRef.current);
				return false;
			}
			const nextCart = existingItem ? prevCart.map((item) => item.product.id === currentProduct.id ? {
				...item,
				product: currentProduct,
				quantity: newQty,
				selectedSaleUnit: resolvedUnit
			} : item) : [...prevCart, {
				product: currentProduct,
				quantity,
				itemDiscountPercent: 0,
				selectedSaleUnit: resolvedUnit
			}];
			cartRef.current = nextCart;
			setCart(nextCart);
			triggerHaptic("light", hapticsEnabledRef.current);
			return true;
		}, [setCart]),
		updateCartQuantity: (0, import_react.useCallback)((productId, delta) => {
			setCart((prev) => {
				const next = prev.map((item) => {
					if (item.product.id === productId) {
						const freshProduct = productsMapRef.current.get(productId) || item.product;
						const pkg = getProductPackaging(freshProduct);
						const stockPerItem = pkg.enablePackaging && pkg.unitsPerPack > 1 && (item.selectedSaleUnit || pkg.defaultSaleUnit) === "pack" ? pkg.unitsPerPack : 1;
						const newQty = item.quantity + delta;
						if (newQty <= 0) return null;
						if (newQty * stockPerItem > freshProduct.stock) {
							triggerHaptic("warning", hapticsEnabledRef.current);
							return item;
						}
						return {
							...item,
							product: freshProduct,
							quantity: newQty
						};
					}
					return item;
				}).filter((item) => item !== null);
				cartRef.current = next;
				return next;
			});
			triggerHaptic("light", hapticsEnabledRef.current);
		}, [setCart]),
		setCartItemSaleUnit: (0, import_react.useCallback)((productId, saleUnit) => {
			setCart((prev) => {
				const next = prev.map((item) => {
					if (item.product.id !== productId) return item;
					const freshProduct = productsMapRef.current.get(productId) || item.product;
					const pkg = getProductPackaging(freshProduct);
					if (!pkg.enablePackaging || pkg.unitsPerPack <= 1) return {
						...item,
						product: freshProduct,
						selectedSaleUnit: "unit"
					};
					const stockPerItem = saleUnit === "pack" ? pkg.unitsPerPack : 1;
					const maxAffordableQty = Math.max(1, Math.floor(freshProduct.stock / stockPerItem));
					const clampedQty = Math.min(item.quantity, maxAffordableQty);
					return {
						...item,
						product: freshProduct,
						selectedSaleUnit: saleUnit,
						quantity: clampedQty
					};
				});
				cartRef.current = next;
				return next;
			});
			triggerHaptic("light", hapticsEnabledRef.current);
		}, [setCart]),
		setCartItemDiscount: (0, import_react.useCallback)((productId, discountPercent) => {
			setCart((prev) => {
				const next = prev.map((item) => item.product.id === productId ? {
					...item,
					itemDiscountPercent: Math.max(0, Math.min(100, discountPercent))
				} : item);
				cartRef.current = next;
				return next;
			});
		}, [setCart]),
		removeFromCart: (0, import_react.useCallback)((productId) => {
			setCart((prev) => {
				const next = prev.filter((item) => item.product.id !== productId);
				cartRef.current = next;
				return next;
			});
			triggerHaptic("medium", hapticsEnabledRef.current);
		}, [setCart]),
		clearCart: (0, import_react.useCallback)(() => {
			cartRef.current = [];
			setCart([]);
			setSelectedCustomer(null);
			setGlobalDiscountPercentState(0);
			setGlobalDiscountAmountState(0);
			triggerHaptic("medium", hapticsEnabledRef.current);
		}, [
			setCart,
			setSelectedCustomer,
			setGlobalDiscountPercentState,
			setGlobalDiscountAmountState
		]),
		processCheckout: (0, import_react.useCallback)(async (paymentMethod, amountTendered, details) => {
			const liveSyncedCart = cart.map((item) => {
				const latestProd = productsByIdMap.get(item.product.id);
				return latestProd ? {
					...item,
					product: latestProd
				} : item;
			});
			const validation = validateCheckout(liveSyncedCart, paymentMethod, amountTendered, cartTotals.grandTotal, details, {
				currency: settings.currency,
				language: settings.language
			});
			if (!validation.valid) {
				triggerHaptic("warning", settings.hapticsEnabled);
				return {
					success: false,
					error: validation.error
				};
			}
			const idempotencyKey = generateIdempotencyKey();
			const transactionId = generateTransactionId();
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			const requestedStatus = details?.paymentStatus || "paid";
			const breakdown = calculateDebtBreakdown(cartTotals.grandTotal, requestedStatus, details?.amountPaid !== void 0 ? details.amountPaid : amountTendered);
			const changeDue = paymentMethod === "cash" && breakdown.paymentStatus === "paid" ? Math.max(0, amountTendered - cartTotals.grandTotal) : 0;
			const activeCurrency = (settings.currency || "SDG").toUpperCase().trim();
			const baseSnapshot = {
				...DEFAULT_EXCHANGE_RATES_MAP,
				...exchangeRates,
				...details?.exchangeRatesSnapshot || {},
				SDG: 1
			};
			const rateUsedAtSale = details?.exchangeRateUsed && details.exchangeRateUsed > 0 ? Number(details.exchangeRateUsed) : activeCurrency === "SDG" ? Number(baseSnapshot["USD"] || 2700) : Number(baseSnapshot[activeCurrency] || 1);
			const newTransaction = {
				id: transactionId,
				idempotencyKey,
				timestamp: nowIso,
				currency: activeCurrency,
				exchangeRateUsed: rateUsedAtSale,
				exchangeRatesSnapshot: {
					...baseSnapshot,
					[activeCurrency === "SDG" ? "USD" : activeCurrency]: rateUsedAtSale,
					SDG: 1
				},
				items: liveSyncedCart.map((item) => {
					const unitPricing = getCartItemUnitPricing(item, settings.currency, exchangeRates, settings.language);
					return {
						productId: item.product.id,
						productName: item.product.name,
						sku: item.product.sku,
						quantity: item.quantity,
						unitPrice: unitPricing.unitPrice,
						discountPercent: item.itemDiscountPercent,
						total: calculateItemTotal(unitPricing.unitPrice, item.quantity, item.itemDiscountPercent),
						saleUnit: unitPricing.saleUnit,
						saleUnitLabel: unitPricing.unitLabel,
						unitsPerPack: unitPricing.packaging.unitsPerPack,
						stockDeducted: unitPricing.totalStockUnitsRequired
					};
				}),
				subtotal: cartTotals.subtotal,
				taxRatePercent: settings.taxRatePercent,
				taxAmount: cartTotals.taxAmount,
				discountAmount: cartTotals.discountAmount,
				grandTotal: cartTotals.grandTotal,
				paymentMethod,
				amountTendered: breakdown.paymentStatus === "paid" && paymentMethod === "cash" ? amountTendered : breakdown.amountPaid,
				changeDue: Math.round(changeDue * 100) / 100,
				paymentStatus: breakdown.paymentStatus,
				amountPaid: breakdown.amountPaid,
				debtAmount: breakdown.debtAmount,
				transferReference: details?.transferReference?.trim() || void 0,
				transferReceiptImage: details?.transferReceiptImage || details?.transferReceiptImages && details.transferReceiptImages[0] || void 0,
				transferReceiptImages: details?.transferReceiptImages && details.transferReceiptImages.length > 0 ? details.transferReceiptImages : details?.transferReceiptImage ? [details.transferReceiptImage] : void 0,
				fulfillmentType: details?.fulfillmentType || "goods_and_invoice",
				fulfillmentStatus: details?.fulfillmentStatus || (details?.fulfillmentType === "invoice_only" ? "pending_goods" : details?.fulfillmentType === "goods_only" ? "pending_invoice" : "received"),
				fulfilledAt: !details?.fulfillmentType || details?.fulfillmentType === "goods_and_invoice" ? nowIso : void 0,
				customerId: selectedCustomer?.id,
				customerName: selectedCustomer ? selectedCustomer.name : "Walk-in Customer",
				cashierName: `${settings.language === "ar" ? currentUser.nameAr || currentUser.name : currentUser.name} (${settings.language === "ar" ? currentUser.terminalNameAr || currentUser.terminalName : currentUser.terminalName})`,
				status: "completed",
				syncStatus: "synced"
			};
			commitCheckoutAtomic({
				cart: liveSyncedCart,
				newTransaction,
				selectedCustomerId: selectedCustomer?.id || null,
				grandTotal: cartTotals.grandTotal,
				debtAmount: breakdown.debtAmount,
				currency: settings.currency,
				exchangeRates,
				language: settings.language,
				nowIso
			});
			setCart([]);
			setSelectedCustomer(null);
			setGlobalDiscountPercentState(0);
			setGlobalDiscountAmountState(0);
			playSuccessChime(settings.soundEnabled);
			triggerHaptic("success", settings.hapticsEnabled);
			return {
				success: true,
				transaction: newTransaction
			};
		}, [
			cart,
			products,
			cartTotals,
			selectedCustomer,
			settings,
			exchangeRates,
			currentUser,
			commitCheckoutAtomic,
			setCart,
			setSelectedCustomer,
			setGlobalDiscountPercentState,
			setGlobalDiscountAmountState
		]),
		settleTransactionDebt: (0, import_react.useCallback)((transactionId, useIndexedNewRate = false, anchorCurrency = "USD", settlementDetails) => {
			const txn = transactions.find((t) => t.id === transactionId);
			if (!txn || txn.status === "voided") return false;
			if (!settlementDetails && (!txn.debtAmount || txn.debtAmount <= 0)) return false;
			const { updatedTransaction, settledDeltaInTxCurrency } = applyDebtSettlementPayment(txn, {
				...settlementDetails,
				useIndexedNewRate: settlementDetails?.useIndexedNewRate !== void 0 ? settlementDetails.useIndexedNewRate : useIndexedNewRate,
				anchorCurrency: settlementDetails?.anchorCurrency || anchorCurrency
			}, exchangeRates);
			setTransactions((prev) => prev.map((t) => t.id === transactionId ? updatedTransaction : t));
			if (txn.customerId && Math.abs(settledDeltaInTxCurrency) > 1e-4) setCustomers((prev) => prev.map((cust) => {
				if (cust.id === txn.customerId) {
					const prevDebt = cust.totalDebt || 0;
					return {
						...cust,
						totalDebt: Math.max(0, Math.round((prevDebt - settledDeltaInTxCurrency) * 100) / 100)
					};
				}
				return cust;
			}));
			playSuccessChime(settings.soundEnabled);
			triggerHaptic("success", settings.hapticsEnabled);
			return true;
		}, [
			transactions,
			exchangeRates,
			settings.soundEnabled,
			settings.hapticsEnabled,
			setTransactions,
			setCustomers
		]),
		updateTransactionFulfillment: (0, import_react.useCallback)((transactionId, fulfillmentStatus, fulfillmentType) => {
			const txn = transactions.find((t) => t.id === transactionId);
			if (!txn || txn.status === "voided") return false;
			setTransactions((prev) => prev.map((t) => {
				if (t.id !== transactionId) return t;
				return {
					...t,
					fulfillmentStatus,
					fulfillmentType: fulfillmentType || (fulfillmentStatus === "received" ? "goods_and_invoice" : fulfillmentStatus === "pending_goods" ? "invoice_only" : "goods_only"),
					fulfilledAt: fulfillmentStatus === "received" ? (/* @__PURE__ */ new Date()).toISOString() : t.fulfilledAt
				};
			}));
			playSuccessChime(settings.soundEnabled);
			triggerHaptic("success", settings.hapticsEnabled);
			return true;
		}, [
			transactions,
			settings.soundEnabled,
			settings.hapticsEnabled,
			setTransactions
		]),
		applyNewRateToTransaction: (0, import_react.useCallback)((transactionId, anchorCurrency = "USD") => {
			const txn = transactions.find((t) => t.id === transactionId);
			if (!txn || txn.status === "voided") return false;
			const repriced = repriceTransactionToNewRate(txn, exchangeRates, anchorCurrency);
			const oldDebt = txn.debtAmount || 0;
			const newDebt = repriced.debtAmount || 0;
			const debtDelta = Math.round((newDebt - oldDebt) * 100) / 100;
			setTransactions((prev) => prev.map((t) => t.id === transactionId ? repriced : t));
			if (txn.customerId && Math.abs(debtDelta) > 1e-4) setCustomers((prev) => prev.map((cust) => {
				if (cust.id === txn.customerId) {
					const prevDebt = cust.totalDebt || 0;
					return {
						...cust,
						totalDebt: Math.max(0, Math.round((prevDebt + debtDelta) * 100) / 100)
					};
				}
				return cust;
			}));
			playSuccessChime(settings.soundEnabled);
			triggerHaptic("light", settings.hapticsEnabled);
			return true;
		}, [
			transactions,
			exchangeRates,
			settings.soundEnabled,
			settings.hapticsEnabled,
			setTransactions,
			setCustomers
		]),
		lockTransactionSaleRate: (0, import_react.useCallback)((transactionId, saleRateToSdg, referenceCurrency = "USD") => {
			const txn = transactions.find((t) => t.id === transactionId);
			if (!txn || txn.status === "voided" || !Number.isFinite(saleRateToSdg) || saleRateToSdg <= 0) return false;
			const updated = lockTransactionSaleExchangeRate(txn, saleRateToSdg, referenceCurrency);
			setTransactions((prev) => prev.map((t) => t.id === transactionId ? updated : t));
			playSuccessChime(settings.soundEnabled);
			triggerHaptic("light", settings.hapticsEnabled);
			return true;
		}, [
			transactions,
			settings.soundEnabled,
			settings.hapticsEnabled,
			setTransactions
		]),
		applyNewRateToAllTransactions: (0, import_react.useCallback)((onlyDebt = false, anchorCurrency = "USD") => {
			let updatedCount = 0;
			const customerDebtDeltas = {};
			setTransactions((prev) => prev.map((t) => {
				if (t.status === "voided") return t;
				if (onlyDebt && (!t.debtAmount || t.debtAmount <= 0)) return t;
				const repriced = repriceTransactionToNewRate(t, exchangeRates, anchorCurrency);
				if (Math.abs(repriced.grandTotal - t.grandTotal) > 1e-4 || Math.abs((repriced.debtAmount || 0) - (t.debtAmount || 0)) > 1e-4 || repriced.exchangeRateUsed !== t.exchangeRateUsed) {
					updatedCount += 1;
					if (t.customerId) {
						const delta = (repriced.debtAmount || 0) - (t.debtAmount || 0);
						customerDebtDeltas[t.customerId] = (customerDebtDeltas[t.customerId] || 0) + delta;
					}
				}
				return repriced;
			}));
			if (Object.keys(customerDebtDeltas).length > 0) setCustomers((prev) => prev.map((cust) => {
				const delta = customerDebtDeltas[cust.id];
				if (!delta) return cust;
				const prevDebt = cust.totalDebt || 0;
				return {
					...cust,
					totalDebt: Math.max(0, Math.round((prevDebt + delta) * 100) / 100)
				};
			}));
			if (updatedCount > 0) {
				playSuccessChime(settings.soundEnabled);
				triggerHaptic("success", settings.hapticsEnabled);
			}
			return updatedCount;
		}, [
			exchangeRates,
			settings.soundEnabled,
			settings.hapticsEnabled,
			setTransactions,
			setCustomers
		]),
		voidTransaction: (0, import_react.useCallback)((transactionId) => {
			const txn = transactions.find((t) => t.id === transactionId);
			if (!txn || txn.status === "voided") return false;
			voidTransactionAtomic(transactionId, (/* @__PURE__ */ new Date()).toISOString());
			triggerHaptic("medium", settings.hapticsEnabled);
			return true;
		}, [
			transactions,
			settings.hapticsEnabled,
			voidTransactionAtomic
		]),
		addProduct: (0, import_react.useCallback)(async (productData) => {
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			const actorName = settings.language === "ar" ? currentUser.nameAr || currentUser.name : currentUser.name;
			const nextSerial = productData.serialNumber && Number(productData.serialNumber) > 0 ? Math.floor(Number(productData.serialNumber)) : getNextProductSerialNumber(products);
			const audit = buildProductAuditTrail({
				existingProduct: null,
				nextProduct: productData,
				changedBy: actorName,
				nowIso
			});
			const enrichedPayload = {
				...productData,
				serialNumber: nextSerial,
				createdAt: productData.createdAt || audit.createdAt,
				priceUpdatedAt: audit.priceUpdatedAt,
				priceHistory: productData.priceHistory && productData.priceHistory.length > 0 ? productData.priceHistory : audit.priceHistory,
				modificationHistory: productData.modificationHistory && productData.modificationHistory.length > 0 ? productData.modificationHistory : audit.modificationHistory,
				customFields: {
					...productData.customFields || {},
					serialNumber: nextSerial,
					description: productData.description || productData.customFields?.description,
					descriptionAr: productData.descriptionAr || productData.customFields?.descriptionAr,
					createdAt: productData.createdAt || audit.createdAt,
					priceUpdatedAt: audit.priceUpdatedAt,
					priceHistory: productData.priceHistory && productData.priceHistory.length > 0 ? productData.priceHistory : audit.priceHistory,
					modificationHistory: productData.modificationHistory && productData.modificationHistory.length > 0 ? productData.modificationHistory : audit.modificationHistory,
					changedBy: actorName
				}
			};
			let created;
			try {
				const apiRes = await api.createProduct(enrichedPayload);
				created = {
					...apiRes,
					...enrichedPayload,
					id: apiRes.id,
					updatedAt: apiRes.updatedAt || nowIso
				};
			} catch (err) {
				if (err?.message?.includes("Duplicate")) throw err;
				console.warn("Backend API createProduct failed, saving locally:", err);
				created = {
					...enrichedPayload,
					id: `prod-${Date.now()}`,
					updatedAt: nowIso
				};
			}
			setProducts((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
			if (created.stock > 0) setStockMovements((prev) => [{
				id: `mov_init_${created.id}`,
				timestamp: nowIso,
				productId: created.id,
				productName: created.name,
				type: "restock",
				quantityChange: created.stock,
				previousStock: 0,
				newStock: created.stock,
				reason: `Initial Product Stock In (${actorName})`
			}, ...prev]);
			triggerHaptic("success", settings.hapticsEnabled);
			return created;
		}, [
			products,
			currentUser,
			settings.language,
			settings.hapticsEnabled,
			setProducts,
			setStockMovements
		]),
		updateProduct: (0, import_react.useCallback)(async (id, updates) => {
			const existing = productsByIdMap.get(id) || null;
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			const actorName = settings.language === "ar" ? currentUser.nameAr || currentUser.name : currentUser.name;
			const audit = buildProductAuditTrail({
				existingProduct: existing,
				nextProduct: updates,
				changedBy: actorName,
				nowIso
			});
			const nextSerial = updates.serialNumber !== void 0 ? Number(updates.serialNumber) : existing ? getProductSerialNumber(existing) : void 0;
			const enrichedUpdates = {
				...updates,
				serialNumber: nextSerial,
				createdAt: existing?.createdAt || audit.createdAt,
				previousCostPrice: audit.previousCostPrice,
				previousSellingPrice: audit.previousSellingPrice,
				priceUpdatedAt: audit.priceUpdatedAt,
				priceHistory: audit.priceHistory,
				modificationHistory: audit.modificationHistory,
				customFields: {
					...existing?.customFields || {},
					...updates.customFields || {},
					serialNumber: nextSerial,
					description: updates.description !== void 0 ? updates.description : existing?.description || existing?.customFields?.description,
					descriptionAr: updates.descriptionAr !== void 0 ? updates.descriptionAr : existing?.descriptionAr || existing?.customFields?.descriptionAr,
					createdAt: existing?.createdAt || audit.createdAt,
					previousCostPrice: audit.previousCostPrice,
					previousSellingPrice: audit.previousSellingPrice,
					priceUpdatedAt: audit.priceUpdatedAt,
					priceHistory: audit.priceHistory,
					modificationHistory: audit.modificationHistory,
					changedBy: actorName
				}
			};
			try {
				const apiUpdated = await api.updateProduct(id, enrichedUpdates);
				const mergedUpdated = {
					...existing || {},
					...apiUpdated,
					...enrichedUpdates,
					updatedAt: nowIso
				};
				setProducts((prev) => prev.map((p) => p.id === id ? mergedUpdated : p));
				setCart((prev) => prev.map((item) => item.product.id === id ? {
					...item,
					product: mergedUpdated
				} : item));
				triggerHaptic("light", settings.hapticsEnabled);
				return mergedUpdated;
			} catch (err) {
				if (err?.message?.includes("Duplicate")) throw err;
				console.warn("Backend API updateProduct failed, applying local update:", err);
				setProducts((prev) => prev.map((p) => p.id === id ? {
					...p,
					...enrichedUpdates,
					updatedAt: nowIso
				} : p));
				setCart((prev) => prev.map((item) => item.product.id === id ? {
					...item,
					product: {
						...item.product,
						...enrichedUpdates,
						updatedAt: nowIso
					}
				} : item));
				triggerHaptic("light", settings.hapticsEnabled);
			}
		}, [
			productsByIdMap,
			currentUser,
			settings.language,
			settings.hapticsEnabled,
			setProducts,
			setCart
		]),
		deleteProduct: (0, import_react.useCallback)(async (id) => {
			deletedProductIdsRef.current.add(id);
			try {
				await api.deleteProduct(id);
			} catch (err) {
				console.warn("Backend API deleteProduct failed, removing locally:", err);
			}
			setProducts((prev) => prev.filter((p) => p.id !== id));
			setCart((prev) => prev.filter((item) => item.product.id !== id));
			triggerHaptic("medium", settings.hapticsEnabled);
		}, [
			settings.hapticsEnabled,
			setProducts,
			setCart
		]),
		recordStockAdjustment: (0, import_react.useCallback)((productId, type, amount, reason) => {
			const prod = productsByIdMap.get(productId);
			if (!prod) return;
			const newStock = calculateStockAdjustment(prod.stock, type, amount);
			const delta = newStock - prod.stock;
			const movement = {
				id: `mov_${Date.now()}`,
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				productId: prod.id,
				productName: prod.name,
				type,
				quantityChange: delta,
				previousStock: prod.stock,
				newStock,
				reason: reason || "Manual Stock Adjustment"
			};
			setProducts((prev) => prev.map((p) => p.id === productId ? {
				...p,
				stock: newStock,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			} : p));
			setStockMovements((prev) => [movement, ...prev]);
			triggerHaptic("medium", settings.hapticsEnabled);
		}, [
			productsByIdMap,
			settings.hapticsEnabled,
			setProducts,
			setStockMovements
		]),
		recordGoodsReceipt: (0, import_react.useCallback)((input) => {
			const prod = productsByIdMap.get(input.productId);
			if (!prod || input.quantity <= 0) return false;
			const qty = Math.round(input.quantity);
			const newStock = input.receiptMode === "invoice_only" ? prod.stock : prod.stock + qty;
			const receiptCurrency = (input.currency || settings.currency || "SDG").toString().toUpperCase().trim();
			const prodCurrency = (prod.priceCurrency || prod.customFields?.priceCurrency || "SDG").toString().toUpperCase().trim();
			let nextCostPrice = prod.costPrice;
			if (input.updateProductCost && input.unitCost && input.unitCost > 0) nextCostPrice = convertCurrencyAmount(input.unitCost, receiptCurrency, prodCurrency, exchangeRates);
			const reasonParts = [input.receiptMode === "goods_and_invoice" ? "Goods & Invoice Receipt" : input.receiptMode === "goods_only" ? "Goods Receipt Only" : "Purchase Invoice Recorded (Goods Pending)"];
			if (input.invoiceNumber?.trim()) reasonParts.push(`#${input.invoiceNumber.trim()}`);
			if (input.supplierName?.trim()) reasonParts.push(`Supplier: ${input.supplierName.trim()}`);
			if (input.notes?.trim()) reasonParts.push(input.notes.trim());
			const movement = {
				id: `mov_rcpt_${Date.now()}`,
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				productId: prod.id,
				productName: prod.name,
				type: "restock",
				quantityChange: input.receiptMode === "invoice_only" ? 0 : qty,
				previousStock: prod.stock,
				newStock,
				reason: reasonParts.join(" • "),
				referenceId: input.invoiceNumber?.trim() || void 0,
				receiptMode: input.receiptMode,
				supplierName: input.supplierName?.trim() || void 0,
				invoiceNumber: input.invoiceNumber?.trim() || void 0,
				unitCost: input.unitCost,
				currency: receiptCurrency
			};
			setProducts((prev) => prev.map((p) => p.id === prod.id ? {
				...p,
				stock: newStock,
				costPrice: nextCostPrice,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			} : p));
			setStockMovements((prev) => [movement, ...prev]);
			playSuccessChime(settings.soundEnabled);
			triggerHaptic("success", settings.hapticsEnabled);
			return true;
		}, [
			products,
			settings.currency,
			settings.soundEnabled,
			settings.hapticsEnabled,
			exchangeRates,
			setProducts,
			setStockMovements
		]),
		addCustomer: (0, import_react.useCallback)((customerData) => {
			const newCust = {
				...customerData,
				id: `cust-${Date.now()}`,
				totalSpent: 0,
				transactionCount: 0,
				loyaltyPoints: 0,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			setCustomers((prev) => [newCust, ...prev]);
			triggerHaptic("success", settings.hapticsEnabled);
			return newCust;
		}, [settings.hapticsEnabled, setCustomers]),
		updateCustomer: (0, import_react.useCallback)((id, updates) => {
			setCustomers((prev) => prev.map((c) => c.id === id ? {
				...c,
				...updates
			} : c));
			triggerHaptic("light", settings.hapticsEnabled);
		}, [settings.hapticsEnabled, setCustomers]),
		deleteCustomer: (0, import_react.useCallback)((id) => {
			deletedCustomerIdsRef.current.add(id);
			setCustomers((prev) => prev.filter((c) => c.id !== id));
			setSelectedCustomer((prev) => prev?.id === id ? null : prev);
			triggerHaptic("medium", settings.hapticsEnabled);
		}, [
			settings.hapticsEnabled,
			setCustomers,
			setSelectedCustomer
		]),
		addExpense: (0, import_react.useCallback)((input) => {
			const validation = validateExpenseInput(input, settings.language);
			if (!validation.valid) return {
				ok: false,
				error: validation.error
			};
			const expCurrency = (input.currency || settings.currency || "SDG").toString().toUpperCase().trim();
			const liveRates = {
				SDG: 1,
				...exchangeRates || {}
			};
			const rateUsed = input.exchangeRateUsed && input.exchangeRateUsed > 0 ? Number(input.exchangeRateUsed) : expCurrency !== "SDG" ? Number(liveRates[expCurrency] || 1) : Number(liveRates["USD"] || 2700);
			const newExpense = {
				id: generateExpenseId(),
				companyId: currentCompany.id,
				branchId: activeBranchId,
				timestamp: input.timestamp || (/* @__PURE__ */ new Date()).toISOString(),
				title: input.title.trim(),
				category: input.category || "other",
				amount: Math.round(Number(input.amount) * 100) / 100,
				currency: expCurrency,
				exchangeRateUsed: rateUsed,
				exchangeRatesSnapshot: liveRates,
				paymentMethod: input.paymentMethod || "cash",
				transferReference: input.transferReference?.trim() || void 0,
				receiptImage: input.receiptImage?.trim() || void 0,
				beneficiary: input.beneficiary?.trim() || void 0,
				notes: input.notes?.trim() || void 0,
				recordedBy: currentUser?.name || "POS Operator",
				status: "recorded",
				syncStatus: offlineSqliteStorage.isOnline() ? "synced" : "pending_sync"
			};
			setExpenses((prev) => [newExpense, ...prev]);
			playSuccessChime(settings.soundEnabled);
			triggerHaptic("success", settings.hapticsEnabled);
			return {
				ok: true,
				expense: newExpense
			};
		}, [
			settings.language,
			settings.currency,
			settings.soundEnabled,
			settings.hapticsEnabled,
			exchangeRates,
			currentCompany.id,
			activeBranchId,
			currentUser?.name,
			setExpenses
		]),
		updateExpense: (0, import_react.useCallback)((id, updates) => {
			let updated = false;
			setExpenses((prev) => prev.map((exp) => {
				if (exp.id !== id) return exp;
				updated = true;
				return {
					...exp,
					...updates,
					title: updates.title !== void 0 ? updates.title.trim() : exp.title,
					amount: updates.amount !== void 0 && Number(updates.amount) > 0 ? Math.round(Number(updates.amount) * 100) / 100 : exp.amount
				};
			}));
			if (updated) triggerHaptic("light", settings.hapticsEnabled);
			return updated;
		}, [settings.hapticsEnabled, setExpenses]),
		voidExpense: (0, import_react.useCallback)((id) => {
			let changed = false;
			setExpenses((prev) => prev.map((exp) => {
				if (exp.id !== id) return exp;
				changed = true;
				return {
					...exp,
					status: exp.status === "voided" ? "recorded" : "voided"
				};
			}));
			if (changed) triggerHaptic("medium", settings.hapticsEnabled);
			return changed;
		}, [settings.hapticsEnabled, setExpenses]),
		deleteExpense: (0, import_react.useCallback)((id) => {
			setExpenses((prev) => prev.filter((exp) => exp.id !== id));
			triggerHaptic("medium", settings.hapticsEnabled);
		}, [settings.hapticsEnabled, setExpenses])
	};
}
// src/context/domains/usePersistStorageState.ts
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
/**
* Unified hook that persists a company-scoped (or practice-mode) state slice to `localStorage`
* and optionally triggers a secondary side-effect (such as SQLite outbox or currency helper sync).
*/
function usePersistCompanyScopedSlice({ value, workspaceMode, currentCompanyId, prodBaseKey, practiceKey, mirrorGlobalProdKey = true, onAfterPersist }) {
	(0, import_react.useEffect)(() => {
		persistCompanyScopedSlice({
			value,
			workspaceMode,
			currentCompanyId,
			prodBaseKey,
			practiceKey,
			mirrorGlobalProdKey
		});
		if (onAfterPersist) onAfterPersist(value);
	}, [
		value,
		workspaceMode,
		currentCompanyId,
		prodBaseKey,
		practiceKey,
		mirrorGlobalProdKey
	]);
}
/**
* Unified hook that persists a standalone key/value to `localStorage`.
*/
function usePersistStorageValue(key, value, options) {
	const rawString = options?.rawString;
	const enabled = options?.enabled;
	const onAfterPersist = options?.onAfterPersist;
	(0, import_react.useEffect)(() => {
		persistStorageValue(key, value, {
			rawString,
			enabled
		});
		if (enabled !== false && onAfterPersist) onAfterPersist(value);
	}, [
		key,
		value,
		rawString,
		enabled
	]);
}
// src/context/POSContext.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var import_jsx_runtime = require_jsx_runtime();
function operationalLedgerReducer(state, action) {
	switch (action.type) {
		case "SET_PRODUCTS": {
			const nextProducts = typeof action.updater === "function" ? action.updater(state.products) : action.updater;
			return nextProducts === state.products ? state : {
				...state,
				products: nextProducts
			};
		}
		case "SET_TRANSACTIONS": {
			const nextTransactions = typeof action.updater === "function" ? action.updater(state.transactions) : action.updater;
			return nextTransactions === state.transactions ? state : {
				...state,
				transactions: nextTransactions
			};
		}
		case "SET_CUSTOMERS": {
			const nextCustomers = typeof action.updater === "function" ? action.updater(state.customers) : action.updater;
			return nextCustomers === state.customers ? state : {
				...state,
				customers: nextCustomers
			};
		}
		case "SET_STOCK_MOVEMENTS": {
			const nextStockMovements = typeof action.updater === "function" ? action.updater(state.stockMovements) : action.updater;
			return nextStockMovements === state.stockMovements ? state : {
				...state,
				stockMovements: nextStockMovements
			};
		}
		case "COMMIT_CHECKOUT_ATOMIC": {
			const next = computeAtomicCheckoutStateTransition(state, action.payload);
			return {
				products: next.products,
				transactions: next.transactions,
				customers: next.customers,
				stockMovements: next.stockMovements
			};
		}
		case "VOID_TRANSACTION_ATOMIC": {
			const next = computeAtomicVoidTransactionStateTransition(state, action.payload);
			if (!next.voided) return state;
			return {
				products: next.products,
				transactions: next.transactions,
				customers: next.customers,
				stockMovements: next.stockMovements
			};
		}
		default: return state;
	}
}
var POSContext = (0, import_react.createContext)(null);
var POSProvider = ({ children }) => {
	(0, import_react.useState)(() => ensureCleanProductionMigration());
	const [workspaceMode, setWorkspaceMode] = (0, import_react.useState)(() => {
		try {
			return localStorage.getItem(STORAGE_KEYS.WORKSPACE_MODE) === "PRACTICE" ? "PRACTICE" : "PRODUCTION";
		} catch {
			return "PRODUCTION";
		}
	});
	const [companies, setCompanies] = (0, import_react.useState)(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEYS.COMPANIES);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) return parsed.filter((c) => c && !c.isDemoPractice && c.id !== "comp-default");
			}
		} catch {}
		return [];
	});
	const [currentCompanyId, setCurrentCompanyId] = (0, import_react.useState)(() => {
		try {
			const savedId = localStorage.getItem(STORAGE_KEYS.CURRENT_COMPANY_ID);
			if (savedId && savedId !== "comp-default") return savedId;
			const savedCompanies = localStorage.getItem(STORAGE_KEYS.COMPANIES);
			if (savedCompanies) {
				const parsed = JSON.parse(savedCompanies);
				if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.id) return parsed[0].id;
			}
		} catch {}
		return "comp-clean-store";
	});
	const currentCompany = (0, import_react.useMemo)(() => {
		if (workspaceMode === "PRACTICE") return PRACTICE_COMPANY_PROFILE;
		const found = companies.find((c) => c.id === currentCompanyId && !c.isDemoPractice) || companies.find((c) => !c.isDemoPractice);
		if (found) return found;
		return {
			...DEFAULT_COMPANY_PROFILE,
			id: currentCompanyId || "comp-clean-store"
		};
	}, [
		workspaceMode,
		companies,
		currentCompanyId
	]);
	const initialCompanyData = (0, import_react.useMemo)(() => loadCompanyOperationalState(currentCompanyId, workspaceMode), [currentCompanyId, workspaceMode]);
	const [ledgerState, dispatchLedger] = (0, import_react.useReducer)(operationalLedgerReducer, void 0, () => {
		if (workspaceMode === "PRACTICE") {
			let pracProducts = INITIAL_PRODUCTS.map((p, idx) => enrichProductWithSeedMetadata(p, idx));
			let pracTransactions = INITIAL_TRANSACTIONS;
			let pracCustomers = INITIAL_CUSTOMERS;
			let pracMovements = INITIAL_STOCK_MOVEMENTS;
			try {
				const sp = localStorage.getItem(PRACTICE_STORAGE_KEYS.PRODUCTS);
				if (sp) pracProducts = JSON.parse(sp);
			} catch {}
			try {
				const st = localStorage.getItem(PRACTICE_STORAGE_KEYS.TRANSACTIONS);
				if (st) pracTransactions = JSON.parse(st);
			} catch {}
			try {
				const sc = localStorage.getItem(PRACTICE_STORAGE_KEYS.CUSTOMERS);
				if (sc) pracCustomers = JSON.parse(sc);
			} catch {}
			try {
				const sm = localStorage.getItem(PRACTICE_STORAGE_KEYS.MOVEMENTS);
				if (sm) pracMovements = JSON.parse(sm);
			} catch {}
			return {
				products: pracProducts,
				transactions: pracTransactions,
				customers: pracCustomers,
				stockMovements: pracMovements
			};
		}
		return {
			products: initialCompanyData.products,
			transactions: initialCompanyData.transactions,
			customers: initialCompanyData.customers,
			stockMovements: initialCompanyData.stockMovements
		};
	});
	const { products, transactions, customers, stockMovements } = ledgerState;
	const setProducts = (0, import_react.useCallback)((updater) => {
		dispatchLedger({
			type: "SET_PRODUCTS",
			updater
		});
	}, []);
	const setTransactions = (0, import_react.useCallback)((updater) => {
		dispatchLedger({
			type: "SET_TRANSACTIONS",
			updater
		});
	}, []);
	const setCustomers = (0, import_react.useCallback)((updater) => {
		dispatchLedger({
			type: "SET_CUSTOMERS",
			updater
		});
	}, []);
	const setStockMovements = (0, import_react.useCallback)((updater) => {
		dispatchLedger({
			type: "SET_STOCK_MOVEMENTS",
			updater
		});
	}, []);
	const commitCheckoutAtomic = (0, import_react.useCallback)((payload) => {
		dispatchLedger({
			type: "COMMIT_CHECKOUT_ATOMIC",
			payload
		});
	}, []);
	const voidTransactionAtomic = (0, import_react.useCallback)((transactionId, nowIso) => {
		dispatchLedger({
			type: "VOID_TRANSACTION_ATOMIC",
			payload: {
				transactionId,
				nowIso
			}
		});
	}, []);
	const [users, setUsers] = (0, import_react.useState)(() => {
		if (workspaceMode === "PRACTICE") {
			try {
				const stored = localStorage.getItem(PRACTICE_STORAGE_KEYS.USERS);
				if (stored) return JSON.parse(stored);
			} catch {}
			return INITIAL_USERS;
		}
		return initialCompanyData.users;
	});
	const [activeSessions, setActiveSessions] = (0, import_react.useState)(() => {
		if (workspaceMode === "PRACTICE") return INITIAL_ACTIVE_SESSIONS;
		return initialCompanyData.activeSessions;
	});
	const [currentUserId, setCurrentUserId] = (0, import_react.useState)(() => {
		if (workspaceMode === "PRACTICE") return "user-1";
		try {
			const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
			if (saved && !DEMO_SEED_USER_IDS.has(saved)) return saved;
		} catch {}
		return initialCompanyData.users[0]?.id || "unassigned-operator";
	});
	const currentUser = (0, import_react.useMemo)(() => {
		const found = users.find((u) => u.id === currentUserId) || users[0];
		if (found) return found;
		if (workspaceMode === "PRACTICE") return INITIAL_USERS[0];
		const fullCaps = deriveCapabilitiesFromUser({
			role: "admin",
			systemRole: "COMPANY_OWNER",
			permissions: { ...DEFAULT_ROLE_PERMISSIONS.admin }
		});
		return {
			id: "unassigned-operator",
			companyId: currentCompany.id,
			branchId: `branch-${currentCompany.id}-main`,
			assignedBranchIds: [`branch-${currentCompany.id}-main`],
			name: "No Account Added",
			nameAr: "لم يتم إضافة حساب",
			username: "",
			role: "admin",
			systemRole: "COMPANY_OWNER",
			capabilities: fullCaps,
			pin: "",
			terminalName: "POS Terminal",
			terminalNameAr: "نقطة بيع",
			avatarColor: "#f59e0b",
			isActive: true,
			permissions: { ...DEFAULT_ROLE_PERMISSIONS.admin },
			lastActiveAt: (/* @__PURE__ */ new Date()).toISOString()
		};
	}, [
		users,
		currentUserId,
		workspaceMode,
		currentCompany.id
	]);
	const [expenses, setExpenses] = (0, import_react.useState)(() => {
		if (workspaceMode === "PRACTICE") {
			try {
				const stored = localStorage.getItem(PRACTICE_STORAGE_KEYS.EXPENSES);
				if (stored) return JSON.parse(stored);
			} catch {}
			return INITIAL_EXPENSES;
		}
		return initialCompanyData.expenses;
	});
	const [currencies, setCurrencies] = (0, import_react.useState)(() => {
		if (workspaceMode === "PRACTICE") return [...DEFAULT_CURRENCIES_LIST];
		return initialCompanyData.currencies;
	});
	const [exchangeRates, setExchangeRates] = (0, import_react.useState)(() => {
		if (workspaceMode === "PRACTICE") return { ...DEFAULT_EXCHANGE_RATES_MAP };
		return initialCompanyData.exchangeRates;
	});
	const [exchangeRateItems, setExchangeRateItems] = (0, import_react.useState)(() => {
		if (workspaceMode === "PRACTICE") return buildPracticeExchangeRateItems();
		return initialCompanyData.exchangeRateItems;
	});
	const [exchangeRateHistory, setExchangeRateHistory] = (0, import_react.useState)(() => {
		if (workspaceMode === "PRACTICE") return INITIAL_EXCHANGE_RATE_HISTORY;
		return initialCompanyData.exchangeRateHistory;
	});
	const [settings, setSettings] = (0, import_react.useState)(() => {
		if (workspaceMode === "PRACTICE") return {
			...INITIAL_SETTINGS,
			storeName: PRACTICE_COMPANY_PROFILE.displayName,
			storeNameAr: PRACTICE_COMPANY_PROFILE.displayNameAr,
			exchangeRates: { ...DEFAULT_EXCHANGE_RATES_MAP }
		};
		try {
			const stored = localStorage.getItem(getCompanyStorageKey(STORAGE_KEYS.SETTINGS, currentCompanyId)) || localStorage.getItem(STORAGE_KEYS.SETTINGS);
			if (stored) {
				const parsed = JSON.parse(stored);
				return {
					...INITIAL_SETTINGS,
					...parsed,
					exchangeRates: initialCompanyData.exchangeRates
				};
			}
		} catch {}
		return {
			...INITIAL_SETTINGS,
			storeName: currentCompany.displayName || "متجر جديد",
			storeNameAr: currentCompany.displayNameAr || "متجر جديد",
			storeAddress: currentCompany.address || "",
			storePhone: currentCompany.phone || "",
			exchangeRates: initialCompanyData.exchangeRates
		};
	});
	const [cart, setCart] = (0, import_react.useState)([]);
	const [activeTab, setActiveTab] = (0, import_react.useState)("checkout");
	const [pendingNewProductBarcode, setPendingNewProductBarcode] = (0, import_react.useState)(null);
	const [selectedCustomer, setSelectedCustomer] = (0, import_react.useState)(null);
	const [globalDiscountPercent, setGlobalDiscountPercentState] = (0, import_react.useState)(0);
	const [globalDiscountAmount, setGlobalDiscountAmountState] = (0, import_react.useState)(0);
	const [isSyncing, setIsSyncing] = (0, import_react.useState)(false);
	const [unmetDemandRequests, setUnmetDemandRequests] = (0, import_react.useState)(() => {
		if (workspaceMode === "PRACTICE") {
			try {
				const stored = localStorage.getItem(PRACTICE_STORAGE_KEYS.UNMET_DEMAND_REQUESTS);
				if (stored) return JSON.parse(stored);
			} catch {}
			return INITIAL_UNMET_DEMAND_REQUESTS;
		}
		return initialCompanyData.unmetDemandRequests;
	});
	const [allBranches, setAllBranches] = (0, import_react.useState)(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEYS.BRANCHES);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.length > 0) return parsed;
			}
		} catch {}
		return [];
	});
	const branches = (0, import_react.useMemo)(() => {
		const targetCompanyId = workspaceMode === "PRACTICE" ? "comp-demo-practice" : currentCompany.id;
		const filtered = allBranches.filter((b) => (b.companyId || "comp-default") === targetCompanyId);
		if (filtered.length > 0) return filtered;
		if (workspaceMode === "PRACTICE") return [{
			id: "branch-practice-main",
			companyId: "comp-demo-practice",
			code: "PRAC-01",
			name: "Practice Main Showroom",
			nameAr: "صالة العرض التجريبية الرئيسية",
			city: "Khartoum",
			isMainBranch: true,
			isActive: true
		}, {
			id: "branch-practice-2",
			companyId: "comp-demo-practice",
			code: "PRAC-02",
			name: "Practice North Branch",
			nameAr: "فرع التدريب الشمالي",
			city: "Bahri",
			isMainBranch: false,
			isActive: true
		}];
		return [{
			id: `branch-${currentCompany.id}-main`,
			companyId: currentCompany.id,
			code: "MAIN-01",
			name: currentCompany.displayName || "Main Branch",
			nameAr: currentCompany.displayNameAr || "الفرع الرئيسي",
			city: currentCompany.city || "",
			isMainBranch: true,
			isActive: true
		}];
	}, [
		allBranches,
		workspaceMode,
		currentCompany
	]);
	const [activeBranchId, setActiveBranchIdState] = (0, import_react.useState)(() => {
		try {
			return localStorage.getItem(STORAGE_KEYS.ACTIVE_BRANCH_ID) || "branch-main";
		} catch {
			return "branch-main";
		}
	});
	const setActiveBranchId = (0, import_react.useCallback)((branchId) => {
		setActiveBranchIdState(branchId);
		try {
			localStorage.setItem(STORAGE_KEYS.ACTIVE_BRANCH_ID, branchId);
		} catch {}
	}, []);
	const openAddProductWithBarcode = (0, import_react.useCallback)((code) => {
		const clean = String(code ?? "").trim();
		if (!clean) return;
		setPendingNewProductBarcode(clean);
		setActiveTab("products");
	}, []);
	const setGlobalDiscountPercent = (0, import_react.useCallback)((discount) => {
		const safePercent = Math.max(0, Math.min(100, Number(discount) || 0));
		setGlobalDiscountPercentState(safePercent);
		setGlobalDiscountAmountState(0);
	}, []);
	const setGlobalDiscountAmount = (0, import_react.useCallback)((amount) => {
		const safeAmount = Math.max(0, Number(amount) || 0);
		setGlobalDiscountAmountState(safeAmount);
		if (safeAmount > 0) setGlobalDiscountPercentState(0);
	}, []);
	const [lastSyncedAt, setLastSyncedAt] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	(0, import_react.useEffect)(() => {
		if (workspaceMode === "PRACTICE") fetch("/api/onboarding/practice/state").then((res) => res.ok ? res.json() : null).then((payload) => {
			const prac = payload?.data;
			if (!prac) return;
			if (Array.isArray(prac.products) && prac.products.length > 0) setProducts(prac.products);
			if (Array.isArray(prac.transactions)) setTransactions(prac.transactions);
			if (Array.isArray(prac.customers)) setCustomers(prac.customers);
			if (Array.isArray(prac.stockMovements)) setStockMovements(prac.stockMovements);
			if (Array.isArray(prac.users) && prac.users.length > 0) {
				setUsers(prac.users);
				setCurrentUserId(prac.users[0].id);
			}
			if (Array.isArray(prac.unmetDemandRequests)) setUnmetDemandRequests(prac.unmetDemandRequests);
		}).catch(() => {});
	}, []);
	usePersistCompanyScopedSlice({
		value: products,
		workspaceMode,
		currentCompanyId,
		prodBaseKey: STORAGE_KEYS.PRODUCTS,
		practiceKey: PRACTICE_STORAGE_KEYS.PRODUCTS
	});
	usePersistCompanyScopedSlice({
		value: users,
		workspaceMode,
		currentCompanyId,
		prodBaseKey: STORAGE_KEYS.USERS,
		practiceKey: PRACTICE_STORAGE_KEYS.USERS
	});
	usePersistCompanyScopedSlice({
		value: activeSessions,
		workspaceMode,
		currentCompanyId,
		prodBaseKey: STORAGE_KEYS.ACTIVE_SESSIONS
	});
	usePersistStorageValue(STORAGE_KEYS.CURRENT_USER_ID, currentUserId, {
		rawString: true,
		enabled: workspaceMode === "PRODUCTION"
	});
	usePersistStorageValue(STORAGE_KEYS.WORKSPACE_MODE, workspaceMode, { rawString: true });
	const lastLoadedCompanyIdRef = (0, import_react.useRef)(currentCompanyId);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(STORAGE_KEYS.CURRENT_COMPANY_ID, currentCompanyId);
		} catch {}
		if (workspaceMode === "PRODUCTION" && lastLoadedCompanyIdRef.current !== currentCompanyId) {
			lastLoadedCompanyIdRef.current = currentCompanyId;
			setProducts(initialCompanyData.products);
			setTransactions(initialCompanyData.transactions);
			setExpenses(initialCompanyData.expenses);
			setCustomers(initialCompanyData.customers);
			setStockMovements(initialCompanyData.stockMovements);
			setUnmetDemandRequests(initialCompanyData.unmetDemandRequests);
			setCurrencies(initialCompanyData.currencies);
			setExchangeRates(initialCompanyData.exchangeRates);
			setExchangeRateItems(initialCompanyData.exchangeRateItems);
			setExchangeRateHistory(initialCompanyData.exchangeRateHistory);
			setUsers(initialCompanyData.users);
			setActiveSessions(initialCompanyData.activeSessions);
		}
	}, [
		currentCompanyId,
		workspaceMode,
		initialCompanyData,
		setProducts,
		setTransactions,
		setCustomers,
		setStockMovements
	]);
	usePersistStorageValue(STORAGE_KEYS.COMPANIES, companies);
	usePersistStorageValue(STORAGE_KEYS.BRANCHES, allBranches);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const handleStorageSync = (e) => {
			applyCrossTabStorageEvent(e, workspaceMode, currentCompanyId, {
				setProducts,
				setTransactions,
				setCustomers,
				setExpenses,
				setStockMovements,
				setUsers,
				setActiveSessions,
				setUnmetDemandRequests
			});
		};
		window.addEventListener("storage", handleStorageSync);
		return () => window.removeEventListener("storage", handleStorageSync);
	}, [
		workspaceMode,
		currentCompanyId,
		setProducts,
		setTransactions,
		setCustomers,
		setStockMovements
	]);
	usePersistCompanyScopedSlice({
		value: unmetDemandRequests,
		workspaceMode,
		currentCompanyId,
		prodBaseKey: STORAGE_KEYS.UNMET_DEMAND_REQUESTS,
		practiceKey: PRACTICE_STORAGE_KEYS.UNMET_DEMAND_REQUESTS
	});
	const sqliteCompanyScope = workspaceMode === "PRACTICE" ? PRACTICE_COMPANY_PROFILE.id : currentCompanyId;
	const [sqliteDiagnostics, setSqliteDiagnostics] = (0, import_react.useState)(() => offlineSqliteStorage.getDiagnostics(sqliteCompanyScope));
	const updateSqliteDiagnosticsIfChanged = (0, import_react.useCallback)((nextDiag) => {
		setSqliteDiagnostics((prev) => {
			if (prev.engineType === nextDiag.engineType && prev.isInitialized === nextDiag.isInitialized && prev.isDeviceOnline === nextDiag.isDeviceOnline && prev.companyId === nextDiag.companyId && prev.totalPersistedTransactions === nextDiag.totalPersistedTransactions && prev.pendingOfflineTransactions === nextDiag.pendingOfflineTransactions && prev.pendingOutboxCount === nextDiag.pendingOutboxCount && prev.lastPersistedAt === nextDiag.lastPersistedAt) return prev;
			return nextDiag;
		});
	}, []);
	(0, import_react.useEffect)(() => {
		let active = true;
		offlineSqliteStorage.loadTransactions(sqliteCompanyScope).then((sqliteTxs) => {
			if (!active || !Array.isArray(sqliteTxs) || sqliteTxs.length === 0) {
				if (active) updateSqliteDiagnosticsIfChanged(offlineSqliteStorage.getDiagnostics(sqliteCompanyScope));
				return;
			}
			setTransactions((prev) => {
				const map = /* @__PURE__ */ new Map();
				for (const t of sqliteTxs) if (t?.id) map.set(t.id, t);
				for (const t of prev) if (t?.id) map.set(t.id, t);
				return Array.from(map.values()).sort((a, b) => (Date.parse(b.timestamp || "") || 0) - (Date.parse(a.timestamp || "") || 0));
			});
			updateSqliteDiagnosticsIfChanged(offlineSqliteStorage.getDiagnostics(sqliteCompanyScope));
		}).catch(() => {});
		return () => {
			active = false;
		};
	}, [sqliteCompanyScope, updateSqliteDiagnosticsIfChanged]);
	usePersistCompanyScopedSlice({
		value: transactions,
		workspaceMode,
		currentCompanyId,
		prodBaseKey: STORAGE_KEYS.TRANSACTIONS,
		practiceKey: PRACTICE_STORAGE_KEYS.TRANSACTIONS,
		onAfterPersist: (txs) => {
			offlineSqliteStorage.persistTransactions(sqliteCompanyScope, txs).then(() => {
				updateSqliteDiagnosticsIfChanged(offlineSqliteStorage.getDiagnostics(sqliteCompanyScope));
			}).catch(() => {});
		}
	});
	usePersistCompanyScopedSlice({
		value: expenses,
		workspaceMode,
		currentCompanyId,
		prodBaseKey: STORAGE_KEYS.EXPENSES,
		practiceKey: PRACTICE_STORAGE_KEYS.EXPENSES,
		onAfterPersist: (exps) => {
			offlineSqliteStorage.persistWorkspaceSnapshot(sqliteCompanyScope, "expenses", exps).catch(() => {});
		}
	});
	usePersistCompanyScopedSlice({
		value: customers,
		workspaceMode,
		currentCompanyId,
		prodBaseKey: STORAGE_KEYS.CUSTOMERS,
		practiceKey: PRACTICE_STORAGE_KEYS.CUSTOMERS,
		onAfterPersist: (custs) => {
			offlineSqliteStorage.persistWorkspaceSnapshot(sqliteCompanyScope, "customers", custs).catch(() => {});
		}
	});
	usePersistCompanyScopedSlice({
		value: stockMovements,
		workspaceMode,
		currentCompanyId,
		prodBaseKey: STORAGE_KEYS.MOVEMENTS,
		practiceKey: PRACTICE_STORAGE_KEYS.MOVEMENTS,
		onAfterPersist: (movs) => {
			offlineSqliteStorage.persistWorkspaceSnapshot(sqliteCompanyScope, "stockMovements", movs).catch(() => {});
		}
	});
	usePersistCompanyScopedSlice({
		value: currencies,
		workspaceMode,
		currentCompanyId,
		prodBaseKey: STORAGE_KEYS.CURRENCIES,
		mirrorGlobalProdKey: false,
		onAfterPersist: (curs) => {
			if (workspaceMode === "PRODUCTION") savePersistedCurrencies(curs);
		}
	});
	usePersistCompanyScopedSlice({
		value: exchangeRates,
		workspaceMode,
		currentCompanyId,
		prodBaseKey: STORAGE_KEYS.EXCHANGE_RATES,
		mirrorGlobalProdKey: false,
		onAfterPersist: (rates) => {
			if (workspaceMode === "PRODUCTION") savePersistedExchangeRates(rates);
		}
	});
	usePersistCompanyScopedSlice({
		value: exchangeRateItems,
		workspaceMode,
		currentCompanyId,
		prodBaseKey: STORAGE_KEYS.EXCHANGE_RATE_ITEMS,
		mirrorGlobalProdKey: false,
		onAfterPersist: (items) => {
			if (workspaceMode === "PRODUCTION") savePersistedExchangeRateItems(items);
		}
	});
	usePersistCompanyScopedSlice({
		value: exchangeRateHistory,
		workspaceMode,
		currentCompanyId,
		prodBaseKey: STORAGE_KEYS.RATE_HISTORY
	});
	usePersistCompanyScopedSlice({
		value: settings,
		workspaceMode,
		currentCompanyId,
		prodBaseKey: STORAGE_KEYS.SETTINGS,
		practiceKey: PRACTICE_STORAGE_KEYS.SETTINGS,
		onAfterPersist: (nextSettings) => {
			if (typeof document !== "undefined") {
				document.documentElement.dir = nextSettings.language === "ar" ? "rtl" : "ltr";
				document.documentElement.lang = nextSettings.language;
				if (nextSettings.theme === "light") document.documentElement.classList.remove("dark");
				else document.documentElement.classList.add("dark");
			}
		}
	});
	const { deletedProductIdsRef, deletedCustomerIdsRef, cartTotals, addToCart, updateCartQuantity, setCartItemSaleUnit, setCartItemDiscount, removeFromCart, clearCart, processCheckout, settleTransactionDebt, updateTransactionFulfillment, applyNewRateToTransaction, lockTransactionSaleRate, applyNewRateToAllTransactions, voidTransaction: baseVoidTransaction, addProduct, updateProduct, deleteProduct, recordStockAdjustment, recordGoodsReceipt, addCustomer, updateCustomer, deleteCustomer, addExpense, updateExpense, voidExpense, deleteExpense } = useCatalogAndCartDomain({
		products,
		setProducts,
		cart,
		setCart,
		transactions,
		setTransactions,
		setExpenses,
		setCustomers,
		setStockMovements,
		selectedCustomer,
		setSelectedCustomer,
		globalDiscountPercent,
		setGlobalDiscountPercentState,
		globalDiscountAmount,
		setGlobalDiscountAmountState,
		settings,
		exchangeRates,
		currentUser,
		currentCompany,
		activeBranchId,
		commitCheckoutAtomic,
		voidTransactionAtomic
	});
	const { updateSettings, syncCurrenciesState, saveCurrency, removeCurrency, clearAllCurrencies, setBaseCurrencyCode, syncExchangeRatesState, updateExchangeRate } = useCurrenciesAndSettingsDomain({
		settings,
		setSettings,
		currencies,
		setCurrencies,
		setExchangeRates,
		setExchangeRateItems,
		setExchangeRateHistory,
		workspaceMode,
		currentCompany,
		currentCompanyId,
		currentUser
	});
	const { isOnboardingModalOpen, setIsOnboardingModalOpen, onboardingModalInitialView, openOnboardingModal, closeOnboardingModal, enterPracticeMode, exitPracticeMode, resetPracticeModeData, resetAllData, executeAuthorizedFactoryReset, createNewCompanyWorkspace, switchCompanyWorkspace, createBranch, updateBranch, deleteBranch, syncTransactions } = useWorkspaceCompanyDomain({
		workspaceMode,
		setWorkspaceMode,
		companies,
		setCompanies,
		currentCompanyId,
		setCurrentCompanyId,
		currentCompany,
		allBranches,
		setAllBranches,
		branches,
		setActiveBranchId,
		products,
		setProducts,
		transactions,
		setTransactions,
		expenses,
		setExpenses,
		customers,
		setCustomers,
		stockMovements,
		setStockMovements,
		users,
		setUsers,
		activeSessions,
		setActiveSessions,
		currentUserId,
		setCurrentUserId,
		currentUser,
		settings,
		setSettings,
		currencies,
		setCurrencies,
		exchangeRates,
		setExchangeRates,
		exchangeRateItems,
		setExchangeRateItems,
		exchangeRateHistory,
		setExchangeRateHistory,
		unmetDemandRequests,
		setUnmetDemandRequests,
		setCart,
		setSelectedCustomer,
		setGlobalDiscountPercent,
		setGlobalDiscountPercentState,
		setGlobalDiscountAmountState,
		sqliteCompanyScope,
		setSqliteDiagnostics,
		setIsSyncing,
		setLastSyncedAt
	});
	const { switchCurrentUser, saveUser, deactivateUserAccount, reactivateUserAccount, resetUserPasswordOrPin, deleteUserAccount, clearAllUserAccounts, removeUser, toggleUserActiveSession, hasPermission, hasCapability } = useUserAccountsDomain({
		users,
		setUsers,
		setActiveSessions,
		currentUserId,
		setCurrentUserId,
		currentUser,
		currentCompany,
		currentCompanyId,
		activeBranchId,
		workspaceMode,
		settings
	});
	const { onboardingChecklist, isTrainingTourOpen, trainingTourStepIndex, trainingTourProgress, startTrainingTour, closeTrainingTour, nextTrainingTourStep, prevTrainingTourStep, selectTrainingTourStep, finishTrainingTour, resetTrainingTour, isUnmetDemandModalOpen, unmetDemandModalInitialData, openUnmetDemandModal, closeUnmetDemandModal, recordUnmetDemandRequest, fulfillUnmetDemandFromSale, cancelUnmetDemandRequest, reverseUnmetDemandBySale } = useTrainingAndDemandDomain({
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
		setUnmetDemandRequests
	});
	const voidTransaction = (0, import_react.useCallback)((transactionId) => {
		const ok = baseVoidTransaction(transactionId);
		if (ok) reverseUnmetDemandBySale(transactionId);
		return ok;
	}, [baseVoidTransaction, reverseUnmetDemandBySale]);
	const { collectClientBackupDataset, hydrateCompanyFromBackupPayload } = useBackupHydrationDomain({
		currentCompany,
		currentCompanyId,
		setCurrentCompanyId,
		setCompanies,
		setWorkspaceMode,
		branches,
		setAllBranches,
		activeBranchId,
		setActiveBranchId,
		settings,
		setSettings,
		currencies,
		setCurrencies,
		exchangeRates,
		setExchangeRates,
		exchangeRateItems,
		setExchangeRateItems,
		exchangeRateHistory,
		setExchangeRateHistory,
		users,
		setUsers,
		currentUser,
		setCurrentUserId,
		products,
		setProducts,
		customers,
		setCustomers,
		stockMovements,
		setStockMovements,
		transactions,
		setTransactions,
		expenses,
		setExpenses,
		unmetDemandRequests,
		setUnmetDemandRequests,
		setCart,
		setSelectedCustomer,
		setIsOnboardingModalOpen
	});
	const { lanSyncConfig, updateLanSyncConfig, lanConnectionStatus, lanConnectedDevices, lanRecentEvents, lanNetworkAddresses, lanPrimaryHostUrl, lanLastSyncError, pushLiveLanSyncNow, applyIncomingLanSyncState } = useLanSyncDomain({
		currentCompany,
		settings,
		setSettings,
		products,
		setProducts,
		deletedProductIdsRef,
		transactions,
		setTransactions,
		expenses,
		setExpenses,
		customers,
		setCustomers,
		deletedCustomerIdsRef,
		stockMovements,
		setStockMovements,
		unmetDemandRequests,
		setUnmetDemandRequests,
		currencies,
		setCurrencies,
		exchangeRates,
		setExchangeRates,
		exchangeRateItems,
		setExchangeRateItems,
		exchangeRateHistory,
		branches,
		users,
		activeSessions,
		setLastSyncedAt
	});
	const settingsContextValue = (0, import_react.useMemo)(() => ({
		settings,
		currencies,
		exchangeRates,
		exchangeRateItems,
		exchangeRateHistory,
		updateSettings,
		saveCurrency,
		removeCurrency,
		clearAllCurrencies,
		setBaseCurrencyCode,
		syncCurrenciesState,
		updateExchangeRate,
		syncExchangeRatesState
	}), [
		settings,
		currencies,
		exchangeRates,
		exchangeRateItems,
		exchangeRateHistory,
		updateSettings,
		saveCurrency,
		removeCurrency,
		clearAllCurrencies,
		setBaseCurrencyCode,
		syncCurrenciesState,
		updateExchangeRate,
		syncExchangeRatesState
	]);
	const userContextValue = (0, import_react.useMemo)(() => ({
		users,
		activeSessions,
		currentUser,
		switchCurrentUser,
		saveUser,
		removeUser,
		deleteUserAccount,
		clearAllUserAccounts,
		deactivateUserAccount,
		reactivateUserAccount,
		resetUserPasswordOrPin,
		toggleUserActiveSession,
		hasPermission,
		hasCapability
	}), [
		users,
		activeSessions,
		currentUser,
		switchCurrentUser,
		saveUser,
		removeUser,
		deleteUserAccount,
		clearAllUserAccounts,
		deactivateUserAccount,
		reactivateUserAccount,
		resetUserPasswordOrPin,
		toggleUserActiveSession,
		hasPermission,
		hasCapability
	]);
	const productContextValue = (0, import_react.useMemo)(() => ({
		products,
		stockMovements,
		addProduct,
		updateProduct,
		deleteProduct,
		pendingNewProductBarcode,
		setPendingNewProductBarcode,
		openAddProductWithBarcode,
		recordStockAdjustment,
		recordGoodsReceipt
	}), [
		products,
		stockMovements,
		addProduct,
		updateProduct,
		deleteProduct,
		pendingNewProductBarcode,
		openAddProductWithBarcode,
		recordStockAdjustment,
		recordGoodsReceipt
	]);
	const cartContextValue = (0, import_react.useMemo)(() => ({
		cart,
		cartTotals,
		selectedCustomer,
		setSelectedCustomer,
		globalDiscountPercent,
		setGlobalDiscountPercent,
		globalDiscountAmount,
		setGlobalDiscountAmount,
		addToCart,
		updateCartQuantity,
		setCartItemSaleUnit,
		setCartItemDiscount,
		removeFromCart,
		clearCart,
		processCheckout
	}), [
		cart,
		cartTotals,
		selectedCustomer,
		globalDiscountPercent,
		setGlobalDiscountPercent,
		globalDiscountAmount,
		setGlobalDiscountAmount,
		addToCart,
		updateCartQuantity,
		setCartItemSaleUnit,
		setCartItemDiscount,
		removeFromCart,
		clearCart,
		processCheckout
	]);
	const expenseContextValue = (0, import_react.useMemo)(() => ({
		expenses,
		addExpense,
		updateExpense,
		voidExpense,
		deleteExpense
	}), [
		expenses,
		addExpense,
		updateExpense,
		voidExpense,
		deleteExpense
	]);
	const posContextValue = (0, import_react.useMemo)(() => ({
		products,
		cart,
		transactions,
		expenses,
		customers,
		stockMovements,
		settings,
		currencies,
		exchangeRates,
		exchangeRateItems,
		exchangeRateHistory,
		activeTab,
		setActiveTab,
		selectedCustomer,
		setSelectedCustomer,
		globalDiscountPercent,
		setGlobalDiscountPercent,
		globalDiscountAmount,
		setGlobalDiscountAmount,
		cartTotals,
		workspaceMode,
		currentCompany,
		companies,
		branches,
		activeBranchId,
		setActiveBranchId,
		enterPracticeMode,
		exitPracticeMode,
		resetPracticeModeData,
		createNewCompanyWorkspace,
		switchCompanyWorkspace,
		isOnboardingModalOpen,
		onboardingModalInitialView,
		openOnboardingModal,
		closeOnboardingModal,
		createBranch,
		updateBranch,
		deleteBranch,
		onboardingChecklist,
		users,
		activeSessions,
		currentUser,
		switchCurrentUser,
		saveUser,
		removeUser,
		deleteUserAccount,
		clearAllUserAccounts,
		deactivateUserAccount,
		reactivateUserAccount,
		resetUserPasswordOrPin,
		toggleUserActiveSession,
		hasPermission,
		hasCapability,
		addToCart,
		setCartItemSaleUnit,
		updateCartQuantity,
		setCartItemDiscount,
		removeFromCart,
		clearCart,
		processCheckout,
		addProduct,
		updateProduct,
		deleteProduct,
		pendingNewProductBarcode,
		setPendingNewProductBarcode,
		openAddProductWithBarcode,
		recordStockAdjustment,
		recordGoodsReceipt,
		addCustomer,
		updateCustomer,
		deleteCustomer,
		addExpense,
		updateExpense,
		voidExpense,
		deleteExpense,
		voidTransaction,
		settleTransactionDebt,
		updateTransactionFulfillment,
		applyNewRateToTransaction,
		applyNewRateToAllTransactions,
		lockTransactionSaleRate,
		updateSettings,
		saveCurrency,
		removeCurrency,
		clearAllCurrencies,
		setBaseCurrencyCode,
		syncCurrenciesState,
		updateExchangeRate,
		syncExchangeRatesState,
		resetAllData,
		executeAuthorizedFactoryReset,
		collectClientBackupDataset,
		hydrateCompanyFromBackupPayload,
		syncTransactions,
		isSyncing,
		lastSyncedAt,
		sqliteDiagnostics,
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
		unmetDemandRequests,
		recordUnmetDemandRequest,
		fulfillUnmetDemandFromSale,
		cancelUnmetDemandRequest,
		isUnmetDemandModalOpen,
		unmetDemandModalInitialData,
		openUnmetDemandModal,
		closeUnmetDemandModal,
		lanSyncConfig,
		updateLanSyncConfig,
		lanConnectionStatus,
		lanConnectedDevices,
		lanRecentEvents,
		lanNetworkAddresses,
		lanPrimaryHostUrl,
		lanLastSyncError,
		pushLiveLanSyncNow,
		applyIncomingLanSyncState
	}), [
		products,
		cart,
		transactions,
		expenses,
		customers,
		stockMovements,
		settings,
		currencies,
		exchangeRates,
		exchangeRateItems,
		exchangeRateHistory,
		activeTab,
		selectedCustomer,
		globalDiscountPercent,
		setGlobalDiscountPercent,
		globalDiscountAmount,
		setGlobalDiscountAmount,
		cartTotals,
		workspaceMode,
		currentCompany,
		companies,
		branches,
		activeBranchId,
		setActiveBranchId,
		enterPracticeMode,
		exitPracticeMode,
		resetPracticeModeData,
		createNewCompanyWorkspace,
		switchCompanyWorkspace,
		isOnboardingModalOpen,
		onboardingModalInitialView,
		openOnboardingModal,
		closeOnboardingModal,
		createBranch,
		updateBranch,
		deleteBranch,
		onboardingChecklist,
		users,
		activeSessions,
		currentUser,
		switchCurrentUser,
		saveUser,
		removeUser,
		deleteUserAccount,
		clearAllUserAccounts,
		deactivateUserAccount,
		reactivateUserAccount,
		resetUserPasswordOrPin,
		toggleUserActiveSession,
		hasPermission,
		hasCapability,
		addToCart,
		setCartItemSaleUnit,
		updateCartQuantity,
		setCartItemDiscount,
		removeFromCart,
		clearCart,
		processCheckout,
		addProduct,
		updateProduct,
		deleteProduct,
		pendingNewProductBarcode,
		openAddProductWithBarcode,
		recordStockAdjustment,
		recordGoodsReceipt,
		addCustomer,
		updateCustomer,
		deleteCustomer,
		addExpense,
		updateExpense,
		voidExpense,
		deleteExpense,
		voidTransaction,
		settleTransactionDebt,
		updateTransactionFulfillment,
		applyNewRateToTransaction,
		applyNewRateToAllTransactions,
		lockTransactionSaleRate,
		updateSettings,
		saveCurrency,
		removeCurrency,
		clearAllCurrencies,
		setBaseCurrencyCode,
		syncCurrenciesState,
		updateExchangeRate,
		syncExchangeRatesState,
		resetAllData,
		executeAuthorizedFactoryReset,
		collectClientBackupDataset,
		hydrateCompanyFromBackupPayload,
		syncTransactions,
		isSyncing,
		lastSyncedAt,
		sqliteDiagnostics,
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
		unmetDemandRequests,
		recordUnmetDemandRequest,
		fulfillUnmetDemandFromSale,
		cancelUnmetDemandRequest,
		isUnmetDemandModalOpen,
		unmetDemandModalInitialData,
		openUnmetDemandModal,
		closeUnmetDemandModal,
		lanSyncConfig,
		updateLanSyncConfig,
		lanConnectionStatus,
		lanConnectedDevices,
		lanRecentEvents,
		lanNetworkAddresses,
		lanPrimaryHostUrl,
		lanLastSyncError,
		pushLiveLanSyncNow,
		applyIncomingLanSyncState
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsContext.Provider, {
		value: settingsContextValue,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserContext.Provider, {
			value: userContextValue,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductContext.Provider, {
				value: productContextValue,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartContext.Provider, {
					value: cartContextValue,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpenseContext.Provider, {
						value: expenseContextValue,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(POSContext.Provider, {
							value: posContextValue,
							children
						})
					})
				})
			})
		})
	});
};
function usePOS() {
	const context = (0, import_react.useContext)(POSContext);
	if (!context) throw new Error("usePOS must be used within a POSProvider");
	return context;
}
export { buildProductSearchIndexMap as $, enforceScopedFilters as A, calculateDebtBreakdown as At, TRAINING_TOUR_STEPS as B, getConvertedTransactionView as Bt, computeProductSellableStock as C, mergeEditFormsState as Ct, redactUnmetDemandRecordForRole as D, savePersistedExchangeRateItems as Dt, normalizeUnavailableSearchText as E, resolveCurrencyInput as Et, sanitizeForecastsForRole as F, formatCurrency as Ft, compressImageToOptimalDataUrl as G, CAPABILITY_GROUPS as Gt, clampTourStepIndex as H, getProductPricesInCurrency as Ht, sanitizeInsightsForRole as I, formatPaymentMethodLabel as It, playHoldTick as J, deriveLegacyPermissionsFromCapabilities as Jt, initRealUserMonitoring as K, SYSTEM_ROLE_DEFINITIONS as Kt, sanitizeIntelligenceForRole as L, formatProductStockBreakdown as Lt, sanitizeBranchesForRole as M, computeExchangeRateFluctuationSummary as Mt, sanitizeCustomersForRole as N, computeStoreReportAnalytics as Nt, resolveProductCatalogLifecycleStatus as O, savePersistedRateInputs as Ot, sanitizeFinancialsForRole as P, convertCurrencyAmount as Pt, triggerHaptic as Q, sanitizeInventoryForRole as R, getAllTransactionReceiptImages as Rt, buildUnavailableProductsKnowledgeBase as S, loadPersistedRateInputs as St, matchesUnavailableProductQuery as T, reconcileRatesWithPersisted as Tt, isTourStepAccessibleForUser as U, roundCurrencyValue as Ut, calculateTourCompletionPercent as V, getProductPackaging as Vt, api as W, DEFAULT_ROLE_PERMISSIONS as Wt, playSuccessChime as X, mapLegacyRoleToSystemRole as Xt, playScannerBeep as Y, getDefaultCapabilitiesForRole as Yt, playTactileClick as Z, mapSystemRoleToLegacyRole as Zt, filterPayloadByIncludedModules as _, __vitePreload as _t, normalizeLanHostUrl as a, getNextProductSerialNumber as at, scrubSensitiveUserFields as b, loadPersistedExchangeRateItems as bt, computeNetFinancialPosition as c, matchesProductBarcode as ct, getExpenseCategoryMeta as d, normalizeCategorySearchText as dt, filterCategoriesByQuery as et, ALL_BACKUP_MODULE_IDS as f, normalizeProductBarcodes as ft, computeBackupModuleRecordCounts as g, offlineSqliteStorage as gt, applyIntelligentBackupMerge as h, tokenizeProductSearchQuery as ht, isStandaloneCapacitorApk as i, getAllProductBarcodes$1 as it, resolveAnalyticsUserContext as j, computeDailyRevenueTrends as jt, searchUnavailableProductsKnowledgeBase as k, DEFAULT_BASELINE_EXCHANGE_RATES as kt, formatExpenseCategoryLabel as l, matchesProductSearchIndexEntry as lt, analyzeBackupMergePreview as m, resolveScannedProductBarcode as mt, usePOS as n, formatProductSerialNumber as nt, EXPENSE_CATEGORIES as o, getProductExpiryStatus as ot, BACKUP_MODULE_DEFINITIONS as p, parseBarcodeSkuInput as pt, useDebouncedValue as q, deriveCapabilitiesFromUser as qt, encodeCode128B as r, generateBarcode as rt, computeExpensesSummary as s, getProductSerialNumber as st, POSProvider as t, formatProductBarcodeSku as tt, getConvertedExpenseView as u, mergeAndDeduplicateCategories as ut, remapBackupPayloadForNewCompany as v, CURRENCY_TEMPLATES as vt, computeUnmetDemandFulfillmentState as w, reconcileCurrenciesWithPersisted as wt, SUPPORTED_UNAVAILABILITY_REASONS as x, loadPersistedExchangeRates as xt, resolveBackupModuleDependencies as y, loadPersistedCurrencies as yt, sanitizeSalesForRole as z, getCartItemUnitPricing as zt };
