import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import GlobalDrivers from './pages/GlobalDrivers';
import RiskMap from './pages/RiskMap';
import AdvisoryPage from './pages/AdvisoryPage';
import FarmerView from './pages/FarmerView';
import AlertGateway from './pages/AlertGateway';
import OfficerDashboard from './pages/OfficerDashboard';
import Methodology from './pages/Methodology';

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/drivers" element={<GlobalDrivers />} />
          <Route path="/map" element={<RiskMap />} />
          <Route path="/advisory" element={<AdvisoryPage />} />
          <Route path="/farmer" element={<FarmerView />} />
          <Route path="/alerts" element={<AlertGateway />} />
          <Route path="/officer" element={<OfficerDashboard />} />
          <Route path="/methodology" element={<Methodology />} />
        </Routes>
      </Layout>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
    </AppProvider>
  );
}
