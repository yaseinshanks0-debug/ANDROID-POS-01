/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useId } from 'react';

export const DQNAMO_ICON_VARIANTS = {
  DARK: 'dark',
  LIGHT: 'light',
  MONOCHROME: 'monochrome',
} as const;

export type DqnamoIconVariant =
  (typeof DQNAMO_ICON_VARIANTS)[keyof typeof DQNAMO_ICON_VARIANTS];

export interface DqnamoBrandIconProps {
  variant?: DqnamoIconVariant;
  showBackground?: boolean;
  className?: string;
  title?: string;
}

/**
 * Geometric 'D' + minimalist retail checkout emblem for Dqnamo POS.
 * Matches the Material Design 3 Android adaptive icon vector drawables
 * (108x108 viewport with all foreground paths inside the 60dp optical keyline / 66dp safe zone).
 */
export const DqnamoBrandIcon: React.FC<DqnamoBrandIconProps> = ({
  variant = DQNAMO_ICON_VARIANTS.DARK,
  showBackground = true,
  className = 'w-9 h-9',
  title = 'D POS - Point of Sale',
}) => {
  const uid = useId().replace(/:/g, '');
  const bgId = `dq-bg-${uid}`;
  const amberId = `dq-amber-${uid}`;

  const isLight = variant === DQNAMO_ICON_VARIANTS.LIGHT;
  const isMono = variant === DQNAMO_ICON_VARIANTS.MONOCHROME;

  // Compact header badge crops to the 72x72 visible launcher area so the 'D' reads crisply at 32-36px
  const viewBox = showBackground ? '18 18 72 72' : '26 24 56 60';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={className}
      role="img"
      aria-label={title}
    >
      <defs>
        {showBackground && !isMono && (
          <radialGradient
            id={bgId}
            cx="50%"
            cy={isLight ? '46%' : '48%'}
            r={isLight ? '72%' : '66%'}
          >
            <stop offset="0%" stopColor={isLight ? '#FFFFFF' : '#161B29'} />
            <stop offset="64%" stopColor={isLight ? '#F8FAFC' : '#0D1018'} />
            <stop offset="100%" stopColor={isLight ? '#F1F5F9' : '#090A0F'} />
          </radialGradient>
        )}
        {!isMono && (
          <linearGradient
            id={amberId}
            x1="35"
            y1="33"
            x2="74"
            y2="75"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={isLight ? '#F59E0B' : '#FBBF24'} />
            <stop offset="54%" stopColor={isLight ? '#E68A00' : '#F59E0B'} />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        )}
      </defs>

      {showBackground && (
        <rect
          width="108"
          height="108"
          fill={isMono ? '#F4F4F5' : `url(#${bgId})`}
        />
      )}

      {isMono ? (
        <>
          <path
            d="M35,33 L53,33 A21,21 0 0,1 53,75 L35,75 Z M43.5,41.5 L43.5,66.5 L53,66.5 A12.5,12.5 0 0,0 53,41.5 Z"
            fill="currentColor"
            fillRule="evenodd"
          />
          <rect x="48.0" y="47.5" width="1.9" height="13.0" fill="currentColor" />
          <rect x="51.5" y="47.5" width="2.6" height="13.0" fill="currentColor" />
          <circle cx="59.3" cy="54" r="2.8" fill="currentColor" />
        </>
      ) : (
        <>
          <path
            d="M35,33 L53,33 A21,21 0 0,1 53,75 L35,75 L43.5,66.5 L53,66.5 A12.5,12.5 0 0,0 53,41.5 L43.5,41.5 Z"
            fill={`url(#${amberId})`}
          />
          <path
            d="M35,33 L43.5,41.5 L43.5,66.5 L35,75 Z"
            fill={isLight ? '#0F172A' : '#F8FAFC'}
          />
          <rect
            x="48.0"
            y="47.5"
            width="1.9"
            height="13.0"
            fill={isLight ? '#0F172A' : '#F8FAFC'}
          />
          <rect
            x="51.5"
            y="47.5"
            width="2.6"
            height="13.0"
            fill={isLight ? '#0F172A' : '#F8FAFC'}
          />
          {!isLight && (
            <circle cx="59.3" cy="54" r="4.6" fill="#10B981" fillOpacity="0.22" />
          )}
          <circle
            cx="59.3"
            cy="54"
            r="2.8"
            fill={isLight ? '#059669' : '#10B981'}
          />
        </>
      )}
    </svg>
  );
};
