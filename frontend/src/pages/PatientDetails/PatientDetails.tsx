import { useEffect, useState } from 'react';
import { ArrowLeft, Pencil, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import './PatientDetails.scss';
import { Badge, Button, Card } from '../../components/UI';
import { ClinicalEvolutionModal } from '../../components/ClinicalEvolutionModal/ClinicalEvolutionModal';
import {
    createClinicalEvolution,
    getClinicalEvolutionsByPatient,
} from '../../services/clinicalEvolutions';
import { getPatientById } from '../../services/patients';
import type { ClinicalEvolution, AttentionLevel } from '../../types/clinicalEvolution';
import type { ClinicalEvolutionFormData } from '../../types/clinicalEvolution';
import type { Patient, PatientStatus } from '../../types/patient';
import { formatDate, formatDateTime } from '../../utils/formatters';

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
    const [patient, setPatient] = useState<Patient | null>(null);
    const [patientEvolutions, setPatientEvolutions] = useState<ClinicalEvolution[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEvolutionModalOpen, setIsEvolutionModalOpen] = useState(false);

    useEffect(() => {
        async function loadPatientDetails() {
            try {
                setIsLoading(true);
                setError('');

                const [patientResponse, evolutionsResponse] = await Promise.all([
                    getPatientById(patientId),
                    getClinicalEvolutionsByPatient(patientId),
                ]);

                setPatient(patientResponse);
                setPatientEvolutions(evolutionsResponse.content);
            } catch {
                setError('Paciente não encontrado');
            } finally {
                setIsLoading(false);
            }
        }

        loadPatientDetails();
    }, [patientId]);

    async function handleCreateEvolution(data: ClinicalEvolutionFormData) {
        const newEvolution = await createClinicalEvolution({
            ...data,
            evolutionDate: new Date(data.evolutionDate).toISOString(),
        });

        setPatientEvolutions((currentEvolutions) => [newEvolution, ...currentEvolutions]);
    }

    if (isLoading || error || !patient) {
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
                    <h2>{isLoading ? 'Carregando paciente...' : error || 'Paciente não encontrado'}</h2>
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
                            <strong>{formatDate(patient.birthDate)}</strong>
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
                        onClick={() => setIsEvolutionModalOpen(true)}
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
                                            {formatDateTime(evolution.evolutionDate)} · {evolution.professionalName ?? 'Sem profissional'}
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

            <ClinicalEvolutionModal
                isOpen={isEvolutionModalOpen}
                onClose={() => setIsEvolutionModalOpen(false)}
                onCreateEvolution={handleCreateEvolution}
                patientId={patient.id}
                patientName={patient.name}
            />
        </div>
    );
}
