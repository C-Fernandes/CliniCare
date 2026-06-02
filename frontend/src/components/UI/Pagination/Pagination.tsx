import { ChevronLeft, ChevronRight } from 'lucide-react';

import './Pagination.scss';
import { Button } from '../Button/Button';

interface PaginationProps {
    page: number;
    totalPages: number;
    totalElements: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, totalElements, onPageChange }: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav className="pagination" aria-label="Paginação">
            <span>Página {page + 1} de {totalPages} · {totalElements} registros</span>
            <div>
                <Button
                    icon={<ChevronLeft size={16} />}
                    size="sm"
                    variant="secondary"
                    disabled={page === 0}
                    onClick={() => onPageChange(page - 1)}
                >
                    Anterior
                </Button>
                <Button
                    icon={<ChevronRight size={16} />}
                    size="sm"
                    variant="secondary"
                    disabled={page + 1 >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    Próxima
                </Button>
            </div>
        </nav>
    );
}
