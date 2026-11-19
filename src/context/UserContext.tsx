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

import type {
  LoginCredentialsInput,
  LoginCredentialsResult,
  InitialOwnerSetupInput,
  InitialOwnerSetupResult,
} from './domains/useUserAccountsDomain';

export interface UserContextType {
  users: POSUser[];
  activeSessions: ActiveUserSession[];
  currentUser: POSUser;
  isAuthenticated: boolean;
  isScreenLocked: boolean;
  pendingSwitchUserId: string | null;
  loginWithCredentials: (input: LoginCredentialsInput) => Promise<LoginCredentialsResult>;
  setupInitialOwnerAccount: (input: InitialOwnerSetupInput) => Promise<InitialOwnerSetupResult>;
  setLegacyAccountPassword: (
    userId: string,
    newPassword: string,
    newPin?: string
  ) => Promise<{ ok: boolean; error?: string }>;
  logoutCurrentUser: () => Promise<void>;
  lockScreen: () => void;
  requestAuthenticatedUserSwitch: (userId: string) => void;
  cancelUserSwitchRequest: () => void;
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
