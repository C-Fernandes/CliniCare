package com.clinicare.mappers;

import org.springframework.stereotype.Component;

import com.clinicare.dto.request.NotificationRequestDTO;
import com.clinicare.dto.response.NotificationResponseDTO;
import com.clinicare.exception.ResourceNotFoundException;
import com.clinicare.model.Notification;
import com.clinicare.model.Patient;
import com.clinicare.model.User;
import com.clinicare.repository.PatientRepository;
import com.clinicare.repository.UserRepository;

@Component
public class NotificationMapper
        implements GenericMapper<Notification, NotificationRequestDTO, NotificationResponseDTO> {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public NotificationMapper(PatientRepository patientRepository, UserRepository userRepository) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Notification toEntity(NotificationRequestDTO request) {
        Notification notification = new Notification();

        notification.setTitle(request.title());
        notification.setMessage(request.message());
        notification.setType(request.type());
        notification.setPriority(request.priority());
        notification.setReadStatus(request.readStatus() != null ? request.readStatus() : false);

        if (request.patientId() != null) {
            Patient patient = patientRepository.findByIdAndActiveTrue(request.patientId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Paciente não encontrado com id: " + request.patientId()));

            notification.setPatient(patient);
        }

        if (request.recipientId() != null) {
            User recipient = userRepository.findByIdAndActiveTrue(request.recipientId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Usuário não encontrado com id: " + request.recipientId()));

            notification.setRecipient(recipient);
        }

        return notification;
    }

    @Override
    public NotificationResponseDTO toResponse(Notification entity) {
        Patient patient = entity.getPatient();
        User recipient = entity.getRecipient();

        Long patientId = patient != null ? patient.getId() : null;
        String patientName = patient != null ? patient.getName() : null;

        Long recipientId = recipient != null ? recipient.getId() : null;
        String recipientName = recipient != null ? recipient.getName() : null;

        return new NotificationResponseDTO(
                entity.getId(),
                entity.getTitle(),
                entity.getMessage(),
                entity.getType(),
                entity.getPriority(),
                entity.isReadStatus(),
                patientId,
                patientName,
                recipientId,
                recipientName,
                entity.isActive(),
                entity.getCreatedAt(),
                entity.getUpdatedAt());
    }

    @Override
    public void updateEntityFromRequest(NotificationRequestDTO request, Notification entity) {
        entity.setTitle(request.title());
        entity.setMessage(request.message());
        entity.setType(request.type());
        entity.setPriority(request.priority());
        entity.setReadStatus(request.readStatus() != null ? request.readStatus() : false);

        if (request.patientId() != null) {
            Patient patient = patientRepository.findByIdAndActiveTrue(request.patientId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Paciente não encontrado com id: " + request.patientId()));

            entity.setPatient(patient);
        } else {
            entity.setPatient(null);
        }

        if (request.recipientId() != null) {
            User recipient = userRepository.findByIdAndActiveTrue(request.recipientId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Usuário não encontrado com id: " + request.recipientId()));

            entity.setRecipient(recipient);
        } else {
            entity.setRecipient(null);
        }
    }
}
