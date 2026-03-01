package com.billetera.backend.repository;

import com.billetera.backend.entity.OtpCode;
import com.billetera.backend.entity.enums.OtpPurpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpCodeRepository extends JpaRepository<OtpCode, UUID> {

    Optional<OtpCode> findByUserIdAndPurposeAndIsUsedFalseAndExpiresAtAfter(
            UUID userId,
            OtpPurpose purpose,
            LocalDateTime now
    );
}