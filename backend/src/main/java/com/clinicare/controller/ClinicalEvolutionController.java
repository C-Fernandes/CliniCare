package com.clinicare.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinicare.dto.ApiResponseDTO;
import com.clinicare.dto.request.ClinicalEvolutionRequestDTO;
import com.clinicare.dto.response.ClinicalEvolutionResponseDTO;
import com.clinicare.model.ClinicalEvolution;
import com.clinicare.service.ClinicalEvolutionService;

@RestController
@RequestMapping("/clinical-evolutions")
public class ClinicalEvolutionController extends
                GenericController<ClinicalEvolution, ClinicalEvolutionRequestDTO, ClinicalEvolutionResponseDTO, ClinicalEvolutionService> {

        public ClinicalEvolutionController(ClinicalEvolutionService service) {
                super(service);
        }

        @GetMapping("/patient/{patientId}")
        public ResponseEntity<ApiResponseDTO<Page<ClinicalEvolutionResponseDTO>>> findByPatient(
                        @PathVariable Long patientId,
                        Pageable pageable) {
                Page<ClinicalEvolutionResponseDTO> response = service.findByPatient(patientId, pageable);

                return ResponseEntity.ok(
                                new ApiResponseDTO<>(
                                                true,
                                                "Histórico clínico encontrado com sucesso.",
                                                response,
                                                null));
        }

        @GetMapping("/professional/{professionalId}")
        public ResponseEntity<ApiResponseDTO<Page<ClinicalEvolutionResponseDTO>>> findByProfessional(
                        @PathVariable Long professionalId,
                        Pageable pageable) {
                Page<ClinicalEvolutionResponseDTO> response = service.findByProfessional(professionalId, pageable);

                return ResponseEntity.ok(
                                new ApiResponseDTO<>(
                                                true,
                                                "Evoluções clínicas encontradas com sucesso.",
                                                response,
                                                null));
        }
}