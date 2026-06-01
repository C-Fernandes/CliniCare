package com.clinicare.client.gemini;

import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class GeminiAiClientTests {

    @Test
    void rejectsAnalysisWithoutApiKeyWithoutPreventingApplicationStartup() {
        GeminiAiClient client = new GeminiAiClient();
        ReflectionTestUtils.setField(client, "apiKey", "");

        assertThrows(IllegalStateException.class, () -> client.generateClinicalEvolutionAnalysis("prompt"));
    }
}
