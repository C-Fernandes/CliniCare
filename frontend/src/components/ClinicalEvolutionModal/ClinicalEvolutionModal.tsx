import { useState } from 'react';
import { Sparkles } from 'lucide-react';

import { Button, FormField, Modal } from '../UI';
import type { AttentionLevel, ClinicalEvolutionFormData } from '../../types/clinicalEvolution';
import type { User } from '../../types/user';

import './ClinicalEvolutionModal.scss';

interface ClinicalEvolutionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateEvolution: (data: ClinicalEvolutionFormData) => Promise<void> | void;
    patientId: number;
    patientName: string;
}

export function ClinicalEvolutionModal({
    isOpen,
    onClose,
    onCreateEvolution,
    patientId,
    patientName,
}: ClinicalEvolutionModalProps) {
    const currentUser = JSON.parse(localStorage.getItem('clinicare:user') ?? '{}') as Partial<User>;
    const [evolutionDate, setEvolutionDate] = useState(new Date().toISOString().slice(0, 10));
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');
    const [conduct, setConduct] = useState('');
    const [attentionLevel, setAttentionLevel] = useState<AttentionLevel>('LOW');

    function resetForm() {
        setEvolutionDate(new Date().toISOString().slice(0, 10));
        setSummary('');
        setDescription('');
        setConduct('');
        setAttentionLevel('LOW');
    }

    function handleGenerateSummary() {
        const generatedSummary = description.trim().split('.').find(Boolean)?.trim();

        if (generatedSummary) {
            setSummary(generatedSummary);
        }
    }

    function handleClose() {
        resetForm();
        onClose();
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await onCreateEvolution({
            attentionLevel,
            conduct,
            description,
            evolutionDate: `${evolutionDate}T00:00:00`,
            patientId,
            professionalId: currentUser.id ?? null,
            summary,
        });

        resetForm();
        onClose();
    }

    return (
        <Modal
            className="clinical-evolution-modal"
            headerClassName="clinical-evolution-modal__header"
            isOpen={isOpen}
            onClose={handleClose}
            overlayClassName="clinical-evolution-modal-overlay"
            size="lg"
            title="Nova evolução clínica"
        >
            <p className="clinical-evolution-modal__subtitle">
                Registrar evolução para {patientName}
            </p>

            <form onSubmit={handleSubmit}>
                <div className="clinical-evolution-form-grid">
                    <FormField
                        htmlFor="evolution-date"
                        label="Data da evolução"
                        controlProps={{
                            onChange: (event) => setEvolutionDate(event.target.value),
                            required: true,
                            type: 'date',
                            value: evolutionDate,
                        }}
                    />

                    <FormField
                        htmlFor="attention-level"
                        label="Nível de atenção"
                        controlProps={{
                            as: 'select',
                            children: (
                                <>
                                    <option value="LOW">Baixo</option>
                                    <option value="MEDIUM">Médio</option>
                                    <option value="HIGH">Alto</option>
                                </>
                            ),
                            onChange: (event) => setAttentionLevel(event.target.value as AttentionLevel),
                            value: attentionLevel,
                        }}
                    />
                </div>

                <FormField
                    fullWidth
                    htmlFor="professional"
                    label="Profissional responsável"
                    controlProps={{
                        disabled: true,
                        type: 'text',
                        value: currentUser.name ?? 'Profissional não identificado',
                    }}
                />

                <FormField
                    fullWidth
                    htmlFor="description"
                    label="Descrição da evolução"
                    controlProps={{
                        as: 'textarea',
                        onChange: (event) => setDescription(event.target.value),
                        placeholder: 'Descreva o quadro clínico, queixas e observações.',
                        required: true,
                        rows: 5,
                        value: description,
                    }}
                />

                <FormField
                    fullWidth
                    htmlFor="conduct"
                    label="Conduta realizada"
                    controlProps={{
                        as: 'textarea',
                        onChange: (event) => setConduct(event.target.value),
                        placeholder: 'Conduta adotada e próximos passos.',
                        required: true,
                        rows: 4,
                        value: conduct,
                    }}
                />

                <section className="clinical-evolution-summary">
                    <div className="clinical-evolution-summary__header">
                        <div>
                            <Sparkles size={18} />
                            <strong>Resumo com IA (opcional)</strong>
                        </div>

                        <Button
                            size="sm"
                            type="button"
                            variant="secondary"
                            onClick={handleGenerateSummary}
                        >
                            Gerar resumo com IA
                        </Button>
                    </div>

                    <textarea
                        aria-label="Resumo com IA"
                        placeholder="O resumo gerado aparecerá aqui."
                        value={summary}
                        onChange={(event) => setSummary(event.target.value)}
                    />
                </section>

                <div className="clinical-evolution-modal__actions">
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>

                    <Button type="submit">Salvar evolução</Button>
                </div>
            </form>
        </Modal>
    );
}
