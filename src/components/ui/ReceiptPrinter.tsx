/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react";
import React, {
  type ComponentPropsWithoutRef,
  createContext,
  type ReactNode,
  useContext,
} from "react";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export type ReceiptPrinterStage = "processing" | "printing" | "complete";
export type ReceiptFeedMotion = "smooth" | "stepped";

export type ReceiptPrinterRootProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  /** Disables all stage transitions when false. */
  animate?: boolean;
  children: ReactNode;
  /** Controls whether the paper feeds continuously or one line at a time. */
  feedMotion?: ReceiptFeedMotion;
  /** Current state of the printer. */
  stage: ReceiptPrinterStage;
};

export type ReceiptPrinterMachineProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterHeaderProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterScreenProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterOutputProps = ComponentPropsWithoutRef<"div">;
export type ReceiptPrinterPaperProps = HTMLMotionProps<"article">;

export type ReceiptPrinterStatusProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Custom status content. Defaults to a label derived from the current stage. */
  children?: ReactNode;
};

type ReceiptPrinterContextValue = {
  animate: boolean;
  feedMotion: ReceiptFeedMotion;
  shouldMove: boolean;
  stage: ReceiptPrinterStage;
};

const ReceiptPrinterContext = createContext<ReceiptPrinterContextValue | null>(
  null,
);

const easeOut = [0.23, 1, 0.32, 1] as const;
const easeInOut = [0.77, 0, 0.175, 1] as const;

const receiptToothCount = 40;
const receiptToothDepth = 4;
const receiptToothPoints = Array.from(
  { length: receiptToothCount * 2 },
  (_, index) => {
    const x = 100 - ((index + 1) * 100) / (receiptToothCount * 2);
    const y = index % 2 === 0 ? "100%" : `calc(100% - ${receiptToothDepth}px)`;

    return `${x}% ${y}`;
  },
).join(", ");
export const receiptClipPath = `polygon(0 0, 100% 0, 100% calc(100% - ${receiptToothDepth}px), ${receiptToothPoints})`;

export const printingTransformKeyframes = [
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
  "translateY(0%)",
];

export const printingKeyframeTimes = [
  0, 0.075, 0.105, 0.18, 0.21, 0.285, 0.315, 0.39, 0.42, 0.495, 0.525, 0.6,
  0.63, 0.705, 0.735, 0.81, 0.84, 0.915, 0.945, 1,
];

const PLASTIC_NOISE_DATA_URI =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.22'/%3E%3C/svg%3E";

function useReceiptPrinterContext(componentName: string) {
  const context = useContext(ReceiptPrinterContext);

  if (!context) {
    throw new Error(
      `${componentName} must be used within ReceiptPrinter.Root.`,
    );
  }

  return context;
}

function getDefaultStatusLabel(stage: ReceiptPrinterStage) {
  if (stage === "processing") {
    return "Processing transaction";
  }

  if (stage === "printing") {
    return "Printing receipt";
  }

  return "Receipt printed";
}

function Root({
  animate = true,
  children,
  className,
  feedMotion = "stepped",
  stage,
  style,
  ...props
}: ReceiptPrinterRootProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const shouldMove = animate && !prefersReducedMotion;

  return (
    <ReceiptPrinterContext.Provider
      value={{
        animate,
        feedMotion,
        shouldMove,
        stage,
      }}
    >
      <section
        className={cn(
          "[--printer-inner-radius:calc(var(--printer-radius)-var(--printer-inset))] [--printer-inset:8px] [--printer-radius:20px] flex w-full flex-col items-center",
          className,
        )}
        style={style}
        {...props}
      >
        {children}
      </section>
    </ReceiptPrinterContext.Provider>
  );
}

function Machine({
  children,
  className,
  style,
  ...props
}: ReceiptPrinterMachineProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[var(--printer-radius)] border border-neutral-700/80 bg-neutral-900 p-[var(--printer-inset)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.45),0_18px_36px_-18px_rgba(0,0,0,0.65)]",
        className,
      )}
      style={style}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-repeat opacity-15 mix-blend-overlay"
        style={{
          backgroundImage: `url("${PLASTIC_NOISE_DATA_URI}")`,
          backgroundSize: "160px 160px",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function Header({
  children,
  className,
  style,
  ...props
}: ReceiptPrinterHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-1 pb-2 text-neutral-100",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

function Screen({
  children,
  className,
  style,
  ...props
}: ReceiptPrinterScreenProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--printer-inner-radius)] border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-neutral-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_12px_20px_rgba(0,0,0,0.45)]",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

function Status({
  children,
  className,
  style,
  ...props
}: ReceiptPrinterStatusProps) {
  const { shouldMove, stage } = useReceiptPrinterContext(
    "ReceiptPrinter.Status",
  );
  const label = children ?? getDefaultStatusLabel(stage);

  return (
    <div
      aria-live="polite"
      className={cn("min-h-4 flex items-center text-xs text-neutral-200", className)}
      role="status"
      style={style}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex size-4 items-center justify-center">
          <AnimatePresence initial={false} mode="wait">
            {stage === "complete" ? (
              <motion.span
                key="complete"
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center justify-center text-emerald-400"
                exit={{ opacity: 0, scale: 0.85 }}
                initial={
                  shouldMove ? { opacity: 0, scale: 0.85 } : { opacity: 1 }
                }
                transition={
                  shouldMove
                    ? { duration: 0.18, ease: easeOut }
                    : { duration: 0 }
                }
              >
                <CheckCircle2 aria-hidden="true" className="size-3.5" />
              </motion.span>
            ) : (
              <motion.span
                key="busy"
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center justify-center text-amber-400"
                exit={{ opacity: 0, scale: 0.85 }}
                initial={
                  shouldMove ? { opacity: 0, scale: 0.85 } : { opacity: 1 }
                }
                transition={
                  shouldMove
                    ? { duration: 0.18, ease: easeOut }
                    : { duration: 0 }
                }
              >
                <Loader2
                  aria-hidden="true"
                  className={cn("size-3.5", shouldMove && "animate-spin")}
                />
              </motion.span>
            )}
          </AnimatePresence>
        </span>

        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={stage}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(2px)" }}
            initial={
              shouldMove
                ? { opacity: 0, filter: "blur(2px)" }
                : { opacity: 1, filter: "blur(0px)" }
            }
            transition={
              shouldMove ? { duration: 0.2, ease: easeInOut } : { duration: 0 }
            }
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Output({
  children,
  className,
  style,
  ...props
}: ReceiptPrinterOutputProps) {
  return (
    <div
      className={cn(
        "relative mt-2 pt-1.5 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-2.5 before:rounded-full before:bg-neutral-950 before:shadow-[inset_0_2px_4px_rgba(0,0,0,0.85),0_1px_0_rgba(255,255,255,0.08)]",
        className,
      )}
      style={style}
      {...props}
    >
      <div className="relative z-10 overflow-hidden px-1.5 pb-2 pt-0.5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-1.5 top-0 z-20 h-4 bg-gradient-to-b from-neutral-950/75 via-neutral-950/25 to-transparent"
        />
        {children}
      </div>
    </div>
  );
}

function Paper({
  children,
  className,
  style,
  ...props
}: ReceiptPrinterPaperProps) {
  const { feedMotion, shouldMove, stage } = useReceiptPrinterContext(
    "ReceiptPrinter.Paper",
  );

  const isPrinting = stage === "printing";
  const isVisible = stage === "printing" || stage === "complete";

  const getTransformAnimation = () => {
    if (!isVisible) {
      return "translateY(calc(-100% + 2px))";
    }

    if (isPrinting && shouldMove && feedMotion === "stepped") {
      return printingTransformKeyframes;
    }

    return "translateY(0%)";
  };

  const getTransition = () => {
    if (!shouldMove) {
      return { duration: 0 };
    }

    if (isPrinting && feedMotion === "stepped") {
      return {
        duration: 1.75,
        ease: "linear" as const,
        times: printingKeyframeTimes,
      };
    }

    if (isPrinting && feedMotion === "smooth") {
      return {
        duration: 1.35,
        ease: easeOut,
      };
    }

    return {
      duration: 0.35,
      ease: easeOut,
    };
  };

  return (
    <motion.article
      animate={{
        transform: getTransformAnimation(),
      }}
      className={cn(
        "relative w-full origin-top bg-[#faf9f5] px-4 pb-6 pt-4 font-mono text-xs text-neutral-900 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.55)] will-change-transform print:transform-none print:shadow-none",
        className,
      )}
      initial={
        shouldMove
          ? { transform: "translateY(calc(-100% + 2px))" }
          : { transform: isVisible ? "translateY(0%)" : "translateY(calc(-100% + 2px))" }
      }
      style={{
        clipPath: receiptClipPath,
        ...style,
      }}
      transition={getTransition()}
      {...props}
    >
      {children}
    </motion.article>
  );
}

export const ReceiptPrinter = {
  Root,
  Machine,
  Header,
  Screen,
  Status,
  Output,
  Paper,
};
