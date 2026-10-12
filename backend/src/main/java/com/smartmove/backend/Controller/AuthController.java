package com.smartmove.backend.controller;

import com.smartmove.backend.service.CustomerAuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class AuthController {

    private final CustomerAuthService customerAuthService;

    public AuthController(CustomerAuthService customerAuthService) {
        this.customerAuthService = customerAuthService;
    }

    @PostMapping("/register")
    public ResponseEntity<CustomerAuthService.CustomerView> register(@RequestBody RegisterRequest request) {
        CustomerAuthService.CustomerView result = customerAuthService.register(
                request.fullName(),
                request.email(),
                request.phone(),
                request.nic(),
                request.gender(),
                request.password()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PostMapping("/login")
    public CustomerAuthService.CustomerView login(@RequestBody LoginRequest request) {
        return customerAuthService.login(request.email(), request.password());
    }

    @ExceptionHandler(CustomerAuthService.EmailAlreadyInUseException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateEmail(
            CustomerAuthService.EmailAlreadyInUseException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleInvalidRequest(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(CustomerAuthService.AuthenticationFailedException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationFailure(
            CustomerAuthService.AuthenticationFailedException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", exception.getMessage()));
    }

    public record RegisterRequest(String fullName, String email, String phone, String nic, String gender,
                                  String password) {
    }

    public record LoginRequest(String email, String password) {
    }
}
