package com.clinicare.service;

import com.clinicare.dto.request.UserRequestDTO;
import com.clinicare.dto.response.UserResponseDTO;
import com.clinicare.enums.UserRole;
import com.clinicare.enums.UserApprovalStatus;
import com.clinicare.mappers.UserMapper;
import com.clinicare.model.User;
import com.clinicare.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class UserServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AccountEmailService emailService;

    @InjectMocks
    private UserService userService;

    @Test
    void createEncodesPasswordBeforeSavingUser() {
        UserRequestDTO request = new UserRequestDTO(
                "Profissional",
                "professional@clinicare.local",
                "password",
                UserRole.PROFESSIONAL);
        User user = new User(request.name(), request.email(), request.password(), request.role());
        UserResponseDTO response = new UserResponseDTO(
                1L,
                request.name(),
                request.email(),
                request.role(),
                UserApprovalStatus.APPROVED,
                true,
                null,
                null);

        when(userMapper.toEntity(request)).thenReturn(user);
        when(passwordEncoder.encode(request.password())).thenReturn("$2a$encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userMapper.toResponse(user)).thenReturn(response);

        userService.create(request);

        assertEquals("$2a$encoded", user.getPassword());
        assertEquals(UserApprovalStatus.APPROVED, user.getApprovalStatus());
    }

    @Test
    void approveUpdatesStatusAndSendsEmail() {
        User user = new User("Profissional", "professional@clinicare.local", "password", UserRole.PROFESSIONAL);
        user.setId(1L);
        user.setApprovalStatus(UserApprovalStatus.PENDING);
        when(userRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        userService.approve(1L);

        assertEquals(UserApprovalStatus.APPROVED, user.getApprovalStatus());
        verify(emailService).sendAccountApproved(user);
    }

    @Test
    void findAllIncludesInactiveUsers() {
        User activeUser = new User("Ativo", "active@clinicare.local", "password", UserRole.PROFESSIONAL);
        activeUser.setId(1L);
        User inactiveUser = new User("Inativo", "inactive@clinicare.local", "password", UserRole.PROFESSIONAL);
        inactiveUser.setId(2L);
        inactiveUser.setActive(false);
        UserResponseDTO activeResponse = new UserResponseDTO(
                1L, activeUser.getName(), activeUser.getEmail(), activeUser.getRole(), activeUser.getApprovalStatus(),
                true, null, null);
        UserResponseDTO inactiveResponse = new UserResponseDTO(
                2L, inactiveUser.getName(), inactiveUser.getEmail(), inactiveUser.getRole(),
                inactiveUser.getApprovalStatus(), false, null, null);

        when(userRepository.findAll(Pageable.unpaged())).thenReturn(new PageImpl<>(List.of(activeUser, inactiveUser)));
        when(userMapper.toResponse(activeUser)).thenReturn(activeResponse);
        when(userMapper.toResponse(inactiveUser)).thenReturn(inactiveResponse);

        var response = userService.findAll(Pageable.unpaged());

        assertEquals(2, response.getTotalElements());
        assertTrue(response.getContent().stream().anyMatch(user -> Boolean.FALSE.equals(user.active())));
    }

    @Test
    void activateRestoresInactiveUser() {
        User user = new User("Profissional", "professional@clinicare.local", "password", UserRole.PROFESSIONAL);
        user.setId(1L);
        user.setActive(false);
        UserResponseDTO response = new UserResponseDTO(
                1L,
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getApprovalStatus(),
                true,
                null,
                null);

        when(userRepository.findByIdIncludingInactive(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toResponse(user)).thenReturn(response);

        UserResponseDTO activatedUser = userService.activate(1L);

        assertTrue(user.isActive());
        assertTrue(activatedUser.active());
    }

    @Test
    void updateDoesNotAllowChangingPassword() {
        UserRequestDTO request = new UserRequestDTO(
                "Profissional Atualizado",
                "professional@clinicare.local",
                "new-password",
                UserRole.PROFESSIONAL);
        User user = new User("Profissional", request.email(), "$2a$current", request.role());
        user.setId(1L);
        when(userRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(user));
        when(userRepository.findByEmailAndActiveTrue(request.email())).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        userService.update(1L, request);

        assertEquals("$2a$current", user.getPassword());
        verify(passwordEncoder, never()).encode(any());
    }

    @Test
    void rejectUpdatesStatus() {
        User user = new User("Profissional", "professional@clinicare.local", "password", UserRole.PROFESSIONAL);
        user.setId(1L);
        when(userRepository.findByIdAndActiveTrue(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        userService.reject(1L);

        assertEquals(UserApprovalStatus.REJECTED, user.getApprovalStatus());
    }
}
