import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('APK & Windows EXE Packaging Integrity — package.json includes react-is, verify:rolldown, exe:stage-ui, and excludes 500MB+ desktop binaries from cloud bundle', () => {
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
  assert.equal(
    Boolean(pkg.devDependencies?.['electron'] || pkg.dependencies?.['electron']),
    false,
    'package.json must not bundle 266MB electron in cloud dependencies (exceeds 250MB limit)'
  );
  assert.equal(
    Boolean(pkg.devDependencies?.['electron-builder'] || pkg.dependencies?.['electron-builder']),
    false,
    'package.json must not bundle 254MB electron-builder in cloud dependencies (exceeds 250MB limit)'
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

test('APK & Windows EXE Packaging Integrity — Separate GitHub Actions workflows for Android (build-apk.yml) and Windows (build-windows-exe.yml)', () => {
  const androidWfPath = path.join(process.cwd(), '.github', 'workflows', 'build-apk.yml');
  const windowsWfPath = path.join(process.cwd(), '.github', 'workflows', 'build-windows-exe.yml');

  assert.ok(fs.existsSync(androidWfPath), 'build-apk.yml must exist for the Android workflow');
  assert.ok(fs.existsSync(windowsWfPath), 'build-windows-exe.yml must exist for the Windows workflow');

  const androidWf = fs.readFileSync(androidWfPath, 'utf-8');
  const windowsWf = fs.readFileSync(windowsWfPath, 'utf-8');

  // Verify Android dedicated workflow
  assert.ok(
    androidWf.includes('android-template.tar.gz'),
    'build-apk.yml must restore pristine binary assets from Capacitor android-template.tar.gz'
  );
  assert.ok(
    androidWf.includes('jar tf gradle/wrapper/gradle-wrapper.jar'),
    'build-apk.yml must verify gradle-wrapper.jar integrity using jar tf'
  );
  assert.ok(
    androidWf.includes('npm run verify:rolldown'),
    'build-apk.yml must verify Rolldown native binding before running Vite build'
  );
  assert.ok(
    androidWf.includes('tag_name: latest-apk'),
    'build-apk.yml must publish Android APK/AAB to its own release tag (latest-apk)'
  );
  assert.ok(
    !androidWf.includes('runs-on: windows-latest'),
    'build-apk.yml must be strictly dedicated to Android (no windows-latest jobs)'
  );

  // Verify Windows dedicated workflow builds frontend BEFORE installing electron-builder
  assert.ok(
    windowsWf.includes('runs-on: windows-latest'),
    'build-windows-exe.yml must run on windows-latest'
  );
  const buildIdx = windowsWf.indexOf('npm run build');
  const stageIdx = windowsWf.indexOf('npm run exe:stage-ui');
  const electronInstallIdx = windowsWf.indexOf('electron@33.4.0');
  assert.ok(
    buildIdx > 0 && stageIdx > buildIdx && electronInstallIdx > stageIdx,
    'build-windows-exe.yml must complete npm run build and npm run exe:stage-ui BEFORE installing electron/electron-builder'
  );
  assert.ok(
    windowsWf.includes('npm run verify:rolldown'),
    'build-windows-exe.yml must verify Rolldown native binding before running Vite build'
  );
  assert.ok(
    windowsWf.includes('tag_name: latest-windows-exe'),
    'build-windows-exe.yml must publish Windows EXE to its own dedicated release tag (latest-windows-exe)'
  );
});
