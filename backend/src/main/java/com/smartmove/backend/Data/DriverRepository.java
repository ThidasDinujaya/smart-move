
package com.smartmove.backend.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {

    boolean existsByNicIgnoreCase(String nic);

    boolean existsByLicenseNoIgnoreCase(String licenseNo);

    Optional<Driver> findByNicIgnoreCase(String nic);

    Optional<Driver> findByLicenseNoIgnoreCase(String licenseNo);
}

