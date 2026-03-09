package com.billetera.backend.controller;

import com.billetera.backend.dto.response.TransactionResponseDTO;
import com.billetera.backend.service.TransactionService;
import com.billetera.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final JwtUtil jwtUtil;

    /**
     * GET /api/transactions
     * Obtener historial de transacciones
     * Query params opcionales: dateFrom, dateTo
     */
    @GetMapping
    public ResponseEntity<List<TransactionResponseDTO>> getTransactions(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        List<TransactionResponseDTO> transactions;

        if (dateFrom != null && dateTo != null) {
            transactions = transactionService.findByUserIdAndDateRange(userId, dateFrom, dateTo);
        } else {
            transactions = transactionService.findByUserId(userId);
        }

        return ResponseEntity.ok(transactions);
    }

    /**
     * GET /api/transactions/{id}
     * Obtener detalle de una transacción específica
     */
    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponseDTO> getTransactionById(
            @PathVariable UUID id,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        TransactionResponseDTO transaction = transactionService.findById(id, userId);
        return ResponseEntity.ok(transaction);
    }
}