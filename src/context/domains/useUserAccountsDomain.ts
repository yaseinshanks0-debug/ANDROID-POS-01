/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useState } from 'react';
import type {
  POSUser,
  ActiveUserSession,
  UserRole,
  RolePermissions,
  WorkspaceMode,
  CompanyProfile,
  BranchRecord,
  AppSettings,
} from '../../lib/types';
import {
  CapabilityCode,
  deriveCapabilitiesFromUser,
  deriveLegacyPermissionsFromCapabilities,
  getDefaultCapabilitiesForRole,
  mapSystemRoleToLegacyRole,
  userHasCapability,
} from '../../lib/rbac-capabilities';
import { DEFAULT_ROLE_PERMISSIONS } from '../../lib/initial-data';
import { playSuccessChime, triggerHaptic } from '../../lib/sound-fx';
import { STORAGE_KEYS, getCompanyStorageKey } from '../pos-storage-helpers';
import {
  AUTH_ERROR_CODES,
  clearAllLocalUserCredentials,
  clearVerifiedAuthSession,
  deleteLocalUserCredentials,
  evaluateLocalAccountLogin,
  loadLocalCredentialsMap,
  loadVerifiedAuthSession,
  saveLocalUserCredentials,
  saveVerifiedAuthSession,
  validatePasswordStrengthPolicy,
  validatePinPolicy,
  type AuthErrorCode,
} from '../../lib/local-auth';

export interface LoginCredentialsInput {
  usernameOrEmail?: string;
  userId?: string;
  password?: string;
  pin?: string;
}

export interface LoginCredentialsResult {
  ok: boolean;
  user?: POSUser;
  error?: string;
  errorCode?: AuthErrorCode | string;
}

export interface InitialOwnerSetupInput {
  nameAr: string;
  nameEn?: string;
  username: string;
  password: string;
  pin?: string;
}

export interface InitialOwnerSetupResult {
  ok: boolean;
  user?: POSUser;
  error?: string;
}

interface UseUserAccountsDomainParams {
  users: POSUser[];
  setUsers: React.Dispatch<React.SetStateAction<POSUser[]>>;
  setActiveSessions: React.Dispatch<React.SetStateAction<ActiveUserSession[]>>;
  currentUserId: string;
  setCurrentUserId: React.Dispatch<React.SetStateAction<string>>;
  currentUser: POSUser;
  currentCompany: CompanyProfile;
  currentCompanyId: string;
  setCurrentCompanyId: React.Dispatch<React.SetStateAction<string>>;
  setCompanies: React.Dispatch<React.SetStateAction<CompanyProfile[]>>;
  setAllBranches: React.Dispatch<React.SetStateAction<BranchRecord[]>>;
  setActiveBranchId: (branchId: string) => void;
  activeBranchId: string;
  workspaceMode: WorkspaceMode;
  settings: AppSettings;
}

export function useUserAccountsDomain({
  users,
  setUsers,
  setActiveSessions,
  currentUserId,
  setCurrentUserId,
  currentUser,
  currentCompany,
  currentCompanyId,
  setCurrentCompanyId,
  setCompanies,
  setAllBranches,
  setActiveBranchId,
  activeBranchId,
  workspaceMode,
  settings,
}: UseUserAccountsDomainParams) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedSession = loadVerifiedAuthSession();
    if (!savedSession) return false;
    if (workspaceMode === 'PRACTICE') return true;
    return users.some((u) => u.id === savedSession.userId && u.isActive !== false);
  });

  const [isScreenLocked, setIsScreenLocked] = useState<boolean>(false);
  const [pendingSwitchUserId, setPendingSwitchUserId] = useState<string | null>(null);

  const markSessionAuthenticated = useCallback(
    (userId: string, companyId?: string, mode?: WorkspaceMode) => {
      const effectiveCompanyId = companyId || currentCompany.id;
      const effectiveMode = mode || workspaceMode;
      saveVerifiedAuthSession({
        userId,
        companyId: effectiveCompanyId,
        workspaceMode: effectiveMode,
        authenticatedAt: new Date().toISOString(),
      });
      setIsAuthenticated(true);
      setIsScreenLocked(false);
      setPendingSwitchUserId(null);
    },
    [currentCompany.id, workspaceMode]
  );

  const markSessionUnauthenticated = useCallback((lock = false) => {
    clearVerifiedAuthSession();
    setIsAuthenticated(false);
    setIsScreenLocked(lock);
    setPendingSwitchUserId(null);
  }, []);

  const switchCurrentUser = useCallback(
    (userId: string) => {
      const targetUser = users.find((u) => u.id === userId);
      if (!targetUser || targetUser.isActive === false) return;
      const nowIso = new Date().toISOString();
      setCurrentUserId(userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, lastActiveAt: nowIso, isActive: true } : u))
      );
      setActiveSessions((prev) => {
        const exists = prev.some((s) => s.userId === userId);
        if (exists) {
          return prev.map((s) =>
            s.userId === userId ? { ...s, lastPingAt: nowIso, status: 'online' } : s
          );
        }
        return [
          ...prev,
          {
            sessionId: `sess-${userId}-${Date.now()}`,
            userId: targetUser.id,
            userName: targetUser.name,
            userNameAr: targetUser.nameAr,
            role: targetUser.role,
            terminalName: targetUser.terminalName,
            terminalNameAr: targetUser.terminalNameAr,
            startedAt: nowIso,
            lastPingAt: nowIso,
            status: 'online',
          },
        ];
      });
      triggerHaptic('light', settings.hapticsEnabled);
    },
    [users, settings.hapticsEnabled, setCurrentUserId, setUsers, setActiveSessions]
  );

  const requestAuthenticatedUserSwitch = useCallback(
    (userId: string) => {
      if (!userId || userId === currentUser.id) return;
      const targetUser = users.find((u) => u.id === userId);
      if (!targetUser || targetUser.isActive === false) return;
      setPendingSwitchUserId(userId);
    },
    [currentUser.id, users]
  );

  const cancelUserSwitchRequest = useCallback(() => {
    setPendingSwitchUserId(null);
  }, []);

  const loginWithCredentials = useCallback(
    async (input: LoginCredentialsInput): Promise<LoginCredentialsResult> => {
      const isAr = settings.language === 'ar';
      const cleanUsername = String(input.usernameOrEmail || '').trim();
      const cleanPassword = String(input.password || '').trim();
      const cleanPin = String(input.pin || '').trim();
      const targetUserId = input.userId?.trim() || undefined;

      const isOfflineOnlyLocalAccount =
        currentCompany.id === 'comp-clean-store' &&
        users.some((u) => {
          if (targetUserId && u.id === targetUserId) return true;
          if (!cleanUsername) return false;
          const lowered = cleanUsername.toLowerCase();
          return (
            u.username?.toLowerCase() === lowered ||
            u.email?.toLowerCase() === lowered
          );
        });

      // 1. Try server-side authentication first in PRODUCTION mode (except known local-only offline store accounts)
      if (workspaceMode === 'PRODUCTION' && !isOfflineOnlyLocalAccount) {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              usernameOrEmail: cleanUsername || undefined,
              userId: targetUserId,
              password: cleanPassword || undefined,
              pin: cleanPin || undefined,
              companyId:
                currentCompany.id && currentCompany.id !== 'comp-clean-store'
                  ? currentCompany.id
                  : undefined,
              workspaceMode: 'PRODUCTION',
            }),
          });

          const json = await response.json().catch(() => null);

          if (response.ok && json?.success && json?.data?.user) {
            const serverUser = json.data.user as POSUser;
            const serverCompany = json.data.company as CompanyProfile | undefined;
            const serverBranches = Array.isArray(json.data.branches)
              ? (json.data.branches as BranchRecord[])
              : [];
            const sessionToken =
              typeof json.data.sessionToken === 'string' ? json.data.sessionToken : '';

            if (sessionToken) {
              try {
                localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, sessionToken);
              } catch {}
            }

            // Cache local salted hash so future offline logins on this terminal also succeed
            if (cleanPassword || cleanPin) {
              saveLocalUserCredentials(serverUser.id, {
                password: cleanPassword || undefined,
                pin: cleanPin || undefined,
              });
            }

            if (serverCompany && serverCompany.id && serverCompany.id !== 'comp-demo-practice') {
              setCompanies((prev) => {
                const exists = prev.some((c) => c.id === serverCompany.id);
                return exists
                  ? prev.map((c) => (c.id === serverCompany.id ? { ...c, ...serverCompany } : c))
                  : [...prev, serverCompany];
              });
              if (currentCompany.id === 'comp-clean-store' || currentCompany.id !== serverCompany.id) {
                setCurrentCompanyId(serverCompany.id);
              }
            }

            if (serverBranches.length > 0) {
              setAllBranches((prev) => {
                const map = new Map<string, BranchRecord>();
                for (const b of prev) map.set(b.id, b);
                for (const b of serverBranches) map.set(b.id, b);
                return Array.from(map.values());
              });
              setActiveBranchId(serverBranches[0].id);
            }

            const nowIso = new Date().toISOString();
            const normalizedUser: POSUser = {
              ...serverUser,
              hasPassword: serverUser.hasPassword || Boolean(cleanPassword),
              lastLoginAt: nowIso,
              lastActiveAt: nowIso,
            };

            setUsers((prev) => {
              const exists = prev.some((u) => u.id === normalizedUser.id);
              return exists
                ? prev.map((u) => (u.id === normalizedUser.id ? { ...u, ...normalizedUser } : u))
                : [...prev, normalizedUser];
            });
            setCurrentUserId(normalizedUser.id);
            setActiveSessions((prev) => {
              const exists = prev.some((s) => s.userId === normalizedUser.id);
              if (exists) {
                return prev.map((s) =>
                  s.userId === normalizedUser.id
                    ? { ...s, lastPingAt: nowIso, status: 'online' }
                    : s
                );
              }
              return [
                ...prev,
                {
                  sessionId: `sess-${normalizedUser.id}-${Date.now()}`,
                  userId: normalizedUser.id,
                  companyId: serverCompany?.id || currentCompany.id,
                  workspaceMode: 'PRODUCTION',
                  userName: normalizedUser.name,
                  userNameAr: normalizedUser.nameAr,
                  role: normalizedUser.role,
                  systemRole: normalizedUser.systemRole,
                  branchId: normalizedUser.branchId,
                  terminalName: normalizedUser.terminalName,
                  terminalNameAr: normalizedUser.terminalNameAr,
                  startedAt: nowIso,
                  lastPingAt: nowIso,
                  status: 'online',
                },
              ];
            });

            markSessionAuthenticated(
              normalizedUser.id,
              serverCompany?.id || currentCompany.id,
              'PRODUCTION'
            );
            playSuccessChime(settings.soundEnabled);
            triggerHaptic('success', settings.hapticsEnabled);
            return { ok: true, user: normalizedUser };
          }

          // If the server FOUND the user and explicitly rejected password/PIN or deactivated status,
          // NEVER fall back to local bypass.
          const serverErrorCode = String(json?.errorCode || '');
          const serverErrorMsg = String(json?.error || '');
          const isServerUserNotFound =
            serverErrorCode === 'INVALID_CREDENTIALS' &&
            serverErrorMsg.toLowerCase().includes('user not found');

          if (response.status === 403 || (response.status === 401 && !isServerUserNotFound)) {
            let localizedError = serverErrorMsg;
            if (serverErrorCode === 'USER_ACCOUNT_DEACTIVATED') {
              localizedError = isAr
                ? 'تم تعطيل هذا الحساب من قبل المدير ولا يمكن تسجيل الدخول به.'
                : 'This employee account has been deactivated by an administrator.';
            } else if (serverErrorMsg.toLowerCase().includes('incorrect password')) {
              localizedError = isAr
                ? 'كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.'
                : 'Incorrect password. Please try again.';
            } else if (serverErrorMsg.toLowerCase().includes('incorrect pin')) {
              localizedError = isAr
                ? 'رمز الدخول السريع PIN غير صحيح. يرجى المحاولة مرة أخرى.'
                : 'Incorrect PIN code. Please try again.';
            } else if (
              serverErrorCode === 'PASSWORD_REQUIRED' ||
              serverErrorCode === 'PIN_REQUIRED'
            ) {
              localizedError = isAr
                ? 'يرجى إدخال كلمة المرور أو رمز الدخول السريع PIN.'
                : 'Password or PIN code is required for this account.';
            }
            return {
              ok: false,
              errorCode: serverErrorCode || AUTH_ERROR_CODES.INVALID_CREDENTIALS,
              error: localizedError,
            };
          }
        } catch {
          // Offline / network unavailable — proceed to local salted credential verification
        }
      }

      // 2. Local salted verification (offline-first / comp-clean-store / Practice Mode)
      const credentialsMap = loadLocalCredentialsMap();
      const localResult = evaluateLocalAccountLogin({
        users,
        credentialsMap,
        userId: targetUserId,
        usernameOrEmail: cleanUsername || undefined,
        password: cleanPassword || undefined,
        pin: cleanPin || undefined,
      });

      if (!localResult.ok || !localResult.user) {
        return {
          ok: false,
          user: localResult.user,
          errorCode: localResult.errorCode,
          error: isAr ? localResult.messageAr : localResult.messageEn,
        };
      }

      const authenticatedUser = localResult.user;
      const nowIso = new Date().toISOString();
      setCurrentUserId(authenticatedUser.id);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === authenticatedUser.id
            ? { ...u, lastLoginAt: nowIso, lastActiveAt: nowIso, isActive: true }
            : u
        )
      );
      setActiveSessions((prev) => {
        const exists = prev.some((s) => s.userId === authenticatedUser.id);
        if (exists) {
          return prev.map((s) =>
            s.userId === authenticatedUser.id ? { ...s, lastPingAt: nowIso, status: 'online' } : s
          );
        }
        return [
          ...prev,
          {
            sessionId: `sess-${authenticatedUser.id}-${Date.now()}`,
            userId: authenticatedUser.id,
            companyId: currentCompany.id,
            workspaceMode,
            userName: authenticatedUser.name,
            userNameAr: authenticatedUser.nameAr,
            role: authenticatedUser.role,
            systemRole: authenticatedUser.systemRole,
            branchId: authenticatedUser.branchId,
            terminalName: authenticatedUser.terminalName,
            terminalNameAr: authenticatedUser.terminalNameAr,
            startedAt: nowIso,
            lastPingAt: nowIso,
            status: 'online',
          },
        ];
      });

      markSessionAuthenticated(authenticatedUser.id, currentCompany.id, workspaceMode);
      playSuccessChime(settings.soundEnabled);
      triggerHaptic('success', settings.hapticsEnabled);
      return { ok: true, user: authenticatedUser };
    },
    [
      settings.language,
      settings.soundEnabled,
      settings.hapticsEnabled,
      workspaceMode,
      currentCompany.id,
      users,
      setCompanies,
      setCurrentCompanyId,
      setAllBranches,
      setActiveBranchId,
      setUsers,
      setCurrentUserId,
      setActiveSessions,
      markSessionAuthenticated,
    ]
  );

  const setupInitialOwnerAccount = useCallback(
    async (input: InitialOwnerSetupInput): Promise<InitialOwnerSetupResult> => {
      const isAr = settings.language === 'ar';
      const cleanNameAr = input.nameAr.trim();
      const cleanNameEn = (input.nameEn || '').trim() || cleanNameAr;
      const cleanUsername = input.username.trim();
      const cleanPassword = input.password.trim();
      const cleanPin = (input.pin || '').trim();

      if (!cleanNameAr && !cleanNameEn) {
        return {
          ok: false,
          error: isAr ? 'يرجى إدخال اسم المدير أو صاحب المتجر.' : 'Please enter the owner name.',
        };
      }
      if (cleanUsername.length < 2) {
        return {
          ok: false,
          error: isAr
            ? 'يرجى إدخال اسم مستخدم صالح (حرفان على الأقل).'
            : 'Please enter a valid username (at least 2 characters).',
        };
      }
      const pwdCheck = validatePasswordStrengthPolicy(cleanPassword);
      if (!pwdCheck.valid) {
        return {
          ok: false,
          error: isAr ? pwdCheck.messageAr : pwdCheck.messageEn,
        };
      }
      if (cleanPin) {
        const pinCheck = validatePinPolicy(cleanPin);
        if (!pinCheck.valid) {
          return {
            ok: false,
            error: isAr ? pinCheck.messageAr : pinCheck.messageEn,
          };
        }
      }

      const nowIso = new Date().toISOString();
      const ownerId = `usr-owner-${Date.now().toString(36)}`;
      const ownerCaps = getDefaultCapabilitiesForRole('COMPANY_OWNER');
      const ownerPerms =
        deriveLegacyPermissionsFromCapabilities(ownerCaps) || { ...DEFAULT_ROLE_PERMISSIONS.admin };
      const primaryBranchId = activeBranchId || `branch-${currentCompany.id}-main`;

      const ownerUser: POSUser = {
        id: ownerId,
        companyId: currentCompany.id,
        branchId: primaryBranchId,
        assignedBranchIds: [primaryBranchId],
        name: cleanNameEn,
        nameAr: cleanNameAr || cleanNameEn,
        username: cleanUsername,
        role: 'admin',
        systemRole: 'COMPANY_OWNER',
        capabilities: ownerCaps,
        pin: '',
        hasPassword: true,
        terminalName: 'POS Terminal 01',
        terminalNameAr: 'نقطة بيع 1',
        avatarColor: '#f59e0b',
        isActive: true,
        permissions: ownerPerms,
        lastActiveAt: nowIso,
        lastLoginAt: nowIso,
      };

      saveLocalUserCredentials(ownerId, {
        password: cleanPassword,
        pin: cleanPin || undefined,
      });

      setUsers((prev) => [...prev, ownerUser]);
      setCurrentUserId(ownerId);
      setActiveSessions([
        {
          sessionId: `sess-${ownerId}-${Date.now()}`,
          userId: ownerId,
          companyId: currentCompany.id,
          workspaceMode: 'PRODUCTION',
          userName: ownerUser.name,
          userNameAr: ownerUser.nameAr,
          role: ownerUser.role,
          systemRole: ownerUser.systemRole,
          branchId: primaryBranchId,
          terminalName: ownerUser.terminalName,
          terminalNameAr: ownerUser.terminalNameAr,
          startedAt: nowIso,
          lastPingAt: nowIso,
          status: 'online',
        },
      ]);

      markSessionAuthenticated(ownerId, currentCompany.id, 'PRODUCTION');
      playSuccessChime(settings.soundEnabled);
      triggerHaptic('success', settings.hapticsEnabled);
      return { ok: true, user: ownerUser };
    },
    [
      settings.language,
      settings.soundEnabled,
      settings.hapticsEnabled,
      activeBranchId,
      currentCompany.id,
      setUsers,
      setCurrentUserId,
      setActiveSessions,
      markSessionAuthenticated,
    ]
  );

  const setLegacyAccountPassword = useCallback(
    async (
      userId: string,
      newPassword: string,
      newPin?: string
    ): Promise<{ ok: boolean; error?: string }> => {
      const isAr = settings.language === 'ar';
      const targetUser = users.find((u) => u.id === userId);
      if (!targetUser) {
        return {
          ok: false,
          error: isAr ? 'الحساب غير موجود.' : 'Account not found.',
        };
      }
      const pwdCheck = validatePasswordStrengthPolicy(newPassword);
      if (!pwdCheck.valid) {
        return {
          ok: false,
          error: isAr ? pwdCheck.messageAr : pwdCheck.messageEn,
        };
      }
      const cleanPin = (newPin || '').trim();
      if (cleanPin) {
        const pinCheck = validatePinPolicy(cleanPin);
        if (!pinCheck.valid) {
          return {
            ok: false,
            error: isAr ? pinCheck.messageAr : pinCheck.messageEn,
          };
        }
      }

      saveLocalUserCredentials(userId, {
        password: newPassword.trim(),
        pin: cleanPin || undefined,
      });

      const nowIso = new Date().toISOString();
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                hasPassword: true,
                pin: '',
                lastLoginAt: nowIso,
                lastActiveAt: nowIso,
              }
            : u
        )
      );
      setCurrentUserId(userId);
      setActiveSessions((prev) => {
        const exists = prev.some((s) => s.userId === userId);
        if (exists) {
          return prev.map((s) => (s.userId === userId ? { ...s, lastPingAt: nowIso } : s));
        }
        return [
          ...prev,
          {
            sessionId: `sess-${userId}-${Date.now()}`,
            userId: targetUser.id,
            companyId: currentCompany.id,
            workspaceMode,
            userName: targetUser.name,
            userNameAr: targetUser.nameAr,
            role: targetUser.role,
            systemRole: targetUser.systemRole,
            branchId: targetUser.branchId,
            terminalName: targetUser.terminalName,
            terminalNameAr: targetUser.terminalNameAr,
            startedAt: nowIso,
            lastPingAt: nowIso,
            status: 'online',
          },
        ];
      });

      markSessionAuthenticated(userId, currentCompany.id, workspaceMode);
      playSuccessChime(settings.soundEnabled);
      triggerHaptic('success', settings.hapticsEnabled);
      return { ok: true };
    },
    [
      settings.language,
      settings.soundEnabled,
      settings.hapticsEnabled,
      users,
      currentCompany.id,
      workspaceMode,
      setUsers,
      setCurrentUserId,
      setActiveSessions,
      markSessionAuthenticated,
    ]
  );

  const lockScreen = useCallback(() => {
    markSessionUnauthenticated(true);
    triggerHaptic('medium', settings.hapticsEnabled);
  }, [markSessionUnauthenticated, settings.hapticsEnabled]);

  const logoutCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {});
      }
      localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
    } catch {}
    markSessionUnauthenticated(true);
    triggerHaptic('medium', settings.hapticsEnabled);
  }, [markSessionUnauthenticated, settings.hapticsEnabled]);

  const saveUser = useCallback(
    (userData: Partial<POSUser> & { name: string; role: UserRole; password?: string }): POSUser => {
      const nowIso = new Date().toISOString();
      const existing = userData.id ? users.find((u) => u.id === userData.id) : undefined;
      const resolvedLegacyRole = userData.systemRole
        ? mapSystemRoleToLegacyRole(userData.systemRole)
        : userData.role;
      const fallbackPerms = {
        ...DEFAULT_ROLE_PERMISSIONS[resolvedLegacyRole],
      };
      const resolvedCapabilities =
        Array.isArray(userData.capabilities) && userData.capabilities.length > 0
          ? (userData.capabilities as CapabilityCode[])
          : deriveCapabilitiesFromUser({
              role: resolvedLegacyRole,
              systemRole: userData.systemRole,
              permissions: userData.permissions || fallbackPerms,
            });
      const rolePerms =
        userData.permissions ||
        deriveLegacyPermissionsFromCapabilities(resolvedCapabilities) ||
        fallbackPerms;

      const cleanPassword = typeof userData.password === 'string' ? userData.password.trim() : '';
      const cleanPin =
        typeof userData.pin === 'string' && !userData.pin.startsWith('scrypt$')
          ? userData.pin.trim()
          : '';

      const userId = existing ? existing.id : userData.id || `user-${Date.now()}`;

      if (cleanPassword || cleanPin) {
        saveLocalUserCredentials(userId, {
          password: cleanPassword || undefined,
          pin: cleanPin || undefined,
        });
      }

      const saved: POSUser = existing
        ? {
            ...existing,
            ...userData,
            id: userId,
            role: resolvedLegacyRole,
            capabilities: resolvedCapabilities,
            permissions: rolePerms,
            hasPassword: existing.hasPassword || Boolean(cleanPassword),
            pin: cleanPin ? '' : existing.pin || '',
            lastActiveAt: nowIso,
          }
        : {
            id: userId,
            companyId: currentCompany.id,
            branchId: userData.branchId || activeBranchId || 'branch-main',
            assignedBranchIds: userData.assignedBranchIds || [
              userData.branchId || activeBranchId || 'branch-main',
            ],
            name: userData.name.trim(),
            nameAr: userData.nameAr?.trim() || userData.name.trim(),
            username:
              userData.username?.trim() ||
              userData.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '.'),
            email: userData.email?.trim() || undefined,
            phone: userData.phone?.trim() || undefined,
            role: resolvedLegacyRole,
            systemRole: userData.systemRole,
            capabilities: resolvedCapabilities,
            pin: '',
            hasPassword: Boolean(cleanPassword),
            terminalName: userData.terminalName || `POS Terminal 0${users.length + 1}`,
            terminalNameAr: userData.terminalNameAr || `نقطة بيع ${users.length + 1}`,
            avatarColor: userData.avatarColor || '#f59e0b',
            isActive: userData.isActive ?? true,
            permissions: rolePerms,
            lastActiveAt: nowIso,
          };

      // Strip plaintext password property if spread from userData
      const sanitizedSaved = { ...saved } as POSUser & { password?: string };
      delete sanitizedSaved.password;

      setUsers((prev) => {
        const exists = prev.some((u) => u.id === sanitizedSaved.id);
        return exists
          ? prev.map((u) => (u.id === sanitizedSaved.id ? sanitizedSaved : u))
          : [...prev, sanitizedSaved];
      });

      if (
        workspaceMode === 'PRODUCTION' &&
        currentUser.id !== 'unassigned-operator' &&
        currentCompany.id !== 'comp-clean-store'
      ) {
        const endpoint = existing ? `/api/users/${sanitizedSaved.id}` : '/api/users';
        const method = existing ? 'PUT' : 'POST';
        fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': currentUser.id,
            'x-company-id': currentCompany.id,
          },
          body: JSON.stringify({
            ...sanitizedSaved,
            password: cleanPassword || undefined,
            pin: cleanPin || undefined,
          }),
        }).catch(() => {});
      }

      if (sanitizedSaved.isActive) {
        setActiveSessions((prev) => {
          const hasSess = prev.some((s) => s.userId === sanitizedSaved.id);
          if (hasSess) {
            return prev.map((s) =>
              s.userId === sanitizedSaved.id
                ? {
                    ...s,
                    userName: sanitizedSaved.name,
                    userNameAr: sanitizedSaved.nameAr,
                    role: sanitizedSaved.role,
                    terminalName: sanitizedSaved.terminalName,
                    terminalNameAr: sanitizedSaved.terminalNameAr,
                    lastPingAt: nowIso,
                  }
                : s
            );
          }
          return [
            ...prev,
            {
              sessionId: `sess-${sanitizedSaved.id}-${Date.now()}`,
              userId: sanitizedSaved.id,
              userName: sanitizedSaved.name,
              userNameAr: sanitizedSaved.nameAr,
              role: sanitizedSaved.role,
              terminalName: sanitizedSaved.terminalName,
              terminalNameAr: sanitizedSaved.terminalNameAr,
              startedAt: nowIso,
              lastPingAt: nowIso,
              status: 'online',
            },
          ];
        });
      } else {
        setActiveSessions((prev) => prev.filter((s) => s.userId !== sanitizedSaved.id));
      }

      triggerHaptic('success', settings.hapticsEnabled);
      return sanitizedSaved;
    },
    [
      users,
      currentCompany.id,
      activeBranchId,
      workspaceMode,
      currentUser.id,
      settings.hapticsEnabled,
      setUsers,
      setActiveSessions,
    ]
  );

  const deactivateUserAccount = useCallback(
    async (userId: string, reason?: string): Promise<{ ok: boolean; error?: string }> => {
      const target = users.find((u) => u.id === userId);
      if (!target) return { ok: false, error: 'User not found.' };

      if (
        workspaceMode === 'PRODUCTION' &&
        currentUser.id !== 'unassigned-operator' &&
        currentCompany.id !== 'comp-clean-store'
      ) {
        try {
          await fetch(`/api/users/${userId}/deactivate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': currentUser.id,
              'x-company-id': currentCompany.id,
            },
            body: JSON.stringify({ reason }),
          });
        } catch {}
      }

      const nowIso = new Date().toISOString();
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                isActive: false,
                deactivatedAt: nowIso,
                deactivatedBy: currentUser.id,
                deactivationReason: reason || 'Deactivated by administrator',
              }
            : u
        )
      );
      setActiveSessions((prev) => prev.filter((s) => s.userId !== userId));
      if (currentUserId === userId) {
        const nextActive = users.find((u) => u.id !== userId && u.isActive !== false);
        setCurrentUserId(nextActive?.id || 'unassigned-operator');
        markSessionUnauthenticated(true);
      }
      triggerHaptic('medium', settings.hapticsEnabled);
      return { ok: true };
    },
    [
      users,
      workspaceMode,
      currentUser.id,
      currentCompany.id,
      currentUserId,
      settings.hapticsEnabled,
      setUsers,
      setActiveSessions,
      setCurrentUserId,
      markSessionUnauthenticated,
    ]
  );

  const reactivateUserAccount = useCallback(
    async (userId: string): Promise<{ ok: boolean; error?: string }> => {
      if (
        workspaceMode === 'PRODUCTION' &&
        currentUser.id !== 'unassigned-operator' &&
        currentCompany.id !== 'comp-clean-store'
      ) {
        try {
          await fetch(`/api/users/${userId}/activate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': currentUser.id,
              'x-company-id': currentCompany.id,
            },
          });
        } catch {}
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                isActive: true,
                deactivatedAt: undefined,
                deactivatedBy: undefined,
              }
            : u
        )
      );
      triggerHaptic('success', settings.hapticsEnabled);
      return { ok: true };
    },
    [workspaceMode, currentUser.id, currentCompany.id, settings.hapticsEnabled, setUsers]
  );

  const resetUserPasswordOrPin = useCallback(
    async (
      userId: string,
      newPassword?: string,
      newPin?: string
    ): Promise<{ ok: boolean; error?: string }> => {
      const isAr = settings.language === 'ar';
      const cleanPwd = (newPassword || '').trim();
      const cleanPin = (newPin || '').trim();

      if (cleanPwd) {
        const pwdCheck = validatePasswordStrengthPolicy(cleanPwd);
        if (!pwdCheck.valid) {
          return { ok: false, error: isAr ? pwdCheck.messageAr : pwdCheck.messageEn };
        }
      }
      if (cleanPin) {
        const pinCheck = validatePinPolicy(cleanPin);
        if (!pinCheck.valid) {
          return { ok: false, error: isAr ? pinCheck.messageAr : pinCheck.messageEn };
        }
      }

      if (
        workspaceMode === 'PRODUCTION' &&
        currentUser.id !== 'unassigned-operator' &&
        currentCompany.id !== 'comp-clean-store'
      ) {
        try {
          await fetch(`/api/users/${userId}/reset-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': currentUser.id,
              'x-company-id': currentCompany.id,
            },
            body: JSON.stringify({
              newPassword: cleanPwd || undefined,
              newPin: cleanPin || undefined,
            }),
          });
        } catch {}
      }

      if (cleanPwd || cleanPin) {
        saveLocalUserCredentials(userId, {
          password: cleanPwd || undefined,
          pin: cleanPin || undefined,
        });
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  hasPassword: u.hasPassword || Boolean(cleanPwd),
                  pin: cleanPin ? '' : u.pin || '',
                }
              : u
          )
        );
      }
      playSuccessChime(settings.soundEnabled);
      triggerHaptic('success', settings.hapticsEnabled);
      return { ok: true };
    },
    [
      settings.language,
      workspaceMode,
      currentUser.id,
      currentCompany.id,
      settings.soundEnabled,
      settings.hapticsEnabled,
      setUsers,
    ]
  );

  const deleteUserAccount = useCallback(
    (userId: string) => {
      deleteLocalUserCredentials(userId);
      setUsers((prev) => {
        const next = prev.filter((u) => u.id !== userId);
        if (currentUserId === userId) {
          setCurrentUserId(next[0]?.id || 'unassigned-operator');
          markSessionUnauthenticated(true);
        }
        return next;
      });
      setActiveSessions((prev) => prev.filter((s) => s.userId !== userId));
      triggerHaptic('medium', settings.hapticsEnabled);
    },
    [
      currentUserId,
      settings.hapticsEnabled,
      setUsers,
      setCurrentUserId,
      setActiveSessions,
      markSessionUnauthenticated,
    ]
  );

  const clearAllUserAccounts = useCallback(() => {
    clearAllLocalUserCredentials();
    setUsers([]);
    setActiveSessions([]);
    setCurrentUserId('unassigned-operator');
    try {
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
      localStorage.removeItem(getCompanyStorageKey(STORAGE_KEYS.USERS, currentCompanyId));
      localStorage.removeItem(getCompanyStorageKey(STORAGE_KEYS.ACTIVE_SESSIONS, currentCompanyId));
    } catch {}
    markSessionUnauthenticated(false);
    playSuccessChime(settings.soundEnabled);
    triggerHaptic('heavy', settings.hapticsEnabled);
  }, [
    currentCompanyId,
    settings.soundEnabled,
    settings.hapticsEnabled,
    setUsers,
    setActiveSessions,
    setCurrentUserId,
    markSessionUnauthenticated,
  ]);

  const removeUser = useCallback(
    (userId: string) => {
      deleteUserAccount(userId);
    },
    [deleteUserAccount]
  );

  const toggleUserActiveSession = useCallback(
    (userId: string, terminalName?: string) => {
      const targetUser = users.find((u) => u.id === userId);
      if (!targetUser || targetUser.isActive === false) return;
      const nowIso = new Date().toISOString();

      setActiveSessions((prev) => {
        const exists = prev.some((s) => s.userId === userId);
        if (exists) {
          if (prev.length <= 1) return prev;
          return prev.filter((s) => s.userId !== userId);
        }
        return [
          ...prev,
          {
            sessionId: `sess-${userId}-${Date.now()}`,
            userId: targetUser.id,
            userName: targetUser.name,
            userNameAr: targetUser.nameAr,
            role: targetUser.role,
            terminalName: terminalName || targetUser.terminalName,
            terminalNameAr: targetUser.terminalNameAr,
            startedAt: nowIso,
            lastPingAt: nowIso,
            status: 'online',
          },
        ];
      });
      triggerHaptic('light', settings.hapticsEnabled);
    },
    [users, settings.hapticsEnabled, setActiveSessions]
  );

  const hasPermission = useCallback(
    (permission: keyof RolePermissions): boolean => {
      if (!currentUser || !currentUser.permissions) return true;
      return Boolean(currentUser.permissions[permission]);
    },
    [currentUser]
  );

  const hasCapability = useCallback(
    (capability: CapabilityCode): boolean => {
      return userHasCapability(currentUser, capability);
    },
    [currentUser]
  );

  return {
    isAuthenticated,
    isScreenLocked,
    pendingSwitchUserId,
    markSessionAuthenticated,
    markSessionUnauthenticated,
    loginWithCredentials,
    setupInitialOwnerAccount,
    setLegacyAccountPassword,
    logoutCurrentUser,
    lockScreen,
    requestAuthenticatedUserSwitch,
    cancelUserSwitchRequest,
    switchCurrentUser,
    saveUser,
    deactivateUserAccount,
    reactivateUserAccount,
    resetUserPasswordOrPin,
    deleteUserAccount,
    clearAllUserAccounts,
    removeUser,
    toggleUserActiveSession,
    hasPermission,
    hasCapability,
  };
}
