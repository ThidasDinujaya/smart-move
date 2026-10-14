
package com.smartmove.backend.Service;

import com.smartmove.backend.Data.Route;
import com.smartmove.backend.Data.RouteRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {

    private final RouteRepository routeRepository;

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    // ADD ROUTE
    public Route addRoute(Route route) {

        validateRoute(route);

        String routeNo = route.getRouteNo().trim();

        if (routeRepository.existsByRouteNoIgnoreCase(routeNo)) {
            throw new IllegalArgumentException(
                    "Route number already exists!"
            );
        }

        route.setId(null);
        route.setRouteNo(routeNo);
        route.setRouteName(route.getRouteName().trim());
        route.setStartLocation(route.getStartLocation().trim());
        route.setEndLocation(route.getEndLocation().trim());

        return routeRepository.save(route);
    }

    // VIEW ALL ROUTES
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    // VIEW ROUTE BY ID
    public Route getRouteById(Long id) {
        return routeRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Route not found with ID: " + id
                        )
                );
    }

    // UPDATE ROUTE
    public Route updateRoute(Long id, Route updatedRoute) {

        Route existingRoute = getRouteById(id);

        validateRoute(updatedRoute);

        String routeNo = updatedRoute.getRouteNo().trim();

        Route duplicate = routeRepository
                .findByRouteNoIgnoreCase(routeNo)
                .orElse(null);

        if (duplicate != null &&
                !duplicate.getId().equals(id)) {
            throw new IllegalArgumentException(
                    "Route number already exists!"
            );
        }

        existingRoute.setRouteNo(routeNo);
        existingRoute.setRouteName(
                updatedRoute.getRouteName().trim()
        );
        existingRoute.setStartLocation(
                updatedRoute.getStartLocation().trim()
        );
        existingRoute.setEndLocation(
                updatedRoute.getEndLocation().trim()
        );
        existingRoute.setDistance(updatedRoute.getDistance());
        existingRoute.setFare(updatedRoute.getFare());
        existingRoute.setEstimatedTime(updatedRoute.getEstimatedTime());
        existingRoute.setDescription(updatedRoute.getDescription());
        existingRoute.setStatus(updatedRoute.getStatus());

        return routeRepository.save(existingRoute);
    }

    // DELETE ROUTE
    public void deleteRoute(Long id) {
        Route route = getRouteById(id);
        routeRepository.delete(route);
    }

    // VALIDATION
    private void validateRoute(Route route) {

        if (route.getRouteNo() == null ||
                route.getRouteNo().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Route number is required!"
            );
        }

        if (route.getRouteName() == null ||
                route.getRouteName().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Route name is required!"
            );
        }

        if (route.getStartLocation() == null ||
                route.getStartLocation().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Start location is required!"
            );
        }

        if (route.getEndLocation() == null ||
                route.getEndLocation().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "End location is required!"
            );
        }

        if (route.getDistance() != null &&
                route.getDistance() < 0) {
            throw new IllegalArgumentException(
                    "Distance cannot be negative!"
            );
        }

        if (route.getFare() != null &&
                route.getFare() < 0) {
            throw new IllegalArgumentException(
                    "Fare cannot be negative!"
            );
        }
    }
}

