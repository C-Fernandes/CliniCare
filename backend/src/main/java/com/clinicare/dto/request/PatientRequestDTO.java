package com.clinicare.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

import com.clinicare.dto.RequestDTO;
import com.clinicare.enums.PatientStatus;

public record PatientRequestDTO(

                @NotBlank(message = "O nome do paciente é obrigatório.") String name,

                @NotBlank(message = "O CPF é obrigatório.") String cpf,

                @NotNull(message = "A data de nascimento é obrigatória.") LocalDate birthDate,

                String phone,

                @Email(message = "Informe um e-mail válido.") String email,

                @NotNull(message = "O status do paciente é obrigatório.") PatientStatus status,

                String notes

) implements RequestDTO {
}
