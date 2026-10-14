package com.smartmove.backend.service;

import com.smartmove.backend.data.Booking;
import com.smartmove.backend.data.BookingRepository;
import com.smartmove.backend.data.Passenger;
import com.smartmove.backend.data.PassengerRepository;
import com.smartmove.backend.data.Ticket;
import com.smartmove.backend.data.TicketRepository;
import com.smartmove.backend.data.Trip;
import com.smartmove.backend.data.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class BookingService {

    private static final String PENDING_PAYMENT = "Pending Payment";
    private static final String RESERVED = "Reserved";
    private static final String CONFIRMED = "Confirmed";
    private static final String ISSUED = "Issued";
    private static final String CANCELLED = "Cancelled";
    private static final List<String> ACTIVE_TICKET_STATUSES = List.of(RESERVED, CONFIRMED, ISSUED);

    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final TripRepository tripRepository;
    private final PassengerRepository passengerRepository;
    private final CustomerAuthService customerAuthService;
    private final SecureRandom secureRandom = new SecureRandom();

    public BookingService(
            BookingRepository bookingRepository,
            TicketRepository ticketRepository,
            TripRepository tripRepository,
            PassengerRepository passengerRepository,
            CustomerAuthService customerAuthService) {
        this.bookingRepository = bookingRepository;
        this.ticketRepository = ticketRepository;
        this.tripRepository = tripRepository;
        this.passengerRepository = passengerRepository;
        this.customerAuthService = customerAuthService;
    }

    @Transactional
    public BookingView createBooking(BookingRequest request, String userId) {
        Passenger passenger = requireCustomer(userId);
        return createBookingForPassenger(request, passenger);
    }

    @Transactional
    public BookingView createBookingForStaff(StaffBookingRequest request, String userId) {
        requireStaffRole(userId);
        if (request == null || request.passengerId() == null) {
            throw new IllegalArgumentException("A passenger must be selected.");
        }
        Passenger passenger = passengerRepository.findById(request.passengerId())
                .orElseThrow(() -> new BookingNotFoundException("Passenger not found."));
        if (!"Active".equalsIgnoreCase(passenger.getStatus())) {
            throw new BookingConflictException("This passenger account is not active.");
        }
        return createBookingForPassenger(new BookingRequest(request.tripId(), request.seatNumbers()), passenger);
    }

    private BookingView createBookingForPassenger(BookingRequest request, Passenger passenger) {
        if (request == null || request.tripId() == null) {
            throw new IllegalArgumentException("A trip must be selected.");
        }

        Trip trip = tripRepository.findByIdForUpdate(request.tripId())
                .orElseThrow(() -> new TripNotFoundException("Trip not found."));
        ensureTripCanBeBooked(trip);

        List<Integer> seatNumbers = normalizeSeatNumbers(request.seatNumbers(), trip.getSeatCapacity());
        for (Integer seatNumber : seatNumbers) {
            if (ticketRepository.existsByTrip_IdAndSeatNumberIgnoreCaseAndTicketStatusIn(
                    trip.getId(), seatNumber.toString(), ACTIVE_TICKET_STATUSES)) {
                throw new BookingConflictException("Seat " + seatNumber + " is no longer available.");
            }
        }

        Booking booking = new Booking();
        booking.setBookingReference(createBookingReference());
        booking.setPassenger(passenger);
        booking.setTrip(trip);
        booking.setSeatCount(seatNumbers.size());
        booking.setTotalAmount(trip.getFare()
                .multiply(BigDecimal.valueOf(seatNumbers.size()))
                .setScale(2, RoundingMode.HALF_UP));
        booking.setBookingStatus(PENDING_PAYMENT);
        booking = bookingRepository.save(booking);

        List<Ticket> tickets = new ArrayList<>();
        for (Integer seatNumber : seatNumbers) {
            Ticket ticket = new Ticket();
            ticket.setTicketNumber(createTicketNumber());
            ticket.setBooking(booking);
            ticket.setTrip(trip);
            ticket.setSeatNumber(seatNumber.toString());
            ticket.setTicketStatus(RESERVED);
            tickets.add(ticket);
        }
        tickets = ticketRepository.saveAll(tickets);

        return toView(booking, tickets);
    }

    @Transactional(readOnly = true)
    public List<BookingView> getAllBookingsForStaff(String userId) {
        requireStaffReadRole(userId);
        return bookingRepository.findAllByOrderByBookingDateDesc()
                .stream()
                .map(booking -> toView(booking, ticketRepository.findByBooking_IdOrderBySeatNumberAsc(booking.getId())))
                .toList();
    }

    @Transactional
    public void cancelBookingForStaff(Long bookingId, String userId) {
        requireStaffRole(userId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found."));
        if (CANCELLED.equalsIgnoreCase(booking.getBookingStatus())) return;
        booking.setBookingStatus(CANCELLED);
        bookingRepository.save(booking);
        List<Ticket> tickets = ticketRepository.findByBooking_IdOrderBySeatNumberAsc(booking.getId());
        tickets.forEach(ticket -> ticket.setTicketStatus(CANCELLED));
        ticketRepository.saveAll(tickets);
    }

    @Transactional(readOnly = true)
    public List<BookingView> getMyBookings(String userId) {
        Passenger passenger = requireCustomer(userId);
        return bookingRepository.findByPassenger_IdOrderByBookingDateDesc(passenger.getId())
                .stream()
                .map(booking -> toView(booking, ticketRepository.findByBooking_IdOrderBySeatNumberAsc(booking.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public BookingView getMyBooking(Long bookingId, String userId) {
        Passenger passenger = requireCustomer(userId);
        Booking booking = findOwnedBooking(bookingId, passenger.getId());
        return toView(booking, ticketRepository.findByBooking_IdOrderBySeatNumberAsc(booking.getId()));
    }

    @Transactional(readOnly = true)
    public SeatAvailabilityView getSeatAvailability(Long tripId) {
        Trip trip = findTrip(tripId);
        List<Ticket> activeTickets = ticketRepository
                .findByTrip_IdAndTicketStatusIn(tripId, ACTIVE_TICKET_STATUSES);
        List<Integer> reservedSeats = activeTickets.stream()
                .map(ticket -> Integer.valueOf(ticket.getSeatNumber()))
                .distinct()
                .sorted()
                .toList();
        int capacity = trip.getSeatCapacity();
        return new SeatAvailabilityView(
                trip.getId(),
                capacity,
                Math.max(0, capacity - reservedSeats.size()),
                reservedSeats,
                isTripBookable(trip)
        );
    }

    @Transactional
    public void cancelMyBooking(Long bookingId, String userId) {
        Passenger passenger = requireCustomer(userId);
        Booking booking = findOwnedBooking(bookingId, passenger.getId());
        Trip trip = tripRepository.findByIdForUpdate(booking.getTrip().getId())
                .orElseThrow(() -> new TripNotFoundException("Trip not found."));

        if (CANCELLED.equalsIgnoreCase(booking.getBookingStatus())) {
            return;
        }
        if (!PENDING_PAYMENT.equalsIgnoreCase(booking.getBookingStatus())
                && !CONFIRMED.equalsIgnoreCase(booking.getBookingStatus())) {
            throw new BookingConflictException("This booking can no longer be cancelled.");
        }
        if (trip.getTripDate().atTime(trip.getDepartureTime()).isBefore(LocalDateTime.now())) {
            throw new BookingConflictException("A booking cannot be cancelled after the trip has departed.");
        }

        booking.setBookingStatus(CANCELLED);
        bookingRepository.save(booking);
        List<Ticket> tickets = ticketRepository.findByBooking_IdOrderBySeatNumberAsc(booking.getId());
        tickets.forEach(ticket -> ticket.setTicketStatus(CANCELLED));
        ticketRepository.saveAll(tickets);
    }

    private Passenger requireCustomer(String userId) {
        CustomerAuthService.CustomerView currentUser = customerAuthService.currentCustomer(userId);
        boolean isCustomer = currentUser.roles().stream().anyMatch(role -> "CUSTOMER".equalsIgnoreCase(role));
        if (!isCustomer) {
            throw new ForbiddenBookingOperationException("A customer account is required to manage bookings.");
        }
        Passenger passenger = passengerRepository.findById(currentUser.id())
                .orElseThrow(() -> new CustomerAuthService.AuthenticationFailedException(
                        "Your customer account is unavailable."));
        if (!"Active".equalsIgnoreCase(passenger.getStatus())) {
            throw new CustomerAuthService.AuthenticationFailedException("Your customer account is not active.");
        }
        return passenger;
    }

    private void requireStaffRole(String userId) {
        CustomerAuthService.CustomerView currentUser = customerAuthService.currentCustomer(userId);
        boolean isStaff = currentUser.roles().stream().anyMatch(role ->
                "ADMIN".equalsIgnoreCase(role) || "OPERATIONS".equalsIgnoreCase(role));
        if (!isStaff) {
            throw new ForbiddenBookingOperationException("An admin or operations account is required.");
        }
    }

    private void requireStaffReadRole(String userId) {
        CustomerAuthService.CustomerView currentUser = customerAuthService.currentCustomer(userId);
        boolean canRead = currentUser.roles().stream().anyMatch(role ->
                "ADMIN".equalsIgnoreCase(role) || "OPERATIONS".equalsIgnoreCase(role)
                        || "FINANCE".equalsIgnoreCase(role));
        if (!canRead) {
            throw new ForbiddenBookingOperationException("A staff account is required to view all bookings.");
        }
    }

    private Booking findOwnedBooking(Long bookingId, Long passengerId) {
        if (bookingId == null) {
            throw new BookingNotFoundException("Booking not found.");
        }
        return bookingRepository.findByIdAndPassenger_Id(bookingId, passengerId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found."));
    }

    private Trip findTrip(Long tripId) {
        if (tripId == null) {
            throw new TripNotFoundException("Trip not found.");
        }
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new TripNotFoundException("Trip not found."));
    }

    private List<Integer> normalizeSeatNumbers(List<Integer> requestedSeats, Integer capacity) {
        if (requestedSeats == null || requestedSeats.isEmpty()) {
            throw new IllegalArgumentException("Select at least one seat.");
        }
        if (capacity == null || capacity < 1) {
            throw new BookingConflictException("This trip has no seats available.");
        }
        if (requestedSeats.size() > capacity) {
            throw new IllegalArgumentException("The selected seat count exceeds this trip's capacity.");
        }

        Set<Integer> uniqueSeats = new HashSet<>();
        for (Integer seatNumber : requestedSeats) {
            if (seatNumber == null || seatNumber < 1 || seatNumber > capacity) {
                throw new IllegalArgumentException("Seat numbers must be between 1 and " + capacity + ".");
            }
            if (!uniqueSeats.add(seatNumber)) {
                throw new IllegalArgumentException("A seat can only be selected once.");
            }
        }
        return List.copyOf(uniqueSeats);
    }

    private void ensureTripCanBeBooked(Trip trip) {
        if (!isTripBookable(trip)) {
            throw new BookingConflictException("This trip is not available for booking.");
        }
    }

    private boolean isTripBookable(Trip trip) {
        return "Scheduled".equalsIgnoreCase(trip.getStatus())
                && trip.getTripDate().atTime(trip.getDepartureTime()).isAfter(LocalDateTime.now());
    }

    private String createBookingReference() {
        String reference;
        do {
            reference = "SM-" + randomCode(12);
        } while (bookingRepository.findByBookingReferenceIgnoreCase(reference).isPresent());
        return reference;
    }

    private String createTicketNumber() {
        String ticketNumber;
        do {
            ticketNumber = "TKT-" + randomCode(12);
        } while (ticketRepository.findByTicketNumberIgnoreCase(ticketNumber).isPresent());
        return ticketNumber;
    }

    private String randomCode(int length) {
        String alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder code = new StringBuilder(length);
        for (int index = 0; index < length; index++) {
            code.append(alphabet.charAt(secureRandom.nextInt(alphabet.length())));
        }
        return code.toString();
    }

    private BookingView toView(Booking booking, List<Ticket> tickets) {
        Trip trip = booking.getTrip();
        return new BookingView(
                booking.getId(),
                booking.getBookingReference(),
                booking.getPassenger().getId(),
                trip.getId(),
                trip.getRoute().getStartLocation(),
                trip.getRoute().getEndLocation(),
                trip.getVehicle().getVehicleNo(),
                trip.getTripDate(),
                trip.getDepartureTime(),
                trip.getArrivalTime(),
                booking.getBookingDate(),
                booking.getSeatCount(),
                booking.getTotalAmount(),
                booking.getBookingStatus(),
                tickets.stream().map(this::toTicketView).toList()
        );
    }

    private TicketView toTicketView(Ticket ticket) {
        return new TicketView(
                ticket.getTicketNumber(),
                Integer.valueOf(ticket.getSeatNumber()),
                ticket.getTicketStatus(),
                ticket.getIssuedAt()
        );
    }

    public record BookingRequest(Long tripId, List<Integer> seatNumbers) {
    }

    public record StaffBookingRequest(Long passengerId, Long tripId, List<Integer> seatNumbers) {
    }

    public record BookingView(
            Long id,
            String bookingReference,
            Long passengerId,
            Long tripId,
            String from,
            String to,
            String vehicle,
            LocalDate date,
            LocalTime departure,
            LocalTime arrival,
            LocalDateTime bookingDate,
            Integer seatCount,
            BigDecimal totalAmount,
            String status,
            List<TicketView> tickets) {
    }

    public record TicketView(String ticketNumber, Integer seatNumber, String status, LocalDateTime issuedAt) {
    }

    public record SeatAvailabilityView(
            Long tripId,
            Integer capacity,
            Integer availableSeats,
            List<Integer> reservedSeats,
            boolean bookable) {
    }

    public static class BookingNotFoundException extends RuntimeException {
        public BookingNotFoundException(String message) {
            super(message);
        }
    }

    public static class TripNotFoundException extends RuntimeException {
        public TripNotFoundException(String message) {
            super(message);
        }
    }

    public static class BookingConflictException extends RuntimeException {
        public BookingConflictException(String message) {
            super(message);
        }
    }

    public static class ForbiddenBookingOperationException extends RuntimeException {
        public ForbiddenBookingOperationException(String message) {
            super(message);
        }
    }
}
