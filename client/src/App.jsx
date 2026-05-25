import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Spinner from './components/ui/Spinner';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TaskListPage = lazy(() => import('./pages/TaskListPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

/**
 * Layout wrapper that shows Navbar for authenticated pages.
 */
function AuthenticatedLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

/**
 * Redirects authenticated users away from auth pages.
 */
function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <DashboardPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <TaskListPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <SettingsPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <Suspense fallback={<Spinner className="py-24" size="lg" />}>
            <AppRoutes />
          </Suspense>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
