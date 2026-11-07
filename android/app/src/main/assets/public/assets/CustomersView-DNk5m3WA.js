import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { D as Search, J as Mail, L as Phone, M as Receipt, R as Pen, Zt as Award, g as Trash2, l as UserPlus, n as X, s as Users, sn as require_react } from "./vendor-icons-DoijI_tq.js";
import { A as useDebouncedValue, n as usePOS, tt as formatCurrency } from "./POSContext-nila8oYV.js";
import { i as require_jsx_runtime } from "./vendor-motion-CekIsQM-.js";
import { _ as TactileButton, n as AppModal, p as AppInput, v as getTranslation } from "./index-DYJDckRU.js";
import { t as AppCard } from "./AppCard-B2erL08q.js";
// src/components/customers/CustomersView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var CustomersView = () => {
	const { customers, addCustomer, updateCustomer, deleteCustomer, transactions, settings } = usePOS();
	const t = getTranslation(settings.language);
	const isAr = settings.language === "ar";
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const debouncedSearchQuery = useDebouncedValue(searchQuery, 120);
	const [isModalOpen, setIsModalOpen] = (0, import_react.useState)(false);
	const [editingCustomer, setEditingCustomer] = (0, import_react.useState)(null);
	const [selectedCustomerHistory, setSelectedCustomerHistory] = (0, import_react.useState)(null);
	const [confirmDeleteId, setConfirmDeleteId] = (0, import_react.useState)(null);
	const [formName, setFormName] = (0, import_react.useState)("");
	const [formPhone, setFormPhone] = (0, import_react.useState)("");
	const [formEmail, setFormEmail] = (0, import_react.useState)("");
	const [formNotes, setFormNotes] = (0, import_react.useState)("");
	const [formDebt, setFormDebt] = (0, import_react.useState)("");
	const filteredCustomers = (0, import_react.useMemo)(() => {
		const q = debouncedSearchQuery.toLowerCase();
		return customers.filter((c) => {
			if (!q) return true;
			const matchName = c.name.toLowerCase().includes(q);
			const matchPhone = c.phone.includes(debouncedSearchQuery);
			const matchEmail = c.email?.toLowerCase().includes(q) || false;
			return matchName || matchPhone || matchEmail;
		});
	}, [customers, debouncedSearchQuery]);
	const openCreateModal = () => {
		setEditingCustomer(null);
		setFormName("");
		setFormPhone("");
		setFormEmail("");
		setFormNotes("");
		setFormDebt("");
		setIsModalOpen(true);
	};
	const openEditModal = (c) => {
		setEditingCustomer(c);
		setFormName(c.name);
		setFormPhone(c.phone);
		setFormEmail(c.email || "");
		setFormNotes(c.notes || "");
		setFormDebt(c.totalDebt ? String(c.totalDebt) : "");
		setIsModalOpen(true);
	};
	const handleSave = (e) => {
		e.preventDefault();
		if (!formName.trim()) return;
		const parsedDebt = Math.max(0, Number(formDebt) || 0);
		if (editingCustomer) updateCustomer(editingCustomer.id, {
			name: formName.trim(),
			phone: formPhone.trim(),
			email: formEmail.trim() || void 0,
			notes: formNotes.trim() || void 0,
			totalDebt: parsedDebt
		});
		else addCustomer({
			name: formName.trim(),
			phone: formPhone.trim(),
			email: formEmail.trim() || void 0,
			notes: formNotes.trim() || void 0,
			totalDebt: parsedDebt
		});
		setIsModalOpen(false);
	};
	const customerTransactions = (0, import_react.useMemo)(() => {
		if (!selectedCustomerHistory) return [];
		return transactions.filter((t) => t.customerId === selectedCustomerHistory.id);
	}, [selectedCustomerHistory, transactions]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl sm:text-2xl font-extrabold text-white tracking-tight",
					children: isAr ? "حسابات العملاء والذمم" : t.customerDirectory
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-neutral-400",
					children: isAr ? `${customers.length} حساب عميل مضاف (بدون أي حسابات افتراضية)` : `${customers.length} custom customer accounts configured`
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
					variant: "amber",
					size: "md",
					onClick: openCreateModal,
					leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "w-4 h-4" }),
					"data-testid": "add-customer-account-btn",
					children: isAr ? "إضافة حساب عميل جديد" : t.newCustomer
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
					placeholder: isAr ? "ابحث باسم العميل أو رقم الهاتف أو البريد الإلكتروني..." : "Search by customer name, phone or email...",
					value: searchQuery,
					onChange: (e) => setSearchQuery(e.target.value),
					leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4" }),
					rightIcon: searchQuery ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setSearchQuery(""),
						className: "p-1 text-neutral-400 hover:text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
					}) : void 0
				})
			}),
			filteredCustomers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-testid": "customers-empty-state",
				className: "p-10 rounded-2xl bg-neutral-900/60 border border-dashed border-neutral-800 text-center space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-6 h-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 max-w-md mx-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold text-white",
							children: isAr ? "لا توجد أي حسابات عملاء افتراضية — القائمة فارغة" : "No Customer Accounts Added Yet"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-neutral-400",
							children: isAr ? "أضف حسابات عملائك الخاصة فقط لتتبع مشترياتهم وديونهم وسجل فواتيرهم." : "Add your own customer accounts to track their purchases, credit balances, and history."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
							variant: "amber",
							size: "sm",
							onClick: openCreateModal,
							leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "w-4 h-4" }),
							children: isAr ? "إضافة أول حساب عميل" : "Add First Customer Account"
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
				children: filteredCustomers.map((cust) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
					className: "flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400",
									children: cust.name.slice(0, 2).toUpperCase()
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-sm text-white",
									children: cust.name
								}), cust.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-neutral-400 flex items-center gap-1 font-mono",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "w-3 h-3 text-neutral-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cust.phone })]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-lg text-xs font-mono font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [cust.loyaltyPoints, " pts"] })]
							})]
						}),
						cust.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-neutral-400 flex items-center gap-1.5 mb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-3 h-3 text-neutral-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: cust.email
							})]
						}),
						cust.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-neutral-500 bg-neutral-950/60 p-2 rounded-xl border border-neutral-850 italic",
							children: [
								"\"",
								cust.notes,
								"\""
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-3 border-t border-neutral-800 flex items-center justify-between gap-2 mt-2 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-neutral-500 block",
								children: t.totalSpent
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold font-mono text-emerald-400 tabular-nums",
								children: formatCurrency(cust.totalSpent, settings.currency, settings.language)
							})] }), (cust.totalDebt || 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-rose-400 block font-semibold",
								children: t.totalDebt
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold font-mono text-rose-400 tabular-nums",
								children: formatCurrency(cust.totalDebt || 0, settings.currency, settings.language)
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
									variant: "ghost",
									size: "sm",
									onClick: () => setSelectedCustomerHistory(cust),
									leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "w-3.5 h-3.5" }),
									children: isAr ? "السجل" : "History"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
									variant: "secondary",
									size: "sm",
									onClick: () => openEditModal(cust),
									leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-3.5 h-3.5" }),
									children: isAr ? "تعديل" : "Edit"
								}),
								confirmDeleteId === cust.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											deleteCustomer(cust.id);
											setConfirmDeleteId(null);
										},
										className: "px-2 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold",
										children: isAr ? "تأكيد" : "Confirm"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setConfirmDeleteId(null),
										className: "px-1.5 py-1 rounded-lg bg-neutral-800 text-neutral-300 text-[10px]",
										children: isAr ? "إلغاء" : "Cancel"
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setConfirmDeleteId(cust.id),
									className: "p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50 transition-colors",
									title: isAr ? "حذف حساب العميل" : "Delete Customer Account",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" })
								})
							]
						})]
					})]
				}, cust.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
				isOpen: isModalOpen,
				onClose: () => setIsModalOpen(false),
				title: editingCustomer ? isAr ? "تعديل بيانات حساب العميل" : "Edit Customer Account" : isAr ? "إضافة حساب عميل جديد" : t.newCustomer,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSave,
					className: "flex flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
							label: isAr ? "اسم صاحب الحساب / العميل *" : t.customerName,
							value: formName,
							onChange: (e) => setFormName(e.target.value),
							required: true,
							autoFocus: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
							label: isAr ? "رقم الهاتف (اختياري)" : t.phone,
							type: "tel",
							value: formPhone,
							onChange: (e) => setFormPhone(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
							label: isAr ? "البريد الإلكتروني (اختياري)" : t.email,
							type: "email",
							value: formEmail,
							onChange: (e) => setFormEmail(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
							label: isAr ? "رصيد المديونية / الذمم الافتتاحي (اختياري)" : "Opening Debt Balance (Optional)",
							type: "number",
							min: "0",
							step: "any",
							value: formDebt,
							onChange: (e) => setFormDebt(e.target.value),
							placeholder: "0"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-neutral-300 block mb-1.5",
							children: isAr ? "ملاحظات الحساب (اختياري)" : t.notes
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: formNotes,
							onChange: (e) => setFormNotes(e.target.value),
							rows: 2,
							className: "w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500",
							placeholder: isAr ? "ملاحظات خاصة بحساب العميل..." : "Account notes..."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2 pt-3 border-t border-neutral-800",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								variant: "ghost",
								type: "button",
								onClick: () => setIsModalOpen(false),
								children: t.cancel
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								variant: "amber",
								type: "submit",
								children: t.saveCustomer
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
				isOpen: Boolean(selectedCustomerHistory),
				onClose: () => setSelectedCustomerHistory(null),
				title: isAr ? `سجل معاملات الحساب: ${selectedCustomerHistory?.name}` : `Purchase History: ${selectedCustomerHistory?.name}`,
				description: `${selectedCustomerHistory?.transactionCount || 0} ${isAr ? "عملية مسجلة" : "orders recorded"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2.5 max-h-80 overflow-y-auto pr-1",
					children: customerTransactions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center p-6 text-xs text-neutral-500",
						children: isAr ? "لا توجد فواتير سابقة مسجلة لهذا الحساب." : "No previous orders found for this customer account."
					}) : customerTransactions.map((tx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-bold text-white block",
							children: tx.id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] text-neutral-500",
							children: [
								new Date(tx.timestamp).toLocaleString(),
								" • ",
								tx.items.length,
								" items"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono font-bold text-emerald-400 tabular-nums",
								children: formatCurrency(tx.grandTotal, settings.currency, settings.language)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[10px] uppercase font-mono text-neutral-400",
								children: tx.paymentMethod
							})]
						})]
					}, tx.id))
				})
			})
		]
	});
};
export { CustomersView };
