package com.billetera.backend.util;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class RutValidatorTest {

    @Autowired
    private RutValidator rutValidator;

    @Test
    void testValidRutWithDots() {
        assertTrue(rutValidator.isValid("20.320.604-6"));
    }

    @Test
    void testValidRutWithoutDots() {
        assertTrue(rutValidator.isValid("203206046"));
    }

    @Test
    void testValidRutWithK() {
        assertTrue(rutValidator.isValid("16.417.980-K"));
    }

    @Test
    void testInvalidRut() {
        assertFalse(rutValidator.isValid("12.345.678-0"));
    }

    @Test
    void testInvalidRutTooShort() {
        assertFalse(rutValidator.isValid("123"));
    }

    @Test
    void testNullRut() {
        assertFalse(rutValidator.isValid(null));
    }

    @Test
    void testEmptyRut() {
        assertFalse(rutValidator.isValid(""));
    }

    @Test
    void testNormalizeRut() {
        String normalized = rutValidator.normalize("20.320.604-6");
        assertEquals("203206046", normalized);
    }

    @Test
    void testNormalizeRutWithK() {
        String normalized = rutValidator.normalize("16.417.980-k");
        assertEquals("16417980K", normalized);
    }
}