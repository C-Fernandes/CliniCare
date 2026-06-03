import { Badge } from '../../UI';

interface EvolutionItemProps {
    attention: string;
    attentionLabel: string;
    attentionTone: 'success' | 'warning' | 'danger';
    date: string;
    onClick: () => void;
    patient: string;
    professional: string;
    summary: string;
}

export function EvolutionItem({
    attention,
    attentionLabel,
    attentionTone,
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
                <Badge tone={attentionTone}>{attentionLabel}: {attention}</Badge>
            </div>

            <p className="evolution-item__meta">
                {date} · {professional}
            </p>

            <p className="evolution-item__summary">{summary}</p>
        </button>
    );
}
