import { Badge } from '../../UI';

interface EvolutionItemProps {
    attention: string;
    date: string;
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
    patient,
    professional,
    summary,
}: EvolutionItemProps) {
    return (
        <div className="evolution-item">
            <div className="evolution-item__header">
                <strong>{patient}</strong>
                <Badge tone={attentionTones[attention]}>Atenção: {attention}</Badge>
            </div>

            <p className="evolution-item__meta">
                {date} · {professional}
            </p>

            <p className="evolution-item__summary">{summary}</p>
        </div>
    );
}
