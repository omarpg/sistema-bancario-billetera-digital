package com.billetera.backend.service;

import com.billetera.backend.dto.request.RegisterRequestDTO;
import com.billetera.backend.entity.User;
import com.billetera.backend.exception.BadRequestException;
import com.billetera.backend.repository.UserRepository;
import com.billetera.backend.util.RutValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceSimpleTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private RutValidator rutValidator;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setup() {
        // Configurar comportamiento por defecto del RutValidator
        when(rutValidator.normalize(anyString())).thenReturn("123456789");
        when(rutValidator.isValid(anyString())).thenReturn(true);
    }

    @Test
    void testRegister_WithInvalidRut_ShouldThrowException() {
        // Arrange
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setRut("12.345.678-0");  // RUT inválido
        request.setFullName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("Password123");

        when(rutValidator.isValid(anyString())).thenReturn(false);

        // Act & Assert
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> authService.register(request)
        );

        assertEquals("RUT inválido", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void testRegister_WithDuplicateRut_ShouldThrowException() {
        // Arrange
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setRut("11.643.182-3");
        request.setFullName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("Password123");

        when(userRepository.existsByRut(anyString())).thenReturn(true);

        // Act & Assert
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> authService.register(request)
        );

        assertEquals("El RUT ya está registrado", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void testRegister_WithValidData_ShouldSucceed() {
        // Arrange
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setRut("14.811.116-2");
        request.setFullName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("Password123");

        User savedUser = User.builder()
                .rut("148111162")
                .fullName("Test User")
                .email("test@example.com")
                .passwordHash("hashedPassword")
                .twoFactorEnabled(false)
                .build();

        when(userRepository.existsByRut(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        var response = authService.register(request);

        // Assert
        assertNotNull(response);
        assertEquals("Test User", response.getFullName());
        assertEquals("test@example.com", response.getEmail());
        assertNull(response.getToken());  // No token en registro
        assertFalse(response.getRequireOtp());

        verify(userRepository, times(1)).save(any(User.class));
    }
}