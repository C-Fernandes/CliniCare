package com.clinicare.controller;

import com.clinicare.dto.ApiResponseDTO;
import com.clinicare.dto.request.LoginRequestDTO;
import com.clinicare.dto.response.UserResponseDTO;
import com.clinicare.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO<UserResponseDTO>> login(@Valid @RequestBody LoginRequestDTO request) {
        UserResponseDTO response = userService.login(request);

        return ResponseEntity.ok(
                new ApiResponseDTO<>(
                        true,
                        "Login realizado com sucesso.",
                        response,
                        null));
    }
}
