
package com.smartmove.backend.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    // Check duplicate vehicle number
    boolean existsByVehicleNoIgnoreCase(String vehicleNo);

    // Find vehicle using vehicle number
    Optional<Vehicle> findByVehicleNoIgnoreCase(String vehicleNo);

}

