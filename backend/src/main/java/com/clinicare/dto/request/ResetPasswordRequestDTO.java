package com.clinicare.dto.request;

import com.clinicare.dto.RequestDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequestDTO(
        @NotBlank(message = "Token é obrigatório.") String token,
        @NotBlank(message = "Senha é obrigatória.") @Size(min = 8, message = "A senha deve ter ao menos 8 caracteres.") String password)
        implements RequestDTO {
}
