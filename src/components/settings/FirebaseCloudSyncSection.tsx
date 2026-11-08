/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  auth,
  googleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  FirebaseUser,
  upsertFirebaseUserProfile,
  pushWorkspaceToFirestoreCloud,
  pullWorkspaceFromFirestoreCloud,
  fetchWorkspaceCloudSyncEvents,
  subscribeToFirestoreWorkspace,
  CloudSyncEventRecord,
  detectCurrentPlatform,
} from '../../lib/firebase';
import { TactileButton } from '../ui/TactileButton';
import {
  Cloud,
  LogIn,
  LogOut,
  UploadCloud,
  DownloadCloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  History,
} from 'lucide-react';

export const FirebaseCloudSyncSection: React.FC = () => {
  const {
    settings,
    currentCompany,
    products,
    transactions,
    customers,
    stockMovements,
    currencies,
    applyIncomingLanSyncState,
  } = usePOS();

  const isAr = settings.language === 'ar';
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [autoCloudSync, setAutoCloudSync] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dqnamo_firebase_auto_sync') === '1';
    } catch {
      return false;
    }
  });
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [syncEvents, setSyncEvents] = useState<CloudSyncEventRecord[]>([]);
  const lastPushedIsoRef = useRef<string>('');

  const deviceLabel = React.useMemo(() => {
    const platform = detectCurrentPlatform();
    if (platform === 'android') return 'Android POS APK';
    if (platform === 'windows') return 'Windows Desktop EXE';
    return 'Web POS Terminal';
  }, []);

  const loadSyncHistory = useCallback(
    async (user: FirebaseUser) => {
      try {
        const events = await fetchWorkspaceCloudSyncEvents({
          user,
          companyId: currentCompany.id,
        });
        setSyncEvents(events);
      } catch {
        // Ignore if workspace hasn't been created yet
      }
    },
    [currentCompany.id]
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setIsAuthReady(true);
      if (user) {
        try {
          await upsertFirebaseUserProfile(user, currentCompany.id);
          await loadSyncHistory(user);
        } catch (err: any) {
          console.warn('Could not initialize Firebase profile:', err);
        }
      } else {
        setSyncEvents([]);
      }
    });
    return () => unsub();
  }, [currentCompany.id, loadSyncHistory]);

  // Real-time Firestore listener when Auto Cloud Sync is enabled
  useEffect(() => {
    if (!isAuthReady || !firebaseUser || !autoCloudSync) return;

    const unsub = subscribeToFirestoreWorkspace({
      user: firebaseUser,
      companyId: currentCompany.id,
      onRemoteSnapshot: ({ lastDeviceName, payload }) => {
        if (!payload?.pushedAtIso || payload.pushedAtIso === lastPushedIsoRef.current) {
          return;
        }
        lastPushedIsoRef.current = payload.pushedAtIso;

        applyIncomingLanSyncState({
          products: payload.products || [],
          transactions: payload.transactions || [],
          customers: payload.customers || [],
          stockMovements: payload.stockMovements || [],
          currencies: payload.currencies || [],
        });
        setStatusMessage({
          type: 'info',
          text: isAr
            ? `تمت المزامنة السحابية التلقائية من (${lastDeviceName})`
            : `Auto-synced cloud update from (${lastDeviceName})`,
        });
      },
    });

    return () => unsub();
  }, [
    isAuthReady,
    firebaseUser,
    autoCloudSync,
    currentCompany.id,
    applyIncomingLanSyncState,
    isAr,
  ]);

  const handleGoogleSignIn = async () => {
    setIsBusy(true);
    setStatusMessage(null);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      if (result.user) {
        await upsertFirebaseUserProfile(result.user, currentCompany.id);
        await loadSyncHistory(result.user);
        setStatusMessage({
          type: 'success',
          text: isAr
            ? `تم تسجيل الدخول بنجاح بحساب Google: ${result.user.email}`
            : `Signed in with Google as ${result.user.email}`,
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: isAr
          ? `تعذر تسجيل الدخول عبر Google: ${err?.message || 'خطأ غير معروف'}`
          : `Google Sign-In failed: ${err?.message || 'Unknown error'}`,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleSignOut = async () => {
    setIsBusy(true);
    setStatusMessage(null);
    try {
      await signOut(auth);
      setStatusMessage({
        type: 'info',
        text: isAr ? 'تم تسجيل الخروج من حساب Google السحابي.' : 'Signed out of Google Cloud account.',
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handlePushToCloud = async () => {
    if (!firebaseUser) return;
    setIsBusy(true);
    setStatusMessage(null);
    try {
      const res = await pushWorkspaceToFirestoreCloud({
        user: firebaseUser,
        companyId: currentCompany.id,
        companyName: currentCompany.displayName || currentCompany.legalName || settings.storeName,
        deviceName: deviceLabel,
        actionType: 'PUSH',
        payload: {
          products,
          transactions,
          customers,
          stockMovements,
          currencies,
          settings: {
            storeName: settings.storeName,
            storeNameAr: settings.storeNameAr,
            currency: settings.currency,
            taxRatePercent: settings.taxRatePercent,
          },
          pushedAtIso: new Date().toISOString(),
        },
      });
      lastPushedIsoRef.current = res.updatedAtIso;
      await loadSyncHistory(firebaseUser);
      setStatusMessage({
        type: 'success',
        text: isAr
          ? `تم حفظ ورفع بيانات المتجر (${products.length} منتج، ${transactions.length} فاتورة، ${customers.length} عميل) إلى قاعدة بيانات Firestore السحابية بنجاح!`
          : `Successfully pushed store snapshot (${products.length} products, ${transactions.length} invoices) to Firestore Cloud!`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: isAr
          ? `فشل رفع البيانات إلى السحابة: ${err?.message || ''}`
          : `Failed to push snapshot to Firestore: ${err?.message || ''}`,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handlePullFromCloud = async () => {
    if (!firebaseUser) return;
    setIsBusy(true);
    setStatusMessage(null);
    try {
      const res = await pullWorkspaceFromFirestoreCloud({
        user: firebaseUser,
        companyId: currentCompany.id,
        deviceName: deviceLabel,
      });
      if (!res.exists || !res.payload) {
        setStatusMessage({
          type: 'info',
          text: isAr
            ? 'لا توجد نسخة سحابية محفوظة لهذه الشركة بعد — اضغط على "حفظ ورفع إلى السحابة" أولاً.'
            : 'No cloud snapshot found for this company yet — click "Push to Cloud" first.',
        });
        return;
      }

      applyIncomingLanSyncState({
        products: res.payload.products || [],
        transactions: res.payload.transactions || [],
        customers: res.payload.customers || [],
        stockMovements: res.payload.stockMovements || [],
        currencies: res.payload.currencies || [],
      });
      await loadSyncHistory(firebaseUser);
      setStatusMessage({
        type: 'success',
        text: isAr
          ? `تمت استعادة ودمج البيانات من السحابة بنجاح (${(res.payload.products || []).length} منتج، ${(res.payload.transactions || []).length} فاتورة)!`
          : `Successfully restored and merged cloud snapshot (${(res.payload.products || []).length} products, ${(res.payload.transactions || []).length} invoices)!`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: isAr
          ? `فشل استعادة البيانات من السحابة: ${err?.message || ''}`
          : `Failed to pull from Firestore Cloud: ${err?.message || ''}`,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const toggleAutoCloudSync = () => {
    const next = !autoCloudSync;
    setAutoCloudSync(next);
    try {
      localStorage.setItem('dqnamo_firebase_auto_sync', next ? '1' : '0');
    } catch {
      // ignore
    }
  };

  return (
    <div
      data-testid="firebase-cloud-sync-section"
      className="p-4 rounded-2xl bg-neutral-950/80 border border-amber-500/25 space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-black text-white">
                {isAr
                  ? 'المصادقة السحابية وحفظ البيانات عبر Firebase & Google'
                  : 'Firebase Auth (Google Sign-In) & Cloud Firestore Persistence'}
              </h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  firebaseUser
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                }`}
              >
                {firebaseUser
                  ? isAr
                    ? 'متصل بالسحابة'
                    : 'Cloud Connected'
                  : isAr
                  ? 'غير مسجل الدخول'
                  : 'Not Signed In'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {isAr
                ? 'سجّل الدخول بحساب Google لحفظ منتجاتك وفواتيرك وعملائك سحابياً في Firestore ومزامنتها بين أجهزتك من أي مكان.'
                : 'Sign in with Google to persist products, invoices, and customers in Cloud Firestore across all your devices.'}
            </p>
          </div>
        </div>

        <div>
          {!firebaseUser ? (
            <TactileButton
              type="button"
              variant="amber"
              size="sm"
              data-testid="firebase-google-signin-btn"
              isLoading={isBusy}
              onClick={handleGoogleSignIn}
              leftIcon={<LogIn className="w-4 h-4" />}
            >
              {isAr ? 'تسجيل الدخول بحساب Google' : 'Sign in with Google'}
            </TactileButton>
          ) : (
            <TactileButton
              type="button"
              variant="secondary"
              size="sm"
              data-testid="firebase-signout-btn"
              isLoading={isBusy}
              onClick={handleSignOut}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
            >
              {isAr ? 'تسجيل الخروج' : 'Sign Out'}
            </TactileButton>
          )}
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : statusMessage.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-sky-500/10 border-sky-500/30 text-sky-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {firebaseUser && (
        <div className="space-y-3 pt-2 border-t border-neutral-800/80">
          {/* User Identity & Cloud Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-neutral-900/90 border border-neutral-800">
            <div className="flex items-center gap-3">
              {firebaseUser.photoURL ? (
                <img
                  src={firebaseUser.photoURL}
                  alt={firebaseUser.displayName || 'User'}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-xl border border-amber-500/40 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-black text-xs">
                  {(firebaseUser.displayName || firebaseUser.email || 'G')[0].toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">
                    {firebaseUser.displayName || firebaseUser.email}
                  </span>
                  {firebaseUser.emailVerified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
                <span className="text-[11px] text-neutral-400 font-mono block">
                  {firebaseUser.email}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <TactileButton
                type="button"
                variant="amber"
                size="sm"
                data-testid="firebase-push-cloud-btn"
                isLoading={isBusy}
                onClick={handlePushToCloud}
                leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
              >
                {isAr ? 'حفظ ورفع إلى السحابة' : 'Push to Cloud'}
              </TactileButton>

              <TactileButton
                type="button"
                variant="secondary"
                size="sm"
                data-testid="firebase-pull-cloud-btn"
                isLoading={isBusy}
                onClick={handlePullFromCloud}
                leftIcon={<DownloadCloud className="w-3.5 h-3.5" />}
              >
                {isAr ? 'استعادة ودمج من السحابة' : 'Pull from Cloud'}
              </TactileButton>

              <button
                type="button"
                onClick={toggleAutoCloudSync}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                  autoCloudSync
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${autoCloudSync ? 'animate-spin' : ''}`} />
                <span>
                  {isAr
                    ? autoCloudSync
                      ? 'المزامنة السحابية الحية: مفعلة'
                      : 'تفعيل المزامنة السحابية الحية'
                    : autoCloudSync
                    ? 'Live Cloud Sync: ON'
                    : 'Enable Live Cloud Sync'}
                </span>
              </button>
            </div>
          </div>

          {/* Recent Cloud Sync Activity */}
          {syncEvents.length > 0 && (
            <div className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-800/80 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-300">
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isAr
                    ? 'آخر عمليات الحفظ والمزامنة السحابية (Firestore)'
                    : 'Recent Cloud Firestore Sync Checkpoints'}
                </span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {syncEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between gap-2 text-[11px] px-2.5 py-1.5 rounded-lg bg-neutral-950/80 border border-neutral-800/70"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold shrink-0 ${
                          ev.actionType === 'PUSH'
                            ? 'bg-amber-500/15 text-amber-300'
                            : 'bg-sky-500/15 text-sky-300'
                        }`}
                      >
                        {ev.actionType}
                      </span>
                      <span className="text-neutral-300 truncate">{ev.summary}</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                      {new Date(ev.createdAtIso).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
