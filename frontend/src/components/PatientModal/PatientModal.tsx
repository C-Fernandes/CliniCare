import { useState } from 'react';

import './PatientModal.scss';
import { Button, FormField, Modal } from '../UI';
import type { Patient, PatientFormData, PatientStatus } from '../../types/patient';
import { formatCpf, onlyDigits } from '../../utils/formatters';

interface PatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSavePatient: (data: PatientFormData) => Promise<void> | void;
    patient?: Patient | null;
}

export function PatientModal({
    isOpen,
    onClose,
    onSavePatient,
    patient,
}: PatientModalProps) {
    const [name, setName] = useState(patient?.name ?? '');
    const [cpf, setCpf] = useState(formatCpf(patient?.cpf));
    const [birthDate, setBirthDate] = useState(patient?.birthDate ?? '');
    const [phone, setPhone] = useState(patient?.phone ?? '');
    const [email, setEmail] = useState(patient?.email ?? '');
    const [status, setStatus] = useState<PatientStatus>(patient?.status ?? 'IN_FOLLOW_UP');
    const [notes, setNotes] = useState(patient?.notes ?? '');

    if (!isOpen) {
        return null;
    }

    function resetForm() {
        setName('');
        setCpf('');
        setBirthDate('');
        setPhone('');
        setEmail('');
        setStatus('IN_FOLLOW_UP');
        setNotes('');
    }

    function handleClose() {
        resetForm();
        onClose();
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await onSavePatient({
            name,
            cpf: onlyDigits(cpf),
            birthDate,
            phone,
            email,
            status,
            notes,
        });

        resetForm();
        onClose();
    }

    return (
        <Modal
            className="patient-modal"
            headerClassName="patient-modal__header"
            isOpen={isOpen}
            onClose={handleClose}
            overlayClassName="patient-modal-overlay"
            title={patient ? 'Editar paciente' : 'Novo paciente'}
            size="lg"
        >
            <form onSubmit={handleSubmit}>
                <FormField
                    fullWidth
                    htmlFor="patient-name"
                    label="Nome completo *"
                    controlProps={{
                        autoFocus: true,
                        onChange: (event) => setName(event.target.value),
                        required: true,
                        type: 'text',
                        value: name,
                    }}
                />

                <div className="patient-form-grid">
                    <FormField
                        htmlFor="patient-cpf"
                        label="CPF *"
                        controlProps={{
                            inputMode: 'numeric',
                            maxLength: 14,
                            onChange: (event) => setCpf(formatCpf(event.target.value)),
                            placeholder: '000.000.000-00',
                            required: true,
                            type: 'text',
                            value: cpf,
                        }}
                    />

                    <FormField
                        htmlFor="patient-birth-date"
                        label="Data de nascimento *"
                        controlProps={{
                            onChange: (event) => setBirthDate(event.target.value),
                            required: true,
                            type: 'date',
                            value: birthDate,
                        }}
                    />

                    <FormField
                        htmlFor="patient-phone"
                        label="Telefone"
                        controlProps={{
                            onChange: (event) => setPhone(event.target.value),
                            placeholder: '(00) 00000-0000',
                            type: 'text',
                            value: phone,
                        }}
                    />

                    <FormField
                        htmlFor="patient-email"
                        label="Email"
                        controlProps={{
                            onChange: (event) => setEmail(event.target.value),
                            type: 'email',
                            value: email,
                        }}
                    />
                </div>

                <FormField
                    fullWidth
                    htmlFor="patient-status"
                    label="Status"
                    controlProps={{
                        as: 'select',
                        children: (
                            <>
                                <option value="IN_FOLLOW_UP">Em acompanhamento</option>
                                <option value="URGENT">Urgente</option>
                                <option value="DISCHARGED">Alta</option>
                                <option value="PAUSED">Pausado</option>
                            </>
                        ),
                        onChange: (event) => setStatus(event.target.value as PatientStatus),
                        value: status,
                    }}
                />

                <FormField
                    fullWidth
                    htmlFor="patient-notes"
                    label="Observações"
                    controlProps={{
                        as: 'textarea',
                        onChange: (event) => setNotes(event.target.value),
                        rows: 5,
                        value: notes,
                    }}
                />

                <div className="patient-modal__actions">
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>

                    <Button type="submit">Salvar paciente</Button>
                </div>
            </form>
        </Modal>
    );
}
