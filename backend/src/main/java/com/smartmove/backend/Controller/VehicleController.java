
package com.smartmove.backend.controller;

import com.smartmove.backend.data.Vehicle;
import com.smartmove.backend.data.VehicleMediaDocument;
import com.smartmove.backend.data.VehicleMediaRepository;
import com.smartmove.backend.service.VehicleService;
import com.smartmove.backend.service.CustomerAuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class VehicleController {

    private final VehicleService vehicleService;
    private final VehicleMediaRepository vehicleMediaRepository;
    private final CustomerAuthService customerAuthService;

    public VehicleController(VehicleService vehicleService, VehicleMediaRepository vehicleMediaRepository,
                             CustomerAuthService customerAuthService) {
        this.vehicleService = vehicleService;
        this.vehicleMediaRepository = vehicleMediaRepository;
        this.customerAuthService = customerAuthService;
    }

    // ADD VEHICLE
    @PostMapping
    public ResponseEntity<?> addVehicle(
            @RequestBody Vehicle vehicle,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "OPERATIONS");

        try {
            Vehicle savedVehicle =
                    vehicleService.addVehicle(vehicle);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedVehicle);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // VIEW ALL VEHICLES
    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles(
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "OPERATIONS");

        return ResponseEntity.ok(
                vehicleService.getAllVehicles()
        );
    }

    @GetMapping("/{id}/media")
    public List<VehicleMediaDocument> getVehicleMedia(
            @PathVariable Long id,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "OPERATIONS");
        return vehicleMediaRepository.findByVehicleOracleIdOrderByUploadedAtDesc(id);
    }

    // UPDATE VEHICLE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVehicle(
            @PathVariable Long id,
            @RequestBody Vehicle vehicle,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "OPERATIONS");

        try {
            Vehicle updatedVehicle =
                    vehicleService.updateVehicle(id, vehicle);

            return ResponseEntity.ok(updatedVehicle);

        } catch (IllegalArgumentException e) {

            HttpStatus status =
                    e.getMessage().startsWith("Vehicle not found")
                            ? HttpStatus.NOT_FOUND
                            : HttpStatus.BAD_REQUEST;

            return ResponseEntity
                    .status(status)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // DELETE VEHICLE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(
            @PathVariable Long id,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "OPERATIONS");

        try {
            vehicleService.deleteVehicle(id);

            return ResponseEntity.ok(
                    Map.of("message", "Vehicle deleted successfully!")
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}

