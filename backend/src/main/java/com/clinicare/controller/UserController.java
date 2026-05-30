package com.clinicare.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
