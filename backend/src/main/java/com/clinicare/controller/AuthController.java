package com.clinicare.controller;

import com.clinicare.dto.ApiResponseDTO;
import com.clinicare.dto.request.ForgotPasswordRequestDTO;
import com.clinicare.dto.request.LoginRequestDTO;
import com.clinicare.dto.request.RegisterRequestDTO;
import com.clinicare.dto.request.ResetPasswordRequestDTO;
import com.clinicare.dto.response.LoginResponseDTO;
import com.clinicare.service.AuthService;
import com.clinicare.service.PasswordResetService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthService authService, PasswordResetService passwordResetService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO<LoginResponseDTO>> login(@Valid @RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = authService.login(request);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(
                        true,
                        "Login realizado com sucesso.",
                        response,
                        null));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponseDTO<Void>> register(@Valid @RequestBody RegisterRequestDTO request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponseDTO<>(true, "Conta criada e enviada para aprovação.", null, null));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponseDTO<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO request) {
        passwordResetService.requestReset(request.email());
        return ResponseEntity.ok(
                new ApiResponseDTO<>(true, "Se houver uma conta vinculada, enviaremos as instruções.", null, null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponseDTO<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequestDTO request) {
        passwordResetService.resetPassword(request.token(), request.password());
        return ResponseEntity.ok(new ApiResponseDTO<>(true, "Senha redefinida com sucesso.", null, null));
    }
}
