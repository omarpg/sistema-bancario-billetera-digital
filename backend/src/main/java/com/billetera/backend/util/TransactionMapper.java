package com.billetera.backend.util;

import com.billetera.backend.dto.response.TransactionResponseDTO;
import com.billetera.backend.entity.Transaction;
import org.springframework.stereotype.Component;

@Component
public class TransactionMapper {

    public TransactionResponseDTO toDTO(Transaction transaction) {
        return TransactionResponseDTO.builder()
                .id(transaction.getId())
                .operationNumber(transaction.getOperationNumber())
                .type(transaction.getType())
                .status(transaction.getStatus())
                .amount(transaction.getAmount())
                .description(transaction.getDescription())
                .sourceAccountId(transaction.getSourceAccount() != null ?
                        transaction.getSourceAccount().getId() : null)
                .sourceAccountNumber(transaction.getSourceAccount() != null ?
                        transaction.getSourceAccount().getAccountNumber() : null)
                .destAccountId(transaction.getDestAccount() != null ?
                        transaction.getDestAccount().getId() : null)
                .destAccountNumber(transaction.getDestAccount() != null ?
                        transaction.getDestAccount().getAccountNumber() : null)
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}