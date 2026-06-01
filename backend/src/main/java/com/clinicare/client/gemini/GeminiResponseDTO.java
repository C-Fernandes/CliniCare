package com.clinicare.client.gemini;

import java.util.List;

public record GeminiResponseDTO(
        List<Candidate> candidates) {
    public record Candidate(
            Content content) {
    }

    public record Content(
            List<Part> parts) {
    }

    public record Part(
            String text) {
    }

    public String getFirstText() {
        if (candidates == null || candidates.isEmpty()) {
            return null;
        }

        Candidate candidate = candidates.get(0);

        if (candidate.content() == null ||
                candidate.content().parts() == null ||
                candidate.content().parts().isEmpty()) {
            return null;
        }

        return candidate.content().parts().get(0).text();
    }
}
