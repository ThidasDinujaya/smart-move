package com.smartmove.backend.data;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select trip from Trip trip where trip.id = :tripId")
    Optional<Trip> findByIdForUpdate(@Param("tripId") Long tripId);

    List<Trip> findAllByOrderByTripDateAscDepartureTimeAsc();

    List<Trip> findByStatusIgnoreCaseOrderByTripDateAscDepartureTimeAsc(String status);

    List<Trip> findByRoute_StartLocationIgnoreCaseAndRoute_EndLocationIgnoreCaseAndTripDateAndStatusIgnoreCaseOrderByDepartureTimeAsc(
            String startLocation,
            String endLocation,
            LocalDate tripDate,
            String status
    );
}
