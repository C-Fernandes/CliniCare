package com.clinicare.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;

import com.clinicare.dto.ApiResponseDTO;
import com.clinicare.dto.request.UserRequestDTO;
import com.clinicare.dto.response.UserResponseDTO;
import com.clinicare.model.User;
import com.clinicare.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController extends GenericController<User, UserRequestDTO, UserResponseDTO, UserService> {

    public UserController(UserService service) {
        super(service);
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<ApiResponseDTO<UserResponseDTO>> approve(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponseDTO<>(
                true, "Usuário aprovado com sucesso.", service.approve(id), null));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<ApiResponseDTO<UserResponseDTO>> reject(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponseDTO<>(
                true, "Usuário recusado com sucesso.", service.reject(id), null));
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<ApiResponseDTO<UserResponseDTO>> activate(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponseDTO<>(
                true, "Usuário ativado com sucesso.", service.activate(id), null));
    }
}
