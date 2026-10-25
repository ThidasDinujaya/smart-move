package com.smartmove.backend.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Optional<Ticket> findByTicketNumberIgnoreCase(String ticketNumber);

    List<Ticket> findByBooking_IdOrderBySeatNumberAsc(Long bookingId);

    List<Ticket> findByTrip_IdAndTicketStatusIn(Long tripId, Collection<String> ticketStatuses);

    long countByTrip_IdAndTicketStatusIn(Long tripId, Collection<String> ticketStatuses);

    boolean existsByTrip_IdAndSeatNumberIgnoreCaseAndTicketStatusIn(
            Long tripId,
            String seatNumber,
            Collection<String> ticketStatuses
    );
}
