package com.smartmove.backend.service;

import com.smartmove.backend.data.Trip;
import com.smartmove.backend.data.TripRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalDate;

@Service
public class TripCompletionService {

    private final TripRepository tripRepository;
    private final OracleProcedureService oracleProcedureService;

    public TripCompletionService(
            TripRepository tripRepository,
            OracleProcedureService oracleProcedureService) {
        this.tripRepository = tripRepository;
        this.oracleProcedureService = oracleProcedureService;
    }

    @Scheduled(fixedDelay = 60000, initialDelay = 10000)
    public void completeTripsThatHaveArrived() {
        LocalDateTime now = LocalDateTime.now();
        tripRepository.findByStatusIgnoreCaseOrderByTripDateAscDepartureTimeAsc("Scheduled")
                .stream()
                .filter(trip -> !arrivalTime(trip).isAfter(now))
                .forEach(trip -> oracleProcedureService.completeTrip(trip.getId()));
    }

    public void completeArrivedTripsBeforeReadingBookings() {
        completeTripsThatHaveArrived();
    }

    private LocalDateTime arrivalTime(Trip trip) {
        LocalDate arrivalDate = trip.getTripDate();
        if (trip.getArrivalTime().isBefore(trip.getDepartureTime())) {
            arrivalDate = arrivalDate.plusDays(1);
        }
        return arrivalDate.atTime(trip.getArrivalTime());
    }
}
