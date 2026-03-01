package com.billetera.backend.controller;

import com.billetera.backend.dto.response.AccountResponseDTO;
import com.billetera.backend.service.AccountService;
import com.billetera.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    private final JwtUtil jwtUtil;

    /**
     * GET /api/accounts
     * Listar todas las cuentas del usuario autenticado
     */
    @GetMapping
    public ResponseEntity<List<AccountResponseDTO>> getAccounts(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        List<AccountResponseDTO> accounts = accountService.findByUserId(userId);
        return ResponseEntity.ok(accounts);
    }

    /**
     * GET /api/accounts/{id}
     * Obtener detalle de una cuenta específica
     */
    @GetMapping("/{id}")
    public ResponseEntity<AccountResponseDTO> getAccountById(
            @PathVariable UUID id,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        AccountResponseDTO account = accountService.findById(id, userId);
        return ResponseEntity.ok(account);
    }
}