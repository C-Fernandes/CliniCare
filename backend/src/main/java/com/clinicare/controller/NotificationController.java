package com.clinicare.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clinicare.dto.ApiResponseDTO;
import com.clinicare.dto.request.NotificationRequestDTO;
import com.clinicare.dto.response.NotificationResponseDTO;
import com.clinicare.enums.NotificationPriority;
import com.clinicare.model.Notification;
import com.clinicare.service.NotificationService;

@RestController
@RequestMapping("/notifications")
public class NotificationController
                extends
                GenericController<Notification, NotificationRequestDTO, NotificationResponseDTO, NotificationService> {

        public NotificationController(NotificationService service) {
                super(service);
        }

        @GetMapping("/unread")
        public ResponseEntity<ApiResponseDTO<Page<NotificationResponseDTO>>> findUnread(Pageable pageable) {
                Page<NotificationResponseDTO> response = service.findUnread(pageable);

                return ResponseEntity.ok(
                                new ApiResponseDTO<>(
                                                true,
                                                "Notificações não lidas encontradas com sucesso.",
                                                response,
                                                null));
        }

        @GetMapping("/filter/priority")
        public ResponseEntity<ApiResponseDTO<Page<NotificationResponseDTO>>> findByPriority(
                        @RequestParam NotificationPriority priority,
                        Pageable pageable) {
                Page<NotificationResponseDTO> response = service.findByPriority(priority, pageable);

                return ResponseEntity.ok(
                                new ApiResponseDTO<>(
                                                true,
                                                "Notificações encontradas com sucesso.",
                                                response,
                                                null));
        }

        @PatchMapping("/{id}/read")
        public ResponseEntity<ApiResponseDTO<Void>> markAsRead(@PathVariable Long id) {
                service.markAsRead(id);

                return ResponseEntity.ok(
                                new ApiResponseDTO<>(
                                                true,
                                                "Notificação marcada como lida com sucesso.",
                                                null,
                                                null));
        }
}