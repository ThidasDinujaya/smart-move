
package com.smartmove.backend.controller;

import com.smartmove.backend.data.Driver;
import com.smartmove.backend.service.DriverService;
import com.smartmove.backend.service.CustomerAuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class DriverController {

    private final DriverService driverService;
    private final CustomerAuthService customerAuthService;

    public DriverController(DriverService driverService, CustomerAuthService customerAuthService) {
        this.driverService = driverService;
        this.customerAuthService = customerAuthService;
    }

    // ADD DRIVER
    @PostMapping
    public ResponseEntity<?> addDriver(
            @RequestBody Driver driver,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "OPERATIONS");

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
    public ResponseEntity<List<Driver>> getAllDrivers(
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "OPERATIONS");
        return ResponseEntity.ok(
                driverService.getAllDrivers()
        );
    }

    // UPDATE DRIVER
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDriver(
            @PathVariable Long id,
            @RequestBody Driver driver,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "OPERATIONS");

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
            @PathVariable Long id,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "OPERATIONS");

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

