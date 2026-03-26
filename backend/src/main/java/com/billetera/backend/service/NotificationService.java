package com.billetera.backend.service;

import com.billetera.backend.dto.response.NotificationResponseDTO;
import com.billetera.backend.entity.Account;
import com.billetera.backend.entity.Notification;
import com.billetera.backend.entity.Transaction;
import com.billetera.backend.entity.User;
import com.billetera.backend.entity.enums.NotificationType;
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
                .findTop20ByUserIdOrderByIsReadAscCreatedAtDesc(userId);

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

    /**
     * Crear notificaciones para una transferencia completada
     */
    @Transactional
    public void createTransferNotifications(Transaction transaction, Account sourceAccount, Account destAccount) {

        // Caso 1: Transferencia a cuenta externa (contacto de otro banco)
        // destAccount es null o no tiene user asociado
        if (destAccount == null || destAccount.getUser() == null) {
            Notification notification = Notification.builder()
                    .user(sourceAccount.getUser())
                    .type(NotificationType.TRANSFER_SENT)
                    .title("Transferencia exitosa")
                    .message(String.format("Transferiste $%,.0f a cuenta externa",
                            transaction.getAmount()))
                    .isRead(false)
                    .relatedTransaction(transaction)
                    .build();

            notificationRepository.save(notification);

            System.out.println("=== NOTIFICACIÓN CREADA ===");
            System.out.println("Tipo: TRANSFER_SENT (cuenta externa)");
            System.out.println("Usuario: " + sourceAccount.getUser().getEmail());
            System.out.println("========================");
            return;
        }

        // Caso 2: Transferencia entre cuentas propias
        if (destAccount.getUser().getId().equals(sourceAccount.getUser().getId())) {
            Notification notification = Notification.builder()
                    .user(sourceAccount.getUser())
                    .type(NotificationType.SYSTEM)
                    .title("Transferencia entre tus cuentas")
                    .message(String.format("Transferiste $%,.0f desde tu cuenta %s a tu cuenta %s",
                            transaction.getAmount(),
                            sourceAccount.getType(),
                            destAccount.getType()))
                    .isRead(false)
                    .relatedTransaction(transaction)
                    .build();

            notificationRepository.save(notification);

            System.out.println("=== NOTIFICACIÓN CREADA ===");
            System.out.println("Tipo: SYSTEM (transferencia entre cuentas propias)");
            System.out.println("Usuario: " + sourceAccount.getUser().getEmail());
            System.out.println("========================");
            return;
        }

        // Caso 3: Transferencia a otro usuario de Billetera Digital
        // Crear 2 notificaciones: una para quien envía y otra para quien recibe

        // Notificación para quien envía
        Notification sentNotification = Notification.builder()
                .user(sourceAccount.getUser())
                .type(NotificationType.TRANSFER_SENT)
                .title("Transferencia exitosa")
                .message(String.format("Transferiste $%,.0f a %s",
                        transaction.getAmount(),
                        destAccount.getUser().getFullName()))
                .isRead(false)
                .relatedTransaction(transaction)
                .build();

        notificationRepository.save(sentNotification);

        // Notificación para quien recibe
        Notification receivedNotification = Notification.builder()
                .user(destAccount.getUser())
                .type(NotificationType.TRANSFER_RECEIVED)
                .title("Transferencia recibida")
                .message(String.format("Recibiste $%,.0f de %s",
                        transaction.getAmount(),
                        sourceAccount.getUser().getFullName()))
                .isRead(false)
                .relatedTransaction(transaction)
                .build();

        notificationRepository.save(receivedNotification);

        System.out.println("=== NOTIFICACIONES CREADAS ===");
        System.out.println("Tipo: TRANSFER_SENT");
        System.out.println("Usuario (emisor): " + sourceAccount.getUser().getEmail());
        System.out.println("---");
        System.out.println("Tipo: TRANSFER_RECEIVED");
        System.out.println("Usuario (receptor): " + destAccount.getUser().getEmail());
        System.out.println("===========================");
    }

    /**
     * Crear notificación de contraseña cambiada
     */
    @Transactional
    public void createPasswordChangedNotification(User user) {
        Notification notification = Notification.builder()
                .user(user)
                .type(NotificationType.PASSWORD_CHANGED)
                .title("Contraseña actualizada")
                .message("Tu contraseña ha sido cambiada exitosamente. Si no fuiste tú, contacta soporte inmediatamente.")
                .isRead(false)
                .build();

        notificationRepository.save(notification);

        System.out.println("=== NOTIFICACIÓN CREADA ===");
        System.out.println("Tipo: PASSWORD_CHANGED");
        System.out.println("Usuario: " + user.getEmail());
        System.out.println("========================");
    }

    /**
     * Crear notificación de sistema genérica
     */
    @Transactional
    public void createSystemNotification(User user, String title, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .type(NotificationType.SYSTEM)
                .title(title)
                .message(message)
                .isRead(false)
                .build();

        notificationRepository.save(notification);
    }

    /**
     * Crear notificación de cuenta creada automáticamente
     */
    @Transactional
    public void createAccountCreatedNotification(User user, Account account) {
        Notification notification = Notification.builder()
                .user(user)
                .type(NotificationType.SYSTEM)
                .title("Bienvenido a Billetera Digital - Cuenta creada")
                .message(String.format("Se ha creado tu cuenta %s con número %s. Saldo inicial: $500.000",
                        account.getType(),
                        account.getAccountNumber()))
                .isRead(false)
                .build();

        notificationRepository.save(notification);

        System.out.println("=== NOTIFICACIÓN DE CUENTA CREADA ===");
        System.out.println("Usuario: " + user.getEmail());
        System.out.println("Cuenta: " + account.getAccountNumber());
        System.out.println("=====================================");
    }
}