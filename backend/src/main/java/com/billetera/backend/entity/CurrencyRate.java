package com.billetera.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "currency_rates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CurrencyRate {

    @Id
    @Column(length = 10)
    private String code;

    @Column(nullable = false, precision = 10, scale = 4)
    private BigDecimal value;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}