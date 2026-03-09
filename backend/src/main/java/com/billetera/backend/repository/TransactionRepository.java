package com.billetera.backend.repository;

import com.billetera.backend.entity.Transaction;
import com.billetera.backend.entity.enums.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    List<Transaction> findBySourceAccountIdOrDestAccountIdOrderByCreatedAtDesc(
            UUID sourceAccountId,
            UUID destAccountId
    );

    @Query("SELECT t FROM Transaction t " +
            "WHERE (t.sourceAccount.id = :userId OR t.destAccount.id = :userId) " +
            "ORDER BY t.createdAt DESC")
    List<Transaction> findByUserId(@Param("userId") UUID userId);

    @Query("SELECT t FROM Transaction t " +
            "WHERE (t.sourceAccount.id = :userId OR t.destAccount.id = :userId) " +
            "AND t.status = :status " +
            "ORDER BY t.createdAt DESC")
    List<Transaction> findByUserIdAndStatus(
            @Param("userId") UUID userId,
            @Param("status") TransactionStatus status
    );

    @Query("SELECT t FROM Transaction t " +
            "WHERE (t.sourceAccount.id = :userId OR t.destAccount.id = :userId) " +
            "AND t.createdAt BETWEEN :startDate AND :endDate " +
            "ORDER BY t.createdAt DESC")
    List<Transaction> findByUserIdAndDateRange(
            @Param("userId") UUID userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT t FROM Transaction t " +
            "WHERE t.sourceAccount.id IN :accountIds " +
            "OR t.destAccount.id IN :accountIds " +
            "ORDER BY t.createdAt DESC")
    List<Transaction> findByAccountIds(@Param("accountIds") List<UUID> accountIds);
}