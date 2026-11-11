#!/usr/bin/env node
/**
 * Dqnamo POS — Rolldown Native Binding Verification & Safe Extraction Script
 *
 * Protects Windows (win32-x64) and Linux (linux-x64) builds against npm CLI bug #4828
 * where platform-specific optionalDependencies (@rolldown/binding-*) may be omitted.
 *
 * Key safety guarantees:
 * 1. Uses child_process.spawnSync with shell: false and cwd = projectRoot.
 * 2. Converts archive and target paths to strictly relative POSIX paths (no D:\ drive letters)
 *    so Windows/MSYS tar never misinterprets "D:..." as a remote SSH host:file address.
 * 3. Verifies after extraction:
 *    - node_modules/<pkg>/package.json exists and version === rolldown version (e.g. 1.2.15)
 *    - Native binary file (e.g. rolldown-binding.win32-x64-msvc.node) exists and size > 0
 *    - Package can be actually loaded via require() from Node.js on the target platform.
 */

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const PLATFORM_BINDINGS = Object.freeze({
  'win32-x64': {
    pkgName: '@rolldown/binding-win32-x64-msvc',
    binaryFile: 'rolldown-binding.win32-x64-msvc.node',
    platform: 'win32',
    arch: 'x64',
  },
  'win32-arm64': {
    pkgName: '@rolldown/binding-win32-arm64-msvc',
    binaryFile: 'rolldown-binding.win32-arm64-msvc.node',
    platform: 'win32',
    arch: 'arm64',
  },
  'linux-x64': {
    pkgName: '@rolldown/binding-linux-x64-gnu',
    binaryFile: 'rolldown-binding.linux-x64-gnu.node',
    platform: 'linux',
    arch: 'x64',
  },
  'linux-arm64': {
    pkgName: '@rolldown/binding-linux-arm64-gnu',
    binaryFile: 'rolldown-binding.linux-arm64-gnu.node',
    platform: 'linux',
    arch: 'arm64',
  },
  'darwin-arm64': {
    pkgName: '@rolldown/binding-darwin-arm64',
    binaryFile: 'rolldown-binding.darwin-arm64.node',
    platform: 'darwin',
    arch: 'arm64',
  },
  'darwin-x64': {
    pkgName: '@rolldown/binding-darwin-x64',
    binaryFile: 'rolldown-binding.darwin-x64.node',
    platform: 'darwin',
    arch: 'x64',
  },
});

function getExpectedRolldownBindingSpec(platform = process.platform, arch = process.arch) {
  return PLATFORM_BINDINGS[`${platform}-${arch}`] || null;
}

function getExpectedRolldownBindingPackage(platform = process.platform, arch = process.arch) {
  const spec = getExpectedRolldownBindingSpec(platform, arch);
  return spec ? spec.pkgName : null;
}

function getRolldownVersion(rootDir, fsModule = fs) {
  const rolldownPkgPath = path.join(rootDir, 'node_modules', 'rolldown', 'package.json');
  if (!fsModule.existsSync(rolldownPkgPath)) {
    throw new Error('node_modules/rolldown/package.json not found. Run npm ci or npm install first.');
  }
  const pkg = JSON.parse(fsModule.readFileSync(rolldownPkgPath, 'utf-8'));
  if (!pkg.version || typeof pkg.version !== 'string') {
    throw new Error('Invalid version in node_modules/rolldown/package.json');
  }
  return pkg.version;
}

/**
 * Converts a path inside projectRoot into a strictly relative, forward-slash path
 * suitable for `tar` with `cwd = projectRoot`.
 *
 * Explicitly rejects paths that escape projectRoot (`..`) or still contain a drive
 * letter colon (`D:`, `C:`), preventing `tar` on Windows from treating `D:...` as a
 * remote SSH host address (`Cannot connect to D: resolve failed`).
 */
function toSafeRelativeTarPath(projectRoot, targetPath, pathModule = path) {
  if (typeof projectRoot !== 'string' || !projectRoot.trim()) {
    throw new Error('projectRoot must be a non-empty path');
  }
  if (typeof targetPath !== 'string' || !targetPath.trim()) {
    throw new Error('targetPath must be a non-empty path');
  }

  const rel = pathModule.relative(projectRoot, targetPath);
  const normalized = rel.split(pathModule.sep).join('/').replace(/\\/g, '/');

  if (!normalized || normalized === '.') {
    throw new Error(`Refusing empty or root relative tar path for "${targetPath}"`);
  }
  if (
    normalized.startsWith('../') ||
    normalized === '..' ||
    normalized.startsWith('/') ||
    /^[a-zA-Z]:/.test(normalized) ||
    normalized.includes(':')
  ) {
    throw new Error(
      `Refusing unsafe or drive-qualified tar path "${normalized}" (from "${targetPath}" relative to "${projectRoot}")`
    );
  }

  return normalized;
}

/**
 * Extracts the `.tgz` filename produced by `npm pack`.
 */
function parseNpmPackFilename(stdout, tmpDir, fsModule = fs) {
  const lines = String(stdout || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (let i = lines.length - 1; i >= 0; i--) {
    const candidate = lines[i];
    if (/^[a-zA-Z0-9._-]+\.tgz$/i.test(candidate) && !candidate.includes(':')) {
      return candidate;
    }
  }

  if (tmpDir && fsModule.existsSync(tmpDir)) {
    const files = fsModule
      .readdirSync(tmpDir)
      .filter((f) => /^[a-zA-Z0-9._-]+\.tgz$/i.test(f) && !f.includes(':'));
    if (files.length === 1) {
      return files[0];
    }
  }

  throw new Error(`Could not determine .tgz filename from npm pack output: "${String(stdout || '').trim()}"`);
}

function resolveTarExecutable(platform = process.platform, fsModule = fs) {
  if (platform === 'win32') {
    const systemRoot = process.env.SystemRoot || 'C:\\Windows';
    const winTar = path.win32.join(systemRoot, 'System32', 'tar.exe');
    if (fsModule.existsSync(winTar)) {
      return winTar;
    }
  }
  return 'tar';
}

function resolveNpmCliInvocation(fsModule = fs) {
  const candidates = [
    process.env.npm_execpath,
    path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js'),
    path.join(path.dirname(process.execPath), '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if ((candidate.endsWith('.js') || candidate.endsWith('.cjs')) && fsModule.existsSync(candidate)) {
      return { command: process.execPath, prefixArgs: [candidate], shell: false };
    }
  }

  return {
    command: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    prefixArgs: [],
    shell: process.platform === 'win32',
  };
}

/**
 * Safely extracts a `.tgz` archive into `targetDir` using `spawnSync` with `cwd = projectRoot`
 * and strictly relative POSIX paths (never passing `D:\...` to `tar`).
 */
function extractTgzArchive({
  projectRoot,
  archivePath,
  targetDir,
  spawnSyncFn = spawnSync,
  fsModule = fs,
  pathModule = path,
  platform = process.platform,
}) {
  const relArchivePath = toSafeRelativeTarPath(projectRoot, archivePath, pathModule);
  const relTargetDir = toSafeRelativeTarPath(projectRoot, targetDir, pathModule);

  if (!fsModule.existsSync(archivePath)) {
    throw new Error(`Archive file does not exist before extraction: ${relArchivePath}`);
  }

  fsModule.rmSync(targetDir, { recursive: true, force: true });
  fsModule.mkdirSync(targetDir, { recursive: true });

  const tarBin = resolveTarExecutable(platform, fsModule);
  const args = ['-xzf', relArchivePath, '--strip-components=1', '-C', relTargetDir];

  const result = spawnSyncFn(tarBin, args, {
    cwd: projectRoot,
    encoding: 'utf-8',
    shell: false,
    windowsHide: true,
  });

  if (result.error) {
    throw new Error(`Failed to execute tar (${tarBin}): ${result.error.message}`);
  }
  if (result.status !== 0) {
    const stderr = String(result.stderr || '').trim();
    const stdout = String(result.stdout || '').trim();
    throw new Error(
      `tar extraction failed with exit code ${result.status}${stderr ? `: ${stderr}` : stdout ? `: ${stdout}` : ''}`
    );
  }

  return {
    tarBin,
    args,
    relArchivePath,
    relTargetDir,
  };
}

/**
 * Comprehensive verification of an installed or newly extracted Rolldown native binding:
 * 1. node_modules/<pkgName>/package.json exists.
 * 2. package.json version matches expectedVersion (e.g. 1.2.15).
 * 3. Native .node binary (e.g. rolldown-binding.win32-x64-msvc.node) exists.
 * 4. Native .node binary size > 0 bytes.
 * 5. Package can be actually loaded via requireFn(pkgDir) when running on the matching platform.
 */
function verifyExtractedBinding({
  rootDir,
  pkgName,
  expectedVersion,
  expectedBinaryFile,
  fsModule = fs,
  pathModule = path,
  requireFn = require,
  checkNativeLoad = true,
}) {
  const pkgDir = pathModule.join(rootDir, 'node_modules', ...pkgName.split('/'));
  const pkgJsonPath = pathModule.join(pkgDir, 'package.json');

  if (!fsModule.existsSync(pkgJsonPath)) {
    return {
      ok: false,
      reason: `Missing package.json at ${pkgJsonPath}`,
    };
  }

  let pkgJson;
  try {
    pkgJson = JSON.parse(fsModule.readFileSync(pkgJsonPath, 'utf-8'));
  } catch (err) {
    return {
      ok: false,
      reason: `Invalid JSON in ${pkgJsonPath}: ${err.message}`,
    };
  }

  if (expectedVersion && pkgJson.version !== expectedVersion) {
    return {
      ok: false,
      reason: `Version mismatch in ${pkgJsonPath}: expected ${expectedVersion}, found ${pkgJson.version}`,
    };
  }

  const binaryFileName =
    expectedBinaryFile ||
    (typeof pkgJson.main === 'string' && pkgJson.main.endsWith('.node') ? pkgJson.main : null);

  let binaryPath = binaryFileName ? pathModule.join(pkgDir, binaryFileName) : null;
  if (!binaryPath || !fsModule.existsSync(binaryPath)) {
    const entries = fsModule.existsSync(pkgDir) ? fsModule.readdirSync(pkgDir) : [];
    const foundNode = entries.find((f) => f.endsWith('.node'));
    if (!foundNode || (expectedBinaryFile && foundNode !== expectedBinaryFile)) {
      return {
        ok: false,
        reason: `Missing native binary ${expectedBinaryFile || '*.node'} in ${pkgDir}`,
      };
    }
    binaryPath = pathModule.join(pkgDir, foundNode);
  }

  let stat;
  try {
    stat = fsModule.statSync(binaryPath);
  } catch (err) {
    return {
      ok: false,
      reason: `Cannot stat native binary ${binaryPath}: ${err.message}`,
    };
  }

  if (!stat.isFile() || stat.size <= 0) {
    return {
      ok: false,
      reason: `Native binary ${binaryPath} is empty or not a regular file (size: ${stat ? stat.size : 0})`,
    };
  }

  if (checkNativeLoad) {
    try {
      const loaded = requireFn(pkgDir);
      if (!loaded || (typeof loaded !== 'object' && typeof loaded !== 'function')) {
        return {
          ok: false,
          reason: `Native binding ${pkgName} loaded an empty or invalid export`,
        };
      }
    } catch (err) {
      return {
        ok: false,
        reason: `Failed to load native binding ${pkgName} from Node.js: ${err.message}`,
      };
    }
  }

  return {
    ok: true,
    pkgDir,
    pkgJsonPath,
    version: pkgJson.version,
    binaryPath,
    binarySize: stat.size,
  };
}

function ensureRolldownBinding({
  rootDir = process.cwd(),
  platform = process.platform,
  arch = process.arch,
  spawnSyncFn = spawnSync,
  fsModule = fs,
  pathModule = path,
  requireFn = require,
  checkNativeLoad = platform === process.platform && arch === process.arch,
  logger = console,
} = {}) {
  const spec = getExpectedRolldownBindingSpec(platform, arch);
  const rolldownVersion = getRolldownVersion(rootDir, fsModule);

  logger.log(
    `[Rolldown Verify] Platform: ${platform}-${arch} | Rolldown Version: ${rolldownVersion} | Expected Binding: ${
      spec ? spec.pkgName : 'wasm-fallback'
    }`
  );

  if (!spec) {
    logger.log('[Rolldown Verify] PASS — Non-standard platform, skipping native check.');
    return {
      ok: true,
      skipped: true,
      repaired: false,
      version: rolldownVersion,
      binarySize: 0,
      rolldownVersion,
    };
  }

  const initialCheck = verifyExtractedBinding({
    rootDir,
    pkgName: spec.pkgName,
    expectedVersion: rolldownVersion,
    expectedBinaryFile: spec.binaryFile,
    fsModule,
    pathModule,
    requireFn,
    checkNativeLoad,
  });

  if (initialCheck.ok) {
    logger.log(
      `[Rolldown Verify] PASS — Native binding verified & loadable: ${spec.pkgName}@${initialCheck.version} (${pathModule.basename(
        initialCheck.binaryPath
      )}, ${initialCheck.binarySize} bytes)`
    );
    return { ...initialCheck, repaired: false };
  }

  logger.warn(
    `[Rolldown Verify] WARNING — ${spec.pkgName}@${rolldownVersion} not ready (${initialCheck.reason}). Repairing via npm pack...`
  );

  const targetDir = pathModule.join(rootDir, 'node_modules', ...spec.pkgName.split('/'));
  const tmpDir = pathModule.join(rootDir, '.tmp-rolldown-binding');
  fsModule.rmSync(tmpDir, { recursive: true, force: true });
  fsModule.mkdirSync(tmpDir, { recursive: true });

  try {
    const npmInvoke = resolveNpmCliInvocation(fsModule);
    const packResult = spawnSyncFn(
      npmInvoke.command,
      [...npmInvoke.prefixArgs, 'pack', `${spec.pkgName}@${rolldownVersion}`],
      {
        cwd: tmpDir,
        encoding: 'utf-8',
        shell: npmInvoke.shell,
        windowsHide: true,
      }
    );

    if (packResult.error) {
      throw new Error(`npm pack process error: ${packResult.error.message}`);
    }
    if (packResult.status !== 0) {
      throw new Error(
        `npm pack failed with exit code ${packResult.status}: ${String(packResult.stderr || packResult.stdout || '').trim()}`
      );
    }

    const tgzName = parseNpmPackFilename(packResult.stdout, tmpDir, fsModule);
    const tgzPath = pathModule.join(tmpDir, tgzName);

    extractTgzArchive({
      projectRoot: rootDir,
      archivePath: tgzPath,
      targetDir,
      spawnSyncFn,
      fsModule,
      pathModule,
      platform,
    });
  } finally {
    fsModule.rmSync(tmpDir, { recursive: true, force: true });
  }

  const postRepairCheck = verifyExtractedBinding({
    rootDir,
    pkgName: spec.pkgName,
    expectedVersion: rolldownVersion,
    expectedBinaryFile: spec.binaryFile,
    fsModule,
    pathModule,
    requireFn,
    checkNativeLoad,
  });

  if (!postRepairCheck.ok) {
    throw new Error(
      `[Rolldown Verify] FAIL — Could not verify ${spec.pkgName}@${rolldownVersion} after extraction: ${postRepairCheck.reason}`
    );
  }

  logger.log(
    `[Rolldown Verify] PASS — Successfully restored & loaded ${spec.pkgName}@${postRepairCheck.version} (${pathModule.basename(
      postRepairCheck.binaryPath
    )}, ${postRepairCheck.binarySize} bytes)`
  );

  return { ...postRepairCheck, repaired: true };
}

function main() {
  try {
    ensureRolldownBinding();
  } catch (err) {
    console.error(err && err.message ? err.message : String(err));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  PLATFORM_BINDINGS,
  getExpectedRolldownBindingSpec,
  getExpectedRolldownBindingPackage,
  getRolldownVersion,
  toSafeRelativeTarPath,
  parseNpmPackFilename,
  resolveTarExecutable,
  resolveNpmCliInvocation,
  extractTgzArchive,
  verifyExtractedBinding,
  ensureRolldownBinding,
};
