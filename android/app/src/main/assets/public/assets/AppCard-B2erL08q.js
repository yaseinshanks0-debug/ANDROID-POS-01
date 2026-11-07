import "./rolldown-runtime-DQp2zzRu.js";
import { sn as require_react } from "./vendor-icons-DoijI_tq.js";
import { i as require_jsx_runtime } from "./vendor-motion-CekIsQM-.js";
require_react();
var import_jsx_runtime = require_jsx_runtime();
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var AppCard = ({ children, className = "", variant = "surface", padding = "md", isInteractive = false, ...props }) => {
	const variantStyles = {
		surface: "bg-neutral-900/90 border border-neutral-800/80 shadow-sm",
		elevated: "bg-neutral-900 border border-neutral-750 shadow-md shadow-black/20",
		sunken: "bg-neutral-950/80 border border-neutral-850 shadow-inner",
		borderless: "bg-neutral-900/50"
	}[variant];
	const paddingStyles = {
		none: "p-0",
		sm: "p-3",
		md: "p-4 sm:p-5",
		lg: "p-6"
	}[padding];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `rounded-2xl backdrop-blur-sm ${variantStyles} ${paddingStyles} ${isInteractive ? "hover:border-neutral-700 active:scale-[0.99] transition-all cursor-pointer" : ""} ${className}`,
		...props,
		children
	});
};
export { AppCard as t };
