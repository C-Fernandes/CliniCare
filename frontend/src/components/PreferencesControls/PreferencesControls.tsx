import { Languages, Moon, Sun } from 'lucide-react';

import { usePreferences } from '../../hooks/usePreferences';

interface PreferencesControlsProps {
    className?: string;
}

export function PreferencesControls({ className = 'login-preferences' }: PreferencesControlsProps) {
    const { language, setLanguage, t, theme, toggleTheme } = usePreferences();

    return (
        <div className={className}>
            <button
                aria-label={theme === 'light' ? t('theme.dark') : t('theme.light')}
                className={`${className}__button`}
                onClick={toggleTheme}
                title={theme === 'light' ? t('theme.dark') : t('theme.light')}
                type="button"
            >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <label className={`${className}__language`}>
                <Languages size={16} />
                <select
                    aria-label="Language"
                    value={language}
                    onChange={(event) => setLanguage(event.target.value === 'en' ? 'en' : 'pt')}
                >
                    <option value="pt">PT</option>
                    <option value="en">EN</option>
                </select>
            </label>
        </div>
    );
}
