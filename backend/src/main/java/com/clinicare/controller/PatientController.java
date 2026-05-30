package com.clinicare.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clinicare.dto.ApiResponseDTO;
import com.clinicare.dto.request.PatientRequestDTO;
import com.clinicare.dto.response.PatientResponseDTO;
import com.clinicare.enums.PatientStatus;
import com.clinicare.model.Patient;
import com.clinicare.service.PatientService;

@RestController
@RequestMapping("/patients")
public class PatientController
        extends GenericController<Patient, PatientRequestDTO, PatientResponseDTO, PatientService> {

    public PatientController(PatientService service) {
        super(service);
    }

    @GetMapping("/filter/status")
    public ResponseEntity<ApiResponseDTO<Page<PatientResponseDTO>>> findByStatus(
            @RequestParam PatientStatus status,
            Pageable pageable) {
        Page<PatientResponseDTO> response = service.findByStatus(status, pageable);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(
                        true,
                        "Pacientes encontrados com sucesso.",
                        response,
                        null));
    }

    @GetMapping("/filter/name")
    public ResponseEntity<ApiResponseDTO<Page<PatientResponseDTO>>> findByName(
            @RequestParam String name,
            Pageable pageable) {
        Page<PatientResponseDTO> response = service.findByName(name, pageable);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(
                        true,
                        "Pacientes encontrados com sucesso.",
                        response,
                        null));
    }
}
