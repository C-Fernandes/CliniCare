package com.clinicare.mappers;

import org.springframework.stereotype.Component;

import com.clinicare.dto.request.ClinicalEvolutionRequestDTO;
import com.clinicare.dto.response.ClinicalEvolutionResponseDTO;
import com.clinicare.model.ClinicalEvolution;
import com.clinicare.model.Patient;
import com.clinicare.model.User;
import com.clinicare.util.AppDateTime;

@Component
public class ClinicalEvolutionMapper
        implements GenericMapper<ClinicalEvolution, ClinicalEvolutionRequestDTO, ClinicalEvolutionResponseDTO> {

    @Override
    public ClinicalEvolution toEntity(ClinicalEvolutionRequestDTO request) {
        ClinicalEvolution evolution = new ClinicalEvolution();

        evolution.setEvolutionDate(AppDateTime.truncateToMinutes(request.evolutionDate()));
        evolution.setDescription(request.description());
        evolution.setSummary(request.summary());
        evolution.setConduct(request.conduct());
        evolution.setAttentionLevel(request.attentionLevel());

        return evolution;
    }

    @Override
    public ClinicalEvolutionResponseDTO toResponse(ClinicalEvolution entity) {
        Patient patient = entity.getPatient();
        User professional = entity.getProfessional();

        Long patientId = patient != null ? patient.getId() : null;
        String patientName = patient != null ? patient.getName() : null;

        Long professionalId = professional != null ? professional.getId() : null;
        String professionalName = professional != null ? professional.getName() : null;

        return new ClinicalEvolutionResponseDTO(
                entity.getId(),
                entity.getEvolutionDate(),
                entity.getDescription(),
                entity.getSummary(),
                entity.getConduct(),
                entity.getAttentionLevel(),
                patientId,
                patientName,
                professionalId,
                professionalName,
                entity.isActive(),
                entity.getCreatedAt(),
                entity.getUpdatedAt());
    }

    @Override
    public void updateEntityFromRequest(ClinicalEvolutionRequestDTO request, ClinicalEvolution entity) {
        entity.setEvolutionDate(AppDateTime.truncateToMinutes(request.evolutionDate()));
        entity.setDescription(request.description());
        entity.setSummary(request.summary());
        entity.setConduct(request.conduct());
        entity.setAttentionLevel(request.attentionLevel());
    }
}
