import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/9100c-nxt" element={<Model9100NXT />} />
        <Route path="/ecg-holter" element={<ECGHolter />} />
        <Route path="/led-phototherapy" element={<LEDPhototherapy />} />
        <Route path="/mac-5" element={<MAC5 />} />
        <Route path="/sle6000" element={<SLE6000 />} />
        <Route path="/b1x5m-patient-monitors" element={<MonitorB1xM />} />
        <Route path="/lullaby-warmer" element={<LubbyWarmer />} />
        <Route path="/carestation-750" element={<CS750 />} />
        <Route path="/giraffe-omnibed-carestation" element={<GiraffeOmnibedCarestation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
