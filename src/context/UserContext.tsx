/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext } from 'react';
import {
  POSUser,
  ActiveUserSession,
  UserRole,
  RolePermissions,
} from '../lib/types';
import { CapabilityCode } from '../lib/rbac-capabilities';

export interface UserContextType {
  users: POSUser[];
  activeSessions: ActiveUserSession[];
  currentUser: POSUser;
  switchCurrentUser: (userId: string) => void;
  saveUser: (
    userData: Partial<POSUser> & { name: string; role: UserRole; password?: string }
  ) => POSUser;
  removeUser: (userId: string) => void;
  deleteUserAccount: (userId: string) => void;
  clearAllUserAccounts: () => void;
  deactivateUserAccount: (
    userId: string,
    reason?: string
  ) => Promise<{ ok: boolean; error?: string }>;
  reactivateUserAccount: (userId: string) => Promise<{ ok: boolean; error?: string }>;
  resetUserPasswordOrPin: (
    userId: string,
    newPassword?: string,
    newPin?: string
  ) => Promise<{ ok: boolean; error?: string }>;
  toggleUserActiveSession: (userId: string, terminalName?: string) => void;
  hasPermission: (permission: keyof RolePermissions) => boolean;
  hasCapability: (capability: CapabilityCode) => boolean;
}

export const UserContext = createContext<UserContextType | null>(null);

export function useUserContext(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContext.Provider');
  }
  return context;
}
