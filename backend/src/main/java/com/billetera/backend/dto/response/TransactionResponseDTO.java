package com.billetera.backend.dto.response;

import com.billetera.backend.entity.enums.TransactionStatus;
import com.billetera.backend.entity.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponseDTO {

    private UUID id;
    private Integer operationNumber;
    private TransactionType type;
    private TransactionStatus status;
    private BigDecimal amount;
    private String description;

    // Información de cuenta origen (si existe)
    private UUID sourceAccountId;
    private String sourceAccountNumber;

    // Información de cuenta destino (si existe)
    private UUID destAccountId;
    private String destAccountNumber;

    private LocalDateTime createdAt;
}