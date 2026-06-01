package com.clinicare.controller;

import com.clinicare.dto.ApiResponseDTO;
import com.clinicare.dto.request.LoginRequestDTO;
import com.clinicare.dto.response.LoginResponseDTO;
import com.clinicare.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
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
}
