import { useMemo, useState } from 'react';
import { Eye, Pencil, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { PatientModal } from '../../components/PatientModal/PatientModal';
import { Badge, Button, DataTable, IconButton } from '../../components/ui';

import './Patients.scss';
import type { Patient, PatientFormData, PatientStatus } from '../../types/patient';

const patientsMock: Patient[] = [
    {
        id: 1,
        name: 'Maria Silva',
        cpf: '123.456.789-00',
        birthDate: '15/03/1995',
        phone: '(84) 99999-9999',
        email: 'maria@email.com',
        status: 'IN_FOLLOW_UP',
        notes: '',
        createdAt: '12/02/2026',
    },
    {
        id: 2,
        name: 'João Pereira',
        cpf: '987.654.321-00',
        birthDate: '22/07/1988',
        phone: '(11) 98888-7777',
        email: 'joao.pereira@email.com',
        status: 'URGENT',
        notes: '',
        createdAt: '01/03/2026',
    },
    {
        id: 3,
        name: 'Beatriz Almeida',
        cpf: '456.789.123-00',
        birthDate: '04/11/2001',
        phone: '(21) 97777-6666',
        email: 'bia.almeida@email.com',
        status: 'DISCHARGED',
        notes: '',
        createdAt: '20/09/2025',
    },
    {
        id: 4,
        name: 'Roberto Souza',
        cpf: '321.654.987-00',
        birthDate: '30/01/1972',
        phone: '(31) 96666-5555',
        email: 'roberto.souza@email.com',
        status: 'PAUSED',
        notes: '',
        createdAt: '08/11/2025',
    },
    {
        id: 5,
        name: 'Clara Nogueira',
        cpf: '654.321.987-00',
        birthDate: '18/05/1993',
        phone: '(85) 95555-4444',
        email: 'clara.nogueira@email.com',
        status: 'IN_FOLLOW_UP',
        notes: '',
        createdAt: '10/04/2026',
    },
];

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

function formatDateToBR(date: string) {
    if (!date) {
        return '';
    }

    return new Date(date).toLocaleDateString('pt-BR', {
        timeZone: 'UTC',
    });
}

export function Patients() {
    const [patients, setPatients] = useState<Patient[]>(patientsMock);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<PatientStatus | 'ALL'>('ALL');
    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
    const navigate = useNavigate();
    const filteredPatients = useMemo(() => {
        return patients.filter((patient) => {
            const matchesName = patient.name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesStatus = status === 'ALL' || patient.status === status;

            return matchesName && matchesStatus;
        });
    }, [patients, search, status]);

    function handleCreatePatient(data: PatientFormData) {
        const newPatient: Patient = {
            id: patients.length + 1,
            name: data.name,
            cpf: data.cpf,
            birthDate: formatDateToBR(data.birthDate),
            phone: data.phone,
            email: data.email,
            status: data.status,
            notes: data.notes,
            createdAt: new Date().toLocaleDateString('pt-BR'),
        };

        setPatients((currentPatients) => [...currentPatients, newPatient]);
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
                empty="Nenhum paciente encontrado."
                isEmpty={filteredPatients.length === 0}
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
                            <td>{patient.birthDate}</td>
                            <td>{patient.phone}</td>
                            <td>{patient.email}</td>

                            <td>
                                <Badge tone={statusTones[patient.status]}>
                                    {statusLabels[patient.status]}
                                </Badge>
                            </td>

                            <td>{patient.createdAt}</td>

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
