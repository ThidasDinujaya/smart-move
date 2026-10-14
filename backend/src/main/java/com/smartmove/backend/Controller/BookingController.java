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
import org.springframework.web.bind.annotation.PutMapping;
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
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        BookingService.BookingView booking = bookingService.createBooking(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    @PostMapping("/admin")
    public ResponseEntity<BookingService.BookingView> createBookingForStaff(
            @RequestBody BookingService.StaffBookingRequest request,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        BookingService.BookingView booking = bookingService.createBookingForStaff(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    @PutMapping("/admin/{bookingId}")
    public BookingService.BookingView updateBookingForStaff(
            @PathVariable Long bookingId,
            @RequestBody BookingService.StaffBookingRequest request,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        return bookingService.updateBookingForStaff(bookingId, request, userId);
    }

    @GetMapping("/admin")
    public List<BookingService.BookingView> getAllBookingsForStaff(
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        return bookingService.getAllBookingsForStaff(userId);
    }

    @DeleteMapping("/admin/{bookingId}")
    public ResponseEntity<Void> cancelBookingForStaff(
            @PathVariable Long bookingId,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        bookingService.cancelBookingForStaff(bookingId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<BookingService.BookingView> getMyBookings(
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        return bookingService.getMyBookings(userId);
    }

    @GetMapping("/{bookingId}")
    public BookingService.BookingView getMyBooking(
            @PathVariable Long bookingId,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        return bookingService.getMyBooking(bookingId, userId);
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Void> cancelMyBooking(
            @PathVariable Long bookingId,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        bookingService.cancelMyBooking(bookingId, userId);
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

}
