import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Selada from './pages/Selada/Selada';
import Cabai from './pages/Cabai/Cabai';
import Melon from './pages/Melon/Melon';

import Zona1cabai from './Zona/Zonacabai/Zona1cabai';
import Zona2cabai from './Zona/Zonacabai/Zona2cabai';
import Zona3cabai from './Zona/Zonacabai/Zona3cabai';
import Zona4cabai from './Zona/Zonacabai/Zona4cabai';
import Zona5cabai from './Zona/Zonacabai/Zona5cabai';
import Zona6cabai from './Zona/Zonacabai/Zona6cabai';

import Zona1melon from './Zona/Zonamelon/Zona1melon';
import Zona2melon from './Zona/Zonamelon/Zona2melon';
import Zona3melon from './Zona/Zonamelon/Zona3melon';
import Zona4melon from './Zona/Zonamelon/Zona4melon';
import Zona5melon from './Zona/Zonamelon/Zona5melon';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/selada" element={<Selada />} />
        <Route path="/cabai" element={<Cabai />} />
        <Route path="/melon" element={<Melon />} />
        
        {/* Cabai Zone Routes - Fixed paths */}
        <Route path="/cabai/zona1" element={<Zona1cabai />} /> 
        <Route path="/cabai/zona2" element={<Zona2cabai />} />
        <Route path="/cabai/zona3" element={<Zona3cabai />} />
        <Route path="/cabai/zona4" element={<Zona4cabai />} />
        <Route path="/cabai/zona5" element={<Zona5cabai />} />
        <Route path="/cabai/zona6" element={<Zona6cabai />} />
        {/* //Melon Zone Routes - Ready for future implementation// */}
        <Route path="/melon/zona1" element={<Zona1melon />} /> 
        <Route path="/melon/zona2" element={<Zona2melon />} />
        <Route path="/melon/zona3" element={<Zona3melon />} />
        <Route path="/melon/zona4" element={<Zona4melon />} />
        <Route path="/melon/zona5" element={<Zona5melon />} />
        
      </Routes>
    </Router>
  );
}

export default App;