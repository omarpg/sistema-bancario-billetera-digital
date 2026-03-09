package com.billetera.backend.repository;

import com.billetera.backend.entity.CurrencyRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CurrencyRateRepository extends JpaRepository<CurrencyRate, String> {

    Optional<CurrencyRate> findByCode(String code);
}