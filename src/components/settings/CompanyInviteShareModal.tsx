/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import {
  Check,
  Clock,
  Copy,
  Mail,
  MessageCircle,
  QrCode,
  Share2,
  X,
} from 'lucide-react';
import { buildInviteSharePayload } from '../../lib/invitation-utils';

export interface CompanyInviteShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteUrl: string;
  shortCode: string;
  invitedEmail: string;
  roleName: string;
  companyName: string;
  expiresAt: string;
  language: 'ar' | 'en';
}

export const CompanyInviteShareModal: React.FC<CompanyInviteShareModalProps> = ({
  isOpen,
  onClose,
  inviteUrl,
  shortCode,
  invitedEmail,
  roleName,
  companyName,
  expiresAt,
  language,
}) => {
  const isAr = language === 'ar';
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedTarget, setCopiedTarget] = useState<'url' | 'code' | 'message' | null>(null);

  const sharePayload = useMemo(
    () =>
      buildInviteSharePayload({
        companyName,
        roleLabel: roleName,
        inviteUrl,
        shortCode,
        language,
      }),
    [companyName, roleName, inviteUrl, shortCode, language]
  );

  useEffect(() => {
    if (!isOpen || !inviteUrl) {
      setQrDataUrl('');
      return;
    }
    let active = true;
    QRCode.toDataURL(inviteUrl, {
      width: 220,
      margin: 2,
      color: { dark: '#09090b', light: '#ffffff' },
    })
      .then((dataUrl) => {
        if (active) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (active) setQrDataUrl('');
      });
    return () => {
      active = false;
    };
  }, [isOpen, inviteUrl]);

  if (!isOpen) return null;

  const handleCopy = async (text: string, target: 'url' | 'code' | 'message') => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for restricted clipboard contexts
    }
    setCopiedTarget(target);
    setTimeout(() => setCopiedTarget(null), 2200);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: sharePayload.subject,
          text: sharePayload.message,
          url: inviteUrl,
        });
      } catch {
        // User dismissed share sheet
      }
    } else {
      await handleCopy(sharePayload.message, 'message');
    }
  };

  const formattedExpiry = (() => {
    try {
      return new Date(expiresAt).toLocaleString(isAr ? 'ar-EG' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return expiresAt;
    }
  })();

  return (
    <div
      data-testid="company-invite-share-modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="w-full max-w-md rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden my-auto">
        <div className="px-5 py-4 bg-gradient-to-b from-amber-500/15 to-transparent border-b border-neutral-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/35 flex items-center justify-center text-amber-400 shrink-0">
              <QrCode className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-white truncate">
                {isAr ? 'مشاركة دعوة الانضمام للشركة' : 'Share Staff Invitation'}
              </h3>
              <p className="text-[11px] text-neutral-400 truncate font-mono" dir="ltr">
                {invitedEmail}
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid="invite-share-close-btn"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Local On-Device QR Code */}
          <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
            {qrDataUrl ? (
              <div className="p-2.5 rounded-2xl bg-white shadow-lg">
                <img
                  src={qrDataUrl}
                  alt={isAr ? 'رمز QR لدعوة الموظف' : 'Staff invitation QR code'}
                  data-testid="invite-share-qr-img"
                  className="w-44 h-44 block"
                />
              </div>
            ) : (
              <div className="w-44 h-44 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs text-neutral-500">
                {isAr ? 'جاري توليد QR...' : 'Generating QR...'}
              </div>
            )}

            <div className="text-center space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {isAr ? 'كود الدعوة القصير' : 'Short Invite Code'}
              </span>
              <button
                type="button"
                data-testid="invite-share-short-code-btn"
                onClick={() => handleCopy(shortCode, 'code')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono text-lg font-black tracking-widest transition-colors"
              >
                <span dir="ltr">{shortCode}</span>
                {copiedTarget === 'code' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {isAr ? `صالح لمدة 48 ساعة (حتى ${formattedExpiry})` : `Valid for 48h (until ${formattedExpiry})`}
              </span>
            </div>
          </div>

          {/* Direct Invite Link */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-neutral-400">
              {isAr ? 'رابط الدعوة المباشر (يُستخدم مرة واحدة فقط)' : 'One-Time Invite Link'}
            </label>
            <div className="flex items-center gap-2" dir="ltr">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                data-testid="invite-share-url-input"
                className="flex-1 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 focus:outline-none"
              />
              <button
                type="button"
                data-testid="invite-share-copy-url-btn"
                onClick={() => handleCopy(inviteUrl, 'url')}
                className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copiedTarget === 'url' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isAr ? 'تم النسخ' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isAr ? 'نسخ' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* One-Tap Share Buttons (Zero external SMTP needed) */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={sharePayload.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="invite-share-whatsapp-link"
              className="py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 text-xs font-black inline-flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isAr ? 'إرسال عبر واتساب' : 'WhatsApp'}</span>
            </a>

            <a
              href={sharePayload.mailtoUrl}
              data-testid="invite-share-mailto-link"
              className="py-2.5 px-3 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/35 text-sky-300 text-xs font-black inline-flex items-center justify-center gap-2 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>{isAr ? 'تطبيق البريد' : 'Mail App'}</span>
            </a>

            <button
              type="button"
              data-testid="invite-share-copy-message-btn"
              onClick={() => handleCopy(sharePayload.message, 'message')}
              className="py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors"
            >
              {copiedTarget === 'message' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>
                {copiedTarget === 'message'
                  ? isAr
                    ? 'تم نسخ الرسالة'
                    : 'Message Copied'
                  : isAr
                  ? 'نسخ نص الدعوة'
                  : 'Copy Message'}
              </span>
            </button>

            <button
              type="button"
              data-testid="invite-share-native-btn"
              onClick={handleNativeShare}
              className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black inline-flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{isAr ? 'مشاركة مباشرة' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
