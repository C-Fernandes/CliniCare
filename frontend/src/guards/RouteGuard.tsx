import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/auth';

interface RouteGuardProps {
    publicOnly?: boolean;
    allowedRoles?: UserRole[];
}

export function RouteGuard({
    publicOnly = false,
    allowedRoles,
}: RouteGuardProps) {
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();

    if (publicOnly && isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    if (!publicOnly && !isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}