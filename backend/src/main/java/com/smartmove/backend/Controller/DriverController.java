
package com.smartmove.backend.Controller;

import com.smartmove.backend.Data.Driver;
import com.smartmove.backend.Service.DriverService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "http://localhost:5173")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    // ADD DRIVER
    @PostMapping
    public ResponseEntity<?> addDriver(
            @RequestBody Driver driver) {

        try {
            Driver savedDriver = driverService.addDriver(driver);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedDriver);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // VIEW ALL DRIVERS
    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(
                driverService.getAllDrivers()
        );
    }

    // VIEW DRIVER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getDriverById(
            @PathVariable Long id) {

        try {
            Driver driver = driverService.getDriverById(id);

            return ResponseEntity.ok(driver);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // UPDATE DRIVER
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDriver(
            @PathVariable Long id,
            @RequestBody Driver driver) {

        try {
            Driver updatedDriver =
                    driverService.updateDriver(id, driver);

            return ResponseEntity.ok(updatedDriver);

        } catch (IllegalArgumentException e) {

            HttpStatus status =
                    e.getMessage().startsWith("Driver not found")
                            ? HttpStatus.NOT_FOUND
                            : HttpStatus.BAD_REQUEST;

            return ResponseEntity
                    .status(status)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // DELETE DRIVER
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDriver(
            @PathVariable Long id) {

        try {
            driverService.deleteDriver(id);

            return ResponseEntity.ok(
                    Map.of("message", "Driver deleted successfully!")
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}

