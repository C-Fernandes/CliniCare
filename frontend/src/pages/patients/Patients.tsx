import { useEffect, useMemo, useState } from 'react';
import { Eye, Pencil, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { PatientModal } from '../../components/PatientModal/PatientModal';
import { Badge, Button, DataTable, IconButton } from '../../components/UI';

import './Patients.scss';
import type { Patient, PatientFormData, PatientStatus } from '../../types/patient';
import { createPatient, getPatients } from '../../services/patients';
import { formatDate } from '../../utils/formatters';

const statusLabels: Record<PatientStatus, string> = {
    IN_FOLLOW_UP: 'Em acompanhamento',
    URGENT: 'Urgente',
    DISCHARGED: 'Alta',
    PAUSED: 'Pausado',
};

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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function loadPatients() {
            try {
                setIsLoading(true);
                setError('');
                const response = await getPatients();
                setPatients(response.content);
            } catch {
                setError('Não foi possível carregar os pacientes.');
            } finally {
                setIsLoading(false);
            }
        }

        loadPatients();
    }, []);

    const filteredPatients = useMemo(() => {
        return patients.filter((patient) => {
            const matchesName = patient.name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesStatus = status === 'ALL' || patient.status === status;

            return matchesName && matchesStatus;
        });
    }, [patients, search, status]);

    async function handleCreatePatient(data: PatientFormData) {
        const newPatient = await createPatient(data);

        setPatients((currentPatients) => [newPatient, ...currentPatients]);
    }

    return (
        <div className="patients-page">
            <section className="patients-toolbar">
                <div className="patients-search">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                <select
                    className="patients-filter"
                    value={status}
                    onChange={(event) =>
                        setStatus(event.target.value as PatientStatus | 'ALL')
                    }
                >
                    <option value="ALL">Todos os status</option>
                    <option value="IN_FOLLOW_UP">Em acompanhamento</option>
                    <option value="URGENT">Urgente</option>
                    <option value="DISCHARGED">Alta</option>
                    <option value="PAUSED">Pausado</option>
                </select>

                <Button
                    className="patients-new-button"
                    icon={<Plus size={18} />}
                    type="button"
                    onClick={() => setIsPatientModalOpen(true)}
                >
                    Novo paciente
                </Button>
            </section>

            <DataTable
                empty={isLoading ? 'Carregando pacientes...' : error || 'Nenhum paciente encontrado.'}
                isEmpty={isLoading || Boolean(error) || filteredPatients.length === 0}
                minWidth={1000}
                tableClassName="patients-table"
                wrapperClassName="patients-table-card"
            >
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Nascimento</th>
                        <th>Telefone</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Cadastro</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredPatients.map((patient) => (
                        <tr key={patient.id}>
                            <td>
                                <strong>{patient.name}</strong>
                            </td>

                            <td>{patient.cpf}</td>
                            <td>{formatDate(patient.birthDate)}</td>
                            <td>{patient.phone}</td>
                            <td>{patient.email}</td>

                            <td>
                                <Badge tone={statusTones[patient.status]}>
                                    {statusLabels[patient.status]}
                                </Badge>
                            </td>

                            <td>{formatDate(patient.createdAt)}</td>

                            <td>
                                <div className="patients-actions">
                                    <IconButton
                                        label="Ver histórico"
                                        onClick={() => navigate(`/patients/${patient.id}`)}
                                    >
                                        <Eye size={18} />
                                    </IconButton>

                                    <IconButton label="Editar paciente">
                                        <Pencil size={18} />
                                    </IconButton>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </DataTable>

            <PatientModal
                isOpen={isPatientModalOpen}
                onClose={() => setIsPatientModalOpen(false)}
                onCreatePatient={handleCreatePatient}
            />
        </div>
    );
}
