import { ChevronLeft, ChevronRight } from 'lucide-react';

import './Pagination.scss';
import { Button } from '../Button/Button';
import { usePreferences } from '../../../hooks/usePreferences';

interface PaginationProps {
    page: number;
    totalPages: number;
    totalElements: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, totalElements, onPageChange }: PaginationProps) {
    const { t } = usePreferences();

    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav className="pagination" aria-label={t('pagination.label')}>
            <span>{t('pagination.summary', { page: page + 1, totalPages, totalElements })}</span>
            <div>
                <Button
                    icon={<ChevronLeft size={16} />}
                    size="sm"
                    variant="secondary"
                    disabled={page === 0}
                    onClick={() => onPageChange(page - 1)}
                >
                    {t('actions.previous')}
                </Button>
                <Button
                    icon={<ChevronRight size={16} />}
                    size="sm"
                    variant="secondary"
                    disabled={page + 1 >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    {t('actions.next')}
                </Button>
            </div>
        </nav>
    );
}
