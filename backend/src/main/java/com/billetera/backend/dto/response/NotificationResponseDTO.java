package com.billetera.backend.dto.response;

import com.billetera.backend.entity.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDTO {

    private UUID id;
    private NotificationType type;
    private String title;
    private String message;
    private Boolean isRead;
    private UUID relatedTransactionId;
    private LocalDateTime createdAt;
}