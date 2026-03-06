import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";

// Demo screens
import Login from "./screens/Login";
import Home from "./screens/Home";
import Onboarding from "./screens/Onboarding";
import Insights from "./screens/Insights";
import Analysis from "./screens/Analysis";
import Replay from "./screens/Replay";
import Portfolio from "./screens/Portfolio";
import Memo from "./screens/Memo";

// Layouts
import AdminLayout from "./components/AdminLayout";
import RMLayout from "./components/RMLayout";

// Admin screens
import AdminDashboard from "./screens/admin/Dashboard";
import AdminRMList from "./screens/admin/RMList";
import AdminRMDetail from "./screens/admin/RMDetail";
import AdminRMNew from "./screens/admin/RMNew";
import AdminClientList from "./screens/admin/ClientList";
import AdminClientDetail from "./screens/admin/ClientDetail";
import AdminClientNew from "./screens/admin/ClientNew";
import AdminSessions from "./screens/admin/Sessions";
import AdminPortfolios from "./screens/admin/Portfolios";
import AdminSettings from "./screens/admin/Settings";

// RM screens
import RMClients from "./screens/rm/RMClients";
import RMClientNew from "./screens/rm/RMClientNew";
import RMClientDetail from "./screens/rm/RMClientDetail";
import RMSessions from "./screens/rm/RMSessions";

// ── Route guard ───────────────────────────────────────────────────────────────
function ProtectedRoute({ role, children }) {
  const { user } = useApp();

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "rm") return <Navigate to="/home" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}

// ── Routes ───────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* RM demo flow */}
      <Route
        path="/home"
        element={<ProtectedRoute role="rm"><Home /></ProtectedRoute>}
      />
      <Route
        path="/onboarding"
        element={<ProtectedRoute role="rm"><Onboarding /></ProtectedRoute>}
      />
      <Route
        path="/insights"
        element={<ProtectedRoute role="rm"><Insights /></ProtectedRoute>}
      />
      <Route
        path="/analysis"
        element={<ProtectedRoute role="rm"><Analysis /></ProtectedRoute>}
      />
      <Route
        path="/replay"
        element={<ProtectedRoute role="rm"><Replay /></ProtectedRoute>}
      />
      <Route
        path="/portfolio"
        element={<ProtectedRoute role="rm"><Portfolio /></ProtectedRoute>}
      />
      <Route
        path="/memo"
        element={<ProtectedRoute role="rm"><Memo /></ProtectedRoute>}
      />

      {/* RM management panel */}
      <Route
        path="/rm"
        element={<ProtectedRoute role="rm"><RMLayout /></ProtectedRoute>}
      >
        <Route index element={<Navigate to="/rm/clients" replace />} />
        <Route path="clients" element={<RMClients />} />
        <Route path="clients/new" element={<RMClientNew />} />
        <Route path="clients/:id" element={<RMClientDetail />} />
        <Route path="sessions" element={<RMSessions />} />
      </Route>

      {/* Admin panel */}
      <Route
        path="/admin"
        element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="rms" element={<AdminRMList />} />
        <Route path="rms/new" element={<AdminRMNew />} />
        <Route path="rms/:id" element={<AdminRMDetail />} />
        <Route path="clients" element={<AdminClientList />} />
        <Route path="clients/new" element={<AdminClientNew />} />
        <Route path="clients/:id" element={<AdminClientDetail />} />
        <Route path="sessions" element={<AdminSessions />} />
        <Route path="portfolios" element={<AdminPortfolios />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
