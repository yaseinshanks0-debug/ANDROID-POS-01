import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { B as Package, D as Search, Et as Clock, F as Plus, Ht as Camera, Jt as Barcode, R as Pen, Rt as Check, Tt as Coins, V as PackageX, Wt as Calendar, at as Image, d as Upload, en as ArrowRightLeft, g as Trash2, gt as FileText, j as RefreshCw, m as TrendingUp, n as X, ot as History, p as TriangleAlert, sn as require_react, st as Hash, tt as Layers, u as UserCheck } from "./vendor-icons-DoijI_tq.js";
import { A as useDebouncedValue, B as getAllProductBarcodes, F as triggerHaptic, G as matchesProductSearchQuery, H as getProductExpiryStatus, J as resolveScannedProductBarcode, K as normalizeProductBarcodes, L as formatProductBarcodeSku, M as playScannerBeep, O as compressImageToOptimalDataUrl, P as playTactileClick, R as formatProductSerialNumber, U as getProductSerialNumber, V as getNextProductSerialNumber, W as matchesProductBarcode, ct as getProductPricesInCurrency, et as convertCurrencyAmount, lt as roundCurrencyValue, n as usePOS, q as parseBarcodeSkuInput, rt as formatProductStockBreakdown, st as getProductPackaging, tt as formatCurrency, z as generateBarcode } from "./POSContext-nila8oYV.js";
import { i as require_jsx_runtime } from "./vendor-motion-CekIsQM-.js";
import { _ as TactileButton, a as decodeBarcodeFromImageFileWithDiagnostics, c as recordScannerStage, g as parseNormalizedNumber, h as normalizeNumberInput, i as applyWebCameraTrackEnhancements, l as resetScannerFrameSignatureCache, m as HoldToConfirm, n as AppModal, o as decodeBarcodeFromVideoElementWithDiagnostics, p as AppInput, r as ScannerDiagnosticsPanel, s as isNativeCapacitorEnvironment, u as scanWithNativeMLKit, v as getTranslation } from "./index-DYJDckRU.js";
import { t as AppCard } from "./AppCard-B2erL08q.js";
// src/components/products/ProductsView.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
/**
* Resizes an uploaded image File into a compact WebP Data URL (with JPEG fallback) for reliable persistence (#2 WebP).
*/
function compressImageFileToDataUrl(file, maxDim = 360) {
	return compressImageToOptimalDataUrl(file, maxDim, .84);
}
var ProductsView = () => {
	const { products, addProduct, updateProduct, deleteProduct, settings, updateSettings, currencies, exchangeRates, workspaceMode, pendingNewProductBarcode, setPendingNewProductBarcode, openUnmetDemandModal } = usePOS();
	const t = getTranslation(settings.language);
	const isAr = settings.language === "ar";
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const debouncedSearchQuery = useDebouncedValue(searchQuery, 120);
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("all");
	const [isModalOpen, setIsModalOpen] = (0, import_react.useState)(false);
	const [editingProduct, setEditingProduct] = (0, import_react.useState)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const [formSerialNumber, setFormSerialNumber] = (0, import_react.useState)("1");
	const [formName, setFormName] = (0, import_react.useState)("");
	const [formNameAr, setFormNameAr] = (0, import_react.useState)("");
	const [formDescription, setFormDescription] = (0, import_react.useState)("");
	const [formDescriptionAr, setFormDescriptionAr] = (0, import_react.useState)("");
	const [formSku, setFormSku] = (0, import_react.useState)("");
	const [formBarcode, setFormBarcode] = (0, import_react.useState)("");
	const [formAdditionalBarcodes, setFormAdditionalBarcodes] = (0, import_react.useState)([]);
	const [newBarcodeInput, setNewBarcodeInput] = (0, import_react.useState)("");
	const [formCategory, setFormCategory] = (0, import_react.useState)("General");
	const [formPriceCurrency, setFormPriceCurrency] = (0, import_react.useState)(settings.currency || "SDG");
	const [formCostPrice, setFormCostPrice] = (0, import_react.useState)("1000");
	const [formSellingPrice, setFormSellingPrice] = (0, import_react.useState)("1500");
	const [formEnablePackaging, setFormEnablePackaging] = (0, import_react.useState)(false);
	const [formUnitName, setFormUnitName] = (0, import_react.useState)("Strip");
	const [formUnitNameAr, setFormUnitNameAr] = (0, import_react.useState)("شريط");
	const [formPackName, setFormPackName] = (0, import_react.useState)("Pack");
	const [formPackNameAr, setFormPackNameAr] = (0, import_react.useState)("باكو");
	const [formUnitsPerPack, setFormUnitsPerPack] = (0, import_react.useState)("8");
	const [formDefaultSaleUnit, setFormDefaultSaleUnit] = (0, import_react.useState)("unit");
	const [formAllowedSaleUnits, setFormAllowedSaleUnits] = (0, import_react.useState)("both");
	const [formPackCostPrice, setFormPackCostPrice] = (0, import_react.useState)("8000");
	const [formPackSellingPrice, setFormPackSellingPrice] = (0, import_react.useState)("12000");
	const [formStock, setFormStock] = (0, import_react.useState)("20");
	const [formMinStockAlert, setFormMinStockAlert] = (0, import_react.useState)("5");
	const [formExpiryDate, setFormExpiryDate] = (0, import_react.useState)("");
	const [formEmoji, setFormEmoji] = (0, import_react.useState)("📦");
	const [formColorHex, setFormColorHex] = (0, import_react.useState)("#d97706");
	const [formImage, setFormImage] = (0, import_react.useState)("");
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const [isCameraScannerOpen, setIsCameraScannerOpen] = (0, import_react.useState)(false);
	const [cameraScanTarget, setCameraScanTarget] = (0, import_react.useState)("additional");
	const [cameraActive, setCameraActive] = (0, import_react.useState)(false);
	const [cameraError, setCameraError] = (0, import_react.useState)(null);
	const [isDecodingCameraFrame, setIsDecodingCameraFrame] = (0, import_react.useState)(false);
	const [lastScannedBarcodeFeedback, setLastScannedBarcodeFeedback] = (0, import_react.useState)(null);
	const cameraVideoRef = (0, import_react.useRef)(null);
	const cameraStreamRef = (0, import_react.useRef)(null);
	const barcodePhotoInputRef = (0, import_react.useRef)(null);
	const isNativePlatform = isNativeCapacitorEnvironment();
	const activeCurrencies = (0, import_react.useMemo)(() => {
		if (currencies && currencies.length > 0) return currencies.filter((c) => c.isActive !== false);
		if (workspaceMode === "PRACTICE") return [
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
			}
		];
		return [];
	}, [currencies, workspaceMode]);
	const categories = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		products.forEach((p) => set.add(p.category));
		return Array.from(set);
	}, [products]);
	const filteredProducts = (0, import_react.useMemo)(() => {
		return products.filter((p, idx) => {
			const matchesSearch = matchesProductSearchQuery(p, debouncedSearchQuery, idx);
			const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
			return matchesSearch && matchesCat;
		});
	}, [
		products,
		debouncedSearchQuery,
		categoryFilter
	]);
	const allModalBarcodes = (0, import_react.useMemo)(() => {
		return normalizeProductBarcodes(formBarcode, formAdditionalBarcodes);
	}, [formBarcode, formAdditionalBarcodes]);
	const syncedModalSku = (0, import_react.useMemo)(() => {
		if (allModalBarcodes.length > 0) return allModalBarcodes.join(" | ");
		return formSku;
	}, [allModalBarcodes, formSku]);
	const modalExpiryStatus = (0, import_react.useMemo)(() => {
		return getProductExpiryStatus(formExpiryDate);
	}, [formExpiryDate]);
	const numericCostPrice = parseNormalizedNumber(formCostPrice, 0);
	const numericSellingPrice = parseNormalizedNumber(formSellingPrice, 0);
	const numericUnitsPerPack = Math.max(1, Math.floor(parseNormalizedNumber(formUnitsPerPack, 8)));
	const numericPackCostPrice = parseNormalizedNumber(formPackCostPrice, roundCurrencyValue(numericCostPrice * numericUnitsPerPack, formPriceCurrency));
	const numericPackSellingPrice = parseNormalizedNumber(formPackSellingPrice, roundCurrencyValue(numericSellingPrice * numericUnitsPerPack, formPriceCurrency));
	const unitProfit = Math.round((numericSellingPrice - numericCostPrice) * 100) / 100;
	const packProfit = Math.round((numericPackSellingPrice - numericPackCostPrice) * 100) / 100;
	const profitMarginPercent = numericSellingPrice > 0 ? Math.round((numericSellingPrice - numericCostPrice) / numericSellingPrice * 1e3) / 10 : 0;
	const handleUnitCostChange = (rawVal) => {
		const cleaned = normalizeNumberInput(rawVal);
		setFormCostPrice(cleaned);
		const parsedUnitCost = parseNormalizedNumber(cleaned, 0);
		setFormPackCostPrice(String(roundCurrencyValue(parsedUnitCost * numericUnitsPerPack, formPriceCurrency)));
	};
	const handleUnitSellingChange = (rawVal) => {
		const cleaned = normalizeNumberInput(rawVal);
		setFormSellingPrice(cleaned);
		const parsedUnitSell = parseNormalizedNumber(cleaned, 0);
		setFormPackSellingPrice(String(roundCurrencyValue(parsedUnitSell * numericUnitsPerPack, formPriceCurrency)));
	};
	const handlePackCostChange = (rawVal) => {
		const cleaned = normalizeNumberInput(rawVal);
		setFormPackCostPrice(cleaned);
		const parsedPackCost = parseNormalizedNumber(cleaned, 0);
		if (numericUnitsPerPack > 0) setFormCostPrice(String(roundCurrencyValue(parsedPackCost / numericUnitsPerPack, formPriceCurrency)));
	};
	const handlePackSellingChange = (rawVal) => {
		const cleaned = normalizeNumberInput(rawVal);
		setFormPackSellingPrice(cleaned);
		const parsedPackSell = parseNormalizedNumber(cleaned, 0);
		if (numericUnitsPerPack > 0) setFormSellingPrice(String(roundCurrencyValue(parsedPackSell / numericUnitsPerPack, formPriceCurrency)));
	};
	const handleUnitsPerPackChange = (rawVal) => {
		const cleaned = normalizeNumberInput(rawVal);
		setFormUnitsPerPack(cleaned);
		const nextUnits = Math.max(1, Math.floor(parseNormalizedNumber(cleaned, 1)));
		const currentUnitCost = parseNormalizedNumber(formCostPrice, 0);
		const currentUnitSell = parseNormalizedNumber(formSellingPrice, 0);
		setFormPackCostPrice(String(roundCurrencyValue(currentUnitCost * nextUnits, formPriceCurrency)));
		setFormPackSellingPrice(String(roundCurrencyValue(currentUnitSell * nextUnits, formPriceCurrency)));
	};
	const applyPackagingPreset = (preset) => {
		playTactileClick(settings.soundEnabled);
		setFormEnablePackaging(true);
		setFormUnitName(preset.unitName);
		setFormUnitNameAr(preset.unitNameAr);
		setFormPackName(preset.packName);
		setFormPackNameAr(preset.packNameAr);
		setFormUnitsPerPack(String(preset.unitsPerPack));
		const currentUnitCost = parseNormalizedNumber(formCostPrice, 0);
		const currentUnitSell = parseNormalizedNumber(formSellingPrice, 0);
		setFormPackCostPrice(String(roundCurrencyValue(currentUnitCost * preset.unitsPerPack, formPriceCurrency)));
		setFormPackSellingPrice(String(roundCurrencyValue(currentUnitSell * preset.unitsPerPack, formPriceCurrency)));
	};
	const handleModalCurrencyChange = (targetCurrCode) => {
		playTactileClick(settings.soundEnabled);
		const nextCode = targetCurrCode.toUpperCase();
		if (nextCode === formPriceCurrency) return;
		const currentCost = parseNormalizedNumber(formCostPrice, 0);
		const currentSelling = parseNormalizedNumber(formSellingPrice, 0);
		const currentPackCost = parseNormalizedNumber(formPackCostPrice, currentCost * numericUnitsPerPack);
		const currentPackSelling = parseNormalizedNumber(formPackSellingPrice, currentSelling * numericUnitsPerPack);
		const convertedCost = convertCurrencyAmount(currentCost, formPriceCurrency, nextCode, exchangeRates);
		const convertedSelling = convertCurrencyAmount(currentSelling, formPriceCurrency, nextCode, exchangeRates);
		const convertedPackCost = convertCurrencyAmount(currentPackCost, formPriceCurrency, nextCode, exchangeRates);
		const convertedPackSelling = convertCurrencyAmount(currentPackSelling, formPriceCurrency, nextCode, exchangeRates);
		setFormPriceCurrency(nextCode);
		setFormCostPrice(String(convertedCost));
		setFormSellingPrice(String(convertedSelling));
		setFormPackCostPrice(String(convertedPackCost));
		setFormPackSellingPrice(String(convertedPackSelling));
	};
	const handleAddExtraBarcode = (customCode) => {
		playTactileClick(settings.soundEnabled);
		const candidate = String(customCode !== void 0 ? customCode : newBarcodeInput).trim();
		if (!candidate) {
			setErrorMessage(isAr ? "يرجى كتابة الباركود أو مسحه بالكاميرا أولاً، أو الضغط على زر توليد باركود إضافي." : "Please type or scan a barcode first, or click the Generate Barcode button explicitly.");
			return;
		}
		const resolution = resolveScannedProductBarcode({
			scannedCode: candidate,
			target: "additional",
			currentPrimary: formBarcode,
			currentAdditional: formAdditionalBarcodes,
			existingProducts: products,
			editingProductId: editingProduct?.id
		});
		if (!resolution.ok) {
			setErrorMessage(isAr ? resolution.errorAr || null : resolution.errorEn || null);
			return;
		}
		setErrorMessage(null);
		setFormBarcode(resolution.primaryBarcode);
		setFormAdditionalBarcodes(resolution.additionalBarcodes);
		if (customCode === void 0) setNewBarcodeInput("");
	};
	const handleApplyCameraScannedBarcode = async (rawScannedCode, targetOverride) => {
		const target = targetOverride || cameraScanTarget;
		let candidate = String(rawScannedCode || "").trim();
		if (!candidate && cameraVideoRef.current && cameraActive) {
			setIsDecodingCameraFrame(true);
			try {
				const res = await decodeBarcodeFromVideoElementWithDiagnostics(cameraVideoRef.current);
				if (res?.rawValue) candidate = String(res.rawValue).trim();
			} finally {
				setIsDecodingCameraFrame(false);
			}
		}
		if (!candidate) candidate = String(newBarcodeInput).trim();
		const resolution = resolveScannedProductBarcode({
			scannedCode: candidate,
			target,
			currentPrimary: formBarcode,
			currentAdditional: formAdditionalBarcodes,
			existingProducts: products,
			editingProductId: editingProduct?.id
		});
		if (!resolution.ok) {
			setErrorMessage(isAr ? resolution.errorAr || null : resolution.errorEn || null);
			return false;
		}
		playScannerBeep(settings.soundEnabled);
		triggerHaptic("success", settings.hapticsEnabled);
		setErrorMessage(null);
		setFormBarcode(String(resolution.primaryBarcode));
		setFormAdditionalBarcodes(resolution.additionalBarcodes);
		setNewBarcodeInput("");
		setLastScannedBarcodeFeedback(isAr ? `تم قراءة وإضافة الباركود بالكاميرا بنجاح: ${resolution.code}` : `Camera scanned & added barcode: ${resolution.code}`);
		if (cameraStreamRef.current) {
			cameraStreamRef.current.getTracks().forEach((track) => track.stop());
			cameraStreamRef.current = null;
		}
		setCameraActive(false);
		return true;
	};
	(0, import_react.useEffect)(() => {
		if (cameraActive && cameraVideoRef.current && cameraStreamRef.current) {
			const videoEl = cameraVideoRef.current;
			if (videoEl.srcObject !== cameraStreamRef.current) videoEl.srcObject = cameraStreamRef.current;
			videoEl.play().catch(() => {});
		}
	}, [cameraActive, isCameraScannerOpen]);
	(0, import_react.useEffect)(() => {
		let scanTimer = null;
		let isCancelled = false;
		if (isModalOpen && isCameraScannerOpen) {
			resetScannerFrameSignatureCache();
			if (isNativePlatform) scanWithNativeMLKit().then((res) => {
				if (!isCancelled && res?.rawValue) handleApplyCameraScannedBarcode(String(res.rawValue));
			});
			else if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
				recordScannerStage("Camera Initialized", "Requesting rear camera in Product Modal");
				navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: { ideal: "environment" },
						width: { ideal: 1280 },
						height: { ideal: 720 }
					},
					audio: false
				}).catch(() => navigator.mediaDevices.getUserMedia({
					video: true,
					audio: false
				})).then(async (mediaStream) => {
					if (isCancelled) {
						mediaStream.getTracks().forEach((t) => t.stop());
						return;
					}
					cameraStreamRef.current = mediaStream;
					await applyWebCameraTrackEnhancements(mediaStream);
					setCameraActive(true);
					setCameraError(null);
					recordScannerStage("Video Stream Started", "Product Modal rear camera stream started");
					const runDecodeLoop = async () => {
						if (isCancelled) return;
						const videoEl = cameraVideoRef.current;
						if (videoEl && videoEl.readyState >= 2) try {
							const decoded = await decodeBarcodeFromVideoElementWithDiagnostics(videoEl);
							if (!isCancelled && decoded?.rawValue) {
								if (await handleApplyCameraScannedBarcode(String(decoded.rawValue))) return;
							}
						} catch {}
						if (!isCancelled) scanTimer = window.setTimeout(runDecodeLoop, 220);
					};
					scanTimer = window.setTimeout(runDecodeLoop, 300);
				}).catch(() => {
					if (!isCancelled) {
						setCameraActive(false);
						setCameraError(isAr ? "الكاميرا المباشرة غير متاحة حالياً — يمكنك الضغط على \"تصوير / اختيار صورة باركود\" لقراءة الباركود من صورة." : "Live camera stream unavailable — click \"Scan from Camera Photo\" to decode a barcode from an image.");
					}
				});
			} else {
				setCameraActive(false);
				setCameraError(isAr ? "الكاميرا المباشرة غير مدعومة في هذا المتصفح — استخدم زر \"تصوير / اختيار صورة باركود\" بالأسفل." : "Camera API unavailable — use the \"Scan from Camera Photo\" button below.");
			}
		}
		return () => {
			isCancelled = true;
			if (scanTimer) window.clearTimeout(scanTimer);
			if (cameraStreamRef.current) {
				cameraStreamRef.current.getTracks().forEach((track) => track.stop());
				cameraStreamRef.current = null;
			}
			setCameraActive(false);
		};
	}, [
		isModalOpen,
		isCameraScannerOpen,
		isAr
	]);
	const handleBarcodePhotoCapture = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setIsDecodingCameraFrame(true);
		setErrorMessage(null);
		try {
			const detected = await decodeBarcodeFromImageFileWithDiagnostics(file);
			if (detected?.rawValue) await handleApplyCameraScannedBarcode(String(detected.rawValue));
			else setErrorMessage(isAr ? "تعذر قراءة الباركود من الصورة المختارة. يرجى التأكد من وضوح خطوط الباركود في الصورة." : "Could not read a barcode from the selected photo. Please ensure the barcode lines are sharp and clear.");
		} finally {
			setIsDecodingCameraFrame(false);
			if (barcodePhotoInputRef.current) barcodePhotoInputRef.current.value = "";
		}
	};
	const handleRemoveBarcode = (codeToRemove) => {
		playTactileClick(settings.soundEnabled);
		if (codeToRemove === formBarcode) {
			if (formAdditionalBarcodes.length > 0) {
				const [nextPrimary, ...rest] = formAdditionalBarcodes;
				setFormBarcode(nextPrimary);
				setFormAdditionalBarcodes(rest);
				setFormSku([nextPrimary, ...rest].join(" | "));
			} else {
				setFormBarcode("");
				setFormSku("");
			}
		} else {
			const nextExtra = formAdditionalBarcodes.filter((c) => c !== codeToRemove);
			setFormAdditionalBarcodes(nextExtra);
			setFormSku(normalizeProductBarcodes(formBarcode, nextExtra).join(" | "));
		}
	};
	const handleSetPrimaryBarcode = (codeToPromote) => {
		playTactileClick(settings.soundEnabled);
		if (codeToPromote === formBarcode) return;
		const previousPrimary = formBarcode;
		setFormBarcode(codeToPromote);
		setFormAdditionalBarcodes((prev) => normalizeProductBarcodes(previousPrimary, prev.filter((c) => c !== codeToPromote)));
	};
	const handleImageFileUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const dataUrl = await compressImageFileToDataUrl(file);
			setFormImage(dataUrl);
			setErrorMessage(null);
		} catch (err) {
			setErrorMessage(err.message || "Failed to process product image");
		} finally {
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};
	const openCreateModal = (prefilledBarcode) => {
		const initialBarcode = typeof prefilledBarcode === "string" ? String(prefilledBarcode).trim() : "";
		const isPractice = workspaceMode === "PRACTICE";
		setEditingProduct(null);
		setErrorMessage(null);
		setIsCameraScannerOpen(false);
		setLastScannedBarcodeFeedback(initialBarcode ? isAr ? `تم تعبئة الباركود الممسوح تلقائياً: ${initialBarcode}` : `Auto-filled scanned barcode: ${initialBarcode}` : null);
		setFormSerialNumber(String(getNextProductSerialNumber(products)));
		setFormName("");
		setFormNameAr("");
		setFormDescription("");
		setFormDescriptionAr("");
		setFormSku(initialBarcode ? initialBarcode : "");
		setFormBarcode(initialBarcode);
		setFormAdditionalBarcodes([]);
		setNewBarcodeInput("");
		setFormExpiryDate("");
		setFormCategory(categories[0] || (isPractice ? "Beverages" : ""));
		const activeCurr = (activeCurrencies.length > 0 ? activeCurrencies[0].code : "") || settings.currency || "SDG";
		setFormPriceCurrency(activeCurr);
		if (isPractice) {
			const defaultCostSdg = 2700;
			const defaultSellSdg = 5400;
			const initUnitCost = convertCurrencyAmount(defaultCostSdg, "SDG", activeCurr, exchangeRates);
			const initUnitSell = convertCurrencyAmount(defaultSellSdg, "SDG", activeCurr, exchangeRates);
			setFormCostPrice(String(initUnitCost));
			setFormSellingPrice(String(initUnitSell));
			setFormPackCostPrice(String(roundCurrencyValue(initUnitCost * 8, activeCurr)));
			setFormPackSellingPrice(String(roundCurrencyValue(initUnitSell * 8, activeCurr)));
			setFormStock("25");
			setFormMinStockAlert("5");
		} else {
			setFormCostPrice("");
			setFormSellingPrice("");
			setFormPackCostPrice("");
			setFormPackSellingPrice("");
			setFormStock("0");
			setFormMinStockAlert("0");
		}
		setFormEnablePackaging(false);
		setFormUnitName("Strip");
		setFormUnitNameAr("شريط");
		setFormPackName("Pack");
		setFormPackNameAr("باكو");
		setFormUnitsPerPack("8");
		setFormDefaultSaleUnit("unit");
		setFormAllowedSaleUnits("both");
		setFormEmoji("📦");
		setFormColorHex("#d97706");
		setFormImage("");
		setIsModalOpen(true);
	};
	(0, import_react.useEffect)(() => {
		if (pendingNewProductBarcode && pendingNewProductBarcode.trim().length > 0) {
			const code = String(pendingNewProductBarcode).trim();
			openCreateModal(code);
			setPendingNewProductBarcode(null);
		}
	}, [pendingNewProductBarcode]);
	const openEditModal = (p) => {
		setEditingProduct(p);
		setErrorMessage(null);
		setIsCameraScannerOpen(false);
		setLastScannedBarcodeFeedback(null);
		setFormSerialNumber(String(getProductSerialNumber(p)));
		setFormName(p.name);
		setFormNameAr(p.nameAr || "");
		setFormDescription(p.description || p.customFields?.description || "");
		setFormDescriptionAr(p.descriptionAr || p.customFields?.descriptionAr || "");
		const allCodes = getAllProductBarcodes(p);
		setFormSku(allCodes.length > 0 ? allCodes.join(" | ") : p.sku);
		setFormBarcode(allCodes[0] || p.barcode || "");
		setFormAdditionalBarcodes(allCodes.slice(1));
		setNewBarcodeInput("");
		setFormExpiryDate((p.expiryDate || p.customFields?.expiryDate || "").toString().slice(0, 10));
		setFormCategory(p.category);
		const displayCurr = settings.currency || p.priceCurrency || "SDG";
		const converted = getProductPricesInCurrency(p, displayCurr, exchangeRates);
		const pkg = getProductPackaging(p);
		setFormPriceCurrency(displayCurr);
		setFormCostPrice(converted.costPrice.toString());
		setFormSellingPrice(converted.sellingPrice.toString());
		setFormEnablePackaging(pkg.enablePackaging);
		setFormUnitName(pkg.unitName || "Strip");
		setFormUnitNameAr(pkg.unitNameAr || "شريط");
		setFormPackName(pkg.packName || "Pack");
		setFormPackNameAr(pkg.packNameAr || "باكو");
		setFormUnitsPerPack(String(pkg.unitsPerPack || 8));
		setFormDefaultSaleUnit(pkg.defaultSaleUnit || "unit");
		setFormAllowedSaleUnits(pkg.allowedSaleUnits || "both");
		setFormPackCostPrice(converted.packCostPrice.toString());
		setFormPackSellingPrice(converted.packSellingPrice.toString());
		setFormStock(p.stock.toString());
		setFormMinStockAlert(p.minStockAlert.toString());
		setFormEmoji(p.emoji || "📦");
		setFormColorHex(p.colorHex || "#d97706");
		setFormImage(p.image || p.imageUrl || p.customFields?.image || "");
		setIsModalOpen(true);
	};
	const handleSave = async (e) => {
		e.preventDefault();
		if (!formName.trim()) return;
		setErrorMessage(null);
		const pendingExtra = newBarcodeInput.trim();
		const rawCombinedBarcodes = normalizeProductBarcodes(formBarcode.trim(), pendingExtra ? [...formAdditionalBarcodes, pendingExtra] : formAdditionalBarcodes);
		const parsedFromSkuBox = rawCombinedBarcodes.length === 0 && formSku.trim() ? parseBarcodeSkuInput(formSku) : [];
		const finalBarcodes = rawCombinedBarcodes.length > 0 ? rawCombinedBarcodes : parsedFromSkuBox;
		for (const code of finalBarcodes) {
			if (!code) continue;
			const conflict = products.find((p) => (!editingProduct || p.id !== editingProduct.id) && matchesProductBarcode(p, code, true));
			if (conflict) {
				setErrorMessage(isAr ? `الباركود "${code}" مستخدم بالفعل للمنتج "${conflict.nameAr || conflict.name}".` : `Duplicate barcode: "${code}" is already assigned to "${conflict.name}".`);
				return;
			}
		}
		const parsedSerial = Math.max(1, Math.floor(parseNormalizedNumber(formSerialNumber, getNextProductSerialNumber(products))));
		const rawCost = Math.max(0, parseNormalizedNumber(formCostPrice, 0));
		const rawSelling = Math.max(0, parseNormalizedNumber(formSellingPrice, 0));
		const finalUnitsPerPack = formEnablePackaging ? Math.max(2, Math.floor(parseNormalizedNumber(formUnitsPerPack, 8))) : 1;
		const rawPackCost = formEnablePackaging ? Math.max(0, parseNormalizedNumber(formPackCostPrice, roundCurrencyValue(rawCost * finalUnitsPerPack, formPriceCurrency))) : rawCost;
		const rawPackSelling = formEnablePackaging ? Math.max(0, parseNormalizedNumber(formPackSellingPrice, roundCurrencyValue(rawSelling * finalUnitsPerPack, formPriceCurrency))) : rawSelling;
		const finalDefaultSaleUnit = formAllowedSaleUnits === "pack_only" ? "pack" : formAllowedSaleUnits === "unit_only" ? "unit" : formDefaultSaleUnit;
		const cleanImage = formImage.trim() || void 0;
		const cleanDesc = formDescription.trim() || void 0;
		const cleanDescAr = formDescriptionAr.trim() || void 0;
		const cleanExpiryDate = formExpiryDate.trim() || null;
		const synchronizedSku = formatProductBarcodeSku(finalBarcodes, formSku, parsedSerial);
		const packagingMetadata = {
			enablePackaging: formEnablePackaging,
			unitName: formUnitName.trim() || "Strip",
			unitNameAr: formUnitNameAr.trim() || "شريط",
			packName: formPackName.trim() || "Pack",
			packNameAr: formPackNameAr.trim() || "باكو",
			unitsPerPack: finalUnitsPerPack,
			defaultSaleUnit: formEnablePackaging ? finalDefaultSaleUnit : "unit",
			allowedSaleUnits: formEnablePackaging ? formAllowedSaleUnits : "unit_only",
			packCostPrice: rawPackCost,
			packSellingPrice: rawPackSelling
		};
		const payload = {
			serialNumber: parsedSerial,
			name: formName.trim(),
			nameAr: formNameAr.trim() || void 0,
			description: cleanDesc,
			descriptionAr: cleanDescAr,
			sku: synchronizedSku,
			barcode: finalBarcodes[0] || "",
			barcodes: finalBarcodes,
			category: formCategory.trim() || "General",
			costPrice: rawCost,
			sellingPrice: rawSelling,
			priceCurrency: formPriceCurrency,
			...packagingMetadata,
			stock: Math.max(0, Math.floor(parseNormalizedNumber(formStock, 0))),
			minStockAlert: Math.max(0, Math.floor(parseNormalizedNumber(formMinStockAlert, 0))),
			expiryDate: cleanExpiryDate,
			image: cleanImage,
			imageUrl: cleanImage || null,
			emoji: formEmoji || "📦",
			colorHex: formColorHex || "#d97706",
			customFields: {
				...editingProduct?.customFields || {},
				serialNumber: parsedSerial,
				description: cleanDesc,
				descriptionAr: cleanDescAr,
				expiryDate: cleanExpiryDate,
				barcodes: finalBarcodes,
				priceCurrency: formPriceCurrency,
				...packagingMetadata,
				...cleanImage ? { image: cleanImage } : {}
			}
		};
		try {
			if (editingProduct) await updateProduct(editingProduct.id, payload);
			else await addProduct(payload);
			setIsModalOpen(false);
		} catch (err) {
			setErrorMessage(err.message || "Failed to save product");
		}
	};
	const handleDelete = async (id) => {
		try {
			await deleteProduct(id);
			setIsModalOpen(false);
		} catch (err) {
			setErrorMessage(err.message || "Failed to delete product");
		}
	};
	const activeRateToSdg = settings.currency === "SDG" ? 1 : exchangeRates[settings.currency] || 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-5 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl sm:text-2xl font-extrabold text-white tracking-tight",
					children: t.productCatalog
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-neutral-400",
					children: isAr ? `${products.length} منتج مسجل • الأسعار مرتبطة تلقائياً بسعر الصرف` : `${products.length} registered catalog items • Prices dynamically linked to exchange rates`
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": "products-open-unmet-demand-btn",
						onClick: () => openUnmetDemandModal({
							sourceScreen: "products",
							productNameSnapshot: searchQuery.trim() || void 0
						}),
						className: "inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageX, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تسجيل طلب غير متوفر" : "Record Unmet Demand" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						variant: "amber",
						size: "md",
						"data-testid": "open-create-product-modal-btn",
						onClick: () => openCreateModal(),
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }),
						children: t.createProduct
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4 rounded-2xl bg-neutral-900/95 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "w-4 h-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs sm:text-sm font-bold text-white truncate",
							children: isAr ? "عملة عرض وتسعير المنتجات (مرتبطة بسعر الصرف)" : "Active Product Pricing Currency (Exchange Rate Linked)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-mono tabular-nums text-neutral-400 mt-0.5",
							children: settings.currency === "SDG" ? isAr ? "العملة الأساسية: الجنيه السوداني · SDG" : "Base Accounting Currency · SDG (1.00)" : isAr ? `سعر الصرف الفعال · 1 ${settings.currency} = ${activeRateToSdg.toLocaleString()} ج.س (SDG)` : `Active Rate · 1 ${settings.currency} = ${activeRateToSdg.toLocaleString()} SDG`
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center flex-wrap gap-1.5 shrink-0",
					children: activeCurrencies.map((curr) => {
						const isSelected = settings.currency === curr.code;
						const rateVal = curr.code === "SDG" ? 1 : exchangeRates[curr.code] || 1;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								playTactileClick(settings.soundEnabled);
								updateSettings({ currency: curr.code });
							},
							className: `px-3 py-1.5 rounded-xl text-xs font-mono font-bold tabular-nums transition-all border inline-flex items-center gap-1.5 whitespace-nowrap ${isSelected ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-sm" : "bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: curr.code }), curr.code !== "SDG" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `text-[10px] font-mono tabular-nums ${isSelected ? "text-neutral-900" : "text-neutral-400"}`,
								children: ["· ", rateVal]
							})]
						}, curr.code);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
						"data-testid": "products-search-input",
						placeholder: isAr ? "ابحث بأي كلمة من اسم المنتج، الوصف، الرقم التسلسلي (#0001)، SKU، أو الباركود..." : "Search by any word in product name, description, serial (#0001), SKU, or barcode...",
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4" }),
						rightIcon: searchQuery ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSearchQuery(""),
							className: "p-1 text-neutral-400 hover:text-white",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
						}) : void 0
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: categoryFilter,
					onChange: (e) => setCategoryFilter(e.target.value),
					className: "min-h-[46px] px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-amber-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: t.allCategories
					}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c,
						children: c
					}, c))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
				children: filteredProducts.map((p, idx) => {
					const isLow = p.stock <= p.minStockAlert;
					const isOut = p.stock <= 0;
					const allCodes = getAllProductBarcodes(p);
					const extraBarcodeCount = Math.max(0, allCodes.length - 1);
					const convertedPrices = getProductPricesInCurrency(p, settings.currency, exchangeRates);
					const pkg = getProductPackaging(p);
					const stockBreakdownText = formatProductStockBreakdown(p, settings.language);
					const unitLabel = isAr ? pkg.unitNameAr : pkg.unitName;
					const packLabel = isAr ? pkg.packNameAr : pkg.packName;
					const productImg = p.image || p.imageUrl || p.customFields?.image;
					const serialNum = getProductSerialNumber(p, idx);
					const serialBadge = formatProductSerialNumber(serialNum);
					const prodDesc = isAr ? p.descriptionAr || p.customFields?.descriptionAr || p.description || p.customFields?.description : p.description || p.customFields?.description || p.descriptionAr || p.customFields?.descriptionAr;
					const createdDateStr = p.createdAt || p.customFields?.createdAt || p.updatedAt;
					const prevSellRaw = p.previousSellingPrice ?? p.customFields?.previousSellingPrice;
					const prodCurr = (p.priceCurrency || p.customFields?.priceCurrency || "SDG").toString().toUpperCase();
					const prevSellConverted = prevSellRaw !== void 0 && prevSellRaw > 0 ? convertCurrencyAmount(Number(prevSellRaw), prodCurr, settings.currency, exchangeRates) : null;
					const priceUpdatedAt = p.priceUpdatedAt || p.customFields?.priceUpdatedAt;
					const modHistory = p.modificationHistory || p.customFields?.modificationHistory || [];
					const expiryInfo = getProductExpiryStatus(p);
					const displayBarcodeSku = allCodes.length > 0 ? allCodes.join(" | ") : p.sku;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppCard, {
						className: "flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2 mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 min-w-0",
									children: [productImg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-12 h-12 rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700/60 shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: productImg,
											alt: p.name,
											className: "w-full h-full object-cover"
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-12 h-12 flex items-center justify-center text-2xl bg-neutral-800/80 rounded-xl border border-neutral-700/60 shrink-0",
										style: { backgroundColor: `${p.colorHex || "#d97706"}22` },
										children: p.emoji || "📦"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 flex-wrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												"data-testid": `product-serial-badge-${p.id}`,
												className: "px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-extrabold shrink-0",
												title: isAr ? `الرقم التسلسلي للمنتج: ${serialNum}` : `Product Serial: ${serialNum}`,
												children: serialBadge
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-sm font-bold text-white leading-snug truncate",
												children: settings.language === "ar" && p.nameAr ? p.nameAr : p.name
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center flex-wrap gap-2 text-[11px] text-neutral-400 mt-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												"data-testid": `product-sku-barcode-${p.id}`,
												className: "font-mono text-amber-300/90 truncate max-w-[220px]",
												title: isAr ? `رمز الصنف (الباركود): ${displayBarcodeSku}` : `SKU (Barcode): ${displayBarcodeSku}`,
												children: displayBarcodeSku
											}), createdDateStr && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1 text-neutral-400",
												title: isAr ? "تاريخ الإضافة" : "Date Added",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3 text-neutral-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-[10px]",
													children: new Date(createdDateStr).toLocaleDateString(isAr ? "ar-SA" : "en-US", {
														month: "short",
														day: "numeric",
														year: "numeric"
													})
												})]
											})] })]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[10px] px-2 py-0.5 rounded-md font-semibold shrink-0 ${isOut ? "bg-rose-950/80 text-rose-400 border border-rose-800/60" : isLow ? "bg-amber-950/80 text-amber-400 border border-amber-800/60" : "bg-neutral-800 text-neutral-300"}`,
									children: isOut ? t.outOfStock : stockBreakdownText
								})]
							}),
							prodDesc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-neutral-400 line-clamp-2 mb-2 bg-neutral-950/50 px-2.5 py-1.5 rounded-lg border border-neutral-800/60",
								children: prodDesc
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center flex-wrap gap-1.5 text-xs text-neutral-400 my-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 bg-neutral-950/80 px-2 py-1 rounded-lg border border-neutral-800 font-mono",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Barcode, { className: "w-3.5 h-3.5 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-neutral-200",
											children: allCodes.length > 0 ? allCodes.join(" | ") : p.barcode || (isAr ? "بدون باركود" : "No barcode")
										})]
									}),
									extraBarcodeCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold",
										title: allCodes.join(" | "),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: allCodes.length
											}),
											" ",
											isAr ? "باركودات" : "barcodes"
										]
									}),
									expiryInfo.expiryDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										"data-testid": `product-expiry-badge-${p.id}`,
										className: `px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 border ${expiryInfo.status === "expired" ? "bg-rose-950/80 border-rose-700/70 text-rose-300" : expiryInfo.status === "expiring_soon" ? "bg-amber-950/80 border-amber-700/70 text-amber-300" : "bg-emerald-950/60 border-emerald-700/50 text-emerald-300"}`,
										title: isAr ? `تاريخ الانتهاء: ${expiryInfo.expiryDate}` : `Expiry Date: ${expiryInfo.expiryDate}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3 h-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: expiryInfo.status === "expired" ? isAr ? `منتهي الصلاحية (${expiryInfo.expiryDate})` : `Expired (${expiryInfo.expiryDate})` : expiryInfo.status === "expiring_soon" ? isAr ? `ينتهي قريباً: ${expiryInfo.expiryDate}` : `Expiring: ${expiryInfo.expiryDate}` : isAr ? `الانتهاء: ${expiryInfo.expiryDate}` : `Exp: ${expiryInfo.expiryDate}` })]
									}),
									pkg.enablePackaging && pkg.unitsPerPack > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-3 h-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											"الـ",
											packLabel,
											" = ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: pkg.unitsPerPack
											}),
											" ",
											unitLabel
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											"1 ",
											packLabel,
											" = ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: pkg.unitsPerPack
											}),
											" ",
											unitLabel
										] }) })]
									}),
									modHistory.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "px-2 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300 text-[10px] font-semibold flex items-center gap-1",
										title: isAr ? modHistory[0].summaryAr || "سجل التعديلات" : modHistory[0].summaryEn || "Modification log",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-3 h-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? `${modHistory.length} تعديلات` : `${modHistory.length} edits` })]
									})
								]
							}),
							prevSellConverted !== null && Math.abs(prevSellConverted - convertedPrices.sellingPrice) > .001 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 px-2.5 py-1.5 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-center justify-between gap-2 text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-amber-300",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-3.5 h-3.5 shrink-0 text-amber-400" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "السعر السابق:" : "Old Price:" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "line-through text-neutral-400 tabular-nums font-bold",
											children: formatCurrency(prevSellConverted, settings.currency, settings.language)
										})
									]
								}), priceUpdatedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono text-neutral-400",
									children: new Date(priceUpdatedAt).toLocaleDateString(isAr ? "ar-SA" : "en-US", {
										month: "short",
										day: "numeric"
									})
								})]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 border-t border-neutral-800 flex items-center justify-between gap-2",
							children: [pkg.enablePackaging && pkg.unitsPerPack > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2.5 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-xl bg-neutral-950/70 border border-neutral-800/90",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-neutral-400 block",
										children: isAr ? `سعر الـ${unitLabel}` : `${unitLabel} Price`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-extrabold text-emerald-400 tabular-nums",
										children: formatCurrency(convertedPrices.sellingPrice, settings.currency, settings.language)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-2 rounded-xl bg-amber-500/10 border border-amber-500/30",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-amber-300 font-semibold block",
										children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											"سعر الـ",
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
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-extrabold text-amber-400 tabular-nums",
										children: formatCurrency(convertedPrices.packSellingPrice, settings.currency, settings.language)
									})]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-neutral-400 block",
									children: isAr ? "سعر الشراء (التكلفة)" : "Purchase / Cost"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-neutral-200 tabular-nums",
									children: formatCurrency(convertedPrices.costPrice, settings.currency, settings.language)
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-neutral-400 block",
									children: isAr ? "سعر البيع" : "Selling Price"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-extrabold text-emerald-400 tabular-nums",
									children: formatCurrency(convertedPrices.sellingPrice, settings.currency, settings.language)
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
								variant: "secondary",
								size: "sm",
								onClick: () => openEditModal(p),
								leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-3.5 h-3.5" }),
								children: isAr ? "تعديل / السجل" : "Edit / Log"
							})]
						})]
					}, p.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppModal, {
				isOpen: isModalOpen,
				onClose: () => setIsModalOpen(false),
				title: editingProduct ? t.editProduct : t.createProduct,
				maxWidth: "2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSave,
					className: "flex flex-col gap-4 max-h-[78vh] overflow-y-auto pr-1",
					children: [
						errorMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 shrink-0 text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errorMessage })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-12 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "sm:col-span-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
										label: isAr ? "الرقم التسلسلي (#)" : "Serial No. (#)",
										type: "text",
										inputMode: "numeric",
										dir: "ltr",
										value: formSerialNumber,
										onChange: (e) => setFormSerialNumber(normalizeNumberInput(e.target.value)),
										placeholder: "1",
										leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "w-3.5 h-3.5 text-amber-400" })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "sm:col-span-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
										label: isAr ? "اسم المنتج (انجليزي / افتراضي)" : t.productName,
										value: formName,
										onChange: (e) => setFormName(e.target.value),
										placeholder: isAr ? "مثال: Specialty Coffee Beans" : "e.g. Specialty Coffee Beans",
										required: true,
										autoFocus: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "sm:col-span-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
										label: isAr ? "الاسم بالعربية" : "Arabic Name (الاسم بالعربية)",
										value: formNameAr,
										onChange: (e) => setFormNameAr(e.target.value),
										placeholder: "مثال: بن قهوة مختصة"
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
								label: isAr ? "وصف المنتج (بالعربية - يظهر في البحث الشامل)" : "Arabic Description (Searchable)",
								value: formDescriptionAr,
								onChange: (e) => setFormDescriptionAr(e.target.value),
								placeholder: isAr ? "اكتب تفاصيل أو كلمات مفتاحية للمنتج للبحث عنها بأي كلمة..." : "Arabic product description & searchable keywords...",
								leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5 text-neutral-400" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
								label: isAr ? "وصف المنتج (انجليزي / إضافي)" : "Product Description (Searchable Keywords)",
								value: formDescription,
								onChange: (e) => setFormDescription(e.target.value),
								placeholder: isAr ? "Example: Herbal ammonia-free hair dye sachets..." : "e.g. Herbal ammonia-free black henna hair dye sachets...",
								leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5 text-neutral-400" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold text-amber-400 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Barcode, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "إدارة الباركود المتعدد، رمز الصنف (SKU = الباركود)، وتاريخ الانتهاء" : "Multi-Barcode SKU & Expiry Date Manager" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-neutral-400",
										children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											"عدد الباركودات المرتبطة بالصنف:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-bold text-neutral-200 tabular-nums",
												children: allModalBarcodes.length
											})
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-bold text-neutral-200 tabular-nums",
												children: allModalBarcodes.length
											}),
											" ",
											"barcode(s)"
										] })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-12 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-4 min-w-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-neutral-300 block mb-1.5",
													children: isAr ? "رمز SKU (رمز الباركود أو الباركودات المتعددة للصنف)" : "SKU (Product Barcode / Multi-Barcodes)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "relative",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														dir: "ltr",
														"data-testid": "product-sku-barcodes-input",
														value: syncedModalSku,
														onChange: (e) => {
															const val = e.target.value;
															setFormSku(val);
															const parsedCodes = parseBarcodeSkuInput(val);
															if (parsedCodes.length > 0) {
																setFormBarcode(parsedCodes[0]);
																setFormAdditionalBarcodes(parsedCodes.slice(1));
															} else if (!val.trim()) {
																setFormBarcode("");
																setFormAdditionalBarcodes([]);
															}
														},
														placeholder: isAr ? "مرتبط تلقائياً بالباركود أو الباركودات المتعددة (مثال: 628101 | 628102)" : "Auto-synced with barcode(s) (e.g. 628101 | 628102)",
														className: "w-full min-h-[44px] px-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-amber-300 placeholder:font-sans placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-neutral-400 block mt-1",
													children: isAr ? "يعرض تلقائياً باركود الصنف أو جميع باركوداته المتعددة مفصولة بـ ( | )" : "Automatically reflects the item barcode or multiple barcodes separated by ( | )"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-5 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-xs font-semibold text-neutral-300 block mb-1.5",
												children: isAr ? "الباركود الأساسي للمنتج (امسح بالكاميرا أو اكتب أو اضغط توليد)" : "Primary Product Barcode (Scan, type, or click Generate)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap sm:flex-nowrap gap-1.5 min-w-0",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														dir: "ltr",
														"data-testid": "primary-barcode-input",
														value: formBarcode,
														onChange: (e) => {
															const nextPrimary = e.target.value;
															setFormBarcode(nextPrimary);
															const nextCodes = normalizeProductBarcodes(nextPrimary, formAdditionalBarcodes);
															setFormSku(nextCodes.join(" | "));
														},
														placeholder: isAr ? "امسح أو اكتب الباركود أو اضغط توليد" : "Scan, type, or click Generate",
														className: "flex-1 min-w-0 min-h-[44px] px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm font-mono text-neutral-100 placeholder:font-sans placeholder:text-xs focus:outline-none focus:border-amber-500"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														"data-testid": "open-camera-primary-barcode-btn",
														onClick: () => {
															playTactileClick(settings.soundEnabled);
															setCameraScanTarget("primary");
															setIsCameraScannerOpen((prev) => prev && cameraScanTarget === "primary" ? false : true);
														},
														className: `px-2.5 min-h-[44px] rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 border whitespace-nowrap transition-colors ${isCameraScannerOpen && cameraScanTarget === "primary" ? "bg-emerald-500 text-neutral-950 border-emerald-400" : "bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border-emerald-700/60"}`,
														title: isAr ? "مسح الباركود الأساسي بالكاميرا" : "Scan primary barcode with camera",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "كاميرا" : "Camera" })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														"data-testid": "photo-scan-primary-barcode-btn",
														onClick: () => {
															playTactileClick(settings.soundEnabled);
															setCameraScanTarget("primary");
															barcodePhotoInputRef.current?.click();
														},
														className: "px-2.5 min-h-[44px] rounded-xl bg-neutral-900 hover:bg-neutral-800 text-emerald-300 text-xs font-semibold flex items-center gap-1 shrink-0 border border-neutral-700 whitespace-nowrap",
														title: isAr ? "قراءة الباركود من صورة" : "Read barcode from image",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-3.5 h-3.5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "صورة" : "Photo" })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														"data-testid": "generate-barcode-explicit-btn",
														onClick: () => {
															playTactileClick(settings.soundEnabled);
															const generated = generateBarcode();
															setFormBarcode(generated);
															const nextCodes = normalizeProductBarcodes(generated, formAdditionalBarcodes);
															setFormSku(nextCodes.join(" | "));
														},
														className: "px-2.5 min-h-[44px] rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1 shrink-0 border border-neutral-700 whitespace-nowrap",
														title: isAr ? "توليد باركود أساسي جديد عند الطلب فقط" : "Generate new primary barcode on request",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "توليد" : "Generate" })]
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-3 min-w-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "text-xs font-semibold text-neutral-300 flex items-center justify-between gap-1 mb-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تاريخ الانتهاء" : "Expiry Date" })]
													}), formExpiryDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setFormExpiryDate(""),
														className: "text-[10px] text-rose-400 hover:text-rose-300 font-semibold",
														children: isAr ? "مسح" : "Clear"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "date",
													dir: "ltr",
													"data-testid": "product-expiry-date-input",
													value: formExpiryDate,
													onChange: (e) => setFormExpiryDate(e.target.value),
													className: "w-full min-h-[44px] px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-100 focus:outline-none focus:border-amber-500"
												}),
												modalExpiryStatus.expiryDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `text-[10px] font-bold block mt-1 ${modalExpiryStatus.status === "expired" ? "text-rose-400" : modalExpiryStatus.status === "expiring_soon" ? "text-amber-400" : "text-emerald-400"}`,
													children: modalExpiryStatus.status === "expired" ? isAr ? "تنبيه: هذا المنتج منتهي الصلاحية" : "Alert: Product is expired" : modalExpiryStatus.status === "expiring_soon" ? isAr ? `قريب الانتهاء (متبقي ${modalExpiryStatus.daysRemaining} يوم)` : `Expiring soon (${modalExpiryStatus.daysRemaining}d left)` : isAr ? `صالح (متبقي ${modalExpiryStatus.daysRemaining} يوم)` : `Valid (${modalExpiryStatus.daysRemaining}d left)`
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-neutral-500 block mt-1",
													children: isAr ? "اختياري للأصناف ذات الصلاحية" : "Optional for perishable items"
												})
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 border-t border-neutral-800/80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-semibold text-neutral-300 block mb-1.5",
											children: isAr ? "إضافة باركود إضافي للمنتج (عبوة، كرتون، باركود بديل أو عبر الكاميرا)" : "Add Additional Barcode (Box, Pack, Alternate or Camera Scan)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col sm:flex-row gap-2 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												dir: newBarcodeInput ? "ltr" : isAr ? "rtl" : "ltr",
												value: newBarcodeInput,
												onChange: (e) => setNewBarcodeInput(e.target.value),
												onKeyDown: (e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														handleAddExtraBarcode();
													}
												},
												placeholder: isAr ? "اكتب أو امسح الباركود الإضافي بالكاميرا أو اضغط إضافة..." : "Type/scan extra barcode with camera or click Add Barcode...",
												className: `flex-1 min-w-0 min-h-[42px] px-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 placeholder:font-sans focus:outline-none focus:border-amber-500 ${newBarcodeInput ? "font-mono" : "font-sans"}`
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														"data-testid": "open-camera-barcode-btn",
														onClick: () => {
															playTactileClick(settings.soundEnabled);
															setCameraScanTarget("additional");
															setIsCameraScannerOpen((prev) => prev && cameraScanTarget === "additional" ? false : true);
														},
														className: `px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 border transition-colors ${isCameraScannerOpen && cameraScanTarget === "additional" ? "bg-emerald-500 text-neutral-950 border-emerald-400 shadow-sm" : "bg-emerald-600 hover:bg-emerald-500 text-neutral-950 border-emerald-400/80"}`,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "مسح بالكاميرا" : "Scan Camera" })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: () => handleAddExtraBarcode(),
														className: "px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "إضافة باركود" : "Add Barcode" })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: () => handleAddExtraBarcode(generateBarcode()),
														className: "px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Barcode, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "+ توليد باركود إضافي" : "+ Auto Barcode" })]
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											ref: barcodePhotoInputRef,
											type: "file",
											accept: "image/*",
											capture: "environment",
											onChange: handleBarcodePhotoCapture,
											className: "hidden"
										}),
										isCameraScannerOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											"data-testid": "product-camera-barcode-scanner",
											className: "mt-3 p-3.5 rounded-2xl bg-neutral-900/95 border border-emerald-500/40 space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-center justify-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-4 h-4" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs font-bold text-white block",
															children: isAr ? "ماسح الباركود بالكاميرا (إضافة مباشرة للمنتج)" : "Camera Barcode Scanner (Direct Product Assignment)"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[11px] text-neutral-400",
															children: cameraScanTarget === "primary" ? isAr ? "الوضع الحالي: تعيين كباركود أساسي للمنتج" : "Mode: Set as Primary Product Barcode" : isAr ? "الوضع الحالي: إضافة كباركود إضافي للمنتج" : "Mode: Add as Additional Product Barcode"
														})] })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => setCameraScanTarget("additional"),
																className: `px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${cameraScanTarget === "additional" ? "bg-emerald-500 text-neutral-950 border-emerald-400" : "bg-neutral-950 text-neutral-300 border-neutral-800"}`,
																children: isAr ? "باركود إضافي" : "Additional"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => setCameraScanTarget("primary"),
																className: `px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${cameraScanTarget === "primary" ? "bg-amber-500 text-neutral-950 border-amber-400" : "bg-neutral-950 text-neutral-300 border-neutral-800"}`,
																children: isAr ? "باركود أساسي" : "Primary"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => setIsCameraScannerOpen(false),
																className: "p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300",
																title: isAr ? "إغلاق الكاميرا" : "Close camera",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
															})
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative w-full h-36 bg-neutral-950 rounded-xl border-2 border-dashed border-emerald-500/50 overflow-hidden flex flex-col items-center justify-center",
													children: [
														cameraActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
															ref: cameraVideoRef,
															className: "absolute inset-0 w-full h-full object-cover opacity-75",
															autoPlay: true,
															muted: true,
															playsInline: true
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex flex-col items-center gap-1.5 text-neutral-400 z-10 px-4 text-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-7 h-7 text-emerald-400 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[11px]",
																children: cameraError || (isAr ? "وجه الكاميرا نحو الباركود ليتم قراءته وإضافته تلقائياً" : "Point camera at barcode for automatic detection")
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-8 h-0.5 bg-emerald-400 shadow-[0_0_12px_#10b981] animate-bounce z-20" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-4 border border-emerald-500/30 rounded-lg pointer-events-none" })
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-center justify-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-wrap gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															type: "button",
															"data-testid": "camera-capture-barcode-btn",
															onClick: () => handleApplyCameraScannedBarcode(),
															className: "px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "التقاط وإضافة الباركود بالكاميرا" : "Capture & Add Barcode" })]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															type: "button",
															"data-testid": "camera-photo-barcode-btn",
															onClick: () => barcodePhotoInputRef.current?.click(),
															className: "px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تصوير / اختيار صورة باركود" : "Scan from Camera Photo" })]
														})]
													}), lastScannedBarcodeFeedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														"data-testid": "camera-scanned-feedback",
														className: "text-[11px] font-semibold text-emerald-400 flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lastScannedBarcodeFeedback })]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScannerDiagnosticsPanel, {
													isAr,
													onTestBarcodeDecoded: (code) => {
														handleApplyCameraScannedBarcode(code);
													}
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-1.5 mt-2.5",
											children: allModalBarcodes.map((code, idx) => {
												const isPrimary = idx === 0;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border ${isPrimary ? "bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold" : "bg-neutral-900 border-neutral-700 text-neutral-200"}`,
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Barcode, { className: "w-3 h-3 shrink-0" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: code }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: `text-[10px] px-1.5 py-0.2 rounded ${isPrimary ? "bg-amber-500 text-neutral-950 font-bold" : "bg-neutral-800 text-neutral-400 cursor-pointer hover:text-white"}`,
															onClick: () => !isPrimary && handleSetPrimaryBarcode(code),
															title: isPrimary ? isAr ? "الباركود الأساسي" : "Primary Barcode" : isAr ? "اضغط لجعله الباركود الأساسي" : "Click to set as primary",
															children: isPrimary ? isAr ? "أساسي" : "Primary" : `#${idx + 1}`
														}),
														allModalBarcodes.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: () => handleRemoveBarcode(code),
															className: "text-neutral-400 hover:text-rose-400 p-0.5",
															"aria-label": `Remove barcode ${code}`,
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3 h-3" })
														})
													]
												}, code);
											})
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"data-testid": "product-pricing-packaging-section",
							className: "p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold text-emerald-400 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تحديد سعر الشراء والبيع وتخصيص البيع بالقطعة / الشريط أو الباكو" : "Purchase & Selling Price + Multi-Unit (Strip / Pack) Customization" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center flex-wrap gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-neutral-400 mr-1",
											children: isAr ? "عملة الإدخال:" : "Currency:"
										}), activeCurrencies.map((curr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => handleModalCurrencyChange(curr.code),
											className: `px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${formPriceCurrency === curr.code ? "bg-emerald-500 text-neutral-950 border-emerald-400 shadow-sm" : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700"}`,
											children: curr.code
										}, curr.code))]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-2xl bg-neutral-900/90 border border-amber-500/30 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "w-4 h-4" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-bold text-white block",
													children: isAr ? "نظام البيع بالقطعة / الشريط أو الباكو (مثال: الصبغة الباكو = 8 أشرطة)" : "Multi-Unit Packaging (Sell by Piece/Strip or Full Pack)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-neutral-400",
													children: isAr ? "خصّص اسم الوحدة الصغرى (شريط/قطعة) والعبوة الكبرى (باكو/كرتون) وعدد الوحدات داخل الباكو" : "Customize sub-unit (Strip/Piece), pack name (Pack/Box), and units per pack"
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 shrink-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"data-testid": "disable-packaging-mode-btn",
													onClick: () => {
														playTactileClick(settings.soundEnabled);
														setFormEnablePackaging(false);
													},
													className: `px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${!formEnablePackaging ? "bg-white text-neutral-950 border-white shadow-sm" : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white"}`,
													children: isAr ? "وحدة واحدة (عادي)" : "Single Unit"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													"data-testid": "enable-packaging-mode-btn",
													onClick: () => {
														playTactileClick(settings.soundEnabled);
														setFormEnablePackaging(true);
														const uCount = Math.max(2, Math.floor(parseNormalizedNumber(formUnitsPerPack, 8)));
														setFormUnitsPerPack(String(uCount));
														setFormPackCostPrice(String(roundCurrencyValue(numericCostPrice * uCount, formPriceCurrency)));
														setFormPackSellingPrice(String(roundCurrencyValue(numericSellingPrice * uCount, formPriceCurrency)));
													},
													className: `px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${formEnablePackaging ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-sm" : "bg-neutral-950 text-amber-300 border-amber-500/40 hover:bg-amber-500/10"}`,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تخصيص قطعة / شريط + باكو" : "Strip / Piece + Pack" })]
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center flex-wrap gap-1.5 pt-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-neutral-400 font-medium",
													children: isAr ? "قوالب سريعة:" : "Quick Presets:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"data-testid": "preset-dye-8-strips-btn",
													onClick: () => applyPackagingPreset({
														unitName: "Strip",
														unitNameAr: "شريط",
														packName: "Pack",
														packNameAr: "باكو",
														unitsPerPack: 8
													}),
													className: "px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[11px] font-bold transition-colors",
													children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
														"صبغة: باكو = ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono",
															children: "8"
														}),
														" شريط"
													] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
														"Hair Dye: Pack = ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono",
															children: "8"
														}),
														" Strips"
													] })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => applyPackagingPreset({
														unitName: "Piece",
														unitNameAr: "قطعة",
														packName: "Dozen Pack",
														packNameAr: "باكو (دستة)",
														unitsPerPack: 12
													}),
													className: "px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-[11px] font-semibold transition-colors",
													children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
														"باكو = ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono",
															children: "12"
														}),
														" قطعة"
													] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
														"Pack = ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono",
															children: "12"
														}),
														" Pieces"
													] })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => applyPackagingPreset({
														unitName: "Unit",
														unitNameAr: "حبة",
														packName: "Carton",
														packNameAr: "كرتون",
														unitsPerPack: 24
													}),
													className: "px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-[11px] font-semibold transition-colors",
													children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
														"كرتون = ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono",
															children: "24"
														}),
														" حبة"
													] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
														"Carton = ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono",
															children: "24"
														}),
														" Units"
													] })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => applyPackagingPreset({
														unitName: "Box",
														unitNameAr: "علبة",
														packName: "Pack",
														packNameAr: "باكو",
														unitsPerPack: 6
													}),
													className: "px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-[11px] font-semibold transition-colors",
													children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
														"باكو = ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono",
															children: "6"
														}),
														" علب"
													] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
														"Pack = ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono",
															children: "6"
														}),
														" Boxes"
													] })
												})
											]
										}),
										formEnablePackaging && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											"data-testid": "packaging-customization-fields",
											className: "pt-3 border-t border-neutral-800 space-y-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
														label: isAr ? "اسم الوحدة الصغرى (مثل: شريط / قطعة)" : "Sub-Unit Name (e.g. Strip)",
														value: isAr ? formUnitNameAr : formUnitName,
														onChange: (e) => {
															if (isAr) setFormUnitNameAr(e.target.value);
															else setFormUnitName(e.target.value);
														},
														placeholder: isAr ? "شريط" : "Strip"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
														label: isAr ? "اسم العبوة الكبرى (مثل: باكو / كرتون)" : "Pack Name (e.g. Pack)",
														value: isAr ? formPackNameAr : formPackName,
														onChange: (e) => {
															if (isAr) setFormPackNameAr(e.target.value);
															else setFormPackName(e.target.value);
														},
														placeholder: isAr ? "باكو" : "Pack"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
														label: isAr ? `عدد الـ(${formUnitNameAr || "شريط"}) داخل الـ(${formPackNameAr || "باكو"})` : `Units (${formUnitName || "Strip"}) per ${formPackName || "Pack"}`,
														type: "text",
														inputMode: "numeric",
														dir: "ltr",
														value: formUnitsPerPack,
														onChange: (e) => handleUnitsPerPackChange(e.target.value)
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-neutral-300 block mb-1.5",
													children: isAr ? "طريقة البيع المسموحة في الكاشير" : "Allowed Sale Mode in POS"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "grid grid-cols-3 gap-1.5",
													children: [
														{
															id: "both",
															labelAr: `الـ${formUnitNameAr || "شريط"} والـ${formPackNameAr || "باكو"} معاً`,
															labelEn: "Both Unit & Pack"
														},
														{
															id: "unit_only",
															labelAr: `بالـ${formUnitNameAr || "شريط"} فقط`,
															labelEn: `${formUnitName || "Strip"} Only`
														},
														{
															id: "pack_only",
															labelAr: `بالـ${formPackNameAr || "باكو"} فقط`,
															labelEn: `${formPackName || "Pack"} Only`
														}
													].map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => {
															playTactileClick(settings.soundEnabled);
															setFormAllowedSaleUnits(opt.id);
															if (opt.id === "pack_only") setFormDefaultSaleUnit("pack");
															if (opt.id === "unit_only") setFormDefaultSaleUnit("unit");
														},
														className: `px-2 py-2 rounded-xl text-[11px] font-bold border transition-all ${formAllowedSaleUnits === opt.id ? "bg-emerald-500 text-neutral-950 border-emerald-400" : "bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700"}`,
														children: isAr ? opt.labelAr : opt.labelEn
													}, opt.id))
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs font-semibold text-neutral-300 block mb-1.5",
													children: isAr ? "الوحدة الافتراضية عند النقر السريع في المبيعات" : "Default Quick-Add Unit in POS"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-2 gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														disabled: formAllowedSaleUnits === "pack_only",
														onClick: () => {
															playTactileClick(settings.soundEnabled);
															setFormDefaultSaleUnit("unit");
														},
														className: `px-3 py-2 rounded-xl text-xs font-bold border transition-all ${formDefaultSaleUnit === "unit" ? "bg-amber-500 text-neutral-950 border-amber-400" : "bg-neutral-950 text-neutral-300 border-neutral-800 disabled:opacity-40"}`,
														children: isAr ? `البيع بالـ${formUnitNameAr || "شريط"} (1)` : `By ${formUnitName || "Strip"} (1)`
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														disabled: formAllowedSaleUnits === "unit_only",
														onClick: () => {
															playTactileClick(settings.soundEnabled);
															setFormDefaultSaleUnit("pack");
														},
														className: `px-3 py-2 rounded-xl text-xs font-bold border transition-all ${formDefaultSaleUnit === "pack" ? "bg-amber-500 text-neutral-950 border-amber-400" : "bg-neutral-950 text-neutral-300 border-neutral-800 disabled:opacity-40"}`,
														children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
															"البيع بالـ",
															formPackNameAr || "باكو",
															" (",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-mono",
																children: numericUnitsPerPack
															}),
															" ",
															formUnitNameAr || "شريط",
															")"
														] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
															"By ",
															formPackName || "Pack",
															" (",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-mono",
																children: numericUnitsPerPack
															}),
															")"
														] })
													})]
												})] })]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
											label: t.category,
											value: formCategory,
											onChange: (e) => setFormCategory(e.target.value),
											required: true
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
											label: formEnablePackaging ? isAr ? `سعر شراء الـ${formUnitNameAr || "شريط"} الواحد (${formPriceCurrency})` : `${formUnitName || "Strip"} Cost (${formPriceCurrency})` : isAr ? `سعر الشراء / التكلفة (${formPriceCurrency})` : `${t.costPrice} (${formPriceCurrency})`,
											type: "text",
											inputMode: "decimal",
											dir: "ltr",
											value: formCostPrice,
											onChange: (e) => handleUnitCostChange(e.target.value),
											required: true
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
											label: formEnablePackaging ? isAr ? `سعر بيع الـ${formUnitNameAr || "شريط"} الواحد (${formPriceCurrency})` : `${formUnitName || "Strip"} Selling Price (${formPriceCurrency})` : isAr ? `سعر البيع (${formPriceCurrency})` : `${t.sellingPrice} (${formPriceCurrency})`,
											type: "text",
											inputMode: "decimal",
											dir: "ltr",
											value: formSellingPrice,
											onChange: (e) => handleUnitSellingChange(e.target.value),
											required: true
										})
									]
								}),
								formEnablePackaging && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-amber-300",
											children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
												"تسعير الـ",
												formPackNameAr || "باكو",
												" الكامل (يحتوي على",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono",
													children: numericUnitsPerPack
												}),
												" ",
												formUnitNameAr || "شريط",
												")"
											] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
												"Full ",
												formPackName || "Pack",
												" Pricing (Contains",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono",
													children: numericUnitsPerPack
												}),
												" ",
												formUnitName || "Strips",
												")"
											] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												playTactileClick(settings.soundEnabled);
												setFormPackCostPrice(String(roundCurrencyValue(numericCostPrice * numericUnitsPerPack, formPriceCurrency)));
												setFormPackSellingPrice(String(roundCurrencyValue(numericSellingPrice * numericUnitsPerPack, formPriceCurrency)));
											},
											className: "px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-[11px] text-amber-300 font-semibold",
											children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
												"حساب تلقائي (سعر الـ",
												formUnitNameAr || "شريط",
												" ×",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono",
													children: numericUnitsPerPack
												}),
												")"
											] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
												"Auto-Calc (Unit × ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono",
													children: numericUnitsPerPack
												}),
												")"
											] })
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
											label: isAr ? `سعر شراء الـ${formPackNameAr || "باكو"} الكامل (${formPriceCurrency})` : `Full ${formPackName || "Pack"} Cost (${formPriceCurrency})`,
											type: "text",
											inputMode: "decimal",
											dir: "ltr",
											value: formPackCostPrice,
											onChange: (e) => handlePackCostChange(e.target.value)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
											label: isAr ? `سعر بيع الـ${formPackNameAr || "باكو"} الكامل (${formPriceCurrency})` : `Full ${formPackName || "Pack"} Selling Price (${formPriceCurrency})`,
											type: "text",
											inputMode: "decimal",
											dir: "ltr",
											value: formPackSellingPrice,
											onChange: (e) => handlePackSellingChange(e.target.value)
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center flex-wrap gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: `w-4 h-4 ${unitProfit >= 0 ? "text-emerald-400" : "text-rose-400"}` }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-neutral-300 font-medium",
													children: formEnablePackaging ? isAr ? `ربح الـ${formUnitNameAr || "شريط"}:` : `${formUnitName || "Strip"} Profit:` : isAr ? "صافي الربح للوحدة:" : "Unit Profit:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `font-mono font-bold tabular-nums ${unitProfit >= 0 ? "text-emerald-400" : "text-rose-400"}`,
													children: formatCurrency(unitProfit, formPriceCurrency, settings.language)
												})
											]
										}), formEnablePackaging && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 pl-2 border-l border-neutral-800",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-amber-300 font-medium",
												children: isAr ? `ربح الـ${formPackNameAr || "باكو"}:` : `${formPackName || "Pack"} Profit:`
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `font-mono font-bold tabular-nums ${packProfit >= 0 ? "text-amber-400" : "text-rose-400"}`,
												children: formatCurrency(packProfit, formPriceCurrency, settings.language)
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-neutral-400",
											children: isAr ? "نسبة هامش الربح: " : "Profit Margin: "
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `font-mono font-bold tabular-nums ${profitMarginPercent >= 0 ? "text-amber-400" : "text-rose-400"}`,
											children: [profitMarginPercent, "%"]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold text-neutral-400 block mb-1.5",
									children: isAr ? "الأسعار المعادلة تلقائياً بجميع العملات المفعلة (اضغط على أي عملة للتحويل إليها):" : "Automatic Equivalent Prices Across Active Currencies (Click any currency to switch):"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
									children: activeCurrencies.map((curr) => {
										const eqCost = convertCurrencyAmount(numericCostPrice, formPriceCurrency, curr.code, exchangeRates);
										const eqSell = convertCurrencyAmount(numericSellingPrice, formPriceCurrency, curr.code, exchangeRates);
										const eqPackSell = convertCurrencyAmount(numericPackSellingPrice, formPriceCurrency, curr.code, exchangeRates);
										const isCurrent = curr.code === formPriceCurrency;
										const rateToSdg = curr.code === "SDG" ? 1 : exchangeRates[curr.code] || 1;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => handleModalCurrencyChange(curr.code),
											className: `p-2.5 rounded-xl border text-left transition-all ${isCurrent ? "bg-emerald-950/40 border-emerald-500/60" : "bg-neutral-900/70 border-neutral-800 hover:border-neutral-700"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-[11px] font-mono mb-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-bold text-white flex items-center gap-1",
														children: [curr.code, isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3 h-3 text-emerald-400" })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-neutral-400 text-[10px]",
														children: curr.code === "SDG" ? "Base" : `1=${rateToSdg} SDG`
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[11px] text-neutral-400 flex justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "شراء:" : "Cost:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-neutral-200 font-mono font-semibold tabular-nums",
														children: formatCurrency(eqCost, curr.code, settings.language)
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[11px] text-neutral-400 flex justify-between mt-0.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formEnablePackaging ? isAr ? `بيع الـ${formUnitNameAr || "شريط"}:` : `${formUnitName || "Strip"}:` : isAr ? "بيع:" : "Sell:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-emerald-400 font-mono font-bold tabular-nums",
														children: formatCurrency(eqSell, curr.code, settings.language)
													})]
												}),
												formEnablePackaging && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[11px] text-amber-300/90 flex justify-between mt-0.5 pt-0.5 border-t border-neutral-800/70",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? `بيع الـ${formPackNameAr || "باكو"}:` : `${formPackName || "Pack"}:` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-amber-400 font-mono font-bold tabular-nums",
														children: formatCurrency(eqPackSell, curr.code, settings.language)
													})]
												})
											]
										}, curr.code);
									})
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-between",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold text-amber-400 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "صورة المنتج والمخزون" : "Product Image & Inventory Stock" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row items-start sm:items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center overflow-hidden shrink-0 relative",
										children: formImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: formImage,
											alt: "Product preview",
											className: "w-full h-full object-cover"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setFormImage(""),
											className: "absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow",
											title: isAr ? "حذف الصورة" : "Remove image",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3 h-3" })
										})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-3xl",
											children: formEmoji || "📦"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 w-full space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													ref: fileInputRef,
													type: "file",
													accept: "image/*",
													onChange: handleImageFileUpload,
													className: "hidden"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => fileInputRef.current?.click(),
													className: "px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "رفع صورة من الجهاز" : "Upload Product Image" })]
												}),
												formImage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => setFormImage(""),
													className: "px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-800/60 text-xs font-semibold text-rose-300 flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "إزالة الصورة" : "Remove Image" })]
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											dir: "ltr",
											value: formImage,
											onChange: (e) => setFormImage(e.target.value),
											placeholder: isAr ? "أو الصق رابط صورة المنتج مباشر (https://...)" : "Or paste direct product image URL (https://...)",
											className: "w-full min-h-[38px] px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-500"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-800/80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
											label: formEnablePackaging ? isAr ? `إجمالي المخزون بالـ(${formUnitNameAr || "شريط"})` : `Total Stock in (${formUnitName || "Strip"})` : t.stockQty,
											type: "text",
											inputMode: "numeric",
											dir: "ltr",
											value: formStock,
											onChange: (e) => setFormStock(normalizeNumberInput(e.target.value)),
											required: true
										}), formEnablePackaging && numericUnitsPerPack > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1.5 flex items-center justify-between flex-wrap gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-amber-300 font-semibold",
												children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													"يعادل:",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono",
														children: Math.floor(parseNormalizedNumber(formStock, 0) / numericUnitsPerPack)
													}),
													" ",
													formPackNameAr || "باكو",
													parseNormalizedNumber(formStock, 0) % numericUnitsPerPack > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
														" ",
														"و",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono",
															children: parseNormalizedNumber(formStock, 0) % numericUnitsPerPack
														}),
														" ",
														formUnitNameAr || "شريط"
													] })
												] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													"Equals:",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono",
														children: Math.floor(parseNormalizedNumber(formStock, 0) / numericUnitsPerPack)
													}),
													" ",
													formPackName || "Pack",
													"(s)"
												] })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => {
														playTactileClick(settings.soundEnabled);
														const curr = Math.max(0, Math.floor(parseNormalizedNumber(formStock, 0)));
														setFormStock(String(curr + numericUnitsPerPack));
													},
													className: "px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[10px] font-bold",
													children: [
														"+",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono",
															children: "1"
														}),
														" ",
														isAr ? formPackNameAr || "باكو" : formPackName || "Pack"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => {
														playTactileClick(settings.soundEnabled);
														const curr = Math.max(0, Math.floor(parseNormalizedNumber(formStock, 0)));
														setFormStock(String(curr + numericUnitsPerPack * 5));
													},
													className: "px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 text-[10px] font-bold",
													children: [
														"+",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono",
															children: "5"
														}),
														" ",
														isAr ? formPackNameAr || "باكو" : formPackName || "Pack"
													]
												})]
											})]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppInput, {
											label: t.minStockAlert,
											type: "text",
											inputMode: "numeric",
											dir: "ltr",
											value: formMinStockAlert,
											onChange: (e) => setFormMinStockAlert(normalizeNumberInput(e.target.value)),
											required: true
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-semibold text-neutral-300 block mb-1.5",
											children: isAr ? "أيقونة بديلة (Emoji)" : "Fallback Icon Emoji"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: formEmoji,
											onChange: (e) => setFormEmoji(e.target.value),
											maxLength: 4,
											className: "w-full min-h-[46px] px-3 text-center text-xl rounded-xl bg-neutral-900 border border-neutral-800"
										})] })
									]
								})
							]
						}),
						editingProduct && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"data-testid": "product-audit-history-section",
							className: "p-3.5 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-4 h-4 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-white",
											children: isAr ? "تاريخ الإضافة وسجل الأسعار القديمة والتعديلات على المنتج" : "Creation Date, Old Price History & Product Modification Log"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center flex-wrap gap-2 text-[11px] text-neutral-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800 font-mono",
											children: [isAr ? "تاريخ الإضافة: " : "Added: ", new Date(editingProduct.createdAt || editingProduct.customFields?.createdAt || editingProduct.updatedAt).toLocaleString(isAr ? "ar-SA" : "en-US", {
												year: "numeric",
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800 font-mono",
											children: [isAr ? "آخر تعديل: " : "Updated: ", new Date(editingProduct.updatedAt).toLocaleString(isAr ? "ar-SA" : "en-US", {
												year: "numeric",
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit"
											})]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold text-amber-300 block",
										children: isAr ? "سجل تغييرات السعر (السعر القديم ← السعر الجديد):" : "Price Change History (Old Price → New Price):"
									}), (editingProduct.priceHistory || editingProduct.customFields?.priceHistory || []).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-1.5 max-h-36 overflow-y-auto pr-1",
										children: (editingProduct.priceHistory || editingProduct.customFields?.priceHistory || []).map((ph) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2 rounded-xl bg-neutral-900/80 border border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center flex-wrap gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-neutral-400",
														children: [
															isAr ? "البيع:" : "Sell:",
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "line-through text-rose-400 font-mono",
																children: ph.previousSellingPrice
															}),
															" ",
															"→",
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-emerald-400 font-bold font-mono",
																children: [
																	ph.newSellingPrice,
																	" ",
																	ph.currency
																]
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-neutral-600",
														children: "·"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-neutral-400",
														children: [
															isAr ? "التكلفة:" : "Cost:",
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "font-mono text-neutral-300",
																children: [
																	ph.previousCostPrice,
																	" → ",
																	ph.newCostPrice,
																	" ",
																	ph.currency
																]
															})
														]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 text-[10px] text-neutral-400",
												children: [ph.changedBy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1 text-sky-300",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ph.changedBy })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono",
													children: new Date(ph.timestamp).toLocaleString(isAr ? "ar-SA" : "en-US", {
														month: "short",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit"
													})
												})]
											})]
										}, ph.id))
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-neutral-500",
										children: isAr ? "لم يتم تغيير سعر هذا المنتج منذ إضافته." : "No price changes recorded since product creation."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 pt-2 border-t border-neutral-800/70",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold text-sky-300 block",
										children: isAr ? "سجل التعديلات التي تمت على المنتج:" : "Product Modification Audit Trail:"
									}), (editingProduct.modificationHistory || editingProduct.customFields?.modificationHistory || []).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-1.5 max-h-40 overflow-y-auto pr-1",
										children: (editingProduct.modificationHistory || editingProduct.customFields?.modificationHistory || []).map((mod) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-neutral-200 font-medium",
												children: isAr ? mod.summaryAr || mod.summaryEn : mod.summaryEn || mod.summaryAr
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 text-[10px] text-neutral-400 shrink-0",
												children: [mod.changedBy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-amber-300 font-semibold",
													children: mod.changedBy
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono",
													children: new Date(mod.timestamp).toLocaleString(isAr ? "ar-SA" : "en-US", {
														month: "short",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit"
													})
												})]
											})]
										}, mod.id))
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-neutral-500",
										children: isAr ? "لا توجد تعديلات مسجلة بعد." : "No modifications recorded yet."
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-800",
							children: [editingProduct ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldToConfirm, {
								onConfirm: () => handleDelete(editingProduct.id),
								label: t.deleteProduct,
								confirmingLabel: "Deleting product...",
								variant: "danger",
								className: "w-full sm:w-auto"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 w-full sm:w-auto justify-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
									variant: "ghost",
									type: "button",
									onClick: () => setIsModalOpen(false),
									children: t.cancel
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
									variant: "amber",
									type: "submit",
									children: t.saveProduct
								})]
							})]
						})
					]
				})
			})
		]
	});
};
export { ProductsView };
