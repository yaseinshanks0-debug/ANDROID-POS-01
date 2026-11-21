/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const INVITATION_STATUSES = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REVOKED: 'REVOKED',
  EXPIRED: 'EXPIRED',
} as const;

export type InvitationStatus =
  (typeof INVITATION_STATUSES)[keyof typeof INVITATION_STATUSES];

export const INVITE_TTL_HOURS = 48;
export const INVITE_TTL_MS = INVITE_TTL_HOURS * 60 * 60 * 1000;

/**
 * Unambiguous Crockford-style alphabet (excludes 0, O, 1, I, L)
 * so cashiers/managers can read and type short codes cleanly on Android.
 */
const SHORT_CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

export interface InviteSharePayloadInput {
  companyName: string;
  roleLabel: string;
  inviteUrl: string;
  shortCode: string;
  language: 'ar' | 'en';
}

export interface InviteSharePayload {
  message: string;
  whatsappUrl: string;
  mailtoUrl: string;
  subject: string;
}

export function normalizeEmail(raw: string): string {
  return String(raw || '').trim().toLowerCase();
}

export function isValidEmailFormat(raw: string): boolean {
  const email = normalizeEmail(raw);
  if (email.length < 5 || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export function maskEmail(raw: string): string {
  const email = normalizeEmail(raw);
  const atIndex = email.indexOf('@');
  if (atIndex <= 0) return '***';
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

export function normalizeShortCode(raw: string): string {
  const compact = String(raw || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

  const withoutPrefix = compact.startsWith('DQ') ? compact.slice(2) : compact;
  if (withoutPrefix.length === 6) {
    return `DQ-${withoutPrefix.slice(0, 4)}-${withoutPrefix.slice(4, 6)}`;
  }
  return String(raw || '').trim().toUpperCase();
}

export function isValidShortCode(raw: string): boolean {
  const normalized = normalizeShortCode(raw);
  return /^DQ-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{2}$/.test(
    normalized
  );
}

export function generateInviteShortCode(
  randomBytesFn?: (size: number) => Uint8Array
): string {
  const bytes = randomBytesFn
    ? randomBytesFn(6)
    : (() => {
        const arr = new Uint8Array(6);
        if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
          globalThis.crypto.getRandomValues(arr);
        } else {
          for (let i = 0; i < arr.length; i += 1) {
            arr[i] = Math.floor(Math.random() * 256);
          }
        }
        return arr;
      })();

  let chars = '';
  for (let i = 0; i < 6; i += 1) {
    chars += SHORT_CODE_ALPHABET[bytes[i] % SHORT_CODE_ALPHABET.length];
  }
  return `DQ-${chars.slice(0, 4)}-${chars.slice(4, 6)}`;
}

export function buildInviteSharePayload(
  params: InviteSharePayloadInput
): InviteSharePayload {
  const companyName = params.companyName.trim() || 'D POS - Point of Sale';
  const roleLabel = params.roleLabel.trim() || (params.language === 'ar' ? 'موظف' : 'Team Member');
  const shortCode = normalizeShortCode(params.shortCode);
  const inviteUrl = params.inviteUrl.trim();

  const subject =
    params.language === 'ar'
      ? `دعوة للانضمام إلى ${companyName} على D POS - Point of Sale`
      : `Invitation to join ${companyName} on D POS - Point of Sale`;

  const message =
    params.language === 'ar'
      ? [
          `تمت دعوتك للانضمام إلى شركة "${companyName}" على تطبيق D POS - Point of Sale بدور (${roleLabel}).`,
          `كود الدعوة: ${shortCode}`,
          `رابط الانضمام المباشر: ${inviteUrl}`,
          `افتح الرابط أو أدخل الكود داخل التطبيق ثم سجّل دخولك بنفس البريد الإلكتروني المدعو (الدعوة صالحة لمدة ${INVITE_TTL_HOURS} ساعة).`,
        ].join('\n')
      : [
          `You have been invited to join "${companyName}" on D POS - Point of Sale as (${roleLabel}).`,
          `Invite Code: ${shortCode}`,
          `Direct Invite Link: ${inviteUrl}`,
          `Open the link or enter the code inside the app using your invited email address (valid for ${INVITE_TTL_HOURS} hours).`,
        ].join('\n');

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  return {
    message,
    whatsappUrl,
    mailtoUrl,
    subject,
  };
}
