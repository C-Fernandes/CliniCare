package com.clinicare.mappers;

import org.springframework.stereotype.Component;

import com.clinicare.dto.request.PatientRequestDTO;
import com.clinicare.dto.response.PatientResponseDTO;
import com.clinicare.model.Patient;

@Component
public class PatientMapper implements GenericMapper<Patient, PatientRequestDTO, PatientResponseDTO> {

    @Override
    public Patient toEntity(PatientRequestDTO request) {
        Patient patient = new Patient();

        patient.setName(request.name());
        patient.setCpf(request.cpf());
        patient.setBirthDate(request.birthDate());
        patient.setPhone(request.phone());
        patient.setEmail(request.email());
        patient.setStatus(request.status());
        patient.setNotes(request.notes());

        return patient;
    }

    @Override
    public PatientResponseDTO toResponse(Patient entity) {
        return new PatientResponseDTO(
                entity.getId(),
                entity.getName(),
                entity.getCpf(),
                entity.getBirthDate(),
                entity.getPhone(),
                entity.getEmail(),
                entity.getStatus(),
                entity.getNotes(),
                entity.isActive(),
                entity.getCreatedAt(),
                entity.getUpdatedAt());
    }

    @Override
    public void updateEntityFromRequest(PatientRequestDTO request, Patient entity) {
        entity.setName(request.name());
        entity.setCpf(request.cpf());
        entity.setBirthDate(request.birthDate());
        entity.setPhone(request.phone());
        entity.setEmail(request.email());
        entity.setStatus(request.status());
        entity.setNotes(request.notes());
    }
}