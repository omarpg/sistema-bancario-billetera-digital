package com.billetera.backend.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class OtpGenerator {

    private static final SecureRandom random = new SecureRandom();

    /**
     * Genera un código OTP de 6 dígitos
     * @return String con el código (ej: "482917")
     */
    public String generate() {
        int otp = 100000 + random.nextInt(900000); // Rango: 100000-999999
        return String.valueOf(otp);
    }
}