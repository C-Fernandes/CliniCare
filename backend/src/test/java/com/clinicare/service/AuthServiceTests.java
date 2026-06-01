package com.clinicare.service;

import com.clinicare.dto.request.LoginRequestDTO;
import com.clinicare.dto.response.LoginResponseDTO;
import com.clinicare.enums.UserRole;
import com.clinicare.model.User;
import com.clinicare.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void loginReturnsJwtForEncodedPassword() {
        User user = createUser("$2a$encoded");
        LoginRequestDTO request = new LoginRequestDTO(user.getEmail(), "password");

        when(userRepository.findByEmailAndActiveTrue(user.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.password(), user.getPassword())).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        LoginResponseDTO response = authService.login(request);

        assertEquals("jwt-token", response.token());
        assertEquals(user.getId(), response.userId());
        assertEquals(UserRole.ADMIN, response.role());
    }

    @Test
    void loginMigratesLegacyPlainTextPassword() {
        User user = createUser("password");
        LoginRequestDTO request = new LoginRequestDTO(user.getEmail(), "password");

        when(userRepository.findByEmailAndActiveTrue(user.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.password(), user.getPassword())).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn("$2a$encoded");
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        authService.login(request);

        assertEquals("$2a$encoded", user.getPassword());
        verify(userRepository).save(user);
    }

    private User createUser(String password) {
        User user = new User("Administrador", "admin@clinicare.local", password, UserRole.ADMIN);
        user.setId(1L);
        return user;
    }
}
