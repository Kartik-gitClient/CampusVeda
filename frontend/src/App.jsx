import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { JuniorDash } from './pages/JuniorDash';
import { SeniorDash } from './pages/SeniorDash';
import { HODDash } from './pages/HODDash';
import { RoomsView } from './pages/RoomsView';
import { NewRequestView } from './pages/NewRequestView';
import { PremiseDashboard } from './pages/PremiseDashboard';
import { motion, AnimatePresence } from 'framer-motion';

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
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={isAuthenticated && user?.role ? <Navigate to={dashPath} replace /> : <Login />}
            />
            <Route
              path="/register"
              element={isAuthenticated && user?.role ? <Navigate to={dashPath} replace /> : <Register />}
            />

            {/* Protected Routes nested under MainLayout */}
            <Route element={<MainLayout />}>
              <Route
                path="/junior/*"
                element={
                  <ProtectedRoute allowedRoles={['junior']}>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                      <JuniorDash />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/senior/*"
                element={
                  <ProtectedRoute allowedRoles={['senior']}>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                      <SeniorDash />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hod/*"
                element={
                  <ProtectedRoute allowedRoles={['hod']}>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                      <HODDash />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rooms"
                element={
                  <ProtectedRoute>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                      <RoomsView />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requests/new"
                element={
                  <ProtectedRoute>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                      <NewRequestView />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/building-map"
                element={
                  <ProtectedRoute>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                      <PremiseDashboard />
                    </motion.div>
                  </ProtectedRoute>
                }
              />

              {/* Root redirect */}
              <Route path="/" element={<Navigate to={dashPath} replace />} />
            </Route>
          </Routes>
        </AnimatePresence>
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
