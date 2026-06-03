export function onlyDigits(value?: string | null) {
    return value?.replace(/\D/g, '') ?? '';
}

const APP_TIME_ZONE = 'America/Fortaleza';

export function formatCpf(value?: string | null) {
    const digits = onlyDigits(value).slice(0, 11);

    if (digits.length <= 3) {
        return digits;
    }

    if (digits.length <= 6) {
        return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }

    if (digits.length <= 9) {
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    }

    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function parseDate(date: string) {
    const normalizedDate = date.replace(/\[[^\]]+\]$/, '');

    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    }

    return new Date(normalizedDate);
}

export function formatDate(date?: string | null) {
    if (!date) {
        return '-';
    }

    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(date);

    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: isDateOnly ? 'UTC' : APP_TIME_ZONE,
    }).format(parseDate(date));
}

export function formatDateTime(date?: string | null) {
    if (!date) {
        return '-';
    }

    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: APP_TIME_ZONE,
    }).format(parseDate(date));
}

export function getLocalDateInputValue(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function getLocalTimeInputValue(date = new Date()) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
}

export function buildFortalezaZonedDateTime(date: string, time: string) {
    return `${date}T${time}:00-03:00[${APP_TIME_ZONE}]`;
}
