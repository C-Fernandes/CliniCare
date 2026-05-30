package com.clinicare.dto.request;

import com.clinicare.dto.RequestDTO;
import com.clinicare.enums.NotificationPriority;
import com.clinicare.enums.NotificationType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NotificationRequestDTO(

                @NotBlank(message = "O título da notificação é obrigatório.") String title,

                @NotBlank(message = "A mensagem da notificação é obrigatória.") String message,

                @NotNull(message = "O tipo da notificação é obrigatório.") NotificationType type,

                @NotNull(message = "A prioridade da notificação é obrigatória.") NotificationPriority priority,

                Boolean readStatus,

                Long patientId,

                Long recipientId

) implements RequestDTO {
}
