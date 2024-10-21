import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ScheduleCreator from './components/ScheduleCreator';
import ErrorBoundary from './components/ErrorBoundary';
import { EmployeeProvider } from './context/EmployeeContext';

function App() {
  return (
    <ErrorBoundary>
      <EmployeeProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/schedule" element={<ScheduleCreator />} />
        </Routes>
      </EmployeeProvider>
    </ErrorBoundary>
  );
}

export default App;