import { useState, type ReactNode } from 'react';

import { login as loginRequest } from '../services/auth';
import type { AuthUser, LoginRequest } from '../types/auth';
import { AUTH_STORAGE_KEY, AuthContext } from '../contexts/auth-context';

interface AuthProviderProps {
    children: ReactNode;
}

function getStoredUser(): AuthUser | null {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser) as AuthUser;
    } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

    async function login(data: LoginRequest) {
        const response = await loginRequest(data);

        const loggedUser: AuthUser = {
            userId: response.userId,
            name: response.name,
            email: response.email,
            role: response.role,
            token: response.token,
        };

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
        setUser(loggedUser);
    }

    function logout() {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
