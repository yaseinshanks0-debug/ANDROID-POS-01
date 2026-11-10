/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import {
  AnalyticsOverviewResponse,
  IntelligenceLifecycleEventRecord,
  IntelligenceLifecycleEventType,
  IntelligenceLifecycleItemRecord,
  IntelligenceLifecycleStatus,
  IntelligenceLifecycleStream,
  IntelligenceLifecycleSummaryCounts,
  SmartInsightConfidenceLevel,
} from './analytics.types';
import {
  applyLifecycleTransition,
  canUserAccessLifecycleItem,
  extractCandidatesFromOverview,
  IntelligenceLifecycleCandidate,
  isFinancialLifecycleItem,
  LifecycleActionError,
  LifecycleTransitionInput,
  queryLifecycleItems,
  reconcileIntelligenceLifecycleState,
  toLegacyAlertStatus,
} from './intelligence.lifecycle.domain';

export {
  applyLifecycleTransition,
  canUserAccessLifecycleItem,
  extractCandidatesFromOverview,
  isFinancialLifecycleItem,
  LifecycleActionError,
  queryLifecycleItems,
  reconcileIntelligenceLifecycleState,
  toLegacyAlertStatus,
};
export type { IntelligenceLifecycleCandidate, LifecycleTransitionInput };


import { getDataDir } from '../server/runtime-paths.ts';

// ============================================================================
// SERVER-SIDE PERSISTENCE (PostgreSQL + .data/store-state.json mirror)
// ============================================================================

function getStoreStateFilePath(): string {
  return path.join(getDataDir(), 'store-state.json');
}

function readLocalLifecycleState(): {
  items: IntelligenceLifecycleItemRecord[];
  events: IntelligenceLifecycleEventRecord[];
} {
  try {
    const file = getStoreStateFilePath();
    if (fs.existsSync(file)) {
      const parsed = JSON.parse(fs.readFileSync(file, 'utf-8')) || {};
      return {
        items: Array.isArray(parsed.intelligenceLifecycleItems)
          ? parsed.intelligenceLifecycleItems
          : [],
        events: Array.isArray(parsed.intelligenceLifecycleEvents)
          ? parsed.intelligenceLifecycleEvents
          : [],
      };
    }
  } catch {
    // Ignore read error
  }
  return { items: [], events: [] };
}

function writeLocalLifecycleState(
  items: IntelligenceLifecycleItemRecord[],
  events: IntelligenceLifecycleEventRecord[]
): void {
  try {
    const dataDir = getDataDir();
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const file = getStoreStateFilePath();
    let current: any = {};
    if (fs.existsSync(file)) {
      try {
        current = JSON.parse(fs.readFileSync(file, 'utf-8')) || {};
      } catch {
        current = {};
      }
    }
    current.intelligenceLifecycleItems = items;
    current.intelligenceLifecycleEvents = events.slice(0, 1000);
    fs.writeFileSync(file, JSON.stringify(current, null, 2), 'utf-8');
  } catch {
    // Non-blocking
  }
}

function mapDbRowToLifecycleItem(row: any): IntelligenceLifecycleItemRecord {
  const toIso = (d: any): string | null => {
    if (!d) return null;
    return d instanceof Date ? d.toISOString() : String(d);
  };
  return {
    id: row.id,
    dedupeKey: row.dedupeKey,
    itemStream: (row.itemStream as IntelligenceLifecycleStream) || 'smart_alert',
    category: row.category,
    severity: (row.severity as any) || 'MEDIUM',
    priority: Number(row.priority ?? 50),
    confidenceLevel: (row.confidenceLevel as SmartInsightConfidenceLevel) || 'HIGH',
    scopeType: row.scopeType === 'GLOBAL' ? 'GLOBAL' : 'BRANCH',
    branchId: row.branchId || null,
    productId: row.productId || null,
    titleEn: row.titleEn,
    titleAr: row.titleAr,
    summaryEn: row.summaryEn,
    summaryAr: row.summaryAr,
    explanationEn: row.explanationEn,
    explanationAr: row.explanationAr,
    recommendationEn: row.recommendationEn,
    recommendationAr: row.recommendationAr,
    evidenceJson:
      row.evidenceJson && typeof row.evidenceJson === 'object' ? row.evidenceJson : {},
    status: (row.status as IntelligenceLifecycleStatus) || 'ACTIVE',
    conditionHash: row.conditionHash || '',
    firstDetectedAt: toIso(row.firstDetectedAt) || new Date().toISOString(),
    lastEvaluatedAt: toIso(row.lastEvaluatedAt) || new Date().toISOString(),
    acknowledgedAt: toIso(row.acknowledgedAt),
    acknowledgedByUserId: row.acknowledgedByUserId || null,
    acknowledgedByName: row.acknowledgedByName || null,
    acknowledgedByRole: row.acknowledgedByRole || null,
    acknowledgmentNote: row.acknowledgmentNote || null,
    resolvedAt: toIso(row.resolvedAt),
    resolvedByUserId: row.resolvedByUserId || null,
    resolvedByName: row.resolvedByName || null,
    resolvedByRole: row.resolvedByRole || null,
    resolutionNote: row.resolutionNote || null,
    resolutionActionType: row.resolutionActionType || null,
    dismissedAt: toIso(row.dismissedAt),
    dismissedByUserId: row.dismissedByUserId || null,
    dismissedByName: row.dismissedByName || null,
    dismissedByRole: row.dismissedByRole || null,
    dismissReason: row.dismissReason || null,
    reopenedCount: Number(row.reopenedCount || 0),
    lastReopenedAt: toIso(row.lastReopenedAt),
    lastReopenedByUserId: row.lastReopenedByUserId || null,
    lastReopenedByName: row.lastReopenedByName || null,
    updatedAt: toIso(row.updatedAt) || new Date().toISOString(),
  };
}

function mapDbRowToLifecycleEvent(row: any): IntelligenceLifecycleEventRecord {
  return {
    id: row.id,
    lifecycleItemId: row.lifecycleItemId,
    dedupeKey: row.dedupeKey,
    eventType: (row.eventType as IntelligenceLifecycleEventType) || 'CREATED',
    fromStatus: (row.fromStatus as IntelligenceLifecycleStatus) || null,
    toStatus: (row.toStatus as IntelligenceLifecycleStatus) || 'ACTIVE',
    performedByUserId: row.performedByUserId || null,
    performedByName: row.performedByName || 'System',
    performedByRole: row.performedByRole || 'system',
    note: row.note || null,
    actionType: row.actionType || null,
    metadataJson:
      row.metadataJson && typeof row.metadataJson === 'object' ? row.metadataJson : {},
    createdAt:
      row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
  };
}

export async function loadPersistedLifecycleState(): Promise<{
  items: IntelligenceLifecycleItemRecord[];
  events: IntelligenceLifecycleEventRecord[];
}> {
  const local = readLocalLifecycleState();
  const pgItems: IntelligenceLifecycleItemRecord[] = [];
  const pgEvents: IntelligenceLifecycleEventRecord[] = [];

  try {
    const { db } = await import('../db/index');
    if (db) {
      const schema = await import('../db/schema');
      const { desc } = await import('drizzle-orm');
      const [dbItems, dbEvents] = await Promise.all([
        db
          .select()
          .from(schema.intelligenceLifecycleItems)
          .orderBy(desc(schema.intelligenceLifecycleItems.updatedAt))
          .catch(() => []),
        db
          .select()
          .from(schema.intelligenceLifecycleEvents)
          .orderBy(desc(schema.intelligenceLifecycleEvents.createdAt))
          .limit(500)
          .catch(() => []),
      ]);

      for (const r of dbItems) {
        pgItems.push(mapDbRowToLifecycleItem(r));
      }
      for (const e of dbEvents) {
        pgEvents.push(mapDbRowToLifecycleEvent(e));
      }
    }
  } catch {
    // Fallback to local state
  }

  // Merge by dedupeKey preferring whichever record has the latest `updatedAt`
  const mergedItemsMap = new Map<string, IntelligenceLifecycleItemRecord>();
  for (const item of [...local.items, ...pgItems]) {
    const existing = mergedItemsMap.get(item.dedupeKey);
    if (
      !existing ||
      new Date(item.updatedAt).getTime() >= new Date(existing.updatedAt).getTime()
    ) {
      mergedItemsMap.set(item.dedupeKey, item);
    }
  }

  const mergedEventsMap = new Map<string, IntelligenceLifecycleEventRecord>();
  for (const evt of [...local.events, ...pgEvents]) {
    if (!mergedEventsMap.has(evt.id)) {
      mergedEventsMap.set(evt.id, evt);
    }
  }

  const sortedEvents = Array.from(mergedEventsMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    items: Array.from(mergedItemsMap.values()),
    events: sortedEvents,
  };
}

async function persistUpsertedLifecycleRecords(params: {
  allItems: IntelligenceLifecycleItemRecord[];
  allEvents: IntelligenceLifecycleEventRecord[];
  upsertedItems: IntelligenceLifecycleItemRecord[];
  newEvents: IntelligenceLifecycleEventRecord[];
}): Promise<void> {
  writeLocalLifecycleState(params.allItems, params.allEvents);

  if (params.upsertedItems.length === 0 && params.newEvents.length === 0) {
    return;
  }

  try {
    const { db } = await import('../db/index');
    if (db) {
      const schema = await import('../db/schema');
      for (const item of params.upsertedItems) {
        await db
          .insert(schema.intelligenceLifecycleItems)
          .values({
            id: item.id,
            dedupeKey: item.dedupeKey,
            itemStream: item.itemStream,
            category: item.category,
            severity: item.severity,
            priority: item.priority,
            confidenceLevel: item.confidenceLevel,
            scopeType: item.scopeType,
            branchId: null, // Null in PG column if branchId is virtual ('br-main') to avoid FK rejection; actual branchId is preserved in evidenceJson.extra.branchId
            productId: null,
            titleEn: item.titleEn,
            titleAr: item.titleAr,
            summaryEn: item.summaryEn,
            summaryAr: item.summaryAr,
            explanationEn: item.explanationEn,
            explanationAr: item.explanationAr,
            recommendationEn: item.recommendationEn,
            recommendationAr: item.recommendationAr,
            evidenceJson: {
              ...item.evidenceJson,
              extra: {
                ...(item.evidenceJson?.extra || {}),
                branchId: item.branchId,
                productId: item.productId,
              },
            },
            status: item.status,
            conditionHash: item.conditionHash,
            firstDetectedAt: new Date(item.firstDetectedAt),
            lastEvaluatedAt: new Date(item.lastEvaluatedAt),
            acknowledgedAt: item.acknowledgedAt ? new Date(item.acknowledgedAt) : null,
            acknowledgedByUserId: item.acknowledgedByUserId,
            acknowledgedByName: item.acknowledgedByName,
            acknowledgedByRole: item.acknowledgedByRole,
            acknowledgmentNote: item.acknowledgmentNote,
            resolvedAt: item.resolvedAt ? new Date(item.resolvedAt) : null,
            resolvedByUserId: item.resolvedByUserId,
            resolvedByName: item.resolvedByName,
            resolvedByRole: item.resolvedByRole,
            resolutionNote: item.resolutionNote,
            resolutionActionType: item.resolutionActionType,
            dismissedAt: item.dismissedAt ? new Date(item.dismissedAt) : null,
            dismissedByUserId: item.dismissedByUserId,
            dismissedByName: item.dismissedByName,
            dismissedByRole: item.dismissedByRole,
            dismissReason: item.dismissReason,
            reopenedCount: item.reopenedCount,
            lastReopenedAt: item.lastReopenedAt ? new Date(item.lastReopenedAt) : null,
            lastReopenedByUserId: item.lastReopenedByUserId,
            lastReopenedByName: item.lastReopenedByName,
            updatedAt: new Date(item.updatedAt),
          })
          .onConflictDoUpdate({
            target: schema.intelligenceLifecycleItems.dedupeKey,
            set: {
              severity: item.severity,
              priority: item.priority,
              confidenceLevel: item.confidenceLevel,
              titleEn: item.titleEn,
              titleAr: item.titleAr,
              summaryEn: item.summaryEn,
              summaryAr: item.summaryAr,
              explanationEn: item.explanationEn,
              explanationAr: item.explanationAr,
              recommendationEn: item.recommendationEn,
              recommendationAr: item.recommendationAr,
              evidenceJson: {
                ...item.evidenceJson,
                extra: {
                  ...(item.evidenceJson?.extra || {}),
                  branchId: item.branchId,
                  productId: item.productId,
                },
              },
              status: item.status,
              conditionHash: item.conditionHash,
              lastEvaluatedAt: new Date(item.lastEvaluatedAt),
              acknowledgedAt: item.acknowledgedAt ? new Date(item.acknowledgedAt) : null,
              acknowledgedByUserId: item.acknowledgedByUserId,
              acknowledgedByName: item.acknowledgedByName,
              acknowledgedByRole: item.acknowledgedByRole,
              acknowledgmentNote: item.acknowledgmentNote,
              resolvedAt: item.resolvedAt ? new Date(item.resolvedAt) : null,
              resolvedByUserId: item.resolvedByUserId,
              resolvedByName: item.resolvedByName,
              resolvedByRole: item.resolvedByRole,
              resolutionNote: item.resolutionNote,
              resolutionActionType: item.resolutionActionType,
              dismissedAt: item.dismissedAt ? new Date(item.dismissedAt) : null,
              dismissedByUserId: item.dismissedByUserId,
              dismissedByName: item.dismissedByName,
              dismissedByRole: item.dismissedByRole,
              dismissReason: item.dismissReason,
              reopenedCount: item.reopenedCount,
              lastReopenedAt: item.lastReopenedAt ? new Date(item.lastReopenedAt) : null,
              lastReopenedByUserId: item.lastReopenedByUserId,
              lastReopenedByName: item.lastReopenedByName,
              updatedAt: new Date(item.updatedAt),
            },
          })
          .catch(() => {});
      }

      for (const evt of params.newEvents) {
        await db
          .insert(schema.intelligenceLifecycleEvents)
          .values({
            id: evt.id,
            lifecycleItemId: evt.lifecycleItemId,
            dedupeKey: evt.dedupeKey,
            eventType: evt.eventType,
            fromStatus: evt.fromStatus,
            toStatus: evt.toStatus,
            performedByUserId: evt.performedByUserId,
            performedByName: evt.performedByName,
            performedByRole: evt.performedByRole,
            note: evt.note,
            actionType: evt.actionType,
            metadataJson: evt.metadataJson,
            createdAt: new Date(evt.createdAt),
          })
          .catch(() => {});
      }
    }
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Synchronizes an evaluated `AnalyticsOverviewResponse` with the persistent Intelligence Lifecycle store,
 * updating `overview.intelligence.smartAlerts`, `overview.insights`, `overview.lifecycleItems`,
 * and `overview.lifecycleSummary` in place.
 */
export async function syncOverviewWithLifecycleStore(
  overview: AnalyticsOverviewResponse
): Promise<{
  items: IntelligenceLifecycleItemRecord[];
  events: IntelligenceLifecycleEventRecord[];
}> {
  const persisted = await loadPersistedLifecycleState();
  // Restore virtual branchId/productId from evidenceJson.extra if PG stored null FK
  for (const it of persisted.items) {
    if (!it.branchId && it.evidenceJson?.extra?.branchId) {
      it.branchId = it.evidenceJson.extra.branchId;
    }
    if (!it.productId && it.evidenceJson?.extra?.productId) {
      it.productId = it.evidenceJson.extra.productId;
    }
  }

  const candidates = extractCandidatesFromOverview(overview);
  const reconciled = reconcileIntelligenceLifecycleState({
    candidates,
    existingItems: persisted.items,
    existingEvents: persisted.events,
    allowAutoRecur: false,
  });

  if (reconciled.upsertedItems.length > 0 || reconciled.newEvents.length > 0) {
    await persistUpsertedLifecycleRecords({
      allItems: reconciled.items,
      allEvents: reconciled.events,
      upsertedItems: reconciled.upsertedItems,
      newEvents: reconciled.newEvents,
    });
  }

  const statusByDedupe = new Map<string, IntelligenceLifecycleStatus>();
  for (const item of reconciled.items) {
    statusByDedupe.set(item.dedupeKey, item.status);
  }

  // Reflect authoritative lifecycle status on smartAlerts and insights
  for (const alert of overview.intelligence?.smartAlerts || []) {
    const st = statusByDedupe.get(alert.dedupeKey || `smart_alert:${alert.id}`);
    if (st) {
      alert.lifecycleStatus = toLegacyAlertStatus(st);
    }
  }
  for (const ins of overview.insights || []) {
    const st = statusByDedupe.get(`bi_insight:${ins.id}`);
    if (st) {
      ins.lifecycleStatus = toLegacyAlertStatus(st);
    }
  }

  const queried = queryLifecycleItems({
    items: reconciled.items,
    userContext: overview.userContext,
    filter: { status: 'ALL_HISTORY', pageSize: 100 },
  });

  overview.lifecycleSummary = queried.counts;
  overview.lifecycleItems = queried.items;

  // Update overview.intelligence.overview.totalActiveAlerts to reflect truly ACTIVE smart alerts
  if (overview.intelligence?.overview) {
    const activeSmartAlerts = (overview.intelligence.smartAlerts || []).filter(
      (a) => a.lifecycleStatus === 'active'
    );
    overview.intelligence.overview.totalActiveAlerts = activeSmartAlerts.length;
    overview.intelligence.overview.criticalAlertsCount = activeSmartAlerts.filter(
      (a) => a.severity === 'CRITICAL'
    ).length;
    overview.intelligence.overview.highAlertsCount = activeSmartAlerts.filter(
      (a) => a.severity === 'HIGH'
    ).length;
  }

  return {
    items: reconciled.items,
    events: reconciled.events,
  };
}

/**
 * Executes and persists an authenticated lifecycle transition (`ACKNOWLEDGE`, `RESOLVE`, `DISMISS`, `REOPEN`).
 */
export async function executeServerLifecycleTransition(params: {
  overview: AnalyticsOverviewResponse;
  itemIdOrDedupeKey: string;
  action: 'ACKNOWLEDGE' | 'RESOLVE' | 'DISMISS' | 'REOPEN';
  userName: string;
  note?: string;
  actionType?: string;
}): Promise<{
  item: IntelligenceLifecycleItemRecord;
  event: IntelligenceLifecycleEventRecord;
  history: IntelligenceLifecycleEventRecord[];
  counts: IntelligenceLifecycleSummaryCounts;
}> {
  const synced = await syncOverviewWithLifecycleStore(params.overview);

  const result = applyLifecycleTransition({
    items: synced.items,
    events: synced.events,
    input: {
      itemIdOrDedupeKey: params.itemIdOrDedupeKey,
      action: params.action,
      userContext: params.overview.userContext,
      userName: params.userName,
      note: params.note,
      actionType: params.actionType,
    },
  });

  await persistUpsertedLifecycleRecords({
    allItems: result.items,
    allEvents: result.events,
    upsertedItems: [result.updatedItem],
    newEvents: [result.createdEvent],
  });

  const itemHistory = result.events.filter(
    (e) =>
      e.lifecycleItemId === result.updatedItem.id ||
      e.dedupeKey === result.updatedItem.dedupeKey
  );

  const queried = queryLifecycleItems({
    items: result.items,
    userContext: params.overview.userContext,
    filter: { status: 'ALL_HISTORY', pageSize: 100 },
  });

  return {
    item: result.updatedItem,
    event: result.createdEvent,
    history: itemHistory,
    counts: queried.counts,
  };
}
