import { a as __toESM } from "./rolldown-runtime-DQp2zzRu.js";
import { Cn as require_react, Ht as CirclePlus, K as Package, L as Receipt, Sn as Activity, _ as TrendingUp, ct as Layers, fn as Award, g as TriangleAlert, kt as DollarSign, mn as ArrowRight, o as Wallet, rn as Calendar } from "./vendor-icons-CI9orWhJ.js";
import { Bt as getConvertedTransactionView, Ft as formatCurrency, jt as computeDailyRevenueTrends, n as usePOS, s as computeExpensesSummary } from "./POSContext-BOgzURdy.js";
import { i as require_jsx_runtime } from "./vendor-motion-D4PRzaI1.js";
import { D as getTranslation, E as TactileButton, t as ReceiptModal } from "./index-QdWo-Hfe.js";
import { t as AppCard } from "./AppCard-Bz1niKzT.js";
import { $ as selectChartLayout, A as LabelListFromLabelProp, At as clsx, B as selectAxisWithScale, C as matchAnimationItems, Ct as noop, D as Shape, Dt as svgPropertiesAndEventsFromUnknown, E as SetTooltipEntrySettings, Et as svgPropertiesAndEvents, F as arrayTooltipSearcher, G as selectYAxisSettings, H as selectTicksOfGraphicalItem, I as ZIndexLayer, J as selectChartBaseValue, K as getStackSeriesIdentifier, L as useChartName, M as CartesianLabelFromLabelProp, O as isClipDot, Ot as svgPropertiesNoEvents, P as Tooltip, Q as propsAreEqual, R as selectActiveTooltipIndex, S as useAnimationStartSnapshot, St as isNumber, T as SetLegendPayload, Tt as Layer, U as selectUnfilteredCartesianItems, V as selectStackGroups, W as selectXAxisSettings, X as selectChartDataWithIndexesIfNotInPanoramaPosition4, Y as selectChartDataWithIndexesIfNotInPanoramaPosition3, Z as Curve, _ as SetCartesianGraphicalItem, _t as interpolate, a as selectXAxisIdFromGraphicalItemId, at as getBandSizeOfAxis, b as AnimatedItems, bt as isNullish, c as useNeedsClip, ct as getTooltipNameProp, d as useClipPathId, dt as isWellBehavedNumber, et as useCartesianChartLayout, f as addLine, ft as createSelector, g as usePlotArea, gt as adaptEventHandlers, h as useActiveTooltipDataPoints, ht as resolveDefaultProps, i as Bar, it as useIsPanorama, j as CartesianLabelContextProvider, k as CartesianLabelListContextProvider, kt as svgPropertiesNoEventsFromUnknown, l as SetErrorBarContext, lt as getValueByDataKey, m as rectWithCoords, mt as useAppSelector, n as YAxis, nt as useViewBox, o as selectYAxisIdFromGraphicalItemId, ot as getCateCoordinateOfLine, p as removeLine, pt as useAppDispatch, q as DefaultZIndexes, r as XAxis, rt as ResponsiveContainer, s as GraphicalItemClipPath, st as getNormalizedStackId, t as CartesianChart, tt as useChartLayout, u as CartesianGrid, ut as isCategoricalAxis, v as RegisterGraphicalItemId, vt as isNan, w as matchByIndex, wt as round, x as useAnimationCallbacks, xt as isNumOrStr, y as useId, yt as isNotNil, z as selectAxisScale } from "./CartesianChart-CoKLjEzo.js";
// node_modules/recharts/es6/shape/Dot.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function _extends$6() {
	return _extends$6 = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends$6.apply(null, arguments);
}
/**
* Renders a dot in the chart.
*
* This component accepts X and Y coordinates in pixels.
* If you need to position the rectangle based on your chart's data,
* consider using the {@link ReferenceDot} component instead.
*
* @param props
* @constructor
*/
var Dot = (props) => {
	var cx = props.cx, cy = props.cy, r = props.r, className = props.className;
	var layerClass = clsx("recharts-dot", className);
	if (isNumber(cx) && isNumber(cy) && isNumber(r)) return /*#__PURE__*/ import_react.createElement("circle", _extends$6({}, svgPropertiesNoEvents(props), adaptEventHandlers(props), {
		className: layerClass,
		cx,
		cy,
		r
	}));
	return null;
};
// node_modules/recharts/es6/component/Dots.js
var _excluded$4 = ["points"];
function ownKeys$4(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$4(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$4(Object(t), !0).forEach(function(r) {
			_defineProperty$4(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$4(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$4(e, r, t) {
	return (r = _toPropertyKey$4(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function _toPropertyKey$4(t) {
	var i = _toPrimitive$4(t, "string");
	return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$4(t, r) {
	if ("object" != typeof t || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != typeof i) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _extends$5() {
	return _extends$5 = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends$5.apply(null, arguments);
}
function _objectWithoutProperties$4(e, t) {
	if (null == e) return {};
	var o, r, i = _objectWithoutPropertiesLoose$4(e, t);
	if (Object.getOwnPropertySymbols) {
		var n = Object.getOwnPropertySymbols(e);
		for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
	}
	return i;
}
function _objectWithoutPropertiesLoose$4(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (-1 !== e.indexOf(n)) continue;
		t[n] = r[n];
	}
	return t;
}
function DotItem(_ref) {
	var option = _ref.option, dotProps = _ref.dotProps, className = _ref.className;
	if (/*#__PURE__*/ (0, import_react.isValidElement)(option)) return /*#__PURE__*/ (0, import_react.cloneElement)(option, dotProps);
	if (typeof option === "function") return option(dotProps);
	var finalClassName = clsx(className, typeof option !== "boolean" ? option.className : ""), _ref2 = dotProps !== null && dotProps !== void 0 ? dotProps : {};
	_ref2.points;
	var props = _objectWithoutProperties$4(_ref2, _excluded$4);
	return /*#__PURE__*/ import_react.createElement(Dot, _extends$5({}, props, { className: finalClassName }));
}
function shouldRenderDots(points, dot) {
	if (points == null) return false;
	if (dot) return true;
	return points.length === 1;
}
function Dots(_ref3) {
	var points = _ref3.points, dot = _ref3.dot, className = _ref3.className, dotClassName = _ref3.dotClassName, dataKey = _ref3.dataKey, baseProps = _ref3.baseProps, needClip = _ref3.needClip, clipPathId = _ref3.clipPathId, _ref3$zIndex = _ref3.zIndex, zIndex = _ref3$zIndex === void 0 ? DefaultZIndexes.scatter : _ref3$zIndex;
	if (!shouldRenderDots(points, dot)) return null;
	var clipDot = isClipDot(dot);
	var customDotProps = svgPropertiesAndEventsFromUnknown(dot);
	var dots = points.map((entry, i) => {
		var _entry$x, _entry$y;
		var dotProps = _objectSpread$4(_objectSpread$4(_objectSpread$4({ r: 3 }, baseProps), customDotProps), {}, {
			index: i,
			cx: (_entry$x = entry.x) !== null && _entry$x !== void 0 ? _entry$x : void 0,
			cy: (_entry$y = entry.y) !== null && _entry$y !== void 0 ? _entry$y : void 0,
			dataKey,
			value: entry.value,
			payload: entry.payload,
			points
		});
		return /*#__PURE__*/ import_react.createElement(DotItem, {
			key: "dot-".concat(i),
			option: dot,
			dotProps,
			className: dotClassName
		});
	});
	var layerProps = {};
	if (needClip && clipPathId != null) layerProps.clipPath = "url(#clipPath-".concat(clipDot ? "" : "dots-").concat(clipPathId, ")");
	return /*#__PURE__*/ import_react.createElement(ZIndexLayer, { zIndex }, /*#__PURE__*/ import_react.createElement(Layer, _extends$5({ className }, layerProps), dots));
}
// node_modules/recharts/es6/component/ActivePoints.js
function ownKeys$3(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$3(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$3(Object(t), !0).forEach(function(r) {
			_defineProperty$3(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$3(e, r, t) {
	return (r = _toPropertyKey$3(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function _toPropertyKey$3(t) {
	var i = _toPrimitive$3(t, "string");
	return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$3(t, r) {
	if ("object" != typeof t || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != typeof i) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var ActivePoint = (_ref) => {
	var point = _ref.point, childIndex = _ref.childIndex, mainColor = _ref.mainColor, activeDot = _ref.activeDot, dataKey = _ref.dataKey, clipPath = _ref.clipPath;
	if (activeDot === false || point.x == null || point.y == null) return null;
	var dotProps = _objectSpread$3(_objectSpread$3(_objectSpread$3({}, {
		index: childIndex,
		dataKey,
		cx: point.x,
		cy: point.y,
		r: 4,
		fill: mainColor !== null && mainColor !== void 0 ? mainColor : "none",
		strokeWidth: 2,
		stroke: "#fff",
		payload: point.payload,
		value: point.value
	}), svgPropertiesNoEventsFromUnknown(activeDot)), adaptEventHandlers(activeDot));
	var dot;
	if (/*#__PURE__*/ (0, import_react.isValidElement)(activeDot)) dot = /*#__PURE__*/ (0, import_react.cloneElement)(activeDot, dotProps);
	else if (typeof activeDot === "function") dot = activeDot(dotProps);
	else dot = /*#__PURE__*/ import_react.createElement(Dot, dotProps);
	return /*#__PURE__*/ import_react.createElement(Layer, {
		className: "recharts-active-dot",
		clipPath
	}, dot);
};
function ActivePoints(_ref2) {
	var points = _ref2.points, mainColor = _ref2.mainColor, activeDot = _ref2.activeDot, itemDataKey = _ref2.itemDataKey, clipPath = _ref2.clipPath, _ref2$zIndex = _ref2.zIndex, zIndex = _ref2$zIndex === void 0 ? DefaultZIndexes.activeDot : _ref2$zIndex;
	var activeTooltipIndex = useAppSelector(selectActiveTooltipIndex);
	var activeDataPoints = useActiveTooltipDataPoints();
	if (points == null || activeDataPoints == null) return null;
	var activePoint = points.find((p) => activeDataPoints.includes(p.payload));
	if (isNullish(activePoint)) return null;
	return /*#__PURE__*/ import_react.createElement(ZIndexLayer, { zIndex }, /*#__PURE__*/ import_react.createElement(ActivePoint, {
		point: activePoint,
		childIndex: Number(activeTooltipIndex),
		mainColor,
		dataKey: itemDataKey,
		activeDot,
		clipPath
	}));
}
// node_modules/recharts/es6/util/scale/CartesianScaleHelper.js
/**
* Groups X and Y scale functions together and provides helper methods.
*/
var CartesianScaleHelperImpl = class {
	constructor(_ref) {
		var x = _ref.x, y = _ref.y;
		this.xAxisScale = x;
		this.yAxisScale = y;
	}
	map(value, _ref2) {
		var _this$xAxisScale$map, _this$yAxisScale$map;
		var position = _ref2.position;
		return {
			x: (_this$xAxisScale$map = this.xAxisScale.map(value.x, { position })) !== null && _this$xAxisScale$map !== void 0 ? _this$xAxisScale$map : 0,
			y: (_this$yAxisScale$map = this.yAxisScale.map(value.y, { position })) !== null && _this$yAxisScale$map !== void 0 ? _this$yAxisScale$map : 0
		};
	}
	mapWithFallback(value, _ref3) {
		var _this$xAxisScale$map2, _this$yAxisScale$map2;
		var position = _ref3.position, fallback = _ref3.fallback;
		var fallbackY, fallbackX;
		if (fallback === "rangeMin") fallbackY = this.yAxisScale.rangeMin();
		else if (fallback === "rangeMax") fallbackY = this.yAxisScale.rangeMax();
		else fallbackY = 0;
		if (fallback === "rangeMin") fallbackX = this.xAxisScale.rangeMin();
		else if (fallback === "rangeMax") fallbackX = this.xAxisScale.rangeMax();
		else fallbackX = 0;
		return {
			x: (_this$xAxisScale$map2 = this.xAxisScale.map(value.x, { position })) !== null && _this$xAxisScale$map2 !== void 0 ? _this$xAxisScale$map2 : fallbackX,
			y: (_this$yAxisScale$map2 = this.yAxisScale.map(value.y, { position })) !== null && _this$yAxisScale$map2 !== void 0 ? _this$yAxisScale$map2 : fallbackY
		};
	}
	isInRange(_ref4) {
		var x = _ref4.x, y = _ref4.y;
		var xInRange = x == null || this.xAxisScale.isInRange(x);
		var yInRange = y == null || this.yAxisScale.isInRange(y);
		return xInRange && yInRange;
	}
};
// node_modules/recharts/es6/cartesian/ReferenceLine.js
/**
* @fileOverview Reference Line
*/
function ownKeys$2(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$2(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$2(Object(t), !0).forEach(function(r) {
			_defineProperty$2(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$2(e, r, t) {
	return (r = _toPropertyKey$2(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function _toPropertyKey$2(t) {
	var i = _toPrimitive$2(t, "string");
	return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$2(t, r) {
	if ("object" != typeof t || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != typeof i) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _extends$4() {
	return _extends$4 = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends$4.apply(null, arguments);
}
/**
* Single point that defines one end of a segment.
* These coordinates are in data space, meaning that you should provide
* values that correspond to the data domain of the axes.
* So you would provide a value of `Page A` to indicate the data value `Page A`
* and then recharts will convert that to pixels.
*
* Likewise for numbers. If your x-axis goes from 0 to 100,
* and you want the line to end at 50, you would provide `50` here.
*
* @inline
*/
/**
* This excludes `viewBox` prop from svg for two reasons:
* 1. The components wants viewBox of object type, and svg wants string
*    - so there's a conflict, and the component will throw if it gets string
* 2. Internally the component calls `svgPropertiesNoEvents` which filters the viewBox away anyway
*/
var renderLine = (option, props) => {
	var line;
	if (/*#__PURE__*/ import_react.isValidElement(option)) line = /*#__PURE__*/ import_react.cloneElement(option, props);
	else if (typeof option === "function") line = option(props);
	else {
		if (!isWellBehavedNumber(props.x1) || !isWellBehavedNumber(props.y1) || !isWellBehavedNumber(props.x2) || !isWellBehavedNumber(props.y2)) return null;
		line = /*#__PURE__*/ import_react.createElement("line", _extends$4({}, props, { className: "recharts-reference-line-line" }));
	}
	return line;
};
var getHorizontalLineEndPoints = (yCoord, ifOverflow, position, yAxisOrientation, yAxisScale, viewBox) => {
	var x = viewBox.x, width = viewBox.width;
	var coord = yAxisScale.map(yCoord, { position });
	if (!isWellBehavedNumber(coord)) return null;
	if (ifOverflow === "discard" && !yAxisScale.isInRange(coord)) return null;
	var points = [{
		x: x + width,
		y: coord
	}, {
		x,
		y: coord
	}];
	return yAxisOrientation === "left" ? points.reverse() : points;
};
var getVerticalLineEndPoints = (xCoord, ifOverflow, position, xAxisOrientation, xAxisScale, viewBox) => {
	var y = viewBox.y, height = viewBox.height;
	var coord = xAxisScale.map(xCoord, { position });
	if (!isWellBehavedNumber(coord)) return null;
	if (ifOverflow === "discard" && !xAxisScale.isInRange(coord)) return null;
	var points = [{
		x: coord,
		y: y + height
	}, {
		x: coord,
		y
	}];
	return xAxisOrientation === "top" ? points.reverse() : points;
};
var getSegmentLineEndPoints = (segment, ifOverflow, position, scales) => {
	var points = [scales.mapWithFallback(segment[0], {
		position,
		fallback: "rangeMin"
	}), scales.mapWithFallback(segment[1], {
		position,
		fallback: "rangeMax"
	})];
	if (ifOverflow === "discard" && points.some((p) => !scales.isInRange(p))) return null;
	return points;
};
var getEndPoints = (xAxisScale, yAxisScale, viewBox, position, xAxisOrientation, yAxisOrientation, props) => {
	var xCoord = props.x, yCoord = props.y, segment = props.segment, ifOverflow = props.ifOverflow;
	var isFixedX = isNumOrStr(xCoord);
	if (isNumOrStr(yCoord)) return getHorizontalLineEndPoints(yCoord, ifOverflow, position, yAxisOrientation, yAxisScale, viewBox);
	if (isFixedX) return getVerticalLineEndPoints(xCoord, ifOverflow, position, xAxisOrientation, xAxisScale, viewBox);
	if (segment != null && segment.length === 2) return getSegmentLineEndPoints(segment, ifOverflow, position, new CartesianScaleHelperImpl({
		x: xAxisScale,
		y: yAxisScale
	}));
	return null;
};
function ReportReferenceLine(props) {
	var dispatch = useAppDispatch();
	(0, import_react.useEffect)(() => {
		dispatch(addLine(props));
		return () => {
			dispatch(removeLine(props));
		};
	});
	return null;
}
function ReferenceLineImpl(props) {
	var xAxisId = props.xAxisId, yAxisId = props.yAxisId, shape = props.shape, className = props.className, ifOverflow = props.ifOverflow;
	var isPanorama = useIsPanorama();
	var clipPathId = useClipPathId();
	var xAxis = useAppSelector((state) => selectXAxisSettings(state, xAxisId));
	var yAxis = useAppSelector((state) => selectYAxisSettings(state, yAxisId));
	var xAxisScale = useAppSelector((state) => selectAxisScale(state, "xAxis", xAxisId, isPanorama));
	var yAxisScale = useAppSelector((state) => selectAxisScale(state, "yAxis", yAxisId, isPanorama));
	var viewBox = useViewBox();
	if (!clipPathId || !viewBox || xAxis == null || yAxis == null || xAxisScale == null || yAxisScale == null) return null;
	var endPoints = getEndPoints(xAxisScale, yAxisScale, viewBox, props.position, xAxis.orientation, yAxis.orientation, props);
	if (!endPoints) return null;
	var point1 = endPoints[0];
	var point2 = endPoints[1];
	if (point1 == null || point2 == null) return null;
	var x1 = point1.x, y1 = point1.y;
	var x2 = point2.x, y2 = point2.y;
	var lineProps = _objectSpread$2(_objectSpread$2({ clipPath: ifOverflow === "hidden" ? "url(#".concat(clipPathId, ")") : void 0 }, svgPropertiesAndEvents(props)), {}, {
		x1,
		y1,
		x2,
		y2
	});
	var rect = rectWithCoords({
		x1,
		y1,
		x2,
		y2
	});
	return /*#__PURE__*/ import_react.createElement(ZIndexLayer, { zIndex: props.zIndex }, /*#__PURE__*/ import_react.createElement(Layer, { className: clsx("recharts-reference-line", className) }, renderLine(shape, lineProps), /*#__PURE__*/ import_react.createElement(CartesianLabelContextProvider, _extends$4({}, rect, {
		lowerWidth: rect.width,
		upperWidth: rect.width
	}), /*#__PURE__*/ import_react.createElement(CartesianLabelFromLabelProp, { label: props.label }), props.children)));
}
var referenceLineDefaultProps = {
	ifOverflow: "discard",
	xAxisId: 0,
	yAxisId: 0,
	fill: "none",
	label: false,
	stroke: "#ccc",
	fillOpacity: 1,
	strokeWidth: 1,
	position: "middle",
	zIndex: DefaultZIndexes.line
};
/**
* Draws a line on the chart connecting two points.
*
* This component, unlike {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/line line}, is aware of the cartesian coordinate system,
* so you specify the dimensions by using data coordinates instead of pixels.
*
* ReferenceLine will calculate the pixels based on the provided data coordinates.
*
* If you prefer to render using pixels rather than data coordinates,
* consider using the {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/line line SVG element} instead.
*
* @provides CartesianLabelContext
* @consumes CartesianChartContext
*/
function ReferenceLine(outsideProps) {
	var props = resolveDefaultProps(outsideProps, referenceLineDefaultProps);
	return /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, /*#__PURE__*/ import_react.createElement(ReportReferenceLine, {
		yAxisId: props.yAxisId,
		xAxisId: props.xAxisId,
		ifOverflow: props.ifOverflow,
		x: props.x,
		y: props.y,
		segment: props.segment
	}), /*#__PURE__*/ import_react.createElement(ReferenceLineImpl, props));
}
ReferenceLine.displayName = "ReferenceLine";
// node_modules/recharts/es6/cartesian/LineDrawShape.js
var _excluded$3 = [
	"animationElapsedTime",
	"isAnimating",
	"isEntrance",
	"visibleLength",
	"strokeDasharray",
	"connectNulls"
];
function _extends$3() {
	return _extends$3 = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends$3.apply(null, arguments);
}
function _objectWithoutProperties$3(e, t) {
	if (null == e) return {};
	var o, r, i = _objectWithoutPropertiesLoose$3(e, t);
	if (Object.getOwnPropertySymbols) {
		var n = Object.getOwnPropertySymbols(e);
		for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
	}
	return i;
}
function _objectWithoutPropertiesLoose$3(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (-1 !== e.indexOf(n)) continue;
		t[n] = r[n];
	}
	return t;
}
/**
* Reads the total length of an SVG path element, returning 0 if the element
* is null or the measurement fails (e.g. in JSDOM).
*/
function getTotalLength$1(path) {
	try {
		return path && path.getTotalLength && path.getTotalLength() || 0;
	} catch (_unused) {
		return 0;
	}
}
/**
* Generates a simple stroke-dasharray string for animating a line draw effect.
*
* Uses `totalLength` as the gap (instead of `totalLength - length`) to prevent a floating-point
* precision artifact: when fractional dash and gap values are serialized to a string attribute
* and reparsed by the SVG renderer, their sum can differ from the actual path length by a ULP,
* causing the dasharray pattern to repeat and render a phantom dot at the path endpoint
* with round or square strokeLinecap.
*
* @param totalLength The total length of the SVG path
* @param length The currently visible portion of the path
* @returns A stroke-dasharray string like "50px 200px"
*/
function generateSimpleStrokeDasharray(totalLength, length) {
	return "".concat(length, "px ").concat(totalLength, "px");
}
/**
* Normalizes a dash pattern to the even-length sequence used by SVG renderers.
* Odd-length stroke-dasharray values repeat once, so "5" behaves like "5 5".
*
* @param lines Array of dash/gap lengths to repeat
* @returns An even-length dash pattern
*/
function normalizeDashPattern(lines) {
	return lines.length % 2 !== 0 ? [...lines, ...lines] : lines;
}
/**
* Repeats a dash pattern array a given number of times.
*
* @param lines Array of dash/gap lengths to repeat
* @param count Number of times to repeat the pattern
* @returns A new array with the pattern repeated `count` times
*/
function repeat(lines, count) {
	var result = [];
	for (var i = 0; i < count; ++i) result.push(...lines);
	return result;
}
/**
* Computes a stroke-dasharray string for animating a custom-dashed line draw effect.
*
* Given a user-specified dash pattern (e.g. `"7,3"`), this function builds a dasharray
* that reveals exactly `length` pixels of that pattern, followed by a gap of `totalLength`
* to hide the remainder of the path.
*
* Like {@link generateSimpleStrokeDasharray}, the trailing gap uses `totalLength` rather than
* `totalLength - length` to avoid floating-point precision artifacts with round/square strokeLinecap.
*
* @param length The currently visible portion of the path
* @param totalLength The total length of the SVG path
* @param lines The user-specified dash pattern as an array of numbers (e.g. [7, 3])
* @returns A stroke-dasharray string incorporating the custom dash pattern
*/
function getStrokeDasharray(length, totalLength, lines) {
	var normalizedLines = normalizeDashPattern(lines);
	var lineLength = normalizedLines.reduce((pre, next) => pre + next, 0);
	if (!lineLength) return generateSimpleStrokeDasharray(totalLength, length);
	var count = Math.floor(length / lineLength);
	var remainLength = length % lineLength;
	var remainLines = [];
	for (var i = 0, sum = 0; i < normalizedLines.length; sum += (_normalizedLines$i = normalizedLines[i]) !== null && _normalizedLines$i !== void 0 ? _normalizedLines$i : 0, ++i) {
		var _normalizedLines$i;
		var lineValue = normalizedLines[i];
		if (lineValue != null && sum + lineValue > remainLength) {
			remainLines = [...normalizedLines.slice(0, i), remainLength - sum];
			break;
		}
	}
	var emptyLines = remainLines.length % 2 === 0 ? [0, totalLength] : [totalLength];
	return [
		...repeat(normalizedLines, count),
		...remainLines,
		...emptyLines
	].map((line) => "".concat(line, "px")).join(", ");
}
/**
* Computes the animated stroke-dasharray for a line's entrance animation.
*
* @param userStrokeDasharray The user-specified stroke-dasharray (e.g. "5,3"), if any
* @param totalLength Total SVG path length
* @param visibleLength How much of the path should be visible
* @returns A stroke-dasharray string for the current animation frame
*/
function computeAnimatedStrokeDasharray(userStrokeDasharray, totalLength, visibleLength) {
	if (userStrokeDasharray) return getStrokeDasharray(visibleLength, totalLength, "".concat(userStrokeDasharray).split(/[,\s]+/gim).map((num) => parseFloat(num)));
	return generateSimpleStrokeDasharray(totalLength, visibleLength);
}
/**
* The default shape for Line. During the entrance animation, the line is progressively
* revealed using the `strokeDasharray` SVG attribute: the visible portion grows from
* 0 to the full path length as `animationElapsedTime` progresses from 0 to 1.
*
* This is the built-in shape for Line. It is automatically used when no custom `shape` prop
* is provided. You can import and reuse it as a starting point for custom shapes,
* or use it as a reference for building your own.
*
* The animation progress props (`animationElapsedTime`, `isAnimating`, `isEntrance`) are available
* for custom shapes that want to add their own effects on top.
*
* @example
* ```tsx
* import { Line, LineDrawShape } from 'recharts';
*
* // Use the default shape explicitly (same as providing no shape prop)
* <Line dataKey="value" shape={LineDrawShape} />
* ```
*
* @see {@link https://recharts.github.io/en-US/guide/animations Animation guide}
*
* @since 3.9
*/
function LineDrawShape(props) {
	props.animationElapsedTime;
	props.isAnimating;
	props.isEntrance;
	var visibleLength = props.visibleLength, userStrokeDasharray = props.strokeDasharray, connectNulls = props.connectNulls, curveProps = _objectWithoutProperties$3(props, _excluded$3);
	var finalConnectNulls = connectNulls !== null && connectNulls !== void 0 ? connectNulls : false;
	var strokeDasharray;
	if (visibleLength != null) {
		var _pathRef$current;
		var pathRef = curveProps.pathRef;
		strokeDasharray = computeAnimatedStrokeDasharray(userStrokeDasharray, getTotalLength$1((_pathRef$current = pathRef === null || pathRef === void 0 ? void 0 : pathRef.current) !== null && _pathRef$current !== void 0 ? _pathRef$current : null), visibleLength);
	} else if (userStrokeDasharray != null) strokeDasharray = String(userStrokeDasharray);
	return /*#__PURE__*/ import_react.createElement(Curve, _extends$3({}, curveProps, {
		connectNulls: finalConnectNulls,
		strokeDasharray
	}));
}
// node_modules/recharts/es6/cartesian/useAnimatedLineLength.js
/**
* Tracks the animated visible length of a Line's SVG path across data changes.
*
* Invariants:
* 1. The visible length only grows (monotonically non-decreasing with animationElapsedTime).
* 2. The visible length changes continuously — no jumps when data changes mid-animation.
*    This is achieved by tracking the maximum animated length in pixels and using it
*    as the starting point for the next animation.
* 3. Once the line reaches 100% visibility, it never becomes partially visible again.
*    In that case the hook returns `null`, meaning no animation stroke-dasharray is needed.
*
* @param points The current set of points for the line. When this reference changes,
*   the hook detects a data change and starts a new animation from the current visible length.
* @returns A stable callback `(animationElapsedTime, totalLength) => number | null` where:
*   - `animationElapsedTime` is the animation progress (0 to 1)
*   - `totalLength` is the current total length of the SVG path in pixels
*   - returns the visible length in pixels, or `null` if the line is fully visible
*/
function useAnimatedLineLength(points) {
	var startingLengthRef = (0, import_react.useRef)(0);
	var maxAnimatedLengthRef = (0, import_react.useRef)(0);
	var reachedFullRef = (0, import_react.useRef)(false);
	var prevPointsRef = (0, import_react.useRef)(points);
	if (prevPointsRef.current !== points) {
		startingLengthRef.current = maxAnimatedLengthRef.current;
		prevPointsRef.current = points;
	}
	return (0, import_react.useCallback)((animationElapsedTime, totalLength) => {
		if (reachedFullRef.current) return null;
		var visibleLength = Math.min(round(startingLengthRef.current + animationElapsedTime * totalLength), totalLength);
		if (animationElapsedTime > 0 && totalLength > 0) {
			maxAnimatedLengthRef.current = Math.max(maxAnimatedLengthRef.current, visibleLength);
			if (visibleLength >= totalLength) {
				reachedFullRef.current = true;
				return null;
			}
		}
		return visibleLength;
	}, []);
}
// node_modules/recharts/es6/state/selectors/lineSelectors.js
var selectXAxisWithScale$1 = (state, xAxisId, _yAxisId, isPanorama) => selectAxisWithScale(state, "xAxis", xAxisId, isPanorama);
var selectXAxisTicks$1 = (state, xAxisId, _yAxisId, isPanorama) => selectTicksOfGraphicalItem(state, "xAxis", xAxisId, isPanorama);
var selectYAxisWithScale$1 = (state, _xAxisId, yAxisId, isPanorama) => selectAxisWithScale(state, "yAxis", yAxisId, isPanorama);
var selectYAxisTicks$1 = (state, _xAxisId, yAxisId, isPanorama) => selectTicksOfGraphicalItem(state, "yAxis", yAxisId, isPanorama);
var selectBandSize$1 = createSelector([
	selectChartLayout,
	selectXAxisWithScale$1,
	selectYAxisWithScale$1,
	selectXAxisTicks$1,
	selectYAxisTicks$1
], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks) => {
	if (isCategoricalAxis(layout, "xAxis")) return getBandSizeOfAxis(xAxis, xAxisTicks, false);
	return getBandSizeOfAxis(yAxis, yAxisTicks, false);
});
var pickLineId = (_state, _xAxisId, _yAxisId, _isPanorama, id) => id;
function isLineSettings(item) {
	return item.type === "line";
}
var selectSynchronisedLineSettings = createSelector([selectUnfilteredCartesianItems, pickLineId], (graphicalItems, id) => graphicalItems.filter(isLineSettings).find((x) => x.id === id));
var selectLinePoints = createSelector([
	selectChartLayout,
	selectXAxisWithScale$1,
	selectYAxisWithScale$1,
	selectXAxisTicks$1,
	selectYAxisTicks$1,
	selectSynchronisedLineSettings,
	selectBandSize$1,
	selectChartDataWithIndexesIfNotInPanoramaPosition4
], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks, lineSettings, bandSize, _ref) => {
	var chartData = _ref.chartData, dataStartIndex = _ref.dataStartIndex, dataEndIndex = _ref.dataEndIndex;
	if (lineSettings == null || xAxis == null || yAxis == null || xAxisTicks == null || yAxisTicks == null || xAxisTicks.length === 0 || yAxisTicks.length === 0 || bandSize == null || layout !== "horizontal" && layout !== "vertical") return;
	var dataKey = lineSettings.dataKey, data = lineSettings.data;
	var displayedData;
	if (data != null && data.length > 0) displayedData = data;
	else displayedData = chartData === null || chartData === void 0 ? void 0 : chartData.slice(dataStartIndex, dataEndIndex + 1);
	if (displayedData == null) return;
	return computeLinePoints({
		layout,
		xAxis,
		yAxis,
		xAxisTicks,
		yAxisTicks,
		dataKey,
		bandSize,
		displayedData
	});
});
// node_modules/recharts/es6/util/getRadiusAndStrokeWidthFromDot.js
function getRadiusAndStrokeWidthFromDot(dot) {
	var props = svgPropertiesNoEventsFromUnknown(dot);
	var defaultR = 3;
	var defaultStrokeWidth = 2;
	if (props != null) {
		var r = props.r, strokeWidth = props.strokeWidth;
		var realR = Number(r);
		var realStrokeWidth = Number(strokeWidth);
		if (Number.isNaN(realR) || realR < 0) realR = defaultR;
		if (Number.isNaN(realStrokeWidth) || realStrokeWidth < 0) realStrokeWidth = defaultStrokeWidth;
		return {
			r: realR,
			strokeWidth: realStrokeWidth
		};
	}
	return {
		r: defaultR,
		strokeWidth: defaultStrokeWidth
	};
}
// node_modules/recharts/es6/cartesian/Line.js
var _excluded$2 = ["id"];
var _excluded2$2 = [
	"type",
	"layout",
	"connectNulls",
	"needClip",
	"shape",
	"strokeDasharray"
];
var _excluded3 = [
	"activeDot",
	"animateNewValues",
	"animationBegin",
	"animationDuration",
	"animationEasing",
	"connectNulls",
	"dot",
	"hide",
	"isAnimationActive",
	"label",
	"legendType",
	"xAxisId",
	"yAxisId",
	"id"
];
function _extends$2() {
	return _extends$2 = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends$2.apply(null, arguments);
}
function _objectWithoutProperties$2(e, t) {
	if (null == e) return {};
	var o, r, i = _objectWithoutPropertiesLoose$2(e, t);
	if (Object.getOwnPropertySymbols) {
		var n = Object.getOwnPropertySymbols(e);
		for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
	}
	return i;
}
function _objectWithoutPropertiesLoose$2(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (-1 !== e.indexOf(n)) continue;
		t[n] = r[n];
	}
	return t;
}
function ownKeys$1(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$1(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$1(Object(t), !0).forEach(function(r) {
			_defineProperty$1(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$1(e, r, t) {
	return (r = _toPropertyKey$1(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function _toPropertyKey$1(t) {
	var i = _toPrimitive$1(t, "string");
	return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$1(t, r) {
	if ("object" != typeof t || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != typeof i) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
/**
* Internal props, combination of external props + defaultProps + private Recharts state
*/
/**
* External props, intended for end users to fill in
*/
function getTotalLength(mainCurve) {
	try {
		return mainCurve && mainCurve.getTotalLength && mainCurve.getTotalLength() || 0;
	} catch (_unused) {
		return 0;
	}
}
/**
* Compute the average x-shift between matched pairs (prev → next).
* This tells us the overall direction and magnitude of the data movement.
*/
function averageShift(items) {
	var total = 0;
	var count = 0;
	for (var item of items) if (item.status === "matched" && item.prev.x != null && item.next.x != null) {
		total += item.next.x - item.prev.x;
		count++;
	}
	return count > 0 ? total / count : 0;
}
var defaultLineAnimateItems = (items, animationElapsedTime) => {
	if (items == null) return [];
	if (animationElapsedTime === 1) return items.flatMap((item) => item.status === "removed" ? [] : [item.next]);
	var shift = averageShift(items);
	var result = [];
	for (var item of items) if (item.status === "matched") result.push(_objectSpread$1(_objectSpread$1({}, item.next), {}, {
		x: interpolate(item.prev.x, item.next.x, animationElapsedTime),
		y: interpolate(item.prev.y, item.next.y, animationElapsedTime)
	}));
	else if (item.status === "added") {
		if (item.next.x != null) {
			var entryX = item.next.x - shift;
			result.push(_objectSpread$1(_objectSpread$1({}, item.next), {}, {
				x: interpolate(entryX, item.next.x, animationElapsedTime),
				y: item.next.y
			}));
		} else result.push(item.next);
	} else if (item.status === "removed") {
		if (item.prev.x != null) {
			var exitX = item.prev.x + shift;
			result.push(_objectSpread$1(_objectSpread$1({}, item.prev), {}, {
				x: interpolate(item.prev.x, exitX, animationElapsedTime),
				y: item.prev.y
			}));
		}
	}
	return result;
};
var defaultLineProps = {
	activeDot: true,
	animateNewValues: true,
	animationBegin: 0,
	animationDuration: 1500,
	animationEasing: "ease",
	animationInterpolateFn: defaultLineAnimateItems,
	animationMatchBy: matchByIndex,
	connectNulls: false,
	dot: true,
	fill: "#fff",
	hide: false,
	isAnimationActive: "auto",
	label: false,
	legendType: "line",
	shape: LineDrawShape,
	stroke: "#3182bd",
	strokeWidth: 1,
	xAxisId: 0,
	yAxisId: 0,
	zIndex: DefaultZIndexes.line,
	type: "linear"
};
/**
* Because of naming conflict, we are forced to ignore certain (valid) SVG attributes.
*/
var computeLegendPayloadFromAreaData$1 = (props) => {
	var dataKey = props.dataKey, name = props.name, stroke = props.stroke, legendType = props.legendType;
	return [{
		inactive: props.hide,
		dataKey,
		type: legendType,
		color: stroke,
		value: getTooltipNameProp(name, dataKey),
		payload: props
	}];
};
var SetLineTooltipEntrySettings = /*#__PURE__*/ import_react.memo((_ref) => {
	var dataKey = _ref.dataKey, data = _ref.data, stroke = _ref.stroke, strokeWidth = _ref.strokeWidth, fill = _ref.fill, name = _ref.name, hide = _ref.hide, unit = _ref.unit, formatter = _ref.formatter, tooltipType = _ref.tooltipType, id = _ref.id;
	var tooltipEntrySettings = {
		dataDefinedOnItem: data,
		getPosition: noop,
		settings: {
			stroke,
			strokeWidth,
			fill,
			dataKey,
			nameKey: void 0,
			name: getTooltipNameProp(name, dataKey),
			hide,
			type: tooltipType,
			color: stroke,
			unit,
			formatter,
			graphicalItemId: id
		}
	};
	return /*#__PURE__*/ import_react.createElement(SetTooltipEntrySettings, { tooltipEntrySettings });
});
function LineDotsWrapper(_ref2) {
	var clipPathId = _ref2.clipPathId, points = _ref2.points, props = _ref2.props;
	var dot = props.dot, dataKey = props.dataKey, needClip = props.needClip;
	props.id;
	var propsWithoutId = _objectWithoutProperties$2(props, _excluded$2);
	var lineProps = svgPropertiesNoEvents(propsWithoutId);
	return /*#__PURE__*/ import_react.createElement(Dots, {
		points,
		dot,
		className: "recharts-line-dots",
		dotClassName: "recharts-line-dot",
		dataKey,
		baseProps: lineProps,
		needClip,
		clipPathId
	});
}
function LineLabelListProvider(_ref3) {
	var showLabels = _ref3.showLabels, children = _ref3.children, points = _ref3.points;
	var labelListEntries = (0, import_react.useMemo)(() => {
		return points === null || points === void 0 ? void 0 : points.map((point) => {
			var _point$x, _point$y;
			var viewBox = {
				x: (_point$x = point.x) !== null && _point$x !== void 0 ? _point$x : 0,
				y: (_point$y = point.y) !== null && _point$y !== void 0 ? _point$y : 0,
				width: 0,
				lowerWidth: 0,
				upperWidth: 0,
				height: 0
			};
			return _objectSpread$1(_objectSpread$1({}, viewBox), {}, {
				value: point.value,
				payload: point.payload,
				viewBox,
				parentViewBox: void 0,
				fill: void 0
			});
		});
	}, [points]);
	return /*#__PURE__*/ import_react.createElement(CartesianLabelListContextProvider, { value: showLabels ? labelListEntries : void 0 }, children);
}
function StaticCurve(_ref4) {
	var clipPathId = _ref4.clipPathId, pathRef = _ref4.pathRef, points = _ref4.points, props = _ref4.props, animationElapsedTime = _ref4.animationElapsedTime, isAnimating = _ref4.isAnimating, isEntrance = _ref4.isEntrance, visibleLength = _ref4.visibleLength;
	var type = props.type, layout = props.layout, connectNulls = props.connectNulls, needClip = props.needClip, shape = props.shape, strokeDasharray = props.strokeDasharray, others = _objectWithoutProperties$2(props, _excluded2$2);
	var curveProps = _objectSpread$1(_objectSpread$1({}, svgPropertiesAndEvents(others)), {}, {
		fill: "none",
		className: "recharts-line-curve",
		clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : void 0,
		points,
		type,
		layout,
		connectNulls,
		strokeDasharray: strokeDasharray !== null && strokeDasharray !== void 0 ? strokeDasharray : props.strokeDasharray,
		pathRef,
		animationElapsedTime,
		isAnimating,
		isEntrance: props.animateNewValues ? isEntrance : false,
		visibleLength
	});
	return /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, (points === null || points === void 0 ? void 0 : points.length) > 1 && /*#__PURE__*/ import_react.createElement(Shape, {
		option: shape,
		DefaultShape: defaultLineProps.shape,
		shapeProps: curveProps
	}), /*#__PURE__*/ import_react.createElement(LineDotsWrapper, {
		points,
		clipPathId,
		props
	}));
}
function CurveWithAnimation(_ref5) {
	var clipPathId = _ref5.clipPathId, props = _ref5.props, pathRef = _ref5.pathRef, previousPointsRef = _ref5.previousPointsRef;
	var points = props.points, isAnimationActive = props.isAnimationActive, animationBegin = props.animationBegin, animationDuration = props.animationDuration, animationEasing = props.animationEasing, animationMatchBy = props.animationMatchBy, animationInterpolateFn = props.animationInterpolateFn, layout = props.layout;
	var totalLength = getTotalLength(pathRef.current);
	var _useAnimationCallback = useAnimationCallbacks(props.onAnimationStart, props.onAnimationEnd), isAnimating = _useAnimationCallback.isAnimating, handleAnimationStart = _useAnimationCallback.handleAnimationStart, handleAnimationEnd = _useAnimationCallback.handleAnimationEnd;
	var showLabels = !isAnimating;
	var getVisibleLength = useAnimatedLineLength(points);
	var shouldUpdatePreviousRef = (0, import_react.useCallback)((animationElapsedTime) => animationElapsedTime > 0 && totalLength > 0, [totalLength]);
	return /*#__PURE__*/ import_react.createElement(LineLabelListProvider, {
		points,
		showLabels
	}, props.children, /*#__PURE__*/ import_react.createElement(AnimatedItems, {
		animationInput: points,
		animationIdPrefix: "recharts-line-",
		items: points,
		previousItemsRef: previousPointsRef,
		isAnimationActive,
		animationBegin,
		animationDuration,
		animationEasing,
		onAnimationStart: handleAnimationStart,
		onAnimationEnd: handleAnimationEnd,
		animationInterpolateFn,
		animationMatchBy,
		shouldUpdatePreviousRef,
		layout
	}, (stepData, animationElapsedTime, isEntrance) => {
		var animationActive = isAnimating || animationElapsedTime < 1;
		var visibleLength = animationActive ? getVisibleLength(animationElapsedTime, totalLength) : null;
		return /*#__PURE__*/ import_react.createElement(StaticCurve, {
			props,
			points: stepData,
			clipPathId,
			pathRef,
			animationElapsedTime,
			isAnimating: animationActive,
			isEntrance,
			visibleLength
		});
	}), /*#__PURE__*/ import_react.createElement(LabelListFromLabelProp, { label: props.label }));
}
function RenderCurve(_ref6) {
	var clipPathId = _ref6.clipPathId, props = _ref6.props;
	var previousPointsRef = (0, import_react.useRef)(null);
	var pathRef = (0, import_react.useRef)(null);
	return /*#__PURE__*/ import_react.createElement(CurveWithAnimation, {
		props,
		clipPathId,
		previousPointsRef,
		pathRef
	});
}
var errorBarDataPointFormatter = (dataPoint, dataKey) => {
	var _dataPoint$x, _dataPoint$y;
	return {
		x: (_dataPoint$x = dataPoint.x) !== null && _dataPoint$x !== void 0 ? _dataPoint$x : void 0,
		y: (_dataPoint$y = dataPoint.y) !== null && _dataPoint$y !== void 0 ? _dataPoint$y : void 0,
		value: dataPoint.value,
		errorVal: getValueByDataKey(dataPoint.payload, dataKey)
	};
};
var LineWithState = class extends import_react.Component {
	render() {
		var _this$props = this.props, hide = _this$props.hide, dot = _this$props.dot, points = _this$props.points, className = _this$props.className, xAxisId = _this$props.xAxisId, yAxisId = _this$props.yAxisId, top = _this$props.top, left = _this$props.left, width = _this$props.width, height = _this$props.height, id = _this$props.id, needClip = _this$props.needClip, zIndex = _this$props.zIndex;
		if (hide) return null;
		var layerClass = clsx("recharts-line", className);
		var clipPathId = id;
		var _getRadiusAndStrokeWi = getRadiusAndStrokeWidthFromDot(dot), r = _getRadiusAndStrokeWi.r, strokeWidth = _getRadiusAndStrokeWi.strokeWidth;
		var clipDot = isClipDot(dot);
		var dotSize = r * 2 + strokeWidth;
		var activePointsClipPath = needClip ? "url(#clipPath-".concat(clipDot ? "" : "dots-").concat(clipPathId, ")") : void 0;
		return /*#__PURE__*/ import_react.createElement(ZIndexLayer, { zIndex }, /*#__PURE__*/ import_react.createElement(Layer, { className: layerClass }, needClip && /*#__PURE__*/ import_react.createElement("defs", null, /*#__PURE__*/ import_react.createElement(GraphicalItemClipPath, {
			clipPathId,
			xAxisId,
			yAxisId
		}), !clipDot && /*#__PURE__*/ import_react.createElement("clipPath", { id: "clipPath-dots-".concat(clipPathId) }, /*#__PURE__*/ import_react.createElement("rect", {
			x: left - dotSize / 2,
			y: top - dotSize / 2,
			width: width + dotSize,
			height: height + dotSize
		}))), /*#__PURE__*/ import_react.createElement(SetErrorBarContext, {
			xAxisId,
			yAxisId,
			data: points,
			dataPointFormatter: errorBarDataPointFormatter,
			errorBarOffset: 0
		}, /*#__PURE__*/ import_react.createElement(RenderCurve, {
			props: this.props,
			clipPathId
		}))), /*#__PURE__*/ import_react.createElement(ActivePoints, {
			activeDot: this.props.activeDot,
			points,
			mainColor: this.props.stroke,
			itemDataKey: this.props.dataKey,
			clipPath: activePointsClipPath
		}));
	}
};
function LineImpl(props) {
	var _resolveDefaultProps = resolveDefaultProps(props, defaultLineProps), activeDot = _resolveDefaultProps.activeDot, animateNewValues = _resolveDefaultProps.animateNewValues, animationBegin = _resolveDefaultProps.animationBegin, animationDuration = _resolveDefaultProps.animationDuration, animationEasing = _resolveDefaultProps.animationEasing, connectNulls = _resolveDefaultProps.connectNulls, dot = _resolveDefaultProps.dot, hide = _resolveDefaultProps.hide, isAnimationActive = _resolveDefaultProps.isAnimationActive, label = _resolveDefaultProps.label, legendType = _resolveDefaultProps.legendType, xAxisId = _resolveDefaultProps.xAxisId, yAxisId = _resolveDefaultProps.yAxisId, id = _resolveDefaultProps.id, everythingElse = _objectWithoutProperties$2(_resolveDefaultProps, _excluded3);
	var needClip = useNeedsClip(xAxisId, yAxisId).needClip;
	var plotArea = usePlotArea();
	var layout = useChartLayout();
	var isPanorama = useIsPanorama();
	var points = useAppSelector((state) => selectLinePoints(state, xAxisId, yAxisId, isPanorama, id));
	if (layout !== "horizontal" && layout !== "vertical" || points == null || plotArea == null) return null;
	var height = plotArea.height, width = plotArea.width, left = plotArea.x, top = plotArea.y;
	return /*#__PURE__*/ import_react.createElement(LineWithState, _extends$2({}, everythingElse, {
		id,
		connectNulls,
		dot,
		activeDot,
		animateNewValues,
		animationBegin,
		animationDuration,
		animationEasing,
		isAnimationActive,
		hide,
		label,
		legendType,
		xAxisId,
		yAxisId,
		points,
		layout,
		height,
		width,
		left,
		top,
		needClip
	}));
}
function computeLinePoints(_ref7) {
	var layout = _ref7.layout, xAxis = _ref7.xAxis, yAxis = _ref7.yAxis, xAxisTicks = _ref7.xAxisTicks, yAxisTicks = _ref7.yAxisTicks, dataKey = _ref7.dataKey, bandSize = _ref7.bandSize;
	return _ref7.displayedData.map((entry, index) => {
		var value = getValueByDataKey(entry, dataKey);
		if (layout === "horizontal") {
			var _x = getCateCoordinateOfLine({
				axis: xAxis,
				ticks: xAxisTicks,
				bandSize,
				entry,
				index
			});
			var _y = isNullish(value) ? null : yAxis.scale.map(value);
			return {
				x: _x,
				y: _y !== null && _y !== void 0 ? _y : null,
				value,
				payload: entry
			};
		}
		var x = isNullish(value) ? null : xAxis.scale.map(value);
		var y = getCateCoordinateOfLine({
			axis: yAxis,
			ticks: yAxisTicks,
			bandSize,
			entry,
			index
		});
		if (x == null || y == null) return null;
		return {
			x,
			y,
			value,
			payload: entry
		};
	}).filter(Boolean);
}
function LineFn(outsideProps) {
	var props = resolveDefaultProps(outsideProps, defaultLineProps);
	var isPanorama = useIsPanorama();
	return /*#__PURE__*/ import_react.createElement(RegisterGraphicalItemId, {
		id: props.id,
		type: "line"
	}, (id) => /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, /*#__PURE__*/ import_react.createElement(SetLegendPayload, { legendPayload: computeLegendPayloadFromAreaData$1(props) }), /*#__PURE__*/ import_react.createElement(SetLineTooltipEntrySettings, {
		dataKey: props.dataKey,
		data: props.data,
		stroke: props.stroke,
		strokeWidth: props.strokeWidth,
		fill: props.fill,
		name: props.name,
		hide: props.hide,
		unit: props.unit,
		formatter: props.formatter,
		tooltipType: props.tooltipType,
		id
	}), /*#__PURE__*/ import_react.createElement(SetCartesianGraphicalItem, {
		type: "line",
		id,
		data: props.data,
		xAxisId: props.xAxisId,
		yAxisId: props.yAxisId,
		zAxisId: 0,
		dataKey: props.dataKey,
		hide: props.hide,
		isPanorama
	}), /*#__PURE__*/ import_react.createElement(LineImpl, _extends$2({}, props, { id }))));
}
/**
* @provides LabelListContext
* @provides ErrorBarContext
* @consumes CartesianChartContext
*/
var Line = /*#__PURE__*/ import_react.memo(LineFn, propsAreEqual);
Line.displayName = "Line";
// node_modules/recharts/es6/state/selectors/areaSelectors.js
var selectXAxisWithScale = (state, graphicalItemId, isPanorama) => selectAxisWithScale(state, "xAxis", selectXAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectXAxisTicks = (state, graphicalItemId, isPanorama) => selectTicksOfGraphicalItem(state, "xAxis", selectXAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectYAxisWithScale = (state, graphicalItemId, isPanorama) => selectAxisWithScale(state, "yAxis", selectYAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectYAxisTicks = (state, graphicalItemId, isPanorama) => selectTicksOfGraphicalItem(state, "yAxis", selectYAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectBandSize = createSelector([
	selectChartLayout,
	selectXAxisWithScale,
	selectYAxisWithScale,
	selectXAxisTicks,
	selectYAxisTicks
], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks) => {
	if (isCategoricalAxis(layout, "xAxis")) return getBandSizeOfAxis(xAxis, xAxisTicks, false);
	return getBandSizeOfAxis(yAxis, yAxisTicks, false);
});
var pickAreaId = (_state, id) => id;
var selectSynchronisedAreaSettings = createSelector([selectUnfilteredCartesianItems, pickAreaId], (graphicalItems, id) => graphicalItems.filter((item) => item.type === "area").find((item) => item.id === id));
var selectNumericalAxisType = (state) => {
	var layout = selectChartLayout(state);
	return isCategoricalAxis(layout, "xAxis") ? "yAxis" : "xAxis";
};
var selectNumericalAxisIdFromGraphicalItemId = (state, graphicalItemId) => {
	if (selectNumericalAxisType(state) === "yAxis") return selectYAxisIdFromGraphicalItemId(state, graphicalItemId);
	return selectXAxisIdFromGraphicalItemId(state, graphicalItemId);
};
var selectNumericalAxisStackGroups = (state, graphicalItemId, isPanorama) => selectStackGroups(state, selectNumericalAxisType(state), selectNumericalAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectGraphicalItemStackedData = createSelector([selectSynchronisedAreaSettings, selectNumericalAxisStackGroups], (areaSettings, stackGroups) => {
	var _stackGroups$stackId;
	if (areaSettings == null || stackGroups == null) return;
	var stackId = areaSettings.stackId;
	var stackSeriesIdentifier = getStackSeriesIdentifier(areaSettings);
	if (stackId == null || stackSeriesIdentifier == null) return;
	var groups = (_stackGroups$stackId = stackGroups[stackId]) === null || _stackGroups$stackId === void 0 ? void 0 : _stackGroups$stackId.stackedData;
	var found = groups === null || groups === void 0 ? void 0 : groups.find((v) => v.key === stackSeriesIdentifier);
	if (found == null) return;
	return found.map((item) => [item[0], item[1]]);
});
var selectStackDataKeys = createSelector([selectSynchronisedAreaSettings, selectNumericalAxisStackGroups], (areaSettings, stackGroups) => {
	if (areaSettings == null || areaSettings.stackId == null || stackGroups == null) return;
	var group = stackGroups[areaSettings.stackId];
	if (group == null) return;
	return group.graphicalItems.map((item) => item.dataKey).filter(isNotNil);
});
var selectArea = createSelector([
	selectChartLayout,
	selectXAxisWithScale,
	selectYAxisWithScale,
	selectXAxisTicks,
	selectYAxisTicks,
	selectGraphicalItemStackedData,
	selectChartDataWithIndexesIfNotInPanoramaPosition3,
	selectBandSize,
	selectSynchronisedAreaSettings,
	selectChartBaseValue,
	selectStackDataKeys
], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks, stackedData, _ref, bandSize, areaSettings, chartBaseValue, stackDataKeys) => {
	var chartData = _ref.chartData, dataStartIndex = _ref.dataStartIndex, dataEndIndex = _ref.dataEndIndex;
	if (areaSettings == null || layout !== "horizontal" && layout !== "vertical" || xAxis == null || yAxis == null || xAxisTicks == null || yAxisTicks == null || xAxisTicks.length === 0 || yAxisTicks.length === 0 || bandSize == null) return;
	var data = areaSettings.data;
	var displayedData;
	if (data && data.length > 0) displayedData = data;
	else displayedData = chartData === null || chartData === void 0 ? void 0 : chartData.slice(dataStartIndex, dataEndIndex + 1);
	if (displayedData == null) return;
	return computeArea({
		layout,
		xAxis,
		yAxis,
		xAxisTicks,
		yAxisTicks,
		dataStartIndex,
		areaSettings,
		stackedData,
		displayedData,
		chartBaseValue,
		bandSize,
		stackDataKeys
	});
});
// node_modules/recharts/es6/cartesian/AreaRevealShape.js
var _excluded$1 = [
	"animationElapsedTime",
	"isAnimating",
	"isEntrance",
	"layout",
	"isRange",
	"stroke",
	"connectNulls"
];
var _excluded2$1 = ["id", "baseLine"];
function _extends$1() {
	return _extends$1 = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends$1.apply(null, arguments);
}
function _objectWithoutProperties$1(e, t) {
	if (null == e) return {};
	var o, r, i = _objectWithoutPropertiesLoose$1(e, t);
	if (Object.getOwnPropertySymbols) {
		var n = Object.getOwnPropertySymbols(e);
		for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
	}
	return i;
}
function _objectWithoutPropertiesLoose$1(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (-1 !== e.indexOf(n)) continue;
		t[n] = r[n];
	}
	return t;
}
/**
* Props for the clip-path rect computation.
* @internal
*/
function HorizontalClipRect(_ref) {
	var _points$, _points;
	var alpha = _ref.alpha, baseLine = _ref.baseLine, points = _ref.points, strokeWidth = _ref.strokeWidth;
	var startX = (_points$ = points[0]) === null || _points$ === void 0 ? void 0 : _points$.x;
	var endX = (_points = points[points.length - 1]) === null || _points === void 0 ? void 0 : _points.x;
	if (!isWellBehavedNumber(startX) || !isWellBehavedNumber(endX)) return null;
	var width = alpha * Math.abs(startX - endX);
	var maxY = Math.max(...points.map((entry) => entry.y || 0));
	if (isNumber(baseLine)) maxY = Math.max(baseLine, maxY);
	else if (baseLine && Array.isArray(baseLine) && baseLine.length) maxY = Math.max(...baseLine.map((entry) => entry.y || 0), maxY);
	if (isNumber(maxY)) return /*#__PURE__*/ import_react.createElement("rect", {
		x: startX < endX ? startX : startX - width,
		y: 0,
		width,
		height: Math.floor(maxY + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1))
	});
	return null;
}
function VerticalClipRect(_ref2) {
	var _points$2, _points2;
	var alpha = _ref2.alpha, baseLine = _ref2.baseLine, points = _ref2.points, strokeWidth = _ref2.strokeWidth;
	var startY = (_points$2 = points[0]) === null || _points$2 === void 0 ? void 0 : _points$2.y;
	var endY = (_points2 = points[points.length - 1]) === null || _points2 === void 0 ? void 0 : _points2.y;
	if (!isWellBehavedNumber(startY) || !isWellBehavedNumber(endY)) return null;
	var height = alpha * Math.abs(startY - endY);
	var maxX = Math.max(...points.map((entry) => entry.x || 0));
	if (isNumber(baseLine)) maxX = Math.max(baseLine, maxX);
	else if (baseLine && Array.isArray(baseLine) && baseLine.length) maxX = Math.max(...baseLine.map((entry) => entry.x || 0), maxX);
	if (isNumber(maxX)) return /*#__PURE__*/ import_react.createElement("rect", {
		x: 0,
		y: startY < endY ? startY : startY - height,
		width: maxX + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1),
		height: Math.floor(height)
	});
	return null;
}
function RevealClipRect(_ref3) {
	var alpha = _ref3.alpha, layout = _ref3.layout, points = _ref3.points, baseLine = _ref3.baseLine, strokeWidth = _ref3.strokeWidth;
	if (layout === "vertical") return /*#__PURE__*/ import_react.createElement(VerticalClipRect, {
		alpha,
		points,
		baseLine,
		strokeWidth
	});
	return /*#__PURE__*/ import_react.createElement(HorizontalClipRect, {
		alpha,
		points,
		baseLine,
		strokeWidth
	});
}
/**
* The default shape for Area that reveals the chart with a left-to-right (or top-to-bottom)
* clip-path animation on entrance, and renders the plain curve otherwise.
*
* This component renders the complete Area visual: the filled area curve, the stroke curve,
* and (for range areas) the baseline stroke curve. During entrance animation, all curves are
* wrapped in a clip-path that progressively reveals the area.
*
* This is the built-in entrance animation for Area. It is automatically used when no custom
* `shape` prop is provided. You can import and reuse it as a starting point for custom shapes.
*
* @example
* ```tsx
* import { Area, AreaRevealShape } from 'recharts';
*
* // Use the default shape explicitly (same as providing no shape prop)
* <Area dataKey="value" shape={AreaRevealShape} />
* ```
*
* @see {@link https://recharts.github.io/en-US/guide/animations Animation guide}
*
* @since 3.9
*/
function AreaRevealShape(props) {
	var _props$animationElaps = props.animationElapsedTime, animationElapsedTime = _props$animationElaps === void 0 ? 1 : _props$animationElaps, _props$isAnimating = props.isAnimating, isAnimating = _props$isAnimating === void 0 ? false : _props$isAnimating, _props$isEntrance = props.isEntrance, isEntrance = _props$isEntrance === void 0 ? false : _props$isEntrance, layoutProp = props.layout, isRange = props.isRange, stroke = props.stroke, connectNulls = props.connectNulls, restProps = _objectWithoutProperties$1(props, _excluded$1);
	var layout = layoutProp === "vertical" ? "vertical" : "horizontal";
	var finalConnectNulls = connectNulls !== null && connectNulls !== void 0 ? connectNulls : false;
	var clipId = useId();
	var id = restProps.id, baseLine = restProps.baseLine, propsWithoutIdBaseline = _objectWithoutProperties$1(restProps, _excluded2$1);
	var strokeSvgProps = svgPropertiesNoEvents(propsWithoutIdBaseline);
	var fillCurve = /*#__PURE__*/ import_react.createElement(Curve, _extends$1({}, restProps, {
		id,
		baseLine,
		connectNulls: finalConnectNulls,
		stroke: "none",
		className: "recharts-area-area",
		layout
	}));
	var strokeCurve = stroke !== "none" && /*#__PURE__*/ import_react.createElement(Curve, _extends$1({}, strokeSvgProps, {
		className: "recharts-area-curve",
		layout,
		type: restProps.type,
		connectNulls: finalConnectNulls,
		fill: "none",
		stroke,
		points: restProps.points
	}));
	var baselineCurve = stroke !== "none" && isRange && Array.isArray(baseLine) && /*#__PURE__*/ import_react.createElement(Curve, _extends$1({}, strokeSvgProps, {
		className: "recharts-area-curve",
		layout,
		type: restProps.type,
		connectNulls: finalConnectNulls,
		fill: "none",
		stroke,
		points: baseLine
	}));
	if (isEntrance && (isAnimating || animationElapsedTime < 1)) {
		var _restProps$points;
		return /*#__PURE__*/ import_react.createElement(Layer, null, /*#__PURE__*/ import_react.createElement("defs", null, /*#__PURE__*/ import_react.createElement("clipPath", { id: clipId }, /*#__PURE__*/ import_react.createElement(RevealClipRect, {
			alpha: animationElapsedTime,
			points: (_restProps$points = restProps.points) !== null && _restProps$points !== void 0 ? _restProps$points : [],
			baseLine,
			layout,
			strokeWidth: restProps.strokeWidth
		}))), /*#__PURE__*/ import_react.createElement(Layer, { clipPath: "url(#".concat(clipId, ")") }, fillCurve, strokeCurve, baselineCurve));
	}
	return /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, fillCurve, strokeCurve, baselineCurve);
}
// node_modules/recharts/es6/cartesian/Area.js
var _excluded = ["id"];
var _excluded2 = [
	"activeDot",
	"animationBegin",
	"animationDuration",
	"animationEasing",
	"connectNulls",
	"dot",
	"fill",
	"fillOpacity",
	"hide",
	"isAnimationActive",
	"legendType",
	"stroke",
	"xAxisId",
	"yAxisId"
];
function _extends() {
	return _extends = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends.apply(null, arguments);
}
function _objectWithoutProperties(e, t) {
	if (null == e) return {};
	var o, r, i = _objectWithoutPropertiesLoose(e, t);
	if (Object.getOwnPropertySymbols) {
		var n = Object.getOwnPropertySymbols(e);
		for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
	}
	return i;
}
function _objectWithoutPropertiesLoose(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (-1 !== e.indexOf(n)) continue;
		t[n] = r[n];
	}
	return t;
}
function ownKeys(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
			_defineProperty(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty(e, r, t) {
	return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function _toPropertyKey(t) {
	var i = _toPrimitive(t, "string");
	return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
	if ("object" != typeof t || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != typeof i) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
/**
* @inline
*/
/**
* Our base value array has payload in it, and we expose it externally too.
*/
/**
* Internal props, combination of external props + defaultProps + private Recharts state
*/
/**
* External props, intended for end users to fill in
*/
var defaultAreaAnimateItems = (items, animationElapsedTime) => {
	if (items == null) return [];
	if (animationElapsedTime === 1) return items.flatMap((item) => item.status === "removed" ? [] : [item.next]);
	return items.flatMap((item) => {
		if (item.status === "matched") return [_objectSpread(_objectSpread({}, item.next), {}, {
			x: interpolate(item.prev.x, item.next.x, animationElapsedTime),
			y: interpolate(item.prev.y, item.next.y, animationElapsedTime)
		})];
		if (item.status === "added") return [item.next];
		return [];
	});
};
var defaultAreaProps = {
	activeDot: true,
	animationBegin: 0,
	animationDuration: 1500,
	animationEasing: "ease",
	animationMatchBy: matchByIndex,
	animationInterpolateFn: defaultAreaAnimateItems,
	connectNulls: false,
	dot: false,
	fill: "#3182bd",
	fillOpacity: .6,
	hide: false,
	isAnimationActive: "auto",
	legendType: "line",
	stroke: "#3182bd",
	strokeWidth: 1,
	type: "linear",
	label: false,
	shape: AreaRevealShape,
	xAxisId: 0,
	yAxisId: 0,
	zIndex: DefaultZIndexes.area
};
/**
* Because of naming conflict, we are forced to ignore certain (valid) SVG attributes.
*/
function getLegendItemColor(stroke, fill) {
	return stroke && stroke !== "none" ? stroke : fill;
}
var computeLegendPayloadFromAreaData = (props) => {
	var dataKey = props.dataKey, name = props.name, stroke = props.stroke, fill = props.fill, legendType = props.legendType;
	return [{
		inactive: props.hide,
		dataKey,
		type: legendType,
		color: getLegendItemColor(stroke, fill),
		value: getTooltipNameProp(name, dataKey),
		payload: props
	}];
};
var SetAreaTooltipEntrySettings = /*#__PURE__*/ import_react.memo((_ref) => {
	var dataKey = _ref.dataKey, data = _ref.data, stroke = _ref.stroke, strokeWidth = _ref.strokeWidth, fill = _ref.fill, name = _ref.name, hide = _ref.hide, unit = _ref.unit, formatter = _ref.formatter, tooltipType = _ref.tooltipType, id = _ref.id;
	var tooltipEntrySettings = {
		dataDefinedOnItem: data,
		getPosition: noop,
		settings: {
			stroke,
			strokeWidth,
			fill,
			dataKey,
			nameKey: void 0,
			name: getTooltipNameProp(name, dataKey),
			hide,
			type: tooltipType,
			color: getLegendItemColor(stroke, fill),
			unit,
			formatter,
			graphicalItemId: id
		}
	};
	return /*#__PURE__*/ import_react.createElement(SetTooltipEntrySettings, { tooltipEntrySettings });
});
function AreaDotsWrapper(_ref2) {
	var clipPathId = _ref2.clipPathId, points = _ref2.points, props = _ref2.props;
	var needClip = props.needClip, dot = props.dot, dataKey = props.dataKey;
	var areaProps = svgPropertiesNoEvents(props);
	return /*#__PURE__*/ import_react.createElement(Dots, {
		points,
		dot,
		className: "recharts-area-dots",
		dotClassName: "recharts-area-dot",
		dataKey,
		baseProps: areaProps,
		needClip,
		clipPathId
	});
}
function AreaLabelListProvider(_ref3) {
	var showLabels = _ref3.showLabels, children = _ref3.children;
	var labelListEntries = _ref3.points.map((point) => {
		var _point$x, _point$y;
		var viewBox = {
			x: (_point$x = point.x) !== null && _point$x !== void 0 ? _point$x : 0,
			y: (_point$y = point.y) !== null && _point$y !== void 0 ? _point$y : 0,
			width: 0,
			lowerWidth: 0,
			upperWidth: 0,
			height: 0
		};
		return _objectSpread(_objectSpread({}, viewBox), {}, {
			value: point.value,
			payload: point.payload,
			parentViewBox: void 0,
			viewBox,
			fill: void 0
		});
	});
	return /*#__PURE__*/ import_react.createElement(CartesianLabelListContextProvider, { value: showLabels ? labelListEntries : void 0 }, children);
}
function StaticArea(_ref4) {
	var points = _ref4.points, baseLine = _ref4.baseLine, needClip = _ref4.needClip, clipPathId = _ref4.clipPathId, props = _ref4.props, animationElapsedTime = _ref4.animationElapsedTime, isAnimating = _ref4.isAnimating, isEntrance = _ref4.isEntrance;
	var layout = props.layout, type = props.type, stroke = props.stroke, connectNulls = props.connectNulls, isRange = props.isRange, shape = props.shape;
	var id = props.id, propsWithoutId = _objectWithoutProperties(props, _excluded);
	var curveProps = _objectSpread(_objectSpread({}, svgPropertiesAndEvents(propsWithoutId)), {}, {
		id,
		points,
		connectNulls,
		type,
		baseLine,
		layout,
		stroke,
		isRange,
		animationElapsedTime,
		isAnimating,
		isEntrance
	});
	return /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, (points === null || points === void 0 ? void 0 : points.length) > 1 && /*#__PURE__*/ import_react.createElement(Layer, { clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : void 0 }, /*#__PURE__*/ import_react.createElement(Shape, {
		option: shape,
		DefaultShape: defaultAreaProps.shape,
		shapeProps: curveProps
	})), /*#__PURE__*/ import_react.createElement(AreaDotsWrapper, {
		points,
		props: propsWithoutId,
		clipPathId
	}));
}
function interpolateScalarBaseLine(baseLine, prevBaseLine, animationElapsedTime) {
	if (isNumber(baseLine)) {
		var previousNumberBaseLine = isNumber(prevBaseLine) ? prevBaseLine : void 0;
		return interpolate(previousNumberBaseLine, baseLine, animationElapsedTime);
	}
	if (isNullish(baseLine) || isNan(baseLine)) {
		var _previousNumberBaseLine = isNumber(prevBaseLine) ? prevBaseLine : void 0;
		return interpolate(_previousNumberBaseLine, 0, animationElapsedTime);
	}
	return baseLine;
}
function AreaWithAnimation(_ref5) {
	var needClip = _ref5.needClip, clipPathId = _ref5.clipPathId, props = _ref5.props, previousPointsRef = _ref5.previousPointsRef, previousBaselineRef = _ref5.previousBaselineRef;
	var points = props.points, baseLine = props.baseLine, isAnimationActive = props.isAnimationActive, animationBegin = props.animationBegin, animationDuration = props.animationDuration, animationEasing = props.animationEasing, animationMatchBy = props.animationMatchBy, animationInterpolateFn = props.animationInterpolateFn;
	var animationInput = (0, import_react.useMemo)(() => ({
		points,
		baseLine
	}), [points, baseLine]);
	var baseLineAnimationState = useAnimationStartSnapshot(animationInput, previousBaselineRef);
	var layout = useCartesianChartLayout();
	var _useAnimationCallback = useAnimationCallbacks(props.onAnimationStart, props.onAnimationEnd), isAnimating = _useAnimationCallback.isAnimating, handleAnimationStart = _useAnimationCallback.handleAnimationStart, handleAnimationEnd = _useAnimationCallback.handleAnimationEnd;
	var prevBaseLine = baseLineAnimationState.startValue;
	if (layout == null) return null;
	var baseLineAnimationItems;
	if (Array.isArray(baseLine) && Array.isArray(prevBaseLine)) baseLineAnimationItems = matchAnimationItems(prevBaseLine, baseLine, animationMatchBy);
	else if (Array.isArray(baseLine)) baseLineAnimationItems = matchAnimationItems(null, baseLine, animationMatchBy);
	else baseLineAnimationItems = null;
	return /*#__PURE__*/ import_react.createElement(AnimatedItems, {
		animationInput,
		animationIdPrefix: "recharts-area-",
		items: points,
		previousItemsRef: previousPointsRef,
		isAnimationActive,
		animationBegin,
		animationDuration,
		animationEasing,
		onAnimationStart: handleAnimationStart,
		onAnimationEnd: handleAnimationEnd,
		animationInterpolateFn,
		animationMatchBy,
		layout
	}, (stepPoints, animationElapsedTime, isEntrance) => {
		var stepBaseLine;
		if (animationElapsedTime === 1) stepBaseLine = baseLine;
		else if (Array.isArray(baseLine)) stepBaseLine = animationInterpolateFn(baseLineAnimationItems, animationElapsedTime, layout);
		else stepBaseLine = isEntrance ? baseLine : interpolateScalarBaseLine(baseLine, prevBaseLine, animationElapsedTime);
		baseLineAnimationState.syncStepValue(stepBaseLine, animationElapsedTime);
		return /*#__PURE__*/ import_react.createElement(AreaLabelListProvider, {
			showLabels: !isAnimating,
			points
		}, props.children, /*#__PURE__*/ import_react.createElement(StaticArea, {
			points: stepPoints,
			baseLine: stepBaseLine,
			needClip,
			clipPathId,
			props,
			animationElapsedTime,
			isAnimating: isAnimating || animationElapsedTime < 1,
			isEntrance
		}), /*#__PURE__*/ import_react.createElement(LabelListFromLabelProp, { label: props.label }));
	});
}
function RenderArea(_ref6) {
	var needClip = _ref6.needClip, clipPathId = _ref6.clipPathId, props = _ref6.props;
	var previousPointsRef = (0, import_react.useRef)(null);
	var previousBaselineRef = (0, import_react.useRef)();
	return /*#__PURE__*/ import_react.createElement(AreaWithAnimation, {
		needClip,
		clipPathId,
		props,
		previousPointsRef,
		previousBaselineRef
	});
}
var AreaWithState = class extends import_react.PureComponent {
	render() {
		var _this$props = this.props, hide = _this$props.hide, dot = _this$props.dot, points = _this$props.points, className = _this$props.className, top = _this$props.top, left = _this$props.left, needClip = _this$props.needClip, xAxisId = _this$props.xAxisId, yAxisId = _this$props.yAxisId, width = _this$props.width, height = _this$props.height, id = _this$props.id, baseLine = _this$props.baseLine, zIndex = _this$props.zIndex;
		if (hide) return null;
		var layerClass = clsx("recharts-area", className);
		var clipPathId = id;
		var _getRadiusAndStrokeWi = getRadiusAndStrokeWidthFromDot(dot), r = _getRadiusAndStrokeWi.r, strokeWidth = _getRadiusAndStrokeWi.strokeWidth;
		var clipDot = isClipDot(dot);
		var dotSize = r * 2 + strokeWidth;
		var activePointsClipPath = needClip ? "url(#clipPath-".concat(clipDot ? "" : "dots-").concat(clipPathId, ")") : void 0;
		return /*#__PURE__*/ import_react.createElement(ZIndexLayer, { zIndex }, /*#__PURE__*/ import_react.createElement(Layer, { className: layerClass }, needClip && /*#__PURE__*/ import_react.createElement("defs", null, /*#__PURE__*/ import_react.createElement(GraphicalItemClipPath, {
			clipPathId,
			xAxisId,
			yAxisId
		}), !clipDot && /*#__PURE__*/ import_react.createElement("clipPath", { id: "clipPath-dots-".concat(clipPathId) }, /*#__PURE__*/ import_react.createElement("rect", {
			x: left - dotSize / 2,
			y: top - dotSize / 2,
			width: width + dotSize,
			height: height + dotSize
		}))), /*#__PURE__*/ import_react.createElement(RenderArea, {
			needClip,
			clipPathId,
			props: this.props
		})), /*#__PURE__*/ import_react.createElement(ActivePoints, {
			points,
			mainColor: getLegendItemColor(this.props.stroke, this.props.fill),
			itemDataKey: this.props.dataKey,
			activeDot: this.props.activeDot,
			clipPath: activePointsClipPath
		}), this.props.isRange && Array.isArray(baseLine) && /*#__PURE__*/ import_react.createElement(ActivePoints, {
			points: baseLine,
			mainColor: getLegendItemColor(this.props.stroke, this.props.fill),
			itemDataKey: this.props.dataKey,
			activeDot: this.props.activeDot,
			clipPath: activePointsClipPath
		}));
	}
};
function AreaImpl(props) {
	var _useAppSelector;
	var activeDot = props.activeDot, animationBegin = props.animationBegin, animationDuration = props.animationDuration, animationEasing = props.animationEasing, connectNulls = props.connectNulls, dot = props.dot, fill = props.fill, fillOpacity = props.fillOpacity, hide = props.hide, isAnimationActive = props.isAnimationActive, legendType = props.legendType, stroke = props.stroke, xAxisId = props.xAxisId, yAxisId = props.yAxisId, everythingElse = _objectWithoutProperties(props, _excluded2);
	var layout = useChartLayout();
	var chartName = useChartName();
	var needClip = useNeedsClip(xAxisId, yAxisId).needClip;
	var isPanorama = useIsPanorama();
	var _ref7 = (_useAppSelector = useAppSelector((state) => selectArea(state, props.id, isPanorama))) !== null && _useAppSelector !== void 0 ? _useAppSelector : {}, points = _ref7.points, isRange = _ref7.isRange, baseLine = _ref7.baseLine;
	var plotArea = usePlotArea();
	if (layout !== "horizontal" && layout !== "vertical" || plotArea == null) return null;
	if (chartName !== "AreaChart" && chartName !== "ComposedChart") return null;
	var height = plotArea.height, width = plotArea.width, left = plotArea.x, top = plotArea.y;
	if (!points || !points.length) return null;
	return /*#__PURE__*/ import_react.createElement(AreaWithState, _extends({}, everythingElse, {
		activeDot,
		animationBegin,
		animationDuration,
		animationEasing,
		baseLine,
		connectNulls,
		dot,
		fill,
		fillOpacity,
		height,
		hide,
		layout,
		isAnimationActive,
		isRange,
		legendType,
		needClip,
		points,
		stroke,
		width,
		left,
		top,
		xAxisId,
		yAxisId
	}));
}
var getBaseValue = (layout, chartBaseValue, itemBaseValue, xAxis, yAxis) => {
	var baseValue = itemBaseValue !== null && itemBaseValue !== void 0 ? itemBaseValue : chartBaseValue;
	if (isNumber(baseValue)) return baseValue;
	var numericAxis = layout === "horizontal" ? yAxis : xAxis;
	var domain = numericAxis.scale.domain();
	if (numericAxis.type === "number") {
		var domainMax = Math.max(domain[0], domain[1]);
		var domainMin = Math.min(domain[0], domain[1]);
		if (baseValue === "dataMin") return domainMin;
		if (baseValue === "dataMax") return domainMax;
		return domainMax < 0 ? domainMax : Math.max(Math.min(domain[0], domain[1]), 0);
	}
	if (baseValue === "dataMin") return domain[0];
	if (baseValue === "dataMax") return domain[1];
	return domain[0];
};
function computeArea(_ref8) {
	var _ref8$areaSettings = _ref8.areaSettings, connectNulls = _ref8$areaSettings.connectNulls, itemBaseValue = _ref8$areaSettings.baseValue, dataKey = _ref8$areaSettings.dataKey, stackedData = _ref8.stackedData, layout = _ref8.layout, chartBaseValue = _ref8.chartBaseValue, xAxis = _ref8.xAxis, yAxis = _ref8.yAxis, displayedData = _ref8.displayedData, dataStartIndex = _ref8.dataStartIndex, xAxisTicks = _ref8.xAxisTicks, yAxisTicks = _ref8.yAxisTicks, bandSize = _ref8.bandSize, stackDataKeys = _ref8.stackDataKeys;
	var hasStack = stackedData && stackedData.length;
	var baseValue = getBaseValue(layout, chartBaseValue, itemBaseValue, xAxis, yAxis);
	var isHorizontalLayout = layout === "horizontal";
	var isRange = false;
	var points = displayedData.map((entry, index) => {
		var _valueAsArray$, _valueAsArray, _xAxis$scale$map;
		var valueAsArray;
		if (hasStack) valueAsArray = stackedData[dataStartIndex + index];
		else {
			var _rawValue = getValueByDataKey(entry, dataKey);
			if (!Array.isArray(_rawValue)) valueAsArray = [baseValue, _rawValue];
			else {
				valueAsArray = _rawValue;
				isRange = true;
			}
		}
		var value1 = (_valueAsArray$ = (_valueAsArray = valueAsArray) === null || _valueAsArray === void 0 ? void 0 : _valueAsArray[1]) !== null && _valueAsArray$ !== void 0 ? _valueAsArray$ : null;
		var rawValue = getValueByDataKey(entry, dataKey);
		var wholeStackIsNull = hasStack && rawValue == null && stackDataKeys != null && stackDataKeys.length > 0 && stackDataKeys.every((key) => getValueByDataKey(entry, key) == null);
		var isBreakPoint = value1 == null || hasStack && !connectNulls && rawValue == null || wholeStackIsNull;
		if (isHorizontalLayout) {
			var _yAxis$scale$map;
			return {
				x: getCateCoordinateOfLine({
					axis: xAxis,
					ticks: xAxisTicks,
					bandSize,
					entry,
					index
				}),
				y: isBreakPoint ? null : (_yAxis$scale$map = yAxis.scale.map(value1)) !== null && _yAxis$scale$map !== void 0 ? _yAxis$scale$map : null,
				value: valueAsArray,
				payload: entry
			};
		}
		return {
			x: isBreakPoint ? null : (_xAxis$scale$map = xAxis.scale.map(value1)) !== null && _xAxis$scale$map !== void 0 ? _xAxis$scale$map : null,
			y: getCateCoordinateOfLine({
				axis: yAxis,
				ticks: yAxisTicks,
				bandSize,
				entry,
				index
			}),
			value: valueAsArray,
			payload: entry
		};
	});
	var baseLine;
	if (hasStack || isRange) baseLine = points.map((entry) => {
		var _xAxis$scale$map2;
		var x = Array.isArray(entry.value) ? entry.value[0] : null;
		if (isHorizontalLayout) {
			var _yAxis$scale$map2;
			return {
				x: entry.x,
				y: x != null && entry.y != null ? (_yAxis$scale$map2 = yAxis.scale.map(x)) !== null && _yAxis$scale$map2 !== void 0 ? _yAxis$scale$map2 : null : null,
				payload: entry.payload
			};
		}
		return {
			x: x != null ? (_xAxis$scale$map2 = xAxis.scale.map(x)) !== null && _xAxis$scale$map2 !== void 0 ? _xAxis$scale$map2 : null : null,
			y: entry.y,
			payload: entry.payload
		};
	});
	else baseLine = isHorizontalLayout ? yAxis.scale.map(baseValue) : xAxis.scale.map(baseValue);
	return {
		points,
		baseLine: baseLine !== null && baseLine !== void 0 ? baseLine : 0,
		isRange
	};
}
function AreaFn(outsideProps) {
	var props = resolveDefaultProps(outsideProps, defaultAreaProps);
	var isPanorama = useIsPanorama();
	return /*#__PURE__*/ import_react.createElement(RegisterGraphicalItemId, {
		id: props.id,
		type: "area"
	}, (id) => /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, /*#__PURE__*/ import_react.createElement(SetLegendPayload, { legendPayload: computeLegendPayloadFromAreaData(props) }), /*#__PURE__*/ import_react.createElement(SetAreaTooltipEntrySettings, {
		dataKey: props.dataKey,
		data: props.data,
		stroke: props.stroke,
		strokeWidth: props.strokeWidth,
		fill: props.fill,
		name: props.name,
		hide: props.hide,
		unit: props.unit,
		formatter: props.formatter,
		tooltipType: props.tooltipType,
		id
	}), /*#__PURE__*/ import_react.createElement(SetCartesianGraphicalItem, {
		type: "area",
		id,
		data: props.data,
		dataKey: props.dataKey,
		xAxisId: props.xAxisId,
		yAxisId: props.yAxisId,
		zAxisId: 0,
		stackId: getNormalizedStackId(props.stackId),
		hide: props.hide,
		barSize: void 0,
		baseValue: props.baseValue,
		isPanorama,
		connectNulls: props.connectNulls
	}), /*#__PURE__*/ import_react.createElement(AreaImpl, _extends({}, props, { id }))));
}
/**
* @provides LabelListContext
* @consumes CartesianChartContext
*/
var Area = /*#__PURE__*/ import_react.memo(AreaFn, propsAreEqual);
Area.displayName = "Area";
// node_modules/recharts/es6/chart/ComposedChart.js
var allowedTooltipTypes = ["axis"];
/**
* @consumes ResponsiveContainerContext
* @provides CartesianViewBoxContext
* @provides CartesianChartContext
*/
var ComposedChart = /*#__PURE__*/ (0, import_react.forwardRef)((props, ref) => {
	return /*#__PURE__*/ import_react.createElement(CartesianChart, {
		chartName: "ComposedChart",
		defaultTooltipEventType: "axis",
		validateTooltipEventTypes: allowedTooltipTypes,
		tooltipPayloadSearcher: arrayTooltipSearcher,
		categoricalChartProps: props,
		ref
	});
});
// src/components/ui/ScrambleText.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var import_jsx_runtime = require_jsx_runtime();
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
	const { transactions, expenses, products, settings, exchangeRates, setActiveTab } = usePOS();
	const t = getTranslation(settings.language);
	const isAr = settings.language === "ar";
	const [selectedTxn, setSelectedTxn] = (0, import_react.useState)(null);
	const [rangeDays, setRangeDays] = (0, import_react.useState)(7);
	const [showCollectedCurve, setShowCollectedCurve] = (0, import_react.useState)(true);
	const [chartVisualMode, setChartVisualMode] = (0, import_react.useState)("area");
	const [activePointKey, setActivePointKey] = (0, import_react.useState)(null);
	const todayMetrics = (0, import_react.useMemo)(() => {
		const today = (/* @__PURE__ */ new Date()).toDateString();
		const todayTxns = transactions.filter((tx) => new Date(tx.timestamp).toDateString() === today && tx.status === "completed");
		const todayGross = todayTxns.reduce((acc, curr) => {
			return acc + getConvertedTransactionView(curr, settings.currency, exchangeRates, "historical").grandTotal;
		}, 0);
		const lowStockCount = products.filter((p) => p.stock <= p.minStockAlert).length;
		const expSummary = computeExpensesSummary(expenses || [], settings.currency, exchangeRates, "historical");
		return {
			salesTotal: Math.round(todayGross * 100) / 100,
			txCount: todayTxns.length,
			todayExpenses: expSummary.todayExpenses,
			totalExpenses: expSummary.totalExpenses,
			totalProducts: products.length,
			lowStockCount,
			recentTxns: transactions.slice(0, 5)
		};
	}, [
		transactions,
		expenses,
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
	const rechartsData = (0, import_react.useMemo)(() => {
		return trendSummary.points.map((pt) => ({
			...pt,
			name: pt.label,
			grossRevenue: Math.round(pt.revenue * 100) / 100,
			collectedCash: Math.round(pt.collected * 100) / 100,
			remainingDebt: Math.round(pt.debt * 100) / 100
		}));
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
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						variant: "secondary",
						size: "md",
						onClick: () => setActiveTab("expenses"),
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-4 h-4 text-rose-400" }),
						children: isAr ? "بند المنصرفات" : "Expenses"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TactileButton, {
						variant: "amber",
						size: "md",
						onClick: () => setActiveTab("checkout"),
						leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "w-4 h-4" }),
						children: t.newSale
					})]
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
								children: isAr ? "الأداء اليومي للمبيعات واتجاهات الإيرادات (Recharts)" : "Daily Sales Performance & Revenue Trends"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-neutral-400",
								children: isAr ? `رسم بياني تفاعلي للمبيعات اليومية (${settings.currency}) محسوباً بسعر الصرف المحفوظ لكل فاتورة` : `Interactive Recharts daily sales & revenue trajectory (${settings.currency}) valued at each invoice's saved exchange rate`
							})] })]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center rounded-xl bg-neutral-950 p-1 border border-neutral-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"data-testid": "chart-mode-area-btn",
										onClick: () => setChartVisualMode("area"),
										className: `px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${chartVisualMode === "area" ? "bg-emerald-500 text-neutral-950 shadow-sm" : "text-neutral-400 hover:text-white"}`,
										children: isAr ? "منحنى مساحي" : "Area Trend"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"data-testid": "chart-mode-composed-btn",
										onClick: () => setChartVisualMode("composed"),
										className: `px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${chartVisualMode === "composed" ? "bg-emerald-500 text-neutral-950 shadow-sm" : "text-neutral-400 hover:text-white"}`,
										children: isAr ? "أعمدة + اتجاه" : "Bars + Line"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "toggle-collected-curve-btn",
									onClick: () => setShowCollectedCurve((prev) => !prev),
									className: `px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${showCollectedCurve ? "bg-sky-950/60 border-sky-500/40 text-sky-300" : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2 h-2 rounded-full ${showCollectedCurve ? "bg-sky-400" : "bg-neutral-600"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "المبيعات المحصلة" : "Collected Cash" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
								})
							]
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
						"data-testid": "recharts-daily-sales-container",
						className: "relative rounded-2xl bg-neutral-950/90 border border-neutral-800/90 p-3 sm:p-4 overflow-hidden h-[270px] w-full",
						dir: "ltr",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
								data: rechartsData,
								margin: {
									top: 16,
									right: 16,
									left: 4,
									bottom: 6
								},
								onClick: (state) => {
									const clickedKey = state?.activePayload?.[0]?.payload?.dateKey;
									if (clickedKey) setActivePointKey(clickedKey);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "rechartsRevenueAreaGrad",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "5%",
											stopColor: "#10b981",
											stopOpacity: .42
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "95%",
											stopColor: "#10b981",
											stopOpacity: 0
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "rechartsBarGrad",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "#10b981",
											stopOpacity: .85
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "#059669",
											stopOpacity: .35
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "#262626",
										strokeDasharray: "4 4",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "label",
										stroke: "#737373",
										tick: {
											fill: "#a3a3a3",
											fontSize: 11,
											fontWeight: 600
										},
										tickLine: false,
										axisLine: { stroke: "#262626" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "#737373",
										tick: {
											fill: "#737373",
											fontSize: 11,
											fontWeight: 600
										},
										tickLine: false,
										axisLine: false,
										tickFormatter: (val) => val >= 1e3 ? `${(val / 1e3).toFixed(1)}k` : String(Math.round(val))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: {
											stroke: "#10b981",
											strokeWidth: 1,
											strokeDasharray: "4 4"
										},
										content: ({ active, payload }) => {
											if (!active || !payload || !payload.length) return null;
											const pt = payload[0].payload;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												dir: isAr ? "rtl" : "ltr",
												className: "rounded-xl bg-neutral-900/95 border border-neutral-700 px-3.5 py-2.5 shadow-xl text-xs space-y-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between gap-4 border-b border-neutral-800 pb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-extrabold text-white",
															children: [
																pt.weekdayLabel,
																" • ",
																pt.label
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-mono text-[10px] text-amber-400 font-bold",
															children: [
																pt.transactionCount,
																" ",
																isAr ? "فواتير" : "orders"
															]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between gap-4",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-neutral-400",
															children: isAr ? "إجمالي المبيعات:" : "Gross Sales:"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-extrabold text-emerald-400 tabular-nums",
															children: formatCurrency(pt.revenue, settings.currency, settings.language)
														})]
													}),
													showCollectedCurve && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between gap-4",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-neutral-400",
															children: isAr ? "المحصل نقداً/بنكياً:" : "Collected:"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-sky-400 tabular-nums",
															children: formatCurrency(pt.collected, settings.currency, settings.language)
														})]
													}),
													pt.debt > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between gap-4",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-neutral-400",
															children: isAr ? "آجل / ذمم:" : "Remaining Debt:"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-amber-400 tabular-nums",
															children: formatCurrency(pt.debt, settings.currency, settings.language)
														})]
													})
												]
											});
										}
									}),
									trendSummary.averageDailyRevenue > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
										y: trendSummary.averageDailyRevenue,
										stroke: "#f59e0b",
										strokeDasharray: "6 4",
										strokeOpacity: .65
									}),
									chartVisualMode === "area" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "grossRevenue",
										name: isAr ? "إجمالي المبيعات" : "Gross Revenue",
										stroke: "#10b981",
										strokeWidth: 3,
										fillOpacity: 1,
										fill: "url(#rechartsRevenueAreaGrad)",
										activeDot: {
											r: 6,
											fill: "#f59e0b",
											stroke: "#fef3c7",
											strokeWidth: 2,
											onClick: (_e, dotPayload) => {
												if (dotPayload?.payload?.dateKey) setActivePointKey(dotPayload.payload.dateKey);
											}
										}
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "grossRevenue",
										name: isAr ? "إجمالي المبيعات" : "Gross Revenue",
										fill: "url(#rechartsBarGrad)",
										radius: [
											6,
											6,
											0,
											0
										],
										maxBarSize: 36
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "grossRevenue",
										stroke: "#f59e0b",
										strokeWidth: 2.5,
										dot: {
											r: 3.5,
											fill: "#f59e0b"
										}
									})] }),
									showCollectedCurve && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "collectedCash",
										name: isAr ? "المبيعات المحصلة" : "Collected Cash",
										stroke: "#38bdf8",
										strokeWidth: 2,
										strokeDasharray: "5 3",
										dot: {
											r: 3,
											fill: "#0284c7",
											stroke: "#bae6fd",
											strokeWidth: 1.5
										}
									})
								]
							})
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
				className: "grid grid-cols-2 sm:grid-cols-5 gap-3",
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
						onClick: () => setActiveTab("expenses"),
						className: "flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-rose-500/40 text-left transition-all active:scale-[0.98] group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-bold text-white block",
							children: isAr ? "المنصرفات" : "Expenses"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-rose-400 font-mono",
							children: formatCurrency(todayMetrics.todayExpenses, settings.currency, settings.language)
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
