
package com.smartmove.backend.Service;

import com.smartmove.backend.Data.Vehicle;
import com.smartmove.backend.Data.VehicleRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    // Constructor Injection
    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    // ADD VEHICLE
    public Vehicle addVehicle(Vehicle vehicle) {

        if (vehicle.getVehicleNo() == null ||
                vehicle.getVehicleNo().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Vehicle number is required!"
            );
        }

        String vehicleNo = vehicle.getVehicleNo().trim();

        if (vehicleRepository.existsByVehicleNoIgnoreCase(vehicleNo)) {
            throw new IllegalArgumentException(
                    "Vehicle number already exists!"
            );
        }

        vehicle.setId(null);
        vehicle.setVehicleNo(vehicleNo);

        return vehicleRepository.save(vehicle);
    }

    // VIEW ALL VEHICLES
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    // VIEW VEHICLE BY ID
    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Vehicle not found with ID: " + id
                        )
                );
    }

    // UPDATE VEHICLE
    public Vehicle updateVehicle(Long id, Vehicle updatedVehicle) {

        Vehicle existingVehicle = getVehicleById(id);

        if (updatedVehicle.getVehicleNo() == null ||
                updatedVehicle.getVehicleNo().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Vehicle number is required!"
            );
        }

        String vehicleNo = updatedVehicle.getVehicleNo().trim();

        Vehicle duplicate = vehicleRepository
                .findByVehicleNoIgnoreCase(vehicleNo)
                .orElse(null);

        if (duplicate != null && !duplicate.getId().equals(id)) {
            throw new IllegalArgumentException(
                    "Vehicle number already exists!"
            );
        }

        existingVehicle.setVehicleNo(vehicleNo);
        existingVehicle.setVehicleType(updatedVehicle.getVehicleType());
        existingVehicle.setBrand(updatedVehicle.getBrand());
        existingVehicle.setModel(updatedVehicle.getModel());
        existingVehicle.setManufactureYear(updatedVehicle.getManufactureYear());
        existingVehicle.setSeatingCapacity(
                updatedVehicle.getSeatingCapacity()
        );
        existingVehicle.setFuelType(updatedVehicle.getFuelType());
        existingVehicle.setLastServiceDate(updatedVehicle.getLastServiceDate());
        existingVehicle.setImageData(updatedVehicle.getImageData());
        existingVehicle.setStatus(updatedVehicle.getStatus());

        return vehicleRepository.save(existingVehicle);
    }

    // DELETE VEHICLE
    public void deleteVehicle(Long id) {

        Vehicle existingVehicle = getVehicleById(id);

        vehicleRepository.delete(existingVehicle);
    }
}

