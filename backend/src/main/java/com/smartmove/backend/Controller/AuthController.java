package com.smartmove.backend.controller;

import com.smartmove.backend.service.CustomerAuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final CustomerAuthService customerAuthService;

    public AuthController(CustomerAuthService customerAuthService) {
        this.customerAuthService = customerAuthService;
    }

    @PostMapping("/register")
    public ResponseEntity<CustomerAuthService.AuthResult> register(@RequestBody RegisterRequest request) {
        CustomerAuthService.AuthResult result = customerAuthService.register(
                request.fullName(),
                request.email(),
                request.phone(),
                request.password(),
                request.confirmPassword()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PostMapping("/login")
    public CustomerAuthService.AuthResult login(@RequestBody LoginRequest request) {
        return customerAuthService.login(request.email(), request.password());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader) {
        customerAuthService.logout(readBearerToken(authorizationHeader));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public CustomerAuthService.CustomerView currentCustomer(
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader) {
        return customerAuthService.currentCustomer(readBearerToken(authorizationHeader));
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

    private String readBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.regionMatches(true, 0, "Bearer ", 0, 7)) {
            return null;
        }
        String token = authorizationHeader.substring(7).trim();
        return token.isEmpty() ? null : token;
    }

    public record RegisterRequest(String fullName, String email, String phone, String password,
                                  String confirmPassword) {
    }

    public record LoginRequest(String email, String password) {
    }
}
