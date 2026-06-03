import { createContext } from 'react';

export type AppLanguage = 'pt' | 'en';
export type AppTheme = 'light' | 'dark';

export interface PreferencesContextValue {
    language: AppLanguage;
    theme: AppTheme;
    setLanguage: (language: AppLanguage) => void;
    toggleTheme: () => void;
    t: (key: string, options?: Record<string, unknown>) => string;
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);
