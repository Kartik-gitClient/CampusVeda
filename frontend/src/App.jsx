import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login';
import { JuniorDash } from './pages/JuniorDash';
import { SeniorDash } from './pages/SeniorDash';
import { HODDash } from './pages/HODDash';

// Map backend role → dashboard path
const ROLE_PATHS = {
  junior: '/junior',
  senior: '/senior',
  hod: '/hod',
};

// Map backend role → valid allowed route keys
const ROLE_FALLBACKS = {
  junior: '/junior',
  senior: '/senior',
  hod: '/hod',
};

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={ROLE_FALLBACKS[user?.role] || '/login'} replace />;
  }
  return children;
}

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dashPath = (isAuthenticated && user?.role) ? (ROLE_PATHS[user.role] || '/login') : '/login';

  return (
    <>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route
            path="/login"
            element={isAuthenticated && user?.role ? <Navigate to={dashPath} replace /> : <Login />}
          />

          {/* Protected Routes nested under MainLayout */}
          <Route element={<MainLayout />}>
            <Route
              path="/junior/*"
              element={
                <ProtectedRoute allowedRoles={['junior']}>
                  <JuniorDash />
                </ProtectedRoute>
              }
            />
            <Route
              path="/senior/*"
              element={
                <ProtectedRoute allowedRoles={['senior']}>
                  <SeniorDash />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hod/*"
              element={
                <ProtectedRoute allowedRoles={['hod']}>
                  <HODDash />
                </ProtectedRoute>
              }
            />

            {/* Root redirect */}
            <Route path="/" element={<Navigate to={dashPath} replace />} />
          </Route>
        </Routes>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#ffffff', color: '#000000', border: '1px solid #e5e7eb' }
        }}
      />
    </>
  );
}

export default App;
