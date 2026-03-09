package com.billetera.backend.config;

import com.billetera.backend.entity.User;
import com.billetera.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String rut) throws UsernameNotFoundException {
        User user = userRepository.findByRut(rut)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with RUT: " + rut));

        return new org.springframework.security.core.userdetails.User(
                user.getRut(),
                user.getPasswordHash(),
                new ArrayList<>() // Roles (por ahora vacío)
        );
    }
}