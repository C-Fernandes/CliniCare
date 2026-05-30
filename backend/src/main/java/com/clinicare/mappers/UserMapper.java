package com.clinicare.mappers;

import org.springframework.stereotype.Component;

import com.clinicare.dto.request.UserRequestDTO;
import com.clinicare.dto.response.UserResponseDTO;
import com.clinicare.model.User;

@Component
public class UserMapper implements GenericMapper<User, UserRequestDTO, UserResponseDTO> {

    @Override
    public User toEntity(UserRequestDTO request) {
        User user = new User();

        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(request.password());
        user.setRole(request.role());

        return user;
    }

    @Override
    public UserResponseDTO toResponse(User entity) {
        return new UserResponseDTO(
                entity.getId(),
                entity.getName(),
                entity.getEmail(),
                entity.getRole(),
                entity.isActive(),
                entity.getCreatedAt(),
                entity.getUpdatedAt());
    }

    @Override
    public void updateEntityFromRequest(UserRequestDTO request, User entity) {
        entity.setName(request.name());
        entity.setEmail(request.email());
        entity.setPassword(request.password());
        entity.setRole(request.role());
    }
}
