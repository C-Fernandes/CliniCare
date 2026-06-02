import { useEffect, useState } from 'react';
import { ArrowLeft, Pencil, Plus, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import './PatientDetails.scss';
import { Badge, Button, Card, Pagination } from '../../components/UI';
import { ClinicalEvolutionModal } from '../../components/ClinicalEvolutionModal/ClinicalEvolutionModal';
import { PatientModal } from '../../components/PatientModal/PatientModal';
import {
    createClinicalEvolution,
    getClinicalEvolutionsByPatient,
} from '../../services/clinicalEvolutions';
import { getPatientById, updatePatient } from '../../services/patients';
import { getApiError } from '../../services/api';
import { summarizePatient } from '../../services/patientSummaryAi';
import type { PatientSummaryAiResponse } from '../../services/patientSummaryAi';
import type { ClinicalEvolution, AttentionLevel } from '../../types/clinicalEvolution';
import type { ClinicalEvolutionFormData } from '../../types/clinicalEvolution';
import type { Patient, PatientFormData, PatientStatus } from '../../types/patient';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';

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
    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
    const [patientSummary, setPatientSummary] = useState<PatientSummaryAiResponse | null>(null);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [summaryError, setSummaryError] = useState('');
    const [historyPage, setHistoryPage] = useState(0);
    const [historyTotalPages, setHistoryTotalPages] = useState(0);
    const [historyTotalElements, setHistoryTotalElements] = useState(0);
    const { showToast } = useToast();

    useEffect(() => {
        async function loadPatientDetails() {
            try {
                setIsLoading(true);
                setError('');

                const [patientResponse, evolutionsResponse] = await Promise.all([
                    getPatientById(patientId),
                    getClinicalEvolutionsByPatient(patientId, { page: historyPage, size: 10 }),
                ]);

                setPatient(patientResponse);
                setPatientEvolutions(evolutionsResponse.content);
                setHistoryTotalPages(evolutionsResponse.totalPages);
                setHistoryTotalElements(evolutionsResponse.totalElements);
            } catch {
                const message = 'Paciente não encontrado';
                setError(message);
                showToast({ message, type: 'error' });
            } finally {
                setIsLoading(false);
            }
        }

        loadPatientDetails();
    }, [historyPage, patientId, showToast]);

    async function handleCreateEvolution(data: ClinicalEvolutionFormData) {
        try {
            const newEvolution = await createClinicalEvolution({
                ...data,
                evolutionDate: new Date(data.evolutionDate).toISOString(),
            });

            setPatientEvolutions((currentEvolutions) => [newEvolution, ...currentEvolutions]);
            showToast({ message: 'Evolução clínica criada com sucesso.', type: 'success' });
        } catch (requestError) {
            showToast({
                message: getApiError(requestError, 'Não foi possível criar a evolução clínica.'),
                type: 'error',
            });
            throw requestError;
        }
    }

    async function handleUpdatePatient(data: PatientFormData) {
        try {
            const updatedPatient = await updatePatient(patientId, data);
            setPatient(updatedPatient);
            showToast({ message: 'Paciente atualizado com sucesso.', type: 'success' });
        } catch (requestError) {
            showToast({
                message: getApiError(requestError, 'Não foi possível atualizar o paciente.'),
                type: 'error',
            });
            throw requestError;
        }
    }

    async function handleGenerateSummary() {
        try {
            setIsGeneratingSummary(true);
            setSummaryError('');
            setPatientSummary(await summarizePatient(patientId));
            showToast({ message: 'Resumo geral gerado com sucesso.', type: 'success' });
        } catch (requestError) {
            const message = getApiError(requestError, 'Não foi possível gerar o resumo geral.');
            setSummaryError(message);
            showToast({ message, type: 'error' });
        } finally {
            setIsGeneratingSummary(false);
        }
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
                        icon={<Sparkles size={18} />}
                        variant="secondary"
                        onClick={handleGenerateSummary}
                        disabled={isGeneratingSummary}
                    >
                        {isGeneratingSummary ? 'Gerando resumo...' : 'Resumo geral com IA'}
                    </Button>

                    <Button
                        className="patient-edit-button"
                        icon={<Pencil size={18} />}
                        variant="secondary"
                        onClick={() => setIsPatientModalOpen(true)}
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

            {(patientSummary || summaryError) && (
                <Card className="patient-ai-summary-card">
                    <div className="patient-ai-summary-card__header">
                        <div>
                            <h2>Resumo geral com Gemini</h2>
                            <p>Conteúdo de apoio. Revise as informações antes de tomar decisões clínicas.</p>
                        </div>

                        {patientSummary && (
                            <Badge tone={attentionTones[patientSummary.suggestedAttentionLevel]}>
                                Atenção sugerida: {attentionLabels[patientSummary.suggestedAttentionLevel]}
                            </Badge>
                        )}
                    </div>

                    {summaryError ? (
                        <p className="patient-ai-summary-card__error">{summaryError}</p>
                    ) : (
                        <>
                            <p>{patientSummary?.summary}</p>
                            <strong>Justificativa para revisão profissional</strong>
                            <p>{patientSummary?.justification}</p>
                        </>
                    )}

                    <small>Ao gerar este resumo, dados clínicos são enviados à API Gemini.</small>
                </Card>
            )}

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

                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="patient-history-empty">
                        Nenhuma evolução clínica registrada para este paciente.
                    </div>
                )}

                <Pagination
                    page={historyPage}
                    totalPages={historyTotalPages}
                    totalElements={historyTotalElements}
                    onPageChange={setHistoryPage}
                />
            </Card>

            <ClinicalEvolutionModal
                isOpen={isEvolutionModalOpen}
                onClose={() => setIsEvolutionModalOpen(false)}
                onCreateEvolution={handleCreateEvolution}
                patientId={patient.id}
                patientName={patient.name}
            />

            <PatientModal
                key={`${patient.id}-${isPatientModalOpen}`}
                isOpen={isPatientModalOpen}
                onClose={() => setIsPatientModalOpen(false)}
                onSavePatient={handleUpdatePatient}
                patient={patient}
            />
        </div>
    );
}
