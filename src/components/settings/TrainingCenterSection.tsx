/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { usePOS } from '../../context/POSContext';
import {
  TRAINING_TOUR_STEPS,
  calculateTourCompletionPercent,
  isTourStepAccessibleForUser,
} from '../../lib/training-tour';
import { AppCard } from '../ui/AppCard';
import { TactileButton } from '../ui/TactileButton';
import {
  GraduationCap,
  Play,
  CheckCircle2,
  RotateCcw,
  Compass,
  FlaskConical,
  Building2,
  ClipboardCheck,
  Lock,
} from 'lucide-react';
import { playTactileClick } from '../../lib/sound-fx';

export const TrainingCenterSection: React.FC = () => {
  const {
    settings,
    currentUser,
    workspaceMode,
    currentCompany,
    trainingTourProgress,
    startTrainingTour,
    resetTrainingTour,
    enterPracticeMode,
    exitPracticeMode,
    openOnboardingModal,
    onboardingChecklist,
  } = usePOS();
  const isAr = settings.language === 'ar';

  const completionPercent = calculateTourCompletionPercent(
    trainingTourProgress,
    TRAINING_TOUR_STEPS
  );

  const checklistItems = [
    {
      id: 'companyProfileConfigured',
      done: onboardingChecklist.companyProfileConfigured,
      labelEn: '1. Company Profile Configured',
      labelAr: '1. إعداد ملف الشركة والبيانات القانونية',
    },
    {
      id: 'currenciesConfigured',
      done: onboardingChecklist.currenciesConfigured,
      labelEn: '2. Base Currency (SDG) & Exchange Rates Set',
      labelAr: '2. ضبط العملة الأساسية (SDG) وأسعار الصرف',
    },
    {
      id: 'branchCreated',
      done: onboardingChecklist.branchCreated,
      labelEn: '3. Initial Main Branch Created',
      labelAr: '3. إنشاء الفرع الرئيسي للشركة',
    },
    {
      id: 'firstProductsAdded',
      done: onboardingChecklist.firstProductsAdded,
      labelEn: '4. Product Catalog & Barcodes Added',
      labelAr: '4. إضافة الأصناف والمنتجات والباركود',
    },
    {
      id: 'firstEmployeeCreated',
      done: onboardingChecklist.firstEmployeeCreated,
      labelEn: '5. Employee Accounts & Roles Configured',
      labelAr: '5. إنشاء حسابات الموظفين وتخصيص الأدوار',
    },
    {
      id: 'firstSaleCompleted',
      done: onboardingChecklist.firstSaleCompleted,
      labelEn: '6. First POS Sale Completed',
      labelAr: '6. إتمام أول عملية بيع عبر الكاشير',
    },
    {
      id: 'inventoryReviewed',
      done: onboardingChecklist.inventoryReviewed,
      labelEn: '7. Inventory & Stock Movements Reviewed',
      labelAr: '7. مراجعة المخزون وحركات الجرد والتوريد',
    },
    {
      id: 'guidedTourCompleted',
      done: onboardingChecklist.guidedTourCompleted,
      labelEn: '8. 13-Step Guided Tour Completed',
      labelAr: '8. إتمام الجولة الإرشادية الشاملة (13 قسماً)',
    },
  ];

  return (
    <AppCard
      data-testid="training-center-section"
      className="space-y-5 bg-neutral-900/95 border-neutral-800 p-5 sm:p-6"
    >
      {/* Header & Action Toolbar (div:nth-of-type(2) > div:nth-of-type(1) in SettingsView) */}
      <div className="flex flex-col gap-4 pb-4 border-b border-neutral-800/90">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  {isAr
                    ? 'مركز التدريب والتأسيس والجولة التعريفية'
                    : 'Onboarding & Guided Training Center'}
                </h3>
                <span className="text-neutral-600" aria-hidden="true">
                  ·
                </span>
                <span
                  className={`text-xs font-bold ${
                    workspaceMode === 'PRACTICE' ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {workspaceMode === 'PRACTICE'
                    ? isAr
                      ? 'وضع التدريب التجريبي'
                      : 'Practice Mode'
                    : isAr
                      ? currentCompany.displayNameAr || currentCompany.displayName
                      : currentCompany.displayName}
                </span>
              </div>
              <p className="text-xs text-neutral-400 tabular-nums">
                {isAr ? (
                  <>
                    نسبة إتمام التدريب:{' '}
                    <span className="font-mono font-bold text-amber-400">{completionPercent}%</span> ·{' '}
                    <span className="font-mono font-bold text-neutral-200">
                      {trainingTourProgress.completedStepIds.length}
                    </span>{' '}
                    من{' '}
                    <span className="font-mono font-bold text-neutral-200">
                      {TRAINING_TOUR_STEPS.length}
                    </span>{' '}
                    قسماً مكتملاً
                  </>
                ) : (
                  <>
                    Tour Completion:{' '}
                    <span className="font-mono font-bold text-amber-400">{completionPercent}%</span> ·{' '}
                    <span className="font-mono font-bold text-neutral-200">
                      {trainingTourProgress.completedStepIds.length}
                    </span>{' '}
                    of{' '}
                    <span className="font-mono font-bold text-neutral-200">
                      {TRAINING_TOUR_STEPS.length}
                    </span>{' '}
                    modules completed
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Primary Guided Tour CTA */}
          <div className="flex items-center gap-2 shrink-0">
            {trainingTourProgress.completedStepIds.length > 0 && (
              <TactileButton
                variant="secondary"
                size="sm"
                data-testid="settings-reset-tour-btn"
                onClick={() => {
                  playTactileClick(settings.soundEnabled);
                  resetTrainingTour();
                }}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                className="whitespace-nowrap"
              >
                {isAr ? 'إعادة الضبط' : 'Reset'}
              </TactileButton>
            )}
            <TactileButton
              variant="amber"
              size="sm"
              data-testid="settings-start-full-tour-btn"
              onClick={() => {
                playTactileClick(settings.soundEnabled);
                startTrainingTour(0);
              }}
              leftIcon={<Play className="w-3.5 h-3.5" />}
              className="whitespace-nowrap"
            >
              {isAr ? 'بدء الجولة التدريبية الشاملة' : 'Start Full Guided Tour'}
            </TactileButton>
          </div>
        </div>

        {/* Secondary Workspace & Company Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-neutral-800/60">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              data-testid="settings-toggle-practice-mode-btn"
              onClick={() => {
                playTactileClick(settings.soundEnabled);
                if (workspaceMode === 'PRACTICE') {
                  exitPracticeMode();
                } else {
                  enterPracticeMode();
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-neutral-950 hover:bg-amber-500/15 border border-neutral-800 hover:border-amber-500/40 text-amber-300 text-xs font-bold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <FlaskConical className="w-3.5 h-3.5 shrink-0" />
              <span>
                {workspaceMode === 'PRACTICE'
                  ? isAr
                    ? 'الخروج من وضع التدريب'
                    : 'Exit Practice Mode'
                  : isAr
                    ? 'دخول وضع التدريب التجريبي'
                    : 'Enter Practice Mode'}
              </span>
            </button>

            <button
              type="button"
              data-testid="settings-open-company-wizard-btn"
              onClick={() => {
                playTactileClick(settings.soundEnabled);
                openOnboardingModal('create-company');
              }}
              className="px-3.5 py-2 rounded-xl bg-neutral-950 hover:bg-emerald-500/15 border border-neutral-800 hover:border-emerald-500/40 text-emerald-300 text-xs font-bold inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>{isAr ? 'تأسيس شركة جديدة' : 'Create New Company'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-56">
            <div className="flex-1 h-1.5 rounded-full bg-neutral-950 border border-neutral-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-400 tabular-nums shrink-0">
              {completionPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Live 8-Item Onboarding Checklist Card */}
      <div
        data-testid="onboarding-checklist-card"
        className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/90 space-y-3.5"
      >
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <h4 className="text-xs sm:text-sm font-bold text-neutral-100">
              {isAr
                ? 'قائمة التحقق من جاهزية الشركة والتأسيس'
                : 'Company Setup & Operational Readiness Checklist'}
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
            {onboardingChecklist.completedCount} / {onboardingChecklist.totalCount} ·{' '}
            {onboardingChecklist.completionPercent}%
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${onboardingChecklist.completionPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {checklistItems.map((item) => (
            <div
              key={item.id}
              data-testid={`checklist-item-${item.id}`}
              className={`px-3 py-2.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold leading-snug transition-colors ${
                item.done
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-300'
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${
                  item.done ? 'text-emerald-400' : 'text-neutral-600'
                }`}
              />
              <span>{isAr ? item.labelAr : item.labelEn}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of all 13 Interactive Training Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {TRAINING_TOUR_STEPS.map((step, idx) => {
          const isCompleted = trainingTourProgress.completedStepIds.includes(step.id);
          const isAccessible = isTourStepAccessibleForUser(step, currentUser);
          return (
            <button
              key={step.id}
              type="button"
              data-testid={`settings-launch-tour-step-${idx + 1}`}
              onClick={() => {
                playTactileClick(settings.soundEnabled);
                startTrainingTour(idx);
              }}
              className="p-3.5 rounded-2xl bg-neutral-950/70 hover:bg-neutral-900 border border-neutral-800/90 hover:border-amber-500/40 text-start transition-all flex items-start justify-between gap-3 group"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-start gap-1.5 text-xs font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <span>{isAr ? step.titleAr : step.titleEn}</span>
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                  {isAr ? step.subtitleAr : step.subtitleEn}
                </p>
                {!isAccessible && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-semibold pt-0.5">
                    <Lock className="w-3 h-3" />
                    <span>{isAr ? 'حسب صلاحية الدور' : 'Role-restricted view'}</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold text-amber-400 shrink-0 pt-0.5 whitespace-nowrap">
                {isAr ? 'ابدأ ←' : 'Start →'}
              </span>
            </button>
          );
        })}
      </div>
    </AppCard>
  );
};
