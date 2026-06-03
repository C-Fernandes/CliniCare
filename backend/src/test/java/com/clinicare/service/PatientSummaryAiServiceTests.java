package com.clinicare.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;

import com.clinicare.client.AiClient;
import com.clinicare.dto.response.PatientSummaryAiResponseDTO;
import com.clinicare.enums.AttentionLevel;
import com.clinicare.enums.PatientStatus;
import com.clinicare.exception.ResourceNotFoundException;
import com.clinicare.model.ClinicalEvolution;
import com.clinicare.model.Patient;
import com.clinicare.repository.ClinicalEvolutionRepository;
import com.clinicare.repository.PatientRepository;

import tools.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class PatientSummaryAiServiceTests {

    @Mock PatientRepository patientRepository;
    @Mock ClinicalEvolutionRepository clinicalEvolutionRepository;
    @Mock AiClient aiClient;
    private PatientSummaryAiService service;

    @BeforeEach
    void setUp() {
        service = new PatientSummaryAiService(
                patientRepository,
                clinicalEvolutionRepository,
                aiClient,
                new ObjectMapper());
    }

    @Test
    void summarizeUsesPatientHistoryAndReturnsStructuredResponse() {
        Patient patient = createPatient();
        ClinicalEvolution evolution = new ClinicalEvolution(
                ZonedDateTime.now(),
                "Paciente estável.",
                "Estabilidade clínica.",
                "Manter acompanhamento.",
                AttentionLevel.LOW,
                patient,
                null);
        when(patientRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(patient));
        when(clinicalEvolutionRepository.findAllByPatient_IdAndActiveTrue(any(), any()))
                .thenReturn(new PageImpl<>(List.of(evolution)));
        when(aiClient.generateClinicalEvolutionAnalysis(any())).thenReturn("""
                {"summary":"Histórico estável.","suggestedAttentionLevel":"LOW","justification":"Sem sinais de alerta."}
                """);

        PatientSummaryAiResponseDTO response = service.summarize(1L);

        assertEquals("Histórico estável.", response.summary());
        assertEquals(AttentionLevel.LOW, response.suggestedAttentionLevel());
    }

    @Test
    void summarizeRejectsUnknownPatient() {
        when(patientRepository.findByIdAndActiveTrue(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.summarize(99L));
    }

    private Patient createPatient() {
        Patient patient = new Patient(
                "Paciente Teste",
                "111.222.333-44",
                LocalDate.of(1980, 1, 1),
                "",
                "",
                PatientStatus.IN_FOLLOW_UP,
                "Acompanhamento regular.");
        patient.setId(1L);
        return patient;
    }
}
