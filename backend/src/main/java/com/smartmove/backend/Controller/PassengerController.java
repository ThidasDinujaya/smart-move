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
@CrossOrigin(origins = "http://localhost:5173")
public class PassengerController {

    private final PassengerService passengerService;

    public PassengerController(PassengerService passengerService) {
        this.passengerService = passengerService;
    }

    @GetMapping("/me")
    public Passenger getMyProfile(@RequestHeader(name = "Authorization", required = false) String authorization) {
        return passengerService.getMyProfile(readBearerToken(authorization));
    }

    @PutMapping("/me")
    public Passenger updateMyProfile(
            @RequestBody PassengerService.ProfileUpdateRequest request,
            @RequestHeader(name = "Authorization", required = false) String authorization) {
        return passengerService.updateMyProfile(request, readBearerToken(authorization));
    }

    @GetMapping
    public List<Passenger> getAllPassengers(
            @RequestHeader(name = "Authorization", required = false) String authorization) {
        return passengerService.getAllPassengers(readBearerToken(authorization));
    }

    @GetMapping("/{id}")
    public Passenger getPassengerById(
            @PathVariable Long id,
            @RequestHeader(name = "Authorization", required = false) String authorization) {
        return passengerService.getPassengerById(id, readBearerToken(authorization));
    }

    @PostMapping
    public ResponseEntity<Passenger> createPassenger(
            @RequestBody PassengerService.PassengerRequest request,
            @RequestHeader(name = "Authorization", required = false) String authorization) {
        Passenger passenger = passengerService.createPassenger(request, readBearerToken(authorization));
        return ResponseEntity.status(HttpStatus.CREATED).body(passenger);
    }

    @PutMapping("/{id}")
    public Passenger updatePassenger(
            @PathVariable Long id,
            @RequestBody PassengerService.PassengerRequest request,
            @RequestHeader(name = "Authorization", required = false) String authorization) {
        return passengerService.updatePassenger(id, request, readBearerToken(authorization));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivatePassenger(
            @PathVariable Long id,
            @RequestHeader(name = "Authorization", required = false) String authorization) {
        passengerService.deactivatePassenger(id, readBearerToken(authorization));
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

    private String readBearerToken(String authorization) {
        if (authorization == null || !authorization.regionMatches(true, 0, "Bearer ", 0, 7)) {
            return null;
        }
        String token = authorization.substring(7).trim();
        return token.isEmpty() ? null : token;
    }
}
