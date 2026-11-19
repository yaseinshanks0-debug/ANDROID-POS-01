/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Building2,
  Delete,
  Eye,
  EyeOff,
  FlaskConical,
  Globe,
  KeyRound,
  Lock,
  LogIn,
  ShieldCheck,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import type { POSUser, UserRole } from '../../lib/types';
import {
  AUTH_ERROR_CODES,
  LOGIN_METHODS,
  validatePasswordStrengthPolicy,
  type LoginMethod,
} from '../../lib/local-auth';

const ROLE_BADGE_LABELS: Record<UserRole, { en: string; ar: string; cls: string }> = {
  admin: {
    en: 'Admin',
    ar: 'مدير النظام',
    cls: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
  },
  manager: {
    en: 'Branch Manager',
    ar: 'مدير الفرع',
    cls: 'bg-sky-500/15 text-sky-300 border-sky-500/35',
  },
  cashier: {
    en: 'Cashier',
    ar: 'كاشير مبيعات',
    cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
  },
  inventory_clerk: {
    en: 'Inventory Clerk',
    ar: 'أمين مخزن',
    cls: 'bg-purple-500/15 text-purple-300 border-purple-500/35',
  },
};

export interface LoginScreenProps {
  mode?: 'fullscreen' | 'switch-user';
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ mode = 'fullscreen' }) => {
  const {
    settings,
    updateSettings,
    users,
    currentUser,
    currentCompany,
    workspaceMode,
    pendingSwitchUserId,
    loginWithCredentials,
    setupInitialOwnerAccount,
    setLegacyAccountPassword,
    cancelUserSwitchRequest,
    enterPracticeMode,
    openOnboardingModal,
  } = usePOS();

  const isAr = settings.language === 'ar';
  const isSwitchMode = mode === 'switch-user';

  const activeUsers = useMemo(
    () => users.filter((u) => u.isActive !== false),
    [users]
  );

  const switchTargetUser = useMemo<POSUser | undefined>(
    () =>
      isSwitchMode && pendingSwitchUserId
        ? users.find((u) => u.id === pendingSwitchUserId)
        : undefined,
    [isSwitchMode, pendingSwitchUserId, users]
  );

  const [activeTab, setActiveTab] = useState<'signin' | 'setup'>(() =>
    !isSwitchMode && activeUsers.length === 0 ? 'setup' : 'signin'
  );

  const [loginMethod, setLoginMethod] = useState<LoginMethod>(LOGIN_METHODS.PASSWORD);
  const [selectedUserId, setSelectedUserId] = useState<string>(() => {
    if (isSwitchMode && pendingSwitchUserId) return pendingSwitchUserId;
    if (currentUser && activeUsers.some((u) => u.id === currentUser.id)) return currentUser.id;
    return activeUsers[0]?.id || '';
  });
  const [usernameInput, setUsernameInput] = useState<string>(() => {
    const initial =
      (isSwitchMode && pendingSwitchUserId
        ? users.find((u) => u.id === pendingSwitchUserId)
        : activeUsers.find((u) => u.id === currentUser?.id) || activeUsers[0]) || null;
    return initial?.username || initial?.email || '';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [legacySetupUser, setLegacySetupUser] = useState<POSUser | null>(null);
  const [legacyNewPassword, setLegacyNewPassword] = useState('');
  const [legacyConfirmPassword, setLegacyConfirmPassword] = useState('');
  const [legacyNewPin, setLegacyNewPin] = useState('');

  const [setupNameAr, setSetupNameAr] = useState('');
  const [setupUsername, setSetupUsername] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [setupPin, setSetupPin] = useState('');
  const [showSetupPassword, setShowSetupPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSwitchMode && switchTargetUser) {
      setActiveTab('signin');
      setSelectedUserId(switchTargetUser.id);
      setUsernameInput(switchTargetUser.username || switchTargetUser.email || switchTargetUser.name);
      setPasswordInput('');
      setPinInput('');
      setErrorMessage(null);
      setLegacySetupUser(null);
    }
  }, [isSwitchMode, switchTargetUser]);

  useEffect(() => {
    if (!isSwitchMode && activeUsers.length > 0 && activeTab === 'setup') {
      setActiveTab('signin');
    }
  }, [isSwitchMode, activeUsers.length, activeTab]);

  if (isSwitchMode && !switchTargetUser) {
    return null;
  }

  const handleSelectAccountChip = (u: POSUser) => {
    setSelectedUserId(u.id);
    setUsernameInput(u.username || u.email || u.name);
    setPasswordInput('');
    setPinInput('');
    setErrorMessage(null);
    setLegacySetupUser(null);
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const targetId = isSwitchMode ? switchTargetUser?.id : selectedUserId || undefined;
    const cleanUsername = usernameInput.trim();

    if (!targetId && !cleanUsername) {
      setErrorMessage(
        isAr
          ? 'يرجى اختيار حساب أو إدخال اسم المستخدم أولاً.'
          : 'Please select an account or enter your username first.'
      );
      return;
    }

    if (loginMethod === LOGIN_METHODS.PASSWORD && !passwordInput.trim()) {
      setErrorMessage(isAr ? 'يرجى إدخال كلمة المرور.' : 'Please enter your password.');
      return;
    }

    if (loginMethod === LOGIN_METHODS.PIN && !pinInput.trim()) {
      setErrorMessage(
        isAr ? 'يرجى إدخال رمز الدخول السريع PIN.' : 'Please enter your Quick PIN code.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await loginWithCredentials({
        userId: targetId,
        usernameOrEmail: cleanUsername || undefined,
        password: loginMethod === LOGIN_METHODS.PASSWORD ? passwordInput : undefined,
        pin: loginMethod === LOGIN_METHODS.PIN ? pinInput : undefined,
      });

      if (!result.ok) {
        if (result.errorCode === AUTH_ERROR_CODES.NEEDS_PASSWORD_SETUP && result.user) {
          setLegacySetupUser(result.user);
          setLegacyNewPassword('');
          setLegacyConfirmPassword('');
          setLegacyNewPin('');
          setErrorMessage(null);
          return;
        }
        setErrorMessage(
          result.error ||
            (isAr
              ? 'بيانات الدخول غير صحيحة. يرجى التحقق والمحاولة مجدداً.'
              : 'Invalid login credentials. Please check and try again.')
        );
        return;
      }

      setPasswordInput('');
      setPinInput('');
      setErrorMessage(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLegacyPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!legacySetupUser) return;
    setErrorMessage(null);

    const pwdCheck = validatePasswordStrengthPolicy(legacyNewPassword);
    if (!pwdCheck.valid) {
      setErrorMessage(isAr ? pwdCheck.messageAr || '' : pwdCheck.messageEn || '');
      return;
    }
    if (legacyNewPassword.trim() !== legacyConfirmPassword.trim()) {
      setErrorMessage(
        isAr
          ? 'كلمة المرور وتأكيد كلمة المرور غير متطابقتين.'
          : 'Password and confirmation do not match.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await setLegacyAccountPassword(
        legacySetupUser.id,
        legacyNewPassword,
        legacyNewPin || undefined
      );
      if (!res.ok) {
        setErrorMessage(res.error || (isAr ? 'فشل حفظ كلمة المرور.' : 'Failed to save password.'));
        return;
      }
      setLegacySetupUser(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInitialSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!setupNameAr.trim()) {
      setErrorMessage(
        isAr ? 'يرجى إدخال اسم المدير أو صاحب المتجر.' : 'Please enter the owner full name.'
      );
      return;
    }
    if (setupUsername.trim().length < 2) {
      setErrorMessage(
        isAr
          ? 'يرجى إدخال اسم مستخدم (حرفان على الأقل).'
          : 'Please enter a username (at least 2 characters).'
      );
      return;
    }
    const pwdCheck = validatePasswordStrengthPolicy(setupPassword);
    if (!pwdCheck.valid) {
      setErrorMessage(isAr ? pwdCheck.messageAr || '' : pwdCheck.messageEn || '');
      return;
    }
    if (setupPassword.trim() !== setupConfirmPassword.trim()) {
      setErrorMessage(
        isAr
          ? 'كلمة المرور وتأكيد كلمة المرور غير متطابقتين.'
          : 'Password and confirm password do not match.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await setupInitialOwnerAccount({
        nameAr: setupNameAr.trim(),
        nameEn: setupNameAr.trim(),
        username: setupUsername.trim(),
        password: setupPassword.trim(),
        pin: setupPin.trim() || undefined,
      });
      if (!res.ok) {
        setErrorMessage(res.error || (isAr ? 'تعذر إنشاء الحساب.' : 'Failed to create account.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppendPinDigit = (digit: string) => {
    setErrorMessage(null);
    setPinInput((prev) => (prev.length < 8 ? `${prev}${digit}` : prev));
  };

  const handleBackspacePin = () => {
    setPinInput((prev) => prev.slice(0, -1));
  };

  const toggleLanguage = () => {
    updateSettings({ language: settings.language === 'en' ? 'ar' : 'en' });
  };

  const passwordStrengthStatus = validatePasswordStrengthPolicy(setupPassword);

  const cardContent = (
    <div className="w-full max-w-md rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-4 bg-gradient-to-b from-amber-500/10 to-transparent border-b border-neutral-800/80">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-black text-neutral-950 shadow-lg shadow-amber-500/20 shrink-0 overflow-hidden">
              {settings.storeLogo ? (
                <img
                  src={settings.storeLogo}
                  alt={isAr ? settings.storeNameAr : settings.storeName}
                  className="w-full h-full object-contain bg-neutral-950 p-1"
                />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-black text-white truncate">
                {isSwitchMode
                  ? isAr
                    ? 'تبديل الحساب النشط'
                    : 'Switch Active Account'
                  : isAr
                  ? 'تسجيل الدخول للنظام'
                  : 'POS Sign In'}
              </h1>
              <p className="text-xs text-neutral-400 truncate">
                {isAr
                  ? settings.storeNameAr || currentCompany.displayNameAr || 'نقطة البيع'
                  : settings.storeName || currentCompany.displayName || 'POS Terminal'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {!isSwitchMode && (
              <button
                type="button"
                onClick={toggleLanguage}
                data-testid="login-language-toggle-btn"
                className="px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                aria-label={isAr ? 'Switch language to English' : 'تغيير اللغة إلى العربية'}
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono">{isAr ? 'EN' : 'عربي'}</span>
              </button>
            )}
            {isSwitchMode && (
              <button
                type="button"
                onClick={cancelUserSwitchRequest}
                data-testid="cancel-switch-user-btn"
                className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
                aria-label={isAr ? 'إلغاء تبديل الحساب' : 'Cancel account switch'}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {!isSwitchMode && activeUsers.length === 0 && !legacySetupUser && (
          <div className="grid grid-cols-2 gap-1.5 mt-4 p-1 rounded-2xl bg-neutral-950 border border-neutral-800">
            <button
              type="button"
              data-testid="login-tab-setup"
              onClick={() => {
                setActiveTab('setup');
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'setup'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isAr ? 'إنشاء حساب المدير' : 'Create Owner'}</span>
            </button>
            <button
              type="button"
              data-testid="login-tab-signin"
              onClick={() => {
                setActiveTab('signin');
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'signin'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        {errorMessage && (
          <div
            role="alert"
            data-testid="login-error-banner"
            className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/35 text-rose-300 text-xs font-bold flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {legacySetupUser ? (
          <form onSubmit={handleLegacyPasswordSubmit} className="space-y-3.5" data-testid="legacy-password-setup-form">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/35 text-xs text-amber-200 space-y-1">
              <div className="font-extrabold flex items-center gap-1.5 text-amber-300">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  {isAr
                    ? `تأمين حساب: ${legacySetupUser.nameAr || legacySetupUser.name}`
                    : `Secure Account: ${legacySetupUser.name}`}
                </span>
              </div>
              <p className="text-[11px] text-amber-200/80">
                {isAr
                  ? 'هذا الحساب لا يحتوي على كلمة مرور محفوظة بعد. أنشئ كلمة مرور قوية الآن لتأمين تسجيل الدخول.'
                  : 'This account does not have a saved password yet. Create a strong password now to secure sign-in.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                {isAr ? 'كلمة المرور الجديدة *' : 'New Password *'}
              </label>
              <input
                type="password"
                data-testid="legacy-new-password-input"
                value={legacyNewPassword}
                onChange={(e) => setLegacyNewPassword(e.target.value)}
                placeholder={isAr ? '8 خانات على الأقل (أحرف وأرقام)' : 'Min 8 chars (letters + digits)'}
                dir="ltr"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                {isAr ? 'تأكيد كلمة المرور *' : 'Confirm Password *'}
              </label>
              <input
                type="password"
                data-testid="legacy-confirm-password-input"
                value={legacyConfirmPassword}
                onChange={(e) => setLegacyConfirmPassword(e.target.value)}
                placeholder={isAr ? 'أعد إدخال كلمة المرور' : 'Re-enter password'}
                dir="ltr"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                {isAr ? 'رمز دخول سريع PIN (اختياري — 4 إلى 8 أرقام)' : 'Quick PIN (Optional — 4-8 digits)'}
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={legacyNewPin}
                onChange={(e) => setLegacyNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="1234"
                dir="ltr"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm font-mono text-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setLegacySetupUser(null);
                  setErrorMessage(null);
                }}
                className="px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-colors"
              >
                {isAr ? 'رجوع' : 'Back'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                data-testid="legacy-save-password-btn"
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-neutral-950 text-sm font-black inline-flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? 'حفظ كلمة المرور والدخول' : 'Save Password & Sign In'}</span>
              </button>
            </div>
          </form>
        ) : activeTab === 'setup' && !isSwitchMode ? (
          <form onSubmit={handleInitialSetupSubmit} className="space-y-3.5" data-testid="initial-owner-setup-form">
            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-1">
              <div className="font-extrabold text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  {isAr ? 'حماية نقطة البيع بكلمة مرور' : 'Protect Your POS with a Password'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                {isAr
                  ? 'أنشئ حساب المدير وكلمة المرور الآن ليطلب التطبيق تسجيل الدخول عند كل فتح أو قفل للشاشة.'
                  : 'Create your Owner account and password now so the POS requires authentication on launch and lock.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="setup-owner-name" className="block text-xs font-bold text-neutral-300 mb-1.5">
                  {isAr ? 'اسم المدير / المالك *' : 'Owner Full Name *'}
                </label>
                <input
                  id="setup-owner-name"
                  type="text"
                  data-testid="setup-owner-name-input"
                  value={setupNameAr}
                  onChange={(e) => setSetupNameAr(e.target.value)}
                  placeholder={isAr ? 'مثال: أحمد محمد' : 'e.g. Ahmed Mohamed'}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm text-white"
                />
              </div>
              <div>
                <label htmlFor="setup-owner-username" className="block text-xs font-bold text-neutral-300 mb-1.5">
                  {isAr ? 'اسم المستخدم للدخول *' : 'Login Username *'}
                </label>
                <input
                  id="setup-owner-username"
                  type="text"
                  data-testid="setup-owner-username-input"
                  value={setupUsername}
                  onChange={(e) => setSetupUsername(e.target.value)}
                  placeholder="admin"
                  dir="ltr"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm font-mono text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="setup-owner-password" className="block text-xs font-bold text-neutral-300 mb-1.5">
                {isAr ? 'كلمة المرور *' : 'Password *'}
              </label>
              <div className="relative" dir="ltr">
                <input
                  id="setup-owner-password"
                  type={showSetupPassword ? 'text' : 'password'}
                  data-testid="setup-owner-password-input"
                  value={setupPassword}
                  onChange={(e) => setSetupPassword(e.target.value)}
                  placeholder={isAr ? '8 خانات على الأقل (أحرف + أرقام)' : 'Min 8 chars (letters + digits)'}
                  dir="ltr"
                  className="w-full min-h-[44px] ps-3.5 pe-11 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowSetupPassword((prev) => !prev)}
                  className="absolute inset-y-0 end-2.5 flex items-center text-neutral-400 hover:text-white"
                  aria-label={
                    showSetupPassword
                      ? isAr
                        ? 'إخفاء كلمة المرور'
                        : 'Hide password'
                      : isAr
                      ? 'إظهار كلمة المرور'
                      : 'Show password'
                  }
                >
                  {showSetupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {setupPassword.length > 0 && (
                <p
                  className={`mt-1 text-[11px] font-bold ${
                    passwordStrengthStatus.valid ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {passwordStrengthStatus.valid
                    ? isAr
                      ? '✓ كلمة مرور قوية ومطابقة للمعايير'
                      : '✓ Strong password'
                    : isAr
                    ? passwordStrengthStatus.messageAr
                    : passwordStrengthStatus.messageEn}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="setup-owner-confirm" className="block text-xs font-bold text-neutral-300 mb-1.5">
                  {isAr ? 'تأكيد كلمة المرور *' : 'Confirm Password *'}
                </label>
                <input
                  id="setup-owner-confirm"
                  type={showSetupPassword ? 'text' : 'password'}
                  data-testid="setup-owner-confirm-password-input"
                  value={setupConfirmPassword}
                  onChange={(e) => setSetupConfirmPassword(e.target.value)}
                  placeholder={isAr ? 'أعد كتابة كلمة المرور' : 'Repeat password'}
                  dir="ltr"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm text-white"
                />
              </div>
              <div>
                <label htmlFor="setup-owner-pin" className="block text-xs font-bold text-neutral-300 mb-1.5">
                  {isAr ? 'رمز PIN سريع (اختياري)' : 'Quick PIN (Optional)'}
                </label>
                <input
                  id="setup-owner-pin"
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  data-testid="setup-owner-pin-input"
                  value={setupPin}
                  onChange={(e) => setSetupPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="1234"
                  dir="ltr"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm font-mono text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="setup-owner-submit-btn"
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-neutral-950 text-sm font-black inline-flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? 'حفظ الحساب وتفعيل الحماية' : 'Create Account & Sign In'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignInSubmit} className="space-y-4" data-testid="pos-login-form">
            {isSwitchMode && switchTargetUser && (
              <div className="p-3 rounded-2xl bg-neutral-950 border border-amber-500/40 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-neutral-950 shrink-0"
                  style={{ backgroundColor: switchTargetUser.avatarColor || '#f59e0b' }}
                >
                  {(isAr ? switchTargetUser.nameAr || switchTargetUser.name : switchTargetUser.name)
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-black text-white truncate">
                    {isAr ? switchTargetUser.nameAr || switchTargetUser.name : switchTargetUser.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                        (ROLE_BADGE_LABELS[switchTargetUser.role] || ROLE_BADGE_LABELS.cashier).cls
                      }`}
                    >
                      {isAr
                        ? (ROLE_BADGE_LABELS[switchTargetUser.role] || ROLE_BADGE_LABELS.cashier).ar
                        : (ROLE_BADGE_LABELS[switchTargetUser.role] || ROLE_BADGE_LABELS.cashier).en}
                    </span>
                    {switchTargetUser.username && (
                      <span className="text-[11px] font-mono text-neutral-400 truncate">
                        @{switchTargetUser.username}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!isSwitchMode && activeUsers.length > 0 && (
              <div className="space-y-2">
                <span className="block text-xs font-bold text-neutral-400">
                  {isAr ? 'اختر الحساب' : 'Select Account'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pe-0.5">
                  {activeUsers.map((u) => {
                    const isSelected = selectedUserId === u.id;
                    const badge = ROLE_BADGE_LABELS[u.role] || ROLE_BADGE_LABELS.cashier;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        data-testid={`login-account-chip-${u.id}`}
                        onClick={() => handleSelectAccountChip(u)}
                        className={`p-2.5 rounded-2xl border text-start flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500/60 shadow-sm'
                            : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-neutral-950 shrink-0"
                          style={{ backgroundColor: u.avatarColor || '#f59e0b' }}
                        >
                          {(isAr ? u.nameAr || u.name : u.name).slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-extrabold text-white truncate">
                            {isAr ? u.nameAr || u.name : u.name}
                          </div>
                          <span className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold border ${badge.cls}`}>
                            {isAr ? badge.ar : badge.en}
                          </span>
                        </div>
                        {isSelected && <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {!isSwitchMode && (
              <div>
                <label htmlFor="login-username-input" className="block text-xs font-bold text-neutral-300 mb-1.5">
                  {isAr ? 'اسم المستخدم أو البريد الإلكتروني' : 'Username or Email'}
                </label>
                <input
                  id="login-username-input"
                  type="text"
                  data-testid="login-username-input"
                  value={usernameInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setUsernameInput(val);
                    setErrorMessage(null);
                    const matched = activeUsers.find(
                      (u) =>
                        (u.username && u.username.toLowerCase() === val.trim().toLowerCase()) ||
                        (u.email && u.email.toLowerCase() === val.trim().toLowerCase())
                    );
                    setSelectedUserId(matched ? matched.id : '');
                  }}
                  placeholder={isAr ? 'أدخل اسم المستخدم...' : 'Enter username or email...'}
                  dir="ltr"
                  autoComplete="username"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm font-mono text-white"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-neutral-950 border border-neutral-800">
              <button
                type="button"
                data-testid="login-method-password-btn"
                onClick={() => {
                  setLoginMethod(LOGIN_METHODS.PASSWORD);
                  setErrorMessage(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors ${
                  loginMethod === LOGIN_METHODS.PASSWORD
                    ? 'bg-neutral-800 text-amber-300 border border-amber-500/40'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAr ? 'كلمة المرور' : 'Password'}</span>
              </button>
              <button
                type="button"
                data-testid="login-method-pin-btn"
                onClick={() => {
                  setLoginMethod(LOGIN_METHODS.PIN);
                  setErrorMessage(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors ${
                  loginMethod === LOGIN_METHODS.PIN
                    ? 'bg-neutral-800 text-amber-300 border border-amber-500/40'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{isAr ? 'رمز PIN السريع' : 'Quick PIN'}</span>
              </button>
            </div>

            {loginMethod === LOGIN_METHODS.PASSWORD ? (
              <div>
                <label htmlFor="login-password-input" className="block text-xs font-bold text-neutral-300 mb-1.5">
                  {isAr ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative" dir="ltr">
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    data-testid="login-password-input"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder={isAr ? 'أدخل كلمة المرور...' : 'Enter password...'}
                    dir="ltr"
                    autoComplete="current-password"
                    className="w-full min-h-[46px] ps-3.5 pe-11 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-amber-500 focus:outline-none text-sm text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 end-2.5 flex items-center text-neutral-400 hover:text-white"
                    aria-label={
                      showPassword
                        ? isAr
                          ? 'إخفاء كلمة المرور'
                          : 'Hide password'
                        : isAr
                        ? 'إظهار كلمة المرور'
                        : 'Show password'
                    }
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label htmlFor="login-pin-input" className="block text-xs font-bold text-neutral-300 mb-1.5">
                    {isAr ? 'رمز الدخول السريع (PIN)' : 'Quick Access PIN'}
                  </label>
                  <input
                    id="login-pin-input"
                    type="password"
                    inputMode="numeric"
                    maxLength={8}
                    data-testid="login-pin-input"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value.replace(/\D/g, ''));
                      setErrorMessage(null);
                    }}
                    placeholder="••••"
                    dir="ltr"
                    className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-amber-500 focus:outline-none text-center text-lg tracking-[0.4em] font-mono text-amber-300"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2" dir="ltr">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      data-testid={`pin-key-${digit}`}
                      onClick={() => handleAppendPinDigit(digit)}
                      className="min-h-[44px] rounded-xl bg-neutral-950 hover:bg-neutral-800 active:scale-95 border border-neutral-800 text-white font-mono text-base font-extrabold transition-all"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPinInput('')}
                    className="min-h-[44px] rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-bold transition-colors"
                  >
                    {isAr ? 'مسح' : 'Clear'}
                  </button>
                  <button
                    type="button"
                    data-testid="pin-key-0"
                    onClick={() => handleAppendPinDigit('0')}
                    className="min-h-[44px] rounded-xl bg-neutral-950 hover:bg-neutral-800 active:scale-95 border border-neutral-800 text-white font-mono text-base font-extrabold transition-all"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleBackspacePin}
                    aria-label={isAr ? 'حذف رقم' : 'Backspace'}
                    className="min-h-[44px] rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white inline-flex items-center justify-center transition-colors"
                  >
                    <Delete className="w-4 h-4" />
                  </button>
                </div>

                {workspaceMode === 'PRACTICE' && (
                  <p className="text-[11px] text-amber-300/80 text-center">
                    {isAr
                      ? 'رموز وضع التدريب التجريبي: المدير 1111 • المشرف 2222 • الكاشير 3333 • المخزن 4444'
                      : 'Practice Mode PINs: Admin 1111 • Manager 2222 • Cashier 3333 • Warehouse 4444'}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="login-submit-btn"
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-neutral-950 text-sm font-black inline-flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? isAr
                    ? 'جاري التحقق...'
                    : 'Verifying...'
                  : isSwitchMode
                  ? isAr
                    ? 'تأكيد الدخول والتبديل'
                    : 'Verify & Switch Account'
                  : isAr
                  ? 'تسجيل الدخول'
                  : 'Sign In'}
              </span>
            </button>
          </form>
        )}

        {!isSwitchMode && (
          <div className="pt-3 border-t border-neutral-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <button
              type="button"
              data-testid="login-open-company-wizard-btn"
              onClick={() => openOnboardingModal('create-company')}
              className="px-3 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'معالج إعداد شركة جديدة' : 'New Company Setup'}</span>
            </button>

            <button
              type="button"
              data-testid="login-enter-practice-mode-btn"
              onClick={() => {
                void enterPracticeMode();
              }}
              className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/35 text-amber-300 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>{isAr ? 'وضع التدريب التجريبي' : 'Practice Mode'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (isSwitchMode) {
    return (
      <div
        data-testid="switch-user-auth-modal"
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      >
        {cardContent}
      </div>
    );
  }

  return (
    <div
      data-testid="pos-login-screen"
      className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4 relative overflow-y-auto"
    >
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.10),transparent_55%)]" />
      <div className="relative z-10 w-full flex flex-col items-center justify-center py-4">
        {cardContent}
        <p className="mt-4 text-[11px] text-neutral-500 text-center max-w-sm">
          {isAr
            ? 'جلسة محمية بتشفير كلمة المرور ورمز الدخول السريع لضمان أمان نقطة البيع وصلاحيات الموظفين.'
            : 'Protected session with salted password & PIN verification for POS terminal security.'}
        </p>
      </div>
    </div>
  );
};
