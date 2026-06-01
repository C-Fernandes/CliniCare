package com.clinicare.dto.response;

import java.time.LocalDateTime;

import com.clinicare.dto.ResponseDTO;
import com.clinicare.enums.UserRole;
import com.clinicare.enums.UserApprovalStatus;

public record UserResponseDTO(
                Long id,
                String name,
                String email,
                UserRole role,
                UserApprovalStatus approvalStatus,
                Boolean active,
                LocalDateTime createdAt,
                LocalDateTime updatedAt) implements ResponseDTO {
}
