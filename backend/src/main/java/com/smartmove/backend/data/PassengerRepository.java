package com.smartmove.backend.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByNicIgnoreCase(String nic);

    Optional<Passenger> findByEmailIgnoreCase(String email);

    Optional<Passenger> findByNicIgnoreCase(String nic);
}
