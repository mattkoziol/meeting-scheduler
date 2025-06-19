import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AvailabilityForm from './pages/AvailabilityForm';
import Confirmation from './pages/Confirmation';
import Results from './pages/Results';

function App() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/availability" element={<AvailabilityForm onSubmitted={() => setSubmitted(true)} />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/results" element={<Results />} />
        <Route path="/" element={<Navigate to="/availability" />} />
      </Routes>
      {submitted && <Navigate to="/confirmation" replace />}
    </Router>
  );
}

export default App;
