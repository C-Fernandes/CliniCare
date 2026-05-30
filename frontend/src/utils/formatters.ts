export function formatDate(date?: string | null) {
    if (!date) {
        return '-';
    }

    return new Date(date).toLocaleDateString('pt-BR', {
        timeZone: 'UTC',
    });
}

export function formatDateTime(date?: string | null) {
    if (!date) {
        return '-';
    }

    return new Date(date).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    });
}
