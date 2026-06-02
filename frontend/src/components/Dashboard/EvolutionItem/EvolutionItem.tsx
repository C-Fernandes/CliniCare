import { Badge } from '../../UI';

interface EvolutionItemProps {
    attention: string;
    date: string;
    onClick: () => void;
    patient: string;
    professional: string;
    summary: string;
}

const attentionTones: Record<string, 'success' | 'warning' | 'danger'> = {
    Baixo: 'success',
    Médio: 'warning',
    Alto: 'danger',
};

export function EvolutionItem({
    attention,
    date,
    onClick,
    patient,
    professional,
    summary,
}: EvolutionItemProps) {
    return (
        <button className="evolution-item dashboard-link-item" onClick={onClick} type="button">
            <div className="evolution-item__header">
                <strong>{patient}</strong>
                <Badge tone={attentionTones[attention]}>Atenção: {attention}</Badge>
            </div>

            <p className="evolution-item__meta">
                {date} · {professional}
            </p>

            <p className="evolution-item__summary">{summary}</p>
        </button>
    );
}
