import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  isFinancialLifecycleItem,
  toLegacyAlertStatus,
  canUserAccessLifecycleItem,
} from '../../analytics/intelligence.lifecycle.domain';

function collectTypeScriptFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '__tests__' || entry.name === 'node_modules') continue;
      results.push(...collectTypeScriptFiles(fullPath));
    } else if (
      (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) &&
      !entry.name.endsWith('.test.ts') &&
      !entry.name.endsWith('.test.tsx')
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

const FORBIDDEN_NODE_OR_SERVER_IMPORT_REGEX =
  /^\s*import\s+(?:type\s+)?[\s\S]*?from\s+['"](?:node:[a-z0-9_]+|fs|path|crypto|zlib|os|http|https|net|tls|child_process|pg|drizzle-orm|(?:\.\.\/)+server\/|(?:\.\.\/)+db\/)['"]/gm;

test('Problem #19 — Frontend and shared isomorphic modules do not import Node-only or server-only modules', async (t) => {
  await t.test('src/lib, src/components, src/context, src/services, and isomorphic src/analytics modules are 100% browser-safe', () => {
    const rootDir = process.cwd();
    const browserSafeDirs = [
      path.join(rootDir, 'src', 'lib'),
      path.join(rootDir, 'src', 'components'),
      path.join(rootDir, 'src', 'context'),
      path.join(rootDir, 'src', 'services'),
      path.join(rootDir, 'src', 'analytics', 'calculations'),
      path.join(rootDir, 'src', 'analytics', 'forecasting'),
      path.join(rootDir, 'src', 'analytics', 'insights'),
    ];

    const browserSafeFiles = [
      ...browserSafeDirs.flatMap((d) => collectTypeScriptFiles(d)),
      path.join(rootDir, 'src', 'analytics', 'analytics.types.ts'),
      path.join(rootDir, 'src', 'analytics', 'analytics.snapshot.ts'),
      path.join(rootDir, 'src', 'analytics', 'analytics.service.ts'),
      path.join(rootDir, 'src', 'analytics', 'unmet-demand.validation.ts'),
      path.join(rootDir, 'src', 'analytics', 'intelligence.lifecycle.domain.ts'),
    ];

    const violations: string[] = [];
    for (const filePath of browserSafeFiles) {
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, 'utf-8');
      const matches = content.match(FORBIDDEN_NODE_OR_SERVER_IMPORT_REGEX);
      if (matches && matches.length > 0) {
        violations.push(`${path.relative(rootDir, filePath)}: ${matches.join(', ')}`);
      }
    }

    assert.deepEqual(
      violations,
      [],
      `Expected zero Node/server imports in browser-reachable modules, found: ${violations.join('; ')}`
    );
  });

  await t.test('intelligence.lifecycle.domain executes pure domain logic without Node dependencies', () => {
    assert.equal(isFinancialLifecycleItem({ category: 'FINANCIAL_RISK' }), true);
    assert.equal(isFinancialLifecycleItem({ category: 'REPLENISHMENT' }), false);
    assert.equal(toLegacyAlertStatus('ACKNOWLEDGED'), 'acknowledged');
    assert.equal(toLegacyAlertStatus('RESOLVED'), 'resolved');
    assert.equal(
      canUserAccessLifecycleItem(
        { scopeType: 'BRANCH', branchId: 'branch-main', category: 'FINANCIAL_RISK' },
        {
          userId: 'u-cashier',
          userName: 'Cashier 01',
          role: 'cashier',
          assignedBranchId: 'branch-main',
          canViewFinancials: false,
          canViewCostAndMargin: false,
          canViewAllBranches: false,
          canViewCustomerPII: false,
          canExportAnalytics: false,
          branchRestrictionEnforced: true,
          roleVerifiedFromServerStore: true,
        }
      ),
      false
    );
  });
});
