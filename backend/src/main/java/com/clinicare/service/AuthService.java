package com.clinicare.service;

import com.clinicare.dto.response.LoginResponseDTO;
import com.clinicare.dto.request.LoginRequestDTO;
import com.clinicare.dto.request.RegisterRequestDTO;
import com.clinicare.enums.UserApprovalStatus;
import com.clinicare.enums.UserRole;
import com.clinicare.model.User;
import com.clinicare.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmailAndActiveTrue(request.email())
                .orElseThrow(() -> new BadCredentialsException("E-mail ou senha inválidos."));

        boolean passwordMatches = passwordEncoder.matches(request.password(), user.getPassword());

        if (!passwordMatches && request.password().equals(user.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.password()));
            userRepository.save(user);
            passwordMatches = true;
        }

        if (!passwordMatches) {
            throw new BadCredentialsException("E-mail ou senha inválidos.");
        }

        if (!user.isApproved()) {
            throw new BadCredentialsException("Conta aguardando aprovação do administrador.");
        }

        String token = jwtService.generateToken(user);

        return new LoginResponseDTO(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole());
    }

    public void register(RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Já existe uma conta cadastrada com este e-mail.");
        }

        User user = new User(request.name(), request.email(), passwordEncoder.encode(request.password()),
                UserRole.PROFESSIONAL);
        user.setApprovalStatus(UserApprovalStatus.PENDING);
        user.setActive(true);
        userRepository.save(user);
    }
}
