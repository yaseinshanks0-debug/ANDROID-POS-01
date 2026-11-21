/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  INVITATION_STATUSES,
  INVITE_TTL_MS,
  normalizeEmail,
  isValidEmailFormat,
  maskEmail,
  normalizeShortCode,
  isValidShortCode,
  generateInviteShortCode,
  buildInviteSharePayload,
} from '../invitation-utils';

describe('invitation-utils (Email Auth & Company Invitations)', () => {
  it('normalizes email casing and whitespace consistently', () => {
    assert.equal(normalizeEmail('  Cashier@Shop.COM  '), 'cashier@shop.com');
    assert.equal(isValidEmailFormat('  Cashier@Shop.COM '), true);
    assert.equal(isValidEmailFormat('not-an-email'), false);
    assert.equal(isValidEmailFormat('a@b'), false);
  });

  it('masks emails safely for unauthenticated invite preview', () => {
    assert.equal(maskEmail('ahmed.ali@shop.com'), 'a***i@shop.com');
    assert.equal(maskEmail('ab@x.co'), 'a***@x.co');
    assert.equal(maskEmail('x@y.sd'), 'x***@y.sd');
  });

  it('generates and normalizes unambiguous DQ-XXXX-XX short codes', () => {
    for (let i = 0; i < 40; i += 1) {
      const code = generateInviteShortCode();
      assert.equal(isValidShortCode(code), true, `Invalid generated code: ${code}`);
      assert.doesNotMatch(code.slice(3), /[0O1IL]/, `Ambiguous character found in ${code}`);
    }
    assert.equal(normalizeShortCode(' dq-7k4m-9p '), 'DQ-7K4M-9P');
    assert.equal(normalizeShortCode('dq7k4m9p'), 'DQ-7K4M-9P');
    assert.equal(normalizeShortCode('7k4m9p'), 'DQ-7K4M-9P');
    assert.equal(isValidShortCode('dq7k4m9p'), true);
    assert.equal(isValidShortCode('DQ-0000-OO'), false);
  });

  it('builds bilingual WhatsApp and mailto share payloads containing link and code', () => {
    const ar = buildInviteSharePayload({
      companyName: 'متجر النور',
      roleLabel: 'كاشير مبيعات',
      inviteUrl: 'https://pos.example.com/?invite=tok123',
      shortCode: 'dq7k4m9p',
      language: 'ar',
    });
    assert.match(ar.message, /متجر النور/);
    assert.match(ar.message, /DQ-7K4M-9P/);
    assert.match(ar.message, /https:\/\/pos\.example\.com\/\?invite=tok123/);
    assert.ok(ar.whatsappUrl.startsWith('https://wa.me/?text='));
    assert.ok(ar.mailtoUrl.startsWith('mailto:?subject='));

    const en = buildInviteSharePayload({
      companyName: 'Noor Retail',
      roleLabel: 'Cashier',
      inviteUrl: 'https://pos.example.com/?invite=tok123',
      shortCode: 'DQ-7K4M-9P',
      language: 'en',
    });
    assert.match(en.message, /Noor Retail/);
    assert.match(en.message, /DQ-7K4M-9P/);
    assert.equal(INVITATION_STATUSES.PENDING, 'PENDING');
    assert.equal(INVITE_TTL_MS, 48 * 60 * 60 * 1000);
  });
});
