package com.clinicare.controller;

import com.clinicare.dto.ApiResponseDTO;
import com.clinicare.dto.request.ClinicalEvolutionAiRequestDTO;
import com.clinicare.dto.response.ClinicalEvolutionAiResponseDTO;
import com.clinicare.service.ClinicalEvolutionAiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AiController {

    private final ClinicalEvolutionAiService clinicalEvolutionAiService;

    public AiController(ClinicalEvolutionAiService clinicalEvolutionAiService) {
        this.clinicalEvolutionAiService = clinicalEvolutionAiService;
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
}
