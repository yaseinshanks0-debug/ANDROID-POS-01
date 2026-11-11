import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('APK & Windows EXE Packaging Integrity — package.json includes react-is, electron devDependencies, verify:rolldown, and exe:stage-ui', () => {
  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  assert.equal(pkg.version, '2.5.0', 'package.json version must be aligned to 2.5.0');
  assert.equal(
    pkg.main,
    'electron/main.cjs',
    'package.json must specify electron/main.cjs as main entry point'
  );
  assert.ok(
    pkg.dependencies && typeof pkg.dependencies['react-is'] === 'string',
    'package.json dependencies must explicitly include react-is for Recharts + Vite Rolldown under --legacy-peer-deps'
  );
  assert.ok(
    pkg.devDependencies && typeof pkg.devDependencies['electron'] === 'string',
    'package.json devDependencies must include electron so a second npm install is never required in CI'
  );
  assert.ok(
    pkg.devDependencies && typeof pkg.devDependencies['electron-builder'] === 'string',
    'package.json devDependencies must include electron-builder so a second npm install is never required in CI'
  );
  assert.ok(
    pkg.scripts && typeof pkg.scripts['verify:rolldown'] === 'string',
    'package.json scripts must define verify:rolldown'
  );
  assert.ok(
    pkg.scripts && typeof pkg.scripts['exe:stage-ui'] === 'string',
    'package.json scripts must define exe:stage-ui'
  );
  assert.ok(
    pkg.scripts['exe:build'].includes('exe:stage-ui'),
    'exe:build must stage UI assets into electron/www before invoking electron-builder'
  );
});

test('APK & Windows EXE Packaging Integrity — Version 2.5.0 and App ID com.dqnamo.pos are aligned across all targets', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));
  const eb = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'electron-builder.json'), 'utf-8'));
  const capContent = fs.readFileSync(path.join(process.cwd(), 'capacitor.config.ts'), 'utf-8');
  const gradleContent = fs.readFileSync(path.join(process.cwd(), 'android', 'app', 'build.gradle'), 'utf-8');

  assert.equal(pkg.version, '2.5.0');
  assert.equal(eb.appId, 'com.dqnamo.pos');
  assert.ok(capContent.includes("appId: 'com.dqnamo.pos'"));
  assert.ok(gradleContent.includes('applicationId "com.dqnamo.pos"'));
  assert.ok(gradleContent.includes('versionCode 250'));
  assert.ok(gradleContent.includes('versionName "2.5.0"'));
});

test('APK & Windows EXE Packaging Integrity — electron-builder.json disables ASAR and bundles extraResources', () => {
  const builderPath = path.join(process.cwd(), 'electron-builder.json');
  const cfg = JSON.parse(fs.readFileSync(builderPath, 'utf-8'));

  assert.equal(cfg.asar, false, 'electron-builder.json must disable asar for reliable static serving');
  assert.ok(Array.isArray(cfg.extraResources), 'extraResources must be configured');

  const wwwResource = cfg.extraResources.find((r: any) => r.from === 'dist' && r.to === 'www');
  assert.ok(
    wwwResource,
    'extraResources must copy dist -> www so gitignored dist/ is never excluded from the Windows installer'
  );

  const seedResource = cfg.extraResources.find(
    (r: any) => r.from === '.data' && r.to === 'seed-data'
  );
  assert.ok(seedResource, 'extraResources must copy .data/*.json -> seed-data for first-run seeding');
});

test('APK & Windows EXE Packaging Integrity — electron/main.cjs resolves www/dist, seeds data, and has port fallback', () => {
  const mainCjsPath = path.join(process.cwd(), 'electron', 'main.cjs');
  const mainContent = fs.readFileSync(mainCjsPath, 'utf-8');

  assert.ok(
    mainContent.includes('resolveDistDirectory'),
    'electron/main.cjs must resolve frontend dist directory across www and dist candidates'
  );
  assert.ok(
    mainContent.includes('seedInitialDataIfNeeded'),
    'electron/main.cjs must seed initial .data JSON files on first run without overwriting user data'
  );
  assert.ok(
    mainContent.includes('resolveAvailablePort'),
    'electron/main.cjs must dynamically resolve an available port if port 3000 is occupied'
  );
  assert.ok(
    mainContent.includes('loadFile'),
    'electron/main.cjs must provide a local loadFile fallback if loopback HTTP fails'
  );
});

test('APK & Windows EXE Packaging Integrity — GitHub Actions workflow uses single npm install, verifies Rolldown binding, and stages electron/www', () => {
  const workflowPath = path.join(process.cwd(), '.github', 'workflows', 'build-apk.yml');
  const wfContent = fs.readFileSync(workflowPath, 'utf-8');

  assert.ok(
    wfContent.includes('android-template.tar.gz'),
    'build-apk.yml must restore pristine binary assets from Capacitor android-template.tar.gz'
  );
  assert.ok(
    wfContent.includes('jar tf gradle/wrapper/gradle-wrapper.jar'),
    'build-apk.yml must verify gradle-wrapper.jar integrity using jar tf'
  );
  assert.ok(
    !wfContent.includes('npm install --no-save'),
    'build-apk.yml must NEVER run a second npm install --no-save that prunes @rolldown/binding-win32-x64-msvc'
  );
  assert.ok(
    wfContent.includes('npm run verify:rolldown'),
    'build-apk.yml must verify Rolldown native binding before running Vite build'
  );
  assert.ok(
    wfContent.includes('npm run exe:stage-ui'),
    'build-apk.yml must stage dist/* into electron/www/ via npm run exe:stage-ui before packaging Windows EXE'
  );
});
