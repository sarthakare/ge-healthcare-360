import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Model9100NXT from './pages/Model9100NXT';
import ECGHolter from './pages/ECGHolter';
import LEDPhototherapy from './pages/LEDPhototherapy';
import MAC5 from './pages/MAC5';
import SLE6000 from './pages/SLE6000';
import MonitorB1xM from './pages/MonitorB1xM';
import LubbyWarmer from './pages/LubbyWarmer';
import CS750 from './pages/CS750';
import GiraffeOmnibedCarestation from './pages/GiraffeOmnibedCarestation';
import Login from './pages/Login';
import AdminUsers from './pages/AdminUsers';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import './App.css';

const PAGE_TITLES = {
  '/': 'Home',
  '/login': 'Sign in',
  '/admin/users': 'Manage users',
  '/9100c-nxt': '9100C NXT',
  '/ecg-holter': 'ECG Holter',
  '/led-phototherapy': 'LED Phototherapy',
  '/mac-5': 'MAC 5',
  '/sle6000': 'SLE6000',
  '/b1x5m-patient-monitors': 'B1x5M Patient Monitors',
  '/lullaby-warmer': 'Lullaby Warmer',
  '/carestation-750': 'Carestation 750',
  '/giraffe-omnibed-carestation': 'Giraffe Omnibed Carestation',
};

function PageTitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const pageName = PAGE_TITLES[location.pathname] || 'GE HealthCare 360';
    document.title = `GE HealthCare - ${pageName}`;
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <PageTitleUpdater />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
          <Route path="/" element={<Home />} />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route path="/9100c-nxt" element={<Model9100NXT />} />
          <Route path="/ecg-holter" element={<ECGHolter />} />
          <Route path="/led-phototherapy" element={<LEDPhototherapy />} />
          <Route path="/mac-5" element={<MAC5 />} />
          <Route path="/sle6000" element={<SLE6000 />} />
          <Route path="/b1x5m-patient-monitors" element={<MonitorB1xM />} />
          <Route path="/lullaby-warmer" element={<LubbyWarmer />} />
          <Route path="/carestation-750" element={<CS750 />} />
          <Route path="/giraffe-omnibed-carestation" element={<GiraffeOmnibedCarestation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
