#!/usr/bin/env node
/**
 * Production Build Size Optimizer
 *
 * Prunes non-runtime bloat from node_modules and transient staging directories
 * so the full project + production build remains well under the 250 MB publishing limit,
 * while preserving 100% of Web, Backend, Android APK, and Windows EXE functionality.
 */

const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const nodeModulesDir = path.join(projectRoot, 'node_modules');

function removePathSafe(targetPath) {
  try {
    if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath, { recursive: true, force: true });
      return true;
    }
  } catch {
    // Ignore permission or missing path errors
  }
  return false;
}

function removeSourceMapsRecursively(dirPath) {
  let removedCount = 0;
  if (!fs.existsSync(dirPath)) return removedCount;

  const stack = [dirPath];
  while (stack.length > 0) {
    const current = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.map')) {
        if (removePathSafe(fullPath)) {
          removedCount++;
        }
      }
    }
  }
  return removedCount;
}

function pruneDirectory() {
  const dirsToRemove = [
    // Transient staging/cache directories
    'electron/www',
    'dist-server',
    'release-exe',
    'node_modules/.vite',
    'node_modules/.cache',

    // Unused web-component/WASM SQLite debug dependencies (offline-sqlite-storage uses IndexedDB on web & native Java on Android)
    'node_modules/sql.js',
    'node_modules/@stencil',
    'node_modules/jeep-sqlite',

    // Unused intermediate/lite/platform build artifacts in @firebase/firestore & @firebase/auth
    'node_modules/@firebase/firestore/dist/intermediate',
    'node_modules/@firebase/firestore/dist/lite',
    'node_modules/@firebase/auth/dist/cordova',
    'node_modules/@firebase/auth/dist/rn',
    'node_modules/@firebase/auth/dist/web-extension-cjs',
    'node_modules/@firebase/auth/dist/web-extension-esm',

    // Unused Firebase services (application only uses firebase/app, firebase/auth, firebase/firestore)
    'node_modules/@firebase/database',
    'node_modules/@firebase/database-compat',
    'node_modules/@firebase/database-types',
    'node_modules/@firebase/ai',
    'node_modules/@firebase/storage',
    'node_modules/@firebase/storage-compat',
    'node_modules/@firebase/storage-types',
    'node_modules/@firebase/data-connect',
    'node_modules/@firebase/messaging',
    'node_modules/@firebase/messaging-compat',
    'node_modules/@firebase/messaging-interop-types',
    'node_modules/@firebase/auth-compat',
    'node_modules/@firebase/firestore-compat',
    'node_modules/@firebase/analytics',
    'node_modules/@firebase/analytics-compat',
    'node_modules/@firebase/analytics-types',
    'node_modules/@firebase/performance',
    'node_modules/@firebase/performance-compat',
    'node_modules/@firebase/ performance-types',
    'node_modules/@firebase/remote-config',
    'node_modules/@firebase/remote-config-compat',
    'node_modules/@firebase/remote-config-types',
    'node_modules/@firebase/app-check',
    'node_modules/@firebase/app-check-compat',
    'node_modules/@firebase/app-check-types',
    'node_modules/@firebase/functions',
    'node_modules/@firebase/functions-compat',
    'node_modules/@firebase/functions-types',
    'node_modules/@firebase/installations',
    'node_modules/@firebase/installations-compat',
    'node_modules/@firebase/installations-types',
    'node_modules/firebase/compat',

    // Unused UMD/CJS/duplicate bundles in icon, chart, and scanner libraries (Vite uses ESM)
    'node_modules/lucide-react/dist/umd',
    'node_modules/lucide-react/dist/cjs',
    'node_modules/lucide-react/dist/lucide-react.suffixed.d.ts',
    'node_modules/lucide-react/dist/lucide-react.prefixed.d.ts',
    'node_modules/@zxing/library/umd',
    'node_modules/@zxing/library/esnext',
    'node_modules/@zxing/library/es2015',
    'node_modules/@zxing/text-encoding/umd',
    'node_modules/@zxing/text-encoding/esm',
    'node_modules/recharts/umd',

    // Unused non-PostgreSQL database drivers inside drizzle-orm
    'node_modules/drizzle-orm/gel-core',
    'node_modules/drizzle-orm/mysql-core',
    'node_modules/drizzle-orm/mysql2',
    'node_modules/drizzle-orm/singlestore-core',
    'node_modules/drizzle-orm/singlestore',
    'node_modules/drizzle-orm/sqlite-core',
    'node_modules/drizzle-orm/sqlite-proxy',
    'node_modules/drizzle-orm/expo-sqlite',
    'node_modules/drizzle-orm/d1',
    'node_modules/drizzle-orm/libsql',
    'node_modules/drizzle-orm/aws-data-api',
    'node_modules/drizzle-orm/neon-http',
    'node_modules/drizzle-orm/neon-serverless',
    'node_modules/drizzle-orm/netlify-db',
    'node_modules/drizzle-orm/planetscale-serverless',
    'node_modules/drizzle-orm/vercel-postgres',
    'node_modules/drizzle-orm/pglite',
    'node_modules/drizzle-orm/prisma',

    // Duplicate nested esbuild & lightningcss copies (resolved via top-level node_modules)
    'node_modules/@esbuild-kit/core-utils/node_modules/esbuild',
    'node_modules/tsx/node_modules/esbuild',
    'node_modules/@tailwindcss/node/node_modules/lightningcss',
    'node_modules/@rollup',
    'node_modules/drizzle-kit/api.mjs',
    'node_modules/jszip',
    'node_modules/localforage',
    'node_modules/web-vitals',
    'node_modules/browser-fs-access',
    'node_modules/pako',
    'node_modules/faye-websocket',
    'node_modules/websocket-driver',
    'node_modules/@firebase/performance-types',
    'node_modules/@firebase/app-check-interop-types',
  ];

  let removedDirs = 0;
  for (const relPath of dirsToRemove) {
    if (removePathSafe(path.join(projectRoot, relPath))) {
      removedDirs++;
    }
  }

  // Remove CDN firebase-*.js bundles at root of node_modules/firebase
  const firebaseRoot = path.join(nodeModulesDir, 'firebase');
  if (fs.existsSync(firebaseRoot)) {
    for (const file of fs.readdirSync(firebaseRoot)) {
      if (file.startsWith('firebase-') && file.endsWith('.js')) {
        removePathSafe(path.join(firebaseRoot, file));
      }
    }
  }

  // Remove React Native bundles in @firebase/firestore/dist
  const firestoreDist = path.join(nodeModulesDir, '@firebase', 'firestore', 'dist');
  if (fs.existsSync(firestoreDist)) {
    for (const file of fs.readdirSync(firestoreDist)) {
      if (file.endsWith('.rn.js')) {
        removePathSafe(path.join(firestoreDist, file));
      }
    }
  }

  const removedMaps = removeSourceMapsRecursively(nodeModulesDir);
  console.log(
    `[optimize-build-size] Pruned ${removedDirs} unused directories/bundles and ${removedMaps} source map files.`
  );
}

if (require.main === module) {
  pruneDirectory();
}

module.exports = { pruneDirectory };
