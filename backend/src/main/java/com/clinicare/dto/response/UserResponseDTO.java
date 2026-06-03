package com.clinicare.dto.response;

import java.time.ZonedDateTime;

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
                ZonedDateTime createdAt,
                ZonedDateTime updatedAt) implements ResponseDTO {
}
