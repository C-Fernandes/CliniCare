package com.clinicare.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.clinicare.dto.request.UserRequestDTO;
import com.clinicare.dto.response.UserResponseDTO;
import com.clinicare.exception.ResourceNotFoundException;
import com.clinicare.mappers.GenericMapper;
import com.clinicare.mappers.UserMapper;
import com.clinicare.model.User;
import com.clinicare.repository.GenericRepository;
import com.clinicare.repository.UserRepository;

@Service
public class UserService implements GenericService<User, UserRequestDTO, UserResponseDTO> {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public GenericRepository<User> getRepository() {
        return userRepository;
    }

    @Override
    public GenericMapper<User, UserRequestDTO, UserResponseDTO> getMapper() {
        return userMapper;
    }

    @Override
    public UserResponseDTO create(UserRequestDTO request) {
        if (userRepository.existsByEmailAndActiveTrue(request.email())) {
            throw new IllegalArgumentException("Já existe um usuário ativo cadastrado com este e-mail.");
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setActive(true);

        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }

    @Override
    public UserResponseDTO update(Long id, UserRequestDTO request) {
        User user = userRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com id: " + id));

        userRepository.findByEmailAndActiveTrue(request.email())
                .ifPresent(existingUser -> {
                    if (!existingUser.getId().equals(id)) {
                        throw new IllegalArgumentException("Já existe outro usuário ativo cadastrado com este e-mail.");
                    }
                });

        userMapper.updateEntityFromRequest(request, user);
        user.setPassword(passwordEncoder.encode(request.password()));

        User updatedUser = userRepository.save(user);

        return userMapper.toResponse(updatedUser);
    }
}
