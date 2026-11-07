import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { $ as Lightbulb, A as RotateCcw, Ft as ChevronRight, I as Play, It as ChevronLeft, K as Minimize2, X as Lock, jt as CircleCheck, lt as GraduationCap, n as X, q as Maximize2, sn as require_react, wt as Compass } from "./vendor-icons-DoijI_tq.js";
import { P as playTactileClick, f as TRAINING_TOUR_STEPS, h as isTourStepAccessibleForUser, m as clampTourStepIndex, n as usePOS, p as calculateTourCompletionPercent } from "./POSContext-nila8oYV.js";
import { i as require_jsx_runtime } from "./vendor-motion-CekIsQM-.js";
import { _ as TactileButton } from "./index-DYJDckRU.js";
// src/components/tour/TrainingTourOverlay.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var TrainingTourOverlay = ({ isOpen, currentStepIndex, progress, onSelectStep, onNext, onPrev, onFinish, onClose, onResetProgress }) => {
	const { settings, activeTab, setActiveTab, currentUser } = usePOS();
	const isAr = settings.language === "ar";
	const [isMinimized, setIsMinimized] = (0, import_react.useState)(false);
	const [spotlightRect, setSpotlightRect] = (0, import_react.useState)(null);
	const safeIndex = clampTourStepIndex(currentStepIndex, TRAINING_TOUR_STEPS.length);
	const currentStep = TRAINING_TOUR_STEPS[safeIndex];
	const isFirstStep = safeIndex === 0;
	const isLastStep = safeIndex === TRAINING_TOUR_STEPS.length - 1;
	const completionPercent = calculateTourCompletionPercent(progress, TRAINING_TOUR_STEPS);
	const isAccessibleForRole = currentStep ? isTourStepAccessibleForUser(currentStep, currentUser) : true;
	(0, import_react.useEffect)(() => {
		if (!isOpen || !currentStep) return;
		if (activeTab !== currentStep.tab) setActiveTab(currentStep.tab);
	}, [
		isOpen,
		currentStep,
		activeTab,
		setActiveTab
	]);
	(0, import_react.useEffect)(() => {
		if (!isOpen || !currentStep?.targetSelector) {
			setSpotlightRect(null);
			return;
		}
		const updateSpotlight = () => {
			try {
				const el = document.querySelector(currentStep.targetSelector);
				if (!el) {
					setSpotlightRect(null);
					return;
				}
				const rect = el.getBoundingClientRect();
				if (rect.width > 0 && rect.height > 0) setSpotlightRect({
					top: Math.max(4, rect.top - 6),
					left: Math.max(4, rect.left - 6),
					width: rect.width + 12,
					height: rect.height + 12
				});
				else setSpotlightRect(null);
			} catch {
				setSpotlightRect(null);
			}
		};
		const timer = window.setTimeout(updateSpotlight, 180);
		window.addEventListener("resize", updateSpotlight);
		window.addEventListener("scroll", updateSpotlight, true);
		return () => {
			window.clearTimeout(timer);
			window.removeEventListener("resize", updateSpotlight);
			window.removeEventListener("scroll", updateSpotlight, true);
		};
	}, [
		isOpen,
		currentStep,
		activeTab
	]);
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
			else if (e.key === "ArrowRight") {
				if (isAr) {
					if (!isFirstStep) onPrev();
				} else if (!isLastStep) onNext();
			} else if (e.key === "ArrowLeft") {
				if (isAr) {
					if (!isLastStep) onNext();
				} else if (!isFirstStep) onPrev();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		isOpen,
		isAr,
		isFirstStep,
		isLastStep,
		onNext,
		onPrev,
		onClose
	]);
	if (!isOpen || !currentStep) return null;
	const handleTryTargetElement = () => {
		playTactileClick(settings.soundEnabled);
		if (currentStep.targetSelector) {
			const el = document.querySelector(currentStep.targetSelector);
			if (el) {
				el.scrollIntoView({
					behavior: "smooth",
					block: "center"
				});
				el.focus();
			}
		}
		setIsMinimized(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "training-tour-modal",
		role: "dialog",
		"aria-modal": "false",
		"aria-label": isAr ? "الجولة التدريبية التفاعلية للنظام" : "Interactive POS Guided Training Tour",
		className: "fixed inset-0 z-50 pointer-events-none flex flex-col justify-end sm:justify-center items-center p-3 sm:p-6",
		children: [
			!isMinimized && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				onClick: onClose,
				className: "fixed inset-0 bg-black/55 backdrop-blur-[2px] pointer-events-auto transition-opacity"
			}),
			spotlightRect && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-testid": "tour-spotlight-ring",
				style: {
					top: `${spotlightRect.top}px`,
					left: `${spotlightRect.left}px`,
					width: `${spotlightRect.width}px`,
					height: `${spotlightRect.height}px`
				},
				className: "fixed z-50 pointer-events-none rounded-2xl border-2 border-amber-400 shadow-[0_0_0_4px_rgba(245,158,11,0.25),0_0_28px_rgba(245,158,11,0.5)] transition-all duration-300"
			}),
			isMinimized ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-testid": "training-tour-minimized-bar",
				className: "relative z-50 pointer-events-auto w-full max-w-2xl mb-16 sm:mb-4 rounded-2xl bg-neutral-900/95 border-2 border-amber-500/60 shadow-2xl p-3.5 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-9 h-9 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-mono font-extrabold text-sm shrink-0",
						children: [
							safeIndex + 1,
							"/",
							TRAINING_TOUR_STEPS.length
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-extrabold text-white truncate",
							children: isAr ? currentStep.titleAr : currentStep.titleEn
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-amber-300 truncate",
							children: isAr ? "وضع التطبيق العملي مفعل — جرّب الشاشة الآن ثم انتقل للخطوة التالية" : "Hands-on mode active — interact with the screen then continue"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								playTactileClick(settings.soundEnabled);
								onPrev();
							},
							disabled: isFirstStep,
							className: "px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-xs font-bold text-neutral-200",
							children: isAr ? "السابق" : "Prev"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								playTactileClick(settings.soundEnabled);
								if (isLastStep) onFinish();
								else onNext();
							},
							className: "px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-extrabold",
							children: isLastStep ? isAr ? "إنهاء الجولة" : "Finish" : isAr ? "التالي" : "Next"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-testid": "tour-expand-btn",
							onClick: () => {
								playTactileClick(settings.soundEnabled);
								setIsMinimized(false);
							},
							className: "p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300",
							title: isAr ? "تكبير بطاقة الشرح" : "Expand Tour Guide",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "w-4 h-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white",
							title: isAr ? "إغلاق" : "Close",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						})
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-50 pointer-events-auto w-full max-w-2xl rounded-3xl bg-neutral-900 border border-neutral-700/90 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 sm:p-5 bg-neutral-950/90 border-b border-neutral-800 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "w-5 h-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm sm:text-base font-extrabold text-white",
										children: isAr ? "الجولة التدريبية التفاعلية لنظام نقطة البيع" : "Interactive POS Training Tour"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-mono text-amber-400 font-bold",
										children: [
											safeIndex + 1,
											" / ",
											TRAINING_TOUR_STEPS.length
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-neutral-400",
									children: isAr ? `نسبة الإنجاز: ${completionPercent}% · يتم الانتقال تلقائياً لكل قسم لشرحه عملياً` : `Progress: ${completionPercent}% · Automatically navigates to each live module`
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "tour-minimize-btn",
									onClick: () => {
										playTactileClick(settings.soundEnabled);
										setIsMinimized(true);
									},
									className: "px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1",
									title: isAr ? "تصغير للتطبيق العملي المباشر" : "Minimize to interact with screen",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: isAr ? "تصغير للتجربة" : "Hands-on Mode"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"data-testid": "tour-close-btn",
									onClick: onClose,
									"aria-label": isAr ? "إغلاق الجولة التدريبية" : "Close Training Tour",
									className: "p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							role: "tablist",
							"aria-label": isAr ? "خطوات الجولة التدريبية" : "Training tour steps",
							className: "grid grid-cols-5 sm:grid-cols-7 md:grid-cols-13 gap-1 pt-1",
							children: TRAINING_TOUR_STEPS.map((step, idx) => {
								const isCurrent = idx === safeIndex;
								const isDone = progress.completedStepIds.includes(step.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									role: "tab",
									"aria-selected": isCurrent,
									"data-testid": `tour-step-tab-${idx + 1}`,
									onClick: () => {
										playTactileClick(settings.soundEnabled);
										onSelectStep(idx);
									},
									className: `py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold border transition-all flex items-center justify-center gap-0.5 ${isCurrent ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-sm" : isDone ? "bg-emerald-950/60 text-emerald-300 border-emerald-700/50 hover:border-emerald-500" : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["#", idx + 1] }), isDone && !isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-2.5 h-2.5 text-emerald-400" })]
								}, step.id);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 sm:p-6 overflow-y-auto space-y-4",
						children: [
							!isAccessibleForRole && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-testid": "tour-role-restriction-notice",
								className: "p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "ملاحظة: دور حسابك الحالي يمتلك صلاحية مقيدة في هذا القسم، ولكن يمكنك الاطلاع على شرحه الوظيفي هنا." : "Note: Your current role has restricted write/view permissions for this module, but you can review its workflow here." })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs font-semibold text-amber-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? currentStep.subtitleAr : currentStep.subtitleEn })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										"data-testid": "tour-current-step-title",
										className: "text-base sm:text-lg font-extrabold text-white leading-snug",
										children: isAr ? currentStep.titleAr : currentStep.titleEn
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs sm:text-sm text-neutral-300 leading-relaxed pt-1",
										children: isAr ? currentStep.descriptionAr : currentStep.descriptionEn
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-2xl bg-neutral-950/90 border border-neutral-800/90 space-y-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold text-neutral-200",
									children: isAr ? "أهم المهارات والمميزات في هذا القسم:" : "Key Capabilities in This Module:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-2",
									children: (isAr ? currentStep.keyPointsAr : currentStep.keyPointsEn).map((pt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-start gap-2.5 text-xs text-neutral-300 leading-relaxed",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pt })]
									}, i))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "w-4 h-4 text-amber-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-amber-200 leading-relaxed font-medium",
										children: isAr ? currentStep.practicalTipAr : currentStep.practicalTipEn
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "tour-try-live-btn",
									onClick: handleTryTargetElement,
									className: "px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shrink-0 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "طبّق عملياً الآن" : "Try It Live" })]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 sm:px-6 bg-neutral-950/90 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								variant: "ghost",
								size: "sm",
								"data-testid": "tour-skip-btn",
								onClick: onClose,
								children: isAr ? "إغلاق مؤقت" : "Pause Tour"
							}), progress.completedStepIds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "tour-reset-btn",
								onClick: () => {
									playTactileClick(settings.soundEnabled);
									onResetProgress();
								},
								className: "px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-400 hover:text-white flex items-center gap-1",
								title: isAr ? "إعادة الجولة من البداية" : "Restart Tour",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "إعادة من البداية" : "Restart" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								variant: "secondary",
								size: "sm",
								"data-testid": "tour-prev-btn",
								disabled: isFirstStep,
								onClick: () => {
									playTactileClick(settings.soundEnabled);
									onPrev();
								},
								leftIcon: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4" }),
								children: isAr ? "الخطوة السابقة" : "Previous"
							}), isLastStep ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								variant: "emerald",
								size: "sm",
								"data-testid": "tour-finish-btn",
								onClick: () => {
									playTactileClick(settings.soundEnabled);
									onFinish();
								},
								leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }),
								children: isAr ? "إتمام الجولة التدريبية" : "Complete Training Tour"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								variant: "amber",
								size: "sm",
								"data-testid": "tour-next-btn",
								onClick: () => {
									playTactileClick(settings.soundEnabled);
									onNext();
								},
								rightIcon: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" }),
								children: isAr ? "الخطوة التالية" : "Next Step"
							})]
						})]
					})
				]
			})
		]
	});
};
export { TrainingTourOverlay };
