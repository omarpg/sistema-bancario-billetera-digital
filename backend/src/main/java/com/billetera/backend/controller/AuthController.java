package com.billetera.backend.controller;

import com.billetera.backend.dto.request.LoginRequestDTO;
import com.billetera.backend.dto.request.RegisterRequestDTO;
import com.billetera.backend.dto.request.VerifyOtpRequestDTO;
import com.billetera.backend.dto.response.AuthResponseDTO;
import com.billetera.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/register
     * Registro de nuevo usuario
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        AuthResponseDTO response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * POST /api/auth/login
     * Logueo con RUT/email + password
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        AuthResponseDTO response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/verify-otp
     * Validar código OTP de 2FA
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponseDTO> verifyOtp(@Valid @RequestBody VerifyOtpRequestDTO request) {
        AuthResponseDTO response = authService.verifyOtp(request);
        return ResponseEntity.ok(response);
    }
}