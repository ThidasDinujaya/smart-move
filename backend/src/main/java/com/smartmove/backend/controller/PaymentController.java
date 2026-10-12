package com.smartmove.backend.controller;

import com.smartmove.backend.data.Payment;
import com.smartmove.backend.service.PaymentService;
import com.smartmove.backend.service.CustomerAuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @PostMapping("/process")
    public Payment processPayment(@RequestBody Payment payment,
                                  @RequestHeader(name = "X-User-Id", required = false) String userId) {
        return paymentService.processPayment(payment, userId);
    }

    @ExceptionHandler(CustomerAuthService.AuthenticationFailedException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationFailure(CustomerAuthService.AuthenticationFailedException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleInvalidPayment(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
    }

}
