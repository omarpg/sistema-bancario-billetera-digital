package com.billetera.backend.controller;

import com.billetera.backend.dto.request.ChangePasswordRequestDTO;
import com.billetera.backend.dto.request.Toggle2FARequestDTO;
import com.billetera.backend.dto.response.SecuritySettingsDTO;
import com.billetera.backend.service.SecurityService;
import com.billetera.backend.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/security")
@RequiredArgsConstructor
public class SecurityController {

    private final SecurityService securityService;
    private final JwtUtil jwtUtil;

    /**
     * GET /api/security/settings
     * Obtener configuración de seguridad del usuario
     */
    @GetMapping("/settings")
    public ResponseEntity<SecuritySettingsDTO> getSettings(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        SecuritySettingsDTO settings = securityService.getSettings(userId);
        return ResponseEntity.ok(settings);
    }

    /**
     * PUT /api/security/change-password
     * Cambiar contraseña del usuario
     */
    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @RequestBody @Valid ChangePasswordRequestDTO request,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        securityService.changePassword(userId, request);
        return ResponseEntity.ok().build();
    }

    /**
     * PUT /api/security/2fa
     * Activar o desactivar autenticación de dos factores
     */
    @PutMapping("/2fa")
    public ResponseEntity<Void> toggle2FA(
            @RequestBody @Valid Toggle2FARequestDTO request,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        securityService.toggle2FA(userId, request);
        return ResponseEntity.ok().build();
    }
}