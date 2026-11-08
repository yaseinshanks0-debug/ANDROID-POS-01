/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from 'express';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { getDataDir } from './runtime-paths.ts';

const LAN_SYNC_FILE = path.resolve(getDataDir(), 'lan-sync-state.json');

export interface ConnectedLanDevice {
  deviceId: string;
  deviceName: string;
  platform: 'android' | 'windows' | 'web';
  companyId: string;
  ipAddress: string;
  connectedAt: string;
  lastSeenAt: string;
  userName?: string;
}

export interface LiveSyncEventLog {
  id: string;
  timestamp: string;
  deviceId: string;
  deviceName: string;
  platform: 'android' | 'windows' | 'web';
  companyId: string;
  operationType: string;
  summaryAr: string;
  summaryEn: string;
  revision: number;
}

export interface CompanyLiveSyncState {
  companyId: string;
  revision: number;
  updatedAt: string;
  lastUpdatedByDeviceId: string;
  lastUpdatedByDeviceName: string;
  deletedProductIds: string[];
  deletedCustomerIds: string[];
  companyProfile?: any;
  products: any[];
  transactions: any[];
  customers: any[];
  stockMovements: any[];
  unmetDemandRequests: any[];
  currencies: any[];
  exchangeRates: Record<string, number>;
  exchangeRateItems: any[];
  exchangeRateHistory: any[];
  branches: any[];
  users: any[];
  activeSessions: any[];
  categories: any[];
  settings?: any;
  snapshot?: {
    companyProfile?: any;
    products?: any[];
    transactions?: any[];
    customers?: any[];
    stockMovements?: any[];
    unmetDemandRequests?: any[];
    currencies?: any[];
    exchangeRates?: Record<string, number>;
    exchangeRateItems?: any[];
    exchangeRateHistory?: any[];
    branches?: any[];
    users?: any[];
    activeSessions?: any[];
    categories?: any[];
    settings?: any;
  };
}

interface PersistedLanSyncStore {
  companies: Record<string, CompanyLiveSyncState>;
  recentEvents: LiveSyncEventLog[];
}

interface SseClientConnection {
  clientId: string;
  deviceId: string;
  deviceName: string;
  platform: 'android' | 'windows' | 'web';
  companyId: string;
  ipAddress: string;
  connectedAt: string;
  lastSeenAt: string;
  userName?: string;
  res: Response;
}

const activeSseClients = new Map<string, SseClientConnection>();
const heartbeatRegistry = new Map<string, ConnectedLanDevice>();

function loadPersistedStore(): PersistedLanSyncStore {
  try {
    if (fs.existsSync(LAN_SYNC_FILE)) {
      const raw = fs.readFileSync(LAN_SYNC_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          companies: parsed.companies || {},
          recentEvents: Array.isArray(parsed.recentEvents) ? parsed.recentEvents : [],
        };
      }
    }
  } catch (err) {
    console.warn('Could not read lan-sync-state.json:', err);
  }
  return { companies: {}, recentEvents: [] };
}

let memoryStore: PersistedLanSyncStore = loadPersistedStore();

function savePersistedStore() {
  try {
    const dir = path.dirname(LAN_SYNC_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LAN_SYNC_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write lan-sync-state.json:', err);
  }
}

export function detectLocalLanAddresses(port: number = 3000): {
  hostname: string;
  port: number;
  addresses: {
    ip: string;
    interfaceName: string;
    url: string;
    isHotspotOrWifiLikely: boolean;
  }[];
  primaryUrl: string;
} {
  const interfaces = os.networkInterfaces();
  const addresses: {
    ip: string;
    interfaceName: string;
    url: string;
    isHotspotOrWifiLikely: boolean;
  }[] = [];

  for (const [ifName, netList] of Object.entries(interfaces)) {
    if (!netList) continue;
    for (const net of netList) {
      const family = String(net.family);
      if ((family === 'IPv4' || family === '4') && !net.internal) {
        const lowerName = ifName.toLowerCase();
        const isVirtual =
          lowerName.includes('docker') ||
          lowerName.includes('veth') ||
          lowerName.includes('vbox') ||
          lowerName.includes('vmware') ||
          lowerName.includes('wsl');
        const isWifiOrHotspot =
          !isVirtual &&
          (lowerName.includes('wi-fi') ||
            lowerName.includes('wifi') ||
            lowerName.includes('wlan') ||
            lowerName.includes('eth') ||
            lowerName.includes('en0') ||
            lowerName.includes('local') ||
            net.address.startsWith('192.168.') ||
            net.address.startsWith('10.') ||
            net.address.startsWith('172.'));

        addresses.push({
          ip: net.address,
          interfaceName: ifName,
          url: `http://${net.address}:${port}`,
          isHotspotOrWifiLikely: isWifiOrHotspot,
        });
      }
    }
  }

  // Sort so 192.168.x.x and Wi-Fi interfaces come first
  addresses.sort((a, b) => {
    const a192 = a.ip.startsWith('192.168.') ? 1 : 0;
    const b192 = b.ip.startsWith('192.168.') ? 1 : 0;
    if (a192 !== b192) return b192 - a192;
    if (a.isHotspotOrWifiLikely !== b.isHotspotOrWifiLikely) {
      return a.isHotspotOrWifiLikely ? -1 : 1;
    }
    return a.ip.localeCompare(b.ip);
  });

  const primaryUrl =
    addresses[0]?.url || `http://192.168.1.100:${port}`;

  return {
    hostname: os.hostname(),
    port,
    addresses,
    primaryUrl,
  };
}

function getRecordTimestampMs(item: Record<string, any> | undefined): number {
  if (!item || typeof item !== 'object') return 0;
  const raw = item.updatedAt || item.fulfilledAt || item.priceUpdatedAt || item.timestamp || item.createdAt;
  if (!raw) return 0;
  const parsed = Date.parse(String(raw));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function mergeRecordsById<T extends Record<string, any>>(
  existingList: T[] = [],
  incomingList: T[] = [],
  keyField: string = 'id',
  deletedIdsSet?: Set<string>
): T[] {
  const map = new Map<string, T>();
  for (const item of existingList) {
    const id = String(item?.[keyField] || '');
    if (id && (!deletedIdsSet || !deletedIdsSet.has(id))) {
      map.set(id, item);
    }
  }
  for (const item of incomingList) {
    const id = String(item?.[keyField] || '');
    if (id && (!deletedIdsSet || !deletedIdsSet.has(id))) {
      const prev = map.get(id);
      if (!prev) {
        map.set(id, item);
      } else {
        const prevTs = getRecordTimestampMs(prev);
        const incTs = getRecordTimestampMs(item);
        if (prevTs > 0 && incTs > 0 && incTs < prevTs) {
          // Existing record is newer than incoming stale record
          map.set(id, { ...item, ...prev });
        } else {
          map.set(id, { ...prev, ...item });
        }
      }
    }
  }
  return Array.from(map.values());
}

export function mergeCompanyLiveSnapshot(
  current: CompanyLiveSyncState | undefined,
  incomingRaw: Record<string, any>,
  deviceMeta?: {
    deviceId?: string;
    deviceName?: string;
    companyId?: string;
  }
): CompanyLiveSyncState {
  const nowIso = new Date().toISOString();
  const nextRevision = (current?.revision || 0) + 1;

  const incSnap =
    incomingRaw?.snapshot && typeof incomingRaw.snapshot === 'object'
      ? incomingRaw.snapshot
      : incomingRaw || {};

  const prevSnap =
    current?.snapshot && typeof current.snapshot === 'object'
      ? { ...current, ...current.snapshot }
      : current || ({} as Partial<CompanyLiveSyncState>);

  const incomingDeletedProdIds: string[] = Array.isArray(incomingRaw?.deletedProductIds)
    ? incomingRaw.deletedProductIds
    : Array.isArray(incSnap?.deletedProductIds)
    ? incSnap.deletedProductIds
    : [];

  const incomingDeletedCustIds: string[] = Array.isArray(incomingRaw?.deletedCustomerIds)
    ? incomingRaw.deletedCustomerIds
    : Array.isArray(incSnap?.deletedCustomerIds)
    ? incSnap.deletedCustomerIds
    : [];

  const deletedProductIds = Array.from(
    new Set([...(current?.deletedProductIds || []), ...incomingDeletedProdIds])
  ).slice(-500);

  const deletedCustomerIds = Array.from(
    new Set([...(current?.deletedCustomerIds || []), ...incomingDeletedCustIds])
  ).slice(-500);

  const deletedProdSet = new Set(deletedProductIds);
  const deletedCustSet = new Set(deletedCustomerIds);

  if (Array.isArray(incSnap.products)) {
    for (const p of incSnap.products) {
      if (p?.id && deletedProdSet.has(p.id) && !incomingDeletedProdIds.includes(p.id)) {
        deletedProdSet.delete(p.id);
      }
    }
  }

  const mergedProducts = Array.isArray(incSnap.products)
    ? incomingRaw?.replaceProductsCatalog
      ? incSnap.products.filter((p: any) => p?.id && !deletedProdSet.has(p.id))
      : mergeRecordsById(prevSnap.products || [], incSnap.products, 'id', deletedProdSet)
    : (prevSnap.products || []).filter((p: any) => p?.id && !deletedProdSet.has(p.id));

  const rawMergedTransactions = Array.isArray(incSnap.transactions)
    ? mergeRecordsById(prevSnap.transactions || [], incSnap.transactions, 'id')
    : prevSnap.transactions || [];

  // Ensure voided status or higher debt settlement payments are never regressed by an older snapshot
  const prevTxMap = new Map<string, any>();
  for (const t of prevSnap.transactions || []) {
    if (t?.id) prevTxMap.set(t.id, t);
  }
  const mergedTransactions = rawMergedTransactions.map((tx: any) => {
    const oldTx = prevTxMap.get(tx.id);
    if (!oldTx) return { ...tx, syncStatus: 'synced' };
    const isVoided = oldTx.status === 'voided' || tx.status === 'voided';
    const oldPaid = Number(oldTx.amountPaid || 0);
    const newPaid = Number(tx.amountPaid || 0);
    const bestTx = newPaid >= oldPaid ? { ...oldTx, ...tx } : { ...tx, ...oldTx };
    return {
      ...bestTx,
      status: isVoided ? 'voided' : bestTx.status,
      syncStatus: 'synced',
    };
  });

  mergedTransactions.sort(
    (a, b) =>
      new Date(b.timestamp || b.createdAt || 0).getTime() -
      new Date(a.timestamp || a.createdAt || 0).getTime()
  );

  const mergedCustomers = Array.isArray(incSnap.customers)
    ? mergeRecordsById(prevSnap.customers || [], incSnap.customers, 'id', deletedCustSet)
    : (prevSnap.customers || []).filter((c: any) => c?.id && !deletedCustSet.has(c.id));

  const mergedMovements = Array.isArray(incSnap.stockMovements)
    ? mergeRecordsById(prevSnap.stockMovements || [], incSnap.stockMovements, 'id')
    : prevSnap.stockMovements || [];

  mergedMovements.sort(
    (a, b) =>
      new Date(b.timestamp || b.date || 0).getTime() -
      new Date(a.timestamp || a.date || 0).getTime()
  );

  const mergedDemand = Array.isArray(incSnap.unmetDemandRequests)
    ? mergeRecordsById(prevSnap.unmetDemandRequests || [], incSnap.unmetDemandRequests, 'id')
    : prevSnap.unmetDemandRequests || [];

  const mergedCurrencies = Array.isArray(incSnap.currencies)
    ? mergeRecordsById(prevSnap.currencies || [], incSnap.currencies, 'code')
    : prevSnap.currencies || [];

  const mergedExchangeRates = {
    ...(prevSnap.exchangeRates || {}),
    ...(incSnap.exchangeRates || {}),
  };

  const mergedExchangeRateItems = Array.isArray(incSnap.exchangeRateItems)
    ? mergeRecordsById(prevSnap.exchangeRateItems || [], incSnap.exchangeRateItems, 'id')
    : prevSnap.exchangeRateItems || [];

  const mergedExchangeRateHistory = Array.isArray(incSnap.exchangeRateHistory)
    ? mergeRecordsById(prevSnap.exchangeRateHistory || [], incSnap.exchangeRateHistory, 'id')
    : prevSnap.exchangeRateHistory || [];

  const mergedBranches = Array.isArray(incSnap.branches)
    ? mergeRecordsById(prevSnap.branches || [], incSnap.branches, 'id')
    : prevSnap.branches || [];

  const mergedUsers = Array.isArray(incSnap.users)
    ? mergeRecordsById(prevSnap.users || [], incSnap.users, 'id')
    : prevSnap.users || [];

  const mergedSessions = Array.isArray(incSnap.activeSessions)
    ? mergeRecordsById(prevSnap.activeSessions || [], incSnap.activeSessions, 'sessionId')
    : prevSnap.activeSessions || [];

  const mergedCategories = Array.isArray(incSnap.categories)
    ? mergeRecordsById(prevSnap.categories || [], incSnap.categories, 'name')
    : prevSnap.categories || [];

  const mergedSettings = incSnap.settings
    ? { ...(prevSnap.settings || {}), ...incSnap.settings }
    : prevSnap.settings;

  const resolvedCompanyId =
    deviceMeta?.companyId || incomingRaw?.companyId || current?.companyId || 'comp-clean-store';
  const resolvedDeviceId =
    deviceMeta?.deviceId || incomingRaw?.deviceId || current?.lastUpdatedByDeviceId || 'dev-peer';
  const resolvedDeviceName =
    deviceMeta?.deviceName || incomingRaw?.deviceName || current?.lastUpdatedByDeviceName || 'POS Device';

  const coreSnapshot = {
    companyProfile: incSnap.companyProfile || prevSnap.companyProfile,
    products: mergedProducts,
    transactions: mergedTransactions,
    customers: mergedCustomers,
    stockMovements: mergedMovements,
    unmetDemandRequests: mergedDemand,
    currencies: mergedCurrencies,
    exchangeRates: mergedExchangeRates,
    exchangeRateItems: mergedExchangeRateItems,
    exchangeRateHistory: mergedExchangeRateHistory,
    branches: mergedBranches,
    users: mergedUsers,
    activeSessions: mergedSessions,
    categories: mergedCategories,
    settings: mergedSettings,
  };

  return {
    companyId: resolvedCompanyId,
    revision: nextRevision,
    updatedAt: nowIso,
    lastUpdatedByDeviceId: resolvedDeviceId,
    lastUpdatedByDeviceName: resolvedDeviceName,
    deletedProductIds: Array.from(deletedProdSet),
    deletedCustomerIds: Array.from(deletedCustSet),
    ...coreSnapshot,
    snapshot: coreSnapshot,
  };
}

function getConnectedDevicesList(companyId?: string): ConnectedLanDevice[] {
  const now = Date.now();
  const deviceMap = new Map<string, ConnectedLanDevice>();

  // 1. Active SSE streams
  for (const client of activeSseClients.values()) {
    if (!companyId || !client.companyId || client.companyId === companyId) {
      deviceMap.set(client.deviceId, {
        deviceId: client.deviceId,
        deviceName: client.deviceName,
        platform: client.platform,
        companyId: client.companyId,
        ipAddress: client.ipAddress,
        connectedAt: client.connectedAt,
        lastSeenAt: client.lastSeenAt,
        userName: client.userName,
      });
    }
  }

  // 2. Recent HTTP heartbeat/push clients (within last 45 seconds)
  for (const [devId, dev] of heartbeatRegistry.entries()) {
    if (now - new Date(dev.lastSeenAt).getTime() > 45000) {
      heartbeatRegistry.delete(devId);
      continue;
    }
    if (!companyId || !dev.companyId || dev.companyId === companyId) {
      if (!deviceMap.has(devId)) {
        deviceMap.set(devId, dev);
      }
    }
  }

  return Array.from(deviceMap.values());
}

function broadcastSseEvent(eventType: string, payload: any, targetCompanyId?: string) {
  const enrichedPayload = { type: eventType, ...payload };
  const serialized = `data: ${JSON.stringify(enrichedPayload)}\n\n`;
  for (const [clientId, client] of activeSseClients.entries()) {
    if (
      targetCompanyId &&
      client.companyId &&
      client.companyId !== targetCompanyId
    ) {
      continue;
    }
    try {
      client.res.write(serialized);
    } catch {
      activeSseClients.delete(clientId);
    }
  }
}

export const lanSyncRouter = Router();

// 1. GET /api/lan-sync/info — Returns local Wi-Fi IPs, hostname, connected devices, and recent events
lanSyncRouter.get('/info', (req: Request, res: Response) => {
  const port = parseInt(process.env.PORT || '3000', 10);
  const companyId = String(req.query.companyId || req.headers['x-company-id'] || '').trim();
  const deviceId = String(req.query.deviceId || req.headers['x-device-id'] || '').trim();
  const deviceName = String(req.query.deviceName || '').trim();
  const platform = (req.query.platform as any) || 'web';

  if (deviceId) {
    const nowIso = new Date().toISOString();
    const existing = heartbeatRegistry.get(deviceId);
    heartbeatRegistry.set(deviceId, {
      deviceId,
      deviceName: deviceName || existing?.deviceName || 'POS Terminal',
      platform,
      companyId: companyId || existing?.companyId || 'comp-clean-store',
      ipAddress: String(req.ip || req.socket.remoteAddress || '').replace('::ffff:', ''),
      connectedAt: existing?.connectedAt || nowIso,
      lastSeenAt: nowIso,
    });
  }

  const netInfo = detectLocalLanAddresses(port);
  const companyState = companyId ? memoryStore.companies[companyId] : undefined;

  res.json({
    ok: true,
    serverTime: new Date().toISOString(),
    ...netInfo,
    revision: companyState?.revision || 0,
    connectedDevices: getConnectedDevicesList(companyId || undefined),
    recentEvents: memoryStore.recentEvents
      .filter((e) => !companyId || e.companyId === companyId)
      .slice(0, 20),
  });
});

// 2. GET /api/lan-sync/stream — Real-Time Server-Sent Events (SSE) stream for instant bidirectional updates
lanSyncRouter.get('/stream', (req: Request, res: Response) => {
  const companyId = String(req.query.companyId || 'comp-clean-store').trim();
  const deviceId = String(req.query.deviceId || `dev-${Date.now().toString(36)}`).trim();
  const deviceName = String(req.query.deviceName || 'POS Device').trim();
  const platform = (String(req.query.platform || 'web') as 'android' | 'windows' | 'web');
  const userName = String(req.query.userName || '').trim() || undefined;
  const ipAddress = String(req.ip || req.socket.remoteAddress || '').replace('::ffff:', '');
  const nowIso = new Date().toISOString();

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders?.();

  const clientId = `${deviceId}-${Date.now().toString(36)}`;
  const connection: SseClientConnection = {
    clientId,
    deviceId,
    deviceName,
    platform,
    companyId,
    ipAddress,
    connectedAt: nowIso,
    lastSeenAt: nowIso,
    userName,
    res,
  };

  activeSseClients.set(clientId, connection);
  heartbeatRegistry.set(deviceId, {
    deviceId,
    deviceName,
    platform,
    companyId,
    ipAddress,
    connectedAt: nowIso,
    lastSeenAt: nowIso,
    userName,
  });

  // Send immediate init payload with current authoritative company state + connected devices
  const currentCompanyState = memoryStore.companies[companyId] || null;
  const initPayload = {
    type: 'init',
    companyId,
    revision: currentCompanyState?.revision || 0,
    state: currentCompanyState,
    connectedDevices: getConnectedDevicesList(companyId),
    recentEvents: memoryStore.recentEvents
      .filter((e) => e.companyId === companyId)
      .slice(0, 20),
  };
  res.write(`data: ${JSON.stringify(initPayload)}\n\n`);

  // Notify all peers of updated presence
  broadcastSseEvent(
    'presence',
    {
      companyId,
      connectedDevices: getConnectedDevicesList(companyId),
    },
    companyId
  );

  // Keep-alive ping every 15 seconds so Wi-Fi routers never drop the connection
  const keepAliveTimer = setInterval(() => {
    try {
      connection.lastSeenAt = new Date().toISOString();
      res.write(`event: ping\ndata: {"ts":"${connection.lastSeenAt}"}\n\n`);
    } catch {
      clearInterval(keepAliveTimer);
      activeSseClients.delete(clientId);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(keepAliveTimer);
    activeSseClients.delete(clientId);
    broadcastSseEvent(
      'presence',
      {
        companyId,
        connectedDevices: getConnectedDevicesList(companyId),
      },
      companyId
    );
  });
});

// 3. GET /api/lan-sync/state — Pull full company state on reconnect or polling fallback
lanSyncRouter.get('/state', (req: Request, res: Response) => {
  const companyId = String(
    req.query.companyId || req.headers['x-company-id'] || 'comp-clean-store'
  ).trim();
  const sinceRevision = Number(req.query.sinceRevision || 0);
  const deviceId = String(req.query.deviceId || req.headers['x-device-id'] || '').trim();
  const deviceName = String(req.query.deviceName || '').trim();
  const platform = (String(req.query.platform || 'web') as 'android' | 'windows' | 'web');

  if (deviceId) {
    const nowIso = new Date().toISOString();
    const prev = heartbeatRegistry.get(deviceId);
    heartbeatRegistry.set(deviceId, {
      deviceId,
      deviceName: deviceName || prev?.deviceName || 'POS Device',
      platform,
      companyId,
      ipAddress: String(req.ip || req.socket.remoteAddress || '').replace('::ffff:', ''),
      connectedAt: prev?.connectedAt || nowIso,
      lastSeenAt: nowIso,
    });
  }

  const companyState = memoryStore.companies[companyId] || null;
  const hasNewerRevision = Boolean(companyState && companyState.revision > sinceRevision);

  res.json({
    ok: true,
    companyId,
    revision: companyState?.revision || 0,
    hasNewerRevision,
    hasUpdates: hasNewerRevision,
    state: hasNewerRevision ? companyState : null,
    connectedDevices: getConnectedDevicesList(companyId),
    recentEvents: memoryStore.recentEvents
      .filter((e) => e.companyId === companyId)
      .slice(0, 20),
  });
});

// 4. POST /api/lan-sync/push — Push live state changes from Windows or Android and broadcast to all peers immediately
lanSyncRouter.post('/push', (req: Request, res: Response) => {
  try {
    const {
      companyId: rawCompanyId,
      deviceId: rawDeviceId,
      deviceName: rawDeviceName,
      platform: rawPlatform,
      userName,
      operationType = 'STATE_SYNC',
      summaryAr = 'تحديث فوري للبيانات',
      summaryEn = 'Live data update',
      replaceProductsCatalog = false,
      deletedProductIds = [],
      deletedCustomerIds = [],
      snapshot,
    } = req.body || {};

    const companyId = String(
      rawCompanyId || req.headers['x-company-id'] || 'comp-clean-store'
    ).trim();
    const deviceId = String(
      rawDeviceId || req.headers['x-device-id'] || `dev-${Date.now().toString(36)}`
    ).trim();
    const deviceName = String(rawDeviceName || 'POS Device').trim();
    const platform = (rawPlatform || 'web') as 'android' | 'windows' | 'web';
    const ipAddress = String(req.ip || req.socket.remoteAddress || '').replace('::ffff:', '');
    const nowIso = new Date().toISOString();

    if (!snapshot || typeof snapshot !== 'object') {
      return res.status(400).json({ ok: false, error: 'Missing snapshot payload' });
    }

    const prevDevice = heartbeatRegistry.get(deviceId);
    heartbeatRegistry.set(deviceId, {
      deviceId,
      deviceName,
      platform,
      companyId,
      ipAddress,
      connectedAt: prevDevice?.connectedAt || nowIso,
      lastSeenAt: nowIso,
      userName,
    });

    const mergedState = mergeCompanyLiveSnapshot(memoryStore.companies[companyId], {
      companyId,
      deviceId,
      deviceName,
      replaceProductsCatalog,
      deletedProductIds,
      deletedCustomerIds,
      snapshot,
    });

    memoryStore.companies[companyId] = mergedState;

    const eventEntry: LiveSyncEventLog = {
      id: `evt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: nowIso,
      deviceId,
      deviceName,
      platform,
      companyId,
      operationType,
      summaryAr,
      summaryEn,
      revision: mergedState.revision,
    };

    memoryStore.recentEvents = [
      eventEntry,
      ...memoryStore.recentEvents.filter((e) => e.id !== eventEntry.id),
    ].slice(0, 40);

    savePersistedStore();

    const connectedDevices = getConnectedDevicesList(companyId);

    // Broadcast immediately to all connected SSE clients (Windows & Android)
    broadcastSseEvent(
      'sync_update',
      {
        companyId,
        revision: mergedState.revision,
        sourceDeviceId: deviceId,
        sourceDeviceName: deviceName,
        sourcePlatform: platform,
        event: eventEntry,
        state: mergedState,
        connectedDevices,
      },
      companyId
    );

    res.json({
      ok: true,
      companyId,
      revision: mergedState.revision,
      state: mergedState,
      event: eventEntry,
      connectedDevices,
    });
  } catch (err: any) {
    res.status(500).json({
      ok: false,
      error: err?.message || 'Failed to process live LAN sync push',
    });
  }
});
