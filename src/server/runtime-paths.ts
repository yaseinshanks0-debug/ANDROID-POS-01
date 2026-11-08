/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path';

export function getRootDir(): string {
  return process.env.DQNAMO_ROOT_DIR || process.cwd();
}

export function getDataDir(): string {
  return process.env.DQNAMO_DATA_DIR || path.resolve(getRootDir(), '.data');
}

export function getDistDir(): string {
  return process.env.DQNAMO_DIST_DIR || path.resolve(getRootDir(), 'dist');
}
