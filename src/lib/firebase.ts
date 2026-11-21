/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { buildSafeCloudSnapshotPayload } from './cloud-snapshot-utils';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
      displayName?: string | null;
      photoUrl?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

if (typeof window !== 'undefined') {
  testConnection();
}

export function sanitizeRuleId(raw: string, fallback = 'default_id'): string {
  const cleaned = String(raw || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 120);
  return cleaned.length > 0 ? cleaned : fallback;
}

function truncateString(val: unknown, maxLen: number, fallback = ''): string {
  const str = String(val ?? '').trim();
  const resolved = str.length > 0 ? str : fallback;
  return resolved.slice(0, maxLen);
}

export function buildCloudWorkspaceId(uid: string, companyId: string): string {
  return sanitizeRuleId(`${uid}_${companyId}`, 'workspace_default');
}

export async function upsertFirebaseUserProfile(
  user: FirebaseUser,
  companyId: string
): Promise<void> {
  const uid = sanitizeRuleId(user.uid, 'user');
  const path = `users/${uid}`;
  const userRef = doc(db, 'users', uid);

  const safeEmail = truncateString(user.email, 254, 'user@example.com');
  const safeDisplayName = truncateString(
    user.displayName || user.email?.split('@')[0],
    120,
    'D POS User'
  );
  const safePhotoURL = truncateString(user.photoURL, 512, '');
  const safeCompanyId = sanitizeRuleId(companyId, 'comp-default');

  let existsSnap = false;
  try {
    const snap = await getDoc(userRef);
    existsSnap = snap.exists();
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }

  try {
    if (!existsSnap) {
      await setDoc(userRef, {
        uid,
        email: safeEmail,
        displayName: safeDisplayName,
        photoURL: safePhotoURL,
        companyId: safeCompanyId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(userRef, {
        email: safeEmail,
        displayName: safeDisplayName,
        photoURL: safePhotoURL,
        companyId: safeCompanyId,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(
      error,
      existsSnap ? OperationType.UPDATE : OperationType.CREATE,
      path
    );
  }
}

export interface CloudWorkspaceSnapshotPayload {
  products: any[];
  transactions: any[];
  customers: any[];
  stockMovements: any[];
  currencies: any[];
  settings?: Record<string, any>;
  pushedAtIso: string;
}

export interface CloudSyncEventRecord {
  id: string;
  ownerId: string;
  workspaceId: string;
  deviceName: string;
  platform: 'windows' | 'android' | 'web';
  actionType: 'PUSH' | 'PULL' | 'AUTO_SYNC';
  summary: string;
  createdAtIso: string;
}

export function detectCurrentPlatform(): 'windows' | 'android' | 'web' {
  if (typeof window === 'undefined') return 'web';
  const ua = navigator.userAgent.toLowerCase();
  if ((window as any).AndroidNativeFileBridge || ua.includes('android')) {
    return 'android';
  }
  if (ua.includes('windows') || ua.includes('electron')) {
    return 'windows';
  }
  return 'web';
}

export async function pushWorkspaceToFirestoreCloud(params: {
  user: FirebaseUser;
  companyId: string;
  companyName: string;
  deviceName: string;
  actionType?: 'PUSH' | 'AUTO_SYNC';
  payload: CloudWorkspaceSnapshotPayload;
}): Promise<{ workspaceId: string; updatedAtIso: string }> {
  const uid = sanitizeRuleId(params.user.uid, 'user');
  const safeCompanyId = sanitizeRuleId(params.companyId, 'comp-default');
  const workspaceId = buildCloudWorkspaceId(uid, safeCompanyId);
  const wsPath = `cloudWorkspaces/${workspaceId}`;
  const wsRef = doc(db, 'cloudWorkspaces', workspaceId);

  const safeCompanyName = truncateString(params.companyName, 160, 'D POS - Point of Sale');
  const safeDeviceName = truncateString(params.deviceName, 120, 'POS Terminal');
  const productsCount = Math.min(100000, Math.max(0, (params.payload.products || []).length));
  const transactionsCount = Math.min(
    500000,
    Math.max(0, (params.payload.transactions || []).length)
  );
  const customersCount = Math.min(100000, Math.max(0, (params.payload.customers || []).length));

  // Sort newest-first, remove undefined fields, and strip oversized inline base64 media if approaching Firestore's 1 MiB limit
  const cleanSnapshotPayload = buildSafeCloudSnapshotPayload({
    products: params.payload.products,
    transactions: params.payload.transactions,
    customers: params.payload.customers,
    stockMovements: params.payload.stockMovements,
    currencies: params.payload.currencies,
    settings: params.payload.settings,
  });

  let existsWs = false;
  try {
    const existingDoc = await getDoc(wsRef);
    existsWs = existingDoc.exists();
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, wsPath);
  }

  try {
    if (!existsWs) {
      await setDoc(wsRef, {
        ownerId: uid,
        companyId: safeCompanyId,
        companyName: safeCompanyName,
        productsCount,
        transactionsCount,
        customersCount,
        lastDeviceName: safeDeviceName,
        snapshotPayload: cleanSnapshotPayload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(wsRef, {
        companyName: safeCompanyName,
        productsCount,
        transactionsCount,
        customersCount,
        lastDeviceName: safeDeviceName,
        snapshotPayload: cleanSnapshotPayload,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(
      error,
      existsWs ? OperationType.UPDATE : OperationType.CREATE,
      wsPath
    );
  }

  // Record audit event in subcollection
  const eventId = sanitizeRuleId(`ev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);
  const eventPath = `cloudWorkspaces/${workspaceId}/syncEvents/${eventId}`;
  const eventRef = doc(db, 'cloudWorkspaces', workspaceId, 'syncEvents', eventId);
  const platform = detectCurrentPlatform();
  const actionType = params.actionType || 'PUSH';
  const summary = truncateString(
    `Synced ${productsCount} products, ${transactionsCount} invoices, ${customersCount} customers from ${safeDeviceName}`,
    240,
    'Cloud sync completed'
  );

  try {
    await setDoc(eventRef, {
      ownerId: uid,
      workspaceId,
      deviceName: safeDeviceName,
      platform,
      actionType,
      summary,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, eventPath);
  }

  return {
    workspaceId,
    updatedAtIso: cleanSnapshotPayload.pushedAtIso,
  };
}

export async function pullWorkspaceFromFirestoreCloud(params: {
  user: FirebaseUser;
  companyId: string;
  deviceName: string;
}): Promise<{
  exists: boolean;
  workspaceId: string;
  companyName?: string;
  lastDeviceName?: string;
  payload?: CloudWorkspaceSnapshotPayload;
}> {
  const uid = sanitizeRuleId(params.user.uid, 'user');
  const safeCompanyId = sanitizeRuleId(params.companyId, 'comp-default');
  const workspaceId = buildCloudWorkspaceId(uid, safeCompanyId);
  const wsPath = `cloudWorkspaces/${workspaceId}`;
  const wsRef = doc(db, 'cloudWorkspaces', workspaceId);

  try {
    const snap = await getDoc(wsRef);
    if (!snap.exists()) {
      return { exists: false, workspaceId };
    }
    const data = snap.data();

    // Record PULL event
    const eventId = sanitizeRuleId(`ev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);
    const eventRef = doc(db, 'cloudWorkspaces', workspaceId, 'syncEvents', eventId);
    const safeDeviceName = truncateString(params.deviceName, 120, 'POS Terminal');
    await setDoc(eventRef, {
      ownerId: uid,
      workspaceId,
      deviceName: safeDeviceName,
      platform: detectCurrentPlatform(),
      actionType: 'PULL',
      summary: truncateString(
        `Restored cloud snapshot (${data.productsCount || 0} products, ${data.transactionsCount || 0} invoices)`,
        240,
        'Restored from cloud'
      ),
      createdAt: serverTimestamp(),
    });

    return {
      exists: true,
      workspaceId,
      companyName: data.companyName,
      lastDeviceName: data.lastDeviceName,
      payload: data.snapshotPayload as CloudWorkspaceSnapshotPayload,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, wsPath);
  }
}

export async function fetchWorkspaceCloudSyncEvents(params: {
  user: FirebaseUser;
  companyId: string;
}): Promise<CloudSyncEventRecord[]> {
  const uid = sanitizeRuleId(params.user.uid, 'user');
  const safeCompanyId = sanitizeRuleId(params.companyId, 'comp-default');
  const workspaceId = buildCloudWorkspaceId(uid, safeCompanyId);
  const eventsPath = `cloudWorkspaces/${workspaceId}/syncEvents`;

  try {
    const q = query(
      collection(db, 'cloudWorkspaces', workspaceId, 'syncEvents'),
      where('ownerId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(8)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      const ts = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString();
      return {
        id: d.id,
        ownerId: data.ownerId,
        workspaceId: data.workspaceId,
        deviceName: data.deviceName,
        platform: data.platform,
        actionType: data.actionType,
        summary: data.summary,
        createdAtIso: ts,
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, eventsPath);
  }
}

export function subscribeToFirestoreWorkspace(params: {
  user: FirebaseUser;
  companyId: string;
  onRemoteSnapshot: (data: {
    lastDeviceName: string;
    payload: CloudWorkspaceSnapshotPayload;
  }) => void;
}): Unsubscribe {
  const uid = sanitizeRuleId(params.user.uid, 'user');
  const safeCompanyId = sanitizeRuleId(params.companyId, 'comp-default');
  const workspaceId = buildCloudWorkspaceId(uid, safeCompanyId);
  const wsPath = `cloudWorkspaces/${workspaceId}`;
  const wsRef = doc(db, 'cloudWorkspaces', workspaceId);

  return onSnapshot(
    wsRef,
    (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      if (data?.snapshotPayload) {
        params.onRemoteSnapshot({
          lastDeviceName: data.lastDeviceName || 'Cloud Peer',
          payload: data.snapshotPayload as CloudWorkspaceSnapshotPayload,
        });
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, wsPath);
    }
  );
}

export interface FirebaseAuthMappedError {
  code: string;
  messageEn: string;
  messageAr: string;
  isOfflineOrNetwork: boolean;
}

export function extractFirebaseErrorCode(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return String((error as { code?: unknown }).code || '');
  }
  return '';
}

export function mapFirebaseAuthError(error: unknown): FirebaseAuthMappedError {
  const code = extractFirebaseErrorCode(error);
  switch (code) {
    case 'auth/email-already-in-use':
      return {
        code,
        messageEn: 'This email is already registered. Sign in with it instead or reset your password.',
        messageAr: 'هذا البريد الإلكتروني مسجل مسبقاً. يمكنك تسجيل الدخول به أو استعادة كلمة المرور.',
        isOfflineOrNetwork: false,
      };
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return {
        code,
        messageEn: 'Incorrect email or password. Use "Forgot Password?" to recover via email.',
        messageAr: 'البريد الإلكتروني أو كلمة المرور غير صحيحة. استخدم "نسيت كلمة المرور؟" للاستعادة عبر البريد.',
        isOfflineOrNetwork: false,
      };
    case 'auth/invalid-email':
      return {
        code,
        messageEn: 'Please enter a valid email address.',
        messageAr: 'يرجى إدخال بريد إلكتروني صحيح.',
        isOfflineOrNetwork: false,
      };
    case 'auth/weak-password':
      return {
        code,
        messageEn: 'Password is too weak. Use at least 8 characters with letters and numbers.',
        messageAr: 'كلمة المرور ضعيفة. استخدم 8 خانات على الأقل تحتوي على أحرف وأرقام.',
        isOfflineOrNetwork: false,
      };
    case 'auth/too-many-requests':
      return {
        code,
        messageEn: 'Too many attempts. Please wait a few minutes before trying again.',
        messageAr: 'محاولات كثيرة جداً. يرجى الانتظار بضع دقائق ثم المحاولة مجدداً.',
        isOfflineOrNetwork: false,
      };
    case 'auth/operation-not-allowed':
      return {
        code,
        messageEn:
          'Email/Password sign-in is not enabled yet in Firebase Console (Authentication → Sign-in method → Email/Password).',
        messageAr:
          'تسجيل الدخول بالبريد الإلكتروني غير مفعّل بعد في لوحة Firebase (Authentication ← Sign-in method ← Email/Password).',
        isOfflineOrNetwork: false,
      };
    case 'auth/user-disabled':
      return {
        code,
        messageEn: 'This email account has been disabled.',
        messageAr: 'تم تعطيل حساب البريد الإلكتروني هذا.',
        isOfflineOrNetwork: false,
      };
    case 'auth/network-request-failed':
      return {
        code,
        messageEn: 'No internet connection. Use your offline PIN or local password.',
        messageAr: 'لا يوجد اتصال بالإنترنت. استخدم رمز الدخول السريع PIN أو كلمة المرور المحلية.',
        isOfflineOrNetwork: true,
      };
    default:
      return {
        code: code || 'auth/unknown',
        messageEn:
          error instanceof Error && error.message
            ? error.message
            : 'Email authentication failed. Please try again.',
        messageAr: 'تعذر إتمام المصادقة عبر البريد الإلكتروني. يرجى المحاولة مرة أخرى.',
        isOfflineOrNetwork: false,
      };
  }
}

export async function registerWithFirebaseEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<{ user: FirebaseUser; idToken: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
  if (displayName && displayName.trim()) {
    await updateProfile(credential.user, { displayName: displayName.trim() }).catch(() => {});
  }
  // Best-effort verification email; never blocks onboarding
  sendEmailVerification(credential.user).catch(() => {});
  const idToken = await credential.user.getIdToken(true);
  return { user: credential.user, idToken };
}

export async function signInWithFirebaseEmail(
  email: string,
  password: string
): Promise<{ user: FirebaseUser; idToken: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
  const idToken = await credential.user.getIdToken(true);
  return { user: credential.user, idToken };
}

export async function sendFirebasePasswordReset(
  email: string,
  language: 'ar' | 'en' = 'ar'
): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  auth.languageCode = language === 'ar' ? 'ar' : 'en';
  await sendPasswordResetEmail(auth, cleanEmail);
}

export async function getCurrentFirebaseIdToken(forceRefresh = false): Promise<string | null> {
  if (!auth.currentUser) return null;
  try {
    return await auth.currentUser.getIdToken(forceRefresh);
  } catch {
    return null;
  }
}

export { signInWithPopup, signOut, onAuthStateChanged };
export type { FirebaseUser };
