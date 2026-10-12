package com.smartmove.backend.service;

import com.smartmove.backend.data.Booking;
import com.smartmove.backend.data.BookingRepository;
import com.smartmove.backend.data.Payment;
import com.smartmove.backend.data.PaymentRepository;
import com.smartmove.backend.data.Ticket;
import com.smartmove.backend.data.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final CustomerAuthService customerAuthService;

    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository,
                         TicketRepository ticketRepository, CustomerAuthService customerAuthService) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.ticketRepository = ticketRepository;
        this.customerAuthService = customerAuthService;
    }

    @Transactional(readOnly = true)
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Transactional
    public Payment processPayment(Payment payment, String userId) {
        if (payment == null || payment.getBookingId() == null) {
            throw new IllegalArgumentException("A booking must be selected for payment.");
        }
        CustomerAuthService.CustomerView currentUser = customerAuthService.currentCustomer(userId);
        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));
        boolean isCustomer = currentUser.roles().stream().anyMatch(role -> "CUSTOMER".equalsIgnoreCase(role));
        boolean isFinance = currentUser.roles().stream().anyMatch(role ->
                "ADMIN".equalsIgnoreCase(role) || "FINANCE".equalsIgnoreCase(role));
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

        payment.setId(null);
        payment.setPassengerId(booking.getPassenger().getId());
        payment.setAmount(expectedAmount);
        payment.setPaymentStatus("Successful");
        payment.setPaymentDate(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);

        booking.setBookingStatus("Confirmed");
        bookingRepository.save(booking);
        List<Ticket> tickets = ticketRepository.findByBooking_IdOrderBySeatNumberAsc(booking.getId());
        tickets.forEach(ticket -> ticket.setTicketStatus("Confirmed"));
        ticketRepository.saveAll(tickets);
        return savedPayment;
    }
}
