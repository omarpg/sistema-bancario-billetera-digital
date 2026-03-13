package com.billetera.backend.service;

import com.billetera.backend.dto.request.LoginRequestDTO;
import com.billetera.backend.dto.request.RegisterRequestDTO;
import com.billetera.backend.dto.request.VerifyOtpRequestDTO;
import com.billetera.backend.dto.response.AuthResponseDTO;
import com.billetera.backend.entity.Account;
import com.billetera.backend.entity.OtpCode;
import com.billetera.backend.entity.User;
import com.billetera.backend.entity.enums.AccountStatus;
import com.billetera.backend.entity.enums.AccountType;
import com.billetera.backend.entity.enums.OtpPurpose;
import com.billetera.backend.exception.BadRequestException;
import com.billetera.backend.exception.ResourceNotFoundException;
import com.billetera.backend.repository.AccountRepository;
import com.billetera.backend.repository.OtpCodeRepository;
import com.billetera.backend.repository.UserRepository;
import com.billetera.backend.util.JwtUtil;
import com.billetera.backend.util.OtpGenerator;
import com.billetera.backend.util.RutValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;

    private final AccountRepository accountRepository;

    private final OtpCodeRepository otpCodeRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    private final RutValidator rutValidator;

    private final OtpGenerator otpGenerator;

    /**
     * Tarea 2.5 — Registro de nuevo usuario
     */
    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO request) {
        // Validar RUT con Módulo 11
        String normalizedRut = rutValidator.normalize(request.getRut());
        if (!rutValidator.isValid(normalizedRut)) {
            throw new BadRequestException("RUT inválido");
        }

        // Verificar que el RUT no exista
        if (userRepository.existsByRut(normalizedRut)) {
            throw new BadRequestException("El RUT ya está registrado");
        }

        // Verificar que el email no exista
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("El email ya está registrado");
        }

        // Crear usuario
        User user = User.builder()
                .rut(normalizedRut)
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .twoFactorEnabled(false) // Por defecto deshabilitado
                .build();

        user = userRepository.save(user);

        // CREAR CUENTA VISTA AUTOMÁTICAMENTE
        Account defaultAccount = Account.builder()
                .user(user)
                .accountNumber(generateAccountNumber())
                .type(AccountType.VISTA)
                .status(AccountStatus.ACTIVE)
                .balance(BigDecimal.ZERO)
                .currency("CLP")
                .build();

        accountRepository.save(defaultAccount);

        System.out.println("=== CUENTA CREADA AUTOMÁTICAMENTE ===");
        System.out.println("Usuario: " + user.getFullName());
        System.out.println("Cuenta: " + defaultAccount.getAccountNumber());
        System.out.println("Tipo: VISTA");
        System.out.println("====================================");

        return AuthResponseDTO.builder()
                .userId(user.getId())
                .rut(user.getRut())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .token(null) // No enviamos token, usuario debe hacer login
                .requireOtp(false)
                .message("Usuario registrado exitosamente. Por favor inicia sesión.")
                .build();
    }

    /**
     * Tarea 2.6 — Login (fase 1)
     */
    @Transactional
    public AuthResponseDTO login(LoginRequestDTO request) {
        // Buscar usuario por RUT o email
        User user = findByIdentifier(request.getIdentifier());

        // Validar contraseña
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Credenciales incorrectas");
        }

        // Actualizar último login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Si tiene 2FA habilitado
        if (user.getTwoFactorEnabled()) {
            // Generar OTP
            String otpCode = otpGenerator.generate();

            OtpCode otp = OtpCode.builder()
                    .user(user)
                    .code(otpCode)
                    .purpose(OtpPurpose.LOGIN_2FA)
                    .expiresAt(LocalDateTime.now().plusMinutes(5))
                    .isUsed(false)
                    .build();

            otpCodeRepository.save(otp);

            // TODO: Enviar OTP por email o SMS (por ahora solo lo guardamos en BD)
            // En desarrollo, puedes loggearlo:
            System.out.println("=== OTP GENERADO ===");
            System.out.println("Usuario: " + user.getEmail());
            System.out.println("Código: " + otpCode);
            System.out.println("Expira: " + otp.getExpiresAt());
            System.out.println("====================");

            return AuthResponseDTO.builder()
                    .userId(user.getId())
                    .rut(user.getRut())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .token(null) // No enviamos token todavía
                    .requireOtp(true)
                    .message("Se ha enviado un código de verificación a tu email")
                    .build();
        }

        // Si NO tiene 2FA, generar JWT directamente
        String token = jwtUtil.generateToken(user.getId(), user.getRut(), user.getEmail());

        return AuthResponseDTO.builder()
                .userId(user.getId())
                .rut(user.getRut())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .token(token)
                .requireOtp(false)
                .message("Login exitoso")
                .build();
    }

    /**
     * Tarea 2.7 — Verificar OTP
     */
    @Transactional
    public AuthResponseDTO verifyOtp(VerifyOtpRequestDTO request) {
        // Buscar usuario
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Buscar OTP válido (no usado y no expirado)
        OtpCode otp = otpCodeRepository.findByUserIdAndPurposeAndIsUsedFalseAndExpiresAtAfter(
                        user.getId(),
                        OtpPurpose.LOGIN_2FA,
                        LocalDateTime.now()
                )
                .orElseThrow(() -> new BadRequestException("Código OTP inválido o expirado"));

        // Validar código
        if (!otp.getCode().equals(request.getCode())) {
            throw new BadRequestException("Código OTP incorrecto");
        }

        // Marcar OTP como usado
        otp.setIsUsed(true);
        otpCodeRepository.save(otp);

        // Generar JWT final
        String token = jwtUtil.generateToken(user.getId(), user.getRut(), user.getEmail());

        return AuthResponseDTO.builder()
                .userId(user.getId())
                .rut(user.getRut())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .token(token)
                .requireOtp(false)
                .message("Autenticación completada exitosamente")
                .build();
    }

    /**
     * Helper: Buscar usuario por RUT o email
     */
    private User findByIdentifier(String identifier) {

        System.out.println("╔════════════════════════════════════╗");
        System.out.println("║  FIND BY IDENTIFIER - DEBUG        ║");
        System.out.println("╠════════════════════════════════════╣");
        System.out.println("║ Input: " + identifier);
        System.out.println("║ Contiene @: " + identifier.contains("@"));
        System.out.println("╚════════════════════════════════════╝");

        // Primero intentar como email
        if (identifier.contains("@")) {
            System.out.println("→ Buscando por EMAIL");
            return userRepository.findByEmail(identifier)
                    .orElseThrow(() -> new BadRequestException("Credenciales incorrectas"));
        }

        // Si no tiene @, intentar normalizar como RUT
        System.out.println("→ Buscando por RUT");
        String normalized = rutValidator.normalize(identifier);
        System.out.println("→ RUT normalizado: " + normalized);

        // Validar que sea un RUT válido
        if (rutValidator.isValid(normalized)) {
            return userRepository.findByRut(normalized)
                    .orElseThrow(() -> new BadRequestException("Credenciales incorrectas"));
        }

        // Si llegamos aquí, no es ni email ni RUT válido
        throw new BadRequestException("Formato de identificador inválido");
    }

    /**
     * Auxiliar para generar número de cuenta único
     */
    private String generateAccountNumber() {
        // Generar número de cuenta de 10 dígitos
        // Usar timestamp + random para evitar colisiones
        long timestamp = System.currentTimeMillis();
        int random = (int) (Math.random() * 1000);
        String accountNumber = String.format("%010d", (timestamp + random) % 10000000000L);

        // Verificar que no exista (muy poco probable, pero mejor verificar)
        while (accountRepository.existsByAccountNumber(accountNumber)) {
            random = (int) (Math.random() * 1000);
            accountNumber = String.format("%010d", (timestamp + random) % 10000000000L);
        }

        return accountNumber;
    }
}