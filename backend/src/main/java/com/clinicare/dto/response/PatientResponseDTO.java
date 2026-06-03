package com.clinicare.dto.response;

import java.time.LocalDate;
import java.time.ZonedDateTime;

import com.clinicare.dto.ResponseDTO;
import com.clinicare.enums.PatientStatus;

public record PatientResponseDTO(
                Long id,
                String name,
                String cpf,
                LocalDate birthDate,
                String phone,
                String email,
                PatientStatus status,
                String notes,
                Boolean active,
                ZonedDateTime createdAt,
                ZonedDateTime updatedAt) implements ResponseDTO {
}
