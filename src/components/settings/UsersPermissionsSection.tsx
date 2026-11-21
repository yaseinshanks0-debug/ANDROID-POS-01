/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { usePOS } from '../../context/POSContext';
import type {
  BranchRecord,
  CompanyInvitationSummary,
  POSUser,
  RolePermissions,
  UserRole,
} from '../../lib/types';
import { DEFAULT_ROLE_PERMISSIONS } from '../../lib/initial-data';
import {
  CAPABILITY_GROUPS,
  CapabilityCode,
  SYSTEM_ROLE_DEFINITIONS,
  SystemRoleCode,
  deriveCapabilitiesFromUser,
  deriveLegacyPermissionsFromCapabilities,
  getDefaultCapabilitiesForRole,
  mapLegacyRoleToSystemRole,
  mapSystemRoleToLegacyRole,
} from '../../lib/rbac-capabilities';
import { AppCard } from '../ui/AppCard';
import { AppInput } from '../ui/AppInput';
import { TactileButton } from '../ui/TactileButton';
import {
  validatePasswordStrengthPolicy,
  validatePinPolicy,
} from '../../lib/local-auth';
import { isValidEmailFormat } from '../../lib/invitation-utils';
import { CompanyInviteShareModal } from './CompanyInviteShareModal';

interface CreatedInviteShareData {
  companyName: string;
  invitedEmail: string;
  roleName: string;
  inviteUrl: string;
  shortCode: string;
  expiresAt: string;
}
import {
  Users,
  ShieldCheck,
  UserPlus,
  Check,
  Monitor,
  KeyRound,
  Smartphone,
  Copy,
  RefreshCw,
  Link2,
  Store,
  Plus,
  Ban,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Lock,
  Trash2,
  Edit2,
  X,
  Phone,
  Mail,
  UserCheck,
  Send,
  Ticket,
  Clock,
  XCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

const PERMISSION_ITEMS: {
  key: keyof RolePermissions;
  labelEn: string;
  labelAr: string;
}[] = [
  { key: 'canCheckout', labelEn: 'POS Sales & Checkout', labelAr: 'إجراء المبيعات وإصدار الفواتير' },
  { key: 'canApplyDiscounts', labelEn: 'Apply Discounts', labelAr: 'منح الخصومات وتعديلها' },
  { key: 'canManageProducts', labelEn: 'Add / Edit Products', labelAr: 'إضافة وتعديل المنتجات والباركود' },
  { key: 'canEditPrices', labelEn: 'Modify Product Prices', labelAr: 'تعديل أسعار الشراء والبيع' },
  { key: 'canManageInventory', labelEn: 'Stock Adjustments', labelAr: 'إدارة المخزون والجرد والتوريد' },
  { key: 'canVoidTransactions', labelEn: 'Void / Refund Invoices', labelAr: 'إلغاء واسترجاع الفواتير' },
  { key: 'canManageExchangeRates', labelEn: 'Manage Exchange Rates', labelAr: 'تحديث أسعار صرف العملات' },
  { key: 'canViewReports', labelEn: 'Financial Reports & Ledger', labelAr: 'عرض التقارير المالية والأرباح' },
  { key: 'canManageUsers', labelEn: 'Manage Users & Permissions', labelAr: 'إدارة المستخدمين والصلاحيات' },
];

const AVATAR_COLOR_OPTIONS = [
  '#f59e0b',
  '#10b981',
  '#38bdf8',
  '#a855f7',
  '#f43f5e',
  '#ec4899',
  '#14b8a6',
];

export const UsersPermissionsSection: React.FC = () => {
  const {
    settings,
    updateSettings,
    workspaceMode,
    users,
    activeSessions,
    currentUser,
    switchCurrentUser,
    requestAuthenticatedUserSwitch,
    logoutCurrentUser,
    saveUser,
    deleteUserAccount,
    clearAllUserAccounts,
    deactivateUserAccount,
    reactivateUserAccount,
    resetUserPasswordOrPin,
    toggleUserActiveSession,
    linkCurrentUserFirebaseEmail,
    createCompanyInvite,
    listCompanyInvites,
    revokeCompanyInvite,
    syncTransactions,
    isSyncing,
    lastSyncedAt,
    branches,
    activeBranchId,
    setActiveBranchId,
    createBranch,
    updateBranch,
    deleteBranch,
    currentCompany,
  } = usePOS();

  const isAr = settings.language === 'ar';
  const isProductionWorkspace = workspaceMode === 'PRODUCTION';

  // Add / Edit Account Form State (zero pre-filled default values)
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [newNameAr, setNewNameAr] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newSystemRole, setNewSystemRole] = useState<SystemRoleCode>('COMPANY_OWNER');
  const [newBranchId, setNewBranchId] = useState<string>(activeBranchId || branches[0]?.id || '');
  const [newAssignedBranchIds, setNewAssignedBranchIds] = useState<string[]>(
    activeBranchId ? [activeBranchId] : branches[0]?.id ? [branches[0].id] : []
  );
  const [newTerminalAr, setNewTerminalAr] = useState('');
  const [newTerminalEn, setNewTerminalEn] = useState('');
  const [newPin, setNewPin] = useState('');
  const [newAvatarColor, setNewAvatarColor] = useState('#f59e0b');

  // Delete & Clear Confirmation States
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState<string | null>(null);
  const [confirmClearAllAccounts, setConfirmClearAllAccounts] = useState(false);

  // Add / Edit Branch State (zero pre-filled default values)
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [branchNameEn, setBranchNameEn] = useState('');
  const [branchNameAr, setBranchNameAr] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [branchCity, setBranchCity] = useState('');
  const [branchPhone, setBranchPhone] = useState('');
  const [confirmDeleteBranchId, setConfirmDeleteBranchId] = useState<string | null>(null);

  // Granular Matrix Expansion & Password Reset State
  const [expandedUserMatrixId, setExpandedUserMatrixId] = useState<string | null>(null);
  const [expandedQuickPermsUserId, setExpandedQuickPermsUserId] = useState<string | null>(null);
  const [resettingPasswordUserId, setResettingPasswordUserId] = useState<string | null>(null);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetNewPin, setResetNewPin] = useState('');
  const [actionFeedback, setActionFeedback] = useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);

  // Email Recovery Linking state (for legacy accounts without Firebase email)
  const [isLinkEmailOpen, setIsLinkEmailOpen] = useState(false);
  const [linkEmailMode, setLinkEmailMode] = useState<'create' | 'signin'>('create');
  const [linkEmailInput, setLinkEmailInput] = useState(currentUser.email || '');
  const [linkPasswordInput, setLinkPasswordInput] = useState('');
  const [showLinkPassword, setShowLinkPassword] = useState(false);
  const [isLinkingEmail, setIsLinkingEmail] = useState(false);

  // Staff Invitation Form, List & Share Modal state
  const [isInviteFormOpen, setIsInviteFormOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteFullName, setInviteFullName] = useState('');
  const [inviteSystemRole, setInviteSystemRole] = useState<SystemRoleCode>('CASHIER');
  const [inviteBranchId, setInviteBranchId] = useState<string>(
    activeBranchId || branches[0]?.id || ''
  );
  const [isCreatingInvite, setIsCreatingInvite] = useState(false);
  const [invitations, setInvitations] = useState<CompanyInvitationSummary[]>([]);
  const [isLoadingInvites, setIsLoadingInvites] = useState(false);
  const [revokingInviteId, setRevokingInviteId] = useState<string | null>(null);
  const [copiedInviteCodeId, setCopiedInviteCodeId] = useState<string | null>(null);
  const [createdShareInvite, setCreatedShareInvite] = useState<CreatedInviteShareData | null>(null);

  const actorSystemRole = mapLegacyRoleToSystemRole(currentUser.systemRole || currentUser.role);
  const canManageInvites =
    isProductionWorkspace &&
    (actorSystemRole === 'COMPANY_OWNER' ||
      actorSystemRole === 'ADMIN' ||
      actorSystemRole === 'MANAGER' ||
      currentUser.permissions?.canManageUsers === true);

  const invitableRoles = useMemo(() => {
    const allowed: SystemRoleCode[] =
      actorSystemRole === 'COMPANY_OWNER'
        ? [
            'COMPANY_OWNER',
            'ADMIN',
            'MANAGER',
            'CASHIER',
            'INVENTORY_MANAGER',
            'ACCOUNTANT',
            'PURCHASING_MANAGER',
            'REPORT_VIEWER',
          ]
        : actorSystemRole === 'ADMIN'
        ? [
            'ADMIN',
            'MANAGER',
            'CASHIER',
            'INVENTORY_MANAGER',
            'ACCOUNTANT',
            'PURCHASING_MANAGER',
            'REPORT_VIEWER',
          ]
        : ['CASHIER', 'INVENTORY_MANAGER', 'ACCOUNTANT', 'PURCHASING_MANAGER', 'REPORT_VIEWER'];
    return SYSTEM_ROLE_DEFINITIONS.filter((def) => allowed.includes(def.code));
  }, [actorSystemRole]);

  const refreshCompanyInvites = useCallback(async () => {
    if (!canManageInvites) {
      setInvitations([]);
      return;
    }
    setIsLoadingInvites(true);
    try {
      const res = await listCompanyInvites();
      if (res.ok && Array.isArray(res.invitations)) {
        setInvitations(res.invitations);
      }
    } finally {
      setIsLoadingInvites(false);
    }
  }, [canManageInvites, listCompanyInvites]);

  useEffect(() => {
    if (canManageInvites) {
      void refreshCompanyInvites();
    } else {
      setInvitations([]);
    }
  }, [canManageInvites, currentCompany.id, refreshCompanyInvites]);

  useEffect(() => {
    if (!inviteBranchId && (activeBranchId || branches[0]?.id)) {
      setInviteBranchId(activeBranchId || branches[0]?.id || '');
    }
  }, [activeBranchId, branches, inviteBranchId]);

  const handleLinkEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionFeedback(null);
    const cleanEmail = linkEmailInput.trim().toLowerCase();
    if (!isValidEmailFormat(cleanEmail)) {
      setActionFeedback({
        type: 'error',
        message: isAr ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.',
      });
      return;
    }
    if (linkPasswordInput.length < 6) {
      setActionFeedback({
        type: 'error',
        message: isAr
          ? 'كلمة المرور يجب أن تكون 6 خانات على الأقل.'
          : 'Password must be at least 6 characters.',
      });
      return;
    }
    setIsLinkingEmail(true);
    try {
      const res = await linkCurrentUserFirebaseEmail({
        email: cleanEmail,
        password: linkPasswordInput,
        mode: linkEmailMode,
      });
      if (!res.ok) {
        setActionFeedback({
          type: 'error',
          message:
            res.error ||
            (isAr ? 'تعذر ربط البريد الإلكتروني الآن.' : 'Could not link email right now.'),
        });
        return;
      }
      setLinkPasswordInput('');
      setIsLinkEmailOpen(false);
      setActionFeedback({
        type: 'success',
        message: isAr
          ? `تم ربط البريد الإلكتروني (${cleanEmail}) بحسابك بنجاح. يمكنك الآن استعادة كلمة المرور عبر البريد في أي وقت.`
          : `Email (${cleanEmail}) linked successfully. You can now recover your password via email anytime.`,
      });
    } finally {
      setIsLinkingEmail(false);
    }
  };

  const handleCreateInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionFeedback(null);
    const cleanEmail = inviteEmail.trim().toLowerCase();
    if (!isValidEmailFormat(cleanEmail)) {
      setActionFeedback({
        type: 'error',
        message: isAr
          ? 'يرجى إدخال بريد إلكتروني صحيح للموظف.'
          : 'Please enter a valid staff email address.',
      });
      return;
    }
    const targetBranch = inviteBranchId || activeBranchId || branches[0]?.id || '';
    if (!targetBranch) {
      setActionFeedback({
        type: 'error',
        message: isAr ? 'يرجى اختيار الفرع للموظف.' : 'Please select a branch for the staff member.',
      });
      return;
    }
    setIsCreatingInvite(true);
    try {
      const res = await createCompanyInvite({
        email: cleanEmail,
        invitedName: inviteFullName.trim() || undefined,
        roleId: inviteSystemRole,
        branchId: targetBranch,
      });
      if (!res.ok || !res.invitation || !res.inviteUrl || !res.shortCode) {
        setActionFeedback({
          type: 'error',
          message:
            res.error ||
            (isAr ? 'تعذر إنشاء دعوة الموظف.' : 'Could not create staff invitation.'),
        });
        return;
      }
      const roleDef = SYSTEM_ROLE_DEFINITIONS.find((d) => d.code === inviteSystemRole);
      setCreatedShareInvite({
        companyName: isAr
          ? currentCompany.displayNameAr || currentCompany.displayName
          : currentCompany.displayName,
        invitedEmail: cleanEmail,
        roleName: roleDef ? (isAr ? roleDef.labelAr : roleDef.labelEn) : inviteSystemRole,
        inviteUrl: res.inviteUrl,
        shortCode: res.shortCode,
        expiresAt: res.invitation.expiresAt,
      });
      setInviteEmail('');
      setInviteFullName('');
      setIsInviteFormOpen(false);
      await refreshCompanyInvites();
      setActionFeedback({
        type: 'success',
        message: isAr
          ? `تم إنشاء رابط وكود دعوة للموظف (${cleanEmail}) بنجاح.`
          : `Invitation link and code created for ${cleanEmail}.`,
      });
    } finally {
      setIsCreatingInvite(false);
    }
  };

  const handleRevokeInvite = async (invitationId: string) => {
    setActionFeedback(null);
    setRevokingInviteId(invitationId);
    try {
      const res = await revokeCompanyInvite(invitationId);
      if (!res.ok) {
        setActionFeedback({
          type: 'error',
          message: res.error || (isAr ? 'تعذر إلغاء الدعوة.' : 'Failed to revoke invitation.'),
        });
        return;
      }
      await refreshCompanyInvites();
      setActionFeedback({
        type: 'success',
        message: isAr ? 'تم إلغاء الدعوة بنجاح.' : 'Invitation revoked successfully.',
      });
    } finally {
      setRevokingInviteId(null);
    }
  };

  const handleCopyInviteCode = async (invitationId: string, shortCode: string) => {
    try {
      await navigator.clipboard.writeText(shortCode);
    } catch {
      // Clipboard fallback ignored
    }
    setCopiedInviteCodeId(invitationId);
    setTimeout(() => {
      setCopiedInviteCodeId((curr) => (curr === invitationId ? null : curr));
    }, 2000);
  };

  const sharedPosUrl =
    typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000';

  const handleCopyPosLink = async () => {
    try {
      await navigator.clipboard.writeText(sharedPosUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const openCreateAccountForm = () => {
    setEditingAccountId(null);
    setNewNameAr('');
    setNewNameEn('');
    setNewUsername('');
    setNewEmail('');
    setNewPhone('');
    setNewPassword('');
    setNewSystemRole(users.length === 0 ? 'COMPANY_OWNER' : 'CASHIER');
    const defaultBr = activeBranchId || branches[0]?.id || '';
    setNewBranchId(defaultBr);
    setNewAssignedBranchIds(defaultBr ? [defaultBr] : []);
    setNewTerminalAr('');
    setNewTerminalEn('');
    setNewPin('');
    setNewAvatarColor('#f59e0b');
    setIsAccountFormOpen(true);
  };

  const openEditAccountForm = (u: POSUser) => {
    setEditingAccountId(u.id);
    setNewNameAr(u.nameAr || u.name || '');
    setNewNameEn(u.name || '');
    setNewUsername(u.username || '');
    setNewEmail(u.email || '');
    setNewPhone(u.phone || '');
    setNewPassword('');
    setNewSystemRole(mapLegacyRoleToSystemRole(u.systemRole || u.role));
    const primaryBr = u.branchId || activeBranchId || branches[0]?.id || '';
    setNewBranchId(primaryBr);
    setNewAssignedBranchIds(
      Array.isArray(u.assignedBranchIds) && u.assignedBranchIds.length > 0
        ? u.assignedBranchIds
        : primaryBr
        ? [primaryBr]
        : []
    );
    setNewTerminalAr(u.terminalNameAr || '');
    setNewTerminalEn(u.terminalName || '');
    setNewPin(u.pin && !u.pin.startsWith('scrypt$') ? u.pin : '');
    setNewAvatarColor(u.avatarColor || '#f59e0b');
    setIsAccountFormOpen(true);
  };

  const handleTogglePermission = (user: POSUser, permKey: keyof RolePermissions) => {
    const nextPerms: RolePermissions = {
      ...user.permissions,
      [permKey]: !user.permissions[permKey],
    };
    saveUser({
      ...user,
      permissions: nextPerms,
    });
  };

  const handleToggleCapability = (user: POSUser, capCode: CapabilityCode) => {
    const currentCaps = deriveCapabilitiesFromUser(user);
    const hasCap = currentCaps.includes(capCode);
    const nextCaps = hasCap
      ? currentCaps.filter((c) => c !== capCode)
      : [...currentCaps, capCode];
    const nextPerms = deriveLegacyPermissionsFromCapabilities(nextCaps);

    saveUser({
      ...user,
      systemRole:
        user.systemRole === 'COMPANY_OWNER' ? 'COMPANY_OWNER' : ('CUSTOM_ROLE' as SystemRoleCode),
      capabilities: nextCaps,
      permissions: nextPerms,
    });
  };

  const handleEnableAllCapabilities = (user: POSUser) => {
    const allCodes = CAPABILITY_GROUPS.flatMap((g) => g.capabilities.map((c) => c.code));
    const nextPerms = deriveLegacyPermissionsFromCapabilities(allCodes);
    saveUser({
      ...user,
      capabilities: allCodes,
      permissions: nextPerms,
    });
  };

  const handleChangeSystemRole = (user: POSUser, sysRole: SystemRoleCode) => {
    setActionFeedback(null);
    const legacyRole: UserRole = mapSystemRoleToLegacyRole(sysRole);
    const defaultCaps = getDefaultCapabilitiesForRole(sysRole);
    const derivedPerms = deriveLegacyPermissionsFromCapabilities(defaultCaps);

    saveUser({
      ...user,
      role: legacyRole,
      systemRole: sysRole,
      capabilities: defaultCaps,
      permissions: derivedPerms,
    });
  };

  const handleToggleEmployeeBranch = (user: POSUser, branchId: string) => {
    const currentList =
      Array.isArray(user.assignedBranchIds) && user.assignedBranchIds.length > 0
        ? user.assignedBranchIds
        : [user.branchId || 'branch-main'];
    const exists = currentList.includes(branchId);
    const nextList = exists
      ? currentList.length > 1
        ? currentList.filter((id) => id !== branchId)
        : currentList
      : [...currentList, branchId];

    saveUser({
      ...user,
      branchId: nextList[0],
      assignedBranchIds: nextList,
    });
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameAr.trim() && !newNameEn.trim()) {
      setActionFeedback({
        type: 'error',
        message: isAr ? 'يرجى إدخال اسم صاحب الحساب.' : 'Please enter the account holder name.',
      });
      return;
    }

    const existingUser = editingAccountId
      ? users.find((u) => u.id === editingAccountId)
      : undefined;

    const cleanPassword = newPassword.trim();
    const cleanPin = newPin.trim();

    if (!existingUser && !cleanPassword && !cleanPin) {
      setActionFeedback({
        type: 'error',
        message: isAr
          ? 'يرجى تعيين كلمة مرور أو رمز دخول سريع PIN لحماية الحساب الجديد.'
          : 'Please set a password or Quick PIN to protect the new account.',
      });
      return;
    }

    if (cleanPassword) {
      const pwdCheck = validatePasswordStrengthPolicy(cleanPassword);
      if (!pwdCheck.valid) {
        setActionFeedback({
          type: 'error',
          message: isAr ? pwdCheck.messageAr || '' : pwdCheck.messageEn || '',
        });
        return;
      }
    }

    if (cleanPin) {
      const pinCheck = validatePinPolicy(cleanPin);
      if (!pinCheck.valid) {
        setActionFeedback({
          type: 'error',
          message: isAr ? pinCheck.messageAr || '' : pinCheck.messageEn || '',
        });
        return;
      }
    }

    const legacyRole = mapSystemRoleToLegacyRole(newSystemRole);
    const defaultCaps: CapabilityCode[] =
      existingUser && existingUser.systemRole === newSystemRole && existingUser.capabilities?.length
        ? (existingUser.capabilities as CapabilityCode[])
        : getDefaultCapabilitiesForRole(newSystemRole);
    const derivedPerms =
      deriveLegacyPermissionsFromCapabilities(defaultCaps) || DEFAULT_ROLE_PERMISSIONS[legacyRole];

    const id = editingAccountId || `usr-${Date.now().toString(36)}`;
    const primaryBr = newBranchId || activeBranchId || branches[0]?.id || 'branch-main';
    const assignedBrs =
      newAssignedBranchIds.length > 0 ? newAssignedBranchIds : [primaryBr];

    const saved = saveUser({
      id,
      companyId: currentCompany.id,
      branchId: primaryBr,
      assignedBranchIds: assignedBrs,
      name: newNameEn.trim() || newNameAr.trim(),
      nameAr: newNameAr.trim() || newNameEn.trim(),
      username: newUsername.trim(),
      email: newEmail.trim() || undefined,
      phone: newPhone.trim() || undefined,
      password: newPassword.trim() || undefined,
      role: legacyRole,
      systemRole: newSystemRole,
      capabilities: defaultCaps,
      pin: newPin.trim(),
      avatarColor: newAvatarColor,
      terminalName: newTerminalEn.trim() || newTerminalAr.trim(),
      terminalNameAr: newTerminalAr.trim() || newTerminalEn.trim(),
      isActive: existingUser ? existingUser.isActive !== false : true,
      lastActiveAt: new Date().toISOString(),
      permissions: derivedPerms,
    });

    if (users.length === 0 || editingAccountId === currentUser.id) {
      switchCurrentUser(saved.id);
    }

    setIsAccountFormOpen(false);
    setEditingAccountId(null);
    setActionFeedback({
      type: 'success',
      message: editingAccountId
        ? isAr
          ? `تم حفظ تعديلات حساب (${saved.nameAr || saved.name}) بنجاح.`
          : `Account (${saved.name}) updated successfully.`
        : isAr
        ? `تم إنشاء حساب (${saved.nameAr || saved.name}) وتخصيص صلاحياته بنجاح.`
        : `Account (${saved.name}) created and customized successfully.`,
    });
  };

  const handlePermanentDeleteAccount = (u: POSUser) => {
    deleteUserAccount(u.id);
    setConfirmDeleteUserId(null);
    setActionFeedback({
      type: 'success',
      message: isAr
        ? `تم حذف الحساب (${u.nameAr || u.name}) نهائياً.`
        : `Account (${u.name}) permanently deleted.`,
    });
  };

  const handleOpenAddBranch = () => {
    setEditingBranchId(null);
    setBranchNameEn('');
    setBranchNameAr('');
    setBranchCode('');
    setBranchCity('');
    setBranchPhone('');
    setIsAddingBranch(true);
  };

  const handleOpenEditBranch = (br: BranchRecord) => {
    setEditingBranchId(br.id);
    setBranchNameEn(br.name || '');
    setBranchNameAr(br.nameAr || '');
    setBranchCode(br.code || '');
    setBranchCity(br.city || '');
    setBranchPhone(br.phone || '');
    setIsAddingBranch(true);
  };

  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchNameEn.trim() && !branchNameAr.trim()) return;

    if (editingBranchId) {
      updateBranch(editingBranchId, {
        name: branchNameEn.trim() || branchNameAr.trim(),
        nameAr: branchNameAr.trim() || branchNameEn.trim(),
        code: (branchCode.trim() || 'BR-01').toUpperCase(),
        city: branchCity.trim(),
        phone: branchPhone.trim(),
      });
      setActionFeedback({
        type: 'success',
        message: isAr ? 'تم تحديث بيانات الفرع بنجاح.' : 'Branch updated successfully.',
      });
    } else {
      await createBranch({
        name: branchNameEn.trim() || branchNameAr.trim(),
        nameAr: branchNameAr.trim() || branchNameEn.trim(),
        code: branchCode.trim() || `BR-0${branches.length + 1}`,
        city: branchCity.trim(),
        phone: branchPhone.trim(),
        isMainBranch: branches.length === 0,
      });
      setActionFeedback({
        type: 'success',
        message: isAr ? 'تمت إضافة الفرع الجديد بنجاح.' : 'New branch added successfully.',
      });
    }

    setBranchNameEn('');
    setBranchNameAr('');
    setBranchCode('');
    setBranchCity('');
    setBranchPhone('');
    setEditingBranchId(null);
    setIsAddingBranch(false);
  };

  const handleDeactivateToggle = async (user: POSUser) => {
    setActionFeedback(null);
    if (user.isActive !== false) {
      const res = await deactivateUserAccount(user.id, 'Deactivated via Account Management');
      if (!res.ok) {
        setActionFeedback({ type: 'error', message: res.error || 'Cannot deactivate user.' });
      } else {
        setActionFeedback({
          type: 'success',
          message: isAr
            ? `تم إيقاف حساب (${user.nameAr || user.name}) مؤقتاً.`
            : `Paused account (${user.name}).`,
        });
      }
    } else {
      await reactivateUserAccount(user.id);
      setActionFeedback({
        type: 'success',
        message: isAr
          ? `تمت إعادة تفعيل حساب (${user.nameAr || user.name}) بنجاح.`
          : `Reactivated ${user.name} account.`,
      });
    }
  };

  const handleConfirmResetPassword = async (userId: string) => {
    setActionFeedback(null);
    const res = await resetUserPasswordOrPin(
      userId,
      resetNewPassword.trim() || undefined,
      resetNewPin.trim() || undefined
    );
    if (!res.ok) {
      setActionFeedback({ type: 'error', message: res.error || 'Failed to reset credentials.' });
      return;
    }
    setResettingPasswordUserId(null);
    setResetNewPassword('');
    setResetNewPin('');
    setActionFeedback({
      type: 'success',
      message: isAr
        ? 'تم تحديث كلمة المرور / رمز الدخول (PIN) بنجاح.'
        : 'Password / Terminal PIN updated successfully.',
    });
  };

  return (
    <AppCard className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2 flex-wrap">
              <span>
                {isAr
                  ? 'تخصيص وإدارة الحسابات والفروع والصلاحيات (بدون أي حسابات افتراضية)'
                  : 'Full Account, Branch & Permission Customization (Zero Default Accounts)'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold">
                {users.length} {isAr ? 'حساب مضاف' : 'Accounts'}
              </span>
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {isAr
                ? 'أضف حساباتك الخاصة فقط، عدّل الأسماء والأدوار والـ PIN ونقاط البيع، أو احذف أي حساب بحرية تامة.'
                : 'Add only your own accounts, edit names, roles, PINs, terminals, capabilities, or delete accounts freely.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {users.length > 0 && (
            <>
              {confirmClearAllAccounts ? (
                <div className="flex items-center gap-1 bg-rose-950/70 border border-rose-500/40 px-2 py-1 rounded-xl">
                  <span className="text-[11px] text-rose-200 font-bold">
                    {isAr ? 'مسح كل الحسابات؟' : 'Clear all?'}
                  </span>
                  <button
                    type="button"
                    data-testid="confirm-clear-all-accounts-btn"
                    onClick={() => {
                      clearAllUserAccounts();
                      setConfirmClearAllAccounts(false);
                      setActionFeedback({
                        type: 'success',
                        message: isAr
                          ? 'تم مسح جميع الحسابات بنجاح.'
                          : 'All accounts cleared successfully.',
                      });
                    }}
                    className="px-2 py-0.5 rounded-lg bg-rose-600 text-white text-[10px] font-black"
                  >
                    {isAr ? 'نعم، مسح الكل' : 'Yes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClearAllAccounts(false)}
                    className="px-1.5 py-0.5 rounded-lg bg-neutral-800 text-neutral-300 text-[10px]"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              ) : (
                <TactileButton
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => setConfirmClearAllAccounts(true)}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  data-testid="clear-all-accounts-btn"
                >
                  {isAr ? 'مسح جميع الحسابات' : 'Clear All Accounts'}
                </TactileButton>
              )}
            </>
          )}

          <TactileButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleOpenAddBranch}
            leftIcon={<Store className="w-3.5 h-3.5" />}
            data-testid="open-add-branch-btn"
          >
            {isAr ? 'إضافة فرع' : 'Add Branch'}
          </TactileButton>

          {canManageInvites && (
            <TactileButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsInviteFormOpen((prev) => !prev);
                setIsAccountFormOpen(false);
                setActionFeedback(null);
              }}
              leftIcon={<Send className="w-3.5 h-3.5 text-emerald-400" />}
              data-testid="open-invite-staff-btn"
            >
              {isAr ? 'دعوة موظف' : 'Invite Staff'}
            </TactileButton>
          )}

          <TactileButton
            type="button"
            variant="amber"
            size="sm"
            onClick={openCreateAccountForm}
            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            data-testid="open-add-user-btn"
          >
            {isAr ? 'إضافة حساب جديد' : 'Add Account'}
          </TactileButton>
        </div>
      </div>

      {/* Login & Password Gate Security Policy Bar */}
      <div
        data-testid="login-security-policy-bar"
        className="p-3.5 rounded-2xl bg-neutral-950/90 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-white">
              {isAr
                ? 'طلب تسجيل الدخول وكلمة المرور عند فتح التطبيق'
                : 'Require Login & Password on App Launch'}
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {isAr
                ? 'عند التفعيل يطلب النظام اسم المستخدم وكلمة المرور أو رمز PIN قبل الوصول إلى نقطة البيع وعند تبديل الحسابات.'
                : 'When enabled, operators must authenticate with password or PIN on launch and when switching accounts.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            role="switch"
            aria-checked={settings.requireLoginOnStartup !== false}
            data-testid="toggle-require-login-btn"
            onClick={() =>
              updateSettings({
                requireLoginOnStartup: settings.requireLoginOnStartup === false,
              })
            }
            className={`px-3 py-2 rounded-xl border text-xs font-extrabold transition-colors ${
              settings.requireLoginOnStartup !== false
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-neutral-900 border-neutral-700 text-neutral-400'
            }`}
          >
            {settings.requireLoginOnStartup !== false
              ? isAr
                ? 'مفعّل ✓'
                : 'Enabled ✓'
              : isAr
              ? 'معطّل'
              : 'Disabled'}
          </button>
          <button
            type="button"
            data-testid="settings-lock-logout-btn"
            onClick={() => {
              void logoutCurrentUser();
            }}
            className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-extrabold inline-flex items-center gap-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isAr ? 'قفل الشاشة الآن' : 'Lock Screen Now'}</span>
          </button>
        </div>
      </div>

      {/* Link Email for Password Recovery Card (for production accounts not yet linked to Firebase) */}
      {isProductionWorkspace &&
        !currentUser.firebaseUid &&
        currentUser.id !== 'unassigned-operator' && (
          <div
            data-testid="link-email-recovery-card"
            className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-500/35 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-white">
                    {isAr
                      ? 'ربط البريد الإلكتروني لاستعادة كلمة المرور'
                      : 'Link Email for Password Recovery'}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {isAr
                      ? 'حسابك الحالي غير مربوط ببريد إلكتروني سحابي. اربط بريدك الآن لتتمكن من استعادة كلمة المرور تلقائياً عبر البريد في حال نسيانها.'
                      : 'Your account is not linked to a cloud email yet. Link an email now so you can reset your password anytime if forgotten.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                data-testid="toggle-link-email-form-btn"
                onClick={() => {
                  setIsLinkEmailOpen((prev) => !prev);
                  setLinkEmailInput(currentUser.email || '');
                }}
                className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 text-xs font-black shrink-0 transition-colors"
              >
                {isLinkEmailOpen
                  ? isAr
                    ? 'إغلاق'
                    : 'Close'
                  : isAr
                  ? 'ربط البريد الإلكتروني الآن'
                  : 'Link Email Now'}
              </button>
            </div>

            {isLinkEmailOpen && (
              <form
                onSubmit={handleLinkEmailSubmit}
                data-testid="link-email-recovery-form"
                className="p-3.5 rounded-xl bg-neutral-950/90 border border-sky-500/30 space-y-3"
              >
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLinkEmailMode('create')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      linkEmailMode === 'create'
                        ? 'bg-sky-500/20 border-sky-500/50 text-sky-200'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    {isAr ? 'بريد جديد للحساب' : 'Create New Email Login'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkEmailMode('signin')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      linkEmailMode === 'signin'
                        ? 'bg-sky-500/20 border-sky-500/50 text-sky-200'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    {isAr ? 'ربط بحساب بريد مسجل مسبقاً' : 'Link Existing Email Account'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AppInput
                    label={isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
                    type="email"
                    placeholder="owner@company.com"
                    value={linkEmailInput}
                    onChange={(e) => setLinkEmailInput(e.target.value)}
                    dir="ltr"
                    data-testid="link-email-input"
                  />
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                      {isAr ? 'كلمة مرور البريد *' : 'Email Account Password *'}
                    </label>
                    <div className="relative">
                      <input
                        type={showLinkPassword ? 'text' : 'password'}
                        value={linkPasswordInput}
                        onChange={(e) => setLinkPasswordInput(e.target.value)}
                        placeholder={isAr ? '8 خانات أو أكثر' : '8+ characters'}
                        dir="ltr"
                        data-testid="link-email-password-input"
                        className="w-full min-h-[42px] px-3 py-2 pe-9 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLinkPassword((v) => !v)}
                        className="absolute inset-y-0 end-2.5 flex items-center text-neutral-400 hover:text-white"
                      >
                        {showLinkPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <TactileButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLinkEmailOpen(false)}
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </TactileButton>
                  <TactileButton
                    type="submit"
                    variant="amber"
                    size="sm"
                    isLoading={isLinkingEmail}
                    data-testid="submit-link-email-btn"
                  >
                    {isAr ? 'تأكيد وربط البريد' : 'Confirm & Link Email'}
                  </TactileButton>
                </div>
              </form>
            )}
          </div>
        )}

      {/* Invite Staff Form (Email + Link/QR/Short Code) */}
      {canManageInvites && isInviteFormOpen && (
        <form
          onSubmit={handleCreateInviteSubmit}
          data-testid="invite-staff-form"
          className="p-4 rounded-2xl bg-emerald-950/20 border-2 border-emerald-500/45 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
            <h4 className="text-xs sm:text-sm font-bold text-emerald-300 flex items-center gap-1.5">
              <Send className="w-4 h-4" />
              <span>
                {isAr
                  ? 'دعوة موظف جديد للانضمام إلى الشركة عبر البريد والرابط'
                  : 'Invite Staff Member to Join Company via Email & Link'}
              </span>
            </h4>
            <button
              type="button"
              onClick={() => setIsInviteFormOpen(false)}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-neutral-300 leading-relaxed">
            {isAr
              ? 'سيقوم النظام بتوليد رابط دعوة خاص للاستخدام مرة واحدة + كود مختصر + رمز QR يمكنك مشاركته فوراً عبر واتساب أو تطبيق البريد. لن يتمكن من قبول الدعوة إلا صاحب البريد الإلكتروني المحدد أدناه.'
              : 'Generates a single-use invite link, short code, and QR code to share via WhatsApp or Email. Only the exact email address entered below can accept this invitation.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <AppInput
              label={isAr ? 'البريد الإلكتروني للموظف *' : 'Staff Email Address *'}
              type="email"
              placeholder="cashier@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              dir="ltr"
              data-testid="invite-staff-email-input"
            />
            <AppInput
              label={isAr ? 'الاسم المقترح (اختياري)' : 'Suggested Name (Optional)'}
              placeholder={isAr ? 'مثال: أحمد علي' : 'e.g. Ahmed Ali'}
              value={inviteFullName}
              onChange={(e) => setInviteFullName(e.target.value)}
              data-testid="invite-staff-name-input"
            />
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                {isAr ? 'الدور الوظيفي *' : 'Assigned Role *'}
              </label>
              <select
                data-testid="invite-staff-role-select"
                value={inviteSystemRole}
                onChange={(e) => setInviteSystemRole(e.target.value as SystemRoleCode)}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              >
                {invitableRoles.map((def) => (
                  <option key={def.code} value={def.code}>
                    {isAr ? def.labelAr : def.labelEn}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                {isAr ? 'الفرع المخصص *' : 'Assigned Branch *'}
              </label>
              <select
                data-testid="invite-staff-branch-select"
                value={inviteBranchId}
                onChange={(e) => setInviteBranchId(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {isAr ? b.nameAr || b.name : b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-500/20">
            <TactileButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsInviteFormOpen(false)}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </TactileButton>
            <TactileButton
              type="submit"
              variant="amber"
              size="sm"
              isLoading={isCreatingInvite}
              leftIcon={<Send className="w-3.5 h-3.5" />}
              data-testid="submit-invite-staff-btn"
            >
              {isAr ? 'توليد رابط وكود الدعوة' : 'Generate Invite Link & Code'}
            </TactileButton>
          </div>
        </form>
      )}

      {actionFeedback && (
        <div
          data-testid="user-management-feedback-banner"
          className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 ${
            actionFeedback.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionFeedback.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionFeedback(null)}
            className="text-[11px] underline opacity-80 hover:opacity-100"
          >
            {isAr ? 'إغلاق' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Company Branches Management Panel */}
      <div
        data-testid="branch-management-panel"
        className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3"
      >
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black text-white">
              {isAr
                ? `فروع المتجر / الشركة (${branches.length})`
                : `Store / Company Branches (${branches.length})`}
            </span>
          </div>
          <span className="text-[11px] text-neutral-400">
            {isAr
              ? 'اضغط على الفرع لتفعيله أو تعديل اسمه وكوده'
              : 'Click a branch to activate or edit/delete it'}
          </span>
        </div>

        {isAddingBranch && (
          <form
            onSubmit={handleSaveBranch}
            data-testid="create-branch-form"
            className="p-3.5 rounded-xl bg-neutral-900 border border-amber-500/40 grid grid-cols-1 sm:grid-cols-5 gap-2.5"
          >
            <input
              type="text"
              placeholder={isAr ? 'اسم الفرع بالعربية *' : 'Branch Name (AR)'}
              value={branchNameAr}
              onChange={(e) => setBranchNameAr(e.target.value)}
              className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
            />
            <input
              type="text"
              data-testid="new-branch-name-input"
              placeholder={isAr ? 'اسم الفرع بالإنجليزية' : 'Branch Name (EN)'}
              value={branchNameEn}
              onChange={(e) => setBranchNameEn(e.target.value)}
              className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
            />
            <input
              type="text"
              placeholder={isAr ? 'كود الفرع (اختياري)' : 'Branch Code'}
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value.toUpperCase())}
              className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-white"
            />
            <input
              type="text"
              placeholder={isAr ? 'المدينة / الموقع (اختياري)' : 'City / Location'}
              value={branchCity}
              onChange={(e) => setBranchCity(e.target.value)}
              className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                data-testid="submit-new-branch-btn"
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black inline-flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {editingBranchId
                    ? isAr
                      ? 'تحديث الفرع'
                      : 'Update'
                    : isAr
                    ? 'حفظ الفرع'
                    : 'Save Branch'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingBranch(false);
                  setEditingBranchId(null);
                }}
                className="py-2 px-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {branches.map((br) => {
            const isSelected = br.id === activeBranchId;
            const isConfirmingBrDelete = confirmDeleteBranchId === br.id;
            return (
              <div
                key={br.id}
                data-testid={`branch-card-${br.id}`}
                className={`p-3 rounded-xl border text-start transition-all flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/50 text-white'
                    : 'bg-neutral-900/70 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveBranchId(br.id)}
                  className="min-w-0 flex-1 text-start"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold truncate">
                      {isAr ? br.nameAr || br.name : br.name}
                    </span>
                    {br.code && (
                      <span className="px-1.5 py-0.5 rounded bg-neutral-950 text-amber-400 font-mono text-[10px] font-bold">
                        {br.code}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                    {br.city || (isAr ? 'بدون موقع محدد' : 'No location set')}{' '}
                    {br.isMainBranch ? (isAr ? '• رئيسي' : '• Main') : ''}
                  </p>
                </button>

                <div className="flex items-center gap-1 shrink-0">
                  {isConfirmingBrDelete ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          deleteBranch(br.id);
                          setConfirmDeleteBranchId(null);
                        }}
                        className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold"
                      >
                        {isAr ? 'حذف' : 'Del'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteBranchId(null)}
                        className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px]"
                      >
                        {isAr ? 'لا' : 'No'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenEditBranch(br)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                        title={isAr ? 'تعديل الفرع' : 'Edit Branch'}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {branches.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteBranchId(br.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50"
                          title={isAr ? 'حذف الفرع' : 'Delete Branch'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Account Form */}
      {isAccountFormOpen && (
        <form
          onSubmit={handleSaveAccount}
          data-testid="add-employee-form"
          className="p-4 rounded-2xl bg-neutral-950/95 border-2 border-amber-500/50 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
            <h4 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4" />
              <span>
                {editingAccountId
                  ? isAr
                    ? 'تعديل بيانات الحساب وتخصيص الدور والصلاحيات'
                    : 'Edit Account Details, Role & Terminal'
                  : isAr
                  ? 'إضافة حساب جديد وتخصيص كامل بياناته وصلاحياته'
                  : 'Create New Custom Account & Assign Role'}
              </span>
            </h4>
            <button
              type="button"
              onClick={() => {
                setIsAccountFormOpen(false);
                setEditingAccountId(null);
              }}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <AppInput
              label={isAr ? 'اسم صاحب الحساب (عربي) *' : 'Account Name (Arabic) *'}
              placeholder={isAr ? 'اكتب الاسم بالعربية...' : 'Arabic Name'}
              value={newNameAr}
              onChange={(e) => setNewNameAr(e.target.value)}
            />
            <AppInput
              label={isAr ? 'اسم صاحب الحساب (إنجليزي - اختياري)' : 'Account Name (English)'}
              placeholder={isAr ? 'اكتب الاسم بالإنجليزية...' : 'English Name'}
              value={newNameEn}
              onChange={(e) => setNewNameEn(e.target.value)}
            />
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                {isAr ? 'الدور الوظيفي ونوع الحساب' : 'Account Role'}
              </label>
              <select
                data-testid="new-employee-role-select"
                value={newSystemRole}
                onChange={(e) => setNewSystemRole(e.target.value as SystemRoleCode)}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
              >
                {SYSTEM_ROLE_DEFINITIONS.map((def) => (
                  <option key={def.code} value={def.code}>
                    {isAr ? def.labelAr : def.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <AppInput
              label={isAr ? 'اسم المستخدم (اختياري)' : 'Username (Optional)'}
              placeholder={isAr ? 'بدون قيمة افتراضية' : 'Custom username'}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              dir="ltr"
            />
            <AppInput
              label={isAr ? 'رقم الهاتف (اختياري)' : 'Phone Number (Optional)'}
              placeholder={isAr ? 'رقم الهاتف...' : 'Phone number'}
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              dir="ltr"
            />
            <AppInput
              label={isAr ? 'البريد الإلكتروني (اختياري)' : 'Email (Optional)'}
              placeholder={isAr ? 'البريد الإلكتروني...' : 'Email address'}
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              dir="ltr"
            />
            <AppInput
              label={isAr ? 'رمز الدخول السريع PIN (اختياري)' : 'Quick PIN (Optional)'}
              placeholder={isAr ? 'أدخل رمز PIN خاص بك' : 'Custom PIN'}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <AppInput
              label={isAr ? 'كلمة المرور (اختياري)' : 'Password (Optional)'}
              type="password"
              placeholder={isAr ? 'كلمة مرور الحساب...' : 'Account password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              dir="ltr"
            />
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                {isAr ? 'الفرع التابع له الحساب' : 'Assigned Branch'}
              </label>
              <select
                value={newBranchId}
                onChange={(e) => {
                  setNewBranchId(e.target.value);
                  if (!newAssignedBranchIds.includes(e.target.value)) {
                    setNewAssignedBranchIds((prev) => [...prev, e.target.value]);
                  }
                }}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-white"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {isAr ? b.nameAr || b.name : b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>
            <AppInput
              label={isAr ? 'اسم نقطة البيع / الجهاز (اختياري)' : 'Terminal Name (AR)'}
              placeholder={isAr ? 'مثال: الكاشير الأول' : 'Terminal name AR'}
              value={newTerminalAr}
              onChange={(e) => setNewTerminalAr(e.target.value)}
            />
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                {isAr ? 'اللون المميز للحساب' : 'Account Badge Color'}
              </label>
              <div className="flex items-center gap-2 pt-1.5">
                {AVATAR_COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewAvatarColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      newAvatarColor === color
                        ? 'border-white scale-110'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
            <TactileButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsAccountFormOpen(false);
                setEditingAccountId(null);
              }}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </TactileButton>
            <TactileButton
              type="submit"
              variant="amber"
              size="sm"
              data-testid="submit-new-employee-btn"
            >
              {editingAccountId
                ? isAr
                  ? 'حفظ تعديلات الحساب'
                  : 'Save Account Changes'
                : isAr
                ? 'حفظ وإضافة الحساب'
                : 'Save & Activate Account'}
            </TactileButton>
          </div>
        </form>
      )}

      {/* Accounts List or Clean Empty State */}
      {users.length === 0 ? (
        <div
          data-testid="empty-accounts-state"
          className="p-8 rounded-2xl bg-neutral-950/70 border border-dashed border-neutral-800 text-center space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h4 className="text-sm font-extrabold text-white">
              {isAr
                ? 'لا توجد أي حسابات افتراضية — قائمة الحسابات فارغة وجاهزة لتخصيصك'
                : 'Zero Default Accounts — Your Accounts List is Clean'}
            </h4>
            <p className="text-xs text-neutral-400">
              {isAr
                ? 'لم يتم إضافة أي حسابات افتراضية لم تقم بإدخالها. اضغط على الزر أدناه لإضافة حسابك الخاص وتحديد اسمه ودوره وصلاحياته.'
                : 'No unentered default accounts were added. Click below to create your own account and customize its role and permissions.'}
            </p>
          </div>
          <div className="pt-1">
            <TactileButton
              type="button"
              variant="amber"
              size="md"
              onClick={openCreateAccountForm}
              leftIcon={<UserPlus className="w-4 h-4" />}
              data-testid="empty-state-add-account-btn"
            >
              {isAr ? 'إضافة أول حساب خاص بك' : 'Add Your First Custom Account'}
            </TactileButton>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => {
            const isOnline = activeSessions.some((s) => s.userId === u.id);
            const isCurrent = u.id === currentUser.id;
            const isDeactivated = u.isActive === false;
            const sysRoleCode: SystemRoleCode = mapLegacyRoleToSystemRole(
              u.systemRole || u.role
            );
            const sysRoleDef =
              SYSTEM_ROLE_DEFINITIONS.find((d) => d.code === sysRoleCode) ||
              SYSTEM_ROLE_DEFINITIONS[0];
            const userCaps = deriveCapabilitiesFromUser(u);
            const isExpanded = expandedUserMatrixId === u.id;
            const isQuickPermsExpanded = expandedQuickPermsUserId === u.id;
            const enabledQuickPermCount = PERMISSION_ITEMS.filter((p) =>
              Boolean(u.permissions?.[p.key])
            ).length;
            const isConfirmingDelete = confirmDeleteUserId === u.id;
            const assignedBranches =
              Array.isArray(u.assignedBranchIds) && u.assignedBranchIds.length > 0
                ? u.assignedBranchIds
                : [u.branchId || branches[0]?.id || 'branch-main'];

            return (
              <div
                key={u.id}
                data-testid={`user-permission-card-${u.id}`}
                className={`p-3.5 rounded-2xl border space-y-3 transition-opacity ${
                  isDeactivated
                    ? 'bg-neutral-950/40 border-rose-900/40 opacity-75'
                    : 'bg-neutral-950/70 border-neutral-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-neutral-800/80">
                  <div className="flex items-center gap-2.5">
                    <div
                      style={
                        u.avatarColor
                          ? { borderColor: `${u.avatarColor}66`, color: u.avatarColor }
                          : undefined
                      }
                      className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center font-bold text-xs border border-neutral-700"
                    >
                      {(isAr && u.nameAr ? u.nameAr : u.name || 'U').slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {isAr && u.nameAr ? u.nameAr : u.name}
                        </span>
                        {u.name && u.nameAr && u.name !== u.nameAr && (
                          <span className="text-[11px] text-neutral-400">
                            ({isAr ? u.name : u.nameAr})
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sysRoleDef.badgeClass}`}
                        >
                          {isAr ? sysRoleDef.labelAr : sysRoleDef.labelEn}
                        </span>
                        {isDeactivated && (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                            {isAr ? 'موقوف مؤقتاً' : 'Paused'}
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded bg-amber-500 text-neutral-950 text-[10px] font-bold">
                            {isAr ? 'الحساب النشط حالياً' : 'Current Active'}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400 mt-0.5">
                        {(u.terminalNameAr || u.terminalName) && (
                          <span className="flex items-center gap-1">
                            <Monitor className="w-3 h-3 text-neutral-500" />
                            <span>
                              {isAr && u.terminalNameAr ? u.terminalNameAr : u.terminalName}
                            </span>
                          </span>
                        )}
                        {(u.pin || (u as any).hasPin) && (
                          <span className="flex items-center gap-1 font-mono">
                            <KeyRound className="w-3 h-3 text-neutral-500" />
                            <span>PIN: ••••</span>
                          </span>
                        )}
                        {u.phone && (
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-neutral-500" />
                            <span>{u.phone}</span>
                          </span>
                        )}
                        {u.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-neutral-500" />
                            <span>{u.email}</span>
                          </span>
                        )}
                        <span className="text-emerald-400 font-mono text-[10px]">
                          {userCaps.length} {isAr ? 'صلاحية مفعلة' : 'capabilities'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <select
                      aria-label={`Role for ${u.name}`}
                      data-testid={`user-role-select-${u.id}`}
                      value={sysRoleCode}
                      onChange={(e) =>
                        handleChangeSystemRole(u, e.target.value as SystemRoleCode)
                      }
                      className="px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-bold text-neutral-200 focus:outline-none focus:border-amber-500"
                    >
                      {SYSTEM_ROLE_DEFINITIONS.map((opt) => (
                        <option key={opt.code} value={opt.code}>
                          {isAr ? opt.labelAr : opt.labelEn}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      data-testid={`edit-user-btn-${u.id}`}
                      onClick={() => openEditAccountForm(u)}
                      className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-amber-300 text-xs font-bold inline-flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>{isAr ? 'تعديل الحساب' : 'Edit'}</span>
                    </button>

                    {!isCurrent && !isDeactivated && (
                      <button
                        type="button"
                        data-testid={`switch-to-user-btn-${u.id}`}
                        onClick={() => requestAuthenticatedUserSwitch(u.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold transition-colors"
                      >
                        {isAr ? 'تبديل للحساب' : 'Switch'}
                      </button>
                    )}

                    <button
                      type="button"
                      data-testid={`reset-password-btn-${u.id}`}
                      onClick={() =>
                        setResettingPasswordUserId((prev) => (prev === u.id ? null : u.id))
                      }
                      className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-bold inline-flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>{isAr ? 'رمز / كلمة مرور' : 'PIN / Pass'}</span>
                    </button>

                    <button
                      type="button"
                      data-testid={`toggle-user-active-btn-${u.id}`}
                      onClick={() => handleDeactivateToggle(u)}
                      className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1 ${
                        isDeactivated
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-400'
                      }`}
                    >
                      <Ban className="w-3 h-3" />
                      <span>
                        {isDeactivated
                          ? isAr
                            ? 'تفعيل'
                            : 'Activate'
                          : isAr
                          ? 'إيقاف مؤقت'
                          : 'Pause'}
                      </span>
                    </button>

                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1 bg-rose-950/80 border border-rose-500/40 px-2 py-1 rounded-xl">
                        <button
                          type="button"
                          data-testid={`confirm-delete-user-btn-${u.id}`}
                          onClick={() => handlePermanentDeleteAccount(u)}
                          className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black"
                        >
                          {isAr ? 'تأكيد الحذف النهائي' : 'Confirm Delete'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteUserId(null)}
                          className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px]"
                        >
                          {isAr ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        data-testid={`delete-user-btn-${u.id}`}
                        onClick={() => setConfirmDeleteUserId(u.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold inline-flex items-center gap-1"
                        title={isAr ? 'حذف الحساب نهائياً' : 'Delete Account Permanently'}
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{isAr ? 'حذف' : 'Delete'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Password / PIN Reset Box */}
                {resettingPasswordUserId === u.id && (
                  <div
                    data-testid={`reset-password-panel-${u.id}`}
                    className="p-3 rounded-xl bg-neutral-900 border border-amber-500/40 flex flex-wrap items-center gap-2"
                  >
                    <input
                      type="password"
                      placeholder={isAr ? 'كلمة مرور جديدة' : 'New Password'}
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder={isAr ? 'رمز PIN جديد' : 'New PIN'}
                      value={resetNewPin}
                      onChange={(e) => setResetNewPin(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-white w-36"
                    />
                    <button
                      type="button"
                      onClick={() => handleConfirmResetPassword(u.id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-neutral-950 text-xs font-black"
                    >
                      {isAr ? 'حفظ التغيير' : 'Update Credentials'}
                    </button>
                  </div>
                )}

                {/* Branch Assignment Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1 me-1">
                    <Store className="w-3.5 h-3.5 text-sky-400" />
                    <span>{isAr ? 'الفروع المصرح بها للحساب:' : 'Assigned Branches:'}</span>
                  </span>
                  {branches.map((br) => {
                    const hasBranch = assignedBranches.includes(br.id);
                    return (
                      <button
                        key={br.id}
                        type="button"
                        onClick={() => handleToggleEmployeeBranch(u, br.id)}
                        className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold transition-colors ${
                          hasBranch
                            ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                        }`}
                      >
                        {isAr ? br.nameAr || br.name : br.name}
                      </button>
                    );
                  })}
                </div>

                {/* Quick 9 Permissions (Collapsible Dropdown) + Toggle for Full 46-Capability Matrix */}
                <div>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <button
                      type="button"
                      data-testid={`toggle-quick-permissions-btn-${u.id}`}
                      aria-expanded={isQuickPermsExpanded}
                      onClick={() =>
                        setExpandedQuickPermsUserId((prev) => (prev === u.id ? null : u.id))
                      }
                      className="px-2.5 py-1.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-[11px] font-bold text-neutral-200 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        {isAr
                          ? 'تخصيص صلاحيات الحساب'
                          : 'Customize Account Permissions'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-neutral-950 text-emerald-400 font-mono text-[10px]">
                        {enabledQuickPermCount}/{PERMISSION_ITEMS.length}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 shrink-0 ${
                          isQuickPermsExpanded ? 'rotate-180 text-amber-400' : ''
                        }`}
                      />
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleEnableAllCapabilities(u)}
                        className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
                      >
                        {isAr ? 'منح كامل الصلاحيات' : 'Grant All Capabilities'}
                      </button>

                      <button
                        type="button"
                        data-testid={`expand-capabilities-btn-${u.id}`}
                        onClick={() =>
                          setExpandedUserMatrixId((prev) => (prev === u.id ? null : u.id))
                        }
                        className="text-[11px] font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
                      >
                        <span>
                          {isExpanded
                            ? isAr
                              ? 'إخفاء الصلاحيات التفصيلية (46)'
                              : 'Hide 46 Granular Capabilities'
                            : isAr
                            ? 'تخصيص الـ 46 صلاحية التفصيلية'
                            : 'Customize All 46 Capabilities'}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isQuickPermsExpanded && (
                    <div
                      data-testid={`quick-permissions-grid-${u.id}`}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2"
                    >
                      {PERMISSION_ITEMS.map((perm) => {
                        const enabled = Boolean(u.permissions?.[perm.key]);
                        return (
                          <label
                            key={perm.key}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                              enabled
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200 font-semibold'
                                : 'bg-neutral-900/60 border-neutral-800 text-neutral-500'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={() => handleTogglePermission(u, perm.key)}
                              className="rounded border-neutral-700 text-emerald-500 focus:ring-emerald-500"
                            />
                            <span className="truncate">
                              {isAr ? perm.labelAr : perm.labelEn}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Expanded 11-Group / 46-Capability Matrix */}
                  {isExpanded && (
                    <div
                      data-testid={`granular-capability-matrix-${u.id}`}
                      className="mt-3 p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      {CAPABILITY_GROUPS.map((group) => (
                        <div
                          key={group.groupKey}
                          className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800/90 space-y-1.5"
                        >
                          <div className="text-[11px] font-black text-amber-300 pb-1 border-b border-neutral-800">
                            {isAr ? group.labelAr : group.labelEn}
                          </div>
                          <div className="space-y-1">
                            {group.capabilities.map((cap) => {
                              const hasCap = userCaps.includes(cap.code);
                              return (
                                <label
                                  key={cap.code}
                                  className="flex items-center justify-between gap-2 text-[11px] text-neutral-300 cursor-pointer py-0.5"
                                >
                                  <span className="truncate">
                                    {isAr ? cap.labelAr : cap.labelEn}
                                  </span>
                                  <input
                                    type="checkbox"
                                    checked={hasCap}
                                    onChange={() => handleToggleCapability(u, cap.code)}
                                    className="accent-emerald-500 shrink-0"
                                  />
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Company Staff Invitations History & Status Panel */}
      {canManageInvites && (
        <div
          data-testid="company-invitations-panel"
          className="p-3.5 rounded-2xl bg-neutral-950/85 border border-neutral-800 space-y-3"
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-black text-white">
                {isAr
                  ? `دعوات الموظفين (${invitations.length})`
                  : `Staff Invitations (${invitations.length})`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void refreshCompanyInvites()}
                disabled={isLoadingInvites}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] font-bold text-neutral-300 inline-flex items-center gap-1.5"
              >
                <RefreshCw
                  className={`w-3 h-3 ${isLoadingInvites ? 'animate-spin text-emerald-400' : ''}`}
                />
                <span>{isAr ? 'تحديث' : 'Refresh'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsInviteFormOpen(true);
                  setIsAccountFormOpen(false);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-[11px] font-extrabold text-emerald-300 inline-flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>{isAr ? 'دعوة جديدة' : 'New Invite'}</span>
              </button>
            </div>
          </div>

          {invitations.length === 0 ? (
            <p className="text-xs text-neutral-400 py-2">
              {isAr
                ? 'لا توجد دعوات مرسلة بعد. اضغط على "دعوة موظف" لإضافة كاشير أو مدير فرع بالبريد الإلكتروني ورابط الدعوة.'
                : 'No invitations created yet. Click "Invite Staff" to onboard cashiers or branch managers via email invite links.'}
            </p>
          ) : (
            <div className="space-y-2">
              {invitations.map((inv) => {
                const roleDef = SYSTEM_ROLE_DEFINITIONS.find((d) => d.code === inv.roleId);
                const brObj = branches.find((b) => b.id === inv.branchId);
                const statusStyles =
                  inv.status === 'PENDING'
                    ? 'bg-amber-500/15 border-amber-500/35 text-amber-300'
                    : inv.status === 'ACCEPTED'
                    ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                    : inv.status === 'REVOKED'
                    ? 'bg-rose-500/15 border-rose-500/35 text-rose-300'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400';
                const statusLabel =
                  inv.status === 'PENDING'
                    ? isAr
                      ? 'بانتظار القبول'
                      : 'Pending'
                    : inv.status === 'ACCEPTED'
                    ? isAr
                      ? 'تم القبول'
                      : 'Accepted'
                    : inv.status === 'REVOKED'
                    ? isAr
                      ? 'ملغاة'
                      : 'Revoked'
                    : isAr
                    ? 'منتهية الصلاحية'
                    : 'Expired';

                return (
                  <div
                    key={inv.id}
                    data-testid={`invitation-row-${inv.id}`}
                    className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-extrabold text-white" dir="ltr">
                          {inv.invitedEmail}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${statusStyles}`}
                        >
                          {statusLabel}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-[10px] font-bold text-neutral-300">
                          {roleDef ? (isAr ? roleDef.labelAr : roleDef.labelEn) : inv.roleId}
                        </span>
                        {brObj && (
                          <span className="text-[10px] text-neutral-400">
                            {isAr ? brObj.nameAr || brObj.name : brObj.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-wrap text-[11px] text-neutral-400">
                        <span className="inline-flex items-center gap-1 font-mono text-amber-300 font-bold">
                          <Ticket className="w-3 h-3" />
                          <span dir="ltr">{inv.shortCode}</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {isAr ? 'تنتهي: ' : 'Expires: '}
                            {new Date(inv.expiresAt).toLocaleString()}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {inv.status === 'PENDING' && (
                        <>
                          <button
                            type="button"
                            onClick={() => void handleCopyInviteCode(inv.id, inv.shortCode)}
                            className="px-2.5 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-[11px] font-bold text-neutral-200 inline-flex items-center gap-1"
                            data-testid={`copy-invite-code-${inv.id}`}
                          >
                            {copiedInviteCodeId === inv.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {copiedInviteCodeId === inv.id
                                ? isAr
                                  ? 'تم النسخ'
                                  : 'Copied'
                                : isAr
                                ? 'نسخ الكود'
                                : 'Copy Code'}
                            </span>
                          </button>
                          <button
                            type="button"
                            disabled={revokingInviteId === inv.id}
                            onClick={() => void handleRevokeInvite(inv.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 text-[11px] font-bold text-rose-300 inline-flex items-center gap-1 disabled:opacity-50"
                            data-testid={`revoke-invite-${inv.id}`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{isAr ? 'إلغاء الدعوة' : 'Revoke'}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Multi-Device Pairing & Linking Guide Banner */}
      <div className="p-3.5 rounded-2xl bg-sky-950/25 border border-sky-500/30 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-xs font-bold text-sky-200">
              {isAr
                ? 'ربط ومزامنة الأجهزة المتعددة لنفس الشركة'
                : 'Multi-Device POS Terminal Synchronization'}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono text-[10px] font-bold">
            {currentCompany.id}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div
            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-amber-300 truncate"
            dir="ltr"
          >
            <Link2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{sharedPosUrl}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <TactileButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCopyPosLink}
              leftIcon={
                copiedLink ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )
              }
            >
              {copiedLink
                ? isAr
                  ? 'تم نسخ الرابط!'
                  : 'Link Copied!'
                : isAr
                ? 'نسخ رابط الجهاز'
                : 'Copy Device Link'}
            </TactileButton>
            <TactileButton
              type="button"
              variant="amber"
              size="sm"
              onClick={syncTransactions}
              isLoading={isSyncing}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              {isAr ? 'مزامنة الأجهزة الآن' : 'Sync Devices Now'}
            </TactileButton>
          </div>
        </div>
        {lastSyncedAt && (
          <div className="text-[10px] text-emerald-400">
            {isAr
              ? `✓ جاهز للعمل أوفلاين ومزامنة البيانات محلياً: ${lastSyncedAt.toLocaleTimeString()}`
              : `✓ Offline-ready & local sync active: ${lastSyncedAt.toLocaleTimeString()}`}
          </div>
        )}
      </div>

      {/* Share Newly Created Staff Invitation Modal (QR + Short Code + WhatsApp + Mail) */}
      <CompanyInviteShareModal
        isOpen={Boolean(createdShareInvite)}
        inviteUrl={createdShareInvite?.inviteUrl || ''}
        shortCode={createdShareInvite?.shortCode || ''}
        invitedEmail={createdShareInvite?.invitedEmail || ''}
        roleName={createdShareInvite?.roleName || ''}
        companyName={createdShareInvite?.companyName || ''}
        expiresAt={createdShareInvite?.expiresAt || ''}
        language={settings.language}
        onClose={() => setCreatedShareInvite(null)}
      />
    </AppCard>
  );
};
