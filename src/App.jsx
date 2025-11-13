import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HealthPage from "./pages/HealthPage";
import DepositsPage from "./pages/DepositsPage";
import WithdrawalsPage from "./pages/WithdrawalsPage";
import MembersPage from "./pages/MembersPage";
import HistoryPage from "./pages/HistoryPage";
import BanksPage from "./pages/BanksPage";
import LoginPage from "./pages/LoginPage"; // halaman login

// Komponen pembungkus untuk rute yang butuh login
function PrivateRoute({ children }) {
  const token = localStorage.getItem("admin_token");
  if (!token) {
    // kalau belum login → paksa ke /login
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute login TIDAK butuh token */}
        <Route path="/login" element={<LoginPage />} />

        {/* Semua rute lain harus lewat PrivateRoute */}
        <Route
          path="/health"
          element={
            <PrivateRoute>
              <HealthPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/deposits"
          element={
            <PrivateRoute>
              <DepositsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/withdrawals"
          element={
            <PrivateRoute>
              <WithdrawalsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/members"
          element={
            <PrivateRoute>
              <MembersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <HistoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/banks"
          element={
            <PrivateRoute>
              <BanksPage />
            </PrivateRoute>
          }
        />

        {/* default: kalau buka root "/" → arahkan ke /health (tapi lewat PrivateRoute juga) */}
        <Route
          path="/"
          element={<Navigate to="/health" replace />}
        />

        {/* wildcard: kalau route nggak dikenal */}
        <Route path="*" element={<Navigate to="/health" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
