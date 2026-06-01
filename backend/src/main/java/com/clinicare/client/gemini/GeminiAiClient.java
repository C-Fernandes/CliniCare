package com.clinicare.client.gemini;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.clinicare.client.AiClient;

import java.util.List;
import java.util.Map;

@Component
public class GeminiAiClient implements AiClient {

    private final RestClient restClient;

    @Value("${ai.api.key:${GEMINI_API_KEY:}}")
    private String apiKey;

    @Value("${ai.api.url:${GEMINI_API_URL:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent}}")
    private String apiUrl;

    public GeminiAiClient() {
        this.restClient = RestClient.create();
    }

    @Override
    public String generateClinicalEvolutionAnalysis(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Configure GEMINI_API_KEY para utilizar a análise com IA.");
        }

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)))));

        GeminiResponseDTO response = restClient.post()
                .uri(apiUrl)
                .header("X-goog-api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(GeminiResponseDTO.class);

        if (response == null || response.getFirstText() == null) {
            throw new IllegalStateException("A IA não retornou uma resposta válida.");
        }

        return response.getFirstText();
    }
}
