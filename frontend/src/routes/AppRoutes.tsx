import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Login } from '../pages/login/Login';
import { AppLayout } from '../layouts/appLayout/AppLayout';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { Patients } from '../pages/patients/Patients';
import { Notifications } from '../pages/notifications/Notifications';
import { Users } from '../pages/users/Users';
import { Profile } from '../pages/profile/Profile';
import { PatientDetails } from '../pages/PatientDetails/PatientDetails';
import { RouteGuard } from '../guards/RouteGuard';

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route element={<RouteGuard publicOnly />}>
                    <Route path="/login" element={<Login />} />
                </Route>

                <Route element={<RouteGuard />}>
                    <Route element={<AppLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />

                        <Route path="/patients" element={<Patients />} />
                        <Route path="/patients/:id" element={<PatientDetails />} />

                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/profile" element={<Profile />} />

                        <Route element={<RouteGuard allowedRoles={['ADMIN']} />}>
                            <Route path="/users" element={<Users />} />
                        </Route>
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}