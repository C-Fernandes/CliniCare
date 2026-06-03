package com.clinicare.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import com.clinicare.enums.UserRole;
import com.clinicare.model.PasswordResetToken;
import com.clinicare.model.User;
import com.clinicare.repository.PasswordResetTokenRepository;
import com.clinicare.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTests {

    @Mock UserRepository userRepository;
    @Mock PasswordResetTokenRepository tokenRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock AccountEmailService emailService;
    private PasswordResetService service;

    @BeforeEach
    void setUp() {
        service = new PasswordResetService(userRepository, tokenRepository, passwordEncoder, emailService);
        ReflectionTestUtils.setField(service, "expirationMinutes", 30L);
    }

    @Test
    void requestResetCreatesTokenAndSendsEmail() {
        User user = createUser();
        when(userRepository.findByEmailAndActiveTrue(user.getEmail())).thenReturn(Optional.of(user));
        when(tokenRepository.findAllByUserIdAndActiveTrue(user.getId())).thenReturn(List.of());

        service.requestReset(user.getEmail());

        verify(tokenRepository).save(any(PasswordResetToken.class));
        verify(emailService).sendPasswordReset(any(User.class), any(String.class));
    }

    @Test
    void requestResetDoesNotRevealUnknownAccount() {
        service.requestReset("unknown@clinicare.local");
        verifyNoInteractions(tokenRepository, emailService);
    }

    @Test
    void resetPasswordChangesPasswordAndConsumesToken() {
        User user = createUser();
        PasswordResetToken token = createToken(user, ZonedDateTime.now().plusMinutes(5));
        when(tokenRepository.findByTokenHashAndActiveTrue(any(String.class))).thenReturn(Optional.of(token));
        when(passwordEncoder.encode("new-password")).thenReturn("$2a$new");

        service.resetPassword("raw-token", "new-password");

        assertEquals("$2a$new", user.getPassword());
        assertFalse(token.isActive());
        verify(userRepository).save(user);
        verify(tokenRepository).save(token);
    }

    @Test
    void resetPasswordRejectsExpiredToken() {
        PasswordResetToken token = createToken(createUser(), ZonedDateTime.now().minusMinutes(1));
        when(tokenRepository.findByTokenHashAndActiveTrue(any(String.class))).thenReturn(Optional.of(token));

        assertThrows(IllegalArgumentException.class, () -> service.resetPassword("raw-token", "new-password"));
    }

    private User createUser() {
        User user = new User("Profissional", "professional@clinicare.local", "password", UserRole.PROFESSIONAL);
        user.setId(1L);
        return user;
    }

    private PasswordResetToken createToken(User user, ZonedDateTime expiresAt) {
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setExpiresAt(expiresAt);
        token.setActive(true);
        return token;
    }
}
