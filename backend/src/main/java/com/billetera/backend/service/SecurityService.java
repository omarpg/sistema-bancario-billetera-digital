package com.billetera.backend.service;

import com.billetera.backend.dto.request.ChangePasswordRequestDTO;
import com.billetera.backend.dto.request.Toggle2FARequestDTO;
import com.billetera.backend.dto.response.SecuritySettingsDTO;
import com.billetera.backend.entity.User;
import com.billetera.backend.exception.BadRequestException;
import com.billetera.backend.exception.ResourceNotFoundException;
import com.billetera.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SecurityService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Obtener configuración de seguridad del usuario
     */
    public SecuritySettingsDTO getSettings(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        return SecuritySettingsDTO.builder()
                .twoFactorEnabled(user.getTwoFactorEnabled())
                .lastPasswordChange(user.getLastPasswordChange())
                .lastLogin(user.getLastLogin())
                .build();
    }

    /**
     * Cambiar contraseña del usuario
     */
    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Validar que las contraseñas coincidan
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Las contraseñas no coinciden");
        }

        // Verificar contraseña actual
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("La contraseña actual es incorrecta");
        }

        // Verificar que la nueva contraseña sea diferente
        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new BadRequestException("La nueva contraseña debe ser diferente a la actual");
        }

        // Actualizar contraseña
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setLastPasswordChange(LocalDateTime.now());

        userRepository.save(user);

        System.out.println("=== CONTRASEÑA CAMBIADA ===");
        System.out.println("Usuario: " + user.getEmail());
        System.out.println("Fecha: " + LocalDateTime.now());
        System.out.println("===========================");
    }

    /**
     * Activar o desactivar autenticación de dos factores
     */
    @Transactional
    public void toggle2FA(UUID userId, Toggle2FARequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Verificar contraseña
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Contraseña incorrecta");
        }

        // Actualizar estado de 2FA
        user.setTwoFactorEnabled(request.getEnable());
        userRepository.save(user);

        System.out.println("=== 2FA " + (request.getEnable() ? "ACTIVADO" : "DESACTIVADO") + " ===");
        System.out.println("Usuario: " + user.getEmail());
        System.out.println("Estado: " + (request.getEnable() ? "ACTIVO" : "INACTIVO"));
        System.out.println("Fecha: " + LocalDateTime.now());
        System.out.println("===========================");
    }
}