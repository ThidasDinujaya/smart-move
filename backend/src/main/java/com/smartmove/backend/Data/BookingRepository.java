package com.smartmove.backend.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingReferenceIgnoreCase(String bookingReference);

    List<Booking> findAllByOrderByBookingDateDesc();

    List<Booking> findByPassenger_IdOrderByBookingDateDesc(Long passengerId);

    Optional<Booking> findByIdAndPassenger_Id(Long bookingId, Long passengerId);

    List<Booking> findByTrip_IdAndBookingStatusIn(Long tripId, Collection<String> bookingStatuses);
}
