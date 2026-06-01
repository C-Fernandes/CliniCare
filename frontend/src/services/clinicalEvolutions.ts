import { api, unwrapResponse } from './api';
import type { ApiResponse, PageRequest, PageResponse } from '../types/api';
import type { ClinicalEvolution, ClinicalEvolutionFormData } from '../types/clinicalEvolution';

export async function getClinicalEvolutions(params: PageRequest = {}) {
    return unwrapResponse(
        await api.get<ApiResponse<PageResponse<ClinicalEvolution>>>('/clinical-evolutions', {
            params: { page: 0, size: 100, sort: 'evolutionDate,desc', ...params },
        })
    );
}

export async function getClinicalEvolutionsByPatient(patientId: number, params: PageRequest = {}) {
    return unwrapResponse(
        await api.get<ApiResponse<PageResponse<ClinicalEvolution>>>(`/clinical-evolutions/patient/${patientId}`, {
            params: { page: 0, size: 10, sort: 'evolutionDate,desc', ...params },
        })
    );
}

export async function createClinicalEvolution(data: ClinicalEvolutionFormData) {
    return unwrapResponse(await api.post<ApiResponse<ClinicalEvolution>>('/clinical-evolutions', data));
}
