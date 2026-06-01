package com.clinicare.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ClinicalEvolutionAiRequestDTO(

                @NotBlank(message = "A descrição da evolução clínica é obrigatória.") String description,

                String conduct

) {
}