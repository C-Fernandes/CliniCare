package com.clinicare.dto.request;

import com.clinicare.dto.RequestDTO;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequestDTO(
        @NotBlank(message = "E-mail é obrigatório.") @Email(message = "E-mail inválido.") String email)
        implements RequestDTO {
}
