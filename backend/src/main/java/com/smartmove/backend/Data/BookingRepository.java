package com.smartmove.backend.data;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select booking from Booking booking where booking.id = :bookingId")
    Optional<Booking> findByIdForUpdate(@Param("bookingId") Long bookingId);

    Optional<Booking> findByBookingReferenceIgnoreCase(String bookingReference);

    List<Booking> findAllByOrderByBookingDateDesc();

    List<Booking> findByPassenger_IdOrderByBookingDateDesc(Long passengerId);

    Optional<Booking> findByIdAndPassenger_Id(Long bookingId, Long passengerId);

    List<Booking> findByTrip_IdAndBookingStatusIn(Long tripId, Collection<String> bookingStatuses);

    boolean existsByPassenger_IdAndTrip_IdAndBookingStatus(Long passengerId, Long tripId, String bookingStatus);
}
