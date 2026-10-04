import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/pages/Home';
import Games from './components/pages/Games';
import ActivityFeed from './components/pages/ActivityFeed';
import CommunicationBoard from './components/pages/CommunicationBoard';
import AccessibilitySettings from './components/pages/AccessibilitySettings';
import NoggimigoChat from './components/pages/NoggimigoChat';
import { AccessibilityProvider } from './lib/AccessibilityContext';
import '../index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AccessibilityProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student" element={<ActivityFeed />} />
          <Route path="/games" element={<Games />} />
          <Route path="/chat" element={<NoggimigoChat />} />
          <Route path="/communication" element={<CommunicationBoard />} />
          <Route path="/settings" element={<AccessibilitySettings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AccessibilityProvider>
  </React.StrictMode>
);
