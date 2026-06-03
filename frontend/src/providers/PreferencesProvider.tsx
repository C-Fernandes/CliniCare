import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import {
    PreferencesContext,
    type AppLanguage,
    type AppTheme,
} from '../contexts/preferences-context';

const LANGUAGE_STORAGE_KEY = 'clinicare-language';
const THEME_STORAGE_KEY = 'clinicare-theme';

function getStoredLanguage(): AppLanguage {
    const language = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return language === 'en' || language === 'pt' ? language : 'pt';
}

function getStoredTheme(): AppTheme {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    return theme === 'dark' || theme === 'light' ? theme : 'light';
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
    const { i18n, t } = useTranslation();
    const [language, setLanguageState] = useState<AppLanguage>(() => getStoredLanguage());
    const [theme, setTheme] = useState<AppTheme>(() => getStoredTheme());

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        i18n.changeLanguage(language);
    }, [i18n, language]);

    const value = useMemo(
        () => ({
            language,
            theme,
            setLanguage: setLanguageState,
            toggleTheme: () => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light')),
            t: (key: string, options?: Record<string, unknown>) => t(key, options),
        }),
        [language, t, theme]
    );

    return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
