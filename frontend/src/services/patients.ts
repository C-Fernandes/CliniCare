import { api, unwrapResponse } from './api';
import type { ApiResponse, PageResponse } from '../types/api';
import type { Patient, PatientFormData } from '../types/patient';

export async function getPatients() {
    return unwrapResponse(
        await api.get<ApiResponse<PageResponse<Patient>>>('/patients', {
            params: { page: 0, size: 100, sort: 'createdAt,desc' },
        })
    );
}

export async function getPatientById(id: number) {
    return unwrapResponse(await api.get<ApiResponse<Patient>>(`/patients/${id}`));
}

export async function createPatient(data: PatientFormData) {
    return unwrapResponse(await api.post<ApiResponse<Patient>>('/patients', data));
}
