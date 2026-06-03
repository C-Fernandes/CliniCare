package com.clinicare.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.ZonedDateTime;
import java.util.HexFormat;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinicare.model.PasswordResetToken;
import com.clinicare.model.User;
import com.clinicare.repository.PasswordResetTokenRepository;
import com.clinicare.repository.UserRepository;
import com.clinicare.util.AppDateTime;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AccountEmailService emailService;

    @Value("${clinicare.password-reset.expiration-minutes:30}")
    private long expirationMinutes;

    public PasswordResetService(
            UserRepository userRepository,
            PasswordResetTokenRepository tokenRepository,
            PasswordEncoder passwordEncoder,
            AccountEmailService emailService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public void requestReset(String email) {
        userRepository.findByEmailAndActiveTrue(email).ifPresent(user -> {
            tokenRepository.findAllByUserIdAndActiveTrue(user.getId()).forEach(token -> token.setActive(false));

            String rawToken = UUID.randomUUID().toString();
            PasswordResetToken token = new PasswordResetToken();
            token.setTokenHash(hash(rawToken));
            token.setUser(user);
            token.setExpiresAt(now().plusMinutes(expirationMinutes));
            tokenRepository.save(token);
            emailService.sendPasswordReset(user, rawToken);
        });
    }

    @Transactional
    public void resetPassword(String rawToken, String password) {
        PasswordResetToken token = tokenRepository.findByTokenHashAndActiveTrue(hash(rawToken))
                .orElseThrow(() -> new IllegalArgumentException("Token inválido ou já utilizado."));

        if (token.getExpiresAt().isBefore(now())) {
            throw new IllegalArgumentException("Token expirado. Solicite uma nova redefinição.");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(password));
        token.setUsedAt(now());
        token.setActive(false);
        userRepository.save(user);
        tokenRepository.save(token);
    }

    private ZonedDateTime now() {
        return AppDateTime.now();
    }

    private String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 indisponível.", exception);
        }
    }
}
