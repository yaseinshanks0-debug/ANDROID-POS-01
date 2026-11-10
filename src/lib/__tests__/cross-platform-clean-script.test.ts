import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Problem #20 — package.json clean script is cross-platform and avoids Unix-only rm -rf', () => {
  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as {
    scripts?: Record<string, string>;
  };

  const cleanScript = pkg.scripts?.clean || '';
  assert.ok(cleanScript.length > 0, 'clean script should be defined in package.json');
  assert.equal(
    /\brm\s+-rf\b/.test(cleanScript),
    false,
    'clean script must not use Unix-only "rm -rf"'
  );
  assert.equal(
    cleanScript.includes('fs.rmSync'),
    true,
    'clean script should use cross-platform Node fs.rmSync'
  );
});
