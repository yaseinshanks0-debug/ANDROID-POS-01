/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import crypto from 'node:crypto';
import { Router, type Request, type Response } from 'express';
import { eq } from 'drizzle-orm';
import { db, hasDatabaseCredentials } from '../db/index.ts';
import { companyInvitations, roles, users } from '../db/schema.ts';
import {
  INVITATION_STATUSES,
  INVITE_TTL_MS,
  generateInviteShortCode,
  isValidEmailFormat,
  isValidShortCode,
  maskEmail,
  normalizeEmail,
  normalizeShortCode,
  type InvitationStatus,
} from '../lib/invitation-utils.ts';
import {
  SYSTEM_ROLE_DEFINITIONS,
  deriveLegacyPermissionsFromCapabilities,
  getDefaultCapabilitiesForRole,
  mapSystemRoleToLegacyRole,
  normalizeSystemRoleCode,
  type SystemRoleCode,
} from '../lib/rbac-capabilities.ts';
import type {
  BranchRecord,
  CompanyInvitationSummary,
  CompanyProfile,
  InvitationPreviewResult,
} from '../lib/types.ts';
import {
  extractBearerToken,
  verifyFirebaseIdToken,
  type VerifiedFirebaseIdentity,
} from './firebase-admin.ts';
import {
  PRACTICE_COMPANY_ID,
  ReleasePlatformError,
  appendPlatformAuditLog,
  assertActorHasCapability,
  hashPinScrypt,
  issueSessionForUser,
  loadPlatformState,
  resolveAuthenticatedActorFromRequest,
  sanitizeStoredUser,
  savePlatformState,
  sendPlatformError,
  type AuthenticatedActorContext,
  type PlatformOnboardingState,
  type SanitizedUserRecord,
  type StoredCompanyInvitationRecord,
  type StoredUserRecord,
} from './release-onboarding.service.ts';

export function hashInviteToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken.trim()).digest('hex');
}

async function ensurePostgresSystemRole(
  roleCode: SystemRoleCode,
  companyId: string
): Promise<void> {
  if (!hasDatabaseCredentials() || !db) return;
  const roleDef = SYSTEM_ROLE_DEFINITIONS.find((r) => r.code === roleCode);
  await db
    .insert(roles)
    .values({
      id: roleCode,
      companyId,
      code: roleCode,
      name: roleDef?.labelEn || roleCode,
      nameAr: roleDef?.labelAr || roleCode,
      description: roleDef?.descriptionEn || '',
      descriptionAr: roleDef?.descriptionAr || '',
      isSystem: true,
      permissions: roleDef?.defaultCapabilities || getDefaultCapabilitiesForRole(roleCode),
    })
    .onConflictDoNothing();
}

function getRoleElevationRank(role: SystemRoleCode): number {
  switch (role) {
    case 'COMPANY_OWNER':
      return 100;
    case 'ADMIN':
      return 80;
    case 'MANAGER':
      return 60;
    default:
      return 20;
  }
}

export function canActorInviteRole(
  actorRole: SystemRoleCode,
  targetRole: SystemRoleCode
): boolean {
  if (actorRole === 'COMPANY_OWNER') return true;
  if (actorRole === 'ADMIN') return targetRole !== 'COMPANY_OWNER';
  return getRoleElevationRank(targetRole) < getRoleElevationRank('ADMIN');
}

function resolveEffectiveInvitationStatus(
  invitation: StoredCompanyInvitationRecord,
  nowMs = Date.now()
): InvitationStatus {
  if (
    invitation.status === INVITATION_STATUSES.PENDING &&
    new Date(invitation.expiresAt).getTime() <= nowMs
  ) {
    invitation.status = INVITATION_STATUSES.EXPIRED;
  }
  return invitation.status;
}

function sanitizeInvitationSummary(
  invitation: StoredCompanyInvitationRecord,
  companyBranches: BranchRecord[]
): CompanyInvitationSummary {
  const branch = invitation.branchId
    ? companyBranches.find((b) => b.id === invitation.branchId)
    : undefined;
  return {
    id: invitation.id,
    companyId: invitation.companyId,
    branchId: invitation.branchId,
    branchName: branch?.nameAr || branch?.name,
    invitedEmail: invitation.invitedEmail,
    invitedName: invitation.invitedName,
    roleId: invitation.roleId,
    shortCode: invitation.shortCode,
    status: invitation.status,
    expiresAt: invitation.expiresAt,
    invitedByUserId: invitation.invitedByUserId,
    invitedByName: invitation.invitedByName,
    acceptedByUserId: invitation.acceptedByUserId,
    acceptedAt: invitation.acceptedAt,
    revokedAt: invitation.revokedAt,
    createdAt: invitation.createdAt,
  };
}

function resolvePublicAppBaseUrl(req: Request): string {
  const configured = (process.env.APP_URL || process.env.PUBLIC_APP_URL || '').trim();
  if (configured) {
    return configured.replace(/\/+$/, '');
  }
  const forwardedProto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  const proto = forwardedProto || req.protocol || 'http';
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000')
    .split(',')[0]
    .trim();
  return `${proto}://${host}`;
}

function findInvitationByLookup(
  state: PlatformOnboardingState,
  lookup: { token?: string; shortCode?: string }
): StoredCompanyInvitationRecord | undefined {
  const rawToken = typeof lookup.token === 'string' ? lookup.token.trim() : '';
  const rawCode = typeof lookup.shortCode === 'string' ? lookup.shortCode.trim() : '';
  const invitations = state.invitations || [];

  if (rawToken) {
    const tokenHash = hashInviteToken(rawToken);
    const byToken = invitations.find((inv) => inv.tokenHash === tokenHash);
    if (byToken) return byToken;
  }
  if (rawCode) {
    const normalizedCode = normalizeShortCode(rawCode);
    if (isValidShortCode(normalizedCode)) {
      return invitations.find((inv) => inv.shortCode === normalizedCode);
    }
  }
  return undefined;
}

export interface CreateCompanyInvitationInput {
  email: string;
  invitedName?: string;
  roleId?: string;
  branchId?: string;
}

export interface CreateCompanyInvitationOutput {
  invitation: CompanyInvitationSummary;
  inviteUrl: string;
  rawToken: string;
  shortCode: string;
  expiresAt: string;
}

export async function createCompanyInvitation(
  actor: AuthenticatedActorContext,
  input: CreateCompanyInvitationInput,
  baseUrl: string
): Promise<CreateCompanyInvitationOutput> {
  assertActorHasCapability(actor, 'users.create');

  if (actor.workspaceMode === 'PRACTICE' || actor.company.id === PRACTICE_COMPANY_ID) {
    throw new ReleasePlatformError(
      403,
      'PRACTICE_MODE_INVITE_FORBIDDEN',
      'Staff invitations can only be created for real production companies.'
    );
  }

  const normalizedEmail = normalizeEmail(input.email || '');
  if (!isValidEmailFormat(normalizedEmail)) {
    throw new ReleasePlatformError(
      400,
      'INVALID_INVITE_EMAIL',
      'Please enter a valid email address for the invited staff member.'
    );
  }

  const targetRole = normalizeSystemRoleCode(input.roleId || 'CASHIER');
  if (!canActorInviteRole(actor.user.systemRole, targetRole)) {
    throw new ReleasePlatformError(
      403,
      'FORBIDDEN_ROLE_ESCALATION',
      `Your role (${actor.user.systemRole}) is not authorized to invite a user with role ${targetRole}.`
    );
  }

  const state = loadPlatformState();
  state.invitations = state.invitations || [];

  const companyBranches = state.branches.filter((b) => b.companyId === actor.company.id);
  let targetBranchId: string | null = null;
  if (input.branchId && input.branchId.trim()) {
    const requestedBranch = state.branches.find((b) => b.id === input.branchId?.trim());
    if (!requestedBranch || requestedBranch.companyId !== actor.company.id) {
      throw new ReleasePlatformError(
        403,
        'FORBIDDEN_CROSS_COMPANY_BRANCH',
        'The selected branch does not belong to your company.'
      );
    }
    targetBranchId = requestedBranch.id;
  } else {
    targetBranchId =
      companyBranches.find((b) => b.id === actor.user.branchId)?.id ||
      companyBranches.find((b) => b.isMain)?.id ||
      companyBranches[0]?.id ||
      null;
  }

  const nowIso = new Date().toISOString();

  // Auto-revoke any existing PENDING invite for the same company + email
  const revokedIds: string[] = [];
  for (const existing of state.invitations) {
    if (
      existing.companyId === actor.company.id &&
      existing.invitedEmail === normalizedEmail &&
      existing.status === INVITATION_STATUSES.PENDING
    ) {
      existing.status = INVITATION_STATUSES.REVOKED;
      existing.revokedAt = nowIso;
      existing.revokedByUserId = actor.user.id;
      revokedIds.push(existing.id);
    }
  }

  const rawToken = crypto.randomBytes(32).toString('base64url');
  const tokenHash = hashInviteToken(rawToken);

  let shortCode = generateInviteShortCode();
  const activeCodes = new Set(
    state.invitations
      .filter((inv) => inv.status === INVITATION_STATUSES.PENDING)
      .map((inv) => inv.shortCode)
  );
  for (let attempt = 0; attempt < 8 && activeCodes.has(shortCode); attempt += 1) {
    shortCode = generateInviteShortCode();
  }

  const expiresAt = new Date(Date.now() + INVITE_TTL_MS).toISOString();
  const invitationId = `inv-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`;

  const record: StoredCompanyInvitationRecord = {
    id: invitationId,
    companyId: actor.company.id,
    branchId: targetBranchId,
    invitedEmail: normalizedEmail,
    invitedName: input.invitedName?.trim() || null,
    roleId: targetRole,
    tokenHash,
    shortCode,
    status: INVITATION_STATUSES.PENDING,
    expiresAt,
    invitedByUserId: actor.user.id,
    invitedByName: actor.user.name,
    acceptedByUserId: null,
    acceptedAt: null,
    revokedByUserId: null,
    revokedAt: null,
    createdAt: nowIso,
  };

  state.invitations.unshift(record);

  appendPlatformAuditLog(state, {
    companyId: actor.company.id,
    userId: actor.user.id,
    actorName: actor.user.name,
    action: 'COMPANY_INVITATION_CREATED',
    entityType: 'company_invitation',
    entityId: record.id,
    details: {
      invitedEmail: record.invitedEmail,
      roleId: record.roleId,
      branchId: record.branchId,
      shortCode: record.shortCode,
      supersededCount: revokedIds.length,
    },
  });

  savePlatformState(state);

  // Best-effort additive PostgreSQL mirror
  if (hasDatabaseCredentials() && db) {
    try {
      await ensurePostgresSystemRole(record.roleId, record.companyId);
      for (const oldId of revokedIds) {
        await db
          .update(companyInvitations)
          .set({
            status: INVITATION_STATUSES.REVOKED,
            revokedAt: new Date(nowIso),
          })
          .where(eq(companyInvitations.id, oldId));
      }
      await db
        .insert(companyInvitations)
        .values({
          id: record.id,
          companyId: record.companyId,
          branchId: record.branchId,
          invitedEmail: record.invitedEmail,
          invitedName: record.invitedName,
          roleId: record.roleId,
          tokenHash: record.tokenHash,
          shortCode: record.shortCode,
          status: record.status,
          expiresAt: new Date(record.expiresAt),
          invitedByUserId: actor.user.id,
        })
        .onConflictDoNothing();
    } catch (dbErr) {
      console.warn('Non-fatal PostgreSQL sync warning during invitation creation:', dbErr);
    }
  }

  const cleanBase = baseUrl.replace(/\/+$/, '');
  const inviteUrl = `${cleanBase}/?invite=${encodeURIComponent(rawToken)}`;

  return {
    invitation: sanitizeInvitationSummary(record, companyBranches),
    inviteUrl,
    rawToken,
    shortCode,
    expiresAt,
  };
}

export function listCompanyInvitations(
  actor: AuthenticatedActorContext
): CompanyInvitationSummary[] {
  assertActorHasCapability(actor, 'users.view');
  const state = loadPlatformState();
  state.invitations = state.invitations || [];
  const companyBranches = state.branches.filter((b) => b.companyId === actor.company.id);

  let mutated = false;
  const nowMs = Date.now();
  const companyInvites = state.invitations.filter((inv) => inv.companyId === actor.company.id);
  for (const inv of companyInvites) {
    const prev = inv.status;
    resolveEffectiveInvitationStatus(inv, nowMs);
    if (inv.status !== prev) {
      mutated = true;
    }
  }

  if (mutated) {
    savePlatformState(state);
  }

  return companyInvites.map((inv) => sanitizeInvitationSummary(inv, companyBranches));
}

export async function revokeCompanyInvitation(
  actor: AuthenticatedActorContext,
  invitationId: string
): Promise<CompanyInvitationSummary> {
  assertActorHasCapability(actor, 'users.create');
  const state = loadPlatformState();
  state.invitations = state.invitations || [];

  const target = state.invitations.find(
    (inv) => inv.id === invitationId && inv.companyId === actor.company.id
  );
  if (!target) {
    throw new ReleasePlatformError(
      404,
      'INVITATION_NOT_FOUND',
      'Invitation was not found in your company.'
    );
  }

  resolveEffectiveInvitationStatus(target);
  if (target.status === INVITATION_STATUSES.ACCEPTED) {
    throw new ReleasePlatformError(
      409,
      'INVITATION_ALREADY_ACCEPTED',
      'Cannot revoke an invitation that has already been accepted.'
    );
  }

  const nowIso = new Date().toISOString();
  target.status = INVITATION_STATUSES.REVOKED;
  target.revokedAt = nowIso;
  target.revokedByUserId = actor.user.id;

  appendPlatformAuditLog(state, {
    companyId: actor.company.id,
    userId: actor.user.id,
    actorName: actor.user.name,
    action: 'COMPANY_INVITATION_REVOKED',
    entityType: 'company_invitation',
    entityId: target.id,
    details: {
      invitedEmail: target.invitedEmail,
      shortCode: target.shortCode,
    },
  });

  savePlatformState(state);

  if (hasDatabaseCredentials() && db) {
    try {
      await db
        .update(companyInvitations)
        .set({
          status: INVITATION_STATUSES.REVOKED,
          revokedAt: new Date(nowIso),
        })
        .where(eq(companyInvitations.id, target.id));
    } catch (dbErr) {
      console.warn('Non-fatal PostgreSQL sync warning during invitation revocation:', dbErr);
    }
  }

  const companyBranches = state.branches.filter((b) => b.companyId === actor.company.id);
  return sanitizeInvitationSummary(target, companyBranches);
}

export function previewCompanyInvitation(lookup: {
  token?: string;
  shortCode?: string;
}): InvitationPreviewResult {
  const state = loadPlatformState();
  const inv = findInvitationByLookup(state, lookup);
  if (!inv) {
    return { valid: false, status: 'NOT_FOUND' };
  }

  const prevStatus = inv.status;
  const effectiveStatus = resolveEffectiveInvitationStatus(inv);
  if (effectiveStatus !== prevStatus) {
    savePlatformState(state);
  }

  const company = state.companies.find((c) => c.id === inv.companyId);
  const branch = inv.branchId
    ? state.branches.find((b) => b.id === inv.branchId && b.companyId === inv.companyId)
    : undefined;
  const roleDef = SYSTEM_ROLE_DEFINITIONS.find((r) => r.code === inv.roleId);

  return {
    valid: effectiveStatus === INVITATION_STATUSES.PENDING,
    status: effectiveStatus,
    companyName: company?.displayName || company?.legalName || 'Company',
    companyNameAr: company?.displayNameAr || company?.displayName || 'الشركة',
    branchName: branch?.name,
    branchNameAr: branch?.nameAr || branch?.name,
    roleId: inv.roleId,
    roleName: roleDef?.labelEn || inv.roleId,
    roleNameAr: roleDef?.labelAr || inv.roleId,
    maskedEmail: maskEmail(inv.invitedEmail),
    invitedName: inv.invitedName,
    expiresAt: inv.expiresAt,
  };
}

export interface AcceptCompanyInvitationInput {
  token?: string;
  shortCode?: string;
  fullName?: string;
  pin?: string;
}

export interface AcceptCompanyInvitationOutput {
  sessionToken: string;
  workspaceMode: 'PRODUCTION';
  company: CompanyProfile;
  branches: BranchRecord[];
  user: SanitizedUserRecord;
  capabilities: string[];
}

export async function acceptCompanyInvitation(
  identity: VerifiedFirebaseIdentity,
  input: AcceptCompanyInvitationInput
): Promise<AcceptCompanyInvitationOutput> {
  // Synchronous read-verify-commit on platform state guarantees atomic single-use acceptance
  const state = loadPlatformState();
  const inv = findInvitationByLookup(state, {
    token: input.token,
    shortCode: input.shortCode,
  });

  if (!inv) {
    throw new ReleasePlatformError(
      404,
      'INVITATION_NOT_FOUND',
      'Invitation link or code was not found.'
    );
  }

  const effectiveStatus = resolveEffectiveInvitationStatus(inv);
  if (effectiveStatus === INVITATION_STATUSES.REVOKED) {
    throw new ReleasePlatformError(
      410,
      'INVITE_REVOKED',
      'This invitation was revoked by a company administrator.'
    );
  }
  if (effectiveStatus === INVITATION_STATUSES.EXPIRED) {
    savePlatformState(state);
    throw new ReleasePlatformError(
      410,
      'INVITE_EXPIRED',
      'This invitation has expired. Please ask your company administrator for a new invite.'
    );
  }
  if (effectiveStatus === INVITATION_STATUSES.ACCEPTED) {
    throw new ReleasePlatformError(
      409,
      'INVITE_ALREADY_USED',
      'This invitation has already been used.'
    );
  }

  const normalizedIdentityEmail = normalizeEmail(identity.email);
  if (normalizedIdentityEmail !== inv.invitedEmail) {
    throw new ReleasePlatformError(
      403,
      'INVITE_EMAIL_MISMATCH',
      'The signed-in email address does not match the invited email address.'
    );
  }

  const existingBoundUser = state.users.find(
    (u) => u.firebaseUid && u.firebaseUid === identity.uid && u.companyId !== PRACTICE_COMPANY_ID
  );
  if (existingBoundUser) {
    throw new ReleasePlatformError(
      409,
      'FIREBASE_UID_ALREADY_LINKED',
      'This email account is already linked to an existing POS user.'
    );
  }

  const company = state.companies.find((c) => c.id === inv.companyId && !c.isDemo);
  if (!company) {
    throw new ReleasePlatformError(
      404,
      'COMPANY_NOT_FOUND',
      'The company associated with this invitation no longer exists.'
    );
  }

  const companyBranches = state.branches.filter((b) => b.companyId === company.id);
  const assignedBranch =
    (inv.branchId ? companyBranches.find((b) => b.id === inv.branchId) : undefined) ||
    companyBranches.find((b) => b.isMain) ||
    companyBranches[0];
  const branchId = assignedBranch?.id || 'branch-main';

  const cleanPin = typeof input.pin === 'string' ? input.pin.trim() : '';
  if (cleanPin && !/^\d{4,6}$/.test(cleanPin)) {
    throw new ReleasePlatformError(
      400,
      'INVALID_PIN_FORMAT',
      'Offline PIN must be 4 to 6 digits.'
    );
  }

  const hashedPin = cleanPin ? hashPinScrypt(cleanPin) : null;
  const displayName =
    (input.fullName || inv.invitedName || identity.name || normalizedIdentityEmail.split('@')[0])
      .trim() || 'Staff Member';
  const capabilities = getDefaultCapabilitiesForRole(inv.roleId);
  const nowIso = new Date().toISOString();
  const suffix = `${Date.now().toString(36)}-${crypto.randomBytes(2).toString('hex')}`;
  const userId = `usr-inv-${suffix}`;

  const resolvedUsername = state.users.some(
    (u) => u.username.toLowerCase() === normalizedIdentityEmail
  )
    ? `${normalizedIdentityEmail}.${suffix}`
    : normalizedIdentityEmail;

  const newUser: StoredUserRecord = {
    id: userId,
    companyId: company.id,
    username: resolvedUsername,
    email: normalizedIdentityEmail,
    firebaseUid: identity.uid,
    emailVerified: identity.emailVerified,
    name: displayName,
    nameAr: displayName,
    role: mapSystemRoleToLegacyRole(inv.roleId),
    systemRole: inv.roleId,
    capabilities,
    branchId,
    assignedBranchIds: [branchId],
    pin: hashedPin ? hashedPin.formatted : undefined,
    pinHash: hashedPin ? hashedPin.hash : null,
    pinSalt: hashedPin ? hashedPin.salt : null,
    passwordHash: null,
    passwordSalt: null,
    hasPassword: false,
    mustChangePassword: false,
    terminalName: `${assignedBranch?.name || company.displayName} — POS`,
    terminalNameAr: `${assignedBranch?.nameAr || company.displayNameAr || company.displayName} — نقطة بيع`,
    avatarColor: '#0ea5e9',
    isActive: true,
    permissions: deriveLegacyPermissionsFromCapabilities(capabilities),
    lastActiveAt: nowIso,
    lastLoginAt: nowIso,
    tourProgressJson: {},
  };

  // Mark invitation accepted atomically in same state save
  inv.status = INVITATION_STATUSES.ACCEPTED;
  inv.acceptedByUserId = newUser.id;
  inv.acceptedAt = nowIso;

  state.users.push(newUser);
  const sessionToken = issueSessionForUser(state, newUser, 'PRODUCTION');

  appendPlatformAuditLog(state, {
    companyId: company.id,
    userId: newUser.id,
    actorName: newUser.name,
    action: 'COMPANY_INVITATION_ACCEPTED',
    entityType: 'company_invitation',
    entityId: inv.id,
    details: {
      invitedEmail: inv.invitedEmail,
      roleId: inv.roleId,
      branchId,
      hasOfflinePin: Boolean(hashedPin),
    },
  });

  savePlatformState(state);

  // Best-effort PostgreSQL mirror
  if (hasDatabaseCredentials() && db) {
    try {
      await ensurePostgresSystemRole(newUser.systemRole, company.id);
      await db
        .insert(users)
        .values({
          id: newUser.id,
          companyId: company.id,
          username: newUser.username,
          name: newUser.name,
          nameAr: newUser.nameAr,
          email: newUser.email,
          firebaseUid: newUser.firebaseUid ?? null,
          emailVerified: Boolean(newUser.emailVerified),
          roleId: newUser.systemRole,
          branchId: newUser.branchId,
          assignedBranchIds: newUser.assignedBranchIds,
          customPermissions: newUser.capabilities,
          pinCode: newUser.pin ?? null,
          pinHash: newUser.pinHash ?? null,
          pinSalt: newUser.pinSalt ?? null,
          passwordHash: null,
          passwordSalt: null,
          isActive: true,
        })
        .onConflictDoNothing();

      await db
        .update(companyInvitations)
        .set({
          status: INVITATION_STATUSES.ACCEPTED,
          acceptedByUserId: newUser.id,
          acceptedAt: new Date(nowIso),
        })
        .where(eq(companyInvitations.id, inv.id));
    } catch (dbErr) {
      console.warn('Non-fatal PostgreSQL sync warning during invitation acceptance:', dbErr);
    }
  }

  return {
    sessionToken,
    workspaceMode: 'PRODUCTION',
    company,
    branches: companyBranches,
    user: sanitizeStoredUser(newUser),
    capabilities,
  };
}

// ============================================================================
// EXPRESS ROUTER: /api/invitations
// ============================================================================

export const invitationsRouter = Router();

// POST /api/invitations — Create a staff invitation (Auth + users.manage)
invitationsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const actor = resolveAuthenticatedActorFromRequest(req);
    const result = await createCompanyInvitation(
      actor,
      {
        email: String(req.body?.email || ''),
        invitedName:
          typeof req.body?.invitedName === 'string' ? req.body.invitedName : undefined,
        roleId: typeof req.body?.roleId === 'string' ? req.body.roleId : undefined,
        branchId: typeof req.body?.branchId === 'string' ? req.body.branchId : undefined,
      },
      resolvePublicAppBaseUrl(req)
    );
    res.status(201).json({
      success: true,
      data: {
        invitation: result.invitation,
        inviteUrl: result.inviteUrl,
        shortCode: result.shortCode,
        expiresAt: result.expiresAt,
      },
    });
  } catch (err) {
    sendPlatformError(res, err, 'Failed to create company invitation');
  }
});

// GET /api/invitations — List invitations for actor's company (Auth + users.manage)
invitationsRouter.get('/', (req: Request, res: Response) => {
  try {
    const actor = resolveAuthenticatedActorFromRequest(req);
    const list = listCompanyInvitations(actor);
    res.json({
      success: true,
      data: list,
    });
  } catch (err) {
    sendPlatformError(res, err, 'Failed to list company invitations');
  }
});

// POST /api/invitations/:id/revoke — Revoke a pending invitation (Auth + users.manage + same company)
invitationsRouter.post('/:id/revoke', async (req: Request, res: Response) => {
  try {
    const actor = resolveAuthenticatedActorFromRequest(req);
    const revoked = await revokeCompanyInvitation(actor, String(req.params.id || ''));
    res.json({
      success: true,
      data: revoked,
    });
  } catch (err) {
    sendPlatformError(res, err, 'Failed to revoke company invitation');
  }
});

// POST /api/invitations/preview — Public rate-limited preview of an invite link/code (masked email only)
invitationsRouter.post('/preview', (req: Request, res: Response) => {
  try {
    const token = typeof req.body?.token === 'string' ? req.body.token : undefined;
    const shortCode = typeof req.body?.shortCode === 'string' ? req.body.shortCode : undefined;
    const preview = previewCompanyInvitation({ token, shortCode });
    res.json({
      success: true,
      data: preview,
    });
  } catch (err) {
    sendPlatformError(res, err, 'Failed to preview invitation');
  }
});

// POST /api/invitations/accept — Accept an invitation with a verified Firebase ID token
invitationsRouter.post('/accept', async (req: Request, res: Response) => {
  try {
    const bearerToken = extractBearerToken(req.headers.authorization);
    const bodyToken =
      typeof req.body?.firebaseIdToken === 'string' ? req.body.firebaseIdToken.trim() : '';
    const identity = await verifyFirebaseIdToken(bearerToken || bodyToken);

    const accepted = await acceptCompanyInvitation(identity, {
      token: typeof req.body?.token === 'string' ? req.body.token : undefined,
      shortCode: typeof req.body?.shortCode === 'string' ? req.body.shortCode : undefined,
      fullName: typeof req.body?.fullName === 'string' ? req.body.fullName : undefined,
      pin: typeof req.body?.pin === 'string' ? req.body.pin : undefined,
    });

    res.status(201).json({
      success: true,
      data: accepted,
    });
  } catch (err) {
    sendPlatformError(res, err, 'Failed to accept company invitation');
  }
});
