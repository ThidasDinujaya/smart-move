package com.smartmove.backend.controller;

import com.smartmove.backend.service.BookingService;
import com.smartmove.backend.service.CustomerAuthService;
import com.smartmove.backend.service.TripService;
import org.springframework.format.annotation.DateTimeFormat;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class TripController {

    private final TripService tripService;
    private final BookingService bookingService;

    public TripController(TripService tripService, BookingService bookingService) {
        this.tripService = tripService;
        this.bookingService = bookingService;
    }

    @GetMapping("/search")
    public List<TripService.TripView> searchTrips(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return tripService.searchTrips(from, to, date);
    }

    @GetMapping("/{id}")
    public TripService.TripView getTripById(@PathVariable Long id) {
        return tripService.getTripById(id);
    }

    @GetMapping("/{id}/seats")
    public BookingService.SeatAvailabilityView getSeatAvailability(@PathVariable Long id) {
        return bookingService.getSeatAvailability(id);
    }

    @GetMapping
    public List<TripService.TripView> getAllTrips(
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        return tripService.getAllTrips(userId);
    }

    @PostMapping
    public ResponseEntity<TripService.TripView> createTrip(
            @RequestBody TripService.TripRequest request,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        TripService.TripView trip = tripService.createTrip(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(trip);
    }

    @PutMapping("/{id}")
    public TripService.TripView updateTrip(
            @PathVariable Long id,
            @RequestBody TripService.TripRequest request,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        return tripService.updateTrip(id, request, userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelTrip(
            @PathVariable Long id,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        tripService.cancelTrip(id, userId);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(CustomerAuthService.AuthenticationFailedException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationFailure(
            CustomerAuthService.AuthenticationFailedException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(TripService.ForbiddenTripOperationException.class)
    public ResponseEntity<Map<String, String>> handleForbiddenOperation(
            TripService.ForbiddenTripOperationException exception) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(TripService.TripNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleTripNotFound(
            TripService.TripNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(TripService.TripResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleTripResourceNotFound(
            TripService.TripResourceNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(BookingService.TripNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleBookingTripNotFound(
            BookingService.TripNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleInvalidTrip(
            IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
    }

}
