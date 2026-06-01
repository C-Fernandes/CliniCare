import { api, unwrapResponse } from './api';
import type { ApiResponse } from '../types/api';
import type { AttentionLevel } from '../types/clinicalEvolution';

interface ClinicalEvolutionAiRequest {
    description: string;
    conduct: string;
}

export interface ClinicalEvolutionAiResponse {
    summary: string;
    suggestedAttentionLevel: AttentionLevel;
    justification: string;
}

export async function analyzeClinicalEvolution(data: ClinicalEvolutionAiRequest) {
    return unwrapResponse(
        await api.post<ApiResponse<ClinicalEvolutionAiResponse>>(
            '/ai/clinical-evolution/analyze',
            data
        )
    );
}
