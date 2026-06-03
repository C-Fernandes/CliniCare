package com.clinicare.dto.response;

import java.time.ZonedDateTime;

import com.clinicare.dto.ResponseDTO;
import com.clinicare.enums.AttentionLevel;

public record ClinicalEvolutionResponseDTO(
                Long id,
                ZonedDateTime evolutionDate,
                String description,
                String summary,
                String conduct,
                AttentionLevel attentionLevel,
                Long patientId,
                String patientName,
                Long professionalId,
                String professionalName,
                Boolean active,
                ZonedDateTime createdAt,
                ZonedDateTime updatedAt) implements ResponseDTO {
}
