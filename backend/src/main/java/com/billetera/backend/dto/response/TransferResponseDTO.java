package com.billetera.backend.dto.response;

import com.billetera.backend.entity.enums.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransferResponseDTO {

    private UUID transactionId;
    private Integer operationNumber;
    private TransactionStatus status;
    private BigDecimal amount;
    private String sourceAccountNumber;
    private String destAccountNumber;
    private String destName;
    private String description;
    private String message;
}