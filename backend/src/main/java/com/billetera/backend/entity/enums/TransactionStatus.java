package com.billetera.backend.entity.enums;

public enum TransactionStatus {
    PENDING,      // Esperando confirmación OTP
    CONFIRMED,    // OTP validado, ejecutándose
    COMPLETED,    // Finalizada exitosamente
    FAILED        // Error en algún paso
}