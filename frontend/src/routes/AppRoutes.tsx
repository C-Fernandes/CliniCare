import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Login } from '../pages/Login/Login';
import { Register } from '../pages/Register/Register';
import { ForgotPassword } from '../pages/ForgotPassword/ForgotPassword';
import { ResetPassword } from '../pages/ResetPassword/ResetPassword';
import { PendingApproval } from '../pages/PendingApproval/PendingApproval';
import { AppLayout } from '../layouts/appLayout/AppLayout';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { Patients } from '../pages/Patients/Patients';
import { Notifications } from '../pages/Notifications/Notifications';
import { Users } from '../pages/Users/Users';
import { Profile } from '../pages/Profile/Profile';
import { PatientDetails } from '../pages/PatientDetails/PatientDetails';
import { RouteGuard } from '../guards/RouteGuard';

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route element={<RouteGuard publicOnly />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/pending-approval" element={<PendingApproval />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
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
