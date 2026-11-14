import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Import the CommonJS verification module
import verifyModule from '../../../scripts/verify-rolldown-binding.cjs';

const {
  getExpectedRolldownBindingSpec,
  toSafeRelativeTarPath,
  extractTgzArchive,
  verifyExtractedBinding,
  ensureRolldownBinding,
} = verifyModule as any;

test('Rolldown Hotfix 1 — Windows D:\\ paths are converted to safe relative POSIX paths without drive colons', () => {
  const winProjectRoot = 'D:\\a\\ANDROID-POS-01\\ANDROID-POS-01';
  const winArchivePath =
    'D:\\a\\ANDROID-POS-01\\ANDROID-POS-01\\.tmp-rolldown-binding\\rolldown-binding-win32-x64-msvc-1.2.15.tgz';
  const winTargetDir =
    'D:\\a\\ANDROID-POS-01\\ANDROID-POS-01\\node_modules\\@rolldown\\binding-win32-x64-msvc';

  const relArchive = toSafeRelativeTarPath(winProjectRoot, winArchivePath, path.win32);
  const relTarget = toSafeRelativeTarPath(winProjectRoot, winTargetDir, path.win32);

  assert.equal(
    relArchive,
    '.tmp-rolldown-binding/rolldown-binding-win32-x64-msvc-1.2.15.tgz',
    'Archive path must be relative POSIX without D: drive prefix'
  );
  assert.equal(
    relTarget,
    'node_modules/@rolldown/binding-win32-x64-msvc',
    'Target path must be relative POSIX without D: drive prefix'
  );
  assert.equal(relArchive.includes(':'), false, 'Relative archive path must never contain ":"');
  assert.equal(relTarget.includes(':'), false, 'Relative target path must never contain ":"');

  // Cross-drive or escaping paths must be rejected
  assert.throws(
    () => toSafeRelativeTarPath(winProjectRoot, 'C:\\Windows\\System32\\cmd.exe', path.win32),
    /Refusing unsafe or drive-qualified tar path/,
    'Cross-drive path (C:\\ vs D:\\) must be rejected'
  );
  assert.throws(
    () => toSafeRelativeTarPath(winProjectRoot, 'D:\\a\\outside.tgz', path.win32),
    /Refusing unsafe or drive-qualified tar path/,
    'Parent-escaping path (..) must be rejected'
  );
});

test('Rolldown Hotfix 2 — extractTgzArchive invokes tar with shell: false, cwd = projectRoot, and relative paths on Windows D:\\', () => {
  const winRoot = 'D:\\a\\ANDROID-POS-01\\ANDROID-POS-01';
  const winArchive =
    'D:\\a\\ANDROID-POS-01\\ANDROID-POS-01\\.tmp-rolldown-binding\\rolldown-binding-win32-x64-msvc-1.2.15.tgz';
  const winTarget =
    'D:\\a\\ANDROID-POS-01\\ANDROID-POS-01\\node_modules\\@rolldown\\binding-win32-x64-msvc';

  const mkdirCalls: string[] = [];
  let capturedCall: any = null;

  const mockFs = {
    existsSync: (p: string) => p === winArchive,
    rmSync: () => {},
    mkdirSync: (p: string) => {
      mkdirCalls.push(p);
    },
  };

  const mockSpawnSync = (command: string, args: string[], options: any) => {
    capturedCall = { command, args, options };
    return { status: 0, stdout: '', stderr: '' };
  };

  extractTgzArchive({
    projectRoot: winRoot,
    archivePath: winArchive,
    targetDir: winTarget,
    spawnSyncFn: mockSpawnSync as any,
    fsModule: mockFs as any,
    pathModule: path.win32,
    platform: 'win32',
  });

  assert.ok(mkdirCalls.includes(winTarget), 'Target directory must be created before tar extraction');
  assert.ok(capturedCall, 'spawnSync must be called');
  assert.equal(capturedCall.options.cwd, winRoot, 'cwd must equal projectRoot');
  assert.equal(capturedCall.options.shell, false, 'shell must be false');
  assert.deepEqual(capturedCall.args, [
    '-xzf',
    '.tmp-rolldown-binding/rolldown-binding-win32-x64-msvc-1.2.15.tgz',
    '--strip-components=1',
    '-C',
    'node_modules/@rolldown/binding-win32-x64-msvc',
  ]);
  for (const arg of capturedCall.args) {
    assert.equal(arg.includes('D:'), false, `tar argument "${arg}" must never contain D:`);
  }
});

test('Rolldown Hotfix 3 — Extraction failure (non-zero exit code) is caught and reported', () => {
  const winRoot = 'D:\\a\\ANDROID-POS-01\\ANDROID-POS-01';
  const winArchive =
    'D:\\a\\ANDROID-POS-01\\ANDROID-POS-01\\.tmp-rolldown-binding\\rolldown-binding-win32-x64-msvc-1.2.15.tgz';
  const winTarget =
    'D:\\a\\ANDROID-POS-01\\ANDROID-POS-01\\node_modules\\@rolldown\\binding-win32-x64-msvc';

  const mockFs = {
    existsSync: () => true,
    rmSync: () => {},
    mkdirSync: () => {},
  };

  const failingSpawnSync = () => ({
    status: 2,
    stdout: '',
    stderr: 'tar: Error opening archive: Unrecognized archive format',
  });

  assert.throws(
    () =>
      extractTgzArchive({
        projectRoot: winRoot,
        archivePath: winArchive,
        targetDir: winTarget,
        spawnSyncFn: failingSpawnSync as any,
        fsModule: mockFs as any,
        pathModule: path.win32,
        platform: 'win32',
      }),
    /tar extraction failed with exit code 2/
  );
});

test('Rolldown Hotfix 4 — verifyExtractedBinding rejects missing package, version mismatch, missing .node binary, and 0-byte .node binary', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rolldown-verify-test-'));
  try {
    const pkgName = '@rolldown/binding-win32-x64-msvc';
    const binaryFile = 'rolldown-binding.win32-x64-msvc.node';
    const pkgDir = path.join(tempRoot, 'node_modules', '@rolldown', 'binding-win32-x64-msvc');

    // Case A: Package directory completely missing
    const missingCheck = verifyExtractedBinding({
      rootDir: tempRoot,
      pkgName,
      expectedVersion: '1.2.15',
      expectedBinaryFile: binaryFile,
      checkNativeLoad: false,
    });
    assert.equal(missingCheck.ok, false);
    assert.match(missingCheck.reason || '', /Missing package\.json/);

    // Case B: Directory and package.json exist, but version is wrong (1.2.14 != 1.2.15)
    fs.mkdirSync(pkgDir, { recursive: true });
    fs.writeFileSync(
      path.join(pkgDir, 'package.json'),
      JSON.stringify({ name: pkgName, version: '1.2.14', main: binaryFile })
    );
    const wrongVersionCheck = verifyExtractedBinding({
      rootDir: tempRoot,
      pkgName,
      expectedVersion: '1.2.15',
      expectedBinaryFile: binaryFile,
      checkNativeLoad: false,
    });
    assert.equal(wrongVersionCheck.ok, false);
    assert.match(wrongVersionCheck.reason || '', /Version mismatch/);

    // Case C: Correct version (1.2.15), but .node binary file is missing (directory alone is NOT enough)
    fs.writeFileSync(
      path.join(pkgDir, 'package.json'),
      JSON.stringify({ name: pkgName, version: '1.2.15', main: binaryFile })
    );
    const missingBinaryCheck = verifyExtractedBinding({
      rootDir: tempRoot,
      pkgName,
      expectedVersion: '1.2.15',
      expectedBinaryFile: binaryFile,
      checkNativeLoad: false,
    });
    assert.equal(missingBinaryCheck.ok, false);
    assert.match(missingBinaryCheck.reason || '', /Missing native binary/);

    // Case D: .node binary exists but size === 0 bytes
    const binPath = path.join(pkgDir, binaryFile);
    fs.writeFileSync(binPath, Buffer.alloc(0));
    const emptyBinaryCheck = verifyExtractedBinding({
      rootDir: tempRoot,
      pkgName,
      expectedVersion: '1.2.15',
      expectedBinaryFile: binaryFile,
      checkNativeLoad: false,
    });
    assert.equal(emptyBinaryCheck.ok, false);
    assert.match(emptyBinaryCheck.reason || '', /empty or not a regular file/);

    // Case E: Non-empty .node binary + native load verification via requireFn
    fs.writeFileSync(binPath, Buffer.from('MZ-mock-pe-binary-payload'));
    const validCheck = verifyExtractedBinding({
      rootDir: tempRoot,
      pkgName,
      expectedVersion: '1.2.15',
      expectedBinaryFile: binaryFile,
      checkNativeLoad: true,
      requireFn: ((id: string) => {
        assert.equal(id, pkgDir);
        return { Binding: true };
      }) as any,
    });
    assert.equal(validCheck.ok, true);
    assert.equal(validCheck.version, '1.2.15');
    assert.ok((validCheck.binarySize || 0) > 0);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test('Rolldown Hotfix 5 — Real extraction & verification of @rolldown/binding-win32-x64-msvc@1.2.15 and native loading of host binding', () => {
  const projectRoot = process.cwd();

  // 1. Verify current host binding (@rolldown/binding-linux-x64-gnu on Linux or @rolldown/binding-win32-x64-msvc on Windows) loads in Node.js
  const hostResult = ensureRolldownBinding({
    rootDir: projectRoot,
    checkNativeLoad: true,
  });
  assert.equal(hostResult.ok, true);
  assert.equal(hostResult.version, '1.2.15');
  assert.ok((hostResult.binarySize || 0) > 0);

  // 2. Test real npm pack + relative tar extraction of @rolldown/binding-win32-x64-msvc@1.2.15 in an isolated temp workspace
  const tempWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), 'rolldown-win32-extract-'));
  try {
    const rolldownDir = path.join(tempWorkspace, 'node_modules', 'rolldown');
    fs.mkdirSync(rolldownDir, { recursive: true });
    fs.writeFileSync(
      path.join(rolldownDir, 'package.json'),
      JSON.stringify({ name: 'rolldown', version: '1.2.15' })
    );

    const winSpec = getExpectedRolldownBindingSpec('win32', 'x64');
    assert.equal(winSpec.pkgName, '@rolldown/binding-win32-x64-msvc');
    assert.equal(winSpec.binaryFile, 'rolldown-binding.win32-x64-msvc.node');

    const winExtractResult = ensureRolldownBinding({
      rootDir: tempWorkspace,
      platform: 'win32',
      arch: 'x64',
      // On non-Windows hosts, PE .node DLLs cannot be dlopen'd by Linux ELF Node, so verify PE header on Linux and full dlopen on Windows
      checkNativeLoad: process.platform === 'win32',
    });

    assert.equal(winExtractResult.ok, true);
    assert.equal(winExtractResult.repaired, true);
    assert.equal(winExtractResult.version, '1.2.15');

    const extractedPkgJson = path.join(
      tempWorkspace,
      'node_modules',
      '@rolldown',
      'binding-win32-x64-msvc',
      'package.json'
    );
    const extractedNodeBin = path.join(
      tempWorkspace,
      'node_modules',
      '@rolldown',
      'binding-win32-x64-msvc',
      'rolldown-binding.win32-x64-msvc.node'
    );

    assert.equal(fs.existsSync(extractedPkgJson), true, 'package.json must exist after extraction');
    assert.equal(
      JSON.parse(fs.readFileSync(extractedPkgJson, 'utf-8')).version,
      '1.2.15',
      'Extracted package.json version must be 1.2.15'
    );
    assert.equal(
      fs.existsSync(extractedNodeBin),
      true,
      'rolldown-binding.win32-x64-msvc.node must exist after extraction'
    );
    const binStat = fs.statSync(extractedNodeBin);
    assert.ok(binStat.size > 20_000_000, `Expected >20MB native binary, got ${binStat.size} bytes`);

    // Verify Windows PE magic header ('MZ') on the extracted .node binary
    const fd = fs.openSync(extractedNodeBin, 'r');
    const header = Buffer.alloc(2);
    fs.readSync(fd, header, 0, 2, 0);
    fs.closeSync(fd);
    assert.equal(header.toString('ascii'), 'MZ', 'Extracted .node binary must have valid Windows PE MZ header');
  } finally {
    fs.rmSync(tempWorkspace, { recursive: true, force: true });
  }
});

test('Rolldown Hotfix 6 — TypeScript @typescript/typescript-win32-x64 lib/tsc.exe verification & safe Windows extraction', () => {
  const {
    ensurePackageBinding,
    ensurePlatformToolchainBindings,
  } = verifyModule as any;

  // 1. Host toolchain bindings (linux-x64 on this container, win32-x64 on Windows) must verify cleanly
  const hostToolchain = ensurePlatformToolchainBindings({ rootDir: process.cwd() });
  assert.equal(hostToolchain.typescript?.ok, true, 'Host TypeScript native binary must be present');
  assert.equal(hostToolchain['tailwindcss-oxide']?.ok, true, 'Host Tailwind Oxide binary must be present');
  assert.equal(hostToolchain.lightningcss?.ok, true, 'Host LightningCSS binary must be present');

  // 2. Real npm pack + relative tar extraction for @typescript/typescript-win32-x64@7.0.2 in isolated workspace
  const tempWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), 'ts-win32-extract-'));
  try {
    const tsDir = path.join(tempWorkspace, 'node_modules', 'typescript');
    fs.mkdirSync(tsDir, { recursive: true });
    fs.writeFileSync(
      path.join(tsDir, 'package.json'),
      JSON.stringify({ name: 'typescript', version: '7.0.2' })
    );

    const winTsResult = ensurePackageBinding({
      rootDir: tempWorkspace,
      parentPkg: 'typescript',
      pkgName: '@typescript/typescript-win32-x64',
      binaryFile: 'lib/tsc.exe',
      platform: 'win32',
      arch: 'x64',
      checkNativeLoad: false,
    });

    assert.equal(winTsResult.ok, true);
    assert.equal(winTsResult.repaired, true);
    assert.equal(winTsResult.version, '7.0.2');

    const tscExePath = path.join(
      tempWorkspace,
      'node_modules',
      '@typescript',
      'typescript-win32-x64',
      'lib',
      'tsc.exe'
    );
    assert.equal(fs.existsSync(tscExePath), true, 'lib/tsc.exe must exist after extraction');
    const stat = fs.statSync(tscExePath);
    assert.ok(stat.size > 10_000_000, `Expected >10MB tsc.exe binary, got ${stat.size} bytes`);

    const fd = fs.openSync(tscExePath, 'r');
    const header = Buffer.alloc(2);
    fs.readSync(fd, header, 0, 2, 0);
    fs.closeSync(fd);
    assert.equal(header.toString('ascii'), 'MZ', 'Extracted tsc.exe must have valid Windows PE MZ header');
  } finally {
    fs.rmSync(tempWorkspace, { recursive: true, force: true });
  }
});

test('Rolldown Hotfix 7 — package-lock.json includes all required win32-x64 and linux-x64 native bindings', () => {
  const lockPath = path.join(process.cwd(), 'package-lock.json');
  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf-8'));

  const requiredPlatformKeys = [
    'node_modules/@rolldown/binding-win32-x64-msvc',
    'node_modules/@rolldown/binding-linux-x64-gnu',
    'node_modules/@typescript/typescript-win32-x64',
    'node_modules/@typescript/typescript-linux-x64',
    'node_modules/@tailwindcss/oxide-win32-x64-msvc',
    'node_modules/@tailwindcss/oxide-linux-x64-gnu',
    'node_modules/lightningcss-win32-x64-msvc',
    'node_modules/lightningcss-linux-x64-gnu',
  ];

  for (const pkgKey of requiredPlatformKeys) {
    assert.ok(
      lock.packages[pkgKey] && typeof lock.packages[pkgKey].version === 'string',
      `package-lock.json must include "${pkgKey}" so npm ci installs it reliably`
    );
  }
});
