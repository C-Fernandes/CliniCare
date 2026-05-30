import { useState } from 'react';

import './PatientModal.scss';
import { Button, FormField, Modal } from '../UI';
import type { PatientFormData, PatientStatus } from '../../types/patient';

interface PatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreatePatient: (data: PatientFormData) => void;
}

export function PatientModal({
    isOpen,
    onClose,
    onCreatePatient,
}: PatientModalProps) {
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<PatientStatus>('IN_FOLLOW_UP');
    const [notes, setNotes] = useState('');

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

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        onCreatePatient({
            name,
            cpf,
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
            title="Novo paciente"
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
                            onChange: (event) => setCpf(event.target.value),
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
