
package com.smartmove.backend.Controller;

import com.smartmove.backend.Data.Vehicle;
import com.smartmove.backend.Data.VehicleMediaDocument;
import com.smartmove.backend.Data.VehicleMediaRepository;
import com.smartmove.backend.Service.VehicleService;

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

    public VehicleController(VehicleService vehicleService, VehicleMediaRepository vehicleMediaRepository) {
        this.vehicleService = vehicleService;
        this.vehicleMediaRepository = vehicleMediaRepository;
    }

    // ADD VEHICLE
    @PostMapping
    public ResponseEntity<?> addVehicle(
            @RequestBody Vehicle vehicle) {

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
    public ResponseEntity<List<Vehicle>> getAllVehicles() {

        return ResponseEntity.ok(
                vehicleService.getAllVehicles()
        );
    }

    // VIEW VEHICLE BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getVehicleById(
            @PathVariable Long id) {

        try {
            Vehicle vehicle = vehicleService.getVehicleById(id);

            return ResponseEntity.ok(vehicle);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/media")
    public List<VehicleMediaDocument> getVehicleMedia(@PathVariable Long id) {
        return vehicleMediaRepository.findByVehicleOracleIdOrderByUploadedAtDesc(id);
    }

    // UPDATE VEHICLE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVehicle(
            @PathVariable Long id,
            @RequestBody Vehicle vehicle) {

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
            @PathVariable Long id) {

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

