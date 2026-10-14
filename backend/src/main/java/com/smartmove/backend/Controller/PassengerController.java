package com.smartmove.backend.controller;

import com.smartmove.backend.data.Passenger;
import com.smartmove.backend.service.CustomerAuthService;
import com.smartmove.backend.service.PassengerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/passengers")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class PassengerController {

    private final PassengerService passengerService;

    public PassengerController(PassengerService passengerService) {
        this.passengerService = passengerService;
    }

    @GetMapping("/me")
    public Passenger getMyProfile(@RequestHeader(name = "X-User-Id", required = false) String userId) {
        return passengerService.getMyProfile(userId);
    }

    @PutMapping("/me")
    public Passenger updateMyProfile(
            @RequestBody PassengerService.ProfileUpdateRequest request,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        return passengerService.updateMyProfile(request, userId);
    }

    @GetMapping
    public List<Passenger> getAllPassengers(
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        return passengerService.getAllPassengers(userId);
    }

    @PostMapping
    public ResponseEntity<Passenger> createPassenger(
            @RequestBody PassengerService.PassengerRequest request,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        Passenger passenger = passengerService.createPassenger(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(passenger);
    }

    @PutMapping("/{id}")
    public Passenger updatePassenger(
            @PathVariable Long id,
            @RequestBody PassengerService.PassengerRequest request,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        return passengerService.updatePassenger(id, request, userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivatePassenger(
            @PathVariable Long id,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        passengerService.deactivatePassenger(id, userId);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(CustomerAuthService.AuthenticationFailedException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationFailure(
            CustomerAuthService.AuthenticationFailedException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(PassengerService.ForbiddenPassengerOperationException.class)
    public ResponseEntity<Map<String, String>> handleForbiddenOperation(
            PassengerService.ForbiddenPassengerOperationException exception) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(PassengerService.PassengerNotFoundException.class)
    public ResponseEntity<Map<String, String>> handlePassengerNotFound(
            PassengerService.PassengerNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(PassengerService.PassengerAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleDuplicatePassenger(
            PassengerService.PassengerAlreadyExistsException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleInvalidPassenger(
            IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
    }

}
