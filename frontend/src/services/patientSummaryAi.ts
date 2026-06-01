import { api, unwrapResponse } from './api';
import type { ApiResponse } from '../types/api';
import type { AttentionLevel } from '../types/clinicalEvolution';

export interface PatientSummaryAiResponse {
    summary: string;
    suggestedAttentionLevel: AttentionLevel;
    justification: string;
}

export async function summarizePatient(patientId: number) {
    return unwrapResponse(
        await api.post<ApiResponse<PatientSummaryAiResponse>>(`/ai/patients/${patientId}/summary`)
    );
}
