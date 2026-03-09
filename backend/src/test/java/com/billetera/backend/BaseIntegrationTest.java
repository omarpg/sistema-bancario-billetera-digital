package com.billetera.backend;

import com.billetera.backend.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.billetera.backend.repository.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public abstract class BaseIntegrationTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected AccountRepository accountRepository;

    @Autowired
    protected ContactRepository contactRepository;

    @Autowired
    protected TransactionRepository transactionRepository;

    @Autowired
    protected OtpCodeRepository otpCodeRepository;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    @Autowired
    protected JwtUtil jwtUtil;

    @BeforeEach
    public void baseSetup() {
        // Limpiar base de datos antes de cada test
        transactionRepository.deleteAll();
        otpCodeRepository.deleteAll();
        contactRepository.deleteAll();
        accountRepository.deleteAll();
        userRepository.deleteAll();
    }
}