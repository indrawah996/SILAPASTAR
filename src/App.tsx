import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidFrame } from './components/AndroidFrame';
import { AppHeader } from './components/AppHeader';
import { BottomNavBar } from './components/BottomNavBar';
import { NavigationDrawer } from './components/NavigationDrawer';
import { LoginModal } from './components/LoginModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { SplashScreen } from './components/SplashScreen';

// Screens
import { BerandaScreen } from './components/screens/BerandaScreen';
import { KondisiWbpScreen } from './components/screens/KondisiWbpScreen';
import { JadwalScreen } from './components/screens/JadwalScreen';
import { DetailWbpDiLuarScreen } from './components/screens/DetailWbpDiLuarScreen';
import { DetailReguScreen } from './components/screens/DetailReguScreen';
import { SpreadsheetPiketScreen } from './components/screens/SpreadsheetPiketScreen';
import { RekapitulasiScreen } from './components/screens/RekapitulasiScreen';
import { UserManagementScreen } from './components/screens/UserManagementScreen';

const MainAppContent: React.FC = () => {
  const { currentScreen, setCurrentScreen, activeTab, setActiveTab } = useApp();
  const [showSplash, setShowSplash] = useState(true);

  const getHeaderProps = () => {
    if (currentScreen === 'detail_wbp_di_luar') {
      return {
        showBack: true,
        onBack: () => setCurrentScreen('main'),
        title: 'SILAPASTAR',
        subtitle: 'LAPAS KELAS IIA TARAKAN',
      };
    }
    if (currentScreen === 'detail_regu') {
      return {
        showBack: true,
        onBack: () => setCurrentScreen('main'),
        title: 'SILAPASTAR',
        subtitle: 'LAPAS KELAS IIA TARAKAN',
      };
    }
    if (currentScreen === 'spreadsheet') {
      return {
        showBack: true,
        onBack: () => setCurrentScreen('main'),
        title: 'DATABASE PIKET',
        subtitle: 'LAPAS KELAS IIA TARAKAN',
      };
    }
    if (currentScreen === 'rekapitulasi') {
      return {
        showBack: true,
        onBack: () => setCurrentScreen('main'),
        title: 'REKAPITULASI & LOG',
        subtitle: 'LAPAS KELAS IIA TARAKAN',
      };
    }
    if (currentScreen === 'users') {
      return {
        showBack: true,
        onBack: () => setCurrentScreen('main'),
        title: 'MANAJEMEN PENGGUNA',
        subtitle: 'LAPAS KELAS IIA TARAKAN',
      };
    }

    return {
      showBack: false,
      title: 'SILAPASTAR',
      subtitle: 'LAPAS KELAS IIA TARAKAN',
    };
  };

  const headerProps = getHeaderProps();

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <AppHeader
        showBack={headerProps.showBack}
        onBack={headerProps.onBack}
        title={headerProps.title}
        subtitle={headerProps.subtitle}
      />

      <main className="flex-1 px-4 pt-3 overflow-y-auto">
        {currentScreen === 'detail_wbp_di_luar' && <DetailWbpDiLuarScreen />}
        {currentScreen === 'detail_regu' && <DetailReguScreen />}
        {currentScreen === 'spreadsheet' && <SpreadsheetPiketScreen />}
        {currentScreen === 'rekapitulasi' && <RekapitulasiScreen />}
        {currentScreen === 'users' && <UserManagementScreen />}

        {currentScreen === 'main' && (
          <>
            {activeTab === 'beranda' && <BerandaScreen />}
            {activeTab === 'kondisi' && <KondisiWbpScreen />}
            {activeTab === 'jadwal' && <JadwalScreen />}
            {activeTab === 'lainnya' && <RekapitulasiScreen />}
          </>
        )}
      </main>

      <BottomNavBar />
      <NavigationDrawer />
      <LoginModal />
      <ApkDownloadModal />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AndroidFrame>
        <MainAppContent />
      </AndroidFrame>
    </AppProvider>
  );
}
