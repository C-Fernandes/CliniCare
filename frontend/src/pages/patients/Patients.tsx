import { useEffect, useState, type KeyboardEvent } from 'react';
import { Pencil, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { PatientModal } from '../../components/PatientModal/PatientModal';
import { Badge, Button, DataTable, IconButton, Pagination } from '../../components/UI';

import './Patients.scss';
import type { Patient, PatientFormData, PatientStatus } from '../../types/patient';
import { createPatient, getPatients, updatePatient } from '../../services/patients';
import { getApiError } from '../../services/api';
import { formatCpf, formatDate } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';
import { usePreferences } from '../../hooks/usePreferences';

const statusTones: Record<PatientStatus, 'cyan' | 'danger' | 'success' | 'neutral'> = {
    IN_FOLLOW_UP: 'cyan',
    URGENT: 'danger',
    DISCHARGED: 'success',
    PAUSED: 'neutral',
};

export function Patients() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<PatientStatus | 'ALL'>('ALL');
    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { t } = usePreferences();

    useEffect(() => {
        async function loadPatients() {
            try {
                setIsLoading(true);
                setError('');
                const response = await getPatients({
                    page,
                    size: 10,
                    name: search || undefined,
                    status: status === 'ALL' ? undefined : status,
                });
                setPatients(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } catch {
                const message = t('patients.loadError');
                setError(message);
                showToast({ message, type: 'error' });
            } finally {
                setIsLoading(false);
            }
        }

        loadPatients();
    }, [page, search, showToast, status, t]);

    async function handleSavePatient(data: PatientFormData) {
        try {
            if (selectedPatient) {
                const updatedPatient = await updatePatient(selectedPatient.id, data);
                setPatients((currentPatients) =>
                    currentPatients.map((patient) =>
                        patient.id === updatedPatient.id ? updatedPatient : patient
                    )
                );
                showToast({ message: t('patients.patientUpdated'), type: 'success' });
                return;
            }

            const newPatient = await createPatient(data);
            setPatients((currentPatients) => [newPatient, ...currentPatients]);
            showToast({ message: t('patients.patientCreated'), type: 'success' });
        } catch (requestError) {
            showToast({
                message: getApiError(requestError, t('patients.saveError')),
                type: 'error',
            });
            throw requestError;
        }
    }

    function openCreatePatientModal() {
        setSelectedPatient(null);
        setIsPatientModalOpen(true);
    }

    function openEditPatientModal(patient: Patient) {
        setSelectedPatient(patient);
        setIsPatientModalOpen(true);
    }

    function openPatientDetails(patientId: number) {
        navigate(`/patients/${patientId}`);
    }

    function handlePatientRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, patientId: number) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openPatientDetails(patientId);
        }
    }

    function closePatientModal() {
        setSelectedPatient(null);
        setIsPatientModalOpen(false);
    }

    return (
        <div className="patients-page">
            <section className="patients-toolbar">
                <div className="patients-search">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder={t('patients.searchByName')}
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(0);
                        }}
                    />
                </div>

                <select
                    className="patients-filter"
                    value={status}
                    onChange={(event) => {
                        setStatus(event.target.value as PatientStatus | 'ALL');
                        setPage(0);
                    }}
                >
                    <option value="ALL">{t('patients.allStatuses')}</option>
                    <option value="IN_FOLLOW_UP">{t('status.IN_FOLLOW_UP')}</option>
                    <option value="URGENT">{t('status.URGENT')}</option>
                    <option value="DISCHARGED">{t('status.DISCHARGED')}</option>
                    <option value="PAUSED">{t('status.PAUSED')}</option>
                </select>

                <Button
                    className="patients-new-button"
                    icon={<Plus size={18} />}
                    type="button"
                    onClick={openCreatePatientModal}
                >
                    {t('actions.newPatient')}
                </Button>
            </section>

            <DataTable
                empty={isLoading ? t('common.loadingPatients') : error || t('patients.noResults')}
                isEmpty={isLoading || Boolean(error) || patients.length === 0}
                minWidth={1000}
                tableClassName="patients-table"
                wrapperClassName="patients-table-card"
            >
                <thead>
                    <tr>
                        <th>{t('patients.name')}</th>
                        <th>CPF</th>
                        <th>{t('patients.birthDate')}</th>
                        <th>{t('patients.phone')}</th>
                        <th>{t('common.email')}</th>
                        <th>{t('patients.status')}</th>
                        <th>{t('patients.createdAt')}</th>
                        <th>{t('patients.actions')}</th>
                    </tr>
                </thead>

                <tbody>
                    {patients.map((patient) => (
                        <tr
                            key={patient.id}
                            aria-label={`${t('patients.openDetails')} ${patient.name}`}
                            className="patients-table-row"
                            onClick={() => openPatientDetails(patient.id)}
                            onKeyDown={(event) => handlePatientRowKeyDown(event, patient.id)}
                            role="button"
                            tabIndex={0}
                        >
                            <td>
                                <strong>{patient.name}</strong>
                            </td>

                            <td>{formatCpf(patient.cpf)}</td>
                            <td>{formatDate(patient.birthDate)}</td>
                            <td>{patient.phone}</td>
                            <td>{patient.email}</td>

                            <td>
                                <Badge tone={statusTones[patient.status]}>
                                    {t(`status.${patient.status}`)}
                                </Badge>
                            </td>

                            <td>{formatDate(patient.createdAt)}</td>

                            <td>
                                <div className="patients-actions">
                                    <IconButton
                                        label={t('actions.editPatient')}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            openEditPatientModal(patient);
                                        }}
                                    >
                                        <Pencil size={18} />
                                    </IconButton>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </DataTable>

            <Pagination page={page} totalPages={totalPages} totalElements={totalElements} onPageChange={setPage} />

            <PatientModal
                key={selectedPatient?.id ?? 'new'}
                isOpen={isPatientModalOpen}
                onClose={closePatientModal}
                onSavePatient={handleSavePatient}
                patient={selectedPatient}
            />
        </div>
    );
}
