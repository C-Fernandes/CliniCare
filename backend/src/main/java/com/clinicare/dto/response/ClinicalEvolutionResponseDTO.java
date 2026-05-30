package com.clinicare.dto.response;

import java.time.LocalDateTime;

import com.clinicare.dto.ResponseDTO;
import com.clinicare.enums.AttentionLevel;

public record ClinicalEvolutionResponseDTO(
                Long id,
                LocalDateTime evolutionDate,
                String description,
                String summary,
                String conduct,
                AttentionLevel attentionLevel,
                Long patientId,
                String patientName,
                Long professionalId,
                String professionalName,
                Boolean active,
                LocalDateTime createdAt,
                LocalDateTime updatedAt) implements ResponseDTO {
}