package com.clinicare.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.clinicare.dto.request.NotificationRequestDTO;
import com.clinicare.dto.response.NotificationResponseDTO;
import com.clinicare.enums.AttentionLevel;
import com.clinicare.enums.NotificationPriority;
import com.clinicare.enums.NotificationType;
import com.clinicare.mappers.GenericMapper;
import com.clinicare.mappers.NotificationMapper;
import com.clinicare.model.ClinicalEvolution;
import com.clinicare.model.Notification;
import com.clinicare.model.Patient;
import com.clinicare.model.User;
import com.clinicare.repository.GenericRepository;
import com.clinicare.repository.NotificationRepository;

@Service
public class NotificationService
        implements GenericService<Notification, NotificationRequestDTO, NotificationResponseDTO> {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    public NotificationService(
            NotificationRepository notificationRepository,
            NotificationMapper notificationMapper) {
        this.notificationRepository = notificationRepository;
        this.notificationMapper = notificationMapper;
    }

    @Override
    public GenericRepository<Notification> getRepository() {
        return notificationRepository;
    }

    @Override
    public GenericMapper<Notification, NotificationRequestDTO, NotificationResponseDTO> getMapper() {
        return notificationMapper;
    }

    public Page<NotificationResponseDTO> findUnread(Pageable pageable) {
        return notificationRepository
                .findAllByReadStatusFalseAndActiveTrue(pageable)
                .map(notificationMapper::toResponse);
    }

    public Page<NotificationResponseDTO> findByPriority(NotificationPriority priority, Pageable pageable) {
        return notificationRepository
                .findAllByPriorityAndActiveTrue(priority, pageable)
                .map(notificationMapper::toResponse);
    }

    public void markAsRead(Long id) {
        Notification notification = findEntityById(id);

        notification.setReadStatus(true);

        notificationRepository.save(notification);
    }

    @Async
    public void createFromClinicalEvolution(ClinicalEvolution evolution) {
        Patient patient = evolution.getPatient();
        User professional = evolution.getProfessional();

        boolean isHighAttention = evolution.getAttentionLevel() == AttentionLevel.HIGH;

        Notification notification = new Notification();

        if (isHighAttention) {
            notification.setTitle("Evolução clínica de alta prioridade");
            notification.setMessage("Uma evolução clínica de alta prioridade foi registrada para o paciente "
                    + patient.getName() + ".");
            notification.setType(NotificationType.HIGH_ATTENTION_EVOLUTION);
            notification.setPriority(NotificationPriority.HIGH);
        } else {
            notification.setTitle("Nova evolução clínica registrada");
            notification
                    .setMessage("Uma nova evolução clínica foi registrada para o paciente " + patient.getName() + ".");
            notification.setType(NotificationType.CLINICAL_EVOLUTION_CREATED);
            notification.setPriority(NotificationPriority.MEDIUM);
        }

        notification.setReadStatus(false);
        notification.setPatient(patient);
        notification.setRecipient(professional);
        notification.setActive(true);

        notificationRepository.save(notification);
    }
}