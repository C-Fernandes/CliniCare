import { api, unwrapResponse } from './api';
import type { ApiResponse, PageRequest, PageResponse } from '../types/api';
import type { Patient, PatientFormData } from '../types/patient';

export async function getPatients(params: PageRequest & { name?: string; status?: Patient['status'] } = {}) {
    return unwrapResponse(
        await api.get<ApiResponse<PageResponse<Patient>>>('/patients/search', {
            params: { page: 0, size: 100, sort: 'createdAt,desc', ...params },
        })
    );
}

export async function getPatientById(id: number) {
    return unwrapResponse(await api.get<ApiResponse<Patient>>(`/patients/${id}`));
}

export async function createPatient(data: PatientFormData) {
    return unwrapResponse(await api.post<ApiResponse<Patient>>('/patients', data));
}

export async function updatePatient(id: number, data: PatientFormData) {
    return unwrapResponse(await api.put<ApiResponse<Patient>>(`/patients/${id}`, data));
}
