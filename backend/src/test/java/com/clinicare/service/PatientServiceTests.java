package com.clinicare.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import com.clinicare.dto.response.PatientResponseDTO;
import com.clinicare.enums.PatientStatus;
import com.clinicare.mappers.PatientMapper;
import com.clinicare.model.Patient;
import com.clinicare.repository.PatientRepository;

@ExtendWith(MockitoExtension.class)
class PatientServiceTests {

    @Mock PatientRepository patientRepository;
    @Mock PatientMapper patientMapper;
    @InjectMocks PatientService patientService;

    @Test
    void searchReturnsPaginatedPatientsUsingServerSideFilters() {
        PageRequest pageable = PageRequest.of(0, 10);
        Patient patient = new Patient();
        PatientResponseDTO response = new PatientResponseDTO(
                1L, "Ana", "111.222.333-44", null, "", "", PatientStatus.IN_FOLLOW_UP, "", true, null, null);
        when(patientRepository.findAll(any(Specification.class), any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of(patient), pageable, 1));
        when(patientMapper.toResponse(patient)).thenReturn(response);

        var result = patientService.search("ana", PatientStatus.IN_FOLLOW_UP, pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals(response, result.getContent().getFirst());
    }
}
