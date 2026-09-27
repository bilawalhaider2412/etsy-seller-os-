import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/common/Header.tsx';
import { Sidebar } from './components/common/Sidebar.tsx';
import { ToastContainer } from './components/common/Toast.tsx';
import { LandingPage } from './components/landing/LandingPage.tsx';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard.tsx';
import { ProductResearchView } from './components/research/ProductResearchView.tsx';
import { ProductIdeaGeneratorView } from './components/ideas/ProductIdeaGeneratorView.tsx';
import { ListingGeneratorView } from './components/generator/ListingGeneratorView.tsx';
import { ListingOptimizerView } from './components/optimizer/ListingOptimizerView.tsx';
import { KeywordResearchView } from './components/keywords/KeywordResearchView.tsx';
import { CompetitorAnalyzerView } from './components/competitors/CompetitorAnalyzerView.tsx';
import { MockupAssistantView } from './components/mockups/MockupAssistantView.tsx';
import { CustomerReplyAssistantView } from './components/replies/CustomerReplyAssistantView.tsx';
import { ProductLibraryView } from './components/library/ProductLibraryView.tsx';
import { AnalyticsView } from './components/analytics/AnalyticsView.tsx';
import { ShopAuditView } from './components/audit/ShopAuditView.tsx';
import { AdminDashboardView } from './components/admin/AdminDashboardView.tsx';
import { CanvaStudioView } from './components/canva/CanvaStudioView.tsx';
import { CopilotDrawer } from './components/copilot/CopilotDrawer.tsx';
import { OnboardingModal } from './components/onboarding/OnboardingModal.tsx';
import { BillingModal } from './components/billing/BillingModal.tsx';
import { EtsyConnectModal } from './components/etsy/EtsyConnectModal.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import { Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, setIsCopilotOpen, setIsBillingOpen } = useApp();

  // If on landing page tab, render landing page
  if (activeTab === 'landing') {
    return (
      <>
        <LandingPage />
        <AuthModal />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans overflow-hidden">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && <OverviewDashboard />}
          {activeTab === 'research' && <ProductResearchView />}
          {activeTab === 'ideas' && <ProductIdeaGeneratorView />}
          {activeTab === 'generator' && <ListingGeneratorView />}
          {activeTab === 'optimizer' && <ListingOptimizerView />}
          {activeTab === 'keywords' && <KeywordResearchView />}
          {activeTab === 'competitors' && <CompetitorAnalyzerView />}
          {activeTab === 'canva' && <CanvaStudioView />}
          {activeTab === 'mockups' && <MockupAssistantView />}
          {activeTab === 'replies' && <CustomerReplyAssistantView />}
          {activeTab === 'library' && <ProductLibraryView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'audit' && <ShopAuditView />}
          {activeTab === 'billing' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-extrabold">Plans &amp; Subscription</h1>
                  <p className="text-xs text-stone-500">Manage your subscription, limits, and billing.</p>
                </div>
                <button
                  onClick={() => setIsBillingOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs"
                >
                  Open Billing Portal
                </button>
              </div>
              <OverviewDashboard />
            </div>
          )}
          {activeTab === 'admin' && <AdminDashboardView />}
        </main>
      </div>

      {/* Persistent Floating "Ask Seller OS" trigger button */}
      <button
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white shadow-xl shadow-amber-500/30 hover:scale-105 transition-all flex items-center gap-2 font-bold text-xs group"
        title="Open AI CoPilot (Context-Aware)"
      >
        <Sparkles className="w-4 h-4 animate-pulse" />
        <span className="hidden md:inline">Ask Seller OS</span>
      </button>

      {/* Global Modals & Drawers */}
      <CopilotDrawer />
      <OnboardingModal />
      <BillingModal />
      <EtsyConnectModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
