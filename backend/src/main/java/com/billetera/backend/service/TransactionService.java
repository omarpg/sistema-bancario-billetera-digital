package com.billetera.backend.service;

import com.billetera.backend.dto.response.TransactionResponseDTO;
import com.billetera.backend.entity.Account;
import com.billetera.backend.entity.Transaction;
//import com.billetera.backend.entity.enums.TransactionStatus;
import com.billetera.backend.exception.ResourceNotFoundException;
import com.billetera.backend.repository.AccountRepository;
import com.billetera.backend.repository.TransactionRepository;
import com.billetera.backend.util.TransactionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final TransactionMapper transactionMapper;

    /**
     * Obtener historial de transacciones de todas las cuentas del usuario
     */
    public List<TransactionResponseDTO> findByUserId(UUID userId) {
        /* Con filtro de status COMPLETED
        List<Transaction> transactions = transactionRepository
                .findByUserIdAndStatus(userId, TransactionStatus.COMPLETED);
        */
        System.out.println("=== GET USER TRANSACTIONS ===");
        System.out.println("USER_ID solicitado: " + userId);

        List<Account> userAccounts = accountRepository.findByUserId(userId);
        System.out.println("Cuentas del usuario: " + userAccounts.size());
        userAccounts.forEach(acc -> System.out.println("  - Cuenta: " + acc.getAccountNumber() + " (ID: " + acc.getId() + ")"));

        if (userAccounts.isEmpty()) {
            System.out.println("Usuario sin cuentas, retornando lista vacía");
            return Collections.emptyList();
        }

        List<UUID> accountIds = userAccounts.stream().map(Account::getId).toList();
        System.out.println("Account IDs para buscar: " + accountIds);

        //List<Transaction> transactions = transactionRepository.findByUserId(accountIds.get(0));

        // Buscar transacciones en TODAS las cuentas
        List<Transaction> transactions = transactionRepository.findByAccountIds(accountIds);
        System.out.println("Transacciones encontradas: " + transactions.size());
        transactions.forEach(tx -> System.out.println("  - TX #" + tx.getOperationNumber() + ": " + tx.getAmount()));

        return transactions.stream()
                .map(transactionMapper::toDTO).collect(Collectors.toList());
    }

    /**
     * Obtener transacciones por rango de fechas
     */
    public List<TransactionResponseDTO> findByUserIdAndDateRange(
            UUID userId,
            LocalDateTime startDate,
            LocalDateTime endDate
    ) {
        List<Transaction> transactions = transactionRepository
                .findByUserIdAndDateRange(userId, startDate, endDate);

        return transactions.stream()
                .map(transactionMapper::toDTO).collect(Collectors.toList());
    }

    /**
     * Obtener detalle de una transacción específica
     */
    public TransactionResponseDTO findById(UUID transactionId, UUID userId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transacción no encontrada"));

        // Verificar que la transacción pertenece al usuario
        boolean isOwner = transaction.getSourceAccount() != null &&
                transaction.getSourceAccount().getUser().getId().equals(userId);
        if (transaction.getDestAccount() != null &&
                transaction.getDestAccount().getUser().getId().equals(userId)) {
            isOwner = true;
        }

        if (!isOwner) {
            throw new ResourceNotFoundException("Transacción no encontrada");
        }

        return transactionMapper.toDTO(transaction);
    }
}