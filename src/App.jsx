import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'sonner';
import { EmergencyProvider, useEmergency } from './context/EmergencyContext';
import DashboardLayout from './components/layout/DashboardLayout';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PatientDashboard from './pages/PatientDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import EmergencyDetailsPage from './pages/EmergencyDetailsPage';
import MeshMonitorPage from './pages/MeshMonitorPage';
import AmbulancePage from './pages/AmbulancePage';
import PatientProfilePage from './pages/PatientProfilePage';
import SettingsPage from './pages/SettingsPage';

function RoleRoute({ allowedRoles, children }) {
  const { role } = useEmergency();
  if (!allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />;
  }
  return children;
}

export default function App() {
  return (
    <EmergencyProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<DashboardLayout />}>
            <Route
              path="/patient"
              element={<RoleRoute allowedRoles={['patient']}><PatientDashboard /></RoleRoute>}
            />
            <Route
              path="/profile"
              element={<RoleRoute allowedRoles={['patient']}><PatientProfilePage /></RoleRoute>}
            />
            <Route
              path="/volunteer"
              element={<RoleRoute allowedRoles={['volunteer']}><VolunteerDashboard /></RoleRoute>}
            />
            <Route
              path="/hospital"
              element={<RoleRoute allowedRoles={['hospital']}><HospitalDashboard /></RoleRoute>}
            />
            <Route
              path="/emergencies/:id"
              element={<RoleRoute allowedRoles={['hospital']}><EmergencyDetailsPage /></RoleRoute>}
            />
            <Route
              path="/ambulances"
              element={<RoleRoute allowedRoles={['hospital']}><AmbulancePage /></RoleRoute>}
            />
            <Route path="/mesh-monitor" element={<MeshMonitorPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </EmergencyProvider>
  );
}