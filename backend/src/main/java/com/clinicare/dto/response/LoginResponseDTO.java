package com.clinicare.dto.response;

import com.clinicare.enums.UserRole;

public record LoginResponseDTO(
        String token,
        Long userId,
        String name,
        String email,
        UserRole role) {
}
