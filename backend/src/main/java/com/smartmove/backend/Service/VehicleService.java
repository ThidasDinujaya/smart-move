
package com.smartmove.backend.Service;

import com.smartmove.backend.Data.Vehicle;
import com.smartmove.backend.Data.VehicleRepository;
import com.smartmove.backend.Data.VehicleMediaDocument;
import com.smartmove.backend.Data.VehicleMediaRepository;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMediaRepository vehicleMediaRepository;

    public VehicleService(VehicleRepository vehicleRepository, VehicleMediaRepository vehicleMediaRepository) {
        this.vehicleRepository = vehicleRepository;
        this.vehicleMediaRepository = vehicleMediaRepository;
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

        String imageData = vehicle.getImageData();
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return saveVehicleImage(savedVehicle, imageData);
    }

    // VIEW ALL VEHICLES
    public List<Vehicle> getAllVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        vehicles.forEach(this::attachVehicleImage);
        return vehicles;
    }

    // VIEW VEHICLE BY ID
    public Vehicle getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Vehicle not found with ID: " + id
                        )
                );
        return attachVehicleImage(vehicle);
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
        existingVehicle.setStatus(updatedVehicle.getStatus());

        String imageData = updatedVehicle.getImageData();
        if (imageData == null || imageData.isBlank()) {
            imageData = existingVehicle.getImageData();
        }
        Vehicle savedVehicle = vehicleRepository.save(existingVehicle);
        return saveVehicleImage(savedVehicle, imageData);
    }

    // DELETE VEHICLE
    public void deleteVehicle(Long id) {

        Vehicle existingVehicle = getVehicleById(id);

        vehicleRepository.delete(existingVehicle);
        vehicleMediaRepository.deleteByVehicleOracleId(id);
    }

    private Vehicle attachVehicleImage(Vehicle vehicle) {
        vehicleMediaRepository
                .findFirstByVehicleOracleIdAndMediaTypeAndImageDataIsNotNullOrderByUploadedAtDesc(
                        vehicle.getId(), "PHOTO")
                .ifPresent(media -> vehicle.setImageData(media.getImageData()));
        return vehicle;
    }

    private Vehicle saveVehicleImage(Vehicle vehicle, String imageData) {
        if (imageData == null || imageData.isBlank()) {
            return attachVehicleImage(vehicle);
        }

        VehicleMediaDocument media = vehicleMediaRepository
                .findFirstByVehicleOracleIdAndMediaTypeAndImageDataIsNotNullOrderByUploadedAtDesc(
                        vehicle.getId(), "PHOTO")
                .orElseGet(VehicleMediaDocument::new);
        media.setVehicleOracleId(vehicle.getId());
        media.setRegistrationNo(vehicle.getVehicleNo());
        media.setMediaType("PHOTO");
        media.setFileName(vehicle.getVehicleNo() + "-photo");
        media.setContentType(imageContentType(imageData));
        media.setImageData(imageData);
        media.setUploadedAt(Instant.now());
        vehicleMediaRepository.save(media);
        vehicle.setImageData(imageData);
        return vehicle;
    }

    private String imageContentType(String imageData) {
        int separator = imageData.indexOf(';');
        if (imageData.startsWith("data:") && separator > 5) {
            return imageData.substring(5, separator);
        }
        return "application/octet-stream";
    }
}

