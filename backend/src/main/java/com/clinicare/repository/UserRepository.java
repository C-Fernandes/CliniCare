package com.clinicare.repository;

import java.util.Optional;

import com.clinicare.model.User;

public interface UserRepository extends GenericRepository<User> {

    Optional<User> findByEmailAndActiveTrue(String email);

    boolean existsByEmailAndActiveTrue(String email);
}