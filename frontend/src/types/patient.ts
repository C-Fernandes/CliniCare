export type PatientStatus =
    | 'IN_FOLLOW_UP'
    | 'URGENT'
    | 'DISCHARGED'
    | 'PAUSED';

export interface PatientFormData {
    name: string;
    cpf: string;
    birthDate: string;
    phone: string;
    email: string;
    status: PatientStatus;
    notes: string;
}

export interface Patient extends PatientFormData {
    id: number;
    createdAt: string;
}