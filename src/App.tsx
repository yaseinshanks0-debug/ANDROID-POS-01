/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { CheckoutView } from './components/checkout/CheckoutView';
import { PracticeModeBanner } from './components/onboarding/PracticeModeBanner';
import { FirstRunOnboardingModal } from './components/onboarding/FirstRunOnboardingModal';
import { ViewSkeleton } from './components/ui/ViewSkeleton';
import { StatusBar, Style } from '@capacitor/status-bar';

// Lazy-load secondary views and heavy overlays for fast initial load & code splitting
const DashboardView = lazy(() =>
  import('./components/dashboard/DashboardView').then((m) => ({ default: m.DashboardView }))
);
const ProductsView = lazy(() =>
  import('./components/products/ProductsView').then((m) => ({ default: m.ProductsView }))
);
const InventoryView = lazy(() =>
  import('./components/inventory/InventoryView').then((m) => ({ default: m.InventoryView }))
);
const CustomersView = lazy(() =>
  import('./components/customers/CustomersView').then((m) => ({ default: m.CustomersView }))
);
const SalesView = lazy(() =>
  import('./components/sales/SalesView').then((m) => ({ default: m.SalesView }))
);
const ExpensesView = lazy(() =>
  import('./components/expenses/ExpensesView').then((m) => ({ default: m.ExpensesView }))
);
const ReportsView = lazy(() =>
  import('./components/reports/ReportsView').then((m) => ({ default: m.ReportsView }))
);
const SettingsView = lazy(() =>
  import('./components/settings/SettingsView').then((m) => ({ default: m.SettingsView }))
);
const TrainingTourOverlay = lazy(() =>
  import('./components/tour/TrainingTourOverlay').then((m) => ({ default: m.TrainingTourOverlay }))
);
const UnmetDemandCaptureModal = lazy(() =>
  import('./components/analytics/UnmetDemandCaptureModal').then((m) => ({
    default: m.UnmetDemandCaptureModal,
  }))
);

function POSAppInner() {
  const {
    activeTab,
    setActiveTab,
    isTrainingTourOpen,
    trainingTourStepIndex,
    trainingTourProgress,
    selectTrainingTourStep,
    nextTrainingTourStep,
    prevTrainingTourStep,
    finishTrainingTour,
    closeTrainingTour,
    resetTrainingTour,
    isUnmetDemandModalOpen,
  } = usePOS();
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Initialize Capacitor Android status bar and hardware back button listener
  useEffect(() => {
    try {
      StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      StatusBar.setBackgroundColor({ color: '#090a0f' }).catch(() => {});
      StatusBar.show().catch(() => {});
    } catch {}

    // Android hardware back button handler
    const handleBackButton = () => {
      if (isMobileCartOpen) {
        setIsMobileCartOpen(false);
      } else if (activeTab !== 'checkout') {
        setActiveTab('checkout');
      }
    };

    window.addEventListener('popstate', handleBackButton);
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [isMobileCartOpen, activeTab, setActiveTab]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans select-none">
      {/* Persistent Practice Mode Top Indicator & Controls (visible only in Practice Mode) */}
      <PracticeModeBanner />

      {/* Top Header */}
      <AppHeader onOpenCart={() => setIsMobileCartOpen(true)} />

      {/* Main View Router with Skeleton Loading Suspense Boundary */}
      <main className="flex-1 flex flex-col overflow-x-hidden">
        {activeTab === 'checkout' && (
          <CheckoutView
            isCartDrawerOpen={isMobileCartOpen}
            onCloseCartDrawer={() => setIsMobileCartOpen(false)}
          />
        )}
        <Suspense fallback={<ViewSkeleton />}>
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'products' && <ProductsView />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'customers' && <CustomersView />}
          {activeTab === 'sales' && <SalesView />}
          {activeTab === 'expenses' && <ExpensesView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'settings' && <SettingsView />}
        </Suspense>
      </main>

      {/* Fast Customer Unmet Demand Request Capture Modal (Lazy-loaded on demand) */}
      {isUnmetDemandModalOpen && (
        <Suspense fallback={null}>
          <UnmetDemandCaptureModal />
        </Suspense>
      )}

      {/* First-Run Onboarding, Practice Mode & Company Workspace Modal */}
      <FirstRunOnboardingModal />

      {/* Interactive Guided Training Tour Overlay (Lazy-loaded on demand) */}
      {isTrainingTourOpen && (
        <Suspense fallback={null}>
          <TrainingTourOverlay
            isOpen={isTrainingTourOpen}
            currentStepIndex={trainingTourStepIndex}
            progress={trainingTourProgress}
            onSelectStep={selectTrainingTourStep}
            onNext={nextTrainingTourStep}
            onPrev={prevTrainingTourStep}
            onFinish={finishTrainingTour}
            onClose={closeTrainingTour}
            onResetProgress={resetTrainingTour}
          />
        </Suspense>
      )}

      {/* Fixed Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

export default function App() {
  return (
    <POSProvider>
      <POSAppInner />
    </POSProvider>
  );
}
