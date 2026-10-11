package com.smartmove.backend.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findAllByOrderByTripDateAscDepartureTimeAsc();

    List<Trip> findByStatusIgnoreCaseOrderByTripDateAscDepartureTimeAsc(String status);

    List<Trip> findByRoute_StartLocationIgnoreCaseAndRoute_EndLocationIgnoreCaseAndTripDateAndStatusIgnoreCaseOrderByDepartureTimeAsc(
            String startLocation,
            String endLocation,
            LocalDate tripDate,
            String status
    );
}
