import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Landing } from "./pages/Landing";
import { UnderConstruction } from "./pages/UnderConstruction";
import DashboardView from "./pages/DashboardView";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardView />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Landing />} />

      {["/threat-grid", "/api", "/alerts"].map((path) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute>
              <UnderConstruction />
            </ProtectedRoute>
          }
        />
      ))}

      {[
        "/docs",
        "/api-reference",
        "/blog",
        "/reports",
        "/privacy",
        "/terms",
        "/disclosure",
      ].map((path) => (
        <Route key={path} path={path} element={<UnderConstruction />} />
      ))}
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </AuthProvider>
  );
}

export default App;
