package com.clinicare.dto.response;

import java.time.LocalDateTime;

import com.clinicare.dto.ResponseDTO;
import com.clinicare.enums.NotificationPriority;
import com.clinicare.enums.NotificationType;

public record NotificationResponseDTO(
                Long id,
                String title,
                String message,
                NotificationType type,
                NotificationPriority priority,
                Boolean readStatus,
                Long patientId,
                String patientName,
                Long recipientId,
                String recipientName,
                Boolean active,
                LocalDateTime createdAt,
                LocalDateTime updatedAt) implements ResponseDTO {
}