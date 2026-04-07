import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { DashboardPage } from '../../pages/DashboardPage';
import { DocumentTemplateEditorPage } from '../../pages/DocumentTemplateEditorPage';
import { DocumentTemplateManagementPage } from '../../pages/DocumentTemplateManagementPage';
import { DocumentJournalPage } from '../../pages/DocumentJournalPage';
import { LoginPage } from '../../pages/LoginPage';
import { SystemSettingsPage } from '../../pages/SystemSettingsPage';
import { ComingSoonPage } from '../../pages/ComingSoonPage';
import { AccessDeniedPage } from '../../pages/AccessDeniedPage';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { useMenuStore } from '../../features/navigation/store/useMenuStore';
import { Box, CircularProgress } from '@mui/material';
import { findMenuItemByPath } from '../../features/navigation/constants/menuTree';

const systemSettingsRoles = ['ROLE_ADMIN', 'ROLE-SYSTEM_ADMIN'];
const emptyRoles: string[] = [];

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  userRoles: string[];
  requiredRoles?: string[];
  element: ReactNode;
}

function ProtectedRoute({
  isAuthenticated,
  userRoles,
  requiredRoles,
  element,
}: ProtectedRouteProps) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const canAccess = requiredRoles.some((role) => userRoles.includes(role));

    if (!canAccess) {
      return <Navigate to="/access-denied" replace />;
    }
  }

  return <>{element}</>;
}

function ComingSoonRoute({
  isAuthenticated,
  userRoles,
}: {
  isAuthenticated: boolean;
  userRoles: string[];
}) {
  const { pathname } = useLocation();
  const menuItem = findMenuItemByPath(pathname);
  const requiredRoles = menuItem?.allowedRoles ?? [];

  return (
    <ProtectedRoute
      isAuthenticated={isAuthenticated}
      userRoles={userRoles}
      requiredRoles={requiredRoles}
      element={<ComingSoonPage />}
    />
  );
}

export function AppRouter() {
  const { pathname } = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRoles = useAuthStore((state) => state.user?.roles ?? emptyRoles);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const syncMenuByPath = useMenuStore((state) => state.syncMenuByPath);

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated) {
      return;
    }

    syncMenuByPath(pathname);
  }, [hasHydrated, isAuthenticated, pathname, syncMenuByPath]);

  if (!hasHydrated) {
    return (
      <Box
        sx={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRoles={userRoles}
            element={<DashboardPage />}
          />
        }
      />
      <Route
        path="/haccp-docs/templates"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRoles={userRoles}
            element={<DocumentTemplateManagementPage />}
          />
        }
      />
      <Route
        path="/haccp-docs/templates/:templateId/editor"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRoles={userRoles}
            element={<DocumentTemplateEditorPage />}
          />
        }
      />
      <Route
        path="/haccp-docs/documents"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRoles={userRoles}
            element={<DocumentJournalPage />}
          />
        }
      />
      <Route
        path="/haccp-docs/prerequisite-check"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRoles={userRoles}
            element={<Navigate to="/haccp-docs/templates" replace />}
          />
        }
      />
      <Route
        path="/system-settings/users"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRoles={userRoles}
            requiredRoles={systemSettingsRoles}
            element={<SystemSettingsPage />}
          />
        }
      />
      <Route
        path="/system-settings"
        element={<Navigate to="/system-settings/users" replace />}
      />
      <Route
        path="/coming-soon/:section/:feature"
        element={
          <ComingSoonRoute
            isAuthenticated={isAuthenticated}
            userRoles={userRoles}
          />
        }
      />
      <Route
        path="/access-denied"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            userRoles={userRoles}
            element={<AccessDeniedPage />}
          />
        }
      />
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
        }
      />
    </Routes>
  );
}
