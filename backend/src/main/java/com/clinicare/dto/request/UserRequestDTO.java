package com.clinicare.dto.request;

import com.clinicare.dto.RequestDTO;
import com.clinicare.enums.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserRequestDTO(

                @NotBlank(message = "O nome é obrigatório.") String name,

                @NotBlank(message = "O e-mail é obrigatório.") @Email(message = "Informe um e-mail válido.") String email,

                @NotBlank(message = "A senha é obrigatória.") String password,

                @NotNull(message = "O perfil do usuário é obrigatório.") UserRole role

) implements RequestDTO {
}
