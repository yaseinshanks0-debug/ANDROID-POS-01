/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from 'express';
import {
  ABCClassificationBasis,
  AnalyticsDatePreset,
  AnalyticsFilterParams,
  MissingDateStrategy,
} from './analytics.types';
import {
  buildAnalyticsSnapshotFromState,
  cancelUnmetDemandRequestServer,
  fulfillUnmetDemandRequestFromSaleServer,
  loadServerAnalyticsDataset,
  recordUnmetDemandRequestServer,
  reverseUnmetDemandFulfillmentsBySaleServer,
} from './analytics.repository';
import { computeFullAnalyticsOverview } from './analytics.service';
import { resolveAnalyticsUserContext } from './analytics.permissions';
import { redactUnmetDemandRecordForRole } from './unmet-demand.validation';
import { PaymentMethod, SalesRateValuationMode } from '../lib/types';
import {
  canUserAccessLifecycleItem,
  executeServerLifecycleTransition,
  LifecycleActionError,
  queryLifecycleItems,
  syncOverviewWithLifecycleStore,
} from './intelligence.lifecycle';
import {
  ReleasePlatformError,
  resolveAuthenticatedActorFromRequest,
} from '../server/release-onboarding.service';

export const analyticsRouter = Router();
export const intelligenceRouter = Router();
export const unmetDemandRouter = Router();

/**
 * Extracts validated filter parameters from Express req.query or req.body.
 */
function parseFilterParams(req: Request): AnalyticsFilterParams {
  const q = { ...(req.query || {}), ...(req.body?.filters || {}) };

  const validPresets: AnalyticsDatePreset[] = [
    'today',
    'yesterday',
    '7d',
    '30d',
    '90d',
    'mtd',
    'ytd',
    'custom',
  ];
  const datePreset: AnalyticsDatePreset = validPresets.includes(q.datePreset as any)
    ? (q.datePreset as AnalyticsDatePreset)
    : '30d';

  const validValuation: SalesRateValuationMode[] = ['historical', 'live', 'indexed'];
  const valuationMode: SalesRateValuationMode = validValuation.includes(q.valuationMode as any)
    ? (q.valuationMode as SalesRateValuationMode)
    : 'historical';

  const validAbc: ABCClassificationBasis[] = ['revenue', 'gross_profit', 'consumption_value'];
  const abcBasis: ABCClassificationBasis = validAbc.includes(q.abcBasis as any)
    ? (q.abcBasis as ABCClassificationBasis)
    : 'revenue';

  const horizonNum = Number(q.forecastHorizonDays);
  const forecastHorizonDays: 7 | 30 | 90 =
    horizonNum === 30 || horizonNum === 90 ? (horizonNum as 30 | 90) : 7;

  const missingDateStrategy: MissingDateStrategy =
    q.missingDateStrategy === 'skip_missing' ? 'skip_missing' : 'zero_fill';

  const fixedOperatingExpensesOverride =
    q.fixedOperatingExpensesOverride !== undefined &&
    q.fixedOperatingExpensesOverride !== '' &&
    Number.isFinite(Number(q.fixedOperatingExpensesOverride))
      ? Number(q.fixedOperatingExpensesOverride)
      : undefined;

  return {
    datePreset,
    startDate: typeof q.startDate === 'string' ? q.startDate : undefined,
    endDate: typeof q.endDate === 'string' ? q.endDate : undefined,
    branchId: typeof q.branchId === 'string' ? q.branchId : 'all',
    category: typeof q.category === 'string' ? q.category : 'all',
    productId: typeof q.productId === 'string' ? q.productId : 'all',
    customerId: typeof q.customerId === 'string' ? q.customerId : 'all',
    supplierName: typeof q.supplierName === 'string' ? q.supplierName : 'all',
    cashierName: typeof q.cashierName === 'string' ? q.cashierName : 'all',
    paymentMethod: (typeof q.paymentMethod === 'string'
      ? q.paymentMethod
      : 'all') as PaymentMethod | 'all',
    currency: typeof q.currency === 'string' ? q.currency : 'SDG',
    valuationMode,
    anchorCurrency: typeof q.anchorCurrency === 'string' ? q.anchorCurrency : 'USD',
    transactionStatus:
      q.transactionStatus === 'voided' || q.transactionStatus === 'all'
        ? q.transactionStatus
        : 'completed',
    abcBasis,
    leadTimeDays: q.leadTimeDays !== undefined ? Number(q.leadTimeDays) : 3,
    safetyStockDays: q.safetyStockDays !== undefined ? Number(q.safetyStockDays) : 2,
    forecastHorizonDays,
    missingDateStrategy,
    fixedOperatingExpensesOverride,
  };
}

/**
 * Extracts and verifies the authenticated `userId` and `companyId` from a Bearer/session token
 * (`Authorization: Bearer ...` or `x-session-token`) or falls back to `x-user-id` / `userId`
 * verified strictly against the server-side user store.
 * Security Rules (SEC-01 & SEC-02):
 * - Never default to `'usr-admin-1'` or `'admin'`.
 * - Never read or trust `x-user-role`, `query.userRole`, `query.role`, `x-company-id`, `x-branch-id`, or `x-terminal-name`.
 * - Role, permissions, company, branch, and terminal are resolved exclusively from the server-side user store.
 */
function parseUserContextFromReq(req: Request): { userId?: string; companyId?: string } {
  const authHeader = typeof req.headers.authorization === 'string' ? req.headers.authorization : '';
  const hasBearer = authHeader.startsWith('Bearer ') && authHeader.slice(7).trim().length > 0;
  const hasSessionToken =
    typeof req.headers['x-session-token'] === 'string' &&
    req.headers['x-session-token'].trim().length > 0;

  if (hasBearer || hasSessionToken) {
    try {
      const actor = resolveAuthenticatedActorFromRequest(req);
      return {
        userId: actor.user.id,
        companyId: actor.company.id,
      };
    } catch (err: any) {
      if (err instanceof ReleasePlatformError) {
        throw new AnalyticsAuthError(err.statusCode, err.errorCode, err.message);
      }
      throw new AnalyticsAuthError(
        401,
        'INVALID_OR_EXPIRED_SESSION',
        'Authentication failed: invalid or expired session token.'
      );
    }
  }

  const headerUserId =
    typeof req.headers['x-user-id'] === 'string' ? req.headers['x-user-id'].trim() : '';
  const queryUserId =
    typeof req.query.userId === 'string' ? req.query.userId.trim() : '';
  const bodyUserId =
    typeof req.body?.userId === 'string' ? req.body.userId.trim() : '';

  const userId = headerUserId || queryUserId || bodyUserId || '';
  return {
    userId: userId.length > 0 ? userId : undefined,
  };
}

class AnalyticsAuthError extends Error {
  statusCode: number;
  errorCode: string;
  constructor(statusCode: number, errorCode: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

async function computeFromRequest(req: Request) {
  const filters = parseFilterParams(req);
  const userCtx = parseUserContextFromReq(req);

  if (!userCtx.userId) {
    throw new AnalyticsAuthError(
      401,
      'UNAUTHENTICATED_MISSING_USER',
      'Authentication required: missing user identity (Authorization Bearer token or x-user-id).'
    );
  }

  // Always load the authoritative server dataset to verify user identity against server-side user store
  const serverDataset = await loadServerAnalyticsDataset({
    statusFilter: filters.transactionStatus,
    companyId: userCtx.companyId,
  });

  const matchedUser = serverDataset.users.find((u) => u && u.id === userCtx.userId) as
    | (any & { companyId?: string })
    | undefined;
  if (!matchedUser) {
    throw new AnalyticsAuthError(
      401,
      'UNAUTHORIZED_UNKNOWN_USER',
      `Authentication failed: user "${userCtx.userId}" is not recognized in the server user directory.`
    );
  }

  const resolvedCompanyId = userCtx.companyId || matchedUser.companyId || 'comp-default';

  let dataset = serverDataset;
  if (req.body?.snapshot) {
    dataset = buildAnalyticsSnapshotFromState(req.body.snapshot);
    // Enforce server-authoritative user store and tenant isolation even when client provides a snapshot payload
    dataset.users = serverDataset.users;
    dataset.unmetDemandRequests = (dataset.unmetDemandRequests || []).filter(
      (r) => (r.companyId || 'comp-default') === resolvedCompanyId
    );
  } else if (!userCtx.companyId && resolvedCompanyId !== 'comp-default') {
    dataset = await loadServerAnalyticsDataset({
      statusFilter: filters.transactionStatus,
      companyId: resolvedCompanyId,
    });
  }

  const overview = computeFullAnalyticsOverview(dataset, filters, {
    userId: matchedUser.id,
  });

  if (!overview.userContext.roleVerifiedFromServerStore) {
    throw new AnalyticsAuthError(
      401,
      'UNVERIFIED_USER_CONTEXT',
      'Authentication failed: user identity could not be verified against the server user store.'
    );
  }

  await syncOverviewWithLifecycleStore(overview);

  return overview;
}

function handleRouteError(res: Response, err: any, fallbackMessage: string): void {
  if (
    err instanceof AnalyticsAuthError ||
    err instanceof LifecycleActionError ||
    err instanceof ReleasePlatformError
  ) {
    res.status(err.statusCode).json({
      success: false,
      errorCode: err.errorCode,
      error: err.message,
    });
    return;
  }
  res.status(500).json({
    success: false,
    error: err?.message || fallbackMessage,
  });
}

// 1. GET & POST /api/analytics/overview
analyticsRouter.get('/overview', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({ success: true, data: overview });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute analytics overview');
  }
});

analyticsRouter.post('/overview', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({ success: true, data: overview });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute analytics overview');
  }
});

// 2. GET /api/analytics/sales
analyticsRouter.get('/sales', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: overview.sales,
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute sales analytics');
  }
});

// 3. GET /api/analytics/financial (Protected: requires canViewFinancials)
analyticsRouter.get('/financial', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    if (!overview.userContext.canViewFinancials) {
      res.status(403).json({
        success: false,
        errorCode: 'FORBIDDEN_FINANCIAL_ACCESS',
        error:
          'Access denied: role "' +
          overview.userContext.role +
          '" is not authorized to access P&L, cash flow, or break-even financial statements.',
        userContext: overview.userContext,
      });
      return;
    }
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: overview.financial,
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute financial analytics');
  }
});

// 4. GET /api/analytics/inventory
analyticsRouter.get('/inventory', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: overview.inventory,
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute inventory analytics');
  }
});

// 5. GET /api/analytics/products
analyticsRouter.get('/products', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: {
        salesByProduct: overview.sales.byProduct,
        salesByCategory: overview.sales.byCategory,
        inventoryProducts: overview.inventory.products,
        abcSummary: overview.inventory.abcSummary,
        productDemandForecasts: overview.forecasts.productDemandForecasts,
      },
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute product analytics');
  }
});

// 6. GET /api/analytics/customers
analyticsRouter.get('/customers', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: overview.customers,
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute customer analytics');
  }
});

// 7. GET /api/analytics/branches
analyticsRouter.get('/branches', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: overview.branches,
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute branch analytics');
  }
});

// 8. GET /api/analytics/technical-indicators
analyticsRouter.get('/technical-indicators', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: overview.technicalIndicators,
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute technical indicators');
  }
});

// 9. GET /api/analytics/forecasts
analyticsRouter.get('/forecasts', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: overview.forecasts,
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute statistical forecasts');
  }
});

// 10. GET /api/analytics/insights
analyticsRouter.get('/insights', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: overview.insights,
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to generate business insights');
  }
});

// ============================================================================
// PHASE 10: SMART STORE OPERATIONS & CUSTOMER DEMAND INTELLIGENCE ENDPOINTS
// ============================================================================

// GET /api/unmet-demand/requests (and /api/intelligence/unmet-demand/requests)
const handleListUnmetDemandRequests = async (req: Request, res: Response) => {
  try {
    const userCtx = parseUserContextFromReq(req);
    if (!userCtx.userId) {
      throw new AnalyticsAuthError(
        401,
        'UNAUTHENTICATED_MISSING_USER',
        'Authentication required: missing user identity.'
      );
    }

    const serverDataset = await loadServerAnalyticsDataset({
      companyId: userCtx.companyId,
    });
    const matchedUser = serverDataset.users.find((u) => u && u.id === userCtx.userId) as
      | (any & { companyId?: string })
      | undefined;
    if (!matchedUser) {
      throw new AnalyticsAuthError(
        401,
        'UNAUTHORIZED_UNKNOWN_USER',
        `Authentication failed: user "${userCtx.userId}" is not recognized in the server user directory.`
      );
    }

    const resolvedUserCtx = resolveAnalyticsUserContext(
      { userId: matchedUser.id },
      serverDataset.users
    );
    const resolvedCompanyId = userCtx.companyId || matchedUser.companyId || 'comp-default';

    const requestedBranchId =
      typeof req.query.branchId === 'string' && req.query.branchId.trim()
        ? req.query.branchId.trim()
        : 'all';
    const effectiveBranchId =
      !resolvedUserCtx.canViewAllBranches && resolvedUserCtx.assignedBranchId
        ? resolvedUserCtx.assignedBranchId
        : requestedBranchId;

    const productIdFilter =
      typeof req.query.productId === 'string' && req.query.productId.trim()
        ? req.query.productId.trim()
        : 'all';
    const fulfillmentStatusFilter =
      typeof req.query.fulfillmentStatus === 'string' && req.query.fulfillmentStatus.trim()
        ? req.query.fulfillmentStatus.trim()
        : 'all';
    const reasonFilter =
      typeof req.query.reason === 'string' && req.query.reason.trim()
        ? req.query.reason.trim()
        : 'all';

    const filtered = (serverDataset.unmetDemandRequests || [])
      .filter((r) => (r.companyId || 'comp-default') === resolvedCompanyId)
      .filter((r) => effectiveBranchId === 'all' || r.branchId === effectiveBranchId)
      .filter((r) => productIdFilter === 'all' || r.productId === productIdFilter)
      .filter(
        (r) =>
          fulfillmentStatusFilter === 'all' || r.fulfillmentStatus === fulfillmentStatusFilter
      )
      .filter((r) => reasonFilter === 'all' || r.unavailabilityReason === reasonFilter)
      .map((r) => redactUnmetDemandRecordForRole(r, resolvedUserCtx.canViewCustomerPII));

    res.json({
      success: true,
      userContext: resolvedUserCtx,
      data: filtered,
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to list unmet demand requests');
  }
};

unmetDemandRouter.get('/requests', handleListUnmetDemandRequests);
intelligenceRouter.get('/unmet-demand/requests', handleListUnmetDemandRequests);

// POST /api/unmet-demand/requests (and /api/intelligence/unmet-demand/requests)
const handleCreateUnmetDemandRequest = async (req: Request, res: Response) => {
  try {
    const userCtx = parseUserContextFromReq(req);
    const result = await recordUnmetDemandRequestServer({
      input: req.body || {},
      claimingUserId: userCtx.userId,
      companyId: userCtx.companyId,
    });

    if (!result.valid) {
      res.status(result.statusCode).json({
        success: false,
        errorCode: result.errorCode,
        error: result.errorMessage,
        errorAr: result.errorMessageAr,
      });
      return;
    }

    res.status(201).json({
      success: true,
      data: result.record,
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to record unmet demand request');
  }
};

unmetDemandRouter.post('/requests', handleCreateUnmetDemandRequest);
intelligenceRouter.post('/unmet-demand/requests', handleCreateUnmetDemandRequest);

// POST /api/unmet-demand/requests/:id/fulfill-from-sale
const handleFulfillFromSale = async (req: Request, res: Response) => {
  try {
    const userCtx = parseUserContextFromReq(req);
    const requestId = decodeURIComponent(req.params.id || req.body?.requestId || '');
    const result = await fulfillUnmetDemandRequestFromSaleServer({
      requestId,
      saleTransactionId: req.body?.saleTransactionId || '',
      saleLineIndex: req.body?.saleLineIndex,
      fulfilledBaseUnits: req.body?.fulfilledBaseUnits,
      claimingUserId: userCtx.userId,
      companyId: userCtx.companyId,
    });

    if (!result.valid) {
      res.status(result.statusCode).json({
        success: false,
        errorCode: result.errorCode,
        error: result.errorMessage,
        errorAr: result.errorMessageAr,
      });
      return;
    }

    res.json({
      success: true,
      data: {
        record: result.record,
        fulfillmentLink: result.fulfillmentLink,
      },
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to fulfill unmet demand request from sale');
  }
};

unmetDemandRouter.post('/requests/:id/fulfill-from-sale', handleFulfillFromSale);
intelligenceRouter.post('/unmet-demand/requests/:id/fulfill-from-sale', handleFulfillFromSale);

// POST /api/unmet-demand/sales/:saleTransactionId/reverse-fulfillments
const handleReverseSaleFulfillments = async (req: Request, res: Response) => {
  try {
    const userCtx = parseUserContextFromReq(req);
    const saleTransactionId = decodeURIComponent(
      req.params.saleTransactionId || req.body?.saleTransactionId || ''
    );
    const rawReason = req.body?.reversalReason;
    const reversalReason: 'reversed_by_void' | 'reversed_by_return' =
      rawReason === 'reversed_by_return' ? 'reversed_by_return' : 'reversed_by_void';

    const result = await reverseUnmetDemandFulfillmentsBySaleServer({
      saleTransactionId,
      reversalReason,
      reversalReferenceId: req.body?.reversalReferenceId,
      returnedProductId: req.body?.returnedProductId,
      claimingUserId: userCtx.userId,
      companyId: userCtx.companyId,
    });

    if (!result.valid) {
      res.status(result.statusCode).json({
        success: false,
        errorCode: result.errorCode,
        error: result.errorMessage,
        errorAr: result.errorMessageAr,
      });
      return;
    }

    res.json({
      success: true,
      data: {
        affectedRecords: result.affectedRecords || [],
      },
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to reverse sale-linked unmet demand fulfillments');
  }
};

unmetDemandRouter.post(
  '/sales/:saleTransactionId/reverse-fulfillments',
  handleReverseSaleFulfillments
);
intelligenceRouter.post(
  '/unmet-demand/sales/:saleTransactionId/reverse-fulfillments',
  handleReverseSaleFulfillments
);

// POST /api/unmet-demand/requests/:id/cancel & PATCH /api/unmet-demand/requests/:id/status
const handleCancelOrUpdateStatus = async (req: Request, res: Response) => {
  try {
    const userCtx = parseUserContextFromReq(req);
    const requestId = decodeURIComponent(req.params.id || req.body?.requestId || '');
    const requestedStatus =
      typeof req.body?.fulfillmentStatus === 'string'
        ? req.body.fulfillmentStatus.trim()
        : typeof req.body?.status === 'string'
          ? req.body.status.trim()
          : 'cancelled';

    const result = await cancelUnmetDemandRequestServer({
      requestId,
      requestedStatus,
      cancelReason: req.body?.cancelReason || req.body?.reason || req.body?.notes || '',
      claimingUserId: userCtx.userId,
      companyId: userCtx.companyId,
    });

    if (!result.valid) {
      res.status(result.statusCode).json({
        success: false,
        errorCode: result.errorCode,
        error: result.errorMessage,
        errorAr: result.errorMessageAr,
      });
      return;
    }

    res.json({
      success: true,
      data: result.record,
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to update unmet demand request status');
  }
};

unmetDemandRouter.post('/requests/:id/cancel', handleCancelOrUpdateStatus);
unmetDemandRouter.patch('/requests/:id/status', handleCancelOrUpdateStatus);
intelligenceRouter.post('/unmet-demand/requests/:id/cancel', handleCancelOrUpdateStatus);
intelligenceRouter.patch('/unmet-demand/requests/:id/status', handleCancelOrUpdateStatus);

// GET /api/intelligence/overview
intelligenceRouter.get('/overview', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: overview.intelligence,
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute smart store intelligence overview');
  }
});

// GET /api/intelligence/alerts
intelligenceRouter.get('/alerts', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: overview.intelligence.smartAlerts,
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute smart alerts');
  }
});

// GET /api/intelligence/recommendations
intelligenceRouter.get('/recommendations', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: {
        replenishmentRecommendations:
          overview.intelligence.replenishmentRecommendations,
        branchTransferOpportunities:
          overview.intelligence.branchTransferOpportunities,
      },
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute replenishment and transfer recommendations');
  }
});

// GET /api/intelligence/inventory-risks
intelligenceRouter.get('/inventory-risks', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: overview.intelligence.inventoryRisks,
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute inventory risks');
  }
});

// GET /api/intelligence/financial-risks (Protected: requires canViewFinancials)
intelligenceRouter.get('/financial-risks', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    if (!overview.userContext.canViewFinancials) {
      res.status(403).json({
        success: false,
        errorCode: 'FORBIDDEN_FINANCIAL_ACCESS',
        error:
          'Access denied: role "' +
          overview.userContext.role +
          '" is not authorized to access financial risk intelligence.',
        userContext: overview.userContext,
      });
      return;
    }
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: overview.intelligence.financialRisks,
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute financial risks');
  }
});

// GET /api/intelligence/branch-insights
intelligenceRouter.get('/branch-insights', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: {
        branchAlerts: overview.intelligence.branchInsights,
        branchTransferOpportunities:
          overview.intelligence.branchTransferOpportunities,
        unmetDemandByBranch: overview.intelligence.unmetDemand.byBranch,
      },
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute branch intelligence');
  }
});

// GET /api/intelligence/unmet-demand/overview
intelligenceRouter.get('/unmet-demand/overview', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: overview.intelligence.unmetDemand,
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute unmet demand overview');
  }
});

// GET /api/intelligence/unmet-demand/products
intelligenceRouter.get('/unmet-demand/products', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: {
        topRequestedProducts:
          overview.intelligence.unmetDemand.topRequestedProducts,
        unregisteredProductsDemand:
          overview.intelligence.unmetDemand.unregisteredProductsDemand,
        byCategory: overview.intelligence.unmetDemand.byCategory,
        byReason: overview.intelligence.unmetDemand.byReason,
      },
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute unmet demand products');
  }
});

// GET /api/intelligence/unmet-demand/trends
intelligenceRouter.get('/unmet-demand/trends', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: {
        dailyTrends: overview.intelligence.unmetDemand.dailyTrends,
        weeklyTrends: overview.intelligence.unmetDemand.weeklyTrends,
        monthlyTrends: overview.intelligence.unmetDemand.monthlyTrends,
      },
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute unmet demand trends');
  }
});

// GET /api/intelligence/unmet-demand/branches
intelligenceRouter.get('/unmet-demand/branches', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: overview.intelligence.unmetDemand.byBranch,
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute unmet demand branch comparison');
  }
});

// GET /api/intelligence/unmet-demand/forecast
intelligenceRouter.get('/unmet-demand/forecast', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    res.json({
      success: true,
      filtersApplied: overview.filtersApplied,
      userContext: overview.userContext,
      data: {
        predictiveDemandComparison:
          overview.forecasts.predictiveDemandComparison,
        productDemandForecasts: overview.forecasts.productDemandForecasts,
        lostSalesEstimation:
          overview.intelligence.unmetDemand.lostSalesEstimation,
        replenishmentRecommendations:
          overview.intelligence.replenishmentRecommendations,
      },
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to compute unmet demand forecast');
  }
});

// ============================================================================
// PHASE 9.5: INTELLIGENCE LIFECYCLE MANAGEMENT ENDPOINTS
// ============================================================================

function parseLifecycleQueryFilter(req: Request) {
  const q = { ...(req.query || {}), ...(req.body?.lifecycleFilter || req.body || {}) };
  const validStatuses = ['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED', 'ALL_HISTORY'];
  const rawStatus = typeof q.status === 'string' ? q.status.toUpperCase() : 'ACTIVE';
  const status = validStatuses.includes(rawStatus) ? (rawStatus as any) : 'ACTIVE';

  const validStreams = ['smart_alert', 'replenishment', 'branch_transfer', 'bi_insight', 'all'];
  const itemStream =
    typeof q.itemStream === 'string' && validStreams.includes(q.itemStream)
      ? (q.itemStream as any)
      : 'all';

  const validSorts = ['priority_desc', 'updated_desc', 'created_desc', 'severity_desc'];
  const sortBy =
    typeof q.sortBy === 'string' && validSorts.includes(q.sortBy)
      ? (q.sortBy as any)
      : 'priority_desc';

  return {
    status,
    itemStream,
    category: typeof q.category === 'string' && q.category.trim() ? q.category.trim() : 'all',
    severity: typeof q.severity === 'string' && q.severity.trim() ? q.severity.trim() : 'all',
    branchId: typeof q.branchId === 'string' && q.branchId.trim() ? q.branchId.trim() : 'all',
    startDate: typeof q.startDate === 'string' ? q.startDate.trim() : '',
    endDate: typeof q.endDate === 'string' ? q.endDate.trim() : '',
    search: typeof q.search === 'string' ? q.search.trim() : '',
    sortBy,
    page: q.page !== undefined ? Number(q.page) : 1,
    pageSize: q.pageSize !== undefined ? Number(q.pageSize) : 20,
  };
}

// GET & POST /api/intelligence/lifecycle
const handleGetLifecycleList = async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    const synced = await syncOverviewWithLifecycleStore(overview);
    const filter = parseLifecycleQueryFilter(req);
    const result = queryLifecycleItems({
      items: synced.items,
      userContext: overview.userContext,
      filter,
    });
    res.json({
      success: true,
      userContext: overview.userContext,
      data: result,
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to query intelligence lifecycle items');
  }
};

intelligenceRouter.get('/lifecycle', handleGetLifecycleList);
intelligenceRouter.post('/lifecycle/query', handleGetLifecycleList);

// GET /api/intelligence/lifecycle/:id/history
intelligenceRouter.get('/lifecycle/:id/history', async (req: Request, res: Response) => {
  try {
    const overview = await computeFromRequest(req);
    const synced = await syncOverviewWithLifecycleStore(overview);
    const targetId = decodeURIComponent(req.params.id || '');
    const item = synced.items.find((it) => it.id === targetId || it.dedupeKey === targetId);

    if (!item) {
      res.status(404).json({
        success: false,
        errorCode: 'LIFECYCLE_ITEM_NOT_FOUND',
        error: `Intelligence item "${targetId}" was not found.`,
      });
      return;
    }

    if (!canUserAccessLifecycleItem(item, overview.userContext)) {
      res.status(403).json({
        success: false,
        errorCode: 'FORBIDDEN_LIFECYCLE_ITEM_ACCESS',
        error: 'Access denied: insufficient branch or financial permissions for this item.',
      });
      return;
    }

    const history = synced.events.filter(
      (e) => e.lifecycleItemId === item.id || e.dedupeKey === item.dedupeKey
    );

    res.json({
      success: true,
      userContext: overview.userContext,
      data: {
        item,
        history,
      },
    });
  } catch (err: any) {
    handleRouteError(res, err, 'Failed to fetch intelligence item lifecycle history');
  }
});

const makeLifecycleTransitionHandler =
  (action: 'ACKNOWLEDGE' | 'RESOLVE' | 'DISMISS' | 'REOPEN') =>
  async (req: Request, res: Response) => {
    try {
      const overview = await computeFromRequest(req);
      const serverDataset = await loadServerAnalyticsDataset();
      const matchedUser = serverDataset.users.find((u) => u && u.id === overview.userContext.userId);
      const userName = matchedUser?.name || overview.userContext.userId;

      const targetId = decodeURIComponent(req.params.id || req.body?.itemId || '');
      const note =
        req.body?.note ||
        req.body?.resolutionNote ||
        req.body?.dismissReason ||
        req.body?.acknowledgmentNote ||
        undefined;
      const actionType = req.body?.actionType || req.body?.resolutionActionType || undefined;

      const transitionResult = await executeServerLifecycleTransition({
        overview,
        itemIdOrDedupeKey: targetId,
        action,
        userName,
        note,
        actionType,
      });

      res.json({
        success: true,
        userContext: overview.userContext,
        data: transitionResult,
      });
    } catch (err: any) {
      handleRouteError(res, err, `Failed to ${action.toLowerCase()} intelligence item`);
    }
  };

intelligenceRouter.post('/lifecycle/:id/acknowledge', makeLifecycleTransitionHandler('ACKNOWLEDGE'));
intelligenceRouter.post('/lifecycle/:id/resolve', makeLifecycleTransitionHandler('RESOLVE'));
intelligenceRouter.post('/lifecycle/:id/dismiss', makeLifecycleTransitionHandler('DISMISS'));
intelligenceRouter.post('/lifecycle/:id/reopen', makeLifecycleTransitionHandler('REOPEN'));

