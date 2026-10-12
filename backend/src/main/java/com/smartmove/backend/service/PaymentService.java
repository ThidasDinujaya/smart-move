package com.smartmove.backend.service;

import com.smartmove.backend.data.Booking;
import com.smartmove.backend.data.BookingRepository;
import com.smartmove.backend.data.Payment;
import com.smartmove.backend.data.PaymentRepository;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final CustomerAuthService customerAuthService;
    private final OracleProcedureService oracleProcedureService;
    private final TripCompletionService tripCompletionService;

    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository,
                         CustomerAuthService customerAuthService,
                         OracleProcedureService oracleProcedureService,
                         TripCompletionService tripCompletionService) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.customerAuthService = customerAuthService;
        this.oracleProcedureService = oracleProcedureService;
        this.tripCompletionService = tripCompletionService;
    }

    @Transactional(readOnly = true)
    public List<Payment> getAllPayments(String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "FINANCE");
        return paymentRepository.findAll();
    }

    @Transactional
    public Payment processPayment(Payment payment, String userId) {
        if (payment == null || payment.getBookingId() == null) {
            throw new IllegalArgumentException("A booking must be selected for payment.");
        }
        CustomerAuthService.CustomerView currentUser = customerAuthService.currentCustomer(userId);
        boolean isCustomer = currentUser.roles().stream().anyMatch(role -> "CUSTOMER".equalsIgnoreCase(role));
        boolean isFinance = currentUser.roles().stream().anyMatch(role ->
                "ADMIN".equalsIgnoreCase(role) || "FINANCE".equalsIgnoreCase(role));
        if (!isCustomer && !isFinance) {
            throw new IllegalArgumentException("You do not have permission to process payments.");
        }
        tripCompletionService.completeArrivedTripsBeforeReadingBookings();
        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));
        if ((isCustomer && !booking.getPassenger().getId().equals(currentUser.id())) || (!isCustomer && !isFinance)) {
            throw new IllegalArgumentException("You do not have permission to pay for this booking.");
        }
        if (!"Pending Payment".equalsIgnoreCase(booking.getBookingStatus())) {
            throw new IllegalArgumentException("This booking is not awaiting payment.");
        }
        if (paymentRepository.existsByBookingId(booking.getId())) {
            throw new IllegalArgumentException("A payment has already been recorded for this booking.");
        }
        BigDecimal expectedAmount = booking.getTotalAmount();
        if (payment.getAmount() != null && payment.getAmount().compareTo(expectedAmount) != 0) {
            throw new IllegalArgumentException("Payment amount does not match the booking total.");
        }
        if (payment.getPaymentMethod() == null || payment.getPaymentMethod().isBlank()) {
            throw new IllegalArgumentException("Select a payment method.");
        }

        try {
            oracleProcedureService.recordPayment(booking.getId(), payment.getPaymentMethod().trim());
        } catch (DataAccessException exception) {
            throw new IllegalArgumentException(exception.getMostSpecificCause().getMessage());
        }
        return paymentRepository.findByBookingId(booking.getId())
                .orElseThrow(() -> new IllegalStateException("The payment procedure did not create a payment."));
    }
}
