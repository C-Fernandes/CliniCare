import { ArrowLeft, Pencil, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import './PatientDetails.scss';
import { Badge, Button, Card } from '../../components/ui';

type PatientStatus =
    | 'IN_FOLLOW_UP'
    | 'URGENT'
    | 'DISCHARGED'
    | 'PAUSED';

type AttentionLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface Patient {
    id: number;
    name: string;
    cpf: string;
    birthDate: string;
    phone: string;
    email: string;
    status: PatientStatus;
    notes: string;
}

interface ClinicalEvolution {
    id: number;
    patientId: number;
    date: string;
    professional: string;
    summary: string;
    description: string;
    conduct: string;
    attentionLevel: AttentionLevel;
}

const patientsMock: Patient[] = [
    {
        id: 1,
        name: 'Maria Silva',
        cpf: '123.456.789-00',
        birthDate: '15/03/1995',
        phone: '(84) 99999-9999',
        email: 'maria@email.com',
        status: 'IN_FOLLOW_UP',
        notes: 'Paciente em acompanhamento semanal.',
    },
    {
        id: 2,
        name: 'João Pereira',
        cpf: '987.654.321-00',
        birthDate: '22/07/1988',
        phone: '(11) 98888-7777',
        email: 'joao.pereira@email.com',
        status: 'URGENT',
        notes: 'Quadro depressivo agudo, requer atenção contínua.',
    },
    {
        id: 3,
        name: 'Beatriz Almeida',
        cpf: '456.789.123-00',
        birthDate: '04/11/2001',
        phone: '(21) 97777-6666',
        email: 'bia.almeida@email.com',
        status: 'DISCHARGED',
        notes: 'Paciente recebeu alta.',
    },
];

const evolutionsMock: ClinicalEvolution[] = [
    {
        id: 1,
        patientId: 2,
        date: '25/05/2026',
        professional: 'Dr. Pedro Henrique',
        summary: 'Piora do quadro depressivo com ideação passiva.',
        description:
            'Paciente apresenta piora significativa do quadro depressivo, com ideação passiva. Necessita acompanhamento próximo.',
        conduct: 'Encaminhamento para psiquiatra e acompanhamento semanal.',
        attentionLevel: 'HIGH',
    },
    {
        id: 2,
        patientId: 1,
        date: '28/05/2026',
        professional: 'Dra. Ana Costa',
        summary: 'Melhora parcial dos sintomas ansiosos.',
        description:
            'Paciente relatou melhora parcial dos sintomas de ansiedade e maior adesão às orientações.',
        conduct: 'Manter acompanhamento semanal.',
        attentionLevel: 'MEDIUM',
    },
];

const statusLabels: Record<PatientStatus, string> = {
    IN_FOLLOW_UP: 'Em acompanhamento',
    URGENT: 'Urgente',
    DISCHARGED: 'Alta',
    PAUSED: 'Pausado',
};

const attentionLabels: Record<AttentionLevel, string> = {
    LOW: 'Baixo',
    MEDIUM: 'Médio',
    HIGH: 'Alto',
};

const statusTones: Record<PatientStatus, 'cyan' | 'danger' | 'success' | 'neutral'> = {
    IN_FOLLOW_UP: 'cyan',
    URGENT: 'danger',
    DISCHARGED: 'success',
    PAUSED: 'neutral',
};

const attentionTones: Record<AttentionLevel, 'success' | 'warning' | 'danger'> = {
    LOW: 'success',
    MEDIUM: 'warning',
    HIGH: 'danger',
};

export function PatientDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const patientId = Number(id);

    const patient = patientsMock.find((item) => item.id === patientId);

    const patientEvolutions = evolutionsMock.filter(
        (evolution) => evolution.patientId === patientId
    );

    if (!patient) {
        return (
            <div className="patient-details-page">
                <button
                    type="button"
                    className="patient-details-back"
                    onClick={() => navigate('/patients')}
                >
                    <ArrowLeft size={18} />
                    Pacientes
                </button>

                <Card className="patient-details-card">
                    <h2>Paciente não encontrado</h2>
                </Card>
            </div>
        );
    }

    return (
        <div className="patient-details-page">
            <button
                type="button"
                className="patient-details-back"
                onClick={() => navigate('/patients')}
            >
                <ArrowLeft size={18} />
                Pacientes
            </button>

            <Card className="patient-details-card">
                <div className="patient-details-card__content">
                    <div className="patient-details-card__header">
                        <h2>{patient.name}</h2>

                        <Badge
                            className={`patient-status patient-status--${patient.status.toLowerCase()}`}
                            tone={statusTones[patient.status]}
                        >
                            {statusLabels[patient.status]}
                        </Badge>
                    </div>

                    <div className="patient-details-info">
                        <div>
                            <span>CPF</span>
                            <strong>{patient.cpf}</strong>
                        </div>

                        <div>
                            <span>Data de nascimento</span>
                            <strong>{patient.birthDate}</strong>
                        </div>

                        <div>
                            <span>Telefone</span>
                            <strong>{patient.phone}</strong>
                        </div>

                        <div>
                            <span>Email</span>
                            <strong>{patient.email}</strong>
                        </div>
                    </div>

                    <div className="patient-details-notes">
                        <span>Observações</span>
                        <p>{patient.notes || 'Nenhuma observação registrada.'}</p>
                    </div>
                </div>

                <div className="patient-details-actions">
                    <Button
                        className="patient-edit-button"
                        icon={<Pencil size={18} />}
                        variant="secondary"
                    >
                        Editar paciente
                    </Button>

                    <Button
                        className="patient-new-evolution-button"
                        icon={<Plus size={18} />}
                    >
                        Nova evolução clínica
                    </Button>
                </div>
            </Card>

            <Card className="patient-history-card">
                <h2>Histórico clínico</h2>

                {patientEvolutions.length > 0 ? (
                    <div className="patient-history-timeline">
                        {patientEvolutions.map((evolution) => (
                            <article className="patient-history-item" key={evolution.id}>
                                <div className="patient-history-item__dot" />

                                <div className="patient-history-item__card">
                                    <div className="patient-history-item__header">
                                        <strong>
                                            {evolution.date} · {evolution.professional}
                                        </strong>

                                        <Badge
                                            className={`attention-badge attention-badge--${evolution.attentionLevel.toLowerCase()}`}
                                            tone={attentionTones[evolution.attentionLevel]}
                                        >
                                            Atenção: {attentionLabels[evolution.attentionLevel]}
                                        </Badge>
                                    </div>

                                    <p className="patient-history-item__summary">
                                        "{evolution.summary}"
                                    </p>

                                    <div className="patient-history-item__details">
                                        <div>
                                            <span>Evolução</span>
                                            <p>{evolution.description}</p>
                                        </div>

                                        <div>
                                            <span>Conduta</span>
                                            <p>{evolution.conduct}</p>
                                        </div>
                                    </div>

                                    <button type="button" className="patient-history-link">
                                        Ver detalhes
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="patient-history-empty">
                        Nenhuma evolução clínica registrada para este paciente.
                    </div>
                )}
            </Card>
        </div>
    );
}
