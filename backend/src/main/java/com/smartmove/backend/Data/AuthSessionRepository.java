package com.smartmove.backend.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface AuthSessionRepository extends JpaRepository<AuthSession, Long> {

    Optional<AuthSession> findByTokenHashAndExpiresAtAfter(String tokenHash, LocalDateTime currentTime);

    long deleteByTokenHash(String tokenHash);

    long deleteAllByUser_Id(Long userId);
}
