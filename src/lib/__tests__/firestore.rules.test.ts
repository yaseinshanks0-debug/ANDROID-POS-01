/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Firestore Security Rules — Dirty Dozen & Eight Pillars Verification', () => {
  const rulesPath = path.resolve(process.cwd(), 'firestore.rules');
  const rulesContent = fs.readFileSync(rulesPath, 'utf-8');

  it('enforces rules_version = 2 and global default-deny safety net', () => {
    assert.ok(rulesContent.includes("rules_version = '2';"));
    assert.ok(rulesContent.includes('match /{document=**} {\n      allow read, write: if false;\n    }'));
  });

  it('requires verified email on all user and workspace operations (blocks Email Spoofing)', () => {
    assert.ok(rulesContent.includes('request.auth.token.email_verified == true'));
    assert.ok(rulesContent.includes('function isVerifiedUser()'));
  });

  it('enforces strict key allowlists and size bounds in validation blueprints (blocks Shadow Updates & Value Poisoning)', () => {
    assert.ok(rulesContent.includes('function isValidUserProfile(data)'));
    assert.ok(rulesContent.includes('function isValidCloudStoreSnapshot(data)'));
    assert.ok(rulesContent.includes('function isValidCloudSyncEvent(data, workspaceId)'));
    assert.ok(rulesContent.includes('data.keys().hasAll('));
    assert.ok(rulesContent.includes('data.keys().hasOnly('));
    assert.ok(rulesContent.includes('incoming().diff(existing()).affectedKeys().hasOnly('));
  });

  it('enforces Master Gate parent workspace ownership on syncEvents subcollection and blocks updates', () => {
    assert.ok(rulesContent.includes('function isParentWorkspaceOwner(workspaceId)'));
    assert.ok(rulesContent.includes('exists(/databases/$(database)/documents/cloudWorkspaces/$(workspaceId))'));
    assert.ok(rulesContent.includes('get(/databases/$(database)/documents/cloudWorkspaces/$(workspaceId)).data.ownerId == request.auth.uid'));
    assert.ok(rulesContent.includes('allow update: if false;'));
  });
});
