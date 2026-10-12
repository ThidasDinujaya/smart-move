package com.smartmove.backend.service;

import com.smartmove.backend.Data.Driver;
import com.smartmove.backend.Data.DriverRepository;
import com.smartmove.backend.Data.Route;
import com.smartmove.backend.Data.RouteRepository;
import com.smartmove.backend.Data.Vehicle;
import com.smartmove.backend.Data.VehicleRepository;
import com.smartmove.backend.data.Trip;
import com.smartmove.backend.data.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class TripService {

    private static final String SCHEDULED_STATUS = "Scheduled";
    private static final String CANCELLED_STATUS = "Cancelled";

    private final TripRepository tripRepository;
    private final RouteRepository routeRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final CustomerAuthService customerAuthService;

    public TripService(
            TripRepository tripRepository,
            RouteRepository routeRepository,
            VehicleRepository vehicleRepository,
            DriverRepository driverRepository,
            CustomerAuthService customerAuthService) {
        this.tripRepository = tripRepository;
        this.routeRepository = routeRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.customerAuthService = customerAuthService;
    }

    @Transactional(readOnly = true)
    public List<TripView> searchTrips(String from, String to, LocalDate date) {
        String startLocation = requireText(from, "Starting location is required.");
        String endLocation = requireText(to, "Destination is required.");
        if (date == null) {
            throw new IllegalArgumentException("Trip date is required.");
        }

        return tripRepository
                .findByRoute_StartLocationIgnoreCaseAndRoute_EndLocationIgnoreCaseAndTripDateAndStatusIgnoreCaseOrderByDepartureTimeAsc(
                        startLocation, endLocation, date, SCHEDULED_STATUS)
                .stream()
                .map(this::toView)
                .toList();
    }

    @Transactional(readOnly = true)
    public TripView getTripById(Long id) {
        return toView(findTrip(id));
    }

    @Transactional(readOnly = true)
    public List<TripView> getAllTrips(String token) {
        requireStaffRole(token);
        return tripRepository.findAllByOrderByTripDateAscDepartureTimeAsc()
                .stream()
                .map(this::toView)
                .toList();
    }

    @Transactional
    public TripView createTrip(TripRequest request, String token) {
        requireStaffRole(token);
        Trip trip = new Trip();
        applyRequest(trip, request);
        trip.setId(null);
        return toView(tripRepository.save(trip));
    }

    @Transactional
    public TripView updateTrip(Long id, TripRequest request, String token) {
        requireStaffRole(token);
        Trip trip = findTrip(id);
        applyRequest(trip, request);
        return toView(tripRepository.save(trip));
    }

    @Transactional
    public void cancelTrip(Long id, String token) {
        requireStaffRole(token);
        Trip trip = findTrip(id);
        trip.setStatus(CANCELLED_STATUS);
        tripRepository.save(trip);
    }

    private void applyRequest(Trip trip, TripRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Trip details are required.");
        }
        if (request.routeId() == null || request.vehicleId() == null || request.driverId() == null) {
            throw new IllegalArgumentException("Route, vehicle, and driver are required.");
        }
        if (request.date() == null || request.departure() == null || request.arrival() == null) {
            throw new IllegalArgumentException("Trip date, departure time, and arrival time are required.");
        }
        if (request.departure().equals(request.arrival())) {
            throw new IllegalArgumentException("Departure and arrival times must be different.");
        }
        if (request.seats() == null || request.seats() < 1) {
            throw new IllegalArgumentException("Seat capacity must be at least one.");
        }
        if (request.fare() == null || request.fare().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Fare cannot be negative and is required.");
        }

        Route route = routeRepository.findById(request.routeId())
                .orElseThrow(() -> new TripResourceNotFoundException("Route not found."));
        Vehicle vehicle = vehicleRepository.findById(request.vehicleId())
                .orElseThrow(() -> new TripResourceNotFoundException("Vehicle not found."));
        Driver driver = driverRepository.findById(request.driverId())
                .orElseThrow(() -> new TripResourceNotFoundException("Driver not found."));

        requireAvailable(route.getStatus(), "Route");
        requireAvailable(vehicle.getStatus(), "Vehicle");
        requireAvailable(driver.getStatus(), "Driver");
        if (vehicle.getSeatingCapacity() != null && request.seats() > vehicle.getSeatingCapacity()) {
            throw new IllegalArgumentException("Seat capacity cannot exceed the selected vehicle capacity.");
        }
        if (request.status() != null && request.status().trim().length() > 20) {
            throw new IllegalArgumentException("Trip status must be 20 characters or fewer.");
        }
        if (request.notes() != null && request.notes().length() > 1000) {
            throw new IllegalArgumentException("Trip notes must be 1000 characters or fewer.");
        }

        trip.setRoute(route);
        trip.setVehicle(vehicle);
        trip.setDriver(driver);
        trip.setTripDate(request.date());
        trip.setDepartureTime(request.departure());
        trip.setArrivalTime(request.arrival());
        trip.setSeatCapacity(request.seats());
        trip.setFare(request.fare());
        trip.setStatus(request.status() == null || request.status().isBlank()
                ? SCHEDULED_STATUS
                : request.status().trim());
        trip.setNotes(request.notes() == null || request.notes().isBlank() ? null : request.notes().trim());
    }

    private Trip findTrip(Long id) {
        if (id == null) {
            throw new TripNotFoundException("Trip not found.");
        }
        return tripRepository.findById(id)
                .orElseThrow(() -> new TripNotFoundException("Trip not found."));
    }

    private void requireStaffRole(String token) {
        CustomerAuthService.CustomerView currentUser = customerAuthService.currentCustomer(token);
        boolean isStaff = currentUser.roles().stream().anyMatch(role ->
                "ADMIN".equalsIgnoreCase(role) || "OPERATIONS".equalsIgnoreCase(role));
        if (!isStaff) {
            throw new ForbiddenTripOperationException("An admin or operations account is required.");
        }
    }

    private void requireAvailable(String status, String resourceName) {
        if (status != null && ("inactive".equalsIgnoreCase(status)
                || "maintenance".equalsIgnoreCase(status)
                || "unavailable".equalsIgnoreCase(status))) {
            throw new IllegalArgumentException(resourceName + " is not available for scheduling.");
        }
    }

    private String requireText(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(message);
        }
        return value.trim();
    }

    private TripView toView(Trip trip) {
        Route route = trip.getRoute();
        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();
        return new TripView(
                trip.getId(),
                route.getId(),
                route.getRouteName(),
                route.getStartLocation(),
                route.getEndLocation(),
                vehicle.getId(),
                vehicle.getVehicleNo(),
                vehicle.getVehicleType(),
                driver.getId(),
                driver.getName(),
                trip.getTripDate(),
                trip.getDepartureTime(),
                trip.getArrivalTime(),
                trip.getSeatCapacity(),
                trip.getFare(),
                trip.getStatus(),
                trip.getNotes()
        );
    }

    public record TripRequest(
            Long routeId,
            Long vehicleId,
            Long driverId,
            LocalDate date,
            LocalTime departure,
            LocalTime arrival,
            Integer seats,
            BigDecimal fare,
            String status,
            String notes) {
    }

    public record TripView(
            Long id,
            Long routeId,
            String route,
            String from,
            String to,
            Long vehicleId,
            String vehicle,
            String vehicleType,
            Long driverId,
            String driver,
            LocalDate date,
            LocalTime departure,
            LocalTime arrival,
            Integer seats,
            BigDecimal fare,
            String status,
            String notes) {
    }

    public static class TripNotFoundException extends RuntimeException {
        public TripNotFoundException(String message) {
            super(message);
        }
    }

    public static class TripResourceNotFoundException extends RuntimeException {
        public TripResourceNotFoundException(String message) {
            super(message);
        }
    }

    public static class ForbiddenTripOperationException extends RuntimeException {
        public ForbiddenTripOperationException(String message) {
            super(message);
        }
    }
}
