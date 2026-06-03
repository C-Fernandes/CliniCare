package com.clinicare.dto.response;

import java.time.ZonedDateTime;

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
                ZonedDateTime createdAt,
                ZonedDateTime updatedAt) implements ResponseDTO {
}
