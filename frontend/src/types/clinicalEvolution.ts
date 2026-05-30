export type AttentionLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ClinicalEvolution {
    id: number;
    evolutionDate: string;
    description: string;
    summary: string;
    conduct: string;
    attentionLevel: AttentionLevel;
    patientId: number;
    patientName: string;
    professionalId: number | null;
    professionalName: string | null;
    active: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface ClinicalEvolutionFormData {
    evolutionDate: string;
    description: string;
    summary: string;
    conduct: string;
    attentionLevel: AttentionLevel;
    patientId: number;
    professionalId?: number | null;
}
