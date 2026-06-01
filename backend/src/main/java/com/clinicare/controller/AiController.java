package com.clinicare.controller;

import com.clinicare.dto.ApiResponseDTO;
import com.clinicare.dto.request.ClinicalEvolutionAiRequestDTO;
import com.clinicare.dto.response.ClinicalEvolutionAiResponseDTO;
import com.clinicare.dto.response.PatientSummaryAiResponseDTO;
import com.clinicare.service.ClinicalEvolutionAiService;
import com.clinicare.service.PatientSummaryAiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AiController {

    private final ClinicalEvolutionAiService clinicalEvolutionAiService;
    private final PatientSummaryAiService patientSummaryAiService;

    public AiController(ClinicalEvolutionAiService clinicalEvolutionAiService,
            PatientSummaryAiService patientSummaryAiService) {
        this.clinicalEvolutionAiService = clinicalEvolutionAiService;
        this.patientSummaryAiService = patientSummaryAiService;
    }

    @PostMapping("/clinical-evolution/analyze")
    public ResponseEntity<ApiResponseDTO<ClinicalEvolutionAiResponseDTO>> analyzeClinicalEvolution(
            @Valid @RequestBody ClinicalEvolutionAiRequestDTO request) {
        ClinicalEvolutionAiResponseDTO response = clinicalEvolutionAiService.analyze(request);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(
                        true,
                        "Análise gerada com sucesso.",
                        response,
                        null));
    }

    @PostMapping("/patients/{patientId}/summary")
    public ResponseEntity<ApiResponseDTO<PatientSummaryAiResponseDTO>> summarizePatient(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(new ApiResponseDTO<>(
                true,
                "Resumo geral gerado com sucesso.",
                patientSummaryAiService.summarize(patientId),
                null));
    }
}
