package com.smartmove.backend.controller;

import com.smartmove.backend.service.BookingService;
import com.smartmove.backend.service.CustomerAuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingService.BookingView> createBooking(
            @RequestBody BookingService.BookingRequest request,
            @RequestHeader(name = "Authorization", required = false) String authorization) {
        BookingService.BookingView booking = bookingService.createBooking(request, readBearerToken(authorization));
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    @PostMapping("/admin")
    public ResponseEntity<BookingService.BookingView> createBookingForStaff(
            @RequestBody BookingService.StaffBookingRequest request,
            @RequestHeader(name = "Authorization", required = false) String authorization) {
        BookingService.BookingView booking = bookingService.createBookingForStaff(request, readBearerToken(authorization));
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    @GetMapping("/admin")
    public List<BookingService.BookingView> getAllBookingsForStaff(
            @RequestHeader(name = "Authorization", required = false) String authorization) {
        return bookingService.getAllBookingsForStaff(readBearerToken(authorization));
    }

    @DeleteMapping("/admin/{bookingId}")
    public ResponseEntity<Void> cancelBookingForStaff(
            @PathVariable Long bookingId,
            @RequestHeader(name = "Authorization", required = false) String authorization) {
        bookingService.cancelBookingForStaff(bookingId, readBearerToken(authorization));
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<BookingService.BookingView> getMyBookings(
            @RequestHeader(name = "Authorization", required = false) String authorization) {
        return bookingService.getMyBookings(readBearerToken(authorization));
    }

    @GetMapping("/{bookingId}")
    public BookingService.BookingView getMyBooking(
            @PathVariable Long bookingId,
            @RequestHeader(name = "Authorization", required = false) String authorization) {
        return bookingService.getMyBooking(bookingId, readBearerToken(authorization));
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Void> cancelMyBooking(
            @PathVariable Long bookingId,
            @RequestHeader(name = "Authorization", required = false) String authorization) {
        bookingService.cancelMyBooking(bookingId, readBearerToken(authorization));
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(CustomerAuthService.AuthenticationFailedException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationFailure(
            CustomerAuthService.AuthenticationFailedException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(BookingService.ForbiddenBookingOperationException.class)
    public ResponseEntity<Map<String, String>> handleForbiddenOperation(
            BookingService.ForbiddenBookingOperationException exception) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler({
            BookingService.BookingNotFoundException.class,
            BookingService.TripNotFoundException.class
    })
    public ResponseEntity<Map<String, String>> handleNotFound(RuntimeException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(BookingService.BookingConflictException.class)
    public ResponseEntity<Map<String, String>> handleBookingConflict(
            BookingService.BookingConflictException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleInvalidRequest(IllegalArgumentException exception) {
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
