import type { ReactNode } from 'react';

import { Card } from '../Card/Card';
import './DataTable.scss';

interface DataTableProps {
    children: ReactNode;
    empty?: ReactNode;
    isEmpty?: boolean;
    minWidth?: number;
    tableClassName?: string;
    wrapperClassName?: string;
}

export function DataTable({
    children,
    empty,
    isEmpty = false,
    minWidth = 900,
    tableClassName = '',
    wrapperClassName = '',
}: DataTableProps) {
    return (
        <Card className={`table-card ${wrapperClassName}`.trim()}>
            <table className={`data-table ${tableClassName}`.trim()} style={{ minWidth }}>
                {children}
            </table>

            {isEmpty && empty ? <div className="table-empty">{empty}</div> : null}
        </Card>
    );
}
