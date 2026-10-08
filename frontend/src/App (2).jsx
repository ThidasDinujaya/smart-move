import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MaintenanceManagement from './pages/MaintenanceManagement';
import AddMaintenance from './pages/AddMaintenance';
import FeedbackReviews from './pages/FeedbackReviews';
import ReportsDashboard from './pages/ReportsDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/maintenance" />} />
        <Route path="/maintenance" element={<MaintenanceManagement />} />
        <Route path="/maintenance/add" element={<AddMaintenance />} />
        <Route path="/feedback" element={<FeedbackReviews />} />
        <Route path="/reports" element={<ReportsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;