package com.clinicare.service;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.clinicare.client.AiClient;
import com.clinicare.dto.response.PatientSummaryAiResponseDTO;
import com.clinicare.exception.ResourceNotFoundException;
import com.clinicare.model.ClinicalEvolution;
import com.clinicare.model.Patient;
import com.clinicare.repository.ClinicalEvolutionRepository;
import com.clinicare.repository.PatientRepository;

import tools.jackson.databind.ObjectMapper;

@Service
public class PatientSummaryAiService {

    private static final DateTimeFormatter BRAZILIAN_DATE_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final PatientRepository patientRepository;
    private final ClinicalEvolutionRepository clinicalEvolutionRepository;
    private final AiClient aiClient;
    private final ObjectMapper objectMapper;

    public PatientSummaryAiService(
            PatientRepository patientRepository,
            ClinicalEvolutionRepository clinicalEvolutionRepository,
            AiClient aiClient,
            ObjectMapper objectMapper) {
        this.patientRepository = patientRepository;
        this.clinicalEvolutionRepository = clinicalEvolutionRepository;
        this.aiClient = aiClient;
        this.objectMapper = objectMapper;
    }

    public PatientSummaryAiResponseDTO summarize(Long patientId) {
        Patient patient = patientRepository.findByIdAndActiveTrue(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado com id: " + patientId));

        String evolutions = clinicalEvolutionRepository
                .findAllByPatient_IdAndActiveTrue(
                        patientId,
                        PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "evolutionDate")))
                .stream()
                .map(this::formatEvolution)
                .collect(Collectors.joining("\n\n"));

        String response = aiClient.generateClinicalEvolutionAnalysis(buildPrompt(patient, evolutions));
        return parseResponse(response);
    }

    private String buildPrompt(Patient patient, String evolutions) {
        return """
                Você é um assistente de apoio à revisão de histórico clínico.

                Importante:
                - Não faça diagnóstico.
                - Não substitua avaliação profissional.
                - Gere um resumo longitudinal objetivo.
                - Quando mencionar datas, use sempre o padrão brasileiro dd/MM/aaaa ou dd/MM/aaaa HH:mm.
                - Responda somente em JSON válido.
                - suggestedAttentionLevel deve ser apenas: LOW, MEDIUM ou HIGH.
                - Se não houver evoluções, informe que o histórico é insuficiente.

                Paciente: %s
                Status cadastral: %s
                Observações: %s

                Evoluções clínicas mais recentes:
                %s

                Formato obrigatório:
                {
                  "summary": "resumo geral do histórico",
                  "suggestedAttentionLevel": "LOW | MEDIUM | HIGH",
                  "justification": "justificativa curta para revisão profissional"
                }
                """.formatted(
                patient.getName(),
                patient.getStatus(),
                patient.getNotes() == null ? "" : patient.getNotes(),
                evolutions.isBlank() ? "Nenhuma evolução registrada." : evolutions);
    }

    private String formatEvolution(ClinicalEvolution evolution) {
        return """
                Data: %s
                Atenção registrada: %s
                Resumo: %s
                Evolução: %s
                Conduta: %s
                """.formatted(
                evolution.getEvolutionDate().format(BRAZILIAN_DATE_TIME_FORMATTER),
                evolution.getAttentionLevel(),
                evolution.getSummary(),
                evolution.getDescription(),
                evolution.getConduct());
    }

    private PatientSummaryAiResponseDTO parseResponse(String text) {
        try {
            String cleanJson = text.replace("```json", "").replace("```", "").trim();
            return objectMapper.readValue(cleanJson, PatientSummaryAiResponseDTO.class);
        } catch (Exception exception) {
            throw new IllegalStateException("Não foi possível interpretar o resumo geral gerado pela IA.");
        }
    }
}
