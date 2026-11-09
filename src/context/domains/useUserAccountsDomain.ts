/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback } from 'react';
import {
  POSUser,
  ActiveUserSession,
  UserRole,
  RolePermissions,
  WorkspaceMode,
  CompanyProfile,
  AppSettings,
} from '../../lib/types';
import {
  CapabilityCode,
  deriveCapabilitiesFromUser,
  deriveLegacyPermissionsFromCapabilities,
  mapSystemRoleToLegacyRole,
  userHasCapability,
} from '../../lib/rbac-capabilities';
import { DEFAULT_ROLE_PERMISSIONS } from '../../lib/initial-data';
import { playSuccessChime, triggerHaptic } from '../../lib/sound-fx';
import { STORAGE_KEYS, getCompanyStorageKey } from '../pos-storage-helpers';

interface UseUserAccountsDomainParams {
  users: POSUser[];
  setUsers: React.Dispatch<React.SetStateAction<POSUser[]>>;
  setActiveSessions: React.Dispatch<React.SetStateAction<ActiveUserSession[]>>;
  currentUserId: string;
  setCurrentUserId: React.Dispatch<React.SetStateAction<string>>;
  currentUser: POSUser;
  currentCompany: CompanyProfile;
  currentCompanyId: string;
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
  activeBranchId,
  workspaceMode,
  settings,
}: UseUserAccountsDomainParams) {
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

      const saved: POSUser = existing
        ? {
            ...existing,
            ...userData,
            role: resolvedLegacyRole,
            capabilities: resolvedCapabilities,
            permissions: rolePerms,
            lastActiveAt: nowIso,
          }
        : {
            id: `user-${Date.now()}`,
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
            pin: userData.pin || '0000',
            terminalName: userData.terminalName || `POS Terminal 0${users.length + 1}`,
            terminalNameAr: userData.terminalNameAr || `نقطة بيع ${users.length + 1}`,
            avatarColor: userData.avatarColor || '#f59e0b',
            isActive: userData.isActive ?? true,
            permissions: rolePerms,
            lastActiveAt: nowIso,
          };

      setUsers((prev) => {
        const exists = prev.some((u) => u.id === saved.id);
        return exists ? prev.map((u) => (u.id === saved.id ? saved : u)) : [...prev, saved];
      });

      if (
        workspaceMode === 'PRODUCTION' &&
        currentUser.id !== 'unassigned-operator' &&
        currentCompany.id !== 'comp-clean-store'
      ) {
        const endpoint = existing ? `/api/users/${saved.id}` : '/api/users';
        const method = existing ? 'PUT' : 'POST';
        fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': currentUser.id,
            'x-company-id': currentCompany.id,
          },
          body: JSON.stringify({
            ...saved,
            password: userData.password,
          }),
        }).catch(() => {});
      }

      if (saved.isActive) {
        setActiveSessions((prev) => {
          const hasSess = prev.some((s) => s.userId === saved.id);
          if (hasSess) {
            return prev.map((s) =>
                s.userId === saved.id
                  ? {
                      ...s,
                      userName: saved.name,
                      userNameAr: saved.nameAr,
                      role: saved.role,
                      terminalName: saved.terminalName,
                      terminalNameAr: saved.terminalNameAr,
                      lastPingAt: nowIso,
                    }
                  : s
            );
          }
          return [
            ...prev,
            {
              sessionId: `sess-${saved.id}-${Date.now()}`,
              userId: saved.id,
              userName: saved.name,
              userNameAr: saved.nameAr,
              role: saved.role,
              terminalName: saved.terminalName,
              terminalNameAr: saved.terminalNameAr,
              startedAt: nowIso,
              lastPingAt: nowIso,
              status: 'online',
            },
          ];
        });
      } else {
        setActiveSessions((prev) => prev.filter((s) => s.userId !== saved.id));
      }

      triggerHaptic('success', settings.hapticsEnabled);
      return saved;
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
            body: JSON.stringify({ newPassword, newPin }),
          });
        } catch {}
      }
      if (newPin && newPin.trim().length > 0) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, pin: newPin.trim() } : u))
        );
      }
      playSuccessChime(settings.soundEnabled);
      triggerHaptic('success', settings.hapticsEnabled);
      return { ok: true };
    },
    [
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
      setUsers((prev) => {
        const next = prev.filter((u) => u.id !== userId);
        if (currentUserId === userId) {
          setCurrentUserId(next[0]?.id || 'unassigned-operator');
        }
        return next;
      });
      setActiveSessions((prev) => prev.filter((s) => s.userId !== userId));
      triggerHaptic('medium', settings.hapticsEnabled);
    },
    [currentUserId, settings.hapticsEnabled, setUsers, setCurrentUserId, setActiveSessions]
  );

  const clearAllUserAccounts = useCallback(() => {
    setUsers([]);
    setActiveSessions([]);
    setCurrentUserId('unassigned-operator');
    try {
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      localStorage.removeItem(getCompanyStorageKey(STORAGE_KEYS.USERS, currentCompanyId));
      localStorage.removeItem(getCompanyStorageKey(STORAGE_KEYS.ACTIVE_SESSIONS, currentCompanyId));
    } catch {}
    playSuccessChime(settings.soundEnabled);
    triggerHaptic('heavy', settings.hapticsEnabled);
  }, [
    currentCompanyId,
    settings.soundEnabled,
    settings.hapticsEnabled,
    setUsers,
    setActiveSessions,
    setCurrentUserId,
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
