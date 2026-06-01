package com.clinicare.repository;

import java.util.List;
import java.util.Optional;

import com.clinicare.model.PasswordResetToken;

public interface PasswordResetTokenRepository extends GenericRepository<PasswordResetToken> {

    Optional<PasswordResetToken> findByTokenHashAndActiveTrue(String tokenHash);

    List<PasswordResetToken> findAllByUserIdAndActiveTrue(Long userId);
}
