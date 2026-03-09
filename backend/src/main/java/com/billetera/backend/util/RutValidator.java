package com.billetera.backend.util;

import org.springframework.stereotype.Component;

@Component
public class RutValidator {

    /**
     * Valida un RUT chileno usando el algoritmo Módulo 11
     * @param rut RUT con formato XX.XXX.XXX-X o sin puntos
     * @return true si el RUT es válido
     */
    public boolean isValid(String rut) {
        if (rut == null || rut.isEmpty()) {
            return false;
        }

        // Limpiar RUT (quitar puntos y guión)
        String cleanRut = rut.replace(".", "").replace("-", "");

        // Debe tener al menos 2 caracteres (número + dígito verificador)
        if (cleanRut.length() < 2) {
            return false;
        }

        // Separar número del dígito verificador
        String number = cleanRut.substring(0, cleanRut.length() - 1);
        char providedDv = cleanRut.charAt(cleanRut.length() - 1);

        // Validar que el número sea numérico
        try {
            Integer.parseInt(number);
        } catch (NumberFormatException e) {
            return false;
        }

        // Calcular dígito verificador esperado
        char calculatedDv = calculateDv(number);

        // Comparar (case insensitive para 'k' y 'K')
        return Character.toLowerCase(providedDv) == Character.toLowerCase(calculatedDv);
    }

    /**
     * Calcula el dígito verificador de un RUT usando Módulo 11
     */
    private char calculateDv(String number) {
        int sum = 0;
        int multiplier = 2;

        // Recorrer de derecha a izquierda
        for (int i = number.length() - 1; i >= 0; i--) {
            sum += Character.getNumericValue(number.charAt(i)) * multiplier;
            multiplier = multiplier == 7 ? 2 : multiplier + 1;
        }

        int remainder = 11 - (sum % 11);

        if (remainder == 11) {
            return '0';
        } else if (remainder == 10) {
            return 'K';
        } else {
            return (char) ('0' + remainder);
        }
    }

    /**
     * Normaliza un RUT a formato sin puntos ni guión
     */
    public String normalize(String rut) {
        if (rut == null) {
            return null;
        }
        return rut.replace(".", "").replace("-", "").toUpperCase();
    }
}