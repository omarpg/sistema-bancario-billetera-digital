package com.billetera.backend.service;

import com.billetera.backend.dto.request.TransferConfirmRequestDTO;
import com.billetera.backend.dto.request.TransferInitiateRequestDTO;
import com.billetera.backend.dto.response.TransferResponseDTO;
import com.billetera.backend.entity.*;
import com.billetera.backend.entity.enums.NotificationType;
import com.billetera.backend.entity.enums.OtpPurpose;
import com.billetera.backend.entity.enums.TransactionStatus;
import com.billetera.backend.entity.enums.TransactionType;
import com.billetera.backend.exception.BadRequestException;
import com.billetera.backend.exception.ResourceNotFoundException;
import com.billetera.backend.repository.*;
import com.billetera.backend.util.OtpGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransferService {

    private final AccountRepository accountRepository;
    private final ContactRepository contactRepository;
    private final TransactionRepository transactionRepository;
    private final OtpCodeRepository otpCodeRepository;
    private final NotificationRepository notificationRepository;
    //private final UserRepository userRepository;
    private final OtpGenerator otpGenerator;

    /**
     * Paso 1: Iniciar transferencia
     * - Valida saldo suficiente
     * - Crea transacción con status PENDING
     * - Genera OTP
     */
    @Transactional
    public TransferResponseDTO initiate(TransferInitiateRequestDTO request, UUID userId) {
        // Buscar cuenta origen
        Account sourceAccount = accountRepository.findById(request.getSourceAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta origen no encontrada"));

        // Verificar propiedad de la cuenta
        if (!sourceAccount.getUser().getId().equals(userId)) {
            throw new BadRequestException("No tienes permiso para usar esta cuenta");
        }

        // Verificar saldo suficiente
        if (sourceAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new BadRequestException("Saldo insuficiente");
        }

        // Buscar contacto destino
        Contact contact = contactRepository.findById(request.getContactId())
                .orElseThrow(() -> new ResourceNotFoundException("Contacto no encontrado"));

        // Verificar propiedad del contacto
        if (!contact.getOwner().getId().equals(userId)) {
            throw new ResourceNotFoundException("Contacto no encontrado");
        }

        // Buscar cuenta destino por número de cuenta
        Account destinationAccount = accountRepository.findByAccountNumber(contact.getAccountNumber())
                .orElse(null); // Puede ser null si es cuenta externa

        // Generar número de operación único (Integer)
        Integer operationNumber = (int) (System.currentTimeMillis() % Integer.MAX_VALUE);

        // Crear transacción pendiente
        Transaction transaction = Transaction.builder()
                .sourceAccount(sourceAccount)
                .destAccount(destinationAccount)
                .amount(request.getAmount())
                .type(TransactionType.TRANSFER)
                .status(TransactionStatus.PENDING)
                .description(request.getDescription())
                .operationNumber(operationNumber)
                .build();

        transaction = transactionRepository.save(transaction);

        // Generar OTP
        String otpCode = otpGenerator.generate();

        OtpCode otp = OtpCode.builder()
                .user(sourceAccount.getUser())
                .code(otpCode)
                .purpose(OtpPurpose.TRANSFER_CONFIRM)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .isUsed(false)
                .build();

        otpCodeRepository.save(otp);

        // TODO: Enviar OTP por email/SMS
        System.out.println("=== OTP TRANSFERENCIA ===");
        System.out.println("Usuario: " + sourceAccount.getUser().getEmail());
        System.out.println("Código: " + otpCode);
        System.out.println("Transacción: " + transaction.getId());
        System.out.println("========================");

        return TransferResponseDTO.builder()
                .transactionId(transaction.getId())
                .operationNumber(transaction.getOperationNumber())
                .status(transaction.getStatus())
                .amount(transaction.getAmount())
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destAccountNumber(contact.getAccountNumber())
                .destName(contact.getFullName())
                .description(transaction.getDescription())
                .message("Se ha enviado un código de verificación. Expira en 5 minutos.")
                .build();
    }

    /**
     * Paso 2: Confirmar transferencia con OTP
     * - Valida OTP
     * - Ejecuta transferencia (resta de origen)
     * - Cambia status a COMPLETED
     * - Crea notificaciones
     */
    @Transactional
    public TransferResponseDTO confirm(TransferConfirmRequestDTO request, UUID userId) {
        // Buscar transacción
        Transaction transaction = transactionRepository.findById(request.getTransactionId())
                .orElseThrow(() -> new ResourceNotFoundException("Transacción no encontrada"));

        // Verificar propiedad
        if (!transaction.getSourceAccount().getUser().getId().equals(userId)) {
            throw new BadRequestException("No tienes permiso para confirmar esta transferencia");
        }

        // Verificar que esté en estado PENDING
        if (transaction.getStatus() != TransactionStatus.PENDING) {
            throw new BadRequestException("Esta transferencia ya fue procesada");
        }

        // Buscar OTP válido
        OtpCode otp = otpCodeRepository.findByUserIdAndPurposeAndIsUsedFalseAndExpiresAtAfter(
                        userId,
                        OtpPurpose.TRANSFER_CONFIRM,
                        LocalDateTime.now()
                )
                .orElseThrow(() -> new BadRequestException("Código OTP inválido o expirado"));

        // Validar código
        if (!otp.getCode().equals(request.getOtpCode())) {
            throw new BadRequestException("Código OTP incorrecto");
        }

        // Marcar OTP como usado
        otp.setIsUsed(true);
        otpCodeRepository.save(otp);

        // Ejecutar transferencia
        Account sourceAccount = transaction.getSourceAccount();

        // Verificar saldo nuevamente (por si acaso)
        if (sourceAccount.getBalance().compareTo(transaction.getAmount()) < 0) {
            transaction.setStatus(TransactionStatus.FAILED);
            transactionRepository.save(transaction);
            throw new BadRequestException("Saldo insuficiente");
        }

        // Restar de cuenta origen
        sourceAccount.setBalance(sourceAccount.getBalance().subtract(transaction.getAmount()));
        accountRepository.save(sourceAccount);

        // Actualizar estado de transacción
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction = transactionRepository.save(transaction);

        // Crear notificación para el usuario
        Notification notification = Notification.builder()
                .user(sourceAccount.getUser())
                .type(NotificationType.TRANSFER_SENT)
                .title("Transferencia exitosa")
                .message(String.format("Transferiste $%,.0f a %s",
                        transaction.getAmount(),
                        "destinatario")) // Aquí deberías obtener el nombre del contacto
                .isRead(false)
                .relatedTransaction(transaction)
                .build();

        notificationRepository.save(notification);

        return TransferResponseDTO.builder()
                .transactionId(transaction.getId())
                .operationNumber(transaction.getOperationNumber())
                .status(transaction.getStatus())
                .amount(transaction.getAmount())
                .sourceAccountNumber(sourceAccount.getAccountNumber())
                .destAccountNumber("Cuenta externa") // Mejorar con info del contacto
                .destName("Destinatario") // Mejorar con info del contacto
                .description(transaction.getDescription())
                .message("Transferencia completada exitosamente")
                .build();
    }

    /**
     * Paso 3: Generar comprobante PDF
     */
    public byte[] generateReceipt(UUID transactionId, UUID userId) {
        // Buscar transacción
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transacción no encontrada"));

        // Verificar propiedad
        if (!transaction.getSourceAccount().getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Transacción no encontrada");
        }

        // Verificar que esté completada
        if (transaction.getStatus() != TransactionStatus.COMPLETED) {
            throw new BadRequestException("Solo se pueden generar comprobantes de transferencias completadas");
        }

        // TODO: Generar PDF con iText
        // Por ahora retornamos un mensaje simple
        String receipt = String.format(
                """
                        COMPROBANTE DE TRANSFERENCIA
                        Operación: %d
                        Fecha: %s
                        Monto: $%,.0f
                        Cuenta Origen: %s
                        Descripción: %s
                        Estado: %s""",
                transaction.getOperationNumber(),
                transaction.getCreatedAt(),
                transaction.getAmount(),
                transaction.getSourceAccount().getAccountNumber(),
                transaction.getDescription(),
                transaction.getStatus()
        );

        return receipt.getBytes();
    }
}