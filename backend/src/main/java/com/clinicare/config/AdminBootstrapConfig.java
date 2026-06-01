package com.clinicare.config;

import com.clinicare.enums.UserRole;
import com.clinicare.model.User;
import com.clinicare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminBootstrapConfig {

    @Bean
    CommandLineRunner createInitialAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${clinicare.bootstrap.admin.enabled:true}") boolean enabled,
            @Value("${clinicare.bootstrap.admin.name:Administrador}") String name,
            @Value("${clinicare.bootstrap.admin.email:admin@clinicare.local}") String email,
            @Value("${clinicare.bootstrap.admin.password:admin123}") String password) {
        return args -> {
            if (!enabled || userRepository.existsByEmailAndActiveTrue(email)) {
                return;
            }

            User admin = new User(name, email, passwordEncoder.encode(password), UserRole.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);
        };
    }
}
