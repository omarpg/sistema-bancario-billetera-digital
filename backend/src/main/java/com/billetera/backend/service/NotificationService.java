package com.billetera.backend.service;

import com.billetera.backend.dto.response.NotificationResponseDTO;
import com.billetera.backend.entity.Notification;
import com.billetera.backend.exception.ResourceNotFoundException;
import com.billetera.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /**
     * Obtener últimas 20 notificaciones del usuario
     */
    public List<NotificationResponseDTO> findByUserId(UUID userId) {
        List<Notification> notifications = notificationRepository
                .findTop20ByUserIdOrderByCreatedAtDesc(userId);

        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Contar notificaciones no leídas
     */
    public long countUnread(UUID userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    /**
     * Marcar todas las notificaciones como leídas
     */
    @Transactional
    public void markAllAsRead(UUID userId) {
        List<Notification> unreadNotifications = notificationRepository
                .findByUserIdAndIsReadFalse(userId);

        unreadNotifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }

    /**
     * Marcar notificación como leída
     */
    @Transactional
    public NotificationResponseDTO markAsRead(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notificación no encontrada"));

        // Verificar propiedad
        if (!notification.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notificación no encontrada");
        }

        notification.setIsRead(true);
        notification = notificationRepository.save(notification);

        return convertToDTO(notification);
    }

    /**
     * Convertir entidad a DTO
     */
    private NotificationResponseDTO convertToDTO(Notification notification) {
        return NotificationResponseDTO.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .relatedTransactionId(notification.getRelatedTransaction() != null ?
                        notification.getRelatedTransaction().getId() : null)
                .createdAt(notification.getCreatedAt())
                .build();
    }
}