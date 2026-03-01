package com.billetera.backend.controller;

import com.billetera.backend.dto.request.TransferConfirmRequestDTO;
import com.billetera.backend.dto.request.TransferInitiateRequestDTO;
import com.billetera.backend.dto.response.TransferResponseDTO;
import com.billetera.backend.service.TransferService;
import com.billetera.backend.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/transfers")
@RequiredArgsConstructor
public class TransferController {

    private final TransferService transferService;
    private final JwtUtil jwtUtil;

    /**
     * POST /api/transfers/initiate
     * Paso 1: Iniciar transferencia y generar OTP
     */
    @PostMapping("/initiate")
    public ResponseEntity<TransferResponseDTO> initiateTransfer(
            @Valid @RequestBody TransferInitiateRequestDTO request,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        TransferResponseDTO response = transferService.initiate(request, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/transfers/confirm
     * Paso 2: Confirmar transferencia con OTP
     */
    @PostMapping("/confirm")
    public ResponseEntity<TransferResponseDTO> confirmTransfer(
            @Valid @RequestBody TransferConfirmRequestDTO request,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        TransferResponseDTO response = transferService.confirm(request, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/transfers/{id}/receipt
     * Paso 3: Descargar comprobante PDF
     */
    @GetMapping("/{id}/receipt")
    public ResponseEntity<byte[]> downloadReceipt(
            @PathVariable UUID id,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        byte[] pdfBytes = transferService.generateReceipt(id, userId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "comprobante-" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}