
package com.smartmove.backend.service;

import com.smartmove.backend.data.Driver;
import com.smartmove.backend.data.DriverRepository;
import com.smartmove.backend.data.Vehicle;
import com.smartmove.backend.data.VehicleRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverService {

    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;

    public DriverService(DriverRepository driverRepository, VehicleRepository vehicleRepository) {
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
    }

    // ADD DRIVER
    public Driver addDriver(Driver driver) {

        validateRequiredFields(driver);

        String nic = driver.getNic().trim();
        String licenseNo = driver.getLicenseNo().trim();

        if (driverRepository.existsByNicIgnoreCase(nic)) {
            throw new IllegalArgumentException(
                    "Driver NIC already exists!"
            );
        }

        if (driverRepository.existsByLicenseNoIgnoreCase(licenseNo)) {
            throw new IllegalArgumentException(
                    "Driver license number already exists!"
            );
        }

        driver.setId(null);
        driver.setName(driver.getName().trim());
        driver.setNic(nic);
        driver.setLicenseNo(licenseNo);
        driver.setVehicle(findVehicle(driver.getAssignedVehicle()));

        return driverRepository.save(driver);
    }

    // VIEW ALL DRIVERS
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    // VIEW DRIVER BY ID
    public Driver getDriverById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Driver not found with ID: " + id
                        )
                );
    }

    // UPDATE DRIVER
    public Driver updateDriver(Long id, Driver updatedDriver) {

        Driver existingDriver = getDriverById(id);

        validateRequiredFields(updatedDriver);

        String nic = updatedDriver.getNic().trim();
        String licenseNo = updatedDriver.getLicenseNo().trim();

        Driver duplicateNic = driverRepository
                .findByNicIgnoreCase(nic)
                .orElse(null);

        if (duplicateNic != null &&
                !duplicateNic.getId().equals(id)) {
            throw new IllegalArgumentException(
                    "Driver NIC already exists!"
            );
        }

        Driver duplicateLicense = driverRepository
                .findByLicenseNoIgnoreCase(licenseNo)
                .orElse(null);

        if (duplicateLicense != null &&
                !duplicateLicense.getId().equals(id)) {
            throw new IllegalArgumentException(
                    "Driver license number already exists!"
            );
        }

        existingDriver.setName(updatedDriver.getName().trim());
        existingDriver.setNic(nic);
        existingDriver.setLicenseNo(licenseNo);
        existingDriver.setContact(updatedDriver.getContact());
        existingDriver.setEmail(updatedDriver.getEmail());
        existingDriver.setVehicle(findVehicle(updatedDriver.getAssignedVehicle()));
        existingDriver.setAddress(updatedDriver.getAddress());
        existingDriver.setStatus(updatedDriver.getStatus());

        return driverRepository.save(existingDriver);
    }

    // DELETE DRIVER
    public void deleteDriver(Long id) {
        Driver driver = getDriverById(id);
        driverRepository.delete(driver);
    }

    // REQUIRED FIELD VALIDATION
    private void validateRequiredFields(Driver driver) {

        if (driver.getName() == null ||
                driver.getName().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Driver name is required!"
            );
        }

        if (driver.getNic() == null ||
                driver.getNic().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Driver NIC is required!"
            );
        }

        if (driver.getLicenseNo() == null ||
                driver.getLicenseNo().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Driver license number is required!"
            );
        }
    }

    private Vehicle findVehicle(String vehicleNo) {
        if (vehicleNo == null || vehicleNo.isBlank()) return null;
        return vehicleRepository.findByVehicleNoIgnoreCase(vehicleNo.trim())
                .orElseThrow(() -> new IllegalArgumentException("The assigned vehicle was not found."));
    }
}

