package com.clinicare.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.clinicare.enums.NotificationPriority;
import com.clinicare.model.Notification;

public interface NotificationRepository extends GenericRepository<Notification> {

    Page<Notification> findAllByRecipient_IdAndActiveTrue(Long recipientId, Pageable pageable);

    Page<Notification> findAllByPatient_IdAndActiveTrue(Long patientId, Pageable pageable);

    Page<Notification> findAllByReadStatusFalseAndActiveTrue(Pageable pageable);

    Page<Notification> findAllByPriorityAndActiveTrue(
            NotificationPriority priority,
            Pageable pageable);
}