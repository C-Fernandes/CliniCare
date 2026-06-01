package com.clinicare.service;

import org.springframework.stereotype.Service;

import com.clinicare.client.AiClient;
import com.clinicare.dto.request.ClinicalEvolutionAiRequestDTO;
import com.clinicare.dto.response.ClinicalEvolutionAiResponseDTO;

import tools.jackson.databind.ObjectMapper;

@Service
public class ClinicalEvolutionAiService {

    private final AiClient aiClient;
    private final ObjectMapper objectMapper;

    public ClinicalEvolutionAiService(AiClient aiClient, ObjectMapper objectMapper) {
        this.aiClient = aiClient;
        this.objectMapper = objectMapper;
    }

    public ClinicalEvolutionAiResponseDTO analyze(ClinicalEvolutionAiRequestDTO request) {
        String prompt = buildPrompt(request);

        String aiTextResponse = aiClient.generateClinicalEvolutionAnalysis(prompt);

        return parseResponse(aiTextResponse);
    }

    private String buildPrompt(ClinicalEvolutionAiRequestDTO request) {
        return """
                Você é um assistente de apoio para organização de evoluções clínicas.

                Importante:
                - Não faça diagnóstico.
                - Não substitua avaliação profissional.
                - Apenas resuma o texto e sugira um nível de atenção em português do Brasil.
                - Responda somente em JSON válido.
                - O campo suggestedAttentionLevel deve ser apenas: LOW, MEDIUM ou HIGH.

                Descrição:
                %s

                Conduta:
                %s

                Formato obrigatório:
                {
                  "summary": "resumo curto da evolução",
                  "suggestedAttentionLevel": "LOW | MEDIUM | HIGH",
                  "justification": "justificativa curta"
                }
                """.formatted(
                request.description(),
                request.conduct() == null ? "" : request.conduct());
    }

    private ClinicalEvolutionAiResponseDTO parseResponse(String text) {
        try {
            String cleanJson = text
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            return objectMapper.readValue(cleanJson, ClinicalEvolutionAiResponseDTO.class);
        } catch (Exception exception) {
            throw new IllegalStateException("Não foi possível interpretar a resposta da IA.");
        }
    }
}