package com.clinicare.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

import com.clinicare.dto.RequestDTO;
import com.clinicare.enums.AttentionLevel;

public record ClinicalEvolutionRequestDTO(

                @NotNull(message = "A data da evolução clínica é obrigatória.") LocalDateTime evolutionDate,

                @NotBlank(message = "A descrição da evolução clínica é obrigatória.") String description,

                String summary,

                @NotBlank(message = "A conduta realizada é obrigatória.") String conduct,

                @NotNull(message = "O nível de atenção é obrigatório.") AttentionLevel attentionLevel,

                @NotNull(message = "O paciente é obrigatório.") Long patientId,

                Long professionalId

) implements RequestDTO {
}