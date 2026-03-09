package com.billetera.backend.repository;

import com.billetera.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByRut(String rut);

    Optional<User> findByEmail(String email);

    boolean existsByRut(String rut);

    boolean existsByEmail(String email);
}