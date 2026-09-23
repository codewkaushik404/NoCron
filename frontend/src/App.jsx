import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import { useAuth } from "./state/useAuth.js";

export default function App() {
  const { checkSession } = useAuth();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}