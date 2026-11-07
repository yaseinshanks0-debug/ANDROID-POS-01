/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Bell,
  BellRing,
  AlertTriangle,
  CheckCircle2,
  Eye,
  XCircle,
  RotateCcw,
  ArrowRight,
  Package,
  Calendar,
  PackageX,
  Receipt,
  Sparkles,
  CheckCheck,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { AppModal } from '../ui/AppModal';
import {
  StoreNotificationItem,
  StoreNotificationType,
  computeNotificationSummaryCounts,
} from '../../lib/notifications-center';
import { SmartAlertLifecycleStatus } from '../../analytics/analytics.types';

export interface NotificationsBellModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAr: boolean;
  notifications: StoreNotificationItem[];
  counts?: ReturnType<typeof computeNotificationSummaryCounts>;
  initialSelectedNotificationId?: string | null;
  initialSelectedId?: string | null;
  onUpdateStatus: (
    item: StoreNotificationItem,
    nextStatus: SmartAlertLifecycleStatus,
    note?: string
  ) => void;
  onMarkAllAcknowledged?: () => void;
  onMarkAllRead?: () => void;
  onExecutePrimaryAction: (item: StoreNotificationItem) => void;
}

type FilterTab = 'active' | 'all' | 'stock_expiry' | 'unmet_demand' | 'handled';

export const NotificationsBellModal: React.FC<NotificationsBellModalProps> = ({
  isOpen,
  onClose,
  isAr,
  notifications,
  initialSelectedNotificationId = null,
  initialSelectedId = null,
  onUpdateStatus,
  onMarkAllAcknowledged,
  onMarkAllRead,
  onExecutePrimaryAction,
}) => {
  const effectiveInitialId = initialSelectedNotificationId ?? initialSelectedId ?? null;
  const effectiveMarkAll = onMarkAllAcknowledged || onMarkAllRead;
  const [filterTab, setFilterTab] = useState<FilterTab>('active');
  const [selectedId, setSelectedId] = useState<string | null>(effectiveInitialId);
  const [resolutionNoteDraft, setResolutionNoteDraft] = useState<string>('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedId(effectiveInitialId);
      setActionFeedback(null);
    }
  }, [isOpen, effectiveInitialId]);

  const counts = useMemo(
    () => computeNotificationSummaryCounts(notifications),
    [notifications]
  );

  const selectedNotification = useMemo(() => {
    if (!selectedId) return null;
    return notifications.find((n) => n.id === selectedId || n.dedupeKey === selectedId) || null;
  }, [notifications, selectedId]);

  useEffect(() => {
    if (selectedNotification) {
      setResolutionNoteDraft(selectedNotification.resolutionNote || '');
    } else {
      setResolutionNoteDraft('');
    }
  }, [selectedNotification]);

  const filteredList = useMemo(() => {
    return notifications.filter((item) => {
      if (filterTab === 'active') {
        return item.status === 'active' || item.status === 'acknowledged';
      }
      if (filterTab === 'stock_expiry') {
        return (
          item.type === 'OUT_OF_STOCK' ||
          item.type === 'LOW_STOCK' ||
          item.type === 'EXPIRED_PRODUCT' ||
          item.type === 'EXPIRING_SOON'
        );
      }
      if (filterTab === 'unmet_demand') {
        return item.type === 'UNMET_DEMAND';
      }
      if (filterTab === 'handled') {
        return item.status === 'resolved' || item.status === 'dismissed';
      }
      return true;
    });
  }, [notifications, filterTab]);

  const getSeverityBadge = (sev: StoreNotificationItem['severity']) => {
    if (sev === 'CRITICAL') {
      return {
        label: isAr ? 'حرج جداً' : 'Critical',
        cls: 'text-rose-400',
        border: 'border-rose-500/40 bg-rose-950/20',
      };
    }
    if (sev === 'HIGH') {
      return {
        label: isAr ? 'أولوية عالية' : 'High Priority',
        cls: 'text-amber-400',
        border: 'border-amber-500/40 bg-amber-950/20',
      };
    }
    return {
      label: isAr ? 'تنبيه تشغيلي' : 'Operational',
      cls: 'text-sky-400',
      border: 'border-neutral-800 bg-neutral-900/90',
    };
  };

  const getStatusLabel = (st: SmartAlertLifecycleStatus) => {
    const map: Record<SmartAlertLifecycleStatus, { ar: string; en: string; cls: string }> = {
      active: {
        ar: 'نشط (جديد)',
        en: 'Active',
        cls: 'text-rose-400',
      },
      acknowledged: {
        ar: 'تم الاطلاع',
        en: 'Acknowledged',
        cls: 'text-amber-400',
      },
      resolved: {
        ar: 'تم الحل والمعالجة',
        en: 'Resolved',
        cls: 'text-emerald-400',
      },
      dismissed: {
        ar: 'تم التجاهل',
        en: 'Dismissed',
        cls: 'text-neutral-400',
      },
    };
    return map[st] || map.active;
  };

  const getTypeIcon = (type: StoreNotificationType) => {
    switch (type) {
      case 'OUT_OF_STOCK':
      case 'LOW_STOCK':
        return <Package className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'EXPIRED_PRODUCT':
      case 'EXPIRING_SOON':
        return <Calendar className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'UNMET_DEMAND':
        return <PackageX className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'CUSTOMER_DEBT':
        return <Receipt className="w-4 h-4 text-sky-400 shrink-0" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />;
    }
  };

  const handleStatusButtonClick = (
    item: StoreNotificationItem,
    nextStatus: SmartAlertLifecycleStatus
  ) => {
    onUpdateStatus(item, nextStatus, resolutionNoteDraft.trim() || undefined);
    const statusText = getStatusLabel(nextStatus);
    setActionFeedback(
      isAr
        ? `تم تحديث حالة التنبيه إلى: ${statusText.ar}`
        : `Alert status updated to: ${statusText.en}`
    );
    setTimeout(() => setActionFeedback(null), 2500);
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isAr
          ? `جرس التنبيهات ومركز المتابعة (${counts.active} نشط)`
          : `Notifications Bell & Action Center (${counts.active} Active)`
      }
      description={
        isAr
          ? 'اضغط على أي تنبيه لعرض التفاصيل الكاملة والتعامل معه فوراً أو تحديث حالته'
          : 'Click any notification to view full diagnostic details and take immediate operational action'
      }
      maxWidth="2xl"
    >
      <div
        data-testid="notifications-bell-modal-content"
        className="flex flex-col gap-4 max-h-[76vh] overflow-hidden"
      >
        {/* Top Summary Strip + Mark All Read */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <BellRing className="w-4 h-4 text-amber-400" />
              <span>
                {isAr ? 'النشطة:' : 'Active:'}{' '}
                <strong className="font-mono tabular-nums text-amber-400">{counts.active}</strong>
              </span>
            </div>
            <span className="text-neutral-700" aria-hidden="true">
              ·
            </span>
            <span className="text-rose-400 font-semibold">
              {isAr ? 'حرجة:' : 'Critical:'}{' '}
              <strong className="font-mono tabular-nums">{counts.criticalActive}</strong>
            </span>
            <span className="text-neutral-700" aria-hidden="true">
              ·
            </span>
            <span className="text-amber-300 font-semibold">
              {isAr ? 'تم الاطلاع:' : 'Acknowledged:'}{' '}
              <strong className="font-mono tabular-nums">{counts.acknowledged}</strong>
            </span>
            <span className="text-neutral-700" aria-hidden="true">
              ·
            </span>
            <span className="text-emerald-400 font-semibold">
              {isAr ? 'تم حلها:' : 'Resolved:'}{' '}
              <strong className="font-mono tabular-nums">{counts.resolved}</strong>
            </span>
          </div>

          {counts.active > 0 && effectiveMarkAll && (
            <button
              type="button"
              data-testid="notifications-mark-all-read-btn"
              onClick={effectiveMarkAll}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold text-amber-300 flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{isAr ? 'تحديد الكل كمقروء' : 'Acknowledge All'}</span>
            </button>
          )}
        </div>

        {/* Filter Tabs (shown when not locked into a single detail or as quick navigation) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {(
            [
              {
                id: 'active' as FilterTab,
                labelAr: `التنبيهات النشطة (${counts.active + counts.acknowledged})`,
                labelEn: `Active (${counts.active + counts.acknowledged})`,
              },
              {
                id: 'all' as FilterTab,
                labelAr: `الكل (${counts.total})`,
                labelEn: `All (${counts.total})`,
              },
              {
                id: 'stock_expiry' as FilterTab,
                labelAr: 'المخزون والصلاحية',
                labelEn: 'Stock & Expiry',
              },
              {
                id: 'unmet_demand' as FilterTab,
                labelAr: 'طلبات غير متوفرة',
                labelEn: 'Unmet Demand',
              },
              {
                id: 'handled' as FilterTab,
                labelAr: `تم التعامل معها (${counts.resolved + counts.dismissed})`,
                labelEn: `Handled (${counts.resolved + counts.dismissed})`,
              },
            ]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-testid={`notifications-filter-tab-${tab.id}`}
              onClick={() => {
                setFilterTab(tab.id);
                setSelectedId(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${
                filterTab === tab.id && !selectedNotification
                  ? 'bg-amber-500 text-neutral-950 border-amber-400'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
              }`}
            >
              {isAr ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Feedback Banner */}
        {actionFeedback && (
          <div className="px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* DETAIL & ACTION VIEW when a specific notification is clicked */}
        {selectedNotification ? (
          <div
            data-testid="notification-detail-action-panel"
            className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-neutral-950 border border-amber-500/40"
          >
            {/* Back to notifications list */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-neutral-800">
              <button
                type="button"
                data-testid="notification-back-to-list-btn"
                onClick={() => setSelectedId(null)}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-200 flex items-center gap-1.5 transition-colors"
              >
                {isAr ? (
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-amber-400" />
                )}
                <span>{isAr ? 'العودة لقائمة التنبيهات' : 'Back to Notifications List'}</span>
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className={getSeverityBadge(selectedNotification.severity).cls + ' font-bold'}>
                  {getSeverityBadge(selectedNotification.severity).label}
                </span>
                <span className="text-neutral-600" aria-hidden="true">
                  ·
                </span>
                <span className={getStatusLabel(selectedNotification.status).cls + ' font-bold'}>
                  {isAr
                    ? getStatusLabel(selectedNotification.status).ar
                    : getStatusLabel(selectedNotification.status).en}
                </span>
              </div>
            </div>

            {/* Notification Title & Category */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                {getTypeIcon(selectedNotification.type)}
                <span>
                  {isAr
                    ? selectedNotification.categoryLabelAr
                    : selectedNotification.categoryLabelEn}
                </span>
                {selectedNotification.metricBadge && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono font-bold text-amber-400 tabular-nums">
                      {selectedNotification.metricBadge}
                    </span>
                  </>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                {isAr ? selectedNotification.titleAr : selectedNotification.titleEn}
              </h3>
            </div>

            {/* Full Diagnostic Details */}
            <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2">
              <div className="text-xs font-bold text-amber-400">
                {isAr ? 'التفاصيل والتشخيص الكامل:' : 'Full Diagnostic Details:'}
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                {isAr ? selectedNotification.detailsAr : selectedNotification.detailsEn}
              </p>
            </div>

            {/* Evidence Metrics if available */}
            {selectedNotification.evidenceMetrics &&
              selectedNotification.evidenceMetrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedNotification.evidenceMetrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800"
                    >
                      <div className="text-[11px] text-neutral-400">{m.name}</div>
                      <div className="text-xs sm:text-sm font-mono font-bold text-white tabular-nums mt-0.5">
                        {m.valueFormatted}
                      </div>
                      {m.comparisonText && (
                        <div className="text-[10px] text-amber-300 mt-0.5">{m.comparisonText}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            {/* Recommended Action Box */}
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2.5">
              <div className="text-xs font-bold text-emerald-400">
                {isAr ? 'التوصية والإجراء المقترح للتعامل مع التنبيه:' : 'Recommended Operational Action:'}
              </div>
              <p className="text-xs sm:text-sm text-emerald-200 font-medium leading-relaxed">
                {isAr
                  ? selectedNotification.recommendationAr
                  : selectedNotification.recommendationEn}
              </p>

              {/* Direct POS Operational Action Button */}
              <div className="pt-1">
                <button
                  type="button"
                  data-testid="notification-execute-primary-action-btn"
                  onClick={() => onExecutePrimaryAction(selectedNotification)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-extrabold inline-flex items-center gap-2 transition-colors shadow-sm"
                >
                  <span>
                    {isAr
                      ? selectedNotification.primaryActionLabelAr
                      : selectedNotification.primaryActionLabelEn}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Resolution Note & Lifecycle Status Controls (التعامل مع التنبيه وتحديث حالته) */}
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
              <label className="block text-xs font-bold text-white">
                {isAr
                  ? 'ملاحظة المعالجة / الإجراء المتخذ (اختياري):'
                  : 'Handling / Resolution Note (Optional):'}
              </label>
              <input
                type="text"
                data-testid="notification-resolution-note-input"
                value={resolutionNoteDraft}
                onChange={(e) => setResolutionNoteDraft(e.target.value)}
                placeholder={
                  isAr
                    ? 'اكتب ما تم اتخاذه بشأن هذا التنبيه (مثال: تم طلب البضاعة من المورد)...'
                    : 'Record how this alert was handled (e.g. Ordered restock from supplier)...'
                }
                className="w-full min-h-[38px] px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  data-testid="notification-action-acknowledge-btn"
                  onClick={() => handleStatusButtonClick(selectedNotification, 'acknowledged')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
                    selectedNotification.status === 'acknowledged'
                      ? 'bg-amber-500 text-neutral-950 border-amber-400'
                      : 'bg-neutral-950 text-amber-300 border-amber-500/40 hover:bg-amber-500/15'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تم الاطلاع والمتابعة' : 'Acknowledge'}</span>
                </button>

                <button
                  type="button"
                  data-testid="notification-action-resolve-btn"
                  onClick={() => handleStatusButtonClick(selectedNotification, 'resolved')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
                    selectedNotification.status === 'resolved'
                      ? 'bg-emerald-500 text-neutral-950 border-emerald-400'
                      : 'bg-neutral-950 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/15'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تم الحل والمعالجة' : 'Mark Resolved'}</span>
                </button>

                <button
                  type="button"
                  data-testid="notification-action-dismiss-btn"
                  onClick={() => handleStatusButtonClick(selectedNotification, 'dismissed')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
                    selectedNotification.status === 'dismissed'
                      ? 'bg-neutral-200 text-neutral-950 border-white'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-700 hover:text-white'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تجاهل التنبيه' : 'Dismiss'}</span>
                </button>

                {selectedNotification.status !== 'active' && (
                  <button
                    type="button"
                    data-testid="notification-action-reopen-btn"
                    onClick={() => handleStatusButtonClick(selectedNotification, 'active')}
                    className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-rose-500/40 bg-neutral-950 text-rose-300 hover:bg-rose-500/15 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إعادة تفعيل كنشط' : 'Reopen Alert'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* NOTIFICATIONS COMPACT LIST VIEW */
          <div
            data-testid="notifications-bell-list"
            className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[52vh]"
          >
            {filteredList.length === 0 ? (
              <div className="p-8 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-center space-y-2">
                <Bell className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-sm font-bold text-neutral-300">
                  {isAr
                    ? 'لا توجد تنبيهات ضمن هذا التصنيف حالياً'
                    : 'No notifications in this filter right now'}
                </p>
                <p className="text-xs text-neutral-500">
                  {isAr
                    ? 'جميع المؤشرات التشغيلية والمخزون في حالة مستقرة.'
                    : 'All operational and inventory indicators are healthy.'}
                </p>
              </div>
            ) : (
              filteredList.map((item) => {
                const sevMeta = getSeverityBadge(item.severity);
                const statusMeta = getStatusLabel(item.status);
                return (
                  <div
                    key={item.id}
                    data-testid={`notification-bell-item-${item.id}`}
                    onClick={() => setSelectedId(item.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedId(item.id);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-amber-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${sevMeta.border}`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-400">
                          <span className={`font-bold ${sevMeta.cls}`}>{sevMeta.label}</span>
                          <span aria-hidden="true">·</span>
                          <span>{isAr ? item.categoryLabelAr : item.categoryLabelEn}</span>
                          <span aria-hidden="true">·</span>
                          <span className={`font-semibold ${statusMeta.cls}`}>
                            {isAr ? statusMeta.ar : statusMeta.en}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                          {isAr ? item.titleAr : item.titleEn}
                        </h4>
                        <p className="text-xs text-neutral-300 line-clamp-1">
                          {isAr ? item.summaryAr : item.summaryEn}
                        </p>
                        {item.resolutionNote && (
                          <p className="text-[11px] text-emerald-400 truncate">
                            {isAr ? `ملاحظة المعالجة: ${item.resolutionNote}` : `Note: ${item.resolutionNote}`}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800/80">
                      {item.metricBadge && (
                        <span className="font-mono text-xs font-bold text-amber-400 tabular-nums">
                          {item.metricBadge}
                        </span>
                      )}
                      <button
                        type="button"
                        data-testid={`notification-open-details-btn-${item.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(item.id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 border border-amber-500/40 text-xs font-bold transition-colors whitespace-nowrap"
                      >
                        {isAr ? 'التفاصيل والتعامل' : 'Details & Handle'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </AppModal>
  );
};
