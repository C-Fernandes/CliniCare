package com.clinicare.dto.response;

import java.time.LocalDateTime;

import com.clinicare.dto.ResponseDTO;
import com.clinicare.enums.UserRole;

public record UserResponseDTO(
                Long id,
                String name,
                String email,
                UserRole role,
                Boolean active,
                LocalDateTime createdAt,
                LocalDateTime updatedAt) implements ResponseDTO {
}