import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PrivacyModal } from './components/PrivacyModal';
import { LandingPage } from './pages/LandingPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { ResultPage } from './pages/ResultPage';
import { HospitalMapPage } from './pages/HospitalMapPage';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { ModelInsightsPage } from './pages/ModelInsightsPage';
import { AboutPage } from './pages/AboutPage';
import { PredictionResult, Hospital } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(null);
  const [selectedMapHospital, setSelectedMapHospital] = useState<Hospital | null>(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);

  const handleAssessmentComplete = (result: PredictionResult) => {
    setCurrentResult(result);
    setActiveTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMap = (hospital?: Hospital) => {
    if (hospital) {
      setSelectedMapHospital(hospital);
    }
    setActiveTab('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewAssessment = () => {
    setActiveTab('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'landing' && (
          <LandingPage
            onStartAssessment={() => setActiveTab('assessment')}
            onViewDashboard={() => setActiveTab('dashboard')}
            onViewInsights={() => setActiveTab('insights')}
          />
        )}

        {activeTab === 'assessment' && (
          <AssessmentPage onAssessmentComplete={handleAssessmentComplete} />
        )}

        {activeTab === 'result' && currentResult && (
          <ResultPage
            result={currentResult}
            onNewAssessment={handleNewAssessment}
            onOpenMap={handleOpenMap}
            onViewHistory={() => setActiveTab('history')}
          />
        )}

        {activeTab === 'result' && !currentResult && (
          <div className="text-center py-20 space-y-4">
            <p className="text-sm text-slate-400">No active patient assessment loaded.</p>
            <button
              onClick={handleNewAssessment}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors"
            >
              Start New Patient Assessment
            </button>
          </div>
        )}

        {activeTab === 'map' && (
          <HospitalMapPage
            selectedHospital={selectedMapHospital}
            onSelectHospital={(hosp) => setSelectedMapHospital(hosp)}
          />
        )}

        {activeTab === 'dashboard' && <DashboardPage />}

        {activeTab === 'history' && <HistoryPage />}

        {activeTab === 'insights' && <ModelInsightsPage />}

        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Privacy & Compliance Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}

export default App;
