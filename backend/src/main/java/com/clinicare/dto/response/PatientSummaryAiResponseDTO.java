package com.clinicare.dto.response;

import com.clinicare.enums.AttentionLevel;

public record PatientSummaryAiResponseDTO(
        String summary,
        AttentionLevel suggestedAttentionLevel,
        String justification) {
}
