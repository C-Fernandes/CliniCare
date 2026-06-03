import { useState } from 'react';
import { Sparkles } from 'lucide-react';

import { Button, FormField, Modal } from '../UI';
import type { AttentionLevel, ClinicalEvolutionFormData } from '../../types/clinicalEvolution';
import { analyzeClinicalEvolution } from '../../services/clinicalEvolutionAi';
import { getApiError } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { usePreferences } from '../../hooks/usePreferences';
import {
    buildFortalezaZonedDateTime,
    getLocalDateInputValue,
    getLocalTimeInputValue,
} from '../../utils/formatters';

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
    const { user } = useAuth();
    const { t } = usePreferences();
    const [evolutionDate, setEvolutionDate] = useState(getLocalDateInputValue());
    const [evolutionTime, setEvolutionTime] = useState(getLocalTimeInputValue());
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');
    const [conduct, setConduct] = useState('');
    const [attentionLevel, setAttentionLevel] = useState<AttentionLevel>('LOW');
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const { showToast } = useToast();
    const [aiError, setAiError] = useState('');

    function resetForm() {
        const now = new Date();
        setEvolutionDate(getLocalDateInputValue(now));
        setEvolutionTime(getLocalTimeInputValue(now));
        setSummary('');
        setDescription('');
        setConduct('');
        setAttentionLevel('LOW');
        setAiError('');
    }

    async function handleGenerateSummary() {
        try {
            setIsGeneratingSummary(true);
            setAiError('');

            const response = await analyzeClinicalEvolution({ description, conduct });
            setSummary(response.summary);
            setAttentionLevel(response.suggestedAttentionLevel);
            showToast({ message: t('evolution.aiSuccess'), type: 'success' });
        } catch (requestError) {
            const message = getApiError(requestError, t('evolution.aiError'));
            setAiError(message);
            showToast({ message, type: 'error' });
        } finally {
            setIsGeneratingSummary(false);
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
            evolutionDate: buildFortalezaZonedDateTime(evolutionDate, evolutionTime),
            patientId,
            professionalId: user?.userId ?? null,
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
            title={t('evolution.title')}
        >
            <p className="clinical-evolution-modal__subtitle">
                {t('evolution.registerFor', { patientName })}
            </p>

            <form onSubmit={handleSubmit}>
                <div className="clinical-evolution-form-grid">
                    <FormField
                        htmlFor="evolution-date"
                        label={t('evolution.date')}
                        controlProps={{
                            onChange: (event) => setEvolutionDate(event.target.value),
                            required: true,
                            type: 'date',
                            value: evolutionDate,
                        }}
                    />

                    <FormField
                        htmlFor="evolution-time"
                        label={t('evolution.time')}
                        controlProps={{
                            onChange: (event) => setEvolutionTime(event.target.value),
                            required: true,
                            type: 'time',
                            value: evolutionTime,
                        }}
                    />

                    <FormField
                        htmlFor="attention-level"
                        label={t('evolution.attentionLevel')}
                        controlProps={{
                            as: 'select',
                            children: (
                                <>
                                    <option value="LOW">{t('priority.LOW')}</option>
                                    <option value="MEDIUM">{t('priority.MEDIUM')}</option>
                                    <option value="HIGH">{t('priority.HIGH')}</option>
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
                    label={t('evolution.professional')}
                    controlProps={{
                        disabled: true,
                        type: 'text',
                        value: user?.name ?? t('evolution.professionalFallback'),
                    }}
                />

                <FormField
                    fullWidth
                    htmlFor="description"
                    label={t('evolution.description')}
                    controlProps={{
                        as: 'textarea',
                        onChange: (event) => setDescription(event.target.value),
                        placeholder: t('evolution.descriptionPlaceholder'),
                        required: true,
                        rows: 5,
                        value: description,
                    }}
                />

                <FormField
                    fullWidth
                    htmlFor="conduct"
                    label={t('evolution.conductLabel')}
                    controlProps={{
                        as: 'textarea',
                        onChange: (event) => setConduct(event.target.value),
                        placeholder: t('evolution.conductPlaceholder'),
                        required: true,
                        rows: 4,
                        value: conduct,
                    }}
                />

                <section className="clinical-evolution-summary">
                    <div className="clinical-evolution-summary__header">
                        <div>
                            <Sparkles size={18} />
                            <strong>{t('evolution.summaryOptional')}</strong>
                        </div>

                        <Button
                            size="sm"
                            type="button"
                            variant="secondary"
                            disabled={!description.trim() || isGeneratingSummary}
                            onClick={handleGenerateSummary}
                        >
                            {isGeneratingSummary ? t('actions.generatingSummary') : t('evolution.summary')}
                        </Button>
                    </div>

                    <textarea
                        aria-label={t('evolution.summary')}
                        placeholder={t('evolution.aiPlaceholder')}
                        value={summary}
                        onChange={(event) => setSummary(event.target.value)}
                    />

                    {aiError && <p className="clinical-evolution-summary__error">{aiError}</p>}
                </section>

                <div className="clinical-evolution-modal__actions">
                    <Button variant="secondary" onClick={handleClose}>
                        {t('actions.cancel')}
                    </Button>

                    <Button type="submit">{t('actions.saveEvolution')}</Button>
                </div>
            </form>
        </Modal>
    );
}
