/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export const hasDatabaseCredentials = (): boolean => {
  return Boolean(
    (process.env.SQL_HOST && (process.env.SQL_USER || process.env.SQL_ADMIN_USER)) ||
    (process.env.PGHOST && process.env.PGUSER) ||
    process.env.DATABASE_URL
  );
};

export const createPool = (): Pool | null => {
  if (!hasDatabaseCredentials()) {
    return null;
  }

  if (!global._postgresPool) {
    if (process.env.SQL_HOST && (process.env.SQL_USER || process.env.SQL_ADMIN_USER)) {
      global._postgresPool = new Pool({
        host: process.env.SQL_HOST,
        port: process.env.SQL_PORT ? Number(process.env.SQL_PORT) : (process.env.PGPORT ? Number(process.env.PGPORT) : 5432),
        user: process.env.SQL_USER || process.env.SQL_ADMIN_USER,
        password: process.env.SQL_PASSWORD || process.env.SQL_ADMIN_PASSWORD,
        database: process.env.SQL_DB_NAME || process.env.PGDATABASE,
        max: 10,
        connectionTimeoutMillis: 15000,
      });
    } else if (process.env.DATABASE_URL) {
      global._postgresPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 10,
        connectionTimeoutMillis: 15000,
      });
    } else if (process.env.PGHOST && process.env.PGUSER) {
      global._postgresPool = new Pool({
        host: process.env.PGHOST,
        port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        max: 10,
        connectionTimeoutMillis: 15000,
      });
    }

    if (global._postgresPool) {
      global._postgresPool.on('error', (err) => {
        console.error('Unexpected error on idle SQL pool client:', err);
      });
    }
  }

  return global._postgresPool || null;
};

const pool = createPool();
export const db = pool ? drizzle(pool, { schema }) : null;
