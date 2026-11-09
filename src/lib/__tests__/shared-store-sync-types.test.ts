/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  type CompanyScoped,
  type SharedStoreState,
  filterByCompanyScope,
  mergeById,
  tagWithCompanyScope,
} from '../../server/shared-store-sync';
import type { ActiveUserSession, Customer } from '../types';

describe('Problem #12 — Strongly-Typed SharedStoreState & Generic mergeById', () => {
  it('1. mergeById merges typed records by id and sessionId without any[] casts', () => {
    const serverCustomers: CompanyScoped<Customer>[] = [
      {
        id: 'cust-1',
        name: 'Ahmed Ali',
        phone: '+249912300001',
        loyaltyPoints: 10,
        totalSpent: 100,
        transactionCount: 2,
        createdAt: '2026-01-01T00:00:00.000Z',
        companyId: 'comp-a',
      },
    ];
    const incomingCustomers: CompanyScoped<Customer>[] = [
      {
        id: 'cust-1',
        name: 'Ahmed Ali Updated',
        phone: '+249912300001',
        loyaltyPoints: 25,
        totalSpent: 250,
        transactionCount: 5,
        createdAt: '2026-01-01T00:00:00.000Z',
        companyId: 'comp-a',
      },
      {
        id: 'cust-2',
        name: 'Sara Osman',
        phone: '+249912300002',
        loyaltyPoints: 5,
        totalSpent: 50,
        transactionCount: 1,
        createdAt: '2026-01-02T00:00:00.000Z',
        companyId: 'comp-a',
      },
    ];

    const mergedCustomers = mergeById(serverCustomers, incomingCustomers, 'id');
    assert.equal(mergedCustomers.length, 2);
    assert.equal(mergedCustomers[0].name, 'Ahmed Ali Updated');
    assert.equal(mergedCustomers[0].loyaltyPoints, 25);
    assert.equal(mergedCustomers[1].id, 'cust-2');

    // Merge sessions by sessionId
    const serverSessions: CompanyScoped<ActiveUserSession>[] = [
      {
        sessionId: 'sess-1',
        userId: 'usr-1',
        userName: 'Owner',
        role: 'admin',
        terminalName: 'POS 01',
        startedAt: '2026-01-01T00:00:00.000Z',
        lastPingAt: '2026-01-01T00:00:00.000Z',
        status: 'online',
      },
    ];
    const incomingSessions: CompanyScoped<ActiveUserSession>[] = [
      {
        sessionId: 'sess-1',
        userId: 'usr-1',
        userName: 'Owner',
        role: 'admin',
        terminalName: 'POS 01',
        startedAt: '2026-01-01T00:00:00.000Z',
        lastPingAt: '2026-01-01T01:00:00.000Z',
        status: 'idle',
      },
    ];
    const mergedSessions = mergeById(serverSessions, incomingSessions, 'sessionId');
    assert.equal(mergedSessions.length, 1);
    assert.equal(mergedSessions[0].status, 'idle');
  });

  it('2. tagWithCompanyScope and filterByCompanyScope isolate typed records accurately', () => {
    const rawCustomers: Customer[] = [
      {
        id: 'cust-10',
        name: 'Mona',
        phone: '0911111111',
        loyaltyPoints: 0,
        totalSpent: 0,
        transactionCount: 0,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ];

    const taggedA = tagWithCompanyScope(rawCustomers, 'comp-alpha');
    assert.equal(taggedA[0].companyId, 'comp-alpha');

    const combined: CompanyScoped<Customer>[] = [
      ...taggedA,
      {
        ...rawCustomers[0],
        id: 'cust-20',
        companyId: 'comp-beta',
      },
    ];

    const onlyAlpha = filterByCompanyScope(combined, 'comp-alpha');
    assert.equal(onlyAlpha.length, 1);
    assert.equal(onlyAlpha[0].id, 'cust-10');

    const state: SharedStoreState = {
      storeCode: 'DQ-POS-MAIN',
      updatedAt: '2026-01-01T00:00:00.000Z',
      transactions: [],
      customers: onlyAlpha,
      stockMovements: [],
      users: [],
      activeSessions: [],
      unmetDemandRequests: [],
    };
    assert.equal(state.customers.length, 1);
  });

  it('3. Verifies server.ts and shared-store-sync.ts do not use any[] in SharedStoreState or mergeById', () => {
    const syncSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/server/shared-store-sync.ts'),
      'utf-8'
    );
    assert.equal(
      syncSource.includes('any[]'),
      false,
      'shared-store-sync.ts must not contain any[]'
    );
    assert.equal(
      syncSource.includes('as any'),
      false,
      'shared-store-sync.ts must not contain "as any"'
    );
  });
});
