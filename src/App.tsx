/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { CheckoutView } from './components/checkout/CheckoutView';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProductsView } from './components/products/ProductsView';
import { InventoryView } from './components/inventory/InventoryView';
import { CustomersView } from './components/customers/CustomersView';
import { SalesView } from './components/sales/SalesView';
import { ExpensesView } from './components/expenses/ExpensesView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { TrainingTourOverlay } from './components/tour/TrainingTourOverlay';
import { UnmetDemandCaptureModal } from './components/analytics/UnmetDemandCaptureModal';
import { PracticeModeBanner } from './components/onboarding/PracticeModeBanner';
import { FirstRunOnboardingModal } from './components/onboarding/FirstRunOnboardingModal';
import { LoginScreen } from './components/auth/LoginScreen';
import { ViewErrorBoundary } from './components/ui/ViewErrorBoundary';
import { shouldShowLoginGate } from './lib/local-auth';
import { StatusBar, Style } from '@capacitor/status-bar';

function POSAppInner() {
  const {
    settings,
    workspaceMode,
    isAuthenticated,
    isScreenLocked,
    pendingSwitchUserId,
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

  const isMobileCartOpenRef = useRef(isMobileCartOpen);
  isMobileCartOpenRef.current = isMobileCartOpen;
  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

  // Initialize Capacitor Android status bar strictly once on mount
  useEffect(() => {
    try {
      StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      StatusBar.setBackgroundColor({ color: '#090a0f' }).catch(() => {});
      StatusBar.show().catch(() => {});
    } catch {}
  }, []);

  // Android hardware back button handler registered once using latest state refs
  useEffect(() => {
    const handleBackButton = () => {
      if (isMobileCartOpenRef.current) {
        setIsMobileCartOpen(false);
      } else if (activeTabRef.current !== 'checkout') {
        setActiveTab('checkout');
      }
    };

    window.addEventListener('popstate', handleBackButton);
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [setActiveTab]);

  const showLoginGate = shouldShowLoginGate({
    workspaceMode,
    isAuthenticated,
    isScreenLocked,
    requireLoginOnStartup: settings.requireLoginOnStartup !== false,
  });

  if (showLoginGate) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans select-none">
        <LoginScreen mode="fullscreen" />
        <FirstRunOnboardingModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans select-none">
      {/* Persistent Practice Mode Top Indicator & Controls (visible only in Practice Mode) */}
      <PracticeModeBanner />

      {/* Top Header */}
      <AppHeader onOpenCart={() => setIsMobileCartOpen(true)} />

      {/* Main View Router with Scoped Error Boundary */}
      <main className="flex-1 flex flex-col overflow-x-hidden">
        <ViewErrorBoundary language={settings.language} resetKey={activeTab}>
          {activeTab === 'checkout' && (
            <CheckoutView
              isCartDrawerOpen={isMobileCartOpen}
              onCloseCartDrawer={() => setIsMobileCartOpen(false)}
            />
          )}
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'products' && <ProductsView />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'customers' && <CustomersView />}
          {activeTab === 'sales' && <SalesView />}
          {activeTab === 'expenses' && <ExpensesView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'settings' && <SettingsView />}
        </ViewErrorBoundary>
      </main>

      {/* Fast Customer Unmet Demand Request Capture Modal */}
      {isUnmetDemandModalOpen && (
        <ViewErrorBoundary language={settings.language} resetKey="unmet-demand-modal">
          <UnmetDemandCaptureModal />
        </ViewErrorBoundary>
      )}

      {/* Authenticated User Switch Modal */}
      {pendingSwitchUserId && <LoginScreen mode="switch-user" />}

      {/* First-Run Onboarding, Practice Mode & Company Workspace Modal */}
      <FirstRunOnboardingModal />

      {/* Interactive Guided Training Tour Overlay */}
      {isTrainingTourOpen && (
        <ViewErrorBoundary language={settings.language} resetKey="training-tour-overlay">
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
        </ViewErrorBoundary>
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
