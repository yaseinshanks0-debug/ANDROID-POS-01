/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  ShieldCheck,
  Ticket,
  UserPlus,
  X,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import type { InvitationPreviewResult } from '../../lib/types';
import { normalizeShortCode } from '../../lib/invitation-utils';

export interface AcceptInviteModalProps {
  isOpen: boolean;
  initialToken?: string;
  onClose: () => void;
}

export const AcceptInviteModal: React.FC<AcceptInviteModalProps> = ({
  isOpen,
  initialToken,
  onClose,
}) => {
  const { settings, previewCompanyInvite, acceptCompanyInvite } = usePOS();
  const isAr = settings.language === 'ar';

  const [inviteToken, setInviteToken] = useState<string>(initialToken || '');
  const [shortCodeInput, setShortCodeInput] = useState<string>('');
  const [preview, setPreview] = useState<InvitationPreviewResult | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const [accountMode, setAccountMode] = useState<'create' | 'signin'>('create');
  const [emailInput, setEmailInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMessage(null);
    setPasswordInput('');
    setConfirmPasswordInput('');
    setPinInput('');
    const cleanToken = (initialToken || '').trim();
    setInviteToken(cleanToken);
    if (cleanToken) {
      setIsLoadingPreview(true);
      previewCompanyInvite({ token: cleanToken })
        .then((res) => {
          if (res.ok && res.preview) {
            setPreview(res.preview);
            if (res.preview.invitedName) {
              setFullNameInput(res.preview.invitedName);
            }
          } else {
            setPreview(null);
            setErrorMessage(
              res.error ||
                (isAr ? 'تعذر التحقق من رابط الدعوة.' : 'Could not verify invitation link.')
            );
          }
        })
        .finally(() => setIsLoadingPreview(false));
    } else {
      setPreview(null);
    }
  }, [isOpen, initialToken, previewCompanyInvite, isAr]);

  if (!isOpen) return null;

  const handleLookupShortCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const normalized = normalizeShortCode(shortCodeInput);
    if (!normalized) {
      setErrorMessage(
        isAr ? 'يرجى إدخال كود الدعوة (مثال: DQ-XXXX-XX).' : 'Please enter an invite code (e.g. DQ-XXXX-XX).'
      );
      return;
    }
    setIsLoadingPreview(true);
    try {
      const res = await previewCompanyInvite({ shortCode: normalized });
      if (!res.ok || !res.preview) {
        setPreview(null);
        setErrorMessage(
          res.error || (isAr ? 'تعذر العثور على الدعوة.' : 'Could not find this invitation.')
        );
        return;
      }
      setShortCodeInput(normalized);
      setPreview(res.preview);
      if (res.preview.invitedName) {
        setFullNameInput(res.preview.invitedName);
      }
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleAcceptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailInput.trim()) {
      setErrorMessage(
        isAr ? 'يرجى إدخال البريد الإلكتروني المدعو.' : 'Please enter the invited email address.'
      );
      return;
    }
    if (accountMode === 'create' && !fullNameInput.trim()) {
      setErrorMessage(isAr ? 'يرجى إدخال اسمك الكامل.' : 'Please enter your full name.');
      return;
    }
    if (passwordInput.trim().length < 8) {
      setErrorMessage(
        isAr
          ? 'يجب أن تتكون كلمة المرور من 8 خانات على الأقل.'
          : 'Password must be at least 8 characters long.'
      );
      return;
    }
    if (accountMode === 'create' && passwordInput !== confirmPasswordInput) {
      setErrorMessage(
        isAr
          ? 'كلمة المرور وتأكيد كلمة المرور غير متطابقتين.'
          : 'Password and confirmation do not match.'
      );
      return;
    }
    if (pinInput.trim() && !/^\d{4,6}$/.test(pinInput.trim())) {
      setErrorMessage(
        isAr
          ? 'رمز الدخول السريع PIN يجب أن يتكون من 4 إلى 6 أرقام.'
          : 'Quick PIN must be 4 to 6 digits.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await acceptCompanyInvite({
        token: inviteToken || undefined,
        shortCode: inviteToken ? undefined : normalizeShortCode(shortCodeInput),
        email: emailInput.trim(),
        password: passwordInput.trim(),
        fullName: fullNameInput.trim() || preview?.invitedName || emailInput.split('@')[0],
        pin: pinInput.trim() || undefined,
        accountMode,
      });

      if (!res.ok) {
        if (res.errorCode === 'auth/email-already-in-use') {
          setAccountMode('signin');
        }
        setErrorMessage(
          res.error || (isAr ? 'تعذر قبول الدعوة.' : 'Failed to accept company invitation.')
        );
        return;
      }

      // Clean ?invite= query parameter from browser URL without reloading
      if (typeof window !== 'undefined' && window.location.search.includes('invite=')) {
        const cleanUrl = `${window.location.origin}${window.location.pathname}`;
        window.history.replaceState({}, document.title, cleanUrl);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInvalidStatusMessage = (status: InvitationPreviewResult['status']) => {
    switch (status) {
      case 'EXPIRED':
        return isAr
          ? 'انتهت صلاحية هذه الدعوة (تصلح الدعوة لمدة 48 ساعة). اطلب من مدير الشركة إرسال رابط جديد.'
          : 'This invitation has expired (invites are valid for 48 hours). Ask your admin for a new one.';
      case 'REVOKED':
        return isAr
          ? 'تم إلغاء هذه الدعوة من قبل مدير الشركة.'
          : 'This invitation has been revoked by a company administrator.';
      case 'ACCEPTED':
        return isAr
          ? 'تم قبول هذه الدعوة مسبقاً. يمكنك تسجيل الدخول ببريدك الإلكتروني وكلمة المرور.'
          : 'This invitation was already accepted. Sign in with your email and password.';
      default:
        return isAr
          ? 'لم يتم العثور على دعوة مطابقة لهذا الرابط أو الكود. يرجى التحقق من الكود والمحاولة مرة أخرى.'
          : 'No matching invitation found for this link or code. Please check and try again.';
    }
  };

  return (
    <div
      data-testid="accept-invite-modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden my-auto">
        <div className="px-5 py-4 bg-gradient-to-b from-emerald-500/15 to-transparent border-b border-neutral-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/35 flex items-center justify-center text-emerald-400 shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-black text-white truncate">
                {isAr ? 'الانضمام إلى شركة عبر دعوة' : 'Join Company via Invitation'}
              </h2>
              <p className="text-xs text-neutral-400 truncate">
                {isAr
                  ? 'أدخل كود الدعوة أو افتح الرابط للانضمام لفريق العمل'
                  : 'Enter your invite code or open an invite link to join your team'}
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid="accept-invite-close-btn"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق نافذة الدعوة' : 'Close invitation modal'}
            className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div
              role="alert"
              data-testid="accept-invite-error"
              className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/35 text-rose-300 text-xs font-bold flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isLoadingPreview ? (
            <div className="py-10 text-center space-y-2">
              <div className="w-8 h-8 mx-auto rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              <p className="text-xs font-bold text-neutral-400">
                {isAr ? 'جاري التحقق من بيانات الدعوة...' : 'Verifying invitation details...'}
              </p>
            </div>
          ) : !preview || !preview.valid ? (
            <div className="space-y-4">
              {preview && !preview.valid && (
                <div
                  data-testid="accept-invite-invalid-status"
                  className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/35 text-amber-200 text-xs font-bold leading-relaxed"
                >
                  {renderInvalidStatusMessage(preview.status)}
                </div>
              )}

              <form onSubmit={handleLookupShortCode} className="space-y-3" data-testid="invite-code-lookup-form">
                <div>
                  <label
                    htmlFor="invite-short-code-input"
                    className="block text-xs font-bold text-neutral-300 mb-1.5"
                  >
                    {isAr ? 'كود الدعوة القصير (Short Code)' : 'Invitation Short Code'}
                  </label>
                  <input
                    id="invite-short-code-input"
                    type="text"
                    data-testid="invite-short-code-input"
                    value={shortCodeInput}
                    onChange={(e) => {
                      setShortCodeInput(e.target.value.toUpperCase());
                      setErrorMessage(null);
                    }}
                    placeholder="DQ-XXXX-XX"
                    dir="ltr"
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none text-center font-mono text-base font-black tracking-widest text-emerald-300 uppercase"
                  />
                </div>

                <button
                  type="submit"
                  data-testid="invite-verify-code-btn"
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-sm font-black inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isAr ? 'تحقق من كود الدعوة' : 'Verify Invite Code'}</span>
                </button>
              </form>
            </div>
          ) : (
            <form onSubmit={handleAcceptSubmit} className="space-y-4" data-testid="accept-invite-form">
              {/* Verified Invitation Summary Card */}
              <div
                data-testid="invite-preview-card"
                className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-sm font-black text-white truncate">
                      {isAr ? preview.companyNameAr || preview.companyName : preview.companyName}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-black shrink-0">
                    {isAr ? preview.roleNameAr || preview.roleName : preview.roleName}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-300">
                  {preview.branchName && (
                    <span>
                      {isAr ? 'الفرع:' : 'Branch:'}{' '}
                      <strong className="text-white">
                        {isAr ? preview.branchNameAr || preview.branchName : preview.branchName}
                      </strong>
                    </span>
                  )}
                  {preview.maskedEmail && (
                    <span dir="ltr" className="font-mono text-emerald-300">
                      {preview.maskedEmail}
                    </span>
                  )}
                </div>
              </div>

              {/* Account Mode Switcher */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-neutral-950 border border-neutral-800">
                <button
                  type="button"
                  data-testid="invite-mode-create-btn"
                  onClick={() => {
                    setAccountMode('create');
                    setErrorMessage(null);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-colors ${
                    accountMode === 'create'
                      ? 'bg-emerald-500 text-neutral-950'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'حساب جديد بالبريد' : 'New Email Account'}
                </button>
                <button
                  type="button"
                  data-testid="invite-mode-signin-btn"
                  onClick={() => {
                    setAccountMode('signin');
                    setErrorMessage(null);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-colors ${
                    accountMode === 'signin'
                      ? 'bg-emerald-500 text-neutral-950'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'لدي حساب مسبقاً' : 'Existing Email Account'}
                </button>
              </div>

              <div>
                <label htmlFor="invite-email-input" className="block text-xs font-bold text-neutral-300 mb-1.5">
                  {isAr ? 'البريد الإلكتروني المدعو *' : 'Invited Email Address *'}
                </label>
                <div className="relative" dir="ltr">
                  <Mail className="w-4 h-4 text-neutral-500 absolute start-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="invite-email-input"
                    type="email"
                    data-testid="invite-email-input"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={preview.maskedEmail || 'staff@company.com'}
                    dir="ltr"
                    className="w-full min-h-[44px] ps-10 pe-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none text-sm font-mono text-white"
                  />
                </div>
              </div>

              {accountMode === 'create' && (
                <div>
                  <label htmlFor="invite-fullname-input" className="block text-xs font-bold text-neutral-300 mb-1.5">
                    {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                  </label>
                  <input
                    id="invite-fullname-input"
                    type="text"
                    data-testid="invite-fullname-input"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    placeholder={isAr ? 'مثال: سارة أحمد' : 'e.g. Sara Ahmed'}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none text-sm text-white"
                  />
                </div>
              )}

              <div>
                <label htmlFor="invite-password-input" className="block text-xs font-bold text-neutral-300 mb-1.5">
                  {isAr ? 'كلمة المرور (8 خانات على الأقل) *' : 'Password (min 8 chars) *'}
                </label>
                <div className="relative" dir="ltr">
                  <input
                    id="invite-password-input"
                    type={showPassword ? 'text' : 'password'}
                    data-testid="invite-password-input"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    className="w-full min-h-[44px] ps-3.5 pe-11 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none text-sm text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 end-2.5 flex items-center text-neutral-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {accountMode === 'create' && (
                <div>
                  <label htmlFor="invite-confirm-password-input" className="block text-xs font-bold text-neutral-300 mb-1.5">
                    {isAr ? 'تأكيد كلمة المرور *' : 'Confirm Password *'}
                  </label>
                  <input
                    id="invite-confirm-password-input"
                    type={showPassword ? 'text' : 'password'}
                    data-testid="invite-confirm-password-input"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none text-sm text-white"
                  />
                </div>
              )}

              <div>
                <label htmlFor="invite-pin-input" className="block text-xs font-bold text-neutral-300 mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {isAr
                        ? 'رمز الدخول السريع أوفلاين PIN (اختياري — 4 إلى 6 أرقام)'
                        : 'Offline Quick PIN (Optional — 4-6 digits)'}
                    </span>
                  </span>
                </label>
                <input
                  id="invite-pin-input"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  data-testid="invite-pin-input"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="1234"
                  dir="ltr"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-emerald-500 focus:outline-none text-sm font-mono text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                data-testid="accept-invite-submit-btn"
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-neutral-950 text-sm font-black inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-colors"
              >
                {accountMode === 'create' ? (
                  <UserPlus className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span>
                  {isSubmitting
                    ? isAr
                      ? 'جاري الانضمام للشركة...'
                      : 'Joining company...'
                    : isAr
                    ? 'قبول الدعوة والدخول للشركة'
                    : 'Accept Invite & Join Company'}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
