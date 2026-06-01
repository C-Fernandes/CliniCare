package com.clinicare.dto.response;

import com.clinicare.enums.AttentionLevel;

public record ClinicalEvolutionAiResponseDTO(
                String summary,
                AttentionLevel suggestedAttentionLevel,
                String justification) {
}