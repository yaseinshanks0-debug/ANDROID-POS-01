/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { CheckoutView } from './components/checkout/CheckoutView';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProductsView } from './components/products/ProductsView';
import { InventoryView } from './components/inventory/InventoryView';
import { CustomersView } from './components/customers/CustomersView';
import { SalesView } from './components/sales/SalesView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { StatusBar, Style } from '@capacitor/status-bar';

function POSAppInner() {
  const { activeTab, setActiveTab } = usePOS();
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Initialize Capacitor Android status bar and hardware back button listener
  useEffect(() => {
    try {
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      StatusBar.setBackgroundColor({ color: '#090a0f' }).catch(() => {});
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
      {/* Top Header */}
      <AppHeader onOpenCart={() => setIsMobileCartOpen(true)} />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col overflow-x-hidden">
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
        {activeTab === 'reports' && <ReportsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

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
