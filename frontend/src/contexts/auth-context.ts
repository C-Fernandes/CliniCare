import { createContext } from 'react';

import type { AuthUser, LoginRequest } from '../types/auth';

export interface AuthContextData {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => void;
}

export const AUTH_STORAGE_KEY = '@clinicare:user';

export const AuthContext = createContext<AuthContextData | undefined>(
    undefined
);